// Procedural models: noise-carved rocks with smooth normals, six ship designs, the Maw, orbs, mines.
import * as THREE from '../vendor/three.module.min.js';

const hdr = (hex, k) => new THREE.Color(hex).multiplyScalar(k);

// ------------------------------------------------------------------ noise (JS side, for geometry)
function hash3(x, y, z, s) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y, z, s) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const L = (a, b, t) => a + (b - a) * t;
  const h = (i, j, k) => hash3(xi + i, yi + j, zi + k, s);
  return L(L(L(h(0, 0, 0), h(1, 0, 0), u), L(h(0, 1, 0), h(1, 1, 0), u), v), L(L(h(0, 0, 1), h(1, 0, 1), u), L(h(0, 1, 1), h(1, 1, 1), u), v), w);
}
function fbm(x, y, z, s, oct = 4) {
  let a = 0.5, f = 1, t = 0;
  for (let i = 0; i < oct; i++) { t += a * vnoise(x * f, y * f, z * f, s + i * 7); f *= 2.03; a *= 0.5; }
  return t;
}

// ------------------------------------------------------------------ rocks
// radius as a function of direction: lumpy fbm, a few craters, a stretch
function rockShape(seed) {
  const rnd = (k) => hash3(seed, k, 3, 11);
  const craters = [];
  for (let i = 0; i < 6; i++) {
    const a = rnd(i * 3) * Math.PI * 2, b = Math.acos(rnd(i * 3 + 1) * 2 - 1);
    craters.push({ d: new THREE.Vector3(Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)), r: 0.25 + rnd(i * 3 + 2) * 0.35, k: 0.08 + rnd(i + 40) * 0.1 });
  }
  const sx = 0.82 + rnd(50) * 0.4, sy = 0.72 + rnd(51) * 0.3, sz = 0.82 + rnd(52) * 0.4;
  return (d) => {
    let r = 0.78 + fbm(d.x * 1.4 + 3, d.y * 1.4, d.z * 1.4, seed) * 0.42 + fbm(d.x * 5, d.y * 5, d.z * 5, seed + 9, 3) * 0.06;
    for (const c of craters) {
      const t = d.angleTo(c.d) / c.r;
      if (t < 1.25) r -= c.k * (t < 1 ? 1 - t * t : 0) - c.k * 0.35 * Math.exp(-Math.pow((t - 1.05) * 6, 2));
    }
    return { r, sx, sy, sz };
  };
}

export function rockGeometry(seed, detail = 4) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const pos = g.attributes.position;
  const nrm = new Float32Array(pos.count * 3);
  const f = rockShape(seed);
  const d = new THREE.Vector3(), t1 = new THREE.Vector3(), t2 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const P = new THREE.Vector3(), P1 = new THREE.Vector3(), P2 = new THREE.Vector3(), q = new THREE.Vector3();
  const at = (dir, out) => { const s = f(dir); return out.set(dir.x * s.r * s.sx, dir.y * s.r * s.sy, dir.z * s.r * s.sz); };
  const cache = new Map();
  for (let i = 0; i < pos.count; i++) {
    d.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
    const key = `${d.x.toFixed(4)},${d.y.toFixed(4)},${d.z.toFixed(4)}`;
    let c = cache.get(key);
    if (!c) {
      at(d, P);
      t1.crossVectors(Math.abs(d.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up, d).normalize();
      t2.crossVectors(d, t1).normalize();
      const e = 0.01;
      at(q.copy(d).addScaledVector(t1, e).normalize(), P1);
      at(q.copy(d).addScaledVector(t2, e).normalize(), P2);
      const n = new THREE.Vector3().subVectors(P1, P).cross(new THREE.Vector3().subVectors(P2, P)).normalize();
      if (n.dot(d) < 0) n.negate();
      c = { p: P.clone(), n };
      cache.set(key, c);
    }
    pos.setXYZ(i, c.p.x, c.p.y, c.p.z);
    nrm[i * 3] = c.n.x; nrm[i * 3 + 1] = c.n.y; nrm[i * 3 + 2] = c.n.z;
  }
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  g.computeBoundingSphere();
  return g;
}

// ------------------------------------------------------------------ ships
// nose points down -z; about 2.3 units long
function extrude(shape, depth, bevel = 0.06) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 6 });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -depth / 2, 0);
  return g;
}
function shapeOf(pts) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}
const mirror = (pts) => [...pts, ...pts.slice(1, -1).reverse().map(([x, y]) => [-x, y])];

