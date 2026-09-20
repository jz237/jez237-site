# Philadelphia in 3D

Separate CesiumJS 1.145 photographic preview of Philadelphia. The existing relief
diorama remains at `/demos/philadelphia-relief/`. The Demos catalog links to both.

Uses Google Photorealistic 3D Tiles through Cesium ion (asset 2275207), with the
provider's visible, built-in attribution. No geocoder is used. Preset coordinates
for Bauder Signs and The Hidden Reef match the relief map's landmark data.

`config.js` contains the public read-only browser token provided for this site.
Configure allowed URLs and assets in Cesium ion; never use an administrative
token here. The production restriction means localhost may show an authorization
message. Do not weaken the token restriction just to run a local preview.

Full detail defaults to a 2-pixel screen-space error. During camera motion a
12-pixel target prioritizes coarse coverage; 180 ms after motion ends the chosen
detail target is restored. Flight destinations are prefetched. Tile reuse is
limited to Cesium's bounded memory cache; there is no custom persistent imagery
cache. Coverage, imagery age, network latency, GPU memory and provider limits
still affect the result; this does not guarantee sharper source imagery or a
particular loading speed.

The route-scoped Pages middleware supplies the service-specific CSP. Other
routes retain their existing policy. Before release, run the Demos catalog
builder and production deployment guard, then verify production headers and
exercise all four destinations, drag/zoom, orbit, labels and mobile layout.
