// The betta bowl's furnishings assembled (src/render/scape/scene.mjs): every mesh is sound, they fit
// the triangle and time budgets, no piece passes through another or into another's solid obstacle,
// the fish's open water is kept clear, the shader has every material, and the tracer packs them all.
// Run: node --test scape-scene.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildScape, buildScapePieces, SCAPE_PIECE_WGSL, SCAPE_WATER } from './src/render/scape/scene.mjs';
import { BED_LEVEL, MAT, checkMesh } from './src/render/scape/mesh.mjs';
import { packScape, scapeMeshWGSL, SCAPE_MAX_DEPTH, SCAPE_MAX_HEIGHT, SCAPE_TEX_WIDTH } from './src/render/scape/scapeBVH.mjs';

const TRIANGLE_BUDGET = 400000;
// (Only a gross regression: a cold build here takes ~1.2 s on a fast desktop, and twice that under load.)
const BUILD_BUDGET_MS = 6000;
/** How far into the fish's water a leaf's tip may reach. */
const LEAF_TIP = 0.02;
/** Contact below this height counts as in the sand (hidden, and where the pieces' buried parts
 *  may meet). */
const VISIBLE = BED_LEVEL + 0.002;

const t0 = performance.now();
const scape = buildScape();
const buildMs = performance.now() - t0;
const pieces = buildScapePieces();

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const fmt = (p) => p.map((x) => x.toFixed(3)).join(', ');

function* vertices(piece) {
  for (const m of piece.meshes) {
    for (let v = 0; v < m.positions.length / 3; v++) yield [m.positions[v * 3], m.positions[v * 3 + 1], m.positions[v * 3 + 2]];
  }
}

/** A piece's triangles hashed into cells (for the crossing test). */
function triangleGrid(piece, cell) {
  const tris = [], grid = new Map();
  for (const m of piece.meshes) {
    const P = m.positions, I = m.indices;
    for (let t = 0; t < I.length / 3; t++) {
      const c = [0, 1, 2].map((j) => [P[I[t * 3 + j] * 3], P[I[t * 3 + j] * 3 + 1], P[I[t * 3 + j] * 3 + 2]]);
      const idx = tris.push(c) - 1;
      const lo = [0, 1, 2].map((k) => Math.floor(Math.min(c[0][k], c[1][k], c[2][k]) / cell));
      const hi = [0, 1, 2].map((k) => Math.floor(Math.max(c[0][k], c[1][k], c[2][k]) / cell));
      for (let i = lo[0]; i <= hi[0]; i++) for (let j = lo[1]; j <= hi[1]; j++) for (let k = lo[2]; k <= hi[2]; k++) {
        const key = `${i},${j},${k}`;
        const list = grid.get(key);
        if (list) list.push(idx);
        else grid.set(key, [idx]);
      }
    }
  }
  return { tris, grid, cell };
}

/** Where the segment p..q meets the triangle (corners included), or null. */
function segmentHit(p, q, [a, b, c]) {
  const d = sub(q, p), e1 = sub(b, a), e2 = sub(c, a);
  const h = cross(d, e2), det = dot(e1, h);
  if (Math.abs(det) < 1e-16) return null;
  const s = sub(p, a), u = dot(s, h) / det;
  if (u < 0 || u > 1) return null;
  const r = cross(s, e1), v = dot(d, r) / det;
  if (v < 0 || u + v > 1) return null;
  const t = dot(e2, r) / det;
  return t >= 0 && t <= 1 ? [p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t] : null;
}

test('every mesh is sound, and the furnishings fit their budgets', () => {
  let triangles = 0;
  for (const m of scape.meshes) {
    assert.deepEqual(checkMesh(m), [], `${m.name}: ${checkMesh(m).join('; ')}`);
    triangles += m.indices.length / 3;
  }
  console.log(`  ${scape.meshes.length} meshes, ${triangles} triangles, ${scape.obstacles.length} obstacles, built in ${buildMs.toFixed(0)} ms`);
  assert.ok(triangles <= TRIANGLE_BUDGET, `${triangles} triangles (budget ${TRIANGLE_BUDGET})`);
  assert.ok(buildMs < BUILD_BUDGET_MS, `buildScape took ${buildMs.toFixed(0)} ms (budget ${BUILD_BUDGET_MS})`);
});

test('the pieces build alike every time, and buildScape is all of them in turn', () => {
  assert.deepEqual(pieces.map((p) => p.name), ['wood', 'rocks', 'plants']);
  const meshes = pieces.flatMap((p) => p.meshes);
  assert.equal(scape.meshes.length, meshes.length);
  scape.meshes.forEach((m, i) => {
    assert.equal(m.name, meshes[i].name);
    for (const k of ['positions', 'normals', 'attrs', 'indices', 'materials']) assert.deepEqual(m[k], meshes[i][k], `${m.name}.${k} differs between builds`);
  });
  assert.deepEqual(scape.obstacles, pieces.flatMap((p) => p.obstacles));
});

