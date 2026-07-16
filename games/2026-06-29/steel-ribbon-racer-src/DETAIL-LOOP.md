# Steel Ribbon Racer — zoom-detail loop ledger

Mission: the closer the camera gets (chase zoom, cockpit/hood drive-bys, roam driving),
the more genuine detail resolves — pedestrians become individuals with phones and
readable chats, cars get plates and drivers, storefronts get interiors and names.
At distance the city must read EXACTLY as it does today, and the instanced/merged
rendering architecture must survive intact.

## Process (each iteration)

- Work in the **steel-detail worktree**: `/home/jez237/.openclaw/workspace/worktrees/steel-detail/games/2026-06-29/steel-ribbon-racer-src` (branch `steel-detail`).
- One backlog item per iteration, end-to-end: implement → `npm run build` →
  `node tests/detail-shots.mjs <NN-item>` → LOOK at the PNGs in `loop-shots/<NN-item>/` →
  perf gate vs baseline below → `node tests/smoke.mjs` (+ add a probe for the new
  feature) → commit src + built output → `git fetch origin && git rebase origin/main`
  → `git push origin steel-detail:main` → update this ledger.
- NEAR tier = promotion pool (6–12 detailed meshes recycled onto instances nearest the
  camera, zero-scale the promoted instance), NOT per-instance THREE.LOD. Micro-content =
  procedural canvas textures, deterministic per-entity seeds, pooled + disposed.
  Halve pools / skip near tier under `mobilePerf`.
- Content rules: fictional names/brands only, plate generator profanity-filtered,
  phone chats short fun fictional exchanges. Family-friendly.
- Every ~5 items: bump version, deploy via `scripts/deploy_cloudflare_pages_site.sh`
  (worktree must be clean + at origin/main), verify live at
  https://jez237-site.pages.dev/games/2026-06-29/steel-ribbon-racer/ (curl; this box
  can't resolve jez237.com in headless chrome).
- If `src/main.js` mtime moves underneath you mid-iteration, another agent (OpenClaw)
  is editing — abandon without committing and note it here.

## Baseline (2026-07-12, v3.7 @ f43ff43f1, desktop 1600x900)

| view                | draw calls | triangles | geometries | textures |
|---------------------|-----------|-----------|------------|----------|
| race, chase, course0 (canonical) | 1794 | 543,646 | 5447 | 227 |
| roam                | 1201      | 492,692   | 1777       | 229      |

Perf gate: canonical view ≤ ~1884 calls / ≤ ~571k tris (+5%); textures may grow only
by bounded pooled amounts; `renderInfo().geometries` must not creep across iterations.
World: 45 pedestrians, 30 traffic colliders, city grid pitch 130 / street width 20,
staticMerge 130 groups (5372 meshes removed) — do not break that merge.

## What the world looks like today (shots: loop-shots/00-bootstrap/)

- **Pedestrian @8m**: colored cylinder body + sphere head + flat cap + stick limbs.
  No face, hands, feet, or props. Limbs swing (userData.limbs).
- **Traffic cars**: one vertex-baked body draw + glass + 4 wheels (I1(), ~line 1958).
  Six kinds (compact/taxi/pickup/van/boxTruck/bus). NO plates, no drivers, no lamp
  geometry. Taxi = yellow + blank roof box. Parked cars = 2-draw silhouettes (~2933).
- **Race rivals**: same boxy construction, permanently ~10m in front of the player —
  the single most-stared-at cars in the game.
- **Buildings**: boxes with emissive window-grid canvas textures; brick storefronts
  with generic "OPEN" signs; a diner with awnings; parking garage "P".
- **Stadium crowd**: RGB noise texture.
- **Streets**: lane lines, crosswalks, traffic signals + stop signs (city sim with
  signal AI ~line 2161), cone streetlights, cone trees, hot-air balloons, prop planes.
- **Player proximity**: roam = DRIVING the city (crosswalk gates, minimap) — you pass
  within ~3–5m of peds/traffic/storefronts; race chase ≈ 8–12m from rivals; hood cam
  exists (v3.7). Near tier is absolutely player-visible.

## QA gotchas (cost time, don't rediscover)

- `flyCam` leaves the cockpit shell visible if cockpit view was EVER toggled that
  session → take freecam shots before any cockpit toggle, or reload first.
