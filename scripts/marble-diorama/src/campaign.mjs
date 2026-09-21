import { roundDemoCorners } from "./demo-route.mjs";
import { AMIGA_RULES, COURSE_TIME } from "./rules.mjs";
import { waveStrip } from "./wave.mjs";
import { aerialCourse } from "./aerial.mjs";
import { sillyCourse } from "./silly.mjs";
import { ultimateCourse } from "./ultimate.mjs";
import {
  ISO,
  worldPoint,
  deck,
  outline,
  ribbon,
  routePoint,
} from "./course-authoring.mjs";
export { worldPoint, deck } from "./course-authoring.mjs";
export { aerialCourse } from "./aerial.mjs";
export { sillyCourse } from "./silly.mjs";
export { ultimateCourse } from "./ultimate.mjs";

// Course coordinates are authored as lateral (l) and downhill (d) distances.
// This is a rigid rotation into the world, not a separate height solver.

export function practiceCourse() {
  const parts = [
    outline(
      "upper-field",
      [
        [-12, 4],
        [-9, 0],
        [-4.5, 4],
        [0, 0],
        [4.5, 4],
        [9, 0],
        [12, 4],
        [12, 24],
        [4, 24],
        [4, 26],
        [-4, 26],
        [-4, 24],
        [-12, 24],
      ],
      10,
      10,
    ),
    deck("left-training-wedge", -7, 10, 3, 4, 11.4, {
      kind: "ramp",
      rise: -1.4,
      angle: ISO - Math.PI / 2,
      h: 1.4,
    }),
    deck("right-training-wedge", 7, 10, 3, 4, 10, {
      kind: "ramp",
      rise: 1.4,
      angle: ISO - Math.PI / 2,
      h: 0.8,
    }),
    deck("training-base", 0, 18, 9.5, 9, 10.35, { h: 0.35 }),
    deck("training-middle", 0, 18, 7, 6.8, 10.7, { h: 0.7 }),
    deck("training-top", 0, 18, 4.8, 4.8, 11.05, { h: 1.05 }),
    deck("left-peak", -1.7, 17.8, 2.7, 2.7, 11.05, {
      kind: "pyramid",
      rise: 2.5,
    }),
    deck("right-peak", 1.7, 17.8, 2.7, 2.7, 11.05, {
      kind: "pyramid",
      rise: 2.5,
    }),
    deck("left-descent", -8, 26.5, 8, 5, 10, { kind: "ramp", rise: -2, h: 2 }),
    deck("right-descent", 8, 26.5, 8, 5, 10, { kind: "ramp", rise: -2, h: 2 }),
    outline(
      "lower-junction",
      [
        [-12, 29],
        [-4, 29],
        [-4, 27],
        [4, 27],
        [4, 29],
        [12, 29],
        [12, 34],
        [7, 34],
        [7, 37],
        [-7, 37],
        [-7, 34],
        [-12, 34],
      ],
      8,
      8,
    ),
    deck("left-bollard", -9, 31.5, 2.5, 2.5, 8, { kind: "pyramid", rise: 1.8 }),
    deck("right-bollard", 9, 31.5, 2.5, 2.5, 8, { kind: "pyramid", rise: 1.8 }),
    ribbon(
      "four-banked-runs",
      [
        [0, 36, 8, 0],
        [4, 40, 7.2, 1],
        [-4, 44, 6, 1],
        [4, 48, 4.8, 1],
        [-4, 52, 3.6, 0.7],
        [-8, 54, 3.2, 0],
      ],
      4.5,
      1,
    ),
    deck("upper-right-shelf", 9.5, 42, 5, 4, 7.6, { h: 10.6 }),
    deck("left-shelf", -9.5, 46, 5, 4, 6.4, { h: 9.4 }),
    deck("lower-right-shelf", 9.5, 50, 5, 4, 5.2, { h: 8.2 }),
    deck("goal-slab", -8, 55, 6, 4, 3.2, { h: 6.2 }),
  ];
  // Physical rail beams and posts: the artwork is also their collision geometry.
  for (const side of [-1, 1]) {
    parts.push(
      deck(`training-rail-${side}`, side * 7, 8.5, 4.4, 0.15, 12, {
        kind: "wall",
        h: 0.15,
        material: "red",
      }),
    );
    for (const end of [-1, 1])
      parts.push(
        deck(
          `training-post-${side}-${end}`,
          side * 7 + end * 2.12,
          8.5,
          0.16,
          0.16,
          12,
          { kind: "wall", h: 2, material: "red" },
        ),
      );
    parts.push(
      deck(`junction-rail-${side}`, side * 8, 35, 5.5, 0.13, 9.2, {
        kind: "wall",
        h: 0.13,
        material: "red",
      }),
    );
  }
  const route = [
    routePoint(-10.4, 10, 6),
    routePoint(-10.4, 10, 14),
    routePoint(-8, 10, 22),
    routePoint(-8, 8, 29.6, { speed: 2.8 }),
    routePoint(-3, 8, 33),
    routePoint(0, 8, 36, { speed: 2.7 }),
    routePoint(4, 7.2, 40, { speed: 2.4 }),
    routePoint(-4, 6, 44, { speed: 2.4 }),
    routePoint(4, 4.8, 48, { speed: 2.4 }),
    routePoint(-4, 3.6, 52, { speed: 2.4 }),
    routePoint(-8, 3.2, 54),
    routePoint(-8, 3.2, 55.4),
  ];
  const rightRoute = [
    routePoint(10.4, 10, 6),
    routePoint(10.4, 10, 14),
    routePoint(8, 10, 22),
    routePoint(8, 8, 29.6, { speed: 2.8 }),
    routePoint(3, 8, 33),
    ...route.slice(5),
  ];
  return {
    schema: 1,
    id: "practice",
    medals: { gold: 35, silver: 55 },
    rules: AMIGA_RULES,
    revision: 1,
    name: "Practice Race",
    subtitle: "Training gates, twin peaks, and four banked reversals.",
    category: "campaign",
    courseNumber: 1,
    color: "#c84439",
    sidePalette: [
      "#be3e35",
      "#be3e35",
      "#d98a38",
      "#d8bd49",
      "#d8bd49",
      "#be3e35",
    ],
    time: COURSE_TIME.practice,
    parity: "reconstruction",
    reference: {
      id: "MM-A500-R13-MAP-01",
      status: "layout reconstruction; quantitative parity pending",
      landmarks: [
        "three training gates",
        "paired peaked ramps and stairs",
        "two downhill exits",
        "lower junction bollards",
        "four reversing banked runs",
        "three marked shelves",
        "angled goal approach",
      ],
    },
    starts: [worldPoint(-0.7, 10.56, 4), worldPoint(0.7, 10.56, 4)],
    goal: { ...worldPoint(-8, 3.2, 55.4), angle: ISO, width: 5.6, depth: 1.3 },
    checkpoints: [
      worldPoint(-8, 10.56, 22),
      worldPoint(0, 8.56, 34.5),
      worldPoint(4, 7.76, 40),
      worldPoint(-4, 6.56, 44),
      worldPoint(4, 5.36, 48),
      worldPoint(-4, 4.16, 52),
    ],
    route,
    alternateRoutes: [
      {
        id: "right-training-exit",
        name: "Right training exit",
        route: rightRoute,
      },
    ],
    parts,
    zones: [],
    markings: [
      { kind: "arrow", ...worldPoint(-8, 10.02, 22), angle: ISO },
      { kind: "arrow", ...worldPoint(8, 10.02, 22), angle: ISO },
      { kind: "arrow", ...worldPoint(0, 8.02, 34), angle: ISO },
      { kind: "pad", value: 30, ...worldPoint(9.5, 7.62, 42), angle: ISO },
      { kind: "pad", value: 40, ...worldPoint(-9.5, 6.42, 46), angle: ISO },
      { kind: "pad", value: 20, ...worldPoint(9.5, 5.22, 50), angle: ISO },
    ],
  };
}

