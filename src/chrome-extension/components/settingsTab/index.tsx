import { useEffect, useState } from "react";
import { TwitchBlackIcon } from "../../public/icons";
import lookUpWTF from "../../public/assets/lookUpWTF.png";
import getUserData from "../../utils/twitchApi/getUserData";
import getStreamersLive from "../../utils/twitchApi/getStreamersLive";
import getAppAccessToken from "../../utils/twitchApi/getAppAccessToken";
import getFollowedChannels from "../../utils/twitchApi/getFollowedChannels";
import getStreamersProfilePics from "../../utils/twitchApi/getStreamersProfilePics";

import { ManifestType } from "../../../types/manifestType";
import { LocalSettingsType } from "../../../types/LocalSettingsType";

const SettingsTab = () => {
  const manifest = chrome.runtime.getManifest() as ManifestType;
  const version = manifest.version;
  const clientId = manifest.oauth2?.client_id;

  const [localSettingsState, setLocalSettingsState] =
    useState<LocalSettingsType>({} as LocalSettingsType);
  const [showClearDataWarningPopup, setShowClearDataWarningPopup] =
    useState(false);

  // get list of user's followed channels and store in chrome storage then fetch live channels
  const handleTwitchLoginButton = async () => {
    try {
      const accessToken = await getAppAccessToken(true);
      await chrome.storage.local.set({ accessToken });
      if (!accessToken) throw new Error("Error getting access token");

      const userData = await getUserData(clientId, accessToken);
      await chrome.storage.local.set({ userData });
      if (!userData?.id) {
        console.error("No user id");
        return;
      }

      const allFollowedChannels = await getFollowedChannels(
        clientId,
        userData.id,
        accessToken,
      );

      const channelData = await getStreamersProfilePics(
        allFollowedChannels,
        clientId,
        accessToken,
      );

      await chrome.storage.local.set({ followedChannels: channelData });

      const liveChannels = await getStreamersLive(channelData, accessToken);
      if (liveChannels.length > 0) {
        chrome.action.setBadgeBackgroundColor({ color: "#9146ff" });
        chrome.action.setBadgeText({ text: liveChannels.length.toString() });
        await chrome.storage.local.set({ liveChannels: liveChannels });
      }
    } catch (error) {
      console.error("Error during login flow", error);
    }
  };

  const handleClearStorage = async () => {
    await chrome.storage.local.remove([
      "userId",
      "accessToken",
      "liveChannels",
      "followedChannels",
    ]);
    chrome.action.setBadgeText({ text: "" });
    console.log("Storage cleared");

    setShowClearDataWarningPopup(false);
  };

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
            className="flex w-max gap-1 rounded-lg bg-twitch px-2 py-1"
            onClick={handleTwitchLoginButton}
          >
            <TwitchBlackIcon className="w-4" />
            <span className="font-medium">Login with Twitch</span>
          </button>
        </div>

        <div className="my-2 flex flex-col gap-2">
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

        {showClearDataWarningPopup ? (
          <div className="flex flex-col gap-2 rounded-lg border border-red-800 p-1">
            <p className="whitespace-pre-wrap text-xs">
              Are you sure you want to clear all data?
              <span className="text-red-700">
                (This will remove all saved streamer information and log you out
                of Twitch.)
              </span>
            </p>

            <div className="flex gap-2">
              <button
                className="w-full rounded-lg bg-gray-700 py-1 font-medium hover:bg-gray-800"
                onClick={() => {
                  setShowClearDataWarningPopup(false);
                }}
              >
                Cancel
              </button>

              <button
                className="w-full rounded-lg bg-red-600 py-1 font-medium hover:bg-red-700"
                onClick={handleClearStorage}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <button
            className="w-max rounded-lg bg-red-600 px-2 py-1 font-medium"
            onClick={() => {
              setShowClearDataWarningPopup(true);
            }}
          >
            Clear All Data
          </button>
        )}

        <a
          className="hover my-2 flex w-max"
          href="https://ko-fi.com/V7V71CLGEB"
          target="_blank"
        >
          <img
            className="h-[1.625rem] object-contain"
            src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>

        <img alt="emote" className="mt-4 w-8 object-cover" src={lookUpWTF} />
      </div>
    </div>
  );
};

export default SettingsTab;
