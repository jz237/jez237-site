// Workshop: pick any shell or ground effect, tap where it should break, and
// tune it. Every control has a range a real product could have, and the
// break height is kept where that calibre can actually get to with its stars
// clear of the water, so nothing can be set up to look wrong.
import * as THREE from 'three';
import { SITE } from './site.js';
import { SHELL_NAMES } from './shells.js';
import { aimShell } from './physics.js';

const SWATCH = {
  red: '#ff3b2b', orange: '#ff8a22', yellow: '#ffd23f', lemon: '#e0ff5c', green: '#56ff4a', aqua: '#2ee8d8',
  blue: '#3f6dff', purple: '#a94dff', pink: '#ff62aa', white: '#fff7ea', silver: '#d9e4ff', gold: '#ffad3c',
};
const NAMES = {
  red: 'Strontium red', orange: 'Calcium orange', yellow: 'Sodium yellow', lemon: 'Lemon', green: 'Barium green', aqua: 'Aqua',
  blue: 'Copper blue', purple: 'Violet', pink: 'Pink', white: 'Magnalium white', silver: 'Titanium silver', gold: 'Charcoal gold',
};
const ALL = ['red', 'orange', 'yellow', 'lemon', 'green', 'aqua', 'blue', 'purple', 'pink', 'white', 'silver'];

// What each type lets you change. colours: allowed first colours (null = fixed);
// second: [label, options, allowNone]; tails: whether tail length applies.
// fly: the shell's flight constants (bloom rate q, radius fraction rf, fall
// drag kg, star burn life(inches), tail spark life tl) so the workshop can
// work out how low its stars and sparks will reach.
const fly = (q, rf, kg, life, tl = 0) => ({ q, rf, kg, life, tl });
const TYPES = {
  peony: { colours: ALL, second: ['Changes to', ALL, true], tails: false, fly: fly(5, 1, 0.85, (i) => 1.9 + i * 0.08) },
  chrysanthemum: { colours: ALL, second: ['Tails', ['gold', 'silver'], false], tails: true, fly: fly(5, 1, 0.85, (i) => 1.8 + i * 0.07, 1.3) },
  pistil: { colours: ALL, second: ['Pistil (centre)', ALL, false], tails: false, fly: fly(5, 1, 0.85, (i) => 2.0 + i * 0.08) },
  dahlia: { colours: ALL, tails: true, fly: fly(3.2, 1, 0.7, (i) => 2.9 + i * 0.08, 0.6) },
  willow: { colours: null, tails: true, fly: fly(3.2, 0.8, 0.95, (i) => 5.2 + i * 0.15, 4.5) },
  kamuro: { colours: ['gold', 'silver'], tails: true, fly: fly(4.2, 1, 1.05, (i) => 4.0 + i * 0.12, 3.8) },
  brocade: { colours: null, second: ['Tips', ALL, true], tails: true, fly: fly(6, 1, 1.0, (i) => 2.8 + i * 0.08, 2.0) },
  palm: { colours: ['gold', ...ALL], tails: true, fly: fly(4, 1, 0.55, () => 2.6, 1.5) },
  horsetail: { colours: ['gold', 'silver'], tails: true, fly: fly(2.2, 0.35, 0.9, () => 3.6, 2.6) },
  ring: { colours: ALL, second: ['Inner ring', ALL, true], tails: false, fly: fly(5, 1, 0.85, () => 2.1) },
  saturn: { colours: ALL, second: ['Ring', ALL, false], tails: false, fly: fly(5, 1, 0.85, () => 2.2) },
  crossette: { colours: ['gold', ...ALL], tails: true, fly: fly(3, 1.25, 0.9, () => 2.4, 0.8) },
  strobe: { colours: ['white', ...ALL.filter(c => c !== 'white')], tails: false, fly: fly(4, 1, 1.1, () => 3.2) },
  crackle: { colours: ALL, tails: true, fly: fly(4, 0.95, 0.85, () => 2.0, 0.3) },
  glitter: { colours: null, tails: true, fly: fly(4.5, 1, 1.3, () => 2.6, 2.2) },
  spider: { colours: null, tails: true, fly: fly(9, 1.15, 0.7, () => 1.5, 1.6) },
  salute: { colours: null, tails: true, fly: fly(10, 0.25, 0.85, () => 0.5, 0.3) },
  multibreak: { colours: ALL, second: ['Satellites', ALL, false], tails: false, fly: fly(5, 1.5, 0.85, () => 3.4) },
  heart: { colours: ALL, tails: false, fly: fly(4.5, 1, 0.85, () => 2.2) },
  smiley: { colours: ALL, tails: false, fly: fly(4.5, 1, 0.85, () => 2.2) },
  starshape: { colours: ALL, tails: false, fly: fly(4.5, 1, 0.85, () => 2.2) },
  fan: { colours: ['gold', 'silver', ...ALL.filter(c => c !== 'silver')], tails: true, ground: true, label: 'Comet fan' },
  mine: { colours: ['gold', ...ALL], tails: true, ground: true, label: 'Mine' },
  waterfall: { colours: ['silver', 'gold'], tails: false, ground: true, label: 'Waterfall' },
};
const SHELL_ORDER = ['peony', 'chrysanthemum', 'pistil', 'dahlia', 'willow', 'kamuro', 'brocade', 'palm', 'horsetail', 'ring', 'saturn', 'crossette', 'strobe', 'crackle', 'glitter', 'spider', 'salute', 'multibreak', 'heart', 'smiley', 'starshape'];
const RISES = [['tail', 'Gold tail'], ['silver', 'Silver tail'], ['glitter', 'Glitter'], ['whistle', 'Whistle'], ['none', 'Dark']];

