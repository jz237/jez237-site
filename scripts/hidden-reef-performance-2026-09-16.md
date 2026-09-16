# Hidden Reef loading and browsing audit — September 16, 2026

Baseline: `bb70c9c2a`. Scope: the storefront, shared animated header, category
browser and showroom startup. The 3D aquarium bundle and its model, texture,
simulation and visual-effect detail are unchanged.

## Changes and measured evidence

| Resource | Before | After |
| --- | ---: | ---: |
| Header images, total file bytes | 9,414,603 | 3,415,906 |
| Favicon on pages using the large fish PNG | 2,617,803 | 8,973 |

Header delivery uses lossless WebP at the original pixel dimensions, with exact
crops for the small portions exposed by the existing SVG clipping masks. The
generator verifies decoded RGBA bytes against the original images/crops. Original
editable artwork remains in the repository. Content hashes support safe immutable
caching. The favicon is the only intentionally resized artwork.

Scripts defer parsing work until the document is parsed, preserving dependency
order. Offscreen department and brand pictures load lazily; the prominent aquarium
preview has high priority. Category carousels load subsequent full-size pictures
incrementally and suspend advances offscreen or in hidden tabs.

The showroom launches independently of the shopping catalog. Approaching the
planner loads its catalog once; failed downloads offer retry. Product deep links
still load the catalog immediately. Shared catalog URLs and short-lived cache
policies support navigation without stale daily inventory.

Catalog rows and parsed brands are reused across search/filter updates. A Node VM
benchmark on the real 4,846-row catalog compared 36 query/scope combinations and
verified identical values/order and unchanged source data. Across four iterations,
the whole batch averaged 8,785 ms before and 82 ms after. This measures catalog
processing only; it is not a browser page-load, INP or aquarium-FPS claim.

Scroll-dependent layout measurements now update on resize rather than every scroll
or animation frame. Background CSS variables update only when their value changes.
WebGL header uniform locations are cached instead of queried on every draw.

## Browser checks and limits

Separate original/modified local origins used a shared 8 Mbps response limiter per
server, 80 ms response delay and gzip for text assets. Initial viewport observations
at 1280×720 downloaded approximately 21.52 MB before versus 8.75 MB after; at
390×844, 17.39 MB versus 4.62 MB. These include same-origin iframe resources and
exclude audit-report requests. Observation windows varied, so these are indicative
request totals, not precise full-page load-time percentages. Repeat navigation
reported zero transferred bytes for all six optimized header images.

Desktop/mobile header appearance, mobile navigation, category search, product
modal, preview-list add/remove, sales, help navigation, automatic aquarium startup
and deferred planner selection were checked in the browser. Internal links and
external/inline JavaScript syntax are checked separately. The aquarium regression
suite covers 215 behaviors, including automatic showroom entry and static-header
visibility. The header test now uses stable source names rather than minifier
identifiers.

Chrome DevTools tracing was unavailable in this session. There was no real-phone
measurement or CPU throttling. Single-run paint and long-task readings varied and
do not substantiate a whole-site CPU improvement percentage. Top-document LCP does
not measure completion of the aquarium inside its iframe. A throttled local run
reported three wood-texture decode failures; the same files verified as valid
2048×2048 JPEGs and loaded without those errors on the unthrottled local origin.

Remaining costs include full-detail 3D asset downloads and shader compilation,
external catalog photography, and some initial layout movement (observed desktop
CLS about 0.11). These changes do not claim to eliminate those costs.

## Regeneration and validation

- `python scripts/optimize_hidden_reef_images.py` (Pillow)
- Rebundle `assets/animated-header/header.ts` with esbuild, ESM/minified output
  to `assets/animated-header/header.js`.
- `node scripts/sync_hidden_reef_showroom.mjs`
- `python scripts/check_hidden_reef_links.py prototypes/hidden-reef`
- `npm --prefix scripts/rotatable-aquascape test`
- `node scripts/check_aquarium_sync.mjs`

Temporary throttling servers, snapshots and benchmark outputs live under the
ignored `tmp/reef-performance` directory and are excluded from publication.
