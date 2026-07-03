#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const dataDir = path.join(repoRoot, "stock-market", "data");
const stocksPath = path.join(dataDir, "stocks.json");
const historyDir = path.join(dataDir, "history");

// Must match historyFileName() in stock-market-src/src/lib/data.js.
function historyFileName(symbol) {
  return `${symbol.replace(/[^A-Za-z0-9.-]/g, "_")}.json`;
}

const yahooSymbols = {
  "S&P": "^GSPC",
  NASDAQ: "^IXIC",
  DOW: "^DJI",
  VIX: "^VIX",
  "10Y": "^TNX",
  DXY: "DX-Y.NYB",
  BTC: "BTC-USD",
  WTI: "CL=F",
  GOLD: "GC=F"
};

const historyRanges = [
  ["i1d", "1d", "5m", true],
  ["i5d", "5d", "30m", true],
  ["d1y", "1y", "1d", false],
  ["w5y", "5y", "1wk", false],
  ["mmax", "max", "1mo", false]
];

// "intraday" refreshes quotes plus the intraday ranges only, reusing the stored
// daily history (with today's bar merged in). Anything else is a full refresh.
const intradayOnly = process.env.STOCK_REFRESH_MODE === "intraday";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const round = value => Number.isFinite(value) ? Number(value.toFixed(4)) : null;
const dateStamp = seconds => new Date(seconds * 1000).toISOString().slice(0, 10);

function yahooSymbol(symbol) {
  return yahooSymbols[symbol] || symbol;
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function writeJson(file, data, { compact = false } = {}) {
  await fs.writeFile(file, `${JSON.stringify(data, null, compact ? 0 : 2)}\n`);
}

async function fetchChart(symbol, range, interval) {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
  url.searchParams.set("range", range);
  url.searchParams.set("interval", interval);
  url.searchParams.set("includePrePost", "false");
  const res = await fetch(url, {
    headers: {
      "accept": "application/json",
      "user-agent": "Mozilla/5.0 jez237 stock command center refresh"
    }
  });
  if (!res.ok) throw new Error(`${symbol} ${range}/${interval}: HTTP ${res.status}`);
  const json = await res.json();
  const error = json?.chart?.error;
  if (error) throw new Error(`${symbol} ${range}/${interval}: ${error.description || error.code}`);
  const result = json?.chart?.result?.[0];
  if (!result?.timestamp?.length) throw new Error(`${symbol} ${range}/${interval}: no chart bars`);
  return result;
}

function rowsFromChart(result, intraday) {
  const quote = result.indicators?.quote?.[0] || {};
  const timestamps = result.timestamp || [];
  const rows = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = round(quote.close?.[i]);
    if (close == null) continue;
    rows.push([
      intraday ? timestamps[i] : dateStamp(timestamps[i]),
      round(quote.open?.[i]) ?? close,
      round(quote.high?.[i]) ?? close,
      round(quote.low?.[i]) ?? close,
      close,
      Math.round(quote.volume?.[i] || 0)
    ]);
  }
  return rows;
}

function latestClose(rows) {
  for (let i = rows.length - 1; i >= 0; i--) {
    if (Number.isFinite(rows[i][4])) return rows[i][4];
  }
  return null;
}

function previousClose(rows) {
  const closes = rows.map(row => row[4]).filter(Number.isFinite);
  return closes.length > 1 ? closes[closes.length - 2] : null;
}

