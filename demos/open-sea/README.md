# Open Sea

A real-time, dependency-free WebGL 2 ocean. Everything (waves, sky, clouds, yacht, fish) is generated on the
GPU at load time; there are no image or model assets and no build step.

Open `index.html` from any static server. It needs WebGL 2 with float render targets
(`EXT_color_buffer_float`), which every current desktop browser and recent phones provide.

## What is simulated

| Layer | Method |
| --- | --- |
| Waves | Tessendorf FFT ocean, five spectral cascades (2.4 km down to 4.7 m tiles, 256²), JONSWAP wind sea plus a swell, choppy horizontal displacement, capillary dispersion. Sea state 0-9 sets significant wave height (1 cm to 14 m) and wind (0.3 to 29 m/s). |
| Roughness | Per-cascade slope moments are mip-mapped (LEAN-style), so distant water turns into glitter roughness instead of shimmering; an unresolved-ripple term tops it up to the Cox-Munk slope variance. |
| Whitecaps | Foam is generated where the surface folds over itself (Jacobian < threshold), stored per Lagrangian surface particle so it rides the waves, and decays exponentially. It is drawn by thresholding that field against fractal noise (ragged, multi-scale edges) plus a cell-wall lace that only carves holes where the foam is thin, so fresh foam is a dense white sheet and old foam breaks into a net instead of a cotton-ball blob. Total coverage is servoed to a Monahan-style whitecap fraction by an asynchronous GPU read-back. |
| Sky | Hillaire-style atmosphere (transmittance, multiple-scattering and sky-view LUTs) with sun **and** moon as light sources, ozone twilight, stars and a Milky Way. |
| Clouds | Ray-marched volumetric layer (Perlin-Worley shape + Worley detail, adaptive stride, multiple-scattering approximation). A sun-projected shadow map darkens the sea; a hemi-octahedral environment map feeds reflections and ambient light. |
| Water shading | Roughness-aware Fresnel, Gaussian-slope glitter for sun and moon, sub-surface colour, a planar mirror image of the yacht in calm water, refraction of the submerged hull, aerial perspective toward the local horizon colour. |
| Yacht | Procedural 11.5 m sloop. Hull height/pitch/roll follow the water through asynchronous GPU wave probes; wake = analytic Kelvin pattern + persistent foam trail + hull ripples. |
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

Panel (top left): camera mode, presets, sea state, time of day, cloud cover, rain, lightning, quality.

* **Tour** starts automatically and loops. Any key press, drag or scroll hands control to free flight.
* **Fly**: drag to look, `W A S D` move, `Q`/`E` down/up, `Shift` fast, `Ctrl` slow, wheel changes speed. On touch:
  drag to look, pinch to move, two-finger vertical drag for altitude. Fly straight through the surface to go underwater.
* **Boat** orbits the yacht, **Dive** orbits it from below.
* `H` hides the panel, `P` saves a PNG, `F` fullscreen, `1`-`4` switch camera mode.

## Development

```bash
python3 -m http.server 8791            # from the repository root
node scripts/open-sea/shot.mjs out.png "t=16.5&sea=4&cloud=0.35&ycam=30,5,60" 8 2 1280x720
node scripts/open-sea/review-set.mjs out-dir 1280x720 30      # the standard set of review stills
```

URL parameters (with `shot=1` the page is driven by the harness instead of `requestAnimationFrame`):
`t` hour of day, `sea` 0-9, `cloud`, `rain`, `light` (0/1), `wind` radians, `cam=x,y,z,yaw,pitch`,
`ycam=distance,height,azimuthDeg[,lookHeight]` (camera relative to the yacht), `noyacht`, `under=1`, `q=low|high`.

Headless Chromium on a machine without a GPU uses SwiftShader; expect seconds per frame there. On a real GPU the
demo adapts its render resolution to hold a playable frame rate (`AUTO`), or fix it with the quality button.

## Status and known limits

* All the development stills were rendered with a **software renderer** (headless Chromium on SwiftShader, seconds per
  frame). The demo has not been run on a real GPU by its author, so real-time frame rate is unverified. The resolution
  governor (`AUTO`) exists to hold a playable rate but has only been exercised through the harness.
* Realism, honestly: after three review rounds two independent reviewers rated the final 12 stills between 2 and 7 out of 10
  (means about 3.7 and 4.3; the sunset, glitter and open-water frames scored highest). The water surface and light are the
  strongest parts. The yacht, the foam in storms, the clouds and the underwater scene are the weakest; none of the stills
  should be expected to pass as a photograph. `scripts/open-sea/review-set.mjs` regenerates the stills.
* The water is a height field with choppy displacement: waves steepen and fold, but they cannot overturn or throw
  spray. Whitecaps are a shading effect on the simulated foam field, not particles; there is no airborne spray.
* Clouds are a single ray-marched layer. There are no cirrus or multi-layer skies and the layer is not lit by
  neighbouring clouds beyond the multiple-scattering approximation.
* The yacht is a procedural low-poly sloop (flat-shaded hull panels, no fittings beyond rails, mast and rigging).
* There is no sound.
* It needs WebGL 2 with `EXT_color_buffer_float`; without it the page shows a message instead of the scene.
