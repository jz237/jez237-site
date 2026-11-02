// Moving platforms and hazards. Each has update(dt, game) and optional dispose().
import * as THREE from 'three';
import { boxGeo } from './builder.js';
import { cutaway } from './textures.js';
import { clamp, lerp, rr, TAU, smooth } from './util.js';

const V = new THREE.Vector3();
const hexBolt = (() => {
  let g = null;
  return () => g || (g = (() => { const a = new THREE.CylinderGeometry(.09, .09, .1, 6), b = new THREE.CylinderGeometry(.035, .035, .32, 8); b.translate(0, -.2, 0); return [a, b]; })());
})();

function cable(mat) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, 1, 5), mat); m.castShadow = true; return m; }
function aimCable(m, a, b) {
  V.subVectors(b, a); const L = V.length();
  m.position.copy(a).addScaledVector(V, .5); m.scale.set(1, L, 1);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), V.normalize());
}
const playerBox = (p) => p.body;
function overlapXZ(b, box, pad = 0) { return b.x + b.r * pad > box.x0 && b.x - b.r * pad < box.x1 && b.z + b.r * pad > box.z0 && b.z - b.r * pad < box.z1; }

// ---------------- movers ----------------
export class Elevator {
  constructor(d, ctx) {
    const { world, M, group } = ctx; this.d = d; this.stops = d.stops; this.idx = 0; this.dir = 1; this.wait = 2; this.moving = false;
    const y = this.stops[0];
    this.box = world.addDyn({ x0: d.x0, y0: y - .3, z0: d.z0, x1: d.x1, y1: y, z1: d.z1, surf: 'steel' });
    const r = .08;
    this.rails = [
      world.addDyn({ x0: d.x1 - r, y0: y, z0: d.z0, x1: d.x1, y1: y + 1.1, z1: d.z1, noFloor: true }),
      world.addDyn({ x0: d.x0, y0: y, z0: d.z0, x1: d.x1, y1: y + 1.1, z1: d.z0 + r, noFloor: true }),
      world.addDyn({ x0: d.x0, y0: y, z0: d.z1 - r, x1: d.x1, y1: y + 1.1, z1: d.z1, noFloor: true }),
    ];
    const w = d.x1 - d.x0, dd = d.z1 - d.z0, cx = (d.x0 + d.x1) / 2, cz = (d.z0 + d.z1) / 2;
    const g = this.g = new THREE.Group(); g.position.set(cx, y, cz);
    const add = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    add(boxGeo(w, .3, dd, 2, 0, -.15, 0), M.deck);
    add(boxGeo(w, .06, .14, 1, 0, -.02, -dd / 2 + .07), M.hazard); add(boxGeo(w, .06, .14, 1, 0, -.02, dd / 2 - .07), M.hazard);
    for (const [x, z, L, ax] of [[w / 2 - .04, 0, dd, 'z'], [0, -dd / 2 + .04, w, 'x'], [0, dd / 2 - .04, w, 'x']])
      for (const hh of [1.1, .55]) add(ax === 'z' ? boxGeo(.05, .05, L, 1, x, hh, z) : boxGeo(L, .05, .05, 1, x, hh, z), M.yellow);
    for (const [x, z] of [[w / 2, -dd / 2], [w / 2, dd / 2], [-w / 2, -dd / 2], [-w / 2, dd / 2]]) add(boxGeo(.08, 1.15, .08, 1, x * .97, .57, z * .97), M.yellow);
    this.lamp = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), M.glow(0x40ff60, 3)); this.lamp.position.set(w / 2 - .1, 1.3, 0); g.add(this.lamp);
    group.add(g); this.world = world;
  }
  sync() { return [Math.round(this.box.y1 * 100) / 100, this.idx, this.dir, Math.round(this.wait * 100) / 100]; }
  setSync(a) { if (Math.abs(this.box.y1 - a[0]) > .25 || this.idx !== a[1]) { this.idx = a[1]; this.dir = a[2]; this.wait = a[3]; this.setY(a[0], this.world); } }
  setY(y, world) {
    const d = this.d; world.moveDyn(this.box, d.x0, y - .3, d.z0);
    world.moveDyn(this.rails[0], d.x1 - .08, y, d.z0); world.moveDyn(this.rails[1], d.x0, y, d.z0); world.moveDyn(this.rails[2], d.x0, y, d.z1 - .08);
    this.g.position.y = y;
  }
  update(dt, game) {
    const d = this.d, y = this.box.y1;
    if (this.wait > 0) { this.wait -= dt; this.moving = false; }
    else {
      const target = this.stops[this.idx + this.dir], s = Math.sign(target - y), ny = y + s * d.speed * dt;
      this.moving = true;
      if ((s > 0 && ny >= target) || (s < 0 && ny <= target)) {
        this.setY(target, game.world); this.idx += this.dir;
        if (this.idx === 0 || this.idx === this.stops.length - 1) this.dir = -this.dir;
        this.wait = d.wait; game.audio.play('ding', { pos: this.g.position, vol: .5 });
      } else this.setY(ny, game.world);
      // crush check when descending onto Mac
      const b = game.player.body;
      if (s < 0 && !game.player.dead && overlapXZ(b, this.box, -.2) && b.y < this.box.y0 && b.y + b.h > this.box.y0) game.killPlayer('squash');
    }
    this.lamp.material.emissive.setHex(this.moving ? 0xff3020 : 0x40ff60);
    game.audio.motor('elevator_loop', this, this.g.position, this.moving ? .55 : 0);
  }
}

// ---- danger(x, y, z): true when standing there now (or very soon) would hurt. Used by the demo bot.
Elevator.prototype.danger = function (x, y, z) {
  const d = this.d; return x > d.x0 - .4 && x < d.x1 + .4 && z > d.z0 - .4 && z < d.z1 + .4 && y < this.box.y0 - .1;
};

