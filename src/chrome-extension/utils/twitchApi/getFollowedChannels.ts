import axios from "axios";

import { FollowedChannelsType } from "../../../types/FollowedChannelsType";
import { FollowedChannelsNameIdType } from "../../../types/FollowedChannelsNameIdType";

const getFollowedChannels = async (
  clientId: string | undefined,
  userId: string,
  accessToken: string,
): Promise<FollowedChannelsNameIdType[]> => {
  try {
    const followingChannels: FollowedChannelsNameIdType[] = [];
    let cursor = null;

    do {
      const response: { data: FollowedChannelsType } = await axios.get(
        "https://api.twitch.tv/helix/channels/followed",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": clientId,
          },
          params: {
            user_id: userId,
            first: 100,
            after: cursor,
          },
        },
      );

      cursor = response.data.pagination.cursor || null;

      followingChannels.push(
        ...response.data.data.map(({ broadcaster_id, broadcaster_name }) => ({
          broadcaster_id,
          broadcaster_name,
        })),
      );
    } while (cursor);

    return followingChannels;
  } catch (error) {
    console.error("Error fetching followed channels:", error);
    return [];
  }
};

export default getFollowedChannels;
