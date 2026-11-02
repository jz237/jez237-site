// Spectators along the terrace railing: simple figures, dark against the
// bright water, picked out by the bursts at their edges. A few hold phones up,
// and the screens show the sky they are filming.
import * as THREE from 'three';
import { SITE } from './site.js?v=7';
import { rng } from './physics.js?v=7';

const SCREEN_VS = /* glsl */ `
varying vec2 vUv; varying vec3 vW;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`;
const SCREEN_FS = /* glsl */ `
uniform sampler2D uScreen;
varying vec2 vUv; varying vec3 vW;
void main() {
  vec2 s = vec2(0.36, 0.5) + vUv * vec2(0.28, 0.36);
  vec3 c = texture2D(uScreen, s).rgb * 0.9 + vec3(0.012, 0.016, 0.026);
  float edge = step(0.06, vUv.x) * step(vUv.x, 0.94) * step(0.04, vUv.y) * step(vUv.y, 0.96);
  gl_FragColor = vec4(c * edge * 1.6, 1.0);
}
`;

function part(geo, color, m) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.applyMatrix4(m);
  const n = g.attributes.position.count;
  const c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) c.set(color, i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}

function merge(list) {
  let n = 0;
  for (const g of list) n += g.attributes.position.count;
  const p = new Float32Array(n * 3), nr = new Float32Array(n * 3), c = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  let o = 0;
  for (const g of list) {
    p.set(g.attributes.position.array, o * 3);
    nr.set(g.attributes.normal.array, o * 3);
    c.set(g.attributes.color.array, o * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
    o += g.attributes.position.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(p, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nr, 3));
  out.setAttribute('color', new THREE.BufferAttribute(c, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return out;
}

const M = () => new THREE.Matrix4();
function limb(a, b, r) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const len = A.distanceTo(B);
  const g = new THREE.CapsuleGeometry(r, Math.max(0.01, len - 2 * r), 4, 10);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  return { g, m: M().compose(A.clone().add(B).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)) };
}

// One figure in local space facing -z, feet at y = 0.
function figure(r, pose, cloth, skin, hair, scale = 1) {
  const parts = [], screens = [];
  const S = M().makeScale(scale, scale, scale);
  const add = (g, col, m) => parts.push(part(g, col, S.clone().multiply(m)));
  const prof = [[0.0, 0.0], [0.13, 0.0], [0.12, 0.42], [0.15, 0.84], [0.18, 0.95], [0.16, 1.06], [0.19, 1.26], [0.215, 1.4], [0.19, 1.46], [0.08, 1.5], [0.055, 1.56], [0.0, 1.58]].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.LatheGeometry(prof, 28);
  add(body, cloth, M().makeScale(1.22, 1, 0.66));
  const hood = r() < 0.3;
  add(new THREE.SphereGeometry(0.105, 22, 16), skin, M().compose(new THREE.Vector3(0, 1.665, 0), new THREE.Quaternion(), new THREE.Vector3(0.92, 1.08, 1)));
  add(new THREE.SphereGeometry(0.113, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), hood ? cloth : hair, M().compose(new THREE.Vector3(0, 1.678, 0.012), new THREE.Quaternion(), new THREE.Vector3(0.96, 1.08, 1.04)));
  if (r() < 0.25 && !hood) add(new THREE.CylinderGeometry(0.12, 0.13, 0.08, 20), cloth, M().makeTranslation(0, 1.76, 0));
  const arm = (side, kind) => {
    const sh = [0.235 * side, 1.4, 0];
    if (kind === 'down') {
      const el = [0.27 * side, 1.12, -0.02], ha = [0.25 * side, 0.86, -0.06];
      for (const [a, b] of [[sh, el], [el, ha]]) { const l = limb(a, b, 0.048); add(l.g, cloth, l.m); }
    } else if (kind === 'rail') {
      const el = [0.3 * side, 1.18, -0.2], ha = [0.26 * side, 1.07, -0.42];
      for (const [a, b] of [[sh, el], [el, ha]]) { const l = limb(a, b, 0.048); add(l.g, cloth, l.m); }
    } else if (kind === 'phone') {
      const el = [0.2 * side, 1.5, -0.24], ha = [0.06 * side, 1.78, -0.36];
      for (const [a, b] of [[sh, el], [el, ha]]) { const l = limb(a, b, 0.046); add(l.g, cloth, l.m); }
      const ph = new THREE.BoxGeometry(0.075, 0.15, 0.009);
      add(ph, [0.01, 0.01, 0.012], M().makeTranslation(0.0, 1.84, -0.4));
      const sc = new THREE.PlaneGeometry(0.068, 0.142);
      screens.push(part(sc, [1, 1, 1], S.clone().multiply(M().makeTranslation(0.0, 1.84, -0.394))));
    } else if (kind === 'up') {
      const el = [0.33 * side, 1.72, -0.06], ha = [0.28 * side, 2.0, -0.1];
      for (const [a, b] of [[sh, el], [el, ha]]) { const l = limb(a, b, 0.045); add(l.g, cloth, l.m); }
    } else if (kind === 'hold') { // holding a child's legs
      const el = [0.3 * side, 1.38, -0.1], ha = [0.18 * side, 1.5, -0.2];
      for (const [a, b] of [[sh, el], [el, ha]]) { const l = limb(a, b, 0.048); add(l.g, cloth, l.m); }
    }
  };
  if (pose === 'phone') { arm(1, 'phone'); arm(-1, r() < 0.5 ? 'down' : 'rail'); }
  else if (pose === 'phone2') { arm(1, 'phone'); arm(-1, 'phone'); }
  else if (pose === 'cheer') { arm(1, 'up'); arm(-1, r() < 0.5 ? 'up' : 'down'); }
  else if (pose === 'rail') { arm(1, 'rail'); arm(-1, 'rail'); }
  else if (pose === 'shoulders') {
    arm(1, 'hold'); arm(-1, 'hold');
    const kid = figure(r, r() < 0.5 ? 'cheer' : 'phone', [0.09, 0.03, 0.03], skin, hair, 0.56);
    const km = M().makeTranslation(0, 1.42 * scale, 0.02);
    kid.parts.forEach(g => { g.applyMatrix4(km); parts.push(g); });
    kid.screens.forEach(g => { g.applyMatrix4(km); screens.push(g); });
    for (const s of [1, -1]) { const l = limb([0.1 * s, 1.47, -0.05], [0.13 * s, 1.18, -0.16], 0.04); add(l.g, [0.03, 0.03, 0.05], l.m); }
  } else { arm(1, 'down'); arm(-1, 'down'); }
  return { parts, screens };
}

export class Crowd {
  constructor(tier, world) {
    this.group = new THREE.Group();
    const r = rng(404);
    const T = SITE.terrace;
    const cloths = [[0.03, 0.032, 0.045], [0.05, 0.016, 0.018], [0.045, 0.045, 0.045], [0.03, 0.04, 0.025], [0.11, 0.09, 0.07], [0.02, 0.02, 0.022], [0.06, 0.05, 0.08]];
    const skins = [[0.26, 0.17, 0.12], [0.18, 0.11, 0.075], [0.1, 0.06, 0.04], [0.3, 0.21, 0.16]];
    const hairs = [[0.015, 0.012, 0.01], [0.04, 0.025, 0.012], [0.12, 0.09, 0.05], [0.07, 0.07, 0.07]];
    const spots = [
      [-1.95, -9.05, 0.15, 'rail', 1.0], [2.25, -9.1, -0.12, 'phone', 1.02], [-3.5, -9.15, 0.05, 'shoulders', 1.04],
      [4.1, -9.0, -0.2, 'phone2', 0.97], [6.0, -9.1, 0.1, 'down', 1.05], [-5.6, -9.0, -0.1, 'phone', 0.98],
    ];
    let x = 7.6;
    while (x < 34) { spots.push([x, -9.1 + r() * 0.2, (r() - 0.5) * 0.5, r.pick(['down', 'rail', 'phone', 'down', 'cheer']), 0.93 + r() * 0.14]); x += 0.62 + r() * 0.7; }
    x = -7.2;
    while (x > -34) { spots.push([x, -9.1 + r() * 0.2, (r() - 0.5) * 0.5, r.pick(['down', 'rail', 'phone', 'down', 'shoulders']), 0.93 + r() * 0.14]); x -= 0.62 + r() * 0.7; }
    for (let i = 0; i < 40 * tier.crowd; i++) {
      const px = (r() - 0.5) * 64;
      if (Math.abs(px) < 3) continue;
      spots.push([px, -8.0 + r() * 2.5, (r() - 0.5) * 0.8, r.pick(['down', 'phone', 'down']), 0.92 + r() * 0.15]);
    }
    const parts = [], screens = [];
    for (const [px, pz, rot, pose, sc] of spots) {
      const f = figure(r, pose, r.pick(cloths), r.pick(skins), r.pick(hairs), sc);
      const m = M().compose(new THREE.Vector3(px, T.y, pz), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rot), new THREE.Vector3(1, 1, 1));
      f.parts.forEach(g => { g.applyMatrix4(m); parts.push(g); });
      f.screens.forEach(g => { g.applyMatrix4(m); screens.push(g); });
    }
    const bodyMat = world.litMat({ uRim: { value: 0.9 } });
    this.group.add(new THREE.Mesh(merge(parts), bodyMat));
    this.screenU = { uScreen: { value: null } };
    if (screens.length) this.group.add(new THREE.Mesh(merge(screens), new THREE.ShaderMaterial({ uniforms: this.screenU, vertexShader: SCREEN_VS, fragmentShader: SCREEN_FS, side: THREE.DoubleSide })));
  }
  setScreen(tex) { this.screenU.uScreen.value = tex; }
  update() {}
}
