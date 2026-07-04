#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const BASELINE_COMMIT = "ed5a786a7103eb8c215f9d30907211c2027b23b0";
const BASELINE_LABEL = "2026-07-04 live-safe baseline";
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

function ensureBaselineAvailable(branch) {
  let check = runGit(["merge-base", "--is-ancestor", BASELINE_COMMIT, "HEAD"], {
    allowFail: true,
  });
  if (check.status === 0) return;

  // Shallow CI checkouts may not include the baseline commit yet.
  runGit(["fetch", "--no-tags", "--depth=1000", "origin", BASELINE_COMMIT], {
    allowFail: true,
  });

  if (branch) {
    runGit(["fetch", "--no-tags", "--depth=1000", "origin", branch], {
      allowFail: true,
    });
  }
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

ensureBaselineAvailable(branch);

const ancestorCheck = runGit(
  ["merge-base", "--is-ancestor", BASELINE_COMMIT, commit],
  { allowFail: true },
);

if (ancestorCheck.status !== 0) {
  fail(
    `commit ${commit} does not include ${BASELINE_LABEL} ${BASELINE_COMMIT}. ` +
      "Refusing to deploy a tree older than the protected live site.",
  );
}

const missingPaths = REQUIRED_PATHS.filter((path) => !existsSync(path));
if (missingPaths.length > 0) {
  fail(`required live-site paths are missing: ${missingPaths.join(", ")}`);
}

console.log(
  `Deploy guard passed for ${branch || "current branch"} at ${commit}. ` +
    `Baseline: ${BASELINE_COMMIT}.`,
);
