# Custom events and 24-car solo fields — October 1, 2026

This is a milestone toward the full Wreckfest 2 PC parity objective, not a completion claim.

## Behavior

- Saved custom solo rules: 2–24 total cars, 1–20 race laps, forward/reverse circuit and derby duration from one to twenty minutes.
- Survival derby preserves elimination rules. Score derby awards one point per actual damage plus 100 per knockout, then ranks score/knockouts/condition with stable ID ties. Cars respawn after four seconds only if an eight-metre clear position is available; no respawns occur at or after the deadline.
- All 24 starting slots have space for the largest chassis. Tail-grid cars must cross the gates preceding the start line before scoring a lap. Reverse AI, recovery points, checkpoint markers, ranking and finish detection share the reverse ordered route.
- Finished AI keeps circulating, preserving its finish time and classification, so early finishers do not block the remaining grid.
- HUD/results adapt to field size. Race records distinguish direction, laps and field; score-derby records distinguish duration and field. The optional performance readout uses the last 300 active-event frame intervals, including long stalls.
- Challenges retain fixed stock cars, forward routes and their own field/limits. Online capacity and protocol remain unchanged at eight seats.

## Evidence

- Eleven new tests cover save bounds, full-size grid separation, pre-line accounting, reverse AI steering, score ordering and repeat-life payouts, clear respawn selection, a real wreck/repair lifecycle, full-field physics and historical source recovery.
- Actual Rapier/Vehicle/DrivingBrain simulation: 24/24 cars complete forward and reverse laps within 120 simulated seconds on an unobstructed, flat dynamics fixture. This does not substitute for full quarry navigation or rendering tests.
- Browser inspection verified settings persistence, 24-car score-derby entry, one-minute completion, a complete 24-entry score table, XP banking, reverse-race entry and all 24 spectator choices.
- A browser test exposed finished cars blocking the finish line. The rollout correction was made before installation; the stronger fixture now requires all 24 cars to finish in both directions.
- At 1280×720 Ultra, observed rolling samples included 52 FPS/P95 34 ms during score derby and 48 FPS/P95 34 ms during reverse racing. A congested pre-fix finish-line view fell to 27 FPS/P95 50 ms. These are short observations on the preview browser, not a sustained VENGEANCE hardware benchmark.

## Remaining limits

Extended full-scene race/derby testing, sustained VENGEANCE GPU measurements and difficulty balancing remain open. No new track location or vehicle model is included. The public website has not been republished. Multiplayer expansion, opposing-direction racing, free-order routes, replay/photo, layered liveries and native peripheral support remain on PARITY_PLAN.md.

## Release verification

Final candidate build `index-DTJ9_Vk5.js` passed TypeScript/Vite and all 222 tests on VENGEANCE. The corrected reverse-race browser run showed a finished car still moving at68km/h, then completed and automatically started the next event before the timeout. A later chase-view sample showed57FPS/P95 17ms. These observations verify the finish-line rollout and event cycle without asserting that every car finished rather than being retired.
