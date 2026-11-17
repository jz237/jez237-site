// Procedural characters and props: Randy, the lunker bass, the fish choir, crown, boat.
import * as THREE from 'three';

export const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0, ...o });
export const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
export const cyl = (rt, rb, h, m, seg = 8) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
export const sph = (r, m, d = 1) => {
  const g = new THREE.IcosahedronGeometry(r, d);
  if (!m.flatShading) { const p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); n.setXYZ(i, v.x, v.y, v.z); } }
  return new THREE.Mesh(g, m);
};
const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const grp = (parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); parent && parent.add(g); return g; };

// ---------------------------------------------------------------- Randy
export function makeRandy() {
  const sweater = mat(0x23262e), shirt = mat(0x9fc4ec), skin = mat(0xe2a688, { flatShading: false }), hairM = mat(0x6a5646),
    stache = mat(0x6b5341, { flatShading: false }), khaki = mat(0x8c7b5c), shoe = mat(0x2a1f1a), white = mat(0xffffff), dark = mat(0x1a1210);
  const g = new THREE.Group();
  const hips = grp(g, 0, 0.92, 0);
  const mkLeg = x => { const l = grp(hips, x, 0, 0); l.add(at(box(0.19, 0.9, 0.22, khaki), 0, -0.45, 0)); l.add(at(box(0.2, 0.1, 0.34, shoe), 0, -0.87, 0.06)); return l; };
  const legL = mkLeg(0.13), legR = mkLeg(-0.13);
  const torso = grp(hips);
  const body = cyl(0.33, 0.3, 0.66, sweater, 8); body.scale.z = 0.72; torso.add(at(body, 0, 0.33, 0));
  torso.add(at(box(0.5, 0.1, 0.3, khaki), 0, 0.0, 0)); // belt line
  // V-neck: blue shirt triangle and collar wings
  const v = new THREE.Shape(); v.moveTo(-0.11, 0); v.lineTo(0.11, 0); v.lineTo(0, -0.24); v.closePath();
  const vm = new THREE.Mesh(new THREE.ShapeGeometry(v), shirt); torso.add(at(vm, 0, 0.665, 0.232)); vm.rotation.x = -0.12;
  const c1 = box(0.17, 0.07, 0.04, shirt), c2 = box(0.17, 0.07, 0.04, shirt);
  torso.add(at(c1, 0.075, 0.64, 0.2), at(c2, -0.075, 0.64, 0.2)); c1.rotation.z = -0.7; c2.rotation.z = 0.7;
  torso.add(at(cyl(0.085, 0.1, 0.12, skin), 0, 0.7, 0));
  // head
  const head = grp(torso, 0, 0.76, 0);
  const skull = sph(0.21, skin, 2); skull.scale.set(1.05, 1.1, 1.02); head.add(at(skull, 0, 0.17, 0));
  const jowl = sph(0.185, skin, 2); jowl.scale.set(1.12, 0.78, 0.98); head.add(at(jowl, 0, 0.065, 0.015));   // fuller jaw and cheeks
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.222, 9, 6, 0, Math.PI * 2, 0, Math.PI * 0.46), hairM);
  hair.scale.set(1.0, 1.05, 1.04); hair.rotation.x = -0.42; head.add(at(hair, 0, 0.19, -0.012));
  for (const s of [1, -1]) {
    head.add(at(sph(0.05, skin, 0), s * 0.21, 0.16, 0));                       // ears
    const eye = sph(0.027, dark, 1); eye.scale.set(1.25, 0.5, 1); head.add(at(eye, s * 0.08, 0.212, 0.19));   // smiling, squinted eyes
    const lid = box(0.075, 0.014, 0.02, mat(0xc68868)); lid.rotation.z = -s * 0.3; head.add(at(lid, s * 0.084, 0.231, 0.193));
    const crow = box(0.03, 0.008, 0.02, mat(0xc68868)); crow.rotation.z = s * 0.5; head.add(at(crow, s * 0.135, 0.205, 0.165));
    head.add(at(box(0.03, 0.1, 0.13, mat(0xa39c93)), s * 0.203, 0.25, -0.02));     // grey temples
    const br = box(0.085, 0.02, 0.025, stache); head.add(at(br, s * 0.082, 0.262, 0.19)); br.rotation.z = -s * 0.16;
    const ch = sph(0.05, mat(0xe88f78, { flatShading: false }), 1); ch.scale.z = 0.5; head.add(at(ch, s * 0.115, 0.125, 0.165)); // rosy cheeks
    const m = sph(0.072, stache, 1); m.scale.set(1.4, 0.62, 0.72); head.add(at(m, s * 0.062, 0.1, 0.2)); m.rotation.z = -s * 0.3; // full mustache
  }
  const nose = sph(0.05, mat(0xd99578, { flatShading: false }), 1); nose.scale.set(1.05, 1.15, 1.2); head.add(at(nose, 0, 0.15, 0.215));
  const teeth = box(0.13, 0.034, 0.02, white); head.add(at(teeth, 0, 0.045, 0.192));
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 4, 10, Math.PI), mat(0x7a2a22));
  smile.rotation.z = Math.PI; head.add(at(smile, 0, 0.068, 0.19));
  // arms (Randy faces +z, his right hand is at -x)
  const mkArm = s => {
    const a = grp(torso, s * 0.34, 0.6, 0); a.add(at(box(0.13, 0.36, 0.14, sweater), 0, -0.17, 0));
    const e = grp(a, 0, -0.34, 0); e.add(at(box(0.115, 0.3, 0.12, sweater), 0, -0.14, 0));
    e.add(at(box(0.125, 0.04, 0.13, shirt), 0, -0.29, 0)); e.add(at(sph(0.065, skin, 1), 0, -0.35, 0));
    const hand = grp(e, 0, -0.35, 0); return { a, e, hand };
  };
  const L = mkArm(1), R = mkArm(-1);
  // rod: chained segments so it can bend
  const rod = grp(R.hand); rod.rotation.x = 2.2;
  rod.add(at(cyl(0.022, 0.026, 0.4, mat(0x3a2a1c)), 0, -0.05, 0));
  const reel = grp(rod, 0.05, 0.22, 0); const rc = cyl(0.06, 0.06, 0.05, mat(0xb9bcc4, { metalness: 0.6, roughness: 0.3 }), 10); rc.rotation.z = Math.PI / 2; reel.add(rc);
  const handle = grp(reel, 0.04, 0, 0); handle.add(at(box(0.02, 0.12, 0.02, dark), 0, 0, 0), at(sph(0.022, dark, 0), 0.01, 0.06, 0));
  const segs = []; let parent = rod; const rodM = mat(0xc9a227, { emissive: 0x332200 });
  for (let i = 0; i < 7; i++) {
    const s = grp(parent, 0, i === 0 ? 0.15 : 0.36, 0); const r0 = 0.016 - i * 0.0018;
    s.add(at(cyl(r0 - 0.0018, r0, 0.36, rodM, 5), 0, 0.18, 0)); segs.push(s); parent = s;
  }
  const tip = grp(parent, 0, 0.36, 0);
  // crown
  const crown = grp(head, 0, 0.385, -0.01); const gold = mat(0xffc531, { metalness: 0.7, roughness: 0.25, emissive: 0x7a4a00 });
  crown.add(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.1, 10, 1, true), gold));
  crown.children[0].material.side = THREE.DoubleSide;
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 4), gold);
    crown.add(at(sp, Math.sin(a) * 0.16, 0.11, Math.cos(a) * 0.16));
    crown.add(at(sph(0.022, mat(i % 2 ? 0xff2255 : 0x29c5ff, { emissive: i % 2 ? 0x880022 : 0x004488 }), 0), Math.sin(a) * 0.165, 0.0, Math.cos(a) * 0.165));
  }
  crown.visible = false;
  return { g, hips, torso, head, legL, legR, armL: L.a, elbowL: L.e, handL: L.hand, armR: R.a, elbowR: R.e, handR: R.hand, rod, reel, handle, segs, tip, crown, teeth };
}

