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

export default function PortfolioPanel({
  benchmarkKey,
  historyBySymbol,
  holdings,
  onSelect,
  positions,
}) {
  const containerRef = useRef(null);
  const [curveRange, setCurveRange] = useState("3M");

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
      amount: position.holding.shares * dayChangeAmount(position.stock),
    }))
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  const maxContribution = Math.max(
    1e-9,
    ...contributions.map((c) => Math.abs(c.amount)),
  );

  const portfolioReturn = curve ? curve.portfolio.at(-1).value : null;
  const benchmarkReturn = curve ? curve.benchmark.at(-1).value : null;

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
              S&P 500{" "}
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
        </>
      ) : (
        <div className="chart-empty">
          Portfolio history is still loading (or unavailable for a sized
          position).
        </div>
      )}
      <div className="portfolio-columns">
        <div>
          <h3>Allocation</h3>
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
          <h3>Day P&L Contribution</h3>
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
