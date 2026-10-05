import * as THREE from 'three';
import { clamp, lerp, smooth } from '../core/ease.js';
import { groundHeight } from './bounds.js';

// Cameras for the interactive modes.
//   ChaseCam   third-person flight camera: the view yaw/pitch is the pilot's
//              look; the bee turns to fly where you look, and left/right
//              input turns both. Left alone, the view swings round to the
//              direction of travel. Lags slightly
//              behind the bee for momentum, widens with speed, never sits
//              inside a solid (a spring arm against the collision world).
//   FollowCam  cinematic auto-camera for follow mode: picks framings from
//              what APX-9 is doing (tracking beside it and craning up out of
//              the beds when it weaves low, wider shots over the canopy, low
//              angles up at the lanterns by night); every move is on
//              critically damped springs (velocity never jumps), framings
//              blend round the bee in angle, distance and height, and every
//              12–24 s it flies along a raised curve to a creature nearby
//              for a few seconds (with a caption) and back (a soft dip to
//              black only where no clear path exists); keeps out of flower
//              heads, can be orbited and zoomed and drifts back to its framing.
//   PhotoCam   free camera for photo mode.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const damp = (rate, dt) => 1 - Math.exp(-rate * dt);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function lookDir(yaw, pitch, target = V()) {
  return target.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
}

export class ChaseCam {
  constructor(bounds) {
    this.bounds = bounds;
    this.yaw = 0;
    this.pitch = -0.12;
    this.dist = 7.5;
    this.zoom = 1;
    this.pos = V();
    this.target = V();
    this.anchor = V();
    this.fov = 52;
    this.roll = 0;
    this.ready = false;
  }

  reset(actor, yaw = actor.yaw, pitch = -0.12) {
    this.yaw = yaw;
    this.pitch = pitch;
    this.anchor.copy(actor.pos);
    this.ready = false;
    this.lookIdle = 0;
  }

  update(dt, actor, input, reduced) {
    if (input) {
      this.yaw -= input.look.dx;
      this.pitch = clamp(this.pitch - input.look.dy, -1.2, 1.15);
      this.zoom = clamp(this.zoom / input.zoom, 0.45, 3.2);
      this.lookIdle = Math.abs(input.look.dx) + Math.abs(input.look.dy) > 1e-4 ? 0 : (this.lookIdle ?? 0) + dt;
    }
    const sp = actor.speed;
    // when nobody is steering the view, swing it round to the way the bee is
    // actually travelling (sliding along glass, drifting on momentum), so the
    // camera always looks where you're going. Flying backwards doesn't flip it.
    const hv = Math.hypot(actor.vel.x, actor.vel.z);
    if (input && hv > 5 && this.lookIdle > 0.35 && actor.state === 'fly') {
      const off = wrap(Math.atan2(actor.vel.x, actor.vel.z) - this.yaw);
      if (Math.abs(off) < 1.9) this.yaw += off * damp((reduced ? 0.8 : 1.6) * clamp((hv - 5) / 12), dt);
    }
    // the anchor trails the bee a little: speed reads as motion, not a lock-on
    this.anchor.lerp(actor.pos, damp(reduced ? 6 : 9, dt));
    const dir = lookDir(this.yaw, this.pitch, V());
    const dist = (this.dist + clamp(sp / 64, 0, 1) * 3.5) * this.zoom;
    const pivot = this.anchor.clone().add(V(0, 0.9, 0));
    const want = pivot.clone().addScaledVector(dir, -dist).add(V(0, 0.9 * this.zoom, 0));
    const safe = this.bounds.sweep(pivot, want, 0.75);
    this.bounds.pushOut(safe, 0.6);
    // the spring arm: its length shortens quickly but smoothly when something
    // comes between camera and bee, holds a moment (so a run of stems doesn't
    // pump it in and out), then eases back out; the camera trails its ideal
    // spot for momentum and is never further out than the arm
    const L = (this.armWant = safe.distanceTo(pivot));
    if (!this.ready) { this.pos.copy(safe); this.arm = L; this.hold = 0; this.ready = true; }
    const blocked = L < want.distanceTo(pivot) - 0.05;
    if (blocked && L < this.arm) { this.arm += (L - this.arm) * damp(reduced ? 9 : 13, dt); this.hold = 0.4; }
    else if ((this.hold -= dt) <= 0 || L < this.arm) this.arm += (L - this.arm) * damp(2.5, dt);
    const off = want.clone().sub(pivot);
    const ideal = pivot.clone().addScaledVector(off, Math.min(1, this.arm / Math.max(off.length(), 1e-4)));
    this.pos.lerp(ideal, damp(7, dt));
    off.subVectors(this.pos, pivot);
    if (off.length() > this.arm) this.pos.copy(pivot).addScaledVector(off, this.arm / off.length());
    this.target.copy(pivot).addScaledVector(dir, 4.0);
    const fovT = 52 + (reduced ? 0 : clamp((sp - 20) / 44, 0, 1) * 12 * actor.boostK + clamp(sp / 30, 0, 1) * 2);
    this.fov += (fovT - this.fov) * damp(3, dt);
    this.roll += ((reduced ? 0 : -actor.bank * 0.22) - this.roll) * damp(4, dt);
    return { pos: this.pos, target: this.target, fov: this.fov, roll: this.roll, focus: this.pos.distanceTo(actor.pos), aperture: 1.6 };
  }
}

