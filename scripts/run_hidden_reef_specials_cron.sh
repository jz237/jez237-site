#!/usr/bin/env bash
set -euo pipefail

REPO="/home/jez237/.openclaw/workspace/jez237-website"
cd "$REPO"

if ! git diff --quiet -- prototypes/hidden-reef/index.html; then
  echo "Hidden Reef homepage already has uncommitted changes; refusing to overwrite them."
  exit 2
fi

node scripts/update_hidden_reef_specials.mjs --write

if git diff --quiet -- prototypes/hidden-reef/index.html; then
  echo "Hidden Reef weekly specials already current; no commit or deploy needed."
  exit 0
fi

git add prototypes/hidden-reef/index.html
git commit -m "Refresh Hidden Reef weekly specials"
git push origin main

scripts/deploy_hidden_reef_cloudflare.sh

echo "Hidden Reef weekly specials refreshed, pushed, deployed, and verified."
