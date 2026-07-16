#!/usr/bin/env node
// Derives data/index.json (light archive index) and data/issues/<historicDate>.json
// (one full issue per file) from data/issues.json, so the page can load one issue
// instead of the whole archive. issues.json stays the canonical write path for the
// cron; this script is idempotent and only touches files whose content changed.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issuesDir = path.join(root, "data", "issues");
const indexPath = path.join(root, "data", "index.json");
const feedPath = path.join(root, "feed.xml");
const SITE = "https://jez237.com/computer-chronicle/";

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const issues = Array.isArray(data.issues) ? data.issues : [];

if (!issues.length) {
  console.error("Error: issues.json has no issues; refusing to derive empty data files.");
  process.exit(1);
}

fs.mkdirSync(issuesDir, { recursive: true });

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === content) return false;
  fs.writeFileSync(filePath, content);
  return true;
}

const seen = new Set();
let updated = 0;
for (const issue of issues) {
  const key = issue.historicDate;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key || "")) {
    console.error(`Error: issue ${issue.currentDate || "?"} has invalid historicDate "${key}"; cannot derive per-issue file.`);
    process.exit(1);
  }
  if (seen.has(key)) {
    console.error(`Error: duplicate historicDate ${key}; per-issue files require unique historicDate.`);
    process.exit(1);
  }
  seen.add(key);
  if (writeIfChanged(path.join(issuesDir, `${key}.json`), JSON.stringify(issue, null, 2) + "\n")) updated += 1;
}

// Newsstand thumbnails are progressive enhancement: a failure here must not
// block the daily publish, so warn and continue instead of exiting nonzero.
const thumbs = spawnSync("python3", [path.join(root, "build-thumbs.py")], { encoding: "utf8" });
if (thumbs.status === 0) {
  process.stdout.write(thumbs.stdout || "");
} else {
  console.warn(`Warning: thumbnail generation failed (${(thumbs.stderr || "").trim().split("\n").pop() || "unknown"}); newsstand will fall back to full hero images.`);
}

const index = {
  mode: data.mode,
  issues: issues.map((issue) => {
    const thumbName = `media/thumbs/${issue.historicDate}.webp`;
    return {
      currentDate: issue.currentDate,
      historicDate: issue.historicDate,
      displayDate: issue.displayDate,
      edition: issue.edition,
      morningLine: issue.morningLine,
      leadHeadline: (issue.lead && issue.lead.headline) || "",
      storyHeadlines: (Array.isArray(issue.stories) ? issue.stories : [])
        .map((story) => story && story.headline)
        .filter(Boolean),
      hero: (issue.heroImage && issue.heroImage.src) || "",
      thumb: fs.existsSync(path.join(root, thumbName)) ? thumbName : "",
      milestone: Boolean(issue.milestone),
    };
  }),
};
const indexUpdated = writeIfChanged(indexPath, JSON.stringify(index, null, 2) + "\n");

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Deterministic pubDate: pinned to noon UTC on the issue's publish day, so
// re-running the build never rewrites the feed.
function rfc822(dateStr) {
  return new Date(`${dateStr}T12:00:00Z`).toUTCString();
}

const feedItems = issues.slice(0, 20).map((issue) => {
  const link = `${SITE}?date=${issue.historicDate}`;
  const title = `${issue.displayDate || issue.historicDate} — ${(issue.lead && issue.lead.headline) || "Computer Chronicle"}`;
  const leadBody = issue.lead && issue.lead.body;
  const firstParagraph = Array.isArray(leadBody) ? leadBody[0] : (typeof leadBody === "string" ? leadBody : "");
  const storyHeadlines = (Array.isArray(issue.stories) ? issue.stories : [])
    .map((story) => story && story.headline)
    .filter(Boolean);
  const description = [
    (issue.lead && issue.lead.dek) || "",
    firstParagraph,
    storyHeadlines.length ? `Also this week: ${storyHeadlines.join(" · ")}.` : "",
  ].filter(Boolean).join(" ");
  return [
    "    <item>",
    `      <title>${escapeXml(title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `      <pubDate>${rfc822(issue.currentDate)}</pubDate>`,
    `      <description>${escapeXml(description)}</description>`,
    "    </item>",
  ].join("\n");
});

const feed = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  "  <channel>",
  "    <title>Computer Chronicle</title>",
  `    <link>${SITE}</link>`,
  `    <atom:link href="${SITE}feed.xml" rel="self" type="application/rss+xml"/>`,
  "    <description>A weekly early-1980s computer newspaper rebuilt from the historical record — games, software, hardware, prices, charts, and culture, one week at a time.</description>",
  "    <language>en-us</language>",
  `    <lastBuildDate>${rfc822(issues[0].currentDate)}</lastBuildDate>`,
  feedItems.join("\n"),
  "  </channel>",
  "</rss>",
  "",
].join("\n");
const feedUpdated = writeIfChanged(feedPath, feed);

let pruned = 0;
for (const file of fs.readdirSync(issuesDir)) {
  if (!file.endsWith(".json")) continue;
  if (!seen.has(file.slice(0, -".json".length))) {
    fs.unlinkSync(path.join(issuesDir, file));
    pruned += 1;
  }
}

console.log(`Chronicle derived data ok: ${issues.length} issue file(s), ${updated} updated, ${pruned} pruned${indexUpdated ? ", index updated" : ""}${feedUpdated ? ", feed updated" : ""}.`);
