# Open Sea

A real-time, dependency-free WebGL 2 ocean. Waves, lighting and procedural textures run on the GPU, and fish perception runs on the CPU. The detailed 52 m schooner is built in Blender and loaded from a 4.5 MB compressed mesh; the browser has no framework dependency or build step.

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

* **Camera**: Tour, Free fly, Boat, Dive, Walk deck, and *Next shot* (cuts to the next shot of the tour). Deck mode adds Helm, Bow and Stern viewpoints.
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

`blender --background --factory-startup --python scripts/open-sea/build-schooner.py -- <absolute-repository-path> <absolute-output-directory>` regenerates the editable `schooner-52m.blend`, a studio render, and `assets/schooner.json` / `assets/schooner.bin.gz`. Blender 5.2 was used. The browser loads the mesh with `DecompressionStream`, uses 21 material classes, and animates each sail about its actual luff axis. Mesh export includes 211,646 vertices and 296,942 triangles, plus eight animated mainsheet and headsail sheet tubes. Format v2 uses a 44-byte vertex with position, normal, UV, material, tube radius and ambient visibility.

The tour and boat/dive cameras, buoyancy probes, sailing speed and wake have been resized for the larger vessel. Fine metal highlights include derivative-based normal filtering to reduce distant sparkle. The monochrome fullscreen button remains visible with the control panel folded, and reflects fullscreen state in its label and accessibility attributes.

This is a detailed interpretation of an artistic concept, with exterior fittings and underwater geometry. It is not an exact reconstruction from naval plans: interiors, crew models, structural certification and a validated 20–30-person capacity are not included. Browser shading is designed for real-time performance and differs from the Cycles studio render.

The final replacement was exercised in daylight, close deck views, a reefed storm and below the hull, with no browser errors. Fullscreen entry/exit through the button and F shortcut, a 390-pixel mobile layout, Dive and the tour handoff passed. LOW quality sustained approximately 60 fps on the tested RTX 5090; other devices and higher settings can differ. An outside reviewer identified self-shadow bands and detached running rigging; own-sail proxy shadows are excluded, headsail furling preserves the forestay, and mainsheets update with their booms. Thin static rigging is blended after opaque surfaces without depth writes.

## September 30 phone rendering repair

A physical-phone screenshot exposed severe white dashes, banded horizon glare and broken-looking rigging that the desktop checks had missed. The previous narrow-viewport test verified layout on an RTX 5090; it did **not** validate a phone GPU.

Shader fades now use a deterministic Hermite ramp for ascending, descending and collapsed ranges. Disabled foam cascades skip threshold evaluation altogether. Sail normals, cloth/deck footprints and foam footprints are calculated outside varying branches; the refracted sun footprint is calculated before the Snell-window branch. Sun discs use chord distance instead of thresholds extremely close to one, and Fresnel power bases are bounded against floating-point rounding. Sun-glitter roughness includes the pixel's normal variation.

Edge smoothing now operates on the bounded display buffer after exposure and tone mapping, rather than mixing raw HDR sun radiance into neighboring pixels. The entry page versions the complete module graph together, and ocean HTML/JavaScript revalidate after releases.

Portrait tour overview cameras pull back around their targets to fit the larger hull in the narrower horizontal field of view. The offset fades away for deliberate deck close-ups and underwater shots; landscape framing and free-flight controls retain their existing behavior.

`scripts/open-sea/tests/phone-rendering.html` checks GPU fades, isolated HDR glints, zero calm foam and hitching rain/hull ripples. It passes with NVIDIA/ANGLE D3D11 and ANGLE SwiftShader/Vulkan. For 55 isolated glints, the old pass produced 275 saturated display pixels and the revised pass produced 53. Matched portrait captures used a 390 × 844 CSS viewport, DPR 2, and a 0.45 render scale (351 × 760 backing pixels). Daylight, low-sun glare, night, storm and underwater scenes had finite HDR pixels and no browser or WebGL errors. The outside reviewer found the repair suitable to ship; very fine rigging remains visibly limited at low resolution.

The catastrophic phone appearance could not be reproduced on the desktop GPU. These corrections address concrete portability and filtering defects, but confirmation on the affected physical phone is still required. They do not establish photographic realism or mobile frame-rate parity.


