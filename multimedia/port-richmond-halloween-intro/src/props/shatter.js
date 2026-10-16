// SCARE ONE glass (CAR agent): car A's curb-side rear door glass shatters inward like tempered glass at
// CUES.windowSmash (overridable). Timeline (T = smash time):
//   T - 0.03 .. T   the fist hits: crazing spreads from the impact point over the pane, the pane bulges inward;
//   T               the pane bursts into ~1 cm cubes (InstancedMesh). Most fly inward across the rear seat (fastest
//                   near the impact, some past the lens), bounce on the cushion / footwell / far door and settle;
//                   a jagged rim of crumbs stays in the frame; a few loose cubes crumble out of the rim later.
// Trajectories are closed-form (two ballistic phases + a short slide), precomputed per cube at load from a fixed
// seed: a pure function of t. Everything lives in car A's frame (glTF: +X fwd, +Y up, +Z street side) and rocks with it.
//   buildShatter(ctx, { frame, glassMesh, glassMat, quality }) -> { window, api, update(t, camera, near) }
import * as THREE from 'three';
import { CUES } from '../film/cues.js';
import { rng } from './util.js';

const G = 9.81;

function hull2(pts) { // monotone chain convex hull of [x, y]
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  up.pop(); lo.pop();
  return lo.concat(up);
}
function edgeDist(h, x, y) { // signed distance to a CCW convex polygon (>0 inside)
  let d = Infinity;
  for (let i = 0; i < h.length; i++) {
    const a = h[i], b = h[(i + 1) % h.length];
    const ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey) || 1;
    d = Math.min(d, ((x - a[0]) * ey - (y - a[1]) * ex) / -L);
  }
  return d;
}

