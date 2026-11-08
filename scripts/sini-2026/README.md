# Sini 2026 tools

Game: `games/2026-11-07/sini-2026/` (three.js r181 vendored, plain ES modules, no build).
Every local import carries the same `?v=N`; bump them all together (plus `js/main.js?v=` in index.html and `V` in js/audio.js).

| Script | What it does |
| --- | --- |
| `ramp_check.mjs [trials] [sectors] [profile] [difficulty] [cp]` | Human-like autopilot (ai.js `human`: ~0.35 s reaction with scatter, sometimes late, slower to notice threats while busy or off to the side, sometimes dodges the wrong way first, often blind behind) plays each sector from its launch with 3 ships and `TYPICAL_UP`; prints clear rate, ships lost per checkpoint, hits per minute (the "edge"), wake / fight / clear times, gatherer vs self-built plates, rack at wake and causes. `RP='{"3":{"fire":[0.4,0.44]}}'` patches RAMP rows for what-if runs. Run sectors in parallel: `for s in 1 2 3 4 5; do node scripts/sini-2026/ramp_check.mjs 60 $s & done; wait` |
| `replay_check.mjs [seeds]` | Records autopilot runs and re-runs every ship lost and every construct kill from its clip; must match bit for bit. |
| `autopilot_check.mjs [runs]` | Chained campaigns (score and ships carry over, continues from the last checkpoint) for the demo and human profiles. |
| `online_check.mjs [relay] [seconds] [lags]` | Host + guest in Node with the game's own online.js over a LOCAL relay (copy of the Steel Duel worker: `npx wrangler dev --local --port 8781`, wait for "Ready"; afterwards kill the wrangler node process tree, or workerd respawns). |
| `console_check.mjs [baseUrl]` | Playwright + Edge: the `?test=1` self-test page, the attract demo, an autoplay campaign and the AI playthrough rolling from the S1 AWAKE checkpoint into S2; fails on console errors or score POSTs. Needs a static server on the repo root (default port 8843). |
| `gen_audio.py`, `process_audio.py` | ElevenLabs generation and processing (see AUDIO.md). The key is read from the Windows user env, never printed. |

Difficulty lives in one table: `RAMP` in `js/config.js` (per sector, `[launch, awake]` pairs stepped by checkpoint).
Deep Field walks the same curve via `deepLevel()` / `rampLevel()`.

Final ramp (v1.1.1, 60 runs per sector, Normal): clears 100 / 100 / 60 / 47 / 25 %, hits per minute 0.05 / 0.23 / 1.87 / 1.92 / 2.57 (v1.1.0 was 100/100/85/57/25, v1.0.0 100/97/67/48/22). Sector 2 stays at 100 % for the bot: combined threats only start in sector 3, and the bot dodges every bolt with a warning of 1.3 s or more. Sector 4 is very sensitive to `openT`: 2.9 s gave ~55 %, 2.8 s ~35-47 %, 2.7 s ~33 %. Since 1.1 most of the danger is in the construct fight (core open/shut cycle `openT`/`shutT`, `bossV`, `pull`, `kill`).
Findings: the clear rate is a step function of the reaver warning time for the bot (with a 1.3 s+ tell it dodges nearly everything), so the
early-sector levers are the 2-bolt volley (`burst`), shield charges per checkpoint and reaver toughness (`rHP`); a free shield on every
respawn made sectors with any shield trivially safe, so respawn shields are sector 1 only.
