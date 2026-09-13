# Mobile rendering update — 2026-09-13

The user reports about 1 FPS on Galaxy S25 Ultra while desktop computers are smooth. Browser clarification was requested; no answer yet. Preserve scene detail and animal behavior; no paid services.

## Change

SceneRefraction reuses resolved opaque HDR color for physical glass in each view instead of Three's additional opaque scene render. ReflectionPool.prepare finishes visible mirror captures before the main view, avoiding nested framebuffer interruptions. Models, shader deformation, textures, capture dimensions, shadow map sizes and animation rates are retained.

The optimized renderer is enabled by default. Append `?renderer=previous` to use the previous renderer for comparison without a deployment.

## Verification and authorization

Baseline on the desktop in-app browser at a 1920 x 1080 drawing buffer, front view: median GPU 13.34 ms, GPU p95 14.1 ms, frame median 16.7 ms, 1,981 draw calls and 102,687,297 triangles across all passes. These are NOT Galaxy measurements or measurements of the new renderer.

The production build and all 102 automated tests passed. The final rendering path could not be visually or GPU verified because browser automation stopped responding. The user explicitly requested publication anyway so they can inspect it, and authorized restoration if the result is unacceptable. No device speedup has been verified.

## Rollback

Previous aquarium source commit: `1f320a8c7a6363ccd5f172875d1c7b8580eb6e6b`.
Previous public JS: `demos/rotatable-aquascape/assets/index-CV6aM9gY.js`.
Previous public CSS: `demos/rotatable-aquascape/assets/index-Ha15YhvB.css`.
Both assets remain in the repository and deployment. Current pre-publication site HEAD is `45253f8c0` and includes unrelated updates that must be preserved.

To restore the actual live aquarium, revert only this mobile-rendering publication commit and deploy current main through the guarded snapshot process. Do not reset the entire website to an older commit. For an immediate user-side comparison use `?renderer=previous`.


## Follow-up: actual phone report and opt-in measurements

The user reports that ca69772f0 improved the Galaxy S25 Ultra from roughly 1 FPS to roughly 10 FPS; it remains choppy. This is the user's device observation, not our own phone measurement.

This follow-up stops recomposing the existing meshes' fixed local matrices each frame. Moving fish parent groups, per-vertex body/fin deformation, per-instance shrimp/cory poses, plant shaders, all geometry and textures, full-resolution shadows/reflections, and their refresh rates remain unchanged. Layer lessons explicitly refresh transforms as they separate or restore the planting and substrate. Food and new lesson objects keep their usual automatic transforms. `originalTransforms=1` bypasses this change for comparison.

`stats=1` adds a local-only panel showing three-second FPS and CPU windows, nonblocking GPU query timing when supported, drawing-buffer dimensions and the build label. Measurements are copied only when the viewer clicks the Copy measurements button. The ordinary production URL does not enable timing queries or the panel. Leave the tank running for 30 seconds before copying its measurements. No telemetry is sent.

Rejected experiments: spatial plant grouping increased draw calls from about 1,451 to 4,383 and render CPU median from 4.3 to 9.9 ms while saving only about 2% of triangles. A shared GPU wave table increased desktop GPU time from about 8.2 to 9.7 ms. Neither experiment is included. We have not established an additional Galaxy speedup; the phone readout is needed to distinguish simulation cost, graphics-driver stalls and GPU time.

Validation: production build passed; full 103-test suite passed, followed by the five affected transform/teaching tests after finalizing explicit static transforms. The layer test now verifies world matrices during separation and restoration. Browser preview renders the tank and readout without console errors. A desktop viewport check cannot substitute for the real S25 GPU.

The immediate rollback point for this follow-up is ca69772f0763e3228c8cbed19adc71e4431d2cf6. Keep its public index-CdKo1KIA.js asset. Revert only the follow-up commit and redeploy current main if needed.


## Follow-up: plant-contact CPU optimization

Phone report for b9df72312: 12.8 FPS, median frame 83.2 ms, simulation 33.3 ms, rendering CPU/driver 7.7 ms, GPU timing unavailable, buffer 633 x 1145. These measurements do not isolate GPU time; simulation nevertheless consumes a substantial part of the frame.

A Node CPU profile of the existing full-plant animal test found approximately 15.2 s in Box3.distanceToPoint and 14.9 s in Triangle.closestPointToPoint. CollisionBounds now performs conservative squared sphere/AABB rejection before the unchanged exact contact tests. Candidate lists are cached by the full spatial-cell range, with a bounded 384-entry cache for each index. The moving-leaf contact cache reuses vectors, triangles and bounds, refreshing them at the exact requested water time; it is bounded to 512 leaves. Static conservative Corydoras contact envelopes retain their existing geometry and margins. No collision sampling interval, triangle, body sphere, rendering detail or behavioral update has been removed.

Two new tests compare bounding rejection against 16,000 exact triangle contacts and cached spatial membership against the original cell traversal, including cell boundaries and eviction. The full 105-test suite passed in 17.4 s (previous full suite approximately 48.1 s). The long Corydoras/full-plant trajectory test fell from approximately 40.8 s to 12.5 s; the independent grazer trajectory test fell from approximately 6.9 s to 4.6 s. These are desktop automated-test timings, not a forecast of phone FPS.

Navigation was rebuilt from the changed collision sources, including the new helper in its source manifest. All 231 nodes and 14,918 cached turn results exactly match the previous navigation data. Only source hashes changed.

The opt-in phone panel now splits simulation into tetras, bottom feeders, and shrimp/snails so the next phone measurement can identify remaining CPU work. GPU remains explicitly unavailable on devices without the timing extension. The preceding b9df72312 commit and index-DtUhCXRL.js remain the rollback point.
