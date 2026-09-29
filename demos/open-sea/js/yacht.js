// The sailing yacht: rendering (hull, sails, rigging), sailing physics and wave-following dynamics.
import { gl, Program, defineChunk, tex2D, depthTex, makeFBO, bindFBO } from './gl.js';
import { m4, clamp, lerp, smoothstep } from './math.js';
import { buildYacht, buildRigging, DIM, SAILS, MAT, sheer, waterlineHalfBeam } from './yacht-geo.js';
import { bindLighting } from './lighting.js';
import './glsl.js';

const YACHT_VS = `
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNrm;
layout(location = 2) in vec4 aAttr;
uniform mat4 uVP, uModel;
uniform vec4 uSail;    // angle, pivot x, flutter, time
uniform vec4 uSailShape; // foot y, head y, reef, tack x
out vec3 vLocal;
out vec3 vN;
out vec3 vRel;
out vec4 vAttr;
void main() {
  vec3 p = aPos, n = aNrm;
#ifdef SAIL
  float a0 = uSail.x;
  float sgn = clamp(a0 * 10.0, -1.0, 1.0);
  float v = aAttr.y, u = aAttr.x;
  float reef = uSailShape.z;
  float yF = uSailShape.x, yH = uSailShape.y;
  p.y = yF + (p.y - yF) * (1.0 - 0.42 * reef);
  p.x = uSail.y + (p.x - uSail.y) * (1.0 - 0.18 * reef);
  float isSail = step(abs(aAttr.z - ${MAT.SAIL}.0), 0.5);
  float a = a0 * (1.0 + 0.30 * v * isSail);
  float dz = sgn * p.z + uSail.z * sin(uSail.w * 9.0 + p.x * 2.3 + p.y * 1.7) * 0.10 * (0.2 + 0.8 * u) * (0.5 + 0.5 * sin(uSail.w * 2.1 + p.y));
  float dx = p.x - uSail.y;
  float c = cos(a), s = sin(a);
  p = vec3(uSail.y + dx * c + dz * s, p.y, -dx * s + dz * c);
  float nz = sgn * n.z;
  n = vec3(n.x * c + nz * s, n.y, -n.x * s + nz * c);
#endif
  vec4 w = uModel * vec4(p, 1.0);
  vRel = w.xyz;
  vN = mat3(uModel) * n;
  vLocal = p;
  vAttr = aAttr;
  gl_Position = uVP * w;
}`;

const YACHT_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
#include <underwater>
#include <water.uv>
uniform sampler2DArray uDisp;
uniform vec2 uYachtCen;    // centre of the cascade frame relative to the camera (xz)
in vec3 vLocal;
in vec3 vN;
in vec3 vRel;
in vec4 vAttr;
uniform vec3 uSunLocal, uMoonLocal;
uniform vec3 uMainTri[3], uJibTri[3];
uniform float uWet, uRefl, uCamY, uMirrorY, uUnderCam;
layout(location = 0) out vec4 o;

float tri(vec3 p, vec3 l, vec3 a, vec3 b, vec3 c) {
  vec3 e1 = b - a, e2 = c - a, h = cross(l, e2);
  float det = dot(e1, h);
  if (abs(det) < 1e-4) return 1.0;
  float inv = 1.0 / det;
  vec3 s = p - a; float u = inv * dot(s, h);
  vec3 q = cross(s, e1); float v = inv * dot(l, q); float t = inv * dot(e2, q);
  if (u < 0.0 || v < 0.0 || u + v > 1.0 || t < 0.05) return 1.0;
  return 0.42;
}
float sailShadow(vec3 p, vec3 l) {
  if (l.y < 0.02) return 1.0;
  return tri(p, l, uMainTri[0], uMainTri[1], uMainTri[2]) * tri(p, l, uJibTri[0], uJibTri[1], uJibTri[2]);
}
// true height of the wave surface at a camera-relative position (Eulerian, from the choppy displacement)
float waterHeightAt(vec2 relXZ) {
  vec2 gp = relXZ - uYachtCen, dd = vec2(0.0);
  float h = 0.0;
  for (int it = 0; it < 2; it++) {
    vec2 g = gp - dd;
    h = 0.0; dd = vec2(0.0);
    for (int i = 0; i < 5; i++) {
      if (i >= uCascades) break;
      vec4 d = textureLod(uDisp, vec3(cascUV(i, g), float(i)), 0.0);
      dd += toWorld(d.xz, i);
      h += d.y;
    }
  }
  return h;
}
float ggx(float nh, float a2) { float d = nh * nh * (a2 - 1.0) + 1.0; return a2 / (PI * d * d); }

