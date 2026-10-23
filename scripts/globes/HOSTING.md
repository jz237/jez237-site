# Globes on jez237.com

Original: https://github.com/willwaltz/globes
Author: Will Waltz · MIT License
Upstream commit: 93c3b814bbca53463e8207b8e3c95fca8940dff5
Imported: 2026-10-22 · Hosting build: 1.1.0
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
shared v1.7 body, breathing, fin dynamics, one-second flare and synchronized gaze.
The Atelier's normal tessellation and standalone compiled demo are unchanged.

`src/fish/Betta.ts` evaluates the same vertex deformations on the CPU, refits a
stackless triangle BVH, and uploads it to an RGBA32F texture. `bettaWGSL.ts`
intersects the actual volumetric surfaces **after glass/water refraction**, with
sand/water occlusion and translucent fin continuation. It is not a billboard or
a WebGL canvas overlaid on the globe. A compact atlas reuses the existing skin,
caudal and macro photographs; it does not publish a new copy of those assets.

The water starts still. Sixteen solver probes supply the water velocity used by
the membrane drag and swimming-effort model. A limited drift keeps the fish near
the globe's centre; a conservative vertical envelope keeps fins above the bed
and below the resting surface. This is an artistic coupling, not a fully coupled
fish/fluid solver or instantaneous collision against every turbulent wave. The
betta does not eat the Koi scene's food. The **Flare fins / Relax fins** button controls the display; each opening
takes one second, with partly open fins in the resting pose.

Checks: `node --test bvh.test.mjs`, `node --test
../betta-atelier/fin-dynamics.test.mjs`, `npm run build`, and real WebGPU browser
checks of the betta, scene switching, current/tilt response and phone layout.
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
