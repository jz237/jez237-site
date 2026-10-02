#!/usr/bin/env node
// Interaction smoke test for the APX-9 exploded view: real keyboard + mouse events against the served page.
//
//   node uitest.cjs [--q "only=wings"] [--w 1400 --h 900] [--noqa] [--shots <prefix>]
//
// Prints one PASS/FAIL line per check and exits non-zero when any check fails.
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
const W = parseInt(args.w || '1400', 10), H = parseInt(args.h || '900', 10);
const ROOT = path.resolve(args.root || path.join(__dirname, '../../../demos/apx9-bee'));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let fails = 0, total = 0;
function check(name, ok, info) {
  total++;
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info !== undefined ? '  ' + (typeof info === 'string' ? info : JSON.stringify(info)) : ''}`);
}

(async () => {
  const srv = await serve();
  const port = srv.address().port;
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=vulkan', '--enable-features=Vulkan', '--ignore-gpu-blocklist', `--window-size=${W},${H}`],
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
  });
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', (e) => errors.push(String(e.stack || e).slice(0, 500)));
    page.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text().slice(0, 300)); });
    const url = `http://127.0.0.1:${port}/index.html?${args.noqa ? '' : 'qa=1&'}${args.q || ''}`;
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(() => document.body.classList.contains('ready') || document.body.classList.contains('failed'), { timeout: 180000 });
    check('page boots', await page.evaluate(() => document.body.classList.contains('ready')));
    await sleep(args.noqa ? 4500 : 500);

    const $ = (sel) => page.evaluate((s) => { const e = document.querySelector(s); return !!e && !e.hidden && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden'; }, sel);
    const ev = (fn, ...a) => page.evaluate(fn, ...a);
    const press = async (k, wait = 120) => { await page.keyboard.press(k); await sleep(wait); };
    const shot = async (n) => { if (args.shots) await page.screenshot({ path: `${args.shots}-${n}.png` }); };

    check('ui initialised', await ev(() => !!window.__apx.ui));
    await page.mouse.move(W / 2, 40);

    /* ---------- keyboard ---------- */
    await press('2', 300);
    check('key 2 -> side view button active', await ev(() => document.querySelector('.view-btn.on')?.dataset.view === 'side'));
    await press('1', 300);
    check('key 1 -> hero view button active', await ev(() => document.querySelector('.view-btn.on')?.dataset.view === 'hero'));
    await press('x');
    check('key x -> x-ray on', await ev(() => window.__apx.selection.xray === true));
    await press('x');
    check('key x again -> x-ray off', await ev(() => window.__apx.selection.xray === false));
    const labels0 = await $('#labels');
    await press('l');
    const labels1 = await $('#labels');
    check('key l toggles the callout layer', labels0 !== labels1, { before: labels0, after: labels1 });
    await press('l');
    await press('p', 200);
    check('key p opens the parts directory', await $('.directory'));
    await shot('dir');
    await press('p', 200);
    check('key p closes the parts directory', !(await $('.directory')));
    await press('s', 200);
    check('key s opens specifications', await $('.specs'));
    await press('Escape', 200);
    check('Esc closes specifications', !(await $('.specs')));
    await press('?', 250);
    check('? opens the controls overlay', await $('.help'));
    await press('Tab', 100);
    check('focus stays inside the overlay', await ev(() => !!document.activeElement?.closest('.help')));
    await press('Escape', 250);
    check('Esc closes the controls overlay', !(await $('.help')));
    await press('t', 500);
    check('key t starts the tour', await $('.tour'));
    const step1 = await ev(() => document.querySelector('.tour-step')?.textContent);
    await press('ArrowRight', 300);
    const step2 = await ev(() => document.querySelector('.tour-step')?.textContent);
    check('ArrowRight advances the tour', step1 !== step2, { step1, step2 });
    await press('ArrowLeft', 300);
    check('ArrowLeft goes back', (await ev(() => document.querySelector('.tour-step')?.textContent)) === step1);
    await press('Escape', 400);
    check('Esc ends the tour', !(await $('.tour')));

    /* ---------- explode ---------- */
    await ev(() => window.__apx.setExplode(0, 0));
    await press(' ', 2800);
    const e1 = await ev(() => window.__apx.getExplode());
    check('Space explodes', e1 > 0.95, e1);
    await shot('exploded');
    await press(' ', 2800);
    const e0 = await ev(() => window.__apx.getExplode());
    check('Space reassembles', e0 < 0.05, e0);
    await page.focus('.dock-slider input[type="range"]');
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
    await sleep(200);
    check('slider keyboard drives the explode value', (await ev(() => window.__apx.getExplode())) > 0.003, await ev(() => window.__apx.getExplode()));
    await page.evaluate(() => document.activeElement.blur());
    await ev(() => window.__apx.setExplode(0, 0));
    await press('c', 300);
    check('key c starts auto-cycle', await ev(() => document.querySelector('.play')?.getAttribute('aria-pressed') === 'true'));
    await press('c', 300);
    check('key c stops auto-cycle', await ev(() => document.querySelector('.play')?.getAttribute('aria-pressed') === 'false'));
    await ev(() => window.__apx.setExplode(0, 0));

    /* ---------- pointer ---------- */
    const parts = await ev(() => window.__apx.bee.tops.map((p) => p.id));
    check('bee has top-level parts', parts.length > 0, parts.slice(0, 12));
    // Grid-scan the picker for clickable points, grouped by top-level ancestor.
    const scan = () => ev((w, h) => {
      const a = window.__apx, hits = [];
      for (let y = 140; y < h - 160; y += 18) for (let x = 340; x < w - 390; x += 18) {
        const p = a.picker.pick(x, y, a.canvas);
        if (!p) continue;
        let top = p; while (top.parent && top.parent.parent) top = top.parent;
        hits.push({ x, y, id: p.id, top: top.id });
      }
      return hits;
    }, W, H);
    let hits = await scan();
    check('picker finds parts on screen', hits.length > 10, hits.length);
    const target = hits.length ? hits[Math.floor(hits.length / 2)].id : null;
    const tpos = hits.length ? hits[Math.floor(hits.length / 2)] : null;
    if (target) {
      await page.mouse.move(tpos.x, tpos.y, { steps: 6 });
      await sleep(350);
      const hovered = await ev(() => window.__apx.selection.hovered?.id || null);
      check('hover highlights a part', !!hovered, hovered);
      check('hover shows the tooltip', await $('.tip.on'));
      await page.mouse.click(tpos.x, tpos.y);
      await sleep(500);
      const sel = await ev(() => window.__apx.selection.selected.map((p) => p.id));
      check('click selects a part', sel.length === 1, sel);
      check('inspector opens on selection', await $('.inspector'));
      check('inspector shows the part name', (await ev(() => document.querySelector('.inspector h2, .inspector .insp-name')?.textContent?.length || 0)) > 0);
      await shot('selected');
      await press('i', 200);
      check('key i isolates the selection', await ev(() => window.__apx.selection.isolate === true));
      await press('i', 200);
      await press('f', 900);
      check('key f frames without error', errors.length === 0, errors.slice(0, 2));
      await press(']', 400);
      const sel2 = await ev(() => window.__apx.selection.selected.map((p) => p.id));
      check('key ] steps to the next part', sel2.length === 1 && sel2[0] !== sel[0], sel2);
      await press('[', 400);
      check('key [ steps back', (await ev(() => window.__apx.selection.primary?.id)) === sel[0]);
      // a point that is neither a part nor covered by HUD (callout cards, dock, panels); reset the view first, a framed close-up can fill the canvas
      await press('r', 1500);
      const empty = await ev((w, h) => {
        const a = window.__apx;
        let onCanvas = 0, free = 0; const covers = {};
        for (let y = 120; y < h - 140; y += 20) for (let x = 20; x < w - 20; x += 20) {
          const el = document.elementFromPoint(x, y);
          if (el !== a.canvas) { const k = el ? el.tagName + '.' + String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) : 'null'; covers[k] = (covers[k] || 0) + 1; continue; }
          onCanvas++;
          if (a.picker.pick(x, y, a.canvas)) continue;
          free++;
          return { x, y };
        }
        return { x: 0, y: 0, none: true, onCanvas, free, covers, sel: a.selection.selected.length, iso: a.selection.isolate };
      }, W, H);
      check('empty canvas point found', !!empty && !empty.none, empty);
      if (empty && !empty.none) { await page.mouse.click(empty.x, empty.y); await sleep(300); }
      check('clicking empty space clears the selection', (await ev(() => window.__apx.selection.selected.length)) === 0);
      check('inspector closes with the selection', !(await $('.inspector.is-open')));

      await press('r', 1400);
      hits = await scan();
      const a1 = hits[0];
      const a2 = a1 && hits.find((h) => h.top !== a1.top && Math.hypot(h.x - a1.x, h.y - a1.y) > 30);
      check('two different assemblies are pickable', !!(a1 && a2), a1 && a2 ? [a1.id, a2.id] : hits.length);
      if (a1 && a2) {
        await page.mouse.click(a1.x, a1.y);
        await sleep(300);
        await page.keyboard.down('Shift');
        await page.mouse.click(a2.x, a2.y);
        await sleep(300);
        await page.keyboard.up('Shift');
        const both = await ev(() => window.__apx.selection.selected.map((p) => p.id));
        check('shift-click adds to the selection', both.length === 2, both);
        await page.keyboard.down('Shift');
        await page.mouse.click(a2.x, a2.y);
        await sleep(300);
        await page.keyboard.up('Shift');
        check('shift-click on a selected part removes it', (await ev(() => window.__apx.selection.selected.length)) === 1);
        await page.mouse.click(a1.x, a1.y, { count: 2 });
        await sleep(1100);
        check('double-click frames the part', await ev(() => window.__apx.state.framed === true));
      }
      await press('Escape', 300);
      check('Esc clears the selection', (await ev(() => window.__apx.selection.selected.length)) === 0);
    }

    /* ---------- directory search + callout click ---------- */
    await press('p', 250);
    await page.type('.directory input', 'wing', { delay: 20 });
    await sleep(300);
    const rows = await ev(() => document.querySelectorAll('.directory .dir-row, .directory [data-id]').length);
    check('directory search lists matches', rows > 0, rows);
    await shot('dir-search');
    await press('Escape', 200);
    await press('p', 200);

    if (await $('#labels')) {
      const item = await ev(() => { const it = window.__apx.ui.callouts.items.find((i) => i.vis); if (!it) return null; const r = it.el.getBoundingClientRect(); return { key: it.key, x: r.left + r.width / 2, y: r.top + 12 }; });
      if (item) {
        await page.mouse.click(item.x, item.y);
        await sleep(700);
        check('clicking a callout card selects its part', (await ev(() => window.__apx.selection.selected.length)) >= 1, item.key);
        await press('Escape', 300);
      }
    }

    /* ---------- viewport changes ---------- */
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await sleep(500);
    check('mobile: dock fits the viewport', await ev(() => { const r = document.querySelector('.dock').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; }));
    check('mobile: labels default off', !(await $('#labels')));
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await sleep(500);
    check('no page errors', errors.length === 0, errors.slice(0, 3));
  } catch (e) {
    check('test run completed', false, String(e.stack || e).slice(0, 800));
  } finally {
    await browser.close();
    srv.close();
  }
  console.log(`\n${total - fails}/${total} checks passed`);
  process.exit(fails ? 1 : 0);
})();
