# Plasma Pong: Battle Edition — tools

The game itself is plain ES modules in `games/2026-03-10/plasma-pong/battle/` (no build step).
Bump `?v=N` on every local module import and on `js/main.js` in `battle/index.html` when you
change code, so returning visitors never mix old and new modules.

- `gen_audio.py [music|sfx|voice|all] [--only a,b] [--force]` — renders the ElevenLabs music,
  effects, announcer and pilot lines (prompts live in this file). Reads `ELEVENLABS_API_KEY`
  from the Windows user environment; raw files go to `%TEMP%/ppb-audio-raw` (or `PPB_RAW`).
- `process_audio.py <battle-dir>` — trims, normalises and encodes them into `audio/`, `voice/`
  and `music/` (needs ffmpeg).
- `node sim_matches.mjs [n]` — headless AI-vs-AI matches across every arena: pacing, rallies,
  event mix, NaN check.
- `node director_forecast.mjs` — how well the demo director predicts unstoppable core breaches.

Test hooks in the page: `?autoplay` (an AI plays your paddle), `?demo`, `?stage=5`, `?q=low|high|ultra`,
`?fixed` (no dynamic resolution); `window.__ppb.tick(dt, n)` steps the game when the tab can't
animate, `__ppb.startDemo()`, `__ppb.startCampaign('normal')`, `__ppb.startVersus()`.
