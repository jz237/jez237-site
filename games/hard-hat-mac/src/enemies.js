// Enemy AI on an auto-generated navigation grid (walkable surfaces + ladder links).
import * as THREE from 'three';
import { Puppet, Dog } from './characters.js';
import { moveBody, GRAVITY } from './physics.js';
import { clamp, angleDamp, rr, pick } from './util.js';

const CELL = 0.5;

// binary min-heap of [priority, id]
export class Heap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(p, v) { const a = this.a; a.push([p, v]); let i = a.length - 1; while (i > 0) { const j = (i - 1) >> 1; if (a[j][0] <= a[i][0]) break; [a[i], a[j]] = [a[j], a[i]]; i = j; } }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } }
    return top;
  }
}

export class NavGrid {
  constructor(world, bounds, ladders, opts = {}) {
    this.nodes = []; this.cols = new Map();
    const [bx0, bz0, bx1, bz1] = bounds, avoid = opts.avoid || [];
    const key = (i, j) => i * 100003 + j;
    this.key = key;
    for (let x = bx0 + CELL / 2, i = 0; x < bx1; x += CELL, i++) for (let z = bz0 + CELL / 2, j = 0; z < bz1; z += CELL, j++) {
      const here = world.query(x - .25, z - .25, x + .25, z + .25).filter(b => !(b.noFloor || b.ghost || b.dyn || b.socket) && b.y1 <= 30);
      const tops = [];
      for (const b of here) if (x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1 && !tops.some(t => Math.abs(t - b.y1) < .1)) tops.push(b.y1);
      // drop surfaces buried under another box (dirt under a concrete slab)
      for (let k = tops.length - 1; k >= 0; k--) if (here.some(b => x > b.x0 && x < b.x1 && z > b.z0 && z < b.z1 && b.y0 < tops[k] + .04 && b.y1 > tops[k] + .04)) tops.splice(k, 1);
      for (const y of tops) {
        // the footprint must be supported at the same height (union of boxes, so deck seams are fine)
        const sup = (px, pz) => here.some(b => Math.abs(b.y1 - y) < .06 && px >= b.x0 && px <= b.x1 && pz >= b.z0 && pz <= b.z1);
        if (!(sup(x - .22, z - .22) && sup(x + .22, z - .22) && sup(x - .22, z + .22) && sup(x + .22, z + .22))) continue;
        if (avoid.some(a => x > a.x0 && x < a.x1 && z > a.z0 && z < a.z1)) continue;
        // headroom
        let blocked = false;
        for (const b of world.query(x - .3, z - .3, x + .3, z + .3)) {
          if (b.ghost || b.dyn || b.socket) continue;
          if (x + .3 > b.x0 && x - .3 < b.x1 && z + .3 > b.z0 && z - .3 < b.z1 && b.y0 < y + 1.75 && b.y1 > y + .3) { blocked = true; break; }
        }
        if (blocked) continue;
        const n = { i, j, x, y, z, links: [], id: this.nodes.length, conv: here.some(b => b.conv && Math.abs(b.y1 - y) < .06 && x >= b.x0 && x <= b.x1 && z >= b.z0 && z <= b.z1) };
        this.nodes.push(n);
        const k = key(i, j); let c = this.cols.get(k); if (!c) this.cols.set(k, c = []); c.push(n);
      }
    }
    this.bx0 = bx0; this.bz0 = bz0;
    const at = (i, j, y) => { let best = null; for (const n of this.cols.get(key(i, j)) || []) if (Math.abs(n.y - y) < .36 && (!best || Math.abs(n.y - y) < Math.abs(best.y - y))) best = n; return best; };
    for (const n of this.nodes) for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const m = at(n.i + di, n.j + dj, n.y); if (!m) continue;
      if (di && dj && (!at(n.i + di, n.j, n.y) || !at(n.i, n.j + dj, n.y))) continue;
      n.links.push({ to: m.id, cost: di && dj ? 1.414 : 1 });
    }
    for (const L of ladders) {
      const bot = this.nearest(L.x + L.fx * .55, L.y0, L.z + L.fz * .55, 1.2), top = this.nearest(L.x - L.fx * .8, L.y1, L.z - L.fz * .8, 1.2);
      if (!top || Math.abs(top.y - L.y1) > .4) continue;
      const c = (L.y1 - L.y0) * 1.6 / CELL;
      if (bot && Math.abs(bot.y - L.y0) < .4) { bot.links.push({ to: top.id, cost: c, ladder: L, up: true }); top.links.push({ to: bot.id, cost: c, ladder: L, up: false }); continue; }
      // ladder that ends in mid-air (the silo): climb down, then drop to whatever is below
      const below = this.nearest(L.x + L.fx * .6, L.y0 - .1, L.z + L.fz * .6, 1.5);
      if (below && below.y > L.y0 - 4.6) top.links.push({ to: below.id, cost: c + 6, ladder: L, up: false, dropEnd: true });
    }
    // safe drops off ledges (<= 4.6 m) for the demo bot; enemies never use them
    for (const n of this.nodes) for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (n.conv || at(n.i + di, n.j + dj, n.y)) continue;
      for (let k = 1; k <= 3; k++) {
        let m = null;
        for (const c of this.cols.get(key(n.i + di * k, n.j + dj * k)) || []) if (!c.conv && c.y < n.y - .6 && c.y > n.y - 4.6 && (!m || c.y > m.y)) m = c;
        if (!m) continue;
        if (!world.segmentBlocked(n.x, n.y + 1, n.z, m.x, n.y + 1, m.z, .25) && !world.segmentBlocked(m.x, n.y + .3, m.z, m.x, m.y + 1.2, m.z, .3))
          n.links.push({ to: m.id, cost: 4 + k + (n.y - m.y) * .8, drop: true });
        break;
      }
    }
  }
  addRide(fromPos, toPos, ride, cost) {
    const a = this.nearest(fromPos.x, fromPos.y + .3, fromPos.z, 2.5), b = this.nearest(toPos.x, toPos.y + .3, toPos.z, 2.5);
    if (a && b) a.links.push({ to: b.id, cost, ride });
    return !!(a && b);
  }
  // Dijkstra for the demo bot: cheapest path from start to any node where ok(node) holds.
  search(start, ok, maxCost = 6000) {
    if (!start) return null;
    const N = this.nodes, g = new Map([[start.id, 0]]), came = new Map(), open = new Heap(), closed = new Set();
    open.push(0, start.id);
    while (open.size) {
      const [c, cur] = open.pop();
      if (closed.has(cur)) continue; closed.add(cur);
      if (ok(N[cur])) { const out = [cur]; let k = cur; while (came.has(k)) { k = came.get(k); out.push(k); } return { path: out.reverse(), cost: c }; }
      if (c > maxCost) break;
      for (const l of N[cur].links) {
        const ng = c + l.cost;
        if (ng < (g.get(l.to) ?? Infinity)) { g.set(l.to, ng); came.set(l.to, cur); open.push(ng, l.to); }
      }
    }
    return null;
  }
  nearest(x, y, z, maxD = 2.5) {
    const i0 = Math.floor((x - this.bx0) / CELL), j0 = Math.floor((z - this.bz0) / CELL), R = Math.ceil(maxD / CELL);
    let best = null, bd = maxD * maxD;
    for (let di = -R; di <= R; di++) for (let dj = -R; dj <= R; dj++) {
      for (const n of this.cols.get(this.key(i0 + di, j0 + dj)) || []) {
        const dy = (n.y - y) * 3, d = (n.x - x) ** 2 + (n.z - z) ** 2 + dy * dy;
        if (d < bd && n.y <= y + .5) { bd = d; best = n; }
      }
    }
    return best;
  }
  path(a, b, noLadders = false, maxIter = 12000) {
    if (!a || !b) return null; if (a === b) return [a.id];
    const N = this.nodes, g = new Map([[a.id, 0]]), came = new Map(), open = new Heap(), closed = new Set();
    const h = (n) => Math.hypot(n.x - b.x, n.z - b.z) / CELL + Math.abs(n.y - b.y) * 2;
    open.push(h(a), a.id);
    let it = 0;
    while (open.size && it++ < maxIter) {
      const [, cur] = open.pop();
      if (closed.has(cur)) continue; closed.add(cur);
      if (cur === b.id) {
        const out = [cur]; let c = cur; while (came.has(c)) { c = came.get(c); out.push(c); } return out.reverse();
      }
      const gc = g.get(cur);
      for (const l of N[cur].links) {
        if ((noLadders && l.ladder) || l.drop || l.ride || l.dropEnd || N[l.to].conv) continue;
        const ng = gc + l.cost;
        if (ng < (g.get(l.to) ?? Infinity)) { g.set(l.to, ng); came.set(l.to, cur); open.push(ng + h(N[l.to]), l.to); }
      }
    }
    return null;
  }
  linkBetween(a, b) { return this.nodes[a].links.find(l => l.to === b); }
  randomNear(n, R = 10) {
    for (let k = 0; k < 20; k++) { const m = pick(this.nodes); if (!m.conv && Math.hypot(m.x - n.x, m.z - n.z) < R && Math.abs(m.y - n.y) < 4.5) return m; }
    return n;
  }
}

