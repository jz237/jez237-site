// game.js — the simulation. Runs at a fixed 60 Hz in area coordinates
// (x = metres right of centre, p = metres north), and syncs the 3D scene.
import * as THREE from 'three';
import { Soldier } from './soldier.js';
import * as M from './models.js';
import { clamp, lerp, angDiff, approach, TAU } from './util.js';

export const TUNE = {
  joeSpeed: 5.6, joeAccel: 55, joeRadius: 0.42,
  fireCd: 0.13, bulletSpeed: 36, bulletLife: 0.4, spread: 0.022,
  grenStart: 6, grenMax: 9, grenRange: 11, grenRadius: 3.5,
  joeHp: 3, lives: 3, invulnHit: 1.1, invulnSpawn: 2.6,
  eBullet: 14.5, eBulletSniper: 27,
  runSpeed: 4.1, walkSpeed: 1.8,
  maxAimers: 4,
};
const SCORE = { rifle: 100, lobber: 150, trench: 150, sniper: 300, mortar: 400, officer: 2000, bunker: 1000, truck: 800, pow: 500 };
const HITBOX = 0.5;

const dirOf = (a) => [Math.sin(a), Math.cos(a)];      // angle 0 = north (+p), +π/2 = east (+x)
const angOf = (dx, dp) => Math.atan2(dx, dp);
const rnd = Math.random;
const rr = (a, b) => a + rnd() * (b - a);

export class Game {
  constructor({ R, world, fx, hud, audio, area }) {
    this.R = R; this.world = world; this.fx = fx; this.hud = hud; this.audio = audio; this.area = area;
    this.T = world.terrain; this.col = world.col;
    this.scene = R.scene;
    this.loop = 1;
    this.hi = this.loadHi();
    this.state = 'idle';
    this.events = [];
    this._v = new THREE.Vector3();
    this.pickupGeo = { gren: M.crateGeo(), med: M.crateGeo() };
    this.pickupMat = {
      gren: new THREE.MeshStandardMaterial({ color: 0x6f7c3a, emissive: 0x2a3a08, roughness: 0.6 }),
      med: new THREE.MeshStandardMaterial({ color: 0xe8e2d0, emissive: 0x401010, roughness: 0.6 }),
    };
    this.nadeGeo = new THREE.SphereGeometry(0.11, 8, 6);
    this.nadeMat = new THREE.MeshStandardMaterial({ color: 0x3b4128, roughness: 0.6 });
    this.shellMat = new THREE.MeshStandardMaterial({ color: 0x2a2a28, roughness: 0.5, metalness: 0.4 });
  }

  // ------------------------------------------------------------------ lifecycle
  newGame(opts = {}) {
    this.loop = 1;
    this.score = 0; this.lives = TUNE.lives; this.nextLife = 20000;
    this.demo = !!opts.demo;
    this.startArea();
  }

  startArea() {
    this.clearEntities();
    const A = this.area;
    this.t = 0; this.tick = 0;
    this.joe = this.makeJoe(A.spawn.x, A.spawn.p);
    this.camP = A.spawn.p + this.R.offJoe; this.camX = 0; this.prevCamP = this.camP;
    this.encIdx = 0; this.encDone = new Set();
    this.patrolT = 4; this.chain = 0; this.chainT = 0;
    this.tokens = 0;
    this.rescued = 0; this.kills = 0;
    this.finale = null; this.areaClear = false;
    this.hitStop = 0;
    this.stats = { eshots: 0, hits: 0, nadesIn: 0, deaths: 0 };
    this.world.gateCol.alive = true;
    for (const d of this.world.dyn.doors) d.rotation.y = 0;
    for (const b of this.world.dyn.barrels) { b.alive = true; b.hp = b.red ? 2 : 6; b.mesh.visible = true; b.c.alive = true; }
    for (const c of this.world.dyn.crates) { c.hp = 3; c.mesh.visible = true; if (c.c) c.c.alive = true; }
    for (const pit of this.world.dyn.pits) { pit.alive = true; pit.tube.visible = true; }
    for (const b of this.world.dyn.bunkers) { b.alive = true; b.hp = 2; b.group.scale.set(1, 1, 1); b.group.traverse(o => { if (o.material && o.userData.baseCol) o.material.color.copy(o.userData.baseCol); }); }
    this.pows = A.pows.map((w, i) => this.makePow(w.x, w.p, i));
    this.state = 'intro'; this.stateT = 0;
    this.emit('intro');
  }

  clearEntities() {
    for (const e of this.enemies || []) this.scene.remove(e.s.obj);
    for (const c of this.corpses || []) this.scene.remove(c.obj);
    for (const w of this.pows || []) this.scene.remove(w.s.obj);
    for (const n of this.nades || []) { this.scene.remove(n.mesh); }
    for (const k of this.pickups || []) this.scene.remove(k.mesh);
    for (const tr of this.trucks || []) this.scene.remove(tr.mesh);
    if (this.joe) this.scene.remove(this.joe.s.obj);
    this.bunkers = []; this.enemies = []; this.corpses = []; this.bullets = []; this.ebullets = []; this.nades = []; this.pickups = []; this.trucks = []; this.pows = [];
    this.fx.clear();
  }

  makeJoe(x, p) {
    const s = new Soldier('joe');
    this.scene.add(s.obj);
    return { s, x, p, px: x, pp: p, vx: 0, vp: 0, leg: 0, aim: 0, hp: TUNE.joeHp, alive: true, invuln: TUNE.invulnSpawn, fireCd: 0, grenades: TUNE.grenStart, deadT: 0, throwT: -1, recoil: 0, moveDist: 0, stepAcc: 0 };
  }
  makePow(x, p, i) {
    const s = new Soldier('pow');
    s.a.crouch = 1;
    this.scene.add(s.obj);
    return { s, x, p, i, state: 'tied', t: 0, face: Math.PI };
  }

  emit(type, data) { this.events.push({ type, ...data }); }

  // ------------------------------------------------------------------ view helpers
  viewTop() { return this.camP - this.R.offTop; }
  viewBottom() { return this.camP - this.R.offBottom; }
  onScreen(x, p, pad = 0) { return p < this.viewTop() + pad && p > this.viewBottom() - pad && Math.abs(x - this.camX) < this.R.halfWidthTop + pad; }
  pan(x) { return clamp((x - this.camX) / 14, -0.9, 0.9); }
  h(x, p) { return this.world.h(x, p); }
  hw(p) { return this.T.halfWidth(p); }

  // ------------------------------------------------------------------ main step
  update(dt, I) {
    this.t += dt; this.tick++;
    this.stateT += dt;
    if (this.hitStop > 0) { this.hitStop -= dt; this.syncJoeVisual(dt); return; }
    switch (this.state) {
      case 'intro':
        if (this.stateT > 2.2) { this.state = 'play'; this.stateT = 0; }
        this.updateJoe(dt, I, true);
        break;
      case 'play':
      case 'dead':
        this.updateJoe(dt, I, false);
        break;
      case 'clear':
        this.updateJoe(dt, null, true);
        if (this.stateT > 6) { this.loop++; this.startArea(); }
        break;
      case 'over':
        if (this.stateT > 5) this.emit('gameover-done');
        break;
    }
    this.updateCamera(dt);
    if (this.state === 'play' || this.state === 'dead') { this.updateSpawns(dt); this.updateFinale(dt); }
    this.updateEnemies(dt);
    this.updateTrucks(dt);
    this.updateBullets(dt);
    this.updateNades(dt);
    this.updatePickups(dt);
    this.updatePows(dt);
    this.updateCorpses(dt);
    if (this.chainT > 0) { this.chainT -= dt; if (this.chainT <= 0) this.chain = 0; }
  }

