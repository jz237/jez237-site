import { roundDemoCorners } from "./demo-route.mjs";
import {
  ISO,
  worldPoint,
  deck,
  outline,
  ribbon,
  routePoint,
} from "./course-authoring.mjs";
import { amigaCourseRules, COURSE_TIME } from "./rules.mjs";

export function sillyCourse() {
  const parts = [
    deck("start", 0, 130, 7, 5, 0, { h: 4 }),
    deck("left-low-field", -12, 123, 10, 8, 0, { h: 4 }),
    deck("right-low-field", 12, 123, 10, 8, 0, { h: 4 }),
    ribbon(
      "left-uphill-steps",
      [
        [0, 130, 0],
        [-8, 124, 0],
        [-2, 118, 1],
        [-8, 112, 2],
        [-3, 106, 3],
        [-10, 106, 3],
        [-10, 102, 4],
      ],
      3.4,
    ),
    ribbon(
      "right-uphill-steps",
      [
        [0, 130, 0],
        [8, 124, 0],
        [2, 118, 1],
        [8, 112, 2],
        [3, 106, 3],
        [10, 106, 3],
        [10, 102, 4],
      ],
      3.4,
    ),
    deck("miniature-field", 0, 92, 28, 20, 4, { h: 8 }),
    deck("miniature-inlay", 0, 92, 22, 16, 4.03, {
      h: 0.1,
      material: "miniature",
    }),
    deck("left-mini-terrace", -7, 93, 6, 7, 4.45, {
      h: 0.45,
      material: "miniature",
    }),
    deck("right-mini-terrace", 7, 90, 6, 7, 4.45, {
      h: 0.45,
      material: "miniature",
    }),
    deck("mini-middle", 0, 92, 5, 3, 4.45, { h: 0.45, material: "miniature" }),
    deck("mini-ramp-left", -4, 91, 2, 5, 4.03, {
      kind: "ramp",
      rise: 0.42,
      angle: ISO + Math.PI / 2,
      h: 0.45,
      material: "miniature",
    }),
    deck("mini-ramp-right", 4, 94, 2, 5, 4.45, {
      kind: "ramp",
      rise: -0.42,
      angle: ISO + Math.PI / 2,
      h: 0.45,
      material: "miniature",
    }),
    deck("red-transfer", 0, 0, 4, 18, 0, {
      kind: "tube",
      traversalBonus: 2000,
      material: "red",
      radius: 1.8,
      path: [
        { x: 0, y: 5.8, z: 82 },
        { x: 0, y: 5.8, z: 80 },
        { x: -3, y: 6.5, z: 77 },
        { x: -8, y: 7.8, z: 74 },
        { x: -8, y: 7.8, z: 72 },
      ],
    }),
    deck("upper-pipe-landing", -8, 71, 7, 5, 6, { h: 11 }),
    ribbon(
      "left-middle-maze",
      [
        [-8, 71, 6],
        [-13, 66, 6],
        [0, 60, 6],
        [-2, 58.75, 6],
        [-6, 56.25, 7.5],
        [-8, 55, 7.5],
        [-8, 53, 7.5],
        [-8, 50, 8.5],
        [-8, 47, 9.5],
      ],
      3.4,
    ),
    ribbon(
      "right-middle-maze",
      [
        [-8, 71, 6],
        [0, 69, 6],
        [8, 73, 6],
        [13, 68, 6],
        [3, 63, 6],
        [8, 58, 7.5],
        [8, 53, 7.5],
        [8, 50, 8.5],
        [8, 47, 9.5],
      ],
      3.4,
    ),
    outline(
      "bird-field",
      [
        [-14, 47],
        [14, 47],
        [14, 28],
        [10, 28],
        [10, 25],
        [-5, 25],
        [-5, 28],
        [-14, 28],
      ],
      9.5,
      14,
    ),
    deck("bird-middle-step", 1, 35, 18, 4, 9.85, { h: 0.35 }),
    deck("bird-upper-step", 3, 29, 14, 4, 10.2, { h: 0.7 }),
    ribbon(
      "right-goal-climb",
      [
        [14, 32, 9.5],
        [14, 28, 9.5],
        [13, 22, 10.7],
        [6, 18, 10.7],
        [6, 13, 12],
        [0, 8, 12],
      ],
      3.4,
    ),
    ribbon(
      "left-goal-climb",
      [
        [-10, 28, 9.5],
        [-12, 20, 10.8],
        [-10, 12, 12],
        [0, 8, 12],
      ],
      3.4,
    ),
    deck("upper-goal-field", 0, 5, 24, 9, 12, { h: 16 }),
  ];
  for (const [i, l, d, h] of [
    [0, -9, 44, 9.5],
    [1, 6, 42, 9.5],
    [2, -4, 36, 9.85],
    [3, 10, 35, 9.85],
    [4, 2, 30, 10.2],
    [5, 12, 29, 10.2],
    [6, -5, 27, 9.5],
    [7, -8, 8, 12],
    [8, 9, 5, 12],
  ])
    parts.push(
      deck(`peak-${i}`, l, d, 2.7, 2.7, h, { kind: "pyramid", rise: 2.1 }),
    );
  const lower = [
    [-1, 0, 130],
    [-8, 0, 124],
    [-2, 1, 118],
    [-8, 2, 112],
    [-3, 3, 106],
    [-10, 3, 106],
    [-10, 4, 101],
    [-12, 4, 98],
    [-12, 4, 85],
    [0, 4, 84],
    [0, 4, 82],
    [-3, 4.7, 77],
    [-8, 6, 74],
    [-8, 6, 71],
  ];
  const upper = [
    [-13, 6, 66],
    [0, 6, 60],
    [-2, 6, 58.75],
    [-6, 7.5, 56.25],
    [-8, 7.5, 55],
    [-8, 7.5, 53],
    [-8, 8.5, 50],
    [-8, 9.5, 46],
    [-12, 9.5, 40],
    [-12, 9.5, 32],
    [-10, 9.5, 28],
    [-12, 10.8, 20],
    [-10, 12, 12],
    [0, 12, 8],
    [0, 12, 5],
  ];
  const route = [...lower, ...upper].map(([l, h, d]) =>
    routePoint(l, h, d, {
      speed: 3.5,
      radius: d >= 71 && d <= 82 ? 1.2 : 0.65,
    }),
  );
  for (const i of [4, 15]) Object.assign(route[i], { stop: true, radius: 0.4 });
  const rightRoute = route
    .slice(0, 14)
    .map((p, i) => (i < 9 ? { ...p, x: p.z, z: p.x } : structuredClone(p)));
  rightRoute.push(
    ...[
      [0, 6, 69],
      [8, 6, 73],
      [13, 6, 68],
      [3, 6, 63],
      [8, 7.5, 58],
      [8, 7.5, 53],
      [8, 8.5, 50],
      [8, 9.5, 46],
      [12, 9.5, 40],
      [12, 9.5, 32],
      [14, 9.5, 32],
      [14, 9.5, 28],
      [13, 10.7, 22],
      [6, 10.7, 18],
      [6, 12, 13],
      [0, 12, 8],
      [0, 12, 5],
    ].map(([l, h, d]) => routePoint(l, h, d, { speed: 3, radius: 1.5 })),
  );
  // Follow the room's open lanes while collecting its small enemies. The
  // waypoints follow live miniature positions; collection still needs contact.
  // Separate approaches let both marbles earn time without chasing one target.
  const miniaturePoint = (l, d, collect) =>
    routePoint(l, 4.03, d, {
      speed: 3.5,
      radius: 0.65,
      ...(collect ? { collect } : {}),
    });
  const leftDemoRoute = [
    ...route.slice(0, 8),
    miniaturePoint(-6, 99, "mini-5"),
    miniaturePoint(-1, 97, "mini-3"),
    miniaturePoint(-12, 98),
    miniaturePoint(-12, 87),
    miniaturePoint(-9, 87, "mini-0"),
    ...route.slice(9),
  ];
  const rightDemoRoute = [
    ...rightRoute.slice(0, 8),
    miniaturePoint(9, 96, "mini-2"),
    miniaturePoint(12, 95),
    miniaturePoint(12, 86),
    miniaturePoint(8, 86, "mini-4"),
    miniaturePoint(0, 87, "mini-1"),
    ...rightRoute.slice(9),
  ];
  // A lone marble can collect all six time pickups. In a paired race, retain
  // separate three-pickup approaches so the marbles do not chase the same enemy.
  const soloDemoRoute = [
    ...leftDemoRoute.slice(0, 8),
    miniaturePoint(-6, 99, "mini-5"),
    miniaturePoint(-1, 97, "mini-3"),
    miniaturePoint(9, 96, "mini-2"),
    miniaturePoint(12, 95),
    miniaturePoint(12, 86),
    miniaturePoint(8, 86, "mini-4"),
    miniaturePoint(0, 87, "mini-1"),
    miniaturePoint(-9, 87, "mini-0"),
    ...leftDemoRoute.slice(13),
  ];
  const enemies = [
    [-9, 87],
    [0, 87],
    [9, 96],
    [-1, 97],
    [8, 86],
    [-6, 99],
  ].map(([l, d], i) => ({
    id: `mini-${i}`,
    kind: "mini",
    ...worldPoint(l, 4.28, d),
    radius: 0.22,
    roam: 2,
    speed: 0.65,
    color: i % 2 ? "#323b35" : "#65d526",
  }));
  // Six independent wall-to-wall flights. The broad lower field and its
  // raised rows have different elevations; birds cross at marble height.
  for (const [i, d, h] of [
    [0, 44, 9.95],
    [1, 41, 9.95],
    [2, 38, 9.95],
    [3, 35, 10.3],
    [4, 32, 9.95],
    [5, 29, 10.65],
  ]) {
    const sign = i % 2 ? 1 : -1;
    enemies.push({
      id: `bird-${i}`,
      kind: "bird",
      ...worldPoint(sign * 14, h, d),
      radius: 0.65,
      roam: 15,
      speed: 6,
      distance: 28,
      direction: worldPoint(-sign, 0, 0),
      rest: 1.8,
      phase: i * 0.71,
      color: "#943adb",
    });
  }
  // A controlled approach keeps the second demo marble clear of bird flights.
  for (const i of [26, 27, 28]) rightDemoRoute[i].speed = 2.5;
  return {
    schema: 1,
    id: "silly",
    medals: { gold: 95, silver: 140 },
    revision: 3,
    name: "Silly Race",
    courseNumber: 5,
    subtitle:
      "Everything you know is wrong. Roll uphill through a miniature world.",
    category: "campaign",
    rules: amigaCourseRules("silly"),
    time: COURSE_TIME.silly,
    color: "#dfc82b",
    sidePalette: ["#e5d92c", "#e5d92c", "#8e741f", "#6f641f"],
    sidePattern: "spots",
    parity: "reconstruction",
    reference: {
      id: "MM-A500-R13-MAP-05",
      status:
        "layout and collection reconstruction; birds, pipe behavior, dimensions and parity pending",
      landmarks: [
        "reverse uphill direction",
        "crossed climbing ledges",
        "miniature enemy room",
        "red uphill pipe",
        "middle zigzag branches",
        "bird room with pyramids",
        "split goal climbs",
        "yellow spotted sides",
      ],
    },
    starts: [worldPoint(-0.7, 0.56, 130), worldPoint(0.7, 0.56, 130)],
    goal: { ...worldPoint(0, 12, 5), angle: ISO, width: 9, depth: 1.3 },
    parts,
    route: roundDemoCorners(soloDemoRoute, { radius: 1.5 }),
    playerRoutes: [
      roundDemoCorners(leftDemoRoute, { radius: 1.5 }),
      roundDemoCorners(rightDemoRoute, { radius: 1.5 }),
    ],
    alternateRoutes: [
      {
        id: "right-climbs",
        name: "Right climbs and bird-field exit",
        route: roundDemoCorners(rightDemoRoute, { radius: 1.5 }),
      },
    ],
    enemies,
    zones: [],
    checkpoints: [
      worldPoint(-12, 4.56, 98),
      worldPoint(-8, 6.56, 71),
      worldPoint(-8, 10.06, 46),
      worldPoint(-10, 12.56, 12),
    ],
  };
}
