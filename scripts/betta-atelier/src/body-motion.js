// Arc-length spine shared by the skin and all fin insertions. Muscle waves travel down the trunk
// instead of shearing the tail; the head yaws a little against them (its recoil), about the
// body's middle, and leads it round into a turn.
import { tailAmplitude } from './swim-gait.js';
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const SPINE_START = -1.22, SPINE_END = 2.65, SPINE_COUNT = 161;
// Where along the trunk (0 neck .. 1 peduncle) the body swings about as the head yaws against the
// tail: its middle, a little behind the pectorals, where its weight is.
const PIVOT_U = 0.3;
// The stroke's wave: its phase lag from neck to peduncle (rad: about a wavelength a body length,
// so the rear third swings as a soft S rather than a flag), and how far the head yaws back against
// it (a share of the tail's swing).
const WAVE = 5, RECOIL = 0.12;
// Turning, the trunk curls into a C at once (CURL s of the turn's rate at the tail: the bend leads
// the turn rather than waiting for the tail to be dragged round), the head leads the route into the
// turn by LEAD s of it, and the C straightens as the turn ends.
const CURL = 0.4, LEAD = 0.05;
export class BodyMotion {
  constructor() {
    this.data = new Float32Array(SPINE_COUNT * 4);
    this.turnAngles = null;
    this.mouth = this.gill = 0;
    // The voluntary turn rate, eased over a tenth of a second or so (rad/s), and the head's yaw
    // against the route this update (rad).
    this.steer = 0;
    this.headYaw = 0;
    // The neck's frame (x, z, cos, sin), unrounded: the head in front of it is carried on it.
    this.neck = [SPINE_START, 0, 1, 0];
    // (Counts the updates: a point carried by transform() since the last one would be carried there still.)
    this.revision = 0;
    this.update(0, 0, 0, 0);
  }
  // Tangent memory travels from neck to peduncle. A new head direction reaches
  // the rear later, like the koi's head-following chain, instead of posing the
  // entire trunk in the same C shape at once. Only voluntary steering enters
  // here: water can rotate the whole fish without triggering a muscle U-turn.
  advanceTurn(dt, rate, speed) {
    this.turnAngles ??= new Float64Array(25);
    if (!(dt > 0)) return;
    const a = this.turnAngles, ds = 2.276 / (a.length - 1);
    let remaining = Math.min(dt, 0.07);
    while (remaining > 1e-9) {
      const h = Math.min(remaining, 1 / 120);
      this.steer += (rate - this.steer) * (1 - Math.exp(-9 * h));
      const travel = 1.6 + Math.min(2.5, Math.abs(speed)) * 1.5;
      const follow = 1 - Math.exp(-travel * h / ds);
      const relax = Math.exp(-h * (Math.abs(rate) > 0.15 ? 0.12 : 3));
      for (let i = a.length - 1; i > 0; i--) {
        a[i] = clamp((a[i] + rate * h) * relax, -2.95, 2.95);
        a[i] += (a[i - 1] - a[i]) * follow;
      }
      // Spread flexion along the trunk: a tight turn must not become a hinge
      // immediately behind the skull or invert the thick flank's inner surface.
      for (let i = 1; i < a.length; i++) a[i] = clamp(a[i], a[i - 1] - ds * 1.65, a[i - 1] + ds * 1.65);
      remaining -= h;
    }
  }
  // gulp / gulpGill: host-driven jaw opening and opercular pulse (a surface air
  // gulp); they take over from the breathing rhythm only while they are larger.
  // breathDepth: how deep this breath is (the gait varies it from breath to breath).
  update(phase, effort, turn, breathPhase, gulp = 0, gulpGill = 0, breathDepth = 1) {
    this.revision++;
    this.effort = effort;
    // A maneuver is a sustained C-bend, not a wider propulsion oscillation.
    // Positive yaw leaves the rear trunk on the previous heading behind the head.
    // Soft saturation avoids a kink as the turn speeds up or changes direction.
    this.turnBend = this.turnAngles ? clamp(this.turnAngles.at(-1) + CURL * this.steer, -2.95, 2.95) / 2.95 : Math.tanh(turn * 0.8);
    const depth = (0.8 + effort * 0.2) * breathDepth;
    // (Breathing, the lips only part; the gill covers pump plainly, lifting off the flank to show
    // the dark slit under them.)
    this.mouth = Math.max(gulp, Math.max(0, Math.sin(breathPhase)) ** 1.4 * depth * 0.5);
    // Buccal intake precedes the opercular outlet: not two synchronous flaps.
    this.gill = Math.max(gulpGill, Math.max(0, Math.sin(breathPhase - 1.05)) ** 1.3 * depth * 1.35);
    const dx = (SPINE_END - SPINE_START) / (SPINE_COUNT - 1);
    const sweep = tailAmplitude(effort);
    // The head yaws back against the tail's swing (in step with the rear third's), and into a turn.
    this.headYaw = (LEAD * -this.steer - RECOIL * (sweep - tailAmplitude(0)) * Math.sin(phase - WAVE * 0.85)) || 0;
    let x = SPINE_START, z = 0, oldCos = 1, oldSin = 0;
    const d = this.data;
    for (let i = 0; i < SPINE_COUNT; i++) {
      const u = clamp((SPINE_START + i * dx + 1.22) / 2.276, 0, 1);
      // The stroke bends the rear two-thirds of the trunk, the most at the peduncle: the front
      // stays all but rigid, and the caudal swings on the end of it.
      const envelope = smooth(0.3, 1, u);
      // Compact propulsion strokes; turning curvature is a separate maneuver.
      // Quiet holding has almost no trunk excursion, but breathing continues.
      let maneuver = smooth(0.03, 1, u) * this.turnBend * 2.95;
      if (this.turnAngles) {
        const g = u * (this.turnAngles.length - 1), a = Math.floor(g), b = Math.min(a + 1, this.turnAngles.length - 1);
        maneuver = clamp(this.turnAngles[a] + (this.turnAngles[b] - this.turnAngles[a]) * (g - a) + CURL * this.steer * smooth(0.05, 1, u), -2.95, 2.95);
      }
      const angle = this.headYaw + maneuver + envelope * sweep * (1 - Math.abs(maneuver) / 3.2)
        * Math.sin(phase - u * WAVE);
      const c = Math.cos(angle), s = Math.sin(angle);
      if (i) { x += dx * (oldCos + c) * 0.5; z += dx * (oldSin + s) * 0.5; }
      d[i * 4] = x; d[i * 4 + 1] = z; d[i * 4 + 2] = c; d[i * 4 + 3] = s;
      oldCos = c; oldSin = s;
    }
    // The head's yaw turns the body about its middle, not the neck: where the pivot would be with
    // the trunk unturned, it stays.
    let sx = 0, sz = 0;
    if (this.headYaw) {
      const p = Math.round((PIVOT_U * 2.276) / dx) * 4, px = d[p] - SPINE_START, pz = d[p + 1];
      const c = Math.cos(this.headYaw), s = Math.sin(this.headYaw);
      sx = px * c + pz * s - px; sz = pz * c - px * s - pz;
      for (let i = 0; i < SPINE_COUNT; i++) { d[i * 4] += sx; d[i * 4 + 1] += sz; }
    }
    const n = this.neck;
    n[0] = SPINE_START + sx; n[1] = sz; n[2] = Math.cos(this.headYaw); n[3] = Math.sin(this.headYaw);
  }
  // (In front of the neck, the head is carried rigidly on the spine's first frame.)
  frame(x, out) {
    if (x <= SPINE_START) {
      const n = this.neck, e = x - SPINE_START;
      out[0] = n[0] + e * n[2]; out[1] = n[1] + e * n[3]; out[2] = n[2]; out[3] = n[3]; return out;
    }
    const d = this.data;
    const grid = clamp((x - SPINE_START) / (SPINE_END - SPINE_START), 0, 1) * (SPINE_COUNT - 1);
    const a = Math.floor(grid), b = Math.min(a + 1, SPINE_COUNT - 1), f = grid - a;
    for (let k = 0; k < 4; k++) out[k] = d[a * 4 + k] * (1 - f) + d[b * 4 + k] * f;
    return out;
  }
  transform(x, y, z, out) {
    this.frame(x, out);
    const cx = out[0], cz = out[1], c = out[2], s = out[3];
    const cheek = Math.exp(-(((x + 1.03) / 0.17) ** 2) - ((y + 0.01) / 0.29) ** 2);
    z += Math.sign(z) * cheek * (0.004 + 0.018 * this.gill);
    const lip = 1 - smooth(-1.68, -1.48, x), jaw = 1 - smooth(-1.67, -1.28, x);
    y = 0.0832 + (y - 0.0832) * (1 - lip * (0.78 - 0.78 * this.mouth));
    y -= jaw * (1 - smooth(0.045, 0.105, y)) * (0.003 + 0.047 * this.mouth);
    out[0] = cx - z * s; out[1] = y; out[2] = cz + z * c;
    return out;
  }
}

