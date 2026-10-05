# The Clockwork Garden

A 58-second procedural film rendered live in the browser with Three.js/WebGL:
a forgotten Victorian glasshouse whose brass, porcelain, copper and glass
garden wakes from a single ticking escapement — and APX-9, the mechanical
pollination bee that lives there. You can also **become APX-9** and fly it
round the garden, or **follow it** as it goes about its day. No video- or
image-generation models, no image assets: every mesh, texture, light and
sound is generated in code.

## Three ways in

The landing screen (the garden is already alive behind it) offers:

| Mode | What it is |
|---|---|
| **Film** | the original 58-second film, unchanged and deterministic |
| **Fly as APX-9** | third-person flight: hover, turn, climb, bank, boost; land on blooms, gather pollen, carry it home |
| **Follow APX-9** | APX-9 works on its own (visits blooms, gathers, deposits at the skep, winds the garden); a cinematic camera follows it |

Switch any time: the explore button (winged hexagon) in the film's control
bar, the menu (top left) in the interactive modes, or `C` / the
*Take the controls* / *Autopilot* button between Follow and Fly (control
passes over from wherever the bee is).

### A living garden

The whole garden moves in one breeze that comes in through the near doors:
gusts travel down the house as bands, so you see a gust cross the beds rather
than every leaf jiggling. Leaves, petals and ferns flutter; the heavy brass
stems barely lean; the masses ripple; the ivy swags swing; the lanterns sway
on their chains with a pendulum's own period. As APX-9 passes (yours, the
autopilot's, or the film's), its wing-wash bends nearby leaves, petals and
fronds away and they spring back past rest and settle; the cameras push the
foliage aside too (and part it along their line of sight to the bee), so the
lens is never inside a leaf. The breeze is a function of the film's clock in
the film and of the garden's own clock in the interactive modes.

In the interactive modes the planting is grown at APX-9's scale: smaller,
varied enamel leaves with gilt midribs and veins, cupped and drooping on
their stalks (rosettes, leafy stems, shingled masses over exactly the shapes
the bee bumps into, elephant ears and canna blades, ferns, palms, ivy, ground
cover). Nothing passes through anything: every leaf is placed only where it
crosses no other leaf, stem, bloom, iron, glass, lantern or the soil
(`tools/overlapcheck.mjs` counts it). It grows in the background for a few
seconds after the page loads; until then the film's foliage stands in.

### What you can do in the garden

- **Pollinate any bloom**: descend gently onto it. Blooms open wide for an
  approaching bee; when it settles the petals flex open, the pollen boss
  lights and stays gilded, a music-box note sounds, and APX-9's drum brush
  draws in pollen (the hind-leg loads and the cuff gauge fill, as does the
  HUD gauge). The great porcelain bloom ripples gold, the porcelain lily's stem
  dips under the bee, the glass blossom's nectar brightens.
- **Deposit at the skep**: fly into its doorway with pollen. APX-9 lands on
  the board, walks in, the hive flares and chimes, and the next planting
  site **sprouts glass blooms** (first at the seedpods, then further out:
  twelve sites), so the garden grows over the session. Grown blooms can be
  pollinated too. The worker bees dance round the skep after each deposit.
- **Wind the garden**: touch the escapement beside the great bloom. The
  movement races, a pulse runs the copper roots, the gear train spins up,
  light climbs the stem, the great bloom answers and a **bloom wave**
  ripples out across the house (petals snap shut and spring open, a golden
  curtain and sparks travel with the front, every lantern kindles).
- **Lanterns, seed lanterns and path lamps** kindle as you pass.
- **Porcelain bellflowers** (new: 18 plants, about 110 bells, tuned to D-major
  pentatonic) swing and ring when brushed.
- **The armillary** above the fountain spins up when you fly through its rings.
- **Creatures react**: butterflies scatter from a rushing bee, a sapphire
  dragonfly takes a liking to you and escorts you a while, hummingbirds
  stop to inspect you, the songbird watches you from its bough and flies a
  loop if you crowd it.
- **Time of day**: one control from the film's midnight teal (moon, stars,
  firefly-glowing blooms) through dawn to the golden-hour finale.
- **Photo mode** (`P`): interface hidden, world frozen, free camera; `Enter`
  or *Save PNG* downloads the frame.
- **Sound** (`M` or the menu): wing buzz that follows wingbeat and speed, the
  pollen drum, escapement ticks by distance, bells, ratchet and root swell
  when winding, a pad whose chord follows the hour. Off until you turn it on.

## Run it

