// The programme: about three minutes in acts, like a real harbour display,
// then a pause for the smoke to clear and a new programme with a new seed.
import { rng } from './physics.js?v=3';
import { SITE } from './site.js?v=3';

export const ACTS = [
  { at: 0, name: 'Overture' },
  { at: 14, name: 'Colour' },
  { at: 52, name: 'Gold and the falls' },
  { at: 90, name: 'Wonders' },
  { at: 124, name: 'Showpieces' },
  { at: 150, name: 'Finale' },
];
export const PROGRAM_LENGTH = 196;

const NB = SITE.barges.length;

export function buildProgram(seed, fw, world, audio) {
  const r = rng(seed * 7919 + 13);
  const cues = [];
  const at = (t, fn) => cues.push({ t, fn });
  const shell = (t, type, inches, o = {}) => at(t, (tt) => fw.launchShell({ t: tt, type, inches, ...o }));
  const fan = (t, o) => at(t, (tt) => fw.fan({ t: tt, ...o }));
  const crowd = (t, k, g) => at(t, (tt) => audio.crowd(k, tt, g));
  const colours = ['peony', 'peony', 'chrysanthemum', 'pistil', 'chrysanthemum', 'peony', 'dahlia', 'ring', 'pistil'];

  // Overture: silver comet fans, salutes left-right-centre, a titanium crown
  fan(0.4, { barge: 2, n: 9, spread: 0.62, kind: 'silver' });
  fan(1.1, { barge: 0, n: 5, spread: 0.35, tilt: 0.25, kind: 'silver' });
  fan(1.1, { barge: 4, n: 5, spread: 0.35, tilt: -0.25, kind: 'silver' });
  shell(1.4, 'salute', 4, { barge: 0, rise: 'silver' });
  shell(2.1, 'salute', 4, { barge: 4, rise: 'silver' });
  shell(2.9, 'salute', 5, { barge: 2, rise: 'silver' });
  shell(4.2, 'chrysanthemum', 8, { barge: 2, color: 'white', rise: 'tail' });
  for (let i = 0; i < 6; i++) fan(6 + i * 0.55, { barge: i % 2 ? 1 : 3, n: 5, spread: 0.4, tilt: (i % 2 ? 1 : -1) * 0.3, kind: 'gold' });
  shell(7.5, 'strobe', 5, { barge: 0 });
  shell(7.6, 'strobe', 5, { barge: 4 });
  shell(10.2, 'kamuro', 7, { barge: 2, rise: 'glitter' });

  // Colour: single and paired shells across the line
  let t = 14;
  while (t < 50) {
    const b = r.int(0, NB - 1);
    const inch = r.pick([3, 4, 4, 5, 5, 6, 6, 7, 8]);
    shell(t, r.pick(colours), inch, { barge: b });
    if (r.chance(0.3)) shell(t + 0.12, r.pick(colours), inch, { barge: NB - 1 - b });
    if (r.chance(0.18)) fan(t + 0.5, { barge: r.int(0, NB - 1), n: r.int(5, 9), spread: r.range(0.3, 0.6), kind: r.pick(['gold', 'silver']) });
    if (r.chance(0.12)) for (let k = 0; k < 5; k++) shell(t + k * 0.28, 'peony', 3, { barge: k % NB, rise: 'none' });
    t += r.range(1.2, 2.3);
  }
  shell(46, 'pistil', 10, { barge: 2, rise: 'tail' });
  crowd(46 + 6.2, 'ooh', 1);

  // Gold: willows, kamuro, palms, horsetails, glitter; the bridge waterfall
  at(52, (tt) => fw.waterfall({ t0: tt, t1: tt + 34, gold: r.chance(0.3) }, world));
  crowd(55, 'wow', 0.8);
  t = 53;
  while (t < 88) {
    const type = r.pick(['willow', 'kamuro', 'palm', 'horsetail', 'glitter', 'willow', 'brocade', 'kamuro']);
    shell(t, type, r.pick([5, 6, 7, 8]), { barge: r.int(0, NB - 1), rise: r.pick(['tail', 'glitter', 'none']) });
    if (r.chance(0.25)) at(t + 0.6, (tt) => fw.mine({ t: tt, barge: r.int(0, NB - 1) }));
    t += r.range(1.9, 3.0);
  }
  shell(84, 'kamuro', 12, { barge: 2, rise: 'glitter' });
  crowd(84 + 6.8, 'ooh', 1.1);

  // Wonders: crossettes, strobes, crackle, rings, saturns and pattern shells
  t = 90;
  const wonders = ['crossette', 'strobe', 'crackle', 'saturn', 'ring', 'heart', 'smiley', 'starshape', 'spider', 'multibreak', 'crossette', 'crackle', 'glitter'];
  while (t < 122) {
    const type = r.pick(wonders);
    shell(t, type, r.pick([5, 6, 6, 7, 8]), { barge: r.int(0, NB - 1) });
    if (type === 'heart' || type === 'smiley') crowd(t + 5.6, r.chance(0.5) ? 'ooh' : 'wow', 0.7);
    t += r.range(1.6, 2.6);
  }

  // Showpieces: big shells alone, with room to breathe
  const pieces = r.chance(0.5) ? ['pistil', 'kamuro', 'chrysanthemum', 'willow', 'multibreak'] : ['chrysanthemum', 'willow', 'pistil', 'brocade', 'multibreak'];
  pieces.forEach((type, i) => {
    const tt = 124 + i * 5.2;
    shell(tt, type, i === pieces.length - 1 ? 10 : r.pick([10, 12]), { barge: 2 + (i % 3) - 1, rise: r.pick(['tail', 'glitter', 'whistle']) });
    crowd(tt + 6.6, i % 2 ? 'wow' : 'ooh', 1.1);
  });

  // Finale: an accelerating barrage, salutes, crackle, a last golden crown
  t = 150;
  while (t < 171) {
    const k = (t - 150) / 21;
    const type = r.pick(['peony', 'chrysanthemum', 'crackle', 'brocade', 'pistil', 'kamuro', 'strobe', 'peony', 'salute']);
    shell(t, type, r.pick([4, 5, 6, 6, 8]), { barge: r.int(0, NB - 1), rise: r.pick(['tail', 'none', 'silver']) });
    if (r.chance(0.35)) fan(t + 0.1, { barge: r.int(0, NB - 1), n: 7, spread: 0.55, kind: r.pick(['gold', 'silver']) });
    t += 0.62 - 0.46 * k + r.range(0, 0.12);
  }
  for (let i = 0; i < 9; i++) shell(171 + i * 0.16, 'salute', 5, { barge: i % NB, rise: 'silver' });
  for (let b = 0; b < NB; b++) shell(172.6 + b * 0.05, 'kamuro', 10, { barge: b, rise: 'glitter' });
  for (let i = 0; i < 6; i++) shell(173.5 + i * 0.2, 'crackle', 6, { barge: i % NB });
  crowd(180, 'cheer', 1.2);
  return cues;
}

export class Show {
  constructor(fw, world, audio) {
    this.fw = fw; this.world = world; this.audio = audio;
    this.seed = 1;
    this.start = 0;
    this.on = true;
    this.pending = [];
  }

  begin(t, seed = this.seed) {
    this.seed = seed;
    this.start = t;
    this.fw.seed(seed);
    this.pending = buildProgram(seed, this.fw, this.world, this.audio).map(c => ({ t: c.t + t, fn: c.fn })).sort((a, b) => a.t - b.t);
  }

  act(t) {
    const local = t - this.start;
    let a = ACTS[0];
    for (const x of ACTS) if (local >= x.at) a = x;
    return local > 180 ? 'Intermission' : a.name;
  }

  update(t) {
    if (!this.on) return;
    if (t - this.start > PROGRAM_LENGTH) this.begin(t, this.seed + 1);
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
    // jump straight to the last act
    this.begin(t - 149.5, this.seed);
    this.pending = this.pending.filter(c => c.t >= t);
  }
}
