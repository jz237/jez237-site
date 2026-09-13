# Phone graphics comparison

The S25 report for `simulation-20cd0a593` measured 13.1 FPS, 83.4 ms frame intervals, 15.4 ms simulation and 6.8 ms rendering CPU/driver. Simulation improved from 33.3 ms while overall frame rate barely changed. This indicates another limiting factor; GPU time was unavailable, so a specific GPU bottleneck is not yet confirmed.

Open the aquarium with `?stats=1` and press **Run phone graphics test**. Keep the view still for approximately 40 seconds, then copy the measurements. No telemetry is uploaded.

Eight five-second stages compare the complete animation, held simulation, separately held reflections and shadows, both captures held, bypassed contact shading, reduced main-image dimensions, and a full-animation recheck. Each stage discards one second of queued-work/warmup time and measures four seconds of wall-frame intervals. These are independent frame-time comparisons, not additive GPU pass timings. Frozen-scene probes should be compared with the held-simulation baseline. The final full-animation recheck helps identify changing load or thermal conditions.

The diagnostic temporarily freezes motion and varies effects or image dimensions only after the button is pressed. It restores pixel ratio and camera-control state on completion, cancellation, tab hiding, interruption, resize, or rendering failure. Existing pause state is never changed. Camera/view controls outside the measurement panel cancel the test. All geometry, textures, animal behavior and normal rendering defaults remain intact. No frame-rate improvement on the S25 is claimed for this diagnostic release.
