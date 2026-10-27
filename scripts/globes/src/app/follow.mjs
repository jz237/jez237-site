// The betta bowl's follow camera (FollowToggle.ts; main.ts runs it, GlobeController places it):
// drawn in close on the fish and kept on it as it swims. It looks the way the page's camera always
// looks (the same height and bearing: it never circles the bowl, so the studio stays put behind
// it) and stands where the fish is seen in the middle of the picture: through the glass and the
// water, which bend its image well off where it is towards the bowl's edge (the optics are the
// bowl's shader's, as pick.mjs has them). Its eye glides after the fish on a critically damped
// spring, and never comes nearer the bowl than the glass allows.
// (Pure: no DOM, no three.js. Points are in the sim frame - world axes, the bowl's centre at the
// origin - unless said otherwise.)

import { enterSphere, IOR_GLASS, IOR_WATER, refract } from './learn/pick.mjs';

/** How much of the picture's shorter side the fish fills (FISH_LENGTH), how quickly the eye
 *  follows (the spring's rate, 1/s), how near the glass it may come (world units), how long it
 *  takes to hand the picture back to the stage's camera (s), and, for a fish near the surface: how
 *  far under it (world units) the view starts to level out and how far it tilts up there (rad). */
export const FOLLOW = { fill: 0.4, rate: 3, clearance: 0.3, release: 1.1, surface: 0.3, lift: (4 * Math.PI) / 180 };
/** The betta, nose to tail tip (world units). */
export const FISH_LENGTH = 0.42;

const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** The line of sight from o along d (unit) as it goes on in the water: bent into the glass and out
 *  of it, into the water or the air over it, and down through the water's surface (level, as at
 *  rest). { p, dir }, or null where it never gets into the water. bowl: { outer, inner, level }. */
export function intoWater(o, d, bowl) {
  const t0 = enterSphere(o, d, bowl.outer);
  if (t0 === null) return null;
  let p = add(o, d, t0);
  const g = refract(d, unit(p), 1 / IOR_GLASS);
  const t1 = g ? enterSphere(p, g, bowl.inner) : null;
  if (t1 === null) return null;
  p = add(p, g, t1);
  const wet = p[1] < bowl.level;
  let dir = refract(g, unit(p), IOR_GLASS / (wet ? IOR_WATER : 1));
  if (!dir) return null;
  if (!wet) {
    // (Over the water: on down to its surface, and through it.)
    if (dir[1] >= 0) return null;
    p = add(p, dir, (bowl.level - p[1]) / dir[1]);
    dir = refract(dir, [0, 1, 0], 1 / IOR_WATER);
    if (!dir) return null;
  }
  return { p, dir };
}

/** Where an eye looking along `view` (unit) sees `point` in the middle of its picture, `distance`
 *  in front of it (or further, to keep clear of the glass): the eye's place across the view by
 *  Newton's steps, from straight in front of the point, each step shortened until its line still
 *  reaches the water and passes nearer. (Along its own line of sight the eye can stand anywhere: the
 *  line is bent the same.) Lines of sight all one way bend in towards the bowl's middle, so a point
 *  far out at the back may lie on none of them: then the nearest line found. */
export function eyeFor(point, view, distance, bowl) {
  const across = unit(cross(view, Math.abs(view[1]) > 0.99 ? [1, 0, 0] : [0, 1, 0]));
  const up = cross(across, view);
  const base = add(point, view, -distance);
  const eyeAt = (s) => add(add(base, across, s[0]), up, s[1]);
  // (How far the bent line passes from the point, across the view and up it.)
  const miss = (s) => {
    const ray = intoWater(eyeAt(s), view, bowl);
    if (!ray) return null;
    const r = add(point, ray.p, -1);
    const off = add(r, ray.dir, -dot(r, ray.dir));
    return [dot(off, across), dot(off, up)];
  };
  const size = (m) => Math.hypot(m[0], m[1]);
  let s = [0, 0];
  let m = miss(s);
  // (A start whose line never reaches the water: one nearer the bowl's middle, which bends less.)
  for (let k = 1; !m && k <= 4; k++) {
    s = [-dot(point, across) * k * 0.25, -dot(point, up) * k * 0.25];
    m = miss(s);
  }
  if (!m) return keepClear(base, view, bowl);
  for (let step = 0; step < 8 && size(m) > 1e-6; step++) {
    const h = 1e-4;
    const ma = miss([s[0] + h, s[1]]);
    const mb = miss([s[0], s[1] + h]);
    if (!ma || !mb) break;
    const j = [(ma[0] - m[0]) / h, (ma[1] - m[1]) / h, (mb[0] - m[0]) / h, (mb[1] - m[1]) / h];
    const det = j[0] * j[3] - j[2] * j[1];
    if (Math.abs(det) < 1e-12) break;
    const ds = [-(j[3] * m[0] - j[2] * m[1]) / det, -(-j[1] * m[0] + j[0] * m[1]) / det];
    let taken = false;
    for (let f = 1; f > 1 / 64; f /= 2) {
      const next = [s[0] + ds[0] * f, s[1] + ds[1] * f];
      const mn = miss(next);
      if (mn && size(mn) < size(m)) {
        s = next;
        m = mn;
        taken = true;
        break;
      }
    }
    if (!taken) break;
  }
  return keepClear(eyeAt(s), view, bowl);
}

