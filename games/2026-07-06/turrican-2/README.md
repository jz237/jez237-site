# Shard Assault (3D)

An original run-and-gun on the crystal world Kethra, rendered in real time with three.js.
Lives at `jez237.com/games/2026-07-06/turrican-2/` (the folder keeps its old path so links keep working).

## Layout

| Path | What it is |
|---|---|
| `assets/data.js` | Constants, weapons, enemies, bosses, world list and the deterministic level builders (crawlspaces included), plus `REACH`, the reachable crystals per stage that the stage results score against. |
| `assets/engine.js` | The game simulation (no rendering). `node test.cjs` drives the autopilot through all 11 stages. |
| `assets/game.js` | Main loop, menus (world select, high scores, options), stage flow and results, initials entry, demo takeover, title, QA hooks (`window.__shard`). |
| `assets/audio.js` | Web Audio engine: positional SFX, loops, per-world ambience + reverb, music, announcer voices. |
| `assets/audio/` | ElevenLabs-produced sound: `sfx/`, `amb/`, `music/`, `vo/<voice>-<event>-<n>.mp3`. |
| `assets/demo.js` | Attract-mode autopilot: maps each stage's standable spots and simulates the jumps between them with the engine's own physics (`moveBox`), then routes to crystals, vaults and power-ups with Dijkstra. It rolls into the wheel under incoming fire, through ground troops (laying mines), along flat stretches and through every crawlspace, and picks the scatter gun, arc lance or ricochet by situation. `reachable(state)` reports how many crystals a stage lets you reach. |
| `assets/render.js` | 2D fallback renderer, used only when WebGL2 is unavailable. |
| `src3d/` | The 3D renderer source. `npm run build` bundles it to `assets/shard3d.js`. |
| `assets/shard3d.js` | Built bundle (commit it with the source). |

`src3d/`:

- `main.mjs` renderer entry: canvas, lights, shadows, camera director, actor management, event effects, title scene.
- `terrain.mjs` tile map to sculpted 3D lane blocks (watertight displacement), the landscape behind the lane, cave ceilings and back walls, crates, hazards, platforms, pebbles, foreground silhouettes.
- `water.mjs` the water (see below) and waterfalls.
- `materials.mjs` triplanar procedural terrain shader (strata, cracks, panels, caustics, veins) and the crystal material.
- `backdrop.mjs` sky dome, planets and rings, distant buttes, clouds, light shafts and per-world set pieces (foundry machinery and molten channel, spire columns, rift islands).
- `fx.mjs` GPU particles with closed-form motion, debris, tracers, arc-lance beam, shockwall, rings, pooled dynamic lights.
- `post.mjs` MSAA HDR (with a depth texture), the water pass, bloom, ACES, then grading, vignette, chromatic hits, grain, cryo frost, damage.
- `hud.mjs` HUD on the overlay canvas.
- `worlds.mjs` per-world art direction.
- `actors/` hero, fighter, enemies, bosses, pickups, mines.

## Features

- **Crawlspaces.** Each platform stage gets up to two low mounds with a one-tile tunnel at ground level. Only the rolled-up wheel (16 px) fits the 20 px gap; walkers jump over. The tunnel holds a crystal stash (and a power-up in long ones). They are laid after everything else on their own random stream, so the rest of each stage is unchanged. `level.crawls` lists them; the demo pilot has a `crawl` edge for each.
- **World board.** Full runs started at World 1 post to `https://game-scores.jez237.workers.dev/scores/shard-assault-v1` (`{initials, score, stage, diff, speed}`) after the player enters initials. World-select and demo-takeover runs only go to this device's top 5. Test with Playwright `page.route` so nothing reaches the real board.
- **World select.** Reaching a world in a run opens it (`shard.progress.v1` in localStorage, with the best medal per stage). A run started later begins with the gear a trooper would carry by then (`LOADOUT` in game.js).
- **Stage results.** Crystals found against `D.REACH`, secrets opened (vaults and crawlspaces), time and deaths. Gold at 90%, silver 70%, bronze 45%.
- **Demo takeover.** Fire, jump or start during the demo hands the run to the player at that spot (the Play button reads "Take over" then). Any other key returns to the menu.

## Water

The water meshes live on layer 1, so the main render pass skips them. `WaterPass` (post.mjs) copies the finished opaque frame, then draws the water sampling that frame's colour and depth:

- **Surface:** slow swell plus a ripple-tank height field, detail normals, refraction that never pulls in foreground objects, Beer-Lambert absorption over the real path length through the water, screen-space reflections (ray march + binary refine, sky fallback), sun glints, and foam where the surface meets something or on fresh ripple crests.
- **Side glass** (the cut through the water facing the camera): shimmer and refraction, absorption by thickness and by depth below the surface, ray-marched light shafts and parallax silt on fixed depth slices, and a meniscus with a band of total internal reflection at the waterline.
- **Ripples:** a CPU wave simulation (256x48 cells, 4x6 units) that follows the camera. Splashes, the trooper paddling, shots and swimmers crossing the surface, explosions and cave drips disturb it.
- **Caustics:** the terrain shader draws a sharp, colour-split caustic web on submerged rock, fading with depth (`uWaterTop`).
- **Sound:** drips, shot plops and swim strokes come back from the renderer through `renderer.onWater`; a lapping loop plays near open water and a muffled bed while submerged.
- **Performance mode** (`setFX(false)`) switches the water to a lite alpha-blended version on the main pass.

## Demo zoom

During the demo, pinch (touch) or scroll / trackpad pinch (desktop) zooms from 0.75x to 2.8x about the fingers or cursor, a two-finger drag looks around, and a double tap resets. Zoomed in, the camera frames the trooper; zoomed out, the view stays inside the level. Zoom resets when the demo ends or a viewer takes over. `__shard.zoom.set(z, panX, panY)` drives it in tests.

## Game speed

`D.SPEED` in `assets/data.js` (0.8 by default) scales the whole world. Players pick 70%, 80%, 90% or 100% in Options; `D.setSpeed(v)` applies it when a run starts, and the demo always runs at the default because the pilot's jump tables are built for it. the loop still runs 60 ticks per real second, but each tick simulates `D.DT = D.STEP * D.SPEED` seconds, and the renderer's effects and animation get the same scaled time. Everything in the engine is in seconds, so players, enemies, bullets, bosses and timers all slow together. The demo pilot's tick counts go through `tk()` so its jump shapes keep the same game-time span.

## Build and test

```bash
npm install
npm run build
npm test
```

Bump the `?v=` query on `assets/shard3d.js` (and any other changed script) in `index.html` on every release: the site serves JS with a 4-hour cache.

`npm test` fails with the new numbers if a level change moves `D.REACH`; paste them into data.js.

## Hooks

- `?q=ultra|high|low` picks the quality tier (the Quality button saves it in `shard.quality`).
- `?fixed` disables the dynamic-resolution scaler.
- `?qa` on localhost shows the scene/pose test panel.
- `window.__shard`: `start(world)`, `goToStage(i)`, `clearStage()`, `demo.start()`, `demo.takeOver()`, `zoom`, `setFX(on)`, `run`, `results`, `progress`, `settings`, `snapshot()`, `graphics` (renderer stats).
- `window.__modernGraphics.stats`: draw calls, triangles, frame ms, resolution, level build time.
