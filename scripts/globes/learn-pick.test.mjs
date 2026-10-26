// Learn mode's taps (src/app/learn/pick.mjs): the line of sight is bent at the glass and the water as
// Snell's law has it, and followed through them it lands on what the viewer sees there. Each check
// starts from a point on something in the bowl (a furnishing's triangle, the fish, the nest, ...),
// follows the light from it back out through the water and the glass to the camera's side (light
// takes the same path either way), and asks the picker about the ray it arrives on: it must come to
// that point, and name what is there. The furnishings are the real ones (scapeBuild.mjs, packed as
// the page has them), in a bowl turned and tipped.
// Run: node --test learn-pick.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { enterSphere, FISH_REACH, IOR_GLASS, IOR_WATER, leaveSphere, MATERIAL_TOPICS, MESH_TOPICS, pickBowl, refract, topicOf, TOPIC_IDS } from './src/app/learn/pick.mjs';
import { buildFurnishings } from './src/render/scape/scapeBuild.mjs';
import { buildScapePieces } from './src/render/scape/scene.mjs';
import { traceCPU } from './src/render/scape/scapeBVH.mjs';
import { BED_LEVEL, MAT } from './src/render/scape/mesh.mjs';
import { globeConfig } from './src/config.ts';

const OUTER = globeConfig.outerRadius;
const INNER = globeConfig.innerRadius;
const MOUTH = 0.88;
const LEVEL = 0.2;
const DETAIL = 0.25;

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(...a);
const unit = (a) => a.map((v) => v / len(a));
const add = (a, b, k = 1) => a.map((v, i) => v + b[i] * k);
const dist = (a, b) => len(add(a, b, -1));

/** A turn (column-major 3x3, the bowl's frame to the sim frame), as GlobeController builds it:
 *  Rz(theta) Rx(lean) Ry(twist). */
function rotation(theta, lean, twist) {
  const rz = [[Math.cos(theta), -Math.sin(theta), 0], [Math.sin(theta), Math.cos(theta), 0], [0, 0, 1]];
  const rx = [[1, 0, 0], [0, Math.cos(lean), -Math.sin(lean)], [0, Math.sin(lean), Math.cos(lean)]];
  const ry = [[Math.cos(twist), 0, Math.sin(twist)], [0, 1, 0], [-Math.sin(twist), 0, Math.cos(twist)]];
  const mul = (a, b) => a.map((row, i) => b[0].map((_, j) => row.reduce((s, _, k) => s + a[i][k] * b[k][j], 0)));
  const m = mul(mul(rz, rx), ry);
  return [m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]];
}
const toSim = (m, v) => [m[0] * v[0] + m[3] * v[1] + m[6] * v[2], m[1] * v[0] + m[4] * v[1] + m[7] * v[2], m[2] * v[0] + m[5] * v[1] + m[8] * v[2]];
const toBowl = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];

/**
 * The camera's ray that sees point p (sim frame), the light leaving it along v (unit, sim frame)
 * through the water (wet) or the air over it, then the glass: { o, d, path } (d towards p), or null
 * where the light goes another way (out through the open mouth, up through the film, reflected).
 */
function sightOf(p, v, wet) {
  const s = leaveSphere(p, v, INNER);
  const q1 = add(p, v, s);
  // (Not through the film on the way, nor out at the mouth.)
  if (wet ? q1[1] >= LEVEL : q1[1] <= LEVEL) return null;
  const g = refract(v, unit(q1).map((x) => -x), (wet ? IOR_WATER : 1) / IOR_GLASS);
  if (!g) return null;
  const q0 = add(q1, g, leaveSphere(q1, g, OUTER));
  const u = refract(g, unit(q0).map((x) => -x), IOR_GLASS);
  if (!u) return null;
  return { o: add(q0, u, 5), d: u.map((x) => -x), q0, q1 };
}

/** The bowl the picker is given: turned by rot, the furnishings as given, nothing else unless said. */
const bowlOf = (rot, scape, extra = {}) => ({ outer: OUTER, inner: INNER, mouth: MOUTH, rotation: rot, level: LEVEL, bed: BED_LEVEL, scape, fish: null, leaf: null, nest: null, lid: null, ...extra });

