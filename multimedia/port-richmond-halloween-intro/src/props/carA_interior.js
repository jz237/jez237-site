// Car A interior (CAR agent): what the crouched POV in the rear-left seat sees at night. Replaces the game's boxy
// seats + steering wheel; adds the centre console + stack, rear-view mirror with a swinging jack-o'-lantern charm,
// sun visors, door-card details (armrests, handles, window cranks, lock knobs, speakers, beltline felt), B-pillar
// trims, seat belts and grab handles. Built once in the car frame (glTF: +X forward, +Y up, +Z = right/street side).
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { box, rbox, cyl, sphere, merge, xform } from './geo.js';
import { canvasTexture } from './textures.js';
import { interiorize } from './interior.js';
import { rng, clamp } from './util.js';
import { carARock, CAR_A_ROCK } from './timings.js';

// ---------------------------------------------------------------------------------------------------- textures
function clothTexture(key, base, seed) {
  return canvasTexture(key, 256, 256, (g, w, h) => {
    const R = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const img = g.getImageData(0, 0, w, h), d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // tight twill weave + random flecks (a 2000s velour/tweed)
      const tw = ((x + y) % 6 < 3) ? 1.07 : 0.93;
      const fleck = R() < 0.035 ? 1.25 + R() * 0.25 : 1;
      const k = tw * fleck * (0.94 + 0.12 * R());
      d[i] = clamp(d[i] * k, 0, 255); d[i + 1] = clamp(d[i + 1] * k, 0, 255); d[i + 2] = clamp(d[i + 2] * k, 0, 255);
    }
    g.putImageData(img, 0, 0);
  }, { repeat: [1, 1] });
}
function grilleTexture() {
  return canvasTexture('carA_grille', 128, 128, (g, w, h) => {
    g.fillStyle = '#1a1a1a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#050505';
    for (let y = 4; y < h; y += 8) for (let x = 4 + ((y / 8) % 2) * 4; x < w; x += 8) { g.beginPath(); g.arc(x, y, 2.2, 0, Math.PI * 2); g.fill(); }
  });
}

// --------------------------------------------------------------------------------------------------- geometry
// A soft cushion: subdivided box -> rounded box (radius r) -> puffed front/back faces -> taper -> optional pleats
// (horizontal flutes on the front face) and dish. Local axes: x = width, y = height, z = front (+) / back (-).
function pad(w, h, d, { r = 0.03, front = 0.018, back = 0.008, taper = 0, pleats = 0, pleatAmp = 0.006, dish = 0, seg = [14, 20, 6], sideBulge = 0 } = {}) {
  const g0 = new THREE.BoxGeometry(w, h, d, seg[0], seg[1], seg[2]);
  g0.deleteAttribute('normal'); g0.deleteAttribute('uv');
  const g = mergeVertices(g0, 1e-6);
  const p = g.attributes.position;
  const hw = w / 2, hh = h / 2, hd = d / 2;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const ix = clamp(x, -(hw - r), hw - r), iy = clamp(y, -(hh - r), hh - r), iz = clamp(z, -(hd - r), hd - r);
    const dx = x - ix, dy = y - iy, dz = z - iz, dl = Math.hypot(dx, dy, dz);
    if (dl > 1e-7) { x = ix + (dx / dl) * r; y = iy + (dy / dl) * r; z = iz + (dz / dl) * r; }
    const u = x / hw, v = y / hh;
    const pf = Math.max(0, (1 - u * u * u * u) * (1 - v * v * v * v));
    if (z > 0) {
      z += front * pf;
      if (pleats > 0) {
        const inner = Math.max(0, 1 - Math.pow(Math.abs(u) / 0.62, 6)) * Math.max(0, 1 - Math.pow(Math.abs(v) / 0.86, 8));
        const s = Math.abs(Math.sin((Math.PI * (v + 1) * pleats) / 2));
        z += inner * pleatAmp * (Math.pow(s, 0.45) - 1);
      }
      if (dish) z -= dish * Math.max(0, 1 - u * u * 2.2) * Math.max(0, 1 - v * v);
    } else z -= back * pf;
    if (sideBulge) x += Math.sign(x) * sideBulge * Math.max(0, 1 - v * v) * Math.max(0, 1 - (z / hd) * (z / hd));
    x *= 1 - taper * (v * 0.5 + 0.5);
    p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  boxUV(g, 8);
  return g;
}
// box-projected UVs (metres * k) from the vertex normals
function boxUV(g, k = 1) {
  const p = g.attributes.position, n = g.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v;
    if (az >= ax && az >= ay) { u = p.getX(i); v = p.getY(i); } else if (ax >= ay) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getZ(i); }
    uv[i * 2] = u * k; uv[i * 2 + 1] = v * k;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}