## Yacht detail and deck walking

Land (or L / 5) boards the yacht. W A S D walk, drag looks around, Shift walks briskly and the wheel changes walking speed. Phones have a left walking pad while a second finger can drag the scene to look. Take off (L) returns to flight. Helm, Bow and Stern buttons are available in the camera panel. Boarding near the yacht uses the nearest safe deck position; distant boarding starts at the helm.

The passenger is anchored in yacht coordinates, including heave, pitch, roll and heading. Geometry-generated obstacles keep the camera inside the railing and outside cabins, masts, benches, winches and the tender. Movement is subdivided to prevent tunnelling during uneven frames. Low hatch tops and thresholds contribute to floor height. Cabins remain closed; this is an exterior deck walk.

Four 512-square mipmapped surface/detail layers add teak grain, caulking, staggered plank ends, varnished wood, sail/cushion weave and brushed metal. Added fittings include rope coils, belaying gear, canvas cushions, hatch hardware, rescue buoys, ventilation grilles, lettering and supported helm instruments. The powered displays update heading from the actual bow axis and speed from sailing motion, with a readable night backlight. The chart is a schematic, not navigational data. Fine tubes retain the phone-safe coverage and derivative filtering.

Validation: scripts/open-sea/deck-navigation-test.mjs checks connected stations, a 426-step continuous helm-to-bow route, boundary/cabin collision and passenger height through uneven frame times. GPU browser checks cover ten day/night/storm/portrait viewpoints, keyboard movement, drag look, taking off/reboarding, fullscreen and simultaneous phone walking/look touch events. Physical-phone GPU validation of this addition remains unverified. An outside reviewer prompted fixes to obstructed passages, mirrored lettering, wheel caulking, night display brightness and floating fittings. Broader lighting/contact-shadow and cabin-interior limitations remain.

## Second yacht surface pass

Seven 512-square mipmapped color/detail layers now cover irregular teak grain and pores, woven cloth, brushed metal, varnished wood, braided rope with a tracer strand, painted surfaces and rubber. Explicit unshifted texture gradients preserve continuous caulking across per-plank grain offsets. The sail shader adds filtered twin stitch rows and corner reinforcement. Rope tubes and animated sheets have continuous length/circumference UVs; the wooden rail is a single smooth surface per side.

New fittings include knurled winch drums, sheet blocks with sheaves and axles, embedded wheel fasteners, recessed bezel screws, raised companionway wood panels and low-intensity warm exterior lights. An inclined brass-rimmed compass is readable from the helm; its rose follows actual yacht heading. Port/starboard lenses have restrained night emission.

Nine short-range geometry rays bake ambient visibility into static vertices. This darkens indirect light around contact points; direct sun, moon and lightning retain their separate lighting. Deforming sails and booms are excluded from the bake to avoid stationary marks on moving cloth. This is contact shading, not a full dynamic yacht shadow map. Cabins remain closed and the model remains a procedural interpretation rather than a reconstruction from naval plans.

`node scripts/open-sea/schooner-asset-test.mjs` validates finite vertices, unit normals, material/AO ranges, deforming-group AO, buffer layout and every index. Degenerate triangles are excluded on export and invalid corner normals fall back to geometric face normals. Navigation tests now cover 39 obstacles and a continuous 430-step helm-to-bow route, including the new compass and blocks. Fourteen GPU views cover fittings, ropes, sailcloth, day, night, storm, whole yacht and portrait views; HDR pixels are finite with no browser or WebGL errors. Walking, camera anchoring through hitches, simultaneous touch movement/look, reboarding and fullscreen also pass. These portrait checks use a desktop NVIDIA GPU and do not establish performance or visual parity on a physical phone.

## Wind-driven sail motion

The five sails have traveling fabric waves, slower billowing and gust modulation. Flutter grows from a slight calm movement to visible leech motion in a breeze, with faster, reduced-amplitude movement under storm reefing. Each sail has independent phase and rate. The luff, tack and clew stay fixed; mainsail feet stay against their booms, while headsails have free feet between their corners.

Travel and ripple phases advance independently modulo 2π in the yacht's bounded 60 Hz step. Wind changes adjust phase velocity and smoothly change amplitude, avoiding an age-dependent jump from multiplying the new wind speed by elapsed time. Reflections use the same pose and phases, and cloth normals follow the deformed geometry. This is a bounded procedural cloth animation, not an aeroelastic cloth solver.

