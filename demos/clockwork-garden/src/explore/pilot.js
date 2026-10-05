import * as THREE from 'three';
import { clamp, lerp, smooth } from '../core/ease.js';
import { L } from '../world/layout.js';
import { ceilingAt, groundHeight, HOUSE } from './bounds.js';
import { SPEED } from './actor.js';
import { LowRoutes } from './lowroutes.js';
import { archUnderside } from '../world/promenade.js';

// APX-9's day, for follow mode. A small planner that keeps it busy: leave the
// skep, visit a few blooms (preferring ones it hasn't pollinated, with
// variety in kind and distance), sometimes detour through the rose arch, past
// the armillary or along the lanterns, sometimes wind the escapement, and
// carry the pollen home to deposit it. Most trips weave low through the beds
// between the stems (lowroutes.js) and rise up to the bloom at the end; the
// rest rise over the canopy, follow its height, and descend onto the target.
// The collision cushion handles the rest.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const H = L.house;
const CELL = 12;

export class Pilot {
  constructor({ bounds, world, skep, seed = 7 }) {
    this.bounds = bounds;
    this.world = world;
    this.skep = skep;
    this.seed = seed;
    this.route = null;
    this.goal = null;
    this.visits = 0;
    this.quota = 3;
    this.recent = [];
    this.wait = 0;
    this.trips = 0;
    this.status = '';
    this._canopy();
    this.pois = this._pois();
    this.low = new LowRoutes(bounds);
    this.weaves = 0;
  }

  // a route through the beds to the goal, or null (then over the canopy)
  _weave(actor, g) {
    if (!this.low.ready || (g.kind !== 'bloom' && g.kind !== 'home')) return null;
    const d = Math.hypot(g.to.x - actor.pos.x, g.to.z - actor.pos.z);
    if (d < 30 || d > 280 || this._r() > 0.75) return null;
    const pts = this.low.find(actor.pos, g.to, { phase: this._r() * 6 });
    if (!pts) return null;
    pts.push(g.to.clone().add(V(0, g.approachH ?? 5, 0)));
    this.weaves++;
    return { pts: [actor.pos.clone(), ...pts], i: 1, weave: true };
  }

  _r() { this.seed = (this.seed * 16807) % 2147483647; return this.seed / 2147483647; }

  // ---- canopy height map: how high the planting reaches, per 12-unit cell -----
  _canopy() {
    const nx = Math.ceil((H.x1 - H.x0) / CELL) + 1, nz = Math.ceil((H.z0 - H.z1) / CELL) + 1;
    const g = new Float32Array(nx * nz);
    const put = (x, z, h, r = 0) => {
      for (let i = Math.floor((x - r - H.x0) / CELL); i <= Math.floor((x + r - H.x0) / CELL); i++) {
        for (let j = Math.floor((H.z0 - z - r) / CELL); j <= Math.floor((H.z0 - z + r) / CELL); j++) {
          if (i < 0 || j < 0 || i >= nx || j >= nz) continue;
          g[j * nx + i] = Math.max(g[j * nx + i], h);
        }
      }
    };
    const w = this.world;
    for (const f of w.flora.flowers) put(f.top.x, f.top.z, f.top.y + 6 * f.scale, 6);
    for (const b of w.foliage.bushSpots) if (!b.hidden) put(b.x, b.z, (b.y0 ?? -1) + b.h, b.r);
    for (const p of w.foliage.palmSpots || []) put(p.x, p.z, 30 * p.sc, 20 * p.sc);
    for (const o of w.flora.orbs) if (o.pos) put(o.pos.x, o.pos.z, o.pos.y + 2, 2);
    put(-30, 16, 92, 30); // copper tree
    put(0, 0, 38, 10); // hero flower
    put(70, -250, 100, 36); // rose arch
    put(70, -560, 112, 52); // fountain + armillary
    for (const c of w.garden.lamps) put(c.position.x, c.position.z, 74, 6);
    // the promenade: bollards, the arches' uprights (their ribs: _avoidArches)
    for (const b of w.promenade?.bollards || []) put(b.base.x, b.base.z, b.globe.y + 4, 3);
    for (const z of L.arches.zs) for (const x of [L.arches.x0, L.arches.x1]) put(x, z, L.arches.spring + 12, 5);
    this.canopy = { g, nx, nz };
  }

