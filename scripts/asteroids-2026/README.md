# Asteroids 2026 — tools

The game is plain ES modules in `games/2026-03-09/asteroids-hd/2026/` (three.js r181 vendored, no build step).
The edition picker lives at `games/2026-03-09/asteroids-hd/index.html`; the original Asteroids HD is preserved
in `classic/`. Bump `?v=N` on every local module import and on `js/main.js` in `2026/index.html` together when
you change code, so returning visitors never mix old and new modules.

- `gen_audio.py [music|sfx|voice|all] [--only a,b] [--force]` — renders the ElevenLabs music, effects, announcer
  and pilot lines (prompts live in this file). Reads `ELEVENLABS_API_KEY` from the Windows user environment;
  raw files go to `%TEMP%/a26-audio-raw` (or `A26_RAW`).
- `process_audio.py <.../asteroids-hd/2026>` — trims, normalises and encodes them into `audio/`, `voice/` and
  `music/` (needs ffmpeg). Cipher's lines get a metallic ring, the Maw's are pitched down.
- `node sim_matches.mjs [n] [maxSeconds]` — headless AI-vs-AI duels in every sector: pacing, damage mix, NaN check.
- `node replay_check.mjs` — instant replays must reproduce each knockout exactly (the sim is deterministic:
  all randomness comes from `W.rs`; nothing outside `step()` may change the world during a recorded match).

Test hooks in the page: `?autoplay` (an AI flies your ship), `?demo`, `?stage=5`, `?q=low|high|ultra`, `?fixed`
(no dynamic resolution), `?relay=ws://127.0.0.1:8787` and `?netlag=ms` for online tests, `?room=CODE` (invite).
`window.__a26.tick(dt, n)` steps the game when the tab can't animate; `__a26.startDemo()`,
`__a26.startCampaign('normal')`, `__a26.startVersus('p1', null)`, `__a26.online.*`, `__a26.NET.stat`.

Campaign extras (v1.1): ore from rocks/hits/round wins buys hangar upgrades between sectors (`UPGRADES` in
config.js; their effects live in `W.up` so replays stay exact), 15 sector medals (`MEDALS`, stored in localStorage
`a26.medals.v1`, awarded in main.js), visible ship damage (smoke/sparks/fire in render.js) and gamepad/phone
vibration (Options → Vibration). Test hooks: `__a26.hangarAuto()`, `__a26.award(id)`, `__a26.medals`.

Belt Run (v1.2): `makeWorld({ solo: true, wave, lives, pts, rocks, mega, rockK })` — one ship, spare ships and the
points live in the sim (`W.lives`, `W.pts`, extra ship every `LIFE_STEP`), so extra ships and the final death replay
exactly; waves end with a `waveclear` event, stragglers drift in (`W.drops`). Board `asteroids-2026-belt`.
`node belt_check.mjs` runs an AI through the waves. `?wave=N` starts Belt Run at wave N; `__a26.startBelt()`.
The renderer draws one of everything behind the boot screen (`R.warmUp()`) so no shader compiles mid-fight.

Online play shares the Steel Duel relay (`A26-` rooms, quick match `A26-Q-`); Steel Duel's room list hides them.
The host runs the belt and streams snapshots; the guest flies its own ship locally, sends its shots (the host
re-creates them by client id) and reports the hits it takes on its own screen.
