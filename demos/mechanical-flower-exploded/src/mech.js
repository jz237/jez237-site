import * as THREE from 'three';
import { gearGeometry, gearShape, addWheelHoles } from './gears.js';
import { Batch, addJewel, frameMatrix, tubeAlong, TAU } from './geo.js';
import { GEM_COLORS, rng } from './materials.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const GEM_LIST = [GEM_COLORS.ruby, GEM_COLORS.sapphire, GEM_COLORS.emerald, GEM_COLORS.rose, GEM_COLORS.aqua, GEM_COLORS.amethyst, GEM_COLORS.amber];
const Y_UP = V(0, 1, 0);
const GEAR_METALS = ['brass', 'copper', 'anoTeal', 'roseGold', 'anoViolet', 'brass', 'anoBlue', 'anoMagenta'];

function addMesh(group, batch, mat, name) {
  const m = batch.build(mat);
  if (m) {
    m.name = name;
    group.add(m);
  }
  return m;
}

// Faceted bulb gem (flat-shaded, like the cut stones in the close-up photo) with a glint that rides on it.
const FACET = (() => {
  const g = new THREE.SphereGeometry(1, 8, 5);
  g.deleteAttribute('normal');
  return g.toNonIndexed();
})();
const bulbTint = (c) => [0.6 + c.r * 0.6, 0.6 + c.g * 0.6, 0.6 + c.b * 0.6].map((v) => Math.min(1.6, v * 1.2));
function addBulb(gems, matrix, radius, color, { glint = 2.8, hot = 1.3 } = {}) {
  gems.add(FACET, matrix.clone().multiply(new THREE.Matrix4().makeScale(radius, radius, radius * 0.92)), color);
  const e = matrix.elements;
  const k = radius * 0.4;
  gems.glints.push({ pos: [e[12] + e[8] * k, e[13] + e[9] * k, e[14] + e[10] * k], color: bulbTint(color), size: radius * glint + 0.06, hot });
}

let haloTex = null;
function coreHalo(R) {
  if (!haloTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,226,160,1)');
    gr.addColorStop(0.18, 'rgba(255,190,100,0.62)');
    gr.addColorStop(0.45, 'rgba(255,140,110,0.2)');
    gr.addColorStop(0.75, 'rgba(190,120,255,0.06)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
    haloTex = new THREE.CanvasTexture(c);
    haloTex.colorSpace = THREE.SRGBColorSpace;
  }
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 }));
  sp.scale.setScalar(R * 4.2);
  sp.name = 'coreHalo';
  return sp;
}

// Spur gear on a jeweled bushing. axis 'y' lays the wheel flat (horizontal plane); 'z' faces the camera.
export function gearPart(mats, { teeth = 24, R = 1, thickness = 0.16, spokes = 5, curved = 0, mat = null, axis = 'y', gem = true, gemColor = null, seed = 1, ringDeco = true } = {}) {
  const r = rng(seed * 17 + 3);
  const module = R / (teeth / 2 + 0.95);
  const geo = gearGeometry({ teeth, module, thickness, spokes, curved, bevel: true });
  const holder = new THREE.Group();
  const spin = new THREE.Group();
  holder.add(spin);
  const body = new THREE.Mesh(geo, mats[mat || GEAR_METALS[Math.abs(Math.round(seed)) % GEAR_METALS.length]]);
  spin.add(body);

  const golds = new Batch(false);
  const gems = new Batch(true);
  const pr = (teeth * module) / 2;
  const hubR = Math.max(pr * 0.2, 0.15);
  const bush = new THREE.CylinderGeometry(hubR * 0.78, hubR * 0.78, thickness * 1.9, 14);
  bush.rotateX(Math.PI / 2);
  golds.add(bush);
  const hubRing = new THREE.TorusGeometry(hubR, hubR * 0.14, 6, 18);
  for (const s of [-1, 1]) golds.add(hubRing, new THREE.Matrix4().makeTranslation(0, 0, s * thickness * 0.55));
  if (ringDeco && teeth >= 18) {
    const rr = pr * 0.62;
    const deco = new THREE.TorusGeometry(rr, 0.018 + R * 0.01, 5, 40);
    for (const s of [-1, 1]) golds.add(deco, new THREE.Matrix4().makeTranslation(0, 0, s * thickness * 0.5));
  }
  if (gem) {
    const col = gemColor || GEM_LIST[Math.floor(r() * GEM_LIST.length)];
    for (const s of [-1, 1]) {
      const m = new THREE.Matrix4().makeTranslation(0, 0, s * (thickness * 0.95 + 0.01));
      if (s < 0) m.multiply(new THREE.Matrix4().makeRotationX(Math.PI));
      addJewel(gems, golds, m, hubR * 0.62, col, { prongs: hubR > 0.2 ? 6 : 0 });
    }
  }
  for (let k = 0; k < 3; k++) {
    const a = r() * TAU;
    const rad = pr + module * 1.05;
    gems.glints.push({ pos: [Math.cos(a) * rad, Math.sin(a) * rad, thickness * 0.55], color: [1.0, 0.82, 0.5], size: 0.1 + R * 0.09, hot: 1.0, rate: 2.0 + r() * 3.4 });
  }
  addMesh(spin, golds, mats.gold, 'gearGold');
  addMesh(spin, gems, mats.gem, 'gearGems');
  if (axis === 'y') holder.rotation.x = -Math.PI / 2;
  const outer = new THREE.Group();
  outer.add(holder);
  outer.userData = { spin, R, thickness, teeth };
  return outer;
}

