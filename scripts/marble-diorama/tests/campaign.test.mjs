import test from "node:test";
import assert from "node:assert/strict";
import {
  initPhysics,
  Simulation,
  DemoController,
  RADIUS,
} from "../src/physics.mjs";
import {
  practiceCourse,
  beginnerCourse,
  intermediateCourse,
  sillyCourse,
  campaignCourses,
  worldPoint,
} from "../src/campaign.mjs";
import { CampaignRun, nextCourseTime, endingBonus } from "../src/rules.mjs";
import { Recording, seekRecording } from "../src/storage.mjs";
import { tubeGeometry } from "../src/surface-geometry.mjs";
import { blankCourse } from "../src/workshop.mjs";
import {
  part,
  proofCourse,
  compileCourse,
  partGeometry,
} from "../src/course.mjs";
await initPhysics();

test("custom demos without authored waypoints steer normally to the finish for both players", () => {
  for (const routes of [
    { route: [] },
    { route: undefined },
    { playerRoutes: [[], []] },
  ]) {
    const course = { ...blankCourse(), ...routes };
    const sim = new Simulation(course, { players: 2, untimed: true });
    const drivers = sim.players.map(() => new DemoController());
    while (
      sim.tick < 2400 &&
      sim.players.some((p) => p.status !== "finished")
    ) {
      const controls = drivers.map((driver, i) => driver.input(sim, i));
      for (const control of controls) {
        assert.ok(Number.isFinite(control.x) && Number.isFinite(control.z));
        assert.ok(Math.hypot(control.x, control.z) <= 1.000001);
      }
      sim.step(controls);
    }
    for (const p of sim.players) {
      assert.equal(p.status, "finished");
      assert.equal(p.deaths, 0);
    }
    sim.dispose();
  }
});

test("solo demos use their shared route and retain per-player fallback when it is absent", () => {
  for (const route of [undefined, [], [{ x: 3, y: 0, z: -3 }]]) {
    const course = {
      ...blankCourse(),
      route,
      playerRoutes: [[{ x: -3, y: 0, z: -3 }]],
    };
    const sim = new Simulation(course, { untimed: true });
    const before = { ...sim.body(sim.players[0]).translation() };
    const input = new DemoController().input(sim);
    assert.ok(route?.length ? input.x > 0 : input.x < 0);
    assert.deepEqual({ ...sim.body(sim.players[0]).translation() }, before);
    sim.dispose();
  }
});

for (const players of [1, 2]) {
  test(`Silly ${players}-player demos collect miniatures through contact and cross bird flights without falls`, () => {
    const sim = new Simulation(sillyCourse(), { players, untimed: true }),
      drivers = sim.players.map(() => new DemoController()),
      collections = sim.players.map(() => 0),
      transfers = sim.players.map(() => []);
    while (
      sim.tick < 14400 &&
      sim.players.some((p) => p.status !== "finished")
    ) {
      const before = sim.players.map((p) => ({ ...sim.body(p).translation() }));
      const inputs = drivers.map((driver, i) => driver.input(sim, i));
      inputs.forEach((input, i) => {
        assert.ok(Number.isFinite(input.x) && Number.isFinite(input.z));
        assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
        assert.deepEqual(
          { ...sim.body(sim.players[i]).translation() },
          before[i],
        );
      });
      sim.step(inputs);
      for (const event of sim.events) {
        if (event.type === "collect") collections[event.player]++;
        if (event.type === "traversal-bonus")
          transfers[event.player].push([event.part, event.score]);
      }
    }
    assert.deepEqual(
      transfers,
      Array.from({ length: players }, () => [["red-transfer", 2000]]),
    );
    const perPlayer = players === 1 ? 6 : 3;
    assert.deepEqual(collections, Array(players).fill(perPlayer));
    assert.equal(
      sim.enemies.filter((e) => e.collected).length,
      perPlayer * players,
    );
    for (const p of sim.players) {
      assert.equal(p.status, "finished");
      assert.equal(p.deaths, 0);
      assert.equal(p.time, 25 + perPlayer * 3);
      assert.ok(p.score >= perPlayer * 500);
      assert.ok(p.finishTick / 120 < (players === 1 ? 80 : 72));
    }
    sim.dispose();
  });
}

