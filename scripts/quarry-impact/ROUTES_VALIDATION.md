# Race variants milestone — October 1, 2026

The full Wreckfest 2 PC parity goal remains active. This update adds functional solo opposing-direction racing and three waypoint formats. It does not provide new locations or multiplayer synchronization for these formats.

## Rules and controls

Event Rules now offers Circuit laps, Waypoint tour, Free-order waypoints and Random waypoints. Choose 2–24 cars and 1–20 laps/rounds. Direction applies only to circuit laps: forward, reverse or opposing. Opposing assigns alternate cars to opposite routes, using physically separated single-file groups on the existing road. Each car follows its own ordered checkpoints and must cross all pre-line gates before completing its first lap.

Waypoint events use five numbered road stations and a finish zone. A tour visits 1–5 in order. Free-order accepts the five stations in any order. Random uses a shared shuffled sequence for each round and reveals only the next station. Every round ends at FINISH after all five stations have been collected. Entering the same station repeatedly, skipping an ordered station, or reaching FINISH early earns no progress. Random sequences are freshly seeded per event; random-run times are not compared as equivalent local bests.

World beacons/rings, numbered minimap markers and a visible station-status panel show the available destinations. AI chooses the shorter road direction to its destination and can change directions between stations. Player waypoint travel is unrestricted between required zones. Each car owns its progress and navigation state. The spectator car list displays completed, retired or current-progress states.

Challenge rules remain their fixed circuit configurations. Online retains its existing protocol and event set. Older event saves default to circuit laps while retaining their other settings. Starting an online session clears solo waypoint state. Solo replay and photo controls continue to apply to the resulting movement and damage recordings.

## Validation

- Production TypeScript/Vite build passed. The existing large JavaScript bundle warning remains.
- 240 tests pass in the candidate, including nine new tests for save migration, opposing grid separation and per-car checkpoint accounting, waypoint ordering/duplicates/finish rules, independent free-order racers, random sequence fairness and navigation, actual vehicle dynamics, and prior-source recovery.
- The actual Rapier vehicle dynamics fixture completes all 24 cars in each format: opposing 143.0s (four recoveries), ordered 41.0s (none), free 85.3s (four), random 50.7s (none). It includes car-to-car collisions and the same off-road/rollover recovery thresholds. Its ground is unobstructed and damage is not injected; these times are not full-quarry balance or performance claims.
- Rendered free-order demo completed with all 24 cars explicitly marked FINISHED in the spectator roster. The last car displayed 2:18 including recovery penalties; the event entered RACE COMPLETE before its timeout. Station progress, return-to-finish gating and per-car choices were visible. A slower car was inspected while driving normally and subsequently finished.
- Browser settings persisted the free-order format across reload. The world station beacons, numbered minimap and dedicated station-progress panel were visually inspected. Rolling 1280×720 Ultra observations ranged 33–56 FPS with P95 17–50 ms; these are short browser samples, not a VENGEANCE hardware benchmark.
- Rendered opposing-direction demo also reached all 24 cars FINISHED. The initial head-on queue cleared and both directions circulated around the quarry. The observed followed-car finish time was 00:59; the final car’s time was not recorded. This is a completion check, not a timing benchmark.
- Random-waypoint UI showed a single next station and separate per-car station counts. No browser console errors were observed. The final screenshot revealed a longer waypoint timer overlapping the controls at 1280×720. The corrected layout moves spectator controls below the main HUD at widths of 1400 pixels and below, with waypoint status beneath those controls.
- Final production bundle is `index-DZCl-cOG.js`, CSS `index-lxV9Hsn2.css`. Candidate UI verification is complete; installed-source verification is recorded in the installation log.

## Scope and open work

This adds rules and navigation around the current quarry road, with five stations and a return-to-start finish. It is not a substitute for multiple authored point-to-point courses, rallycross/oval/figure-eight/intersection layouts or distinct locations. Those remain in PARITY_PLAN.md. Multiplayer versions, timed races, event/class restrictions, long multi-round balance and wider controller accessibility remain open. Random waypoint races in the reference are documented as multiplayer-only; this solo implementation adds the rules and AI groundwork but does not establish parity for that requirement.

Reference: THQ Nordic Update 8 (June 30, 2026) describes additional opposing and waypoint races, including random multiplayer waypoints: https://thqnordic.com/news/hot-summer-hot-update-wreckfest-2-update-8-adds-player-progression-minimap-and-tons-of-new-content . Update 6 describes the separate point-to-point canyon location: https://thqnordic.com/news/time-to-get-dirty-wreckfest-2-s-biggest-content-update-yet-out-today .

## Recovery

The route source audit freezes release 2eb2cbb and layers on top of replay/event/older source recovery. Installation compares original file hashes with that baseline and preserves source/index backups. The backup directory is original `outputs/parity/routes-20261001`; source manifest and candidate/installed logs are authoritative installation evidence. Public website publishing is separate and is not performed here.
