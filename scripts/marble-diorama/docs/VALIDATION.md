# Validation — updated 2026-09-21

## Current outcome

**97 automated tests pass. All six campaign races and all three bonus courses
are playable. This reconstruction is published under Playable Games at the owner's request, with
completion gates open in PARITY.md.** The full campaign passes untimed one- and two-player
normal-input runs; all bonuses pass timed one- and two-player runs. A complete
timed original campaign has not yet passed. Original Amiga module playback is enabled; detailed reference-listening parity remains open.
Current simulation/replay version: `rapier-0.20.0-mm-7`.
Commands: `npm test`, `npm run build`, `node measure.mjs`, `git diff --check`.
Node: v24.17.0. Three.js: 0.186.0. Rapier: 0.20.0. Build tool: esbuild 0.28.2.
Dependencies are pinned and bundled locally. No runtime CDN dependency.

### September 16 — title-screen camera

The title screen enables drag orbit and wheel/two-finger pinch zoom. The zoom
buttons and gestures now share the orthographic camera's zoom value; beginning
a race restores the regular gameplay framing. A reset button restores the whole
diorama view. Mouse-trackball capture is restricted to active human gameplay.

Browser checks: desktop drag rotation, wheel zoom in/out, zoom buttons, reset,
menu interaction with trackball enabled (no pointer capture), and race startup
after zooming passed. A 390 × 844 CSS-pixel viewport passed drag/button checks
with camera controls and hint separated from the title. No captured console
errors. Physical touch/pinch testing remains open. All 81 existing tests pass;
the production build and diff check pass. Course/physics versions are unchanged.

### September 16 — course draw batching

Course meshes previously created a draw group for every alternating run of top
and side faces. Rounded ribbons consequently issued hundreds of small draws.
`render-surface.mjs` preserves the original expanded vertex and normal buffers,
then groups their draw indices by material. Each mesh now needs at most two
groups. Wall texture, relief/grid shaders, triangle winding, creased normals,
shadow eligibility, course definitions and all simulation inputs are unchanged.

| Course | Previous material groups | Batched groups |
|---|---:|---:|
| Practice | 702 | 4 |
| Beginner | 681 | 5 |
| Intermediate | 409 | 33 |
| Aerial | 82 | 12 |
| Silly | 869 | 5 |
| Ultimate | 458 | 16 |
| Clockwork Foundry | 14 | 8 |
| Magnetic Observatory | 10 | 6 |
| Crystal Cascade | 16 | 6 |

These are course-material groups, excluding decorations and additional shadow
passes. `node measure-render-groups.mjs` reproduces the table and writes
`render-group-measurements.json`. They are not FPS estimates.

All 81 tests pass. The added checks compare every rendered triangle corner with
its collider corner across all nine courses, preserve material assignment and
winding, require unchanged compiler buffers and bit-identical creased normals,
and exercise moving-wave draw indices through a complete wave cycle. Physics
and replay version remains mm-5. The production bundle builds successfully.

The published pre-batching build (0c263d075, game.js `28c655d241e2fbd9`) also
completed a fresh full two-player untimed browser campaign on September 16:
Player 1 **26,471 points / zero falls**, Player 2 **26,489 points / zero falls**.
The browser showed the six-course ending. This supersedes the older mm-3-only
browser evidence for paired untimed completion. Timed completion is still open.

Hardware inventory for this browser session: Windows, AMD Ryzen 9 9950X3D2,
approximately 93.4 GiB usable RAM, NVIDIA GeForce RTX 5090 and AMD integrated
graphics. The Codex browser reports the masked renderer `WebKit WebGL`; the
inventory alone does not identify which GPU the browser selected. Browser
sampling uses Auto quality and the visible QA overlay, not a physical phone.

The optimized browser build (`game.js?v=c2d4be66b7b97143`) completed the same
full two-player untimed campaign with exactly the same ending totals and zero
falls. Ultimate ended at tick **7,442**, matching the published baseline, and
both final positions and quaternions matched. No console errors were captured.
The desktop viewport was **1089 × 1241 CSS pixels**, with Auto quality.
Sampled QA readings during Beginner, Intermediate, Aerial, Silly and Ultimate
were **59–60 fps**. These are rolling observations, not a frame-time percentile
benchmark or physical-phone test. Auto quality and camera framing affect the
total draw count; the material-group table above is the controlled comparison.

