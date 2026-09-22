# Philadelphia Relief diagnostic — September 22, 2026

## Repairs

- Restored checked aircraft, ship, gauge, radar, property and riverbed controls now activate their layers on startup. Historical imagery also restores after the optional layers are initialized. Cameras already handled this case.
- Property and gauge request timeouts now leave the loading state and display a retry message. Dismissed or superseded cards still ignore late responses.
- Returning to an already-loaded neighborhood cancels requests for the previous destination. Street requests have a bounded timeout and retry backoff.
- Historical imagery retries failed tiles after 30 seconds while stationary, retaining successful tiles and bounded download concurrency.
- Failed camera snapshots stop their refresh timers; closing media removes resource URLs and event handlers.
- An empty radar update hides the previous image, stops playback and explains the lack of observations.
- The route's connection policy now includes the exact Google Analytics hosts used by the site's existing analytics injection.

## Validation

- `npm --prefix demos/philadelphia-relief run check`: lint, 396 passing tests, and verified production bundle. Nine additional regression tests cover failure recovery, cancellation, restored controls and policy.
- Site deployment guard, aquarium synchronization/release gate and Final Blow service-worker guard passed.
- Chrome checks covered initial rendering, named-place search, tour navigation, bridge/underground opening and cleanup, aircraft/ships/gauges/camera layers together, riverbed loading, and weather/river observations.
- Reproduced the property timeout in the browser before repair and confirmed the unavailable message afterwards.
- Simulated pre-application restored checkboxes: aircraft, ships, gauges and riverbed loaded without toggling them again; no captured runtime exceptions.
- Tested 390 × 844 mobile layout at 4× CPU slowdown: collapsed controls, no horizontal overflow, map visible. Desktop local-views dialog collapse released its modal backdrop.
- Startup remains three JavaScript requests; no new dependency or recurring background work for disabled layers.

## Limits

External camera availability and home-relayed aircraft/ship data depend on their providers and the home computer. A successful feed check is a point-in-time observation. CPU throttling is not a substitute for testing every older GPU. Local Cesium authorization differs from the public site's origin restrictions, so photographic mode needs production verification.
