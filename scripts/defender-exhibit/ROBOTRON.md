# Robotron exhibit provenance and limits

Robotron shares the room, CRT renderer and inspection controls with Defender. Each machine keeps a separate autonomous game and audio state. Selecting either physical cabinet (or its accessible selector) reassembles the old cabinet, moves it back along a curved path and brings the selected cabinet forward. Only the foreground cabinet produces audio. Models use batched geometry and shared textures; the mobile performance preset avoids postprocessing.

## Original assets

- **143 bitmap frames** decoded from [Williams original source](https://github.com/historicalsource/robotron): RRG23 (player), RRP8 (grunts/electrodes), RRH11 (family/hulks), RRB10 (brains), RRC11 (spheroids/enforcers), RRTK4 (quarks/tanks). Stored as row-major palette nibbles in `src/RobotronSprites.ts`. Extraction tool: `tools/robotron/extract_sprites.py`.
- Palette: DA51 in [Scott Tunstall’s annotated disassembly](https://github.com/ScottTunstall/Robotron2084), with the original RGB resistor bit allocation and cycling color entries. Williams letter bitmaps are shared with the Defender exhibit.
- **16 sound effects** rendered from [Video Sound ROM 3](https://github.com/synamaxmusic/WiLL-i-ROMS/blob/master/Video%20Sound%20ROMS/Video%20Sound%20ROM%203.asm). Reconstructed bytes match CRC32 `c56c1d28`, SHA1 `15afefef11bfc3ab78f61ab046701db78d160ec3`. Priorities and command sequences follow the original game source. The 6800 renderer runs at 3,579,545 / 4 Hz and integrates the PIA DAC output into 44.1 kHz PCM; the browser plays one priority voice. There is no oscillator approximation or live ROM emulation. Source and regeneration instructions are in `tools/sound/render-robotron.c` and `tools/robotron/render_audio.py`. The emulator's existing GPL license remains in `tools/sound/sound-emulator-kit`.
- Logo: [Williams Robotron vector logo](https://de.wikipedia.org/wiki/Datei:Robotron_2084_Logo.svg), vectorized by Frank Murmann from PixelatedArcade. Original copyright/trademark holder Williams Electronics. Local SVG preserves source metadata.
- Control arrangement: [surviving panel photograph](https://pixelatedarcade.com/pictures/130): left movement stick, right firing stick, two blue start buttons at the right edge. The panel uses an archived original-design scan and the sides use a documented reproduction of the vertical 2084 stencil; see ARTWORK.md.
- Hardware families: [Williams March 1982 instruction manual](https://www.jestersattic.com/files/Robotron_Instruction_Manual_16P-3005-101_Mar_82.pdf). 6809E, 48 KiB 4116 RAM, two SC1 blitters, twelve program EPROMs and D8224 sound system.

## Interpretation

The battle and autonomous pilot are newly written. Original bitmap/sound data does **not** make this cycle-accurate Robotron emulation. Enemy timing, collision rules and wave populations are approximations. Cabinet profile, board placement, wiring and artwork fitting are educational reconstructions; shared Williams components do not establish exact factory dimensions or fitment. The component notes distinguish these limits.

## Verification

`npm run build` builds both separate 13-assembly GLBs. `node --test tests/*.test.mjs` covers both simulations, unique human states, pause/power behavior, dual sticks, twelve ROM sockets, blitter packages and non-silent checksum-matched WAVs. Browser review covers Hero, Exploded, X-Ray and Watch on desktop/mobile; physical cabinet selection, swap/return, independent audio, chip inspection, pause/power and orbit regression checks. The latest Defender service doors, hinged control panel, mechanical demonstrations, chip close-ups, positional speaker audio and reserved mobile control dock are preserved for both machines. The public page remains `/demos/defender-exhibit/`.
