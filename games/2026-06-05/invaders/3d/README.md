# Invaders — 3D Edition (v3.1.0)

`invaders/` is a picker page; `classic/` is the original v2.2 game (unchanged rules, audio in `../audio/`)
and `3d/` is this edition.

## How it is built

- `game.js` started as the Classic Edition's game logic, sliced from `classic/index.html` (waves, bosses,
  daily seed, scoring), with hooks for the 3D stage: `stage.events.*` calls for shatter / debris / lights,
  `inv.hitFlash` / `boss.hitFlash`, a particle height (`h`, `vh`), stereo-panned sound calls, and pointer
  steering through the 3D camera.
- v3.1 adds, all in this edition only: Boss Rush (`invaders-3d-bossrush` board) and Practice (start at any
  wave reached; unscored); an upgrade pick after every warship (`PERKS`); wardens (frontal barrier that
  angled shots get round), phantoms (blink, aim, needle shot) and a bonus saucer; the fourth warship, the
  Hive (orbiting guard drones that regrow, spore spirals, launched minis); tension music (the battle loop
  speeds up and a heartbeat thumps as the fleet thins and drops); controller support (standard mapping,
  rumble); medals; a share card; a settings panel. It also fixes a dodged dive counting as the fleet
  landing (70 shield damage) — Classic still has that bug.
- `meta.js` holds the settings panel, medal list / storage (the picker page reads the same key), toasts and
  the share card.
- `stage.js` reads the game state every frame and draws it with three.js r181 (vendored in `vendor/three`):
  voxel models built from the original pixel sprites, instanced invaders / bunkers / debris, one additive
  effects batch for bullets, particles, rings and floor glows, a baked nebula cube, a ringed planet, bloom
  and a grade pass. The 2D canvas `#fx` carries the wave banner, labels, combo/overdrive bar and boss bars.
- The camera auto-fits the logical field (same dimensions as Classic) below the HUD and picks the lowest
  pitch (60–78°) that fills the screen. Quality steps down automatically when a run drops under ~48 fps;
  pin it with `?q=low|med|high` or the Graphics setting.
- Camera moments: a swoop to meet each arriving warship (escorts hold fire meanwhile) and a slow-motion
  close-up on a warship kill and on the last kill of a wave (shots in flight fizzle, the ship can't be hit
  during it). Pointer steering and HUD layout use the plain gameplay pose (`rayCam`), never the cinematic.
- Sectors: every fourth wave (each Boss Rush warship) the nebula is re-baked into a second cube map, one
  face per frame, then crossfaded; planet, rings and sky light blend to the new palette (`SECTORS`).

## Audio

New ElevenLabs set in `audio/` (40 effects + menu / game / boss music; v3.1 added heartbeat, saucer hum
loop, saucer down, upgrade offer / pick, medal, split, deflect, blink, snipe, slow-mo, swoop, sector warp,
shutter). Regenerate with
`node tools/gen-audio.mjs <rawDir>` (needs `ELEVENLABS_API_KEY`) and
`node tools/process-audio.mjs <rawDir> audio` (ffmpeg: trims, normalises, makes seamless loops).
Music plays through Web Audio with loop points trimmed past MP3 padding.

## Scores

Global boards `invaders-3d`, `invaders-3d-bossrush` and `invaders-3d-daily-YYYYMMDD` (Classic keeps
`neon-invaders`). Local keys `invaders3d_*` (scores, settings, medals, best wave); initials and mute are
shared with Classic.

## Testing hooks

`window.__invadersQA` as in Classic (`startRun`, `forceBossWave`, `fireBomb`, `snapshot`, …) plus
`__invadersQA.stage.info()` (quality, dpr, draw calls, triangles, fps). `F` or `?perf` shows the perf meter.
v3.1 hooks: `startMode(mode, wave)`, `forceWave(n)`, `openPerks()` / `pickPerk(i)`, `spawnSaucer()` /
`shootSaucer()`, `wardenTest()`, `phantomState()`, `hiveState()`, `killBoss()`, `tension()`, `medals()`,
`shareCard()`, `endRun()`, `pad()`.

## Releasing

`.js` gets a 4-hour browser cache from the zone, so bump `?v=` on `game.js` (index.html) and on the
`stage.js` / `meta.js` imports (game.js) with every change.
