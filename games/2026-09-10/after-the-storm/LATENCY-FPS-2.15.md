# Runtime optimization — v2.15.0

Graphics presets, textures, geometry, water shaders, particle counts, reflections,
shadow cadence and the 60 Hz handling/physics model are unchanged.

## Changes

- Poll gamepads once per animation frame and sample controls once for that frame's
  physics steps. Reuse two player-input records and their key overlay. Touch key
  state is rebuilt on pointer changes rather than allocating it every physics step.
- Cache steering-pad bounds for a drag; resizing/cancelling clears that drag.
- Calculate scene world matrices once for the refraction/reflection/main-view
  sequence. Each split-screen camera still refreshes its own scene transforms.
- Reuse coastal exposure samples and wind vectors instead of creating temporary
  arrays/objects for every droplet. A droplet's wind sample also serves its water
  height query.
- Prepare a spatial index of wake packets once per spray update. Queries retain
  original packet order, radius/edge checks, arithmetic and wave heights. All
  particles and the full wave model remain active. Hull physics uses its original
  wake path; the prepared path serves spray queries.
- Add bounded, opt-in `?qa=1` frame-phase and input-to-render-submission counters.
  Normal play does not allocate the probe or collect event measurements.

## Observations

Same desktop, Chrome 153 / RTX 5090, High graphics, Sunny Beach demo, 600-frame
rolling windows. Phone-size testing uses a 390 x 780 viewport on the desktop GPU;
it is not a physical-phone benchmark. Raw paired measurements and methodology are
in [source/latency-fps-measurements.json](source/latency-fps-measurements.json).

| Demo measurement | Before | After |
| --- | ---: | ---: |
| Desktop mean CPU/frame | 17.929 ms | 17.343 ms |
| Desktop mean frame interval | 18.335 ms | 17.835 ms |
| Phone-size mean CPU/frame | 16.019 ms | 15.554 ms |
| Phone-size mean frame interval | 17.113 ms | 16.835 ms |

These runs show about 3% lower average CPU time and small FPS gains. Random spray,
frame-dependent effects and system load cause variation; no universal FPS gain is
promised. A 100,000-query wake microbenchmark measured approximately 39–59 ms for
the original scan versus 10–14 ms for the prepared lookup, with identical sums.
The swell query benchmark fell from about 160 ms to 130 ms for 100,000 samples.

After each demo, 60 synthetic key transitions measured event creation to rendering
submission. Desktop p95 was 20.1 → 18.7 ms; phone-size p95 was 20.1 → 23.6 ms.
The mixed result does **not** establish an across-device latency reduction.
These measurements exclude input hardware, OS delivery, GPU completion, display
scanout and physical pixel response. They are not input-to-photon measurements.

## Verification

52 targeted tests passed: exact prepared-wake sums (including spatial bin edges,
expiry and resets), identical droplet trajectories, pointer ownership/release,
controller and two-player mappings, scene-transform reuse, input telemetry,
hydrodynamics, wave presentation, spray, graphics budgets, replay state isolation,
loading fallbacks and terrain byte equivalence.

Browser checks cover High-quality desktop and phone-size rendering, demo takeover,
two-player simultaneous acceleration, replay, pause/restart and salvage startup.
No runtime JavaScript errors were observed; the standalone development server's
missing favicon is unrelated to game assets.

Rebuild content-versioned imports with `node source/version-assets.mjs` after edits.
