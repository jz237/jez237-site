# Performance pass — September 17, 2026

## Changes

- Glow 0 skips the selective-bloom scene render, blur pyramid, and composite. The main multisampled render and output color processing remain enabled. Raising Glow restores the original bloom pipeline.
- The 2,550,000-byte reference PNG loads only on the first Reference click, then remains available for subsequent views.
- Paused scenes skip effect updates after camera damping settles. Hidden documents skip animation/render work and reset their timing on return.
- Removed temporary individual neural-link geometries which were immediately discarded and replaced by the existing batched cinematic links.
- Rebuilt the offline-capable bundle and updated its cache key. No geometry detail, neural counts, auto-orbit timings, or manual orbit bounds were reduced.

## Measurements

Controlled local comparison: headless Chrome, 1280×800, reduced motion, cold browser cache, simulated 40 ms latency and 10 Mbps download, same camera and animation time. These are laboratory observations, not real-user or production-network guarantees.

| Measurement | Before | After |
| --- | ---: | ---: |
| Default-view draw calls | 3,002 | 1,564 |
| Median synchronous update/render submission, 40 samples | 4.6 ms | 2.5 ms |
| p95 synchronous update/render submission | 6.3 ms | 4.1 ms |
| Navigation-to-first-frame readiness check | 2.78 s | 2.20 s |
| Initial decoded JS + image payload | 3,186,514 bytes | 632,665 bytes |

Submission timings measure CPU work, not GPU completion or input latency. Startup checks include automation polling and vary between runs. The largest remaining startup cost is WebGL/shader initialization; the optimized run still recorded a roughly 1.25 s long task.

## Core Web Vitals audit

The initial unthrottled, cached live DevTools trace reported LCP 124 ms and CLS 0 (both good), TTFB 76 ms, and no CrUX field data. LCP reflects the page shell, not completion of the WebGL scene, so it is not used as the scene-loading benchmark. INP was not measured. No material cache savings were reported by that trace. Network inspection identified the hidden reference image as avoidable initial work. The accessibility snapshot showed named controls and the existing reduced-motion support.

## Verification

- Build succeeds; all six `node --test front-orbit.test.mjs` tests pass.
- Browser smoke tests preserve 4,800 interior nodes and 11,840 links, blinking signals, staged startup, pause stability, and mobile rendering; no JavaScript errors.
- Reference loads on demand; Glow can be raised and returned to zero without stale bloom.
- Baseline/optimized screenshots compared at identical camera/time: enabled-glow output effectively pixel-identical; zero-glow output visually consistent, with small rasterization/shadow differences from skipping the extra pass.
- Hidden-document rendering stops and resumes; automatic orbit is unchanged.

Further work, if needed, should profile geometry batching and shader compilation on a slower target device. Avoid lowering detail or resolution globally without visual approval.
