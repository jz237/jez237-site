# Demo, driving and vehicle fire

September 29, 2026. No new assets, audio generation, paid services or online-room tests.

## Watching

Choose **Watch Demo** on the main menu. The derby or circuit runs with eight AI cars, including the first car. Select the event, select a car or let the director choose, and switch among seven views: automatic director, overhead overview, follow drone, chase, hood, trackside and mouse-controlled free orbit. C cycles views, [ / ] changes the followed car, and Space pauses. Escape, settings, mute and fullscreen remain available. Losing focus pauses the event and clears input.

Derbies continue when the first car is destroyed. Events show an eight-second ending, then repeat. Circuit demos finish when all cars finish or retire, with a ten-minute limit. Demo results never overwrite local player records. Leaving the demo restores the regular player controls and the existing five-second wreck inspection.

`src/demo-director.ts` frames the interpolated car poses, limits camera positions against terrain height, and chooses active cars based on proximity to action and speed. The overview includes the arena or entire circuit. Trackside positions stay fixed while watching cars pass. Free orbit tracks the chosen car while allowing drag and scroll. This does not implement full line-of-sight collision against all scenery.

## Driving

`src/driving-brain.ts` gives each solo driver persistent target and recovery state. Derby targets are scored by distance, heading, side-on opportunity and damage, then retained for a committed approach. Drivers predict short-term target motion, turn back toward the arena before reaching the perimeter and disengage from slow shoving matches. Reverse escapes alternate their direction when clearances are tied, check space behind, and hold a forward escape steer before attacking again.

Circuit drivers follow the upcoming segment with speed-dependent lookahead, individual lane offsets and corner-aware braking. Nearby cars and disabled wrecks influence steering and speed. Four staggered Rapier rays check solid obstacles, excluding cars already handled by the car-avoidance logic. Existing rollover/off-track recovery and penalties remain. Vehicle forces, collision shapes, damage scoring, arrow-key mapping and the online server inputs are unchanged. These decisions are for solo and demo; online AI stays on the existing server implementation.

## Fire and explosions

`src/vehicle-fire-profile.ts` creates distinct per-car positions and rhythms. Front engine openings, left/right sill damage and rear leaks share a fixed emission budget; damage weights the active sources. Positions follow the car's full rotation, while released smoke rises in world space and is carried by changing wind. Particle aspect, density, initial temperature, lifetime and flame rhythm vary. The shader adds finer turbulent detail, tapered flame tongues and a world-up projection that remains sensible in overhead views. Old smoke keeps its birth temperature instead of changing instantly with its car.

`VehicleThermalState` makes one 10% eligibility draw per critical-damage episode. An eligible car must remain at 10% health or below and heat above 0.65 for a seeded 8–22 seconds before its single burst. Warming adds a short extra delay. A final impact does not automatically trigger a blast. Repair resets eligibility and clears thermal state. The burst combines expanding fire, smoke, sparks, a short local light flash and the existing positional ElevenLabs explosion/debris clips. Explosions are cosmetic: they do not add radial damage, change online authority or throw the chassis. They are dramatic effects, not a fluid or combustion simulation.

Pooled limits remain 640 fire/smoke puffs, two fire lights, 1,800 general particles, 36 loose parts and 18 one-shot audio voices. The 38 local ElevenLabs assets and their source records are unchanged; the browser makes no generation requests.

## Reproducing checks

Run the selected solo tests, `npm run build`, `tools/browser-qa.mjs`, `tools/demo-qa.mjs`, `tools/vehicle-fire-qa.mjs` and `tools/fire-stress-qa.mjs` against `node serve.mjs`. Use fresh output directories through each tool's environment variables. `QUARRY_DEMO_BENCHMARK=1` adds a two-minute 1440p Ultra demo capture; do not run another GPU task or rebuild concurrently.

The existing diagnostic object exposes seeded fire creation and bounded visual stepping solely to reproduce a rare burst without making normal gameplay explosions common. Unit tests sample 512 damage episodes, check delayed one-shot explosions across simulation rates, validate varied and rotated source positions, and verify pause/repair behavior. Historical source snapshots in `source/demo-revision.json` preserve the previous release's exact hashes; `tools/record-demo-revision.py` records this change without relaxing those earlier checks.
