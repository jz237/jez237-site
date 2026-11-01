# Subway Siege: Ironline v3.2.0

Three.js 0.184 / Vite 8. A separate 3D edition of the original Subway Siege,
commissioned by Jez on 2026-11-01. No external runtime CDN or generative API calls.

## Build

```sh
cd scripts/subway-siege
npm ci --ignore-scripts
npm run build
```

Output: `games/2026-05-30/subway-siege/ironline/`. The build deliberately empties
**only that subdirectory**. The root edition chooser, `classic/`, shared `music/`,
original `sfx/`, and `audio-ironline-v3/` are not build outputs. Do not delete them.
Serve the repository root, not the source directory, to test the built game.

## Ownership and structure

- `src/world.js`: perspective camera, PBR scene, room IBL, real shadows, instanced
  rails/projectiles, batched scenery, bloom, GPU particles, five sector palettes,
  themed machinery/water, cached ship/enemy/boss/pickup templates.
- `src/game.js`: 60 Hz rules, input, finite wave director, enemies, bosses,
  express warnings, combat, pickups, modules, pause and unranked demonstration.
- `src/main.js` / `style.css`: responsive menus, HUD, callsign entry, settings.
- `src/scores.js`: local top ten and existing global worker. Board slug
  **`subway-siege-ironline`**; send `initials`, integer `score`, `wave`, `level`.
  Classic retains **`subway-siege`** and its original localStorage keys.
- `src/fx/lightfield.js`: the **light field**. Every bolt, engine, muzzle flash,
  blast, train headlight, warning lane, third-rail arc and platform strip is
  splatted each frame into a top-down HalfFloat irradiance map (one instanced
  draw). All MeshStandard/Physical materials sample it via a prototype
  `onBeforeCompile` hook, so hundreds of moving lights cost one small pass.
  The same map drives the volumetric haze layers and the floating dust.
- `src/fx/streaks.js`: one instanced batch of camera-facing capsules for player
  bolts (white-hot core + halo), enemy plasma orbs, velocity-streaked sparks,
  flares and arc segments.
- `src/fx/smoke.js`: fireball puffs that cool through a blackbody ramp into
  smoke lit by the light field, plus burn marks with cooling embers. Both live
  in the tunnel frame (they scroll past).
- `src/fx/post.js`: final HDR grade before ACES: shockwave refraction (8
  analytic waves), impact chromatic split, exposure flash, slow-motion
  desaturation, damage bleed, per-sector grade, vignette and grain.
- Wet track bed (in `world.js`): moving puddles, darker/glossier, reflecting a
  mirrored render of FX layer 1 (bolts, flames, fireballs, sparks, shield).
- Tiers (`TIERS` in `world.js`): ultra / high / low. Auto picks ultra on
  desktop-class screens, high on phones, and steps down on sustained low fps.
- `src/audio.js`: spatial mix. Voices are panned across the tunnel, quieter,
  duller and wetter up the line, with a short speed-of-sound delay; a synthetic
  per-sector tunnel reverb (flutter echoes, darkening tail, foundry metal
  rings) crossfades between sectors; music runs through WebAudio so it ducks
  under big blasts and muffles on hull hits and during the rail-pulse slow
  motion; sector ambience loops; synthesised sub-bass under explosions, drone
  engine hum, tinnitus, low-hull heartbeat, train doppler.
  Effects: **40 ElevenLabs SFX v3** clips in `audio-ironline-v4/` (8 per-weapon
  shots, impacts, 4 explosion sizes + boss chain, shield/hull, pickups, train,
  boss, stingers, 5 ambience loops; prompts in its `manifest.json`), plus the
  six v3 clips still used for pulse, train pass and boss arrival. Loudness is
  normalised to about -16 LUFS (loops -24). Existing original soundtrack is
  reused; it is not presented as newly generated. No API credentials are
  shipped. All effects are pre-generated static files.
