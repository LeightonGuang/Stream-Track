import axios from "axios";
import { TwitchIcon, YouTubeIcon } from "../../public/icons";

interface ManifestType {
  oauth2?: {
    client_id: string;
    scopes: string[];
    redirect_uri: string;
  };
}

const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};

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
        const followings = [];
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
          followings.push(...response.data.data);
        } while (cursor);

        console.log(followings);
        return followings;
      } catch (error) {
        console.error("Error fetching followed channels:", error);
        return [];
      }
    };

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error("No access token");
        return;
      }

      const userId = await getUserId(accessToken);
      if (!userId) {
        console.error("No user id");
        return;
      }

      const followedChannels = await getFollowedChannels(userId, accessToken);
      console.log(followedChannels);
      chrome.storage.local.set({ followedChannels });
    } catch (error) {
      console.error("Error during login flow", error);
    }
  };

  const handleYoutubeLoginButton = () => {
    console.log("Youtube button clicked");
  };

  return (
    <div>
      <h2 className="text-base font-bold">Settings</h2>

      <div className="mt-2 flex flex-col gap-1">
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
  );
};

export default SettingsTab;
