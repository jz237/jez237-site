# Phone graphics comparison

The S25 report for `simulation-20cd0a593` measured 13.1 FPS, 83.4 ms frame intervals, 15.4 ms simulation and 6.8 ms rendering CPU/driver. Simulation improved from 33.3 ms while overall frame rate barely changed. This indicates another limiting factor; GPU time was unavailable, so a specific GPU bottleneck is not yet confirmed.

Open the aquarium with `?stats=1` and press **Run phone graphics test**. Keep the view still for approximately 40 seconds, then copy the measurements. No telemetry is uploaded.

Eight five-second stages compare the complete animation, held simulation, separately held reflections and shadows, both captures held, bypassed contact shading, reduced main-image dimensions, and a full-animation recheck. Each stage discards one second of queued-work/warmup time and measures four seconds of wall-frame intervals. These are independent frame-time comparisons, not additive GPU pass timings. Frozen-scene probes should be compared with the held-simulation baseline. The final full-animation recheck helps identify changing load or thermal conditions.

The diagnostic temporarily freezes motion and varies effects or image dimensions only after the button is pressed. It restores pixel ratio and camera-control state on completion, cancellation, tab hiding, interruption, resize, or rendering failure. Existing pause state is never changed. Camera/view controls outside the measurement panel cancel the test. All geometry, textures and animal behavior remain intact.

## Results and capture scheduling

The user's S25 test of `probe-8dee8a593` reported full aquarium 13.1 FPS, simulation held 13.3, reflections held 26.6, shadows held 17.7, both captures held 49.1, contact shading bypassed 13.6, and half-width/height rendering 15.5. This strongly points to the recurring offscreen captures. It does not measure individual GPU pass times, and 49.1 FPS with motion held is not a prediction for the live simulation.

Coarse-pointer devices now use an oldest-first full-resolution capture schedule. Normally one map is refreshed per frame, cycling through the three 1536×1536 canopy shadows and visible glass/water reflection views (up to three). Each active map gets service within one cycle, including during continuous camera motion. Newly visible mirrors, abrupt camera changes, lesson changes and returning from a hidden tab refresh immediately. Capture image, projection and depth matrices remain paired. Individual light `autoUpdate` flags prevent Three.js from regenerating all three shadows when just one is due. Failed frames invalidate the schedule before retrying.

Models, texture resolution, reflection resolution, shadow resolution, antialiasing, animal behavior, water ripple animation and contact shading are unchanged. The tradeoff is lower temporal frequency in reflected motion and cast shadows; main-view animal and plant motion still updates every rendered frame. At 30 FPS with six visible jobs, each map updates five times per second. Desktop mouse-pointer devices retain every-frame capture updates.

Use `?captures=full&stats=1` for the previous every-frame capture cadence or `?captures=staggered&stats=1` to exercise the phone schedule on a desktop. The copied readout reports the active cadence. Graphics probes hold the selected class of captures independently of this schedule; run comparisons with the same cadence. No S25 frame-rate improvement is claimed until the user remeasures the published build.
