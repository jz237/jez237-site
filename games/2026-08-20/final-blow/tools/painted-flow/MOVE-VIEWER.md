# Painted combat and move viewer — 5.6.8

Open **MOVE VIEWER** on the title screen. All ten fighters are available for inspection, including the Commissioner without changing his playable unlock. Choose a punch, kick, special, throw or hit reaction; use quarter/half/normal speed, pause, timeline scrubbing, individual frame steps and facing reversal. This previews painted poses and their attack timing, not an opponent or the throw/super cinematic. Contact is gold. Escape closes the viewer.

## Combat changes

- Light punches retain their painted flow strip. Heavy punches use their distinct authored windup, extension, follow-through and recovery with the existing companion/repair drawings. Rising moves retain their own kit art. No newly generated artwork or asset purchase is part of this release.
- Planted ordinary punches no longer receive an additional whole-body translation/stretch, residual walking lean or idle bob. Authored weight transfer remains visible; advancing moves retain their movement. Contact effects follow the active window independently of the body-lunge calculation.
- The victim remembers the impact's weight and time. A heavy reaction cannot turn into a light reaction when the attacker recovers or starts another move. The reaction track fits the remaining hitstun; the existing head/body routing and clipping repairs remain active.
- CPU defense uses reaction-delayed observations. It can interrupt reachable slow heavy windups, retreat when time and stage space permit, or crouch-cover grounded mid attacks. It does not duck overheads or blindly interrupt armored/special moves. Existing counter reads now override exhibition choreography correctly.

## Verification

- 27 focused AI, adaptation, strategy, movement and swing tests passed; updated viewer move-window checks passed.
- Browser: title, all-fighter move viewer, painted jabs/kicks, crouch/air recovery, pose chains, offline cache and console checks passed.
- CPU: round strategy, ten seeded completed matches with combos and learned observations, and repeatable seeded playback passed.
- Inspected Jez/Benny heavy contact drawings in the viewer and live renderer; checked desktop and 844×390 viewer layouts.
- The mixed-CPU test checks learned live observations rather than requiring a specific repeated habit to occur randomly during a short opening round. Controlled adaptation tests still require each learned response. Corner checks assert the actual escape; an already-running dash can leave before another decision is due.
