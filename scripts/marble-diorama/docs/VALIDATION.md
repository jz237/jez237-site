# Validation — 2026-09-15

## Current outcome

**65 automated tests pass. All six campaign races and all three bonus courses
are playable. This reconstruction is published under Unfinished Games, with
completion gates open in PARITY.md.** The full campaign passes untimed one- and two-player
normal-input runs; all bonuses pass timed one- and two-player runs. A complete
timed original campaign has not yet passed. Original music is not enabled.
Current simulation/replay version: `rapier-0.20.0-mm-5`.
Commands: `npm test`, `npm run build`, `node measure.mjs`, `git diff --check`.
Node: v24.17.0. Three.js: 0.186.0. Rapier: 0.20.0. Build tool: esbuild 0.28.2.
Dependencies are pinned and bundled locally. No runtime CDN dependency.

## Measured physics results

The following numeric table records the initial workshop checkpoint. Movement
calibration remains unchanged; the demo controller and campaign rules have since
changed. Current course acceptance is recorded below.

| Measurement | Result | Required threshold |
|---|---:|---:|
| Visible/collider radius | 0.55 / 0.55 | Equal |
| Settled contact error | 0.000066328 world units | Below 0.0055 |
| Contact error / radius | **0.01206%** | Below 1% |
| Coast translation over test interval | 3.312310696 | — |
| Integrated angular travel × radius | 3.313019046 | — |
| No-slip coast error | **0.02139%** | Below 2% |
| Physics states at 30, 60, 120 rendering fps | Identical position and quaternion values | Matching outcomes |
| Airborne spin drift | Below 0.1% per axis in test | Separate spin test |
| Solo demo proof completion | **20.0167 s, zero falls** | Normal input only |
| Two-player demo completion | **20.425 s / 20.0167 s, zero falls** | Same simulation/input path |

The small numerical tests cover one specific marble calibration, not Amiga
equivalence. The proof completion test crosses a ramp, channel, drop and moving
bridge. No coordinate snapping, forced finishing or route-position replacement
is used by the demo.

## Automated coverage

- Welded buffers and shared triangle representation.
- Settled contacts, no-slip coast, airborne momentum and direction reversal.
- 30/60/120 frame cadence equivalence; no discarded time during a slow visible frame.
- CCD against a thin barrier under maximum turbo; smooth seam traversal.
- Marble-to-marble momentum exchange and independent timeout.
- Independent finishing, fall recovery and assisted checkpoint respawn.
- Kinematic platform transform agreement and standing marble motion transfer.
- Full proof-course demo through normal bounded steering.
- Physics snapshot restoration and deterministic replay seeking across checkpoints.
- Editor JSON round trip preserves compiled buffers and motion data.
- Import limits reject invalid dimensions, duplicate IDs and excessive geometry.
- Record keys separate physics/course revisions, assistance, player count,
  difficulty and timed mode.

## Browser inspection

Codex in-app browser on Windows, localhost. Inspected desktop at 1280×800,
portrait at 390×844, and landscape at 844×390.

- Workshop starts and renders patterned spheres and track.
- Solo demo visibly reaches the finish at 20.02 seconds, zero falls.
- Pause displays the paused state and allows camera orbit.
- Editor accepts a placed floor; undo, redo and local save complete through UI.
- Two-player layout shows independent clocks/marbles.
- Replay plays from recorded inputs; seeking to tick 1400 shows the expected
  168.3-second clock. Quarter-speed selection and replay pause work.
- Portrait has no horizontal overflow (`scrollWidth = innerWidth = 390`).
- Mobile controls occupy the lower screen. Landscape controls were explicitly
  enabled for short wide viewports as well as coarse-pointer devices.
- A removed Three.js shadow constant was replaced with supported PCF shadows.
- No fatal browser errors observed. A driver shader precision warning occurred
  during environment generation; rendering and tests completed.

The diagnostic sample reports **60 fps** on this desktop in the workshop/demo
session. This is a sampled observation, not a sustained performance benchmark.
The adaptive graphics path reduces pixel ratio and shadows, never physics rate
or collision geometry. Browser renderer string: `WebKit WebGL` (masked).

Hardware reported by Windows:

- AMD Ryzen 9 9950X3D2 16-Core Processor.
- NVIDIA GeForce RTX 5090, driver 32.0.16.1074.
- AMD Radeon integrated graphics, driver 32.0.21036.18.
- Windows 11 Pro, version 10.0.26200.

