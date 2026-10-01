# Multiplayer cups — local development, 2026-10-01

Full Wreckfest 2 parity remains incomplete. This update is not installed on VENGEANCE or deployed to Cloudflare. Outgoing source/test transfer still awaits explicit human approval after automatic review rejected it. The three backend failures recorded below were subsequently resolved by the local physics synchronization; see PHYSICS_SYNC_VALIDATION.md for current results and remaining historical fixture gaps. This remains a development candidate.

## Implemented behavior

The lobby offers single events or 3/5/9-round cups. The authority accepts bounded 2–9-round cups; playground remains single-event because it has no finish. Existing eight-seat rooms and AI filling remain unchanged. First mode is selected by the host; between rounds connected drivers vote for race or derby. The host advances, and tied/empty votes alternate the preceding mode.

Cumulative standings award 25/18/15/12/10/8/6/4 points by authoritative event position. Totals then wins determine placement; remaining ties share a place. Every round settles exactly once. Disconnected drivers at the finish receive zero. Late arrivals start accumulating from the next round. Distinct public cup identities prevent recycled seats from inheriting prior points and are separate from reconnect secrets. Bots remain cup competitors. Full roster turnover is bounded at 72 entries for nine rounds.

Host migration, reconnect identity, fresh cars per round, completion/new-cup action, save/restore and older room migration are implemented. Votes are limited to one accepted change per 250 ms per driver, and duplicate/rejected messages do not trigger persistence. Accepted start/vote/next mutations are saved by the Worker before the message handler completes, including quiet results screens. No changes to admission limits, leases, Worker configuration, accounts or hosting were made.

The protocol remains version1 with optional capability/state fields. Updated clients expose cup controls only when the server advertises support; legacy servers receive the original single-event start format. Client cup snapshots are bounded/validated before acceptance. Older clients can continue ordinary play on the new authority, but cannot operate the new cup UI.

## Evidence

- 7 cup tests pass: protocol abuse/bounds, scoring/idempotence, three-round real-Rapier room, host authority, voting, disconnect/seat replacement, late join, token reconnect, durable state roundtrip, safe rendered names and maximum roster turnover.
- 3 Worker lifecycle tests pass, including an accepted idle vote becoming durable before handler completion. A local nested esbuild JS/binary mismatch was repaired using the matching official Linux binary; it was a tooling failure, not a Worker test result.
- 9 network tests, 4 admission tests, 1 source-revision test, 8 controls, 7 livery and 8 routes pass.
- The existing 15-test backend room suite has 12 passing and 3 failing tests. An isolated copy of the exact pre-cup room/protocol/Worker reproduces all three failures against the same existing frontend/assets. Current targeted totals: **59 passing, 3 failing**. This is not a green full-suite claim.
- Frontend TypeScript/Vite build and backend TypeScript check pass. Local bundle: index-x08Gt5Cd.js / index-Cgmj3fND.css. The partial local assets still lack a referenced font; the existing large-bundle warning remains.

Two CUA browser clients connected through real WebSockets to the actual Room/Rapier code on loopback. The production OnlineUI/QuarryNetwork components were exercised through a scratch harness. Both clients saw matching standings/votes; a 1–1 vote changed derby→race; the host disconnected and authority migrated; token reconnect kept scores without reclaiming host; the new host advanced and completed round3. Final totals were identical across clients, and no console errors were reported. Fixture controls advanced the simulation to its time limit: this verifies real transitions, not full-duration races or rendered quarry gameplay.

Logs: work/cup-tests.log, cup-regression.log, cup-baseline-room.log, cup-regression-rest.log, cup-worker-lifecycle.log, cup-build.log and cup-backend-check.log. The earlier regression-rest log includes the superseded esbuild launch failure; cup-worker-lifecycle.log is the successful rerun.

## Unresolved verification and fidelity gaps

1. Original Vehicle versus authoritative Simulation replay drifts at tick61 (about0.000127 m). The current browser vehicle and legacy server physics need reconciliation; this predates cups.
2. source/circuit-surface-base.json is absent from the partial local asset copy, so the shared-grip fixture cannot run.
3. The existing road-corridor audit reports static fence obstructions. Its expected empty list fails identically before/after the cup patch.
4. Full quarry rendering, sustained multiplayer load, real Cloudflare hibernation/deployment and remote regression remain unverified. Local hosting APIs were mocked for lifecycle tests; a loopback Node WebSocket server exercised Room directly.
5. Cups currently reuse the existing three-lap race and five-minute survival derby, eight seats and one quarry. Other modes/courses,24-player capacity, physics parity and broader discovery remain open. Cups share the existing two-hour room lifetime; a long nine-race cup is not guaranteed to finish before expiry.

## Source/package safety

Frozen cup snapshots preserve 4d6ad3d frontend files plus the previously downloaded, unchanged backend room/protocol/Worker/lifecycle-test source. The historical chain is cup → controls → livery → routes → replay → events → progression → garage → reference → older. Backend files were previously untracked locally, so their before hashes come from these frozen bytes, never a null/new-file assumption.

A cumulative development package includes pending livery, controls and cup changes. It excludes assets, dependencies, player state, scratch servers and credentials. Its manifest uses installed route baseline afe7661 for frontend files and captured backend before hashes. Compare destination hashes and use an isolated, separately copied backend candidate: the VENGEANCE candidate's multiplayer directory is a junction to original and must not be edited as though isolated. Resolve the failing checks, verify the actual remote state, back up, build and test before any authorized installation/deployment. Production/public site is unchanged.

Cloudflare references consulted: [Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/) and [Durable Object WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/). Official Workers types5.20261001.1 were retrieved and inspected; existing generated Env types still typecheck.