  // ------------------------------------------------------------------ Joe
  updateJoe(dt, I, locked) {
    const J = this.joe;
    J.px = J.x; J.pp = J.p;
    if (J.invuln > 0) J.invuln -= dt;
    if (!J.alive) {
      J.deadT += dt;
      if (J.deadT > 2.4) this.respawnJoe();
      this.syncJoeVisual(dt); return;
    }
    let mx = 0, mp = 0, fire = false, gren = false, aimSet = false;
    if (I && !locked) {
      mx = I.mx; mp = I.mp; fire = I.fire; gren = I.gren;
      // aim: mouse ground point > stick vector > facing
      if (I.aimGround) {
        const g = this.R.groundAtNdc((I.aimGround.sx / innerWidth) * 2 - 1, -(I.aimGround.sy / innerHeight) * 2 + 1, this.h(J.x, J.p) + 1.0);
        const dx = g.x - J.x, dp = -g.z - J.p;
        if (Math.hypot(dx, dp) > 0.4) { J.aim = angOf(dx, dp); aimSet = true; J.aimDist = Math.hypot(dx, dp); }
      } else if (I.aimX || I.aimP) { J.aim = angOf(I.aimX, I.aimP); aimSet = true; J.aimDist = I.aimDist ?? null; }
    }
    if (this.state === 'clear' && !I) {
      // walk in through the gate and vanish into the fortress
      mp = 1; mx = clamp(-J.x * 0.8, -1, 1);
      if (J.p > this.area.wallP + 2.2) { J.s.obj.visible = false; J.inside = true; }
    }
    // movement with snappy acceleration
    const tvx = mx * TUNE.joeSpeed, tvp = mp * TUNE.joeSpeed;
    J.vx = approach(J.vx, tvx, TUNE.joeAccel * dt); J.vp = approach(J.vp, tvp, TUNE.joeAccel * dt);
    let nx = J.x + J.vx * dt, np = J.p + J.vp * dt;
    // keep inside the corridor and the camera window
    const hw = this.world.boundHalf(np);
    nx = clamp(nx, -hw, hw);
    if (this.state !== 'clear') np = clamp(np, this.viewBottom() + 1.2, this.viewTop() - 2.5);
    [nx, np] = this.col.resolve(nx, np, TUNE.joeRadius, 'joe');
    [nx, np] = this.resolveTrucks(nx, np, TUNE.joeRadius);
    const moved = Math.hypot(nx - J.x, np - J.p);
    J.x = nx; J.p = np;
    const spd = moved / dt;
    J.moveDist += moved;
    J.speedN = clamp(spd / TUNE.joeSpeed, 0, 1);
    // legs face travel; aim follows travel unless strafing/aiming
    if (spd > 0.5) {
      const mvAng = angOf(J.x - J.px, J.p - J.pp);
      J.leg = mvAng;
      if (!aimSet && !(I && I.strafe)) J.aim = mvAng;
    } else if (aimSet) J.leg = J.aim;
    // aim assist for stick/keys: nudge onto an enemy close to the line of fire
    if (I && !I.aimGround && fire) {
      let best = null, bestD = 0.26;
      for (const e of this.enemies) {
        if (!e.alive || !this.hittable(e)) continue;
        const dx = e.x - J.x, dp = e.p - J.p, dist = Math.hypot(dx, dp);
        if (dist > 20) continue;
        const d = Math.abs(angDiff(J.aim, angOf(dx, dp)));
        if (d < bestD) { bestD = d; best = e; }
      }
      if (best) J.aimFire = angOf(best.x - J.x, best.p - J.p); else J.aimFire = J.aim;
    } else J.aimFire = J.aim;
    // fire
    J.fireCd -= dt;
    if (fire && J.fireCd <= 0 && J.throwT < 0) {
      J.fireCd = TUNE.fireCd;
      const a = J.aimFire + (rnd() - 0.5) * 2 * TUNE.spread;
      const [dx, dp] = dirOf(a);
      const sx = J.x + dx * 0.75 + dp * -0.12, sp = J.p + dp * 0.75 - dx * -0.12;
      this.bullets.push({ x: sx, p: sp, vx: dx * TUNE.bulletSpeed, vp: dp * TUNE.bulletSpeed, life: TUNE.bulletLife, y: this.h(J.x, J.p) + 1.12 });
      J.recoil = 1; J.fired = true;
      this.audio.play('shot', { gain: 0.42, pan: this.pan(J.x), variance: 0.08 }, 45);
      J.brass = (J.brass || 0) + 1;
    }
    // grenade
    if (gren && J.grenades > 0 && J.throwT < 0) {
      J.throwT = 0; J.grenades--;
      J.throwAim = J.aim; J.throwDist = J.aimDist ? clamp(J.aimDist, 3.5, 13) : TUNE.grenRange;
      J.thrown = false;
    }
    if (J.throwT >= 0) {
      J.throwT += dt / 0.42;
      if (!J.thrown && J.throwT >= 0.55) {
        J.thrown = true;
        const [dx, dp] = dirOf(J.throwAim);
        const d = J.throwDist;
        this.launchNade(J.x + dx * 0.4, J.p + dp * 0.4, this.h(J.x, J.p) + 1.7, J.x + dx * d, J.p + dp * d, 0.5 + d * 0.035, 'joe');
        this.audio.thunk(this.pan(J.x));
      }
      if (J.throwT >= 1) J.throwT = -1;
    }
    J.recoil = Math.max(0, J.recoil - dt * 10);
    // footsteps
    if (J.speedN > 0.3) { J.stepAcc += moved; if (J.stepAcc > 1.1) { J.stepAcc = 0; this.audio.step(this.pan(J.x)); if (this.dusty(J.x, J.p)) this.fx.dust(J.x, this.h(J.x, J.p), -J.p, 1, [0.7, 0.6, 0.45], 0.6, 0.3); } }
    this.syncJoeVisual(dt);
  }

  dusty(x, p) { const w = this.T.biomeWeights(p); return (w.desert || 0) + (w.scrub || 0) + (w.fort || 0) > 0.4; }

  syncJoeVisual(dt) {
    const J = this.joe, s = J.s;
    s.obj.position.set(J.x, this.h(J.x, J.p), -J.p);
    const legAng = J.alive ? J.leg : J.leg;
    s.obj.rotation.y = Math.PI - legAng;
    const tw = -angDiff(legAng, J.aim);
    if (Math.abs(tw) > 1.2) { J.leg = J.aim + Math.sign(angDiff(J.aim, J.leg)) * 1.2; }
    s.a.twist = clamp(-angDiff(J.leg, J.aim), -1.2, 1.2);
    s.a.speed = J.speedN || 0;
    s.a.phase += (J.alive ? Math.hypot(J.x - J.px, J.p - J.pp) : 0) * (TAU / 2.3);
    s.a.recoil = J.recoil;
    s.a.throwT = J.throwT;
    if (!J.alive) { s.a.dead = Math.min(1, J.deadT * 2.6); }
    else s.a.dead = 0;
    // invulnerability blink
    s.obj.visible = !J.inside && !(J.alive && J.invuln > 0 && this.state !== 'intro' && Math.floor(this.t * 14) % 2 === 0);
    s.setFlash(J.hurtFlash > 0 ? J.hurtFlash : 0);
    if (J.hurtFlash > 0) J.hurtFlash -= dt * 4;
    s.pose(dt);
    if (J.fired) {
      J.fired = false;
      const m = s.muzzle(this._v);
      const [dx, dp] = dirOf(J.aimFire);
      this.fx.muzzle(m.x, m.y, m.z, dx, -dp);
      if (J.brass % 2 === 0) this.fx.brass(m.x - dx * 0.4, m.y - 0.1, m.z + dp * 0.4, dp, dx);
    }
  }

  damageJoe(n, fromX, fromP) {
    const J = this.joe;
    if (!J.alive || J.invuln > 0 || this.state !== 'play') return;
    if (this.godMode) return;
    J.hp -= n; J.invuln = TUNE.invulnHit; J.hurtFlash = 1; this.stats.hits++;
    const dx = J.x - fromX, dp = J.p - fromP, L = Math.hypot(dx, dp) || 1;
    this.R.addShake(0.5, dx / L * 0.25, -dp / L * 0.25);
    this.emit('hurt');
    if (J.hp <= 0) this.killJoe(fromX, fromP);
  }
  killJoe(fx, fp) {
    const J = this.joe;
    J.alive = false; J.deadT = 0; J.hp = 0;
    J.s.a.deadDir = (fp > J.p) ? 1 : -1; J.s.a.deadSpin = rnd() - 0.5;
    this.audio.play('player-death', { gain: 0.9 }, 200);
    this.R.addShake(0.8);
    this.state = 'dead'; this.stateT = 0;
    this.chain = 0;
    this.emit('joe-dead');
  }
  respawnJoe() {
    const J = this.joe;
    this.lives--;
    if (this.lives <= 0) { this.state = 'over'; this.stateT = 0; this.saveHi(); this.emit('gameover'); J.deadT = -1e9; return; }
    // clear the air around the respawn point
    this.ebullets = this.ebullets.filter(b => Math.hypot(b.x - J.x, b.p - J.p) > 9);
    for (const n of this.nades) if (n.owner !== 'joe' && Math.hypot(n.tx - J.x, n.tp - J.p) < 6) n.dud = true;
    J.alive = true; J.hp = TUNE.joeHp; J.invuln = TUNE.invulnSpawn; J.deadT = 0; J.throwT = -1;
    J.s.a.dead = 0;
    // stand back up somewhere walkable near where he fell
    const [x, p] = this.col.resolve(J.x, J.p, TUNE.joeRadius + 0.3, 'joe');
    J.x = x; J.p = p; J.px = x; J.pp = p;
    this.state = 'play'; this.stateT = 0;
    this.emit('respawn');
  }

