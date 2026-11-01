# Subway Siege: Ironline v3.0.1

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
- `src/audio.js`: six **ElevenLabs SFX v3** effects, explicitly requested with
  `model_id: eleven_text_to_sound_v3`. Prompt manifest lives beside the MP3s.
  Existing original soundtrack is reused; it is not presented as newly generated.
  No API credentials are shipped. All effects are pre-generated static files.
- All visual assets are procedural geometry / canvas textures, not generated images.
- Explosions launch cached hull-outline edges as tumbling 3D vector fragments,
  with bright cores, colored glow and velocity trails. Three instanced layers
  share a 480-fragment cap; low quality retains the effect at a smaller count.
- Pickups are rotating shield crests, energy cells and weapon-specific miniature
  models. Their cached billboard labels name the actual weapon or supply amount,
  stay screen-readable on phones, and do not rotate with the item.

## Rules / balancing

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
