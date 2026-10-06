# Fire Pro — hosted demo

This is **Three.js Fire Pro by Daniel Greenheck**, not an original Jez237 engine.

- Original project: https://github.com/dgreenheck/threejs-fire-pro
- Original editor: https://dgreenheck.github.io/threejs-fire-pro/
- Requested clip: https://x.com/dangreenheck/status/2107568397462458842
- Pinned upstream commit: `c284f0b13ed2234752087b8dce24f0cb38854147`
- Upstream version: `0.1.0`
- License: MIT. Copyright and third-party notices are retained in the hosted folder.
- Website: https://jez237.com/demos/fire-pro/
- Mirror: https://jz237.github.io/jez237-site/demos/fire-pro/
- Gallery: page 2, appended without reordering existing demos.

## Reproduce

In a separate source checkout:

```sh
git clone https://github.com/dgreenheck/threejs-fire-pro.git
cd threejs-fire-pro
git checkout c284f0b13ed2234752087b8dce24f0cb38854147
git apply /path/to/jez237-site/scripts/fire-pro/hosting.patch
npm ci
BASE_PATH=./ npm run build
```

Copy `dist/` to `demos/fire-pro/`, retaining `LICENSE` and `THIRD_PARTY_NOTICES.md` from the upstream source. The relative base supports both website prefixes. The hosting patch opens the Campfire preset on a fresh visit (saved drafts still take priority) and adds a back link to Demos page 2. The simulation, presets and shaders are unchanged. `docs/images/hero.png` is the upstream gallery artwork, copied to `demos/assets/fire-pro.png` at its actual 1274 × 888 dimensions. Regenerate gallery pages using `node scripts/build-demos.mjs`.

The editor bundles its fonts, textures, presets and export runtime locally. It saves work in the browser and supports JSON, JavaScript and standalone-app exports. WebGPU and a capable GPU are required for rendering; the upstream editor displays an explanation if WebGPU is unavailable. No external account or server-side API is required.

Use the repository's guarded full-site publishing procedure in `AGENTS.md`; do not deploy only this folder over the complete website.