// arm = [forward(-)/back(+) swing, outward splay, elbow bend(-)]
export function poseRandy(R, p = {}) {
  const { walk = null, aL = [0.08, 0.1, -0.2], aR = [0.08, 0.1, -0.2], lean = 0, twist = 0, head = [0, 0], bob = 0, bend = 0, laugh = 0, rod = true } = p;
  R.hips.position.y = 0.92 + bob;
  R.torso.rotation.set(lean, twist, 0);
  R.armL.rotation.set(aL[0], 0, aL[1]); R.elbowL.rotation.x = aL[2];
  R.armR.rotation.set(aR[0], 0, -aR[1]); R.elbowR.rotation.x = aR[2];
  const w = walk === null ? 0 : Math.sin(walk) * 0.55;
  R.legL.rotation.x = w; R.legR.rotation.x = -w;
  R.head.rotation.set(head[0], head[1], 0);
  R.rod.visible = rod;
  for (const s of R.segs) s.rotation.x = bend / R.segs.length;
  R.teeth.scale.y = 1 + laugh * 2.2; R.teeth.position.y = 0.045 - laugh * 0.03;
}

// ---------------------------------------------------------------- Bass
export function makeBass() {
  const g = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(1, 3); const pos = geo.attributes.position; const col = [];
  const cBack = new THREE.Color(0x3d6b2e), cBelly = new THREE.Color(0xe9e4bf), cStripe = new THREE.Color(0x16301a), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const taper = z < 0 ? 0.28 + 0.72 * Math.pow(1 + z, 0.7) : 1 - 0.25 * z * z;
    const yy = y; x *= 0.4 * taper; y *= 0.56 * taper; if (y > 0) y *= 1.1; z *= 1.5;
    pos.setXYZ(i, x, y, z);
    const k = THREE.MathUtils.smoothstep(yy, -0.35, 0.25); c.copy(cBelly).lerp(cBack, k);
    const stripe = Math.exp(-Math.pow((yy - 0.02) / 0.1, 2)) * (0.6 + 0.4 * Math.sin(z * 9)); c.lerp(cStripe, stripe * 0.8);
    col.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals();
  const skinM = mat(0xffffff, { vertexColors: true, roughness: 0.5, metalness: 0.15 });
  g.add(new THREE.Mesh(geo, skinM));
  const finM = mat(0x2c5226, { side: THREE.DoubleSide, roughness: 0.6 });
  const shape = pts => { const s = new THREE.Shape(); pts.forEach((p, i) => i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])); s.closePath(); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), finM); m.rotation.y = -Math.PI / 2; return m; };
  // (shape x maps to world z, y to y)
  const tail = grp(g, 0, 0, -1.4); tail.add(shape([[0, 0.08], [-0.75, 0.6], [-0.55, 0], [-0.75, -0.6], [0, -0.08]]));
  const dorsal = shape([[0.7, 0.5], [0.5, 0.95], [0.3, 0.7], [0.1, 1.0], [-0.15, 0.72], [-0.35, 0.9], [-0.7, 0.45]]); g.add(dorsal);
  g.add(at(shape([[0, 0], [-0.5, -0.35], [-0.45, 0.05]]), 0, -0.45, -0.3));
  for (const s of [1, -1]) { const f = shape([[0, 0], [-0.55, 0.2], [-0.5, -0.25]]); f.rotation.y = -Math.PI / 2 + s * 0.9; g.add(at(f, s * 0.38, -0.15, 0.5)); }
  // mouth
  const jaw = grp(g, 0, -0.18, 0.95); const jm = sph(0.3, mat(0xd9d4ad), 1); jm.scale.set(1.0, 0.35, 1.5); jaw.add(at(jm, 0, -0.03, 0.25));
  const throat = sph(0.26, mat(0x7a1522, { emissive: 0x2a0308 }), 1); throat.scale.set(1, 0.8, 1); g.add(at(throat, 0, -0.08, 1.1));
  const eyeM = mat(0xffd21a, { emissive: 0xffa800, emissiveIntensity: 0.4, roughness: 0.2 }); const eyes = [];
  for (const s of [1, -1]) { const e = sph(0.11, eyeM, 1); g.add(at(e, s * 0.3, 0.2, 0.95)); const p = sph(0.06, mat(0x050505), 1); p.scale.set(0.5, 1.3, 1); e.add(at(p, s * 0.075, 0, 0.03)); eyes.push(e); }
  return { g, tail, jaw, eyeM, eyes };
}
export function swim(B, t, speed = 6, open = 0.15) { B.tail.rotation.y = Math.sin(t * speed) * 0.55; B.jaw.rotation.x = open; }

