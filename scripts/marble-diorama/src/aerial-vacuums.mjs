import {
  AERIAL_VACUUMS,
  createAerialVacuumSequence,
  stepAerialVacuumSequence,
  aerialVacuumDeployment,
  aerialVacuumInteraction,
} from "./aerial-vacuum-sequence.mjs";
import { entersCameraBand, leavesCameraBand } from "./native-camera.mjs";

export function validateAerialVacuums(course, finite) {
  const c = course.vacuumSequence;
  const mouths = course.parts.filter((p) => p.motion?.axis === "native-vacuum");
  if (!c) {
    if (mouths.length) throw Error("Native vacuums need a shared sequence.");
    return;
  }
  if (
    !course.nativeCamera ||
    !course.navigation ||
    !Array.isArray(c.parts) ||
    c.parts.length !== 6 ||
    new Set(c.parts).size !== 6 ||
    mouths.length !== 6 ||
    c.parts.some((id) => !mouths.some((p) => p.id === id)) ||
    !finite(c.rate) ||
    c.rate < 1 ||
    c.rate > 120 ||
    !Array.isArray(c.activationBand) ||
    c.activationBand.length !== 2 ||
    !c.activationBand.every(
      (n) => Number.isInteger(n) && n >= -128 && n <= 127,
    ) ||
    c.activationBand[0] > c.activationBand[1]
  )
    throw Error("Invalid native vacuum sequence.");
  for (const id of c.parts) {
    const zones = (course.zones ?? []).filter(
      (z) => z.kind === "vacuum" && z.mouth === id,
    );
    if (zones.length !== 1 || zones[0].presence)
      throw Error("Each native vacuum needs one linked zone without a timer.");
  }
}

export function createAerialVacuums(course) {
  if (!course.vacuumSequence) return null;
  return {
    sequence: createAerialVacuumSequence(),
    regions: [],
    pendingLoad: false,
    pendingUnload: false,
    pendingRegions: [],
    retirements: [],
    steps: 0,
  };
}

export function advanceAerialVacuums(course, state, players, time, camera) {
  if (!state) return;
  const c = course.vacuumSequence;
  state.steps = 0;
  for (const t of camera?.transitions ?? []) {
    if (entersCameraBand(t, c.activationBand)) {
      state.pendingLoad = true;
      state.pendingUnload = false;
    }
    if (leavesCameraBand(t, c.activationBand)) {
      state.pendingUnload = true;
      state.pendingLoad = false;
    }
  }
  players.forEach((p, i) => {
    if (p.active && p.region !== state.regions[i])
      state.pendingRegions.push(p.region);
    state.regions[i] = p.region;
  });
  const target = Math.floor(time * c.rate + 1e-9);
  while (state.sequence.tick < target) {
    const next = state.sequence.tick + 1;
    const retire = state.retirements
      .filter((r) => r.tick <= next)
      .map((r) => r.actor);
    state.retirements = state.retirements.filter((r) => r.tick > next);
    stepAerialVacuumSequence(state.sequence, {
      load: state.pendingLoad,
      unload: state.pendingUnload,
      enteredRegions: state.pendingRegions,
      players,
      retire,
    });
    state.pendingLoad = state.pendingUnload = false;
    state.pendingRegions = [];
    state.steps++;
  }
}

export function nativeVacuumPose(part, actor) {
  const deployment = aerialVacuumDeployment(actor);
  return {
    position: { x: part.x, y: part.y - part.h * (1 - deployment), z: part.z },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    visible: deployment > 0,
    deployment,
    suction: actor?.phase === "hold",
    image: actor?.drawnImage ?? null,
  };
}

export function aerialVacuumPoses(course, state) {
  if (!state) return {};
  return Object.fromEntries(
    course.vacuumSequence.parts.map((id, i) => [
      id,
      {
        ...nativeVacuumPose(
          course.parts.find((p) => p.id === id),
          state.sequence.actors[i],
        ),
        intakeOffset: course.nativeCamera.heightScale * 8,
      },
    ]),
  );
}

// Recover source-relative coordinates through the actual housing transform.
// Moving/rotating a workshop mouth therefore moves both its field and artwork.
function frameFor(course, index) {
  const a = AERIAL_VACUUMS[index],
    c = course.vacuumSequence;
  const mouth = course.parts.find((p) => p.id === c.parts[index]);
  const unit = course.nativeCamera.heightScale;
  const rotation =
    (mouth.angle ?? 0) - (a.type === 11 ? -Math.PI / 2 : Math.PI);
  const cs = Math.cos(rotation),
    sn = Math.sin(rotation);
  return { a, mouth, unit, cs, sn };
}

export function nativeVacuumSourcePosition(course, index, position, radius) {
  const { a, mouth, unit, cs, sn } = frameFor(course, index);
  const x = position.x - mouth.x,
    z = position.z - mouth.z;
  const coordinate = (v) =>
    Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v;
  return {
    x: coordinate(a.x + (a.type === 11 ? -8 : 4) + (x * cs + z * sn) / unit),
    z: coordinate(a.z + (a.type === 11 ? 4 : -8) + (-x * sn + z * cs) / unit),
    height: coordinate(a.height + (position.y - radius - mouth.y) / unit),
  };
}

export function nativeVacuumEffect(
  course,
  state,
  index,
  previous,
  current,
  radius,
) {
  const actor = state?.sequence.actors[index];
  const { mouth, unit, cs, sn, a } = frameFor(course, index);
  const effect = aerialVacuumInteraction(
    actor,
    nativeVacuumSourcePosition(course, index, previous, radius),
    nativeVacuumSourcePosition(course, index, current, radius),
  );
  if (!effect) return null;
  if (effect.kind === "pull") {
    const scale = unit * course.vacuumSequence.rate;
    return {
      kind: "pull",
      x: (effect.x * cs - effect.z * sn) * scale,
      z: (effect.x * sn + effect.z * cs) * scale,
    };
  }
  const ix = a.type === 11 ? 0 : 8,
    iz = a.type === 11 ? 8 : 0;
  return {
    ...effect,
    intake: {
      x: mouth.x + (ix * cs - iz * sn) * unit,
      y: mouth.y + radius,
      z: mouth.z + (ix * sn + iz * cs) * unit,
    },
  };
}

export function scheduleVacuumRetirement(state, index) {
  // Player animation state 10 counts 32 original updates before switching to
  // ordinary reform and redirecting this mouth into its remove-after-withdraw script.
  state.retirements.push({ actor: index, tick: state.sequence.tick + 32 });
}
