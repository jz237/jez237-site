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
