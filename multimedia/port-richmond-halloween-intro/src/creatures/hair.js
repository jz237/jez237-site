// Hair for the infected, skinned to the character's own skeleton so it follows every head move exactly.
// Deterministic (seeded rng only); all geometry is built once at load (no per-frame CPU work).
//  - addHair(): long wet hair as clumped locks. Clump guides grow from the scalp with combing + gravity and
//    collide with the head (radial shell map), the face keep-out, and the shoulders / robe collar (height field).
//    Child cards converge toward each clump tip (wet, pointy locks); a few locks are plastered onto the
//    forehead/cheek and neck; a dark shell cap (addBuzz) under the locks hides the scalp (no bald read).
//  - addBuzz(): shells over the scalp with a procedural strand pattern in bind space (buzz cuts / stubble), or
//    with style.flat a matted, flattened, combed mat (short wet hair lying flat in clumps).
import * as THREE from 'three';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const D2R = Math.PI / 180;
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const DEBUG = typeof location !== 'undefined' && /[?&]hairdebug=1/.test(location.search);

// the skinned body part that carries the head (most vertices bound to the head bone; GLB primitives split
// the body by material, so the largest mesh is not always the one with the head)
function largestSkinned(actorRoot) {
  let body = null, best = -1;
  actorRoot.traverse((o) => {
    if (!o.isSkinnedMesh || /^Hair/.test(o.name) || /eye|teeth|gum|tongue|cavity|cloth/i.test(o.name)) return;
    const hi = o.skeleton.bones.findIndex((b) => b.name === 'head');
    const g = o.geometry, n = g.attributes.position.count;
    let cnt = 0;
    if (hi >= 0 && g.attributes.skinIndex) { const hw = headWeightFn(g, hi); for (let i = 0; i < n; i++) if (hw(i) > 0.9) cnt++; }
    const score = cnt * 1e7 + n;
    if (score > best) { best = score; body = o; }
  });
  return body;
}
function headWeightFn(geo, headIdx) {
  const si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight;
  if (!si || !sw) return () => 0;
  return (i) => { let w = 0; for (let k = 0; k < 4; k++) if (si.getComponent(i, k) === headIdx) w += sw.getComponent(i, k); return w; };
}
// head frame from the vertices bound (almost) entirely to the head bone, so rebuilt GLBs keep working
function headFrame(body, headIdx) {
  const pos = body.geometry.attributes.position;
  const headW = headWeightFn(body.geometry, headIdx);
  const bb = new THREE.Box3(), p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) if (headW(i) > 0.9) bb.expandByPoint(p.fromBufferAttribute(pos, i));
  if (bb.isEmpty()) return null;
  const c = bb.getCenter(new THREE.Vector3());
  const half = bb.getSize(new THREE.Vector3()).multiplyScalar(0.5);
  c.y += half.y * 0.12; // the cranium's centre sits above the head bounds' centre (jaw included in the bounds)
  return { bb, c, half, headW };
}
// minimum elevation of the hairline as a function of azimuth (0 = straight ahead), degrees
function elMin(azDeg) {
  const a = Math.abs(azDeg);
  const T = [[0, 40], [35, 34], [62, 16], [82, 2], [100, -4], [125, -22], [180, -40]];
  for (let k = 1; k < T.length; k++) if (a <= T[k][0]) { const f = (a - T[k - 1][0]) / (T[k][0] - T[k - 1][0]); return T[k - 1][1] + f * (T[k][1] - T[k - 1][1]); }
  return -40;
}
// scalp mask for a bind-space offset from the cranium centre: 1 inside the hairline, 0 on face / ears
function scalpMask(d, half, earClear = 1, drop = 0) {
  const dn = new THREE.Vector3(d.x / half.x, d.y / half.y, d.z / half.z);
  const L = dn.length();
  if (L < 1e-6) return { m: 0, az: 0, el: 0 };
  const el = Math.asin(Math.max(-1, Math.min(1, dn.y / L))) / D2R;
  const az = Math.atan2(dn.x, dn.z) / D2R;
  const e0 = elMin(az) - drop * (1 - ss(45, 95, Math.abs(az)));
  let m = ss(e0 - 5, e0 + 5, el);
  const ear = Math.hypot((Math.abs(az) - 92) / 22, (el + 12) / 17);
  m *= 1 - earClear * (1 - ss(0.85, 1.25, ear));
  return { m, az, el, L };
}