export function beginnerCourse() {
  const parts = [
    outline(
      "upper-maze",
      [
        [-13, 2],
        [-6, 2],
        [-6, 0],
        [4, 0],
        [4, 3],
        [13, 3],
        [13, 26],
        [-13, 26],
      ],
      24,
      26,
    ),
    ribbon(
      "upper-bent-descent",
      [
        [10, 25, 24],
        [7, 30, 22],
        [-1, 34, 20],
      ],
      3.8,
    ),
    ribbon(
      "left-branch",
      [
        [-1, 34, 20],
        [-10, 43, 17],
      ],
      3.8,
    ),
    ribbon(
      "right-branch",
      [
        [-1, 34, 20],
        [10, 43, 17],
      ],
      3.8,
    ),
    outline(
      "pyramid-room",
      [
        [-13, 42],
        [13, 42],
        [13, 55],
        [4, 55],
        [4, 58],
        [-6, 58],
        [-6, 55],
        [-13, 55],
      ],
      17,
      22,
    ),
    deck("peak-west", -9, 49, 3.8, 3.8, 17, { kind: "pyramid", rise: 3 }),
    deck("peak-north", 0, 45.5, 3.8, 3.8, 17, { kind: "pyramid", rise: 3 }),
    deck("peak-east", 9, 49, 3.8, 3.8, 17, { kind: "pyramid", rise: 3 }),
    ribbon(
      "muncher-neck",
      [
        [-5, 56, 17],
        [-5, 60, 16],
        [0, 63, 16],
      ],
      4,
    ),
    outline(
      "steelie-landing",
      [
        [-4, 62],
        [13, 62],
        [13, 69],
        [3, 69],
        [3, 66],
        [-4, 66],
      ],
      16,
      21,
    ),
    ribbon(
      "upper-left-maze",
      [
        [0, 66, 16],
        [0, 72, 14],
        [-10, 72, 14],
        [-10, 74, 14],
        [0, 78, 11],
      ],
      3.8,
    ),
    ribbon(
      "lower-left-maze",
      [
        [0, 78, 11],
        [0, 81, 11],
        [-8, 81, 11],
        [-8, 85, 11],
        [-13, 87, 11],
        [-13, 91, 11],
        [-4, 94, 11],
      ],
      3.8,
    ),
    ribbon(
      "right-pipe-landing",
      [
        [10, 80, 11],
        [7, 82, 10],
        [10, 85, 10],
        [3, 89, 10],
        [3, 94, 10],
      ],
      3.8,
    ),
    deck("pipe-upper", 0, 0, 4, 25, 0, {
      kind: "tube",
      material: "blue",
      radius: 1.8,
      path: [
        { x: 10, y: 17.8, z: 67 },
        { x: 10, y: 17.8, z: 68 },
        { x: 10, y: 17.8, z: 69 },
        { x: 10, y: 15, z: 72 },
        { x: 10, y: 13, z: 75 },
        { x: 10, y: 12.8, z: 78 },
      ],
      h: 1,
    }),
    deck("pipe-exit-apron", 10, 81, 8, 10, 11, { h: 3 }),
    deck("pipe-lower-left", 0, 0, 4, 25, 0, {
      kind: "tube",
      material: "blue",
      radius: 1.8,
      path: [
        { x: -4, y: 12.8, z: 94 },
        { x: -1.8, y: 12.4, z: 94.8 },
        { x: -1, y: 9, z: 97 },
        { x: -1, y: 6, z: 101 },
        { x: 0, y: 6, z: 104 },
        { x: 0, y: 6, z: 106 },
      ],
      h: 1,
    }),
    deck("pipe-lower-right", 0, 0, 4, 25, 0, {
      kind: "tube",
      material: "blue",
      radius: 1.8,
      path: [
        { x: 3, y: 11.8, z: 94 },
        { x: 3, y: 11, z: 97 },
        { x: 3, y: 7, z: 101 },
        { x: 6, y: 6, z: 104 },
        { x: 6, y: 6, z: 106 },
      ],
      h: 1,
    }),
    deck("lower-landing", 4, 110, 16, 12, 4.2, { h: 9.2 }),
    deck("ice-entry", 0, 119, 18, 6, 4.2, {
      kind: "ramp",
      rise: -2.2,
      material: "ice",
      h: 3,
    }),
    deck("ice-room", 0, 126, 18, 10, 2, { material: "ice", h: 7 }),
    deck("ice-peak", 0, 126, 5, 5, 2, {
      kind: "pyramid",
      rise: 3,
      material: "ice",
    }),
    deck("goal-landing", -8, 134, 12, 6, 2, { h: 7 }),
  ];
  for (const [i, l, d] of [
    [0, -5, 8],
    [1, 6, 8],
    [2, -9, 17],
    [3, 2, 17],
    [4, 10, 22],
  ]) {
    for (const side of [-1, 1])
      parts.push(
        deck(`maze-${i}-long-${side}`, l, d + side * 1.8, 5.5, 0.55, 25.2, {
          h: 1.2,
        }),
      );
    for (const side of [-1, 1])
      parts.push(
        deck(`maze-${i}-end-${side}`, l + side * 2.5, d, 0.55, 3.6, 25.2, {
          h: 1.2,
        }),
      );
  }
  const route = [
    [-10, 24, 4],
    [-10, 24, 12],
    [-2, 24, 12],
    [6, 24, 13],
    [9, 24, 17],
    [7, 24, 22],
    [10, 24, 25],
    [7, 22, 30],
    [-1, 20, 34],
    [-10, 17, 43],
    [-11.8, 17, 45],
    [-11.8, 17, 52],
    [-5, 17, 53],
    [-5, 17, 56],
    [-5, 16, 60],
    [0, 16, 63],
    [0, 16, 66],
    [-0.8, 14.4, 70.8],
    [-9, 14, 72],
    [-10, 14, 74],
    [0, 11, 78],
    [0, 11, 81],
    [-8, 11, 81],
    [-8, 11, 85],
    [-13, 11, 87],
    [-13, 11, 91],
    [-4, 11, 94],
    [-1.8, 10.6, 94.8],
    [-1, 7.2, 97],
    [-1, 4.2, 101],
    [0, 4.2, 104],
    [0, 4.2, 108],
    [-3, 4.2, 114],
    [-4, 2, 122],
    [-6, 2, 129],
    [-8, 2, 134],
  ].map(([l, h, d]) =>
    routePoint(l, h, d, {
      speed: 2.8,
      ...(d >= 94 && d <= 114
        ? { radius: 2.3 }
        : d >= 117
          ? { radius: 1.8 }
          : {}),
    }),
  );
  const pipeRoute = [
    ...route.slice(0, 16),
    ...[
      [5, 16, 64],
      [10, 16, 65],
      [10, 16, 67],
      [10, 13.2, 72],
      [10, 11, 78],
      [10, 11, 83],
      [10, 11, 85],
      [8, 10, 86],
      [3, 10, 89],
      [3, 10, 94],
      [3, 8.2, 97],
      [3, 5.2, 101],
      [6, 4.2, 104],
      [6, 4.2, 108],
      [-3, 4.2, 114],
      [-4, 2, 122],
      [-6, 2, 129],
      [-8, 2, 134],
    ].map(([l, h, d]) =>
      routePoint(l, h, d, {
        speed: 2.8,
        ...((d >= 67 && d <= 80) || d >= 94 ? { radius: 2 } : {}),
      }),
    ),
  ];
  for (const i of [17, 18])
    Object.assign(pipeRoute[i], { radius: 0.25, speed: 1.8 });
  for (const i of [21, 22])
    Object.assign(pipeRoute[i], { radius: 0.6, speed: 1.8 });
  const upperRightRoute = roundDemoCorners([
    ...pipeRoute.slice(0, 9),
    ...[
      [10, 43],
      [11.8, 45],
      [11.8, 53],
      [0, 53],
    ].map(([l, d]) => routePoint(l, 17, d, { speed: 2.8 })),
    ...pipeRoute.slice(12),
  ]);
  // Settle onto the shared fork before taking its sharper right-hand exit.
  Object.assign(upperRightRoute[8], { speed: 2.2, radius: 0.35, flow: false });
  return {
    schema: 1,
    id: "beginner",
    medals: { gold: 75, silver: 110 },
    rules: AMIGA_RULES,
    revision: 2,
    name: "Beginner Race",
    subtitle: "Cyan towers, branching descents, twin pipes, and an icy finish.",
    category: "campaign",
    courseNumber: 2,
    color: "#2284ba",
    sidePalette: ["#235474", "#259bc9", "#38cce3", "#265478"],
    time: COURSE_TIME.beginner,
    parity: "reconstruction",
    reference: {
      id: "MM-A500-R13-MAP-02",
      status: "layout reconstruction; quantitative parity pending",
      landmarks: [
        "five rectangular training obstacles",
        "forked descent",
        "three pyramids",
        "steelie landing",
        "two pipe transfers",
        "left ledge alternative",
        "ice pyramid",
        "lower-left finish",
      ],
    },
    starts: [worldPoint(-11, 24.56, 4), worldPoint(-9.5, 24.56, 4)],
    goal: {
      ...worldPoint(-8, 2, 134),
      angle: ISO - Math.PI / 2,
      width: 5.4,
      depth: 1.3,
    },
    checkpoints: [
      worldPoint(-5, 17.56, 46),
      worldPoint(0, 16.56, 63),
      worldPoint(-8, 11.56, 83),
      worldPoint(6, 4.76, 108),
    ],
    parts,
    route: roundDemoCorners(pipeRoute),
    playerRoutes: [roundDemoCorners(pipeRoute), roundDemoCorners(route)],
    alternateRoutes: [
      { id: "left-ledge", name: "Left ledge maze", route },
      {
        id: "upper-right-fork",
        name: "Upper-right fork and twin pipes",
        route: upperRightRoute,
      },
    ],
    zones: [],
    enemies: [
      {
        id: "landing-steelie",
        kind: "steelie",
        ...worldPoint(9, 16.56, 64),
        radius: 0.55,
        roam: 3,
        speed: 1.8,
      },
    ],
    markings: [{ kind: "arrow", ...worldPoint(10, 24.02, 25), angle: ISO }],
  };
}