export class CraneMagnet {
  constructor(d, ctx) {
    const { world, M, group, B } = ctx; this.d = d; this.t = 0;
    const s = d.size;
    this.box = world.addDyn({ x0: 0, y0: 0, z0: 0, x1: s, y1: .3, z1: s, surf: 'steel' });
    const top = this.top = new THREE.Group(); top.position.set(d.cx, d.h, d.cz); group.add(top);
    const jib = B.boom(d.R + 4, 1.3, M.yellow, 8); top.add(jib);
    const cab = new THREE.Mesh(boxGeo(1.6, 1.6, 1.6, 1), M.yellow); cab.position.set(1, -1, 1.5); top.add(cab);
    const gl = new THREE.Mesh(boxGeo(1.62, .7, 1.2, 1), M.glass); gl.position.set(1, -.8, 1.5); top.add(gl);
    const cw = new THREE.Mesh(boxGeo(2.4, 1.6, 1.8, 1), M.concrete); cw.position.set(-6.5, -.6, 0); top.add(cw);
    this.trolley = new THREE.Mesh(boxGeo(1.4, .5, 1.4, 1), M.dark); this.trolley.position.set(d.R, -.2, 0); top.add(this.trolley);
    this.beacon = new THREE.Mesh(new THREE.SphereGeometry(.18, 10, 8), M.glow(0xff2a1a, 4)); this.beacon.position.set(d.R + 4, 1.6, 0); top.add(this.beacon);
    top.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const g = this.plate = new THREE.Group(); group.add(g);
    const add = (geo, mat, y = 0) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    add(boxGeo(s, .3, s, 2, 0, -.15, 0), M.deck);
    for (const k of [-1, 1]) { add(boxGeo(s, .07, .16, 1, 0, -.01, k * (s / 2 - .08)), M.hazard); add(boxGeo(.16, .07, s, 1, k * (s / 2 - .08), -.01, 0), M.hazard); }
    const mag = add(new THREE.CylinderGeometry(.9, .9, .5, 24), M.dark, 3.2);
    add(new THREE.CylinderGeometry(.92, .92, .1, 24), M.yellow, 2.94);
    this.coil = new THREE.Mesh(new THREE.TorusGeometry(.95, .05, 6, 24), M.glow(0x66ccff, 2)); this.coil.rotation.x = Math.PI / 2; this.coil.position.y = 3.1; g.add(this.coil);
    this.chains = [0, 1, 2, 3].map(() => { const c = cable(M.cable); g.add(c); return c; });
    this.cable = cable(M.cable); group.add(this.cable);
    this.sign = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), M.glow(0x40ff60, 3)); this.sign.position.set(s / 2 - .2, .25, s / 2 - .2); g.add(this.sign);
    const P = [3.5, 3.5, 6, 1.2, 3, 1.2, 6, 3.5]; this.P = P; this.T = P.reduce((a, b) => a + b, 0);
    this.apply(0, ctx.world);
  }
  state(t) {
    const d = this.d, P = this.P; let k = 0; t %= this.T;
    while (t > P[k]) { t -= P[k]; k++; }
    const f = smooth(clamp(t / P[k], 0, 1));
    switch (k) {
      case 0: return [d.aA, d.yLow, 'wait'];
      case 1: return [d.aA, lerp(d.yLow, d.yHigh, f), 'up'];
      case 2: return [lerp(d.aA, d.aB, f), d.yHigh, 'swing'];
      case 3: return [d.aB, lerp(d.yHigh, d.yDrop, f), 'down'];
      case 4: return [d.aB, d.yDrop, 'wait'];
      case 5: return [d.aB, lerp(d.yDrop, d.yHigh, f), 'up'];
      case 6: return [lerp(d.aB, d.aA, f), d.yHigh, 'swing'];
      default: return [d.aA, lerp(d.yHigh, d.yLow, f), 'down'];
    }
  }
  // seconds left in the current phase, and whether the plate is at stop A or B
  phaseInfo() {
    const P = this.P; let t = this.t % this.T, k = 0;
    while (t > P[k]) { t -= P[k]; k++; }
    return { k, left: P[k] - t, atA: k === 0, atB: k === 4 };
  }
  danger(x, y, z) {
    const b = this.box; return this.phase === 'down' && b.y1 < 4 && x > b.x0 - .4 && x < b.x1 + .4 && z > b.z0 - .4 && z < b.z1 + .4 && y < b.y0;
  }
  apply(t, world) {
    const d = this.d, [a, y, ph] = this.state(t), s = d.size;
    const px = d.cx + Math.cos(a) * d.R, pz = d.cz + Math.sin(a) * d.R;
    world.moveDyn(this.box, px - s / 2, y - .3, pz - s / 2);
    this.top.rotation.y = -a; this.plate.position.set(px, y, pz);
    aimCable(this.cable, V.set(px, d.h - .5, pz).clone(), new THREE.Vector3(px, y + 3.45, pz));
    const mag = new THREE.Vector3(0, 2.95, 0);
    this.chains.forEach((c, i) => { const cx = (i & 1 ? 1 : -1) * (s / 2 - .2), cz = (i & 2 ? 1 : -1) * (s / 2 - .2); aimCable(c, new THREE.Vector3(cx, .02, cz), mag); });
    this.phase = ph;
  }
  update(dt, game) {
    this.t += dt; this.apply(this.t, game.world);
    const waiting = this.phase === 'wait';
    this.sign.material.emissive.setHex(waiting ? 0x40ff60 : 0xffaa20);
    this.coil.material.emissiveIntensity = 1.6 + Math.sin(this.t * 8) * .6;
    this.beacon.material.emissiveIntensity = (this.t % 1.2) < .6 ? 5 : .5;
    game.audio.motor('crane_loop', this, this.plate.position, waiting ? 0 : .5);
  }
}

export class SwingBeam {
  constructor(d, ctx) {
    const { world, M, group } = ctx; this.d = d; this.t = 0;
    this.box = world.addDyn({ x0: 0, y0: 0, z0: d.pz - .3, x1: d.len, y1: .3, z1: d.pz + .3, surf: 'steel' });
    const g = this.g = new THREE.Group(); group.add(g);
    const add = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    add(boxGeo(d.len, .06, .6, 2, 0, -.03, 0), M.beam); add(boxGeo(d.len, .06, .6, 2, 0, -.27, 0), M.beam); add(boxGeo(d.len, .2, .05, 2, 0, -.15, 0), M.beam);
    add(boxGeo(d.len, .03, .1, 1, 0, .015, .25), M.hazard); add(boxGeo(d.len, .03, .1, 1, 0, .015, -.25), M.hazard);
    this.cables = [0, 1, 2, 3].map(() => { const c = cable(M.cable); group.add(c); return c; });
    this.trolley = new THREE.Mesh(boxGeo(1.6, .4, .8, 1), M.yellow); group.add(this.trolley); this.trolley.castShadow = true;
    const jib = new THREE.Mesh(boxGeo(d.L * 2.4, .5, .5, 2, d.px, d.py + .65, d.pz), M.yellow); jib.castShadow = true; group.add(jib);
    this.apply(0, world);
  }
  // Shuttles at constant height (0.32 m above the decks) with a pause at each end; cables hang from a moving trolley.
  apply(t, world) {
    const d = this.d, w = TAU / d.period, sn = clamp(1.3 * Math.sin(t * w), -1, 1);
    const x = d.px + d.L * Math.sin(d.amp) * sn, top = d.top;
    world.moveDyn(this.box, x - d.len / 2, top - .3, d.pz - .3);
    const acc = Math.abs(sn) < 1 ? -Math.sin(t * w) : 0;
    this.g.position.set(x, top, d.pz); this.g.rotation.z = acc * .025;
    for (let i = 0; i < 4; i++) {
      const sx = (i & 1 ? 1 : -1) * d.len * .42, sz = (i & 2 ? 1 : -1) * .22;
      aimCable(this.cables[i], new THREE.Vector3(x + sx * .3, d.py + .1, d.pz + sz * .3), new THREE.Vector3(x + sx, top + .02, d.pz + sz));
    }
    this.trolley.position.set(x, d.py + .2, d.pz);
  }
  update(dt, game) { this.t += dt; this.apply(this.t, game.world); }
}

