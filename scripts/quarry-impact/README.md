# Quarry Impact

A standalone 3D browser demolition game set in Blackridge Quarry, with three vehicle profiles, a shared damage system, and 38 locally bundled ElevenLabs sound effects.

Damaged cars now develop engine-bay smoke, turbulent flames, rising embers and a short fuel burst after a severe final impact. Sorted volume effects include smoke illumination and nearby fire lighting. Fire roar, crackling and explosive bursts are positional ElevenLabs recordings; ordinary impacts retain metal, glass and loose-part layers. Vehicle bodies stay frozen during the five-second wreck inspection while fire and sound continue. Repair clears the effects; pause and mute are respected. See `source/vehicle-fire.md` for implementation, audio provenance and limits.

The latest pass focuses on wrecks: refined panel topology, shared deformation for bodywork, glass and internal structure, connected bumper/hood/mirror attachments, and filtered impact scratches. Wrecking out of a solo derby or race holds the scene for five seconds with an orbit camera, then returns to the menu. The timer pauses on focus loss. The remaining quarry banks have shallow rock relief, foreground conifer cards have been replaced with existing branch geometry, and four more route sections have gravel and grass verge patches. See `source/wreck-geometry/README.md` and `VALIDATION.md`. This remains an unfinished browser game; the scenery and collision model do not yet match a production game such as Wreckfest 2.

## Play

