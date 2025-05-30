import StreamerCard from "../../StreamerCard";
import { useState, useEffect } from "react";
import { SortIcon } from "../../../public/icons";
import getStreamersLive from "../../../utils/twitchApi/getStreamersLive";
import getUserAccessToken from "../../../utils/twitchApi/getUserAccessToken";
import validateTwitchToken from "../../../utils/twitchApi/validateTwitchToken";

import { LiveChannelType } from "../../../../types/liveChannelType";
import { ChromeStorageFollowedChannelsType } from "../../../../types/ChromeStorageFollowedChannelsType";

const FollowingTab = () => {
  // followedChannels is for streamers profile pictures
  const [accessToken, setAccessToken] = useState<string | undefined | null>("");
  const [followedChannels, setFollowedChannels] = useState<
    ChromeStorageFollowedChannelsType[]
  >([]);
  const [liveChannels, setLiveChannels] = useState<LiveChannelType[]>([]);
  const [sortBy, setSortBy] = useState<string>("viewers");
  const [sortedLiveChannels, setSortedLiveChannels] = useState<
    LiveChannelType[]
  >([]);

  const sortLiveChannel = (
    sortCategory: string,
    channels: LiveChannelType[],
  ): LiveChannelType[] => {
    if (sortCategory === "viewers") {
      const sortedViewers = channels.sort(
        (a, b) => b.viewer_count - a.viewer_count,
      );
      return sortedViewers;
    } else if (sortCategory === "channelName") {
      const sortedChannelName = channels.sort((a, b) =>
        a.user_name.localeCompare(b.user_name),
      );
      return sortedChannelName;
    } else if (sortCategory === "game") {
      const sortedGame = channels.sort((a, b) =>
        a.game_name.localeCompare(b.game_name),
      );
      return sortedGame;
    } else {
      return channels;
    }
  };

  const handleSortButton = () => {
    if (sortBy === "viewers") {
      setSortBy("game");
      setSortedLiveChannels(sortLiveChannel("game", liveChannels));
    } else if (sortBy === "game") {
      setSortBy("channelName");
      setSortedLiveChannels(sortLiveChannel("channelName", liveChannels));
    } else if (sortBy === "channelName") {
      setSortBy("viewers");
      setSortedLiveChannels(sortLiveChannel("viewers", liveChannels));
    }
  };

  const initiateProcess = async () => {
    try {
      const { accessToken: localAccessToken } =
        await chrome.storage.local.get("accessToken");
      setAccessToken(localAccessToken);

      if (!localAccessToken) {
        console.log("No access token found locally");
        return;
      }

      const tokenIsValid = await validateTwitchToken(localAccessToken);

      if (!tokenIsValid) {
        console.error("Token is invalid");
        console.log("Getting new access token...");
        const newAccessToken = await getUserAccessToken(false);
        setAccessToken(newAccessToken);
        await chrome.storage.local.set({ accessToken: newAccessToken });
      }

      if (followedChannels.length === 0) {
        console.log("No followed channels found");
        chrome.action.setBadgeBackgroundColor({ color: "#9146FF" });
        chrome.action.setBadgeText({ text: "0" });
        setLiveChannels([]);
        return;
      }

      const live = await getStreamersLive(followedChannels, localAccessToken);
      await chrome.storage.local.set({ liveChannels: live });
      chrome.action.setBadgeBackgroundColor({ color: "#9146FF" });
      chrome.action.setBadgeText({ text: live ? live.length.toString() : "0" });
      setLiveChannels(live);
    } catch (error) {
      console.error("Error running processTasks: ", error);
    }
  };

  useEffect(() => {
    const fetchLocalData = async () => {
      const {
        liveChannels: localLiveChannels,
        followedChannels: localFollowedChannels,
      } = await chrome.storage.local.get(["liveChannels", "followedChannels"]);

      if (localLiveChannels) {
        setLiveChannels(localLiveChannels);
        const sortedLiveChannels = sortLiveChannel(sortBy, localLiveChannels);
        setSortedLiveChannels(sortedLiveChannels);
      }
      if (localFollowedChannels) setFollowedChannels(localFollowedChannels);
    };
    fetchLocalData();
  }, []);

  useEffect(() => {
    initiateProcess();
  }, [followedChannels]);

  // sort liveChannels whenever liveChannels updates
  useEffect(() => {
    if (liveChannels.length === 0) return;
    const sortedLiveChannels = sortLiveChannel(sortBy, liveChannels);
    setSortedLiveChannels(sortedLiveChannels);
  }, [liveChannels, sortBy]);

  return (
    <div className="flex h-min flex-col items-center">
      {sortedLiveChannels.length > 0 ? (
        <>
          <div className="w-full">
            <button
              className="flex w-full items-center justify-between bg-[#1f1e22] hover:bg-[#302f35]"
              onClick={() => {
                handleSortButton();
              }}
            >
              <div className="m-[0.625rem] flex flex-col items-start">
                <h3 className="text-[0.8125rem] font-semibold leading-[0.975rem] text-[#EFEFF1]">
                  FOLLOWED CHANNELS
                </h3>
                <p className="text-[0.8125rem] font-normal leading-[1.2188rem] text-[#ADADB8]">
                  {sortBy === "viewers"
                    ? "Viewers (High to Low)"
                    : sortBy === "channelName"
                      ? "Channel Name (A-Z)"
                      : sortBy === "game"
                        ? "Game (A-Z)"
                        : ""}
                </p>
              </div>

              <div className="mr-[0.625rem] h-[1.25rem] w-[1.25rem] pr-[0.3125rem]">
                <SortIcon className="h-[1.25rem] w-[1.25rem] text-white" />
              </div>
            </button>
          </div>

          <div className="flex max-h-[calc(2.65rem*10)] flex-col overflow-y-auto overflow-x-hidden">
            {sortedLiveChannels.map((liveChannelData: LiveChannelType) => {
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
            })}
          </div>
        </>
      ) : !accessToken ? (
        <span className="whitespace-pre-wrap p-2 text-[0.8125rem] text-red-700">
          It looks like you are not logged in. You can log in by going to the
          Settings tab
        </span>
      ) : followedChannels.length === 0 ? (
        <span className="whitespace-pre-wrap p-2 text-[0.8125rem] text-gray-500">
          It looks like you are not following any channels
        </span>
      ) : (
        followedChannels.length > 0 &&
        liveChannels.length === 0 && (
          <span className="whitespace-pre-wrap p-2 text-[0.8125rem] text-gray-500">
            It looks like none of your followed channels are live at the moment
          </span>
        )
      )}
    </div>
  );
};

export default FollowingTab;
