# Spec

## v0.1.0 water slice (this build)
- **Modes:** `menu` (live scene, slow look drift, kayak anchored) → `playing`. Esc or the menu button returns.
- **Clock** (`game-clock.js`): ms since epoch; `sim` mode at rate 1/4/12, `real` mode follows the wall clock; skip-to eases over 3 s to the next occurrence of a local hour; local time via `Intl` in America/New_York. Sun from `sun-position.js` at the lake's coordinates.
- **Weather presets:** calm (wind 0.06, cloud 0.14), breeze (0.42, 0.38), overcast (0.22, 0.82), rain (0.36, 0.94, rain 0.9); wind "from" compass degrees; values ease over ~4 s. Wind 1.0 ≡ 8 m/s.
- **Kayak** (`kayak.js`): thrust 1.9 m/s², max 2.3 m/s, drag, turn 1.05 rad/s, wind drift 2.8% of wind speed unless anchored, bank stop at 0.32 m depth, four-point float (radius 1.2 m), paddle strokes at 1.15 Hz each stir the ripple field, wake packets every 0.25 s above 0.45 m/s.
- **Camera** (`angler-camera.js`): eye 0.62 m above the seat, 0.35 m forward; drag look yaw ±2.7 rad, pitch −0.62..0.58; steadiness damps hull pitch/roll by 85%.
- **Quality tiers:** high (DPR ≤ 1.5, 1024² reflection every frame, 512² ripple, shadows 2048), medium (DPR 1, 640², every 2nd frame, 256², shadows 1024), low (DPR 0.75, 384², every 3rd, 128², no shadows), saver (low plus paint every other frame). Adaptive: hysteresis over 8 s windows, ignoring throttled frames (>250 ms) and hidden tabs.
- **Input guards:** pointer capture on all controls; taps ignored after >8–10 px movement; keys cleared on blur and hide.
- **Persistence:** `first_light_settings_v1`.
- **QA hook:** `window.__FIRST_LIGHT` (see README).

## v0.3.0 lure cam
Underwater render branch (hysteresis −4 cm enter / −0.5 cm exit), per-pass fog objects, lure cam follow (1.5 m behind the lure along the kayak-to-lure line, below it when shallow and slightly above when deeper than 0.9 m, clamped 14 cm under the surface and 30 cm off the bed), QA `setCamera('lurecam'|'under')`.

## v0.4.0 first fish
Implemented as described in the README (population, brain, bite window 0.12–1.25 s, fight with slack and overload losses, landing at rod-tip distance < 2.9 m when tired, hero view, catch card, journal). QA: `spawnFish(x,z,len,bold)`, `fish()`, `forceStrike()`, `setHook()`, `fightState()`, `fightInput({reeling,sidePressure,rodUp})`, `releaseFish()`, `journal()`.

## v0.6.0 Watch Demo
States open → plan → travel → cast → work → (plan | card); planner in `demo.js` (`planNext`), executor patterns, `fightControl` with a 0.25 s delayed state read, director shots surface/lurecam/slowmo/hero with coverage accounting, dead-air metric (retrieve time beyond 45 s without an event), take-the-rod on any key or pointer. QA: `demo(seed)`, `demoStep(secs)`, `demoReport()`, `takeRod()`.

## v0.7.0 Roster part one
`species.js` exports `SPECIES` (largemouth, smallmouth, walleye, bluegill), `ROSTER` and `activityByHour`; each entry carries `count`, `depth`, `structure`, `technique`, `lureFamily`, `fight`, `spookRadius` and size classes. `fish.js` `makePopulation(scene,bathy,cover,{assets,roster})` spawns per species on matching cover inside its depth band with per-species activity; `speciesOf(fish)` and `describe(fish)` feed the catch card and journal (species id stored per catch). `fish-photo.js` caches lofted geometry per profile; `main.js` loads every roster species' assets up front. QA: `spawnFish(x,z,len,bold,species)`, `studio(len,species)`. Extractor flags: `--dark`, `--belly-window`, `--width-ratio`, `--peduncle a b`, `--species`.

## M2 remaining
Largemouth hero model, material and rig; brain core states; tackle chain with weakest-link readout; cast (ballistic with drag, preview arc), 24-node Verlet line with buoyancy by line type, technique recognizer (3 s window over reel rate and rod-tip velocity), bite signatures (tick 80 ms, thump 200 ms, weed ramp, snag), hookset window from strike + species delay to +1.2 s (musky 2.5 s), fight with both failure modes (slack drains hookHold during HEADSHAKE/JUMP; overload past the weakest link breaks after a ~1 s reaction window), side pressure, landing at stamina < 0.15 within 3 m, in-hand hero view with the measuring board, catch card, release; lure cam and strike replay via the underwater branch; three lures; optional pro meters; **Watch Demo v1** (angler brain, technique executor, fight controller, first director shot set) doubling as the end-to-end QA bot.

## M3 the lake alive
Twelve species with size classes (four shipped in v0.7.0), Species Gallery, forage schools, seasons (including the spring bass closed season, catch-and-immediate-release, dates to verify), pressure/wind/clarity drivers, live weather from the site's Open-Meteo widget, persistence and residents, journal with species cards and bite clock, float and bottom fishing (rod holders, night cats), kayak trolling, line care, tackle unlocks, Watch Demo episodes across spots with spoken reasons.

## M4 modes and polish
First Light sessions on the shared scores worker, Big Bass catch-photo-release tournament with AI rivals driven by the same brain, Lure Cam attract and title-screen cat, Photo Mode with share, First Morning tutorial, late sonar unlock, voice pools and ambient audio, PWA with a media cache, touch and gamepad pass, mobile QA, card art, gallery promotion.
