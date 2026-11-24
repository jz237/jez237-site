import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  createChart,
} from "lightweight-charts";
import { fmt, sma } from "../lib/format.js";
import { historyForRange } from "../lib/data.js";
import { chartColors, useTheme } from "../lib/theme.js";

export default function HiResChart({
  chartMode,
  history,
  indicators,
  range,
  stock,
}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const lineRef = useRef(null);
  const candlesRef = useRef(null);
  const volumeRef = useRef(null);
  const smaRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const theme = useTheme();
  const colors = chartColors(theme);
  const rows = useMemo(
    () => historyForRange(history, range),
    [history, range],
  );
  const hasVolume = useMemo(
    () => (rows || []).some((row) => row.volume > 0),
    [rows],
  );

  useEffect(() => {
    if (!containerRef.current || !rows) return;
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: "transparent" },
        textColor: colors.text,
        fontSize: 11,
      },
      grid: {
        vertLines: { color: colors.gridVert },
        horzLines: { color: colors.gridHorz },
      },
      rightPriceScale: {
        borderColor: colors.priceBorder,
        scaleMargins: { top: 0.08, bottom: 0.24 },
      },
      timeScale: {
        borderColor: colors.timeBorder,
        timeVisible: range === "1D" || range === "5D",
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: { color: colors.crosshairVert },
        horzLine: { color: colors.crosshairHorz },
      },
    });
    const line = chart.addSeries(AreaSeries, {
      lineColor: colors.line,
      topColor: `rgba(${colors.lineFill},.30)`,
      bottomColor: `rgba(${colors.lineFill},0)`,
      lineWidth: 2,
      priceLineColor: colors.priceLine,
    });
    const candles = chart.addSeries(CandlestickSeries, {
      upColor: colors.up,
      downColor: colors.down,
      borderUpColor: colors.up,
      borderDownColor: colors.down,
      wickUpColor: colors.wickUp,
      wickDownColor: colors.wickDown,
    });
    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    const smaLine = chart.addSeries(AreaSeries, {
      lineColor: colors.secondary,
      topColor: "rgba(0,0,0,0)",
      bottomColor: "rgba(0,0,0,0)",
      lineWidth: 1,
      priceLineVisible: false,
    });
    volume.priceScale().applyOptions({ scaleMargins: { top: 0.78, bottom: 0 } });
    chart.subscribeCrosshairMove((event) => {
      const bar = event.seriesData.get(candles);
      if (bar && "open" in bar) {
        setHovered({
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
        });
      } else setHovered(null);
    });
    chartRef.current = chart;
    lineRef.current = line;
    candlesRef.current = candles;
    volumeRef.current = volume;
    smaRef.current = smaLine;
    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [range, !rows, theme]);

  useEffect(() => {
    if (!rows || !chartRef.current) return;
    const lineData = rows.map((row) => ({ time: row.time, value: row.close }));
    const volumeData = rows.map((row) => ({
      time: row.time,
      value: row.volume,
      color:
        row.close >= row.open ? colors.volumeUp : colors.volumeDown,
    }));
    const smaData = sma(
      rows.map((row) => row.close),
      range === "1D" ? 8 : 14,
    ).map((value, index) => ({ time: rows[index].time, value }));
    lineRef.current?.setData(lineData);
    candlesRef.current?.setData(rows);
    volumeRef.current?.setData(volumeData);
    smaRef.current?.setData(smaData);
    lineRef.current?.applyOptions({ visible: chartMode === "Line" });
    candlesRef.current?.applyOptions({ visible: chartMode === "Candles" });
    volumeRef.current?.applyOptions({
      visible: hasVolume && (chartMode === "Candles" || chartMode === "Volume"),
    });
    smaRef.current?.applyOptions({
      visible: indicators && chartMode !== "Volume",
    });
    chartRef.current.timeScale().fitContent();
  }, [chartMode, hasVolume, indicators, range, rows, theme]);

  if (!rows) {
    return (
      <div className="hires-chart">
        <div className="chart-empty">
          No chart history available for {stock.symbol} ({range}).
          <br />
          <small>History refreshes with the next scheduled data update.</small>
        </div>
      </div>
    );
  }
  return (
    <div className="hires-chart">
      <div className="real-chart" ref={containerRef} />
      {hovered && chartMode === "Candles" && (
        <div className="ohlc-readout">
          <span>
            O <b>{fmt(hovered.open)}</b>
          </span>
          <span>
            H <b>{fmt(hovered.high)}</b>
          </span>
          <span>
            L <b>{fmt(hovered.low)}</b>
          </span>
          <span>
            C <b>{fmt(hovered.close)}</b>
          </span>
        </div>
      )}
      {history && (
        <div className="chart-source live">
          Yahoo OHLC ·{" "}
          {new Date(history.updatedAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </div>
  );
}
