// Thorax fur strands: curved, outward-facing tapered ribbons grown in combed locks (own generator: makeFur's
// world-axis direction noise makes straw, this one keeps every strand in the (comb, normal) plane of its lock).
// One strand = 2*S+1 vertices, 2*(S-1)+1 triangles. The mesh is a fur mesh (layer 2, userData.fur) like makeFur's.
import { THREE, M, rng } from '../kit.js';

/**
 * strandMesh(list, { segments, width, rootDark, mat })
 * list items: { p, n, t, len, wid, lift, bT, bN, c:[r,g,b], tip, tipCol, spin }
 *   p root, n surface normal, t unit comb tangent (perpendicular to n), len mm, wid multiplier,
 *   lift rad (root elevation above the surface), bT / bN: tangential bend / droop back to the surface (fraction of len),
 *   tip 0..1 blend towards tipCol over the outer half, spin rad (ribbon roll about its axis).
 */
export function strandMesh(list, { segments = 3, width = 0.05, rootDark = 0.38, mat = M.fur } = {}) {
  const S = Math.max(2, segments | 0), vPer = 2 * S + 1, tPer = 2 * (S - 1) + 1, n = list.length;
  const pos = new Float32Array(n * vPer * 3), nor = new Float32Array(n * vPer * 3), col = new Float32Array(n * vPer * 3);
  const idx = new Uint32Array(n * tPer * 3);
  const d0 = new THREE.Vector3(), bv = new THREE.Vector3(), pt = new THREE.Vector3(), prev = new THREE.Vector3();
  const tan = new THREE.Vector3(), side = new THREE.Vector3(), face = new THREE.Vector3(), out = new THREE.Vector3(), nn = new THREE.Vector3();
  for (let k = 0; k < n; k++) {
    const s = list[k], vb = k * vPer;
    const cl = Math.cos(s.lift), sl = Math.sin(s.lift);
    d0.copy(s.t).multiplyScalar(cl).addScaledVector(s.n, sl);
    bv.copy(s.t).multiplyScalar(s.bT).addScaledVector(s.n, -s.bN);
    // ribbon faces outward, rolled a little about the strand axis
    out.copy(s.n).addScaledVector(s.t, 0.35 * Math.sin(s.spin)).normalize();
    prev.copy(s.p);
    const W = width * s.wid;
    for (let i = 0; i <= S; i++) {
      const u = i / S;
      pt.copy(s.p).addScaledVector(d0, s.len * u).addScaledVector(bv, s.len * u * u);
      tan.copy(d0).addScaledVector(bv, 2 * u).normalize();
      side.crossVectors(tan, out);
      if (side.lengthSq() < 1e-8) side.crossVectors(tan, s.t);
      side.normalize();
      face.crossVectors(side, tan);
      if (face.dot(s.n) < 0) face.negate();
      nn.copy(s.n).multiplyScalar(0.62).addScaledVector(face, 0.38).normalize();
      // colour: dark root, full colour at 40 %, tip blend over the outer half
      const shade = rootDark + (1 - rootDark) * Math.min(1, Math.pow(u / 0.42, 0.8));
      const tb = s.tip * Math.max(0, Math.min(1, (u - 0.42) / 0.5));
      const cr = (s.c[0] + (s.tipCol[0] - s.c[0]) * tb) * shade;
      const cg = (s.c[1] + (s.tipCol[1] - s.c[1]) * tb) * shade;
      const cb = (s.c[2] + (s.tipCol[2] - s.c[2]) * tb) * shade;
      const half = i === S ? 0 : W * (1 - 0.8 * u) * 0.5;
      const rings = i === S ? 1 : 2;
      for (let q = 0; q < rings; q++) {
        const vi = vb + (i === S ? 2 * S : 2 * i + q), sg = q === 0 ? -1 : 1;
        pos[vi * 3] = pt.x + side.x * half * sg; pos[vi * 3 + 1] = pt.y + side.y * half * sg; pos[vi * 3 + 2] = pt.z + side.z * half * sg;
        nor[vi * 3] = nn.x; nor[vi * 3 + 1] = nn.y; nor[vi * 3 + 2] = nn.z;
        col[vi * 3] = cr; col[vi * 3 + 1] = cg; col[vi * 3 + 2] = cb;
      }
    }
    let ti = k * tPer * 3;
    for (let i = 0; i < S - 1; i++) {
      const a = vb + 2 * i, b = a + 1, c = a + 2, d = a + 3;
      idx[ti++] = a; idx[ti++] = c; idx[ti++] = b;
      idx[ti++] = b; idx[ti++] = c; idx[ti++] = d;
    }
    const a = vb + 2 * (S - 1), b = a + 1, tipv = vb + 2 * S;
    idx[ti++] = a; idx[ti++] = tipv; idx[ti++] = b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.fur = true;
  mesh.layers.disableAll();
  mesh.layers.enable(2);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}


/* ------------------------------------------------------------------ hair cards */
/**
 * Hair texture: a tileable (in u) patch of fine tapering hairs, root at v = 0. Brightness only (the vertex colours tint it), alpha = hair
 * profile for an alpha test. The mip chain is built by hand with a coverage-preserving alpha gain so cards keep their fuzz at distance
 * instead of fading out (plain box-filtered alpha drops below the cutoff and the whole card vanishes).
 */
let hairTex = null;
export function hairTexture() {
  if (hairTex) return hairTex;
  const TW = 256, TH = 512, CUT = 0.5;
  const base = new Float32Array(TW * TH * 4);
  const r = rng(515);
  const stamp = (nh, w0lo, w0hi, lenLo, lenHi, leanAmp, shadeLo) => {
    for (let h = 0; h < nh; h++) {
      const x0 = ((h + 0.1 + 0.8 * r()) / nh) * TW;
      const lean = (r() - 0.5) * leanAmp, curl = (r() - 0.5) * 22, ph = r() * 6.283;
      const w0 = w0lo + (w0hi - w0lo) * r(), len = lenLo + (lenHi - lenLo) * r(), bright = shadeLo + (1 - shadeLo) * r();
      for (let y = 0; y < TH; y++) {
        const v = y / (TH - 1);
        if (v > len) break;
        const vv = v / len;
        const xc = x0 + lean * vv * vv + curl * Math.sin(vv * 3.1 + ph) * vv;
        const hw = Math.max(1.4, w0 * (1 - 0.86 * Math.pow(vv, 0.85)));
        for (let x = Math.floor(xc - hw - 1); x <= Math.ceil(xc + hw + 1); x++) {
          const d = Math.abs(x + 0.5 - xc) / hw;
          if (d >= 1) continue;
          const a = 1 - d * d * (3 - 2 * d);       // smooth bump: 1 on the axis, 0 at the rim
          const k = (y * TW + (((x % TW) + TW) % TW)) * 4;
          if (a > base[k + 3]) { const b = bright * (0.8 + 0.2 * (1 - d)); base[k] = base[k + 1] = base[k + 2] = b; base[k + 3] = a; }
        }
      }
    }
  };
  stamp(40, 2.8, 4.4, 0.3, 0.6, 34, 0.5);          // short fine undercoat
  stamp(26, 4.6, 7.6, 0.72, 1.0, 64, 0.56);        // long hairs
  // mip chain
  let cov = 0;
  for (let i = 0; i < TW * TH; i++) if (base[i * 4 + 3] >= CUT) cov++;
  cov /= TW * TH;
  const levels = [];
  const toU8 = (f, w, h) => {
    const d = new Uint8Array(w * h * 4);
    for (let i = 0; i < d.length; i++) d[i] = Math.max(0, Math.min(255, Math.round(f[i] * 255)));
    return { data: d, width: w, height: h };
  };
  levels.push(toU8(base, TW, TH));
  let cur = base, cw = TW, ch = TH;
  while (cw > 1 || ch > 1) {
    const nw = Math.max(1, cw >> 1), nh = Math.max(1, ch >> 1);
    const nxt = new Float32Array(nw * nh * 4);
    for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) {
      let a = 0, rs = 0, cnt = 0;
      for (let dy = 0; dy < (ch > 1 ? 2 : 1); dy++) for (let dx = 0; dx < (cw > 1 ? 2 : 1); dx++) {
        const k = ((y * (ch > 1 ? 2 : 1) + dy) * cw + x * (cw > 1 ? 2 : 1) + dx) * 4;
        a += cur[k + 3]; rs += cur[k] * cur[k + 3]; cnt++;
      }
      const o = (y * nw + x) * 4;
      nxt[o + 3] = a / cnt;
      const g = a > 1e-5 ? rs / a : 0.8;
      nxt[o] = nxt[o + 1] = nxt[o + 2] = g;
    }
    // alpha gain: keep the fraction of texels above the cutoff equal to the base level's
    const al = Float32Array.from({ length: nw * nh }, (_, i) => nxt[i * 4 + 3]).sort();
    const q = al[Math.max(0, Math.min(al.length - 1, Math.floor((1 - cov) * al.length)))];
    const gain = q > 1e-4 ? Math.min(12, CUT / q) : 1;
    for (let i = 0; i < nw * nh; i++) nxt[i * 4 + 3] = Math.min(1, nxt[i * 4 + 3] * gain);
    levels.push(toU8(nxt, nw, nh));
    cur = nxt; cw = nw; ch = nh;
  }
  const tex = new THREE.DataTexture(levels[0].data, TW, TH, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.mipmaps = levels;
  tex.generateMipmaps = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 8;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  hairTex = tex;
  return tex;
}

/**
 * cardMesh(list, { mat }): hair cards, each a 2 x 3 vertex strip (2 quads) along the strand curve, carrying a slice of the hair texture.
 * list items as strandMesh plus: wid = card width (mm), u0 = texture slice offset (0..1), flip. Vertex alpha thins the hairs at the tip
 * (alpha test). Fur mesh (layer 2, userData.fur).
 */
export function cardMesh(list, { mat, rootDark = 0.34 } = {}) {
  const S = 2, R = S + 1, vPer = R * 2, tPer = S * 2, n = list.length;
  const pos = new Float32Array(n * vPer * 3), nor = new Float32Array(n * vPer * 3), col = new Float32Array(n * vPer * 4), uv = new Float32Array(n * vPer * 2);
  const idx = new Uint32Array(n * tPer * 3);
  const d0 = new THREE.Vector3(), bv = new THREE.Vector3(), pt = new THREE.Vector3(), bb = new THREE.Vector3();
  const tan = new THREE.Vector3(), side = new THREE.Vector3(), face = new THREE.Vector3(), out = new THREE.Vector3(), nn = new THREE.Vector3();
  const ROWA = [1, 1, 0.9];
  for (let k = 0; k < n; k++) {
    const s = list[k], vb = k * vPer;
    const cl = Math.cos(s.lift), sl = Math.sin(s.lift);
    d0.copy(s.t).multiplyScalar(cl).addScaledVector(s.n, sl);
    bv.copy(s.t).multiplyScalar(s.bT).addScaledVector(s.n, -s.bN);
    bb.crossVectors(s.n, s.t);
    out.copy(s.n).addScaledVector(bb, 0.6 * Math.sin(s.spin)).addScaledVector(s.t, 0.3 * Math.cos(s.spin)).normalize();
    for (let i = 0; i < R; i++) {
      const u = i / S;
      pt.copy(s.p).addScaledVector(d0, s.len * u).addScaledVector(bv, s.len * u * u);
      tan.copy(d0).addScaledVector(bv, 2 * u).normalize();
      side.crossVectors(tan, out);
      if (side.lengthSq() < 1e-8) side.crossVectors(tan, s.t);
      side.normalize();
      face.crossVectors(side, tan);
      if (face.dot(out) < 0) face.negate();
      const half = 0.5 * s.wid * (1 - 0.3 * u);
      const shade = (rootDark + (1 - rootDark) * Math.min(1, Math.pow(u / 0.45, 0.8))) * 1.18;
      const tb = s.tip * Math.max(0, Math.min(1, (u - 0.4) / 0.55));
      const cr = (s.c[0] + (s.tipCol[0] - s.c[0]) * tb) * shade, cg = (s.c[1] + (s.tipCol[1] - s.c[1]) * tb) * shade, cb = (s.c[2] + (s.tipCol[2] - s.c[2]) * tb) * shade;
      for (let j = 0; j < 2; j++) {
        const sg = j * 2 - 1, vi = vb + i * 2 + j;
        pt.clone().addScaledVector(side, half * sg).toArray(pos, vi * 3);
        nn.copy(s.n).multiplyScalar(0.5).addScaledVector(face, 0.5).addScaledVector(side, 0.3 * sg).normalize().toArray(nor, vi * 3);
        col[vi * 4] = cr; col[vi * 4 + 1] = cg; col[vi * 4 + 2] = cb; col[vi * 4 + 3] = ROWA[i];
        uv[vi * 2] = s.u0 + (s.flip ? 1 - j : j) * 0.5;
        uv[vi * 2 + 1] = u;
      }
    }
    let ti = k * tPer * 3;
    for (let i = 0; i < S; i++) {
      const a = vb + i * 2, b = a + 1, c2 = a + 2, d = a + 3;
      idx[ti++] = a; idx[ti++] = c2; idx[ti++] = b;
      idx[ti++] = b; idx[ti++] = c2; idx[ti++] = d;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 4));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.fur = true;
  mesh.layers.disableAll();
  mesh.layers.enable(2);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}