// ---------------------------------------------------------------------------------------------------------
// Shells. style: { buzz: true, color, height (m), shells, density, cell, seed,
//   flat: lean factor (strands lie along a combed flow), clump (m), strand (m), tint (blood) , gloss }
export function addBuzz(actorRoot, style = {}) {
  const body = largestSkinned(actorRoot);
  if (!body) return null;
  const skel = body.skeleton;
  const headIdx = skel.bones.findIndex((b) => b.name === 'head');
  if (headIdx < 0) return null;
  const G = body.geometry;
  const pos = G.attributes.position, nrm = G.attributes.normal, si = G.attributes.skinIndex, sw = G.attributes.skinWeight;
  const F = headFrame(body, headIdx);
  if (!F) return null;
  const { c, half, headW } = F;
  const p = new THREE.Vector3();
  const earClear = style.earClear ?? 1;
  const mask = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const d = p.clone().sub(c);
    const dn = new THREE.Vector3(d.x / half.x, d.y / half.y, d.z / half.z);
    if (dn.length() < 0.5) continue;
    let { m } = scalpMask(d, half, earClear, style.hairline ?? 0);
    m *= ss(0.55, 0.85, headW(i) + (d.y > 0 ? 1 : 0)); // nothing on the neck below the head
    if (style.cap) m = ss(0.35, 0.6, m); // a cap under long locks ends on a crisp line hidden by the lock roots
    mask[i] = m;
  }
  const idx = G.index ? G.index.array : null;
  const triCount = idx ? idx.length / 3 : pos.count / 3;
  const keep = [];
  for (let t = 0; t < triCount; t++) {
    const a = idx ? idx[t * 3] : t * 3, b = idx ? idx[t * 3 + 1] : t * 3 + 1, e = idx ? idx[t * 3 + 2] : t * 3 + 2;
    if (mask[a] + mask[b] + mask[e] > 0.02) keep.push(a, b, e);
  }
  const remap = new Map();
  const verts = [];
  for (const v of keep) if (!remap.has(v)) { remap.set(v, verts.length); verts.push(v); }
  const flat = style.flat || 0;
  const N = style.shells ?? 7;
  const H = style.height ?? 0.0042;
  const nv = verts.length;
  const P = new Float32Array(nv * N * 3), NR = new Float32Array(nv * N * 3), SI = new Uint16Array(nv * N * 4), SW = new Float32Array(nv * N * 4);
  const SH = new Float32Array(nv * N), MK = new Float32Array(nv * N);
  const FL = flat ? new Float32Array(nv * N * 3) : null, SD = flat ? new Float32Array(nv * N * 3) : null;
  const n = new THREE.Vector3(), fl = new THREE.Vector3(), sd = new THREE.Vector3();
  for (let s = 0; s < N; s++) {
    const f = s / (N - 1);
    const h = 0.0004 + f * H;
    for (let j = 0; j < nv; j++) {
      const v = verts[j], o = s * nv + j;
      p.fromBufferAttribute(pos, v); n.fromBufferAttribute(nrm, v).normalize();
      if (flat) {
        // combed flow: back and down over the skull, swept off the forehead; a slow swirl breaks the regularity
        const d = p.clone().sub(c);
        fl.set(Math.sin(d.y * 60 + d.z * 40) * 0.35 + Math.sign(d.x) * 0.25, -0.65, -0.9 + Math.sin(d.x * 70) * 0.25);
        fl.addScaledVector(n, -fl.dot(n));
        if (fl.lengthSq() < 1e-6) fl.set(0, 0, -1).addScaledVector(n, -n.z);
        fl.normalize();
        sd.crossVectors(n, fl).normalize();
        FL[o * 3] = fl.x; FL[o * 3 + 1] = fl.y; FL[o * 3 + 2] = fl.z;
        SD[o * 3] = sd.x; SD[o * 3 + 1] = sd.y; SD[o * 3 + 2] = sd.z;
      }
      p.addScaledVector(n, h * (flat ? (0.35 + 0.65 * mask[v]) : 1));
      P[o * 3] = p.x; P[o * 3 + 1] = p.y; P[o * 3 + 2] = p.z;
      NR[o * 3] = n.x; NR[o * 3 + 1] = n.y; NR[o * 3 + 2] = n.z;
      for (let k = 0; k < 4; k++) { SI[o * 4 + k] = si.getComponent(v, k); SW[o * 4 + k] = sw.getComponent(v, k); }
      SH[o] = f; MK[o] = mask[v];
    }
  }
  const I = new Uint32Array(keep.length * N);
  for (let s = 0; s < N; s++) for (let k = 0; k < keep.length; k++) I[s * keep.length + k] = s * nv + remap.get(keep[k]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(NR, 3));
  g.setAttribute('skinIndex', new THREE.BufferAttribute(SI, 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(SW, 4));
  g.setAttribute('shell', new THREE.BufferAttribute(SH, 1));
  g.setAttribute('hmask', new THREE.BufferAttribute(MK, 1));
  if (flat) { g.setAttribute('hflow', new THREE.BufferAttribute(FL, 3)); g.setAttribute('hside', new THREE.BufferAttribute(SD, 3)); }
  g.setIndex(new THREE.BufferAttribute(I, 1));
  const mat = flat
    ? new THREE.MeshPhysicalMaterial({ color: style.color ?? 0x1d1a18, roughness: style.roughness ?? 0.42, metalness: 0, clearcoat: style.gloss ?? 0.5, clearcoatRoughness: 0.22, specularIntensity: 0.7 })
    : new THREE.MeshPhysicalMaterial({ color: style.color ?? 0x2a2622, roughness: style.roughness ?? 0.85, metalness: 0, specularIntensity: style.spec ?? 0.35 });
  const density = style.density ?? 0.62;
  const freq = 1 / (style.cell ?? 0.00085);
  const tint = new THREE.Color(style.tint ?? 0x3a0a06);
  const glsl = (x) => x.toFixed(4);
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nattribute float shell;\nattribute float hmask;\nvarying float vShell;\nvarying float vMask;\nvarying vec3 vBind;${flat ? '\nattribute vec3 hflow;\nattribute vec3 hside;\nvarying vec3 vFlow;\nvarying vec3 vSideB;\nvarying vec3 vSideV;\nvarying vec3 vFlowV;' : ''}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvShell = shell; vMask = hmask; vBind = position;${flat ? '\nvFlow = hflow; vSideB = hside;' : ''}`);
    if (flat) {
      sh.vertexShader = sh.vertexShader.replace('#include <defaultnormal_vertex>', `#include <defaultnormal_vertex>
      {
        vec3 hs = hside, hf = hflow;
        #ifdef USE_SKINNING
          hs = ( skinMatrix * vec4( hs, 0.0 ) ).xyz;
          hf = ( skinMatrix * vec4( hf, 0.0 ) ).xyz;
        #endif
        vSideV = normalize( normalMatrix * hs );
        vFlowV = normalize( normalMatrix * hf );
      }`);
    }
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying float vShell;
varying float vMask;
varying vec3 vBind;
${flat ? 'varying vec3 vFlow;\nvarying vec3 vSideB;\nvarying vec3 vSideV;\nvarying vec3 vFlowV;' : ''}
float bhash(vec3 q) { q = fract(q * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yxz + 33.33); return fract((q.x + q.y) * q.z); }`);
    if (!flat) {
      sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      {
        // one hair per bind-space cell: present with probability density*mask, a random length, and a section
        // that narrows toward the tip; the innermost shell is a dense root layer that greys the scalp
        vec3 q = vBind * ${freq.toFixed(1)};
        vec3 cell = floor(q);
        float pres = bhash(cell);
        float len = 0.45 + 0.55 * bhash(cell + 17.3);
        vec3 ctr = vec3(bhash(cell + 3.1), bhash(cell + 7.7), bhash(cell + 11.9));
        float dist = length(fract(q) - ctr);
        float rad = 0.62 * (1.0 - 0.55 * vShell);
        bool root = vShell < 0.01;
        if (root) { if (bhash(floor(vBind * ${(freq * 2.0).toFixed(1)}) + 5.0) > vMask * ${(style.rootCover ?? 0.8).toFixed(2)}) discard; }
        else if (pres > ${density.toFixed(3)} * vMask || vShell > len || dist > rad) discard;
        diffuseColor.rgb *= root ? 0.62 : mix(0.7, 1.15, vShell) * (0.8 + 0.4 * bhash(cell + 29.0));
      }`);
    } else {
      const clumpW = style.clump ?? 0.006, strandW = style.strand ?? 0.0009, lean = flat * H;
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <color_fragment>', `#include <color_fragment>
      float hPert = 0.0, hTiltS = 0.0, hTiltF = 0.0;
      {
        // matted wet mat: strands are stripes along the combed flow, grouped in clumps (bands across the flow,
        // broken into shingles along it); each clump has its own thickness, the upper shells keep fewer and
        // narrower strands, and the shingle boundaries shift with height so the clumps read as lying flat
        vec3 Fd = normalize(vFlow), Sd = normalize(vSideB);
        float a = dot(vBind, Fd) - vShell * ${glsl(lean)};
        float b = dot(vBind, Sd);
        float cb = floor(b / ${glsl(clumpW)});
        float ca = floor(a / ${glsl(clumpW * 2.6)} + bhash(vec3(cb, 1.7, 3.1)) * 7.0);
        float cid = bhash(vec3(cb, ca, 7.3));
        float cf = fract(b / ${glsl(clumpW)});
        float fa = fract(a / ${glsl(clumpW * 2.6)});
        // wet clumps are solid lumps (strands stuck together): round cross-section, tapered shingle ends
        float clumpH = (0.45 + 0.55 * cid) * sqrt(max(0.0, 1.0 - pow(abs(cf - 0.5) * 2.0, 2.0))) * (0.55 + 0.45 * smoothstep(0.0, 0.35, fa));
        float sb = b / ${glsl(strandW)};
        float sid = floor(sb);
        float sf = fract(sb);
        float sr = bhash(vec3(sid, ca, 2.2));
        float w = 0.5 * (1.0 - 0.6 * vShell);
        bool root = vShell < 0.01;
        if (root) { if (bhash(floor(vBind * ${(freq * 2.0).toFixed(1)}) + 5.0) > vMask * 0.97) discard; }
        else if (vShell > clumpH * vMask || (vShell < 0.3 && sr > ${density.toFixed(3)} && abs(sf - 0.5) > w)) discard;
        float shade = root ? 0.55 : mix(0.75, 1.2, vShell) * (0.75 + 0.5 * bhash(vec3(sid, ca, 9.1))) * (0.8 + 0.4 * cid);
        diffuseColor.rgb *= shade;
        float blood = smoothstep(0.55, 0.95, bhash(vec3(cb, ca, 4.4))) * ${(style.blood ?? 0.6).toFixed(2)};
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(${tint.r.toFixed(4)}, ${tint.g.toFixed(4)}, ${tint.b.toFixed(4)}), blood);
        hPert = root ? 0.0 : (sf - 0.5) * 2.0 * w * 1.6;
        // each matted clump is a lump with its own tilt (breaks the smooth bald-dome highlight)
        hTiltS = root ? 0.0 : (bhash(vec3(cb, ca, 5.5)) - 0.5) * 0.9 + (cf - 0.5) * 0.8;
        hTiltF = root ? 0.0 : (bhash(vec3(cb, ca, 6.6)) - 0.5) * 0.9 + (fa - 0.5) * 0.6;
      }`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      normal = normalize( normal + ( vSideV * ( hPert + hTiltS ) + vFlowV * hTiltF ) * faceDirection );`);
    }
  };
  mat.customProgramCacheKey = () => `hairshell-${flat}-${density}-${freq}-${H}-${style.clump}-${style.strand}-${style.rootCover}`;
  const buzz = new THREE.SkinnedMesh(g, mat);
  buzz.name = style.cap ? 'HairCap' : 'HairBuzz';
  buzz.frustumCulled = false;
  buzz.castShadow = false;
  buzz.receiveShadow = true;
  body.parent.add(buzz);
  buzz.bind(skel, body.bindMatrix);
  if (DEBUG) console.log('[hair] shells', buzz.name, 'verts', P.length / 3, 'tris', I.length / 3);
  return buzz;
}

