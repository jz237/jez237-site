# Gold Digger — scripts

Game: `games/2026-11-07/gold-digger/` (three.js, plain ES modules, every local import `?v=N`, bumped together).

| script | what it does |
| --- | --- |
| `_game.mjs` | loads the game's modules in Node at the page's `?v=` (shared instances) + `playLevel()` helper |
| `ramp_check.mjs [trials] [diff] [depths]` | human-like autopilot (0.35 s reactions) plays each depth L1→guardian with typical gear; clear % per depth vs the 95/80/60/40/25 target, where runs end, hits per level, causes of death |
| `replay_check.mjs [runs]` | records autopilot runs, replays clips around deaths/random ticks, compares the world exactly |
| `autopilot_check.mjs [minutes]` | demo autopilot plays the whole campaign like AI PLAYTHROUGH (store buys, retries) |
| `console_check.mjs [baseUrl]` | headless Edge: `?test=1` self-test, frames of every depth/guardian, phone layouts, demo, playthrough→store→depth 2, game over initials, shader programs flat, no console errors, no score POSTs (`ONLY=test,frames,demo,playthrough,title`) |
| `gen_audio.py` / `process_audio.py` | ElevenLabs SFX/music/voice → `audio/`, `music/`, `voice/` (key read from the Windows user env, never printed) |

Serve the repo root without caching (the browser otherwise keeps old `?v=` modules), e.g. a tiny no-store `http.server`
on port 8795, then `node scripts/gold-digger/console_check.mjs`.

Test hooks: `window.__gd` (`tick(n, dt, draw)`, `startCampaign(depth, {level, auto, seed})`, `W`, `G`, `R`).
`?fixed` stops the real-time loop (drive it with `tick`), `?noscores`/`?test`/`?fixed`/webdriver never post scores.
