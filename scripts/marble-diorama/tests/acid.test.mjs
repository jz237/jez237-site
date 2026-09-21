import test from "node:test";
import assert from "node:assert/strict";
import RAPIER from "@dimforge/rapier3d-compat";
import { acidShape, acidPositionAt } from "../src/acid.mjs";
import { acidMesh, updateAcidMesh } from "../src/acid-view.mjs";
import { Simulation, initPhysics } from "../src/physics.mjs";
import {
  blankCourse,
  moveWorkshopObject,
  rotateWorkshopObject,
} from "../src/workshop.mjs";
import { intermediateCourse } from "../src/campaign.mjs";
import { validateCourse } from "../src/course.mjs";
await initPhysics();
test("acid shapes keep closed outward surfaces and genuine lobed indentations", () => {
  const zone = { radius: 1.2 };
  let concave = false;
  for (let frame = 0; frame < 64; frame++) {
    const { vertices: v, indices: id } = acidShape(zone, (frame * 0.64) / 64),
      edges = new Map();
    for (let i = 0; i < id.length; i += 3) {
      const [a, b, c] = Array.from(id.slice(i, i + 3)).map((n) =>
        Array.from(v.slice(n * 3, n * 3 + 3)),
      );
      const u = b.map((n, k) => n - a[k]),
        w = c.map((n, k) => n - a[k]);
      const normal = [
        u[1] * w[2] - u[2] * w[1],
        u[2] * w[0] - u[0] * w[2],
        u[0] * w[1] - u[1] * w[0],
      ];
      assert.ok(Math.hypot(...normal) > 1e-8);
      const center = a.map(
        (n, k) => (n + b[k] + c[k]) / 3 - (k === 1 ? 0.05 : 0),
      );
      assert.ok(normal.reduce((d, n, k) => d + n * center[k], 0) > 0);
      for (let j = 0; j < v.length; j += 3)
        if (normal.reduce((d, n, k) => d + n * (v[j + k] - a[k]), 0) > 1e-5)
          concave = true;
      for (let e = 0; e < 3; e++) {
        const x = id[i + e],
          y = id[i + ((e + 1) % 3)],
          key = [Math.min(x, y), Math.max(x, y)].join("/");
        edges.set(key, (edges.get(key) ?? 0) + 1);
      }
    }
    assert.ok([...edges.values()].every((n) => n === 2));
  }
  assert.ok(concave);
});
test("deforming acid renderer uses the live sensor vertices and leaves cached shapes unchanged", () => {
  const c = blankCourse();
  c.zones = [
    {
      kind: "acid",
      x: 0,
      y: 0,
      z: 0,
      radius: 1.2,
      motion: { axis: "x", amplitude: 1, period: 4 },
    },
  ];
  const sim = new Simulation(c, { untimed: true }),
    zone = c.zones[0],
    mesh = acidMesh(zone),
    first = Array.from(acidShape(zone, 0).vertices);
  for (let i = 0; i < 39; i++) sim.step();
  const data = acidShape(zone, sim.tick / 120),
    collider = sim.world.getCollider(sim.acid[0].handle);
  updateAcidMesh(
    mesh,
    zone,
    (sim.tick - 1) / 120,
    sim.tick / 120,
    1,
    collider.translation(),
  );
  assert.deepEqual(
    Array.from(mesh.geometry.attributes.position.array),
    Array.from(data.vertices),
  );
  assert.deepEqual(Array.from(collider.vertices()), Array.from(data.vertices));
  assert.deepEqual(Array.from(collider.indices()), Array.from(data.indices));
  assert.deepEqual(
    Array.from(mesh.geometry.index.array),
    Array.from(data.indices),
  );
  assert.deepEqual(
    mesh.position.toArray(),
    Object.values(collider.translation()),
  );
  assert.notDeepEqual(first, Array.from(data.vertices));
  assert.deepEqual(Array.from(acidShape(zone, 0).vertices), first);
  const a = acidShape(zone, 38 / 120),
    b = acidShape(zone, 39 / 120);
  updateAcidMesh(mesh, zone, 38 / 120, 39 / 120, 0.5, collider.translation());
  for (let i = 0; i < a.vertices.length; i++)
    assert.ok(
      Math.abs(
        mesh.geometry.attributes.position.array[i] -
          (a.vertices[i] + b.vertices[i]) / 2,
      ) < 1e-6,
    );
  mesh.geometry.dispose();
  mesh.material.dispose();
  sim.dispose();
});
test("acid patrol and collision outcomes continue identically after restoring mid-cycle", () => {
  const c = blankCourse();
  c.starts = [{ x: 1.9, y: 0.55, z: 0 }];
  c.zones = [
    {
      kind: "acid",
      x: 0,
      y: 0,
      z: 0,
      radius: 0.7,
      patrol: {
        points: [
          { x: 0, z: 0 },
          { x: 2, z: 0 },
          { x: 2, z: 2 },
          { x: 0, z: 2 },
        ],
        speed: 1,
      },
    },
  ];
  const sim = new Simulation(c, { untimed: true });
  for (let i = 0; i < 150; i++) sim.step();
  const saved = sim.snapshot();
  const run = () => {
    for (let i = 0; i < 240; i++) sim.step();
    const col = sim.world.getCollider(sim.acid[0].handle);
    return {
      players: structuredClone(sim.players),
      position: { ...col.translation() },
      vertices: Array.from(col.vertices()),
    };
  };
  const first = run();
  sim.restore(saved);
  assert.deepEqual(run(), first);
  assert.ok(first.players[0].deaths > 0);
  sim.dispose();
});
test("acid patrol moves and rotates with its editor object and validates degenerate paths", () => {
  const c = blankCourse();
  c.zones = [
    {
      kind: "acid",
      x: 0,
      y: 0,
      z: 0,
      radius: 1,
      patrol: {
        points: [
          { x: 0, z: 0 },
          { x: 2, z: 0 },
          { x: 2, z: 2 },
          { x: 0, z: 2 },
        ],
        speed: 1,
      },
    },
  ];
  assert.deepEqual(acidPositionAt(c.zones[0], 3), { x: 2, y: 0, z: 1 });
  moveWorkshopObject(c, "zone:0", { x: 10, y: 3, z: 20 });
  rotateWorkshopObject(c, "zone:0", Math.PI / 2);
  const pos = acidPositionAt(c.zones[0], 3);
  assert.ok(Math.hypot(pos.x - 9, pos.y - 3, pos.z - 22) < 1e-8);
  validateCourse(JSON.parse(JSON.stringify(c)));
  c.zones[0].patrol.points[1] = { ...c.zones[0].patrol.points[0] };
  assert.throws(() => validateCourse(c), /positive length/);
});
test("all Intermediate acid patrols follow board axes and keep their whole outlines on flat ground", () => {
  const c = intermediateCourse(),
    sim = new Simulation(c, { untimed: true });
  sim.step();
  for (const [index, zone] of c.zones.entries()) {
    assert.ok(zone.patrol);
    assert.equal(zone.motion, undefined);
    const { points, speed } = zone.patrol;
    const lengths = points.map((p, i) => {
      const q = points[(i + 1) % points.length];
      const dx = q.x - p.x,
        dz = q.z - p.z;
      assert.ok(
        Math.abs(Math.abs(dx) - Math.abs(dz)) < 1e-8,
        "travel follows a board grid axis",
      );
      return Math.hypot(dx, dz);
    });
    const period = lengths.reduce((a, b) => a + b, 0) / speed;
    let elapsed = 0;
    for (let i = 0; i < points.length; i++) {
      const p = acidPositionAt(zone, elapsed),
        q = points[i];
      assert.ok(
        Math.hypot(p.x - q.x, p.z - q.z) < 1e-7,
        "shared clock reaches each corner continuously",
      );
      elapsed += lengths[i] / speed;
    }
    for (let sample = 0; sample < 160; sample++) {
      const time = (period * sample) / 160,
        p = acidPositionAt(zone, time),
        shape = acidShape(zone, time);
      // Ring 1 is the largest outline, not the slightly inset bottom rim.
      for (let i = 40; i < 80; i++) {
        const hit = sim.world.castRay(
          new RAPIER.Ray(
            {
              x: p.x + shape.vertices[i * 3],
              y: p.y + 2,
              z: p.z + shape.vertices[i * 3 + 2],
            },
            { x: 0, y: -1, z: 0 },
          ),
          4,
          true,
          RAPIER.QueryFilterFlags.EXCLUDE_SENSORS |
            RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC,
        );
        assert.ok(
          hit,
          `acid ${index}, phase ${sample}: entire footprint stays supported`,
        );
        assert.ok(
          Math.abs(hit.timeOfImpact - 2) < 0.015,
          `acid ${index}, phase ${sample}: avoids pyramid slopes (${hit.timeOfImpact})`,
        );
      }
    }
  }
  sim.dispose();
});

test("acid sensor leaves a visible indentation safe and detects its actual rim", () => {
  const c = blankCourse();
  c.zones = [{ kind: "acid", x: 0, y: 0, z: 0, radius: 1.2 }];
  const sim = new Simulation(c, { untimed: true }),
    col = sim.world.getCollider(sim.acid[0].handle),
    ball = new RAPIER.Ball(0.02),
    rotation = { x: 0, y: 0, z: 0, w: 1 };
  assert.equal(
    col.intersectsShape(ball, { x: 0, y: 0.035, z: 1.05 }, rotation),
    true,
  );
  assert.equal(
    col.intersectsShape(ball, { x: 0, y: 0.035, z: 1.15 }, rotation),
    false,
  );
  sim.dispose();
});