test("Snell's law: the bent ray keeps n sin(angle) and its plane; past the critical angle it is reflected", () => {
  let rand = 7;
  const random = () => ((rand = (rand * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 200; k++) {
    const n = unit([random() - 0.5, random() - 0.5, random() - 0.5]);
    // (A direction against n, at any angle up to grazing.)
    let d = unit([random() - 0.5, random() - 0.5, random() - 0.5]);
    if (dot(d, n) > 0) d = d.map((x) => -x);
    for (const [n1, n2] of [[1, IOR_GLASS], [IOR_GLASS, IOR_WATER], [IOR_GLASS, 1], [1, IOR_WATER], [IOR_WATER, IOR_GLASS]]) {
      const t = refract(d, n, n1 / n2);
      const sin1 = len(cross(d, n));
      if (n1 * sin1 > n2) {
        assert.equal(t, null, 'past the critical angle');
        continue;
      }
      assert.ok(Math.abs(len(t) - 1) < 1e-12);
      assert.ok(Math.abs(n1 * sin1 - n2 * len(cross(t, n))) < 1e-9, 'n sin(angle) kept');
      assert.ok(dot(t, n) < 0, 'on through the surface');
      assert.ok(Math.abs(dot(cross(d, n), t)) < 1e-9, 'in the plane of incidence');
    }
  }
  // Straight on, a ray is not bent.
  assert.deepEqual(refract([0, 0, -1], [0, 0, 1], 1 / IOR_GLASS).map((x) => Math.round(x * 1e12) / 1e12), [0, 0, -1]);
});

test('every topic the picker can name is one; every furnishing it knows maps to one, and one it does not, to none', () => {
  for (const t of [...Object.values(MATERIAL_TOPICS), ...Object.values(MESH_TOPICS)]) assert.ok(TOPIC_IDS.includes(t), t);
  // Every material the furnishings are made of today is something (a stem or a root by its plant's
  // mesh).
  for (const piece of buildScapePieces({ detail: DETAIL })) {
    for (const mesh of piece.meshes) {
      for (const m of new Set(mesh.materials)) assert.ok(topicOf(m, mesh.name), `${mesh.name} material ${m}`);
    }
  }
  assert.equal(topicOf(MAT.STEM, 'plantTall'), 'anubias');
  assert.equal(topicOf(MAT.ROOT, 'plantSmall'), 'rosette');
  // The equipment's (its own meshes, whatever they are called).
  assert.deepEqual([8, 9, 10, 11, 12].map((m) => topicOf(m, 'equipment')), ['heater', 'heater', 'filter', 'filter', 'heater']);
  // Ones it does not know: no card, rather than a wrong one.
  assert.equal(topicOf(13, 'something new'), null);
  assert.equal(topicOf(MAT.STEM, 'something new'), null);
});

test('a tap lands on the furnishing seen there, through the glass and the water, in a bowl turned and tipped', () => {
  const f = buildFurnishings(256, INNER, -1.2, DETAIL);
  const scape = { data: f.data, parts: f.parts };
  const meshes = buildScapePieces({ detail: DETAIL }).flatMap((p) => p.meshes);
  assert.deepEqual(f.parts, meshes.map((m) => [m.name, m.positions.length / 3]));
  for (const rot of [rotation(0, 0, 0), rotation(0.12, -0.08, 1.9)]) {
    // What can be seen of each (its mesh, a material), from in front, a little above.
    const seen = [['driftwood', MAT.BARK], ['rocks', MAT.ROCK], ['plantTall', MAT.LEAF_BIG], ['plantTall', MAT.STEM], ['plantSmall', MAT.LEAF_SMALL], ['plantSmall', MAT.STEM]];
    for (const [name, material] of seen) {
      const mesh = meshes.find((m) => m.name === name);
      const want = topicOf(material, name);
      let found = 0;
      for (let t = 0; t < mesh.materials.length && found < 3; t += 3) {
        if (mesh.materials[t] !== material) continue;
        const corner = (k) => [...mesh.positions.subarray(mesh.indices[t * 3 + k] * 3, mesh.indices[t * 3 + k] * 3 + 3)];
        const c = [0, 1, 2].map((k) => (corner(0)[k] + corner(1)[k] + corner(2)[k]) / 3);
        // (What is under the sand is not seen.)
        if (c[1] < BED_LEVEL + 0.005) continue;
        // (Its light leaving it towards the viewer, if nothing is in the way.)
        for (const vb of [unit([0.1, 0.25, 1]), unit([-0.35, 0.1, 1]), unit([0.4, 0.15, 1])]) {
          const p = toSim(rot, c);
          const v = toSim(rot, vb);
          const sight = sightOf(p, v, true);
          if (!sight || p[1] >= LEVEL) continue;
          const back = traceCPU({ data: f.data }, toBowl(rot, sight.q1), vb.map((x) => -x), 4);
          if (Math.abs(back.t - dist(sight.q1, p)) > 1e-4) continue;
          const hit = pickBowl(sight.o, sight.d, bowlOf(rot, scape));
          assert.equal(hit?.topic, want, `${name} (${material})`);
          assert.ok(dist(hit.at, p) < 2e-3, `${name}: lands ${dist(hit.at, p)} from the point seen`);
          // (Straight on, unbent, the same ray lands elsewhere: the bending matters.)
          const straight = traceCPU({ data: f.data }, toBowl(rot, sight.q0), toBowl(rot, sight.d), 4);
          assert.ok(straight.t === 4 || dist(add(sight.q0, sight.d, straight.t), p) > 0.01);
          found++;
          break;
        }
      }
      assert.ok(found > 0, `nothing of ${name} (${material}) in view`);
    }
  }
});

test('the fish, the floating leaf and the bubble nest; the water, the sand, the bowl and the lid', () => {
  const rot = rotation(0, 0, 0.6);
  // The fish: a probe in mid-water, seen from in front (and a ray passing it by is on the water).
  const at = [0.1, -0.1, 0.25];
  const fish = new Float32Array([...at, 0]);
  const sight = sightOf(at, unit([0, 0.1, 1]), true);
  const hit = pickBowl(sight.o, sight.d, bowlOf(rot, null, { fish }));
  assert.equal(hit.topic, 'fish');
  assert.ok(dist(hit.at, at) < FISH_REACH);
  const past = sightOf(add(at, [2.5 * FISH_REACH, 0, 0]), unit([0, 0.1, 1]), true);
  assert.equal(pickBowl(past.o, past.d, bowlOf(rot, null, { fish })).topic, 'water');
  // The leaf on the film, seen through the glass over the water (bent there, and not at the film).
  const leaf = { at: [-0.15, LEVEL, 0.35], yaw: 0.4, length: 0.42, width: 0.115 };
  const onLeaf = sightOf([-0.15, LEVEL + 0.002, 0.35], unit([0.05, 0.08, 1]), false);
  assert.equal(pickBowl(onLeaf.o, onLeaf.d, bowlOf(rot, null, { leaf })).topic, 'leaf');
  // The nest against the glass at the film, its bubbles in from it.
  const bearing = 1.25;
  const out = [Math.cos(bearing), 0, Math.sin(bearing)];
  const r = Math.sqrt(INNER * INNER - LEVEL * LEVEL);
  const nest = { at: [out[0] * (r - 0.003), LEVEL, out[2] * (r - 0.003)], bearing };
  const bubble = add(nest.at, out, -0.06).map((v, k) => (k === 1 ? LEVEL + 0.004 : v));
  const onNest = sightOf(bubble, unit([0.2, 0.1, 1]), false);
  assert.equal(pickBowl(onNest.o, onNest.d, bowlOf(rot, null, { nest })).topic, 'nest');
  // Through the glass over the water and down through the film: bent at both, onto the sand.
  const o = [0.2, 2.6, 2.6];
  const d = unit([-0.1, -1, -1]);
  const down = pickBowl(o, d, bowlOf(rotation(0, 0, 0), null));
  assert.equal(down.topic, 'sand');
  // (The path, step by step: into the glass, out into the air, down to the film, into the water.)
  const p0 = add(o, d, enterSphere(o, d, OUTER));
  const g = refract(d, unit(p0), 1 / IOR_GLASS);
  const p1 = add(p0, g, enterSphere(p0, g, INNER));
  assert.ok(p1[1] > LEVEL, 'in over the water');
  const a = refract(g, unit(p1), IOR_GLASS);
  const film = add(p1, a, (LEVEL - p1[1]) / a[1]);
  const w = refract(a, [0, 1, 0], 1 / IOR_WATER);
  const sand = add(film, w, (BED_LEVEL - film[1]) / w[1]);
  assert.ok(dist(down.at, sand) < 1e-9, `on the sand where the bent path meets it (${dist(down.at, sand)} away)`);
  assert.ok(dist(add(film, a, (BED_LEVEL - film[1]) / a[1]), sand) > 0.02, 'the film bends it');
  // Over the water, the film met at a grazing angle is a mirror: the water.
  const graze = pickBowl([0, 0.75, 6.5], unit([0, -0.09, -1]), bowlOf(rot, null));
  assert.equal(graze.topic, 'water');
  assert.ok(Math.abs(graze.at[1] - LEVEL) < 1e-9, 'on the film');
  // Through the glass under the bed's top: straight into the sand.
  assert.equal(pickBowl([0, -0.7, 5], [0, 0, -1], bowlOf(rot, null)).topic, 'sand');
  // Through the middle of the water, nothing in the way: the water.
  assert.equal(pickBowl([0, -0.1, 5], [0, 0, -1], bowlOf(rot, null)).topic, 'water');
  // Through the glass over the water and out again: the bowl.
  assert.equal(pickBowl([0, 0.55, 5], [0, 0, -1], bowlOf(rot, null)).topic, 'glass');
  // The lid first, wherever it is; nothing off the bowl.
  assert.equal(pickBowl([0, -0.1, 5], [0, 0, -1], bowlOf(rot, null, { lid: () => true })).topic, 'lid');
  assert.equal(pickBowl([1.5, 0, 5], [0, 0, -1], bowlOf(rot, null)), null);
});
