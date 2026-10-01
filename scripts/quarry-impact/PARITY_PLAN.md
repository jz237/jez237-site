# Quarry Impact — Wreckfest 2 PC feature-parity work

User objective: change or update this game to be feature parity with Wreckfest 2 PC.
Status: **in progress; parity has not been achieved**. The original objective remains the completion gate.

## Evidence baseline (October 1, 2026)

Vengeance source: `D:/Projects/hidden reef header/quarry-impact`.
Latest recorded baseline release: `529c847e8a03812491ff8de1f64b85f22f8166a8`.
The working project is untracked inside a different parent repository; do not commit unrelated parent changes.
A source snapshot and baseline Git commit are in the Linux working copy for reproducible diffs.
No third-party Wreckfest code, names, artwork or audio is used for implementation.

Authoritative reference sources inspected:
- https://store.steampowered.com/app/1203190/Wreckfest_2/ — shipped features through Update 8.
- https://steamcommunity.com/app/1203190/announcements/ — July patches and August developer audio article. The latter includes work in progress, not proof of shipped audio capabilities.
- https://thqnordic.com/news/hot-summer-hot-update-wreckfest-2-update-8-adds-player-progression-minimap-and-tons-of-new-content
- https://wreckfest2.thqnordic.com/ — includes announced career and split-screen; do not silently equate announcements with releases.

## Completion matrix

Every row requires functional gameplay evidence, persistence where applicable, regression coverage and performance measurement. A UI control or isolated unit test is insufficient evidence of feature parity. Original content should provide comparable variety and gameplay functions without reproducing proprietary assets.

| Requirement | Current Quarry evidence | Remaining implementation / proof |
|---|---|---|
| Physical vehicle damage and handling | Rapier chassis, damage zones, displaced wheels, deforming panels, detached parts, component fire; local authoritative corner damage | Structural chassis deformation/collision evolution; component failures, stalls, armor integration; comparable crash outcomes and driving fidelity |
| 24-car solo fields | Selectable 2–24 cars, non-overlapping grids, tail-grid checkpoint accounting, dynamic HUD, complete-field AI fixture | Sustained full-scene benchmark on VENGEANCE and extended race/derby balancing |
| 24-player online plus bots | Local pending: negotiated24-seat rooms, AI fill, grids, cups, reconnect/restoration;30-second24-client WebSocket fixture passes | Bandwidth reduction, sustained WAN/Cloudflare load/cost, full-scene rendering, prediction, install/deployment |
| Race and derby variants | 1–20 lap forward/reverse circuit; survival and score derby, 1–20 minute derby limits, four-second respawns | Timed races, richer damage/vehicle/class restrictions and further variants |
| Waypoint / free-order / random modes | Solo ordered/free/random station events, per-car scoring, world/minimap targets and shortest-road AI | Multiplayer synchronization (including reference random mode), distinct waypoint courses and extended balance |
| Opposing-direction racing | Alternating24-car opposing grids, separate checkpoint routes, AI and individual scoring | Online support, new head-on layouts and full-scene endurance/balance |
| Track variety | One quarry, forward/reverse circuit, one arena | Multiple distinct locations and circuit/oval/figure-eight/intersection/rallycross/jump/arena layouts, reverse routes, coherent collisions and navigation |
| Vehicle variety | Three modern cars | Comparable range to 21 listed reference vehicles: different eras, sizes, drivetrains, bodies and special vehicles; authored models, handling, damage and sound |
| Garage paint and saved designs | Installed body/trim colors; local 32-layer editor with five surfaces, shapes/text/weathering, transforms, groups and setup/replay persistence | VENGEANCE transfer approval, full-scene validation/install, freehand/image tools, cosmetic dents and online replication |
| Performance upgrades / metrics | Installed solo engine/tires/armor; local pending authoritative online setups and stock-performance rules | Measured stats, further component upgrades, visible fitted parts and performance classes |
| Tuning / presets / sharing | Installed five tuning axes, eight presets per car, setup exchange; local pending online/lobby application | Simulated stats, remote/full-scene verification and leaderboard tune sharing |
| Player progression | Installed Racer/Wrecker/Showman XP and levels, versioned saves, duplicate-safe settlement | Result/reload verified; badges, broader rewards and platform persistence |
| Challenges | Installed 30 fixed-stock challenges across racing, demolition and stunts, bronze/silver/gold records | Timed damage and survival verified; all-challenge difficulty/attainability playtest; wider track and vehicle content |
| Multiplayer cups / voting | Local pending: 3/5/9-round cups, cumulative standings, mode votes, host migration and persistence | Full-scene/Cloudflare verification, round/course variety and install/deployment |
| Multiplayer discovery | Manual room code and invites | Discovery, sorting, favorites, room info, restrictions, reporting; secure server validation |
| Replay and photo mode | Solo timeline, seek/transport, four cameras, damage/repair reconstruction, compressed replay exchange and clean cropped PNGs | Online recording, transient effects/audio, depth of field/video/high-resolution capture, replay library and sustained long-recording performance |
| Leaderboards | Local best only | Per-track/class leaderboards, validated results, tune sharing and abuse controls |
| Input/accessibility | Local pending: driving-key rebinding, gamepad mapping/calibration, optional speed steering limit | Physical-controller/full-scene validation, broader assists, difficulty choices, rumble, wheel/FFB, camera options and menu navigation |
| Graphics/scalability | Three quality levels, AO/reflections/static shadows | Sustained frame pacing with expanded content, upscaling equivalents, multi-monitor/native capability assessment |
| Audio | Bundled 38 clips, positional vehicles/effects | Vehicle-specific fidelity, camera-aware sound, tire/surface/engine-component response and mix validation |
| Dirt / wear / minimap | Existing surface coating and minimap | Regression across new cars/tracks and online variants |
| PC packaging / persistence | Browser-local saves | Desktop capability evaluation, durable export/import and cloud/platform integration where needed |
| Announced career | Not established as shipped reference content | Keep on full product roadmap; verify reference release status before final completion audit |
| Announced split-screen / matchmaking / modding / localization | Not established as shipped in reference baseline | Track and implement as needed for full product scope; native input/render budget and tooling work |

