import "../global.css";
import { useState } from "react";
import SettingsTab from "../components/settingsTab";
import FollowingTab from "../components/FollowingTab";

// TODO : Fix popup width and height to be responsive
export const Popup = () => {
  const [selectedTab, setSelectedTab] = useState<string>("list");

  return (
    <div className="flex flex-col items-center whitespace-nowrap bg-background text-white">
      <div className="flex h-[3.125rem] w-full bg-[#18181a]">
        <button
          className={`flex w-full items-center justify-center gap-2 border-b-[0.125rem] border-[#18181a] px-[0.625rem] py-2 text-sm font-semibold hover:text-[#bc98f1] ${selectedTab === "list" ? "border-[#bc98f1] text-[#bc98f1]" : "text-[##ececec]"}`}
          onClick={() => {
            setSelectedTab("list");
          }}
        >
          Following
        </button>

        <button
          className={`flex w-full items-center justify-center gap-2 border-b-[0.125rem] border-[#18181a] px-[0.625rem] py-2 text-sm font-semibold hover:text-[#bc98f1] ${selectedTab === "settings" ? "border-[#bc98f1] text-[#bc98f1]" : "text-[##ececec]"}`}
          onClick={() => {
            setSelectedTab("settings");
          }}
        >
          Settings
        </button>
      </div>

      <div className="h-full bg-background">
        {selectedTab === "list" && <FollowingTab />}
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};
