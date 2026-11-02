// Moving platforms and hazards. Each has update(dt, game) and optional dispose().
import * as THREE from 'three';
import { boxGeo } from './builder.js';
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
    group.add(g);
  }
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
export class Bolts {
  constructor(d, ctx) {
    this.d = d; this.ctx = ctx; this.timer = 4; this.list = [];
    this.mat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: .3, metalness: .95 });
    this.ringMat = new THREE.MeshBasicMaterial({ color: 0xff3a1a, transparent: true, opacity: .8, depthWrite: false });
  }
  update(dt, game) {
    const p = game.player, b = p.body;
    if (!game.frozen) this.timer -= dt;
    if (this.timer <= 0 && !p.dead && p.state !== 'climb' && b.onGround) {
      this.timer = this.d.rate / game.diff.hazard * rr(.75, 1.25);
      for (let tries = 0; tries < 8; tries++) {
        const a = Math.random() * TAU, r = Math.random() < .55 ? rr(0, 1.2) : rr(1, 4.5);
        const x = b.x + Math.cos(a) * r + b.vx * .6, z = b.z + Math.sin(a) * r + b.vz * .6;
        const gnd = game.world.groundBelow(x, z, b.y + .4, .05);
        if (!gnd || Math.abs(gnd.y1 - b.y) > .45 || gnd.dyn) continue;
        const ring = new THREE.Mesh(new THREE.RingGeometry(.35, .5, 24), this.ringMat.clone()); ring.rotation.x = -Math.PI / 2; ring.position.set(x, gnd.y1 + .03, z);
        const bolt = new THREE.Group(); for (const g of hexBolt()) { const m = new THREE.Mesh(g, this.mat); m.castShadow = true; bolt.add(m); }
        bolt.position.set(x, gnd.y1 + 3.6, z); bolt.visible = false; bolt.scale.setScalar(1.6);
        this.ctx.group.add(ring, bolt);
        this.list.push({ x, z, y: gnd.y1, t: 0, ring, bolt, warn: 1.05 });
        game.audio.play('bolt_fall', { pos: ring.position, vol: .6, rate: rr(.9, 1.1) });
        break;
      }
    }
    for (let i = this.list.length - 1; i >= 0; i--) {
      const o = this.list[i];
      if (game.frozen && o.t < o.warn) continue;
      o.t += dt;
      const k = o.t / o.warn;
      o.ring.scale.setScalar(1.6 - .7 * clamp(k, 0, 1)); o.ring.material.opacity = .4 + .5 * Math.abs(Math.sin(o.t * 14));
      if (k >= .55) { o.bolt.visible = true; const f = clamp((k - .55) / .45, 0, 1); o.bolt.position.y = o.y + 3.6 - 3.5 * f * f; o.bolt.rotation.x += dt * 12; }
      if (k >= 1) {
        game.fx.sparks(V.set(o.x, o.y + .1, o.z), 14, 0xffd27a); game.audio.play('clink', { pos: V, vol: .8 });
        const dx = b.x - o.x, dz = b.z - o.z;
        if (!p.dead && dx * dx + dz * dz < .62 * .62 && b.y > o.y - .3 && b.y < o.y + 1.2) game.hitPlayer('bolt');
        this.ctx.group.remove(o.ring, o.bolt); o.ring.geometry.dispose(); o.ring.material.dispose();
        this.list.splice(i, 1);
      }
    }
  }
  clear() { for (const o of this.list) this.ctx.group.remove(o.ring, o.bolt); this.list.length = 0; this.timer = 4; }
}

