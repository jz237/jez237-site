# Hard Hat Mac: Skyline

A 3D three.js rebuild of Hard Hat Mac for jez237.com. It keeps the idea of the 1983 Apple II game (a construction worker building a steel frame against the clock, dodging a vandal and a safety inspector) and redesigns it as a 3D platformer. The previous 2D canvas edition (v2.3) lives on unchanged in `classic/`.

No build step: plain ES modules, three.js r181 vendored in `vendor/three/`.

## Shifts

| # | id | Shift | Job | Hazards |
|---|----|-------|-----|---------|
| 1 | `skeleton` | Steel Skeleton | Carry 4 girders into the glowing gaps and hold ACT to rivet them | Falling bolts, vandal (pulls out loose girders), hoist elevator |
| 2 | `yard` | Crane Yard | Find 5 lunchboxes | Rolling pipes, guard dog, conveyor, crane magnet ride to the silo |
| 3 | `mill` | The Mill | Load 4 crates into the furnace hopper | Hydraulic presses, electric arc, steam vent, molten channel |
| 4 | `pit` | The Pit | Run 4 pumps (hold ACT on each valve) before the flooded foundation rises over the floor | Rising water, pile driver, falling rocks, yard dog in the pit |
| 5 | `bridge` | River Span | Set and rivet 4 deck girders, carried out from both banks | River below, swinging girder bundle, gusts, diving gulls |
| 6 | `wreck` | Wrecking Crew | Unbolt 4 old beams (hold ACT) and haul them to the scrap bin | Cracked slabs that drop away, wrecking ball, falling bricks |
| 7 | `storm` | Storm Watch | Switch on 5 aircraft warning beacons | Lightning strikes (crackling ground first), strong gusts, slick bare beams in the rain |
| 8 | `topout` | Topping Out | Rivet 3 girders, then set the topping-out beam on the crown | Wind gusts, wrecking ball, crane-carried beam across a gap, 40-floor drop |

After Shift 8 the game loops into a faster round (enemy speed +12%, hazards +15%, timers −8% per round, capped). Extra hard hat every 25,000 points. Falls of more than ~7 m are fatal; one floor (4 m) is safe.

