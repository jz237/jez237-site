// optics-dome.js - faceted compound-eye dome. A Goldberg lattice (dual of a subdivided icosahedron: hex cells plus
// 12 pentagons) is wrapped on the right-eye ellipsoid and masked by the orbital contour phi_c(theta). Every cell is a
// convex glossy lens (spherical cap) with its own normal jitter and tint; thin metallic ridges show between lenses
// and a dark liner closes the surface underneath.
import { THREE, V3, rng, S } from '../kit.js';
import { eyeFrame, ellN, TAU, clamp, lerp, smooth01, fixWinding } from './optics-frame.js';

/* ------------------------------------------------------------------ materials (module level, never mutate shared ones) */
export const domeLens = new THREE.MeshPhysicalMaterial({
  name: 'eye facet lens', color: 0xffffff, vertexColors: true, metalness: 0.8, roughness: 0.17,
  clearcoat: 1, clearcoatRoughness: 0.05,
});
export const domeRidge = new THREE.MeshStandardMaterial({ name: 'eye facet ridge', color: 0xffffff, vertexColors: true, metalness: 1, roughness: 0.28 });
// the gold walls in the lower half glow a little (warm bounce from the yellow shell) so they do not turn olive
domeRidge.onBeforeCompile = (sh) => {
  sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
    totalEmissiveRadiance += vColor.rgb * 0.04;`);
};
domeRidge.customProgramCacheKey = () => 'apx9-optics-ridge-2';
export const domeLiner = new THREE.MeshStandardMaterial({ name: 'eye liner', color: 0x040406, metalness: 0.3, roughness: 0.55 });

/* ------------------------------------------------------------------ lattice */
function icoLattice(F) {
  const t = (1 + Math.sqrt(5)) / 2;
  const base = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((a) => V3(...a).normalize());
  const faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const verts = [];
  const bucket = new Map();
  const cell = (x) => Math.round(x * 50);
  const addV = (p) => {
    const cx = cell(p.x), cy = cell(p.y), cz = cell(p.z);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
      const list = bucket.get(`${cx + a},${cy + b},${cz + c}`);
      if (list) for (const i of list) if (verts[i].distanceToSquared(p) < 1e-10) return i;
    }
    const i = verts.length;
    verts.push(p.clone());
    const k = `${cx},${cy},${cz}`;
    if (!bucket.has(k)) bucket.set(k, []);
    bucket.get(k).push(i);
    return i;
  };
  const tris = [];
  for (const [ia, ib, ic] of faces) {
    const A = base[ia], B = base[ib], C = base[ic];
    const grid = [];
    for (let i = 0; i <= F; i++) {
      grid[i] = [];
      for (let j = 0; j <= F - i; j++) {
        const p = A.clone().addScaledVector(B.clone().sub(A), i / F).addScaledVector(C.clone().sub(A), j / F).normalize();
        grid[i][j] = addV(p);
      }
    }
    for (let i = 0; i < F; i++) for (let j = 0; j < F - i; j++) {
      tris.push([grid[i][j], grid[i + 1][j], grid[i][j + 1]]);
      if (i + j < F - 1) tris.push([grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]]);
    }
  }
  const fc = base[faces[0][0]].clone().add(base[faces[0][1]]).add(base[faces[0][2]]).normalize();
  return { verts, tris, faceCentre: fc };
}

/* ------------------------------------------------------------------ dome geometry */
/**
 * Returns { lens, ridge, liner, cells } geometries in bee space (right eye).
 *  opts: freq (lattice frequency, ~24 cells across), gap (ridge width fraction), lensK (lens height / cell radius)
 */
export function buildDome({ freq = 13, gap = 0.09, lensK = 0.13, margin = 0.05, spin = 0.55, seed = 7, jitter = 0.34, sink = 0.03 } = {}) {
  const F = eyeFrame();
  const E = F.E;
  const rnd = rng(seed);
  const lat = icoLattice(freq);
  // rotate: a face centre (3-fold axis) to the dome pole (+Z), then spin about Z
  const q = new THREE.Quaternion().setFromUnitVectors(lat.faceCentre, V3(0, 0, 1));
  q.premultiply(new THREE.Quaternion().setFromAxisAngle(V3(0, 0, 1), spin));
  const dirs = lat.verts.map((v) => v.clone().applyQuaternion(q));
  // irregular (snake-skin) cells: nudge every lattice vertex sideways by a fraction of the spacing
  const spacing = 1.107 / freq;
  for (const d of dirs) {
    const ref = Math.abs(d.x) < 0.9 ? V3(1, 0, 0) : V3(0, 1, 0);
    const e1 = new THREE.Vector3().crossVectors(d, ref).normalize();
    const e2 = new THREE.Vector3().crossVectors(d, e1);
    d.addScaledVector(e1, rnd.range(-1, 1) * jitter * spacing).addScaledVector(e2, rnd.range(-1, 1) * jitter * spacing).normalize();
  }
  const incident = dirs.map(() => []);
  const cen = lat.tris.map((t, ti) => {
    for (const vi of t) incident[vi].push(ti);
    return dirs[t[0]].clone().add(dirs[t[1]]).add(dirs[t[2]]).normalize();
  });
  const surf = (d) => V3(E.c.x + E.r.x * d.x, E.c.y + E.r.y * d.y, E.c.z + E.r.z * d.z);
  const inside = (d, m) => {
    const phi = Math.acos(clamp(d.z, -1, 1)), th = Math.atan2(d.y, d.x);
    return phi < F.phiC(th) - m;
  };

  // ---- collect cells
  const cells = [];
  for (let vi = 0; vi < dirs.length; vi++) {
    const d0 = dirs[vi];
    if (!inside(d0, margin * 0.5)) continue;
    // corners sorted CCW around d0 (seen from outside)
    const ref = Math.abs(d0.x) < 0.9 ? V3(1, 0, 0) : V3(0, 1, 0);
    const e1 = new THREE.Vector3().crossVectors(d0, ref).normalize();
    const e2 = new THREE.Vector3().crossVectors(d0, e1);
    const corners = incident[vi].map((ti) => cen[ti]).sort((a, b) => Math.atan2(a.dot(e2), a.dot(e1)) - Math.atan2(b.dot(e2), b.dot(e1)));
    if (!corners.every((c) => inside(c, margin))) continue;
    cells.push({ d0, corners });
  }

  // ---- lens + ridge geometry
  const lp = [], ln = [], lc = [], li = [];
  const rp = [], rn = [], rc = [], ri = [];
  const tmp = V3(), tN = V3(), rv = V3(), rhat = V3(), t1 = V3(), t2 = V3();
  // neutral black glass; the lower half picks up warm amber glints (reflections of the yellow shell), a few pale glitter cells
  const darkCol = [0.016, 0.017, 0.021], amberCol = [0.13, 0.08, 0.025], paleCol = [0.15, 0.155, 0.17];
  const mixCol = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

  for (const cell of cells) {
    const { d0, corners } = cell;
    const n = corners.length;
    const P0 = surf(d0);
    const N0 = ellN(P0, E.c, E.r);
    // tint by height along the eye's "up" axis
    const lp0 = F.toLocal(P0);
    const up = clamp((-lp0.z + 2.4) / 4.8, 0, 1);
    const g = smooth01((0.68 - up) / 0.60);
    // mostly black cells with bright gold glints; the glint density grows toward the bottom of the eye
    const glint = rnd() < g * 0.36;
    const tAmb = glint ? rnd.range(0.45, 1.1) : rnd.range(0, 0.08) + g * 0.05;
    let col = mixCol(darkCol, amberCol, Math.min(tAmb, 1) ** 1.3);
    if (glint && rnd() < 0.2) col = mixCol(col, [0.3, 0.22, 0.12], 0.35);
    if (rnd() < 0.05) col = mixCol(col, paleCol, 0.65);
    col = col.map((x) => x * rnd.range(0.75, 1.25));
    const ridgeT = smooth01(up * 1.25);
    const rcol = mixCol([0.26, 0.21, 0.13], [0.04, 0.05, 0.065], ridgeT).map((x) => x * rnd.range(0.8, 1.1));
    const gp = gap * (1 + 1.0 * g);                       // wider gold walls toward the bottom of the eye
    // frame tangents at the centre
    t1.crossVectors(N0, Math.abs(N0.x) < 0.9 ? V3(1, 0, 0) : V3(0, 1, 0)).normalize();
    t2.crossVectors(N0, t1);
    const jit = 0.055;
    const j1 = rnd.gauss() * jit, j2 = rnd.gauss() * jit;
    const tilt = V3().addScaledVector(t1, j1).addScaledVector(t2, j2);

    const outer = [];
    let aSum = 0;
    for (let j = 0; j < n; j++) {
      const dq = d0.clone().lerp(corners[j], 1 - gp).normalize();
      outer.push(surf(dq));
      aSum += outer[j].distanceTo(P0);
    }
    const a = aSum / n;
    const h = lensK * a * rnd.range(0.85, 1.15);
    const Rc = (a * a + h * h) / (2 * h);

    // lean lens cap: raised centre fanned to the rim (n triangles); the vertex normals carry the spherical-cap shading
    const base = lp.length / 3;
    const pushV = (P, rho, rdir) => {
      // spherical cap: z(rho) = h - (Rc - sqrt(Rc^2 - rho^2))
      const z = h - (Rc - Math.sqrt(Math.max(Rc * Rc - rho * rho, 1e-9)));
      const Ne = ellN(P, E.c, E.r, tN);
      lp.push(P.x + Ne.x * z, P.y + Ne.y * z, P.z + Ne.z * z);
      const slope = rho / Math.sqrt(Math.max(Rc * Rc - rho * rho, 1e-9));
      const nn = V3().copy(Ne).addScaledVector(rdir, slope).add(tilt).addScaledVector(t1, rnd.gauss() * 0.03).addScaledVector(t2, rnd.gauss() * 0.03).normalize();
      ln.push(nn.x, nn.y, nn.z);
      lc.push(col[0], col[1], col[2]);
    };
    // centre
    lp.push(P0.x + N0.x * h, P0.y + N0.y * h, P0.z + N0.z * h);
    tmp.copy(N0).add(tilt).normalize();
    ln.push(tmp.x, tmp.y, tmp.z); lc.push(col[0], col[1], col[2]);
    const dirAt = (P) => {
      rv.copy(P).sub(P0);
      const Ne = ellN(P, E.c, E.r, tN);
      rv.addScaledVector(Ne, -rv.dot(Ne));
      const rho = rv.length();
      rhat.copy(rv).multiplyScalar(rho > 1e-9 ? 1 / rho : 0);
      return rho;
    };
    for (let j = 0; j < n; j++) { const rho = dirAt(outer[j]); pushV(outer[j], rho, rhat.clone()); }
    for (let j = 0; j < n; j++) li.push(base, base + 1 + j, base + 1 + ((j + 1) % n));

    // ridge floor: flat-ish hex fan slightly below the lens skirt
    const rb = rp.length / 3;
    const push2 = (P) => {
      const Ne = ellN(P, E.c, E.r, tN);
      rp.push(P.x - Ne.x * sink, P.y - Ne.y * sink, P.z - Ne.z * sink);
      rn.push(Ne.x, Ne.y, Ne.z); rc.push(rcol[0], rcol[1], rcol[2]);
    };
    push2(P0);
    for (let j = 0; j < n; j++) push2(surf(corners[j]));
    for (let j = 0; j < n; j++) ri.push(rb, rb + 1 + j, rb + 1 + ((j + 1) % n));
  }

  const mk = (p, nr, cl, ix) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nr, 3));
    if (cl) g.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((p.length / 3) * 2), 2));
    g.setIndex(ix);
    return fixWinding(g);
  };
  const lens = mk(lp, ln, lc, li);
  const ridge = mk(rp, rn, rc, ri);

  // ---- liner: continuous dark skin from the pole out past the contour, sunk below the ridges
  const nTh = S(56, 32), nR = S(16, 10);
  const lnP = [], lnN = [], lnI = [];
  const sinkL = 0.05;
  const addL = (th, s) => {
    const phi = s * (F.phiC(th) + 0.05);
    const d = V3(Math.sin(phi) * Math.cos(th), Math.sin(phi) * Math.sin(th), Math.cos(phi));
    const P = surf(d);
    const Ne = ellN(P, E.c, E.r, tN);
    lnP.push(P.x - Ne.x * sinkL, P.y - Ne.y * sinkL, P.z - Ne.z * sinkL);
    lnN.push(Ne.x, Ne.y, Ne.z);
  };
  addL(0, 0);
  for (let r = 1; r <= nR; r++) for (let i = 0; i < nTh; i++) addL((i / nTh) * TAU, r / nR);
  for (let i = 0; i < nTh; i++) lnI.push(0, 1 + i, 1 + ((i + 1) % nTh));
  for (let r = 1; r < nR; r++) for (let i = 0; i < nTh; i++) {
    const a = 1 + (r - 1) * nTh + i, b = 1 + (r - 1) * nTh + ((i + 1) % nTh), c = 1 + r * nTh + i, d = 1 + r * nTh + ((i + 1) % nTh);
    lnI.push(a, c, b, b, c, d);
  }
  const liner = mk(lnP, lnN, null, lnI);
  return { lens, ridge, liner, cells: cells.length };
}
