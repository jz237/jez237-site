// Arc-length spine shared by the skin and all fin insertions. The head stays
// steady; muscle waves travel down the trunk instead of shearing the tail.
import { tailAmplitude } from './swim-gait.js';
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const SPINE_START = -1.22, SPINE_END = 2.65, SPINE_COUNT = 161;
// The most the rear of the trunk may lag the head's heading (rad): round a tight turn, a U.
export const BEND_MOST = Math.PI;
// The most the rear may lag the head's pitch (rad): the trunk bends up and down far less than sideways.
export const PITCH_BEND_MOST = 0.5;
export class BodyMotion {
  constructor() {
    // Two texel rows: the sideways frame (x, z, cos, sin), then the up-and-down one (lift, cos, sin).
    this.texels = new Float32Array(SPINE_COUNT * 8);
    this.data = this.texels.subarray(0, SPINE_COUNT * 4);
    this.pitchData = this.texels.subarray(SPINE_COUNT * 4);
    this.turnAngles = this.pitchAngles = null;
    this.mouth = this.gill = 0;
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
      // (The bend runs back as fast as the fish swims on, so the trunk lies along the way the head
      // went: round a tight turn, a U.)
      const travel = 0.1 + Math.min(2.5, Math.abs(speed));
      const follow = 1 - Math.exp(-travel * h / ds);
      const relax = Math.exp(-h * (Math.abs(rate) > 0.15 ? 0.12 : 1.5));
      for (let i = a.length - 1; i > 0; i--) {
        a[i] = clamp((a[i] + rate * h) * relax, -BEND_MOST, BEND_MOST);
        a[i] += (a[i - 1] - a[i]) * follow;
      }
      // Spread flexion along the trunk: a tight turn must not become a hinge
      // immediately behind the skull or invert the thick flank's inner surface.
      for (let i = 1; i < a.length; i++) a[i] = clamp(a[i], a[i - 1] - ds * 1.65, a[i - 1] + ds * 1.65);
      remaining -= h;
    }
  }
  // The same for the pitch: the head tips up or down and the trunk behind it keeps the angle it had,
  // until swimming on carries the new angle back along it. So the tail does not swing up or down
  // with the head as if the fish were a rigid rod pivoting on its neck.
  advancePitch(dt, rate, speed) {
    this.pitchAngles ??= new Float64Array(25);
    if (!(dt > 0)) return;
    const a = this.pitchAngles, ds = 2.276 / (a.length - 1);
    let remaining = Math.min(dt, 0.07);
    while (remaining > 1e-9) {
      const h = Math.min(remaining, 1 / 120);
      const follow = 1 - Math.exp(-(0.1 + Math.min(2.5, Math.abs(speed))) * h / ds);
      const relax = Math.exp(-h * (Math.abs(rate) > 0.1 ? 0.15 : 0.5));
      for (let i = a.length - 1; i > 0; i--) {
        a[i] = clamp((a[i] + rate * h) * relax, -PITCH_BEND_MOST, PITCH_BEND_MOST);
        a[i] += (a[i - 1] - a[i]) * follow;
      }
      for (let i = 1; i < a.length; i++) a[i] = clamp(a[i], a[i - 1] - ds * 0.5, a[i - 1] + ds * 0.5);
      remaining -= h;
    }
  }
  // gulp / gulpGill: host-driven jaw opening and opercular pulse (a surface air
  // gulp); they take over from the breathing rhythm only while they are larger.
  update(phase, effort, turn, breathPhase, gulp = 0, gulpGill = 0) {
    this.revision++;
    this.effort = effort;
    // A maneuver is a sustained C-bend, not a wider propulsion oscillation.
    // Positive yaw leaves the rear trunk on the previous heading behind the head.
    // Soft saturation avoids a kink as the turn speeds up or changes direction.
    this.turnBend = this.turnAngles ? clamp(this.turnAngles.at(-1) / 2.95, -1, 1) : Math.tanh(turn * 0.8);
    this.mouth = Math.max(gulp, Math.max(0, Math.sin(breathPhase)) ** 1.4 * (0.8 + effort * 0.2));
    // Buccal intake precedes the opercular outlet: not two synchronous flaps.
    this.gill = Math.max(gulpGill, Math.max(0, Math.sin(breathPhase - 1.05)) ** 1.3 * (0.8 + effort * 0.2));
    const dx = (SPINE_END - SPINE_START) / (SPINE_COUNT - 1);
    let x = SPINE_START, z = 0, lift = 0, oldCos = 1, oldSin = 0, oldUp = 1, oldRise = 0;
    const d = this.data, v = this.pitchData, pa = this.pitchAngles;
    for (let i = 0; i < SPINE_COUNT; i++) {
      const u = clamp((SPINE_START + i * dx + 1.22) / 2.276, 0, 1);
      // The wave runs the length of the trunk and grows toward the tail: the body bends as a whole,
      // not a tail flicking behind a stiff trunk. The head stays steady.
      const envelope = smooth(0, 0.3, u) * (0.3 + 0.7 * u);
      // Compact propulsion strokes; turning curvature is a separate maneuver.
      // Quiet holding has almost no trunk excursion, but breathing continues.
      let maneuver = smooth(0.03, 1, u) * this.turnBend * 2.95;
      if (this.turnAngles) {
        const g = u * (this.turnAngles.length - 1), a = Math.floor(g), b = Math.min(a + 1, this.turnAngles.length - 1);
        maneuver = this.turnAngles[a] + (this.turnAngles[b] - this.turnAngles[a]) * (g - a);
      }
      const angle = maneuver + envelope * tailAmplitude(effort) * (1 - Math.abs(maneuver) / 3.2)
        * Math.sin(phase - u * 4.4);
      let bow = 0;
      if (pa) {
        const g = u * (pa.length - 1), a = Math.floor(g), b = Math.min(a + 1, pa.length - 1);
        bow = pa[a] + (pa[b] - pa[a]) * (g - a);
      }
      const c = Math.cos(angle), s = Math.sin(angle), up = Math.cos(bow), rise = Math.sin(bow);
      if (i) { x += dx * (oldCos * oldUp + c * up) * 0.5; z += dx * (oldSin * oldUp + s * up) * 0.5; lift += dx * (oldRise + rise) * 0.5; }
      d[i * 4] = x; d[i * 4 + 1] = z; d[i * 4 + 2] = c; d[i * 4 + 3] = s;
      v[i * 4] = lift; v[i * 4 + 1] = up; v[i * 4 + 2] = rise;
      oldCos = c; oldSin = s; oldUp = up; oldRise = rise;
    }
  }
  frame(x, out) {
    if (x <= SPINE_START) { out[0] = x; out[1] = 0; out[2] = 1; out[3] = 0; return out; }
    const grid = clamp((x - SPINE_START) / (SPINE_END - SPINE_START), 0, 1) * (SPINE_COUNT - 1);
    const a = Math.floor(grid), b = Math.min(a + 1, SPINE_COUNT - 1), f = grid - a;
    for (let k = 0; k < 4; k++) out[k] = this.data[a * 4 + k] * (1 - f) + this.data[b * 4 + k] * f;
    return out;
  }
  /** The up-and-down frame at x: [lift, cos, sin] of the trunk's bow there. */
  pitchFrame(x, out) {
    if (x <= SPINE_START) { out[0] = 0; out[1] = 1; out[2] = 0; return out; }
    const grid = clamp((x - SPINE_START) / (SPINE_END - SPINE_START), 0, 1) * (SPINE_COUNT - 1);
    const a = Math.floor(grid), b = Math.min(a + 1, SPINE_COUNT - 1), f = grid - a;
    for (let k = 0; k < 3; k++) out[k] = this.pitchData[a * 4 + k] * (1 - f) + this.pitchData[b * 4 + k] * f;
    return out;
  }
  transform(x, y, z, out) {
    this.pitchFrame(x, out);
    const lift = out[0], up = out[1], rise = out[2];
    this.frame(x, out);
    const cx = out[0], cz = out[1], c = out[2], s = out[3];
    const cheek = Math.exp(-(((x + 1.03) / 0.17) ** 2) - ((y + 0.01) / 0.29) ** 2);
    z += Math.sign(z) * cheek * (0.004 + 0.018 * this.gill);
    const lip = 1 - smooth(-1.68, -1.48, x), jaw = 1 - smooth(-1.67, -1.28, x);
    y = 0.0832 + (y - 0.0832) * (1 - lip * (0.78 - 0.78 * this.mouth));
    y -= jaw * (1 - smooth(0.045, 0.105, y)) * (0.003 + 0.047 * this.mouth);
    const along = -y * rise;
    out[0] = cx + along * c - z * s; out[1] = lift + y * up; out[2] = cz + along * s + z * c;
    return out;
  }
}

