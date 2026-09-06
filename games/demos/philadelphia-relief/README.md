## Levittown destination and street detail

The Hidden Reef is now a searchable landmark and authored Levittown view (`#P=hidden-reef`).
Its card provides the verified 4501 New Falls Road address, phone and official website.
The pin uses OpenStreetMap node 11383998380 inside the mapped commercial building, checked
against the official store address and Apple Maps location. A teal shop label distinguishes it.
A bundled 2048 × 1536 USGS neighborhood image keeps the surrounding view sharp
(`python tools/build_levittown_imagery.py` rebuilds it).
581 local street segments around the store supplement the Center City network; rebuild with
`python tools/build_levittown_streets.py` (optional `--source` accepts a saved Overpass response).

The architectural street layer now adds illustrative zebra crossings at nodes with at least
three distinct neighboring coordinates. Ordinary bends and duplicate segments do not create
crossings. Marks fade below a readable pixel size. City Hall gains a decorative clock face;
landmark cards now describe the current schematic models.

## Center City architecture update

“Explore Center City in 3D” opens a close architectural view while Home retains the aerial overview.
Procedural finishes distinguish brick and stone from glass, add windows, cornice bands, roof
utility details and selected lit windows at night. These finishes are illustrative, not surveyed.
City Hall now has a courtyard, pavilions and a 167 m tower; Comcast Technology Center has a
341 m stepped silhouette and facade ribs. Existing art museum and Independence Hall models
have added roof trim. Sources and approximation notes live in landmark-models.json.

Near the camera, streets become width-aware asphalt ribbons with sidewalk edges and dashed
centre markings. Widths and markings are illustrative; alignment uses OpenStreetMap geometry.
The distant map retains thin cartographic lines. Corrected ribbon orientation prevents twisted
quads. Facade and roof patterns fade as their projected size becomes too small to read.

## September 2026 field guide refresh

The opening city view uses high-resolution aerial imagery for real rooftops and street detail.
A bundled 4096 × 3072 USGS city image keeps the surrounding neighborhoods sharp while finer tiles load.
Rebuild it with `python tools/build_city_imagery.py`. Schematic 3D structures stay optional. Roads now include 20,864 OpenStreetMap neighborhood
street segments, simplified at 1.5 metres, alongside the regional major-road network.
The regional image and streamed detail tiles now preserve the geographic aspect ratio so
photography aligns with vector streets instead of being stretched by the upstream export service.
Local streets fade out as the camera pulls back to keep regional views readable.
Rebuild this addition with `python tools/build_local_streets.py` (or `--source saved-overpass.json`).

Explore and Customize open one drawer at a time. Layers are first; rendering controls live in
expandable sections. A readable field-notes card links directly to the Rivers & Ridges tour.
The phone layout retains bottom-sheet controls. The final HDR composite applies tone mapping
and output color-space conversion, with retuned lighting and wider imagery-edge blending.

# Philadelphia Relief

An interactive, cinematic 3D topographic map of Philadelphia and the surrounding
suburbs — Center City, Port Richmond, Northeast and Northwest Philadelphia, the Main Line, and
Delaware, Montgomery, Chester and Bucks Counties, across the river into Camden,
Cherry Hill and the Burlington County plain.

Live path: `/games/demos/philadelphia-relief/`

**Concept and prompt by Jez. Built collaboratively with Claude via Traycer and
GPT-5.6.**

It is a plain browser page with one bounded Cloudflare Pages Function. There is
no framework, bundler, API key or account, and the browser loads every byte from
this origin. A 4096 × 3165 public-domain USGS orthoimage is baked at build time and
draped directly over the elevation mesh. Below 16 km camera distance, the edge
function streams and caches one overlapping 8 km USGS detail window around the
camera target, giving about 2 m/px on desktop and 4 m/px on a phone. The earlier
3D buildings remain as an optional layer and are off by default.

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
games/demos/philadelphia-relief/
  index.html            page shell; all widgets are generated from the schema
  app.css               interface; every colour is a custom property the theme rewrites
  src/
    schema.js           SINGLE SOURCE OF TRUTH for every control, layer and camera key
    state.js            the store: coercion, subscriptions, layer toggles, reset
    presets.js          the eight cinematic shots, the blend maths, the flythrough, quick jumps
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
    structures-data.js  buildings + bridges, the pure half: binary parse, extrusion, LOD policy
    structures.js       buildings + bridges, the THREE half: one draw call per zone and tier
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

