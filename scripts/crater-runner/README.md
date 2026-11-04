# Crater Runner tools

Game: `games/2026-11-04/crater-runner/` (three.js r181 vendored, plain ES modules, no build).
Every local import carries the same `?v=N`; bump them all together (plus `js/main.js?v=` in index.html).

| Script | What it does |
| --- | --- |
| `ramp_check.mjs [trials] [sectors] [profile]` | Human-like autopilot (0.35 s reaction, timing scatter, sometimes late or early, the odd missed threat or short hold) drives each sector from its start with 3 lives and the typical upgrades (`TYPICAL_UP`); prints clear rate and deaths per try for every checkpoint segment. Run sectors in parallel: `for s in 1 2 3 4 5; do node scripts/crater-runner/ramp_check.mjs 100 $s & done; wait` |
| `replay_check.mjs [seeds]` | Records autopilot runs and re-runs every crash and boss kill from its saved clip; the world must match bit for bit. |
| `autopilot_check.mjs [runs]` | Chained campaigns (lives carry over, salvage buys upgrades) for the demo and human profiles; shows how far each gets. |
| `console_check.mjs [baseUrl]` | Playwright + Edge: runs the `?test=1` self-test page, the attract demo and an autoplay campaign; fails on console errors or score POSTs. Needs a static server on the repo root. |
| `gen_audio.py [music\|sfx\|voice\|all] [--only a,b]` | ElevenLabs generation (key read from the Windows user env, never printed). |
| `process_audio.py <game folder> [names]` | Trim / normalise / encode; loop clips get a crossfaded seam. Run with plain `python` (needs numpy). |

Difficulty lives in one table: `RAMP` in `js/config.js` (per sector, `[first checkpoint, last checkpoint]`,
interpolated per checkpoint). Long Haul walks the same curve via `longHaulLevel()`.

Page hooks: `?autoplay` (demo autopilot plays), `?sector=N`, `?cp=N` (start segment; = number of letters for the boss),
`?seed=N`, `?fixed` (no RAF; drive frames with `__cr.tick(n)`), `?test=1`, `?demo` (attract demo after 1 s),
`?relay=ws://127.0.0.1:8787` (local relay), `?netlag=ms`, `?room=CODE`, `?noscores`.
