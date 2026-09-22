import { validateNativeSteelies } from "./native-steelie.mjs";
import { validateNativeSlinkies } from "./native-slinky.mjs";
import { validateNativeFlags } from "./native-flags.mjs";
import { validateAerialPegs, pegPose } from "./aerial-pegs.mjs";
import { compileTerrainSequence } from "./terrain-sequence.mjs";
import { validateTerrainNavigation } from "./terrain-navigation.mjs";
import { validateNativeCamera } from "./native-camera.mjs";
import { validateAerialVacuums, nativeVacuumPose } from "./aerial-vacuums.mjs";
import { validateAerialPaddle, paddlePose } from "./aerial-paddle.mjs";
import { validateNativeDynamics } from "./native-dynamics.mjs";
import {
  validateAerialHammers,
  hammerGeometry,
  hammerPose,
} from "./aerial-hammers.mjs";
import { vacuumPoseAt } from "./vacuum.mjs";
import { presenceAt } from "./mechanism-time.mjs";
export { presenceAt };
import {
  pegGeometry,
  extensionAt,
  flipperGeometry,
  vacuumGeometry,
  flipperLift,
} from "./mechanisms.mjs";
import { joinedBoardParts, mergeLevelTops } from "./board-joins.mjs";
import {
  ribbonGeometry,
  polygonGeometry,
  pyramidGeometry,
  tubeGeometry,
} from "./surface-geometry.mjs";
import { wavePose, WAVE_INDICES, WAVE_ROLES } from "./wave.mjs";
import { terrainGeometry, validateTerrain } from "./terrain-geometry.mjs";
import {
  validateAnimatedTerrain,
  expandAnimatedTerrain,
  terrainTrianglePose,
  TERRAIN_TRIANGLE_INDICES,
  TERRAIN_TRIANGLE_ROLES,
  TERRAIN_QUAD_INDICES,
  TERRAIN_QUAD_ROLES,
} from "./animated-terrain.mjs";
// CourseDefinition v1 is the only source of visible and physical track surfaces.
export const COURSE_SCHEMA = 1;
export const SURFACES = {
  stone: { friction: 0.9, color: "#e4ddd0", roughness: 0.52 },
  slate: { friction: 0.9, color: "#647174", roughness: 0.52 },
  ceramic: { friction: 0.85, color: "#dbe1de", roughness: 0.3 },
  ice: { friction: 0.035, color: "#8fd8de", roughness: 0.12 },
  glass: { friction: 0.4, color: "#b1ece6", roughness: 0.12 },
  brass: { friction: 0.8, color: "#c8a568", roughness: 0.35 },
  red: { friction: 0.9, color: "#bd4235", roughness: 0.3 },
  blue: { friction: 0.75, color: "#315fba", roughness: 0.24 },
  orange: { friction: 0.75, color: "#c4712f", roughness: 0.28 },
  green: { friction: 0.9, color: "#49a58e", roughness: 0.42 },
  sand: { friction: 0.9, color: "#d8af70", roughness: 0.55 },
  yellow: { friction: 0.9, color: "#e1bc24", roughness: 0.35 },
  metal: { friction: 0.7, color: "#879193", roughness: 0.4 },
  miniature: { friction: 0.9, color: "#839580", roughness: 0.48 },
};
const finite = (x) =>
  typeof x === "number" && Number.isFinite(x) && Math.abs(x) <= 2000;
