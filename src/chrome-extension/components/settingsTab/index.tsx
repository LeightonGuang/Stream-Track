import getUserId from "../../utils/twitchApi/getUserId";
import { TwitchIcon, YouTubeIcon } from "../../public/icons";
import getAppAccessToken from "../../utils/twitchApi/getAppAccessToken";
import getFollowedChannels from "../../utils/twitchApi/getFollowedChannels";
import getStreamersProfilePics from "../../utils/twitchApi/getStreamersProfilePics";

import { ManifestType } from "../../../types/manifestType";

// TODO : Options to turn off stream preview

const SettingsTab = () => {
  const manifest = chrome.runtime.getManifest() as ManifestType;
  const version = manifest.version;
  console.log(version);
  const clientId = manifest.oauth2?.client_id;

  const handleTwitchLoginButton = async () => {
    // get list of user's followed channels and store in chrome storage
    try {
      const accessToken = await getAppAccessToken();
      if (!accessToken) {
        console.error("No access token");
        return;
      }

      const userId = await getUserId(clientId, accessToken);
      await chrome.storage.local.set({ userId });
      if (!userId) {
        console.error("No user id");
        return;
      }

      const allFollowedChannels = await getFollowedChannels(
        clientId,
        userId,
        accessToken,
      );

      const channelData = await getStreamersProfilePics(
        allFollowedChannels,
        clientId,
        accessToken,
      );

      await chrome.storage.local.set({ followedChannels: channelData });
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
