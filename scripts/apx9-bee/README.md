# APX-9 pollination engineering

Original procedural reconstruction of the two APX-9 concept references supplied by Jez (a hero render and an exploded blueprint sheet), built as an interactive 3D exploded view. Not factory CAD; the concept specifications on the part cards are not verified engineering performance claims.

The exhibit itself lives in `demos/apx9-bee/` and has **no build step**: plain ES modules, an import map, and a vendored, minified three.js r181 in `demos/apx9-bee/vendor/` (core, `BufferGeometryUtils`, and the post-processing passes the renderer uses). Serve the folder with any static server and open `index.html`.

## What it is

- 643 selectable parts and assembly groups, built from original procedural meshes and canvas textures. Fasteners and lens facets are batched within their parent component for performance; no external model or texture service is required.
- Physically based materials (clear-coat, sheen, iridescence, anisotropy) lit by a procedural studio environment, with ambient occlusion, bloom, tone mapping and a shadow-catcher floor.
- Idle refinement: once the view has been still for a moment the page re-renders the same frame with a sub-pixel camera shift, the key light moved across a small disc (soft area-light shadows) and a rotated AO noise phase, and averages the frames in HDR (16-32 samples). Any interaction snaps straight back to the single plain frame; outline and focus changes only redraw the final pass.
- A choreographed, reversible explode: each assembly moves on its own timeline, sub-assemblies and fine parts follow, and the camera follows the parts' bounds.
- Orbit, pan, pinch and zoom; click or tap to identify a part; double-click to frame it; isolate, x-ray, searchable parts directory, specification sheet, guided tour, preset views, snapshot and fullscreen. Reduced-motion preferences disable the animated transitions.

## Completed reference-detail pass · 2026-10-02

The completed build includes the full head sensor chassis and sampling jaws, four thorax bulkheads with six supported hip sockets, an abdomen payload cage with cooling circuits, and the geared flight-drive mechanism. The fur mantle, narrow dorsal service plates, compact wing collars, swept wing pose and dark compound-eye facets were refined against both supplied images.

The original reference-detail pass measured 2,874,932 triangles and 1,232 meshes at high quality, before the later live-internal additions. Quality tiers, adaptive render resolution, motion-time AO reduction and idle multisample refinement keep geometry detail separate from rendering cost. These are measured scene counts, not a promise of equal performance on every GPU.

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

- Power: eight-second optical startup, antenna scanning, leg calibration, wing unfolding and hover, then automatically runs the full pollination mission; pause/resume or restart. Reduced motion initially waits for input.
- Systems: animated energy, sensor-signal and pollen paths between real part anchors. Paths follow the existing explosion slider.
- Mission: a five-stage, 32-second flower visit, with playback, scrubbing and direct stage selection.
- Vision: a flower-focused sensor camera with visible, illustrative UV nectar guides and false-colour thermal contrast. These are explicitly simulated, not measured or biological-vision claims.
- Repair: an automatic 44-second service sequence diagnoses a stalled wing, lifts the thorax cover, extracts the failed actuator, installs a separate modeled spare, calibrates the exposed planetary gears, reassembles and test-flies. Pause/resume, replay and scrubbing require no Next clicks.
- Scale: a 24.26 mm US quarter proxy and millimetre ruler, in the same coordinate units as the 28 mm body / 52 mm wingspan. This is relative scale, not physical screen calibration.

`js/operate.js` owns the additive scene objects and reversible poses; `css/operate.css` owns the operating card. Leaving a mode restores the original inspection view. Motion stops with the explicit Pause button, hidden tabs stop updating via the main renderer, and reduced-motion preferences start operating animation paused. Mission stages remain manually accessible.

Serve the repository root on port 8768, then run `python3 scripts/apx9-bee/qa/operate.py` (Playwright Python and GPU-capable Chrome). `APX9_URL` overrides the test destination, and `CHROME` overrides the browser executable. This exercises all modes, automatic repair playback, viewport changes, reduced motion and restoration. It writes its inspection screenshots to `/tmp`, not the public site.

