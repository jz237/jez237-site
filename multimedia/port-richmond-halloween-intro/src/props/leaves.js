// Dead leaves: thousands of instanced static leaves (gutters, facade edges, stoop corners, steps, street) plus a
// few hundred that skitter along the pavement when the wind gusts (windGusts in timings.js; windGust1 scripted).
// Everything derives from t (gust integrals), no accumulated state.
import * as THREE from 'three';
import { SITE } from './sitedata.js';
import { HERO, kitPoint, CURB, inBauderZone } from './site.js';
import { windGusts } from './timings.js';
import { leafAtlasTexture } from './textures.js';
import { rng, bump, bumpIntegral, clamp } from './util.js';

const COUNTS = { high: { stat: 6500, dyn: 260 }, medium: { stat: 3800, dyn: 160 }, low: { stat: 1600, dyn: 70 } };

function leafGeometry() {
  // 3x3 grid, folded along the midrib, tips curled
  const pos = [], uv = [], idx = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 0.5, z = (j - 1) * 0.5;
    const y = Math.abs(x) * 0.22 + (j !== 1 ? 0.07 : 0) + (i !== 1 && j !== 1 ? 0.04 : 0);
    pos.push(x * 0.55, y * 0.6, z);
    uv.push(i / 2, j / 2);
  }
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { const a = j * 3 + i, b = a + 1, c = a + 3, d = c + 1; idx.push(a, c, b, b, c, d); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function leafMaterial() {
  const m = new THREE.MeshStandardMaterial({ name: 'DeadLeaf', map: leafAtlasTexture(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.5, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 aCell;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv = vMapUv * vec2(0.25, 0.5) + aCell;\n#endif');
  };
  m.customProgramCacheKey = () => 'deadleaf';
  return m;
}

function stoopFootprints() {
  const fp = [];
  for (const it of SITE.items) {
    if (it.k !== 'steps') continue;
    const depth = it.m.endsWith('_3') ? 1.11 : it.m.endsWith('_2') ? 0.83 : 0.55;
    const tops = it.m.endsWith('_3') ? [0.54, 0.36, 0.18] : it.m.endsWith('_2') ? [0.36, 0.18] : [0.18];
    fp.push({ it, depth, tops });
  }
  return fp;
}
// if (x,z) is on a stoop, return the tread height there, else null
function stoopHeight(fps, x, z) {
  for (const f of fps) {
    const dx = x - f.it.p[0], dz = z - f.it.p[2];
    const bx = dx * f.it.ax[0] + dz * f.it.ax[1], by = dx * f.it.out[0] + dz * f.it.out[1];
    if (Math.abs(bx) <= 0.6 && by >= 0 && by <= f.depth) {
      const t = by < 0.548 ? 0 : Math.min(f.tops.length - 1, 1 + Math.floor((by - 0.548) / 0.28));
      return f.it.p[1] + f.tops[t];
    }
  }
  return null;
}

export function buildLeaves(ctx) {
  const group = new THREE.Group(); group.name = 'DeadLeaves';
  const geo = leafGeometry();
  const mat = leafMaterial();
  const fps = stoopFootprints();
  const maxC = COUNTS.high;
  const R = rng(2468);
  // facade x on each side (from the game data: SE ~5.45-5.56 at the door/window kit plane; NW ~-5.3..-5.6)
  const facadeX = (side, z) => (side > 0 ? (z > 18.5 ? 5.05 : z < -17.1 ? 5.75 : 5.5) : (z > -0.13 ? -5.5 : -5.32));

  // ---------------- static ----------------
  const statGeo = geo.clone();
  const aCell = new Float32Array(maxC.stat * 2);
  const stat = new THREE.InstancedMesh(statGeo, mat, maxC.stat);
  stat.name = 'LeavesStatic';
  stat.receiveShadow = true;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  let n = 0;
  const clump = (z, side, seed) => 0.5 + 0.5 * Math.sin(z * 0.9 + seed) * Math.sin(z * 0.37 + seed * 2);
  let guard = 0;
  while (n < maxC.stat && guard++ < maxC.stat * 6) {
    const r = R();
    let x, z, side = R() < 0.55 ? 1 : -1;
    z = -30 + R() * 55;
    if (r < 0.4) { // gutter band (road side of the curb), clumped
      x = side > 0 ? CURB.se - 0.03 - Math.pow(R(), 2) * 0.35 : CURB.nw + 0.03 + Math.pow(R(), 2) * 0.35;
      if (R() > clump(z, side, side > 0 ? 1.3 : 4.1) + 0.25) continue;
    } else if (r < 0.62) { // against the facades / stoop corners
      const fx = facadeX(side, z);
      x = fx - side * (0.02 + Math.pow(R(), 1.8) * 0.45);
      if (R() > clump(z * 1.7, side, 2.2) + 0.35) continue;
    } else if (r < 0.8) { // sidewalk scatter
      x = side > 0 ? CURB.se + 0.05 + R() * (facadeX(1, z) - CURB.se - 0.1) : facadeX(-1, z) + 0.05 + R() * (CURB.nw - facadeX(-1, z) - 0.1);
    } else if (r < 0.93) { // street scatter
      x = (R() - 0.5) * 5.6;
    } else { // near the parked cars on the NW side
      x = -1.9 + (R() - 0.5) * 2.2;
    }
    let y = stoopHeight(fps, x, z);
    if (y === null) y = ctx.groundY(x, z);
    const scale = 0.055 + Math.pow(R(), 1.5) * 0.09;
    p.set(x, y + 0.002 + R() * 0.004, z);
    e.set((R() - 0.5) * 0.35, R() * Math.PI * 2, (R() - 0.5) * 0.35);
    q.setFromEuler(e);
    s.set(scale, scale, scale * (0.9 + R() * 0.3));
    m4.compose(p, q, s);
    stat.setMatrixAt(n, m4);
    const cell = Math.floor(R() * 8);
    aCell[n * 2] = (cell % 4) * 0.25; aCell[n * 2 + 1] = Math.floor(cell / 4) * 0.5;
    const wet = 0.55 + R() * 0.45;
    c.setRGB(wet, wet * (0.92 + R() * 0.1), wet * (0.85 + R() * 0.1));
    stat.setColorAt(n, c);
    n++;
  }
  statGeo.setAttribute('aCell', new THREE.InstancedBufferAttribute(aCell, 2));
  stat.count = Math.min(n, COUNTS[ctx.quality]?.stat ?? n);
  stat.instanceMatrix.needsUpdate = true;
  group.add(stat);

  // ---------------- dynamic (skittering) ----------------
  const dynGeo = geo.clone();
  const dCell = new Float32Array(maxC.dyn * 2);
  const dyn = new THREE.InstancedMesh(dynGeo, mat, maxC.dyn);
  dyn.name = 'LeavesSkitter';
  dyn.receiveShadow = true;
  dyn.frustumCulled = false;
  dyn.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const D = [];
  for (let i = 0; i < maxC.dyn; i++) {
    // half of them in the first shot's view (street between z 8 and 22), the rest along the block
    const first = i < maxC.dyn * 0.6;   // most of them in the opening shot's view (street ahead of the title camera)
    const z = first ? 10.5 + R() * 12 : -28 + R() * 50;
    const onStreet = first ? R() < 0.85 : R() < 0.6;
    const side = R() < 0.5 ? 1 : -1;
    const x = onStreet ? (R() - 0.5) * 5.4 : side > 0 ? CURB.se + 0.1 + R() * 2.0 : CURB.nw - 0.1 - R() * 1.9;
    const lim = onStreet ? [CURB.nw + 0.04, CURB.se - 0.04] : side > 0 ? [CURB.se + 0.04, 5.35] : [-5.25, CURB.nw - 0.04];
    // big dry plane/maple leaves catch the light and read on camera; some smaller pear leaves
    const big = R() < 0.65;
    D.push({ x, z, lim, k: 1.0 + R() * 1.5, thr: 0.12 + R() * 0.35, rot: (R() - 0.5) * 0.8, yaw: R() * 6.283, scale: big ? 0.13 + R() * 0.08 : 0.07 + R() * 0.05, flip: 4 + R() * 6, hop: R(), ph: R() * 6.28 });
    const cell = big ? 5 + Math.floor(R() * 3) : Math.floor(R() * 5);
    dCell[i * 2] = (cell % 4) * 0.25; dCell[i * 2 + 1] = Math.floor(cell / 4) * 0.5;
    const dry = 0.9 + R() * 0.35; c.setRGB(dry, dry * 0.96, dry * 0.88); dyn.setColorAt(i, c);
  }
  dynGeo.setAttribute('aCell', new THREE.InstancedBufferAttribute(dCell, 2));
  dyn.count = COUNTS[ctx.quality]?.dyn ?? maxC.dyn;
  group.add(dyn);
  const gdir = windGusts.map((g) => [Math.sin(g.dir), -Math.cos(g.dir)]);

  function update(t) {
    for (let i = 0; i < dyn.count; i++) {
      const L = D[i];
      let dx = 0, dz = 0, lift = 0, dist = 0, rz = 0, rx = 0;
      const ca = Math.cos(L.rot), sa = Math.sin(L.rot);
      for (let g = 0; g < windGusts.length; g++) {
        const G = windGusts[g];
        const s0 = G.strength - L.thr;
        if (s0 <= 0) continue;
        const I = s0 * bumpIntegral(t, G.t, G.rise, G.dur) * L.k;
        if (I === 0) continue;
        const Ifin = s0 * L.k * G.dur * 0.5;
        const frac = I / Ifin;
        const vx = gdir[g][0] * ca - gdir[g][1] * sa, vz = gdir[g][0] * sa + gdir[g][1] * ca;
        dx += vx * I; dz += vz * I; dist += I;
        lift += s0 * bump(t, G.t, G.rise, G.dur);
        // tumbling: each gust turns the leaf over a whole number of half-turns, so it always settles flat
        rz += Math.PI * Math.round((Ifin * L.flip) / Math.PI) * frac;
        rx += Math.PI * Math.round((Ifin * L.flip * 0.3) / Math.PI) * frac;
      }
      const x = clamp(L.x + dx, L.lim[0], L.lim[1]), z = L.z + dz;
      const y = ctx.groundY(x, z) + 0.003 + 0.035 * lift * L.hop * Math.abs(Math.sin(dist * 4 + L.ph));
      p.set(x, y, z);
      e.set(rx + 0.3 * Math.sin(t * 13 + L.ph) * Math.min(1, lift), L.yaw + dist * 0.8, rz);
      q.setFromEuler(e);
      s.set(L.scale, L.scale, L.scale);
      m4.compose(p, q, s);
      dyn.setMatrixAt(i, m4);
    }
    dyn.instanceMatrix.needsUpdate = true;
  }
  return {
    group,
    update,
    setQuality(qq) { const cc = COUNTS[qq] || COUNTS.high; stat.count = Math.min(n, cc.stat); dyn.count = cc.dyn; },
    api: { static: stat, skitter: dyn, gusts: windGusts },
  };
}
