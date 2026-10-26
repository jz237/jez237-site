// The betta bowl's equipment (src/render/scape/equipment.mjs), set up as a keeper sets it up: the
// heater on the back glass, wholly under the water at rest and off the sand, held by suction cups
// pressed to the glass, its cord out under the lid; the sponge filter standing on the sand, its air
// let go inside its lift tube's mouth under the water, its airline out under the lid; of either,
// only the filter's base is part of the bed (the sand flows round it); all the same at the phones'
// detail. And the fish keeps out of them, and the phone's interleave tells them apart.
// Run: node --test equipment.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as nodeModule from 'node:module';
import { build } from './src/render/scape/equipment.mjs';
import { bakeBedSolids } from './src/render/scape/bedSolids.mjs';
import { buildScapePieces } from './src/render/scape/scene.mjs';
import { BED_LEVEL, GLASS_INNER, MAT } from './src/render/scape/mesh.mjs';
import { HIT } from './src/render/bowlResolve.mjs';
import { BettaSwim } from './src/fish/bettaSwim.mjs';

/** The water's line at rest: the betta's bowl holds 1.15 times the standard fill (0.61 of the
 *  sphere) over its bed (main.ts fillFor, FluidSim restLevel). */
const REST = (() => {
  const R = GLASS_INNER;
  const cap = (h) => (Math.PI * h * h * (3 * R - h)) / 3;
  const sphere = (4 / 3) * Math.PI * R ** 3;
  const sand = cap(R + BED_LEVEL);
  const want = Math.min(((0.61 * sphere - sand) * 1.15 + sand) / sphere, 0.95) * sphere;
  let lo = 0, hi = 2 * R;
  for (let i = 0; i < 60; i++) {
    const h = (lo + hi) / 2;
    if (cap(h) < want) lo = h;
    else hi = h;
  }
  return -R + lo;
})();
/** Where the glass is cut for the lid (bowl.ts BOWL.mouth). */
const MOUTH = 0.88;

const full = build({ detail: 1 });
const low = build({ detail: 0.5 });
const meshOf = (piece, name) => piece.meshes.find((m) => m.name === name);

/** Each vertex of a mesh with its material (that of a triangle it is a corner of) and its
 *  attributes: { p, material, attrs }. */
function vertices(mesh) {
  const material = new Uint8Array(mesh.positions.length / 3);
  mesh.indices.forEach((v, i) => (material[v] = mesh.materials[Math.floor(i / 3)]));
  return Array.from(material, (m, v) => ({ p: Array.from(mesh.positions.subarray(v * 3, v * 3 + 3)), material: m, attrs: Array.from(mesh.attrs.subarray(v * 4, v * 4 + 4)) }));
}
const highest = (list) => Math.max(...list.map((v) => v.p[1]));
const lowest = (list) => Math.min(...list.map((v) => v.p[1]));
const fromMiddle = (p) => Math.hypot(p[0], p[1], p[2]);