### Aerial imagery, exactly on the terrain

`tools/build_imagery.py` exports the map's exact west/east/south/north bounds
from the public-domain **USGS Imagery Only** service in EPSG:4326. The resulting
4096 × 3165 WebP has the same north-up regular lon/lat grid as the terrain, so
the fragment shader samples it with the terrain UV directly: no screenshot
placement, key or reprojection. It is the instant-start regional level.

At close range, `src/imagery-detail.js` switches between city, block, roof,
and inspection cells. Below 400 m, a 0.006° × 0.0045° inspection window delivers
4096 × 3072 pixels in Maximum mode (roughly 0.16 m sampling). The camera can
descend to 200 m. Sampling describes the delivered grid, not guaranteed native
photographic resolution.

The same-origin Pages Function routes close-up imagery across the map by actual
state polygons from the US Census TIGERweb State_County service, bundled in
`data/imagery-states.js`. Sources are Philadelphia 2024 / PASDA in Center City,
PEMA 2021–2023 / PASDA elsewhere in Pennsylvania, NJ OGIS 2020, Delaware FirstMap
2022 / Sanborn, and Maryland iMAP six-inch imagery at the western edge. Native
resolution varies: NJ's 2020 source is one-foot imagery, while the PEMA,
Delaware and Maryland sources offer finer detail. Regional tiles retain USGS.
Service URLs and layer selection are in `detail-imagery.js`.

Roof and inspection views first request a 2048 × 1536 preview, then refine to
4096 × 3072 in Maximum mode. Only the current cell is downloaded; moving to a
new cell or leaving detail range cancels stale requests. No speculative neighbour
exports compete with visible imagery. The map identifies loading versus refining
and always credits the source actually returned. State-service failures fall back
to USGS; Philadelphia can also fall back to PEMA. Fallbacks are cached for five
minutes, primary responses for 30 days. Existing imagery remains visible while
requests run. Sampling describes the delivered grid, not native source resolution.

Bauder Signs (also listed as Bauder Graphics) is searchable at 3613 Witte Street,
Philadelphia. Its pin uses the City AIS address point and links to the address
record and business listing. Open it with `#P=bauder-signs`.

The **Aerial imagery** layer opens on and **3D buildings & bridges** opens off.
Turning the latter on restores the full OSM extrusion/bridge model without
discarding any of the existing data.

### Everything else is per-pixel

Normals, hillshade, contours (with `fwidth` antialiasing and an index contour
every fifth line), a cheap ambient-occlusion term from a 256² downsampled copy of
the height field, and the atmosphere are all computed in the fragment shader from
the same height texture. That means the exaggeration, sun and contour sliders are
uniform writes — they respond instantly and never rebuild geometry.

### Vector overlays

Rivers, roads, rail and boundaries are expanded into screen-space-width ribbons in
the vertex shader, which is the only way a road network stays readable across a
camera that moves from 190 km out to a 200 m close-inspection floor. Each vertex carries its **raw
elevation in metres**, not a baked world Y, so the exaggeration slider moves the
overlays and the ground together instead of tearing them apart.

### Optional buildings and bridges

Real OpenStreetMap footprints, extruded to their OSM heights, in **two detail
zones** rather than a region-wide dump:

