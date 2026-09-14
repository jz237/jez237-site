# Water

## Implemented in v0.1.0
- **Waves** (`lake-waves.js`): twelve trochoidal bands, wavelengths 0.4–6 m, steepness 0.034–0.06, cos² spread ±35° about the wind, chop 0.9, amplitude = wind^1.8 × local openness (blue channel of the bed texture, 0–110 m to shore). The CPU inverse (four fixed-point iterations) matches the forward map to a millimetre (tested), so the kayak float and later the line and lure agree with the pixels.
- **Surface renderer** (`lake-surface.js`, `lake-vertex.js`, `lake-fragment.js`): dense near-field mesh recentred on the focus; full-resolution refraction target with a depth texture; 1024² planar reflection through a mirrored camera and a clip plane at 5 cm below the waterline, re-rendered every 1/2/3 frames by tier; dielectric Fresnel with the s/p split for the lenses; depth-guided screen-space refraction with a depth-rejection fallback; Beer–Lambert transmission scaled by clarity; mip-biased reflection blur with a sky fallback at the mirror edges; GGX sun glint with slope variance; capillary detail from a procedural spectral slope texture; rain rings; wind lanes; foam from the atlas, impacts and the ripple field; shoreline lace; exponential-squared fog matching the scene.
- **Optical presets** (`water-profile.js`): `lake` (silted green), `lakeClear`, `lakeStained`, `lakeBloom`, chosen by season and rain (`season.js`).
- **Ripple field** (`ripple-field.js`, `ripple-math.js`): RG heightfield (h, h_prev) on a 48 m atlas, 512²/256²/128² by tier, Verlet with damping 0.992, c = 0.55 m/s, fixed 1/60 s substeps (up to three per frame), 4 m grid snapping with exact reprojection, edge fade so nothing reflects off the atlas boundary, impulses splatted as Gaussians (pebble, splash, dimple, boil, paddle strokes). CFL ≤ 0.5 at every tier is asserted in tests.
- **Foam and wetness atlas** (`foam-field.js`, `wet-sand.js`): sources are whitecaps above wind 0.6, shallow lap scaled by wind, splash aeration from the ripple field and the kayak's wake packets; the alpha/blue channels carry the two-stage drying of the bank.
- **Bed** (`bathymetry.js`, `land-materials.js`): RG16 height encoding shared with the shaders, openness and bank distance from a chamfer transform, triplanar CC0 gravel, rock and leaf litter, silt and an algae film with depth, a wet band from the atlas, caustics that fade with depth over clarity.
- **Sky** (`sky.js`): palette by sun elevation (night, dusk, gold, day) blended with cloud cover, sun disc and glow, two drifting fbm cloud layers lit from the sun's side, stars after dark, horizon haze. The same palette drives the directional light, hemisphere ambient, fog and the environment map (refreshed when the elevation changes by 1.5°).
- **Mist** (`mist.js`): three noise-alpha sheets below eye level, strongest from −7° to +5° of sun elevation and gone above wind 0.5.

## Not yet
The underwater camera branch (Snell's window, absorption fog, light shafts) is designed but not built; the surface shader assumes the eye above the water. Breaking crests, spray and a wave spectrum are out of scope for a lake.

## Approximations, stated
Analytic bands are not a sea state; deep-water dispersion is used everywhere (valid for these wavelengths); the reflection is planar; refraction is screen-space; the ripple field is linear; the bed is invented from the lake's character.
