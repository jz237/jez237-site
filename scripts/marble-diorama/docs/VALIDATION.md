# Validation — updated 2026-09-21

## Current outcome

**135 automated tests pass. All six campaign races and all three bonus courses
are playable. This reconstruction is published under Playable Games at the owner's request, with
completion gates open in PARITY.md.** The full campaign passes untimed one- and two-player
normal-input runs; all bonuses pass timed one- and two-player runs. A complete
timed original campaign has not yet passed. Original Amiga module playback is enabled; detailed reference-listening parity remains open.
Current simulation/replay version: `rapier-0.20.0-mm-16`.
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


### September 21 — Aerial mechanisms follow-up

The original 160–164s sequence identifies the red device as a hinged cup, not an
overhead hammer. The replacement physically holds and launches through its moving
trimesh. A normal-input approach reaches it and returns to the upper ledge without
falls. A separate resting-cup test verifies the dwell, one launch cue, bounded apex,
upper landing, and identical continuation after restoring mid-cycle.

Three rounded hollow vacuum frames share presence state with their suction and
sound; behind-mouth approaches no longer trigger capture. Intake ray tests verify
that the collider does not fill the opening. Browser close-ups check edge placement,
the upstroke and metal peg coloring. Cadence and layout details remain provisional,
as recorded in OBJECT-PARITY.md. No claim of full original parity is made.

The updated timed campaign still fails: solo expires on Ultimate and paired play
expires on Silly. Updated measurements use physics version mm-8; clocks were not
extended to hide the remaining timing gap.


### September 21 — deforming acid and measured directional turn

All acid sensors use the same closed concave triangles as the animated meshes.
Seven added checks exercise outline notches, actual rendered/native vertices and
indices, interpolation without cache mutation, snapshot collision replay, patrol
validation/editor transforms, floor clearance, and audio proximity at the current
position. Reference evidence and provisional parameters are in ACID-REFERENCE.md.

Browser close-ups at simulation 0.00 and 0.30 seconds show changing lobes and
movement, darker interiors, and a narrow brighter rim, with no captured console
warnings/errors. A local 1,200-step Intermediate physics sample took 1,303ms on an
AMD Ryzen 9 9950X3D2 16-Core Processor (about 1.09ms per physics step). This is a
local simulation sample, not a sustained rendering or physical-phone benchmark.
Full timed campaign outcome remains incomplete: solo expires on Ultimate and
paired play on Silly; no clock extension was made.

Production-build browser check: both Intermediate players finished with zero
falls and no captured errors; Player 1 finished in 46.21s and both scored 801.


### September 21 — original Intermediate clock correction

107/107 tests pass in 137,708ms. The original 86.00s banner confirms +40 for
Intermediate; campaign and single-course clocks now share that allocation.
Version mm-10 separates recordings and records made with the old clock.

The demo's precise Beginner pipe approach now requests speed 1.8 instead of 1.3,
using the existing bounded controls and physics. Solo Beginner improves from
61.67s to 59.03s without falls. The browser's paired demo finishes both marbles
without falls or captured warnings/errors (Player 1: 63.52s, 895 points;
Player 2: 896 points). A normal Intermediate race shows 39.4 after starting and
immediately pausing, consistent with the corrected 40-unit initial clock.

Fresh timed measurements preserve the existing completion assertions: solo
finishes Silly with only 0.285 units remaining; both players finish Aerial.
Solo times out in Ultimate after 32.00s, and both players time out in Silly by
58.88s. Full campaign balance is still not accepted. No completion assertion,
clock rate, torque, speed limit, collider, or hazard was weakened to pass this
check. See CLOCK-REFERENCE.md and timed-campaign-measurements.json.


### September 21 — Practice targets and six-race finish scoring

115/115 final tests pass in 138,230ms; production build and diff check pass.
Browser check captured no warnings/errors.

New native checks cover landing on all three actual shelves; rejection of rolling
starts, high overflights, undersides and unpainted margins; independent players;
repeat prevention; midair snapshot continuation; floor-relative editor transforms,
deletion and JSON validation; and the full-start ordinary-input bonus route.
All six native goal checks separate their fixed awards from clock points. A
reference-state Ultimate test produces 58470 after finishing, then 79470 after
the separate campaign ending. Bonus events reach the effects bus per player.