export function validateCourse(c) {
  if (
    !c ||
    c.schema !== COURSE_SCHEMA ||
    typeof c.id !== "string" ||
    typeof c.name !== "string" ||
    !Number.isInteger(c.revision)
  )
    throw Error(
      "Unsupported course header. Expected schema 1, id, name and integer revision.",
    );
  if (!Array.isArray(c.parts) || c.parts.length > 500 || !c.parts.length)
    throw Error("A course needs 1–500 parts.");
  if (
    c.medals &&
    (!Number.isFinite(c.medals.gold) ||
      !Number.isFinite(c.medals.silver) ||
      c.medals.gold <= 0 ||
      c.medals.silver < c.medals.gold)
  )
    throw Error(
      "Medal targets need positive gold and silver times, with gold no slower than silver.",
    );
  const ids = new Set();
  let estimatedVertices = 0;
  for (const p of c.parts) {
    if (ids.has(p.id) || typeof p.id !== "string")
      throw Error("Part IDs must be unique.");
    ids.add(p.id);
    if (
      ![
        "floor",
        "ramp",
        "channel",
        "wall",
        "moving",
        "tilt",
        "piston",
        "spring",
        "ribbon",
        "polygon",
        "pyramid",
        "tube",
        "terrain",
      ].includes(p.kind)
    )
      throw Error("Unknown part type.");
    if (
      ![
        p.x,
        p.y,
        p.z,
        p.w,
        p.d,
        p.h ?? 0.5,
        p.rise ?? 0,
        p.bank ?? 0,
        p.angle ?? 0,
        p.bevel ?? 0,
      ].every(finite) ||
      p.w < 0.1 ||
      p.d < 0.1 ||
      p.w > (p.kind === "terrain" ? 200 : 100) ||
      p.d > (p.kind === "terrain" ? 200 : 100) ||
      (p.h ?? 0.5) < 0.05 ||
      (p.bevel ?? 0) < 0 ||
      (p.bevel ?? 0) > Math.min(p.w, p.d) / 4
    )
      throw Error("Invalid part dimensions.");
    if (!SURFACES[p.material ?? "stone"])
      throw Error("Unknown surface material.");
    if (
      p.launch &&
      (p.kind !== "spring" ||
        ![p.launch.forward, p.launch.lateral, p.launch.up].every(
          (v) => finite(v) && Math.abs(v) <= 20,
        ) ||
        p.launch.up < 0)
    )
      throw Error("Invalid launcher impulse.");
    if (p.launchBonus !== undefined) {
      if (
        !p.launchBonus ||
        typeof p.launchBonus !== "object" ||
        Array.isArray(p.launchBonus)
      )
        throw Error("Invalid launch bonus.");
      const target = c.parts.find((q) => q.id === p.launchBonus.target);
      if (
        p.kind !== "spring" ||
        !p.launch ||
        !target ||
        target.kind !== "floor" ||
        target.motion ||
        !Number.isInteger(p.launchBonus.score) ||
        p.launchBonus.score <= 0 ||
        p.launchBonus.score > 20000
      )
        throw Error(
          "A launch bonus needs an impulse launcher, a static floor target and a positive score.",
        );
    }
    if (p.kind === "ribbon" || p.kind === "tube") {
      if (
        p.motion ||
        !Array.isArray(p.path) ||
        p.path.length < 2 ||
        p.path.length > 500
      )
        throw Error("A static ribbon needs 2–500 path points.");
      for (const v of p.path)
        if (
          ![
            v.x,
            v.y,
            v.z,
            v.width ?? p.width ?? 4,
            v.bank ?? p.bank ?? 0,
          ].every(finite) ||
          (v.width ?? p.width ?? 4) < 1 ||
          (v.width ?? p.width ?? 4) > 30
        )
          throw Error("Invalid ribbon cross-section.");
      estimatedVertices += p.path
        .slice(1)
        .reduce(
          (sum, v, i) =>
            sum +
            Math.ceil(
              Math.hypot(
                v.x - p.path[i].x,
                p.kind === "tube" ? v.y - p.path[i].y : 0,
                v.z - p.path[i].z,
              ) * (p.kind === "tube" ? 10 : 2),
            ) *
              (p.kind === "tube" ? 52 : 20),
          0,
        );
    }
    if (
      p.kind === "tube" &&
      (![p.radius ?? 1.4, p.thickness ?? 0.15].every(finite) ||
        (p.radius ?? 1.4) < 0.6 ||
        (p.radius ?? 1.4) > 8 ||
        (p.thickness ?? 0.15) < 0.05 ||
        (p.thickness ?? 0.15) > 2)
    )
      throw Error("Invalid tube dimensions.");
    if (
      p.flare !== undefined &&
      (p.kind !== "tube" ||
        !p.flare ||
        ![p.flare.throat, p.flare.length].every(finite) ||
        p.flare.throat < 0.6 ||
        p.flare.throat > (p.radius ?? 1.4) ||
        p.flare.length < 0.5 ||
        p.flare.length > 10)
    )
      throw Error("Invalid tube flare.");
    if (p.fork !== undefined) {
      const f = p.fork;
      if (
        p.kind !== "tube" ||
        !p.flowSpeed ||
        !f ||
        !Number.isInteger(f.at) ||
        f.at < 1 ||
        f.at >= p.path.length - 1 ||
        !Array.isArray(f.path) ||
        f.path.length < 2 ||
        f.path.length > 100 ||
        !f.path.every((v) => v && [v.x, v.y, v.z].every(finite)) ||
        !["x", "y", "z"].every((k) => f.path[0][k] === p.path[f.at][k]) ||
        (f.exitRoutes !== undefined &&
          (!Array.isArray(f.exitRoutes) ||
            f.exitRoutes.length !== 2 ||
            !f.exitRoutes.every((id) =>
              c.alternateRoutes?.some((r) => r.id === id),
            )))
      )
        throw Error("Invalid tube fork.");
      const legs = [
        p.path.slice(0, f.at + 1).reverse(),
        p.path.slice(f.at),
        f.path,
      ];
      const directions = legs.map((leg) => {
        const d = ["x", "y", "z"].map((k) => leg[1][k] - leg[0][k]);
        const length = Math.hypot(...d);
        if (length < (p.flare?.throat ?? p.radius ?? 1.4) * 3)
          throw Error("Tube fork legs are too short.");
        return d.map((v) => v / length);
      });
      for (let i = 0; i < 3; i++)
        for (let j = i + 1; j < 3; j++)
          if (
            directions[i].reduce((n, v, k) => n + v * directions[j][k], 0) > 0.5
          )
            throw Error("Tube fork ports are too close.");
      estimatedVertices +=
        f.path
          .slice(1)
          .reduce(
            (n, v, i) =>
              n +
              Math.ceil(
                Math.hypot(
                  v.x - f.path[i].x,
                  v.y - f.path[i].y,
                  v.z - f.path[i].z,
                ) * 10,
              ) *
                52,
            0,
          ) + 500;
    }
    if (
      p.flowExitSpeed !== undefined &&
      (!p.flowSpeed ||
        !finite(p.flowExitSpeed) ||
        p.flowExitSpeed <= 0 ||
        p.flowExitSpeed > p.flowSpeed)
    )
      throw Error("Invalid transfer outlet speed.");
    if (
      p.flowSpeed !== undefined &&
      (p.kind !== "tube" ||
        p.motion ||
        !finite(p.flowSpeed) ||
        p.flowSpeed <= 0 ||
        p.flowSpeed > 8)
    )
      throw Error("Invalid powered transfer.");
    if (
      p.traversalBonus !== undefined &&
      (p.kind !== "tube" ||
        p.motion ||
        !Number.isInteger(p.traversalBonus) ||
        p.traversalBonus <= 0 ||
        p.traversalBonus > 20000)
    )
      throw Error("Invalid traversal bonus.");
    if (p.kind === "polygon") {
      if (
        p.motion ||
        !Array.isArray(p.outline) ||
        p.outline.length < 3 ||
        p.outline.length > 500 ||
        !p.outline.every((v) => [v.x, v.z].every(finite))
      )
        throw Error("Invalid polygon outline.");
    }
    if (p.kind === "terrain") {
      validateTerrain(p, finite);
      estimatedVertices += p.cells.length * 36;
    } else if (p.kind === "polygon") estimatedVertices += p.outline.length * 3;
    else if (p.kind === "pyramid") estimatedVertices += 9;
    else if (!["ribbon", "tube"].includes(p.kind))
      estimatedVertices += (Math.ceil(p.w * 2) + 1) * (Math.ceil(p.d * 2) + 1);
    validateAnimatedTerrain(p, finite);
    if (p.animation?.type === "terrain-sequence")
      estimatedVertices += p.animation.frames.reduce(
        (n, cells) => n + cells.length * 36,
        0,
      );
    if (estimatedVertices > 150000)
      throw Error(
        "Course geometry exceeds the 150,000-vertex authoring limit.",
      );
    if (
      p.profile !== undefined &&
      (!["peg", "flipper", "vacuum-mouth", "hammer"].includes(p.profile) ||
        (p.profile === "hammer" &&
          (p.kind !== "piston" ||
            p.motion?.axis !== "hammer" ||
            !finite(p.h) ||
            p.h < 0.12)) ||
        (p.profile === "peg" &&
          (p.kind !== "piston" || !finite(p.h) || p.h < 0.12)) ||
        (p.profile === "flipper" &&
          (p.kind !== "spring" ||
            !["launch", "native-paddle"].includes(p.motion?.axis) ||
            p.d < p.w)) ||
        (p.profile === "vacuum-mouth" &&
          (p.kind !== "piston" || !finite(p.h) || p.h < 1.1 || p.d < 1.1)))
    )
      throw Error("Invalid mechanism profile.");
    if (
      p.motion?.delay !== undefined &&
      (!finite(p.motion.delay) || p.motion.delay < 0 || p.motion.delay > 5)
    )
      throw Error("Invalid mechanism delay.");
    if (
      p.motion?.cycle !== undefined &&
      (p.motion.cycle !== "retract" || p.motion.axis !== "y")
    )
      throw Error("Invalid machine cycle.");
    if (p.motion?.grid !== undefined) {
      const g = p.motion.grid;
      if (
        !g ||
        p.profile !== "peg" ||
        p.motion.cycle !== "retract" ||
        p.motion.period < 0.76 ||
        ![g.rows, g.columns, g.row, g.column, g.seed].every(
          Number.isSafeInteger,
        ) ||
        g.rows < 1 ||
        g.rows > 16 ||
        g.columns < 1 ||
        g.columns > 16 ||
        g.row < 0 ||
        g.row >= g.rows ||
        g.column < 0 ||
        g.column >= g.columns ||
        g.seed < 0 ||
        g.seed > 0x7fffffff
      )
        throw Error("Invalid peg bed.");
    }
    if (
      p.motion &&
      (![
        "x",
        "y",
        "z",
        "tilt",
        "wave",
        "launch",
        "hammer",
        "native-vacuum",
        "native-paddle",
        "native-peg",
      ].includes(p.motion.axis) ||
        (p.motion.axis === "hammer" && p.profile !== "hammer") ||
        (p.motion.axis === "native-peg" && p.profile !== "peg") ||
        (p.motion.axis === "native-paddle" && p.profile !== "flipper") ||
        (p.motion.axis === "native-vacuum" &&
          (p.profile !== "vacuum-mouth" || p.presence)) ||
        ![p.motion.amplitude, p.motion.period, p.motion.phase ?? 0].every(
          finite,
        ) ||
        p.motion.period < 0.5)
    )
      throw Error("Invalid motion.");
    if (
      p.motion?.axis === "wave" &&
      (![
        p.motion.heading,
        p.motion.wavelength,
        p.motion.total,
        p.motion.from,
        p.motion.to,
        p.motion.rise ?? 0,
      ].every(finite) ||
        p.motion.wavelength < 1 ||
        p.motion.total < 0.1 ||
        p.motion.from < 0 ||
        p.motion.to <= p.motion.from ||
        p.motion.to > p.motion.total + 0.001 ||
        p.angle ||
        p.bank ||
        p.bevel)
    )
      throw Error("Invalid wave panel.");
    if (
      p.motion?.strip !== undefined &&
      (p.motion.axis !== "wave" ||
        typeof p.motion.strip !== "string" ||
        !p.motion.strip.trim() ||
        p.motion.strip.length > 100)
    )
      throw Error("Invalid wave strip identifier.");

    if (p.motion?.axis === "wave" && p.motion.profile !== undefined) {
      const m = p.motion;
      if (
        m.profile !== "crest" ||
        ![m.crestWidth, m.crestPeak, m.anchorLength].every(finite) ||
        m.amplitude < 0 ||
        m.crestWidth <= 0 ||
        m.crestWidth >= m.wavelength ||
        m.crestPeak <= 0 ||
        m.crestPeak >= 1 ||
        m.anchorLength <= 0 ||
        m.anchorLength > m.total / 2
      )
        throw Error("Invalid wave crest.");
    }

    if (
      p.presence?.transition !== undefined &&
      (p.profile !== "vacuum-mouth" ||
        p.motion?.axis !== "y" ||
        p.motion.amplitude !== 0 ||
        !finite(p.presence.transition) ||
        p.presence.transition <= 0 ||
        p.presence.transition * 2 > p.presence.on)
    )
      throw Error("Invalid vacuum deployment duration.");
    if (
      p.presence &&
      (!p.motion ||
        ![p.presence.period, p.presence.on, p.presence.phase ?? 0].every(
          finite,
        ) ||
        p.presence.period < 0.5 ||
        p.presence.on <= 0 ||
        p.presence.on > p.presence.period)
    )
      throw Error("Invalid disappearing-platform cycle.");
  }
  for (const a of [
    ...(c.starts ?? []),
    c.goal,
    ...(c.checkpoints ?? []),
    ...(c.route ?? []),
    ...(c.playerRoutes ?? []).flat(),
    ...(c.alternateRoutes ?? []).flatMap((r) => r.route ?? []),
  ]) {
    if (!a || ![a.x, a.y, a.z].every(finite))
      throw Error("Invalid start, route, checkpoint or goal.");
    if (
      a.waitForPegBed !== undefined &&
      (typeof a.waitForPegBed !== "string" ||
        !a.waitForPegBed.length ||
        !a.stop ||
        !c.parts.some(
          (p) => p.motion?.grid && p.id.startsWith(a.waitForPegBed),
        ))
    )
      throw Error("Peg wait must stop before a known bed.");
    if (
      a.collect !== undefined &&
      !c.enemies?.some((e) => e.id === a.collect && e.kind === "mini")
    )
      throw Error("Collection waypoint must reference a miniature enemy.");
  }
  if (
    !c.starts?.length ||
    c.starts.length > 2 ||
    !c.goal ||
    !finite(c.time) ||
    c.time < 1
  )
    throw Error("One or two starts, a goal and positive time are required.");
  if ((c.zones?.length ?? 0) > 100 || (c.route?.length ?? 0) > 1000)
    throw Error("Course exceeds limits.");
  if (
    c.rules &&
    (![c.rules.timerRate ?? 1, c.rules.finishPointRate ?? 10].every(finite) ||
      (c.rules.timerRate ?? 1) <= 0 ||
      (c.rules.timerRate ?? 1) > 4 ||
      (c.rules.finishPointRate ?? 10) < 0 ||
      (c.rules.finishPointRate ?? 10) > 1000 ||
      !Number.isInteger(c.rules.finishBonus ?? 0) ||
      (c.rules.finishBonus ?? 0) < 0 ||
      (c.rules.finishBonus ?? 0) > 20000 ||
      ![undefined, "last-safe", "start"].includes(c.rules.respawn) ||
      ![undefined, false, true].includes(c.rules.landingStun))
  )
    throw Error("Invalid course rules.");
  const targetIds = new Set();
  for (const mark of c.markings ?? []) {
    if (mark.kind !== "landing-target") continue;
    const floor = c.parts.find((p) => p.id === mark.part);
    if (
      typeof mark.id !== "string" ||
      targetIds.has(mark.id) ||
      (mark.claimGroup !== undefined &&
        (typeof mark.claimGroup !== "string" ||
          !mark.claimGroup.trim() ||
          mark.claimGroup.length > 64)) ||
      (mark.scoreBands !== undefined &&
        (!Array.isArray(mark.scoreBands) ||
          mark.scoreBands.length < 1 ||
          mark.scoreBands.length > 32 ||
          mark.scoreBands.some(
            (value) => !Number.isInteger(value) || value < 1 || value > 20000,
          ))) ||
      !floor ||
      floor.kind !== "floor" ||
      floor.motion ||
      floor.presence ||
      floor.w < 1.2 ||
      floor.d < 1.2 ||
      !Array.isArray(mark.values) ||
      mark.values.length !== 4 ||
      mark.values.some((v) => !finite(v) || v < 1 || v > 20)
    )
      throw Error("Invalid landing target.");
    const width = mark.width ?? floor.w - 0.6,
      depth = mark.depth ?? floor.d - 0.6;
    const ox = mark.offset?.x ?? 0,
      oz = mark.offset?.z ?? 0;
    if (
      ![width, depth, ox, oz].every(finite) ||
      width < 0.5 ||
      depth < 0.5 ||
      Math.abs(ox) + width / 2 > floor.w / 2 - 0.29 ||
      Math.abs(oz) + depth / 2 > floor.d / 2 - 0.29
    )
      throw Error("Landing target must fit its floor.");
    targetIds.add(mark.id);
  }
  for (const z of c.zones ?? [])
    if (
      !["magnet", "hazard", "acid", "vacuum"].includes(z.kind) ||
      ![z.x, z.y, z.z, z.radius, z.strength ?? 0].every(finite) ||
      z.radius <= 0
    )
      throw Error("Invalid zone.");
  for (const z of c.zones ?? [])
    if (
      z.motion &&
      (!["x", "z"].includes(z.motion.axis) ||
        ![z.motion.amplitude, z.motion.period, z.motion.phase ?? 0].every(
          finite,
        ) ||
        z.motion.period < 0.5 ||
        Math.abs(z.motion.amplitude) > 10)
    )
      throw Error("Invalid moving hazard.");
  for (const z of c.zones ?? [])
    if (
      z.presence &&
      (![z.presence.period, z.presence.on, z.presence.phase ?? 0].every(
        finite,
      ) ||
        z.presence.period < 0.5 ||
        z.presence.on <= 0 ||
        z.presence.on > z.presence.period ||
        (z.presence.transition !== undefined &&
          (!finite(z.presence.transition) ||
            z.presence.transition <= 0 ||
            z.presence.transition * 2 > z.presence.on)))
    )
      throw Error("Invalid hazard presence cycle.");
  for (const z of c.zones ?? [])
    if (
      z.mouth !== undefined &&
      (z.kind !== "vacuum" ||
        typeof z.mouth !== "string" ||
        !c.parts.some(
          (p) =>
            p.id === z.mouth &&
            p.profile === "vacuum-mouth" &&
            ["y", "native-vacuum"].includes(p.motion?.axis) &&
            p.motion.amplitude === 0,
        ))
    )
      throw Error("Vacuum must reference a valid mouth.");
  for (const z of c.zones ?? [])
    if (
      z.intakeHeight !== undefined &&
      (z.kind !== "vacuum" ||
        !z.mouth ||
        !finite(z.intakeHeight) ||
        z.intakeHeight <= 0 ||
        z.intakeHeight >= (c.parts.find((p) => p.id === z.mouth)?.h ?? 0))
    )
      throw Error("Invalid vacuum intake height.");
  for (const z of c.zones ?? [])
    if (
      z.kind === "vacuum" &&
      (!z.direction ||
        ![z.direction.x, z.direction.y, z.direction.z].every(finite))
    )
      throw Error("Invalid vacuum direction.");
  for (const z of c.zones ?? []) {
    if (
      z.wobblePhase !== undefined &&
      (z.kind !== "acid" || !finite(z.wobblePhase))
    )
      throw Error("Invalid acid deformation phase.");
    if (!z.patrol) continue;
    const { points, speed, phase = 0 } = z.patrol;
    if (
      z.kind !== "acid" ||
      z.motion ||
      !finite(speed) ||
      speed <= 0 ||
      speed > 8 ||
      !finite(phase) ||
      !Array.isArray(points) ||
      points.length < 2 ||
      points.length > 64 ||
      points.some((p) => ![p.x, p.z].every(finite))
    )
      throw Error("Invalid acid patrol.");
    if (
      points.some(
        (p, i) =>
          Math.hypot(
            p.x - points[(i + 1) % points.length].x,
            p.z - points[(i + 1) % points.length].z,
          ) < 0.01,
      )
    )
      throw Error("Acid patrol legs must have positive length.");
  }
  if ((c.enemies?.length ?? 0) > 40) throw Error("Too many enemies.");
  const enemyIds = new Set();
  for (const e of c.enemies ?? []) {
    if (
      typeof e.id !== "string" ||
      enemyIds.has(e.id) ||
      !["steelie", "muncher", "mini", "bird"].includes(e.kind) ||
      ![e.x, e.y, e.z, e.radius, e.roam, e.speed].every(finite) ||
      e.radius < 0.2 ||
      e.radius > 2 ||
      e.roam < 0.5 ||
      e.roam > 30 ||
      e.speed <= 0 ||
      e.speed > 8
    )
      throw Error("Invalid enemy.");
    if (
      e.form !== undefined &&
      (e.kind !== "mini" || !["steelie", "muncher", "acid"].includes(e.form))
    )
      throw Error("Invalid miniature form.");
    if (e.phase !== undefined && !finite(e.phase))
      throw Error("Invalid enemy animation phase.");
    enemyIds.add(e.id);
    if (
      e.kind === "bird" &&
      (!e.direction ||
        ![
          e.direction.x,
          e.direction.z,
          e.distance,
          e.rest ?? 1,
          e.phase ?? 0,
        ].every(finite) ||
        e.distance <= 0 ||
        (e.rest ?? 1) < 0 ||
        Math.abs(Math.hypot(e.direction.x, e.direction.z) - 1) > 0.01)
    )
      throw Error("Invalid bird flight.");
  }
  validateTerrainNavigation(c);
  validateNativeCamera(c, finite);
  validateNativeDynamics(c, finite);
  validateAerialVacuums(c, finite);
  validateAerialPaddle(c, finite);
  validateAerialPegs(c, finite);
  validateNativeFlags(c, finite);
  validateNativeSteelies(c);
  validateNativeSlinkies(c);
  validateAerialHammers(c, finite);
  return c;
}
export const part = (id, x, z, w, d, y = 0, extra = {}) => ({
  id,
  kind: "floor",
  x,
  y,
  z,
  w,
  d,
  h: 0.8,
  material: "stone",
  ...extra,
});
export const point = (x, y, z) => ({ x, y, z });

