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

---

# v3 — Single-player & co-op CAMPAIGN (levels, enemy types, bosses)

Driven by `CAMPAIGN_BUILD_PROMPT.md` (autonomous iterate-and-test loop). Goal: grow the Versus duel
into a full PvE campaign for 1P + co-op without breaking Versus. Plan in `CAMPAIGN_DESIGN.md`.

## Iter 0 — plan
Read the full codebase. Wrote `CAMPAIGN_DESIGN.md`: 12-level arc (bosses at 4/8/12), 6 enemy types,
3 bosses, lives/health + co-op scaling, difficulty curve, leaderboard plan, test plan. Key decisions:
- Build campaign as an **additive, `mode==='campaign'`-guarded layer** so Versus (F1–F8) is untouched.
- Reuse the existing multi-HP tank model (`TANK_MAX_HP`) + team targeting (`ally`/`enemy`) + per-tank
  A* AI rather than a parallel system. Enemy types = stat/behavior knobs on the same tank.
- Data-driven `ARENAS` / `LEVELS` / `ENEMY_TYPES` tables (kept inside game.js IIFE for now — could
  split to `levels.js` later; logged as a deviation from the design's file split, low priority).
- "Thinner walls + more area": campaign arenas are **sparser/more open** than the duel maze (same
  1-tile collision grid). True sub-tile-thin walls would need a finer collision model — deferred;
  noted honestly. Current arenas already give much more maneuver room.

## Iter 1 — campaign engine core (vertical slice)  ✅ 20/20 tests green
Implemented end-to-end and verified live (preview server, headless `__g.runTests()`):
- New `campaign` mode + state machine (`fight`/`clear`/`levelclear`/`won`/`lost`), generic level/wave
  engine: `loadCampaignLevel` → `spawnCampaignWave` → clear → next wave → next level → victory/defeat.
- Lives model (3, +1 on level clear, cap 5), ally death → lose a life → timed respawn, co-op revive
  rule wired (`waveScaled` scales enemy count with players). Game-over when all lives gone.
- 4 enemy types so far (`grunt`/`scout`/`brute`/`sniper`) with distinct hp/speed(`spdMul`)/skill/
  fire-rate(`fireCd`)/damage/engage-range; typed shells carry `dmg`; brute hits for 2.
- 4 campaign arenas (`open`/`pillars`/`corridors`/`arena`) — more open than the duel; T-C4 soak
  confirms walls stay solid (no border breach) across all four.
- Campaign HUD (score, lives pips, level/wave/enemies, ally health, wave/level-clear banners),
  campaign-aware game-over overlay + leaderboard scoring (`score*100 + level`; namespace bucketing
  to `steel-duel-campaign` deferred to integration iter).
- Player turret: mouse/twin-stick aim for 1P; hull-locked for local co-op (refine later).
- Menu: CAMPAIGN (1P) + CAMPAIGN CO-OP (2P) buttons; `?campaign=N&players=M` launcher;
  `?shot=campaign|coop` deterministic capture scenes.
- `__g` campaign hooks: `startCampaign`, `campaign`, `enemies`, `allies`, `boss`, `spawnEnemy`,
  `clearEnemies`, `loseLife`, `levels`.
- New tests: **T-C1 progression** (advance + game-over), **T-C2 enemy types**, **T-C4 arena walls**,
  **T-C6 campaign determinism**. Fixed one test-assertion off-by-one (T-C2 threshold).

**Status after Iter 1:** runTests **20/20** (all Versus F1–F8/T-WALL/T-AI/soak/perf + new T-C1/C2/C4/C6).
Live smoke: bot-driven player cleared a wave, scored, advanced L1→L2, lost lives → clean game-over,
**no NaN, 0 console errors**. `?shot=campaign` renders Heavy Metal (corridors arena, grunt+brute,
clear HUD) — visually solid.

## Iter 2 — all 6 enemy types + per-type behavior  ✅ 22/22 tests green
- Added **Layer** (drops mines behind itself on a timer; capped via `minesLeft`/global mine count;
  `dropMine` places behind the hull so it never self-detonates) and **Warden** (front-armor plate:
  shells landing within `WARDEN_ARC` of its hull heading **deflect** with a spark+clink; must be
  flanked; `faceFoe` AI keeps its front toward the player).
- Per-type AI now differentiates via `range`/`flank`/`push`/`keepFar`/`faceFoe` knobs on the shared
  A* driver: scout swarms close, brute pushes in, sniper kites at long range, layer mines + keeps mid
  distance, warden orients its plate at you.
- Level table grown to 7 (added **Minefield** [layers] and **Wardens** [warden+brute]); Onslaught now
  mixes all six types across 3 waves.
- New tests: **T-C2 layer drops mines**, **T-C2 warden front armor** (front deflects, flank damages).
- Verified live: Minefield run — layer dropped 3 mines mid-fight (6→9), score accrued, no NaN;
  Wardens level spawns warden (hp 3). **0 console errors.** Determinism (T-C6) still green with the
  new RNG users routed through the seeded PRNG.

**Status after Iter 2:** runTests **22/22**. All six enemy types in and behaviorally distinct.

## Iter 3 — bosses + full 12-level arc  ✅ 23/23 tests green
- Boss framework (`BOSS_DEFS`, `bossTank`, `bossCommand`, `bossAttack`): bosses are big (hitR 26–33),
  high-HP (18/22/32, ×players in co-op), mine-immune, not normal bots — driven by `bossCommand` +
  timed `bossAttack` pattern firing (bypasses the 1-shell cap via `bossFire` so they can salvo).
- 3 distinct multi-phase bosses (3 HP-tier phases each):
  - **The Bastion** (L4) — stationary fortress, radial shell spreads (8→10), phase 2 spawns 2 grunts.
  - **Mauler** (L8) — charges the player, **front-armor plate** (reuse warden arc → must flank),
    3-shot bursts, phase 2 lays a mine ring + summons 2 scouts.
  - **Iron Warlord** (L12 finale) — phase 1 four-way salvo, phase 2 summons a scout pack, phase 3
    rapid 5-shot barrage. Defeat → victory.
- Boss visuals: `drawBossEntity` (large segmented armored hull, phase-keyed core glow, front-armor
  highlight, big turret) + a **boss HP bar** with name/phase in the HUD.
- Level table grown to the full **12-level arc** (bosses at 4/8/12; added Gauntlet, Last Stand).
  Boss waves use a `['__boss__']` sentinel so they slot into the generic wave/clear engine.
- `?shot=boss` capture scene; **T-C3 boss** test (spawns big, survives hits, phase-transitions,
  defeat clears the level). Fixed two test-harness bugs (phase threshold rounding; clear all adds).
- **Verified live:** Bastion fight stable (spreads fire, no NaN); **full programmatic playthrough
  reached all 12 levels → Iron Warlord → `phase: 'won'` victory**. 0 console errors. (`?shot=boss`
  render path runs clean; screenshot capture hit the known hidden-preview frozen-clock timeout, not a
  code error — boss data valid: THE BASTION, phase 2, 10/18 HP.)

**Status after Iter 3:** runTests **23/23**. Campaign is playable start-to-finish (§7B met). Core
feature set complete: 12 levels, 6 enemy types, 3 bosses, lives/progression.

## Iter 4 — local co-op polish  ✅ 24/24 tests green
- **Local 2-player campaign co-op**: P2 now driven by arrow keys + Enter/RShift (added campaign to the
  `twoLocal` keyboard branch). Both players hull-locked WASD/arrows (duel-style — consistent + works
  for two on one keyboard; P1 mouse-turret only in 1P).
- **Shared life pool scales with players**: `2 + players` (1P→3, 2P→4, 3P→5, 4P→6); level-clear bonus
  cap is now player-aware. Enemy counts already scale via `waveScaled`.
- One player's death no longer ends the run while a teammate lives (timed revive); enemy kills credit
  the **shared** campaign score regardless of which ally lands them.
- New test: **T-C5 co-op scaling** (more players → more enemies + bigger life pool; one death ≠ game
  over; shared score). Verified live: 2P run — both tanks move & fire independently, lives 4, enemies
  scaled 3→4, **0 console errors**.

**Status after Iter 4:** runTests **24/24**. Campaign complete for 1P + local co-op, start-to-finish
to victory. (Online co-op *campaign* start path not yet wired — existing online duel/survival co-op
untouched and still work; online campaign noted as a stretch goal for the integration pass.)

### Remaining for v3 (next iterations, per §8)
5. More arena layouts (→ ≥6 distinct, rubric E) + **campaign perf test** (heaviest frame ≤8ms, rubric
   C). 6. Onboarding/flow: campaign how-to + level/difficulty select on menu; **mobile** verify (1P
   twin-stick). 7. Visual+audio polish: per-type enemy art distinction (currently shared silhouette +
   color), boss/telegraph SFX, damage states, capture+grade the new `?shot` scenes (rubric F).
8. Balance/difficulty tiers (solo Veteran fair) + tune boss HP. 9. Integration: leaderboard namespace
   `steel-duel-campaign`, `games/index.html` card/desc, cleanup → **ship** (commit+push `jez237-site
   main` → GitHub + jez237.com).
