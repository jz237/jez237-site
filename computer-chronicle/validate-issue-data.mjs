#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const errors = [];
const warnings = [];
const weekly1982Mode = data.mode === "weekly-1982";

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

function checkRendererShapes(issue, issueIndex) {
  if (!Array.isArray(issue.computerItems)) fail(`Issue ${issueIndex}: computerItems must be an array.`);
  if (issue.pictureDesk && !Array.isArray(issue.pictureDesk)) fail(`Issue ${issueIndex}: pictureDesk must be an array when present.`);
  if (!Array.isArray(issue.storeShelves)) fail(`Issue ${issueIndex}: storeShelves must be an array.`);
  if (issue.softwareList && !Array.isArray(issue.softwareList)) fail(`Issue ${issueIndex}: softwareList must be an array when present.`);
  if (issue.classifieds && !Array.isArray(issue.classifieds)) fail(`Issue ${issueIndex}: classifieds must be an array when present.`);
  if (!Array.isArray(issue.priceWatch)) fail(`Issue ${issueIndex}: priceWatch must be an array.`);
  if (!Array.isArray(issue.briefs)) fail(`Issue ${issueIndex}: briefs must be an array.`);
  if (!Array.isArray(issue.musicChart)) fail(`Issue ${issueIndex}: musicChart must be an array.`);

  (issue.priceWatch || []).forEach((item, itemIndex) => {
    if (!item.item || !item.price || !item.note) {
      fail(`Issue ${issueIndex}: priceWatch[${itemIndex}] must include item, price, and note.`);
    }
  });

  (issue.softwareList || []).forEach((item, itemIndex) => {
    if (!item.name || !item.detail) {
      fail(`Issue ${issueIndex}: softwareList[${itemIndex}] must include name and detail.`);
    }
    if (/^#?\d*\.?\s*(spreadsheet|word processor|database|utility|business software|productivity software|game|educational software|programming language)$/i.test(item.name || "")) {
      fail(`Issue ${issueIndex}: softwareList[${itemIndex}] must use a named software title, not a generic category.`);
    }
  });

  (issue.pictureDesk || []).forEach((item, itemIndex) => {
    const image = item.image || item;
    if (!image.src || !image.alt || !image.caption || !image.confidence) {
      fail(`Issue ${issueIndex}: pictureDesk[${itemIndex}] must include image src, alt, caption, and confidence.`);
    }
  });

  (issue.musicChart || []).forEach((item, itemIndex) => {
    if (!item.title || !item.artist) {
      fail(`Issue ${issueIndex}: musicChart[${itemIndex}] must include title and artist.`);
    }
  });

  (issue.classifieds || []).forEach((item, itemIndex) => {
    if (!item.headline && !item.item) {
      fail(`Issue ${issueIndex}: classifieds[${itemIndex}] must include headline or item.`);
    }
    if (!item.copy && !item.detail) {
      fail(`Issue ${issueIndex}: classifieds[${itemIndex}] must include copy or detail.`);
    }
  });

  if (!issue.periodAd || !issue.periodAd.headline || !issue.periodAd.summary) {
    fail(`Issue ${issueIndex}: periodAd must include headline and summary.`);
  }

  if (!issue.accuracyLedger || !Array.isArray(issue.accuracyLedger.items)) {
    fail(`Issue ${issueIndex}: accuracyLedger must be an object with an items array.`);
  }
}

function checkPublicSafety(issue, issueIndex) {
  walk(issue, (_value, trail) => {
    const key = trail[trail.length - 1];
    if (typeof key === "string" && /prompt|imageGeneratorBrief|generationBrief|generationPrompt/i.test(key)) {
      fail(`Issue ${issueIndex}: public issue data contains disallowed field "${key}" at ${labelPath(trail)}.`);
    }
  });
}

function checkMagazineCoverClaims(issue, issueIndex) {
  let claimsMagazineCover = false;
  walk(issue, (value) => {
    if (typeof value !== "string") return;
    if (/\b(on the cover|cover promises|cover-featured|cover\/table|cover and table of contents|issue'?s cover)\b/i.test(value)) {
      claimsMagazineCover = true;
    }
  });

  if (!claimsMagazineCover) return;

  const hasActualCoverImage = (issue.pictureDesk || []).some((item) => {
    const image = item.image || item;
    const text = `${item.title || ""} ${item.note || ""} ${image.alt || ""} ${image.caption || ""} ${image.confidence || ""}`;
    const generated = /generated|AI-generated|period-style visual/i.test(text);
    const actual = /cover/i.test(text) && /source image|archive image|actual cover|cover scan|cover gallery/i.test(text);
    return Boolean(image.src) && actual && !generated;
  });

  if (!hasActualCoverImage) {
    fail(`Issue ${issueIndex}: magazine-cover wording requires an actual source/archive cover image in pictureDesk.`);
  }
}

if (!Array.isArray(data.issues)) {
  fail("Top-level issues must be an array.");
}

const issues = Array.isArray(data.issues) ? data.issues : [];
const seenIssueKeys = new Set();

issues.forEach((issue, index) => {
  if (!isIsoDate(issue.currentDate)) fail(`Issue ${index}: currentDate must be YYYY-MM-DD.`);
  if (!isIsoDate(issue.historicDate)) fail(`Issue ${index}: historicDate must be YYYY-MM-DD.`);
  if (!weekly1982Mode && issue.currentDate && issue.historicDate && !dateDiffYears(issue.currentDate, issue.historicDate)) {
    fail(`Issue ${index}: historicDate must be exactly 40 years before currentDate.`);
  }
  const issueKey = weekly1982Mode ? issue.historicDate : issue.currentDate;
  const issueKeyLabel = weekly1982Mode ? "historicDate" : "currentDate";
  if (seenIssueKeys.has(issueKey)) fail(`Issue ${index}: duplicate ${issueKeyLabel} ${issueKey}.`);
  seenIssueKeys.add(issueKey);

  ["lead", "market", "accuracyLedger", "sources"].forEach((field) => {
    if (!issue[field]) fail(`Issue ${index}: missing required field ${field}.`);
  });

  if (!Array.isArray(issue.sources) || !issue.sources.length) {
    fail(`Issue ${index}: sources must be a non-empty array.`);
  }

  checkSourceRefs(issue, index);
  checkImages(issue, index);
  checkRendererShapes(issue, index);
  checkPublicSafety(issue, index);
  checkMagazineCoverClaims(issue, index);
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
