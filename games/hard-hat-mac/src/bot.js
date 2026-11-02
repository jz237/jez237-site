// Demo autopilot. Plans the shift's job on the nav graph and drives Mac with ordinary controls
// (stick, jump, act, hammer), so everything it does is something a player could do.
// Movement is deliberately calm: smoothed stick, string-pulled straight lines, committed
// decisions (fights, dodges, waits) and staged recovery instead of jump spam.
import { clamp } from './util.js';
import { Heap } from './enemies.js';

const HAZARD_SAY = {
  Press: 'Timing the press', Arc: 'Waiting for the arc to drop', Pipes: 'Waiting for a gap in the pipes', Vent: 'Steering clear of the steam vent',
  Wreck: 'Letting the wrecking ball swing past', Elevator: 'Keeping out from under the hoist', CraneMagnet: 'Waiting for the magnet to lift', Molten: 'Too hot to cross',
};

function sockDist(s, x, z) {
  const d = s.d, along = d.axis === 'x' ? clamp(x, d.a0, d.a1) : clamp(z, d.a0, d.a1);
  return d.axis === 'x' ? Math.hypot(x - along, z - d.c) : Math.hypot(x - d.c, z - along);
}
function carryDist(o, x, z) {
  if (o.kind === 'crate') return Math.hypot(x - o.pos.x, z - o.pos.z);
  const half = (o.kind === 'topbeam' ? 1.6 : 2) - .3, ax = o.axis === 'x', al = clamp(ax ? x - o.pos.x : z - o.pos.z, -half, half);
  return Math.hypot(x - (ax ? o.pos.x + al : o.pos.x), z - (ax ? o.pos.z : o.pos.z + al));
}

