// Float check (Playwright + headless Edge): nothing the level builders stand on a floor or hang from a roof may leave
// air between itself and the DRAWN rock. Every level of every depth, desktop (high: sculpted rock) and phone (medium).
//   - the builders report each prop's feet (globalThis.__gdAudit): detail rock pieces + drips, living growth, every
//     settled prop's contact points; each is measured against the rock mesh. Gap > 3 cm = floating.
//   - the fast surface query (cave.groundY / roofY) agrees with a real THREE.Raycaster on a sample
//   - kickables rest on the drawn floor; the digger's soles are on the drawn floor
//   node scripts/gold-digger/float_check.mjs [baseUrl=http://127.0.0.1:8795/games/2026-11-07/gold-digger/]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const base = process.argv[2] || 'http://127.0.0.1:8795/games/2026-11-07/gold-digger/';
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; return c; };
const t0 = Date.now();
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
for (const phone of [false, true]) {
  const ctx = await browser.newContext(phone ? { viewport: { width: 412, height: 732 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 960, height: 540 } });
  await ctx.route('**/game-scores.jez237.workers.dev/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '?fixed&noscores');
  await page.waitForFunction(() => window.__gd && window.__gd.G.state === 'title', null, { timeout: 90000 });
  const tier = await page.evaluate(() => window.__gd.R.q.name);
  for (let d = 0; d < 5; d++) for (let l = 0; l < 3; l++) {
    const r = await page.evaluate(async ([d, l, url]) => {
      const THREE = await import(new URL('vendor/three.module.min.js', url).href);
      const gd = window.__gd; window.__gdAudit = [];
      gd.startCampaign(d, { level: l, seed: 11 + d * 3 + l });
      gd.tick(2, 1 / 60, false);
      const A = window.__gdAudit; window.__gdAudit = null;
      const cave = gd.R.cave, meshes = cave.group.children, rc = new THREE.Raycaster(), o = new THREE.Vector3(), DN = new THREE.Vector3(0, -1, 0), UP = new THREE.Vector3(0, 1, 0);
      let chk = 0, bad = 0;
      for (let i = 0; i < A.length && chk < 100; i += Math.max(1, Math.floor(A.length / 100))) {
        const [mode, x, y, z] = A[i], fl = mode === 'floor', y0 = fl ? y + 0.4 : y - 0.4;
        rc.set(o.set(x, y0, z), fl ? DN : UP); rc.far = 1.5;
        const h = rc.intersectObjects(meshes, false)[0], q = fl ? cave.groundY(x, y0, z, 1.5) : cave.roofY(x, y0, z, 1.5);
        chk++;
        if ((!h) !== (q === null) || (h && Math.abs(h.point.y - q) > 0.01)) bad++;
      }
      let n = 0, nf = 0, worst = 0, what = '';
      for (const [mode, x, y, z, r, kind] of A) {
        const fl = mode === 'floor', y0 = fl ? y + 0.4 : y - 0.4, q = (xx, zz) => fl ? cave.groundY(xx, y0, zz, 1.0) : cave.roofY(xx, y0, zz, 1.0);
        const c = q(x, z);
        if (c === null) continue;
        let gap = fl ? y - c : c - y;
        if (r > 0) for (const [dx, dz] of [[r, 0], [-r, 0], [0, r * 0.8], [0, -r * 0.8]]) { const v = q(x + dx * 0.7, z + dz * 0.7); if (v !== null && Math.abs(v - c) < 0.3) gap = Math.max(gap, fl ? y - v : v - y); }
        n++;
        if (gap > 0.03) nf++;
        if (gap > worst) { worst = gap; what = kind; }
      }
      let kn = 0, kf = 0;
      for (const k of (gd.R.living && gd.R.living._kicks) || []) { const c = cave.groundY(k.x, k.y + 0.4, k.z, 1.2); if (c === null) continue; kn++; if (k.y - 0.62 * k.r - c > 0.03) kf++; }
      return { set: gd.R.living && gd.R.living.info.set, n, nf, worst: +worst.toFixed(3), what, chk, bad, kn, kf };
    }, [d, l, base]);
    ok(r.n > 300 && r.nf <= 1 && r.worst < 0.08 && r.bad <= 3 && r.kf === 0,
      `${tier} D${d + 1}L${l + 1} ${r.set}: ${r.n} feet, ${r.nf} floating (worst ${r.worst} m ${r.what || '-'}); kickables ${r.kn}, ${r.kf} floating; query vs raycast ${r.chk - r.bad}/${r.chk}`);
  }
  // the digger stands on the drawn floor (his soles within 3 cm of it)
  const feet = await page.evaluate(async (url) => {
    const THREE = await import(new URL('vendor/three.module.min.js', url).href);
    const gd = window.__gd, out = [];
    for (const [d, l] of [[0, 0], [2, 1], [4, 2]]) {
      gd.startCampaign(d, { level: l, seed: 5 }); gd.tick(140, 1 / 60, false);
      const W = gd.W, P = W.players[0], M = W.M; P.inCage = false; W.cage.state = 'up'; P.inv = 0; gd.G.run.auto = null;
      const at = (x, y) => M.tiles[y * M.w + x];
      let spot = null;
      for (let y = 2; y < M.h - 3 && !spot; y++) for (let x = 3; x < M.w - 4 && !spot; x++) if ([-2, -1, 0, 1, 2].every((k) => at(x + k, y - 1) === 1 && at(x + k, y) === 0 && at(x + k, y + 1) === 0) && Math.hypot(x - M.start.x, y - M.start.y) > 6 && (!M.exit || Math.hypot(x - M.exit.x, y - M.exit.y) > 6)) spot = [x + 0.5, y];
      P.x = spot[0]; P.y = spot[1]; P.vx = 0; P.vy = 0;
      gd.tick(40, 1 / 60, true);
      const root = gd.R.player.root; root.updateMatrixWorld(true);
      let sole = 9; root.traverse((b) => { if (b.isBone && /Toe0$/.test(b.name)) { const v = new THREE.Vector3(); b.getWorldPosition(v); sole = Math.min(sole, v.y); } });
      const g = gd.R.cave.groundY(P.x, P.y + 0.5, 0, 1.5);
      out.push([d, l, P.ground, +(sole - g).toFixed(3)]);
    }
    return out;
  }, base);
  ok(feet.every(([, , gr, s]) => gr && Math.abs(s) < 0.03), `${tier}: the digger's soles are on the drawn floor (${feet.map((f) => f[3]).join(', ')} m)`);
  ok(!errors.length, `${tier}: no page errors (${errors.slice(0, 3).join(' | ')})`);
  await ctx.close();
}
await browser.close();
console.log(`${fail ? 'FAIL' : 'PASS'} · ${Math.round((Date.now() - t0) / 1000)} s`);
process.exit(fail ? 1 : 0);
