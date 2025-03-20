import axios from "axios";
import { useState, useEffect } from "react";
import formatViewCount from "../../utils/formatViewCount";

interface ManifestType {
  oauth2?: {
    client_id: string;
    scopes: string[];
    redirect_uri: string;
  };
}

const ListTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [followedChannels, setFollowedChannels] = useState<any[]>([]);
  const [liveChannels, setLiveChannels] = useState<any[]>([]);
  console.log(liveChannels);

  // const getAppAccessToken = async () => {
  //   try {
  //     const response = await axios.get("https://id.twitch.tv/oauth2/token");
  //     return "some access token";
  //   } catch (error) {
  //     console.error("Error getting app access token: ", error);
  //     return "error";
  //   }
  // };

  const getLiveStreamers = async (accessToken: string) => {
    try {
      // const { userId } = await chrome.storage.local.get("userId");

      console.log("followedChannels:", followedChannels);

      const streamerIds = followedChannels
        .slice(0, 100)
        .map((streamer) => streamer.id);
      console.log("streamerIds: ", streamerIds);

      const manifest = chrome.runtime.getManifest() as ManifestType;
      const clientId = manifest.oauth2?.client_id;

      const response: { data: { data: any[] } } = await axios.get(
        "https://api.twitch.tv/helix/streams",
        {
          headers: {
            "Client-Id": clientId,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            user_id: streamerIds,
          },
          paramsSerializer: (params: { [key: string]: any }) => {
            return Object.keys(params)
              .map((key) =>
                Array.isArray(params[key])
                  ? params[key]
                      .map((val) => `${key}=${encodeURIComponent(val)}`)
                      .join("&")
                  : `${key}=${encodeURIComponent(params[key])}`,
              )
              .join("&");
          },
        },
      );

      // console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching streamers live status: ", error);
    }
  };

  const getLiveFlow = async () => {
    // const accessToken = await getAppAccessToken();
    if (followedChannels.length === 0) return;

    const accessToken = "kphaq7v53lvca94svafcbbb1l2it6t";
    const live = await getLiveStreamers(accessToken);
    chrome.action.setBadgeBackgroundColor({ color: "#9146FF" });
    chrome.action.setBadgeText({ text: live ? live.length.toString() : "0" });
    console.log("streamers live: ", live);
    setLiveChannels(live ?? []);
  };

  useEffect(() => {
    chrome.storage.local.get("followedChannels", (result) => {
      const followedChannels = result.followedChannels;
      if (followedChannels) {
        console.log(followedChannels);
        setFollowedChannels(followedChannels);
      }
    });
  }, []);

  useEffect(() => {
    getLiveFlow();
    setIsLoading(false);
  }, [followedChannels]);

  return (
    <div>
      <h2 className="text-base font-bold">Streamers currently live</h2>

      <div className="mt-2">
        {!isLoading
          ? liveChannels.map((liveChannelData) => {
              const channelData = followedChannels.find(
                (channel) =>
                  String(channel.id).trim() ===
                  String(liveChannelData.user_id).trim(),
              );

              return (
                <a
                  key={liveChannelData.user_id}
                  className="flex w-[13.75rem] max-w-[13.75rem] items-center bg-[#1f1e22] px-[0.625rem] py-[0.3125rem] hover:bg-[#27262c]"
                  href={`https://www.twitch.tv/${channelData.display_name}`}
                  target="_blank"
                >
                  <img
                    alt={channelData.display_name}
                    className="h-[1.875rem] w-[1.875rem] rounded-full"
                    src={channelData.profile_image_url}
                  />

                  <div className="ml-[0.625rem] flex w-[11.25rem] max-w-[11.25rem]">
                    <div className="flex flex-grow flex-col">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold leading-[1.05rem] text-[#dedee3]">
                        {channelData.display_name}
                      </p>

                      <p className="max-w-[7rem] overflow-hidden text-ellipsis whitespace-nowrap text-[0.8125rem] font-normal leading-[0.975rem] text-[#adadb8]">
                        {liveChannelData.game_name}
                      </p>
                    </div>

                    <div className="ml-[0.3125rem] h-[2.025rem] flex-shrink-0">
                      <div className="flex h-[1.2188rem] min-w-[2.5rem] items-center gap-[0.3125rem]">
                        <div className="flex h-2 w-2 items-center justify-center rounded-full bg-[#ec0400]" />

                        <span className="flex h-auto items-center text-[0.8125rem] font-normal leading-[1.2188rem] text-[#dedee3]">
                          {formatViewCount(liveChannelData.viewer_count)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          : "Loading..."}
      </div>
    </div>
  );
};

export default ListTab;