test("demo leaves a collection waypoint when its miniature has fallen out of reach", () => {
  const c = sillyCourse(),
    waypoint = c.route.findIndex((p) => p.collect === "mini-5"),
    sim = new Simulation(c, { untimed: true }),
    driver = new DemoController(),
    enemy = sim.enemies.find((e) => e.def.id === "mini-5");
  driver.index = waypoint;
  enemy.current.position.y = -10;
  const before = { ...sim.body(sim.players[0]).translation() };
  driver.input(sim);
  assert.equal(driver.index, waypoint + 1);
  assert.equal(enemy.collected, undefined);
  assert.equal(sim.players[0].score, 0);
  assert.deepEqual({ ...sim.body(sim.players[0]).translation() }, before);
  sim.dispose();
});

test("Beginner upper-right fork reaches both pipes and finishes within the original clock without falls", () => {
  const course = beginnerCourse();
  course.route = course.alternateRoutes.find(
    (route) => route.id === "upper-right-fork",
  ).route;
  delete course.playerRoutes;
  const sim = new Simulation(course, { untimed: false });
  const driver = new DemoController();
  const landmarks = [
    worldPoint(10, 17, 43),
    worldPoint(10, 13.2, 72),
    worldPoint(3, 8.2, 97),
  ];
  const visited = landmarks.map(() => false);
  const transfers = [];
  while (sim.tick < 12000 && sim.players[0].status === "racing") {
    const before = { ...sim.body(sim.players[0]).translation() };
    const input = driver.input(sim);
    assert.ok(Number.isFinite(input.x) && Number.isFinite(input.z));
    assert.ok(Math.hypot(input.x, input.z) <= 1.000001);
    assert.deepEqual({ ...sim.body(sim.players[0]).translation() }, before);
    sim.step([input]);
    transfers.push(
      ...sim.events
        .filter((e) => e.type === "traversal-bonus")
        .map((e) => [e.part, e.score]),
    );
    const position = sim.body(sim.players[0]).translation();
    landmarks.forEach((point, i) => {
      if (
        Math.hypot(position.x - point.x, position.z - point.z) < 2.5 &&
        Math.abs(position.y - RADIUS - point.y) < 2
      )
        visited[i] = true;
    });
  }
  assert.deepEqual(visited, [true, true, true]);
  assert.deepEqual(transfers, [
    ["pipe-upper", 4000],
    ["pipe-lower-right", 2000],
  ]);
  assert.equal(sim.players[0].status, "finished");
  assert.equal(sim.players[0].deaths, 0);
  assert.ok(sim.players[0].time > 20);
  sim.dispose();
});

test("every authored alternate route completes through normal steering and fall recovery", () => {
  for (const course of campaignCourses())
    for (const alternative of course.alternateRoutes ?? []) {
      const c = structuredClone(course);
      c.route = alternative.route;
      delete c.playerRoutes;
      if (alternative.start === 1) c.starts.reverse();
      const s = new Simulation(c, { untimed: true }),
        d = new DemoController();
      while (s.tick < 36000 && s.players[0].status !== "finished")
        s.step([d.input(s)]);
      assert.equal(
        s.players[0].status,
        "finished",
        `${c.id}/${alternative.id}`,
      );
      s.dispose();
    }
});

test("Intermediate orange pipe and traveling-wave alternate finishes with ordinary input and no falls", () => {
  const c = intermediateCourse();
  c.route = c.alternateRoutes.find((r) => r.id === "pipe-wave-route").route;
  delete c.playerRoutes;
  const sim = new Simulation(c, { untimed: true }),
    demo = new DemoController();
  while (sim.tick < 14400 && sim.players[0].status !== "finished")
    sim.step([demo.input(sim)]);
  assert.equal(sim.players[0].status, "finished");
  assert.equal(sim.players[0].deaths, 0);
  assert.deepEqual(sim.players[0].traversalClaims, ["orange-pipe"]);
  sim.dispose();
});