export function buildShip(look, color, accent, env) {
  const g = new THREE.Group();
  const hull = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).lerp(new THREE.Color(0x1a2030), 0.45), metalness: 0.78, roughness: 0.3, envMap: env, envMapIntensity: 1.1 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x141820, metalness: 0.6, roughness: 0.45, envMap: env, envMapIntensity: 0.8 });
  const glow = new THREE.MeshBasicMaterial({ color: hdr(color, 3.2) });
  const glow2 = new THREE.MeshBasicMaterial({ color: hdr(accent, 3) });
  const glass = new THREE.MeshStandardMaterial({ color: 0x0a1424, metalness: 0.2, roughness: 0.05, envMap: env, envMapIntensity: 2.2, emissive: hdr(accent, 0.35) });
  const add = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; };
  const engines = [];
  const eng = (x, z, s = 1) => { engines.push(new THREE.Vector3(x, 0.02, z)); add(new THREE.CylinderGeometry(0.13 * s, 0.17 * s, 0.3, 12).rotateX(Math.PI / 2), dark, x, 0.02, z - 0.05); add(new THREE.CircleGeometry(0.12 * s, 12).rotateY(0), glow2, x, 0.02, z + 0.11); };
  if (look === 'razor') {
    add(extrude(shapeOf(mirror([[0, -1.35], [0.22, -0.7], [1.15, 0.75], [0.9, 0.9], [0.35, 0.62], [0.3, 0.95], [0, 0.85]])), 0.14), hull);
    add(extrude(shapeOf(mirror([[0, -0.9], [0.5, -0.45], [0.45, -0.32], [0, -0.5]])), 0.05, 0.02), glow, 0, 0.1, 0);
    add(new THREE.CapsuleGeometry(0.16, 0.5, 4, 10).rotateX(Math.PI / 2), glass, 0, 0.14, -0.25);
    for (const x of [-1, 1]) add(new THREE.BoxGeometry(0.05, 0.05, 0.75), glow, x * 0.85, 0.06, 0.45).rotation.y = x * -0.55;
    eng(-0.28, 0.8); eng(0.28, 0.8);
  } else if (look === 'lyra') {
    add(new THREE.CylinderGeometry(0.06, 0.24, 2.3, 10).rotateX(-Math.PI / 2), hull, 0, 0, -0.1);
    add(extrude(shapeOf(mirror([[0, 0.15], [0.95, -0.25], [1.05, -0.12], [0.3, 0.55], [0, 0.6]])), 0.06, 0.03), hull, 0, 0, 0.25);
    add(extrude(shapeOf(mirror([[0, 0.1], [0.92, -0.25], [0.95, -0.2], [0, 0.18]])), 0.03, 0.01), glow, 0, 0.06, 0.25);
    add(new THREE.CapsuleGeometry(0.12, 0.45, 4, 10).rotateX(Math.PI / 2), glass, 0, 0.13, -0.15);
    add(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 6).rotateX(Math.PI / 2), glow2, 0, 0, -1.55);
    eng(0, 1.05, 1.3);
  } else if (look === 'grit') {
    add(new THREE.BoxGeometry(1.0, 0.42, 1.25), hull, 0, 0, 0.15);
    add(new THREE.BoxGeometry(0.62, 0.3, 0.5), dark, 0, 0.18, -0.55);
    add(new THREE.BoxGeometry(0.4, 0.08, 0.3), glass, 0, 0.36, -0.55);
    for (const x of [-1, 1]) {
      const arm = add(new THREE.BoxGeometry(0.16, 0.16, 0.9), dark, x * 0.42, 0, -0.95);
      arm.rotation.y = x * 0.18;
      add(new THREE.ConeGeometry(0.12, 0.35, 6).rotateX(-Math.PI / 2), glow, x * 0.52, 0, -1.45);
      add(new THREE.BoxGeometry(0.3, 0.34, 0.9), hull, x * 0.62, -0.02, 0.35);
    }
    add(new THREE.BoxGeometry(1.06, 0.06, 0.06), glow, 0, 0.22, 0.5);
    eng(-0.62, 0.85, 1.2); eng(0.62, 0.85, 1.2);
  } else if (look === 'cipher') {
    const body = add(new THREE.OctahedronGeometry(0.75, 0), hull, 0, 0, 0);
    body.scale.set(1, 0.42, 1.45);
    const ring = add(new THREE.TorusGeometry(0.95, 0.05, 6, 40).rotateX(Math.PI / 2), glow, 0, 0, 0.05);
    ring.scale.set(1, 1, 0.8);
    add(new THREE.SphereGeometry(0.2, 16, 10), glow2, 0, 0.2, -0.35);
    for (const x of [-1, 1]) add(new THREE.BoxGeometry(0.7, 0.05, 0.12), dark, x * 0.75, 0, 0.35).rotation.y = x * 0.4;
    eng(-0.3, 0.9); eng(0.3, 0.9);
  } else if (look === 'maw') {
    const body = add(new THREE.SphereGeometry(0.7, 20, 14), hull, 0, 0, 0.1);
    body.scale.set(1, 0.55, 1.25);
    add(new THREE.SphereGeometry(0.24, 16, 10), glow, 0, 0.12, -0.72);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const sp = add(new THREE.ConeGeometry(0.1, 0.8, 6), dark, Math.cos(a) * 0.6, 0, Math.sin(a) * 0.7 + 0.1);
      sp.rotation.set(Math.PI / 2, 0, -a + Math.PI / 2);
      sp.rotation.order = 'YXZ';
      sp.lookAt(Math.cos(a) * 3, 0, Math.sin(a) * 3 + 0.1);
      sp.rotateX(Math.PI / 2);
    }
    eng(0, 1.0, 1.4);
  } else {
    // the Ace: a sleek take on the classic arrowhead
    add(extrude(shapeOf(mirror([[0, -1.3], [0.95, 0.85], [0.55, 0.62], [0.2, 0.82], [0, 0.7]])), 0.16), hull);
    add(extrude(shapeOf(mirror([[0, -1.25], [0.9, 0.8], [0.84, 0.82], [0, -1.1]])), 0.04, 0.02), glow, 0, 0.1, 0);
    add(new THREE.CapsuleGeometry(0.17, 0.55, 4, 10).rotateX(Math.PI / 2), glass, 0, 0.16, -0.2);
    eng(-0.3, 0.78); eng(0.3, 0.78);
  }
  g.traverse((m) => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; } });
  return { group: g, engines, materials: [hull, glow, glow2] };
}

