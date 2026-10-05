import * as THREE from 'three';
import { Batch, addJewel, frameMatrix, tubeAlong, TAU } from './geo.js';
import { GEM_COLORS, rng } from './materials.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Gentle S-curve of the conduit in exploded coordinates (y is world height).
export const STEM_TOP = -9.1;
export const STEM_BOTTOM = -46;
export const stemX = (y) => {
  const d = STEM_TOP - y;
  return 0.75 * Math.sin(d * 0.34 + 0.2) - 0.1;
};
export const stemZ = (y) => {
  const d = STEM_TOP - y;
  return 0.15 * Math.sin(d * 0.2 + 1.1);
};
export const stemPoint = (y) => V(stemX(y), y, stemZ(y));

// Extra lateral S-bend applied only in the assembled state (vertex shader on the braid, mirrored here for collars and leaves).
const BEND_A = 1.5;
const BEND_K = 0.33;
const smooth01 = (t) => t * t * (3 - 2 * t);
export const bendX = (y) => {
  const d = Math.max(0, STEM_TOP - y);
  return BEND_A * Math.sin(d * BEND_K) * smooth01(Math.min(1, d / 3));
};
export const bentStemPoint = (y) => V(stemX(y) + bendX(y), y, stemZ(y));
export const bentStemTangent = (y) => bentStemPoint(y + 0.05).sub(bentStemPoint(y - 0.05)).normalize();

function bendMaterial(mat, uniform) {
  const m = mat.clone();
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uBend = uniform;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nuniform float uBend;`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float bendD = max(0.0, ${STEM_TOP.toFixed(2)} - transformed.y);
        float bendT = clamp(bendD / 3.0, 0.0, 1.0);
        transformed.x += uBend * ${BEND_A.toFixed(3)} * sin(bendD * ${BEND_K.toFixed(3)}) * bendT * bendT * (3.0 - 2.0 * bendT);`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform float uBend;`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n diffuseColor.rgb *= mix(1.0, 0.6, uBend);`);
  };
  return m;
}
export const stemTangent = (y) => stemPoint(y - 0.05).sub(stemPoint(y + 0.05)).normalize().negate();

const STRAND_COLORS = ['#7a2430', '#1d4a35', '#233a7a', '#a8672f', '#23262e', '#8a929c', '#8f2a45', '#145a66', '#b88a3c', '#35284f'];

// Braided wire conduit: counter-rotating coloured strands over a dark core.
export function buildBraid(mats, { R = 1.0, strands = 60, pitch = 17, y0 = STEM_TOP, y1 = STEM_BOTTOM, seed = 4 } = {}) {
  const r = rng(seed * 7 + 2);
  const group = new THREE.Group();
  const steps = Math.round((y0 - y1) / 0.22);
  const centre = [];
  for (let i = 0; i <= steps; i++) centre.push(stemPoint(y0 - ((y0 - y1) * i) / steps));
  const curve = new THREE.CatmullRomCurve3(centre, false, 'centripetal');
  const frames = curve.computeFrenetFrames(steps, false);

  const bend = { value: 0 };
  const core = new THREE.TubeGeometry(curve, steps, R * 0.72, 12, false);
  group.add(new THREE.Mesh(core, bendMaterial(mats.gunmetal, bend)));

  const batch = new Batch(true);
  for (let k = 0; k < strands; k++) {
    const dir = k % 2 ? 1 : -1;
    const col = new THREE.Color(STRAND_COLORS[k % STRAND_COLORS.length]);
    const ph = (k / strands) * TAU + r() * 0.2;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      const len = (y0 - y1) * s;
      const a = ph + dir * (len / pitch) * TAU;
      const rho = R * (0.92 + 0.14 * Math.sin((len / pitch) * TAU * 2 + k * Math.PI));
      const c = centre[i];
      const n = frames.normals[i];
      const b = frames.binormals[i];
      pts.push(c.clone().addScaledVector(n, Math.cos(a) * rho).addScaledVector(b, Math.sin(a) * rho));
    }
    const cur = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    batch.add(new THREE.TubeGeometry(cur, steps * 2, 0.052 + (k % 3 === 0 ? 0.012 : 0), 6, false), null, col);
  }
  // fine steel braid overlay
  const braidCol = new THREE.Color('#aeb4bf');
  for (let k = 0; k < 8; k++) {
    const dir = k % 2 ? 1 : -1;
    const ph = (k / 8) * TAU;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      const len = (y0 - y1) * s;
      const a = ph + dir * (len / (pitch * 0.55)) * TAU;
      const rho = R * 1.0;
      const c = centre[i];
      pts.push(c.clone().addScaledVector(frames.normals[i], Math.cos(a) * rho).addScaledVector(frames.binormals[i], Math.sin(a) * rho));
    }
    batch.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal'), steps * 3, 0.04, 5, false), null, braidCol);
  }
  const mesh = batch.build(bendMaterial(mats.stemBraid, bend));
  group.add(mesh);
  group.userData = { R, bend };
  return group;
}

