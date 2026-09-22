import { writeFileSync } from "node:fs";
import {
  Simulation,
  initPhysics,
  RADIUS,
  STEP,
  PHYSICS_VERSION,
} from "./src/physics.mjs";
import { proofCourse, part, point } from "./src/course.mjs";

// A straight, level fixture removes route planning, corners, camera movement
// and course clocks from the control-response measurement. All motion comes
// from the ordinary held input and the native rigid-body contact solver.
await initPhysics();
const report = {
  physics: PHYSICS_VERSION,
  diameter: RADIUS * 2,
  method:
    "One second settling at rest; then held full forward input on level stone at 120 Hz. Distances and speeds are normalized by the visible/collision marble diameter.",
  runs: [],
};
for (const turbo of [false, true]) {
  const course = {
    ...proofCourse(),
    parts: [part("flat", 0, 20, 40, 100)],
    starts: [point(0, RADIUS, 0)],
    goal: point(0, 0, 65),
    zones: [],
    enemies: [],
  };
  const sim = new Simulation(course, { untimed: true });
  for (let i = 0; i < 120; i++) sim.step();
  const body = sim.body(sim.players[0]),
    start = body.translation();
  const samples = [];
  let rotationDistance = 0;
  for (let tick = 1; tick <= 120 * 4; tick++) {
    const beforeSpin = body.angvel().x;
    sim.step([{ x: 0, z: 1, turbo }]);
    rotationDistance += (beforeSpin + body.angvel().x) * 0.5 * STEP * RADIUS;
    if (tick % 12 !== 0) continue;
    const pos = body.translation(),
      velocity = body.linvel();
    samples.push({
      seconds: tick / 120,
      distanceDiameters:
        Math.hypot(pos.x - start.x, pos.z - start.z) / (RADIUS * 2),
      speedDiametersPerSecond:
        Math.hypot(velocity.x, velocity.z) / (RADIUS * 2),
      rolledDiameters: rotationDistance / (RADIUS * 2),
      contactHeightError: pos.y - RADIUS,
    });
  }
  report.runs.push({ turbo, samples });
  sim.dispose();
}
writeFileSync(
  new URL("./docs/control-response-measurements.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
for (const run of report.runs)
  console.log(
    JSON.stringify({
      turbo: run.turbo,
      samples: run.samples.filter((s) =>
        [1, 1.1, 1.2, 2, 4].includes(s.seconds),
      ),
    }),
  );