Browser production-build inspection shows the 3–6 markings. The selectable left
landing route finishes in 26.94s, zero falls, 6413 untimed points (including 5000
landing and 1000 finish awards), with visible bonus feedback. Full original
landing-score interpolation and repeat policy remain provisional. Full campaign
timing remains incomplete: solo expires on Ultimate and paired play on Silly.
See PRACTICE-SCORING.md for original footage and exact limits of these checks.


### September 21 — Beginner hazards and steelie knockout lifecycle

Restored the upper maze steelie and three independently curling pyramid-room
munchers identified in both original recordings. All use active native collision
and pursuit. Steelie knockouts now award 1000 points once, retire the enemy body,
and emit a reward cue and visible notice. Supported lower elevations are not
mistaken for a fall. See BEGINNER-ENEMIES.md for footage and provisional policies.

New checks cover native rolling impact and fall, no automatic respawn, no award
for an uncontacted fall, the last contacting player, snapshot continuation and
lower supported elevation. Audio event keys distinguish the two players.

The original route stalled against the newly restored upper enemy. The revised
route passes around it and the neck muncher with normal bounded controls.
Quicker approaches and final-stretch steering keep solo Beginner at 59.27s with
zero falls. Timed paired Beginner completes both by 64.72s with zero falls.
No original clock, physics limit, enemy collider or acceptance assertion changed.

Fresh full-campaign measurements retain solo completion through Silly (0.285
units left) and paired completion through Aerial. Full timed completion remains
open: solo expires in Ultimate at 32.00s and both players expire in Silly by
57.60s. The change is recorded as mm-12 to separate older recordings and records.

Browser close-ups at 0.00 and 0.15s confirm three different curling poses on the
actual Beginner board, with no captured warnings/errors. A paired browser run
also displayed the steelie +1000 notice and finished both players with zero falls.

Release verification: 121/121 tests pass in 185,325ms; production build and diff
check pass. The final paired Beginner browser run finishes both marbles without
falls or captured warnings/errors (Player 2: 64.20s, 2894 points; Player 1: 2877).


### September 21 — pipe and upward-transfer rewards

127/127 tests pass in 187,296ms; production build and diff check pass.
The geometry's shared center curve now tracks continuous inlet-to-outlet travel.
Beginner's separate upper pipe pays 4000; its lower pipes, Intermediate's orange
pipe and Silly's upward transfer pay 2000. These amounts are verified against
original Amiga recordings. Repeat policy and spatial tolerances remain provisional.

Native checks reject exterior travel, backwards entry, skipped interiors and
abandoned traversals. They verify independent players, mid-pipe replay, editor
transforms and imported object-property IDs. The existing normal-input campaign
routes verify the real pipes, including the alternate Intermediate route.

The paired Beginner browser demo finishes both players without falls or captured
warnings/errors: Player 1 earns 8877, Player 2 earns 4894 and finishes first at
64.20s. The visible transfer notice shows +2000. Native event checks verify the
first player's 4000+2000 and the second player's lower-pipe 2000.

Fresh mm-13 full-campaign timing retains the prior outcomes: solo expires in
Ultimate at 32.00s and paired play expires in Silly by 57.60s. No physics, clock,
route controls or acceptance assertions changed. Full parity remains unfinished,
including the original Silly transfer geometry and miniature appearances.
See TRANSFER-SCORING.md for evidence and limitations.


### September 21 — Silly miniature forms and physical animation

The miniature room now contains three steelies, three curling munchers and
three low deforming acid puddles, replacing six spherical placeholders. New
native checks verify support within 1% of radius, constant mass, matching
visible/collision vertices, snapshot continuation, and exactly-once physical
collection for all three forms. Imports preserve and validate the subtype.
See SILLY-MINIATURES.md for original frames and reconstruction limits.

