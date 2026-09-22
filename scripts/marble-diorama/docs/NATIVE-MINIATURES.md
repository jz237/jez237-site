# Recovered Silly miniature controller

`native-miniature.mjs` transcribes the miniature room routines at runtime
0x1c074–0x1ccb8. `native-miniature-physics.mjs` connects it to simulation and
rendering for courses with `miniatureSequence: true` and nine uniquely numbered
`nativeMiniatureSlot` enemies. The recovered Silly fixture is still private;
replacement of the published campaign remains unfinished. The public game's
older miniatures are described separately in `SILLY-MINIATURES.md`.

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
  sound identifiers are steelie 35, muncher 34 and acid 36. The adapter currently
  plays authored crack/acid/muncher cues followed by the collection cue, with
  separate keys per creature. These are not verified original sound samples.

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
in the original.

## Physical integration

The live adapter feeds actual body positions back into the controller before
each source update. Source displacement becomes a movement target with speed
based on the sequence cadence. Bounded horizontal impulses move the actors;
Rapier resolves contact with the same terrain shown by the renderer. No maze
mask colliders or active position corrections are added. Walking thrust is
bounded at 30 world units/s² so it can overcome floor friction under native
gravity. This is an adapter tuning value, not a recovered original constant.

Only initial room allocation may relocate a candidate. It requires the actual
floor at the source room elevation and clear visible actor geometry, trying
nearby open cell centers if necessary. An actor without a valid placement stays
hidden. The source type-1 player input is currently inferred from the open room
footprint and measured supported height; full source surface-byte dispatch is
still pending.

Steelies use closed reflective meshes; puddles use their complete concave mesh;
munchers use separate foot, body, head and mouth solids. Source frame counters
drive the authored shape cycles, with fractional updates between source ticks.
The same vertex arrays update the rendered shapes and physical colliders.
Original bitmap silhouettes and their per-frame offsets are not reproduced.

Actual marble contact awards once, stops the body at its current position,
disables its colliders and leaves a flattened spent form. Spent steelies flatten
toward the world floor even after rolling rotations. Camera exit clears them;
reentry allocates a new generation. Collection remains visible to demo/reward
logic while the spent mesh remains visible. Snapshots preserve the controller,
random stream, physical bodies, targets, headings and animation states.

## Verification and remaining work

Nine controller tests cover allocation, camera exit/reentry, spent persistence,
one-contact rewards, cadence, signed fleeing, probe side effects, actor spacing,
deterministic continuation and invalid injected randomness. Seven physical tests
cover import validation, sustained movement against friction, real wall contact,
shared geometry, support, all three physical pickups, spent orientation and
exact snapshot continuation. Audio routing has a separate test.

Two private runs on the recovered Silly board each sampled nine actors for
1,800 physical ticks (16,200 actor samples per run). Both had zero missing floors
and zero below-floor positions. Maximum per-tick displacement was 0.03295 world
units while wandering and 0.02225 with the player present. All nine moved in each
run. These stationary-player diagnostics do not establish full-race parity.

The local browser preview shows the nine forms inside the actual maze, with
changing positions and poses. Audio has not had human listening verification.

Remaining: independent source execution comparison, original silhouettes and
frame offsets, exact surface-byte inputs, motion calibration, full campaign
integration and ordinary-input playtesting before publication.