// ---------------- hazards ----------------
// Everything that drops on Mac after a ground-ring warning. warn = seconds of warning, r = hit radius, h = drop height.
const DROPS = {
  bolt: { warn: 1.05, r: .62, h: 3.6, snd: 'bolt_fall', hit: 'clink', reason: 'bolt', ring: 0xff3a1a, spark: 0xffd27a },
  rock: { warn: 1.1, r: .66, h: 4.6, snd: 'debris', hit: 'debris', reason: 'rock', ring: 0xff8a1a, spark: 0x8a7a62, dust: true },
  brick: { warn: 1.1, r: .7, h: 5, snd: 'debris', hit: 'debris', reason: 'debris', ring: 0xff5a2a, spark: 0xb4583a, dust: true },
  gull: { warn: 1.3, r: .6, h: 7, snd: 'gull_dive', hit: 'gull', reason: 'gull', ring: 0xf4f4f4, swoop: true },
  lightning: { warn: 1.4, r: 1.3, h: 0, snd: 'lightning_charge', hit: 'thunder', reason: 'zap', ring: 0x9fd8ff, strike: true },
};
function dropMesh(kind, mat) {
  const g = new THREE.Group(), add = (geo, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; };
  if (kind === 'bolt') { for (const geo of hexBolt()) add(geo, mat); g.scale.setScalar(1.6); }
  else if (kind === 'rock') { add(new THREE.DodecahedronGeometry(.26, 0), mat); add(new THREE.DodecahedronGeometry(.16, 0), mat, .22, .05, .1); }
  else if (kind === 'brick') { for (let k = 0; k < 3; k++) add(new THREE.BoxGeometry(.3, .11, .14), mat, rr(-.15, .15), k * .12, rr(-.1, .1)).rotation.y = rr(0, 3); }
  else if (kind === 'gull') {
    const white = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: .7 }), grey = new THREE.MeshStandardMaterial({ color: 0x8a9096, roughness: .7 });
    add(new THREE.SphereGeometry(.16, 10, 8), white).scale.set(.8, .75, 1.7);
    add(new THREE.SphereGeometry(.09, 8, 6), white, 0, .08, .25);
    add(new THREE.ConeGeometry(.03, .14, 6).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xf2a020 }), 0, .06, .38);
    g.userData.wings = [-1, 1].map(s => { const w = new THREE.Group(); w.position.set(s * .1, .05, 0); g.add(w); const m = new THREE.Mesh(new THREE.BoxGeometry(.6, .02, .2), grey); m.position.x = s * .3; m.castShadow = true; w.add(m); return w; });
  }
  return g;
}
export class Bolts {
  constructor(d, ctx) {
    this.d = d; this.ctx = ctx; this.timer = 4; this.list = []; this.kind = d.kind || 'bolt'; this.K = DROPS[this.kind];
    this.mat = this.kind === 'rock' ? new THREE.MeshStandardMaterial({ color: 0x6b5842, roughness: .95 }) : this.kind === 'brick' ? new THREE.MeshStandardMaterial({ color: 0xa4482e, roughness: .9 }) : new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: .3, metalness: .95 });
    this.ringMat = new THREE.MeshBasicMaterial({ color: this.K.ring, transparent: true, opacity: .8, depthWrite: false });
    if (this.K.strike) {
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(18 * 3), 3));
      this.zap = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xe8f4ff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, fog: false }));
      this.zap.frustumCulled = false; this.zap.visible = false; ctx.group.add(this.zap); this.zapT = 0;
    }
  }
  update(dt, game) {
    const p = game.player, b = p.body;
    this.post(dt);
    if (!game.frozen) this.timer -= dt;
    if (this.timer <= 0 && !p.dead && p.state !== 'climb' && b.onGround) {
      this.timer = this.d.rate / game.diff.hazard * rr(.75, 1.25);
      for (let tries = 0; tries < 8; tries++) {
        const a = Math.random() * TAU, r = Math.random() < .55 ? rr(0, 1.2) : rr(1, 4.5);
        const x = b.x + Math.cos(a) * r + b.vx * .6, z = b.z + Math.sin(a) * r + b.vz * .6;
        const gnd = game.world.groundBelow(x, z, b.y + .4, .05);
        if (!gnd || Math.abs(gnd.y1 - b.y) > .45 || gnd.dyn) continue;
        const K = this.K, rs = K.r / .62;
        const ring = new THREE.Mesh(new THREE.RingGeometry(.35 * rs, .5 * rs, 28), this.ringMat.clone()); ring.rotation.x = -Math.PI / 2; ring.position.set(x, gnd.y1 + .03, z);
        const bolt = dropMesh(this.kind, this.mat);
        bolt.position.set(x, gnd.y1 + K.h, z); bolt.visible = false;
        this.ctx.group.add(ring, bolt);
        const a2 = Math.random() * TAU;
        this.list.push({ x, z, y: gnd.y1, t: 0, ring, bolt, warn: K.warn, ux: Math.cos(a2), uz: Math.sin(a2) });
        game.audio.play(K.snd, { pos: ring.position, vol: this.kind === 'lightning' ? .8 : .6, rate: rr(.9, 1.1) });
        break;
      }
    }
    for (let i = this.list.length - 1; i >= 0; i--) {
      const o = this.list[i];
      if (game.frozen && o.t < o.warn) continue;
      o.t += dt;
      const k = o.t / o.warn;
      const K = this.K;
      o.ring.scale.setScalar(1.6 - .7 * clamp(k, 0, 1)); o.ring.material.opacity = .4 + .5 * Math.abs(Math.sin(o.t * 14));
      if (K.swoop) { // gull: dive in from the side, then off again
        if (k >= .3) { o.bolt.visible = true; const f = clamp((k - .3) / .7, 0, 1), e = f * f; o.bolt.position.set(o.x + o.ux * 8 * (1 - e), o.y + .9 + 6 * (1 - f) * (1 - f), o.z + o.uz * 8 * (1 - e)); o.bolt.rotation.y = Math.atan2(-o.ux, -o.uz); o.bolt.rotation.x = .5 * (1 - f); }
        for (const w of o.bolt.userData.wings) w.rotation.z = Math.sin(o.t * 30) * .5 * (w.position.x > 0 ? 1 : -1);
      } else if (K.strike) { // lightning: the spot crackles, then the bolt hits
        if (Math.random() < .5) game.fx.sparks(V.set(o.x + rr(-.4, .4), o.y + .1, o.z + rr(-.4, .4)), 2, 0x9fd8ff);
      } else if (k >= .55) { o.bolt.visible = true; const f = clamp((k - .55) / .45, 0, 1); o.bolt.position.y = o.y + K.h - (K.h - .1) * f * f; o.bolt.rotation.x += dt * 12; }
      if (k >= 1) {
        V.set(o.x, o.y + .1, o.z);
        if (K.dust) game.fx.dust(V, 12); else game.fx.sparks(V, K.strike ? 40 : 14, K.spark || 0xffd27a);
        if (K.strike) { this.strike(o, game); game.audio.play('thunder', { vol: 1 }); game.shake(.35, V); }
        else game.audio.play(K.hit, { pos: V, vol: .8 });
        const dx = b.x - o.x, dz = b.z - o.z;
        if (!p.dead && dx * dx + dz * dz < K.r * K.r && b.y > o.y - .3 && b.y < o.y + (K.strike ? 2.4 : 1.2)) game.hitPlayer(K.reason);
        if (K.swoop) { o.leave = .8; this.leaving = this.leaving || []; this.leaving.push(o); this.ctx.group.remove(o.ring); }
        else this.ctx.group.remove(o.ring, o.bolt);
        o.ring.geometry.dispose(); o.ring.material.dispose();
        this.list.splice(i, 1);
      }
    }
  }
  // after-effects: gulls flying off, the lightning bolt fading
  post(dt) {
    if (this.leaving) for (let i = this.leaving.length - 1; i >= 0; i--) {
      const o = this.leaving[i]; o.leave -= dt; o.t += dt;
      o.bolt.position.x -= o.ux * 9 * dt; o.bolt.position.z -= o.uz * 9 * dt; o.bolt.position.y += 5 * dt; o.bolt.rotation.x = -.5;
      for (const w of o.bolt.userData.wings) w.rotation.z = Math.sin(o.t * 30) * .5 * (w.position.x > 0 ? 1 : -1);
      if (o.leave <= 0) { this.ctx.group.remove(o.bolt); this.leaving.splice(i, 1); }
    }
    if (this.zap && this.zapT > 0) { this.zapT -= dt; this.zap.material.opacity = Math.max(0, this.zapT / .22); this.zap.visible = this.zapT > 0; }
  }
  strike(o, game) {
    const a = this.zap.geometry.attributes.position, top = o.y + 46;
    for (let i = 0; i < 18; i++) { const f = i / 17, j = f < 1 ? (1 - f) * 2.2 : 0; a.setXYZ(i, o.x + (i ? rr(-j, j) : 0), lerp(top, o.y, f), o.z + (i ? rr(-j, j) : 0)); }
    a.setXYZ(17, o.x, o.y, o.z); a.needsUpdate = true; this.zapT = .22; this.zap.visible = true;
    if (game.env && game.env.flash) game.env.flash(1);
  }
  clear() { for (const o of this.list) this.ctx.group.remove(o.ring, o.bolt); for (const o of this.leaving || []) this.ctx.group.remove(o.bolt); this.list.length = 0; this.leaving = []; this.timer = 4; }
  danger(x, y, z) { const r = this.K.r + .28; return this.list.some(o => Math.abs(x - o.x) < r && Math.abs(z - o.z) < r && Math.abs(y - o.y) < .7); }
  nearest(x, y, z) { let best = null, bd = this.K.r + .6; for (const o of this.list) { const d = Math.hypot(x - o.x, z - o.z); if (d < bd && Math.abs(y - o.y) < .7) { bd = d; best = o; } } return best; }
}

