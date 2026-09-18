#!/usr/bin/env bash
# Fetch the Z-Anatomy source models (CC BY-SA 4.0) into an external scratch directory.
set -euo pipefail
SRC="${ANATOMY_SRC:-$HOME/.cache/anatomy-studio/z-anatomy}"
if [ ! -d "$SRC/.git" ]; then
  mkdir -p "$(dirname "$SRC")"
  git clone --filter=blob:none --sparse --depth 1 -b PC-Version https://github.com/LluisV/Z-Anatomy.git "$SRC"
fi
git -C "$SRC" sparse-checkout set --no-cone \
  '/Resources/Models/FBX/*' '/Resources/Descriptions/OriginalDescriptions/*' '/Resources/Layers/*' '/LICENSE' '/README.md'
git -C "$SRC" rev-parse HEAD > "$SRC/.anatomy-commit"
echo "commit $(cat "$SRC/.anatomy-commit")"
ls -la "$SRC/Resources/Models/FBX"
echo "descriptions: $(ls "$SRC/Resources/Descriptions/OriginalDescriptions" | wc -l)"
