// Carryables (girders, crates, topping-out beam), girder sockets, pickups, hopper, beacons.
import * as THREE from 'three';
import { boxGeo } from './builder.js';
import { GRAVITY } from './physics.js';
import { clamp, lerp, TAU, easeOutBack } from './util.js';

const V = new THREE.Vector3(), V2 = new THREE.Vector3();

let beamGradient = null;
function beacon(color, h = 26) {
  if (!beamGradient) {
    const c = document.createElement('canvas'); c.width = 4; c.height = 128; const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.7, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,.9)');
    g.fillStyle = gr; g.fillRect(0, 0, 4, 128); beamGradient = new THREE.CanvasTexture(c); beamGradient.colorSpace = THREE.SRGBColorSpace;
  }
  const m = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, h, 8, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(.32), map: beamGradient, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  m.geometry.translate(0, h / 2, 0); m.renderOrder = 5;
  return m;
}

let rustMat = null;
const rust = () => rustMat || (rustMat = new THREE.MeshStandardMaterial({ color: 0x8a5a3c, roughness: .85, metalness: .45 }));

// Pump (valve wheel on the front) or storm beacon (mast + switch box). Local +z faces the spot where Mac stands.
function stationMesh(kind, M) {
  const g = new THREE.Group(), add = (geo, mat, x = 0, y = 0, z = 0, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const parts = { g };
  if (kind === 'valve') {
    add(boxGeo(1.0, .9, .8, 1, 0, .45, 0), M.yellow);
    add(new THREE.CylinderGeometry(.3, .3, .7, 14).rotateZ(Math.PI / 2), M.dark, 0, 1.12, -.05);
    add(new THREE.CylinderGeometry(.11, .11, 2.6, 10), M.galv, .32, 2.1, -.25);
    add(new THREE.CylinderGeometry(.11, .11, .9, 10).rotateX(Math.PI / 2), M.galv, .32, 3.35, .15);
    const wheel = parts.wheel = new THREE.Group(); wheel.position.set(0, .62, .46); g.add(wheel);
    add(new THREE.TorusGeometry(.24, .03, 8, 20), M.paint(0xc8261c, .5, .3), 0, 0, 0, wheel);
    for (let k = 0; k < 3; k++) add(boxGeo(.46, .03, .03, 1), M.paint(0xc8261c, .5, .3), 0, 0, 0, wheel).rotation.z = k * Math.PI / 3;
    add(new THREE.CylinderGeometry(.05, .05, .12, 8).rotateX(Math.PI / 2), M.galv, 0, .62, .42);
    parts.lamp = add(new THREE.SphereGeometry(.08, 10, 8), M.glow(0xff2a1a, 3), -.38, .98, .3);
    parts.outlet = new THREE.Vector3(.32, 3.35, .62);
  } else {
    add(new THREE.CylinderGeometry(.05, .07, 3.2, 8), M.galv, 0, 1.6, -.15);
    add(boxGeo(.5, .7, .3, 1, 0, 1.0, 0), M.paint(0x3a4048, .5, .5));
    const lever = parts.wheel = new THREE.Group(); lever.position.set(.12, 1.0, .17); g.add(lever);
    add(boxGeo(.05, .3, .05, 1, 0, .15, 0), M.paint(0xc8261c, .5, .3), 0, 0, 0, lever); lever.rotation.x = .8;
    parts.lamp = add(new THREE.SphereGeometry(.16, 14, 10), M.glow(0xff2a1a, .15), 0, 3.32, -.15);
    add(new THREE.CylinderGeometry(.2, .2, .06, 14), M.dark, 0, 3.17, -.15);
    const glow = parts.glow = new THREE.Mesh(new THREE.SphereGeometry(.55, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff3020, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    glow.position.set(0, 3.32, -.15); g.add(glow);
  }
  return parts;
}

function girderMesh(len, mat, wide = .5, H = .45) {
  const g = new THREE.Group(), tf = .05;
  for (const [w, h, d, y] of [[len, tf, wide, H - tf / 2], [len, tf, wide, tf / 2], [len, H - 2 * tf, .05, H / 2]]) {
    const m = new THREE.Mesh(boxGeo(w, h, d, 2, 0, y, 0), mat); m.castShadow = m.receiveShadow = true; g.add(m);
  }
  return g;
}

function crateMesh(M) {
  const g = new THREE.Group();
  const add = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
  add(boxGeo(.9, .9, .9, 1, 0, .45, 0), M.wood);
  for (const y of [.12, .78]) add(boxGeo(.93, .1, .93, 1, 0, y, 0), M.wood);
  add(boxGeo(.95, .05, .2, 1, 0, .905, 0), M.hazard);
  return g;
}

function topBeamMesh(M) {
  const white = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: .4, metalness: .2 });
  const g = girderMesh(3.2, white);
  const tree = new THREE.Group(); tree.position.set(.6, .45, 0); g.add(tree);
  const green = new THREE.MeshStandardMaterial({ color: 0x1f6b35, roughness: .8 });
  for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(.35 - k * .09, .5, 10), green); c.position.y = .35 + k * .28; c.castShadow = true; tree.add(c); }
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 1.6, 6), M.galv); pole.position.set(-.8, 1.25, 0); g.add(pole);
  const flagTex = (() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 160; const x = c.getContext('2d');
    x.fillStyle = '#f2b10a'; x.fillRect(0, 0, 256, 160); x.fillStyle = '#1c1a17'; x.font = '44px Bungee, Impact, sans-serif'; x.textAlign = 'center';
    x.fillText('MAC &', 128, 70); x.fillText('SONS', 128, 122);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(.8, .5, 8, 1), new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide, roughness: .8 }));
  flag.position.set(-.38, 1.8, 0); g.add(flag); g.userData.flag = flag;
  return g;
}

