// UNDERSTORM 2026 — autopilot. Drives the attract-mode demo and the headless stage tests.
// It reads the simulation, scores nine candidate moves a short way into the future and takes the safest.
import { W, H, DT, SPEEDS, clamp } from './config.js?v=111';

const HOR = [5, 10, 16, 24, 34];

export function botInput(S, mem) {
  const p = S.p, inp = { x: 0, y: 0, fire: false, anchor: false, spUp: false, spDn: false };
  if (!p.alive) return inp;
  const want = S.wall !== null && S.wall > 0 ? 3 : 2; if (p.sp < want) inp.spUp = true; else if (p.sp > want) inp.spDn = true;
  let intent = 'HOLDING THE LANE', tgt = null; const threats = [];
  const sp = SPEEDS[p.sp], st = S.st, a = S.a;
  for (const e of S.en) { e._vx = e._px === undefined ? 0 : (e.x - e._px) / DT; e._vy = e._py === undefined ? 0 : (e.y - e._py) / DT; e._px = e.x; e._py = e.y; if (e.parts) for (const q of e.parts) { q._vx = q._px === undefined ? 0 : (q.x - q._px) / DT; q._vy = q._py === undefined ? 0 : (q.y - q._py) / DT; q._px = q.x; q._py = q.y; } }
  // lightning: pick the safest lane while a strike is pending
  let laneY = null, laneX = null; const hb = S.hz.filter((z) => z.k === 'h'), vb = S.hz.filter((z) => z.k === 'v');
  if (hb.length) { let bd2 = -1e9; for (let y = 1.2; y <= H - 1.2; y += 0.3) { let d = 4; for (const z of hb) d = Math.min(d, Math.abs(y - z.y) - z.half); d -= Math.abs(y - p.y) * 0.06; if (y < S.floor(p.x) + 1 || y > S.ceil(p.x) - 1) d -= 9; if (d > bd2) { bd2 = d; laneY = y; } } }
  if (vb.length) { let bd2 = -1e9; for (let x = 2; x <= 16; x += 0.4) { let d = 4; for (const z of vb) d = Math.min(d, Math.abs(x - z.x) - z.half); d -= Math.abs(x - p.x) * 0.06; if (d > bd2) { bd2 = d; laneX = x; } } }
  // vents: wait short of the next one, cross while it is off
  let ventX = null, vn = 1e9; for (const v of S.vents) { const sx = v.x - S.scroll; if (sx < p.x - 1.3 || sx > p.x + 6 || sx > vn || v.x < S.ventMin) continue; if (p.y < v.y0 || p.y > v.y1) continue; vn = sx; const ph = ((S.gt / v.per + v.ph) % 1 + 1) % 1, off = ph >= v.duty ? (1 - ph) * v.per : 0, need = (sx + v.half + 1.2 - p.x) / sp + 0.15; ventX = off > need ? sx + v.half + 1.6 : Math.max(1.2, sx - v.half - 1.5); }
  // where we would like to be: a home column, level with something worth shooting
  let ty = null, bd = 1e9;
  for (const e of S.en) { if (e.dead || e.hidden || e.type === 'whale') continue; const t = e.parts ? e.parts.find((q) => q.on && q.weak && !q.armor) : e; if (!t || t.x < p.x + 1 || t.x > W) continue; const d = t.x - p.x + Math.abs(t.y - p.y) * 2; if (d < bd) { bd = d; ty = t.y; tgt = { x: t.x, y: t.y, r: t.r || e.r || 0.7, name: e.boss ? e.name : e.type }; } }
  if (tgt) intent = 'LINING UP: ' + String(tgt.name).toUpperCase();
  // the herd: never fire down a lane with a whale in it
  let herd = false; const whales = []; for (const e of S.en) if (!e.dead && e.type === 'whale' && e.x > p.x - 1) whales.push(e); for (const e of whales) if (e.x > p.x && Math.abs(e.y - p.y) < e.r + 0.7) herd = true;
  // the tether: when the Anchor is out, fly so the line between us passes through things
  const sweep = a.st >= 3 && !S.boss; let foesAhead = 0; for (const e of S.en) if (!e.dead && !e.hidden && !e.parts && e.type !== 'whale' && e.x > p.x + 2 && e.x < p.x + 17) foesAhead++;
  for (const b of S.eb) { const dx = p.x - b.x, dy = p.y - b.y, d = Math.hypot(dx, dy); if (d < 4.5 && dx * b.vx + dy * b.vy > 0) threats.push(b.x, b.y); }
  for (const k of S.pk) if (k.x > p.x - 4 && k.x < p.x + 14) { ty = k.y; mem.px = clamp(k.x, 3, 14); intent = 'COLLECTING A PICKUP'; tgt = { x: k.x, y: k.y, r: 0.7, name: 'pickup' }; }
  const homeX = mem.px !== undefined && S.pk.length ? mem.px : S.wall !== null && S.wall > 0 ? 11 : 7;
  let best = 0, bs = 1e12, bi = 0, idx = 0;
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++, idx++) {
    let s = 0; const n = dx && dy ? 0.7071 : 1;
    for (const h of HOR) {
      const far = h > 16 ? 0.12 : 1, tt = h * DT, px = clamp(p.x + dx * n * sp * tt + S.windX * tt, 0.9, W - 0.9), py = clamp(p.y + dy * n * sp * tt + S.windY * tt, 0.6, H - 0.6), near = h <= 10 ? 3 : 1;
      const wx = S.scroll + S.vs * tt + px, f = Math.max(st.floorAt(wx), S.flood === null ? -9 : S.flood + 0.4, 0), c = Math.min(st.ceilAt(wx), H);
      if (py - f < 0.5 || c - py < 0.5) s += 4000 * near * far; else { if (py - f < 1.5) s += (1.5 - (py - f)) * 60; if (c - py < 1.5) s += (1.5 - (c - py)) * 60; }
      for (const b of S.ab) { const bx = b.cx - S.scroll - S.vs * tt, ex = Math.abs(px - bx) - b.w / 2, ey = Math.abs(py - b.cy) - b.h / 2 - (b.k === 'pist' ? 1.4 : 0), d = Math.max(ex, ey); if (d < 0.45) s += 4000 * near * far; else if (d < 1.4) s += (1.4 - d) * 70; }
      for (const b of S.eb) { const d = Math.hypot(b.x + b.vx * tt - px, b.y + (b.vy - b.g * tt * 0.5) * tt - py); if (d < 0.5 + b.r) s += 2500 * near; else if (d < 1.6) s += (1.6 - d) * 120; }
      for (const e of S.en) { if (e.dead) continue; if (e.hidden) { const d = Math.hypot(e.x - px, e.y - py); if (d < 4) s += (4 - d) * 20; continue; }
        if (e.parts) { for (const q of e.parts) { if (!q.on) continue; const d = Math.hypot(q.x + (q._vx || 0) * tt - px, q.y + (q._vy || 0) * tt - py) - q.r; if (d < 0.5) s += 3000 * near; else if (d < 1.8) s += (1.8 - d) * 90; } if (e.lines) for (const l of e.lines) { const d = Math.abs((l[3] - l[1]) * px - (l[2] - l[0]) * py + l[2] * l[1] - l[3] * l[0]) / (Math.hypot(l[3] - l[1], l[2] - l[0]) || 1); if (d < 1.2 && px > Math.min(l[0], l[2]) - 1 && px < Math.max(l[0], l[2]) + 1) s += (1.2 - d) * 900; } }
        else { const d = Math.hypot(e.x + e._vx * tt - px, e.y + e._vy * tt - py) - e.r; if (e.type === 'whale') { if (d < 0.6) s += 200; } else if (d < 0.45) s += 3000 * near; else if (d < 1.7) s += (1.7 - d) * 90; if (e.type === 'shard' && e.tele > 0 && Math.abs(e.y - py) < 1.3) s += 500; if (e.type === 'mine' && d < 3.4) s += (3.4 - d) * 60; }
        if (e.segs) for (const g of e.segs) { const d = Math.hypot(g.x - px, g.y - py); if (d < 1) s += 2500 * near; else if (d < 2) s += (2 - d) * 80; } }
      for (const z of S.hz) { const left = z.tele - z.t; if (left - h < 6 && z.t + h < z.tele + z.dur + 4) { const d = z.k === 'h' ? Math.abs(py - z.y) : Math.abs(px - z.x); if (d < z.half + 0.5) s += 3500; else if (d < z.half + 1.5) s += 150; } }
      for (const v of S.vents) { const sx = v.x - S.scroll - S.vs * tt; if (Math.abs(px - sx) > v.half + 0.6 || py < v.y0 || py > v.y1 || v.x < S.ventMin) continue; const ph = (((S.gt + tt) / v.per + v.ph) % 1 + 1) % 1; if (ph < v.duty + 0.04 || ph > 0.94) s += 3500 * far; }
      if (S.wall !== null && px < S.wall + 1.5) s += 3000;
    }
    const ex = clamp(p.x + dx * n * sp * 0.3, 0.9, W - 0.9), ey = clamp(p.y + dy * n * sp * 0.3, 0.6, H - 0.6);
    const wx2 = S.scroll + ex + 3, mid = (Math.max(st.floorAt(wx2), S.flood === null ? -9 : S.flood, 0) + Math.min(st.ceilAt(wx2), H)) / 2;
    s += Math.abs(ex - (ventX !== null ? ventX : laneX !== null ? laneX : homeX)) * (ventX !== null || laneX !== null ? 14 : 3) + (laneY !== null ? Math.abs(ey - laneY) * 14 : Math.abs(ey - (ty === null ? mid : ty)) * 2.2 + Math.abs(ey - mid) * 1.2) + (dx || dy ? 0.3 : 0);
    for (const e of whales) if (e.x > ex && Math.abs(e.y - ey) < e.r + 0.7) s += 28;
    if (sweep) { let hit = 0; const ax = a.x - ex, ay = a.y - ey, al = ax * ax + ay * ay || 1; for (const e of S.en) { if (e.dead || e.hidden || e.parts || e.type === 'whale') continue; const u = clamp(((e.x - ex) * ax + (e.y - ey) * ay) / al, 0, 1); if (Math.hypot(e.x - ex - ax * u, e.y - ey - ay * u) < e.r + 0.5) hit++; } s -= Math.min(3, hit) * 55; }
    if (s < bs) { bs = s; bi = idx; best = [dx, dy]; }
  }
  inp.x = best[0]; inp.y = best[1];
  // fire: hold a full charge against bosses and heavy targets, otherwise let autofire run
  const heavy = S.boss || S.en.some((e) => !e.dead && e.type === 'gunship');
  let hiddenNear = false; if (st.fog) for (const e of S.en) if (e.hidden && e.x > p.x && e.x < p.x + 12 && Math.abs(e.y - p.y) < 4) hiddenNear = true;
  if (herd && !p.lock) { inp.fire = true; mem.c = 0; intent = 'HOLDING FIRE: HERD AHEAD'; }
  else if (heavy && !p.lock && !st.dark) { mem.c = (mem.c || 0) + 1; inp.fire = mem.c % 118 < 106; intent = inp.fire ? 'CHARGING THE LANCE' : 'LANCE AWAY'; }
  else if (hiddenNear && !p.lock) { inp.fire = p.tier < 2; intent = 'CHARGING TO CLEAR THE FOG'; }
  else { mem.c = 0; inp.fire = false; }
  if (threats.length && Math.hypot(threats[0] - p.x, threats[1] - p.y) < 2.4 || threats.length > 6) intent = 'EVADING FIRE';
  if (laneY !== null) intent = 'LIGHTNING: MOVING TO A SAFE ROW'; else if (laneX !== null) intent = 'STRIKE INCOMING: SHIFTING'; else if (ventX !== null) intent = ventX > p.x + 0.8 ? 'CROSSING THE VENT' : 'WAITING ON THE VENT';
  if (S.wall !== null && S.wall > 0) intent = 'RUNNING: FULL SPEED';
  // throw the Anchor at bosses, call it home if it strays behind
  mem.at = (mem.at || 0) + 1;
  if (a.st === 1 && S.boss && S.boss.t > 200 && mem.at > 260) { inp.anchor = true; mem.at = 0; }
  else if (a.st === 1 && !S.boss && foesAhead >= 3 && mem.at > 300 && !threats.length && S.wall === null && !whales.length) { inp.anchor = true; mem.at = 0; }
  else if (a.st >= 4 && ((!S.boss && (mem.at > 170 || foesAhead === 0 && mem.at > 60)) || mem.at > 520)) { inp.anchor = true; mem.at = 0; }
  if (sweep && intent.startsWith('LINING')) intent = 'ANCHOR OUT: SWEEPING THE TETHER';
  mem.intent = intent; mem.target = tgt; mem.threats = threats; mem.goal = [clamp(p.x + best[0] * 2, 1, W - 1), clamp(p.y + best[1] * 2, 1, H - 1)];
  return inp;
}
