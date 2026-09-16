# Original Amiga music: rendering and verification ledger

Status: original module data obtained and rendered. **Not release-verified or
enabled in the game.** No synthesized replacement music is used.

## Sources

- [ExoticA catalogue](https://www.exotica.org.uk/wiki/Marble_Madness): six custom
  modules, Larry Reed credit and Don Adan customisation credit; audio.device caveat.
- [Archive source](https://www.theoldcomputer.com/gamemusic/Commodore/Amiga/Games/Marble%20Madness%20%281986%29%28Larry%20Reed%29%28Electronic%20Arts%29.zip):
  138,604-byte ZIP; verified PK signature and six expected file sizes.
- [WebUADE+ source](https://bitbucket.org/wothke/uade-2.13/), commit
  `c1f894dad9329495aea9f5dbe141e208fb5c017f`: its documented audio.device additions
  explicitly include Marble Madness. Used offline to render WAV candidates.
- [Amiga 500 reference playback](https://www.youtube.com/watch?v=Nfa2etJ84_8):
  World of Longplays / Ironclaw, difficulty 0, 363.8-second recording. Reference
  audio/video stays in private working files and is not shipped with the game.

## Rendering

UADE 3.05 failed with a score crash on the custom driver, producing no audio.
WebUADE+ successfully renders the six modules at 44,100 Hz, stereo, A500 filtering,
without changing instrument samples. Multiple sub-tunes are present: course
music is generally sub-tune 1, while Aerial and Ultimate also expose sub-tune 2.
The default selection did not produce the expected course music and is excluded.

An initial spectral timing comparison consistently found candidate/reference
speed near 0.835 (reference music is slower). Each custom module contains one
`MULU.W #5 / DIVU.W #6` timer conversion, also visible in the adaptation's source.
For PAL candidates, the renderer changes only `MULU #5` to `MULU #6` in memory,
removing this 60 Hz conversion. Original module files and sample periods remain
unchanged. The provenance file records the exact patch location and hashes.

After that correction, independently matched cue offsets advance at the same
rate as the reference. Examples (candidate time → reference time):

| Cue | Matched offsets | Spectral cosine similarity |
|---|---|---|
| Beginner 1 | 16 → 50.133 s; 30 → 64.133 s | 0.915 / 0.928 |
| Intermediate 1 | 16 → 103.813 s; 30 → 117.773 s | 0.921 / 0.943 |
| Silly 1 | 1 → 201.773 s; 8 → 208.773 s; 16 → 216.773 s | 0.936 / 0.830 / 0.784 |
| Ultimate 1 | 1 → 269.933 s; 16 → 284.933 s; 30 → 298.933 s | 0.909 / 0.842 / 0.928 |
| Ultimate 2 | 1 → 354.693 s, ending screen | 0.956 |

This is evidence for data identity, assignment and nominal PAL tempo. It is not
equivalent to listening verification. Reference sound effects and silence affect
scores. Aerial 1 needs further investigation; Aerial 2 strongly matches the later
course passage. Loop candidates are not yet approved (e.g. Practice repeats near
16.94 seconds; Beginner has longer repeated sections). Do not use those approximate
values as final loop boundaries.

## Remaining acceptance

- Listen to every cue against Amiga playback; confirm all voices/instrumentation.
- Resolve Aerial's sub-tune transition and all intro/ending assignments.
- Establish sample-accurate loop starts/ends and clean transitions.
- Package the approved audio locally, then test startup, gain, pause, restart,
  tab switching, overlapping-track prevention and mobile audio activation.

## Gameplay reference observations

The same recording shows Practice's 60-unit clock and Beginner's independent
75-unit reset. Later courses carry remaining time plus 45 (Intermediate), 30
(Aerial), 25 (Silly), and 25 (Ultimate). Course-finish awards are 100 points per
displayed clock unit. The last screen shows 20,000 for completion, 1,000 per unit
left, and a deduction of 1,000 per accumulated death: 58,470 + 20,000 + 4,000 −
3,000 = 79,470. Those specific transitions have direct visual evidence.

Early Beginner clock changes are mostly 1.28 seconds apart; the new nominal
clock uses 50/64 units per real second. Later reference intervals vary, so exact
hardware/load and difficulty-dependent timing remains a parity item.
