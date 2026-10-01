# Online event variants

The implementation extends the authoritative multiplayer simulation and client event UI. It is part of the ongoing Wreckfest 2 parity work, not proof of overall parity.

## Implemented behavior

- Host-selected 1–20 circuit laps or waypoint rounds; forward, reverse and opposing circuit directions.
- Ordered, free-order and server-seeded random waypoints. The server adjudicates station collection, laps, recovery penalties and finish order. Clients display station status, world beacons and minimap targets for their own slot.
- Survival derby or timed score derby (60–1200 seconds). Actual damage and knockout scoring, four-second delayed respawns into clear slots, full mechanical/visual repair and preserved scores.
- Rules carry through voted cup rounds. Event rules, waypoint order/progress, score and respawn deadlines persist through storage restoration and reconnects.
- Capability negotiation prevents unsupported clients joining custom events. Legacy servers keep their standard controls; ordinary message size limits remain intact. Worker restoration preserves the negotiated capability.
- Finished race AI clears the finish area and continues at reduced pace without changing its finish time or score.

## Validation

Twelve targeted event tests cover malformed inputs, gate order and configured lap completion, all waypoint formats, recovery, real collision scoring, repair/respawn, timing, host authority, cups, late joining, reconnects, saved state, binary transport, compatibility and immutable prior-source restoration.

Six browser checks exercise input bounds, host controls, drafts across roster refresh, complete start messages, guest restrictions, legacy-server behavior and rematch rules. Actual game UI checks against local Wrangler verified random-waypoint objectives and a non-host joining the correct existing car with four of five stations already collected. Both browser sessions had no console errors.

A local Worker score derby reached result at 60.0167 seconds, replicated all 24 score rows, and rendered the result/next-event controls. That run had no knockouts; real knockout and respawn behavior is separately exercised by the collision test.

The final candidate passed 315 frontend tests and 34 backend tests, frontend/backend typechecks, production frontend build and Worker dry run (11782.41 KiB, gzip 3713.81 KiB). The frontend build is `assets/index-CL4u9ViM.js`.

The five 24-car full-physics AI runs passed their unchanged completion gate. Reverse: 24 finishers in 58.53 seconds; opposing: 24 in 163.65 seconds; ordered: 24 in 88.93 seconds; free order: 24 in 112.10 seconds; random: 23 finishers and one pre-finish wreck in 274.65 seconds. Times are simulated event time. This is a bounded deterministic scenario, not broad balance or WAN-load proof. Reducing finished AI to an 8 m/s cruise removed the finish pileup without sending finishers back through the field at racing pace.

## Delivery and limits

Candidate checks run on VENGEANCE with the complete game assets. Installed on VENGEANCE with the previous files and build backed up as `D:/Projects/hidden reef header/quarry-backup-before-online-events-20261001`; source/build checksums verified by the installation script. The public frontend remains the verified replay-library release `17d89af8586bfd4dec8cd3f20c06901eafa959ef`. The public multiplayer server remains the older eight-player implementation: existing Free-account Worker access is still unavailable. No hosting plan or account access was changed.

The existing quarry, online arena, room lifetime/admission limits, car roster and broader parity gaps remain. These tests do not establish Wreckfest-equivalent handling, content, native platform support or overall parity.
