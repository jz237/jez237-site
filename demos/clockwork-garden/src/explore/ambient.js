import * as THREE from 'three';
import { Butterfly } from '../creatures/butterfly.js';
import { Dragonfly } from '../creatures/dragonfly.js';
import { Bird } from '../creatures/bird.js';
import { Bee } from '../creatures/bee.js';
import { Beetle } from '../creatures/beetle.js';
import { compactRig } from '../creatures/compact.js';
import { APX9Bee } from '../creatures/apx9.js';
import { orient } from '../creatures/manager.js';
import { RNG } from '../core/rng.js';
import { clamp, lerp, smooth } from '../core/ease.js';
import { L } from '../world/layout.js';
import { groundHeight } from './bounds.js';

// Ambient life for the interactive modes, on the real-time clock. Every
// creature has its own patch of the glasshouse (spread so the patches cover
// the whole house) and goes about its routine there; nothing seeks out or
// follows APX-9, which simply happens by them. They only react to it:
//   butterflies  flutter between blooms and settle; scatter when the bee rushes them
//   dragonflies  hover and dart over their patch; dart off when the bee comes close
//   hummingbirds sip from blooms (and the glass blossom, if it is in their patch);
//                stop and turn to look when the bee passes close, then fly off
//   foragers     honeybees and carpenter bees working the blooms: fly, settle,
//                gather, move on; one leaves its bloom when the bee lands there
//   crawlers     jewel beetles and ladybirds climbing flower stems (pausing as the
//                bee passes); at the top they open their shells and fly to another stem
//   skep bees    worker bees circle the hive; they dance after every deposit
//   songbird     sings on its copper bough, watches the bee, flies a loop if crowded
// Off-screen creatures keep moving but are not re-posed (their legs and wings
// would not be seen), and every rig is compacted (creatures/compact.js).

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const TAU = Math.PI * 2;
const damp = (r, dt) => 1 - Math.exp(-r * dt);
const CELL = 32;
const SPH = new THREE.Sphere();

