import "../global.css";
import { useState } from "react";
import SettingsTab from "../components/settingsTab";
import FollowingTab from "../components/FollowingTab";
import { TwitchPurpleIcon } from "../public/icons";

export const Popup = () => {
  const [selectedTab, setSelectedTab] = useState<string>("list");

  return (
    <div className="flex flex-col items-center whitespace-nowrap bg-background text-white">
      <div className="flex h-[3.125rem] w-full items-center bg-[#18181a]">
        <a
          className="ml-[0.625rem] flex h-10 w-10 min-w-10 items-center justify-center p-[0.3125rem]"
          href="https://twitch.tv"
          target="_blank"
        >
          <TwitchPurpleIcon className="h-7 w-6" />
        </a>

        <div className="flex h-full w-full items-center justify-around">
          <button
            className={`h-full border-b-[0.125rem] border-[#18181a] text-sm font-semibold hover:text-[#bc98f1] ${selectedTab === "list" ? "border-[#bc98f1] text-[#bc98f1]" : "text-[##ececec]"}`}
            onClick={() => {
              setSelectedTab("list");
            }}
          >
            Following
          </button>

          <button
            className={`h-full border-b-[0.125rem] border-[#18181a] text-sm font-semibold hover:text-[#bc98f1] ${selectedTab === "settings" ? "border-[#bc98f1] text-[#bc98f1]" : "text-[##ececec]"}`}
            onClick={() => {
              setSelectedTab("settings");
            }}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="h-full bg-background">
        {selectedTab === "list" && <FollowingTab />}
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};
