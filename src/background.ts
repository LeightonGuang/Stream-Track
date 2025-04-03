import getStreamersLive from "./chrome-extension/utils/twitchApi/getStreamersLive";
import getUserAccessToken from "./chrome-extension/utils/twitchApi/getUserAccessToken";
import validateTwitchToken from "./chrome-extension/utils/twitchApi/validateTwitchToken";

const fetchLiveFlow = async () => {
  try {
    const { followedChannels } =
      await chrome.storage.local.get("followedChannels");

    if (!followedChannels) {
      console.log("No followed channels found");
      return;
    }
    console.log("followedChannels: ", followedChannels);

    let { accessToken } = await chrome.storage.local.get("accessToken");
    console.log("accessToken local: ", accessToken);

    if (accessToken) {
      const tokenIsValid = await validateTwitchToken(accessToken);
      if (!tokenIsValid) {
        console.log("Token is invalid");
        accessToken = await getUserAccessToken(false);
        if (accessToken) {
          console.log("Access token successfully fetched");
          await chrome.storage.local.set({ accessToken });
        } else {
          throw new Error("Failed to fetch access token");
        }
      }
    } else if (!accessToken) {
      console.log("No access token found locally");
      accessToken = await getUserAccessToken(false);
      if (accessToken) {
        console.log("Access token successfully fetched");
        await chrome.storage.local.set({ accessToken });
      } else {
        throw new Error("Failed to fetch access token");
      }
    }

    const channelsLive = await getStreamersLive(followedChannels, accessToken);
    console.log("channelsLive: ", channelsLive);
    await chrome.storage.local.set({ liveChannels: channelsLive });
    chrome.action.setBadgeBackgroundColor({ color: "#9146FF" });
    chrome.action.setBadgeText({ text: channelsLive.length.toString() });
  } catch (error) {
    console.error("Error: ", error);
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
