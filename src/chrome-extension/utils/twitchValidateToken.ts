import axios from "axios";

const validateTwitchToken = async (accessToken: string): Promise<boolean> => {
  try {
    const response: any = await axios.get(
      "https://id.twitch.tv/oauth2/validate",
      {
        headers: {
          Authorization: `OAuth ${accessToken}`,
        },
      },
    );

    return response.status === 200;
  } catch (error) {
    console.error("Error validating Twitch token: ", error);
    return false;
  }
};

export default validateTwitchToken;