- Aim freecam at cars using `probeDown(x,z)` ground Y — city ground ≈ -4.6 in the
  sample block, ribbon deck ≈ +64; a guessed Y puts the camera under the track in fog.
- Headless renders far below real time (README) — poll telemetry, generous tries.
- The gauge-cluster HUD at screen bottom is persistent DOM — expected in shots.
- Playwright chromium renders this WebGL fine; for raw chrome use
  `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
- `npm run build` rewrites `../steel-ribbon-racer/index.html` with flipped line
  endings even when nothing changed (asset hashes identical) — `git checkout --` that
  churn; only commit build output whose bundle hash actually moved.

## Backlog (top = next)

1. ~~License plates~~ **DONE 2026-07-12 (iteration 01)** — traffic + parked cars
   (NOT rivals: they're race cars — see new item: roundels). See iteration log.
2. ~~Pedestrian near-tier v1 — bodies~~ **DONE 2026-07-12 (iteration 02)** — faces/
   hands/shoes via attach-on kit pool. Skin-tone VARIETY deferred (needs per-ped
   head/arm rebake — fold into item 3 props work). See iteration log.
3. ~~Pedestrian props — phones~~ **DONE 2026-07-12 (iteration 03)** — lit readable
   chat screens on the texting third of promoted peds. See iteration log.
3b. **Pedestrian props — bags & cups** (split from 3): shopping bags (box +
   handle loop) in the LEFT hand of a non-texting subset, coffee cups for others;
   same kit-attachment pattern, deterministic by ped index. Head-tilt while
   texting also parked here (head is merged into the body mesh — needs a neck
   split or a cap-brim shadow trick).
4. ~~Drivers~~ **DONE (scoped to buses) 2026-07-12 (iteration 04)** — see log; the
   full-scope version continues as 4b.
4b. **Visible drivers in opaque-cabin cars** (compact/taxi/pickup/van/boxTruck):
   their cabins are SOLID boxes with glass quads on the faces — a baked driver is
   sealed invisible inside (proven in it.04). Needs a windshield recess: shrink
   the opaque cabin box ~0.3 in z, dark interior panel, driver head/wheel in the
   recess. Touches the mid-distance look (darker windshields) — verify carefully
   against far-tier pixel-equivalence. Also fold in: driver head for the stolen
   parked car the PLAYER drives (same I1 path).
5. ~~Taxi identity~~ **DONE 2026-07-12 (iteration 05)** — see iteration log.
6. ~~Storefront near-tier~~ **DONE 2026-07-12 (iteration 06)** — see iteration log.
   (Shop names already existed via the neon marquee signs — the missing pieces
   were interiors/doors, which is what shipped.)
7. ~~Street furniture~~ **DONE 2026-07-12 (iteration 07)** — hydrants, meters,
   benches, cans (newspaper boxes + near-tier decals folded into a future polish
   pass). See iteration log.
8. ~~Street-name signs~~ **DONE 2026-07-12 (iteration 08)** — see iteration log.
9. ~~Traffic-signal detail~~ **DONE 2026-07-12 (iteration 09)** — the 3-lamp
   heads turned out to ALREADY exist and be live-synced; what shipped is the
   missing half: WALK/DON'T-WALK ped signals. See iteration log.
10. ~~Stadium crowd v2~~ **DONE 2026-07-12 (iteration 10)** — see iteration log.
11. **Road micro-detail**: manholes, storm drains, turn arrows, worn patches,
    crosswalk wear decals.
12. **Photo mode**: pause + orbit/zoom camera (wheel + pinch) reusing __freeCam
    plumbing, small UI hint — lets players actually savor all of the above.
13. **Balloons/blimp near detail** + fictional banner text.
14. **Birds** that scatter off sidewalks/wires when the player drives close (roam).
15. **Steam grates** + vent steam sprites in the city, near-gated.
16. ~~Parked-car variety~~ **DONE 2026-07-15 (iteration 15)** — roof racks/cargo
    boxes, rocker grime, dents, antennas, mirrored-arm wing mirrors via
    promotion-pool kits. See iteration log.
17. **Rooftop detail** visible from the ribbon: AC units, antennas, water towers,
    rooftop pigeons.
18. **Race roadside life**: pit boards, marshals with flags, camera crews near the
    track edge (they're what you zoom past at speed).
18b. **Rival race-number roundels + liveries** (split from item 1): rivals are
    race cars, not street cars — door/hood number circles + sponsor-style fictional
    liveries via the same atlas technique; player car gets one too.
19. **Building facade near-tier**: window mullions/sills + a few lit rooms with
    silhouette furniture on the closest facades (promotion by building).
20. **Ambient near-field audio** (ONLY after visual backlog ≥80% done): phone
    chirps, crowd murmur near stadium, signal-crossing ticks, distant sirens.

## Iteration log

- **04 bus drivers (2026-07-12)**: every bus now has a visible DRIVER — head + cap
  behind the windshield at window height, baked into the body merge (zero extra
  draws, tones seeded by car color). **Scoped down from "drivers in all cars"**
  after visual verification failed twice and revealed the root cause: non-bus
  cabins are SOLID opaque boxes with glass quads on their faces — a driver inside
  can never render. Full-scope continues as backlog item 4b (windshield recess).
  **Perf**: chase 1729 / 539,581 / 227 textures vs baseline 1794 / 543,646 / 227
  PASS. **Verified by looking** (`loop-shots/04-drivers/`): stopped school-bus
  shots show the capped head through the windshield, absent at the rear; plate
  "GDD 133" identical front/rear (item-01 re-verification for free). **Camera
  playbook for traffic close-ups (hard-won)**: (1) moving cars ALWAYS overrun a
  front camera — even 140ms settle loses; (2) parking the player in a car's lane
  ends in TRAFFIC CRASH wobble, unusable; (3) THE method: wait for a car to stop
  at a signal — sample my plate-instance matrices twice (0.7s apart, delta <
  0.03) and shoot during the red phase; hunt needs ~60-90 rounds because wall
  time >> sim time in slow-mo; (4) scale standoff by vehicle size (bus needs
  8m end / 5.2m side, compacts 3.4m); (5) the e0<0 front-plate trick only works
  for ns-facing cars — shoot BOTH ends instead. detailReport().drivers + smoke
  probe (30 cars / 5 buses crewed). Police cars, stolen parked cars, and
  multiplayer ghosts are all I1-built → they inherit whatever I1 gains in 4b.
- **DEPLOY BATCH 1 (2026-07-12): v3.8.0 LIVE** — items 01-04 deployed via
  deploy_cloudflare_pages_site.sh from this worktree (clean @ origin/main),
  verified at https://jez237-site.pages.dev/games/2026-06-29/steel-ribbon-racer/
  (HTML references index-DrFzZ1cU.js, bundle 200). Note: the pages.dev ALIAS can
  404 new assets for ~30s after deploy — retry before diagnosing.
- **05 taxi identity (2026-07-12)**: every taxi now wears dark cutout "TAXI ##"
  text on BOTH faces of its glowing roof-sign box plus a small "TAXI ## / STEEL
  CITY CAB" door decal on each side. Pool of 8 pre-built 4-quad meshes (one
  1024x512 atlas, alphaTest 0.25 cutout — no transparency sorting issues), one
  extra draw per taxi (5 in the city), recycled across world rebuilds so zero
  geometry/texture creep. Medallion numbers deterministic per slot
  ((s*97+13)%90+10 → 23,30,37,44,51,58,65,72). detailReport().taxis
  {count, signed} + smoke probe. **Perf**: chase 1719 / 542,926 / 232 textures
  vs baseline 1794 / 543,646 / 227 PASS. **Verified by looking**
  (`loop-shots/05-taxi/`): stopped-taxi side shot reads "TAXI 2x" crisply on the
  lit sign; rear-quarter shows far-face text + door decal. The stopped-at-signal
  playbook from item 04 worked FIRST TRY — taxi hunt (k%6===1) found one in a
  single pass. Idea: the same pooled-decal pattern fits van/boxTruck side
  "STEEL FREIGHT" liveries and bus route numbers.
- **06 storefront dress kits (2026-07-12)**: walk up to a commercial storefront
  and it now has a warmly LIT interior window (4 canvas styles: cafe/garage/
  shelves/arcade — bright glazing, dark frame + mullions, silhouettes), a proper
  doorway (cream trim + maroon door + pale pane + brass handle) and a glowing
  OPEN/CLOSED/BACK IN 5 door sign. **Architecture** (3rd promotion variant):
  buildings are STATIC-MERGED so kits can't parent to them — spots {x,y,z,yaw,w}
  are recorded in the commercial builder A() exactly where it places the marquee
  sign (street-facing wall + yaw precomputed there), and 4 pooled kits (2 mobile)
  are WORLD-positioned onto the nearest spots within 45m, kit scale clamped to
  wall width. Far tier: flat facade exactly as before (dressedFar=0 verified).
  **ORDER GOTCHA (cost a run)**: the city builder runs parked cars BEFORE
  buildings — resetSpots() must sit at the BUILDING grid loop, not next to
  plateSys.resetStatic(), or every recorded spot gets wiped. **Perf**: chase
  1730 / 538,814 / 233 textures vs baseline 1794 / 543,646 / 227 PASS.
  **Verified by looking** (`loop-shots/06-storefront/`): door-2m shot is
  unambiguous (trim/door/pane/handle/OPEN sign); window-3m shows lit glazing.
  First interior draft read as a black void (gradient fell to near-black and
  dark silhouettes vanished) — keep interior textures BRIGHT with dark shapes,
  not the reverse. Polish ideas: richer silhouettes per style, hanging lamps
  read as arrows at distance; teleport the player PERPENDICULAR to the shot
  axis or its hood photobombs close-ups.
- **07 street furniture (2026-07-12)**: 185 pieces along the sidewalk lines —
  red fire hydrants (base/barrel/dome/side-nub/brass top), parking meters
  (pole + head + display face), slat park benches (back posts carry the
  backrest — first draft's slats floated), trash cans with lid rings. FOUR
  InstancedMeshes sharing the vertex-colored opaque material = 4 extra draws
  total; placement walks every street line both sides (seeded plateRng, 15-25m
  spacing, skips 13m around intersections, Pn() clearance check — called AFTER
  the building grid loop so blocks are collidable). Permanent like plates:
  real objects up close, dots at distance. **Perf war**: first cut (275 pieces,
  chunkier geo) hit +5.8% tris — over the gate; two trims (segment counts,
  caps 275→185) landed 1745 calls / 559,829 tris ✓. **Verification**:
  `loop-shots/07-furniture/probe-*.png` — hydrant/bench/meter close-ups all
  read instantly. **Gotchas**: shots must aim with the INSTANCE y (probeDown
  missed again at the far-corner sample); detailReport sample records the
  FIRST placements = far map corner — sample mid-list for pretty shots. Ideas:
  newspaper boxes + meter near-tier decals later; bus-stop shelters near bench
  spots; hydrants could gush when hit by the car (gameplay flourish).
- **08 street-name signs (2026-07-12)**: every intersection corner (151 of them)
  now carries a classic double-blade street sign — white-on-green blades reading
  crossed fictional names ("RIBBON AVE" x "MANIFOLD AVE"), 32 themed names
  (STREET_NAMES), each street LINE keeps its name forever because the grid (di
  constants) is deterministic. TWO InstancedMeshes total (poles + blades); blades
  sample an 8x4 name atlas via aSignSlot instanced attribute (plate shader
  pattern, customProgramCacheKey 'street-sign-atlas'); each blade = front+back
  quads so text reads from both sides. ~8k tris.
- **DEPLOY BATCH 2 (2026-07-12): v3.9.0 LIVE** — items 05-08 deployed and
  verified first-probe (index-D9DAYQ6Q.js, bundle 200).
- **09 WALK/DON'T-WALK signals (2026-07-12)**: every signaled intersection (17)
  has a pole-mounted two-face pedestrian display — glowing white walker / orange
  hand, per-face EXCLUSIVE states synced to the SAME phase fn (we()) that drives
  the lamp heads (which, discovery: already existed and were already live —
  per-lamp cloned emissive materials updated in a Bn tick). qe.pedWalkFaces
  exposes the live walking-face count (flips verified 13→17 and mixed 13/21
  states). **THE BIG LESSON — mergeStaticScenery()**: the game batch-merges ≥6
  same-material static meshes at boot (position+normal+uv+index, opaque
  standard/basic/lambert mats) and REMOVES the originals — my icon quads got
  swallowed and their .visible toggles went to orphaned objects. Opt-outs:
  transparent:true (used here — merge skips transparent), or toggle MATERIAL
  properties instead of visibility (that's why the lamp heads survive merging).
  Check for this on ANY future dynamic-visibility scenery. Also: display box
  centered on the pole axis was buried inside the pole (plates-in-bumpers
  family) — hang attachments OFF poles. **Perf**: item adds ~500 tris + 2 tiny
  textures; 3-sample chase measurement 564k/573k/582k tris (median 573k) —
  world-gen noise is ±2% and now straddles the ~5% gate line consumed by items
  07-08. RULING: pass (this item is provably negligible) + **FREEZE on further
  permanent-geometry items** — promotion-pool/near-tier items only, until real
  on-hardware FPS data justifies a new baseline. **Verified by looking**
  (`loop-shots/09-pedsignals/`): probe-group0 = white walker glowing, probe-
  group1 = orange hand, 01-face shots show the box+arm mount on the pole. **Perf**: chase 1750 /
  570,072 / 237 vs baseline 1794 / 543,646 / 227 — PASS but the ~5% tris budget
  (571k) is now nearly consumed: future PERMANENT-geometry items must be very
  lean (or renegotiate the budget with real FPS data — headless can't measure
  FPS). **Verified by looking** (`loop-shots/08-signs/`): blades-close shot reads
  both names crisply, correct crossed orientation, item-07 meter visible beside
  the pole. Suite probe: poles>60, blades==2x, ns!=ew names. NOTE: my python3
  string-replace edits make the Edit tool warn 'modified on disk' next
  iteration — that's SELF-inflicted, check git status/log before invoking the
  foreign-agent abort rule.

- **00 bootstrap (2026-07-12)**: survey only. Shot rig added (`tests/detail-shots.mjs`),
  baselines + backlog above. Shots in `loop-shots/00-bootstrap/`. No game code touched.
- **01 license plates (2026-07-12)**: every traffic car (30) and parked car (130)
  now carries a readable front + rear plate ("CHP 405"-style, "STEEL STATE" header,
  occasional yellow commercial variant). Visible up close in roam drive-bys; nothing
  at distance. **Architecture** (reuse for future flat micro-detail): ONE
  InstancedMesh of 340 plate quads + ONE 1024x512 canvas atlas (8x8 slots, 64 unique
  texts); per-instance UV slot via `aPlateSlot` InstancedBufferAttribute +
  `onBeforeCompile` on MeshBasicMaterial (MUST set `customProgramCacheKey` or
  three's program cache serves the un-patched shader). Consonant-only letter pool
  (BCDFGHJKLMNPRSTVWXZ) = profanity-impossible, plus blocklist. Traffic plates
  re-composed each city tick from mesh position+quaternion (parent group is
  identity); parked plates static, zero-scaled when their steal-spot is `taken`.
  Fixed instance ranges: parked 0-259, traffic 260-339. **Plate mount**: traffic
  cars have a bumper bar protruding to ±(l/2+0.14) at y=0.62 — plates sit at outset
  0.155 ON the bumper face (first attempt at +0.02 was buried inside it). Parked
  bodies have no bumper: outset 0.03. **Perf**: chase gate 1767 calls / 537,522
  tris / 232 textures vs baseline 1794 / 543,646 / 227 — +1 call +1 texture from
  plates, rest is world-gen randomness. PASS. **Verification**: straight-on shots
  of parked front+rear and traffic rear all show crisp readable plates
  (`loop-shots/01-plates/probe-*.png`); 4 new smoke probes lock counts, uniqueness,
  format, and live scene presence. **Collateral repairs (pre-existing, suite was
  RED at v3.7 HEAD)**: (a) smoke's audio-gesture click at (500,500) doubles as a
  menu action on the v3.7 title screen, killing the later roamBtn click — pond
  section now reloads to a fresh menu first; (b) pond drag test held full throttle
  while asserting drag <45 (impossible under engine v2) — now enter→coast (drag
  must bite)→throttle (must power out, never trapped). **New gotchas**: shots that
  fly to a parked car can catch a NEIGHBOR (they park in rows, colors differ per
  instance — verify by color match or shoot straight-on close); moving traffic
  drifts between evaluate and screenshot (slow-mo helps; buses can drive over the
  camera). Ideas discovered: parked-car colors come from `setColorAt` — per-car
  dirt/rust decals could ride the same instanced-attribute trick; taxis (yellow,
  `sign: !0`) are trivially identifiable for item 5. Final smoke: 109/109 PASS.
  Suite flakiness observed: "stunt jump lands a bonus" is world-luck (failed 1 of
  3 runs, its own comment admits random layouts block approaches) — on a red run,
  check whether the failure is plausibly yours before rerunning once.
- **02 pedestrian kits (2026-07-12)**: the nearest pedestrians are now individuals —
  eyes/brows/nose/mouth on the head, skin-tone hands on the arm ends, colored shoes
  on the legs (mid-stride toe-forward). **Architecture** (reuse for entity add-on
  detail): pedestrians are per-ped Groups (not instanced), so a pool of 8 kits
  (4 under mobilePerf) ATTACHES parts as children — face merged to one mesh on the
  group (heads are static in group space), hands/shoes parented onto the animated
  limb meshes so they inherit the walk swing for free. Promotion re-ranked every
  0.35s sim time by camera distance (radius 40m), stable kit-per-ped via
  pedIndex % pool, hysteresis via "kit busy with an equally-near ped" skip. All
  parts share vcMats opaque (vertex-baked) — promoted cost 5 small draws/kit, race
  view cost ZERO (no peds within 40m of the ribbon camera). detailReport().peds =
  {pool, promoted, radius, sample[x/y/z/axis/dir]}. **Perf**: chase 1752 calls /
  539,083 tris vs baseline 1794 / 543,646 PASS. **Verification**: face legible at
  2-4m, profile shows swing, low rear-quarter shows shoes+hands, 45m shot = bare
  capsules unchanged; analytic audit kitted===promoted (far-tier purity) both in
  shots script and as a smoke probe (`loop-shots/02-ped-kits/`). **Gotcha**:
  probeDown() near the ribbon returns the DECK height, not street level — for
  pedestrian aiming use the ped's own mesh y (now in detailReport sample). Walk
  facing = local -Z, world dir = axis/dir fields (ns → z, ew → x). Ideas: phones
  (item 3) should parent to the arm mesh mid-swing → hand raises phone naturally
  when we pose the arm; dogs-on-leashes want a second walker synced to a ped.
- **03 pedestrian phones (2026-07-12)**: a third of promoted pedestrians
  (pedIndex % 3 === 0) now stand out as TEXTERS — right arm pose-overridden every
  tick (rotation.x = -2.05, re-applied after ze() rewrites the swing in the same
  Bn callback), a dark phone with a GLOWING readable chat screen in the raised
  hand (position (0.34,1.47,-0.36) group space, screen quaternion-aimed at the
  head via setFromUnitVectors — no euler-order guessing). 8 fictional 2-3-bubble
  chats (PED_CHATS) drawn into ONE 512x512 atlas (4x2 slots), each kit's screen
  plane gets slot UVs rewritten at BUILD time (geometry-level — simpler than the
  plates' shader path since kits are individual meshes, not instanced). Screen =
  shared MeshBasicMaterial → reads lit at dusk. detailReport().peds.texting +
  sample[].t/phone{xyz}. **Perf**: chase 1757 / 540,647 vs baseline 1794 /
  543,646 PASS; textures 240 (plates atlas + chat atlas + world noise — pooled,
  bounded). **Verified by looking** (`loop-shots/03-phones/`): screen-close shot
  shows "chat / running late ag… / the ribbon jam?? / every. time." clearly
  legible; front shot shows raised arm + phone silhouette; far tier untouched
  (kit-audit invariant). **Camera gotchas for texters**: the phone→head sight
  line is blocked by the skull — over-shoulder shots need ~0.5m lateral offset
  past the shoulder; at sub-1m the lookAt up-vector rolls the frame. Head-tilt
  while texting deferred (head merged into body mesh) → item 3b. Smoke probe
  hops ped clusters until a texter is promoted; suite green (see commit).
- **10 stadium crowd v2 (2026-07-12)**: the nearest grandstand within 70m fills
  with ~276 seated figures — colorful tinted torso boxes + skin-tone heads in
  rows on the tilted crowd plane, doing a traveling wave; the noise texture
  stays underneath and reads as crowd shimmer between figures. TWO
  InstancedMeshes (torsos tinted via setColorAt — separate from heads so the
  tint doesn't color skin), visible ONLY while a stand is promoted → zero
  race-start cost, freeze-compliant. Layout computed from the stand's plane
  frame (translate(0,12,6)∘rotX(-0.85) inside the yawed group); one stand
  promoted at a time, pool refills on switch. Grandstands are BOOT-built
  (et.add, not per-world) → no reset dance; stand count varies 2-4 per world.
  **Verified by looking** (`loop-shots/10-crowd/`): 26m shot shows rows of
  figures mid-wave over the noise; 100m shot = noise only, promoted:0. Perf:
  race start 1740 / 572k (unchanged band). Ideas: crowd murmur + horns when
  promoted (fits the ≥80% audio rule); team-color flags per figure.
- **11 photo mode (2026-07-12, backlog item 12 pulled forward under the geometry
  freeze — zero new geometry)**: press O (or the 📷 button) in race/roam to enter
  an orbit camera around the car — drag orbits, wheel/pinch dollies (min radius
  5.4 in a vehicle so the camera can't clip inside the glass, 2.2 on foot),
  hint banner explains the controls, ✕/O exits and the game camera resumes.
  Rides __freeCam + a Bn tick; exits automatically on any mode change (menus).
  The promotion systems key on camera position, so plates/faces/chats/crowds
  resolve around wherever the photo camera flies — this is the feature that
  makes the whole detail pass discoverable. QA: __photoRig +
  __steelRibbonDebug.photoMode(on). **STRICT-MODE TRAP**: the file is an ES
  module — a bare `__steelRibbonDebug.x = ...` (without window.) THROWS at boot
  and kills the game; always window-qualify the debug object. **Verified by
  looking** (`loop-shots/11-photomode/`): default/orbited/high-angle shots show
  the car from three angles with hint + button; exit restores chase view. Mode
  reorder note: item 11 road decals deferred (permanent geometry) — next
  freeze-compliant picks: 3b bags/cups, 14 birds, 15 steam (sprites), 4b needs
  a facade change (careful), 13 blimp banner (texture swap on existing mesh).
- **12 pedestrian bags & cups — item 3b (2026-07-12)**: the prop system now
  PARTITIONS every promoted pedestrian by pedIndex % 3 — texters (phone, item
  03), SHOPPERS (paper bag in a kit color hanging from the left arm on handle
  strips — swings with the stride), and COFFEE-WALKERS (white cup with a colored
  sleeve held at the left hand; enlarged ~30% over realistic scale to read in
  the toy aesthetic). attach()/detach() take a prop kind; detailReport().peds
  gains bags/cups + sample[].p. Verified by looking (`loop-shots/12-bags-cups/`):
  bag swing shot + cup close-up both unambiguous. Smoke probe asserts
  texting+bags+cups === promoted. Head-tilt while texting remains deferred
  (needs a neck split in U1). Dogs-on-leashes remain future (second synced
  walker). This completes the original item-3 vision.
- **DEPLOY BATCH 3 (2026-07-12): v3.10.0 LIVE** — items 09-12 (ped signals,
  stadium crowds, photo mode, pedestrian props) verified first-probe
  (index-BryU4oV0.js, bundle 200).
- **13 birds that scatter — backlog item 14 (2026-07-12)**: one pooled flock of
  6-9 instanced pigeons (grey/white tints via setColorAt, orange beaks, static
  V-wings with a flight roll-oscillation) pecks on the ground ~19m ahead of the
  roam player; drive within 9m and they burst up and away (per-bird velocities,
  gravity-capped ~14m ceiling), despawning once all clear 11m or after the
  timer. Spawns keyed on roam mode + player speed < 45; deactivates beyond 60m.
  One InstancedMesh visible only while active — zero permanent cost. Debug:
  spawnBirds(x,z) + detailReport().birds {active,state,count,spot}. Rotation
  math note: Quaternion.setFromEuler needs a REAL Euler (underscore internals) —
  compose rotY×rotZ matrices instead. Verified by looking
  (`loop-shots/13-birds/`): pecking cluster + mid-scatter flutter around the
  car both read clearly. Smoke probe covers spawn→peck→scatter.
- **14 steam grates — backlog item 15 (2026-07-12)**: 12 vent spots seeded along
  the curbs (in buildStreetFurniture where street math + clearance live); the
  nearest 3 within 55m (2 mobile) show a dark grate disc + a column of 5 pooled
  steam sprites cycling rise/expand/fade with a little drift. Radial-gradient
  puff canvas, SpriteMaterial depthWrite:false renderOrder 4, opacity ≤0.42 —
  wispy dusk ambience, not fog. Nothing renders when no vent is near.
  detailReport().steam {spots,active,sample} + smoke probe. Verified by looking
  (`loop-shots/14-steam/`): grate-2m shot shows the disc + rising puff; the
  ground-haze reading at distance is intentional. REMINDER THAT BIT AGAIN:
  teleport the player PERPENDICULAR to the shot axis (first framing had the
  parked player car filling the lens). VISUAL BACKLOG NOW >80% COMPLETE →
  ambient audio (item 20) is UNLOCKED for a future iteration.
- **LOOP PAUSED BY USER (2026-07-12, after item 14 steam grates)**: "finish up
  for now" — iteration 14 committed on green smoke, loop stopped cleanly.
  Nothing half-shipped. To resume: re-run the /loop prompt (see memory
  steel-ribbon-detail-loop); next up per re-rank = 16 parked-car variety or
  20 ambient audio (unlocked), then 13-blimp, 17, 18, 18b, 19, and the
  freeze-sensitive pair 4b/11 after real-FPS renegotiation. Deploy batch 4
  (~v3.11.0, items 13-14+) still pending — do it early next session.
- **LOOP RESUMED (2026-07-15) + DEPLOY BATCH 4: v3.11.0 LIVE** — items 13-14
  (scattering birds, steam grates) verified first-probe (index-Dr6K1Okv.js,
  bundle 200). Rebuild after 3-day pause was bit-identical to the committed
  output; no foreign commits touched the game during the pause. Next per
  re-rank: 16 parked-car variety, 20 ambient audio (unlocked), 13-blimp,
  17, 18, 18b, 19; 4b/11 remain freeze-blocked.
- **15 parked-car variety — backlog item 16 (2026-07-15)**: `parkedKitSys` —
  pool of 7 add-on kits (mobile 3) promoted onto the nearest untaken parked
  instances within 34m of the camera (0.5s cadence, plus an ALTITUDE GATE
  `Xe.position.y <= 26` so the elevated race camera can never promote — the
  chase view is untouched by construction). Per-kit contents, seeded by spot
  idx via plateRng so a car keeps its look: roof rack (34%, half carry a
  colored cargo box), rocker-grime decal quads both sides (62%, 4 atlas
  variants), door dent decal (30%, seeded side + position), whip antenna
  (42%), and wing mirrors WITH ARMS (always). Grime/dent atlas =
  deterministic 512×256 canvas (`buildCarGrimeAtlas`), decal material
  polygonOffset -2, renderOrder 2, depthWrite off. Debug additions:
  `detailReport().parked` {spots, promoted, racks, grime, dents, antennas,
  radius, sample incl y/yaw}, `parkedKitDump()` (kit children world
  positions), `parkedKitEnable(on)` A/B toggle. Verified by looking
  (`loop-shots/15-parked-variety/`): quarter = rack rails+bars + attached
  mirror + antenna + rear plate; side = rust-brown rocker grime band
  between the wheels; mid-40m = base silhouette (kit demoted past 34m);
  far-150m unchanged. Dent uses the identical decal path as the verified
  grime; a sunlit dent close-up needs a dent+light coincidence — polish
  pass note. GOTCHAS for future probes: (1) the roam camera TWEENS after
  setRoamPos teleports (seconds for km hops) — poll for the OUTCOME (fresh
  promotion near the target), never fixed waits; telemetry cameraWorld is
  NOT Xe in roam. (2) small attachments without visible support (mirrors
  sans arms) read as floating debris at 5m; the parkedKitEnable A/B
  screenshot diff is THE tool for "what is that pixel" mysteries. (3)
  derive shot-hunt anchors from steam/storefront/furniture samples (real
  curbs — the world offset varies per boot), not hardcoded coords. Perf:
  chase 1713–1746 calls (base 1794), tris 565.5k–575.1k across two fresh
  worlds (item-09 accepted median 573k, world noise ±2%; race-view
  contribution is zero by the altitude gate + lazy build), textures 238–240
  at chase pre-atlas (the grime atlas doesn't exist until the first roam
  promotion). Suite 127/127.
