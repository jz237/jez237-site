# Quarry Impact — Wreckfest 2 PC feature-parity work

User objective: change or update this game to be feature parity with Wreckfest 2 PC.
Status: **in progress; parity has not been achieved**. The original objective remains the completion gate.

## Evidence baseline (October 1, 2026)

Vengeance source: `D:/Projects/hidden reef header/quarry-impact`.
Latest published frontend: `b7c61a500f1b85db36be92b06d4ce4365300dc98` (October 1), game bundle `assets/index-CL4u9ViM.js`.
The online-event-capable client is installed on VENGEANCE and published after 315 frontend tests, 76 live asset hash checks, browser gameplay verification, and full-site deployment checks.
The existing live multiplayer Worker remains the earlier eight-player version: deployment of the tested new backend is blocked by missing Free-account login permissions.
The working project is untracked inside a different parent repository; do not commit unrelated parent changes.
A source snapshot and baseline Git commit are in the Linux working copy for reproducible diffs.
No third-party Wreckfest code, names, artwork or audio is used for implementation.

Authoritative reference sources inspected:
- https://store.steampowered.com/app/1203190/Wreckfest_2/ — shipped features through Update 8.
- https://steamcommunity.com/app/1203190/announcements/ — July patches and August developer audio article. The latter includes work in progress, not proof of shipped audio capabilities.
- https://thqnordic.com/news/hot-summer-hot-update-wreckfest-2-update-8-adds-player-progression-minimap-and-tons-of-new-content
- https://wreckfest2.thqnordic.com/ — includes announced career and split-screen; do not silently equate announcements with releases.

## Current release status

The October 1 deployment supersedes earlier “transfer approval pending” and “not installed” milestone notes below: the user explicitly authorized transfer/deployment, all prior source changes were installed on VENGEANCE with backup, and the frontend was published. 300 frontend tests, 33 backend tests, both builds/type checks and Worker dry run passed. The full-site wrapper passed preview and live checks; 76 live game assets matched the tested build. Multiplayer publication alone is blocked by Cloudflare account access, with the old eight-player service verified compatible. Earlier milestone notes are historical records, not current approval requirements.

## Completion matrix

Every row requires functional gameplay evidence, persistence where applicable, regression coverage and performance measurement. A UI control or isolated unit test is insufficient evidence of feature parity. Original content should provide comparable variety and gameplay functions without reproducing proprietary assets.

| Requirement | Current Quarry evidence | Remaining implementation / proof |
|---|---|---|
| Physical vehicle damage and handling | Rapier chassis, damage zones, displaced wheels, deforming panels, detached parts, component fire; local authoritative corner damage | Structural chassis deformation/collision evolution; component failures, stalls, armor integration; comparable crash outcomes and driving fidelity |
| 24-car solo fields | Selectable 2–24 cars, non-overlapping grids, tail-grid checkpoint accounting, dynamic HUD, complete-field AI fixture | Sustained full-scene benchmark on VENGEANCE and extended race/derby balancing |
| 24-player online plus bots | Local pending: negotiated24-seat rooms, AI fill, grids, cups, reconnect/restoration;30-second24-client WebSocket fixture passes | Sustained WAN/Cloudflare load/cost, full-scene rendering, prediction and backend deployment; binary transport already reduces fixture traffic by about82% |
| Race and derby variants | Solo and authoritative online 1–20 lap forward/reverse/opposing circuit; survival/score derby, 1–20 minute limits, delayed clear-slot respawns; online installed but backend publication blocked | Timed races, richer damage/vehicle/class restrictions and further variants |
| Waypoint / free-order / random modes | Solo and authoritative online ordered/free/random events, server-seeded order, persistent progress, world/minimap targets, shortest-road AI; online installed | Backend publication, distinct waypoint courses and extended balance |
| Opposing-direction racing | Alternating24-car opposing grids, separate checkpoint routes, AI and individual scoring | Online support, new head-on layouts and full-scene endurance/balance |
| Track variety | One quarry, forward/reverse circuit, one arena | Multiple distinct locations and circuit/oval/figure-eight/intersection/rallycross/jump/arena layouts, reverse routes, coherent collisions and navigation |
| Vehicle variety | Three modern cars plus two original classics validated in the release candidate | Comparable range to 21 listed reference vehicles: different eras, sizes, drivetrains, bodies and special vehicles; authored models, handling, damage and sound |
| Garage paint and saved designs | Installed body/trim colors; local 32-layer editor with five surfaces, shapes/text/weathering, transforms, groups and setup/replay persistence | Freehand/image tools, cosmetic dents; online replication implemented/tested but backend publication blocked |
| Performance upgrades / metrics | Installed solo engine/tires/armor; local pending authoritative online setups and stock-performance rules | Measured stats, further component upgrades, visible fitted parts and performance classes |
| Tuning / presets / sharing | Installed five tuning axes, eight presets per car, setup exchange; local pending online/lobby application | Simulated stats, remote/full-scene verification and leaderboard tune sharing |
| Player progression | Installed Racer/Wrecker/Showman XP and levels, versioned saves, duplicate-safe settlement | Result/reload verified; badges, broader rewards and platform persistence |
| Challenges | Installed 30 fixed-stock challenges across racing, demolition and stunts, bronze/silver/gold records | Timed damage and survival verified; all-challenge difficulty/attainability playtest; wider track and vehicle content |
| Multiplayer cups / voting | Local pending: 3/5/9-round cups, cumulative standings, mode votes, host migration and persistence | Full-scene/Cloudflare verification, round/course variety and install/deployment |
| Multiplayer discovery | Manual room code and invites | Discovery, sorting, favorites, room info, restrictions, reporting; secure server validation |
| Replay and photo mode | Solo timeline, seek/transport, four cameras, damage/repair reconstruction, compressed replay exchange and clean cropped PNGs | Online recording, transient effects/audio, depth of field/video/high-resolution capture, library installation/full-scene proof and sustained long-recording performance |
| Leaderboards | Local best only | Per-track/class leaderboards, validated results, tune sharing and abuse controls |
| Input/accessibility | Installed: driving-key rebinding, gamepad mapping/calibration, optional speed steering limit | Physical-controller/full-scene validation, broader assists, difficulty choices, rumble, wheel/FFB, camera options and menu navigation |
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

