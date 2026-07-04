import { useEffect, useMemo, useRef, useState } from "react";
import { AreaSeries, createChart } from "lightweight-charts";
import { dayChangeAmount, fmt } from "../lib/format.js";

const CURVE_RANGES = { "1M": 22, "3M": 64, "6M": 128, "1Y": Infinity };

function closesByDate(symbolHistory) {
  const map = new Map();
  for (const row of symbolHistory?.d1y || []) map.set(row[0], row[4]);
  return map;
}

// Daily portfolio value across the benchmark's trading-day spine, starting at
// the first date where every sized position has history (so the basket is
// complete), forward-filling gaps in individual symbols.
function buildCurve(sized, historyBySymbol, benchmarkKey, rangeKey) {
  const benchmark = historyBySymbol[benchmarkKey];
  if (!benchmark?.d1y?.length || !sized.length) return null;
  const perSymbol = sized.map((position) => ({
    shares: position.holding.shares,
    closes: closesByDate(historyBySymbol[position.key]),
  }));
  if (perSymbol.some(({ closes }) => !closes.size)) return null;
  const start = perSymbol
    .map(({ closes }) => [...closes.keys()][0])
    .reduce((a, b) => (String(a) > String(b) ? a : b));
  let dates = benchmark.d1y
    .map((row) => row[0])
    .filter((date) => String(date) >= String(start));
  const limit = CURVE_RANGES[rangeKey];
  if (Number.isFinite(limit)) dates = dates.slice(-limit);
  if (dates.length < 2) return null;

  const last = perSymbol.map(() => null);
  const benchCloses = closesByDate(benchmark);
  const points = [];
  for (const date of dates) {
    let value = 0;
    let complete = true;
    perSymbol.forEach((entry, index) => {
      const close = entry.closes.get(date) ?? last[index];
      if (close == null) {
        complete = false;
        return;
      }
      last[index] = close;
      value += entry.shares * close;
    });
    const bench = benchCloses.get(date);
    if (complete && bench != null) points.push({ time: date, value, bench });
  }
  if (points.length < 2) return null;
  const value0 = points[0].value;
  const bench0 = points[0].bench;
  return {
    portfolio: points.map((p) => ({
      time: p.time,
      value: (p.value / value0 - 1) * 100,
    })),
    benchmark: points.map((p) => ({
      time: p.time,
      value: (p.bench / bench0 - 1) * 100,
    })),
    finalValue: points.at(-1).value,
  };
}

// Beta, correlation, and annualized volatility vs the selected benchmark,
// from the daily returns of the two percent-return series (same date spine).
function riskStats(portfolioPoints, benchmarkPoints) {
  if (!portfolioPoints || portfolioPoints.length < 11) return null;
  const pf = portfolioPoints.map((p) => 1 + p.value / 100);
  const bf = benchmarkPoints.map((p) => 1 + p.value / 100);
  const rp = [];
  const rb = [];
  for (let i = 1; i < pf.length; i++) {
    rp.push(pf[i] / pf[i - 1] - 1);
    rb.push(bf[i] / bf[i - 1] - 1);
  }
  const mean = (a) => a.reduce((sum, v) => sum + v, 0) / a.length;
  const meanP = mean(rp);
  const meanB = mean(rb);
  let cov = 0;
  let varP = 0;
  let varB = 0;
  for (let i = 0; i < rp.length; i++) {
    cov += (rp[i] - meanP) * (rb[i] - meanB);
    varP += (rp[i] - meanP) ** 2;
    varB += (rb[i] - meanB) ** 2;
  }
  cov /= rp.length;
  varP /= rp.length;
  varB /= rp.length;
  return {
    beta: varB > 0 ? cov / varB : null,
    correlation: varP > 0 && varB > 0 ? cov / Math.sqrt(varP * varB) : null,
    volatility: Math.sqrt(varP) * Math.sqrt(252) * 100,
  };
}

// Max drawdown and best/worst single day, computed from the percent-return
// series the curve already renders.
function curveStats(points) {
  if (!points || points.length < 2) return null;
  const factors = points.map((p) => 1 + p.value / 100);
  let peak = factors[0];
  let maxDrawdown = 0;
  let bestDay = -Infinity;
  let worstDay = Infinity;
  for (let i = 1; i < factors.length; i++) {
    peak = Math.max(peak, factors[i - 1]);
    maxDrawdown = Math.min(maxDrawdown, factors[i] / Math.max(peak, factors[i]) - 1);
    const dayReturn = factors[i] / factors[i - 1] - 1;
    bestDay = Math.max(bestDay, dayReturn);
    worstDay = Math.min(worstDay, dayReturn);
  }
  return {
    maxDrawdown: maxDrawdown * 100,
    bestDay: bestDay * 100,
    worstDay: worstDay * 100,
  };
}

