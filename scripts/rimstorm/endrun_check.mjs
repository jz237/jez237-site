// Rimstorm 2026 END RUN check: the shop's END RUN asks first, ESC / P / Backspace / pad START / pad B on the
// question (and a double ENTER) all go back to the shop, and saying yes banks the run through the normal
// game-over flow (results -> initials -> a POST to the run's own world board). Keyboard, gamepad and touch.
//   node scripts/rimstorm/endrun_check.mjs [baseUrl] [shotDir]
// The score worker is intercepted: GET -> a fake top 10, POST -> recorded and answered locally (webdriver is
// hidden so the REAL post path runs; nothing leaves the machine). Also checks that ?noscores and the AI
// PLAYTHROUGH never post and that the PLAYTHROUGH shop has no END RUN. Exit 1 on any failure or console error.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('D:/Projects/.tmp/model-s-tools/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:8785/games/2026-11-06/rimstorm/';
const OUT = (process.argv[3] || 'D:/Projects/.tmp/arcade-trio-work/rimstorm/shots') + '/';
const V = '?v=10';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const errors = [], posts = [], other = [];
let fails = 0;
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fails++; };
const fakeBoard = JSON.stringify(Array.from({ length: 10 }, (_, i) => ({ initials: 'ZZZ', score: 1000 - i * 90, level: 1 })));
async function open(url, opt = {}) {
  const ctx = await browser.newContext({ viewport: opt.vp || { width: 1280, height: 720 }, hasTouch: !!opt.touch, isMobile: !!opt.mobile, deviceScaleFactor: 1 });
  if (opt.hideWebdriver) await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }); });
  // a stub gamepad the test presses buttons on (Input polls navigator.getGamepads every frame)
  await ctx.addInitScript(() => {
    window.__pad = { id: 'stub pad', index: 0, connected: true, mapping: 'standard', timestamp: 0, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) };
    Object.defineProperty(Navigator.prototype, 'getGamepads', { value: () => (window.__padOn ? [window.__pad] : []), configurable: true });
  });
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
  await page.evaluate(async (v) => { window.__AI = (await import('./js/ai.js' + v)).Autopilot; localStorage.setItem('rs.tips.v1', JSON.stringify(['controls', 'rim', 'dive', 'lancer', 'spinewright', 'mite', 'shocker', 'mirror', 'pickup', 'hop'])); }, V);
  return { page, ctx };
}
const st = (p) => p.evaluate(() => ({ state: __rs.G.state, screen: __rs.G.screen, mode: __rs.G.mode, sel: document.querySelector('.sel') && (document.querySelector('.sel').id || document.querySelector('.sel').dataset.act || document.querySelector('.sel').dataset.up), ini: __rs.G.ini && __rs.G.ini.chars.join(''), runScore: __rs.G.run && __rs.G.run.score, sector: __rs.W && __rs.W.sector }));
async function tickUntil(p, cond, max = 6000, dt = 0.1, chunk = 20) {
  for (let i = 0; i < max; i += chunk) {
    const done = await p.evaluate(([c, n, d]) => { const f = new Function('return ' + c); for (let k = 0; k < n; k++) { if (f()) return true; __rs.tick(1, d); } return !!f(); }, [cond, chunk, dt]);
    if (done) return true;
  }
  return false;
}
// the demo autopilot beats the S1 boss: the shop opens (onWorldOver runs on a 1.3 s timer)
async function toShop(p) {
  await p.evaluate(() => { __rs.startCampaign(0, 4); __rs.G.ai = new window.__AI(5, 'demo'); });
  await tickUntil(p, "__rs.G.state === 'upgrade' || __rs.G.state === 'results'", 20000, 0.1, 20);
  await p.waitForFunction(() => __rs.G.state === 'upgrade' || __rs.G.state === 'results', null, { timeout: 6000 }).catch(() => {});
  await p.waitForTimeout(300);
  return st(p);
}
async function padPress(p, b) {
  await p.evaluate((i) => { window.__padOn = true; __rs.__padB = i; window.__pad.buttons[i] = { pressed: true, value: 1 }; __rs.tick(1, 1 / 60); window.__pad.buttons[i] = { pressed: false, value: 0 }; __rs.tick(1, 1 / 60); }, b);
  await p.waitForTimeout(60);
}

