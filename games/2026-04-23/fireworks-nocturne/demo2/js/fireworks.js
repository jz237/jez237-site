// Launch and break engine. Shells leave a mortar on a barge, climb on a real
// drag curve with a fuse or tail, and break at the apex; the break builds its
// star records, smoke, light and sound events. Everything is placed at its
// scheduled show time, so late frames and seeking still land things exactly.
import { StarBatch, K_FLASH, K_FUSE, K_GERB, K_CRACKLE, T_GOLD, T_SILVER, T_GLITTER, T_COLOR, T_FALL } from './particles.js?v=5';
import { SHELLS, colorOf } from './shells.js?v=5';
import { starPos, starVel, aimShell, rng } from './physics.js?v=5';
import { SITE } from './site.js?v=5';

const SHELL_C = 0.0032, SHELL_KG = 0.07;
// Workshop modifiers; every value is clamped again here so no setting can
// take a shell outside what the real thing does.
const MOD_RANGE = { count: [0.5, 1.6], spread: [0.7, 1.3], life: [0.7, 1.4], bright: [0.6, 1.5], tail: [0.6, 1.5], hang: [0.75, 1.4] };
export function cleanMods(m) {
  const out = {};
  for (const k in MOD_RANGE) {
    const v = m && Number.isFinite(m[k]) ? m[k] : 1;
    out[k] = Math.min(MOD_RANGE[k][1], Math.max(MOD_RANGE[k][0], v));
  }
  return out;
}
const scratch = [0, 0, 0];

export class Fireworks {
  constructor({ particles, smoke, lights, audio, tier, wind }) {
    this.P = particles;
    this.smoke = smoke;
    this.lights = lights;
    this.audio = audio;
    this.tier = tier;
    this.wind = wind; // [x, y, z], shared and slowly varying
    this.queue = [];
    this.r = rng(1);
    this.onBreak = null;
    this.tailRate = tier.sparkK / 64;
    this.waterfallUntil = -1;
    this.breaks = []; // upcoming and recent breaks { t, inches }, for the camera director
    this.waterfallFrom = Infinity;
  }

  seed(s) { this.r = rng(s); }

  schedule(t, fn) {
    let i = this.queue.length;
    while (i > 0 && this.queue[i - 1].t > t) i--;
    this.queue.splice(i, 0, { t, fn });
  }

  update(now) {
    while (this.queue.length && this.queue[0].t <= now) {
      const e = this.queue.shift();
      e.fn(e.t);
    }
  }

  clear() { this.queue.length = 0; this.waterfallUntil = -1; this.breaks.length = 0; }

  bargePos(i, spread = 14) {
    const b = SITE.barges[(i + SITE.barges.length) % SITE.barges.length];
    return [b.x + (this.r() - 0.5) * spread * 2, 3.2, b.z + (this.r() - 0.5) * 6];
  }

  nearestBarge(x) {
    let best = 0;
    SITE.barges.forEach((b, i) => { if (Math.abs(b.x - x) < Math.abs(SITE.barges[best].x - x)) best = i; });
    return best;
  }

