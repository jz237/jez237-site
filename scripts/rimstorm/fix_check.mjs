// Rimstorm 2026 fix check (stage 6): the results / shop screens keep the run, quick taps register, tips show
// once, the black-hole lens never bends the web, the grabbing rider rides the Rimrunner down, the attract demo
// ends without touching the world, and the phone-landscape title fits.
//   node scripts/rimstorm/fix_check.mjs [baseUrl] [shotDir]
// Needs the static server (serve.py 8772). The score worker is intercepted: GET -> a fake top 10, POST -> recorded
// and answered locally (navigator.webdriver is hidden on the score pages so the REAL post path runs; nothing
// leaves the machine). Exit 1 on any failed check or console error.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('D:/Projects/.tmp/model-s-tools/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const OUT = (process.argv[3] || 'D:/Projects/.tmp/arcade-trio-work/rimstorm/shots') + '/';
const V = '?v=7';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const errors = [], posts = [], other = [];
let fails = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };
const fakeBoard = JSON.stringify(Array.from({ length: 10 }, (_, i) => ({ initials: 'ZZZ', score: 1000 - i * 90, level: 1 })));
async function open(url, opt = {}) {
  const ctx = await browser.newContext({ viewport: opt.vp || { width: 1280, height: 720 }, hasTouch: !!opt.touch, isMobile: !!opt.mobile, deviceScaleFactor: 1 });
  if (opt.hideWebdriver) await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }); });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${url}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${url}: pageerror: ${e.message}`));
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.includes('game-scores.jez237.workers.dev')) {
      if (route.request().method() === 'POST') { posts.push({ url: u, body: route.request().postData() }); return route.fulfill({ status: 200, body: '{}' }); }
      return route.fulfill({ status: 200, contentType: 'application/json', body: fakeBoard });
    }
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
    if (!u.startsWith('http://127.0.0.1:') && !u.startsWith('data:') && !u.startsWith('blob:')) { other.push(u); return route.abort(); }
    return route.continue();
  });
  await page.goto(base + url);
  await page.waitForFunction(() => window.__rs && window.__rs.G.state && window.__rs.G.state !== 'boot', null, { timeout: 120000 });
  await page.evaluate(async (v) => { window.__AI = (await import('./js/ai.js' + v)).Autopilot; }, V);
  return { page, ctx };
}
const st = (p) => p.evaluate(() => ({ state: __rs.G.state, screen: __rs.G.screen, mode: __rs.G.mode, score: __rs.W && __rs.W.score, ini: __rs.G.ini && __rs.G.ini.chars.join('') }));
async function tickUntil(p, cond, max = 6000, dt = 0.1, chunk = 20) {
  for (let i = 0; i < max; i += chunk) {
    const done = await p.evaluate(([c, n, d]) => { const f = new Function('return ' + c); for (let k = 0; k < n; k++) { if (f()) return true; __rs.tick(1, d); } return !!f(); }, [cond, chunk, dt]);
    if (done) return true;
  }
  return false;
}
// score a little with the autopilot, then sit still until the run is over (the results screen opens on a timer)
async function scoreThenDie(p, mode) {
  await p.evaluate((m) => { if (m === 'endless') __rs.startEndless(); else __rs.startCampaign(0, 0); __rs.G.ai = new window.__AI(3, 'demo'); }, mode);
  await p.evaluate(() => { for (let i = 0; i < 1200; i++) __rs.tick(1, 1 / 60); __rs.G.ai = null; });
  await tickUntil(p, "__rs.G.state !== 'play'", 8000, 0.1, 20);
  await p.waitForFunction(() => __rs.G.state === 'results', null, { timeout: 6000 }).catch(() => {});
}

// ---------------------------------------------------------------- 1. results: P / Escape / START keep the score
{
  console.log('--- results: initials with a P, Escape, the pad START button');
  const { page: p, ctx } = await open('?seed=31', { hideWebdriver: true });
  await scoreThenDie(p, 'campaign');
  let s = await st(p);
  ok(s.state === 'results' && s.ini, `campaign game over shows the initials entry (${JSON.stringify(s)})`);
  const b = posts.length;
  for (const k of ['KeyK', 'KeyP', 'Escape']) { await p.keyboard.press(k); await p.waitForTimeout(120); }
  // a gamepad START press (Input emits 'pause' for it)
  await p.evaluate(() => { for (const f of __rs.I.handlers.pause) f(); });
  await p.keyboard.press('Backspace');
  s = await st(p);
  ok(s.state === 'results' && s.ini && s.ini.startsWith('KP'), `P, Escape, START and Backspace stay on the results; P is a letter (ini ${s.ini}, state ${s.state})`);
  // Backspace steps back one letter (it stays on the results too): type P X again
  await p.keyboard.press('KeyP'); await p.keyboard.press('KeyX');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(700);
  s = await st(p);
  const np = posts.slice(b);
  ok(s.state === 'title' && np.length === 1 && /"initials":"KPX"/.test(np[0].body) && /scores\/rimstorm-2026$/.test(np[0].url), `Enter posts KPX to rimstorm-2026 and goes to the title (${np.map((q) => q.url.replace(/.*scores\//, '') + ' ' + q.body).join(' | ')})`);
  ok(/KPX/.test(await p.evaluate(() => localStorage.getItem('rs.hs.rimstorm-2026') || '')), 'the local table keeps KPX too');
  // endless: Escape on the results does nothing, FINISH posts
  await scoreThenDie(p, 'endless');
  const b2 = posts.length;
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  s = await st(p);
  ok(s.state === 'results' && posts.length === b2, `endless results: Escape stays (state ${s.state}, posts ${posts.length - b2})`);
  await p.evaluate(() => __rs.act('done'));
  await p.waitForTimeout(600);
  ok(posts.slice(b2).some((q) => /rimstorm-2026-endless$/.test(q.url)), 'FINISH posts to rimstorm-2026-endless');
  // the shop: Escape / P / Backspace / START never throw the run away
  await p.evaluate(() => { __rs.startCampaign(0, 4); __rs.G.ai = new window.__AI(5, 'demo'); });
  const shop = await tickUntil(p, "__rs.G.state === 'upgrade' || __rs.G.state === 'results'", 20000, 0.1, 20);
  await p.waitForTimeout(1700);
  s = await st(p);
  ok(shop && s.screen === 'upgrades', `the S1 boss falls and the shop opens (${s.screen})`);
  const run0 = await p.evaluate(() => __rs.G.run.score);
  for (const k of ['Escape', 'KeyP', 'Backspace']) { await p.keyboard.press(k); await p.waitForTimeout(150); }
  await p.evaluate(() => { for (const f of __rs.I.handlers.pause) f(); for (const f of __rs.I.handlers.back) f(); });
  s = await st(p);
  ok(s.screen === 'upgrades' && s.mode === 'campaign', `Escape, P, Backspace, START and B leave the shop open (screen ${s.screen}, mode ${s.mode}, run score ${run0})`);
  await p.evaluate(() => __rs.act('next'));
  await p.waitForTimeout(200);
  s = await st(p);
  ok(s.state === 'play' && (await p.evaluate(() => __rs.W.sector)) === 1, 'NEXT SECTOR still goes on into sector 2');
  await ctx.close();
}

// ---------------------------------------------------------------- 2. quick taps between two frames
{
  console.log('--- quick taps');
  const { page: p, ctx } = await open('?fixed&noscores&seed=9');
  await p.evaluate(() => { __rs.startCampaign(0, 0); __rs.tick(400); });
  const pg = () => p.evaluate(() => ({ used: __rs.W.stats.purges, hops: __rs.W.players[0].hops, tgt: __rs.W.players[0].tgt, lane: __rs.W.players[0].lane }));
  let a = await pg();
  await p.keyboard.press('KeyX');
  await p.evaluate(() => __rs.tick(4));
  let c = await pg();
  ok(c.used === a.used + 1, `a quick X press (down and up between two frames) purges (${a.used} -> ${c.used})`);
  a = await pg();
  await p.keyboard.press('ArrowLeft');
  await p.evaluate(() => __rs.tick(30));
  c = await pg();
  ok(c.tgt !== a.tgt, `a quick arrow tap steps one lane (lane ${a.tgt} -> ${c.tgt})`);
  // a press in the pause menu must not fire off a purge on resume
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  a = await pg();
  await p.keyboard.press('KeyX');
  await p.waitForTimeout(400);
  await p.keyboard.press('Escape');
  await p.evaluate(() => __rs.tick(10));
  c = await pg();
  ok((await st(p)).state === 'play' && c.used === a.used, `X pressed while paused does not purge after resuming (${a.used} -> ${c.used})`);
  await ctx.close();
  const T = await open('?fixed&noscores&seed=9', { vp: { width: 412, height: 915 }, touch: true, mobile: true });
  await T.page.evaluate(() => __rs.settingsApply());
  await T.page.tap('[data-act="campaign"]');
  await T.page.evaluate(() => __rs.tick(500));
  const used0 = await T.page.evaluate(() => __rs.W.stats.purges);
  await T.page.tap('#tb-purge');
  await T.page.evaluate(() => __rs.tick(4));
  const used1 = await T.page.evaluate(() => __rs.W.stats.purges);
  ok(used1 === used0 + 1, `a quick tap on the PURGE button purges on a phone (${used0} -> ${used1})`);
  await T.ctx.close();
}

// ---------------------------------------------------------------- 3. tips show once
{
  console.log('--- tutorial tips show once');
  const { page: p, ctx } = await open('?fixed&noscores&seed=12');
  await p.evaluate(() => { localStorage.removeItem('rs.tips.v1'); });
  await p.reload();
  await p.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
  await p.evaluate(async (v) => { window.__AI = (await import('./js/ai.js' + v)).Autopilot; }, V);
  await p.evaluate(() => { window.__tips = []; });
  // count every tip box that opens, frame by frame (the seed is fixed, so a run played twice meets the same things)
  const play = async (s, w) => {
    await p.evaluate(([s, w]) => { __rs.startCampaign(s, w); __rs.G.ai = new window.__AI(7 + s, 'demo'); }, [s, w]);
    await p.evaluate(() => { const el = document.getElementById('tut'); let prev = ''; for (let i = 0; i < 2400 && __rs.G.state === 'play'; i++) { __rs.tick(1); const txt = el.classList.contains('hidden') ? '' : el.textContent; if (txt && txt !== prev) window.__tips.push(txt.slice(0, 30)); prev = txt; } });
    return p.evaluate(() => window.__tips.length);
  };
  const n1 = await play(0, 0), n2 = await play(0, 0), n3 = await play(0, 1), n4 = await play(0, 1);
  const seen = await p.evaluate(() => JSON.parse(localStorage.getItem('rs.tips.v1') || '[]'));
  ok(n1 >= 2 && n2 === n1 && n4 === n3, `tips show once: run 1 ${n1} (controls + ${seen.join(', ')}), the same run again +${n2 - n1}, a checkpoint start +${n3 - n2} (new things only), again +${n4 - n3}`);
  const again = n4;
  await p.evaluate(() => { __rs.settings.diff = 'hard'; });
  await play(3, 0);
  const hard = await p.evaluate(() => window.__tips.length);
  ok(hard === again, `HARD shows no enemy tips (${hard - again} new)`);
  await p.evaluate(() => { __rs.settings.diff = 'normal'; });
  await ctx.close();
}

// ---------------------------------------------------------------- 4. the S5 lens leaves the web alone, the grab drags, the demo hands over
{
  console.log('--- S5 lens, grab drag, demo hand-over');
  const { page: p, ctx } = await open('?fixed&noscores&seed=5');
  const depth = await p.evaluate(() => __rs.R.post.depthOK);
  ok(depth, 'the post pass has the scene depth (WebGL2) for the lens mask');
  // the reviewer's frame: S5 web 3 at 18 s with the demo autopilot (seed 11 + 4*7 + 2)
  await p.evaluate(() => { __rs.startCampaign(4, 2); __rs.G.ai = new window.__AI(41, 'demo'); });
  let done = 0;
  for (const t of [6, 12, 18]) {
    await p.evaluate((n) => __rs.tick(n), Math.round((t - done) * 60)); done = t;
    await p.screenshot({ path: `${OUT}fix_lens_s5w3_${t}s.png` });
  }
  // grab: sit still on S1 web 2 until a rider grabs, then look half way down the drag
  await p.evaluate(() => { __rs.startCampaign(0, 1); });
  const grabbed = await tickUntil(p, '__rs.W.players[0].drag > 0.35', 9000, 1 / 60, 30);
  const dr = await p.evaluate(() => ({ n: __rs.R.draggers.size, drag: __rs.W.players[0].drag, vis: [...__rs.R.draggers.values()].map((d) => d.v.g.visible && !!d.v.g.parent) }));
  await p.screenshot({ path: `${OUT}fix_grab_drag.png` });
  ok(grabbed && dr.n === 1 && dr.vis[0], `a grabbing rider rides the Rimrunner down the lane (draggers ${dr.n}, drag ${dr.drag.toFixed(2)})`);
  await tickUntil(p, '__rs.W.players[0].alive || __rs.G.state !== "play"', 600, 1 / 60, 30);
  ok(await p.evaluate(() => __rs.R.draggers.size === 0), 'the rider is gone once the Rimrunner is back');
  // the attract demo: 100 s, then the hand-over without W.over being set from outside the sim
  // test only: the demo Rimrunner idles and cannot be hit, so neither side wins before the 100 s are up
  await p.evaluate(() => { __rs.toTitle(); __rs.startDemo(); __rs.G.ai = { control: () => ({ mx: 0, dx: 0, fire: false, purge: false, hop: false }), debug: {} }; __rs.W.players[0].inv = 1e9; });
  await p.evaluate(() => { for (let i = 0; i < 6100 && __rs.G.state === 'play'; i++) __rs.tick(1); });
  const dm = await p.evaluate(() => ({ state: __rs.G.state, over: __rs.W.over, t: __rs.G.demoT }));
  ok(dm.state === 'ended' && dm.over === false && dm.t > 100, `the demo ends after 100 s without touching the world (state ${dm.state}, W.over ${dm.over}, ${dm.t.toFixed(1)} s)`);
  await p.waitForTimeout(1800);
  ok(['title', 'play'].includes((await st(p)).state), `and hands over (${(await st(p)).state})`);
  await ctx.close();
}

// ---------------------------------------------------------------- 5. phone landscape title, boss label
{
  console.log('--- phone landscape title');
  const { page: p, ctx } = await open('?fixed&noscores', { vp: { width: 915, height: 412 }, touch: true, mobile: true });
  await p.evaluate(() => __rs.tick(30));
  const m = await p.evaluate(() => { const c = document.querySelector('#title .card:not(.tbcard)'); const b = document.getElementById('tbcard'); const vis = [...c.querySelectorAll('.mbtn')].filter((e) => { const r = e.getBoundingClientRect(); return r.bottom <= innerHeight && r.top >= 0; }).length; return { sh: c.scrollHeight, ch: c.clientHeight, board: !b.classList.contains('hidden') && !!b.querySelector('.tboard'), btns: c.querySelectorAll('.mbtn').length, vis }; });
  await p.screenshot({ path: `${OUT}fix_phone_landscape_title.png` });
  ok(m.sh <= m.ch + 2 && m.vis === m.btns && m.board, `the menu fits without scrolling (${m.sh} / ${m.ch}), all ${m.vis}/${m.btns} buttons on screen, the world board in its own card`);
  await p.evaluate(() => { __rs.startCampaign(4, 4); __rs.tick(60 * 9); });
  await p.screenshot({ path: `${OUT}fix_phone_landscape_boss5.png` });
  await ctx.close();
}

await browser.close();
ok(!errors.length, `console errors: ${errors.length}${errors.length ? ' · ' + [...new Set(errors)].slice(0, 6).join(' | ') : ''}`);
ok(!other.length, `no requests to other hosts (${[...new Set(other)].slice(0, 4).join(', ')})`);
console.log(fails ? `FIX CHECK: ${fails} FAILED` : 'FIX CHECK: ALL PASS');
process.exit(fails ? 1 : 0);