// ---------------------------------------------------------------------------
// Follow's framings, relative to the bee's heading: side angle (rad, 0 =
// behind), distance, height (h1/rise: the height climbs to h1 over `rise` s)
const FRAMINGS = {
  chase: { a: 0.55, d: 10, h: 2.6, fov: 44, ap: 2.0 },
  profile: { a: 1.5, d: 9, h: 1.2, fov: 40, ap: 3.0 },
  high: { a: 0.9, d: 18, h: 11, fov: 46, ap: 1.0 },
  lead: { a: 2.6, d: 11, h: 1.8, fov: 42, ap: 2.5 },
  low: { a: 0.3, d: 8, h: -2.2, fov: 44, ap: 2.2 },
  macro: { a: 1.1, d: 6.2, h: 2.6, fov: 38, ap: 4.5, orbit: 0.16 },
  wide: { a: 0.7, d: 34, h: 16, fov: 48, ap: 0.6 },
  // level beside it and close: stems and leaves slide past between
  track: { a: 1.62, d: 7, h: 0.4, fov: 38, ap: 3.4 },
  // below and behind, looking up past it (lanterns and the vault by night)
  lowup: { a: 0.45, d: 10, h: -4.5, fov: 48, ap: 1.4 },
  // starts level in the beds and rises up out of them
  crane: { a: 0.75, d: 12, h: 0.5, h1: 13, rise: 6, fov: 44, ap: 1.8 },
};
// which framings suit what APX-9 is doing (weights; night adds the low angles)
const MENUS = {
  low: { track: 3, profile: 2, lead: 1.5, low: 1.5, crane: 1.5, chase: 1.5 },
  high: { chase: 2, high: 1.5, wide: 1.2, profile: 1, lead: 1 },
  fast: { chase: 2, high: 1.5, wide: 2, profile: 1 },
};

// Cutaways to the garden's wildlife, the way the film shows its creatures:
// distance and elevation in units of the creature's own size, lens, aperture,
// how long to hold, a slow orbit, and a caption for the status line.
const CUTS = {
  forager: { d: 4.6, el: 0.7, fov: 32, ap: 4.6, hold: [4, 5.5], orbit: 0.07, caption: (o) => (o.sp === 'carpenter' ? 'A carpenter bee works a bloom' : 'A honeybee gathers pollen') },
  crawler: { d: 5.6, el: 0.12, fov: 32, ap: 4.8, hold: [4.5, 6], orbit: 0.05, caption: (o) => (o.kind === 'ladybird' ? 'A ladybird climbs a flower stem' : 'A jewel beetle climbs a flower stem') },
  butterfly: { d: 4, el: 0.9, fov: 34, ap: 4, hold: [4, 5.5], orbit: 0.06, caption: (o) => (o.c.species === 'swallowtail' ? 'A swallowtail rests on a bloom' : 'A monarch opens its wings on a bloom') },
  hummingbird: { d: 3.4, el: 0.14, fov: 34, ap: 4, hold: [3.5, 4.5], orbit: 0.05, caption: () => 'A hummingbird sips from a bloom' },
  dragonfly: { d: 3.2, el: 0.22, fov: 34, ap: 3.5, hold: [3, 4], orbit: 0.04, caption: () => 'A dragonfly hovers over the beds' },
  songbird: { d: 3.4, el: 0.08, fov: 32, ap: 4, hold: [4, 5], orbit: 0.03, caption: () => 'The songbird sings on its copper bough' },
};

