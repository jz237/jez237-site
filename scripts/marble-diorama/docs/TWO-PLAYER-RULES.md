# Amiga two-player rule audit — September 22, 2026

## Reference and method

The [Amiga instruction transcription](https://www.lemonamiga.com/doc/marble-madness/1052) describes player/input selection but does not specify finish bonuses. Manuals for other ports are insufficient to establish Amiga-specific behavior.

The [WHDLoad preservation package](https://www.whdload.de/games/MarbleMadness.html) contains a 174,680-byte Amiga executable and separately documented loader patches. Executable SHA-256: `17248952ca7497baa30fc3f9428760311e0628b55f9ac178f14283e6f417f682`. Its 347 HUNK sections were decoded privately, with 32-bit relocations resolved to aggregate section offsets, then inspected as 68000 instructions. The documented timer patch at `0x0b566` agrees with the decoded timer routine, checking the offset mapping independently. No original executable, disassembly or graphics ship with the remake. This is static behavior evidence; a live original two-player replay is still desirable for presentation and frame-order confirmation.

## First-finisher award

- Goal handling at `0x12d54–0x12d6c` records the first eligible finisher's player index while the winner slot remains unset. Later finishers do not replace it.
- The next-course sequence calls player initialization (`0x1453a`) before the allocation routine (`0x6974`). Initialization clears carryover for the first two courses and preserves it for later ones.
- The allocation routine's entry checks selected player count = 2, previous starting active count = 2, and a recorded winner. The active count is refreshed only after that routine, in `0x30ec–0x312a`; it is not the number of survivors after the previous race.
- The winner banner data identifies a last-race award. The routine at `0x6a3a–0x6b10` transfers five units, one at a time, through the clock-adder at `0xb41c`, before adding the ordinary next-course allocation.

Consequences: Practice's winner starts Beginner with 80 rather than 75. On later races, the winner gets carryover + five + the new allocation. A rival's timeout does not cancel an already earned contested win. Once only one marble starts a race, winning that uncontested race earns no further five-unit award. This changes next-race time, not the completed race's score/time tally. Ultimate has no subsequent race to receive an award.

## Remake behavior and verification

CampaignRun stores the pending per-player award separately and applies it when preparing the next simulation. Re-preparing after restart yields the same initial clock without accumulating it. Completed race data records winner, finish ticks and pending awards for inspection. The result screen names the winner and the next-race clock award. Untimed extras and solo runs earn no competitive time.

Four focused regressions cover swapped winners, Beginner reset, Intermediate carryover, restart, independent elimination, no extra scoring, preserved previous results, all-timeout, solo, untimed and final-race cases. Same-tick finishes retain the simulation's serial player order, awarding only one player. The first-winner latch is supported by the executable; an original simultaneous-frame experiment is still needed before claiming exact tie behavior.

Full original catch-up relocation, penalties, camera rules, original collision balance and exact presentation remain open. This award does not certify complete two-player parity. Rules/replay version mm-29 separates affected records.
