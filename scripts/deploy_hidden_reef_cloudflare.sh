#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-/home/jez237/.openclaw/workspace/jez237-website}"
SOURCE_DIR="$REPO/prototypes/hidden-reef"
BUILD_DIR="$REPO/tmp/hidden-reef-cloudflare-deploy"
SECRET_ENV="$HOME/.config/openclaw/secrets/hidden-reef-cloudflare.env"

cd "$REPO"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

rsync -a --delete "$SOURCE_DIR/" "$BUILD_DIR/"

# The checkout info links stay in git/GitHub Pages, but are removed from the
# Cloudflare-only upload copy.
find "$BUILD_DIR" -name '*.html' -print0 | xargs -0 perl -0pi -e 's/<a href="(?:\.\.\/){0,2}lightspeed-integration\/">[^<]*<\/a>//g'

if [[ -f "$SECRET_ENV" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "$SECRET_ENV"
  set +a
fi

npx --yes wrangler@latest pages deploy "$BUILD_DIR" \
  --project-name hidden-reef \
  --branch main \
  --commit-dirty=true

curl -A "Mozilla/5.0 Hidden Reef Cloudflare verify" -fsSI --max-time 20 \
  https://hidden-reef.pages.dev/ >/dev/null

echo "Hidden Reef deployed to Cloudflare with checkout footer links removed."