| Zone | Rule | Buildings |
|---|---|---|
| Center City & University City (South St → Fairmount, Drexel/Penn → the Delaware) | every footprint, rowhouses included | 12,170 |
| Inner Philadelphia & Camden (Navy Yard and the stadiums → Port Richmond and Temple, the airport's edge → the Camden waterfront) | notable only: ≥20 m, ≥2,500 m² and ≥8 m, or named and substantial | 2,336 |
| Eight suburban zones (King of Prussia–Conshohocken, the Main Line, Northeast Philadelphia, Cherry Hill, the airport and Chester, Lower Bucks, Trenton, Wilmington) | notable only, **lazy-loaded** as the camera approaches | 2,821 |

Eight further **suburban zones** — King of Prussia to Conshohocken, the Main
Line, Northeast Philadelphia, Cherry Hill, the airport and Chester, Lower Bucks
(Bristol, Levittown, Bensalem), Trenton and Wilmington — carry notable buildings
only and are **lazy**: nothing of theirs is fetched at start-up. A zone's tiers
arrive once the orbit target comes within ~15 km of it with the camera under
45 km out (`shouldActivateZone` in `src/structures-data.js`), and a zone you have
visited stays loaded. The manifest marks them `lazy` and the About panel's
building count includes them.

Each zone is split into three **height tiers** (tall ≥35 m, mid ≥12 m, low) and
each tier is exactly **one draw call**. Buildings are packed tallest-first, so the
density slider and the quality mode simply move a draw-range prefix: turning
density down keeps the skyline and sheds the rowhouse fabric. Tiers frustum-cull
as a unit and **rise out of the ground** as the camera enters their range (tall
from the regional view, mid from ~40 km, low from ~15 km, all scaled by the
slider and quality). Performance mode never fetches the low tier at all, so a
phone downloads the two core zones' tall and mid tiers (about 400 KB) instead of the
full 970 KB, and suburban zones only when it visits them.

Geometry is lean: a base ring, a roof ring, and face normals recovered from
screen-space derivatives in the fragment shader, so walls share their ring
vertices — about 2n vertices per n-gon footprint. Rowhouses below 18 m are
**merged into block rows** at build time (party walls are sub-pixel at any range
the map uses), which is why Center City's fabric is 11,846 rows and mid-rises
rather than 30,000 houses.

Each vertex carries the DEM elevation under its building's centroid, and the
shader computes `y = ground × exaggeration + structure × hScale`, where
`hScale = √exaggeration × structure-height slider`. Buildings therefore ride the
terrain like the roads do, and stay proportionate to the hills at the wide shot
without becoming needles up close.

**Bridges** (6: Benjamin Franklin Bridge, Walt Whitman Bridge, Betsy Ross Bridge, Tacony-Palmyra Bridge, Commodore Barry Bridge, Burlington-Bristol Bridge) use the OSM `man_made=bridge`
outline (or the `bridge=yes` carriageway centerline) for alignment and deck
width, and a small curated table of public reference values — main span, tower
height, navigation clearance — for the schematic form: suspension towers with a
parabolic main cable and hangers, cantilever-truss chords and diagonals, a tied
arch, or lift towers, all on a deck that rests on both banks and rises to the
clearance at midspan. All bridge solids are one draw call and all thin members
are one more. They are recognisable silhouettes, not surveys of the steel.

**Landmark models and cards.** Seven landmarks whose form does not read from a
flat extrusion — Independence Hall, the Museum of Art, Boathouse Row, Citizens
Bank Park, Lincoln Financial Field, Fort Mifflin and the Battleship New Jersey —
are drawn as **schematic solids** (`data/landmark-models.json`: boxes, pyramids,
gables, rings and cylinders in local metres, dimensions rounded from public
references). The hall, the museum and the two stadiums replace their OSM
footprints (the stadiums carry no height at all in OSM); the manifest records
what was replaced, so nothing is drawn twice. The models share the building
shader and one extra draw call, and each has an invisible proxy for picking.
Clicking a model, or any landmark label, opens an **information card**
(`data/landmark-cards.json`) with dated facts, a sentence on what the map shows,
a note saying whether the object is a real footprint or a schematic model, and
the sources every fact rests on (links, opened in a new tab; nothing is fetched
at runtime). Search results for landmarks open the card too. The card is
non-modal, keyboard-reachable, closes with `Esc`, and highlights its model.

### Flood hazard and sea-level rise

The **Flood hazard** layer (off by default, a viewer's own choice that presets
never touch) drapes two public datasets on the relief as translucent area
meshes, fetched only when the layer is first switched on:

| Source | What | Licence | Bake |
|---|---|---|---|
| FEMA National Flood Hazard Layer, "Flood Hazard Zones" (`tools/build_flood.py`) | 1% annual-chance floodplain (AE, A, AO, AH), coastal high hazard VE, 0.2% shaded X; base flood elevation where mapped | US federal work, public domain | tiled REST queries, paged by `OBJECTID`, clipped, simplified to ~25 m, polygons under a hectare dropped |
| NOAA Office for Coastal Management, Sea Level Rise Viewer data (`tools/build_slr.py`) | inundation at high tide for 1–6, 8 and 10 ft above today's mean higher high water; disconnected low-lying areas excluded | public; NOAA's use constraint quoted in the legend | bulk file geodatabases for PA, NJ (middle, southern) and DE read with pyogrio, one class per scenario; 97 polygons, 454 KB packed |

Both are packed by `tools/floodpack.py` into a compact binary (`PHF2`: quantised
16-bit coordinates, one class byte and one value per polygon, holes kept so
islands of higher ground stay dry) with a JSON
manifest that carries the source, licence, counts and caveats; the FEMA set is
692 KB instead of a 6 MB GeoJSON. The studio's **Flood & sea level** group picks
FEMA zones or a sea-level scenario (the slider snaps to a published foot), the
legend under the layer toggles names the source and its caveat, and the About
panel quotes both. Polygons are triangulated with three.js's earcut
(`ShapeUtils.triangulateShape`), which handles the long concave rings of a
floodplain and its holes; a test triangulates every shipped polygon and checks
the triangles cover its area. This is a visualisation of simplified public data: **not for
insurance, permitting or engineering decisions**, and NOAA's scenarios show the
scale of potential flooding, not its exact location.

### Historical views

The **Era** control restages what is *mapped*: **1776**, the **industrial city
of 1900**, the **1950s** and the present. The rule is honesty over drama. A
building is drawn solid in a past era only when a public date says it was
standing: a curated list of dated buildings (`data/historic-buildings.json`,
published completion years, one Wikipedia citation per entry, matched by exact
OpenStreetMap name at build time; the manifest reports any name that failed to
match and a test insists that list stays empty) and OpenStreetMap's own
`start_date` where it exists. Buildings documented as newer than the era vanish;
the undated majority is **ghosted** into the haze, because a missing date is
not a missing building. The structure stream (`PHB2`) carries the year and its
source per building; bridges carry their opening years (no road bridge crossed
the Delaware at Philadelphia before 1926, so 1900 is unbridged and the 1950s
have exactly three); railways exist from 1834; motorways are hidden before
1950 and ghosted in the 1950s; landmark labels with a `since` year vanish
before their time. The 1776 view adds the approximate built-up extent of the
town and of Germantown, traced by hand from William Faden's 1777 plan (Library
of Congress, public domain) and labelled approximate. A banner names each
era's rules and sources; the relief, rivers and shoreline are always today's.

