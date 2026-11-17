# Ocean Water Lab

**A real-time ocean for games, open source.** FFT waves, breaking surf that follows the coastline, tides, storms, rogue waves, floating physics, a speedboat and a pirate ship you can sail. The shaders come in GLSL and HLSL, the physics in JavaScript, C++ and C#. A browser lab with about 100 parameters lets you dial in a look and export it to your engine.

![Golden Coast with the advanced panel open](media/golden-coast-panel.jpg)

| | | |
|---|---|---|
| ![Big Surf](media/big-surf.jpg) | ![Moonlit, bioluminescent wake](media/moonlit-bioluminescence.jpg) | ![Rogue wave](media/rogue-wave.jpg) |
| Big Surf: breakers follow the depth, foam tears into streaks | Moonlit: plankton glow in the wake | A rogue wave group focusing as it passes |
| ![Speedboat at sunset](media/speedboat-sunset.jpg) | ![Hurricane](media/hurricane.jpg) | ![Glass Calm](media/glass-calm.jpg) |
| Speedboat with wake and spray | Hurricane: rain, gusts, spindrift, lens drops | Glass Calm: a near mirror at dawn |

## Try it

Download or clone this repo, then open `demo/dist/index.html` in Chrome, Edge, Firefox or Safari. It is one self-contained file with no build step, no server and no install. It needs WebGL 2.

- **Game looks:** one click for Tropical Bay, Golden Coast, Pirate Seas, Big Surf, Hurricane, Pirate Storm, Deep Ocean, Moonlit or Glass Calm.
- **Take the helm:** pick Speedboat or Pirate ship, then press *Take the helm*.
  - Speedboat: W/S throttle, A/D steer, Shift boost.
  - Ship: W/S set more or less sail, A/D rudder, Space fires a broadside, Q/E fire port or starboard.
- **Play tour:** a cinematic run through every look.
  - *Render film* draws the tour frame by frame and encodes a smooth 1080p MP4 with sound (WebCodecs), however slow your GPU is.
  - *Record tour* and *Record* capture in real time instead.
- **Advanced:** every parameter, grouped: waves, foam, optics, shore, sky, weather, camera + grade, physics + vessels.
- **Export:** the current look as JSON, as exact kit uniforms, or as the closest Unity HDRP, Unreal Water or Godot settings. Paste JSON back in to load a look.

## What is in it

**Waves**
- Tessendorf FFT over four cascades, from 1 km swell to 3 cm ripples. Uses a JONSWAP wind sea plus swell, directional spreading, fetch and choppiness.
- An analytic Gerstner fallback that the CPU evaluates exactly, for lockstep games and low-end devices.
- Slope-variance (LEAN) filtering, so distant water glitters instead of aliasing.

