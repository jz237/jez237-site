# Wreck finish and loose assemblies

This increment follows the fire release `448c0c2b3bdc96b3ea0deed92d22a6f0a5025916`. It reuses the existing licensed Blender car exports, scenery, photographic materials and all 38 locally bundled ElevenLabs clips. There is no new generated media, asset purchase, API usage or hosting-plan change.

## Metal and attachments

`wreck-geometry.ts` advances the shared vehicle-space dent field in eight bounded increments, adds alternating compression folds, and approaches the existing 90 cm displacement limit gradually. Skin, glass, seals and interior structure still share the contact field. Imported UV duplicates retain matching displacement and authored normals remain the reference for shading. This is a visual approximation over rigid-body collisions, not structural soft-body simulation.

`wreck-seams.ts` aligns narrow strips at the previously centroid-partitioned front-panel cuts before topology refinement. It removes the small triangular teeth that became conspicuous when a hood lifted. The original GLB files and photographs remain byte-identical; the runtime front cut strips move by at most about 5.6 cm. A collapsed strip can contain zero-area triangles. There is no runtime fracture remeshing.

`wreck-attachments.ts` records the original panel transforms and model-space bounds. Local hits progressively loosen complete assemblies: the hood and vent insert hinge together, bumper inserts hang with their bumper, and door glazing/handles/seals move with the door. The imported door names have reversed geometric sides; hinge selection uses actual bounds. Two original window seals are retained as independent meshes, adding two draws per car. Doors remain attached; bumpers, hoods and mirrors retain their shared release decisions and the existing 36-debris cap.

Nearby wheels gain bounded visual offset, toe and camber without changing the raycast suspension or tire collision. The pose is idempotent while paused. Repair restores the complete attachment transforms, panel buffers, wheel offsets, visibility and finish; quiet hit replay reproduces the same damage without new effects. Hinge motion is cosmetic and can intersect extreme dents or other bodywork. Broken parts continue to use simplified collision shapes.

## Finish and inspection

`wreck-finish.ts` composes the existing paint and lamp shaders. Model-rest coordinates anchor small primer/metal chips to damaged vertices. A per-car heat integral adds rough, dark engine-bay scorch that survives cooling. It does not alter health or spread to nearby vehicles. Lamp damage dims and fragments the already deforming lenses. Shared wheel hardware without wreck attributes does not receive engine-bay soot. Repair clears the soot; pause stops its accumulation.

The solo wreck camera selects front, rear, left, right or roof from accumulated impact damage, transforms the view with the car's heading and keeps it above a rolled car and the terrain. Manual orbit remains available during the five-second hold. Fire and audio continue, focus loss pauses the timer, and restart cancels it. This is a damage-directed view, without full scenery occlusion avoidance or replay footage.

## Verification and reproduction

Run `npm ci`, `npm run build` and the selected solo tests under `tests/`. New checks in `wreck-finish.test.ts` exercise the actual three car assets, hinge side and seal membership, wheel localization and paused idempotence, exact repair and quiet replay, rollover-safe view offsets, independent soot state and matching 30/60/144 Hz accumulation. Historical source fixtures are preserved through checksum-verified reconstruction recorded in `wreck-finish-revision.json`; those inverse helpers are only used for earlier-release assertions.

Browser checks use `tools/wreck-geometry-qa.mjs`, `vehicle-fire-qa.mjs`, `wreck-hold-qa.mjs`, `browser-qa.mjs`, `impact-qa.mjs` and `shadow-runtime-qa.mjs`. The thermal capture waits for actual heat/particle readiness because first-use shader compilation can delay simulation. Timing is measured separately with `performance-qa.mjs` and `fire-stress-qa.mjs`, one GPU workload at a time. See the leading section of `VALIDATION.md` for the final build and measured results.

All 23 deployed Worker source inputs remain unchanged. No internet multiplayer test or backend deployment is performed for this increment. Wreckfest 2 visual parity remains an unfinished goal.
