# Quarry Impact

A standalone 3D browser demolition game set in Blackridge Quarry, with three vehicle profiles, a shared damage system, and 35 locally bundled ElevenLabs sound effects.

## Play

Double-click **Play-Quarry-Impact.cmd**, or run `node serve.mjs` and open **http://127.0.0.1:8795/**. The launcher starts a hidden local server. Node.js is required; the prepared game does not require an npm install. The server binds only to this computer.

Choose a car and mode, then enter the event:

- **Demolition derby:** eight cars; last functioning car wins. At five minutes, remaining condition wins, with damage inflicted breaking ties. Disabled cars remain physical obstacles.
- **Destruction playground:** free driving, crash ramps, movable barrels, optional AI traffic, repair, and an orbit camera for examining damage.
- **Quarry circuit:** three laps on a mixed asphalt/gravel route. Ordered checkpoints prevent shortcuts; recovery costs five seconds. A destroyed car retires from the race.

## Controls

| Input | Action |
|---|---|
| W / Up | Accelerate |
| S / Down | Brake, then reverse |
| A D / Left Right | Steer |
| Space | Handbrake |
| C | Chase / hood camera |
| R | Recover; repair in playground |
| I | Inspect wreck in playground; drag to orbit and scroll to zoom |
| T | Toggle playground AI traffic and restart session |
| Escape | Pause / resume |
| M | Mute |
| F | Fullscreen |

Standard gamepad: left stick steers, right trigger accelerates, left trigger brakes/reverses, bottom face button is the handbrake. Menus use pointer/keyboard. Losing focus pauses an event and clears held keys. Settings and best results are saved only in this browser.

## Rendering and damage

Three.js renders photographic PBR ground and cliff textures, scanned rocks, forest foliage, high-detail car interiors and components, shadows, ambient occlusion, and quarry environment reflections. Ultra targets the user's RTX 5090 at 1440p. High reduces resolution and shadows; Medium also disables ambient occlusion and shadows. No ray tracing is required.

The three bodies are dimensioned derivatives of the licensed Car Concept asset, prepared in Blender and paired with separate mass, power, wheelbase, drive, sound, and damage profiles. They share a design family; they are not licensed production-car replicas.

Rapier handles fixed-step rigid-body physics and raycast wheel suspension. Steering assistance supports forgiving driving. Impacts deform individual body meshes, alter their shading, break glass, detach parts, shrink simplified colliders, and affect steering, suspension and power. This is localized visual deformation with rigid-body physics, not a full structural soft-body simulation.

## Audio

All 35 clips were generated through the user's existing ElevenLabs account, with overage billing disabled. Generation used **1,274 included credits** and made no additional purchases. The initial/final quota records, original exports, prompts, model settings, hashes and processing commands are retained.

Each car has idle, low-, medium-, and high-RPM loops, engine-load and damaged-engine loops, shifts, and exhaust transients. The shared library supplies tire, gravel, skid, suspension, crash, scraping, glass, debris, and forest/quarry sounds. Web Audio crossfades layers, spatializes cars and impacts, applies restrained Doppler, and limits simultaneous effects through a compressed master bus. Generation is strictly offline; the game contains no API key and makes no ElevenLabs calls.

## Development

`npm install` then `npm run dev` starts Vite. Stop the standalone server first if it already owns port 8795. `npm run build` checks TypeScript and produces `dist/`, a static, self-contained site that supports subdirectory hosting. No deployment was performed.

- `npm test`: repeatable rules checks.
- `npm run qa`: Chrome browser integration checks against the local server; reports and screenshots go to `outputs/`.
- `python tools/audio-qa.py`: decode, duration, peak, silence and loop-boundary measurements.
- `tools/prepare_concept.py`: Blender car preparation; editable `.blend` files are under `source/models/`.
- `tools/rocks.py`: reduces the scanned rocks for gameplay.
- `tools/assets.py`: downloads photographic textures and records provenance.
- `tools/audio.py`: explicit ElevenLabs generation, using `ELEVENLABS_API_KEY` from the environment. Never run automatically during builds. It checks quota and refuses overage-enabled accounts; completed clips are reused.

Implementation modules separate assets, world, vehicle dynamics/damage, rules, audio and effects. `window.__quarry` is a local QA interface for scenario setup and performance reports; it is not an online API or a remote service.

See `CREDITS.md` for asset licensing and `VALIDATION.md` for verification and measured performance.

## Published edition

Play: https://jez237.com/games/2026-09-27/quarry-impact/

Listed under **Unfinished** in the [games catalog](https://jez237.com/games/).
This folder contains the editable project and its local assets. Run `npm ci` and
`npm run build` here; copy `dist/` into `games/2026-09-27/quarry-impact/` for release.
Follow the repository deployment instructions in `AGENTS.md`.
