(() => {
  const KEYS = {
    portfolio: "commandCenterPortfolio",
    holdings: "commandCenterHoldings",
    seen: "commandCenterPortfolioSeen",
    starred: "savedPortfolioSymbols",
  };

  function readKey(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function exportBackup() {
    const backup = {
      app: "stock-command-center",
      version: 1,
      exportedAt: new Date().toISOString(),
      portfolio: readKey(KEYS.portfolio),
      holdings: readKey(KEYS.holdings),
      seen: readKey(KEYS.seen),
      starred: readKey(KEYS.starred),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `stock-portfolio-backup-${backup.exportedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function validBackup(data) {
    if (!data || typeof data !== "object" || data.app !== "stock-command-center") return false;
    if (data.portfolio && !Array.isArray(data.portfolio.positions)) return false;
    if (data.holdings && (typeof data.holdings !== "object" || Array.isArray(data.holdings))) return false;
    return Boolean(data.portfolio || data.holdings);
  }

  async function importBackup(file, statusEl) {
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch {
      statusEl.textContent = "Import failed: that file is not valid JSON.";
      return;
    }
    if (!validBackup(data)) {
      statusEl.textContent = "Import failed: not a Stock Command Center backup file.";
      return;
    }
    try {
      if (data.portfolio) localStorage.setItem(KEYS.portfolio, JSON.stringify(data.portfolio));
      if (data.holdings) localStorage.setItem(KEYS.holdings, JSON.stringify(data.holdings));
      if (data.seen) localStorage.setItem(KEYS.seen, JSON.stringify(data.seen));
      if (data.starred) localStorage.setItem(KEYS.starred, JSON.stringify(data.starred));
    } catch {
      statusEl.textContent = "Import failed: could not write to browser storage.";
      return;
    }
    statusEl.textContent = "Backup restored — reloading…";
    window.setTimeout(() => window.location.reload(), 400);
  }

  const BUTTON_STYLE =
    "color:#c8f7d8;background:#43e18414;border:1px solid #43e18452;border-radius:7px;" +
    "padding:4px 8px;font:inherit;font-size:11px;cursor:pointer";

  function inject(editor) {
    if (editor.querySelector(".portfolio-tools")) return;
    const bar = document.createElement("div");
    bar.className = "portfolio-tools";
    bar.style.cssText = "display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px";

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.textContent = "Export backup";
    exportButton.title = "Download shares and cost basis as a JSON file";
    exportButton.style.cssText = BUTTON_STYLE;

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.textContent = "Import backup";
    importButton.title = "Restore shares and cost basis from a backup file";
    importButton.style.cssText = BUTTON_STYLE;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/json,.json";
    fileInput.hidden = true;

    const status = document.createElement("span");
    status.style.cssText = "color:#7f94aa;font-size:10px";

    exportButton.addEventListener("click", exportBackup);
    importButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      if (fileInput.files?.[0]) importBackup(fileInput.files[0], status);
      fileInput.value = "";
    });

    bar.append(exportButton, importButton, fileInput, status);
    editor.appendChild(bar);
  }

  const observer = new MutationObserver(() => {
    const editor = document.querySelector(".holdings-editor");
    if (editor) inject(editor);
  });

  function start() {
    observer.observe(document.body, { childList: true, subtree: true });
    const editor = document.querySelector(".holdings-editor");
    if (editor) inject(editor);
  }

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
