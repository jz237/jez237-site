# APX-9 pollination engineering

Original procedural reconstruction of the two APX-9 concept references supplied by Jez (a hero render and an exploded blueprint sheet), built as an interactive 3D exploded view. Not factory CAD; the concept specifications on the part cards are not verified engineering performance claims.

The exhibit itself lives in `demos/apx9-bee/` and has **no build step**: plain ES modules, an import map, and a vendored, minified three.js r181 in `demos/apx9-bee/vendor/` (core, `BufferGeometryUtils`, and the post-processing passes the renderer uses). Serve the folder with any static server and open `index.html`.

## What it is

- Every visible component is its own named, selectable part, built from original procedural geometry and canvas textures; nothing is downloaded except the code.
- Physically based materials (clear-coat, sheen, iridescence, anisotropy) lit by a procedural studio environment, with ambient occlusion, bloom, tone mapping and a shadow-catcher floor.
- A choreographed, reversible explode: each assembly moves on its own timeline, sub-assemblies and fine parts follow, and the camera follows the parts' bounds.
- Orbit, pan, pinch and zoom; click or tap to identify a part; double-click to frame it; isolate, x-ray, searchable parts directory, specification sheet, guided tour, preset views, snapshot and fullscreen. Reduced-motion preferences disable the animated transitions.

## Layout

```
demos/apx9-bee/
  index.html            import map + page shell
  css/                  main.css, hud.css
  vendor/               three.js r181 (minified ES modules) + post-processing passes
  js/
    main.js             boot, render loop, state, window.__apx (QA hook)
    quality.js          quality tiers (?q=high|medium|low) and URL flags
    skeleton.js         shared dimensions (1 unit = 1 mm; +X head, +Y up, +Z the bee's right)
    registry.js         Bee / Part tree, mirroring, per-part explode timing
    explode.js          explode-spec helper shared by every assembly
    layout.js           global explode choreography, keyed by top-level part id
    geo.js, kit.js      procedural geometry kit and the shared builder API
    materials.js, textures.js, decals.js, fur.js
    stage.js, post.js   lights, environment, shadow catcher, post-processing
    rig.js, select.js, picking.js   camera rig and views; selection state; GPU part-ID picking
    ui.js, inspector.js, panels.js, callouts.js, data.js, dom.js   HUD
    assemblies/         head, optics, thorax, flight, wings, abdomen, tail, core, legs;
                        each is a small entry module plus focused sub-modules
scripts/apx9-bee/qa/    headless QA tools (below)
```

## Quality-assurance tools

These drive the page through `window.__apx` in headless Chrome (Puppeteer) and need a GPU-capable Chrome; the defaults assume ANGLE/Vulkan on Linux.

- `node scripts/apx9-bee/qa/shot.cjs --shots shots.json --out out/prefix` renders camera / explode / selection states to PNG and prints per-assembly build reports and console errors. `--trace` adds stack traces, `--eval` returns JSON from the page.
- `node scripts/apx9-bee/qa/uitest.cjs` exercises the UI with real mouse and keyboard events (picking, directory, tour, mobile dock) and prints a pass/fail list.
- `node scripts/apx9-bee/qa/audit.cjs <assembly|all>` builds one assembly (or the whole bee) and checks ids, names, info text, materials and triangle / mesh budgets.
- `node scripts/apx9-bee/qa/side.cjs <reference.png> <render.png> <out.png>` makes a reference-versus-render composite for visual comparison.

Useful URL parameters for debugging: `?explode=0..1`, `?view=side|top|front|rear|under|left|hero|hero2`, `?sel=<part id>`, `?stats`, `?q=high|medium|low`, `?dpr=`, `?ao=0`, `?bloom=0`, `?only=<assembly>`, `?labels=0|1`, `?ui=0`.
