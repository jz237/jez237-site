# Weather console and hurricane tracker

The hurricane map runs as a static page on both GitHub Pages and Cloudflare Pages. It uses the existing weather page and does not require API keys, paid map tiles, a proxy, a database, or a background data-writing service.

## Data and map

- `hurricane-data.mjs` fetches and normalizes the [NOAA/NHC tropical weather summary service](https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather_summary/MapServer). Layers: forecast points (5), cone (7), best-track history (10), seven-day development regions (3), and coastal watches/warnings (8).
- `hurricane-tracker.mjs` supplies the interactive map, accessible storm list, basin filters, unit control, forecast-point playback, and a selectable forecast table. The expanded native dialog reuses the same map and controls, supports Escape, and restores focus and page position when closed. No storm position is synthesized or interpolated.
- `hurricane-tracker.css` scopes the tracker appearance to its section.
- `data/basemap.geojson` contains locally hosted, simplified Natural Earth 1:50m country polygons and lake holes. Complete polygons avoid artificial land edges in the expanded map; a western copy of date-line land provides continuous Pacific context. Natural Earth data is [public domain](https://www.naturalearthdata.com/about/terms-of-use/). Rebuild with `python scripts/weather-hurricane-basemap.py path/to/ne_50m_admin_0_countries.geojson` using the upstream [Natural Earth countries file](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson).
- `vendor/leaflet/` contains Leaflet 1.9.4 and its license. Leaflet is locally hosted; the default map does not request raster tiles.
- `hurricane-satellite.mjs` adds an optional NOAA/NESDIS global longwave infrared mosaic through the [nowCOAST satellite WMS](https://nowcoast.noaa.gov/geoserver/observations/satellite/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities), layer `global_longwave_imagery_mosaic`. It requests metadata and images only after the visitor checks Satellite. The hourly mosaic has approximately 3 km source resolution and may lag observations by several hours; the displayed time is the advertised image time, never the time the browser checked. Forecast playback does not change this observed image. Image requests use that exact advertised time, with six-hour-old, future, missing or unadvertised timestamps rejected. A single image covers the current map view, avoiding brightness seams between WMS tiles. Image requests wait for map movement to settle, are capped at one million pixels, and have a bounded wait; an imagery failure leaves the NHC forecast map usable. The optional layer is not persisted across page visits.

The NOAA GIS feed and nowCOAST metadata support browser CORS. Cloudflare's `_headers` allows `https://mapservices.weather.noaa.gov` and `https://nowcoast.noaa.gov` in `connect-src`, plus nowCOAST in `img-src`; retain these entries when changing the site's CSP. GitHub Pages ignores `_headers`.

## Accuracy and failure behavior

Wind, gusts, and motion in these GIS layers are in knots. Display conversions never determine a hurricane category; the category uses the original knots. Intermediate advisories supersede the previous advisory for that storm. Cones and coastal lines are shown only when their advisory matches the forecast points. A missing matching layer is not reconstructed.

The current center uses the advisory issue time, because intermediate files can retain an older forecast-cycle `validtime`. Future points use their supplied UTC `validtime`, resolved across month/year boundaries. Displayed hours after the advisory are calculated from those timestamps, rather than treating the source cycle's `tau` as elapsed time since an intermediate advisory. The map and details show the actual forecast positions and times, which may end before five days. Pacific geometry is unwrapped across the date line.

The interface intentionally says **systems with NHC forecasts**. The summary GIS service can omit post-tropical systems after NHC stops issuing their forecast track. The official NHC link and the map's data notes explain this limit.

The page checks all five layers at first view and every ten minutes while the tracker is visible. Requests time out after 16 seconds. Optional-layer failures are reported independently. A failed storm feed is never reported as “no storms.” A populated forecast collection is rejected if a system lacks a valid current center or a position has malformed required fields. A previously loaded collection can be shown from browser storage for up to 24 hours, with a saved-data label and an explicit notice after a failed refresh. An initial refresh does not falsely announce an outage. Advisories and outlooks older than 12 hours are flagged. Browser storage is optional and failures do not block live data. There is no permanently bundled “live” storm snapshot.

The cone represents uncertainty in the center track, not storm size or every hazard. The UI directs visitors to official advisories and local guidance.

Transient network, server, and ArcGIS JSON errors receive one retry for the affected layer. Both attempts share the same 16-second request deadline; the retry bypasses browser caching of an error response. HTTP rate limits and other nontransient client errors are not retried. Persistent failures remain explicitly unavailable.

Optional GeoJSON layers are validated before Leaflet sees them, including finite geographic coordinates, the expected geometry type, closed polygon rings, and a known basin for development areas. A malformed layer is reported as unavailable rather than silently dropping part of a warning coastline or development area. The other valid layers remain usable. A malformed optional layer in browser storage is discarded independently of valid saved forecast positions.

The 24-hour saved-data limit also applies while a page remains open: an expiry timer and visibility checks remove expired storm positions and forecasts from the map, controls, and storage, with an explicit unavailable notice. A successful refresh restores the map. Advisory freshness is based on a verified issue time; a recent file-ingestion timestamp cannot make an unverified advisory appear fresh.

## Checks

```text
node --test scripts/weather-hurricane.test.mjs
node --test scripts/weather-details.test.cjs
python -m http.server 8765 --bind 127.0.0.1
```

In another terminal, with Playwright available:

```text
node scripts/weather-hurricane.browser.cjs
node scripts/weather-details.browser.cjs
node scripts/weather-widget.browser.cjs
```

`PLAYWRIGHT_MODULE` may point to an existing Playwright installation. `WEATHER_QA_URL` can override the local URL. The browser checks use synthetic data only in intercepted test requests, and cover responsive layouts, keyboard controls, playback, outages, genuine empty feeds, malformed responses, stale advisories, and partial failures. Screenshots and results are written under ignored `tmp/hurricane-qa/`. Live NOAA data should also be checked in a browser before release.

The hourly chart follows slider and keyboard selections horizontally when the plot is wider than its container, without scrolling the page. Pointer exploration preserves the visitor's scroll position. A container-sized hint appears only when there are hours outside the visible chart. The separate local-weather browser check exercises this behavior using the real page styles at phone and desktop widths, including reduced motion.

The local forecast can fall back to the NWS hourly forecast when Open-Meteo fails. This is explicitly labeled as a forecast, and its gusts, numeric cloud cover, feels-like temperature, and other unprovided measurements remain unavailable. Unknown current temperatures never borrow a daily high, hourly measurements never borrow another hour's values, and missing AQI values never become zero. Genuine numeric zero remains valid. The fishing estimate is withheld when its required inputs are missing. Older cached NWS backup entries that included assumed cloud cover and gust values are not reused. An NWS nighttime-only period leads with its available low and period name. The widget browser check covers backup operation, missing provider fields, source labels, known zero values, and phone layout.

Saved local forecasts expire 24 hours after their successful retrieval, including while the page remains open. A newer storage timestamp does not extend their lifetime. Recent cached forecasts show their full retrieval date and time zone; expired values are removed from the dashboard and storage while Refresh and ZIP selection remain usable. The widget checks cover cold loads, expiry timers, resumed tabs, failed refreshes, recovery, and location-input focus.
