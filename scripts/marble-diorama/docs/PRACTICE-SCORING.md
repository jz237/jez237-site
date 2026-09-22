# Practice landing targets and race-finish awards

## Primary evidence

- [Ironclaw / World of Longplays, Amiga](https://www.youtube.com/watch?v=Nfa2etJ84_8), difficulty 0, joystick.
- [Hipoonios, Amiga re-play](https://www.youtube.com/watch?v=K_F_IbG87LM), difficulty 0, mouse selected at 12s.

The first recording shows the three side shelves carrying four red/white numbers,
3, 4, 5 and 6. They are not the separate 20/30/40 plaques in the earlier remake.
In the second recording, the marble leaves the bank at 22.32–22.64s and lands on
the left shelf by 22.96s. Its score changes from 340 at 22.80s to 4850 at 22.96s;
the visible yellow award says **4500**. It then travels down the shelf and drops
to the finish. The first recording's direct route does not visit a bonus shelf.
Private evidence: hip-pad-award.jpg, hip-pad-award-detail.png and pad-overhead.png
in the September 21 reference folder. They are not published game assets.

## Implemented, with limits

All three shelves have four painted landing labels. The paint and scoring use
one floor-relative rectangle, so movement/rotation in the editor changes both.
The left shelf extends toward the goal, matching the reference's route structure;
its precise dimensions remain reconstructed. Removing a shelf removes its target.

An airborne approach followed by physical support in the painted rectangle pays
an award, with visible text and an effects-bus cue. The three shelves share one claim per player per race. Claims are stored in
snapshots and retained after falling; the other player remains eligible. Rolling over the paint, flying
above it, or passing beneath the shelf does not pay.

**The award formula is provisional.** The original 4500 observation demonstrates
an intermediate award but does not establish every position's value. Current
values interpolate across the 3/5 and 4/6 corner labels and round to 100 points.
The six-tick airborne requirement and exact landing-region boundaries still
need comparison. The former once-per-shelf policy is corrected below.
The effect uses the remake's collection cue, not a recovered original sample.

A selectable `Left landing target and shelf exit` demonstration uses only normal
steering/turbo. It receives 5000 points and finishes in 26.94s without falling.
This proves an actual route through the feature, not exact original dimensions.

## Race-finish awards verified across all six courses

The Ironclaw recording displays fixed awards beside the finish flags, before
adding the unused-clock award:

| Race | Fixed award | Evidence timestamp |
|---|---:|---|
| Practice | 1000 | 24–25s; 320 becomes 1320 |
| Beginner | 2000 | 79–81s, visible 2000 at flags |
| Intermediate | 3000 | 129–131s, visible 3000 at flags |
| Aerial | 4000 | 192s; 28520 becomes 32530 including progress |
| Silly | 5000 | 260s; 40490 becomes 45500 including progress |
| Ultimate | 6000 | 348s; 52070 becomes 58070 |

Ultimate also shows `BONUS FOR TIME LEFT: 400` at 350–353s; the ending starts
at 58470 points. Its separate 20000 + 4000 − 3000 ending tally produces 79470.
The remake previously omitted all fixed awards and disabled Ultimate's ordinary
clock award. All six are now corrected. Untimed practice retains the fixed award
but does not earn a clock award. Full original two-player finish bonuses and
progress scoring remain unverified.

## Validation

Native physics tests cover all three shelves, rejected approaches, repeat claims,
independent players, restoration midair, editor transforms/deletion and validated
imports. A full-start bounded-input alternate completes without falls. All six
native goal checks verify fixed awards separately from timed/untimed clock awards;
the Ultimate reference tally is reproduced from the observed pre-finish state.
Audio routing is checked separately. Physics/replay version is mm-11.


## Follow-up evidence: discrete tiles in another port

The [official Game Boy Color booklet, printed page 10](https://www.videogamemanual.com/gbc/Marble%20Madness%20%28USA%29.pdf)
describes 3000–6000 for numbered tiles and an additional 500 for the connected
unnumbered tile of the same color (including a 6500 example). This conflicts with
the current continuous interpolation. The Amiga's observed 4500 award is
consistent with that discrete rule, but one observed landing does not verify all
Amiga tiles or their boundaries. Do not treat the present interpolation as
faithful, nor import the other port's exact map without further comparison.
The pending EA folder scan and additional Amiga landing observations should
resolve this before the rule is finalized.

## September 22 — shared Practice landing claim (mm-34)

The private executable identified in TWO-PLAYER-RULES.md supplies direct evidence
for claim scope. The Practice landing branch begins at **0x1534c**. It requires course zero and region 1, 2 or 3.
The player index at offset `0x19` becomes the bit mask `index + 1` (one or two).
All three region branches test and set that same bit in global byte `0x5f6`:
`0x153b2–0x153ca`, `0x1542c–0x15444`, and `0x154a8–0x154c0`.
There is no independent bit for a second shelf. Race initialization clears the
byte at `0x33c6`; ordinary respawning does not clear it. Both players can each
claim once, and a fresh race restores eligibility.

Practice now puts all three landing targets in the `practice-landing-bonus`
claim group. The group is optional for custom targets, preserved through JSON
and editor transforms, and validated as a nonempty string of at most 64
characters. Ungrouped targets retain independent claims. The original target
ID remains in the award event and claim history; shared eligibility is separate
snapshot state. Practice revision 2 and replay version mm-34 separate old results.

Ten landing/finish checks pass, including all three first-shelf choices for both
players, rejection of later shelves, retention through respawn and restored
snapshots, reset on a fresh race, independent custom targets and import checks.
The existing normal-input shelf route still completes without falls.

### Further scoring evidence, still unresolved

The same code contradicts continuous bilinear scoring. Regions 1 and 2 use
original coordinate Y minus 488 and 568 respectively; region 3 uses X minus
528. Nonnegative offsets are shifted right by two, then seven is added and the
index is capped at thirteen. Only indices greater than six invoke the award
routine (`0x15518–0x15554`). This selects seven discrete reward entries.
`0xa622` reads the amount from a separately loaded resource at `0x14ed8`,
offset `0x24 + 2 * index`, rather than calculating it from four corner labels.
The loader at `0x139c4` names this resource `marbdat` (with the related
`marbdat.vlb` archive). The executable does not provide that resource's score
values or the complete geometry mapping. The original also consumes the region claim before checking
whether the resulting index pays. Exact boundaries, the seven amounts and
nonpaying-region behavior remain unresolved; the current formula is explicitly
provisional. No other port's scoring table has been substituted.
