import { roundDemoCorners } from "./demo-route.mjs";
import {
  ISO,
  worldPoint,
  deck,
  ribbon,
  routePoint,
} from "./course-authoring.mjs";
import { amigaCourseRules, COURSE_TIME } from "./rules.mjs";

export function ultimateCourse() {
  const parts = [
    deck("start-field", 0, 5, 22, 16, 16, { h: 0.8, material: "sand" }),
    deck("start-ridge", -1, 7, 8, 4, 16, { kind: "pyramid", rise: 1.4 }),
    // The start drops onto one launcher island. Its lower landing islands
    // branch left/right; the left route never visits the right platform.
    deck("first-island", 6, 18, 8, 8, 14, { h: 0.8 }),
    ...[-1, 1].map((sign) =>
      deck(
        `catapult-${sign < 0 ? "left" : "right"}`,
        6 + sign * 1.45,
        19,
        2.8,
        3,
        14.015,
        {
          kind: "spring",
          h: 0.16,
          material: "brass",
          motion: { axis: "launch", amplitude: 0.42, period: 0.9 },
          launch: { forward: 6.5, lateral: sign * 4, up: 5, velocity: true },
        },
      ),
    ),
    deck("left-landing-island", -3, 30, 10, 9, 10, { h: 0.8 }),
    deck("right-landing-island", 15, 30, 10, 9, 10, { h: 0.8 }),
    ...[-3, 15].map((l, i) =>
      deck(`landing-guide-${i}`, l, 29, 2.8, 2.8, 10, {
        kind: "ramp",
        rise: 0.6,
        h: 0.16,
        material: "brass",
      }),
    ),
    ribbon(
      "ice-left-bridge",
      [
        [-3, 34.5, 10],
        [-7, 48, 10],
        [-13, 60, 10],
      ],
      3.2,
    ),
    ribbon(
      "ice-right-bridge",
      [
        [15, 34.5, 10],
        [13, 48, 10],
        [13, 60, 10],
      ],
      3.2,
    ),
    deck("left-acid-room", -10, 64, 14, 12, 10, { h: 14, material: "sand" }),
    deck("right-muncher-room", 12, 64, 13, 12, 10, {
      h: 14,
      material: "miniature",
    }),
    ribbon(
      "left-middle-descent",
      [
        [-10, 70, 10],
        [-10, 77, 8],
      ],
      3.6,
    ),
    ribbon(
      "right-middle-descent",
      [
        [12, 70, 10],
        [8, 77, 8],
      ],
      3.6,
    ),
    deck("left-muncher-room", -9, 82, 14, 10, 8, {
      h: 12,
      material: "miniature",
    }),
    deck("right-acid-room", 9, 83, 14, 12, 8, { h: 12, material: "sand" }),
    ribbon(
      "left-waist",
      [
        [-10, 87, 8],
        [-7, 90, 8],
        [0, 94, 6],
      ],
      3.4,
    ),
    ribbon(
      "right-waist",
      [
        [10, 89, 8],
        [7, 91, 8],
        [0, 94, 6],
      ],
      3.4,
    ),
    ribbon(
      "ice-descent",
      [
        [0, 94, 6],
        [0, 98, 4],
      ],
      4,
    ),
    deck("ice-field", 0, 106, 24, 16, 4, { h: 8, material: "ice" }),
    deck("ice-exit", 0, 116, 8, 6, 4, { h: 8 }),
    ribbon(
      "left-finish-entry",
      [
        [0, 117, 4],
        [-10, 124, 1],
        [-14, 128, 1],
        [-14, 130, 1],
      ],
      3.4,
    ),
    ribbon(
      "left-finish-after-gap",
      [
        [-14, 133, 1],
        [-14, 137, 1],
        [-7, 140, 1],
      ],
      3.4,
    ),
    ribbon(
      "right-finish-entry",
      [
        [0, 117, 4],
        [10, 122, 1],
        [14, 126, 1],
        [14, 135, 1],
        [8, 140, 1],
        [0, 136, 2],
      ],
      3.4,
    ),
    deck("lower-finish-room", -5, 138, 10, 7, 1, { h: 5 }),
    ribbon(
      "goal-return",
      [
        [-7, 140, 1],
        [-4, 137, 1],
        [0, 134, 2],
        [0, 128, 2],
      ],
      4,
    ),
    deck("goal", 0, 128, 11, 5, 2, { h: 6, material: "sand" }),
  ];
  for (let i = 0; i < 3; i++)
    parts.push(
      deck(`vanishing-left-${i}`, -14, 130.5 + i, 3.4, 1, 1, {
        kind: "moving",
        h: 5,
        motion: { axis: "y", amplitude: 0, period: 4.8 },
        presence: { period: 4.8, on: 3.6, phase: -i * 0.18 },
      }),
    );
  for (const p of parts.filter(
    (p) => p.id.startsWith("ice-") && p.id.includes("bridge"),
  ))
    p.material = "ice";
  for (const l of [-5, 5])
    for (const d of [103, 109])
      parts.push(
        deck(`ice-peak-${l}-${d}`, l, d, 3, 3, 4, {
          kind: "pyramid",
          rise: 2,
          material: "ice",
        }),
      );
  const route = [
    [4.55, 16, 3],
    [4.55, 16, 12.8],
    [4.55, 14, 17.2],
    [-3, 10, 30],
    [-3, 10, 32],
    [-7, 10, 48],
    [-13, 10, 60],
    [-14, 10, 62],
    [-14, 10, 66],
    [-10, 10, 69],
    [-10, 8, 77],
    [-14, 8, 80],
    [-14, 8, 84],
    [-10, 8, 87],
    [-7, 8, 90],
    [0, 6, 94],
    [0, 4, 100],
    [0, 4, 115],
    [0, 4, 117],
    [-10, 1, 124],
    [-14, 1, 128],
    [-14, 1, 137],
    [-7, 1, 140],
    [-4, 1, 137],
    [0, 2, 134],
    [0, 2, 128],
  ].map(([l, h, d]) =>
    routePoint(l, h, d, {
      speed: 2.4,
      radius: d >= 98 && d <= 117 ? 1.6 : 0.7,
    }),
  );
  // Targets beyond the pads let the launchers accelerate a normally steered ball.
  route[1].radius = 0.35;
  route[1].speed = 3.6;
  route[2].radius = 1.3;
  route[2].speed = 3.6;
  route[3].radius = 2.5;
  Object.assign(route[4], { stop: true, speed: 1.8, radius: 0.5 });
  route.splice(
    21,
    0,
    routePoint(-14, 1, 129, {
      speed: 2.4,
      radius: 0.3,
      stop: true,
      waitFor: {
        part: "vanishing-left-0",
        axis: "y",
        min: 0.9,
        max: 1.1,
        remaining: 2.8,
      },
    }),
    routePoint(-14, 1, 134, { speed: 3.5, radius: 0.6 }),
  );
  const rightRoute = [
    ...[
      [7.45, 16, 3],
      [7.45, 16, 12.8],
      [7.45, 14, 17.2],
      [15, 10, 30],
      [15, 10, 34],
      [13, 10, 48],
    ].map(([l, h, d], i) =>
      routePoint(l, h, d, {
        speed: i === 1 || i === 2 ? 3.6 : 2.4,
        radius: i === 1 ? 0.35 : i === 2 ? 1.3 : i === 3 ? 2.5 : 0.7,
      }),
    ),
    ...[
      [13, 10, 56],
      [13, 10, 58],
      [7, 10, 59],
      [7, 10, 66],
      [9, 10, 69],
      [12, 10, 70],
      [8, 8, 77],
      [13, 8, 80],
      [13, 8, 86],
      [10, 8, 89],
      [7, 8, 91],
      [0, 6, 94],
      [0, 4, 100],
      [10, 4, 101],
      [10, 4, 110],
      [0, 4, 115],
      [0, 4, 117],
      [10, 1, 122],
      [14, 1, 126],
      [14, 1, 135],
      [8, 1, 140],
      [0, 2, 136],
      [0, 2, 128],
    ].map(([l, h, d]) =>
      routePoint(l, h, d, {
        speed: 2.4,
        radius: d >= 98 && d <= 117 ? 1.6 : 0.7,
      }),
    ),
  ];
  return {
    schema: 1,
    id: "ultimate",
    medals: { gold: 85, silver: 125 },
    revision: 2,
    name: "Ultimate Race",
    courseNumber: 6,
    subtitle: "Catapult islands, split hazard rooms, and the last icy descent.",
    category: "campaign",
    rules: amigaCourseRules("ultimate"),
    time: COURSE_TIME.ultimate,
    color: "#c64127",
    sky: "stars",
    sidePalette: ["#d63b23", "#9d231e", "#dc5a2d", "#7b2d27"],
    parity: "reconstruction",
    reference: {
      id: "MM-A500-R13-MAP-06",
      status:
        "layout and launch reconstruction; alternate routes, timing and full parity pending",
      landmarks: [
        "sand start",
        "launcher island and two alternative landing islands",
        "ice links",
        "paired acid and muncher rooms",
        "four ice pyramids",
        "branching final room",
        "return to central goal",
      ],
    },
    starts: [worldPoint(-0.7, 16.56, 0), worldPoint(0.7, 16.56, 0)],
    goal: { ...worldPoint(0, 2, 128), angle: ISO, width: 9, depth: 1.3 },
    parts,
    route: roundDemoCorners(route, { radius: 1.5, from: 6 }),
    alternateRoutes: [
      {
        id: "right-hazard-rooms",
        name: "Right hazard rooms and finish approach",
        route: rightRoute,
      },
    ],
    checkpoints: [
      worldPoint(-3, 10.56, 33),
      worldPoint(-14, 10.56, 59),
      worldPoint(-14, 8.56, 80),
      worldPoint(-10, 4.56, 110),
      worldPoint(-14, 1.56, 128),
    ],
    zones: [
      [-9, 10, 61],
      [-5, 10, 65],
      [9, 8, 80],
      [6, 8, 86],
    ].map(([l, h, d], i) => ({
      kind: "acid",
      ...worldPoint(l, h, d),
      radius: 1.2,
      motion: {
        axis: i % 2 ? "x" : "z",
        amplitude: 0.65,
        period: 5 + i,
        phase: i * 0.8,
      },
    })),
    enemies: [
      [-7, 8, 80],
      [-6, 8, 84],
      [10, 10, 63],
      [14, 10, 67],
    ].map(([l, h, d], i) => ({
      id: `muncher-${i}`,
      kind: "muncher",
      ...worldPoint(l, h + 0.9, d),
      radius: 0.65,
      roam: 2.3,
      speed: 0.6,
    })),
  };
}