  // ------------------------------------------------------------------ camera
  updateCamera(dt) {
    const J = this.joe, A = this.area;
    if (!Number.isFinite(this.camP)) this.camP = J.p + (Number.isFinite(this.R.offJoe) ? this.R.offJoe : 6);
    if (!Number.isFinite(this.camX)) this.camX = 0;
    this.prevCamP = this.camP;
    // the world ends at the fortress wall; during the gate fight frame the wall
    const cap = A.wallP + 9 + this.R.offTop;
    const target = this.finale ? Math.max(J.p + this.R.offJoe, cap) : J.p + this.R.offJoe;
    if (target > this.camP) this.camP = Math.min(target, this.camP + Math.max(0.5, (target - this.camP) * (this.finale ? 1.5 : 7)) * dt);
    this.camP = Math.min(this.camP, cap);
    // sideways: follow Joe when the corridor is wider than the view
    const hwJ = this.hw(J.p) + 3.5;
    const slack = Math.max(0, hwJ - this.R.halfWidthBottom * 0.92);
    const tx = clamp(J.x * 0.85, -slack, slack);
    this.camX += (tx - this.camX) * Math.min(1, dt * 4);
  }

  // ------------------------------------------------------------------ spawning
  updateSpawns(dt) {
    const A = this.area, top = this.viewTop();
    for (let i = 0; i < A.encounters.length; i++) {
      if (this.encDone.has(i)) continue;
      const e = A.encounters[i];
      const positional = ['place', 'trench', 'sniper', 'mortar', 'bunker'].includes(e.type) || e.from === 'place';
      const trig = positional ? e.at - 6 : e.at;
      if (top >= trig) { this.encDone.add(i); this.runEncounter(e); }
    }
    // background pressure
    const P = A.patrol;
    if (!this.finale && top > P.from && top < P.to) {
      this.patrolT -= dt * (0.8 + this.loop * 0.25);
      const alive = this.enemies.filter(e => e.alive && !e.static).length;
      if (this.patrolT <= 0) {
        this.patrolT = P.every * rr(0.8, 1.25);
        if (alive < P.cap + this.loop) {
          const n = 1 + ((rnd() * (2.2 + this.loop * 0.4)) | 0);
          const type = rnd() < P.types[1][1] ? 'lobber' : 'rifle';
          const side = rnd();
          for (let k = 0; k < n; k++) {
            if (side < 0.7) this.spawnFromNorth(type, clamp(this.T.roadX(top) + rr(-7, 7), -this.hw(top) + 1, this.hw(top) - 1), k * 1.4);
            else this.spawnFromSide(type, side < 0.85 ? -1 : 1, top - rr(3, 9), k * 1.2);
          }
        }
      }
    }
  }

  runEncounter(e) {
    const top = this.viewTop();
    switch (e.type) {
      case 'rifle': case 'lobber':
        if (e.from === 'north') e.xs.forEach((x, k) => this.spawnFromNorth(e.type, x, k * 0.9, e.ambush));
        else if (e.from === 'east' || e.from === 'west') (e.ps || [top - 5]).forEach((p, k) => this.spawnFromSide(e.type, e.from === 'east' ? 1 : -1, p, k * 0.8));
        else if (e.from === 'place') e.pts.forEach(([x, p]) => {
          const en = this.spawnEnemy(e.type, x, p, { state: e.cover ? 'cover' : 'fight', face: Math.PI });
          if (e.cover) { en.cover = true; en.coverP = p; en.coverX = x; }
          if (e.hut) { en.state = 'enter'; en.tx = x + rr(-2, 2); en.tp = p - 3; }
          if (e.guard) en.guard = true;
        });
        break;
      case 'trench': e.pts.forEach(([x, p]) => { const en = this.spawnEnemy('rifle', x, p, { state: 'trench', face: Math.PI }); en.trench = true; en.static = true; en.t = rr(0.5, 2); en.yOff = 0; en.points = SCORE.trench; }); break;
      case 'sniper': {
        const tw = this.world.dyn.towers[e.tower]; if (!tw) break;
        const en = this.spawnEnemy('rifle', tw.x, tw.p, { state: 'sniper', face: Math.PI });
        en.sniper = true; en.static = true; en.tower = tw; en.t = rr(1, 2); en.baseY = tw.deckY; en.points = SCORE.sniper;
        break;
      }
      case 'mortar': {
        const pit = this.world.dyn.pits[e.pit]; if (!pit || !pit.alive) break;
        const en = this.spawnEnemy('rifle', pit.x + 0.7, pit.p + 0.5, { state: 'mortar', face: Math.PI });
        en.mortar = true; en.static = true; en.pit = pit; en.t = 2.2; en.points = SCORE.mortar; en.noBullets = true;
        en.s.a.crouch = 1;
        break;
      }
      case 'bunker': {
        const b = this.world.dyn.bunkers[e.bunker]; if (!b) break;
        b.active = true; b.t = 2.0; b.burst = 0;
        this.bunkers = this.bunkers || []; if (!this.bunkers.includes(b)) this.bunkers.push(b);
        break;
      }
      case 'truck': this.spawnTruck(e.x, e.stopP); break;
    }
  }

  spawnFromNorth(type, x, delay = 0, ambush = false) {
    const top = this.viewTop(), wall = this.area.wallP - 1.2;
    let p = top + 3 + delay * 2.5;
    // near the fortress everyone comes out of the gate
    if (p > wall) { p = wall; x = clamp(x, -this.area.gateHalf + 1, this.area.gateHalf - 1); }
    const en = this.spawnEnemy(type, x, p, { state: 'enter', face: Math.PI });
    en.tx = clamp(x + rr(-2.5, 2.5), -this.hw(p) + 1, this.hw(p) - 1);
    en.tp = top - rr(4, ambush ? 6 : 9);
    return en;
  }
  spawnFromSide(type, side, p, delay = 0) {
    const hw = this.hw(p);
    const en = this.spawnEnemy(type, side * (hw + 5 + delay * 2), p, { state: 'enter', face: side > 0 ? -Math.PI / 2 : Math.PI / 2 });
    en.tx = side * (hw - rr(2, 5)); en.tp = p + rr(-2, 2);
    en.wild = 2.5;
    return en;
  }

  spawnEnemy(type, x, p, o = {}) {
    const s = new Soldier(type === 'lobber' ? 'lobber' : type === 'officer' ? 'officer' : 'rifle');
    this.scene.add(s.obj);
    const e = {
      type, s, x, p, px: x, pp: p, face: o.face ?? Math.PI, aim: o.face ?? Math.PI, state: o.state || 'enter', t: 0,
      hp: 1, alive: true, fireCd: rr(0.35, 0.8) / (0.85 + this.loop * 0.15), tx: x, tp: p, speed: 0, yOff: 0, yCur: 0,
      points: SCORE[type] || 100, flash: 0, lastSeen: 0, stuck: 0, id: Math.random(),
    };
    this.enemies.push(e);
    return e;
  }

  // ------------------------------------------------------------------ enemies
  hittable(e) {
    if (!e.alive || e.noBullets) return false;
    if (e.trench) return e.yCur > 0.35;
    if (e.inTruck) return false;
    return true;
  }