// Same interpolation and breathing envelopes as transform(); fin solver and
// shader consume the identical Float32 spine rather than separate sine formulas.
export const bodyGLSL = `
uniform sampler2D uSpine;
uniform float uMouth,uGill;
vec4 spineFrame(float x) {
 if(x<=${SPINE_START}){vec4 f=texelFetch(uSpine,ivec2(0,0),0);return vec4(f.x+(x-(${SPINE_START}))*f.z,f.y+(x-(${SPINE_START}))*f.w,f.z,f.w);}
 float g=clamp((x-(${SPINE_START}))/${SPINE_END - SPINE_START},0.,1.)*${SPINE_COUNT - 1}.;
 int a=int(floor(g)), b=min(a+1,${SPINE_COUNT - 1});
 return mix(texelFetch(uSpine,ivec2(a,0),0),texelFetch(uSpine,ivec2(b,0),0),fract(g));
}
vec3 swim(vec3 p) {
 vec4 f=spineFrame(p.x);
 float cheek=exp(-pow((p.x+1.03)/.17,2.)-pow((p.y+.01)/.29,2.));
 p.z+=sign(p.z)*cheek*(.004+.018*uGill);
 float lip=1.-smoothstep(-1.68,-1.48,p.x),jaw=1.-smoothstep(-1.67,-1.28,p.x);
 p.y=.0832+(p.y-.0832)*(1.-lip*(.78-.78*uMouth));
 p.y-=jaw*(1.-smoothstep(.045,.105,p.y))*(.003+.047*uMouth);
 return vec3(f.x-p.z*f.w,p.y,f.y+p.z*f.z);
}
`;
