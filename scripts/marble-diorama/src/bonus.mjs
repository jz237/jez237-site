import { part, point } from "./course.mjs";
const base = (id, name, subtitle, color, time = 150) => ({
  schema: 1,
  id,
  revision: 1,
  name,
  subtitle,
  color,
  time,
  category: "bonus",
  rules: { timerRate: 1, finishPointRate: 10, respawn: "last-safe" },
  zones: [],
  checkpoints: [],
  medals: { gold: 35, silver: 60 },
});
const waypoint = (x, y, z, extra = {}) => ({ ...point(x, y, z), ...extra });

export function clockworkFoundry() {
  return {
    ...base(
      "clockwork-foundry",
      "Clockwork Foundry",
      "Ride the brass bridges and cross beneath the moving press.",
      "#a86436",
    ),
    musicCue: "practice",
    starts: [point(-0.7, 4.56, 0), point(0.7, 4.56, 0)],
    goal: { ...point(0, 4, 49), width: 7 },
    parts: [
      part("start", 0, 0, 10, 10, 4),
      part("sliding-bridge", 0, 9, 5, 8, 4, {
        kind: "moving",
        material: "brass",
        motion: { axis: "x", amplitude: 3, period: 8 },
      }),
      part("middle", 0, 17, 10, 8, 4),
      part("press-floor", 0, 25, 10, 8, 4),
      part("press", 0, 25, 3, 2, 8, {
        kind: "piston",
        h: 3,
        material: "metal",
        motion: { axis: "y", amplitude: 3, period: 5 },
      }),
      part("rising-bridge", 0, 33, 5, 8, 4, {
        kind: "moving",
        material: "brass",
        motion: { axis: "y", amplitude: 0.45, period: 6 },
      }),
      part("finish", 0, 45, 10, 16, 4),
    ],
    route: [
      waypoint(0, 4, 3.5, {
        stop: true,
        waitFor: { part: "sliding-bridge", axis: "x", min: -1, max: 1 },
      }),
      waypoint(0, 4, 9, { part: "sliding-bridge", radius: 1.1 }),
      waypoint(0, 4, 17),
      waypoint(0, 4, 21.5, {
        stop: true,
        waitFor: { part: "press", axis: "y", min: 8.8, max: 12, rising: true },
      }),
      waypoint(0, 4, 29),
      waypoint(0, 4, 33, { part: "rising-bridge", radius: 1.2 }),
      waypoint(0, 4, 41),
      waypoint(0, 4, 49),
    ],
    checkpoints: [point(0, 4.56, 17), point(0, 4.56, 29), point(0, 4.56, 42)],
    props: [
      { kind: "gear", x: -10, y: 3, z: 17, radius: 3 },
      { kind: "gear", x: 10, y: 3, z: 30, radius: 2.5 },
    ],
  };
}

export function magneticObservatory() {
  return {
    ...base(
      "magnetic-observatory",
      "Magnetic Observatory",
      "Counter the magnets and balance across slowly tilting platforms.",
      "#395c88",
    ),
    musicCue: "aerial",
    sky: "stars",
    starts: [point(-0.7, 3.56, 0), point(0.7, 3.56, 0)],
    goal: { ...point(0, 3, 49), width: 8 },
    parts: [
      part("start", 0, 4, 12, 14, 3, { material: "ceramic" }),
      part("first-tilt", 0, 16, 12, 10, 3, {
        kind: "tilt",
        material: "brass",
        motion: { axis: "tilt", amplitude: 0.16, period: 8 },
      }),
      part("middle", 0, 26, 12, 10, 3, { material: "ceramic" }),
      part("second-tilt", 0, 36, 10, 10, 3, {
        kind: "tilt",
        material: "brass",
        motion: { axis: "tilt", amplitude: 0.2, period: 9, phase: Math.PI },
      }),
      part("finish", 0, 46, 12, 10, 3, { material: "ceramic" }),
    ],
    zones: [
      { kind: "magnet", x: 5, y: 3, z: 12, radius: 6, strength: 0.3 },
      { kind: "magnet", x: -5, y: 3, z: 30, radius: 6, strength: 0.3 },
    ],
    route: [
      waypoint(-1, 3, 7),
      waypoint(0, 3, 16, { part: "first-tilt" }),
      waypoint(1, 3, 24),
      waypoint(1, 3, 29),
      waypoint(0, 3, 36, { part: "second-tilt" }),
      waypoint(0, 3, 43),
      waypoint(0, 3, 49),
    ],
    checkpoints: [point(0, 3.56, 25), point(0, 3.56, 44)],
  };
}

export function crystalCascade() {
  return {
    ...base(
      "crystal-cascade",
      "Crystal Cascade",
      "Two spring flights, glass channels, and a precise final landing.",
      "#3e9699",
    ),
    musicCue: "intermediate",
    starts: [point(-0.7, 6.56, 0), point(0.7, 6.56, 0)],
    goal: { ...point(0, 2, 59), width: 8 },
    parts: [
      part("start", 0, 2, 10, 10, 6, { material: "ceramic" }),
      part("upper-channel", 0, 12, 6, 10, 6, {
        kind: "channel",
        bank: 1,
        material: "glass",
      }),
      part("first-spring", 0, 16, 3, 2, 6, {
        kind: "spring",
        material: "brass",
        launch: { forward: 7, lateral: 0, up: 5, velocity: true },
      }),
      part("first-landing", 0, 26, 12, 10, 4, { material: "glass" }),
      part("second-spring", 0, 30, 3, 2, 4, {
        kind: "spring",
        material: "brass",
        launch: { forward: 7, lateral: 0, up: 5, velocity: true },
      }),
      part("second-landing", 0, 40, 12, 10, 2, { material: "glass" }),
      part("lower-channel", 0, 49, 8, 12, 2, {
        kind: "channel",
        bank: 1,
        material: "glass",
      }),
      part("finish", 0, 59, 10, 10, 2, { material: "ceramic" }),
    ],
    route: [
      waypoint(0, 6, 5),
      waypoint(0, 6, 14.5, { radius: 0.4 }),
      waypoint(0, 4, 24, { radius: 2.5 }),
      waypoint(0, 4, 28.5, { radius: 0.4 }),
      waypoint(0, 2, 39, { radius: 2.5 }),
      waypoint(0, 2, 49),
      waypoint(0, 2, 59),
    ],
    checkpoints: [point(0, 6.56, 12), point(0, 4.56, 27), point(0, 2.56, 42)],
  };
}
export const bonusCourses = () => [
  clockworkFoundry(),
  magneticObservatory(),
  crystalCascade(),
];
