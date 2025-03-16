export const TwitchIcon = ({ ...props }) => (
  <svg viewBox="0 0 2500 2100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <polygon
      className="st0"
      points="2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200"
      fill="white"
    />
    <path d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600V1300z" />
    <rect x="1700" y="550" width="200" height="600" />
    <rect x="1050" y="550" width="200" height="600" />
  </svg>
);

export const YouTubeIcon = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 512 360.726"
      {...props}
    >
      <path
        fill="#fff"
        d="M456.035 10.769c22.031 5.926 39.377 23.386 45.265 45.56C512 96.516 512 180.363 512 180.363s0 83.846-10.7 124.037c-5.888 22.17-23.234 39.631-45.265 45.559-39.928 10.767-200.034 10.767-200.034 10.767s-160.107 0-200.035-10.767C33.937 344.031 16.587 326.57 10.7 304.4 0 264.209 0 180.363 0 180.363S0 96.516 10.7 56.329c5.887-22.174 23.237-39.634 45.266-45.56C95.894 0 256.001 0 256.001 0s160.106 0 200.034 10.769zm-252.398 245.72l133.818-76.122-133.818-76.131v152.253z"
      />
    </svg>
  );
};
