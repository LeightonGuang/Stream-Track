import StreamerCard from "../StreamerCard";
import { useState, useEffect } from "react";
import getStreamersLive from "../../utils/twitchApi/getStreamersLive";
import getAppAccessToken from "../../utils/twitchApi/getAppAccessToken";
import validateTwitchToken from "../../utils/twitchApi/validateTwitchToken";

import { LiveChannelType } from "../../../types/liveChannelType";
import { ChromeStorageFollowedChannelsType } from "../../../types/ChromeStorageFollowedChannelsType";

const FollowingTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  // followedChannels is for streamers profile pictures
  const [followedChannels, setFollowedChannels] = useState<
    ChromeStorageFollowedChannelsType[]
  >([]);
  const [liveChannels, setLiveChannels] = useState<any[]>([]);

  const processTasks = async () => {
    try {
      let { accessToken } = await chrome.storage.local.get("accessToken");

      if (accessToken) {
        const tokenIsValid = await validateTwitchToken(accessToken);

        if (!tokenIsValid) {
          console.error("Token is invalid");
          accessToken = await getAppAccessToken();
          await chrome.storage.local.set({ accessToken });
        }
      } else if (!accessToken) {
        console.log("Access token is null");
        accessToken = await getAppAccessToken();
        await chrome.storage.local.set({ accessToken });
      }

      if (followedChannels.length === 0) return;
      const live = await getStreamersLive(followedChannels, accessToken);
      await chrome.storage.local.set({ liveChannels: live });
      chrome.action.setBadgeBackgroundColor({ color: "#9146FF" });
      chrome.action.setBadgeText({ text: live ? live.length.toString() : "0" });
      console.log("streamers live: ", live);
      setLiveChannels(live ?? []);
    } catch (error) {
      console.error("Error running processTasks: ", error);
    }
  };

  useEffect(() => {
    const fetchLocalData = async () => {
      const { liveChannels, followedChannels } = await chrome.storage.local.get(
        ["liveChannels", "followedChannels"],
      );
      setLiveChannels(liveChannels ?? []);
      setFollowedChannels(followedChannels ?? []);
    };
    fetchLocalData();
  }, []);

  useEffect(() => {
    processTasks();
    setIsLoading(false);
  }, [followedChannels]);

  return (
    <div className="flex h-min max-h-[calc(2.65rem*10)] flex-col items-center overflow-y-auto overflow-x-hidden">
      {!isLoading
        ? liveChannels.map((liveChannelData: LiveChannelType) => {
            const channelData = followedChannels.find(
              (channel) =>
                String(channel.id).trim() ===
                String(liveChannelData.user_id).trim(),
            );

            return (
              <StreamerCard
                key={liveChannelData.user_id}
                liveChannelData={liveChannelData}
                channelData={channelData}
              />
            );
          })
        : "Loading..."}
    </div>
  );
};

export default FollowingTab;