// Toothed filigree drive ring with jeweled studs and cam arms. Horizontal, axis Y.
export function buildFiligreeRing(mats, { R = 4.95, teeth = 66, thickness = 0.2, seed = 3 } = {}) {
  const r = rng(seed * 31 + 5);
  const module = R / (teeth / 2 + 0.95);
  const { shape } = gearShape(teeth, module);
  addWheelHoles(shape, { bore: 0.26, hub: 0.95, rim: R - 1.1, spokes: 6, spokeWidth: 0.36, curved: 0.42 });
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 2, curveSegments: 6 });
  geo.translate(0, 0, -thickness / 2);
  geo.computeVertexNormals();
  const group = new THREE.Group();
  const body = new THREE.Mesh(geo, mats.brass);
  body.rotation.x = -Math.PI / 2;
  group.add(body);

  const golds = new Batch(false);
  const gems = new Batch(true);
  const top = thickness / 2 + 0.02;
  // concentric gold beads
  for (const [rad, tube] of [[R - 1.0, 0.045], [R - 1.28, 0.03], [1.05, 0.05], [0.55, 0.04]]) {
    const t = new THREE.TorusGeometry(rad, tube, 6, 96);
    t.rotateX(Math.PI / 2);
    golds.add(t, new THREE.Matrix4().makeTranslation(0, top, 0));
  }
  // jeweled studs on the rim band
  const studs = 28;
  for (let i = 0; i < studs; i++) {
    const a = (i / studs) * TAU;
    const rad = R - 0.62;
    const big = i % 4 === 0;
    const pos = V(Math.cos(a) * rad, top, Math.sin(a) * rad);
    addJewel(gems, golds, frameMatrix(pos, Y_UP, V(Math.cos(a), 0, Math.sin(a))), big ? 0.12 : 0.065, GEM_LIST[(i / 2 + (big ? 1 : 0)) % GEM_LIST.length | 0], { prongs: big ? 6 : 0 });
  }
  // filigree scroll rings in the spoke windows
  for (let k = 0; k < 6; k++) {
    const a = ((k + 0.5) / 6) * TAU + 0.2;
    const rad = 2.75;
    const c = V(Math.cos(a) * rad, top, Math.sin(a) * rad);
    const t1 = new THREE.TorusGeometry(0.42, 0.03, 6, 28);
    t1.rotateX(Math.PI / 2);
    golds.add(t1, new THREE.Matrix4().makeTranslation(c.x, thickness * 0.0, c.z));
    const t2 = new THREE.TorusGeometry(0.2, 0.025, 6, 20);
    t2.rotateX(Math.PI / 2);
    golds.add(t2, new THREE.Matrix4().makeTranslation(c.x, thickness * 0.0, c.z));
    addJewel(gems, golds, frameMatrix(V(c.x, thickness * 0.0 + 0.02, c.z), Y_UP), 0.1, GEM_LIST[k % GEM_LIST.length], { prongs: 0 });
    // spokes to ring and hub (thin bridge)
    const br = tubeAlong([V(Math.cos(a) * 1.05, 0, Math.sin(a) * 1.05), c, V(Math.cos(a) * (R - 1.1), 0, Math.sin(a) * (R - 1.1))], 0.022, { radial: 4 });
    golds.add(br);
  }
  // cam arms: arched brackets standing on the ring
  for (let k = 0; k < 6; k++) {
    const a = ((k + 0.25) / 6) * TAU;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const p = (rad, y) => V(ca * rad, y, sa * rad);
    const pts = [p(3.85, top), p(3.82, 0.45), p(3.5, 0.9), p(3.0, 1.1), p(2.55, 0.98), p(2.3, 0.7)];
    golds.add(tubeAlong(pts, 0.075, { seg: 40, radial: 6 }));
    const knob = new THREE.SphereGeometry(0.12, 10, 8);
    golds.add(knob, new THREE.Matrix4().makeTranslation(pts[0].x, pts[0].y, pts[0].z));
    addJewel(gems, golds, frameMatrix(pts[5].clone().addScaledVector(V(-ca, 0, -sa), 0.02), V(-ca * 0.5, -0.8, -sa * 0.5)), 0.1, GEM_LIST[(k * 2) % GEM_LIST.length], { prongs: 0 });
  }
  addMesh(group, golds, mats.gold, 'ringGold');
  addMesh(group, gems, mats.gem, 'ringGems');
  group.userData = { R };
  return group;
}

