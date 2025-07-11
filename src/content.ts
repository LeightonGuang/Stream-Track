(() => {
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const getStreamersFromStreamTitle = (): string[] => {
    const titleElement = document.querySelector(
      '[data-a-target="stream-title"]',
    );
    const streamTitle = titleElement?.textContent || "";

    const streamers = streamTitle
      .split(" ")
      .filter((word) => word.startsWith("@"))
      .map((streamer) => streamer.slice(1))
      .filter(
        (streamer) =>
          streamer.toLowerCase() !== window.location.pathname.split("/")[1],
      );

    return streamers;
  };

  const injectSplitViewButton = (channels: string[]) => {
    console.log("🔨 Injecting split view button");

    if (document.querySelector("#splitViewButton")) return;

    const splitViewerButton = document.createElement("button");
    splitViewerButton.id = "splitViewButton";
    splitViewerButton.textContent = "Split Viewer";
    splitViewerButton.style.cssText = `
      display: inline-block;
      background-color: #2a292e;
      color: #F3F3F1;
      height: 32px;
      margin-right: 8px;
      border-radius: 100rem;
      cursor: pointer;
      padding: 0 12px;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
    `;

    const container = document.querySelector(
      '[data-target="channel-header-right"]',
    );
    container?.lastElementChild?.prepend(splitViewerButton);

    splitViewerButton.addEventListener(
      "mouseenter",
      () => (splitViewerButton.style.backgroundColor = "#302f35"),
    );
    splitViewerButton.addEventListener(
      "mouseleave",
      () => (splitViewerButton.style.backgroundColor = "#2a292e"),
    );
    splitViewerButton.addEventListener("click", () => {
      const currentChannel = window.location.pathname.split("/")[1];
      window.open(
        `https://twitchsplitviewer.netlify.app/?channels=${currentChannel},${channels.join(",")}`,
      );
    });

    console.log("✅ Split view button injected");
  };

  const removeSplitViewButton = () => {
    const splitViewButton = document.querySelector("#splitViewButton");
    if (splitViewButton) {
      splitViewButton.remove();
      console.log("✅ Split view button removed");
    }
  };

  const observeUntilReady = () => {
    const observer = new MutationObserver(() => {
      const streamTitleElement = document.querySelector(
        '[data-a-target="stream-title"]',
      );
      if (streamTitleElement) {
        const streamers = getStreamersFromStreamTitle();
        if (streamers.length > 0) injectSplitViewButton(streamers);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const init = async () => {
    await wait(1000);

    const streamTitleElement = document.querySelector(
      '[data-a-target="stream-title"]',
    );
    if (streamTitleElement) {
      const streamers = getStreamersFromStreamTitle();
      if (streamers.length > 0) injectSplitViewButton(streamers);
    } else {
      observeUntilReady();
    }
  };

  let lastPath = location.pathname;

  // Detect navigation between channels
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      removeSplitViewButton();
      init();
    }
  }, 1000);

  init();
})();