Sewn edges and 16-segment battens use exact cloth coordinates. Each corner ring shares one corner coordinate across all its vertices, preserving its rigid shape while staying attached. The main-foot camber tapers to zero at the boom.

The browser fixture `scripts/open-sea/tests/sail-motion-test.js` captures the actual production vertex shader with transform feedback. Across all exported vertices of five sails at four wind speeds, it records zero fixed-vertex drift, less than 4 μm of numerical ring distortion, and a maximum measured flutter offset of 0.51 m. Wind changes at 5,000 seconds remain continuous (maximum measured 60 Hz movement 6.6 cm). Long/uneven frame intervals remain bounded. Day, calm, storm, night and portrait captures have finite HDR pixels and no WebGL/browser errors. Physical-phone animation performance remains unverified.

## Sail visibility and release verification

A fresh request to jez237.com revealed an older detail release after the flutter preview had been verified. The deployment wrapper now rejects an upload directory if any ocean module, model asset or demonstration card differs from the current checkout. Preview and production checks compare the entire served ocean module graph and yacht JSON/binary against the tested source. Entry HTML uses no-store, and returning to an already open simulation offers a compact reload button when a newer release exists.

Fine static rigging keeps its detailed tube geometry nearby and fades to continuous, filtered screen-space lines over 8–16 m. The line pass uses physical diameter, actual vertical FOV, per-fragment perspective depth and the current render target dimensions. Lines crossing the near plane are clipped rather than dropped. Both passes depth-test without depth writes; moving sails, booms and sheets retain their own deformation. The export contains 1,540 static centerlines; the detailed binary mesh is unchanged.

The opening tour approaches a closer broadside sail view, and its aft arc spends less time aligned with the sail edge. Edge-on views naturally foreshorten real trimmed canvas; free flight retains those angles. Smooth normals come from finite differences of the exact deformed sail surface, with a guarded head sample; close cloth folds no longer show long triangle bands. Eleven additional desktop/portrait captures, twenty production GPU cloth checks and a live RAF animation check pass with finite HDR output and no WebGL errors. Release tests reject old entry HTML, old shaders and old binary assets even when HTTP returns 200. Portrait checks still use a desktop GPU.

## Rig occlusion and marine wildlife

Thin rigging now composites after the ocean with depth testing retained. Previously the water overwrote ropes and railings because their antialiased coverage did not write depth. Both yacht passes remain together in the reflection target; underwater depth and scattering still obscure submerged rigging.

Twelve volumetric gulls have separate flap/glide cycles, articulated wrists, feather tips, banking and heights. Their headings follow actual world travel, including the yacht's changing course, and their circuits remain clear of the masts. Two distant humpback interpretations surface at different times, breathe, lift their flukes and dive. Every third encounter includes a short partial breach. New encounters begin while deeply submerged; exposed animals remain in world space. All clocks use bounded elapsed time.

A two-pixel GPU pass samples the current warped FFT cascades with the local ocean's filtered level. Main views, reflections and fine spray share those anchors instead of repeating wave queries for every vertex or relying on delayed CPU readback. Contact foam and expanding dive rings are thin, patchy surface coverage with fixed strength bounds; they inject no energy into the rain/hull ripple solver. The wildlife shares sky, moon, cloud-shadow and atmospheric lighting. These are procedural models for distant encounters, with simplified anatomy under close inspection; physical-phone GPU performance remains unverified.

Seven release/behavior tests, fourteen desktop/portrait GPU views and twenty production cloth checks pass. A sixty-four-frame GPU hitch run with full rain and whale reentry records finite HDR/ripple data, no WebGL errors and a peak ripple height of 19.5 mm. A separate live RAF check records independently advancing birds at 60 fps on the desktop test GPU at 70% render resolution. The independent reviewer identified and corrected the rig draw order, head/fin attachment, gull size and travel direction, filtered waterline sampling and mobile-portable contact formula.

## Optional giant whirlpool

Open Sea → Whirlpool on in the controls. View whirlpool moves to an elevated overview; Land, Boat and Dive remain available. Whirlpool off gradually fills the funnel. The effect is off on every fresh load and is never saved as a default.