// Crystal core sphere inside a gold latticed cage: fine meridian bars, a perforated equator band with jewelled gear studs, a trumpet crown with a ruby and a spire.
export function buildCore(mats, { R = 1.25, seed = 2 } = {}) {
  const r = rng(seed * 31 + 7);
  const group = new THREE.Group();
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 48), mats.core);
  sphere.name = 'coreSphere';
  const sg = [];
  const sparkTints = [[1, 0.95, 0.8], [1, 0.8, 0.45], [1, 0.55, 0.85], [0.55, 0.95, 1], [1, 1, 1]];
  for (let i = 0; i < 46; i++) {
    const u = r() * 2 - 1;
    const a = r() * TAU;
    const q = Math.sqrt(1 - u * u);
    sg.push({ pos: [Math.cos(a) * q * R * 1.02, u * R * 1.02, Math.sin(a) * q * R * 1.02], color: sparkTints[i % sparkTints.length], size: 0.28 + r() * 0.34, hot: 1.4, rate: 1.2 + r() * 3.6 });
  }
  sphere.userData.glints = sg;
  group.add(sphere);
  const halo = coreHalo(R);
  group.add(halo);
  const light = new THREE.PointLight(0xffc27a, 0, 0, 2);
  light.name = 'coreLight';

  const golds = new Batch(false);
  const gems = new Batch(true);
  const cr = R * 1.14;
  const meridians = 14;
  const PINK = [GEM_COLORS.rose, GEM_COLORS.aqua];
  for (let i = 0; i < meridians; i++) {
    const a = (i / meridians) * TAU;
    const pts = [];
    for (let k = 0; k <= 28; k++) {
      const phi = -1.39 + (k / 28) * 2.78;
      const rr = cr * Math.cos(phi);
      pts.push(V(Math.cos(a) * rr, Math.sin(phi) * cr, Math.sin(a) * rr));
    }
    golds.add(tubeAlong(pts, 0.04, { seg: 56, radial: 6 }));
  }
  for (const lat of [-1.0, -0.5, 0.5, 1.0]) {
    const t = new THREE.TorusGeometry(cr * Math.cos(lat), 0.036, 6, 72);
    t.rotateX(Math.PI / 2);
    golds.add(t, new THREE.Matrix4().makeTranslation(0, Math.sin(lat) * cr, 0));
  }
  // equator band: a wide strap with rolled edges and a row of rivets
  const strap = new THREE.CylinderGeometry(cr * 1.004, cr * 1.004, 0.2, 96, 1, true);
  golds.add(strap);
  for (const y of [-0.1, 0.1]) {
    const t = new THREE.TorusGeometry(cr * 1.004, 0.032, 6, 96);
    t.rotateX(Math.PI / 2);
    golds.add(t, new THREE.Matrix4().makeTranslation(0, y, 0));
  }
  for (let i = 0; i < 84; i++) {
    const a = (i / 84) * TAU;
    golds.add(new THREE.SphereGeometry(0.026, 6, 4), new THREE.Matrix4().makeTranslation(Math.cos(a) * cr * 1.012, 0, Math.sin(a) * cr * 1.012));
  }
  // tilted armillary bands
  for (const tilt of [-0.62, 0.62]) {
    for (let b = 0; b < 2; b++) {
      const pts = [];
      for (let k = 0; k < 64; k++) {
        const a = (k / 64) * TAU;
        pts.push(V(Math.cos(a) * cr * 1.006, 0, Math.sin(a) * cr * 1.006));
      }
      const m = new THREE.Matrix4().makeRotationY((b / 2) * Math.PI + 0.4).multiply(new THREE.Matrix4().makeRotationX(tilt * (b % 2 ? 1 : -1)));
      golds.add(tubeAlong(pts, 0.014, { closed: true, seg: 96, radial: 4 }), m);
    }
  }
  // jewelled gear studs on the band, small bulbs where the bars cross the other rings
  const studGear = gearGeometry({ teeth: 16, module: 0.042, thickness: 0.07, spokes: 0, bevel: false });
  for (let i = 0; i < meridians; i++) {
    const a = ((i + 0.5) / meridians) * TAU;
    const p = V(Math.cos(a) * cr, 0, Math.sin(a) * cr);
    const n = p.clone().normalize();
    const col = PINK[i % 2];
    if (i % 2 === 0) {
      golds.add(studGear, frameMatrix(p.clone().multiplyScalar(1.01), n, Y_UP));
      addBulb(gems, frameMatrix(p.clone().multiplyScalar(1.03), n, Y_UP), 0.16, col, { glint: 3.4, hot: 1.5 });
    } else {
      addJewel(gems, golds, frameMatrix(p.clone().multiplyScalar(1.012), n, Y_UP), 0.095, GEM_COLORS.rose, { prongs: 0, glint: false });
      addBulb(gems, frameMatrix(p.clone().multiplyScalar(1.03), n, Y_UP), 0.09, GEM_COLORS.rose, { glint: 3.0, hot: 1.3 });
    }
  }
  for (let i = 0; i < meridians; i++) {
    const a = (i / meridians) * TAU;
    for (const lat of [-1.0, -0.5, 0.5, 1.0]) {
      const p = V(Math.cos(a) * cr * Math.cos(lat), Math.sin(lat) * cr, Math.sin(a) * cr * Math.cos(lat));
      if (Math.abs(lat) === 0.5 && i % 2 === 0) {
        const n = p.clone().normalize();
        golds.add(new THREE.TorusGeometry(0.1, 0.028, 6, 14), frameMatrix(p.clone().multiplyScalar(1.01), n, Y_UP));
        addBulb(gems, frameMatrix(p.clone().multiplyScalar(1.025), n, Y_UP), 0.09, i % 4 === 0 ? GEM_COLORS.aqua : GEM_COLORS.rose, { glint: 3.0 });
      } else {
        golds.add(new THREE.SphereGeometry(0.04, 8, 6), new THREE.Matrix4().makeTranslation(p.x, p.y, p.z));
      }
    }
  }
  // trumpet crown on the top pole, ruby on a platform, spire above
  const cy = cr * 0.93;
  const crownProf = [[0.82, 0], [0.74, 0.08], [0.54, 0.3], [0.38, 0.56], [0.3, 0.78], [0.3, 0.86], [0.44, 0.9], [0.44, 0.98], [0.32, 1.02]].map(([x, y]) => new THREE.Vector2(x, y));
  const crown = new THREE.LatheGeometry(crownProf, 48);
  crown.computeVertexNormals();
  golds.add(crown, new THREE.Matrix4().makeTranslation(0, cy, 0));
  for (const [rad, y, tube] of [[0.8, 0.02, 0.04], [0.36, 0.7, 0.03], [0.44, 0.94, 0.03]]) {
    const t = new THREE.TorusGeometry(rad, tube, 6, 40);
    t.rotateX(Math.PI / 2);
    golds.add(t, new THREE.Matrix4().makeTranslation(0, cy + y, 0));
  }
  addBulb(gems, frameMatrix(V(0, cy + 1.12, 0), Y_UP), 0.3, GEM_COLORS.rose, { glint: 3.6, hot: 1.7 });
  golds.add(new THREE.ConeGeometry(0.05, 1.1, 8), new THREE.Matrix4().makeTranslation(0, cy + 1.62, 0));
  golds.add(new THREE.SphereGeometry(0.07, 8, 6), new THREE.Matrix4().makeTranslation(0, cy + 2.18, 0));
  // foot with a gem below
  const foot = new THREE.CylinderGeometry(0.42, 0.18, 0.4, 24);
  golds.add(foot, new THREE.Matrix4().makeTranslation(0, -cr - 0.12, 0));
  addBulb(gems, frameMatrix(V(0, -cr - 0.46, 0.06), V(0, -0.4, 1), V(0, 1, 0)), 0.26, GEM_COLORS.aqua, { glint: 3.2 });
  addMesh(group, golds, mats.gold, 'coreCage');
  addMesh(group, gems, mats.gem, 'coreGems');
  group.userData = { R, cageR: cr, sphere, halo, light };
  return group;
}