function updateStock(stock, yahoo, quoteResult, dailyRows) {
  const meta = quoteResult.meta || {};
  const price = round(meta.regularMarketPrice) ?? latestClose(dailyRows) ?? stock.price;
  const prev = round(meta.previousClose) ?? round(meta.chartPreviousClose) ?? previousClose(dailyRows) ?? stock.prevClose;
  const changeAmount = Number.isFinite(price) && Number.isFinite(prev) ? round(price - prev) : stock.changeAmount;
  const change = Number.isFinite(changeAmount) && Number.isFinite(prev) && prev !== 0 ? round((changeAmount / prev) * 100) : stock.change;
  const closes = dailyRows.map(row => row[4]).filter(Number.isFinite);
  const computedLow = closes.length ? Math.min(...closes) : null;
  const computedHigh = closes.length ? Math.max(...closes) : null;

  stock.price = price;
  stock.change = change;
  stock.changeAmount = changeAmount;
  stock.prevClose = prev;
  stock.dayLow = round(meta.regularMarketDayLow) ?? stock.dayLow;
  stock.dayHigh = round(meta.regularMarketDayHigh) ?? stock.dayHigh;
  stock.range52w = [
    round(meta.fiftyTwoWeekLow) ?? round(computedLow) ?? stock.range52w?.[0] ?? null,
    round(meta.fiftyTwoWeekHigh) ?? round(computedHigh) ?? stock.range52w?.[1] ?? null
  ];
  stock.volume = Math.round(meta.regularMarketVolume || latestVolume(dailyRows) || stock.volume || 0);
  stock.currency = meta.currency || stock.currency || "USD";
  stock.exchange = meta.fullExchangeName || meta.exchangeName || stock.exchange || "";
  stock.chart = closes.slice(-60);
  stock.quoteSource = "yahoo-finance-chart";
  stock.quoteUpdatedAt = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString();
  if (!stock.name && meta.longName) stock.name = meta.longName;
  if (!stock.name) stock.name = stock.symbol;
  if (yahoo !== stock.symbol) stock.yahooSymbol = yahoo;
}

function latestVolume(rows) {
  for (let i = rows.length - 1; i >= 0; i--) {
    if (Number.isFinite(rows[i][5])) return rows[i][5];
  }
  return null;
}

function mergeDailyRows(existing, recent) {
  const rows = existing.map(row => [...row]);
  for (const row of recent) {
    const index = rows.findIndex(candidate => candidate[0] === row[0]);
    if (index >= 0) rows[index] = row;
    else rows.push(row);
  }
  return rows.slice(-270);
}

async function readSymbolHistory(yahoo) {
  try {
    return await readJson(path.join(historyDir, historyFileName(yahoo)));
  } catch {
    return {};
  }
}

const USER_AGENT = "Mozilla/5.0 jez237 stock command center refresh";

