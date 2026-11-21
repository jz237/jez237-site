// UNDERSTORM 2026 — the twelve stages, authored as data through a small builder.
// The builder keeps a cursor: "now" is the moment the cursor point reaches the right edge of the screen.
import { W, H, BASE_SCROLL, lerp } from './config.js?v=111';

const STEP = 0.5;
const hash = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
const vnoise = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };
const stepTrack = (tr, t, d) => { let v = d; for (const e of tr) { if (e[0] <= t) v = e; else break; } return v; };
const lerpTrack = (tr, t) => { if (!tr.length) return null; if (t <= tr[0][0]) return tr[0][1]; for (let i = 1; i < tr.length; i++) if (t < tr[i][0]) { const a = tr[i - 1], b = tr[i]; return lerp(a[1], b[1], (t - a[0]) / (b[0] - a[0])); } return tr[tr.length - 1][1]; };

class B {
  constructor() { this.x = W; this.t = 0; this.v = BASE_SCROLL; this.f = -3; this.c = 21; this.f0 = -3; this.c0 = 21; this.seg = []; this.sp = [[0, BASE_SCROLL]]; this.wd = [[0, 0, 0]]; this.ht = [[0, 1]]; this.fl = []; this.pu = [];
    this.blocks = []; this.vents = []; this.fix = []; this.ev = []; this.cps = [0]; this.endT = 0; }
  start(f, c) { this.f = this.f0 = f; this.c = this.c0 = c; return this; }
  go(sec, f = this.f, c = this.c, rough = this.rough || 0) { const len = sec * Math.abs(this.v); this.seg.push([this.x, this.x + len, this.f, this.c, f, c, rough]); this.x += len; this.t += sec; this.f = f; this.c = c; return this; }
  wait(sec) { this.t += sec; this.x += sec * this.v; return this; }
  speed(v) { this.v = v; this.sp.push([this.t, v]); return this; }
  wind(x, y) { this.wd.push([this.t, x, y]); return this; }
  heat(m) { this.ht.push([this.t, m]); return this; }
  flood(l) { this.fl.push([this.t, l]); return this; }
  pursuit(x) { this.pu.push([this.t, x]); return this; }
  cp() { this.cps.push(this.t); return this; }
  e(k, o = {}, dt = 0) { this.ev.push({ t: this.t + dt, k, ...o }); return this; }
  foe(type, o = {}, dt = 0) { return this.e('foe', { type, o }, dt); }
  wave(type, n, o = {}, gap = 0.42, dt = 0) { for (let i = 0; i < n; i++) this.foe(type, { ...o }, dt + i * gap); return this; }
  item(item, y = 9, dt = 0) { return this.foe('carrier', { item, y }, dt); }
  fixt(type, dx, o = {}) { this.fix.push({ x: this.x + dx, type, o }); return this; }
  turret(dx, at = 'floor', o = {}) { return this.fixt('turret', dx, { at, ...o }); }
  block(dx, y, w, h, k = 'solid', o = {}) { const b = { k, x: this.x + dx, y, w, h, ...o }; if (b.hp !== undefined) b.max = b.hp; this.blocks.push(b); return this; }
  cry(dx, y0, y1, hp = 34) { for (let y = y0 + 0.65; y < y1; y += 1.3) this.block(dx, y, 1.3, 1.3, 'cry', { hp }); return this; }
  seed(dx, y, g, n = 4) { return this.block(dx, y, 1.2, 1.2, 'seed', { g, n }); }
  pist(dx, y, w, h, amp, per = 2, ph = 0, ax = 'y') { return this.block(dx, y, w, h, 'pist', { amp, per, ph, ax }); }
  hull(dx, w, y0, y1, det, o = {}) { const b = { k: 'hull', x: this.x + dx + w / 2, y: (y0 + y1) / 2, w, h: y1 - y0, ...o }; if (det !== undefined) { b.detT = this.t + det; b.vx = o.vx ?? -1.5; b.vy = o.vy ?? -3; b.g = o.g ?? 2; b.vr = o.vr ?? 0.2; } this.blocks.push(b); return this; }
  vent(dx, o = {}) { this.vents.push({ x: this.x + dx, per: 2, duty: 0.35, ph: 0, half: 0.75, y0: -5, y1: 25, ...o }); return this; }
  hbolt(y, dt = 0, o = {}) { return this.e('hbolt', { y, ...o }, dt); }
  msg(text, sub, dt = 0) { return this.e('msg', { text, sub }, dt); }
  boss(name) { this.cp(); this.e('boss', { name }, 1.5); const x = this.x; this.go(2); this.seg.push([this.x, this.x + 60, this.f, this.c, this.f, this.c, 0]); this.bossName = name; return this; }
  end() { this.endT = this.t + 1.5; this.seg.push([this.x, this.x + 70, this.f, this.c, this.f, this.c, 0]); return this; }
}