export class Pipes {
  constructor(d, ctx) {
    this.d = d; this.ctx = ctx; this.timer = 1.5; this.list = [];
    const g = new THREE.CylinderGeometry(d.r, d.r, 2.2, 22, 1, true); g.rotateX(Math.PI / 2);
    const cap = new THREE.RingGeometry(d.r * .75, d.r, 22);
    this.geo = g; this.cap = cap; this.mat = ctx.M.concrete; this.inner = new THREE.MeshStandardMaterial({ color: 0x3b3b3b, roughness: 1, side: THREE.DoubleSide });
  }
  make(x, sp) {
    const d = this.d, m = new THREE.Group();
    const body = new THREE.Mesh(this.geo, this.mat); body.castShadow = true; m.add(body);
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(d.r * .76, d.r * .76, 2.18, 18, 1, true).rotateX(Math.PI / 2), this.inner); m.add(inner);
    for (const s of [-1, 1]) { const c = new THREE.Mesh(this.cap, this.mat); c.position.z = s * 1.1; c.rotation.y = s > 0 ? 0 : Math.PI; m.add(c); }
    m.position.set(x, d.r, d.z); this.ctx.group.add(m);
    const o = { m, x, sp }; this.list.push(o); return o;
  }
  sync() { return [Math.round(this.timer * 100) / 100, ...this.list.flatMap(o => [Math.round(o.x * 100) / 100, Math.round(o.sp * 100) / 100])]; }
  setSync(a) {
    this.timer = 99; const n = (a.length - 1) / 2;
    while (this.list.length > n) { const o = this.list.pop(); this.ctx.group.remove(o.m); }
    for (let i = 0; i < n; i++) { const x = a[1 + i * 2], sp = a[2 + i * 2], o = this.list[i] || this.make(x, sp); if (Math.abs(o.x - x) > .4) o.x = x; o.sp = sp; }
  }
  update(dt, game) {
    const d = this.d, b = game.player.body;
    if (!game.frozen && !game.coopGuest) {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.timer = d.every / game.diff.hazard * rr(.8, 1.3);
        const o = this.make(d.x0, d.speed * game.diff.speed * rr(.9, 1.15));
        game.audio.play('pickup', { pos: o.m.position, vol: .7, rate: .6 });
      }
    }
    const dir = Math.sign(d.x1 - d.x0);
    for (let i = this.list.length - 1; i >= 0; i--) {
      const o = this.list[i];
      if (!game.frozen) { o.x += dir * o.sp * dt; o.m.rotation.z -= dir * o.sp * dt / d.r; }
      o.m.position.x = o.x;
      if (!game.player.dead && Math.abs(b.x - o.x) < d.r + .22 && Math.abs(b.z - d.z) < 1.1 + .25 && b.y < d.r * 2 - .2) game.hitPlayer('pipe', { push: V.set(dir * 6, 5, 0) });
      game.audio.motor('conveyor_loop', o, o.m.position, game.frozen ? 0 : .5, .55);
      if ((o.x - d.x1) * dir > 0) { this.ctx.group.remove(o.m); game.audio.motor('conveyor_loop', o, o.m.position, 0); this.list.splice(i, 1); }
    }
  }
  clear() { for (const o of this.list) this.ctx.group.remove(o.m); this.list.length = 0; }
  zone(x, y, z) { const d = this.d; return Math.abs(z - d.z) < 1.9 && y < d.r * 2; } // standing in the lane at all
  danger(x, y, z, la = 1.5) {
    const d = this.d; if (Math.abs(z - d.z) > 1.9 || y > d.r * 2) return false;
    const dir = Math.sign(d.x1 - d.x0), pad = d.r + .9;
    if (this.timer < la && Math.abs(x - d.x0) < 9) return true;
    return this.list.some(o => { const a = o.x, b = o.x + dir * o.sp * la; return x > Math.min(a, b) - pad && x < Math.max(a, b) + pad; });
  }
}

export class Press {
  constructor(d, ctx) {
    const { world, M, group } = ctx; this.d = d; this.t = d.phase || 0;
    const w = d.w, top = d.y + 2.0; // housing sits from y+5.4 to y+7.2, under any deck 8 m up
    this.up = d.y + 2.6; this.down = d.y + .02;
    this.box = world.addDyn({ x0: d.x - w / 2, y0: this.up, z0: d.z - w / 2, x1: d.x + w / 2, y1: this.up + 1.1, z1: d.z + w / 2, surf: 'steel' });
    const head = this.head = new THREE.Group(); group.add(head);
    const add = (geo, mat, parent = head) => { const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
    add(boxGeo(w, 1.1, w, 2, 0, .55, 0), M.dark);
    add(boxGeo(w + .04, .2, w + .04, 1, 0, .1, 0), M.hazard);
    this.rod = add(new THREE.CylinderGeometry(.22, .22, 1, 12), M.galv, group);
    add(boxGeo(w + .6, 1.8, w + .6, 2, d.x, top + 3.4 + .9, d.z), M.yellow, group);
    world.add({ x0: d.x - w / 2 - .3, y0: top + 3.4, z0: d.z - w / 2 - .3, x1: d.x + w / 2 + .3, y1: top + 5.2, z1: d.z + w / 2 + .3, surf: 'steel' });
    this.lamp = add(new THREE.SphereGeometry(.16, 10, 8), M.glow(0xff2010, 0), group); this.lamp.position.set(d.x + w / 2 + .3, top + 4.5, d.z + w / 2 + .3);
    this.rodTop = top + 3.4;
    this.light = new THREE.PointLight(0xff3010, 0, 6, 2); this.light.position.copy(this.lamp.position); group.add(this.light);
  }
  update(dt, game) {
    const d = this.d; if (!game.frozen) this.t += dt * game.diff.hazard;
    const P = [2.0, .75, .12, .55, .9], T = 4.32; let t = this.t % T, k = 0;
    while (t > P[k]) { t -= P[k]; k++; }
    this.k = k; this.left = P[k] - t;
    let y = this.up;
    if (k === 1) y = this.up + Math.sin(t * 40) * .02;
    if (k === 2) y = lerp(this.up, this.down, (t / P[2]) ** 2);
    if (k === 3) y = this.down;
    if (k === 4) y = lerp(this.down, this.up, smooth(t / P[4]));
    if (k === 3 && this.last !== 3) { game.fx.dust(V.set(d.x, d.y + .1, d.z), 18); game.audio.play('press', { pos: V, vol: 1 }); game.shake(.35, V); }
    this.last = k;
    game.world.moveDyn(this.box, d.x - d.w / 2, y, d.z - d.w / 2);
    this.head.position.set(d.x, y, d.z);
    const rl = this.rodTop - (y + 1.1); this.rod.scale.y = Math.max(.01, rl); this.rod.position.set(d.x, y + 1.1 + rl / 2, d.z);
    const warn = k === 1 || k === 2 || k === 3;
    this.lamp.material.emissiveIntensity = warn ? 4 : .3; this.light.intensity = warn ? 6 : 0;
    const b = game.player.body;
    if ((k === 2 || k === 3) && !game.player.dead && overlapXZ(b, this.box, -.3) && b.y < y && b.y + b.h > y - .1 && b.y >= d.y - .3) game.killPlayer('squash');
  }
}

Press.prototype.danger = function (x, y, z) {
  const d = this.d, h = d.w / 2 + .5;
  if (Math.abs(x - d.x) > h || Math.abs(z - d.z) > h || y < d.y - .3 || y > d.y + 1.2) return false;
  return !(this.k === 0 && this.left > 1.15);
};

export class Vent {
  constructor(d, ctx) {
    const { M, group } = ctx; this.d = d; this.t = d.phase || 0;
    const g = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, .08, 20), M.dark); g.position.set(d.x, d.y + .04, d.z); g.receiveShadow = true; group.add(g);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.85, .06, 6, 24), M.hazard); ring.rotation.x = Math.PI / 2; ring.position.set(d.x, d.y + .08, d.z); group.add(ring);
    this.glow = new THREE.Mesh(new THREE.CircleGeometry(.7, 20), M.glow(0xffffff, 0)); this.glow.rotation.x = -Math.PI / 2; this.glow.position.set(d.x, d.y + .09, d.z); group.add(this.glow);
  }
  update(dt, game) {
    const d = this.d; this.t += dt;
    const T = 4.2, t = this.t % T, warn = t > 2.6 && t < 3.2, blast = t >= 3.2;
    this.tt = t;
    const pos = V.set(d.x, d.y + .2, d.z);
    if (Math.random() < (blast ? .9 : warn ? .5 : .08)) game.fx.steam(pos, blast ? 4 : 1, blast ? 9 : 2.5);
    if (blast && this.lastPhase !== 'blast') game.audio.play('steam', { pos, vol: 1 });
    this.lastPhase = blast ? 'blast' : warn ? 'warn' : 'idle';
    this.glow.material.emissiveIntensity = blast ? .8 : warn ? .4 : 0;
    const b = game.player.body, dx = b.x - d.x, dz = b.z - d.z;
    if (blast && dx * dx + dz * dz < .85 * .85 && b.y < d.y + 1.5 && b.y > d.y - .3 && game.player.state !== 'climb') {
      if (b.vy < d.power * .8) { b.vy = d.power; b.onGround = false; b.ground = null; game.player.launch(); }
    }
  }
}

