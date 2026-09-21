import test from "node:test";
import assert from "node:assert/strict";
import { Simulation, initPhysics } from "../src/physics.mjs";
import { blankCourse } from "../src/workshop.mjs";
import { waveStrip } from "../src/wave.mjs";
import { surfaceGeometry } from "../src/render-surface.mjs";
import { actorShapes } from "../src/actor-shapes.mjs";
import { actorMesh, updateActorMesh } from "../src/actor-view.mjs";
import { aerialCourse } from "../src/aerial.mjs";
import { ultimateCourse } from "../src/ultimate.mjs";
import { DemoController } from "../src/physics.mjs";
import { partGeometry, motionAt, validateCourse } from "../src/course.mjs";
await initPhysics();

test("Ultimate reaches either bridge with one launcher, without visiting the other landing island", () => {
  for (const right of [false, true]) {
    const c = ultimateCourse();
    if (right) c.route = c.alternateRoutes[0].route;
    const sim = new Simulation(c, { untimed: true }),
      demo = new DemoController();
    const launches = [];
    let bridge = false,
      landing = false,
      opposite = false,
      movingArm = false;
    while (sim.tick < 4800 && !bridge) {
      for (const e of sim.step([demo.input(sim)]))
        if (e.type === "spring") launches.push(e.part);
      const p = sim.players[0],
        v = p.current.position;
      const l = (v.x - v.z) * Math.SQRT1_2,
        d = (v.x + v.z) * Math.SQRT1_2;
      if (p.grounded && d > 25.5 && d < 34.5) {
        if (right ? l > 10 : l < 2) landing = true;
        if (right ? l < 2 : l > 10) opposite = true;
      }
      bridge = p.grounded && d > 45 && d < 58;
      movingArm ||= sim.movers.some(
        (m) =>
          m.part.kind === "spring" && Math.abs(m.current.rotation.x) > 0.02,
      );
    }
    assert.equal(bridge, true);
    assert.equal(landing, true);
    assert.equal(opposite, false);
    assert.equal(movingArm, true);
    assert.deepEqual(launches, [right ? "catapult-right" : "catapult-left"]);
    assert.equal(sim.players[0].deaths, 0);
    sim.dispose();
  }
});

test("stepping a wave retains changing render vertices matching the live collider, including after restore", () => {
  const c = blankCourse();
  c.parts = waveStrip("wave", { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 8 }, 4);
  const sim = new Simulation(c, { untimed: true });
  const initial = Array.from(sim.movers[3].current.vertices);
  for (let i = 0; i < 70; i++) sim.step();
  const snap = sim.snapshot();
  const check = () => {
    for (let i = 0; i < sim.movers.length; i++) {
      const m = sim.movers[i],
        data = sim.compiled.moving[i];
      assert.equal(m.previous.vertices.length, 24);
      assert.equal(m.current.vertices.length, 24);
      const collider = sim.world.getRigidBody(m.handle).collider(0);
      const actual = Array.from(collider.vertices());
      for (let v = 0; v < actual.length; v += 3)
        assert.ok(
          Array.from({ length: 8 }, (_, j) => j * 3).some(
            (j) =>
              Math.hypot(
                ...actual
                  .slice(v, v + 3)
                  .map((n, k) => n - m.current.vertices[j + k]),
              ) < 1e-6,
          ),
        );
      const geometry = surfaceGeometry(data);
      // This is the same compiler-index mapping used by the view.
      for (let j = 0; j < data.indices.length; j++)
        for (let k = 0; k < 3; k++)
          geometry.attributes.position.array[j * 3 + k] =
            m.current.vertices[data.indices[j] * 3 + k];
      assert.ok(
        Array.from(geometry.attributes.position.array).every(Number.isFinite),
      );
      geometry.dispose();
    }
  };
  check();
  assert.notDeepEqual(Array.from(sim.movers[3].current.vertices), initial);
  for (let i = 0; i < 20; i++) sim.step();
  sim.restore(snap);
  check();
  sim.dispose();
});

test("bird wings and muncher curl change the same articulated solids used for rendering and contacts", () => {
  for (const kind of ["bird", "muncher"]) {
    const def = { kind, radius: 0.65 };
    const a = actorShapes(def, 0),
      b = actorShapes(def, 0.15);
    assert.notDeepEqual(a, b);
    const original = structuredClone(a);
    const mesh = actorMesh(a);
    updateActorMesh(mesh, b);
    b.forEach((solid, i) =>
      assert.deepEqual(
        mesh.children[i].geometry.attributes.position.array,
        solid.vertices,
      ),
    );
    assert.deepEqual(
      actorShapes(def, 0),
      a,
      "seeking back restores the exact pose",
    );
    // All triangles face outward relative to their convex part's centroid.
    for (const solid of b) {
      const v = solid.vertices,
        center = [0, 1, 2].map((k) => {
          let sum = 0;
          for (let i = k; i < v.length; i += 3) sum += v[i];
          return sum / (v.length / 3);
        });
      for (let i = 0; i < solid.indices.length; i += 3) {
        const [a, b, c] = Array.from(solid.indices.slice(i, i + 3), (j) =>
          Array.from(v.slice(j * 3, j * 3 + 3)),
        );
        const u = b.map((n, j) => n - a[j]),
          w = c.map((n, j) => n - a[j]);
        const n = [
          u[1] * w[2] - u[2] * w[1],
          u[2] * w[0] - u[0] * w[2],
          u[0] * w[1] - u[1] * w[0],
        ];
        assert.ok(
          n.reduce((s, n, j) => s + n * (a[j] - center[j]), 0) > 0,
          `${kind}/${solid.name} winding`,
        );
      }
    }
    mesh.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
  }
});