test("all six races and ending complete with two independently steered marbles in untimed campaign", () => {
  const run = new CampaignRun({ players: 2, untimed: true, campaign: true });
  let outcome;
  for (const course of campaignCourses()) {
    assert.equal(run.courseId, course.id);
    const sim = new Simulation(course, run.options),
      demos = sim.players.map(() => new DemoController());
    run.prepare(sim);
    while (
      sim.tick < 24000 &&
      !sim.players.every((p) => p.status === "finished")
    )
      sim.step(demos.map((d, i) => d.input(sim, i)));
    for (const p of sim.players) {
      assert.equal(p.status, "finished", course.id);
      assert.equal(sim.body(p).isEnabled(), false);
    }
    outcome = run.complete(sim);
    sim.dispose();
  }
  assert.equal(outcome, "complete");
  assert.equal(run.results.length, 6);
  assert.ok(run.players.every((p) => p.active && p.score > 0));
});

test("miniature collection awards 500 points and three clock units exactly once", () => {
  const c = proofCourse();
  c.parts = [part("floor", 0, 0, 12, 12)];
  c.starts = [{ x: -0.65, y: 0.55, z: 0 }];
  c.enemies = [
    {
      id: "mini",
      kind: "mini",
      x: 0,
      y: 0.22,
      z: 0,
      radius: 0.22,
      roam: 2,
      speed: 0.5,
    },
  ];
  const sim = new Simulation(c);
  let collected = 0;
  for (let i = 0; i < 40; i++)
    collected += sim.step().filter((e) => e.type === "collect").length;
  assert.equal(collected, 1);
  assert.equal(sim.enemies[0].collected, true);
  assert.ok(Math.abs(sim.players[0].time - (c.time + 3 - 40 / 120)) < 1e-8);
  assert.ok(sim.players[0].score >= 500 && sim.players[0].score < 510);
  sim.dispose();
});

test("vacuum pulls from its mouth direction and does not attract from behind", () => {
  for (const x of [-2, 2]) {
    const c = proofCourse();
    c.parts = [part("floor", 0, 0, 12, 12)];
    c.starts = [{ x, y: 0.55, z: 0 }];
    c.zones = [
      {
        kind: "vacuum",
        x: 0,
        y: 0.55,
        z: 0,
        radius: 4,
        strength: 3,
        direction: { x: -1, y: 0, z: 0 },
      },
    ];
    const sim = new Simulation(c, { untimed: true });
    for (let i = 0; i < 120; i++) sim.step();
    if (x < 0) assert.ok(sim.body(sim.players[0]).linvel().x > 0.3);
    else assert.ok(Math.abs(sim.body(sim.players[0]).linvel().x) < 0.001);
    sim.dispose();
  }
});

test("saved input-only campaign replay reconstructs initial clocks, scores and physics", () => {
  const sim = new Simulation(practiceCourse(), {
      untimed: true,
      campaign: true,
    }),
    demo = new DemoController();
  sim.players[0].score = 8000;
  sim.players[0].time = 99;
  const recording = new Recording(sim);
  for (let i = 0; i < 1600; i++) {
    const controls = [demo.input(sim)];
    sim.step(controls);
    recording.capture(sim, controls);
  }
  const saved = JSON.parse(JSON.stringify(recording));
  assert.deepEqual(saved.snapshots, []);
  const replay = seekRecording(saved, 1600);
  assert.deepEqual(replay.players, sim.players);
  replay.dispose();
  sim.dispose();
});