The idealised vortex has a 62 m finite core, a maximum 150 m depression and currents tapering over a roughly 2 km diameter. A dense polar mesh resolves the funnel away from the camera. Its outer band matches the camera clipmap's morphed triangles and filtered FFT displacements, with a 40 m depth-tested overlap covering the remaining triangulation differences; fragments clip only after derivative evaluation. The water's normal, reflected sky, crest tint, underwater depth and fine foam follow the local funnel surface. Foam travels using the integral of circulation strength, so late switch-off cannot reverse its motion through rate × total-age multiplication. Two staggered 18-second generations fade smoothly, limiting differential winding and continually breaking up inner foam.

At 60 Hz the 320 tonne yacht receives anisotropic drag and yaw moments at five hull points, plus gravity projected down the sloping surface. Momentum remains after switch-off. Projected buoyancy probes fit its pitch/roll to the wall; the slow pressure surface supplies a moving buoyancy datum while FFT waves retain spring heave. Apparent wind adjusts sail drive, trim, reefing, flutter and heel when the current carries or turns the vessel. The existing wake advects with the vortex. Camera surface classification, Dive clearance, whale water anchors, fish habitat depth/advection and underwater particles use the same local surface. Fish retain individual needs, schooling, flexible body waves, fin timing and upright gradual swimming turns.

This is a real-time reduced fluid and hull-force model, not full computational fluid dynamics or a naval dynamics model. It does not simulate hull flooding, structural failure or a guaranteed sinking: the driven yacht can settle into an inner orbit. A rigid hull cannot exactly match a strongly curved surface at every point. The extreme scale is an optional dramatic effect rather than a reconstruction of an ordinary sea whirlpool.

Validation includes centrifugal pressure/gradient checks, matched uneven-frame hull trajectories, continuous fish drift/local depth tests, eight calm/storm low-angle mesh-join views, steep-wall deck stations at radii 36 and 62 m, Dive clearance and collapse. A matched default-off water/sky/wildlife capture is visually unchanged from the previous release. Full-rain GPU hitches, actual controls, reset-on-reload, desktop and portrait views are exercised as part of release verification. Physical-phone GPU behaviour and performance remain unverified.

## Hull contact and deck wash

The water excludes the closed solid hull and deckhouses using the moving yacht's full pitch, roll and yaw. The boundary follows the exported hull's curved sections and folded lower bow; tests compare 14,158 mesh vertices with a maximum outward boundary error of 0.56 mm. This removes the free ocean plane cutting through the boat's interior while retaining crests above exposed deck areas. Refraction verifies that both shifted and fallback scene hits are actually submerged, preventing dry cabin geometry from appearing through water.

Narrow, broken contact foam responds to boat speed and wave slope, with no permanent foam floor on a stopped boat in flat water. A bounded bow rise and sparse 1–3.5 cm impact droplets add small contact cues. Droplets carry world-space inertia and use analytically integrated air drag and gravity, have short lifetimes and a 512-particle cap, and never add energy to the ripple solver. The persistent stern wake uses the actual projected, tilted stern rather than a flat heading offset.

A 128×32 boat-frame contact map samples the current FFT, wake and whirlpool surface. Recently wet paint and wood keep a darker, smoother sheen that relaxes over roughly five seconds as crests recede. This is a reduced surface-contact model: large overtopping waves still follow the continuous ocean surface. There is no deck pooling, runoff, flooding or full fluid–solid collision simulation; storm deck wash therefore remains less realistic than the surrounding ocean.

Verification includes close bow sequences, onboard storm, glassy, moonlit, underwater, whirlpool and portrait captures; production draw-time texture-binding checks; wet-history recovery; and GPU tests that preserve exposed-deck overtopping while excluding solid interior water. Forty full-rain hitch frames retained finite GPU/droplet state and a peak ripple height of 19.5 mm. A matched LOW portrait fixture at 468×1013 on an RTX 5090 measured render-pass GPU median 0.555 ms before and 0.559 ms after (95th percentile 0.851 and 0.931 ms). These are desktop render-pass timings, not total-frame cost or physical-phone performance. Independent review approved the bounded improvement while identifying deck runoff and close storm wash as remaining realism limits.
