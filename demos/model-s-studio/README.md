# Model S Studio

Interactive exploded-view study of the Tesla Model S Plaid, published in the Jez237 Website Demos collection.

- [Live studio](https://jez237.com/demos/model-s-studio/)
- [GitHub Pages mirror](https://jz237.github.io/jez237-site/demos/model-s-studio/)
- [Demo collection](https://jez237.com/demos/)

## Controls

Drag to orbit, wheel or pinch to zoom, and click a mesh to inspect it. Use the explosion slider or **Explode model** to separate all 297 visual pieces. **Play sequence** animates disassembly, holds the exploded view, and reassembles. Paint swatches, system filtering, cabin view, labels, preset cameras and fullscreen are available. Search or choose a component and use **Isolate piece** for an automatic close-up. **E** toggles explosion; **R** resets the view, filters and assembly; Escape clears selection. Paint is retained on reset.

Desktop and touch layouts are supported. WebGL 2 is required. Reduced-motion settings remove automatic transition easing; the assembly sequence and auto-orbit start only when requested.

## Run locally

From the repository root, run `python -m http.server 8768`, then open `http://localhost:8768/demos/model-s-studio/`. No build step or service keys are required. Three.js 0.180.0, its loader, orbit controls, procedural room environment, and Meshopt decoder are vendored with the Three.js license. Fonts use Google Fonts with system fallbacks.

## Model and attribution

This work is based on [Tesla Model S Plaid 2021](https://sketchfab.com/3d-models/tesla-model-s-plaid-2021-481866a0b23143b18e8e4e7f642cee53) by [3D Hawk](https://sketchfab.com/lachie.mullard), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See `ASSET-LICENSE.txt`. The original downloadable glTF and attribution are also preserved in [this public asset mirror](https://github.com/MananGandhi1810/FooBar-Electric-Vehicle-CyberCypher-Hackathon/tree/master/assets/car_3d_models/tesla_model_s_plaid_2021).

Modifications: normalized transforms and dimensions, reconstructed connected surfaces across material chunks, grouped small islands with nearby surfaces, optimized and compressed geometry, adjusted materials, and added paint customization and interactive explosion. The GLB is approximately 3.4 MB. The 297 pieces are visual geometry groups, not verified Tesla service parts. Component names are descriptive interpretations of the artist geometry. No battery or drive-unit internals are included. Source model title supplies the year; this is not manufacturer CAD.

The interaction concept was inspired by [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio). This implementation is independently authored and does not reuse its code or Model X asset. Tesla names identify the depicted vehicle; this is an independent, unaffiliated study.

## Rebuild the asset

See `../../scripts/model-s-studio/README.md` for the reproducible geometry preparation and browser validation tools. The original source asset is not duplicated in this repository.