function compile(def, idx) {
  const b = new B(); def.make(b); if (!b.endT) b.end();
  let maxX = 0; for (const s of b.seg) maxX = Math.max(maxX, s[1]);
  const n = Math.ceil((maxX + 4) / STEP) + 1, floor = new Float32Array(n).fill(b.f0), ceil = new Float32Array(n).fill(b.c0);
  for (const s of b.seg) { const [x0, x1, f0, c0, f1, c1, rough] = s; for (let i = Math.max(0, Math.ceil(x0 / STEP)); i <= Math.min(n - 1, Math.floor(x1 / STEP)); i++) { const x = i * STEP, u = (x - x0) / (x1 - x0 || 1), e = u * u * (3 - 2 * u); const open = f0 < -1 && f1 < -1 ? 0 : 1, openc = c0 > H + 1 && c1 > H + 1 ? 0 : 1; floor[i] = lerp(f0, f1, e) + open * rough * (vnoise(x * 0.45 + idx * 31) + 0.5 * vnoise(x * 1.3 + 7)); ceil[i] = lerp(c0, c1, e) - openc * rough * (vnoise(x * 0.4 + idx * 17 + 90) + 0.5 * vnoise(x * 1.2 + 50)); } }
  const at = (arr, wx) => { const u = wx / STEP; if (u <= 0) return arr[0]; if (u >= n - 1) return arr[n - 1]; const i = u | 0; return arr[i] + (arr[i + 1] - arr[i]) * (u - i); };
  b.ev.sort((p, q) => p.t - q.t); b.fix.sort((p, q) => p.x - q.x);
  const sp = b.sp;
  return { ...def, idx, floor, ceil, n, len: maxX, step: STEP, blocks: b.blocks, vents: b.vents, fix: b.fix, ev: b.ev, cps: b.cps, endT: b.endT, bossName: b.bossName || null,
    floorAt: (wx) => at(floor, wx), ceilAt: (wx) => at(ceil, wx),
    speedAt: (t) => stepTrack(sp, t, sp[0])[1],
    scrollAt: (t) => { let s = 0; for (let i = 0; i < sp.length; i++) { const t0 = sp[i][0], t1 = i + 1 < sp.length ? Math.min(sp[i + 1][0], t) : t; if (t1 > t0) s += (t1 - t0) * sp[i][1]; if (i + 1 < sp.length && sp[i + 1][0] >= t) break; } return s; },
    windAt: (t) => { const w = stepTrack(b.wd, t, b.wd[0]); return [w[1], w[2]]; }, heatAt: (t) => stepTrack(b.ht, t, b.ht[0])[1],
    floodAt: (t) => lerpTrack(b.fl, t), pursuitAt: (t) => lerpTrack(b.pu, t) };
}