  // Shell from a barge to a break point. target [x, y, z] or null for a natural height.
  launchShell({ t, type, inches = 6, barge, target, color, color2, palette, rise, from, manual = false, mods }) {
    const r = this.r;
    const mortar = from || this.bargePos(barge ?? r.int(0, SITE.barges.length - 1));
    const H = 32 * inches * (0.9 + r() * 0.2);
    const tgt = target || [mortar[0] + (r() - 0.5) * 50, H, mortar[2] + (r() - 0.5) * 40];
    const aim = aimShell(mortar, tgt, SHELL_C, SHELL_KG, this.wind);
    const tb = aim.t;
    this.breaks.push({ t: t + tb, inches });
    if (this.breaks.length > 80) this.breaks.shift();
    rise = rise || r.pick(['tail', 'tail', 'none', 'none', 'silver', 'whistle', 'glitter']);
    const batch = new StarBatch(4);
    const riser = { p0: mortar, t0: t, v0: aim.v0, c: SHELL_C, kg: SHELL_KG, life: tb, kind: K_FUSE, colA: [0.5, 0.2, 0.05], glowR: 0.25, head: rise === 'none' || rise === 'whistle' ? 0.25 : 0.5, seed: r() };
    if (rise === 'tail') riser.tail = { kind: T_GOLD, rate: 44 * this.tailRate, life: 0.75, eject: 2.2, inherit: 0.12, ks: 3, power: 0.26 / this.tailRate };
    if (rise === 'silver') riser.tail = { kind: T_SILVER, rate: 40 * this.tailRate, life: 0.4, eject: 4, inherit: 0.1, ks: 4, power: 0.32 / this.tailRate };
    if (rise === 'glitter') riser.tail = { kind: T_GLITTER, rate: 34 * this.tailRate, life: 1.1, eject: 1.4, inherit: 0.1, ks: 2.8, power: 0.42 / this.tailRate };
    batch.push(riser);
    // muzzle flash from the mortar
    batch.push({ p0: mortar, t0: t, v0: [0, 0, 0], c: 0, kg: 1, life: 0.07, kind: K_FLASH, colA: [16, 9, 4], glowR: 3 + inches * 0.3, seed: r() });
    batch.commit(this.P);
    this.lights.flash({ t0: t, pos: [mortar[0], 5, mortar[2]], color: [1, 0.68, 0.38], power: 1.2e4 * inches, tau: 0.05, radius: 4 });
    const sm = this.tier.smokeScale;
    for (let i = 0; i < Math.max(1, Math.round(2 * sm + 0.5)); i++) {
      this.smoke.puff([mortar[0] + (r() - 0.5) * 3, 4, mortar[2]], t, [(r() - 0.5) * 2, 5 + r() * 4, (r() - 0.5) * 2], 1.3, 1.6, 2.2, 28 + r() * 12, 7, [0.75, 0.74, 0.74]);
    }
    const nr = Math.max(2, Math.round(6 * sm));
    for (let i = 1; i <= nr; i++) {
      const tau = tb * i / (nr + 1);
      starPos(scratch, mortar, aim.v0, SHELL_C, SHELL_KG, tau, this.wind);
      this.smoke.puff(scratch.slice(), t + tau, [0, 0, 0], 1, 0.7, 0.8, 18 + r() * 10, rise === 'none' || rise === 'whistle' ? 0.6 : 1.6, [0.8, 0.8, 0.82]);
    }
    this.audio.event('launch', t, mortar, { size: inches });
    if (rise === 'whistle') this.audio.event('whistle', t + 0.1, mortar, { size: inches, follow: { v0: aim.v0, c: SHELL_C, kg: SHELL_KG } });
    else if (rise !== 'none') this.audio.event('rise', t + 0.05, mortar, { size: inches });
    const pos = starPos([0, 0, 0], mortar, aim.v0, SHELL_C, SHELL_KG, tb, this.wind);
    const vel = starVel([0, 0, 0], aim.v0, SHELL_C, SHELL_KG, tb, this.wind);
    this.schedule(t + tb, (tt) => this.burst({ t: tt, pos, vel, type, inches, color, color2, palette, manual, mods }));
    return { tBreak: t + tb, pos };
  }

