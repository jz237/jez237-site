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
| C — smoke screen | 💨 button |
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

## Combat readability (polish1, September 2026)

- **Armour results:** AP hits call out what happened under the reticle. A
  rear hit is a REAR PENETRATION (×1.5), a side hit a SIDE PENETRATION
  (×1.15), a head-on glacis hit a PENETRATION (×0.85), and a round striking
  the front plate at 35–60° RICOCHETs (×0.35) with a spark fan and a
  skipping tracer. Kills get a 75 ms hit-stop.
- **Shell arc:** a dashed predicted flight path from the gun as it actually
  points (turret slew and barrel damping included) and a screen-sized impact
  marker. The marker turns red when a tree or crest will catch the round short
  of the reticle. Toggle it under Options → Shell arc.
- **Hull down:** when the nearest threat can see your turret over a crest but
  not your hull, a HULL DOWN badge shows and direct hits deal 40% less damage.
- **Ground:** the worn paths are firm (+14% top speed); dense forest floor
  drags the tracks (up to −16%).
- **Warnings:** artillery salvos get a banner, a double whistle, and pulsing
  red target discs about 2.3 s before each shell lands. Off-screen tanks that
  fire flash their edge chevron and ping the minimap. For the first seconds of
  a run an arrow points to the nearest contact until you fire or close to 60 m.
- **Camera:** foliage inside a cone between the lens and the tank dithers
  away in the tree shaders (no extra draw calls), so forests no longer swallow
  the view. Only a trunk the lens itself would sit inside pulls the camera in.
- **Effects:** explosions run flash → cooling fireball → lingering dark smoke
  column → ground dust skirt, and throw soil clods instead of cubes. Craters
  have a burnt bowl, a lighter ejecta lip, radial streaks and a scorch halo,
  and follow slopes. Wrecks keep their panel detail, get a scorched finish and
  a knocked turret, then smoulder on the field for 90 s (seven at most).
- **Look:** the camo patches are about 2.5× finer with muted olive tones and a
  third colour. Every panel has baked crease occlusion and worn edges. The sky
  adds a warm sun-side horizon, a thin horizon haze and high cirrus. The two
  far ridge layers get light aerial perspective. Stratus banks and sun-warmed
  clouds add variety. Near pines use more, fanned, drooping needle tufts
  that are darker toward the trunk. Each card's bare twig is now buried in the
  branch.
- **Quality scaler:** deploy, startup and each level change get a grace
  window, and a step down needs 2.5 s of sustained slowness, so compile
  hitches no longer drop a capable machine to Low.

## Tactics and battlefield (polish2, September 2026)

- **Smoke screen:** C / 💨 / LB throws a fan of six grenades from the turret
  dischargers. They bloom into a wall that blocks enemy tank, pillbox, rifle
  and rocket line of sight for about 16 s. The cooldown is 24 s.
- **Your armour matters too:** enemy rounds report where they struck.
  Rear ×1.35, side ×1.1, front ×0.85, roof ×1.2. Rounds that hit your front
  plate at a glancing angle BOUNCE for ×0.3; rockets never bounce.
- **Knocked-out parts:** AP penetrations can take out an enemy's tracks
  (side, 35%, 5 s), engine (rear, 50%, half speed for 8 s) or turret ring
  (turret hit, 30%, 4 s). You can lose tracks (2.2 s) or engine power (6 s).
  Field repair fixes both first.
- **Enemy behaviour:** scouts flank toward your side or rear. About half the
  mediums and heavies find hull-down crests or the far side of wrecks and
  move on after a couple of shots. Badly hurt tanks pop smoke and reverse
  out with their front plate forward.
- **New enemies:** the turretless tank destroyer (from wave 4) has an
  accurate long gun but only ±4° of traverse, so circle it. From wave 3 each
  infantry squad includes an anti-tank rocket team with visible, dodgeable,
  lofted rockets.
- **Gamepad:** left stick drives, right stick aims, RT fires, LT holds the MG,
  LB smoke, RB shell type, A boost, B repair, X restock, Y airstrike,
  Back ping, Start pause, D-pad zoom. A or Start deploys from the title
  screen.
- **Weather:** each wave rolls a sky (clear, overcast, dusk, rain, mist) that
  blends in over about 5 s. The sky shader, sun angle and colour, ambient
  light, fog, exposure, cloud tint and haze on the distant ridges all
  change. Rain adds streaks and a rain sound.
- **Battle dressing:** penetrations leave scorch scars on hulls. Tanks below
  25% burn from the engine deck, and hit engines pour black smoke. Tracers
  glow (gold yours, red theirs). Trees shed leaves or needles when hit or
  toppled. Grass lies flat under tanks, along your recent track path and
  around blasts.
- **Voice:** 57 commander lines, all in one ElevenLabs voice ("Harry"). Each
  event has 2–3 takes that never repeat back to back, and every line has its
  own cooldown. Events covered: kills, ricochets, bounces, flanking hits,
  track and engine hits, hull-down, artillery, smoke, rockets, tank
  destroyers and weather.
- **Co-op guests** get the same armour-facing damage and callouts as the
  host. Remote tank facing is now synced for that.
- **Phones:** below 560 px wide the HUD restacks so the gun panel, armour bar
  and weapon button no longer overlap.

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
