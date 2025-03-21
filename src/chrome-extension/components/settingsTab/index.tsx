import axios from "axios";
import { TwitchIcon, YouTubeIcon } from "../../public/icons";
import generateRandomState from "../../utils/generateRandomState";

interface ManifestType {
  oauth2?: {
    client_id: string;
    scopes: string[];
    redirect_uri: string;
  };
}

interface FollowedChannelsType {
  broadcaster_id: string;
  broadcaster_name: string;
}

const SettingsTab = () => {
  const manifest = chrome.runtime.getManifest() as ManifestType;
  const clientId = manifest.oauth2?.client_id;
  const redirectUri = chrome.identity.getRedirectURL();

  const handleTwitchLoginButton = async () => {
    // get list of user's followed channels and store in chrome storage

    const getAccessToken = async (): Promise<string | null> => {
      // launch web auth flow to get access token
      return new Promise((resolve, reject) => {
        const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=user:read:follows&state=${generateRandomState()}`;
        chrome.identity.launchWebAuthFlow(
          { url: authUrl, interactive: true },
          (redirectUrl) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              reject(chrome.runtime.lastError.message);
              return;
            }

            if (redirectUrl) {
              const params = new URLSearchParams(
                new URL(redirectUrl).hash.substring(1),
              );
              const accessToken = params.get("access_token");
              resolve(accessToken || null);
            } else {
              reject("No redirect URL found");
            }
          },
        );
      });
    };

    const getUserId = async (accessToken: string) => {
      try {
        const response: { data: { data: any[] } } = await axios.get(
          "https://api.twitch.tv/helix/users",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId,
            },
          },
        );

        const userId = response.data.data[0].id;
        return userId;
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    const getFollowedChannels = async (userId: string, accessToken: string) => {
      interface FollowingsType {
        total: number;
        data: any[];
        pagination: { cursor: string | null };
      }

      try {
        const followings: FollowedChannelsType[] = [];
        let cursor = null;

        do {
          const response: { data: FollowingsType } = await axios.get(
            "https://api.twitch.tv/helix/channels/followed",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": clientId,
              },
              params: {
                user_id: userId,
                first: 100,
                after: cursor,
              },
            },
          );

          cursor = response.data.pagination.cursor || null;

          followings.push(
            ...response.data.data.map(
              ({ broadcaster_id, broadcaster_name }) => ({
                broadcaster_id,
                broadcaster_name,
              }),
            ),
          );
        } while (cursor);

        return followings;
      } catch (error) {
        console.error("Error fetching followed channels:", error);
        return [];
      }
    };

    const getStreamersProfilePics = async (
      followedChannels: FollowedChannelsType[],
      accessToken: string,
    ) => {
      interface ChannelDataType {
        id: string;
        display_name: string;
        profile_image_url: string;
      }

      try {
        const chunkSize = 100;

        const chunks = Array.from(
          { length: Math.ceil(followedChannels.length / chunkSize) },
          (_, i) =>
            followedChannels
              .slice(i * chunkSize, i * chunkSize + chunkSize)
              .map((channel) => channel.broadcaster_id),
        );

        const responses = await Promise.all(
          chunks.map(async (ids) => {
            const response: { data: { data: any[] } } = await axios.get(
              "https://api.twitch.tv/helix/users",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Client-Id": clientId,
                },
                params: { id: ids },
                paramsSerializer: (params) =>
                  Object.entries(params)
                    .flatMap(([key, value]) =>
                      Array.isArray(value)
                        ? value.map((v) => `${key}=${encodeURIComponent(v)}`)
                        : `${key}=${encodeURIComponent(value)}`,
                    )
                    .join("&"),
              },
            );

            return response.data.data.map(
              ({ id, display_name, profile_image_url }: ChannelDataType) => ({
                id,
                display_name,
                profile_image_url,
              }),
            );
          }),
        );

        const allProfiles = responses.flat();
        return allProfiles;
      } catch (error) {
        console.error("Error fetching streamers profile pics:", error);
      }
    };

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error("No access token");
        return;
      }

      const userId = await getUserId(accessToken);
      chrome.storage.local.set({ userId });
      if (!userId) {
        console.error("No user id");
        return;
      }

      const allFollowedChannels = await getFollowedChannels(
        userId,
        accessToken,
      );

      const channelData = await getStreamersProfilePics(
        allFollowedChannels,
        accessToken,
      );
      chrome.storage.local.set({ followedChannels: channelData });
    } catch (error) {
      console.error("Error during login flow", error);
    }
  };

  const handleYoutubeLoginButton = () => {
    console.log("Youtube button clicked");
  };

  return (
    <div className="flex h-full w-dvw">
      <div className="p-2">
        <h2 className="text-base font-bold">Settings</h2>

        <div className="mt-2 flex flex-col gap-2">
          <button
            className="flex w-max gap-1 rounded-md bg-twitch px-2 py-1"
            onClick={handleTwitchLoginButton}
          >
            <TwitchIcon className="w-4" />
            <span className="font-medium">Login with Twitch</span>
          </button>

          <button
            className="flex w-max gap-1 rounded-md bg-youtube px-2 py-1"
            onClick={handleYoutubeLoginButton}
          >
            <YouTubeIcon className="w-4" />
            <span className="font-medium">Login with Youtube</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
