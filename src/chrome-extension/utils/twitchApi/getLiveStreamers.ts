import axios from "axios";
import { ManifestType } from "../../../types/manifestType";
import { FollowedChannelsType } from "../../../types/FollowedChannelsType";

// get streamers that are live
const getLiveStreamers = async (
  followedChannels: FollowedChannelsType[],
  accessToken: string,
): Promise<any[]> => {
  try {
    const manifest = chrome.runtime.getManifest() as ManifestType;
    const clientId = manifest.oauth2?.client_id;

    const chunkSize = 100;
    const streamerIdChunks = Array.from(
      { length: Math.ceil(followedChannels.length / chunkSize) },
      (_, i) =>
        followedChannels
          .slice(i * chunkSize, i * chunkSize + chunkSize)
          .map((streamer) => streamer.id),
    );

    const allRequests = streamerIdChunks.map(async (chunk) => {
      const response: { data: { data: any[] } } = await axios.get(
        "https://api.twitch.tv/helix/streams",
        {
          headers: {
            "Client-Id": clientId,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            user_id: chunk,
          },
          paramsSerializer: (params: { [key: string]: any }) =>
            Object.keys(params)
              .map((key) =>
                Array.isArray(params[key])
                  ? params[key]
                      .map((val) => `${key}=${encodeURIComponent(val)}`)
                      .join("&")
                  : `${key}=${encodeURIComponent(params[key])}`,
              )
              .join("&"),
        },
      );

      return response.data.data;
    });

    // Flatten the results into a single array
    const allResults = (await Promise.all(allRequests)).flat();

    console.log("streamers live: ", allResults);
    return allResults;
  } catch (error) {
    console.error("Error fetching streamers live status: ", error);
    return [];
  }
};

export default getLiveStreamers;