Vent.prototype.danger = function (x, y, z) {
  const d = this.d; if (Math.hypot(x - d.x, z - d.z) > 1.15 || Math.abs(y - d.y) > 1) return false;
  return !((this.tt || 0) < 1.7);
};

export class Arc {
  constructor(d, ctx) {
    const { M, group } = ctx; this.d = d; this.t = 0;
    for (const z of [d.z0, d.z1]) {
      const post = new THREE.Mesh(boxGeo(.3, 2.4, .3, 1, d.x, d.y + 1.2, z), M.dark); post.castShadow = true; group.add(post);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 8), M.galv); cap.position.set(d.x, d.y + 2.5, z); group.add(cap);
    }
    ctx.world.add({ x0: d.x - .15, y0: d.y, z0: d.z0 - .15, x1: d.x + .15, y1: d.y + 2.4, z1: d.z0 + .15 });
    ctx.world.add({ x0: d.x - .15, y0: d.y, z0: d.z1 - .15, x1: d.x + .15, y1: d.y + 2.4, z1: d.z1 + .15 });
    this.lines = [];
    for (let k = 0; k < 4; k++) {
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(26 * 3), 3));
      const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: k ? 0x9fd8ff : 0xffffff, transparent: true, opacity: .9, blending: THREE.AdditiveBlending }));
      l.frustumCulled = false; group.add(l); this.lines.push(l);
    }
    this.sheet = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(d.z1 - d.z0), 2.2), new THREE.MeshBasicMaterial({ color: 0x4aa8ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    this.sheet.rotation.y = Math.PI / 2; this.sheet.position.set(d.x, d.y + 1.2, (d.z0 + d.z1) / 2); group.add(this.sheet);
    this.light = new THREE.PointLight(0x7ac8ff, 0, 10, 2); this.light.position.set(d.x, d.y + 1.5, (d.z0 + d.z1) / 2); group.add(this.light);
  }
  update(dt, game) {
    const d = this.d; if (!game.frozen) this.t += dt * game.diff.hazard;
    const T = d.on + d.off, t = this.t % T, on = t > d.off, warn = !on && t > d.off - .6;
    this.offLeft = on ? 0 : d.off - t;
    for (const [k, l] of this.lines.entries()) {
      l.visible = on || (warn && k === 0 && Math.random() < .3);
      if (!l.visible) continue;
      const a = l.geometry.attributes.position, hh = d.y + .4 + k * .5 + (on ? 0 : 1.6);
      for (let i = 0; i < 26; i++) { const f = i / 25; a.setXYZ(i, d.x + (Math.random() - .5) * .3 * Math.sin(f * Math.PI), hh + (Math.random() - .5) * .5 * Math.sin(f * Math.PI), d.z0 + (d.z1 - d.z0) * f); }
      a.needsUpdate = true;
    }
    this.sheet.material.opacity = on ? .12 + Math.random() * .1 : 0;
    this.light.intensity = on ? 18 + Math.random() * 20 : warn ? Math.random() * 6 : 0;
    if (on && !this.wasOn) game.audio.play('zap', { pos: this.light.position, vol: 1 });
    if (warn && Math.random() < .15) game.fx.sparks(V.set(d.x, d.y + 2.5, Math.random() < .5 ? d.z0 : d.z1), 3, 0x9fd8ff);
    this.wasOn = on;
    const b = game.player.body;
    if (on && !game.player.dead && Math.abs(b.x - d.x) < .3 + b.r && b.z > Math.min(d.z0, d.z1) && b.z < Math.max(d.z0, d.z1) && b.y > d.y - .3 && b.y < d.y + 2.2) game.hitPlayer('zap');
  }
}

Arc.prototype.danger = function (x, y, z) {
  const d = this.d; if (Math.abs(x - d.x) > .85 || z < Math.min(d.z0, d.z1) || z > Math.max(d.z0, d.z1) || y < d.y - .3 || y > d.y + 2.2) return false;
  return !(this.offLeft > 1.0);
};

