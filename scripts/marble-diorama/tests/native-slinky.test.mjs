import test from "node:test";
import assert from "node:assert/strict";
import {
  SLINKY_ANIMATIONS,
  SLINKY_JUMP_HEIGHTS,
  createSlinkyState,
  stepSlinkyController,
  advanceSlinkyController,
  selectSlinkyTarget,
  slinkyAttackInRange,
  slinkyWalkDirection,
  slinkyPursuitVelocity,
  slinkyLandingIntent,
  nearestSlinkyNode,
  applySlinkyBump,
} from "../src/native-slinky.mjs";

const config = {
  region: 3,
  activationBand: [8, 28],
  nodes: [
    [10, 10, 1],
    [12, 12, 2],
    [10, 12, 0],
  ],
};
const player = (x, z, extras = {}) => ({
  x,
  z,
  height: 0,
  vx: 1,
  vz: 0,
  active: true,
  region: 3,
  motionState: 0,
  animationState: 0,
  ...extras,
});

test("slinky attacks require movement and strict 24-to-40-unit source distance", () => {
  const state = createSlinkyState(config);
  assert.equal(
    selectSlinkyTarget(config, state, [player(116, 84, { vx: 0.75 })]),
    -1,
  );
  assert.equal(
    selectSlinkyTarget(config, state, [player(116, 84, { vx: 0.75002 })]),
    0,
  );
  for (const extra of [
    { active: false },
    { region: 4 },
    { motionState: 2 },
    { animationState: 7 },
  ])
    assert.equal(
      selectSlinkyTarget(config, state, [player(116, 84, extra)]),
      -1,
    );
  for (const [dx, expected] of [
    [24, false],
    [24.0625, true],
    [39.9375, true],
    [40, false],
  ])
    assert.equal(
      slinkyAttackInRange(state, player(state.x + dx, state.z)),
      expected,
    );
});

test("paired slinkies reserve jumping targets and use progress with player-zero ties", () => {
  const state = createSlinkyState(config),
    players = [player(116, 84), player(84, 116)];
  assert.equal(selectSlinkyTarget(config, state, players), 0);
  players[1].z += 8;
  assert.equal(selectSlinkyTarget(config, state, players), 1);
  const other = { loaded: true, mode: 1, target: 1 };
  assert.equal(selectSlinkyTarget(config, state, players, [state, other]), 0);
  other.target = 0;
  assert.equal(selectSlinkyTarget(config, state, players, [state, other]), 1);
  assert.equal(
    selectSlinkyTarget(config, state, players, [
      { loaded: true, mode: 1, target: 0 },
      { loaded: true, mode: 1, target: 1 },
    ]),
    -1,
  );
  other.mode = 6;
  assert.equal(selectSlinkyTarget(config, state, players, [state, other]), 1);
});

test("source walking alternates axes, covers one cell per animation and rests at the starting node", () => {
  const s = createSlinkyState(config);
  assert.deepEqual(slinkyWalkDirection(s, [12, 12], 0), { x: 8, z: 0 });
  assert.deepEqual(slinkyWalkDirection(s, [12, 12], 8), { x: 0, z: 8 });
  for (let i = 0; i < 21; i++) stepSlinkyController(config, s, []);
  assert.equal(s.animation, "idle");
  assert.equal(s.x, 84);
  stepSlinkyController(config, s, []);
  assert.equal(s.animation, "walkX");
  for (let i = 0; i < 15; i++) stepSlinkyController(config, s, []);
  assert.equal(s.x, 84);
  stepSlinkyController(config, s, []);
  assert.equal(s.x, 92);
  assert.equal(s.animation, "walkZ");
  let rested = false;
  for (let i = 0; i < 220; i++) {
    stepSlinkyController(config, s, []);
    if (s.animation === "idle") {
      rested = true;
      break;
    }
  }
  assert.equal(rested, true);
  assert.equal(s.x, 84);
  assert.equal(s.z, 84);
});

test("jump pursuit resets from displacement before the steering correction", () => {
  assert.deepEqual(slinkyPursuitVelocity({ x: 0, z: 0 }, player(32, 0)), {
    x: 2.1875,
    z: 0,
  });
  assert.deepEqual(slinkyPursuitVelocity({ x: 0, z: 0 }, player(-32, 0)), {
    x: -2.1875,
    z: 0,
  });
  assert.deepEqual(slinkyPursuitVelocity({ x: 0, z: 0 }, player(0, 0)), {
    x: 0,
    z: 0,
  });
  assert.deepEqual(slinkyLandingIntent({ x: 0, z: 0 }, player(6.9375, 0)), {
    type: "capture",
  });
  assert.deepEqual(slinkyLandingIntent({ x: 0, z: 0 }, player(7, 0)), {
    type: "push",
    velocity: { x: 4, z: 0 },
  });
  assert.deepEqual(slinkyLandingIntent({ x: 0, z: 0 }, player(12, 0)), {
    type: "miss",
  });
});

