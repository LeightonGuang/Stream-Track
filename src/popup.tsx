import "~style.css";
import { useState } from "react";
import Settings from "~tabs/Settings";
import { ListIcon, SettingsIcon } from "~assets/icons";

const IndexPopup = () => {
  const [selectedTabs, setSelectedTabs] = useState<string>("list");

  return (
    <div className="plasmo-bg-background plasmo-flex plasmo-w-72 plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-text-white">
      <div className="plasmo-h-8 plasmo-w-full plasmo-bg-twitch">
        <h1 className="plasmo-flex plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-text-xl plasmo-font-bold plasmo-text-white">
          Stream Track
        </h1>
      </div>

      <div className="plasmo-flex plasmo-w-full plasmo-gap-2 plasmo-p-2">
        <button
          className={`plasmo-flex plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-rounded-md plasmo-px-4 plasmo-py-2 plasmo-text-xs plasmo-font-semibold hover:plasmo-bg-[#231628] hover:plasmo-text-[#d0c8d4] ${selectedTabs === "list" ? "plasmo-bg-[#391e47]" : "plasmo-bg-[#1e1623] plasmo-text-[#847e88]"}`}
          onClick={() => {
            setSelectedTabs("list");
          }}
        >
          <ListIcon className="plasmo-w-4" />
          List
        </button>

        <button
          className={`plasmo-flex plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-rounded-md plasmo-px-4 plasmo-py-2 plasmo-text-xs plasmo-font-semibold hover:plasmo-bg-[#231628] hover:plasmo-text-[#d0c8d4] ${selectedTabs === "settings" ? "plasmo-bg-[#391e47]" : "plasmo-bg-[#1e1623] plasmo-text-[#847e88]"}`}
          onClick={() => {
            setSelectedTabs("settings");
          }}
        >
          <SettingsIcon className="plasmo-w-4" />
          Settings
        </button>
      </div>

      {selectedTabs === "list" && "list"}
      {selectedTabs === "settings" && <Settings />}
    </div>
  );
};

export default IndexPopup;