void main() {
  if (uRefl > 0.5 && vRel.y + uCamY < uMirrorY - 0.04) discard;   // only what stands above the water is mirrored
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vRel);
  int mat = int(vAttr.z + 0.5);
  vec3 albedo = vec3(0.8); float rough = 0.4, metal = 0.0, trans = 0.0, f0 = 0.04;
  vec3 p = vLocal;
  if (mat == ${MAT.HULL}) {
    float z = p.y;
    albedo = vec3(0.84, 0.855, 0.86); rough = 0.2;
    float boot = smoothstep(0.03, 0.0, abs(z - 0.03)) ;
    if (z < -0.02) { albedo = vec3(0.075, 0.055, 0.052); rough = 0.55; }   // red-brown antifouling
    else if (z < 0.075) { albedo = vec3(0.02, 0.05, 0.11); rough = 0.35; }
    float cove = smoothstep(0.035, 0.02, abs(z - (0.66 + 0.0016 * p.x * p.x + (p.x > 0.0 ? 0.0042 * p.x * p.x : 0.0)) ));
    albedo = mix(albedo, vec3(0.03, 0.07, 0.16), cove);
    // hull windows
    float hw = step(abs(p.x - 0.4), 2.3) * step(0.55, z) * step(z, 0.86);
    albedo = mix(albedo, vec3(0.01, 0.015, 0.02), hw * step(abs(p.x - 0.4), 2.1));
  } else if (mat == ${MAT.DECK}) {
    albedo = vec3(0.70, 0.71, 0.70); rough = 0.6;
    float gr = 0.9 + 0.1 * vnoise(p.xz * 40.0);
    albedo *= gr;
  } else if (mat == ${MAT.CABIN}) {
    albedo = vec3(0.82, 0.83, 0.83); rough = 0.28;
    float above = p.y - (${sheer(0).toFixed(3)} + 0.04);
    float band = smoothstep(0.10, 0.14, above) * smoothstep(0.44, 0.40, above) * step(-1.55, p.x) * step(p.x, 1.85) * step(0.45, abs(p.z));
    albedo = mix(albedo, vec3(0.012, 0.018, 0.025), band); rough = mix(rough, 0.05, band);
  } else if (mat == ${MAT.TEAK}) {
    float plank = smoothstep(0.02, 0.06, abs(fract(p.z * 7.0 + p.x * 0.0) - 0.5) * 0.0 + abs(fract((p.x + p.z * 0.0) * 1.0) - 0.5) * 0.0 + abs(fract(p.z * 6.0) - 0.5) );
    float grain = vnoise(vec2(p.x * 4.0, p.z * 60.0));
    albedo = vec3(0.30, 0.17, 0.085) * mix(0.75, 1.15, grain) * mix(0.7, 1.0, plank);
    rough = 0.55;
  } else if (mat == ${MAT.ALU}) { albedo = vec3(0.78, 0.8, 0.82); metal = 1.0; rough = 0.33; }
  else if (mat == ${MAT.STEEL}) { albedo = vec3(0.86, 0.87, 0.9); metal = 1.0; rough = 0.18; }
  else if (mat == ${MAT.KEEL}) { albedo = vec3(0.10, 0.075, 0.07); rough = 0.6; }
  else if (mat == ${MAT.TRIM}) { albedo = vec3(0.05, 0.05, 0.055); rough = 0.4; }
  else if (mat == ${MAT.SAIL}) {
    albedo = vec3(0.92, 0.90, 0.84); rough = 0.85; trans = 0.45;
    float seam = smoothstep(0.012, 0.0, abs(fract(vAttr.y * 14.0) - 0.5) - 0.485 + 0.003) * 0.18;
    float wv = 0.94 + 0.06 * sin(vAttr.x * 900.0) * sin(vAttr.y * 1200.0);
    albedo *= wv * (1.0 - seam);
    float batten = smoothstep(0.004, 0.0, abs(fract(vAttr.y * 5.0 + 0.1) - 0.5) - 0.495 + 0.001) * step(0.55, vAttr.x) * 0.0;
  }

  // wet splash zone near the waterline
  float wet = smoothstep(0.32, 0.0, p.y) * step(0.0, p.y) * uWet;
  albedo *= 1.0 - 0.28 * wet;

  vec3 sunE = lightSun(), moonE = lightMoon();
  float shd = cloudShadowAt(vRel.xz);
  float ss = sailShadow(p, uSunLocal);
  float sm = sailShadow(p, uMoonLocal);
  vec3 col = vec3(0.0);
  vec3 F0 = mix(vec3(f0), albedo, metal);
  vec3 dif = albedo * (1.0 - metal);
  float a2 = pow(max(rough, 0.05), 4.0);
  for (int l = 0; l < 2; l++) {
    vec3 Ld = l == 0 ? uSunDir : uMoonDir;
    vec3 E = (l == 0 ? sunE * ss : moonE * sm) * shd;
    float nl = dot(N, Ld);
    float tr = mat == ${MAT.SAIL} ? trans * max(-nl, 0.0) : 0.0;
    nl = max(nl, 0.0);
    vec3 H = normalize(V + Ld);
    float nh = max(dot(N, H), 0.0), vh = max(dot(V, H), 0.0), nv = max(dot(N, V), 1e-3);
    vec3 F = F0 + (1.0 - F0) * pow(1.0 - vh, 5.0);
    float k = (rough + 1.0) * (rough + 1.0) / 8.0;
    float G = (nl / (nl * (1.0 - k) + k)) * (nv / (nv * (1.0 - k) + k));
    vec3 spec = ggx(nh, a2) * F * G / max(4.0 * nl * nv, 1e-3);
    col += E * (dif / PI * (nl + tr * 1.2) + spec * nl);
  }
  // ambient: diffuse sky/ground plus glossy reflection of the environment
  vec3 amb = ambientFor(N);
  amb = mix(vec3(luma(amb)), amb, 0.55);   // white paint under a blue sky reads white to a camera that has white-balanced the scene
  float ao = mat == ${MAT.HULL} ? mix(0.6, 1.0, smoothstep(-0.4, 0.3, p.y)) : 1.0;
  if (mat == ${MAT.SAIL}) amb *= 1.0 + trans * 1.5;
  col += dif * (amb + flashE(N) / PI) * ao;
  vec3 R = reflect(-V, N);
  vec3 envR = envRadiance(vec3(R.x, max(R.y, 0.02), R.z), clamp(rough * 6.0, 0.0, 6.0));
  float below = smoothstep(-0.25, 0.1, R.y);
  envR = mix(lightGround(), envR, below);
  vec3 Fe = F0 + (max(vec3(1.0 - rough), F0) - F0) * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  col += envR * Fe * ao * (mat == ${MAT.SAIL} ? 0.0 : mix(0.4, 1.0, metal));   // painted surfaces: the sky/sea fill is a weak sheen, not a second light

  // parts below the waterline are lit by the light that made it through the surface, not by the sky
  float wy = vRel.y + uCamY;
  float hw = wy > uMirrorY + 2.5 ? -1e3 : waterHeightAt(vRel.xz);
  float sub = smoothstep(hw + 0.02, hw - 0.10, wy);
  if (sub > 0.0) {
    vec3 sunWv, beamV, Ed0;
    underwaterLight(sunWv, beamV, Ed0);
    float zd = max(hw - wy, 0.0) + 0.1;
    float cg = causticGainRel(vRel, zd, sunWv, 0.3);
    // downwelling light is ~20x stronger than upwelling: undersides are dark silhouettes, tops and flanks catch the beams
    float eN = 0.04 + 0.17 * (1.0 - abs(N.y)) + 0.80 * max(N.y, 0.0);
    vec3 uwl = albedo * (Ed0 * eN + beamV * max(dot(N, -sunWv), 0.0) * cg * 0.9) / PI * exp(-KD * zd);
    col = mix(col, uwl, sub);
  }
  if (mat != ${MAT.SAIL} && metal < 0.5) col *= vec3(1.05, 1.0, 0.955);
  // aerial perspective
  float dist = length(vRel);
  vec3 ext = (RAY_S + (MIE_S + MIE_A) * uHaze) * 0.001;
  vec3 T = uUnderCam > 0.5 ? vec3(1.0) : exp(-ext * dist);   // under water the medium is applied by the composite pass
  vec3 hd = normalize(vec3(-V.x, 0.0, -V.z));
  vec3 Lh = horizonColor(hd);
  col = col * T + Lh * (1.0 - T);
  o = vec4(col, 1.0);
}`;

const RIG_VS = `
layout(location = 0) in vec3 aA;
layout(location = 1) in vec3 aB;
layout(location = 2) in float aW;
uniform mat4 uVP, uModel;
uniform vec2 uViewport;
out float vAlpha;
out vec3 vRel;
void main() {
  int id = gl_VertexID;
  float t = float(id >> 1);
  float side = float((id & 1) * 2 - 1);
  vec4 wa = uModel * vec4(aA, 1.0), wb = uModel * vec4(aB, 1.0);
  vec4 ca = uVP * wa, cb = uVP * wb;
  if (ca.w < 0.05 || cb.w < 0.05) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vAlpha = 0.0; vRel = vec3(0.0); return; }
  vec2 na = ca.xy / ca.w, nb = cb.xy / cb.w;
  vec2 d = (nb - na) * uViewport;
  vec2 dir = length(d) > 1e-4 ? normalize(d) : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);
  vec4 c = mix(ca, cb, t);
  float wpx = aW * uViewport.y * 0.5 / max(c.w, 0.1) * 1.4;   // projected width in pixels (approx)
  float px = max(wpx, 1.15);
  c.xy += perp * side * px * 0.5 / uViewport * c.w * 2.0;
  vAlpha = clamp(0.30 + 0.70 * wpx / px, 0.0, 1.0);
  vRel = mix(wa.xyz, wb.xyz, t);
  gl_Position = c;
}`;
const RIG_FS = `
#include <common>
#include <atmo>
#include <atmo.sample>
#include <lighting>
in float vAlpha;
in vec3 vRel;
layout(location = 0) out vec4 o;
void main() {
  if (vAlpha <= 0.0) discard;
  vec3 col = vec3(0.32, 0.33, 0.35) * (lightSky() / PI * 0.8 + lightSun() * 0.28 * cloudShadowAt(vRel.xz));
  float dist = length(vRel);
  vec3 ext = (RAY_S + (MIE_S + MIE_A) * uHaze) * 0.001;
  vec3 T = exp(-ext * dist);
  col = col * T + skyRadiance(normalize(vec3(vRel.x, 0.02, vRel.z) * vec3(1.0, 0.0, 1.0) + vec3(0.0, 0.02, 0.0))) * (1.0 - T);
  o = vec4(col, vAlpha * 0.9);
}`;

// A small, critically-damped follower for heave/pitch/roll
class Spring {
  constructor(w, z) { this.w = w; this.z = z; this.x = 0; this.v = 0; }
  step(target, dt) {
    const a = -this.w * this.w * (this.x - target) - 2 * this.z * this.w * this.v;
    this.v += a * dt; this.x += this.v * dt;
    return this.x;
  }
}

export class Yacht {
  constructor() {
    const g = buildYacht();
    const mk = (m) => {
      const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
      const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, m.verts, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 40, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 40, 12);
      gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 40, 24);
      const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.idx, gl.STATIC_DRAW);
      return { vao, count: m.idx.length };
    };
    this.hull = mk(g.hull); this.main = mk(g.main); this.jib = mk(g.jib); this.boom = mk(g.boom);
    this.progHull = new Program('yacht.hull', YACHT_VS, YACHT_FS);
    this.progSail = new Program('yacht.sail', YACHT_VS, YACHT_FS, 'SAIL');
    this.progRig = new Program('yacht.rig', RIG_VS, RIG_FS);
    const lines = buildRigging();
    this.nLines = lines.length / 7;
    this.rigVao = gl.createVertexArray(); gl.bindVertexArray(this.rigVao);
    const rb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, rb); gl.bufferData(gl.ARRAY_BUFFER, lines, gl.STATIC_DRAW);
    for (const [loc, size, off] of [[0, 3, 0], [1, 3, 12], [2, 1, 24]]) {
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 28, off); gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindVertexArray(null);

    // pose
    this.x = 0; this.z = 0; this.psi = 0; this.speed = 2.5;
    this.heave = new Spring(3.2, 0.62); this.pitchS = new Spring(2.5, 0.55); this.rollS = new Spring(2.2, 0.55);
    this.yawS = new Spring(0.9, 0.7);
    this.heaveV = 0; this.pitch = 0; this.roll = 0; this.yaw = 0;
    this.y = 0;
    this.acc = 0;
    this.t = 0;
    this.sailAng = -0.35; this.reef = 0; this.flutter = 0;
    this.targets = { h: 0, p: 0, r: 0 };
    this.wobble = 0;
    this.M = m4.ident();
    this.wetTimer = 0;
    this.tack = 1;
    this.probeH = [0, 0, 0, 0, 0];
    this.lastSlope = [0, 0];
  }

  // Points sampled each frame (world xz): centre, bow, stern, starboard, port
  probePoints() {
    const c = Math.cos(this.psi), s = Math.sin(this.psi);
    const w = (lx, lz) => [this.x + c * lx - s * lz, this.z + s * lx + c * lz];
    return [w(0, 0), w(4.6, 0), w(-4.6, 0), w(0, 1.7), w(0, -1.7)];
  }

  feed(probe) {
    if (!probe.fresh) return;
    for (let k = 0; k < 5; k++) this.probeH[k] = probe.get(k)[0];
    this.lastSlope = [probe.get(0)[1], probe.get(0)[2]];
  }

  // Sailing: heading from the wind, speed from a simple polar, sail trim and heel.
  _sail(env) {
    const U = env.U, windFrom = env.windDir + Math.PI;
    const twa = 62 * Math.PI / 180;                       // close reach on starboard tack
    let psi = windFrom - twa * this.tack;
    this.psiTarget = psi;
    const uk = U * 1.944;
    let vk = 0.6 * Math.pow(uk, 0.86);
    vk = Math.min(7.1, vk);
    vk *= 1 - 0.6 * smoothstep(17, 27, U);                // shortened sail and slower in a gale
    vk *= 1 - 0.05 * Math.min(6, env.hs);                 // pounding
    this.speedTarget = Math.max(0.35, vk * 0.5144);
    this.reef = smoothstep(11, 19, U);
    const heel = Math.min(0.30, 0.0030 * U * U * (1 - 0.5 * this.reef));
    this.heelTarget = -heel * this.tack;                  // leeward is opposite the wind side
    const slack = 1 - smoothstep(0.8, 3.5, U);
    this.flutter = slack;
    this.sailAngTarget = -this.tack * clamp(lerp(0.16, 0.42, smoothstep(0.4, 4.5, U)) + 0.10 * smoothstep(9, 16, U), 0.14, 0.62);
  }

  update(dt, env) {
    this.t += dt;
    this._sail(env);
    this.acc += Math.min(dt, 0.1);
    const h = 1 / 60;
    let steps = 0;
    while (this.acc >= h && steps < 6) {
      this.acc -= h; steps++;
      // heading and speed relax towards targets
      let dpsi = this.psiTarget - this.psi;
      dpsi = Math.atan2(Math.sin(dpsi), Math.cos(dpsi));
      this.psi += dpsi * (1 - Math.exp(-h / 4.0));
      this.speed += (this.speedTarget - this.speed) * (1 - Math.exp(-h / 3.0));
      this.sailAng += (this.sailAngTarget - this.sailAng) * (1 - Math.exp(-h / 1.5));
      this.x += Math.cos(this.psi) * this.speed * h; this.z += Math.sin(this.psi) * this.speed * h;

      const pb = this.probeH;
      const mean = (pb[0] * 2 + pb[1] + pb[2] + pb[3] + pb[4]) / 6;
      const pitchT = clamp(Math.atan2(pb[1] - pb[2], 8.4) * 0.7, -0.17, 0.17);
      const rollT = clamp(-Math.atan2(pb[3] - pb[4], 3.4) * 0.38, -0.16, 0.16);
      this.y = this.heave.step(mean - 0.10, h);
      this.pitch = this.pitchS.step(pitchT, h);
      this.roll = clamp(this.rollS.step(this.heelTarget + rollT, h), -0.5, 0.5);
      this.yaw = this.yawS.step(0.012 * Math.sin(this.t * 0.31) + 0.25 * rollT * Math.sign(this.tack), h);
    }
    if (steps === 6) this.acc = 0;
    this._matrix();
  }

  _matrix() {
    const psi = this.psi + this.yaw;
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch), cr = Math.cos(this.roll), sr = Math.sin(this.roll);
    const bow0 = [Math.cos(psi), 0, Math.sin(psi)], up0 = [0, 1, 0], sb0 = [-Math.sin(psi), 0, Math.cos(psi)];
    const bow1 = [bow0[0] * cp + up0[0] * sp, bow0[1] * cp + up0[1] * sp, bow0[2] * cp + up0[2] * sp];
    const up1 = [up0[0] * cp - bow0[0] * sp, up0[1] * cp - bow0[1] * sp, up0[2] * cp - bow0[2] * sp];
    const sb2 = [sb0[0] * cr - up1[0] * sr, sb0[1] * cr - up1[1] * sr, sb0[2] * cr - up1[2] * sr];
    const up2 = [up1[0] * cr + sb0[0] * sr, up1[1] * cr + sb0[1] * sr, up1[2] * cr + sb0[2] * sr];
    this.axes = { bow: bow1, up: up2, sb: sb2 };
    this.M = new Float64Array([bow1[0], bow1[1], bow1[2], 0, up2[0], up2[1], up2[2], 0, sb2[0], sb2[1], sb2[2], 0, this.x, this.y, this.z, 1]);
  }

  toWorld(l) {
    const { bow, up, sb } = this.axes;
    return [this.x + bow[0] * l[0] + up[0] * l[1] + sb[0] * l[2], this.y + bow[1] * l[0] + up[1] * l[1] + sb[1] * l[2], this.z + bow[2] * l[0] + up[2] * l[1] + sb[2] * l[2]];
  }
  toLocalDir(d) {
    const { bow, up, sb } = this.axes;
    return [d[0] * bow[0] + d[1] * bow[1] + d[2] * bow[2], d[0] * up[0] + d[1] * up[1] + d[2] * up[2], d[0] * sb[0] + d[1] * sb[1] + d[2] * sb[2]];
  }

  _sailTri(S, ang, reef) {
    const sgn = clamp(ang * 10, -1, 1);
    const yF = S.tack[1];
    const pts = [S.tack, S.head, S.clew].map(q => {
      let x = q[0], y = q[1];
      y = yF + (y - yF) * (1 - 0.42 * reef); x = S.tack[0] + (x - S.tack[0]) * (1 - 0.18 * reef);
      return [x, y, 0];
    });
    const piv = S === SAILS.main ? DIM.MAST_X : S.tack[0];
    return pts.map((q, i) => {
      const hf = i === 1 ? 1 : 0;
      const a = ang * (1 + 0.30 * hf);
      const dx = q[0] - piv, c = Math.cos(a), s = Math.sin(a);
      return [piv + dx * c, q[1], -dx * s];
    });
  }

  resizeRefl(w, h) {
    const rw = Math.max(64, w >> 1), rh = Math.max(64, h >> 1);
    if (this.reflTex && this.reflTex.w === rw && this.reflTex.h === rh) return;
    this.reflTex = tex2D(rw, rh, { fmt: 'rgba16f', filter: 'linear', mips: true });
    this.reflDepth = depthTex(rw, rh);
    this.reflFbo = makeFBO([this.reflTex], this.reflDepth);
  }

  // Mirror image of the yacht about the local water level, for the water shader to sample.
  drawReflection(ctx, VP) {
    const cam = ctx.cam;
    const dy = 2 * (this.y - cam.y);
    // camera-relative mirror: y' = 2 (waterY - camY) - y
    const Mir = new Float64Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, dy, 0, 1]);
    const VPm = Float32Array.from(m4.mul(Float64Array.from(VP), Mir));
    bindFBO(this.reflFbo);
    gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.depthMask(true);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.draw(ctx, VPm, ctx.camAbs, true);
    gl.bindTexture(gl.TEXTURE_2D, this.reflTex.tex); gl.generateMipmap(gl.TEXTURE_2D);
  }

  draw(ctx, VP, camAbs, mirror = false) {
    const rel = new Float64Array(this.M); rel[12] = this.x - camAbs[0]; rel[13] = this.y - ctx.cam.y; rel[14] = this.z - camAbs[2];
    const Mf = Float32Array.from(rel);
    const sunL = this.toLocalDir(ctx.sk.sunDir), moonL = this.toLocalDir(ctx.sk.moonDir);
    const mainTri = this._sailTri(SAILS.main, this.sailAng, this.reef), jibTri = this._sailTri(SAILS.jib, this.sailAng * 0.55, this.reef * 0.6);
    const flat = t => new Float32Array([...t[0], ...t[1], ...t[2]]);
    const setCommon = (p) => {
      p.m4('uVP', VP).m4('uModel', Mf);
      bindLighting(p, ctx);
      if (ctx.fx) ctx.fx.bindCaustic(p, ctx.cam);
      p.f('uUseSun', ctx.useSun ? 1 : 0).v3('uSunLocal', sunL[0], sunL[1], sunL[2]).v3('uMoonLocal', moonL[0], moonL[1], moonL[2]);
      if (ctx.sim) {
        const sim = ctx.sim, cx = this.x, cz = this.z;
        const { scale, off } = sim.cascadeUniforms(cx, cz);
        p.t('uDisp', 8, sim.disp).i('uCascades', sim.count).v4v('uCasc', scale).v2v('uCen', off).v2('uYachtCen', cx - camAbs[0], cz - camAbs[2]);
        if (sim.count > 1) p.v2('uNoiseOrg', scale[5] * cx + scale[6] * cz, -scale[6] * cx + scale[5] * cz);
      }
      p.v3v('uMainTri', flat(mainTri)).v3v('uJibTri', flat(jibTri)).f('uWet', 1)
        .f('uUnderCam', ctx.under ? 1 : 0).f('uRefl', mirror ? 1 : 0).f('uCamY', ctx.cam.y).f('uMirrorY', this.y);
    };
    gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.disable(gl.CULL_FACE);
    let p = this.progHull.use();
    setCommon(p);
    gl.bindVertexArray(this.hull.vao); gl.drawElements(gl.TRIANGLES, this.hull.count, gl.UNSIGNED_INT, 0);
    p = this.progSail.use();
    setCommon(p);
    const time = ctx.time || 0;
    p.v4('uSail', this.sailAng, DIM.MAST_X, this.flutter, time).v4('uSailShape', SAILS.main.tack[1], SAILS.main.head[1], this.reef, SAILS.main.tack[0]);
    gl.bindVertexArray(this.main.vao); gl.drawElements(gl.TRIANGLES, this.main.count, gl.UNSIGNED_INT, 0);
    p.v4('uSail', this.sailAng, DIM.MAST_X, 0, time).v4('uSailShape', SAILS.main.tack[1], SAILS.main.head[1], 0, SAILS.main.tack[0]);
    gl.bindVertexArray(this.boom.vao); gl.drawElements(gl.TRIANGLES, this.boom.count, gl.UNSIGNED_INT, 0);
    p.v4('uSail', this.sailAng, DIM.MAST_X, this.flutter, time).v4('uSailShape', SAILS.main.tack[1], SAILS.main.head[1], this.reef, SAILS.main.tack[0]);
    p.v4('uSail', this.sailAng * 0.55, SAILS.jib.tack[0], this.flutter * 0.8, time + 3.1).v4('uSailShape', SAILS.jib.tack[1], SAILS.jib.head[1], this.reef * 0.6, SAILS.jib.tack[0]);
    gl.bindVertexArray(this.jib.vao); gl.drawElements(gl.TRIANGLES, this.jib.count, gl.UNSIGNED_INT, 0);
    // rigging
    p = this.progRig.use();
    p.m4('uVP', VP).m4('uModel', Mf).v2('uViewport', ctx.w, ctx.h);
    bindLighting(p, ctx);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    gl.bindVertexArray(this.rigVao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.nLines);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }
}
