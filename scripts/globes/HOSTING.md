# Globes on jez237.com

Original: https://github.com/willwaltz/globes
Author: Will Waltz · MIT License
Upstream commit: 93c3b814bbca53463e8207b8e3c95fca8940dff5
Imported: 2026-10-22 · Hosting build: 1.6.0
Public route: https://jez237.com/demos/globes/

The upstream source and MIT attribution are retained. Hosting adds the gallery
return link, clearer WebGPU messages, and a sixth **Living Silk** betta globe.
The five original scenes and their solver quality defaults are preserved. Fonts and
runtime dependencies are local; the betta uses its existing immutable R2 texture
references (not newly generated art).

## Living Silk — Betta Atelier integration

Direct link: `?globe=betta`. A desktop launch into this scene defaults to a
64³ water grid and one ray per pixel (60 fps observed on the host Radeon 8060S
at 1200×900, versus 11 fps at the original 128³/four-ray setting). Phones retain
the original 48³ default; this is touch-emulated layout validation, not a physical
phone benchmark. Explicit `?res=128&aa=4` overrides remain available. Switching
scenes keeps the grid chosen at startup, as in the upstream application.

The specimen is imported from
`../betta-atelier/src/fish.js` with optional compact tessellation. It keeps the
shared anatomy, breathing, one-second flare and synchronized gaze, with the
full-fin compliance and head-led turning revision described below.
The Atelier's normal tessellation is unchanged. The standalone compiled demo was
rebuilt as Atelier 1.8 to adopt the shared motion and shader changes (see its
README).

`src/fish/Betta.ts` evaluates the same vertex deformations on the CPU, refits a
stackless triangle BVH, and uploads it to an RGBA32F texture. `bettaWGSL.ts`
intersects the actual volumetric surfaces **after glass/water refraction**, with
sand/water occlusion and translucent fin continuation. It is not a billboard or
a WebGL canvas overlaid on the globe. A compact atlas reuses the existing skin,
caudal and macro photographs; it does not publish a new copy of those assets.

The water starts still. Sixteen solver probes supply the water velocity used by
the membrane drag and swimming-effort model. The specimen is now 42% of the
original integration's linear size (`0.105` versus `0.25` model-to-globe scale).
`bettaSwim.mjs` chooses destinations throughout the usable water volume, with
slow cruises, short bursts, coasting and quiet hovering. Acceleration-limited
heading and shallow pitch keep translation aligned with the nose; actual yaw
rate drives the shared body/fin bend. Look-ahead steering avoids the glass.

Version 1.4 removes the continuous positional pin over the inner half of each
broad fin. Radial segments still resist stretching; reduced cross-ray shear,
gentler pose springs and distributed billowing let the proximal/middle membrane
bend under water pressure as well as the fringe. Display increases tension and
transports existing folds with the one-second rest-fan opening; it does not erase
flow-driven deformation. The paired-fin flank guard uses the curved local normal.

Version 1.5 pulls the broad-fin compliance back from 1.4, which over-corrected:
cross-ray shear/bend constants are about 0.45/0.15/0.15/0.075, billowing is
`0.05 + drive*0.095`, turn-sweep is `0.30*turnBend*v`, and stiffness rises toward
the root (`3.8 + 36*(1-v)^2.4`, plus a display-flare term). The root third now
holds its shape under swimming load while the free edge still lags and flutters;
pectoral/other fins (kind ≥ 3) are unchanged.

The 1.5 realism pass is in the ray tracer, not the animation. Each triangle's
fin `(u,v)` is stored in a one-texel-per-triangle side table appended after the
triangle block (the 4-texel triangle stride is unchanged; height uses
`order.length*5`). The shader uses it for:
- **Fin rays**: fine ridges plus branching ray splits near the fringe, faded by
  the actual pixel footprint so zoomed-out views do not shimmer.
- **Translucent fins**: light passes through the membrane tinted by the fin hue,
  more clear toward the fringe, with a lit back-face glow when the sun is behind.
