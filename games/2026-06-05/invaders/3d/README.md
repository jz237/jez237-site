# Invaders — 3D Edition (v3.0.0)

`invaders/` is a picker page; `classic/` is the original v2.2 game (unchanged rules, audio in `../audio/`)
and `3d/` is this edition.

## How it is built

- `game.js` is the Classic Edition's game logic, sliced from `classic/index.html` and kept rule-for-rule
  identical (waves, bosses, daily seed, scoring). Only hooks were added: `stage.events.*` calls for
  shatter / debris / lights, `inv.hitFlash` / `boss.hitFlash`, a particle height (`h`, `vh`), stereo-panned
  sound calls, and pointer steering through the 3D camera.
- `stage.js` reads the game state every frame and draws it with three.js r181 (vendored in `vendor/three`):
  voxel models built from the original pixel sprites, instanced invaders / bunkers / debris, one additive
  effects batch for bullets, particles, rings and floor glows, a baked nebula cube, a ringed planet, bloom
  and a grade pass. The 2D canvas `#fx` carries the wave banner, labels, combo/overdrive bar and boss bars.
- The camera auto-fits the logical field (same dimensions as Classic) below the HUD and picks the lowest
  pitch (60–78°) that fills the screen. Quality steps down automatically when a run drops under ~48 fps;
  pin it with `?q=low|med|high`.

## Audio

New ElevenLabs set in `audio/` (26 effects + menu / game / boss music). Regenerate with
`node tools/gen-audio.mjs <rawDir>` (needs `ELEVENLABS_API_KEY`) and
`node tools/process-audio.mjs <rawDir> audio` (ffmpeg: trims, normalises, makes seamless loops).
Music plays through Web Audio with loop points trimmed past MP3 padding.

## Scores

Global boards `invaders-3d` and `invaders-3d-daily-YYYYMMDD` (Classic keeps `neon-invaders`).
Local keys `invaders3d_*`; initials and mute are shared with Classic.

## Testing hooks

`window.__invadersQA` as in Classic (`startRun`, `forceBossWave`, `fireBomb`, `snapshot`, …) plus
`__invadersQA.stage.info()` (quality, dpr, draw calls, triangles, fps). `F` or `?perf` shows the perf meter.

## Releasing

`.js` gets a 4-hour browser cache from the zone, so bump `?v=` on `game.js` (index.html) and on the
`stage.js` import (game.js) with every change.
