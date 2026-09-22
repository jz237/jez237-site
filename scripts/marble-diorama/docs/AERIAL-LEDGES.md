# Aerial descending ledges — September 22

The original Amiga longplay by Ironclaw / World of Longplays
(https://www.youtube.com/watch?v=Nfa2etJ84_8) shows two physical drops on the
left descent. At approximately 173.2 seconds the marble leaves the peg-bed lip
and lands on a lower lane, followed by visible dizzy marks. At approximately
177.2 seconds it drops from the next ledge onto the white descent, again with
visible landing recovery. The reference frames are private audit material.

## Geometry correction (mm-33, Aerial revision 2)

The remake previously connected both heights with continuous ramps. Its normal
Aerial demo therefore produced no landing stuns despite finishing the course.
The peg-bed exit now ends at height 10.5; a separate receiving lane starts at
height 8. The next ledge ends at height 8 above the white descent, which begins
at height 6 and slopes through height 5. These use ordinary shared visible and
collision surfaces. No scripted stun, teleport, clock extension or steering
change was added. The right route is unchanged.

## Verification and limits

Three focused tests pass. Rapier and Three.js raycasts agree on the authored
surface heights to within 0.0001 units and retain both height discontinuities.
Complete solo and paired normal-input runs finish without falls, with exactly
two physical landing-stun events for player one and at least twelve airborne
ticks before each. The solo event trace reaches the first stun at tick 4834
(impact speed 7.029, duration 118 ticks) and the second at tick 5414 (speed
6.520, duration 97 ticks). The solo route finishes in 54.467 seconds.

The reference establishes the presence and ordering of these drops, not exact
world-unit dimensions. Heights, impact calibration, duration and original
input cadence remain reconstructed. Accumulated damage and severe-landing
shattering remain open; see LANDING-DIZZINESS.md. This closes the missing-drop
defect without establishing full Aerial or original-game parity.
