# Understorm 2026

An original side-scrolling shooter for the GameMaster Arcade. Twelve stages in three acts, ten bosses,
a charging Lance and a tethered Anchor drone. No build step: plain ES modules and a vendored three.js.

## Layout

| File | What it holds |
| ---- | ------------- |
| `js/config.js` | Playfield size, speeds, difficulty ranks, version |
| `js/sim.js` | Deterministic fixed-step simulation (60 Hz). No rendering, audio or DOM |
| `js/foes.js` | Enemy behaviours and the ten bosses |
| `js/stages.js` | The twelve stages as data, written through a small builder |
| `js/bot.js` | Autopilot used by the attract-mode demo and the headless tests |
| `js/render.js`, `js/post.js`, `js/models.js` | three.js scene, HDR post chain with light shafts, models built from primitives |
| `js/gfx.js` | Generated normal-mapped surfaces, the reflection environment, scenery props, near silhouettes |
| `js/audio.js` | Recorded music and effects (ElevenLabs) with the synthesised adaptive score as a fallback and an option |
| `js/scenery.js` | The far structures of each stage, assembled from instanced parts: lattice towers, tank farms, hulks, rock masses, crystal clusters, sky whales |
| `img/` | Per stage: a painted far backdrop (`bg_sNN.webp`) and a cut-out middle layer (`mid_sNN.webp`), loaded one stage at a time; `hull.webp` is the painted markings texture. About 3.1 MB in all |
| `audio/`, `music/` | 38 effect clips (the shot and the two smaller explosions in several takes), one ambience loop and six music tracks generated with ElevenLabs |
| `js/input.js`, `js/scores.js`, `js/main.js` | Input, score boards, game shell and menus |

Stages are authored in time order with a cursor: `b.go(seconds, floor, ceiling)` lays terrain and advances,
`b.wave(...)`, `b.turret(...)`, `b.cp()` and `b.boss(name)` place things at the cursor.

## Testing

```
node scripts/understorm/simtest.mjs            # every stage, autopilot, hits counted but not fatal
node scripts/understorm/simtest.mjs --real     # no cheats, base loadout: deaths per checkpoint
node scripts/understorm/simtest.mjs 7 --real --diff=hard
node scripts/understorm/deaths.mjs 4 2         # where the autopilot dies from stage 4, checkpoint 2
node scripts/understorm/aicheck.mjs            # how the autopilot uses the Anchor: throws, swaps, tether kills
```

URL switches for the browser: `?stage=5&cp=1` starts a practice run there, `?bot` lets the autopilot fly,
`?god` makes hits harmless, `?q=low|med|high` forces a picture tier, `?all` unlocks stage select.
Any of `?stage`, `?bot`, `?god`, `?noscores` stops scores being posted. In the console, `__us.skip(30)`
advances a practice run thirty seconds.

## Graphics

Each stage is drawn in layers, back to front: a painted backdrop, the procedural sky and clouds, the far structures,
the terrain and its props, the action, then loose cloud and weather passing in front.

- **Painted backdrops** are generated with fal (FLUX 1.1 pro ultra) by `scripts/understorm/gen_images.py`, which also
  crops the letterbox bars the model adds and encodes 2048 px webp. `scripts/understorm/fal_image.py` is the shared
  fal helper (the key comes from `FAL_KEY` and is never printed or stored). The sky shader samples the painting with
  mirrored tiling and a slow drift; if an image fails to load the procedural sky stands alone. Bump `PAINT_V` in
  `js/render.js` when the images change.
- **Surface detail** comes from one generated plate map (`plateTex` in `js/gfx.js`: panels, seams, hatches, vents,
  rivets, grime, lit windows) applied by `detailize`, which projects it in object space, so any primitive at any
  scale gets crisp panel lines without UVs. Ships, machines, bosses and structures all use it.
- **Terrain** gains thin glowing veins on the crystal, foundry, storm and core stages (`veins` in `js/gfx.js`), wet
  metal in the rain, hanging cables and bulbs, railings and rubble.
- **Damage** shows: hurt machines trail smoke and sparks, bosses smoke from half health and burn in the last third,
  debris smokes, glows and sparks where it lands. The machine bosses have turning dishes, blinking lamps and stacks.
- **Layered depth:** the middle layer is painted by fal on a chroma-key background and keyed to transparency by
  `scripts/understorm/gen_layers.py`; the sky shader slides it along the bottom faster than the far painting.
- **Moving scenery** (`tickFar` in `js/scenery.js`): cranes slew, lifts ride the towers, whales swim, water and molten
  metal fall, searchlights sweep, light shafts lean through the caves, beacons pulse and stacks vent steam.
- **Distant events** (`farEvents` in `js/render.js`): convoys, lightning, a far battle, blasts on structures, falling stars.
- **Set pieces:** a destroyed boss part tears away burning with a chain of blasts, and the first second of a boss's
  death plays in slow motion (wall-clock only: the simulation is unchanged).
- **Surfaces and lens:** scorch marks where shots and blasts meet terrain, heat shimmer over molten metal, a lens flare
  from the sun, a light colour grade per stage, a headlight cone in the dark stage.
- **Ship:** a fly-in at the start of a stage, an engine flame that lengthens with the speed setting, wingtip vapour in
  cloud, a fuller shield. Enemy and boss hulls carry painted stripes, stencils and rust from `hull.webp`.
- **Depth shading** (high quality only) darkens creases and contact points from the depth buffer in `js/post.js`.

## Audio

Music and sound effects are generated with ElevenLabs by `scripts/understorm/gen_audio.py understorm` (prompts are in
the script; it reads the key from the environment and never prints it) and trimmed, normalised and encoded by
`scripts/understorm/process_audio.py understorm games/2026-11-20/understorm`. OPTIONS has a Score switch between the
recorded tracks and the original synthesised score. If a clip fails to load, the synth version of that sound plays.
Bump `AV` in `js/audio.js` when the audio files change.

The effects were redone once: `scripts/understorm/regen_sfx.py understorm` generates several takes of each weak sound,
measures them (attack, length, spectral balance) and keeps the best; `process_audio.py` then high-passes, soft-clips and
trims each clip to the length its event needs. In the game, repeated sounds rotate between takes with a small random
pitch spread and a cap on overlapping copies. OPTIONS has a sound test that plays every effect by name.

## AI playthrough

WATCH THE AI FLY IT on the title screen runs the autopilot through all twelve stages with no cheats and
unlimited ships. The bar at the bottom shows what it is doing; `V` toggles its vision overlay (target,
tracked bullets, intended move), `F` cycles speed, `N` skips to the next stage and `Enter` hands you the
stick mid-flight. AI runs never post scores or unlock stages.

## Releasing

The site caches scripts in the browser for hours, so every import carries a version query (`?v=150`).
Bump it everywhere in one go when you ship, or returning players get a mix of old and new files:

```
sed -i -E "s#from '\./([a-z]+)\.js(\?v=[0-9]+)?'#from './\1.js?v=151'#g" js/*.js
sed -i -E 's#src="js/main\.js(\?v=[0-9]+)?"#src="js/main.js?v=151"#' index.html
```

## Score boards

`understorm-2026-easy`, `understorm-2026-normal` and `understorm-2026-hard` on the shared scores worker.
Practice, Sightseer and autopilot runs never post.

## What has and has not been checked

Checked: all twelve stages clear on the autopilot with no cheats on all three ranks; menus, pause, stage
select, ending, loop two, game over and the best-run ghost in a desktop browser; layout at phone size.

Not checked on real hardware: phones, a physical gamepad, and how the score sounds. The autopilot does not
tell you how hard it is for a person.
