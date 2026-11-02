// Cameras. The game view fits the whole wrap-around belt to the screen every frame. The demo director
// cuts between broadcast shots and, because it can forecast every shot and shard against every ship,
// sees a big hit coming and drops into slow motion on the right camera before it lands.
import * as THREE from '../vendor/three.module.min.js';
import { F } from './config.js?v=2';
import { dX, dZ, fwd } from './sim.js?v=2';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const { AW, AH } = F;
const _v = new THREE.Vector3();

export class Director {
  constructor(camera) {
    this.cam = camera;
    this.mode = 'auto';
    this.pos = new THREE.Vector3(0, 60, 40);
    this.look = new THREE.Vector3(0, 0, 0);
    this.fov = 40;
    this.trauma = 0;
    this.slow = 1;
    this.slowT = 0;
    this.shot = null;
    this.shotT = 0;
    this.cutT = 0;
    this.t = 0;
    this.orbit = 0;
    this.fitCache = {};
    this.flip = false;
    this.impact = null;
    this.scanT = 0;
    this.hudTop = 0.84;
  }

  setMode(mode) { this.mode = mode; this.shot = null; this.fitCache = {}; this.snap = true; }
  addTrauma(k) { this.trauma = Math.min(1, this.trauma + k); }
  slowMo(scale, seconds) { this.slow = Math.min(this.slow, scale); this.slowT = Math.max(this.slowT, seconds); }

  // the camera distance that fits the belt's corners inside the frame
  fit(pitch, yaw, target, margin, fov, half = [AW, AH]) {
    const key = [pitch, yaw, margin, fov, half, target.x.toFixed(1), target.z.toFixed(1), this.cam.aspect.toFixed(3)].join();
    if (this.fitCache[key]) return this.fitCache[key];
    const cam = new THREE.PerspectiveCamera(fov, this.cam.aspect, 0.1, 5000);
    const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    const pts = [];
    for (const x of [-half[0], half[0]]) for (const z of [-half[1], half[1]]) pts.push(new THREE.Vector3(target.x + x, 0, target.z + z));
    let lo = 5, hi = 400;
    for (let i = 0; i < 26; i++) {
      const d = (lo + hi) / 2;
      cam.position.copy(target).addScaledVector(dir, d);
      cam.lookAt(target);
      cam.updateMatrixWorld();
      let ok = true;
      for (const p of pts) {
        _v.copy(p).project(cam);
        if (Math.abs(_v.x) > margin[0] || _v.y > margin[1] || _v.y < -margin[2] || _v.z > 1) { ok = false; break; }
      }
      if (ok) hi = d; else lo = d;
    }
    const res = { pos: target.clone().addScaledVector(dir, hi), look: target.clone() };
    this.fitCache[key] = res;
    if (Object.keys(this.fitCache).length > 200) this.fitCache = {};
    return res;
  }

  gameView(mode) {
    const a = this.cam.aspect;
    // portrait screens: the belt turns on its side so its long axis runs up the screen
    const tall = a < 0.85;
    const pitch = mode === 'top' || tall ? 1.48 : mode === 'low' ? 0.92 : 1.16;
    const fov = mode === 'low' && !tall ? 44 : 38;
    const top = tall ? 0.8 : this.hudTop;
    const v = this.fit(pitch, tall ? Math.PI / 2 : 0, new THREE.Vector3(0, 0, mode === 'low' && !tall ? 1.5 : 0.4), [0.97, top, tall ? 0.72 : 0.95], fov);
    return { ...v, fov };
  }