test("animated enemy collisions and poses reproduce after snapshot restore", () => {
  const c = blankCourse();
  c.goal.z = 30;
  c.enemies = [
    {
      id: "m",
      kind: "muncher",
      x: 2,
      y: 0.9,
      z: 0,
      radius: 0.65,
      roam: 4,
      speed: 0.6,
    },
  ];
  const sim = new Simulation(c, { untimed: true });
  for (let i = 0; i < 85; i++) sim.step();
  const snap = sim.snapshot();
  for (let i = 0; i < 100; i++) sim.step();
  const expected = structuredClone({
    players: sim.players,
    enemies: sim.enemies,
  });
  sim.restore(snap);
  for (let i = 0; i < 100; i++) sim.step();
  assert.deepEqual({ players: sim.players, enemies: sim.enemies }, expected);
  sim.dispose();
});

test("Aerial has three flush 3x4 peg beds selecting complete perpendicular lines", () => {
  const c = aerialCourse();
  validateCourse(c);
  const pegs = c.parts.filter((p) => p.profile === "peg");
  assert.equal(pegs.length, 36);
  for (const prefix of ["upper", "lower", "right"]) {
    const bed = pegs.filter((p) => p.id.startsWith(prefix));
    const poses = new Set();
    for (let slot = 0; slot < 100; slot++) {
      const time =
        slot * 0.88 + 0.3 - (bed[0].motion.phase * 0.88) / (Math.PI * 2);
      const up = bed.filter((p) => motionAt(p, time).position.y > p.y + 1.7);
      poses.add(up.length);
      assert.ok([0, 3, 4].includes(up.length));
      if (up.length === 4)
        assert.equal(new Set(up.map((p) => p.motion.grid.row)).size, 1);
      if (up.length === 3)
        assert.equal(new Set(up.map((p) => p.motion.grid.column)).size, 1);
      for (const p of bed)
        assert.ok(Math.abs(motionAt(p, time + 0.5).position.y - p.y) < 1e-6);
    }
    assert.deepEqual([...poses].sort(), [0, 3, 4]);
  }
  for (const p of pegs) {
    const { vertices: v } = partGeometry(p);
    assert.equal(Math.max(...Array.from(v).filter((_, i) => i % 3 === 1)), 0);
    assert.ok(
      new Set(
        Array.from(v)
          .filter((_, i) => i % 3 === 0)
          .map((n) => n.toFixed(4)),
      ).size > 10,
    );
  }
  const invalid = structuredClone(c);
  invalid.parts.find((p) => p.profile === "peg").motion.grid.column = 4;
  assert.throws(() => validateCourse(invalid), /Invalid peg bed/);
  const badWait = structuredClone(c);
  badWait.route.find((p) => p.waitForPegBed).waitForPegBed = "missing-bed";
  assert.throws(() => validateCourse(badWait), /Peg wait/);
});

test("a selected peg lifts a physical marble and restores its stroke exactly", () => {
  const source = aerialCourse().parts.find((p) => p.profile === "peg");
  // Find a selected peg at a known rising stroke, then begin at its flush cap.
  const bed = aerialCourse().parts.filter((p) => p.id.startsWith("upper-pegs"));
  let selected,
    slot = 0;
  while (!selected && slot < 20) {
    selected = bed.find(
      (p) => motionAt(p, slot * 0.88 + 0.3).position.y > p.y + 1,
    );
    if (!selected) slot++;
  }
  assert.ok(selected);
  const c = blankCourse();
  const peg = {
    ...selected,
    id: "contact-peg",
    x: 0,
    y: 0.002,
    z: 0,
    motion: {
      ...source.motion,
      grid: selected.motion.grid,
      phase: slot * Math.PI * 2,
    },
  };
  c.parts.push(peg);
  c.starts = [{ x: 0, y: 0.552, z: 0 }];
  const sim = new Simulation(c, { untimed: true });
  for (let i = 0; i < 8; i++) sim.step();
  const snapshot = sim.snapshot();
  const run = () => {
    let peak = 0;
    for (let i = 0; i < 70; i++) {
      sim.step();
      const mover = sim.movers.find((m) => m.part.id === peg.id);
      assert.ok(
        Math.abs(
          sim.world.getRigidBody(mover.handle).translation().y -
            mover.current.position.y,
        ) < 1e-5,
      );
      peak = Math.max(peak, sim.players[0].current.position.y);
    }
    assert.ok(
      peak > 2,
      "moving collision surface must physically raise the marble",
    );
    return structuredClone(sim.players[0].current);
  };
  const first = run();
  sim.restore(snapshot);
  assert.deepEqual(run(), first);
  sim.dispose();
});

