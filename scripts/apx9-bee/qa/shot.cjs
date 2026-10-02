#!/usr/bin/env node
// Headless QA renderer for the APX-9 exploded view. Serves demos/apx9-bee, drives window.__apx.snap(), writes PNGs.
//
//   node shot.cjs --q "only=head" --shots '[{"name":"hero","snap":{"explode":0,"view":"hero"}}]' --out /tmp/apx9/head
//   node shot.cjs --q "only=legs&demo=_kitdemo" --snap '{"explode":0.7,"yaw":30,"pitch":15}' --out /tmp/apx9/legs.png
//
// Options
//   --q <query>     extra URL query (the script always adds qa=1)       default ""
//   --shots <json|file>   array of { name, snap, pre?, wait?, w?, h?, eval? }   (pre: JS run before the snap; wait: ms before the screenshot; eval: JS run after it)
//                         (or use --snap for a single shot)
//   --snap <json>   snap options: explode, view|yaw/pitch/roll, sel, hover, xray, isolate, fit, fitSel, margin, dist, target
//   --out <path>    PNG path (single shot) or prefix (multiple shots)   default ./apx9-shot
//   --w --h --dpr   viewport                                            default 1400 x 900 @ 1
//   --eval <js>     expression evaluated in the page after the snaps; its JSON is printed
//   --root <dir>    site root to serve                                  default ../../../demos/apx9-bee
//   --hash <h>      location hash (e.g. "#p=thorax")
//   --timeout <ms>  boot timeout                                        default 180000
//   --keep          leave the console output unfiltered
const fs = require('fs');
const http = require('http');
const path = require('path');

let puppeteer;
try { puppeteer = require('/home/jez237/.npm-global/lib/node_modules/puppeteer'); } catch { puppeteer = require('puppeteer'); }

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) {
    const k = a.slice(2);
    const v = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : 'true';
    args[k] = v;
  }
}
const W = parseInt(args.w || '1400', 10), H = parseInt(args.h || '900', 10), DPR = parseFloat(args.dpr || '1');
const ROOT = path.resolve(args.root || path.join(__dirname, '../../../demos/apx9-bee'));
const TIMEOUT = parseInt(args.timeout || '180000', 10);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (err, buf) => {
        if (err) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
        res.end(buf);
      });
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

(async () => {
  let shots = [];
  if (args.shots) {
    const raw = fs.existsSync(args.shots) ? fs.readFileSync(args.shots, 'utf8') : args.shots;
    shots = JSON.parse(raw);
  } else shots = [{ name: '', snap: args.snap ? JSON.parse(args.snap) : {} }];
  const single = shots.length === 1 && !args.shots;
  const out = args.out || './apx9-shot';

  const srv = await serve();
  const port = srv.address().port;
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist', `--window-size=${W},${H}`],
    defaultViewport: { width: W, height: H, deviceScaleFactor: DPR },
  });
  let code = 0;
  try {
    const page = await browser.newPage();
    page.on('console', (m) => {
      const t = m.type();
      const txt = m.text();
      if (t === 'error' || t === 'warning' || /\[apx9\]/.test(txt) || args.keep) console.log(`[console.${t}] ${txt.slice(0, 600)}`);
    });
    page.on('pageerror', (e) => { console.log('[pageerror]', String(e.stack || e).slice(0, 900)); code = 2; });
    page.on('requestfailed', (r) => console.log('[requestfailed]', r.url()));
    page.on('response', (r) => { if (r.status() >= 400) console.log('[http ' + r.status() + ']', r.url()); });
    const url = `http://127.0.0.1:${port}/index.html?qa=1${args.q ? '&' + args.q : ''}${args.hash || ''}`;
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(() => document.body.classList.contains('ready') || document.body.classList.contains('failed'), { timeout: TIMEOUT });
    if (await page.evaluate(() => document.body.classList.contains('failed'))) {
      console.log('[FAILED] page reported a fatal error:', await page.evaluate(() => document.querySelector('.fatal-detail')?.textContent?.slice(0, 1500)));
      code = 3;
    } else {
      const info = await page.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl2'); const e = gl && gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'n/a'; });
      console.log('[gpu]', info);
      for (let i = 0; i < shots.length; i++) {
        const s = shots[i];
        if (s.w || s.h) { await page.setViewport({ width: s.w || W, height: s.h || H, deviceScaleFactor: s.dpr || DPR }); await new Promise((r) => setTimeout(r, 250)); }
        const t0 = Date.now();
        if (s.pre) await page.evaluate(s.pre);
        const stats = await page.evaluate((o) => window.__apx.snap(o), s.snap || {});
        if (s.wait) await new Promise((r) => setTimeout(r, s.wait));
        const file = single ? (out.endsWith('.png') ? out : out + '.png') : `${out}-${s.name || i}.png`;
        fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
        await page.screenshot({ path: file });
        const brief = { parts: stats.parts, meshes: stats.meshes, tris: stats.tris, calls: stats.calls, fps: stats.fps, dpr: stats.dpr, tier: stats.tier, ms: Date.now() - t0 };
        console.log('[shot]', file, JSON.stringify(brief));
        if (s.eval) console.log('[eval]', JSON.stringify(await page.evaluate(s.eval)));
        if (i === 0 && stats.report) console.log('[report]', JSON.stringify(stats.report));
      }
      if (args.eval) console.log('[eval]', JSON.stringify(await page.evaluate(args.eval)));
    }
  } catch (e) {
    console.log('[error]', String(e.stack || e).slice(0, 1500));
    code = 1;
  } finally {
    await browser.close();
    srv.close();
  }
  process.exit(code);
})();