## Replay library in development

Named browser-local recordings, search, import/export, playback and confirmed deletion are implemented with atomic IndexedDB storage. A50-recording/256MiB bound refuses excess saves without deleting existing recordings. Actual browser checks cover fresh connections, duplicate saves, concurrent limits, invalid imports, export/import, deletion and aborted-write rollback. A real eight-car,29.5-second recording survived reload and played from the library. Full VENGEANCE candidate suite:303 frontend tests and build pass. Installed on VENGEANCE with a source/build backup; not yet published. Online recordings and the rest of the parity matrix remain open.

## Online event variants — installed, backend publication blocked

The multiplayer authority now supports configurable lap counts, reverse/opposing circuit routes, ordered/free/random waypoint rounds, and timed score derbies with automatic repair and respawn. Rules, waypoint progress, server-selected random seeds, score and respawn deadlines survive room restoration and cups. Clients render server progress; hosts select rules in lobby/rematch screens. Unsupported clients cannot join custom-rule events. See ONLINE_EVENTS_VALIDATION.md for installation and validation status. This does not complete overall Wreckfest 2 parity.

Online event validation: 315 frontend tests, 34 backend tests, six browser checks, five full-field AI runs, actual game waypoint/reconnect and timed score-result rendering, both typechecks/build and Worker dry run passed. Installed build: `assets/index-CL4u9ViM.js`. Public release remains the replay-library build until a supporting Worker can be published.

## Current priority: new vehicles and demo mode

The user explicitly redirected effort to new vehicles and demo mode. Ironfield track work is saved in Git stash `Ironfield course work paused to prioritize vehicles and demo`; it is not installed or published. Its first course tests pass, but the later two-lap AI completion gate fails and the scene preview is unverified. Resume only after the vehicle/demo priority is handled.

The current local and VENGEANCE candidate adds separate demo options for field size, mixed versus selected-car lineups, laps and derby duration, opening camera, repeat/alternate/stop sequencing, a next-event control and HUD hiding. Automatic following now chooses active cars with fixed camera views. The complete VENGEANCE suite now passes 326 tests and the production candidate build passes. Release installation and publication are being prepared.

Two original procedural workshop models, Bramble V8 and Millhaven Estate, have distinct proportions, wheelbases, cabin glazing, interiors, wheel openings and named damage panels. Both render in the development showroom and pass geometry checks. Both are now integrated into solo and demo lineups, the garage, setup exchange and compressed replay playback. They use distinct rear-wheel-drive handling, mass, gearing, suspension, roof colliders and damage anchors. Tests cover actual Rapier acceleration/braking, production mesh batching and wheel alignment, deformation/repair and backward replay seeks. Their V8 sound reuses an existing bank at distinct pitches. Browser checks confirm the estate garage and live six-car derby. They remain first-pass models requiring visual and sound refinement; online integration and broader vehicle parity remain open.


## Classic vehicle rebuild after prototype feedback

The playable two-car/demo release was installed and published as website commit 931f39acf67bc4fdd196748400514aa5f93639f1 (assets/index-HWCVMgA2.js). Its 326 frontend and 34 backend checks passed, all 76 live game assets matched and the full-site deployment wrapper passed. The user explicitly rejected the prototype appearance as poor. Do not treat those models as final vehicle fidelity.