// Generate top, side, underside and optional bevel triangles once. Rendering uses
// these exact arrays; Rapier uses the same arrays with internal-edge correction.
export function partGeometry(p) {
  if (p.motion?.axis === "terrain")
    return {
      vertices: terrainTrianglePose(p).vertices,
      indices:
        p.terrainTriangle.length === 4
          ? TERRAIN_QUAD_INDICES
          : TERRAIN_TRIANGLE_INDICES,
      roles:
        p.terrainTriangle.length === 4
          ? TERRAIN_QUAD_ROLES
          : TERRAIN_TRIANGLE_ROLES,
    };
  if (p.profile === "peg") return pegGeometry(p);
  if (p.profile === "hammer") return hammerGeometry(p);
  if (p.profile === "flipper") return flipperGeometry(p);
  if (p.profile === "vacuum-mouth") return vacuumGeometry(p);
  if (p.motion?.axis === "wave")
    return {
      vertices: wavePose(p, 0).vertices,
      indices: WAVE_INDICES,
      roles: WAVE_ROLES,
    };
  if (p.kind === "tube") return tubeGeometry(p);
  if (p.kind === "ribbon") return ribbonGeometry(p);
  if (p.kind === "polygon") return polygonGeometry(p);
  if (p.kind === "pyramid") return pyramidGeometry(p);
  if (p.kind === "terrain") return terrainGeometry(p);
  const vertices = [],
    indices = [],
    roles = [],
    keys = new Map();
  const ang = p.angle ?? 0,
    cs = Math.cos(ang),
    sn = Math.sin(ang);
  const put = ([x, y, z]) => {
    if (
      (!p.motion && ["floor", "ramp", "channel"].includes(p.kind)) ||
      (p.kind === "moving" &&
        p.presence &&
        p.motion?.axis === "y" &&
        p.motion.amplitude === 0)
    ) {
      const radius = Math.min(0.55, p.w * 0.18, p.d * 0.18),
        cx = p.w / 2 - radius,
        cz = p.d / 2 - radius,
        dx = Math.max(0, Math.abs(x) - cx),
        dz = Math.max(0, Math.abs(z) - cz),
        distance = Math.hypot(dx, dz);
      if (dx > 0 && dz > 0 && distance > radius) {
        x = Math.sign(x) * (cx + (dx * radius) / distance);
        z = Math.sign(z) * (cz + (dz * radius) / distance);
      }
    }
    const v = [x * cs - z * sn, y, x * sn + z * cs];
    const key = v.map((n) => n.toFixed(7)).join(",");
    if (keys.has(key)) return keys.get(key);
    const i = vertices.length / 3;
    vertices.push(...v);
    keys.set(key, i);
    return i;
  };
  const tri = (a, b, c, role) => {
    indices.push(put(a), put(b), put(c));
    roles.push(role);
  };
  const quad = (a, b, c, d, role) => {
    tri(a, b, c, role);
    tri(a, c, d, role);
  };
  const w = p.w / 2,
    d = p.d / 2,
    b = p.bevel ?? 0,
    bottom = Math.min(0, p.rise ?? 0, p.bank ?? 0) - (p.h ?? 0.8);
  const nx = Math.max(1, Math.ceil(p.w * 2)),
    nz = Math.max(1, Math.ceil(p.d * 2));
  const height = (x, z) =>
    (p.rise ?? 0) * (z / p.d + 0.5) + (p.bank ?? 0) * Math.pow(x / w, 2);
  const grid = (x, z) => [
    -w + b + ((p.w - 2 * b) * x) / nx,
    height(
      -w + b + ((p.w - 2 * b) * x) / nx,
      -d + b + ((p.d - 2 * b) * z) / nz,
    ),
    -d + b + ((p.d - 2 * b) * z) / nz,
  ];
  for (let z = 0; z < nz; z++)
    for (let x = 0; x < nx; x++)
      quad(
        grid(x, z),
        grid(x, z + 1),
        grid(x + 1, z + 1),
        grid(x + 1, z),
        "top",
      );
  const boundary = [];
  for (let i = 0; i <= nx; i++) boundary.push(grid(i, 0));
  for (let i = 1; i <= nz; i++) boundary.push(grid(nx, i));
  for (let i = nx - 1; i >= 0; i--) boundary.push(grid(i, nz));
  for (let i = nz - 1; i > 0; i--) boundary.push(grid(0, i));
  const outside = boundary.map(([x, y, z]) => [
    Math.abs(x - (w - b)) < 1e-6 ? w : Math.abs(x + w - b) < 1e-6 ? -w : x,
    y - b,
    Math.abs(z - (d - b)) < 1e-6 ? d : Math.abs(z + d - b) < 1e-6 ? -d : z,
  ]);
  for (let i = 0; i < boundary.length; i++) {
    const j = (i + 1) % boundary.length,
      a = boundary[i],
      bb = boundary[j],
      aa = outside[i],
      ab = outside[j];
    if (b) quad(a, bb, ab, aa, "top");
    quad(aa, ab, [ab[0], bottom, ab[2]], [aa[0], bottom, aa[2]], "side");
  }
  quad(
    [-w, bottom, -d],
    [w, bottom, -d],
    [w, bottom, d],
    [-w, bottom, d],
    "side",
  );
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint32Array(indices),
    roles,
  };
}
export function compileCourse(c) {
  validateCourse(c);
  const staticGroups = new Map(),
    moving = [];
  const sequenceParts = c.parts.filter(
    (p) => p.animation?.type === "terrain-sequence",
  );
  const parts = joinedBoardParts(
    expandAnimatedTerrain(
      c.parts.filter((p) => p.animation?.type !== "terrain-sequence"),
    ),
  );
  for (const p of sequenceParts) moving.push(compileTerrainSequence(p));
  for (const p of parts) {
    const geom = partGeometry(p);
    if (p.motion) {
      if (p.bank || p.bevel)
        throw Error("Moving parts must be convex flat or ramp solids.");
      moving.push({ part: p, ...geom });
      continue;
    }
    const material = p.material ?? "stone";
    if (!staticGroups.has(material))
      staticGroups.set(material, {
        material,
        vertices: [],
        indices: [],
        roles: [],
        keys: new Map(),
        faces: new Map(),
      });
    const group = staticGroups.get(material),
      remap = [];
    for (let i = 0; i < geom.vertices.length; i += 3) {
      const v = [
          geom.vertices[i] + p.x,
          geom.vertices[i + 1] + p.y,
          geom.vertices[i + 2] + p.z,
        ],
        key = v.map((n) => n.toFixed(6)).join(",");
      if (!group.keys.has(key)) {
        group.keys.set(key, group.vertices.length / 3);
        group.vertices.push(...v);
      }
      remap.push(group.keys.get(key));
    }
    for (let i = 0; i < geom.indices.length; i += 3) {
      const t = [
          remap[geom.indices[i]],
          remap[geom.indices[i + 1]],
          remap[geom.indices[i + 2]],
        ],
        key = [...t].sort((a, b) => a - b).join(",");
      if (group.faces.has(key)) {
        const previous = group.faces.get(key).t;
        const sameFacing = previous.some(
          (_, j) =>
            previous[j] === t[0] &&
            previous[(j + 1) % 3] === t[1] &&
            previous[(j + 2) % 3] === t[2],
        );
        if (!sameFacing) group.faces.delete(key);
      } else
        group.faces.set(key, {
          t,
          role: geom.roles[i / 3],
          preserveTopology: p.kind === "terrain",
        });
    }
  }
  const statics = [...staticGroups.values()].map((g) => {
    for (const f of mergeLevelTops(g)) {
      g.indices.push(...f.t);
      g.roles.push(f.role);
    }
    return {
      material: g.material,
      vertices: new Float32Array(g.vertices),
      indices: new Uint32Array(g.indices),
      roles: g.roles,
    };
  });
  return {
    definition: c,
    parts: [...parts, ...sequenceParts],
    statics,
    moving,
  };
}
export function motionAt(p, time, terrainRows, previous) {
  if (p.motion?.axis === "native-peg") return terrainRows ?? pegPose(p);
  if (p.motion?.axis === "native-paddle")
    return terrainRows ?? paddlePose(p, null);
  if (p.motion?.axis === "native-vacuum")
    return terrainRows ?? nativeVacuumPose(p, null);
  if (p.motion?.axis === "hammer") return hammerPose(p, terrainRows);
  if (p.motion?.axis === "terrain-sequence")
    return {
      position: { x: p.x, y: p.y, z: p.z },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      frame: terrainRows?.frame ?? 0,
    };
  if (p.motion?.axis === "terrain")
    return terrainTrianglePose(p, terrainRows, previous);
  if (p.profile === "vacuum-mouth" && p.presence?.transition)
    return vacuumPoseAt(p, time);
  if (p.motion?.axis === "launch") {
    // The arm hinges at its rear edge. Geometry is already course-rotated.
    const phase = Math.max(0, Math.min(1, time / p.motion.period));
    const pitch =
      -(p.profile === "flipper"
        ? flipperLift(time, p.motion)
        : Math.sin(Math.PI * phase)) * p.motion.amplitude;
    const a = p.angle ?? 0,
      sn = Math.sin(a),
      cs = Math.cos(a);
    const along = (p.d / 2) * (Math.cos(pitch) - 1);
    return {
      position: {
        x: p.x - along * sn,
        y: p.y - (p.d / 2) * Math.sin(pitch),
        z: p.z + along * cs,
      },
      rotation: {
        x: cs * Math.sin(pitch / 2),
        y: 0,
        z: sn * Math.sin(pitch / 2),
        w: Math.cos(pitch / 2),
      },
    };
  }
  if (p.motion?.axis === "wave") return wavePose(p, time);
  const m = p.motion,
    phase = (time * 2 * Math.PI) / m.period + (m.phase ?? 0),
    s =
      (m.cycle === "retract" ? extensionAt(time, m) : Math.sin(phase)) *
      m.amplitude;
  const position = { x: p.x, y: p.y, z: p.z },
    rotation = { x: 0, y: 0, z: 0, w: 1 };
  if (m.axis === "tilt") {
    rotation.z = Math.sin(s / 2);
    rotation.w = Math.cos(s / 2);
  } else position[m.axis] += s;
  return { position, rotation };
}

