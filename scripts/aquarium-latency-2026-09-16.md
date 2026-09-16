# Aquarium latency check — September 16, 2026

Installed Chrome DevTools MCP 1.9.0 and registered it in the local Codex MCP
configuration. It runs headless with an isolated profile, usage statistics off
and CrUX URL reporting off. Verified actual trace capture using the project's
official CLI; native MCP tools may require a new Codex session to appear.

The live baseline sustained 60 FPS on this computer (RTX 5090), with approximately
4–6 ms simulation, 2.7 ms rendering CPU and 6.4 ms GPU time. This is not a claim
about older hardware. One exploratory interaction trace reported 274 ms INP:
0.2 ms input queueing, 1 ms handler processing and 272 ms presentation delay.
The statistics overlay was present during that trace, so it is not a clean
benchmark of the underlying lesson buttons and does not establish a root cause.
A separate local candidate trace without that overlay measured 91 ms INP while
changing camera view, feeding and opening the learning guide, with CLS 0.00.
Different origins and overlay conditions mean these two INP values are not a
controlled before/after comparison.

Cold startup reported about 30 seconds and several transient texture load errors;
a cached reload was ready in 2.9 seconds without those errors. Those different
cache states and failed cold assets prevent treating this as a controlled
before/after optimization result. Detailed textures remain unchanged.

## Kept optimization

Plant collision sampling formerly bent each source vertex once for every
barycentric contact that referenced it. It now compiles the interpolation once,
bends each required source vertex once per leaf update, and omits zero-weight
vertices and unused normal calculations. Collision mesh resolution, plant motion
and sphere/triangle tests are unchanged. Caches retain the existing size limits.

A focused benchmark used 48 real botanical leaf variants, 600 updates per run,
warmup and six alternating before/after runs. Median processing time fell from
95.0 ms to 52.8 ms (44% for this sampling operation). This is not a 44% overall
FPS or interaction-latency improvement.

Validation covers exact sampled positions across all eight plant species,
multiple grid resolutions and times, 4,000 unchanged contact decisions, swimming
and crawling behavior, plus the full regression suite (216 tests). Regenerating
the Corydoras floor map produced identical routes and turns; only the source
checksum changed. All three published aquarium copies use one shared build.

Further latency work should reproduce presentation stalls without the statistics
overlay, measure resize/render-target allocation and first-use shader compilation,
and compare weaker GPUs separately. Avoid inferring GPU performance from CPU-only
throttling or sacrificing model/texture detail based on a device name.

## Follow-up: lesson interaction latency

Chrome DevTools MCP is now available directly. A cached production reload measured
1.103 s LCP, zero CLS and 2.62 s until aquarium readiness on the same RTX 5090
computer. Render-blocking resources had zero estimated savings; no loading asset
or texture quality changes were made in this pass.

Opening Below the gravel recorded 593 ms INP (161 ms processing, 432 ms
presentation). Repeated step changes rebuilt the entire specimen, including its
roots, gravel, procedural leaf maps and GPU resources. Six browser handler samples
ranged from 130.5 to 148.8 ms. The lesson now retains its specimen, lights, labels
and animation while replacing only the transport arrows as required. Leaving the
lesson still releases all owned resources; there is no accumulating specimen cache.

Six candidate browser handler samples ranged from 0.6 to 1.0 ms. A candidate step
interaction trace measured 46 ms INP and zero CLS. The first-opening trace and
step-change trace are different interactions, so 593-to-46 is not a controlled
before/after comparison. A focused CPU comparison alternated six warmed runs of
the same six step changes: median 677.9 ms before and 0.258 ms after. This measures
scene construction only, not whole-frame rendering or overall FPS.

Isolated specimens also ran two scene passes and made a full HDR refraction copy
with mipmaps despite hiding the glass. SceneRefraction now uses the normal single
pass when its visible material set contains no managed transmission material.
The live tank retains its exact existing refraction path, including mirrors and
the magnifier. Visibility is reevaluated every frame, so returning to the tank
restores refraction immediately.

