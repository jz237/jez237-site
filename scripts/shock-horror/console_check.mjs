// Browser check (Playwright + headless Edge):
//   - the ?test=1 self-test page passes
//   - ?fixed frames of depth 1 (the gentle start), every depth, every guardian, phone portrait + landscape
//   - the attract demo starts by itself after ~14 s idle on the title
//   - AI PLAYTHROUGH from the depth 1 guardian: it falls, the store shows, the run rolls on into depth 2
//   - a real game over shows the initials prompt; the title shows the version
//   - shader programs stay flat after warm-up; no console errors; no score POSTs (all intercepted)
//   node scripts/shock-horror/console_check.mjs [baseUrl=http://127.0.0.1:8795/games/2026-11-07/shock-horror/] [shotDir]
//   ONLY=test,frames,demo,playthrough,title picks sections
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const base = process.argv[2] || 'http://127.0.0.1:8795/games/2026-11-07/shock-horror/';
const shots = process.argv[3] || 'D:/Projects/.tmp/shock-horror-work/shots';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean), want = (k) => !ONLY.length || ONLY.includes(k);
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; return c; };
const errors = [], posts = [], t0 = Date.now();
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
async function open(viewport = { width: 1280, height: 720 }, touch = false) {
  const ctx = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch });
  await ctx.route('**/game-scores.jez237.workers.dev/**', (r) => {
    if (r.request().method() === 'POST') { posts.push(r.request().url()); return r.fulfill({ status: 200, body: '{}' }); }
    return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ initials: 'ACE', score: 182400, extra: 'D5 BOSS' }]) });
  });
  await ctx.route('**/fonts.g*/**', (r) => r.abort());
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g|ERR_FAILED|net::/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.ctx = ctx;
  return page;
}
const ev = (p, fn, a) => p.evaluate(fn, a);
const fixedTitle = async (p, q = '') => {
  await p.goto(base + '?fixed&noscores&seed=5' + q);
  await p.waitForFunction(() => window.__gd && window.__gd.G.state === 'title', null, { timeout: 60000 });
  await ev(p, () => { document.getElementById('descend').style.display = 'none'; });
};
const play = (p, n) => ev(p, (n) => { window.__gd.tick(Math.max(0, n - 90), 1 / 60, false); window.__gd.tick(Math.min(n, 90)); }, n);
const snap = (p, name) => p.screenshot({ path: `${shots}/check_${name}.png` });
const programs = (p) => ev(p, () => window.__gd.R.r.info.programs.length);
async function runUntil(p, cond, maxFrames = 20000, chunk = 600) {
  for (let f = 0; f < maxFrames; f += chunk) {
    const done = await ev(p, ([c, n]) => { for (let i = 0; i < n; i += 30) { window.__gd.tick(30, 1 / 60, false); if ((0, eval)(c)) return true; } return false; }, [cond, chunk]);
    if (done) return true;
  }
  return false;
}
try {
  const page = await open();
  if (want('test')) {
    await page.goto(base + '?test=1');
    await page.waitForFunction(() => window.__gdTests && window.__gdTests.done, null, { timeout: 300000 });
    for (const r of (await ev(page, () => window.__gdTests)).results) ok(r.ok, `self-test: ${r.name} (${r.info})`);
    await snap(page, 'selftest');
  }
  if (want('frames')) {
    await fixedTitle(page);
    await ev(page, () => window.__gd.startCampaign(0, { seed: 77 }));
    await play(page, 60 * 2);
    const boot = await programs(page);
    await ev(page, () => window.__gd.auto('human'));
    await play(page, 60 * 12);
    await snap(page, 'd1_start');
    const s1 = await ev(page, () => { const W = window.__gd.W; return { bats: W.bats.length, crawlers: W.crawlers.length, stal: W.stalac.length, hits: W.stats.hits, t: W.t }; });
    ok(s1.hits === 0, `depth 1 level 1: a gentle start (${s1.bats} bats, ${s1.crawlers} beetles, ${s1.stal} stalactites in the level, no hits in the first ${s1.t.toFixed(0)} s)`);
    for (let d = 0; d < 5; d++) {
      await ev(page, (d) => window.__gd.startCampaign(d, { level: 1, auto: 'demo', seed: 9 + d }), d);
      await play(page, 60 * 15);
      await snap(page, `depth${d + 1}`);
    }
    for (let d = 0; d < 5; d++) {
      await ev(page, (d) => window.__gd.startCampaign(d, { level: 3, auto: 'demo', seed: 3 }), d);
      await play(page, 60 * 16);
      await snap(page, `guardian${d + 1}`);
      ok(await ev(page, () => !!window.__gd.W.boss && window.__gd.W.boss.awake), `guardian ${d + 1}: wakes and fights`);
    }
    const warm = await programs(page);
    for (let d = 0; d < 5; d++) for (const l of [1, 3]) { await ev(page, ([d, l]) => window.__gd.startCampaign(d, { level: l, auto: 'demo', seed: 21 + d }), [d, l]); await play(page, 60 * 6); }
    const after = await programs(page);
    ok(after === warm, `shader programs: ${boot} after the first level, ${warm} once every depth and guardian has been seen, ${after} after a second pass (no new ones)`);
    // a real game over: last life, last heart, no oil, the dark is about to bite
    await ev(page, () => {
      window.__gd.startCampaign(0, { level: 1, seed: 5 });
      const W = window.__gd.W, P = W.players[0];
      W.score = 12345; W.lives = 0; P.hp = 1; P.oil = 0; P.darkT = 19.5; P.inCage = false; W.cage.state = 'landed'; P.y = W.M.start.y;
    });
    const over = await runUntil(page, "window.__gd.G.screen === 'results'", 6000, 120);
    ok(over && await ev(page, () => !document.getElementById('ini-wrap').classList.contains('hidden')), 'game over: the results ask for 3 initials');
    await snap(page, 'gameover');
    for (const [vp, name] of [[{ width: 412, height: 915 }, 'phone_portrait'], [{ width: 915, height: 412 }, 'phone_landscape']]) {
      const ph = await open(vp, true);
      await fixedTitle(ph);
      await snap(ph, name + '_title');
      await ev(ph, () => { window.__gd.settings.touch = 'on'; window.__gd.startCampaign(1, { level: 0, seed: 4 }); });
      await play(ph, 60 * 6);
      await snap(ph, name);
      await ph.ctx.close();
    }
  }
  if (want('demo')) {
    await fixedTitle(page);
    const started = await runUntil(page, "window.__gd.G.mode === 'demo'", 60 * 20, 60);
    ok(started, 'attract demo starts by itself after about 14 s idle on the title');
    await play(page, 60 * 10);
    await snap(page, 'demo');
    ok(await ev(page, () => window.__gd.G.mode === 'demo' && !document.getElementById('demo-badge').classList.contains('hidden')), 'attract demo plays with the DEMO badge');
  }
  if (want('playthrough')) {
    await page.goto(base + '?playthrough&fixed&noscores&seed=2&depth=0&level=3');
    await page.waitForFunction(() => window.__gd && window.__gd.G.mode === 'playthrough', null, { timeout: 60000 });
    const shop = await runUntil(page, "window.__gd.G.state === 'shop'", 60 * 240, 300);
    ok(shop, 'AI PLAYTHROUGH: the depth 1 guardian falls and the general store opens');
    await snap(page, 'playthrough_shop');
    const rolled = await runUntil(page, "window.__gd.G.state === 'play' && window.__gd.W.depth === 1", 60 * 30, 60);
    ok(rolled, 'AI PLAYTHROUGH: buys gear and rolls on into depth 2 by itself');
    await play(page, 60 * 8);
    await snap(page, 'playthrough_d2');
  }
  if (want('museum')) {
    await fixedTitle(page);
    await ev(page, () => { window.__gd.journal.relic.push(0, 2, 5); window.__gd.journal.fossil.push(0); });
    await page.click('#title [data-act="museum"]');
    await ev(page, () => window.__gd.tick(120));
    await snap(page, 'museum');
    ok(await ev(page, () => window.__gd.G.state === 'museum' && !document.getElementById('museum').classList.contains('hidden')), 'museum: opens from the title and draws the hall');
    await page.click('[data-act="mus-next"]'); await ev(page, () => window.__gd.tick(60));
    await page.keyboard.press('Escape'); await ev(page, () => window.__gd.tick(10));
    ok(await ev(page, () => window.__gd.G.state === 'title'), 'museum: walks to the next alcove and back to the title');
  }
  if (want('title')) {
    const tp = await open();
    await tp.goto(base + '?noscores&seed=3');
    await tp.waitForFunction(() => window.__gd && window.__gd.G.state === 'title', null, { timeout: 60000 });
    await tp.waitForTimeout(1500);
    const ver = await ev(tp, () => window.__gd.VERSION);
    ok(await ev(tp, (v) => document.getElementById('title').textContent.includes('VERSION ' + v), ver), `title: shows the version (VERSION ${ver})`);
    await snap(tp, 'title');
    await tp.ctx.close();
  }
  ok(!errors.length, `no console errors${errors.length ? ':\n  ' + [...new Set(errors)].slice(0, 10).join('\n  ') : ''}`);
  ok(!posts.length, `no score POSTs (${posts.length} intercepted)`);
} catch (e) { console.error('check crashed:', e.stack || e.message); fail++; }
await browser.close();
console.log(`${fail ? 'FAIL' : 'PASS'} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(fail ? 1 : 0);
