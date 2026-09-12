# TIDELINE · v2.0.0

September 12, 2026 · [Play coastal racing](https://jez237.com/games/2026-09-10/after-the-storm/race.html)

This release concentrates on readable, responsive water riding across all nine venues. It preserves the existing championships, unlocks, records, stunts, split screen and salvage voyage.

## Water and riding

- Broad displaced waves and hull sampling retain the same shared Gerstner/surf spectrum. The renderer evaluates broad slopes on the dense near-field mesh; filtered capillary detail remains in the fragment shader.
- Analytic crest curvature produces broken whitecaps without triangular derivative artifacts. Shore wash, landing pressure waves, wake arms and aerated propwash remain in world space after the rider moves on.
- Nine optical profiles distinguish clear coastal water, silty lakes, harbours and glacial water through absorption and scattering. Broad wave-face lighting makes the next crest easier to read.
- Grip returns progressively after re-entry. Loaded carving adds modest chine bite, and absorbing a landing preserves more momentum. Waves, intake contact, ice and collisions still govern movement; there is no airborne steering boost.
- The suspended chase camera follows a filtered water datum and blended travel direction. Bounded angular speed and acceleration prevent sharp reversals from whipping the horizon; speed opens the field of view.
- The demo camera rides closer to the action with filtered heave. Its driver uses ordinary throttle, steering, braking, trim and stunt controls—not replayed positions or granted buoy progress.

## Controls and presentation

- Proportional phone steering, independent two-thumb controls, optional remembered Auto throttle, brake override, Absorb and the existing stunt tray.
- Portrait and landscape launch actions are visible before tuning options. Controls reset on pause, blur and orientation changes; Auto defaults off.
- Gamepad steering now leaves its dead zone continuously, with finer central control and full lock at full stick.
- Updated fair-weather sky and water palettes retain each venue's identity. The visible TIDELINE version badge is on both game pages.

## Performance and resilience

- Water mesh presets: 288 / 208 / 144 subdivisions for High / Medium / Low. The dense region moves continuously with the craft.
- Wake foam is accumulated in a bounded atlas instead of evaluating every retained wake per screen pixel.
- Shadows are refreshed once per camera view and reused across water passes. Split screen refreshes each player's view independently.
- Distant jet-ski geometry falls from **76,488 to 26,120 triangles**; rider geometry from **95,360 to 32,557**. Close views keep the original models. Threshold hysteresis avoids rapid detail changes.
- Adaptive quality responds to sustained load and cautiously recovers after it clears. Explicit manual quality choices remain respected.
- Missing optional terrain maps or detail meshes fall back to built-in surfaces/full models without blocking Start. Neither playing nor deploying requires meshoptimizer; it is only an optional offline authoring tool.

## Verification

The independent reviewer records gameplay findings and final automated results in [TIDELINE-REVIEW.md](TIDELINE-REVIEW.md).

Browser checks use a dedicated graphical Chrome with hardware acceleration on Radeon 8060S/Mesa, not a software-rendered headless browser:

- All eleven showcase scenes across nine venues loaded and rendered without game exceptions or missing game requests.
- Demo pause/resume and takeover accepted real control input.
- Phone-sized 390×844 and 844×390 viewports passed actual multi-pointer steering/throttle ownership, Auto/brake precedence and pause/reset checks.
- Two-player split screen accepted independent throttle and opposite steering inputs on Low graphics.
- Salvage movement and pause passed using the upgraded shared water renderer.
- Deliberately blocked terrain/detail downloads retained playable fallback graphics.
- The final ordinary **1× eleven-scene demo loop passed in 1,002.5 seconds (16 minutes 43 seconds)**: nine physical lead-rider laps, both full stunt results, automatic scene transitions and wraparound, zero lead disqualifications/rescues, zero runtime errors or missing game requests. A compact receipt is in `source/tideline-browser-verification.json`.
- `source/browser-release-check.py --tour` reproduces that check and saves read-only telemetry and screenshots outside the source tree.

Preliminary matched 1280×720 High demo measurements improved from roughly 39–41 FPS to 42–46 FPS on this workstation. They are short, scene-dependent samples collected during review, not a universal 60 FPS claim. Adaptive graphics is the default. Physical phone performance and physical gamepad hardware remain unverified.

This is real-time surface-wave simulation with planar reflections, foam atlases and spray particles, not overturning volumetric water or a claim of exact Wave Race 64 parity. Salvage retains its original driving rules while sharing the upgraded water and rendering optimizations.

## Reproduce / publish

1. `npm test`
2. Serve this directory with `npm start` or any static server.
3. With Python Playwright and graphical Chrome installed, run `python3 source/browser-release-check.py --url http://127.0.0.1:4174/ --tour`. Keep that dedicated browser focused; the game intentionally pauses on blur.
4. After browser module/style changes, run `node source/version-assets.mjs` and check both entry pages. No build step or runtime package installation is required.

The normal game has no verification controls. `race.html?qa` exposes only a frozen read-only snapshot for browser checks; `?verify` retains the existing development harness.