  canopyAt(x, z, r = 12) {
    const { g, nx, nz } = this.canopy;
    let m = 0;
    for (let i = Math.floor((x - r - H.x0) / CELL); i <= Math.floor((x + r - H.x0) / CELL); i++) {
      for (let j = Math.floor((H.z0 - z - r) / CELL); j <= Math.floor((H.z0 - z + r) / CELL); j++) {
        if (i < 0 || j < 0 || i >= nx || j >= nz) continue;
        m = Math.max(m, g[j * nx + i]);
      }
    }
    return Math.max(m, groundHeight(x, z) + 4);
  }

  _pois() {
    const lantern = this.world.foliage.lanterns;
    return [
      { name: 'through the rose arch', pts: [V(70, 55, -205), V(70, 52, -250), V(70, 55, -295)] },
      { name: 'round the armillary', pts: [V(36, 92, -530), V(70, 100, -515), V(104, 92, -545), V(100, 80, -590), V(46, 84, -590)] },
      { name: 'along the lanterns', pts: lantern.filter((l) => !l.arch && l.p.z > -420 && l.p.z < 60).sort((a, b) => b.p.z - a.p.z).slice(0, 5).map((l) => l.p.clone().add(V(9, -10, 0))) },
      { name: 'up to the vault', pts: [V(40, 160, -120), V(70, 330, -180), V(100, 200, -240)] },
      { name: 'past the copper tree', pts: [V(-10, 40, 40), V(-55, 60, 30), V(-60, 45, -10)] },
    ];
  }

  // ---- planning -----------------------------------------------------------------
  // a route from p to a goal point, rising over the canopy and descending on arrival
  plan(from, to, { approachH = 5, low = false } = {}) {
    const pts = [from.clone()];
    const d = Math.hypot(to.x - from.x, to.z - from.z);
    const n = Math.max(2, Math.ceil(d / 14));
    const alts = [];
    for (let i = 0; i <= n; i++) {
      const k = i / n;
      const x = lerp(from.x, to.x, k), z = lerp(from.z, to.z, k);
      alts.push(this.canopyAt(x, z) + (low ? 5 : 9));
    }
    // smooth the cruise height (a running max, then a blur)
    const sm = alts.map((_, i) => Math.max(...alts.slice(Math.max(0, i - 2), i + 3)));
    for (let i = 1; i < n; i++) {
      const k = i / n;
      const x = lerp(from.x, to.x, k), z = lerp(from.z, to.z, k);
      let y = (sm[i - 1] + sm[i] * 2 + sm[i + 1]) / 4;
      // near the ends, blend toward the endpoints' own heights
      const e0 = clamp((k * d) / 26), e1 = clamp(((1 - k) * d) / 26);
      y = Math.max(y * e0 * e1 + Math.max(from.y, y) * (1 - e0) * e1 + Math.max(to.y + approachH, y * 0.6) * (1 - e1), Math.min(from.y, to.y));
      y = Math.min(y, ceilingAt(x) - 14, 210);
      const p = V(x, y, z);
      this._avoidColumns(p);
      this._avoidArches(p);
      pts.push(p);
    }
    pts.push(to.clone().add(V(0, approachH, 0)));
    // where a leg crosses a promenade arch, a waypoint under it (or over it)
    const A = L.arches;
    for (let i = pts.length - 2; i >= 1; i--) {
      const a = pts[i], b = pts[i + 1];
      for (const za of A.zs) {
        if ((a.z - za) * (b.z - za) >= 0) continue;
        const k = (za - a.z) / (b.z - a.z);
        const q = a.clone().lerp(b, k);
        if (q.x < A.x0 - 10 || q.x > A.x1 + 10) continue;
        this._avoidArches(q);
        pts.splice(i + 1, 0, q);
      }
    }
    return { pts, i: 1 };
  }

  _avoidColumns(p) {
    for (const cx of [-118, 168]) {
      for (let i = 0; i < 8; i++) {
        const cz = 150 - i * 150;
        const dx = p.x - cx, dz = p.z - cz;
        const l = Math.hypot(dx, dz);
        // (wider at the height of its bracket lantern, which leans toward the path)
        const R = p.y > 112 && p.y < 162 ? 24 : 14;
        if (l < R) { const k = (R - l) / Math.max(l, 0.01); p.x += dx * k; p.z += dz * k; }
      }
    }
    p.x = clamp(p.x, HOUSE.xMinLow + 8, HOUSE.xMaxLow - 8);
    p.z = clamp(p.z, HOUSE.zMin + 8, HOUSE.zMax - 8);
  }