// ---------------------------------------------------------------- 1. keyboard
{
  console.log('--- keyboard: END RUN, the question, every way back, then yes');
  const { page: p, ctx } = await open('?seed=31', { hideWebdriver: true });
  let s = await toShop(p);
  ok(s.screen === 'upgrades' && s.mode === 'campaign', `the S1 boss falls and the shop opens (${s.screen})`);
  const vis = await p.evaluate(() => { const b = document.getElementById('endrun-btn'); return !!b.offsetParent; });
  ok(vis, 'the shop shows END RUN');
  await p.screenshot({ path: OUT + 'endrun_shop.png' });
  // arrow keys reach END RUN
  let n = 0;
  while ((await st(p)).sel !== 'endrun-btn' && n++ < 12) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(40); }
  s = await st(p);
  ok(s.sel === 'endrun-btn', `the arrow keys reach END RUN (${n} presses)`);
  const b0 = posts.length, score0 = s.runScore;
  await p.keyboard.press('Enter'); await p.waitForTimeout(100);
  s = await st(p);
  ok(s.screen === 'endrun' && s.sel === 'endrun-no', `ENTER asks first, KEEP GOING is picked (screen ${s.screen}, sel ${s.sel})`);
  await p.screenshot({ path: OUT + 'endrun_confirm.png' });
  // every way back keeps the run
  const backs = [['Escape', (q) => q.keyboard.press('Escape')], ['P', (q) => q.keyboard.press('KeyP')], ['Backspace', (q) => q.keyboard.press('Backspace')],
    ['pad START', (q) => q.evaluate(() => { for (const f of __rs.I.handlers.pause) f(); })], ['pad B', (q) => q.evaluate(() => { for (const f of __rs.I.handlers.back) f(); })], ['ENTER on KEEP GOING', (q) => q.keyboard.press('Enter')]];
  for (const [name, fn] of backs) {
    await fn(p); await p.waitForTimeout(100);
    s = await st(p);
    ok(s.screen === 'upgrades' && s.state === 'upgrade' && s.mode === 'campaign' && s.sel === 'endrun-btn' && s.runScore === score0, `${name} on the question goes back to the shop with the run (screen ${s.screen}, sel ${s.sel})`);
    await p.keyboard.press('Enter'); await p.waitForTimeout(100);
    if ((await st(p)).screen !== 'endrun') { ok(false, 'ENTER on END RUN re-opens the question'); break; }
  }
  ok(posts.length === b0, `nothing posted while backing out (${posts.length - b0})`);
  // yes: results with the initials, ESC / P on them stay, typed initials post to rimstorm-2026
  await p.keyboard.press('ArrowDown'); await p.waitForTimeout(60);
  s = await st(p);
  ok(s.sel === 'endrun-yes', `ArrowDown picks END RUN on the question (${s.sel})`);
  await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  s = await st(p);
  const title = await p.evaluate(() => document.getElementById('res-title').textContent + ' / ' + document.getElementById('res-sub').textContent);
  ok(s.state === 'results' && s.screen === 'results' && s.ini, `END RUN lands on the results with the initials entry (${title}; ini ${s.ini})`);
  const cont = await p.evaluate(() => !document.getElementById('res-cont').classList.contains('hidden'));
  ok(!cont && s.sel === 'done', `no CONTINUE on a banked run, FINISH is picked (sel ${s.sel})`);
  await p.screenshot({ path: OUT + 'endrun_results.png' });
  for (const k of ['KeyE', 'KeyN', 'Escape', 'KeyP']) { await p.keyboard.press(k); await p.waitForTimeout(80); }
  s = await st(p);
  ok(s.state === 'results' && s.ini === 'ENP', `ESC / P stay on the results, P is a letter (ini ${s.ini})`);
  await p.keyboard.press('KeyD'); await p.keyboard.press('Enter'); // the cursor stays on the last letter: E N P -> E N D
  await p.waitForTimeout(700);
  s = await st(p);
  const np = posts.slice(b0);
  const body = np[0] ? JSON.parse(np[0].body) : {};
  ok(s.state === 'title' && np.length === 1 && /scores\/rimstorm-2026$/.test(np[0].url) && body.initials === 'END' && body.score === score0 && body.level === 1 && /S1B END/.test(body.extra),
    `ENTER posts once to rimstorm-2026 and goes to the title (${np.map((q) => q.url.replace(/.*scores\//, '') + ' ' + q.body).join(' | ')}; run score ${score0})`);
  // HARD: the banked run goes to the HARD board
  await p.evaluate(() => { __rs.settings.diff = 'hard'; });
  s = await toShop(p);
  const b1 = posts.length;
  await p.evaluate(() => { __rs.act('endrun'); __rs.act('endrun-yes'); });
  await p.waitForTimeout(100);
  await p.evaluate(() => __rs.act('done'));
  await p.waitForTimeout(600);
  ok(posts.slice(b1).length === 1 && /scores\/rimstorm-2026-hard$/.test(posts[b1].url), `a HARD run banks to rimstorm-2026-hard (${posts.slice(b1).map((q) => q.url.replace(/.*scores\//, '')).join(',')})`);
  await p.evaluate(() => { __rs.settings.diff = 'normal'; });
  await ctx.close();
}

