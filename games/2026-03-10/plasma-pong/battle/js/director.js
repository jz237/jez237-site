// Cameras. Game views are fitted to the screen every frame; the demo director cuts between
// broadcast shots and, because it can read the AI's forecasts, sees core breaches coming and
// drops into slow motion on the right camera *before* they happen.
import * as THREE from '../vendor/three.module.min.js';
import { F } from './config.js?v=6';
import { predictToPlane } from './predict.js?v=6';
import { cellIndex } from './sim.js?v=6';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const _v = new THREE.Vector3(), _q = new THREE.Vector3();
const KEY_POINTS = [];
for (const x of [-F.hw - 0.4, F.hw + 0.4]) for (const z of [-F.goalZ - 0.6, F.goalZ + 0.6]) KEY_POINTS.push(new THREE.Vector3(x, 0, z));
KEY_POINTS.push(new THREE.Vector3(0, 3.2, -13.7), new THREE.Vector3(-F.hw, 0.8, -F.goalZ), new THREE.Vector3(F.hw, 0.8, -F.goalZ));

export class Director {
  constructor(camera) {
    this.cam = camera;
    this.mode = 'arena';
    this.pos = new THREE.Vector3(0, 16, 20);
    this.look = new THREE.Vector3(0, 0, 0);
    this.fov = 45;
    this.trauma = 0;
    this.slow = 1;            // time scale requested by the director
    this.slowT = 0;
    this.shot = null;
    this.shotT = 0;
    this.cutCooldown = 0;
    this.fade = 0;
    this.events = [];
    this.t = 0;
    this.swayX = 0;
    this.orbit = 0;
    this.fitCache = {};
    this.flip = false;        // online guest: the game views look from the far end
  }

  setMode(mode) {
    this.mode = mode;
    this.shot = null;
    this.cutCooldown = 0;
    this.fitCache = {};
    this.snap = true;
  }

  addTrauma(k) { this.trauma = Math.min(1, this.trauma + k); }