// seat-local (x across, y up, z front) -> car frame, the seat facing forward (+X), rotated back by `recline` about
// the hinge, then placed at (px, py, pz)
function place(g, px, py, pz, recline = 0, yaw = 0) {
  xform(g, 0, 0, 0, -recline, 0, 0);            // tilt the top backward (-z local)
  xform(g, 0, 0, 0, 0, Math.PI / 2 + yaw, 0);   // local +z (front) -> car +X
  return xform(g, px, py, pz);
}
// flat strap along a polyline (seat belts): width w (across), thickness t
function strap(points, w, t, twistUp = new THREE.Vector3(0, 0, 1)) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const n = 24, pos = [], idx = [];
  const T = new THREE.Vector3(), S = new THREE.Vector3(), N = new THREE.Vector3();
  for (let i = 0; i <= n; i++) {
    const u = i / n, c = curve.getPointAt(u);
    curve.getTangentAt(u, T);
    S.copy(twistUp).cross(T).normalize();             // across the strap
    N.copy(T).cross(S).normalize();                   // strap normal
    for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      pos.push(c.x + S.x * a * w / 2 + N.x * b * t / 2, c.y + S.y * a * w / 2 + N.y * b * t / 2, c.z + S.z * a * w / 2 + N.z * b * t / 2);
    }
  }
  for (let i = 0; i < n; i++) for (let k = 0; k < 4; k++) {
    const a = i * 4 + k, b = i * 4 + ((k + 1) % 4), c = (i + 1) * 4 + k, d = (i + 1) * 4 + ((k + 1) % 4);
    idx.push(a, b, d, a, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  boxUV(g, 10);
  return g;
}

// ------------------------------------------------------------------------------------------------------ build
export function buildCarAInterior(ctx, { frame, nodes }) {
  const group = new THREE.Group();
  group.name = 'CarA_interior';
  const M = (key, make) => ctx.mat('carAInt_' + key, make);
  const cloth = clothTexture('carA_cloth', '#4a4640', 7);
  cloth.repeat.set(1, 1);
  const mats = {
    // velour sheen: the seat and headrest edges catch the street light from behind (pass 3)
    cloth: M('cloth', () => new THREE.MeshPhysicalMaterial({ name: 'CarASeatCloth', color: 0x8c877d, map: cloth, roughness: 0.9, bumpMap: cloth, bumpScale: 0.6, sheen: 0.7, sheenRoughness: 0.5, sheenColor: new THREE.Color(0.36, 0.35, 0.33) })),
    clothDark: M('clothDark', () => new THREE.MeshStandardMaterial({ name: 'CarASeatClothDark', color: 0x5d5952, map: cloth, roughness: 0.95 })),
    plastic: M('plastic', () => new THREE.MeshStandardMaterial({ name: 'CarATrimPlastic', color: 0x262626, roughness: 0.55 })),
    plasticGloss: M('plasticGloss', () => new THREE.MeshStandardMaterial({ name: 'CarATrimGloss', color: 0x101010, roughness: 0.28 })),
    vinyl: M('vinyl', () => new THREE.MeshStandardMaterial({ name: 'CarAVinyl', color: 0x34322f, roughness: 0.48 })),
    leather: M('leather', () => new THREE.MeshStandardMaterial({ name: 'CarAWheelLeather', color: 0x171615, roughness: 0.42 })),
    chrome: M('chrome', () => new THREE.MeshStandardMaterial({ name: 'CarAChrome', color: 0xb8b8b4, roughness: 0.22, metalness: 1 })),
    belt: M('belt', () => new THREE.MeshStandardMaterial({ name: 'CarABelt', color: 0x1d1d1f, roughness: 0.6 })),
    grille: M('grille', () => new THREE.MeshStandardMaterial({ name: 'CarASpeaker', color: 0x777777, map: grilleTexture(), roughness: 0.7 })),
    mirror: M('mirror', () => new THREE.MeshStandardMaterial({ name: 'CarAMirrorGlass', color: 0x9aa0a4, roughness: 0.05, metalness: 1 })),
    headliner: M('visor', () => new THREE.MeshStandardMaterial({ name: 'CarAVisor', color: 0x7a746a, roughness: 0.95 })),
    pumpkin: M('pumpkin', () => new THREE.MeshStandardMaterial({ name: 'CarACharm', vertexColors: true, roughness: 0.38 })),
    cord: M('cord', () => new THREE.MeshStandardMaterial({ name: 'CarACord', color: 0x111111, roughness: 0.7 })),
  };
  const parts = { cloth: [], clothDark: [], plastic: [], plasticGloss: [], vinyl: [], leather: [], chrome: [], belt: [], grille: [], mirror: [], headliner: [] };
  const add = (k, g) => parts[k].push(g);

  // ---------------------------------------------------------------- front seats (z = -0.37 driver, +0.37 passenger)
  const frontSeat = (zc) => {
    // seat back: hinge at (x -0.12, y 0.50), reclined 20 deg; the back (facing us) is a firmer, flatter panel
    const rec = 0.35;
    const back = pad(0.50, 0.56, 0.13, { r: 0.045, front: 0.02, back: 0.01, taper: 0.1, seg: [16, 20, 6], sideBulge: 0.012 });
    xform(back, 0, 0.28, 0);                         // hinge at the bottom
    add('cloth', place(back, -0.13, 0.49, zc, rec));
    // headrest on two posts
    const hr = pad(0.255, 0.165, 0.095, { r: 0.04, front: 0.012, back: 0.012, seg: [10, 8, 5] });
    const top = new THREE.Vector3(0, 0.56 + 0.28, 0);  // seat-back top centre in seat-local (before placement)
    xform(hr, 0, 0.56 + 0.125, -0.012);
    add('cloth', place(hr, -0.13, 0.49 - 0.28 + 0.28, zc, rec));
    for (const s of [-1, 1]) {
      const post = cyl(0.0055, 0.0055, 0.09, s * 0.075, 0.56 + 0.02, -0.01, 0, 0, 0, 10);
      add('chrome', place(post, -0.13, 0.49, zc, rec));
    }
    void top;
    // cushion + side trim + base
    const cush = pad(0.50, 0.13, 0.50, { r: 0.04, front: 0.0, back: 0.0, seg: [12, 6, 12] });
    xform(cush, 0, 0, 0, -0.12, 0, 0);
    add('cloth', place(cush, 0.06, 0.445, zc));
    add('plastic', place(box(0.035, 0.12, 0.46, zc > 0 ? -0.27 : 0.27, 0, 0), 0.06, 0.39, zc));
    add('plastic', box(0.42, 0.07, 0.40, 0.06, 0.34, zc));
  };
  frontSeat(-0.37);
  frontSeat(0.37);

  // ---------------------------------------------------------------- rear bench (beside / under us)
  {
    // cushion: two dished seats + a flatter middle; pleated inserts
    for (const zc of [-0.42, 0.42]) {
      const c = pad(0.62, 0.15, 0.52, { r: 0.05, front: 0.0, back: 0.0, seg: [14, 6, 14] });
      // dish the top face (y+): rotate the pad so its "front" is up, pleat + dish there
      add('cloth', place(xform(c, 0, 0, 0, -0.06, 0, 0), -0.87, 0.48, zc));
    }
    add('cloth', place(pad(0.26, 0.13, 0.5, { r: 0.04, front: 0, back: 0, seg: [8, 6, 12] }), -0.88, 0.475, 0));
    // back: one wide pad per side with fluted inserts, reclined 30 deg about its bottom
    for (const zc of [-0.43, 0.43]) {
      const b = pad(0.6, 0.52, 0.14, { r: 0.05, front: 0.022, back: 0.004, pleats: 7, pleatAmp: 0.007, seg: [16, 34, 5] });
      xform(b, 0, 0.26, 0);
      add('cloth', place(b, -1.08, 0.55, zc, 0.5));
      // outboard headrest (low, fixed)
      const hr = pad(0.22, 0.12, 0.085, { r: 0.035, front: 0.01, back: 0.01, seg: [8, 6, 5] });
      xform(hr, zc > 0 ? -0.05 : 0.05, 0.52 + 0.08, -0.01);
      add('cloth', place(hr, -1.08, 0.55, zc, 0.5));
    }
    const mid = pad(0.28, 0.5, 0.13, { r: 0.04, front: 0.015, back: 0.004, seg: [8, 16, 5] });
    xform(mid, 0, 0.25, 0);
    add('clothDark', place(mid, -1.09, 0.55, 0, 0.5));
    // parcel shelf behind
    add('plastic', box(0.36, 0.02, 1.5, -1.47, 1.05, 0, 0, 0, -0.08));
  }

  // ---------------------------------------------------------------- centre console + stack
  {
    add('plastic', rbox(0.92, 0.2, 0.22, 0.02, 0.06, 0.5, 0));                 // base, x -0.40..0.52
    const lid = pad(0.42, 0.075, 0.24, { r: 0.03, front: 0.0, back: 0, seg: [10, 4, 8] });
    add('vinyl', xform(lid, -0.19, 0.64, 0, 0, Math.PI / 2, 0));             // armrest lid between the seats
    add('plasticGloss', rbox(0.45, 0.025, 0.2, 0.008, 0.29, 0.605, 0));       // shifter bezel
    add('plastic', rbox(0.06, 0.028, 0.035, 0.01, 0.31, 0.62, 0.02));         // gate
    add('chrome', cyl(0.007, 0.009, 0.15, 0.30, 0.69, 0.02, 0, 0, 0.18, 10)); // shift lever
    add('leather', sphere(0.024, 0.285, 0.77, 0.02, 14, 10, 1, 1.15, 1));     // knob
    add('plasticGloss', cyl(0.035, 0.03, 0.03, 0.12, 0.6, -0.05, 0, 0, 0, 16)); // cup holders
    add('plasticGloss', cyl(0.035, 0.03, 0.03, 0.12, 0.6, 0.05, 0, 0, 0, 16));
    add('plastic', rbox(0.02, 0.12, 0.18, 0.006, -0.405, 0.5, 0));            // rear face of the console
    add('plasticGloss', rbox(0.01, 0.035, 0.12, 0.004, -0.415, 0.53, 0));     // rear vent slot
    // centre stack: face, vents, radio, HVAC knobs
    add('plastic', rbox(0.06, 0.34, 0.27, 0.015, 0.6, 0.71, 0, 0, 0, -0.18));
    for (const zc of [-0.07, 0.07]) {
      add('plasticGloss', rbox(0.02, 0.055, 0.105, 0.006, 0.585, 0.835, zc, 0, 0, -0.18));
      for (let i = 0; i < 4; i++) add('plastic', box(0.008, 0.004, 0.1, 0.572, 0.815 + i * 0.013, zc, 0, 0, -0.18));
    }
    add('plasticGloss', rbox(0.015, 0.055, 0.18, 0.005, 0.585, 0.745, 0, 0, 0, -0.18));
    for (const zc of [-0.07, 0, 0.07]) add('chrome', cyl(0.014, 0.014, 0.018, 0.567, 0.655, zc, 0, 0, Math.PI / 2 - 0.18, 14));
  }

  // ---------------------------------------------------------------- steering wheel (driver side, z -0.37)
  {
    const wc = new THREE.Vector3(0.43, 0.82, -0.37);
    const nrm = new THREE.Vector3(-0.906, 0.423, 0).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm);
    const m4 = new THREE.Matrix4().compose(wc, q, new THREE.Vector3(1, 1, 1));
    const rim = new THREE.TorusGeometry(0.188, 0.0165, 12, 56);
    add('leather', rim.applyMatrix4(m4));
    const hub = rbox(0.13, 0.1, 0.06, 0.025, 0, -0.01, -0.035);
    add('leather', hub.applyMatrix4(m4));
    for (const a of [Math.PI * 0.08, Math.PI * 0.92, -Math.PI / 2]) {
      const sp = box(0.12, 0.034, 0.014, 0, 0, 0, 0, 0, 0);
      xform(sp, Math.cos(a) * 0.115, Math.sin(a) * 0.115 - 0.01, -0.025, 0, 0, a);
      add('plastic', sp.applyMatrix4(m4));
    }
    const col = cyl(0.035, 0.045, 0.22, 0, 0, -0.14, Math.PI / 2, 0, 0, 14);
    add('plastic', col.applyMatrix4(m4));
  }

  // ---------------------------------------------------------------- headliner details: visors, mirror, handles
  for (const zc of [-0.38, 0.38]) {
    const v = pad(0.36, 0.16, 0.026, { r: 0.01, front: 0.004, back: 0.002, seg: [8, 5, 2] });
    xform(v, 0, 0, 0, Math.PI / 2 - 0.22, 0, 0);       // folded up against the roof, along the windshield top
    add('headliner', xform(v, 0.04, 1.375, zc, 0, Math.PI / 2, 0));
    add('chrome', cyl(0.004, 0.004, 0.05, 0.12, 1.38, zc + (zc > 0 ? -0.16 : 0.16), 0, 0, Math.PI / 2, 8));
  }
  // grab handles over the doors
  for (const [x, zs] of [[0.35, 1], [-0.62, 1], [-0.62, -1]]) {
    const hnd = new THREE.TorusGeometry(0.07, 0.009, 6, 16, Math.PI);
    xform(hnd, 0, 0, 0, Math.PI / 2 + zs * 0.35, 0, 0);
    add('plastic', xform(hnd, x, 1.33, zs * 0.72));
  }
  // rear-view mirror: base on the glass, stalk, housing, glass facing back
  const mirrorC = new THREE.Vector3(0.2, 1.285, 0.0);
  add('plastic', rbox(0.05, 0.03, 0.06, 0.01, 0.27, 1.37, 0, 0, 0, 0.98));
  add('plastic', cyl(0.007, 0.007, 0.08, 0.235, 1.33, 0, 0, 0, 0.75, 8));
  add('plastic', rbox(0.045, 0.07, 0.25, 0.022, mirrorC.x, mirrorC.y, mirrorC.z, 0, -0.05, 0.12));
  add('mirror', rbox(0.004, 0.056, 0.232, 0.002, mirrorC.x - 0.024, mirrorC.y, mirrorC.z, 0, -0.05, 0.12));

  // ---------------------------------------------------------------- door cards (left side static, RR swings)
  // inner trim surface ~z -0.68 (left) / +0.68 (right); front door x -0.18..0.95, rear door x -1.10..-0.19
  const doorDetails = (side, rear) => {
    const z = side * 0.672;
    const zIn = side * 0.62;
    const g = { plastic: [], vinyl: [], chrome: [], grille: [], cloth: [] };
    const x0 = rear ? -1.0 : -0.08, x1 = rear ? -0.3 : 0.62;
    g.vinyl.push(rbox(x1 - x0, 0.055, 0.075, 0.02, (x0 + x1) / 2, 0.655, (z + zIn) / 2 + side * 0.0));        // armrest
    g.cloth.push(rbox(x1 - x0 + 0.05, 0.2, 0.012, 0.005, (x0 + x1) / 2, 0.78, z - side * 0.004));              // cloth insert
    g.plastic.push(rbox(x1 - x0 + 0.12, 0.022, 0.03, 0.008, (x0 + x1) / 2, 0.905, z - side * 0.012));         // beltline cap
    g.plastic.push(box(x1 - x0 + 0.1, 0.008, 0.012, (x0 + x1) / 2, 0.92, z - side * 0.03));                   // felt strip
    const hx = rear ? -0.33 : 0.72;                                                                             // door handle
    g.plastic.push(rbox(0.13, 0.05, 0.014, 0.006, hx, 0.85, z - side * 0.002));
    g.chrome.push(rbox(0.1, 0.018, 0.012, 0.005, hx + 0.005, 0.85, z - side * 0.01));
    g.plastic.push(rbox(0.09, 0.028, 0.03, 0.01, (x0 + x1) / 2 + 0.12, 0.7, zIn + side * 0.01));              // pull cup
    if (rear) { // window crank
      const cx = -0.62;
      g.chrome.push(cyl(0.017, 0.017, 0.012, cx, 0.77, z - side * 0.006, Math.PI / 2, 0, 0, 14));
      g.chrome.push(box(0.085, 0.012, 0.008, cx + 0.04, 0.765, z - side * 0.016, 0, 0, -0.2));
      g.plastic.push(cyl(0.011, 0.011, 0.035, cx + 0.078, 0.757, z - side * 0.032, Math.PI / 2, 0, 0, 10));
    } else {    // power window / lock switch pod on the armrest
      g.plastic.push(rbox(0.12, 0.02, 0.05, 0.008, 0.4, 0.69, zIn + side * 0.015));
    }
    g.chrome.push(cyl(0.0055, 0.0065, 0.036, rear ? -0.98 : 0.6, 0.93, z - side * 0.03, 0, 0, 0, 10));      // lock knob
    g.grille.push(cyl(0.068, 0.068, 0.01, rear ? -0.82 : 0.55, 0.43, z - side * 0.002, Math.PI / 2, 0, 0, 24)); // speaker
    g.plastic.push(rbox(0.5, 0.08, 0.04, 0.012, (x0 + x1) / 2 - 0.05, 0.5, z - side * 0.014));                // map pocket lip
    return g;
  };
  for (const [side, rear] of [[-1, true], [-1, false], [1, false]]) {
    const g = doorDetails(side, rear);
    for (const [k, list] of Object.entries(g)) parts[k].push(...list);
  }
  // the street-side rear door card rides on the door (CarDoorRR node: origin = hinge at (-0.192, 0.83, 0.9014))
  const rrGroup = new THREE.Group();
  rrGroup.name = 'CarA_RRcard';
  if (nodes && nodes.CarDoorRR) {
    const g = doorDetails(1, true);
    const off = nodes.CarDoorRR.position.clone().negate();
    for (const [k, list] of Object.entries(g)) {
      if (!list.length) continue;
      const geo = merge(list); geo.translate(off.x, off.y, off.z);
      const mesh = new THREE.Mesh(geo, mats[k]); mesh.castShadow = true; mesh.receiveShadow = true; rrGroup.add(mesh);
    }
    nodes.CarDoorRR.add(rrGroup);
  }

  // ---------------------------------------------------------------- B-pillar trims + seat belts
  for (const s of [-1, 1]) {
    const tr = pad(0.085, 0.5, 0.03, { r: 0.012, front: 0.004, back: 0, taper: 0.25, seg: [5, 10, 2] });
    add('plastic', xform(tr, -0.17, 1.15, s * 0.775, 0, s > 0 ? Math.PI : 0, 0.04));
    // front belt: D-ring on the pillar, webbing down to the retractor / floor anchor
    add('belt', strap([new THREE.Vector3(-0.165, 1.24, s * 0.752), new THREE.Vector3(-0.17, 1.0, s * 0.762), new THREE.Vector3(-0.16, 0.7, s * 0.765), new THREE.Vector3(-0.13, 0.42, s * 0.75)], 0.046, 0.003, new THREE.Vector3(0, 0, 1)));
    add('chrome', rbox(0.05, 0.025, 0.012, 0.005, -0.165, 1.255, s * 0.752));
    // rear belt from the C-pillar down beside the seat
    add('belt', strap([new THREE.Vector3(-1.2, 1.15, s * 0.715), new THREE.Vector3(-1.12, 0.95, s * 0.725), new THREE.Vector3(-1.06, 0.72, s * 0.73), new THREE.Vector3(-1.02, 0.56, s * 0.71)], 0.046, 0.003, new THREE.Vector3(0, 0, 1)));
    add('chrome', rbox(0.045, 0.025, 0.012, 0.005, -1.21, 1.16, s * 0.712));
    add('plastic', rbox(0.06, 0.03, 0.03, 0.01, -0.99, 0.57, s * 0.6));        // rear buckle stalk
  }

  // ---------------------------------------------------------------- merge per material
  for (const [k, list] of Object.entries(parts)) {
    if (!list.length) continue;
    const mesh = new THREE.Mesh(merge(list), mats[k]);
    mesh.name = 'carA_int_' + k;
    mesh.castShadow = k !== 'mirror'; mesh.receiveShadow = true;
    group.add(mesh);
  }

  // ---------------------------------------------------------------- the charm: a small plastic jack-o'-lantern
  const charm = new THREE.Group();
  charm.name = 'CarA_charm';
  const mount = new THREE.Vector3(0.235, 1.305, 0.012);
  charm.position.copy(mount);
  const L = 0.115;
  {
    const cord = cyl(0.0007, 0.0007, L, 0, -L / 2, 0, 0, 0, 0, 5);
    const cm = new THREE.Mesh(cord, mats.cord); cm.castShadow = false; charm.add(cm);
    const pg = new THREE.SphereGeometry(0.017, 28, 20);
    const pp = pg.attributes.position;
    const col = new Float32Array(pp.count * 3);
    for (let i = 0; i < pp.count; i++) {
      let x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i);
      const th = Math.atan2(z, x);
      const rib = 1 - 0.085 * Math.pow(Math.abs(Math.sin(th * 4)), 0.6);
      x *= rib; z *= rib; y *= 0.84;
      pp.setXYZ(i, x, y, z);
      // carved face on the side facing the rear seat (-X): triangle eyes, jagged mouth
      const fx = -x / 0.017, fy = y / 0.0143, fz = z / 0.017;
      let face = false;
      if (fx > 0.55) {
        const ex = Math.abs(fz) - 0.36, ey = fy - 0.2;
        if (ex > -0.17 && ex < 0.17 && ey > -0.12 && ey < 0.22 - Math.abs(ex) * 1.4) face = true;
        if (fy < -0.05 && fy > -0.38 + 0.12 * Math.abs(Math.sin(fz * 14)) && Math.abs(fz) < 0.55) face = true;
      }
      const c = face ? [0.02, 0.012, 0.004] : [0.85, 0.3, 0.03];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    pg.computeVertexNormals();
    const pm = new THREE.Mesh(pg, mats.pumpkin);
    pm.position.set(0, -L - 0.012, 0);
    pm.castShadow = true;
    charm.add(pm);
    const stem = new THREE.Mesh(cyl(0.003, 0.004, 0.012, 0, -L + 0.002, 0, 0, 0, 0.2, 6), new THREE.MeshStandardMaterial({ name: 'CarACharmStem', color: 0x2a3a12, roughness: 0.7 }));
    charm.add(stem);
  }
  group.add(charm);

  // interior lighting: the roof blocks most of the sky fill; practicals (street spill through the glass) carry it
  interiorize(group, 0.32, { skip: (o) => o === charm || charm.children.includes(o) });
  interiorize(rrGroup, 0.32);
  // the game's own interior surfaces (headliner, dash, carpet, door cards)
  frame.traverse((o) => {
    if (!o.isMesh || !o.userData.gameMat) return;
    if (['M_Car_Headliner', 'M_Car_Dash', 'M_Car_Carpet'].includes(o.userData.gameMat)) interiorize(o, 0.32);
  });

  frame.add(group);

  // charm swing: a 0.13 m pendulum (~1.4 Hz). Sways a little all the time (the wind rocks the car), kicked by every
  // car-rock impulse (the smash) - pure function of t.
  const f0 = Math.sqrt(9.81 / (L + 0.015)) / (2 * Math.PI);
  function charmAngleAt(t, events = CAR_A_ROCK.events) {
    let a = 0.025 * Math.sin(t * 2 * Math.PI * f0 * 0.98 + 0.4) * (0.6 + 0.4 * Math.sin(t * 0.37));
    let b = 0.012 * Math.sin(t * 2 * Math.PI * f0 * 1.02 + 1.9);
    for (const e of events) {
      const x = t - e.t;
      if (x <= 0 || x > 8) continue;
      const k = Math.exp(-x * 0.55) * Math.sin(2 * Math.PI * f0 * x);
      a += -(e.roll || 0) * 22 * k;
      b += (e.pitch || 0) * 18 * k + (e.heave || 0) * 6 * k;
    }
    return { roll: clamp(a, -0.7, 0.7), pitch: clamp(b, -0.5, 0.5) };
  }
  // anchors in the car frame
  const anchors = {
    rearSeatTop: { a: [-1.33, 1.03, -0.7], b: [-1.33, 1.035, -0.3], mid: [-1.33, 1.035, -0.5] },
    driverSeatTop: { a: [-0.33, 1.06, -0.58], b: [-0.33, 1.06, -0.16], mid: [-0.33, 1.06, -0.37] },
    driverHeadrest: [-0.4, 1.16, -0.37],
    mirror: [mirrorC.x, mirrorC.y, mirrorC.z],
  };
  return {
    group,
    animated: charm,
    anchors,
    charmAngleAt: (t) => charmAngleAt(t).roll,
    update(t) {
      const c = charmAngleAt(t);
      charm.rotation.set(c.roll, 0, c.pitch);
    },
  };
}
// keep the import list honest for the rock-driven charm (carARock is the full response if needed later)
void carARock;