export function intermediateCourse() {
  const parts = [
    deck("start-left", -11, 2, 6, 6, 28, { h: 31 }),
    deck("start-right", 11, 2, 6, 6, 28, { h: 31 }),
    ribbon(
      "left-start-chute",
      [
        [-11, 5, 28],
        [-8, 12, 24],
      ],
      3.4,
      0.35,
    ),
    ribbon(
      "right-start-chute",
      [
        [11, 5, 28],
        [8, 12, 24],
      ],
      3.4,
      0.35,
    ),
    deck("upper-center", 0, 15, 15, 8, 24, { h: 27 }),
    deck("north-island", 0, 8, 6, 5, 24, { h: 27 }),
    ribbon(
      "left-outer-maze",
      [
        [-8, 12, 24],
        [-14, 18, 24],
        [-14, 25, 24],
        [-10, 29, 24],
      ],
      3.4,
    ),
    ribbon(
      "right-outer-maze",
      [
        [8, 12, 24],
        [14, 18, 24],
        [14, 25, 24],
        [10, 29, 24],
      ],
      3.4,
    ),
    ribbon(
      "left-inner-maze",
      [
        [-6, 18, 24],
        [-3, 21, 24],
        [-10, 25, 24],
        [-10, 29, 24],
      ],
      3.4,
    ),
    ribbon(
      "right-inner-maze",
      [
        [6, 18, 24],
        [3, 21, 24],
        [10, 25, 24],
        [10, 29, 24],
      ],
      3.4,
    ),
    ribbon(
      "left-muncher-descent",
      [
        [-10, 29, 24],
        [-10, 38, 16],
      ],
      3.6,
    ),
    ribbon(
      "right-muncher-descent",
      [
        [10, 29, 24],
        [10, 38, 16],
      ],
      3.6,
    ),
    deck("left-muncher-landing", -10, 40, 8, 6, 16, { h: 19 }),
    deck("right-muncher-landing", 10, 40, 8, 6, 16, { h: 19 }),
    deck("middle-step-high", 0, 29, 5, 4, 21, { h: 24 }),
    deck("middle-step-low", 0, 34, 5, 4, 18, { h: 21 }),
    deck("middle-island", 0, 40, 5, 4, 16, { h: 19 }),
    ribbon(
      "left-converging-ledge",
      [
        [-10, 42, 16],
        [-2, 48, 16],
        [-8, 54, 13],
      ],
      3.6,
    ),
    ribbon(
      "right-converging-ledge",
      [
        [10, 42, 16],
        [13, 46, 16],
        [2, 54, 13],
        [-8, 56, 13],
      ],
      3.6,
    ),
    outline(
      "acid-islands",
      [
        [-14, 55],
        [2, 55],
        [2, 58],
        [10, 58],
        [10, 63],
        [14, 63],
        [14, 71],
        [5, 71],
        [5, 75],
        [-5, 75],
        [-5, 72],
        [-14, 72],
      ],
      13,
      16,
    ),
    deck("acid-safe-west", -6, 61, 5, 5, 13, { kind: "pyramid", rise: 1.1 }),
    deck("acid-safe-east", 6, 68, 5, 5, 13, { kind: "pyramid", rise: 1.1 }),
    deck("pipe-entry", 0, 76, 8, 5, 13, { h: 16 }),
    deck("orange-pipe", 0, 0, 4, 18, 0, {
      kind: "tube",
      material: "orange",
      radius: 1.8,
      path: [
        { x: 0, y: 14.8, z: 77 },
        { x: 0, y: 14.6, z: 79 },
        { x: 0, y: 10, z: 82 },
        { x: 0, y: 7, z: 85 },
        { x: 0, y: 6.8, z: 88 },
      ],
    }),
    ribbon(
      "pipe-left-bypass",
      [
        [-11, 71, 13],
        [-14, 76, 13],
        [-14, 82, 9],
        [-8, 86, 7],
        [-5, 90, 5],
      ],
      3.8,
    ),
    deck("pipe-landing", -1, 90, 12, 6, 5, { h: 8 }),
    ribbon(
      "lower-zigzag",
      [
        [-4, 92, 5],
        [-10, 96, 5],
        [-10, 100, 5],
        [-3, 104, 4],
      ],
      3.6,
    ),
    ribbon(
      "first-wave",
      [
        [0, 91, 5],
        [5, 94, 5],
        [5, 96, 7],
        [5, 98, 5],
        [10, 102, 5],
        [10, 104, 7],
        [10, 106, 5],
      ],
      4,
    ),
    ribbon(
      "left-rolling-lane",
      [
        [-3, 104, 4],
        [-7, 109, 1],
        [-5, 113, 3],
        [-2, 117, -0.5],
        [0, 121, 1],
        [1, 125, 0],
      ],
      2.8,
    ),
    ribbon(
      "right-rolling-lane",
      [
        [10, 106, 5],
        [7, 110, 2],
        [8, 114, 3],
        [4, 118, -0.5],
        [5, 122, 1],
        [1, 125, 0],
      ],
      2.8,
    ),
    deck("final-landing", 1, 128, 9, 7, 0, { h: 3 }),
  ];
  const route = [
    [-11, 28, 3],
    [-11, 28, 5],
    [-8, 24, 12],
    [-14, 24, 18],
    [-14, 24, 25],
    [-10, 24, 29],
    [-10, 16, 38],
    [-11, 16, 41],
    [-2, 16, 48],
    [-8, 13, 54],
    [-11, 13, 58],
    [-11, 13, 65],
    [-11, 13, 71],
    [-14, 13, 76],
    [-14, 9, 82],
    [-8, 7, 86],
    [-5, 5, 90],
    [-4, 5, 92],
    [-10, 5, 96],
    [-10, 5, 100],
    [-3, 4, 104],
    [-7, 1, 109],
    [-5, 3, 113],
    [-2, -0.5, 117],
    [0, 1, 121],
    [1, 0, 125],
    [1, 0, 128],
  ].map(([l, h, d]) =>
    routePoint(l, h, d, {
      speed: 2.4,
      ...(d >= 104 ? { radius: 1 } : {}),
      ...(d === 38 ? { radius: 1.4 } : {}),
    }),
  );
  const rightRoute = [
    [11, 28, 3],
    [11, 28, 5],
    [8, 24, 12],
    [14, 24, 18],
    [14, 24, 25],
    [10, 24, 29],
    [10, 16, 38],
    [11, 16, 41],
    [13, 16, 46],
    [2, 13, 54],
    [-8, 13, 56],
    [-11, 13, 58],
  ].map(([l, h, d]) =>
    routePoint(l, h, d, { speed: 2.4, ...(d === 38 ? { radius: 1.4 } : {}) }),
  );
  const course = {
    schema: 1,
    id: "intermediate",
    medals: { gold: 65, silver: 95 },
    revision: 2,
    name: "Intermediate Race",
    courseNumber: 3,
    subtitle:
      "Split towers, acid islands, an orange pipe, and rolling final lanes.",
    category: "campaign",
    rules: AMIGA_RULES,
    time: COURSE_TIME.intermediate,
    color: "#777948",
    sidePalette: ["#555746", "#9d9d61", "#454a44", "#676b49"],
    parity: "reconstruction",
    reference: {
      id: "MM-A500-R13-MAP-03",
      status: "layout reconstruction; quantitative parity pending",
      landmarks: [
        "paired start towers",
        "branching upper maze",
        "muncher landings",
        "acid patches and safe islands",
        "orange pipe and ledge alternative",
        "green waves",
        "split rolling lanes",
      ],
    },
    starts: [worldPoint(-11, 28.56, 2), worldPoint(11, 28.56, 2)],
    goal: { ...worldPoint(1, 0, 128), angle: ISO, width: 7, depth: 1.3 },
    checkpoints: [
      worldPoint(-11, 16.56, 41),
      worldPoint(-11, 13.56, 58),
      worldPoint(-4, 5.56, 92),
      worldPoint(-3, 4.56, 104),
    ],
    parts,
    route,
    alternateRoutes: [
      {
        id: "right-upper-maze",
        name: "Right start and maze",
        start: 1,
        route: [...rightRoute, ...route.slice(12)],
      },
    ],
    zones: [
      [-1, 57],
      [6, 60],
      [3, 64],
      [-1, 66],
      [-7, 66],
    ].map(([l, d], i) => ({
      kind: "acid",
      ...worldPoint(l, 13, d),
      radius: 1.2,
      wobblePhase: i * 0.8,
      ...(i === 4
        ? {
            // The isolated lower-left puddle at 110.44–113.64s travels down one
            // axis, then turns onto the perpendicular axis. Return legs and scale
            // remain reconstructed; preserve straight, constant-speed travel.
            patrol: {
              points: [
                [-7, 66],
                [-7, 69],
                [-3, 69],
                [-3, 66],
              ].map(([l, d]) => worldPoint(l, 13, d)),
              speed: 1.45,
            },
          }
        : {
            motion: {
              axis: i % 2 ? "x" : "z",
              amplitude: 0.55,
              period: 5 + i,
              phase: i * 0.8,
            },
          }),
    })),
    enemies: [
      {
        id: "left-muncher",
        kind: "muncher",
        ...worldPoint(-8, 16.9, 39),
        radius: 0.65,
        roam: 2.5,
        speed: 0.6,
      },
      {
        id: "right-muncher",
        kind: "muncher",
        ...worldPoint(8, 16.9, 39),
        radius: 0.65,
        roam: 2.5,
        speed: 0.6,
      },
    ],
    markings: [],
  };
  // Reference elevation ratios remain under review. This authoring conversion
  // sets the traversable slopes; the compiler supplies both render and collider.
  for (const p of course.parts) {
    p.y *= 0.5;
    if (p.rise) p.rise *= 0.5;
    if (p.bank) p.bank *= 0.5;
    if (
      ["first-wave", "left-rolling-lane", "right-rolling-lane"].includes(p.id)
    )
      p.material = "green";
    for (const v of p.path ?? [])
      v.y = p.kind === "tube" ? (v.y - p.radius) * 0.5 + p.radius : v.y * 0.5;
  }
  for (const p of [...course.starts, ...course.checkpoints])
    p.y = (p.y - 0.56) * 0.5 + 0.56;
  for (const p of [
    course.goal,
    ...course.route,
    ...rightRoute,
    ...course.zones,
  ])
    p.y *= 0.5;
  for (const e of course.enemies) e.y = (e.y - 0.9) * 0.5 + 0.9;
  course.playerRoutes = [
    roundDemoCorners(route),
    roundDemoCorners(course.alternateRoutes[0].route),
  ];
  course.route = course.playerRoutes[0];
  course.parts = course.parts.filter((p) => p.id !== "first-wave");
  course.parts.push(
    ribbon(
      "wave-entry",
      [
        [0, 91, 2.5],
        [5, 94, 2.5],
      ],
      4,
    ),
    ...waveStrip(
      "upper-wave",
      worldPoint(5, 2.5, 94),
      worldPoint(5, 2.5, 98),
      4,
      { amplitude: 0.75, period: 2.8, wavelength: 4 },
    ),
    ribbon(
      "wave-turn",
      [
        [5, 98, 2.5],
        [10, 102, 2.5],
      ],
      4,
    ),
    ...waveStrip(
      "lower-wave",
      worldPoint(10, 2.5, 102),
      worldPoint(10, 2.5, 106),
      4,
      { amplitude: 0.75, period: 2.8, wavelength: 4 },
    ),
  );
  const pipeRoute = [
    ...course.route.slice(0, 12),
    ...[
      [-11, 13, 71],
      [-6, 13, 70],
      [0, 13, 70],
      [0, 13, 74],
      [0, 13, 77],
      [0, 10, 82],
      [0, 5, 88],
      [0, 5, 91],
      [5, 5, 94],
      [5, 5, 96],
      [5, 5, 98],
      [10, 5, 102],
      [10, 5, 104],
      [10, 5, 106],
      [7, 2, 110],
      [8, 3, 114],
      [4, -0.5, 118],
      [5, 1, 122],
      [1, 0, 125],
      [1, 0, 128],
    ].map(([l, h, d]) => ({
      ...worldPoint(l, h * 0.5, d),
      speed: 2.4,
      radius: d === 77 ? 0.3 : 0.7,
    })),
  ];
  course.alternateRoutes.push({
    id: "pipe-wave-route",
    name: "Orange pipe and traveling waves",
    route: pipeRoute,
  });
  return course;
}

export const campaignCourses = () => [
  practiceCourse(),
  beginnerCourse(),
  intermediateCourse(),
  aerialCourse(),
  sillyCourse(),
  ultimateCourse(),
];
