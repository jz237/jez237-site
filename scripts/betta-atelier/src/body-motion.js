// Arc-length spine shared by the skin and all fin insertions. The head stays
// steady; muscle waves travel down the trunk instead of shearing the tail.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
export const SPINE_START = -1.22, SPINE_END = 2.65, SPINE_COUNT = 161;
export class BodyMotion {
  constructor() {
    this.data = new Float32Array(SPINE_COUNT * 4);
    this.mouth = this.gill = 0;
    this.update(0, 0, 0, 0);
  }
  update(phase, effort, turn, breathPhase) {
    this.effort = effort;
    // A maneuver is a sustained C-bend, not a wider propulsion oscillation.
    // Positive yaw leaves the rear trunk on the previous heading behind the head.
    // Soft saturation avoids a kink as the turn speeds up or changes direction.
    this.turnBend = Math.tanh(turn * 0.95);
    this.mouth = Math.max(0, Math.sin(breathPhase)) ** 1.4 * (0.8 + effort * 0.2);
    // Buccal intake precedes the opercular outlet: not two synchronous flaps.
    this.gill = Math.max(0, Math.sin(breathPhase - 1.05)) ** 1.3 * (0.8 + effort * 0.2);
    const dx = (SPINE_END - SPINE_START) / (SPINE_COUNT - 1);
    let x = SPINE_START, z = 0, oldCos = 1, oldSin = 0;
    for (let i = 0; i < SPINE_COUNT; i++) {
      const u = clamp((SPINE_START + i * dx + 1.22) / 2.276, 0, 1);
      const envelope = u * u * (3 - 2 * u);
      // Compact propulsion strokes; turning curvature is a separate maneuver.
      // Quiet holding has almost no trunk excursion, but breathing continues.
      const angle = envelope * (0.006 + effort * 0.24) * Math.sin(phase - u * 3.1)
        + smooth(0.03, 1, u) * this.turnBend * 1.22;
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
