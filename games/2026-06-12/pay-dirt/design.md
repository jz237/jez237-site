# Pay Dirt — design doc

A modernized Lode Runner turned painterly cavern adventure: classic dig-and-dash
platforming with hand-painted procedural art, dynamic lighting, optional
exploration finds, power-ups, new tile types, a handcrafted campaign and a seeded
Daily Dig mode with global scores.

## Architecture

- `index.html` — shell, CSS, DOM overlays (menus), touch controls, script loader
- `art.js` — procedural painterly sprites, tiles, pickups + parallax cave backdrop
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
- The player starts with four lives. Death restarts the level fully while lives remain; after game over, Continue Claim
  restarts the exact current campaign/daily/Boom Rush level with fresh lives and a zero score.

## Modern layer

- Power-ups (timed unless noted): TNT charge (next dig = 3-wide blast, 1 charge),
  Speed Boots (8s, 1.45×), Phase Cloak (6s, pass guards), Gold Magnet (8s, r=2.5 auto-grab),
  Power Shovel (10s, instant digs), and occasional extra-life heart tokens.
- Mobile tap-dig feedback briefly marks the target dirt cell so touch players can see
  what the game understood before the dig starts or the input pulse rejects it.
- Exploration finds are seeded per claim in reachable side paths: relics, cave blooms,
  survey maps, and lantern oil. They add score, visual feedback, and a full-survey
  bonus without blocking the exit. Oil temporarily widens the player light pool; maps
  briefly boost magnet time.
- Combo: gold chained within 2.5s → ×1, ×1.5, ×2 … capped ×5.
- Campaign: 13 levels, one mechanic introduced at a time.
- Visual chapters change every two levels through backdrop selection, chapter tint,
  region-specific small set dressing, and the intro banner's `VEIN` chip.
- Boom Rush 20 adds Baron Brim, a boss claim-jumper who steals gold, cuts rock,
  drops timed TNT, and targets the cart once the final ride-out opens.
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
- 2026-06-12: The scores worker only persists initials/score/ts and drops `extra`, so the
  Daily Dig date is encoded into the namespace (`pay-dirt-daily-YYYY-MM-DD`) rather than
  `extra`. Gives a clean separate board per UTC day; campaign stays `pay-dirt`.
- 2026-06-16: Painterly pass keeps runtime self-contained. Image Gen 2 output is saved as
  `assets/painterly-direction-reference.png` for visual direction; the playable art remains
  procedural so the game stays fast and portable.
- 2026-06-22: Game over offers Continue Claim from the exact level where the run ended,
  and choosing it starts that retry at score zero.
  Boom Rush and campaign visuals now use two-level visual chapters; the softlock/No Way Out
  detector also protects Boom Rush by checking route access to remaining gold and the cart.
- 2026-06-22: `window.__g.qaMine()` is the debug-only QA Mine runner for polish passes.
  It loads campaign, Daily Dig, and Boom Rush levels, checks solver health, false No Way Out
  reasons, and nonblank canvas rendering so future changes can be tested without a full
  manual playthrough.
- 2026-06-22: Smart stuck help uses a subtle prospector hunch after sustained no-progress
  play. It highlights a reachable remaining nugget, or the exit/cart after the haul is
  complete, and can be forced in tests with `window.__g.hunch()`.
- 2026-06-22: Death/respawn polish adds a miner tumble, dust burst, clear center death
  cue with remaining lives, and a short respawn banner while preserving current lives and
  collected-gold rules.
- 2026-06-22: Boom Rush waves show a compact pre-wave card with wave number, main hazard,
  and ride-out goal. The debug hook `window.__g.wavePreview` exposes the current card for
  verification.
- 2026-06-22: Last nugget finder adds a render-only glint/ring around the final one or two
  remaining nuggets. `window.__g.lastNuggetCue` returns active cue target cells for tests.
- 2026-06-22: Mine-cart escape polish adds render-only speed streaks, rail sparks, and a
  collapse dust plume while the cart escape is active, preserving the No Way Out escape guard.
- 2026-06-22: Audio polish adds richer procedural gold sparkle, heavier TNT/explosion
  impact, and named `life`, `cave`, and `cart` SFX. `window.__g.sfx(name)` exists for
  headless no-throw checks.
- 2026-06-22: Secret bonus caves seed as optional side-room discoveries in campaign,
  Daily Dig, and selected Boom Rush waves. They count toward FINDS, award larger bonus
  scores, never gate the exit/cart, and are exposed as `window.__g.secretCaves`.
- 2026-06-22: Campaign clears now pause at Upgrade Camp before the next claim. The player
  chooses Quick Boots, Sharp Pick, or Blast Satchel ranks for the rest of that run; debug
  hooks expose `window.__g.upgrades`, `pendingUpgrade`, `completeLevel()`, and `chooseUpgrade()`.
- 2026-06-22: Best-run ghost shadows record player positions during play, save the fastest
  cleared route per campaign/daily/Boom Rush level in localStorage, and replay as a translucent
  miner on later attempts. Debug hooks expose `window.__g.ghost` and `saveGhost()`.
- 2026-06-22: End-game presentation now creates a canvas cinematic behind the results panel:
  win scenes get golden cart/spotlight/spark effects with mode-specific copy, losses get a
  darker mine-fade treatment. Debug hook `window.__g.ending` exposes the active ending scene.
