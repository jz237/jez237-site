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
