# Iron Ridge — 3D Tank Combat

Open-field daytime tank combat in the browser. Drive a tank with real
rigid-body physics across rolling forested terrain, shell targets and
explosive barrels, then survive waves of AI tanks that hunt, keep range,
check line-of-sight, and lead their shots.

**Play it:** https://jz237.github.io/jez237-site/games/2026-06-10/iron-ridge/

## Controls

| Desktop | Mobile |
|---|---|
| WASD / arrows — drive | left stick — drive |
| mouse — aim turret | drag right side — aim |
| click / space — fire | FIRE button |
| R — restock the ready rack | |
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
- **AI:** enemy tanks seek, orbit at preferred range, raycast
  line-of-sight, lead the player's motion, and un-stick themselves.
- **Scoring:** global top-10 via the site's shared Cloudflare Worker
  (`/scores/iron-ridge` namespace), with localStorage fallback offline.

## Honest notes on the art

Every visual is **procedural, authored in code** — there are no model
files, textures, or sourced assets. Terrain is simplex-noise heightmap
geometry with slope/height vertex colours; trees, rocks, and grass are
instanced primitive meshes scattered by noise; the tank is built from
boxes and cylinders; the sky is a gradient shader with a sun disc and
canvas-blob clouds; effects are pooled point sprites. The look aims for
clean stylized low-poly, not photorealism.

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

Audio is synthesized with the Web Audio API (engine drone follows
throttle, cannon boom, explosions, wind). No audio files.