export const DEFAULTS = Object.freeze({
  type: 'peony', inches: 6, height: 1, spread: 1, stars: 1, burn: 1, bright: 1, tail: 1, hang: 1, wind: 2.5,
  colour: 'auto', colour2: 'auto', rise: 'tail',
});
const pct = (v) => `${Math.round(v * 100)}%`;
const SLIDERS = [
  { key: 'inches', label: 'Shell size', min: 3, max: 12, step: 1 },
  { key: 'height', label: 'Break height', min: 0.75, max: 1.3, step: 0.01 },
  { key: 'spread', label: 'Burst size', min: 0.7, max: 1.3, step: 0.01 },
  { key: 'stars', label: 'Stars', min: 0.5, max: 1.6, step: 0.01 },
  { key: 'burn', label: 'Burn time', min: 0.7, max: 1.4, step: 0.01 },
  { key: 'bright', label: 'Brightness', min: 0.6, max: 1.5, step: 0.01 },
  { key: 'tail', label: 'Tail length', min: 0.6, max: 1.5, step: 0.01 },
  { key: 'hang', label: 'Hang time', min: 0.75, max: 1.4, step: 0.01 },
  { key: 'wind', label: 'Wind', min: 0, max: 9, step: 0.1 },
];
const STORE = 'harbour.workshop.v1';

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