Current work reshapes body sides and lowers the muscle roof, uses closed crowned hood/roof/deck geometry, solid window frames, bowed tinted glazing, road tires and separate wheel designs. The estate gains four door panels with separate rear-door hinges, rectangular lamps, a longer cargo roof and matching roof collider. These changes are under validation and are not published. Vehicle appearance and demo presentation remain the priority before resuming the saved track work.

## Licensed muscle-car replacement candidate

The 12020f9 procedural rebuild still falls short visually. A BrightRetro CC-BY 3.0 muscle-car asset has now been downloaded from its author release, its original ZIP and provenance preserved, and its OBJ/BMP data converted for a reproducible local preview (`muscle-asset-preview.html`). `src/muscle-asset.ts` repairs the legacy export interpretation, smooths normals, orients the model forward, preserves its metre-scale silhouette and UVs, extracts four independently pivoted wheels, and clips body/glass triangles at assembly boundaries. Surface-area and bounds checks prove the partition does not discard or duplicate the original surfaces. Three focused tests pass, including current door/hood damage and hinge restoration; TypeScript and the application build pass. The candidate has 17,835 unindexed vertices before production damage refinement. Front/rear browser views show a substantially more credible muscle-car silhouette than the procedural prototype.

The replacement is now the muscle template in the local source and VENGEANCE test candidate. Its body proportions remain intact, its measured 2.82 m wheelbase and 1.58 m wheel-centre track drive the physics and damage anchors, and its tires fit the existing 375 mm physics radius. Door trim, glazing and bumper assemblies are separated; inner door cards, engine/radiator structure and rails were added. The embedded GLB preserves attributed texture bytes while converting OBJ UV orientation. Production tests cover wheel alignment, real acceleration/braking, damage/repair, compressed replay and backward seeks. Browser checks show eight-car derby collisions, successful camera changes at the stopped result, and circuit racing with finishers. The earlier suspected result-camera freeze was not reproduced. This candidate is not installed to the original game or published. Remaining: visual inspection of severe panel failures and inner closures, estate artwork, demo shot quality, and the broader parity backlog. Keep the full feature-parity objective open.

## Estate conversion development candidate

An attributed estate conversion now reuses the BrightRetro sculpted body with an original cargo roof, glazing, pillars, four separate doors, furnishings and roof rack. The deterministic embedded GLB is reviewed in `estate-asset-preview.html`. Eight estate/muscle checks pass, covering clipped surface area and UVs, finite geometry, four independent damage assemblies, restore, exported geometry and a regression for interior panels protruding through the outer skin. TypeScript passes and front/rear browser views have no console errors. The shared exporter reproduces the previously committed muscle GLB byte-for-byte.

This is a local development candidate, not the playable wagon and not published. Roof and window framing remain visibly angular. Severe-crash inner structures, suspension/collider alignment, production integration, driving/demo/replay validation and VENGEANCE checks remain. Do not describe this as final vehicle fidelity. Vehicle appearance and demo presentation remain the priority.

Estate refinement: the candidate now has a lower swept cabin, narrower roof ends and rounded roof corners while retaining a gridded, closed roof for deformation. Added fixed engine, valve covers, air cleaner, radiator/fins, firewall and chassis rails. Browser inspection verified the exposed bay and caught/fixed low chassis rails. Nine focused tests now pass, including roof crown/lower skin/corners and separation of the fixed engine from the moving hood. TypeScript and production build pass (existing font and bundle-size warnings). This remains local candidate artwork; final art quality, production wagon physics/asset integration, severe-crash closures and in-game/VENGEANCE validation remain unfinished.

## Playable estate replacement

The attributed estate GLB now replaces the procedural wagon in local source and the VENGEANCE test candidate. Its suspension and damage anchors match the measured 2.82 m wheelbase and 1.58 m wheel-centre track, its tires fit the existing 375 mm physics radius, and its roof collider follows the lowered cargo cabin. It retains the heavier estate mass, softer suspension and distinct gearing. Production loading preserves all four door hinges, the separate hood and the fixed engine bay.

Eighteen focused checks pass, including actual-model geometry, clear wheel openings, acceleration/braking, wheel damage/repair, compressed replay damage for both replacement cars and backwards replay seeks. VENGEANCE passes 338 frontend and 34 backend tests plus frontend build/typecheck and backend typecheck. The production estate template has 160 meshes, 64,009 triangles and 19 materials. Live browser checks show an eight-estate derby, visible damage and camera switching without console errors. This remains a test candidate; original install and public release still use the earlier procedural models. Further demo presentation, severe-crash detail and the broader feature-parity backlog remain open.

## Demo presentation refinement

