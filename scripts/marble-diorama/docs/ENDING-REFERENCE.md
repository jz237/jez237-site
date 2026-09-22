# Amiga ending bonus audit — September 22, 2026

## Source and arithmetic

This uses the privately decoded Amiga executable identified and independently
offset-checked in [TWO-PLAYER-RULES.md](TWO-PLAYER-RULES.md). No executable,
disassembly or original graphics are distributed with the reconstruction.

The routine at aggregate offset `0xc280` calculates the ending award:

- `0xc2e8` initializes the award to 20,000.
- `0xc2f0–0xc304` reads the player's integer clock at offset `0x74` and caps it
  at 99. `0xc328–0xc356` multiplies that capped value by 1,000 and adds it.
- `0xc35a–0xc36e` reads the accumulated loss counter at player offset `0xe4`
  and caps it at 20. `0xc392–0xc3c0` multiplies that capped value by 1,000
  and subtracts it.
- The resulting award is returned at `0xc406`. Callers at `0xc596` and
  `0xc63c` use it for each eligible player, and the transfer routine at
  `0xc40e` adds it to the score in 250-point increments.

These caps apply to the arithmetic, not merely to printed numbers. The
previous remake formula could subtract more than the original's entire
20,000-point base award or credit more than 99 remaining clock units.

Examples: 140 whole units and two losses yield 117,000 bonus points; three
whole units and 40 losses yield 3,000. The actual clock and accumulated loss
count remain intact. A value such as 98.99 credits 98 whole units.

## Remake implementation

`endingBonus` now applies both caps. `CampaignRun.complete` still awards it
only to finishers after Ultimate, using accumulated campaign losses and each
player's own remaining clock. Ordinary course awards and earlier race result
records remain separate. The ending explanation names both limits. Untimed
practice retains its existing no-time-credit rule; that is a remake extra.

Rules/replay revision is mm-31, preserving separation from earlier records.
Three regression tests cover the boundaries, both independent six-race totals,
saved result data, untimed scoring and a timed-out rival's ineligibility.
The full suite passes 187/187 checks (281323.15 ms).

## Remaining scope

This verifies the ending arithmetic. The original counter also includes
catch-up relocations (`0x13bcc–0x13bd2`), which are not implemented yet; the
remake currently supplies its accumulated falls. Original score-transfer
animation/cadence, the zero-award transfer edge case and complete two-player
presentation still need playback verification. Full timed campaign completion
and the other requirements in [PARITY.md](PARITY.md) remain open.