## First implementation: garage and physical tuning

- New `garage.ts`: validated, versioned per-car setup records; named presets; bounded setup exchange; physics specification.
- New `garage-ui.ts`: paint preview, upgrades, tuning help, metrics, presets and share data, with keyboard-safe input and explicit save failure feedback.
- Vehicle integration: mass/inertia, wheel force, gearing, suspension/damping/ride height, brake split, steering, tire grip and impact protection. Limited-slip control is an axle approximation, not a new full drivetrain solver.
- Default midpoint setup retains existing stock behavior. Online and spectator AI remain stock until their protocol and rules support customization.
- The exact saved setup is reapplied on new solo events. Repair restores damage while retaining the tuning package.
- This is a completed slice only after browser and remote checks; it does not establish overall parity.

## Integration safeguards

Use a separate candidate directory on Vengeance; share existing large asset directories read-only while testing. Before replacing original source, compare changed-file hashes with the source baseline, back up prior files and preserve any concurrent changes. Never deploy a stale full-site snapshot. Existing public release stays authoritative until a candidate passes checks and is deliberately published through the existing full-site workflow.


## Custom events and larger fields

The custom-event milestone supports 2–24 solo entrants, 1–20 laps, forward/reverse routes and timed survival/score derby. Respawns wait for a clear arena position and preserve scores. Finished race AI continues driving so it does not form a roadblock. Ten- and twenty-lap race records are separate from shorter events. Challenges keep their fixed eight-car forward rules; online remains the existing eight-seat protocol. An optional performance display reports rolling mean FPS and P95 including slow frames.

Full parity is still unproven. Dynamic 24-player online capacity, new locations/vehicle variety, more route content and online variants, richer replay/photo, layered liveries, richer progression rewards and native PC peripheral features remain open.

## Replay and photo milestone

Solo events and demos now record up to20Hz with bounded duration/memory. Independent playback copies preserve the paused event, support backward seeks through damage and repairs, and export/import compressed `.qir` recordings. Photo mode provides camera selection, FOV/exposure/roll, crop/thirds guides and clean PNG export. The current implementation excludes online recordings, transient effects/audio and video/high-resolution rendering. See REPLAY_VALIDATION.md for231 passing tests, actual-car reconstruction checks and browser evidence. This is progress toward the full goal, not completion.

## Race variants milestone

