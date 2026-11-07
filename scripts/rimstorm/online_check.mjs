// Online co-op check (Playwright + headless Edge, two pages on a LOCAL relay): a host page opens a room
// (RS-XXXX), a guest page joins by code, both Rimrunners are flown by the autopilot. Run at 0 ms and at
// ~80 ms one-way lag on the guest (?netlag=80 delays each message both ways). Checks snapshot rate and
// size, guest inputs, the guest's shots killing enemies on the host, both pages agreeing on web, phase,
// score, lives and enemies, how far the host's picture of the guest is from where the guest really is,
// the sector clear landing both on results, the host's NEXT SECTOR taking both into sector 2, quick match
// pairing two pages in an RS-Q- room, and a partner leaving. Fails on console errors or score POSTs.
//   1. relay: copy games/2026-06-14/steel-duel/worker to the work folder, then
//      D:/Projects/.tmp/descent2-site/node_modules/.bin/wrangler dev --local --port 8782
//   2. static server: python -I D:/Projects/.tmp/arcade-trio-work/rimstorm/serve.py 8772
//   node scripts/rimstorm/online_check.mjs [baseUrl] [relay=ws://127.0.0.1:8782] [seconds=45] [shotDir]  (net_*.png at 80 ms)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
if (!chromium) { console.error('playwright not found'); process.exit(2); }
const base = process.argv[2] || 'http://127.0.0.1:8772/games/2026-11-06/rimstorm/';
const relay = process.argv[3] || 'ws://127.0.0.1:8782';
const secs = +(process.argv[4] || 45);
const shots = process.argv[5] || 'D:/Projects/.tmp/arcade-trio-work/rimstorm/shots';
if (!/^ws:\/\/(127\.0\.0\.1|localhost)/.test(relay)) { console.error('online_check only runs against a local relay'); process.exit(2); }

const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const errors = [];
let posts = 0, fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(query, tag) {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 450 } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errors.push(`${tag}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${tag} pageerror: ${e.message}`));
  await page.route('**/game-scores.jez237.workers.dev/**', (route) => {
    if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 200, body: '{}' }); }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
  await page.goto(base + query);
  await page.waitForFunction(() => window.__rs && window.__rs.G.state === 'title', null, { timeout: 120000 });
  // low quality keeps two live pages light; the autopilot flies both Rimrunners
  await page.evaluate(() => { window.__rs.G.autopilot = true; window.__rs.settings.netRoute = '0'; });
  return { page, ctx };
}
// what each page thinks the shared web looks like right now
const look = (p) => p.evaluate(() => {
  const rs = window.__rs, W = rs.W, N = rs.NET;
  const me = N.host ? W.players[0] : W.players[1], g = W.players[1];
  return { mode: rs.G.mode, state: rs.G.state, screen: rs.G.screen, web: W.web, webN: W.webN, sector: W.sector, phase: W.phase, score: W.score, lives: W.lives, over: W.over,
    ids: W.enemies.filter((e) => e.hp > 0).map((e) => e.id), meLane: me ? me.lane : -1, meAlive: me ? me.alive : false, gLane: g ? g.lane : -1, gPos: g ? g.pos : -1,
    stat: { ...N.stat }, rtt: Math.round(N.rtt), t: performance.now(), host: N.host, peer: !!N.peer, nl: W.nl, closed: W.closed };
});
const laneGap = (a, b, nl, closed) => { let d = Math.abs(a - b); if (closed) d = Math.min(d, nl - d); return d; };

