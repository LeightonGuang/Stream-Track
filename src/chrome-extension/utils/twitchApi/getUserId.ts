import { TwitchUserType } from "../../../types/twitchUserType";

const getUserId = async (
  clientId: string | undefined,
  accessToken: string,
): Promise<string | undefined> => {
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
    return userId;
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
};

export default getUserId;
