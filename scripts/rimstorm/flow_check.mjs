// Game-flow check (Playwright + headless Edge): the attract demo starts from the title by itself, the
// AI PLAYTHROUGH beats the sector 1 boss, shops and rolls into sector 2, a lost campaign lands on the
// results screen with the initials entry and the checkpoint CONTINUE, the instant replay plays, and
// ENDLESS DESCENT runs. Fails on console errors or any score POST (POSTs are intercepted).
//   node scripts/rimstorm/flow_check.mjs [baseUrl=http://127.0.0.1:8772/games/2026-11-06/rimstorm/]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const errors = [];
let posts = 0, fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails++; };
async function open(url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
    if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.goto(base + url);
  await page.waitForFunction(() => window.__rs && window.__rs.G.state !== 'boot', null, { timeout: 120000 });
  return page;
}
// 1. the attract demo
{
  const p = await open('?demo&noscores');
  await p.waitForTimeout(4000);
  const d = await p.evaluate(() => ({ mode: window.__rs.G.mode, n: window.__rs.W && window.__rs.W.n }));
  ok(d.mode === 'demo' && d.n > 0, `attract demo starts from the title (mode ${d.mode}, ${d.n} ticks)`);
  await p.close();
}
// 2. AI playthrough from the sector 1 boss into sector 2
{
  const p = await open('?playthrough&fixed&web=4&noscores');
  const r = await p.evaluate(async () => {
    const rs = window.__rs;
    for (let i = 0; i < 60 * 240 && rs.G.state === 'play'; i++) rs.tick(1);
    const after = { state: rs.G.state, result: rs.W.result, bossT: Math.round(rs.W.stats.bossT) };
    await new Promise((r) => setTimeout(r, 1700)); rs.tick(5);
    const shop = { screen: rs.G.screen, sub: document.getElementById('up-sub').textContent };
    await new Promise((r) => setTimeout(r, 6500)); rs.tick(5);
    return { after, shop, next: { mode: rs.G.mode, state: rs.G.state, sector: rs.W.sector } };
  });
  ok(r.after.result === 'clear', `AI playthrough beats the sector 1 boss (${r.after.bossT} s)`);
  ok(r.shop.screen === 'upgrades', `then shops (${r.shop.sub})`);
  ok(r.next.mode === 'playthrough' && r.next.sector === 1 && r.next.state === 'play', `and rolls into sector 2 (${r.next.mode}, sector ${r.next.sector + 1}, ${r.next.state})`);
  await p.close();
}
// 3. a lost campaign: results, initials, checkpoint continue, instant replay
{
  const p = await open('?fixed&noscores');
  const r = await p.evaluate(async () => {
    const rs = window.__rs;
    rs.startCampaign(1, 2);
    const W = rs.W;
    W.lives = 1; W.score = 4321; W.lifePts = 4321;
    // stand still, never fire: the web gets you
    for (let i = 0; i < 60 * 120 && rs.G.state === 'play'; i++) rs.tick(1);
    await new Promise((r) => setTimeout(r, 1600)); rs.tick(2);
    const res = { screen: rs.G.screen, title: document.getElementById('res-title').textContent, ini: !document.getElementById('ini-wrap').classList.contains('hidden'), cont: !document.getElementById('res-cont').classList.contains('hidden'), replay: !!rs.G.clip };
    rs.playReplay(); rs.tick(30);
    const rep = rs.G.state;
    for (let i = 0; i < 600 && rs.G.state === 'replay'; i++) rs.tick(1);
    rs.act('continue');
    await new Promise((r) => setTimeout(r, 50)); rs.tick(10);
    return { res, rep, after: { state: rs.G.state, web: rs.W.web, sector: rs.W.sector, lives: rs.W.lives } };
  });
  ok(r.res.screen === 'results' && r.res.ini, `losing lands on results with initials entry (${r.res.title})`);
  ok(r.res.cont, 'the checkpoint CONTINUE is offered');
  ok(r.res.replay && r.rep === 'replay', 'the instant replay of the last hit plays');
  ok(r.after.state === 'play' && r.after.web === 2 && r.after.sector === 1, `CONTINUE restarts sector ${r.after.sector + 1} web ${r.after.web + 1} with ${r.after.lives} Rimrunners`);
  await p.close();
}
// 4. endless descent
{
  const p = await open('?fixed&noscores');
  const r = await p.evaluate(() => { const rs = window.__rs; rs.G.autopilot = true; rs.startEndless(); rs.tick(60 * 90); return { mode: rs.W.mode, webs: rs.W.webN, t: Math.round(rs.W.fightT), boards: Object.keys(window.__rs) }; });
  ok(r.mode === 'endless' && r.webs >= 1, `ENDLESS DESCENT runs (${r.webs} webs in ${r.t} s of fighting)`);
  await p.close();
}
await browser.close();
ok(!errors.length, `console errors: ${errors.length}${errors.length ? ' · ' + [...new Set(errors)].slice(0, 5).join(' | ') : ''}`);
ok(!posts, `score POSTs attempted: ${posts}`);
process.exit(fails ? 1 : 0);
