# Saltmarsh port scenery

Local scenery release, not published. Replaces primitive container/crane blocks with a cargo ship and shaped hull, open-frame dock cranes, ribbed container stacks, fuel tanks, quay bollards, warehouse, spectators and service paddock. Northern terrain meets the animated sea. Shared geometry/material batches limit draw submissions; existing course collision records and racing routes stay unchanged.

Validation: 15 focused tests passed (port/farm/coast/forest scenery, global score logic, predecessor preservation and successor restoration). Production build passed; existing unresolved Montserrat reference and large bundle warnings remain. All 2115 prior fixture files preserved. The new fixture leaf records eight changed/new inputs and protects 3322 inputs including scoring service source.

Browser gameplay on Evo X2: normal-input 8-car player race and 24-car demo completed, replay/retry/settings-reset checks passed. Every demo car reached 24 checkpoints. Across both runs 411 damage marks, zero missed damage events, zero game errors. Preferences restored. Raw local evidence: work/port-scenery/gameplay.json. Waterfront preview: ../../outputs/port-scenery-preview.png. This is a recognizable procedural scenery improvement, not a claim of Wreckfest 2 visual or feature parity.

Publication remains pending: site checkout divergence documented in FARM_SCENERY_VALIDATION.md; scoring service authorization documented in GLOBAL_SCORING_VALIDATION.md. No new full-site copy, cloud service or deployment created in this change. Preserve committed fixture leaves; future changes need a successor.
