import {
  ISO,
  worldPoint,
  deck,
  ribbon,
  routePoint,
} from "./course-authoring.mjs";
import { AMIGA_RULES } from "./rules.mjs";

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
    deck("hammer", 0.5, 61, 5, 1, 15, {
      kind: "piston",
      h: 1.5,
      material: "metal",
      motion: { axis: "y", amplitude: 3, period: 3.5 },
    }),
    deck("left-piston", -11, 63, 1, 1, 14.6, {
      kind: "piston",
      h: 2.1,
      material: "metal",
      motion: { axis: "y", amplitude: 1.5, period: 3.8 },
    }),
    deck("yellow-piston", -7.9, 84, 1, 1, 12.2, {
      kind: "piston",
      h: 1.7,
      material: "metal",
      motion: { axis: "y", amplitude: 1.1, period: 4.2 },
    }),
  ];
  for (const p of parts.filter(
    (p) => p.id.includes("bowl") || p.id.includes("cross-rail"),
  ))
    p.material = "sand";
  const zones = [];
  for (const [id, l, d] of [
    ["upper", 1, 36],
    ["lower", 3, 52],
  ]) {
    const h = 12.5;
    // A hollow rectangular mouth made of four shared mesh/collider solids.
    parts.push(
      deck(`${id}-vacuum-top`, l, d, 0.45, 2.4, h + 1.9, {
        kind: "wall",
        h: 0.3,
        material: "yellow",
      }),
      deck(`${id}-vacuum-bottom`, l, d, 0.45, 2.4, h + 0.25, {
        kind: "wall",
        h: 0.25,
        material: "yellow",
      }),
    );
    for (const side of [-1, 1])
      parts.push(
        deck(
          `${id}-vacuum-side-${side}`,
          l,
          d + side * 1.05,
          0.45,
          0.3,
          h + 1.6,
          { kind: "wall", h: 1.35, material: "yellow" },
        ),
      );
    zones.push({
      kind: "vacuum",
      ...worldPoint(l, h + 0.9, d),
      radius: 4,
      strength: 1.3,
      direction: worldPoint(-1, 0, 0),
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
    [-12, 12.5, 65],
    [-9, 10.5, 71],
    [-3, 10.5, 76],
    [-9, 10.5, 81],
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
    [10, 6, 82],
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
    rules: AMIGA_RULES,
    time: 30,
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
        "hammer and pistons",
        "yellow lower towers",
        "branching finish",
      ],
    },
    starts: [worldPoint(10, 18.56, 2), worldPoint(-10, 18.56, 2)],
    goal: { ...worldPoint(-8, 4, 118), angle: ISO, width: 5.5, depth: 1.3 },
    parts,
    route,
    zones,
    playerRoutes: [route, rightRoute],
    alternateRoutes: [
      {
        id: "right-hammer-route",
        name: "Right zigzag and hammer",
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
