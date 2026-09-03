# Philadelphia Relief

An interactive, cinematic 3D topographic map of Philadelphia and the surrounding
suburbs — Center City, Northeast and Northwest Philadelphia, the Main Line, and
Delaware, Montgomery, Chester and Bucks Counties, across the river into Camden,
Cherry Hill and the Burlington County plain.

Live path: `/philly-3d-map/`

It is a plain static page. No build step, no framework, no bundler, no API key,
no account, and **no third-party requests at runtime** — every byte it draws is
served from this origin.

---

## Why it looks the way it does

The Delaware Valley is not dramatic country. About **380 m of relief spread over
94 km**, most of it below 150 m. A literal 1:1 render of it is a flat grey
rectangle. Three decisions do the work of making it legible:

1. **Vertical exaggeration is a first-class control**, defaulting to 10× and
   visible in the UI at all times. This is honest rather than sneaky: you are
   always told the ground is being stretched, and by how much.
2. **The hypsometric ramp is stretched over the 2nd–98th percentile band**, not
   the absolute min/max. A handful of Berks County hilltops at 377 m would
   otherwise squash the entire city into the darkest tenth of the ramp.
3. **Atmosphere carries the depth.** Squared-falloff haze that pools in the
   valleys and thins over the ridges, warm inscattering toward the sun, and a
   sky whose horizon band is the same colour the terrain fogs into — so distant
   ground dissolves instead of ending on a hard silhouette.

---

## Architecture

```
philly-3d-map/
  index.html            page shell; all widgets are generated from the schema
  app.css               interface; every colour is a custom property the theme rewrites
  src/
    schema.js           SINGLE SOURCE OF TRUTH for every control, layer and camera key
    state.js            the store: coercion, subscriptions, layer toggles, reset
    presets.js          the six cinematic shots, the blend maths, the flythrough, quick jumps
    themes.js           five palettes: ramp, sky, water, ink, and the UI chrome
    geo.js              projection, elevation sampling, scale/zoom/compass formatting
    urlstate.js         compact URL hash: only the delta from the active preset
    degraded.js         what to do, and what to say, when an asset does not arrive
    terrain.js          heightmap decode + the terrain shader (the bulk of the look)
    vectors.js          GeoJSON -> draped screen-space ribbons and filled areas
    sky.js              sky dome and sun
    postfx.js           a small hand-rolled bloom
    camera.js           orbit / pan / zoom / pitch / bearing rig
    labels.js           projected DOM labels with decluttering and terrain occlusion
    ui.js               control studio, presets, search, dialogs
    main.js             load order, wiring, frame loop
  data/                 generated; see "Data provenance"
  vendor/               three.js r180, MIT, unmodified
  tools/                build + QA scripts (never shipped to the browser)
  tests/                node --test suite over the pure modules
```

### The terrain mesh: one draw call, no LOD seams

The obvious approaches both fail here. A uniform grid is either far too coarse in
the Wissahickon gorge or absurdly dense at the regional view. A clipmap needs
ring geometry and crack stitching.

Instead the grid is **log-warped in the vertex shader around the camera target**.
A static N×N grid of UVs is mapped through an exponential so cell size grows with
distance from wherever you are looking, while the mesh always covers the whole
region. Near the target cells are ~20 m; at the far edge they are ~400 m. Changing
the warp is a uniform update, so nothing is ever re-uploaded and there are no
seams to stitch.

### Everything else is per-pixel

Normals, hillshade, contours (with `fwidth` antialiasing and an index contour
every fifth line), a cheap ambient-occlusion term from a 256² downsampled copy of
the height field, and the atmosphere are all computed in the fragment shader from
the same height texture. That means the exaggeration, sun and contour sliders are
uniform writes — they respond instantly and never rebuild geometry.

### Vector overlays

Rivers, roads, rail and boundaries are expanded into screen-space-width ribbons in
the vertex shader, which is the only way a road network stays readable across a
camera that moves from 190 km out to 1.2 km. Each vertex carries its **raw
elevation in metres**, not a baked world Y, so the exaggeration slider moves the
overlays and the ground together instead of tearing them apart.

---

## Data provenance

Both sources are open and need no key. Both are credited in the in-app About
panel, which is the copy that actually matters.

