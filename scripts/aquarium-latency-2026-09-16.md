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