  updateEnemies(dt) {
    const J = this.joe;
    this.tokens = this.enemies.filter(e => e.alive && e.token).length;
    for (const e of this.enemies) {
      e.px = e.x; e.pp = e.p;
      if (!e.alive) continue;
      e.t -= dt;
      const dx = J.x - e.x, dp = J.p - e.p, dist = Math.hypot(dx, dp);
      const toJoe = angOf(dx, dp);
      let mvx = 0, mvp = 0, speed = 0;
      const visible = this.onScreen(e.x, e.p, 1);
      // despawn stragglers left far below the screen
      if (e.p < this.viewBottom() - (e.static ? 10 : 6) && e.state !== 'flee' && !e.finale) { this.removeEnemy(e); continue; }
      switch (e.state) {
        case 'enter': {
          const tdx = e.tx - e.x, tdp = e.tp - e.p, td = Math.hypot(tdx, tdp);
          if (td < 0.5 || e.t < -4) { e.state = e.type === 'lobber' ? 'approach' : 'fight'; e.t = rr(0.3, 1.0); break; }
          mvx = tdx / td; mvp = tdp / td; speed = TUNE.runSpeed; e.face = angOf(mvx, mvp);
          // run-and-gun: a snap shot on the way in once he's been on screen a moment
          if (visible) e.seen = (e.seen || 0) + dt;
          e.fireCd -= dt;
          if (e.type === 'rifle' && e.seen > 0.45 && e.fireCd <= 0 && dist < 17 && J.alive && this.state === 'play' && this.col.los(e.x, e.p, J.x, J.p, 1.4)) {
            e.fireCd = rr(1.4, 2.2); this.enemyFire(e, J, 0.08);
          }
          break;
        }
        case 'fight': case 'approach': case 'cover': {
          e.face = toJoe;
          const want = e.type === 'lobber' ? 8.5 : 11;
          e.fireCd -= dt;
          const los = dist < 24 && this.col.los(e.x, e.p, J.x, J.p, 1.4);
          if (e.state === 'cover') {
            e.s.a.crouch = approach(e.s.a.crouch, 1, dt * 4);
          } else if (e.t <= 0) {
            // reposition: close in if far or blind, otherwise sidestep
            e.t = rr(1.6, 3.2);
            let tx, tp;
            if (dist > 17 || !los) { tx = J.x + rr(-5, 5); tp = J.p + rr(want - 2, want + 3); }
            else { tx = e.x + rr(-4, 4); tp = e.p + rr(-1.5, 1.5); }
            if (rnd() < 0.12 * this.loop && e.type === 'rifle' && dist < 16) { e.state = 'charge'; e.t = 2.5; break; }
            const hwp = this.hw(tp) - 1;
            e.tx = clamp(tx, -hwp, hwp); e.tp = Math.max(tp, this.viewBottom() + 5);
            e.moving = true;
          }
          if (e.moving && e.state !== 'cover') {
            const tdx = e.tx - e.x, tdp = e.tp - e.p, td = Math.hypot(tdx, tdp);
            if (td < 0.4) e.moving = false; else { mvx = tdx / td; mvp = tdp / td; speed = TUNE.walkSpeed * 1.4; }
          }
          if (e.guard && dist > 14) { mvx = 0; mvp = 0; speed = 0; }
          if (e.fireCd <= 0 && los && visible && dist < 22 && J.alive && this.state === 'play') {
            if (e.type === 'lobber') {
              if (dist < 13) { e.state = 'throw'; e.t = 0.75; e.throwAt = { x: J.x + J.vx * 0.5 + rr(-1.2, 1.2), p: J.p + J.vp * 0.5 + rr(-1.2, 1.2) }; e.s.a.throwT = 0; }
            } else if (this.tokens < TUNE.maxAimers + (this.loop > 1 ? 1 : 0)) {
              e.prevState = e.state; e.state = 'aim'; e.t = 0.3; e.token = true; this.tokens++;
              e.burst = rnd() < 0.5 ? 3 : 1;
            }
          }
          break;
        }
        case 'aim': {
          e.face = toJoe; e.s.a.crouch = approach(e.s.a.crouch, 0, dt * 6);
          if (e.t <= 0) { this.enemyFire(e, J); e.burst--; e.t = 0.13; if (e.burst <= 0) { e.state = e.prevState === 'cover' ? 'cover' : 'fight'; e.token = false; e.fireCd = rr(1.1, 2.0) / (0.85 + this.loop * 0.15); e.t = rr(0.2, 0.8); } }
          break;
        }
        case 'charge': {
          e.face = toJoe; mvx = dx / (dist || 1); mvp = dp / (dist || 1); speed = TUNE.runSpeed * 0.9;
          e.fireCd -= dt;
          if (e.fireCd <= 0 && dist < 16 && visible) { e.fireCd = 0.9; this.enemyFire(e, J, 0.12); }
          if (dist < 3 || e.t <= 0) { e.state = 'fight'; e.t = 0.5; }
          break;
        }
        case 'throw': {
          e.face = angOf(e.throwAt.x - e.x, e.throwAt.p - e.p);
          e.s.a.throwT = clamp(1 - e.t / 0.75, 0, 1);
          if (!e.thrown && e.t < 0.3) {
            e.thrown = true;
            const [fx, fp] = dirOf(e.face);
            const d = Math.hypot(e.throwAt.x - e.x, e.throwAt.p - e.p);
            this.launchNade(e.x + fx * 0.4, e.p + fp * 0.4, this.h(e.x, e.p) + 1.7, e.throwAt.x, e.throwAt.p, 0.8 + d * 0.03, 'enemy');
          }
          if (e.t <= 0) { e.state = 'fight'; e.thrown = false; e.s.a.throwT = -1; e.fireCd = rr(2.8, 4.2) / (0.85 + this.loop * 0.15); e.t = rr(0.5, 1.2); }
          break;
        }
        case 'trench': {
          // duck, pop up, aim, fire, duck again
          e.face = toJoe;
          if (e.phase === undefined) e.phase = 'down';
          // yOff: 0 = crouched on the trench floor, 0.6 = up on the firing step
          if (e.phase === 'down') { e.yOff = approach(e.yOff, 0, dt * 4); e.s.a.crouch = approach(e.s.a.crouch, 1, dt * 6); if (e.t <= 0 && visible && dist < 22 && this.state === 'play') { e.phase = 'up'; e.t = 0.35; } }
          else if (e.phase === 'up') { e.yOff = approach(e.yOff, 0.6, dt * 3); e.s.a.crouch = approach(e.s.a.crouch, 0, dt * 5); if (e.t <= 0) { e.phase = 'aim'; e.t = 0.45; } }
          else if (e.phase === 'aim') { if (e.t <= 0) { if (J.alive) this.enemyFire(e, J); e.phase = 'hold'; e.t = rr(0.3, 0.8); } }
          else if (e.phase === 'hold') { if (e.t <= 0) { e.phase = 'down'; e.t = rr(1.2, 2.6) / (0.85 + this.loop * 0.15); } }
          break;
        }
        case 'sniper': this.updateSniper(e, dt, dist); break;
        case 'mortar': this.updateMortar(e, dt, dist); break;
        case 'flee': {
          const tdx = e.tx - e.x, tdp = e.tp - e.p, td = Math.hypot(tdx, tdp);
          if (td < 0.8) { this.removeEnemy(e); this.emit('officer-escaped'); continue; }
          mvx = tdx / td; mvp = tdp / td; speed = 5.2; e.face = angOf(mvx, mvp);
          e.fireCd -= dt;
          if (e.fireCd <= 0 && dist < 14) { e.fireCd = 1.3; e.aimOverride = toJoe; this.enemyFire(e, J, 0.15); }
          break;
        }
      }
      // integrate movement with collision
      if (speed > 0) {
        let nx = e.x + mvx * speed * dt, np = e.p + mvp * speed * dt;
        const lim = this.hw(np) + (e.state === 'enter' || e.state === 'flee' ? 8 : 0.5);
        nx = clamp(nx, -lim, lim);
        [nx, np] = this.col.resolve(nx, np, 0.38, 'enemy');
        [nx, np] = this.resolveTrucks(nx, np, 0.38);
        // soft separation from other soldiers
        for (const o of this.enemies) {
          if (o === e || !o.alive || o.static) continue;
          const sx = nx - o.x, sp = np - o.p, d = Math.hypot(sx, sp);
          if (d < 0.8 && d > 1e-4) { nx += sx / d * (0.8 - d) * 0.5; np += sp / d * (0.8 - d) * 0.5; }
        }
        const moved = Math.hypot(nx - e.x, np - e.p);
        if (moved < speed * dt * 0.25) { e.stuck += dt; if (e.stuck > 0.8) { e.t = 0; e.stuck = 0; e.moving = false; if (e.state === 'enter') { e.state = 'fight'; } } } else e.stuck = 0;
        e.x = nx; e.p = np;
        e.speedN = clamp(moved / dt / TUNE.runSpeed, 0, 1);
      } else e.speedN = 0;
    }
    this.enemies = this.enemies.filter(e => e.alive || e.keep);
  }

