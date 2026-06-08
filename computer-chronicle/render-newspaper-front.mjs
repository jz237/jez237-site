#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const root = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const mediaDir = path.join(root, "media");
const renderWidth = 1024;
const renderHeight = 1536;
const pageWidth = renderWidth - 16;
const pageHeight = renderHeight - 16;

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
  const trimmed = slice
    .slice(0, boundary > limit * 0.55 ? boundary : limit)
    .trim()
    .replace(/\b(?:a|an|and|as|at|for|from|in|of|or|the|to|with)$/i, "")
    .trim();
  return `${trimmed}.`;
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

function cornerText(issue) {
  const software = displayName(issue.softwareList?.[0]?.name || "Software");
  const words = software.split(/\s+/).filter(Boolean);
  const lineOne = words.slice(0, 1).join(" ");
  const lineTwo = words.slice(1, 3).join(" ");
  return [lineOne, lineTwo].filter(Boolean).join("<br>");
}

function softwareBox(issue) {
  return `
    <section class="rail-box blue-box compact-list">
      <h2>Software Top 5</h2>
      <p class="small-date">${escapeHtml(dateline(issue))}</p>
      <ol class="ranked">
        ${listItems(issue.softwareList, (item) => `
          <li>
            <strong>${escapeHtml(displayName(item.name))}</strong>
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

function marketBox(issue) {
  const market = issue.market || {};
  return `
    <section class="rail-box">
      <h2>Market Desk</h2>
      <ul class="price-list">
        <li><span>Dow close</span><strong>${escapeHtml(market.dow || "n/a")}</strong></li>
        <li><span>Nasdaq</span><strong>${escapeHtml(market.nasdaq || "n/a")}</strong></li>
      </ul>
      <p class="box-copy">${escapeHtml(truncate(market.summary || market.confidence || "", 150))}</p>
    </section>
  `;
}

function musicBox(issue) {
  return `
    <section class="rail-box red-box compact-list">
      <h2>Rock Top 5</h2>
      <p class="small-date">${escapeHtml(issue.sectionChrome?.music?.title || "This Week")}</p>
      <ol class="chart-list">
        ${listItems(issue.musicChart, (item) => `
          <li>
            <strong>${escapeHtml(displayName(item.title))}</strong>
            <span>${escapeHtml(item.artist)}</span>
          </li>
        `, 5)}
      </ol>
    </section>
  `;
}

function movieBox(issue) {
  return `
    <section class="rail-box red-box compact-list">
      <h2>Movies Top 5</h2>
      <p class="small-date">June 6-8 weekend</p>
      <ol class="chart-list">
        ${listItems(issue.movieChart, (item) => `
          <li>
            <strong>${escapeHtml(displayName(item.title))}</strong>
            <span>${escapeHtml(item.detail || "")}</span>
          </li>
        `, 5)}
      </ol>
    </section>
  `;
}

function releasesBox(issue) {
  const items = (issue.storeShelves || []).slice(0, 5);
  return `
    <section class="rail-box blue-box compact-list">
      <h2>Games Top 5</h2>
      <ol class="chart-list">
        ${items.map((item) => `
          <li>
            <strong>${escapeHtml(displayName(item.name))}</strong>
            <span>${escapeHtml(item.platform || item.confidence || "")}</span>
          </li>
        `).join("")}
      </ol>
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

function cultureBox(issue) {
  const briefs = (issue.briefs || []).slice(0, 3);
  return `
    <section class="rail-box">
      <h2>Culture Desk</h2>
      <ul class="note-list">
        ${briefs.map((item) => `
          <li>
            <strong>${escapeHtml(item.headline || item.label || "Brief")}</strong>
            <span>${escapeHtml(truncate(item.summary || item.confidence || "", 100))}</span>
          </li>
        `).join("")}
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
      <p>${escapeHtml(truncate(body, 155))}</p>
    </article>
  `;
}

function frontStories(issue) {
  const lead = issue.lead || {};
  const fallback = [
    {
      label: "Computers",
      headline: issue.computerItems?.[0]?.headline || lead.headline,
      summary: issue.computerItems?.[0]?.summary || lead.summary,
      image: lead.image,
      sourceRefs: issue.computerItems?.[0]?.sourceRefs || lead.sourceRefs
    },
    {
      label: "Games",
      headline: issue.storeShelves?.[0]?.name || "Game Shelf",
      summary: issue.storeShelves?.[0]?.detail || "",
      image: issue.storeShelvesImage,
      sourceRefs: issue.storeShelves?.[0]?.sourceRefs
    },
    {
      label: "Culture",
      headline: issue.briefs?.[0]?.headline || "Culture Desk",
      summary: issue.briefs?.[0]?.summary || "",
      sourceRefs: issue.briefs?.[0]?.sourceRefs
    }
  ];
  return (Array.isArray(issue.frontPageStories) && issue.frontPageStories.length ? issue.frontPageStories : fallback)
    .filter((story) => clean(story.headline || story.summary));
}

function sourceBadge(issue, refs) {
  if (!Array.isArray(refs) || !refs.length) return "";
  const label = refs
    .map((ref) => issue.sources?.[ref]?.name)
    .filter(Boolean)
    .map((name) => name.replace(/[:.,].*$/, ""))
    .find(Boolean);
  return label ? `<p class="source-badge">${escapeHtml(label)}</p>` : "";
}

function frontCard(issue, story, className = "") {
  const summaryLimit = className.includes("wide") ? 260 : 120;
  return `
    <article class="front-card ${className}">
      ${story.label ? `<p class="label">${escapeHtml(story.label)}</p>` : ""}
      <h3>${escapeHtml(story.headline || "Untitled")}</h3>
      ${imageFigure(story.image, "article-photo")}
      <p>${escapeHtml(truncate(story.summary || story.detail || "", summaryLimit))}</p>
      ${sourceBadge(issue, story.sourceRefs)}
    </article>
  `;
}

function makeHtml(issue, index) {
  const parts = dateParts(issue);
  const lead = issue.lead || {};
  const number = issueNumber(issue, index);
  const accent = issue.visualProfile?.accent || "red-black-blue";
  const leadHeadline = lead.headline || issue.masthead?.title || "Computer Chronicle";
  const stories = frontStories(issue);
  const mainStories = stories.slice(1, 4);
  const lowerStories = stories.slice(5, 8);
  const leadVisual = {
    src: "media/retro-computer-desk-1986.webp",
    alt: "Period-style color desk scene with an IBM-compatible computer, printer, modem, software, disks, and magazines",
    caption: "IBM-compatible buying meant complete desks: machine, printer, modem, software, disks, and budget math."
  };
  const sideStory = stories[4] || stories[1] || {};
  const market = issue.market || {};
  const priceItems = (issue.priceWatch || []).slice(0, 3);
  const weatherText = issue.morningLine || issue.editorNote || "Computers, games, software, movies, and rock radio for the week.";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(issue.masthead?.title || "Computer Chronicle")}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: ${renderWidth}px; height: ${renderHeight}px; background: #c8b990; }
  body {
    padding: 8px;
    color: #161511;
    font-family: "Nimbus Roman", "Liberation Serif", Georgia, "Times New Roman", serif;
    letter-spacing: 0;
  }
  .page {
    position: relative;
    width: ${pageWidth}px;
    height: ${pageHeight}px;
    padding: 10px 16px 14px;
    border: 2px solid #1a1712;
    background:
      radial-gradient(circle at 24% 16%, rgba(255,255,255,.30), transparent 24%),
      radial-gradient(circle at 82% 84%, rgba(117,54,30,.10), transparent 32%),
      linear-gradient(rgba(255,255,255,.15), rgba(0,0,0,.04)),
      #eadcb9;
    box-shadow: inset 0 0 0 1px rgba(22,21,17,.30), inset 0 0 70px rgba(37,28,13,.22);
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
  .flag {
    display: grid;
    grid-template-columns: 136px 1fr 116px;
    gap: 18px;
    align-items: start;
    border-bottom: 4px solid #8d211a;
    padding: 4px 0 8px;
    position: relative;
    z-index: 1;
  }
  .flag-box {
    min-height: 118px;
    border: 2px solid #1f5d82;
    padding: 8px 8px 7px;
    color: #132b35;
    text-align: center;
    background: rgba(236,226,192,.45);
  }
  .flag-box.red { border-color: #8d211a; color: #8d211a; }
  .flag-box h2 {
    margin: 0 0 5px;
    font: 900 19px/1 "Nimbus Roman", Georgia, serif;
    text-transform: uppercase;
  }
  .weather-icon {
    width: 62px;
    height: 34px;
    margin: 3px auto 5px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 30% 44%, #e5ba36 0 15px, transparent 16px),
      radial-gradient(circle at 58% 54%, #5b6b68 0 17px, transparent 18px),
      radial-gradient(circle at 78% 58%, #697673 0 13px, transparent 14px);
    filter: contrast(.95) saturate(.8);
  }
  .flag-box p {
    margin: 0;
    font: 700 11px/1.18 "Nimbus Roman", Georgia, serif;
  }
  .masthead {
    text-align: center;
  }
  .masthead h1 {
    margin: 4px 0 0;
    color: #0c3854;
    font-family: "Noto Serif Display", "DejaVu Serif", "Nimbus Roman", Georgia, serif;
    font-size: 66px;
    line-height: .86;
    font-weight: 900;
    white-space: nowrap;
    transform: scaleY(1.18);
    transform-origin: center bottom;
    text-shadow: 1px 1px 0 rgba(0,0,0,.14);
  }
  .tagline {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #8d211a;
    font: 900 12px/1 Arial, sans-serif;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .tagline::before, .tagline::after {
    content: "";
    width: 112px;
    border-top: 2px solid #8d211a;
  }
  .meta {
    display: grid;
    grid-template-columns: 1fr 1.6fr 1fr 70px;
    gap: 10px;
    border-top: 2px solid #10344c;
    border-bottom: 2px solid #17150f;
    position: relative;
    z-index: 1;
    font: 900 16px/1.15 "Nimbus Roman", Georgia, serif;
  }
  .meta span { padding: 4px 0; }
  .meta span:nth-child(2) { text-align: center; }
  .meta span:nth-child(3) { text-align: right; }
  .meta span:nth-child(4) { text-align: right; }
  .headline {
    position: relative;
    z-index: 1;
    padding: 8px 0 6px;
    border-bottom: 1px solid #17150f;
  }
  .headline h2 {
    margin: 0;
    font: 900 59px/.88 "Nimbus Roman", "Liberation Serif", Georgia, serif;
    letter-spacing: 0;
  }
  .headline .deck {
    margin: 4px 0 0;
    font: 900 italic 28px/.98 "Nimbus Roman", Georgia, serif;
  }
  .lead-layout {
    display: grid;
    grid-template-columns: 176px 1fr 184px;
    gap: 12px;
    margin-top: 8px;
    position: relative;
    z-index: 1;
    align-items: start;
  }
  .lead-copy h3,
  .side-copy h3 {
    margin: 0 0 6px;
    font: 900 24px/.95 "Nimbus Roman", Georgia, serif;
  }
  .lead-copy p,
  .side-copy p {
    margin: 0 0 8px;
    font-size: 12.2px;
    line-height: 1.08;
  }
  .byline {
    margin: 6px 0;
    text-align: center;
    font: 900 10px/1.15 Arial, sans-serif;
    text-transform: uppercase;
  }
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
    height: 112px;
    object-fit: cover;
  }
  .lead-photo img { height: 312px; }
  .story-strip {
    display: grid;
    grid-template-columns: 1.05fr 1.05fr 1fr .95fr;
    gap: 10px;
    margin-top: 8px;
    position: relative;
    z-index: 1;
  }
  .story-card, .rail-box {
    border: 2px solid #27231b;
    background: rgba(245,239,216,.62);
  }
  .story-card {
    padding: 8px;
    min-height: 166px;
  }
  .story-card h3 {
    margin: 0 0 5px;
    font: 900 21px/.94 "Nimbus Roman", Georgia, serif;
  }
  .story-card p {
    margin: 5px 0 0;
    font-size: 10.6px;
    line-height: 1.08;
  }
  .story-card .photo img { height: 80px; }
  .market-card h3 { text-align: center; }
  .market-lines {
    margin: 0;
    padding: 3px 8px 6px;
    list-style: none;
    font: 700 11px/1.18 Arial, sans-serif;
  }
  .market-lines li {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    border-bottom: 1px solid rgba(39,35,27,.38);
    padding: 2px 0;
  }
  .chart {
    height: 58px;
    margin: 6px 8px 2px;
    border: 1px solid #27231b;
    background:
      linear-gradient(90deg, rgba(39,35,27,.20) 1px, transparent 1px) 0 0 / 34px 100%,
      linear-gradient(0deg, rgba(39,35,27,.18) 1px, transparent 1px) 0 0 / 100% 14px,
      rgba(238,231,205,.68);
    position: relative;
  }
  .chart::after {
    content: "";
    position: absolute;
    left: 8px;
    right: 8px;
    top: 34px;
    height: 3px;
    background: #9b271f;
    transform: skewY(-8deg);
    box-shadow: 26px -8px 0 #9b271f, 52px 4px 0 #9b271f, 78px -12px 0 #9b271f, 104px -5px 0 #9b271f;
  }
  .rail-box h2 {
    margin: 0;
    padding: 5px 8px 4px;
    color: #f6efd2;
    background: #22231f;
    text-align: center;
    font: 900 22px/1 "Nimbus Roman", Georgia, serif;
  }
  .blue-box h2 { background: #245e89; }
  .red-box h2 { background: #9b271f; }
  .ranked, .chart-list, .bullet-list, .price-list, .classified-list, .note-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .ranked li, .chart-list li, .bullet-list li, .price-list li {
    display: grid;
    grid-template-columns: 20px 1fr;
    gap: 6px;
    border-top: 1px solid #27231b;
    padding: 3px 7px;
    font: 700 12px/1.02 Arial, sans-serif;
  }
  .ranked li::before, .chart-list li::before {
    counter-increment: rank;
    content: counter(rank);
    color: #245e89;
    font-size: 18px;
    text-align: center;
  }
  .ranked, .chart-list { counter-reset: rank; }
  .ranked span, .chart-list span, .bullet-list span {
    display: block;
    margin-top: 1px;
    font: 10px/1.04 Arial, sans-serif;
  }
  .charts-row {
    display: grid;
    grid-template-columns: .95fr .95fr 1.1fr 1fr 1fr;
    gap: 10px;
    margin-top: 8px;
    position: relative;
    z-index: 1;
  }
  .chart-panel {
    min-height: 196px;
    display: flex;
    flex-direction: column;
  }
  .chart-panel figure {
    margin: auto 8px 7px;
    border: 1px solid #27231b;
  }
  .chart-panel img {
    display: block;
    width: 100%;
    height: 58px;
    object-fit: cover;
  }
  .chart-panel .chart-list li {
    padding: 2px 7px;
    font-size: 10.5px;
  }
  .chart-panel .chart-list li::before {
    font-size: 15px;
  }
  .chart-panel .chart-list span {
    font-size: 9px;
  }
  .label {
    margin: 0 0 4px;
    color: #9b271f;
    font: 900 11px/1 Arial, sans-serif;
    text-transform: uppercase;
  }
  .source-badge {
    color: #5d211c;
    font: 700 italic 10px/1.1 Georgia, serif;
  }
  .ad-note {
    padding: 8px;
    min-height: 196px;
    display: flex;
    flex-direction: column;
  }
  .ad-note h3 {
    margin: 0 0 8px;
    font: 900 20px/.95 "Nimbus Roman", Georgia, serif;
  }
  .ad-note p {
    margin: 0 0 7px;
    font-size: 11px;
    line-height: 1;
  }
  .ad-note figure {
    margin-top: auto;
  }
  .ad-note .photo img {
    height: 74px;
  }
</style>
</head>
<body>
<main class="page ${escapeHtml(accent)}">
  <header class="flag">
    <section class="flag-box">
      <h2>Weather</h2>
      <div class="weather-icon"></div>
      <p>${escapeHtml(truncate(weatherText, 82))}</p>
    </section>
    <div class="masthead">
      <h1>${escapeHtml(issue.masthead?.title || "Computer Chronicle")}</h1>
      <div class="tagline">Computers · Games · Software · Movies · Rock Radio</div>
    </div>
    <section class="flag-box red">
      <h2>Computing Today</h2>
      <p>32 Pages</p>
      <p>3 Sections</p>
      <p>Price Watch</p>
    </section>
  </header>
  <div class="meta">
    <span>Vol. ${number}, No. ${parts.day}</span>
    <span>${escapeHtml(dateline(issue))}</span>
    <span>Portland, Oregon</span>
    <span>75 Cents</span>
  </div>

  <section class="headline">
    <h2>${escapeHtml(leadHeadline)}</h2>
    <p class="deck">Lower Prices, Better Software, and Growing Office Adoption</p>
  </section>

  <section class="lead-layout">
    <article class="lead-copy">
      <h3>${escapeHtml(issue.computerItems?.[0]?.headline || "More Power, More Choices")}</h3>
      <p class="byline">By Michael O'Leary<br>Computer Chronicle Staff Writer</p>
      ${storyText(lead.summary, issue.computerItems?.[0]?.summary)}
      ${sourceMark(issue, lead.sourceRefs)}
    </article>
    ${imageFigure(leadVisual, "lead-photo")}
    <article class="side-copy">
      <h3>${escapeHtml(sideStory.headline || "New Machines Promise More Power Ahead")}</h3>
      <p class="byline">By Scott Baker<br>Technology Desk</p>
      <p>${escapeHtml(truncate(sideStory.summary || sideStory.detail || "", 520))}</p>
      ${sourceBadge(issue, sideStory.sourceRefs)}
    </article>
  </section>

  <section class="story-strip">
    ${mainStories.map((story) => card(story.headline || "Untitled", story.summary || story.detail || "", story.image, story.label)).join("")}
    <article class="story-card market-card">
      <p class="label">Stock Market Summary</p>
      <h3>Friday Close</h3>
      <ul class="market-lines">
        <li><span>Dow Jones</span><strong>${escapeHtml(market.dow || "n/a")}</strong></li>
        <li><span>Nasdaq</span><strong>${escapeHtml(market.nasdaq || "n/a")}</strong></li>
        ${priceItems.map((item) => `<li><span>${escapeHtml(item.item)}</span><strong>${escapeHtml(item.price)}</strong></li>`).join("")}
      </ul>
      <div class="chart"></div>
    </article>
  </section>

  <section class="charts-row">
    <section class="rail-box red-box chart-panel">
      <h2>Top 5 Music</h2>
      <ol class="chart-list">
        ${listItems(issue.musicChart, (item) => `<li><strong>${escapeHtml(displayName(item.title))}</strong><span>${escapeHtml(item.artist)}</span></li>`, 5)}
      </ol>
      <figure><img src="${escapeHtml(fileUrl("media/clipping-electronics-guitar-1986.webp"))}" alt="Rock radio and electronics desk"></figure>
    </section>
    <section class="rail-box red-box chart-panel">
      <h2>Top 5 Movies</h2>
      <ol class="chart-list">
        ${listItems(issue.movieChart, (item) => `<li><strong>${escapeHtml(displayName(item.title))}</strong><span>${escapeHtml(item.detail || "")}</span></li>`, 5)}
      </ol>
      <figure><img src="${escapeHtml(fileUrl("media/web/f14a-vf84-1986.jpg"))}" alt="F-14A Tomcat in flight"></figure>
    </section>
    <section class="rail-box blue-box chart-panel">
      <h2>Top 5 Computer Games</h2>
      <ol class="chart-list">
        ${listItems(issue.storeShelves, (item) => `<li><strong>${escapeHtml(displayName(item.name))}</strong><span>${escapeHtml(item.platform || item.confidence || "")}</span></li>`, 5)}
      </ol>
      <figure><img src="${escapeHtml(fileUrl("media/clipping-game-desk-1986.webp"))}" alt="1980s computer game desk"></figure>
    </section>
    ${lowerStories.slice(0, 1).map((story) => card(story.headline || "Untitled", story.summary || story.detail || "", story.image, story.label)).join("")}
    <article class="ad-note story-card">
      <p class="label">Small Business</p>
      <h3>${escapeHtml(issue.periodAd?.headline || "Small Business Gets a Big Boost From PCs")}</h3>
      <p>${escapeHtml(truncate(issue.periodAd?.summary || issue.classifieds?.[0]?.copy || "", 230))}</p>
      <p class="source-badge">${escapeHtml(issue.periodAd?.finePrint || "Historical desk note")}</p>
      ${imageFigure({ src: "media/web/epson-equity-i-1987.jpg", alt: "Epson Equity computer system", caption: "Epson's Equity line pushed the clone desk into budget conversations." }, "article-photo")}
    </article>
  </section>
</main>
<script>
  (() => {
    const page = document.querySelector(".page");
    const overflow = Math.max(
      0,
      page.scrollHeight - page.clientHeight,
      page.scrollWidth - page.clientWidth
    );
    document.documentElement.setAttribute("data-layout-overflow", String(overflow));
  })();
</script>
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
  const layout = spawnSync(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=1000",
    `--window-size=${renderWidth},${renderHeight}`,
    "--dump-dom",
    `file://${htmlPath}`
  ], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (layout.status !== 0) {
    throw new Error(`Chrome layout check failed:\n${layout.stderr || layout.stdout}`);
  }

  const overflowMatch = layout.stdout.match(/data-layout-overflow="(\d+)"/);
  const overflow = overflowMatch ? Number(overflowMatch[1]) : 0;
  if (overflow > 6) {
    throw new Error(`Newspaper front overflowed the ${renderWidth}x${renderHeight} render by ${overflow}px.`);
  }

  const result = spawnSync(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    `--window-size=${renderWidth},${renderHeight}`,
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