  // under a promenade arch (clear of its lanterns) or well over it, never through the iron
  _avoidArches(p) {
    const A = L.arches, xc = (A.x0 + A.x1) / 2;
    for (const za of A.zs) {
      if (Math.abs(p.z - za) > 11 || p.x < A.x0 - 8 || p.x > A.x1 + 8) continue;
      // the bracket lanterns hang over the path's edges
      for (const lx of [A.x0 + 9.5, A.x1 - 9.5]) if (Math.abs(p.x - lx) < 7.5 && p.y > 42 && p.y < 78) p.x = lx + Math.sign(xc - lx) * 7.5;
      p.x = clamp(p.x, A.x0 + 6, A.x1 - 6);
      const under = Math.min(archUnderside(p.x) - 6, Math.abs(p.x - xc) < 9 ? 93 : Infinity);
      if (p.y > under && p.y < A.apex + 20) p.y = p.y < (A.spring + A.apex) / 2 ? under : A.apex + 20;
    }
  }

  chooseBloom(pos, interactions) {
    const L2 = this.bounds.landables;
    let total = 0;
    const cands = [];
    for (const l of L2) {
      if (l.enabled === false || l.blocked || this.recent.includes(l.id)) continue;
      const d = Math.hypot(l.spot.x - pos.x, l.spot.z - pos.z);
      if (d < 8 || d > 330) continue;
      const fresh = interactions?.isPollinated?.(l) ? 0.35 : 1;
      const special = l.kind === 'flora' ? 1 : l.kind === 'grown' ? 5 : 3.5;
      const dist = d < 40 ? 1.4 : d < 140 ? 1 : 0.55;
      const w = fresh * special * dist;
      total += w;
      cands.push([l, w]);
    }
    let r = this._r() * total;
    for (const [l, w] of cands) { if ((r -= w) <= 0) return l; }
    return cands[0]?.[0] || L2[0];
  }

