import { writeFileSync } from "node:fs";
import {
  initPhysics,
  Simulation,
  DemoController,
  PHYSICS_VERSION,
} from "./src/physics.mjs";
import { campaignCourses } from "./src/campaign.mjs";
import { bonusCourses } from "./src/bonus.mjs";
import { CampaignRun } from "./src/rules.mjs";
await initPhysics();
const report = {
  physics: PHYSICS_VERSION,
  generatedAt: new Date().toISOString(),
  method:
    "Headless 120 Hz simulation. Normal DemoController steering and turbo only. Campaign untimed; bonuses timed; difficulty 0. No positional overrides.",
  runs: [],
};
for (const players of [1, 2]) {
  const campaign = new CampaignRun({ players, untimed: true, campaign: true });
  for (const course of [...campaignCourses(), ...bonusCourses()]) {
    const isCampaign = course.category === "campaign",
      sim = new Simulation(course, {
        players,
        untimed: isCampaign,
        campaign: isCampaign,
      }),
      demos = sim.players.map(() => new DemoController());
    if (isCampaign) campaign.prepare(sim);
    while (
      sim.tick < 24000 &&
      !sim.players.every((p) => ["finished", "timeout"].includes(p.status))
    )
      sim.step(demos.map((d, i) => d.input(sim, i)));
    const result = {
      course: course.id,
      players,
      untimed: isCampaign,
      ticks: sim.tick,
      marbles: sim.players.map((p) => ({
        status: p.status,
        seconds: p.finishTick / 120,
        falls: p.deaths,
        clock: p.time,
        score: p.score,
      })),
    };
    if (isCampaign) result.campaignOutcome = campaign.complete(sim);
    report.runs.push(result);
    sim.dispose();
    console.log(JSON.stringify(result));
  }
}
report.alternateRoutes = [];
for (const source of campaignCourses()) {
  for (const alternative of source.alternateRoutes ?? []) {
    const course = structuredClone(source);
    course.route = structuredClone(alternative.route);
    delete course.playerRoutes;
    if (alternative.start === 1) course.starts.reverse();
    const sim = new Simulation(course, { untimed: true }),
      demo = new DemoController();
    while (sim.tick < 36000 && sim.players[0].status !== "finished")
      sim.step([demo.input(sim)]);
    const result = {
      course: course.id,
      route: alternative.id,
      revision: course.revision,
      status: sim.players[0].status,
      seconds: sim.players[0].finishTick / 120,
      falls: sim.players[0].deaths,
    };
    report.alternateRoutes.push(result);
    console.log(JSON.stringify(result));
    sim.dispose();
  }
}
writeFileSync(
  new URL("./docs/campaign-measurements.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
