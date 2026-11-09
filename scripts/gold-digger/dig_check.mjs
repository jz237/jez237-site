// The physical cave (1.8): digging plain rock, bedrock that holds, and loose things that fall and come to rest.
//   node scripts/gold-digger/dig_check.mjs [baseUrl=http://127.0.0.1:8795/games/2026-11-07/gold-digger/]
// Node (the sim): five pick blows open a plain rock cell, bedrock only clinks, a beetle whose floor is dug drops, a
// blast takes the rock next to it. Browser (headless Edge, the presentation): every blow dents the drawn rock and the
// dents go with the cell; walking into lane props knocks them over and they settle ON the drawn floor; blasting the
// rock under a prop drops it onto the new floor; rubble comes to rest; nothing falls out of the world; no page errors.
import { createRequire } from 'module';
import { SIM } from './_game.mjs';
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', 'D:/Projects/.tmp/model-s-tools/node_modules/playwright']) { try { ({ chromium } = require(p)); break; } catch { /* next */ } }
const base = process.argv[2] || 'http://127.0.0.1:8795/games/2026-11-07/gold-digger/';
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; return c; };
const t0 = Date.now();

// ------------------------------------------------------------------ the sim
{
  const W = SIM.makeWorld({ seed: 77, depth: 0, level: 1 }), M = W.M, P = W.players[0];
  const t = (x, y) => M.tiles[y * M.w + x];
  let rockN = 0, bedN = 0; for (let i = 0; i < M.w * M.h; i++) if (M.tiles[i] === 1) { rockN++; bedN += M.bed[i]; }
  ok(bedN > 0 && bedN < rockN * 0.6, `bedrock: ${bedN} of ${rockN} rock cells (vault walls, pools, shafts, under finds)`);
  const vault = M.rooms.find((c) => c.kind === 'vault');
  if (vault) ok(M.bed[(vault.y0 + 1) * M.w + vault.x0 + 1] === 1, 'a vault\'s walls are bedrock');
  const swing = (n, my = 0) => { const ev = []; for (let k = 0; k < n * 40; k++) { P.input = { mx: 0, my, jump: false, pick: k % 40 < 2, dyn: false, flare: false }; SIM.step(W); for (const e of SIM.drainEvents(W)) ev.push(e); } return ev; };
  const find = (pred) => { for (let y = 2; y < M.h - 3; y++) for (let x = 2; x < M.w - 3; x++) if (pred(x, y)) return [x, y]; return null; };
  P.inCage = false; W.cage.state = 'up'; P.inv = 99;
  const s = find((x, y) => t(x, y) === 0 && t(x, y + 1) === 0 && t(x, y - 1) === 1 && t(x + 1, y) === 1 && !M.bed[y * M.w + x + 1] && t(x + 1, y + 1) === 1);
  P.x = s[0] + 0.62; P.y = s[1]; P.face = 1; P.vx = 0;
  let ev = swing(4);
  ok(t(s[0] + 1, s[1]) === 1 && ev.filter((e) => e.k === 'pick' && e.t === 1).length === 4 && ev.every((e) => e.k !== 'pick' || e.hx !== undefined), 'four blows crack plain rock (pick events carry where the point bit)');
  ev = swing(1);
  ok(t(s[0] + 1, s[1]) === 0 && ev.some((e) => e.k === 'break' && e.t === 1), 'the fifth blow opens the cell');
  const b = find((x, y) => t(x, y) === 0 && t(x, y + 1) === 0 && t(x, y - 1) === 1 && t(x + 1, y) === 1 && M.bed[y * M.w + x + 1] === 1);
  if (b) {
    P.x = b[0] + 0.62; P.y = b[1]; P.face = 1; P.vx = 0;
    ev = swing(8);
    ok(t(b[0] + 1, b[1]) === 1 && ev.some((e) => e.k === 'clink' && e.bed), 'bedrock only clinks (8 blows)');
  }
  // a beetle whose floor is dug away drops (and lands on the floor below)
  const W2 = SIM.makeWorld({ seed: 81, depth: 1, level: 1 }), M2 = W2.M;
  const at2 = (x, y) => M2.tiles[y * M2.w + x], c = W2.crawlers.find((c) => { const x = Math.floor(c.x), y = Math.floor(c.y) - 1; return at2(x, y) === 1 && !M2.bed[y * M2.w + x] && at2(x, y - 1) === 1 && !M2.bed[(y - 1) * M2.w + x] && at2(x, y - 2) === 1; });
  if (c) {
    const P2 = W2.players[0]; P2.inCage = false; W2.cage.state = 'up'; P2.x = 2; P2.y = 99; P2.dead = true; P2.deadT = -1e9;
    const y0 = c.y;
    // blast the cell under its floor: the floor goes (rock within 1.1 m) but the beetle is out of the blast's reach
    SIM.explode(W2, { x: Math.floor(c.x) + 0.5, y: Math.floor(c.y) - 1.5, dead: false }, 1.05, false);
    for (let k = 0; k < 240; k++) SIM.step(W2);
    ok(!c.dead && c.y < y0 - 0.9 && !c.fall, `a beetle whose floor goes drops into the hole and walks on (${y0.toFixed(2)} -> ${c.y.toFixed(2)})`);
  } else ok(false, 'found a beetle on plain rock');
}

