#!/usr/bin/env bash
# Run every Blender export in parallel. Env: ANATOMY_SRC (Z-Anatomy checkout), ANATOMY_WORK (scratch), EXPORT_FULL=1 for the undecimated tier (raw-hi/).
set -uo pipefail
SRC="${ANATOMY_SRC:-$HOME/.cache/anatomy-studio/z-anatomy}/Resources/Models/FBX"; WORK="${ANATOMY_WORK:-$HOME/.cache/anatomy-studio/work}"; HERE="$(cd "$(dirname "$0")" && pwd)"
BLENDER="${BLENDER:-$HOME/.local/bin/blender}"; mkdir -p "$WORK/logs"
run(){ "$BLENDER" -b --factory-startup -P "$HERE/blender-export.py" -- --fbx "$SRC/$1" --system "$2" --work "$WORK" --rules "$HERE/rules.json" --full "${EXPORT_FULL:-0}" > "$WORK/logs/export-$2${EXPORT_FULL:+-hi}.log" 2>&1; echo "== $2 exit $?"; grep -E '\[export|Error|Traceback' "$WORK/logs/export-$2.log" | tail -6; }
run SkeletalSystem100.fbx skeletal & run CardioVascular41.fbx cardiovascular & run NervousSystem100.fbx nervous & run MuscularSystem100.fbx muscular &
run Joints100.fbx joints & run LymphoidOrgans100.fbx lymphoid & run "Regions of human body100.fbx" regions & run VisceralSystem100.fbx visceral & wait
