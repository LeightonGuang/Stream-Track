import { FollowedChannelsNameIdType } from "../../../types/FollowedChannelsNameIdType";

const getStreamersProfilePics = async (
  followedChannels: FollowedChannelsNameIdType[],
  clientId: string | undefined,
  accessToken: string,
) => {
  try {
    const chunkSize = 100;

    const chunks = Array.from(
      { length: Math.ceil(followedChannels.length / chunkSize) },
      (_, i) =>
        followedChannels
          .slice(i * chunkSize, i * chunkSize + chunkSize)
          .map((channel) => channel.broadcaster_id),
    );

    const responses = await Promise.all(
      chunks.map(async (ids) => {
        const response: { data: { data: any[] } } = await axios.get(
          "https://api.twitch.tv/helix/users",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId,
            },
            params: { id: ids },
            paramsSerializer: (params) =>
              Object.entries(params)
                .flatMap(([key, value]) =>
                  Array.isArray(value)
                    ? value.map((v) => `${key}=${encodeURIComponent(v)}`)
                    : `${key}=${encodeURIComponent(value)}`,
                )
                .join("&"),
          },
        );

        return response.data.data.map(
          ({ id, display_name, profile_image_url }) => ({
            id,
            display_name,
            profile_image_url,
          }),
        );
      }),
    );

    const allProfiles = responses.flat();
    return allProfiles;
  } catch (error) {
    console.error("Error fetching streamers profile pics:", error);
  }
};

export default getStreamersProfilePics;
