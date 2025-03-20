const formatViewCount = (viewCount: number) => {
  if (viewCount >= 1000000) {
    const value = (viewCount / 1000000).toFixed(1);
    const [integerPart, decimalPart] = value.split(".");
    return `${integerPart}${decimalPart !== "0" ? "." + decimalPart : ""}M`;
  } else if (viewCount >= 1000) {
    const value = (viewCount / 1000).toFixed(1);
    const [integerPart, decimalPart] = value.split(".");
    return `${integerPart}${decimalPart !== "0" ? "." + decimalPart : ""}K`;
  } else {
    return viewCount.toString();
  }
};

export default formatViewCount;
