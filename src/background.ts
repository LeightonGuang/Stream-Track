import getAppAccessToken from "./chrome-extension/utils/twitchApi/getAppAccessToken";
import getStreamersLive from "./chrome-extension/utils/twitchApi/getStreamersLive";
import validateTwitchToken from "./chrome-extension/utils/twitchApi/validateTwitchToken";

const fetchLiveFlow = async () => {
  try {
    const { followedChannels } =
      await chrome.storage.local.get("followedChannels");

    let { accessToken } = await chrome.storage.local.get("accessToken");

    if (accessToken) {
      const tokenIsValid = await validateTwitchToken(accessToken);

      if (!tokenIsValid) {
        console.error("Token is invalid");
        return;
      }
    } else if (!accessToken) {
      console.log("Access token is null");
      accessToken = await getAppAccessToken();
      await chrome.storage.local.set({ accessToken });
    }

    const channelsLive = await getStreamersLive(followedChannels, accessToken);
    await chrome.storage.local.set({ liveChannels: channelsLive });
    chrome.action.setBadgeBackgroundColor({ color: "#9146FF" });
    chrome.action.setBadgeText({ text: channelsLive.length.toString() });
  } catch (error) {
    console.error("Error fetching live flow:", error);
  }
};

self.addEventListener("install", (event) => {
  console.log("Service worker installed", event);
  fetchLiveFlow();
});

chrome.alarms.create({ periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm fired", alarm);
  fetchLiveFlow();
});
