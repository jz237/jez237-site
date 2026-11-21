// UNDERSTORM 2026 — storm fauna, refinery machines and the bosses. Pure simulation behaviour.
import { W, H, DT, clamp } from './config.js';

const sin = Math.sin, cos = Math.cos, TAU = 6.2832;
const surf = (e, S) => { e.y = e.o.at === 'ceil' ? S.ceil(e.x) - 0.55 : S.floor(e.x) + 0.55; };
const onScreen = (e) => e.x > 0.5 && e.x < W - 0.3;

export const FOES = {
  // glass jelly drifting in strings on a sine path
  mote: { hp: 10, r: 0.55, sc: 100,
    init(e, S, o) { e.y0 = o.y ?? 9; e.amp = o.amp ?? 2; e.w = o.w ?? 2.2; e.ph = o.ph ?? 0; e.v = o.v ?? 5.5; },
    update(e, S) { e.x += e.dir * e.v * DT; e.y = e.y0 + e.amp * sin(e.w * e.t * DT + e.ph); if (e.o.fire && onScreen(e) && --e.cd <= 0) { e.cd = S.cdr(e.o.fire); S.aim(e.x, e.y, 6, 1); } } },
  // static shard that lines up on the ship, then dashes
  shard: { hp: 10, r: 0.5, sc: 150,
    init(e, S, o) { e.y = o.y ?? 9; },
    update(e, S) { const p = S.pl(); if (e.t < 46) { e.x += e.dir * 3.4 * DT * (e.t < 30 ? 1.6 : 0.2); e.y += clamp(p.y - e.y, -5 * DT, 5 * DT); e.tele = e.t / 46; } else { e.tele = 0; e.x += e.dir * (e.o.v ?? 17) * DT; } } },
  turret: { hp: 34, r: 0.7, sc: 250, world: true,
    init(e, S, o) { surf(e, S); },
    update(e, S) { surf(e, S); const p = S.pl(); e.rot = Math.atan2(p.y - e.y, p.x - e.x); if (onScreen(e) && --e.cd <= 0) { e.cd = S.cdr(e.o.rate ?? 105); S.aim(e.x, e.y, 6.5, e.o.n ?? 1, 0.25); } } },
  // bursts into a ring when it dies: kill it at range, or with the tether
  puffer: { hp: 22, r: 0.8, sc: 200,
    init(e, S, o) { e.y0 = o.y ?? 9; },
    update(e, S) { e.x += e.dir * 2.6 * DT; e.y = e.y0 + sin(e.t * 0.04) * 0.8; },
    onDie(e, S, src) { if (!(src && (src.k === 'tether' || src.k === 'anchor'))) S.ring(e.x, e.y, e.o.n ?? 8, 4.6, S.rnd() * TAU); } },
  spinner: { hp: 46, r: 0.75, sc: 400,
    init(e, S, o) { e.tx = o.tx ?? 24; e.cy = o.y ?? 9; },
    update(e, S) { const life = e.o.life ?? 620; if (e.t < life) { e.cx = (e.cx ?? e.x) + (e.tx - (e.cx ?? e.x)) * 0.03; } else e.cx += e.dir * 7 * DT; e.x = e.cx + cos(e.t * 0.05) * 1.8; e.y = e.cy + sin(e.t * 0.05) * 1.8; e.rot += 0.1;
      if (onScreen(e) && e.t > 60 && e.t % S.cdr(11) === 0 && (e.t % 300) < 170) { const a = e.t * 0.09; for (const s of [0, 3.1416]) S.shoot(e.x, e.y, cos(a + s) * S.bspd(5), sin(a + s) * S.bspd(5)); } } },
  crawler: { hp: 22, r: 0.6, sc: 200, world: true,
    init(e, S, o) { surf(e, S); },
    update(e, S) { e.x += e.dir * (e.o.v ?? 2.4) * DT; surf(e, S); e.rot += 0.2; if (onScreen(e) && --e.cd <= 0) { e.cd = S.cdr(95); const s = e.o.at === 'ceil' ? -1 : 1; S.shoot(e.x, e.y, 0, s * S.bspd(5.5)); S.aim(e.x, e.y, 5.5, 1); } } },
  // supply drone: carries a pickup
  carrier: { hp: 30, r: 0.85, sc: 300,
    init(e, S, o) { e.y0 = o.y ?? 9; e.noRev = true; },
    update(e, S) { e.x += e.dir * 2.3 * DT; e.y = e.y0 + sin(e.t * 0.05) * 0.6; e.rot += 0.05; },
    onDie(e, S) { S.drop(e.x, e.y, e.o.item || 'A'); } },
  // armoured face: shots from the front glance off
  glassback: { hp: 60, r: 0.95, sc: 500,
    init(e, S, o) { e.y0 = o.y ?? 9; },
    update(e, S) { e.x += e.dir * 1.9 * DT; e.y = e.y0 + sin(e.t * 0.03) * 1.2; if (onScreen(e) && --e.cd <= 0) { e.cd = S.cdr(120); S.aim(e.x, e.y, 5.8, 3, 0.3); } },
    guard(e, src) { if (src.k === 'tether' || src.k === 'anchor' || src.k === 'mote') return false; const vx = src.vx || 0; return vx * e.dir < -0.2; } },
  gunship: { hp: 230, r: 1.35, sc: 1500,
    init(e, S, o) { e.cy = o.y ?? 9; e.tx = o.tx ?? 25; },
    update(e, S) { const life = e.o.life ?? 1100; if (e.t < life) e.x += (e.tx - e.x) * 0.025; else { e.y += 6 * DT; e.x += 2 * DT; } if (e.t < life) e.y = e.cy + sin(e.t * 0.022) * 3;
      if (onScreen(e) && --e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(e.n % 3 === 0 ? 130 : 70); if (e.n % 3 === 0) S.ring(e.x, e.y, 12, 4.4, e.t * 0.1, 1); else S.aim(e.x - 1, e.y, 6.4, 5, 0.2); } } },
  // hides in the fog until you come close or a charged shot blows the fog away
  lurker: { hp: 26, r: 0.7, sc: 350,
    init(e, S, o) { e.hidden = true; e.y = o.y ?? 9; e.world = true; },
    update(e, S) { const p = S.pl(); if (e.hidden) { if (e.reveal || (Math.hypot(p.x - e.x, p.y - e.y) < (e.o.sense ?? 7) && e.x < W - 1)) { e.hidden = false; e.world = false; e.lt = e.t; S.fx.push({ k: 'reveal', x: e.x, y: e.y }); if (e.reveal) e.stun = 50; } return; }
      const a = e.t - e.lt; if (a < 26 + (e.stun || 0)) { e.tele = a / 26; e.ta = Math.atan2(p.y - e.y, p.x - e.x); } else { e.tele = 0; e.x += cos(e.ta) * 13 * DT; e.y += sin(e.ta) * 13 * DT; } } },
  // eel: only the head can be hurt, the body blocks
  weaver: { hp: 60, r: 0.7, sc: 800,
    init(e, S, o) { e.y0 = o.y ?? 9; e.n = o.n ?? 7; e.hist = []; e.segs = []; e.amp = o.amp ?? 3; },
    update(e, S) { e.x += e.dir * (e.o.v ?? 4.2) * DT; e.y = e.y0 + e.amp * sin(e.t * 0.045 + (e.o.ph ?? 0)); e.hist.unshift(e.x, e.y); if (e.hist.length > e.n * 16 + 4) e.hist.length = e.n * 16 + 4;
      e.segs.length = 0; for (let i = 1; i <= e.n; i++) { const j = i * 14; if (j + 1 < e.hist.length) e.segs.push({ x: e.hist[j] , y: e.hist[j + 1] }); }
      if (onScreen(e) && --e.cd <= 0) { e.cd = S.cdr(110); S.aim(e.x, e.y, 6, 2, 0.3); } },
    onDie(e, S) { for (const s of e.segs) S.fx.push({ k: 'boom', x: s.x, y: s.y, s: 0.6 }); } },
  // vast, harmless, and in the way. Hurting one costs you.
  whale: { hp: 1e9, r: 2.5, sc: 0, soft: true,
    init(e, S, o) { e.y0 = o.y ?? 9; e.r = o.r ?? 2.5; e.pan = 0; e.noRev = true; },
    update(e, S) { e.x += e.dir * (e.o.v ?? 1.3) * DT * (e.panT > 0 ? 3 : 1); e.y = e.y0 + sin(e.t * 0.012 + e.x * 0.1) * 1.2; if (e.panT > 0) e.panT--; e.pan = Math.max(0, e.pan - 12 * DT); },
    guard(e, src, S, dmg) { if (src.k === 'tether' || src.k === 'anchor' || src.k === 'mote') return true; e.pan += dmg; e.flash = 3; if (e.pan > 90 && !(e.panT > 0)) { e.pan = 0; e.panT = 120; S.ring(e.x, e.y, 14, 4.2, S.rnd() * TAU, 1); S.score = Math.max(0, S.score - 1000); S.chain = 0; S.fx.push({ k: 'panic', x: e.x, y: e.y }); } return true; } },
  predator: { hp: 30, r: 0.65, sc: 400,
    init(e, S, o) { e.y = o.y ?? 9; e.a = e.dir > 0 ? 0 : 3.1416; e.v = o.v ?? 9; },
    update(e, S) { const p = S.pl(); if (e.t < 300) { let d = Math.atan2(p.y - e.y, p.x - e.x) - e.a; while (d > 3.1416) d -= TAU; while (d < -3.1416) d += TAU; e.a += clamp(d, -2.3 * DT, 2.3 * DT); } e.x += cos(e.a) * e.v * DT; e.y += sin(e.a) * e.v * DT; e.rot = e.a; } },
  // drawn to light: it only comes for you while the Lance is charging
  seeker: { hp: 24, r: 0.6, sc: 350,
    init(e, S, o) { e.y = o.y ?? 9; },
    update(e, S) { const p = S.pl(), lit = S.p.light > 0.25; e.lit = lit; if (lit) { const dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1; e.vx += (dx / d) * 22 * DT; e.vy += (dy / d) * 22 * DT; } else { e.vx += (e.dir * 1.6 - e.vx) * 0.03; e.vy *= 0.96; } const v = Math.hypot(e.vx, e.vy); if (v > 8.5) { e.vx *= 8.5 / v; e.vy *= 8.5 / v; } e.x += e.vx * DT; e.y += e.vy * DT; } },
  mine: { hp: 10, r: 0.6, sc: 150, world: true,
    init(e, S, o) { e.y = o.y ?? 9; e.noRev = true; },
    update(e, S) { const p = S.pl(); e.rot += 0.03; if (e.arm) { e.tele = e.arm / 34; if (++e.arm > 34) S.kill(e, null); } else if (Math.hypot(p.x - e.x, p.y - e.y) < 3.3) e.arm = 1; },
    onDie(e, S, src) { if (!(src && (src.k === 'tether' || src.k === 'anchor'))) S.ring(e.x, e.y, e.o.n ?? 10, 5, S.rnd(), 0); } },
  spitter: { hp: 40, r: 0.8, sc: 300, world: true,
    init(e, S, o) { surf(e, S); },
    update(e, S) { surf(e, S); if (onScreen(e) && --e.cd <= 0) { e.cd = S.cdr(75); const s = e.o.at === 'ceil' ? -1 : 1; for (const v of [-4.5, -2.5]) S.shoot(e.x, e.y + s * 0.5, v, s * S.bspd(7.5), 1, s * 9); S.fx.push({ k: 'eshot', x: e.x, y: e.y }); } } },
  // derelict fighter that wakes as you pass
  wreck: { hp: 80, r: 0.9, sc: 600, world: true,
    init(e, S, o) { e.y = o.y ?? 9; e.rot = (S.rnd() - 0.5) * 2; },
    update(e, S) { if (!e.awake) { if (e.x < (e.o.wake ?? 23)) { e.awake = 1; e.world = false; e.cd = 40; S.fx.push({ k: 'reveal', x: e.x, y: e.y }); } return; } const p = S.pl(); e.rot *= 0.94; e.y += clamp(p.y - e.y, -2.2 * DT, 2.2 * DT); e.x += sin(e.t * 0.03) * 1.2 * DT - 0.6 * DT;
      if (--e.cd <= 0) { e.b = (e.b || 0) + 1; e.cd = e.b % 3 === 0 ? S.cdr(100) : 9; S.shoot(e.x - 0.8, e.y, -S.bspd(9), 0, 3); } } },
};

