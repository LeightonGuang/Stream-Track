(() => {
  const removeSplitViewButton = () => {
    const splitViewButtonElement = document.querySelector(
      "[id='splitViewButton']",
    );

    if (splitViewButtonElement) splitViewButtonElement.remove();
  };

  const getStreamersFromStreamTitle: () => void = () => {
    removeSplitViewButton();

    const titleSelector = '[data-a-target="stream-title"]';
    const titleElement = document.querySelector(titleSelector);

    const injectSplitViewButton = (channels: string[]) => {
      const splitViewButton = document.createElement("button");
      splitViewButton.id = "splitViewButton";
      splitViewButton.textContent = "Split View";
      splitViewButton.style.cssText = `
      display: inline-block;
      align-items: center;
      justify-content: center;
      background-color: #2a292e !important;
      height: 30px;
      color: #F3F3F1;
      border-radius: 4px;
      cursor: pointer;
      padding: 0px 8px;
      margin-left: 10px;
      font-weight: 600;
      font-size: 13px;
      line-height: 20px;
      `;
      console.log("Injecting split view button...");
      titleElement?.appendChild(splitViewButton);

      splitViewButton.addEventListener("mouseenter", () => {
        splitViewButton.style.backgroundColor = "#302f35";
      });

      splitViewButton.addEventListener("mouseleave", () => {
        splitViewButton.style.backgroundColor = "#2a292e";
      });

      splitViewButton.addEventListener("click", () => {
        const channel = window.location.pathname.split("/")[1];
        window.open(
          `https://twitchsplitviewer.netlify.app/?channels=${channel},${channels.join(",")}`,
        );
      });
    };

    if (titleElement) {
      const streamTitle = titleElement.textContent;

      const streamers = streamTitle
        ?.split(" ")
        .filter((word) => word.startsWith("@")) // Filter out words that don't start with "@"
        .map((streamer) => streamer.slice(1)) // Remove the "@" symbol
        .filter(
          (streamer) =>
            streamer.toLowerCase() !== window.location.pathname.split("/")[1],
        ); // Filter out the current streamer

      chrome.storage.local.set({ splitViewStreamers: streamers });

      if (streamers && streamers.length > 0) injectSplitViewButton(streamers);
    } else {
      console.log("No stream title found");
    }
  };

  setTimeout(() => {
    getStreamersFromStreamTitle();
  }, 2000);
})();