  burst({ t, pos, vel = [0, 0, 0], type = 'peony', inches = 6, color, color2, palette, depth = 0, manual = false, mods }) {
    const r = this.r;
    const batch = new StarBatch(256);
    const recs = [];
    const T = this.tier;
    const wind = this.wind;
    const tailK = T.sparkK;
    const info = { t, pos, inches, type, manual, caption: '', sound: null, light: null, smoke: 1, albedo: null, pops: [] };
    const axis = r.dir();
    const M = cleanMods(mods);
    const starCap = Math.round(1400 * T.starScale);
    const B = {
      t, pos, vel, r, inches, R: 11 * inches * (mods ? 0.97 + r() * 0.06 : 0.9 + r() * 0.2) * M.spread, color, color2, palette, axis, skew: (r() - 0.5) * 0.12,
      tailRate: this.tailRate,
      count: (base) => Math.min(starCap, Math.max(8, Math.round(base * 1.5 * Math.pow(inches / 6, 1.25) * T.starScale * M.count))),
      add: (s) => {
        if (mods && !s.modded && s.kind !== K_FLASH) {
          s.modded = true;
          s.life *= M.life;
          if (s.tChange !== undefined) s.tChange *= M.life;
          if (s.kind === K_CRACKLE && s.popT !== undefined) s.popT *= M.life;
          s.kg = (s.kg ?? 0.85) * M.hang;
          s.colA = s.colA.map(v => v * M.bright);
          if (s.colB) s.colB = s.colB.map(v => v * M.bright);
          if (s.tail) s.tail = { ...s.tail, life: s.tail.life * M.tail, power: s.tail.power * M.bright, delay: (s.tail.delay || 0) * M.life };
        }
        if (s.tail) {
          const maxRate = (tailK - 1) / (s.tail.life * 1.45);
          if (s.tail.rate > maxRate) { s.tail.power *= s.tail.rate / maxRate; s.tail.rate = maxRate; }
        }
        batch.push(s);
        recs.push(s);
      },
      pos3: (s, tau) => starPos([0, 0, 0], s.p0, s.v0, s.c, s.kg, tau, wind),
      vel3: (s, tau) => starVel([0, 0, 0], s.v0, s.c, s.kg, tau, wind),
      light: (c, scale = 1, life = 2.2, flash = 1) => { info.light = { c, scale: scale * M.bright, life: life * M.life, flash }; },
      smokeLevel: (lvl, albedo) => { info.smoke = lvl; info.albedo = albedo; },
      pops: (list) => info.pops.push(...list),
      child: (dt, p, ty, inch, colr) => this.schedule(t + dt, (tt) => this.burst({ t: tt, pos: p, vel: [0, 0, 0], type: ty, inches: inch, color: colr, color2: mods ? 'none' : undefined, depth: depth + 1, mods })),
      sound: (k) => { info.sound = k; },
      caption: (c) => { info.caption = c; },
    };
    (SHELLS[type] || SHELLS.peony)(B);
    // the bursting charge's own flash
    if (type !== 'salute') batch.push({ p0: pos, t0: t, v0: [0, 0, 0], c: 0, kg: 1, life: 0.06, kind: K_FLASH, colA: [9 * inches / 6, 8 * inches / 6, 6.5 * inches / 6], glowR: 3 + inches * 0.6, seed: r() });
    batch.commit(this.P);
    info.stars = recs.length;
    info.radius = B.R;

    // light in the air
    const L = info.light || { c: [1, 0.8, 0.6], scale: 1, life: 2.2, flash: 1 };
    const m = Math.max(L.c[0], L.c[1], L.c[2], 1e-3);
    this.lights.burst({
      t0: t, pos, color: [L.c[0] / m, L.c[1] / m, L.c[2] / m],
      flash: 1.6e4 * Math.pow(inches, 1.5) * L.flash, flashTau: L.flash > 2 ? 0.035 : 0.06,
      glow: 2.0e3 * Math.pow(inches, 1.6) * L.scale, life: L.life, radius: B.R * 0.8, kg: 0.9,
    });

    // smoke laid along the stars' paths, plus the bursting charge's cloud
    const n = Math.round(info.smoke * (4 + inches * 2.4) * T.smokeScale);
    const alb = info.albedo || [0.8, 0.8, 0.84];
    for (let i = 0; i < n && recs.length; i++) {
      const s = recs[Math.floor(r() * recs.length)];
      const tau = (0.08 + r() * 0.7) * Math.min(s.life, 3);
      const p = starPos([0, 0, 0], s.p0, s.v0, s.c, s.kg, tau, wind);
      const v = starVel([0, 0, 0], s.v0, s.c, s.kg, tau, wind);
      this.smoke.puff(p, s.t0 + tau, [v[0] * 0.05 + (r() - 0.5) * 3, v[1] * 0.05 + (r() - 0.5) * 3, v[2] * 0.05 + (r() - 0.5) * 3], 0.8, 1.8 + inches * 0.35 + r() * 1.5, 2.2 + inches * 0.3, 38 + r() * 26, 4.5 * (1 + inches / 8) * info.smoke, alb);
    }
    const core = Math.max(1, Math.round((1 + inches / 4) * T.smokeScale + 0.4));
    for (let i = 0; i < core; i++) {
      this.smoke.puff([pos[0] + (r() - 0.5) * B.R * 0.2, pos[1] + (r() - 0.5) * B.R * 0.2, pos[2] + (r() - 0.5) * B.R * 0.2], t + 0.05, [0, 0, 0], 1, B.R * 0.1, 2.5 + inches * 0.25, 45 + r() * 20, 9 * (inches / 6), alb);
    }

    // sound
    if (info.sound === 'salute') this.audio.event('salute', t, pos, { size: inches });
    else this.audio.event('boom', t, pos, { size: inches, type });
    if (info.pops.length) this.audio.pops(info.pops, pos, inches);
    if (type === 'willow' || type === 'kamuro' || type === 'glitter' || type === 'brocade' || type === 'horsetail') this.audio.event('sizzle', t + 0.4, pos, { size: inches });
    if (this.onBreak && depth === 0) this.onBreak(info);
    return info;
  }