for (const [label, piece] of [['full detail', full], ["phones' detail", low]]) {
  test(`${label}: the heater hangs on the back glass under the water and off the sand, its cups on the glass, its cord out under the lid`, () => {
    const all = vertices(meshOf(piece, 'heater'));
    const cord = all.filter((v) => v.material === MAT.HEATER && v.attrs[0] > 1.5);
    const body = all.filter((v) => !cord.includes(v));
    assert.ok(highest(body) < REST - 0.12, `its top is at ${highest(body).toFixed(3)}, the water's line at ${REST.toFixed(3)}`);
    assert.ok(lowest(body) > BED_LEVEL + 0.1, `its foot is at ${lowest(body).toFixed(3)}, the sand at ${BED_LEVEL}`);
    assert.ok(body.every((v) => v.p[2] < -0.3), 'it is at the back');
    assert.ok(all.some((v) => v.material === MAT.HEATER_LAMP), 'it has its light');
    // (A cup's rim: pressed flat on the glass, as near as checkMesh lets anything come.)
    const rims = body.filter((v) => v.material === MAT.SUCTION && v.attrs[0] < 0.5 && v.attrs[1] > 0.99);
    assert.ok(rims.length > 0);
    for (const v of rims) assert.ok(fromMiddle(v.p) > GLASS_INNER - 0.009, `a cup's rim stands ${(GLASS_INNER - fromMiddle(v.p)).toFixed(4)} off the glass`);
    assert.ok(highest(cord) > MOUTH - 0.03, `its cord reaches ${highest(cord).toFixed(3)}`);
    assert.ok(cord.every((v) => fromMiddle(v.p) < GLASS_INNER - 0.005));
  });

  test(`${label}: the filter stands on the sand, its air comes out of its lift tube under the water, its airline goes out under the lid`, () => {
    const all = vertices(meshOf(piece, 'filter'));
    const base = all.filter((v) => v.material === MAT.TUBE && v.attrs[0] > 1.5 && v.attrs[0] < 2.5);
    const sponge = all.filter((v) => v.material === MAT.SPONGE);
    const inside = all.filter((v) => v.material === MAT.TUBE && v.attrs[0] > 0.5 && v.attrs[0] < 1.5);
    const airline = all.filter((v) => v.material === MAT.TUBE && v.attrs[0] > 2.5 && v.attrs[0] < 3.5);
    assert.ok(lowest(base) < BED_LEVEL && highest(base) < BED_LEVEL + 0.035, 'its base is sunk a little in the sand');
    assert.ok(lowest(sponge) > BED_LEVEL + 0.02 && highest(sponge) < BED_LEVEL + 0.31, 'its sponge stands on the base');
    // Its air: let go inside the lift tube, just under its mouth, well under the water.
    const { at, rate, radius } = piece.bubbles;
    const axis = [0, 2].map((k) => base.reduce((s, v) => s + v.p[k], 0) / base.length);
    const bore = Math.max(...inside.map((v) => Math.hypot(v.p[0] - axis[0], v.p[2] - axis[1])));
    assert.ok(Math.hypot(at[0] - axis[0], at[2] - axis[1]) < 0.25 * bore, 'the air comes out of the middle of the lift tube');
    assert.ok(at[1] < highest(inside) && at[1] > highest(inside) - 0.03, 'just under its mouth');
    assert.ok(at[1] < REST - 0.2, `under the water: at ${at[1].toFixed(3)}, the water's line at ${REST.toFixed(3)}`);
    assert.ok(rate > 2 && rate < 20 && radius > 0.003 && radius < 0.012, 'a gentle stream of small bubbles');
    assert.deepEqual(piece.bubbles, full.bubbles);
    assert.ok(highest(airline) > MOUTH - 0.03, `its airline reaches ${highest(airline).toFixed(3)}`);
  });
}

test("of the equipment only the filter's base is part of the bed: the sand flows round it, and the water through its sponge", () => {
  const N = 256, NONE = -1.2;
  const pieces = buildScapePieces({ detail: 0.5 });
  const all = pieces.flatMap((p) => p.meshes);
  const without = all.filter((m) => m.name !== 'heater' && m.name !== 'filter');
  const a = bakeBedSolids(all, N, GLASS_INNER, NONE), b = bakeBedSolids(without, N, GLASS_INNER, NONE);
  const base = vertices(meshOf(pieces.find((p) => p.name === 'equipment'), 'filter')).filter((v) => v.material === MAT.TUBE && v.attrs[0] > 1.5 && v.attrs[0] < 2.5);
  const axis = [0, 2].map((k) => base.reduce((s, v) => s + v.p[k], 0) / base.length);
  const reach = Math.max(...base.map((v) => Math.hypot(v.p[0] - axis[0], v.p[2] - axis[1])));
  const cell = (2 * GLASS_INNER) / N;
  let raised = 0;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const k = i + N * j;
      if (a[k] === b[k]) continue;
      const x = -GLASS_INNER + (i + 0.5) * cell, z = -GLASS_INNER + (j + 0.5) * cell;
      assert.ok(Math.hypot(x - axis[0], z - axis[1]) < reach + cell, `the bed changed at (${x.toFixed(3)}, ${z.toFixed(3)}), away from the filter's base`);
      assert.ok(a[k] <= BED_LEVEL + 0.03, `the bed rises to ${a[k].toFixed(3)} at the filter: only its base counts`);
      raised++;
    }
  }
  assert.ok(raised > 50, `the base raises ${raised} columns`);
});

