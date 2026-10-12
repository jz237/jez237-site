#!/usr/bin/env bash
# Build one species end to end: ./make.sh trex [stages]
set -euo pipefail
cd "$(dirname "$0")"
sp="$1"; stages="${2:-grid,mesh,bake,rig,anim,export,render}"
if [[ ",$stages," == *",grid,"* ]]; then python3 grid.py "$sp" ${GRID_JOBS:+--jobs $GRID_JOBS}; fi
bstages=$(echo "$stages" | tr ',' '\n' | grep -v '^grid$' | paste -sd, -)
if [[ -n "$bstages" ]]; then
  blender -b -P build.py -- "$sp" --stages "$bstages" 2>&1 | grep -E '^\[|Error|Traceback|line [0-9]+|Exception' || true
fi