test("Intermediate split starts complete in two-player practice without falls", () => {
  const sim = new Simulation(intermediateCourse(), {
    players: 2,
    untimed: true,
  });
  const demos = sim.players.map(() => new DemoController());
  while (
    sim.tick < 120 * 100 &&
    !sim.players.every((p) => p.status === "finished")
  )
    sim.step(demos.map((d, i) => d.input(sim, i)));
  for (const p of sim.players) {
    assert.equal(p.status, "finished");
    assert.equal(p.deaths, 0);
  }
  sim.dispose();
});

test("acid footprint kills touching marbles but leaves adjacent and airborne marbles safe", () => {
  for (const [x, y, expected] of [
    [0, 0.55, "falling"],
    [2.5, 0.55, "racing"],
    [0, 2, "racing"],
  ]) {
    const c = proofCourse();
    c.parts = [part("floor", 0, 0, 10, 10)];
    c.starts = [{ x, y, z: 0 }];
    c.zones = [{ kind: "acid", x: 0, y: 0, z: 0, radius: 1 }];
    const sim = new Simulation(c, { untimed: true });
    for (let i = 0; i < 4; i++) sim.step();
    assert.equal(sim.players[0].status, expected);
    sim.dispose();
  }
});

test("steelies exchange physical momentum and munchers kill on articulated-body contact", () => {
  for (const kind of ["steelie", "muncher"]) {
    const c = proofCourse();
    c.parts = [part("floor", 0, 0, 20, 20)];
    c.starts = [{ x: -2, y: 0.55, z: 0 }];
    c.enemies = [
      {
        id: "enemy",
        kind,
        x: 0,
        y: kind === "steelie" ? 0.55 : 0.8,
        z: 0,
        radius: 0.55,
        roam: 5,
        speed: 0.5,
      },
    ];
    const sim = new Simulation(c, { untimed: true });
    sim.body(sim.players[0]).setLinvel({ x: 4, y: 0, z: 0 }, true);
    for (let i = 0; i < 90; i++) sim.step();
    if (kind === "steelie") {
      assert.equal(sim.players[0].deaths, 0);
      assert.ok(
        sim.world.getRigidBody(sim.enemies[0].handle).translation().x > 0.1,
      );
    } else assert.equal(sim.players[0].deaths, 1);
    sim.dispose();
  }
});

test("enemy pursuit resumes deterministically from replay snapshots", () => {
  const c = beginnerCourse(),
    sim = new Simulation(c, { untimed: true });
  sim.body(sim.players[0]).setTranslation(worldPoint(7, 16.56, 64), true);
  for (let i = 0; i < 180; i++) sim.step();
  const snapshot = sim.snapshot();
  for (let i = 0; i < 240; i++) sim.step();
  const expected = structuredClone(sim.enemies);
  sim.restore(snapshot);
  for (let i = 0; i < 240; i++) sim.step();
  assert.deepEqual(sim.enemies, expected);
  sim.dispose();
});

test("pipe triangles face into the bore and out of the exterior", () => {
  const g = tubeGeometry({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 6 },
    ],
    radius: 2,
  });
  for (let i = 0; i < 12; i += 3) {
    const v = [0, 1, 2].map((j) =>
      Array.from(
        g.vertices.slice(g.indices[i + j] * 3, g.indices[i + j] * 3 + 3),
      ),
    );
    const a = v[1].map((x, j) => x - v[0][j]),
      b = v[2].map((x, j) => x - v[0][j]);
    const normal = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2]];
    const center = [0, 1].map((j) => v.reduce((s, p) => s + p[j], 0) / 3);
    const dot = normal[0] * center[0] + normal[1] * center[1];
    assert.ok(i < 6 ? dot < 0 : dot > 0);
  }
});

