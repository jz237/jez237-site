# Rendering the original Defender sound program

`render-defender.c` runs the original 2048-byte VSNDRM1 program with the vendored EmulatorKit 6800 CPU core, RAM and the sound board's PIA/DAC memory map. The core is from https://github.com/EtchedPixels/EmulatorKit at b145b9003d94af73f92cca7f73c0ab1c6be6951d. Its GPL license is retained in `sound-emulator-kit/COPYING`. The renderer and Python driver added here are also GPL-3.0-or-later.

Build with a C compiler (GCC, Clang, or `zig cc`):

```
cc -O2 render-defender.c sound-emulator-kit/6800.c -o render-defender
python render.py --rom /path/to/defend.snd --renderer ./render-defender
```

FFmpeg must be on PATH. The driver verifies the input ROM hash before rendering. It writes 44.1 kHz mono PCM WAV files and their provenance/hash manifest to `public/audio`. The ROM itself and compiler executable are not included.

Output timing uses the original command table and catch repetitions. Resampling integrates the DAC value over each output sample at a 3.579545 MHz / 4 CPU clock. A 30 Hz high-pass removes DAC DC offset; 2 ms onset and 3 ms end fades avoid switching clicks. This produces samples from the original sound program, not newly invented sound effects. It is not a claim of cycle-perfect analog output: CPU writes are timestamped at instruction boundaries, and the browser repeats a rendered thrust segment.

See `ACCURACY.md` and `public/audio/manifest.json` for original program and command-table sources. Williams' original sound material is not relicensed by the emulator code license.