// ---------------------------------------------------------------------------------------------------------
// Lock texture (RGBA, linear): alpha = a cohesive wet lock with a pointy tip and a few separated edge hairs;
// rgb = fine striations with salt-and-pepper brightness. v = 0 at the root, 1 at the tip.
let _lockTex = null;
function lockTexture() {
  if (_lockTex) return _lockTex;
  const W = 64, H = 256;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const img = g.createImageData(W, H);
  const r = rng(99);
  const col = new Float32Array(W), drift = new Float32Array(W);
  for (let x = 0; x < W; x++) { const salt = r() < 0.3; col[x] = salt ? 0.9 + 0.1 * r() : 0.22 + 0.45 * r(); if (r() < 0.18) col[x] *= 0.35; drift[x] = (r() - 0.5) * 3; }
  // separated edge hairs: [u, width(px), length(v)]
  const edge = [];
  for (let k = 0; k < 5; k++) edge.push([r() < 0.5 ? 0.06 + r() * 0.12 : 0.82 + r() * 0.12, 0.8 + r() * 0.9, 0.55 + r() * 0.45, (r() - 0.5) * 6]);
  for (let y = 0; y < H; y++) {
    const v = 1 - y / (H - 1);
    const hw = 0.36 * (1 - 0.88 * ss(0.45, 1.0, v)) + 0.015; // core half width (pointy tip)
    const wob = Math.sin(v * 9.0) * 0.02;
    for (let x = 0; x < W; x++) {
      const u = (x + 0.5) / W;
      const du = Math.abs(u - 0.5 - wob);
      let a = 1 - ss(hw - 0.07, hw, du);
      for (const [eu, ew, el, ed] of edge) {
        if (v > el) continue;
        const cx = eu * W + ed * v;
        a = Math.max(a, (1 - ss(ew * 0.5, ew * 0.5 + 1, Math.abs(x + 0.5 - cx))) * (1 - ss(el - 0.12, el, v)) * 0.95);
      }
      const xi = Math.min(W - 1, Math.max(0, Math.round(x + drift[x] * v)));
      const L = col[xi] * (0.85 + 0.15 * Math.sin(y * 0.11 + x));
      const o = (y * W + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = Math.round(255 * Math.min(1, L));
      img.data[o + 3] = Math.round(255 * a);
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.anisotropy = 4;
  _lockTex = t;
  return t;
}

// head shell as max radius per (azimuth, elevation) bin around the cranium centre (star-shaped collision)
function radialMap(body, F) {
  const AZ = 96, EL = 48;
  const m = new Float32Array(AZ * EL);
  const pos = body.geometry.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    if (F.headW(i) < 0.5) continue;
    p.fromBufferAttribute(pos, i).sub(F.c);
    const r = p.length(); if (r < 1e-5) continue;
    const ia = Math.floor((Math.atan2(p.x, p.z) + Math.PI) / (2 * Math.PI) * AZ) % AZ;
    const ie = Math.min(EL - 1, Math.max(0, Math.floor((Math.asin(p.y / r) + Math.PI / 2) / Math.PI * EL)));
    m[ie * AZ + ia] = Math.max(m[ie * AZ + ia], r);
  }
  for (let pass = 0; pass < 6; pass++) {
    const src = m.slice();
    for (let e = 0; e < EL; e++) for (let a = 0; a < AZ; a++) {
      if (src[e * AZ + a] > 0) continue;
      let mx = 0;
      for (let de = -1; de <= 1; de++) for (let da = -1; da <= 1; da++) { const ee = e + de; if (ee < 0 || ee >= EL) continue; mx = Math.max(mx, src[ee * AZ + (a + da + AZ) % AZ]); }
      m[e * AZ + a] = mx;
    }
  }
  const md = new Float32Array(m.length);
  for (let e = 0; e < EL; e++) for (let a = 0; a < AZ; a++) {
    let mx = 0;
    let sum = 0;
    for (let de = -1; de <= 1; de++) for (let da = -1; da <= 1; da++) { const ee = Math.min(EL - 1, Math.max(0, e + de)); const v = m[ee * AZ + (a + da + AZ) % AZ]; sum += v; mx = Math.max(mx, v); }
    md[e * AZ + a] = Math.max(m[e * AZ + a], 0.5 * (sum / 9 + mx));
  }
  return (d) => {
    const r = d.length(); if (r < 1e-6) return 0;
    const fa = (Math.atan2(d.x, d.z) + Math.PI) / (2 * Math.PI) * AZ - 0.5;
    const fe = Math.min(EL - 1.001, Math.max(0, (Math.asin(Math.max(-1, Math.min(1, d.y / r))) + Math.PI / 2) / Math.PI * EL - 0.5));
    const a0 = Math.floor(fa), e0 = Math.floor(fe), ta = fa - a0, te = fe - e0;
    const A0 = (a0 + AZ) % AZ, A1 = (a0 + 1 + AZ) % AZ, E1 = Math.min(EL - 1, e0 + 1);
    return (md[e0 * AZ + A0] * (1 - ta) + md[e0 * AZ + A1] * ta) * (1 - te) + (md[E1 * AZ + A0] * (1 - ta) + md[E1 * AZ + A1] * ta) * te;
  };
}

// top surface of shoulders / collar / back / neck (everything not bound to the head) as a height field
function torsoField(actorRoot, headIdx, F) {
  const S = 0.01, NX = 80, NZ = 80, x0 = F.c.x - 0.4, z0 = F.c.z - 0.4;
  const h = new Float32Array(NX * NZ).fill(-1e3);
  const yTop = F.bb.min.y + 0.03, yBot = F.c.y - 0.85;
  actorRoot.traverse((o) => {
    if (!o.isSkinnedMesh || /^Hair/.test(o.name) || /eye|teeth|gum|tongue|cavity/i.test(o.name)) return;
    const g = o.geometry, pos = g.attributes.position;
    const hw = headWeightFn(g, headIdx);
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i); if (y > yTop || y < yBot) continue;
      if (hw(i) > 0.5) continue;
      const ix = Math.floor((pos.getX(i) - x0) / S), iz = Math.floor((pos.getZ(i) - z0) / S);
      if (ix < 0 || iz < 0 || ix >= NX || iz >= NZ) continue;
      if (y > h[iz * NX + ix]) h[iz * NX + ix] = y;
    }
  });
  {
    const ax = (F.c.x - x0) / S, az = (F.c.z - 0.025 - z0) / S;
    const src = h.slice();
    for (let z = 0; z < NZ; z++) for (let x = 0; x < NX; x++) {
      const dx = x + 0.5 - ax, dz = z + 0.5 - az, dl = Math.hypot(dx, dz);
      if (dl < 4) continue; // the neck itself
      let mx = src[z * NX + x];
      for (let k = 1; k < 30; k++) {
        const xx = Math.floor(x + 0.5 + dx / dl * k), zz = Math.floor(z + 0.5 + dz / dl * k);
        if (xx < 0 || zz < 0 || xx >= NX || zz >= NZ) break;
        mx = Math.max(mx, src[zz * NX + xx]);
      }
      h[z * NX + x] = mx;
    }
  }
  const hd = new Float32Array(h.length);
  for (let z = 0; z < NZ; z++) for (let x = 0; x < NX; x++) {
    let mx = -1e3;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, zz = z + dz; if (xx < 0 || zz < 0 || xx >= NX || zz >= NZ) continue; mx = Math.max(mx, h[zz * NX + xx]); }
    hd[z * NX + x] = mx;
  }
  const at = (x, z) => {
    const fx = (x - x0) / S - 0.5, fz = (z - z0) / S - 0.5;
    const ix = Math.max(0, Math.min(NX - 2, Math.floor(fx))), iz = Math.max(0, Math.min(NZ - 2, Math.floor(fz)));
    const tx = Math.min(1, Math.max(0, fx - ix)), tz = Math.min(1, Math.max(0, fz - iz));
    const a = hd[iz * NX + ix], b = hd[iz * NX + ix + 1], c = hd[(iz + 1) * NX + ix], d = hd[(iz + 1) * NX + ix + 1];
    // treat empty cells as the floor so the bilinear blend never lifts a strand onto air
    if (Math.min(a, b, c, d) < -100) return Math.max(a, b, c, d) > -100 ? Math.max(tx < 0.5 ? (tz < 0.5 ? a : c) : (tz < 0.5 ? b : d), -1e3) : -1e3;
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
  };
  return { at, grad: (x, z) => [(at(x + 0.01, z) - at(x - 0.01, z)) / 0.02, (at(x, z + 0.01) - at(x, z - 0.01)) / 0.02] };
}

