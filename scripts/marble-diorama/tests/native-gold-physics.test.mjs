import test from "node:test";
import assert from "node:assert/strict";
import { initPhysics, Simulation, DemoController } from "../src/physics.mjs";
import { nativeCourse } from "../src/native-campaign.mjs";
import { slinkyCoordinates } from "../src/native-slinky-physics.mjs";
import { physicalNativeGold } from "../src/native-gold-physics.mjs";
import { validateCourse, compileCourse } from "../src/course.mjs";
import { tubeGeometry } from "../src/surface-geometry.mjs";
import { transferForce, chooseTransfer } from "../src/powered-transfer.mjs";
import {
  updateTraversalBonuses,
  inTransferChamber,
} from "../src/traversal-bonuses.mjs";
await initPhysics();

test("two marbles share the gold inlet, earn independent awards and retain contact clearance", () => {
  const c = nativeCourse("ultimate"),
    space = slinkyCoordinates(c);
  c.starts = [176, 192].map((x) => {
    const p = space.world(x, 240, 16380);
    p.y += 0.55;
    return p;
  });
  c.route = [{ ...space.world(184, 256, 16380), speed: 2, radius: 0.3 }];
  const sim = new Simulation(c, { players: 2, untimed: true, seed: 0 }),
    drivers = sim.players.map(() => new DemoController()),
    awards = [];
  sim.nativeCamera.scroll += 80;
  sim.nativeCamera.offset = 80;
  let separation = Infinity;
  try {
    while (sim.tick < 1000 && awards.length < 2) {
      sim.step(drivers.map((d, i) => d.input(sim, i)));
      awards.push(...sim.events.filter((e) => e.type === "traversal-bonus"));
      const [a, b] = sim.players.map((p) => sim.body(p).translation());
      separation = Math.min(
        separation,
        Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
      );
    }
    assert.deepEqual(awards.map((e) => e.player).sort(), [0, 1]);
    assert.ok(awards.every((e) => e.score === 2000));
    assert.ok(sim.players.every((p) => p.deaths === 0));
    assert.ok(separation > 1.1 - 0.0055, `contact separation ${separation}`);
    assert.ok(
      sim.players.every((p) => p.transferRoute?.id === "native-gold-transfer"),
      "keep branch choice for subsequent route navigation",
    );
  } finally {
    sim.dispose();
  }
});

function encounter(seed = 0) {
  const c = nativeCourse("ultimate"),
    space = slinkyCoordinates(c),
    start = space.world(184, 240, 16380);
  start.y += 0.55;
  c.starts = [start];
  c.route = [{ ...space.world(184, 256, 16380), speed: 2, radius: 0.3 }];
  const sim = new Simulation(c, { untimed: true, seed });
  sim.nativeCamera.scroll += 80;
  sim.nativeCamera.offset = 80;
  return { sim, space };
}
for (const seed of [0, 1])
  test(`native gold passage branch ${seed} carries normal input and restores replay`, () => {
    const { sim } = encounter(seed),
      driver = new DemoController();
    let snapshot = null,
      driverState = null,
      maxStep = 0,
      endTick = null,
      expected = null;
    try {
      while (sim.tick < 900) {
        const p = sim.players[0],
          body = sim.body(p),
          before = { ...body.translation() },
          input = driver.input(sim);
        assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
        assert.deepEqual({ ...body.translation() }, before);
        const events = sim.step([input]),
          after = body.translation();
        maxStep = Math.max(
          maxStep,
          Math.hypot(
            after.x - before.x,
            after.y - before.y,
            after.z - before.z,
          ),
        );
        if (p.transferRoute && !snapshot) {
          assert.equal(p.transferRoute.branch, seed);
          snapshot = sim.snapshot();
          driverState = structuredClone(driver);
        }
        if (events.some((e) => e.type === "traversal-bonus")) {
          assert.equal(p.deaths, 0);
          assert.equal(
            events.find((e) => e.type === "traversal-bonus").score,
            2000,
          );
          assert.deepEqual(p.traversalClaims, ["native-gold-transfer"]);
          endTick = sim.tick;
          expected = {
            position: { ...after },
            score: p.score,
            claims: [...p.traversalClaims],
          };
          break;
        }
      }
      assert.ok(snapshot);
      assert.ok(endTick, "crossed the real outlet");
      assert.ok(maxStep < 0.15, "continuous travel without source teleport");
      sim.restore(snapshot);
      Object.assign(driver, driverState);
      while (sim.tick < endTick) sim.step([driver.input(sim)]);
      const p = sim.players[0];
      assert.deepEqual(
        {
          position: { ...sim.body(p).translation() },
          score: p.score,
          claims: [...p.traversalClaims],
        },
        expected,
      );
    } finally {
      sim.dispose();
    }
  });

