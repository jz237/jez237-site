// Data constants, history-range selection, and localStorage access.

export const RANGES = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "MAX"];

export const RANGE_DESCRIPTIONS = {
  "1D": "Last session · 5 minute bars",
  "5D": "5 trading days · 30 minute bars",
  "1M": "1 month · daily bars",
  "3M": "3 months · daily bars",
  "6M": "6 months · daily bars",
  YTD: "Year to date · daily bars",
  "1Y": "1 year · daily bars",
  "5Y": "5 years · weekly bars",
  MAX: "Full history · monthly bars",
};

export const AUTO_REFRESH_MS = 600 * 1e3;

export const FALLBACK_STOCKS = [
  {
    symbol: "NVDA",
    name: "NVIDIA",
    sector: "Semiconductors",
    price: 0,
    change: 0,
    confidence: 88,
    thesis:
      "Data is still loading. If this message persists, the price data files could not be fetched.",
    risks: ["Data unavailable"],
    opportunities: ["Data unavailable"],
    catalysts: ["Data unavailable"],
    chart: [],
  },
];

export function rowsToOhlc(rows) {
  return rows.map(([time, open, high, low, close, volume]) => ({
    time,
    open,
    high,
    low,
    close,
    volume,
  }));
}

export function historyForRange(history, stock, range) {
  const symbolHistory = history?.symbols?.[stock.dataSymbol || stock.symbol];
  if (!symbolHistory) return null;
  let rows = null;
  if (range === "1D" && symbolHistory.i1d) rows = rowsToOhlc(symbolHistory.i1d);
  else if (range === "5D" && symbolHistory.i5d)
    rows = rowsToOhlc(symbolHistory.i5d);
  else if (range === "5Y" && symbolHistory.w5y)
    rows = rowsToOhlc(symbolHistory.w5y);
  else if (range === "MAX" && symbolHistory.mmax)
    rows = rowsToOhlc(symbolHistory.mmax);
  else if (symbolHistory.d1y) {
    const daily = rowsToOhlc(symbolHistory.d1y);
    if (range === "1M") rows = daily.slice(-22);
    else if (range === "3M") rows = daily.slice(-64);
    else if (range === "6M") rows = daily.slice(-128);
    else if (range === "YTD") {
      const jan1 = `${new Date().getFullYear()}-01-01`;
      rows = daily.filter((row) => String(row.time) >= jan1);
    } else if (range === "1Y") rows = daily;
  }
  return rows && rows.length >= 2 ? rows : null;
}

export function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