  enemyFire(e, J, extraErr = 0) {
    const s = e.sniper ? TUNE.eBulletSniper : TUNE.eBullet;
    const dx = J.x - e.x, dp = J.p - e.p, dist = Math.hypot(dx, dp);
    const lead = e.sniper ? 0 : (e.leadK ?? (e.leadK = rr(0.35, 1.0))) * dist / s;
    let a = e.aimOverride ?? angOf(dx + J.vx * lead, dp + J.vp * lead);
    e.aimOverride = null;
    const err = e.sniper ? 0.01 : 0.03 + dist * 0.0025 + extraErr;
    a += (rnd() - 0.5) * 2 * err;
    const [fx, fp] = dirOf(a);
    const y0 = e.sniper ? e.baseY + 1.3 : Math.max(0.9, this.h(e.x, e.p) + 1.1 + (e.trench ? e.yCur : 0));
    this.stats.eshots++;
    this.ebullets.push({ x: e.x + fx * 0.7, p: e.p + fp * 0.7, vx: fx * s, vp: fp * s, life: 2.2, y: y0, enemy: true, sniper: !!e.sniper, fromX: e.x, fromP: e.p, fromTrench: !!e.trench, owner: e });
    e.fired = true; e.face = a;
    this.audio.play('shot', { gain: 0.28, rate: e.sniper ? 0.8 : 1.15, pan: this.pan(e.x), variance: 0.1 }, 40);
  }

  updateSniper(e, dt, dist) {
    const J = this.joe;
    const tw = e.tower;
    e.face = angOf(J.x - e.x, J.p - e.p);
    if (!e.phase) e.phase = 'idle';
    const active = this.onScreen(e.x, e.p, -1) && dist < 26 && J.alive && this.state === 'play';
    if (e.phase === 'idle') { e.laser = 0; if (e.t <= 0 && active) { e.phase = 'track'; e.t = 1.05; } }
    else if (e.phase === 'track') { e.laser = 0.35 + (1.05 - e.t) * 0.3; e.lockX = J.x; e.lockP = J.p; if (!active) e.phase = 'idle'; if (e.t <= 0) { e.phase = 'lock'; e.t = 0.32; } }
    else if (e.phase === 'lock') { e.laser = 0.95; if (e.t <= 0) { e.aimOverride = angOf(e.lockX - e.x, e.lockP - e.p); this.enemyFire(e, { x: e.lockX, p: e.lockP, vx: 0, vp: 0 }); e.phase = 'idle'; e.t = rr(1.8, 2.8); e.laser = 0; } }
  }

  updateMortar(e, dt, dist) {
    const J = this.joe, pit = e.pit;
    if (!pit.alive) { this.killEnemy(e, 0, 0, true); return; }
    e.face = angOf(J.x - e.x, J.p - e.p);
    const active = dist < 30 && dist > 5 && this.onScreen(pit.x, pit.p, 6) && J.alive && this.state === 'play';
    if (e.t <= 0 && active) {
      e.t = rr(3.8, 4.8) / (0.85 + this.loop * 0.15);
      const tx = J.x + J.vx * 1.2 + rr(-1.2, 1.2), tp = J.p + J.vp * 1.2 + rr(-1.2, 1.2);
      this.launchNade(pit.x, pit.p, this.h(pit.x, pit.p) + 1.0, tx, tp, 1.9, 'mortar');
      e.s.a.throwT = 0.5; e.drop = 0.3;
      pit.tube.userData.kick = 1;
      const y = this.h(pit.x, pit.p);
      this.fx.muzzle(pit.x, y + 1.0, -pit.p, 0, -1, true);
      this.fx.dust(pit.x, y + 0.9, -pit.p, 4, [0.55, 0.52, 0.48], 1.2, 0.5);
      this.audio.thunk(this.pan(pit.x));
    }
    if (e.drop > 0) { e.drop -= dt; if (e.drop <= 0) e.s.a.throwT = -1; }
  }

  removeEnemy(e) { e.alive = false; e.keep = false; this.scene.remove(e.s.obj); if (e.token) this.tokens--; }

  killEnemy(e, fromX, fromP, silent = false, byBlast = false) {
    if (!e.alive) return;
    e.alive = false; e.token = false;
    const a = e.s.a;
    a.deadDir = (fromP > e.p) ? 1 : -1; a.deadSpin = rnd() - 0.5;
    a.throwT = -1; a.crouch = 0;
    this.corpses.push({ obj: e.s.obj, s: e.s, t: 0, e, fall: e.sniper ? e.baseY - this.h(e.x, e.p) : 0, byBlast, vx: (e.x - fromX), vp: (e.p - fromP) });
    this.kills++;
    this.chain++; this.chainT = 1.8;
    const mult = 1 + Math.min(4, Math.floor(this.chain / 3));
    const pts = e.points * mult;
    this.addScore(pts);
    const y = this.h(e.x, e.p) + 2;
    this.fx.text(e.x, y + (e.sniper ? e.baseY : 0), -e.p, mult > 1 ? `${pts}  x${mult}` : String(pts), pts >= 1000 ? 'big' : '');
    if (!silent) this.audio.play('enemy-down', { gain: 0.55, pan: this.pan(e.x) }, 50);
    // occasional supply drop
    const dropP = e.type === 'lobber' ? 0.45 : e.sniper ? 0 : 0.07;
    if (rnd() < dropP && !e.trench && !e.mortar) this.dropPickup(e.x, e.p, 'gren');
    if (this.finale && e.finale) this.finale.alive--;
    if (e.type === 'officer') { this.emit('officer-down'); }
    // tiny hit-stop sells the kill
    this.hitStop = Math.max(this.hitStop, byBlast ? 0.05 : 0.035);
  }

  updateCorpses(dt) {
    for (const c of this.corpses) {
      c.t += dt;
      const s = c.s, e = c.e;
      if (c.t < 0.5 && !c.done) {
        // knockback slide and fall from towers
        const k = (c.byBlast ? 5 : 2.2) * (1 - c.t * 2) * dt;
        const L = Math.hypot(c.vx, c.vp) || 1;
        e.x += c.vx / L * k; e.p += c.vp / L * k;
      }
      s.a.dead = Math.min(1, c.t * 2.8);
      s.a.speed = 0; s.a.recoil = 0;
      let y = this.h(e.x, e.p) + (e.trench ? e.yCur : 0);
      if (c.fall > 0) { const f = Math.max(0, c.fall - 9.8 * c.t * c.t * 0.5); y += f; }
      s.obj.position.set(e.x, y, -e.p);
      s.obj.rotation.y = Math.PI - e.face;
      s.setFlash(Math.max(0, 0.9 - c.t * 8));
      s.pose(dt);
      if (c.t > 7) { s.obj.position.y -= (c.t - 7) * 0.4; }
      if (c.t > 9) c.dead = true;
    }
    this.corpses = this.corpses.filter(c => { if (c.dead) this.scene.remove(c.obj); return !c.dead; });
    if (this.corpses.length > 26) { const c = this.corpses.shift(); this.scene.remove(c.obj); }
  }

