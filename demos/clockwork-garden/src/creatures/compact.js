import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Rig compaction for the interactive modes' creatures. A clockwork creature
// is built from 25–85 meshes (bands, plates, eyes, rivets, leg segments,
// wings); each is a draw call (and a shadow draw) every frame it is in view.
// Most never move relative to some part of the rig: a bee's bands and plates
// ride its body, an eye rides the head. Here the rig is posed through a spread
// of poses; every mesh that keeps the same transform relative to an ancestor
// in all of them (and never changes visibility) is merged, with the others
// that share that ancestor and material, into one mesh under the ancestor.
// What moves (wings, leg joints, antennae, a head that turns) keeps its own
// meshes and keeps moving. The film's cast is never compacted.

// a spread of poses covering every rig's parameters (unknown keys are ignored)
const POSES = [
  { t: 0 },
  { t: 0.37, flap: 1, open: 0.6, grip: 0, spread: 1, fold: 0, walk: 0.25, pollen: 1, perch: 0, glide: 0.5, wings: 1, look: 0.3, headYaw: 0.3, headTilt: 0.2, headPitch: 0.3, pitch: -0.3, roll: 0.2, ruffle: 0.3, tailSpread: 0.8, raise: 0.5, fan: 0.3, freq: 3.1 },
  { t: 1.13, flap: 0.85, open: 1, grip: 1, spread: 0, fold: 1, walk: 0.7, pollen: 0, perch: 1, glide: 0, wings: 0, look: -0.4, headYaw: -0.5, headTilt: -0.2, headPitch: -0.2, pitch: 0.4, roll: -0.3, ruffle: 0, tailSpread: 0.2, raise: 0, fan: 1, freq: 17.3 },
  { t: 2.71, flap: 0.3, open: 0.2, grip: 0.5, spread: 0.5, fold: 0.5, walk: null, pollen: 0.5, perch: 0.5, glide: 1, wings: 0.5, look: 0.1, pitch: -0.5, roll: 0, ruffle: 0.6, freq: 24.7, collect: 0.6, brush: 0.5 },
  { t: 4.05, flap: 0, open: 0, grip: 1, spread: 0.2, fold: 0, walk: 0.5, pollen: 0, perch: 0, glide: 0, wings: 0, freq: 2.2 },
];

const same = (a, b) => { for (let i = 0; i < 16; i++) if (Math.abs(a[i] - b[i]) > 1e-6) return false; return true; };

export function compactRig(rig, { poses = POSES } = {}) {
  const root = rig.group;
  if (!root || typeof rig.setPose !== 'function') return { before: 0, after: 0 };
  const nodes = [];
  root.traverse((o) => nodes.push(o));
  const meshes = nodes.filter((o) => o.isMesh && !o.isInstancedMesh && !o.isSkinnedMesh && !Array.isArray(o.material) && !o.morphTargetInfluences);
  const before = nodes.filter((o) => o.isMesh).length;
  // each node's world matrix and visibility in each pose
  const W = new Map(nodes.map((o) => [o, []]));
  const vis = new Map(nodes.map((o) => [o, []]));
  for (const p of poses) {
    rig.setPose(p);
    root.updateMatrixWorld(true);
    for (const o of nodes) { W.get(o).push(o.matrixWorld.clone()); vis.get(o).push(o.visible); }
  }
  const inv = new THREE.Matrix4(), rel = new THREE.Matrix4();
  const relTo = (a, m, i) => rel.multiplyMatrices(inv.copy(W.get(a)[i]).invert(), W.get(m)[i]);
  // the highest ancestor each mesh is rigid against (null: it moves on its own)
  const groups = new Map();
  for (const m of meshes) {
    const chain = [];
    for (let p = m.parent; p; p = p.parent) { chain.push(p); if (p === root) break; }
    if (chain[chain.length - 1] !== root) continue;
    let anchor = null;
    for (let k = chain.length - 1; k >= 0 && !anchor; k--) {
      const a = chain[k];
      // visibility between the anchor and the mesh must never change
      const path = [m, ...chain.slice(0, k)];
      if (path.some((o) => vis.get(o).some((v) => v !== vis.get(o)[0]) || !vis.get(o)[0])) break;
      const first = relTo(a, m, 0).elements.slice();
      let rigid = true;
      for (let i = 1; i < poses.length && rigid; i++) rigid = same(first, relTo(a, m, i).elements);
      if (rigid) anchor = { a, m: new THREE.Matrix4().fromArray(first) };
    }
    if (!anchor) continue;
    const g = m.geometry;
    const layout = Object.keys(g.attributes).sort().join(',') + (g.index ? '|i' : '|n') + (Object.keys(g.morphAttributes).length ? '|morph' : '');
    if (layout.includes('|morph') || Object.values(g.attributes).some((x) => x.isInterleavedBufferAttribute)) continue;
    const key = [anchor.a.id, m.material.id, m.castShadow, m.receiveShadow, m.renderOrder, m.frustumCulled, m.layers.mask, layout].join('/');
    let list = groups.get(key);
    if (!list) groups.set(key, (list = []));
    list.push({ mesh: m, anchor: anchor.a, rel: anchor.m });
  }
  // merge each group of two or more under its anchor
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const geos = list.map(({ mesh, rel }) => {
      const g = mesh.geometry.clone();
      g.applyMatrix4(rel);
      // a mirrored part: put its triangles back to front-facing
      if (rel.determinant() < 0) {
        if (g.index) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } }
        else for (const a of Object.values(g.attributes)) { const n = a.itemSize, arr = a.array; for (let i = 0; i + 3 * n <= arr.length; i += 3 * n) for (let j = 0; j < n; j++) { const t = arr[i + n + j]; arr[i + n + j] = arr[i + 2 * n + j]; arr[i + 2 * n + j] = t; } }
      }
      return g;
    });
    const merged = mergeGeometries(geos, false);
    if (!merged) continue;
    merged.computeBoundingSphere();
    const src = list[0].mesh;
    const out = new THREE.Mesh(merged, src.material);
    out.castShadow = src.castShadow;
    out.receiveShadow = src.receiveShadow;
    out.renderOrder = src.renderOrder;
    out.frustumCulled = src.frustumCulled;
    out.layers.mask = src.layers.mask;
    out.name = 'compacted';
    list[0].anchor.add(out);
    for (const { mesh } of list) mesh.removeFromParent();
    for (const g of geos) g.dispose();
  }
  rig.setPose(poses[0]);
  let after = 0;
  root.traverse((o) => { if (o.isMesh) after++; });
  return { before, after };
}