Reference inspection also identified an opening-route contradiction in Ultimate.
See ULTIMATE-REFERENCE.md. The unsuccessful steering experiments are discarded;
neither clocks nor human controls were altered to make campaign checks pass.

### September 16 — Beginner upper-right fork (local development)

Added the selectable **Upper-right fork and twin pipes** demonstration. It takes
the existing right descent, passes around the pyramid room, and joins both pipe
transfers. It finishes in **64.858 seconds with zero falls**. The timed regression
also requires positive clock carryover, physical visits to the right fork and
both pipes, bounded inputs, and no direct body changes by the controller.
Browser selection and playback also pass: **64.86 seconds, 876 points, zero
falls**, with no captured console errors.

All 79 tests and the build pass. Refreshed measurements still complete every
untimed campaign race, timed bonus, and authored alternate. This adds route
coverage; it does not certify original dimensions or resolve full timed-campaign
balance. Human physics, course meshes and clocks are unchanged. Increasing
Ultimate's broad-route speeds to 3–4.5 made its runs slower or caused falls, so
that experiment was discarded.

### September 16 — timed solo campaign reaches Ultimate

The normal-input solo demo now completes the first five races under the original
clock rules, with zero falls. It collects all six Silly miniatures through physical
contact, earning 3,000 points and 18 clock units. It finishes Silly with 5.272 units
remaining. No time-limit, carryover, geometry, human steering or physics parameter
was changed; simulation/replay version remains mm-5.

| Solo timed campaign | Elapsed seconds | Remaining clock | Falls |
|---|---:|---:|---:|
| Practice | 29.742 | 36.764 | 0 |
| Beginner | 61.675 | 26.816 | 0 |
| Intermediate | 46.858 | 34.392 | 0 |
| Aerial | 56.242 | 20.061 | 0 |
| Silly | 73.892 | 5.272 | 0 |
| Ultimate | 38.400 (timeout) | 0 | 0 |

The controller can anticipate the next leg inside explicitly authored broad
waypoint corridors. Precision approaches, stop markers and timed gates keep
their direct steering. Beginner's paired demonstration takes separate routes
after the fork. Aerial's initial crossing and right-hand descent keep their
previous approach; broad zigzags alone use anticipation. The same shared physics
still applies every torque and collision.

Paired Silly demos each collect three miniatures and finish in **67.142 / 65.142
seconds, zero falls**, down from 77.508 / 81.992. Ultimate's untimed demonstrations
finish in **57.200 seconds solo**, and **62.017 / 57.217 seconds paired**, all with
zero falls. All six untimed campaign courses, all timed bonuses and all authored
alternates still complete. The 78-test suite passes; its timed solo test now
requires five courses and normal bounded inputs, and its Silly test verifies six
solo pickups or three per paired player without any body-position change from
the controller. A new fallback check also preserves per-player routes when a
custom course omits its shared route.

Browser verification: the solo Silly demo finishes in 73.89 seconds with 3,885
points and zero falls. Both paired marbles finish with zero falls, scoring
2,385 / 2,383 points; the result correctly identifies Player 2 as the winner at
65.14 seconds. No console errors were captured for the tested bundle.

**Full timed acceptance remains open.** Solo times out in Ultimate at 38.400
seconds, before the measured 57.200-second untimed finish. Both marbles still
time out in the paired Silly campaign, by 65.283 seconds. The current reports are
`campaign-measurements.json` and `timed-campaign-measurements.json`. Experimental
blanket increases to corner speed caused falls and were rejected; anticipation
is enabled only for the authored approaches that passed the course checks.

The public preview remains fb190f0cf; these improvements and the medal UI are
local development checkpoints. Original music, quantitative Amiga calibration
and physical-device acceptance are still open.

### September 16 — visible medals and reliable records (local development)

