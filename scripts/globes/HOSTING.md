# Globes on jez237.com

Original: https://github.com/willwaltz/globes
Author: Will Waltz · MIT License
Upstream commit: 93c3b814bbca53463e8207b8e3c95fca8940dff5
Imported: 2026-10-22 · Hosting build: 1.0.0
Public route: https://jez237.com/demos/globes/

The full upstream source is retained here. Hosting changes are limited to a page
meta description, a persistent gallery return link and author/source credit,
and clearer messages when WebGPU is unavailable. The simulator, scenes and
quality defaults are unchanged. All fonts and runtime dependencies are local.

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
