# Commando HD

A real-time 3D rebuild of Commando HD (three.js r181, vendored, no build step).
Three areas — Landing Zone (day), River Crossing (dusk, rain), Prison Camp
(night) — then the mission loops, harder each time round. It replaced the 2D v0.x build
(painted plates + sprites) on 2026-09-24 — that build is in git history, last
at v0.72.0-reel; `sw.js` here only retires its offline service worker.

Why a rebuild: the 2D build mixed straight-down painted backgrounds with
front-facing, frame-by-frame generated sprites, so perspective, scale, light
and animation never agreed, and collision came from hand-drawn masks over the
paintings. Here everything shares one camera and one sun, and every prop's
collider is built from the same data as its mesh.

Since build v5 the soldiers, the tank, grenades, most props and much of the
vegetation are CC0 models by [Quaternius](https://quaternius.com/) (Toon
Shooter Game Kit, Stylized Nature MegaKit, Ultimate Nature palms, via
poly.pizza). Terrain, water, buildings, the fortresses and the remaining
foliage are still built from primitives in code.

## Layout

| file | what |
|---|---|
| `src/main.js` | boot, shader pre-warm, menus, attract demo, fixed 60 Hz loop, test hooks |
| `src/game.js` | simulation: Joe, enemy AI, bullets, grenades, trucks, tank, motorcycles, searchlights, bunker, mortars, POWs and cages, finale, continues, scoring |
| `src/level1.js` … `level3.js` | area layouts in metres (props, water, encounters, POWs, patrol, finale) |
| `src/levels.js` | the campaign order and per-area lighting/weather (`AMBIENCE`) |
| `src/world.js` | builds an area's terrain, water, props, vegetation, night lights and colliders; disposed between areas |
| `src/terrain.js` | analytic height + colour + water function (rivers, wadeable swamp, causeways, cliffs, AO, craters, trenches) |
| `src/assets.js` | loads the four model GLBs at boot; turns models into shared, normalised geometry (vertex-coloured or textured), splits the tank |
| `src/models.js`, `src/models2.js` | the procedural models (buildings, fortresses, trucks, motorcycle…) and the tank wrapper |
| `src/soldier.js` | Quaternius characters baked per kind into one skinned mesh (one draw call each); clips blended from the game's speed / crouch / throw / death / aim-twist |
| `assets/models/` | `soldier.glb`, `enemy.glb`, `props.glb`, `nature.glb` — meshopt-compressed, WebP textures (1.7 MB total) |
| `tools/` | `pack-models.mjs` rebuilds `assets/models/` from the source GLBs listed in `models.txt` |
| `src/fx.js` | particles, tracers, muzzle flashes, explosions, decals, lights, floating text |
| `src/render.js` | renderer, sky environment, sun + shadows, bloom + grade, camera rig |
| `src/bot.js` | autopilot (attract mode and playthrough tests); local A* around obstacles |
| `src/input.js`, `src/hud.js`, `src/audio.js` | controls, DOM HUD, wrapper over the shared `sfx.js` / `music.js` |

World units are metres: `x` right of the corridor centre, `p` north of the
landing zone (three.js `Z = -p`).

## Testing

Load with `?test` to stop the real-time clock and drive it from
`window.__cmd`: `start({bot, god})`, `step(n)`, `run(n, every)`, `warp(p)`,
`input(intent)`, `state()`, `frames()`, `area(n)`. `?area=N` starts on an
area, `?prof` logs slow frames, `?q=low` forces low quality, `?play` skips the
title.

Headless Chromium with `--use-angle=d3d11 --enable-gpu` renders on the real
GPU; the autopilot clears each area in 80–105 s of game time.

## Models

`tools/models.txt` lists every source model (name → poly.pizza GLB id). To
rebuild the packed files: download those GLBs into `tools/raw/<name>.glb`,
`npm i @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp`,
then `node tools/pack-models.mjs assets/models`. The packer keeps only the AK and
pistol of the characters' weapon sets, the clips the game uses, drops the
MegaKit normal maps (wasted from a top-down camera), dedupes textures and
shrinks them to WebP. Sizes and placement are tuned in code (`PROP_FIT` and
`qKinds()` in `world.js`, `LOOKS` in `soldier.js`).

## Releasing

The site's CDN serves `.js`/`.css` with a 4-hour browser cache that overrides
`_headers`, but `index.html` is always revalidated. So `index.html` pins every
module (import map) and the stylesheet to `?v=N`: **bump `v=` in
`index.html` on every release** (all occurrences), or returning players can
run a mix of old and new modules for hours.
