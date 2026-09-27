# Validation — September 27, 2026

## Visual and multiplayer revision — current checks

- TypeScript production build and sixteen frontend unit tests pass. Latest visual build is `index-BbVpi3Xv.js`.
- Actual keyboard events prove reversed arrow steering (Left=+1, Right=-1), with A/D unchanged.
- Final offline browser suite: all 72 ordered checkpoints over three laps, FINISH LINE, 100% player condition; derby timeout/elimination/victory and six restarts passed. All 35 audio files loaded. No browser errors.
- Two independent local browser clients passed eight online checks: create/join/invite, both drivers moving, pause/blur clearing input, token/seat/damage restoration on rejoin, host succession and full-room feedback. Historical replay restored 22 impacts/seven detached panels without replay debris. No console or page errors.
- All fifteen backend tests and server typechecking pass, including shared browser/server collider parity, authoritative barrels, race corridor clearance, admission limits, fixed lifetime and asynchronous persistence races.
- The deployed Free-account service passed HTTPS health and a two-client authority smoke test: shared transforms/props, driving, reconnect, spoof rejection and origin rejection. A silent client received a timeout Close frame and completed TCP closure within the ten-second server deadline.
- Two Chrome contexts connected to that real internet service and passed all eight browser integration checks with zero console/page errors. Observed HUD ping samples were 13 ms and 39 ms. Rejoin restored 40 historical impacts and three detached panels without replay debris. Report: `outputs/multiplayer/production/browser-qa.json`. This used the local frontend; verification of the published site's CSP and invitation path is a separate release check.
- Seven 1440p inspection images and a focused puddle view were reviewed. Scanned firs retain near foliage; car body shading and broken parts are improved. Remaining visual gaps include broad cliff bands, repeated distant tree silhouettes and a uniform quarry floor. This is not Wreckfest 2 visual parity.
- The upgraded build completed a fresh 610-second RTX 5090 run; current measurements are below. The older prototype results are historical only.
- Internet multiplayer was published on the verified dedicated **Quarry Impact Free** account. Worker version: `f52a9566-f53e-4fd0-b571-afc83155456a`. No paid plan was enabled; daily Free limits apply.

## Upgraded build: sustained 1440p Ultra performance

Measured in Chrome ANGLE / Direct3D 11 on the actual **NVIDIA GeForce RTX 5090**, **2560 × 1440**, **Ultra**, over **610 seconds** and **five derby sessions** with eight cars at each start. No concurrent agent browser QA was run. The desktop and its existing tabs remained open.

- Full-session frame capture: **33,039 frames**, **18.52 ms mean / 54.0 FPS average**. Frame times include long stalls and rematches, after an eight-second warm-up.
- **Median 16.7 ms; 95th percentile 22.0 ms; 99th percentile 50.3 ms.** 1,015 frames (3.07%) exceeded 33.34 ms. This does not meet a locked 60 FPS target during heavy crashes/rematches.
- Texture count remained **121**; geometry count stayed between **649 and 666**. JavaScript heap varied between **166.3 and 272.6 MB**, starting at 182.5 MB and ending at 174.8 MB in the ten-second samples. No sustained resource growth was observed over this test; heap is not total browser/GPU memory.
- No browser errors; bounded particles/debris and vehicle sound loops remained active through repeated events.
- A separate **90-second High** check at a 1440p viewport (85% internal resolution) averaged **58.0 FPS**, with **16.9 ms p95 / 33.3 ms p99**, and no errors. This shorter run is not an equivalent ten-minute stability measurement. Report: `outputs/benchmark-upgrade-high-1440p.json`.
- Report: `outputs/benchmark-upgrade-1440p.json`. The runtime build tested was `index-Bo7zAP4i.js`; subsequent changes corrected cliff UVs, updated documentation/endpoint configuration and removed an unused unreferenced texture. The UV correction preserved exact hashes of vertex positions, indices, colors and normals; the matched view retained 308 draws, 3,960,254 triangles and 121 textures, with no new passes or materials. Frame-time statistics above are from the pre-UV build rather than a repeated ten-minute measurement.

## Initial prototype build and functional checks

- TypeScript and production build: pass. The output is a self-contained static build; the game server binds to 127.0.0.1:8795.
- Five automated rules/physics tests: pass. The actual vehicle class accelerates and brakes to matching positions at 30, 60 and 144 render FPS, using the same 60 Hz physics steps.
- Chrome integration suite: pass, no page errors or failed asset requests. It covers loading all 35 sound files, acceleration, braking, steering, localized damage, detached parts, broken glass, full repair, inspection, pause/resume, a full three-lap race, derby timeout, player elimination, last-car victory, and six repeated restarts.
- The scripted race completed 72 ordered checkpoints and reached the finish with a functioning car. The rules test separately rejects missed/incorrect checkpoints and validates timeout ranking.
- Visual inspection covered the menu, driving, a multi-car derby and a damaged car with missing panels and glass. Screenshots are in `outputs/`.
- Runtime files were checked for embedded ElevenLabs API credentials/endpoints; none were found. HTTP checks passed for HTML, GLB, OGG and HDR assets. All 19 texture/HDR provenance hashes matched.

## Initial prototype performance (superseded for the upgraded build)

Measured on the actual **NVIDIA GeForce RTX 5090**, Chrome ANGLE / Direct3D 11, **2560 × 1440**, **Ultra**, over **610 seconds** and **seven automatically restarted derby sessions**.

- Mean of 61 ten-second FPS samples: **58.4 FPS**.
- Sample range: **52.5–60.0 FPS**. This is not a claim of a locked 60 FPS or a full-session frame-time percentile.
- Graphics geometries: **850–863**; textures: **98** throughout the sampled active run. Counts returned to the same range across rematches rather than growing continuously.
- Reported JavaScript heap: approximately **86–165 MB**, rising and falling with garbage collection. This is not a measurement of total browser/GPU memory.
- No browser errors were reported during the run. Crash effects, vehicle loops and debris remained bounded.
- Raw measurements: `outputs/benchmark-1440p.json`. Samples taken after the bounded test ended were excluded. The final follow-up edits added the credits link, restored glass opacity consistently on repair, and improved a QA-only camera helper; the final build then passed the browser suite again.

The 60 FPS target is approached but not held through every pileup/rematch. High and Medium presets provide lower-cost options. Performance on other hardware has not been measured.

## Audio verification

- **35 / 35** generated OGG files decoded successfully, totaling **135.36 seconds** of source material before looping.
- No silent or non-finite files; no decoded mono samples reached clipping. Loop endpoint discontinuities were measured and were small after short edge fades.
- Runtime decoding, car loop creation/cleanup, positional routing, volume controls and pause/resume are integrated. Automated analysis is not a substitute for a listener's subjective mix review.
- Provenance: `public/audio/manifest.json`; numerical report: `outputs/audio-qa.json`; original exports and quota records: `source/audio/`.
- Generation reduced the included quota by **1,274 credits**; overage billing was disabled. No additional purchases were made.

## Practical limits

Damage uses rigid-body physics with localized mesh deformation and simplified collision-shape changes. The three car bodies are dimensioned variants of a shared licensed concept design. Distant foliage uses photographic cards; close foliage adds geometry. These choices make a detailed browser game feasible; they do not reproduce a native AAA structural crash engine.

Keyboard and automated controller-independent driving were exercised. Standard gamepad mappings are implemented, but no physical gamepad was connected for this validation. Rapier emits an upstream initialization deprecation warning; it did not prevent execution.
