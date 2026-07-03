#!/usr/bin/env node
// Guardrails for the stock-market app: data shape, research-text quality,
// and index.html asset references. Exits 1 on errors; warnings don't fail.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketDir = path.join(repoRoot, "stock-market");

const errors = [];
const warnings = [];

function historyFileName(symbol) {
  return `${symbol.replace(/[^A-Za-z0-9.-]/g, "_")}.json`;
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function checkText(symbol, field, text) {
  if (typeof text !== "string" || !text.trim()) {
    errors.push(`${symbol}.${field}: empty or non-string entry`);
    return;
  }
  if (/^#{1,6}\s/.test(text) || text.includes(":**") || text.includes("**"))
    errors.push(`${symbol}.${field}: markdown artifact in "${text.slice(0, 60)}…"`);
  if (text !== text.trim())
    errors.push(`${symbol}.${field}: leading/trailing whitespace`);
  // Long prose cut off mid-word (no closing punctuation) — the failure mode
  // that shipped truncated research blurbs before. Catalysts are exempt:
  // they're news headlines, which legitimately end without punctuation.
  if (
    field !== "catalysts" &&
    text.length > 80 &&
    /[a-z0-9,;]$/.test(text) &&
    !/[.!?…)"'’”%]$/.test(text)
  )
    warnings.push(`${symbol}.${field}: possibly truncated: "…${text.slice(-40)}"`);
}

async function validateStocks() {
  const data = await readJson(path.join(marketDir, "data", "stocks.json"));
  if (!Array.isArray(data.stocks) || !data.stocks.length) {
    errors.push("stocks.json: missing stocks array");
    return null;
  }
  if (Number.isNaN(Date.parse(data.updatedAt)))
    errors.push("stocks.json: unparseable updatedAt");
  for (const stock of data.stocks) {
    const sym = stock.symbol || "(no symbol)";
    if (typeof stock.symbol !== "string") errors.push(`stock missing symbol`);
    for (const field of ["price", "change", "confidence"]) {
      if (!Number.isFinite(stock[field]))
        errors.push(`${sym}: ${field} is not a finite number`);
    }
    if (!Array.isArray(stock.chart)) errors.push(`${sym}: chart is not an array`);
    if (typeof stock.thesis === "string") checkText(sym, "thesis", stock.thesis);
    else errors.push(`${sym}: missing thesis`);
    for (const field of ["risks", "opportunities", "catalysts"]) {
      if (!Array.isArray(stock[field]) || !stock[field].length) {
        errors.push(`${sym}: ${field} missing or empty`);
        continue;
      }
      for (const text of stock[field]) checkText(sym, field, text);
    }
    if (
      (stock.kind || "equity") === "equity" &&
      JSON.stringify(stock.risks) === JSON.stringify(stock.opportunities)
    )
      errors.push(`${sym}: opportunities duplicates risks`);
  }
  return data;
}

async function validatePortfolio(stocksData) {
  const portfolio = await readJson(path.join(marketDir, "data", "portfolio.json"));
  if (!Array.isArray(portfolio.positions)) {
    errors.push("portfolio.json: missing positions array");
    return;
  }
  const known = new Set((stocksData?.stocks || []).map((s) => s.symbol));
  for (const position of portfolio.positions) {
    if (!known.has(position.symbol))
      warnings.push(`portfolio.json: ${position.symbol} not present in stocks.json`);
  }
}

async function validateHistory(stocksData) {
  const historyDir = path.join(marketDir, "data", "history");
  for (const stock of stocksData?.stocks || []) {
    const key = stock.dataSymbol || stock.yahooSymbol || stock.symbol;
    const file = path.join(historyDir, historyFileName(key));
    try {
      const history = await readJson(file);
      if (!Array.isArray(history.d1y) || history.d1y.length < 2)
        warnings.push(`history/${historyFileName(key)}: missing or short d1y`);
    } catch {
      warnings.push(`history/${historyFileName(key)}: missing (ok for a brand-new symbol)`);
    }
  }
}

async function validateIndexHtml() {
  const html = await fs.readFile(path.join(marketDir, "index.html"), "utf8");
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((ref) => !/^(https?:)?\/\//.test(ref) && !ref.startsWith("data:"));
  for (const ref of refs) {
    const clean = ref.replace(/^\.\//, "").split(/[?#]/)[0];
    try {
      await fs.access(path.join(marketDir, clean));
    } catch {
      errors.push(`index.html references missing file: ${ref}`);
    }
  }
  if (!/assets\/index-[\w-]+\.js/.test(html))
    errors.push("index.html: no hashed app bundle reference found");
}

const stocksData = await validateStocks();
if (stocksData) {
  await validatePortfolio(stocksData);
  await validateHistory(stocksData);
}
await validateIndexHtml();

for (const warning of warnings) console.warn(`WARN  ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.log(`stock-market validation: ${errors.length} error(s), ${warnings.length} warning(s).`);
if (errors.length) process.exit(1);
