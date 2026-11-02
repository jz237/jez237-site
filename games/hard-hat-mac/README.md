# Hard Hat Mac: Skyline

A 3D three.js rebuild of Hard Hat Mac for jez237.com. It keeps the idea of the 1983 Apple II game (a construction worker building a steel frame against the clock, dodging a vandal and a safety inspector) and redesigns it as a 3D platformer. The previous 2D canvas edition (v2.3) lives on unchanged in `classic/`.

No build step: plain ES modules, three.js r181 vendored in `vendor/three/`.

## Shifts

| # | Shift | Time | Job | Hazards |
|---|-------|------|-----|---------|
| 1 | Steel Skeleton | 7:00 AM | Carry 4 girders into the glowing gaps and hold ACT to rivet them | Falling bolts, vandal (pulls out loose girders), hoist elevator |
| 2 | Crane Yard | 6:30 PM | Find 5 lunchboxes | Rolling pipes, guard dog, conveyor, crane magnet ride to the silo |
| 3 | The Mill | 11:00 PM | Load 4 crates into the furnace hopper | Hydraulic presses, electric arc, steam vent, molten channel |
| 4 | Topping Out | 7:40 PM | Rivet 3 girders, then set the topping-out beam on the crown | Wind gusts, wrecking ball, crane-carried beam across a gap, 40-floor drop |

**Knockouts:** Mac swings his hammer (`F` / gamepad `Y` / touch `BONK`, not while carrying) with a light auto-aim; any enemy in front within ~1.6 m is knocked flying and lies out cold for ~8 s (6.5 s for the inspector, shorter in later rounds), harmless until he gets up. Stomping still works on the vandal and the dog; the inspector's hard hat makes him stomp-proof. Hammer KO 400 pts, stomp 250, multiplied by the chain count for knockouts within 3 s.

**Demo playthrough:** `WATCH DEMO` on the title, `?demo` in the URL, or 45 s idle on the title starts an autopilot (`src/bot.js`) that plays all four shifts with ordinary controls and narrates what it's doing. Any key / gamepad button / STOP ends it. Demo runs never touch the leaderboard, high score or unlocks, and deaths don't cost lives.

After Shift 4 the game loops into a faster round (enemy speed +12%, hazards +15%, timers −8% per round, capped). Extra hard hat every 25,000 points. Falls of more than ~7 m are fatal; one floor (4 m) is safe.

## Files

- `index.html` — page shell, screens, HUD markup, import map (pins every module with `?v=N`).
- `style.css` — UI (Bungee + Rubik from Google Fonts).
- `src/main.js` — boot, state machine (title → intro → play → clear → tally / over), fixed 120 Hz simulation, scoring, leaderboard, `window.__hhm` test hooks.
- `src/levels.js` — the four shifts as data built with the kit (`gridFloor` strings: `D` decked walkway, `B` bare beam, `G` girder socket, `0` open).
- `src/builder.js` — geometry kit (I-beams, decks, columns, ladders, rails, containers, cranes, conveyors, signs), merged by material at `finish()`.
- `src/level.js` — assembles a level: geometry, movers, hazards, objects, lamp lights, nav grid.
- `src/physics.js` — AABB world with spatial hash + vertical-cylinder character controller (step-up, moving platforms, conveyors).
- `src/player.js` — Mac: movement, coyote time, jump buffer, ladders (grab from bottom or top), carrying, riveting, fall damage.
- `src/enemies.js` — auto-generated 0.5 m nav grid over walkable surfaces (+ ladder, ledge-drop, ladder-then-drop and crane-ride links; enemies skip drops, rides and conveyors), heap A*, vandal / inspector / dog AI with knockout state.
- `src/bot.js` — demo autopilot: one multi-target Dijkstra pass picks the cheapest job (rivet first, girder→gap pairing, crates→hopper, lunchboxes, cheap power-up detours), then path-follows with ladder/drop/ride handling, waits on each hazard's `danger(x, y, z)` look-ahead, dodges bolt telegraphs, braces against wind and knocks out enemies (putting its load down first).
- `src/hazards.js` — elevator, crane magnet, crane beam, bolts, pipes, presses, steam vent, arc, molten channel, ladle crane, wrecking ball, wind.
- `src/objects.js` — girders, crates, topping-out beam, sockets (hologram + rivet dots), pickups, hopper, beacons.
- `src/characters.js` — procedural jointed puppets (Mac, Vandal, Inspector) and the dog, with a pose solver.
- `src/textures.js` — procedural PBR textures, the shared cut-away shader patch (dithers out geometry above Mac between him and the camera).
- `src/env.js` — sky shader, lighting presets, PMREM environment, procedural city with traffic.
- `src/render.js` — renderer + post chain. Quality: 0 Low (FXAA), 1 Medium (+bloom), 2 High (+4× MSAA, SMAA), 3 Ultra (+GTAO, 4096 shadows). Auto defaults to Ultra on desktop, Medium on touch, and steps down if the frame rate stays under 48.
- `src/audio.js`, `src/input.js`, `src/ui.js`, `src/fx.js`, `src/util.js`.
- `assets/audio/` — all audio, generated with ElevenLabs (sound effects, voice lines, music).
- `tools/gen_audio.py` + `tools/audio_spec.json` — regenerate audio: `python tools/gen_audio.py <raw_cache_dir> assets/audio [names…]` with `ELEVENLABS_API_KEY` set in the environment (never commit the key). Short clips get a static gain + limiter; loops and music get two-pass linear loudnorm so loop points survive.
- `sw.js` — retirement worker: clears the 2D edition's cache-first offline cache and unregisters itself.

## Releasing

The Cloudflare zone caches `.js`/`.css` for hours regardless of `_headers`; only HTML revalidates. On every release bump **every** `?v=` in `index.html` (import map entries, `style.css`, `src/main.js`).

## Test hooks

`window.__hhm`: `state()`, `start(levelIndex)`, `warp(x, y, z)`, `god(on)`, `nav()`, `demo()`, `speed(n)` (simulation time scale, for fast demo tests), `bot()` (status/goal), and `game` (the whole game object). Attract mode is disabled under WebDriver or with `?noattract`. The Playwright scripts used during development live outside the repo (`D:\Projects\.tmp\jez237-hardhat3d-test\`: `smoke.mjs`, `gameplay.mjs`, `flow.mjs`, `reach.mjs`, `ko.mjs`, `demo.mjs`, `perf.mjs`, `mobile.mjs`).

Global scores: `https://game-scores.jez237.workers.dev/scores/hard-hat-mac-skyline-v1` (local top-10 fallback offline). Continued games don't submit.
