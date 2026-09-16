# Loading and responsiveness — v2.14.0

Both desktop browsers and phones use the same optimization paths. No graphics
preset, texture resolution, mesh detail, water shader, particle budget, reflection
quality, physics step or animation rate was reduced.

## Exact-asset storage

Photographic textures and model data now use a content-versioned Cache Storage
path. The first visit stores the original response bytes; later visits reuse
those bytes without requesting each large asset again. The existing image decoder,
texture settings and lossless model decompression are unchanged. Changed content
gets a new hash; obsolete entries are pruned only from this game's asset cache.
Storage denial, quota errors and missing browser support fall back to the network.
This is not a service worker, an offline game, or a cache of saves/HTML pages.

## Background terrain preparation

A module worker prepares the initial coast while models and textures load, then
prepares the next coast during racing/demo play. It produces the exact original
360-segment terrain heights and 512-square 16-bit water-depth map. Transferable
buffers avoid copying the results back. At most two prepared coast datasets
(about 3 MiB total) are retained. Unprepared courses and unavailable workers use
the original synchronous calculation. Collision and wave physics still use the
original functions; the worker never approximates terrain.

Worker dependencies have a shared content revision because worker modules do not
inherit page import maps. Run `node source/version-assets.mjs` after source or
asset changes to regenerate the asset identities, worker graph and HTML imports.

## Verification and measurements

72 targeted tests passed: exact terrain/depth byte equivalence across all nine
venues at Normal, Expert and Reverse classes; authored stunt height identity;
bounded worker cache/fallback; exact cached response bytes; changed-hash refresh;
storage denial and failed downloads; previous lossless loading, graphics budgets,
scenery placement, touch controls, demo, hull/water interactions and split screen.

Local Chromium observations on the same desktop:
- Repeat race load: 28 asset cache hits, zero asset network requests.
- Recorded resource-body bytes: 29.1 MB on initial storage fill, 2.82 MB on repeat.
  This is encodedBodySize telemetry, not a cellular transfer benchmark; HTTP cache
  and browser policies also influence actual network transfer.
- Background coast sampling took about 102–232 ms in observed runs, off the UI thread.
- Same-course restart: 5.3 ms total, 0.3 ms scenery reset, world reused.
- High graphics desktop demo: frame p95 16.8 ms, CPU p95 14 ms in the sampled window.
- High graphics 390 x 780 demo: frame p95 33.3 ms, CPU p95 22 ms in the sampled window.

Phone-size checks used a desktop viewport, not a physical-phone benchmark. Neither
FPS nor first-frame improvements are claimed: local startup varied with GPU work.
An experimental shader warmup was removed because it added loading latency.

Browser checks covered High graphics desktop and phone-size demos, Sunny Beach to
Sunset Bay transitions, demo takeover, pause and same-course restart, and salvage
startup. No browser errors or missing assets were observed. The first rendered
frame still performs GPU shader compilation/upload work.