[Play Quarry Impact on GitHub](https://jz237.github.io/jez237-site/games/2026-09-27/quarry-impact/) in a desktop browser. The [jez237 version](https://jez237.com/games/2026-09-27/quarry-impact/) is listed under **Unfinished** on the [games page](https://jez237.com/games/); its latest update is pending restored Cloudflare sign-in.

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

Quarry walls now use a photographed fractured-rock surface at its documented 2.7-metre scale. World-space projection keeps the scale consistent across vertical faces, ledges and imported detail levels. Restrained weathering and ledge dust preserve the source fracture detail; original geometry and collisions remain in place.

Sunlight now follows the bright region in the bundled HDR sky. A cached shadow map covers fixed quarry scenery beyond the moving car-shadow map, so distant ledges, rock recesses and rubble cast consistent shadows. Ultra uses a 4096-square static map, High uses 2048, and Medium disables it. The fixed capture excludes cars and movable props and retains one stable scenery detail level. Distant photo trees use an approximate canopy lighting response; they remain flat imagery rather than fully modelled crowns.

The road-facing quarry has a Blender-built cut, an adjoining extraction bay with fractured faces and a collapsed chute, and seated rubble. Its approach connects low rubble deposits, drainage channels and grouped young firs from the road shoulder to the wall. Painted material masks blend photographic broken-rock and soil maps into the surrounding terrain. Spatial sections switch between near and distant geometry. Solo play and the multiplayer server share the near wall and deposit surfaces, with simplified rubble collisions. The broader quarry still contains procedural terrain and distant tree cards; this remains a visual work in progress.

The northern arena headwall replaces another 35 degrees of the old terraces with two fractured faces and a narrow collapse channel. Its Blender source reuses the existing photographic rock maps and scanned fragments. Nearby and distant meshes share their section boundaries, and solo and online play use the same wall collision surface.

The adjoining eastern bay adds a recessed extraction face, broken upper ledges and rubble reaching the quarry floor. Its original lower apron, outer crest and neighboring joins remain in place; a fitted closure fills the old gap beneath the wall. Three sections share photographic materials across their detail levels, with the exact near wall and 34 large-rubble collision shapes used in both solo and online play.

Above this wall, six woodland stands add 48 mature firs, 36 medium trees and 48 young plants. The mature firs derive from a CC0 Poly Haven scan prepared in Blender, with separate nearby and distant meshes. Existing photographic tree cards form the distant backdrop. Locally authored material weights place photographed fallen needles beneath the trees and gravel along the rim. Mature roots are seated using their scanned footprint on the unchanged hillside, and the browser and multiplayer server share their trunk collision shapes.

The new northern backdrop assets are rendered derivatives of those same three prepared fir models. Eight azimuths and two elevations per tree provide albedo/coverage and object-normal/depth atlases. Sunlight, ambient occlusion, fog and instance tint are excluded from the bake so the game can apply its own lighting. Six local PNGs total approximately 9.74 MB and allocate 64 MiB with mipmaps; these are asset budgets, not a performance result. Exact inputs, output byte counts and hashes are recorded in `source/models/quarry-north-backdrop-manifest.json`.

The derby floor blends photographic gravel, broken stone and fines across authored working areas, interrupted wheel paths and loose deposits. Damp sediment follows the actual twelve puddle outlines, and the outer edge matches the surrounding terrain material. One locally bundled material mask controls the blend; the floor, water and driving physics keep their original geometry. This adds surface variation, not physical ruts or soft ground.

A 112-metre gravel approach joins the lane, shoulders and surrounding ground in one authored surface. Interrupted compaction, deposited fines and loose margins reuse the existing photographic maps at metre scale. Small shoulder fragments add relief while the lane and physical terrain retain their original heights. The rest of the circuit also has corrected shoulder winding and anchored inner edges.

The paved circuit uses a separate three-metre asphalt photograph for aggregate detail and the original aerial photograph at thirty metres for broad wear. Finite repairs, interrupted rubber marks and asymmetric mineral deposits follow the track's measured arc length. The same material joins the lane to its shoulders, fading into the existing terrain at their outer edges. Solo and multiplayer grip follow a shared numerical copy of the visible pavement boundary, replacing the former sparse checkpoint-distance approximation. The existing asphalt/gravel friction values and road geometry stay unchanged; cosmetic repairs, rubber and deposits do not alter traction. Existing local best results remain saved, although older times used the previous surface classification.

The three bodies are dimensioned derivatives of the licensed Car Concept asset, prepared in Blender and paired with separate mass, power, wheelbase, drive, sound, and damage profiles. They share a design family; they are not licensed production-car replicas.

The coupe adds a recessed rear plate, lamp dividers, hollow exhaust outlets and concealed bumper reinforcement and mounts. These details reuse existing materials; body dust varies smoothly without the former coarse checker pattern. The latest coupe detail pass adds a real opening and recessed honeycomb grille, four separately damageable lamp lenses, tire ribs, wheel fasteners and drilled-brake detail. Neutral glass and restrained paint reflections improve material separation. Impact-directed wear and normals follow local dents; nearby interior trim and concealed crash structure deform with the skin. The original wheel pivots and driving physics remain intact. The western bend adds irregular grass pockets, scanned young firs and small photographed scree fragments outside the driving lane. This is a focused art improvement; the broader game is still short of Wreckfest 2 fidelity.

Rapier handles fixed-step rigid-body physics and raycast wheel suspension. Steering assistance supports forgiving driving. Impacts deform individual body meshes, alter their shading, break glass, detach parts, shrink simplified colliders, and affect steering, suspension and power. This is localized visual deformation with rigid-body physics, not a full structural soft-body simulation.

## Audio

All 38 clips were generated through the user's existing ElevenLabs account, with overage billing disabled. The original 35 used **1,274 included credits**; the three added fire/burst effects used **170 included credits**, with no additional purchases. Original exports, prompts, model settings, hashes and processing commands are retained; private quota records are excluded from publication.

Each car has idle, low-, medium-, and high-RPM loops, engine-load and damaged-engine loops, shifts, and exhaust transients. The shared library supplies tire, gravel, skid, suspension, crash, scraping, glass, debris, and forest/quarry sounds. Web Audio crossfades layers, spatializes cars and impacts, applies restrained Doppler, and limits simultaneous effects through a compressed master bus. Generation is strictly offline; the game contains no API key and makes no ElevenLabs calls.

## Development

`npm install` then `npm run dev` starts Vite. Stop the standalone server first if it already owns port 8795. `npm run build` checks TypeScript and produces `dist/`, a static site that supports subdirectory hosting. The multiplayer server is a separate Worker under `multiplayer/`; the static game makes no ElevenLabs requests.

- `npm test`: repeatable rules, vehicle and scenery checks. After `npm ci`, the arena audit rebuilds the pinned multiplayer Rapier adapter locally if its ignored generated file is absent, then verifies it against the tracked deployment reference; private release reports are not required.
- `npm run qa`: Chrome browser integration checks against the local server; reports and screenshots go to `outputs/`.
- `QUARRY_DAYLIGHT_PHASE=<new-name> node tools/daylight-qa.mjs`: matched 1440p daylight, moving chase and isolated-lighting comparisons. The report verifies loaded assets and measures sky/sun alignment from the actual HDR. Set environment variables using your shell syntax.
- `QUARRY_SHADOW_PHASE=<new-name> node tools/shadow-runtime-qa.mjs`: real WebGL cache, replacement-car, quality-cycle and context-recovery checks; run with no other GPU test active.
- `python tools/audio-qa.py`: decode, duration, peak, silence and loop-boundary measurements.
- `tools/prepare_concept.py`: Blender car preparation; editable `.blend` files are under `source/models/`.
- Blender: `--background --python tools/refine_cars.py -- --kind coupe` rebuilds only the coupe refinement, checking that sedan and hatch assets remain unchanged. Refined editable scenes and hashes are recorded in `source/vehicle-refinement-manifest.json`.
- Blender: `--background --python tools/detail-coupe.py` derives the detailed coupe from the retained refined scene and writes `source/models-detailed/coupe.blend` plus the runtime GLB. `source/coupe-detail-manifest.json` records provenance and exact outputs. See `source/coupe-realism.md` for scope and reproduction.
- `tools/coupe-realism-qa.mjs`: twenty matched intact, damaged, repaired, lighting and western-bend views; use a fresh `QUARRY_CAR_QA_OUTPUT` directory.
- `tools/coupe-rear-qa.mjs`: matched intact, damaged, repaired and lighting-diagnostic browser views at 1440p; set a new `QUARRY_CAR_QA_OUTPUT` directory for each comparison. The actual-car tests also exercise runtime batching, local damage, exact repair and multiplayer damage replay.
- `tools/rocks.py`: reduces the scanned rocks for gameplay.
- Blender: run `tools/author-quarry-cut.py` to reproduce the road-facing cut, rubble, detail levels and shared collision proxy. Editable source and hashes are in `source/models/quarry-cut*`.
- Blender: run `tools/author-quarry-roadside.py` to reproduce the adjoining deposits and fragments. It uses `tools/quarry_surface_clip.py` to conform ground triangles to the shared terrain. Source and hashes are in `source/models/quarry-roadside*`.
- Blender: run `tools/author-quarry-extension.py` to reproduce the adjoining extraction bay and its shared collision surface. Editable source, preserved boundary reference and generated-file hashes are in `source/models/quarry-extension*`.
- Blender: run `tools/author-quarry-headwall.py` to reproduce the northern arena wall, rubble and shared collision surface. Its frozen wrap-around boundary, editable source and generated-file hashes are in `source/models/quarry-headwall*`.
- Blender: run `tools/author-quarry-east-bay.py` to reproduce the adjoining eastern extraction face and rubble. Its frozen 25–55° boundary, editable source, provenance and output hashes are in `source/models/quarry-east-bay*`.
- `python tools/prepare-north-fir-geometry.py` then Blender `--background --python tools/author-north-firs.py` prepares the mature fir detail levels. Source provenance, sampling settings and asset hashes are recorded in `source/models/quarry-north-firs-manifest.json`. The three editable mature-fir Blender scenes exceed the static host's per-file limit and remain local; these tools reproduce them from the restored CC0 source. Compressed runtime models and their local decoder are bundled in the release.
- For a full mature-fir rebuild, restore the recorded sources, run `python tools/prepare-draco-runtime.py`, prepare/export the geometry as above, run `node tools/decode-north-draco.mjs`, `python tools/fit-north-fir-proxies.py` and `npx tsx tools/generate-north-forest.ts`, then regenerate the floor mask. Collision fitting measures the decoded shipped models, including their quantization.
- `node tools/prepare-north-floor-material.mjs` restores the credited needle-litter photographs and verifies their original checksums. `node tools/generate-north-floor.mjs` rebuilds the locally bundled material mask after placement changes, without network access.
- `tools/forest-edge-qa.mjs` captures matched forest views, records the actual camera pose after orbit constraints and verifies assets from application requests. Use a new `QUARRY_FOREST_PHASE` and the exact `QUARRY_FOREST_EXPECTED_BUNDLE` for every candidate. Close-view samples are diagnostic; sustained performance comes from the separate benchmark.
- To reproduce the northern backdrop atlases, use Node.js, Blender 5.2, and Python 3 with NumPy, Pillow and SciPy. Run `node tools/decode-north-draco.mjs`, `python tools/prepare-north-backdrop.py`, `blender --background --python tools/bake-north-backdrop.py`, then `python tools/pack-north-backdrop.py`. This recipe needs only the bundled mature/medium fir GLBs, bundled texture images and local Draco decoder; it performs no downloads and does not require the large original scan or editable mature-fir scenes. The decoder reads the shipped compressed model bytes, preparation extracts the exact embedded runtime maps, Blender renders unlit attributes, and packing preserves fractional needle coverage. Temporary EXR/NPZ frames stay in ignored `outputs/north-backdrop/bake/`. The runtime basis/UV contract is `src/quarry-north-backdrop-atlas.json`; detailed channel, gutter and licensing notes are in `source/models/quarry-north-backdrop.md`. Gameplay loads the bundled PNGs and never runs these tools.
- Blender: run `tools/author-quarry-road-approach.py` to reproduce the connected gravel lane, shoulders, material masks and small fragments. Editable source, frozen road/terrain references and hashes are in `source/models/quarry-road-approach*`; this visual surface preserves the existing driving physics.
- `python tools/restore-scenery-sources.py`: restores the large CC0 fir source buffers/textures from recorded URLs and verifies SHA-256 hashes. These raw inputs are omitted from the GitHub snapshot; the small source glTF files, manifests, editable Blender scenes and prepared runtime models are retained. The one editable scene over the static host's 25 MiB per-file limit, `source/models/fir-medium.blend` (50 MB), is also restored by this script from the site's R2 bucket (SHA-256 checked) instead of living in the repository, because Cloudflare Pages rejects any deployment containing a file that large.
- Blender: run `tools/prepare-fir-saplings.py` and `tools/prepare-fir-medium.py` with `blender --background --python <script>` to rebuild fir detail levels. `tools/split-fir-medium.py` re-exports three files below the static host’s size limit.
- `tools/assets.py`: downloads photographic textures and records provenance.
- `node tools/prepare-industrial-material.mjs`: restores the CC0 workshop maps from recorded URLs and verifies original checksums.
- `node tools/prepare-roadside-material.mjs`: restores the CC0 broken-rock maps with verified source checksums.
- `node tools/prepare-circuit-material.mjs`: restores the CC0 Asphalt 02 photographs with verified source checksums. `node tools/generate-circuit-surface.mjs` reproduces the compressed four-channel material mask from `source/circuit-surface.json` and its frozen route reference, without network access. `node tools/export-circuit-grip.mjs` derives the shared numeric grip profile from that mask and the exact lane triangles. `node --import tsx tools/audit-circuit-grip.ts` checks current grip, geometry and Worker inputs; the older circuit audit retains its explicitly historical comparisons.
- `node tools/prepare-geology-material.mjs`: restores and verifies the three original CC0 Rock Face 03 maps. See `source/geology-material.md` for physical scale, material design and provenance. `tools/cliff-material-qa.mjs` captures matched driving and close inspection views; choose a new phase and exact expected app bundle for each candidate.
- `tools/quarry-cut-qa.mjs`: captures matched 1440p scenery and moving-car views with short frame-time diagnostics; preserve comparisons with `QUARRY_CUT_PHASE` and `QUARRY_CUT_OUTPUT`.
- `node tools/generate-arena-mask.mjs`: rebuilds the compact local material mask from editable `source/arena-floor-mask.json` and frozen actual puddle contours. It performs no downloads and does not run during gameplay. `tools/arena-surface-qa.mjs` captures matched driving, low ground, shoreline and boundary views; use a new `QUARRY_ARENA_PHASE` for each comparison.
- Add `QUARRY_CUT_ROAD=1` for gravel close views, moving chase poses and hood-position inspections, or `QUARRY_CUT_ROAD_ENDS=1` for both joins. These comparisons hold field of view fixed and do not replace the sustained benchmark.
- `tools/check-published-build.mjs`: verifies the published bundle and authored GLB against local hashes after deployment; use `QUARRY_RELEASE_CHECK_OUTPUT` to retain each report.
- `tools/performance-qa.mjs`: measures sustained frame intervals and resource counts across eight-car derby and racing events. Set `QUARRY_PERFORMANCE_OUTPUT` to a distinct JSON path to retain each run with its corresponding screenshot and loaded build URL; the default duration is 610 seconds.
- `tools/audio.py`: explicit ElevenLabs generation, using `ELEVENLABS_API_KEY` from the environment. Never run automatically during builds. It checks quota and refuses overage-enabled accounts; completed clips are reused.

Implementation modules separate assets, world, vehicle dynamics/damage, rules, audio and effects. `window.__quarry` is a local QA interface for scenario setup and performance reports; it is not an online API or a remote service.

See `CREDITS.md` for asset licensing and `VALIDATION.md` for verification and measured performance.

## Recovery checkpoint

The September 28 recovery checkpoint preserved the interrupted western wall work. That wall is now exported and integrated: three sections of fractured extraction faces, a collapsed rubble channel and grounded toe closure share their collision surface with online play. The original recovery snapshots remain preserved in [source/recovery/west-wall/README.md](source/recovery/west-wall/README.md); see [the completed asset record](source/models/quarry-west-wall.md) for current details.
