# Ghost kit

Tools that put a drum kit in the corner of a music video and have it play the song's real drum part:
every stick stroke and kick is transcribed from the recording and lands on the right drum on the frame
you hear it. First used for *69° North* (`/multimedia/distant-early-warning-69-north/`).

This folder is source only. It holds no audio, no video and no analysis data.

## What is here

| File | What it does |
| --- | --- |
| `stems.py` | Splits the track into drums, bass, vocals, other, guitar and keys with Demucs (`htdemucs_ft`, `htdemucs_6s`). |
| `drums.py` | The transcription. Reads six per-drum stems, finds every hit, cleans them with musical rules, assigns toms by pitch, feet to the two bass drums and hands to the two sticks. Writes `drumhits.npz` and prints tablature. |
| `kit.glsl` | The kit itself: a ray-traced double-bass kit, the stick and beater motion, and the choreographed tricks. |
| `render.py` | The offline renderer (moderngl → HDR accumulation → depth of field → kit layer → bloom → grade → ffmpeg). Feeds the kit its per-frame state. |
| `scene.glsl`, `common.glsl`, `height.glsl` | The *69° North* film the kit was built into. Another film replaces these. |
| `analyze.py`, `analyze_mix_v1.py` | Audio features for the film (not needed for the kit alone). |
| `constraints.txt` | Version pins that keep the GPU build of PyTorch in place when installing `audio-separator`. |

## Pipeline for a new song

1. **Stems.** `stems.py` gives `audio/stems/drums.wav` (and the rest).
2. **Per-drum stems.** Split `drums.wav` with the MDX23C DrumSep model through the `audio-separator` package:
   `Separator(output_dir='audio/drumsep', output_format='WAV').load_model('MDX23C-DrumSep-aufr33-jarredou.ckpt')`,
   then `.separate('audio/stems/drums.wav')`. It writes kick, snare, toms, hh, ride and crash.
   Install with `pip install -c constraints.txt --extra-index-url https://download.pytorch.org/whl/cu128 audio-separator onnxruntime audioread`.
3. **Transcribe.** `drums.py` writes `film/drumhits.npz`. Read the tablature it prints: fills should run down the
   toms and verses should show a steady pattern. That is the quickest check that it is right.
4. **Render.** `render.py` loads `drumhits.npz` and drives `kit.glsl`. `--kitdbg` shows the kit full-screen for checking.

The scripts expect to be run from a work folder that has them in `film/` and the track in `audio/`.
File names for the track are hard-coded near the top of each script.

## Things that mattered

- **Hit time is the foot of the attack**, not the peak: walk back from the envelope peak to 18% of it.
  The separated stems are sample-aligned with the mix, so no offset is needed.
- **Leakage is judged in absolute level.** A faint hit that coincides with a much louder one in another stem is
  dropped. Judging by each stem's own scale let many false hi-hat and ride hits through.
- **A crash has to ring.** A blip in the crash stem with nothing left 250 ms later is hi-hat or ride wash.
- **The time-keeping hand stays on one cymbal.** A lone ride stroke inside a hi-hat pattern (or the reverse) is moved.
- **Toms by pitch.** The fundamental of each tom hit (55–330 Hz) is clustered; clusters map to drums small to large.
- **Feet.** The right foot leads; kicks closer than 0.19 s alternate to the left bass drum.
- **Hands.** Cymbals prefer the right hand and the snare the left, with a travel-time cost. One stick cannot land
  twice within 75 ms; the weaker stroke is skipped, but its drum still reacts.
- **The drummer's own raised viewpoint** reads best: sticks come in from the bottom of the frame and every head shows.
- **Every piece carries its own offset**, and the stick targets are computed from the piece's current position,
  so the sticks keep hitting the right drum while the kit explodes, orbits or tumbles.
- **The kit is its own render layer, composited after depth of field.** Mixed into the scene before the blur,
  it picked up a halo in every shot with depth of field.
- **Lens fringing is masked off the kit's corner** in the grade.
- **Check sync on the finished file**: measure a drum head's brightness frame by frame around a known hit.

## Limits

The transcription is automatic. Kick and snare are reliable; which crash is which is assigned by brightness;
some hits will be wrong. Correcting by hand means editing the event list `drums.py` writes.
