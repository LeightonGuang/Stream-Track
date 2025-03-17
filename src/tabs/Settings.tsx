import { TwitchIcon, YouTubeIcon } from "~assets/icons";

const Settings = () => {
  return (
    <div className="plasmo-w-full plasmo-p-2">
      <h2 className="plasmo-text-base plasmo-font-bold">Settings</h2>

      <div className="plasmo-mt-2 plasmo-flex plasmo-flex-col plasmo-gap-1">
        <button className="plasmo-flex plasmo-w-max plasmo-gap-1 plasmo-rounded-md plasmo-bg-twitch plasmo-px-2 plasmo-py-1">
          <TwitchIcon className="plasmo-w-4" />
          <span className="plasmo-font-medium">Login with Twitch</span>
        </button>

        <button className="plasmo-flex plasmo-w-max plasmo-gap-1 plasmo-rounded-md plasmo-bg-youtube plasmo-px-2 plasmo-py-1">
          <YouTubeIcon className="plasmo-w-4" />
          <span className="plasmo-font-medium">Login with Youtube</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
