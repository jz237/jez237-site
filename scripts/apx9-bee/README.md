# APX-9 pollination engineering

Original procedural reconstruction of the two APX-9 concept references supplied by Jez (a hero render and an exploded blueprint sheet), built as an interactive 3D exploded view. Not factory CAD; the concept specifications on the part cards are not verified engineering performance claims.

The exhibit itself lives in `demos/apx9-bee/` and has **no build step**: plain ES modules, an import map, and a vendored, minified three.js r181 in `demos/apx9-bee/vendor/` (core, `BufferGeometryUtils`, and the post-processing passes the renderer uses). Serve the folder with any static server and open `index.html`.

## What it is

- 573 selectable parts and assembly groups, including 502 named components with geometry, built from original procedural meshes and canvas textures. Fasteners and lens facets are batched within their parent component for performance; no external model or texture service is required.
- Physically based materials (clear-coat, sheen, iridescence, anisotropy) lit by a procedural studio environment, with ambient occlusion, bloom, tone mapping and a shadow-catcher floor.
- Idle refinement: once the view has been still for a moment the page re-renders the same frame with a sub-pixel camera shift, the key light moved across a small disc (soft area-light shadows) and a rotated AO noise phase, and averages the frames in HDR (16-32 samples). Any interaction snaps straight back to the single plain frame; outline and focus changes only redraw the final pass.
- A choreographed, reversible explode: each assembly moves on its own timeline, sub-assemblies and fine parts follow, and the camera follows the parts' bounds.
- Orbit, pan, pinch and zoom; click or tap to identify a part; double-click to frame it; isolate, x-ray, searchable parts directory, specification sheet, guided tour, preset views, snapshot and fullscreen. Reduced-motion preferences disable the animated transitions.

## Completed reference-detail pass · 2026-10-02

The completed build includes the full head sensor chassis and sampling jaws, four thorax bulkheads with six supported hip sockets, an abdomen payload cage with cooling circuits, and the geared flight-drive mechanism. The fur mantle, narrow dorsal service plates, compact wing collars, swept wing pose and dark compound-eye facets were refined against both supplied images.

High quality builds 2,874,932 triangles and 1,232 meshes. Quality tiers, adaptive render resolution, motion-time AO reduction and idle multisample refinement keep geometry detail separate from rendering cost. These are measured scene counts, not a promise of equal performance on every GPU.

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

- `node scripts/apx9-bee/qa/shot.cjs --shots shots.json --out out/prefix` renders camera / explode / selection states to PNG and prints per-assembly build reports and console errors. Use `--q band=1` when reviewing the actual HUD-aware framing; the default QA camera ignores the HUD for geometry inspection. Each snap runs the idle refinement to completion before the screenshot (`"settle": false` in a snap skips it). `--trace` adds stack traces, `--eval` returns JSON from the page.
- `node scripts/apx9-bee/qa/uitest.cjs` exercises the UI with real mouse and keyboard events (picking, directory, tour, mobile dock) and prints a pass/fail list.
- `node scripts/apx9-bee/qa/audit.cjs <assembly|all>` builds one assembly (or the whole bee) and checks ids, names, info text, materials and triangle / mesh budgets.
- `node scripts/apx9-bee/qa/side.cjs <reference.png> <render.png> <out.png>` makes a reference-versus-render composite for visual comparison.

Useful URL parameters for debugging: `?explode=0..1`, `?view=side|top|front|rear|under|left|hero|hero2`, `?sel=<part id>`, `?stats`, `?q=high|medium|low`, `?dpr=`, `?ao=0`, `?bloom=0`, `?acc=<samples>` (0 disables idle refinement), `?only=<assembly>`, `?labels=0|1`, `?ui=0`.

## Field Lab / operating modes · 2026-10-02

The **Power on / Operate** button opens six non-destructive exhibit modes:

- Power: staged optical startup, antenna scanning, leg calibration, wing unfolding and hover; pause/resume or restart.
- Systems: animated energy, sensor-signal and pollen paths between real part anchors. Paths follow the existing explosion slider.
- Mission: a five-stage, 24-second flower visit, with playback, scrubbing and direct stage selection.
- Vision: a flower-focused sensor camera with visible, illustrative UV nectar guides and false-colour thermal contrast. These are explicitly simulated, not measured or biological-vision claims.
- Repair: diagnose the right wing mount, remove the cover, select the assembly in the model or searchable directory, fit a spare and reassemble for a flight check.
- Scale: a 24.26 mm US quarter proxy and millimetre ruler, in the same coordinate units as the 28 mm body / 52 mm wingspan. This is relative scale, not physical screen calibration.

`js/operate.js` owns the additive scene objects and reversible poses; `css/operate.css` owns the operating card. Leaving a mode restores the original inspection view. Motion stops with the explicit Pause button, hidden tabs stop updating via the main renderer, and reduced-motion preferences start operating animation paused. Mission stages remain manually accessible.

Serve the repository root on port 8768, then run `python3 scripts/apx9-bee/qa/operate.py` (Playwright Python and GPU-capable Chrome). `APX9_URL` overrides the test destination, and `CHROME` overrides the browser executable. This exercises all modes, repair through the directory, viewport changes, reduced motion and restoration. It writes its inspection screenshots to `/tmp`, not the public site.