The automatic director now cycles close drone, trackside and chase shots instead of routinely cutting to the distant map overview. Drone framing includes a nearby rival; chase motion follows the vehicle before smoothing relative movement. Projected body envelopes remain inside screen margins, including narrow windows. Trackside zoom tightens for distant subjects. The camera checks terrain along its desired sightline. Fresh impacts raise subject priority after a minimum shot hold; newly wrecked cars receive a short shot before attention returns to running cars. Explicit car selection remains authoritative. Manual overview and free orbit remain available.

Thirteen focused checks pass for framing, turns and speed, shot timing, recent wrecks, manual follow, finished cars, terrain and invalid input. VENGEANCE passes 346 frontend and 34 backend checks plus build and typechecks (bundle assets/index-3MgJ8JxJ.js). A mixed-field browser run confirms closer views and clean HUD hiding. These camera changes and both replacement cars remain in the test candidate, pending original-install/public release. This does not complete overall feature parity; prop occlusion, sustained full-field performance and further art/damage polish remain to be assessed.

## Vehicle replacements and demo director — installed and published

Game source f97070b4f6ede76f0dd00f649cd2bd0096919239 is installed on VENGEANCE and published as website commit ce91ca28fdbd1c82962e761fe448d8dfbfb26607 (assets/index-3MgJ8JxJ.js). This supersedes the test-candidate-only status in the preceding milestones. The website release preserves upstream changes through 8a12932b. All 91 changed source files and 234 installed runtime files matched the validated candidate; the previous installed source/runtime is backed up at D:/Projects/hidden reef header/quarry-backup-before-vehicle-refresh-20261001.

The mandatory full-site wrapper passed preview and production service checks. Read-only live verification matched 79 game assets, explicitly including muscle.glb, wagon.glb and their attribution, plus five neighboring routes. Browser checks showed both replacement models on the live menu and a mixed eight-car demo with collision damage and no console errors. Tests remain 346 frontend and 34 backend passing. The multiplayer Worker was not changed. Full parity remains incomplete: further art/severe-damage polish, prop-aware camera visibility, sustained full-field performance and the rest of the parity matrix remain open.

This publication note is a local documentation follow-up. For the next source transfer, the installed, candidate and website game-source baseline is f97070b, not this later documentation-only commit.

## Collider-aware demo visibility candidate

External demo cameras now query the actual Rapier world, excluding the followed car and sensors. A small camera aperture catches narrow posts, while eight body-envelope points catch walls that leave only the car centre visible. Blocked shots choose a nearby clear angle, hold that offset to avoid repeated cuts, and return smoothly when the obstruction clears. Manual hood and free-orbit controls retain their existing behavior.

Seven new regression checks cover real static/dynamic colliders, exclusions, partial-body obstruction, stable avoidance, recovery and enclosed-subject fallbacks. The 20 focused demo checks pass locally. VENGEANCE passes 353 frontend and 34 backend tests, frontend build/typecheck and backend typecheck; candidate bundle assets/index-DGydCeOD.js. A reproducible wall fixture visually confirms the whole estate is visible after avoidance. Full-game browser checks confirm an eight-car demo, manual estate chase follow and no console errors.

This is committed source and the VENGEANCE test candidate only; the public and original installed game remain at f97070b. Fully enclosed subjects and scenery without physics colliders are not guaranteed clear. Sustained performance with large fields remains unmeasured. Vehicle art and severe-damage refinement, demo presentation and the wider parity backlog remain open.

## Classic inner panels and engine-bay refinement

The muscle and estate now separate the lower front valance from the hood, so a loose hood no longer takes that bodywork with it. Both have inset inner hood/door skins with folded perimeter edges; hood pressings follow the original curved surface. Shared wheelhouse liners close the view through the backs of the front wings and clear the 375 mm tires. The muscle engine bay now has shaped valve covers, casting ribs, air cleaner, radiator fins, hose and raised chassis rails. Covers and air cleaners use rigid engine response rather than sheet-metal bending.

Nine new tests cover shell area and T-junctions, exported hood separation/hinges, inner door deformation/repair, wheelhouse sightlines/tire clearance and construction roles. All 26 focused vehicle checks pass, including existing real driving and compressed replay/backwards seek checks. VENGEANCE passes 362 frontend and 34 backend tests plus build and typechecks (assets/index-B7p_nu69.js). The estate raw asset remains within its existing 65,000-vertex ceiling at 64,983. Production templates contain 93 meshes/37,445 triangles/21 materials for the muscle and 169 meshes/74,106 triangles/22 materials for the estate; these counts are not an FPS benchmark.

The production-renderer workshop verifies intact cars, opened hood/door interiors, repeated front impacts and an estate side impact with no console errors. The open-panel controls are inspection poses, not new gameplay controls. Severe crashes still expose coarse internal forms and require further chassis, trim and deformation work; vehicle art and full feature parity remain unfinished. The candidate includes the preceding collider-aware demo camera fix. Original-install/public promotion is pending at this source commit.
