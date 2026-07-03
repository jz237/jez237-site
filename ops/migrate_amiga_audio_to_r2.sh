#!/usr/bin/env bash
# Move the 3.2GB Amiga MOD player MP3 library out of git and onto R2.
#
# Run from the repo root on a machine with an authenticated wrangler
# (`wrangler login` or CLOUDFLARE_API_TOKEN with R2 write access):
#
#   R2_BUCKET=<your-bucket-name> ops/migrate_amiga_audio_to_r2.sh
#
# Optional:
#   PUBLIC_BASE  public URL of the bucket
#                (default: the pub-26279…r2.dev domain the site already uses)
#
# What it does, in order:
#   1. uploads experiments/amiga-mod-player/audio/** to
#      <bucket>/amiga-mod-player/audio/** (skips nothing; re-runs overwrite)
#   2. sets a bucket CORS rule allowing cross-origin GET (the player fetches
#      MP3s with fetch()+decodeAudioData, which requires CORS)
#   3. verifies one uploaded file is publicly reachable
#   4. points R2_AUDIO_BASE in the player at the bucket
#   5. git-rms the local audio directory
#
# It does NOT commit or push — review `git status`, test the player locally,
# then commit. It also does NOT rewrite git history: the ~3.2GB already in
# .git stays until you decide on a history rewrite (git filter-repo + a
# coordinated force-push of main), which is a separate, deliberate step.
set -euo pipefail

AUDIO_DIR="experiments/amiga-mod-player/audio"
KEY_PREFIX="amiga-mod-player/audio"
PUBLIC_BASE="${PUBLIC_BASE:-https://pub-26279ae8f18243e38be5748fbfb75f4c.r2.dev}"
APP_JS="experiments/amiga-mod-player/app.js"

[ -n "${R2_BUCKET:-}" ] || { echo "Set R2_BUCKET to the R2 bucket name." >&2; exit 1; }
[ -d "$AUDIO_DIR" ] || { echo "$AUDIO_DIR not found — already migrated?" >&2; exit 1; }
command -v wrangler >/dev/null || { echo "wrangler not found (npm i -g wrangler)." >&2; exit 1; }

echo "Uploading $(du -sh "$AUDIO_DIR" | cut -f1) from $AUDIO_DIR to r2://$R2_BUCKET/$KEY_PREFIX/ …"
count=0
find "$AUDIO_DIR" -type f -name '*.mp3' | sort | while read -r file; do
  key="$KEY_PREFIX/${file#"$AUDIO_DIR"/}"
  wrangler r2 object put "$R2_BUCKET/$key" --file "$file" --remote \
    --content-type audio/mpeg >/dev/null
  count=$((count + 1))
  printf '\r  %d files uploaded (%s)' "$count" "$key"
done
echo

echo "Setting bucket CORS (GET from any origin, matching the current _headers rule)…"
cors_file="$(mktemp)"
cat > "$cors_file" <<'JSON'
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
JSON
wrangler r2 bucket cors put "$R2_BUCKET" --file "$cors_file"
rm -f "$cors_file"

sample="$(find "$AUDIO_DIR" -type f -name '*.mp3' | sort | head -1)"
sample_url="$PUBLIC_BASE/$KEY_PREFIX/${sample#"$AUDIO_DIR"/}"
echo "Verifying $sample_url …"
curl -sfIo /dev/null "$sample_url" || {
  echo "Sample object not reachable at $PUBLIC_BASE — is the bucket's public dev URL enabled and PUBLIC_BASE correct?" >&2
  exit 1
}

echo "Pointing the player at R2…"
python3 - "$APP_JS" "$PUBLIC_BASE/$KEY_PREFIX/" <<'PY'
import sys
path, base = sys.argv[1], sys.argv[2]
# trackUrl resolves track.path ("audio/…") against the base, so the base must
# end at the directory *containing* audio/.
base = base.rsplit("audio/", 1)[0]
src = open(path).read()
needle = 'const R2_AUDIO_BASE = "";'
assert needle in src, "R2_AUDIO_BASE placeholder not found"
open(path, "w").write(src.replace(needle, f'const R2_AUDIO_BASE = "{base}";'))
print(f"  R2_AUDIO_BASE = {base}")
PY

echo "Removing local audio from the working tree…"
git rm -rq "$AUDIO_DIR"

cat <<'EOT'

Done. Next steps:
  1. Serve the site locally and confirm MP3 soundtrack tracks play.
  2. git commit -m "Serve Amiga MOD player audio from R2" && git push
  3. (Optional, separate decision) reclaim the ~3.2GB already in git history:
     git filter-repo --path experiments/amiga-mod-player/audio --invert-paths
     followed by a coordinated force-push — invalidates all existing clones.
EOT