test('the fish keeps out of the heater and the filter', () => {
  const pieces = buildScapePieces({ detail: 0.5 });
  const obstacles = pieces.flatMap((p) => p.obstacles);
  const ours = pieces.find((p) => p.name === 'equipment').obstacles;
  const env = { radius: GLASS_INNER, sandLevel: BED_LEVEL, level: REST, iso: 0.5 };
  const seg = (p, o) => {
    const ab = o.b.map((x, k) => x - o.a[k]), ap = p.map((x, k) => x - o.a[k]);
    const t = Math.min(Math.max(ab.reduce((s, x, k) => s + x * ap[k], 0) / ab.reduce((s, x) => s + x * x, 0), 0), 1);
    return Math.hypot(...p.map((x, k) => x - o.a[k] - ab[k] * t));
  };
  for (const seed of [237, 42, 901]) {
    const s = new BettaSwim(seed);
    s.obstacles = obstacles;
    let near = 0, closest = Infinity;
    for (let i = 0; i < 60 * 240; i++) {
      s.advance(1 / 60, [0, 0, 0], env);
      for (const o of ours) {
        const d = seg(s.position, o);
        closest = Math.min(closest, d - 0.6 * o.r);
        if (d < o.r) near++;
      }
    }
    // (Its neck is held out of each one's core, as out of the driftwood's, and it seldom lingers in
    // the room round them.)
    assert.ok(closest >= -1e-6, `seed ${seed} reached into the equipment's core (${closest.toFixed(4)})`);
    assert.ok(near / (60 * 240) < 0.03, `seed ${seed} spent ${((100 * near) / (60 * 240)).toFixed(1)}% of its time by the equipment`);
  }
});

// (The bowl's shaders load the renderer's TypeScript through node:module's hooks, as
// shader-budget.test.mjs does: skipped, saying why, on a Node before 22.15.)
const skip = typeof nodeModule.registerHooks === 'function' ? false : `needs Node 22.15 or later, for node:module's registerHooks (this is ${process.version})`;
test("the phone's bowl tells the interleave a ray ended on the equipment, by the triangle's material", { skip }, async () => {
  const { bowlPasses } = await import('./tools/shader-budget.mjs');
  const passes = await bowlPasses();
  for (const [name, wgsl] of Object.entries(passes)) {
    const code = wgsl.match(/let mat = u32\(scape_meshTexel[^\n]*\n[^\n]*/)?.[0] ?? '';
    if (!name.endsWith('-lite')) {
      assert.equal(code, '', `${name} writes no hit codes`);
      continue;
    }
    assert.match(code, /& SCAPE_MESH_MAT_MASK;/, `${name}: the material read whole`);
    assert.ok(code.includes(`${HIT.EQUIPMENT}u, sc.kind == 7u && mat >= SCAPE_MAT_HEATER)`), `${name}: the equipment's code`);
    assert.match(wgsl, new RegExp(`const SCAPE_MAT_HEATER: u32 = ${MAT.HEATER}u;`));
  }
  // (The equipment's materials are those from the heater's on, and all fit the triangles' word.)
  assert.deepEqual(Object.keys(MAT).filter((k) => MAT[k] >= MAT.HEATER), ['HEATER', 'HEATER_LAMP', 'SPONGE', 'TUBE', 'SUCTION']);
  assert.ok(Object.values(MAT).every((m) => m < 16));
});
