# Per-course parity checklist

See [the September 21 object audit](OBJECT-PARITY.md) for timestamped findings, fixes and known mechanism mismatches.

All six races are playable reconstructions. **None is certified as a complete
Amiga reproduction.** PARTIAL records implemented behavior and its remaining
reference checks. Passing normal-input demonstrations prove traversability, not
original dimensions, timing, or complete route coverage.

| Course | Layout and routes | Hazards | Rules, recovery, finish |
|---|---|---|---|
| Practice | PARTIAL: training field, twin peaks, four banked reversals; left/right exits and left bonus-shelf route pass | PARTIAL: physical gates/bollards; numbered landing targets now award points; precise interpolation/repeat policy still provisional | 60-unit start, 1000 finish award, 100 points per unused timed unit and last-safe recovery implemented; other score triggers/boundaries open |
| Beginner | PARTIAL: cyan towers, fork, pyramids, ledges, three hollow pipes, ice; left ledge, two-pipe and upper-right-fork routes pass; exact original geometry remains open | Two physical steelies and three curling munchers restored; steelie knockout awards 1000; completed pipes pay 4000/2000; exact AI, placement and paired attribution open | 75-unit reset after Practice implemented; timed left, two-pipe and upper-right-fork runs pass; original finish/respawn details open |
| Intermediate | PARTIAL: split towers, islands, acid room, orange pipe, lower green lanes; both upper starts and left bypass pass; orange pipe, continuous traveling-wave strip and right lane now pass | Articulated curling munchers with shared collision shapes, and deforming acid with shared concave sensors; five board-axis patrols using observed straight legs/turns, with unverified return legs and speeds; acid contacts dissolve and reassemble using a sampled Ultimate sequence; continuous physical strip with reference-informed raised crests, flat intervals and approximately 2.4s cadence; exact profile/scale and lower-lane shape remain open; sampled lower cyan sections are static | 40 units added to carryover; orange pipe pays 2000; paired starts and independent completion pass; scoring/boundary parity open |
| Aerial | PARTIAL: crossed narrow rails, zigzags, vacuum turns, lower red/yellow towers; two-player demos yield at the crossing and both complete without falls | Directional vacuums, steelie, round retracting peg banks implemented; red hinged cup physically launches; exact return destination, dimensions and measured hazard cycles open | 30 units added; normal-input untimed runs pass; timed full-campaign balance open |
| Silly | PARTIAL: reverse uphill course, mini room, flared powered red uplift with two working outlets, two mazes, bird field and split goal climbs; solo demo collects six of nine miniatures, paired paths collect three each, all finish without falls; exact original route coverage open | Nine collectible miniatures: three steelies, three curling munchers and three deforming puddles (+500/+3), flapping purple birds with articulated collision solids, pyramids; demos anticipate bird launches; exact flight pattern, original uplift selection/transfer law and decorative loops open | 25 units added; upward transfer pays 2000; timed solo campaign now completes Silly; full score/time parity open |
| Ultimate | PARTIAL: curved white starting climb and elevated ledge, one launcher island with alternative left/right landing islands, split acid/muncher rooms, ice pyramids, branching finish; both complete solo routes pass without falls, including the outer right ice lane and right finish approach; exact original route coverage open | Contact-triggered hinged launcher arms and aimed impulses, curling munchers, deforming acid with provisional trajectories and reference-informed dissolve/recovery, ice, restored black exit steelie with physical 1000-point knockout, three sequential disappearing bridge tiles; original launcher law and exact bridge pattern open | 25 units added; 2000 completed launcher-landing award with reconstructed repeat/paired policy; 6000 goal and ordinary unused-clock awards, plus separate 20,000 + 1,000/time − 1,000/fall ending implemented; complete timed campaign acceptance open |

## Global campaign checks

- [x] Six-course campaign UI, individual clocks/scores, carryover/reset,
  elimination, restart, continuation and ending.
- [x] Six-course one- and two-player normal-input untimed completion.
- [x] Complete solo browser campaign through ending (prior mm-3 checkpoint),
  and current mm-5 two-player untimed browser campaign through ending with zero
  falls for both players (published 0c263d075 build, September 16).
- [x] Original manual's 0–7 selector and held-button turbo are represented.
- [ ] Difficulty effects measured against Amiga. Current 0–7 presets increase
  clock, enemy, machine and force speeds; UI explicitly calls them provisional.
- [ ] Calibrate steering, brakes, friction, restitution and turbo against Amiga.
- [x] Timed solo and two-player campaigns through Aerial, normal bounded input and zero falls.
- [x] Timed solo campaign through Silly, six miniature pickups and zero falls.
- [ ] Full timed campaign completion and every alternate route. Current timed
  measurement fails in Ultimate for solo and Silly for two players; see VALIDATION.md.
- [ ] Original two-player winner/catch-up/time-bonus rules and simultaneous ties.
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

The Intermediate allocation is corrected from 45 to **40**, matching the original
86.00s banner. All six course definitions now use the same allocations as campaign
carryover. See [CLOCK-REFERENCE.md](CLOCK-REFERENCE.md) for evidence, the demo pipe
approach adjustment, and the remaining timed-completion gap.


### Landing dizziness (mm-23)

Original courses now enable hard-landing dizziness: actual physical contact
briefly suppresses steering while momentum, collisions and independent clocks
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
