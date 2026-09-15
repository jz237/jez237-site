# Immersion update — v2.8.0

- Riders stand progressively over measured chop, shift their hips farther through turns, and drop the inside shoulder. Existing IK keeps boots and hands attached; anticipation and landing crouches remain physical-signal driven.
- Fixed rocks and submerged dock supports scatter incoming swells into the existing local wave solver in Big Surf. The resulting bounded displacement is shared by rendering and buoyancy. Surface-following, broken foam ribbons curl around these obstacles in every sea state.
- Sideways Big Surf landings retain a brief lateral slide as grip reattaches, triggered by actual lateral velocity. Clean, moderate entries keep immediate grip and lose less speed. Recovery cannot add velocity; existing impact loss and directional spray remain in use.
- Nine distant, sloped landforms create three atmospheric layers, with irregular scattered tree clusters nearest the cove. These are scenery beyond the playable terrain, not additional courses.
- Demo framing widens smoothly around nearby rivals and anticipates upward flight. Existing turn-rate limits, water-relative height, steady horizon and terrain camera protection remain.
- Shore wash reuses forcing buffers and cached terrain heights. Craft LOD keeps an invalidated mesh list instead of traversing every rider hierarchy every frame. Static support collision geometry is cached. Foam budgets scale with quality; existing adaptive settings continue reducing nearby scenery before water quality.

## Limits

Obstacle flow is a bounded local wave approximation, with procedural foam advection rather than a full 3D fluid/vorticity solver. Scenery is procedural geometry. New landing grip and incident-swell scattering apply to Big Surf; authored venue handling stays unchanged. Mobile layouts are checked in desktop CSS viewports, not on physical phone hardware.

## Verification

New tests cover rider anchor stability and pause, gradual landing grip, jump/competitor framing, bounded solid-boundary surge, and no energy from flat water. Existing race, championship, demo, water, replay and model tests are also run. Browser checks cover a complete race, demo presentation, restart, replay and phone layouts.

Validated: the full 374-test regression run identified two Big Surf handling regressions; after correction, all 62 affected tests passed, including the entire demo tour. New rider/camera/LOD checks also passed. Browser race: 3:14.900, 42 buoys, zero misses, 24 water landings; replay returned unchanged and restart reached lap one. High/Low shaders compiled without browser errors. Both phone CSS orientations were inspected. Background browser throttling prevents a reliable hardware frame-rate comparison.
