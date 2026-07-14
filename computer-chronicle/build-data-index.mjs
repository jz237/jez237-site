#!/usr/bin/env node
// Derives data/index.json (light archive index) and data/issues/<historicDate>.json
// (one full issue per file) from data/issues.json, so the page can load one issue
// instead of the whole archive. issues.json stays the canonical write path for the
// cron; this script is idempotent and only touches files whose content changed.
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const issuesDir = path.join(root, "data", "issues");
const indexPath = path.join(root, "data", "index.json");

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

const index = {
  mode: data.mode,
  issues: issues.map((issue) => ({
    currentDate: issue.currentDate,
    historicDate: issue.historicDate,
    displayDate: issue.displayDate,
    edition: issue.edition,
    morningLine: issue.morningLine,
    leadHeadline: (issue.lead && issue.lead.headline) || "",
    storyHeadlines: (Array.isArray(issue.stories) ? issue.stories : [])
      .map((story) => story && story.headline)
      .filter(Boolean),
  })),
};
const indexUpdated = writeIfChanged(indexPath, JSON.stringify(index, null, 2) + "\n");

let pruned = 0;
for (const file of fs.readdirSync(issuesDir)) {
  if (!file.endsWith(".json")) continue;
  if (!seen.has(file.slice(0, -".json".length))) {
    fs.unlinkSync(path.join(issuesDir, file));
    pruned += 1;
  }
}

console.log(`Chronicle derived data ok: ${issues.length} issue file(s), ${updated} updated, ${pruned} pruned${indexUpdated ? ", index updated" : ""}.`);
