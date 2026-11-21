// UNDERSTORM 2026 — generated surface textures with normal maps, the reflection environment,
// scenery props that dress the terrain, and the near silhouettes. Everything is built at load.
import * as THREE from '../vendor/three.module.min.js';
import { H } from './config.js?v=120';
import { G } from './models.js?v=120';

const col = (h) => new THREE.Color(h);
const hash2 = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
// value noise that tiles with period P
const tnoise = (x, y, P) => { const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), w = (a, b) => hash2(((a % P) + P) % P, ((b % P) + P) % P);
  return (w(ix, iy) * (1 - ux) + w(ix + 1, iy) * ux) * (1 - uy) + (w(ix, iy + 1) * (1 - ux) + w(ix + 1, iy + 1) * ux) * uy; };
const tfbm = (u, v, P, oct) => { let a = 0.5, s = 0, f = P; for (let i = 0; i < oct; i++) { s += a * tnoise(u * f, v * f, f); f *= 2; a *= 0.5; } return s; };

function toTex(n, fill, srgb) { const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'), im = x.createImageData(n, n); fill(im.data); x.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; }

// kind: 'panel' (riveted plate), 'rock' (ridged strata) or 'facet' (crystal cells). Returns { map, normalMap }.
export function surface(kind, n = 384) {
  const h = new Float32Array(n * n), a = new Float32Array(n * n);
  if (kind === 'panel') {
    const cells = 4;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const u = x / n, v = y / n, row = Math.floor(v * cells), off = (row % 2) * 0.5, cu = (u * cells + off) % cells, px = cu - Math.floor(cu), py = v * cells - row, id = hash2(Math.floor(cu) + 3, row + 7);
      const edge = Math.min(px, 1 - px, py, 1 - py), seam = Math.min(1, edge / 0.035), rx = Math.min(px, 1 - px) - 0.1, ry = Math.min(py, 1 - py) - 0.1, rivet = Math.max(0, 1 - Math.hypot(rx, ry) / 0.035);
      const sub = id > 0.6 ? Math.min(1, Math.abs(py - 0.5) / 0.02) : 1, wear = tfbm(u, v, 6, 5), streak = tfbm(u * 6, v * 0.6, 8, 3);
      h[y * n + x] = seam * 0.7 * (0.85 + 0.15 * sub) + rivet * 0.35 + id * 0.12 + wear * 0.12;
      a[y * n + x] = (0.5 + id * 0.28) * (0.6 + 0.4 * seam) * (0.8 + 0.2 * sub) * (0.72 + 0.4 * wear) * (1 - Math.max(0, streak - 0.55) * 1.3) + rivet * 0.12; }
  } else if (kind === 'rock') {
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const u = x / n, v = y / n, w1 = tfbm(u, v, 4, 5), ridge = 1 - Math.abs(2 * tfbm(u + w1 * 0.2, v, 5, 5) - 1), strata = 0.5 + 0.5 * Math.sin((v + w1 * 0.25) * 6.2832 * 9), crack = Math.pow(1 - Math.abs(2 * tfbm(u, v + 0.3, 7, 4) - 1), 14);
      h[y * n + x] = ridge * 0.6 + strata * 0.12 + w1 * 0.3 - crack * 0.2; a[y * n + x] = (0.46 + ridge * 0.24 + strata * 0.05 + w1 * 0.2) * (1 - crack * 0.1); }
  } else {
    const C = 7, pts = []; for (let j = 0; j < C; j++) for (let i = 0; i < C; i++) pts.push([(i + hash2(i, j)) / C, (j + hash2(i + 9, j + 4)) / C, hash2(i + 2, j + 13)]);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const u = x / n, v = y / n; let d1 = 9, d2 = 9, id = 0, gx = 0, gy = 0;
      for (const p of pts) { let dx = Math.abs(u - p[0]), dy = Math.abs(v - p[1]); const sx = dx > 0.5 ? -1 : 1, sy = dy > 0.5 ? -1 : 1; if (dx > 0.5) dx = 1 - dx; if (dy > 0.5) dy = 1 - dy; const d = dx * dx + dy * dy; if (d < d1) { d2 = d1; d1 = d; id = p[2]; gx = (u - p[0]) * sx; gy = (v - p[1]) * sy; } else if (d < d2) d2 = d; }
      const edge = Math.sqrt(d2) - Math.sqrt(d1), tilt = gx * (id - 0.5) * 9 + gy * (0.5 - id) * 7; h[y * n + x] = Math.min(1, edge * 14) * 0.7 + tilt * 0.6 + id * 0.3; a[y * n + x] = 0.42 + id * 0.4 + Math.min(1, edge * 16) * 0.16 + tilt * 0.3; }
  }
  const str = kind === 'facet' ? 3.2 : kind === 'rock' ? 5 : 4;
  const map = toTex(n, (d) => { for (let i = 0; i < n * n; i++) { const v = Math.max(0, Math.min(255, a[i] * 255)); d[i * 4] = v; d[i * 4 + 1] = v; d[i * 4 + 2] = v; d[i * 4 + 3] = 255; } }, true);
  const normalMap = toTex(n, (d) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const l = h[y * n + ((x + n - 1) % n)], r = h[y * n + ((x + 1) % n)], up = h[((y + n - 1) % n) * n + x], dn = h[((y + 1) % n) * n + x]; let nx = (l - r) * str, ny = (dn - up) * str, nz = 1; const m = Math.hypot(nx, ny, nz), i = (y * n + x) * 4; d[i] = (nx / m * 0.5 + 0.5) * 255; d[i + 1] = (ny / m * 0.5 + 0.5) * 255; d[i + 2] = (nz / m * 0.5 + 0.5) * 255; d[i + 3] = 255; } }, false);
  return { map, normalMap };
}

