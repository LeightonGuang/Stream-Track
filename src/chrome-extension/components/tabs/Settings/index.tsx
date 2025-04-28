import { useEffect, useState } from "react";
import { TwitchBlackIcon } from "../../../public/icons";
import lookUpWTF from "../../../public/assets/lookUpWTF.png";
import getUserData from "../../../utils/twitchApi/getUserData";
import getStreamersLive from "../../../utils/twitchApi/getStreamersLive";
import getUserAccessToken from "../../../utils/twitchApi/getUserAccessToken";
import getFollowedChannels from "../../../utils/twitchApi/getFollowedChannels";
import getStreamersProfilePics from "../../../utils/twitchApi/getStreamersProfilePics";

import { ManifestType } from "../../../../types/manifestType";
import { LocalSettingsType } from "../../../../types/LocalSettingsType";

const SettingsTab = () => {
  const manifest = chrome.runtime.getManifest() as ManifestType;
  const version = manifest.version;
  const clientId = manifest.oauth2?.client_id;

  const [userData, setUserData] = useState<
    | {
        id: string;
        profile_image_url: string;
        name: string;
      }
    | undefined
  >(undefined);
  const [localSettingsState, setLocalSettingsState] =
    useState<LocalSettingsType>({} as LocalSettingsType);
  const [showClearDataWarningPopup, setShowClearDataWarningPopup] =
    useState(false);

  // get list of user's followed channels and store in chrome storage then fetch live channels
  const handleTwitchLoginButton = async () => {
    try {
      // force login if not logged in
      console.log("login userData: ", userData);
      const isLoggedIn = userData !== undefined;
      const accessToken = await getUserAccessToken(!isLoggedIn);
      await chrome.storage.local.set({ accessToken });
      if (!accessToken) throw new Error("Error getting access token");

      const newUserData = await getUserData(clientId, accessToken);
      if (!newUserData) {
        console.error("No user data");
        return;
      }
      await chrome.storage.local.set({ userData: newUserData });
      setUserData(newUserData);

      const allFollowedChannels = await getFollowedChannels(
        clientId,
        newUserData.id,
        accessToken,
      );

      const channelData = await getStreamersProfilePics(
        allFollowedChannels,
        clientId,
        accessToken,
      );

      if (!channelData) {
        console.error("No channel data");
        return;
      }

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
  const handleClearAllDataButton = async () => {
    await chrome.storage.local.remove([
      "userData",
      "accessToken",
      "liveChannels",
      "followedChannels",
    ]);
    chrome.action.setBadgeText({ text: "" });
    setUserData(undefined);
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
        const { userData } = await chrome.storage.local.get("userData");
        setUserData(userData);

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
    <div className="h-max max-h-[calc(2.65rem*10)] w-dvw max-w-[15rem] bg-background">
      <div className="flex h-full w-full flex-col justify-between p-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Settings</h2>

            {userData && (
              <a
                className="flex items-center gap-2 rounded-[0.25rem] p-[0.3125rem] hover:bg-[#38393e]"
                href={`https:twitch.tv/${userData.name}`}
                target="_blank"
                title="Navigate to your Twitch profile"
              >
                <img
                  alt={userData.name}
                  className="h-[1.875rem] w-[1.875rem] rounded-full"
                  src={userData.profile_image_url}
                />
                <span className="text-[0.8125rem] font-semibold">
                  {userData.name}
                </span>
              </a>
            )}
          </div>

          <button
            className="mt-2 flex w-max gap-1 rounded-lg bg-twitch px-2 py-1"
            onClick={handleTwitchLoginButton}
          >
            <TwitchBlackIcon className="w-4" />
            <span className="font-medium">
              {userData ? "Update followed channels" : "Login with Twitch"}
            </span>
          </button>

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

            <div className="whitespace-pre-wrap text-gray-500">
              Manage your followed channels locally in the extension options.
              Access this page by right-clicking on the extension icon.
            </div>
          </div>

          {showClearDataWarningPopup ? (
            <div className="flex flex-col gap-2 rounded-lg border border-red-800 p-1">
              <p className="whitespace-pre-wrap text-xs">
                Are you sure you want to clear all data?
                <span className="text-red-700">
                  (This will remove all saved streamer information and log you
                  out of Twitch.)
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
                  onClick={handleClearAllDataButton}
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
        </div>

        <div className="mt-2 w-full">
          <div className="flex flex-col items-center gap-2">
            <p className="flex w-full flex-wrap justify-center whitespace-normal text-xs text-gray-500">
              Support me by buying me a
              <a
                className="mx-1 underline underline-offset-1 hover:text-gray-400"
                href="https://ko-fi.com/V7V71CLGEB"
                target="_blank"
              >
                coffee
              </a>
              (or Two, or Three...)
            </p>

            <span className="text-xs text-gray-500">v{version}</span>

            <img alt="emote" className="w-8 object-cover" src={lookUpWTF} />

            <button
              onClick={() => {
                chrome.runtime.openOptionsPage();
              }}
            >
              Option Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