  // ------------------------------------------------------------------ bullets
  updateBullets(dt) {
    const J = this.joe;
    // Joe's rounds
    for (const b of this.bullets) {
      const x0 = b.x, p0 = b.p;
      b.x += b.vx * dt; b.p += b.vp * dt; b.life -= dt;
      if (b.life <= 0) { b.dead = true; continue; }
      // soldiers first (closest along the segment)
      let hitE = null, hitT = 2;
      for (const e of this.enemies) {
        if (!this.hittable(e)) continue;
        const t = segCircle(x0, p0, b.x, b.p, e.x, e.p, e.sniper ? 0.7 : HITBOX);
        if (t !== null && t < hitT) { hitT = t; hitE = e; }
      }
      for (const tr of this.trucks) {
        if (tr.dead) continue;
        const t = segBox(x0, p0, b.x, b.p, tr);
        if (t !== null && t < hitT) { hitT = t; hitE = tr; }
      }
      let wall = this.col.bulletHit(x0, p0, b.x, b.p);
      // a soldier standing up behind sandbags to shoot is exposed above them
      if (wall && wall.c.cover) {
        for (const e of this.enemies) {
          if (!this.hittable(e) || e.s.a.crouch > 0.5) continue;
          if (Math.hypot(e.x - wall.x, e.p - wall.p) < 1.8 && (e.x - wall.x) * b.vx + (e.p - wall.p) * b.vp > 0) { wall = null; break; }
        }
      }
      if (wall && wall.t < hitT) {
        b.dead = true;
        const c = wall.c;
        this.fx.impact(wall.x, b.y - 0.3, -wall.p, c.water ? 'water' : c.cover ? 'sand' : c.k === 'b' ? 'wood' : 'stone');
        if (c.ref) this.damageProp(c.ref, 1, wall.x, wall.p);
        continue;
      }
      if (hitE) {
        b.dead = true;
        const hx = x0 + (b.x - x0) * hitT, hp = p0 + (b.p - p0) * hitT;
        if (hitE.truck) { this.damageTruck(hitE, 1, hx, hp); continue; }
        const L = Math.hypot(b.vx, b.vp);
        this.fx.hit(hx, (hitE.sniper ? hitE.baseY : this.h(hx, hp)) + 1.1, -hp, b.vx / L, -b.vp / L);
        hitE.hp--;
        if (hitE.hp <= 0) this.killEnemy(hitE, x0, p0);
        else hitE.flashT = 1;
        continue;
      }
    }
    // bullets that expire mid-air kick up a little dust where they land
    for (const b of this.bullets) if (b.dead && b.life <= 0) this.fx.impact(b.x, this.h(b.x, b.p), -b.p, this.dusty(b.x, b.p) ? 'sand' : 'dirt');
    this.bullets = this.bullets.filter(b => !b.dead);
    // enemy rounds
    for (const b of this.ebullets) {
      const x0 = b.x, p0 = b.p;
      b.x += b.vx * dt; b.p += b.vp * dt; b.life -= dt; b.age = (b.age || 0) + dt;
      if (b.life <= 0 || b.p < this.viewBottom() - 4 || b.p > this.viewTop() + 8) { b.dead = true; continue; }
      if (J.alive && segCircle(x0, p0, b.x, b.p, J.x, J.p, 0.42) !== null && J.invuln <= 0 && this.state === 'play') {
        b.dead = true;
        this.fx.hit(J.x, this.h(J.x, J.p) + 1.1, -J.p, b.vx / 14, -b.vp / 14);
        this.damageJoe(1, b.fromX, b.fromP);
        continue;
      }
      // ignore cover right beside the shooter (they fire over their own sandbags)
      const wall = this.col.bulletHit(x0, p0, b.x, b.p);
      if (wall && Math.hypot(wall.x - b.fromX, wall.p - b.fromP) > 1.4) {
        b.dead = true; this.fx.impact(wall.x, b.y - 0.3, -wall.p, wall.c.cover ? 'sand' : 'stone');
        continue;
      }
    }
    this.ebullets = this.ebullets.filter(b => !b.dead);
  }

  // ------------------------------------------------------------------ grenades & shells
  launchNade(x, p, y, tx, tp, T, owner) {
    const mesh = new THREE.Mesh(this.nadeGeo, owner === 'mortar' ? this.shellMat : this.nadeMat);
    mesh.castShadow = true;
    this.scene.add(mesh);
    const ty = this.h(tx, tp);
    const n = { x, p, y, sx: x, sp: p, sy: y, tx, tp, ty, t: 0, T, owner, mesh, apex: owner === 'mortar' ? 14 : 2.2 + Math.hypot(tx - x, tp - p) * 0.12 };
    if (owner !== 'joe') n.ring = this.fx.ring(tx, -tp, ty, owner === 'mortar' ? 2.8 : 2.4, 0, [1.3, 0.16, 0.08], 'tele');
    n.blob = this.fx.blob(x, -p, this.h(x, p), 0.3);
    this.nades.push(n);
  }

  updateNades(dt) {
    for (const n of this.nades) {
      n.t += dt;
      const k = Math.min(1, n.t / n.T);
      n.x = lerp(n.sx, n.tx, k); n.p = lerp(n.sp, n.tp, k);
      n.y = lerp(n.sy, n.ty + 0.1, k) + Math.sin(k * Math.PI) * n.apex;
      n.mesh.position.set(n.x, n.y, -n.p);
      n.mesh.rotation.x += dt * 12;
      const gh = this.h(n.x, n.p);
      n.blob.position.set(n.x, gh + 0.04, -n.p);
      const bs = 0.25 + 0.2 * (1 - Math.min(1, (n.y - gh) / 6));
      n.blob.scale.set(bs * 2, 1, bs * 2);
      if (k >= 1) {
        n.dead = true;
        this.scene.remove(n.mesh); n.blob.visible = false; if (n.ring) n.ring.visible = false;
        if (!n.dud) this.explode(n.tx, n.tp, n.owner === 'joe' ? TUNE.grenRadius : n.owner === 'mortar' ? 2.8 : 2.5, n.owner);
      }
    }
    this.nades = this.nades.filter(n => !n.dead);
  }