test("Aerial paddle delays its upstroke, physically returns the marble to the upper ledge, and restores mid-launch", () => {
  const c = aerialCourse(),
    part = c.parts.find((p) => p.profile === "flipper");
  const offset = (part.d - part.w) / 2;
  c.starts = [
    {
      x: part.x - offset * Math.sin(part.angle),
      y: part.y + 0.57,
      z: part.z + offset * Math.cos(part.angle),
    },
  ];
  const sim = new Simulation(c, { untimed: true });
  for (let i = 0; i < 50; i++) sim.step();
  assert.ok(Math.abs(sim.players[0].current.position.y - c.starts[0].y) < 0.04);
  assert.equal(
    sim.movers.find((m) => m.part.id === part.id).current.rotation.w,
    1,
  );
  const snapshot = sim.snapshot();
  const run = () => {
    const events = [];
    let airborne = false,
      landed = false,
      peak = 0;
    while (sim.tick < 320) {
      events.push(...sim.step().filter((e) => e.type === "spring"));
      const p = sim.players[0],
        v = p.current.position;
      peak = Math.max(peak, v.y);
      airborne ||= !p.grounded && v.y > 14;
      const l = (v.x - v.z) * Math.SQRT1_2,
        d = (v.x + v.z) * Math.SQRT1_2;
      landed ||=
        airborne &&
        p.grounded &&
        l > -16.5 &&
        l < -7.5 &&
        d > 57 &&
        d < 65 &&
        Math.abs(v.y - 13.05) < 0.15;
    }
    assert.ok(airborne && landed);
    assert.ok(peak > 15 && peak < 18);
    assert.deepEqual(events, [{ type: "spring", player: 0, part: part.id }]);
    assert.equal(sim.players[0].deaths, 0);
    return sim.players[0].current;
  };
  const first = run();
  sim.restore(snapshot);
  assert.deepEqual(run(), first);
  sim.dispose();
});

test("vacuum opening stays hollow and disappearance disables its geometry and force", () => {
  const course = aerialCourse(),
    mouth = course.parts.find((p) => p.profile === "vacuum-mouth");
  assert.equal(
    course.parts.filter((p) => p.profile === "vacuum-mouth").length,
    3,
  );
  const sim = new Simulation(course, { untimed: true });
  const mover = sim.movers.find((m) => m.part.id === mouth.id);
  const body = sim.world.getRigidBody(mover.handle),
    col = body.collider(0);
  // Cast through the actual intake center along the opening normal.
  const cs = Math.cos(mouth.angle),
    sn = Math.sin(mouth.angle);
  const ray = {
    origin: { x: mouth.x - 2 * cs, y: mouth.y + 0.95, z: mouth.z - 2 * sn },
    dir: { x: cs, y: 0, z: sn },
  };
  assert.equal(col.castRay(ray, 4, true), -1);
  ray.origin.y = mouth.y + 1.8;
  assert.ok(col.castRay(ray, 4, true) > 0);
  for (let i = 0; i < 200; i++) sim.step();
  assert.equal(body.isEnabled(), false);
  sim.dispose();
  for (const [side, time, expected] of [
    [-1, 0.1, "falling"],
    [1, 0.1, "racing"],
    [-1, 2, "racing"],
  ]) {
    const c = blankCourse();
    c.zones = [
      {
        kind: "vacuum",
        x: 0,
        y: 2,
        z: 0,
        radius: 4,
        strength: 1.3,
        direction: { x: -1, y: 0, z: 0 },
        presence: { period: 5, on: 1 },
      },
    ];
    c.starts = [{ x: side * 0.6, y: 2, z: 0 }];
    const s = new Simulation(c, { untimed: true });
    s.tick = Math.round(time * 120);
    s.step();
    assert.equal(s.players[0].status, expected);
    if (time === 2) assert.equal(s.body(s.players[0]).linvel().x, 0);
    s.dispose();
  }
});

test("Aerial paddle can be entered from its spur using ordinary held movement", () => {
  const c = aerialCourse(),
    part = c.parts.find((p) => p.profile === "flipper");
  const q = Math.SQRT1_2;
  c.starts = [{ x: (-3 + 66.7) * q, y: 11.06, z: (66.7 + 3) * q }];
  const sim = new Simulation(c, { untimed: true });
  let airborne = false,
    landed = false;
  while (sim.tick < 720 && !landed) {
    const mover = sim.movers.find((m) => m.part.id === part.id);
    sim.step([
      mover.launchTick === undefined
        ? { x: -q, z: q, turbo: true }
        : { x: 0, z: 0 },
    ]);
    const p = sim.players[0],
      v = p.current.position,
      l = (v.x - v.z) * q,
      d = (v.x + v.z) * q;
    airborne ||= !p.grounded && v.y > 13.5;
    landed =
      airborne && p.grounded && l > -16.5 && l < -7.5 && d > 57 && d < 65;
  }
  assert.ok(landed);
  assert.equal(sim.players[0].deaths, 0);
  sim.dispose();
});