  update(dt, ctx) {
    this.t += dt;
    const W = ctx.W;
    let want;
    if (ctx.replay && W) want = this.replayShot(dt, W, ctx.replay);
    else if (ctx.ko && W) want = this.koShot(dt, W, ctx.ko);
    else if (ctx.demo && W) want = this.demoShot(dt, W);
    else if (ctx.menu) want = this.menuShot(dt);
    else {
      want = this.gameView(this.mode);
      // a touch of life: lean toward your ship
      const me = W && ctx.me && W.ships.find((s) => s.side === ctx.me && s.alive);
      if (me) {
        this.lean = this.lean || new THREE.Vector3();
        this.lean.x += (me.x * 0.05 - this.lean.x) * Math.min(1, dt * 1.5);
        this.lean.z += (me.z * 0.05 - this.lean.z) * Math.min(1, dt * 1.5);
        want = { pos: want.pos.clone().add(this.lean), look: want.look.clone().add(this.lean), fov: want.fov };
      }
      if (this.flip) want = { ...want, pos: new THREE.Vector3(-want.pos.x, want.pos.y, -want.pos.z), look: new THREE.Vector3(-want.look.x, want.look.y, -want.look.z) };
    }
    const k = this.snap || want.cut ? 1 : 1 - Math.exp(-dt * (want.speed || 4));
    this.snap = false;
    this.pos.lerp(want.pos, k);
    this.look.lerp(want.look, k);
    this.fov += (want.fov - this.fov) * k;
    this.trauma = Math.max(0, this.trauma - dt * 1.5);
    const sh = this.trauma * this.trauma * (ctx.shake ?? 1);
    const t = this.t * 40;
    this.cam.position.copy(this.pos);
    this.cam.position.x += Math.sin(t * 1.3) * sh * 0.9;
    this.cam.position.z += Math.sin(t * 1.7 + 2) * sh * 0.7;
    this.cam.up.set(0, 1, 0);
    if (this.flip && !ctx.demo && !ctx.replay && !ctx.ko && !ctx.menu) this.cam.up.set(0, 0, 1);
    this.cam.lookAt(this.look);
    this.cam.rotation.z += Math.sin(t * 1.1 + 4) * sh * 0.02 + (want.roll || 0);
    this.cam.fov = this.fov;
    this.cam.updateProjectionMatrix();
    if (this.slowT > 0) { this.slowT -= dt; if (this.slowT <= 0) this.slow = 1; }
  }

  menuShot(dt) {
    this.orbit += dt * 0.05;
    const r = 62;
    return { pos: new THREE.Vector3(Math.sin(this.orbit) * r, 34 + Math.sin(this.orbit * 0.7) * 4, Math.cos(this.orbit) * r), look: new THREE.Vector3(0, -6, 0), fov: 46, speed: 1.5 };
  }

  // ------------------------------------------------------------------ demo cinematography
  // forecast: will a shot or shard hit a ship in the next 0.7 s?
  forecast(W) {
    let best = null;
    for (const s of W.ships) {
      if (!s.alive || s.inv > 0.2 || s.dashT > 0) continue;
      const test = (x, z, vx, vz, r, dmg) => {
        const px = dX(s.x, x), pz = dZ(s.z, z);
        const rvx = vx - s.vx, rvz = vz - s.vz, v2 = rvx * rvx + rvz * rvz;
        if (v2 < 1) return;
        const tc = -(px * rvx + pz * rvz) / v2;
        if (tc < 0.12 || tc > 0.75) return;
        const cx = px + rvx * tc, cz = pz + rvz * tc;
        if (Math.hypot(cx, cz) > s.r + r) return;
        const lethal = s.hp <= dmg && s.fx.shield <= 0;
        const v = (lethal ? 3 : 1) * dmg;
        if (!best || v > best.v) best = { v, t: tc, side: s.side, ship: s, x: s.x + s.vx * tc, z: s.z + s.vz * tc, lethal };
      };
      for (const b of W.bullets) if (b.side !== s.side) test(b.x, b.z, b.vx, b.vz, 0.2, b.dmg);
      for (const r of W.rocks) if (r.owner === -s.side && r.ownT > 0) test(r.x, r.z, r.vx, r.vz, r.r, 2);
    }
    return best;
  }