**What could not be sourced, and why.** The obvious source for building ages
is the City of Philadelphia's property assessment data, which carries a
`year_built` for every parcel; its licence reserves all rights in the
database, so it is not redistributed here. OpenStreetMap dates only a few
dozen buildings in the region. So the era views show far fewer solid buildings
than stood in 1900 or 1955, and say so on screen rather than guessing.

### Simulated time and weather

The **Time & weather** group is a simulation, not a forecast. In **Clock**
mode `src/solar.js` computes the sun's azimuth and altitude over Philadelphia
for a date and clock time (NOAA's low-precision solar position: declination and
equation of time from the day of the year, hour angle from local time, Eastern
time with daylight saving by the calendar), tested against published solstice
values to within a degree. The sun sliders show the clock's numbers in their
readouts and are overridden while the mode is on; below the horizon the key
light fades through civil twilight and the sky darkens to a dim night. The
**weather** presets (clear, haze, overcast, rain, fog) scale haze, key light, sky
fill, bloom and water by fixed factors, clamped to the shader ranges. All of it
is a viewer preference: carried in the URL, never touched by presets or tours.

**Provenance of heights**, counted per source footprint in the manifest and
quoted live in the About panel: 76% carry a measured OSM `height`
(Philadelphia's come largely from the city's LiDAR-derived footprint import),
8% are estimated from `building:levels`, 16% from
building type, and **24 buildings with no usable height in OSM**
(One Liberty Place, Comcast Center, BNY Mellon Center, Three Logan Square and
their neighbours) use rounded public reference heights supplied by this project
and flagged `curated`. The City Hall tower is a curated 26 m box on top of a
footprint held at its ~50 m roof, because extruding the whole block to 167 m
would make a cube.

