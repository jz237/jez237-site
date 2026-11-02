// The programme: about three minutes in acts, like a real harbour display,
// then a pause for the smoke to clear. Every programme is built from a fresh
// seed: the middle acts come in a new order and length, it has its own colour
// theme and weather, the waterfall moves between acts, and the overture and
// the finale each come in several versions (never the same finale twice in a
// row).
import { rng } from './physics.js?v=8';
import { SITE } from './site.js?v=8';
import { RARE, SHAPES } from './shells.js?v=8';

const NB = SITE.barges.length;

export const THEMES = [
  { name: 'Classic colour', colours: null },
  { name: 'Sunset gold', colours: ['gold', 'orange', 'yellow', 'red', 'pink'] },
  { name: 'Ocean blues', colours: ['blue', 'aqua', 'white', 'silver', 'purple'] },
  { name: 'Neon night', colours: ['pink', 'lemon', 'aqua', 'purple', 'green'] },
  { name: 'Red, white and blue', colours: ['red', 'white', 'blue'] },
  { name: 'Emerald and gold', colours: ['green', 'lemon', 'gold', 'white'] },
  { name: 'Silver and violet', colours: ['silver', 'white', 'purple', 'blue'] },
  { name: 'Candy', colours: ['pink', 'aqua', 'lemon', 'white', 'purple'] },
];
export const WEATHER = [
  { name: 'a clear, still night', clouds: 0.15, haze: 0.8e-4, wind: 1.0 },
  { name: 'a light breeze', clouds: 0.8, haze: 1.0e-4, wind: 2.6 },
  { name: 'low cloud', clouds: 1.35, haze: 1.2e-4, wind: 2.0 },
  { name: 'a hazy night', clouds: 0.5, haze: 1.7e-4, wind: 1.4 },
  { name: 'a stiff wind', clouds: 0.9, haze: 0.9e-4, wind: 5.5 },
];
export const FINALES = ['Barrage', 'Golden crown', 'Rainbow sweeps', 'Strobe storm', 'Tips and twinkles', 'Thunder and crackle', 'Willow curtain', 'Grand chrysanthemums'];

// Types that take a theme colour, and those that also take a second one.
const PLAIN = new Set(['willow', 'glitter', 'spider', 'salute', 'horsetail', 'kamuro', 'brocade', 'diadem', 'confetti', 'rings', 'snowfall', 'senrin', 'yonjushin', 'galaxy', 'brocadestrobe', 'crackwillow', 'palmcrackle', 'strobepistil']);
const SECOND = new Set(['pistil', 'saturn', 'multibreak', 'ghost', 'flower', 'diadem', 'doublepetal']);