// ------------------------------------------------------------------ the Maw (boss)
export function buildBoss(env) {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(rockGeometry(9001, 5), null);
  shell.scale.setScalar(5.6);
  g.add(shell);
  const spikes = new THREE.Group();
  const spikeMat = new THREE.MeshStandardMaterial({ color: 0x2a1418, metalness: 0.5, roughness: 0.4, envMap: env, emissive: hdr(0xff2a48, 0.08) });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.2, 7), spikeMat);
    c.position.set(Math.cos(a) * 5.4, -0.3 + (i % 2) * 0.6, Math.sin(a) * 5.4);
    c.lookAt(Math.cos(a) * 20, c.position.y, Math.sin(a) * 20);
    c.rotateX(Math.PI / 2);
    spikes.add(c);
  }
  g.add(spikes);
  return { group: g, shell, spikes };
}

// ------------------------------------------------------------------ orbs, mines, drones
export function buildOrb(color, env) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), new THREE.MeshStandardMaterial({ color: 0x101820, metalness: 0.4, roughness: 0.2, envMap: env, emissive: hdr(color, 1.4), flatShading: true }));
  g.add(core);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.035, 6, 48), new THREE.MeshBasicMaterial({ color: hdr(color, 3) }));
  g.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.02, 6, 48), new THREE.MeshBasicMaterial({ color: hdr(0xffffff, 2) }));
  g.add(ring2);
  return { group: g, core, ring, ring2 };
}

export function buildMine(color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 0), new THREE.MeshStandardMaterial({ color: 0x1a1a22, metalness: 0.7, roughness: 0.3, flatShading: true }));
  g.add(body);
  for (let i = 0; i < 6; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.36, 5), new THREE.MeshBasicMaterial({ color: hdr(color, 1.6) }));
    const d = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]][i];
    c.position.set(d[0] * 0.38, d[1] * 0.38, d[2] * 0.38);
    c.lookAt(d[0] * 2, d[1] * 2, d[2] * 2);
    c.rotateX(Math.PI / 2);
    g.add(c);
  }
  const light = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: hdr(color, 4) }));
  light.position.y = 0.3;
  g.add(light);
  return { group: g, light };
}

export function buildDrone(color, env) {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), new THREE.MeshStandardMaterial({ color: 0x182028, metalness: 0.8, roughness: 0.25, envMap: env, emissive: hdr(color, 0.6), flatShading: true }));
  b.scale.set(1, 0.6, 1.3);
  g.add(b);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: hdr(color, 5) }));
  eye.position.z = -0.32;
  g.add(eye);
  return { group: g };
}
