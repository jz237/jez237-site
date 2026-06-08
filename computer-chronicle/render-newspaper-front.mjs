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
  const lowerStories = stories.slice(4, 8);

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
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: 0;
  }
  .page {
    position: relative;
    width: ${pageWidth}px;
    height: ${pageHeight}px;
    padding: 14px 22px 12px;
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
    width: 136px;
    height: 136px;
    padding: 18px 42px 0 10px;
    color: #fff7dd;
    background: #9b271f;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    font: 700 17px/1.02 Arial, sans-serif;
    text-transform: uppercase;
    transform-origin: left top;
  }
  .flag {
    display: grid;
    grid-template-columns: 1fr 86px;
    gap: 12px;
    align-items: start;
    border-bottom: 5px double #17150f;
    padding-bottom: 5px;
    position: relative;
    z-index: 1;
  }
  .masthead {
    padding-left: 110px;
    text-align: center;
  }
  .masthead h1 {
    margin: 0;
    font-size: 68px;
    line-height: .9;
    font-weight: 900;
    white-space: nowrap;
    transform: scaleY(1.12);
    transform-origin: center bottom;
  }
  .tagline {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #16547d;
    font: 700 italic 16px/1 Arial, sans-serif;
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
    padding: 7px 4px;
  }
  .price strong { display: block; color: #9b271f; font-size: 35px; line-height: 1; }
  .price span { display: block; margin-top: 5px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
  .meta {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    border-bottom: 2px solid #17150f;
    position: relative;
    z-index: 1;
    font: 700 16px/1.2 Georgia, serif;
  }
  .meta span { padding: 4px 0; }
  .meta span:nth-child(2) { text-align: center; }
  .meta span:nth-child(3) { text-align: right; }
  .top {
    display: grid;
    grid-template-columns: 2.3fr .95fr;
    gap: 14px;
    margin-top: 8px;
    position: relative;
    z-index: 1;
    align-items: start;
  }
  .main-news {
    display: grid;
    gap: 10px;
    align-content: start;
  }
  .lead-grid {
    display: grid;
    grid-template-columns: 1.05fr 1.55fr;
    gap: 12px;
    align-items: start;
  }
  .lead h2 {
    margin: 0 0 10px;
    font: 900 39px/.92 Arial, sans-serif;
    letter-spacing: 0;
  }
  .story-columns {
    column-count: 2;
    column-gap: 16px;
    font-size: 13.5px;
    line-height: 1.15;
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
    height: 222px;
    object-fit: cover;
  }
  .lead-photo img { height: 286px; }
  .rail {
    display: grid;
    gap: 10px;
    align-content: start;
  }
  .rail-box, .story-card {
    border: 2px solid #27231b;
    background: rgba(245,239,216,.62);
  }
  .rail-box h2 {
    margin: 0;
    padding: 5px 8px 4px;
    color: #f6efd2;
    background: #22231f;
    text-align: center;
    font: 900 21px/1 Arial, sans-serif;
  }
  .blue-box h2 { background: #245e89; }
  .red-box h2 { background: #9b271f; }
  .small-date {
    margin: 3px 0 0;
    text-align: center;
    font: 700 10px/1 Arial, sans-serif;
  }
  .compact-list .small-date { display: none; }
  .ranked, .chart-list, .bullet-list, .price-list, .classified-list, .note-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .ranked li, .chart-list li, .bullet-list li, .price-list li {
    display: grid;
    grid-template-columns: 24px 1fr;
    gap: 6px;
    border-top: 1px solid #27231b;
    padding: 4px 8px;
    font: 700 12px/1.04 Arial, sans-serif;
  }
  .compact-list li {
    grid-template-columns: 18px 1fr;
    gap: 5px;
    padding: 1px 6px;
    font: 700 10px/1 Arial, sans-serif;
  }
  .compact-list h2 {
    padding: 4px 8px 3px;
    font-size: 19px;
  }
  .ranked li::before, .chart-list li::before {
    counter-increment: rank;
    content: counter(rank);
    color: #245e89;
    font-size: 20px;
    text-align: center;
  }
  .compact-list li::before { font-size: 17px; }
  .ranked, .chart-list { counter-reset: rank; }
  .ranked span, .chart-list span, .bullet-list span {
    display: block;
    margin-top: 2px;
    font: 10px/1.06 Arial, sans-serif;
  }
  .compact-list span {
    display: inline;
    margin: 0 0 0 4px;
    font-size: 9px;
    line-height: 1;
    font-weight: 400;
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
    padding: 4px 8px;
    font-size: 10px;
    line-height: 1.08;
  }
  .note-list li {
    border-top: 1px solid #27231b;
    padding: 5px 8px;
    font-size: 11px;
    line-height: 1.1;
  }
  .note-list strong, .note-list span {
    display: block;
  }
  .note-list span {
    margin-top: 3px;
  }
  .box-copy {
    margin: 0;
    border-top: 1px solid #27231b;
    padding: 5px 8px;
    font-size: 10px;
    line-height: 1.08;
  }
  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-top: 0;
    position: relative;
    z-index: 1;
  }
  .story-card {
    padding: 8px;
    min-height: 168px;
  }
  .story-card h3 {
    margin: 0 0 6px;
    font: 900 19px/.98 Arial, sans-serif;
  }
  .story-card p {
    margin: 5px 0 0;
    font-size: 10px;
    line-height: 1.08;
  }
  .label {
    color: #9b271f;
    font: 900 14px/1 Arial, sans-serif;
    text-transform: uppercase;
  }
  .mini-photo img { height: 58px; }
  .departments {
    display: grid;
    gap: 6px;
  }
  .front-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 9px;
    margin-top: 8px;
    position: relative;
    z-index: 1;
  }
  .inline-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 9px;
  }
  .front-card {
    border: 2px solid #27231b;
    background: rgba(245,239,216,.62);
    padding: 8px;
    min-height: 224px;
  }
  .front-card h3 {
    margin: 0 0 6px;
    font: 900 17px/.98 Arial, sans-serif;
  }
  .front-card p {
    margin: 5px 0 0;
    font-size: 10px;
    line-height: 1.1;
  }
  .article-photo img {
    height: 56px;
  }
  .front-grid .front-card:nth-child(4) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 250px 1fr;
    column-gap: 12px;
    min-height: 250px;
  }
  .front-grid .front-card:nth-child(4) .label,
  .front-grid .front-card:nth-child(4) h3,
  .front-grid .front-card:nth-child(4) .source-badge {
    grid-column: 1 / -1;
  }
  .front-grid .front-card:nth-child(4) .photo {
    grid-column: 1;
  }
  .front-grid .front-card:nth-child(4) p:not(.label):not(.source-badge) {
    grid-column: 2;
    margin-top: 0;
    font-size: 11px;
    line-height: 1.14;
  }
  .front-grid .front-card:nth-child(4) .article-photo img {
    height: 74px;
  }
  .inline-grid .front-card {
    min-height: 222px;
  }
  .inline-grid .article-photo img {
    height: 72px;
  }
  .source-badge {
    color: #5d211c;
    font: 700 italic 10px/1.1 Georgia, serif;
  }
  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-top: 10px;
    position: relative;
    z-index: 1;
    align-items: start;
  }
  .mini-stack {
    display: grid;
    gap: 10px;
    align-content: start;
  }
  .bottom .rail-box h2 { font-size: 23px; }
  .banner {
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 24px;
    min-height: 102px;
    border: 2px solid #9b271f;
    background: #a72b21;
    color: #fff3d4;
    display: grid;
    grid-template-columns: 1fr 224px;
    align-items: center;
    z-index: 1;
  }
  .banner h2 {
    margin: 0;
    padding: 16px 18px;
    font: 900 34px/1 Arial, sans-serif;
  }
  .banner p {
    margin: 0;
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    color: #17150f;
    background: #efe6bf;
    font: 700 12px/1.05 Arial, sans-serif;
  }
</style>
</head>
<body>
<main class="page ${escapeHtml(accent)}">
  <div class="corner">Inside:<br>${cornerText(issue)}</div>
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
    <div class="main-news">
      <article class="lead">
        <div class="lead-grid">
          <div>
            <h2>${escapeHtml(leadHeadline)}</h2>
            <div class="story-columns">
              ${storyText(lead.summary, issue.computerItems?.[0]?.summary)}
              ${sourceMark(issue, lead.sourceRefs)}
            </div>
          </div>
          ${imageFigure(lead.image || issue.storeShelvesImage || issue.heroImage, "lead-photo")}
        </div>
      </article>
      <section class="inline-grid">
        ${mainStories.map((story) => frontCard(issue, story)).join("")}
      </section>
    </div>
    <aside class="departments">
      ${movieBox(issue)}
      ${releasesBox(issue)}
      ${musicBox(issue)}
    </aside>
  </section>

  <section class="front-grid">
    ${lowerStories.map((story, storyIndex) => frontCard(issue, story, storyIndex === 3 ? "wide" : "")).join("")}
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
  if (overflow > 2) {
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