  // ---- per frame ---------------------------------------------------------------------
  // returns an intent for the actor; may trigger actor.land / dock / takeoff
  step(dt, actor, interactions) {
    const intent = { vel: V(), face: null, boost: false, lift: 0 };
    const s = actor.state;
    if (s === 'landed' || s === 'grounded') {
      this.wait -= dt;
      this.status = s === 'landed' ? `gathering pollen on ${actor.lastLanding?.name || 'a bloom'}` : 'resting';
      if (this.wait <= 0 && (s === 'grounded' || actor.gather?.done)) {
        actor.takeoff();
        this.route = null;
        this.goal = null;
      }
      return intent;
    }
    if (actor.busy) {
      if (s === 'docking' || s === 'walk-in') this.status = 'carrying its pollen into the skep';
      if (s === 'inside') this.status = 'depositing pollen in the skep';
      if (s === 'walk-out') this.status = 'heading out again';
      this.route = null;
      return intent;
    }
    // (the route grid builds after the bee-scale planting, never alongside it)
    if (!this.low.ready && this.buildOK !== false) this.low.step(1.5);
    if (!this.goal) this._next(actor, interactions);
    const g = this.goal;
    if (!this.route) this.route = this._weave(actor, g) || this.plan(actor.pos, g.to, { approachH: g.approachH ?? 5, low: g.low });
    // pure pursuit along the route
    const r = this.route;
    while (r.i < r.pts.length - 1 && actor.pos.distanceTo(r.pts[r.i]) < 9) r.i++;
    const aim = r.pts[r.i];
    const last = r.i === r.pts.length - 1;
    const toAim = aim.clone().sub(actor.pos);
    const dist = toAim.length();
    const remaining = dist + (last ? 0 : r.pts.slice(r.i).reduce((a, p, k, arr) => a + (k ? p.distanceTo(arr[k - 1]) : 0), 0));
    // (through the beds at an unhurried cruise: the weaving is the point)
    const cruise = r.weave ? SPEED.cruise * 0.9 : g.speed ?? (remaining > 160 ? SPEED.boost * 0.85 : remaining > 60 ? SPEED.cruise * 1.25 : SPEED.cruise);
    const speed = Math.min(cruise, 3 + remaining * 0.9);
    intent.boost = cruise > SPEED.cruise * 1.5 && remaining > 60;
    intent.vel.copy(toAim).multiplyScalar(speed / Math.max(dist, 1e-3));
    if (g.kind === 'tour') this.status = `flying ${g.name}`;
    // watchdog: if APX-9 stops closing on its aim (pinned against a solid the
    // planner didn't know about), give up on that leg instead of hovering
    // there forever: skip the waypoint, or abandon an unreachable bloom
    const w = this._watch;
    if (!w || w.route !== r || w.i !== r.i) this._watch = { route: r, i: r.i, best: dist, t: 0 };
    else if (dist < w.best - 1) { w.best = dist; w.t = 0; }
    else if ((w.t += dt) > 2.5) {
      this._watch = null;
      this.giveUps = (this.giveUps || 0) + 1;
      // (where: tools/stallcheck.mjs reports what it was pressed against)
      if ((this.giveUpLog ||= []).length < 50) this.giveUpLog.push({ p: actor.pos.clone(), aim: aim.clone(), kind: g.kind, last, weave: !!r.weave });
      if (!last) r.i++;
      else if (g.kind === 'bloom') { g.landable.blocked = true; this.goal = null; this.route = null; }
      else if (g.kind === 'tour') { this.goal = g.then || null; this.route = null; }
      else { this.route = null; this.stalls = (this.stalls || 0) + 1; if (this.stalls > 2) { this.stalls = 0; this.goal = null; } }
      return intent;
    }
    // arrival
    if (last && dist < (g.kind === 'bloom' ? 3.5 : 6)) {
      if (g.kind === 'bloom') {
        actor.land(g.landable);
        this.recent.push(g.landable.id);
        if (this.recent.length > 8) this.recent.shift();
        this.visits++;
        this.wait = 0.8 + this._r() * 2.2;
      } else if (g.kind === 'home') {
        actor.dock();
        this.visits = 0;
        this.trips++;
        this.quota = 2 + Math.floor(this._r() * 3);
      } else if (g.kind === 'wind') {
        interactions?.wind?.('apx9');
      }
      this.goal = null;
      this.route = null;
      if (g.then) { this.goal = g.then; }
    }
    return intent;
  }

  _next(actor, interactions) {
    const s = this.skep;
    const pos = actor.pos;
    // full, or done with this trip: go home
    if (actor.pollen > 0.92 || (this.visits >= this.quota && actor.pollen > 0.3)) {
      const to = s.board.clone().addScaledVector(s.out, 6).add(V(0, 1.5, 0));
      this.goal = { kind: 'home', to, approachH: 0, low: true };
      this.status = 'carrying its pollen home';
      return;
    }
    const r = this._r();
    // now and then: wind the garden, or take a scenic detour
    if (this.trips > 0 && r < 0.12 && !interactions?.windBusy?.()) {
      const e = L.escapement.clone().add(V(0, 3.5, 0));
      this.goal = { kind: 'wind', to: e, approachH: 0, low: true };
      this.status = 'flying to wind the escapement';
      return;
    }
    const bloom = this.chooseBloom(pos, interactions);
    const goBloom = { kind: 'bloom', landable: bloom, to: bloom.spot.clone(), approachH: 4.5 };
    if (r > 0.82) {
      const poi = this.pois[Math.floor(this._r() * this.pois.length)];
      if (poi.pts.length) {
        // tour waypoints, then the bloom
        const pts = poi.pts.map((p) => p.clone());
        const first = { kind: 'tour', name: poi.name, to: pts[0], approachH: 0, speed: SPEED.cruise * 1.1 };
        let cur = first;
        for (let i = 1; i < pts.length; i++) { const nx = { kind: 'tour', name: poi.name, to: pts[i], approachH: 0, low: true, speed: SPEED.cruise }; cur.then = nx; cur = nx; }
        cur.then = goBloom;
        this.goal = first;
        this.status = `flying ${poi.name}`;
        return;
      }
    }
    this.goal = goBloom;
    this.status = `flying to ${bloom.name}`;
  }
}