export class Bot {
  constructor(game) { this.g = game; this.reset(); }
  reset() {
    this.path = null; this.pi = 0; this.goal = null; this.replanT = 0; this.status = 'Sizing up the site';
    this.sx = 0; this.sz = 0; this.carrot = null; this.carrotT = 0;
    this.progT = 0; this.progX = 1e9; this.progY = 0; this.progZ = 0; this.stuckLv = 0; this.backup = null;
    this.blocked = new Map(); this.waitT = 0; this.actCd = 0; this.goalT = 0; this.ride = null;
    this.engage = null; this.fightCool = 0; this.dodgeT = 0; this.dodgeDir = null; this.retreat = null; this.idleT = 0; this.avoid = new Map();
  }
  say(t) { this.status = t; }
  hazards() { const L = this.g.level; return this._hz && this._hzL === L ? this._hz : (this._hzL = L, this._hz = [...L.hazards, ...L.movers].filter(h => h.danger && h.constructor.name !== 'Bolts')); }
  dangerAt(x, y, z) { for (const h of this.hazards()) if (h.danger(x, y, z)) return h; return null; }
  // ---------------- main tick ----------------
  update(dt) {
    const g = this.g, p = g.player, out = { mx: 0, my: 0, jump: false, jumpHeld: false, act: false, actHeld: false, attack: false, camX: 0, camY: 0 };
    this.actCd -= dt; this.goalT += dt; this.replanT -= dt; this.fightCool -= dt; this.dodgeT -= dt; this.atLadder = (this.atLadder || 0) - dt; this.dt = dt;
    for (const [k, t] of this.blocked) if (t < g.time) this.blocked.delete(k);
    p.grabFilter = null;
    let want = null, raw = null; // smoothed desire {x, z, m} or an immediate push {x, z}
    if (g.state !== 'play') return out;
    if (p.dead) { this.path = null; this.ride = null; this.goal = null; this.engage = null; this.sx = this.sz = 0; this.say('Shaking it off…'); return out; }
    if (p.state === 'rivet') { out.actHeld = true; this.say(`Riveting (${Math.min(4, p.rivetSock.rivets + 1)}/4)`); this.sx = this.sz = 0; return out; }
    const riding = this.ride && this.ride.phase !== 'wait';
    const r = riding ? this.doRide(dt) : this.fight(out, dt) || this.dodge() || this.brace() || (this.ride ? this.doRide(dt) : this.work(out, dt));
    if (r) { if (r.raw) raw = r; else want = r; }
    if (raw) { this.sx = raw.x; this.sz = raw.z; this.steer(out, raw.x, raw.z, 1); return out; }
    const k = 1 - Math.exp(-11 * dt), tx = want ? want.x * want.m : 0, tz = want ? want.z * want.m : 0;
    this.sx += (tx - this.sx) * k; this.sz += (tz - this.sz) * k;
    const m = Math.hypot(this.sx, this.sz);
    if (m > .04) this.steer(out, this.sx, this.sz, Math.min(1, m));
    return out;
  }
  steer(out, dx, dz, mag) {
    const l = Math.hypot(dx, dz); if (l < 1e-5) return;
    const wx = dx / l * mag, wz = dz / l * mag, y = this.g.cam.yaw;
    out.mx = wx * Math.cos(y) - wz * Math.sin(y); out.my = -wx * Math.sin(y) - wz * Math.cos(y);
  }
  dir(dx, dz, m = 1) { const l = Math.hypot(dx, dz) || 1; return { x: dx / l, z: dz / l, m }; }
  // ---------------- planning ----------------
  candidates() {
    const g = this.g, p = g.player, o = g.objects, T = g.level.objectiveType, c = [], carry = p.carry;
    if (carry) {
      if (carry.kind === 'crate' && o.hopper) {
        const h = o.hopper;
        c.push({ key: 'deliver', type: 'deliver', obj: h, label: 'Taking the crate up to the hopper', ok: n => Math.hypot(n.x - h.x, n.z - h.z) < 2.2 && Math.abs(n.y - h.y) < .5 });
      } else o.sockets.forEach((s, i) => {
        if (s.state !== 'empty' || s.locked || (carry.kind === 'topbeam') !== s.final) return;
        c.push({ key: 'place' + i, type: 'place', obj: s, label: carry.kind === 'topbeam' ? 'Carrying the topping-out beam to the crown' : `Carrying a girder to gap ${i + 1}`, ok: n => sockDist(s, n.x, n.z) < 1.7 && Math.abs(n.y - s.d.y) < .5 });
      });
    } else {
      o.sockets.forEach((s, i) => {
        if (s.state !== 'placed') return;
        c.push({ key: 'rivet' + i, type: 'rivet', obj: s, extra: -60, label: `Riveting gap ${i + 1}`, ok: n => sockDist(s, n.x, n.z) < 1.5 && n.y - s.d.y > -1 && n.y - s.d.y < .6 });
      });
      const empties = o.sockets.filter(s => s.state === 'empty' && !s.locked);
      o.carry.forEach((it, i) => {
        if (it.state !== 'rest' || it.dropIn > 0) return;
        if (T === 'crates' ? it.kind !== 'crate' : it.kind === 'crate') return;
        let extra;
        if (it.kind === 'crate') { const h = o.hopper; extra = (Math.hypot(it.pos.x - h.x, it.pos.z - h.z) + Math.abs(it.pos.y - h.y) * 2.5) * 2; }
        else {
          const targets = empties.filter(s => (it.kind === 'topbeam') === s.final); if (!targets.length) return;
          extra = Math.min(...targets.map(s => Math.hypot(it.pos.x - s.center.x, it.pos.z - s.center.z) + Math.abs(it.pos.y - s.d.y) * 2.5)) * 2;
        }
        c.push({ key: 'pick' + i, type: 'pickup', obj: it, extra, label: it.kind === 'crate' ? 'Fetching a crate' : it.kind === 'topbeam' ? 'Fetching the topping-out beam' : 'Fetching a girder',
          ok: n => carryDist(it, n.x, n.z) < 1.15 && n.y - it.pos.y > -1 && n.y - it.pos.y < .3 });
      });
    }
    o.pickups.forEach((pk, i) => {
      if (pk.taken || (pk.type === 'hardhat' && p.shield)) return;
      const lunch = pk.type === 'lunch';
      c.push({ key: 'get' + i, type: 'collect', obj: pk, extra: lunch ? 0 : 40, maxDetour: lunch ? 1e9 : 30,
        label: lunch ? 'Going for a lunchbox' : { coffee: 'Grabbing a coffee', hardhat: 'Grabbing the gold hard hat', stopwatch: 'Grabbing the stopwatch', cash: 'Grabbing the cash' }[pk.type],
        ok: n => Math.abs(n.x - pk.pos.x) < .5 && Math.abs(n.z - pk.pos.z) < .5 && Math.abs(n.y - pk.pos.y) < .6 });
    });
    // never plan to stand still (rivet, pick up, place) inside a hazard's sweep
    const zones = this.hazards().filter(h => h.zone && h.constructor.name !== 'Pipes');
    if (zones.length) for (const x of c) { const ok = x.ok; x.ok = n => ok(n) && !zones.some(h => h.zone(n.x, n.y, n.z)); }
    let out = c.filter(x => !this.blocked.has(x.key));
    if (!out.length && c.length) { this.blocked.clear(); out = c; }
    return out;
  }
  startNode() { const b = this.g.player.body; return this.g.level.nav.nearest(b.x, b.y + .3, b.z, 1.8); }
  // One Dijkstra pass that records the first node reached for every candidate goal.
  // Keeps the current goal unless something is clearly cheaper (no dithering between jobs).
  plan() {
    this.replanT = 4;
    const nav = this.g.level.nav, start = this.startNode(), cands = this.candidates();
    if (!start || !cands.length) { this.goal = null; this.path = null; return; }
    const N = nav.nodes, g = new Map([[start.id, 0]]), came = new Map(), open = new Heap(), closed = new Set(), found = new Map();
    open.push(0, start.id);
    let budget = 2500;
    while (open.size) {
      const [cost, cur] = open.pop();
      if (closed.has(cur)) continue; closed.add(cur);
      if (cost > budget) break;
      const n = N[cur];
      for (const c of cands) if (!found.has(c) && c.ok(n)) { found.set(c, { id: cur, cost }); if (found.size === cands.length) budget = cost; }
      for (const l of n.links) {
        const ng = cost + l.cost + (l.ladder && (this.avoid.get(l.ladder) || 0) > this.g.time ? 400 : 0);
        if (ng < (g.get(l.to) ?? Infinity)) { g.set(l.to, ng); came.set(l.to, cur); open.push(ng, l.to); }
      }
    }
    let best = null, bc = Infinity, cur = null, cc = Infinity;
    for (const [c, f] of found) {
      if (c.type === 'collect' && c.obj.type !== 'lunch' && f.cost > c.maxDetour) continue;
      const total = f.cost + (c.extra || 0);
      if (total < bc) { bc = total; best = { ...c, end: f.id }; }
      if (this.goal && c.key === this.goal.key) { cc = total; cur = { ...c, end: f.id }; }
    }
    if (cur && best.key !== cur.key && bc > cc * .75 - 6) { best = cur; bc = cc; }
    if (!best) { this.goal = null; this.path = null; return; }
    const path = [best.end]; let k = best.end; while (came.has(k)) { k = came.get(k); path.push(k); }
    path.reverse();
    if (!this.goal || this.goal.key !== best.key) { this.goalT = 0; this.stuckLv = 0; }
    this.goal = best; this.path = path; this.pi = path.length > 1 ? 1 : 0; this.carrot = null; this.waitT = 0;
  }
  goalDone() {
    const G = this.goal, p = this.g.player, o = G.obj;
    switch (G.type) {
      case 'pickup': return !!p.carry || o.state !== 'rest';
      case 'place': return !p.carry || o.state !== 'empty';
      case 'deliver': return !p.carry;
      case 'rivet': return o.state !== 'placed';
      default: return o.taken;
    }
  }
  atGoal() { const b = this.g.player.body; return b.onGround && this.goal.ok({ x: b.x, y: b.y, z: b.z }); }
  block(key, secs = 12) { this.blocked.set(key || (this.goal && this.goal.key), this.g.time + secs); this.goal = null; this.path = null; this.stuckLv = 0; }
  // ---------------- doing the job ----------------
  work(out, dt) {
    const p = this.g.player;
    if (p.state !== 'climb' && (!this.goal || this.goalDone() || this.replanT <= 0 || !this.path)) this.plan();
    if (!this.goal) { this.idleT += dt; this.say('Looking for the next job'); return null; }
    this.idleT = 0;
    if (p.state !== 'climb' && this.atGoal()) return this.doGoal(out);
    return this.follow(dt);
  }
  doGoal(out) {
    const g = this.g, p = g.player, G = this.goal, o = g.objects, b = p.body;
    this.say(G.label); this.progT = 0;
    if (this.goalT > 70) { this.block(); return null; }
    const toward = (x, z, m) => this.dir(x - b.x, z - b.z, m);
    switch (G.type) {
      case 'pickup': {
        const near = o.nearCarry(p); // a stack hands you its top girder, which is just as good
        if (near && (near === G.obj || near.kind === G.obj.kind)) { if (this.actCd <= 0) { out.act = true; this.actCd = .6; this.replanT = .25; } return null; }
        return toward(G.obj.pos.x, G.obj.pos.z, .3);
      }
      case 'place': case 'deliver': {
        if (o.placeTarget(p, p.carry) === G.obj) { if (this.actCd <= 0) { out.act = true; this.actCd = .7; this.replanT = .3; } return null; }
        const c = G.obj.center || G.obj; return toward(c.x, c.z, .3);
      }
      case 'rivet':
        if (o.rivetTarget(p) === G.obj && G.obj.anim >= 1) { out.actHeld = true; return null; }
        return toward(G.obj.center.x, G.obj.center.z, .3);
      default: return toward(G.obj.pos.x, G.obj.pos.z, .5);
    }
  }
  // ---------------- path following ----------------
  // a straight walk from Mac to (x,z) stays on solid footing at this height, clear of posts and rails
  clearLine(x0, z0, y, x1, z1) {
    const w = this.g.world, L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.ceil(L / .25));
    for (let i = 1; i <= n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
      const gnd = w.groundBelow(x, z, y + .35, .16); if (!gnd || y - gnd.y1 > .3) return false;
      for (const b of w.query(x - .34, z - .34, x + .34, z + .34)) {
        if (b.ghost || b.y1 <= y + .4 || b.y0 >= y + 1.6) continue;
        const cx = clamp(x, b.x0, b.x1), cz = clamp(z, b.z0, b.z1); if ((x - cx) ** 2 + (z - cz) ** 2 < .32 * .32) return false;
      }
    }
    return true;
  }
  follow(dt) {
    const g = this.g, nav = g.level.nav, p = g.player, b = p.body, path = this.path;
    if (!path || this.pi >= path.length) { this.replanT = 0; return null; }
    // staged recovery when we stop making progress
    if (this.backup) {
      const bk = this.backup; bk.t -= dt; this.say('Backing up for another try');
      if (bk.t <= 0) { this.backup = null; this.replanT = 0; return null; }
      return this.dir(bk.x - b.x, bk.z - b.z, .6);
    }
    this.progT += dt;
    if (this.progT > 1.6) {
      const moved = Math.hypot(b.x - this.progX, b.z - this.progZ) + Math.abs(b.y - this.progY);
      if (moved < .35 && p.state !== 'climb') {
        this.stuckLv++;
        if (this.stuckLv === 1) this.replanT = 0;
        else if (this.stuckLv === 2) { const q = nav.nodes[path[Math.max(0, this.pi - 3)]]; this.backup = { x: q.x, z: q.z, t: .8 }; }
        else { this.block(); return null; }
      } else if (moved > 1) this.stuckLv = 0;
      this.progT = 0; this.progX = b.x; this.progY = b.y; this.progZ = b.z;
    }
    // catch up with the path: skip nodes we've already passed, replan if we've left it
    if (p.state !== 'climb' && b.onGround) {
      let bestK = -1, bd = 2.2;
      for (let k = Math.max(0, this.pi - 2); k < Math.min(path.length, this.pi + 10); k++) {
        const m = nav.nodes[path[k]]; if (Math.abs(m.y - b.y) > .45) continue;
        const d = Math.hypot(m.x - b.x, m.z - b.z); if (d < bd) { bd = d; bestK = k; }
      }
      const cur = nav.nodes[path[this.pi]], lk = this.pi > 0 ? nav.linkBetween(path[this.pi - 1], path[this.pi]) : null;
      const midSpecial = lk && (lk.drop || lk.ladder || lk.ride) && Math.abs(nav.nodes[path[this.pi - 1]].y - b.y) < .45;
      if (bestK < 0 && !midSpecial) { this.replanT = 0; return null; }
      if (bestK >= 0 && bd < .7 && bestK + 1 > this.pi) { this.pi = Math.min(path.length - 1, bestK + 1); this.carrot = null; }
      if (bestK >= 0 && bestK === path.length - 1 && bd < .45) return this.dir(cur.x - b.x, cur.z - b.z, .3);
    }
    const n = nav.nodes[path[this.pi]], prev = this.pi > 0 ? nav.nodes[path[this.pi - 1]] : null;
    const link = prev ? nav.linkBetween(prev.id, n.id) : null;
    if (link && link.ride) { this.ride = { link, phase: 'wait', from: prev, to: n, at: this.pi, t: 0 }; return null; }
    if (link && link.ladder) return this.ladder(link, n);
    if (p.state === 'climb') return this.climbAnyway(n);
    if (link && link.drop) return this.drop(prev, n);
    // walking: aim at the furthest path node reachable in a clean straight line
    const hz = this.hazardWait(dt); if (hz !== undefined) return hz;
    this.carrotT -= dt;
    if (!this.carrot || this.carrotT <= 0) {
      this.carrotT = .15; let pick = n;
      let end = this.pi;
      for (let k = this.pi + 1; k < Math.min(path.length, this.pi + 12); k++) {
        const lk = nav.linkBetween(path[k - 1], path[k]); if (!lk || lk.ladder || lk.drop || lk.ride) break;
        if (Math.abs(nav.nodes[path[k]].y - n.y) > .2) break; end = k;
      }
      for (let k = end; k > this.pi; k--) { const m = nav.nodes[path[k]]; if (this.clearLine(b.x, b.z, b.y, m.x, m.z)) { pick = m; break; } }
      this.carrot = pick; this.carrotLast = pick === nav.nodes[path[path.length - 1]];
    }
    const t = this.carrot, d = Math.hypot(t.x - b.x, t.z - b.z);
    this.say(this.goal.label);
    return this.dir(t.x - b.x, t.z - b.z, this.carrotLast ? clamp(d / 1.1, .3, 1) : 1);
  }
  ladder(link, n) {
    const g = this.g, p = g.player, b = p.body, L = link.ladder, up = link.up;
    p.grabFilter = L; this.atLadder = .5;
    this.say(up ? 'Climbing up' : 'Climbing down');
    const fx = up ? L.x - L.fx * .8 : L.x + L.fx * .5, fz = up ? L.z - L.fz * .8 : L.z + L.fz * .5, fy = up ? L.y1 : L.y0;
    const foeAhead = e => e.ko <= 0 && ((e.state === 'climb' && e.ladder === L) || (Math.abs(e.body.y - fy) < 1.3 && Math.hypot(e.body.x - fx, e.body.z - fz) < 3.2));
    if (p.state === 'climb') {
      // somebody on the ladder or waiting at the top: climb back the way we came and deal with it there
      const back = g.enemies.some(foeAhead) && Math.abs(b.y - fy) > 1.2;
      if (back) this.say('Backing down the ladder'); else { this.ladderWait = 0; this.guard = null; }
      return { raw: true, x: (up !== back) ? -L.fx : L.fx, z: (up !== back) ? -L.fz : L.fz };
    }
    const ex = up ? L.x + L.fx * .45 : L.x - L.fx * .8, ez = up ? L.z + L.fz * .45 : L.z - L.fz * .8, d = Math.hypot(b.x - ex, b.z - ez);
    if (d > .28 && !((this.ladderWait || 0) > 0 && d < 2.6)) { this.ladderWait = 0; return this.dir(ex - b.x, ez - b.z, clamp(d / .9, .25, 1)); }
    // don't climb into trouble: an active hazard or an enemy at the far end, on the ladder, or chasing us here
    const hz = this.dangerAt(fx, fy, fz);
    const foe = g.enemies.find(foeAhead) || g.enemies.find(e => e.ko <= 0 && e.state === 'chase' && Math.hypot(e.body.x - b.x, e.body.z - b.z) + Math.abs(e.body.y - b.y) < 10);
    if (hz || foe) {
      this.ladderWait = (this.ladderWait || 0) + this.dt; this.progT = 0;
      if (this.ladderWait > 8) { this.avoid.set(L, g.time + 25); this.ladderWait = 0; this.replanT = 0; this.say('Taking another way round'); return null; }
      this.say(foe ? `Waiting for the ${foe.kind === 'dog' ? 'yard dog' : foe.kind} to come down` : HAZARD_SAY[hz.constructor.name] || 'Waiting for a safe moment');
      if (!foe) return null;
      // stand back from the foot of the ladder so whoever comes down walks into the hammer, not into Mac
      if (!this.guard || this.guard.L !== L) {
        const ox = up ? L.fx : -L.fx, oz = up ? L.fz : -L.fz, px = -oz, pz = ox;
        const spots = [[ox * 1.9, oz * 1.9], [ox * 1.4, oz * 1.4], [px * 1.7 + ox * .5, pz * 1.7 + oz * .5], [-px * 1.7 + ox * .5, -pz * 1.7 + oz * .5], [ox, oz]];
        const sp = spots.find(([dx, dz]) => this.clearLine(ex, ez, b.y, ex + dx, ez + dz));
        this.guard = { L, x: sp ? ex + sp[0] : ex, z: sp ? ez + sp[1] : ez };
      }
      const G = this.guard, gd = Math.hypot(b.x - G.x, b.z - G.z);
      if (gd > .3) return this.dir(G.x - b.x, G.z - b.z, clamp(gd / .8, .3, .9));
      return this.dir(ex - b.x, ez - b.z, .05);
    }
    return { raw: true, x: up ? -L.fx : L.fx, z: up ? -L.fz : L.fz };
  }
  climbAnyway(n) {
    // on a ladder that isn't part of the plan: just finish climbing toward the next node's height
    const p = this.g.player, L = p.ladder; if (!L) return null;
    p.grabFilter = L; const up = n.y > p.body.y;
    this.replanT = Math.min(this.replanT, .5);
    return { raw: true, x: up ? -L.fx : L.fx, z: up ? -L.fz : L.fz };
  }
  drop(prev, n) {
    const p = this.g.player, b = p.body;
    this.say('Hopping down a floor');
    if (!b.onGround) return this.dir(n.x - b.x, n.z - b.z, .7);
    if (Math.abs(b.y - n.y) < .45) { if (Math.hypot(b.x - n.x, b.z - n.z) < 1.8) { this.pi++; this.carrot = null; } else this.replanT = 0; return null; }
    const d = Math.hypot(b.x - prev.x, b.z - prev.z);
    if (d > .4 && Math.abs(b.y - prev.y) < .3) return this.dir(prev.x - b.x, prev.z - b.z, clamp(d / .9, .3, 1));
    const hz = this.dangerAt(n.x, n.y, n.z) || this.dangerAt(prev.x, prev.y, prev.z);
    if (hz && (this.dropWait = (this.dropWait || 0) + this.dt) < 8) { this.progT = 0; this.say(HAZARD_SAY[hz.constructor.name] || 'Waiting for a safe moment'); return null; }
    this.dropWait = 0;
    const ux = n.x - prev.x, uz = n.z - prev.z, ul = Math.hypot(ux, uz) || 1;
    return this.dir(n.x + ux / ul * .6 - b.x, n.z + uz / ul * .6 - b.z, .55);
  }
  // stand still before an active hazard; if we're already in one, retreat to a safe spot and commit to it
  hazardWait(dt) {
    const nav = this.g.level.nav, b = this.g.player.body, path = this.path;
    if (this.retreat) {
      this.retreat.t -= dt;
      if (this.retreat.t <= 0 && !this.dangerAt(b.x, b.y, b.z)) this.retreat = null;
      else return this.dir(this.retreat.x - b.x, this.retreat.z - b.z, Math.hypot(this.retreat.x - b.x, this.retreat.z - b.z) > .3 ? 1 : 0);
    }
    const here = this.dangerAt(b.x, b.y, b.z);
    if (here) {
      for (let k = this.pi - 1; k >= Math.max(0, this.pi - 10); k--) {
        const m = nav.nodes[path[k]]; if (Math.abs(m.y - b.y) > .5) break;
        if (!this.dangerAt(m.x, m.y, m.z) && !(here.zone && here.zone(m.x, m.y, m.z))) { this.retreat = { x: m.x, z: m.z, t: .7 }; this.say(HAZARD_SAY[here.constructor.name] || 'Backing off'); return this.dir(m.x - b.x, m.z - b.z, 1); }
      }
      return undefined;
    }
    for (let k = this.pi; k < Math.min(path.length, this.pi + 5); k++) {
      const m = nav.nodes[path[k]], h = this.dangerAt(m.x, m.y, m.z);
      if (h && h.zone && h.zone(b.x, b.y, b.z)) {
        for (let j = this.pi - 1; j >= Math.max(0, this.pi - 12); j--) {
          const q = nav.nodes[path[j]]; if (Math.abs(q.y - b.y) > .5) break;
          if (!h.zone(q.x, q.y, q.z)) { this.retreat = { x: q.x, z: q.z, t: .5 }; this.say(HAZARD_SAY[h.constructor.name] || 'Backing off'); return this.dir(q.x - b.x, q.z - b.z, 1); }
        }
      }
      if (h) {
        this.waitT += dt; this.progT = 0;
        if (this.waitT > 10) return undefined;
        this.say(HAZARD_SAY[h.constructor.name] || 'Waiting for a safe moment');
        return null;
      }
    }
    this.waitT = 0;
    return undefined;
  }
  // ---------------- reflexes (each one commits for a moment so it doesn't flicker) ----------------
  fight(out, dt) {
    const g = this.g, p = g.player, b = p.body;
    if (p.state !== 'normal' || !b.onGround || this.dangerAt(b.x, b.y, b.z)) { this.engage = null; return null; } // get out of a hazard before fighting
    let E = this.engage;
    if (E) {
      const e = E.e, d = Math.hypot(e.body.x - b.x, e.body.z - b.z);
      E.t += dt;
      if (e.ko > 0 || E.t > 3.5 || d > 5.5 || Math.abs(e.body.y - b.y) > 1.3) { this.engage = null; this.fightCool = .8; this.replanT = 0; return null; }
    } else if (this.fightCool <= 0) {
      let best = null, bd = 1e9;
      for (const e of g.enemies) {
        if (e.ko > 0 || Math.abs(e.body.y - b.y) > 1.2) continue; // includes one coming down a ladder at us
        const d = Math.hypot(e.body.x - b.x, e.body.z - b.z), coming = e.state === 'chase' || e.state === 'yank';
        if ((coming && d < (this.atLadder > 0 ? 6.5 : 3.8)) || d < 1.8 || (e.state === 'climb' && d < 2.7)) if (d < bd) { bd = d; best = e; }
      }
      if (!best) return null;
      if (p.carry && bd > 2.3) return null; // keep carrying unless it's right on top of us
      E = this.engage = { e: best, t: 0 };
    } else return null;
    const e = E.e, dx = e.body.x - b.x, dz = e.body.z - b.z, d = Math.hypot(dx, dz), name = e.kind === 'dog' ? 'yard dog' : e.kind;
    this.progT = 0;
    if (p.carry) {
      if (this.actCd <= 0 && !g.objects.placeTarget(p, p.carry)) { out.act = true; this.actCd = .6; this.say(`Putting the load down to deal with the ${name}`); }
      return this.dir(dx, dz, .1);
    }
    // swing so the strike lands as it arrives (time-to-contact, so a charging dog gets met early)
    const closing = Math.max(0, -(e.body.vx * dx + e.body.vz * dz) / (d || 1)), atStrike = d - closing * .2;
    if (atStrike < 1.7 && atStrike > .55 && p.canSwing()) out.attack = true;
    this.say(`Knocking out the ${name}!`);
    if (d > 1.6) {
      const ax = b.x + dx / d * .7, az = b.z + dz / d * .7, gnd = g.world.groundBelow(ax, az, b.y + .3, .1);
      if (gnd && b.y - gnd.y1 < .4 && !this.dangerAt(ax, b.y, az)) return this.dir(dx, dz, 1);
    }
    return this.dir(dx, dz, .2); // stand and face it
  }
  dodge() {
    const g = this.g, p = g.player, b = p.body;
    if (p.state !== 'normal') return null;
    if (this.dodgeT > 0 && this.dodgeDir) { this.say('Dodging a falling bolt'); return this.dir(this.dodgeDir.x, this.dodgeDir.z, 1); }
    const bolts = g.level.hazards.find(h => h.constructor.name === 'Bolts'); if (!bolts) return null;
    const o = bolts.nearest(b.x, b.y, b.z); if (!o) return null;
    let dx = b.x - o.x, dz = b.z - o.z; if (Math.hypot(dx, dz) < .05) { dx = Math.sin(p.yaw); dz = Math.cos(p.yaw); }
    const l = Math.hypot(dx, dz);
    for (const [ux, uz] of [[dx / l, dz / l], [-dz / l, dx / l], [dz / l, -dx / l]]) {
      if (this.clearLine(b.x, b.z, b.y, b.x + ux * 1.1, b.z + uz * 1.1)) { this.dodgeDir = { x: ux, z: uz }; this.dodgeT = .55; this.say('Dodging a falling bolt'); return this.dir(ux, uz, 1); }
    }
    return null;
  }
  brace() {
    const g = this.g, p = g.player;
    if (p.state === 'climb' || g.wind.lengthSq() < 3) return null;
    const w = g.wind; this.say('Bracing against the wind'); this.progT = 0;
    return this.dir(-w.x, -w.z, Math.min(1, w.length() * .7 / 5.4 * 1.2));
  }
  // ---------------- riding the crane magnet ----------------
  doRide(dt) {
    const g = this.g, p = g.player, b = p.body, r = this.ride, m = r.link.ride.mover, info = m.phaseInfo();
    const onPlate = b.onGround && b.ground === m.box, pc = m.plate.position;
    r.t += dt; this.progT = 0;
    if (r.t > 75 || p.state !== 'normal') { this.ride = null; this.replanT = 0; return null; }
    switch (r.phase) {
      case 'wait': {
        const d = Math.hypot(b.x - r.from.x, b.z - r.from.z);
        this.say('Waiting for the crane magnet');
        if (info.atA && info.left > 1.6 && m.box.y1 < .6) r.phase = 'board';
        return d > .35 ? this.dir(r.from.x - b.x, r.from.z - b.z, clamp(d / .9, .3, 1)) : null;
      }
      case 'board':
        this.say('Hopping onto the magnet plate');
        if (onPlate && Math.hypot(b.x - pc.x, b.z - pc.z) < .6) r.phase = 'ride';
        else if (!info.atA) r.phase = 'wait';
        return this.dir(pc.x - b.x, pc.z - b.z, 1);
      case 'ride': {
        const d = Math.hypot(b.x - pc.x, b.z - pc.z);
        this.say('Riding the crane magnet');
        if (!onPlate && b.onGround) { this.ride = null; this.replanT = 0; return null; }
        if (info.atB && info.left < 2.4) r.phase = 'alight';
        return d > .45 ? this.dir(pc.x - b.x, pc.z - b.z, .4) : null;
      }
      default: {
        this.say('Stepping off at the top');
        if (!onPlate && b.onGround && Math.hypot(b.x - r.to.x, b.z - r.to.z) < .7) { this.ride = null; this.pi = r.at + 1; this.replanT = 0; return null; }
        return this.dir(r.to.x - b.x, r.to.z - b.z, .7);
      }
    }
  }
}
