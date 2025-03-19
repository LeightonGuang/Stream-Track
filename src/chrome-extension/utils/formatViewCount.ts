const formatViewCount = (viewCount: number) => {
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}K`;
  } else {
    return viewCount.toString();
  }
};

export default formatViewCount;
