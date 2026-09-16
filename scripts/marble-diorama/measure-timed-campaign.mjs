import { writeFileSync } from "node:fs";
import {
  initPhysics,
  Simulation,
  DemoController,
  PHYSICS_VERSION,
} from "./src/physics.mjs";
import { campaignCourses } from "./src/campaign.mjs";
import { CampaignRun } from "./src/rules.mjs";
await initPhysics();
const report = {
  physics: PHYSICS_VERSION,
  generatedAt: new Date().toISOString(),
  method:
    "Timed 120 Hz campaigns at difficulty 0, normal bounded demo steering, no assistance or position overrides.",
  runs: [],
};
for (const players of [1, 2]) {
  const run = new CampaignRun({ players, untimed: false, campaign: true });
  let outcome;
  for (const course of campaignCourses()) {
    const sim = new Simulation(course, run.options),
      drivers = sim.players.map(() => new DemoController());
    run.prepare(sim);
    while (
      sim.tick < 36000 &&
      sim.players.some((p) => ["racing", "falling"].includes(p.status))
    )
      sim.step(drivers.map((d, i) => d.input(sim, i)));
    outcome = run.complete(sim);
    console.log(
      JSON.stringify({
        players,
        course: course.id,
        seconds: sim.tick / 120,
        outcome,
        marbles: sim.players.map((p) => ({
          status: p.status,
          clock: p.time,
          falls: p.deaths,
        })),
      }),
    );
    sim.dispose();
    if (outcome !== "next") break;
  }
  report.runs.push({ players, outcome, results: run.results });
}
report.complete = report.runs.every(
  (run) =>
    run.outcome === "complete" &&
    run.results.length === 6 &&
    run.results.every((r) => r.players.every((p) => p.status === "finished")),
);
writeFileSync(
  new URL("./docs/timed-campaign-measurements.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify({ complete: report.complete }));