// ---------------------------------------------------------------- Choir fish (upright, robed)
export function makeChoir(n = 9) {
  const g = new THREE.Group(); const fish = [];
  for (let i = 0; i < n; i++) {
    const f = new THREE.Group(); const B = makeBass(); B.g.scale.setScalar(0.5); B.g.rotation.order = 'YXZ'; B.g.rotation.x = -Math.PI / 2 + 0.3; B.g.rotation.y = Math.PI + (i % 2 ? 0.75 : -0.75); B.g.position.y = 1.15; f.add(B.g);
    const robe = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.5, 7), mat(i % 2 ? 0x6b1f8a : 0x8a1f3a)); robe.position.y = 0.6; f.add(robe);
    const collar = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.3, 7), mat(0xf4f0e0)); collar.position.y = 1.22; f.add(collar);
    const row = i % 2, k = (i - (n - 1) / 2);
    f.position.set(k * 0.95, row * 0.45, -row * 0.9 - Math.abs(k) * 0.12); f.rotation.y = -k * 0.07;
    g.add(f); fish.push({ f, B, ph: i * 1.7 });
  }
  return { g, fish };
}
export function sing(C, t, level) {
  for (const c of C.fish) {
    c.B.jaw.rotation.x = 0.1 + level * (0.55 + 0.25 * Math.sin(t * 9 + c.ph));
    c.f.rotation.z = Math.sin(t * 2.85 + c.ph) * 0.06; c.B.tail.rotation.y = Math.sin(t * 5 + c.ph) * 0.4;
  }
}

