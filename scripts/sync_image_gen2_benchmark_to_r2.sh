#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/sync_image_gen2_benchmark_to_r2.sh --bucket BUCKET [--prefix PREFIX] [--apply]

Dry-runs by default. Pass --apply to upload with wrangler.

Environment:
  WRANGLER_BIN  Optional wrangler command. Default: npx --yes wrangler@latest

Example:
  scripts/sync_image_gen2_benchmark_to_r2.sh \
    --bucket jez237-site-media \
    --prefix image-gen-2-benchmark/images

  scripts/sync_image_gen2_benchmark_to_r2.sh \
    --bucket jez237-site-media \
    --prefix image-gen-2-benchmark/images \
    --apply
EOF
}

bucket=""
prefix="image-gen-2-benchmark/images"
apply=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bucket)
      bucket="${2:-}"
      shift 2
      ;;
    --prefix)
      prefix="${2:-}"
      shift 2
      ;;
    --apply)
      apply=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$bucket" ]]; then
  echo "Missing --bucket" >&2
  usage >&2
  exit 2
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo="$(cd -- "$script_dir/.." && pwd)"
source_dir="$repo/experiments/image-gen-2-benchmark/images"
wrangler_bin="${WRANGLER_BIN:-npx --yes wrangler@latest}"

if [[ ! -d "$source_dir" ]]; then
  echo "Source image directory not found: $source_dir" >&2
  exit 1
fi

prefix="${prefix#/}"
prefix="${prefix%/}"

count=0
bytes=0

while IFS= read -r -d '' file; do
  rel="${file#"$source_dir"/}"
  key="$prefix/$rel"
  size="$(wc -c < "$file")"
  count=$((count + 1))
  bytes=$((bytes + size))

  if [[ "$apply" -eq 1 ]]; then
    # shellcheck disable=SC2086
    $wrangler_bin r2 object put "$bucket/$key" --file "$file"
  else
    printf 'DRY RUN: %s -> r2://%s/%s\n' "$rel" "$bucket" "$key"
  fi
done < <(find "$source_dir" -type f -print0 | sort -z)

printf 'Processed %d file(s), %.1f MiB total.\n' "$count" "$(awk -v b="$bytes" 'BEGIN { print b / 1048576 }')"
if [[ "$apply" -ne 1 ]]; then
  echo "No uploads performed. Re-run with --apply to sync to R2."
fi
