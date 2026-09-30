# Open Sea

A real-time, dependency-free WebGL 2 ocean. Waves, lighting and procedural textures run on the GPU, and fish perception runs on the CPU. The detailed 52 m schooner is built in Blender and loaded from a 2.9 MB compressed mesh; the browser has no framework dependency or build step.

Open `index.html` from any static server. It needs WebGL 2 with float render targets
(`EXT_color_buffer_float`), which every current desktop browser and recent phones provide.

## What is simulated

| Layer | Method |
| --- | --- |
| Waves | Tessendorf FFT ocean, five spectral cascades (2.4 km down to 4.7 m tiles, 256²), JONSWAP wind sea plus a swell, choppy horizontal displacement, capillary dispersion. The wind (0.3 to 35 m/s) sets the sea state and significant wave height (1 cm to 14 m); swell, direction, choppiness, wave height and foam can then be adjusted independently. |
| Roughness | Per-cascade slope moments are mip-mapped (LEAN-style), so distant water turns into glitter roughness instead of shimmering; an unresolved-ripple term tops it up to the Cox-Munk slope variance. |
| Whitecaps | Foam is generated where the surface folds over itself (Jacobian < threshold), stored per Lagrangian surface particle so it rides the waves, and decays exponentially. It is drawn by thresholding that field against fractal noise (ragged, multi-scale edges) plus a cell-wall lace that only carves holes where the foam is thin, so fresh foam is a dense white sheet and old foam breaks into a net instead of a cotton-ball blob. Total coverage is servoed to a Monahan-style whitecap fraction by an asynchronous GPU read-back. |
| Sky | Hillaire-style atmosphere (transmittance, multiple-scattering and sky-view LUTs) with sun **and** moon as light sources, ozone twilight, stars and a Milky Way. |
| Clouds | Ray-marched volumetric layer (Perlin-Worley shape + Worley detail, adaptive stride, multiple-scattering approximation). A sun-projected shadow map darkens the sea; a hemi-octahedral environment map feeds reflections and ambient light. |
| Water shading | Roughness-aware Fresnel, Gaussian-slope glitter for sun and moon, sub-surface colour, a planar mirror image of the yacht in calm water, refraction of the submerged hull, aerial perspective toward the local horizon colour. |
| Yacht | Blender-built 52 m three-masted schooner inspired by the generated 20–30 crew concept. Five cambered cloth sails, reefing, brass-rimmed portlights, framed deckhouse windows, teak deck, winches, anchors, tender, fine tubular rigging and a submerged keel/rudder. Hull height/pitch/roll follow asynchronous GPU wave probes; scaled Kelvin wake, persistent foam trail and hull ripples. |
| Weather | Rain streaks, a patchy rain veil, fractal lightning with return strokes that light the clouds and the sea. |
| Ripples | Damped 2D wave equation on a toroidal height field with a **fixed 1/120 s step** (see below). |
| Underwater | Beer-Lambert absorption (red dies first), colour-preserving path radiance (no grey veil), caustic-modulated sun shafts, Snell's window with total internal reflection outside it, fish schools and marine snow. |

## Keeping the ripple solver stable

The classic failure is a splash-ripple solver that scales its step with the frame time and blows up after a hitch.
`ripples.js` avoids it structurally:

* the integrator only ever uses `dt = 1/120 s`; the frame time decides how many steps run, never their size,
  so the Courant number stays at about 0.13 (limit 0.71);
* at most five steps run per frame and any surplus wall time is discarded (the ripples slow down instead of exploding);
* rain drops are spawned per fixed step from a hash of (texel, step index) with a fixed probability, so their number
  and amplitude do not depend on the frame rate;
* the update is bounded by velocity damping, a Laplacian-mixing term, a `tanh` height limit and a velocity clamp.

`scripts/open-sea/tests/ripple-test.html` drives it with steady, alternating 1 ms/200 ms, random, periodic
4 s hitches, tiny and 30 s frame times; peak height stays near 8 mm with no NaNs in every case.

## Controls

The panel (top left, `×` closes it) has five sections:

* **Camera**: Tour, Free fly, Boat, Dive, and *Next shot* (cuts to the next shot of the tour).
* **Sea**: Glassy to Storm presets, then wind, swell, direction, choppiness, wave height and foam sliders.
* **Sky**: time presets (Sunrise to Night) with sun height and bearing sliders, weather presets (Clear to Storm, Rain and Storm add rain; Storm adds lightning) with cloud cover and cloud wind.
* **Water**: seven water types (Open ocean, Tropical, Coastal green, Arctic, Deep ocean, Lagoon, Shallows) that change the surface colour and the underwater light; clarity scales how far light travels; night glow lights breaking water and the wake with bioluminescence after dark.
* **Image & sound**: procedural sound (surf, wind, rain, thunder, muffled under water), Auto/Low/Medium/High resolution, exposure, glow (bloom) and field of view.

* **Tour** starts automatically, lasts 172 seconds, and hands over to free flight. Movement keys, drag or scroll take over immediately.
* **Fly**: drag to look, `W A S D` move, `Q`/`E` down/up, `Shift` fast, `Ctrl` slow, wheel changes speed. On touch:
  drag to look, pinch to move, two-finger vertical drag for altitude. Fly straight through the surface to go underwater.