---

## Data provenance

Both sources are open and need no key. Both are credited in the in-app About
panel, which is the copy that actually matters.

| Layer | Source | Licence | Notes |
|---|---|---|---|
| Elevation | [AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) (Mapzen *terrarium*), zoom 12 | Open data | Underlying data for this region is USGS 3DEP and SRTM |
| Water, roads, rail, boundaries, parks, place names | OpenStreetMap via the public Overpass API | ODbL 1.0 | Queried **once at build time** and baked to static GeoJSON |
| Landmarks | Hand-curated for this map (`data/landmarks.json`) | — | ~44 entries; elevations are sampled from the same DEM as the ground |
| Building footprints and heights | OpenStreetMap via Overpass, two detail zones | ODbL 1.0 | 76% measured heights; 27 curated tower heights from public references, flagged in the manifest |
| Bridges | OSM outline/centerline for alignment; curated spans, tower heights and clearances | ODbL 1.0 + curated | Schematic forms; `data/structures/bridges.json` says so in its own header |

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
| `data/structures/buildings.json` | 5 KB | manifest: zones, tiers, counts, byte sizes, height-source counts, tallest buildings |
| `data/structures/center-city-{tall,mid,low}.bin` | 16 KB / 258 KB / 349 KB | PHB1 binary: 326 / 5,052 / 6,794 footprints, int16 metres from the zone origin, tallest first |
| `data/structures/inner-city-{tall,mid,low}.bin` | 16 KB / 112 KB / 25 KB | 131 / 1,827 / 380 notable footprints, including the three stadiums |
| `data/structures/bridges.json` | 3 KB | 6 bridges: centerline, deck width, type and curated structural parameters |

Lossless WebP was chosen over PNG for the heightmap: it is bit-exact (the build
verifies this and refuses to ship otherwise) and ~32% smaller, which matters for a
2048² hero asset on mobile.

**The structures payload** is 970 KB for 17,327 buildings
(207,828 footprint vertices). The PHB1 stream is 8 bytes per building plus
4 per vertex; the manifest records every count so the tests can hold the files to
it.

**Why the GeoJSON is small.** OSM splits a highway or a creek into a new way at
every intersection, so a raw export was 10,832 features holding only 26,161
vertices — 61 bytes of `Feature` boilerplate per vertex. The build chains ways
back into continuous polylines and emits one `MultiLineString` per class, which
cut roads from 1.6 MB to 387 KB and improved the simplification at the same time.

---

## Running it

```bash
cd games/demos/philadelphia-relief
npm run dev          # static server on http://127.0.0.1:8731/games/demos/philadelphia-relief/
npm run check        # lint + tests
npm test             # node --test over the pure modules (92 assertions)
npm run lint         # dependency-free lint; see below
npm run qa           # headless-Chrome QA: console errors, interaction pass, screenshots
```

There is nothing to build for deployment — `games/demos/philadelphia-relief/` is the artefact.

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
.venv/bin/pip install shapely                      # only for the rowhouse merge
.venv/bin/python tools/build_structures.py         # buildings + bridges (~75 MB of OSM, cached)
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
| `1`–`8` | Cinematic presets (`1` is the opening skyline) |
| `Space` | Play/pause the tour · `[` `]` previous/next shot |
| `H` | Home · `C` studio · `L` labels · `F` fullscreen · `P` save PNG |
| `/` | Search · `?` shortcuts · `Esc` close card / dialog, leave cinema, stop |
| Click a landmark model or label | Information card with facts and sources |

