#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const root = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const mediaDir = path.join(root, "media");

function parseArgs(argv) {
  const args = {
    issueIndex: 0,
    currentDate: "",
    output: "",
    html: "",
    keepHtml: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--issue-index") args.issueIndex = Number(argv[++index] || 0);
    else if (arg === "--current-date") args.currentDate = argv[++index] || "";
    else if (arg === "--output") args.output = argv[++index] || "";
    else if (arg === "--html") args.html = argv[++index] || "";
    else if (arg === "--keep-html") args.keepHtml = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node computer-chronicle/render-newspaper-front.mjs [--current-date YYYY-MM-DD] [--output path] [--html path] [--keep-html]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(value, limit) {
  const text = clean(value);
  if (text.length <= limit) return text;
  const slice = text.slice(0, limit + 1);
  const boundary = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("; "), slice.lastIndexOf(", "), slice.lastIndexOf(" "));
  return `${slice.slice(0, boundary > limit * 0.55 ? boundary : limit).trim()}.`;
}

function dateline(issue) {
  return clean(issue.displayDate || issue.historicDate || "Computer Chronicle");
}

function issueNumber(issue, index) {
  const match = clean(issue.edition).match(/Issue\s*0*(\d+)/i);
  return match ? Number(match[1]) : index + 1;
}

function dateParts(issue) {
  const historic = new Date(`${issue.historicDate}T00:00:00Z`);
  const month = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long" }).format(historic);
  return {
    month,
    year: historic.getUTCFullYear(),
    day: historic.getUTCDate()
  };
}

function fileUrl(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  const absolute = path.resolve(root, src);
  return `file://${absolute}`;
}

function imageFigure(image, className = "") {
  if (!image?.src) return "";
  return `
    <figure class="photo ${className}">
      <img src="${escapeHtml(fileUrl(image.src))}" alt="${escapeHtml(image.alt || image.caption || "")}">
      <figcaption>${escapeHtml(image.caption || image.confidence || "")}</figcaption>
    </figure>
  `;
}

function sourceMark(issue, refs) {
  if (!Array.isArray(refs) || !refs.length) return "";
  const labels = refs
    .map((ref) => issue.sources?.[ref]?.name)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => escapeHtml(name.replace(/[:.,].*$/, "")));
  if (!labels.length) return "";
  return `<p class="source-line">Source: ${labels.join("; ")}</p>`;
}

function storyText(summary, extra = "") {
  const parts = [summary, extra].map((item) => clean(item)).filter(Boolean);
  return parts.map((part) => `<p>${escapeHtml(truncate(part, 380))}</p>`).join("");
}

function listItems(items, render, limit = 5) {
  return (items || []).slice(0, limit).map(render).join("");
}

function displayName(value) {
  return clean(value).replace(/^#\d+\s*/, "");
}

function softwareBox(issue) {
  return `
    <section class="rail-box blue-box">
      <h2>Software Top 5</h2>
      <p class="small-date">${escapeHtml(dateline(issue))}</p>
      <ol class="ranked">
        ${listItems(issue.softwareList, (item) => `
          <li>
            <strong>${escapeHtml(displayName(item.name))}</strong>
            <span>${escapeHtml(item.platform || item.confidence || "")}</span>
          </li>
        `, 5)}
      </ol>
    </section>
  `;
}

function priceBox(issue) {
  return `
    <section class="rail-box">
      <h2>Price Watch</h2>
      <ul class="price-list">
        ${listItems(issue.priceWatch, (item) => `
          <li>
            <span>${escapeHtml(item.item)}</span>
            <strong>${escapeHtml(item.price)}</strong>
          </li>
        `, 6)}
      </ul>
    </section>
  `;
}

function musicBox(issue) {
  return `
    <section class="rail-box red-box">
      <h2>Rock Radio</h2>
      <p class="small-date">${escapeHtml(issue.sectionChrome?.music?.title || "This Week")}</p>
      <ol class="chart-list">
        ${listItems(issue.musicChart, (item) => `
          <li>
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.artist)}</span>
          </li>
        `, 5)}
      </ol>
    </section>
  `;
}