The paired browser demo finishes both players with zero falls and no captured
warnings/errors: Player 1 scores 9385; Player 2 scores 9383 and finishes first
at 64.78s. Close-ups on the actual board show the changing curl and low puddle.
The demo still requires six pickups; the three newly restored inhabitants
remain available on the board. Existing pickup/finish assertions are retained.

Updated mm-14 timed measurements show solo Silly finishing at 73.225s with
0.793 clock units left. Solo still expires in Ultimate after 32.00s; paired play
still expires in Silly by 57.60s. Full timed campaign acceptance remains open.
The paired demo's right bird-field steering speed changes from 2.5 to 3.2;
original clocks, player control limits and bird collision/flight paths are intact.

Release checks: 130/130 tests pass in 241,167ms; production build and diff check pass.


### September 21 — powered upward transfer

Silly's sloped tube is replaced by a downward-facing flared intake, vertical
neck and upper outlet. The eight-unit floor-to-floor rise carries the native
sphere with bounded forces. Visible geometry, airflow and traversal scoring
share the same variable-radius center curve. No transfer teleport or direct
velocity assignment is used. The entire upper assembly, enemies and route
heights move together. SILLY-TRANSFER.md records the original sequence and
explicitly leaves the second functioning horn and original transfer law open.

New native checks verify unsteered ascent, continuous movement, reward at the
outlet, mid-transfer snapshot equality, shared cross-sections, force limits and
import validation. The audio test verifies that airflow cues occur only during
active carriage and do not double up for two players in the same passage.

The paired browser demo completes both players with zero falls and no captured
warnings/errors: Player 1 scores 9385, Player 2 scores 9383 and finishes first
at 65.33s. Browser inspection confirms the flared inlet and outlet. The demo
brakes on the landing and uses right bird-field approach speed 3.8 after the
changed arrival timing; no bird flight, collision or timer is weakened.

Fresh mm-15 timed measurements retain solo completion through Silly at 73.833s,
with 0.318 clock units left; Ultimate still times out at 32.00s. Paired play
still times out in Silly by 57.60s. Full timed campaign acceptance remains open.

Release verification: 133/133 tests pass in 241,685ms; production build and diff check pass.


### September 21 — both Silly lift outlets

The shared physical red transfer now connects its lower inlet to both upper
horns. Each branch passes a no-steering ascent with continuous motion, one 2000
award, zero falls, and deterministic replay from inside the lift. Mesh checks
find no unmatched or multiply used wall edges; a directed-edge check also finds
consistent winding. Seeded outlet choice and occupied-exit fallback have focused
checks. These are reconstruction rules, not certified Amiga behavior; see
SILLY-TRANSFER.md for the limits of the new arcade-code reference.

The full Silly solo/paired tests retain their existing zero-fall, collection,
award and finish-time assertions. A fresh local browser paired demo also finished:
P1 9383 points, P2 9385 points, both zero falls; P1 first at 64.46 seconds.
No browser warnings/errors were captured. A close-up browser inspection verified
both flared horns and their connected neck. No physical phone testing is claimed.

Fresh timed measurement still fails the whole-campaign gate: solo completes
Silly in 71.5167 seconds with 2.1276 clock units left, then times out in Ultimate
after 34.5667 seconds. Paired players complete Aerial, then both expire during
Silly by 57.6 seconds. All of these measured timed runs have zero falls.


Regression validation: all 135 automated tests pass (262.1 seconds). The final
small demo-route reset guard received a further solo/paired Silly check. Production
bundling and diff checks pass. The replay/record version is mm-16.


### September 21 - Aerial 3x4 peg beds

Replaced the three synchronized three-peg lines with three twelve-cap beds.
Footage shows perpendicular lines of three and four pegs and an approximately
0.76-second rise/hold/return stroke. Shared geometry and simulation-clock poses
control physical contact and display; selection and precise layout remain
reconstructed. See AERIAL-PEGS.md for observations and limitations.

Focused tests verify both line orientations, flush caps, invalid grid/route
rejection, physical lifting of a marble and mid-stroke replay. Demo approaches
stop outside the beds and forecast the crossing using ordinary steering.
The existing timed solo check through Silly and paired Aerial zero-fall check
pass without changing their assertions or the game clocks.