  explode(x, p, r, owner, opts = {}) {
    const y = this.h(x, p);
    const inWater = this.T.riverDepth(x, p) > 0.4 || this.T.pondDepth(x, p) > 0.4;
    this.fx.explosion(x, inWater ? -0.6 : y, -p, r, { debris: inWater ? [0.8, 0.9, 1] : this.dusty(x, p) ? [0.55, 0.45, 0.32] : [0.35, 0.28, 0.2] });
    const J = this.joe;
    const dj = Math.hypot(J.x - x, J.p - p);
    this.R.addShake(clamp(1.1 - dj / 22, 0.15, 0.9) * (r > 3 ? 1 : 0.8));
    this.audio.play('explosion', { gain: clamp(1.2 - dj / 30, 0.3, 1), pan: this.pan(x) }, 40);
    this.emit('boom', { x, p });
    // soldiers
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const d = Math.hypot(e.x - x, e.p - p);
      if (e.mortar && e.pit && Math.hypot(e.pit.x - x, e.pit.p - p) < r + 0.8 && owner !== 'mortar') { e.pit.alive = false; e.pit.tube.visible = false; this.killEnemy(e, x, p, false, true); continue; }
      if (e.sniper) { if (d < r * 0.8 && owner !== 'mortar') this.killEnemy(e, x, p, false, true); continue; }
      if (d < r + 0.2) this.killEnemy(e, x, p, false, true);
    }
    if (owner === 'enemy' || owner === 'mortar' || owner === 'barrel') {
      if (dj < r * 0.85 && J.alive) this.damageJoe(owner === 'barrel' ? 2 : 1, x, p);
    }
    // vehicles, bunkers, barrels, crates
    for (const tr of this.trucks) if (!tr.dead && Math.hypot(tr.x - x, tr.p - p) < r + 2.2) this.damageTruck(tr, 99, x, p);
    for (const b of this.bunkers || []) {
      if (!b.alive || owner === 'enemy' || owner === 'mortar') continue;
      if (Math.hypot(b.x - x, b.p - p) < r + 2.2) { b.hp--; this.fx.dust(b.x, this.h(b.x, b.p) + 1, -b.p, 6, [0.6, 0.58, 0.54], 2, 0.8); if (b.hp <= 0) this.destroyBunker(b); }
    }
    for (const b of this.world.dyn.barrels) if (b.alive && Math.hypot(b.x - x, b.p - p) < r + 0.3) this.damageProp({ barrel: b }, 99, x, p, 0.12);
    for (const c of this.world.dyn.crates) if (c.mesh.visible && Math.hypot(c.x - x, c.p - p) < r) this.damageProp({ crate: c }, 99, x, p);
  }

  damageProp(ref, n, x, p, delay = 0) {
    if (ref.barrel) {
      const b = ref.barrel; if (!b.alive) return;
      b.hp -= n;
      if (b.hp <= 0) {
        b.alive = false; b.c.alive = false; b.mesh.visible = false;
        if (b.red) setTimeout(() => this.explode(b.x, b.p, 3.1, 'barrel'), delay * 1000 + 60);
        else this.fx.dust(b.x, this.h(b.x, b.p), -b.p, 4);
      }
    } else if (ref.crate) {
      const c = ref.crate; if (!c.mesh.visible) return;
      c.hp -= n;
      if (c.hp <= 0) {
        c.mesh.visible = false; if (c.c) c.c.alive = false;
        const y = this.h(c.x, c.p);
        for (let i = 0; i < 10; i++) this.fx.debris.push({ x: c.x, y: y + 0.5, z: -c.p, vx: (rnd() - 0.5) * 5, vy: 2 + rnd() * 4, vz: (rnd() - 0.5) * 5, s: [0.4, 0.04, 0.1], rx: rnd() * 6, ry: rnd() * 6, spin: 9, life: 2, col: [0.55, 0.42, 0.28], bounce: 0.3 });
        this.fx.dust(c.x, y, -c.p, 4);
        if (!c.stacked && rnd() < 0.65) this.dropPickup(c.x, c.p, rnd() < 0.7 ? 'gren' : 'med');
      }
    }
  }

  destroyBunker(b) {
    b.alive = false; b.active = false;
    this.explode(b.x, b.p + 0.5, 4.2, 'bunker');
    b.group.scale.set(1, 0.45, 1);
    b.group.traverse(o => { if (o.material && o.material.color) { o.userData.baseCol = o.userData.baseCol || o.material.color.clone(); o.material = o.material.clone(); o.material.color.multiplyScalar(0.35); } });
    this.addScore(SCORE.bunker);
    this.fx.text(b.x, this.h(b.x, b.p) + 3, -b.p, String(SCORE.bunker), 'big');
  }

  updateBunkers(dt) {
    const J = this.joe;
    for (const b of this.bunkers || []) {
      if (!b.alive || !b.active) continue;
      b.t -= dt;
      const dist = Math.hypot(J.x - b.x, J.p - b.p);
      const inFront = J.p < b.p + 1;
      if (b.burst > 0) {
        b.bt -= dt;
        if (b.bt <= 0) {
          b.bt = 0.085; b.burst--;
          const base = angOf(J.x - b.x, J.p - b.p);
          const a = base + (b.burst - 2) * 0.11 + (rnd() - 0.5) * 0.05;
          const [fx, fp] = dirOf(a);
          const sx = b.x + fx * 2.2, sp = b.p + fp * 2.2;
          this.ebullets.push({ x: sx, p: sp, vx: fx * 15, vp: fp * 15, life: 2, y: this.h(b.x, b.p) + 1.15, enemy: true, fromX: sx, fromP: sp });
          this.fx.muzzle(sx, this.h(b.x, b.p) + 1.15, -sp, fx, -fp);
          this.audio.play('shot', { gain: 0.3, rate: 0.9, pan: this.pan(b.x) }, 40);
        }
      } else if (b.t <= 0 && dist < 21 && inFront && J.alive && this.state === 'play' && this.onScreen(b.x, b.p, 0)) {
        b.t = rr(2.3, 3.0); b.burst = 5; b.bt = 0.45;
        // warning glint at the slit
        this.fx.light(b.x, this.h(b.x, b.p) + 1.2, -(b.p - 1.9), 8, 0.4, 0xff5030);
      }
    }
  }

  // ------------------------------------------------------------------ trucks
  spawnTruck(x, stopP) {
    const mesh = M.truckGroup();
    const top = this.viewTop();
    const tr = { truck: true, x, p: top + 14, px: x, pp: top + 14, stopP: Math.min(stopP, top - 3), state: 'drive', t: 0, hp: 12, mesh, cargo: 4, hw: 1.15, hl: 3.2, speed: 8, dead: false };
    mesh.rotation.y = 0; // model faces +Z = south
    this.scene.add(mesh);
    this.trucks.push(tr);
  }
  updateTrucks(dt) {
    for (const tr of this.trucks) {
      tr.px = tr.x; tr.pp = tr.p;
      if (tr.dead) { tr.mesh.position.set(tr.x, this.h(tr.x, tr.p), -tr.p); continue; }
      tr.t += dt;
      if (tr.state === 'drive') {
        const rem = tr.p - tr.stopP;
        tr.speed = Math.min(8, Math.max(0.6, rem * 1.2));
        tr.p -= tr.speed * dt;
        tr.x = lerp(tr.x, this.T.roadX(tr.p), dt * 2);
        if (rem < 0.05) { tr.state = 'unload'; tr.t = 0; }
      } else if (tr.state === 'unload') {
        if (tr.cargo > 0 && tr.t > 0.5) {
          tr.t = 0.15; tr.cargo--;
          const side = tr.cargo % 2 ? 1 : -1;
          const en = this.spawnEnemy('rifle', tr.x + side * 0.6, tr.p + tr.hl + 0.4, { state: 'enter' });
          en.tx = tr.x + side * rr(3, 7); en.tp = tr.p + rr(-2, 3);
        } else if (tr.cargo <= 0 && tr.t > 2.5) { tr.state = 'leave'; tr.t = 0; }
      } else if (tr.state === 'leave') {
        // back out fast: it must never trail along the road in front of Joe
        tr.p += Math.min(11, 2 + tr.t * 5) * dt;
        tr.x = lerp(tr.x, this.T.roadX(tr.p), dt * 2);
        if (tr.p > this.viewTop() + 10 || tr.t > 9) { tr.gone = true; this.scene.remove(tr.mesh); }
      }
      const y = this.h(tr.x, tr.p);
      tr.mesh.position.set(tr.x, y + Math.sin(tr.t * 30) * 0.015 * (tr.state === 'unload' ? 0.3 : 1), -tr.p);
    }
    this.trucks = this.trucks.filter(t => !t.gone);
    this.updateBunkers(dt);
    // mortar tube kick animation
    for (const pit of this.world.dyn.pits) { const k = pit.tube.userData.kick || 0; if (k > 0) { pit.tube.userData.kick = Math.max(0, k - dt * 5); pit.tube.position.y = this.h(pit.x, pit.p) - k * 0.12; } }
  }
  damageTruck(tr, n, x, p) {
    if (tr.dead) return;
    tr.hp -= n;
    this.fx.impact(x, this.h(x, p) + 1, -p, 'stone');
    if (tr.hp <= 0) {
      tr.dead = true;
      this.explode(tr.x, tr.p, 4.2, 'truck');
      tr.mesh.traverse(o => { if (o.material) { o.material = o.material.clone(); if (o.material.color) o.material.color.multiplyScalar(0.25); } });
      tr.mesh.rotation.z = 0.08;
      this.addScore(SCORE.truck + tr.cargo * 100);
      this.fx.text(tr.x, this.h(tr.x, tr.p) + 3, -tr.p, String(SCORE.truck + tr.cargo * 100), 'big');
      this.col.add({ k: 'b', x: tr.x, p: tr.p, hw: tr.hw, hp: tr.hl, bul: true });
      tr.static = true;
    }
  }
  resolveTrucks(x, p, r) {
    for (const tr of this.trucks) {
      if (tr.static) continue;
      const v = boxPush(tr, x, p, r);
      if (v) { x += v[0]; p += v[1]; }
    }
    return [x, p];
  }

  // ------------------------------------------------------------------ POWs & pickups
  updatePows(dt) {
    const J = this.joe;
    for (const w of this.pows) {
      const s = w.s;
      w.t += dt;
      if (w.state === 'tied') {
        s.a.crouch = 1; s.a.speed = 0;
        if (J.alive && Math.hypot(J.x - w.x, J.p - w.p) < 1.3) {
          w.state = 'free'; w.t = 0;
          this.rescued++;
          this.addScore(SCORE.pow);
          J.grenades = Math.min(TUNE.grenMax, J.grenades + 2);
          this.fx.text(w.x, this.h(w.x, w.p) + 2.4, -w.p, 'RESCUED +500', 'big');
          this.audio.play('ready', { gain: 0.6 }, 100);
          this.emit('pow');
        }
      } else if (w.state === 'free') {
        s.a.crouch = approach(s.a.crouch, 0, dt * 3);
        if (w.t > 0.6) {
          s.a.speed = 1; w.face = Math.PI;
          w.p -= 5 * dt; s.a.phase += 5 * dt * (TAU / 2.3);
          if (w.p < this.viewBottom() - 3) { w.state = 'gone'; this.scene.remove(s.obj); }
        }
      }
      if (w.state !== 'gone') {
        s.obj.position.set(w.x, this.h(w.x, w.p), -w.p);
        s.obj.rotation.y = Math.PI - w.face;
        s.pose(dt);
      }
    }
  }

  dropPickup(x, p, kind) {
    const mesh = new THREE.Mesh(this.pickupGeo[kind], this.pickupMat[kind]);
    mesh.scale.setScalar(0.42); mesh.castShadow = true;
    this.scene.add(mesh);
    this.pickups.push({ x, p, kind, t: 0, mesh });
  }
  updatePickups(dt) {
    const J = this.joe;
    for (const k of this.pickups) {
      k.t += dt;
      const y = this.h(k.x, k.p);
      k.mesh.position.set(k.x, y + 0.25 + Math.sin(k.t * 4) * 0.08, -k.p);
      k.mesh.rotation.y += dt * 1.6;
      k.mesh.visible = k.t < 11 || Math.floor(k.t * 8) % 2 === 0;
      if (J.alive && Math.hypot(J.x - k.x, J.p - k.p) < 1.1) {
        k.dead = true;
        if (k.kind === 'gren') { J.grenades = Math.min(TUNE.grenMax, J.grenades + 3); this.fx.text(k.x, y + 1.6, -k.p, '+3 GRENADES'); }
        else { J.hp = Math.min(TUNE.joeHp, J.hp + 1); this.fx.text(k.x, y + 1.6, -k.p, '+1 HEALTH'); }
        this.audio.tink(this.pan(k.x));
      }
      if (k.t > 14 || k.p < this.viewBottom() - 4) k.dead = true;
    }
    this.pickups = this.pickups.filter(k => { if (k.dead) this.scene.remove(k.mesh); return !k.dead; });
  }

  // ------------------------------------------------------------------ finale
  updateFinale(dt) {
    const A = this.area, J = this.joe, F = A.finale;
    if (!this.finale) {
      if (J.p >= F.triggerP) {
        this.finale = { phase: 'open', t: 0, wave: 0, alive: 0, spawnQ: 0, spawnT: 0, officer: null };
        this.emit('finale');
      }
      return;
    }
    const f = this.finale;
    f.t += dt;
    const doors = this.world.dyn.doors;
    if (f.phase === 'open') {
      const k = Math.min(1, f.t / 1.4);
      doors[0].rotation.y = -k * 1.7; doors[1].rotation.y = k * 1.7;
      if (f.t > 1.4) { f.phase = 'waves'; f.t = 0; }
    } else if (f.phase === 'waves') {
      if (f.spawnQ > 0) {
        f.spawnT -= dt;
        if (f.spawnT <= 0) {
          f.spawnT = 0.38; f.spawnQ--;
          const x = rr(-2.6, 2.6);
          const e = this.spawnEnemy(rnd() < 0.2 ? 'lobber' : 'rifle', x, A.wallP - 0.6, { state: 'enter' });
          e.finale = true; e.tx = rr(-12, 12); e.tp = A.wallP - rr(4, 11); f.alive++;
        }
      } else if ((f.alive = this.enemies.filter(e => e.alive && e.finale).length) <= 1 || f.t > 14) {
        if (f.wave < F.waves.length) { f.spawnQ = F.waves[f.wave] + (this.loop - 1); f.wave++; f.t = 0; }
        else if (F.officer && !f.officerDone) {
          f.officerDone = true;
          const side = rnd() < 0.5 ? -1 : 1;
          const o = this.spawnEnemy('officer', 0, A.wallP - 0.6, { state: 'flee' });
          o.tx = side * (this.hw(A.wallP - 6) + 7); o.tp = A.wallP - 7; o.finale = true; o.fireCd = 1; f.alive++;
          f.officer = o;
          this.emit('officer');
        } else if (f.alive <= 0 || f.t > 25) { f.phase = 'done'; this.world.gateCol.alive = false; this.emit('gate-open'); }
      }
    } else if (f.phase === 'done') {
      if (J.p > A.wallP + 0.8 && this.state === 'play') {
        this.state = 'clear'; this.stateT = 0;
        const bonus = 3000 + this.rescued * 1000;
        this.addScore(bonus);
        this.saveHi();
        this.emit('clear', { bonus });
      }
    }
    if (f.officer && !f.officer.alive && !f.officerCounted) { f.officerCounted = true; }
  }

  // ------------------------------------------------------------------ scoring
  addScore(n) {
    if (this.demo) return;
    this.score += n;
    if (this.score >= this.nextLife) { this.lives++; this.nextLife += 40000; this.emit('extra-life'); }
    if (this.score > this.hi) this.hi = this.score;
  }
  loadHi() { try { return +(localStorage.getItem('commandoNext.hi') || 50000); } catch (e) { return 50000; } }
  saveHi() { if (this.demo) return; try { localStorage.setItem('commandoNext.hi', String(this.hi)); } catch (e) {} }

  // ------------------------------------------------------------------ per-frame visual sync
  syncVisuals(dt) {
    // tracers are drawn from the live rounds each frame
    const tl = this.fx.trList; tl.length = 0;
    for (const b of this.bullets) tl.push(b);
    for (const b of this.ebullets) tl.push(b);
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const s = e.s;
      if (e.trench) e.yCur = e.yOff;
      const baseY = e.sniper ? e.baseY : this.h(e.x, e.p) + (e.trench ? e.yCur : 0);
      s.obj.position.set(e.x, baseY, -e.p);
      s.obj.rotation.y = Math.PI - e.face;
      s.a.speed = e.speedN || 0;
      s.a.phase += Math.hypot(e.x - e.px, e.p - e.pp) * (TAU / 2.2);
      if (e.state === 'cover' && e.state !== 'aim') s.a.crouch = approach(s.a.crouch, 1, dt * 4);
      else if (!e.trench && !e.mortar) s.a.crouch = approach(s.a.crouch, 0, dt * 5);
      s.a.recoil = Math.max(0, (s.a.recoil || 0) - dt * 8);
      if (e.flashT > 0) e.flashT -= dt * 6;
      s.setFlash(Math.max(0, (e.flashT || 0)));
      s.pose(dt);
      if (e.fired) {
        e.fired = false; s.a.recoil = 1;
        const m = s.muzzle(this._v); const [dx, dp] = dirOf(e.face);
        this.fx.muzzle(m.x, m.y, m.z, dx, -dp);
      }
    }
    // sniper lasers
    let li = 0;
    for (const e of this.enemies) {
      if (!e.sniper || !e.alive) continue;
      if (e.laser > 0) {
        const tx = e.phase === 'lock' ? e.lockX : this.joe.x, tp = e.phase === 'lock' ? e.lockP : this.joe.p;
        this.fx.laser(li, e.x, e.baseY + 1.35, -e.p, tx, this.h(tx, tp) + 1.0, -tp, e.laser);
      } else this.fx.laser(li, 0, 0, 0, 0, 0, 0, 0);
      li++;
    }
    for (; li < this.fx.lasers.length; li++) this.fx.laser(li, 0, 0, 0, 0, 0, 0, 0);
  }

  // current snapshot for tests & the HUD
  snapshot() {
    const J = this.joe;
    return {
      state: this.state, t: +this.t.toFixed(2), score: this.score, hi: this.hi, lives: this.lives, loop: this.loop,
      joe: { x: +J.x.toFixed(2), p: +J.p.toFixed(2), hp: J.hp, alive: J.alive, grenades: J.grenades, invuln: +J.invuln.toFixed(2) },
      camP: +this.camP.toFixed(2), top: +this.viewTop().toFixed(1), bottom: +this.viewBottom().toFixed(1),
      enemies: this.enemies.filter(e => e.alive).length, ebullets: this.ebullets.length, bullets: this.bullets.length,
      nades: this.nades.length, trucks: this.trucks.length, rescued: this.rescued, kills: this.kills,
      finale: this.finale ? { phase: this.finale.phase, wave: this.finale.wave, alive: this.finale.alive } : null, stats: this.stats,
    };
  }
}