// ---------------------------------------------------------------- 2. gamepad
{
  console.log('--- gamepad: d-pad to END RUN, A asks, B / START go back, A on END RUN, A on FINISH');
  const { page: p, ctx } = await open('?seed=32', { hideWebdriver: true });
  let s = await toShop(p);
  ok(s.screen === 'upgrades', `shop open (${s.screen})`);
  let n = 0;
  while ((await st(p)).sel !== 'endrun-btn' && n++ < 12) await padPress(p, 13);
  s = await st(p);
  ok(s.sel === 'endrun-btn', `the d-pad reaches END RUN (${n} presses)`);
  const b0 = posts.length, score0 = s.runScore;
  await padPress(p, 0);
  s = await st(p);
  ok(s.screen === 'endrun' && s.sel === 'endrun-no', `pad A asks first (screen ${s.screen}, sel ${s.sel})`);
  await padPress(p, 1);
  s = await st(p);
  ok(s.screen === 'upgrades' && s.sel === 'endrun-btn', `pad B goes back to the shop (${s.screen})`);
  await padPress(p, 0); await padPress(p, 9);
  s = await st(p);
  ok(s.screen === 'upgrades' && s.mode === 'campaign', `pad START on the question goes back to the shop (${s.screen})`);
  await padPress(p, 0); await padPress(p, 0);
  s = await st(p);
  ok(s.screen === 'upgrades' && posts.length === b0, `A, A (KEEP GOING) goes back to the shop (${s.screen})`);
  await padPress(p, 0); await padPress(p, 13);
  s = await st(p);
  ok(s.sel === 'endrun-yes', `d-pad down picks END RUN on the question (${s.sel})`);
  await padPress(p, 0);
  s = await st(p);
  ok(s.state === 'results' && s.ini && s.sel === 'done', `pad A ends the run: results + initials, FINISH picked (ini ${s.ini}, sel ${s.sel})`);
  await padPress(p, 9); await padPress(p, 1);
  s = await st(p);
  ok(s.state === 'results', `pad START / B stay on the results (${s.state})`);
  await padPress(p, 12); // d-pad up: the first letter goes up one
  await padPress(p, 0);
  await p.waitForTimeout(700);
  s = await st(p);
  const np = posts.slice(b0);
  ok(s.state === 'title' && np.length === 1 && /scores\/rimstorm-2026$/.test(np[0].url) && JSON.parse(np[0].body).score === score0, `pad A on FINISH posts once to rimstorm-2026 (${np.map((q) => q.body).join(' | ')})`);
  await ctx.close();
}

