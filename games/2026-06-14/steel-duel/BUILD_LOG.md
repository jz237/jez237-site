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

---

# v2 — smarter AI, controls, attract mode, destructible walls

User feedback: the AI was bad (drove into mines / stuck on walls); wanted a Stupid→Can't-Defeat
slider, an attract-mode title with two AIs dueling, desktop A/D/W + mouse, mobile play, global
scoring, destructible walls, and better graphics.

## Iter 6 — rewrite
- **AI:** replaced the reactive turner with **A\* pathfinding** (walls+mines blocked) + a `safeDir`
  whisker so it never drives into a mine; skill now scales only combat (lead, aim error, turret
  speed, cadence, shell-dodge), keeping driving competent at every level.
- **Control model:** unified command bus (turn/throttle/aim/fire) fed by keys, **mouse**, **twin-stick
  touch**, or AI. Added an **independent rotating turret** (mouse-aimed vs CPU; locked to hull in 2P).
- **Attract mode:** new `attract` state runs CPU-vs-CPU on the title behind a now-transparent card.
- **Destructible walls:** per-tile `wallHP`; shells chip (cracks) and blast tiles open; pathfinder
  reads the live grid. Border indestructible.
- **Graphics:** per-tile beveled/merged walls with damage cracks, independent turret + barrel, aim
  reticle, scorch decals, brighter sparks/treads.
- Rewrote `art.js`; added tests **T-WALL** (destructible) and **T-AI** (stupid AI still navigates
  toward foe and never mine-suicides).

## Iter 7 — test run: 10/11
- ✗ T-WALL — **test bug**: it inherited `bots=[true,true]` from the determinism test, so tank 0 was
  AI-driven and wandered instead of shelling the wall. Standalone repro destroyed the wall in 4 hits
  (logic correct). Fix: reset `bots=[false,false]` in T-WALL.

## Iter 8 — all green: 11/11
`runTests()` → 11/11. AI benchmark (bot-vs-bot, ~20s): **Stupid 0–5 Lethal**, Rookie 1–2 Crack Shot,
even 1–0 — difficulty gradient confirmed, longest "stuck" 29 ticks (~0.5s, normal repositioning).

## Iter 9 — visual + integration
- Captured title (attract duel behind card + skill slider), duel (independent turrets + reticle),
  mobile landscape twin-stick — all clean, 0 console errors.
- Updated index card; leaderboard score now encodes difficulty (`points*100 + level`) so beating a
  harder CPU ranks higher; board display splits it back into points / level.

### Final v2 status — ALL GREEN ✅  (11/11 gates; AI gradient verified; no console errors)
