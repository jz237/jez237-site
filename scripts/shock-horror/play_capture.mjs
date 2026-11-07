// Shock Horror: watch the director in real play. The human-like autopilot plays a level with every frame drawn
// (so the camera, cinematics and fades behave exactly as in the game); each scare that starts is captured
// 0.5 s and 1.3 s in.  node scripts/shock-horror/play_capture.mjs [depth=0] [seconds=60] [outDir] [seed]
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const [dS = '0', secS = '60', out = 'D:/Projects/.tmp/shock-horror-work/play', seedS = '9001'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://127.0.0.1:8797/games/2026-11-07/shock-horror/index.html?fixed&noscores');
await page.waitForFunction(() => window.__gd && window.__gd.G && window.__gd.G.state === 'title', null, { timeout: 150000 });
await page.evaluate(({ d, seed }) => {
  const g = window.__gd;
  g.startCampaign(d, { seed, level: 1, auto: 'human' });
  window.__caps = [];
  const st = g.S.started.bind(g.S);
  g.S.started = (inst) => { st(inst); window.__caps.push({ id: inst.s.id, t: g.S.t, shots: [0.5, 1.3] }); };
}, { d: +dS, seed: +seedS });
const total = +secS * 60;
let shots = 0;
for (let f = 0; f < total; f += 6) {
  const due = await page.evaluate(() => {
    const g = window.__gd; g.tick(6, 1 / 60, true);
    const out = [];
    for (const c of window.__caps) while (c.shots.length && g.S.t - c.t >= c.shots[0]) out.push(c.id + '@' + c.shots.shift());
    return { due: out, state: g.G.state };
  });
  for (const d of due.due) { await page.screenshot({ path: `${out}/${String(shots++).padStart(3, '0')}_${d.replace(/[^a-z0-9@.]+/gi, '_')}.png` }); }
  if (due.state !== 'play') break;
}
console.log(await page.evaluate(() => window.__caps.map((c) => `${c.t.toFixed(1)} ${c.id}`).join('\n')));
console.log('shots', shots, 'errors', errors.slice(0, 5));
await browser.close();