The result screen awards each finishing player a medal and reports personal bests,
high scores and save status. Course targets and records appear in the start card
and course picker, with a separate campaign-record view. Failed persistence
preserves previous data; custom-definition fingerprints isolate changed layouts.
Eight added tests cover awards and persistence behavior. Browser checks confirm
solo/two-player results, reload persistence, assisted separation, desktop and
portrait/landscape layouts. See RECORDS.md for scope and evidence. JavaScript and
CSS URLs now carry content-derived versions to avoid stale assets after updates.
The browser demo check also exposed an empty-waypoint crash on new custom
courses. The controller now falls back to the course finish when no nonempty
route exists. A regression test completes the default custom floor with both
players and zero falls for missing/empty shared and per-player routes. The
browser fixture demo then completed, with no medal awards or console errors.

This checkpoint is local; the currently published preview is fb190f0cf. Full
campaign balance, Amiga parity, music and physical-device acceptance remain open.

### September 16 — miniature collection and bird crossings (local development)

Silly revision 3 gives the two demos separate routes through the miniature room.
Each marble collects three enemies through physical contact, earning 1,500 points
and nine clock units. The controller follows each target within a bounded area;
it abandons a chase after eight seconds or when the target falls out of reach.
No position, velocity, score, clock or collision-mask override is used by the demo.
Bird forecasts include flights beginning after the off-board rest interval and
share the exact motion function used by the physical bird bodies.

The solo Silly demo finishes in **77.508 seconds with zero falls**; two-player
finishes are **77.508 / 81.992 seconds, both with zero falls**. The authored right
alternate also finishes without falls. All six untimed campaign courses and
all existing bonus/alternate checks still complete. Three added tests cover
solo/paired collections, bounded steering with unchanged body positions before
the physics step, and abandoning an unreachable miniature. **68 tests pass**.
The local browser's paired Silly demo also finishes with zero falls for both
marbles (Player 1: 77.51 seconds, 2,384 points; Player 2: 2,383 points), with
no captured console errors.

Full timed campaign acceptance remains open. With the additional pickup awards,
solo times out in Silly at **58.883 seconds** and both players time out by
**57.600 seconds** in the paired run. The clock and human steering calibration
have not been changed to make the demonstration pass. Earlier checkpoint
measurements below are historical; JSON reports contain the current results.

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

## September 20 - board junction smoothing

Static ribbon ends now share a world-space cross section, width and bank profile. Junction changes taper out within1.5world units; three-way forks use a small rounded landing with eased incoming grades. Internal joined end caps are removed. Horizontal top faces are unioned before triangulation, removing overlapping coplanar surfaces while retaining holes and distinct elevations. Rendering and Rapier consume the same compiled triangles; foundations follow the prepared pieces. The physics version advances to mm-6 so earlier input replays are not incorrectly played against new geometry. Beginner right-fork and Silly second-player demo steering were adjusted for the changed joins.

Validation: exact join profiles and input immutability across all campaign boards; overlap sample covered exactly once; stacked elevations and open holes retained. Full campaign/physics/render/audio regression suite run before release. Close-up Beginner fork visually inspected in browser; detailed full original-game parity remains open.


## September 21 — object animation and opening topology repairs

All 97 tests pass; production build and diff checks pass. See OBJECT-PARITY.md
for the reference observations and explicit remaining mismatches. Wave vertex
state now survives simulation stepping and snapshots. Munchers curl and turn;
birds flap with compound contacts matching their articulated surfaces. Aerial
has round peg banks rising from below the track. Ultimate has one launcher
island and alternative lower landings, with contact-triggered moving arms.
A settling waypoint keeps both demo marbles on the narrow ice approach using
ordinary braking/steering; no position override or extra clock time is used.

Browser verification on the release candidate: Silly solo finishes in 73.88s,
3885 points, zero falls. Bird-field replay shows moving wings and reports 60fps
at the sampled point. Ultimate two-player finishes both marbles, zero falls,
1057 points each; the faster player finishes in 52.72s, both complete by 57.20s.
No captured console warnings/errors. Close-up actor poses were also inspected.
These are desktop spot checks, not sustained mobile performance certification.

Fresh timed-campaign measurement still reports `complete: false`: solo passes
Silly with 3.285 clock units remaining and times out in Ultimate after 35.842s;
both players time out in Silly by 62.725s. These runs have zero falls but still
need full timing/control/reference calibration. This checkpoint is a repair of
the playable reconstruction, not a completed Amiga reproduction.
