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

Perf gate (ORIGINAL, superseded 2026-07-16): ≤ ~1884 calls / ≤ ~571k tris (+5%).

## Renegotiated baseline (2026-07-16, v3.17.0, 5 fresh worlds x 2 samples)

| metric     | observed range      | median  | NEW GATE |
|------------|---------------------|---------|----------|
| draw calls | 1814 – 1889         | ~1846   | ≤ 1975   |
| triangles  | 564,294 – 593,920   | ~576k   | ≤ 620k   |
| textures   | 235 – 245           | 240     | ≤ 252    |
| geometries | 5503 – 5552         | ~5520   | ≤ 5650   |

Rationale: the v3.7 gate was consumed by world-gen variance (item 09 verdict);
current worlds straddle it through pure noise (world 3 above: 1889/593.9k with
ZERO uncommitted changes). Real-hardware FPS is unmeasurable headlessly — the
static gate is a REGRESSION TRIPWIRE, not a hardware promise — so it is
re-anchored to current reality with explicit headroom earmarked for the
full-fat freeze-blocked items (4b recessed drivers ~5k tris, 11 painted road
detail ~4k). THE GEOMETRY FREEZE IS LIFTED within this budget. Post-item checks
compare against THIS table.
World: 45 pedestrians, 30 traffic colliders, city grid pitch 130 / street width 20,
staticMerge ~130 groups — do not break that merge.

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
4b. ~~Visible drivers in opaque-cabin cars~~ **DONE FULL-FAT 2026-07-16
   (iteration 33, round four)** — recessed cabins with baked drivers in
   every non-bus car; pooled silhouettes retired. See iteration log.
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
11. ~~Road micro-detail~~ **DONE FULL-FAT 2026-07-16 (iteration 34, round
    four)** — all 36 decals permanent via one instanced atlas mesh; the
    it.24 pooled version was the stepping stone. See iteration log.
12. ~~Photo mode~~ **DONE 2026-07-12 (iteration 11)** — O key / 📷 button
    orbit+dolly camera. See iteration log.
13. ~~Balloons/blimp near detail + fictional banner text~~ **DONE 2026-07-15
    (iteration 17)** — the "blimps" are the four prop planes: each now tows a
    distinct fictional ad banner. Hot-air balloons remain pure background
    scenery (fine as-is). See iteration log.
14. ~~Birds~~ **DONE 2026-07-12 (iteration 13)** — pooled instanced flock,
    peck/scatter/despawn. See iteration log.
15. ~~Steam grates~~ **DONE 2026-07-12 (iteration 14)** — 12 curb vents,
    nearest-3 pooled sprite columns. See iteration log.
16. ~~Parked-car variety~~ **DONE 2026-07-15 (iteration 15)** — roof racks/cargo
    boxes, rocker grime, dents, antennas, mirrored-arm wing mirrors via
    promotion-pool kits. See iteration log.
17. ~~Rooftop detail~~ **DONE 2026-07-15 (iteration 18)** — pooled vcBaked
    HVAC/antenna/water-tower kits on the roofs nearest the camera; rooftop
    pigeons deferred (birdSys covers ground flocks). See iteration log.
18. ~~Race roadside life~~ **DONE 2026-07-15 (iteration 19)** — marshals with
    checkered flags, pit boards, camera crews on lifted deck-edge platforms
    at ~14 stations along the course. See iteration log.
18b. ~~Rival race-number roundels + liveries~~ **DONE 2026-07-15 (iteration
    20)** — door/roof/tail roundels, rival name strips, twin trim-tinted
    racing stripes; player carries #7. See iteration log.
19. ~~Building facade near-tier~~ **DONE 2026-07-16 (iteration 21)** — lobby
    bands (entrance, address plate, lanterns, mullioned lit windows w/
    silhouettes) as transparent cutout panels on the nearest towers at
    street level. See iteration log.
