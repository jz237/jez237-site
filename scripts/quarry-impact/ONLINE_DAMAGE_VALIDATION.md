# Authoritative corner damage — local development, 2026-10-01

Full Wreckfest 2 parity remains incomplete. These changes are local only, not installed on VENGEANCE or deployed. Outgoing source/test transfer still awaits explicit human authorization after automatic approval review rejected it.

## Implemented behavior

The authority now calculates structural damage from contact impulse and closing speed using the solo formula, including low-speed protection, race scaling, contact cooldown and the same minimum accepted impact. Nearby wheels accumulate the same bounded damage and displacement as the rendered attachments. The shared driving kernel uses that condition for suspension, ride height, tire radius, steering toe, camber, friction, drag and power loss.

Authoritative wheel anchors come from the production coupe, sedan and hatch GLBs, including their model offsets. The renderer and authority share the accumulation calculation. The anchor record includes each GLB hash and has a regeneration script; tests verify it against loaded, prepared Vehicle models, not just raw JSON.

Four-corner condition is included in snapshots and durable room saves. New clients validate its dimensions, numeric ranges and shift limits. Missing condition remains compatible with legacy snapshots. Old saved rooms reconstruct available corner damage from their visual impact history. New snapshots carry mechanical state independently, so missing visual-event packets do not erase wheel damage. Playground repair clears damage; race recovery retains it and its existing penalty. Rematches create fresh cars.

The online renderer now applies authoritative wheel damage/displacement and the same toe calculation as solo rendering. The existing visual attachment pose supplies camber and wobble. No client message can supply physical damage or positions; the authority remains responsible for adjudication.

## Verification

**84 passing targeted checks; 3 historical checks unable to complete because assets are absent locally.** This is not a green full-suite claim.

- Seven new checks pass. They cover exact frozen attachment behavior through 120 varied impacts per model; all three real cars' collision and subsequent driving response in playground/race; slow actual contacts; bounded saturation; room save/restore and legacy migration; repair/recovery; snapshot rejection; remote rendering with missing impact packets; exact source recovery.
- The six collision fixtures run 150 physics ticks each. Browser contact adjudication is independently executed against Rapier contacts. Health/inflicted damage agree within0.001, corner state within0.0001 and positions within0.002m. Every fixture must generate actual damage and at least one affected wheel. This proves these scenarios, not universal crash parity.
- Sixty-five existing targeted checks pass, including all15 backend room checks, shared driving, tuning, livery assets, replay, cups, Worker lifecycle, admission and networking.
- Twelve checks in the historical structural/drive-feel suites pass. Three asset audits fail to open source/fx/manifest.json or source/coupe-realism-physics.json. These are the same missing-fixture limitations recorded in the prior milestone.
- Frontend TypeScript/Vite build and backend TypeScript check pass. Bundle: index-CwjkQhV_.js / index-Cgmj3fND.css. The existing absent-font and large-bundle warnings remain.

Logs: work/online-damage-tests.log, online-damage-regression.log, online-damage-historical.log, online-damage-build.log and online-damage-backend-check.log.

## Rendered evidence and local cost

The CUA browser fixture used actual Simulation and OnlineView code with production GLBs. A coupe collision produced77.0health and17.4% front-right wheel damage, spring27.39 and drag0.28. Repair restored100health, zero corner damage, spring30 and zero drag. Restoring the saved snapshot returned the same damaged values. The fixture passes snapshots directly; it does not prove a real WebSocket connection, full quarry rendering or deployed room behavior.

The initial fixture requested missing packed models and reported a fetch error. The scratch harness was corrected to use the available production unpacked GLBs; no new errors appeared during the successful collision/repair/restore interaction. The production loader was unchanged. The fixture and its controls are excluded from the game patch.

One local headless eight-car AI run took433.82ms for600ticks (mean0.723ms/tick, initialization excluded). Its final JSON snapshot was18,491bytes versus16,705without corner state, an increase of1,786bytes. At20Hz this sample would add about35.7kB/s per recipient before transport overhead/compression. This is one local measurement, not a Cloudflare capacity/cost guarantee or rendered frame benchmark. See work/online-damage-performance.json.

## Remaining limits

Physics remains a rigid chassis with raycast wheels and deformed visual panels. Structural collision evolution, engine/fuel failures, online tuning, full damage fidelity,24-player capacity and the larger content/features matrix remain open. The subsequent local capacity milestone supports24-seat rooms; see ONLINE_CAPACITY_VALIDATION.md. Three base vehicles and one quarry remain.

Visual history retains the existing last334impact bound for protocol compatibility. Mechanical state is complete in new snapshots even if older cosmetic impacts have been dropped. Legacy saves can only reconstruct the history they contain. Old clients can keep receiving bounded snapshots but do not consume the new authoritative corner state; coordinated server/client release is required for the full visual correction.

Full remote regressions, complete asset audits, sustained network load and Cloudflare verification remain outstanding. This is a development candidate, not an install-ready release.

## Source and installation safety

Frozen snapshots extend the source audit chain: online damage → physics synchronization → cups → controls → livery → routes → replay → events → progression → garage → earlier releases. Existing destination files retain their captured pre-update hashes in the cumulative manifest.

The package excludes assets, dependencies, scratch fixtures, player data and credentials. Before an authorized installation, compare destination hashes, preserve concurrent edits, create a backup and use a genuinely isolated backend copy. The VENGEANCE candidate multiplayer directory is a junction to the original and must not be edited as an isolated checkout. The previously rejected outgoing transfer has not been retried; production and the public site remain unchanged.