// ---------------------------------------------------------------- 3. touch (phone portrait + landscape)
for (const vp of [{ width: 412, height: 915 }, { width: 915, height: 412 }]) {
  const tag = vp.width < vp.height ? 'portrait' : 'landscape';
  console.log(`--- touch ${tag}: tap END RUN, tap KEEP GOING, tap END RUN twice, tap FINISH`);
  const { page: p, ctx } = await open('?seed=33', { hideWebdriver: true, vp, touch: true, mobile: true });
  let s = await toShop(p);
  ok(s.screen === 'upgrades', `shop open (${s.screen})`);
  const b0 = posts.length;
  await p.locator('#endrun-btn').scrollIntoViewIfNeeded();
  await p.screenshot({ path: OUT + `endrun_shop_${tag}.png` });
  await p.tap('#endrun-btn'); await p.waitForTimeout(150);
  s = await st(p);
  ok(s.screen === 'endrun', `a tap on END RUN asks first (${s.screen})`);
  await p.screenshot({ path: OUT + `endrun_confirm_${tag}.png` });
  const fits = await p.evaluate(() => [...document.querySelectorAll('#endrun .mbtn')].every((b) => { const r = b.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; }));
  ok(fits, 'both answers are on screen');
  await p.tap('[data-act="endrun-no"]'); await p.waitForTimeout(150);
  s = await st(p);
  ok(s.screen === 'upgrades' && posts.length === b0, `a tap on KEEP GOING goes back to the shop (${s.screen})`);
  await p.locator('#endrun-btn').scrollIntoViewIfNeeded();
  await p.tap('#endrun-btn'); await p.waitForTimeout(150);
  await p.tap('[data-act="endrun-yes"]'); await p.waitForTimeout(250);
  s = await st(p);
  ok(s.state === 'results' && s.ini, `a tap on END RUN ends the run: results + initials (${s.state}, ${s.ini})`);
  await p.screenshot({ path: OUT + `endrun_results_${tag}.png` });
  await p.locator('[data-act="done"]').scrollIntoViewIfNeeded();
  await p.tap('#res-btns [data-act="done"]'); await p.waitForTimeout(700);
  s = await st(p);
  ok(s.state === 'title' && posts.slice(b0).length === 1, `a tap on FINISH posts once (${posts.slice(b0).map((q) => q.body).join(' | ')})`);
  await ctx.close();
}

// ---------------------------------------------------------------- 4. never posts: ?noscores, webdriver, AI PLAYTHROUGH
{
  console.log('--- no posts: ?noscores, a WebDriver browser, the AI PLAYTHROUGH shop');
  for (const [url, hide] of [['?noscores&seed=34', true], ['?seed=34', false]]) {
    const { page: p, ctx } = await open(url, { hideWebdriver: hide });
    await toShop(p);
    const b0 = posts.length;
    await p.evaluate(() => { __rs.act('endrun'); __rs.act('endrun-yes'); });
    await p.waitForTimeout(100);
    const last = await p.evaluate(() => { __rs.act('done'); return null; });
    await p.waitForTimeout(600);
    const L = await p.evaluate(() => __rs.Scores.last);
    ok(posts.length === b0 && L && L.sent === false, `${url}${hide ? '' : ' (webdriver)'}: END RUN reaches the board body but sends nothing (posts ${posts.length - b0}, Scores.last.sent ${L && L.sent})`);
    void last;
    await ctx.close();
  }
  // the AI PLAYTHROUGH from the S1 boss (?web=4), on a page that WOULD post (webdriver hidden, no test flags)
  const { page: p, ctx } = await open('?seed=35&web=4', { hideWebdriver: true });
  await p.evaluate(() => { __rs.startPlaythrough(); });
  const ok1 = await tickUntil(p, "__rs.G.state === 'upgrade'", 60000, 0.1, 40);
  const pt = await p.evaluate(() => ({ screen: __rs.G.screen, mode: __rs.G.mode, end: !!document.getElementById('endrun-btn').offsetParent }));
  const b0 = posts.length;
  await p.evaluate(() => { __rs.act('endrun'); __rs.act('endrun-yes'); });
  const pt2 = await p.evaluate(() => ({ screen: __rs.G.screen, state: __rs.G.state }));
  ok(ok1 && pt.mode === 'playthrough' && pt.screen === 'upgrades' && !pt.end && pt2.screen === 'upgrades' && posts.length === b0, `the AI PLAYTHROUGH shop has no END RUN and ignores it (${JSON.stringify(pt)} -> ${JSON.stringify(pt2)})`);
  await ctx.close();
}

await browser.close();
ok(errors.length === 0, `no console errors (${errors.slice(0, 5).join(' | ')})`);
ok(other.length === 0, `no requests left the machine (${other.slice(0, 3).join(' | ')})`);
console.log(`\nPOSTs answered locally: ${posts.length} (none reached the real board)`);
console.log(fails ? `END RUN CHECK: ${fails} FAILED` : 'END RUN CHECK: ALL PASS');
process.exit(fails ? 1 : 0);