export default function PortfolioPanel({
  benchmarks,
  historyBySymbol,
  holdings,
  onSelect,
  positions,
}) {
  const containerRef = useRef(null);
  const [curveRange, setCurveRange] = useState("3M");
  const [contribMode, setContribMode] = useState("day");
  const [benchmarkKey, setBenchmarkKey] = useState(benchmarks[0].key);
  const benchmarkLabel =
    benchmarks.find((b) => b.key === benchmarkKey)?.label || "Benchmark";

  const sized = useMemo(
    () =>
      positions
        .map((position) => ({
          ...position,
          key: position.stock.dataSymbol || position.stock.symbol,
          holding: holdings[position.symbol],
        }))
        .filter((position) => position.holding?.shares > 0),
    [positions, holdings],
  );
  const totalValue = sized.reduce(
    (sum, p) => sum + p.holding.shares * p.stock.price,
    0,
  );
  const curve = useMemo(
    () => buildCurve(sized, historyBySymbol, benchmarkKey, curveRange),
    [sized, historyBySymbol, benchmarkKey, curveRange],
  );

  useEffect(() => {
    if (!containerRef.current || !curve) return;
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: "transparent" },
        textColor: "#8aa0bd",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(120,144,173,.08)" },
        horzLines: { color: "rgba(120,144,173,.12)" },
      },
      rightPriceScale: {
        borderColor: "rgba(120,144,173,.22)",
        scaleMargins: { top: 0.12, bottom: 0.08 },
      },
      timeScale: {
        borderColor: "rgba(120,144,173,.18)",
        timeVisible: false,
        secondsVisible: false,
      },
      crosshair: { mode: 1 },
      localization: { priceFormatter: (v) => `${v.toFixed(1)}%` },
    });
    const portfolioSeries = chart.addSeries(AreaSeries, {
      lineColor: "#29d681",
      topColor: "rgba(41,214,129,.25)",
      bottomColor: "rgba(41,214,129,0)",
      lineWidth: 2,
      priceFormat: { type: "custom", formatter: (v) => `${v.toFixed(1)}%` },
    });
    const benchSeries = chart.addSeries(AreaSeries, {
      lineColor: "rgba(125,103,255,.95)",
      topColor: "rgba(0,0,0,0)",
      bottomColor: "rgba(0,0,0,0)",
      lineWidth: 1,
      priceLineVisible: false,
      priceFormat: { type: "custom", formatter: (v) => `${v.toFixed(1)}%` },
    });
    portfolioSeries.setData(curve.portfolio);
    benchSeries.setData(curve.benchmark);
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [curve]);

  const allocation = [...sized]
    .map((position) => ({
      symbol: position.symbol,
      value: position.holding.shares * position.stock.price,
      sector: position.stock.sector,
    }))
    .sort((a, b) => b.value - a.value);
  const sectors = Object.entries(
    allocation.reduce((groups, entry) => {
      groups[entry.sector] = (groups[entry.sector] || 0) + entry.value;
      return groups;
    }, {}),
  )
    .map(([sector, value]) => ({ sector, value }))
    .sort((a, b) => b.value - a.value);
  const topWeight = allocation.length ? allocation[0].value / totalValue : 0;
  const topSectorWeight = sectors.length ? sectors[0].value / totalValue : 0;
  const concentration =
    topWeight > 0.35
      ? `${allocation[0].symbol} is ${Math.round(topWeight * 100)}% of the portfolio`
      : topSectorWeight > 0.6
        ? `${sectors[0].sector} is ${Math.round(topSectorWeight * 100)}% of the portfolio`
        : null;

  const contributions = [...sized]
    .map((position) => ({
      symbol: position.symbol,
      amount:
        contribMode === "day"
          ? position.holding.shares * dayChangeAmount(position.stock)
          : position.holding.avgCost > 0
            ? position.holding.shares *
              (position.stock.price - position.holding.avgCost)
            : 0,
    }))
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  const maxContribution = Math.max(
    1e-9,
    ...contributions.map((c) => Math.abs(c.amount)),
  );

  const portfolioReturn = curve ? curve.portfolio.at(-1).value : null;
  const benchmarkReturn = curve ? curve.benchmark.at(-1).value : null;
  const stats = curve ? curveStats(curve.portfolio) : null;
  const risk = curve ? riskStats(curve.portfolio, curve.benchmark) : null;

  if (!sized.length) {
    return (
      <section className="panel portfolio-overview">
        <div className="card-title">Portfolio Performance</div>
        <div className="chart-empty">
          Enter share counts for at least one tracked position to see the
          portfolio equity curve, allocation, and day P&L contributions.
        </div>
      </section>
    );
  }
  return (
    <section className="panel portfolio-overview">
      <div className="card-title">
        Portfolio Performance{" "}
        <span className="curve-ranges">
          {Object.keys(CURVE_RANGES).map((key) => (
            <button
              key={key}
              className={curveRange === key ? "active" : ""}
              onClick={() => setCurveRange(key)}
            >
              {key}
            </button>
          ))}
        </span>
      </div>
      {curve ? (
        <>
          <div className="curve-legend">
            <span className="portfolio-key">
              Portfolio{" "}
              <b className={portfolioReturn >= 0 ? "up" : "down"}>
                {portfolioReturn >= 0 ? "+" : ""}
                {portfolioReturn.toFixed(2)}%
              </b>
            </span>
            <span className="bench-key">
              <span className="bench-toggle">
                {benchmarks.map((b) => (
                  <button
                    key={b.key}
                    className={benchmarkKey === b.key ? "active" : ""}
                    onClick={() => setBenchmarkKey(b.key)}
                  >
                    {b.label}
                  </button>
                ))}
              </span>{" "}
              <b className={benchmarkReturn >= 0 ? "up" : "down"}>
                {benchmarkReturn >= 0 ? "+" : ""}
                {benchmarkReturn.toFixed(2)}%
              </b>
            </span>
            <span>
              Market value <b className="money">${fmt(curve.finalValue)}</b>
            </span>
          </div>
          <div className="curve-chart" ref={containerRef} />
          {stats && (
            <div className="curve-stats">
              <span>
                Max drawdown{" "}
                <b className={stats.maxDrawdown < 0 ? "down" : ""}>
                  {stats.maxDrawdown.toFixed(2)}%
                </b>
              </span>
              <span>
                Best day <b className="up">+{stats.bestDay.toFixed(2)}%</b>
              </span>
              <span>
                Worst day <b className="down">{stats.worstDay.toFixed(2)}%</b>
              </span>
              {risk && (
                <>
                  <span>
                    Beta vs {benchmarkLabel}{" "}
                    <b>{risk.beta === null ? "—" : risk.beta.toFixed(2)}</b>
                  </span>
                  <span>
                    Correlation{" "}
                    <b>
                      {risk.correlation === null
                        ? "—"
                        : risk.correlation.toFixed(2)}
                    </b>
                  </span>
                  <span>
                    Volatility <b>{risk.volatility.toFixed(1)}% ann.</b>
                  </span>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="chart-empty">
          Portfolio history is still loading (or unavailable for a sized
          position).
        </div>
      )}
      <div className="portfolio-columns">
        <div>
          <h2>Allocation</h2>
          {allocation.map((entry) => (
            <button
              key={entry.symbol}
              className="alloc-row"
              onClick={() => onSelect(entry.symbol)}
            >
              <strong>{entry.symbol}</strong>
              <i
                style={{ width: `${Math.max(2, (entry.value / totalValue) * 100)}%` }}
              />
              <span className="money">${fmt(entry.value)}</span>
              <b>{((entry.value / totalValue) * 100).toFixed(1)}%</b>
            </button>
          ))}
          <div className="sector-weights">
            {sectors.map((entry) => (
              <span key={entry.sector}>
                {entry.sector}{" "}
                <b>{((entry.value / totalValue) * 100).toFixed(0)}%</b>
              </span>
            ))}
          </div>
          {concentration && (
            <p className="concentration">⚠ Concentration: {concentration}</p>
          )}
        </div>
        <div>
          <h2>
            P&L Contribution{" "}
            <span className="contrib-toggle">
              {["day", "total"].map((key) => (
                <button
                  key={key}
                  className={contribMode === key ? "active" : ""}
                  onClick={() => setContribMode(key)}
                >
                  {key === "day" ? "Day" : "Total"}
                </button>
              ))}
            </span>
          </h2>
          {contributions.map((entry) => (
            <button
              key={entry.symbol}
              className={`contrib-row ${entry.amount >= 0 ? "gain" : "loss"}`}
              onClick={() => onSelect(entry.symbol)}
            >
              <strong>{entry.symbol}</strong>
              <i
                style={{
                  width: `${Math.max(2, (Math.abs(entry.amount) / maxContribution) * 100)}%`,
                }}
              />
              <b className="money">
                {entry.amount >= 0 ? "+" : "−"}${fmt(Math.abs(entry.amount))}
              </b>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
