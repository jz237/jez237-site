#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

function dateDiffYears(currentDate, historicDate) {
  const current = new Date(`${currentDate}T00:00:00Z`);
  const historic = new Date(`${historicDate}T00:00:00Z`);
  const copy = new Date(current);
  copy.setUTCFullYear(copy.getUTCFullYear() - 40);
  return copy.toISOString().slice(0, 10) === historicDate;
}

function todayInNewYork() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function walk(value, visit, trail = []) {
  visit(value, trail);
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visit, trail.concat(index)));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => walk(item, visit, trail.concat(key)));
  }
}

function labelPath(trail) {
  return trail.map((part) => `[${JSON.stringify(part)}]`).join("");
}

function checkSourceRefs(issue, issueIndex) {
  walk(issue, (value, trail) => {
    if (!value || typeof value !== "object" || !Array.isArray(value.sourceRefs)) return;
    value.sourceRefs.forEach((ref) => {
      if (!Number.isInteger(ref)) {
        fail(`Issue ${issueIndex}: sourceRef is not an integer at ${labelPath(trail)}.`);
      } else if (!issue.sources || !issue.sources[ref]) {
        fail(`Issue ${issueIndex}: sourceRef ${ref} has no matching source at ${labelPath(trail)}.`);
      } else if (!issue.sources[ref].url) {
        fail(`Issue ${issueIndex}: sourceRef ${ref} points to a source without url.`);
      }
    });
  });
}

function checkImages(issue, issueIndex) {
  walk(issue, (value, trail) => {
    if (!value || typeof value !== "object" || !value.src) return;
    if (/^https?:\/\//i.test(value.src)) return;
    const filePath = path.join(root, value.src);
    if (!fs.existsSync(filePath)) {
      fail(`Issue ${issueIndex}: missing image ${value.src} at ${labelPath(trail)}.`);
    }
    if (!value.alt) {
      warn(`Issue ${issueIndex}: image ${value.src} is missing alt text.`);
    }
    if (!value.confidence) {
      warn(`Issue ${issueIndex}: image ${value.src} is missing confidence label.`);
    }
  });
}

function checkPublicSafety(issue, issueIndex) {
  walk(issue, (_value, trail) => {
    const key = trail[trail.length - 1];
    if (typeof key === "string" && /prompt|imageGeneratorBrief|generationBrief|generationPrompt/i.test(key)) {
      fail(`Issue ${issueIndex}: public issue data contains disallowed field "${key}" at ${labelPath(trail)}.`);
    }
  });
}

if (!Array.isArray(data.issues)) {
  fail("Top-level issues must be an array.");
}

const issues = Array.isArray(data.issues) ? data.issues : [];
const seenCurrentDates = new Set();

issues.forEach((issue, index) => {
  if (!isIsoDate(issue.currentDate)) fail(`Issue ${index}: currentDate must be YYYY-MM-DD.`);
  if (!isIsoDate(issue.historicDate)) fail(`Issue ${index}: historicDate must be YYYY-MM-DD.`);
  if (issue.currentDate && issue.historicDate && !dateDiffYears(issue.currentDate, issue.historicDate)) {
    fail(`Issue ${index}: historicDate must be exactly 40 years before currentDate.`);
  }
  if (seenCurrentDates.has(issue.currentDate)) fail(`Issue ${index}: duplicate currentDate ${issue.currentDate}.`);
  seenCurrentDates.add(issue.currentDate);

  ["lead", "market", "accuracyLedger", "sources"].forEach((field) => {
    if (!issue[field]) fail(`Issue ${index}: missing required field ${field}.`);
  });

  if (!Array.isArray(issue.sources) || !issue.sources.length) {
    fail(`Issue ${index}: sources must be a non-empty array.`);
  }

  checkSourceRefs(issue, index);
  checkImages(issue, index);
  checkPublicSafety(issue, index);
});

const sorted = issues.every((issue, index, list) => {
  if (index === 0) return true;
  return list[index - 1].currentDate >= issue.currentDate;
});

if (!sorted) {
  fail("Issues should be sorted newest first so the archive/current fallback stays predictable.");
}

if (issues[0] && process.env.CHRONICLE_ALLOW_STALE !== "1") {
  const expectedCurrentDate = todayInNewYork();
  if (issues[0].currentDate !== expectedCurrentDate) {
    fail(`Newest issue is stale: expected currentDate ${expectedCurrentDate}, found ${issues[0].currentDate}. Set CHRONICLE_ALLOW_STALE=1 only for archive/offline checks.`);
  }
}

warnings.forEach((message) => console.warn(`Warning: ${message}`));

if (errors.length) {
  errors.forEach((message) => console.error(`Error: ${message}`));
  process.exit(1);
}

console.log(`Computer Chronicle issue data ok: ${issues.length} issue(s), ${warnings.length} warning(s).`);