**Shore**
- Breaking surf from any depth field: shoaling (Green's law), breaking at a breaker index, crests that lean and throw a lip.
- Breaker foam that tears into streaks along the direction of travel, with controls for trail, streakiness, scale and lingering foam.
- Swash and wet sand.
- Tides: a level, plus a swing and period.

**Foam**
- Whitecaps calibrated against measured wind coverage.
- Persistent foam trails, plus a separate long-lived wake channel.
- Wind streaks, Kelvin wake arms behind boats, and Langmuir slicks (glassy lanes along the wind).

**Light**
- A physical sky (Hillaire 2020) with volumetric clouds and their shadows.
- Planar reflections, refraction with depth absorption, light through crests, caustics.
- Sun shadow maps, underwater light shafts.
- Grade: tone curves (ACES, AgX, filmic, Reinhard), white balance, split toning, grain, FXAA.

**Weather**
- Rain streaks, splashes and distant curtains, drops on the lens.
- Gust fronts (cat's paws), spindrift in a gale, lightning with forked bolts and thunder.
- Rogue waves, and bioluminescence at night.

**Physics**
- Buoyancy from GPU read-back of the actual rendered surface: Archimedes lift, Froude-Krylov force, drag.
- Objects ride the surf and rogue waves too.
- A planing speedboat, and a square-rigger that sails by the apparent wind and fires cannons.

**Sound**
- Procedural ocean, wash, wind, rain, thunder, engine, cannons and splashes. Turn it on with *Sound*.

## Water Lite: for low-end and stylized games

[`lite/`](lite/) is a second, separate engine for browser games that have to run on weak hardware or want a particular art style. It is one JavaScript file on WebGL 1 with no dependencies.

- **Clear water.** Everything under the surface is drawn first: seabed, rocks, seaweed, fish and the sunken half of floating things. The water then bends it, tints it by depth and lights it with moving caustics.
- **Three views:** a 3D island lagoon, a 2D side view and a 2D top-down view.
- **Six art styles:** realistic, toon, pixel art, low poly, retro and ink.
- **Pixel art in whole pixels,** with retro palettes and clean ordered dithering.
- **The same physics in every style:** things float, boats leave wakes, ripples bounce off coasts, and waves wash up beaches.
- **Day, sunset, night and storm,** with rain, lightning, stars and glowing foam at night, in every view and style.
- **Ready for real games:** scrolling 2D cameras and bigger maps, splash and lightning events for sound, an `auto` quality that follows the device, a one-call device benchmark, and recovery from a lost GPU context.

![Water Lite in three views and six art styles](media/lite-grid.jpg)

![Water Lite at day, sunset, night and in a storm](media/lite-moods.jpg)

See [lite/README.md](lite/README.md) for the API and options.

## Using it in an engine

The engine-facing code is in [`kit/`](kit/README.md):

| | |
|---|---|
| `kit/glsl/` | Wave sampling, shading, surf, weather, FFT passes, foam and ripple simulations |
| `kit/hlsl/` | The same libraries in HLSL (Direct3D, Unity, Unreal custom nodes), generated from the GLSL so they cannot drift apart |
| `kit/js/` | WebGL2 host for the FFT ocean, and the analytic sea |
| `kit/cpp/`, `kit/csharp/` | Buoyancy against any water source, the analytic sea, and FFT read-back patches |

`kit/README.md` covers wiring, conventions (Y up, metres, positions relative to a wave origin) and notes for Unity, Unreal and Godot.

## Building from source

```
git clone https://github.com/rahulbhola877/ocean-water-lab
cd ocean-water-lab
npm install          # only needed for the test scripts (Playwright)
npm run build        # demo/src + demo/shaders + kit -> demo/dist/index.html
npm run hlsl         # regenerate kit/hlsl from kit/glsl (Python 3)
npm test             # end-to-end check in a headless browser
npm run test:fft     # GPU FFT against a direct CPU sum
```

The HLSL type check and the C++ cross-check are described in `kit/tests/README.md`.

## Repository layout

```
demo/src/        page template, the lab (main.js) and every parameter and scene (params.js)
demo/shaders/    sky, clouds, terrain, objects, particles, post
demo/dist/       the built single-file demo
kit/             engine-facing shaders and physics (see kit/README.md)
lite/            Water Lite: water-lite.js, its demo and build (see lite/README.md)
tools/           screenshot and smoke-test scripts, HLSL generator
media/           screenshots
```

## Honest limits

- **Frame rates:** only measured on a software renderer. Frame rates on real GPUs have not been measured yet. Reports welcome.
- **Surf:** breakers lean and throw a lip but never curl into a closed tube. They always come straight up the depth gradient, with no refraction around headlands.
- **HLSL:** type-checked with clang, but not compiled with FXC/DXC or run on a Direct3D device.
- **C#:** ported by hand and not compiled.
- **Engine export:** the Unity HDRP and Unreal mappings are approximate. Only the kit uniforms are exact.
- **The pirate ship's sails:** tuned for play, not for naval architecture.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Engine ports, real-GPU performance numbers, and side-by-side comparisons with reference footage are especially welcome.

## Sources

- Tessendorf, *Simulating Ocean Water*, 2001
- Hasselmann et al. 1973, the JONSWAP spectrum
- Monahan and O'Muircheartaigh 1980, whitecap coverage
- Cox and Munk 1954, sun glitter
- Bruneton, Neyret and Holzschuch 2010, rough-sea Fresnel
- Olano and Baker 2010, LEAN mapping
- Hillaire 2020, sky and atmosphere
- Schneider 2015, *Horizon Zero Dawn* clouds
- Green's law and breaker index from standard coastal engineering texts

## Third-party code

The demo inlines [mp4-muxer](https://github.com/Vanilagy/mp4-muxer) 5.2.2 by Vanilagy (MIT, see `demo/src/vendor/mp4-muxer.LICENSE`) to write the MP4 files.

## License

[MIT](LICENSE). Use it in anything, commercial or not.
