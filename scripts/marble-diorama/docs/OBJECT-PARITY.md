# Object parity audit — September 21, 2026

**Status: partial. Full Amiga feature parity is not complete.** This audit separates
observations in the original recording from reconstructed behavior and automated
checks. Passing a demo is evidence of a route being traversable, not fidelity.

September 22 follow-up: static source inspection confirmed another omitted
family, **four orange Aerial finish hammers**. Their original placements,
region-10 wake-up, four stagger patterns, graphic sequence and collision
rectangles are recovered. A local native-board fixture now animates physical
3D mallets using those scripts. The public authored board still omits them;
3D shape, original impact response, global random state and wall-clock cadence
are not certified. See [AERIAL-HAMMERS.md](AERIAL-HAMMERS.md).

September 22 vacuum follow-up: source inspection establishes six Aerial mouths.
The local native-board implementation restores region-driven activation, paired
occupancy, deployment/withdrawal counts and front attraction/capture fields.
An independent script interpreter matches 17,640 actor observations. Shared solid
meshes govern housing contact. Public Aerial still has three reconstructed mouths;
cadence, original body response, dimensions and fragment trajectories remain open.
See [AERIAL-VACUUMS.md](AERIAL-VACUUMS.md).

Reference: [World of Longplays / Ironclaw, Amiga difficulty 0](https://www.youtube.com/watch?v=Nfa2etJ84_8).
The next local native-board pass restores Aerial's contact-driven paddle script
and launch velocity ranges, plus recovered airborne gravity and terminal speed.
The first higher-lane landing passes on recovered terrain. Shared meshes govern
cup contact; its source-directed spring impulse preserves the marble's position.
Cadence, capture/paired behavior, global random state and other limits remain
open. See [AERIAL-PADDLE.md](AERIAL-PADDLE.md). Public Aerial is unchanged.

The local peg follow-up recovers the separate three-bed selector, four group
animation tables, 13-update strokes, 0/16/32/48-update waits and region-4/5
activation. Independent table traces match 12,000 bed observations. Original
sprite grouping versus the three selected collision cells, eruption response,
random-state/cadence and sound assignment remain open. See [AERIAL-PEGS.md](AERIAL-PEGS.md).
The published video-based selector remains unchanged until native-board release.

Video timestamps below refer to the existing local copy. Frame sequences were
inspected, including 100.00–102.28s at 0.12s intervals, 238.00–239.32s at 0.12s,
165.00–169.56s at 0.24s, and 277.0–283.0s at 0.4s. Private reference images are
not included in the published game.

| Course / object | Findings and changes | Still unverified or missing |
|---|---|---|
| Hard landings / dizziness | Aerial drops show blue circling marks while an intact marble continues moving; three sampled effect durations are about 1.28-2.84s. Added actual-contact landing dizziness, independent clocks/controls, physics-driven drift and shared-clock blue marks. The inspected Ultimate catapult landing has no dizziness; assisted-flight exemption is reconstructed. See LANDING-DIZZINESS.md. | Exact impact threshold, duration law, input response, immunity, difficulty dependence and original sound remain provisional. |
| Practice gates and numbered pads | Four numbered landing labels replace the 20/30/40 plaques; supported airborne landings award points, with a normal-control bonus route to the finish. | Original complete award formula, repeat policy and exact shelf dimensions remain provisional; gates still need comparison. See PRACTICE-SCORING.md. |
| Beginner enemies and pipes | Restored the omitted upper steelie and all three pyramid-room munchers. Physical steelie knockouts now award 1000 once, with reward cue and notice. Completed pipes now pay their footage-verified 4000/2000 awards. See BEGINNER-ENEMIES.md. | Exact positions, AI, paired credit policy, fall threshold, retirement policy, pipe shapes and entry behavior remain provisional. |
| Intermediate munchers, 100–102s | Original green creatures curl down and stand up repeatedly, with yellow mouths. Replaced the rigid capsule/painted stripe with articulated green solids and a yellow mouth. Turns follow the pursuit direction. Shapes animate in simulation time and are used for both drawing and contact. | Curl is a reconstruction (~0.6s cycle), not a recovered sprite sequence. Original AI, distances, hit timing and the complete body silhouette remain unverified. |
| Intermediate waves, 121–131s | Replaced two short sinusoidal sections with a continuous strip of raised traveling crests and flat intervals, using the observed approximately 2.4s cadence. Top and bottom panel edges stay joined; graph lines and side textures continue across joins. Shared geometry lifts the marble and restores deterministically. See INTERMEDIATE-WAVES.md. | Exact world scale, placement, profile dimensions, end taper and original response remain reconstructed. Visible lower cyan ramp sections remain pixel-identical in eight 123.0–124.4s frames; exact lower-lane shape and the remaining sections need comparison. |
| Intermediate / Ultimate acid, 109–114s | Replaced rigid disks with dark green, deforming lobed surfaces. Rendering and sensors share the complete concave mesh, including safe notches. All five Intermediate puddles now follow board-axis legs, including additional upper-right perpendicular turns; sound follows current position. A sampled Ultimate death now drives a distinct ~2.5s dissolve/absence/fragment-return sequence. See ACID-REFERENCE.md for measured screen centers. | Full original outlines, deformation cadence, dimensions, complete patrol loops, identity through overlapping outlines, speeds/phases and Ultimate paths remain provisional. Exact capture speckling, fragment paths, original respawn selection, Intermediate-specific death comparison and original sound remain open. |
| Aerial pegs, 161.28-162.60s and 166.20-169.44s | Rebuilt three 3x4 beds with visible flush caps. Full lines of three or four pegs rise in perpendicular directions, sharing the rendered/collision pose. Stroke now follows measured ~0.20s rise, 0.36s hold, 0.20s return. | Locations, dimensions, idle probability and seeded line selection remain reconstructed. The original selection law and complete coverage of every bed are unverified. See AERIAL-PEGS.md. |
| Aerial red paddle, 160–164s | Frame sequence shows a cup holding the marble, hinging upward, and throwing it onto an upper ledge. Replaced the overhead crusher with a red recessed cup, stem, metal hinge, and contact-triggered stroke. The moving concave collider provides the launch; no injected impulse or teleport. Ordinary held-input entry and upper-ledge landing pass. | Dimensions, placement, and 0.9s stroke are reconstructed. The observed ~0.5s dwell is represented; original launch law and exact return destination still need measurement. Gray ramp geometry remains open. |
| Aerial vacuums, 146-154s | Three recessed yellow housings now rise and retract physically, with two aligned to one zigzag edge and the third turned onto the next. Suction and audio follow each moving intake and stop below the track; linked workshop transforms and deletion retain that relationship. Vacuum captures have an approximately 2.1s fragment-intake/return/reassembly sequence, with solid striped sectors, saved state and shared respawn destination. See AERIAL-VACUUMS.md. | Repeat periods, positions/orientations, dimensions, force, exact capture threshold and fragment trajectories remain reconstructed; original sound and full appearance cadence need further comparison. |
| Silly birds, 238–239s | Original purple birds have changing wing silhouettes during crossings. Replaced rigid diamonds with articulated purple bodies, heads, beaks, tails and independently posed wings. Wing collision solids deform with the visible wings. | Straight crossing paths, bird count/rest intervals and 3.2Hz wingbeat are provisional; exact original flight/impact animation is not certified. |
| Silly miniatures / uplift | Restored nine miniatures in three forms (steelie, curling muncher, deforming puddle), with shared visible/collision shapes; contacts award +500/+3; the powered, flared upward passage carries the physical marble and pays the footage-verified 2000. | Exact miniature layout, dimensions, movement and repeat policy remain open; see SILLY-MINIATURES.md. Both horn passages are reconstructed; side loops, scale and original selection/transfer law remain open. See SILLY-TRANSFER.md. |
| Ultimate opening, 277–283s | Removed the unsupported serial three-launch route. The starting field now drops onto one launcher island, which sends the marble to either of two lower landing islands; each has its own ice bridge. Two contact-triggered hinged arms replace static pads. Both approaches are checked with ordinary controls and one launch, with no visit to the opposite island. Successful launcher landings now pay 2000 per player, matching the traced left-platform arrival before the bridge. | The paired arms, velocities and stroke are a playable reconstruction, **not a recovered launch law**. The raised gold starting pyramid is replaced by the observed curved white climb and elevated ledge; the earlier recess description was incorrect. Ramp/ledge dimensions, gold guide shape and exact dimensions remain open. The award's precise occluded contact boundary, repeat policy and original right-side/paired behavior remain unverified. The recording establishes the left route; full original right-route traversal is still unverified. |
| Ultimate ice-exit steelie, 311-318s | Restored the omitted black guard on the gray exit platform below the four ice pyramids. Native collision and falling defeat pay the observed 1000; both complete demo routes now finish without falls, including the outer right ice lane. See ULTIMATE-REFERENCE.md. | Exact position, pursuit/torque/mass, paired attribution and retirement policy remain reconstructed. Full original right route and timed acceptance remain unverified. |
| Ultimate changing final room, 315-346s | Rebuilt the disappearing entry, staggered crossings including dark corners, rising ramp, turquoise return and gold approach. Entry repeats in six seconds with sampled 1.5s phase steps. Both upper routes share this finish. See ULTIMATE-FINAL.md. | Cell footprints, lower/goal phase masks, absolute start phase, difficulty scaling and full original route coverage remain reconstructed; timed acceptance is open. |

## Implementation safeguards and validation

- Physics/replay version is `rapier-0.20.0-mm-27`: old recordings cannot silently
  claim compatible outcomes after collision, layout, and clock changes.
- Enemy articulation is a pure function of the simulation clock. Shape reuse is
  bounded; fixed body solids are not rebuilt every tick. Rendering uses separate
  writable buffers so animation cannot mutate cached collision shapes.
- New regressions exercise wave vertices after actual physics steps/restoration,
  outward actor triangles, changing rendered poses, compound wing contacts,
  enemy snapshot replay, peg withdrawal/extension, and both Ultimate openings.
- Close-up browser inspection uses the actual actor renderer. The complete
  campaign regressions still exercise ordinary bounded inputs and fall recovery.
- Remaining work above is not hidden by the Playable Games listing. That listing
  was explicitly requested for an unfinished playable reconstruction.

Earlier mm-15 release checks: 133/133 automated tests passed; production build and diff check passed.
Silly solo and Ultimate two-player browser demos finish without falls or captured
console errors. The full timed campaign still fails; see VALIDATION.md.

The Aerial follow-up additionally verifies hollow intake ray clearance, absent-mouth force/collision removal, directional capture, delayed launch cues, deterministic mid-launch restoration, and physical upper-ledge landing. Browser close-ups confirm the resting/raised cup and intake placement. Explicit metal/color materials now retain their side colors instead of inheriting the orange board tint.


The scoring follow-up also restores the footage-verified fixed goal awards
(1000–6000) and Ultimate's ordinary unused-clock award before the separate ending
tally. Progress scoring, original paired-race bonuses and full landing-target
interpolation/repeat behavior remain open; see PRACTICE-SCORING.md.


### Silly transfer  -  second functional outlet, mm-16

The second horn now carries a real marble through a connected shared-mesh chamber
to the opposite maze approach. Both exit tests verify continuous movement,
scoring and snapshot replay. Solo and paired normal-input Silly runs finish with
zero falls. Outlet selection is a seeded reconstruction with occupied-exit
avoidance; the arcade reference is not yet mapped to the Amiga Silly mechanism.
Exact dimensions, selection law and side loops remain open. See SILLY-TRANSFER.md.

Current mm-17 release validation: all 136 tests pass; production build and diff checks pass.

Latest mm-18 validation: full 139/139 suite passes, followed by a complete
object-animation/audio rerun for final fragment geometry and pose factoring.
The added solid-sector test passes. Build, browser close-ups and diff checks pass.
See AERIAL-VACUUMS.md and VALIDATION.md for scope and remaining gaps.

### Aerial descending ledges (mm-33)

Two continuous ramps on the left descent are corrected to physical ledges,
matching the original airborne drops and subsequent dizzy recovery. Both
solo and paired normal-input routes finish without falls and trigger the two
landings. Exact dimensions and landing calibration remain partial. See
AERIAL-LEDGES.md.