// Stamen cage: flared brass filaments with jeweled tips on a bowl-shaped base.
export function buildStamenCage(mats, { baseR = 1.95, tipR = 3.3, height = 2.5, count = 26, seed = 5 } = {}) {
  const r = rng(seed * 13 + 1);
  const group = new THREE.Group();
  const golds = new Batch(false);
  const gems = new Batch(true);
  const bowl = (t, br, tr, h) => V(br + (tr - br) * Math.pow(t, 1.7), h * (1 - Math.pow(1 - t, 1.6)) * 0.98 + 0.0, 0);
  const addFilament = (a, br, tr, h, tubeR, tipR2, gemCol) => {
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const pts = [];
    for (let k = 0; k <= 8; k++) {
      const q = bowl(k / 8, br, tr, h);
      pts.push(V(ca * q.x, q.y, sa * q.x));
    }
    golds.add(tubeAlong(pts, tubeR, { seg: 24, radial: 5 }));
    const tip = pts[8];
    const dir = tip.clone().sub(pts[7]).normalize();
    const collar = new THREE.CylinderGeometry(tipR2 * 0.75, tipR2 * 0.4, tipR2 * 1.8, 10);
    collar.rotateX(Math.PI / 2);
    golds.add(collar, frameMatrix(tip.clone().addScaledVector(dir, -tipR2 * 0.4), dir, Y_UP));
    addBulb(gems, frameMatrix(tip.clone().addScaledVector(dir, tipR2 * 0.85), dir, Y_UP), tipR2, gemCol, { glint: 3.0, hot: 1.4 });
    return pts;
  };
  const cols = [GEM_COLORS.rose, GEM_COLORS.aqua, GEM_COLORS.rose, GEM_COLORS.amethyst, GEM_COLORS.aqua, GEM_COLORS.rose, GEM_COLORS.aqua, GEM_COLORS.ruby];
  const outerPts = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU + 0.05 * (r() - 0.5);
    outerPts.push(addFilament(a, baseR * 0.97, tipR * (0.93 + 0.12 * r()), height * (0.62 + 0.2 * r()), 0.05, 0.15, cols[i % cols.length]));
  }
  // taller jewelled stamens leaning outward so they frame the crown instead of covering the core
  for (let i = 0; i < 10; i++) {
    const a = ((i + 0.5) / 10) * TAU + 0.1 * (r() - 0.5);
    addFilament(a, baseR * 0.9, tipR * 0.95, height * (1.05 + 0.14 * r()), 0.045, 0.16, cols[(i * 3 + 2) % cols.length]);
  }
  // mid-filament bead nodes
  for (let i = 0; i < count; i += 2) {
    const a = (i / count) * TAU;
    const q = bowl(0.5, baseR * 0.97, tipR, height);
    golds.add(new THREE.SphereGeometry(0.075, 8, 6), new THREE.Matrix4().makeTranslation(Math.cos(a) * q.x, q.y, Math.sin(a) * q.x));
  }
  // jewelled studs around the base ring
  for (let i = 0; i < 24; i++) {
    const a = ((i + 0.5) / 24) * TAU;
    const q = bowl(0, baseR * 0.97, tipR, height);
    const n = V(Math.cos(a), 0, Math.sin(a));
    addJewel(gems, golds, frameMatrix(V(n.x * (q.x + 0.1), q.y, n.z * (q.x + 0.1)), n, Y_UP), 0.08, cols[i % cols.length], { prongs: 0 });
  }
  // bands joining the filaments
  for (const [t, tube] of [[0.0, 0.1], [0.34, 0.03], [0.62, 0.028]]) {
    const q = bowl(t, baseR * 0.97, tipR, height);
    const tor = new THREE.TorusGeometry(q.x, tube, 6, 96);
    tor.rotateX(Math.PI / 2);
    golds.add(tor, new THREE.Matrix4().makeTranslation(0, q.y, 0));
  }
  // basket beneath: lathe cup with ribs
  const prof = [];
  for (let k = 0; k <= 10; k++) {
    const t = k / 10;
    prof.push(new THREE.Vector2(0.28 + (baseR * 0.95 - 0.28) * Math.pow(t, 0.8), -1.15 + 1.15 * t));
  }
  const lathe = new THREE.LatheGeometry(prof, 48);
  const cup = new THREE.Mesh(lathe, mats.brassDark);
  cup.material = mats.brassDark.clone();
  cup.material.side = THREE.DoubleSide;
  group.add(cup);
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU;
    const pts = prof.map((p) => V(Math.cos(a) * (p.x + 0.015), p.y + 0.01, Math.sin(a) * (p.x + 0.015)));
    golds.add(tubeAlong(pts, 0.026, { seg: 14, radial: 4 }));
  }
  const dishRing = new THREE.TorusGeometry(0.34, 0.07, 6, 24);
  dishRing.rotateX(Math.PI / 2);
  golds.add(dishRing, new THREE.Matrix4().makeTranslation(0, -1.14, 0));
  addMesh(group, golds, mats.gold, 'stamenGold');
  addMesh(group, gems, mats.gem, 'stamenGems');
  group.userData = { baseR, tipR, height };
  return group;
}