// critically damped spring (as Unity's SmoothDamp): follows a moving target
// with continuous velocity, so moves ease in and out instead of snapping
function spring(cur, target, st, smoothTime, dt) {
  const omega = 2 / Math.max(1e-3, smoothTime), x = omega * dt;
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - target;
  const temp = (st.v + omega * change) * dt;
  st.v = (st.v - omega * temp) * e;
  return target + (change + temp) * e;
}
function spring3(cur, target, vel, smoothTime, dt) {
  const st = { v: 0 };
  for (const k of ['x', 'y', 'z']) { st.v = vel[k]; cur[k] = spring(cur[k], target[k], st, smoothTime, dt); vel[k] = st.v; }
  return cur;
}
const smoother = (k) => k * k * k * (k * (k * 6 - 15) + 10);
const bez = (a, c, b, k, out = V()) => out.copy(a).multiplyScalar((1 - k) * (1 - k)).addScaledVector(c, 2 * (1 - k) * k).addScaledVector(b, k * k);

export class FollowCam {
  constructor(bounds) {
    this.bounds = bounds;
    this.pos = V(0, 30, 60);
    this.target = V(0, 30, 0);
    this.fov = 44;
    this.aperture = 2;
    this.user = { yaw: 0, pitch: 0, zoom: 1, idle: 99 };
    this.shot = 'chase';
    this.shotT = 0;
    this.side = 1;
    this.orbitA = 0;
    this.ready = false;
    this.headingS = 0;
    this.rng = 1;
    // the framing, eased: angle round the bee, distance, height, lens, aperture
    this.par = { a: 0.55, d: 10, h: 2.6, fov: 44, ap: 2 };
    this.parV = { a: { v: 0 }, d: { v: 0 }, h: { v: 0 }, fov: { v: 0 }, ap: { v: 0 } };
    this.off = V(); // camera offset from the bee, eased
    this.offV = V();
    this.tgtV = V();
    this.blend = 0.9; // how long a change of framing takes to settle (s, spring time)
    this.cut = null; // a cutaway to a creature (see CUTS)
    this.nextCut = 9;
    this.recentKinds = [];
    this.cuts = 0;
    this.fade = 0; // dip to black (only when a cutaway can't fly there)
  }

  _rand() { this.rng = (this.rng * 16807) % 2147483647; return this.rng / 2147483647; }

  reset(actor) {
    this.ready = false;
    this.headingS = actor.yaw;
    this.user = { yaw: 0, pitch: 0, zoom: 1, idle: 99 };
    this.cut = null;
    this.fade = 0;
  }

  _pick(menu) {
    let tot = 0;
    for (const k in menu) tot += menu[k];
    let r = this._rand() * tot;
    for (const k in menu) if ((r -= menu[k]) <= 0) return k;
    return 'chase';
  }

  choose(actor, ctx) {
    const s = actor.state;
    let next = this.shot;
    if (s === 'landed' || s === 'landing') next = 'macro';
    else if (s === 'docking' || s === 'walk-in' || s === 'inside' || s === 'walk-out') next = 'skep';
    else if (this.shotT > 7 + this._rand() * 5 || this.shot === 'macro' || this.shot === 'skep') {
      const low = ctx.weaving || actor.pos.y - groundHeight(actor.pos.x, actor.pos.z) < 22;
      const menu = { ...(actor.speed > 32 ? MENUS.fast : low ? MENUS.low : MENUS.high) };
      const night = ctx.night ?? 0;
      menu.lowup = (menu.lowup || 0) + 0.3 + night * 2.5;
      if (night > 0.5) { menu.low = (menu.low || 0) + 1; menu.wide = (menu.wide || 0) * 0.5; }
      if (ctx.reduced) { delete menu.crane; delete menu.track; }
      delete menu[this.shot];
      next = this._pick(menu);
      // keep to the same side of the bee unless the new framing is close to
      // the old one, so the camera arcs a little rather than swinging across
      const a = FRAMINGS[this.shot] || FRAMINGS.chase, b = FRAMINGS[next];
      if (Math.abs(a.a - b.a) < 0.7 && this._rand() < 0.4) this.side = -this.side;
      // a bigger change of framing takes longer to settle
      this.blend = 0.7 + Math.min(0.9, Math.abs(a.a - b.a) * 0.35 + Math.abs(Math.log(b.d / a.d)) * 0.5 + Math.abs(a.h - b.h) * 0.03);
    }
    if (next !== this.shot) { this.shot = next; this.shotT = 0; if (next === 'macro' || next === 'skep') this.blend = 1.1; }
  }

