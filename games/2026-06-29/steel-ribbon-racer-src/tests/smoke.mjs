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
  check("no console errors (roam)", errors.length === 0, errors.slice(0, 3).join(" | "));
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