// Thin steel spindle (unit length 1 along Y, centred) with bead spacers.
export function buildSpindle(mats, { radius = 0.075 } = {}) {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, 14), mats.steel);
  g.add(shaft);
  return g;
}

// Small ring/washer spacer with a jewel, axis Y.
export function washerPart(mats, { R = 0.5, h = 0.16, gemColor = GEM_COLORS.sapphire, jewels = 3 } = {}) {
  const g = new THREE.Group();
  const golds = new Batch(false);
  const gems = new Batch(true);
  const body = new THREE.CylinderGeometry(R, R * 1.04, h, 28);
  golds.add(body);
  const t = new THREE.TorusGeometry(R * 1.02, h * 0.28, 6, 36);
  t.rotateX(Math.PI / 2);
  golds.add(t, new THREE.Matrix4().makeTranslation(0, h * 0.5, 0));
  golds.add(t, new THREE.Matrix4().makeTranslation(0, -h * 0.5, 0));
  for (let i = 0; i < jewels; i++) {
    const a = (i / jewels) * TAU;
    addJewel(gems, golds, frameMatrix(V(Math.cos(a) * R * 0.72, h * 0.5 + 0.01, Math.sin(a) * R * 0.72), Y_UP), Math.max(0.045, R * 0.11), gemColor, { prongs: 0 });
  }
  addMesh(g, golds, mats.brass, 'washerGold');
  addMesh(g, gems, mats.gem, 'washerGems');
  return g;
}