export class Molten {
  constructor(d, ctx) {
    this.d = d;
    const w = d.x1 - d.x0, h = d.z1 - d.z0;
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uT: { value: 0 } },
      vertexShader: `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform float uT; varying vec2 vUv; varying vec3 vW;
        float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
        float fbm(vec2 p){ float s = 0., a = .5; for(int i=0;i<5;i++){ s += a*n(p); p = p*2.03 + 1.7; a *= .5; } return s; }
        void main(){
          vec2 p = vW.xz * .45; float t = uT * .25;
          float q = fbm(p + vec2(t, -t*.6)); float r = fbm(p*1.7 + q*2.2 - vec2(t*.8, t*.3));
          float crust = smoothstep(.52, .72, r);
          vec3 hot = mix(vec3(4.5,1.6,.25), vec3(6.,3.4,1.), smoothstep(.2,.6,q));
          vec3 col = mix(hot, vec3(.08,.03,.02), crust*.85);
          gl_FragColor = vec4(col, 1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), this.mat);
    m.rotation.x = -Math.PI / 2; m.position.set((d.x0 + d.x1) / 2, d.y, (d.z0 + d.z1) / 2); ctx.group.add(m);
    this.lights = [-1, 0, 1].map(k => { const l = new THREE.PointLight(0xff6a1a, 30, 16, 1.6); l.position.set((d.x0 + d.x1) / 2 + k * w / 3, d.y + 1.4, (d.z0 + d.z1) / 2); ctx.group.add(l); return l; });
    this.t = 0;
  }
  update(dt, game) {
    this.t += dt; this.mat.uniforms.uT.value = this.t;
    this.lights.forEach((l, i) => l.intensity = 26 + Math.sin(this.t * 3 + i * 2) * 6 + Math.random() * 3);
    const d = this.d, b = game.player.body;
    if (!game.player.dead && b.x > d.x0 && b.x < d.x1 && b.z > d.z0 && b.z < d.z1 && b.y < d.y + .5) { game.killPlayer('molten'); game.audio.play('sizzle', { vol: 1 }); }
    if (Math.random() < dt * 3) game.fx.embers(V.set(rr(d.x0, d.x1), d.y + .1, rr(d.z0, d.z1)), 2);
  }
}

Molten.prototype.danger = function (x, y, z) { const d = this.d; return x > d.x0 - .4 && x < d.x1 + .4 && z > d.z0 - .4 && z < d.z1 + .4 && y < d.y + 1; };

export class Ladle {
  constructor(d, ctx) {
    const { M, group } = ctx; this.t = 3;
    const g = this.g = new THREE.Group(); group.add(g);
    const bridge = new THREE.Mesh(boxGeo(1, .9, 24, 1, 0, 19.2, -2), M.dark); g.add(bridge);
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.1, .8, 1.6, 18), M.dark); pot.position.set(0, 11.5, -2); g.add(pot); this.pot = pot;
    const lip = new THREE.Mesh(new THREE.CircleGeometry(1.0, 18), M.glow(0xff7a20, 4)); lip.rotation.x = -Math.PI / 2; lip.position.set(0, .81, 0); pot.add(lip);
    this.cab = cable(M.cable); g.add(this.cab); aimCable(this.cab, new THREE.Vector3(0, 18.8, -2), new THREE.Vector3(0, 12.3, -2));
    g.traverse(o => { if (o.isMesh) o.castShadow = true; });
    this.light = new THREE.PointLight(0xff8a30, 0, 14, 1.5); this.light.position.set(0, 9, -2); g.add(this.light);
  }
  update(dt, game) {
    this.t += dt;
    const x = Math.sin(this.t * .12) * 5.5; this.g.position.x = x;
    const pour = (this.t % 14) > 10.5;
    this.pot.rotation.z = lerp(this.pot.rotation.z, pour ? .7 : 0, dt * 2);
    this.light.intensity = pour ? 25 : 4;
    if (pour && this.pot.rotation.z > .5) game.fx.pour(V.set(x + .9, 11.8, -2), 6);
  }
}

export class Wreck {
  constructor(d, ctx) {
    const { M, group } = ctx; this.d = d; this.t = 0;
    if (d.load === 'girders') { // a bundle of girders swinging from a crane hook
      this.ball = new THREE.Group();
      for (let k = 0; k < 3; k++) { const m = new THREE.Mesh(boxGeo(.34, .42, 3.4, 2, (k - 1) * .36, -.2 - (k === 1 ? .44 : 0), 0), M.beam); m.castShadow = true; this.ball.add(m); }
      this.ball.add(new THREE.Mesh(boxGeo(1.2, .08, .08, 1, 0, .3, 0), M.cable));
      if (d.axis === 'x') this.ball.rotation.y = 0; else this.ball.rotation.y = Math.PI / 2;
    } else this.ball = new THREE.Mesh(new THREE.SphereGeometry(.9, 28, 20), new THREE.MeshStandardMaterial({ color: 0x2a2a2c, roughness: .35, metalness: .85 }));
    this.ball.castShadow = true; group.add(this.ball);
    this.cab = cable(M.cable); group.add(this.cab);
    if (!d.noBoom) { const boom = new THREE.Mesh(boxGeo(.8, .8, 10, 1, d.px, d.py + .4, d.pz + (d.axis === 'z' ? 0 : -4)), M.yellow); boom.castShadow = true; group.add(boom); }
    this.wasNear = false;
  }
  pos(t) {
    const d = this.d, th = d.amp * Math.sin(t * TAU / d.period), o = d.L * Math.sin(th);
    return [d.px + (d.axis === 'z' ? 0 : o), d.py - d.L * Math.cos(th), d.pz + (d.axis === 'z' ? o : 0)];
  }
  update(dt, game) {
    this.hz = game.diff.hazard; if (!game.frozen) this.t += dt * game.diff.hazard;
    const [x, y, z] = this.pos(this.t); this.ball.position.set(x, y, z);
    aimCable(this.cab, new THREE.Vector3(this.d.px, this.d.py, this.d.pz), this.ball.position);
    const b = game.player.body, cy = clamp(y, b.y + .3, b.y + b.h - .3);
    const dx = b.x - x, dy = cy - y, dz = b.z - z, dist = Math.hypot(dx, dy, dz);
    if (dist < 4 && !this.wasNear) game.audio.play(this.d.load ? 'crane_loop' : 'wrecking', { pos: this.ball.position, vol: .9 });
    this.wasNear = dist < 4;
    if (dist < .9 + b.r && !game.player.dead) {
      const [x2, , z2] = this.pos(this.t + .05);
      game.hitPlayer('wreck', { push: V.set((x2 - x) * 120, 7, (z2 - z) * 120) });
    }
  }
}

// the whole volume the ball sweeps through at body height
Wreck.prototype.zone = function (x, y, z) {
  const d = this.d, reach = d.L * Math.sin(d.amp) + 1.4, low = d.py - d.L - 1.2;
  if (y + 1.8 < low || y > d.py - d.L * Math.cos(d.amp) + 1) return false;
  return d.axis === 'z' ? Math.abs(x - d.px) < 1.7 && Math.abs(z - d.pz) < reach : Math.abs(z - d.pz) < 1.7 && Math.abs(x - d.px) < reach;
};
Wreck.prototype.danger = function (x, y, z) {
  for (let k = 0; k <= 5; k++) { const [bx, by, bz] = this.pos(this.t + k * .25 * (this.hz || 1)); if (Math.hypot(x - bx, y + .9 - by, z - bz) < 2) return true; }
  return false;
};

export class Wind {
  constructor(d, ctx) { this.d = d; this.t = 0; this.next = 7; this.state = 'calm'; this.dir = 1; this.f = 0; }
  update(dt, game) {
    this.t += dt; this.next -= dt;
    if (this.next <= 0 && !game.coopGuest) {
      if (this.state === 'calm') { this.state = 'warn'; this.next = 1.6; this.dir = Math.random() < .5 ? -1 : 1; game.audio.play('gust', { vol: .9 }); game.caption('Wind gust incoming!'); }
      else if (this.state === 'warn') { this.state = 'gust'; this.next = 2.4; }
      else { this.state = 'calm'; this.next = rr(6, 10) / game.diff.hazard; }
    }
    const target = this.state === 'gust' ? 1 : this.state === 'warn' ? .15 : 0;
    this.f = lerp(this.f, target, 1 - Math.exp(-4 * dt));
    game.wind.set(this.dir * this.f * (this.d.power || 7.5), 0, 0);
    if (this.f > .1 || this.state === 'warn') game.fx.windStreaks(game.player.body, this.dir, this.state === 'warn' ? .4 : this.f);
  }
}

// Water: the flooding pit (rises until the pumps run; resets when Mac is wiped out) or a river (fixed level, deadly).
let waterNormal = null;
function waterNormalTex() {
  if (waterNormal) return waterNormal;
  const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'), img = g.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const X = x / N * TAU * 3, Y = y / N * TAU * 3; // whole periods across the tile so it repeats seamlessly
    const dx = Math.cos(X) * .5 + Math.cos(X + Y) * .35 + Math.cos(2 * X - Y) * .2, dy = Math.sin(Y) * .5 + Math.sin(Y - X) * .35 + Math.sin(2 * Y + X) * .2;
    const i = (y * N + x) * 4; img.data[i] = 128 + dx * 70; img.data[i + 1] = 128 + dy * 70; img.data[i + 2] = 235; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  waterNormal = new THREE.CanvasTexture(c); waterNormal.wrapS = waterNormal.wrapT = THREE.RepeatWrapping;
  return waterNormal;
}
export function waterMaterial(color, w, h, opacity = .9) {
  const tex = waterNormalTex().clone(); tex.needsUpdate = true; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(w / 7, h / 7);
  return new THREE.MeshStandardMaterial({ color, roughness: .1, metalness: .25, normalMap: tex, normalScale: new THREE.Vector2(.55, .55), transparent: opacity < 1, opacity });
}
export class Water {
  constructor(d, ctx) {
    this.d = d; this.level = d.y0; this.t = 0; this.rising = 0;
    const w = d.x1 - d.x0, h = d.z1 - d.z0;
    this.mat = waterMaterial(d.color || 0x4a5040, w, h, d.opacity ?? .9);
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), this.mat); this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set((d.x0 + d.x1) / 2, this.level, (d.z0 + d.z1) / 2); this.mesh.receiveShadow = true; this.mesh.renderOrder = 1;
    ctx.group.add(this.mesh);
  }
  inside(x, z) { const d = this.d; return x > d.x0 && x < d.x1 && z > d.z0 && z < d.z1; }
  update(dt, game) {
    const d = this.d, p = game.player, b = p.body; this.t += dt;
    if (d.rate) {
      const st = game.objects.stations, on = st.filter(s => s.on).length;
      this.rising = game.frozen ? 0 : d.rate * Math.max(0, 1 - on / Math.max(1, st.length) * 1.25);
      this.level = Math.min(d.max, this.level + this.rising * dt * game.diff.hazard);
      game.audio.motor('water_loop', this, V.set(clamp(b.x, d.x0, d.x1), this.level, clamp(b.z, d.z0, d.z1)), this.rising > .001 ? .3 : 0);
    }
    this.mesh.position.y = this.level;
    const f = d.flow || [0, 0], tx = this.mat.normalMap;
    tx.offset.x += (f[0] * .08 + .006) * dt; tx.offset.y += (f[1] * .08 + .004) * dt;
    if (!p.dead && this.inside(b.x, b.z)) {
      const depth = this.level - b.y;
      if (depth > (d.deadly ?? .9)) {
        game.fx.splash(V.set(b.x, this.level, b.z), 30); game.audio.play('splash', { vol: 1 });
        game.killPlayer(d.rate ? 'drown' : 'splash');
      } else if (depth > .08 && Math.hypot(b.vx, b.vz) > 1 && Math.random() < dt * 9) game.fx.splash(V.set(b.x, this.level, b.z), 2);
    }
  }
  depth(x, y, z) { return this.inside(x, z) ? this.level - y : -1e9; }
  danger(x, y, z) { return this.inside(x, z) && this.level + this.rising * 6 - y > .55; }
  zone(x, y, z) { return this.danger(x, y, z); }
  blocks(x, y, z) { return this.inside(x, z) && this.level + this.rising * 12 - y > .35; } // planning: don't route through water this deep
  clear() { if (this.d.rate) this.level = this.d.y0; } // after a wipe-out the pumps catch up
}

// Diesel pile driver: the hammer creeps up its leader, hangs (warning lamp), then slams the pile.
export class PileDriver {
  constructor(d, ctx) {
    const { world, M, group } = ctx; this.d = d; this.t = d.phase || 0; this.k = 0; this.left = 9;
    const g = new THREE.Group(); g.position.set(d.x, d.y, d.z); group.add(g);
    const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
    for (const s of [-1, 1]) add(boxGeo(.16, 9.2, .16, 1), M.yellow, s * .62, 4.6, -.72);
    for (let y = 1; y < 9; y += 1.6) add(boxGeo(1.4, .08, .08, 1), M.yellow, 0, y, -.72);
    add(boxGeo(1.6, .5, .6, 1), M.dark, 0, 9.3, -.5);
    add(boxGeo(.5, 1.0, .5, 1), M.beam, 0, .5, 0); // the pile
    world.add({ x0: d.x - .25, y0: d.y, z0: d.z - .25, x1: d.x + .25, y1: d.y + 1, z1: d.z + .25, surf: 'steel' });
    world.add({ x0: d.x - .8, y0: d.y, z0: d.z - .9, x1: d.x + .8, y1: d.y + 9.2, z1: d.z - .6, surf: 'steel', noFloor: true });
    const ring = add(new THREE.RingGeometry(.9, 1.15, 32), new THREE.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: .5, depthWrite: false }), 0, .04, 0); ring.rotation.x = -Math.PI / 2; this.ring = ring;
    this.hammer = new THREE.Group(); g.add(this.hammer);
    const hm = new THREE.Mesh(boxGeo(1.3, 1.7, 1.3, 1), M.dark); hm.castShadow = true; this.hammer.add(hm); hm.position.y = .85;
    const band = new THREE.Mesh(boxGeo(1.34, .25, 1.34, 1), M.hazard); band.position.y = .3; this.hammer.add(band);
    this.lamp = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 8), M.glow(0xff3010, 0)); this.lamp.position.set(0, 9.65, -.5); g.add(this.lamp);
    this.up = 6.2; this.down = 1.0; this.y = this.up;
  }
  update(dt, game) {
    const d = this.d; if (!game.frozen) this.t += dt * game.diff.hazard;
    const P = [2.8, .9, .14, 1.1], T = 4.94; let t = this.t % T, k = 0;
    while (t > P[k]) { t -= P[k]; k++; }
    this.k = k; this.left = P[k] - t;
    const y = k === 0 ? lerp(this.down, this.up, smooth(t / P[0])) : k === 1 ? this.up + Math.sin(t * 50) * .03 : k === 2 ? lerp(this.up, this.down, (t / P[2]) ** 2) : this.down;
    this.y = y; this.hammer.position.y = y;
    this.lamp.material.emissiveIntensity = k === 1 || k === 2 ? ((t * 8) % 1 < .5 ? 5 : .5) : .2;
    this.ring.material.opacity = k === 1 || k === 2 ? .45 + .4 * Math.abs(Math.sin(t * 12)) : .18;
    const p = game.player, b = p.body, dx = b.x - d.x, dz = b.z - d.z;
    if (k === 3 && this.last !== 3) {
      V.set(d.x, d.y + .2, d.z); game.fx.dust(V, 26); game.audio.play('pile_driver', { pos: V, vol: 1 }); game.shake(.55, V);
      if (!p.dead && b.onGround && Math.hypot(dx, dz) < 3.4 && Math.abs(b.y - d.y) < 1.2 && p.state === 'normal') { b.vy = 4.2; b.onGround = false; b.ground = null; } // the ground jumps
    }
    this.last = k;
    if ((k === 2 || (k === 3 && t < .1)) && !p.dead && Math.abs(dx) < .65 + b.r && Math.abs(dz) < .65 + b.r && b.y < d.y + y + .1 && b.y + b.h > d.y + y - .2) game.killPlayer('squash');
  }
  danger(x, y, z) {
    const d = this.d; if (Math.abs(x - d.x) > 1.6 || Math.abs(z - d.z) > 1.6 || y < d.y - .3 || y > d.y + 1.5) return false;
    return !(this.k === 0 && this.left > 1.3) && !(this.k === 3 && this.left < 1.0 && this.left > .2) ;
  }
}

// Cracked slabs in the demolition job: stand on one and it shakes, drops away, and comes back a few seconds later.
let crackTex = null;
function crackMaterial() {
  if (!crackTex) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.fillStyle = '#8d8a84'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '60,58,55' : '170,166,160'},.25)`; g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); }
    g.strokeStyle = '#2a2622'; g.lineWidth = 2.2;
    for (let k = 0; k < 7; k++) { g.beginPath(); let x = 128 + rr(-30, 30), y = 128 + rr(-30, 30); g.moveTo(x, y); for (let s = 0; s < 9; s++) { x += rr(-34, 34); y += rr(-34, 34); g.lineTo(x, y); } g.stroke(); }
    g.fillStyle = 'rgba(242,177,10,.85)'; for (let x = 0; x < 256; x += 32) { g.fillRect(x, 0, 16, 10); g.fillRect(x + 16, 246, 16, 10); }
    crackTex = new THREE.CanvasTexture(c); crackTex.colorSpace = THREE.SRGBColorSpace;
  }
  return cutaway(new THREE.MeshStandardMaterial({ map: crackTex, roughness: .95, metalness: 0 }));
}
export class Crumble {
  constructor(d, ctx) {
    const { world, group } = ctx; this.ctx = ctx; const mat = crackMaterial();
    this.slabs = d.slabs.map(([x0, z0, x1, z1, y]) => {
      const box = world.addDyn({ x0, y0: y - .3, z0, x1, y1: y, z1, surf: 'concrete', crumble: true });
      const mesh = new THREE.Mesh(boxGeo(x1 - x0, .3, z1 - z0, 2), mat); mesh.castShadow = mesh.receiveShadow = true; group.add(mesh);
      const s = { x0, z0, x1, z1, y, box, mesh, state: 'solid', t: 0, vy: 0 }; this.place(s); return s;
    });
  }
  place(s) { s.mesh.position.set((s.x0 + s.x1) / 2, s.y - .15, (s.z0 + s.z1) / 2); s.mesh.rotation.set(0, 0, 0); s.mesh.visible = true; s.mesh.scale.setScalar(1); s.box.enabled = true; s.state = 'solid'; }
  update(dt, game) {
    const p = game.player, b = p.body;
    for (const s of this.slabs) {
      const c = V.set((s.x0 + s.x1) / 2, s.y, (s.z0 + s.z1) / 2);
      if (s.state === 'solid') { if (!p.dead && b.onGround && b.ground === s.box) { s.state = 'shake'; s.t = .75; game.audio.play('crumble', { pos: c, vol: .45, rate: 1.4 }); } }
      else if (s.state === 'shake') {
        s.t -= dt; s.mesh.position.x = c.x + rr(-.04, .04); s.mesh.position.z = c.z + rr(-.04, .04);
        if (Math.random() < .3) game.fx.dust(V.set(rr(s.x0, s.x1), s.y - .3, rr(s.z0, s.z1)), 2);
        if (s.t <= 0) { s.state = 'fall'; s.vy = 0; s.box.enabled = false; game.audio.play('crumble', { pos: c, vol: 1 }); game.fx.dust(c, 22); s.spin = rr(-1, 1); }
      } else if (s.state === 'fall') {
        s.vy -= 30 * dt; s.mesh.position.y += s.vy * dt; s.mesh.rotation.x += s.spin * dt; s.mesh.rotation.z += s.spin * .6 * dt;
        if (s.mesh.position.y < s.y - 16) { s.state = 'gone'; s.mesh.visible = false; s.t = 6; }
      } else if (s.state === 'gone') {
        s.t -= dt;
        const over = b.x > s.x0 - .4 && b.x < s.x1 + .4 && b.z > s.z0 - .4 && b.z < s.z1 + .4 && Math.abs(b.y - s.y) < 2;
        if (s.t <= 0 && !over) { this.place(s); s.state = 'rise'; s.t = .6; s.mesh.scale.setScalar(.01); }
      } else if (s.state === 'rise') { s.t -= dt; s.mesh.scale.setScalar(clamp(1 - s.t / .6, .01, 1)); if (s.t <= 0) s.state = 'solid'; }
    }
  }
  clear() { for (const s of this.slabs) this.place(s); }
}

