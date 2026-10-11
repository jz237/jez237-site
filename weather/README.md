# Weather console and hurricane tracker

The hurricane map runs as a static page on both GitHub Pages and Cloudflare Pages. It uses the existing weather page and does not require API keys, paid map tiles, a proxy, a database, or a background data-writing service.

## Data and map

- `hurricane-data.mjs` fetches and normalizes the [NOAA/NHC tropical weather summary service](https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer). Layers: forecast points (5), cone (7), best-track history (10), seven-day development regions (3), and coastal watches/warnings (8).
- `hurricane-tracker.mjs` supplies the interactive map, accessible storm list, basin filters, unit control, and forecast-point playback. No storm position is synthesized or interpolated.
- `hurricane-tracker.css` scopes the tracker appearance to its section.
- `data/basemap.geojson` contains locally hosted, simplified Natural Earth 1:50m country polygons, cropped to the monitored region. Natural Earth data is [public domain](https://www.naturalearthdata.com/about/terms-of-use/). Rebuild with `python scripts/weather-hurricane-basemap.py path/to/ne_50m_admin_0_countries.geojson` using the upstream [Natural Earth countries file](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson).
- `vendor/leaflet/` contains Leaflet 1.9.4 and its license. Leaflet is locally hosted; the map does not request raster tiles.

The NOAA GIS feed supports browser CORS. Cloudflare's `_headers` allows `https://mapservices.weather.noaa.gov` in `connect-src`; retain this entry when changing the site's CSP. GitHub Pages ignores `_headers`.

## Accuracy and failure behavior

Wind, gusts, and motion in these GIS layers are in knots. Display conversions never determine a hurricane category; the category uses the original knots. Intermediate advisories supersede the previous advisory for that storm. Cones and coastal lines are shown only when their advisory matches the forecast points. A missing matching layer is not reconstructed.

The current center uses the advisory issue time, because intermediate files can retain an older forecast-cycle `validtime`. Future points use their supplied UTC `validtime`, resolved across month/year boundaries. Displayed hours after the advisory are calculated from those timestamps, rather than treating the source cycle's `tau` as elapsed time since an intermediate advisory. The map and details show the actual forecast positions and times, which may end before five days. Pacific geometry is unwrapped across the date line.

The interface intentionally says **systems with NHC forecasts**. The summary GIS service can omit post-tropical systems after NHC stops issuing their forecast track. The official NHC link and the map's data notes explain this limit.

The page checks all five layers at first view and every ten minutes while the tracker is visible. Requests time out after 16 seconds. Optional-layer failures are reported independently. A failed storm feed is never reported as “no storms.” A populated forecast collection is rejected if a system lacks a valid current center or a position has malformed required fields. A previously loaded collection can be shown from browser storage for up to 24 hours, with a saved-data label and an explicit notice after a failed refresh. An initial refresh does not falsely announce an outage. Advisories and outlooks older than 12 hours are flagged. Browser storage is optional and failures do not block live data. There is no permanently bundled “live” storm snapshot.

The cone represents uncertainty in the center track, not storm size or every hazard. The UI directs visitors to official advisories and local guidance.

Transient network, server, and ArcGIS JSON errors receive one retry for the affected layer. Both attempts share the same 16-second request deadline; the retry bypasses browser caching of an error response. HTTP rate limits and other nontransient client errors are not retried. Persistent failures remain explicitly unavailable.

## Checks

```text
node --test scripts/weather-hurricane.test.mjs
node --test scripts/weather-details.test.cjs
python -m http.server 8765 --bind 127.0.0.1
```

In another terminal, with Playwright available:

```text
node scripts/weather-hurricane.browser.cjs
```

`PLAYWRIGHT_MODULE` may point to an existing Playwright installation. `WEATHER_QA_URL` can override the local URL. The browser checks use synthetic data only in intercepted test requests, and cover responsive layouts, keyboard controls, playback, outages, genuine empty feeds, malformed responses, stale advisories, and partial failures. Screenshots and results are written under ignored `tmp/hurricane-qa/`. Live NOAA data should also be checked in a browser before release.
