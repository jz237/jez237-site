# Driving controls — local candidate, 2026-10-01

Not installed on VENGEANCE. Automatic approval review previously blocked outgoing source/test transfer; explicit human authorization remains pending. The full Wreckfest 2 parity objective remains incomplete.

## Changes

- Pause/menu Settings includes two remappable keyboard slots for accelerate, brake/reverse, left, right and handbrake. It rejects duplicates and reserves existing camera/recover/mute/fullscreen/photo/inspect/traffic shortcuts. Escape cancels capture; Backspace clears an alternate slot. Reset restores defaults.
- Arrow steering now agrees with A/D. The old input function had ArrowRight paired with A and ArrowLeft paired with D.
- Gamepad selection (automatic or four slots), steering axis, invert/center/deadzone/full-lock/response calibration, three button mappings and trigger deadzone. The live panel shows detected controller and raw/processed steering. No attached physical controller was available for hardware testing.
- Optional speed-dependent steering input limit, off by default. At strength 1 the multiplier is max(0.35, 1/(1 + abs(speed in m/s)*0.025)); existing vehicle steering and physics remain intact. It does not implement ABS, traction control, wheel force feedback or a new tire solver.
- Both pedals apply the brake rather than reverse. Brake alone above 1 m/s brakes, otherwise reverses, preserving the existing auto-reverse convention.
- Versioned browser-local settings validate incoming data, avoid duplicate assignments and report save failures. HUD key hints follow current bindings. Input sampling is stateless for physics and online network callers. Existing blur/pause clearing remains in place.

## Verification

41 targeted tests passed: 8 control rules/source audit, 2 real Rapier controls/assist, 7 livery, 1 livery using all three real vehicle assets, 7 garage, 8 replay, 8 routes. Tests were run directly with `node --import tsx tests/<file>.test.ts`; the local `node --test` invocation only reported file-level counts, so it was not used as proof of individual checks. Logs: work/controls-tests.log and work/controls-physics.log.

`npm run build` passed TypeScript and Vite. Output: index-CK2NEOaH.js and index-qa2lyCyG.css. Existing large bundle warning remains; the partial local asset copy lacks the font referenced by CSS.

CUA browser exercised the actual settings component: W→E rebind, conflict rejection for reverse→E, Escape cancellation, alternate handbrake add/remove, duplicate gamepad button rejection, and accelerator/0.65 assist persistence across page reload. No browser errors were reported in the final check. The harness imports production controls/UI and displays input; it is not the full quarry scene.

The real Rapier fixture verifies signed vehicle trajectories for both letter/arrow layouts and reduced actual front-wheel steering with assist enabled. Gamepad values are synthetic in automated tests. Full-scene play, real controllers, multiplayer session behavior and the complete remote regression suite remain installation gates.

## Revision and packaging

Controls source snapshots freeze local livery commit 64074af. Historical source audit chain: controls → livery → routes → replay → events → progression → garage → reference → older. Do not rewrite earlier baseline snapshots.

The cumulative livery-and-controls package uses installed route baseline afe7661. Its manifest contains exact before/after hashes, including null for newly introduced files. It excludes assets, dependencies, player saves and scratch harnesses. Before any authorized installation, compare every destination hash, back up affected files, then build/test the isolated candidate before replacing original source. Remote original/candidate are still index-DZCl-cOG.js / index-lxV9Hsn2.css; nothing from this milestone was transferred or published.