Opposing-direction circuit fields and ordered/free/random waypoint events now have separate scoring/navigation state, full-field AI, scene/minimap markers and visible progress. Existing challenges remain fixed. Pure-rule and24-car physics fixtures pass; see ROUTES_VALIDATION.md for full-scene evidence and installation logs. The waypoint stations reuse the current quarry road; new point-to-point environments and multiplayer variants remain required for full parity.

## Local layered livery milestone

Implemented a 32-layer, five-surface paint editor with saved decal groups, transforms, mirroring, undo/redo and setup/replay persistence. Body-space paint remains attached through damage; rust/chips affect material finish. Local build and 31 targeted checks pass, with real-model browser evidence. Transfer to VENGEANCE was rejected by automatic approval review and awaits explicit user approval. This milestone is not installed; see LIVERY_VALIDATION.md. Full parity remains active.

## Local driving controls milestone

Added keyboard driving remapping, gamepad selection/calibration, optional speed steering limit and corrected reversed arrow steering. Local build and 41 targeted tests pass, including real Rapier directional/steering checks and browser settings persistence. Not installed: outgoing transfer approval remains pending. See CONTROLS_VALIDATION.md. Full feature parity remains incomplete.

## Local multiplayer cup milestone

Added authoritative multi-round standings, race/derby voting, host advancement/migration, independent competitor identities and durable room persistence. Two real WebSocket browser clients completed a three-round fixture cup with identical totals. Targeted checks:59 pass,3 pre-existing backend failures reproduced against frozen pre-cup source. Frontend build/backend typecheck pass. This is a local development candidate, not an install-ready release; see CUP_VALIDATION.md. Full parity and transfer approval remain outstanding.

## Local shared-physics milestone

Browser and server now share physical vehicle construction, stock handling and renderer-independent specification formulas. All15 backend room checks pass, including the previous drift, surface and geometry failures. Frozen comparisons preserve solo stock/tuned/damaged-wheel behavior. Latest targeted evidence:77 passing checks,3 historical asset audits blocked by missing local fixtures; frontend build/backend typecheck pass. Server collision/component damage and online tuning remain separate unfinished work. See PHYSICS_SYNC_VALIDATION.md. Not installed; outgoing transfer approval remains pending and full parity remains incomplete.

## Local authoritative damage milestone

Server contacts now use the solo structural-damage formula and per-corner damage accumulation. Snapshot/save restoration, legacy reconstruction, playground repair and online wheel rendering are integrated. Real-model collision fixtures cover all3cars and race scaling; browser crash/repair/restore evidence confirms77health and17.4% front-right damage restore exactly at displayed precision. Latest targeted checks:84pass,3historical fixture audits incomplete. See ONLINE_DAMAGE_VALIDATION.md. This remains local pending authorized transfer, with full parity and remote/load validation unfinished.

## Local 24-driver online milestone

New supported rooms now carry24drivers with AI vacancies, road-following grids, capacity-aware cups, reconnect/restoration and complete roster display. Real24-client loopback and actual-Worker/mocked-host tests pass. Latest targeted count:92pass,3historical audits missing local fixtures; both builds pass. Traffic remains high (737MBaggregate over30seconds), so sustained hosting, bandwidth reduction and WAN/full-scene/Cloudflare proof remain required. See ONLINE_CAPACITY_VALIDATION.md. No installation or overall parity claim.

## Local compact multiplayer transport milestone

Optional binary snapshots preserve exact numeric values and complete histories while retaining JSON compatibility. A real24-client loopback run reduced received traffic81% against equivalent JSON messages, reconnected at capacity and passed production snapshot validation. Mixed-wire Worker restoration and browser reconnect pass;84distinct targeted checks and both builds pass. Aggregate output remains about38Mbit/s, and WAN/Cloudflare/full-scene performance still needs validation. See ONLINE_WIRE_VALIDATION.md. Full parity and authorized installation remain outstanding.

## Local online garage setup milestone

Saved performance tuning, upgrades and paint now travel through bounded server validation and apply at event boundaries. Hosts can enforce factory performance; pending choices survive mid-event joins, reconnects, cups and Worker restoration. Tuned/armored real-model collisions match solo behavior, and online dent rendering applies armor once. Browser join/change/rule/reconnect flows and a24-customized-client load run pass;93distinct targeted checks and both builds pass. Online layered decals, hosting/full-scene proof and the full parity matrix remain open. See ONLINE_SETUP_VALIDATION.md. No remote installation or overall parity claim.
