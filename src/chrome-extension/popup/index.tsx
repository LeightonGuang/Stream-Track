import "../global.css";
import { useState } from "react";
import ListTab from "../components/ListTab";
import SettingsTab from "../components/settingsTab";

import { ListIcon, SettingsIcon } from "../public/icons";

export const Popup = () => {
  const [selectedTab, setSelectedTab] = useState<string>("list");

  return (
    <div className="flex flex-col items-center whitespace-nowrap bg-background text-white">
      <div className="w-full bg-twitch py-2 text-center text-xl font-bold text-white">
        <h1>Stream Track</h1>
      </div>

      <div className="flex h-[3.125rem] w-full bg-[#18181a]">
        <button
          className={`flex w-full items-center justify-center gap-2 border-b-[0.125rem] border-[#18181a] px-[0.625rem] py-2 text-sm font-semibold hover:text-[#bc98f1] ${selectedTab === "list" ? "border-[#bc98f1] text-[#bc98f1]" : "text-[##ececec]"}`}
          onClick={() => {
            setSelectedTab("list");
          }}
        >
          <ListIcon className="w-4" />
          List
        </button>

        <button
          className={`flex w-full items-center justify-center gap-2 border-b-[0.125rem] border-[#18181a] px-[0.625rem] py-2 text-sm font-semibold hover:text-[#bc98f1] ${selectedTab === "settings" ? "border-[#bc98f1] text-[#bc98f1]" : "text-[##ececec]"}`}
          onClick={() => {
            setSelectedTab("settings");
          }}
        >
          <SettingsIcon className="w-4" />
          Settings
        </button>
      </div>

      <div className="flex h-max w-max justify-center">
        {selectedTab === "list" && <ListTab />}
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};
