# The Clockwork Garden

A 58-second procedural film rendered live in the browser with Three.js/WebGL:
a forgotten Victorian glasshouse whose brass, porcelain, copper and glass
garden wakes from a single ticking escapement — and the clockwork pollinator
bee that lives there. No video-generation models, no image assets: every
mesh, texture, light and sound is generated in code.

## Run it

No build step. Any static file server works (ES modules need http, not file://):

```bash
cd projects/clockwork-garden
python3 -m http.server 8765
# open http://localhost:8765/
```

Requires a WebGL2 browser (Chrome, Edge, Firefox, Safari 16+).

## Controls

Minimal controls fade in on mouse move / tap and hide during playback.

| Key | Action |
|---|---|
| Space / K | play / pause |
| R | replay from the start |
| ← / → | seek ±2 s |
| M | sound on/off (sound starts only after you turn it on) |
| F | fullscreen |
| H | hide all interface (clean view) |

The clock button toggles **gentle motion** (steadier, averaged camera). If the
OS requests reduced motion, the film waits and offers gentle or full motion.

## URL parameters

| Parameter | Effect |
|---|---|
| `?t=31.5` | start at a timestamp |
| `?paused=1` | start paused |
| `?clean=1` | recording mode: no interface at all |
| `?quality=low\|med\|high` | force a quality tier (mobile defaults to `low`) |
| `?motion=reduced\|full` | force gentle / full motion |
| `?capture=1` | frame-capture mode (no playback loop; exposes `window.__cg.renderAt(t)`) |
| `?look=bee&yaw=0.6&pitch=0.3&dist=7&t=27` | look-dev orbit around one object (`bee`, `monarch`, `flower`, `escapement`, `songbird`, …) |

`window.__cg.renderAt(t)` renders an exact, deterministic frame; `window.__cg.audioWav()` returns the score as WAV (base64).

## Recording a video file

Headless Chrome + ffmpeg, frame-exact, with the procedural score muxed in:

```bash
node tools/record.mjs --out exports/clockwork-garden-1080p.mp4 --w 1920 --h 1080 --fps 30
node tools/shoot.mjs --times 1,16,31,53 --out review/stills        # representative stills
```

(The tools expect a local static server on port 8765 and use the system
Chrome at `/usr/bin/google-chrome` with GPU WebGL.)

## The film

| Time | Shot |
|---|---|
| 0–8 s | **Heartbeat** — extreme close-up of a Swiss-lever escapement ticking in the dark; the charge builds and a pulse of amber light races along a copper root |
| 8–13 s | **Root crown** — the mainspring barrel releases, the whole gear train spins up together, light climbs the stem |
| 13–22 s | **Bloom** — the porcelain bud glows like a lantern, then opens ring by ring on visible levers, push rods and sleeves; stamens rise around the amber core |
| 22–28 s | **The pollinator** — the bumblebee crawls from its brass skep, flies to the bloom, gathers luminous pollen; the flower answers in a ripple of gold |
| 28–32 s | **Monarch** lands on a porcelain lily (the stem dips) and slowly opens its enamel wings on gilded hinges |
| 32–36 s | **Beetle** climbs a copper reed and slips beneath a leaf; a **ladybird** opens its shell and flies |
| 36–40 s | **Hummingbird** sips from a glass blossom, then turns to hover beside the camera |
| 40–58 s | **Reveal** — the songbird stretches its wings and lifts off; the camera pulls back as the whole garden blooms in a wave beneath the iron vault, bees, butterflies, dragonflies and birds rising through the light; title |

## Project structure

```
index.html, styles.css         page, title card, controls styling
src/main.js                    boot, renderer, playback loop, public API
src/core/                      seeded RNG, easing/timeline helpers, quality tiers
src/materials/                 procedural textures, material library, pulse shader
src/geometry/                  gears (meshing math), parts (screws, jewels, rods), surfaces (petals, leaves)
src/world/                     escapement, root crown, roots, hero flower, props, garden, flora,
                               greenhouse, sky, atmosphere (shafts, dust), lighting, environment maps
src/creatures/                 bee, butterfly, beetle/ladybird, dragonfly, bird rigs + choreography
src/direction/                 beats (story timing), camera tools, shot list, director
src/render/pipeline.js         HDR MSAA → bokeh DOF → light shafts → bloom → grade
src/audio/score.js             procedural score (OfflineAudioContext)
src/ui/controls.js             playback interface
tools/                         shoot.mjs (stills), record.mjs (video), motion_check.py, uicheck.mjs, sheet.py
docs/PRODUCTION_LOG.md         checklist, review log, remaining issues
review/                        review frames and contact sheets from each pass
```

## Licences

- Code: original work for this project.
- Three.js r185 (`vendor/three`): MIT — see `vendor/three/LICENSE`.
- Cormorant Garamond (`assets/fonts`): SIL Open Font License 1.1 — see `assets/fonts/cormorant-OFL.txt`.
- All textures, geometry and sound are generated procedurally at runtime.