| Layer | Source | Licence | Notes |
|---|---|---|---|
| Elevation | [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (Mapzen *terrarium*), zoom 12 | Open data | Underlying data for this region is USGS 3DEP and SRTM |
| Water, roads, rail, boundaries, parks, place names | OpenStreetMap via the public Overpass API | ODbL 1.0 | Queried **once at build time** and baked to static GeoJSON |
| Landmarks | Hand-curated for this map (`data/landmarks.json`) | — | ~44 entries; elevations are sampled from the same DEM as the ground |

The files under `data/` derived from OSM are a **Derivative Database** under ODbL.
The attribution in the About panel and this table is what keeps that licence
satisfied; keep both if you fork this.

### Generated assets

| File | Size | What it is |
|---|---|---|
| `data/heightmap.webp` | 2.1 MB | 2048² lossless WebP; `elev_m = elevMin + (R*256 + G) * 0.25` |
| `data/terrain.json` | 1 KB | bounds, projection, elevation range, and decode integrity probes |
| `data/water.geojson` | 762 KB | Delaware, Schuylkill, canals, named creeks, open water >6 ha |
| `data/roads.geojson` | 387 KB | motorway/trunk (t1), primary (t2), secondary (t3), ramps (t4) |
| `data/parks.geojson` | 203 KB | parks, nature reserves and protected areas >25 ha |
| `data/boundaries.geojson` | 82 KB | county (lvl 6) and municipal (lvl 8) lines |
| `data/rail.geojson` | 60 KB | non-service heavy rail, metro and tram |
| `data/places.geojson` | 113 KB | 771 OSM place nodes, ranked city → neighbourhood |

Lossless WebP was chosen over PNG for the heightmap: it is bit-exact (the build
verifies this and refuses to ship otherwise) and ~32% smaller, which matters for a
2048² hero asset on mobile.

**Why the GeoJSON is small.** OSM splits a highway or a creek into a new way at
every intersection, so a raw export was 10,832 features holding only 26,161
vertices — 61 bytes of `Feature` boilerplate per vertex. The build chains ways
back into continuous polylines and emits one `MultiLineString` per class, which
cut roads from 1.6 MB to 387 KB and improved the simplification at the same time.

---

## Running it

```bash
cd philly-3d-map
npm run dev          # static server on http://127.0.0.1:8731/philly-3d-map/
npm run check        # lint + tests
npm test             # node --test over the pure modules (87 assertions)
npm run lint         # dependency-free lint; see below
npm run qa           # headless-Chrome QA: console errors, interaction pass, screenshots
```

There is nothing to build for deployment — `philly-3d-map/` is the artefact.

`npm run lint` has no dependencies. It enforces the rules that actually matter
for shipping this to a static host: **no credential-shaped strings**, **no
third-party runtime fetches**, no `eval`, no stray `console.log`, no `innerHTML`
assignment, balanced template literals (a stray backtick in a shader comment
silently terminates the string and takes the whole module down — this happened),
and basic accessibility invariants in the HTML.

### Regenerating the data

Only needed if you want fresher OSM data or a different region. Requires Python
with `numpy` and `pillow`, and downloads ~17 MB of terrain tiles (cached in
`/tmp`).

```bash
python3 -m venv .venv && .venv/bin/pip install numpy pillow
.venv/bin/python tools/build_terrain.py --grid 2048 --step 0.25 --out heightmap.webp
.venv/bin/python tools/build_vectors.py            # add --refresh to bypass the cache
```

The region is defined once in `tools/region.py`; every generator imports it, so
the heightmap and the vector layers cannot drift apart.

---

## Controls

| | |
|---|---|
| Drag | Pan across the region |
| Right-drag / Shift-drag / two fingers | Orbit and tilt |
| Scroll / pinch | Zoom (anchored on the cursor) |
| `↑ ↓ ← →` | Pan · `Shift` + arrows to orbit |
| `+` `−` | Zoom |
| `1`–`6` | Cinematic presets |
| `Space` | Play/pause the flythrough |
| `H` | Home · `C` studio · `L` labels · `F` fullscreen · `P` save PNG |
| `/` | Search · `?` shortcuts · `Esc` close / stop |

The control studio covers terrain exaggeration, contour strength and interval,
sun azimuth and altitude, key light, ambient fill, fog density, bloom, water
intensity, label size and density, road opacity, boundary strength, theme, field
of view, quality and animation speed — plus ten layer toggles.

**Presets** are complete restagings, not bookmarks: camera, light, air and layer
selection all move together. The flythrough strings all six into a ~91 s loop
with a scrubbable timeline; touching the camera pauses it rather than fighting
you.

Any view can be shared: the URL hash carries only the **delta from the active
preset**, so a link reads as "this shot, plus the three things I changed".

---

## Accessibility and responsiveness

- Full keyboard control of the camera, presets, search and dialogs; visible focus
  rings; a skip link into the control studio; focus trapping and restoration in
  modals.
- Map labels are real DOM (crisp at any pixel ratio, styleable per theme) but are
  deliberately **out of the tab order** — they reshuffle as the camera moves, so
  the stable accessible route to every place is the search box and the quick-jump
  chips, which are ordinary buttons.
- `prefers-reduced-motion` is honoured: preset moves and fly-tos become instant
  and decorative animation is disabled.
- On phones the panels become collapsible bottom sheets, collapsed by default so
  the map owns the screen; touch targets are ≥40 px; the readout sheds columns as
  the viewport narrows.
- The tab pauses its render loop when hidden.

## Degraded behaviour

The app never shows a blank screen, and it never lies about what you are looking
at. `src/degraded.js` is a pure policy module with its own tests:

| Situation | Result |
|---|---|
| Everything loads | Full |
| Some overlays missing | **Partial** — terrain is intact; the missing layers are named and their toggles disabled |
| All overlays missing | **Relief-only** — the elevation model is still real |
| Heightmap or metadata missing | **Fallback** — a deterministic synthetic surface, with a banner saying outright that the shape is *not* the real region |
| WebGL 2 unavailable or context lost | The one unrecoverable case; explained plainly with what to try |

The heightmap decode also re-checks seven **integrity probes** recorded at build
time. If a browser's colour management ever altered the bytes on their way through
the canvas, that is reported rather than silently rendering wrong terrain.

---

## Limitations

Stated plainly, and repeated in the About panel:

- **This is a visualisation, not a survey.** Do not use it for navigation, flood
  risk, engineering or property decisions.
- Elevations come from a ~30 m public DEM resampled to **~46 m** samples, then
  vertically exaggerated. The default 10× is not a real slope. The elevation
  readout is good to a few metres at best.
- **The source DEM had seam artefacts.** Three thin vertical stripes in the
  northwest spiked to ~900 m in ground that is really ~260 m. The build replaces
  samples more than 40 m from their local median (0.0225% of the grid) with that
  median. This is a repair, and like any repair it is an assumption.
- Terrarium's ocean shelf is clamped at −5 m, so the Delaware estuary reads as a
  flat surface rather than bathymetry. There is no bathymetry here.
- **Vectors are simplified**: 25 m tolerance on rivers, 35 m on roads, 40 m on
  rail, 70–140 m on boundaries and park outlines. Minor roads, unnamed streams and
  parks under 25 ha are not included at all. OSM coverage varies by area.
- Municipal boundaries are OSM's `admin_level=8`, which is not authoritative for
  legal boundaries.
- Labels are decluttered greedily by importance, so at low density a small place
  may be dropped even when there is room in a different part of the frame.
- Landmark coordinates are hand-placed for geographic legibility (~10 m), not
  surveyed.
- The whole region is one mesh with no shadow casting; the hillshade is direct
  lighting plus an ambient-occlusion approximation, so you will not see a ridge
  cast a shadow across a valley.

## Deployment

Static files on Cloudflare Pages, alongside the rest of the site. Nothing to
configure — same-origin only, so the existing `default-src 'self'` CSP in
`_headers` covers it without modification, and there is no cache rule to add
(the default is fine; `data/` is content-addressed by its build).

The homepage and site nav are intentionally untouched in this first build. To
link it later, add an entry to `assets/nav.js`.

## Licence

Application code is MIT, in keeping with the rest of the site. `vendor/three.module*.js`
is three.js r180, MIT, unmodified. Map data is © OpenStreetMap contributors under
ODbL 1.0; elevation is from the AWS Terrain Tiles open data set.
