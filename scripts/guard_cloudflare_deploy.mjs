#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { checkGamesCatalogSyntax } from "./check_games_catalog_syntax.mjs";

const BASELINE_COMMIT = "4810212c063f49501d5d5dbb5bb7ba4bf8c66fd1";
const BASELINE_LABEL = "2026-08-24 Final Blow 1.9E live-safe baseline";
const BASELINE_MARKER_PATH = "scripts/live-deploy-baseline.json";
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

function verifiedBaselineMarker() {
  try {
    const marker = JSON.parse(readFileSync(BASELINE_MARKER_PATH, "utf8"));
    const ok =
      marker.schema === 1 &&
      marker.protectedAncestor === BASELINE_COMMIT &&
      marker.label === BASELINE_LABEL;
    return {
      ok,
      method: "baseline-marker",
      detail: ok
        ? `verified ${BASELINE_MARKER_PATH}`
        : `${BASELINE_MARKER_PATH} does not match the protected baseline`,
    };
  } catch (error) {
    return {
      ok: false,
      method: "baseline-marker",
      detail: `${BASELINE_MARKER_PATH} could not be verified: ${error.message}`,
    };
  }
}

function commitContainsBaseline(commit) {
  const ancestorCheck = runGit(
    ["merge-base", "--is-ancestor", BASELINE_COMMIT, commit],
    { allowFail: true },
  );

  if (ancestorCheck.status === 0) {
    return { ok: true, method: "ancestor" };
  }

  const shallowCheck = runGit(["rev-parse", "--is-shallow-repository"], {
    allowFail: true,
  });
  if (shallowCheck.status === 0 && shallowCheck.stdout === "true") {
    return verifiedBaselineMarker();
  }

  return {
    ok: false,
    method: "ancestor",
    detail: "the full local repository does not contain the protected ancestor",
  };
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

const baselineCheck = commitContainsBaseline(commit);

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

try {
  const checked = checkGamesCatalogSyntax();
  console.log(`Games catalog syntax passed (${checked} inline scripts).`);
} catch (error) {
  fail(error.message);
}

console.log(
  `Deploy guard passed for ${branch || "current branch"} at ${commit}. ` +
    `Baseline: ${BASELINE_COMMIT}; method: ${baselineCheck.method}` +
    `${baselineCheck.detail ? `; ${baselineCheck.detail}` : ""}.`,
);