/** An eye moved back along its line of sight, if need be, until it stands clear of the glass. */
function keepClear(eye, view, bowl) {
  const r = bowl.outer + FOLLOW.clearance;
  // (|eye - view t| = r, the far root: t = b + sqrt(b^2 - (|eye|^2 - r^2)), b = eye . view.)
  const b = dot(eye, view), c = dot(eye, eye) - r * r;
  if (c >= 0 && b <= 0) return eye;
  const t = b + Math.sqrt(Math.max(b * b - c, 0));
  return t > 0 ? add(eye, view, -t) : eye;
}

/** The way the follow camera looks down (rad, + down) for a fish `depth` under the water's surface:
 *  the stage's own way (stage) in mid-water, levelling out and tilting a little up near the top, so
 *  a fish just under the film is seen through the glass under it, the surface silvered overhead,
 *  not from over the water through its surface. */
export function followElevation(stage, depth) {
  const u = Math.min(Math.max((depth - 0.04) / (FOLLOW.surface - 0.04), 0), 1);
  return -FOLLOW.lift + (stage + FOLLOW.lift) * u * u * (3 - 2 * u);
}

/** The way an eye looks down at `elevation` (rad), towards -z. */
export const viewFor = (elevation) => [0, -Math.sin(elevation), -Math.cos(elevation)];

/** How far from the fish the eye stands for it to fill FOLLOW.fill of the picture's shorter side:
 *  fov (rad), the vertical field of view, at this aspect (width over height); zoom, the viewer's own
 *  nearer or further. */
export function followDistance(fov, aspect, zoom = 1) {
  const short = aspect < 1 ? 2 * Math.atan(Math.tan(fov / 2) * aspect) : fov;
  return (FISH_LENGTH / (FOLLOW.fill * 2 * Math.tan(short / 2))) * zoom;
}

/** The eye (world) gliding after where eyeFor puts it, and how much of the picture is its: all of
 *  it while following, easing back to the stage's camera over FOLLOW.release once let go. */
export class FollowCamera {
  constructor() {
    this.on = false;
    this.weight = 0;
    this.eye = [0, 0, 0];
    this.velocity = [0, 0, 0];
    /** The way it looks down (rad), eased (null: not yet, the stage's way). */
    this.elevation = null;
  }

  /** Following from now (the eye starts where the camera is: from: world; pressed again on the way
   *  back, from where its eye is), or not. */
  set(on, from) {
    if (on && !this.on && this.weight === 0) {
      this.eye = [...from];
      this.velocity = [0, 0, 0];
      this.elevation = null;
    }
    this.on = on;
    if (on) this.weight = 1;
  }

  /** A frame's way of looking down (rad): eased from the stage's (stage) towards `want` while
   *  following, and back to the stage's once let go. */
  tilt(dt, want, stage) {
    if (this.elevation === null) this.elevation = stage;
    if (dt > 0) this.elevation += ((this.on ? want : stage) - this.elevation) * (1 - Math.exp(-FOLLOW.rate * dt));
    return this.elevation;
  }

  /** A frame: the eye on towards `want` (world) as a critically damped spring, the weight up at once
   *  or eased out. */
  step(dt, want) {
    if (!(dt > 0)) return;
    const w = FOLLOW.rate;
    for (let k = 0; k < 3; k++) {
      const a = w * w * (want[k] - this.eye[k]) - 2 * w * this.velocity[k];
      this.velocity[k] += a * dt;
      this.eye[k] += this.velocity[k] * dt;
    }
    this.weight = this.on ? 1 : Math.max(0, this.weight - dt / FOLLOW.release);
  }

  /** How much of the picture is the follow camera's, eased (0: none). */
  get share() {
    const u = this.weight;
    return u * u * (3 - 2 * u);
  }
}