// Palette keys: sky top/bottom, cloud lit/shade, fog, key light, rim light, terrain base/accent, glow, liquid.
const T = (o) => o;
const DEFS = [
  { name: 'SKYHOOK APPROACH', act: 1, bpm: 104, terr: 'rust', backdrop: 'pylons',
    pal: T({ sky0: 0x1c3a52, sky1: 0xf2a65a, cl: 0xffd9a0, cs: 0x5a4a6a, fog: 0x9a7a70, key: 0xffd2a0, rim: 0x52ffd8, tb: 0x6a4a3a, ta: 0xc87a3a, glow: 0x52ffd8, bolt: 0xbfe8ff }),
    make(b) { b.rough = 0.14; b.msg('STAGE 1', 'SKYHOOK APPROACH'); b.msg('', 'HOLD FIRE TO CHARGE THE LANCE', 4.5); b.msg('', 'THROW THE ANCHOR, THEN SWEEP ITS TETHER THROUGH THEM', 17); b.go(3);
      b.wave('mote', 5, { y: 12, amp: 1.4 }); b.go(4); b.wave('mote', 5, { y: 6, amp: 1.4 }); b.go(4);
      b.item('A', 9); b.go(5); b.wave('mote', 6, { y: 9, amp: 3 }); b.foe('shard', { y: 4 }, 2); b.foe('shard', { y: 14 }, 2.8); b.go(6);
      b.foe('puffer', { y: 12 }); b.foe('puffer', { y: 6 }, 1.6); b.wave('mote', 4, { y: 9, amp: 1 }, 0.42, 3); b.go(6);
      b.go(6, 3, 21); b.cp(); b.turret(3); b.turret(10); b.fixt('crawler', 15, {}); b.wave('mote', 5, { y: 13, amp: 1.5 }, 0.42, 1); b.item('M', 11, 3); b.go(8, 3.5, 21);
      b.go(5, 3, 15.5); b.turret(3, 'ceil'); b.turret(8, 'floor'); b.foe('glassback', { y: 9 }, 1); b.wave('shard', 3, { y: 9 }, 0.8, 3); b.go(8);
      b.block(4, 9, 2.4, 3.2); b.turret(9, 'ceil'); b.wave('mote', 6, { y: 5.5, amp: 0.8 }, 0.42, 1.5); b.wave('mote', 6, { y: 12.5, amp: 0.8 }, 0.42, 3); b.go(8, 3.5, 15);
      b.cp(); b.item('A', 9); b.foe('glassback', { y: 6 }, 2); b.foe('glassback', { y: 12 }, 3); b.foe('puffer', { y: 9 }, 5); b.go(8, 2.5, 16);
      b.foe('gunship', { y: 9, life: 700 }); b.wave('shard', 4, { y: 9 }, 0.9, 6); b.go(12, 2, 16.5); b.go(3, 1, 17.5);
      b.boss('sleeper'); } },

  { name: 'CLOUD-WALL CANYONS', act: 1, bpm: 104, terr: 'cloudrock', backdrop: 'canyon', fog: 1,
    pal: T({ sky0: 0x26424e, sky1: 0xb9a98a, cl: 0xe9e2cc, cs: 0x4c5560, fog: 0xa8a696, key: 0xfff0d0, rim: 0x7fe0ff, tb: 0x6f6a62, ta: 0xb9b0a0, glow: 0xffb347, bolt: 0xdff4ff }),
    make(b) { b.rough = 0.8; b.start(2, 16); b.msg('STAGE 2', 'CLOUD-WALL CANYONS'); b.go(3);
      b.wave('mote', 6, { y: 9, amp: 2.5 }); b.go(4, 3, 15); b.fixt('lurker', 4, { y: 6 }); b.fixt('lurker', 8, { y: 12 }); b.item('R', 9, 1); b.go(6, 3.5, 14.5);
      b.turret(2); b.turret(6, 'ceil'); b.fixt('lurker', 10, { y: 9 }); b.wave('shard', 3, { y: 9 }, 0.9, 2); b.go(7, 5, 13.5);
      b.go(5, 6.5, 13.5); b.fixt('crawler', 2, { at: 'ceil' }); b.fixt('crawler', 6, {}); b.go(6, 3, 10.5); b.cp();
      b.fixt('lurker', 3, { y: 5 }); b.fixt('lurker', 5, { y: 8 }); b.fixt('lurker', 9, { y: 6 }); b.foe('puffer', { y: 7 }, 2); b.item('M', 6.5, 3); b.go(7, 2.5, 9.5);
      b.go(5, 4, 15); b.foe('weaver', { y: 9.5, amp: 3 }); b.turret(4, 'ceil'); b.turret(9); b.go(8, 6, 16);
      b.fixt('lurker', 2, { y: 12 }); b.fixt('lurker', 5, { y: 9 }); b.fixt('lurker', 8, { y: 13 }); b.fixt('lurker', 11, { y: 10 }); b.wave('mote', 5, { y: 11, amp: 2, fire: 150 }, 0.42, 2); b.go(8, 8, 15.5);
      b.cp(); b.go(5, 3, 15); b.item('R', 9); b.foe('glassback', { y: 6 }, 2); b.foe('glassback', { y: 12 }, 2.6); b.fixt('spitter', 6, {}); b.fixt('spitter', 12, { at: 'ceil' }); b.go(8, 3.5, 14.5);
      b.fixt('lurker', 2, { y: 6 }); b.fixt('lurker', 4, { y: 12 }); b.fixt('lurker', 7, { y: 9 }); b.foe('gunship', { y: 9, life: 650 }, 2); b.go(11, 2.5, 15.5); b.go(3, 1.5, 16.5);
      b.boss('veil'); } },

  { name: 'THE HAULER', act: 1, bpm: 108, terr: 'hull', backdrop: 'hauler',
    pal: T({ sky0: 0x121c2c, sky1: 0xc8683a, cl: 0xffb880, cs: 0x3a3048, fog: 0x7a5648, key: 0xffc090, rim: 0xff7a4a, tb: 0x4e545c, ta: 0x9aa4ae, glow: 0xff9a3c, bolt: 0xffe0b0 }),
    make(b) { b.msg('STAGE 3', 'THE HAULER'); b.go(3); b.wave('mote', 6, { y: 6, amp: 2 }); b.go(4);
      // under the keel
      b.hull(0, 30, 11.5, 21); b.hull(6, 3, 9.5, 11.5, 9, { vy: -1 }); b.hull(16, 3.4, 8.8, 11.5, 13.5, { vy: -1.5 }); b.hull(24, 3, 9.6, 11.5);
      b.wave('shard', 3, { y: 5 }, 1, 2); b.item('A', 5, 4); b.foe('puffer', { y: 4 }, 7); b.foe('glassback', { y: 6 }, 9); b.go(12.5);
      // in through the breach
      b.hull(0, 34, 13.5, 21); b.hull(0, 34, -3, 4.5); b.hull(8, 2.6, 10.6, 13.5, 6, { vy: -4, g: 5 }); b.hull(15, 2.6, 4.5, 7.4, 9.5, { vy: 2, g: -3 }); b.hull(23, 2.4, 10.4, 13.5, 13, { vy: -4, g: 5 }); b.hull(28, 2.6, 4.5, 7.6);
      b.cp(); b.wave('mote', 5, { y: 9, amp: 1.4 }, 0.42, 1); b.foe('spinner', { y: 9, tx: 24, life: 420 }, 5); b.item('M', 9, 8); b.wave('shard', 3, { y: 9 }, 0.9, 10); b.go(14.2);
      // out over the spine
      b.hull(0, 36, -3, 6.5); b.hull(5, 3, 6.5, 8.6); b.hull(14, 4, 6.5, 9.4, 8, { vy: 4, g: -2, vx: -3 }); b.hull(22, 3, 6.5, 8.8); b.hull(30, 3, 6.5, 9.2, 14, { vy: 3.5, g: -2 });
      b.fixt('turret', 9, { y: 0, at: 'floor' }); b.foe('gunship', { y: 13, life: 600 }, 1); b.wave('mote', 6, { y: 14, amp: 1.6, fire: 160 }, 0.42, 6); b.foe('weaver', { y: 13, amp: 2.4 }, 9); b.go(15);
      // the long fall: sections tear away around you
      b.cp(); b.hull(0, 40, 14, 21, 12, { vy: 1.5, g: -1.5, vx: -1 }); b.hull(0, 40, -3, 4, 15, { vy: -1.5, g: 1.5, vx: -1 });
      for (let i = 0; i < 6; i++) b.hull(4 + i * 6, 2.2, i % 2 ? 4 : 10.5, i % 2 ? 7.5 : 14, 2 + i * 2.4, { vy: i % 2 ? 2 : -2, g: i % 2 ? -1.2 : 1.2, vx: -1.5 });
      b.item('A', 9, 1); b.wave('shard', 4, { y: 9 }, 0.8, 3); b.foe('glassback', { y: 9 }, 6); b.wave('puffer', 3, { y: 9 }, 1.4, 9); b.go(17);
      b.wave('mote', 8, { y: 9, amp: 4 }, 0.42, 0); b.go(6);
      b.boss('reactor'); } },

  { name: 'THE RAIN WORKS', act: 1, bpm: 120, terr: 'pipe', backdrop: 'works', liquid: 'rain',
    pal: T({ sky0: 0x0e2430, sky1: 0x3f7f86, cl: 0x9fd8d0, cs: 0x1e3a44, fog: 0x3c6a70, key: 0xbff4ea, rim: 0x52ffd8, tb: 0x39505a, ta: 0x6f9aa0, glow: 0x52ffd8, bolt: 0xe8ffff, liq: 0x2fd0c0 }),
    make(b) { b.start(2, 16); b.msg('STAGE 4', 'THE RAIN WORKS'); b.go(3); b.wave('mote', 5, { y: 9, amp: 2 }); b.go(4, 2.5, 15.5);
      // crushers on the bar
      for (let i = 0; i < 4; i++) b.pist(3 + i * 5.5, i % 2 ? 0 : 18, 2.6, 6, i % 2 ? 5.2 : -5.2, 2, i * 0.25);
      b.turret(12); b.item('C', 9, 2); b.go(10); b.wave('shard', 3, { y: 9 }, 0.9); b.go(3);
      // steam vents
      for (let i = 0; i < 5; i++) b.vent(2 + i * 4.2, { per: 2, duty: 0.4, ph: i * 0.2 });
      b.fixt('crawler', 6, { at: 'ceil' }); b.wave('mote', 5, { y: 12, amp: 1.5 }, 0.42, 4); b.go(9.5, 3, 15); b.cp();
      // first flood
      b.flood(-1); b.go(3); b.msg('', 'FLOOD RISING'); b.flood(-1); b.fixt('spitter', 4, { at: 'ceil' }); b.fixt('turret', 9, { at: 'ceil' }); b.wave('mote', 6, { y: 12.5, amp: 1.2 }, 0.42, 3); b.go(4); b.flood(8.2); b.go(5); b.flood(8.2); b.go(3); b.flood(-1);
      b.foe('glassback', { y: 8 }, 0); b.item('M', 9, 2); b.go(5);
      // pistons from both sides with gaps on alternating beats
      for (let i = 0; i < 6; i++) { b.pist(2 + i * 4.4, 0.5, 2.2, 7, 4.6, 2, i * 0.5); b.pist(2 + i * 4.4, 17.5, 2.2, 7, -4.6, 2, i * 0.5 + 0.5); }
      b.foe('spinner', { y: 9, tx: 25, life: 380 }, 3); b.go(12.5); b.cp();
      b.vent(3, { per: 2, duty: 0.4 }); b.vent(8, { per: 2, duty: 0.4, ph: 0.5 }); b.vent(13, { per: 2, duty: 0.4 }); b.vent(18, { per: 2, duty: 0.4, ph: 0.5 });
      b.flood(-1); b.item('C', 11); b.wave('shard', 3, { y: 11 }, 0.9, 2); b.go(4); b.flood(6.5); b.fixt('turret', 4, { at: 'ceil' }); b.fixt('crawler', 8, { at: 'ceil' }); b.go(6); b.flood(6.5); b.go(2); b.flood(-1);
      b.foe('gunship', { y: 9, life: 560 }); b.pist(8, 0.5, 2.6, 7, 5, 2, 0); b.pist(14, 17.5, 2.6, 7, -5, 2, 0.5); b.go(10, 2, 16); b.go(3, 1.5, 16.5);
      b.boss('regulator'); } },

  { name: 'THE GLASS REEF', act: 2, bpm: 96, terr: 'crystal', backdrop: 'reef',
    pal: T({ sky0: 0x10143a, sky1: 0x4a3a8a, cl: 0xc8b0ff, cs: 0x241a4a, fog: 0x4a3f86, key: 0xd8c8ff, rim: 0x7fe0ff, tb: 0x3a2f6a, ta: 0x8f7fe0, glow: 0xc8b0ff, bolt: 0xf0e8ff }),
    make(b) { b.rough = 0.5; b.start(2, 16); b.msg('STAGE 5', 'THE GLASS REEF'); b.go(3); b.cry(4, 2, 16); b.wave('mote', 5, { y: 9, amp: 2 }, 0.42, 2.5); b.go(5);
      b.cry(3, 2, 16); b.cry(4.3, 2, 16); b.item('R', 9, 3); b.go(6, 2.5, 15.5);
      // divider: upper lane choked with glass, lower lane clear unless you wake the seeds
      b.block(13, 9, 22, 1.6); b.cry(6, 9.8, 15.5); b.cry(12, 9.8, 15.5); b.cry(18, 9.8, 15.5); b.seed(9, 2.9, 1, 4); b.seed(16, 2.9, 1, 4); b.seed(21, 8, -1, 4);
      b.turret(10, 'ceil'); b.fixt('turret', 15, { at: 'floor' }); b.wave('shard', 3, { y: 5 }, 0.9, 3); b.wave('mote', 5, { y: 13, amp: 0.8 }, 0.42, 5); b.go(11); b.cp();
      b.seed(3, 2.9, 1, 9); b.seed(6, 15.1, -1, 9); b.foe('puffer', { y: 9 }, 0.5); b.foe('glassback', { y: 6 }, 2); b.foe('glassback', { y: 12 }, 3.5); b.item('M', 9, 5); b.go(7, 3.5, 14.5);
      // lattice: a grid you carve your own path through
      for (let i = 0; i < 6; i++) b.cry(3 + i * 2.6, 3.5 + (i % 2) * 1.3, 14.5, 40);
      b.fixt('spitter', 8, {}); b.fixt('spitter', 14, { at: 'ceil' }); b.wave('shard', 4, { y: 9 }, 1, 4); b.go(10); b.cp();
      b.block(9, 6, 16, 1.2); b.block(9, 12, 16, 1.2); b.seed(5, 8.6, -1, 1); b.seed(9, 9.4, 1, 1); b.seed(13, 8.6, -1, 1); b.cry(7, 12.7, 14.5); b.cry(11, 3.5, 5.3); b.cry(15, 12.7, 14.5);
      b.foe('weaver', { y: 9, amp: 1.5, n: 5 }, 1); b.item('R', 4.6, 3); b.wave('mote', 5, { y: 13.6, amp: 0.3 }, 0.42, 5); b.go(10);
      b.foe('spinner', { y: 9, life: 400 }); b.cry(6, 3.5, 14.5, 50); b.cry(7.3, 3.5, 14.5, 50); b.seed(12, 4.2, 1, 7); b.go(9, 2, 16); b.go(3, 1.5, 16.5);
      b.boss('bloomheart'); } },

  { name: 'THE MIGRATION', act: 2, bpm: 96, terr: 'none', backdrop: 'herd',
    pal: T({ sky0: 0x0c2a3a, sky1: 0x5fb0a0, cl: 0xcff0e0, cs: 0x245058, fog: 0x4f8f88, key: 0xe0fff0, rim: 0xffd28a, tb: 0x335a5a, ta: 0x7fc0b0, glow: 0xffd28a, bolt: 0xe8ffff }),
    make(b) { b.msg('STAGE 6', 'THE MIGRATION', 0); b.msg('', 'DO NOT HARM THE HERD', 3.5); b.msg('', 'HOLDING THE LANCE HOLDS YOUR FIRE', 8); b.go(4);
      const herd = (ys, dt = 0, v = 1.3) => ys.forEach((y, i) => b.foe('whale', { y, v: v + (i % 2) * 0.3, r: 2.2 + (i % 3) * 0.3 }, dt + i * 1.1));
      herd([13, 5]); b.go(6); b.wave('predator', 2, { y: 9 }, 1.2); herd([9, 15, 3], 2); b.go(7);
      b.item('A', 9); b.wave('predator', 3, { y: 2 }, 0.9, 2); herd([6, 12], 3); b.go(7); b.cp();
      herd([3, 9, 15]); b.wave('predator', 3, { y: 16, side: 'L' }, 1, 2); b.wave('mote', 5, { y: 6, amp: 1 }, 0.42, 4); b.go(8);
      herd([5.5, 12.5], 0, 1.8); b.foe('glassback', { y: 9 }, 1); b.wave('predator', 4, { y: 9 }, 0.8, 4); b.item('S', 9, 5); b.go(8);
      herd([2.5, 8, 13, 16], 0); b.wave('predator', 3, { y: 4, side: 'L' }, 0.9, 3); b.wave('predator', 3, { y: 14 }, 0.9, 5); b.go(9); b.cp();
      herd([9], 0, 1); herd([4, 14], 2.5, 1.6); b.foe('weaver', { y: 9, amp: 4 }, 3); b.wave('predator', 4, { y: 2 }, 0.7, 7); b.item('M', 9, 8); b.go(11);
      // the siege: the herd passes, the pack does not
      b.cp(); b.msg('', 'THE PACK CLOSES IN'); b.speed(0.4);
      for (let i = 0; i < 9; i++) { b.wave('predator', 3 + (i > 4 ? 1 : 0), { y: 3 + ((i * 5) % 13), side: i % 3 === 2 ? 'L' : 'R', v: 9 + i * 0.25 }, 0.5, 2 + i * 3.6); if (i % 3 === 1) b.foe('whale', { y: 4 + ((i * 7) % 10), v: 6.5, r: 2.4 }, 3 + i * 3.6); }
      b.foe('gunship', { y: 9, life: 900 }, 16); b.wave('puffer', 4, { y: 9 }, 1.5, 24);
      b.go(38); b.speed(BASE_SCROLL); b.go(2); b.end(); } },

  { name: 'THE FOUNDRY', act: 2, bpm: 100, terr: 'foundry', backdrop: 'foundry', liquid: 'lava',
    pal: T({ sky0: 0x1a0a08, sky1: 0x7a2a12, cl: 0xff8a3a, cs: 0x2a1410, fog: 0x5a2616, key: 0xffa860, rim: 0xff5a2a, tb: 0x3a2c28, ta: 0x8a5a40, glow: 0xff7a2a, bolt: 0xffe0a0, liq: 0xff5a10 }),
    make(b) { b.rough = 0.16; b.start(2.5, 16); b.heat(1.8); b.flood(1.2); b.msg('STAGE 7', 'THE FOUNDRY'); b.msg('', 'THE LANCE RUNS HOT HERE', 3.5); b.go(4);
      b.wave('mote', 5, { y: 10, amp: 2 }); b.fixt('spitter', 6, { at: 'ceil' }); b.go(5); b.flood(1.2);
      for (let i = 0; i < 4; i++) b.vent(3 + i * 5, { per: 3, duty: 0.4, ph: i * 0.25, half: 0.9, lava: 1 });
      b.item('C', 11, 1); b.wave('shard', 3, { y: 10 }, 1, 3); b.turret(12, 'ceil'); b.go(10, 2.5, 15);
      b.flood(1.2); b.go(3); b.flood(5.5); b.foe('glassback', { y: 11 }); b.wave('mote', 5, { y: 12.5, amp: 1 }, 0.42, 2); b.go(6); b.flood(5.5); b.go(2); b.flood(1.2); b.cp();
      // ladles: blocks swinging on a slow period
      for (let i = 0; i < 4; i++) b.pist(4 + i * 6, 18.5, 3, 5, -6.2, 4, i * 0.25);
      b.fixt('crawler', 5, {}); b.fixt('crawler', 15, {}); b.foe('spinner', { y: 8, life: 420 }, 3); b.item('M', 8, 6); b.go(13);
      b.vent(3, { per: 3, duty: 0.5, half: 1, lava: 1 }); b.vent(8, { per: 3, duty: 0.5, ph: 0.5, half: 1, lava: 1 }); b.vent(13, { per: 3, duty: 0.5, half: 1, lava: 1 });
      b.foe('weaver', { y: 10, amp: 2.5 }); b.fixt('spitter', 6, { at: 'ceil' }); b.fixt('spitter', 12, { at: 'ceil' }); b.go(9); b.cp();
      b.flood(1.2); b.item('C', 11); b.go(2); b.flood(7); b.block(8, 13.5, 2, 5); b.block(15, 10.2, 2, 4.4); b.fixt('turret', 5, { at: 'ceil' }); b.wave('shard', 4, { y: 12 }, 0.9, 2); b.go(8); b.flood(7); b.go(2); b.flood(1.2);
      b.foe('gunship', { y: 10, life: 620 }); b.wave('puffer', 3, { y: 10 }, 1.5, 5); b.pist(8, 18.5, 3, 5, -6, 4, 0); b.pist(15, 18.5, 3, 5, -6, 4, 0.5); b.go(11, 2, 16); b.go(3, 1.5, 16.5); b.flood(-1);
      b.boss('caster'); } },

  { name: 'BLACKOUT DEEP', act: 2, bpm: 88, terr: 'deep', backdrop: 'deep', dark: 1,
    pal: T({ sky0: 0x02040a, sky1: 0x0a1626, cl: 0x2a4a6a, cs: 0x04070c, fog: 0x060c14, key: 0x6f9fd0, rim: 0x52ffd8, tb: 0x1c2630, ta: 0x3a5068, glow: 0x52ffd8, bolt: 0xcfe8ff }),
    make(b) { b.rough = 0.7; b.start(2, 16); b.msg('STAGE 8', 'BLACKOUT DEEP'); b.msg('', 'A CHARGED LANCE LIGHTS THE WAY. THEY CAN SEE IT TOO.', 3.5); b.go(5);
      b.wave('seeker', 3, { y: 9 }, 1.2); b.go(5, 3, 15); b.e('flash', {}, 1); b.turret(4); b.turret(9, 'ceil'); b.item('A', 9, 2); b.go(7, 4, 14);
      b.block(5, 6.2, 2, 4.4); b.block(11, 11.8, 2, 4.4); b.block(17, 6.2, 2, 4.4); b.wave('seeker', 4, { y: 9 }, 1, 1); b.e('flash', {}, 4); b.go(9); b.cp();
      b.go(4, 2.5, 10); b.fixt('mine', 3, { y: 6 }); b.fixt('mine', 7, { y: 4.5 }); b.fixt('mine', 11, { y: 7.5 }); b.fixt('mine', 15, { y: 5 }); b.e('flash', {}, 2); b.wave('seeker', 3, { y: 6, side: 'L' }, 1.2, 3); b.go(8);
      b.go(4, 8, 16); b.fixt('crawler', 3, { at: 'ceil' }); b.fixt('spitter', 8, {}); b.item('M', 12, 2); b.wave('mote', 5, { y: 12, amp: 1.2 }, 0.42, 4); b.e('flash', {}, 5); b.go(8); b.cp();
      b.go(4, 3, 15); b.foe('weaver', { y: 9, amp: 3 }); b.wave('seeker', 5, { y: 9 }, 0.9, 3); b.block(8, 9, 2.4, 3); b.block(16, 4.6, 2, 3.2); b.block(16, 13.4, 2, 3.2); b.e('flash', {}, 6); b.go(10);
      b.fixt('mine', 2, { y: 6 }); b.fixt('mine', 4, { y: 12 }); b.fixt('mine', 8, { y: 9 }); b.fixt('mine', 12, { y: 5 }); b.fixt('mine', 12, { y: 13 }); b.foe('glassback', { y: 9 }, 2); b.item('A', 9, 5); b.e('flash', {}, 3); b.go(9, 2, 16);
      b.wave('seeker', 6, { y: 9 }, 0.8); b.wave('seeker', 3, { y: 9, side: 'L' }, 1, 3); b.go(8, 1.5, 16.5); b.go(2, 0.5, 17.5);
      b.boss('hunter'); } },

  { name: 'THE EYE WALL', act: 3, bpm: 128, terr: 'stormrock', backdrop: 'eyewall',
    pal: T({ sky0: 0x0a0e1e, sky1: 0x35406a, cl: 0xaab8e8, cs: 0x141a30, fog: 0x2c3558, key: 0xc8d8ff, rim: 0xffe38a, tb: 0x2c3040, ta: 0x6a7090, glow: 0xffe38a, bolt: 0xfff6c8 }),
    make(b) { b.rough = 0.5; b.msg('STAGE 9', 'THE EYE WALL'); b.go(3); b.hbolt(4, 0); b.hbolt(14, 1); b.wave('mote', 6, { y: 9, amp: 2 }); b.go(5);
      b.wind(0, -2.4); b.msg('', 'DOWNDRAFT'); b.hbolt(9, 1); b.wave('shard', 3, { y: 12 }, 0.9, 1); b.item('A', 12, 3); b.go(7);
      b.wind(0, 2.4); b.msg('', 'UPDRAFT'); b.hbolt(3, 0.5); b.hbolt(6.5, 2.5); b.foe('glassback', { y: 6 }, 1); b.wave('mote', 6, { y: 5, amp: 1.5, fire: 140 }, 0.42, 3); b.go(7); b.wind(0, 0);
      b.go(5, 3, 15); b.cp(); b.turret(3); b.turret(8, 'ceil'); b.turret(13); b.hbolt(9, 1); b.hbolt(5, 3); b.hbolt(13, 3); b.foe('spinner', { y: 9, life: 380 }, 2); b.go(9, 4, 14);
      // the storm drags you back the way you came
      b.msg('', 'REVERSE — DOCK THE ANCHOR ASTERN'); b.item('M', 9); b.go(4); b.speed(-BASE_SCROLL * 1.2); b.wind(0, 0);
      b.wave('mote', 6, { y: 7, amp: 1.5, side: 'L' }, 0.42, 1.5); b.wave('shard', 3, { y: 9, side: 'L' }, 0.9, 4); b.foe('glassback', { y: 11, side: 'L' }, 6); b.wave('predator', 3, { y: 9, side: 'L' }, 0.8, 8); b.hbolt(9, 5); b.wait(11);
      b.speed(BASE_SCROLL); b.wait(11 * 1.2 + 1); b.cp();
      b.go(4, 2, 16); b.wind(-2.2, 0); b.msg('', 'HEADWIND'); b.hbolt(3, 1); b.hbolt(15, 1); b.hbolt(9, 3.2); b.foe('gunship', { y: 9, life: 560 }, 0.5); b.item('A', 6, 2); b.go(9);
      b.wind(1.5, -1.8); b.hbolt(2.5, 0); b.hbolt(6, 0); b.hbolt(13, 2.4); b.hbolt(16, 2.4); b.wave('shard', 4, { y: 9 }, 0.8, 1); b.foe('weaver', { y: 9, amp: 3.5 }, 4); b.go(9); b.wind(0, 0);
      b.go(4, -3, 21, 0); b.wave('mote', 8, { y: 9, amp: 4 }, 0.38); b.go(4);
      b.boss('front'); } },

  { name: 'THE LOST SQUADRON', act: 3, bpm: 128, terr: 'none', backdrop: 'graveyard',
    pal: T({ sky0: 0x0a1218, sky1: 0x3a5a52, cl: 0x9fd8b8, cs: 0x10201e, fog: 0x2a4a44, key: 0xbfe8d0, rim: 0xff6a5a, tb: 0x39424a, ta: 0x7a8a92, glow: 0xff6a5a, bolt: 0xe8fff0 }),
    make(b) { b.msg('STAGE 10', 'THE LOST SQUADRON'); b.go(4); b.fixt('wreck', 3, { y: 12 }); b.fixt('wreck', 8, { y: 5 }); b.wave('mote', 5, { y: 9, amp: 2 }, 0.42, 1); b.go(7);
      b.block(5, 13.5, 5, 2.4, 'hull'); b.block(11, 4, 6, 2.2, 'hull'); b.fixt('wreck', 8, { y: 9 }); b.fixt('wreck', 15, { y: 15.5 }); b.fixt('mine', 12, { y: 9 }); b.item('R', 9, 2); b.go(8);
      b.fixt('wreck', 3, { y: 3.5 }); b.fixt('wreck', 6, { y: 14 }); b.fixt('wreck', 12, { y: 8 }); b.wave('shard', 4, { y: 9 }, 0.8, 2); b.block(9, 11, 3, 3, 'hull'); b.go(8); b.cp();
      b.fixt('mine', 2, { y: 5 }); b.fixt('mine', 4, { y: 13 }); b.fixt('mine', 7, { y: 9 }); b.fixt('mine', 10, { y: 4 }); b.fixt('mine', 10, { y: 14 }); b.foe('glassback', { y: 7 }, 1); b.foe('glassback', { y: 11 }, 2); b.item('M', 9, 4); b.go(8);
      b.block(6, 9, 9, 2, 'hull'); b.fixt('wreck', 5, { y: 12.5 }); b.fixt('wreck', 9, { y: 5.5 }); b.fixt('wreck', 14, { y: 13 }); b.fixt('wreck', 17, { y: 4.5 }); b.foe('spinner', { y: 9, tx: 26, life: 400 }, 3); b.go(10); b.cp();
      b.foe('gunship', { y: 5, life: 600 }); b.foe('gunship', { y: 13, life: 600 }, 3); b.item('A', 9, 1); b.wave('predator', 4, { y: 9 }, 0.8, 7); b.go(12);
      b.fixt('wreck', 2, { y: 9 }); b.fixt('wreck', 6, { y: 3 }); b.fixt('wreck', 6, { y: 15 }); b.block(11, 6, 4, 2, 'hull'); b.block(11, 12, 4, 2, 'hull'); b.wave('shard', 5, { y: 9 }, 0.7, 2); b.foe('weaver', { y: 9, amp: 4 }, 5); b.go(11);
      b.msg('', 'ONE OF THEM IS STILL FLYING'); b.go(3);
      b.boss('ace'); } },

  { name: 'THE THROAT', act: 3, bpm: 140, terr: 'throat', backdrop: 'throat', fast: 1,
    pal: T({ sky0: 0x12060a, sky1: 0x6a1a3a, cl: 0xff7aa0, cs: 0x1a0810, fog: 0x4a1428, key: 0xffa0c0, rim: 0xffe38a, tb: 0x3a1a2a, ta: 0x8a3a5a, glow: 0xff5a8a, bolt: 0xffe0f0 }),
    make(b) { b.rough = 0.25; b.start(2, 16); b.msg('STAGE 11', 'THE THROAT'); b.go(4); b.wave('mote', 6, { y: 9, amp: 2 }); b.item('A', 9, 2); b.go(6, 3, 15); b.cp();
      b.msg('', 'IT IS BEHIND YOU. DO NOT SLOW DOWN.'); b.go(3); b.speed(BASE_SCROLL * 3); b.pursuit(-2); b.go(1.5); b.pursuit(3.4);
      const path = [[5, 13], [7, 15], [4, 11], [2, 9], [5, 12], [8, 15.5], [6, 12.5], [3, 9.5], [2.5, 8.5], [6, 12], [9, 15.5], [7, 13], [4, 10], [2, 8.5], [5, 11], [8, 14.5], [9.5, 15.5], [6, 12], [3, 9], [5, 11.5], [7.5, 14], [4, 10.5], [2.5, 9], [5, 12], [8, 15], [5.5, 12], [3, 10], [6, 13]];
      path.forEach(([f, c], i) => { if (i % 5 === 2) b.block(8, (f + c) / 2 + (i % 2 ? 1.4 : -1.4), 1.6, 1.6); if (i === 9 || i === 19) b.cp(); if (i % 7 === 3) b.wave('mote', 3, { y: (f + c) / 2, amp: 0.6, v: 9 }, 0.3); b.go(1.55, f, c + (i < 14 ? 0.6 : 0)); });
      b.go(1.5, 3, 15); b.pursuit(3.4); b.speed(BASE_SCROLL); b.go(1.5, 2, 16); b.pursuit(-3); b.go(3); b.end(); } },

  { name: 'THE CORE', act: 3, bpm: 132, terr: 'core', backdrop: 'core', liquid: 'lava',
    pal: T({ sky0: 0x05030f, sky1: 0x2a1450, cl: 0xb890ff, cs: 0x0a0618, fog: 0x1c1038, key: 0xd0b8ff, rim: 0x52ffd8, tb: 0x241a3a, ta: 0x6a4aa0, glow: 0x52ffd8, bolt: 0xf4eaff, liq: 0x8a3aff }),
    make(b) { b.rough = 0.4; b.start(2, 16); b.msg('STAGE 12', 'THE CORE'); b.go(4); b.wave('mote', 6, { y: 9, amp: 3, fire: 150 }); b.item('A', 9, 2); b.go(5, 3, 15);
      // fog and lurkers, from the canyons
      b.fixt('lurker', 2, { y: 6 }); b.fixt('lurker', 5, { y: 12 }); b.fixt('lurker', 8, { y: 9 }); b.turret(6); b.turret(10, 'ceil'); b.go(6);
      // crushers on the beat, from the Rain Works
      for (let i = 0; i < 4; i++) { b.pist(3 + i * 4.6, 0.5, 2.2, 7, 4.8, 2, i * 0.5); b.pist(3 + i * 4.6, 17.5, 2.2, 7, -4.8, 2, i * 0.5 + 0.5); } b.item('M', 9, 2); b.go(9); b.cp();
      // glass, from the reef
      b.cry(3, 3, 15, 44); b.cry(4.3, 3, 15, 44); b.seed(8, 3.6, 1, 8); b.seed(11, 14.4, -1, 8); b.foe('glassback', { y: 9 }, 2); b.wave('shard', 4, { y: 9 }, 0.8, 4); b.go(8);
      // lava and vents, from the foundry
      b.heat(1.5); b.flood(-1); b.go(2); b.flood(6); for (let i = 0; i < 3; i++) b.vent(4 + i * 5, { per: 3, duty: 0.45, ph: i * 0.33, half: 0.9, lava: 1 }); b.fixt('spitter', 7, { at: 'ceil' }); b.wave('mote', 5, { y: 12, amp: 1.2 }, 0.42, 2); b.item('M', 12, 3); b.go(7); b.flood(6); b.go(2); b.flood(-1); b.heat(1); b.cp();
      // lightning and wind, from the eye wall
      b.wind(0, -2); b.hbolt(5, 0); b.hbolt(13, 1.5); b.hbolt(9, 3); b.foe('gunship', { y: 9, life: 540 }, 1); b.go(7); b.wind(0, 2); b.hbolt(4, 0); b.hbolt(9, 1.5); b.foe('weaver', { y: 9, amp: 3 }, 1); b.go(6); b.wind(0, 0);
      // mines and the pack
      b.fixt('mine', 2, { y: 6 }); b.fixt('mine', 5, { y: 12 }); b.fixt('mine', 8, { y: 9 }); b.wave('predator', 4, { y: 9 }, 0.7, 1); b.wave('predator', 3, { y: 9, side: 'L' }, 0.8, 4); b.item('A', 9, 3); b.go(8, 2, 16); b.go(3, 1, 17);
      b.boss('core');
      // the collapse
      b.msg('', 'IT IS COMING APART — GET OUT'); b.go(2); b.speed(BASE_SCROLL * 2.8); b.pursuit(-2); b.go(1.5); b.pursuit(3);
      const esc = [[3, 15], [5, 14], [3, 11], [2, 10], [5, 13], [7, 15.5], [5, 13], [3, 11], [4, 12], [6, 15], [3, 12], [2, 13], [1, 17]];
      esc.forEach(([f, c], i) => { if (i % 3 === 1) b.hull(6, 2, i % 2 ? c - 3 : f, i % 2 ? c : f + 3, 0.4, { vy: i % 2 ? -5 : 5, g: i % 2 ? 6 : -6, vx: -1 }); b.go(1.6, f, c); });
      b.pursuit(3); b.speed(BASE_SCROLL); b.go(1, -3, 21); b.pursuit(-3); b.go(3); b.end(); } },
];

export const STAGES = DEFS.map(compile);
export const ACTS = ['', 'THE DESCENT', 'THE DEEP', 'THE EYE'];
