(() => {
  const manualRefreshWindowMs = 5000;
  let manualRefreshUntil = 0;
  const originalFetch = window.fetch.bind(window);

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
    if (isManual && typeof url === "string" && url.startsWith("/stock-market/data/stocks.json")) {
      const marker = url.includes("?") ? url.slice(url.indexOf("?")) : `?t=${Date.now()}`;
      return originalFetch(`/stock-market/refresh${marker}`, init);
    }
    return originalFetch(input, init);
  };
})();