  // ---- cutaways ------------------------------------------------------------------
  // a creature near the bee, worth a few seconds; and a clear view of it
  _maybeCut(dt, actor, ctx) {
    this.nextCut -= dt;
    const amb = ctx.ambient;
    if (this.nextCut > 0 || !amb || ctx.reduced || this.user.idle < 4) return;
    // only while APX-9 is crossing the house, with time to spare before it
    // arrives (never on its landings or at the skep)
    if (actor.state !== 'fly' || (ctx.goalDist ?? 0) < 30 + Math.max(actor.speed, 12) * 8) return;
    // (the creatures keep to their own patches, so the camera goes to them:
    // anything within a short flight)
    const cands = amb.features(actor.pos, 160);
    cands.sort((p, q) => this._score(q, actor) - this._score(p, actor));
    for (const c of cands.slice(0, 4)) {
      const plan = this._frame(c, amb, ctx.nearfield);
      if (!plan) continue;
      const spec = CUTS[c.kind];
      const hold = spec.hold[0] + this._rand() * (spec.hold[1] - spec.hold[0]);
      const dest = c.pos.clone().add(plan.off);
      // fly there along a raised curve if it is clear; otherwise a soft dip
      const route = this._route(this.pos, dest);
      const travel = route ? this._travel(this.pos, dest, this.target, c.pos) : 0.8;
      this.cut = { ...plan, c, spec, t: 0, hold, blocked: 0, caption: spec.caption(c.obj), phase: 'in', k: 0, travel, lift: route?.lift ?? 0, dip: !route, from: this.pos.clone(), fromT: this.target.clone(), fromFov: this.fov, fromAp: this.aperture };
      amb.hold(c.obj, hold + travel * 2 + 1);
      this.recentKinds.push(c.kind);
      if (this.recentKinds.length > 3) this.recentKinds.shift();
      this.cuts++;
      return;
    }
    this.nextCut = 3; // nothing to show just now: look again shortly
  }

  // how long a flight takes: by the distance, and long enough that the
  // look never turns faster than ~110°/s
  _travel(a, b, ta, tb) {
    const da = ta.clone().sub(a).normalize(), db = tb.clone().sub(b).normalize();
    const turn = Math.acos(clamp(da.dot(db), -1, 1));
    return clamp(Math.max(a.distanceTo(b) / 34, (turn / 1.9) * 1.875), 1.4, 4.0);
  }

  // a raised curve from a to b clear of solids: { lift } or null
  _route(a, b) {
    const d = a.distanceTo(b);
    if (d > 240) return null;
    const p = V(), c = V();
    // (an arc that clears the leaves: its middle at least ~20 over the soil)
    const mid = a.clone().lerp(b, 0.5);
    const over = Math.max(0, 2 * (groundHeight(mid.x, mid.z) + 20 - mid.y));
    for (const lift of [Math.max(over, Math.min(60, 0.22 * d + 3)), Math.max(over, Math.min(110, 0.45 * d + 6))]) {
      c.copy(a).lerp(b, 0.5).y += lift;
      let ok = true;
      // (the ends sit close to stems and leaves by design: only the open stretch counts)
      for (let i = 2; i < 15 && ok; i++) { bez(a, c, b, i / 16, p); if (this.bounds.clearance(p) < 0.5) ok = false; }
      if (ok) return { lift };
    }
    return null;
  }

  _score(c, actor) {
    const variety = this.recentKinds.includes(c.kind) ? -2 : 0;
    const interest = { forager: 2.2, crawler: 2.0, butterfly: 2.2, hummingbird: 2.6, dragonfly: 1.2, songbird: 1.6 }[c.kind] || 1;
    return interest + variety - c.pos.distanceTo(actor.pos) / 110 + this._rand() * 0.6;
  }

