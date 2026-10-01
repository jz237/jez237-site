# Online garage setups — local development, 2026-10-01

Full Wreckfest 2 parity remains incomplete. This update is local only, pending outgoing source/test transfer authorization. It has not been installed on VENGEANCE or deployed.

## Behavior

The online join form, lobby and results now let each driver choose a car and either saved garage tuning/paint or a factory setup. The lobby/results show the server-confirmed choice for the next event. Hosts can allow garage performance or enforce factory performance for everyone while retaining paint. Host migration transfers this permission. Cup rounds and ordinary rematches apply the latest approved choices.

The server validates engine/tire/armor levels as integers 0–3, each of the five tuning axes as finite values in [-1,1], and paint/trim as integer RGB colors. Only these allowlisted inputs cross the protocol; arbitrary force, mass, extra tuning keys and decals are discarded. Physics coefficients are derived by the shared server-side specification function. The existing 1 KiB client-message bound remains unchanged.

Physical setup changes take effect at event creation. During countdown/play, setup/rule mutations are rejected. A mid-event entrant takes over the existing car with its current kind, setup, damage and position; its selected car/setup is queued for the next event. Token reconnects retain the server-confirmed selection, even if a reconnect hello contains an older choice. Saved rooms preserve active car physics, pending selections and host rules. Legacy saves use stock defaults.

Car snapshots include the effective setup. The online renderer builds the correct specification and applies paint/trim; unchanged setups do not rebuild cars each frame. Armor reduces server-adjudicated damage, scoring credits actual health loss, and renderer dent reconstruction compensates for armor already applied by the server so it is applied exactly once. Playground repair retains the active setup.

Optional setup-support fields and capability checks retain older JSON/binary transport compatibility. A client connected to an older server sends no unsupported setup mutations, and the UI reports factory setups. Legacy peers on the upgraded authority remain driven by server physics, although their old renderer cannot display the new cosmetics.

This milestone carries performance and paint, not layered decals. Online livery transfer/rendering, broader parts/classes, dynamic tuning previews and leaderboard tune sharing remain open scope.

## Verification

**93 distinct targeted checks pass.** The regression selection passed 92 checks; the additional real-model renderer check passed afterward. The initial new test run corrected two fixture assumptions: the standalone restore fixture needed the saved room's 24-car capacity, and a JSON-normalized comparison needed to account for binary preservation of negative zero. Production regressions passed.

New checks cover:

- Strict values, bounded hello size, coefficient allowlisting, malformed snapshots, binary transport and old-server capability behavior.
- Open/stock rules, non-host rejection, setup/rule rejection during play, car selection between cup rounds, host migration and retained pending choices.
- Mid-event takeover without repair or reconfiguration, token reconnect, room persistence, direct simulation restoration with corrected body mass, and legacy stock migration.
- Actual bundled Worker restoration with mocked host sockets/storage, retaining 24 selected loadouts, mixed JSON/binary peers and the host stock rule.
- Independent solo contact adjudication versus tuned authoritative cars for all three production models in race and playground: health, inflicted damage, positions, corner damage and subsequent handling agree within the stated test tolerances.
- Production-model online rendering: confirmed paint and physical specification, armor applied once to reconstructed dents, no repeated car rebuild for an unchanged setup, and a new setup on the next event.

The existing room, cups, shared physics, structural damage, garage, livery, replay, admission, wire codec and frozen-source audits remain in the passing selection. Three historical asset audits previously could not open source/fx/manifest.json or source/coupe-realism-physics.json in this partial copy; they were not rerun in this slice. This is not a full-suite green claim.

Frontend TypeScript/Vite and backend TypeScript pass. Build: index-Cf6zrhLe.js / index-DXLKM_O4.css. Existing missing-font and large-bundle warnings remain. Source audits preserve exact preceding bytes through the new online-setup revision. The main file retains its existing CRLF convention.

Logs: work/setup-regression.log, setup-physics-final.log, setup-build.log and setup-backend.log. Test sources and frozen source fixtures are included in the cumulative development package.

## Browser and 24-client load evidence

A real browser used QuarryNetwork and OnlineUI against the actual Room/Rapier server. It selected a saved Stryde setup (engine3, tires2, armor3) and received the authoritative hatch setup: mass1611kg, drive force15078N, paint#36aa88. After the fixture ended the event at20seconds, the browser selected Kessler, applied the stock-performance rule, reconnected and started another event. The pending choice survived the stale reconnect hello; the authoritative sedan used engine0, mass1650kg and drive force12400N while retaining paint#36aa88. No browser console errors appeared. Screenshots: quarry-online-setup.jpg and quarry-online-stock-rule.jpg. The fixture exercises network/lobby/results controls; it does not establish full-scene performance.

A separate30.35-second loopback race used24native WebSocket clients with varied upgrades, tuning and paints. The25th entrant was rejected; seat24 reconnected at capacity halfway through. Every snapshot passed production validation, every client reached at least tick1803, and the replacement connection received305snapshots.

| Measure | Result |
|---|---:|
| Received traffic | 162,724,597 bytes |
| Equivalent JSON for the same messages | 899,169,871 bytes |
| Binary reduction | 81.9% |
| Final snapshot, binary / JSON | 9,564 / 53,788 bytes |
| Server batch median / P95 / max | 5.73 / 10.89 / 31.25 ms |
| Ping P95 | 84.69 ms |
| Maximum reported WebSocket output buffer | 0 bytes |

The server batch comprises three physics steps plus a broadcast. All24 test clients decode in one Node process, so ping includes shared client event-loop contention. Compared with the preceding run, aggregate traffic and ping increased; these results do not prove a latency improvement or production-ready hosting. Received output is approximately5.36MB/s (42.9Mbit/s) across24clients. WAN jitter/loss, sustained Cloudflare CPU/cost, full-scene rendering and longer events remain unverified.

## Packaging and remaining scope

The cumulative package includes all pending local milestones through this change. It excludes credentials, player data, dependencies, large assets and scratch load servers. Existing before hashes are retained for installation conflict checks.

The VENGEANCE candidate's multiplayer directory is a junction to the original; isolate it before applying changes. After authorized transfer, compare destination hashes, preserve concurrent edits, back up, install locked dependencies and run the full tests with complete assets before installation/deployment.

Automatic approval review previously rejected outgoing source/test transfer because explicit human authorization was missing. No transfer was retried. The full parity matrix remains active, including vehicle/track variety, online event variants and decals, discovery, richer upgrades/progression, peripherals and broader rendering/audio work.
