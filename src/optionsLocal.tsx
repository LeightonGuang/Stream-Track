import { StrictMode } from "react";
import "./chrome-extension/global.css";
import { createRoot } from "react-dom/client";
import Options from "./chrome-extension/options/index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-dvh w-dvw bg-background text-white">
      <Options />
    </div>
  </StrictMode>,
);