  // a camera spot round the creature with a clear line to it, or null
  _frame(c, amb, nf) {
    const spec = CUTS[c.kind];
    const S = c.size;
    const subj = c.pos.clone();
    const baseYaw = Math.atan2(c.face.x, c.face.z);
    const side = this._rand() < 0.5 ? -1 : 1;
    const tries = [0.9, 1.3, 0.5, 1.7, 0.2, 2.2, 2.7, 3.1];
    for (const k of tries) {
      const yaw = baseYaw + side * k * (c.kind === 'crawler' ? 0.6 : 1);
      // (bloom-sitters: a little steeper on each try, to clear the rim)
      const el = spec.el + (c.kind === 'crawler' ? 0 : this._rand() * 0.15) + (c.kind === 'forager' || c.kind === 'butterfly' ? tries.indexOf(k) * 0.05 : 0);
      const d = spec.d * S;
      const off = V(Math.sin(yaw) * Math.cos(el), Math.sin(el), Math.cos(yaw) * Math.cos(el)).multiplyScalar(d);
      const cam = subj.clone().add(off);
      if (cam.y < groundHeight(cam.x, cam.z) + 1.2) continue;
      if (this.bounds.clearance(cam) < 0.9) continue;
      const seen = this.bounds.sweep(subj, cam, 0.35);
      if (seen.distanceTo(subj) < d * 0.94) continue;
      if (amb && !amb.clearOfHeads(cam, subj)) continue;
      if (nf && nf.sightBlocked(cam, subj, 3, 1.2 * S)) continue;
      if (amb && amb.petalsBlock(cam, subj, 0.6 * S)) continue;
      return { off, yaw, el, d };
    }
    return null;
  }

  // the cutaway: fly in (or dip), hold with a slow orbit, fly back to `normal`
  _cutView(dt, actor, ctx, normal) {
    const cut = this.cut;
    cut.t += dt;
    const s = actor.state;
    // back to APX-9 for its landings and the skep, when the time is up, or when the viewer takes over
    if (cut.phase === 'hold' && (cut.t > cut.hold || s === 'landing' || s === 'docking' || (ctx.goalDist ?? 99) < 25 || this.user.idle < 0.2)) {
      cut.phase = 'out'; cut.k = 0; cut.from = this.pos.clone(); cut.fromT = this.target.clone(); cut.fromFov = this.fov; cut.fromAp = this.aperture;
      if (this.user.idle < 0.2) cut.travel = 0.8;
      else { const r = this._route(this.pos, normal.pos); cut.dip = !r; cut.dipOut = !r; cut.lift = r?.lift ?? 0; cut.travel = r ? this._travel(this.pos, normal.pos, this.target, normal.target) : 0.8; }
    }
    if (cut.phase === 'in' && (s === 'landing' || s === 'docking')) { this.cut = null; this.nextCut = 12; return null; }
    const subj = cut.c.pos.clone();
    // the hold framing: a slow orbit and a gentle push in
    const hk = cut.phase === 'hold' ? cut.t / cut.hold : 0;
    const orb = cut.spec.orbit * (cut.phase === 'hold' ? cut.t : 0) * (cut.off.x >= 0 ? 1 : -1);
    let off = cut.off.clone().applyAxisAngle(UP, orb).multiplyScalar(1 - 0.08 * smooth(hk));
    // the orbit has brought something between: hold the last clear spot
    cut.leafT = (cut.leafT ?? 0) - dt;
    const leaves = (p) => { if (cut.leafT > 0) return true; cut.leafT = 0.25; return !(ctx.nearfield?.sightBlocked(p, subj, 3, 1.2 * cut.c.size) || ctx.ambient?.petalsBlock(p, subj, 0.6 * cut.c.size)); };
    const clear = (p) => this.bounds.sweep(subj, p, 0.3).distanceTo(subj) > p.distanceTo(subj) * 0.9 && (!ctx.ambient || ctx.ambient.clearOfHeads(p, subj)) && leaves(p);
    if (cut.phase === 'hold') {
      if (clear(subj.clone().add(off))) { cut.blocked = 0; cut.good = off.clone(); }
      else { off = cut.good || cut.off; if ((cut.blocked += dt) > 0.8) { cut.t = cut.hold + 1; } }
    }
    const camHold = subj.clone().add(off);
    const tgtHold = subj.clone().add(V(0, 0.15 * cut.c.size, 0));
    const spec = cut.spec;
    let pos, tgt, fov, ap;
    if (cut.phase === 'hold') {
      pos = camHold; tgt = tgtHold; fov = spec.fov; ap = spec.ap;
      this.pos.lerp(pos, damp(6, dt));
      this.target.lerp(tgt, damp(8, dt));
      this.fov = fov; this.aperture = ap;
      this.fade = Math.max(0, this.fade - dt / 0.45);
    } else {
      cut.k = Math.min(1, cut.k + dt / cut.travel);
      const into = cut.phase === 'in';
      const toPos = into ? camHold : normal.pos, toTgt = into ? tgtHold : normal.target;
      if (cut.dip) {
        // fade down, move while dark, fade up
        this.fade = cut.k < 0.5 ? smooth(cut.k * 2) : 1 - smooth((cut.k - 0.5) * 2);
        const there = cut.k >= 0.5;
        this.pos.copy(there ? toPos : cut.from);
        this.target.copy(there ? toTgt : cut.fromT);
        this.fov = there ? (into ? spec.fov : normal.fov) : cut.fromFov;
        this.aperture = there ? (into ? spec.ap : normal.aperture) : cut.fromAp;
      } else {
        const k = smoother(cut.k);
        const c = cut.from.clone().lerp(toPos, 0.5);
        c.y += cut.lift;
        bez(cut.from, c, toPos, k, this.pos);
        // the look turns with the move, over all of it
        this.target.copy(cut.fromT).lerp(toTgt, k);
        this.fov = lerp(cut.fromFov, into ? spec.fov : normal.fov, k);
        this.aperture = lerp(cut.fromAp, into ? spec.ap : normal.aperture, k);
      }
      if (cut.k >= 1) {
        if (into) { cut.phase = 'hold'; cut.t = 0; }
        else { this.cut = null; this.nextCut = 14 + this._rand() * 12; this.fade = 0; return null; }
      }
    }
    return { pos: this.pos, target: this.target, fov: this.fov, roll: 0, focus: this.pos.distanceTo(this.target), aperture: this.aperture };
  }

