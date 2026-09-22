import { slinkyCoordinates } from "./native-slinky-physics.mjs";
import { nativeSteelieTerrainHeight } from "./native-steelie-physics.mjs";

export const PRACTICE_LANDING_GROUP = "practice-landing-bonus";
export const PRACTICE_LANDING_AMOUNTS = Object.freeze([
  3000, 3500, 4000, 4500, 5000, 5500, 6000,
]);
const origins = { 1: 488, 2: 568, 3: 528 };

// The original landing branch consumes the shared claim even below the first
// paying band. Inputs are original coordinates, not normalized paint UVs.
export function nativePracticeLandingIntent({
  course = 0,
  region,
  x,
  z,
  claimed = false,
}) {
  if (course !== 0 || !origins[region] || claimed) return null;
  const word = (v) => (Math.floor(v) << 16) >> 16;
  const offset = word(word(region === 3 ? x : z) - origins[region]);
  const index = offset < 0 ? null : Math.min(6, offset >> 2);
  return {
    region,
    score: index === null ? 0 : PRACTICE_LANDING_AMOUNTS[index],
    sound: 42,
  };
}

export function validateNativePracticeLandings(course) {
  if (course?.nativePracticeLandings === undefined) return;
  if (
    course.nativePracticeLandings !== true ||
    !course.nativeCamera ||
    course.nativeCamera.partId !== course.navigation?.partId
  )
    throw Error(
      "Native Practice landings require shared terrain navigation and coordinates.",
    );
}

export function updateNativePracticeLanding(sim, player, contact, radius) {
  if (!sim.course.nativePracticeLandings || player.status !== "racing")
    return null;
  const position = sim.body(player).translation();
  if (!contact.supported) {
    const floor = nativeSteelieTerrainHeight(sim, position);
    // Source airborne mode begins on descent more than eight source height
    // units from the floor. Physical contact, not a ground probe, ends it.
    if (
      sim.body(player).linvel().y <= 0 &&
      (floor === null ||
        position.y - radius - floor > 8 * sim.course.nativeCamera.heightScale)
    )
      player.nativePracticeAirborne = true;
    return null;
  }
  const wasAirborne = player.nativePracticeAirborne;
  player.nativePracticeAirborne = false;
  if (!wasAirborne) return null;
  const intent = nativePracticeLandingIntent({
    ...slinkyCoordinates(sim.course).source(position, radius),
    region: player.navigation.region,
    claimed: player.landingClaimGroups?.includes(PRACTICE_LANDING_GROUP),
  });
  if (!intent) return null;
  (player.landingClaimGroups ??= []).push(PRACTICE_LANDING_GROUP);
  const target = `native-practice-region-${intent.region}`;
  (player.landingClaims ??= []).push(target);
  player.score += intent.score;
  return {
    type: intent.score ? "landing-bonus" : "landing-claim",
    target,
    ...intent,
  };
}

// Authored numbered paint sits on flat recovered shelf cells. Its seven bands
// use the same four-source-unit intervals as scoring; the last amount caps.
export function nativePracticeMarkings(course) {
  if (!course.nativePracticeLandings) return [];
  const space = slinkyCoordinates(course);
  return [
    [1, 424],
    [2, 488],
    [3, 432],
  ].map(([region, cross]) => {
    const along = origins[region] + 14;
    const position = space.world(
      region === 3 ? along : cross,
      region === 3 ? cross : along,
      16348,
    );
    return {
      kind: "native-landing-target",
      region,
      ...position,
      y: position.y + 0.012,
      w: 16 * space.unit,
      d: 28 * space.unit,
      angle: (space.part.angle ?? 0) + (region === 3 ? -Math.PI / 2 : 0),
      scoreBands: [...PRACTICE_LANDING_AMOUNTS],
    };
  });
}
