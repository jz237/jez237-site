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

Nearby trees have bark trunks, branches and individual leaf/needle sprays
from First Light. Distant trees use the Stunt Car Racer atlas. Each quality
level selects at most 8 / 16 / 28 / 40 detailed trees. A 0.45-second opaque
dither transition trades pixels between the two representations; it also
applies to their shadows. Three metres of selection hysteresis prevents
boundary flicker. The bounded incoming/outgoing pool never exceeds twice the
selected tier's limit. Once a transition finishes, the unused model stops
rendering. Destroyed trees retain their appearance and release cloned materials.

Ground has broad soil and stone patches, forest litter, and winding worn paths
from a packed landscape mask. The mask replaces the second grass sample:
High/Medium use five terrain samples, Low uses four and skips micro relief.
Existing terrain geometry and physics heights are unchanged.

Armor, rubber and bare metal use different surface grain and roughness. Normal
and roughness data share one small texture lookup; Low skips that lookup.
Paint retains baked chips, welds, dust and runoff. Static parts are batched,
and the ten road wheels and hubs render as two instanced draws while keeping
individual suspension and rotation. Dedicated wheel material objects prevent
repeated switching between instanced and ordinary shader configurations.

Smoke has four irregular, shaded silhouettes, rotation and a real opacity
fade while expanding. Trail dust emits from both tracks and drifts behind
forward/reverse travel. Particle pools stay at their original capacity; screen
size is capped by quality to limit close-range overdraw. Tread marks retain
the bounded 360-instance pool and fade between 45 and 65 seconds.

Soft contact shadows sit under nearby tanks, tree trunks and rocks in one
instanced draw, capped at 16 / 32 / 64 / 80 marks by quality. Static transforms
are cached. This adds no full-screen ambient-occlusion or depth-capture pass.

Distant mountains have shaped foothills, crests and gullies with baked sunlight,
forested slope detail reused from First Light's `assets/sky/ridge.webp`, and
bases that blend into the scene's haze. The ridge4 visibility adjustment
uses deeper forest/blue-grey ridge colors, stronger slope contrast and a lower
mountain haze band. Neutral green-grey valley fog starts later and fades over
a longer distance, preserving distant forest and ground detail. All three layers share one texture,
resampled to 1024 x 350 at load time to save about 5.5 MiB of GPU memory.
No paid assets, additional CDN dependencies, shadow-map resolution increases
or postprocessing passes were added.

## Performance

The automatic quality scaler still controls resolution, shadows, bloom,
foliage, fog and particles. This release adds no postprocessing passes or
shadow-map/resolution increases. Wheel instancing offsets the new visual work.

September 15, 2026 comparison against detail2 (`bed4c3320a5ab516ea7085c86e8db559dccb3578`),
Edge / ANGLE D3D11 on RTX 5090, locked 1920 x 1080 drawing buffer. Each case
starts in a fresh browser with seeded scenery, controlled opponents and
disabled vsync/frame caps: 120 warmup frames, 600 measured frames and 300
disjoint-checked GPU timer queries. CPU timing covers simulation and rendering.
These measure frame work, not FPS on typical PCs.

| High quality scenario | CPU median before → after | GPU median before → after | Draw calls before → after |
|---|---|---|---|
| Ground / tank | 0.70 → 0.70 ms | 0.325 → 0.344 ms | 207 → 172 |
| Dense forest, 28 selected trees | 0.50 → 0.50 ms | 0.319 → 0.334 ms | 99 → 104 |
| Eight additional tanks + repeated explosions | 2.30 → 2.10 ms | 1.139 → 0.542 ms | 919 → 596 |
| Moving through forest | 0.60 → 0.60 ms | 0.334 → 0.370 ms | 132 → 121 |

High combat CPU 95th percentile improves from 2.5 to 2.3 ms; GPU from 3.27
to 2.71 ms. Moving-forest CPU 95th percentile stays at 0.8 ms, with GPU
2.49 → 2.56 ms. Low combat CPU median improves from 2.3 to 2.1 ms and GPU
0.851 → 0.784 ms. The other Low cases add 0.010–0.022 ms median GPU work;
forest CPU medians increase from 0.5 to 0.6 ms. GPU scheduling creates
outliers, so small differences and the large High combat GPU gain should
not be assumed to reproduce on every device.

A separate High combat run with 4x CPU throttling reduces CPU median from
14.5 to 13.4 ms and 95th percentile from 16.7 to 14.9 ms. This tests CPU
headroom; it does not emulate a weaker GPU. Actual slower PCs and phones
still need device testing. Portrait/touch emulation checks layout and play.

The final combat frame's summed particle screen-square area falls by 10.2%
on High and 11.7% on Low. This is a transparent-overdraw proxy before alpha
discard, not an exact shaded-pixel counter. Estimated incremental texture
storage is about 3.72 MiB including mipmaps and the injected landscape mask;
no render targets are added. Raw renderer counts, material-visible texture
estimates, timings and caveats are stored in `tests/graphics-performance.json`.

Validation covers all quality caps, complementary GPU dither coverage,
bounded/released transition residents, fallen-material cleanup, contact-shadow
alignment, smoke opacity/expansion, ground-conforming tread wrap/fading,
and wheel/turret/recoil/exhaust attachments. Rigid batching preserves 10,968
vertices within 0.00000012 world units; all 20 wheel/hub instance transforms
match their animation references within 0.00000006. Desktop driving/firing
and portrait touch startup pass without JavaScript errors.

Development smoke test: serve this folder, install/use Playwright with Edge,
then run `node tests/graphics-smoke.cjs` with `IRON_RIDGE_URL` set to the served
game URL (default `http://127.0.0.1:8080/`). `PLAYWRIGHT_MODULE` can point to an
existing Playwright installation. Screenshots and the JSON report are written
to the current directory. For comparisons, serve baseline and current copies
under one base URL, set `IRON_RIDGE_BASE_URL`, and run
`node tests/graphics-benchmark.cjs <directory> <quality-index> <view>`.
Set `BENCH_FRAMES=600`, `BENCH_WARMUP=120`, and optionally `CPU_RATE=4`.
Views are `ground-tank`, `dense-forest`, `combat`, and `forest-drive`.

The ridge4 follow-up changes fog/shading constants only. High 1080p forest
and combat CPU medians remain 0.5 and 2.1 ms respectively, with identical
draw calls, geometry, particle-area proxy and texture storage. GPU times show
no regression in these runs; no performance gain is claimed from timing noise.
Raw follow-up measurements: `tests/ridge-visibility-performance.json`.

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