export class Pipes {
  constructor(d, ctx) {
    this.d = d; this.ctx = ctx; this.timer = 1.5; this.list = [];
    const g = new THREE.CylinderGeometry(d.r, d.r, 2.2, 22, 1, true); g.rotateX(Math.PI / 2);
    const cap = new THREE.RingGeometry(d.r * .75, d.r, 22);
    this.geo = g; this.cap = cap; this.mat = ctx.M.concrete; this.inner = new THREE.MeshStandardMaterial({ color: 0x3b3b3b, roughness: 1, side: THREE.DoubleSide });
  }
  update(dt, game) {
    const d = this.d, b = game.player.body;
    if (!game.frozen) {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.timer = d.every / game.diff.hazard * rr(.8, 1.3);
        const m = new THREE.Group();
        const body = new THREE.Mesh(this.geo, this.mat); body.castShadow = true; m.add(body);
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(d.r * .76, d.r * .76, 2.18, 18, 1, true).rotateX(Math.PI / 2), this.inner); m.add(inner);
        for (const s of [-1, 1]) { const c = new THREE.Mesh(this.cap, this.mat); c.position.z = s * 1.1; c.rotation.y = s > 0 ? 0 : Math.PI; m.add(c); }
        m.position.set(d.x0, d.r, d.z); this.ctx.group.add(m);
        this.list.push({ m, x: d.x0, sp: d.speed * game.diff.speed * rr(.9, 1.15) });
        game.audio.play('pickup', { pos: m.position, vol: .7, rate: .6 });
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
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(.9, 28, 20), new THREE.MeshStandardMaterial({ color: 0x2a2a2c, roughness: .35, metalness: .85 }));
    this.ball.castShadow = true; group.add(this.ball);
    this.cab = cable(M.cable); group.add(this.cab);
    const boom = new THREE.Mesh(boxGeo(.8, .8, 10, 1, d.px, d.py + .4, d.pz + (d.axis === 'z' ? 0 : -4)), M.yellow); boom.castShadow = true; group.add(boom);
    this.wasNear = false;
  }
  pos(t) {
    const d = this.d, th = d.amp * Math.sin(t * TAU / d.period), o = d.L * Math.sin(th);
    return [d.px + (d.axis === 'z' ? 0 : o), d.py - d.L * Math.cos(th), d.pz + (d.axis === 'z' ? o : 0)];
  }
  update(dt, game) {
    if (!game.frozen) this.t += dt * game.diff.hazard;
    const [x, y, z] = this.pos(this.t); this.ball.position.set(x, y, z);
    aimCable(this.cab, new THREE.Vector3(this.d.px, this.d.py, this.d.pz), this.ball.position);
    const b = game.player.body, cy = clamp(y, b.y + .3, b.y + b.h - .3);
    const dx = b.x - x, dy = cy - y, dz = b.z - z, dist = Math.hypot(dx, dy, dz);
    if (dist < 4 && !this.wasNear) game.audio.play('wrecking', { pos: this.ball.position, vol: .9 });
    this.wasNear = dist < 4;
    if (dist < .9 + b.r && !game.player.dead) {
      const [x2, , z2] = this.pos(this.t + .05);
      game.hitPlayer('wreck', { push: V.set((x2 - x) * 120, 7, (z2 - z) * 120) });
    }
  }
}

export class Wind {
  constructor(d, ctx) { this.t = 0; this.next = 7; this.state = 'calm'; this.dir = 1; this.f = 0; }
  update(dt, game) {
    this.t += dt; this.next -= dt;
    if (this.next <= 0) {
      if (this.state === 'calm') { this.state = 'warn'; this.next = 1.6; this.dir = Math.random() < .5 ? -1 : 1; game.audio.play('gust', { vol: .9 }); game.caption('Wind gust incoming!'); }
      else if (this.state === 'warn') { this.state = 'gust'; this.next = 2.4; }
      else { this.state = 'calm'; this.next = rr(6, 10) / game.diff.hazard; }
    }
    const target = this.state === 'gust' ? 1 : this.state === 'warn' ? .15 : 0;
    this.f = lerp(this.f, target, 1 - Math.exp(-4 * dt));
    game.wind.set(this.dir * this.f * 7.5, 0, 0);
    if (this.f > .1 || this.state === 'warn') game.fx.windStreaks(game.player.body, this.dir, this.state === 'warn' ? .4 : this.f);
  }
}

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
  }
}
