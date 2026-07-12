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
3. **Pedestrian props — phones first**: lit phone screen with readable 2-bubble chat
   (6–8 canned fictional exchanges, seed-picked), head tilted down while reading;
   then shopping bags, coffee cups, umbrellas as seed variants.
4. **Drivers in cars**: head + shoulders + hands-on-wheel in traffic cars and race
   rivals (near pool; rivals always near → they get it permanently within budget).
5. **Taxi identity**: lit roof sign with medallion number ("TAXI 27"), rooflight,
   simple door decal — per-taxi seed.
6. **Storefront near-tier**: shop names (fictional, canvas), lit window interiors
   (shelves/tables as cheap boxes or interior-texture v1), doors with handles,
   OPEN/CLOSED variety.
7. **Street furniture**: hydrants, parking meters, benches, trash cans, newspaper
   boxes seeded along sidewalks (static merge friendly — these can be far-tier
   merged, near tier adds decals/labels).
8. **Street-name signs** at intersections — readable fictional names, canvas.
9. **Traffic-signal detail**: 3-lamp housings + WALK/DON'T-WALK crosswalk signals
   synced to the existing signal AI state.
10. **Stadium crowd v2**: near tier = instanced seated figures (wave animation);
    far tier keeps the noise texture.
11. **Road micro-detail**: manholes, storm drains, turn arrows, worn patches,
    crosswalk wear decals.
12. **Photo mode**: pause + orbit/zoom camera (wheel + pinch) reusing __freeCam
    plumbing, small UI hint — lets players actually savor all of the above.
13. **Balloons/blimp near detail** + fictional banner text.
14. **Birds** that scatter off sidewalks/wires when the player drives close (roam).
15. **Steam grates** + vent steam sprites in the city, near-gated.
16. **Parked-car variety**: plates (reuse #1), roof racks, per-seed dents/rust.
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
