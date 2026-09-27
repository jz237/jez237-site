# Validation — September 27, 2026

## Build and functional checks

- TypeScript and production build: pass. The output is a self-contained static build; the game server binds to 127.0.0.1:8795.
- Five automated rules/physics tests: pass. The actual vehicle class accelerates and brakes to matching positions at 30, 60 and 144 render FPS, using the same 60 Hz physics steps.
- Chrome integration suite: pass, no page errors or failed asset requests. It covers loading all 35 sound files, acceleration, braking, steering, localized damage, detached parts, broken glass, full repair, inspection, pause/resume, a full three-lap race, derby timeout, player elimination, last-car victory, and six repeated restarts.
- The scripted race completed 72 ordered checkpoints and reached the finish with a functioning car. The rules test separately rejects missed/incorrect checkpoints and validates timeout ranking.
- Visual inspection covered the menu, driving, a multi-car derby and a damaged car with missing panels and glass. Screenshots are in `outputs/`.
- Runtime files were checked for embedded ElevenLabs API credentials/endpoints; none were found. HTTP checks passed for HTML, GLB, OGG and HDR assets. All 19 texture/HDR provenance hashes matched.

## Ten-minute 1440p run

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
