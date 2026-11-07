// Performance check (Playwright + headless Edge). Headless frame times say little about a real GPU, so this
// checks what causes hitches on phones instead:
//   1. no shader compiles during play: WebGL compileShader / linkProgram are counted from page start; after
//      the boot warm-up (R.warmUp) the count must not move while every sector, its webs, the dive, all five
//      bosses (with their kills and explosions), power-ups and ENDLESS DESCENT are played (?fixed frames)
//   2. renderer.info.programs stays at the warm-up count
//   3. no long CPU frames: each frame's JS time (sim + render submit, one tick) is timed; frames over 50 ms
//      after the first second of each scene are listed (a compile or a big allocation would show here)
//   4. draw calls and triangles per frame, and the lights: the light count must never change
//   node scripts/rimstorm/perf_check.mjs [baseUrl=http://127.0.0.1:8772/games/2026-11-06/rimstorm/] [quality=high]
// Needs the static server (serve.py on 8772) and the shared Edge lock (see README).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const q = process.argv[3] || 'high';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
let posts = 0;
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
  if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
  return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
});
// count every shader compile and program link, from the first script on
await page.addInitScript(() => {
  window.__gl = { compile: 0, link: 0 };
  for (const C of [window.WebGL2RenderingContext, window.WebGLRenderingContext]) {
    if (!C) continue;
    const c = C.prototype.compileShader, l = C.prototype.linkProgram;
    C.prototype.compileShader = function (...a) { window.__gl.compile++; return c.apply(this, a); };
    C.prototype.linkProgram = function (...a) { window.__gl.link++; return l.apply(this, a); };
  }
});
await page.goto(base + `?fixed&noscores&q=${q}`);
await page.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
const boot = await page.evaluate(() => ({ ...window.__gl, prog: window.__rs.R.r.info.programs.length }));
console.log(`after boot + warm-up: ${boot.compile} shader compiles, ${boot.link} program links, ${boot.prog} programs (quality ${q})`);

// scenes: [label, setup in page, frames]
const scenes = [
  ['S1 web 1', 'rs.startCampaign(0, 0)', 900],
  ['S1 boss', 'rs.startCampaign(0, 4)', 1500],
  ['S2 web 3', 'rs.startCampaign(1, 2)', 900],
  ['S2 boss', 'rs.startCampaign(1, 4)', 1800],
  ['S3 web 2', 'rs.startCampaign(2, 1)', 900],
  ['S3 boss', 'rs.startCampaign(2, 4)', 1800],
  ['S4 web 4', 'rs.startCampaign(3, 3)', 900],
  ['S4 boss', 'rs.startCampaign(3, 4)', 2400],
  ['S5 web 3', 'rs.startCampaign(4, 2)', 900],
  ['S5 boss', 'rs.startCampaign(4, 4)', 2400],
  ['endless', 'rs.startEndless()', 1500],
];
const out = [];
let longTotal = 0;
for (const [label, setup, frames] of scenes) {
  const r = await page.evaluate(({ setup, frames }) => {
    const rs = window.__rs;
    rs.G.autopilot = true;
    // eslint-disable-next-line no-new-func
    new Function('rs', setup)(rs);
    const ms = [], calls = [], tris = [];
    rs.R.r.info.autoReset = false;   // count every pass of a frame (scene, bloom, composite), not just the last
    let lights = -1, lightsChanged = false;
    for (let i = 0; i < frames && rs.G.state === 'play'; i++) {
      // fast-forward the slow fights a little (2 sim steps per frame) so bosses fall in the window
      rs.R.r.info.reset();
      const t = performance.now();
      rs.tick(1, 1 / 30);
      ms.push(performance.now() - t);
      const info = rs.R.r.info.render;
      calls.push(info.calls); tris.push(info.triangles);
      let n = 0; rs.R.scene.traverse((o) => { if (o.isLight) n++; });
      if (lights < 0) lights = n; else if (n !== lights) lightsChanged = true;
    }
    rs.R.r.info.autoReset = true;
    const W = rs.W;
    const tail = ms.slice(60);
    const sorted = [...tail].sort((a, b) => a - b);
    return {
      frames: ms.length, p50: sorted[sorted.length >> 1] || 0, p99: sorted[Math.floor(sorted.length * 0.99)] || 0, max: Math.max(0, ...tail),
      long: tail.filter((x) => x > 50).length, calls: [Math.min(...calls), Math.max(...calls)], tris: [Math.min(...tris), Math.max(...tris)],
      lights, lightsChanged, gl: { ...window.__gl }, prog: rs.R.r.info.programs.length, web: W.web, phase: W.phase, boss: W.boss ? W.boss.key : '', kills: W.stats.kills, result: W.result || '',
    };
  }, { setup, frames });
  longTotal += r.long;
  out.push({ label, ...r });
  console.log(`${label.padEnd(9)} ${String(r.frames).padStart(4)} frames  js p50 ${r.p50.toFixed(1)} p99 ${r.p99.toFixed(1)} max ${r.max.toFixed(1)} ms  >50 ms: ${r.long}  draws ${r.calls[0]}-${r.calls[1]}  tris ${(r.tris[0] / 1000).toFixed(0)}-${(r.tris[1] / 1000).toFixed(0)}k  lights ${r.lights}${r.lightsChanged ? ' CHANGED' : ''}  compiles ${r.gl.compile - boot.compile} links ${r.gl.link - boot.link} programs ${r.prog}  (${r.kills} kills${r.boss ? ', ' + r.boss : ''}${r.result ? ', ' + r.result : ''})`);
  await page.evaluate(() => window.__rs.toTitle());
}
await browser.close();
const last = out[out.length - 1];
const compiles = last.gl.compile - boot.compile, links = last.gl.link - boot.link;
const progOk = out.every((r) => r.prog === boot.prog), lightsOk = out.every((r) => !r.lightsChanged);
console.log(`shader compiles during play: ${compiles}, program links: ${links} -> ${compiles || links ? 'FAIL' : 'none'}`);
console.log(`programs: ${progOk ? 'CONSTANT at ' + boot.prog : 'CHANGED'} · lights: ${lightsOk ? 'never added or removed' : 'CHANGED'} · frames over 50 ms of JS: ${longTotal}`);
console.log(errors.length ? `console errors: ${errors.length}\n  ` + [...new Set(errors)].slice(0, 8).join('\n  ') : 'console errors: 0');
console.log(`score POSTs attempted: ${posts}`);
process.exit(compiles || links || !progOk || !lightsOk || errors.length || posts || longTotal > 3 ? 1 : 0);