function lunchboxMesh() {
  const g = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: 0xd8232a, roughness: .3, metalness: .5 });
  const box = new THREE.Mesh(boxGeo(.46, .3, .26, 1, 0, .15, 0), red); g.add(box);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .46, 14, 1, false, 0, Math.PI), red); lid.rotation.z = Math.PI / 2; lid.position.y = .3; g.add(lid);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(.08, .015, 6, 12, Math.PI), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: .8, roughness: .3 })); handle.position.y = .44; g.add(handle);
  const latch = new THREE.Mesh(boxGeo(.06, .06, .02, 1, 0, .26, .135), new THREE.MeshStandardMaterial({ color: 0xffd34a, metalness: .9, roughness: .2 })); g.add(latch);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}

function powerMesh(type) {
  const g = new THREE.Group();
  const add = (geo, mat, y = 0) => { const m = new THREE.Mesh(geo, mat); m.position.y = y; m.castShadow = true; g.add(m); return m; };
  if (type === 'coffee') {
    add(new THREE.CylinderGeometry(.13, .1, .3, 16), new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: .5 }), .15);
    add(new THREE.CylinderGeometry(.14, .14, .04, 16), new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: .6 }), .32);
    add(new THREE.CylinderGeometry(.135, .12, .1, 16), new THREE.MeshStandardMaterial({ color: 0xb8742f, roughness: .7 }), .16);
  } else if (type === 'hardhat') {
    const gold = new THREE.MeshStandardMaterial({ color: 0xffcf3a, roughness: .15, metalness: 1, emissive: 0x442200, emissiveIntensity: .4 });
    add(new THREE.SphereGeometry(.22, 20, 10, 0, TAU, 0, Math.PI / 2), gold, .05);
    add(new THREE.CylinderGeometry(.28, .28, .03, 24), gold, .05);
  } else if (type === 'stopwatch') {
    add(new THREE.CylinderGeometry(.2, .2, .07, 24).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd0d6dc, metalness: 1, roughness: .2 }), .25);
    add(new THREE.CircleGeometry(.17, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x334455, roughness: .4 }), .25).position.z = .037;
    add(new THREE.CylinderGeometry(.04, .04, .08, 10), new THREE.MeshStandardMaterial({ color: 0xd0d6dc, metalness: 1, roughness: .2 }), .48);
    const hand = add(new THREE.BoxGeometry(.015, .13, .01), new THREE.MeshBasicMaterial({ color: 0xc01c1c }), .3); hand.position.z = .045;
  } else if (type === 'cash') {
    add(new THREE.SphereGeometry(.24, 16, 12), new THREE.MeshStandardMaterial({ color: 0x3f7a35, roughness: .85 }), .24).scale.set(1, 1.1, 1);
    add(new THREE.CylinderGeometry(.08, .12, .12, 12), new THREE.MeshStandardMaterial({ color: 0x3f7a35, roughness: .85 }), .52);
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#ffe9a0'; x.font = 'bold 54px sans-serif'; x.textAlign = 'center'; x.fillText('$', 32, 52);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = add(new THREE.PlaneGeometry(.24, .24), new THREE.MeshBasicMaterial({ map: t, transparent: true }), .26); s.position.z = .245;
  }
  return g;
}

