#!/usr/bin/env bash
set -euo pipefail

REPO="/home/jez237/.openclaw/workspace/jez237-website"
cd "$REPO"

TRACKED_PATHS=(
  "prototypes/hidden-reef/assets/product-data.js"
  "prototypes/hidden-reef/assets/products.js"
)

if ! git diff --quiet -- "${TRACKED_PATHS[@]}" || ! git diff --cached --quiet -- "${TRACKED_PATHS[@]}"; then
  echo "Hidden Reef inventory files already have uncommitted changes; refusing to overwrite them."
  exit 2
fi

SLUGS="$(
  node - <<'NODE'
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync('prototypes/hidden-reef/assets/products.js', 'utf8');
const context = { window: {}, console };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(source, context);
const slugs = [];
for (const group of Object.values(context.window.THR.categories || {})) {
  for (const child of Object.values(group.children || {})) {
    if (child.slug && child.sourceUrl) slugs.push(child.slug);
  }
}
console.log(slugs.join(','));
NODE
)"

node scripts/refresh_hidden_reef_products.mjs \
  --write \
  --prune-missing \
  --slugs "$SLUGS" \
  --max-pages 30

node --check prototypes/hidden-reef/assets/product-data.js
node --check prototypes/hidden-reef/assets/products.js
node --check scripts/refresh_hidden_reef_products.mjs

if git diff --quiet -- "${TRACKED_PATHS[@]}"; then
  echo "Hidden Reef inventory already current; no commit or deploy needed."
  exit 0
fi

git add "${TRACKED_PATHS[@]}"
python3 /home/jez237/.openclaw/workspace/scripts/scan_git_diff_secrets.py --staged
git commit -m "Refresh Hidden Reef inventory"
git push origin main

scripts/deploy_hidden_reef_cloudflare.sh

echo "Hidden Reef inventory refreshed, pruned, pushed, deployed, and verified."
