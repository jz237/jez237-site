// Shock Horror: do scares compile new shaders mid-game (a hitch), and do any frames come out all black / all white?
// Plays each depth with every frame drawn, forcing a spread of scares; samples the canvas brightness every frame.
//   node scripts/shock-horror/warm_check.mjs [baseUrl]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const base = process.argv[2] || 'http://127.0.0.1:8797/games/2026-11-07/shock-horror/';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
await page.goto(base + 'index.html?fixed&noscores');
await page.waitForFunction(() => window.__gd && window.__gd.G && window.__gd.G.state === 'title', null, { timeout: 150000 });
for (let d = 0; d < 5; d++) {
  const r = await page.evaluate((d) => {
    const g = window.__gd, R = g.R, gl = R.r.getContext();
    const lum = () => {   // mean brightness of a 16x9 grid of pixels read straight after the frame
      const px = new Uint8Array(4); let s = 0, n = 0;
      const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
      for (let y = 0; y < 9; y++) for (let x = 0; x < 16; x++) { gl.readPixels(Math.floor((x + 0.5) / 16 * w), Math.floor((y + 0.5) / 9 * h), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); s += (px[0] + px[1] + px[2]) / 3; n++; }
      return s / n;
    };
    g.startCampaign(d, { seed: 555 + d, level: 1, auto: 'human' });
    g.tick(300, 1 / 60, false);
    const P = g.W.players[0]; R.cam.x = P.x; R.cam.y = P.y + 1.3;
    g.tick(30, 1 / 60, true);
    const p0 = R.r.info.programs.length;
    const ids = g.scareList().filter((x) => x[2] < 0 || x[2] === d).map((x) => x[1]);
    const pick = []; const seen = new Set(); for (const [a, id] of g.scareList().map((x) => [x[0], x[1]])) if (!seen.has(a) && ids.includes(id)) { seen.add(a); pick.push(id); }
    let black = 0, white = 0, frames = 0, forced = 0; const bad = [];
    for (const id of pick) {
      g.S.cool = 999; g.S.bigCool = 999;
      const res = g.S.force(id); if (res === 'ok') forced++;
      for (let f = 0; f < 50; f++) {
        g.tick(1, 1 / 60, true); frames++;
        const L = lum();
        if (L < 1.0) { black++; if (bad.length < 12) bad.push(id + ' black ' + L.toFixed(1)); }
        if (L > 235) { white++; if (bad.length < 12) bad.push(id + ' white ' + L.toFixed(1)); }
      }
      if (g.G.state !== 'play') break;
    }
    return { p0, p1: R.r.info.programs.length, forced, frames, black, white, bad };
  }, d);
  console.log(`depth ${d + 1}: programs ${r.p0} -> ${r.p1}, forced ${r.forced}, frames ${r.frames}, black ${r.black}, white ${r.white}  ${r.bad.join(' | ')}`);
}
console.log('errors', errors.slice(0, 6));
await browser.close();