const KINDS = {
  vandal: { walk: 2.7, chase: 4.25, see: 11, stomp: true, ladders: true, r: .32, h: 1.75 },
  inspector: { walk: 2.0, chase: 3.15, see: 13, stomp: false, ladders: true, r: .34, h: 1.75 },
  dog: { walk: 2.6, chase: 5.7, see: 12, stomp: true, ladders: false, r: .35, h: .9 },
};

export class Enemy {
  constructor(d, game) {
    this.kind = d.kind; this.K = KINDS[d.kind]; this.game = game; this.spawn = { x: d.x, y: d.y, z: d.z };
    this.rig = d.kind === 'dog' ? new Dog() : new Puppet(d.kind);
    this.root = this.rig.root;
    this.body = { x: d.x, y: d.y, z: d.z, vx: 0, vy: 0, vz: 0, r: this.K.r, h: this.K.h, onGround: false, ground: null };
    this.reset();
  }
  reset() {
    Object.assign(this.body, this.spawn, { vx: 0, vy: 0, vz: 0, onGround: false, ground: null });
    this.state = 'patrol'; this.path = null; this.pi = 0; this.think = rr(0, .4); this.ko = 0; this.koFly = false; this.yaw = rr(0, 6); this.ladder = null;
    this.grace = 4; this.goal = null; this.stuckT = 0; this.lastPos = { x: this.body.x, z: this.body.z }; this.yankT = 0; this.yankSock = null; this.voiceCd = rr(2, 6); this.hitCd = 0;
    this.root.position.set(this.body.x, this.body.y, this.body.z);
  }
  speed() { return (this.state === 'chase' ? this.K.chase : this.K.walk) * this.game.diff.speed; }
  update(dt) {
    const g = this.game, b = this.body, nav = g.level.nav, p = g.player, pb = p.body;
    this.voiceCd -= dt; this.hitCd -= dt; this.grace -= dt;
    if (g.frozen) return;
    if (this.ko > 0) {
      // knocked out: slide to a stop, lie there, then get up groggy
      this.ko -= dt;
      const fr = b.onGround ? Math.exp(-7 * dt) : 1; b.vx *= fr; b.vz *= fr;
      b.vy -= GRAVITY * dt; moveBody(g.world, b, dt);
      if (b.onGround && this.koFly) { this.koFly = false; g.fx.dust(this.root.position, 10); g.audio.play('land', { pos: this.root.position, vol: .7, rate: .8 }); }
      if (b.y < g.level.killY) { this.reset(); this.grace = 3; return; }
      if (this.ko <= 0) { this.state = 'patrol'; this.grace = 1.2; this.think = .3; this.path = null; }
      return;
    }
    if (this.state === 'climb') { this.updateClimb(dt); return; }
    if (this.state === 'yank') {
      this.yankT -= dt; b.vx = b.vz = 0;
      const s = this.yankSock;
      if (!s || s.state !== 'placed') { this.state = 'patrol'; }
      else if (this.yankT <= 0) {
        g.objects.unplace(s); g.audio.play('yank', { pos: s.center, vol: 1 }); g.audio.voice('vd_laugh', .9, s.center);
        g.toast('GIRDER STOLEN!'); g.caption('The vandal yanked out a loose girder!');
        this.state = 'patrol'; this.think = 1.5;
      }
      b.vy -= GRAVITY * dt; moveBody(g.world, b, dt);
      return;
    }
    // ---- decide
    this.think -= dt;
    if (this.think <= 0) {
      this.think = .45 + Math.random() * .2;
      const me = nav.nearest(b.x, b.y + .2, b.z, 1.5);
      const dx = pb.x - b.x, dy = pb.y - b.y, dz = pb.z - b.z, d = Math.hypot(dx, dz);
      let goal = null, chase = false;
      // vandal prefers loose girders
      if (this.kind === 'vandal') {
        let best = null, bd = 30;
        for (const s of g.objects.sockets) if (s.state === 'placed' && s.anim >= 1) { const dd = Math.hypot(s.center.x - b.x, s.center.z - b.z) + Math.abs(s.center.y - b.y) * 2; if (dd < bd) { bd = dd; best = s; } }
        if (best && !(d < 4 && Math.abs(dy) < 1.5)) {
          goal = nav.nearest(best.center.x, best.center.y + .2, best.center.z + (best.d.axis === 'x' ? 1.2 : 0), 2.2) || nav.nearest(best.center.x, best.center.y + .2, best.center.z, 2.5);
          this.yankSock = best;
          if (Math.hypot(best.center.x - b.x, best.center.z - b.z) < 2.6 && Math.abs(best.center.y - b.y) < .8 && g.objects.socketDist(best, this) < 1.6) {
            this.state = 'yank'; this.yankT = 1.7; this.yaw = Math.atan2(best.center.x - b.x, best.center.z - b.z); return;
          }
        }
      }
      if (!goal && !p.dead && this.grace <= 0 && p.invuln <= 0 && (d < this.K.see && Math.abs(dy) < 4.5)) {
        goal = nav.nearest(pb.x, pb.y + .2, pb.z, 2); chase = !!goal;
        if (chase && this.state !== 'chase' && this.voiceCd < 0 && d < 9) {
          this.voiceCd = 14; g.audio.voice(this.kind === 'vandal' ? 'vd_taunt' : this.kind === 'inspector' ? 'in_halt' : 'dog_bark', .85, this.root.position);
        }
      }
      this.state = chase ? 'chase' : 'patrol';
      if (!goal) {
        if (!this.goal || !this.path || this.pi >= this.path.length) this.goal = me ? nav.randomNear(me, 12) : null;
        goal = this.goal;
      }
      if (me && goal) {
        const path = nav.path(me, goal, !this.K.ladders);
        if (path) { this.path = path; this.pi = path.length > 1 ? 1 : 0; this.goalNode = goal; }
        else if (!chase) this.goal = null;
      }
      // stuck?
      const moved = Math.hypot(b.x - this.lastPos.x, b.z - this.lastPos.z);
      this.stuckT = moved < .05 && this.path ? this.stuckT + .5 : 0;
      this.lastPos.x = b.x; this.lastPos.z = b.z;
      if (this.stuckT > 2.5 && me) { b.x = me.x; b.z = me.z; b.y = me.y; this.stuckT = 0; this.goal = null; }
    }
    // ---- follow path
    let tx = b.x, tz = b.z, want = 0;
    if (this.path && this.pi < this.path.length) {
      const n = nav.nodes[this.path[this.pi]];
      const prev = this.pi > 0 ? this.path[this.pi - 1] : null;
      const link = prev != null ? nav.linkBetween(prev, n.id) : null;
      if (link && link.ladder) {
        const L = link.ladder;
        if (link.up) { // walk to ladder foot, then climb
          const fx = L.x + L.fx * .45, fz = L.z + L.fz * .45;
          if (Math.hypot(b.x - fx, b.z - fz) < .35) { this.startClimb(L, true, n); return; }
          tx = fx; tz = fz; want = 1;
        } else {
          const fx = L.x - L.fx * .6, fz = L.z - L.fz * .6;
          if (Math.hypot(b.x - fx, b.z - fz) < .35) { this.startClimb(L, false, n); return; }
          tx = fx; tz = fz; want = 1;
        }
      } else {
        tx = n.x; tz = n.z; want = 1;
        if (Math.hypot(b.x - n.x, b.z - n.z) < .4) this.pi++;
      }
    }
    // chase directly when close on the same level
    if (this.state === 'chase' && !p.dead && Math.abs(pb.y - b.y) < .6 && Math.hypot(pb.x - b.x, pb.z - b.z) < 2.5) { tx = pb.x; tz = pb.z; want = 1; }
    const dx = tx - b.x, dz = tz - b.z, dl = Math.hypot(dx, dz) || 1;
    const sp = want ? this.speed() : 0;
    let vx = dx / dl * sp, vz = dz / dl * sp;
    // don't walk off edges
    if (b.onGround && sp > 0) {
      const ax = b.x + vx * .25, az = b.z + vz * .25, gnd = g.world.groundBelow(ax, az, b.y + .3, .05);
      if (!gnd || b.y - gnd.y1 > .5) { vx = 0; vz = 0; this.think = Math.min(this.think, .1); this.goal = null; }
    }
    const f = 1 - Math.exp(-10 * dt);
    b.vx += (vx - b.vx) * f; b.vz += (vz - b.vz) * f;
    b.vy -= GRAVITY * dt;
    moveBody(g.world, b, dt);
    if (b.y < g.level.killY) this.reset();
    if (Math.hypot(b.vx, b.vz) > .3) this.yaw = angleDamp(this.yaw, Math.atan2(b.vx, b.vz), 10, dt);
    this.contact();
  }
  startClimb(L, up, target) {
    const b = this.body; this.state = 'climb'; this.ladder = L; this.climbUp = up; this.climbTarget = target; this.climbPh = 0;
    b.x = L.x + L.fx * .42; b.z = L.z + L.fz * .42; if (!up) b.y = L.y1 - .3; b.vx = b.vz = b.vy = 0;
    this.yaw = Math.atan2(-L.fx, -L.fz);
  }
  updateClimb(dt) {
    const b = this.body, L = this.ladder, sp = 2.3 * this.game.diff.speed;
    b.y += (this.climbUp ? 1 : -1) * sp * dt; this.climbPh += dt * 7;
    if (this.climbUp && b.y >= L.y1) { b.y = L.y1; b.x = L.x - L.fx * .8; b.z = L.z - L.fz * .8; this.endClimb(); }
    else if (!this.climbUp && b.y <= L.y0) { b.y = L.y0; this.endClimb(); }
    this.contact();
  }
  // Hammer or stomp: fly back along (dx, dz), lie out cold. Returns true if the enemy was standing.
  knockOut(dx, dz, power) {
    const b = this.body, wasUp = this.ko <= 0;
    this.ko = (this.kind === 'inspector' ? 6.5 : 8) / this.game.diff.speed;
    this.state = 'ko'; this.ladder = null; this.yankSock = null; this.path = null; this.goal = null;
    b.vx = dx * power; b.vz = dz * power; b.vy = Math.max(b.vy, 2 + power * .45); b.onGround = false; b.ground = null; this.koFly = true;
    this.yaw = Math.atan2(-dx, -dz);
    return wasUp;
  }
  endClimb() { this.state = 'patrol'; this.ladder = null; this.think = 0; const p = this.path; if (p) this.pi = Math.min(this.pi + 1, p.length); }
  contact() {
    const g = this.game, p = g.player, pb = p.body, b = this.body;
    if (p.dead || this.ko > 0) return;
    const dx = pb.x - b.x, dz = pb.z - b.z, d = Math.hypot(dx, dz), dy = pb.y - b.y;
    if (d > b.r + pb.r + .08 || dy > b.h + .3 || dy < -pb.h + .2) return;
    // stomp from above
    if (pb.vy < -1 && dy > b.h * .55) {
      if (this.K.stomp) {
        pb.vy = 11; p.airMax = pb.y;
        g.knockOut(this, -dx / (d || 1), -dz / (d || 1), 'stomp');
      } else { pb.vy = 9; pb.vx = dx / (d || 1) * 4; pb.vz = dz / (d || 1) * 4; p.airMax = pb.y; g.audio.play('stomp', { vol: .7, rate: 1.3 }); }
      return;
    }
    if (this.hitCd > 0) return;
    this.hitCd = 1;
    if (this.kind === 'inspector') g.audio.voice('in_cite', 1, this.root.position);
    g.hitPlayer(this.kind, { push: new THREE.Vector3(dx / (d || 1) * 7, 6, dz / (d || 1) * 7) });
  }
  animate(dt) {
    const b = this.body;
    this.root.position.set(b.x, b.y, b.z); this.root.rotation.y = this.yaw;
    const frozen = this.game.frozen;
    let mode = 'idle';
    if (this.ko > .9) mode = 'ko';
    else if (this.ko > 0) mode = 'hurt';
    else if (this.state === 'climb') mode = 'climb';
    else if (this.state === 'yank') mode = 'yank';
    else if (Math.hypot(b.vx, b.vz) > .2) mode = 'walk';
    this.rig.update(frozen ? 0 : dt, { mode, speed: Math.hypot(b.vx, b.vz) / 5, vy: b.vy, climbPhase: this.climbPh || 0, cadence: this.kind === 'inspector' ? .8 : 1 });
  }
}