  // Fit a camera looking along `dir` (from target) so all key points sit inside the frame.
  fit(dirYaw, pitch, target, margin, fov) {
    const key = [dirYaw, pitch, margin, fov, this.cam.aspect.toFixed(3)].join();
    if (this.fitCache[key]) return this.fitCache[key];
    const cam = new THREE.PerspectiveCamera(fov, this.cam.aspect, 0.1, 3000);
    const dir = new THREE.Vector3(Math.sin(dirYaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(dirYaw) * Math.cos(pitch));
    let lo = 5, hi = 120;
    for (let i = 0; i < 24; i++) {
      const d = (lo + hi) / 2;
      cam.position.copy(target).addScaledVector(dir, d);
      cam.lookAt(target);
      cam.updateMatrixWorld();
      let ok = true;
      for (const p of KEY_POINTS) {
        _v.copy(p).project(cam);
        if (Math.abs(_v.x) > margin[0] || _v.y > margin[1] || _v.y < -margin[2] || _v.z > 1) { ok = false; break; }
      }
      if (ok) hi = d; else lo = d;
    }
    const res = { pos: target.clone().addScaledVector(dir, hi), look: target.clone() };
    this.fitCache[key] = res;
    return res;
  }

  gameView(mode) {
    const a = this.cam.aspect;
    if (mode === 'side') {
      const pitch = a > 1.3 ? 0.62 : 0.8;
      return { ...this.fit(Math.PI / 2, pitch, new THREE.Vector3(0, 0, 0), [0.97, 0.78, 0.92], 40), fov: 40 };
    }
    if (mode === 'top') return { ...this.fit(0, 1.38, new THREE.Vector3(0, 0, 0), [0.95, 0.8, 0.93], 42), fov: 42 };
    // arena: from behind the near player; steeper on tall screens
    const pitch = a < 0.8 ? 1.08 : a < 1.3 ? 0.98 : 0.86;
    const target = new THREE.Vector3(0, 0, a < 0.8 ? -0.6 : -1.4);
    return { ...this.fit(0, pitch, target, [0.98, 0.74, 0.97], a < 0.8 ? 52 : 44), fov: a < 0.8 ? 52 : 44 };
  }

  // ctx: { W, demo (bool), ai: {1,-1}, mode }
  update(dt, ctx) {
    this.t += dt;
    const W = ctx.W;
    let want;
    if (ctx.replay && W) want = this.replayShot(dt, W, ctx.replay);
    else if (ctx.demo && W) want = this.demoShot(dt, ctx);
    else if (ctx.menu) want = this.menuShot(dt);
    else {
      want = this.gameView(this.mode);
      // a touch of life: drift toward the play
      if (W && W.balls.length && this.mode === 'arena') {
        let bx = 0;
        for (const b of W.balls) bx += b.x;
        this.swayX += ((bx / W.balls.length) * 0.08 - this.swayX) * Math.min(1, dt * 2);
        want = { pos: want.pos.clone().add(new THREE.Vector3(this.swayX, 0, 0)), look: want.look.clone().add(new THREE.Vector3(this.swayX * 0.5, 0, 0)), fov: want.fov };
      }
      if (this.flip) want = { ...want, pos: new THREE.Vector3(-want.pos.x, want.pos.y, -want.pos.z), look: new THREE.Vector3(-want.look.x, want.look.y, -want.look.z) };
    }
    const k = this.snap || want.cut ? 1 : 1 - Math.exp(-dt * (want.speed || 4));
    this.snap = false;
    this.pos.lerp(want.pos, k);
    this.look.lerp(want.look, k);
    this.fov += (want.fov - this.fov) * k;
    // shake
    this.trauma = Math.max(0, this.trauma - dt * 1.4);
    const sh = this.trauma * this.trauma * (ctx.shake ?? 1);
    const t = this.t * 40;
    this.cam.position.copy(this.pos);
    this.cam.position.x += Math.sin(t * 1.3) * sh * 0.5;
    this.cam.position.y += Math.sin(t * 1.7 + 2) * sh * 0.4;
    this.cam.lookAt(this.look);
    this.cam.rotation.z += Math.sin(t * 1.1 + 4) * sh * 0.03 + (want.roll || 0);
    this.cam.fov = this.fov;
    this.cam.updateProjectionMatrix();
    // slow motion envelope
    if (this.slowT > 0) { this.slowT -= dt; if (this.slowT <= 0) this.slow = 1; }
  }

  slowMo(scale, seconds) { this.slow = scale; this.slowT = Math.max(this.slowT, seconds); }

  menuShot(dt) {
    this.orbit += dt * 0.06;
    const r = 30;
    return { pos: new THREE.Vector3(Math.sin(this.orbit) * r, 9 + Math.sin(this.orbit * 0.7) * 2, Math.cos(this.orbit) * r), look: new THREE.Vector3(0, 0.5, 0), fov: 42, speed: 2 };
  }

  // ------------------------------------------------------------------ demo cinematography
  demoShot(dt, ctx) {
    const W = ctx.W;
    this.shotT += dt;
    this.cutCooldown -= dt;
    // forecast: is a ball about to breach a core with no paddle able to save it?
    if (!this.breach || W.t > this.breach.until) {
      this.breach = null;
      for (const b of W.balls) {
        if (b.caught) continue;
        const s = b.vz > 0 ? 1 : -1;
        // where it meets the shield line decides whether it finds a gap
        const pr = predictToPlane(W, b, s * (F.cellZ - F.cellHD - F.ballR), 1.2);
        if (!pr) continue;
        const cell = W.cells[s][cellIndex(pr.x)];
        if (cell.hp > 0 && !(b.fire && b.owner === -s)) continue;
        if (W.fx[s].barrier > 0) continue;
        // only call it when no defender can possibly get there: either the ball is already past
        // every paddle, or even a full-speed dash to where it crosses the paddle line falls short
        let doomed = true;
        for (const p of W.paddles) {
          if (p.side !== s || s * b.z > s * p.z + p.hd + F.ballR) continue; // already behind this one
          const plane = s * (Math.abs(p.z) - p.hd - F.ballR);
          let px = b.x, t = 0;
          if (s * b.z < s * plane) {
            const pp = predictToPlane(W, b, plane, 1.2);
            if (!pp) { doomed = false; break; }
            px = pp.x; t = pp.t;
          }
          const gap = Math.abs(p.x - px) - p.hw - F.ballR;
          if (gap < (p.stun > 0 ? Math.max(0, t - p.stun) : t) * p.maxSpeed + 0.3) { doomed = false; break; }
        }
        if (!doomed) continue;
        this.breach = { side: s, x: pr.x, until: W.t + pr.t + 1.4, ball: b.id };
        this.slowMo(0.32, pr.t / 0.32 + 0.5);
        this.cutTo({ kind: 'breach', side: s, x: pr.x, ball: b.id });
        break;
      }
    }
    if (!this.shot || (!this.breach && this.shotT > this.shot.dur && this.cutCooldown <= 0)) this.pickShot(W);
    const s = this.shot;
    const ball = W.balls.find((b) => b.id === (s.ball ?? -1)) || W.balls[0];
    switch (s.kind) {
      case 'broadcast': {
        const v = this.gameView('side');
        const drift = Math.sin(this.shotT * 0.15) * 3;
        return { pos: v.pos.clone().add(new THREE.Vector3(0, -2, drift)), look: new THREE.Vector3(0, 0, drift * 0.3), fov: v.fov, speed: 3, cut: s.fresh && (s.fresh = false, true) };
      }
      case 'behind': {
        const v = this.gameView('arena');
        const pos = v.pos.clone(), look = v.look.clone();
        if (s.side === -1) { pos.z = -pos.z; look.z = -look.z; }
        return { pos, look, fov: v.fov, speed: 3, cut: s.fresh && (s.fresh = false, true) };
      }
      case 'low': {
        const side = s.side;
        const x = ball ? ball.x * 0.4 : 0;
        const sx = s.sx || (s.sx = Math.random() < 0.5 ? -1 : 1);
        return { pos: new THREE.Vector3(sx * 8.6, 1.9, side * 9.5), look: new THREE.Vector3(x, 0.4, -side * 3), fov: 50, speed: 2.5, cut: s.fresh && (s.fresh = false, true) };
      }
      case 'chase': {
        if (!ball) return this.gameView('side');
        const sp = Math.hypot(ball.vx, ball.vz) || 1;
        const dx = ball.vx / sp, dz = ball.vz / sp;
        return { pos: new THREE.Vector3(ball.x - dx * 6, 2.6, ball.z - dz * 6), look: new THREE.Vector3(ball.x + dx * 4, 0.3, ball.z + dz * 4), fov: 62, speed: 5, cut: s.fresh && (s.fresh = false, true) };
      }
      case 'top': {
        const v = this.gameView('top');
        return { pos: v.pos, look: v.look, fov: v.fov, speed: 3, roll: 0, cut: s.fresh && (s.fresh = false, true) };
      }
      case 'orbit': {
        this.orbit += dt * 0.12;
        return { pos: new THREE.Vector3(Math.sin(this.orbit) * 24, 11, Math.cos(this.orbit) * 24), look: new THREE.Vector3(0, 0, 0), fov: 46, speed: 2 };
      }
      case 'breach': {
        // a low dramatic angle across the doomed core
        const side = s.side;
        const bx = ball ? ball.x : s.x;
        const bz = ball ? ball.z : side * 10;
        return { pos: new THREE.Vector3(s.x + (s.x > 0 ? -5 : 5), 1.9, side * 15.5), look: new THREE.Vector3(bx * 0.5 + s.x * 0.5, 0.6, Math.min(Math.abs(bz), 11) * side), fov: 48, speed: 6, cut: s.fresh && (s.fresh = false, true) };
      }
      case 'ko': {
        const side = s.side;
        this.orbit += dt * 0.25;
        return { pos: new THREE.Vector3(Math.sin(this.orbit) * 9, 4.5, side * 13.7 + Math.cos(this.orbit) * 9), look: new THREE.Vector3(0, 1.6, side * 13.7), fov: 52, speed: 3 };
      }
    }
    return this.gameView('side');
  }

  // ------------------------------------------------------------------ instant replay
  // info: { side (the core that fell), ball (id of the ball that did it), x, koT (world time of the KO) }
  replayShot(dt, W, info) {
    const s = info.side;
    const ball = W.balls.find((b) => b.id === info.ball);
    const toKO = info.koT - W.t;
    const first = !this.rp;
    this.rp = true;
    if (ball && toKO > 0.75) {
      // ride alongside the ball, low over the deck, looking where it is going
      const sp = Math.hypot(ball.vx, ball.vz) || 1;
      const dx = ball.vx / sp, dz = ball.vz / sp;
      const sideOff = (ball.x > 0 ? -1 : 1) * 2.6;
      return { pos: new THREE.Vector3(clamp(ball.x - dx * 6 + sideOff, -11, 11), 3.4, ball.z - dz * 7.5), look: new THREE.Vector3(ball.x + dx * 4, 0.3, ball.z + dz * 4), fov: 54, speed: 3.2, cut: first };
    }
    if (toKO > 0.75) {
      const v = this.gameView('side');
      return { pos: v.pos.clone().add(new THREE.Vector3(0, -3, -s * 4)), look: new THREE.Vector3(0, 0, s * 4), fov: v.fov, speed: 2.5, cut: first };
    }
    // the finish: from the goal line inside the court, across the gap into the doomed core;
    // after the blast the camera eases up and back
    const x = info.x;
    const back = toKO < 0 ? Math.min(1, -toKO * 1.2) : 0;
    const cut = this.rpCut !== 'core';
    this.rpCut = 'core';
    return { pos: new THREE.Vector3((x > 0 ? -5.6 : 5.6) * (1 + back * 0.15), 2.3 + back * 2.2, s * (8.2 - back * 2.5)), look: new THREE.Vector3(x * 0.7, 0.9 + back * 0.6, s * 12.4), fov: 50 + back * 6, speed: 4, cut: cut || first };
  }
  endReplay() { this.rp = false; this.rpCut = null; this.snap = true; }

  cutTo(shot) {
    this.shot = { dur: 5, ...shot, fresh: true };
    this.shotT = 0;
    this.cutCooldown = 1.2;
  }

  pickShot(W) {
    const balls = W.balls;
    const fast = balls.some((b) => Math.hypot(b.vx, b.vz) > 21);
    const r = Math.random();
    let shot;
    const last = this.shot && this.shot.kind;
    if (!balls.length) shot = { kind: last === 'orbit' ? 'broadcast' : 'orbit', dur: 3.5 };
    else if (fast && r < 0.35 && last !== 'chase') shot = { kind: 'chase', ball: balls[0].id, dur: 2.2 };
    else if (r < 0.45) shot = { kind: 'broadcast', dur: 6 + Math.random() * 4 };
    else if (r < 0.65) shot = { kind: 'behind', side: Math.random() < 0.5 ? 1 : -1, dur: 5 + Math.random() * 3 };
    else if (r < 0.82) shot = { kind: 'low', side: Math.random() < 0.5 ? 1 : -1, ball: balls[0].id, dur: 4 };
    else shot = { kind: 'top', dur: 4 };
    if (shot.kind === last && shot.kind !== 'broadcast') shot = { kind: 'broadcast', dur: 6 };
    this.cutTo(shot);
  }
}
