import "../global.css";
import { useState } from "react";
import SettingsTab from "../components/settingsTab";
import FollowingTab from "../components/FollowingTab";
import { SortIcon } from "../public/icons";

// TODO : Fix popup width and height to be responsive
// TODO : Sort by view count, name and game

export const Popup = () => {
  const [selectedTab, setSelectedTab] = useState<string>("list");

  const handleSortButton = () => {
    console.log("Sort button clicked");
  };

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

      <div className="w-full">
        <button
          className="flex w-full items-center justify-between bg-[#1f1e22] hover:bg-[#302f35]"
          onClick={handleSortButton}
        >
          <div className="m-[0.625rem] flex flex-col items-start">
            <h3 className="text-[0.8125rem] font-semibold leading-[0.975rem] text-[#EFEFF1]">
              FOLLOWED CHANNELS
            </h3>
            <p className="text-[0.8125rem] font-normal leading-[1.2188rem] text-[#ADADB8]">
              Viewers (High to Low)
            </p>
          </div>

          <div className="mr-[0.625rem] h-[1.25rem] w-[1.25rem] pr-[0.3125rem]">
            <SortIcon className="h-[1.25rem] w-[1.25rem] text-white" />
          </div>
        </button>
      </div>

      <div className="h-full bg-background">
        {selectedTab === "list" && <FollowingTab />}
        {selectedTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
};