async function coop(lag) {
  console.log(`--- co-op, guest lag ${lag} ms each way`);
  const H = await open(`?noscores&q=low&relay=${relay}`, 'host');
  const Gp = await open(`?noscores&q=low&relay=${relay}${lag ? '&netlag=' + lag : ''}`, 'guest');
  const host = H.page, guest = Gp.page;
  await host.evaluate(() => { window.__rs.act('online'); window.__rs.act('net-host'); });
  const code = await host.evaluate(() => document.getElementById('room-code').textContent);
  ok(/^[A-Z0-9]{4}$/.test(code), `host opened room RS-${code}`);
  await sleep(600);
  await guest.evaluate((c) => { window.__rs.act('online'); document.getElementById('join-code').value = c; window.__rs.act('net-join'); }, code);
  const paired = await Promise.all([host, guest].map((p) => p.waitForFunction(() => !!window.__rs.NET.peer, null, { timeout: 25000 }).then(() => true, () => false)));
  ok(paired[0] && paired[1], 'both pages see their partner');
  const goVisible = await host.evaluate(() => !document.getElementById('net-go').classList.contains('hidden'));
  ok(goVisible, 'the host gets the START button');
  await host.evaluate(() => window.__rs.act('net-go'));
  const started = await guest.waitForFunction(() => window.__rs.G.mode === 'online' && window.__rs.G.state === 'play', null, { timeout: 15000 }).then(() => true, () => false);
  ok(started, 'the guest starts with the host');
  // play and sample both pages
  const t0 = Date.now(), S = [];
  let lastH = null, lastG = null;
  while (Date.now() - t0 < secs * 1000) {
    await sleep(1000);
    const [h, g] = await Promise.all([look(host), look(guest)]);
    S.push({ h, g }); lastH = h; lastG = g;
    if (lag && S.length === 12) { await host.screenshot({ path: `${shots}/net_host_play.png` }); await guest.screenshot({ path: `${shots}/net_guest_play.png` }); }
    if (h.over || h.state !== 'play') break;
  }
  const dur = (lastG.t - S[0].g.t) / 1000 + 1;
  const snapRate = (lastG.stat.snaps - S[0].g.stat.snaps) / Math.max(1, dur - 1);
  const inRate = (lastH.stat.inputs - S[0].h.stat.inputs) / Math.max(1, dur - 1);
  ok(snapRate > 14 && snapRate < 26, `guest receives snapshots at ${snapRate.toFixed(1)} / s`);
  ok(inRate > 8, `host receives guest inputs at ${inRate.toFixed(1)} / s`);
  ok(lastH.stat.maxBytes > 0 && lastH.stat.maxBytes < 40000, `snapshot size avg ${Math.round(lastH.stat.bytes / Math.max(1, lastH.stat.snaps))} B, max ${lastH.stat.maxBytes} B (relay limit 48000)`);
  ok(lastH.stat.shots > 20 && lastH.stat.kills2 > 0, `guest shots reach the host (${lastH.stat.shots}) and kill (${lastH.stat.kills2} kills by the guest, ${lastH.stat.deaths2} guest deaths)`);
  // agreement
  let webSame = 0, phaseSame = 0, scoreClose = 0, livesSame = 0, ov = 0, ovN = 0, gap = 0, gapN = 0;
  for (const { h, g } of S) {
    if (h.web === g.web && h.sector === g.sector) webSame++;
    if (h.phase === g.phase) phaseSame++;
    if (Math.abs(h.score - g.score) <= Math.max(600, h.score * 0.03)) scoreClose++;
    if (h.lives === g.lives) livesSame++;
    if (h.ids.length + g.ids.length) { const A = new Set(h.ids); const inter = g.ids.filter((x) => A.has(x)).length; ov += inter / Math.max(1, new Set([...h.ids, ...g.ids]).size); ovN++; }
    if (g.meAlive && h.phase === 'fight') { gap += laneGap(h.gLane, g.meLane, h.nl, h.closed); gapN++; }
  }
  const n = S.length;
  ok(webSame >= n - 1, `same web on both pages ${webSame}/${n} samples (host reached web ${lastH.web + 1}, ${lastH.webN} webs)`);
  ok(phaseSame >= n - 2, `same phase ${phaseSame}/${n}`);
  ok(scoreClose >= n - 2, `score agrees ${scoreClose}/${n} (host ${lastH.score}, guest ${lastG.score})`);
  ok(livesSame >= n - 2, `shared lives agree ${livesSame}/${n} (${lastH.lives})`);
  ok(ovN === 0 || ov / ovN > 0.75, `same enemies on both pages: ${(100 * ov / Math.max(1, ovN)).toFixed(0)} % overlap`);
  const meanGap = gap / Math.max(1, gapN);
  ok(meanGap < (lag ? 0.6 : 0.35), `host's picture of the guest: ${meanGap.toFixed(2)} lanes off on average (rtt ${lastG.rtt} ms)`);
  // a guest death is judged on the host: a bolt reaches the guest's lane at the rim (test only)
  const dead = await host.evaluate(async () => {
    const rs = window.__rs, W = rs.W, g = W.players[1], N = rs.NET;
    const before = { lives: W.lives, d2: N.stat.deaths2 };
    for (let k = 0; k < 40 && N.stat.deaths2 === before.d2; k++) {
      if (g.alive && g.inv <= 0 && g.hop <= 0 && W.phase === 'fight') { g.plate = 0; W.bolts.push({ id: W.nextId++, lane: g.lane, d: 0.03, d0: 0.03, v: 0.6, kind: 'lance' }); }
      await new Promise((r) => setTimeout(r, 150));
    }
    return { before, after: { lives: W.lives, d2: N.stat.deaths2 } };
  });
  const gDead = await guest.waitForFunction(() => !window.__rs.W.players[1].alive, null, { timeout: 5000, polling: 30 }).then(() => true, () => false);
  const gBack = await guest.waitForFunction(() => window.__rs.W.players[1].alive, null, { timeout: 12000, polling: 100 }).then(() => true, () => false);
  const lv = await Promise.all([look(host), look(guest)]);
  ok(dead.after.d2 === dead.before.d2 + 1 && gDead && gBack && lv[0].lives === lv[1].lives, `a guest death is judged by the host, shown on the guest, and it respawns (lives ${dead.before.lives} -> ${lv[0].lives} on both)`);
  // between snapshots the guest's climbers keep moving (drift), they do not step 20 times a second
  const smooth = await guest.evaluate(() => new Promise((res) => {
    const seen = new Map(); let frames = 0, moved = 0, still = 0;
    const tick = () => {
      const W = window.__rs.W;
      for (const e of W.enemies) {
        if (e.hp <= 0 || e.rim || e.d >= 0.999 || e.state === 'hover') continue;
        const last = seen.get(e.id);
        if (last !== undefined) { if (Math.abs(e.d - last[0]) > 1e-6 || Math.abs(e.lane - last[1]) > 1e-6) moved++; else still++; }
        seen.set(e.id, [e.d, e.lane]);
      }
      if (++frames < 60) requestAnimationFrame(tick); else res({ moved, still });
    };
    requestAnimationFrame(tick);
  }));
  ok(smooth.moved + smooth.still < 10 || smooth.moved / (smooth.moved + smooth.still) > 0.6, `guest climbers glide between snapshots (${smooth.moved} moving frames, ${smooth.still} still)`);
  // the sector clear: the host rushes the webs and the boss (test only), both land on results, NEXT SECTOR takes both on
  await host.evaluate(() => {
    const rs = window.__rs, W = rs.W;
    W.lives = Math.max(W.lives, 6);
  });
  const cleared = await host.waitForFunction(() => {
    const rs = window.__rs, W = rs.W;
    if (W.boss && W.boss.state === 'fight') { W.boss.hp = Math.min(W.boss.hp, 1); for (const h of W.boss.heads) h.hp = 0; if (W.boss.segs) W.boss.segs.fill(0); if (W.boss.eye) W.boss.eye.open = true; }
    if (W.phase === 'fight' && !W.boss) { W.spawnQ = []; for (const e of W.enemies) e.hp = 0; }
    return rs.G.state === 'results';
  }, null, { timeout: 120000, polling: 250 }).then(() => true, () => false);
  const gRes = await guest.waitForFunction(() => window.__rs.G.state === 'results', null, { timeout: 20000 }).then(() => true, () => false);
  const res = await Promise.all([host, guest].map((p) => p.evaluate(() => ({ title: document.getElementById('res-title').textContent, sub: document.getElementById('res-sub').textContent, next: !document.getElementById('res-net').classList.contains('hidden'), label: document.getElementById('res-net').firstChild.textContent, ini: !document.getElementById('ini-wrap').classList.contains('hidden') }))));
  if (lag) { await host.screenshot({ path: `${shots}/net_host_results.png` }); await guest.screenshot({ path: `${shots}/net_guest_results.png` }); }
  ok(cleared && gRes, `both pages land on results (${res[0].title} / ${res[1].title} · ${res[1].sub})`);
  ok(res[0].next && res[0].label === 'NEXT SECTOR' && !res[1].next, `only the host gets ${res[0].label}`);
  ok(!res[0].ini && !res[1].ini, 'no initials entry online (co-op does not post scores)');
  const scoreBefore = (await look(host)).score;
  await host.evaluate(() => window.__rs.act('net-next'));
  const both2 = await Promise.all([host, guest].map((p) => p.waitForFunction(() => window.__rs.G.state === 'play' && window.__rs.W.sector === 1, null, { timeout: 15000 }).then(() => true, () => false)));
  await sleep(4000);
  const [h2, g2] = await Promise.all([look(host), look(guest)]);
  ok(both2[0] && both2[1] && h2.sector === 1 && g2.sector === 1, `NEXT SECTOR takes both into sector 2 (host S${h2.sector + 1} W${h2.web + 1}, guest S${g2.sector + 1} W${g2.web + 1})`);
  ok(h2.score >= scoreBefore && Math.abs(h2.score - g2.score) < 2000, `the score carries over (${scoreBefore} -> ${h2.score}, guest ${g2.score})`);
  // the guest leaves: the host is told
  await guest.evaluate(() => window.__rs.toTitle());
  const told = await host.waitForFunction(() => /PARTNER LEFT|CONNECTION LOST/.test(document.getElementById('caption').textContent) || window.__rs.G.state === 'title', null, { timeout: 15000 }).then(() => true, () => false);
  ok(told, 'the host hears that the partner left');
  // mid-sector the run ends on the results screen (score and stats), not with a jump to the title
  const hRes = await host.waitForFunction(() => window.__rs.G.state === 'results', null, { timeout: 8000 }).then(() => true, () => false);
  const hr = await host.evaluate(() => ({ title: document.getElementById('res-title').textContent, next: !document.getElementById('res-net').classList.contains('hidden') }));
  ok(hRes && /PARTNER LEFT|CONNECTION LOST/.test(hr.title) && !hr.next, `the host lands on results when the partner leaves mid-sector (${hr.title})`);
  await H.ctx.close(); await Gp.ctx.close();
}

