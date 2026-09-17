# Original Amiga music: rendering and verification ledger

Status: original Amiga modules are now enabled through a locally bundled WebUADE
worker. Module hashes are verified; the original sequencers supply repeats.
Detailed reference-listening parity remains open, as recorded below.

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

## September 16 — instrumented renderer diagnosis

The upstream renderer now builds with the existing Emscripten 3.1.46 SDK.
Its bundled `prowiz.bc` and `unice68.bc` were incompatible legacy objects;
both libraries were rebuilt for wasm32. The module wrapper and string callbacks
were adapted to the current compiler, without changing audio playback behavior.
The 45-second Aerial baseline is **bit-exact across 1,984,512 stereo frames**
against the previously rendered candidate. Read-only instrumentation likewise
preserves every compared sample in 60-second Aerial and 75-second Intermediate
renders. This validates the diagnostic toolchain, not soundtrack fidelity.

The counters in `music-renderer-diagnostics.json` narrow the outstanding issues:

- Aerial issues 330 writes in 60 seconds. Of those, 165 wait behind another
  write, with a maximum queue depth of two. No queued sample data or relevant
  request field changed before its write began. Copying queued samples is
  therefore not justified by this trace. Changes during playback were not
  measured by this check.
- Intermediate reaches 848 writes by 38 seconds, then issues no more through
  75 seconds. DMA counters continue advancing on all four channels. The cause
  of this stopped note sequence is still unknown; a sustained output is not
  proof of an intended ending or an acceptable loop.
- Neither run invokes the unsupported multi-channel volume-command or
  synchronous-cycle-write cases. Those cases do not explain these candidates.

The subsequent investigation below addresses Intermediate's stalled sequencer.
Scratch compilers, renderer binaries, traces and candidate WAVs stay outside the site.

The SOAMC Aerial T001 archive recording was also rejected: spectral comparisons
match the module's default sub-tune 0 (roughly 0.90–0.93 similarity), while the
course-reference matches remain weak. Its course name alone does not establish
the correct music selection. The [WHDLoad maintainer's notes](https://www.whdload.de/games/MarbleMadness.html)
also report that some original sound-effect samples contain background music;
this is another reason to check instrument identity and transitions rather than
approve an entire cue from isolated spectral matches.

## September 16 — DMA reply queue correction

The Intermediate cutoff was a renderer failure. At 37.872 seconds, the sound
task's message list acquired an invalid tail pointer. The music task later waited
for signal `0x40000000` while receiving only its `0x80000000` tick signal. Its note
writes stayed at 848 through 75 seconds. The emulator continued producing PCM,
so successful WAV export alone had concealed the failure.

The host DMA callback used the Amiga IO request's own linked-list fields for a
deferred reply chain. These fields also belong to the emulated task's message
port. `webuade-dma-replies.patch` separates the host completion queue from those
fields. The score program polls and delivers one completed request at a time;
reset frees pending host entries. Instrument samples, sequence data, periods and
the existing PAL timer correction are unchanged. All six original module hashes
still match `music-provenance.json`.

Evidence is recorded in `music-dma-replies.json`:

- Intermediate reaches 898 writes at 40 seconds, 3,210 at 120 seconds and 8,736
  at 300 seconds. No persistent message-list inconsistency remains in that run.
  Four snapshots caught a list operation mid-update; each recovered in the next
  1,024-frame observation (about 23 ms).
- The previously missing candidate passage at 38 seconds matches reference
  125.813 seconds with spectral similarity 0.8794. Earlier matches remain at
  the same offsets: 16 → 103.813 and 30 → 117.813 seconds.
- All eight course/ending candidates render for two or three minutes with note
  writes continuing. This is a stall check, not all-cue approval.
- The clean patch and instrumented renderer produce **bit-identical output for
  all 5,292,032 stereo frames** of the two-minute Intermediate render.
- A duplicate-link check did not solve the fault. Forbidding task switches only
  moved the stall; extending that approach around BeginIO caused a crash. Those
  changes are absent from the saved patch.

### Rebuilding the corrected renderer

Apply the patch to WebUADE+ commit
`c1f894dad9329495aea9f5dbe141e208fb5c017f`, then rebuild **both** its Amiga score and
host renderer. The new score and host share message command 53 and must be used
together. `git apply --cached --check` passes against the untouched upstream index.
From `amigasrc/score`, the tested assembler command is:

```text
vasmm68k_mot -no-opt -o score -Fbin score.s
```

Copy that score into `emscripten/htdocs/uade/system/score`. The existing modernized
Emscripten build described above uses compiler 3.1.46; score assembly uses
[vasm 2.0f](http://sun.hasenbraten.de/vasm/). Source archive, baseline/patched score,
patch and candidate WAV hashes are recorded in the report. The patch contains
changes to the publicly available emulator, not game program or music data.

**Audio remains disabled in the game.** Aerial 1 still has weak reference matches,
and later Silly phrases also need investigation. Assignment/voice verification,
all-cue listening, sample-accurate loops and transitions, and in-game acceptance
remain required. Continuous note generation is not proof of faithful sound.

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


## September 17 � original module playback enabled

The published player uses the original six `cust.*` files and the corrected clean
WebUADE build directly. A worker renders continuous 44,100 Hz stereo chunks, with
three chunks scheduled on the native audio clock. The original sequencer supplies
note timing and repeats: no approximate WAV splice or fabricated loop is used.
The PAL timer conversion is corrected in memory; original files/sample periods
remain unchanged. Playback gain is 3� (the examined renders peak below 0.17),
followed by the user's independent music volume control.

Cue assignment: Practice 1, Beginner 1, Intermedia 1, Aerial 2, Silly 1,
Ultimate 1; campaign ending Ultimate 2. Aerial 2 is the strongly matching
course passage; exact original in-course sub-tune transitions remain a fidelity
item. Bonuses reuse their authored original-course cue selection.

Playback begins after the race/demo start gesture. Pause suspends the audio clock;
restart/course change terminates the previous worker and all queued sources.
Worker failures are surfaced as a retry message. All assets are served locally.
The bundled `assets/music/renderer-source.zip` contains corresponding renderer
sources, license notices, build script and DMA patch. Asset README credits the
music composer and custom-module adaptation.

Native browser checks compare original renderer PCM for all seven cues and test
startup, bounded buffering, pause/resume, cue changes, ending and stop. These
checks establish playback/data continuity, not human listening verification of
every voice or exact original transition. The earlier disabled-build entries
above remain as historical diagnostic records.
