#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const BASELINE_COMMIT = "4810212c063f49501d5d5dbb5bb7ba4bf8c66fd1";
const BASELINE_LABEL = "2026-08-24 Final Blow 1.9E live-safe baseline";
const DEFAULT_GITHUB_REPOSITORY = "jz237/jez237-site";
const PRODUCTION_BRANCHES = new Set(["main"]);
const REQUIRED_PATHS = [
  "games/index.html",
  "garden/index.html",
  "experiments/image-gen-2-benchmark/index.html",
  "content/site.json",
];

function runGit(args, { allowFail = false } = {}) {
  const result = spawnSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (!allowFail && result.status !== 0) {
    const stderr = result.stderr.trim();
    throw new Error(`git ${args.join(" ")} failed${stderr ? `: ${stderr}` : ""}`);
  }

  return {
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function resolveCommit(ref) {
  const resolved = runGit(["rev-parse", ref], { allowFail: true });
  return resolved.status === 0 ? resolved.stdout : ref;
}

function currentBranch() {
  if (process.env.CF_PAGES_BRANCH) return process.env.CF_PAGES_BRANCH;
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;

  const branch = runGit(["branch", "--show-current"], { allowFail: true });
  return branch.status === 0 ? branch.stdout : "";
}

function currentCommit() {
  const ref =
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    runGit(["rev-parse", "HEAD"]).stdout;

  return resolveCommit(ref);
}

async function compareOnGitHub(commit) {
  const repository =
    process.env.DEPLOY_GUARD_REPOSITORY ||
    process.env.GITHUB_REPOSITORY ||
    DEFAULT_GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const url =
    `https://api.github.com/repos/${repository}/compare/` +
    `${BASELINE_COMMIT}...${commit}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "jez237-live-deploy-guard",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    return {
      ok: false,
      method: "github-compare",
      detail: `GitHub comparison request failed: ${error.message}`,
    };
  }

  if (!response.ok) {
    const body = await response.text();
    return {
      ok: false,
      method: "github-compare",
      detail:
        `GitHub comparison returned HTTP ${response.status}` +
        (body ? `: ${body.slice(0, 300)}` : ""),
    };
  }

  const comparison = await response.json();
  const ok = comparison.status === "ahead" || comparison.status === "identical";
  return {
    ok,
    method: "github-compare",
    detail:
      `status=${comparison.status}; ahead=${comparison.ahead_by}; ` +
      `behind=${comparison.behind_by}`,
  };
}

async function commitContainsBaseline(commit) {
  const ancestorCheck = runGit(
    ["merge-base", "--is-ancestor", BASELINE_COMMIT, commit],
    { allowFail: true },
  );

  if (ancestorCheck.status === 0) {
    return { ok: true, method: "ancestor" };
  }

  return compareOnGitHub(commit);
}

function fail(message) {
  console.error(`Deploy guard failed: ${message}`);
  process.exit(1);
}

const branch = currentBranch();
const commit = currentCommit();

if (branch && !PRODUCTION_BRANCHES.has(branch)) {
  console.log(`Deploy guard skipped for non-production branch ${branch}.`);
  process.exit(0);
}

const baselineCheck = await commitContainsBaseline(commit);

if (!baselineCheck.ok) {
  fail(
    `commit ${commit} does not include ${BASELINE_LABEL} ${BASELINE_COMMIT}. ` +
      "Refusing to deploy a tree older than or disconnected from the protected " +
      `live site.${baselineCheck.detail ? ` ${baselineCheck.detail}` : ""}`,
  );
}

const missingPaths = REQUIRED_PATHS.filter((path) => !existsSync(path));
if (missingPaths.length > 0) {
  fail(`required live-site paths are missing: ${missingPaths.join(", ")}`);
}

console.log(
  `Deploy guard passed for ${branch || "current branch"} at ${commit}. ` +
    `Baseline: ${BASELINE_COMMIT}; method: ${baselineCheck.method}` +
    `${baselineCheck.detail ? `; ${baselineCheck.detail}` : ""}.`,
);
