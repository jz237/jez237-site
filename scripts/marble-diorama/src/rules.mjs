import { normalizeDifficulty } from "./difficulty.mjs";
// PAL reference: World of Longplays, Nfa2etJ84_8, difficulty 0.
// Nominal timer unit is 64 PAL frames; measured reference intervals vary with load.
export const AMIGA_RULES = Object.freeze({
  timerRate: 50 / 64,
  finishPointRate: 100,
  respawn: "last-safe",
  landingStun: true,
});
export const CAMPAIGN_ORDER = [
  "practice",
  "beginner",
  "intermediate",
  "aerial",
  "silly",
  "ultimate",
];
// Original eight six-course rows, aggregate offsets 0x22f0–0x231f.
// Level 1 Aerial really is 35. See DIFFICULTY-REFERENCE.md.
export const COURSE_TIME_BY_DIFFICULTY = Object.freeze(
  [
    [60, 75, 45, 30, 25, 25],
    [60, 70, 40, 35, 25, 20],
    [60, 65, 30, 30, 20, 20],
    [60, 55, 30, 25, 20, 20],
    [60, 50, 30, 20, 20, 20],
    [60, 40, 30, 20, 20, 20],
    [50, 40, 25, 20, 20, 20],
    [45, 35, 20, 20, 20, 20],
  ].map((row) =>
    Object.freeze(
      Object.fromEntries(CAMPAIGN_ORDER.map((id, i) => [id, row[i]])),
    ),
  ),
);
export const COURSE_TIME = COURSE_TIME_BY_DIFFICULTY[0];
export const courseTime = (id, difficulty = 0) => {
  const row = COURSE_TIME_BY_DIFFICULTY[normalizeDifficulty(difficulty)];
  return Object.hasOwn(row, id) ? row[id] : undefined;
};
// Original goal flags display these awards before the unused-clock tally.
export function amigaCourseRules(id) {
  const finishBonus = {
    practice: 1000,
    beginner: 2000,
    intermediate: 3000,
    aerial: 4000,
    silly: 5000,
    ultimate: 6000,
  }[id];
  return { ...AMIGA_RULES, finishBonus };
}
export function nextCourseTime(id, remaining = 0, difficulty = 0) {
  const allocation = courseTime(id, difficulty);
  return id === "practice" || id === "beginner"
    ? allocation
    : Math.floor(remaining) + allocation;
}
export function endingBonus(time, deaths) {
  return (
    20000 + Math.floor(Math.max(0, time)) * 1000 - Math.max(0, deaths) * 1000
  );
}

export class CampaignRun {
  constructor(options) {
    this.options = {
      ...options,
      difficulty: normalizeDifficulty(options.difficulty),
    };
    this.index = 0;
    this.results = [];
    this.nextTimeBonuses = Array(options.players ?? 1).fill(0);
    this.players = Array.from({ length: options.players ?? 1 }, () => ({
      active: true,
      time: courseTime("practice", this.options.difficulty),
      score: 0,
      deaths: 0,
    }));
  }
  get courseId() {
    return CAMPAIGN_ORDER[this.index];
  }
  prepare(sim) {
    sim.players.forEach((p, i) => {
      const total = this.players[i];
      p.time =
        nextCourseTime(this.courseId, total.time, this.options.difficulty) +
        this.nextTimeBonuses[i];
      p.score = total.score;
      p.campaignDeaths = total.deaths;
      if (!total.active) {
        p.time = 0;
        p.status = "timeout";
        sim.body(p).setEnabled(false);
      }
    });
  }
  complete(sim) {
    // The Amiga adds five clock units to the first finisher before the next
    // allocation, including Beginner's reset. Both marbles must have started
    // the previous race. See TWO-PLAYER-RULES.md for the executable trace.
    const winner = sim.players.reduce(
      (first, p, i) =>
        p.status === "finished" &&
        Number.isFinite(p.finishTick) &&
        (first < 0 || p.finishTick < sim.players[first].finishTick)
          ? i
          : first,
      -1,
    );
    const award =
      !this.options.untimed &&
      this.index < CAMPAIGN_ORDER.length - 1 &&
      this.players.length === 2 &&
      this.players.every((p) => p.active);
    this.nextTimeBonuses = this.players.map((_, i) =>
      award && i === winner ? 5 : 0,
    );
    this.results.push({
      course: this.courseId,
      ticks: sim.tick,
      winner,
      nextTimeBonuses: [...this.nextTimeBonuses],
      players: sim.players.map((p) => ({
        time: p.time,
        score: p.score,
        deaths: p.deaths,
        status: p.status,
        finishTick: p.finishTick,
      })),
    });
    this.players = sim.players.map((p, i) => ({
      active: p.status === "finished",
      time: p.time,
      score: p.score,
      deaths: this.players[i].deaths + p.deaths,
    }));
    if (this.index === CAMPAIGN_ORDER.length - 1) {
      for (const p of this.players)
        if (p.active)
          p.score += endingBonus(this.options.untimed ? 0 : p.time, p.deaths);
      return this.players.some((p) => p.active) ? "complete" : "game-over";
    }
    if (!this.players.some((p) => p.active)) return "game-over";
    this.index++;
    return "next";
  }
}
