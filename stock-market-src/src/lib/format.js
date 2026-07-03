// Formatting and market-math helpers shared across the app.

export function sparklinePath(values, width = 96, height = 34) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => ({
    x: (index / Math.max(values.length - 1, 1)) * width,
    y: height - ((value - min) / Math.max(max - min, 1e-9)) * height,
  }));
  if (points.length < 2) return "";
  return points.reduce((path, point, index, all) => {
    if (index === 0) return `M${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    const prev = all[index - 1];
    const midX = (prev.x + point.x) / 2;
    return `${path} Q${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${midX.toFixed(2)} ${((prev.y + point.y) / 2).toFixed(2)} T${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, "");
}

export function fmt(value, digits = 2) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtIndex(value) {
  return value >= 1e3
    ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : fmt(value);
}

export function fmtVolume(value) {
  return !Number.isFinite(Number(value)) || !value
    ? "—"
    : value >= 1e9
      ? `${(value / 1e9).toFixed(2)}B`
      : value >= 1e6
        ? `${(value / 1e6).toFixed(1)}M`
        : value >= 1e3
          ? `${(value / 1e3).toFixed(0)}K`
          : String(Math.round(value));
}

export function dayChangeAmount(stock) {
  return (
    stock.changeAmount ??
    (stock.prevClose
      ? stock.price - stock.prevClose
      : (stock.price * stock.change) / 100)
  );
}

export function position52w(stock) {
  const [low, high] = stock.range52w || [0, 0];
  return !low || !high || high <= low
    ? null
    : Math.round(((stock.price - low) / (high - low)) * 100);
}

export function setupLabel(stock) {
  return stock.sector === "Volatility"
    ? stock.change > 0
      ? "Stress rising"
      : "Stress easing"
    : stock.sector === "Rates"
      ? stock.change > 0
        ? "Rate pressure"
        : "Rate relief"
      : stock.sector === "Currency"
        ? stock.change > 0
          ? "Dollar tightening"
          : "Dollar easing"
        : stock.confidence >= 84 && stock.change >= 0
          ? "Bullish momentum"
          : stock.confidence >= 72
            ? "Constructive setup"
            : stock.change < -2
              ? "Caution / reset"
              : "Needs confirmation";
}

export function postureLabel(stock) {
  return stock.sector === "Volatility"
    ? stock.change > 0
      ? "Respect risk-off signals"
      : "Risk appetite improving"
    : stock.sector === "Rates"
      ? stock.change > 0
        ? "Watch growth-stock pressure"
        : "Rate backdrop supportive"
      : stock.sector === "Currency"
        ? stock.change > 0
          ? "Dollar strength may tighten liquidity"
          : "Dollar relief can help risk assets"
        : stock.confidence >= 84 && stock.change >= 1
          ? "Momentum active"
          : stock.confidence >= 74
            ? "Watch pullbacks"
            : stock.change < -2
              ? "Wait for stabilization"
              : "Monitor for catalyst confirmation";
}

export function isMarketOpen(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const part = (type) => parts.find((p) => p.type === type)?.value || "";
  if (part("weekday") === "Sat" || part("weekday") === "Sun") return false;
  const minutes = Number(part("hour")) * 60 + Number(part("minute"));
  return minutes >= 570 && minutes <= 960;
}

export function sma(values, window = 8) {
  return values.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const slice = values.slice(start, index + 1);
    return slice.reduce((sum, v) => sum + v, 0) / slice.length;
  });
}
