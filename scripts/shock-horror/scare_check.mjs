// Shock Horror: stage every scare archetype in headless Edge and screenshot it, collect console errors.
//   node scripts/shock-horror/scare_check.mjs [baseUrl] [shotDir] [archetypes,comma,list]
// Needs a static server on the repo root (e.g. python -m http.server 8797). Every scare is forced with
// __gd.S.force(id) at a few random standable spots of a depth until it stages, then the world is ticked and
// a frame is captured partway through. Prints a table of archetype -> result and the console errors.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const base = process.argv[2] || 'http://127.0.0.1:8797/games/2026-11-07/shock-horror/';
const shots = process.argv[3] || 'D:/Projects/.tmp/shock-horror-work/shots';
const only = process.argv[4] ? new Set(process.argv[4].split(',')) : null;
fs.mkdirSync(shots, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text().slice(0, 240)); });
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 240)));
await page.goto(base + 'index.html?fixed&noscores', { waitUntil: 'load' });
await page.waitForFunction(() => window.__gd && window.__gd.G && window.__gd.G.state === 'title', null, { timeout: 150000 });
await page.evaluate(() => { localStorage.setItem('sh.warned', '1'); });

const ids = await page.evaluate(() => {
  // one catalogue entry per archetype (plus a second for the big families)
  const seen = {}, out = [];
  for (const [a, id, d] of window.__gd.scareList()) { seen[a] = (seen[a] || 0) + 1; if (seen[a] <= 1) out.push([a, id, d]); }
  return out;
});
const results = [];
let n = 0;
for (const [arch, id, d] of ids) {
  if (only && !only.has(arch)) continue;
  const depth = d >= 0 ? d : n % 5;
  const r = await page.evaluate(async ({ id, depth }) => {
    const g = window.__gd;
    g.startCampaign(depth, { seed: 1000 + depth, level: 0 });
    g.tick(200, 1 / 60, false);   // the lift comes down
    const W = g.W, M = W.M, P = W.players[0];
    // switch the director's own timed scares off so only the forced one runs
    g.S.cool = 999; g.S.bigCool = 999;
    const snap = () => { g.R.cam.x = P.x + P.face * 1.4; g.R.cam.y = P.y + 1.3; g.R.cam.d = 15.5; };   // ticks without drawing never move the camera
    snap();
    let res = 'nostage';
    for (let k = 0; k < 40 && res !== 'ok'; k++) {
      // a random standable cell (k = 0: where the lift dropped us)
      if (k > 0) {
        for (let tries = 0; tries < 400; tries++) {
          const tx = 2 + Math.floor(Math.random() * (M.w - 4)), ty = 2 + Math.floor(Math.random() * (M.h - 4));
          if (!g.S.standable(tx, ty)) continue;
          P.x = tx + 0.5; P.y = ty; P.vx = 0; P.vy = 0; P.face = Math.random() < 0.5 ? 1 : -1; P.ground = true;
          break;
        }
        g.tick(4, 1 / 60, false); snap();
        g.S.cool = 999;
      }
      res = g.S.force(id);
    }
    g.tick(1, 1 / 60, true);
    return { res, x: P.x, y: P.y };
  }, { id, depth });
  let shot = '';
  if (r.res === 'ok') {
    // run it for a while and capture the moment it lands
    const at = { face: 0.75, lampout: 1.75, drop: 0.45, rush: 0.62, burst: 0.4, hands: 0.4, lookup: 1.4, closer: 2.8, write: 1.6, stand: 1.4, eyes: 1.6, bleed: 2.5, glitch: 0.1, invert: 0.1, fakedeath: 1.5, wallface: 1.6, walker: 2.5, swarm: 1.4, ceiling: 2.0, wings: 0.8, fall: 0.9, photo: 1.2, hanging: 1.2 }[arch] ?? 1.2;
    await page.evaluate((t) => { const g = window.__gd, P = g.W.players[0]; g.tick(Math.round(t * 60), 1 / 60, false); g.R.cam.x = P.x + P.face * 1.4; g.R.cam.y = P.y + 1.3; }, at);
    await page.evaluate(() => window.__gd.tick(1, 1 / 60, true));
    shot = `${shots}/${String(n).padStart(2, '0')}_${arch}.png`;
    await page.screenshot({ path: shot });
    await page.evaluate(() => { const j = document.getElementById('jump'); if (j) j.className = 'hidden'; window.__gd.tick(240, 1 / 60, false); });
  }
  results.push([arch, id, r.res]);
  console.log(arch.padEnd(10), r.res.padEnd(8), id);
  n++;
}
const st = await page.evaluate(() => window.__gd.scares());
console.log('started', st.stats.started, 'ledger', st.seen);
console.log('ERRORS', errors.length); for (const e of [...new Set(errors)].slice(0, 30)) console.log('  ' + e);
await browser.close();