The browser did not expose the selected GPU, so do not attribute its sample
unconditionally to the RTX. No physical phone or gamepad was tested. Viewport
resizing does not prove physical touch performance or mobile audio behavior.

## Six-course and bonus checkpoint

`node measure-campaign.mjs` records the complete input-controller traversals in
[campaign-measurements.json](campaign-measurements.json). Current solo results:

| Course | Time, real seconds | Falls | Mode |
|---|---:|---:|---|
| Practice | 31.950 | 0 | Untimed campaign |
| Beginner | 80.033 | 0 | Untimed campaign |
| Intermediate | 65.408 | 0 | Untimed campaign |
| Aerial | 81.942 | 0 | Untimed campaign |
| Silly | 85.942 | 2 | Untimed campaign |
| Ultimate | 105.492 | 2 | Untimed campaign |
| Clockwork Foundry | 27.333 | 0 | Timed bonus |
| Magnetic Observatory | 15.333 | 0 | Timed bonus |
| Crystal Cascade | 14.558 | 0 | Timed bonus |

Two-player campaign and bonus outcomes are all finished; individual times and
falls are in the JSON. Later-course recoveries remain visible rather than
being removed by test hooks. Increasing demo target speeds did not reliably
improve completion, so a broad speed increase was not adopted.

Additional automated coverage includes mini collection exactly once (+500/+3),
directional vacuum attraction, moving acid footprints, steelie momentum,
muncher contacts, bird hits/misses and outward shared hull faces, disappearance
removing support, hazard snapshots, saved input-only replay, paired Intermediate
starts, pipe winding, campaign carryover/elimination/ending and richer editor
geometry transforms through a JSON round trip.

### Browser campaign / bonuses

- Complete solo six-course demo reached the ending on the prior mm-3 build:
  22,987 total points, two falls. This preceded birds and disappearing tiles;
  current mm-4 whole-campaign browser rerun remains due. Current headless
  campaign includes these additions.
- Browser solo bonus demos completed: Foundry 27.33 s, Observatory 15.33 s,
  Cascade 14.56 s, all zero falls. Demos intentionally use untimed mode;
  the headless bonus acceptance runs use actual clocks.
- Curved-channel placement rendered the authored geometry; 45-degree rotation,
  click-to-move, undo/redo, local save and custom playtest were exercised.
- Editor inspection exposed a name field that did not reliably commit before
  save/playtest. Metadata is now explicitly committed at those boundaries;
  browser recheck passed: the new name and 90-unit clock both appeared in playtest.
- Finish HUD now displays the campaign ending total. Race result winner is
  selected by finish tick rather than player number.
- Falling, timed-out and finished marble bodies are disabled, preventing
  invisible bodies from blocking the remaining player.

### Remaining release acceptance

Timed campaign balance, complete original route coverage, exact original
rules/awards, lower-lane wave deformation, launcher mechanism fidelity, final
difficulty calibration, soundtrack assignments/loops/listening, sustained
performance, physical devices and the final campaign browser pass remain open.
UI labels disclose reconstruction and audio status. Input-only saved replays
can seek slowly; final medal thresholds are also outstanding.

## Preservation and publication

Legacy page Git blob: `51e84adebb1dfacb413d8bb5b338ccc57931af17`, identical to the
base page. Only Marble source/build/docs and its prepared listing changes belong
to this work. Unrelated Vector Arena modifications remain untouched.

GitHub push, Jez237 deployment and live campaign/demo validation have not been
performed. The goal is still the complete game and publication; this checkpoint
does not close it.

## Traveling-wave follow-up

Intermediate revision 2 replaces its two static upper humps with traveling
wave strips. Each short convex panel derives its endpoint heights, pitch and
chord length at 120 Hz. Renderer vertices and collider hulls share those dimensions;
body translation/rotation transfers motion. Both ends are anchored. Adjacent
panel top edges agree to below 0.000001 units over several phases, the wave
physically lifts a resting marble, and replay restores its contact outcome.

The new orange-pipe / wave / right-lane alternate finishes in 71.15 seconds
with normal demo input and zero falls. Course-specific alternate demo routes
are now selectable in the menu. The default campaign route remains the tested
left bypass. Exact Amiga wave cycles and lower-lane deformation remain open.

## Alternate routes, replay, storage and responsive follow-up

Every currently authored alternate route finishes through normal controls.
This does not close unimplemented or unverified original route coverage.

