# Iron Ridge — 3D Tank Combat

Open-field daytime tank combat in the browser. Drive a tank with real
rigid-body physics across rolling forested terrain, shell targets and
explosive barrels, then survive waves of AI tanks that hunt, keep range,
check line-of-sight, and lead their shots.

**Play it:** https://jez237.com/games/2026-06-10/iron-ridge/

## Controls

| Desktop | Mobile |
|---|---|
| WASD / arrows — drive | floating stick (touch left side) — push where you want to go, pull back to reverse |
| mouse — aim turret | drag right side — aim |
| click / space — fire | FIRE button |
| R — restock the ready rack | |
| F — call airstrike (earned via kill streaks) | ✈ button |
| scroll — camera zoom | |
| Esc — pause · M — mute | PAUSE button |

## What's real

- **Physics:** cannon-es world. The tank is a rigid body with four
  spring/damper suspension corners, drive and lateral-grip track forces,
  momentum, recoil impulses, and collisions (you can flip the tank by
  ramming a boulder at speed — it self-rights after a moment). Shells fly
  on true gravity arcs with exact low-arc ballistic zeroing; explosions
  push real impulses into barrels, wall blocks, falling trees, and tanks.
  Yaw is rate-commanded the way tracked vehicles effectively steer.
- **AI:** three enemy tank classes (fast scouts, standard, heavy
  breakthrough tanks) that seek, orbit at preferred range, raycast
  line-of-sight, lead the player's motion, and un-stick themselves —
  plus static pillbox gun emplacements, and artillery barrages with
  red warning rings from wave 5.
- **Pacing:** enemy armor appears from wave 1 and is the only thing
  gating wave progress — target boards are optional bonus objectives.
  If the field ever goes quiet, scout patrols roll in; new contacts are
  announced with compass bearings and minimap pings. Kill streaks earn
  a one-shot airstrike called on your reticle, and unarmed supply
  convoys periodically cross the map for bonus points.
- **Tactics:** a live minimap (terrain underlay, enemy/target/barrel/
  pillbox/convoy blips, view cone, edge chevrons for off-map threats)
  and armor-repair supply drops from tank kills.
- **Scoring:** global top-10 via the site's shared Cloudflare Worker
  (`/scores/iron-ridge` namespace), with localStorage fallback offline.
- **Online rooms:** optional public multiplayer rooms relay live player
  pose, names, cannon fire, and lobby presence through the
  `iron-ridge-online` Cloudflare Worker. Quick Match finds a waiting
  room or creates one, room-code links can be shared from desktop or
  mobile, and the browser heartbeat keeps lobbies fresh while players
  wait.

## Art and rendering

Nearby trees have tapered bark trunks, connected branches, and individual
leaf/needle sprays using the existing assets from First Light
(`games/2026-09-13/first-light/assets/trees/{leaf,needle}.webp`). Distant
woodland retains the Stunt Car Racer atlas and six/eight-triangle impostors.
The detail pool is capped at 8 / 16 / 28 / 40 trees on Low / Medium / High /
Ultra, using the existing spatial hash. Tree positions and collisions are
unchanged. Destroyed trees retain their selected model, tint and lighting;
their individual materials are released after the fall.

Ground has soil/gravel and forest-litter blends, smaller-scale grass, and
nearby packed normal/height relief. Medium and above blend a rotated grass
sample to reduce repetition. Low keeps the original three terrain samples.
No extra terrain subdivisions or postprocessing passes are needed.

Tank paint includes baked weld beads, chips, cast-metal grain, dust and
runoff. Rigid parts sharing a material are merged within their animation
pivot; wheels, suspension, turret, recoil and effects anchors stay independent.

Chevron tread marks follow the ground, persist, and fade between 45 and 65
seconds. They reuse the original 360-instance ring buffer (oldest marks are
recycled sooner during continuous driving). Warm sunlight, softer sky fill,
and three haze-graded ridge meshes provide depth without extra lighting passes.
The new maps are generated once or reused from existing site assets; no paid
assets or new CDN dependencies were added.

## Performance

The existing automatic quality scaler continues to control resolution,
shadows, bloom, foliage, fog and particles. No shadow-map, render-resolution,
or postprocessing-pass increases. Detailed foliage adds geometry near the
camera; rigid tank batching offsets rendering overhead, especially in combat.

September 15, 2026 comparison against the preceding woodland release, Edge /
ANGLE D3D11 on RTX 5090, locked 1920 x 1080 drawing buffer. Each scenario starts
in a fresh browser with fixed camera, controlled opponents, and disabled
vsync/frame caps. GPU timing uses disjoint-checked hardware timer queries;
CPU timing covers a simulation/render frame. These are frame-work timings,
not an FPS claim for slower devices.

| High quality scenario | CPU median before → after | GPU median before → after | Draw calls before → after |
|---|---|---|---|
| Ground / tank | 0.90 → 0.80 ms | 0.53 → 0.32 ms | 346 → 217 |
| Dense forest, 28 nearby models | 0.70 → 0.60 ms | 0.31 → 0.33 ms | 112 → 105 |
| Eight additional tanks + repeated explosions | 4.00 → 2.40 ms | 2.47 → 1.27 ms | 2,254 → 926 |

Combat CPU 95th percentile: 4.5 → 2.9 ms; GPU: 4.94 → 2.60 ms.
Dense forest geometry increases from 303,906 to 396,402 triangles including
shadow and post passes, with essentially flat CPU timing. A longer Low ground
run (600 frames / 300 GPU queries) measured CPU median 0.80 → 0.70 ms and GPU
median 0.26 → 0.29 ms; GPU 95th percentile 2.32 → 2.35 ms. GPU outliers vary
with driver scheduling, so small deltas should not be treated as precise gains.
A separate 600-frame combat run with 4x CPU throttling reduced CPU median
23.8 → 14.5 ms and 95th percentile 26.4 → 15.8 ms. This exercises CPU
headroom; it does not represent a particular device.
Actual slower GPUs/phones still need device testing; CPU throttling and mobile
viewport emulation do not emulate a slower GPU.

Validation covers all quality caps, replacement/restoration without doubled
or resurrected trees, fallen-material cleanup, ground-conforming tread pool
wrap/fading, and wheel/turret/recoil/exhaust attachments. Batching preserves all
10,968 non-instanced tank triangle vertices within 0.00000012 world units.

Development smoke test: serve this folder, install/use Playwright with Edge,
then run `node tests/graphics-smoke.cjs` with `IRON_RIDGE_URL` set to the served
game URL (default `http://127.0.0.1:8080/`). `PLAYWRIGHT_MODULE` can point to an
existing Playwright installation. Screenshots and the JSON report are written
to the current directory.

## Tech

- [Three.js](https://threejs.org/) 0.180 + UnrealBloom post pass — vendored in `vendor/`
- [cannon-es](https://github.com/pmndrs/cannon-es) 0.20 — vendored
- Plain ES modules + an import map. **No build step, no CDN, no network
  dependency except the score API.** Serve the folder statically
  (`python -m http.server`) and it runs.
- One workaround worth knowing: cannon-es `Ray` vs `Heightfield` misses
  ~8% of casts, so every closest-hit raycast merges an exact analytic
  terrain intersection (`terrain.js: raycastTerrain`).

Audio: cannon shots and shell explosions use recorded samples
(`assets/audio/*.mp3`, randomly selected with pitch jitter and
distance-scaled volume). Everything else — engine drone that follows
throttle, ambient wind, reload clicks, artillery whistle, shell
whiz-bys — is synthesized with the Web Audio API, and synth versions of
the shot/explosion sounds remain as fallback while samples load.
