# Shard Assault (3D)

An original run-and-gun on the crystal world Kethra, rendered in real time with three.js.
Lives at `jez237.com/games/2026-07-06/turrican-2/` (the folder keeps its old path so links keep working).

## Layout

| Path | What it is |
|---|---|
| `assets/data.js` | Constants, weapons, enemies, bosses, world list and the deterministic level builders. |
| `assets/engine.js` | The game simulation (no rendering). `node test.cjs` drives the autopilot through all 11 stages. |
| `assets/game.js` | Main loop, menus, stage flow, title, QA hooks (`window.__shard`). |
| `assets/audio.js` | Web Audio engine: positional SFX, loops, per-world ambience + reverb, music, announcer voices. |
| `assets/audio/` | ElevenLabs-produced sound: `sfx/`, `amb/`, `music/`, `vo/<voice>-<event>-<n>.mp3`. |
| `assets/demo.js` | Attract-mode autopilot: maps each stage's standable spots and simulates the jumps between them with the engine's own physics (`moveBox`), then routes to crystals, vaults and power-ups with Dijkstra. It rolls into the wheel under incoming fire, through ground troops (laying mines) and along flat stretches, and picks the scatter gun, arc lance or ricochet by situation. `reachable(state)` reports how many crystals a stage lets you reach. |
| `assets/render.js` | 2D fallback renderer, used only when WebGL2 is unavailable. |
| `src3d/` | The 3D renderer source. `npm run build` bundles it to `assets/shard3d.js`. |
| `assets/shard3d.js` | Built bundle (commit it with the source). |

`src3d/`:

- `main.mjs` renderer entry: canvas, lights, shadows, camera director, actor management, event effects, title scene.
- `terrain.mjs` tile map to sculpted 3D lane blocks (watertight displacement), the landscape behind the lane, cave ceilings and back walls, crates, hazards, water, platforms, waterfalls, pebbles, foreground silhouettes.
- `materials.mjs` triplanar procedural terrain shader (strata, cracks, panels, caustics, veins) and the crystal material.
- `backdrop.mjs` sky dome, planets and rings, distant buttes, clouds, light shafts and per-world set pieces (foundry machinery and molten channel, spire columns, rift islands).
- `fx.mjs` GPU particles with closed-form motion, debris, tracers, arc-lance beam, shockwall, rings, pooled dynamic lights.
- `post.mjs` MSAA HDR, bloom, ACES, then grading, vignette, chromatic hits, grain, cryo frost, damage.
- `hud.mjs` HUD on the overlay canvas.
- `worlds.mjs` per-world art direction.
- `actors/` hero, fighter, enemies, bosses, pickups, mines.

## Game speed

`D.SPEED` in `assets/data.js` (0.8) scales the whole world: the loop still runs 60 ticks per real second, but each tick simulates `D.DT = D.STEP * D.SPEED` seconds, and the renderer's effects and animation get the same scaled time. Everything in the engine is in seconds, so players, enemies, bullets, bosses and timers all slow together. The demo pilot's tick counts go through `tk()` so its jump shapes stay the same at any speed.

## Build and test

```bash
npm install
npm run build
npm test
```

Bump the `?v=` query on `assets/shard3d.js` (and any other changed script) in `index.html` on every release: the site serves JS with a 4-hour cache.

## Hooks

- `?q=ultra|high|low` picks the quality tier (the Quality button saves it in `shard.quality`).
- `?fixed` disables the dynamic-resolution scaler.
- `?qa` on localhost shows the scene/pose test panel.
- `window.__shard`: `start()`, `goToStage(i)`, `demo.start()`, `snapshot()`, `graphics` (renderer stats).
- `window.__modernGraphics.stats`: draw calls, triangles, frame ms, resolution, level build time.
