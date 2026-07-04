import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HiResChart from "./components/HiResChart.jsx";
import PortfolioPanel from "./components/PortfolioPanel.jsx";
import {
  AUTO_REFRESH_MS,
  FALLBACK_STOCKS,
  RANGES,
  RANGE_DESCRIPTIONS,
  historyFileName,
  historyForRange,
  historyKey,
  readLocal,
} from "./lib/data.js";

const BENCHMARK_KEY = "^GSPC";
const BENCHMARKS = [
  { label: "S&P 500", key: "^GSPC" },
  { label: "NASDAQ", key: "^IXIC" },
];
const DRAWER_VIEWS = ["report", "research", "catalysts", "risks", "watchlist"];
const MODE_TABS = ["Research", "News", "Portfolio"];

// Deep-link hash: #symbol=NVDA&range=1Y&tab=Portfolio&view=report.
// Legacy single-token hashes (#report) and bare symbols (#AAPL) also parse.
function parseHash() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return {};
  if (!raw.includes("=")) {
    return DRAWER_VIEWS.includes(raw)
      ? { view: raw }
      : { symbol: decodeURIComponent(raw).toUpperCase() };
  }
  const params = new URLSearchParams(raw);
  const parsed = {};
  if (params.get("symbol")) parsed.symbol = params.get("symbol").toUpperCase();
  if (RANGES.includes(params.get("range"))) parsed.range = params.get("range");
  if (MODE_TABS.includes(params.get("tab"))) parsed.tab = params.get("tab");
  if (DRAWER_VIEWS.includes(params.get("view"))) parsed.view = params.get("view");
  return parsed;
}

const initialHash = parseHash();
import {
  dayChangeAmount,
  fmt,
  fmtIndex,
  fmtVolume,
  isMarketOpen,
  position52w,
  postureLabel,
  setupLabel,
  sparklinePath,
} from "./lib/format.js";