  demoShot(dt, W) {
    this.shotT += dt;
    this.cutT -= dt;
    this.scanT -= dt;
    if (this.scanT <= 0) {
      this.scanT = 0.06;
      const f = this.forecast(W);
      if (f && (!this.impact || W.t > this.impact.until) && (f.lethal || f.v >= 2 || Math.random() < 0.35)) {
        this.impact = { ...f, until: W.t + f.t + 0.6, at: W.t + f.t };
        this.shot = { kind: 'impact', side: f.side };
        this.shotT = 0;
        this.slowMo(f.lethal ? 0.18 : 0.32, f.t + (f.lethal ? 1.1 : 0.55));
        this.cutT = 2.2;
      }
    }
    const ships = W.ships.filter((s) => s.alive);
    if (this.impact && W.t < this.impact.until) {
      const I = this.impact, s = I.ship;
      const x = s.alive ? s.x : I.x, z = s.alive ? s.z : I.z;
      const a = this.t * 0.15;
      return { pos: new THREE.Vector3(x + Math.sin(a) * 9, 13, z + 12 + Math.cos(a) * 3), look: new THREE.Vector3(x, 0, z), fov: 42, speed: this.shotT < 0.05 ? 99 : 6, cut: this.shotT < 0.02 };
    }
    if (!this.shot || this.cutT <= 0 || this.shot.kind === 'impact') {
      const kinds = W.boss ? ['wide', 'boss', 'chase', 'duel'] : ['wide', 'duel', 'chase', 'hero', 'wide'];
      const kind = kinds[(Math.random() * kinds.length) | 0];
      this.shot = { kind, side: ships.length ? ships[(Math.random() * ships.length) | 0].side : 1, yaw: (Math.random() - 0.5) * 0.8 };
      this.shotT = 0;
      this.cutT = kind === 'wide' ? 7 : 5 + Math.random() * 3;
    }
    const S = this.shot;
    const s = W.ships.find((q) => q.side === S.side && q.alive) || ships[0];
    if (S.kind === 'wide' || !s) return { ...this.gameView('auto'), speed: 2 };
    if (S.kind === 'chase') {
      // behind the ship, looking where it is going; a wrap jump cuts away
      const [fx, fz] = fwd(s.a);
      if (S.last && (Math.abs(S.last.x - s.x) > 20 || Math.abs(S.last.z - s.z) > 20)) { this.cutT = 0; S.last = null; return { ...this.gameView('auto') }; }
      S.last = { x: s.x, z: s.z };
      S.hx = S.hx === undefined ? fx : S.hx + (fx - S.hx) * Math.min(1, dt * 1.5);
      S.hz = S.hz === undefined ? fz : S.hz + (fz - S.hz) * Math.min(1, dt * 1.5);
      const l = Math.hypot(S.hx, S.hz) || 1;
      const hx = S.hx / l, hz = S.hz / l;
      return { pos: new THREE.Vector3(s.x - hx * 11, 9, s.z - hz * 11), look: new THREE.Vector3(s.x + hx * 9, 0, s.z + hz * 9), fov: 52, speed: 5 };
    }
    if (S.kind === 'hero') {
      const a = this.shotT * 0.25 + S.yaw;
      return { pos: new THREE.Vector3(s.x + Math.sin(a) * 10, 6, s.z + Math.cos(a) * 10), look: new THREE.Vector3(s.x, 0.5, s.z), fov: 44, speed: 4 };
    }
    if (S.kind === 'boss' && W.boss) {
      const B = W.boss, a = this.shotT * 0.12 + S.yaw;
      return { pos: new THREE.Vector3(B.x + Math.sin(a) * 26, 22, B.z + Math.cos(a) * 26), look: new THREE.Vector3(B.x, 0, B.z), fov: 46, speed: 3 };
    }
    // duel: both ships in frame
    const o = ships.find((q) => q !== s) || s;
    const mx = s.x + dX(s.x, o.x) / 2, mz = s.z + dZ(s.z, o.z) / 2;
    const span = Math.max(12, Math.hypot(dX(s.x, o.x), dZ(s.z, o.z)) * 0.6 + 6);
    const half = [span, span * 0.6];
    const v = this.fit(1.0, S.yaw, new THREE.Vector3(mx, 0, mz), [0.8, 0.7, 0.8], 42, half);
    return { ...v, fov: 42, speed: 2.5 };
  }

  koShot(dt, W, ko) {
    this.orbit += dt * 0.25;
    const a = this.orbit;
    return { pos: new THREE.Vector3(ko.x + Math.sin(a) * 15, 12, ko.z + Math.cos(a) * 15), look: new THREE.Vector3(ko.x, 0, ko.z), fov: 46, speed: 3 };
  }

  // instant replay: follow the doomed ship, then hold on the blast
  replayShot(dt, W, info) {
    this.orbit += dt * 0.35;
    const s = W.ships.find((q) => q.side === info.side);
    const x = s && s.alive ? s.x : info.x, z = s && s.alive ? s.z : info.z;
    if (this.rpLast && (Math.abs(this.rpLast.x - x) > 20 || Math.abs(this.rpLast.z - z) > 20)) this.snap = true;
    this.rpLast = { x, z };
    const a = this.orbit;
    return { pos: new THREE.Vector3(x + Math.sin(a) * 11, 8, z + Math.cos(a) * 11), look: new THREE.Vector3(x, 0, z), fov: 44, speed: 5 };
  }

  endReplay() { this.rpLast = null; this.snap = true; this.slow = 1; this.slowT = 0; }
}
