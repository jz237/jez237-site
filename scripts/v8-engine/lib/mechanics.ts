export const ORDER = [1, 8, 4, 3, 6, 5, 7, 2];
export const R = 0.46;
export const L = 1.62;
export const PHASES = [45, 135, 315, 225];
export const RAD = Math.PI / 180;
export const mod = (n: number, m = 720) => ((n % m) + m) % m;
export const STROKES = ['Power', 'Exhaust', 'Intake', 'Compression'];
export const COLORS = ['#ff794b', '#b59afb', '#58c6f3', '#efd17b'];
export const CAM_Y = 0.95;
export const CAM_BASE = 0.16;
const camLocal = CAM_Y / Math.sqrt(2);
const followerTop = camLocal + CAM_BASE + 0.14;
const pushrodLength = Math.hypot(0.72 - camLocal, 3.23 - followerTop);
export function valvetrainState(
  id: number,
  angle: number,
  type: 'intake' | 'exhaust',
) {
  const s = cylinderState(id, angle),
    lift = s[type];
  const rockerAngle = -s.bank * Math.asin(lift / 0.36);
  const upperX = -s.bank * 0.36 * (1 + Math.cos(rockerAngle));
  const upperY = 3.23 + lift,
    lowerX = -s.bank * camLocal;
  const lowerY =
    upperY - Math.sqrt(pushrodLength ** 2 - (upperX - lowerX) ** 2);
  return {
    lift,
    rockerAngle,
    upperX,
    upperY,
    lowerX,
    lowerY,
    followerLift: lowerY - followerTop,
    pushrodLength,
  };
}
export function camRadius(
  id: number,
  localAngle: number,
  type: 'intake' | 'exhaust',
) {
  const beta = (id % 2 ? 1 : -1) * 45;
  return (
    CAM_BASE +
    valvetrainState(id, 2 * (beta - localAngle / RAD), type).followerLift
  );
}
export function cylinderState(id: number, angle: number) {
  const bank = id % 2 === 1 ? 1 : -1;
  const beta = (bank * Math.PI) / 4;
  const pair = Math.floor((id - 1) / 2);
  const theta = (angle + PHASES[pair]) * RAD;
  const relative = theta - beta;
  const pinX = R * Math.sin(theta),
    pinY = R * Math.cos(theta);
  const distance =
    R * Math.cos(relative) + Math.sqrt(L * L - (R * Math.sin(relative)) ** 2);
  const x = Math.sin(beta) * distance,
    y = Math.cos(beta) * distance;
  const cycle = mod(angle - ORDER.indexOf(id) * 90);
  const stroke = Math.floor(cycle / 180);
  // Ideal educational timing: no lead, lag or overlap; one smooth lift per stroke.
  const lift = (start: number) =>
    cycle > start && cycle < start + 180
      ? 0.16 * Math.sin((cycle - start) * RAD) ** 2
      : 0;
  return {
    id,
    bank,
    beta,
    pair,
    theta,
    pinX,
    pinY,
    distance,
    x,
    y,
    z: 1.95 - pair * 1.3 + bank * 0.14,
    cycle,
    stroke,
    intake: lift(360),
    exhaust: lift(180),
  };
}
