# Shatter Storm: Amiga Edition v3.0.0

A standalone enhanced brick breaker derived from the clean-room browser remake
inspired by Jez's supplied 1987 Amiga disk.

## Play

Launch it from the Shatter Storm edition menu or open `index.html` directly.

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

The separate title screen opens Play, Options, or the Shatter Storm edition
selector. Options provide Relaxed, Classic, and Expert difficulty; Auto,
960x720, 1440x1080, and 1920x1440 render resolutions; separate
master/music/Paula-effect levels; independent music and SFX switches; optional
CRT scanlines; and optional screen shake. Settings persist in the browser.
Fullscreen uses measured viewport fitting so the status bar, complete 4:3
playfield, and controls remain visible without cropping.

The game includes ten handcrafted Arkanoid-inspired rounds, multi-hit and indestructible bricks,
enemy drones, six capsule types, multiball, lasers, catch, paddle expansion,
extra lives, and a persistent local high score.

Version 3 replaces the noisy emulator-capture clips and browser oscillator
effects with eight clean MP3 arcade samples generated for this game. Brick,
wall, paddle, launch, laser, capsule, death, and round-clear events each have a
distinct file. The exact generation prompts and settings are stored in both
the MP3 metadata and `audio/sfx-manifest.json`.

The optional background score chains four authentic Amiga gamerips from
Project-X, Turrican II, and Apidya, selected from Jez's existing Amiga Sounds
archive. It can be switched off or mixed independently from the effects.