// ------------------------------------------------------------------ geometry helpers
function segCircle(x0, p0, x1, p1, cx, cp, r) {
  const dx = x1 - x0, dp = p1 - p0, fx = x0 - cx, fp = p0 - cp;
  const a = dx * dx + dp * dp, b = 2 * (fx * dx + fp * dp), c = fx * fx + fp * fp - r * r;
  if (c <= 0) return 0;
  if (a < 1e-9) return null;
  const disc = b * b - 4 * a * c; if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2 * a);
  return t >= 0 && t <= 1 ? t : null;
}
function segBox(x0, p0, x1, p1, tr) {
  // truck: axis-aligned box centred on (x,p), half sizes hw (x) and hl (p)
  let t0 = 0, t1 = 1;
  const d = [x1 - x0, p1 - p0], o = [x0 - tr.x, p0 - tr.p], h = [tr.hw, tr.hl];
  for (let i = 0; i < 2; i++) {
    if (Math.abs(d[i]) < 1e-9) { if (Math.abs(o[i]) > h[i]) return null; continue; }
    let a = (-h[i] - o[i]) / d[i], b = (h[i] - o[i]) / d[i];
    if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a); t1 = Math.min(t1, b);
    if (t0 > t1) return null;
  }
  return t0;
}
function boxPush(tr, x, p, r) {
  const lx = x - tr.x, lp = p - tr.p;
  const cx = clamp(lx, -tr.hw, tr.hw), cp = clamp(lp, -tr.hl, tr.hl);
  const ox = lx - cx, op = lp - cp, d = Math.hypot(ox, op);
  if (d > 1e-5) { if (d >= r) return null; return [ox / d * (r - d), op / d * (r - d)]; }
  const ex = tr.hw - Math.abs(lx), ep = tr.hl - Math.abs(lp);
  return ex < ep ? [Math.sign(lx || 1) * (ex + r), 0] : [0, Math.sign(lp || 1) * (ep + r)];
}