// ---------------------------------------------------------------- Boat
export function makeBoat() {
  const g = new THREE.Group(); const s = new THREE.Shape();
  s.moveTo(-0.9, -2.2); s.lineTo(0.9, -2.2); s.lineTo(1.05, 0.6); s.quadraticCurveTo(0.7, 2.2, 0, 2.9); s.quadraticCurveTo(-0.7, 2.2, -1.05, 0.6); s.closePath();
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.6, bevelEnabled: false }), mat(0xb5442e));
  hull.rotation.x = Math.PI / 2; hull.position.y = 0.45; g.add(hull);
  const deck = new THREE.Mesh(new THREE.ShapeGeometry(s), mat(0xd8c9a0)); deck.rotation.x = -Math.PI / 2; deck.scale.set(0.9, -0.92, 1); deck.position.y = 0.47; g.add(deck);
  g.add(at(box(1.7, 0.12, 0.4, mat(0x7a5a3a)), 0, 0.6, -0.9)); g.add(at(box(0.5, 0.5, 0.4, mat(0x222831)), 0, 0.5, -2.3));
  return g;
}

// one-geometry fish for instancing (sky fish)
export function simpleFishGeo() {
  const N = [0, 0, 1], T = [0, 0, -0.8], U = [0, 0.36, 0.15], D = [0, -0.3, 0.15], Lf = [-0.16, 0, 0.15], Rt = [0.16, 0, 0.15];
  const tris = [N, U, Rt, N, Rt, D, N, D, Lf, N, Lf, U, T, Rt, U, T, D, Rt, T, Lf, D, T, U, Lf, [0, 0, -0.7], [0, 0.4, -1.35], [0, -0.4, -1.35]];
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3)); g.computeVertexNormals(); return g;
}