// stand a crawler on a surface: forward along it, up away from it
function orientOnSurface(group, forward, up) {
  const z = forward.clone().normalize();
  const y = up.clone().addScaledVector(z, -up.dot(z)).normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

export class Ambient {
  constructor({ world, mat, quality, bounds, audio, skep }) {
    this.world = world;
    this.bounds = bounds;
    this.audio = audio;
    this.skep = skep;
    this.group = new THREE.Group();
    this.group.name = 'ambient';
    this.rng = new RNG('ambient');
    this.t = 0;
    const low = quality.tier === 'low';
    this.rigs = [];
    const add = (c) => { this.group.add(c.group); this.rigs.push(c); return c; };
    const r = this.rng;
    // blooms the butterflies like (the far-field tops; not those buried in a mass)
    this.perches = world.flora.flowers.filter((f) => !f.landing?.blocked).map((f) => ({ p: f.top.clone().add(V(0, 1.2 * f.scale + 0.4, 0)), f }));
    // (a grid of them, to find blooms near a point quickly)
    this.pgrid = new Map();
    for (const c of this.perches) {
      const k = Math.floor(c.p.x / CELL) * 4096 + Math.floor(c.p.z / CELL);
      if (!this.pgrid.has(k)) this.pgrid.set(k, []);
      this.pgrid.get(k).push(c);
    }

    // the patches: blooms spread over the house (farthest-point picks from a
    // seeded start), one per roaming creature
    const counts = low ? { b: 6, f: 3, c: 2, h: 2, d: 2 } : { b: 10, f: 5, c: 4, h: 3, d: 4 };
    const homes = this._spread(counts.b + counts.f + counts.c + counts.h + counts.d);
    let hi = 0;
    const home = () => homes[hi++ % homes.length].clone();
    this.butterflies = [];
    for (let i = 0; i < counts.b; i++) {
      const sp = i % 3 === 1 ? 'swallowtail' : 'monarch';
      const c = add(new Butterfly(mat, sp, { detail: 'mid' }));
      c.group.scale.setScalar(r.range(1.2, 1.6));
      const b = { c, home: home(), R: 65, vel: V(), state: 'perch', timer: r.range(1, 6), ph: r.range(0, TAU), freq: r.range(2.4, 3.3), yaw: r.range(0, TAU) };
      b.target = this._perchNear(b.home, 0, b.R) || this._flowerNear(b.home, 0, 200);
      b.pos = b.target.p.clone();
      this.butterflies.push(b);
    }
    this.foragers = [];
    for (let i = 0; i < counts.f; i++) {
      const sp = i % 3 === 1 ? 'carpenter' : 'honey';
      const c = add(new Bee(mat, sp, { detail: 'mid' }));
      c.group.scale.setScalar(sp === 'carpenter' ? 1.55 : 1.45);
      const fb = { c, sp, home: home(), R: 45, vel: V(), state: 'fly', timer: 0, ph: r.range(0, TAU), yaw: r.range(0, TAU) };
      fb.target = this._perchNear(fb.home, 0, fb.R) || this._flowerNear(fb.home, 0, 200);
      fb.pos = fb.target.p.clone().add(V(r.range(-6, 6), 6, r.range(-6, 6)));
      this.foragers.push(fb);
    }
    this.crawlers = [];
    for (let i = 0; i < counts.c; i++) {
      const kind = i % 2 ? 'ladybird' : 'jewel';
      const c = add(new Beetle(mat, kind));
      c.group.scale.setScalar(kind === 'ladybird' ? 1.35 : 1.45);
      this.crawlers.push({ c, kind, home: home(), R: 35, f: null, s: 0.25, ang: r.range(0, TAU), dir: 1, state: 'climb', timer: 0, walk: 0, open: 0, pos: V(), speed: kind === 'ladybird' ? 0.9 : 1.25 });
    }
    this.hummingbirds = [];
    for (let i = 0; i < counts.h; i++) {
      const c = add(new Bird(mat, 'hummingbird'));
      c.group.scale.setScalar(1.4);
      const hh = home();
      this.hummingbirds.push({ c, home: hh, R: 90, pos: hh.clone().add(V(0, 10, 0)), vel: V(), state: 'travel', timer: 0, target: null, face: V(0, 0, 1) });
    }
    this.dragonflies = [];
    for (let i = 0; i < counts.d; i++) {
      const c = add(new Dragonfly(mat, { palette: i % 2 ? 'sapphire' : 'teal' }));
      c.group.scale.setScalar(1.5);
      const hh = home().add(V(0, 8, 0));
      this.dragonflies.push({ c, home: hh, R: 40, pos: hh.clone(), from: hh.clone(), to: hh.clone(), state: 'hover', timer: r.range(0.5, 2), dart: 0, face: V(1, 0, 0) });
    }
    this.workers = [];
    const sk = world.skep.group.position;
    for (let i = 0; i < (low ? 2 : 4); i++) {
      const c = i < 2 ? add(new APX9Bee(mat, { detail: 'lod', quality })) : add(new Bee(mat, 'honey', { detail: 'mid' }));
      if (i >= 2) c.group.scale.setScalar(1.0);
      this.workers.push({ c, i, r: 7 + i * 1.8, h: 6 + i * 1.3, a: i * 1.7, speed: 0.55 + i * 0.1, apx: i < 2, c0: sk.clone() });
    }
    this.song = add(new Bird(mat, 'songbird'));
    this.songPerch = world.tree.perchWorld(0.72);
    const pt = world.tree.perchCurve.getTangentAt(0.72).applyQuaternion(world.tree.group.quaternion);
    this.songFace = V(-pt.z, 0, pt.x).normalize();
    if (this.songFace.dot(V(1, 0, 1)) < 0) this.songFace.negate();
    this.songState = { state: 'perch', timer: 0, nextSong: 3, yaw: 0, loopT: 0 };
    this.group.traverse((o) => { if (o.isMesh) o.castShadow = o.castShadow && !low; });
    for (const c of this.rigs) compactRig(c);
    this.celebrate = -100;
  }

  // n points spread over the house: farthest-point picks among the blooms
  _spread(n) {
    const P = this.perches.map((c) => c.p);
    const out = [P[Math.floor(this.rng.float() * P.length)].clone()];
    const dmin = P.map((p) => Math.hypot(p.x - out[0].x, p.z - out[0].z));
    while (out.length < n) {
      let bi = 0;
      for (let i = 1; i < P.length; i++) if (dmin[i] > dmin[bi]) bi = i;
      const q = P[bi].clone();
      out.push(q);
      for (let i = 0; i < P.length; i++) dmin[i] = Math.min(dmin[i], Math.hypot(P[i].x - q.x, P[i].z - q.z));
    }
    return out;
  }

  // a bloom within a ring round `center` (horizontal distance), optionally
  // out of the camera's view; null if there is none
  _perchNear(center, rMin, rMax, { hidden = null, seen = null } = {}) {
    const r = this.rng;
    const out = [];
    const c0 = Math.floor((center.x - rMax) / CELL), c1 = Math.floor((center.x + rMax) / CELL);
    const z0 = Math.floor((center.z - rMax) / CELL), z1 = Math.floor((center.z + rMax) / CELL);
    for (let i = c0; i <= c1; i++) for (let j = z0; j <= z1; j++) {
      for (const c of this.pgrid.get(i * 4096 + j) || []) {
        const d = Math.hypot(c.p.x - center.x, c.p.z - center.z);
        if (d < rMin || d > rMax) continue;
        if (hidden && hidden(c.p)) continue;
        out.push(c);
      }
    }
    if (!out.length) return null;
    if (seen) { const vis = out.filter((c) => seen(c.p)); if (vis.length) return vis[Math.floor(r.float() * vis.length)]; }
    return out[Math.floor(r.float() * out.length)];
  }

  _flowerNear(p, rMin, rMax) {
    const r = this.rng;
    for (let k = 0; k < 30; k++) {
      const c = this.perches[Math.floor(r.float() * this.perches.length)];
      const d = Math.hypot(c.p.x - p.x, c.p.z - p.z);
      if (d > rMin && d < rMax) return c;
    }
    return this.perches[Math.floor(r.float() * this.perches.length)];
  }

  onDeposit() { this.celebrate = this.t; }

  // creatures worth a cutaway (cameras.js FollowCam): settled, climbing,
  // sipping or hovering within maxD of p; pos is live, face the way it faces,
  // size its rough radius
  features(p, maxD) {
    const out = [];
    const ok = (o, q) => q.distanceTo(p) < maxD;
    const fwd = (g) => V(0, 0, 1).applyQuaternion(g.quaternion).setY(0);
    for (const fb of this.foragers) if (fb.state === 'sip' && fb.timer > 1.5 && ok(fb, fb.pos)) out.push({ obj: fb, kind: 'forager', pos: fb.pos, face: V(Math.sin(fb.yaw), 0, Math.cos(fb.yaw)), size: 1.15 * fb.c.group.scale.x });
    for (const cr of this.crawlers) if (cr.state === 'climb' && cr.s > 0.15 && cr.s < 0.68 && ok(cr, cr.pos)) out.push({ obj: cr, kind: 'crawler', pos: cr.pos, face: V(0, 1, 0).applyQuaternion(cr.c.group.quaternion).setY(0), size: 0.9 * cr.c.group.scale.x });
    for (const b of this.butterflies) if (b.state === 'perch' && b.timer > 1.5 && ok(b, b.pos)) out.push({ obj: b, kind: 'butterfly', pos: b.pos, face: V(Math.sin(b.yaw), 0, Math.cos(b.yaw)), size: 1.7 * b.c.group.scale.x });
    for (const h of this.hummingbirds) if (h.state === 'sip' && h.timer > 1.5 && ok(h, h.pos)) out.push({ obj: h, kind: 'hummingbird', pos: h.pos, face: h.face.clone().setY(0), size: 1.7 * h.c.group.scale.x });
    for (const df of this.dragonflies) if (df.state === 'hover' && ok(df, df.pos)) out.push({ obj: df, kind: 'dragonfly', pos: df.c.group.position, face: df.face.clone().setY(0), size: 2.7 * df.c.group.scale.x });
    if (this.songState.state === 'perch' && ok(this.song, this.song.group.position)) out.push({ obj: this.songState, kind: 'songbird', pos: this.song.group.position, face: fwd(this.song.group), size: 2.6 });
    for (const f of out) if (f.face.lengthSq() < 1e-6) f.face.set(0, 0, 1);
    return out;
  }

  // the creatures nearest the camera (within 45 units), for the foliage to
  // part round (world/wind.js setPushers): { pos, r }
  pushers(cam, n) {
    const all = [];
    const add = (pos, r) => { const d = pos.distanceTo(cam); if (d < 45) all.push({ pos, r, d }); };
    for (const b of this.butterflies) add(b.c.group.position, 1.25 * b.c.group.scale.x);
    for (const f of this.foragers) add(f.c.group.position, 1.0 * f.c.group.scale.x);
    for (const h of this.hummingbirds) add(h.c.group.position, 1.4 * h.c.group.scale.x);
    for (const c of this.crawlers) add(c.c.group.position, 0.9 * c.c.group.scale.x);
    for (const df of this.dragonflies) add(df.c.group.position, 1.6 * df.c.group.scale.x);
    all.sort((a, b) => a.d - b.d);
    return all.slice(0, n);
  }

  // does a petal (as posed this frame) cross the line from a to b, leaving out
  // the last skipB? Exact: the line in each nearby petal's own space against
  // its triangles (the head test above is only a shape; a hummingbird beside
  // its bloom was shot straight through the bloom's petals).
  petalsBlock(a, b, skipB = 0) {
    const fl = this.world.flora;
    this._instOf ||= new Map(fl.inst.map((e) => [e.ty, e]));
    const L = a.distanceTo(b) - skipB;
    if (L <= 0) return false;
    const end = a.clone().lerp(b, L / a.distanceTo(b));
    const seg = new THREE.Line3(a, end), q = V(), M = this._pm || (this._pm = new THREE.Matrix4());
    const o = V(), e = V(), d = V(), A = V(), B = V(), C = V(), e1 = V(), e2 = V(), h = V(), sv = V(), qq = V();
    const pad = 28;
    for (let i = Math.floor((Math.min(a.x, end.x) - pad) / CELL); i <= Math.floor((Math.max(a.x, end.x) + pad) / CELL); i++) {
      for (let j = Math.floor((Math.min(a.z, end.z) - pad) / CELL); j <= Math.floor((Math.max(a.z, end.z) + pad) / CELL); j++) {
        for (const c of this.pgrid.get(i * 4096 + j) || []) {
          const f = c.f, ty = f.ty;
          const head = f.topNow || f.top;
          seg.closestPointToPoint(head, true, q);
          if (q.distanceTo(head) > ty.len * f.scale * 1.25 + 1) continue;
          const inst = this._instOf.get(ty);
          if (!inst) continue;
          f._fi ??= ty.list.indexOf(f);
          const geo = ty.geo, pos = geo.attributes.position, idx = geo.index;
          if (!geo.boundingSphere) geo.computeBoundingSphere();
          const bs = geo.boundingSphere;
          for (let k = 0; k < ty.petals; k++) {
            inst.petals.getMatrixAt(f._fi * ty.petals + k, M);
            M.invert();
            o.copy(a).applyMatrix4(M);
            e.copy(end).applyMatrix4(M);
            d.subVectors(e, o);
            // quick reject: the line misses the petal's bounding sphere
            const tt = Math.max(0, Math.min(1, sv.subVectors(bs.center, o).dot(d) / Math.max(d.lengthSq(), 1e-9)));
            if (qq.copy(o).addScaledVector(d, tt).distanceTo(bs.center) > bs.radius) continue;
            const n = idx ? idx.count : pos.count;
            for (let t = 0; t < n; t += 3) {
              const ia = idx ? idx.getX(t) : t, ib = idx ? idx.getX(t + 1) : t + 1, ic = idx ? idx.getX(t + 2) : t + 2;
              A.fromBufferAttribute(pos, ia); B.fromBufferAttribute(pos, ib); C.fromBufferAttribute(pos, ic);
              e1.subVectors(B, A); e2.subVectors(C, A);
              h.crossVectors(d, e2);
              const det = e1.dot(h);
              if (Math.abs(det) < 1e-12) continue;
              const inv = 1 / det;
              sv.subVectors(o, A);
              const u = inv * sv.dot(h);
              if (u < 0 || u > 1) continue;
              qq.crossVectors(sv, e1);
              const v = inv * d.dot(qq);
              if (v < 0 || u + v > 1) continue;
              const tHit = inv * e2.dot(qq);
              if (tHit >= 0 && tHit <= 1) return true;
            }
          }
        }
      }
    }
    return false;
  }

  // keep a featured creature doing what it's doing for a while
  hold(obj, dur) { obj.holdUntil = this.t + dur; }

  // is the view from `cam` to `subj` clear of the flower heads? (their petals
  // aren't solids for the bee, so the collision sweep doesn't see them; a
  // camera inside one shows nothing but a petal). The bloom the subject sits
  // on must be looked into from above its rim.
  // (own: false for APX-9 in flight, which sits on no bloom; then only the
  // nearer `upto` of the sightline counts, since it flies close past heads)
  clearOfHeads(cam, subj, { own = true, upto = 1 } = {}) {
    const pad = 28;
    if (upto < 1) subj = cam.clone().lerp(subj, upto);
    const x0 = Math.min(cam.x, subj.x) - pad, x1 = Math.max(cam.x, subj.x) + pad;
    const z0 = Math.min(cam.z, subj.z) - pad, z1 = Math.max(cam.z, subj.z) + pad;
    const seg = new THREE.Line3(subj, cam), q = V();
    for (let i = Math.floor(x0 / CELL); i <= Math.floor(x1 / CELL); i++) for (let j = Math.floor(z0 / CELL); j <= Math.floor(z1 / CELL); j++) {
      for (const c of this.pgrid.get(i * 4096 + j) || []) {
        const f = c.f;
        const head = f.topNow || f.top;
        const R = f.ty.len * f.scale + 1;
        const mine = own && head.distanceTo(subj) < R + 2;
        if (!mine && head.distanceTo(cam) < R) return false;
        if (mine) {
          // its own bloom: look in over the rim, not through the side of the cup
          const rim = f.ty.len * f.scale * Math.sin(Math.min(1.2, Math.max(0.2, f.ty.open))) * 0.9 + 1;
          if (cam.y < head.y + rim) return false;
          continue;
        }
        seg.closestPointToPoint(head, true, q);
        if (q.distanceTo(head) < R * 0.8) return false;
      }
    }
    return true;
  }

  update(dt, bee, camera, frustum) {
    this.t += dt;
    const t = this.t;
    const r = this.rng;
    const bp = bee.pos;
    // in view, with a margin (only creatures that could be seen are re-posed)
    const near = (p, m = 6) => { SPH.center.copy(p); SPH.radius = m; return frustum.intersectsSphere(SPH); };
    const cam = camera.position;
    // a bloom in a creature's own patch that nobody else is heading for
    const busy = (pp) => this.foragers.some((o) => o.target && o.target.p.distanceToSquared(pp) < 1) || this.butterflies.some((o) => o.target && o.target.p.distanceToSquared(pp) < 1);
    const inPatch = (c, rMin = 0) => this._perchNear(c.home, rMin, c.R, { hidden: busy }) || this._perchNear(c.home, 0, c.R * 1.6) || this._flowerNear(c.home, 0, c.R * 2);
    // keep the sightline clear: nothing on the wing may hover in the cone
    // between the camera and APX-9 (or, in a cutaway, the creature being
    // shown). `size` is the creature's half-span, so wings and tails stay
    // clear too; anything inside is moved out sideways to the cone's edge.
    const toBee = (this.sightTarget || bp).clone().sub(cam);
    const len2 = toBee.lengthSq();
    const clearSight = (p, size) => {
      if (len2 < 1) return;
      const k = p.clone().sub(cam).dot(toBee) / len2;
      if (k <= 0.02 || k >= 0.97) return;
      const closest = cam.clone().addScaledVector(toBee, k);
      const off = p.clone().sub(closest);
      const need = 0.5 + 2.4 * k + size;
      const dd = off.length();
      if (dd >= need) return;
      if (dd < 1e-3) off.set(-toBee.z, 0, toBee.x);
      p.add(off.normalize().multiplyScalar(need - dd));
    };

    // ---- nobody passes through anybody ------------------------------------------------
    // (body spheres; settled creatures and APX-9 hold their place, the others give way)
    const bodies = [{ p: bp, r: 2.6, fixed: true }];
    for (const b of this.butterflies) bodies.push({ p: b.pos, r: 1.2 * b.c.group.scale.x, fixed: b.state === 'perch' });
    for (const f of this.foragers) bodies.push({ p: f.pos, r: 1.0 * f.c.group.scale.x, fixed: f.state === 'sip' });
    for (const h of this.hummingbirds) bodies.push({ p: h.pos, r: 1.3 * h.c.group.scale.x, fixed: h.state === 'sip' });
    for (const df of this.dragonflies) bodies.push({ p: df.pos, r: 2.2 * df.c.group.scale.x, fixed: false });
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
      const A = bodies[i], Bb = bodies[j];
      if (A.fixed && Bb.fixed) continue;
      const need = A.r + Bb.r;
      const dx = A.p.x - Bb.p.x, dy = A.p.y - Bb.p.y, dz = A.p.z - Bb.p.z;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 >= need * need) continue;
      const d = Math.sqrt(d2) || 1e-3, push = need - d;
      const ux = dx / d, uy = dy / d, uz = dz / d;
      const ka = A.fixed ? 0 : Bb.fixed ? 1 : 0.5, kb = 1 - ka;
      A.p.x += ux * push * ka; A.p.y += uy * push * ka; A.p.z += uz * push * ka;
      Bb.p.x -= ux * push * kb; Bb.p.y -= uy * push * kb; Bb.p.z -= uz * push * kb;
    }

    // ---- butterflies: bloom to bloom round their own patch -------------------------------
    for (const b of this.butterflies) {
      const d = b.pos.distanceTo(bp);
      // a rushing bee sends them up off their bloom
      if ((d < 7 || (d < 13 && bee.speed > 6)) && b.state !== 'scatter') {
        b.state = 'scatter';
        b.timer = r.range(1.4, 2.2);
        b.vel.copy(b.pos).sub(bp).setY(0).normalize().multiplyScalar(11).add(V(0, 8, 0));
      }
      if (b.state === 'perch') {
        b.timer -= dt;
        if ((b.holdUntil ?? 0) > t) b.timer = Math.max(b.timer, 0.3);
        b.pos.copy(b.target.p);
        if (b.target.f?.headOff) b.pos.add(b.target.f.headOff); // the bloom nods in the breeze
        const open = 0.5 + 0.45 * Math.sin(t * 0.9 + b.ph);
        b.c.group.position.copy(b.pos);
        b.c.group.rotation.set(0, b.yaw, 0);
        if (near(b.pos)) b.c.setPose({ t, open, flap: 0, grip: 1 });
        if (b.timer <= 0) { b.state = 'fly'; b.target = inPatch(b, 6); b.vel.set(0, 4, 0); }
        continue;
      }
      if (b.state === 'scatter') {
        b.timer -= dt;
        b.vel.multiplyScalar(Math.exp(-dt * 0.4));
        if (b.timer <= 0) { b.state = 'fly'; b.target = inPatch(b, 10); }
      } else {
        // fluttering flight toward the next bloom: weave and bob
        const to = b.target.p.clone().sub(b.pos);
        const dist = to.length();
        const want = to.multiplyScalar(Math.min(7, 1.5 + dist * 0.6) / Math.max(dist, 1e-3));
        if (dist > 6) want.y += 3 + Math.sin(t * 2.1 + b.ph) * 3;
        want.x += Math.sin(t * 1.7 + b.ph) * 2.5;
        want.z += Math.cos(t * 1.3 + b.ph) * 2.5;
        b.vel.lerp(want, damp(2.2, dt));
        if (dist < 0.8) { b.state = 'perch'; b.timer = r.range(4, 11); b.yaw = Math.atan2(b.vel.x, b.vel.z); }
      }
      b.pos.addScaledVector(b.vel, dt);
      b.pos.y += Math.sin(t * b.freq * TAU * 0.5 + b.ph) * 0.05;
      this.bounds.collide(b.pos, b.vel, 0.8, dt, { cushion: 0.8, stiffness: 25 });
      clearSight(b.pos, 4.5);
      b.c.group.position.copy(b.pos);
      orient(b.c.group, b.vel.clone().setY(b.vel.y * 0.3), clamp(-b.vel.x * 0.02, -0.4, 0.4));
      if (near(b.pos)) b.c.setPose({ t: t + b.ph, open: 0.6, flap: b.state === 'scatter' ? 1 : 0.85, freq: b.state === 'scatter' ? b.freq * 1.6 : b.freq, grip: 0 });
    }

    // ---- dragonflies: hover and dart over their own patch; dart off from the bee ----------
    for (const df of this.dragonflies) {
      const d = df.pos.distanceTo(bp);
      df.timer -= dt;
      if (d < 6 && df.state !== 'flee') { df.state = 'flee'; df.from.copy(df.pos); df.to.copy(df.pos).add(df.pos.clone().sub(bp).setY(0).normalize().multiplyScalar(22)).add(V(0, 6, 0)); df.dart = 0; df.timer = 1.2; }
      if ((df.holdUntil ?? 0) > t && df.state === 'hover') df.timer = Math.max(df.timer, 0.3);
      if (df.timer <= 0) {
        df.state = df.state === 'hover' ? 'dart' : 'hover';
        if (df.state === 'dart') {
          df.from.copy(df.pos);
          df.to.copy(df.home).add(V(r.range(-1, 1) * df.R * 0.6, r.range(-4, 8), r.range(-1, 1) * df.R * 0.6));
          df.to.y = Math.max(df.to.y, groundHeight(df.to.x, df.to.z) + 8);
          df.dart = 0;
          df.timer = 0.35;
        } else df.timer = r.range(0.6, 2.4);
      }
      if (df.state === 'dart' || df.state === 'flee') { df.dart = Math.min(1, df.dart + dt / (df.state === 'flee' ? 0.5 : 0.35)); df.pos.lerpVectors(df.from, df.to, smooth(df.dart)); }
      const jitter = V(Math.sin(t * 5.1 + df.home.x) * 0.06, Math.sin(t * 6.3) * 0.05, Math.cos(t * 4.7) * 0.06);
      clearSight(df.pos, 6.5);
      df.c.group.position.copy(df.pos).add(jitter);
      const mv = df.to.clone().sub(df.from).setY(0);
      if (mv.lengthSq() > 1) df.face.lerp(mv.normalize(), damp(6, dt));
      orient(df.c.group, df.face, clamp(Math.sin(t * 2) * 0.1, -0.3, 0.3));
      if (near(df.pos, 8)) df.c.setPose({ t, flap: 1, glide: 0 });
    }

    // ---- hummingbirds: from bloom to bloom round their patch (and the glass blossom) -----
    for (const h of this.hummingbirds) {
      h.timer -= dt;
      if ((h.holdUntil ?? 0) > t && h.state === 'sip') h.timer = Math.max(h.timer, 0.3);
      const d = h.pos.distanceTo(bp);
      // the bee passing close: it stops where it is and turns to look
      if (d < 12 && h.state !== 'curious' && h.state !== 'leave' && (h.cool ?? 0) < t) {
        h.state = 'curious';
        h.timer = r.range(2, 3.5);
        h.cool = t + 20;
        h.stay = h.pos.clone();
      }
      let want, face;
      if (h.state === 'curious') {
        want = h.stay;
        face = bp.clone().sub(h.pos);
        if (h.timer <= 0) { h.state = 'leave'; h.timer = 1.2; h.vel.copy(h.pos).sub(bp).setY(0).normalize().multiplyScalar(20).add(V(0, 8, 0)); }
      } else if (h.state === 'leave') {
        want = h.pos.clone().addScaledVector(h.vel, 0.3);
        face = h.vel.clone();
        if (h.timer <= 0) { h.state = 'travel'; h.target = null; }
      } else {
        if (!h.target || (h.state === 'sip' && h.timer <= 0)) {
          const m = this.world.blossom.mouthWorld();
          if (r.float() < 0.3 && m.distanceTo(h.home) < h.R) { const ax = this.world.blossom.axisWorld(); h.target = { p: m.clone().addScaledVector(ax, 3.2), look: m.clone() }; }
          else { const p = inPatch(h, 8); h.target = { p: p.p.clone().add(V(2.5, 2.5, 0)), look: p.p.clone() }; }
          h.state = 'travel';
        }
        const to = h.target.p.clone().sub(h.pos);
        const dist = to.length();
        if (h.state === 'travel' && dist < 1) { h.state = 'sip'; h.timer = r.range(2.5, 4.5); }
        want = h.state === 'sip' ? h.target.p.clone().add(V(0, Math.sin(t * 5.3) * 0.08, 0)) : h.pos.clone().add(to.multiplyScalar(Math.min(1, 28 / Math.max(dist, 1)) * 0.6)).add(V(0, dist > 20 ? 4 : 0, 0));
        face = h.state === 'sip' ? h.target.look.clone().sub(h.pos) : to;
      }
      const prev = h.pos.clone();
      h.pos.lerp(want, damp(h.state === 'sip' ? 6 : h.state === 'curious' ? 4 : 2, dt));
      const vel = h.pos.clone().sub(prev).multiplyScalar(1 / Math.max(dt, 1e-3));
      this.bounds.collide(h.pos, vel, 1.2, dt, { cushion: 1, stiffness: 30 });
      face.y *= 0.2;
      if (face.lengthSq() > 1e-4) h.face.lerp(face.normalize(), damp(5, dt));
      if (h.state !== 'sip') clearSight(h.pos, 4.5);
      h.c.group.position.copy(h.pos);
      orient(h.c.group, h.face, clamp(-vel.x * 0.01, -0.3, 0.3), 0);
      const hover = h.state === 'sip' || h.state === 'curious';
      if (near(h.pos)) h.c.setPose({ t, spread: 1, flap: 1, freq: 17.3, tailSpread: 0.35 + (h.state === 'curious' ? 0.4 + Math.sin(t * 3) * 0.1 : 0), pitch: hover ? -0.5 : -0.15, headPitch: hover ? 0.5 : 0.15, headYaw: h.state === 'curious' ? Math.sin(t * 1.7) * 0.3 : 0, headTilt: h.state === 'curious' ? Math.sin(t * 2.3) * 0.2 : 0 });
    }

    // ---- worker bees round the skep ----------------------------------------------------
    const cel = t - this.celebrate;
    const dance = cel > 0 && cel < 5 ? Math.sin(Math.PI * clamp(cel / 5)) : 0;
    for (const w of this.workers) {
      w.a += dt * (w.speed + dance * 2.2);
      const rr = w.r * (1 - dance * 0.3);
      const y = w.h + Math.sin(t * 1.3 + w.i) * 1.6 + dance * Math.sin(w.a * 2) * 3;
      w.c.group.position.set(w.c0.x + Math.cos(w.a) * rr, y, w.c0.z + Math.sin(w.a) * rr);
      orient(w.c.group, V(-Math.sin(w.a), 0.1 * Math.cos(t * 1.3 + w.i), Math.cos(w.a)), -0.3 - dance * 0.3);
      if (!near(w.c.group.position)) continue;
      if (w.apx) w.c.setPose({ t: t + w.i, flap: 1, fold: 0, fan: 0.3 });
      else w.c.setPose({ t: t + w.i * 0.37, flap: 1, freq: 24.7, fold: 0, grip: 0 });
    }

    // ---- foragers: bees working the blooms of their own patch ---------------------------
    for (const fb of this.foragers) {
      fb.timer -= dt;
      let face;
      if (fb.state === 'sip') {
        // settled on the bloom (which nods in the breeze), gathering
        fb.pos.copy(fb.target.p);
        if (fb.target.f?.headOff) fb.pos.add(fb.target.f.headOff);
        face = V(Math.sin(fb.yaw), 0, Math.cos(fb.yaw));
        if ((fb.holdUntil ?? 0) > t) fb.timer = Math.max(fb.timer, 0.3);
        // (APX-9 landing on its bloom moves it on)
        if (fb.timer <= 0 || fb.pos.distanceTo(bp) < 4.5) { fb.state = 'fly'; fb.target = inPatch(fb, 5); fb.vel.set(0, 5, 0); }
      } else {
        // brisk, fairly straight flight that slows into a hover over the bloom
        const to = fb.target.p.clone().sub(fb.pos);
        const dist = to.length();
        const want = to.multiplyScalar(Math.min(fb.sp === 'carpenter' ? 12 : 14, 1.5 + dist * 1.3) / Math.max(dist, 1e-3));
        if (dist > 5) want.y += 1.5;
        want.x += Math.sin(t * 2.3 + fb.ph) * 1.2;
        want.z += Math.cos(t * 1.9 + fb.ph) * 1.2;
        fb.vel.lerp(want, damp(3, dt));
        fb.pos.addScaledVector(fb.vel, dt);
        // (not over the last stretch: the bloom it settles on is a solid too)
        if (dist > 2.6) this.bounds.collide(fb.pos, fb.vel, 0.9, dt, { cushion: 0.8, stiffness: 25 });
        // give APX-9 room
        const away = fb.pos.clone().sub(bp);
        if (away.length() < 4.5) fb.pos.copy(bp).addScaledVector(away.normalize(), 4.5);
        clearSight(fb.pos, 2.5);
        face = fb.vel.clone().setY(fb.vel.y * 0.3);
        if (dist < 0.7) { fb.state = 'sip'; fb.timer = r.range(2.5, 6); fb.yaw = Math.atan2(fb.vel.x, fb.vel.z); }
      }
      fb.c.group.position.copy(fb.pos);
      orient(fb.c.group, face, fb.state === 'sip' ? 0 : clamp(-fb.vel.x * 0.02, -0.4, 0.4));
      if (near(fb.pos)) {
        const sip = fb.state === 'sip';
        fb.c.setPose({ t: t + fb.ph, flap: sip ? 0 : 1, freq: fb.sp === 'carpenter' ? 17.3 : 24.7, fold: sip ? 1 : 0, grip: sip ? 1 : 0, pollen: sip ? 0.6 + 0.4 * Math.sin(t * 2 + fb.ph) : 0.3, look: sip ? Math.sin(t * 1.4 + fb.ph) * 0.3 : 0 });
      }
    }

    // ---- crawlers: up the stems of their patch; at the top, shells open and they fly ------
    const stemPoint = (f, s, out) => out.copy(f.base).lerp(f.topNow || f.top, s);
    // the way out from a stem's axis at a heading round it
    const radial = (dir, ang) => { const h = V(Math.cos(ang), 0, Math.sin(ang)); return h.addScaledVector(dir, -dir.dot(h)).normalize(); };
    // where a crawler sits on a stem
    const onStem = (cr, f, s, ang, out) => {
      const dir = (f.topNow || f.top).clone().sub(f.base).normalize();
      return stemPoint(f, s, out).addScaledVector(radial(dir, ang), (0.5 - 0.18 * s) * f.scale + 0.36 * cr.c.group.scale.x);
    };
    for (const cr of this.crawlers) {
      // a stem in its patch nobody else is on (two crawlers on one stem would collide)
      const taken = (pp) => this.crawlers.some((o) => o !== cr && (o.f && Math.hypot(o.f.base.x - pp.x, o.f.base.z - pp.z) < 4 || o.flight && Math.hypot(o.flight.f.base.x - pp.x, o.flight.f.base.z - pp.z) < 4));
      const stemIn = (rMin) => (this._perchNear(cr.home, rMin, cr.R, { hidden: taken }) || this._perchNear(cr.home, 0, cr.R * 1.6, { hidden: taken }))?.f;
      if (!cr.f) {
        const f = stemIn(0);
        if (f) { cr.f = f; cr.s = r.range(0.15, 0.4); cr.dir = 1; cr.state = 'climb'; cr.ang = r.range(0, TAU); cr.open = 0; }
        else { cr.c.group.visible = false; continue; }
      }
      const f = cr.f;
      const top = f.topNow || f.top;
      const axisDir = top.clone().sub(f.base);
      const len = axisDir.length();
      axisDir.multiplyScalar(1 / Math.max(len, 1e-3));
      let fwd, up, pose;
      if (cr.state === 'climb') {
        // pause while APX-9 is right beside it
        const go = cr.pos.distanceTo(bp) > 5 ? 1 : 0;
        cr.s += (cr.dir * dt * cr.speed * go) / Math.max(len, 1);
        cr.walk += (dt * cr.speed * go) / 1.1;
        cr.open = Math.max(0, cr.open - dt * 2);
        if (cr.s > 0.8) { if (r.chance(0.6)) { cr.state = 'open'; cr.timer = 0; } else cr.dir = -1; }
        if (cr.s < 0.12) cr.dir = 1;
        cr.s = clamp(cr.s, 0.1, 0.82);
        onStem(cr, f, cr.s, cr.ang, cr.pos);
        fwd = axisDir.clone().multiplyScalar(cr.dir);
        up = radial(axisDir, cr.ang);
        pose = { t, walk: cr.walk % 1, open: cr.open, wings: 0, look: Math.sin(t * 1.3) * 0.15 };
      } else if (cr.state === 'open') {
        // shell halves lift, wings unfurl, then away
        cr.timer += dt;
        onStem(cr, f, cr.s, cr.ang, cr.pos);
        fwd = axisDir.clone();
        up = radial(axisDir, cr.ang);
        const open = clamp(cr.timer / 0.6), wings = clamp((cr.timer - 0.4) / 0.5);
        pose = { t, walk: null, open, wings, flap: wings };
        if (cr.timer > 1.0) {
          const nf = stemIn(6) || f;
          cr.flight = { from: cr.pos.clone(), f: nf, k: 0, dur: r.range(1.6, 2.4), lift: r.range(4, 8), ang: r.range(0, TAU) };
          cr.state = 'fly';
        }
      } else {
        // a short flight to the next stem (a lifted arc), then settle and climb
        const fl = cr.flight;
        fl.k = Math.min(1, fl.k + dt / fl.dur);
        const nf = fl.f;
        const s1 = 0.25;
        const to = onStem(cr, nf, s1, fl.ang, V());
        const k = smooth(fl.k);
        const prev = cr.pos.clone();
        cr.pos.copy(fl.from).lerp(to, k).add(V(0, Math.sin(Math.PI * fl.k) * fl.lift, 0));
        fwd = cr.pos.clone().sub(prev);
        if (fwd.lengthSq() < 1e-8) fwd = to.clone().sub(fl.from);
        up = V(0, 1, 0);
        pose = { t, walk: null, open: 1, wings: 1, flap: 1 };
        if (fl.k >= 1) { cr.f = nf; cr.s = s1; cr.ang = fl.ang; cr.dir = 1; cr.state = 'climb'; cr.open = 1; cr.flight = null; }
      }
      cr.c.group.visible = true;
      cr.c.group.position.copy(cr.pos);
      orientOnSurface(cr.c.group, fwd, up);
      if (near(cr.pos, 4)) cr.c.setPose(pose);
    }

    // ---- songbird ------------------------------------------------------------------------
    const s = this.songState;
    const sb = this.song;
    const dSong = this.songPerch.distanceTo(bp);
    s.timer -= dt;
    if (s.state === 'perch') {
      if (dSong < 8 && bee.flying) { s.state = 'loop'; s.loopT = 0; this.audio?.chirp(0, 0.03); }
      s.nextSong -= dt;
      if (s.nextSong <= 0) { s.nextSong = r.range(5, 13); s.sing = 1.2; this.audio?.chirp(-0.3, dSong < 120 ? 0.02 * clamp(1 - dSong / 120) + 0.004 : 0.004); }
      s.sing = Math.max(0, (s.sing || 0) - dt);
      // watch the bee when it's about
      const toBee = bp.clone().sub(this.songPerch);
      const yawT = dSong < 60 ? clamp(Math.atan2(toBee.x, toBee.z) - Math.atan2(this.songFace.x, this.songFace.z), -0.8, 0.8) : Math.sin(t * 0.4) * 0.4;
      s.yaw += (Math.round(yawT * 4) / 4 - s.yaw) * damp(10, dt); // quick, discrete head turns
      sb.group.position.copy(this.songPerch).add(V(0, 0.95 * sb.S, 0));
      orient(sb.group, this.songFace, 0, 0);
      sb.setPose({ t, spread: 0, flap: 0, freq: 3, tailSpread: 0.2, headYaw: s.yaw, headTilt: Math.sin(t * 0.9) * 0.15 + (s.sing > 0 ? 0.2 : 0), perch: 1, ruffle: s.sing > 0 ? 0.3 : 0 });
    } else {
      // a loop round the tree and back to the bough
      s.loopT += dt;
      const k = clamp(s.loopT / 7);
      const tr = L.songbirdTree;
      const a = k * TAU + Math.atan2(this.songPerch.x - tr.x, this.songPerch.z - tr.z);
      const ring = V(tr.x + Math.sin(a) * 30, 45 + Math.sin(k * Math.PI) * 15, tr.z + Math.cos(a) * 30);
      const w = smooth(clamp(k * 5)) * smooth(clamp((1 - k) * 5));
      const p = this.songPerch.clone().add(V(0, 0.95 * sb.S, 0)).lerp(ring, w);
      const prev = sb.group.position.clone();
      sb.group.position.copy(p);
      const v = p.clone().sub(prev);
      orient(sb.group, v.lengthSq() > 1e-6 ? v : this.songFace, 0.3 * w, -0.1);
      sb.setPose({ t, spread: 1, flap: 1, freq: 3.4, tailSpread: 0.6, perch: 1 - w });
      if (k >= 1) { s.state = 'perch'; s.nextSong = 2; }
    }
  }
}