  // A fan of comets from a barge (cake).
  fan({ t, barge, n = 7, spread = 0.45, tilt = 0, kind = 'gold', color, speed = 1, mods }) {
    const r = this.r;
    const M = cleanMods(mods);
    const base = this.bargePos(barge, 6);
    const batch = new StarBatch(16);
    if (typeof color === 'string') {
      if (color === 'silver' || color === 'white') { kind = 'silver'; color = null; } else if (color === 'gold') { kind = 'gold'; color = null; } else color = colorOf(color, 1.15);
    }
    const tail0 = kind === 'silver'
      ? { kind: T_SILVER, rate: 44 * this.tailRate, life: 0.45, eject: 4, inherit: 0.15, ks: 4, power: 0.34 / this.tailRate }
      : { kind: T_GOLD, rate: 56 * this.tailRate, life: 0.9, eject: 1.8, inherit: 0.18, ks: 3, power: 0.3 / this.tailRate };
    // coloured comets shed sparks in their own colour so the colour reads
    if (color) Object.assign(tail0, { kind: T_COLOR, life: 0.55, eject: 1.6, power: 0.34 / this.tailRate });
    const tail = { ...tail0, life: tail0.life * M.tail, power: tail0.power * M.bright };
    const colA = (color ? color : kind === 'silver' ? [1.6, 1.65, 1.75] : [1.6, 0.8, 0.22]).map(v => v * M.bright);
    for (let i = 0; i < n; i++) {
      const f = n === 1 ? 0 : i / (n - 1) * 2 - 1;
      const a = f * spread + tilt;
      const sp = (58 + r() * 10) * speed;
      const d = [Math.sin(a), Math.cos(a), (r() - 0.5) * 0.08];
      const tt = t + i * 0.035 * r();
      const s = { p0: base, t0: tt, v0: [d[0] * sp, d[1] * sp, d[2] * sp], c: 0.006, kg: 0.35 * M.hang, life: (1.9 + r() * 0.6) * M.life, colA, glowR: 0.9, seed: r(), tail, flicker: 0.12 };
      const maxRate = (this.tier.sparkK - 1) / (tail.life * 1.45);
      if (tail.rate > maxRate) s.tail = { ...tail, rate: maxRate, power: tail.power * tail.rate / maxRate };
      batch.push(s);
    }
    batch.push({ p0: base, t0: t, v0: [0, 0, 0], c: 0, kg: 1, life: 0.06, kind: K_FLASH, colA: [10, 6, 3], glowR: 4, seed: r() });
    batch.commit(this.P);
    this.lights.flash({ t0: t, pos: [base[0], 6, base[2]], color: [1, 0.7, 0.4], power: 5e4, tau: 0.06, radius: 5 });
    this.lights.burst({ t0: t + 0.3, pos: [base[0], 60, base[2]], color: kind === 'silver' ? [0.9, 0.92, 1] : [1, 0.6, 0.25], flash: 0, glow: 8e3, life: 2.2, radius: 40, kg: 0 });
    this.smoke.puff([base[0], 5, base[2]], t, [0, 6, 0], 1, 2.5, 3, 30 + r() * 10, 12, [0.75, 0.74, 0.74]);
    this.audio.event('launch', t, base, { size: 3, gain: 0.55, rate: 1.35 });
    this.audio.event('rise', t + 0.05, base, { size: 3, gain: 0.5 });
  }

