// The betta's fins never go above the water or into the furnishings: in the bowl itself (its wood,
// rocks, plants and equipment), with the film where the probes find it, through trips up for air (only
// the lips break the surface), rests and swimming among them, no drawn vertex of any fin (caudal,
// dorsal, anal, ventrals, pectorals, their edges) is above the surface or inside the room the fins keep
// round a furnishing; and laying them there leaves the swim as it was.
// Run: node --test betta-fin-room.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { BettaSpecimen } from './src/fish/bettaSpecimen.mjs';
import { BETTA_SURFACE_AT, BETTA_SURFACE_COUNT, bettaSurfaceHeights } from './src/fish/bettaWater.mjs';
import { buildScapePieces } from './src/render/scape/scene.mjs';
import { BED_LEVEL, GLASS_INNER } from './src/render/scape/mesh.mjs';

// (The page's specimen loads its photographs: images that never arrive.)
globalThis.document ??= { createElementNS: () => ({ addEventListener() {}, removeEventListener() {}, style: {} }) };

const LEVEL = 0.181;
const env = { radius: GLASS_INNER, sandLevel: BED_LEVEL, level: LEVEL, iso: 0.5, gravity: [0, -24, 0] };
const obstacles = buildScapePieces({ detail: 0.5 }).flatMap((p) => p.obstacles);
// (Each solid part with the room the fins keep round it: the wood's and the rocks' whole surface.)
const solids = obstacles.filter((o) => (o.fin ?? o.solid) > 0).map((o) => {
  const ab = [o.b[0] - o.a[0], o.b[1] - o.a[1], o.b[2] - o.a[2]];
  return { ...o, room: o.fin ?? o.solid, ab, inv: 1 / (ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2) };
});
const density = (y) => Math.min(Math.max(0.5 + (LEVEL - y) * 20, 0), 1.2);

/** Still water as the probes find it: the film at the level, the bed under them. */
function sense(fish) {
  const probes = new Float32Array(32 * 4), heights = bettaSurfaceHeights(LEVEL);
  for (let k = 0; k < 16; k++) probes[k * 4 + 3] = density(fish.probes[k * 4 + 1]);
  for (let k = 0; k < BETTA_SURFACE_COUNT; k++) probes[(BETTA_SURFACE_AT + k) * 4 + 3] = density(heights[k]);
  return { probes, sand: new Float32Array(32).fill(BED_LEVEL), centroid: [0, -0.2, 0] };
}

/** The worst a fin vertex is above the surface, and into a solid part (sim units; 0 if none). */
function worst(fish) {
  const v = fish.vertices;
  let above = 0, into = 0;
  for (let i = 0; i < v.length; i += 3) {
    if (!fish.finVertex[i / 3]) continue;
    const x = v[i], y = v[i + 1], z = v[i + 2];
    above = Math.max(above, y - LEVEL);
    for (const o of solids) {
      const ab = o.ab, t = Math.max(0, Math.min(1, ((x - o.a[0]) * ab[0] + (y - o.a[1]) * ab[1] + (z - o.a[2]) * ab[2]) * o.inv));
      into = Math.max(into, o.room - Math.hypot(x - o.a[0] - ab[0] * t, y - o.a[1] - ab[1] * t, z - o.a[2] - ab[2] * t));
    }
  }
  return { above, into };
}

test('no fin goes above the water or into the furnishings: up for air, resting, swimming among them', () => {
  const fish = new BettaSpecimen({ textures: false }), s = fish.swim;
  const host = { obstacles, food: null, gapeWant: 0, flared: false, water: { lethargy: 0, gasp: 0, clamp: 0 } };
  let gulped = false, rested = false, most = { above: -1, into: -1 };
  for (let i = 0; i < 60 * 60; i++) {
    // (Up for air soon; then down to lie on the sand, the first chance it has.)
    if (i === 60) s.nextGulp = s.time + 2;
    if (gulped && !rested && ['cruise', 'hover', 'glide'].includes(s.mode)) { s.restReady = 0; s.tryRest(s.bounds(env), fish.waterState, true); }
    fish.step(1 / 60, sense(fish), env, host);
    if (s.mode === 'gulp') gulped = true;
    if (s.mode === 'rest') rested = true;
    const w = worst(fish);
    most = { above: Math.max(most.above, w.above), into: Math.max(most.into, w.into) };
  }
  assert.ok(gulped && rested, `precondition: up for air ${gulped}, rested ${rested}`);
  assert.ok(most.above <= 1e-6, `a fin ${(most.above * 1000).toFixed(2)} mm above the water`);
  assert.ok(most.into <= 1e-4, `a fin ${(most.into * 1000).toFixed(2)} mm into a furnishing`);
});

test('laying the fins leaves the swim as it was: the fin room only meets the fins', () => {
  const run = (list) => {
    const fish = new BettaSpecimen({ textures: false }), path = [];
    const host = { obstacles: list, food: null, gapeWant: 0, flared: false, water: { lethargy: 0, gasp: 0, clamp: 0 } };
    for (let i = 0; i < 60 * 20; i++) { fish.step(1 / 60, sense(fish), env, host); path.push(...fish.swim.position); }
    return path;
  };
  assert.deepEqual(run(obstacles), run(obstacles.filter((o) => o.r > 0 || o.solid > 0)));
});

test('the room the fins keep round the driftwood and the rocks holds every vertex of them above the sand, at either detail', () => {
  for (const detail of [1, 0.5]) {
    for (const piece of buildScapePieces({ detail, only: ['wood', 'rocks'] })) {
      const caps = piece.obstacles.filter((o) => o.fin > 0);
      assert.ok(caps.length > 0 && piece.obstacles.every((o) => o.fin >= 0), `${piece.name}: its fin room`);
      let worst = -Infinity;
      for (const m of piece.meshes) {
        const P = m.positions;
        for (let v = 0; v < P.length; v += 3) {
          if (P[v + 1] < BED_LEVEL) continue;
          let gap = Infinity;
          for (const o of caps) {
            const ab = [o.b[0] - o.a[0], o.b[1] - o.a[1], o.b[2] - o.a[2]];
            const t = Math.max(0, Math.min(1, ((P[v] - o.a[0]) * ab[0] + (P[v + 1] - o.a[1]) * ab[1] + (P[v + 2] - o.a[2]) * ab[2]) / (ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2)));
            gap = Math.min(gap, Math.hypot(P[v] - o.a[0] - ab[0] * t, P[v + 1] - o.a[1] - ab[1] * t, P[v + 2] - o.a[2] - ab[2] * t) - o.fin);
            if (gap < 0) break;
          }
          worst = Math.max(worst, gap);
        }
      }
      assert.ok(worst <= 0, `${piece.name} at detail ${detail}: a vertex ${(worst * 1000).toFixed(1)} mm outside its fin room`);
    }
  }
});
