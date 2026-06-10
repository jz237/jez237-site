# Iron Ridge — 3D Tank Combat

Open-field daytime tank combat in the browser. Drive a tank with real
rigid-body physics across rolling forested terrain, shell targets and
explosive barrels, then survive waves of AI tanks that hunt, keep range,
check line-of-sight, and lead their shots.

**Play it:** https://jz237.github.io/jez237-site/games/2026-06-10/iron-ridge/

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

## Honest notes on the art

Every visual is **procedural, authored in code** — there are no model
files, textures, or sourced assets. Terrain is simplex-noise heightmap
geometry with canvas-painted grass/dirt/rock detail textures blended by
slope and height in the shader, plus baked concavity AO; four tree
species, bushes, deadfall, grass, and flowers are instanced primitive
meshes scattered by noise. Tanks have sloped trapezoid hulls, cast
lathe turrets with cupolas and pintle MGs, canvas-painted camo and
decal markings, road wheels that ride the (real) suspension, and
individually instanced track links that circulate around the running
gear at per-side track speed; the sky is a gradient shader with a sun disc and
canvas-blob clouds; effects are pooled point sprites with scorch decals.
The look aims for clean stylized low-poly, not photorealism.

## Performance

An automatic quality scaler watches smoothed frame time and steps pixel
ratio, shadow resolution, bloom, foliage density, fog distance, and
particle counts down *before* the game can dip below 30 fps (and back up
when there's headroom). On a desktop GPU the full scene renders in ~1–2 ms.
Mobile gets a lower starting tier. Touch controls are implemented and laid
out for phones, but were tested in an emulated environment rather than on
physical devices.

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
