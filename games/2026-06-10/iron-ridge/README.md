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

The woodland uses the detailed tree atlas already used by the site's Stunt
Car Racer (`images/tex-trees.png`), copied locally as `assets/textures/woodland.png`.
No new paid assets or external CDN dependencies were added. Three fixed
crossed planes per tree, plus an interior broadleaf crown, give layered
silhouettes from different driving angles. These are inexpensive foliage
impostors, not individually modeled leaves. Fir, broadleaf, slender broadleaf,
and modeled dead-tree variants retain the original positions and collisions.
Trees and shrubs remain instanced, with alpha-tested cutout shadows and
two-sided canopy lighting. Falling trees retain their texture, tint and
original orientation, and release their individual materials after removal.

Terrain uses the existing grass image with smaller texture scale, baked
soil/gravel detail, forest-litter and clearing masks, and texture-driven
blend edges. These reuse the existing three terrain texture samples and
mesh resolution. Colour grading is more restrained. Grass uses half as
many triangles; dead branches and welded rock silhouettes are more natural.
Tank models, lighting, sky and effects remain authored procedurally in code.

## Performance

The existing automatic quality scaler still controls resolution, shadows,
bloom, foliage density, fog distance and particles. This art update does
not increase foliage counts, shadow resolution or postprocessing passes.

September 15, 2026 validation, Edge/ANGLE on RTX 5090, 1440 x 900, locked
High quality: three fixed views rendered about **81–82% fewer triangles**
including shadow/post passes (spawn: 1,688,414 → 314,306). An eight-second
driving/firing comparison measured **59.5 fps before and 59.8 fps after**,
with the same 16.8 ms 95th-percentile frame interval. Hardware GPU queries
were also sampled at High and Low. These desktop measurements are not a
guarantee for every GPU; portrait touch layout was checked in mobile
emulation, not on physical mobile hardware.

Gameplay checks covered driving, firing, toppling, fallen-tree cleanup,
and reducing/restoring foliage through the existing quality controls.

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
