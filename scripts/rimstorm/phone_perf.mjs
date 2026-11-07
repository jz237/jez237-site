// Rimstorm 2026 phone check: an S25 Ultra-class phone (412x915 portrait and 915x412 landscape, touch, Android
// Chrome user agent, deviceScaleFactor 3) with the CPU throttled 4x over CDP, on the quality tier the game picks
// for it (auto). For the busiest scenes (S4 and S5 webs, the S5 black-hole lens, the final boss) it reports draw
// calls, triangles and shader programs per frame (every pass) and the JS time per frame split into the sim (plus
// HUD) and the render submit. Headless GPU frame times mean nothing; these are the CPU-side numbers. Also
// screenshots every scene in both orientations and checks the HUD / touch buttons / tip box against the tube.
//   node scripts/rimstorm/phone_perf.mjs [baseUrl] [shotDir]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('D:/Projects/.tmp/model-s-tools/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:8785/games/2026-11-06/rimstorm/';
const OUT = (process.argv[3] || 'D:/Projects/.tmp/arcade-trio-work/rimstorm/shots/gaps') + '/';
const UA = 'Mozilla/5.0 (Linux; Android 15; SM-S938B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const errors = [];
const SCENES = [['S4 web 3', 'rs.startCampaign(3, 2)'], ['S5 web 3', 'rs.startCampaign(4, 2)'], ['S5 lens (web 4)', 'rs.startCampaign(4, 3)'], ['S5 final boss', 'rs.startCampaign(4, 4)']];
const rows = [];
for (const [orient, vp] of [['portrait', { width: 412, height: 915 }], ['landscape', { width: 915, height: 412 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: UA });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.route('**/*', (r) => { const u = r.request().url(); if (u.includes('game-scores')) return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }); if (/fonts\.(googleapis|gstatic)/.test(u)) return r.fulfill({ status: 200, contentType: 'text/css', body: '' }); return r.continue(); });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto(base + '?fixed&noscores&seed=11');
  await page.waitForFunction(() => window.__rs && __rs.G.state === 'title', null, { timeout: 180000 });
  await page.waitForTimeout(900);
  const q = await page.evaluate(() => ({ tier: __rs.quality.name, dpr: __rs.quality.dpr, canvas: [__rs.R.r.domElement.width, __rs.R.r.domElement.height], ua: /Android/.test(navigator.userAgent), coarse: matchMedia('(pointer:coarse)').matches }));
  console.log(`--- ${orient} ${vp.width}x${vp.height} DSF 3, CPU 4x: quality ${q.tier} (dpr ${q.dpr}, canvas ${q.canvas.join('x')}, Android UA ${q.ua}, coarse pointer ${q.coarse})`);
  await page.screenshot({ path: OUT + `phone_${orient}_title.png` });
  for (const [label, setup] of SCENES) {
    const r = await page.evaluate(({ setup }) => {
      const rs = window.__rs;
      localStorage.setItem('rs.tips.v1', JSON.stringify(['controls', 'rim', 'dive', 'lancer', 'spinewright', 'mite', 'shocker', 'mirror', 'pickup', 'hop']));
      rs.G.autopilot = true;
      new Function('rs', setup)(rs);
      // play into the web (the boss rises, the web fills up) before measuring
      for (let i = 0; i < 420 && rs.G.state === 'play'; i++) rs.tick(1, 1 / 60);
      const R = rs.R, orig = R.render;
      let rms = 0;
      R.render = function (...a) { const t = performance.now(); const v = orig.apply(this, a); rms += performance.now() - t; return v; };
      const tot = [], ren = [], calls = [], tris = [];
      R.r.info.autoReset = false;
      for (let i = 0; i < 240 && rs.G.state === 'play'; i++) {
        R.r.info.reset(); rms = 0;
        const t = performance.now();
        rs.tick(1, 1 / 60);
        tot.push(performance.now() - t); ren.push(rms);
        calls.push(R.r.info.render.calls); tris.push(R.r.info.render.triangles);
      }
      R.r.info.autoReset = true; R.render = orig;
      const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] || 0; };
      const p95 = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length * 0.95)] || 0; };
      const W = rs.W;
      return { frames: tot.length, tot: [med(tot), p95(tot)], ren: [med(ren), p95(ren)], sim: [med(tot.map((x, i) => x - ren[i])), p95(tot.map((x, i) => x - ren[i]))], calls: [Math.min(...calls), med(calls), Math.max(...calls)], tris: [Math.min(...tris), med(tris), Math.max(...tris)], prog: R.r.info.programs.length, enemies: W.enemies.length, boss: W.boss ? W.boss.key : '', phase: W.phase, web: W.web, lens: R.post && R.post.depthOK };
    }, { setup });
    rows.push({ orient, label, ...r });
    console.log(`${label.padEnd(16)} ${r.frames} frames  JS/frame median ${r.tot[0].toFixed(1)} ms (p95 ${r.tot[1].toFixed(1)}) = sim+HUD ${r.sim[0].toFixed(1)} (p95 ${r.sim[1].toFixed(1)}) + render submit ${r.ren[0].toFixed(1)} (p95 ${r.ren[1].toFixed(1)})  draws ${r.calls.join('/')} (min/med/max)  tris ${r.tris.map((x) => (x / 1000).toFixed(0) + 'k').join('/')}  programs ${r.prog}  (${r.enemies} enemies${r.boss ? ', ' + r.boss : ''}, ${r.phase}, web ${r.web + 1})`);
    // UI overlap: HUD panels, touch buttons, captions vs the tube (the web's far end + its middle)
    const ui = await page.evaluate(() => {
      const rs = window.__rs, W = rs.W, P = { x: 0, y: 0, z: 0 };
      rs.R.projectLane(W.nl / 2, 1, P, 0); const far = { x: P.x, y: P.y };
      const near = []; for (let l = 0; l < W.nl; l++) { rs.R.projectLane(l + 0.5, 0, P, 0); near.push({ x: P.x, y: P.y }); }
      const me = W.players[0]; rs.R.projectLane(me.lane + 0.5, 0, P, 0.6); const sled = { x: P.x, y: P.y };
      const boxes = {};
      for (const id of ['hud', 'tb-purge', 'tb-hop', 'tb-pause', 'bossbar', 'tut', 'caption', 'warns', 'banner']) {
        const el = document.getElementById(id); if (!el || el.classList.contains('hidden') || !el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        boxes[id] = { l: r.left, t: r.top, r: r.right, b: r.bottom };
      }
      const inside = (b, q, pad = 0) => q.x >= b.l - pad && q.x <= b.r + pad && q.y >= b.t - pad && q.y <= b.b + pad;
      const over = [];
      for (const [id, b] of Object.entries(boxes)) {
        if (id === 'banner' || id === 'warns') continue;
        if (inside(b, far)) over.push(`${id} covers the tube centre`);
        if (inside(b, sled, 6)) over.push(`${id} covers the Rimrunner`);
      }
      // text that wraps where it should not: the sector name and the boss name
      const wrap = [];
      // (the boss plate's hint line sits under the name by design: measure the name itself)
      for (const id of ['boss-name', 'timer', 'chain']) { const el0 = document.getElementById(id), el = el0 && (el0.querySelector('.bn') || el0); if (el && el0.offsetParent) { const r = el.getBoundingClientRect(), lh = parseFloat(getComputedStyle(el).lineHeight) || 16; if (r.height > lh * 1.9) wrap.push(id); } }
      return { over, wrap, far: [Math.round(far.x), Math.round(far.y)], sled: [Math.round(sled.x), Math.round(sled.y)] };
    });
    console.log(`  UI: ${ui.over.length ? 'OVERLAP ' + ui.over.join('; ') : 'nothing over the tube centre or the Rimrunner'}${ui.wrap.length ? ' · WRAPS ' + ui.wrap.join(',') : ''} (tube centre ${ui.far}, Rimrunner ${ui.sled})`);
    rows[rows.length - 1].ui = ui;
    await page.evaluate(() => { const rs = window.__rs; if (rs.W.boss) rs.W.boss.hitT = 0; rs.tick(1, 1 / 60); });
    await page.screenshot({ path: OUT + `phone_${orient}_${label.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.png` });
  }
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await ctx.close();
}
await browser.close();
console.log(errors.length ? `console errors: ${errors.slice(0, 4).join(' | ')}` : 'no console errors');
const bad = rows.filter((r) => r.ui && (r.ui.over.length || r.ui.wrap.length));
console.log(bad.length ? `PHONE CHECK: ${bad.length} scene(s) with UI over the play` : 'PHONE CHECK: UI clear in every scene');
process.exit(errors.length || bad.length ? 1 : 0);