- All visual assets are procedural geometry / canvas textures, not generated images.
- Explosions launch cached hull-outline edges as tumbling 3D vector fragments,
  with bright cores, colored glow and velocity trails. Three instanced layers
  share a 480-fragment cap; low quality retains the effect at a smaller count.
  `world.explode()` adds the fireball, smoke, sparks, light flash, light ring,
  shockwave, burn mark and camera trauma. Bosses die in a 1.6 s chain of
  internal blasts while the hull shudders, then one final detonation.
- Pickups are rotating shield crests, energy cells and weapon-specific miniature
  models. Their cached billboard labels name the actual weapon or supply amount,
  stay screen-readable on phones, and do not rotate with the item.

## Rules / balancing

v3.2: every temporary weapon bolts its own kit onto the drone (`weaponKit()` in
`world.js`; lance coils, plasma ring, tri turret, heavy pods with recoil,
overheat gatling with heat vents, nova fan, twin saw blades) with an elastic
morph-in, spark spiral and `transform` sound, and retracts when it expires.
Escort drones (module or rare `drone` pickup; bosses drop one until the ring
is full) fly in formation up to three; the fourth locks all of them into a
spinning halo (max six) that swats hostile shots it touches. Enemy fire uses a
budget: base intervals are about 30% longer, live hostile shots are capped at
12 + wave (max 34) and volleys are staggered 0.16 s apart, which halves the
worst-case shot density measured with the player not firing.

Three drones; eight temporary weapons; seven normal enemy behaviours; three
boss archetypes with health-driven phases; a boss every fourth wave; permanent
module choice every second wave. The 20-wave/five-sector route loops with
increasing pressure. There is no campaign-end screen. Normal waves spawn a fixed
quota and finish only after all spawned threats, trains and warnings resolve.

Destroyed enemies earn bounties; contact/escaped enemies and offscreen trains do
not. Time score is accumulated fractionally, not truncated each frame. Shield and
hull damage share an invulnerability window. Player/enemy collision uses relative
swept segments; rail shots cannot tunnel and piercing rounds cannot repeatedly hit
one target. Hit candidates are processed nearest first. Boss death clears support
threats without awarding their bounties, preventing a stranded boss wave.

Auto-fire defaults ON and is an obvious HUD toggle. Hold mode supports Space/J,
held pointer, A/RT. Move with WASD/arrows, relative touch/mouse drag, or stick;
X/RMB/B uses pulse. P/Escape/Start pauses. Blur/hidden tab releases controls and
pauses. Demo is explicitly unranked and never opens score entry. Score posting is
explicit, guarded against double-clicks, and reports remote failure truthfully.

## Verification

`?qa=1` exposes a bounded `window.__ironline` test harness, absent by default.
The built-in preview pane is often hidden, which stalls requestAnimationFrame:
step frames yourself (`game.update(1/60); world.update(1/60, game)`) and read
the canvas with `toDataURL` straight after a `world.update`. Offline audio
checks: swap `window.AudioContext` for an `OfflineAudioContext`, build a new
`Sound`, trigger events from `ctx.suspend(t)` callbacks and render.
Tests must intercept **all score POSTs**: never pollute real boards with test rows.
Browser QA receipts/screenshots are retained in GameMaster's
`artifacts/subway-siege-20261101/`. Validate desktop and 390/375 px touch layouts,
all weapons, wave/boss progression, escapes, piercing, shield cooldown, pause,
train warning timing, save-once, offline save, and Classic's shared audio paths.
Use a real GPU for a performance measurement; software SwiftShader is not a
hardware benchmark. Auto quality disables expensive effects after sustained low
frame rate; explicit High/Low choices are retained. Low still uses real 3D.

## Publication

Preserve the root game card path: it opens the edition chooser. The source of truth
is `jz237/jez237-site` current remote main, **not** a stale `jz237/games` mirror.
Follow repository root AGENTS.md and the guarded whole-site release wrapper;
sparse editing checkouts must never be deployed as whole sites.
