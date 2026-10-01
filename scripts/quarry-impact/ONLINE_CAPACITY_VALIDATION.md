# 24-driver online rooms — local development, 2026-10-01

Full Wreckfest 2 parity remains incomplete. These changes are not installed on VENGEANCE or deployed. Explicit outgoing source/test transfer approval is still pending after automatic review rejected that action.

## Behavior

New clients advertise24-driver support in their hello. A newly created room then allocates24authoritative cars; vacant seats run AI. Existing eight-seat rooms and old saved rooms retain their size. Modern clients can join legacy eight-seat rooms. Legacy clients receive a clear update-required rejection when joining24-seat rooms rather than an incompatible snapshot. The protocol remains version1 with bounded optional capacity negotiation and an advertised snapshot capacity.

Seat allocation, overflow rejection, input authority, token reconnect, host migration, saves/restoration, rematches and cups use the room's capacity. WebSocket admission permits24players plus8pending/reconnect sockets; hello timeout and existing account/IP/room lifetime limits remain. Hibernation reconstructs the room's saved capacity and reconnects attached sockets with the appropriate capability.

The24-car race grid follows the road. Tail starters owe their approach checkpoints and cannot earn a lap by immediately crossing the start line. Derby/playground starts use24spaced radial positions. The HUD uses the actual field size; the lobby shows connected/capacity counts and a scrollable complete roster.

Twenty-four-car cups award25points for first, decreasing by one per place through2points for twenty-fourth. Legacy eight-car cups keep their prior25/18/15/12/10/8/6/4scale. High-seat votes and all places are validated. A nine-round cup with complete roster turnover is bounded at216competitor records, with225maximum points per competitor.

Native peers share one encoded snapshot per broadcast. This avoids repeated JSON encoding for each recipient, but does not reduce the bytes delivered to each client. Large saved rooms are split into bounded string entries and submitted with their manifest and metadata in one atomic storage.put batch. Small/old object saves remain readable. Missing chunks fail explicitly; stale chunk keys are bounded and removed by the existing room-expiry deleteAll.

## Checks

**92passing targeted checks,3historical asset audits unable to complete.** Frontend TypeScript/Vite and backend TypeScript pass. This is not a full-suite green result.

- Seven capacity checks cover24humans, overflow, reconnect at capacity, slot24input/voting, host migration, cups, save/restore, legacy negotiation, invalid capacities and snapshots, non-overlapping grids, tail-grid accounting, all cup places,216-entry turnover, private token exclusion, bounded storage roundtrip and frozen source recovery.
- An additional test bundles the actual Worker, Room and Rapier with mocked platform sockets/storage. It establishes24seats, reconnects seat24 at capacity, checks the32open-socket bound, then constructs a fresh Worker and reattaches all24saved peers. It is not a real Cloudflare eviction test.
- Sixty-eight prior checks pass, including online damage, shared physics, tuning, livery assets, replay, all15room checks, cups, Worker lifecycle, admission and networking.
- Sixteen further damage/structural/drive-feel checks pass. Three historical audits still cannot open source/fx/manifest.json or source/coupe-realism-physics.json in the partial local copy.
- A worst-history fixture with24cars ×334dents measured1,882,572JSON bytes before chunking. Every emitted storage entry in the test is below512KiB; complete recovery matches the source object and a missing chunk is rejected.

Build: index-h6mbr5vz.js / index-DXLKM_O4.css. Existing missing-font and large-bundle warnings remain. Logs are work/capacity-tests.log, capacity-worker.log, capacity-regression.log, capacity-additional.log, capacity-worker-lifecycle.log, capacity-final-audit.log, capacity-build.log and capacity-backend-check.log. The final audit rerun is not counted twice. The backend test script now discovers all backend test files, including cups and capacity checks.

## Real WebSocket load and browser evidence

A Node loopback server ran the actual Room/Rapier authority with24native WebSocket clients for30.01seconds. All snapshots passed production validation. The25thdriver was rejected and seat24reconnected while the room was full. All clients reached at least tick1782; the replacement connection received300snapshots during its15seconds.

Measured server batches (three60Hz physics steps plus20Hz broadcast): median5.29ms,95th percentile10.01ms, maximum24.33ms. Ping95th percentile10.47ms. Maximum reported outgoing WebSocket buffer was zero. Final snapshot47,068bytes; total delivered traffic737,065,097bytes across clients. The server timer does fixed three-step batches; this test does not emulate the Worker's wall-clock accumulator or internet jitter. See work/capacity-load-results.json and capacity-load.log.

**Bandwidth remains a release concern:** the measured run delivered about24.6MB/s in aggregate. Shared encoding reduces CPU work, not network traffic. Delta/binary/compressed replication and sustained WAN/Cloudflare testing remain required before claiming production-ready24-player hosting.

The CUA browser joined a second real room through QuarryNetwork/OnlineUI alongside23test WebSocket drivers. The lobby showed24/24connected and its last roster seats were accessible by scrolling. The browser host started a24-car derby and received advancing authoritative snapshots. No browser console errors appeared. This fixture exercises the production lobby/network components, not the full rendered quarry scene.

## Remaining scope and installation

Full-scene24-car rendering/frame pacing, longer races, packet-loss/jitter behavior, server CPU/memory/cost on Cloudflare, bandwidth reduction and remote regression remain unverified. The entire parity matrix remains open, including content variety, richer damage/tuning, multiplayer discovery and other event variants. Eight-seat fallback is compatibility behavior, not the target capacity for new supported rooms.

Frozen source snapshots extend the audit chain with online capacity before online damage and all prior milestones. The cumulative development package excludes assets, dependencies, scratch load servers, player data and credentials. Existing remote files retain captured before hashes. The candidate multiplayer directory on VENGEANCE is a junction to original; create an isolated backend copy before editing. After explicit transfer authorization, compare destination hashes, preserve concurrent changes, back up, then run full tests with the complete assets before installation/deployment. No outgoing transfer was retried, and production remains unchanged.

Cloudflare references checked: [WebSocket hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/), [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/) and [Durable Object limits](https://developers.cloudflare.com/durable-objects/platform/limits/). The current docs list a2MBcombined key/value limit for the configured SQLite backend; the new bounded entries avoid approaching that limit with a full history. Current downloaded Workers types and the installed Wrangler schema were inspected; existing config/bindings remain unchanged.
