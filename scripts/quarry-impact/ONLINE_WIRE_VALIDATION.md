# Compact multiplayer transport — local development, 2026-10-01

Full Wreckfest 2 parity remains incomplete. This cumulative update is local only, pending outgoing source/test transfer authorization. It has not been installed on VENGEANCE or deployed.

## Change

New clients negotiate optional `wire: "qiw1"` in their protocol-1 hello. The server sends self-contained binary welcome/snapshot messages to supported peers and retains JSON for legacy peers. Mixed rooms, token reconnects and saved-room/Worker restoration retain per-connection negotiation; a reconnect can change its preference. Ping/error messages remain small JSON messages. Each broadcast encodes at most once per wire format; private seat tokens appear only in the recipient's welcome.

The versioned binary dictionary removes repeated field names. Numbers use int32, exact float32 when representable, or float64, preserving the original numeric value (including negative zero). UTF-16 strings preserve code units. Object undefined properties are omitted and array undefined values become null, matching JSON. Every frame is independent: no delta baseline, timing dependency or dropped history. Physics, 20 Hz snapshots and damage/repair history are unchanged.

Synchronous fflate 0.8.3 DEFLATE is used only when it reduces size. A versioned header carries declared length and Adler-32 integrity check. Decode bounds input/output to 4 MiB, nesting to 32 and values to 500,000. Small synchronous inflate input chunks allow expansion limits to be checked during decompression. The decoder checks framing, finite numbers, tags, dictionary references, duplicate keys and complete decoded-value consumption; it safely creates prototype-named own properties. Production snapshot validation still runs after decoding. The checksum detects accidental corruption, not authenticity; production WebSockets still require TLS.

fflate is pinned as a direct dependency. Its MIT notice is bundled under public/licenses. A read-only VENGEANCE check confirmed public/licenses/fflate.txt was absent before packaging; no game files were uploaded or edited remotely.

## Validation

**84 distinct targeted checks pass after repair**, comprising 83 checks from the regression selection and one additional mixed-wire Worker test. The first regression run caught an undefined optional wire field in saved legacy sessions; save now omits absent negotiation so JSON-chunk restoration remains identical. The affected seven capacity checks and wire/Worker checks were rerun successfully. Repeated runs are not counted twice.

Coverage includes exact precision and Unicode roundtrips; a real 24-car collision snapshot; all 334 dents on each of 24 cars; compression reduction; old/new peers and private-token exclusion; downgrade on reconnect; bounded malformed/corrupt/oversized packets; binary client sequencing, damage deduplication and reconnect to a JSON server; and actual bundled Worker restoration using mocked platform sockets/storage. Prior room, cups, physics, damage, garage, livery, replay, admission, network and frozen-source audit checks are included.

Frontend TypeScript/Vite and backend TypeScript pass. Build: index-2rziWzbD.js / index-DXLKM_O4.css. Existing missing-font and large-bundle warnings remain. The fflate notice is present in the final build. Three historical asset audits previously failed because source/fx/manifest.json or source/coupe-realism-physics.json were missing in this partial copy; those audits were not rerun in this slice. This is not a full-suite green claim.

Logs: work/wire-regression.log, wire-capacity-final.log, wire-final-audit.log, wire-worker-final.log, wire-network.log, wire-build.log and wire-backend.log. Frozen before bytes extend the existing audit chain; the encoder and tests are independently new modules.

## 24-client real WebSocket measurement

A loopback Node server ran the actual Room/Rapier authority, with 24 native WebSocket clients sending controls and pings. The 25th entrant was rejected and seat 24 reconnected at capacity halfway through the 30.07-second race/cup run. Every received snapshot passed production validation. Final tick: 1788. The reconnected client received 301 snapshots during the second half.

| Measure | Result |
|---|---:|
| Actual received traffic | 142,566,999 bytes |
| JSON encoding of the same received messages | 750,446,752 bytes |
| Reduction | 81.0% |
| Final binary snapshot | 9,434 bytes |
| Same snapshot as JSON | 48,307 bytes |
| Server batch median / P95 / max | 5.02 / 11.21 / 24.98 ms |
| Ping P95 | 38.08 ms |
| Maximum reported WebSocket output buffer | 0 bytes |

A server batch includes three physics steps and a broadcast. All 24 test clients decode in one Node process; ping includes its event-loop contention. The previous JSON-only run's P95 ping was 10.47 ms, so this run does not establish a latency improvement. The paired byte comparison uses the same decoded messages, not a different random race. Observed aggregate output is still about 4.74 MB/s (roughly 38 Mbit/s) for 24 clients; this is a meaningful reduction, not proof of low-cost hosting. No snapshot interval or precision was reduced to obtain it.

A real browser joined through QuarryNetwork and OnlineUI, received binary welcome/updates, started a 24-car derby, displayed advancing ticks and rejoined its same seat. The browser had one human plus 23 AI cars; the separate load run had 24 WebSocket clients. Screenshot: quarry-binary-transport.jpg. This is a network/lobby fixture, not full-scene rendering evidence. No browser console errors were observed.

## Remaining work and installation

WAN jitter/loss, sustained Cloudflare CPU/cost, full 24-car rendering and longer events remain unverified. Further replication improvements may still be needed. The full parity matrix, including tracks, vehicles, online variants, discovery, tuning, peripherals and other content, stays open.

The cumulative development package includes pending livery, controls, cups, shared physics, authoritative damage, 24-player rooms and this transport change. It excludes player data, credentials, dependencies, large assets and scratch servers. The new license notice is the sole public-directory addition. Existing files retain their captured installation before hashes; verify destination state before applying.

The VENGEANCE candidate's multiplayer directory is a junction to the original. Create a genuinely isolated backend before applying changes, preserve concurrent edits, back up, install locked dependencies, and rerun the full tests with the complete remote assets. Automatic approval review previously rejected outgoing source/test transfer for lack of explicit human authorization. That action was not retried; installation still awaits the pending authorization.