Fresh mm-17 timed campaign: solo Aerial 61.2s, Silly 71.5167s with 0.1276 clock
units left; Ultimate still times out at 32s. Paired Aerial completes by 66.5167s;
both players then expire in Silly by 55.0417s. Every measured run has zero falls.
The full timed campaign remains incomplete.

The production-build browser demo also finishes both Aerial players with zero
falls: P1 4944 points, P2 4943 points; P1 first at 61.20 seconds. Close-ups show
flush caps and both perpendicular raised lines; no warnings/errors were captured.

Current mm-17 release validation: all 136 tests pass; production build and diff checks pass.


### September 21 - vacuum emergence and capture

All three Aerial vacuum mouths rise/retract over approximately 0.24s, with
recessed solid rear housings. The physical pose, visible pose, suction position
and proximity sound share deployment state. Captures now take approximately
2.1s and draw solid striped fragments into the mouth before returning and
reforming at the physical respawn destination. Mid-capture snapshot restoration
and fixed-time rendering checks pass. See AERIAL-VACUUMS.md for primary evidence
and the still-provisional repeat cycle, force and fragment choreography.

Browser close-ups verified the recessed intake, solid fragments, partial and
complete retraction, fragment return and restored marble; no warnings/errors
were captured. This does not establish full Amiga parity.

Release validation: the full 139-test suite passes (262193ms). The final solid
fragment geometry and shared-pose refactor received a further complete object
animation/audio test run, including the new closed-sector volume check. Build
and diff checks pass. Physics/replay version is mm-18.

Fresh timed measurements retain zero falls throughout: solo Aerial 61.1917s,
Silly 71.5167s with 0.1276 clock left, Ultimate timeout 32s; paired Aerial 66.5167s,
then both Silly timeouts by 55.0417s. Full campaign acceptance remains open.


### September 21 - vacuum alignment and attached workshop hazards

Compared the original 150.80s frame with close-up rendered views. The first pair
now mounts on the rear edge facing the track, and the lower mouth turns onto
the next zigzag leg. Physical support rays verify the front of each opening.
The housing defines suction origin/direction even after workshop relocation,
rotation and JSON round trips; stale absolute zone fields are ignored. Removing
either linked item removes the complete hazard. Physical front capture/rear
rejection after editing and the existing acid/pipe/landing/general editor checks
pass. Exact positions and dimensions remain reconstructed; see AERIAL-VACUUMS.md.
Physics/replay version is mm-19.

Fresh mm-19 timed measurements: solo Aerial 61.175s, Silly 71.5167s with
0.1276 clock left, then Ultimate timeout at 32s. Paired Aerial completes by
66.5s, then both expire in Silly by 55.0417s. All measured runs have zero falls.

Release checks: all 142 tests pass (262402ms); production build and diff checks
pass. A local production-browser two-player Aerial demonstration finishes with
zero falls for both players and no captured warnings/errors. Close-up inspection
shows both upper openings on the rear edge and the lower opening turned onto
the following leg. This release does not establish full Amiga feature parity.


### September 21 - Intermediate continuous traveling crests, mm-20

Replaced the two short sinusoidal patches with one continuous strip using
positive asymmetric traveling crests and long flat intervals. See
INTERMEDIATE-WAVES.md for primary-frame observations, approximate 2.4s cadence,
reference-coordinate measurements, and remaining scale/profile uncertainties.
Panel tops and undersides stay joined. The shared convex geometry lifts a real
marble and restores the same contact outcome from a snapshot. Graph lines and
textured side colors remain continuous across panels.

All 144 tests pass (272060ms). Production build and diff checks pass. The actual
production browser's orange-pipe/wave alternate demo finishes in 56.07s with
zero falls and no captured warnings/errors. Close-ups verify the moving profile,
joined underside, graph alignment and side texture. Four additional native runs
starting at the wave entrance with different phases all finish without falls.

