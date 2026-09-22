import {
  deck,
  ribbon,
  routePoint,
  worldPoint,
  ISO,
} from "./course-authoring.mjs";

// Amiga final-room topology: a disappearing entry, staggered lower crossings,
// a rising ramp and ice return, then the gold disappearing approach to the flag.
// The sampled entry cycle repeats every six seconds in four 1.5-second phases.
// World dimensions and the lower crossing phases remain reconstructed.
const CELL = 2.4,
  ORIGIN = 120.2;
const point = (x, z, y = 4) => [x * CELL, y, ORIGIN + z * CELL];
const waypoint = (x, z, y = 4, extra = {}) =>
  routePoint(...point(x, z, y), { speed: 2.4, radius: 0.35, ...extra });

export function ultimateFinish() {
  const parts = [],
    route = [];
  const pad = (id, x, z, y = 4, width = CELL, depth = CELL) => {
    const [l, h, d] = point(x, z, y);
    parts.push(
      deck(id, l, d, width, depth, h, {
        h: h + 4,
        material: id === "goal" ? "sand" : "ceramic",
      }),
    );
  };
  const crossing = (id, cells, y = 4, material = "slate", offset = 0) => {
    cells.forEach(([x, z], i) => {
      const [l, h, d] = point(x, z, y);
      parts.push(
        deck(`${id}-${i}`, l, d, CELL, CELL, h, {
          kind: "moving",
          h: h + 4,
          material,
          motion: { axis: "y", amplitude: 0, period: 6 },
          presence: { period: 6, on: 4.5, phase: -(offset + i) * 1.5 },
        }),
      );
    });
  };
  const wait = (x, z, part, y = 4, remaining = 2.8) =>
    waypoint(x, z, y, {
      stop: true,
      waitFor: { part, axis: "y", min: y - 0.01, max: y + 0.01, remaining },
    });

  crossing("finish-entry", [
    [0, 0],
    [0, 1],
    [0, 2],
  ]);
  pad("finish-first-turn", 0, 3);
  route.push(
    wait(0, -0.8, "finish-entry-0", 4, 4.2),
    waypoint(0, 3, 4, { stop: true }),
  );

  const legs = [
    { start: [0, 3], cells: [[1, 3]], end: [2, 3] },
    { start: [2, 3], cells: [[2, 4]], end: [2, 5] },
    { start: [2, 5], cells: [[3, 5]], end: [4, 5] },
    { start: [4, 5], cells: [[4, 6]], end: [4, 7] },
    {
      start: [4, 7],
      cells: [
        [5, 7],
        [6, 7],
        [7, 7],
      ],
      end: [8, 7],
    },
  ];
  legs.forEach((leg, i) => {
    const id = `finish-step-${i}`;
    crossing(id, leg.cells, 4, "slate", 4 + i * 2);
    // Dark corners disappear too: only the white entrance and lower landing
    // remain supported throughout the observed cycle.
    if (i === 4) pad(`${id}-turn`, ...leg.end, 4, CELL * 2, CELL * 2);
    else crossing(`${id}-corner`, [leg.end], 4, "slate", 5 + i * 2);
    route.push(
      wait(...leg.start, `${id}-0`, 4, leg.cells.length === 3 ? 4.2 : 2.8),
      waypoint(...leg.end, 4, { stop: true }),
    );
  });
  parts.push(
    ribbon(
      "finish-return-ramp",
      [
        [8 * CELL, ORIGIN + 6 * CELL, 4],
        [8 * CELL, ORIGIN + 4 * CELL, 6],
      ],
      CELL,
    ),
  );
  const ice = ribbon(
    "finish-return-ice",
    [
      [8 * CELL, ORIGIN + 4 * CELL, 6],
      [8 * CELL, ORIGIN + 1.5 * CELL, 6],
    ],
    CELL,
  );
  ice.material = "ice";
  parts.push(ice);
  pad("finish-upper-turn", 8, 1, 6);
  route.push(
    waypoint(8, 6, 4, { speed: 1.8 }),
    waypoint(8, 4, 6, { speed: 1.4 }),
    waypoint(8, 1, 6, { speed: 1.4, stop: true }),
  );

  crossing(
    "finish-gold",
    [
      [7, 1],
      [6, 1],
      [5, 1],
    ],
    6,
    "sand",
  );
  pad("finish-goal-turn", 4, 1, 6);
  parts.push(
    ribbon(
      "finish-goal-link",
      [
        [4 * CELL, ORIGIN + CELL, 6],
        [4 * CELL, ORIGIN + 2.5 * CELL, 6],
      ],
      CELL,
    ),
  );
  pad("goal", 5, 2.5, 6, CELL * 3, CELL);
  route.push(
    wait(8, 1, "finish-gold-0", 6, 4.2),
    waypoint(4, 1, 6, { stop: true }),
    waypoint(4, 2.5, 6),
  );
  const goal = {
    ...worldPoint(...point(4, 2.3, 6)),
    angle: ISO,
    width: CELL,
    depth: 0.8,
  };
  return { parts, route, goal };
}
