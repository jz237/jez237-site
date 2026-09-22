import test from "node:test";
import assert from "node:assert/strict";
import { nativeCourse } from "../src/native-campaign.mjs";
import { initPhysics, Simulation } from "../src/physics.mjs";
import { validateCourse } from "../src/course.mjs";
import { slinkyCoordinates } from "../src/native-slinky-physics.mjs";
import { nativeSteelieTerrainHeight } from "../src/native-steelie-physics.mjs";
import {
  nativePracticeLandingIntent,
  nativePracticeMarkings,
  PRACTICE_LANDING_GROUP,
} from "../src/native-practice-landings.mjs";
await initPhysics();
const base = { 1: 488, 2: 568, 3: 528 };
function source(region, offset) {
  return {
    x: region === 3 ? 528 + offset : region === 1 ? 424 : 488,
    z: region === 3 ? 432 : base[region] + offset,
  };
}
function fixture(region, offset, height = 16, players = 1) {
  const c = nativeCourse("practice"),
    space = slinkyCoordinates(c),
    q = source(region, offset);
  c.navigation.initialRegions = [region, region];
  const start = space.world(q.x, q.z, 16348 + height);
  start.y += 0.55;
  c.starts = [
    start,
    {
      ...start,
      x: start.x + (region === 3 ? 0 : 1.3),
      z: start.z + (region === 3 ? 1.3 : 0),
    },
  ];
  return new Simulation(c, { players, untimed: true });
}
test("original native award bands retain strict integer boundaries and consume negative landings", () => {
  for (const region of [1, 2, 3])
    for (let offset = -9; offset <= 33; offset++) {
      const p = { region, ...source(region, offset + 0.5) };
      const result = nativePracticeLandingIntent(p);
      assert.equal(
        result.score,
        offset < 0 ? 0 : 3000 + 500 * Math.min(6, Math.floor(offset / 4)),
      );
      assert.equal(result.sound, 42);
      assert.equal(nativePracticeLandingIntent({ ...p, claimed: true }), null);
      assert.equal(nativePracticeLandingIntent({ ...p, course: 1 }), null);
    }
  for (const region of [0, 4, 5, 255])
    assert.equal(nativePracticeLandingIntent({ region, x: 540, z: 600 }), null);
});

test("all seven bands on all three native shelves pay on real physical landings exactly once", () => {
  for (const region of [1, 2, 3])
    for (let band = 0; band < 7; band++) {
      const sim = fixture(region, band * 4 + 2),
        awards = [];
      try {
        for (let i = 0; i < 120; i++)
          awards.push(
            ...sim.step([{}]).filter((e) => e.type === "landing-bonus"),
          );
        assert.equal(awards.length, 1, `region ${region} band ${band}`);
        assert.equal(awards[0].score, 3000 + band * 500);
        assert.deepEqual(sim.players[0].landingClaimGroups, [
          PRACTICE_LANDING_GROUP,
        ]);
        assert.equal(sim.players[0].deaths, 0);
      } finally {
        sim.dispose();
      }
    }
});

test("walking and shallow hops do not claim a native landing target", () => {
  for (const height of [0, 0.5, 7.5]) {
    const sim = fixture(1, 14, height);
    try {
      for (let i = 0; i < 120; i++) sim.step([{}]);
      assert.equal(sim.players[0].landingClaims, undefined);
    } finally {
      sim.dispose();
    }
  }
});

test("nonpaying native landing consumes eligibility, survives respawn and preserves the other player", () => {
  const sim = fixture(1, -2, 16, 2);
  // This local fixture retains region 1 at an unnumbered edge, as the source
  // branch allows. Full route navigation into it is separate acceptance.
  try {
    const events = [];
    for (let i = 0; i < 120; i++)
      events.push(
        ...sim.step([{}, {}]).filter((e) => e.type === "landing-claim"),
      );
    assert.equal(events.length, 2);
    assert.ok(events.every((e) => e.score === 0));
    for (const p of sim.players) {
      assert.deepEqual(p.landingClaimGroups, [PRACTICE_LANDING_GROUP]);
      sim.fall(p);
      sim.respawn(p);
      assert.deepEqual(p.landingClaimGroups, [PRACTICE_LANDING_GROUP]);
      assert.equal(p.nativePracticeAirborne, false);
    }
  } finally {
    sim.dispose();
  }
});

test("paired native claims and midair snapshots replay without duplicate awards", () => {
  const sim = fixture(2, 14, 16, 2);
  let copy;
  try {
    for (let i = 0; i < 12; i++) sim.step([{}, {}]);
    assert.ok(sim.players.every((p) => p.nativePracticeAirborne));
    copy = new Simulation(sim.course, { players: 2, untimed: true });
    copy.restore(sim.snapshot());
    const awards = [];
    for (let i = 0; i < 110; i++) {
      const a = sim.step([{}, {}]),
        b = copy.step([{}, {}]);
      assert.deepEqual(b, a);
      awards.push(...a.filter((e) => e.type === "landing-bonus"));
    }
    assert.deepEqual(awards.map((e) => e.player).sort(), [0, 1]);
    assert.ok(awards.every((e) => e.score === 4500));
    assert.deepEqual(
      copy.players.map((p) => p.score),
      sim.players.map((p) => p.score),
    );
    assert.deepEqual(
      copy.body(copy.players[0]).translation(),
      sim.body(sim.players[0]).translation(),
    );
  } finally {
    sim.dispose();
    copy?.dispose();
  }
});

test("native painted band centers share source score coordinates and real floor height after transforms", () => {
  for (const transform of [false, true]) {
    const c = nativeCourse("practice");
    if (transform) {
      Object.assign(c.parts[0], { x: 3, z: -4, y: 8, angle: 0.6 });
    }
    const space = slinkyCoordinates(c),
      sim = new Simulation(c, { untimed: true });
    try {
      for (const mark of nativePracticeMarkings(c))
        for (let band = 0; band < 7; band++) {
          const z = -mark.d / 2 + ((band + 0.5) * mark.d) / 7;
          const pos = {
            x: mark.x - z * Math.sin(mark.angle),
            y: mark.y,
            z: mark.z + z * Math.cos(mark.angle),
          };
          const raw = space.source(pos);
          assert.equal(
            nativePracticeLandingIntent({ ...raw, region: mark.region }).score,
            mark.scoreBands[band],
          );
          const floor = nativeSteelieTerrainHeight(sim, pos);
          assert.ok(floor !== null && Math.abs(mark.y - floor - 0.012) < 0.001);
        }
    } finally {
      sim.dispose();
    }
  }
  const c = nativeCourse("practice");
  delete c.navigation;
  assert.throws(() => validateCourse(c), /Native Practice landings/);
});
