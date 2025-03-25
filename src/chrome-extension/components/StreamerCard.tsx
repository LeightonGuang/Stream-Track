import { useState } from "react";
import { TwitchViewerIcon } from "../public/icons";
import formatViewCount from "../utils/formatViewCount";

import { LiveChannelType } from "../../types/liveChannelType";

const StreamerCard = ({
  liveChannelData,
  channelData,
}: {
  liveChannelData: LiveChannelType;
  channelData: any;
}) => {
  const [isHover, setIsHover] = useState(false);

  const formattedStreamCategory = (category: string) =>
    category.replace(/\s/g, "-").toLowerCase();

  const formattedThumbnailUrl = (thumbnailUrl: string) => {
    const textToRemove = "-{width}x{height}";
    const formattedUrl = thumbnailUrl.replace(textToRemove, "");
    return formattedUrl;
  };

  console.log(formattedThumbnailUrl(liveChannelData.thumbnail_url));

  return (
    liveChannelData &&
    channelData && (
      <a
        key={liveChannelData.user_id}
        href={`https://www.twitch.tv/${channelData.display_name}`}
        target="_blank"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {isHover ? (
          <div className="flex w-[13.75rem] flex-col overflow-x-clip bg-[#0e0e10] px-[0.625rem] py-[0.3125rem]">
            <img
              alt={liveChannelData.title}
              className="w-full object-cover"
              src={formattedThumbnailUrl(liveChannelData.thumbnail_url)}
            />

            <div className="w-full border-t border-[#363539]">
              <h1 className="text-ellipsis text-sm font-semibold leading-[1.3125rem] text-[#efeff1]">
                {liveChannelData.title}
              </h1>

              <div className="flex gap-1">
                {liveChannelData.tags.map((tag: string) => (
                  <div
                    key={tag}
                    className="flex items-center justify-center rounded-l-full rounded-r-full bg-[#2b292e] px-2 hover:bg-[#302f35]"
                  >
                    <a
                      href={`https://www.twitch.tv/directory/all/tags/${tag}`}
                      target="_blank"
                    >
                      <span className="font-semibold text-[#adadb8]">
                        {tag}
                      </span>
                    </a>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <a
                  className="text-[0.875rem] font-normal leading-[1.3125rem] text-[#bf94ff] hover:text-[#a970ff] hover:underline"
                  href={`https://www.twitch.tv/directory/category/${formattedStreamCategory(liveChannelData.game_name)}`}
                  target="_blank"
                >
                  {liveChannelData.game_name}
                </a>

                <div className="flex items-center text-[#ff8280]">
                  <TwitchViewerIcon />
                  <span className="text-[0.8125rem] font-semibold">
                    {liveChannelData.viewer_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-[15rem] max-w-[15rem] items-center bg-[#1f1e22] px-[0.625rem] py-[0.3125rem]">
            <img
              alt={channelData.display_name}
              className="h-[1.875rem] w-[1.875rem] rounded-full"
              src={channelData.profile_image_url}
            />
            <div className="ml-[0.625rem] flex w-[11.25rem] min-w-[11.25rem] max-w-[11.25rem]">
              <div className="flex flex-grow flex-col">
                <p className="flex-shrink text-sm font-semibold leading-[1.05rem] text-[#dedee3]">
                  {channelData.display_name}
                </p>

                {/* overflow-x-clip overflow-y-visible text-ellipsis whitespace-nowrap */}
                <p className="flex flex-shrink text-[0.8125rem] font-normal leading-[0.975rem] text-[#adadb8]">
                  {liveChannelData.game_name}
                  {/* {"testinsdf;ljasdf opsaidufpoiuwrpowuevr"} */}
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
          </div>
        )}
      </a>
    )
  );
};

export default StreamerCard;
