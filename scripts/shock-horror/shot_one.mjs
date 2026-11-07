// Shock Horror: stage one scare and capture frames at given times (seconds after it starts).
//   node scripts/shock-horror/shot_one.mjs <scareId> [depth] [times=0.3,0.8,1.5] [outDir] [seed]
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const [id, depthS = '0', timesS = '0.3,0.8,1.5', out = 'D:/Projects/.tmp/shock-horror-work/one', seedS = '77'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://127.0.0.1:8797/games/2026-11-07/shock-horror/index.html?fixed&noscores');
await page.waitForFunction(() => window.__gd && window.__gd.G && window.__gd.G.state === 'title', null, { timeout: 150000 });
const r = await page.evaluate(({ id, depth, seed }) => {
  const g = window.__gd;
  g.startCampaign(depth, { seed, level: 0 });
  g.tick(240, 1 / 60, false);
  g.S.cool = 999; g.S.bigCool = 999;
  const W = g.W, M = W.M, P = W.players[0];
  const snap = () => { g.R.cam.x = P.x + P.face * 1.4; g.R.cam.y = P.y + 1.3; g.R.cam.d = 15.5; };   // ticks without drawing never move the camera
  snap();
  let res = g.S.force(id), k = 0;
  while (res !== 'ok' && k++ < 60) {
    for (let tries = 0; tries < 400; tries++) {
      const tx = 2 + Math.floor(Math.random() * (M.w - 4)), ty = 2 + Math.floor(Math.random() * (M.h - 4));
      if (!g.S.standable(tx, ty)) continue;
      P.x = tx + 0.5; P.y = ty; P.vx = 0; P.vy = 0; P.face = 1; P.ground = true; break;
    }
    g.tick(30, 1 / 60, false); snap(); g.S.cool = 999;
    res = g.S.force(id);
  }
  return { res, P: [P.x, P.y], cam: [g.R.cam.x, g.R.cam.y] };
}, { id, depth: +depthS, seed: +seedS });
console.log(JSON.stringify(r));
let t = 0;
for (const ts of timesS.split(',').map(Number)) {
  const n = Math.max(1, Math.round((ts - t) * 60));
  await page.evaluate((n) => window.__gd.tick(n, 1 / 60, true), n);
  t += n / 60;
  const f = `${out}/${id.replace(/[^a-z0-9]+/gi, '_')}_${ts}.png`;
  await page.screenshot({ path: f });
  console.log(f);
}
console.log('errors', errors.slice(0, 5));
await browser.close();
