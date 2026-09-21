import { roundDemoCorners } from "./demo-route.mjs";
import {
  ISO,
  worldPoint,
  deck,
  ribbon,
  routePoint,
} from "./course-authoring.mjs";
import { amigaCourseRules, COURSE_TIME } from "./rules.mjs";

export function aerialCourse() {
  const parts = [
    deck("start-left", -10, 2, 6, 5, 18, { material: "sand", h: 21 }),
    deck("start-right", 10, 2, 6, 5, 18, { material: "sand", h: 21 }),
    ribbon(
      "left-bowl",
      [
        [-10, 4, 18],
        [-8, 8, 16.8],
        [-5, 12, 16],
      ],
      3,
    ),
    ribbon(
      "right-bowl",
      [
        [10, 4, 18],
        [8, 8, 16.8],
        [5, 12, 16],
      ],
      3,
    ),
    ribbon(
      "cross-rail-left",
      [
        [-5, 12, 16],
        [3, 18, 16],
      ],
      1.5,
    ),
    ribbon(
      "cross-rail-right",
      [
        [5, 12, 16],
        [-3, 18, 16],
      ],
      1.5,
    ),
    ribbon(
      "left-gray-entry",
      [
        [-3, 18, 14.5],
        [-10, 23, 14.5],
      ],
      2,
    ),
    ribbon(
      "right-gray-entry",
      [
        [3, 18, 14.5],
        [10, 23, 14.5],
      ],
      2,
    ),
    deck("left-first-junction", -10, 25, 7, 5, 14.5, { h: 17.5 }),
    deck("right-first-junction", 10, 25, 7, 5, 14.5, { h: 17.5 }),
    ribbon(
      "left-vacuum-zigzag",
      [
        [-10, 27, 14.5],
        [-8, 32, 12.5],
        [-2, 36, 12.5],
        [-12, 44, 12.5],
        [0, 52, 12.5],
      ],
      3,
    ),
    ribbon(
      "right-vacuum-zigzag",
      [
        [10, 27, 14.5],
        [12, 32, 12.5],
        [18, 36, 12.5],
        [6, 44, 12.5],
        [16, 52, 12.5],
      ],
      3,
    ),
    ribbon(
      "left-steelie-branch",
      [
        [0, 52, 12.5],
        [-8, 57, 12.5],
        [-12, 60, 12.5],
      ],
      3,
    ),
    deck("steelie-room", -12, 61, 9, 8, 12.5, { h: 15.5 }),
    ribbon(
      "right-hammer-entry",
      [
        [16, 52, 12.5],
        [10, 56, 11.5],
        [4, 59, 11.5],
      ],
      3,
    ),
    ribbon(
      "hammer-crossing",
      [
        [4, 59, 11.5],
        [-3, 63, 10.5],
      ],
      4,
    ),
    ribbon(
      "center-ledge",
      [
        [-3, 63, 10.5],
        [-3, 67, 10.5],
        [3, 70, 10.5],
      ],
      3,
    ),
    ribbon(
      "left-lower-descent",
      [
        [-12, 65, 12.5],
        [-9, 71, 10.5],
        [-3, 76, 10.5],
        [-9, 81, 10.5],
      ],
      3,
    ),
    ribbon(
      "right-lower-descent",
      [
        [3, 70, 10.5],
        [1, 75, 9],
        [3, 77, 9],
        [10, 82, 6],
        [10, 85, 6],
        [4, 89, 5],
        [12, 95, 5],
      ],
      3,
    ),
    deck("right-descent-landing", 10, 83.5, 5, 5, 6, { h: 9 }),
    ribbon(
      "left-yellow-ledge",
      [
        [-9, 81, 10.5],
        [-9, 85, 10.5],
        [-1, 90, 8],
        [4, 94, 8],
      ],
      3,
    ),
    ribbon(
      "left-lower-crossing",
      [
        [-10, 96, 5],
        [-5, 100, 5],
        [4, 94, 5],
      ],
      3,
    ),
    ribbon(
      "right-yellow-ledge",
      [
        [12, 93, 5],
        [8, 98, 5],
        [1, 103, 5],
      ],
      3,
    ),
    ribbon(
      "right-final-connector",
      [
        [1, 103, 5],
        [1, 106, 4],
        [1, 108, 4],
      ],
      3,
    ),
    ribbon(
      "left-final-descent",
      [
        [4, 94, 8],
        [2, 98, 6],
        [-4, 102, 4],
        [-4, 105, 4],
      ],
      3,
    ),
    deck("descent-turning-landing", -4, 104.5, 4.5, 5, 4, { h: 7 }),
    ribbon(
      "last-junction",
      [
        [-4, 105, 4],
        [1, 108, 4],
        [8, 104, 4],
        [13, 108, 4],
      ],
      3,
    ),
    ribbon(
      "lower-finish-branch",
      [
        [1, 108, 4],
        [-8, 115, 4],
      ],
      2.6,
    ),
    ribbon(
      "upper-finish-branch",
      [
        [13, 108, 4],
        [7, 113, 4],
        [1, 111, 4],
        [-8, 118, 4],
      ],
      2.6,
    ),
    deck("finish", -8, 118, 7, 6, 4, { h: 7 }),
    ribbon(
      "paddle-spur",
      [
        [-3, 65, 10.5],
        [-5.5, 66.7, 10.5],
      ],
      3,
    ),
    deck("red-paddle", -6, 66.7, 2.2, 2.4, 10.53, {
      kind: "spring",
      profile: "flipper",
      material: "red",
      angle: -Math.PI / 2,
      motion: { axis: "launch", amplitude: 1.5, period: 0.9, delay: 0.5 },
    }),
    deck("paddle-hinge", -6.85, 65.85, 2.3, 0.35, 10.5, {
      kind: "wall",
      h: 0.3,
      material: "metal",
      angle: -Math.PI / 2,
    }),
  ];
  // Amiga 161.28-162.60 and 166.20-169.44: 3x4 metal caps with
  // full rows OR perpendicular columns rising for roughly 0.76 seconds.
  // Selection/cadence is a deterministic reconstruction, not a recovered ROM rule.
  for (const [id, l, d, y, seed, phase] of [
    ["upper-pegs", -12, 64, 12.5, 139, 0],
    ["lower-pegs", -9, 82.3, 10.5, 271, 1.6],
    ["right-pegs", 10, 84, 6, 419, 3.2],
  ])
    for (let row = 0; row < 3; row++)
      for (let column = 0; column < 4; column++)
        parts.push(
          deck(
            `${id}-${row}-${column}`,
            l + (column - 1.5) * 0.7,
            d + (row - 1) * 0.7,
            0.56,
            0.56,
            y + 0.002,
            {
              kind: "piston",
              profile: "peg",
              h: 1.8,
              material: "metal",
              motion: {
                axis: "y",
                amplitude: 1.75,
                period: 0.88,
                phase,
                cycle: "retract",
                grid: { rows: 3, columns: 4, row, column, seed },
              },
            },
          ),
        );
  for (const p of parts.filter(
    (p) => p.id.includes("bowl") || p.id.includes("cross-rail"),
  ))
    p.material = "sand";
  const zones = [];
  // Three mouth locations are visible at 146–154s. Their finite activity is
  // observed; repetition periods remain provisional until a full cycle is traced.
  for (const [id, from, to, fraction, edge, on, phase] of [
    ["upper", [-2, 36], [-12, 44], 0.25, -1, 6, 4.5],
    ["middle", [-2, 36], [-12, 44], 0.7, -1, 3, 1],
    ["lower", [-12, 44], [0, 52], 0.5, 1, 5, 0],
  ]) {
    const dl = to[0] - from[0],
      dd = to[1] - from[1];
    const length = Math.hypot(dl, dd);
    // The housings sit on the outer edge and face the centerline. The third
    // intake turns with the next zigzag leg, as in the Amiga 150.80s frame.
    const nl = (-dd / length) * edge,
      nd = (dl / length) * edge;
    const l = from[0] + dl * fraction - nl * 1.3;
    const d = from[1] + dd * fraction - nd * 1.3;
    const direction = worldPoint(nl, 0, nd);
    const angle = Math.atan2(-direction.z, -direction.x);
    const h = 12.5,
      presence = { period: 10, on, phase, transition: 0.24 };
    parts.push(
      deck(`${id}-vacuum-mouth`, l, d, 0.5, 2.4, h, {
        kind: "piston",
        profile: "vacuum-mouth",
        angle,
        h: 1.9,
        material: "yellow",
        motion: { axis: "y", amplitude: 0, period: 10 },
        presence,
      }),
    );
    zones.push({
      kind: "vacuum",
      mouth: `${id}-vacuum-mouth`,
      intakeHeight: 0.9,
      ...worldPoint(l, h + 0.9, d),
      radius: 4,
      strength: 1.3,
      direction,
    });
  }
  const route = [
    [10, 18, 3],
    [10, 18, 4],
    [8, 16.8, 8],
    [5, 16, 12],
    [-3, 16, 18],
    [-10, 14.5, 23],
    [-10, 14.5, 26],
    [-8, 12.5, 32],
    [-2, 12.5, 36],
    [-12, 12.5, 44],
    [0, 12.5, 52],
    [-8, 12.5, 57],
    [-14, 12.5, 61],
    [-12, 12.5, 61.7],
    [-12, 12.5, 66],
    [-9, 10.5, 71],
    [-3, 10.5, 76],
    [-9, 10.5, 80],
    [-9.6, 10.5, 85],
    [-1, 8, 90],
    [4, 8, 94],
    [2, 6, 98],
    [-4, 4, 102],
    [-4, 4, 105],
    [1, 4, 108],
    [-8, 4, 115],
    [-8, 4, 118],
  ].map(([l, h, d]) =>
    routePoint(l, h, d, {
      speed: d < 24 ? 1.8 : 2.4,
      radius: d === 18 ? 1 : 0.65,
    }),
  );
  const rightRoute = [
    [-10, 18, 3],
    [-10, 18, 4],
    [-8, 16.8, 8],
    [-5, 16, 12],
    [3, 16, 18],
    [10, 14.5, 23],
    [10, 14.5, 26],
    [12, 12.5, 32],
    [18, 12.5, 36],
    [6, 12.5, 44],
    [16, 12.5, 52],
    [10, 11.5, 56],
    [4, 11.5, 59],
    [-3, 10.5, 63],
    [-3, 10.5, 67],
    [3, 10.5, 70],
    [1, 9, 75],
    [3, 9, 77],
    [10, 6, 81.7],
    [10, 6, 85],
    [4, 5, 89],
    [12, 5, 95],
    [8, 5, 98],
    [1, 5, 103],
    [1, 4, 108],
    [-8, 4, 115],
    [-8, 4, 118],
  ].map(([l, h, d]) =>
    routePoint(l, h, d, {
      speed: d < 24 ? 1.8 : 2.4,
      radius: d === 18 ? 1 : 0.65,
    }),
  );
  for (const [points, l, d, bank] of [
    [route, -12, 61.7, "upper-pegs"],
    [route, -9, 80, "lower-pegs"],
    [rightRoute, 10, 81.7, "right-pegs"],
  ]) {
    const at = worldPoint(l, 0, d);
    const waypoint = points.find(
      (p) => Math.hypot(p.x - at.x, p.z - at.z) < 0.01,
    );
    Object.assign(waypoint, {
      stop: true,
      speed: points === route ? 4.8 : 2.4,
      radius: 0.3,
      waitForPegBed: bank,
    });
  }
  // Keep rolling through the shallow bend into the right-hand descent.
  // The acceptance radius stays inside the three-unit-wide track.
  rightRoute[17].radius = 0.9;
  return {
    schema: 1,
    id: "aerial",
    medals: { gold: 75, silver: 110 },
    revision: 1,
    name: "Aerial Race",
    courseNumber: 4,
    subtitle:
      "Crossed balancing rails, vacuum turns, and the yellow tower descent.",
    category: "campaign",
    rules: amigaCourseRules("aerial"),
    time: COURSE_TIME.aerial,
    color: "#bd6328",
    sidePalette: ["#b8381f", "#df8b2d", "#edac41", "#5b3933"],
    parity: "reconstruction",
    reference: {
      id: "MM-A500-R13-MAP-04",
      status: "layout reconstruction; quantitative parity pending",
      landmarks: [
        "paired start bowls",
        "crossed narrow rails",
        "twin zigzags and vacuums",
        "steelie room",
        "red hinged paddle and retracting pegs",
        "yellow lower towers",
        "branching finish",
      ],
    },
    starts: [worldPoint(10, 18.56, 2), worldPoint(-10, 18.56, 2)],
    goal: { ...worldPoint(-8, 4, 118), angle: ISO, width: 5.5, depth: 1.3 },
    parts,
    route: roundDemoCorners(route, { from: 7 }),
    zones,
    playerRoutes: [
      roundDemoCorners(route, { from: 7 }),
      roundDemoCorners(rightRoute, { from: 7, to: 14 }),
    ],
    alternateRoutes: [
      {
        id: "right-hammer-route",
        name: "Right zigzag and paddle",
        start: 1,
        route: rightRoute,
      },
    ],
    checkpoints: [
      worldPoint(-10, 15.06, 25),
      worldPoint(-14, 13.06, 61),
      worldPoint(-9, 11.06, 81),
      worldPoint(-4, 4.56, 105),
    ],
    enemies: [
      {
        id: "steelie",
        kind: "steelie",
        ...worldPoint(-10, 13.06, 60),
        radius: 0.55,
        roam: 3,
        speed: 1.6,
      },
    ],
  };
}