export class Workshop {
  constructor({ fw, world, smoke, rig, camera, getTime, onToggle }) {
    Object.assign(this, { fw, world, smoke, rig, camera, getTime, onToggle });
    this.on = false;
    this.s = { ...DEFAULTS };
    try { Object.assign(this.s, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) { /* storage blocked */ }
    this.sanitise();
    this.target = { x: SITE.center[0], z: SITE.center[2] };
    this.repeat = false;
    this.nextFire = 0;
    this.last = null;
    this.build();
    this.marker = el('div', 'target hide');
    document.body.appendChild(this.marker);
    this._v = new THREE.Vector3();
  }

  sanitise() {
    const s = this.s;
    s.burn = Number.isFinite(Number(s.burn)) ? Number(s.burn) : 1;
    for (const k of SLIDERS) {
      const v = Number(s[k.key]);
      s[k.key] = Number.isFinite(v) ? Math.min(k.max, Math.max(k.min, v)) : DEFAULTS[k.key];
    }
    s.inches = Math.round(s.inches);
    if (!TYPES[s.type]) s.type = DEFAULTS.type;
    const info = TYPES[s.type];
    if (s.colour !== 'auto' && !(info.colours || []).includes(s.colour)) s.colour = 'auto';
    if (!info.second || (s.colour2 !== 'auto' && s.colour2 !== 'none' && !info.second[1].includes(s.colour2)) || (s.colour2 === 'none' && !info.second[2])) s.colour2 = 'auto';
    if (!RISES.some(r => r[0] === s.rise)) s.rise = DEFAULTS.rise;
    // a combination that would still reach the water at the highest break
    // gives up burn time first, then hang
    for (let i = 0; i < 40 && this.reach() + 35 > 470; i++) {
      if (s.burn > 0.7) s.burn = Math.max(0.7, s.burn - 0.02);
      else if (s.tail > 0.6) s.tail = Math.max(0.6, s.tail - 0.02);
      else break;
    }
  }

  save() { try { localStorage.setItem(STORE, JSON.stringify(this.s)); } catch (e) { /* storage blocked */ } }

  // ------------------------------------------------------------ geometry
  radius() { return 11 * this.s.inches * this.s.spread; }
  // How far below the break the lowest star or spark gets: a downward star
  // keeps spreading outward (ln law) and falls toward its terminal speed for
  // its whole burn, then its last sparks drift a little lower still.
  reach() {
    const s = this.s, f = TYPES[s.type].fly;
    if (!f) return 0;
    const R = this.radius() * f.rf;
    const T = f.life(s.inches) * s.burn;
    const radial = R * Math.log(1 + f.q * T) / Math.log(1 + 2 * f.q);
    const kg = f.kg * s.hang;
    const fall = 9.81 / kg * Math.max(0, T - (1 - Math.exp(-kg * T)) / kg);
    const sparks = f.tl * s.tail * 2.6;
    return radial + fall + sparks;
  }
  // Break height the chosen calibre can reach, kept high enough that its
  // stars and tails burn out well above the water.
  altRange() {
    const s = this.s;
    const nominal = 32 * s.inches;
    const lo = Math.min(470, Math.max(nominal * 0.75, this.reach() + 35, 70));
    const hi = Math.max(lo, Math.min(470, nominal * 1.3));
    return [lo, hi, nominal];
  }
  altitude() {
    const [lo, hi, nominal] = this.altRange();
    return Math.min(hi, Math.max(lo, nominal * this.s.height));
  }
  targetPoint() {
    const info = TYPES[this.s.type];
    if (info.ground) {
      if (this.s.type === 'waterfall') return this.world.bridgeAt(0.5, SITE.bridge.deckY, -(SITE.bridge.width / 2));
      const b = SITE.barges[this.fw.nearestBarge(this.target.x)];
      return [b.x, 4, b.z];
    }
    return [this.target.x, this.altitude(), this.target.z];
  }

  // ------------------------------------------------------------ firing
  // Tap: set the spot (and the height, within the shell's range), then fire.
  tap(hit) {
    if (!hit) return;
    this.target.x = Math.max(-520, Math.min(420, hit[0]));
    this.target.z = Math.max(-820, Math.min(-580, hit[2]));
    if (!TYPES[this.s.type].ground) {
      const [lo, hi, nominal] = this.altRange();
      const want = Math.min(hi, Math.max(lo, hit[1]));
      this.s.height = Math.min(1.3, Math.max(0.75, want / nominal));
      this.syncSliders();
      this.save();
    }
    this.fire();
  }

  mods() {
    const s = this.s;
    return { count: s.stars, spread: s.spread, life: s.burn, bright: s.bright, tail: s.tail, hang: s.hang };
  }

  fire(t = this.getTime(), x = this.target.x) {
    const s = this.s, info = TYPES[s.type];
    const colour = s.colour === 'auto' ? undefined : s.colour;
    const barge = this.fw.nearestBarge(x);
    if (s.type === 'fan') {
      const n = Math.max(3, Math.min(13, Math.round(7 * s.stars)));
      this.fw.fan({ t, barge, n, spread: 0.45 * s.spread, color: colour || 'gold', speed: 0.72 + (s.inches - 3) / 9 * 0.6, mods: { ...this.mods(), count: 1, spread: 1 } });
    } else if (s.type === 'mine') {
      this.fw.mine({ t, barge, color: colour, count: 60, speed: 0.75 + (s.inches - 3) / 9 * 0.55, mods: this.mods() });
    } else if (s.type === 'waterfall') {
      this.fw.waterfall({ t0: t, t1: t + 25 * s.burn, gold: colour === 'gold', bright: s.bright }, this.world);
    } else {
      const c2 = !info.second ? undefined : s.colour2 === 'auto' ? undefined : s.colour2;
      this.fw.launchShell({ t, type: s.type, inches: s.inches, barge, target: [x, this.altitude(), this.target.z], color: colour, color2: c2, rise: s.rise, manual: true, mods: this.mods() });
    }
    this.flashMarker();
  }

  salvo() {
    const t = this.getTime();
    const xs = SITE.barges.map(b => b.x);
    if (TYPES[this.s.type].ground && this.s.type === 'waterfall') return this.fire(t);
    xs.forEach((x, i) => this.fire(t + i * 0.22, x));
  }

  clearSky() { this.smoke.clear(); }

  reset() {
    const type = this.s.type;
    this.s = { ...DEFAULTS, type };
    this.sanitise();
    this.save();
    this.refresh();
  }

  // ------------------------------------------------------------ per frame
  update(t) {
    if (!this.on) return;
    if (this.repeat && t >= this.nextFire) {
      this.fire(t);
      this.nextFire = t + (TYPES[this.s.type].ground ? 4 : 3.4);
    }
    // keep the target marker on the spot in the sky
    const p = this.targetPoint();
    const v = this._v.set(p[0], p[1], p[2]).project(this.camera);
    const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
    this.marker.classList.toggle('hide', !vis);
    if (vis) this.marker.style.transform = `translate(${(v.x * 0.5 + 0.5) * innerWidth}px, ${(-v.y * 0.5 + 0.5) * innerHeight}px)`;
    if (t - (this._readT || 0) > 0.5) { this._readT = t; this.readout(); }
  }

  flashMarker() {
    this.marker.classList.remove('fired');
    void this.marker.offsetWidth;
    this.marker.classList.add('fired');
  }

  noteBreak(info) {
    if (!this.on || !info.manual) return;
    this.last = info;
    this.readout();
  }

  wind() { return this.s.wind; }

  // ------------------------------------------------------------ UI
  build() {
    const root = this.root = el('div', 'lab glass hide');
    root.id = 'lab';
    const head = el('div', 'lab-head');
    const ht = el('div', 'lab-title');
    ht.append(el('span', 'eyebrow', 'Workshop'), el('b', '', 'Fire anything, anywhere'));
    this.minBtn = el('button', 'lab-min', 'Hide');
    this.minBtn.type = 'button';
    this.minBtn.onclick = () => { root.classList.toggle('min'); this.minBtn.textContent = root.classList.contains('min') ? 'Settings' : 'Hide'; };
    head.append(ht, this.minBtn);
    const body = this.body = el('div', 'lab-body');
    body.append(el('p', 'lab-hint', 'Tap the sky where you want it to break. Every setting stays within what a real shell can do.'));
    body.append(el('div', 'lab-sec', 'Shells'));
    this.typeBox = el('div', 'chips');
    SHELL_ORDER.forEach(id => this.typeBox.append(this.chip(id, SHELL_NAMES[id])));
    body.append(this.typeBox);
    body.append(el('div', 'lab-sec', 'From the barges and bridge'));
    this.groundBox = el('div', 'chips');
    ['fan', 'mine', 'waterfall'].forEach(id => this.groundBox.append(this.chip(id, TYPES[id].label)));
    body.append(this.groundBox);
    this.colLbl = el('div', 'lab-sec', 'Colour');
    this.colBox = el('div', 'swatches');
    this.col2Lbl = el('div', 'lab-sec', 'Second colour');
    this.col2Box = el('div', 'swatches');
    this.riseLbl = el('div', 'lab-sec', 'Rising effect');
    this.riseBox = el('div', 'chips small');
    RISES.forEach(([id, label]) => {
      const b = el('button', '', label);
      b.type = 'button';
      b.dataset.id = id;
      b.onclick = () => { this.s.rise = id; this.save(); this.refresh(); };
      this.riseBox.append(b);
    });
    body.append(this.colLbl, this.colBox, this.col2Lbl, this.col2Box, this.riseLbl, this.riseBox);
    this.sliders = {};
    const sl = el('div', 'sliders');
    for (const d of SLIDERS) {
      const row = el('label', 'slider');
      const top = el('span', 'sl-top');
      const name = el('span', 'sl-name', d.label);
      const val = el('span', 'sl-val');
      top.append(name, val);
      const input = el('input');
      input.type = 'range';
      input.min = d.min; input.max = d.max; input.step = d.step;
      input.oninput = () => { this.s[d.key] = Number(input.value); this.sanitise(); this.save(); this.syncSliders(); };
      row.append(top, input);
      sl.append(row);
      this.sliders[d.key] = { row, input, val };
    }
    body.append(sl);
    this.read = el('div', 'lab-read');
    body.append(this.read);
    const act = el('div', 'lab-actions');
    const btn = (label, more, cls, fn) => {
      const b = el('button', cls, label);
      if (more) b.append(el('span', 'lng', more));
      b.type = 'button';
      b.onclick = fn;
      act.append(b);
      return b;
    };
    btn('Fire', '', 'fire', () => this.fire());
    btn('Salvo', ' ×5', '', () => this.salvo());
    this.repeatBtn = btn('Repeat', '', '', () => { this.repeat = !this.repeat; this.nextFire = this.getTime(); this.repeatBtn.classList.toggle('on', this.repeat); });
    btn('Clear', ' smoke', '', () => this.clearSky());
    btn('Reset', ' to default', 'reset', () => this.reset());
    root.append(head, body, act);
    document.body.appendChild(root);
    this.refresh();
  }

  chip(id, label) {
    const b = el('button', '', label);
    b.type = 'button';
    b.dataset.id = id;
    b.onclick = () => { this.s.type = id; this.sanitise(); this.save(); this.refresh(); };
    return b;
  }

  swatches(box, opts, current, onPick, extra) {
    box.textContent = '';
    for (const [id, label, css] of extra) {
      const b = el('button', 'sw ' + id);
      b.type = 'button';
      b.title = label;
      b.setAttribute('aria-label', label);
      if (css) b.style.background = css;
      b.classList.toggle('on', current === id);
      b.onclick = () => onPick(id);
      box.append(b);
    }
    for (const k of opts) {
      const b = el('button', 'sw');
      b.type = 'button';
      b.title = NAMES[k];
      b.setAttribute('aria-label', NAMES[k]);
      b.style.background = SWATCH[k];
      b.classList.toggle('on', current === k);
      b.onclick = () => onPick(k);
      box.append(b);
    }
  }

  refresh() {
    const s = this.s, info = TYPES[s.type];
    for (const b of [...this.typeBox.children, ...this.groundBox.children]) b.classList.toggle('on', b.dataset.id === s.type);
    const hasCol = !!info.colours;
    this.colLbl.style.display = this.colBox.style.display = hasCol ? '' : 'none';
    if (hasCol) {
      this.colLbl.textContent = s.colour === 'auto' ? 'Colour · surprise me' : 'Colour · ' + NAMES[s.colour];
      this.swatches(this.colBox, info.colours, s.colour, (k) => { s.colour = k; this.save(); this.refresh(); }, [['auto', 'Surprise me', null]]);
    }
    const sec = info.second;
    this.col2Lbl.style.display = this.col2Box.style.display = sec ? '' : 'none';
    if (sec) {
      const extra = [['auto', 'Surprise me', null]];
      if (sec[2]) extra.push(['none', 'None', null]);
      this.col2Lbl.textContent = sec[0] + ' · ' + (s.colour2 === 'auto' ? 'surprise me' : s.colour2 === 'none' ? 'none' : NAMES[s.colour2]);
      this.swatches(this.col2Box, sec[1], s.colour2, (k) => { s.colour2 = k; this.save(); this.refresh(); }, extra);
    }
    this.riseLbl.style.display = this.riseBox.style.display = info.ground ? 'none' : '';
    for (const b of this.riseBox.children) b.classList.toggle('on', b.dataset.id === s.rise);
    // which sliders apply
    const applies = {
      inches: s.type !== 'waterfall', height: !info.ground, spread: s.type !== 'waterfall', stars: s.type !== 'waterfall',
      burn: true, bright: true, tail: !!info.tails, hang: s.type !== 'waterfall', wind: true,
    };
    for (const d of SLIDERS) {
      const S = this.sliders[d.key];
      S.row.classList.toggle('off', !applies[d.key]);
      S.input.disabled = !applies[d.key];
    }
    this.syncSliders();
  }

  syncSliders() {
    for (const d of SLIDERS) this.sliders[d.key].input.value = this.s[d.key];
    this.refreshValues();
  }

  refreshValues() {
    const s = this.s, info = TYPES[s.type];
    const V = (k, txt) => { this.sliders[k].val.textContent = txt; };
    V('inches', s.type === 'fan' || s.type === 'mine' ? `${s.inches}-inch tubes` : `${s.inches}-inch`);
    V('height', `${Math.round(this.altitude())} m`);
    V('spread', s.type === 'fan' ? pct(s.spread) + ' fan' : s.type === 'mine' ? pct(s.spread) + ' cone' : `${Math.round(this.radius() * 2)} m across`);
    V('stars', s.type === 'fan' ? `${Math.max(3, Math.min(13, Math.round(7 * s.stars)))} comets` : pct(s.stars));
    V('burn', s.type === 'waterfall' ? `${Math.round(25 * s.burn)} s` : pct(s.burn));
    V('bright', pct(s.bright));
    V('tail', pct(s.tail));
    V('hang', pct(s.hang));
    V('wind', s.wind < 0.3 ? 'calm' : `${s.wind.toFixed(1)} m/s`);
    this.readout();
  }

  readout() {
    // (the lowest reach is part of the readout so the limit is visible)
    const s = this.s, info = TYPES[s.type];
    const p = this.targetPoint();
    const cam = this.camera.position;
    const d = Math.hypot(p[0] - cam.x, p[1] - cam.y, p[2] - cam.z);
    let line;
    if (info.ground) {
      line = s.type === 'waterfall'
        ? `A curtain of sparks off the bridge for ${Math.round(25 * s.burn)} s.`
        : `Fired from barge ${this.fw.nearestBarge(this.target.x) + 1}, the nearest to your spot.`;
    } else {
      const b = SITE.barges[this.fw.nearestBarge(this.target.x)];
      const climb = aimShell([b.x, 3.2, b.z], p, 0.0032, 0.07, [s.wind, 0, -s.wind * 0.35]).t;
      line = `Breaks ${Math.round(p[1])} m up, about ${Math.round(this.radius() * 2)} m across, after a ${climb.toFixed(1)} s climb; the lowest sparks burn out about ${Math.max(5, Math.round(p[1] - this.reach()))} m above the water.`;
    }
    line += ` You hear it ${(d / 343).toFixed(1)} s after you see it.`;
    if (this.last && this.last.type === s.type && this.last.stars) line += ` Last one: ${this.last.stars} stars.`;
    if (this.read.textContent !== line) this.read.textContent = line;
  }

  setOn(on) {
    this.on = on;
    this.root.classList.toggle('hide', !on);
    // on a phone the sheet starts folded so the sky stays clear
    if (on) {
      const fold = innerWidth <= 760;
      this.root.classList.toggle('min', fold);
      this.minBtn.textContent = fold ? 'Settings' : 'Hide';
    }
    this.marker.classList.toggle('hide', !on);
    if (!on) { this.repeat = false; this.repeatBtn.classList.remove('on'); }
    this.refresh();
    if (this.onToggle) this.onToggle(on);
  }
}
