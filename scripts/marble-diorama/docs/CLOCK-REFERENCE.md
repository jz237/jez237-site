# Original course clock allocations — corrected September 22, 2026

Primary visual reference: [World of Longplays / Ironclaw, Amiga difficulty 0](https://www.youtube.com/watch?v=Nfa2etJ84_8).
Timestamps refer to the local recording used by the object audit. Reference images remain private and are not bundled as game assets.

| Course | Difficulty 0 allocation | Evidence |
|---|---:|---|
| Practice | 60 initial | 10.00s opening banner |
| Beginner | 75 reset | 35.00s first-field clock |
| Intermediate | **+45** | 84.75–85.50s initial banner; +40 is already a transfer frame |
| Aerial | +30 | 136.00s banner |
| Silly | +25 | 198.00s banner; 202.00s clock reaches 71 from 46 |
| Ultimate | +25 | 266.50–267.00s initial banner |

## Correction of the earlier audit

The September 21 audit wrongly treated the +40 frame at 86.00s as the initial Intermediate award. Earlier frames visibly show **+45**. During transfer, the banner counts down by five as the clock increases by five. The +40 frame already includes the first five-unit transfer; its clock value is not the previous race's original carryover. This is the same pitfall previously noted for Ultimate. The full 84.5–87.25s sequence was checked at four frames/second.

The Amiga executable independently confirms 45 in its difficulty-zero table. Its identity and the private static-analysis method are documented in [TWO-PLAYER-RULES.md](TWO-PLAYER-RULES.md). The table pointer at aggregate offset `0x2320` points to the six-byte difficulty-zero row at `0x22f0`: 60, 75, 45, 30, 25, 25. The transfer routine uses that row's current-course value.

The game restores Intermediate to 45 for single-course and campaign play. All original course definitions continue importing COURSE_TIME. Rules/replay version mm-29 separates records made under the earlier incorrect allowance. The regression asserts both the actual simulation's initial clock and campaign carryover. Historical logs describing +40 remain historical, not current proof.

## Other difficulty rows found, not yet adopted

Static inspection also found these per-course allocations. They are evidence for the next difficulty audit, not proof of all difficulty behavior.

| Difficulty | Practice | Beginner | Intermediate | Aerial | Silly | Ultimate |
|---|---:|---:|---:|---:|---:|---:|
| 0 | 60 | 75 | 45 | 30 | 25 | 25 |
| 1 | 60 | 70 | 40 | 35 | 25 | 20 |
| 2 | 60 | 65 | 30 | 30 | 20 | 20 |
| 3 | 60 | 55 | 30 | 25 | 20 | 20 |
| 4 | 60 | 50 | 30 | 20 | 20 | 20 |
| 5 | 60 | 40 | 30 | 20 | 20 | 20 |
| 6 | 50 | 40 | 25 | 20 | 20 | 20 |
| 7 | 45 | 35 | 20 | 20 | 20 | 20 |

The current nonzero difficulty speed multipliers remain provisional. Clock cadence under original hardware load, complete timed campaign balance and the rest of the original difficulty effects remain open.
