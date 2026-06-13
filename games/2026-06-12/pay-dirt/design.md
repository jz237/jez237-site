# Pay Dirt — design doc

A modernized Lode Runner: classic dig-and-dash platforming with HD pixel art,
dynamic lighting, power-ups, new tile types, a handcrafted campaign and a seeded
Daily Dig mode with global scores.

## Architecture

- `index.html` — shell, CSS, DOM overlays (menus), touch controls, script loader
- `art.js` — procedural HD pixel sprites + parallax cave backdrop (no external assets)
- `audio.js` — WebAudio SFX + sequenced music loop
- `levels.js` — campaign maps (ASCII), seeded procedural generator + solvability checker
- `game.js` — fixed-timestep sim, entities, AI, rendering, UI flow, scores, `__g` hooks

Logical canvas: 28×16 grid, 36px tiles → 1008×576 playfield + 48px HUD = 1008×624,
letterboxed to the window (millipede desktop-pass convention: logical-res cap,
window-wide input, standard keyboard set).

Sim is fixed-timestep (60Hz accumulator); `__g.step(n)` drives ticks headlessly.

## Tile legend (level ASCII)

| ch | meaning |
|----|---------|
| `.` | empty |
| `#` | diggable brick |
| `X` | solid rock (undiggable) |
| `H` | ladder |
| `-` | overhead bar |
| `$` | gold |
| `T` | trapdoor (looks like brick, no support, fall through) |
| `E` | exit ladder (hidden until all gold collected) |
| `<` `>` | conveyor belt (drifts entities) |
| `C` | crumbling brick (collapses after crossing, no regen) |
| `B` | TNT crate (explodes when dug/blasted, 3×3 clear, lethal) |
| `[` `]` | one-way gate (enterable moving left / right only) |
| `P` | player spawn |
| `G` `S` `M` | guard / scout (fast, no gold) / mason (slow, re-seals holes) |
| `1`-`5` | power-up: TNT charge, speed boots, phase cloak, gold magnet, power shovel |

## Rules (classic core)

- Horizontal move needs support (floor/ladder/bar/guard head). Vertical needs ladder.
- Falling locks x to column center; no steering (classic).
- Dig: burns diagonal-below cell (left/right) if it's `#` and the cell beside the
  player is passable. Hole regenerates after ~5.4s (shimmer warning in the last 1.1s).
  Entity inside at close: guard dies (respawns from top), player dies.
- Gold: collect all → exit ladder revealed → reach the top row on it to clear.
- Guards: BFS chase over the movement graph (classic column-seeking feel),
  can pick up/carry/drop gold, fall into holes (stunned → climb out), die if sealed.
  Guard-carried gold must be shaken loose by trapping the guard.
- Death restarts the level fully (score kept), lives = 3 + extra at score milestones.

## Modern layer

- Power-ups (timed unless noted): TNT charge (next dig = 3-wide blast, 1 charge),
  Speed Boots (8s, 1.45×), Phase Cloak (6s, pass guards), Gold Magnet (8s, r=2.5 auto-grab),
  Power Shovel (10s, instant digs).
- Combo: gold chained within 2.5s → ×1, ×1.5, ×2 … capped ×5.
- Campaign: 13 levels, one mechanic introduced at a time.
- Daily Dig: mulberry32(UTC date) seeds the generator; solvability checker
  (reachability over walk/climb/bar/fall/dig-down edges) gates every emitted level;
  global board namespace `pay-dirt-daily`, date in `extra`.
- Scores API: `https://game-scores.jez237.workers.dev/scores/<ns>`,
  ns `pay-dirt` (campaign) / `pay-dirt-daily`.

## DECISIONS

- 2026-06-12: Multi-file layout (like corner-pocket) over single-file: 5 source files.
- 2026-06-12: Guard pathing = BFS on movement graph recomputed ~0.35s instead of a
  literal port of the 1983 column-scan tables — same chase feel, fewer pathological stalls.
- 2026-06-12: Trapdoors drop everyone (player + guards), like most ports.
- 2026-06-12: Death restarts the level fully (classic), score kept.
- 2026-06-12: Dig keys Z/X (plus ,/. and touch buttons); rest of keys per millipede
  standard set (arrows/WASD, Enter/Space, P pause, M mute, R restart, Esc menu).
- 2026-06-12: TNT crates are lethal to the player too — risk/reward.
- 2026-06-12: One-way gates restrict horizontal entry only (exit free) — readable and simple.