No build step. Any static file server works (ES modules need http, not file://):

```bash
cd projects/clockwork-garden
python3 -m http.server 8765
# open http://localhost:8765/
```

Requires a WebGL2 browser (Chrome, Edge, Firefox, Safari 16+).

**Before publishing, run `node tools/cachebust.mjs`.** jez237.com lets browsers
cache `.js`/`.css` for 4 hours but revalidates `index.html` on every visit, so
without it returning visitors get the new page running stale modules. The tool
stamps every module (via the import map) and the stylesheet with a content
hash in `index.html`; changed files get new URLs, unchanged ones stay cached.

## Controls

### Fly (desktop)

| Input | Action |
|---|---|
| Mouse | steer and look (click to capture the pointer; `Esc` releases). Without pointer lock, drag to look |
| `W` `S` · `↑` `↓` | fly forward · back (the bee flies where you look) |
| `A` `D` · `←` `→` | turn; the camera turns with you and, left alone, swings round to the direction of travel |
| `Space` / `E` · `Shift` / `Q` | climb · descend |
| `F` or hold left mouse | boost |
| `C` (or `Tab`) | hand APX-9 to its autopilot (Follow) |
| `T` · `[` `]` | cycle the hour · finer |
| `P` · `Enter` | photo mode · save PNG |
| `M` · `H` · `G` | sound · controls help · menu |

**Gamepad** (standard mapping): left stick fly (left/right turns), right stick look, `A` climb,
`B` or `LT` descend, `RB`/`RT` boost, `Y` autopilot, `X` photo, `Start` help,
`Back` menu.

**Touch**: joystick bottom left (up/down flies, left/right turns), ▲ ▼ and » (boost) bottom right, drag
anywhere else to look; the menu (top left) has time of day, sound, photo
mode, help and the mode switch.

### Follow

Drag to orbit, wheel or pinch to zoom; the camera drifts back to its own
framing after a few seconds. `C` or *Take the controls* to fly from where
APX-9 is.

### Film

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
| `&stage=landed\|folded\|flight\|walk\|display&key=1` | with `look=bee`: pose the hero bee (APX-9) in a clear spot above the bloom, facing +Z; `key=1` adds a studio-style key light from the camera side |
| `?mode=film\|fly\|follow` | open a mode directly (without it, and without any film-only parameter, a landing screen asks) |
| `?tod=0…1` | time of day in the interactive modes (0 midnight, 0.5 dawn, 1 golden hour; default 0.86) |
| `?touch=1\|0` | force the touch interface on or off |

Film-only parameters (`t`, `paused`, `clean`, `capture`, `look`) open the film
directly. Reduced motion (system setting or `?motion=reduced`) also applies to
the interactive modes: steadier cameras without roll or speed zoom.

`window.__cg.renderAt(t)` renders an exact, deterministic frame; `window.__cg.audioWav()` returns the score as WAV (base64).
`window.__cg.wind` is the breeze (`freeze` holds the rest pose, `noWash` switches APX-9's wash off, for review).
Review hooks for the interactive modes: `__cg.setMode(m)`, `__cg.explore()`
(the controller), `__cg.exploreView({ pos, target, fov, tod, reachable })`
(render the awake garden from any viewpoint), `__cg.exploreExit()`.

## Recording a video file

Headless Chrome + ffmpeg, frame-exact, with the procedural score muxed in:

```bash
node tools/record.mjs --out exports/clockwork-garden-1080p.mp4 --w 1920 --h 1080 --fps 30
node tools/shoot.mjs --times 1,16,31,53 --out review/stills        # representative stills
```

Interactive-mode tools:

```bash
node tools/drive.mjs --scenario tools/scenarios/interact.json --out review/x   # real keyboard/mouse/touch/gamepad input + frames
node tools/flycheck.mjs                                                        # fly mode: turning, camera vs travel, nothing between camera and bee
node tools/sweep.mjs --grid full --out review/explore/sweep               # camera sweep: positions x heights x yaws, contact sheets
node tools/sweep.mjs --views tools/views/key.json --tod 0.05 --out ...      # fixed key views at an hour
node tools/explorefps.mjs --q high                                          # real-time fps in fly mode at the busiest spots + follow
node tools/filmidentity.mjs --before <port>                                 # the film is pixel-identical after exploring (and vs a rollback copy)
node tools/overlapcheck.mjs                                                 # does anything pass through anything? (film set and bee-scale set)
node tools/living.mjs --shots tools/views/living.json --out review/x --sheet 1   # deterministic stills and frame strips (fly, follow, views, film)
node tools/stallcheck.mjs --minutes 25                                      # fast-forwarded autopilot: stalls, give-ups, leaves brushed
```

(The tools expect a local static server on port 8765 and use the system
Chrome at `/usr/bin/google-chrome` with GPU WebGL.)

## The film

| Time | Shot |
|---|---|
| 0–8 s | **Heartbeat** — extreme close-up of a Swiss-lever escapement ticking in the dark; the charge builds and a pulse of amber light races along a copper root |
| 8–13 s | **Root crown** — the mainspring barrel releases, the whole gear train spins up together, light climbs the stem |
| 13–22 s | **Bloom** — the bud is a closed porcelain egg glowing from within (pierced rosettes, gilt seams); its five hinged sepals release from a finial clasp and swing down on spring-loaded knuckles, revealing a spiral-furled tulip bud that unwinds and opens ring by ring on visible levers, push rods and sleeves; stamens rise around the amber core |
| 22–28 s | **The pollinator** — APX-9, Jez's mechanical pollination bee, walks out of an arched doorway in its brass skep, warms its smart-glass wings and flies to the bloom, stands on the anther ring and draws luminous pollen into its spinning pollen-drum brush (the hind-leg pollen loads swell and the cuff gauge fills amber); the flower answers in a ripple of gold |
| 28–32 s | **Monarch** lands on a porcelain lily (the stem dips) and slowly opens its enamel wings on gilded hinges |
| 32–36 s | **Beetle** climbs a copper reed and slips beneath a leaf; a **ladybird** opens its shell and flies |
| 36–40 s | **Hummingbird** sips from a glass blossom, then turns to hover beside the camera |
| 40–58 s | **Reveal** — the songbird stretches its wings and lifts off; the camera pulls back over an overgrown glasshouse (leafy beds, foliage masses, potted palms, shrub roses, ivy up the iron columns and in festoons under the eaves) as the garden blooms in a wave, glass lanterns kindle beneath the vault and sunbeams slant through the roof; APX-9 bumblebees, honeybees, butterflies, dragonflies and birds rise through the light; title |

The planting moves in a coherent breeze throughout the film (a pure function
of `t`, so every frame still renders the same from any history), and APX-9's
wing-wash ruffles whatever it flies past.

## Project structure

```
index.html, styles.css         page, title card, controls styling
src/main.js                    boot, renderer, playback loop, public API
src/core/                      seeded RNG, easing/timeline helpers, quality tiers
src/materials/                 procedural textures, material library, pulse shader
src/geometry/                  gears (meshing math), parts (screws, jewels, rods), surfaces (petals, leaves),
                               leaf (the parametric enamel leaf, GLSL + CPU twin), intersect (exact part crossing)
src/world/                     escapement, root crown, roots, hero flower (+ porcelain bud sheath), props, garden,
                               flora, foliage (far-field lushness, ivy, palms, lanterns), greenhouse, sky,
                               atmosphere (shafts, dust), lighting, environment maps,
                               wind (breeze, wing-wash, the vertex patch), planting (nothing through anything),
                               dome (relaxed leaf mounds)
src/creatures/                 apx9 (the resident pollinator, built from APX-9's blueprint in apx9Shape),
                               bee (honeybee, carpenter), butterfly, beetle/ladybird, dragonfly, bird rigs + choreography
src/direction/                 beats (story timing), camera tools, shot list, director
src/render/pipeline.js         HDR MSAA → bokeh DOF → light shafts → bloom → grade
src/audio/score.js             procedural score (OfflineAudioContext)
src/ui/controls.js             playback interface (with the explore popover)
src/ui/hud.js, landing.js      interactive-mode HUD (gauge, hints, help, menu, photo strip) and the landing screen
src/input/input.js             keyboard, mouse / pointer lock, wheel, touch joystick + buttons, pinch, gamepads
src/explore/                   the interactive modes:
  explore.js                     controller: awake world on a real-time clock, mode switching, cameras, practicals, hints
  timeofday.js                   one control for sky, sun/moon, ambient, environment ramp, fog, exposure
  bounds.js                      flight volume: analytic ground, walls, vault, ~4,000 collider shapes, landables
  actor.js                       APX-9's flight model and sequences (land, gather, take off, dock, deposit)
  pilot.js                       autopilot for follow mode (canopy-aware routes, variety, winding, trips home)
  cameras.js                     chase camera, cinematic follow camera, photo camera
  interactions.js                pollination, deposits, winding + bloom wave, kindling, armillary, sparks, pollen bosses
  growth.js · bells.js           sprouting glass blooms · porcelain bellflowers
  ambient.js                     butterflies, dragonflies, hummingbirds, skep bees, songbird
  scenery.js                     near gable and doors, far doors, column tops, glazing bars, end planting, exterior
  upgrade.js · cull.js           close-up foliage finish (enamel leaves, near-lens fade), tiling, glass; detail culling
  nearfield.js                   the bee-scale planting (grown in the background, collision-free, tiled, LOD)
src/audio/live.js              live synthesis for the interactive modes
tools/                         shoot.mjs (stills), record.mjs (video), determinism.mjs, fpscheck.mjs (real-time fps +
                               per-frame draw calls), motion_check.py, uicheck.mjs, gpucheck.mjs, sheet.py,
                               drive.mjs + scenarios/ (scripted input), sweep.mjs + views/, explorefps.mjs, filmidentity.mjs,
                               flycheck.mjs, overlapcheck.mjs, living.mjs, stallcheck.mjs, cachebust.mjs
docs/PRODUCTION_LOG.md         checklist, review log, remaining issues
review/                        review frames and contact sheets from each pass (interactive modes: review/explore/)
```

## Licences

- Code: original work for this project. `src/creatures/apx9Shape.js` ports blueprint maths (skeleton, abdomen profile, wing planform and vein network) from Jez's APX-9 exhibit (`demos/apx9-bee`).
- Three.js r185 (`vendor/three`): MIT — see `vendor/three/LICENSE`.
- Cormorant Garamond (`assets/fonts`): SIL Open Font License 1.1 — see `assets/fonts/cormorant-OFL.txt`.
- All textures, geometry and sound are generated procedurally at runtime.