| Alternate | Seconds | Falls | Mode |
|---|---:|---:|---|
| Practice right exit | 33.225 | 0 | Untimed |
| Beginner left ledge | 91.958 | 0 | Untimed |
| Intermediate right upper maze | 67.883 | 0 | Untimed |
| Intermediate pipe and waves | 71.150 | 0 | Untimed |
| Aerial right hammer route | 89.542 | 0 | Untimed |
| Silly right climbs | 85.042 | 0 | Untimed |
| Ultimate right hazard rooms | 151.875 | 6 | Untimed |

Silly revision 2 opens the right goal-climb entrance beside the upper step.
Its prior entrance left less than a marble diameter between surfaces. Ultimate's
right path completes with six visible recoveries; that is not a clean-run claim.

Browser Intermediate pipe/wave demo completed at 71.15 seconds, zero falls.
Replay seek to tick 6240 now centers the marble on the wave strip and preserves
orbit offset. No browser errors were logged during this check.

Saved inputs use lossless run-length encoding and ghost poses use compact numeric
arrays. Existing unencoded saves remain readable. Tests reconstruct exact analog
input physics outcomes after encoding, fit a ten-minute held-input recording plus
ghost in a simulated 5 MiB quota, and exercise quota failure/eviction. Storage
pressure removes replay/ghost data while retaining scores, medals, settings and
authored courses. A failed save leaves prior persisted data intact. These are
unit tests with a quota-limited storage adapter, not a claim about every browser's
quota policy. Save failure messages are no longer replaced with success toasts.

Latest build inspected at 390×844 portrait and 844×390 landscape. The portrait
menu now places the miniature below the title, removing text/geometry overlap.
Document scroll width was 375 against inner width 390 (vertical scrollbar, no
horizontal overflow). Portrait race framing and landscape two-player HUD and
split controls were inspected. These remain viewport checks on the desktop,
not physical-phone or gamepad tests.

## Slope readability correction

After user feedback that slopes were unreadable, track rendering now distinguishes
sloping faces from flat landings with a darker cool tint, world-height contours
at 0.75-unit intervals, and downhill chevrons on broad coplanar ramp regions.
The shader derives grade from the actual rendered collision triangles; moving
surface transforms and deformed wave vertices feed the same calculation.
Curved banks use contours without fragmented chevrons. Ambient/fill lighting
was reduced to retain shape contrast. No physics, controls or collision geometry
changed. The HUD explains the downhill chevrons.

Inspected Practice ramps, peaks and lower banked turns through the gameplay
camera with Adaptive and Lightweight rendering. Slope cues remain visible
without shadows. Browser demo finished in 31.95 seconds with zero falls and no
logged renderer errors. All 48 existing tests still pass; build and diff checks
pass. User confirmation of playability is still separate from these checks.

## User-reference graph and relief rendering

The supplied diorama image clarified that a continuous surface grid and local
height colors are more useful than isolated slope arrows. The current rendering
replaces the previous tile/arrow treatment with fine white graph lines aligned
to the course and draped over the exact shared mesh. Stone/ceramic surfaces use
blue locally lower areas, pale intermediate regions, and gold ridges/exposed
edges. Other gameplay materials retain their identifying colors.

A bounded visual height field samples the existing top triangles. Symmetric
neighbor differences distinguish curvature from a planar incline; paint is
smoothed without changing heights. The graph remains attached to moving parts.
Moving parts use the graph but do not sample static relief colors. The current
geometry remains a reconstruction: the image's additional sculpted hollows are
not being presented as existing collision geometry.

Two new tests verify that planar ramps remain neutral, concave and convex test
surfaces get opposite relief colors, edges are identified, and source vertices
remain unchanged. All 50 tests pass. The latest browser Practice demo finished
in 31.95 seconds, zero falls, with no renderer errors; paused replay inspection
at tick 2880 confirms graph deformation and relief colors across banked turns.

## Rounded miniature and display platform

The latest finish adds a course-sized walnut display plinth with rounded edges,
brass trim, recessed feet, support columns, and a course nameplate. Side walls
retain their colored bands and now use seamless stone grain, varied roughness,
and recessed staggered masonry joints. The platform and supports are decorative.

Polygon corners, static rectangular slab corners, and the outside edges of banked
ribbons are rounded in the shared rendering/collision mesh. Pyramid obstacles
have rounded-square outlines and smoothly capped peaks. The course grid and
blue/gold relief colors remain. Original ribbon centerlines and join endpoints
are preserved. The physics version advances to mm-5 because course geometry
changed; previous physics-version replays are not replayed against the new mesh.