test("source jump height, pursuit eligibility and height-boundary rollback are independent of render time", () => {
  const s = createSlinkyState(config);
  s.mode = 1;
  s.animation = "jump";
  s.divider = 1;
  s.phase = 6;
  const p = player(116, 84);
  stepSlinkyController(config, s, [p]);
  assert.equal(s.height, 0);
  assert.equal(s.x, 86.1875);
  stepSlinkyController(config, s, [p]);
  assert.equal(s.height, 5);
  const old = s.x;
  p.motionState = 2;
  stepSlinkyController(config, s, [p]);
  assert.equal(s.height, 10);
  assert.equal(s.x, old);
  p.motionState = 0;
  stepSlinkyController(config, s, [p], [], (x) => (x > old ? 1 : 0));
  assert.equal(
    s.x,
    old,
    "the original rejects horizontal motion onto another height",
  );
  assert.equal(s.height, 15);
});

test("source landing produces an intent without moving players and release returns to the nearest route", () => {
  const s = createSlinkyState(config),
    p = player(88, 84),
    before = structuredClone(p);
  s.mode = 1;
  s.animation = "jump";
  s.divider = 1;
  s.frame = 33;
  s.phase = 38;
  stepSlinkyController(config, s, [p]);
  assert.equal(s.mode, 5);
  assert.deepEqual(s.events, [{ type: "capture", player: 0 }]);
  assert.deepEqual(
    p,
    before,
    "physical capture must be resolved by an adapter",
  );
  for (let i = 0; i < 30; i++) stepSlinkyController(config, s, [p]);
  assert.equal(s.mode, 3);
  assert.deepEqual(s.events, [{ type: "release", player: 0 }]);
  assert.equal(s.node, nearestSlinkyNode(config.nodes, s));
  assert.equal(SLINKY_ANIMATIONS.miss, 26);
  assert.equal(SLINKY_JUMP_HEIGHTS.length, 32);
});

test("source camera loads at the native boundary and replay restores animation and target selection", () => {
  const s = createSlinkyState(config),
    p = player(116, 84);
  assert.equal(
    advanceSlinkyController(config, s, 0.025, 20, { transitions: [[7, 8]] }, [
      p,
    ]),
    false,
  );
  assert.equal(s.loaded, false);
  assert.equal(
    advanceSlinkyController(config, s, 0.05, 20, { transitions: [] }, [p]),
    true,
  );
  const snapshot = structuredClone(s);
  const run = (state, cadence) => {
    for (let frame = 1; frame <= cadence * 4; frame++)
      advanceSlinkyController(
        config,
        state,
        0.05 + frame / cadence,
        20,
        { transitions: [] },
        [p],
      );
    return state;
  };
  assert.deepEqual(
    run(structuredClone(snapshot), 30),
    run(structuredClone(snapshot), 120),
  );
  advanceSlinkyController(config, s, 0.1, 20, { transitions: [[28, 29]] }, [p]);
  assert.equal(s.loaded, false);
  assert.equal(
    advanceSlinkyController(config, s, 0.15, 20, { transitions: [[29, 28]] }, [
      p,
    ]),
    true,
  );
  assert.equal(s.animation, "idle");
  assert.equal(s.x, 84);
});

test("batched source updates preserve every attack intent without replaying events between updates", () => {
  const run = (cadence) => {
    const s = createSlinkyState(config),
      events = [];
    s.loaded = true;
    const p = player(116, 84);
    for (let frame = 1; frame <= cadence * 8; frame++) {
      advanceSlinkyController(
        config,
        s,
        frame / cadence,
        20,
        { transitions: [] },
        [p],
      );
      events.push(...s.events);
    }
    return events;
  };
  const expected = run(120);
  assert.ok(expected.some((e) => e.type === "capture"));
  assert.ok(expected.some((e) => e.type === "release"));
  assert.deepEqual(run(30), expected);
  assert.deepEqual(run(5), expected);
});

test("a contact-driven slinky slide uses fourfold drag, then prepares a retaliatory jump", () => {
  const s = createSlinkyState(config);
  assert.equal(applySlinkyBump(s, { x: 1, z: 0 }, 1), true);
  assert.equal(s.animation, "still");
  stepSlinkyController(config, s, []);
  assert.equal(s.vx, 0.890625);
  assert.equal(s.x, 84.890625);
  assert.equal(s.target, 1);
  for (let i = 0; i < 200 && s.mode === 2; i++)
    stepSlinkyController(config, s, []);
  assert.equal(s.mode, 4);
  assert.equal(s.animation, "recoverX");
  assert.deepEqual(s.impact, { x: 1, z: 0 });
  for (let i = 0; i < 8; i++) stepSlinkyController(config, s, []);
  assert.equal(s.mode, 1);
  assert.equal(s.animation, "jump");
  assert.equal(s.phase, 1);
  assert.equal(applySlinkyBump(s, { x: -3, z: 0 }, 0), false);
  assert.equal(s.target, 1);
});

test("a source slide stops at a height boundary and selects recovery versus immediate jump", () => {
  for (const height of [-1, 1]) {
    const s = createSlinkyState(config);
    s.animation = "walkZ";
    s.frame = 3;
    applySlinkyBump(s, { x: 0, z: -2 }, 0);
    assert.equal(s.direction, -1);
    stepSlinkyController(config, s, [], [], () => height);
    assert.equal(s.x, 84);
    assert.equal(s.z, 84);
    assert.equal(s.height, 0);
    assert.equal(s.mode, height < 0 ? 4 : 1);
    assert.equal(s.animation, height < 0 ? "recoverNegZ" : "jump");
  }
});
