# Beginner enemies and steelie awards

## Original evidence

Two independent Amiga recordings show an upper steelie on the cyan maze,
three green/yellow munchers around the pyramid room and its exit, and another
steelie on the landing before the upper pipe:

- [Hipoonios Amiga replay](https://www.youtube.com/watch?v=K_F_IbG87LM):
  41.2s upper steelie contact, 41.6–42.6s falling beside the descent,
  43.2s visible 1000 award (score 11490 to 12500 includes rolling progress).
- [Ironclaw Amiga longplay](https://www.youtube.com/watch?v=Nfa2etJ84_8):
  44–48s upper steelie collision/fall and 1000 award; 54s clearly shows three
  munchers, including the one guarding the exit neck.

The previous course contained only the lower steelie. The upper steelie and
all three munchers are now present. Munchers use the existing curling green
body/yellow mouth, shared animated collision solids, and independent phases.
Normal-control demonstration routes steer around the upper steelie and pass
the neck muncher on the right. Enemy collision and pursuit remain active.

## Steelie lifecycle

A steelie falling five world units below its last supported height is retired
for the rest of the race. A supported descent does not count as a knockout.
The last racing player to make physical Rapier contact receives 1000 points,
a reward sound, and a visible notice. An uncontacted fall awards no points.
The disabled body, contact owner and defeated state survive snapshot replay;
no second award or three-second respawn occurs.

The footage establishes the 1000-point award. Five-unit fall detection,
last-contact attribution in paired play, permanent retirement, precise enemy
coordinates, roaming distances, speeds and curl timing remain reconstruction
policies pending complete original comparison. This is not a full AI-parity
claim. The reward cue remains a synthesized remake effect.

## Regression coverage

Native physics tests cover a rolling collision followed by a knockout,
exactly-once scoring, no automatic respawn, uncredited falls, last-contact
ownership, snapshot continuation, and a supported lower elevation. Existing
campaign tests retain their normal bounded-input and fall-count assertions.
