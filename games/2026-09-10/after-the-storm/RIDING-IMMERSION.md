# Riding and water immersion - v2.3.0

Developed in the separate coastal worktree. The game-only release is rebased onto current main before publication to preserve concurrent aquarium and site work.

## Delivered systems

1. Airborne rider weight shifts supply a bounded pitch moment without artificial lift. Bow-first, stern-first, and sideways entries are classified relative to the local water slope. Clearly angled entries lose different amounts of momentum and produce bounded yaw/pitch responses; Absorb reduces severity. Level entries keep the established pressure response. Low-speed waterjet steering remains available while pressing against a wall.
2. Up to six shallow-water breakers develop an actual curved lip, overturn, and collapse into whitewater. Detection uses elevated, curved, rising sections of the shared waves. Bases follow the local surface; shading uses translucent water, fine normal detail, ragged foam and shared cloud light.
3. Rival jet spray has a pooled, moving ballistic footprint. Riding through it raises exposure, ducks/braces the rider, and wets the lens briefly. Sources do not hit their own rider. The model expires packets, preserves independent rider exposure, and freezes on pause. It does not impose an arbitrary speed penalty.
4. Coastal shelves sit on the seabed, clear of the navigable hull layer. Dock materials have algae bands, wet roughness and irregular salt/tide marks. Marine pilings carry instanced shells attached to their actual radius and vertical extent; freshwater venues omit barnacles. Small localized reflected wavelets near suitable quay/wall segments are shared by GPU displacement and CPU buoyancy.
5. Bounded procedural sound layers add hull slaps from pressure changes, mechanical rattle from motion/load, and water draining after a measured landing. Actual rider-head/camera immersion smoothly muffles the mix. Existing local engine/music recordings remain. Audio starts only after the existing user gesture and obeys sound/pause controls.
6. Refraction targets use 64%, 46%, or 36% of the prior pixel count at High/Medium/Low. Shadow maps update every second High frame or third Medium frame; Low still disables them. Runoff reuses its accumulation array and removes per-cell tuple allocation. A local 3,000-step solver benchmark improved from 107.8 ms to 52.2 ms. This microbenchmark is not an overall FPS claim. Breaker meshes/packets/shells/shelves are bounded and batched; breaker wave sampling is shared across ribbon rows.

## Controls

Q: bow up in flight. E: bow down. B: absorb/brace. Phone users have Bow up/Bow down under Stunts and Absorb beside Brake/GO. Existing steering, throttle, race/demo and restart controls remain.

## Verification

Run node --test tests/*.test.mjs. New tests cover airborne trim without lift, distinct entry losses/kicks, real falling-hull contact and settling, moving/expiring/self-excluding spray and rider exposure, curl overturn/collapse, localized reflected waves and course reset, sound envelopes/submersion, render budgets, and submerged/attached waterline geometry. Existing course, championship, demo, jump, failure/restart, mobile, articulation and pause tests remain.

Release validation: all 340 tests passed, with no skips. Changed modules passed Node syntax checks and the diff passed whitespace checks. Browser checks covered the active curling lip and foam, dock waterlines, a jump and landing, mobile landscape demo controls, pause/resume, and a complete three-lap race with all 42 checkpoints and zero misses. No new browser errors occurred after the lens-spray fix. Live desktop High-quality frame intervals were about 17 ms; this is a spot observation, not a physical-phone benchmark.

Race guidance now recovers an overshot city entrance before committing to its long jump lane. A relative approach point settles racers before the southern ice-coast buoy. These adjust ordinary throttle/steering targets only; they do not award checkpoints or change the course layout.

Review pages use real game modules: source/immersion-review.html includes Breaking surf and Inspect next breaker; source/finishing-review.html includes Port waterline. race.html?verify=1 reports live entry types, exposure, breaker counts, audio mix and refraction dimensions.

## Limits

Curling lips are bounded visual meshes over the shared navigable height field; this is not an overturning volumetric fluid solver. Spray contact uses coarse ballistic volumes, and lens wetness is a translucent overlay. Shelves and tiny shell growth are scenery, not new collision hazards. Reflected wall waves are a damped analytic approximation. New mechanical/water sounds are procedural. Physical-phone performance and headset-specific spatial audio have not been measured. No Wave Race feature-parity claim or purchases.