export default function App() {
  const [stocksData, setStocksData] = useState(null);
  const [historyBySymbol, setHistoryBySymbol] = useState({});
  const [portfolio, setPortfolio] = useState({ positions: [] });
  const [holdings, setHoldings] = useState(() =>
    readLocal("commandCenterHoldings", {}),
  );
  const [status, setStatus] = useState("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(
    initialHash.symbol || "NVDA",
  );
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("");
  const [sortKey, setSortKey] = useState("default");
  const [sortDir, setSortDir] = useState(1);
  const [range, setRange] = useState(initialHash.range || "1D");
  const [chartMode, setChartMode] = useState("Candles");
  const [mode, setMode] = useState(initialHash.tab || "Research");
  const [indicators, setIndicators] = useState(true);
  const [starred, setStarred] = useState(() =>
    readLocal("savedPortfolioSymbols", []),
  );
  const [drawer, setDrawer] = useState(initialHash.view || null);
  const [focusedCatalyst, setFocusedCatalyst] = useState("");
  const [privacy, setPrivacy] = useState(() =>
    readLocal("commandCenterPrivacy", false),
  );
  const [holdingsSort, setHoldingsSort] = useState("default");
  const [hideUnsized, setHideUnsized] = useState(false);
  const [newTicker, setNewTicker] = useState("");
  const [alerts, setAlerts] = useState(() => readLocal("commandCenterAlerts", {}));
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const searchRef = useRef(null);
  const selectedKeyRef = useRef(null);
  const historyRequests = useRef(new Set());
  const notifiedAlerts = useRef(new Set());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 3e4);
    return () => window.clearInterval(timer);
  }, []);

  // History lives in one small file per symbol, fetched on demand and cached
  // in state. force refetches (used by the refresh cycle for live symbols).
  const ensureHistory = useCallback(async (keys, force = false) => {
    const wanted = keys.filter((key) => {
      if (!key) return false;
      if (!force && historyRequests.current.has(key)) return false;
      historyRequests.current.add(key);
      return true;
    });
    if (!wanted.length) return;
    const loaded = await Promise.all(
      wanted.map((key) =>
        fetch(`data/history/${historyFileName(key)}${force ? `?t=${Date.now()}` : ""}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => [key, data])
          .catch(() => [key, null]),
      ),
    );
    setHistoryBySymbol((current) => {
      const next = { ...current };
      for (const [key, data] of loaded) if (data) next[key] = data;
      return next;
    });
  }, []);

  const loadData = useCallback(async (manual = false) => {
    const buster = manual ? `?t=${Date.now()}` : "";
    setRefreshing(true);
    try {
      const [stocks, serverPortfolio] = await Promise.all([
        fetch(`data/stocks.json${buster}`).then((res) => res.json()),
        fetch("data/portfolio.json")
          .then((res) => res.json())
          .catch(() => null),
      ]);
      if (!Array.isArray(stocks.stocks))
        throw Error("unexpected stocks.json shape");
      setStocksData(stocks);
      if (selectedKeyRef.current)
        ensureHistory([selectedKeyRef.current, BENCHMARK_KEY], manual);
      // A saved local portfolio wins, but newly published server symbols merge
      // in once; the "seen" list keeps deliberate removals sticky.
      const saved = readLocal("commandCenterPortfolio", null);
      if (saved?.positions?.length) {
        const seen = readLocal("commandCenterPortfolioSeen", []);
        const fresh = (serverPortfolio?.positions || []).filter(
          (position) =>
            !seen.includes(position.symbol) &&
            !saved.positions.some((p) => p.symbol === position.symbol),
        );
        if (fresh.length) {
          const merged = { ...saved, positions: [...saved.positions, ...fresh] };
          setPortfolio(merged);
          try {
            localStorage.setItem(
              "commandCenterPortfolio",
              JSON.stringify(merged),
            );
          } catch {}
        } else setPortfolio(saved);
      } else if (serverPortfolio?.positions) setPortfolio(serverPortfolio);
      if (serverPortfolio?.positions) {
        try {
          localStorage.setItem(
            "commandCenterPortfolioSeen",
            JSON.stringify(serverPortfolio.positions.map((p) => p.symbol)),
          );
        } catch {}
      }
      setStatus("ready");
    } catch {
      setStatus((prev) => (prev === "ready" ? "ready" : "error"));
    } finally {
      setRefreshing(false);
    }
  }, [ensureHistory]);

  useEffect(() => {
    const kickoff = window.setTimeout(() => loadData(true), 0);
    const timer = window.setInterval(() => loadData(true), AUTO_REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") loadData(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadData]);

  // External hash edits (back/forward, pasted links) flow into state…
  useEffect(() => {
    function applyHash() {
      const parsed = parseHash();
      if (parsed.symbol) setSelectedSymbol(parsed.symbol);
      if (parsed.range) setRange(parsed.range);
      if (parsed.tab) setMode(parsed.tab);
      setDrawer(parsed.view || null);
    }
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // …and state flows back into the hash so any view is a shareable link.
  // The default view keeps a clean URL. replaceState avoids history spam
  // and does not re-fire hashchange.
  useEffect(() => {
    const parts = [];
    const isDefault =
      selectedSymbol === "NVDA" &&
      range === "1D" &&
      mode === "Research" &&
      !drawer;
    if (!isDefault) {
      parts.push(`symbol=${encodeURIComponent(selectedSymbol)}`);
      if (range !== "1D") parts.push(`range=${range}`);
      if (mode !== "Research") parts.push(`tab=${mode}`);
      if (drawer) parts.push(`view=${drawer}`);
    }
    const desired = parts.length ? `#${parts.join("&")}` : "";
    if (window.location.hash !== desired) {
      window.history.replaceState(
        null,
        "",
        desired || window.location.pathname + window.location.search,
      );
    }
  }, [selectedSymbol, range, mode, drawer]);

  const allStocks = useMemo(
    () => stocksData?.stocks || FALLBACK_STOCKS,
    [stocksData],
  );
  const equities = useMemo(
    () => allStocks.filter((s) => (s.kind || "equity") === "equity"),
    [allStocks],
  );
  const instruments = useMemo(
    () => allStocks.filter((s) => s.kind === "instrument"),
    [allStocks],
  );
  const stock =
    allStocks.find((s) => s.symbol === selectedSymbol) ||
    equities[0] ||
    FALLBACK_STOCKS[0];
  const isInstrument = stock.kind === "instrument";
  const stockHistoryKey = historyKey(stock);
  selectedKeyRef.current = stockHistoryKey;

  useEffect(() => {
    ensureHistory([stockHistoryKey]);
  }, [ensureHistory, stockHistoryKey]);

  // A deep link to a symbol we don't track falls back to the first equity;
  // normalize the selection so the shareable hash matches what's shown.
  useEffect(() => {
    if (stocksData && selectedSymbol !== stock.symbol)
      setSelectedSymbol(stock.symbol);
  }, [stocksData, selectedSymbol, stock.symbol]);
  const folders = useMemo(
    () =>
      [
        {
          name: "AI & Semiconductors",
          member: (s) =>
            s.sector.includes("Semi") ||
            ["NVDA", "AVGO", "ARM", "TSM", "QCOM", "INTC", "NVTS"].includes(
              s.symbol,
            ),
        },
        {
          name: "Cloud & Software",
          member: (s) =>
            s.sector.includes("Cloud") ||
            s.sector.includes("Software") ||
            ["MSFT", "ORCL", "PLTR", "GOOG", "AMZN", "CRWV", "SOUN"].includes(
              s.symbol,
            ),
        },
        {
          name: "Consumer Tech",
          member: (s) => ["AAPL", "AMZN", "GOOG", "META"].includes(s.symbol),
        },
        {
          name: "Portfolio",
          member: (s) => portfolio.positions.some((p) => p.symbol === s.symbol),
        },
        { name: "★ Starred", member: (s) => starred.includes(s.symbol) },
      ].map(({ name, member }) => ({
        name,
        member,
        count: equities.filter(member).length,
      })),
    [portfolio.positions, starred, equities],
  );
  const filtered = useMemo(() => {
    const activeFolder = folders.find((f) => f.name === folder);
    let list = equities.filter(
      (s) =>
        `${s.symbol} ${s.name}`.toLowerCase().includes(query.toLowerCase()) &&
        (!activeFolder || activeFolder.member(s)),
    );
    if (sortKey !== "default") {
      list = [...list].sort((a, b) =>
        sortKey === "symbol"
          ? a.symbol.localeCompare(b.symbol) * sortDir
          : sortKey === "price"
            ? (a.price - b.price) * sortDir
            : (a.change - b.change) * sortDir,
      );
    }
    return list;
  }, [folders, folder, query, sortDir, sortKey, equities]);
  const positions = useMemo(
    () =>
      portfolio.positions
        .map((p) => ({ ...p, stock: equities.find((s) => s.symbol === p.symbol) }))
        .filter((p) => !!p.stock),
    [portfolio.positions, equities],
  );
  const unpricedPositions = useMemo(
    () =>
      stocksData
        ? portfolio.positions.filter(
            (p) => !allStocks.some((s) => s.symbol === p.symbol),
          )
        : [],
    [stocksData, portfolio.positions, allStocks],
  );

  // Prefetch history for sized positions (plus the benchmark) so the
  // portfolio equity curve can build as soon as the Portfolio tab opens.
  useEffect(() => {
    if (mode !== "Portfolio") return;
    const keys = positions
      .filter((p) => holdings[p.symbol]?.shares > 0)
      .map((p) => historyKey(p.stock));
    ensureHistory([...keys, ...BENCHMARKS.map((b) => b.key)]);
  }, [mode, positions, holdings, ensureHistory]);
  const plSummary = useMemo(() => {
    let value = 0;
    let cost = 0;
    let dayPl = 0;
    let held = 0;
    for (const position of positions) {
      const holding = holdings[position.symbol];
      if (!holding || !(holding.shares > 0)) continue;
      held += 1;
      value += holding.shares * position.stock.price;
      cost += holding.shares * holding.avgCost;
      dayPl += holding.shares * dayChangeAmount(position.stock);
    }
    return {
      value,
      cost,
      dayPl,
      held,
      totalPl: value - cost,
      totalPlPct: cost > 0 ? ((value - cost) / cost) * 100 : 0,
    };
  }, [holdings, positions]);
  const displayedPositions = useMemo(() => {
    let list = positions;
    if (hideUnsized)
      list = list.filter((p) => holdings[p.symbol]?.shares > 0);
    if (holdingsSort === "ticker")
      list = [...list].sort((a, b) => a.symbol.localeCompare(b.symbol));
    else if (holdingsSort === "value")
      list = [...list].sort(
        (a, b) =>
          (holdings[b.symbol]?.shares || 0) * b.stock.price -
          (holdings[a.symbol]?.shares || 0) * a.stock.price,
      );
    else if (holdingsSort === "daypl")
      list = [...list].sort(
        (a, b) =>
          (holdings[b.symbol]?.shares || 0) * dayChangeAmount(b.stock) -
          (holdings[a.symbol]?.shares || 0) * dayChangeAmount(a.stock),
      );
    return list;
  }, [positions, holdings, holdingsSort, hideUnsized]);
  const sectorBuckets = equities.reduce((groups, s) => {
    const group = s.sector.includes("Semi")
      ? "Semiconductors"
      : s.sector.includes("Cloud") || s.sector.includes("Software")
        ? "Software"
        : s.sector.includes("Consumer")
          ? "Consumer Tech"
          : s.sector.includes("Communication")
            ? "Consumer / Internet"
            : s.sector.includes("Industrial")
              ? "Industrials"
              : s.sector;
    groups[group] = [...(groups[group] || []), s];
    return groups;
  }, {});
  const sectorGroups = Object.entries(sectorBuckets)
    .map(([group, items]) => ({ group, items }))
    .filter(({ items }) => items.length);
  const topMovers = [...equities]
    .filter((s) => Number.isFinite(s.change) && Number.isFinite(s.price))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 8);
  const radarItems = [
    {
      label: "Now",
      type: "Primary",
      text: stock.catalysts[0] || stock.thesis,
      tone: stock.change >= 0 ? "up" : "down",
    },
    {
      label: "Next",
      type: "Bull trigger",
      text:
        stock.catalysts[1] ||
        stock.opportunities[0] ||
        "Watch for confirmation in the next major update.",
      tone: "up",
    },
    {
      label: "Risk",
      type: "Risk trigger",
      text:
        stock.risks[0] ||
        stock.catalysts[2] ||
        "No specific risk trigger recorded yet.",
      tone: "down",
    },
  ];
  const workbenchItems = [
    ...stock.catalysts.map((text, index) => ({
      label: index === 0 ? "Primary" : `C${index + 1}`,
      type: index === 0 ? "Main catalyst" : "Watch item",
      text,
      tone: index < 2 ? "up" : "neutral",
    })),
    ...stock.opportunities.slice(0, 4).map((text, index) => ({
      label: `Bull ${index + 1}`,
      type: "Upside trigger",
      text,
      tone: "up",
    })),
    ...stock.risks.slice(0, 4).map((text, index) => ({
      label: `Risk ${index + 1}`,
      type: "Downside trigger",
      text,
      tone: "down",
    })),
  ];
  const focusedItem =
    workbenchItems.find((item) => item.text === focusedCatalyst) ||
    workbenchItems[0];
  const readoutRows = [
    {
      label: "Setup",
      value: setupLabel(stock),
      text: `${stock.symbol} is currently a ${setupLabel(stock).toLowerCase()} story based on conviction, recent move, and instrument type.`,
      tone: stock.change >= 0 ? "up" : "down",
    },
    {
      label: "Why it matters",
      value: "Thesis",
      text: stock.thesis,
      tone: "neutral",
    },
    {
      label: "Confirms it",
      value: "Bull case",
      text:
        stock.opportunities[0] ||
        stock.catalysts[0] ||
        "Needs a clear confirming catalyst.",
      tone: "up",
    },
    {
      label: "Breaks it",
      value: "Risk case",
      text: stock.risks[0] || "No explicit break point recorded yet.",
      tone: "down",
    },
    {
      label: "Posture",
      value: postureLabel(stock),
      text: postureLabel(stock),
      tone: stock.change >= 0 ? "up" : "neutral",
    },
  ];
  const isStarred = starred.includes(stock.symbol);
  const marketOpen = isMarketOpen(new Date(now));
  const dataAgeMinutes = stocksData
    ? Math.max(
        0,
        Math.round((now - new Date(stocksData.updatedAt).getTime()) / 6e4),
      )
    : null;
  const isStale = marketOpen && dataAgeMinutes !== null && dataAgeMinutes > 2160;
  const statusLabel =
    status === "loading"
      ? "Loading market data…"
      : status === "error"
        ? "Data files unavailable"
        : `Data as of ${new Date(stocksData.updatedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}${isStale ? " · stale" : ""}`;
  const instrumentStrip = instruments.map((s) => ({
    ...s,
    value: s.sector === "Rates" ? `${s.price.toFixed(2)}%` : fmtIndex(s.price),
  }));
  const firstInstrument = instruments[0];
  const breadth = {
    advancing: equities.filter((s) => s.change > 0).length,
    declining: equities.filter((s) => s.change < 0).length,
    unchanged: equities.filter((s) => s.change === 0).length,
  };
  const breadthTotal = Math.max(
    1,
    breadth.advancing + breadth.declining + breadth.unchanged,
  );
  const peers = [...(isInstrument ? instruments : equities)]
    .filter((s) => s.sector === stock.sector || s.symbol === stock.symbol)
    .sort((a, b) => b.confidence - a.confidence || b.change - a.change)
    .slice(0, 10);
  const selectedRows = useMemo(
    () => historyForRange(historyBySymbol[stockHistoryKey], range),
    [historyBySymbol, stockHistoryKey, range],
  );
  const rangeChangePct =
    selectedRows && selectedRows.length > 1
      ? ((selectedRows.at(-1).close - selectedRows[0].close) /
          selectedRows[0].close) *
        100
      : null;
  const statusInstruments = instruments.filter((s) =>
    ["S&P", "NASDAQ", "VIX", "10Y"].includes(s.symbol),
  );
  const triggeredAlerts = useMemo(() => {
    const out = [];
    for (const [symbol, rule] of Object.entries(alerts)) {
      const alerted = allStocks.find((s) => s.symbol === symbol);
      if (!alerted || !Number.isFinite(alerted.price) || !alerted.price)
        continue;
      if (rule?.above > 0 && alerted.price >= rule.above)
        out.push({ symbol, kind: "≥", level: rule.above, price: alerted.price });
      if (rule?.below > 0 && alerted.price <= rule.below)
        out.push({ symbol, kind: "≤", level: rule.below, price: alerted.price });
    }
    return out;
  }, [alerts, allStocks]);
  const alertedSymbols = useMemo(
    () => new Set(triggeredAlerts.map((a) => a.symbol)),
    [triggeredAlerts],
  );

  useEffect(() => {
    const alertPrefix = triggeredAlerts.length
      ? `⚠ ${triggeredAlerts.length} alert${triggeredAlerts.length > 1 ? "s" : ""} · `
      : "";
    document.title = `${alertPrefix}${selectedSymbol} · Stock Command Center`;
  }, [triggeredAlerts.length, selectedSymbol]);

  // Browser notification on each newly triggered alert (permission is asked
  // for when the first alert level is set). Fires once per alert per session.
  useEffect(() => {
    if (typeof Notification === "undefined") return;
    const current = new Set();
    for (const a of triggeredAlerts) {
      const key = `${a.symbol}-${a.kind}-${a.level}`;
      current.add(key);
      if (
        Notification.permission === "granted" &&
        !notifiedAlerts.current.has(key)
      ) {
        try {
          new Notification(`${a.symbol} ${a.kind} ${fmt(a.level)}`, {
            body: `Now trading at ${fmt(a.price)}`,
            tag: key,
          });
        } catch {}
      }
    }
    // Re-arm alerts that stopped triggering so a re-cross notifies again.
    notifiedAlerts.current = current;
  }, [triggeredAlerts]);

  function selectFirstMatch() {
    if (filtered.length) {
      setSelectedSymbol(filtered[0].symbol);
      setQuery("");
    }
  }
  function toggleStar() {
    const next = isStarred
      ? starred.filter((s) => s !== stock.symbol)
      : [...starred, stock.symbol];
    setStarred(next);
    localStorage.setItem("savedPortfolioSymbols", JSON.stringify(next));
  }
  function savePortfolio(next) {
    setPortfolio(next);
    localStorage.setItem("commandCenterPortfolio", JSON.stringify(next));
  }
  function trackCurrent() {
    if (isInstrument) return;
    if (portfolio.positions.some((p) => p.symbol === stock.symbol)) return;
    savePortfolio({
      ...portfolio,
      positions: [...portfolio.positions, { symbol: stock.symbol }],
    });
  }
  function trackTicker(event) {
    event.preventDefault();
    const symbol = newTicker.trim().toUpperCase();
    if (!/^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol)) return;
    if (!portfolio.positions.some((p) => p.symbol === symbol)) {
      savePortfolio({
        ...portfolio,
        positions: [...portfolio.positions, { symbol }],
      });
    }
    setNewTicker("");
  }
  function untrack(symbol) {
    savePortfolio({
      ...portfolio,
      positions: portfolio.positions.filter((p) => p.symbol !== symbol),
    });
  }
  function updateHolding(symbol, patch) {
    const current = holdings[symbol] || { shares: 0, avgCost: 0 };
    const next = { ...holdings, [symbol]: { ...current, ...patch } };
    setHoldings(next);
    localStorage.setItem("commandCenterHoldings", JSON.stringify(next));
  }
  function togglePrivacy() {
    const next = !privacy;
    setPrivacy(next);
    try {
      localStorage.setItem("commandCenterPrivacy", JSON.stringify(next));
    } catch {}
  }
  function setAlertBound(symbol, key, rawValue) {
    const value = Number(rawValue);
    const next = { ...alerts };
    const entry = { ...(next[symbol] || {}) };
    if (value > 0) entry[key] = value;
    else delete entry[key];
    if (Object.keys(entry).length) next[symbol] = entry;
    else delete next[symbol];
    setAlerts(next);
    try {
      localStorage.setItem("commandCenterAlerts", JSON.stringify(next));
    } catch {}
    if (
      value > 0 &&
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }
  }
  function openDrawer(view) {
    setDrawer(view);
    if (view !== "research" && view !== "catalysts") {
      window.setTimeout(
        () =>
          document
            .querySelector(".detail-drawer")
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        0,
      );
    }
  }
  function openCatalysts(text) {
    setFocusedCatalyst(
      text || stock.catalysts[0] || stock.opportunities[0] || stock.thesis,
    );
    openDrawer("catalysts");
  }
  function openNewsSearch(text, target = stock) {
    const q = encodeURIComponent(`${target.symbol} ${target.name} ${text}`);
    window.open(
      `https://www.google.com/search?tbm=nws&q=${q}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  function closeDrawer() {
    setDrawer(null);
  }
  function toggleFolder(name) {
    setFolder((current) => (current === name ? "" : name));
    setQuery("");
  }
  function cycleSort(key) {
    if (sortKey === key) {
      if (sortDir === 1) setSortDir(-1);
      else {
        setSortKey("default");
        setSortDir(1);
      }
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  }
  const sortArrow = (key) =>
    sortKey === key ? (sortDir === 1 ? " ▲" : " ▼") : "";

  return (
    <main className={`terminal ${privacy ? "privacy" : ""}`}>
      <nav className="rail">
        <a
          className="home-link"
          href="https://jez237.com/"
          title="Back to homepage"
          aria-label="Back to homepage"
        >
          <span>⌂</span>
          <b>Home</b>
        </a>
        <button title="Watchlist table" onClick={() => openDrawer("watchlist")}>
          ▦
        </button>
        <button
          title="Full research report"
          className="hot"
          onClick={() => openDrawer("report")}
        >
          ▧
        </button>
        <button title="Catalyst workbench" onClick={() => openCatalysts()}>
          ▤
        </button>
        <button title="Risks & opportunities" onClick={() => openDrawer("risks")}>
          ▭
        </button>
        <button title="Portfolio view" onClick={() => setMode("Portfolio")}>
          ⚙
        </button>
      </nav>
      <aside className="watch-panel panel">
        <div className="brand">
          <span className="bars">▰</span>
          <strong>Market Command Center</strong>
        </div>
        <div className="watch-head">
          <span>Watchlist</span>
          <button title="Search tickers" onClick={() => searchRef.current?.focus()}>
            ⌕
          </button>
          <button title="Open watchlist table" onClick={() => openDrawer("watchlist")}>
            ⋯
          </button>
        </div>
        <div className="watch-labels">
          <button onClick={() => cycleSort("symbol")}>
            Ticker{sortArrow("symbol")}
          </button>
          <button onClick={() => cycleSort("price")}>
            Price{sortArrow("price")}
          </button>
          <button onClick={() => cycleSort("change")}>
            Day %{sortArrow("change")}
          </button>
        </div>
        <div className="watchlist">
          {filtered.map((s) => (
            <button
              key={s.symbol}
              className={`watch ${s.symbol === stock.symbol ? "active" : ""}`}
              onClick={() => setSelectedSymbol(s.symbol)}
            >
              <strong>
                {alertedSymbols.has(s.symbol) ? "⚠ " : ""}
                {starred.includes(s.symbol) ? "★ " : ""}
                {s.symbol}
              </strong>
              <svg viewBox="0 0 90 28" className={s.change < 0 ? "down" : ""}>
                <path d={sparklinePath(s.chart, 90, 28)} />
              </svg>
              <span>{fmt(s.price)}</span>
              <b className={s.change >= 0 ? "up" : "down"}>
                {s.change >= 0 ? "+" : ""}
                {s.change.toFixed(2)}%
              </b>
            </button>
          ))}
          {!filtered.length && (
            <div className="watch-more">
              No tickers match{query ? ` “${query}”` : ""}
              {folder ? ` in ${folder}` : ""}.
            </div>
          )}
        </div>
        <div className="folders">
          {folders.map((f) => (
            <button
              key={f.name}
              className={folder === f.name ? "active" : ""}
              onClick={() => toggleFolder(f.name)}
            >
              ▸ {f.name}
              <b>{f.count}</b>
            </button>
          ))}
        </div>
        <div className="market-status">
          <span>
            Market Status{" "}
            <b className={marketOpen ? "up" : "down"}>
              ● {marketOpen ? "Market Open" : "Market Closed"}
            </b>
          </span>
          {statusInstruments.map((s) => (
            <p key={s.symbol}>
              <em>{s.symbol}</em>
              <strong>
                {s.sector === "Rates"
                  ? `${s.price.toFixed(2)}%`
                  : fmtIndex(s.price)}
              </strong>
              <b className={s.change >= 0 ? "up" : "down"}>
                {s.change >= 0 ? "+" : ""}
                {s.change.toFixed(2)}%
              </b>
              <svg viewBox="0 0 54 18" className={s.change < 0 ? "down" : ""}>
                <path d={sparklinePath(s.chart.slice(-20), 54, 18)} />
              </svg>
            </p>
          ))}
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <label className="global-search">
            <span>⌕</span>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && selectFirstMatch()}
              placeholder="Search company or ticker…"
            />
          </label>
          <div
            className={`live-chip ${status === "loading" ? "loading" : status === "error" || isStale ? "static" : "live"}`}
          >
            <i />
            {statusLabel}
            <button onClick={() => loadData(true)} disabled={refreshing}>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
          <div className="mode-tabs">
            {["Research", "News", "Portfolio"].map((m) => (
              <button
                key={m}
                className={mode === m ? "selected" : ""}
                onClick={() => setMode(m)}
              >
                ▣ {m}
              </button>
            ))}
          </div>
        </header>
        {triggeredAlerts.length > 0 && (
          <div className="alert-banner">
            {triggeredAlerts.map((a) => (
              <button
                key={`${a.symbol}-${a.kind}-${a.level}`}
                onClick={() => setSelectedSymbol(a.symbol)}
              >
                ⚠ {a.symbol} {a.kind} {fmt(a.level)} — now {fmt(a.price)}
              </button>
            ))}
          </div>
        )}
        <section className="market-strip panel">
          {instrumentStrip.map((s) => (
            <button
              key={s.symbol}
              onClick={() => setSelectedSymbol(s.symbol)}
              className={stock.symbol === s.symbol ? "active" : ""}
            >
              <strong>{s.symbol}</strong>
              <span>{s.value}</span>
              <b className={s.change >= 0 ? "up" : "down"}>
                {s.change >= 0 ? "+" : ""}
                {s.change.toFixed(2)}%
              </b>
              <svg viewBox="0 0 48 14" className={s.change < 0 ? "down" : ""}>
                <path d={sparklinePath(s.chart.slice(-24), 48, 14)} />
              </svg>
            </button>
          ))}
        </section>
        <div className="content-grid">
          <section className="main-stack">
            <section className="chart-panel panel">
              <div className="quote-head">
                <div>
                  <h1>{stock.symbol}</h1>
                  <strong>
                    {stock.sector === "Rates"
                      ? `${stock.price.toFixed(2)}%`
                      : fmt(stock.price)}
                  </strong>
                  <span className={stock.change >= 0 ? "up" : "down"}>
                    {dayChangeAmount(stock) >= 0 ? "+" : ""}
                    {fmt(dayChangeAmount(stock))} ({stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%)
                  </span>
                  <small className="source">
                    {stock.name}
                    {stock.exchange ? ` · ${stock.exchange}` : ""}
                  </small>
                </div>
                {!isInstrument && (
                  <button
                    onClick={toggleStar}
                    className={`star ${isStarred ? "on" : ""}`}
                    title={isStarred ? "Remove from starred" : "Add to starred"}
                  >
                    {isStarred ? "★" : "☆"}
                  </button>
                )}
                <button
                  onClick={() => setAlertsOpen((open) => !open)}
                  className={`star alert-bell ${alerts[stock.symbol] ? "on" : ""}`}
                  title={
                    alerts[stock.symbol]
                      ? "Edit price alert"
                      : "Set a price alert"
                  }
                >
                  ⚑
                </button>
                <div className="quote-stats">
                  <span>
                    Prev Close <b>{stock.prevClose ? fmt(stock.prevClose) : "—"}</b>
                  </span>
                  <span>
                    Day Range{" "}
                    <b>
                      {stock.dayLow && stock.dayHigh
                        ? `${fmt(stock.dayLow)} – ${fmt(stock.dayHigh)}`
                        : "—"}
                    </b>
                  </span>
                  <span>
                    52W Range{" "}
                    <b>
                      {stock.range52w
                        ? `${fmt(stock.range52w[0])} – ${fmt(stock.range52w[1])}`
                        : "—"}
                    </b>
                  </span>
                  <span>
                    52W Position{" "}
                    <b>
                      {position52w(stock) === null ? "—" : `${position52w(stock)}%`}
                    </b>
                  </span>
                  <span>
                    Volume <b>{fmtVolume(stock.volume)}</b>
                  </span>
                  {stock.earningsDate &&
                    new Date(`${stock.earningsDate}T12:00:00`) >=
                      new Date(Date.now() - 864e5) && (
                      <span>
                        Next Earnings{" "}
                        <b>
                          {new Date(
                            `${stock.earningsDate}T12:00:00`,
                          ).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </b>
                      </span>
                    )}
                  <span>
                    Rating <b>{stock.rating || "Watch"}</b>
                  </span>
                  <span>
                    Conviction <b>{stock.confidence}/100</b>
                  </span>
                  <span>
                    Sector <b>{stock.sector}</b>
                  </span>
                  <span>
                    Currency <b>{stock.currency || "USD"}</b>
                  </span>
                  <span>
                    Quote Time{" "}
                    <b>
                      {stock.quoteUpdatedAt
                        ? new Date(stock.quoteUpdatedAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </b>
                  </span>
                </div>
              </div>
              {alertsOpen && (
                <div className="alert-editor">
                  <span>Alert when {stock.symbol} trades</span>
                  <label>
                    at or above
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      placeholder="—"
                      value={alerts[stock.symbol]?.above || ""}
                      onChange={(e) =>
                        setAlertBound(stock.symbol, "above", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    at or below
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      placeholder="—"
                      value={alerts[stock.symbol]?.below || ""}
                      onChange={(e) =>
                        setAlertBound(stock.symbol, "below", e.target.value)
                      }
                    />
                  </label>
                  <small>Checked against each data refresh in this browser.</small>
                  <button onClick={() => setAlertsOpen(false)}>Done</button>
                </div>
              )}
              <div className="rangebar">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    className={range === r ? "active" : ""}
                    onClick={() => setRange(r)}
                  >
                    {r}
                  </button>
                ))}
                <button
                  onClick={() => setIndicators(!indicators)}
                  className="indicator"
                >
                  ⌁ {indicators ? "SMA on" : "SMA off"}
                </button>
                <button title="Full report" onClick={() => openDrawer("report")}>
                  ⛶
                </button>
                <button title="Catalysts" onClick={() => openCatalysts()}>
                  ⋯
                </button>
              </div>
              <div className="chart-toolbar">
                <div>
                  <strong>{range} performance</strong>
                  <span>{RANGE_DESCRIPTIONS[range]}</span>
                </div>
                <div className="chart-modes">
                  {["Line", "Candles", "Volume"].map((m) => (
                    <button
                      key={m}
                      className={chartMode === m ? "active" : ""}
                      onClick={() => setChartMode(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <b
                  className={
                    rangeChangePct === null
                      ? ""
                      : rangeChangePct >= 0
                        ? "up"
                        : "down"
                  }
                >
                  {rangeChangePct === null
                    ? "—"
                    : `${rangeChangePct >= 0 ? "+" : ""}${rangeChangePct.toFixed(2)}%`}
                </b>
              </div>
              <div className="chart-wrap">
                <HiResChart
                  stock={stock}
                  range={range}
                  chartMode={chartMode}
                  indicators={indicators}
                  history={historyBySymbol[stockHistoryKey] || null}
                />
                <div className="unit-badge">
                  {stock.currency || "USD"}
                  {isInstrument ? "" : " / share"} · hover candles for O/H/L/C
                </div>
              </div>
            </section>
            {mode === "Portfolio" && (
              <PortfolioPanel
                positions={positions}
                holdings={holdings}
                historyBySymbol={historyBySymbol}
                benchmarks={BENCHMARKS}
                onSelect={setSelectedSymbol}
              />
            )}
            <section className="heat-panel panel">
              {sectorGroups.map(({ group, items }) => (
                <div key={group} className="heat-sector">
                  <span>
                    {group}
                    <b>{items.length}</b>
                  </span>
                  <div>
                    {items.slice(0, 8).map((s) => (
                      <button
                        key={s.symbol}
                        onClick={() => setSelectedSymbol(s.symbol)}
                        className={s.change >= 0 ? "gain" : "loss"}
                      >
                        <strong>{s.symbol}</strong>
                        <em>
                          {s.change >= 0 ? "+" : ""}
                          {s.change.toFixed(2)}%
                        </em>
                        <small>${fmt(s.price)}</small>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
            <section className="research-deck">
              <article
                className="panel research-slice readout-slice"
                onClick={() => openDrawer("research")}
              >
                <div className="card-title">
                  Investment Readout <button>{stock.symbol}</button>
                </div>
                <strong>{setupLabel(stock)}</strong>
                <p>
                  {postureLabel(stock)} · {stock.thesis}
                </p>
              </article>
              <article
                className="panel research-slice catalyst-slice"
                onClick={() => openCatalysts()}
              >
                <div className="card-title">Catalysts to Watch</div>
                {stock.catalysts.slice(0, 4).map((text) => (
                  <button
                    key={text}
                    onClick={(e) => {
                      e.stopPropagation();
                      openCatalysts(text);
                    }}
                    className="mini-catalyst"
                  >
                    {text}
                  </button>
                ))}
              </article>
              <article className="panel research-slice decision-slice">
                <div className="card-title">
                  Decision Frame{" "}
                  <button>{stock.change >= 0 ? "Constructive" : "Caution"}</button>
                </div>
                <p>
                  <b className="up">Stay interested if:</b> {stock.opportunities[0]}
                </p>
                <p>
                  <b className="down">Reassess if:</b> {stock.risks[0]}
                </p>
                <small>
                  Next check: {stock.catalysts[0] || "fresh catalyst update"}
                </small>
              </article>
            </section>
            <section className="panel peer-table">
              <div className="card-title">
                Peer / Sector Comparison{" "}
                <button
                  onClick={() => {
                    setFolder("");
                    openDrawer("watchlist");
                  }}
                >
                  {stock.sector}
                </button>
              </div>
              <div className="peer-head">
                <span>Ticker</span>
                <span>Name</span>
                <span>Last</span>
                <span>%</span>
                <span>Volume</span>
                <span>52W Pos</span>
                <span>Rating</span>
                <span>Conv.</span>
                <span>Trend</span>
              </div>
              {peers.map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => setSelectedSymbol(s.symbol)}
                  className={s.symbol === stock.symbol ? "active" : ""}
                >
                  <strong>{s.symbol}</strong>
                  <span>{s.name}</span>
                  <span>
                    {s.sector === "Rates" ? `${fmt(s.price)}%` : `$${fmt(s.price)}`}
                  </span>
                  <b className={s.change >= 0 ? "up" : "down"}>
                    {s.change >= 0 ? "+" : ""}
                    {s.change.toFixed(2)}%
                  </b>
                  <span>{fmtVolume(s.volume)}</span>
                  <span>
                    {position52w(s) === null ? "—" : `${position52w(s)}%`}
                  </span>
                  <span>{s.rating || "Watch"}</span>
                  <span>{s.confidence}/100</span>
                  <svg viewBox="0 0 96 22" className={s.change < 0 ? "down" : ""}>
                    <path d={sparklinePath(s.chart, 96, 22)} />
                  </svg>
                </button>
              ))}
            </section>
            <section className="bottom-grid movers-grid">
              <div className="panel movers">
                <div className="card-title">
                  Today’s Top Movers{" "}
                  <button>
                    {dataAgeMinutes === null ? "…" : `${dataAgeMinutes}m ago`}
                  </button>
                </div>
                {topMovers.map((s) => (
                  <button key={s.symbol} onClick={() => setSelectedSymbol(s.symbol)}>
                    <strong>{s.symbol}</strong>
                    <svg viewBox="0 0 96 24" className={s.change < 0 ? "down" : ""}>
                      <path d={sparklinePath(s.chart, 96, 24)} />
                    </svg>
                    <span>{s.name}</span>
                    <span>${fmt(s.price)}</span>
                    <b className={s.change >= 0 ? "up" : "down"}>
                      {s.change >= 0 ? "+" : ""}
                      {s.change.toFixed(2)}%
                    </b>
                    <small>{s.sector}</small>
                  </button>
                ))}
              </div>
            </section>
            <section className="terminal-grid">
              <article className="panel dense-list catalyst-radar-wide">
                <div className="card-title">
                  Catalyst Radar{" "}
                  <button onClick={() => openCatalysts()}>{stock.symbol}</button>
                </div>
                {radarItems.map((item) => (
                  <button
                    key={`${item.label}-${item.text}`}
                    className="radar-row"
                    onClick={() => openCatalysts(item.text)}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.text}</span>
                    <b className={item.tone}>{item.type}</b>
                  </button>
                ))}
              </article>
              <article className="panel dense-list">
                <div className="card-title">Risk Matrix</div>
                {stock.risks.slice(0, 4).map((text, index) => (
                  <p key={text}>
                    <strong>R{index + 1}</strong>
                    <span>{text}</span>
                    <b className="down">Watch</b>
                  </p>
                ))}
              </article>
              <article className="panel dense-list">
                <div className="card-title">Opportunity Matrix</div>
                {stock.opportunities.slice(0, 4).map((text, index) => (
                  <p key={text}>
                    <strong>O{index + 1}</strong>
                    <span>{text}</span>
                    <b className="up">Open</b>
                  </p>
                ))}
              </article>
            </section>
          </section>
          <aside
            className={`right-stack ${drawer === "catalysts" || drawer === "research" ? "catalyst-mode" : ""}`}
          >
            {drawer === "research" ? (
              <section className="panel catalyst-workbench readout-workbench">
                <div className="card-title">
                  {stock.symbol} Investment Readout{" "}
                  <button onClick={closeDrawer}>Collapse</button>
                </div>
                <p className="workbench-note">
                  Plain-English decision frame for the selected stock or market
                  instrument.
                </p>
                {readoutRows.map((row) => (
                  <button
                    key={`${row.label}-${row.text}`}
                    className="workbench-row"
                    onClick={() => openDrawer("report")}
                  >
                    <span>{row.label}</span>
                    <strong>{row.text}</strong>
                    <b className={row.tone}>{row.value}</b>
                  </button>
                ))}
              </section>
            ) : drawer === "catalysts" ? (
              <section className="panel catalyst-workbench">
                <div className="card-title">
                  {stock.symbol} Catalyst Workbench{" "}
                  <button onClick={closeDrawer}>Collapse</button>
                </div>
                {focusedItem && (
                  <div className="focused-catalyst">
                    <span>Focused catalyst</span>
                    <strong>{focusedItem.text}</strong>
                    <button onClick={() => openNewsSearch(focusedItem.text)}>
                      Open news
                    </button>
                  </div>
                )}
                <p className="workbench-note">
                  Catalyst mode stays active as you change stocks. Click any item
                  to open a live news search.
                </p>
                {workbenchItems.map((item) => (
                  <button
                    key={`${item.label}-${item.text}`}
                    className={`workbench-row ${focusedItem?.text === item.text ? "active" : ""}`}
                    onClick={() => {
                      setFocusedCatalyst(item.text);
                      openNewsSearch(item.text);
                    }}
                  >
                    <span>{item.label}</span>
                    <strong>{item.text}</strong>
                    <b className={item.tone}>{item.type}</b>
                  </button>
                ))}
              </section>
            ) : (
              <>
                {mode === "News" && (
                  <section className="panel news-panel">
                    <div className="card-title">
                      News Radar <button>{equities.length} tickers</button>
                    </div>
                    <p className="workbench-note">
                      Top catalyst per tracked name, sorted by today’s move. Each
                      row opens a live news search in a new tab.
                    </p>
                    {[...equities]
                      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                      .map((s) => (
                        <button
                          key={s.symbol}
                          className="news-row"
                          onClick={() => openNewsSearch(s.catalysts[0] || "", s)}
                        >
                          <strong>{s.symbol}</strong>
                          <span>{s.catalysts[0] || s.thesis}</span>
                          <b className={s.change >= 0 ? "up" : "down"}>
                            {s.change >= 0 ? "+" : ""}
                            {s.change.toFixed(2)}%
                          </b>
                          <em>↗</em>
                        </button>
                      ))}
                  </section>
                )}
                {mode === "Portfolio" && (
                  <section className="panel holdings-editor">
                    <div className="card-title">
                      Portfolio P&L{" "}
                      <button
                        className="privacy-toggle"
                        title={
                          privacy
                            ? "Show dollar amounts"
                            : "Hide dollar amounts (privacy mode)"
                        }
                        onClick={togglePrivacy}
                      >
                        {privacy ? "🙈" : "👁"}
                      </button>
                      <button
                        onClick={trackCurrent}
                        disabled={
                          isInstrument ||
                          portfolio.positions.some(
                            (p) => p.symbol === stock.symbol,
                          )
                        }
                      >
                        {portfolio.positions.some(
                          (p) => p.symbol === stock.symbol,
                        )
                          ? `${stock.symbol} tracked ✓`
                          : `Track ${stock.symbol}`}
                      </button>
                    </div>
                    <div className="pl-summary">
                      <span>
                        Market Value <b>${fmt(plSummary.value)}</b>
                      </span>
                      <span>
                        Cost Basis <b>${fmt(plSummary.cost)}</b>
                      </span>
                      <span>
                        Day P&L{" "}
                        <b className={plSummary.dayPl >= 0 ? "up" : "down"}>
                          {plSummary.dayPl >= 0 ? "+" : ""}${fmt(plSummary.dayPl)}
                        </b>
                      </span>
                      <span>
                        Total P&L{" "}
                        <b className={plSummary.totalPl >= 0 ? "up" : "down"}>
                          {plSummary.totalPl >= 0 ? "+" : ""}$
                          {fmt(plSummary.totalPl)} (
                          {plSummary.totalPlPct >= 0 ? "+" : ""}
                          {plSummary.totalPlPct.toFixed(1)}%)
                        </b>
                      </span>
                      <span>
                        Positions Sized{" "}
                        <b>
                          {plSummary.held}/{positions.length}
                        </b>
                      </span>
                    </div>
                    <div className="holdings-controls">
                      <label>
                        Sort
                        <select
                          value={holdingsSort}
                          onChange={(e) => setHoldingsSort(e.target.value)}
                        >
                          <option value="default">Tracking order</option>
                          <option value="ticker">Ticker</option>
                          <option value="value">Market value</option>
                          <option value="daypl">Day P&L</option>
                        </select>
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={hideUnsized}
                          onChange={(e) => setHideUnsized(e.target.checked)}
                        />
                        Hide unsized
                      </label>
                    </div>
                    {displayedPositions.map((position) => {
                      const holding = holdings[position.symbol];
                      const sized = holding && holding.shares > 0;
                      const value = sized
                        ? holding.shares * position.stock.price
                        : 0;
                      const pl =
                        sized && holding.avgCost > 0
                          ? value - holding.shares * holding.avgCost
                          : null;
                      const plPct =
                        pl !== null && holding.avgCost > 0
                          ? (pl / (holding.shares * holding.avgCost)) * 100
                          : null;
                      return (
                        <div key={position.symbol} className="holding-row">
                          <strong
                            role="button"
                            tabIndex={0}
                            title={`View ${position.symbol} chart`}
                            onClick={() => setSelectedSymbol(position.symbol)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              setSelectedSymbol(position.symbol)
                            }
                          >
                            {position.symbol}
                          </strong>
                          <label>
                            Shares
                            <input
                              type="number"
                              inputMode="decimal"
                              min="0"
                              step="any"
                              value={holding?.shares || ""}
                              placeholder="0"
                              onChange={(e) =>
                                updateHolding(position.symbol, {
                                  shares: Number(e.target.value) || 0,
                                })
                              }
                            />
                          </label>
                          <label>
                            Avg Cost
                            <input
                              type="number"
                              inputMode="decimal"
                              min="0"
                              step="any"
                              value={holding?.avgCost || ""}
                              placeholder="0.00"
                              onChange={(e) =>
                                updateHolding(position.symbol, {
                                  avgCost: Number(e.target.value) || 0,
                                })
                              }
                            />
                          </label>
                          <span className="holding-value">
                            {sized
                              ? `$${fmt(value)}`
                              : `$${fmt(position.stock.price)}`}
                            <b
                              className={
                                (pl ?? dayChangeAmount(position.stock)) >= 0
                                  ? "up"
                                  : "down"
                              }
                            >
                              {pl === null
                                ? `${position.stock.change >= 0 ? "+" : ""}${position.stock.change.toFixed(2)}%`
                                : `${pl >= 0 ? "+" : ""}$${fmt(pl)}${plPct === null ? "" : ` (${plPct >= 0 ? "+" : ""}${plPct.toFixed(1)}%)`}`}
                            </b>
                          </span>
                          <button
                            className="remove"
                            title={`Stop tracking ${position.symbol}`}
                            onClick={() => untrack(position.symbol)}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                    {unpricedPositions.map((position) => (
                      <div key={position.symbol} className="holding-row ghost">
                        <strong>{position.symbol}</strong>
                        <span>
                          Awaiting price data — quotes start once the symbol is
                          in data/portfolio.json at the next refresh.
                        </span>
                        <button
                          className="remove"
                          title={`Stop tracking ${position.symbol}`}
                          onClick={() => untrack(position.symbol)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <form className="add-ticker" onSubmit={trackTicker}>
                      <input
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value)}
                        placeholder="Track any ticker (e.g. TSLA)"
                        maxLength={10}
                        aria-label="Track any ticker"
                      />
                      <button
                        type="submit"
                        disabled={
                          !/^[A-Za-z][A-Za-z0-9.-]{0,9}$/.test(newTicker.trim())
                        }
                      >
                        Add
                      </button>
                    </form>
                    <small>
                      Share counts and cost basis live only in this browser
                      (localStorage). The public site never stores or uploads
                      them.
                    </small>
                  </section>
                )}
                <section className="panel catalyst-card">
                  <div className="card-title">
                    Catalyst Radar{" "}
                    <button onClick={() => openCatalysts()}>{stock.symbol}</button>
                  </div>
                  {radarItems.map((item) => (
                    <article
                      key={`${stock.symbol}-${item.label}`}
                      onClick={() => openCatalysts(item.text)}
                    >
                      <span>{item.label}</span>
                      <strong>{item.text}</strong>
                      <b className={`${item.tone} badge`}>{item.type}</b>
                    </article>
                  ))}
                </section>
                {mode === "Research" && (
                  <section className="panel ai-card">
                    <div className="ai-label">AI</div>
                    <div className="card-title">
                      Research Summary{" "}
                      <button>
                        {stock.kind === "instrument" ? "Macro" : "Equity"}
                      </button>
                    </div>
                    <h2>
                      {stock.symbol} <small>{stock.name}</small>
                    </h2>
                    <b className="rating">
                      ⌁{" "}
                      {stock.confidence > 82
                        ? "Strong Bullish"
                        : stock.confidence > 68
                          ? "Constructive"
                          : "Watch Carefully"}
                    </b>
                    <p>{stock.thesis}</p>
                    <div className="drivers">
                      <span>Key Drivers</span>
                      {stock.opportunities.slice(0, 3).map((text) => (
                        <em key={text}>● {text}</em>
                      ))}
                      <em>
                        ● Price move today: {stock.change >= 0 ? "+" : ""}
                        {stock.change.toFixed(2)}%
                      </em>
                    </div>
                    <button
                      onClick={() => openDrawer("report")}
                      className="full-report"
                    >
                      View Full Research Report ›
                    </button>
                  </section>
                )}
                <section className="panel risks">
                  <div className="card-title">
                    Risks & Opportunities{" "}
                    <button onClick={() => openDrawer("risks")}>View all</button>
                  </div>
                  <h2>Opportunities</h2>
                  {stock.opportunities.slice(0, 2).map((text) => (
                    <p key={text} className="good">
                      ● {text}
                    </p>
                  ))}
                  <h2>Risks</h2>
                  {stock.risks.slice(0, 2).map((text) => (
                    <p key={text} className="bad">
                      ● {text}
                    </p>
                  ))}
                  <div className="signal-row">
                    <span>
                      Conviction <b>{stock.confidence}/100</b>
                    </span>
                    <span>
                      Rating <b>{stock.rating || "Watch"}</b>
                    </span>
                  </div>
                  {!isInstrument && (
                    <button onClick={toggleStar} className="save">
                      {isStarred ? "★ Starred" : "☆ Add to Starred"}
                    </button>
                  )}
                </section>
                {mode === "Research" && firstInstrument && (
                  <section className="panel market-summary">
                    <div className="card-title">
                      Market Summary{" "}
                      <button
                        onClick={() => setSelectedSymbol(firstInstrument.symbol)}
                      >
                        {firstInstrument.symbol}
                      </button>
                    </div>
                    <strong>
                      {firstInstrument.name}
                      <br />
                      {fmtIndex(firstInstrument.price)}
                    </strong>
                    <span className={firstInstrument.change >= 0 ? "up" : "down"}>
                      {firstInstrument.change >= 0 ? "+" : ""}
                      {firstInstrument.change.toFixed(2)}%
                    </span>
                    <svg
                      viewBox="0 0 230 72"
                      className={firstInstrument.change < 0 ? "down" : ""}
                    >
                      <path d={sparklinePath(firstInstrument.chart, 230, 72)} />
                    </svg>
                    <div className="breadth">
                      <span>
                        Advancing <b>{breadth.advancing}</b>
                      </span>
                      <span>
                        Declining <b>{breadth.declining}</b>
                      </span>
                      <span>
                        Unchanged <b>{breadth.unchanged}</b>
                      </span>
                    </div>
                    <div className="bar">
                      <i style={{ flex: breadth.advancing / breadthTotal }} />
                      <i style={{ flex: breadth.declining / breadthTotal }} />
                      <i
                        style={{
                          flex: Math.max(0.02, breadth.unchanged / breadthTotal),
                        }}
                      />
                    </div>
                  </section>
                )}
              </>
            )}
          </aside>
        </div>
        {drawer && drawer !== "research" && drawer !== "catalysts" && (
          <section className="detail-drawer panel">
            <div className="drawer-head">
              <div>
                <span className="eyebrow">Command detail</span>
                <h2>
                  {drawer === "report"
                    ? `${stock.symbol} Full Research Report`
                    : drawer === "risks"
                      ? "Risks & Opportunities"
                      : "Tracked Watchlist"}
                </h2>
              </div>
              <button onClick={closeDrawer}>Close ×</button>
            </div>
            {drawer === "report" && (
              <div className="drawer-grid report-view">
                <article>
                  <h3>Thesis</h3>
                  <p>{stock.thesis}</p>
                  <dl>
                    <dt>Conviction</dt>
                    <dd>{stock.confidence}/100</dd>
                    <dt>Sector</dt>
                    <dd>{stock.sector}</dd>
                    <dt>52W range</dt>
                    <dd>
                      {stock.range52w
                        ? `${fmt(stock.range52w[0])} – ${fmt(stock.range52w[1])}`
                        : "—"}
                    </dd>
                    <dt>Rating</dt>
                    <dd>{stock.rating || "Watch"}</dd>
                    <dt>Exchange</dt>
                    <dd>{stock.exchange || "—"}</dd>
                  </dl>
                </article>
                <article>
                  <h3>Catalysts</h3>
                  {stock.catalysts.map((text) => (
                    <p key={text}>● {text}</p>
                  ))}
                  <h3>Key drivers</h3>
                  {stock.opportunities.map((text) => (
                    <p key={text} className="good">
                      + {text}
                    </p>
                  ))}
                </article>
                <article>
                  <h3>Risk checklist</h3>
                  {stock.risks.map((text) => (
                    <p key={text} className="bad">
                      − {text}
                    </p>
                  ))}
                  <button
                    onClick={() => setMode("Portfolio")}
                    className="drawer-action"
                  >
                    Open portfolio view
                  </button>
                </article>
              </div>
            )}
            {drawer === "risks" && (
              <div className="drawer-grid">
                <article>
                  <h3>Risks</h3>
                  {stock.risks.map((text) => (
                    <p key={text} className="bad">
                      ● {text}
                    </p>
                  ))}
                </article>
                <article>
                  <h3>Opportunities</h3>
                  {stock.opportunities.map((text) => (
                    <p key={text} className="good">
                      ● {text}
                    </p>
                  ))}
                </article>
                <article>
                  <h3>Decision frame</h3>
                  <p>
                    Use this panel as the quick checklist for whether news changes
                    the story. If a catalyst validates an opportunity, the stock
                    deserves attention. If a risk moves from theoretical to
                    active, it belongs on the watch list.
                  </p>
                </article>
              </div>
            )}
            {drawer === "watchlist" && (
              <div className="drawer-table watchlist-table">
                {filtered.map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => {
                      setSelectedSymbol(s.symbol);
                      setDrawer("report");
                    }}
                  >
                    <strong>{s.symbol}</strong>
                    <span>{s.name}</span>
                    <span>${fmt(s.price)}</span>
                    <b className={s.change >= 0 ? "up" : "down"}>
                      {s.change >= 0 ? "+" : ""}
                      {s.change.toFixed(2)}%
                    </b>
                    <small>{s.sector}</small>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
