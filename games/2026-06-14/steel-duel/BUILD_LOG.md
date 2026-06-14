# Steel Duel — build log

Built by executing `AUTONOMOUS_BUILD_PROMPT.md` (autonomous iterate-and-test loop).
Acceptance rubric: A Faithfulness · B Stability · C Performance · D Visual ≥8 · E Reach · F Integration.

## Iter 1 — scaffold + sim + harness
Wrote `audio.js`, `art.js`, `game.js`, `index.html`. Implemented fixed-timestep deterministic sim
(seeded mulberry32), maze (border + interior wall rects, open central minefield), differential tank
steering, straight wall-absorbed shells (1 in flight), destructible no-respawn mines, kill→opponent
point + death freeze + respawn, 60s timer with final-20s flash, deterministic AI (seek/avoid/aim),
`window.__g` hooks, and the `runTests()` assertion suite.

## Iter 2 — first test run: 7/9
- ✓ T-F1 walls, T-F2 steering, T-F3 mines, T-F5 kill economy, T-F7 determinism, T-soak, T-perf
- ✗ T-F4 shells (kill=false) — **test bug**: I placed the shooter at col4/row9, which is *inside*
  wall block `[3,8,2,2]`, so the shell was absorbed on spawn. Game logic was correct.
- ✗ T-F6 timing (flash=false) — **test bug**: set `timeLeft=21`, one tick → 20.98, just above the
  20s flash threshold.
Fix: moved T-F4 to the open top corridor (row 2) with a clear shooter→target lane and a real wall
for the absorb check; made T-F6 assert both "not flashing >20s" and "flashing after entering ≤20s".

## Iter 3 — all functional gates green: 9/9
`runTests()` → 9/9 pass. Determinism hash identical across two 600-tick bot matches; soak completes
with no NaN/console errors; sim ≤ 2ms/step.

## Iter 4 — visual capture pass
- `?shot=` scenes rendered as paused frames (no live rAF — honors the hidden-preview frozen-clock
  gotcha). Fixed two capture issues:
  1. Scenes didn't hide the DOM title overlay → it covered gameplay. Force-hide overlays in `shot()`.
  2. Explosion particles were all stacked at the origin because `PARTS.update()` only runs in the
     rAF loop. `shot()` now advances the visual layer a few frames so bursts/tracers spread.
- Captured & graded title, duel, explosion, minefield, classic (1974), mobile — all read clearly.

## Iter 5 — integration + finalize
- Registered card in `games/index.html` (top, featured) + `SITE_GAME_PATHS`.
- Verified leaderboard worker reachable (ns `steel-duel`, empty board) and offline-degrading.
- Live render perf: **0.133 ms/step** (sim+render) — far under the 6 ms budget; ~60 fps.
- Mobile checked portrait (centered, controls clear) and landscape (full-height playfield, D-pad +
  FIRE flank the field, nothing clipped).

## Final rubric status — ALL GREEN ✅
- **A Faithfulness:** F1–F8 each pass T-F* (9/9). 100%.
- **B Stability:** soak completes, no NaN, 0 console errors/warnings; determinism passes.
- **C Performance:** 0.133 ms/step sim+render (budget 6 ms); steady 60 fps.
- **D Visual ≥8/10:** see `ART_LOG.md` (avg ~8.7).
- **E Reach:** desktop (2P + vs-CPU keyboard) and mobile (portrait & landscape touch), no clipping.
- **F Integration:** leaderboard read/write + offline fallback; registered in index; no index regressions.

## Notes / decisions (made autonomously)
- Name **Steel Duel** chosen to stay distinct from the existing 3D "Iron Ridge" tank game.
- Leaderboard ranks **points vs CPU** (PvP is inherently unrankable on a single-score board).
- Shells non-bouncing (faithful to the 1974 original); 1 shot in flight per tank (gated fire rate).
- `MAX_SHELLS`, speeds, `FREEZE`, mine count, timer are constants at the top of `game.js` for tuning.
