import "../global.css";
import { useState } from "react";
import ListTab from "../components/ListTab";
import SettingsTab from "../components/settingsTab";

import { ListIcon, SettingsIcon } from "../public/icons";

export const Popup = () => {
  const [selectedTab, setSelectedTab] = useState<string>("list");

  return (
    <div className="bg-background text-white">
      <div className="bg-twitch py-2 text-center text-xl font-bold text-white">
        <h1>Stream Track</h1>
      </div>

      <div className="flex w-full gap-2 p-2">
        <button
          className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-semibold hover:bg-[#231628] hover:text-[#d0c8d4] ${selectedTab === "list" ? "bg-[#391e47]" : "bg-[#1e1623] text-[#847e88]"}`}
          onClick={() => {
            setSelectedTab("list");
          }}
        >
          <ListIcon className="w-4" />
          List
        </button>

        <button
          className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-semibold hover:bg-[#231628] hover:text-[#d0c8d4] ${selectedTab === "settings" ? "bg-[#391e47]" : "bg-[#1e1623] text-[#847e88]"}`}
          onClick={() => {
            setSelectedTab("settings");
          }}
        >
          <SettingsIcon className="w-4" />
          Settings
        </button>
      </div>

      <div className="flex w-full justify-center p-2">
        {selectedTab === "list" && <ListTab />}
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};