// A small sky the metal and glass can reflect: gradient, a hot spot where the light comes from, a cool rim.
export function makeEnv(renderer, P, dark) {
  const pm = new THREE.PMREMGenerator(renderer), sc = new THREE.Scene(), geo = new THREE.SphereGeometry(40, 32, 16);
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { a: { value: col(P.sky0) }, b: { value: col(P.sky1) }, c: { value: col(P.cl) }, k: { value: col(P.key) }, r: { value: col(P.rim) }, g: { value: dark ? 0.25 : 1 } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec3 vP; uniform vec3 a, b, c, k, r; uniform float g; void main(){ float h = vP.y * 0.5 + 0.5; vec3 col = mix(b, a, smoothstep(0.15, 0.9, h)); col += c * 0.7 * exp(-pow((h - 0.45) * 4.0, 2.0)); col += k * 4.0 * pow(max(dot(vP, normalize(vec3(-0.5, 0.8, 0.7))), 0.0), 20.0); col += r * 1.6 * pow(max(dot(vP, normalize(vec3(0.6, -0.3, -0.6))), 0.0), 5.0); col *= 0.55 + 0.45 * sin(vP.x * 9.0 + vP.y * 5.0) * sin(vP.z * 7.0) * 0.5 + 0.25; gl_FragColor = vec4(col * g, 1.0); }' });
  sc.add(new THREE.Mesh(geo, mat)); const rt = pm.fromScene(sc, 0.03); pm.dispose(); geo.dispose(); mat.dispose(); return rt;
}

// Props standing on the terrain just behind the play plane. Kept short so they never read as obstacles.
export function decorate(st, P, family, dens) {
  const grp = new THREE.Group(); grp.userData.lamps = []; grp.userData.mats = []; if (st.terr === 'none') return grp;
  const base = new THREE.MeshStandardMaterial({ color: col(P.tb).lerp(col(P.ta), 0.55), metalness: family === 'ind' ? 0.75 : 0.2, roughness: family === 'ind' ? 0.45 : 0.8, flatShading: family !== 'ind' });
  const glow = new THREE.MeshBasicMaterial({ color: col(P.glow).multiplyScalar(2.2) }), warn = new THREE.MeshBasicMaterial({ color: col(P.rim).multiplyScalar(2.4) });
  const cry = new THREE.MeshStandardMaterial({ color: col(P.ta), metalness: 0.2, roughness: 0.08, emissive: col(P.glow), emissiveIntensity: 0.3, flatShading: true, transparent: true, opacity: 0.86 });
  const L = { box: [G.box, base, []], cyl: [G.cyl, base, []], cone: [G.cone, base, []], ico: [G.ico, base, []], gbox: [G.box, glow, []], gsph: [G.sph, glow, []], wsph: [G.sph, warn, []], oct: [G.oct, cry, []] };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3();
  const put = (k, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) => { E.set(rx, ry, rz); Q.setFromEuler(E); M.compose(V.set(x, y, z), Q, S.set(sx, sy, sz)); L[k][2].push(M.clone()); };
  let seed = st.idx * 131 + 17; const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const lamps = [];
  for (const sign of [1, -1]) { const at = sign > 0 ? st.floorAt : st.ceilAt, fl = sign > 0 ? 0 : Math.PI;
    for (let x = 3; x < st.len; x += (1.5 + R() * 2.6) / dens) { const y0 = at(x); if (sign > 0 ? y0 < -0.5 : y0 > H + 0.5) continue; const z = -0.5 - R() * 1.9, y = y0 + sign * 0.15, r = R(), s = 0.6 + R() * 0.7;
      if (family === 'ind') {
        if (r < 0.22) { const hh = 0.5 + R() * 0.8; put('cyl', x, y + sign * hh / 2, z, 0.05, hh, 0.05); put('gbox', x, y + sign * hh, z, 0.16, 0.07, 0.16); lamps.push(x, y + sign * hh, z); }
        else if (r < 0.48) { const len = 1.6 + R() * 3; put('cyl', x, y + sign * 0.16, z, 0.13, len, 0.13, 0, 0, Math.PI / 2); put('cyl', x - len / 2, y + sign * 0.16, z, 0.17, 0.12, 0.17, 0, 0, Math.PI / 2); put('cyl', x + len / 2, y + sign * 0.16, z, 0.17, 0.12, 0.17, 0, 0, Math.PI / 2); }
        else if (r < 0.66) { put('cyl', x, y + sign * 0.3 * s, z, 0.42 * s, 0.6 * s, 0.42 * s); put('cyl', x, y + sign * 0.62 * s, z, 0.3 * s, 0.08, 0.3 * s); }
        else if (r < 0.8) { const hh = 0.9 + R() * 0.7; put('cyl', x, y + sign * hh / 2, z, 0.025, hh, 0.025); put('wsph', x, y + sign * hh, z, 0.05, 0.05, 0.05); }
        else { put('box', x, y + sign * 0.2 * s, z, 0.9 * s, 0.4 * s, 0.7 * s); put('gbox', x, y + sign * 0.2 * s, z + 0.36 * s, 0.5 * s, 0.05, 0.02); }
      } else if (family === 'rock') {
        if (r < 0.5) { const hh = 0.5 + R() * 1.1; put('cone', x, y + sign * hh / 2, z, 0.14 + R() * 0.22, hh, 0.14 + R() * 0.22, fl, R() * 3, (R() - 0.5) * 0.3); }
        else if (r < 0.8) put('ico', x, y + sign * 0.12, z, 0.3 * s + 0.2, 0.22 * s + 0.1, 0.3 * s + 0.2, R() * 3, R() * 3, 0);
        else { for (let k = 0; k < 3; k++) put('gsph', x + (R() - 0.5) * 0.6, y + sign * (0.06 + R() * 0.1), z + (R() - 0.5) * 0.5, 0.05, 0.05, 0.05); lamps.push(x, y + sign * 0.1, z); }
      } else { const n = 2 + (R() * 2 | 0); for (let k = 0; k < n; k++) { const hh = 0.5 + R() * 1.0; put('oct', x + (R() - 0.5) * 0.5, y + sign * hh * 0.4, z + (R() - 0.5) * 0.4, 0.13 + R() * 0.14, hh, 0.13 + R() * 0.14, (R() - 0.5) * 0.7, R() * 3, (R() - 0.5) * 0.8); } if (r < 0.3) lamps.push(x, y + sign * 0.4, z); }
    } }
  for (const k in L) { const [geo, mat, list] = L[k]; if (!list.length) continue; const im = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((m, i) => im.setMatrixAt(i, m)); im.frustumCulled = false; im.castShadow = mat === base; im.receiveShadow = mat === base; grp.add(im); }
  grp.userData.lamps = lamps; grp.userData.mats = [base, glow, warn, cry];
  return grp;
}

// Dark shapes sliding past close to the camera at the very top and bottom of the frame.
export function foreground(st, P, family) {
  const grp = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ color: col(P.cs).multiplyScalar(0.35), fog: false }), list = { box: [], ico: [], oct: [] };
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3(); let seed = st.idx * 71 + 3; const R = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const put = (k, x, y, z, sx, sy, sz, rz) => { E.set(0, 0, rz); Q.setFromEuler(E); M.compose(V.set(x, y, z), Q, S.set(sx, sy, sz)); list[k].push(M.clone()); };
  for (let i = 0; i < 9; i++) { const x = i * 13 + R() * 8, top = R() < 0.5, y = top ? 19.2 + R() * 0.8 : -1.2 - R() * 0.8, z = 7 + R() * 3;
    if (family === 'ind') { put('box', x, y, z, 5 + R() * 6, 0.5 + R() * 0.5, 0.4, (R() - 0.5) * 0.25); put('box', x + 1, y + (top ? -0.6 : 0.6), z, 0.3, 1.6, 0.3, (R() - 0.5) * 0.5); }
    else if (family === 'rock') put('ico', x, y, z, 2 + R() * 3, 1 + R() * 0.8, 1, R() * 3);
    else put('oct', x, y, z, 0.7 + R() * 0.8, 2 + R() * 1.6, 0.7, (R() - 0.5) * 1.2 + (top ? Math.PI : 0)); }
  const geo = { box: G.box, ico: G.ico, oct: G.oct };
  for (const k in list) { if (!list[k].length) continue; const im = new THREE.InstancedMesh(geo[k], mat, list[k].length); list[k].forEach((m, i) => im.setMatrixAt(i, m)); im.frustumCulled = false; grp.add(im); }
  grp.userData.mats = [mat]; grp.userData.len = 117;
  return grp;
}
