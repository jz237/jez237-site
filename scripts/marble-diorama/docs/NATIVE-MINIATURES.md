# Recovered Silly miniature controller

`native-miniature.mjs` transcribes the miniature room routines at runtime
0x1c074–0x1ccb8. It is a standalone source-coordinate controller; it is not yet
connected to live campaign physics or rendering. The public game's existing
miniatures are described separately in `SILLY-MINIATURES.md`.

## Recovered behavior

- Camera bands 29–56 load nine actors: three steelies, three acid puddles and
  three munchers. Leaving the room clears the pool. Spent actors remain loaded
  until that exit, preventing immediate replacement after collection.
- Random initial positions use four-unit increments within the room and reject
  occupied cells and nearby live actors. The sixteen maze rows and sixteen
  direction vectors are recovered tables. The adapter uses a seeded random
  stream, not the original global RNG.
- Actors ordinarily advance every three source updates. An active player at
  source height 16238 on surface type 1 alerts the room, advancing them every
  update. Divider remainders survive that change. Fleeing selects a player and
  quantizes direction using the source's signed arithmetic and tie order.
- Steelies move on each animation update and reconsider direction after four
  moves. Puddles and munchers move on animation wraps. Their positive/negative
  direction sequences have distinct lengths; the idle muncher has eleven frames.
- One contact input awards the selected player 500 points and three time units.
  Steelies play three hit frames before their spent frame; the other forms use
  their spent sequences. Subsequent contact does not award again. Recovered
  sound identifiers are steelie 35, muncher 34 and acid 36; audio is not wired here.

## Movement is intent, not a physical position

The obstacle search has an asymmetric position side effect. In the wandering
routine, the first successful probe retains its four-unit displacement; a
successful retry restores the initial position. A failed search retains its
last probe. Fleeing restores the position in every case. This transcription was
checked against branches at 0x1c86a, 0x1c8ba and 0x1c8e2. It still needs independent
execution comparison before claiming cycle-exact emulation.

A private diagnostic compared 1,200 updates of all nine source intents with
the recovered Silly terrain. Of 10,800 wandering samples, 927 centers were in
blocked maze cells and 147 differed from the actual terrain height. An alerted
run had eight blocked centers and no height mismatches. Neither run lacked a
floor. These are diagnostic results for this transcription, not proof of a bug
in the original. A live adapter must resolve movement against the shared visible
board geometry, without teleporting active bodies or adding invisible maze walls.

## Verification and remaining work

Nine controller tests cover allocation, camera exit/reentry, spent persistence,
one-contact rewards, cadence, signed fleeing, probe side effects, actor spacing,
deterministic continuation and invalid injected randomness. They do not test
physical collection, full races, original bitmap silhouettes or audio playback.

Remaining: physical adapter and source/player feedback, continuous motion,
shared visible/contact animation shapes, spent rendering, import validation,
campaign integration and ordinary-input playtesting before publication.