  // the creature the camera is showing (for the leaves' sightline, the shadows and the status line)
  get subject() { return this.cut && this.cut.phase !== 'out' && (this.cut.phase === 'hold' || this.cut.k > 0.5) ? this.cut.c.pos : null; }
  get caption() { return this.cut && this.cut.phase === 'hold' ? this.cut.caption : null; }

  update(dt, actor, input, ctx) {
    // viewer orbit / zoom, drifting back to the framing when left alone
    if (input) {
      const moved = Math.abs(input.orbit.dx) + Math.abs(input.orbit.dy) > 0.5 || Math.abs(input.zoom - 1) > 1e-3;
      this.user.yaw -= input.orbit.dx * 0.006;
      this.user.pitch = clamp(this.user.pitch + input.orbit.dy * 0.004, -0.9, 1.0);
      this.user.zoom = clamp(this.user.zoom / input.zoom, 0.35, 4);
      this.user.idle = moved ? 0 : this.user.idle + dt;
    }
    // APX-9's framing always runs (in a cutaway it is where the camera returns to)
    const normal = this._normal(dt, actor, ctx);
    if (this.cut) { const v = this._cutView(dt, actor, ctx, normal); if (v) return v; }
    else this._maybeCut(dt, actor, ctx);
    this.fade = Math.max(0, this.fade - dt / 0.45);
    this.pos.copy(normal.pos);
    this.target.copy(normal.target);
    this.fov = normal.fov;
    this.aperture = normal.aperture;
    return { pos: this.pos, target: this.target, fov: this.fov, roll: 0, focus: this.pos.distanceTo(actor.pos), aperture: this.aperture };
  }

