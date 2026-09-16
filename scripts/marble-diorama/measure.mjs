import {
  initPhysics,
  Simulation,
  DemoController,
  STEP,
  RADIUS,
} from "./src/physics.mjs";
import { proofCourse, part, point } from "./src/course.mjs";
await initPhysics();
const c = {
  ...proofCourse(),
  parts: [part("flat", 0, 0, 40, 100)],
  starts: [point(0, RADIUS, 0)],
  goal: point(0, 0, 45),
};
const s = new Simulation(c, { untimed: true });
for (let i = 0; i < 600; i++) s.step();
const contactError = Math.abs(s.players[0].current.position.y - RADIUS);
for (let i = 0; i < 240; i++) s.step([{ x: 0, z: 0.5 }]);
const b = s.body(s.players[0]),
  start = b.translation().z;
let angle = 0;
for (let i = 0; i < 240; i++) {
  const before = b.angvel().x;
  s.step();
  angle += (before + b.angvel().x) * 0.5 * STEP;
}
const distance = b.translation().z - start,
  rolled = angle * RADIUS;
s.dispose();
const demo = new Simulation(proofCourse(), { players: 2 }),
  controllers = [new DemoController(), new DemoController()];
for (let i = 0; i < 120 * 90; i++) {
  demo.step(controllers.map((d, j) => d.input(demo, j)));
  if (demo.players.every((p) => p.status === "finished")) break;
}
console.log(
  JSON.stringify(
    {
      radius: RADIUS,
      contactError,
      contactPercentRadius: (contactError / RADIUS) * 100,
      coastDistance: distance,
      rotationDistance: rolled,
      noSlipErrorPercent: (Math.abs(distance - rolled) / distance) * 100,
      twoPlayerDemo: demo.players.map((p) => ({
        status: p.status,
        timeSeconds: p.finishTick * STEP,
        deaths: p.deaths,
      })),
    },
    null,
    2,
  ),
);
demo.dispose();
