# Commando HD

A real-time 3D rebuild of Commando HD (three.js r181, vendored, no build step).
Area 1 for now; it loops harder each time round. It replaced the 2D v0.x build
(painted plates + sprites) on 2026-09-24 — that build is in git history, last
at v0.72.0-reel; `sw.js` here only retires its offline service worker.

Why a rebuild: the 2D build mixed straight-down painted backgrounds with
front-facing, frame-by-frame generated sprites, so perspective, scale, light
and animation never agreed, and collision came from hand-drawn masks over the
paintings. Here everything shares one camera and one sun, soldiers are rigged
3D models animated procedurally, and every prop's collider is built from the
same data as its mesh.

## Layout

| file | what |
|---|---|
| `src/main.js` | boot, shader pre-warm, menus, attract demo, fixed 60 Hz loop, test hooks |
| `src/game.js` | simulation: Joe, enemy AI, bullets, grenades, trucks, bunker, mortars, POWs, finale, scoring |
| `src/level1.js` | Area 1 layout in metres (props, encounters, POWs, patrol, finale) |
| `src/world.js` | builds terrain, water, props, vegetation and the collider set from the level |
| `src/terrain.js` | analytic height + colour function (also used for AO, craters, trenches) |
| `src/models.js` | every static model, built from primitives |
| `src/soldier.js` | rigid-skinned soldier (one draw call each) + procedural animation |
| `src/fx.js` | particles, tracers, muzzle flashes, explosions, decals, lights, floating text |
| `src/render.js` | renderer, sky environment, sun + shadows, bloom + grade, camera rig |
| `src/bot.js` | autopilot (attract mode and playthrough tests); local A* around obstacles |
| `src/input.js`, `src/hud.js`, `src/audio.js` | controls, DOM HUD, wrapper over the shared `sfx.js` / `music.js` |

World units are metres: `x` right of the corridor centre, `p` north of the
landing zone (three.js `Z = -p`).

## Testing

Load with `?test` to stop the real-time clock and drive it from
`window.__cmd`: `start({bot, god})`, `step(n)`, `run(n, every)`, `warp(p)`,
`input(intent)`, `state()`, `frames()`. `?prof` logs slow frames, `?q=low`
forces low quality, `?play` skips the title.

Headless Chromium with `--use-angle=d3d11 --enable-gpu` renders on the real
GPU; the autopilot clears the area in about 90 s of game time.
