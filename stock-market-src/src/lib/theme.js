import { useSyncExternalStore } from "react";

// Light/dark preference, shared with the rest of jez237.com through the
// "theme" localStorage key ("light", or empty for the default dark look).
// index.html applies it before first paint; this keeps React in step.
const listeners = new Set();
const root = document.documentElement;

export function getTheme() {
  return root.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function paintChrome() {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", getTheme() === "light" ? "#f1f4fa" : "#050b12");
}

export function setTheme(next) {
  if (next === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  try {
    localStorage.setItem("theme", next === "light" ? "light" : "");
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this visit.
  }
  paintChrome();
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme);
}

paintChrome();

// lightweight-charts draws on canvas, so its colours cannot come from CSS.
const CHART_COLORS = {
  dark: {
    text: "#8aa0bd",
    gridVert: "rgba(120,144,173,.08)",
    gridHorz: "rgba(120,144,173,.12)",
    priceBorder: "rgba(120,144,173,.22)",
    timeBorder: "rgba(120,144,173,.18)",
    crosshairVert: "rgba(226,239,251,.25)",
    crosshairHorz: "rgba(226,239,251,.18)",
    line: "#29d681",
    lineFill: "41,214,129",
    priceLine: "rgba(41,214,129,.55)",
    up: "#40d982",
    down: "#f05268",
    wickUp: "#9af7bf",
    wickDown: "#ff9aaa",
    volumeUp: "rgba(64,217,130,.28)",
    volumeDown: "rgba(240,82,104,.28)",
    secondary: "rgba(125,103,255,.95)",
  },
  light: {
    text: "#4d6178",
    gridVert: "rgba(52,76,105,.10)",
    gridHorz: "rgba(52,76,105,.14)",
    priceBorder: "rgba(52,76,105,.30)",
    timeBorder: "rgba(52,76,105,.26)",
    crosshairVert: "rgba(20,38,61,.40)",
    crosshairHorz: "rgba(20,38,61,.30)",
    line: "#129a57",
    lineFill: "18,154,87",
    priceLine: "rgba(18,154,87,.60)",
    up: "#18a05e",
    down: "#d6364d",
    wickUp: "#18a05e",
    wickDown: "#d6364d",
    volumeUp: "rgba(24,160,94,.34)",
    volumeDown: "rgba(214,54,77,.34)",
    secondary: "rgba(96,72,226,.95)",
  },
};

export function chartColors(theme) {
  return CHART_COLORS[theme] || CHART_COLORS.dark;
}
