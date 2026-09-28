# Quarry Impact

A standalone 3D browser demolition game set in Blackridge Quarry, with three vehicle profiles, a shared damage system, and 35 locally bundled ElevenLabs sound effects.

## Play

[Play Quarry Impact](https://jez237.com/games/2026-09-27/quarry-impact/) in a desktop browser. It is listed under **Unfinished** on the [games page](https://jez237.com/games/).

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
| A D | Steer left / right |
| Left Right arrows | Reversed steering, as requested |
| Space | Handbrake |
| C | Chase / hood camera |
| R | Recover; repair in playground |
| I | Inspect wreck in playground; drag to orbit and scroll to zoom |
| T | Toggle playground AI traffic and restart session |
| Escape | Pause / resume |
| M | Mute |
| F | Fullscreen |

Standard gamepad: left stick steers, right trigger accelerates, left trigger brakes/reverses, bottom face button is the handbrake. Menus use pointer/keyboard. Losing focus pauses a solo event and clears held keys. Online, controls pause while the shared event continues. Settings and solo best results are saved only in this browser.

## Online rooms

Choose **Play Online**, leave the room code empty and press **Connect**. Copy the invitation link and send it to the other players. Rooms hold eight cars, with AI in unused places. The host starts events and rematches; disconnected players can rejoin their seat. Car physics and scoring run on the server.

The bundled `public/multiplayer.json` connects to the deployed service at `wss://quarry-impact-online.quarry-impact-free.workers.dev`. Hosting uses the verified dedicated Cloudflare Free account, with four simultaneous rooms and daily service limits. Reaching a Free limit may temporarily prevent online play; no paid plan or overage spending is authorized. Solo modes remain available. See `multiplayer/README.md` for local setup, limits and deployment details.

## Rendering and damage

Three.js renders layered photographic ground and cliff materials, scanned rocks and near fir trees, photographic workshop cladding, detailed car interiors and exposed crash structures, shadows, ambient occlusion, and quarry environment reflections. Ultra targets the user's RTX 5090 at 1440p. High reduces resolution and shadows; Medium also disables ambient occlusion and shadows. No ray tracing is required.

The road-facing quarry has a Blender-built cut, an adjoining extraction bay with fractured faces and a collapsed chute, and seated rubble. Its approach connects low rubble deposits, drainage channels and grouped young firs from the road shoulder to the wall. Painted material masks blend photographic broken-rock and soil maps into the surrounding terrain. Spatial sections switch between near and distant geometry. Solo play and the multiplayer server share the near wall and deposit surfaces, with simplified rubble collisions. The broader quarry still contains procedural terrain and distant tree cards; this remains a visual work in progress.

A 112-metre gravel approach joins the lane, shoulders and surrounding ground in one authored surface. Interrupted compaction, deposited fines and loose margins reuse the existing photographic maps at metre scale. Small shoulder fragments add relief while the lane and physical terrain retain their original heights. The rest of the circuit also has corrected shoulder winding and anchored inner edges.

The three bodies are dimensioned derivatives of the licensed Car Concept asset, prepared in Blender and paired with separate mass, power, wheelbase, drive, sound, and damage profiles. They share a design family; they are not licensed production-car replicas.

The coupe adds a recessed rear plate, lamp dividers, hollow exhaust outlets and concealed bumper reinforcement and mounts. These details reuse existing materials; body dust varies smoothly without the former coarse checker pattern. The model retains the same damage panels, wheel pivots and driving physics.

Rapier handles fixed-step rigid-body physics and raycast wheel suspension. Steering assistance supports forgiving driving. Impacts deform individual body meshes, alter their shading, break glass, detach parts, shrink simplified colliders, and affect steering, suspension and power. This is localized visual deformation with rigid-body physics, not a full structural soft-body simulation.

## Audio

All 35 clips were generated through the user's existing ElevenLabs account, with overage billing disabled. Generation used **1,274 included credits** and made no additional purchases. The initial/final quota records, original exports, prompts, model settings, hashes and processing commands are retained.

Each car has idle, low-, medium-, and high-RPM loops, engine-load and damaged-engine loops, shifts, and exhaust transients. The shared library supplies tire, gravel, skid, suspension, crash, scraping, glass, debris, and forest/quarry sounds. Web Audio crossfades layers, spatializes cars and impacts, applies restrained Doppler, and limits simultaneous effects through a compressed master bus. Generation is strictly offline; the game contains no API key and makes no ElevenLabs calls.

## Development

`npm install` then `npm run dev` starts Vite. Stop the standalone server first if it already owns port 8795. `npm run build` checks TypeScript and produces `dist/`, a static site that supports subdirectory hosting. The multiplayer server is a separate Worker under `multiplayer/`; the static game makes no ElevenLabs requests.

- `npm test`: repeatable rules checks.
- `npm run qa`: Chrome browser integration checks against the local server; reports and screenshots go to `outputs/`.
- `python tools/audio-qa.py`: decode, duration, peak, silence and loop-boundary measurements.
- `tools/prepare_concept.py`: Blender car preparation; editable `.blend` files are under `source/models/`.
- Blender: `--background --python tools/refine_cars.py -- --kind coupe` rebuilds only the coupe refinement, checking that sedan and hatch assets remain unchanged. Refined editable scenes and hashes are recorded in `source/vehicle-refinement-manifest.json`.
- `tools/coupe-rear-qa.mjs`: matched intact, damaged, repaired and lighting-diagnostic browser views at 1440p; set a new `QUARRY_CAR_QA_OUTPUT` directory for each comparison. The actual-car tests also exercise runtime batching, local damage, exact repair and multiplayer damage replay.
- `tools/rocks.py`: reduces the scanned rocks for gameplay.
- Blender: run `tools/author-quarry-cut.py` to reproduce the road-facing cut, rubble, detail levels and shared collision proxy. Editable source and hashes are in `source/models/quarry-cut*`.
- Blender: run `tools/author-quarry-roadside.py` to reproduce the adjoining deposits and fragments. It uses `tools/quarry_surface_clip.py` to conform ground triangles to the shared terrain. Source and hashes are in `source/models/quarry-roadside*`.
- Blender: run `tools/author-quarry-extension.py` to reproduce the adjoining extraction bay and its shared collision surface. Editable source, preserved boundary reference and generated-file hashes are in `source/models/quarry-extension*`.
- Blender: run `tools/author-quarry-road-approach.py` to reproduce the connected gravel lane, shoulders, material masks and small fragments. Editable source, frozen road/terrain references and hashes are in `source/models/quarry-road-approach*`; this visual surface preserves the existing driving physics.
- `python tools/restore-scenery-sources.py`: restores the large CC0 fir source buffers/textures from recorded URLs and verifies SHA-256 hashes. These raw inputs are omitted from the GitHub snapshot; the small source glTF files, manifests, editable Blender scenes and prepared runtime models are retained. The one editable scene over the static host's 25 MiB per-file limit, `source/models/fir-medium.blend` (50 MB), is also restored by this script from the site's R2 bucket (SHA-256 checked) instead of living in the repository, because Cloudflare Pages rejects any deployment containing a file that large.
- Blender: run `tools/prepare-fir-saplings.py` and `tools/prepare-fir-medium.py` with `blender --background --python <script>` to rebuild fir detail levels. `tools/split-fir-medium.py` re-exports three files below the static host’s size limit.
- `tools/assets.py`: downloads photographic textures and records provenance.
- `node tools/prepare-industrial-material.mjs`: restores the CC0 workshop maps from recorded URLs and verifies original checksums.
- `node tools/prepare-roadside-material.mjs`: restores the CC0 broken-rock maps with verified source checksums.
- `tools/quarry-cut-qa.mjs`: captures matched 1440p scenery and moving-car views with short frame-time diagnostics; preserve comparisons with `QUARRY_CUT_PHASE` and `QUARRY_CUT_OUTPUT`.
- Add `QUARRY_CUT_ROAD=1` for gravel close views, moving chase poses and hood-position inspections, or `QUARRY_CUT_ROAD_ENDS=1` for both joins. These comparisons hold field of view fixed and do not replace the sustained benchmark.
- `tools/check-published-build.mjs`: verifies the published bundle and authored GLB against local hashes after deployment; use `QUARRY_RELEASE_CHECK_OUTPUT` to retain each report.
- `tools/performance-qa.mjs`: measures sustained frame intervals and resource counts across eight-car derby and racing events. Set `QUARRY_PERFORMANCE_OUTPUT` to a distinct JSON path to retain each run with its corresponding screenshot and loaded build URL; the default duration is 610 seconds.
- `tools/audio.py`: explicit ElevenLabs generation, using `ELEVENLABS_API_KEY` from the environment. Never run automatically during builds. It checks quota and refuses overage-enabled accounts; completed clips are reused.

Implementation modules separate assets, world, vehicle dynamics/damage, rules, audio and effects. `window.__quarry` is a local QA interface for scenario setup and performance reports; it is not an online API or a remote service.

See `CREDITS.md` for asset licensing and `VALIDATION.md` for verification and measured performance.
