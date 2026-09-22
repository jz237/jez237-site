# Philadelphia Relief diagnostic — September 22, 2026

## Repairs

- Restored checked aircraft, ship, gauge, radar, property and riverbed controls now activate their layers on startup. Historical imagery also restores after the optional layers are initialized. Cameras already handled this case.
- Property and gauge request timeouts now leave the loading state and display a retry message. Dismissed or superseded cards still ignore late responses.
- Returning to an already-loaded neighborhood cancels requests for the previous destination. Street requests have a bounded timeout and retry backoff.
- Historical imagery retries failed tiles after 30 seconds while stationary, retaining successful tiles and bounded download concurrency.
- Failed camera snapshots stop their refresh timers; closing media removes resource URLs and event handlers.
- An empty radar update hides the previous image, stops playback and explains the lack of observations.
- The route's connection policy now includes the exact Google Analytics hosts used by the site's existing analytics injection.
- Production verification found a photographic handoff deadlock: actual Google geometric errors slightly exceed exact powers of two, and explicit regional views need a larger initial footprint. Readiness now allows that measured rounding and scales with viewing distance, still rejecting planet tiles and retaining final SSE 2 detail.

## Validation

- `npm --prefix demos/philadelphia-relief run check`: lint, 397 passing tests, and verified production bundle. Ten additional regression tests cover failure recovery, cancellation, restored controls, photographic readiness and policy.
- Site deployment guard, aquarium synchronization/release gate and Final Blow service-worker guard passed.
- Chrome checks covered initial rendering, named-place search, tour navigation, bridge/underground opening and cleanup, aircraft/ships/gauges/camera layers together, riverbed loading, and weather/river observations.
- Reproduced the property timeout in the browser before repair and confirmed the unavailable message afterwards.
- Simulated pre-application restored checkboxes: aircraft, ships, gauges and riverbed loaded without toggling them again; no captured runtime exceptions.
- Tested 390 × 844 mobile layout at 4× CPU slowdown: collapsed controls, no horizontal overflow, map visible. Desktop local-views dialog collapse released its modal backdrop.
- Startup remains three JavaScript requests; no new dependency or recurring background work for disabled layers.

## Second pass

- Reproduced map shortcuts consuming dropdown arrows and button Space presses. Native controls, editable content, handled events and open native dialogs now keep their keyboard input.
- Reproduced a ship feed refresh reopening a collapsed details panel. Refreshes now leave it minimized; restoring displays the latest observation. Closing or removing the selection also clears its restore tab.
- Stalled aerial work now releases its download slot after 100 seconds and backs off for 30 seconds. This allows the server's three 30-second source fallbacks and ignores late results without adding a timer to every tile.
- Camera image/iframe timeouts now remove their source URL to cancel the outstanding navigation, in addition to stopping refresh timers.
- A user-reported reload URL forced photo mode at a 190 km viewing distance. Photographic close-ups now hand back to the diorama when zoomed out, including on reload; Home restores automatic rendering and the present-day diorama. Shared close-ups still support photographic detail.
- Five new regressions pass; full lint, build integrity and all 402 tests pass. Browser checks confirmed normal keyboard handling, a collapsed ship remaining hidden across a simulated feed refresh, fresh data on restore, the reported wide-photo reload, and mobile modal collapse at 390 × 844 with 4× CPU slowdown.

## Limits

External camera availability and home-relayed aircraft/ship data depend on their providers and the home computer. A successful feed check is a point-in-time observation. CPU throttling is not a substitute for testing every older GPU. Photographic mode was verified on the public origin during the first pass, including handoff, full refinement and transitions through lighter graphics with live overlays. These checks do not prove that every possible bug has been eliminated.