test("Beginner left route and pipe complete within the PAL course clock without falls", () => {
  const course = beginnerCourse();
  course.route = course.alternateRoutes[0].route;
  const s = new Simulation(course),
    d = new DemoController();
  while (s.tick < 120 * 100 && s.players[0].status === "racing")
    s.step([d.input(s)]);
  assert.equal(s.players[0].status, "finished");
  assert.equal(s.players[0].deaths, 0);
  assert.ok(s.players[0].time > 0);
  s.dispose();
});
test("Beginner two-pipe route carries enough time to finish Intermediate", () => {
  const run = new CampaignRun({ players: 1 });
  run.index = 1;
  for (const c of [beginnerCourse(), intermediateCourse()]) {
    const sim = new Simulation(c),
      demo = new DemoController();
    run.prepare(sim);
    while (sim.tick < 120 * 100 && sim.players[0].status === "racing")
      sim.step([demo.input(sim)]);
    assert.equal(sim.players[0].status, "finished", c.id);
    assert.equal(sim.players[0].deaths, 0, c.id);
    assert.ok(sim.players[0].time > 0, c.id);
    run.complete(sim);
    sim.dispose();
  }
});
test("campaign clocks reset for Beginner then carry over, with independent two-player elimination", () => {
  // Amiga longplay 86.00s explicitly announces +40 for Intermediate.
  const intermediate = new Simulation(intermediateCourse());
  assert.equal(intermediate.players[0].time, 40);
  intermediate.dispose();
  assert.equal(nextCourseTime("beginner", 51), 75);
  assert.equal(nextCourseTime("intermediate", 40), 80);
  assert.equal(nextCourseTime("aerial", 52), 82);
  assert.equal(nextCourseTime("silly", 46), 71);
  assert.equal(nextCourseTime("ultimate", 30), 55);
  assert.equal(endingBonus(4, 3), 21000);
  const run = new CampaignRun({ players: 2 }),
    s = new Simulation(practiceCourse(), { players: 2 });
  run.prepare(s);
  Object.assign(s.players[0], { status: "finished", time: 51, score: 6420 });
  Object.assign(s.players[1], { status: "timeout", time: 0, deaths: 2 });
  assert.equal(run.complete(s), "next");
  assert.equal(run.courseId, "beginner");
  s.dispose();
  const next = new Simulation(beginnerCourse(), { players: 2 });
  run.prepare(next);
  assert.equal(next.players[0].time, 75);
  assert.equal(next.players[0].score, 6420);
  assert.equal(next.players[1].status, "timeout");
  assert.equal(next.body(next.players[1]).isEnabled(), false);
  next.dispose();
});
test("standard campaign falls restore a previously supported position", () => {
  const s = new Simulation(practiceCourse(), { untimed: true }),
    p = s.players[0];
  const safe = worldPoint(-10, 10.55, 14);
  s.body(p).setTranslation(safe, true);
  for (let i = 0; i < 180; i++) s.step();
  s.fall(p);
  for (let i = 0; i < 91; i++) s.step();
  assert.equal(p.status, "racing");
  assert.ok(
    Math.hypot(p.current.position.x - safe.x, p.current.position.z - safe.z) <
      0.03,
  );
  s.dispose();
});

test("Practice left and right exits complete with normal steering and zero falls", () => {
  for (const right of [false, true]) {
    const course = practiceCourse();
    if (right) course.route = course.alternateRoutes[0].route;
    const sim = new Simulation(course),
      demo = new DemoController();
    for (
      let tick = 0;
      tick < 7200 && sim.players[0].status === "racing";
      tick++
    )
      sim.step([demo.input(sim)]);
    assert.equal(
      sim.players[0].status,
      "finished",
      right ? "right exit" : "left exit",
    );
    assert.equal(sim.players[0].deaths, 0);
    assert.ok(sim.tick < 120 * 40);
    sim.dispose();
  }
});
test("angled finish detects the full gate width and rejects outside its depth", () => {
  const c = practiceCourse(),
    g = c.goal;
  for (const [l, d, expected] of [
    [-5.5, 55.4, "finished"],
    [-8, 54.5, "racing"],
  ]) {
    const sim = new Simulation(c, { untimed: true }),
      p = sim.players[0];
    sim.body(p).setTranslation(worldPoint(l, g.y + RADIUS, d), true);
    for (let i = 0; i < 4; i++) sim.step();
    assert.equal(p.status, expected);
    sim.dispose();
  }
});
test("overlapping same-facing floor faces do not disappear from collision mesh", () => {
  const c = proofCourse();
  c.parts = [part("a", 0, 0, 8, 8), part("b", 0, 0, 8, 8)];
  const compiled = compileCourse(c);
  assert.ok(compiled.statics[0].roles.includes("top"));
  c.starts = [{ x: 0, y: RADIUS, z: 0 }];
  c.goal = { x: 0, y: 0, z: 30 };
  const sim = new Simulation(c, { untimed: true });
  for (let i = 0; i < 240; i++) sim.step();
  assert.ok(Math.abs(sim.players[0].current.position.y - RADIUS) < 0.005);
  sim.dispose();
});
test("pyramid default thickness and all Practice mesh vertices are finite", () => {
  const p = part("peak", 0, 0, 3, 3, 0, { kind: "pyramid" });
  delete p.h;
  assert.ok(Array.from(partGeometry(p).vertices).every(Number.isFinite));
  for (const g of compileCourse(practiceCourse()).statics)
    assert.ok(Array.from(g.vertices).every(Number.isFinite));
});