Timed campaign measurement remains incomplete: solo Intermediate 46.2s, Aerial
61.175s, Silly 71.5167s with 0.1276 clock left, then Ultimate timeout at 32s.
Paired Intermediate finishes by 47.7583s and Aerial by 66.5s, then both players
time out in Silly by 55.0417s. All these measured runs have zero falls. Full
campaign acceptance and full Amiga parity remain open.


### September 21 - connected wave editing

Fixed invalid wave rotation and made each new wave strip a single editor object.
Move/rotate keep every panel and its animated seams together; remove/erase clear
the complete strip and linked references. Imported ungrouped panels also rotate
correctly. Moving starts, goals and unlinked zones leaves unrelated routes alone;
aliased linked waypoints move once instead of once per route containing them.

Production build and diff checks pass. All 29 focused tests pass (6928ms), covering
workshop motion, extras, animated objects, rendered surface geometry and crest
physics. Four new regressions cover grouped transforms/removal, legacy panel
rotation, live physical contact and snapshot restoration after editing, and
unrelated route preservation. The prior full 144-test campaign release remains
the latest complete suite; this editor follow-up does not claim a new full-suite
run or full Amiga parity. Physics version stays mm-20 because campaign dynamics
are unchanged by the authoring metadata.

Actual browser checks verify grouped selection, rotate, move, removal, undo/redo,
restoration of the original layout and playtest startup without captured errors.
See INTERMEDIATE-WAVES.md for the geometry and reference limits.


### September 21 - Intermediate board-axis acid patrols, mm-21

All five Intermediate puddles now follow board-axis patrols. Registered primary
frames establish additional visible directions and upper-right turns; full loops,
return legs, world distances, speeds and initial phases remain reconstructed.
See ACID-REFERENCE.md for the trace and identity limits where puddles overlap.

All 148 tests pass (271003ms), including the four connected-wave workshop tests
from the previous release. Production build and diff checks pass. Each acid's
entire outer footprint is checked at 160 samples across its complete loop for
flat-floor contact and clearance from pyramid refuges. Corner timing and board
axis alignment are also checked. Browser close-ups show the revised motion;
the production two-player Intermediate demonstration finishes both players with
zero falls and no captured warnings/errors (P1 46.20s, 3801 points each).

Fresh mm-21 timed campaign results remain unchanged: solo Ultimate times out at
32s and both players time out in paired Silly by 55.0417s, with zero falls in all
measured runs. Full campaign acceptance and full Amiga parity remain incomplete.


### September 21 - acid dissolution and fragment recovery, mm-22

The Ultimate recording's 287.32-289.84s acid capture now has a separate response:
solid-color reaction, sinking cap following the pool, absence, then scattered
pieces reassembling at the saved physical respawn destination. Recovery takes
300 ticks / 2.5 seconds. The independent clock continues; timeout cancels the
visible response and prevents respawn. Generic shatter particles and breaking
cue are replaced for acid; the bubbling cue is still designed, not authentic.
See ACID-REFERENCE.md for evidence and remaining reconstruction limits.

All 152 full-suite tests pass (271545ms). After browser inspection found repeated
fragment textures, the final acid/object-animation target passes all 19 tests
(7027ms, including final texture and rotation corrections). This adds
one new whole-marble texture regression, bringing the test inventory to 153;
the complete suite was not rerun after those presentation-only corrections.
Production build and diff checks pass. Tests cover actual acid contact, saved
recovery state, independent two-player outcomes and clocks, timeout, deterministic
mid-capture restoration, cap clearance, pause stability, fragment convergence,
texture alignment and acid cue routing. Vacuum sectors now also converge to
the respawn orientation. Browser close-ups verify contact, dissolution, absence,
return and continuous reassembly without captured warnings/errors.

Fresh mm-22 timed campaign outcomes are unchanged: solo Ultimate times out at
32s and paired Silly by 55.0417s; all measured runs have zero falls. Full timed
campaign acceptance, exact original effects and full Amiga parity remain open.

The final production-browser paired Intermediate demo finishes both players with
3801 points and zero falls (P1 46.20s), without captured warnings/errors.


### September 21 - hard-landing dizziness, mm-23

