# Loading and frame pacing — September 29, 2026

This pass preserves the authored model geometry, photographic image bytes, fixed-step driving, damage field and online simulation. It changes how the browser loads assets and schedules client work. Measurements and limitations are recorded at the top of `VALIDATION.md`.

## Loading

- Independent car, scenery and forest downloads start concurrently. Construction and shared-material processing retain their original order.
- `renderer.compileAsync()` submits material programs together. It uses the same offscreen target as the compositor. New cars receive static-shadow bindings before their shaders are warmed, avoiding shader compilation stalls immediately after pressing Start.
- The HTML displays loading feedback before the application bundle finishes parsing. Event preparation displays its own loader; focus loss during preparation pauses the ready event.
- The existing 38 local ElevenLabs clips are prefetched with four concurrent requests. They decode once into the actual output AudioContext after a user gesture. Compressed audio bytes are released after decoding. No new sound generation or service request is involved.

## Lossless model transport

`python tools/pack-models.py` reads the 21 original GLBs, extracts embedded images without recompressing them, shares identical image files, and gzip-compresses the remaining model data. Buffer-view contents, nodes, materials and texture image hashes are checked by `tests/performance.test.ts`. Geometry simplification and texture downsampling are not part of this pass.

`source/model-packing.json` records source, transport and image SHA-256 checksums. `src/packed-models.json` maps the original names to content-hashed downloads under `public/models/packed/`. The loader uses the original Three.js parser and Draco decoder. Original GLBs remain available for a missing packed-file response or a browser lacking DecompressionStream. Other pre-existing compressed terrain masks retain their existing browser requirements.

The repository and static build contain both transports; this increases storage, while supported browsers download only the smaller transport. Changing an original model requires rerunning the packer and rebuilding the application. Keep the original source/license records. Serve `.glb.gz` as a binary file without an HTTP Content-Encoding header: the application handles this explicit gzip stream itself.

## Rendering and impacts

Static scenery world matrices are calculated once. Per-frame transforms remain enabled for cars, loose props, cameras and other dynamic objects. LOD visibility and foliage shader uniforms continue updating.

Impact deformation rejects only panel bounding boxes wholly outside the impact radius before iterating vertices. The bounds update after deformation and repair. Tests compare the result against the previous implementation through transformed, repeated and repaired impacts, including exact vertex-array equality.

## Reproduction

- `npm run build`
- Selected solo TypeScript tests, excluding `tests/network*.test.ts` as requested.
- `tools/loading-comparison-qa.mjs`: three alternating fresh Chrome launches per build. Local unthrottled delivery; no profiler in the cold-load interval. Needs the prior release served on port 8796 and the current build on 8795.
- `tools/performance-pass-qa.mjs`: isolated 2560 × 1440 Ultra real-time derby and eight-fire captures. Set a fresh `QUARRY_PERF_OUTPUT` and `QUARRY_PERF_SECONDS=60`.
- `tools/loading-lifecycle-qa.mjs`: focus loss while preparing an event, resume/demo controls and original-model fallback. Set a fresh `QUARRY_LOADING_OUTPUT`.
- Existing gameplay, spectator, fire/audio and shadow/context-restoration browser checks remain applicable. Do not run GPU benchmarks concurrently with these checks or builds.

Preserved pre-change source snapshots and `source/performance-revision.json` maintain the earlier release's checksum-tested regression history. Private raw reports and profiles remain under `outputs/performance-pass/`; no credentials or profiles are included in the public build. These measurements do not establish network multiplayer ping, hardware input-to-photon latency, long-term memory stability or locked 60 FPS.
