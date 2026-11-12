# Filter animation startup

User instruction, November 1, 2026: every existing 3D filter must start animated, including older PCs and machines with OS reduced motion. Keep an explicit Pause control. This policy overrides the earlier default-paused behavior documented in older revisions.

Ten studies use `createFilterAnimation` in `runtime.js`; UV retains its tested v4 implementation and supplies the shared performance governor. The collection has eleven children, listed in `../aquarium-filtration/catalog.json`. Do not add individual cards to the main gallery.

## Startup and quality

- Simulation state starts unpaused; Reset resumes normal operation. Camera orbit and narrated tours are not forced on.
- Reduced-motion, four-or-fewer reported CPU cores, or four-or-fewer reported GB of RAM select Light 3D initially. Other computers start with adaptive Balanced graphics.
- Auto measures sustained frame timing after a startup grace period. It lowers render resolution, shadows and refraction capture frequency before switching to a Canvas diagram at sustained very low frame rates. Quality changes never set the user's Pause state.
- Auto also steps up (November 11, 2026): a computer that starts Balanced and stays smooth for two 3-second windows (median frame under 1/50 s) gets Detailed, and goes back to Balanced for good if the median there rises above 1/45 s. A Light start and manual choices are never promoted. Shadow maps return to their original size when quality rises.
- `ambient.js` adds depth-only ambient occlusion over the finished frame in the Detailed tier only. If its shader or render fails it switches itself off and the 3D view carries on; `snapshot().ambient` reports whether it is drawing. `water-glsl.js` is GLSL shared by the studies' water (ripples, studio reflection, depth colour, caustics, contact line, return foam). It is a look, not a fluid or optics solution.
- Missing WebGL 2, context loss, shader failure or an exception in rendering use the animated diagram. Explicit Detailed/Light choices bypass the automatic governor. Retry 3D reloads the page.
- Hidden documents suspend animation; the reef sump also suspends when its scene is offscreen. Explicit pause, maintenance and assembly inspection retain their native behavior in 3D.

`runtime.js` owns graphics adaptation and fallback lifecycle, not the individual physical simulations. `capture()` throttles refraction captures while guaranteeing an initial texture. Each existing renderer still owns its scene, camera, effects, controls and simulation. `window.filterAnimation.snapshot()` is read-only diagnostics, not a public mutation API.

## Diagram scope

`schematic.js` contains distinct Canvas sketches for the ten filter mechanisms. They use a separate simple operating clock and honor Pause, slow speed, available power/water/air switches, Care reading, and page visibility. They are explicitly labeled simplified teaching views. They do **not** reproduce the full numerical experiments, 3D assembly, microscope or maintenance animations. Geometry-only controls are disabled; written topics and component descriptions remain accessible. UV's more extensive original fallback uses its full simulation.

No downloads or WebGL are required for the sketches themselves. The pages still require a modern JavaScript/Canvas-capable browser; no implementation can guarantee animation on literally every PC or in a suspended browser tab.

## Integration and checks

Buildless demos import `../filter-runtime/runtime.js?v=1` and cache-bust their entry script with `?v=autostart-1`. The reef sump source is `scripts/rotatable-aquascape/filtration/main.ts`; Vite bundles this shared code, so rebuild it after any runtime change:

```sh
npm run build:filtration --prefix scripts/rotatable-aquascape
node scripts/filter-runtime/browser.mjs
node scripts/filter-runtime/adaptation.mjs
```

The browser runner expects the repository served at `http://127.0.0.1:8823/`, or set `FILTER_TEST_BASE`. It checks all eleven demos with normal graphics, reduced-motion phone layout, and WebGL disabled, including visible simulation clocks, Pause/Resume/Reset and context loss. `FILTERS` and `FILTER_CASES` optionally narrow reruns. Screenshots and results are ignored under `tmp/filter-runtime-qa/`. The adaptation check injects slow frames and low hardware hints; it is not a benchmark of actual old hardware.

Retain the last **published** reef bundle as `generated-bundles.json.previous`, rather than an intermediate local build. Follow the workspace's committed/pushed deployment wrapper; do not create another full-site staging copy or modify the separate Hidden Reef project.
