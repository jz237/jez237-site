# Skyhold 2026 scripts

The game lives in `games/2026-11-09/skyhold/` (plain ES modules, three.js vendored, every local import `?v=15` (1.11.0); bump them
all together, plus the `modulepreload` list in `index.html` and the scripts' imports here). The design brief is in the
work folder `D:/Projects/.tmp/skyhold-work/DESIGN.md`.

| Script | What it checks |
| --- | --- |
| `ramp_check.mjs [runs=30] [sectors=1,2,3,4,5] [profile=human] [diff=normal]` | The human-like autopilot (`ai.js` profile `human`: ~0.36 s reactions, wobbly aim, sometimes late) plays each world from its first wave with the typical upgrades for it. Prints the clear rate, deaths and hits per run and per wave, settlers lost, carrier fight length and causes of death. Targets on Normal: about 95 / 80 / 60 / 40 / 25 %. Last run (1.7.0, 40-50 each): 100 / 85 / 53 / 50 / 30 %; 1.9.0 (sower, hive and husk earlier, one pod intersection per world, the autopilot finishes a wave's last machines; 20-24 each): 100 / 75 / 67 / 40 / 35 %.; 1.10.0 (whirler rings, coils and sparks, scorchers, maws; 20 each): 100 / 95 / 75 / 50 / 35 %.; 1.13.0 (wave 4 of each world is a SPECIAL WAVE of 36 / 36 / 72 / 44 / 56 fighters; 20-24 each): 100 / 75 / 70 / 50 / 35 %.; 1.13.1 (about half as many lifters again and more of every other machine, fire eased in worlds 2, 3 and 5; 20-24 each): 100 / 83 / 70 / 40 / 25 %. 1.13.3 (skimmer flocks cut to about 40 %, more of every other machine, world 2 and 3 fire back up; 48 each): 100 / 85 / 56 / 44 / 31 %. |
| `replay_check.mjs [seeds=10]` | Instant replays are exact: plays until a death or a carrier kill, cuts the clip the game would keep, replays it and compares the world tick by tick. |
| `console_check.mjs [baseUrl] [seconds=20]` | Edge headless: the `?test=1` self-test page (8 checks), then the real page in real time (title, demo, an autopilot campaign, a carrier fight, endless) with frame times, shader programs (none may compile during play), no console errors and no score POSTs. Needs a static server: `python D:/Projects/.tmp/skyhold-work/serve.py 8862` serves the worktree without caching. |
| `online_check.mjs [base] [relay=ws://127.0.0.1:8781] [seconds=40] [lagMs=0] [wave=0] [world=1] [coop|rivals]` | Online co-op (or RIVALS, rooms `SH-R`/`SH-QR-`, per-pilot scores checked) in two real pages through a LOCAL relay (rooms `SH-`/`SH-Q-`): host and guest both flown by the demo autopilot; messages flowing, the guest's beams reaching the host, score / wave / lives in step, the guest's ship where it flies, the carrier the same on both screens (`wave=4`), leaving noticed. Relay: `D:/Projects/.tmp/arcade-trio-work/lancewing/relay`, `node <any wrangler>/bin/wrangler.js dev --local --port 8781` (npx's cache is broken on this machine), wait for 'Ready'. |
| `ship_check.mjs [runs=8] [world=3] [mast=0]` | The demo autopilot flies each gunship (WARDEN, BREAKER, ARC, HORNET) through a world; every ship must clear it at least half the time. `mast` gives every ship that GUNSHIP MASTERY level (0-2) so the perks can be weighed. Also counts HYPER, planet events, chain-lightning arcs, missile hits and Breaker shockwaves. |
| `nova_check.mjs [runs=12] [profile=demo] [sectors=1,2,3,4,5]` | How the autopilot spends its novas: clear rate, novas per run, machines per nova, novas into the special wave and the carrier, lifters carrying a settler destroyed, the demo's reason for each nova, deaths by novas in hand, where runs ended. 1.13.2 (the demo's NOVA PLAN; 48 runs each, old / new): clear 100 / 73 / 35 / 10 / 6 % -> 100 / 77 / 52 / 15 / 19 %, machines per nova 5.6-7.3 -> 6.9-9.7. |
| `ai_spacing_check.mjs [runs=6] [profile=demo]` | The autopilot keeps a firing band outside each carrier's hull (bumps per fight, share of the fight spent at the hull) and is never pinned under or over a machine at the ground or the ceiling during waves. |
| `playthrough_check.mjs [base] [fromWorld=4]` | AI PLAYTHROUGH in the real page, fast-forwarded: retries from checkpoints, buys upgrades, finishes with AI PLAYTHROUGH COMPLETE. |
| `chase_check.mjs [baseUrl]` | Edge headless, real time: the CHASE camera is on, RIGHT flies on the way the ship faces, holding LEFT turns about once and flies on, the camera swings to the new heading, C goes back to the side view. |
| `music_check.mjs [baseUrl]` | Edge headless, real time: a stage track starts with its drum and lead layers on the same sample and the same loop length, the layers are silent on a quiet start and come in for a carrier fight, DYNAMIC MUSIC OFF silences them. |
| `cabinet_check.mjs [baseUrl] [seconds=45]` | Edge headless, real time: the 18 cabinet sounds decode, an autopilot run sounds them through the one-channel board, the cabinet thrust loop follows the stick, CABINET SOUNDS OFF silences the layer. |
| `gen_layers.py`, `process_layers.py` | The music layers (see AUDIO.md, "Music layers"): ElevenLabs drum takes at each track's tempo, locked to the track's beat and cut to its loop, and a synthesised lead pulse on its root and fifth. |
| `gen_audio.py`, `process_audio.py`, `AUDIO.md` | The ElevenLabs sound set (see AUDIO.md). The key is read from the Windows user environment and never printed or written anywhere. |

Browser scripts take the shared Edge lock `D:/Projects/.tmp/arcade-trio-edge.lock` (other games' checks use it too).

Page hooks (`window.__sh`): `tick(n, dt = 1/60, draw = true)`, `startDemo()`, `startCampaign(s)`, `startEndless()`,
`startPlaythrough()`, `startAt(s, wave, ai = true)` (world s from wave 0-3, 4 = the carrier, with the demo autopilot),
`W` (the live world), `R` (renderer), `A` (audio). URL: `?fixed` (fixed 1/60 steps, drive it with `tick`), `?test=1`,
`?autoplay[&sector=N][&endless]`, `?playthrough`, `?seed=N`, `?wave=N`, `?q=high|medium|low`, `?noscores`.
Storage keys `sh.*`; boards `skyhold-2026[-easy|-hard|-nightmare]` and `skyhold-2026-endless[...]`.

Title screen: GUNSHIPS and THE ENEMY beside the card (main.js `syncHangar`). `R.portraits(kinds, livery)` draws each
gunship into a 320 x 180 picture (again only when the livery changes); `R.machinePictures(types)` and
`R.carrierPictures(keys)` draw the 12 machines and 5 carriers once, one a step after the title shows
(`__sh.enemyDrawn()` resolves when they are all in). Each model is lit in the main scene on a layer of its own that
every light joins, so it reuses the compiled shaders; only the small tone pass is new (one extra program at boot).

How it is drawn: the sim is a flat band (x along the equator, wraps every 1600 m; y altitude 0-36 m). `render.js`
wraps it round a sphere of radius C / 2pi, with the sun fixed in the world, so flying round goes from day to night.
`toW(x, y, out, z)` maps sim to world (z = arc length toward the camera's side). Carrier weak points and hulls in
`config.js` were measured from the models with `skyhold-work/nodes.mjs`; re-measure if a carrier model changes.
