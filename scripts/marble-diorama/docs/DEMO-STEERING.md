# Demo steering and timed campaign progress

September 22, 2026. Player physics remain mm-28; this is a demo-input change.

## Current policy

The demo now requests up to 3.3 torque through 75% of the ordinary turbo input.
Previously it requested 2.2 through 50% input. This lets it reach its existing
target speeds and counter unwanted momentum sooner. Authored speeds, braking
profiles, waypoints, race clocks, collision shapes and hazard cycles are unchanged.
The player still has the same normal/turbo torque and top-speed envelopes.

Extra input on ice mainly adds spin, rather than useful turning force. The
simulation records the friction of the collider found by its existing ground
ray. The demo retains 2.2 torque when that friction is below 0.1, or when the
current or next waypoint asks for at most 1.4 units/s. Looking ahead to that
slow approach matters: reacting only after entering the ice failed the outer
Ultimate turn. The final policy starts reducing input while there is still
room to lose momentum before the slippery turn.

These are bounded analog inputs through the normal simulation. The driver does
not change positions, velocities, gravity, colliders or clocks. Ground friction
is derived inspection data; it does not change the physical contact properties.
Existing input recordings retain the same physical interpretation.

## Evidence and rejected variants

- A 3.3-torque candidate completed both timed campaigns through Silly without
  falls, where the old paired run timed out. The solo Silly run dropped from
  71.52s to 57.27s on the same right outlet.
- Using the full available 4.4 torque everywhere caused two falls in paired
  Aerial. That policy was not adopted.
- The initial 3.3 policy passed 174/175 tests. The remaining failure was a fall
  on Ultimate's outer ice turn. Reading friction alone still failed; adding
  anticipation of the authored slow approach restored both complete Ultimate
  routes with zero falls. The existing route/guard/knockout tests pass unchanged.
- Later braking (2.25 instead of 1.5 in the stopping-distance profile) was
  investigated privately. It changed the physical time of Silly's seeded tube
  selection and did not consistently improve the full run. It was not adopted.
- Faster final crossings entered the later disappearing tiles too early.
  A departure-window prototype avoided falls across six sampled phases, but
  yielded no consistent improvement over the existing safe route. Neither
  altered crossing speeds nor new phase-window rules are in this release.

The outlet comparison matters: a faster or slower Silly result can also reflect
the different selected upper route. Full-campaign results, both players and the
separate alternate-route checks remain necessary; one fast solo sample is not
sufficient validation.

## Acceptance and limits

The timed campaign regression now requires **both** one- and two-player runs to
finish the first five races on the original clocks, with every marble finished,
positive time remaining, zero falls and bounded input. Previously the paired
assertion stopped after Aerial. The measurement command still runs onward into
Ultimate and reports the remaining failure; the test does not claim that the
whole campaign passes.

Use `node measure-timed-campaign.mjs` and its committed JSON for current measured
outcomes. Full timed completion, exact Amiga control calibration and the broader
object/rule/audio parity checklist remain unfinished.