async function quick() {
  console.log('--- quick match');
  const A = await open(`?noscores&q=low&relay=${relay}`, 'qa');
  const B = await open(`?noscores&q=low&relay=${relay}`, 'qb');
  await A.page.evaluate(() => { window.__rs.act('online'); window.__rs.act('net-quick'); });
  await sleep(1500);
  await B.page.evaluate(() => { window.__rs.act('online'); window.__rs.act('net-quick'); });
  const paired = await Promise.all([A.page, B.page].map((p) => p.waitForFunction(() => !!window.__rs.NET.peer, null, { timeout: 30000 }).then(() => true, () => false)));
  const rooms = await Promise.all([A.page, B.page].map((p) => p.evaluate(() => ({ room: window.__rs.NET.room, role: window.__rs.NET.role }))));
  ok(paired[0] && paired[1] && rooms[0].room === rooms[1].room && /^RS-Q-[A-Z0-9]{5}$/.test(rooms[0].room), `quick match pairs both pages in ${rooms[0].room} (${rooms[0].role} + ${rooms[1].role})`);
  await A.ctx.close(); await B.ctx.close();
}

try {
  await coop(0);
  await coop(80);
  await quick();
} catch (e) { ok(false, 'exception: ' + e.message); }
await browser.close();
ok(!errors.length, `console errors: ${errors.length}${errors.length ? ' · ' + [...new Set(errors)].slice(0, 6).join(' | ') : ''}`);
ok(!posts, `score POSTs attempted: ${posts}`);
process.exit(fails ? 1 : 0);
