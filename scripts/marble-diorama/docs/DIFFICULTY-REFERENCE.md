# Original difficulty behavior — September 22, 2026

## Evidence

This audit uses the identified Amiga executable and private HUNK/68000 analysis
in [TWO-PLAYER-RULES.md](TWO-PLAYER-RULES.md). No original executable or disassembly
is distributed. The original difficulty-zero clock row is independently checked
against gameplay, including Intermediate's corrected +45 initial banner.

The saved difficulty word is at aggregate offset `0x616`. Its direct data reads
are the menu display (`0xcab6`) and course allocation (`0x6c54`); the menu commits
the selected value at `0xcd5a`. The menu's working value at `0xcdb0` is used for
selection, display and that commit. Other references to address `0x616` compare
pointer bounds; they do not read the difficulty value.

The allocation path masks the selector to 0–7, reads the identity mapping at
`0x2340`, indexes eight pointers at `0x2320`, then reads the current course's byte.
The 48-byte block begins at `0x22f0`. All rows are listed in
[CLOCK-REFERENCE.md](CLOCK-REFERENCE.md). Level 1's Aerial allowance is 35, greater
than level 0's 30; it must not be replaced with a monotonic scaling formula.

The clock decrement routine at `0xb528` uses fixed counters, without consulting
the difficulty selector. This audit found no path from difficulty to enemy,
machine, suction or steering speeds. The remake's previous increasing speed
multipliers had no original reference and have been removed. This is static
code evidence, not a claim that complete original gameplay at every level has
been reproduced. An all-level original playback comparison remains useful.

## Implementation

- Each of the six original courses uses its selected row for single-course play.
- Campaign initialization uses that row for Practice and Beginner resets, then
  adds its later-course allocations to integer carryover. The contested winner's
  separate five-unit award still applies. The next-race message shows the actual
  selected Beginner allowance rather than always saying 75.
- Difficulty no longer speeds the race clock, enemies, machines or force zones.
  Original and bonus/custom geometry, contact physics and authored periods are
  unchanged. Bonus and custom courses retain their authored starting allowance;
  the eight original allocation rows apply only to original campaign courses.
- Custom copies of an original course do not inherit its clock table. Unknown
  original IDs fall back to the authored time. Difficulty input remains clamped
  to the supported 0–7 range.
- Records/replays use mm-30 because nonzero difficulty outcomes change. The
  settings text describes the implemented time-allocation behavior. The selected
  difficulty persists across reloads.

## Verification and limits

Five focused checks pass (12993.32ms). They instantiate all six actual courses
at every difficulty with both players and check the 48-byte reference block;
check hardest-level reset/winner/restart; compare actual player, enemy and mover
states plus elapsed clock between levels 0 and 7; exercise custom force zones;
and reconstruct a saved high-difficulty recording exactly from input.

The complete suite passes 184/184 checks. Browser checks confirm the hardest
Practice allowance and restoration of difficulty 7 after a reload.

The base timer rate remains the earlier measured approximation. Fixed original
counter increments do not by themselves prove a wall-clock frequency: original
update scheduling and load must also be traced. Full timed campaign completion,
original control calibration, hazard/geometry detail and original playback at
all difficulties remain open. Changing the allocations does not complete these
independent parity requirements.