for (const players of [1, 2])
  test(`timed ${players}-player campaign carries the original clock through ${players === 1 ? "Silly" : "Aerial"} without falls`, () => {
    const run = new CampaignRun({ players, untimed: false, campaign: true });
    for (const course of campaignCourses().slice(0, players === 1 ? 5 : 4)) {
      const sim = new Simulation(course, run.options);
      const drivers = sim.players.map(() => new DemoController());
      run.prepare(sim);
      while (
        sim.tick < 24000 &&
        sim.players.some((p) => ["racing", "falling"].includes(p.status))
      ) {
        const inputs = drivers.map((d, i) => d.input(sim, i));
        for (const input of inputs) {
          assert.ok(Number.isFinite(input.x) && Number.isFinite(input.z));
          assert.ok(Math.hypot(input.x, input.z) <= 1 + 1e-12);
        }
        sim.step(inputs);
      }
      for (const p of sim.players) {
        assert.equal(p.status, "finished", course.id);
        assert.equal(p.deaths, 0, course.id);
        assert.ok(p.time > 0, course.id);
      }
      run.complete(sim);
      sim.dispose();
    }
    assert.equal(run.courseId, players === 1 ? "ultimate" : "silly");
  });

test("Ultimate demo takes the open ice lane and crosses the timed bridge without falls for both marbles", () => {
  const course = campaignCourses().find((c) => c.id === "ultimate");
  const sim = new Simulation(course, { players: 2, untimed: true });
  const drivers = sim.players.map(() => new DemoController());
  while (
    sim.tick < 120 * 90 &&
    !sim.players.every((p) => p.status === "finished")
  )
    sim.step(drivers.map((driver, i) => driver.input(sim, i)));
  for (const p of sim.players) {
    assert.equal(p.status, "finished");
    assert.equal(p.deaths, 0);
  }
  sim.dispose();
});

test("two-player Aerial demos yield at the crossing and both finish without falls", () => {
  const course = campaignCourses().find((c) => c.id === "aerial");
  const sim = new Simulation(course, { players: 2, untimed: true });
  const drivers = sim.players.map(() => new DemoController());
  while (
    sim.tick < 120 * 75 &&
    sim.players.some((p) => p.status !== "finished")
  ) {
    const before = sim.players.map((p) => ({ ...sim.body(p).translation() }));
    const inputs = drivers.map((d, i) => d.input(sim, i));
    inputs.forEach((input, i) => {
      assert.ok(Math.hypot(input.x, input.z) <= 1 + 1e-12);
      assert.deepEqual(
        { ...sim.body(sim.players[i]).translation() },
        before[i],
      );
    });
    sim.step(inputs);
  }
  for (const p of sim.players) {
    assert.equal(p.status, "finished");
    assert.equal(p.deaths, 0);
    assert.ok(p.finishTick < 120 * 75);
  }
  sim.dispose();
});
