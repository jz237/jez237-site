# Per-course parity checklist

## Current local integration

The mm-36 local entry point now loads the six recovered board definitions and
their native actors through [native campaign integration](NATIVE-CAMPAIGN.md).
Practice passes timed solo/paired normal-input completion on difficulties 0 and
7. The mm-37 local Beginner board adds [three physical pipe passages](NATIVE-PIPES.md),
including the shared lower Y and recovered capture rules. The mm-38 local
Intermediate board adds its orange pipe and a shared visible/physical tunnel
through the raised bridge; its localized normal-input passage and replay pass.
The mm-39 Ultimate [gold transfer](NATIVE-GOLD-TRANSFER.md) now has a continuous
physical fork, with both exits, paired entry and replay tested locally. Its
housing fidelity, remaining native objects, full routes and diorama polish still
prevent publication. The legacy checklist below describes the **published older
reconstructions**, not validation of the newly integrated boards.

The mm-40 Practice board adds [ten rounded physical training rails](NATIVE-PRACTICE.md).
Its existing timed solo/paired routes still pass; native numbered shelf awards
and alternate-route acceptance remain open.

## Published reconstruction status

The recovered Ultimate code contradicts the older hinged-catapult interpretation
below: its gold inlet selects one of two static outlet housings. The original
rules are verified separately and a continuous physical fork is integrated
locally. Its curved housing and full-course acceptance remain incomplete.

See [the September 21 object audit](OBJECT-PARITY.md) for timestamped findings, fixes and known mechanism mismatches.

Local recovered boards include [recovered slinky rules and shared
physical bodies](NATIVE-SLINKIES.md). They now replace the local entry point but
have not replaced the published campaign.

The latest native Silly fixture adds [recovered birds](NATIVE-BIRDS.md),
[miniature room behavior](NATIVE-MINIATURES.md) and the original
[uphill slope acceleration](NATIVE-SLOPES.md), plus the red transfer's recovered
[inlet acceleration and outlet choice](NATIVE-TRANSFER.md). These changes are
integrated locally and still require full-course route and release validation.

All six races are playable reconstructions. **None is certified as a complete
Amiga reproduction.** PARTIAL records implemented behavior and its remaining
reference checks. Passing normal-input demonstrations prove traversability, not
original dimensions, timing, or complete route coverage.

| Course | Layout and routes | Hazards | Rules, recovery, finish |
|---|---|---|---|
| Practice | PARTIAL: training field, twin peaks, four banked reversals; left/right exits and left bonus-shelf route pass | PARTIAL: physical gates/bollards; numbered landing targets now award points; one landing claim per player shared across shelves; seven original amounts restored; exact spatial band mapping remains provisional | 60-unit start, 1000 finish award, 100 points per unused timed unit and last-safe recovery implemented; other score triggers/boundaries open |
| Beginner | PARTIAL: cyan towers, fork, pyramids, ledges, three hollow pipes, ice; left ledge, two-pipe and upper-right-fork routes pass; exact original geometry remains open | Two physical steelies and three curling munchers restored; steelie knockout awards 1000; completed pipes pay 4000/2000; exact AI, placement and paired attribution open | 75-unit reset after Practice implemented; timed left, two-pipe and upper-right-fork runs pass; original finish/respawn details open |
| Intermediate | PARTIAL: split towers, islands, acid room, orange pipe, lower green lanes; both upper starts and left bypass pass; orange pipe, continuous traveling-wave strip and right lane now pass | Articulated curling munchers with shared collision shapes, and deforming acid with shared concave sensors; five board-axis patrols using observed straight legs/turns, with unverified return legs and speeds; acid contacts dissolve and reassemble using a sampled Ultimate sequence; continuous physical strip with reference-informed raised crests, flat intervals and approximately 2.4s cadence; exact profile/scale and lower-lane shape remain open; sampled lower cyan sections are static | 45 units added to carryover; orange pipe pays 2000; paired starts and independent completion pass; scoring/boundary parity open |
| Aerial | PARTIAL: crossed narrow rails, zigzags, vacuum turns, lower red/yellow towers; two-player demos yield at the crossing and both complete without falls | Directional vacuums, steelie, round retracting peg banks implemented; red hinged cup physically launches; exact return destination, dimensions and measured hazard cycles open | 30 units added; normal-input untimed runs pass; timed full-campaign balance open |
| Silly | PARTIAL: reverse uphill course, mini room, flared powered red uplift with two working outlets, two mazes, bird field and split goal climbs; solo demo collects six of nine miniatures, paired paths collect three each, all finish without falls; exact original route coverage open | Nine collectible miniatures: three steelies, three curling munchers and three deforming puddles (+500/+3), flapping purple birds with articulated collision solids, pyramids; demos anticipate bird launches; exact flight pattern, original uplift selection/transfer law and decorative loops open | 25 units added; upward transfer pays 2000; timed solo campaign now completes Silly; full score/time parity open |
| Ultimate | PARTIAL: curved white starting climb and elevated ledge, one launcher island with alternative left/right landing islands, split acid/muncher rooms, ice pyramids, staggered disappearing finish with rising icy return; both complete solo routes pass without falls, including the outer right ice lane and shared final sequence; exact original route coverage open | Contact-triggered hinged launcher arms and aimed impulses, curling munchers, deforming acid with provisional trajectories and reference-informed dissolve/recovery, ice, restored black exit steelie with physical 1000-point knockout, six-second disappearing entry plus staggered lower spans and corners, rising icy return and gold approach; original launcher law and exact cell/phase maps remain open | 25 units added; 2000 completed launcher-landing award with reconstructed repeat/paired policy; 6000 goal and ordinary unused-clock awards, plus separate 20,000 + 1,000/time − 1,000/fall ending implemented; complete timed campaign acceptance open |