  // APX-9's own framing, eased: the framing's angle, distance and height
  // glide on springs, the camera holds that offset from the bee, and the
  // spring arm keeps it out of solids
  _normal(dt, actor, ctx) {
    const reduced = ctx.reduced;
    this.shotT += dt;
    this.choose(actor, ctx);
    if (this.user.idle > 3.2) {
      const k = damp(0.5, dt);
      this.user.yaw *= 1 - k;
      this.user.pitch *= 1 - k;
      this.user.zoom += (1 - this.user.zoom) * k;
    }
    // the heading framings are set against: the way it travels, blending into
    // the way it faces as it slows (no switch between the two), on a spring so
    // framings never whip round with every correction
    const head = Math.atan2(actor.vel.x + Math.sin(actor.yaw) * 3, actor.vel.z + Math.cos(actor.yaw) * 3);
    if (!this.ready) { this.headingS = head; this.headV = { v: 0 }; }
    // (a wide framing swings the camera through a big arc: it turns more slowly)
    const reach = Math.hypot(this.par.d, this.par.h);
    this.headingS = spring(this.headingS, this.headingS + wrap(head - this.headingS), this.headV, (reduced ? 1.2 : 0.75) + Math.max(0, reach - 10) * 0.03, dt);
    // APX-9's position with its jolts filtered out (collision nudges, the
    // landing settle): a smoothed velocity carries the anchor, which is drawn
    // gently back to the bee, so there is no lag at a steady speed
    if (!this.ready) { (this.anchor ||= V()).copy(actor.pos); (this.aVel ||= V()).copy(actor.vel); this.aVelV = V(); }
    spring3(this.aVel, actor.vel, this.aVelV, reduced ? 0.45 : 0.28, dt);
    this.anchor.addScaledVector(this.aVel, dt).lerp(actor.pos, damp(3.5, dt));
    const bee = this.anchor;
    const P = this.par, PV = this.parV;
    const st = (reduced ? 1.5 : 1) * this.blend * (this.user.idle < 0.3 ? 0.25 : 1);
    let wantOff, tgt;
    if (this.shot === 'skep') {
      const s = ctx.skep;
      const want = s.board.clone().addScaledVector(s.out, 15).addScaledVector(s.side, 7 * this.side).add(V(0, 5.5, 0));
      tgt = s.board.clone().lerp(bee, 0.5).add(V(0, 1.6, 0));
      const ur = this.user;
      if (ur.yaw || ur.pitch || ur.zoom !== 1) {
        const off = want.clone().sub(tgt).multiplyScalar(ur.zoom).applyAxisAngle(UP, ur.yaw);
        off.y += ur.pitch * off.length() * 0.6;
        want.copy(tgt).add(off);
      }
      wantOff = want.sub(bee);
      P.fov = spring(P.fov, 38, PV.fov, st, dt);
      P.ap = spring(P.ap, 3, PV.ap, st, dt);
    } else {
      let f = FRAMINGS[this.shot];
      if (this.shot === 'macro') {
        // look down into the bloom's cup from just above its rim
        const l = actor.lastLanding && actor.state === 'landed' ? actor.lastLanding : actor.seq?.landable;
        const R = l?.cupR ?? 5;
        // far-field blooms are deep cups: look in from steeply above the rim
        const d = Math.max(f.d, R * 1.05), el = l?.kind === 'flora' ? 0.92 : 0.62;
        f = { ...f, d: d * Math.cos(el), h: d * Math.sin(el) };
      }
      if (f.orbit) this.orbitA += dt * f.orbit * (reduced ? 0.5 : 1);
      const hT = f.h1 !== undefined ? lerp(f.h, f.h1, smooth(clamp(this.shotT / f.rise))) : f.h;
      const aT = this.side * f.a + (f.orbit ? this.orbitA : 0);
      if (!this.ready) { P.a = aT; P.d = f.d; P.h = hT; P.fov = f.fov; P.ap = f.ap; for (const k in PV) PV[k].v = 0; }
      P.a = spring(P.a, aT, PV.a, st, dt);
      P.d = spring(P.d, f.d, PV.d, st, dt);
      P.h = spring(P.h, hT, PV.h, f.h1 !== undefined ? 0.4 : st, dt);
      P.fov = spring(P.fov, f.fov, PV.fov, st, dt);
      P.ap = spring(P.ap, f.ap, PV.ap, st, dt);
      const a = this.headingS + Math.PI + P.a + this.user.yaw;
      const d = Math.hypot(P.d, P.h) * this.user.zoom;
      const el = Math.atan2(P.h, P.d) + this.user.pitch;
      wantOff = V(Math.sin(a) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(a) * Math.cos(el) * d);
      // look a little ahead of a flying bee
      tgt = bee.clone().addScaledVector(this.aVel, this.shot === 'macro' ? 0 : 0.18).add(V(0, 0.5, 0));
      // (from below, aim a touch above it so the lanterns and the vault are in frame)
      if (this.shot === 'lowup') tgt.y += 2.5;
    }
    // the camera's offset from the bee eases toward the framing's
    if (!this.ready) { this.off.copy(wantOff); this.offV.set(0, 0, 0); }
    spring3(this.off, wantOff, this.offV, reduced ? 0.6 : 0.35, dt);
    const want = bee.clone().add(this.off);
    const from = bee.clone().add(V(0, 0.8, 0));
    const safe = this.bounds.sweep(from, want, 0.9);
    this.bounds.pushOut(safe, 0.7);
    // the spring arm: in smoothly when something comes between, a pause, then
    // back out at the camera's pace
    const L = safe.distanceTo(from);
    const n = this._n || (this._n = { pos: V(), target: V(), fov: 44, aperture: 2 });
    if (!this.ready) { this.arm = L; this.hold = 0; this.armV = { v: 0 }; n.target.copy(tgt); this.tgtV.set(0, 0, 0); this.ready = true; }
    // (the skep framing is a set position looking at its door: no arm, which
    // would flip as the bee walks in through the wall)
    const blocked = this.shot !== 'skep' && L < want.distanceTo(from) - 0.3;
    if (this.shot === 'skep') this.hold = 0;
    if (blocked && L < this.arm) { this.arm = spring(this.arm, L, this.armV, reduced ? 0.3 : 0.2, dt); this.hold = 0.6; }
    else if ((this.hold -= dt) <= 0 || L < this.arm) this.arm = spring(this.arm, L, this.armV, 0.9, dt);
    const off = want.clone().sub(from);
    if (this.shot === 'skep') this.arm = spring(this.arm, off.length(), this.armV, 0.6, dt);
    n.pos.copy(from).addScaledVector(off, Math.min(1, this.arm / Math.max(off.length(), 1e-4)));
    spring3(n.target, tgt, this.tgtV, reduced ? 0.4 : 0.22, dt);
    n.fov = P.fov;
    n.aperture = P.ap;
    // inside a flower head, or one in the way (petals aren't solids for the
    // arm): move on to another framing, a little quicker than usual
    this.headCheck = (this.headCheck ?? 0) - dt;
    if (ctx.ambient && this.shot !== 'macro' && this.shot !== 'skep' && this.headCheck <= 0 && this.shotT > 0.6 && !ctx.ambient.clearOfHeads(n.pos, bee, { own: false, upto: 0.75 })) {
      this.headCheck = 1.2;
      this.shotT = 99;
      this.choose(actor, ctx);
      this.blend = 0.45;
    }
    return n;
  }
}