* **Boat** orbits the yacht, **Dive** orbits it from below.
* The visible **Fullscreen** button enters or exits fullscreen; `F` does the same. `H` hides the controls, `P` saves a PNG, `1`-`4` switch camera mode.

## Development

The harness scripts need Playwright: `cd scripts/open-sea && npm install && npx playwright install chromium`.

```bash
python3 -m http.server 8791            # from the repository root
node scripts/open-sea/shot.mjs out.png "t=15.5&sea=2&cloud=0.2&ycam=63,20,-75,17" 8 2 1280x720
node scripts/open-sea/review-set.mjs out-dir 1280x720 30      # the standard set of review stills
```

URL parameters (with `shot=1` the page is driven by the harness instead of `requestAnimationFrame`):
`t` hour of day, `sea` 0-9 (sets wind, swell and choppiness together), `cloud`, `rain`, `light` (0/1), `wind` direction in radians,
`water` (a water type name), `sunh`/`suna` sun height and bearing in degrees, `glow`, `clarity`, `ev`, `bloom`, `fov`, `hs` (wave height multiplier), `foam`, `swell`, `chop`, `cloudwind`, `cam=x,y,z,yaw,pitch`,
`ycam=distance,height,azimuthDeg[,lookHeight]` (camera relative to the yacht), `noyacht`, `under=1`, `q=low|high`.

Headless Chromium on a machine without a GPU uses SwiftShader; expect seconds per frame there. On a real GPU the
demo adapts its render resolution to hold a playable frame rate (`AUTO`), or fix it with the quality button.

## September 29 refinement and verification

Rendered and inspected on an NVIDIA RTX 5090 through Edge/WebGL 2 at 1440 x 900, including daylight, glassy calm, sunset, moonlight, storm, a submerged school and an upward sun view. The scene compiled and ran without browser errors. Keyboard takeover, Dive, the automatic end-of-tour handoff, and a 390-pixel mobile layout were exercised.

Distant reflections now integrate subpixel slope moments and reflected radiance; the display pass resolves fine wave, rigging and fin edges. Aged foam is less opaque, cloud tops vary, rain has shorter softer streaks, and sail normals follow the deformed cloth. Underwater scattering is lower, caustic focusing excludes unresolved capillary waves, and submerged hull lighting uses one depth-attenuation convention.

Fish have persistent local perception, neighbor alignment/cohesion/spacing, energy and food memory, cruise/burst/glide/inspection states, bounded upright turns, a traveling body wave with a steady head, and separate fin oscillators. A 120-second test exercised every state, recorded no nonfinite values, a maximum pitch of 10.4 degrees, mean school alignment of 0.895, and median vertical exploration of 2.83 m. The passing habitat is populated while above the water; fish remain in world space while submerged.

A GPU ripple stress run alternated 1/240, 1/60, 1/30, 0.18, 0.004, 0.5, 1/120 and 0.02-second frame intervals under full rain and a hull disturbance. Across 1,140 fixed steps, heights stayed below 14 mm, velocity below 0.43 m/s, and there were no NaNs or WebGL errors. Excess catch-up steps were discarded as designed.

An independent critical reviewer found a substantial improvement and rated the calmer stills around 6-7/10, but **did not judge them reliably photographic**. The remaining larger limitations are the procedural yacht/fish geometry, a single volumetric cloud layer, cellular foam close up, and a height-field wave model that cannot overturn breakers or throw airborne spray. Distinct underwater shafts are subtler than the broad sun glow. Procedural surf, wind, rain and thunder sound is available, but its realism has not been assessed by ear. Real GPU frame rate depends on resolution and the scene; AUTO adjusts resolution. These limits are documented rather than disguised as photographic success.

WebGL 2 with `EXT_color_buffer_float` is required. Without it the page shows an explanation.

## Large schooner asset

`blender --background --factory-startup --python scripts/open-sea/build-schooner.py -- <absolute-repository-path> <absolute-output-directory>` regenerates the editable `schooner-52m.blend`, a studio render, and `assets/schooner.json` / `assets/schooner.bin.gz`. Blender 5.2 was used. The browser loads the mesh with `DecompressionStream`, uses 13 material classes, and animates each sail about its actual luff axis. Mesh export includes 140,661 vertices and 199,876 triangles, plus eight animated mainsheet and headsail sheet tubes.

The tour and boat/dive cameras, buoyancy probes, sailing speed and wake have been resized for the larger vessel. Fine metal highlights include derivative-based normal filtering to reduce distant sparkle. The monochrome fullscreen button remains visible with the control panel folded, and reflects fullscreen state in its label and accessibility attributes.

This is a detailed interpretation of an artistic concept, with exterior fittings and underwater geometry. It is not an exact reconstruction from naval plans: interiors, crew models, structural certification and a validated 20–30-person capacity are not included. Browser shading is designed for real-time performance and differs from the Cycles studio render.

The final replacement was exercised in daylight, close deck views, a reefed storm and below the hull, with no browser errors. Fullscreen entry/exit through the button and F shortcut, a 390-pixel mobile layout, Dive and the tour handoff passed. LOW quality sustained approximately 60 fps on the tested RTX 5090; other devices and higher settings can differ. An outside reviewer identified self-shadow bands and detached running rigging; own-sail proxy shadows are excluded, headsail furling preserves the forestay, and mainsheets update with their booms. Thin static rigging is blended after opaque surfaces without depth writes.