## Global campaign checks

- [x] Six-course campaign UI, individual clocks/scores, carryover/reset,
  elimination, restart, continuation and ending.
- [x] Six-course one- and two-player normal-input untimed completion.
- [x] Complete solo browser campaign through ending (prior mm-3 checkpoint),
  and current mm-5 two-player untimed browser campaign through ending with zero
  falls for both players (published 0c263d075 build, September 16).
- [x] Original manual's 0–7 selector and held-button turbo are represented.
- [x] All eight original difficulty allocation rows recovered and applied to
  single-course/campaign clocks. Unreferenced speed multipliers removed; see
  DIFFICULTY-REFERENCE.md.
- [ ] All-level original playback and wall-clock cadence comparison.
- [ ] Calibrate steering, brakes, friction, restitution and turbo against Amiga.
  The mm-28 turbo acceleration clears a conservative opening-displacement bound;
  the complete trajectory, projection and known-input response are still open.
  See [CONTROL-RESPONSE.md](CONTROL-RESPONSE.md).
- [x] Timed solo and two-player campaigns through Aerial, normal bounded input and zero falls.
- [x] Timed solo and two-player campaigns through Silly with zero falls; solo
  collects six miniatures, paired routes collect three each. See DEMO-STEERING.md.
- [ ] Full timed campaign completion and every alternate route. Current timed
  measurement fails in Ultimate for both solo and two players; see VALIDATION.md.
- [x] Five-unit next-race award for the first finisher of a contested race,
  including Beginner reset and independent elimination; see TWO-PLAYER-RULES.md.
- [ ] Original catch-up rules and exact simultaneous-frame tie behavior. The
  trigger, penalty and camera dependency are traced in CATCHUP-REFERENCE.md.
- [x] Original ending arithmetic caps credited whole time at 99 and loss
  deductions at 20; see ENDING-REFERENCE.md. Complete loss counting still
  depends on the unimplemented catch-up relocation.
- [x] Fixed finish awards of 1000–6000, including Ultimate's unused-clock award, verified against original footage.
- [ ] Exact progress, steelie paired attribution, training gate and complete landing-target award formula. See PRACTICE-SCORING.md.
- [ ] Original soundtrack all-cue listening, assignments, loops and transitions.
  Six original modules now play through the bundled WebUADE worker, including the ending cue. No substitute music is used. Exact original transition/listening parity remains open.

## Extras and physics

- [x] Three.js 0.186.0 / Rapier 0.20.0 pinned and locally bundled.
- [x] 120 Hz clock, interpolated position/quaternion, hidden-tab pause.
- [x] Shared welded surface buffers, internal-edge correction, matching sphere
  radius/mass/inertia, bounded torque and CCD.
- [x] Settled contact below 1% radius; no-slip coast error below 2%; separate
  airborne spin, direction reversal, seam/turbo and collision tests.
- [x] Identical outcomes at 30/60/120 rendering frame cadences.
- [x] Moving bridge standing-contact transfer and replay tests. Traveling-wave panel edges agree within 0.000001 units; contact lifts a marble; wave snapshots replay deterministically.
- [x] All three bonus courses complete under timed normal controls with one and
  two players. Solo browser demos complete with no falls.
- [x] Editor floors, ramps, curved tracks/channels, pipes, walls, gaps by removal,
  moving/tilting/piston/vanishing parts, launchers, hazards/enemies, starts,
  checkpoints, goals and ordered demo waypoints.