// ---------------------------------------------------------------------------
export class PhotoCam {
  constructor(bounds) {
    this.bounds = bounds;
    this.pos = V();
    this.yaw = 0;
    this.pitch = 0;
    this.fov = 45;
    this.vel = V();
    this.aperture = 0;
    this.focus = 10;
  }
  from(view) {
    this.pos.copy(view.pos);
    const d = view.target.clone().sub(view.pos).normalize();
    this.yaw = Math.atan2(d.x, d.z);
    this.pitch = Math.asin(clamp(d.y, -1, 1));
    this.fov = view.fov;
    // (the shot's focus carries over: the subject stays sharp, the rest soft)
    this.focus = view.focus || 10;
    this.aperture = view.aperture ?? 1.6;
    this.vel.set(0, 0, 0);
  }
  update(dt, input) {
    this.yaw -= input.look.dx + input.orbit.dx * 0.005;
    this.pitch = clamp(this.pitch - input.look.dy - input.orbit.dy * 0.004, -1.45, 1.45);
    this.fov = clamp(this.fov / input.zoom, 12, 90);
    const f = lookDir(this.yaw, this.pitch, V());
    const r = V(-Math.cos(this.yaw), 0, Math.sin(this.yaw));
    const sp = input.boost ? 40 : 12;
    const want = f.multiplyScalar(input.move.y * sp).addScaledVector(r, input.move.x * sp).add(V(0, input.lift * sp * 0.7, 0));
    this.vel.lerp(want, damp(5, dt));
    this.pos.addScaledVector(this.vel, dt);
    this.bounds.pushOut(this.pos, 0.3);
    const target = this.pos.clone().add(lookDir(this.yaw, this.pitch, V()));
    return { pos: this.pos, target, fov: this.fov, roll: 0, focus: this.focus, aperture: this.aperture };
  }
}