test('no piece passes through another (no edge of one crosses another\'s surface above the sand)', () => {
  const grids = new Map(pieces.map((p) => [p.name, triangleGrid(p, 0.02)]));
  for (const a of pieces) {
    for (const b of pieces) {
      if (a === b) continue;
      const { tris, grid, cell } = grids.get(b.name);
      let crossings = 0, first = null;
      for (const m of a.meshes) {
        const P = m.positions, I = m.indices;
        const at = (v) => [P[v * 3], P[v * 3 + 1], P[v * 3 + 2]];
        for (let t = 0; t < I.length / 3; t++) {
          for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) {
            const p = at(I[t * 3 + i]), q = at(I[t * 3 + j]);
            if (Math.max(p[1], q[1]) < VISIBLE) continue;
            const seen = new Set();
            const lo = [0, 1, 2].map((k) => Math.floor(Math.min(p[k], q[k]) / cell));
            const hi = [0, 1, 2].map((k) => Math.floor(Math.max(p[k], q[k]) / cell));
            for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) {
              for (const idx of grid.get(`${x},${y},${z}`) ?? []) {
                if (seen.has(idx)) continue;
                seen.add(idx);
                const hit = segmentHit(p, q, tris[idx]);
                if (hit && hit[1] > VISIBLE) {
                  crossings++;
                  first ??= hit;
                }
              }
            }
          }
        }
      }
      assert.equal(crossings, 0, `${a.name}'s edges cross ${b.name} ${crossings} times above the sand (first at ${first && fmt(first)})`);
    }
  }
});

test('no vertex of one piece lies inside another\'s solid obstacle', () => {
  const segDist = (p, a, b) => {
    const ab = sub(b, a), l2 = dot(ab, ab);
    const t = l2 > 0 ? Math.min(Math.max(dot(sub(p, a), ab) / l2, 0), 1) : 0;
    return Math.hypot(...sub(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]));
  };
  const points = new Map(pieces.map((p) => [p.name, [...vertices(p)].filter((q) => q[1] >= BED_LEVEL)]));
  let nearest = Infinity;
  for (const owner of pieces) {
    for (const o of owner.obstacles) {
      if (!(o.solid > 0)) continue;
      const lo = [0, 1, 2].map((k) => Math.min(o.a[k], o.b[k]) - o.solid - 0.01);
      const hi = [0, 1, 2].map((k) => Math.max(o.a[k], o.b[k]) + o.solid + 0.01);
      for (const other of pieces) {
        if (other === owner) continue;
        for (const p of points.get(other.name)) {
          if (p[0] < lo[0] || p[0] > hi[0] || p[1] < lo[1] || p[1] > hi[1] || p[2] < lo[2] || p[2] > hi[2]) continue;
          const gap = segDist(p, o.a, o.b) - o.solid;
          nearest = Math.min(nearest, gap);
          assert.ok(gap >= 0, `${other.name}'s vertex at ${fmt(p)} is ${(-gap).toFixed(4)} inside ${owner.name}'s solid obstacle ${fmt(o.a)} .. ${fmt(o.b)} (solid ${o.solid})`);
        }
      }
    }
  }
  console.log(`  nearest any vertex comes to another piece's solid obstacle: ${nearest.toFixed(4)}`);
});

test('the fish\'s open water holds no wood or rock, and at most a leaf\'s tip', () => {
  const into = (p) => Math.min(...[0, 1, 2].map((k) => Math.min(p[k] - SCAPE_WATER.lo[k], SCAPE_WATER.hi[k] - p[k])));
  for (const piece of pieces) {
    let deepest = -Infinity, where = null;
    for (const p of vertices(piece)) {
      const d = into(p);
      if (d > deepest) [deepest, where] = [d, p];
    }
    if (piece.name === 'plants') assert.ok(deepest <= LEAF_TIP, `a leaf reaches ${deepest.toFixed(4)} into the fish's water at ${fmt(where)}`);
    else assert.ok(deepest <= 0, `${piece.name} reaches ${deepest.toFixed(4)} into the fish's water at ${fmt(where)}`);
  }
});

test('the shader has every material from the pieces, and the tracer packs them all', () => {
  assert.equal(SCAPE_PIECE_WGSL.length, pieces.length);
  for (const src of SCAPE_PIECE_WGSL) assert.equal(typeof src, 'string');
  const all = SCAPE_PIECE_WGSL.join('\n');
  for (const name of ['bark', 'woodEnd', 'rock', 'leafBig', 'leafSmall', 'stem', 'root']) {
    assert.equal(all.match(new RegExp(`\\bfn\\s+scape_mat_${name}\\s*\\(`, 'g'))?.length ?? 0, 1, `scape_mat_${name} is not defined exactly once`);
  }
  assert.ok(scapeMeshWGSL(SCAPE_PIECE_WGSL).length > all.length);
  const used = new Set(scape.meshes.flatMap((m) => [...new Set(m.materials)]));
  assert.deepEqual([...used].sort(), Object.values(MAT).sort());

  const packed = packScape(scape.meshes);
  console.log(`  packed: ${packed.triangles} triangles, ${packed.nodes} nodes, depth ${packed.depth}, texture ${packed.width} x ${packed.height} (${((packed.data.byteLength / 1048576)).toFixed(1)} MB), ${packed.buildMs.toFixed(0)} ms`);
  assert.equal(packed.width, SCAPE_TEX_WIDTH);
  assert.ok(packed.height <= SCAPE_MAX_HEIGHT, `${packed.height} rows (at most ${SCAPE_MAX_HEIGHT})`);
  assert.ok(packed.depth <= SCAPE_MAX_DEPTH);
  assert.equal(packed.triangles, scape.meshes.reduce((n, m) => n + m.indices.length / 3, 0));
});
