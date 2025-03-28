import { useEffect, useState } from "react";
import { TwitchBlackIcon } from "../../public/icons";
import getUserId from "../../utils/twitchApi/getUserId";
import lookUpWTF from "../../public/assets/lookUpWTF.png";
import getAppAccessToken from "../../utils/twitchApi/getAppAccessToken";
import getFollowedChannels from "../../utils/twitchApi/getFollowedChannels";
import getStreamersProfilePics from "../../utils/twitchApi/getStreamersProfilePics";

import { ManifestType } from "../../../types/manifestType";
import { LocalSettingsType } from "../../../types/LocalSettingsType";

// TODO : Options to turn off stream preview

const SettingsTab = () => {
  const manifest = chrome.runtime.getManifest() as ManifestType;
  const version = manifest.version;
  const clientId = manifest.oauth2?.client_id;

  const [localSettingsState, setLocalSettingsState] =
    useState<LocalSettingsType>({} as LocalSettingsType);

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

  // const handleYoutubeLoginButton = () => {
  //   console.log("Youtube button clicked");
  // };

  const handleStreamPreviewToggle = async () => {
    setLocalSettingsState({
      ...localSettingsState,
      streamPreview: !localSettingsState.streamPreview,
    });

    await chrome.storage.local.set({
      localSettings: {
        ...localSettingsState,
        streamPreview: !localSettingsState.streamPreview,
      },
    });
  };

  useEffect(() => {
    const fetchAndSetLocalSettings = async () => {
      try {
        const { localSettings } =
          await chrome.storage.local.get("localSettings");
        console.log("localSettings: ", localSettings);

        if (!localSettings || Object.keys(localSettings).length === 0) {
          // set local settings to default values
          setLocalSettingsState({ streamPreview: false });
          await chrome.storage.local.set({
            localSettings: { streamPreview: false },
          });
        } else if (localSettings) {
          setLocalSettingsState(localSettings);
        }
      } catch (error) {
        console.error("Error fetching and setting local settings", error);
      }
    };
    fetchAndSetLocalSettings();
  }, []);

  useEffect(() => {
    console.log(localSettingsState);
  }, [localSettingsState]);

  return (
    <div className="flex h-max max-h-[calc(2.65rem*10)] w-dvw max-w-[15rem] bg-background">
      <div className="w-full p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Settings</h2>
          <span className="text-xs text-gray-500">v{version}</span>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <button
            className="flex w-max gap-1 rounded-md bg-twitch px-2 py-1"
            onClick={handleTwitchLoginButton}
          >
            <TwitchBlackIcon className="w-4" />
            <span className="font-medium">Login with Twitch</span>
          </button>
          {/* 
          <button
            className="flex w-max gap-1 rounded-md bg-youtube px-2 py-1"
            onClick={handleYoutubeLoginButton}
          >
            <YouTubeIcon className="w-4" />
            <span className="font-medium">Login with Youtube</span>
          </button> */}
        </div>

        <div className="mt-2 flex flex-col gap-2">
          <div className="flex flex-col">
            <label
              className="flex w-min cursor-pointer items-center gap-2 text-sm"
              htmlFor="streamPreview"
            >
              <input
                className="h-min w-min cursor-pointer"
                type="checkbox"
                id="streamPreview"
                name="streamPreview"
                checked={localSettingsState.streamPreview}
                onChange={handleStreamPreviewToggle}
              />
              <span className="whitespace-nowrap">Stream Preview</span>
            </label>

            <p className="flex flex-wrap whitespace-normal text-xs text-gray-500">
              Hover on streamer card to show stream preview.
            </p>
          </div>
        </div>

        <img alt="emote" className="mt-4 w-8 object-cover" src={lookUpWTF} />
      </div>
    </div>
  );
};

export default SettingsTab;
