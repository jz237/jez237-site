# Globes on jez237.com

Original: https://github.com/willwaltz/globes
Author: Will Waltz · MIT License
Upstream commit: 93c3b814bbca53463e8207b8e3c95fca8940dff5
Imported: 2026-10-22 · Hosting build: 1.4.0
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
The Atelier's normal tessellation and standalone compiled demo are unchanged.

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
solver source includes the flexibility changes, but the standalone published
bundle is deliberately not rebuilt by this globe release.
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