// Best-effort next-earnings dates. Yahoo's quoteSummary API needs a
// cookie+crumb pair; if any part of the dance fails we return null and the
// previously stamped dates stay as they are.
async function fetchEarningsDates(symbols) {
  try {
    const cookieRes = await fetch("https://fc.yahoo.com/", {
      headers: { "user-agent": USER_AGENT },
      redirect: "manual"
    });
    const cookie = (cookieRes.headers.get("set-cookie") || "").split(";")[0];
    if (!cookie) return null;
    const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
      headers: { accept: "text/plain", cookie, "user-agent": USER_AGENT }
    });
    if (!crumbRes.ok) return null;
    const crumb = (await crumbRes.text()).trim();
    if (!crumb || crumb.includes("<")) return null;

    const dates = {};
    for (const symbol of symbols) {
      try {
        const url = new URL(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}`);
        url.searchParams.set("modules", "calendarEvents");
        url.searchParams.set("crumb", crumb);
        const res = await fetch(url, {
          headers: { accept: "application/json", cookie, "user-agent": USER_AGENT }
        });
        if (!res.ok) continue;
        const json = await res.json();
        const raw = json?.quoteSummary?.result?.[0]?.calendarEvents?.earnings?.earningsDate?.[0]?.raw;
        if (Number.isFinite(raw)) dates[symbol] = new Date(raw * 1000).toISOString().slice(0, 10);
        await sleep(120);
      } catch {
        // per-symbol best effort
      }
    }
    return Object.keys(dates).length ? dates : null;
  } catch {
    return null;
  }
}

// Symbols listed in portfolio.json but absent from stocks.json get a minimal
// equity entry so quotes and charts start flowing; research fields stay as
// placeholders until real research is written for them.
async function adoptPortfolioSymbols(stocksData) {
  let positions = [];
  try {
    positions = (await readJson(path.join(dataDir, "portfolio.json"))).positions || [];
  } catch {
    return;
  }
  const known = new Set((stocksData.stocks || []).map(stock => stock.symbol));
  for (const { symbol } of positions) {
    if (!symbol || known.has(symbol)) continue;
    known.add(symbol);
    stocksData.stocks.push({
      symbol,
      kind: "equity",
      name: "",
      sector: "Unclassified",
      rating: "Watch",
      confidence: 50,
      thesis: `${symbol} is tracked from portfolio.json. Automated research has not been generated for it yet.`,
      risks: ["No research recorded for this symbol yet."],
      opportunities: ["Price tracking only; research pending."],
      catalysts: ["Next earnings update"],
      price: 0,
      change: 0,
      changeAmount: 0,
      prevClose: null,
      chart: []
    });
    console.log(`Adopted ${symbol} from portfolio.json (minimal entry created).`);
  }
}

async function main() {
  const stocksData = await readJson(stocksPath);
  await adoptPortfolioSymbols(stocksData);
  await fs.mkdir(historyDir, { recursive: true });

  const now = new Date().toISOString();
  const failures = [];
  let updated = 0;

  for (const stock of stocksData.stocks || []) {
    const yahoo = yahooSymbol(stock.symbol);
    try {
      const quoteResult = await fetchChart(yahoo, "5d", "1d");
      const symbolHistory = await readSymbolHistory(yahoo);
      let dailyRows;
      if (intradayOnly && Array.isArray(symbolHistory.d1y) && symbolHistory.d1y.length) {
        dailyRows = mergeDailyRows(symbolHistory.d1y, rowsFromChart(quoteResult, false));
      } else {
        const yearResult = await fetchChart(yahoo, "1y", "1d");
        dailyRows = rowsFromChart(yearResult, false);
      }
      if (!dailyRows.length) throw new Error(`${yahoo}: no daily rows`);
      updateStock(stock, yahoo, quoteResult, dailyRows);

      symbolHistory.d1y = dailyRows;
      for (const [key, range, interval, intraday] of historyRanges) {
        if (key === "d1y") continue;
        if (intradayOnly && !intraday) continue;
        try {
          const result = await fetchChart(yahoo, range, interval);
          const rows = rowsFromChart(result, intraday);
          if (rows.length) symbolHistory[key] = rows;
          await sleep(90);
        } catch (error) {
          failures.push(`${stock.symbol}/${key}: ${error.message}`);
        }
      }
      symbolHistory.symbol = yahoo;
      symbolHistory.updatedAt = now;
      symbolHistory.source = "yahoo-finance-chart";
      symbolHistory.format = "[time, open, high, low, close, volume]; i*=unix seconds, others=YYYY-MM-DD";
      await writeJson(path.join(historyDir, historyFileName(yahoo)), symbolHistory, { compact: true });
      updated++;
      await sleep(140);
    } catch (error) {
      failures.push(`${stock.symbol}: ${error.message}`);
    }
  }

  if (!updated) {
    throw new Error(`No stock records updated.\n${failures.join("\n")}`);
  }

  if (!intradayOnly) {
    const equities = (stocksData.stocks || []).filter(stock => (stock.kind || "equity") === "equity");
    const earnings = await fetchEarningsDates(equities.map(stock => yahooSymbol(stock.symbol)));
    if (earnings) {
      for (const stock of equities) {
        const date = earnings[yahooSymbol(stock.symbol)];
        if (date) stock.earningsDate = date;
      }
      console.log(`Stamped next-earnings dates for ${Object.keys(earnings).length} symbols.`);
    } else {
      console.warn("Earnings-date enrichment skipped (crumb/quoteSummary unavailable).");
    }
  }

  stocksData.updatedAt = now;
  stocksData.source = "yahoo-finance-chart";

  await writeJson(stocksPath, stocksData);

  console.log(`Updated ${updated} stock-market symbols at ${now} (${intradayOnly ? "intraday" : "full"} refresh).`);
  if (failures.length) {
    console.warn(`Completed with ${failures.length} warning(s):`);
    for (const warning of failures) console.warn(`- ${warning}`);
  }
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
