const YAHOO_SYMBOLS = {
  "S&P": "^GSPC",
  NASDAQ: "^IXIC",
  DOW: "^DJI",
  VIX: "^VIX",
  "10Y": "^TNX",
  DXY: "DX-Y.NYB",
  BTC: "BTC-USD",
  WTI: "CL=F",
  GOLD: "GC=F",
};

const round = (value) => Number.isFinite(value) ? Number(value.toFixed(4)) : null;
const yahooSymbol = (symbol) => YAHOO_SYMBOLS[symbol] || symbol;

function rowsFromChart(result) {
  const quote = result.indicators?.quote?.[0] || {};
  const timestamps = result.timestamp || [];
  const rows = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = round(quote.close?.[i]);
    if (close == null) continue;
    rows.push([
      timestamps[i],
      round(quote.open?.[i]) ?? close,
      round(quote.high?.[i]) ?? close,
      round(quote.low?.[i]) ?? close,
      close,
      Math.round(quote.volume?.[i] || 0),
    ]);
  }
  return rows;
}

function latestValue(rows, column) {
  for (let i = rows.length - 1; i >= 0; i--) {
    if (Number.isFinite(rows[i][column])) return rows[i][column];
  }
  return null;
}

async function fetchChart(symbol, range = "1d", interval = "1m") {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
  url.searchParams.set("range", range);
  url.searchParams.set("interval", interval);
  url.searchParams.set("includePrePost", "false");

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 jez237 stock command center manual refresh",
    },
  });
  if (!response.ok) throw new Error(`${symbol}: HTTP ${response.status}`);

  const json = await response.json();
  const error = json?.chart?.error;
  if (error) throw new Error(`${symbol}: ${error.description || error.code}`);

  const result = json?.chart?.result?.[0];
  if (!result?.timestamp?.length) throw new Error(`${symbol}: no chart bars`);
  return result;
}

async function fetchLiveChart(symbol) {
  try {
    return await fetchChart(symbol, "1d", "1m");
  } catch {
    return await fetchChart(symbol, "5d", "1d");
  }
}

function updateStock(stock, result) {
  const meta = result.meta || {};
  const rows = rowsFromChart(result);
  const closes = rows.map((row) => row[4]).filter(Number.isFinite);
  const price = round(meta.regularMarketPrice) ?? latestValue(rows, 4) ?? stock.price;
  const prev = round(meta.previousClose) ?? round(meta.chartPreviousClose) ?? stock.prevClose;
  const changeAmount = Number.isFinite(price) && Number.isFinite(prev) ? round(price - prev) : stock.changeAmount;
  const change = Number.isFinite(changeAmount) && Number.isFinite(prev) && prev !== 0
    ? round((changeAmount / prev) * 100)
    : stock.change;

  stock.price = price;
  stock.change = change;
  stock.changeAmount = changeAmount;
  stock.prevClose = prev;
  stock.dayLow = round(meta.regularMarketDayLow) ?? stock.dayLow;
  stock.dayHigh = round(meta.regularMarketDayHigh) ?? stock.dayHigh;
  stock.volume = Math.round(meta.regularMarketVolume || latestValue(rows, 5) || stock.volume || 0);
  stock.currency = meta.currency || stock.currency || "USD";
  stock.exchange = meta.fullExchangeName || meta.exchangeName || stock.exchange || "";
  stock.chart = closes.length ? closes.slice(-60) : stock.chart;
  stock.quoteSource = "yahoo-finance-chart-live";
  stock.quoteUpdatedAt = meta.regularMarketTime
    ? new Date(meta.regularMarketTime * 1000).toISOString()
    : new Date().toISOString();
}

async function staticStocks(request) {
  const url = new URL("/stock-market/data/stocks.json", request.url);
  const response = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error(`static stocks.json HTTP ${response.status}`);
  return response.json();
}

async function mapLimit(items, limit, fn) {
  const results = [];
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  });
  await Promise.all(workers);
  return results;
}

const REFRESH_COOLDOWN_SECONDS = 8;

function isSameOriginRequest(request) {
  const sourceHeader = request.headers.get("origin") || request.headers.get("referer");
  if (!sourceHeader) return false;
  try {
    return new URL(sourceHeader).hostname === new URL(request.url).hostname;
  } catch {
    return false;
  }
}

export async function onRequest(context) {
  const request = context.request;
  if (!["GET", "HEAD", "POST"].includes(request.method)) {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD, POST" },
    });
  }

  if (!isSameOriginRequest(request)) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const cache = caches.default;
  const cooldownKey = new Request(new URL("/__internal/stock-refresh-cooldown", request.url));
  if (await cache.match(cooldownKey)) {
    return new Response(JSON.stringify({ error: "refresh on cooldown, try again shortly" }), {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "Retry-After": String(REFRESH_COOLDOWN_SECONDS),
      },
    });
  }
  await cache.put(cooldownKey, new Response("1", {
    headers: { "Cache-Control": `max-age=${REFRESH_COOLDOWN_SECONDS}` },
  }));

  try {
    const data = await staticStocks(request);
    const failures = [];

    await mapLimit(data.stocks || [], 6, async (stock) => {
      const yahoo = yahooSymbol(stock.symbol);
      try {
        const result = await fetchLiveChart(yahoo);
        updateStock(stock, result);
        if (yahoo !== stock.symbol) stock.yahooSymbol = yahoo;
      } catch (error) {
        failures.push(`${stock.symbol}: ${error.message}`);
      }
    });

    const updated = (data.stocks || []).length - failures.length;
    if (!updated) throw new Error(`No symbols updated: ${failures.join("; ")}`);

    data.updatedAt = new Date().toISOString();
    data.source = "yahoo-finance-chart-live";
    if (failures.length) data.refreshWarnings = failures;

    const body = request.method === "HEAD" ? null : JSON.stringify(data, null, 2);
    return new Response(body, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "manual stock refresh failed",
      message: error.message,
    }, null, 2), {
      status: 502,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
}