Primary Aerial drops show intact marbles with blue circling marks, lasting about
1.28-1.44 seconds in sampled footage; an Ultimate descent shows about 2.84s.
The initial Ultimate drop is dizzy, but its following catapult landing is not.
Added real-contact dizziness with independent clocks/control, continued momentum,
blue orbiting marks, HUD feedback and a newly designed warble. Impulse-launch
flights are exempt until the next landing; later unassisted drops still stun.
Threshold, duration law, control response and exemption remain reconstructed.
See LANDING-DIZZINESS.md for observations and unresolved original behavior.

All 160 tests pass (282586ms). Seven focused landing tests pass (3335ms), covering
soft/hard drops, moving-surface relative velocity, side impacts, independent
players, continued drift, resumed controls, deterministic snapshots during both
dizziness and a real catapult flight, and no lingering launch immunity. Build
and diff checks pass. Earlier full-suite failures exposed the missing assisted
landing distinction; the final suite includes both Ultimate branches and the
paired zero-fall completion checks. Beginner's fork finishes with 19.785 clock
seconds and no falls; its assertion now checks the intended original-clock
completion requirement instead of an incidental 20-second spare-time margin.
No demo route, steering strength, course geometry or clock allowance changed.

Browser close-ups confirm orbiting marks around a moving, rotating marble,
recovery in place and no fall count. The final production two-player Ultimate
untimed demo finishes both marbles with 7057 points and zero falls (P2 52.72s),
with no captured warnings/errors. This does not certify a timed Ultimate finish
or authentic original sound.

Fresh timed campaign measurements still fail solo Ultimate at 32s and paired
Silly by 55.0417s. All measured runs have zero falls. Full campaign acceptance,
original-control calibration, effect fidelity and full Amiga parity remain open.


### September 21 - Ultimate launcher landing reward, mm-24

The original recording's 48590-to-50590 change around 280.24s establishes a
2000-point award on arrival at the lower left island, before its ice bridge.
Both reconstructed branches now award 2000 after a real launcher flight lands
on the corresponding island. Exact occluded collision boundary, original repeat
policy and right-route/paired behavior remain unverified. See ULTIMATE-REFERENCE.md.

New regressions cover both actual launches and landing awards, snapshot restore
midflight, independent player credit, no award for an unassisted drop or failed
flight, no repeat claim, rotated/moved destination bounds, overhead rejection,
JSON validation and destination removal. The existing real-contact query is now
shared with dizziness, retaining moving-ground and restored-collider handling.
The initial focused launch/dizziness set passes all 12 tests (8781ms).

The production browser's paired Ultimate untimed demo finishes with 9057 points
for each player, exactly 2000 above the previous release, zero falls and the same
P2 52.72s finish. The landing notification is present and no warnings/errors were
captured. Ordinary steering, geometry, launch impulse, clocks and demo routes
are unchanged. The existing reward sound is designed, not original Amiga audio.

Fresh mm-24 timed measurements still fail solo Ultimate at 32s and paired Silly
by 55.0417s, with zero falls throughout. The scoring correction does not resolve
full timed campaign acceptance or establish full Amiga parity.

The final complete suite passes all 165 tests (282204.54ms), including the
rotated destination edge checks. Production build and diff checks pass.


### September 21 - Ultimate curved white start and raised ledge, mm-25

An enlarged 275.2s original frame and the 274.0-278.4s movement sequence correct
the earlier recessed-surface interpretation: the marble climbs a curved white
face onto a raised white ledge, with a visible red wall below. Replaced the gold
starting pyramid with a solid sampled white ramp and ledge, using existing shared
ribbon/floor geometry. Dimensions and curve profile remain reconstructed. The
course revision is 3; physics/replay is mm-25. See ULTIMATE-REFERENCE.md.

Three added regressions check the curve against actual collision rays, continuous
foot/crest joins, visible positions matching collision vertices, held-input
climbing and snapshot replay from the slope, and both demo routes visiting the
ramp/ledge before dizziness, launch and the 2000 landing award. Existing paired
Ultimate completion and both launch-to-bridge checks pass (2 tests, 11433ms).
The paired landing-award test's untimed observation bound increased from15 to20s
to include the longer approach; game clocks and acceptance conditions are unchanged.