Validation: all 218 tests pass; resource-identity/disposal tests cover lesson
steps, repeat selection, exit/reentry and arrow animation. Render tests cover
hidden parent groups, hidden glass materials, multiple cameras and restoration.
Browser checks cover root steps, magnification, living close-ups, return to the
tank and feeding (12 flakes plus six sinking pellets). Visual checks retain the
cutaway detail and tank glass. Both changes preserve animal simulation, geometry,
texture resolution and effect quality. These are targeted interaction and close-up
improvements; no broad FPS increase or first-opening latency fix is claimed.


## Follow-up: full-detail CPU and rendering pass

Six optimizations retain the same geometry, textures, effects settings, collision
resolution and animal behavior. Focused warmed comparisons (not total FPS gains):

| Operation | Before | After | Scope |
| --- | --- | --- | --- |
| Angelfish/Cory hardscape candidate checks | ~259 ms | ~11 ms | 5,000 body poses against all 310 actual obstacles; identical 1,505 hits |
| Tetra school render | ~52.6 ms | ~44.4 ms | 120 renders of 16 fish; eight alternating runs; original shader versus shared materials |
| Leaf contact sampling | 50.97 ms | 26.52 ms | 48 actual variants, 600 updates; exact contact coordinates |
| Three procedural leaf map sets | ~137 ms | ~92.7 ms | Six runs, median; unchanged pixel bytes and vein drawing commands |
| Fit leaf blades inside glass | ~152 ms | ~48.3 ms | 15,000 placements; original vertex test still handles boundary cases |
| Hardscape contact resolution | ~42.2 ms | ~21.6 ms | 11,860 poses including centers and tangencies; exact final positions |

The school shares three PBR materials, while independent breath attributes keep
each fish's gill shading. Body/fin deformation and normal updates are unchanged;
isolated living close-ups retain separate materials and lighting. A framebuffer
comparison against the original pre-change Tetra3D produced zero differing
channels at 960 x 540. This was an isolated school test, not proof that every
possible full-scene transparent overlap is pixel-identical.

CPU improvements use conservative bounds to reject impossible contacts and reuse
identical cross-section/row calculations. They do not reduce sample resolution,
mesh tessellation, collision checks for potential contacts or simulation cadence.
Geometry-version invalidation and live transform tests cover the sampler cache.

The actual botanical build matched all 36,438 instances and 391 attribute arrays
across 50 scene objects, including matrices and indices. Lighting input geometry
and leaf-map output are identical, so the existing irradiance binary remains
unchanged; only source provenance hashes were refreshed (no new light bake).
Regenerating Corydoras navigation returned the same 231 nodes and 14,918 turns.
The source dependency list now also covers TankSpace and BodyObstacles.

Production builds were served side by side on localhost, with Always full effects,
a 1280 x 591 drawing buffer, a 1280 x 720 viewport, 4x Chrome CPU throttling and
no statistics overlay. Two alternating baseline runs measured 29.2 and 28.2 FPS;
two candidate runs measured 36.8 and 31.7 FPS over 359 frame intervals each.
Median frame intervals remained 33.3 ms and p95 stayed about 50 ms, so this is
higher average throughput, not elimination of choppy tail frames. Readiness was
8.51/8.84 seconds before and 7.56/8.16 seconds after; these are local observations,
not cold-network loading metrics. Runs include natural simulation variation;
the first baseline settled for five seconds and later runs for ten seconds.
The final build changes only the equivalent invalid-coordinate guard thereafter.

Raw traces were checked against their actual sampled localhost bundle URLs;
DevTools' non-navigation summary retained a stale earlier URL. No navigation
speed or GPU timing claim is derived from that summary. CPU throttling does not
emulate the user's Radeon R9 or Samsung GPU. The normal-speed local run reaches
the 60 Hz display limit and cannot measure uncapped FPS improvement.

Validation: 224 tests pass, TypeScript and production build pass, all three
built copies pass the 83-asset sync check, and Hidden Reef's 38-page link check
passes. Browser checks cover the full tank, feeding (12 flakes and six sinking
pellets), tetra close-up, magnifier and return to tank with no console errors.

Remaining trace cost is mainly renderer/material uniform work plus exact fish
pose and contact updates. Further substantial GPU work would require a broader
renderer/instancing change with careful transparent ordering and deformation
validation. No speculative quality reduction or visible-detail tradeoff is
included. These measurements exhaust the substantial, verified low-risk wins
identified in this pass; they do not establish that no future optimization exists.