// ------------------------------------------------------------------ the browser
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
for (const phone of [false, true]) {
  const ctx = await browser.newContext(phone ? { viewport: { width: 412, height: 732 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 960, height: 540 } });
  await ctx.route('**/game-scores.jez237.workers.dev/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::|favicon/.test(m.text())) errors.push(m.text()); });
  await page.goto(base + '?fixed&noscores');
  await page.waitForFunction(() => window.__gd && window.__gd.G.state === 'title', null, { timeout: 90000 });
  const tier = await page.evaluate(() => window.__gd.R.q.name);
  const r = await page.evaluate(async (url) => {
    const v = document.querySelector('script[src*="js/main.js"]').src.split('v=')[1], SIMM = await import(new URL('js/sim.js?v=' + v, url).href).catch(() => null);   // the page's own instance
    const gd = window.__gd, out = {};
    const idle = () => ({ mx: 0, my: 0, jump: false, pick: false, dyn: false, flare: false });
    const setup = (d, l, seed) => { gd.startCampaign(d, { level: l, seed }); gd.tick(140, 1 / 60, false); const W = gd.W, P = W.players[0]; P.inCage = false; W.cage.state = 'up'; P.inv = 99; gd.G.run.auto = null; gd.G.ap = { control: idle }; return W; };
    // the floor gap of a body: its lowest hull point against the drawn floor under it
    const gap = (b) => { let low = Infinity, lp = null; for (const pt of b.pts) { const v = pt.clone().applyQuaternion(b.q).add(b.p); if (v.y < low) { low = v.y; lp = v; } } const g = gd.R.cave.groundY(lp.x, lp.y + 0.4, lp.z, 1.5); return g === null ? null : low - g; };
    // 1. digging: dents while the cell holds, gone with it
    {
      const W = setup(0, 1, 14), M = W.M, P = W.players[0], t = (x, y) => M.tiles[y * M.w + x];
      let s = null; for (let y = 2; y < M.h - 3 && !s; y++) for (let x = 3; x < M.w - 6 && !s; x++) if (t(x, y) === 0 && t(x, y + 1) === 0 && t(x - 1, y) === 0 && t(x, y - 1) === 1 && [0, 1].every((k) => t(x + 1, y + k) === 1 && !M.bed[(y + k) * M.w + x + 1])) s = [x, y];
      P.x = s[0] + 0.62; P.y = s[1]; P.face = 1;
      gd.tick(8, 1 / 60, true);
      let k = 0; gd.G.ap = { control: () => { k++; return { ...idle(), pick: k % 40 < 2 }; } };
      gd.tick(150, 1 / 60, true);
      out.dentsHeld = gd.R.cave.dents.length;
      gd.tick(60, 1 / 60, true);
      out.dentsAfter = gd.R.cave.dents.filter((d) => Math.abs(d.x - (s[0] + 1.5)) < 0.7 && Math.abs(d.y - (s[1] + 0.5)) < 0.7).length;
      out.opened = t(s[0] + 1, s[1]) === 0;
      gd.G.ap = { control: idle };
      gd.tick(300, 1 / 60, true);
      const L = gd.R.loose;
      out.rubble = { live: L.info.live, heap: L.info.heap, awake: L.info.awake };
      out.rubbleGaps = L._bodies.filter((b) => !b.hang).map(gap).filter((g) => g !== null);
      out.newProgs = 0;
    }
    // 2. knocking: run into lane props, they settle on the drawn floor
    {
      const W = setup(0, 2, 13), P = W.players[0], L = gd.R.loose;
      const list = L._cands.filter((c) => c.lane && c.st === 'baked' && !c.kd.hang).slice(0, 8);
      P.x = list[0].x - 0.5; P.y = Math.round(list[0].y0); gd.tick(60, 1 / 60, true);   // (the digger's own first-use programs compile here)
      const p1 = gd.R.r.info.programs.length;
      L.event({ k: 'blast', x: P.x + 1, y: P.y + 0.3 }, W); gd.tick(30, 1 / 60, true);   // everything round him lifted out at once, camera still
      out.newProgs += gd.R.r.info.programs.length - p1;
      gd.tick(270, 1 / 60, true);   // and let it all settle
      for (const c of list) { P.x = c.x - 0.5; P.y = Math.round(c.y0); P.vx = 4.3; P.face = 1; gd.tick(1, 1 / 60, true); P.x = -50; P.vx = 0; }
      const tA = performance.now(); gd.tick(300, 1 / 60, true); out.msPerFrame = (performance.now() - tA) / 300;
      out.knocked = list.filter((c) => c.st === 'live').length; out.tried = list.length;
      out.knockGaps = list.filter((c) => c.body).map((c) => gap(c.body));
      out.knockAwake = list.filter((c) => c.body && c.body.awake).map((c) => c.kind + ' v' + c.body.v.length().toFixed(2) + ' w' + c.body.w.length().toFixed(2));
    }
    // 3. the rock under a prop is blasted away: it drops onto the new floor
    if (SIMM) {
      const W = setup(0, 0, 11), M = W.M, L = gd.R.loose;
      const c = L._cands.find((c) => c.root && c.st === 'baked' && !c.kd.hang && !c.kd.big && c.root.userData.feet && c.root.userData.feet[0][0] === 'floor' && [...c.sup].some((k) => { const x = k % 4096, y = Math.floor(k / 4096); return M.tiles[y * M.w + x] === 1 && !M.bed[y * M.w + x] && M.tiles[(y - 1) * M.w + x] === 1; }));
      if (c) {
        const k = [...c.sup][0], x = k % 4096, y = Math.floor(k / 4096), y0 = c.y;
        W.players[0].x = x + 6;
        SIMM.explode(W, { x: x + 0.5, y: y + 0.5, dead: false }, 0.9, false);
        gd.tick(300, 1 / 60, true);
        out.drop = { kind: c.kind, st: c.st, dy: c.body ? c.body.p.y - y0 : null, gap: c.body ? gap(c.body) : null, open: M.tiles[y * M.w + x] === 0 };
      }
    }
    // 4. hanging growth and glow-worm threads go with a dug roof (the grotto's)
    if (SIMM) {
      const W = setup(1, 0, 14), M = W.M, L = gd.R.loose;
      const plain = (k) => { const x = k % 4096, y = Math.floor(k / 4096); return M.tiles[y * M.w + x] === 1 && !M.bed[y * M.w + x]; };
      const c = L._cands.find((c) => c.kind === 'strands' && [...c.sup].every(plain));
      const wt = L ? (gd.R.decor.worms ? gd.R.decor.worms.threads.find(([k]) => plain(k)) : null) : null;
      out.growth = {};
      if (c) { const k = [...c.sup][0]; W.players[0].x = (k % 4096) + 8; SIMM.explode(W, { x: (k % 4096) + 0.5, y: Math.floor(k / 4096) + 0.5, dead: false }, 0.6, false); gd.tick(10, 1 / 60, true); out.growth.strands = c.st; }
      if (wt) { const k = wt[0]; SIMM.explode(W, { x: (k % 4096) + 0.5, y: Math.floor(k / 4096) + 0.5, dead: false }, 0.6, false); gd.tick(10, 1 / 60, true); out.growth.worm = gd.R.decor.worms.pts.geometry.attributes.position.getY(wt[1]); }
    }
    out.lost = gd.R.loose._bodies.filter((b) => !b.hang && b.p.y < -5).length;
    return out;
  }, base);
  ok(r.dentsHeld >= 3, `${tier}: pick blows dent the drawn rock (${r.dentsHeld} dents while the cell holds)`);
  ok(r.opened && r.dentsAfter === 0, `${tier}: the cell opens and its dents go with it`);
  ok(r.rubbleGaps.length > 0 || r.rubble.heap > 0, `${tier}: rubble tumbles out (${r.rubble.live} loose, ${r.rubble.heap} heap verts, ${r.rubble.awake} still moving)`);
  ok(r.rubbleGaps.every((g) => g > -0.06 && g < 0.03), `${tier}: loose rubble rests on the drawn floor (gaps ${r.rubbleGaps.map((g) => g.toFixed(3)).join(' ')})`);
  ok(r.knocked >= Math.min(3, r.tried) && r.knockGaps.every((g) => g !== null && g > -0.06 && g < 0.03), `${tier}: ${r.knocked}/${r.tried} lane props knocked over, resting on the floor (${r.knockGaps.map((g) => g === null ? '-' : g.toFixed(3)).join(' ')})`);
  ok(r.knockAwake.length === 0, `${tier}: knocked props come to rest within 5 s (${r.knockAwake.join(', ') || 'all still'})`);
  ok(r.msPerFrame < 8, `${tier}: frame with knocked props ${r.msPerFrame.toFixed(2)} ms (headless, incl. render)`);
  if (r.drop) ok(r.drop.open && r.drop.st === 'live' && r.drop.dy < -0.3 && r.drop.gap !== null && Math.abs(r.drop.gap) < 0.05, `${tier}: blasting the rock under a ${r.drop.kind} drops it onto the floor below (dy ${r.drop.dy && r.drop.dy.toFixed(2)}, gap ${r.drop.gap && r.drop.gap.toFixed(3)})`);
  else ok(false, `${tier}: found a prop on plain rock to blast out from under it`);
  ok(r.growth && r.growth.strands === 'gone' && (r.growth.worm === undefined || r.growth.worm < -900), `${tier}: hanging strands and glow-worm threads go with a dug roof (${JSON.stringify(r.growth)})`);
  ok(r.lost === 0, `${tier}: nothing fell out of the world`);
  ok(r.newProgs === 0, `${tier}: lifting everything round him out of the bake compiles no new shader programs (${r.newProgs})`);
  ok(!errors.length, `${tier}: no page errors (${errors.slice(0, 3).join(' | ')})`);
  await ctx.close();
}
await browser.close();
console.log(`${fail ? 'FAIL' : 'PASS'} · ${Math.round((Date.now() - t0) / 1000)} s`);
process.exit(fail ? 1 : 0);
