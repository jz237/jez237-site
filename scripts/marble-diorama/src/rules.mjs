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
export const COURSE_TIME = Object.freeze({
  practice: 60,
  beginner: 75,
  intermediate: 40,
  aerial: 30,
  silly: 25,
  ultimate: 25,
});
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
export function nextCourseTime(id, remaining = 0) {
  return id === "practice" || id === "beginner"
    ? COURSE_TIME[id]
    : Math.floor(remaining) + COURSE_TIME[id];
}
export function endingBonus(time, deaths) {
  return (
    20000 + Math.floor(Math.max(0, time)) * 1000 - Math.max(0, deaths) * 1000
  );
}

export class CampaignRun {
  constructor(options) {
    this.options = { ...options };
    this.index = 0;
    this.results = [];
    this.players = Array.from({ length: options.players ?? 1 }, () => ({
      active: true,
      time: 60,
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
      p.time = nextCourseTime(this.courseId, total.time);
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
    this.results.push({
      course: this.courseId,
      ticks: sim.tick,
      players: sim.players.map((p) => ({
        time: p.time,
        score: p.score,
        deaths: p.deaths,
        status: p.status,
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