- **Sun occlusion**: up to four membrane hits darken a point by the fin hue, so
  the body sits in the tinted shadow of its own dorsal/anal fins; skin and eye
  block fully.
- **Cast shadow on the sand**: a four-tap soft shadow of the whole fish. From
  the near-overhead sun it is a thin sliver in side views; that is physical.
- **Skin**: a restrained sheen and thin-film colour shift on scale tiles.
These are rendering approximations, not a spectral or subsurface model. Desktop
default (64³, one ray) still measured 60 fps on the host at 1200×900.

Version 1.6 adds the betta's **surface air gulp** (bettas are labyrinth fish and
really do take air at the surface). `bettaWater.mjs` reads the water surface under
the snout from an eight-probe vertical density column (probe slots 16-23 of the
64-probe fluid sensor, 0.016 globe units apart, centred on the resting level;
slots 16+ are otherwise unused in this scene) and interpolates where the density
crosses the sim's `iso`. It returns null with no crossing, so a missing or
disturbed reading never triggers anything. `bettaSwim.mjs` then runs an
independent `rise -> gulp -> dive` cycle: the first trip comes 22-36 s after
load, later ones every 60-110 s, from its own random stream, so existing routes
are unchanged. A trip starts only while the globe is upright (effective gravity
within ~10 degrees of vertical), the measured surface is within 0.04 of the sim's
level (calm, not sloshing), the whole body is wet, the betta is not bursting or
turning sharply, and aborts to a dive if any of that is lost. The fish rises with
its lips held ~3 mm under the measured surface and pitches to ~0.85 rad (~49
degrees nose-up); the Atelier then opens the mouth (`gulp`) and pulses the gill
cover (`gulpGill`) for 1.6 s before it dives. These host-driven values override
the breathing rhythm only while larger. Limits: the fluid coupling is one-way
(water -> fish), so there are no ripples or bubbles from the gulp; trips happen
only in an upright globe; the surface is read once per frame with the sim's 1-2
frame readback delay, so the lip height is held to within ~3 mm, not exactly.

The neck now leads the route, instead of rotating about the center of the fish.
`BodyMotion.advanceTurn()` carries a history of local tangent angles down the
trunk: the rear keeps the old direction while the head changes course, then
uncoils progressively. This is a reduced-order head-following approximation,
informed by the original koi's chain, not a verbatim copy of that chain.
Integrated centerline length is preserved, local curvature is limited to prevent
a hinge behind the skull, and sharp maneuvers can reach a 2.95-radian (~169°)
head-to-tail change. That is an animation limit, not a measured biological angle.
Ordinary destinations favor ahead-of-head exploration, with occasional reversals;
explicit sharp-turn steering has a bounded acceleration and a separate rate
limit. Only voluntary `steerRate` enters the muscle history. Fluid rotation still
drives actual pose/relative drag but cannot alone trigger a muscular U-turn.

`bettaWater.mjs` samples sixteen **anatomically attached 3D probes**, including
the trunk, back, tail, forward clearance and both flanks. The full solver current
drives whole-fish translation with the koi's 0.9-second added-mass lag and finite
station-keeping drag; the former 0.075-per-axis drift cap is removed. A
least-squares fit to differences in velocity across the wet probes supplies
water-driven yaw, pitch and roll. Uniform flow does not invent spin; opposing
shear can rotate the body even with zero mean flow. Righting and steering recover
as the disturbance subsides. There is no procedural turbulence/wobble source.