### Detailed flower and spectral inspection

`js/flower.js` builds 48 curved, veined petals, 420 golden-angle disc florets, 2,400 pollen grains, serrated leaves, a curved hairy stem and dew. Repeated fine structures use instanced meshes. Deterministic generated texture maps encode surface ridges, pigment, UV guide contrast and a synthetic relative thermal field; they are not captured scientific data. Vision offers whole-flower and pollen macro framing, specimen rotation, tracked feature callouts and channel legends. Leaving Vision restores the studio background and shadow floor.

Before publishing changes to the operating modules, run `python3 scripts/apx9-bee/version_operating_assets.py` to refresh the dependency-first CSS, flower, Systems, flight parts, X-ray mechanics, tour UI and entry-module URL hashes. The custom domain can extend source cache lifetimes despite origin revalidation headers: unique asset URLs are required for already-cached browsers.

### Systems, live cutaway and continuous tour

Systems uses component highlighting, anchored glowing conduits, directional arrows and moving energy pulses, signal packets or pollen grains. Select a route to follow one circuit; restore natural materials independently. Every material change is reversible on exit.

X-ray shells now exposes the existing reduction gear train, cam/follower, slider-crank linkage and both four-planet wing gearboxes in motion. Flight drive and Wing gearbox buttons isolate assembled closeups; Whole unit returns to the full model. Shell opacity, playback speed and Pause/Resume mechanisms are adjustable. This is illustrative slow-motion kinematics, not an engineering performance simulation.

The guided tour automatically plays 17 stops, including two internal cutaways, with long camera and explosion transitions. Pause/Resume (or Space) freezes the camera, explosion and mechanisms together. Manual orbit pauses the tour. Arrow keys optionally navigate; no Next click is required. Reduced-motion preferences start playback paused.

Additional browser checks: `qa/systems.py` covers routes, restoration and mobile framing; `qa/mechanisms.py` covers moving gears/linkages, pause, mobile cutaways, mode transitions and all 17 autoplay stops in real time. Both accept `APX9_URL`; their default local port is 8771.

### Animated service bay

`js/repair.js` owns temporary service poses, a separate replacement servo instance, guide rails, diagnostic target markers and illustrative response traces. Extraction and installation use the existing detailed oscillator geometry, while calibration uses the existing moving gear model. A macro camera follows the service assembly, then returns to the full bee for reassembly and a short lift/settle test. Original transforms, visibility and material identities are restored on exit; scrubbing backward also restores the faulted state. Pause freezes camera movement as well as the service timeline. Playback controls remain outside the scrollable panel body on mobile. Reduced-motion preferences start the sequence paused.

`python3 scripts/apx9-bee/qa/repair.py` exercises real-time completion, extraction/insertion, calibration pause, exact restoration, mobile controls and reduced-motion playback. Default local server port: 8772; `APX9_URL` selects a deployed release.

### Expanded X-ray internals

The cutaway now animates 81 distinct component groups (25 flight-drive groups plus 56 additional groups). `assemblies/live-internals.js` adds two articulated optical iris/focus modules, four seven-blade cooling impellers and a six-cylinder pump bank with phased eccentric cranks, constant-length connecting rods and reciprocating pistons. Existing pollen geometry gains a separately articulated helical auger; its motor shaft, distribution rotor and brush turn together. Sampling jaws articulate and the rear probe sheath, tip and needle telescope. Stationary supports and electronics do not spin.

Optical head, Cooling pumps, Pollen drive, Sampling jaws and Tail probe closeups join the flight views. All motion uses the shared speed/pause clock, is reversible on exit, and remains separate from Repair's existing flight-gear calibration. The X-ray pause control remains pinned outside the scrollable controls on mobile.

`qa/internals.py` verifies all 81 pose changes, global pause, speed, crank-to-rod and rod-to-piston attachment, five new closeups, mobile fit and exact material/pose restoration. Default local port is 8773; `APX9_URL` can target production.