  // Mine: a burst fired straight out of the mortar at the barge.
  mine({ t, barge, color, count = 60, cone = 0.38, speed = 1, mods }) {
    const r = this.r;
    const M = cleanMods(mods);
    const base = this.bargePos(barge, 6);
    const batch = new StarBatch(count + 2);
    if (typeof color === 'string') color = colorOf(color, 1.1);
    const c = (color || [1.6, 0.75, 0.2]).map(v => v * M.bright);
    const tl = 0.6 * M.tail;
    for (let i = 0; i < Math.round(count * M.count * this.tier.starScale + 8); i++) {
      const a = r() * Math.PI * 2, s = Math.sqrt(r()) * cone * M.spread;
      const d = [Math.cos(a) * s, 1, Math.sin(a) * s];
      const l = Math.hypot(...d);
      const sp = (30 + r() * 30) * speed;
      batch.push({ p0: base, t0: t, v0: [d[0] / l * sp, d[1] / l * sp, d[2] / l * sp], c: 0.02, kg: 0.8 * M.hang, life: (1.4 + r() * 0.8) * M.life, colA: c, glowR: 0.6, seed: r(), tail: { kind: T_GOLD, rate: Math.min(30 * this.tailRate, (this.tier.sparkK - 1) / (tl * 1.45)), life: tl, eject: 1.5, inherit: 0.2, ks: 3, power: 0.2 / this.tailRate * M.bright } });
    }
    batch.push({ p0: base, t0: t, v0: [0, 0, 0], c: 0, kg: 1, life: 0.07, kind: K_FLASH, colA: [14, 9, 5], glowR: 6, seed: r() });
    batch.commit(this.P);
    this.lights.burst({ t0: t, pos: [base[0], 30, base[2]], color: normalise(c), flash: 8e4, flashTau: 0.05, glow: 1.4e4, life: 1.8, radius: 30, kg: 0 });
    this.smoke.puff([base[0], 8, base[2]], t, [0, 8, 0], 1, 4, 3, 35, 22, [0.75, 0.74, 0.74]);
    this.audio.event('boom', t, base, { size: 3, gain: 0.7 });
  }

  // Niagara falls of sparks from the bridge deck between t0 and t1.
  waterfall({ t0, t1, gold = false, bright = 1 }, world) {
    const r = this.r;
    const B = SITE.bridge;
    const n = this.tier.gerbs;
    const batch = new StarBatch(n);
    const life = t1 - t0;
    const sparkLife = 5.4;
    const rate = Math.min(14, (this.tier.sparkK - 1) / (sparkLife * 1.45));
    for (let i = 0; i < n; i++) {
      const s = B.fall[0] + (B.fall[1] - B.fall[0]) * (i + r() * 0.8) / n;
      const p = world.bridgeAt(s, B.deckY - 4.6, -(B.width / 2 + 0.6));
      batch.push({
        p0: p, t0: t0 + r() * 0.8, v0: [0, 0, 0], c: 0, kg: 1, life, kind: K_GERB, colA: gold ? [1.2, 0.6, 0.2] : [1.3, 1.25, 1.15], glowR: 0.35, seed: r(), head: 0.7,
        tail: { kind: T_FALL, rate, life: sparkLife * (0.8 + r() * 0.3), eject: 2.4, inherit: 0, ks: 1.15, power: (gold ? 0.09 : 0.11) * 14 / rate * (0.25 + Math.pow(r(), 2) * 2.2) * Math.min(1.5, Math.max(0.6, bright)) },
      });
    }
    batch.commit(this.P);
    for (const s of [0.36, 0.5, 0.64]) {
      const p = world.bridgeAt(s, B.deckY - 22, -(B.width / 2));
      this.lights.steady({ t0, t1, pos: p, color: gold ? [1, 0.6, 0.25] : [1, 0.95, 0.85], power: 1.2e4, radius: 60, flicker: 0.2 });
    }
    // smoke rolling off the curtain
    const puffs = Math.round(life / 0.35 * this.tier.smokeScale);
    for (let i = 0; i < puffs; i++) {
      const s = B.fall[0] + (B.fall[1] - B.fall[0]) * r();
      const p = world.bridgeAt(s, B.deckY - 6 - r() * 30, -(B.width / 2 + 3));
      this.smoke.puff(p, t0 + r() * life, [(r() - 0.5), -1.5, (r() - 0.5)], 0.6, 3, 2.5, 30 + r() * 15, 9, [0.8, 0.8, 0.82]);
    }
    this.audio.waterfall(t0, t1, world.bridgeAt(0.5, B.deckY - 20, 0));
    this.waterfallFrom = t0;
    this.waterfallUntil = t1;
  }
}

function normalise(c) { const m = Math.max(...c); return c.map(v => v / m); }
