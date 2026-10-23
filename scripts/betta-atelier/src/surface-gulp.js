// Surface air gulp for the standalone Atelier. Bettas are labyrinth fish and
// periodically take air at the surface. The standalone demo has no fluid solver,
// so the trip is scheduled: the second hover (t mod 32 in [16, 26)) of every third
// behaviour cycle. Envelopes and pitch match the globe's gulp (scripts/globes).
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const SURFACE_Y = 1.5;
export const MOUTH_DEPTH = 0.03;
export const GULP_PITCH = 0.85;
export const GULP_LENGTH = 1.6;
export const GULP_PERIOD = 96;
const WINDOW_START = 16;
// The climb waits 1.4 s so the 180-degree turn that precedes the hover has uncoiled.
const RISE = [1.4, 4.2], GULP_AT = 4.5, DIVE = [6.4, 9.2];
export const gulpMouth = (e) => 1.1 * (smooth(0, 0.28, e) - smooth(0.62, 0.95, e));
export const gulpGillCover = (e) => Math.sin(Math.PI * clamp((e - 0.8) / 0.8, 0, 1)) ** 1.2;
export const GULP_SURFACED = 0.95;
// What the fish actually shows. The scheduled jaw, gill pulse and "gulp" phase only
// apply once the damped body lift has really reached the surface, so returning from
// an inspection view mid-window cannot open the mouth on a fish that is still deep.
export function gulpPresentation(trip, lift) {
  if (!trip) return { mouth: 0, gill: 0, phase: "none", clock: -1 };
  const gate = smooth(0.9, 1, lift);
  const surfaced = trip.phase === "gulp" && lift >= GULP_SURFACED;
  return {
    mouth: trip.mouth * gate,
    gill: trip.gill * gate,
    phase: trip.phase === "gulp" && !surfaced ? "hold" : trip.phase,
    clock: surfaced ? trip.clock : -1,
  };
}
// Pure function of choreography time. lift 0..1 blends pitch and height towards
// the surface; clock is seconds into the gulp (-1 outside it); swim is the extra
// propulsion drive during the ascent and descent.
export function gulpState(t) {
  const s = ((t % GULP_PERIOD) + GULP_PERIOD) % GULP_PERIOD - WINDOW_START;
  if (s < RISE[0] || s >= DIVE[1]) return { lift: 0, clock: -1, mouth: 0, gill: 0, swim: 0, phase: "none" };
  if (s < RISE[1]) {
    const u = (s - RISE[0]) / (RISE[1] - RISE[0]);
    return { lift: smooth(0, 1, u), clock: -1, mouth: 0, gill: 0, swim: Math.sin(Math.PI * u), phase: "rise" };
  }
  if (s < DIVE[0]) {
    const clock = s - GULP_AT;
    const gulping = clock >= 0 && clock < GULP_LENGTH;
    return {
      lift: 1, clock: gulping ? clock : -1,
      mouth: gulping ? gulpMouth(clock) : 0,
      gill: gulping ? gulpGillCover(clock) : 0,
      swim: 0, phase: gulping ? "gulp" : "hold",
    };
  }
  const u = (s - DIVE[0]) / (DIVE[1] - DIVE[0]);
  return { lift: 1 - smooth(0, 1, u), clock: -1, mouth: 0, gill: 0, swim: Math.sin(Math.PI * u), phase: "dive" };
}