// Retention collar: ribbed gold band, jewel studs, alignment pins. Axis Y.
export function buildCollar(mats, { R = 1.35, h = 0.7, jewels = 8, pins = 3, seed = 1, serrated = false } = {}) {
  const r = rng(seed * 19 + 11);
  const group = new THREE.Group();
  const golds = new Batch(false);
  const gems = new Batch(true);
  const outer = R + 0.2;
  const prof = [
    new THREE.Vector2(R - 0.02, -h / 2),
    new THREE.Vector2(outer + 0.06, -h / 2 + 0.02),
    new THREE.Vector2(outer + 0.08, -h / 2 + 0.14),
    new THREE.Vector2(outer - 0.02, -h / 2 + 0.2),
    new THREE.Vector2(outer - 0.05, h / 2 - 0.2),
    new THREE.Vector2(outer + 0.08, h / 2 - 0.14),
    new THREE.Vector2(outer + 0.06, h / 2 - 0.02),
    new THREE.Vector2(R - 0.02, h / 2),
  ];
  const lathe = new THREE.LatheGeometry(prof, 64);
  const band = new THREE.Mesh(lathe, mats.gold.clone());
  band.material.side = THREE.DoubleSide;
  group.add(band);
  for (const s of [-1, 1]) {
    const bead = new THREE.TorusGeometry(outer + 0.08, 0.045, 6, 80);
    bead.rotateX(Math.PI / 2);
    golds.add(bead, new THREE.Matrix4().makeTranslation(0, s * (h / 2 - 0.1), 0));
  }
  if (serrated) {
    const teeth = 36;
    const tooth = new THREE.BoxGeometry(0.12, h * 0.55, 0.09);
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * TAU;
      golds.add(tooth, new THREE.Matrix4().makeRotationY(-a).setPosition(Math.cos(a) * (outer + 0.07), 0, Math.sin(a) * (outer + 0.07)));
    }
  }
  const cols = [GEM_COLORS.aqua, GEM_COLORS.ruby, GEM_COLORS.sapphire, GEM_COLORS.emerald, GEM_COLORS.rose];
  for (let i = 0; i < jewels; i++) {
    const a = ((i + 0.5) / jewels) * TAU;
    const n = V(Math.cos(a), 0, Math.sin(a));
    addJewel(gems, golds, frameMatrix(n.clone().multiplyScalar(outer - 0.02), n, V(0, 1, 0)), Math.min(0.12, h * 0.17), cols[i % cols.length], { prongs: 0 });
  }
  const pin = new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8);
  for (let i = 0; i < pins; i++) {
    const a = (i / pins) * TAU + r() * 0.5;
    const n = V(Math.cos(a), 0, Math.sin(a));
    const m = frameMatrix(n.clone().multiplyScalar(R - 0.1), n, V(0, 1, 0));
    m.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    golds.add(pin, m);
  }
  const mg = golds.build(mats.gold);
  const mm = gems.build(mats.gem);
  if (mg) group.add(mg);
  if (mm) group.add(mm);
  group.userData = { R, h };
  return group;
}
