// The betta bowl's lid (render/bowl.ts): seated on the rim, or lifted off and carried up out of
// sight (and brought back down onto it). Its pose goes to the globe's shader every frame
// (GlobeView.setBowlLid). It comes off only to feed the fish, from a bowl standing still, which
// stays put until the lid is back on (Feeding.ts): its water would pour out of the open mouth.

import * as THREE from 'three/webgpu';
import { BOWL, type BowlShape } from '../render/bowl';

/** How long the lid takes to come off, or to go back on (s). */
const LIFT_SECONDS = 2.2;
/** First it rises along the bowl's axis until its collar is clear of the mouth... */
const CLEAR = 0.07;
/** ...then a hand carries it up and away to the right, tipping it as it goes (the translating
 *  frame: from where it cleared the mouth, and a turn of it, in radians). */
const AWAY = new THREE.Vector3(1.2, 2.7, 0.45);
const AWAY_TIP = new THREE.Euler(0.35, 0.25, -0.6);

const smooth = (a: number, b: number, x: number): number => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export class BowlLid {
  /** How far along its way off it is: 0 seated, 1 out of sight. */
  private u = 0;
  private wantOn = true;
  /** The globe's translating frame to the lid's (its underside's middle at the origin). */
  readonly toLid = new THREE.Matrix4();
  private readonly pose = new THREE.Matrix4();
  private readonly at = new THREE.Vector3();
  private readonly turn = new THREE.Quaternion();
  private readonly tip = new THREE.Quaternion();
  private readonly tmp = new THREE.Matrix4();
  private readonly tipping = new THREE.Euler();
  private readonly one = new THREE.Vector3(1, 1, 1);
  private readonly ray = new THREE.Ray();

  constructor(private readonly shape: BowlShape) {
    this.update(0, new THREE.Matrix3());
  }

  /** It is on, or on its way back on. */
  get on(): boolean {
    return this.wantOn;
  }

  /** It is anywhere in sight (seated, or on its way). */
  get shown(): boolean {
    return this.u < 1;
  }

  /** The furthest the lid reaches from the globe's centre (world units). */
  get reach(): number {
    return this.at.length() + this.shape.reach;
  }

  /** On the rim, still. */
  get seated(): boolean {
    return this.u === 0;
  }

  /** Out of the way of the open mouth (food can go in). */
  get clear(): boolean {
    return this.u > 0.45;
  }

  set(on: boolean): void {
    this.wantOn = on;
  }

  /** rotation: the globe's turn. */
  update(dt: number, rotation: THREE.Matrix3): void {
    const step = dt / LIFT_SECONDS;
    this.u = this.wantOn ? Math.max(0, this.u - step) : Math.min(1, this.u + step);

    const go = smooth(0.24, 1, this.u);
    // Seated (and rising out of the mouth) it turns with the globe; then the hand's way.
    this.at.set(0, this.shape.seat + CLEAR * smooth(0, 0.3, this.u), 0).applyMatrix3(rotation).addScaledVector(AWAY, go);
    this.turn.setFromRotationMatrix(this.tmp.setFromMatrix3(rotation));
    this.tip.setFromEuler(this.tipping.set(AWAY_TIP.x * go, AWAY_TIP.y * go, AWAY_TIP.z * go));
    this.turn.premultiply(this.tip);
    this.pose.compose(this.at, this.turn, this.one);
    this.toLid.copy(this.pose).invert();
  }

  /** A ray (the globe's translating frame) meets the lid, as near as its outline. */
  hits(origin: THREE.Vector3, dir: THREE.Vector3): boolean {
    if (!this.shown) return false;
    const r = this.ray.set(origin, dir).applyMatrix4(this.toLid);
    return this.span(r, BOWL.lidRadius + 0.01, -BOWL.collarDepth, this.shape.top + 0.01);
  }

  /** The ray passes through the upright cylinder r <= rad, lo <= y <= hi. */
  private span(r: THREE.Ray, rad: number, lo: number, hi: number): boolean {
    const o = r.origin;
    const d = r.direction;
    let t0 = 0;
    let t1 = Infinity;
    if (Math.abs(d.y) < 1e-9) {
      if (o.y < lo || o.y > hi) return false;
    } else {
      const a = (lo - o.y) / d.y;
      const b = (hi - o.y) / d.y;
      t0 = Math.max(t0, Math.min(a, b));
      t1 = Math.min(t1, Math.max(a, b));
    }
    const A = d.x * d.x + d.z * d.z;
    const B = o.x * d.x + o.z * d.z;
    const C = o.x * o.x + o.z * o.z - rad * rad;
    if (A < 1e-12) return C <= 0 && t0 <= t1;
    const disc = B * B - A * C;
    if (disc < 0) return false;
    const sq = Math.sqrt(disc);
    t0 = Math.max(t0, (-B - sq) / A);
    t1 = Math.min(t1, (-B + sq) / A);
    return t0 <= t1;
  }
}
