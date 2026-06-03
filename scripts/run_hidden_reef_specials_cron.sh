#!/usr/bin/env bash
set -euo pipefail

REPO="/home/jez237/.openclaw/workspace/jez237-website"
cd "$REPO"

TRACKED_PATHS=(
  "prototypes/hidden-reef/index.html"
  "prototypes/hidden-reef/assets/sale-data.js"
)

if ! git diff --quiet -- "${TRACKED_PATHS[@]}" || ! git diff --cached --quiet -- "${TRACKED_PATHS[@]}"; then
  echo "Hidden Reef specials files already have uncommitted changes; refusing to overwrite them."
  exit 2
fi

node scripts/update_hidden_reef_specials.mjs --write

if git diff --quiet -- "${TRACKED_PATHS[@]}"; then
  echo "Hidden Reef daily specials already current; no commit or deploy needed."
  exit 0
fi

git add "${TRACKED_PATHS[@]}"
python3 /home/jez237/.openclaw/workspace/scripts/scan_git_diff_secrets.py --staged
git commit -m "Refresh Hidden Reef daily specials"
git push origin main

scripts/deploy_hidden_reef_cloudflare.sh

echo "Hidden Reef daily specials refreshed, pushed, deployed, and verified."