// Glass chips: mostly see-through and dark, strong sharp speculars (the street lamps glint in them), a faint green
// edge tint. Premultiplied blend: diffuse * alpha + full specular (like carA_glass.js's medium/low glass).
function glassChipMaterial(ctx, name, map = null, glintMax = 7.0) {
  const mat = new THREE.MeshStandardMaterial({ name, color: map ? 0xffffff : 0x0b1210, map, roughness: map ? 0.05 : 0.11, metalness: 0.0, envMap: ctx.envMap, envMapIntensity: 3.5, transparent: true, depthWrite: false, side: map ? THREE.DoubleSide : THREE.FrontSide });
  mat.blending = THREE.CustomBlending;
  mat.blendSrc = THREE.OneFactor; mat.blendDst = THREE.OneMinusSrcAlphaFactor;
  mat.blendSrcAlpha = THREE.OneFactor; mat.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
  mat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
      vec3 gSpec = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
      vec3 gDiff = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
      float edgeK = 1.0 - abs(dot(normal, normalize(vViewPosition)));
      float gA = ${map ? 'clamp(0.08 + 0.5 * diffuseColor.r, 0.0, 0.7)' : '0.22 + 0.45 * edgeK * edgeK'};
      vec3 tint = vec3(0.005, 0.011, 0.008) * (0.3 + edgeK);
      // per-chip glint strength (instance colour): a few chips flash hard as they tumble through the lamp light
      float gl = ${map ? '1.0' : `(0.6 + ${glintMax.toFixed(1)} * pow(clamp(vColor.r * 0.62, 0.0, 1.0), 6.0))`};
      gl_FragColor = vec4(gDiff * gA * 0.35 + tint * gA + gSpec * ${map ? '1.4' : '2.4'} * gl, gA);`);
  };
  mat.customProgramCacheKey = () => 'carA_chip_' + (map ? 'm' : 'n') + glintMax;
  return mat;
}
// crazed tempered glass (Voronoi cells ~7 mm on a 6 cm tile): bright crack lines, dark cells
function crazeTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), img = g.createImageData(128, 128), d = img.data;
  const R = rng(515), n = 9, pts = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) pts.push([(i + 0.15 + 0.7 * R()) / n, (j + 0.15 + 0.7 * R()) / n]);
  for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
    let d1 = 9, d2 = 9;
    for (const [px, py] of pts) { const dx = x / 128 - px, dy = y / 128 - py, dd = Math.hypot(dx, dy); if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd; }
    const line = Math.max(0, 1 - (d2 - d1) / 0.012);
    const k = 0.12 + 0.88 * line;
    const i4 = (y * 128 + x) * 4;
    d[i4] = d[i4 + 1] = d[i4 + 2] = k * 255; d[i4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildShatter(ctx, { frame, glassMesh, glassMat, quality = 'high' } = {}) {
  if (!glassMesh) return null;
  frame.updateMatrixWorld(true);
  const toCar = new THREE.Matrix4().copy(frame.matrixWorld).invert().multiply(glassMesh.matrixWorld);
  const nmat = new THREE.Matrix3().getNormalMatrix(toCar);
  // pane geometry in the car frame: outward normal = toward the curb (-Z), the glass leans in at the top
  const pos = glassMesh.geometry.attributes.position, nor = glassMesh.geometry.attributes.normal;
  const vs = [];
  const c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(toCar); vs.push(v); c.add(v); }
  c.multiplyScalar(1 / vs.length);
  const nOut = new THREE.Vector3();
  for (let i = 0; i < nor.count; i++) { const n = new THREE.Vector3().fromBufferAttribute(nor, i).applyMatrix3(nmat).normalize(); if (n.z < 0) nOut.add(n); }
  nOut.normalize();
  if (nOut.lengthSq() < 0.5) nOut.set(0, 0.25, -1).normalize();
  const U = new THREE.Vector3(1, 0, 0).addScaledVector(nOut, -nOut.x).normalize();   // forward along the pane
  const V = new THREE.Vector3(0, 1, 0).addScaledVector(nOut, -nOut.y);                // up the pane
  V.addScaledVector(U, -V.dot(U)).normalize();
  const W = new THREE.Vector3().crossVectors(U, V);                                   // = inward (right-handed)
  const uv = vs.map((v) => [v.clone().sub(c).dot(U), v.clone().sub(c).dot(V)]);
  const hull = hull2(uv);
  const P = (u, v) => c.clone().addScaledVector(U, u).addScaledVector(V, v);
  const ext = (f) => uv.reduce((b, q, i) => (f(q) > f(uv[b]) ? i : b), 0);
  const corners = [ext((q) => q[0] - q[1]), ext((q) => -q[0] - q[1]), ext((q) => -q[0] + q[1]), ext((q) => q[0] + q[1])].map((i) => P(uv[i][0], uv[i][1]));
  const umin = Math.min(...uv.map((q) => q[0])), umax = Math.max(...uv.map((q) => q[0]));
  const vmin = Math.min(...uv.map((q) => q[1])), vmax = Math.max(...uv.map((q) => q[1]));
  const win = {
    center: c.toArray(), normal: nOut.toArray(), corners: corners.map((p) => p.toArray()),
    width: +(umax - umin).toFixed(3), height: +(vmax - vmin).toFixed(3),
  };
  // impact: forward-middle of the pane (the fist comes in toward the gap between the seats)
  const impUV = [umin + (umax - umin) * 0.62, vmin + (vmax - vmin) * 0.42];
  const impact = P(impUV[0], impUV[1]);
  // pane coords of the impact for the glass shader (mesh space)
  const meshInv = new THREE.Matrix4().copy(toCar).invert();
  const impLocal = impact.clone().applyMatrix4(meshInv);
  const nLocal = nOut.clone().transformDirection(meshInv);
  if (glassMat && glassMat.paneCoords) glassMat.uniforms.uImpact.value.copy(glassMat.paneCoords(impLocal, nLocal));

  // ---------------------------------------------------------------- shards
  // tempered glass: 5-10 mm cubes (pass 1b: smaller, darker, glassier per the lead's review)
  const cell = quality === 'high' ? 0.0085 : quality === 'medium' ? 0.011 : 0.017;
  const R = rng(2929);
  const inward = nOut.clone().negate();
  const shards = [];
  for (let u = umin; u < umax; u += cell) for (let v = vmin; v < vmax; v += cell) {
    const su = u + (R() - 0.5) * cell * 0.7, sv = v + (R() - 0.5) * cell * 0.7;
    const ed = edgeDist(hull, su, sv);
    if (ed < 0.002) continue;
    const p0 = P(su, sv);
    const rim = ed < 0.018 + 0.012 * R();                 // jagged rim stays in the frame
    const dI = Math.hypot(su - impUV[0], sv - impUV[1]);
    const s = { p0, size: [cell * (0.6 + 0.45 * R()), cell * (0.6 + 0.45 * R()), 0.0042], axis: new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).normalize(), w: 8 + 34 * R(), a0: R() * 6.28, rim };
    if (rim) {
      // a few rim crumbs drop out later (the arms push through: CUES.smashFace / smashGrab)
      s.t0 = R() < 0.18 ? (R() < 0.5 ? CUES.smashFace : CUES.smashGrab) - CUES.windowSmash + R() * 0.25 : Infinity;
      s.v0 = inward.clone().multiplyScalar(0.25 + 0.4 * R()).add(new THREE.Vector3(0, -0.2, 0));
    } else {
      const k = Math.exp(-dI / 0.17);
      const radial = new THREE.Vector3().addScaledVector(U, su - impUV[0]).addScaledVector(V, sv - impUV[1]).normalize();
      s.t0 = Math.min(0.03, dI * 0.04) + R() * 0.012;       // the burst propagates from the impact
      s.v0 = inward.clone().multiplyScalar(1.1 + 3.6 * k + 0.9 * R())
        .addScaledVector(radial, 0.35 + 1.1 * k)
        .add(new THREE.Vector3((R() - 0.5) * 0.8, 0.15 + (R() - 0.3) * 0.9, (R() - 0.5) * 0.4));
      if (R() < 0.08) s.v0.multiplyScalar(0.3);             // a few just drop down the door card
    }
    shards.push(s);
  }
  // surfaces (car frame): rear cushion top, footwell floor, far (street-side) door card, the door sill below the window
  const cushionY = (x, z) => (x > -1.22 && x < -0.55 && Math.abs(z) < 0.74 ? 0.575 : x > -0.55 && x < 0.15 ? 0.3 : 0.32);
  const wallZ = 0.64;
  const flight = (p, v, tMax) => { // time until it lands (or hits the far door): returns { t, wall }
    let tl = tMax;
    for (let it = 0; it < 3; it++) {
      const xs = p.x + v.x * tl;
      const zs = p.z + v.z * tl;
      const h = cushionY(xs, zs);
      const a = 0.5 * G, b = -v.y, cc = h - p.y; // p.y + v.y t - a t^2 = h
      const disc = b * b - 4 * a * cc;
      tl = disc < 0 ? 0 : (-b + Math.sqrt(disc)) / (2 * a);
    }
    let wall = false;
    if (v.z > 0 && p.z + v.z * tl > wallZ) { tl = (wallZ - p.z) / v.z; wall = true; }
    return { t: Math.max(0, tl), wall };
  };
  const at = (p, v, t, out) => out.set(p.x + v.x * t, p.y + v.y * t - 0.5 * G * t * t, p.z + v.z * t);
  for (const s of shards) {
    if (!isFinite(s.t0) && s.rim) continue;
    const A = flight(s.p0, s.v0, 1.2);
    s.tA = A.t;
    s.pA = at(s.p0, s.v0, A.t, new THREE.Vector3());
    const vA = new THREE.Vector3(s.v0.x, s.v0.y - G * A.t, s.v0.z);
    s.v1 = A.wall ? new THREE.Vector3(vA.x * 0.5, vA.y * 0.6, -vA.z * 0.25) : new THREE.Vector3(vA.x * 0.32, Math.abs(vA.y) * 0.22, vA.z * 0.32);
    const B = flight(s.pA, s.v1, 1.2);
    s.tB = B.t;
    s.pB = at(s.pA, s.v1, B.t, new THREE.Vector3());
    s.slide = new THREE.Vector3(s.v1.x, 0, Math.min(s.v1.z, Math.max(0, wallZ - s.pB.z) / 0.06)).multiplyScalar(0.06);
    s.pB.y = cushionY(s.pB.x, s.pB.z) + 0.002;
  }

  const N = shards.length;
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = glassChipMaterial(ctx, 'CarAShards', null, quality === 'low' ? 2.5 : quality === 'medium' ? 5.0 : 7.0); // big low-tier chips must not flash white
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  mesh.name = 'carA_shards';
  mesh.frustumCulled = false;
  mesh.castShadow = false; mesh.receiveShadow = false;
  mesh.renderOrder = 4;
  const col = new THREE.Color();
  for (let i = 0; i < N; i++) { const k = 0.4 + 1.2 * R() * R(); mesh.setColorAt(i, col.setRGB(k, k, k)); } // per-chip glint strength
  mesh.visible = false;
  frame.add(mesh);
  // a few larger crazed clumps still hanging in the frame (mostly the corners and the bottom edge)
  const clumpMat = glassChipMaterial(ctx, 'CarAGlassClumps', crazeTexture());
  const clumps = new THREE.Group();
  clumps.name = 'carA_glassClumps';
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 + R() * 0.5;
    // walk from the centre toward the hull along angle a, stop at the edge
    let u = 0, v = 0; const du = Math.cos(a) * 0.004, dv = Math.sin(a) * 0.004;
    while (edgeDist(hull, u + du, v + dv) > 0.0) { u += du; v += dv; }
    const w = 0.025 + 0.04 * R(), h = 0.02 + 0.035 * R();
    const g = new THREE.PlaneGeometry(w, h, 3, 3);
    const gp = g.attributes.position;
    for (let k = 0; k < gp.count; k++) gp.setZ(k, (R() - 0.5) * 0.004);          // a bent, crazed sheet
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, clumpMat);
    const back = 0.6 * Math.min(w, h);
    m.position.copy(P(u - Math.cos(a) * back, v - Math.sin(a) * back)).addScaledVector(inward, 0.002);
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(U, V, W));
    m.rotateZ(a + (R() - 0.5) * 0.6);
    m.rotateX((R() - 0.5) * 0.5);                                                       // hangs a little inward
    m.renderOrder = 4;
    clumps.add(m);
  }
  clumps.visible = false;
  frame.add(clumps);

  let T = CUES.windowSmash;
  let settledDone = false;
  const settleAge = shards.reduce((m, s) => (isFinite(s.t0) && s.tA !== undefined ? Math.max(m, s.t0 + s.tA + s.tB + 0.35) : m), 0);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pp = new THREE.Vector3(), qr = new THREE.Quaternion();
  const paneQ = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(U, V, W));
  function stateAt(t) {
    const x = t - T;
    return { craze: x < -0.03 ? 0 : Math.min(1, (x + 0.03) / 0.03), bulge: x < -0.03 ? 0 : x < 0 ? (x + 0.03) / 0.03 : 0, burst: x >= 0, age: x };
  }
  function update(t, camera, near = true) {
    const st = stateAt(t);
    if (glassMat) {
      glassMat.uniforms.uCraze.value = st.craze;
      glassMat.uniforms.uBulge.value = st.bulge * 0.018;
    }
    glassMesh.visible = !st.burst;
    mesh.visible = st.burst && near;
    clumps.visible = mesh.visible;
    if (!mesh.visible) return;
    const age = st.age;
    // once every chip has come to rest the matrices are constant: skip the per-chip work (frame-order safe: any
    // earlier time recomputes and clears the flag)
    if (age > settleAge && settledDone) return;
    settledDone = age > settleAge;
    for (let i = 0; i < N; i++) {
      const s = shards[i];
      let a = age - (s.rim ? s.t0 : s.t0);
      if (s.rim && (!isFinite(s.t0) || a < 0)) {
        pp.copy(s.p0); q.copy(paneQ); qr.setFromAxisAngle(s.axis, s.a0 * 0.08); q.multiply(qr);
      } else {
        if (a < 0) { pp.copy(s.p0); a = 0; }
        else if (a < s.tA) at(s.p0, s.v0, a, pp);
        else if (a < s.tA + s.tB) at(s.pA, s.v1, a - s.tA, pp);
        else { const d = a - s.tA - s.tB; pp.copy(s.pB).addScaledVector(s.slide, 1 - Math.exp(-d / 0.05)); }
        const spin = Math.min(a, s.tA + s.tB * 0.6) * s.w + s.a0;
        q.copy(paneQ); qr.setFromAxisAngle(s.axis, spin); q.multiply(qr);
      }
      sc.set(s.size[0], s.size[1], s.size[2]);
      m4.compose(pp, q, sc);
      mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  const api = {
    get time() { return T; },
    setTime(t0) { T = t0; settledDone = false; },
    impactPoint: impact.clone().applyMatrix4(frame.matrixWorld),
    impactLocal: impact.clone(),
    shardTimes: { craze: () => T - 0.03, burst: () => T, crumble: [CUES.smashFace, CUES.smashGrab] },
    stateAt,
    count: N,
    mesh,
  };
  return { window: win, api, update };
}
