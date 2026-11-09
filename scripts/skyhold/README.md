# Skyhold 2026 scripts

The game lives in `games/2026-11-09/skyhold/` (plain ES modules, three.js vendored, every local import `?v=1`; bump them
all together, plus the `modulepreload` list in `index.html` and the scripts' imports here). The design brief is in the
work folder `D:/Projects/.tmp/skyhold-work/DESIGN.md`.

| Script | What it checks |
| --- | --- |
| `ramp_check.mjs [runs=30] [sectors=1,2,3,4,5] [profile=human] [diff=normal]` | The human-like autopilot (`ai.js` profile `human`: ~0.36 s reactions, wobbly aim, sometimes late) plays each world from its first wave with the typical upgrades for it. Prints the clear rate, deaths and hits per run and per wave, settlers lost, carrier fight length and causes of death. Targets on Normal: about 95 / 80 / 60 / 40 / 25 %. Last run (60 each): 100 / 82 / 68 / 45 / 25 %. |
| `replay_check.mjs [seeds=10]` | Instant replays are exact: plays until a death or a carrier kill, cuts the clip the game would keep, replays it and compares the world tick by tick. |
| `console_check.mjs [baseUrl] [seconds=20]` | Edge headless: the `?test=1` self-test page (7 checks), then the real page in real time (title, demo, an autopilot campaign, a carrier fight, endless) with frame times, shader programs (none may compile during play), no console errors and no score POSTs. Needs a static server: `python D:/Projects/.tmp/skyhold-work/serve.py 8862` serves the worktree without caching. |
| `gen_audio.py`, `process_audio.py`, `AUDIO.md` | The ElevenLabs sound set (see AUDIO.md). The key is read from the Windows user environment and never printed or written anywhere. |

Browser scripts take the shared Edge lock `D:/Projects/.tmp/arcade-trio-edge.lock` (other games' checks use it too).

Page hooks (`window.__sh`): `tick(n, dt = 1/60, draw = true)`, `startDemo()`, `startCampaign(s)`, `startEndless()`,
`startPlaythrough()`, `startAt(s, wave, ai = true)` (world s from wave 0-3, 4 = the carrier, with the demo autopilot),
`W` (the live world), `R` (renderer), `A` (audio). URL: `?fixed` (fixed 1/60 steps, drive it with `tick`), `?test=1`,
`?autoplay[&sector=N][&endless]`, `?playthrough`, `?seed=N`, `?wave=N`, `?q=high|medium|low`, `?noscores`.
Storage keys `sh.*`; boards `skyhold-2026[-easy|-hard|-nightmare]` and `skyhold-2026-endless[...]`.

How it is drawn: the sim is a flat band (x along the equator, wraps every 1600 m; y altitude 0-36 m). `render.js`
wraps it round a sphere of radius C / 2pi, with the sun fixed in the world, so flying round goes from day to night.
`toW(x, y, out, z)` maps sim to world (z = arc length toward the camera's side). Carrier weak points and hulls in
`config.js` were measured from the models with `skyhold-work/nodes.mjs`; re-measure if a carrier model changes.
