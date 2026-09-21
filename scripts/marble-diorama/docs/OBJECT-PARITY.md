# Object parity audit — September 21, 2026

**Status: partial. Full Amiga feature parity is not complete.** This audit separates
observations in the original recording from reconstructed behavior and automated
checks. Passing a demo is evidence of a route being traversable, not fidelity.

Reference: [World of Longplays / Ironclaw, Amiga difficulty 0](https://www.youtube.com/watch?v=Nfa2etJ84_8).
Video timestamps below refer to the existing local copy. Frame sequences were
inspected, including 100.00–102.28s at 0.12s intervals, 238.00–239.32s at 0.12s,
165.00–169.56s at 0.24s, and 277.0–283.0s at 0.4s. Private reference images are
not included in the published game.

| Course / object | Findings and changes | Still unverified or missing |
|---|---|---|
| Practice gates and numbered pads | Existing gates have physical geometry; numbered pads are markings. No claim of completing their original effects. | Original gate/pad triggers, awards and detailed gate behavior need a dedicated comparison. |
| Beginner steelie and pipes | Pursuit and rolling collisions exist; no replacement made in this pass. | Original targeting, speed, awards, exact pipe shapes and entry behavior remain unmeasured. |
| Intermediate munchers, 100–102s | Original green creatures curl down and stand up repeatedly, with yellow mouths. Replaced the rigid capsule/painted stripe with articulated green solids and a yellow mouth. Turns follow the pursuit direction. Shapes animate in simulation time and are used for both drawing and contact. | Curl is a reconstruction (~0.6s cycle), not a recovered sprite sequence. Original AI, distances, hit timing and the complete body silhouette remain unverified. |
| Intermediate waves, 121–131s | Found a real renderer-state bug: physics replaced each wave pose after stepping and dropped its changing vertices. Translation/rotation still moved, but rendered panel lengths no longer matched their colliders. Preserve the vertices through stepping and snapshots. | Exact original full-lane wave shape, travel speed and phase remain unmeasured. Current panels are still a reconstruction. |
| Intermediate / Ultimate acid | Moving sensors already follow the rendered pool positions. | Circular green pool shapes and sinusoidal paths are provisional; original blob deformation and trajectories remain open. |
| Aerial pegs, 162s and 167–169s | Original has groups of silver pegs rising from the track and retracting flush. Replaced two isolated overhead blocks with three banks of three round, chamfered pegs. Mesh and collider use the same points and rise/hold/retract state. | Bank locations, number of rows and 3.8s cycle are provisional. Need full reference coverage of every bank. |
| Aerial vacuum and striker, 145–169s | Vacuum mouth geometry and directional attraction exist. The current overhead hammer block does not reproduce the red side-mounted striker seen in the recording. | **Striker mechanism remains a known mismatch.** Vacuum intake/disappearance cycle and gray ramp geometry also need further comparison. |
| Silly birds, 238–239s | Original purple birds have changing wing silhouettes during crossings. Replaced rigid diamonds with articulated purple bodies, heads, beaks, tails and independently posed wings. Wing collision solids deform with the visible wings. | Straight crossing paths, bird count/rest intervals and 3.2Hz wingbeat are provisional; exact original flight/impact animation is not certified. |
| Silly miniatures / uplift | Existing miniature contacts award +500/+3; no change in this pass. | Miniature creature appearance, exact awards and uplift pipe/mechanism behavior remain open. |
| Ultimate opening, 277–283s | Removed the unsupported serial three-launch route. The starting field now drops onto one launcher island, which sends the marble to either of two lower landing islands; each has its own ice bridge. Two contact-triggered hinged arms replace static pads. Both approaches are checked with ordinary controls and one launch, with no visit to the opposite island. | The paired arms, velocities and stroke are a playable reconstruction, **not a recovered launch law**. Starting recess, gold guide shape, exact dimensions and observed 2000 award trigger remain open. The recording establishes the left route; full original right-route traversal is still unverified. |
| Ultimate disappearing bridge | Timed removal and restoration of physical support already exist and replay correctly. | Exact original tile pattern, positions, cadence and all alternate routes remain unverified. |

## Implementation safeguards and validation

- Physics/replay version is `rapier-0.20.0-mm-7`: old recordings cannot silently
  claim compatible outcomes after collision and layout changes.
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

Release checks: 97/97 automated tests pass; production build and diff check pass.
Silly solo and Ultimate two-player browser demos finish without falls or captured
console errors. The full timed campaign still fails; see VALIDATION.md.
