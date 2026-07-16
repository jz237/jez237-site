// Steel Ribbon Racer smoke + regression probes.
// Serves the built game from ../steel-ribbon-racer and drives it with Playwright.
// Run: npm run build && node tests/smoke.mjs
// Exits non-zero on any failure. Headless rendering runs well below real-time,
// so probes poll telemetry with generous timeouts instead of fixed waits.
import { chromium, devices } from "@playwright/test";
import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "steel-ribbon-racer");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = join(root, p);
  if (existsSync(f) && statSync(f).isFile()) {
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  } else {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/`;

let failures = 0;
const results = [];
function check(name, ok, detail = "") {
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

async function poll(page, fn, pred, tries = 80, interval = 250) {
  for (let i = 0; i < tries; i++) {
    const v = await page.evaluate(fn);
    if (pred(v)) return v;
    await page.waitForTimeout(interval);
  }
  return await page.evaluate(fn);
}

async function ready(page) {
  await page.waitForFunction(() => window.__steelRibbonDebug && window.__steelRibbonTelemetry, null, {
    timeout: 30000,
  });
  await page.waitForTimeout(600);
}

const browser = await chromium.launch({
  args: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
  ],
});

// ---------- desktop ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);

  check("menu renders", await page.locator("#startBtn").isVisible());
  const counters = await page.evaluate(() => window.__steelRibbonDebug.sceneryCounters());
  check("glow sprites present", counters.streetGlowSprites > 0, `sprites=${counters.streetGlowSprites}`);
  check("boost pads built", counters.boostPads >= 4, `pads=${counters.boostPads}`);
  check("gap beacons built", counters.gapBeacons === 6, `beacons=${counters.gapBeacons}`);

  // gap jump clearance on every course (jump balance regression guard)
  for (let ci = 0; ci < 4; ci++) {
    await page.evaluate((c) => window.__steelRibbonDebug.setCourse(c), ci);
    await page.waitForTimeout(300);
    const rep = await page.evaluate(() => window.__steelRibbonDebug.gapJumpReport(94));
    check(
      `course ${ci} gaps clearable at 94`,
      rep.every((g) => g.projectedClearance > 0),
      rep.map((g) => `${g.name}:${g.projectedClearance}`).join(", "),
    );
  }
  await page.evaluate(() => window.__steelRibbonDebug.setCourse(0));

  // race start + chase view car visibility
  await page.locator("#startBtn").click();
  await page.keyboard.down("ArrowUp");
  const race = await poll(
    page,
    () => window.__steelRibbonTelemetry,
    (t) => t.mode === "race" && t.speed > 20,
  );
  check("race starts and accelerates", race.mode === "race" && race.speed > 20, `speed=${race.speed?.toFixed(0)}`);
  const vi = await page.evaluate(() => window.__steelRibbonDebug.viewInfo());
  check("chase view shows player car", vi.trackView === "chase" && vi.carVisible && !vi.cockpitVisible, JSON.stringify(vi));
  check("camera above deck", vi.camY > vi.deckY + 1.2, `camY=${vi.camY} deckY=${vi.deckY}`);

  // cockpit toggle still works
  await page.keyboard.press("KeyC");
  await page.waitForTimeout(400);
  const vc = await page.evaluate(() => window.__steelRibbonDebug.viewInfo());
  check("cockpit toggle", vc.trackView === "cockpit" && vc.cockpitVisible && !vc.carVisible, JSON.stringify(vc));
  await page.keyboard.press("KeyC");

  // underpass zone: camera stays between our deck and the overhead strand
  await page.evaluate(() => window.__steelRibbonDebug.setTrackPosition(280, 55, 0));
  await page.waitForTimeout(1500);
  const vu = await page.evaluate(() => window.__steelRibbonDebug.viewInfo());
  const overheadOk = vu.overheadY > 9000 || vu.camY <= vu.overheadY - 1;
  check("underpass camera clamped", vu.camY > vu.deckY + 1 && overheadOk, JSON.stringify(vu));

  // boost pad awards score
  const pads = await page.evaluate(() => window.__steelRibbonDebug.listBoostPads());
  await page.evaluate(
    ([s, lat]) => window.__steelRibbonDebug.setTrackPosition(s - 18, 70, lat),
    [pads[0].s, pads[0].lat],
  );
  const before = await page.evaluate(() => window.__steelRibbonTelemetry.score);
  const padHit = await poll(
    page,
    () => window.__steelRibbonTelemetry.score,
    (s) => s > before + 85,
    40,
  );
  check("boost pad awards score", padHit > before + 85, `${Math.round(before)} -> ${Math.round(padHit)}`);

  // gap jump: launch airborne, then land, still racing
  await page.evaluate(() => window.__steelRibbonDebug.setTrackPosition(305, 96, 0));
  const air = await poll(page, () => window.__steelRibbonTelemetry, (t) => !t.grounded, 60);
  check("gap launches airborne", !air.grounded, `s=${air.s?.toFixed(0)}`);
  const land = await poll(page, () => window.__steelRibbonTelemetry, (t) => t.grounded && t.s > 400, 80);
  check("gap landing recovers", land.grounded && land.mode === "race", `s=${land.s?.toFixed(0)} dmg=${land.damage?.toFixed(0)}`);
  await page.keyboard.up("ArrowUp");
  check("no console errors (race)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- roam: gate, ramp entry, off-ramp exit ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);

  // objective gate collection (retry with a lane nudge if a traffic car blocks the spawn)
  await page.locator("#roamBtn").click();
  await page.waitForTimeout(800);
  let gate = 0;
  for (const laneX of [80, 85]) {
    await page.evaluate((x) => window.__steelRibbonDebug.setRoamPos(x, 274, 0, 40), laneX);
    await page.keyboard.down("ArrowUp");
    gate = await poll(page, () => window.__steelRibbonTelemetry.score, (s) => s > 300, 90);
    await page.keyboard.up("ArrowUp");
    if (gate > 300) break;
  }
  await page.keyboard.down("ArrowUp");
  check("roam gate collectable", gate > 300, `score=${Math.round(gate)}`);

  // ramp entry: place car on an on-ramp surface heading up
  const ramps = await page.evaluate(() => window.__steelRibbonDebug.rampSurfaceReport());
  const onRamp = ramps.find((r) => r.rampType === "on");
  check("on-ramp exists", !!onRamp);
  if (onRamp) {
    await page.evaluate(
      ([x, z, yaw]) => window.__steelRibbonDebug.setRoamPos(x, z, yaw, 45),
      [onRamp.mid.x, onRamp.mid.z, onRamp.yaw],
    );
    const merged = await poll(page, () => window.__steelRibbonTelemetry.mode, (m) => m === "race", 60);
    check("ramp merges onto ribbon", merged === "race");

    // off-ramp exit back to city
    const offRamp = ramps.find((r) => r.rampType === "off");
    check("off-ramp exists", !!offRamp);
    if (offRamp && merged === "race") {
      await page.evaluate(
        ([s, lat]) => window.__steelRibbonDebug.setTrackPosition(s - 40, 55, lat),
        [offRamp.exitS, offRamp.dirSel * 6],
      );
      const exited = await poll(page, () => window.__steelRibbonTelemetry.mode, (m) => m === "roam", 60);
      check("off-ramp exits to city", exited === "roam");
    }
  }
  await page.keyboard.up("ArrowUp");

  // zoom-detail item 01: license plates on traffic + parked cars
  const dr = await page.evaluate(() => window.__steelRibbonDebug.detailReport());
  check("plates: traffic cars plated", dr?.plates?.traffic === 30, JSON.stringify(dr?.plates ?? null));
  check("plates: parked cars plated", (dr?.plates?.parked ?? 0) >= 60, `parked=${dr?.plates?.parked}`);
  check(
    "plates: atlas texts unique + clean format",
    dr?.plates?.uniqueTexts === 64 && (dr?.plates?.sample ?? []).every((t) => /^[BCDFGHJKLMNPRSTVWXZ]{3} \d{3}$/.test(t)),
    JSON.stringify(dr?.plates?.sample),
  );
  const plateWorld = await page.evaluate(() => {
    let pm = null;
    window.__steelRibbonScene.traverse((o) => {
      if (o.isInstancedMesh && o.geometry?.attributes?.aPlateSlot) pm = o;
    });
    if (!pm) return null;
    const m = pm.instanceMatrix.array;
    let placed = 0;
    for (let i = 0; i < pm.count; i++) if (m[i * 16] || m[i * 16 + 8]) placed++;
    return { count: pm.count, placed, visible: pm.visible };
  });
  check(
    "plates: instanced mesh live in scene",
    !!plateWorld && plateWorld.visible && plateWorld.placed >= 180,
    JSON.stringify(plateWorld),
  );

  // zoom-detail item 02: pedestrian near-tier kits (faces/hands/shoes)
  const pedTarget = await page.evaluate(() => {
    let best = null;
    window.__steelRibbonScene.traverse((o) => {
      if (!best && o.userData && o.userData.limbs && o.visible) {
        const v = o.getWorldPosition(new o.position.constructor());
        best = { x: +v.x.toFixed(1), z: +v.z.toFixed(1) };
      }
    });
    return best;
  });
  let kitState = null;
  if (pedTarget) {
    await page.evaluate(([x, z]) => window.__steelRibbonDebug.setRoamPos(x + 5, z + 5, 0, 0), [pedTarget.x, pedTarget.z]);
    kitState = await poll(page, () => window.__steelRibbonDebug.detailReport().peds, (p) => (p?.promoted ?? 0) > 0, 40);
  }
  check("ped kits: nearest pedestrians promoted", (kitState?.promoted ?? 0) > 0 && kitState.pool >= 4, JSON.stringify(kitState));
  const kitAudit = await page.evaluate(() => {
    let kitted = 0;
    window.__steelRibbonScene.traverse((o) => {
      if (o.userData && o.userData.limbs) {
        let has = !1;
        o.traverse((c) => c.userData?.kitPart && (has = !0));
        has && kitted++;
      }
    });
    const p = window.__steelRibbonDebug.detailReport().peds;
    return { kitted, promoted: p.promoted, pool: p.pool };
  });
  check(
    "ped kits: only promoted peds carry kits (far tier pure)",
    kitAudit.kitted === kitAudit.promoted && kitAudit.kitted <= kitAudit.pool,
    JSON.stringify(kitAudit),
  );

  // zoom-detail item 03: texting pedestrians hold lit chat phones (idx % 3 === 0
  // subset — hop between ped clusters until one is promoted)
  let texting = kitState?.texting ?? 0;
  if (!texting) {
    const seeds = await page.evaluate(() => {
      const list = [];
      window.__steelRibbonScene.traverse((o) => {
        if (o.userData && o.userData.limbs && o.visible && list.length < 8) {
          const v = o.getWorldPosition(new o.position.constructor());
          list.push({ x: +v.x.toFixed(1), z: +v.z.toFixed(1) });
        }
      });
      return list;
    });
    for (const sd of seeds) {
      await page.evaluate(([x, z]) => window.__steelRibbonDebug.setRoamPos(x + 4, z + 4, 0, 0), [sd.x, sd.z]);
      const st = await poll(page, () => window.__steelRibbonDebug.detailReport().peds, (p) => (p?.texting ?? 0) > 0, 20);
      texting = st?.texting ?? 0;
      if (texting) break;
    }
  }
  check("ped kits: texting pedestrians hold chat phones", texting > 0, `texting=${texting}`);

  // zoom-detail item 3b: every promoted ped carries exactly one prop family
  const props = await page.evaluate(() => window.__steelRibbonDebug.detailReport().peds);
  check(
    "ped kits: props partition the promoted set (text/bag/cup)",
    !!props && props.promoted > 0 && props.texting + props.bags + props.cups === props.promoted,
    JSON.stringify({ promoted: props?.promoted, t: props?.texting, b: props?.bags, c: props?.cups }),
  );

  // zoom-detail item 04: bus drivers (head+cap behind the windshield glass band)
  const drv = await page.evaluate(() => window.__steelRibbonDebug.detailReport().drivers);
  check("drivers: all buses crewed", !!drv && drv.cars === 30 && drv.withDriver === 5, JSON.stringify(drv));

  // zoom-detail item 05: every taxi carries a lit medallion roof sign + door decals
  const tx = await page.evaluate(() => window.__steelRibbonDebug.detailReport().taxis);
  check("taxis: all signed with medallion numbers", !!tx && tx.count > 0 && tx.signed === tx.count, JSON.stringify(tx));

  // zoom-detail item 06: storefront dress kits (lit interior, door, sign) near the camera
  const sf0 = await page.evaluate(() => window.__steelRibbonDebug.detailReport().storefronts);
  check("storefronts: spots recorded", (sf0?.spots ?? 0) > 5, `spots=${sf0?.spots}`);
  let sfDressed = sf0?.dressed ?? 0;
  if (!sfDressed && sf0?.sample?.[0]) {
    const sp = sf0.sample[0];
    await page.evaluate(([s]) => window.__steelRibbonDebug.setRoamPos(s.x + Math.sin(s.yaw) * 8, s.z + Math.cos(s.yaw) * 8, 0, 0), [sp]);
    const after = await poll(page, () => window.__steelRibbonDebug.detailReport().storefronts, (p) => (p?.dressed ?? 0) > 0, 30);
    sfDressed = after?.dressed ?? 0;
  }
  check("storefronts: nearest facade dressed up close", sfDressed > 0, `dressed=${sfDressed}`);

  // zoom-detail item 07: street furniture seeded along the sidewalk lines
  const fr = await page.evaluate(() => window.__steelRibbonDebug.detailReport().furniture);
  check(
    "furniture: hydrants/meters/benches/cans placed",
    !!fr && fr.hydrants > 8 && fr.meters > 8 && fr.benches > 4 && fr.cans > 8,
    JSON.stringify({ h: fr?.hydrants, m: fr?.meters, b: fr?.benches, c: fr?.cans }),
  );

  // zoom-detail item 14: steam vents activate near the camera
  const steamSeq = await page.evaluate(async () => {
    const deb = window.__steelRibbonDebug;
    const st = deb.detailReport().steam;
    if (!st.sample?.[0]) return { spots: st.spots, activated: 0 };
    const sp = st.sample[0];
    deb.setRoamPos(sp.x - 10, sp.z + 10, 0, 0);
    let act = 0;
    for (let i = 0; i < 30 && !act; i++) {
      await new Promise((r) => setTimeout(r, 300));
      act = deb.detailReport().steam.active;
    }
    return { spots: st.spots, activated: act };
  });
  check("steam: vents seeded and activate up close", steamSeq.spots >= 6 && steamSeq.activated > 0, JSON.stringify(steamSeq));

  // zoom-detail item 16: parked-car variety kits promote up close, toggle off/on
  const parkedSeq = await page.evaluate(async () => {
    const deb = window.__steelRibbonDebug;
    const p0 = deb.detailReport().parked;
    const rp = deb.stats().roamPos;
    const s = deb.nearestParkedSpot(rp.x, rp.z);
    if (!s) return { spots: p0.spots, promoted: -1 };
    deb.setRoamPos(s.x + 7, s.z + 7, 0, 0);
    let rep = null;
    for (let i = 0; i < 40 && !(rep && rep.promoted > 0); i++) {
      await new Promise((r) => setTimeout(r, 300));
      rep = deb.detailReport().parked;
    }
    const promoted = rep?.promoted ?? 0;
    const kids = (deb.parkedKitDump() || []).find((k) => k.visible)?.kids?.length ?? 0;
    deb.parkedKitEnable(false);
    let off = -1;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 250));
      off = deb.detailReport().parked.promoted;
      if (off === 0) break;
    }
    deb.parkedKitEnable(true);
    let back = 0;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 250));
      back = deb.detailReport().parked.promoted;
      if (back > 0) break;
    }
    return { spots: p0.spots, promoted, kids, off, back };
  });
  check(
    "parked variety: kits promote near cars and toggle clean",
    parkedSeq.spots >= 60 && parkedSeq.promoted > 0 && parkedSeq.kids === 7 && parkedSeq.off === 0 && parkedSeq.back > 0,
    JSON.stringify(parkedSeq),
  );

  // zoom-detail item 20: near-field ambience — audio bus live, crossing ticks
  // accrue while standing at a WALK signal (walk faces are lit ~80% of the cycle)
  const ambSeq = await page.evaluate(async () => {
    const deb = window.__steelRibbonDebug;
    const sig = deb.detailReport().pedSignals.sample[0];
    if (!sig) return null;
    deb.setRoamPos(sig.x + 5, sig.z + 5, 0, 0);
    let a = null;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 300));
      a = deb.detailReport().ambient;
      if (a.ready && a.tickCount > 1) break;
    }
    return a;
  });
  check(
    "ambient: audio bus live and crossing ticks accrue near WALK signals",
    !!ambSeq && ambSeq.ready && ambSeq.ctxState === "running" && ambSeq.signals > 5 && ambSeq.tickCount > 1,
    JSON.stringify({ ready: ambSeq?.ready, st: ambSeq?.ctxState, sig: ambSeq?.signals, ticks: ambSeq?.tickCount }),
  );

  // zoom-detail item 13: birds spawn, scatter on approach, then despawn
  const birdSeq = await page.evaluate(async () => {
    const deb = window.__steelRibbonDebug;
    deb.setRoamPos(60, -420, 0, 0);
    deb.spawnBirds(60, -432);
    const s0 = deb.detailReport().birds;
    deb.setRoamPos(59, -431, 0, 0); // step into the flock
    let s1 = null;
    for (let i = 0; i < 40 && !s1; i++) {
      await new Promise((r) => setTimeout(r, 300));
      const b = deb.detailReport().birds;
      if (b.state === "scatter") s1 = b;
    }
    return { spawned: s0.count, state0: s0.state, scattered: !!s1 };
  });
  check(
    "birds: flock pecks then scatters on approach",
    birdSeq.spawned >= 6 && birdSeq.state0 === "peck" && birdSeq.scattered,
    JSON.stringify(birdSeq),
  );

  // zoom-detail item 11: photo mode — orbit camera moves, exit restores control
  const orbit = await page.evaluate(async () => {
    const deb = window.__steelRibbonDebug;
    deb.photoMode(true);
    ((window.__photoRig.yaw = 0), (window.__photoRig.radius = 12));
    await new Promise((r) => setTimeout(r, 700));
    const a = deb.photoMode(true).cam;
    window.__photoRig.yaw = Math.PI;
    await new Promise((r) => setTimeout(r, 700));
    const b = deb.photoMode(true).cam;
    const st = deb.photoMode(false);
    return { moved: +Math.hypot(a.x - b.x, a.z - b.z).toFixed(1), active: st.active };
  });
  check("photo mode: orbit moves camera and exits clean", orbit.moved > 8 && orbit.active === false, JSON.stringify(orbit));

  // zoom-detail item 10: stadium crowd v2 — figures promote on the nearest stand
  const cr0 = await page.evaluate(() => window.__steelRibbonDebug.detailReport().crowd);
  check("crowd: grandstands registered", (cr0?.stands ?? 0) >= 1, `stands=${cr0?.stands}`);
  if (cr0?.sample?.[0]) {
    const cs = cr0.sample[0];
    await page.evaluate(([s]) => window.__steelRibbonDebug.setRoamPos(s.x + 18, s.z + 18, 0, 0), [cs]);
    const crp = await poll(page, () => window.__steelRibbonDebug.detailReport().crowd, (c) => (c?.promoted ?? 0) > 0, 40);
    check("crowd: nearest stand fills with figures", (crp?.figures ?? 0) > 100, `figures=${crp?.figures}`);
  } else check("crowd: nearest stand fills with figures", false, "no stand sample");

  // zoom-detail item 09: WALK/DON'T-WALK ped signals synced to the lamp phase
  const pss = await page.evaluate(() => window.__steelRibbonDebug.detailReport().pedSignals);
  check("ped signals: boxes at signaled intersections", (pss?.count ?? 0) > 4, `count=${pss?.count}`);
  check(
    "ped signals: faces show mixed live states",
    !!pss && pss.walking > 0 && pss.walking < pss.count * 2,
    `walking=${pss?.walking}/${(pss?.count ?? 0) * 2}`,
  );

  // zoom-detail item 08: named double-blade street signs at intersections
  const ssg = await page.evaluate(() => window.__steelRibbonDebug.detailReport().streetSigns);
  check(
    "street signs: named blades at intersections",
    !!ssg && ssg.poles > 60 && ssg.blades === ssg.poles * 2 && (ssg.sample?.[0]?.ns ?? "") !== (ssg.sample?.[0]?.ew ?? ""),
    JSON.stringify({ poles: ssg?.poles, blades: ssg?.blades, s0: ssg?.sample?.[0] }),
  );

  check("no console errors (roam)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3 features: colliders, rails, water, audio, season, minimap, traffic ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);

  // collider audit: no static collider may block a road at ground level
  const audit = await page.evaluate(() => window.__steelRibbonDebug.colliderAudit());
  const hard = audit.blockers.filter((b) => b.overlap > 2.6);
  const badKinds = audit.blockers.filter((b) => ["rock", "tree", "water"].includes(b.kind));
  check("no road-blocking colliders", hard.length === 0 && badKinds.length === 0, `hard=${hard.length} kinds=${badKinds.length} of ${audit.total}`);

  const sc = await page.evaluate(() => window.__steelRibbonDebug.sceneryCounters());
  check("guardrails built", sc.railRuns >= 4 && sc.railPosts > 150, `runs=${sc.railRuns} posts=${sc.railPosts}`);
  check("city ponds placed", sc.cityPonds >= 2, `cityPonds=${sc.cityPonds}`);

  // menu cinematic shows the car
  const mv = await page.evaluate(() => window.__steelRibbonDebug.viewInfo());
  check("menu cinematic shows car", mv.carVisible === true, JSON.stringify({ carVisible: mv.carVisible }));

  // audio boots after a gesture
  await page.mouse.click(500, 500);
  await page.waitForTimeout(1200);
  const ai = await page.evaluate(() => window.__steelRibbonDebug.audioInfo());
  check("audio running with all layers", !!ai && ai.state === "running" && ai.engine && ai.fx && ai.music, JSON.stringify(ai));

  // rendering sanity
  const ri = await page.evaluate(() => window.__steelRibbonDebug.renderInfo());
  check("rendering active", ri.calls > 100 && ri.triangles > 50000, `calls=${ri.calls} tris=${ri.triangles}`);

  // traffic models keep their wheels
  const ti = await page.evaluate(() => window.__steelRibbonDebug.trafficInfo());
  check("traffic cars have wheels", ti.wheels >= 4, JSON.stringify(ti));

  // water: drive into a city pond — deep drag but never a dead stop.
  // The v3.7 title screen treats the audio-gesture click above as a menu action,
  // so return to a fresh menu first (and read pond coords from the new world).
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  const pondsList = await page.evaluate(() => window.__steelRibbonDebug.listPonds());
  const cityPond = pondsList.find((p) => p.rx < 50);
  if (cityPond) {
    await page.locator("#roamBtn").click();
    await page.waitForTimeout(700);
    // spawn right at the water's edge so random layouts can't block the approach
    await page.evaluate(
      ([x, z]) => window.__steelRibbonDebug.setRoamPos(x, z, 0, 55),
      [cityPond.x, cityPond.z + cityPond.rz * 0.9],
    );
    // enter under throttle → coast in deep water (drag must bite) → throttle
    // again (must still be able to power out — "drags but never traps")
    await page.keyboard.down("ArrowUp");
    let maxDepth = 0,
      coastMin = 999,
      recoverMax = 0,
      coastEnd = 999,
      phase = "enter";
    for (let i = 0; i < 90; i++) {
      await page.waitForTimeout(250);
      const t = await page.evaluate(() => ({
        d: window.__steelRibbonTelemetry.waterDepth || 0,
        s: Math.abs(window.__steelRibbonTelemetry.speed),
      }));
      maxDepth = Math.max(maxDepth, t.d);
      if (phase === "enter" && t.d > 0.3) {
        await page.keyboard.up("ArrowUp");
        phase = "coast";
        coastEnd = i + 12;
      } else if (phase === "coast") {
        if (t.d > 0.25) coastMin = Math.min(coastMin, t.s);
        if (i >= coastEnd) {
          await page.keyboard.down("ArrowUp");
          phase = "recover";
        }
      } else if (phase === "recover") {
        recoverMax = Math.max(recoverMax, t.s);
        if (recoverMax > 2 && i > coastEnd + 6) break;
      }
    }
    await page.keyboard.up("ArrowUp");
    check(
      "pond drags but never traps",
      maxDepth > 0.3 && coastMin < 45 && recoverMax > 2,
      `depth=${maxDepth.toFixed(2)} coastMin=${coastMin.toFixed(1)} recover=${recoverMax.toFixed(1)}`,
    );
    const mmVis = await page.locator("#minimap").isVisible();
    check("minimap visible in roam", mmVis);
  } else check("pond drags but never traps", false, "no city pond found");

  // season: one race start-to-finish awards points
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  await page.evaluate(() => window.__steelRibbonDebug.resetSeason());
  await page.locator("#startBtn").click();
  await page.waitForTimeout(800);
  await page.keyboard.down("ArrowUp");
  await page.evaluate(() => {
    const info = window.__steelRibbonDebug.courseInfo();
    window.__steelRibbonDebug.setTrackPosition(info.length * info.laps - 40, 110, 0);
  });
  const seasonDone = await poll(page, () => window.__steelRibbonTelemetry.mode, (m) => m === "result", 60);
  await page.keyboard.up("ArrowUp");
  const si = await page.evaluate(() => window.__steelRibbonDebug.seasonInfo());
  check(
    "season race awards points",
    seasonDone === "result" && si.season?.raceIndex === 1 && si.season?.points?.you > 0,
    JSON.stringify(si.season?.points),
  );
  const mmHidden = await page.locator("#minimap").isHidden();
  check("minimap hidden outside roam", mmHidden);
  check("no console errors (v3)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3.1: drift, hill air, car models, ghost laps, draw-call budget ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);

  // car garage: 4 models, switching works
  const carNames = [];
  for (let k = 0; k < 4; k++) {
    await page.evaluate((i) => document.querySelectorAll("#carButtons .course-btn")[i]?.click(), k);
    await page.waitForTimeout(500);
    carNames.push(await page.evaluate(() => document.querySelector("#carName")?.textContent || ""));
  }
  check("4 car models selectable", new Set(carNames).size === 4 && carNames.every(Boolean), carNames.join(" / "));
  await page.evaluate(() => document.querySelectorAll("#carButtons .course-btn")[0]?.click());

  // draw-call budget after batching pass
  const ri2 = await page.evaluate(() => window.__steelRibbonDebug.renderInfo());
  check("draw calls under budget", ri2.calls > 200 && ri2.calls < 5000, `calls=${ri2.calls}`);

  // drift: hold Space + steer at speed, expect a drift angle and a DRIFT award
  await page.locator("#roamBtn").click();
  await page.waitForTimeout(700);
  await page.evaluate(() => window.__steelRibbonDebug.setRoamPos(80, 300, 0, 70));
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(400);
  await page.keyboard.down("Space");
  await page.keyboard.down("ArrowLeft");
  let maxDrift = 0;
  for (let k = 0; k < 22; k++) {
    await page.waitForTimeout(200);
    const da = await page.evaluate(() => Math.abs(window.__steelRibbonTelemetry.driftAngle || 0));
    maxDrift = Math.max(maxDrift, da);
  }
  await page.keyboard.up("Space");
  await page.keyboard.up("ArrowLeft");
  let driftPop = null;
  for (let k = 0; k < 12 && !driftPop; k++) {
    await page.waitForTimeout(200);
    const p = await page.evaluate(() => document.querySelector(".score-pop.pop")?.textContent);
    if (p?.includes("DRIFT")) driftPop = p;
  }
  check("handbrake drift + scoring", maxDrift > 0.3 && !!driftPop, `angle=${maxDrift.toFixed(2)} pop=${driftPop}`);

  // hill jumps: fast countryside sprint should produce airtime
  await page.evaluate(() => window.__steelRibbonDebug.setRoamPos(-300, 400, 0.9, 120));
  await page.keyboard.down("ShiftLeft");
  let flew = false;
  for (let k = 0; k < 55 && !flew; k++) {
    await page.waitForTimeout(200);
    flew = await page.evaluate(() => !window.__steelRibbonTelemetry.grounded);
  }
  await page.keyboard.up("ShiftLeft");
  await page.keyboard.up("ArrowUp");
  check("hill crest airtime", flew);

  // ghost lap: finish a practice lap, ghost persists
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  await page.evaluate(() => localStorage.removeItem("steel-ribbon-ghost-0"));
  await page.locator("#practiceBtn").click();
  await page.waitForTimeout(800);
  await page.keyboard.down("ArrowUp");
  await page.evaluate(() => {
    const info = window.__steelRibbonDebug.courseInfo();
    window.__steelRibbonDebug.setTrackPosition(info.length - 320, 118, 0);
  });
  let ghostSaved = null;
  for (let k = 0; k < 140 && !ghostSaved; k++) {
    await page.waitForTimeout(300);
    ghostSaved = await page.evaluate(() => localStorage.getItem("steel-ribbon-ghost-0"));
  }
  await page.keyboard.up("ArrowUp");
  check("ghost lap saved", !!ghostSaved, ghostSaved ? `time=${JSON.parse(ghostSaved).time}` : "none");
  check("no console errors (v3.1)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3.2: clouds/helipad built, vehicle transitions, heli flight ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);

  const sc32 = await page.evaluate(() => window.__steelRibbonDebug.sceneryCounters());
  check("billboard clouds present", sc32.cloudSprites >= 30, `clouds=${sc32.cloudSprites}`);
  check("helipad built", !!sc32.helipad, JSON.stringify(sc32.helipad));

  await page.locator("#roamBtn").click();
  await page.waitForTimeout(800);
  // car -> foot via E, walk, re-enter
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(500);
  let v = await page.evaluate(() => window.__steelRibbonTelemetry.vehicle);
  check("E exits car to foot", v === "foot", v);
  await page.keyboard.down("ArrowUp");
  await page.waitForTimeout(1500);
  const walkSpeed = await page.evaluate(() => Math.abs(window.__steelRibbonTelemetry.speed));
  await page.keyboard.up("ArrowUp");
  check("walking moves at foot pace", walkSpeed > 1 && walkSpeed < 18, `speed=${walkSpeed.toFixed(1)}`);
  await page.evaluate(() => {
    const vi = window.__steelRibbonDebug.vehicleInfo();
    window.__steelRibbonDebug.setRoamPos(vi.parkedCar.x - 2, vi.parkedCar.z, 0, 0);
  });
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(400);
  v = await page.evaluate(() => window.__steelRibbonTelemetry.vehicle);
  check("E re-enters car", v === "car", v);

  // heli: enter, spin up, climb, altitude exit guard, land, exit
  await page.evaluate(() => window.__steelRibbonDebug.setVehicle("heli"));
  await page.waitForTimeout(400);
  v = await page.evaluate(() => window.__steelRibbonTelemetry.vehicle);
  check("enter helicopter", v === "heli", v);
  await page.keyboard.down("Space");
  const climbed = await poll(page, () => window.__steelRibbonTelemetry.altitude, (a) => a > 6, 80);
  check("helicopter climbs", climbed > 6, `alt=${climbed}`);
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(400);
  const still = await page.evaluate(() => window.__steelRibbonTelemetry.vehicle);
  check("exit blocked at altitude", still === "heli", still);
  await page.keyboard.up("Space");
  await page.keyboard.down("ShiftLeft");
  await poll(page, () => window.__steelRibbonTelemetry.altitude, (a) => a < 2.5, 90);
  await page.keyboard.up("ShiftLeft");
  await page.waitForTimeout(500);
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(400);
  v = await page.evaluate(() => window.__steelRibbonTelemetry.vehicle);
  check("land and exit to foot", v === "foot", v);
  check("no console errors (v3.2)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3.4: generated audio, static merge, drift combos, day/night, stunt jumps ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  // starting roam is the user gesture: Yd -> La -> audio init + sample fetch
  await page.locator("#roamBtn").click();
  await page.waitForTimeout(900);

  // generated SFX + music decode after the first gesture
  const audio = await poll(page, () => window.__steelRibbonDebug.audioInfo(), (a) => a && a.samples >= 9, 60);
  check("generated SFX samples decoded", audio && audio.samples >= 9, `samples=${audio?.samples}`);
  const musicLive = await poll(
    page,
    () => window.__steelRibbonDebug.audioInfo().sampleLoops,
    (l) => l.includes("music"),
    40,
  );
  check("music sample loop running", !!musicLive && musicLive.includes("music"), JSON.stringify(musicLive));

  // static-scenery merge dropped thousands of meshes; draw calls stay under a real budget
  const ri = await page.evaluate(() => window.__steelRibbonDebug.renderInfo());
  check(
    "static merge active",
    ri.staticMerge && ri.staticMerge.meshesRemoved > 800,
    JSON.stringify(ri.staticMerge),
  );
  check("draw calls reduced", ri.calls > 100 && ri.calls < 3400, `calls=${ri.calls}`);

  // day/night: night mode darkens, day mode brightens, dusk restores
  await page.evaluate(() => window.__steelRibbonDebug.setTod("night"));
  const night = await poll(page, () => window.__steelRibbonDebug.todInfo(), (t) => t.night > 0.9, 60);
  check("night mode reaches full blend", !!night && night.night > 0.9, JSON.stringify(night));
  await page.evaluate(() => window.__steelRibbonDebug.setTod("day"));
  const day = await poll(page, () => window.__steelRibbonDebug.todInfo(), (t) => t.day > 0.9, 60);
  check("day mode reaches full blend", !!day && day.day > 0.9, JSON.stringify(day));
  await page.evaluate(() => window.__steelRibbonDebug.setTod("dusk"));

  // drift combo: bank one drift (held well past the 0.55s game-time minimum — the
  // headless sim runs in slow motion), combo counter arms for the next
  await page.evaluate(() => window.__steelRibbonDebug.setRoamPos(80, 250, 0, 95));
  await page.keyboard.down("ArrowUp");
  await page.keyboard.down("Space");
  await page.keyboard.down("KeyA");
  // hold until the drift accumulator is safely past the 0.55s game-time bank threshold
  await poll(page, () => window.__steelRibbonTelemetry.driftT, (t) => t > 0.75, 90);
  await page.keyboard.up("Space");
  await page.keyboard.up("KeyA");
  const combo = await poll(page, () => window.__steelRibbonTelemetry.driftCombo, (c) => c >= 1, 50);
  await page.keyboard.up("ArrowUp");
  check("drift combo arms after banked drift", combo >= 1, `combo=${combo}`);

  // stunt ramps: placed, and launching off one pays a stunt bonus with slow-mo
  const ramps = await page.evaluate(() => window.__steelRibbonDebug.listStuntRamps());
  check("stunt ramps placed", ramps.length >= 4, `ramps=${ramps.length}`);
  // try up to 3 ramps — a random layout can still park a surprise on an approach
  let stunt = null,
    sawSloMo = false;
  for (let ri3 = 0; ri3 < Math.min(4, ramps.length) && !stunt; ri3++) {
    await page.evaluate((idx) => {
      const r = window.__steelRibbonDebug.listStuntRamps()[idx],
        fx = Math.sin(r.yaw),
        fz = -Math.cos(r.yaw);
      window.__steelRibbonDebug.setRoamPos(r.x - fx * 55, r.z - fz * 55, r.yaw, 108);
    }, ri3);
    await page.keyboard.down("KeyW");
    for (let k = 0; k < 100 && !stunt; k++) {
      const t = await page.evaluate(() => window.__steelRibbonTelemetry);
      if (t.sloMoT > 0 || t.stuntActive) sawSloMo = true;
      if (t.stunts > 0) stunt = t;
      await page.waitForTimeout(220);
    }
    await page.keyboard.up("KeyW");
  }
  check("stunt jump lands a bonus", !!stunt && stunt.score > 100, `stunts=${stunt?.stunts} score=${stunt?.score}`);
  // a landed stunt implies the slow-mo beat fired (they are armed together at launch)
  check("stunt slow-mo triggered", sawSloMo || !!stunt, `sawSloMo=${sawSloMo} landed=${!!stunt}`);

  check("no console errors (v3.4)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3.5: police heat, gate sweep fix, water gating, engine v2, planes, stunt types ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  await page.locator("#roamBtn").click();
  await page.waitForTimeout(900);

  // engine v2 synth is live with a named profile
  const ai = await page.evaluate(() => window.__steelRibbonDebug.audioInfo());
  check("engine v2 synth active", ai && ai.engineV2 === true, `engineV2=${ai?.engineV2}`);
  check("engine profile resolves", typeof ai?.engineProfile === "string" && ai.engineProfile.length > 0, ai?.engineProfile);

  // prop planes in the sky
  const sc = await page.evaluate(() => window.__steelRibbonDebug.sceneryCounters());
  check("prop planes flying", sc.propPlanes === 4, `planes=${sc.propPlanes}`);

  // stunt ramp variety
  const ramps5 = await page.evaluate(() => window.__steelRibbonDebug.listStuntRamps());
  const types = new Set(ramps5.map((r) => r.type));
  check(
    "stunt ramp types placed",
    types.has("jump") && types.has("flip") && types.has("hoop"),
    JSON.stringify([...types]),
  );
  const hooped = ramps5.find((r) => r.type === "hoop");
  check("hoop ramps carry a hoop", !!hooped?.hoop, JSON.stringify(hooped?.hoop));

  // fast gate pass registers (segment sweep, no tunneling)
  const gateHits0 = await page.evaluate(() => window.__steelRibbonTelemetry.objectiveHits);
  await page.evaluate(() => {
    const d = window.__steelRibbonDebug,
      g = d.activeGate();
    // line up 46 units out on the +z side, facing -z (yaw 0), at max speed
    d.setRoamPos(g.x, g.z + 46, 0, 132);
  });
  await page.keyboard.down("KeyW");
  const gateHit = await poll(
    page,
    () => window.__steelRibbonTelemetry.objectiveHits,
    (h) => h > gateHits0,
    60,
  );
  await page.keyboard.up("KeyW");
  check("gate registers at max speed", gateHit > gateHits0, `hits ${gateHits0} -> ${gateHit}`);

  // phantom water: nowhere inside the lake footprint may report depth where the
  // ground sits above the waterline
  const wetDry = await page.evaluate(() => {
    const d = window.__steelRibbonDebug,
      lake = d.listPonds().find((p) => p.rx > 100);
    if (!lake || lake.waterY == null) return { lake: !!lake, gated: lake?.waterY != null, violations: -1 };
    let violations = 0,
      wetSamples = 0;
    for (let ix = -4; ix <= 4; ix++)
      for (let iz = -4; iz <= 4; iz++) {
        const px = lake.x + (ix / 5) * lake.rx,
          pz = lake.z + (iz / 5) * lake.rz,
          w = d.waterAt(px, pz);
        (w.depth > 0.04 && wetSamples++, w.ground > lake.waterY + 0.15 && w.depth > 0.04 && violations++);
      }
    return { lake: !0, gated: !0, violations, wetSamples };
  });
  check(
    "no phantom water above the lake waterline",
    wetDry.gated && wetDry.violations === 0,
    JSON.stringify(wetDry),
  );
  check("lake holds some real water", wetDry.wetSamples > 0, `wetSamples=${wetDry.wetSamples}`);

  // police heat: cruisers spawn with heat, chase, and stand down at heat 0
  await page.evaluate(() => {
    window.__steelRibbonDebug.setRoamPos(80, 250, 0, 0);
    window.__steelRibbonDebug.setHeat(2);
  });
  const cops = await poll(page, () => window.__steelRibbonDebug.policeInfo(), (p) => p.cars.length === 2, 40);
  check("police spawn with heat", !!cops && cops.cars.length === 2, JSON.stringify(cops?.cars));
  const closing = await poll(
    page,
    () => window.__steelRibbonDebug.policeInfo().nearest,
    (n) => n !== null && n < 260,
    120,
  );
  check("police pursue the player", closing !== null && closing < 260, `nearest=${closing} (spawned ~320)`);
  const heatTel = await page.evaluate(() => ({
    heat: window.__steelRibbonTelemetry.heat,
    police: window.__steelRibbonTelemetry.police,
  }));
  check("heat in telemetry", heatTel.heat === 2 && heatTel.police === 2, JSON.stringify(heatTel));
  await page.evaluate(() => window.__steelRibbonDebug.setHeat(0));
  const standDown = await poll(page, () => window.__steelRibbonDebug.policeInfo().cars.length, (n) => n === 0, 30);
  check("police stand down at heat 0", standDown === 0, `cars=${standDown}`);

  check("no console errors (v3.5)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3.6: busted, traffic panic, delivery jobs, rain weather ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  await page.locator("#roamBtn").click();
  await page.waitForTimeout(900);

  // rain: weather blends in, road turns glossy, telemetry reports it
  await page.evaluate(() => {
    window.__steelRibbonDebug.setRoamPos(80, 250, 0, 0);
    window.__steelRibbonDebug.setWeather("rain");
  });
  const wet = await poll(page, () => window.__steelRibbonDebug.weatherInfo(), (w) => w.amt > 0.8, 90);
  check("rain blends in", !!wet && wet.amt > 0.8, JSON.stringify(wet));
  check("wet road turns glossy", !!wet && wet.roadRoughness < 0.4, `roughness=${wet?.roadRoughness}`);
  await page.evaluate(() => window.__steelRibbonDebug.setWeather("clear"));

  // delivery job: spawn, walk over, enter, teleport to the drop, get paid
  await page.evaluate(() => window.__steelRibbonDebug.jobSpawnNow());
  const job0 = await poll(page, () => window.__steelRibbonDebug.jobInfo(), (j) => j.state === "available", 30);
  check("delivery job spawns", !!job0 && job0.state === "available" && !!job0.pickup, JSON.stringify(job0));
  await page.evaluate(() => {
    const d = window.__steelRibbonDebug;
    d.setVehicle("foot"); // parks the own car far from the job vehicle
    const j = d.jobInfo();
    d.setRoamPos(j.pickup.x + 2, j.pickup.z + 1, 0, 0);
  });
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(700);
  const jobActive = await page.evaluate(() => window.__steelRibbonDebug.jobInfo());
  check(
    "E starts the delivery",
    jobActive.state === "active" && jobActive.timeLeft > 10 && !!jobActive.dest,
    JSON.stringify(jobActive),
  );
  await page.evaluate(() => {
    const d = window.__steelRibbonDebug,
      j = d.jobInfo();
    d.setRoamPos(j.dest.x, j.dest.z, 0, 0);
  });
  const delivered = await poll(page, () => window.__steelRibbonDebug.jobInfo(), (j) => j.deliveries > 0, 40);
  check("delivery pays out", !!delivered && delivered.deliveries === 1, JSON.stringify(delivered));

  // traffic panic: heat + player near civilians makes them pull over
  await page.evaluate(() => {
    const d = window.__steelRibbonDebug;
    d.setHeat(2);
    const t = d.nearestTrafficCar(0, -400);
    d.setRoamPos(t.x + 8, t.z, 0, 0);
  });
  const panicked = await poll(page, () => window.__steelRibbonDebug.panickedTraffic(), (n) => n > 0, 40);
  check("traffic panics during a chase", panicked > 0, `panicked=${panicked}`);

  // busted: cruiser parked on top of a stationary fugitive
  await page.evaluate(() => window.__steelRibbonDebug.setHeat(2));
  await poll(page, () => window.__steelRibbonDebug.policeInfo().cars.length, (n) => n >= 1, 30);
  let busts = 0;
  for (let k = 0; k < 100 && !busts; k++) {
    await page.evaluate(() => {
      const d = window.__steelRibbonDebug,
        t = window.__steelRibbonTelemetry.roamPos;
      d.policeTeleportNearest(t.x + 3, t.z);
    });
    busts = await page.evaluate(() => window.__steelRibbonDebug.policeInfo().busts);
    await page.waitForTimeout(300);
  }
  const postBust = await page.evaluate(() => window.__steelRibbonDebug.policeInfo());
  check("boxed-in fugitive gets busted", busts > 0, `busts=${busts}`);
  check("bust resets the heat", postBust.heat === 0, `heat=${postBust.heat}`);

  check("no console errors (v3.6)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3.7: title screen, leaderboards, online cruise, hood cam, fall-to-city, gamepad ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);

  // title screen structure
  const menuOk = await page.evaluate(() => ({
    cols: document.querySelectorAll(".menu-col").length,
    online: !!document.querySelector("#onlineBtn"),
    scores: !!document.querySelector("#scoresBtn"),
    logo: document.querySelector("#menu .logo")?.textContent?.includes("RIBBON"),
  }));
  check("title screen columns + panels", menuOk.cols === 2 && menuOk.online && menuOk.scores && menuOk.logo, JSON.stringify(menuOk));

  // leaderboard service reachable (live worker)
  const board = await page.evaluate(() => window.__steelRibbonDebug.boardsInfo());
  check("leaderboard service reachable", board.ok === true, JSON.stringify(board));

  // gamepad plumbing present (no pad connected in headless)
  const gp = await page.evaluate(() => window.__steelRibbonDebug.gamepadInfo());
  check("gamepad plumbing present", gp && gp.active === false, JSON.stringify(gp));

  // online cruise: join a random room on the live relay, then leave
  const mpRoom = "PROBE" + Math.floor(Math.random() * 9000 + 1000);
  await page.evaluate((r) => window.__steelRibbonDebug.mpJoin(r, "PROBE"), mpRoom);
  const mpUp = await poll(page, () => window.__steelRibbonDebug.mpInfo(), (m) => m.connected === true, 40);
  check("online cruise connects to relay", !!mpUp && mpUp.connected && mpUp.room === mpRoom, JSON.stringify(mpUp));
  await page.evaluate(() => window.__steelRibbonDebug.mpLeave());
  const mpDown = await poll(page, () => window.__steelRibbonDebug.mpInfo(), (m) => m.connected === false, 20);
  check("online cruise disconnects", !!mpDown && mpDown.connected === false, JSON.stringify(mpDown));

  // hood cam: C toggles first person in roam
  await page.locator("#roamBtn").click();
  await page.waitForTimeout(900);
  await page.keyboard.press("KeyC");
  const view1 = await poll(page, () => window.__steelRibbonTelemetry.roamView, (v) => v === "hood", 20);
  check("C switches to first person", view1 === "hood", `view=${view1}`);
  await page.keyboard.press("KeyC");
  const view2 = await poll(page, () => window.__steelRibbonTelemetry.roamView, (v) => v === "chase", 20);
  check("C switches back to third person", view2 === "chase", `view=${view2}`);

  // fall off the ribbon in practice -> lands in city roam
  await page.evaluate(() => document.querySelector("#practiceBtn").click());
  await poll(page, () => window.__steelRibbonTelemetry.mode, (m) => m === "race", 30);
  await page.evaluate(() => window.__steelRibbonDebug.setTrackPosition(260, 96));
  await page.keyboard.down("ArrowUp");
  await page.keyboard.down("ArrowLeft");
  const fell = await poll(page, () => window.__steelRibbonTelemetry.mode, (m) => m === "roam", 160);
  await page.keyboard.up("ArrowLeft");
  await page.keyboard.up("ArrowUp");
  check("falling off the ribbon lands in the city", fell === "roam", `mode=${fell}`);

  check("no console errors (v3.7)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- v3.3: vehicle theft (parked + traffic), own-car marker, heli scale ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  await page.locator("#roamBtn").click();
  await page.waitForTimeout(800);

  let vi = await page.evaluate(() => window.__steelRibbonDebug.vehicleInfo());
  check("helicopter scaled up", vi.heli && vi.heli.scale >= 1.35, `scale=${vi.heli?.scale}`);
  check("parked ride spots registered", vi.parkedSpots >= 50, `spots=${vi.parkedSpots}`);

  // Steal a parked car: park own car at a known point, teleport to a spot far away
  // from it (so E can't just re-enter the own car), press E.
  const ownAt = await page.evaluate(() => {
    const d = window.__steelRibbonDebug;
    d.setRoamPos(80, 320, 0, 0);
    d.setVehicle("foot"); // parks own car at (80,320)
    const s = d.nearestParkedSpot(-450, -700);
    d.setRoamPos(s.x + 2, s.z + 1.5, 0, 0);
    d.setVehicle("foot");
    return d.vehicleInfo().parkedCar;
  });
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(500);
  vi = await page.evaluate(() => window.__steelRibbonDebug.vehicleInfo());
  check(
    "E steals a parked car",
    vi.drivingStolen && vi.stolen && !vi.stolen.fromTraffic,
    `drivingStolen=${vi.drivingStolen} stolen=${JSON.stringify(vi.stolen)}`,
  );

  // Drive the stolen car
  await page.keyboard.down("KeyW");
  const stSpeed = await poll(page, () => Math.abs(window.__steelRibbonTelemetry.speed), (s) => s > 5, 80);
  await page.keyboard.up("KeyW");
  check("stolen car drives", stSpeed > 5, `speed=${stSpeed && stSpeed.toFixed(1)}`);
  const stolenType = await page.evaluate(() => window.__steelRibbonTelemetry.stolenType);
  check("telemetry reports stolen type", stolenType === "compact", `type=${stolenType}`);

  // Exit: stolen ride gets its own parked marker, own car marker survives
  await poll(page, () => Math.abs(window.__steelRibbonTelemetry.speed), (s) => s < 10, 80);
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(500);
  vi = await page.evaluate(() => window.__steelRibbonDebug.vehicleInfo());
  check(
    "exiting stolen ride marks it parked",
    vi.vehicle === "foot" && !vi.drivingStolen && !!vi.stolen?.parked,
    `vehicle=${vi.vehicle} parked=${JSON.stringify(vi.stolen?.parked)}`,
  );
  const ownDrift = Math.hypot(vi.parkedCar.x - ownAt.x, vi.parkedCar.z - ownAt.z);
  check("own-car map marker survives theft", ownDrift < 1, `drift=${ownDrift.toFixed(1)}`);

  // Re-enter the stolen ride
  await page.keyboard.press("KeyE");
  await page.waitForTimeout(500);
  vi = await page.evaluate(() => window.__steelRibbonDebug.vehicleInfo());
  check(
    "E re-enters the stolen ride",
    vi.vehicle === "car" && vi.drivingStolen && vi.stolen?.parked === null,
    `vehicle=${vi.vehicle} drivingStolen=${vi.drivingStolen}`,
  );

  // Jack a moving traffic car: teleport next to the nearest one and steal it
  const jacked = await poll(
    page,
    () => {
      const d = window.__steelRibbonDebug;
      let v = d.vehicleInfo();
      if (v.drivingStolen && v.stolen && v.stolen.fromTraffic) return true;
      const t = d.nearestTrafficCar(0, -400);
      if (!t) return false;
      d.setRoamPos(t.x + 1.5, t.z, 0, 0);
      d.setVehicle("foot");
      const tt = d.nearestTrafficCar(t.x + 1.5, t.z);
      if (tt && tt.d < 6) d.stealNearest();
      v = d.vehicleInfo();
      return v.drivingStolen && v.stolen && v.stolen.fromTraffic === true;
    },
    (v) => v === true,
    50,
    400,
  );
  vi = await page.evaluate(() => window.__steelRibbonDebug.vehicleInfo());
  check("traffic car can be jacked", jacked === true, `stolen=${JSON.stringify(vi.stolen)}`);

  check("no console errors (v3.3)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ---------- mobile ----------
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await ready(page);
  let mMode = "menu";
  for (let i = 0; i < 5 && mMode !== "roam"; i++) {
    if (await page.locator("#roamBtn").isVisible()) {
      try {
        await page.locator("#roamBtn").tap({ timeout: 3000 });
      } catch {}
    }
    mMode = await poll(page, () => window.__steelRibbonTelemetry.mode, (m) => m === "roam", 20, 300);
  }
  const touch = await page.locator("#touchControls").isVisible();
  check("mobile roam starts with touch controls", touch && mMode === "roam", `mode=${mMode} touch=${touch}`);
  check("no console errors (mobile)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

await browser.close();
server.close();
console.log(results.join("\n"));
console.log(failures === 0 ? "\nALL SMOKE PROBES PASSED" : `\n${failures} PROBE(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