test("gold capture reads the current occupied outlet and changes no body position or velocity", () => {
  const c = nativeCourse("ultimate"),
    space = slinkyCoordinates(c);
  c.starts = [
    [184, 256, 16351],
    [240, 320, 16376],
  ].map((v) => {
    const p = space.world(...v);
    p.y += 0.55;
    return p;
  });
  const sim = new Simulation(c, { players: 2, untimed: true, seed: 0 });
  sim.nativeCamera.scroll += 80;
  sim.nativeCamera.offset = 80;
  try {
    const body = sim.body(sim.players[0]),
      before = {
        position: { ...body.translation() },
        velocity: { ...body.linvel() },
      };
    assert.ok(physicalNativeGold(sim, sim.players[0], 0.55, null));
    assert.equal(
      sim.players[0].transferRoute.branch,
      0,
      "occupied initially chosen branch1 flips to0",
    );
    assert.deepEqual(
      { position: { ...body.translation() }, velocity: { ...body.linvel() } },
      before,
    );
    sim.nativeCamera.scroll = sim.course.nativeCamera.initialScroll + 13 * 16;
    assert.equal(
      physicalNativeGold(sim, sim.players[0], 0.55, "native-gold-transfer"),
      null,
    );
    assert.equal(
      chooseTransfer(sim.traversalPaths, c.starts[0], 0.55, 0),
      null,
      "generic entry chooser cannot override native release timing",
    );
  } finally {
    sim.dispose();
  }
});

test("gold shell is closed and the real fork fits the unchanged authoring budget", () => {
  const c = nativeCourse("ultimate"),
    p = c.parts.find((p) => p.nativePipe === "ultimate-gold"),
    g = tubeGeometry(p),
    edges = new Map();
  for (let i = 0; i < g.indices.length; i += 3)
    for (let j = 0; j < 3; j++) {
      const a = g.indices[i + j],
        b = g.indices[i + ((j + 1) % 3)],
        key = [a, b].sort((a, b) => a - b).join();
      const e = edges.get(key) ?? [0, 0];
      e[0]++;
      e[1] += a < b ? 1 : -1;
      edges.set(key, e);
    }
  assert.ok([...edges.values()].every(([n, w]) => n === 2 && w === 0));
  validateCourse(JSON.parse(JSON.stringify(c)));
  const compiled = compileCourse(c);
  assert.ok(
    compiled.moving
      .find((g) => g.part.id === c.nativeCamera.partId)
      .frames.every((g) => g.vertices.length > 0),
  );
  p.path.at(-1).x += 100;
  assert.throws(() => validateCourse(c), /150,000-vertex/);
});

test("a tilted exit plane cannot turn off flow deep inside the lower gold branch", () => {
  const { sim, space } = encounter();
  try {
    const path = sim.traversalPaths.find((p) => p.branch === 1),
      position = space.world(216, 320, 16348);
    const dot =
      (position.x - path.points.at(-1).x) * path.exit.x +
      (position.y - path.points.at(-1).y) * path.exit.y +
      (position.z - path.points.at(-1).z) * path.exit.z;
    assert.ok(
      dot > 0.05,
      "lower passage lies beyond the outlet's infinite tilted plane",
    );
    assert.ok(
      transferForce([path], position, { x: 0, y: 0, z: 0 }, 0.55, {
        id: path.id,
        branch: 1,
      }),
    );
  } finally {
    sim.dispose();
  }
});

test("fork bonus tracking still rejects a position jump across the open chamber", () => {
  const { sim } = encounter();
  try {
    const path = sim.traversalPaths[0],
      candidates = path.points.filter((p) => inTransferChamber(path, p));
    const a = candidates[0],
      b = candidates.at(-1);
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) > 0.5);
    const p = {
      score: 0,
      transferRoute: { id: path.id, branch: 0 },
      traversals: { [path.id]: { progress: 0, chamber: true, position: a } },
    };
    assert.deepEqual(updateTraversalBonuses([path], p, b, 0.55), []);
    assert.equal(p.traversals[path.id], undefined);
  } finally {
    sim.dispose();
  }
});