The control studio covers terrain exaggeration, contour strength and interval,
**building density and structure height**, sun azimuth and altitude, key light,
ambient fill, fog density, bloom, water intensity, label size and density, road
opacity, boundary strength, theme, field of view, quality (auto or a manual
level) and animation speed —
plus a simulated **clock and weather**, and twelve layer toggles, including
**Buildings & bridges** and **Flood hazard**.

**The opening shot is the Center City skyline** — 6.5 km out, south-west of
City Hall, with the towers, the rowhouse grid and the Ben Franklin Bridge in
frame — because the buildings are the map's biggest feature and a 94 km regional
view hides them completely. *The Delaware Valley* regional view is preset 2's
neighbour (card 3, key `3`); Home and `H` return to the skyline. The Ben Franklin
Bridge has its own preset, and the other crossings and the sports complex sit
under a **Bridges & structures** chip row.

**Quality** defaults to **Auto**: an adaptive controller (`src/adaptive.js`)
watches real frame times and steps the *effective* level down when the smoothed
rate stays under 28 fps for 2.5 s, and back up when it stays over 54 fps for
12 s, with a 4 s cool-down after every change, resize, tier upload or rebuild
so one bad frame never moves it and it cannot oscillate. The readout shows the
effective level ("Auto · Balanced"), each change is announced as a toast, and
the three manual levels are plain overrides: pick one and nothing adapts. The
URL carries a manual choice (`q=performance`) and omits the default. A phone at
a crawl therefore lands in Performance (no rowhouse tier, pixel ratio 1) by
itself, and a fast desktop climbs to Cinematic.

**Presets** are complete restagings, not bookmarks: camera, light, air and layer
selection all move together.

**Guided tours** (`src/tours.js`) string shots into captioned sequences with a
scrubbable timeline, a tour picker and previous/next-shot buttons (`[` `]`):
*The Grand Tour* (all eight presets, ~98 s), *Skyline Close-Up*, *Delaware
Crossings* (five bridges) and *Rivers & Ridges*. A shot is a preset plus an
optional camera override, so a tour can stop at a bridge or a block without the
app growing a preset for it. Every caption carries the source its sentences rest
on — the map's own elevation data, OpenStreetMap heights, or public reference
values labelled as such — and captions are announced through an `aria-live`
region. Touching the camera pauses a tour rather than fighting you.

Any view can be shared: the URL hash carries only the **delta from the active
preset**, so a link reads as "this shot, plus the three things I changed". The
share button (↗) opens a small dialog where the view can be **named**; the name
rides in the link (`n=`), is cleaned and capped on the way in, and heads the
readout for whoever opens it. **Search** covers scenes, tours, eras, layers,
bridges, landmarks (labelled with their card's category) and places, grouped
under headings; a `bridge:` or `tour:` prefix narrows to one category. Each
scene card carries a **preview** baked from the map itself by
`tools/previews.mjs` (Playwright against a local server; 320×168 JPEGs under
14 KB each, committed as static assets), and the page ships Open Graph and
Twitter card metadata with a 1200×630 social card baked the same way.

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
  cast a shadow across a valley. Buildings cast no shadows either.
- **Buildings exist only in the two detail zones.** Outside Center City,
  University City and inner Philadelphia/Camden there are none, and in the inner
  zone only notable ones. Rowhouse rows are merged and simplified to ~0.6 m;
  flat-roof extrusions only — no pitched roofs, spires, setbacks or building
  parts (One Liberty Place is a box, not a spire). Heights marked `levels` or
  `default` are estimates; the 27 `curated` entries are public reference values,
  not surveys. Stadiums are `leisure=stadium` outlines extruded as solid blocks
  at their published heights, not bowls. OSM footprint coverage and tagging vary
  block by block.
- **Bridges are schematic.** Alignment and deck width are real; the towers,
  cables, trusses and arches are built from a handful of rounded reference
  numbers. Approach viaducts beyond OSM's `bridge=yes` extent are drawn by the
  roads layer as flat lines, so a bridge's deck meets a thin road at each end.
- Buildings are stretched by √exaggeration, not the full factor. That is a
  deliberate compromise between reading against the hills at the wide shot and
  not becoming needles up close; it is not a physical scale.

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