export function proofCourse() {
  return {
    schema: 1,
    id: "physics-proof",
    revision: 1,
    name: "The Rolling Laboratory",
    subtitle: "A small world. Real momentum.",
    category: "proof",
    color: "#d35b45",
    time: 180,
    starts: [point(-1, 4.56, 0), point(1, 4.56, 0)],
    goal: point(0, 0, 52),
    checkpoints: [point(0, 4.56, 7), point(0, 2.56, 20), point(0, 0.56, 40)],
    route: [
      point(0, 4, 7),
      point(0, 4, 10),
      point(0, 2, 18),
      point(0, 2, 26),
      point(0, 2, 32),
      point(0, 0, 38),
      point(0, 0, 44),
      point(0, 0, 52),
    ],
    parts: [
      part("start", 0, 2, 10, 12, 4, { bevel: 0 }),
      part("seam", 0, 9, 6, 2, 4),
      part("slope", 0, 14, 6, 8, 4, { kind: "ramp", rise: -2 }),
      part("channel", 0, 23, 6, 10, 2, { kind: "channel", bank: 1.4 }),
      part("lip", 0, 30, 6, 4, 2),
      part("landing", 0, 37, 10, 10, 0),
      part("bridge", 0, 44, 4, 4, 0, {
        kind: "moving",
        material: "brass",
        h: 0.65,
        motion: { axis: "y", amplitude: 0.55, period: 6 },
      }),
      part("finish", 0, 51, 10, 10, 0, { bevel: 0.06 }),
      part("left-wall", -5.25, 1, 0.5, 12, 6, { kind: "wall", h: 2.8 }),
      part("right-wall", 5.25, 1, 0.5, 12, 6, { kind: "wall", h: 2.8 }),
      part("back-wall", 0, -4.25, 10, 0.5, 6, { kind: "wall", h: 2.8 }),
    ],
    zones: [],
  };
}