// Barges sliding along the river under the bridge (scenery, with a horn as they pass).
export class Boats {
  constructor(d, ctx) {
    const { M, group } = ctx; this.d = d;
    this.list = (d.lanes || [[-8, 1], [10, -1]]).map(([z, dir], i) => {
      const g = new THREE.Group(); group.add(g);
      const add = (geo, mat, x, y, zz) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, zz); m.castShadow = true; g.add(m); return m; };
      const hull = M.paint([0x8a2f22, 0x2f4f6a][i % 2], .6, .3);
      add(boxGeo(16, 1.6, 5, 2), hull, 0, .3, 0); add(boxGeo(15.6, .2, 4.6, 2), M.dark, 0, 1.15, 0);
      add(boxGeo(3, 2.4, 3.4, 1), M.paint(0xf0f0ea, .5, .1), -5.5 * dir, 2.4, 0); add(boxGeo(3.05, .6, 3.45, 1), M.glass, -5.5 * dir, 3.1, 0);
      for (let k = 0; k < 3; k++) add(boxGeo(2.2, 1.2, 4, 1), M.corr([0xb5402a, 0x2a6db5, 0xd8a21c][k]), 1 + k * 2.6 * dir, 1.85, 0);
      return { g, z, dir, x: rr(-80, 80), v: rr(3, 4.5), honked: false };
    });
  }
  update(dt, game) {
    for (const o of this.list) {
      o.x += o.v * o.dir * dt; if (o.x * o.dir > 110) { o.x = -110 * o.dir; o.honked = false; }
      o.g.position.set(o.x, this.d.y, o.z); o.g.rotation.y = o.dir > 0 ? 0 : Math.PI;
      if (!o.honked && Math.abs(o.x) < 22) { o.honked = true; game.audio.play('boat_horn', { pos: o.g.position, vol: .9, range: 90 }); }
    }
  }
}