- [x] Editor snapping, move/rotate/remove, undo/redo, naming, local save,
  validated JSON round trips and instant playtest. Curve placement, rotation,
  movement, undo/redo and save/playtest exercised in the browser. Connected waves
  now move/rotate/remove as one strip; legacy panel rotation, grouped undo/redo
  and edited physical contact also pass.
- [ ] Persistent undo history and arbitrary path-control-point editing.
- [x] Input recording, periodic in-memory physics snapshots, replay speed/seek,
  saved input-only reconstruction and noncolliding personal-best ghosts.
- [x] Versioned record classes separate assistance, difficulty, players,
  timed/untimed, single/campaign, course and physics revisions.
- [x] Contact-force impacts/dust, measured rolling/slipping noise, fall fragments.
- [x] Lossless compact replay storage, quota eviction preserving scores/courses,
  failed-save rollback and a simulated 5 MiB long-recording test.
- [x] Visible per-player medals, course targets, personal bests and independent
  high scores; assistance/difficulty/practice/campaign records remain separate.
  Failed saves roll back and custom-layout changes cannot inherit old records.
  Target rationale and browser checks are in RECORDS.md.
- [ ] Reassess medal targets after final campaign/physics calibration.
- [x] Current portrait/landscape viewport inspection, including two-player
  split controls and portrait title readability.
- [ ] Sustained campaign performance and final whole-campaign browser pass.
- [ ] Physical gamepad, physical phone and mobile audio startup tests.

The earlier checklist mistakenly assigned vanishing paths to Beginner/Aerial.
The Amiga longplay's final-room frames and Michael Webb's Amiga retrospective
place the disappearing bridges at Ultimate's ending. Exact geometry and cycles
remain PARTIAL; names in an old ledger are not proof of a hazard's location.

The Ultimate opening's serial route has been corrected to branching landing
islands. Both reconstructed openings pass ordinary-input checks, but exact
launcher behavior, starting-ramp dimensions and the exact 2000 award boundary remain open. See
ULTIMATE-REFERENCE.md and OBJECT-PARITY.md before claiming original parity.

## Clock allocation reference check

The September 22 re-audit corrects Intermediate to **45**. The earlier +40
reading was already partway through the transfer. Earlier original frames and
the original executable agree on +45. See [CLOCK-REFERENCE.md](CLOCK-REFERENCE.md)
for the corrected sequence and remaining difficulty/clock questions.

### Landing dizziness (mm-23)

Original courses now enable hard-landing dizziness: actual physical contact
reduces steering while momentum, collisions and independent clocks
continue. It does not count as a death. Shared-clock blue marks and HUD feedback
make the state visible. See LANDING-DIZZINESS.md for the Amiga observations,
relative-impact query, replay checks and provisional threshold/duration law.


### Ultimate launch scoring (mm-24)

The traced original 2000 award occurs on arrival at the left landing island,
before the ice bridge. Completed launcher flights now pay on real landing, with
per-player claims and replay/editor-safe destination references. Exact contact
boundary and original right-route/repeat/paired policy remain unverified; see
ULTIMATE-REFERENCE.md. Geometry and timed campaign balancing remain open.


### Ultimate white starting approach (mm-25)

The previous gold pyramid is replaced by a curved white climb and raised ledge,
using shared visible/collision surfaces. Close-up footage corrected the earlier
recess interpretation. Both demos climb the ramp before dropping to the launcher;
exact dimensions, gold guide shapes and original timing remain unverified.


### Landing control correction (mm-32)

Original code disproves the earlier whole-effect input lock. Steering and turbo
now remain available at reduced authority during dizziness, using the recovered
counter attenuation. Impact threshold, duration, severe-impact shattering and
accumulated damage remain provisional; see LANDING-DIZZINESS.md.

### Aerial descending ledges (mm-33)

Two continuous ramps on the left descent are corrected to physical ledges,
matching the original airborne drops and subsequent dizzy recovery. Both
solo and paired normal-input routes finish without falls and trigger the two
landings. Exact dimensions and landing calibration remain partial. See
AERIAL-LEDGES.md.

### Practice shared landing claim (mm-34)

The original landing branches share one per-player claim across all three
shelves. The remake now preserves this through deaths and replay, resetting
only for a fresh race. Discrete reward-table values and region mapping remain
open; the interpolation formula is still provisional. See PRACTICE-SCORING.md.

### Practice discrete rewards (mm-35)

The original marbdat resource confirms seven landing amounts, 3000 through
6000 in 500-point steps. Scoring and painted bands now share this discrete
selection. Mapping the reconstructed shelves to original coordinate bands
remains partial. Original catch-up tables for all six courses are also recovered,
but their world mapping and gameplay integration remain open.