// nearest-vertex tangent-plane projection onto head / neck / collar skin (for plastered strands)
function surfaceIndex(actorRoot, F) {
  const S = 0.012, map = new Map(), P = [], N = [];
  const key = (x, y, z) => `${x},${y},${z}`;
  actorRoot.traverse((o) => {
    if (!o.isSkinnedMesh || /^Hair/.test(o.name) || /eye|teeth|gum|tongue|cavity/i.test(o.name)) return;
    const g = o.geometry, pos = g.attributes.position, nrm = g.attributes.normal;
    if (!nrm) return;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      if (y < F.c.y - 0.42 || y > F.bb.max.y + 0.02 || Math.abs(x - F.c.x) > 0.26 || Math.abs(z - F.c.z) > 0.26) continue;
      const k = P.length / 3;
      P.push(x, y, z); N.push(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
      const kk = key(Math.floor(x / S), Math.floor(y / S), Math.floor(z / S));
      let arr = map.get(kk); if (!arr) { arr = []; map.set(kk, arr); } arr.push(k);
    }
  });
  return {
    project(q, off) {
      const ix = Math.floor(q.x / S), iy = Math.floor(q.y / S), iz = Math.floor(q.z / S);
      let best = -1, bd = 1e9;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
        const arr = map.get(key(ix + a, iy + b, iz + c)); if (!arr) continue;
        for (const k of arr) { const dx = q.x - P[k * 3], dy = q.y - P[k * 3 + 1], dz = q.z - P[k * 3 + 2]; const d2 = dx * dx + dy * dy + dz * dz; if (d2 < bd) { bd = d2; best = k; } }
      }
      if (best < 0) return false;
      const n = new THREE.Vector3(N[best * 3], N[best * 3 + 1], N[best * 3 + 2]).normalize();
      const dist = (q.x - P[best * 3]) * n.x + (q.y - P[best * 3 + 1]) * n.y + (q.z - P[best * 3 + 2]) * n.z;
      q.addScaledVector(n, off - dist);
      return n;
    },
  };
}

