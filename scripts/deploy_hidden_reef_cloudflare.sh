#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO="${REPO:-$(cd -- "$SCRIPT_DIR/.." && pwd)}"
SOURCE_DIR="$REPO/prototypes/hidden-reef"
BUILD_DIR="$REPO/tmp/hidden-reef-cloudflare-deploy"
SECRET_ENV="$HOME/.config/openclaw/secrets/hidden-reef-cloudflare.env"

cd "$REPO"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "BLOCKED_DIRTY_DEPLOY: refusing to deploy Hidden Reef from a dirty worktree."
  exit 2
fi

git fetch origin main
local_head="$(git rev-parse HEAD)"
remote_head="$(git rev-parse origin/main)"
if [ "$local_head" != "$remote_head" ]; then
  echo "BLOCKED_STALE_DEPLOY: refusing to deploy Hidden Reef from $local_head while origin/main is $remote_head"
  echo "Push and fast-forward this worktree before deploying Cloudflare Pages."
  exit 2
fi

echo "Preflight: JavaScript syntax checks"
for js_file in "$SOURCE_DIR"/assets/*.js; do
  node --check "$js_file"
done

echo "Preflight: internal link check"
python3 "$SCRIPT_DIR/check_hidden_reef_links.py" "$SOURCE_DIR"

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

CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-39a03cfe0f3854622f3a4f72491f48a6}"
export CLOUDFLARE_ACCOUNT_ID

# Run Wrangler from the disposable upload directory. Running it from the repo
# root writes Hidden Reef's account/project selection into .wrangler/cache,
# which can make later jez237-site Pages commands use the wrong account.
(
  cd "$BUILD_DIR"
  npx --yes wrangler@latest pages deploy . \
    --project-name hidden-reef \
    --branch main \
    --commit-dirty=true
)

curl -A "Mozilla/5.0 Hidden Reef Cloudflare verify" -fsSI --max-time 20 \
  https://hidden-reef.pages.dev/ >/dev/null

echo "Hidden Reef deployed to Cloudflare with checkout footer links removed."
