# Original course clock allocations — September 21, 2026

Primary reference: [World of Longplays / Ironclaw, Amiga difficulty 0](https://www.youtube.com/watch?v=Nfa2etJ84_8).
Timestamps refer to the local recording used by the object audit. Images remain
private; they are not bundled as game assets.

| Course | Allocation | Evidence |
|---|---:|---|
| Practice | 60 initial | 10.00s banner: time to finish Practice, 60 |
| Beginner | 75 reset | 35.00s first-field clock is 75 after Practice |
| Intermediate | +40 | 86.00s banner explicitly displays +40, with 47 carried over |
| Aerial | +30 | 136.00s banner explicitly displays +30 |
| Silly | +25 | 198.00s banner explicitly displays +25; 202.00s clock is 71 after Aerial's 46 |
| Ultimate | +25 | 266.50s and 267.00s banners display +25; clock reaches 55 after Silly's 30 |

The extra-time banner counts its allocation down as it transfers units to the
clock. For example, Ultimate at 268.00s displays +5 while the clock is 50;
this is an intermediate transfer frame, not a five-unit allocation. Inspect the
start and end of each transfer before interpreting a single frame.

## Correction and validation

Intermediate previously used 45. Both single-course and campaign clocks now use
40, and all original courses import their time from COURSE_TIME to prevent drift.
Physics/recording version mm-10 separates results made under the old clock.
The existing independent-player elimination/carryover regression now asserts the
reference value and checks Intermediate's actual initial simulation clock.

The demo previously crept at 1.3 units/s toward Beginner's first pipe. Testing
1.6, 1.8, 2.0 and 2.2 with ordinary inputs found that 2.2 caused a fall; 1.8
finishes the solo and paired approaches without falls and retains the precise
0.25-unit entry target. No marble controls, geometry, clock rate or hazard rules
were changed. The authored upper-right alternate also passes the full suite.

With the shorter clock, the unchanged timed acceptance checks still pass through
Silly for solo and Aerial for both players. Solo Silly's remaining 0.285 units
is a very narrow margin, not evidence of faithful overall balance. Complete timed
campaign measurement still fails solo Ultimate and paired Silly. Steering, course
scale, timer cadence under load, difficulty effects, and original two-player rules
remain open reference-calibration work. See VALIDATION.md.