export function buildProgram(seed, fw, world, audio, lastFinale = -1) {
  const r = rng(seed * 7919 + 13);
  const cues = [];
  const at = (t, fn) => cues.push({ t, fn });
  const theme = r.pick(THEMES), weather = r.pick(WEATHER);
  const pal = theme.colours;
  const tc = () => (pal ? r.pick(pal) : undefined);
  const shell = (t, type, inches, o = {}) => {
    let color = o.color, color2 = o.color2;
    if (pal && color === undefined && !PLAIN.has(type)) color = r.pick(pal);
    if (pal && color2 === undefined) {
      if (SECOND.has(type)) { color2 = r.pick(pal); if (color2 === color) color2 = r.pick(pal); }
      else if (type === 'peony' || type === 'ring') color2 = r.chance(0.35) ? r.pick(pal) : 'none';
    }
    at(t, (tt) => fw.launchShell({ t: tt, type, inches, ...o, color, color2, palette: pal || undefined }));
  };
  const fan = (t, o) => at(t, (tt) => fw.fan({ t: tt, ...o, color: o.color ?? (pal && r.chance(0.5) ? r.pick(pal) : o.kind) }));
  const mine = (t, b) => at(t, (tt) => fw.mine({ t: tt, barge: b, color: tc() }));
  const crowd = (t, k, g) => at(t, (tt) => audio.crowd(k, tt, g));
  const anyBarge = () => r.int(0, NB - 1);
  const sweep = (t, type, inches, dir, gap = 0.16, o = {}) => {
    const c = o.color ?? tc();
    for (let i = 0; i < NB; i++) shell(t + i * gap, type, inches, { ...o, barge: dir > 0 ? i : NB - 1 - i, color: c, rise: o.rise || 'none' });
  };

  // ---------------------------------------------------------------- acts
  const durs = { Colour: r.range(30, 42), Gold: r.range(30, 40), Wonders: r.range(28, 38), Showpieces: r.range(22, 30) };
  const middle = ['Colour', 'Gold', 'Wonders', 'Showpieces'];
  for (let i = middle.length - 1; i > 0; i--) { const j = r.int(0, i); [middle[i], middle[j]] = [middle[j], middle[i]]; }
  // the big single shells come once the show has built up
  if (middle[0] === 'Showpieces') { const j = r.int(2, 3); [middle[0], middle[j]] = [middle[j], middle[0]]; }
  const fallsIn = r.pick(['Gold', 'Gold', 'Gold', 'Wonders', 'Colour', 'Finale']);
  let finale;
  do { finale = r.int(0, FINALES.length - 1); } while (finale === lastFinale);
  const overture = r.int(0, 3);
  // about one programme in five closes its showpieces with a rare shell
  const rare = r.chance(0.2) ? r.pick(RARE) : null;
  if (rare) durs.Showpieces += 6;
  const acts = [];
  let t = 0;
  const openDur = r.range(12, 16);
  acts.push({ at: 0, key: 'Overture', name: 'Overture' });
  t = openDur;
  for (const key of middle) {
    const falls = fallsIn === key;
    acts.push({ at: t, key, name: key + (falls ? ' and the falls' : ''), dur: durs[key], falls });
    t += durs[key];
  }
  const finaleDur = r.range(22, 30);
  acts.push({ at: t, key: 'Finale', name: 'Finale' + (fallsIn === 'Finale' ? ' at the falls' : ''), dur: finaleDur, falls: fallsIn === 'Finale' });
  const finaleAt = t;
  const finaleEnd = t + finaleDur;

  const waterfall = (t0, dur) => {
    const gold = pal ? pal.includes('gold') || r.chance(0.2) : r.chance(0.3);
    at(t0, (tt) => fw.waterfall({ t0: tt, t1: tt + dur, gold }, world));
    crowd(t0 + 3, 'wow', 0.7);
  };

  // ---------------------------------------------------------------- overture
  const o0 = 0;
  if (overture === 0) { // salutes and silver fans
    fan(o0 + 0.4, { barge: 2, n: 9, spread: 0.62, kind: 'silver' });
    fan(o0 + 1.1, { barge: 0, n: 5, spread: 0.35, tilt: 0.25, kind: 'silver' });
    fan(o0 + 1.1, { barge: 4, n: 5, spread: 0.35, tilt: -0.25, kind: 'silver' });
    shell(o0 + 1.4, 'salute', 4, { barge: 0, rise: 'silver' });
    shell(o0 + 2.1, 'salute', 4, { barge: 4, rise: 'silver' });
    shell(o0 + 2.9, 'salute', 5, { barge: 2, rise: 'silver' });
    shell(o0 + 4.2, 'chrysanthemum', 8, { barge: 2, rise: 'tail' });
    for (let i = 0; i < 6; i++) fan(o0 + 6 + i * 0.55, { barge: i % 2 ? 1 : 3, n: 5, spread: 0.4, tilt: (i % 2 ? 1 : -1) * 0.3, kind: 'gold' });
    shell(o0 + 7.5, 'strobe', 5, { barge: 0 });
    shell(o0 + 7.6, 'strobe', 5, { barge: 4 });
    shell(o0 + 10, r.pick(['kamuro', 'diadem']), 7, { barge: 2, rise: 'glitter' });
  } else if (overture === 1) { // one grand opening shell
    shell(o0 + 0.8, r.pick(['kamuro', 'diadem', 'brocade', 'ghost']), 12, { barge: 2, rise: 'whistle' });
    fan(o0 + 0.4, { barge: 0, n: 7, spread: 0.4, tilt: 0.2, kind: 'silver' });
    fan(o0 + 0.4, { barge: 4, n: 7, spread: 0.4, tilt: -0.2, kind: 'silver' });
    crowd(o0 + 7.6, 'ooh', 1.1);
    for (let i = 0; i < NB; i++) mine(o0 + 8.5 + i * 0.3, i);
    shell(o0 + 9.5, 'peony', 8, { barge: 1 });
    shell(o0 + 9.7, 'peony', 8, { barge: 3 });
  } else if (overture === 2) { // ripples across the line
    sweep(o0 + 0.5, 'peony', 3, 1, 0.14);
    sweep(o0 + 1.6, 'peony', 3, -1, 0.14);
    sweep(o0 + 3.2, r.pick(['chrysanthemum', 'glittertips']), 5, 1, 0.22);
    shell(o0 + 6, 'pistil', 8, { barge: 2, rise: 'tail' });
    shell(o0 + 8.5, 'crackle', 6, { barge: 0 });
    shell(o0 + 8.6, 'crackle', 6, { barge: 4 });
  } else { // glitter and crackle
    for (let i = 0; i < 3; i++) shell(o0 + 0.6 + i * 0.5, 'crackle', 5, { barge: i * 2 });
    fan(o0 + 2.5, { barge: 2, n: 11, spread: 0.7, kind: 'gold' });
    shell(o0 + 3.5, 'strobe', 6, { barge: 1 });
    shell(o0 + 3.7, 'strobe', 6, { barge: 3 });
    shell(o0 + 6.5, r.pick(['leaves', 'snowfall', 'glitter']), 8, { barge: 2, rise: 'glitter' });
    shell(o0 + 9, 'glittertips', 6, { barge: anyBarge() });
  }

  // ---------------------------------------------------------------- middle
  const colour = (t0, dur) => {
    const pool = ['peony', 'chrysanthemum', 'pistil', 'tipped', 'dahlia', 'ring', 'confetti', 'ghost', 'glittertips', 'pistil', 'doublepetal', 'tipped', 'strobepistil', 'chrysanthemum'];
    const tempo = r.range(1.1, 1.9);
    let x = t0 + 0.5;
    while (x < t0 + dur - 6) {
      const b = anyBarge();
      const inch = r.pick([3, 4, 4, 5, 5, 6, 6, 7, 8]);
      shell(x, r.pick(pool), inch, { barge: b });
      if (r.chance(0.3)) shell(x + 0.12, r.pick(pool), inch, { barge: NB - 1 - b });
      if (r.chance(0.16)) fan(x + 0.5, { barge: anyBarge(), n: r.int(5, 9), spread: r.range(0.3, 0.6), kind: r.pick(['gold', 'silver']) });
      if (r.chance(0.14)) sweep(x, r.pick(['peony', 'chrysanthemum', 'tipped']), 3, r.chance(0.5) ? 1 : -1, 0.24);
      x += tempo * r.range(0.75, 1.3);
    }
    shell(t0 + dur - 6, r.pick(['pistil', 'ghost', 'doublepetal', 'tipped']), 10, { barge: 2, rise: 'tail' });
    crowd(t0 + dur - 6 + 6.2, 'ooh', 1);
  };
  const gold = (t0, dur) => {
    const pool = ['willow', 'kamuro', 'palm', 'horsetail', 'glitter', 'crackwillow', 'brocade', 'kamuro', 'leaves', 'diadem', 'snowfall', 'brocadestrobe', 'palmcrackle'];
    let x = t0 + 1;
    while (x < t0 + dur - 6) {
      shell(x, r.pick(pool), r.pick([5, 6, 7, 8]), { barge: anyBarge(), rise: r.pick(['tail', 'glitter', 'none']) });
      if (r.chance(0.25)) mine(x + 0.6, anyBarge());
      x += r.range(1.9, 3.0);
    }
    shell(t0 + dur - 6, r.pick(['kamuro', 'diadem', 'willow', 'crackwillow', 'brocadestrobe']), 12, { barge: 2, rise: 'glitter' });
    crowd(t0 + dur - 6 + 6.8, 'ooh', 1.1);
  };
  const wonders = (t0, dur) => {
    const pool = ['crossette', 'strobe', 'crackle', 'saturn', 'spider', 'multibreak', 'ghost', 'glittertips', 'tipped', 'brocadestrobe', 'crackwillow', 'palmcrackle', 'doublepetal', 'strobepistil', 'ring'];
    // an outline shape now and then, never more than two in the act
    let shapesLeft = r.int(0, 2);
    let x = t0 + 0.5;
    while (x < t0 + dur - 2) {
      const shape = shapesLeft > 0 && r.chance(0.12);
      if (shape) shapesLeft--;
      shell(x, shape ? r.pick(SHAPES) : r.pick(pool), r.pick([5, 6, 6, 7, 8]), { barge: anyBarge() });
      if (r.chance(0.08)) crowd(x + 5.6, r.chance(0.5) ? 'ooh' : 'wow', 0.6);
      x += r.range(1.6, 2.6);
    }
  };
  const showpieces = (t0, dur) => {
    const pool = ['pistil', 'kamuro', 'tipped', 'crackwillow', 'brocadestrobe', 'multibreak', 'diadem', 'ghost', 'doublepetal', 'dahlia', 'strobepistil', 'palmcrackle', 'chrysanthemum'];
    for (let i = pool.length - 1; i > 0; i--) { const j = r.int(0, i); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    // a rare shell closes the act on its own, with the sky clear around it
    const end = rare ? dur - 18.5 : dur - 3;
    const k = rare ? Math.floor(end / 5.2) + 1 : Math.max(3, Math.floor((dur - 2) / 5.2));
    for (let i = 0; i < k; i++) {
      const x = t0 + 0.5 + i * end / (rare ? Math.max(1, k - 1) : k);
      shell(x, pool[i], r.pick([10, 12]), { barge: 1 + (i % 3), rise: r.pick(['tail', 'glitter', 'whistle']) });
      if ((!rare && i === k - 1) || r.chance(0.3)) crowd(x + 6.6, i % 2 ? 'wow' : 'ooh', 0.9);
    }
    if (rare) {
      // broken lower than a plain 12-inch so all of it stays in view
      const x = t0 + dur - 7;
      shell(x, rare, 12, { barge: 2, rise: 'glitter', target: [SITE.barges[2].x + r.range(-20, 20), 260, SITE.barges[2].z] });
      crowd(x + 6.2, 'wow', 0.9);
    }
  };
  const builders = { Colour: colour, Gold: gold, Wonders: wonders, Showpieces: showpieces };
  for (const a of acts.slice(1, -1)) {
    builders[a.key](a.at, a.dur);
    if (a.falls) waterfall(a.at, Math.min(a.dur - 1, 34));
  }

  // ---------------------------------------------------------------- finale
  const f0 = finaleAt, fd = finaleDur, fEnd = f0 + fd;
  if (fallsIn === 'Finale') waterfall(f0, fd + 4);
  const rapid = (types, sizes, gap0, gap1, until, extra) => {
    let x = f0;
    while (x < until) {
      const k = (x - f0) / (until - f0);
      shell(x, r.pick(types), r.pick(sizes), { barge: anyBarge(), rise: r.pick(['tail', 'none', 'silver']) });
      if (extra) extra(x);
      x += gap0 + (gap1 - gap0) * k + r.range(0, 0.1);
    }
  };
  const crowns = (x, type = 'kamuro', inches = 10) => { for (let b = 0; b < NB; b++) shell(x + b * 0.05, type, inches, { barge: b, rise: 'glitter' }); };
  const salutes = (x, n = 9) => { for (let i = 0; i < n; i++) shell(x + i * 0.16, 'salute', 5, { barge: i % NB, rise: 'silver' }); };
  switch (finale) {
    case 0: // barrage
      rapid(['peony', 'chrysanthemum', 'crackle', 'brocade', 'pistil', 'kamuro', 'strobe', 'doublepetal', 'salute', 'tipped'], [4, 5, 6, 6, 8], 0.62, 0.16, fEnd - 4,
        (x) => { if (r.chance(0.35)) fan(x + 0.1, { barge: anyBarge(), n: 7, spread: 0.55, kind: r.pick(['gold', 'silver']) }); });
      salutes(fEnd - 4);
      crowns(fEnd - 2.4);
      for (let i = 0; i < 6; i++) shell(fEnd - 1.5 + i * 0.2, 'crackle', 6, { barge: i % NB });
      break;
    case 1: // golden crown
      rapid(['brocade', 'kamuro', 'willow', 'glitter', 'diadem', 'kamuro'], [5, 6, 8], 0.7, 0.22, fEnd - 4,
        (x) => { if (r.chance(0.25)) mine(x + 0.2, anyBarge()); });
      salutes(fEnd - 4, 5);
      crowns(fEnd - 2.6, 'kamuro', 12);
      shell(fEnd - 2.2, 'diadem', 12, { barge: 2, rise: 'glitter' });
      break;
    case 2: { // rainbow sweeps
      let x = f0, dir = 1;
      while (x < fEnd - 6) {
        sweep(x, r.pick(['peony', 'chrysanthemum', 'ghost', 'tipped', 'doublepetal']), r.pick([4, 5, 6]), dir, 0.18);
        dir = -dir;
        x += r.range(1.1, 1.8) * (1 - 0.5 * (x - f0) / fd);
      }
      for (let i = 0; i < 8; i++) shell(fEnd - 6 + i * 0.3, 'crackle', 6, { barge: i % NB });
      salutes(fEnd - 3.5);
      shell(fEnd - 2.6, r.pick(['confetti', 'multibreak']), 12, { barge: 2, rise: 'whistle' });
      break;
    }
    case 3: // strobe storm
      rapid(['strobe', 'crackle', 'glitter', 'strobe', 'glittertips', 'snowfall'], [5, 6, 7], 0.6, 0.2, fEnd - 4,
        (x) => { if (r.chance(0.3)) fan(x + 0.1, { barge: anyBarge(), n: 9, spread: 0.6, kind: 'silver' }); });
      salutes(fEnd - 4);
      crowns(fEnd - 2.4, 'brocade', 10);
      break;
    case 4: { // tips and twinkles: layered shells in waves, then a burst of everything
      let x = f0;
      while (x < f0 + fd * 0.55) { shell(x, r.pick(['tipped', 'doublepetal', 'strobepistil', 'brocadestrobe', 'palmcrackle']), r.pick([6, 7, 8]), { barge: anyBarge() }); x += r.range(0.7, 1.2); }
      crowd(x + 3, 'wow', 1);
      while (x < fEnd - 4) { shell(x, r.pick(['tipped', 'chrysanthemum', 'confetti', 'crackle', 'doublepetal']), r.pick([5, 6, 8]), { barge: anyBarge() }); x += r.range(0.18, 0.35); }
      salutes(fEnd - 4);
      crowns(fEnd - 2.4, 'brocadestrobe', 10);
      break;
    }
    case 5: // thunder and crackle
      rapid(['crackle', 'salute', 'crackle', 'crossette', 'spider', 'salute'], [5, 6, 8], 0.55, 0.15, fEnd - 4,
        (x) => { if (r.chance(0.3)) mine(x, anyBarge()); });
      salutes(fEnd - 4, 12);
      for (let i = 0; i < 10; i++) shell(fEnd - 2.5 + i * 0.12, 'crackle', 8, { barge: i % NB });
      break;
    case 6: { // willow curtain: slow gold hanging over the water, then a wall of crowns
      let x = f0;
      while (x < fEnd - 7) { for (let b = 0; b < NB; b += 2) shell(x + b * 0.1, r.pick(['willow', 'willow', 'leaves']), 8, { barge: b, rise: 'glitter' }); x += r.range(2.2, 3.2); }
      for (let i = 0; i < 6; i++) fan(fEnd - 7 + i * 0.4, { barge: i % NB, n: 9, spread: 0.6, kind: 'gold' });
      salutes(fEnd - 4.5, 6);
      crowns(fEnd - 3, 'willow', 12);
      break;
    }
    default: // grand chrysanthemums: big colour shells in waves
      rapid(['chrysanthemum', 'pistil', 'chrysanthemum', 'dahlia', 'ghost'], [8, 10], 1.1, 0.35, fEnd - 4,
        (x) => { if (r.chance(0.3)) shell(x + 0.15, r.pick(['peony', 'tipped']), 5, { barge: anyBarge() }); });
      salutes(fEnd - 4);
      crowns(fEnd - 2.4, 'chrysanthemum', 12);
  }
  crowd(fEnd + 5, 'cheer', 1);

  return { cues, acts, finaleAt, finaleEnd, length: finaleEnd + 16, theme, weather, finale, overture, rare };
}

export class Show {
  constructor(fw, world, audio) {
    this.fw = fw; this.world = world; this.audio = audio;
    this.seed = 1;
    this.start = 0;
    this.on = true;
    this.pending = [];
    this.number = 0;
    this.lastFinale = -1;
    this.onProgram = null;
  }

  begin(t, seed = this.seed, same = false) {
    this.seed = seed;
    this.start = t;
    this.fw.seed(seed);
    const p = buildProgram(seed, this.fw, this.world, this.audio, same ? this.prevFinale : this.lastFinale);
    if (!same) { this.number++; this.prevFinale = this.lastFinale; this.lastFinale = p.finale; }
    Object.assign(this, { acts: p.acts, finaleAt: p.finaleAt, finaleEnd: p.finaleEnd, length: p.length, theme: p.theme, weather: p.weather, finale: p.finale, overture: p.overture });
    this.pending = p.cues.map(c => ({ t: c.t + t, fn: c.fn })).sort((a, b) => a.t - b.t);
    if (!same && this.onProgram) this.onProgram(this);
  }

  current(t) {
    const local = t - this.start;
    if (local > this.finaleEnd + 2) return { name: 'Intermission', key: 'Intermission' };
    let a = this.acts[0];
    for (const x of this.acts) if (local >= x.at) a = x;
    return a;
  }
  act(t) { return this.current(t).name; }
  actKey(t) { return this.current(t).key; }

  update(t) {
    if (!this.on) return;
    if (t - this.start > this.length) this.begin(t, this.seed + 1);
    while (this.pending.length && this.pending[0].t <= t) {
      const c = this.pending.shift();
      c.fn(c.t);
    }
  }

  setOn(on, t) {
    this.on = on;
    if (on) this.begin(t, this.seed + 1);
    else this.pending.length = 0;
  }

  finale(t) {
    // jump straight to this programme's finale
    this.begin(t - this.finaleAt + 0.5, this.seed, true);
    this.pending = this.pending.filter(c => c.t >= t);
  }
}
