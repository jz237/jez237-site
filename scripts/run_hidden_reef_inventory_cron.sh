#!/usr/bin/env bash
set -euo pipefail

REPO="/home/jez237/.openclaw/workspace/jez237-website"
cd "$REPO"

TRACKED_PATHS=(
  "prototypes/hidden-reef/assets/product-data.js"
  "prototypes/hidden-reef/assets/products.js"
  "prototypes/hidden-reef/assets/new-arrivals.js"
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

node scripts/import_hidden_reef_sitemap_products.mjs \
  --write \
  --concurrency 4

node scripts/update_hidden_reef_new_arrivals.mjs \
  --write

node --check prototypes/hidden-reef/assets/product-data.js
node --check prototypes/hidden-reef/assets/products.js
node --check prototypes/hidden-reef/assets/new-arrivals.js
node --check scripts/refresh_hidden_reef_products.mjs
node --check scripts/import_hidden_reef_sitemap_products.mjs
node --check scripts/update_hidden_reef_new_arrivals.mjs

node - <<'NODE'
const cp = require('node:child_process');
const fs = require('node:fs');
const file = 'prototypes/hidden-reef/assets/product-data.js';
const newArrivalsFile = 'prototypes/hidden-reef/assets/new-arrivals.js';
const current = fs.readFileSync(file, 'utf8');
const previous = cp.execFileSync('git', ['show', `HEAD:${file}`], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024
});
const ignoreRefreshTimestamps = value =>
  value
    .replace(/^\/\/ Presentation refresh:.*$/m, '// Presentation refresh: <ignored>')
    .replace(/^\/\/ Public sitemap import:.*$/m, '// Public sitemap import: <ignored>')
    .replace(/"refreshedAt":"[^"]+"/, '"refreshedAt":"<ignored>"')
    .replace(/"publicSitemapCheckedAt":"[^"]+"/, '"publicSitemapCheckedAt":"<ignored>"');
if (current !== previous && ignoreRefreshTimestamps(current) === ignoreRefreshTimestamps(previous)) {
  fs.writeFileSync(file, previous);
  console.log('Only inventory refresh timestamps changed; no commit or deploy needed.');
}
try {
  const arrivalsCurrent = fs.readFileSync(newArrivalsFile, 'utf8');
  const arrivalsPrevious = cp.execFileSync('git', ['show', `HEAD:${newArrivalsFile}`], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  });
  const ignoreGeneratedAt = value =>
    value.replace(/"generatedAt": "[^"]+"/, '"generatedAt": "<ignored>"');
  if (arrivalsCurrent !== arrivalsPrevious && ignoreGeneratedAt(arrivalsCurrent) === ignoreGeneratedAt(arrivalsPrevious)) {
    fs.writeFileSync(newArrivalsFile, arrivalsPrevious);
    console.log('Only new arrivals refresh timestamp changed; no commit or deploy needed.');
  }
} catch {
  // The file may not exist in older commits; let the normal diff path handle it.
}
NODE

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