// Same interpolation and breathing envelopes as transform(); fin solver and
// shader consume the identical Float32 spine rather than separate sine formulas.
export const bodyGLSL = `
uniform sampler2D uSpine;
uniform float uMouth,uGill;
vec4 spineFrame(float x) {
 if(x<=${SPINE_START}) return vec4(x,0.,1.,0.);
 float g=clamp((x-(${SPINE_START}))/${SPINE_END - SPINE_START},0.,1.)*${SPINE_COUNT - 1}.;
 int a=int(floor(g)), b=min(a+1,${SPINE_COUNT - 1});
 return mix(texelFetch(uSpine,ivec2(a,0),0),texelFetch(uSpine,ivec2(b,0),0),fract(g));
}
vec4 spinePitch(float x) {
 if(x<=${SPINE_START}) return vec4(0.,1.,0.,0.);
 float g=clamp((x-(${SPINE_START}))/${SPINE_END - SPINE_START},0.,1.)*${SPINE_COUNT - 1}.;
 int a=int(floor(g)), b=min(a+1,${SPINE_COUNT - 1});
 return mix(texelFetch(uSpine,ivec2(a,1),0),texelFetch(uSpine,ivec2(b,1),0),fract(g));
}
vec3 swim(vec3 p) {
 vec4 f=spineFrame(p.x), v=spinePitch(p.x);
 float cheek=exp(-pow((p.x+1.03)/.17,2.)-pow((p.y+.01)/.29,2.));
 p.z+=sign(p.z)*cheek*(.004+.018*uGill);
 float lip=1.-smoothstep(-1.68,-1.48,p.x),jaw=1.-smoothstep(-1.67,-1.28,p.x);
 p.y=.0832+(p.y-.0832)*(1.-lip*(.78-.78*uMouth));
 p.y-=jaw*(1.-smoothstep(.045,.105,p.y))*(.003+.047*uMouth);
 float along=-p.y*v.z;
 return vec3(f.x+along*f.z-p.z*f.w,v.x+p.y*v.y,f.y+along*f.w+p.z*f.z);
}
`;
