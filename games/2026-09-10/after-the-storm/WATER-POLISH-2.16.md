# Water and riding polish — v2.16.0

September 19, 2026. Implements the approved first three recommendations: wave
readability, hull/water contact cues and speed presentation.

## Changes

- Wave-face lighting uses the broad surface normal and preserves reflected sky
  radiance. Turquoise transmission follows sloped, lit faces. Fine ripples remain,
  with less normal variance on steep faces and filtering of unresolved detail.
- Spilling crest foam retains a readable lip beyond the near-field lace.
- Carving spray uses actual yaw rate, speed, lateral slip and each wet chine.
  The outside sheet spreads farther and retains more hull momentum. Airborne
  hulls stop emitting sheets; previously emitted water continues ballistically.
- Rider weight transfer follows lateral acceleration and relaxes in the air.
  Grips, planted feet, physical hull forces and animated trick poses are retained.
- Landing audio has a single entry-triggered slap and a decaying drain, with no
  repeated attack from an impact value held over several simulation frames.
- A shared 58–70 degree speed lens progressively opens between 3 and 48 m/s in
  solo play, demo and both split-screen views. The chase camera eases lower and
  looks farther ahead, retaining selected zoom and a stable horizon.

Wave displacement, buoyancy, controls, top speed, AI, geometry counts, textures,
reflection/refraction resolution, quality presets and particle budgets are unchanged.
This is a presentation refinement, not a fluid-simulation replacement.

## Validation

62 focused Node tests pass, covering new contact cues, camera continuity, rider
animation, spray, shared water interaction, replay, hydrodynamics, speed,
graphics budgets, controls, sound and prior latency optimizations.

Browser checks: High-quality desktop and portrait demos, mobile demo takeover
and auto throttle, pause/resume/replay, independent split-screen controls and
cameras, plus verification-driven jump and landing.
The jump fixture reached 6.55 m hull clearance at 99 km/h with zero wet contact.
No game JavaScript or shader errors; the existing favicon request returns 404.

## Performance comparison

Local Chrome, High quality, one sequential before/after pair per viewport,
24-second Sunny Beach demo runs. Last 600 active frames, warm asset cache.
The baseline serves the unmodified v2.15 modules. Random seed fixed; effects
and frame scheduling still vary, so these are regression checks rather than
statistically established speed gains.

| Viewport | Mean frame interval before / after | Mean CPU before / after |
| --- | --- | --- |
| Desktop 1280 × 720 | 18.835 / 18.224 ms | 18.406 / 17.731 ms |
| Phone layout 390 × 780 | 16.890 / 16.807 ms | 15.480 / 15.264 ms |

No regression observed in these runs. Phone layout was emulated on the desktop
GPU; this is not a physical-phone thermal, GPU or input-to-photon benchmark.

Rival personality changes, venue scenic stretches and ghost racing were outside
this approved first-three-items pass.