The production browser shows the ramp joining the raised ledge and both marbles
climbing through the same surface. Both players finish the full untimed demo with
9057 points and zero falls (P1 61.99s), with no captured warnings/errors. The solo
opening's measured sequence is dizziness12.2417s, launch13.1917s and landing award
14.7417s; these are reconstructed gameplay timings, not recovered Amiga constants.

Fresh timed campaign measurements still fail solo Ultimate at32s and paired
Silly by55.0417s, with zero falls throughout. Torque, clock allowances, catapult
impulse and the lower course are unchanged. Full timed campaign acceptance,
exact geometry and full Amiga parity remain incomplete.

The final complete suite passes all 168 tests (278740.14ms), including the
new start geometry and updated observation bound. Build and diff checks pass.


### September 21 - Ultimate ice-exit guard and complete right route, mm-26

Added the footage-observed black steelie below the ice pyramids, using existing
physical enemy behavior and knockout scoring. Two new regression tests pass
(29896ms): both complete solo routes with bounded inputs, actual guard contact on
the main route, explicit right-room/outer-ice/right-finish visits, and an actual
platform collision fixture paying1000 exactly once. Main62.01s/right108.53s,
zero falls. A previous right-route diagnostic failed before reaching the guard:
acid contacts at35.56s/39.18s and later ice falls. Corrected the demo approach and
ice steering hints; retained the hazards, outer ice lane and player physics.

These untimed results do not satisfy timed campaign acceptance. Steelie AI
constants and original right-side traversal remain provisional. See
ULTIMATE-REFERENCE.md for sampled Amiga evidence and limits.

Local browser validation of the production build completes the right-route demo
in 108.53s with 8955 points and zero falls. The black guard is visible on its platform during the
final approach; no captured warnings/errors. Timed campaign measurements remain
incomplete: solo Ultimate expires at32s, paired Silly at55.0417s, all zero falls.

The final full suite passes all 170 tests (281513.42ms). Production build and
whitespace checks pass. The existing paired Ultimate main-route test also passes
with zero falls. No timed allowances or human controls changed.

### September 21 - Ultimate changing final room, mm-27

Rebuilt the missing final sequence from two Amiga recordings. It now includes
three disappearing entry spans, staggered dark crossings with disappearing
corners, an uphill/ice return and a gold disappearing goal approach. The entry
cycle is supported by aligned video frames; world dimensions and later phase
relationships remain reconstructed. See ULTIMATE-FINAL.md for evidence and limits.

The expanded full suite passes 172/172 tests (297976.97ms), including native
collision rays, snapshot continuation and complete untimed routes. After that
run started, stationary vanishing pieces received the existing rounded-corner
geometry in both mesh and collider. The final geometry passes seven focused
tests (41117.82ms: final-room collisions, solid boards, both complete solo routes
and the real steelie knockout) and the existing disappearing-platform regression
(291.03ms). Separate final-source full solo and paired runs complete at
96.375s and 96.375/102.375s respectively, all with zero falls and normal steering.

Untimed observation caps rose to 150s for paired Ultimate and 180s for the two
solo route checks to accommodate the longer room. Actual race clocks, player
torque and the bounded-input/zero-fall assertions are unchanged. Timed campaign
measurement still fails solo Ultimate at 32s and paired Silly at 55.0417s, all
with zero falls. Those timed failures occur before the changed final room.
Full timed campaign acceptance and complete Amiga parity remain unfinished.

Final presentation check corrected the permanent lower landing to white ceramic,
matching the other stable junctions. The seven focused checks were rerun on this
release source and pass (40942.39ms); full solo/paired diagnostic traversal retains
the same completion times and zero falls. Browser verification completes the
paired production demo with 8895 points each and zero falls; a close-up scene
using the final source also completes the final room with zero falls and confirms
the aligned grid, rounded solids and white lower landing. Neither browser scene
captured warnings/errors. Production build and whitespace checks pass.