export const POWER_COLORS = { coffee: 0xff9a3a, hardhat: 0xffd23f, stopwatch: 0x66d0ff, cash: 0x6ee06e, lunch: 0xff4a3a };

export class Objects {
  constructor(B, ctx) {
    this.ctx = ctx; this.M = B.M; this.group = ctx.group; this.world = ctx.world;
    this.carry = []; this.sockets = []; this.pickups = []; this.stations = []; this.t = 0;
    this.objective = B.objective.type; this.hopper = null; this.bin = null; this.delivered = 0;
    for (const d of B.items) {
      if (d.type === 'girder' || d.type === 'crate') this.addCarry(d.type, d);
      else this.addPickup(d.type, d);
    }
    this.sockets = B.sockets.map(d => this.makeSocket(d));
    this.checkpoints = (B.checkpoints || []).map(d => this.makeCheckpoint(d));
    this.stations = (B.stations || []).map(d => this.makeStation(d));
    if (B.bin) {
      this.bin = Object.assign({ bin: true }, B.bin);
      this.bin.beacon = beacon(0xff8a30, 18); this.bin.beacon.position.set(B.bin.x, B.bin.y + 1.6, B.bin.z); this.group.add(this.bin.beacon);
    }
    if (B.hopper) {
      this.hopper = Object.assign({}, B.hopper);
      this.hopper.beacon = beacon(0xff8a30, 18); this.hopper.beacon.position.set(B.hopper.x, B.hopper.y + 1.3, B.hopper.z); this.group.add(this.hopper.beacon);
    }
    this.topBeamSpot = B.topBeamSpot;
    const T = this.objective;
    this.total = T === 'girders' ? this.sockets.length : T === 'collect' ? this.pickups.filter(p => p.type === 'lunch').length
      : T === 'crates' ? this.carry.length : T === 'pumps' || T === 'beacons' ? this.stations.length : this.sockets.length;
    this.ringMat = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false });
  }
  addCarry(kind, d) {
    const mesh = kind === 'girder' ? girderMesh(d.len || 4, d.rust ? rust() : this.M.beam) : kind === 'crate' ? crateMesh(this.M) : topBeamMesh(this.M);
    const o = { kind, mesh, home: { x: d.x, y: d.y, z: d.z, axis: d.axis || 'x' }, pos: new THREE.Vector3(d.x, d.y, d.z), axis: d.axis || 'x', state: 'rest', vy: 0, t: 0, respawn: 0 };
    mesh.position.copy(o.pos); mesh.rotation.y = o.axis === 'z' ? Math.PI / 2 : 0;
    o.beacon = beacon(kind === 'crate' ? 0xffb347 : kind === 'topbeam' ? 0xffffff : 0xff6a3a, 20); o.beacon.position.copy(o.pos); this.group.add(o.beacon);
    this.group.add(mesh); this.carry.push(o);
    return o;
  }
  addPickup(type, d) {
    const mesh = type === 'lunch' ? lunchboxMesh() : powerMesh(type);
    const halo = new THREE.Mesh(new THREE.RingGeometry(.32, .42, 28), new THREE.MeshBasicMaterial({ color: POWER_COLORS[type], transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.rotation.x = -Math.PI / 2; halo.position.set(d.x, d.y + .03, d.z);
    const o = { type, mesh, halo, pos: new THREE.Vector3(d.x, d.y, d.z), taken: false, phase: Math.random() * TAU };
    if (type === 'lunch') { o.beacon = beacon(0xff4a3a, 22); o.beacon.position.copy(o.pos); this.group.add(o.beacon); }
    mesh.position.copy(o.pos); this.group.add(mesh, halo); this.pickups.push(o);
    return o;
  }
  makeSocket(d) {
    const len = d.a1 - d.a0, mid = (d.a0 + d.a1) / 2;
    const s = { d, len, state: 'empty', rivets: 0, progress: 0, box: null, girder: null, final: !!d.final, wob: 0 };
    s.center = d.axis === 'x' ? new THREE.Vector3(mid, d.y, d.c) : new THREE.Vector3(d.c, d.y, mid);
    const holo = girderMesh(len, new THREE.MeshBasicMaterial({ color: s.final ? 0xffffff : 0xffc21a, transparent: true, opacity: .22, blending: THREE.AdditiveBlending, depthWrite: false }));
    holo.position.set(s.center.x, d.y - .45, s.center.z); holo.rotation.y = d.axis === 'z' ? Math.PI / 2 : 0;
    s.holo = holo; this.group.add(holo);
    s.beacon = beacon(s.final ? 0xffffff : 0xffc21a, 24); s.beacon.position.set(s.center.x, d.y, s.center.z); this.group.add(s.beacon);
    s.rivetDots = [];
    for (let k = 0; k < 4; k++) {
      const f = (k + .5) / 4 - .5, dot = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffe14a }));
      const along = f * (len - .4);
      dot.position.set(d.axis === 'x' ? mid + along : d.c, d.y + .03, d.axis === 'x' ? d.c : mid + along);
      dot.visible = false; this.group.add(dot); s.rivetDots.push(dot);
    }
    if (s.final) { s.holo.visible = false; s.beacon.visible = false; s.locked = true; }
    if (d.demo) { // demolition: an old beam bolted in place, to be unbolted and hauled to the scrap bin
      s.demo = true; s.state = 'riveted'; s.rivets = 4; s.anim = 1; s.holo.visible = false;
      const o = girderMesh(len, rust()); o.position.set(s.center.x, d.y - .45, s.center.z); o.rotation.y = d.axis === 'z' ? Math.PI / 2 : 0; this.group.add(o); s.oldMesh = o;
      const [x0, z0, x1, z1] = d.axis === 'x' ? [d.a0, d.c - .25, d.a1, d.c + .25] : [d.c - .25, d.a0, d.c + .25, d.a1];
      s.box = this.world.add({ x0, y0: d.y - .45, z0, x1, y1: d.y, z1, surf: 'steel', socket: s });
      for (const dot of s.rivetDots) { dot.visible = true; dot.material.color.setHex(0xd8a84a); }
    }
    return s;
  }
  makeStation(d) {
    const parts = stationMesh(d.kind, this.M), yaw = d.yaw || 0;
    parts.g.position.set(d.x, d.y, d.z); parts.g.rotation.y = yaw; this.group.add(parts.g);
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    if (d.kind === 'valve') this.world.add({ x0: d.x - .55, y0: d.y, z0: d.z - .55, x1: d.x + .55, y1: d.y + .9, z1: d.z + .55, surf: 'steel' });
    else this.world.add({ x0: d.x - .12, y0: d.y, z0: d.z - .12, x1: d.x + .12, y1: d.y + 3.2, z1: d.z + .12, noFloor: true });
    const st = Object.assign(parts, { kind: d.kind, dev: new THREE.Vector3(d.x, d.y, d.z), use: new THREE.Vector3(d.x + fx * .95, d.y, d.z + fz * .95), yaw, need: d.need || (d.kind === 'valve' ? 2.4 : 1.6), prog: 0, on: false });
    st.pos = st.dev; st.bea = beacon(d.kind === 'valve' ? 0x4ab8ff : 0xff4a3a, 22); st.bea.position.copy(st.dev); this.group.add(st.bea);
    return st;
  }
  stationTarget(p) {
    const b = p.body; let best = null, bd = 1.05;
    for (const s of this.stations) { if (s.on || Math.abs(b.y - s.use.y) > .7) continue; const d = Math.hypot(b.x - s.use.x, b.z - s.use.z); if (d < bd) { bd = d; best = s; } }
    return best;
  }
  stationOn(s) {
    s.on = true; s.prog = s.need; s.bea.visible = false;
    if (s.lamp) s.lamp.material.emissive.setHex(s.kind === 'valve' ? 0x40ff60 : 0xff2a1a);
  }
  // unbolted demolition beam: the gap opens and the beam becomes something to carry
  unbolt(s) {
    if (s.box) this.world.remove(s.box); s.box = null; s.state = 'removed';
    if (s.oldMesh) { this.group.remove(s.oldMesh); s.oldMesh = null; }
    for (const dot of s.rivetDots) dot.visible = false;
    const d = s.d; let spot = null;
    for (const off of [1.35, -1.35, 2.2, -2.2]) {
      const x = d.axis === 'x' ? s.center.x : d.c + off, z = d.axis === 'x' ? d.c + off : s.center.z, g = this.world.groundBelow(x, z, d.y + .1, .3);
      if (g && Math.abs(g.y1 - d.y) < .12 && !g.dyn) { spot = { x, z }; break; }
    }
    spot = spot || { x: s.center.x, z: s.center.z };
    const o = this.addCarry('girder', { x: spot.x, y: d.y, z: spot.z, axis: d.axis, len: Math.min(4, s.len - .3), rust: true });
    o.pos.y = d.y + .7; o.mesh.position.copy(o.pos); o.state = 'falling'; o.vy = 2;
    return o;
  }
  // Respawn post: grey until Mac touches it, then green; deaths respawn at the last one touched.
  makeCheckpoint(d) {
    const g = new THREE.Group(); g.position.set(d.x, d.y, d.z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, 1.7, 8), this.M.galv); pole.position.y = .85; pole.castShadow = true; g.add(pole);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.2, .24, .08, 14), this.M.hazard); base.position.y = .04; g.add(base);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: .7, side: THREE.DoubleSide, emissive: 0x000000 });
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(.62, .4, 6, 1), flagMat); flag.geometry.translate(.31, 0, 0); flag.position.y = 1.48; g.add(flag);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.RingGeometry(.75, .88, 32), ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = .03; g.add(ring);
    this.group.add(g);
    return { pos: new THREE.Vector3(d.x, d.y, d.z), yaw: d.yaw ?? Math.PI, active: false, g, flag, flagMat, ring, ringMat };
  }
  activate(cp) { cp.active = true; cp.flagMat.color.setHex(0x37d66b); cp.flagMat.emissive.setHex(0x1f8f45); cp.ringMat.color.setHex(0x37d66b); }
  socketDist(s, p) {
    const d = s.d, b = p.body;
    const along = d.axis === 'x' ? clamp(b.x, d.a0, d.a1) : clamp(b.z, d.a0, d.a1);
    const qx = d.axis === 'x' ? along : d.c, qz = d.axis === 'x' ? d.c : along;
    return Math.hypot(b.x - qx, b.z - qz);
  }
  // ---- interaction queries ----
  nearCarry(p) {
    const b = p.body; let best = null, bd = 1.7;
    for (const o of this.carry) {
      if (o.state !== 'rest') continue;
      const dy = b.y - o.pos.y; if (dy < -1.1 || dy > 1.2) continue;
      let dist;
      if (o.kind === 'crate') dist = Math.hypot(b.x - o.pos.x, b.z - o.pos.z);
      else { const half = (o.kind === 'topbeam' ? 1.6 : 2) - .3; const ax = o.axis === 'x'; const al = clamp((ax ? b.x - o.pos.x : b.z - o.pos.z), -half, half); dist = Math.hypot(b.x - (ax ? o.pos.x + al : o.pos.x), b.z - (ax ? o.pos.z : o.pos.z + al)); }
      // topmost girder in a stack wins ties
      if (dist < bd || (best && Math.abs(dist - bd) < .05 && o.pos.y > best.pos.y)) { bd = dist; best = o; }
    }
    return best;
  }
  placeTarget(p, o) {
    if (!o) return null;
    if (this.bin && o.kind === 'girder') { const h = this.bin; return (Math.hypot(p.body.x - h.x, p.body.z - h.z) < 2.7 && Math.abs(p.body.y - h.y) < .8) ? h : null; }
    if (o.kind === 'crate') {
      const h = this.hopper; if (!h) return null;
      return (Math.hypot(p.body.x - h.x, p.body.z - h.z) < 2.6 && Math.abs(p.body.y - h.y) < .8) ? h : null;
    }
    let best = null, bd = 2.6;
    for (const s of this.sockets) {
      if (s.state !== 'empty' || s.locked) continue;
      if ((o.kind === 'topbeam') !== s.final) continue;
      if (Math.abs(p.body.y - s.d.y) > .9) continue;
      const dist = this.socketDist(s, p); if (dist < bd) { bd = dist; best = s; }
    }
    return best;
  }
  rivetTarget(p) {
    let best = null, bd = 2.2;
    for (const s of this.sockets) {
      if (s.state !== 'placed' && !(s.demo && s.state === 'riveted')) continue;
      if (p.body.y - s.d.y > .9 || p.body.y - s.d.y < -1.2) continue;
      const dist = this.socketDist(s, p); if (dist < bd) { bd = dist; best = s; }
    }
    return best;
  }
  // ---- actions ----
  pickUp(o) { o.state = 'carried'; o.beacon.visible = false; }
  place(o, s, game) {
    o.state = 'placed'; o.socket = s; s.girder = o; s.state = 'placed'; s.rivets = 0; s.progress = 0; s.anim = 0;
    s.from = o.mesh.getWorldPosition(new THREE.Vector3()); s.fromRot = o.mesh.rotation.y;
    this.group.attach(o.mesh);
    const d = s.d;
    const [x0, z0, x1, z1] = d.axis === 'x' ? [d.a0, d.c - .25, d.a1, d.c + .25] : [d.c - .25, d.a0, d.c + .25, d.a1];
    s.box = this.world.add({ x0, y0: d.y - .45, z0, x1, y1: d.y, z1, surf: 'steel', socket: s });
    s.holo.visible = false;
    for (const dot of s.rivetDots) { dot.visible = true; dot.material.color.setHex(0xffe14a); }
  }
  drop(o, p, game) {
    const b = p.body, fx = Math.sin(p.yaw), fz = Math.cos(p.yaw);
    o.pos.set(b.x + fx * .9, b.y + .8, b.z + fz * .9);
    o.axis = Math.abs(fx) > Math.abs(fz) ? 'x' : 'z';
    this.group.attach(o.mesh); o.mesh.position.copy(o.pos); o.mesh.rotation.set(0, o.axis === 'z' ? Math.PI / 2 : 0, 0);
    o.state = 'falling'; o.vy = 0;
  }
  deliver(o, game, target = this.hopper) {
    o.state = 'delivering'; o.t = 0; o.target = target; o.from = o.mesh.getWorldPosition(new THREE.Vector3()); this.group.attach(o.mesh);
  }
  sendHome(o) {
    const h = o.home; o.pos.set(h.x, h.y, h.z); o.axis = h.axis;
    this.group.attach(o.mesh);
    o.mesh.position.copy(o.pos); o.mesh.rotation.set(0, h.axis === 'z' ? Math.PI / 2 : 0, 0); o.mesh.scale.setScalar(1);
    o.state = 'rest'; o.vy = 0; o.beacon.visible = true;
    // don't stack two girders in the same spot
    for (const q of this.carry) if (q !== o && q.state === 'rest' && q.pos.distanceTo(o.pos) < .2) { o.pos.y += .45; o.mesh.position.y = o.pos.y; }
  }
  unplace(s) {
    const o = s.girder; if (!o) return;
    if (s.box) this.world.remove(s.box); s.box = null;
    s.state = 'empty'; s.girder = null; s.rivets = 0; s.progress = 0; s.holo.visible = true;
    for (const dot of s.rivetDots) dot.visible = false;
    this.sendHome(o);
  }
  spawnTopBeam() {
    const sp = this.topBeamSpot; const o = this.addCarry('topbeam', { x: sp.x, y: sp.y, z: sp.z, axis: 'x' });
    const fin = this.sockets.find(s => s.final); if (fin) { fin.locked = false; fin.holo.visible = true; fin.beacon.visible = true; }
    o.mesh.position.y += 14; o.dropIn = 1;
    return o;
  }
  progress() {
    if (this.objective === 'girders') return this.sockets.filter(s => s.state === 'riveted').length;
    if (this.objective === 'collect') return this.pickups.filter(p => p.type === 'lunch' && p.taken).length;
    if (this.objective === 'crates' || this.objective === 'scrap') return this.delivered;
    if (this.objective === 'pumps' || this.objective === 'beacons') return this.stations.filter(s => s.on).length;
    return this.sockets.filter(s => s.state === 'riveted').length;
  }
  update(dt, game) {
    this.t += dt; const t = this.t, p = game.player;
    const carrying = p.carry, carryKind = carrying && carrying.kind;
    for (const o of this.carry) {
      if (o.state === 'falling') {
        o.vy -= GRAVITY * dt; const ny = o.pos.y + o.vy * dt;
        const g = this.world.groundBelow(o.pos.x, o.pos.z, o.pos.y + .05, .2);
        if (g && ny <= g.y1) { o.pos.y = g.y1; o.state = 'rest'; o.beacon.visible = true; game.audio.play(o.kind === 'crate' ? 'crate_drop' : 'place', { pos: o.pos, vol: .7 }); game.fx.dust(o.pos, 8); }
        else o.pos.y = ny;
        const wet = game.level.waterDepth && game.level.waterDepth(o.pos.x, o.pos.y, o.pos.z) > .3;
        if (wet) { game.fx.splash(o.pos, 16); game.audio.play('splash', { pos: o.pos, vol: .7 }); this.sendHome(o); }
        else if (o.pos.y < game.level.killY || (game.level.molten && game.level.molten.contains(o.pos))) { if (o.pos.y > game.level.killY) { game.fx.embers(o.pos, 20); game.audio.play('sizzle', { pos: o.pos }); } this.sendHome(o); }
        o.mesh.position.copy(o.pos);
      } else if (o.state === 'delivering') {
        o.t += dt; const h = o.target || this.hopper, f = clamp(o.t / .6, 0, 1), up = h.bin ? 1.4 : 2.2;
        o.mesh.position.set(lerp(o.from.x, h.x, f), lerp(o.from.y, h.y + up, f) + Math.sin(f * Math.PI) * 1.5 - (f > .8 ? (f - .8) * 6 : 0), lerp(o.from.z, h.z, f));
        o.mesh.rotation.x += dt * (h.bin ? 2 : 6);
        if (f >= 1) { o.state = 'gone'; o.mesh.visible = false; if (h.bin) { game.fx.dust(V.set(h.x, h.y + 1.4, h.z), 20); game.audio.play('scrap_drop', { pos: V, vol: 1 }); game.shake(.2, V); } else game.fx.embers(V.set(h.x, h.y + 1.4, h.z), 30); }
      } else if (o.state === 'rest' && o.dropIn) {
        o.dropIn = Math.max(0, o.dropIn - dt * .45);
        o.mesh.position.y = o.pos.y + 14 * o.dropIn * o.dropIn;
        if (!o.dropIn) { game.fx.dust(o.pos, 14); game.audio.play('place', { pos: o.pos }); }
      }
      const want = o.state === 'rest' && !carrying && (this.objective !== 'crates' || o.kind === 'crate');
      o.beacon.visible = want; if (want) o.beacon.material.opacity = .6 + .4 * Math.sin(t * 3);
    }
    for (const s of this.sockets) {
      if (s.state === 'placed' && s.anim < 1) {
        s.anim = Math.min(1, s.anim + dt * 2.4);
        const f = easeOutBack(s.anim), o = s.girder;
        o.mesh.position.set(lerp(s.from.x, s.center.x, f), lerp(s.from.y, s.d.y - .45, f) + Math.sin(s.anim * Math.PI) * .8, lerp(s.from.z, s.center.z, f));
        o.mesh.rotation.set(0, lerp(s.fromRot, s.d.axis === 'z' ? Math.PI / 2 : 0, Math.min(1, s.anim * 1.5)), 0);
        o.mesh.scale.set(1, 1, 1);
        if (s.anim >= 1) { game.audio.play('place', { pos: s.center, vol: 1 }); game.fx.dust(s.center, 16); game.shake(.18, s.center); }
      }
      if (s.state === 'placed' && s.anim >= 1) {
        const o = s.girder; o.mesh.position.set(s.center.x, s.d.y - .45 + Math.sin(t * 18) * .006 * (4 - s.rivets), s.center.z);
        s.rivetDots.forEach((dot, k) => { if (k >= s.rivets) dot.scale.setScalar(1 + .3 * Math.sin(t * 8 + k)); });
      }
      if (s.demo) { // old beam waiting to be unbolted: pulse its bolts and mark it
        s.holo.visible = false; s.beacon.visible = s.state === 'riveted' && !carrying;
        if (s.beacon.visible) { s.beacon.material.color.setHex(0xff8a30); s.beacon.material.opacity = .5 + .4 * Math.sin(t * 3); }
        if (s.state === 'riveted') s.rivetDots.forEach((dot, k) => { if (k < s.rivets) dot.scale.setScalar(1 + .25 * Math.sin(t * 6 + k)); });
        continue;
      }
      const show = s.state === 'empty' && !s.locked;
      s.holo.visible = show;
      const hot = show && (carryKind === 'girder' || carryKind === 'topbeam') && (carryKind === 'topbeam') === s.final;
      s.holo.children.forEach(m => m.material.opacity = hot ? .35 + .25 * Math.sin(t * 6) : .12);
      s.beacon.visible = hot || (s.state === 'placed');
      if (s.beacon.visible) { s.beacon.material.color.setHex(s.state === 'placed' ? 0xff4020 : s.final ? 0xffffff : 0xffc21a); s.beacon.material.opacity = .55 + .45 * Math.sin(t * 4); }
    }
    for (const o of this.pickups) {
      if (o.taken) continue;
      o.mesh.rotation.y = t * 1.6 + o.phase; o.mesh.position.y = o.pos.y + .35 + Math.sin(t * 2.4 + o.phase) * .1;
      o.halo.material.opacity = .45 + .3 * Math.sin(t * 3 + o.phase);
      const b = p.body;
      if (!p.dead && Math.abs(b.x - o.pos.x) < .8 && Math.abs(b.z - o.pos.z) < .8 && b.y > o.pos.y - 1 && b.y < o.pos.y + 1) {
        o.taken = true; this.group.remove(o.mesh, o.halo); if (o.beacon) this.group.remove(o.beacon);
        game.collect(o);
      }
    }
    for (const cp of this.checkpoints) {
      cp.flag.rotation.y = Math.sin(t * 3 + cp.pos.x) * .35;
      cp.ringMat.opacity = cp.active ? .25 : .35 + .2 * Math.sin(t * 4);
      const b = p.body;
      if (!cp.active && !p.dead && b.onGround && Math.abs(b.y - cp.pos.y) < .8 && Math.hypot(b.x - cp.pos.x, b.z - cp.pos.z) < 1.4) {
        this.activate(cp);
        game.reachCheckpoint(cp);
      }
    }
    if (this.hopper) {
      this.hopper.beacon.visible = carryKind === 'crate';
      this.hopper.beacon.material.opacity = .6 + .4 * Math.sin(t * 4);
    }
    if (this.bin) { this.bin.beacon.visible = carryKind === 'girder'; this.bin.beacon.material.opacity = .6 + .4 * Math.sin(t * 4); }
    for (const s of this.stations) {
      if (!s.on) { s.bea.visible = !carrying; s.bea.material.opacity = .5 + .4 * Math.sin(t * 3 + s.dev.x); if (s.lamp && s.kind === 'valve') s.lamp.material.emissiveIntensity = (t % 1) < .5 ? 3 : .6; continue; }
      if (s.kind === 'valve') {
        s.wheel.rotation.z += dt * .5;
        if (Math.random() < dt * 14) { const o = V.copy(s.outlet).applyAxisAngle(V2.set(0, 1, 0), s.yaw).add(s.dev); game.fx.splash(o, 2, .8); }
        game.audio.motor('conveyor_loop', s, s.dev, .22, .6);
      } else { const blink = (t + s.dev.x * .1) % 1.4 < .7; s.lamp.material.emissiveIntensity = blink ? 6 : .6; s.glow.material.opacity = blink ? .55 : .08; }
    }
  }
}
