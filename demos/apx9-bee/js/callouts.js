// Blueprint-style callout cards with leader lines: two columns flanking the model, anchored to projected part centres.
import * as THREE from 'three';
import { h, clamp } from './dom.js';

const _v = new THREE.Vector3();
const shown = (p) => p.ownVisible !== false;
const GAP = 8;

export class Callouts {
  /**
   * @param {object} app  window.__apx
   * @param {{labels:HTMLElement, leaders:SVGElement, insets:()=>{top:number,right:number,bottom:number,left:number,topL?:number,topR?:number,bottomL?:number,bottomR?:number},
   *          onHover:(item|null)=>void, onPick:(item, evt)=>void}} o
   */
  constructor(app, o) {
    this.app = app;
    this.host = o.labels;
    this.svg = o.leaders;
    this.insets = o.insets;
    this.onHover = o.onHover;
    this.onPick = o.onPick;
    this.items = [];
    this.enabled = true;
    this.suppressed = false;
    this.mode = 'full';
    this.cw = 0;
    this.hoverKey = null;
    this.selKeys = new Set();
    this.moving = false;
  }

  clear() {
    for (const it of this.items) { it.el.remove(); it.g.remove(); }
    this.items = [];
    this.hoverKey = null;
  }

  /** list: [{ key, title, bullets, parts:[Part], order }] */
  setItems(list) {
    this.clear();
    for (const def of list) {
      const parts = (def.parts || []).filter(Boolean);
      if (!parts.length) continue;
      const el = h('div', { class: 'callout is-off', role: 'button', tabindex: '0', 'data-key': def.key, 'aria-label': def.title },
        h('div', { class: 'callout-title' }, def.title),
        def.bullets?.length ? h('ul', { class: 'callout-list' }, def.bullets.map((b) => h('li', null, b))) : null);
      const g = h('svg:g', { class: 'lead is-off', 'data-key': def.key },
        h('svg:circle', { class: 'leader-halo', r: 9 }),
        h('svg:path', { class: 'leader' }),
        h('svg:circle', { class: 'leader-dot', r: 3.6 }));
      const item = {
        def, key: def.key, title: def.title, order: def.order ?? 99, parts, el, g,
        halo: g.children[0], line: g.children[1], dot: g.children[2],
        side: null, sideEff: 'L', x: 0, y: 0, tx: 0, ty: 0, init: false, vis: false, ax: 0, ay: 0, part: parts[0],
        hFull: 60, hCompact: 28, titleMid: 14,
      };
      el.addEventListener('pointerenter', () => { this.hoverKey = item.key; this._flags(); this.onHover?.(item); });
      el.addEventListener('pointerleave', () => { if (this.hoverKey === item.key) this.hoverKey = null; this._flags(); this.onHover?.(null); });
      el.addEventListener('click', (e) => this.onPick?.(item, e));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.onPick?.(item, e); } });
      this.host.append(el);
      this.svg.append(g);
      this.items.push(item);
    }
    this.cw = 0;
    this.moving = true;
  }

  itemForPart(part) {
    for (let p = part; p && p.node; p = p.parent) {
      for (const it of this.items) if (it.parts.includes(p)) return it;
    }
    const g = part?.group;
    return g ? this.items.find((it) => it.key === g) || null : null;
  }

  setHoverKey(key) { if (this.hoverKey !== key) { this.hoverKey = key; this._flags(); } }
  setSelectedKeys(keys) { this.selKeys = new Set(keys); this._flags(); }
  setEnabled(on) { this.enabled = on; this._applyShown(); }

  /** Temporarily hide the cards when panels leave no room for them beside the model. */
  setSuppressed(v) { if (this.suppressed !== v) { this.suppressed = v; this._applyShown(); } }

  get active() { return this.enabled && !this.suppressed; }

  _applyShown() {
    const on = this.active;
    this.host.hidden = !on;
    this.svg.style.display = on ? '' : 'none';
    for (const it of this.items) it.init = false;
    this.moving = true;
  }

  _flags() {
    for (const it of this.items) {
      const hov = it.key === this.hoverKey, sel = this.selKeys.has(it.key);
      it.el.classList.toggle('is-hover', hov);
      it.el.classList.toggle('is-sel', sel);
      it.g.classList.toggle('is-hover', hov);
      it.g.classList.toggle('is-sel', sel);
    }
    this.moving = true;
  }

  cardWidth(W) { return W >= 1500 ? 244 : W >= 1180 ? 222 : W >= 900 ? 196 : W >= 640 ? 172 : 150; }

  measure() {
    const cw = this.cw;
    this.host.classList.remove('compact');
    for (const it of this.items) {
      it.el.style.width = `${cw}px`;
      it.hFull = it.el.offsetHeight || 60;
    }
    this.host.classList.add('compact');
    for (const it of this.items) {
      it.hCompact = it.el.offsetHeight || 28;
      it.titleMid = Math.round(it.hCompact / 2);
    }
    this.host.classList.toggle('compact', this.mode === 'compact');
  }

  /** Returns true while cards are still gliding (caller keeps ticking). */
  update(dt) {
    if (!this.active || !this.items.length) return false;
    const { stage } = this.app;
    const camera = stage.camera;
    const W = stage.size.x, H = stage.size.y;
    const cw = this.cardWidth(W);
    if (cw !== this.cw) { this.cw = cw; this.measure(); }
    const ins = this.insets();
    const left = ins.left, right = W - ins.right;
    const topOf = (side) => (side === 'L' ? ins.topL : ins.topR) ?? ins.top;
    const bottomOf = (side) => H - ((side === 'L' ? ins.bottomL : ins.bottomR) ?? ins.bottom);
    const availOf = (side) => Math.max(60, bottomOf(side) - topOf(side));
    const midX = (left + right) / 2;
    const hyst = Math.max(26, W * 0.035);

    // 1. project
    for (const it of this.items) {
      let first = null;
      const cands = [];
      for (const p of it.parts) {
        if (!shown(p)) continue;
        p.worldCenter(_v).project(camera);
        if (_v.z > 1 || _v.z < -1) continue;
        const c = { p, x: (_v.x * 0.5 + 0.5) * W, y: (-_v.y * 0.5 + 0.5) * H };
        cands.push(c);
        if (!first) first = c;
      }
      if (!first) { it.vis = false; continue; }
      if (!it.side) it.side = first.x < midX ? 'L' : 'R';
      else if (it.side === 'L' && first.x > midX + hyst) it.side = 'R';
      else if (it.side === 'R' && first.x < midX - hyst) it.side = 'L';
      let best = first;
      for (const c of cands) if (it.side === 'L' ? c.x < best.x - 1 : c.x > best.x + 1) best = c;
      it.ax = best.x; it.ay = best.y; it.part = best.p;
      it.vis = best.x > -24 && best.x < W + 24 && best.y > -24 && best.y < H + 24;
      it.sideEff = it.side;
    }
    const live = this.items.filter((it) => it.vis);

    // 2. side balancing + density mode
    const need = (side, key) => live.reduce((t, it) => (it.sideEff === side ? t + it[key] + GAP : t), 0);
    const over = (side, key) => need(side, key) - availOf(side);
    const balance = (key) => {
      for (let guard = 0; guard < 8; guard++) {
        const ol = over('L', key), or = over('R', key);
        if (ol <= 0 && or <= 0) return true;
        const from = ol > or ? 'L' : 'R', to = from === 'L' ? 'R' : 'L';
        const cand = live.filter((it) => it.sideEff === from).sort((a, b) => Math.abs(a.ax - midX) - Math.abs(b.ax - midX))[0];
        if (!cand) return false;
        const before = Math.max(ol, or);
        cand.sideEff = to;
        if (Math.max(over('L', key), over('R', key)) >= before) { cand.sideEff = from; return false; }
      }
      return false;
    };
    const snapshot = live.map((it) => it.sideEff);
    let mode = this.mode;
    if (mode === 'full') {
      if (!balance('hFull')) { live.forEach((it, i) => (it.sideEff = snapshot[i])); mode = 'compact'; }
    } else {
      // return to the full layout only with comfortable slack
      const ok = balance('hFull') && need('L', 'hFull') < availOf('L') * 0.9 && need('R', 'hFull') < availOf('R') * 0.9;
      if (ok) mode = 'full'; else live.forEach((it, i) => (it.sideEff = snapshot[i]));
    }
    if (mode === 'compact') balance('hCompact');
    if (mode !== this.mode) { this.mode = mode; this.host.classList.toggle('compact', mode === 'compact'); }
    const key = mode === 'full' ? 'hFull' : 'hCompact';
    for (const it of live) it.hh = it[key];

    // 3. vertical placement per side (sorted by anchor height, pushed apart, kept inside the safe band)
    for (const side of ['L', 'R']) {
      const top = topOf(side), bottom = bottomOf(side), avail = availOf(side);
      const list = live.filter((it) => it.sideEff === side).sort((a, b) => a.ay - b.ay);
      // drop the lowest-priority cards if even the compact stack cannot fit
      let total = list.reduce((t, it) => t + it.hh + GAP, 0);
      while (total > avail && list.length) {
        let worst = 0;
        list.forEach((it, i) => { if (it.order > list[worst].order) worst = i; });
        total -= list[worst].hh + GAP;
        list[worst].vis = false;
        list.splice(worst, 1);
      }
      for (const it of list) it.dy = clamp(it.ay - it.titleMid, top, bottom - it.hh);
      let cursor = top;
      for (const it of list) { it.ty = Math.max(it.dy, cursor); cursor = it.ty + it.hh + GAP; }
      let limit = bottom;
      for (let i = list.length - 1; i >= 0; i--) { const it = list[i]; it.ty = Math.min(it.ty, limit - it.hh); limit = it.ty - GAP; }
      cursor = top;
      for (const it of list) { it.ty = Math.max(it.ty, cursor); cursor = it.ty + it.hh + GAP; }
      for (const it of list) it.tx = side === 'L' ? left : right - cw;
    }

    // 4. glide + write
    const k = dt > 0.2 ? 1 : 1 - Math.exp(-dt * 15);
    let moving = false;
    for (const it of this.items) {
      const was = it.el.classList.contains('is-off');
      if (it.vis === was) { it.el.classList.toggle('is-off', !it.vis); it.g.classList.toggle('is-off', !it.vis); }
      if (!it.vis) continue;
      if (!it.init || was) { it.x = it.tx; it.y = it.ty; it.init = true; }
      else {
        it.x += (it.tx - it.x) * k;
        it.y += (it.ty - it.y) * k;
        if (Math.abs(it.tx - it.x) > 0.35 || Math.abs(it.ty - it.y) > 0.35) moving = true;
      }
      it.el.style.transform = `translate3d(${it.x.toFixed(1)}px,${it.y.toFixed(1)}px,0)`;
      it.el.classList.toggle('is-right', it.sideEff === 'R');
      const hh = it.hh || it.hCompact;
      const cxm = it.x + cw / 2, cym = it.y + hh / 2;
      const facing = it.sideEff === 'L' ? it.x + cw : it.x;
      const beyond = it.sideEff === 'L' ? it.ax > facing + 12 : it.ax < facing - 12;
      let sx, sy;
      if (beyond) { sx = facing; sy = it.y + it.titleMid; }
      else {
        // clip the centre -> anchor ray against the card rectangle
        const dx = it.ax - cxm, dy = it.ay - cym;
        const tt = Math.min(dx ? (cw / 2) / Math.abs(dx) : Infinity, dy ? (hh / 2) / Math.abs(dy) : Infinity, 1);
        sx = cxm + dx * tt; sy = cym + dy * tt;
      }
      it.line.setAttribute('d', `M${sx.toFixed(1)} ${sy.toFixed(1)}L${it.ax.toFixed(1)} ${it.ay.toFixed(1)}`);
      it.dot.setAttribute('cx', it.ax.toFixed(1)); it.dot.setAttribute('cy', it.ay.toFixed(1));
      it.halo.setAttribute('cx', it.ax.toFixed(1)); it.halo.setAttribute('cy', it.ay.toFixed(1));
    }
    this.moving = moving;
    return moving;
  }

  debug() {
    return this.items.map((it) => ({ key: it.key, vis: it.vis, side: it.sideEff, x: Math.round(it.x), y: Math.round(it.y), ax: Math.round(it.ax), ay: Math.round(it.ay), part: it.part?.id }));
  }
}
