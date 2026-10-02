#!/usr/bin/env node
// Exploded-state clash check: voxelises the vertices of every top-level part at the given explode value
// and lists the top-level pairs that share voxels (parts that interpenetrate or sit inside each other).
//   node overlap.cjs [explode=1] [cell=0.9]
const { spawnSync } = require('child_process');
const path = require('path');

const ex = parseFloat(process.argv[2] ?? '1');
const cell = parseFloat(process.argv[3] ?? '0.9');

const expr = `(() => {
  const A = window.__apx, bee = A.bee, THREE = A.THREE;
  const cell = ${cell};
  bee.setExplode(${ex}, true);
  bee.root.updateMatrixWorld(true);
  const grid = new Map();
  const v = new THREE.Vector3();
  const tops = bee.tops.map((t) => t.id);
  for (let ti = 0; ti < bee.tops.length; ti++) {
    for (const p of bee.tops[ti].walk()) {
      for (const m of p.meshes) {
        if (m.userData.fur || m.layers.isEnabled(6) || m.isInstancedMesh) continue;
        const pos = m.geometry.attributes.position;
        if (!pos) continue;
        m.updateWorldMatrix(true, false);
        const stride = Math.max(1, Math.floor(pos.count / 3000));
        for (let i = 0; i < pos.count; i += stride) {
          v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
          const k = ((Math.floor(v.x / cell) + 1024) * 2048 + (Math.floor(v.y / cell) + 1024)) * 2048 + (Math.floor(v.z / cell) + 1024);
          let e = grid.get(k);
          if (!e) { e = new Map(); grid.set(k, e); }
          e.set(ti, (e.get(ti) || 0) + 1);
        }
      }
    }
  }
  const pairs = new Map();
  for (const [k, e] of grid) {
    if (e.size < 2) continue;
    const ids = [...e.keys()].sort((a, b) => a - b);
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const pk = ids[i] + ',' + ids[j];
      let q = pairs.get(pk);
      if (!q) { q = { a: tops[ids[i]], b: tops[ids[j]], cells: 0, x: 0, y: 0, z: 0 }; pairs.set(pk, q); }
      q.cells++;
      const z = (k % 2048) - 1024, y = (Math.floor(k / 2048) % 2048) - 1024, x = Math.floor(k / 4194304) - 1024;
      q.x += x * cell; q.y += y * cell; q.z += z * cell;
    }
  }
  const out = [...pairs.values()].map((q) => ({ a: q.a, b: q.b, cells: q.cells, at: [q.x / q.cells, q.y / q.cells, q.z / q.cells].map((n) => Math.round(n * 10) / 10) }));
  out.sort((p, q) => q.cells - p.cells);
  bee.setExplode(0, true);
  return { occupied: grid.size, pairs: out };
})()`;

const shot = path.join(__dirname, 'shot.cjs');
const tmp = path.join(require('os').tmpdir(), 'apx9-overlap-' + process.pid + '.png');
const r = spawnSync('node', [shot, '--q', '', '--snap', '{"explode":0}', '--out', tmp, '--eval', expr, '--w', '640', '--h', '400'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 400000 });
const out = (r.stdout || '') + (r.stderr || '');
const m = out.match(/^\[eval\] (.*)$/m);
if (!m) { console.log(out.slice(-2500)); console.log('FAIL overlap produced no result'); process.exit(1); }
const j = JSON.parse(m[1]);
console.log(`explode ${ex}, cell ${cell} mm: ${j.occupied} occupied voxels, ${j.pairs.length} clashing top-level pairs`);
for (const p of j.pairs.slice(0, 40)) console.log(`  ${String(p.cells).padStart(5)} cells  ${p.a} x ${p.b}  centroid (${p.at.join(', ')})`);