function releasesBox(issue) {
  const items = (issue.storeShelves || []).slice(0, 4);
  return `
    <section class="rail-box blue-box">
      <h2>Game Shelf</h2>
      <ul class="bullet-list">
        ${items.map((item) => `
          <li>
            <strong>${escapeHtml(displayName(item.name))}</strong>
            <span>${escapeHtml(item.platform || item.confidence || "")}</span>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function classifiedBox(issue) {
  return `
    <section class="rail-box">
      <h2>Small Ads</h2>
      <ul class="classified-list">
        ${listItems(issue.classifieds, (item) => `
          <li><strong>${escapeHtml(item.headline || item.item)}</strong> ${escapeHtml(truncate(item.copy || item.detail, 110))}</li>
        `, 3)}
      </ul>
    </section>
  `;
}

function card(title, body, image, label = "") {
  return `
    <article class="story-card">
      ${label ? `<p class="label">${escapeHtml(label)}</p>` : ""}
      <h3>${escapeHtml(title)}</h3>
      ${imageFigure(image, "mini-photo")}
      <p>${escapeHtml(truncate(body, 190))}</p>
    </article>
  `;
}

function makeHtml(issue, index) {
  const parts = dateParts(issue);
  const lead = issue.lead || {};
  const firstComputer = issue.computerItems?.[0] || {};
  const games = issue.storeShelves?.[0] || {};
  const movie = (issue.briefs || []).find((item) => /movie|tv|culture/i.test(`${item.label || ""} ${item.headline || ""}`)) || issue.briefs?.[0] || {};
  const bbs = issue.bbsNote || {};
  const number = issueNumber(issue, index);
  const accent = issue.visualProfile?.accent || "red-black-blue";
  const leadHeadline = lead.headline || issue.masthead?.title || "Computer Chronicle";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(issue.masthead?.title || "Computer Chronicle")}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1024px; min-height: 1536px; background: #c8b990; }
  body {
    padding: 10px;
    color: #161511;
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: 0;
  }
  .page {
    position: relative;
    width: 1004px;
    min-height: 1516px;
    padding: 18px 22px 16px;
    border: 3px solid #1a1712;
    background:
      radial-gradient(circle at 18% 20%, rgba(255,255,255,.28), transparent 22%),
      linear-gradient(rgba(255,255,255,.15), rgba(0,0,0,.04)),
      #eadfbd;
    box-shadow: inset 0 0 0 2px rgba(22,21,17,.35), inset 0 0 65px rgba(37,28,13,.20);
    overflow: hidden;
  }
  .page::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .24;
    background-image:
      repeating-linear-gradient(0deg, transparent 0, transparent 5px, rgba(70,54,35,.16) 6px),
      repeating-linear-gradient(90deg, transparent 0, transparent 7px, rgba(70,54,35,.10) 8px);
    mix-blend-mode: multiply;
  }
  .corner {
    position: absolute;
    left: 0;
    top: 0;
    width: 142px;
    height: 142px;
    padding: 20px 48px 0 10px;
    color: #fff7dd;
    background: #9b271f;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    font: 700 20px/1.05 Arial, sans-serif;
    text-transform: uppercase;
    transform-origin: left top;
  }
  .flag {
    display: grid;
    grid-template-columns: 1fr 86px;
    gap: 12px;
    align-items: start;
    border-bottom: 5px double #17150f;
    padding-bottom: 8px;
    position: relative;
    z-index: 1;
  }
  .masthead {
    padding-left: 110px;
    text-align: center;
  }
  .masthead h1 {
    margin: 0;
    font-size: 80px;
    line-height: .9;
    font-weight: 900;
    white-space: nowrap;
    transform: scaleY(1.12);
    transform-origin: center bottom;
  }
  .tagline {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #16547d;
    font: 700 italic 18px/1 Arial, sans-serif;
  }
  .tagline::before, .tagline::after {
    content: "";
    width: 170px;
    border-top: 4px double #16547d;
  }
  .price {
    border: 2px solid #17150f;
    text-align: center;
    font-family: Arial, sans-serif;
    padding: 8px 4px;
  }
  .price strong { display: block; color: #9b271f; font-size: 38px; line-height: 1; }
  .price span { display: block; margin-top: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
  .meta {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    border-bottom: 2px solid #17150f;
    position: relative;
    z-index: 1;
    font: 700 16px/1.2 Georgia, serif;
  }
  .meta span { padding: 5px 0; }
  .meta span:nth-child(2) { text-align: center; }
  .meta span:nth-child(3) { text-align: right; }
  .top {
    display: grid;
    grid-template-columns: 2.55fr .95fr;
    gap: 14px;
    margin-top: 10px;
    position: relative;
    z-index: 1;
  }
  .lead-grid {
    display: grid;
    grid-template-columns: 1.05fr 1.65fr;
    gap: 12px;
    align-items: start;
  }
  .lead h2 {
    margin: 0 0 10px;
    font: 900 50px/.93 Arial, sans-serif;
    letter-spacing: 0;
  }
  .story-columns {
    column-count: 2;
    column-gap: 16px;
    font-size: 14px;
    line-height: 1.18;
    text-align: left;
  }
  .story-columns p { margin: 0 0 8px; }
  .source-line, figcaption {
    margin: 4px 0 0;
    font-size: 11px;
    font-style: italic;
    line-height: 1.15;
  }
  .photo {
    margin: 0;
    border: 1px solid #27231b;
    padding: 5px;
    background: rgba(238,231,205,.7);
  }
  .photo img {
    display: block;
    width: 100%;
    height: 268px;
    object-fit: cover;
    filter: grayscale(1) contrast(1.12) sepia(.14);
  }
  .rail {
    display: grid;
    gap: 10px;
  }
  .rail-box, .story-card {
    border: 2px solid #27231b;
    background: rgba(245,239,216,.62);
  }
  .rail-box h2 {
    margin: 0;
    padding: 7px 8px 5px;
    color: #f6efd2;
    background: #22231f;
    text-align: center;
    font: 900 25px/1 Arial, sans-serif;
  }
  .blue-box h2 { background: #245e89; }
  .red-box h2 { background: #9b271f; }
  .small-date {
    margin: 4px 0 0;
    text-align: center;
    font: 700 13px/1 Arial, sans-serif;
  }
  .ranked, .chart-list, .bullet-list, .price-list, .classified-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .ranked li, .chart-list li, .bullet-list li, .price-list li {
    display: grid;
    grid-template-columns: 24px 1fr;
    gap: 6px;
    border-top: 1px solid #27231b;
    padding: 5px 8px;
    font: 700 13px/1.05 Arial, sans-serif;
  }
  .ranked li::before, .chart-list li::before {
    counter-increment: rank;
    content: counter(rank);
    color: #245e89;
    font-size: 22px;
    text-align: center;
  }
  .ranked, .chart-list { counter-reset: rank; }
  .ranked span, .chart-list span, .bullet-list span {
    display: block;
    margin-top: 2px;
    font: 11px/1.08 Arial, sans-serif;
  }
  .bullet-list li {
    grid-template-columns: 1fr;
    gap: 2px;
  }
  .price-list li {
    grid-template-columns: 1fr auto;
    font-size: 12px;
  }
  .price-list strong { white-space: nowrap; }
  .classified-list li {
    border-top: 1px solid #27231b;
    padding: 5px 8px;
    font-size: 11px;
    line-height: 1.12;
  }
  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-top: 12px;
    position: relative;
    z-index: 1;
  }
  .story-card {
    padding: 8px;
    min-height: 212px;
  }
  .story-card h3 {
    margin: 0 0 6px;
    font: 900 23px/1 Arial, sans-serif;
  }
  .story-card p {
    margin: 5px 0 0;
    font-size: 12px;
    line-height: 1.12;
  }
  .label {
    color: #9b271f;
    font: 900 14px/1 Arial, sans-serif;
    text-transform: uppercase;
  }
  .mini-photo img { height: 82px; }
  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-top: 10px;
    position: relative;
    z-index: 1;
  }
  .bottom .rail-box h2 { font-size: 25px; }
  .banner {
    margin-top: 12px;
    border: 2px solid #9b271f;
    background: #a72b21;
    color: #fff3d4;
    display: grid;
    grid-template-columns: 1fr 180px;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .banner h2 {
    margin: 0;
    padding: 8px 14px;
    font: 900 30px/1 Arial, sans-serif;
  }
  .banner p {
    margin: 0;
    padding: 8px 10px;
    color: #17150f;
    background: #efe6bf;
    font: 700 12px/1.08 Arial, sans-serif;
  }
</style>
</head>
<body>
<main class="page ${escapeHtml(accent)}">
  <div class="corner">Inside:<br>${escapeHtml(issue.softwareList?.[0]?.name || "Software")}<br>Page 3</div>
  <header class="flag">
    <div class="masthead">
      <h1>${escapeHtml(issue.masthead?.title || "Computer Chronicle")}</h1>
      <div class="tagline">${escapeHtml(issue.visualProfile?.strapline || "The Newsweekly of Home, Personal & Business Computing")}</div>
    </div>
    <div class="price"><strong>75c</strong><span>U.S. & Canada</span><span>$1.00 other countries</span></div>
  </header>
  <div class="meta">
    <span>Vol. ${number}, No. ${parts.day}</span>
    <span>${escapeHtml(dateline(issue))}</span>
    <span>ISSN 0737-6830</span>
  </div>

  <section class="top">
    <article class="lead">
      <div class="lead-grid">
        <div>
          <h2>${escapeHtml(leadHeadline)}</h2>
          <div class="story-columns">
            ${storyText(lead.summary, firstComputer.summary)}
            ${sourceMark(issue, lead.sourceRefs)}
          </div>
        </div>
        ${imageFigure(lead.image || issue.storeShelvesImage || issue.heroImage, "lead-photo")}
      </div>
    </article>
    <aside class="rail">
      ${softwareBox(issue)}
      ${releasesBox(issue)}
      ${priceBox(issue)}
    </aside>
  </section>

  <section class="cards">
    ${card(firstComputer.headline || "Personal Computing Desk", firstComputer.summary || issue.morningLine, lead.image, firstComputer.label || "Computers")}
    ${card(games.name || "Game Shelf", games.detail || "", issue.storeShelvesImage, games.platform || "Games")}
    ${card(bbs.headline || "Modem Desk", bbs.summary || issue.editorNote, bbs.image, "BBS")}
  </section>

  <section class="bottom">
    ${card(movie.headline || "Culture Desk", movie.summary || "", null, movie.label || "Movies / TV")}
    ${musicBox(issue)}
    ${classifiedBox(issue)}
  </section>

  <section class="banner">
    <h2>${escapeHtml(issue.masthead?.kicker || "Weekly Historical Tech Desk")}</h2>
    <p>${escapeHtml(truncate(issue.morningLine || issue.masthead?.deck, 165))}</p>
  </section>
</main>
</body>
</html>`;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error("No Chrome/Chromium binary found for newspaper rendering.");
  return found;
}

function render(htmlPath, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const chrome = findChrome();
  const result = spawnSync(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1024,1536",
    `--screenshot=${outputPath}`,
    `file://${htmlPath}`
  ], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (result.status !== 0) {
    throw new Error(`Chrome render failed:\n${result.stderr || result.stdout}`);
  }

  if (!fs.existsSync(outputPath)) {
    throw new Error(`Chrome did not write ${outputPath}`);
  }
}

const args = parseArgs(process.argv.slice(2));
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const issue = args.currentDate
  ? data.issues?.find((item) => item.currentDate === args.currentDate)
  : data.issues?.[args.issueIndex];

if (!issue) {
  throw new Error(args.currentDate ? `No issue found for ${args.currentDate}` : `No issue found at index ${args.issueIndex}`);
}

const output = args.output
  ? path.resolve(args.output)
  : path.join(mediaDir, `computer-chronicle-week-${issue.historicDate}.png`);
const htmlPath = args.html
  ? path.resolve(args.html)
  : path.join(os.tmpdir(), `computer-chronicle-${issue.historicDate}.html`);

fs.writeFileSync(htmlPath, makeHtml(issue, args.issueIndex), "utf8");
render(htmlPath, output);

if (!args.keepHtml && !args.html) {
  fs.rmSync(htmlPath, { force: true });
}

console.log(JSON.stringify({ output, html: args.keepHtml || args.html ? htmlPath : null }, null, 2));