// co-op: the guest's hazard clocks follow the host's (small drift is eased out, big jumps snap)
const clockSync = {
  sync() { return [Math.round(this.t * 100) / 100]; },
  setSync(a, lag = 0) { const t = a[0] + lag, e = t - this.t; this.t = Math.abs(e) > .3 ? t : this.t + e * .25; },
};
for (const C of [CraneMagnet, SwingBeam, Press, Vent, Arc, Ladle, Wreck, PileDriver]) Object.assign(C.prototype, clockSync);
Water.prototype.sync = function () { return [Math.round(this.level * 1000) / 1000, Math.round(this.rising * 10000) / 10000]; };
Water.prototype.setSync = function (a) { this.level = Math.abs(this.level - a[0]) > .08 ? a[0] : this.level + (a[0] - this.level) * .3; this.rising = a[1]; };
Wind.prototype.sync = function () { return [['calm', 'warn', 'gust'].indexOf(this.state), Math.round(this.f * 100) / 100, this.dir, Math.round(this.next * 100) / 100]; };
Wind.prototype.setSync = function (a) { const s = ['calm', 'warn', 'gust'][a[0]] || 'calm'; this.state = s; this.f = a[1]; this.dir = a[2]; this.next = a[3] + 1; };
Boats.prototype.sync = function () { return this.list.map(o => Math.round(o.x * 10) / 10); };
Boats.prototype.setSync = function (a) { this.list.forEach((o, i) => { if (a[i] !== undefined && Math.abs(o.x - a[i]) > 1) o.x = a[i]; }); };

// ---------------- factory ----------------
export function makeMover(d, ctx) {
  if (d.type === 'elevator') return new Elevator(d, ctx);
  if (d.type === 'crane') return new CraneMagnet(d, ctx);
  if (d.type === 'swing') return new SwingBeam(d, ctx);
}
export function makeHazard(d, ctx) {
  switch (d.type) {
    case 'bolts': return new Bolts(d, ctx);
    case 'pipes': return new Pipes(d, ctx);
    case 'press': return new Press(d, ctx);
    case 'vent': return new Vent(d, ctx);
    case 'arc': return new Arc(d, ctx);
    case 'molten': return new Molten(d, ctx);
    case 'ladle': return new Ladle(d, ctx);
    case 'wreck': return new Wreck(d, ctx);
    case 'wind': return new Wind(d, ctx);
    case 'water': return new Water(d, ctx);
    case 'piledriver': return new PileDriver(d, ctx);
    case 'crumble': return new Crumble(d, ctx);
    case 'boats': return new Boats(d, ctx);
  }
}