All 50 automated tests pass after the geometry changes. The production bundle
builds. Fresh campaign-measurements.json supersedes earlier traversal numbers:
all six untimed campaign races finish for one and two players, all three bonuses
finish timed for both player counts, and every authored alternate route finishes.
These include falls and recovery on later courses; they are not clean-run claims.
Practice solo completes in 31.783 seconds with zero falls. Full timed original
campaign validation and the other release gates remain open.

Browser inspection confirms the plinth, detailed two-color walls, rounded slab
corners, capped peaks and curved bank boundaries in the normal gameplay view.Browser Practice demo also finishes at 31.78 seconds with zero falls and no logged renderer errors.


## Demo steering and timed-campaign checkpoint

The controller now compensates for downhill gravity, damps excess horizontal
rolling slip, and uses bounded turbo inputs on open runs. Tight waypoints retain
their slow approach speed, including the preceding segment. A marble that has
settled just beyond a waypoint can continue to the next leg; mandatory stop
markers and moving-platform waits cannot be skipped. Ultimate's main demo uses
the open lane between its ice pyramids, avoiding unnecessary icy turns. The
simulation, player controls, collision meshes and clocks are unchanged (mm-5).

All 52 tests pass, including new acceptance for the timed solo campaign through
Aerial with zero falls and Ultimate's two-marble main route under 90 seconds
without falls. All six untimed campaigns, alternate routes, timed bonuses and
replay/physics/storage tests remain passing. Fresh campaign-measurements.json
supersedes earlier traversal measurements.

The dedicated command `node measure-timed-campaign.mjs` writes
`docs/timed-campaign-measurements.json` and records failures as well as finishes.
It currently reports `complete: false`: solo finishes Practice (29.742 s),
Beginner (64.092 s), Intermediate (51.017 s) and Aerial (59.550 s), then times out
in Silly at 47.367 s. Both marbles finish the first three courses in two-player
mode; both time out in Aerial after four/five falls. These results keep the full
timed-campaign gate open. No clock extension or positional override was used.

Browser Ultimate demo finishes in 63.92 seconds with zero falls and no logged errors.


## Unfinished preview publication — September 15, 2026

The owner explicitly requested publishing the current build in Unfinished Games. This authorizes the unfinished preview; full-game acceptance remains open. The catalog now classifies the renamed Diorama Workshop correctly and describes the current six-course and three-bonus build. The legacy edition is retained.

The audio engine now uses native sample-clock loops, cue-generation cancellation, a bounded decoded-buffer cache, independent volume buses and serialized pause/resume. Eleven audio unit checks and five native OfflineAudioContext fixture checks pass. The browser checks cover loops, one-shots, restarts, stops and stereo, with zero output error against decoded samples. These checks do not verify the original soundtrack; no music is enabled or packaged.
Publication checks: all 63 automated tests pass and the production bundle builds successfully.

## Crossing-aware two-player demos — September 16, 2026

The controller predicts nearby marbles' closest approach over 2.5 seconds. At
crossing approaches, the second demo driver brakes to yield to the first. It
ignores parallel following and marbles on different elevations. Inputs remain
bounded steering and turbo; no body positions, collisions, clocks or player
physics are changed. Physics remains mm-5.

Aerial previously had four/five falls at its initial crossing in two-player
mode. It now completes with zero falls in 59.550 / 62.992 seconds. The right
route's shallow bend before the descent accepts a 0.9-unit approach radius,
inside the three-unit-wide track, removing an unnecessary return to its marker.

All 65 tests pass and the production bundle builds. New acceptance covers
one- and two-player timed campaigns through Aerial, with zero falls and time
remaining for every player. The dedicated crossing test also checks that
computing demo inputs does not move bodies. Fresh full campaign measurements
cover every untimed race, authored alternate route and timed bonus again.

Full timed acceptance remains open: solo times out in Silly at 47.367 seconds;
two-player reaches Silly with both players, then both time out by 46.083 seconds.
No clock extension was used. Original soundtrack and quantitative Amiga parity
also remain open. The unfinished public preview is commit 2e3703951; this
checkpoint is local development pending its next publication.
Browser verification: the rebuilt two-player Aerial demo finishes both marbles with zero falls; the result shows Player 1 at 59.55 seconds. No browser errors were logged during this run.
