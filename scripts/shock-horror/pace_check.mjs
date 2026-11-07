// Shock Horror: how often the scare director fires in real play. The human-like autopilot plays a level of each
// depth for up to 150 s (headless Edge, fixed steps); prints scares per minute, big ones, and the archetype mix.
//   node scripts/shock-horror/pace_check.mjs [baseUrl] [seconds]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const base = process.argv[2] || 'http://127.0.0.1:8797/games/2026-11-07/shock-horror/';
const secs = +(process.argv[3] || 150);
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && /scare/.test(m.text()))) errors.push(m.text().slice(0, 200)); });
await page.goto(base + 'index.html?fixed&noscores', { waitUntil: 'load' });
await page.waitForFunction(() => window.__gd && window.__gd.G && window.__gd.G.state === 'title', null, { timeout: 150000 });
let all = 0, allT = 0;
const mix = {};
for (let d = 0; d < 5; d++) {
  const r = await page.evaluate(async ({ d, secs }) => {
    const g = window.__gd;
    g.startCampaign(d, { seed: 4242 + d, level: 1, auto: 'human' });
    const c0 = g.S.count;
    let t = 0;
    while (t < secs && g.G.state === 'play' && g.G.W.depth === d) { g.tick(60, 1 / 60, false); t += 1; }
    const log = g.S.log.slice(-(g.S.count - c0));
    return { t, n: g.S.count - c0, log, bigs: g.S.bigs };
  }, { d, secs });
  all += r.n; allT += r.t;
  for (const l of r.log) { const a = l.id.split(':')[0]; mix[a] = (mix[a] || 0) + 1; }
  console.log(`depth ${d + 1}: ${r.n} scares in ${r.t}s (${(r.n / r.t * 60).toFixed(1)}/min), big ${r.bigs}: ` + r.log.map((l) => `${l.t}s ${l.id}`).join(' | '));
}
console.log(`overall ${(all / allT * 60).toFixed(1)} scares/min`);
console.log('mix', JSON.stringify(mix));
console.log('errors', errors.length, [...new Set(errors)].slice(0, 10).join('\n'));
await browser.close();