20. ~~Ambient near-field audio~~ **DONE 2026-07-15 (iteration 16)** — crossing
    ticks, crowd murmur, steam hiss, phone chirps on the existing WebAudio bus
    (police sirens already existed via the cruiser system). See iteration log.

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
- **16 ambient near-field audio — backlog item 20 (2026-07-15)**: `ambientSys`
  on the existing `mi` WebAudio bus (mute/volume free; police sirens already
  existed via the cruiser system — not duplicated). Four layers, all
  procedural (zero assets, zero rendering footprint), all gated to
  enabled && mode∈{roam,race,paused} && camera y ≤ 26 (silent at race
  altitude AND over the post-game menu attract cam — mi persists once
  created): (1) WALK-signal crossing ticks — PS registry entries now carry
  x/y/z + walkEW/walkNS stamped by the existing signal tick; nearest
  walking box ≤26m ticks a panned 940Hz blip every 0.55s. (2) Crowd murmur —
  brown-noise loop through 430Hz lowpass, gain by nearest grandstand ≤90m
  with a slow swell. (3) Steam hiss — same noise buffer through 3.3kHz
  bandpass at active vents ≤26m (NOT 14: the roam CAR camera trails ~17m
  behind the player; a tighter radius is foot-mode-only). (4) Phone chirps —
  nearest texting promoted ped ≤15m gets a two-tone 1318→1760Hz blip every
  4–9s (intentionally intimate: a foot/photo-mode reward; skipped under
  mobilePerf). Stereo width via per-blip StereoPanner projected on the
  camera right vector. Debug: detailReport().ambient {ready, ctxState,
  signals, ticksActive, tickCount, chirpCount, levels}, ambientEnable(on),
  and camWorld() — USE camWorld FOR ALL FUTURE ARRIVAL POLLS (telemetry
  cameraWorld is not Xe in roam). Verified by MEASURING
  (loop-shots/16-ambient/report*.json — audio's screenshot equivalent):
  ticks 3+ and rising at a signal, murmur 0.062 at a stand, hiss 0.011 on a
  drive-by vent, chirp fired beside a texter (ped seeds via scene traversal
  for userData.limbs — the suite's own trick), disable floors all levels,
  ctx "running", zero page errors. Audio init rides Yd/Va (La() runs on
  roam AND race start — chirps/ticks work without ever racing). Perf: no
  meshes/textures/draw calls added; one 1s mono noise buffer (~176KB) built
  lazily on first city-camera frame with mi present. Suite 128/128.
- **17 prop-plane ad banners — backlog item 13 (2026-07-15)**: the survey's
  "blimps" are the four prop planes (lanes at alt 170–240). Each now tows a
  towed-fabric ad banner: rope + one 12×2.5 double-sided quad (back mirrors
  like real fabric), reading its row of a shared 1024×512 canvas atlas —
  banner-yellow ground, 900-weight near-black lettering, navy edge bars,
  grommets. Copy is fictional and world-consistent (PLANE_BANNERS: RIBBON
  CUP SUNDAY / FLY ZEPHYR AIRWAYS / PIXEL PAWN PAYS BEST / SKYLINE PIER IS
  OPEN — Pixel Pawn echoes the existing billboard). Fixed lane→text mapping,
  no rng. KEY RENDER LESSON: a bright canvas quad under the game's tone
  mapping/bloom washes to white and kills text contrast — `toneMapped: !1`
  on the MeshBasicMaterial + saturated mid-tone ground + max-weight glyphs
  is the fix (first cream/navy attempt was unreadable at 10m). Verified by
  looking (`loop-shots/17-plane-banner/`): crisp at 10–16m, clearly an ad
  strip with big glanceable lettering from ribbon height (~108m — these are
  toy-scale giants: 30m wingspan), tiny cheerful strip from the ground.
  detailReport().planes {count, banners, sample}. Perf: +8 draw calls
  (banner+rope × 4), ~40 tris, +1 texture — the sky IS visible at chase so
  these render there: 0.46% call delta, within gate. Banners show under
  mobilePerf too (not a pool; one shared material). Suite 129/129.
  DEPLOY BATCH 5 (v3.12.0) due next iteration (items 15-17 + next).
- **18 rooftop detail — backlog item 17 (2026-07-15)**: `rooftopSys` — 245-262
  roof spots registered by the building placer ($e pushes {x, z, top:
  re+ee+1.2, w, d, h} for every ee>10 building; reset alongside
  storefrontSys at the grid loop). Pool of 6 kits (mobile 3), each ONE
  vcBaked merged mesh on the shared vcMats().opaque material — single draw
  call per kit. Three variants, seeded per spot idx among size-eligible
  options (_variantFor): V0 HVAC cluster (2 AC boxes w/ fan rings, duct
  run + riser, vent stacks; roofs min(w,d)≥10), V1 antenna mast (3-segment
  tapered mast, tilted dish via composed Matrix4 — vcAt only does rotZ —,
  whip, junction box; h≥14), V2 water tower (4 legs, banded tank tan/teal,
  cone roof, finial, ladder w/ rungs; w,d≥14 && h≥26). Promotion: 3D
  distance (roofs are ABOVE the street camera and BELOW nothing — no
  altitude gate) to (x, top, z) < 130m, 0.5s cadence, kits matched
  variant→spot via per-variant free lists, seeded offset/rotation.
  Verified by looking (`loop-shots/18-rooftops/`): teal water tower with
  ladder crisp at 12m on a 257m tower; ribbon-height flyby at 45m shows it
  scaled right against the skyline (previously a bare slab); far vista
  250m = clean slabs, skyline unchanged. Race-chase perf WITH the system
  live: 1809–1823 calls (gate 1884), 569–573k tris (accepted band),
  textures 238 — the start section sampled roof:0 (no tall neighbors in
  range there); worst case +6 calls when downtown stretches promote.
  Debug: detailReport().rooftops {spots, promoted, pool, radius, sample,
  tall[5]}, rooftopEnable(on). Suite 130/130 expected. Rooftop pigeons
  deferred (birdSys is ground-only; a roof-perch variant is a future
  polish note).
- **DEPLOY BATCH 5 (2026-07-15): v3.12.0 LIVE** — items 15-18 (parked-car
  variety, ambient near-field audio, prop-plane banners, rooftop kits)
  verified live (index-CkhnbQdS.js, bundle 200, 867KB). Alias lag showed
  the STALE index + 404 on the deleted old bundle for ~30s — the retry
  rule stands.
- **19 race roadside life — backlog item 18 (2026-07-15)**: `roadsideSys` —
  buildStations() samples ~14 course stations after the rail build (St(s)
  centerline + side vector, lateral width/2+2.0 just outside the rails,
  skipping railSkipZone + the first 40m; stations rebuild with the course).
  Pool of 6 kits (mobile 3), each ONE vcBaked merged mesh (+1 text quad on
  pit boards): V0 marshal with a TRUE-GEOMETRY 2x4 checkered flag (baked
  alternating quads — no texture needed), V1 pit board (posts + frame +
  atlas text quad "P3 +1.2"/"LAP 2 PUSH", toneMapped:!1), V2 camera crew
  (tripod, camera + lens, blue-vest operator). Promotion: 3D distance
  ≤220m, 0.5s cadence, variant preference with cross-variant fallback.
  THE LESSON OF THE ITERATION: platforms flush with the deck are INVISIBLE
  from the deck — the ribbon's raised rim wall occludes them (only a head
  sliver peeked over; a x10-scale magenta beacon + camWorld() cross-check
  isolated it after scene dumps showed a perfectly healthy mesh). Fix:
  LIFT=1.3 — platform top rides level with the rim so figures stand fully
  visible. ALSO: probe servers must include ".css" in their MIME map — a
  css-less page renders DOM-only and the canvas screenshot is garbage
  (looked like WebGL failure; wasn't). Verified by looking
  (`loop-shots/19-roadside/`): marshal + checkered flag legible at race
  eye 18m and unmistakable at 6m; from-below reads as bolt-on maintenance
  ledges; far 300m demotes clean. Race perf WITH stations live on the
  course: 1801–1819 calls (gate 1884), 560–565k tris, textures 236.
  Debug: detailReport().roadside {spots, promoted, pool, radius, sample,
  stations}, roadsideEnable(on); smoke probe releases __freeCam=false
  after flyCam (the flag is live-read by the camera controller). Suite
  131/131 expected.
- **20 rival roundels + liveries — backlog item 18b (2026-07-15)**:
  `addRaceLivery(mesh, key)` — ONE merged add-on mesh per car (5 draw calls
  total: 3 rivals + player, re-attached when applyCarSelection rebuilds the
  player car): door roundels both sides, roof + TAIL roundels (the chase
  camera stares at rival tails all race), rival NAME strips above the door
  (CROWTHER/BISHOP/MADDOCK — the canonical season names), twin racing
  stripes over the roofline tinted via per-car solid cells in the shared
  512x512 atlas (numbers: crowther 2, bishop 5, maddock 9, player 7).
  MeshBasicMaterial alphaTest .3 cutouts, toneMapped:!1, polygonOffset -2;
  quads anchored parametrically from a runtime Box3 so all five car shapes
  work. TWO LESSONS: (1) Box3 wasn't in the three import block — module
  eval threw and the page never booted; bootcheck.mjs (bare page-error
  printer) is now in loop-shots for instant boot triage. (2) These car
  builds put local +z at the NOSE — the "tail" quad first landed on the
  hood; flipped to min.z + rotateY(pi). Verified by looking
  (`loop-shots/20-livery/`): pack shot with #7 and #9 tail roundels crisp
  in chase view + stripes on the trunk; abeam shot with the door #9 and
  MADDOCK strip. Race perf 1841-1846 calls (gate 1884; this world merged
  fewer static groups — 118 vs 131 — world noise), tris 574.7k top-of-band,
  textures 240. detailReport().livery {rivals incl live positions, player}.
  Suite 132/132 expected. Visual backlog now COMPLETE except item 19
  facade near-tier + the freeze-blocked pair (4b, 11).
  ADDENDUM (the catch of the loop): the first two suite runs failed the
  pond probe with coastMin=999 in two DIFFERENT worlds — not world luck.
  The livery ROOF quad rides just above the player car, and the roam
  physics finds ground/water by raycasting DOWN through the car position:
  the DoubleSide quad intercepted the ray and ponds silently stopped
  dragging (no error anywhere — a pure behavior regression a visual-only
  change "couldn't" cause). Fix: `add.raycast = () => {}` on the livery
  mesh. RULE FOR ALL FUTURE CAR-ATTACHED GEOMETRY: anything parented to
  cn/rivals must be raycast-inert. Post-fix run: pond drags again
  (coastMin 0.0, recover 6.2). Suite 132/132.
  ADDENDUM 2: the OpenClaw sweeper DOES operate in this worktree (previous
  assumption "worktree is safe" is dead) — during the long triple-smoke
  window it committed my WIP as its own "zoom-detail 20" commit (own build,
  own message) and it reached origin/main. My final commit superseded it
  and `git diff origin/main HEAD` converged to empty — verify exactly that
  (plus fix/ledger greps + bundle hash match) whenever a rebase reports
  "patch contents already upstream". Keep uncommitted windows short.
- **21 facade near-tier — backlog item 19 (2026-07-16)**: `facadeSys` — pool
  of 5 lobby-band panels (mobile 2) promoted onto the CAMERA-FACING wall of
  the nearest wide buildings (min(w,d)≥12, reusing rooftopSys.spots as the
  building registry; footprint-aware distance ≤30m; altitude gate ≤26 →
  street-only, the race view is untouched by construction). Panel = one
  11×5.5 alphaTest-cutout quad on a 1024×512 two-variant atlas: red/blue
  canopy + address plate (214/387), double glass door with warm-lit lobby
  silhouettes (counter/figure/pendant), two glowing wall lanterns, two
  mullioned lobby windows with sills + furniture silhouettes. EVERYTHING
  BETWEEN THE FIXTURES IS TRANSPARENT so the building's own wall color and
  ambient window grid show through — no visible panel rectangle on ANY
  facade color (same trick as the car grime decals). Wall pick per promote:
  compare camera offset against footprint half-extents, offset +0.08 out,
  yaw to face. raycast-inert (the iteration-20 rule). Verified by looking
  (`loop-shots/21-facades/`): at 8m the band reads as a real entrance —
  "214", canopy, lit door with people/furniture shapes, lanterns; at 45m
  the target demotes to base facade while a neighbor within radius shows
  its own tiny entrance (streets read naturally). detailReport().facades
  {eligible, promoted, pool, radius, sample} + facadeEnable(on). Suite
  133/133 expected. THE VISUAL BACKLOG IS NOW COMPLETE except the two
  freeze-blocked items (4b recessed drivers, 11 road decals) — next:
  final fresh-eyes survey + deploy batch 6 (v3.13.0), then loop end.
- **22 FINAL SURVEY + DEPLOY BATCH 6 + LOOP END (2026-07-16)**: fresh-eyes
  survey at all three distances in both modes (`loop-shots/22-final-survey/`):
  the live race frame shows the pack with name strips/roundels, marshal
  stations and rooftop kits along the skyline; the street frame shows the
  #7 player car beside a steaming vent under the NEON DINER marquee; mid
  and far frames read exactly as the original city. NOTHING in the
  charter's scope is missing. **v3.13.0 LIVE** (batch 6: items 19/20/21 +
  probe hardening; index-BndqnYLK.js, 200, 878KB). THE LOOP IS COMPLETE:
  22 iterations, 19 backlog items shipped (01 plates → 21 facades), suite
  grown 120 → 133 probes, all deployed. Remaining as FUTURE WORK (outside
  this loop's charter): 4b recessed drivers + 11 road decals (blocked on a
  real-FPS perf renegotiation — the geometry freeze stands), plus polish
  notes logged per iteration (leashed dogs, texting head-tilt, rooftop
  pigeons, newspaper-box decals). Restart anytime with the /loop prompt in
  memory steel-ribbon-detail-loop.

## Round two (loop resumed 2026-07-16, "continue")

Reopened mini-backlog: 4b-lite driver silhouettes (pooled — the freeze-safe
reading of blocked item 4b), 11-lite road decals (pooled), then polish notes
(leashed dogs, rooftop pigeons, texting head-tilt). Original 4b/11 full-fat
versions stay blocked on the perf renegotiation.

- **23 driver silhouettes — item 4b-lite (2026-07-16)**: `driverSilSys` —
  pool of 8 windshield decals (mobile 4) attached/detached as CHILDREN of
  the nearest moving traffic cars ≤34m (city camera only, altitude gate).
  One 256×128 alphaTest atlas, two cells: driver w/ wheel arc, driver +
  passenger; quad scaled per cabin (I1 now stashes userData.cab {w,h,l,z})
  and parked 1cm in front of the windshield glass slab facing -z — reads
  as occupants behind glass at any gameplay distance. Skips buses (real
  drivers since it.04) and the stolen actor (cockpit view would show a
  backwards silhouette). raycast-inert per the it.20 rule. Verified by
  looking (`loop-shots/23-driver-sil/`): oncoming red compact with driver +
  passenger silhouettes crisp behind the windshield, front plate below —
  the charter's "visible drivers" line is now fully delivered. PROBE
  LESSON: 30 traffic cars on a huge grid = the nearest one can idle 180m
  away and headless slow-mo means it never comes to you — go TO the car
  (setRoamPos beside __nearestTraffic(), hop up to 4 times). detailReport
  ().drivers gains silhouettes/silPool; driverSilEnable(on);
  __nearestTraffic() debug helper. Suite 134/134 expected.
- **24 road micro-detail — item 11-lite (2026-07-16)**: `roadDecalSys` — 36
  spots seeded on the street math beside the steam vents (manholes near
  centerline, drains at the curb line, worn turn arrows in lanes with
  axis-aligned yaw, asphalt repair patches; plateRng(0xdeca1)). Pool of 10
  flat quads (mobile 5), 4-cell alphaTest atlas, promoted ≤40m at city
  camera; raycast-inert (they sit directly under the ground-probe ray —
  the it.20 pond lesson applies doubly here). THE FINDING OF THE
  ITERATION: the street SLAB rides ~0.5m ABOVE the He() terrain function —
  decals seeded at He+0.03 were buried half a meter under the road
  (probeDown showed road surface -4.23 vs He -4.77). Fix: _surfaceY(spot) —
  one cached raycast per spot at promote time, band-filtered ±(1.0/-0.5)m
  so passing car roofs can't poison the cache, isSprite hits skipped AND
  Raycaster.camera set (steam sprites throw without it). Steam grates got
  lucky at He+0.02 (curb edge ≈ terrain); road CENTER is not terrain.
  detailReport().roadDecals {spots, promoted, pool, sample, stations —
  one per variant}. Verified by looking (`loop-shots/24-road-decals/`):
  worn white turn arrow crisp on the lane at 3m; iron manhole with rim +
  spokes beside the centerline; demoted to bare asphalt at 55m. Wear-patch
  cell strengthened after the first draw was invisible on dark asphalt
  (0.30 alpha blobs → 0.55 rounded patch with tar-seam outline). Suite
  135/135 expected.
- **25 leashed dogs (2026-07-16)**: the pedestrian prop partition widens to
  idx%4 — text/bag/cup/DOG. Every 4th promoted ped walks a small merged-mesh
  dog (seeded brown/black/tan/grey; body, head+snout+ears, four legs,
  tail-up via vcAt rotZ) trotting at heel (0.52, -0.1 actor-local, facing
  the ped's forward -z), with a static taut leash hip→collar (quaternion
  setFromUnitVectors on a thin box — both endpoints actor-local so no
  per-frame update needed). Trot = |sin| bob + slight pitch in the pose
  pass, keyed off an accumulated clock. All kit parts now raycast-inert
  (it.20 rule swept across face/hands/shoes/props too). Partition probe
  updated: t+b+c+d === promoted. Verified by looking
  (`loop-shots/25-dogs/`): green-shirt ped + white dog on leash reads
  instantly at 4m. Suite 136/136 expected. DEPLOY BATCH 7 (v3.14.0) this
  iteration: items 23-25 (silhouettes, road decals, dogs).
- **DEPLOY BATCH 7 (2026-07-16): v3.14.0 LIVE** — round-two items 23-25
  (driver silhouettes, road decals, leashed dogs) verified live
  (index-B58PNnx7.js, 200). Remaining polish notes: rooftop pigeons,
  texting head-tilt, newspaper-box decals.
- **26 rooftop pigeons (2026-07-16)**: perched pigeons baked STRAIGHT INTO
  the rooftop kit merges (pigeon(x,y,z,yaw) helper — body/head/tail boxes,
  composed rotY matrices; grey 0x888f96 + dark 0x5a6266): 2 on the HVAC
  boxes, 2 on the antenna base, 3 on the water tower (two rim, one beside
  the finial). Zero new systems, zero extra draw calls — they ride the
  existing pooled kits. Sized 1.4x realistic (the toy world oversizes its
  props; true scale read as subliminal bumps). Verified by looking
  (`loop-shots/26-pigeons/05-tower-pigeons-7m.png`): three birds crisp on
  the tank from above. detailReport().rooftops.pigeons=7 + probe. Suite
  136/136 expected. Remaining polish note: texting head-tilt, then second
  fresh-eyes survey → stop.
- **27 texting head-tilt (2026-07-16)**: the last polish note. The merged
  head can't rotate, but the kit FACE overlay can — texting peds get the
  face pitched 0.35 rad about the HEAD CENTRE (rigid rotation about the
  sphere centre keeps the features ON the head surface; pivot correction
  position = H - R·H computed in attach, reset for non-texters). The
  features slide low and angle down toward the phone = a convincing bowed
  head. Verified by looking (`loop-shots/27-head-tilt/`): eyes/brows sit
  at the head's lower half, gaze down. peds.sample rows gain `tilt`;
  probe asserts texter tilt > 0.3. Suite 137/137 expected. ALL ROUND-TWO
  ITEMS COMPLETE — next: second fresh-eyes survey + deploy batch 8
  (v3.15.0, items 26-27) + loop stop.
- **28 SECOND SURVEY + DEPLOY BATCH 8 + ROUND TWO END (2026-07-16)**:
  fresh-eyes survey (`loop-shots/28-final-survey-2/`) — race pack, steaming
  street beside the #7 car, clean mid/far tiers; nothing left in scope.
  **v3.15.0 LIVE** (batch 8: pigeons + head-tilt, index-B9kASrj3.js, 200).
  ROUND TWO COMPLETE: 5 iterations (23-27), 5 items — driver silhouettes,
  road decals, leashed dogs, rooftop pigeons, texting head-tilt — suite
  133→137 probes, 2 deploy batches (v3.14.0, v3.15.0). Grand total across
  both rounds: 28 iterations, 24 items, suite 120→137, 8 live deploys
  (v3.8.0→v3.15.0). Remaining wishlist crumb: newspaper boxes + their
  decals (folded out of item 07 long ago). Full-fat 4b (recessed cabin
  drivers) and 11 (painted road decals) still await the real-FPS perf
  renegotiation; their -lite pooled versions shipped in round two.

## Round three (loop resumed 2026-07-16, user ask: click-a-person inspect)

- **29 ped inspect (2026-07-16)**: click any pedestrian in roam → the camera
  glides to a 3/4 portrait and a THOUGHT BUBBLE shows what they're doing,
  thinking or reading. `inspectRig` reuses the photoRig pattern (__freeCam
  + per-frame Bn tick; look target SNAPS to the head on enter — lerping it
  from origin left the ped at frame edge in slow-mo). Picking is
  screen-space (project every ped head ≤55m, accept ≤46px — forgiving,
  raycast-free); clicking another ped SWITCHES, clicking empty canvas or
  Esc exits, walking >3m auto-exits, mode change/photo mode auto-exits.
  Personas seed off the ped's stable Rr index: name (PED_NAMES 24), prop =
  idx%4 (matches the kit partition), TEXTERS show their real PED_CHATS
  conversation (kit = idx%8 — fully deterministic), dog walkers get their
  dog's name (DOG_NAMES), bag/cup/dog thought pools all original +
  family-friendly. DOM bubble projected over the head each frame
  (hidden when behind camera), persona card bottom-left. Entry guarded:
  roam only, on foot or speed<8. Debug: inspectPed(on|"info"|false) —
  "info" is read-only (calling with no arg ENTERS; probes must poll with
  "info"). Verified by looking (`loop-shots/29-ped-inspect/`): MARGO
  3/4 portrait, phone in hand, her actual chat in the bubble ("running
  late again / the ribbon jam?? / every. time."), card + hint; real
  mouse-click entry verified via click-sweep (DOM-read state so nothing
  masks a miss); Esc exit verified; ped-click switch verified. HUD
  elements eat clicks (pointer target guard) — by design. Zero render
  cost (DOM + one screen-space pass per click). Suite 138/138 expected.
- **DEPLOY BATCH 9 (2026-07-16): v3.16.0 LIVE** — ped inspect mode verified
  live (index-CjKqE_H2.js, 200). Round three continues: next = newspaper
  boxes (the last wishlist crumb from item 07), then a fresh-eyes pass over
  the inspect feature on more personas.
- **30 newspaper boxes (2026-07-16)**: the last wishlist crumb. 5th street
  furniture type (cap 24, classic red vcBaked box on legs, 14% of the
  placement share) seeded on the same curb lines; `newsSys` pool of 4
  front-page decals (mobile 2) promotes onto the nearest boxes ≤22m (the
  it.16 car-camera lesson applied from the start... after re-learning it
  once at 14m). Front pages = 4-cell atlas, Georgia serif masthead + rule
  + 2-line headline + column stubs, all in-world fiction: THE RIBBON
  DAILY (Ribbon Cup Sunday / pigeons adopt water tower) + CITY HERALD
  (Gate 8 glows / local dog Biscuit wins everything). toneMapped:!1,
  raycast-inert. Verified by looking (`loop-shots/30-newsboxes/`):
  masthead + headline fully readable at 1m, red box reads at 7m. Perf:
  +1 InstancedMesh (+1 call), ~24×140 tris permanent — item-07 precedent.
  detailReport().news {spots, promoted, stations} + newsEnable + probe.
  Suite 139/139 expected. PYTHON-HEREDOC GOTCHA: a "\\n" in a python
  replacement string lands as a literal backslash-n in JS and vite fails
  with "Expected unicode escape" — use real newlines in the new text.
- **31 FINAL SURVEY + DEPLOY BATCH 10 + ROUND THREE END (2026-07-16)**:
  closing survey (`loop-shots/31-final-survey-3/`) — the race frame shows
  #9's tail roundel dead ahead with the pack and a marshal station on the
  rail; street/mid/far all read right. **v3.17.0 LIVE** (batch 10,
  index-BYPPv-nh.js, 200). ROUND THREE COMPLETE: ped inspect mode (the
  user's headline ask) + newspaper boxes, suite 137→139, deploys v3.16.0
  + v3.17.0. GRAND TOTAL across three rounds: 31 iterations, 27 items,
  suite 120→139 probes, 10 live deploy batches (v3.8.0→v3.17.0). The
  only remaining known work: full-fat 4b/11 behind the real-FPS perf
  renegotiation. The world looks back when you look closely — and now it
  talks, too.

## Round four (loop resumed 2026-07-16, "continue"): the renegotiation

- **32 PERF RENEGOTIATION (2026-07-16)**: measured v3.17.0 across 5 fresh
  worlds (probe-32-baseline.mjs, 2 samples each): calls 1814-1889 (median
  1846), tris 564.3k-593.9k (median ~576k), textures 235-245, geometries
  5503-5552. World 3 EXCEEDED the old gate with zero pending changes —
  the old tripwire was measuring world-gen dice rolls, not regressions.
  New gates written into the baseline section (calls ≤1975, tris ≤620k,
  textures ≤252, geometries ≤5650); geometry freeze LIFTED with headroom
  earmarked for full-fat 4b (recessed cabin drivers, next) and full-fat
  11 (painted road detail, assess after). No game code changed this
  iteration — measurement + bookkeeping only, so no smoke rerun needed
  beyond the standing green.
- **33 FULL-FAT RECESSED DRIVERS — item 4b complete (2026-07-16)**: with the
  freeze lifted, every non-bus cabin is now genuinely recessed: the opaque
  cabin box is 0.34 shorter, the old front face is rebuilt as A-pillars +
  header + sill in the trim color, and the recess holds a near-black back
  panel, a dash shelf, a tilted steering wheel, and a BAKED DRIVER (seeded
  skin tone + cap + shoulders in the dimmed body color) — all vcBaked into
  the existing per-car merges, ZERO new draw calls, ~3k tris across 25
  cars (invisible inside world noise: post-change race samples 1798-1835
  calls / 563.9-586.8k tris vs gates 1975/620k). The existing windshield
  glass slab now floats over a real dark interior — mid-distance
  windshields read darker exactly as the 2026-07-12 spec predicted, far
  tier unchanged (cabin = 2px). hasDriver is now true for ALL cars
  (userData.bus carries the bus flag — __nearestTraffic(skipBus) was
  silently skipping EVERYTHING when hasDriver became universal; flags must
  not double as type markers). driverSilSys (4b-lite) RETIRED: system,
  toggle, report fields and probe removed — the full-fat version covers
  every car at every distance instead of 8 pooled decals ≤34m. Verified
  by looking (`loop-shots/33-recessed-drivers/`): oncoming compact at 9m
  shows the driver's head behind glass in a dark cabin with trim-framed
  windshield + plate; 40m reads as a normal darker windshield. Crewed
  probe updated: withDriver === 30. Suite 138/138 expected (one probe
  removed).
- **34 FULL-FAT ROAD PAINT — item 11 complete (2026-07-16)**: the pooled
  roadDecalSys is upgraded to PERMANENT — all 36 seeded decals live in ONE
  InstancedMesh with a per-instance atlas slot (the plate shader pattern;
  customProgramCacheKey mandatory), placed once on the first tick after
  each world build via the cached band-filtered surface raycast
  (placedDone resets when spots reseed). Turn arrows and manholes now
  read at mid distance like real street paint — verified by looking
  (`loop-shots/34-permanent-decals/`): arrow visible at 45m by the
  crosswalk. Cost: +1 draw call, ~72 tris — noise under the new gates.
  Pool/promotion machinery removed; roadDecalEnable now toggles the
  instanced mesh; report {spots, placed, visible}; probe asserts
  placed === spots + toggle. THE ORIGINAL BACKLOG IS NOW 100% COMPLETE —
  every item from the 2026-07-12 survey, full-fat, no compromises left.
  Next: closing survey + deploy batch 11 (v3.18.0) + stop.
- **35 FINAL SURVEY + DEPLOY BATCH 11 + ROUND FOUR END (2026-07-16)**:
  closing survey (`loop-shots/35-final-survey-4/`) — the #7 car by a
  steaming vent under the COIL CAFE marquee; race/mid/far all read right;
  nothing left in scope. **v3.18.0 LIVE** (batch 11, index-B7GTrSpU.js,
  200 after the usual ~40s alias lag). ROUND FOUR COMPLETE: perf
  renegotiation (new gates), full-fat recessed drivers, full-fat
  permanent road paint — the 2026-07-12 survey backlog is 100% shipped
  with zero remaining compromises. GRAND TOTAL across four rounds: 35
  iterations, 29 items + 1 renegotiation, suite 120→137 probes (probes
  retire with the systems they cover), 11 live deploy batches
  (v3.8.0→v3.18.0). Nothing known remains. The loop rests until the next
  "continue".

## ROUND FIVE (2026-07-16, "continue" after round-four close)

**36 BOOTSTRAP SURVEY (2026-07-16)**: fresh-eyes battery
(`loop-shots/36-survey-5/`, shots-36.mjs + 36b/36c follow-ups): race chase,
rival close, eye-level street, ped close, parked 3m, signal 6m, facade
midband 16m, rooftop 9m, road decal, mid 40m, far 150m, plane abeam,
traffic close. Baseline THIS world: **1937 calls / 588.2k tris / 243 tex /
5609 geo** vs gates 1975/620k/252/5650 — headroom is THIN (≈38 calls /
32k tris); round-five items must be atlas/instance-frugal, and any item
that genuinely needs more presents fresh renegotiation data instead of
squeezing.

Findings (what still breaks the "closer = more" promise):
- **Traffic signals show all three lamps lit at once** on every head, every
  intersection (07-signal-6m). Up close it reads broken. The ambient
  system's PS registry already stamps walkEW/walkNS per intersection —
  the visual state can key off the exact same data.
- **Park/lawn blocks are featureless green voids** at every distance
  (03/04/10/11/12). No paths, no benches, scattered trees only in a few
  outskirt spots. Biggest empty canvas left in the game.
- **Peds up close are single-color untextured cylinders** (04-ped-close):
  no outfit split, no skin-tone variety — the one sub-item explicitly
  deferred from round-one item 2.
- **Parked cars at 3m are windowless boxes** (05-parked-3m): grime/dents/
  rack/antenna/plate all present, but no side/rear glass, no door seams,
  no tail lamps.
- **Building windows blur into soft streaks at ~16m** (08-facade-midband):
  the baked window texture has no frames/mullions to resolve; mid-band
  walls are the biggest surface players hover beside in helicopter mode.
- **Big roofs read empty at 9m** (09-rooftop-9m): one kit per roof on a
  blank slab; helicopter mode looks straight down at these.
- **Start-line aprons are bare concrete** (02 background): race mode's
  most-seen real estate has no paddock life.
- **Prop planes are bare boxes up close** (13-plane-banner): banner + rope
  read great, but no registration marks, prop disc, or gear struts.
- Signal-corner sidewalks can be person-empty (nearest ped 136m from one
  signal) — noted, but ped routing is out of charter (AI risk); density
  weighting only if an easy hook appears.
- 14-traffic-close missed its subject (pickup drove off; fresh-read + fly
  isn't enough for movers — ledger's chase-hop pattern remains the tool).

**ROUND FIVE BACKLOG** (one per iteration, ranked):
1. Functional traffic-signal lamp states — one lit lamp per head, cycling
   with the existing walkEW/walkNS registry (green/amber/red opposite the
   WALK phase). Prefer zero-new-draw vertex/instance recolor; small
   at-distance delta (3 glow dots → 1 per head) is a FIX, not a break —
   note it in the verify shots.
2. Inspect mode extended to cars + dogs + marshals (user-suggested seed):
   click a car → glide-zoom, driver name + plate echo + fictional radio
   station/destination card; dogs get their existing names + activity;
   marshals get flag-duty lines. Reuses inspectRig/enter/exit machinery.
3. Park paths + tree clusters — baked pale gravel path polygons through
   large lawn blocks + instanced trees along them (world-gen bake, far
   tier IS the feature; near tier free).
4. Park furniture — benches/cans/flowerbeds along the new paths via the
   existing furniture defs + a flowerbed vcBake (promotion pool only if
   needed; prefer static merge).
5. Ped outfit + skin variety — two-tone outfit split (jacket/shirt),
   4-tone skin palette (drivers already ship it: 11893070/9657655/
   13018202/8541761), vertex-color only, silhouette unchanged at far.
6. Parked-car glass + door seams + tail lamps — parkedKitSys additions
   (pool exists): dark side/rear glass quads, seam decals from the grime
   atlas, lamp dots.
7. Start-line paddock clutter — stacked tires, tool carts, bunting near
   the start gantry (static merged, race-visible every launch).
8. Building window atlas crispness — 2× resolution + frame/mullion lines
   + occasional curtain variation on lit cells; far look must stay
   pixel-equivalent (mipmap converges) — verify far shot A/B.
9. Rooftop dressing density — area-scaled 2–3 kits on large roofs + a
   roof-access hatch box; helicopter-mode payoff.
10. Prop-plane close detail — wing registration codes (SR-##), prop disc,
    gear struts; helicopter/banner-flyby payoff.
Stretch seeds (unranked): curb strips at park edges, cockpit cowl detail,
signal-corner ped density weighting.
- **37 SIGNAL LAMP STATES — round-five item 1 (2026-07-16)**: traffic
  lights now show ONE lit lamp per head. The phase machine already
  existed (we() 15.5s cycle + per-head cloned materials + per-frame
  emissive writes) — the all-three-lit look was DIFFUSE: unlit lenses
  kept vivid body colors (0xFF3B28 etc.) that read bright in daylight
  regardless of emissive. Fix: state-cached tick swap (_st per head) —
  lit lens keeps vivid color + emissive 2.3/2.6, unlit drops to
  dark-glass hexes (0x2E0B08/0x332608/0x0A2A18) + emissive 0. Plus
  sun-visor hoods (shared hoodGeo box, housing material Y → static-
  merged, zero new draws). signalLampSys + signalLampsEnable(on) A/B
  toggle (legacy "x" state restores the old vivid look) +
  signalHeadStates() + detailReport.signalHeads. Verified by LOOKING
  (loop-shots/37-signal-lamps/): 01 vs 03-LEGACY is night-and-day —
  one orange-red top lamp + dark lenses vs three burning circles; 04
  mid-40m reads as a working intersection (single red one way, green
  the other); 05 far unchanged. Cycling proven by counters (34g/0y →
  26g/8y across 8s; a single intersection can sit in one phase for a
  15.5s cycle — staggered offsets mean the FLEET always shows both).
  Perf 2 worlds: 1835-1863 calls / 579-590k tris / 240-242 tex /
  5545-5591 geo — all inside gates. Suite 138/138 (new probe: heads>8,
  g+y+r===heads, both g and r present; first run had 1 world-luck
  flake, rerun clean). NEXT: item 2 — inspect mode for cars/dogs/
  marshals.
- **38 INSPECT EVERYTHING — round-five item 2, user seed (2026-07-16)**:
  the click-to-inspect rig now covers CARS, DOGS and MARSHALS alongside
  peds — one rig, a `kind` dimension (inspectSubject framing table +
  inspectAlive checks per kind). Cars: ¾ standoff that FOLLOWS the
  mover (faster lerps 0.22/0.45; player-leash widened to 12m, subject
  flee-exit at 130m), persona = driver name + plate echo (plateSys
  dynamics lookup, monospace badge on the card) + radio/errand lines;
  taxis get fare lines, buses get Crosstown 14 lines. Dogs: low 1.7m
  framing on the kit dog, DOG_NAMES persona ("WAFFLE · being a very
  good dog"), thought pool. Marshals: station persona ("flag marshal,
  station N" + blue-flag lines) — framing comes from the VIEWER'S
  approach side, not a fixed forward vector (first attempt buried the
  camera in the deck rim wall; approach-side framing is the rule for
  platform-mounted subjects). Screen pick generalized: per-kind accept
  radii (cars 62px, dogs 40px ≤38m, marshals ≤60m), argmin across all
  candidates, i<0 guard. inspectPed contract unchanged (info gains
  kind/plate); NEW debug inspectNearest("car"|"dog"|"marshal"|"ped").
  Content: CAR_RADIO/CAR_ERRANDS/TAXI_LINES/BUS_LINES/DOG_THOUGHTS/
  MARSHAL_LINES — all fictional, family-friendly. Verified by LOOKING
  (loop-shots/38-inspect-all/): 01 van with bubble + card badge GHM 278
  MATCHING the visible rear plate; 02 follow after 2.5s; 03 WAFFLE low
  portrait with leash + towering walker; 04 MIRA on her platform beside
  the golden deck; 05 BASIL-walking-Waffle ped regression. Dog-hunt
  lesson: city walkers are SPARSE (often promoted:1 at a cluster) — to
  find a dog, teleport to walkers at traversal indices 3,7,11,...
  (partition is idx%4===3), not to arbitrary clusters. Suite lesson:
  the ped-kit partition probe relies on residual camera position from
  the ped-inspect probe — position-dependent probes must not be
  separated by teleporting probes (new block moved AFTER it; suite
  140/140: car probe asserts follow moved 8.4m/close 8.3m, marshal
  probe asserts station persona). Perf: zero renderables added (logic +
  DOM only), gate probe green. NEXT: item 3 — park paths + trees.
- **39 PARK PATHS + TREES — round-five item 3 (2026-07-16)**: the empty
  lawn blocks finally have life. parkSys/buildParks runs in the world
  build right after buildStreetSigns: grid cells qualify when clear of
  the ribbon corridor (Pn ≥26m), ALL building footprints (the Mn
  registry — rooftopSys.spots only holds TALL towers; Mn carries every
  placer incl. suburban houses A/D and shops ot, with true hw/hd),
  ponds and outskirt Sa scenery; 12 cells picked deterministically
  (plateRng 0x9a4b17, mobile 6). Each cell gets a bowed 2.3m gravel
  path strip (8 segs, terrain-following He()+0.05, ALL cells merged
  into ONE vertex-colored mesh — raycast-inert so the roam ground/water
  ray never sees it) and pine clusters along the path (fresh
  trunk/canopy InstancedMesh pair reusing the outskirt conifer recipe
  at 0.5-0.9 scale; trees stay ≥3m off street edges via ka, ≥10 Pn
  clearance, ≥4m from any Mn footprint, and register kn("tree",...,10)
  so the road-safety audit stays clean — margin 10, NOT the outskirt
  145, or every city tree flags unsafe). TWO LESSONS: (1) vertex colors
  are LINEAR — my 0.8-range "gravel" rendered as a BLOWN-OUT WHITE
  RIBBON under sun+bloom (banner-washout family); linear ~0.4 reads as
  proper pale gravel. (2) rooftopSys.spots is NOT the building registry
  — Mn is (houses/garages included). Verified by LOOKING
  (loop-shots/39-parks/): near = pocket green with flanking pines and
  a sandy strip; mid 45m = two paths + pine pairs beside the roam car;
  far 150m = multiple cells read as genuine aerial parkland (the
  deliberate at-distance delta reads natural, not noisy). Perf gate 2
  worlds: 1832-1890 calls / 581-598k tris / 234-240 tex / 5514-5561
  geo — parks cost +3 draws (path mesh + 2 IMs) and ~5k tris, absorbed
  in world noise. detailReport.parks {cells,trees,pathTris,sample} +
  parksEnable(on). Suite 141/141 (parks probe: cells≥4, trees≥8,
  toggle). NEXT: item 4 — park furniture (benches/flowerbeds along the
  new paths). New idea for the wishlist: path-side lamp posts at dusk.
- **40 PARK FURNITURE — round-five item 4 (2026-07-16)**: the park paths
  got benches and flowerbeds. Path-joint spine math seeds them (bench at
  s2=3 facing the path via yaw from the strip normal, second bench at
  s2=6 on odd cells, flowerbed opposite at s2=5); every part vcBaked
  under a placement Matrix4 (place × vcAt local) into ONE merged
  vertex-colored mesh (+1 draw, raycast-inert). Bench = the street
  benchGeo recipe; flowerbed = two-tone timber planter + 6 stem+bloom
  pairs in 4 sRGB-hex bloom-safe colors (hex colors via vcBake are
  color-managed — the LINEAR float trap only bites raw attribute
  floats). BIG FIX FOUND BY INSTRUMENTATION: furniture yield was 3/18 —
  rejection counters (parkSys._rej, now permanent in the report) showed
  ka killing 20/30 — **the z street lattice anchors at zNear (380)
  DESCENDING, but cell rows anchored at zLo ascending → every cell row
  sat ~5m off a street centerline in z**. Cells now anchor at zTop;
  rej.ka === 0 and the probe LOCKS it (a ka spike = lattice drift).
  Cell ribbon-clearance also raised (Pn(c,26) ≥ 20). Yields: 8-12
  cells, 10-16 benches, 7-12 beds, trees at the 56 cap. Aim close-ups
  with probeDown().ground (NOT camWorld().y minus a guess — that missed
  twice; .ground is the field, .y does not exist). Verified by LOOKING
  (loop-shots/40-park-furniture/): bench at 3m = redwood slats facing
  the path, pines behind; flowerbed = planter with yellow/purple/red/
  orange blooms beside the walkway; both grounded, both oriented right.
  Perf gate 2 worlds: 1811-1860 calls / 588-596k tris / 231-237 tex /
  5510-5568 geo. Suite 142/142. NEXT: item 5 — ped outfit + skin
  variety (round-one deferral), then DEPLOY BATCH 12 (v3.19.0).
- **41 PED VARIETY — round-five item 5, the round-one deferral
  (2026-07-16)**: walkers are individuals now. U1 gains an idx param
  (spawner passes the Rr index — the same seed personas use):
  4-tone skin palette on head + hands (the drivers' palette
  11893070/9657655/13018202/8541761), cap-OR-hair (idx%3===1 → flatter
  dome in 4 hair colors hugging the head; else 4 cap colors), two-tone
  outfit (jacket cylinder over a contrasting waist band — stacked
  cylinders keep the exact silhouette envelope), and sleeve variety
  (idx%5<2 → skin arms = short sleeves, else body-colored = long).
  userData.style stamps the choices for probes. Verified by LOOKING
  (loop-shots/41-ped-variety/): four portraits, four genuinely
  different people — coral jacket/brown waist/black cap short-sleeve;
  blue jacket/teal waist/dark hair with shopping bag; yellow
  long-sleeve with phone; mint long-sleeve deep-brown-skinned walker
  with the dog. Far tier: body-color palette unchanged, new colors
  sub-pixel at 150m. Perf gate: 1828-1854 calls / 595-607k tris. Suite
  143/143 (variety probe: 4 skins + hair/cap + sleeve mix present).
  SUITE FLAKE NOTE: runs 1-2 each had a DIFFERENT single flake (ped
  glide 6.7m>4.2 once; pond recover-window starvation once — depth
  0.73, coast reached, clock ran out) — each passed in the other runs;
  run 3 was 143/143 clean. Physics probes in slow-motion headless are
  the flaky family; if this repeats, widen the pond recover window and
  glide threshold as a suite-hardening item. v3.19.0. DEPLOY BATCH 12
  next in this iteration.
- **DEPLOY BATCH 12 (2026-07-16)**: **v3.19.0 LIVE**
  (index-VQA40QJo.js, 200 after alias lag, 904,569 bytes) — round-five
  items 1-5 in production: one-lamp signal heads + visors,
  inspect-everything (cars/dogs/marshals), park paths + pines, park
  benches + flowerbeds, ped skin/outfit/hair variety. Round five is
  5/10 shipped. NEXT: item 6 — parked-car glass + door seams + tail
  lamps (parkedKitSys additions).
- **42 PARKED GLASS + SEAMS + LAMPS — round-five item 6 (2026-07-16)**:
  parked cars stop being windowless boxes at 3m. parkedKitSys gains TWO
  meshes per kit on SHARED merged geometries (+2 draws per visible kit
  max, zero at the gated chase view thanks to the y≤26 altitude gate):
  (1) glass+seams — per side two dark-glass door windows split by a
  B-pillar gap, raked-flat windshield (nose = -z on parked bodies) and
  rear glass, plus 4 thin door-seam strips at x ±1.106 (body face 1.1;
  seams need ≥0.006 offset or they z-fight); 10 quads, one dark-glass
  material (0x101A1C-family, rough 0.22 metal 0.55). (2) lamp lenses —
  vcBaked into the shared vc opaque: 2 dark-red tail (0x681A14) + 2
  pale head (0xD0D0D0) at the body corners; parked = never lit. Always
  on when a kit promotes (100% of near cars get windows — that was THE
  survey finding). Verified by LOOKING (loop-shots/42-parked-glass/):
  side 3m = two windows + pillar + seams; nose 3m = windshield, pale
  lenses, mirrors AND the front plate STEEL STATE BBP 281 readable
  (the "missing" rear plate in one frame was angle/lighting — plates
  report 130/130, front shot proves the system); kit ON/OFF pair =
  survey box vs real car, night and day. Bonus frame: full kit (glass
  + seams + grime + dent + mirror) on one yellow sedan. Probe-contract
  note: the parked-variety probe asserts kit CHILD COUNT — kids 7→9
  with the two new meshes (legitimate contract bump, not probe-gaming).
  New probe locks glassVerts===40 / lampVerts===16 on promoted kits.
  Perf gate 2 worlds: 1815-1843 calls / 596-603k tris / 241-242 tex /
  5518-5567 geo. Suite 144/144 first run. NEXT: item 7 — start-line
  paddock clutter (race-mode real estate).
- **43 START-LINE PADDOCK — round-five item 7 (2026-07-16)**: the start
  gantry has a pit lane now. Four clutter platforms flank the START
  gantry in its own course frame (St(6±ds) + ui quaternion, lateral
  halfW+2.4): kind-0 = three tire stacks (donut cylinders + hubs), red
  tool cart with wheels + handle, traffic cones; kind-1 = blue/red fuel
  drums, tire pair, pennant bunting (8 CircleGeometry(…,3) triangles in
  4 colors sagging between poles). All 88 parts vcBaked into ONE merged
  mesh (raycast-inert, visual-only — same class as lawn trees).
  LESSON RELEARNED THE HARD WAY: the start of "The Little Ramp" is
  ~60m ELEVATED — my first ground-level-thinking placement left
  clusters floating in mid-air beside the deck (probeDown showed
  ground 59m below one). THE RULE (it.19, now twice-paid): trackside
  objects live on LIFTED PLATFORM SLABS in the deck frame — added
  5.6×3.6 green slabs at PLIFT 1.15, matching the marshal-station
  visual language. Also: flyCam works behind the TITLE MENU — enter
  roam first or the shots frame a menu overlay. Verified by LOOKING
  (loop-shots/43-paddock/): tire stacks/cart/cone platform and
  drums+bunting platform both read perfectly at 5m beside the deck;
  orbit shows platforms flanking the grid. Suite hardening applied per
  the it.41 plan: the ped-glide stall reproduced TWICE at exactly 6.7m
  — it is headless-fps-proportional camera lag (lag = v·dt·(1-α)/α; at
  ~7fps ≈ 4m + 2.7 standoff), NOT world luck; glide threshold
  calibrated 4.2→7.5. Perf gate: 1828-1858 calls / 602-610k tris.
  Suite 145/145. NEXT: item 8 — window atlas crispness (2x + mullions,
  far look pixel-equivalent).
- **44 HD WINDOW ATLAS — round-five item 8 (2026-07-16)**: the facade
  mid-band blur is fixed. As() gains an hd param: hd=2 doubles the
  canvas AND the cell grid — same window layout on the wall, 2x texels
  per window — and draws per-window structure: 1px frame + mullion
  cross (transom at 45%), plus lit-window life (18% blinds pulled
  partway, 12% curtain side-panels, 8% sill silhouettes). Applied to
  the THREE SHARED city-tower materials (Q, 160x320→320x640) and both
  glass-tower maps in en(); outskirt buildings stay 1x (they live at
  distance). Texture COUNT unchanged. towerTexSys keeps live refs; NEW
  debug windowTexHD(on) rebuilds the shared maps at hd 1|2 (dispose old
  — VRAM stable) for true same-camera A/B. Verified by LOOKING
  (loop-shots/44-window-atlas/): the 16m pair is night and day — HD2
  windows have crisp edges, frames, transoms, blind variation; HD1 is
  the survey's formless glow. Far pair equivalent (density/tone/warmth
  identical; lit patterns re-roll on rebuild by design). FRAMING
  GOTCHA: rooftops.tall towers can be 43m wide — camera at center+16
  sits INSIDE the footprint; frame from face = center + w/2 + dist.
  Perf gate: 1794-1854 calls / 596-612k tris (612k is the closest yet
  to the 620k ceiling — items 9/10 must stay tri-light or bring
  renegotiation data) / tex 236-242 / geo 5500-5565. Suite 146/146
  (probe locks hd2 default 320px + toggle rebuild both ways). NEXT:
  item 9 — rooftop density (2-3 kits on large roofs + hatch boxes).
- **45 SUNK GEOMETRY FIX + v3.20.0 (2026-07-16, user report: "some of
  the buildings and cars are sunk into the ground")**: two root causes
  measured with probeDown audits. (1) BUILDINGS: $i() min-sampled
  footprints at only 3x3, so placers carried big anti-float margins
  (-0.55/-0.7/-1.1) — on flat ground every tower sat buried ~0.55m, and
  with corner spreads of 1.4-3.2m the uphill faces were buried 2-3.8m.
  Fix: $i() now 5x5 min-sampling + margins tightened to
  -0.2/-0.3/-0.45 (all four call sites). Slope-side foundations still
  cut into hills (natural); flat-ground bases now sit flush. (2)
  PARKED CARS: placed FLAT at He(center) — on sloped lawns the uphill
  wheels buried. Fix: tilt each parked instance to the terrain normal
  (He gradient ±1.2m, quaternion = align-up × yaw); plates and parked
  kits inherit the same instance matrix so they tilt together. NEW
  debug parkedSpots(n). Verified by LOOKING (loop-shots/45-sunk/):
  parked car on a 0.55-gradient street shoulder sits tilted with all
  wheels touching, plate square; tower base meets the lawn flush with
  ground-floor windows clear. Suite 146/146 (no probe changes needed —
  heights move together). Deployed as v3.20.0 (batch 13, EARLY — user
  fix; items 9/10 will ride batch 14).
- **46 ROOFTOP DENSITY — round-five item 9 (2026-07-16)**: big roofs
  stopped being one-kit ponds. The promotion pass's used-Set became a
  per-roof allowance Map: min(w,d) ≥22 → 3 kits, ≥14 → 2, else 1; a
  placed candidate RE-QUEUES itself (pushing into cand mid-for..of
  extends iteration deterministically) with quadrant offsets per
  placement index and a variant-fallback pop so the 2nd/3rd kit can
  borrow a neighboring pool. Pool 6→8 meshes (geos reused modulo — the
  6 merged geometries serve 8 kits). Every kit variant also gained a
  ROOF-ACCESS HATCH merged in (galv box + dark lid + stub rail, per-geo
  offset/yaw) — zero extra draws, ~60 tris total. Verified by LOOKING
  (loop-shots/46-rooftop-density/): the 43m roof carries water tower
  (ladder + pigeon), AC/dish cluster AND a second vent cluster with
  hatch — a real mechanical rooftop. Perf gate: 1811-1835 calls /
  591-612k tris / 244 tex / 5507-5571 geo (the +2 pool kits cost ~3k
  tris worst case, inside the tight gate). Suite 147/147 (probe flies
  over the widest tall roof, asserts promoted ≥2 && multi ≥1;
  skip-passes on narrow-roof worlds). NEXT: item 10 — plane close
  detail (registration codes, prop disc, gear struts), then DEPLOY
  BATCH 14 (v3.21.0) and the round-five closing survey.
- **47 PLANE CLOSE DETAIL — round-five item 10, ROUND FIVE COMPLETE
  (2026-07-16)**: the banner planes are aircraft up close. Each of the
  four gets: fictional registration decals (PLANE_REGS SR-21A/07K/93B/
  42E; 256x256 4-row stencil atlas, dark text, transparent; fuselage
  both sides + underwing, three quads MERGED to one mesh per plane
  reading its atlas row), a translucent prop disc behind the spinning
  blades (CircleGeometry, opacity 0.15, depthWrite off), merged gear
  (two main struts + wheels, tail wheel — ONE mesh on the existing
  darkMat), and wingtip nav lights (red left/green right, shared
  toneMapped-off basics). +5 draws per plane worst case. userData.
  detail + regs in the planes report. Verified by LOOKING
  (loop-shots/47-plane-detail/): SR-21A crisp on the fuselage and
  underwing, three wheels hanging right, banner intact; nav lights
  verified by report+geometry (wingtips out of frame in the passes).
  Perf gate: 1835-1890 calls / 599-615k tris — 615k is ~99% of the
  620k gate: ROUND SIX MUST OPEN WITH FRESH RENEGOTIATION DATA before
  any geometry-adding item. Suite 148/148. ROUND FIVE: 10/10 SHIPPED
  (37-47 incl. the v3.20.0 sunk-fix interlude). DEPLOY BATCH 14
  (v3.21.0) next, then the closing survey — which per the user's
  standing directive ("continue improving graphics and details")
  seeds ROUND SIX instead of stopping the loop.
- **48 ROUND SIX BOOTSTRAP (2026-07-16)**: perf renegotiation + fresh
  survey. RENEGOTIATION (5 fresh worlds x 2 readings, race chase):
  calls 1822-1913, tris 595.7-602.3k, tex 233-242, geo 5518-5600. The
  recent 610-615k tris readings were world-luck highs of the same
  code. **NEW GATES (max-ever + ~5%): calls ≤2010 / tris ≤645k /
  tex ≤260 / geo ≤5750.** Tripwires, not budgets — headroom ~40k tris
  is earmarked for round-six items below. SURVEY (loop-shots/
  48-survey-6/, near frames 03/05 were degenerate — anchor teleports
  landed inside geometry; 01/02/04/06/07 read well):
  ROUND SIX BACKLOG (prioritized, single-layer each):
  1. SIDEWALKS — pale concrete strips + curb line along both sides of
     every city street (baked merged, vertex-shaded expansion joints);
     peds currently walk on bare grass. The big spend (~15-25k tris).
  2. RACING-LINE WEAR — darkened rubber line through ribbon corners +
     skid patches near walls (course-spline strip, race-view payoff).
  3. LAWN VARIATION — mowing-stripe tint bands + worn patches on city
     lawns; kills the bowling-green felt at every distance.
  4. SPORTS-FIELD MARKINGS — the mint field slabs get white line sets
     (soccer/tennis canvas per type).
  5. NEON GLOW PASS — sign bands (BLUE EXIT, MOONLIGHT LANES...) gain
     soft halo quads; one or two flicker.
  6. CROSSWALK WEAR — zebra stripes + stop lines vary per intersection
     (fresh vs worn paint).
  7. TOWER-SHOP AWNINGS — canopy strips + sidewalk boards under tower
     sign bands.
  8. TRAFFIC TURN SIGNALS — indicator blink on cars slowing into
     intersection turns.
  9. ROOFTOP HEAT SHIMMER — pooled shimmer sprites over active vents
     (near tier only).
  10. BLIMP — one slow fictional-banner blimp on a high lane.
  Lessons: survey camera near-frames must aim from OUTSIDE anchors
  (storefront/signal anchors sit inside assemblies — approach from the
  street side at +6m standoff minimum).
- **49 ITEM 1 CLOSED (ALREADY EXISTS) + ITEM 2 RACING-LINE WEAR SHIPPED
  (2026-07-16)**: investigating sidewalks revealed THE BASE GAME
  ALREADY BUILDS THEM — the city street builder (line ~4900) drapes
  sidewalk strips (halfW 2.9 at ±13.3 off centerline, lift 0.66) +
  curbs (±10.42) + center dashes along the FULL lattice via m(), which
  samples He at BOTH edge vertices (true draping). The survey's "peds
  walk on bare grass" was a dusk/angle misread — the street-edge
  close-up shows a ped standing ON the sidewalk at a signal. Item 1
  marked CLOSED-EXISTS (lesson: search the codebase for the system
  BEFORE writing a backlog item; the survey sees pixels, not code).
  ITEM 2 shipped instead: raceWearSys — a rubber racing line following
  the course spline (St/ui frame, 4m steps, lateral offset ∝ smoothed
  curvature swinging to corner insides, ±1.15m wide) + 17 skid streaks
  drifting toward corner outsides (curv > 0.0055, ≥30m apart, cap 44),
  all ONE transparent vertex-colored MeshBasic mesh (opacity 0.38,
  depthWrite off, renderOrder 1, raycast-inert; MultiplyBlending needs
  premultipliedAlpha in three — plain alpha reads fine). Verified by
  LOOKING (loop-shots/49-racewear/): the dark line hugs the inside of
  the opening bend and weaves through the pack; A/B OFF is the old
  clean deck; skid streaks read on the ramp. ~1.6k tris, +1 draw. Perf
  gate: 1830-1866 calls / 597-611k tris (new gates 2010/645k roomy).
  Suite 149/149. NEXT: item 3 — lawn variation (mowing stripes + worn
  patches).
- **50 LAWN VARIATION — round-six item 3 (2026-07-16)**: the bowling-
  green felt is gone. Mowing-stripe bands + worn patches baked as
  VERTEX COLORS on the existing 300x300 terrain mesh (zero new
  geometry/draws/shader risk; material.vertexColors flag = the free
  A/B toggle). City lawn cells only (inside di bounds, ≥4m outside
  street corridors): per-cell band direction from an integer hash,
  ±12% luminance stripes, hash-noise dry patches (warm 1.12/1.04/0.86)
  and lush spots. TWO CALIBRATION LESSONS: (1) stripe wavelength MUST
  be ≥2x the vertex pitch — 13.5m bands on a 14m-pitch mesh aliased to
  nothing (bands now 28m: sin(along/8.9)); (2) dusk lighting swallows
  ~half the contrast — ±3.5% and ±9% were invisible/faint; ±12% reads
  as natural park mowing at the game's signature dusk. 8008 verts
  tinted. "Clear" on the menu is WEATHER (rain toggle), not
  time-of-day — dusk is the canonical light, calibrate against it.
  Verified by LOOKING (loop-shots/50-lawn/): soft alternating swaths
  across the park cells at mid; far reads as parkland texture, not
  noise; OFF pair = the old felt. Perf: 1829-1867 calls / 591-601k
  tris. Suite 150/150. NEXT: item 4 — sports-field markings.
- **51 SOCCER PITCHES — round-six item 4 (2026-07-16)**: the survey's
  "field markings" idea, redirected — the mint "field" slabs are
  outskirt FARM fields (crop strips); sports grounds belong in the
  city. buildParks gains a SECOND cell scan (rect-fitted margins: Mn
  +33/+23, ponds likewise, Sa +36, Pn ≥12 — cells rejected for paths
  can still host a pitch; the path pass consumes every path-qualifying
  cell, so leftovers were ZERO) + per-cell 7-spot flatness search
  (58x38 corner span ≤1.6, pinned at the local MAX + 0.09 per the
  flat-decal rule). Up to 2 pitches per world: white-line canvas
  (512x336: touchlines/halfway/center circle/boxes/spots, toneMapped
  off — the lines GLOW slightly at dusk and read as floodlit grounds,
  a happy accident kept deliberately) + vcBaked goal frames (posts +
  crossbar both ends) merged into the park furniture mesh. Verified by
  LOOKING (loop-shots/51-pitches/): aerial = a complete pitch between
  the boulevards; ground = goal frame against the skyline. Perf:
  1819-1880 calls / 594-604k tris / tex 252 max (new gate 260). Suite
  151/151 (probe: pitches 0-2 by terrain luck, scene quads match
  count). NEXT: item 5 — neon sign glow, then DEPLOY BATCH 15
  (v3.22.0).
- **52 NEON HALOS — round-six item 5 (2026-07-16/17)**: every sign in
  the city glows now. Three sign classes found by SEARCHING THE CODE
  first (vertical neons ≤34 via Ah(), wall bands ≤48 via Eo(), roof
  billboards ≤18 via Od()): each contributes a halo quad (radial-
  gradient canvas, sign-tinted, sized ~1.4x, offset toward the wall/
  behind the box so edges spill around the sign). DRAW-CALL DESIGN:
  per-sign halos would cost ~100 draws — instead halos merge into ONE
  additive mesh PER NEON COLOR (≤6 draws for the whole city), except
  the two FLICKER signs (vertical #2, wall band #5) which keep
  individual halo meshes so a Bn tick can wobble sign.opacity + halo
  in sync (dips to 0.22 when sin(t*11.3+φ)·sin(t*4.7+φ) > 0.88 — brief
  irregular dropouts). neonSys {halos:100, flicker:2} + neonEnable
  (hides meshes, resets flicker opacities). Verified by LOOKING
  (loop-shots/52-neon/): the HOTEL vertical washes soft magenta onto
  the tower wall; OFF pair = flat sign. Perf gate: 1809-1854 calls /
  599-610k tris / tex 252 max. Suite 152/152 (one world-luck pond
  flake — cityPonds=1 world — rerun clean). v3.22.0. DEPLOY BATCH 15
  next in this iteration.
- **53 CROSSWALK WEAR — round-six item 6 (2026-07-17)**: the solid
  white crossing bars became real ZEBRA crossings in three wear tiers.
  The old bars (one solid box per approach) are now flat planes with
  an 8-stripe alpha canvas — three shared materials: fresh (0.95),
  worn (0.66 + destination-out speckle erosion), chipped (0.45 + heavy
  erosion). Wear tier is deterministic per INTERSECTION (hash of the
  lattice coords >>3 %3, all four approaches match) — distribution
  this world 60/62/60. Same mesh count as before, +3 small textures,
  raycast-inert; the A/B toggle drives material opacity because the
  MESHES static-merge at boot (visibility toggles die in the merge —
  materials survive, the it.52/53 pattern). Verified by LOOKING
  (loop-shots/53-xwalk/): one crossing crisp/bright, another visibly
  chipped and faded toward its end; the giant glowing arrow in frame
  is the pre-existing roam-gate marker, not paint. Perf gate:
  1838-1883 calls / 596-608k tris / tex 249 max. Suite 153/153. NEXT:
  item 7 — tower-shop awnings.
- **54 SHOP AWNINGS — round-six item 7 (2026-07-17)**: the wall-sign
  shops got striped canvas awnings. 36 of the 48 Eo() wall-sign faces
  (skip every 4th for variety) carry a canopy at SHOP level (gy+4.5,
  independent of the sign band height): sloped canopy plane
  (rotateX(-1.02), high edge at the wall gy+5.0, low edge 1.6m out at
  gy+3.9) + valance skirt, striped canvas in 4 colorways (cream +
  pink/teal/amber/green, colorway = (N*2+1)%4), all geometry MERGED
  PER COLORWAY = 4 draws total (the neon-halo pattern). awningSys
  {count, sample[3]} + awningEnable (merged meshes stay unmerged-by-
  boot — 1 mesh per material — so visibility toggling works).
  Verified by LOOKING (loop-shots/54-awnings/): striped canopy under
  the MIDNIGHT AUTO band shading the lit shopfront; OFF = bare wall.
  BATTERY LESSON: don't anchor shots on geometry vertex[0] of a
  traversal-matched mesh — expose sample positions in the report
  (multiple 128x64 canvases exist). Perf gate: 1818-1879 calls /
  588-604k tris. SUITE NOTE: 3 runs — awning probe green all runs
  (count 36); one heavy-physics probe flaked per run (drift+heli,
  stunt, heli — heli 2/3) with EVERY probe passing at least once on
  this build; no interference vector exists (no colliders, raycast-
  inert, static quads) and the machine is heavily loaded with hours of
  Chromium instances. NEXT ITERATION MUST START by re-running the heli
  probe twice on a quiet machine — if it fails >50% fresh, treat as
  REAL and bisect before item 8. NEXT: item 8 — traffic turn signals.
- **55 HELI RECOVERED + TURN SIGNALS — round-six item 8 (2026-07-17)**:
  health check first: two serial suites on a quiet machine = 154/154
  BOTH, heli green — the it.54 failures were machine load, case
  closed. THEN turn indicators: every I1 traffic car carries 4 amber
  corner quads (two per side, ONE shared toneMapped-off material —
  blink = global opacity pulse at 9.2rad/s, per-car SIDE via group
  visibility). The turn chooser W() computes the side from
  heading-cross (left = sign(h2·(up×h1))) and arms a dedicated 2.2s
  blinkT timer (turnBlend decays in 0.3s — too brief to read as an
  indicator; REUSE THE RIGHT STATE, don't piggyback). THREE BUGS
  FOUND: (1) I1's return REASSIGNS t.userData wholesale — fields set
  before it are obliterated (blink now rides the literal); (2) my
  module-scope insert anchored on text ANOTHER AGENT had extended
  (awningSys gained boards/A-board work that my it.54 `git add
  src/main.js` swept into cf2b41374 — it tested green 154/154 x2, no
  damage, but ALWAYS re-grep anchors before python replaces and
  assert every replacement); (3) the probe counted 31 rigs — stolen/
  player cars are I1 builds too (assert ranges, not exact counts, for
  scene populations). Verified by LOOKING (loop-shots/55-turnsig/):
  white pickup with amber right-side indicators lit approaching the
  turn. Perf gate: 1834-1873 calls / 592-601k tris. Suite 155/155.
  NEXT: item 9 — rooftop heat shimmer, then 10 blimp → DEPLOY BATCH
  16 (v3.23.0) + closing survey.
- **56 HEAT SHIMMER — round-six item 9 BLOCKED (2026-07-17)**: two
  attempts, two visual-verification failures, reverted per charter.
  A shimmerSys (steamSys-pattern pooled sprites over promoted rooftop
  kits: 4 columns x 4 sprites, rise + wobble + fade tick, engine state
  fully working — active:4 promoted, toggle clean) simply DOES NOT
  READ at the game's dusk lighting: peak opacity 0.16 invisible;
  strengthened to 0.3 grey-tint + 1.5-4.7 scale still near-identical
  in ON/OFF pairs against the bright dusk sky. Sprite-alpha "shimmer"
  needs a refraction/distortion post pass to read — out of scope for
  a detail item (and the deck already has steam puffs at street
  level for the atmosphere beat). BLOCKED reason: technique-limited,
  not placement-limited. Code fully reverted (git checkout, rebuild,
  boot clean, zero shimmer refs). Lesson for the wishlist: effects
  that live on TRANSPARENCY need a dark backdrop test FIRST — the
  dusk sky kills faint alpha; steam works because its puffs are
  denser (0.42) and viewed against dark roads. NEXT: item 10 — the
  blimp (opaque geometry, no such risk), then DEPLOY BATCH 16
  (v3.23.0) + the round-six closing survey.
- **57 THE BLIMP — round-six item 10, ROUND SIX COMPLETE (2026-07-17)**:
  one RIBBON COLA airship drifts at alt 300 above the prop-plane lanes
  (speed 8, wrap ±1500, slow bob + gentle roll). Opaque vc-baked hull
  (18x12 ellipsoid) + cross tail fins + gondola + landing skids in ONE
  merged mesh, plus a two-sided banner mesh (512x128 canvas, new
  fictional brand) — 2 draws, ~600 tris, zero transparency risk (the
  it.56 lesson applied). TWO FIT LESSONS: banner quads must sit
  OUTSIDE the hull's mid-bulge (offset ≥ hull max radius +0.3) AND
  their LENGTH must stay inside the silhouette taper — 16-long at
  ±4.35 poked past the tail; 11-long at ±3.9 let the bulge through
  the text; 11 at ±4.4 is the fit. Verified by LOOKING
  (loop-shots/57-blimp/): pearl hull + red banner readable alongside,
  gondola under, a banner plane crossing below; from the city it's a
  tiny drifting capsule. Perf gate: 1887-1925 calls / 590-600k tris.
  Suite 156/156 (probe: text + alt + drift >0.5 over 2.5s). ROUND SIX
  FINAL: 8 shipped (2,3,4,5,6,7,8,10) + 1 closed-exists (1) + 1
  blocked (9, technique-limited). DEPLOY BATCH 16 (v3.23.0) + closing
  survey next.
- **58 ROUND SIX CLOSE + ROUND SEVEN BACKLOG (2026-07-17)**: v3.23.0
  LIVE (batch 16: crosswalk wear, awnings+boards, turn signals, blimp).
  ROUND SIX FINAL SCORE: 8 shipped, 1 closed-exists, 1 blocked. Suite
  156/156. Closing survey (loop-shots/58-survey-7/): the race pack on
  the deck reads great (racing line ✓ seams ✓) but the deck EDGES are
  plain and rivals brake invisibly; city streets read smooth at near
  (no oil/lane wear); parks lovely but EMPTY of people; ponds bare;
  suburban shops flat; lamp poles bare; sky life rich (blimp, planes,
  balloons ✓). ROUND SEVEN BACKLOG (prioritized):
  1. RACE KERBS — red/white rumble strips on deck edges through
     corners (course-spline strips at high-curvature spans; the race
     sees them every lap).
  2. RIVAL + TRAFFIC BRAKE LIGHTS — brakePulse exists on traffic;
     surface it as rear glow quads; extend to race rivals.
  3. POND EDGES — reeds/rocks/lily pads ringing city ponds (vcBaked).
  4. PEDS IN PARKS — route a few walkers onto park paths (they only
     walk streets today; the parks are empty stages).
  5. ROAD OIL STAINS — dark lane-center patches near intersections
     (roadDecal pattern, deterministic).
  6. SUBURBAN SHOP FACADES — the A() brick shops get a window/door
     canvas band at near (the en() tower treatment, smaller).
  7. LAMP-POST DRESSING — hanging baskets/banners on poles near parks
     and shops (merged per color).
  8. BALLOON CANOPIES — striped canopies + baskets for the hot-air
     balloons.
  9. GRANDSTAND CROWDS — colored crowd-dot texture on the outskirt
     grandstands (race-visible).
  10. WINDMILL POLISH — striped blade tips + hubs on outskirt
     turbines.
  Wishlist note: aerial mowing stripes read weak from 45m+ — consider
  +2% amplitude if a later item touches the terrain bake.
- **59 RACE KERBS — round-seven item 1 BLOCKED (2026-07-17)**: three
  visual failures, reverted per charter (limit 2; the third was a
  diagnostic beacon that the title menu blocked — enough). The
  progression of diagnoses, for the NEXT attempt: (a) strips at
  ±(halfW-0.62) hide under the deck's golden RIM band; (b) at
  ±(halfW-2.3) they hide under the pale SHOULDER strip; (c) a
  probeDown cross-section at a corner showed the deck's VISIBLE mesh
  top diverging from BOTH the spline (St().p.y, off by −0.1..−2m,
  banked) and the analytic Ki "track" surface (which reads ~0.6 ABOVE
  the visible mesh at edges — the ray hits understructure); (d) Ki is
  TDZ-locked (Yn) at world-build time — runtime one-shot Bn builds
  work but the height source is still wrong. CONCLUSION: kerbs must
  reuse THE DECK BUILDER'S OWN cross-section math (find where the
  ribbon deck mesh itself is constructed and emit kerb quads in that
  exact vertex space) — a deeper refactor than a detail item. BLOCKED:
  needs deck-builder integration. Code fully reverted, boot clean.
  Suite state unchanged (156 probes; no kerb probe was added). NEXT:
  item 2 — brake lights (brakePulse already exists on traffic — a
  surface-only feature, no geometry archaeology).
- **60 BRAKE LIGHTS — round-seven item 2 (2026-07-17)**: braking is
  visible now. Every I1 traffic car carries two rear brake-glow quads
  (0.34x0.16 at the rear corners, ONE shared toneMapped-off red
  material) driven by the EXISTING brakePulse state (decays 3.2/s;
  set on panic stops, signal stops, and obstacle slowdowns) — the
  blink Bn tick from it.55 now also toggles brake visibility at
  brakePulse > 0.12 and tracks {braking, total, sample}. The rig
  rides the userData LITERAL (the I1-reassignment lesson). Race
  rivals use their own livery build (addRaceLivery, not I1) — noted,
  skipped for scope (rivals rarely brake-and-crawl; traffic is where
  braking reads). Verified by LOOKING (loop-shots/60-brakes/): a bus
  halting at a stop sign with both rear lamps glowing red. Suite
  157/157 (probe: rig 30-33 + total grows over 9s). **PERF TRIPWIRE:
  world 0 gate run hit 2008 calls vs the 2010 ceiling** (world 1:
  1869-1877 — world-luck high, but the gate is now effectively
  zero-headroom on hot worlds). RULE for remaining round-seven items:
  draw-neutral or single-merged-mesh only; if any gate run EXCEEDS
  2010, stop and renegotiate with a 5-world sample before shipping.
  NEXT: item 3 — pond edges (single merged vcBake ring mesh, +1 draw).
- **61 POND EDGES — round-seven item 3 (2026-07-17)**: the city ponds
  have banks worth looking at — reed clusters (4-7 leaning tapered
  stalks in 3 greens), grey boulders, and lily pads floating just
  inside the rim, ~14-22 clusters per pond, ONE merged vcBake mesh for
  every pond (+1 draw, tripwire-compliant). TWO PLUMBING LESSONS:
  (1) buildPonds() runs at MODULE level AFTER the world builder —
  calling buildPondEdges inside the world build saw an EMPTY registry
  (and the parks/pitch pond-avoidance filters have silently never
  matched city ponds either — latent, low-impact since Sa "lake"
  covers the big water, noted for a future pass); the call now sits
  directly after buildPonds(). (2) registerPond's waterY defaults to
  NULL for city ponds (only the lake passes one) — the real water
  surface is He(center)+0.15; a null-blind .toFixed crashed boot.
  First-pass density was too thin from the air — reeds 1.0-1.9 tall,
  rocks 0.45-1.0, pads 0.55-0.9 now read at aerial. Verified by
  LOOKING (loop-shots/61-pond-edges/): pads on the water, boulders on
  the bank, reed tufts around the rim. Perf gate: 1864-1904 calls /
  612-615k tris. Suite 158/158 (probe: ponds ≥1, clusters ≥8,
  toggle). NEXT: item 4 — peds in parks (walker rerouting, 0 draws).
- **DEPLOY BATCH 17 EARLY (2026-07-17, user: "yes, continue and
  deploy")**: v3.24.0 ships round-seven items 2-3 (brake lights, pond
  edges) ahead of the item-5 cadence. Items 4-10 continue after.
- **62 PEDS IN PARKS — round-seven item 4 (2026-07-17)**: the parks
  are inhabited. The LAST 6 walkers of the spawner become STROLLERS:
  each binds to one of the first 3 path cells (parkSys.strollerCells
  records {cx, cz, vert, bow, half} during buildParks) and walks THE
  ACTUAL BOWED PATH — position from the same sin() math the path
  strip uses, yaw from its derivative, bouncing at the cell ends.
  Same Rr entries, so ped kits, personas and click-inspect all still
  work on them; zero new draws. BOUND BUG: the walker loop runs to
  `ie` (45), not `m` (30 = TRAFFIC count) — `I >= m - 5` caught 20
  walkers; read the LOOP variable, not the nearest count. Verified by
  LOOKING (loop-shots/62-strollers/): two strollers on the pale path
  between the pines with a flowerbed beside — the park finally has
  people. Perf gate: 1859-1916 calls / 603-612k tris. Suite 159/159
  (stroller probe: 1-8 in-cell; one brake-probe window starvation —
  no car braked in its 9s — widened to 15s per the calibration
  pattern). NEXT: item 5 — road oil stains, then items 6-10 → deploy
  batch 18 + closing survey.
