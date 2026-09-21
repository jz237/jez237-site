# Pipe and upward-transfer scoring

## Primary Amiga evidence

- [Hipoonios Amiga replay](https://www.youtube.com/watch?v=K_F_IbG87LM):
  Beginner 52s shows 12750 immediately before the separate upper pipe;
  54s shows 16800 after exiting (4000 plus rolling progress).
  By 56s, the lower pipe exit displays a yellow 2000 award and score 18860.
- [Ironclaw Amiga longplay](https://www.youtube.com/watch?v=Nfa2etJ84_8):
  Beginner takes the ledge bypass, entering the lower-left pipe at 72–74s;
  score 8040 becomes 10060 and the exit displays 2000.
  Intermediate orange pipe at 114–116s changes 16860 to 18890, displaying 2000.
  Silly red upward transfer at 217.7–218.1s changes 37880 to 39890 and displays
  2000 at the upper outlet.

Private reference contact sheets and full frames are in the September 21 audit
folder. These observations establish the 4000/2000 amounts independently of
manuals for other ports.

## Implementation

The three Beginner pipes, Intermediate orange pipe and current Silly upward
transfer carry a `traversalBonus` in their CourseDefinition. The physical and
visible tube center curve also defines the scoring path, including its part
translation and rotation. A player must enter near the inlet, remain inside the
bore through a continuous traversal and pass the outlet plane. Walking beside,
below or on top, entering backwards, skipping the middle, and abandoning a
traversal do not pay. Falling clears an incomplete traversal.

Each player can claim each transfer once per race. Claims and partial progress
survive replay snapshots. Awards affect points, not time, and emit a visible
notice and per-player reward cue. Imported scores must be positive integers no
greater than 20000 and belong to static tubes. The editor's existing move,
rotation and JSON round trip preserve the feature.

The reward amount is reference-verified; once-per-race policy and the precise
spatial tolerances still need original repeated-traversal comparison. The
sound remains the remake collection cue, not a recovered original sample.

## Geometry and motion are still open

The Silly red transfer is visibly unlike the current smooth red tube. The
215.5–218.5s sequence shows a lower intake, upper outlet, curved red housing and
looped side detail. The marble disappears into the intake and emerges above.
The housing retains its orientation relative to the board; the footage does
**not** establish a rotating Ferris-wheel lift. Its complete shape, internal
motion and transfer law need reconstruction. This scoring fix does not certify
that mechanism's appearance or motion.

## Validation

Native rolling entry/exit tests verify exactly-once reward and replay from inside
a tube. Rejected-route checks cover exterior travel, backwards entry, skipped
middle, abandoning a pipe and falling. Editor/import checks include transformed
curves and IDs that overlap ordinary object-property names.

The full Beginner paired routes award 4000+2000 to the two-pipe player and 2000
to the ledge-route player. Existing normal-input campaign regressions additionally
verify the right fork, orange-pipe alternate and Silly's transfer for each player.
