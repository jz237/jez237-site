// Arc-length spine shared by the skin and all fin insertions. The head stays
// steady; muscle waves travel down the trunk instead of shearing the tail.
import { tailAmplitude } from './swim-gait.js';
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const SPINE_START = -1.22, SPINE_END = 2.65, SPINE_COUNT = 161;
export class BodyMotion {
  constructor() {
    this.data = new Float32Array(SPINE_COUNT * 4);
    this.turnAngles = null;
    this.mouth = this.gill = 0;
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
      const travel = 0.38 + Math.min(2.5, Math.abs(speed)) * 0.75;
      const follow = 1 - Math.exp(-travel * h / ds);
      const relax = Math.exp(-h * (Math.abs(rate) > 0.15 ? 0.12 : 1.5));
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
  update(phase, effort, turn, breathPhase, gulp = 0, gulpGill = 0) {
    this.effort = effort;
    // A maneuver is a sustained C-bend, not a wider propulsion oscillation.
    // Positive yaw leaves the rear trunk on the previous heading behind the head.
    // Soft saturation avoids a kink as the turn speeds up or changes direction.
    this.turnBend = this.turnAngles ? this.turnAngles.at(-1) / 2.95 : Math.tanh(turn * 0.8);
    this.mouth = Math.max(gulp, Math.max(0, Math.sin(breathPhase)) ** 1.4 * (0.8 + effort * 0.2));
    // Buccal intake precedes the opercular outlet: not two synchronous flaps.
    this.gill = Math.max(gulpGill, Math.max(0, Math.sin(breathPhase - 1.05)) ** 1.3 * (0.8 + effort * 0.2));
    const dx = (SPINE_END - SPINE_START) / (SPINE_COUNT - 1);
    let x = SPINE_START, z = 0, oldCos = 1, oldSin = 0;
    for (let i = 0; i < SPINE_COUNT; i++) {
      const u = clamp((SPINE_START + i * dx + 1.22) / 2.276, 0, 1);
      const envelope = u * u * (3 - 2 * u);
      // Compact propulsion strokes; turning curvature is a separate maneuver.
      // Quiet holding has almost no trunk excursion, but breathing continues.
      let maneuver = smooth(0.03, 1, u) * this.turnBend * 2.95;
      if (this.turnAngles) {
        const g = u * (this.turnAngles.length - 1), a = Math.floor(g), b = Math.min(a + 1, this.turnAngles.length - 1);
        maneuver = this.turnAngles[a] + (this.turnAngles[b] - this.turnAngles[a]) * (g - a);
      }
      const angle = maneuver + envelope * tailAmplitude(effort) * (1 - Math.abs(maneuver) / 3.2)
        * Math.sin(phase - u * 3.1);
      const c = Math.cos(angle), s = Math.sin(angle);
      if (i) { x += dx * (oldCos + c) * 0.5; z += dx * (oldSin + s) * 0.5; }
      this.data.set([x, z, c, s], i * 4);
      oldCos = c; oldSin = s;
    }
  }
  frame(x, out) {
    if (x <= SPINE_START) { out[0] = x; out[1] = 0; out[2] = 1; out[3] = 0; return out; }
    const grid = clamp((x - SPINE_START) / (SPINE_END - SPINE_START), 0, 1) * (SPINE_COUNT - 1);
    const a = Math.floor(grid), b = Math.min(a + 1, SPINE_COUNT - 1), f = grid - a;
    for (let k = 0; k < 4; k++) out[k] = this.data[a * 4 + k] * (1 - f) + this.data[b * 4 + k] * f;
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
 if(x<=${SPINE_START}) return vec4(x,0.,1.,0.);
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
