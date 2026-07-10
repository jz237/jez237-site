# Arkanoid: Recoded

A standalone, clean-room browser remake inspired by the supplied 1987 Amiga
disk. It does not use code, graphics, music, ROM data, or other assets copied
from the original game.

## Play

Double-click **Arkanoid: Recoded** on the desktop, or run:

```sh
./play.sh
```

No installation, web server, network connection, or proprietary Amiga ROM is
required.

## Controls

- Mouse or Left/Right: move the Vaus paddle
- Click, Space, or Enter: launch the ball; fire when the laser capsule is active
- P: pause
- F: full screen
- M: mute
- On phones/tablets: drag anywhere on the playfield to move; tap to launch or
  fire. On-screen Pause, Settings, Fullscreen, Music, and Sound controls remain
  visible.

The launch settings screen provides Relaxed, Classic, and Expert difficulty,
separate master/music/Paula-effect levels, independent music and SFX switches,
optional CRT scanlines, and optional screen shake. Settings persist in the
browser. Fullscreen uses measured viewport fitting so the status bar, complete
4:3 playfield, and controls remain visible without cropping.

The game includes procedural rounds, multi-hit and indestructible bricks,
enemy drones, six capsule types, multiball, lasers, catch, paddle expansion,
extra lives, and a persistent local high score.

The `audio/` effects were captured directly from Jez's supplied original
Arkanoid disk running through FS-UAE's emulated Amiga Paula audio hardware.
Mechanical virtual-floppy noise was disabled during capture. A few procedural
synth cues remain as fallbacks and accents when an original sample is not a
good match for a new remake-only event.

The optional background score is newly composed and obeys characteristic
Amiga tracker constraints: four hard-panned Paula-style channels, quantized
8-bit sample buffers, and ProTracker speed 6 at 125 BPM. It uses no oscillators,
modern reverb, or unlimited polyphony. It is not copied from Arkanoid and can
be switched off or mixed independently from the original effects.
