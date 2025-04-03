import "../global.css";
import { useEffect, useState } from "react";
import SettingsTab from "../components/settingsTab";
import FollowingTab from "../components/FollowingTab";

import { ChromeStorageFollowedChannelsType } from "../../types/ChromeStorageFollowedChannelsType";

const Options = () => {
  const [activeTab, setActiveTab] = useState<
    "followedChannels" | "liveChannels" | "localSettings"
  >("followedChannels");
  const [followedChannels, setFollowedChannels] = useState<
    ChromeStorageFollowedChannelsType[]
  >([]);

  const handleRemoveButton = async (channelId: string): Promise<void> => {
    const streamer = followedChannels?.find((obj) => obj.id === channelId);

    if (
      window.confirm(
        `Are you sure you want to remove **${streamer?.display_name}** from your following list? 
(This will not affect your following list on twitch.tv)`,
      )
    ) {
      const newFollowedChannels = followedChannels?.filter(
        (obj) => obj.id !== channelId,
      );

      setFollowedChannels(newFollowedChannels);
      await chrome.storage.local.set({ followedChannels: newFollowedChannels });
    } else {
      console.log("Cancel button clicked");
    }
  };

  useEffect(() => {
    const fetchLocalData = async () => {
      const { followedChannels } = await chrome.storage.local.get([
        "followedChannels",
      ]);

      console.log(followedChannels);
      setFollowedChannels(followedChannels);
    };

    fetchLocalData();
  }, []);

  return (
    <div className="max-w-dvw flex h-full flex-col">
      <div className="flex h-[3.125rem] w-full items-center justify-between bg-[#18181a]">
        <div className="h-full text-lg font-semibold">
          <button
            className={`h-full border-b-[0.125rem] border-[#18181a] px-[1.25rem] ${activeTab === "followedChannels" && "border-[#bc98f1] text-[#bc98f1]"}`}
            onClick={() => setActiveTab("followedChannels")}
          >
            Followed Channels
          </button>
          <button
            className={`h-full border-b-[0.125rem] border-[#18181a] px-[1.25rem] ${activeTab === "liveChannels" && "border-[#bc98f1] text-[#bc98f1]"}`}
            onClick={() => setActiveTab("liveChannels")}
          >
            Live Channels
          </button>
          <button
            className={`h-full border-b-[0.125rem] border-[#18181a] px-[1.25rem] ${activeTab === "localSettings" && "border-[#bc98f1] text-[#bc98f1]"}`}
            onClick={() => setActiveTab("localSettings")}
          >
            Settings
          </button>
        </div>

        <h2 className="px-[1.25rem] text-sm text-gray-500">Local Data</h2>
      </div>

      <div className="h-full w-full">
        {(() => {
          switch (activeTab) {
            case "followedChannels": {
              return (
                <div className="flex h-full w-full justify-center">
                  <div className="flex w-full justify-center">
                    <div className="h-[calc(100dvh-4rem)] overflow-y-auto">
                      {followedChannels.length > 0 ? (
                        <table className="mr-2 table-auto border border-white">
                          <thead>
                            <tr>
                              <th className="whitespace-nowrap py-4 pr-2 text-left">
                                Profile Pic
                              </th>
                              <th className="whitespace-nowrap py-4 pr-2 text-left">
                                Name
                              </th>
                              <th className="whitespace-nowrap py-4 pr-2 text-left">
                                Id
                              </th>
                              <th className="whitespace-nowrap py-4 pr-2 text-left">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {followedChannels.map(
                              (channel: ChromeStorageFollowedChannelsType) => (
                                <tr
                                  className="border border-white"
                                  key={channel.id}
                                >
                                  <td className="pr-2">
                                    <img
                                      src={channel.profile_image_url}
                                      alt={channel.display_name}
                                      className="m-1 h-8 w-8 rounded-full"
                                    />
                                  </td>
                                  <td className="pr-2">
                                    <a
                                      className="hover:border-b hover:border-[#a970ff]"
                                      href={`https://twitch.tv/${channel.display_name}`}
                                      target="_blank"
                                    >
                                      {channel.display_name}
                                    </a>
                                  </td>
                                  <td className="pr-2">{channel.id}</td>
                                  <td className="pr-2">
                                    <button
                                      className="rounded-l-full rounded-r-full bg-red-500 px-2 py-1"
                                      onClick={() =>
                                        handleRemoveButton(channel.id)
                                      }
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      ) : (
                        <div className="border border-white p-2">
                          <span>No Followed Channels</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            case "liveChannels": {
              return (
                <div className="flex h-full w-full justify-center">
                  <FollowingTab />
                </div>
              );
            }
            case "localSettings": {
              return (
                <div className="flex h-full w-full justify-center">
                  <SettingsTab />
                </div>
              );
            }
          }
        })()}
      </div>
    </div>
  );
};

export default Options;
