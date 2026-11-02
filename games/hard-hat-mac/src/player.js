// Mac: movement, ladders, carrying, riveting, damage.
import * as THREE from 'three';
import { Puppet } from './characters.js';
import { moveBody, GRAVITY } from './physics.js';
import { clamp, angleDamp, wrapAngle, rr } from './util.js';

const V = new THREE.Vector3();
const RUN = 5.4, JUMP = 9.7, JUMP_CARRY = 8.4, FATAL_FALL = 7.3;

export class Player {
  constructor(game) {
    this.game = game; this.rig = new Puppet('mac');
    this.body = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, r: .33, h: 1.75, onGround: false, ground: null };
    this.root = this.rig.root;
    // landing marker straight below Mac (helps judge jumps in 3D)
    this.marker = new THREE.Mesh(new THREE.CircleGeometry(.34, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .32, depthWrite: false }));
    this.marker.rotation.x = -Math.PI / 2; this.marker.renderOrder = 2;
    this.reset({ x: 0, y: 0, z: 0, yaw: 0 });
  }
  reset(sp) {
    const b = this.body; Object.assign(b, { x: sp.x, y: sp.y, z: sp.z, vx: 0, vy: 0, vz: 0, onGround: false, ground: null });
    this.yaw = sp.yaw || 0; this.state = 'normal'; this.carry = null; this.ladder = null; this.climbPhase = 0;
    this.coyote = 0; this.jumpBuf = 0; this.airMax = sp.y; this.invuln = 2.2; this.coffee = 0; this.shield = this.shield || false;
    this.dead = false; this.deadT = 0; this.noGrab = 0; this.rivetSock = null; this.rivetSnd = 0; this.lastStep = 0; this.screamed = false;
    this.rig.body.visible = true; this.rig.body.rotation.set(0, 0, 0); this.rig.body.position.set(0, 0, 0);
    this.root.position.set(b.x, b.y, b.z); this.root.rotation.y = this.yaw;
  }
  get pos() { return V.set(this.body.x, this.body.y, this.body.z); }
  launch() { this.state = 'normal'; this.ladder = null; this.airMax = this.body.y; this.game.audio.play('spring', { vol: .7 }); }
  attachCarry(o) {
    this.carry = o; const m = o.mesh;
    if (o.kind === 'girder') { this.rig.shoulderAnchor.add(m); m.position.set(0, .08, 0); m.rotation.set(0, Math.PI / 2, 0); m.scale.setScalar(.72); }
    else if (o.kind === 'topbeam') { this.rig.frontAnchor.add(m); m.position.set(0, -.15, .05); m.rotation.set(0, 0, 0); m.scale.setScalar(.6); }
    else { this.rig.frontAnchor.add(m); m.position.set(0, -.3, .1); m.rotation.set(0, 0, 0); m.scale.setScalar(.85); }
  }
  update(dt, inp) {
    const g = this.game, b = this.body, world = g.world;
    this.invuln = Math.max(0, this.invuln - dt); this.coffee = Math.max(0, this.coffee - dt); this.noGrab = Math.max(0, this.noGrab - dt);
    if (this.dead) { this.deadT -= dt; if (this.deathMode === 'knock') { b.vy -= GRAVITY * dt; b.x += b.vx * dt; b.z += b.vz * dt; b.y += b.vy * dt; } return; }
    const yaw = g.cam.yaw, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    let mx = inp.mx, my = inp.my; const mag = Math.min(1, Math.hypot(mx, my));
    const wx = rx * mx + fx * my, wz = rz * mx + fz * my;

    if (this.state === 'climb') { this.updateClimb(dt, inp, wx, wz); return; }
    if (this.state === 'rivet') { this.updateRivet(dt, inp); return; }

    // ---- ground / air movement
    const maxS = RUN * (this.coffee > 0 ? 1.38 : 1) * (this.carry ? .86 : 1);
    const k = b.onGround ? 16 : 5.5, f = 1 - Math.exp(-k * dt);
    b.vx += (wx * maxS - b.vx) * f; b.vz += (wz * maxS - b.vz) * f;
    this.coyote = b.onGround ? .11 : this.coyote - dt;
    this.jumpBuf = inp.jump ? .14 : this.jumpBuf - dt;
    if (this.jumpBuf > 0 && this.coyote > 0) {
      b.vy = this.carry ? JUMP_CARRY : JUMP; b.onGround = false; b.ground = null; this.coyote = 0; this.jumpBuf = 0; this.airMax = b.y;
      g.audio.play('jump', { vol: .55, rate: rr(.95, 1.08) }); this.rig.squashV += 2.4;
    }
    b.vy -= GRAVITY * dt * (b.vy > 0 && !inp.jumpHeld ? 2.1 : 1);
    if (b.vy < -26) b.vy = -26;
    const w = g.wind, drift = b.onGround ? .62 : .9;
    b.vx += w.x * drift; b.vz += w.z * drift;
    moveBody(world, b, dt);
    b.vx -= w.x * drift; b.vz -= w.z * drift;
    if (b.bonked) { b.bonked = false; }

    // landing / fall damage
    if (b.onGround && !b.wasGround) {
      const fall = this.airMax - b.y;
      if (fall > FATAL_FALL) { this.die('fall'); return; }
      if (fall > .9) {
        this.rig.land(Math.min(1.6, fall / 2.5)); g.audio.play('land', { vol: Math.min(1, .35 + fall / 6), rate: rr(.9, 1.05) });
        g.fx.dust(V.set(b.x, b.y + .05, b.z), Math.round(4 + fall * 3));
        if (fall > 3.2) { g.shake(.25, null); g.audio.play('mac_oof', { bus: 'voice', vol: .7 }); }
      }
    }
    if (!b.onGround) { this.airMax = Math.max(this.airMax, b.y); if (b.vy < -16 && !this.screamed && this.airMax - b.y > 5) { this.screamed = true; g.audio.voice('mac_whoa', .9); } }
    else { this.airMax = b.y; this.screamed = false; }
    if (b.y < g.level.killY) { this.die('void'); return; }

    // facing follows input
    if (mag > .15) this.yaw = angleDamp(this.yaw, Math.atan2(wx, wz), 15, dt);

    // footsteps
    const sp = Math.hypot(b.vx, b.vz);
    if (b.onGround && sp > 1) {
      const ph = Math.floor(this.rig.phase / Math.PI);
      if (ph !== this.lastStep) {
        this.lastStep = ph;
        const surf = b.ground && b.ground.surf || 'steel';
        const name = surf === 'dirt' ? 'step_dirt' : surf === 'wood' ? 'step_wood' : surf === 'concrete' ? 'step_dirt' : (ph & 1 ? 'step_steel_a' : 'step_steel_b');
        g.audio.play(name, { vol: .28 + sp * .03, rate: rr(.9, 1.1) * (surf === 'concrete' ? 1.25 : 1) });
      }
    }

    // ---- ladders
    if (this.noGrab <= 0) for (const L of g.level.ladders) {
      const lateral = L.fz !== 0 ? Math.abs(b.x - L.x) : Math.abs(b.z - L.z);
      if (lateral > .55) continue;
      const front = (b.x - L.x) * L.fx + (b.z - L.z) * L.fz, toward = -(wx * L.fx + wz * L.fz);
      if (front > -.25 && front < 1.0 && b.y >= L.y0 - .3 && b.y < L.y1 - .3) {
        const fromGround = b.onGround && toward > .45 && Math.abs(b.y - L.y0) < .5;
        const fromAir = !b.onGround && b.vy < 0 && b.y > L.y0 + .25 && front < .85;
        if (fromGround || fromAir) { this.grab(L, b.y); break; }
      }
      // grab from the top: standing on the deck behind the ladder and walking out over it
      if (b.onGround && Math.abs(b.y - L.y1) < .3 && front < 0 && front > -1.1 && -toward > .55) { this.grab(L, L.y1 - 1.1); break; }
    }
  }
  grab(L, y) {
    const b = this.body; this.state = 'climb'; this.ladder = L; b.vx = b.vz = b.vy = 0; b.y = y; b.onGround = false; b.ground = null;
    this.game.audio.play('ladder', { vol: .5 }); this.screamed = false;
  }
  updateClimb(dt, inp, wx, wz) {
    const g = this.game, b = this.body, L = this.ladder;
    const tx = L.x + L.fx * .42, tz = L.z + L.fz * .42, f = 1 - Math.exp(-22 * dt);
    b.x += (tx - b.x) * f; b.z += (tz - b.z) * f;
    this.yaw = Math.atan2(-L.fx, -L.fz);
    // push toward the ladder = up, push out over it = down; W/S when the camera is side-on
    const ax = -(wx * L.fx + wz * L.fz), cy = clamp(Math.abs(ax) > .35 ? ax : inp.my, -1, 1), speed = this.carry ? 2.4 : 3.2;
    b.y += cy * speed * dt;
    const before = Math.floor(this.climbPhase / Math.PI);
    this.climbPhase += Math.abs(cy) * dt * 9;
    if (Math.floor(this.climbPhase / Math.PI) !== before) g.audio.play('ladder', { vol: .35, rate: rr(.9, 1.15) });
    if (b.y >= L.y1 - .05) {
      b.y = L.y1; b.x = L.x - L.fx * .78; b.z = L.z - L.fz * .78; this.state = 'normal'; this.ladder = null; this.noGrab = .45; b.vy = 0; this.airMax = b.y;
      return;
    }
    if (b.y <= L.y0) {
      b.y = Math.max(b.y, L.y0); this.state = 'normal'; this.ladder = null; this.noGrab = .45; this.airMax = b.y;
      return;
    }
    if (inp.jump) {
      this.state = 'normal'; this.ladder = null; this.noGrab = .4;
      b.vy = 5.5; b.vx = L.fx * 3.6; b.vz = L.fz * 3.6; this.airMax = b.y; this.yaw = Math.atan2(L.fx, L.fz);
    }
  }
  startRivet(s) { this.state = 'rivet'; this.rivetSock = s; const b = this.body; b.vx = b.vz = 0; }
  updateRivet(dt, inp) {
    const g = this.game, s = this.rivetSock, b = this.body;
    b.vy -= GRAVITY * dt; moveBody(g.world, b, dt);
    if (!inp.actHeld || !s || s.state !== 'placed' || !b.onGround) { this.state = 'normal'; this.rivetSock = null; return; }
    // turn to face the next rivet
    const dot = s.rivetDots[s.rivets].position;
    this.yaw = angleDamp(this.yaw, Math.atan2(dot.x - b.x, dot.z - b.z), 12, dt);
    s.progress += dt / .42 * (this.coffee > 0 ? 1.4 : 1);
    this.rivetSnd -= dt;
    if (this.rivetSnd <= 0) { this.rivetSnd = .3; g.audio.play('rivet', { vol: .6, rate: rr(.95, 1.08) }); }
    if (Math.random() < .6) g.fx.sparks(dot, 2, 0xffc860);
    if (s.progress >= 1) {
      s.progress = 0; s.rivetDots[s.rivets].material.color.setHex(0x3a3a3a); s.rivetDots[s.rivets].scale.setScalar(.8);
      g.fx.sparks(dot, 16, 0xffe2a0); s.rivets++;
      g.audio.play('rivet_done', { vol: .7, rate: 1 + s.rivets * .06 });
      g.addScore(100, dot);
      if (s.rivets >= 4) { g.socketRiveted(s); this.state = 'normal'; this.rivetSock = null; }
    }
  }
  die(mode) {
    if (this.dead) return;
    const g = this.game, b = this.body;
    this.dead = true; this.deadT = mode === 'void' ? 1.6 : 2.4; this.deathMode = mode === 'fall' || mode === 'squash' ? 'flat' : mode === 'void' || mode === 'molten' ? 'gone' : 'knock';
    this.state = 'normal'; this.ladder = null;
    if (this.deathMode === 'knock') { b.vy = 7; b.vx = -Math.sin(this.yaw) * 3; b.vz = -Math.cos(this.yaw) * 3; }
    if (this.deathMode === 'flat') { g.audio.play('splat', { vol: 1 }); g.fx.dust(V.set(b.x, b.y + .1, b.z), 26); g.shake(.4, null); }
    if (mode === 'molten') { this.rig.body.visible = false; g.fx.embers(V.set(b.x, b.y + .5, b.z), 50); }
    if (this.deathMode === 'knock') { g.audio.play('dizzy', { vol: .8 }); g.audio.voice('mac_oof', .9); }
    if (this.carry) { const o = this.carry; this.carry = null; g.objects.sendHome(o); }
  }
  // per-frame visuals
  animate(dt) {
    const b = this.body, r = this.rig, g = this.game;
    this.root.position.set(b.x, b.y, b.z);
    this.root.rotation.y = this.yaw;
    let mode = 'idle', speed = Math.hypot(b.vx, b.vz) / RUN;
    if (this.dead) {
      mode = this.deathMode === 'flat' ? 'flat' : 'hurt';
      if (this.deathMode === 'flat') r.body.scale.set(1.25, .25, 1.25);
      if (this.deathMode === 'knock') r.body.rotation.y += dt * 9;
    } else if (this.state === 'climb') mode = 'climb';
    else if (this.state === 'rivet') mode = 'rivet';
    else if (!b.onGround) mode = 'air';
    else if (speed > .08) mode = 'walk';
    if (g.cheer) mode = 'cheer';
    r.update(dt, { mode, speed, vy: b.vy, carry: this.carry ? this.carry.kind : null, climbPhase: this.climbPhase });
    if (this.dead && this.deathMode === 'flat') r.body.scale.set(1.3, .22, 1.3);
    // invulnerability blink, gold hat shield tint
    r.root.visible = !(this.invuln > 0 && !this.dead && Math.floor(this.invuln * 12) % 2 === 0 && this.invuln < 2);
    if (r.hatMat) { r.hatMat.color.setHex(this.shield ? 0xffd84a : 0xffc21a); r.hatMat.metalness = this.shield ? 1 : .05; r.hatMat.roughness = this.shield ? .15 : .3; r.hatMat.emissive.setHex(this.shield ? 0x553300 : 0); }
    // landing marker
    const gnd = g.world.groundBelow(b.x, b.z, b.y + .05, .05);
    const show = !this.dead && gnd && this.state !== 'climb';
    this.marker.visible = !!show;
    if (show) {
      const h = b.y - gnd.y1; this.marker.position.set(b.x, gnd.y1 + .02, b.z);
      const s = clamp(1 - h / 14, .45, 1); this.marker.scale.setScalar(s); this.marker.material.opacity = h < .05 ? .28 : .45;
    }
  }
}
