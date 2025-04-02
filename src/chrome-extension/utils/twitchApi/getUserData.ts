import axios from "axios";

import { TwitchUserType } from "../../../types/twitchUserType";

const getUserData = async (
  clientId: string | undefined,
  accessToken: string,
): Promise<
  { id: string; profile_image_url: string; name: string } | undefined
> => {
  try {
    const response: { data: { data: TwitchUserType[] } } = await axios.get(
      "https://api.twitch.tv/helix/users",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId,
        },
      },
    );

    const userId: string = response.data.data[0].id;
    const profile_image_url: string = response.data.data[0].profile_image_url;
    const name = response.data.data[0].display_name;
    return { id: userId, profile_image_url, name };
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
};

export default getUserData;
