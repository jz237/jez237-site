#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.dirname(new URL(import.meta.url).pathname);
const dataPath = path.join(root, "data", "issues.json");
const publicUrl = "https://jz237.github.io/jez237-site/computer-chronicle/";

function usage() {
  console.error(`Usage: node computer-chronicle/build-discord-caption.mjs [--send --target channel:ID] [--dry-run] [--json]

Builds the Discord caption for the newest Computer Chronicle issue from data/issues.json.
When --send is used, sends one Discord message with the caption and hero image attached.`);
}

function parseArgs(argv) {
  const args = {
    send: false,
    dryRun: false,
    json: false,
    target: "",
    issueIndex: 0
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--send") args.send = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--json") args.json = true;
    else if (arg === "--target") args.target = argv[++index] || "";
    else if (arg === "--issue-index") args.issueIndex = Number(argv[++index] || 0);
    else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      usage();
      process.exit(2);
    }
  }

  if (args.send && !args.target) {
    console.error("Missing --target for --send.");
    process.exit(2);
  }

  return args;
}

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function clean(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim();
}

function shorten(value, limit = 190) {
  const text = clean(value);
  if (text.length <= limit) return text;
  const slice = text.slice(0, limit + 1);
  const boundary = Math.max(
    slice.lastIndexOf(";"),
    slice.lastIndexOf(". "),
    slice.lastIndexOf(", "),
    slice.lastIndexOf(" ")
  );
  return `${slice.slice(0, boundary > 80 ? boundary : limit).trim()}...`;
}

function issueNumber(issue, index) {
  const edition = clean(issue.edition);
  const match = edition.match(/Issue\s*0*(\d+)/i);
  return match ? Number(match[1]) : index + 1;
}

function itemName(item) {
  return clean(item?.name || item?.headline || item?.title || item?.item || "");
}

function detail(item) {
  return shorten(item?.detail || item?.summary || item?.note || item?.copy || "");
}

function namedBullet(prefix, item) {
  const name = itemName(item);
  const text = detail(item);
  if (!name) return "";
  return text ? `${prefix}: ${name} - ${text}` : `${prefix}: ${name}`;
}

function leadBullet(issue) {
  const headline = clean(issue.lead?.headline || issue.lead?.title);
  const summary = shorten(issue.lead?.summary || issue.lead?.detail || issue.lead?.deck);
  if (headline && summary) return `Lead: ${headline} - ${summary}`;
  if (headline) return `Lead: ${headline}`;
  return namedBullet("Hardware", issue.computerItems?.[0]);
}

function cultureBullet(issue) {
  const movieBrief = (issue.briefs || []).find((item) => {
    const label = clean(item.label).toLowerCase();
    const text = `${itemName(item)} ${detail(item)}`.toLowerCase();
    return /movie|cinema|tv|television|marquee|culture/.test(label) || /movie|cinema|tv|television|marquee/.test(text);
  });
  if (movieBrief) return namedBullet(clean(movieBrief.label || "Culture"), movieBrief);

  const music = issue.musicChart?.[0];
  if (music?.title && music?.artist) {
    return `Rock chart: ${clean(music.title)} - ${clean(music.artist)}`;
  }

  return "";
}

function buildCaption(issue, index) {
  const number = issueNumber(issue, index);
  const displayDate = clean(issue.displayDate || issue.historicDate || "");
  const bullets = [
    namedBullet("Games", issue.storeShelves?.[0]),
    leadBullet(issue),
    namedBullet("Software", issue.softwareList?.[0]),
    cultureBullet(issue),
    namedBullet("Price Watch", issue.priceWatch?.[0])
  ].filter(Boolean);

  if (bullets.length < 4) {
    throw new Error(`Need at least 4 Discord highlight bullets, found ${bullets.length}.`);
  }

  return [
    `Computer Chronicle Issue #${number} - ${displayDate}`,
    `Page: <${publicUrl}>`,
    "",
    "Highlights:",
    ...bullets.slice(0, 5).map((bullet) => `- ${bullet}`)
  ].join("\n");
}

function heroImagePath(issue) {
  const src = issue.heroImage?.src || issue.image?.src || issue.hero?.src || "";
  if (!src) throw new Error("Newest issue is missing hero image src.");
  if (/^https?:\/\//i.test(src)) return src;
  const resolved = path.resolve(root, src);
  if (!fs.existsSync(resolved)) throw new Error(`Hero image does not exist: ${resolved}`);
  return resolved;
}

function sendMessage({ target, caption, media, dryRun }) {
  const command = [
    "message",
    "send",
    "--channel",
    "discord",
    "--target",
    target,
    "--message",
    caption,
    "--media",
    media,
    "--json"
  ];
  if (dryRun) command.push("--dry-run");

  const result = spawnSync("openclaw", command, {
    cwd: path.resolve(root, ".."),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (result.status !== 0) {
    throw new Error(`openclaw ${command.join(" ")} failed\n${result.stderr || result.stdout}`);
  }

  return result.stdout.trim();
}

const args = parseArgs(process.argv.slice(2));
const data = readData();
const issue = data.issues?.[args.issueIndex];
if (!issue) {
  console.error(`No issue found at index ${args.issueIndex}.`);
  process.exit(1);
}

try {
  const caption = buildCaption(issue, args.issueIndex);
  const media = heroImagePath(issue);
  let sent = null;

  if (args.send || args.dryRun) {
    sent = sendMessage({ target: args.target, caption, media, dryRun: args.dryRun });
  }

  if (args.json) {
    console.log(JSON.stringify({ caption, media, sent }, null, 2));
  } else {
    console.log(caption);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
