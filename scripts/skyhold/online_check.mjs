// Online co-op in two real browser pages (Edge headless) through a LOCAL relay: a host and a guest join one room,
// the host starts a world, both ships are flown by the demo autopilot, and after a while we compare the two views.
//   node scripts/skyhold/online_check.mjs [base=http://127.0.0.1:8862/games/2026-11-09/skyhold/] [relay=ws://127.0.0.1:8781] [seconds=40] [lagMs=0]
// Start the relay first (D:/Projects/.tmp/arcade-trio-work/lancewing/relay: wrangler dev --local --port 8781) and wait for 'Ready'.
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('D:/Projects/.tmp/model-s-tools/node_modules/');
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:8862/games/2026-11-09/skyhold/';
const relay = process.argv[3] || 'ws://127.0.0.1:8781';
const secs = +(process.argv[4] || 40), lag = +(process.argv[5] || 0), wave = +(process.argv[6] || 0), world = process.argv[7] || '1';
const LOCK = 'D:/Projects/.tmp/arcade-trio-edge.lock';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; ; i++) { try { fs.mkdirSync(LOCK); break; } catch { if (i > 80) { console.error('lock busy'); process.exit(3); } await sleep(15000); } }
process.on('exit', () => { try { fs.rmdirSync(LOCK); } catch { /* gone */ } });
let fail = 0;
const ok = (c, msg) => { console.log((c ? 'PASS  ' : 'FAIL  ') + msg); if (!c) fail++; };
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });
  let posts = 0;
  await ctx.route('**/game-scores.jez237.workers.dev/**', (r) => { if (r.request().method() === 'POST') posts++; r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }); });
  const errors = [];
  const open = async () => {
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(m.text()); });
    await p.goto(base + `?noscores&relay=${encodeURIComponent(relay)}${lag ? '&netlag=' + lag : ''}${wave ? '&wave=' + wave : ''}`);
    await p.waitForFunction(() => window.__sh && window.__sh.G.state === 'title' && !document.getElementById('loading'), null, { timeout: 120000 });
    return p;
  };
  const H = await open(), Gp = await open();
  const room = 'SH-T' + Math.random().toString(36).slice(2, 5).toUpperCase();
  await H.evaluate((room) => { const sh = window.__sh; sh.G.autopilot = true; sh.act('online'); sh.NET.connect(room, 'host', { ini: 'HST' }); }, room);
  await sleep(1500);
  await Gp.evaluate((room) => { const sh = window.__sh; sh.G.autopilot = true; sh.act('online'); sh.NET.connect(room, 'join', { ini: 'GST' }); }, room);
  await H.waitForFunction(() => !!window.__sh.NET.peer, null, { timeout: 30000 });
  await Gp.waitForFunction(() => !!window.__sh.NET.peer, null, { timeout: 30000 });
  ok(true, `both pages in room ${room}`);
  await H.evaluate((world) => { window.__sh.settings.netRoute = world; window.__sh.online.hostStart(); }, world);
  await Gp.waitForFunction(() => window.__sh.G.mode === 'online' && window.__sh.G.state === 'play', null, { timeout: 15000 });
  ok(true, 'the guest started the same world');
  await sleep(secs * 1000);
  const hs = await H.evaluate(() => { const W = window.__sh.W, N = window.__sh.NET; return { score: W.score, lives: W.lives, wave: W.wave, phase: W.phase, enemies: W.enemies.length, settlers: W.settlers.filter((s) => s.st !== 'dead').length, g: [W.players[1].x, W.players[1].y, W.players[1].alive], stat: N.stat, kills: W.stats.kills }; });
  const gs = await Gp.evaluate(() => { const W = window.__sh.W, N = window.__sh.NET; return { score: W.score, lives: W.lives, wave: W.wave, phase: W.phase, enemies: W.enemies.length, settlers: W.settlers.filter((s) => s.st !== 'dead').length, me: [W.players[1].x, W.players[1].y, W.players[1].alive], h: [W.players[0].x, W.players[0].y], stat: N.stat }; });
  console.log('      host ', JSON.stringify(hs));
  console.log('      guest', JSON.stringify(gs));
  ok(hs.stat.inputs > secs * 10 && gs.stat.snaps > secs * 10, `messages flowing (host got ${hs.stat.inputs} inputs, guest ${gs.stat.snaps} snapshots)`);
  ok(hs.stat.shots >= 3, `the guest's beams reach the host (${hs.stat.shots})`);
  ok(Math.abs(hs.score - gs.score) <= 2000 && hs.wave === gs.wave && hs.lives === gs.lives, `score / wave / lives in step (host ${hs.score} w${hs.wave} l${hs.lives}, guest ${gs.score} w${gs.wave} l${gs.lives})`);
  const d = Math.hypot(((hs.g[0] - gs.me[0] + 2400) % 1600) - 800, hs.g[1] - gs.me[1]);
  const tol = 4 + 45 * (lag * 2 + 40) / 1000;   // a ship at full speed moves this far while the messages are in flight
  ok(!gs.me[2] || d < tol, `the guest's ship is where the guest flies it on the host (${d.toFixed(2)} m apart, allowed ${tol.toFixed(1)} m with ${lag} ms lag)`);
  ok(hs.kills >= 2 || wave >= 4, `machines destroyed together (${hs.kills})`);
  if (wave >= 4) { const bt = await Gp.evaluate(() => { const W = window.__sh.W; return W.boss ? W.boss.nodes.map((n) => n.hp).join(',') + ' ' + W.boss.st : W.result || W.phase; }); const bh = await H.evaluate(() => { const W = window.__sh.W; return W.boss ? W.boss.nodes.map((n) => n.hp).join(',') + ' ' + W.boss.st : W.result || W.phase; }); console.log('      carrier host', bh, '| guest', bt); ok(bt === bh || /clear/.test(bh), 'the carrier is the same on both screens'); }
  ok(errors.length === 0, `no console errors${errors.length ? ': ' + errors.slice(0, 4).join(' | ') : ''}`);
  ok(posts === 0, 'no score posts');
  // leaving is noticed
  await Gp.evaluate(() => window.__sh.toTitle());
  await sleep(2500);
  ok(await H.evaluate(() => !window.__sh.NET.peer), 'the host notices the guest leaving');
} finally { await browser.close(); }
console.log(fail ? `FAIL · ${fail}` : 'PASS');
process.exit(fail ? 1 : 0);