**Knockouts:** `F` / gamepad `Y` / touch `BONK` swings the hammer with a light auto-aim; an enemy in front within ~1.6 m is out cold for ~8 s (6.5 s for the inspector). Stomping works on the vandal and the dog. While carrying, the same button is a **shoulder shove**: the enemy staggers back ~2 m and is dazed for 1.5 s, and Mac keeps the load (added for the Mill hopper, where the stomp-proof inspector used to trap loaded players; the Mill's top gantry also has two extra ladders now).

**Checkpoints:** each shift has 2–4 posts (`B.checkpoints`). After a death Mac respawns at the last one touched with all progress kept.

**Records** (`src/records.js`): per shift, three stars — par time (`par` in `LEVEL_INFO`), no deaths, every bonus pickup. Medal = star count of the best run (bronze/silver/gold). The best run's ghost (15 Hz int16 poses, base64 in localStorage) plays back as a see-through Mac. Top-10 shift times post to `game-scores.jez237.workers.dev/scores/hard-hat-mac-skyline-<id>-times-v1` with score = 1,000,000 − milliseconds (the board sorts high-first). Demo, co-op and assisted runs never touch records or boards.

**Skyline:** every shift finished outside the demo adds its own Mac & Sons building to a slot north of the site (`LANDMARKS` in `env.js`, stored in `progress.built`). The end-of-shift flyover swings over to a newly added building, which gets a searchlight for a few seconds.

**Demo playthrough:** `WATCH DEMO`, `?demo`, or 45 s idle on the title starts `src/bot.js`, which plays all eight shifts with ordinary controls. A camera director cuts to crane-ride, long-ladder and tracking shots, and slow motion on knockouts. Any key ends the demo. An edge guard stops the bot walking off ledges except on deliberate drops.

**Assists & controls:** Settings has enemy speed, extra shift time and unlimited hard hats (an assisted run is flagged `ASSIST` and kept off the boards), the ghost toggle, and a keyboard remapping screen (`ACTIONS` in `input.js`; a custom key replaces an action's first default).

**Online co-op** (`src/coop.js`): one player hosts a room (5-character code), the other joins. Transport is the shared relay `wss://iron-ridge-online.jez237.workers.dev/ws/HHM-<CODE>` (the Iron Ridge worker; only its verbatim co-op message types `pg`, `es`, `wv`, `wc`, `down`, `hit`, `ck`, `ek`, `cv` are used, each tagged `g: 'hhm1'`). The host simulates the shift and streams a snapshot 12×/s (`es`: enemies, carryables, sockets, pickups, stations, checkpoints, hazard clocks via each hazard's `sync()`/`setSync()`); the guest simulates its own Mac and reports actions (`ck`, `ek`); the host forwards enemy hits on the guest (`hit`). Score and hard hats are shared (5 to start).

## Files

- `index.html` — page shell, screens (incl. co-op lobby and keyboard controls), HUD markup, import map (pins every module with `?v=N`).
- `style.css` — UI (Bungee + Rubik from Google Fonts).
- `src/main.js` — boot, state machine, fixed 120 Hz simulation, scoring, leaderboards, records, flyover, demo director, co-op glue, `window.__hhm` test hooks.
- `src/levels.js` — the eight shifts as data built with the kit (`gridFloor` strings: `D` deck, `B` bare beam, `G` girder socket, `R` bolted old beam, `0` open). `LEVEL_INFO` holds each shift's id and par time.
- `src/builder.js` — geometry kit (I-beams, decks, columns, ladders, rails, containers, cranes, conveyors, signs), merged by material at `finish()`.
- `src/level.js` — assembles a level: geometry, movers, hazards, objects, lamp lights, nav grid, `waterDepth()`.
- `src/physics.js` — AABB world with spatial hash + vertical-cylinder character controller.
- `src/player.js` — Mac: movement, ladders, carrying, riveting/unbolting, cranking valves and switches, hammer and shove, fall damage, wading.
- `src/enemies.js` — 0.5 m nav grid, heap A*, vandal / inspector / dog AI with knockout and shove states; in co-op they chase whichever Mac is closer.
- `src/bot.js` — demo autopilot: one multi-target Dijkstra pass picks the cheapest job, path-follows with ladder/drop/ride handling, waits on each hazard's `danger()`, routes around flooded nodes (`blocks()`), dodges anything telegraphed, braces against wind, shoves or knocks out enemies.
- `src/hazards.js` — elevator, crane magnet, crane beam, telegraphed drops (bolts, rocks, bricks, gulls, lightning), pipes, presses, steam vent, arc, molten channel, ladle, wrecking ball (or girder bundle), wind, water (flood/river), pile driver, crumbling slabs, barges.
- `src/objects.js` — girders, crates, topping-out beam, sockets (incl. demolition beams), pumps/beacons (stations), hopper, scrap bin, checkpoints, pickups, beacons.
- `src/records.js` — medals, best times, ghosts, shift-board score encoding.
- `src/coop.js` — relay connection, partner Mac, snapshot build/apply.
- `src/characters.js` — procedural puppets (Mac, partner Mac, Vandal, Inspector) and the dog.
- `src/textures.js`, `src/env.js` (sky presets incl. dawn/noon/overcast/storm with rain and lightning flashes, city, skyline landmarks, river through the city), `src/render.js`, `src/audio.js`, `src/input.js`, `src/ui.js`, `src/fx.js`, `src/util.js`.
- `src/audio.js` speech gate — every worded line goes through `audio.say()`: one line at a time, 24 s of quiet before a routine line, key lines (title, first-time briefing, shift clear, round, game over, records) skip the gap but wait instead of overlapping, no back-to-back repeats, routine quips chance-gated and at most one per shift. Wordless oofs/heaves/screams/snickers go through `audio.grunt()` (rate-limited SFX). Settings → Voice & narration OFF (`narration` in `hhm3d-settings-v1`) silences every spoken line.
- `assets/audio/` — all audio, generated with ElevenLabs.
- `tools/gen_audio.py` + `tools/audio_spec.json` — regenerate audio: `python tools/gen_audio.py <raw_cache_dir> assets/audio [names…]` with `ELEVENLABS_API_KEY` set in the environment (never commit the key).

## Releasing

The Cloudflare zone caches `.js`/`.css` for hours regardless of `_headers`; only HTML revalidates. On every release bump **every** `?v=` in `index.html` (import map entries, `style.css`, `src/main.js`).

## Test hooks

`window.__hhm`: `state()`, `start(levelIndex)`, `warp(x, y, z)`, `god(on)`, `nav()`, `demo()`, `speed(n)`, `bot()`, and `game`. Attract mode is off under WebDriver or with `?noattract`. The Playwright scripts live outside the repo (`D:\Projects\.tmp\jez237-hardhat3d-test\`; `pw.mjs` blocks score POSTs so tests can't write to the public boards): `gameplay`, `flow`, `ko`, `cp`, `reach`, `smoke`, `shifts`, `ui`, `coop` (two browsers on the live relay), `demo1 <level> [speed]`, `trace <level>`, `mobile`, `perf`.

Global scores: `https://game-scores.jez237.workers.dev/scores/hard-hat-mac-skyline-v1` (local top-10 fallback offline). Continued, co-op and assisted games don't submit.
