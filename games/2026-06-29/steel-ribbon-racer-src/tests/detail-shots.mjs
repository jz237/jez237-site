// Zoom-detail loop shot rig: screenshots at near/mid/far around pedestrians,
// traffic, and storefronts + perf numbers. Serves ../steel-ribbon-racer.
// Run: npm run build && node tests/detail-shots.mjs [shot-set-name]
// Output: loop-shots/<shot-set-name>/ (gitignored). Gotchas: never toggle cockpit
// before freecam shots (the shell stays visible under __freeCam); aim at cars with
// probeDown() ground Y, not a guessed Y, or the camera lands under the ribbon in fog.
import { chromium } from "@playwright/test";
import { createServer } from "http";
import { readFileSync, existsSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "steel-ribbon-racer");
const out = join(here, "..", "loop-shots", process.argv[2] || "adhoc");
mkdirSync(out, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".mp3": "audio/mpeg" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = join(root, p);
  if (existsSync(f) && statSync(f).isFile()) {
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  } else { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/`;
const report = { url, shots: {}, data: {} };

async function poll(page, fn, pred, tries = 120, interval = 250) {
  for (let i = 0; i < tries; i++) {
    const v = await page.evaluate(fn);
    if (pred(v)) return v;
    await page.waitForTimeout(interval);
  }
  return await page.evaluate(fn);
}
async function ready(page) {
  await page.waitForFunction(() => window.__steelRibbonDebug && window.__steelRibbonTelemetry, null, { timeout: 30000 });
  await page.waitForTimeout(800);
}
async function shot(page, name) {
  await page.waitForTimeout(400); // let a few frames render after camera moves
  await page.screenshot({ path: join(out, name + ".png") });
  report.shots[name] = true;
  console.log("shot:", name);
}
// fly camera to a point at given distance from a target, looking at it
async function flyAt(page, t, dist, opts = {}) {
  const dy = opts.dy ?? Math.max(1.6, dist * 0.32);
  const dx = (opts.dirx ?? 0.7) * dist, dz = (opts.dirz ?? 0.7) * dist;
  await page.evaluate(([t, dx, dy, dz]) =>
    window.__steelRibbonDebug.flyCam(t.x + dx, t.y + dy, t.z + dz, t.x, t.y + 1.1, t.z),
    [t, dx, dy, dz]);
}

const browser = await chromium.launch({
  args: ["--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding"],
});
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

// ---- menu + baselines ----
await page.goto(url, { waitUntil: "networkidle" });
await ready(page);
await shot(page, "01-menu");
report.data.sceneryCounters = await page.evaluate(() => window.__steelRibbonDebug.sceneryCounters());
report.data.trafficInfo = await page.evaluate(() => window.__steelRibbonDebug.trafficInfo());
report.data.courses = await page.evaluate(() => window.__steelRibbonDebug.listCourses());

// ---- race mode: default chase view (THE perf baseline view) ----
await page.locator("#startBtn").click();
await page.keyboard.down("ArrowUp");
await poll(page, () => window.__steelRibbonTelemetry, (t) => t.mode === "race" && t.speed > 20);
await page.keyboard.up("ArrowUp");
report.data.renderInfoChase = await page.evaluate(() => window.__steelRibbonDebug.renderInfo());
report.data.viewInfoChase = await page.evaluate(() => window.__steelRibbonDebug.viewInfo());
await shot(page, "02-race-chase");
await page.evaluate(() => window.__steelRibbonDebug.setTrackView("cockpit"));
await shot(page, "03-race-cockpit");
await page.evaluate(() => window.__steelRibbonDebug.setTrackView("chase"));
report.data.drawAudit = await page.evaluate(() => window.__steelRibbonDebug.drawAudit(18));

// ---- find pedestrians (groups with userData.limbs) ----
const peds = await page.evaluate(() => {
  const outp = [];
  window.__steelRibbonScene.traverse((o) => {
    if (o.userData && o.userData.limbs && outp.length < 300) {
      const v = o.getWorldPosition(new o.position.constructor());
      outp.push({ x: +v.x.toFixed(1), y: +v.y.toFixed(1), z: +v.z.toFixed(1) });
    }
  });
  return outp;
});
report.data.pedCount = peds.length;
// pick a pedestrian near the city center-ish for good surroundings
let ped = peds[0] || null;
if (peds.length) {
  peds.sort((a, b) => Math.hypot(a.x, a.z + 500) - Math.hypot(b.x, b.z + 500));
  ped = peds[0];
}
report.data.pedSample = ped;

if (ped) {
  await flyAt(page, ped, 8, { dy: 2.2 });
  await shot(page, "04-ped-near-8m");
  await flyAt(page, ped, 40);
  await shot(page, "05-ped-mid-40m");
  await flyAt(page, ped, 150);
  await shot(page, "06-ped-far-150m");
  // street canyon: eye-height along the sidewalk
  await page.evaluate(([p]) =>
    window.__steelRibbonDebug.flyCam(p.x, p.y + 1.7, p.z + 14, p.x, p.y + 1.5, p.z - 40), [ped]);
  await shot(page, "07-street-canyon-eye");
  // building face from ~8m: look sideways from the pedestrian across the sidewalk
  await page.evaluate(([p]) =>
    window.__steelRibbonDebug.flyCam(p.x, p.y + 2.0, p.z, p.x + 30, p.y + 6, p.z), [ped]);
  await shot(page, "08-building-face-8m");
  // nearest traffic car to the pedestrian
  const car = await page.evaluate(([p]) => window.__steelRibbonDebug.nearestTrafficCar(p.x, p.z), [ped]);
  report.data.carSample = car;
  if (car) {
    const ct = { x: car.x, y: ped.y, z: car.z };
    await flyAt(page, ct, 7, { dy: 1.8 });
    await shot(page, "09-car-near-7m");
    // rear view for plate area
    await flyAt(page, ct, 6, { dy: 1.4, dirx: -0.7, dirz: -0.7 });
    await shot(page, "10-car-rear-6m");
  }
}
report.data.renderInfoAfterFly = await page.evaluate(() => window.__steelRibbonDebug.renderInfo());

// ---- roam mode: what the PLAYER can actually see on foot ----
await page.goto(url, { waitUntil: "networkidle" });
await ready(page);
const roamBtn = page.locator("#roamBtn");
if (await roamBtn.isVisible().catch(() => false)) {
  await roamBtn.click();
  await poll(page, () => window.__steelRibbonTelemetry, (t) => t.mode === "roam");
  if (ped) {
    // stand ~6m from the pedestrian, facing every 90° (yaw convention unknown)
    for (const [i, yaw] of [0, Math.PI / 2, Math.PI, -Math.PI / 2].entries()) {
      await page.evaluate(([p, y]) => window.__steelRibbonDebug.setRoamPos(p.x + 4, p.z + 4, y, 0), [ped, yaw]);
      await shot(page, `11-roam-pov-yaw${i}`);
    }
  } else {
    await shot(page, "11-roam-pov");
  }
  report.data.renderInfoRoam = await page.evaluate(() => window.__steelRibbonDebug.renderInfo());
  report.data.roamView = await page.evaluate(() => window.__steelRibbonDebug.viewInfo());
}

report.errors = errors.slice(0, 10);
writeFileSync(join(out, "survey.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.data, null, 1));
await browser.close();
server.close();
