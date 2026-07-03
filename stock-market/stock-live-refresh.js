(() => {
  const manualRefreshWindowMs = 5000;
  let manualRefreshUntil = 0;
  const originalFetch = window.fetch.bind(window);
  const pageBase = document.currentScript
    ? new URL("./", document.currentScript.src)
    : new URL("./", window.location.href);
  const dataBase = pageBase.href;
  window.__STOCK_MARKET_BASE_URL__ = dataBase;
  const hasCloudflareRefresh = window.location.hostname !== "jz237.github.io";

  document.addEventListener(
    "click",
    (event) => {
      const button = event.target?.closest?.(".live-chip button");
      if (button) manualRefreshUntil = Date.now() + manualRefreshWindowMs;
    },
    true,
  );

  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input?.url;
    const isManual = Date.now() <= manualRefreshUntil;
    if (isManual && hasCloudflareRefresh && typeof url === "string" && new URL(url, window.location.href).pathname.endsWith("/stock-market/data/stocks.json")) {
      const marker = url.includes("?") ? url.slice(url.indexOf("?")) : `?t=${Date.now()}`;
      return originalFetch(new URL(`refresh${marker}`, pageBase).href, init);
    }
    return originalFetch(input, init);
  };
})();