// ---------------------------------------------------------------- bosses
const enter = (e, tx, ty = 9) => { e.x += (tx - e.x) * 0.02; e.y += (ty - e.y) * 0.02; return Math.abs(e.x - tx) < 0.5; };
const hpf = (e) => e.hp / e.max;

export const BOSSES = {
  // 1. A dormant tug that wakes one section at a time.
  sleeper: { name: 'THE SLEEPER', hp: 2100, sc: 20000,
    init(e, S) { e.sec = 0;
      e.eng = S.part(e, 'pod', -1.2, -3.6, 1.5, { hp: 600, weak: true }); e.arm = S.part(e, 'claw', -1.5, 3.6, 1.4, { hp: 600, weak: true, armor: true });
      e.br = S.part(e, 'eye', -2.4, 0, 1.25, { hp: 900, weak: true, armor: true }); S.part(e, 'hull', 1.5, 0, 2.6, { armor: true }); S.part(e, 'hull', 1.2, 3.4, 1.6, { armor: true }); S.part(e, 'hull', 1.4, -3.4, 1.6, { armor: true }); },
    update(e, S) { if (!enter(e, 25.5, 9 + sin(e.t * 0.012) * 1.6) && e.t < 200) return; e.x = 25.5 + sin(e.t * 0.008) * 0.8;
      if (e.sec === 0) { if (!e.eng.on) { e.sec = 1; e.arm.armor = false; e.cd = 90; S.fx.push({ k: 'wake', x: e.arm.x, y: e.arm.y }); } else if (--e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(e.n % 4 === 0 ? 150 : 62); if (e.n % 4 === 0) S.hbolt(e.eng.y, 55, 30, 0.9); else S.aim(e.eng.x - 1, e.eng.y, 6.5, 3, 0.26); } }
      else if (e.sec === 1) { const a = e.t * 0.035; e.arm.ox = -1.5 - 2.6 * Math.abs(sin(a)); e.arm.oy = 3.6 + sin(a * 2) * 2.2 - 1.2;
        if (!e.arm.on) { e.sec = 2; e.br.armor = false; e.cd = 90; S.fx.push({ k: 'wake', x: e.br.x, y: e.br.y }); } else if (--e.cd <= 0) { e.cd = S.cdr(78); S.ring(e.arm.x, e.arm.y, 9, 4.6, e.t * 0.1); } }
      else if (--e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(52); if (e.n % 5 === 0) { S.spawn('mote', { y: 4, amp: 1.5 }); S.spawn('mote', { y: 14, amp: 1.5 }); } if (e.n % 2) S.aim(e.br.x - 1, e.br.y, 7, 5, 0.2); else S.ring(e.br.x, e.br.y, 14, 4.2, e.t * 0.07, 1); } } },

  // 2. Something that only exists inside the fog. Blow the fog away with a charged Lance.
  veil: { name: 'THE VEIL', hp: 1000, sc: 22000,
    init(e, S) { e.banks = [{ x: 22, y: 14, r: 3.3, off: 0 }, { x: 26.5, y: 9, r: 3.3, off: 0 }, { x: 22, y: 4, r: 3.3, off: 0 }]; e.in = 1; e.x = 26.5; e.y = 9; e.eye = S.part(e, 'eye', 0, 0, 1.3, { weak: true }); e.stun = 0; e.cd = 100; e.hop = 300;
      const clear = (b) => { if (b.off > 0) return; b.off = 330; S.fx.push({ k: 'fogout', x: b.x, y: b.y }); if (e.banks[e.in] === b && !(e.imm > 0)) { e.stun = 170; e.vul = 2; S.fx.push({ k: 'stun', x: e.x, y: e.y }); } };
      e.onWave = (e2, S2, s) => { for (const b of e.banks) if (Math.hypot(b.x - s.x, b.y - s.y) < b.r) clear(b); };
      e.onBeam = (e2, S2, by, x0, xe) => { for (const b of e.banks) if (Math.abs(b.y - by) < b.r && b.x > x0 && b.x - b.r < xe) clear(b); }; },
    update(e, S) { for (const b of e.banks) if (b.off > 0) b.off--; const cur = e.banks[e.in];
      if (e.imm > 0) e.imm--; if (e.stun > 0) { e.stun--; if (e.stun === 0) { e.vul = 1; e.hop = 0; e.imm = 90; } e.eye.ghost = false; }
      if (e.stun <= 0 && --e.hop <= 0) { const live = e.banks.map((b, i) => i).filter((i) => e.banks[i].off <= 0 && i !== e.in); if (live.length) { e.in = live[(S.rnd() * live.length) | 0]; e.hop = 250; e.cd = 50; S.fx.push({ k: 'blink', x: e.x, y: e.y }); } else if (cur.off > 0 && !(e.imm > 0)) { e.stun = 150; e.vul = 2; } else e.hop = 120; }
      const b = e.banks[e.in]; e.x += (b.x - e.x) * 0.2; e.y += (b.y - e.y) * 0.2;
      e.eye.armor = false; e.vis = e.stun > 0 ? 1 : 0.55;
      if (e.stun <= 0 && --e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(hpf(e) < 0.5 ? 48 : 64); if (e.n % 3 === 0) S.ring(e.x, e.y, 16, 4.4, e.t * 0.1); else S.aim(e.x, e.y, 6.6, 3 + (hpf(e) < 0.5 ? 2 : 0), 0.22); if (e.n % 7 === 0) S.spawn('lurker', { x: 18 + S.rnd() * 8, y: 3 + S.rnd() * 12, sense: 30 }); } } },

  // 3. The hauler's reactor: spinning shield plates with gaps.
  reactor: { name: 'THE LONG HAUL', hp: 1350, sc: 25000,
    init(e, S) { e.core = S.part(e, 'core', 0, 0, 1.5, { weak: true }); e.pl = []; for (let i = 0; i < 5; i++) e.pl.push(S.part(e, 'plate', 3, 0, 1.05, { armor: true })); e.a = 0; },
    update(e, S) { enter(e, 25.5, 9 + sin(e.t * 0.01) * 2.2); const f = hpf(e); if (f < 0.5 && e.pl[4].on) { e.pl[4].on = false; e.pl[2].on = false; S.fx.push({ k: 'boom', x: e.x, y: e.y, s: 3, big: 1 }); }
      e.a += (f < 0.5 ? 0.034 : 0.02); e.pl.forEach((p, i) => { const a = e.a + i * 0.78; p.ox = cos(a) * 3.1; p.oy = sin(a) * 3.1; p.rot = a; });
      if (e.t > 120 && --e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(f < 0.5 ? 40 : 55); const m = e.n % 6; if (m === 5) S.hbolt(e.y, 60, 34, 1); else if (m === 2) { for (let i = 0; i < 3; i++) { const d = S.shoot(18 + S.rnd() * 12, H + 0.5, -2 - S.rnd() * 2, -3, 1, 6); if (d) d.ghost = true; } } else S.aim(e.x - 1.5, e.y, 6.8, f < 0.5 ? 4 : 3, 0.3); } } },

  // 4. The plant's control core, behind three shutters that open on the beat.
  regulator: { name: 'THE REGULATOR', hp: 1500, sc: 28000,
    init(e, S) { e.sh = []; e.nd = []; for (const y of [-4.6, 0, 4.6]) { e.nd.push(S.part(e, 'core', 1.6, y, 1.4, { weak: true })); e.sh.push(S.part(e, 'shutter', -2.2, y, 2.25, { armor: true })); } S.part(e, 'hull', 4.4, 0, 3, { armor: true }); e.open = -1; },
    update(e, S) { enter(e, 26, 9); if (e.t < 140) return; const beat = Math.floor(S.gt / 0.5), bar = Math.floor(beat / 4), f = hpf(e);
      const seq = [0, 2, 1, 2, 0, 1][bar % 6], ph = beat % 4; e.open = ph < 3 ? seq : -1; e.sh.forEach((s, i) => { s.on = !(i === e.open); s.slide = i === e.open ? 1 : 0; });
      if (beat !== e.lb) { e.lb = beat; const y = e.y + [-4.6, 0, 4.6][seq];
        if (ph === 0) S.fx.push({ k: 'clank', x: e.x - 2, y });
        if (ph === 1 || ph === 2) S.aim(e.x - 2.5, y, 6.4, f < 0.5 ? 5 : 3, 0.24);
        if (ph === 3) { S.vbolt(4 + S.rnd() * 14, 58, 26, 1.0); if (f < 0.6) S.vbolt(4 + S.rnd() * 14, 58, 26, 1.0); }
        if (ph === 0 && bar % 2 === 0) S.ring(e.x - 2.5, y, 12, 4, bar, 1); } } },

  // 5. A reef that regrows what you break.
  bloomheart: { name: 'THE BLOOMHEART', hp: 1900, sc: 30000,
    init(e, S) { e.heart = S.part(e, 'core', 0, 0, 1.5, { weak: true }); e.cells = []; e.x = 26; e.y = 9; e.t0 = 1;
      for (let c = 0; c < 4; c++) for (let r = -3; r <= 3; r++) { const b = { k: 'cry', x: S.scroll + 19.6 + c * 1.35, y: 9 + r * 1.35, w: 1.35, h: 1.35, hp: 44, max: 44 }; b.cx = b.x; b.cy = b.y; if (c === 3 && Math.abs(r) > 1) continue; S.blocks.push(b); e.cells.push(b); } },
    update(e, S) { e.x = 26; e.y = 9 + sin(e.t * 0.02) * 0.6; const f = hpf(e);
      if (e.t % (f < 0.5 ? 50 : 72) === 0) { let best = null, bd = 1e9; for (const b of e.cells) if (b.dead) { const d = Math.abs(b.y - S.pl().y) + (b.x - S.scroll) * 0.2; if (d < bd) { bd = d; best = b; } } if (best) { const p = S.p; if (Math.abs(best.x - S.scroll - p.x) > 1.5 || Math.abs(best.y - p.y) > 1.5) { best.dead = false; best.hp = best.max; best.grow = 1; best.growT = -20; S.fx.push({ k: 'grow', x: best.x - S.scroll, y: best.y }); } } }
      if (--e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(f < 0.5 ? 46 : 60); const live = e.cells.filter((b) => !b.dead && b.x - S.scroll < 21);
        if (e.n % 4 === 0) S.ring(e.x, e.y, 14, 4.2, e.t * 0.05, 1); else if (live.length) { const b = live[(S.rnd() * live.length) | 0]; S.aim(b.x - S.scroll - 1, b.y, 9, 1, 0, 3); const b2 = live[(S.rnd() * live.length) | 0]; S.aim(b2.x - S.scroll - 1, b2.y, 9, 1, 0, 3); } else S.aim(e.x, e.y, 6.5, 5, 0.25); } } },

  // 7. A casting machine that builds its own weapons mid-fight.
  caster: { name: 'THE CASTER', hp: 2000, sc: 32000,
    init(e, S) { e.core = S.part(e, 'core', 1, 0, 1.5, { weak: true }); e.door = S.part(e, 'shutter', -1.6, 0, 1.9, { armor: true }); S.part(e, 'hull', 3.6, 0, 3, { armor: true });
      e.slots = [[-3.5, 5], [-5, 0], [-3.5, -5]].map(([ox, oy]) => ({ ox, oy, w: null })); e.cast = 120; e.openT = 0; },
    update(e, S) { enter(e, 26.5, 9 + sin(e.t * 0.011) * 1.2); if (e.t < 120) return; const f = hpf(e);
      if (e.openT > 0) { e.openT--; e.door.on = false; e.door.slide = 1; } else { e.door.on = true; e.door.slide = 0; }
      if (--e.cast <= 0) { const free = e.slots.filter((s) => !s.w || !s.w.on); if (free.length) { const s = free[(S.rnd() * free.length) | 0], kinds = ['gun', 'ringer', 'lobber']; const w = S.part(e, kinds[(S.rnd() * 3) | 0], s.ox, s.oy, 1.05, { hp: 115, sc: 1500, cd: 60, born: e.t }); w.onDie = (e2) => { e2.openT = 210; S.fx.push({ k: 'clank', x: e2.x, y: e2.y }); }; s.w = w; e.openT = Math.max(e.openT, 110); S.fx.push({ k: 'cast', x: e.x + s.ox, y: e.y + s.oy }); } e.cast = f < 0.5 ? 240 : 330; }
      for (let i = e.parts.length - 1; i >= 0; i--) if (!e.parts[i].on && e.parts[i].born) e.parts.splice(i, 1);
      for (const s of e.slots) { const w = s.w; if (!w || !w.on || e.t - w.born < 50) continue; if (--w.cd <= 0) { w.rot += 1; if (w.kind === 'gun') { w.cd = S.cdr(70); S.aim(w.x - 1, w.y, 7, 3, 0.16); } else if (w.kind === 'ringer') { w.cd = S.cdr(110); S.ring(w.x, w.y, 12, 4.2, e.t * 0.1); } else { w.cd = S.cdr(60); for (const v of [-9, -6, -3.5]) S.shoot(w.x, w.y, v, 6, 1, 8); } } }
      if (e.openT > 0 && e.t % 40 === 0) S.aim(e.core.x - 2, e.core.y, 6, 1); } },

  // 8. It hunts by light. Charging the Lance tells it where you are.
  hunter: { name: 'THE DEEP HUNTER', hp: 1050, sc: 34000,
    init(e, S) { e.x = W + 5; e.y = 9; e.eye = S.part(e, 'eye', -1.3, 0, 1.1, { weak: true, armor: true }); e.body = S.part(e, 'maw', 0.6, 0, 1.7, { armor: true }); e.tail = S.part(e, 'hull', 2.6, 0, 1.2, { armor: true }); e.mode = 0; e.mt = 120; e.tx = 24; e.ty = 9; e.a = 3.14; },
    update(e, S) { const p = S.pl(), lit = S.p.light > 0.22 || S.p.beamT > 0, f = hpf(e); e.lit = lit;
      const face = (a) => { e.eye.ox = cos(a) * 1.4; e.eye.oy = sin(a) * 1.4; e.body.ox = -cos(a) * 0.5; e.body.oy = -sin(a) * 0.5; e.tail.ox = -cos(a) * 2.6; e.tail.oy = -sin(a) * 2.6; e.rot = a; };
      if (e.mode === 0) { // prowl: follows the light, or wanders if there is none
        if (lit) { e.tx = p.x; e.ty = p.y; e.know = 90; } else if (e.know > 0) e.know--; else if (e.t % 110 === 0) { e.tx = 8 + S.rnd() * 20; e.ty = 3 + S.rnd() * 12; }
        const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy) || 1; e.a = Math.atan2(dy, dx); const v = lit ? 5.2 : 2.6; if (d > 1) { e.x += (dx / d) * v * DT; e.y += (dy / d) * v * DT; } face(e.a); e.eye.armor = true; e.glow = 0;
        if (--e.mt <= 0) { e.mode = 1; e.mt = lit || e.know > 0 ? 44 : 70; e.ta = Math.atan2((lit || e.know > 0 ? p.y : e.ty) - e.y, (lit || e.know > 0 ? p.x : e.tx) - e.x); S.fx.push({ k: 'growl', x: e.x, y: e.y }); } }
      else if (e.mode === 1) { face(e.ta); e.eye.armor = false; e.glow = 1; if (--e.mt <= 0) { e.mode = 2; e.mt = 48; } }
      else if (e.mode === 2) { e.x += cos(e.ta) * 21 * DT; e.y += sin(e.ta) * 21 * DT; e.glow = 1; e.eye.armor = false; if (--e.mt <= 0 || e.x < 2 || e.x > W - 2 || e.y < 1.5 || e.y > H - 1.5) { e.x = clamp(e.x, 2, W - 2); e.y = clamp(e.y, 1.5, H - 1.5); e.mode = 3; e.mt = 95; S.ring(e.x, e.y, f < 0.5 ? 20 : 14, 4.6, S.rnd(), 0); } }
      else { e.glow = 0.6; e.eye.armor = false; if (--e.mt <= 0) { e.mode = 0; e.mt = f < 0.5 ? 120 : 170; } }
      if (e.mode === 0 && e.t % 130 === 0 && S.en.length < 6) S.spawn('seeker', { x: S.rnd() < 0.5 ? W + 1 : -1, side: S.rnd() < 0.5 ? 'L' : 'R', y: 2 + S.rnd() * 14 }); } },

  // 9. The storm front itself.
  front: { name: 'THE FRONT', hp: 1140, sc: 36000,
    init(e, S) { e.eyes = [4, 9, 14].map((y) => S.part(e, 'eye', -1.5, y - 9, 1.35, { hp: 380, weak: true, armor: true })); e.x = W + 6; e.pat = 0; e.pt = 120; e.op = -1; },
    update(e, S) { e.x += (28.5 - e.x) * 0.02; e.y = 9; if (e.t < 150) return; const live = e.eyes.filter((q) => q.on), f = hpf(e);
      S.bwx = sin(e.t * 0.013) * 3.2 - 0.8; S.bwy = sin(e.t * 0.019) * 1.4;
      if (--e.pt <= 0) { e.pat++; e.pt = f < 0.4 ? 165 : 210; const rows = [2.2, 5.6, 9, 12.4, 15.8], safe = (S.rnd() * 5) | 0, safe2 = f < 0.4 ? -1 : (safe + 2 + ((S.rnd() * 2) | 0)) % 5;
        rows.forEach((y, i) => { if (i !== safe && i !== safe2) S.hbolt(y, 90, 30, 1.45); }); if (live.length) { const q = live[(S.rnd() * live.length) | 0]; e.op = e.eyes.indexOf(q); } S.fx.push({ k: 'growl', x: e.x, y: e.y }); }
      const shut = e.pt > (f < 0.4 ? 165 : 210) - 70; for (const q of e.eyes) { q.armor = shut; q.open = q.on && !q.armor ? 1 : 0; }
      if (--e.cd <= 0 && live.length) { e.cd = S.cdr(58); const q = e.eyes[e.op] && e.eyes[e.op].on ? e.eyes[e.op] : live[0]; e.n = (e.n || 0) + 1; if (e.n % 3 === 0) S.ring(q.x, q.y, 12, 4.3, e.t * 0.1, 1); else S.aim(q.x - 1, q.y, 6.6, 3, 0.3); } } },

  // 10. A rival ace with an Anchor and tether of its own.
  ace: { name: 'THE LOST ACE', hp: 900, sc: 40000,
    init(e, S) { e.ship = S.part(e, 'ace', 0, 0, 0.8, { weak: true }); e.an = S.part(e, 'anchor', -0.5, -1.3, 0.85, { armor: true }); e.x = W + 4; e.y = 9; e.as = 0; e.at = 200; e.lines = []; e.ax = 0; e.ay = 0; },
    update(e, S) { const p = S.pl(), f = hpf(e); if (e.t < 90) { e.x += (25 - e.x) * 0.04; return; }
      const tx = 24 + sin(e.t * 0.011) * 3.5, ty = e.dodge ? e.dty : p.y + sin(e.t * 0.03) * 2.5; e.x += clamp(tx - e.x, -5 * DT, 5 * DT); e.y = clamp(e.y + clamp(ty - e.y, -6.2 * DT, 6.2 * DT), 1.5, H - 1.5);
      if (S.p.tier >= 2 && Math.abs(p.y - e.y) < 2 && !e.dodge) { e.dodge = 50; e.dty = e.y + (e.y > 9 ? -5 : 5); } if (e.dodge > 0) e.dodge--;
      e.lines.length = 0;
      if (e.as === 0) { e.an.ox = -0.5; e.an.oy = -1.3; e.tele = e.at < 45 ? 1 - e.at / 45 : 0; if (--e.at <= 0) { e.tele = 0; e.as = 1; e.ax = e.x - 0.5; e.ay = e.y - 1.3; const d = Math.hypot(p.x - e.ax, p.y - e.ay) || 1; e.avx = ((p.x - 2 - e.ax) / d) * 16; e.avy = ((p.y - e.ay) / d) * 16; S.fx.push({ k: 'launch', x: e.ax, y: e.ay }); } }
      else { if (e.as === 1) { e.ax += e.avx * DT; e.ay += e.avy * DT; if (e.ax < 2.5 || e.ay < 1 || e.ay > H - 1 || ++e.aa > 80) { e.as = 2; e.aa = 0; e.hold = f < 0.5 ? 150 : 110; } } else if (e.as === 2) { e.ay += clamp(p.y - e.ay, -1.2 * DT, 1.2 * DT); if (--e.hold <= 0) e.as = 3; } else { const dx = e.x - 0.5 - e.ax, dy = e.y - 1.3 - e.ay, d = Math.hypot(dx, dy) || 1; e.ax += (dx / d) * 22 * DT; e.ay += (dy / d) * 22 * DT; if (d < 1) { e.as = 0; e.at = f < 0.5 ? 150 : 230; e.aa = 0; } }
        e.an.ox = e.ax - e.x; e.an.oy = e.ay - e.y; e.lines.push([e.x, e.y, e.ax, e.ay]); }
      if (--e.cd <= 0) { e.n = (e.n || 0) + 1; const m = e.n % 9; e.cd = m < 6 ? 10 : S.cdr(70); if (m < 6) S.shoot(e.x - 1, e.y + (e.as ? 0 : (m % 2 ? 0.9 : -0.9)), -S.bspd(10), 0, 3); else if (m === 7) S.hbolt(e.y, 62, 26, 0.8); else if (m === 8 && f < 0.6) S.aim(e.x, e.y, 6, 5, 0.3); } } },

  // 12. The Core: shell, body, heart.
  core: { name: 'THE EYE OF THE STORM', hp: 3600, sc: 100000,
    init(e, S) { e.x = W + 7; e.y = 9; e.phs = 1; e.nodes = [[-2.6, 3.4], [-2.6, -3.4], [-4.2, 1.3], [-4.2, -1.3]].map(([ox, oy]) => S.part(e, 'gun', ox, oy, 1.0, { hp: 260, weak: true }));
      e.eye = S.part(e, 'core', 0, 0, 1.8, { weak: true, armor: true }); e.rings = []; for (let i = 0; i < 4; i++) e.rings.push(S.part(e, 'plate', 0, 0, 1.0, { armor: true })); e.arms = []; e.lines = []; e.a = 0; },
    update(e, S) { const p = S.pl(), f = hpf(e); e.a += 0.022; e.lines.length = 0;
      if (e.phs === 1) { enter(e, 26, 9 + sin(e.t * 0.012) * 1.5); e.rings.forEach((q, i) => { const a = e.a + i * 1.5708; q.ox = cos(a) * 3.3 + 0.6; q.oy = sin(a) * 3.3; q.rot = a; });
        const live = e.nodes.filter((q) => q.on); if (!live.length) { e.phs = 2; e.hp = Math.min(e.hp, e.max * 0.7); e.pt = 120; e.rings.forEach((q) => (q.on = false)); S.eb.length = 0; S.fx.push({ k: 'phase', n: 2, x: e.x, y: e.y }); for (let i = 0; i < 2; i++) { const arm = []; for (let j = 0; j < 7; j++) arm.push(S.part(e, 'seg', 0, 0, 0.7, { armor: true })); e.arms.push(arm); } return; }
        if (e.t > 120 && --e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(34); const q = live[e.n % live.length]; if (e.n % 6 === 0) S.ring(e.x, e.y, 16, 4.2, e.a, 1); else S.aim(q.x - 0.8, q.y, 6.6, 2, 0.2); } }
      else if (e.phs === 2) { e.x += (25 - e.x) * 0.02; e.y += (9 - e.y) * 0.02; const cyc = e.t % 360; e.eye.armor = cyc < 170; e.eye.open = e.eye.armor ? 0 : 1;
        e.arms.forEach((arm, k) => { const s = k ? -1 : 1; arm.forEach((q, j) => { const u = (j + 1) / 7, sw = sin(e.t * 0.022 + k * 2.2) * 0.9 + 0.25; q.ox = -u * 15 * Math.abs(cos(sw * 0.6)) - 1; q.oy = s * (7.6 - u * 6.6 * Math.abs(sw)) ; q.on = true; }); });
        if (cyc === 170) S.fx.push({ k: 'wake', x: e.x, y: e.y }); if (--e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(e.eye.armor ? 46 : 66); if (e.eye.armor) { if (e.n % 4 === 0) S.hbolt(2 + S.rnd() * 14, 62, 26, 0.9); else S.aim(e.x - 2, e.y, 6.4, 3, 0.35); } else S.ring(e.x, e.y, 14, 4, e.a * 3, 0); }
        if (f < 0.34) { e.phs = 3; e.eye.armor = false; e.eye.open = 1; e.arms.flat().forEach((q) => { q.on = false; S.fx.push({ k: 'boom', x: q.x, y: q.y, s: 0.8 }); }); e.vx = -6; e.vy = 5; S.eb.length = 0; S.fx.push({ k: 'phase', n: 3, x: e.x, y: e.y }); } }
      else { e.x += e.vx * DT; e.y += e.vy * DT; if (e.x < 12 || e.x > W - 3) { e.vx = -e.vx; e.x = clamp(e.x, 12, W - 3); } if (e.y < 3 || e.y > H - 3) { e.vy = -e.vy; e.y = clamp(e.y, 3, H - 3); }
        if (--e.cd <= 0) { e.n = (e.n || 0) + 1; e.cd = S.cdr(13); const a = e.n * 0.37; for (const s of [0, 2.094, 4.189]) S.shoot(e.x, e.y, cos(a + s) * S.bspd(4.6), sin(a + s) * S.bspd(4.6), e.n % 5 === 0 ? 1 : 0); if (e.n % 26 === 0) S.aim(e.x, e.y, 7, 5, 0.2); if (e.n % 40 === 0) S.hbolt(p.y, 66, 24, 0.85); } } } },
};