The fixed resting-water-height clamp is also removed. Wetness and upper
probes request escape toward the water's actual centroid; partial exposure adds
effective gravity, as for the koi. The animated silhouette is constrained against
the spherical glass and sampled sand bed, not an invisible horizontal ceiling.
The shared fin solver uses full 3D body-relative fluid velocity and angular
motion while pitching/rolling, so transported water does not create false drag.
The Atelier accepts optional host-owned `locomotion`
(position/velocity/speed in model units, heading/pitch/roll in radians, angularVelocity/steerRate,
drive and mode); without it the standalone choreography still runs. The shared
solver source includes the flexibility changes; the standalone published bundle
adopted them in Atelier 1.8.
This is an artistic coupling, not a fully coupled
fish/fluid solver or instantaneous collision against every turbulent wave. The
betta does not eat the Koi scene's food. The **Flare fins / Relax fins** button controls the display; each opening
takes one second, with partly open fins in the resting pose.

Checks: `node --test bvh.test.mjs betta-swim.test.mjs betta-water.test.mjs betta-flex.test.mjs`, `node --test
../betta-atelier/fin-dynamics.test.mjs`, `npm run build`, and real WebGPU browser
checks of the betta, scene switching, current/tilt response and phone layout.
The locomotion tests cover multi-minute 3D exploration, bounded nose-led travel,
rest/burst variation, frame-rate independence, pause and strong reversing flow.
Water tests separately cover uniform translation, three-axis differential flow,
partial wetness, actual bed readings, stronger inertial transport, reversal,
recovery, free vertical slosh and violent-flow containment. Browser QA uses real
pointer-driven water agitation, compares the previous release's response, and
checks animated vertex clearance, fin attachment, flare controls and phone layout.
The flexibility checks measure quarter-span and mid-span response, both signs of
near-U flexion, arc length/curvature bounds, release without snapping, frame-rate
independence and separation of passive spin from deliberate turning. Inspect
actual WebGPU side/overhead turn sequences as well as scalar checks; fin-to-fin
self-collision is still approximate, not a full cloth/contact solver.
Use `npm run web -- --host 127.0.0.1` for browser development (`npm run dev` starts
Electron). `?qa` exposes the same local inspection object as a dev build.

## Browser compatibility

Firefox compiles WGSL with naga, which is stricter than Chrome's Tint. Builds up to
1.6.0 failed there with `Abstract types may only appear in constant expressions` in
the Koi `koi_map` function, because upstream called `mix()` with only literal
arguments (`mix(0.0045, 0.0025, 0.5)`); naga cannot constant-fold `mix`, so the
abstract result reached a runtime expression. It is now the literal `0.0035`, the
identical value. Keep all-literal builtin calls (`mix`, `pow`, `smoothstep`, ...) out
of runtime WGSL. Verified by driving stock Firefox 158 with WebGPU enabled
(`geckodriver`) through all six scenes: no validation errors, and the scenes render.
A cold first load there compiles shaders for roughly 30-60 s, so the loading
screen lingers. This is a Firefox pipeline-compile cost, not a hang.

The separate willwaltz/webgpu-ray-tracing project is an optional experimental
browser patch, not a site dependency. No custom browser is installed or required.

## Rebuild

Node >=22.12 is required. In this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
rsync -a --delete dist/ ../../demos/globes/
cp LICENSE ../../demos/globes/LICENSE
cp node_modules/three/LICENSE ../../demos/globes/THREE-LICENSE.txt
cp node_modules/@fontsource-variable/inter/LICENSE ../../demos/globes/INTER-LICENSE.txt
```

Then regenerate the gallery from the repository root with
`node scripts/build-demos.mjs`. Preserve `docs/images/hero.jpg` credit: the
catalog preview is an original project screenshot, not a locally generated image.

Use the site's guarded full-site publisher from a complete clean publishing
checkout. Sparse task checkouts are editing-only.

## Controls and requirements

Drag to tilt, Ctrl+drag to spin, scroll/pinch to zoom, arrows to change scenes,
right-click on Koi or Anemone Reef to drop food. WebGPU and a fast GPU are required.
The original automatically selects a 48-cubed grid for small coarse-pointer
screens, compared with 128-cubed on desktop. `?res=48&aa=1` explicitly selects a
lighter desktop run without changing defaults.