function eyeCenters(actorRoot, F) {
  const out = [];
  actorRoot.traverse((o) => {
    if (!o.isMesh || !/^eye/i.test(o.name)) return;
    o.geometry.computeBoundingBox();
    const e = o.geometry.boundingBox.getCenter(new THREE.Vector3());
    if (F.bb.clone().expandByScalar(0.02).containsPoint(e)) out.push(e);
  });
  if (out.length < 2) {
    const y = F.bb.getCenter(new THREE.Vector3()).y + 0.005, z = F.bb.max.z - 0.025;
    return [new THREE.Vector3(F.c.x - 0.032, y, z), new THREE.Vector3(F.c.x + 0.032, y, z)];
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------
// Long hair as clumped wet locks.
// style: { seed, clumps, perClump:[a,b], length:[min,max], clumpRadius, width:[a,b], color, colorDark, tipColor,
//   dirty (0..1), frizz, lift:[a,b] (m off the scalp), part (m, side parting offset), faceClear (m from the
//   eye line centre), plaster: { face, neck }, strays (in-air locks over the face), flyaways, cap: {...addBuzz},
//   wet, segs, faceFwd (0..1 how much cards turn toward the lens) }
export function addHair(actorRoot, style = {}) {
  if (style.buzz) return addBuzz(actorRoot, style);
  const body = largestSkinned(actorRoot);
  if (!body) return null;
  const skel = body.skeleton;
  const headIdx = skel.bones.findIndex((b) => b.name === 'head');
  if (headIdx < 0) return null;
  const F = headFrame(body, headIdx);
  if (DEBUG) console.log('[hair] body', body.name, body.geometry.attributes.position.count, 'headIdx', headIdx, 'frame', !!F);
  if (!F) return null;
  if (style.cap) addBuzz(actorRoot, { ...style.cap, cap: true });
  const { c, half } = F;
  const pos = body.geometry.attributes.position, nrm = body.geometry.attributes.normal;
  const r = rng(style.seed ?? 7);
  const headR = radialMap(body, F);
  const torso = torsoField(actorRoot, headIdx, F);
  const eyes = eyeCenters(actorRoot, F);
  const eyeY = (eyes[0].y + eyes[1].y) / 2;
  const eyeHalf = Math.abs(eyes[0].x - eyes[1].x) / 2;
  const FX = eyeHalf + (style.faceClear ?? 0.032); // face keep-out half width
  const browY = eyeY + 0.03, chinY = F.bb.min.y;
  const DOWN = new THREE.Vector3(...(style.gravity ?? [0, -1, 0])).normalize();
  const segs = style.segs ?? 14;

  // root candidates on the scalp
  const cand = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    if (F.headW(i) < 0.9) continue;
    p.fromBufferAttribute(pos, i);
    const { m } = scalpMask(p.clone().sub(c), half, 0.6, style.hairline ?? 0);
    if (m > 0.45) cand.push(i);
  }
  if (DEBUG) console.log('[hair] root candidates', cand.length);
  if (!cand.length) return null;

  const tmp = new THREE.Vector3();
  // keep a point outside the head shell (+off) and the face keep-out; returns true when resting on the torso
  const collide = (q, off, sideSign, faceOK) => {
    tmp.copy(q).sub(c);
    const R = headR(tmp) + off, rr = tmp.length();
    if (rr < R && rr > 1e-6) q.copy(c).addScaledVector(tmp, R / rr);
    if (!faceOK && q.z > c.z + 0.005 && q.y < browY + 0.012 && q.y > chinY - 0.06 && Math.abs(q.x - c.x) < FX) q.x = c.x + sideSign * FX;
    if (q.y < F.bb.min.y + 0.04) {
      const lim = Math.max(0.004, off * 0.6);
      let hh = torso.at(q.x, q.z) + lim;
      if (q.y < hh - 0.02) {
        // beside a tall wall (neck, back, chest): step out horizontally down the field instead of lifting
        for (let it = 0; it < 10 && q.y < hh; it++) {
          const [gx, gz] = torso.grad(q.x, q.z); const gl = Math.hypot(gx, gz);
          if (gl < 1e-4) break;
          q.x -= gx / gl * 0.004; q.z -= gz / gl * 0.004;
          hh = torso.at(q.x, q.z) + lim;
        }
      }
      if (q.y < hh) { q.y = hh; return true; }
    }
    return false;
  };

  const strands = []; // { pts:[V3], width, col:[r,g,b], dirty, flat (card normal hint), kind }
  const colLight = new THREE.Color(style.color ?? 0x7c7f84), colDark = new THREE.Color(style.colorDark ?? 0x2e2e32);
  const frizz = style.frizz ?? 0.12;
  const lift = style.lift ?? [0.002, 0.01];
  const partX = c.x + (style.part ?? 0.012);
  const cling = style.cling ?? 0;
  const neckZ = c.z - 0.025;
  const kinkA = style.kink ?? 0;

  const growGuide = (p0, n0, L, off, opts = {}) => {
    const step = L / segs;
    const d0 = p0.clone().sub(c);
    const { az, el } = scalpMask(d0, half, 0);
    const front = 1 - ss(20, 75, Math.abs(az));
    const top = ss(25, 70, el);
    const side = Math.sign(p0.x - partX) || 1;
    // combing: away from the parting and down the sides (locks frame the face); the back falls straight down
    const back = ss(100, 165, Math.abs(az));
    const sweep = style.sweep ?? 0.25; // how much the top is combed back
    const flow = new THREE.Vector3(side * (0.8 + 0.15 * front) * (1 - 0.85 * back), -0.35 - 0.4 * back, -sweep * top - 0.1 + 0.1 * front).normalize();
    if (opts.flow) flow.copy(opts.flow);
    let q = p0.clone().addScaledVector(n0, 0.0015);
    const pts = [q.clone()];
    const v = n0.clone().multiplyScalar(opts.lift0 ?? 0.35).add(flow).normalize();
    let contact = false, onHead = true;
    for (let s = 1; s <= segs; s++) {
      tmp.copy(q).sub(c);
      const near = tmp.length() < headR(tmp) + 0.02;
      v.lerp(DOWN, near ? 0.22 : 0.4);
      if (near) v.addScaledVector(flow, 0.35);
      v.x += (r() - 0.5) * frizz; v.z += (r() - 0.5) * frizz; v.y += (r() - 0.5) * frizz * 0.3;
      if (contact) { const [gx, gz] = torso.grad(q.x, q.z); const gl = Math.hypot(gx, gz); if (gl > 1e-4) { v.x -= gx / gl * 0.6; v.z -= gz / gl * 0.6; } }
      v.normalize();
      const prev = q.clone();
      q = q.clone().addScaledVector(v, step);
      // wet hair clings: below the cranium, pull toward the head / neck axis (collisions keep it outside)
      if (cling > 0 && q.y < c.y - 0.01 && q.y > chinY - 0.025) { const k = cling * step / Math.max(0.03, Math.hypot(q.x - c.x, q.z - neckZ)); q.x += (c.x - q.x) * k; q.z += (neckZ - q.z) * k; }
      if (opts.kink) q.addScaledVector(opts.kink, Math.sin(s / segs * opts.kinkF + opts.kinkP) * step * 0.35);
      if (onHead) {
        tmp.copy(q).sub(c);
        const mk = scalpMask(tmp, half, 0);
        if (mk.el > -18 - 20 * ss(100, 160, Math.abs(mk.az)) && !opts.faceOK) { const R = headR(tmp) + off; q.copy(c).addScaledVector(tmp, R / tmp.length()); }
        else onHead = false;
      }
      contact = collide(q, off, side, opts.faceOK);
      const dv = q.clone().sub(prev);
      if (dv.lengthSq() > 1e-10) v.copy(dv.normalize());
      pts.push(q.clone());
    }
    // relax kinks (collar / shoulder contacts) while staying outside the head, face zone and torso
    for (let it = 0; it < 3; it++) {
      for (let s = 2; s < pts.length - 1; s++) {
        const sm = pts[s - 1].clone().add(pts[s + 1]).multiplyScalar(0.5);
        pts[s].lerp(sm, 0.5);
        collide(pts[s], off, side, opts.faceOK);
      }
    }
    return { pts, side };
  };

  const clumps = style.clumps ?? 220;
  const per = style.perClump ?? [6, 11];
  const lenR = style.length ?? [0.18, 0.34];
  const widthR = style.width ?? [0.0022, 0.0038];
  const cr = style.clumpRadius ?? 0.008;
  for (let k = 0; k < clumps; k++) {
    const vi = cand[Math.floor(r() * cand.length)];
    const p0 = new THREE.Vector3().fromBufferAttribute(pos, vi), n0 = new THREE.Vector3().fromBufferAttribute(nrm, vi).normalize();
    let L = lenR[0] + (lenR[1] - lenR[0]) * Math.pow(r(), 0.8);
    { const { az } = scalpMask(p0.clone().sub(c), half, 0); L *= 1 - (1 - (style.backLen ?? 1)) * ss(100, 160, Math.abs(az)); }
    const layer = r();
    const off = lift[0] + (lift[1] - lift[0]) * layer;
    const kink = kinkA > 0 ? new THREE.Vector3(r() - 0.5, 0, r() - 0.5).normalize().multiplyScalar(kinkA * (0.4 + 0.6 * r())) : null;
    const { pts: guide, side } = growGuide(p0, n0, L, off, { kink, kinkF: 4 + 6 * r(), kinkP: r() * 6.28, lift0: style.rootLift ?? 0.35 });
    // clump colour: salt and pepper, a little cooler on the outside layer
    const clumpBias = (r() - 0.5) * 0.3;
    const tip = guide[guide.length - 1];
    const dirty = (tip.z > c.z - 0.03 || tip.y < chinY - 0.02) && r() < (style.dirty ?? 0.5);
    const kids = per[0] + Math.floor(r() * (per[1] - per[0] + 1));
    const t1 = new THREE.Vector3().crossVectors(n0, Math.abs(n0.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
    const t2 = new THREE.Vector3().crossVectors(n0, t1).normalize();
    const conv = (style.conv ?? 0.75) + 0.2 * r();
    for (let j = 0; j < kids; j++) {
      const ang = r() * Math.PI * 2, rad = cr * Math.sqrt(r());
      const o = t1.clone().multiplyScalar(Math.cos(ang) * rad).addScaledVector(t2, Math.sin(ang) * rad);
      const jit = new THREE.Vector3((r() - 0.5), (r() - 0.5) * 0.3, (r() - 0.5)).multiplyScalar(0.006);
      const lenF = 0.82 + 0.18 * r();
      const pts = [];
      const cnt = Math.max(3, Math.round(segs * lenF));
      for (let s = 0; s <= cnt; s++) {
        const t = s / segs;
        const q = guide[s].clone().addScaledVector(o, 1 - conv * Math.pow(t, 0.7)).addScaledVector(jit, t * t);
        collide(q, 0.0012 + off * 0.5, side, false);
        pts.push(q);
      }
      const isSalt = r() < (style.salt ?? 0.3);
      const x = Math.min(1, Math.max(0, (isSalt ? 0.8 + 0.2 * r() : 0.55 * Math.pow(r(), 1.4)) + clumpBias));
      const shade = (style.cardShade ?? [0.85, 1.15])[0] + ((style.cardShade ?? [0.85, 1.15])[1] - (style.cardShade ?? [0.85, 1.15])[0]) * r();
      const base = colDark.clone().lerp(colLight, x);
      const salt = 1;
      strands.push({ pts, width: widthR[0] + (widthR[1] - widthR[0]) * r(), col: base.clone().multiplyScalar(shade * salt), dirty: dirty && salt === 1, kind: 0 });
    }
  }

  // a few in-air locks that fall across the brow / cheek (allowed into the face zone)
  for (let k = 0; k < (style.strays ?? 0); k++) {
    let vi = -1;
    for (let t = 0; t < 60 && vi < 0; t++) { const c2 = cand[Math.floor(r() * cand.length)]; p.fromBufferAttribute(pos, c2); const { az, el } = scalpMask(p.clone().sub(c), half, 0); if (Math.abs(az) < 40 && Math.abs(az) > 8 && el < 60) vi = c2; }
    if (vi < 0) continue;
    const p0 = new THREE.Vector3().fromBufferAttribute(pos, vi), n0 = new THREE.Vector3().fromBufferAttribute(nrm, vi).normalize();
    const sgn = Math.sign(p0.x - c.x) || 1;
    const { pts } = growGuide(p0, n0, 0.12 + 0.1 * r(), 0.004, { faceOK: true, flow: new THREE.Vector3(sgn * 0.45, -0.3, 0.6).normalize(), lift0: 0.2 });
    strands.push({ pts, width: 0.0016 + 0.001 * r(), col: colDark.clone().lerp(colLight, r()), dirty: r() < 0.5, kind: 0 });
  }

  // plastered locks: lying on the skin of the forehead / temple / cheek and down the neck
  const pl = style.plaster || {};
  if ((pl.face || 0) + (pl.neck || 0) > 0) {
    const surf = surfaceIndex(actorRoot, F);
    const lay = (p0, dir, L, stepN, avoidEyes, width, colr, dirty) => {
      const step = L / stepN;
      let q = p0.clone();
      const v = dir.clone().normalize();
      const pts = [];
      const nrmHint = [];
      let nn = surf.project(q, 0.0009) || new THREE.Vector3(0, 0, 1);
      pts.push(q.clone()); nrmHint.push(nn.clone());
      for (let s = 1; s <= stepN; s++) {
        v.lerp(DOWN, 0.12); v.x += (r() - 0.5) * 0.15; v.normalize();
        const prev = q.clone();
        q = q.clone().addScaledVector(v, step);
        if (avoidEyes) for (const e of eyes) {
          const ex = (q.x - e.x) / 0.029, ey = (q.y - e.y) / 0.022;
          const dd = Math.hypot(ex, ey);
          if (dd < 1 && q.z > e.z - 0.02) { const sg = Math.sign(e.x - c.x) || 1; q.x = e.x + sg * 0.029 * Math.sqrt(Math.max(0, 1 - ey * ey)) + sg * 0.001; }
        }
        nn = surf.project(q, 0.0009) || nn;
        const dv = q.clone().sub(prev); if (dv.lengthSq() > 1e-10) v.copy(dv.normalize());
        pts.push(q.clone()); nrmHint.push(nn.clone());
      }
      strands.push({ pts, width, col: colr, dirty, kind: 1, nrmHint });
    };
    for (let k = 0; k < (pl.face || 0); k++) {
      // root on the front hairline above the outer brow; runs down across the temple / outer cheek
      const sgn = k % 2 ? 1 : -1;
      const az = sgn * (3 + 10 * r()) * D2R, el = (elMin(az / D2R) - (style.hairline ?? 0) + 1) * D2R;
      const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      const R = headR(dir);
      const p0 = c.clone().addScaledVector(dir, R);
      const L = 0.07 + 0.08 * r();
      const tint = colDark.clone().lerp(colLight, 0.55 + 0.4 * r());
      for (let j = 0; j < 2 + (r() < 0.5 ? 1 : 0); j++) {
        const pj = p0.clone().add(new THREE.Vector3((r() - 0.5) * 0.006, (r() - 0.5) * 0.004, 0));
        lay(pj, new THREE.Vector3(sgn * (0.8 + 0.4 * r()), -1, 0.1), L * (0.8 + 0.2 * r()), 18, true, (style.plasterWidth ?? 0.0025) * (0.8 + 0.5 * r()), tint, r() < 0.35);
      }
    }
    for (let k = 0; k < (pl.neck || 0); k++) {
      const sgn = k % 2 ? 1 : -1;
      const azd = sgn * (95 + 60 * r()), az = azd * D2R, el = (elMin(azd) + 3) * D2R;
      const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      const p0 = c.clone().addScaledVector(dir, headR(dir));
      const tint = colDark.clone().lerp(colLight, 0.45 + 0.4 * r());
      for (let j = 0; j < 2 + (r() < 0.5 ? 1 : 0); j++) {
        const pj = p0.clone().add(new THREE.Vector3(0, (r() - 0.5) * 0.006, (r() - 0.5) * 0.006));
        lay(pj, new THREE.Vector3(sgn * 0.15, -1, 0.25 * (r() - 0.3)), 0.1 + 0.08 * r(), 16, false, 0.0016 + 0.0012 * r(), tint, r() < 0.4);
      }
    }
  }

  // flyaways: thin single hairs that lift off the crown / sides and fall
  for (let k = 0; k < (style.flyaways ?? 0); k++) {
    const vi = cand[Math.floor(r() * cand.length)];
    const p0 = new THREE.Vector3().fromBufferAttribute(pos, vi), n0 = new THREE.Vector3().fromBufferAttribute(nrm, vi).normalize();
    const { pts } = growGuide(p0, n0, 0.05 + 0.12 * r(), 0.006 + 0.012 * r(), { lift0: 1.4 });
    strands.push({ pts, width: 0.0006 + 0.0005 * r(), col: colLight.clone().multiplyScalar(0.9 + 0.3 * r()), dirty: false, kind: 2 });
  }

  // ---- build cards
  const positions = [], uvs = [], normals = [], colors = [], skinIdx = [], skinW = [], indices = [];
  const tipCol = new THREE.Color(style.tipColor ?? 0x3a0f0b);
  const FWD = new THREE.Vector3(0, 0, 1);
  const faceFwd = style.faceFwd ?? 0.6;
  const Nn = new THREE.Vector3(), T = new THREE.Vector3(), Sd = new THREE.Vector3(), rad = new THREE.Vector3(), e1 = new THREE.Vector3();
  const CYL = 0.85; // card normal bend across the width (round strand section -> a thin highlight along the lock)
  for (const st of strands) {
    const pts = st.pts, m = pts.length - 1;
    if (m < 2) continue;
    const base = positions.length / 3;
    const twist = (r() - 0.5) * 0.9;
    const uOff = st.kind === 2 ? 0.45 : 0;
    for (let s = 0; s <= m; s++) {
      const t = s / m;
      T.copy(pts[Math.min(m, s + 1)]).sub(pts[Math.max(0, s - 1)]).normalize();
      if (st.nrmHint) Nn.copy(st.nrmHint[s]);
      else { rad.copy(pts[s]).sub(c).normalize(); Nn.copy(rad).addScaledVector(FWD, faceFwd * Math.max(0, 1 - Math.max(0, -rad.z) * 2)); }
      Nn.addScaledVector(T, -Nn.dot(T)).normalize();
      Sd.crossVectors(T, Nn).normalize();
      if (!st.nrmHint) { const ca = Math.cos(twist), sa = Math.sin(twist); e1.copy(Sd).multiplyScalar(ca).addScaledVector(Nn, sa); Nn.multiplyScalar(ca).addScaledVector(Sd, -sa); Sd.copy(e1); }
      const w = st.width * (1 - 0.45 * t);
      // colour: dark wet roots, salt-and-pepper body, dirty / blood-stained ends near the jaw
      let cr_ = st.col.r, cg = st.col.g, cb = st.col.b;
      const rootD = 0.45 + 0.55 * ss(0.0, 0.3, t);
      cr_ *= rootD; cg *= rootD; cb *= rootD;
      if (st.dirty) { const k = ss(0.45, 0.95, t) * 0.85; cr_ += (tipCol.r - cr_) * k; cg += (tipCol.g - cg) * k; cb += (tipCol.b - cb) * k; }
      for (const sgn of [-1, 1]) {
        positions.push(pts[s].x + Sd.x * sgn * w * 0.5, pts[s].y + Sd.y * sgn * w * 0.5, pts[s].z + Sd.z * sgn * w * 0.5);
        const nx = Nn.x * Math.cos(CYL) + Sd.x * sgn * Math.sin(CYL), ny = Nn.y * Math.cos(CYL) + Sd.y * sgn * Math.sin(CYL), nz = Nn.z * Math.cos(CYL) + Sd.z * sgn * Math.sin(CYL);
        normals.push(nx, ny, nz);
        uvs.push(st.kind === 2 ? uOff + (sgn < 0 ? 0 : 0.1) : (sgn < 0 ? 0 : 1), t);
        colors.push(cr_, cg, cb);
        skinIdx.push(headIdx, 0, 0, 0);
        skinW.push(1, 0, 0, 0);
      }
      if (s < m) { const a = base + s * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIdx, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinW, 4));
  g.setIndex(indices);
  const wet = !!style.wet;
  const mat = new THREE.MeshPhysicalMaterial({
    vertexColors: true, map: lockTexture(), metalness: 0, side: THREE.DoubleSide,
    roughness: style.roughness ?? (wet ? 0.38 : 0.6), specularIntensity: wet ? 0.85 : 0.5,
    clearcoat: wet ? (style.gloss ?? 0.65) : 0, clearcoatRoughness: 0.13,
    alphaTest: 0.32, alphaToCoverage: true, envMapIntensity: 0.6,
  });
  const hair = new THREE.SkinnedMesh(g, mat);
  hair.name = 'Hair';
  hair.frustumCulled = false;
  hair.castShadow = style.shadow ?? true;
  hair.receiveShadow = true;
  body.parent.add(hair);
  hair.bind(skel, body.bindMatrix);
  if (DEBUG) console.log('[hair] strands', strands.length, 'tris', indices.length / 3, 'head c', c.toArray().map((x) => x.toFixed(3)).join(','), 'half', half.toArray().map((x) => x.toFixed(3)).join(','), 'eyes', eyes.map((e) => e.toArray().map((x) => x.toFixed(3)).join(',')).join(' | '), 'FX', FX.toFixed(3));
  return hair;
}
