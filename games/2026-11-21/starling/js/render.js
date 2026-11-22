// STARLING 2026 — renderer. A painted sky that moves through dusk, night, storm and dawn over a lighthouse on its
// rock; a sea with a rolling swell that mirrors the sky, the lamp and every blast; flocks of folded machine-birds
// (one instanced mesh per kind, wings flapped in the vertex shader, lit by shots and explosions); feathers and lit
// debris that fall into the water; rain, lightning, an aurora and shooting stars; and an HDR bloom chain.
import * as THREE from '../vendor/three.module.min.js';
import { Post } from './post.js?v=130';
import { W, H, TYPES } from './sim.js?v=130';

const PI = Math.PI, TAU = PI * 2, rand = Math.random, FOV = 30, TANH = Math.tan((FOV / 2) * PI / 180), IMG = '130';
const NOISE = `float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + vec2(11.0, 5.0); a *= 0.5; } return s; }`;
// The sea is drawn twice with the same code: behind everything, and again over the foot of the rock, so the two
// always match. It mirrors the painted sky, the moon, the lamp, the sweeping beam and up to four blasts.
const SEA = `uniform float t, asp, sea, px, pm, sw, stm, au, pg; uniform vec2 lamp, pas; uniform vec4 L[4]; uniform vec3 LC[4]; uniform sampler2D pa, pb;
uniform vec3 sN, sF, gl, fo, suC, fs; uniform vec4 mo, su, rip;
vec3 paintAt(vec2 p, float hh){ float ext = 0.8 * (1.0 - sea), v = clamp(hh / 0.8, 0.004, 0.996); return mix(texture2D(pa, vec2(0.5 + p.x / (ext * pas.x), v)).rgb, texture2D(pb, vec2(0.5 + p.x / (ext * pas.y), v)).rgb, px) * pg; }
vec3 seaCol(vec2 p, float v){ float d = clamp((sea - v) / sea, 0.0, 1.0);
  vec3 w = mix(sN, sF, smoothstep(0.0, 0.5, d));
  float z = 1.0 / (d + 0.07); vec2 wv = vec2(p.x * z * 3.2, z * 9.0 + t * 1.1); float n1 = noise(wv), n2 = noise(wv * vec2(2.1, 3.3) + vec2(t * 0.35, 3.0)), crest = pow(n1 * n2, 2.2) * 2.6, swell = noise(vec2(p.x * z * 1.6 + t * 0.12, z * 1.1 + t * 0.2));
  // the rolling swell: long fronts travelling in towards the rock, taller and whiter in a storm
  float ph = z * 2.4 + t * (0.8 + stm * 0.5) + noise(vec2(p.x * z * 0.8, z * 0.5)) * 2.6, roll = pow(0.5 + 0.5 * sin(ph), 5.0), amp = 0.36 + stm * 0.64;
  if (pm > 0.0) { vec3 rf = paintAt(vec2(p.x + (swell - 0.5) * 0.03 * (0.3 + d) + roll * 0.012 * amp, 0.0), d * 0.3 + (n1 - 0.5) * 0.03 + roll * 0.025 * amp); w = mix(w, rf * 0.62, pm * 0.6 * (1.0 - d * 0.6)); }
  w *= 0.82 + swell * 0.36; w *= 1.0 - (1.0 - roll) * 0.2 * amp * (1.0 - d * 0.5); w += fo * roll * 0.07 * amp * (1.0 - d * 0.4);
  float foam = smoothstep(0.7, 1.0, roll) * smoothstep(0.42, 0.72, noise(wv * 1.3 + vec2(0.0, t * 0.4))) * amp; w = mix(w, fo, foam * 0.5 * (1.0 - d * 0.55));
  w += gl * crest * (1.0 - d) * 0.5 * exp(-abs(p.x) * 1.4);
  w += vec3(1.0, 0.93, 0.8) * mo.z * crest * exp(-pow((p.x - mo.x) / (0.035 + d * 0.22), 2.0)) * 1.1 * (1.0 - 0.7 * d);
  w += suC * su.z * (crest * 1.5 + 0.08) * exp(-pow((p.x - su.x) / (0.045 + d * 0.3), 2.0)) * (1.0 - 0.5 * d);
  w += vec3(1.0, 0.9, 0.6) * crest * exp(-pow((p.x - lamp.x) / (0.012 + d * 0.045), 2.0)) * 1.1 * exp(-d * 2.4);
  float cs = cos(sw); w += vec3(1.0, 0.92, 0.62) * crest * step(0.0, (p.x - lamp.x) * cs) * smoothstep(0.75, 1.0, abs(cs)) * 0.9 * exp(-d * 2.5);
  for (int i = 0; i < 4; i++) { float dx = p.x - L[i].x, hg = max(0.03, L[i].y - sea); w += LC[i] * L[i].z * (crest * 1.4 + 0.12) * exp(-dx * dx / (0.004 + hg * hg * 0.35)) / (1.0 + hg * 5.0); }
  // the flock's shadow crossing the water, the ring where something big went in, a trace of the aurora
  w *= 1.0 - fs.z * exp(-pow((p.x - fs.x) / fs.y, 2.0)) * (0.55 + 0.45 * noise(vec2(p.x * z * 9.0 + t * 1.5, z * 5.0))) * (1.0 - d * 0.6);
  if (rip.w > 0.0) { float rr = length(vec2(p.x - rip.x, (v - rip.y) * 3.6)); w = mix(w, fo * 1.15, min(1.0, rip.w * (exp(-pow((rr - rip.z) / 0.028, 2.0)) + 0.5 * exp(-pow((rr - rip.z * 0.6) / 0.022, 2.0))) * (0.6 + 0.4 * n1))); }
  w += vec3(0.06, 0.5, 0.3) * au * crest * 0.3 * (1.0 - d);
  return w; }`;
// Time of day. Each look is a set of colours and amounts; the renderer eases from one to the next as the waves go
// by: dusk, night, the storm that comes with the Roost, then dawn. h0..h3 sky from horizon to zenith; sN, sF sea
// near and far; gl crest glint; fo foam; cl0, cl1 cloud bands; hz horizon haze; vc the veil in front (rgb, alpha).
const TOD = {
  dusk: { img: 'dusk', pg: 1, h0: [1, 0.45, 0.2], h1: [0.62, 0.2, 0.42], h2: [0.16, 0.1, 0.36], h3: [0.02, 0.03, 0.1], sN: [0.75, 0.3, 0.2], sF: [0.03, 0.05, 0.12], gl: [1, 0.6, 0.35], fo: [0.8, 0.72, 0.8], cl0: [1, 0.5, 0.3], cl1: [0.3, 0.16, 0.4], hz: [1, 0.5, 0.25], vc: [0.75, 0.42, 0.5, 0.11], stK: 1, moon: 1, sun: 0, stm: 0, hemi: [0.72, 0.66, 1], hemiI: 1, key: [1, 0.78, 0.56], keyI: 2.2 },
  night: { img: 'night', pg: 1, h0: [0.15, 0.2, 0.42], h1: [0.07, 0.1, 0.3], h2: [0.025, 0.04, 0.16], h3: [0.004, 0.008, 0.035], sN: [0.1, 0.16, 0.32], sF: [0.008, 0.014, 0.05], gl: [0.25, 0.3, 0.45], fo: [0.6, 0.68, 0.85], cl0: [0.2, 0.25, 0.45], cl1: [0.06, 0.08, 0.2], hz: [0.25, 0.32, 0.6], vc: [0.25, 0.3, 0.5, 0.09], stK: 1.7, moon: 1.5, sun: 0, stm: 0, hemi: [0.5, 0.6, 1], hemiI: 0.9, key: [0.7, 0.8, 1], keyI: 1.7 },
  storm: { img: 'roost', pg: 1, h0: [0.43, 0.135, 0.14], h1: [0.27, 0.06, 0.27], h2: [0.08, 0.03, 0.24], h3: [0.02, 0.009, 0.08], sN: [0.25, 0.1, 0.15], sF: [0.012, 0.015, 0.04], gl: [0.25, 0.15, 0.09], fo: [0.66, 0.68, 0.8], cl0: [0.28, 0.14, 0.17], cl1: [0.14, 0.07, 0.19], hz: [0.5, 0.1, 0.12], vc: [0.2, 0.1, 0.22, 0.2], stK: 0.08, moon: 0.3, sun: 0, stm: 1, hemi: [0.55, 0.48, 0.85], hemiI: 0.8, key: [1, 0.62, 0.5], keyI: 1.6 },
  dawn: { img: 'dawn', pg: 0.6, h0: [0.78, 0.48, 0.3], h1: [0.66, 0.36, 0.38], h2: [0.26, 0.32, 0.56], h3: [0.06, 0.11, 0.32], sN: [0.55, 0.38, 0.32], sF: [0.06, 0.11, 0.22], gl: [0.9, 0.7, 0.45], fo: [0.95, 0.88, 0.84], cl0: [0.85, 0.56, 0.46], cl1: [0.5, 0.4, 0.58], hz: [0.9, 0.62, 0.36], vc: [0.9, 0.72, 0.7, 0.08], stK: 0.05, moon: 0.15, sun: 0.7, stm: 0, hemi: [1, 0.88, 0.82], hemiI: 1.1, key: [1, 0.86, 0.66], keyI: 2.4 },
};
const FIRE = [[-1.7, 0.45], [1.3, -0.25], [0.3, 0.95], [-0.5, -0.9]]; // where the Roost burns, in its own frame
const COL = { finch: [0.25, 0.95, 0.85], shrike: [1.0, 0.66, 0.22], heron: [0.78, 0.7, 1.0], kite: [1.0, 0.32, 0.3], roost: [1, 0.8, 0.5] };
const SIZE = { finch: 0.62, shrike: 0.7, heron: 0.95, kite: 1.05 };
// silhouettes: bl/bw/bh body length, half-width, height; neck; hw/hl head; beak; span/chord/sweep of the wing;
// nf primaries, fl how much of each finger's slot it fills; tail feathers, tw their length, fork; legs trailing
const SHAPE = {
  finch: { bl: 0.75, bw: 0.14, bh: 0.11, neck: 0.05, hw: 0.085, hl: 0.2, beak: 0.09, span: 0.82, chord: 0.42, sweep: 0.05, nf: 3, fl: 0.95, tail: 3, tw: 0.26, fork: 0.25, legs: 0 },
  shrike: { bl: 0.85, bw: 0.13, bh: 0.1, neck: 0.06, hw: 0.08, hl: 0.2, beak: 0.13, span: 0.95, chord: 0.36, sweep: 0.32, nf: 4, fl: 0.8, tail: 3, tw: 0.4, fork: 0, legs: 0, mask: 1 },
  heron: { bl: 0.8, bw: 0.15, bh: 0.11, neck: 0.3, hw: 0.07, hl: 0.2, beak: 0.26, span: 1.05, chord: 0.5, sweep: 0, nf: 5, fl: 0.72, tail: 3, tw: 0.2, fork: 0, legs: 0.5 },
  kite: { bl: 0.85, bw: 0.13, bh: 0.1, neck: 0.06, hw: 0.085, hl: 0.2, beak: 0.12, span: 1.1, chord: 0.34, sweep: 0.14, nf: 5, fl: 0.6, tail: 4, tw: 0.42, fork: 0.55, legs: 0 },
};

class Batch { // sprites. additive: 0 soft glow, 1 ring, 2 hot core, 3 streak. Not additive: soft noisy smoke puffs.
  constructor(cap, additive = true) {
    const g = new THREE.InstancedBufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3)); g.setIndex([0, 1, 2, 0, 2, 3]);
    this.p = new Float32Array(cap * 4); this.s = new Float32Array(cap * 3); this.c = new Float32Array(cap * 4); this.cap = cap; this.n = 0;
    this.ap = new THREE.InstancedBufferAttribute(this.p, 4); this.as = new THREE.InstancedBufferAttribute(this.s, 3); this.ac = new THREE.InstancedBufferAttribute(this.c, 4); for (const a of [this.ap, this.as, this.ac]) a.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('iP', this.ap); g.setAttribute('iS', this.as); g.setAttribute('iC', this.ac);
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: `attribute vec4 iP; attribute vec3 iS; attribute vec4 iC; varying vec2 vUv; varying vec4 vC; varying float vS; varying float vR; void main(){ vUv = position.xy; vC = iC; vS = iS.z; vR = iP.w; float c = cos(iP.w), s = sin(iP.w); vec2 q = position.xy * iS.xy; ${additive ? 'q = vec2(q.x*c - q.y*s, q.x*s + q.y*c);' : ''} gl_Position = projectionMatrix * viewMatrix * vec4(iP.xyz + vec3(q, 0.0), 1.0); }`,
      fragmentShader: additive
        ? 'varying vec2 vUv; varying vec4 vC; varying float vS; void main(){ float d = length(vUv), a; if (vS < 0.5) a = pow(max(0.0, 1.0 - d), 2.2); else if (vS < 1.5) a = smoothstep(1.0, 0.86, d) * smoothstep(0.6, 0.8, d); else if (vS < 2.5) a = pow(max(0.0, 1.0 - d), 2.0) * 0.7 + smoothstep(0.55, 0.36, d) * 1.6; else a = pow(max(0.0, 1.0 - abs(vUv.y)), 3.0) * pow(max(0.0, 1.0 - abs(vUv.x)), 0.6); gl_FragColor = vec4(vC.rgb * a * vC.a, 1.0); }'
        : NOISE + 'varying vec2 vUv; varying vec4 vC; varying float vR; void main(){ float d = length(vUv), n = noise(vUv * 2.4 + vR * 9.0) * 0.6 + noise(vUv * 5.3 - vR * 5.0) * 0.4; float a = smoothstep(1.0, 0.1, d + (n - 0.5) * 0.85); gl_FragColor = vec4(vC.rgb * (0.6 + 0.8 * n), a * vC.a); }' });
    this.mesh = new THREE.Mesh(g, m); this.mesh.frustumCulled = false; this.mesh.renderOrder = additive ? 20 : 15; this.g = g;
  }
  add(x, y, z, sx, sy, rot, r, g, b, a, shape) { if (this.n >= this.cap) return; const i = this.n++, j = i * 4, k = i * 3; this.p[j] = x; this.p[j + 1] = y; this.p[j + 2] = z; this.p[j + 3] = rot; this.s[k] = sx; this.s[k + 1] = sy; this.s[k + 2] = shape; this.c[j] = r; this.c[j + 1] = g; this.c[j + 2] = b; this.c[j + 3] = a; }
  flush() { this.g.instanceCount = this.n; this.ap.needsUpdate = this.as.needsUpdate = this.ac.needsUpdate = true; this.n = 0; }
}

// One folded bird, nose towards +y. Each vertex carries: w (0 at the shoulder, 1 at the wing tip, drives the
// flap), a shade for its facet, and a glow (eyes and beak).
function birdGeo(o) {
  const P = [], A = [], v = (x, y, z, wt = 0) => [x, y, z, wt], tri = (a, b, c, sh = 1, gl = 0) => { for (const q of [a, b, c]) { P.push(q[0], q[1], q[2]); A.push(q[3] || 0, sh, gl); } };
  const { bl, bw, bh, neck, hw, hl, beak, span, chord, sweep, nf, fl, tail, tw, fork, legs } = o, y0 = bl * 0.42, yT = -bl * 0.5, ys = y0 * 0.25;
  const NB = v(0, y0, bh * 0.5), SL = v(-bw, ys, 0.04), SR = v(bw, ys, 0.04), D = v(0, 0, bh), K = v(0, -0.02, -bh * 0.7), T = v(0, yT, 0.02);
  tri(NB, SL, D, 1.0); tri(NB, D, SR, 0.86); tri(T, D, SL, 0.8); tri(T, SR, D, 0.68); // back
  tri(NB, K, SL, 0.42); tri(NB, SR, K, 0.5); tri(T, SL, K, 0.36); tri(T, K, SR, 0.42); // belly
  const hy = y0 + neck, hz = bh * 0.5 + hw * 0.6, HL = v(-hw, hy, 0.03), HR = v(hw, hy, 0.03), HT = v(0, hy + hl * 0.15, hz), HB = v(0, hy + hl * 0.55, 0.05), BK = v(0, hy + hl * 0.55 + beak, 0), mk = o.mask ? 0.3 : 1;
  tri(NB, HL, HT, 0.95 * mk); tri(NB, HT, HR, 0.8 * mk); tri(HL, HB, HT, 1.05 * mk); tri(HT, HB, HR, 0.9 * mk);
  tri(v(-hw * 0.45, hy + hl * 0.5, 0.04), BK, v(0, hy + hl * 0.5, hw * 0.5), 1.5, 0.35); tri(v(0, hy + hl * 0.5, hw * 0.5), BK, v(hw * 0.45, hy + hl * 0.5, 0.04), 1.3, 0.35);
  for (const s of [1, -1]) { const ex = s * hw * 0.62, ey = hy + hl * 0.24, ez = hz * 0.8, e = hw * 0.36; tri(v(ex - e, ey, ez), v(ex + e, ey, ez), v(ex, ey + e * 1.3, ez + 0.01), 1, 1); }
  for (const s of [1, -1]) {
    const RF = v(s * bw * 0.85, ys + chord * 0.3, 0.05), RB = v(s * bw * 0.85, ys - chord * 0.55, 0.04), WR = v(s * span * 0.5, ys + chord * 0.42 - sweep * 0.4, 0.06, 0.5), IT = v(s * span * 0.46, ys - chord * 0.75 - sweep * 0.4, 0.04, 0.46);
    tri(RF, WR, RB, 0.9); tri(WR, IT, RB, 0.72);
    tri(v(RF[0], RF[1], 0.085), v(WR[0], WR[1], 0.095, 0.5), v((RB[0] + IT[0]) / 2, (RF[1] + RB[1]) / 2 - sweep * 0.2, 0.075, 0.25), 1.12); // coverts
    for (let j = 0; j < 3; j++) { const a = j / 3, b = (j + 0.82) / 3, ax = RB[0] + (IT[0] - RB[0]) * a, ay = RB[1] + (IT[1] - RB[1]) * a, bx = RB[0] + (IT[0] - RB[0]) * b, by = RB[1] + (IT[1] - RB[1]) * b; tri(v(ax, ay, 0.03, 0.46 * a), v(bx, by, 0.03, 0.46 * b), v((ax + bx) / 2 + s * 0.02, (ay + by) / 2 - chord * 0.42, 0.02, 0.23 * (a + b)), j % 2 ? 0.62 : 0.5); } // secondaries
    for (let i = 0; i < nf; i++) { const f = nf > 1 ? i / (nf - 1) : 0, a = -0.18 + sweep * 0.9 + f * 1.25, da = (1.25 / nf) * fl, r = span * 0.55 * (1 - 0.34 * Math.pow(f, 1.4)), q = (ang, rr, wt) => v(WR[0] + s * Math.cos(ang) * rr, WR[1] - Math.sin(ang) * rr, 0.05 - f * 0.02, wt);
      tri(WR, q(a - da * 0.5, r * 0.94, 0.95), q(a + da * 0.5, r * 0.9, 0.9), i % 2 ? 0.74 : 0.98); tri(q(a - da * 0.5, r * 0.94, 0.95), q(a, r * 1.06, 1), q(a + da * 0.5, r * 0.9, 0.9), i % 2 ? 0.9 : 1.15); } // primaries
  }
  for (let i = 0; i < tail; i++) { const f = tail > 1 ? i / (tail - 1) - 0.5 : 0, len = tw * (1 + fork * Math.abs(f) * 2), x = f * tw * 1.2, w = tw * 0.42 / Math.max(1, tail * 0.5), a = v(x - w, yT - len * 0.86, 0.01, 0.15), b = v(x + w, yT - len * 0.86, 0.01, 0.15); tri(T, a, b, i % 2 ? 0.6 : 0.78); tri(a, v(x * 1.12, yT - len, 0.01, 0.2), b, i % 2 ? 0.7 : 0.9); }
  if (legs) for (const s of [1, -1]) tri(v(s * 0.03, yT, -0.02), v(s * 0.08, yT, -0.02), v(s * 0.06, yT - legs, -0.02, 0.1), 0.45);
  const g = new THREE.InstancedBufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('at', new THREE.Float32BufferAttribute(A, 3)); return g;
}

export class Renderer {
  constructor(canvas) {
    const r = this.r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); r.outputColorSpace = THREE.LinearSRGBColorSpace; r.autoClear = false;
    this.post = new Post(r); this.scene = new THREE.Scene(); this.cam = new THREE.PerspectiveCamera(FOV, 1, 1, 300); this.time = 0; this.frameN = 0; this.shake = 0; this.flash = 0; this.fade = 1; this.flashCol = new THREE.Color(1, 1, 1); this.opt = { flash: 1 }; this.parts = []; this.lights = []; this.deb = []; this.hpMax = new WeakMap(); this.hi = true; this.pal = JSON.parse(JSON.stringify(TOD.dusk)); this.pal0 = true; this.tex = {}; this.pbName = null; this.boltT = 3; this.bolt = null; this.starT = 4; this.sprayT = 1; this.rip = { x: 0, r: 0, a: 0 }; this.crash = null; this.fsx = W / 2; this.fsk = 0; this.fcount = 0; this.lastTick = 0;
    this.hemi = new THREE.HemisphereLight(0xb8a8ff, 0x1a1030, 1.0); this.scene.add(this.hemi); const key = this.key = new THREE.DirectionalLight(0xffc890, 2.2); key.position.set(-0.4, 0.5, 0.8); this.scene.add(key);
    const std = (c, m, ro, o = {}) => new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: ro, ...o }), glow = (rr, gg, bb, k) => new THREE.MeshBasicMaterial({ color: new THREE.Color(rr, gg, bb).multiplyScalar(k) }), box = new THREE.BoxGeometry(1, 1, 1), ball = new THREE.SphereGeometry(1, 10, 8);
    const put = (parent, geo, mat, x, y, z, sx, sy, sz, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.z = rz; parent.add(m); return m; };

    // ---- sky: a painted far layer (if it loads) blended into a dusk gradient, stars, a moon, drifting cloud bands, the sea
    const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1); blank.needsUpdate = true; const v3 = () => ({ value: new THREE.Vector3() }), v4 = () => ({ value: new THREE.Vector4() });
    const U = this.skyU = { t: { value: 0 }, asp: { value: 1 }, sea: { value: 0.1 }, fl: { value: 0 }, px: { value: 1 }, pm: { value: 0 }, stm: { value: 0 }, au: { value: 0 }, stK: { value: 1 }, pg: { value: 1 }, h0: v3(), h1: v3(), h2: v3(), h3: v3(), sN: v3(), sF: v3(), gl: v3(), fo: v3(), cl0: v3(), cl1: v3(), hz: v3(), suC: v3(), fs: v3(), vc: v4(), mo: v4(), su: v4(), rip: v4(), lt: v4(), sw: { value: 1.57 }, lamp: { value: new THREE.Vector2(0, 0.1) }, pas: { value: new THREE.Vector2(3, 3) }, pa: { value: blank }, pb: { value: blank },
      L: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, 0, 0)) }, LC: { value: [0, 1, 2, 3].map(() => new THREE.Vector3()) }, res: { value: new THREE.Vector2(1, 1) }, top: { value: -1.62 } };
    // one painting per time of day; sky() fades between them. Any that fail to load leave that sky procedural.
    const loader = new THREE.TextureLoader(); for (const name of ['dusk', 'night', 'dawn', 'roost']) loader.load(`img/${name}.webp?v=${IMG}`, (tx) => { tx.colorSpace = THREE.SRGBColorSpace; tx.wrapS = THREE.MirroredRepeatWrapping; tx.wrapT = THREE.ClampToEdgeWrapping; tx.minFilter = THREE.LinearFilter; tx.generateMipmaps = false; this.tex[name] = tx; }, undefined, () => { /* that sky stays procedural */ });
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: U, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }',
      fragmentShader: NOISE + SEA + `varying vec2 vUv; uniform float fl, stK; uniform vec3 h0, h1, h2, h3, cl0, cl1, hz; uniform vec4 lt;
        float seg(vec2 q, vec2 a, vec2 b){ vec2 qa = q - a, ba = b - a; float k = clamp(dot(qa, ba) / dot(ba, ba), 0.0, 1.0); return length(qa - ba * k); }
        void main(){ vec2 p = vec2((vUv.x - 0.5) * asp, vUv.y); float h = clamp((vUv.y - sea) / (1.0 - sea), 0.0, 1.0);
          vec3 col = mix(h0, h1, smoothstep(0.0, 0.22, h)); col = mix(col, h2, smoothstep(0.12, 0.55, h)); col = mix(col, h3, smoothstep(0.45, 1.0, h));
          float bolt = lt.y * exp(-abs(p.x - lt.x) * 4.5); // lightning lights the cloud around it
          if (pm > 0.0) { vec3 P = paintAt(p, h) * (1.0 + bolt * 1.5); col = mix(col, P * 0.86 + col * 0.12, pm * 0.9 * (1.0 - smoothstep(0.58, 0.8, h))); }
          float dark = (1.0 - smoothstep(0.02, 0.2, dot(col, vec3(0.3, 0.5, 0.2)))) * min(1.0, stK);
          vec2 sp = p * 90.0; float st = hash(floor(sp)); col += vec3(0.9, 0.95, 1.0) * step(0.992, st) * smoothstep(0.3, 0.7, h) * (0.45 + 0.55 * sin(t * (1.5 + st * 3.0) + st * 60.0)) * (1.0 - smoothstep(0.0, 0.5, length(fract(sp) - 0.5))) * (0.25 * stK + 0.75 * dark);
          sp = p * 37.0 + 11.0; st = hash(floor(sp)); col += vec3(1.0, 0.9, 0.8) * step(0.985, st) * smoothstep(0.4, 0.8, h) * (0.6 + 0.4 * sin(t * (0.8 + st * 2.0) + st * 31.0)) * pow(max(0.0, 1.0 - length(fract(sp) - 0.5) * 2.6), 3.0) * 1.4 * (0.2 * stK + 0.8 * dark);
          if (au > 0.01) { float ax = p.x * 1.3 + fbm(vec2(p.x * 0.7 + t * 0.03, t * 0.04)) * 2.2, band = pow(0.5 + 0.5 * sin(ax * 2.6 + sin(ax * 1.1 + t * 0.17) * 1.6), 6.0), ray = pow(noise(vec2(p.x * 34.0 + ax * 4.0, t * 0.3)), 1.5) * 1.3 + 0.25, base = 0.47 + 0.1 * sin(ax * 1.7), hg = smoothstep(base - 0.015, base + 0.03, h) * exp(-(h - base) * 4.2);
            col += mix(vec3(0.1, 1.0, 0.55), vec3(0.5, 0.25, 0.95), smoothstep(base, base + 0.36, h)) * band * ray * hg * au * 0.75; } // aurora: curtains with a sharp lower edge and fine rays, green low and violet high
          float md = length(p - mo.xy); col += vec3(1.0, 0.95, 0.85) * (smoothstep(0.052, 0.046, md) * 1.6 + exp(-md * 9.0) * 0.25) * mo.z;
          float sd = length(p - su.xy); col += suC * su.z * (smoothstep(su.w, su.w * 0.9, sd) * 2.0 + exp(-sd * 5.0) * 0.45 + exp(-sd * 1.6) * 0.16); // the sun coming up over the sea line
          for (int i = 0; i < 4; i++) { float fi = float(i); vec2 q = vec2(p.x * (1.2 + fi * 0.5) + t * 0.008 * (1.0 + fi) + fi * 7.0, (vUv.y - 0.3 - fi * 0.16) * 7.0); float c = smoothstep(0.52, 0.8, fbm(q) * (1.0 - abs(q.y - 0.3) * 0.9)); vec3 cc = mix(cl0, cl1, fi / 3.0 + 0.2) * (1.0 + bolt * 2.0); col = mix(col, cc, c * mix(0.55, 0.3, pm) * (i == 3 ? 0.6 : 1.0)); }
          col += hz * exp(-h * 16.0) * 0.22; // haze on the horizon
          vec2 bd = vec2(cos(sw), sin(sw)), lv = p - vec2(lamp.x, lamp.y); float al = dot(lv, bd), pe = abs(lv.x * bd.y - lv.y * bd.x); col += vec3(1.0, 0.9, 0.62) * step(0.0, al) * exp(-pow(pe / (0.03 + al * 0.14), 2.0)) * exp(-al * 1.5) * 0.12; // the beam catching the haze
          for (int i = 0; i < 4; i++) { vec2 dl = p - L[i].xy; col += LC[i] * L[i].z * exp(-dot(dl, dl) * 26.0) * 0.16; }
          if (lt.y > 0.01) { vec2 a = vec2(lt.x + 0.12, 1.03), b = vec2(lt.x, lt.w), pv = a; float dm = 1.0; for (int k = 1; k <= 8; k++) { float tt = float(k) / 8.0; vec2 pt = mix(a, b, tt) + vec2((noise(vec2(float(k) * 7.3, lt.z)) - 0.5) * 0.26 * sin(tt * 3.1416), 0.0); dm = min(dm, seg(p, pv, pt)); pv = pt; }
            col += vec3(0.8, 0.86, 1.0) * lt.y * min(6.0, 0.00008 / (dm * dm + 0.000008)) + vec3(0.45, 0.5, 0.75) * lt.y * 0.035; } // the stroke itself, and the whole sky lifting with it
          if (vUv.y < sea) col = seaCol(p, vUv.y);
          col += vec3(0.5, 0.6, 1.0) * fl * 0.2; gl_FragColor = vec4(col, 1.0); }` }));
    sky.frustumCulled = false; sky.renderOrder = -100; this.scene.add(sky);
    // thin cloud drifting in front of the flock (dropped when the game has had to lower its resolution)
    this.veil = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, uniforms: U, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: NOISE + `varying vec2 vUv; uniform float t, asp, stm; uniform vec4 vc; void main(){ vec2 p = vec2((vUv.x - 0.5) * asp, vUv.y); float n = noise(vec2(p.x * 1.3 + t * 0.022, p.y * 3.1 - t * 0.004) + 7.0) * 0.6 + noise(vec2(p.x * 3.1 + t * 0.04, p.y * 7.0) + 2.0) * 0.4; float a = smoothstep(0.5, 0.82, n) * smoothstep(0.22, 0.45, vUv.y) * smoothstep(1.0, 0.75, vUv.y) * vc.a; vec3 col = vc.rgb;
        if (stm > 0.03) { float r = 0.0; for (int i = 0; i < 2; i++) { float fi = float(i); vec2 rp = vec2((p.x + vUv.y * 0.17) * (46.0 + fi * 40.0), vUv.y); float o = hash(vec2(floor(rp.x), fi * 7.0 + 1.0)), y = fract(rp.y * (1.3 + fi * 0.9) + t * (2.6 + o * 1.6 + fi) + o * 9.0); r += step(0.45, o) * smoothstep(0.0, 0.03, y) * smoothstep(0.3 - fi * 0.1, 0.03, y) * pow(max(0.0, 1.0 - abs(fract(rp.x) - 0.5) * 2.0), 12.0) * (0.6 - fi * 0.25); }
          float ra = r * stm * 0.34; col = mix(col, vec3(0.75, 0.82, 1.0), ra / max(0.001, a + ra)); a += ra; } // rain, two layers of slanting streaks
        gl_FragColor = vec4(col, a); }` }));
    this.veil.frustumCulled = false; this.veil.renderOrder = 16; this.scene.add(this.veil);

    // ---- lighthouse on its rock, behind the play plane
    const lh = this.lh = new THREE.Group(), add = (geo, mat, x, y, z, sx, sy, sz, rz = 0) => put(lh, geo, mat, x, y, z, sx, sy, sz, rz);
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const cx = cv.getContext('2d'); cx.fillStyle = '#8a8494'; cx.fillRect(0, 0, 128, 128); for (let i = 0; i < 900; i++) { const g = 60 + rand() * 150; cx.fillStyle = `rgba(${g},${g * 0.95},${g * 1.05},${0.1 + rand() * 0.3})`; cx.fillRect(rand() * 128, rand() * 128, 1 + rand() * 4, 1 + rand() * 3); } cx.strokeStyle = 'rgba(20,16,30,0.5)'; for (let i = 0; i < 16; i++) { cx.lineWidth = 0.5 + rand() * 1.5; cx.beginPath(); const y = rand() * 128; cx.moveTo(0, y); cx.bezierCurveTo(40, y + rand() * 14 - 7, 90, y + rand() * 14 - 7, 128, y + rand() * 10 - 5); cx.stroke(); }
    const rt = new THREE.CanvasTexture(cv); rt.wrapS = rt.wrapT = THREE.RepeatWrapping; rt.repeat.set(3, 2); rt.colorSpace = THREE.SRGBColorSpace; const rockM = (c) => std(c, 0.1, 0.95, { flatShading: true, map: rt, bumpMap: rt, bumpScale: 1.5 });
    const rock = (x, y, z, sx, sy, sz, c, det = 1) => { const g = new THREE.IcosahedronGeometry(1, det), q = g.attributes.position; for (let i = 0; i < q.count; i++) { const k = 1 + (Math.sin(q.getX(i) * 9.1 + q.getY(i) * 5.3) * Math.sin(q.getZ(i) * 7.7 + q.getY(i) * 3.1)) * 0.12; q.setXYZ(i, q.getX(i) * k, q.getY(i) * k, q.getZ(i) * k); } g.computeVertexNormals(); return add(g, rockM(c), x, y, z, sx, sy, sz); };
    rock(0, -3.05, 0, 4.6, 1.9, 2.4, 0xb4aac6, 2); rock(2.9, -3.15, 0.4, 2.6, 1.8, 1.7, 0x9a90ae); rock(-3.3, -3.5, 0.3, 2.1, 1.6, 1.5, 0x8a809e); rock(1.2, -2.2, 1.3, 0.7, 0.5, 0.6, 0xb8aeca, 0); rock(-1.7, -2.15, 1.2, 0.55, 0.45, 0.5, 0xa49ab8, 0);
    const white = std(0xe8e2d8, 0.1, 0.7), red = std(0x8a2a2a, 0.1, 0.7), iron = std(0x2a2630, 0.6, 0.5), warm = glow(1, 0.78, 0.4, 1.7);
    add(new THREE.CylinderGeometry(0.42, 0.62, 3.4, 16), white, 0, -0.9, 0, 1, 1, 1); for (const y of [-1.75, -0.85, 0.05]) { const k = 0.62 - (y + 2.6) * 0.0588; add(new THREE.CylinderGeometry(k + 0.012 - 0.0132, k + 0.012 + 0.0132, 0.45, 16), red, 0, y, 0, 1, 1, 1); }
    add(box, iron, 0, -1.02, 0.56, 0.24, 0.42, 0.06); add(box, warm, 0, -1.0, 0.585, 0.14, 0.3, 0.02); for (const [x, y] of [[0.12, -0.35], [-0.1, 0.32]]) { add(box, iron, x, y, 0.5 - (y + 1) * 0.05, 0.15, 0.22, 0.06); add(box, warm, x, y, 0.515 - (y + 1) * 0.05, 0.09, 0.15, 0.04); }
    add(new THREE.CylinderGeometry(0.66, 0.6, 0.1, 16), iron, 0, 0.84, 0, 1, 1, 1); add(new THREE.CylinderGeometry(0.5, 0.42, 0.14, 16), iron, 0, 0.74, 0, 1, 1, 1);
    const rail = add(new THREE.TorusGeometry(0.66, 0.014, 5, 24), iron, 0, 1.06, 0, 1, 1, 1); rail.rotation.x = PI / 2; for (let i = 0; i < 12; i++) add(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 4), iron, Math.cos(i / 12 * TAU) * 0.66, 0.97, Math.sin(i / 12 * TAU) * 0.66, 1, 1, 1);
    this.lamp = add(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8), glow(1, 0.92, 0.6, 3), 0, 1.15, 0, 1, 1, 1);
    this.lens = new THREE.Group(); this.lens.position.set(0, 1.15, 0); lh.add(this.lens); for (const z of [0.25, -0.25]) put(this.lens, box, glow(1, 0.96, 0.78, 4.5), 0, 0, z, 0.3, 0.32, 0.03); put(this.lens, box, iron, 0, 0, 0, 0.03, 0.36, 0.5); // the turning lens: two bright panels on a frame
    add(new THREE.CylinderGeometry(0.36, 0.36, 0.5, 12, 1, true), std(0x9fd8ff, 0.9, 0.1, { transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }), 0, 1.15, 0, 1, 1, 1); for (let i = 0; i < 8; i++) add(box, iron, Math.cos(i / 8 * TAU) * 0.36, 1.15, Math.sin(i / 8 * TAU) * 0.36, 0.022, 0.5, 0.022);
    add(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 12), iron, 0, 1.42, 0, 1, 1, 1); add(new THREE.ConeGeometry(0.46, 0.4, 12), iron, 0, 1.64, 0, 1, 1, 1); add(ball, iron, 0, 1.86, 0, 0.06, 0.06, 0.06); add(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 4), iron, 0, 2.02, 0, 1, 1, 1);
    // the keeper's house on the shelf to the right, and a jetty to the left
    const wall = std(0xd8cfc0, 0.05, 0.85), roofM = std(0x4a2a2e, 0.1, 0.8, { flatShading: true }), wood = std(0x3a2c24, 0.05, 0.9);
    add(box, wall, 2.55, -1.08, 0.55, 1.25, 0.56, 0.85); const roof = add(new THREE.CylinderGeometry(0.5, 0.5, 1.35, 3), roofM, 2.55, -0.66, 0.55, 1, 1, 0.56); roof.rotation.set(-PI / 2, 0, PI / 2); add(box, std(0x6a6470, 0.1, 0.9), 2.95, -0.52, 0.5, 0.14, 0.34, 0.14);
    this.win = []; for (const x of [2.2, 2.88]) { add(box, iron, x, -1.04, 0.985, 0.2, 0.22, 0.03); const wm = glow(1, 0.78, 0.4, 1.7); this.win.push(wm); add(box, wm, x, -1.04, 0.995, 0.14, 0.16, 0.03); } // each window has its own fire behind it add(box, wood, 2.55, -1.14, 0.985, 0.17, 0.4, 0.03);
    for (let i = 0; i < 7; i++) add(box, wood, -2.3 - i * 0.44, -1.5, 0.9, 0.4, 0.05, 0.62); for (let i = 0; i < 4; i++) for (const z of [0.62, 1.18]) add(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 5), wood, -2.3 - i * 0.88, -2.1, z, 1, 1, 1); add(new THREE.CylinderGeometry(0.014, 0.014, 0.5, 4), iron, -4.9, -1.22, 1.15, 1, 1, 1); this.jl = add(ball, glow(1, 0.75, 0.4, 2.4), -4.9, -0.95, 1.15, 0.045, 0.045, 0.045);
    // a small boat moored off the end of the jetty
    const bt = this.boat = new THREE.Group(); bt.position.set(-5.8, -1.66, 1.55); lh.add(bt); put(bt, box, wood, 0, 0.1, 0, 0.95, 0.2, 0.34); put(bt, new THREE.ConeGeometry(0.17, 0.42, 4), wood, -0.68, 0.1, 0, 1, 1, 1, PI / 2); put(bt, box, std(0x8a7a66, 0.05, 0.9), 0, 0.21, 0, 0.99, 0.03, 0.38); put(bt, new THREE.CylinderGeometry(0.018, 0.018, 0.95, 5), wood, 0.05, 0.68, 0, 1, 1, 1); put(bt, box, std(0xd8d0c0, 0, 0.9), 0.05, 0.42, 0, 0.6, 0.07, 0.07); put(bt, ball, glow(1, 0.8, 0.45, 2.2), -0.3, 0.38, 0.1, 0.035, 0.035, 0.035);
    this.lampL = new THREE.PointLight(0xffd9a0, 9, 11, 1.6); this.lampL.position.set(0, 1.2, 1.4); lh.add(this.lampL);
    lh.position.set(W / 2, 0, -1.6); this.scene.add(lh);
    // the water in front of the rock's foot, drawn with the same sea code, with foam along the waterline
    this.water = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: U, vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: NOISE + SEA + `varying vec3 vW; uniform vec2 res; uniform float top; void main(){ vec2 uv = gl_FragCoord.xy / res; vec2 p = vec2((uv.x - 0.5) * asp, uv.y); vec3 col = seaCol(p, min(uv.y, sea * 0.999)); float dd = top - vW.y, wx = vW.x - ${(W / 2).toFixed(1)};
        float nz = noise(vec2(wx * 2.6 + t * 0.35, dd * 9.0 - t * 0.7)), near = 1.0 - smoothstep(4.8, 7.5, abs(wx)); float foam = smoothstep(0.02, 0.12, dd + (nz - 0.5) * 0.16) * smoothstep(0.5, 0.14, dd) * smoothstep(0.3, 0.75, nz) * near;
        col += vec3(0.62, 0.68, 0.8) * foam * (0.55 + stm * 0.35); gl_FragColor = vec4(col, max(smoothstep(0.0, 0.2, dd + (nz - 0.5) * 0.14), foam)); }` }));
    this.water.position.set(W / 2, U.top.value - 15, 1.3); this.water.scale.set(160, 30, 1); this.water.renderOrder = 2; this.scene.add(this.water);

    // ---- beams
    const beamMat = (frag, u) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: u, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: NOISE + frag });
    this.swU = { t: { value: 0 } }; this.sweep = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0), beamMat('varying vec2 vUv; uniform float t; void main(){ float y = abs(vUv.y - 0.5) * 2.0; float w = mix(0.06, 1.0, vUv.x); float a = pow(max(0.0, 1.0 - y / w), 1.6) * (1.0 - vUv.x * 0.75) * (0.75 + 0.25 * noise(vec2(vUv.x * 30.0 - t * 2.0, y * 4.0))); gl_FragColor = vec4(vec3(1.0, 0.92, 0.62) * a * 0.55, 1.0); }', this.swU)); this.sweep.renderOrder = 5; this.sweep.scale.set(34, 3.4, 1); this.scene.add(this.sweep);
    this.colU = { t: { value: 0 }, a: { value: 0 } }; this.col = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), beamMat('varying vec2 vUv; uniform float t, a; void main(){ float x = abs(vUv.x - 0.5) * 2.0; float n = noise(vec2(vUv.x * 9.0, vUv.y * 22.0 - t * 5.0)); float c = pow(max(0.0, 1.0 - x), 1.3) * (0.6 + 0.6 * n) + pow(max(0.0, 1.0 - x), 9.0) * 1.4; gl_FragColor = vec4(vec3(1.0, 0.93, 0.66) * c * a * 0.55, 1.0); }', this.colU)); this.col.renderOrder = 6; this.col.visible = false; this.scene.add(this.col);

    // ---- the flock: one draw call per kind. Facets are shaded from the screen-space normal; shots, embers and
    // blasts (BL) and the two lighthouse beams (bm) light the birds near them.
    this.CAP = 96; this.birdU = { t: { value: 0 }, BL: { value: [0, 1, 2, 3, 4, 5].map(() => new THREE.Vector4(0, 0, 0, 0)) }, BC: { value: [0, 1, 2, 3, 4, 5].map(() => new THREE.Vector3()) }, bm: { value: new THREE.Vector4(0, 0, 1.57, 0) } };
    const birdMat = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: this.birdU,
      vertexShader: `attribute vec3 at; attribute vec4 iP; attribute vec4 iS; attribute vec4 iC; uniform float t; uniform vec4 BL[6]; uniform vec3 BC[6]; uniform vec4 bm; varying vec3 vC; varying vec3 vA; varying float vG; varying vec3 vV; varying vec3 vL;
        void main(){ vec3 p = position; float wt = at.x, f = sin(t * iS.z + iS.y); p.z += wt * f * 0.55 + wt * wt * sin(t * iS.z + iS.y - 0.9) * 0.16; p.y -= wt * abs(f) * 0.12; p.x *= 1.0 - wt * abs(f) * 0.18; p.x *= iS.w; float c = cos(iP.w), s = sin(iP.w); vec2 q = vec2(p.x * c - p.y * s, p.x * s + p.y * c) * iS.x; vec3 w = iP.xyz + vec3(q, p.z * iS.x);
          vec3 l = vec3(0.0); for (int i = 0; i < 6; i++) { vec2 d = w.xy - BL[i].xy; l += BC[i] * BL[i].z / (1.0 + dot(d, d) * 0.9); }
          l += vec3(1.0, 0.92, 0.65) * bm.y * (1.0 - smoothstep(0.4, 2.6, abs(w.x - bm.x))) * 0.9; vec2 lv = w.xy - vec2(${(W / 2).toFixed(1)}, 1.15); float al = lv.x * cos(bm.z) + lv.y * sin(bm.z), pe = abs(lv.x * sin(bm.z) - lv.y * cos(bm.z)); l += vec3(1.0, 0.9, 0.6) * step(0.0, al) * exp(-pe * pe / (0.5 + al * 0.1)) * 0.5;
          vC = iC.rgb; vA = at; vG = iC.a; vL = l; vec4 mv = viewMatrix * vec4(w, 1.0); vV = mv.xyz; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vC; varying vec3 vA; varying float vG; varying vec3 vV; varying vec3 vL;
        void main(){ vec3 n = normalize(cross(dFdx(vV), dFdy(vV))); if (n.z < 0.0) n = -n; float dif = 0.55 + 0.55 * max(0.0, dot(n, normalize(vec3(-0.45, 0.5, 0.72)))), rim = pow(1.0 - n.z, 2.0);
          vec3 base = vC * vC * (0.35 + 0.65 * vA.y * vA.y); vec3 c = base * dif * (0.55 + 0.5 * vA.x) + vC * vC * pow(vA.x, 3.0) * 0.9 + vec3(0.55, 0.5, 0.9) * rim * 0.12 + vL * (0.2 + base * 0.9);
          c += vec3(1.0, 0.95, 0.8) * vA.z * 2.6; c = mix(c, vec3(2.4), vG); gl_FragColor = vec4(c, 1.0); }` });
    this.flock = {}; for (const k of Object.keys(SHAPE)) { const g = birdGeo(SHAPE[k]), f = { P: new Float32Array(this.CAP * 4), S: new Float32Array(this.CAP * 4), C: new Float32Array(this.CAP * 4), n: 0 }; f.aP = new THREE.InstancedBufferAttribute(f.P, 4); f.aS = new THREE.InstancedBufferAttribute(f.S, 4); f.aC = new THREE.InstancedBufferAttribute(f.C, 4); for (const a of [f.aP, f.aS, f.aC]) a.setUsage(THREE.DynamicDrawUsage); g.setAttribute('iP', f.aP); g.setAttribute('iS', f.aS); g.setAttribute('iC', f.aC); g.instanceCount = 0; f.mesh = new THREE.Mesh(g, birdMat); f.mesh.frustumCulled = false; f.mesh.renderOrder = 10; this.scene.add(f.mesh); this.flock[k] = f; }

    // ---- the Roost: armour plates over glowing ribs, an iris round its furnace, three-jointed wings, fans, talons
    const ro = this.roost = new THREE.Group(), rm = std(0x3a2a44, 0.55, 0.45, { flatShading: true }), rm2 = std(0x5a4263, 0.7, 0.35, { flatShading: true }), rd = std(0x17121d, 0.4, 0.7, { flatShading: true }), rg = glow(1, 0.6, 0.25, 2.6), rr = glow(1, 0.3, 0.14, 2.2), radd = (geo, mat, x, y, z, sx, sy, sz, rz = 0) => put(ro, geo, mat, x, y, z, sx, sy, sz, rz);
    radd(new THREE.IcosahedronGeometry(1, 1), rm, 0, 0, 0, 2.3, 1.5, 1.6); radd(new THREE.ConeGeometry(0.75, 1.7, 6), rm2, 0, -1.55, 0.25, 1, 1, 0.8, PI); radd(new THREE.IcosahedronGeometry(1, 0), rd, 0, 0.75, -0.5, 1.5, 0.9, 1.0);
    this.roFurn = radd(new THREE.SphereGeometry(1, 16, 10), rg, 0, -0.5, 0.9, 0.7, 0.5, 0.5); this.roIris = new THREE.Group(); this.roIris.position.set(0, -0.5, 1.32); ro.add(this.roIris); put(this.roIris, new THREE.TorusGeometry(0.62, 0.07, 6, 20), rd, 0, 0, 0, 1.15, 0.85, 1); for (let i = 0; i < 6; i++) { const m = put(this.roIris, box, rd, Math.cos(i / 6 * TAU) * 0.5, Math.sin(i / 6 * TAU) * 0.37, 0.02, 0.32, 0.09, 0.04, i / 6 * TAU + 0.5); m.userData.a = i / 6 * TAU; }
    this.roRibs = new THREE.Group(); ro.add(this.roRibs); for (let i = 0; i < 6; i++) put(this.roRibs, box, rr, (i - 2.5) * 0.52, 0.35 - Math.abs(i - 2.5) * 0.1, 1.28 - Math.abs(i - 2.5) * 0.12, 0.09, 0.95, 0.06, (i - 2.5) * -0.08); this.roRibs.visible = false;
    this.roArm = []; for (const s of [1, -1]) { this.roArm.push(radd(box, rm2, s * 1.05, 0.55, 1.34, 1.55, 0.95, 0.13, s * 0.28)); this.roArm.push(radd(box, rm2, s * 1.25, -0.42, 1.2, 0.95, 0.6, 0.12, s * -0.35)); }
    this.roW = []; for (const s of [1, -1]) { const g1 = new THREE.Group(); g1.position.set(s * 1.9, 0.5, 0); ro.add(g1); put(g1, box, rm, s * 1.55, 0, 0, 3.2, 0.2, 1.5); put(g1, box, rm2, s * 0.9, 0.5, 0.2, 2.1, 0.12, 0.8, s * 0.35);
      const g2 = new THREE.Group(); g2.position.set(s * 3.1, 0, 0); g1.add(g2); put(g2, box, rm, s * 1.2, 0, 0, 2.5, 0.16, 1.2); for (let i = 0; i < 5; i++) put(g2, box, i % 2 ? rm2 : rd, s * (0.35 + i * 0.5), -0.8 - (i % 2) * 0.16, 0, 0.36, 1.5, 0.05, s * (0.1 + i * 0.07));
      const g3 = new THREE.Group(); g3.position.set(s * 2.4, 0, 0); g2.add(g3); put(g3, box, rm, s * 0.85, 0, 0, 1.75, 0.12, 0.8); for (let i = 0; i < 4; i++) put(g3, box, i % 2 ? rd : rm2, s * (0.3 + i * 0.45), -0.7 - i * 0.1, 0, 0.3, 1.5 + i * 0.12, 0.04, s * (0.3 + i * 0.14)); put(g3, ball, rg, s * 1.75, 0, 0.1, 0.1, 0.1, 0.1);
      this.roW.push({ s, g1, g2, g3 }); radd(new THREE.SphereGeometry(1, 10, 8), rg, s * 1.7, -1.0, 0.5, 0.26, 0.26, 0.26); }
    this.roFans = []; for (const s of [1, -1]) { const h = radd(new THREE.CylinderGeometry(0.52, 0.52, 0.3, 12), rd, s * 1.45, 0.95, 0.95, 1, 1, 1); h.rotation.x = PI / 2; radd(ball, rr, s * 1.45, 0.95, 1.02, 0.4, 0.4, 0.05); const f = new THREE.Group(); f.position.set(s * 1.45, 0.95, 1.12); ro.add(f); for (let i = 0; i < 4; i++) put(f, box, rm2, 0, 0, 0, 0.94, 0.13, 0.04, i * PI / 4); this.roFans.push(f); }
    this.roTal = []; for (const s of [1, -1]) for (let i = 0; i < 3; i++) { const g = new THREE.Group(); g.position.set(s * (1.0 + i * 0.42), -1.1, 0.25); ro.add(g); put(g, new THREE.ConeGeometry(0.11, 0.85, 5), rd, 0, -0.42, 0, 1, 1, 1, PI); g.userData = { s, i }; this.roTal.push(g); }
    for (let i = 0; i < 7; i++) radd(new THREE.ConeGeometry(0.18, 0.9, 6), rm, (i - 3) * 0.6, 1.5, 0, 1, 1 + (i % 2) * 0.5, 1);
    this.roTail = []; for (let i = 0; i < 5; i++) { const g = new THREE.Group(); g.position.set((i - 2) * 0.42, 1.25, -0.5); ro.add(g); put(g, box, i % 2 ? rm2 : rm, 0, 0.8, 0, 0.3, 1.6, 0.05); g.userData.b = (i - 2) * -0.3; this.roTail.push(g); } ro.visible = false; this.scene.add(ro);

    // ---- the ship: a small original interceptor, nose up
    const sh = this.ship = new THREE.Group(), hull = std(0xe9eef3, 0.5, 0.3), hull2 = std(0xaab4c0, 0.6, 0.35), dk = std(0x23262e, 0.6, 0.5), stripe = std(0xff8a3a, 0.3, 0.5, { emissive: 0x5a2206 }), glass = std(0x66d0ff, 0.9, 0.08, { emissive: 0x0d3a52 }), gl = glow(0.32, 1, 0.85, 2.6), sadd = (geo, mat, x, y, z, sx, sy, sz, rz = 0) => put(sh, geo, mat, x, y, z, sx, sy, sz, rz);
    sadd(new THREE.ConeGeometry(0.2, 1.0, 10), hull, 0, 0.42, 0, 1, 1, 0.85); sadd(new THREE.CylinderGeometry(0.2, 0.25, 0.62, 10), hull, 0, -0.39, 0, 1, 1, 0.85); sadd(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 4), dk, 0, 1.02, 0, 1, 1, 1);
    sadd(ball, glass, 0, 0.12, 0.13, 0.1, 0.27, 0.09); sadd(box, dk, 0, 0.12, 0.1, 0.24, 0.6, 0.06); sadd(box, dk, 0, -0.3, 0.17, 0.035, 0.6, 0.03); for (const y of [-0.12, -0.42, -0.62]) sadd(box, dk, 0, y, 0.19, 0.4, 0.014, 0.03); sadd(box, stripe, 0, 0.6, 0.12, 0.2, 0.05, 0.04);
    for (const s of [1, -1]) { sadd(box, hull, s * 0.44, -0.3, 0, 0.74, 0.36, 0.06, -s * 0.5); sadd(box, hull2, s * 0.3, -0.5, 0.01, 0.42, 0.2, 0.07, -s * 0.2); sadd(box, stripe, s * 0.5, -0.27, 0.04, 0.34, 0.05, 0.02, -s * 0.5); sadd(box, dk, s * 0.4, -0.38, 0.04, 0.5, 0.012, 0.02, -s * 0.5);
      sadd(box, dk, s * 0.72, -0.5, 0, 0.12, 0.72, 0.12); sadd(new THREE.ConeGeometry(0.06, 0.22, 6), dk, s * 0.72, -0.03, 0, 1, 1, 1); sadd(box, gl, s * 0.72, -0.2, 0.065, 0.04, 0.2, 0.02); sadd(ball, glow(s > 0 ? 0.2 : 1, s > 0 ? 1 : 0.2, 0.25, 2.2), s * 0.74, -0.84, 0.06, 0.035, 0.035, 0.035);
      sadd(box, hull2, s * 0.17, -0.62, -0.12, 0.05, 0.36, 0.3, 0); sadd(box, hull, s * 0.2, -0.05, 0.02, 0.12, 0.5, 0.1, -s * 0.12); sadd(new THREE.CylinderGeometry(0.075, 0.09, 0.16, 8), dk, s * 0.12, -0.76, 0, 1, 1, 1); sadd(ball, gl, s * 0.12, -0.84, 0, 0.06, 0.05, 0.06); sadd(ball, gl, s * 0.72, -0.88, 0, 0.07, 0.1, 0.07); }
    this.scene.add(sh);

    // ---- debris: folded shards and feathers, lit, tumbling, falling into the sea
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0, 0.95, 0.14, 0.5, 0, 0, -0.5, 0, 0, 0, -0.3, 0.12], 3)); dg.computeVertexNormals();
    this.DCAP = 340; this.debM = new THREE.InstancedMesh(dg, std(0xffffff, 0.45, 0.45, { flatShading: true, side: THREE.DoubleSide }), this.DCAP); this.debM.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.debM.count = 0; this.debM.frustumCulled = false; this.debM.setColorAt(0, new THREE.Color(1, 1, 1)); this.scene.add(this.debM); this.dummy = new THREE.Object3D(); this.tc = new THREE.Color();
    this.xl = [0, 1].map(() => { const l = new THREE.PointLight(0xffffff, 0, 16, 1.4); this.scene.add(l); return l; });
    this.smoke = new Batch(500, false); this.add = new Batch(1800); this.scene.add(this.smoke.mesh, this.add.mesh);
  }
  resize(w, h, scale = 1) { const pr = Math.min(window.devicePixelRatio || 1, 2) * scale, pw = Math.max(240, Math.round(w * pr)), ph = Math.max(240, Math.round(h * pr)); this.r.setPixelRatio(1); this.r.setSize(pw, ph, false); this.post.resize(pw, ph, 4); const asp = w / h; this.cam.aspect = asp; const d = Math.max((H / 2 + 0.7) / TANH, (W / 2 + 0.4) / (TANH * asp)); this.camY = H / 2 - 1.1; this.cam.position.set(W / 2, this.camY, d); this.cam.updateProjectionMatrix(); this.camD = d; this.asp = asp; this.visX = d * TANH * asp; this.skyU.asp.value = asp; this.skyU.res.value.set(pw, ph); this.post.mOut.uniforms.aspect.value = asp; this.hi = scale >= 0.8; this.veil.visible = this.hi;
    this.cam.updateMatrixWorld(true); const v = new THREE.Vector3(W / 2, 0.2, 0).project(this.cam), sea = v.y * 0.5 + 0.5; this.skyU.sea.value = Number.isFinite(sea) ? Math.max(0.03, sea) : 0.08; const lp = this.uv(W / 2, 1.15); if (Number.isFinite(lp[1])) this.skyU.lamp.value.set((lp[0] - 0.5) * asp, lp[1]); }
  uv(x, y) { const v = new THREE.Vector3(x, y, 0).project(this.cam); return [v.x * 0.5 + 0.5, v.y * 0.5 + 0.5]; }
  spark(x, y, n, spd, c, size = 0.12, life = 0.5, shape = 0, grav = 0) { for (let i = 0; i < n; i++) { if (this.parts.length > 1100) return; const a = rand() * TAU, v = spd * (0.3 + rand() * 0.7); this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: life * (0.5 + rand() * 0.7), m: life, s: size * (0.6 + rand() * 0.8), r: c[0], g: c[1], b: c[2], sh: shape, gr: grav }); } }
  ring(x, y, c, grow) { this.parts.push({ x, y, vx: 0, vy: 0, l: 0.32, m: 0.32, s: 0.3, r: c[0], g: c[1], b: c[2], sh: 1, gr: 0, grow }); }
  puff(x, y, n, spread, size, life, al = 0.3, shade = 0.16) { for (let i = 0; i < n; i++) { if (this.parts.length > 1100) return; const a = rand() * TAU, v = spread * rand(); this.parts.push({ x: x + Math.cos(a) * v * 0.3, y: y + Math.sin(a) * v * 0.3, vx: Math.cos(a) * v, vy: Math.sin(a) * v + 0.5, l: life * (0.7 + rand() * 0.6), m: life, s: size * (0.6 + rand() * 0.7), r: shade * 1.05, g: shade * 0.9, b: shade * 1.25, sm: 1, al, gr: 0.35, grow: size * 1.6, seed: rand() * 9 }); } }
  light(x, y, c, i, dec = 5) { this.lights.push({ x, y, r: c[0], g: c[1], b: c[2], i, dec }); if (this.lights.length > 8) this.lights.shift(); }
  // lit pieces thrown from a kill: they tumble, fall under gravity and splash where they meet the water
  debris(x, y, n, spd, c) { for (let i = 0; i < n; i++) { if (this.deb.length >= this.DCAP) return; const a = rand() * TAU, v = spd * (0.25 + rand() * 0.75), k = rand(), col = k < 0.45 ? [c[0] * 0.75, c[1] * 0.75, c[2] * 0.75] : k < 0.8 ? [0.2, 0.2, 0.27] : [0.85, 0.85, 0.9]; this.deb.push({ x, y, z: (rand() - 0.5) * 0.4, vx: Math.cos(a) * v, vy: Math.sin(a) * v + 2, vz: (rand() - 0.5) * 2, rx: rand() * TAU, ry: rand() * TAU, rz: rand() * TAU, wx: (rand() - 0.5) * 14, wy: (rand() - 0.5) * 14, wz: (rand() - 0.5) * 9, s: 0.13 + rand() * 0.24, land: 0.1 - rand() * 1.7, r: col[0], g: col[1], b: col[2], drag: 0.6 + rand() * 1.4 }); } }
  splash(x, y) { if (this.parts.length > 1000) return; for (let i = 0; i < 3; i++) this.parts.push({ x, y, vx: (rand() - 0.5) * 1.6, vy: 1.6 + rand() * 2.2, l: 0.4, m: 0.4, s: 0.07, r: 0.7, g: 0.85, b: 1, sh: 0, gr: -9 }); this.parts.push({ x, y, vx: 0, vy: 0, l: 0.5, m: 0.5, s: 0.12, r: 0.6, g: 0.75, b: 0.9, sh: 1, gr: 0, grow: 0.9, fy: 0.3 }); }
  // feathers: light pieces that drift and sway down instead of falling
  feathers(x, y, n, c, life = 7) { for (let i = 0; i < n; i++) { if (this.deb.length >= this.DCAP - 40 || this.fcount > 110) return; const a = rand() * TAU, v = 0.6 + rand() * 2.2, wh = rand() < 0.35; this.fcount++; this.deb.push({ fe: 1, life: life * (0.6 + rand() * 0.6), ph: rand() * TAU, x, y, z: (rand() - 0.5) * 0.4, vx: Math.cos(a) * v, vy: Math.sin(a) * v + 0.8, vz: 0, rx: rand() * TAU, ry: rand() * TAU, rz: rand() * TAU, wx: (rand() - 0.5) * 3, wy: (rand() - 0.5) * 5, wz: (rand() - 0.5) * 2.4, s: 0.2 + rand() * 0.16, land: -1.4, r: wh ? 0.85 : c[0] * 0.7, g: wh ? 0.86 : c[1] * 0.7, b: wh ? 0.92 : c[2] * 0.7, drag: 2.4 + rand() }); } }
  // where the wreck of the Roost meets the water: a column of spray, a ring of foam that spreads, a wave of light
  impact(x) { const fo = this.pal.fo, y = -1.5; for (let i = 0; i < 70; i++) { if (this.parts.length > 1150) break; const a = (rand() - 0.5) * 1.5; this.parts.push({ x: x + (rand() - 0.5) * 2.4, y, vx: Math.sin(a) * (2 + rand() * 6), vy: 5 + rand() * 12, l: 0.9 + rand() * 0.8, m: 1.7, s: 0.1 + rand() * 0.14, r: fo[0], g: fo[1], b: fo[2], sh: 0, gr: -11 }); }
    this.puff(x, y + 0.6, 12, 4, 1.4, 2.4, 0.3, 0.62); this.ring(x, y + 0.3, fo, 9); this.ring(x, y + 0.3, [1, 0.7, 0.4], 5); this.spark(x, y + 0.5, 24, 9, [1, 0.6, 0.25], 0.14, 0.8, 3, -6); this.debris(x, y + 0.8, 14, 9, COL.roost);
    this.light(x, 0.5, [1, 0.75, 0.5], 4, 2.2); const u = this.uv(x, 0); this.post.shock(u[0], Math.max(0.02, u[1]), 0.06); this.shake = Math.max(this.shake, 1.5); this.flash = Math.max(this.flash, 0.3 * this.opt.flash); this.rip.x = x; this.rip.r = 0.02; this.rip.a = 1.4; }
  // flames, embers and black smoke at fixed points on the Roost, turned with it
  burn(x, y, rot, k, t, B, live) { const c = Math.cos(rot), s = Math.sin(rot), n = k > 0.8 ? 4 : 2;
    for (let i = 0; i < n; i++) { const o = FIRE[i], px = x + o[0] * c - o[1] * s, py = y + o[0] * s + o[1] * c, fl = 0.7 + 0.3 * Math.sin(t * 27 + i * 2.1) * Math.sin(t * 13.3 + i); B.add(px, py + 0.3 * fl, 1, 0.42 * fl, 0.85 * fl, 0, 1, 0.5, 0.12, 0.9, 2); B.add(px, py + 0.2, 1, 1.5, 1.7, 0, 1, 0.42, 0.1, 0.3 * Math.min(1, k), 0);
      if (live && (this.frameN + i * 2) % 6 === 0) { this.parts.push({ x: px, y: py + 0.4, vx: (rand() - 0.5) * 1.6, vy: 2 + rand() * 2.5, l: 0.8, m: 0.8, s: 0.08, r: 1, g: 0.6, b: 0.2, sh: 0, gr: 1.5 }); this.puff(px, py + 0.7, 1, 0.5, 0.55, 1.8, 0.4, 0.06); } }
    if (live && this.frameN % 24 === 0) this.light(x, y, [1, 0.55, 0.2], 0.8 * Math.min(1, k), 5); }
  // the Roost has been killed: its wreck tumbles out of the sky, burning, and goes into the sea
  drawCrash(dt, t, B) { const c = this.crash, ro = this.roost; c.vy -= 7 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.wr * dt;
    ro.visible = true; ro.position.set(c.x, c.y, 0); ro.rotation.z = c.rot; for (const w of this.roW) { w.g1.rotation.z = w.s * (0.95 + Math.sin(t * 13 + w.s) * 0.06); w.g2.rotation.z = w.s * 0.8; w.g3.visible = w.s > 0; w.g3.rotation.z = w.s * 0.5; }
    for (const m of this.roArm) m.visible = false; this.roRibs.visible = (this.frameN & 2) > 0; const pu = 0.6 + rand() * 0.6; this.roFurn.scale.set(0.7 * pu, 0.5 * pu, 0.5);
    this.burn(c.x, c.y, c.rot, 1.3, t, B, dt > 0); if (dt > 0 && this.frameN % 2 === 0) this.puff(c.x, c.y + 0.8, 1, 0.8, 0.9, 2.4, 0.45, 0.05);
    if (c.y < -1.3) { this.crash = null; ro.visible = false; this.impact(c.x); } }
  // time of day, weather and everything in the sky and on the sea that follows from them
  sky(S, dt, t) {
    const U = this.skyU, asp = this.asp || 1, w = Math.max(1, S.wave | 0), name = S.kind === 'roost' ? 'storm' : ['dusk', 'night', 'dawn'][(Math.floor((w - 1) / 5) * 2 + ((w - 1) % 5 < 2 ? 0 : 1)) % 3], T = TOD[name], P = this.pal;
    if (S.tick < this.lastTick) { this.crash = null; this.rip.a = 0; this.bolt = null; U.lt.value.y = 0; } this.lastTick = S.tick; // a new game: clear what was left of the old one
    const k = this.pal0 ? 1 : 1 - Math.exp(-dt * 0.28); this.pal0 = false;
    for (const q in T) { const a = T[q]; if (typeof a === 'number') P[q] += (a - P[q]) * k; else if (Array.isArray(a)) for (let i = 0; i < a.length; i++) P[q][i] += (a[i] - P[q][i]) * k; }
    for (const q of ['h0', 'h1', 'h2', 'h3', 'sN', 'sF', 'gl', 'fo', 'cl0', 'cl1', 'hz']) U[q].value.fromArray(P[q]); U.vc.value.fromArray(P.vc); U.stK.value = P.stK; U.stm.value = P.stm; U.pg.value = P.pg;
    U.mo.value.set(0.15 * asp + 0.1, 0.8, P.moon, 0); U.su.value.set(-(0.15 * asp + 0.12), U.sea.value + 0.03, P.sun, 0.055); U.suC.value.set(1, 0.82, 0.55);
    this.hemi.color.setRGB(P.hemi[0], P.hemi[1], P.hemi[2]); this.key.color.setRGB(P.key[0], P.key[1], P.key[2]); this.key.intensity = P.keyI;
    // the painting for this time of day fades in over the one before it
    const tx = this.tex[T.img]; if (tx && this.pbName !== T.img) { const ar = tx.image.width / tx.image.height; if (!this.pbName) { U.pa.value = tx; U.pas.value.x = ar; U.px.value = 1; U.pm.value = 1; } else { if (U.px.value > 0.5) { U.pa.value = U.pb.value; U.pas.value.x = U.pas.value.y; } U.px.value = 0; } U.pb.value = tx; U.pas.value.y = ar; this.pbName = T.img; }
    U.px.value = Math.min(1, U.px.value + dt * 0.2);
    U.au.value += ((w >= 10 && name === 'night' ? 1 : w >= 10 && name === 'dusk' ? 0.55 : 0) - U.au.value) * Math.min(1, dt * 0.4); // the aurora comes with the high waves
    // lightning in the storm: it lights the cloud, the sea, the birds and the models. LESS FLASH keeps it faint.
    let li = 0; const lessK = 0.2 + 0.8 * this.opt.flash;
    if (P.stm > 0.6 && dt > 0 && (this.boltT -= dt) <= 0) { this.boltT = 3 + rand() * 6; const x = (rand() - 0.5) * asp * 0.85; this.bolt = { x, age: 0, seed: rand() * 90, yb: U.sea.value + 0.03 + rand() * 0.3 }; this.flash = Math.max(this.flash, 0.07 * this.opt.flash); this.light(W / 2 + (x / asp) * 2 * (this.visX || 9), 15, [0.75, 0.82, 1], 2.4 * this.opt.flash, 7); }
    if (this.bolt) { const b = this.bolt; b.age += dt; li = (Math.exp(-b.age * 11) + 0.7 * Math.exp(-Math.pow((b.age - 0.16) * 16, 2))) * lessK; U.lt.value.set(b.x, li, b.seed, b.yb); if (b.age > 0.6) { this.bolt = null; U.lt.value.y = 0; li = 0; } }
    this.hemi.intensity = P.hemiI * (1 + li * 1.2);
    if (dt <= 0) return;
    // shooting stars on clear dark skies
    if (P.stK > 0.7 && (this.starT -= dt) <= 0) { this.starT = 5 + rand() * 9; const dir = rand() < 0.5 ? -1 : 1; this.parts.push({ x: W / 2 + (rand() - 0.5) * (this.visX || 9) * 1.4, y: 16 + rand() * 6, vx: dir * (20 + rand() * 10), vy: -(7 + rand() * 6), l: 0.55, m: 0.55, s: 1.3, th: 0.3, r: 0.85, g: 0.92, b: 1, sh: 3, gr: 0 }); }
    // the swell breaking on the rock, and smoke from the keeper's chimney leaning with the wind
    if ((this.sprayT -= dt * (1 + P.stm * 1.8)) <= 0) { this.sprayT = 1.2 + rand() * 2.2; const s = rand() < 0.5 ? -1 : 1, x = W / 2 + s * (3.4 + rand() * 1.9), y = -1.5, n = Math.round(8 + P.stm * 10); for (let i = 0; i < n; i++) this.parts.push({ x: x + (rand() - 0.5) * 0.6, y, vx: s * (0.4 + rand() * 2.2), vy: (2.5 + rand() * 3.5) * (1 + P.stm * 0.5), l: 0.7 + rand() * 0.3, m: 1, s: 0.07 + rand() * 0.07, r: P.fo[0], g: P.fo[1], b: P.fo[2], sh: 0, gr: -9 }); this.puff(x, y + 0.2, 3, 1.2, 0.5, 1.1, 0.22, 0.6); }
    if (this.frameN % 20 === 0 && this.parts.length < 900) this.parts.push({ x: W / 2 + 2.95, y: -0.3, vx: 0.3 + P.stm * 1.4 + rand() * 0.2, vy: 0.55 + rand() * 0.3, l: 3.4, m: 3.4, s: 0.12, r: 0.34, g: 0.31, b: 0.4, sm: 1, al: 0.26, gr: 0.2, grow: 0.7, seed: rand() * 9 });
    // the flock's shadow on the water under it, and the ring spreading from where the Roost went in
    let sx = 0, sn = 0; for (const e of S.foes) if (!e.dead && e.type !== 'roost') { sx += e.x; sn++; } this.fsx += ((sn ? sx / sn : W / 2) - this.fsx) * Math.min(1, dt * 3); this.fsk += (Math.min(1, sn / 16) - this.fsk) * Math.min(1, dt * 2);
    U.fs.value.set((this.uv(this.fsx, 0)[0] - 0.5) * asp, 0.09 + 0.05 * this.fsk, 0.32 * this.fsk * (1 - P.stm * 0.5) * (0.5 + 0.5 * Math.min(1, P.moon + P.sun)));
    const r = this.rip; if (r.a > 0.01) { r.r += dt * 0.16; r.a *= Math.exp(-dt * 0.8); const u = this.uv(r.x, -1.62); U.rip.value.set((u[0] - 0.5) * asp, Math.min(U.sea.value * 0.7, Math.max(0, u[1])), r.r, Math.min(1, r.a)); } else U.rip.value.w = 0;
  }
  event(f) {
    switch (f.k) {
      case 'boom': { const c = COL[f.type] || COL.finch, big = f.big ? 2 : 1, R = f.type === 'roost'; this.spark(f.x, f.y, 10 * big, 7 * big, c, 0.2, 0.55, 3, -6); this.spark(f.x, f.y, 5 * big, 3, [1, 1, 1], 0.32, 0.22); this.ring(f.x, f.y, c, 4 * big); this.spark(f.x, f.y, 4 * big, 3.5, [1, 0.6, 0.2], 0.07, 1.3, 0, -2.2);
        if (R) { const sg = f.x >= W / 2 ? 1 : -1, tx = W / 2 + sg * Math.min(7 + rand() * 3, Math.max(5.9, (this.visX || 9) - 2.5)), tf = Math.sqrt(2 * Math.max(1, f.y + 1.3) / 7); this.crash = { x: f.x, y: f.y, vx: (tx - f.x) / tf, vy: 0, rot: 0, wr: sg * (0.5 + rand() * 0.5) }; } else this.feathers(f.x, f.y, f.type === 'kite' ? 7 : f.type === 'heron' ? 5 : 4, c); // the wreck falls clear of the rock; smaller birds leave feathers
        this.debris(f.x, f.y, R ? 70 : f.type === 'kite' ? 12 : f.type === 'heron' ? 8 : 6, R ? 13 : 6.5, c); this.puff(f.x, f.y, R ? 18 : 3 * big, R ? 4 : 1.4, R ? 1.6 : 0.6 * big, R ? 2.6 : 1.6, R ? 0.42 : 0.34); this.light(f.x, f.y, [c[0] * 0.6 + 0.4, c[1] * 0.6 + 0.4, c[2] * 0.6 + 0.4], R ? 5 : 1.2 * big, R ? 1.6 : 4.5);
        const u = this.uv(f.x, f.y); if (f.big) { this.post.shock(u[0], u[1], R ? 0.07 : 0.025); this.shake = Math.max(this.shake, R ? 1.6 : 0.5); if (R) { this.flash = Math.max(this.flash, 0.7 * this.opt.flash); this.spark(f.x, f.y, 90, 14, [1, 0.7, 0.3], 0.3, 1.2, 3, -4); } } break; }
      case 'hit': this.spark(f.x, f.y, 4, 4, [1, 1, 1], 0.1, 0.2); this.light(f.x, f.y, [1, 1, 1], 0.5, 12); break;
      case 'die': { this.spark(f.x, f.y, 50, 11, [0.3, 1, 0.85], 0.22, 0.9, 3); this.spark(f.x, f.y, 24, 5, [1, 1, 1], 0.34, 0.5); this.ring(f.x, f.y, [0.3, 1, 0.85], 9); this.debris(f.x, f.y, 26, 9, [0.9, 0.93, 0.96]); this.puff(f.x, f.y, 7, 2, 0.8, 2); this.light(f.x, f.y, [0.5, 1, 0.9], 3.5, 2.4); const u = this.uv(f.x, f.y); this.post.shock(u[0], u[1], 0.05); this.shake = 1; this.flash = Math.max(this.flash, 0.3 * this.opt.flash); break; }
      case 'ember': this.spark(f.x, f.y, 18, 6, [1, 0.8, 0.3], 0.16, 0.5); this.ring(f.x, f.y, [1, 0.8, 0.3], 7); this.light(f.x, f.y, [1, 0.8, 0.35], 1.6, 4); break;
      case 'beam': this.flash = Math.max(this.flash, 0.16 * this.opt.flash); this.shake = Math.max(this.shake, 0.25); break;
      case 'graze': this.flash = Math.max(this.flash, 0.15 * this.opt.flash); break;
    }
  }
  frame(S, dt) {
    const t = (this.time += dt), B = this.add, p = S.p, U = this.skyU; this.frameN++; U.t.value = t; U.fl.value = p.beamT > 0 ? 1 : 0; this.birdU.t.value = t; const live = dt > 0 && this.frameN % 2 === 0;
    this.sky(S, dt, t); U.sw.value = S.sweep || 1.57;
    this.shake *= Math.exp(-dt * 7); const sk = this.shake * 0.3; this.cam.position.set(W / 2 + (rand() - 0.5) * sk, this.camY + (rand() - 0.5) * sk, this.camD);
    // lights: blasts fade, then the strongest go to the sea and sky, the birds and two real lights for the models
    let lw = 0; for (const l of this.lights) { l.i *= Math.exp(-dt * l.dec); if (l.i > 0.03) this.lights[lw++] = l; } this.lights.length = lw; const Ls = this.lights.slice().sort((a, b) => b.i - a.i), BL = this.birdU.BL.value, BC = this.birdU.BC.value; let bi = 0;
    for (let i = 0; i < 4; i++) { const l = Ls[i]; if (l) { const u = this.uv(l.x, l.y); U.L.value[i].set((u[0] - 0.5) * this.asp, u[1], l.i, 0); U.LC.value[i].set(l.r, l.g, l.b); BL[bi].set(l.x, l.y, l.i, 0); BC[bi++].set(l.r, l.g, l.b); } else U.L.value[i].set(0, 0, 0, 0); }
    for (const m of S.embers) if (bi < 6) { BL[bi].set(m.x, m.y, 0.7, 0); BC[bi++].set(1, 0.8, 0.35); } for (let i = S.shots.length - 1; i >= 0 && bi < 6; i--) { BL[bi].set(S.shots[i].x, S.shots[i].y, 0.5, 0); BC[bi++].set(0.4, 1, 0.9); } for (; bi < 6; bi++) BL[bi].set(0, 0, 0, 0);
    for (let i = 0; i < 2; i++) { const l = Ls[i], x = this.xl[i]; if (l) { x.position.set(l.x, l.y, 1.2); x.color.setRGB(l.r, l.g, l.b); x.intensity = l.i * 26; } else x.intensity = 0; }
    // beams
    this.swU.t.value = t; this.sweep.position.set(W / 2, 1.15, -0.8); this.sweep.rotation.z = S.sweep || 1.57; this.lamp.rotation.y = t * 2;
    // the lens turns and flares as a panel swings past; moths circle it; the house windows flicker; the boat rides the swell
    const la = t * 1.5, fc = Math.pow(Math.abs(Math.cos(la)), 20), stm = this.pal.stm, day = 1 - 0.6 * this.pal.sun; this.lens.rotation.y = la; this.lampL.intensity = 8 + Math.sin(t * 2) * 2.5 + fc * 5;
    B.add(W / 2, 1.15, -0.5, 1.15 + fc * 0.6, 1.15 + fc * 0.6, 0, 1, 0.9, 0.6, (0.5 + fc * 0.3) * day, 0); if (fc > 0.02) B.add(W / 2, 1.15, -0.5, 2.8 * fc, 0.22, 0, 1, 0.93, 0.7, fc * 0.8 * day, 3);
    if (this.hi) for (let i = 0; i < 9; i++) { const a = t * (1.3 + (i % 4) * 0.45) * (i % 2 ? 1 : -1) + i * 2.4, rr = 0.55 + 0.3 * Math.sin(t * 0.7 + i * 1.9); B.add(W / 2 + Math.cos(a) * rr, 1.15 + Math.sin(a * 1.3 + i) * 0.35, -0.5, 0.05, 0.05, 0, 1, 0.9, 0.7, 0.5 + 0.5 * Math.sin(t * 17 + i * 5), 0); }
    this.win.forEach((m, i) => { const away = Math.sin(t * 0.23 + i * 2.6) > 0.94 ? 0.3 : 1, k = 1.7 * away * (0.86 + 0.1 * Math.sin(t * 11 + i * 3) * Math.sin(t * 6.3 + i) + 0.04 * Math.sin(t * 29 + i)); m.color.setRGB(k, k * 0.78, k * 0.4); });
    this.boat.position.y = -1.66 + Math.sin(t * 1.25) * (0.05 + stm * 0.06); this.boat.rotation.z = Math.sin(t * 1.05 + 1) * (0.07 + stm * 0.1); B.add(W / 2 - 6.1, this.boat.position.y + 0.38, -0.05, 0.22, 0.22, 0, 1, 0.8, 0.45, 0.45, 0); B.add(W / 2 - 4.9, -0.95, -0.4, 0.3, 0.3, 0, 1, 0.75, 0.4, 0.5, 0);
    let ba = 0; if (p.beamT > 0) { ba = Math.min(1, p.beamT / 20) * Math.min(1, (150 - p.beamT) / 8 + 0.3); this.col.visible = true; this.col.position.set(p.beamX, H / 2 + 1, -0.3); this.col.scale.set(3.6, H + 6, 1); this.colU.t.value = t; this.colU.a.value = ba; } else this.col.visible = false; this.birdU.bm.value.set(p.beamX, ba, S.sweep || 1.57, 0);
    // the flock
    for (const k in this.flock) this.flock[k].n = 0; this.roost.visible = false;
    for (const e of S.foes) {
      if (e.dead) continue; const c = COL[e.type];
      if (e.type === 'roost') { this.drawRoost(e, t, B, live); continue; }
      const f = this.flock[e.type] || this.flock.finch, n = f.n; if (n >= this.CAP) continue; const j = n * 4, moving = Math.hypot(e.vx, e.vy) > 0.5, ang = moving ? Math.atan2(e.vy, e.vx) - PI / 2 : PI + Math.sin(t * 2 + e.ph) * 0.08, flapF = e.st === 'idle' ? 7 : e.st === 'stoop' ? 3 : 13;
      f.P[j] = e.x; f.P[j + 1] = e.y; f.P[j + 2] = 0; f.P[j + 3] = ang; f.S[j] = SIZE[e.type] || 0.7; f.S[j + 1] = e.ph; f.S[j + 2] = e.dz > 0 ? 4 : flapF; f.S[j + 3] = e.st === 'stoop' ? 0.72 : 1;
      f.C[j] = c[0]; f.C[j + 1] = c[1]; f.C[j + 2] = c[2]; f.C[j + 3] = e.hit > 0 ? 1 : e.dz > 0 ? 0.45 + Math.sin(t * 20 + e.ph) * 0.15 : 0; f.n++;
      B.add(e.x, e.y, 0.1, 0.9, 0.9, 0, c[0], c[1], c[2], e.st === 'stoop' ? 0.5 : 0.2, 0);
      if (e.st === 'stoop' && this.frameN % 2 === 0) this.parts.push({ x: e.x, y: e.y, vx: 0, vy: 0, l: 0.3, m: 0.3, s: 0.14, r: c[0], g: c[1], b: c[2], sh: 0, gr: 0 });
      if (e.st === 'stoop' && live && this.frameN % 8 === 0) this.feathers(e.x, e.y, 1, c, 2.4); // a stooping bird sheds feathers behind it
      if (e.dz > 0 && this.frameN % 5 === 0) this.spark(e.x, e.y, 1, 2, [1, 1, 0.8], 0.09, 0.4);
      if (e.hp < (TYPES[e.type] ? TYPES[e.type].hp : 1) && live && this.frameN % 8 === 0) this.puff(e.x, e.y, 1, 0.3, 0.22, 0.8, 0.22); // a wounded bird trails smoke
    }
    for (const k in this.flock) { const f = this.flock[k]; f.mesh.geometry.instanceCount = f.n; f.mesh.visible = f.n > 0; f.aP.needsUpdate = f.aS.needsUpdate = f.aC.needsUpdate = true; }
    if (this.crash) this.drawCrash(dt, t, B);
    // ship: rolls and yaws into its turns, engines flare with speed
    const sh = this.ship; sh.visible = p.alive && !(p.inv > 0 && (this.frameN & 4)); sh.position.set(p.x, 2, 0); sh.rotation.y = -p.vx * 0.065; sh.rotation.z = -p.vx * 0.012;
    if (p.alive) { const f = 0.7 + rand() * 0.5 + Math.abs(p.vx) * 0.03, lean = -p.vx * 0.012; B.add(p.x - lean * 1.0, 1.02, 0, 0.14, 0.62 * f, 0, 0.3, 1, 0.9, 1, 3); B.add(p.x, 1.25, 0, 0.3, 0.3, 0, 0.3, 1, 0.9, 0.5, 0); for (const s of [0.72, -0.72]) B.add(p.x + s * Math.cos(p.vx * 0.065), 0.95, 0, 0.1, 0.45 * f, 0, 0.3, 1, 0.9, 0.9, 3); if (p.twin > 0) { B.add(p.x, 2, 0, 1.3, 1.3, t * 3, 1, 0.8, 0.3, p.twin < 120 ? 0.3 + Math.sin(t * 20) * 0.3 : 0.6, 1); } }
    for (const s of S.shots) { B.add(s.x, s.y, 0, 0.12, 0.6, 0, 0.5, 1, 0.9, 1, 3); B.add(s.x, s.y + 0.3, 0, 0.22, 0.22, 0, 0.9, 1, 1, 1, 2); }
    for (const b of S.eb) { const c = b.k ? [1, 0.3, 0.6] : [1, 0.6, 0.2], s = b.k ? 0.42 : 0.34; B.add(b.x, b.y, 0.2, s, s, 0, c[0], c[1], c[2], 1, 2); B.add(b.x, b.y, 0.2, s * 2, s * 2, 0, c[0], c[1], c[2], 0.4, 0); }
    for (const m of S.embers) { const fk = 0.85 + 0.15 * Math.sin(t * 23 + m.x); B.add(m.x, m.y, 0.2, 0.4 * fk, 0.4 * fk, 0, 1, 0.85, 0.35, 1, 2); B.add(m.x, m.y, 0.2, 0.9, 0.9, t * 4, 1, 0.8, 0.3, 0.9, 1); B.add(m.x, m.y, 0.2, 1.7, 1.7, 0, 1, 0.6, 0.2, 0.22 * fk, 0); if (this.frameN % 3 === 0) this.parts.push({ x: m.x, y: m.y + 0.3, vx: (rand() - 0.5), vy: 1.5, l: 0.5, m: 0.5, s: 0.1, r: 1, g: 0.7, b: 0.2, sh: 0, gr: 0 }); }
    // debris (no splash where a piece comes down on the rock)
    let dn = 0, dw = 0; const D = this.dummy, M = this.debM; this.fcount = 0; for (const q of this.deb) { q.vy -= (q.fe ? 1.05 : 9.5) * dt; if (q.fe) { q.x += Math.sin(t * 2.3 + q.ph) * 0.55 * dt; if ((q.life -= dt) <= 0) continue; this.fcount++; } const k = Math.exp(-q.drag * dt); q.vx *= k; q.vz *= k; q.vy *= Math.exp(-q.drag * 0.35 * dt); q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt; q.rx += q.wx * dt; q.ry += q.wy * dt; q.rz += q.wz * dt;
      if (q.y < q.land && q.vy < 0) { const ix = Math.abs(q.x - W / 2); if (!q.fe && (ix > 5.4 || (q.land > -0.35 && ix > 0.9))) this.splash(q.x, q.land); continue; } this.deb[dw++] = q; D.position.set(q.x, q.y, q.z); D.rotation.set(q.rx, q.ry, q.rz); if (q.fe) D.scale.set(q.s * 0.45, q.s * 1.5 * Math.min(1, q.life), q.s * 0.6); else D.scale.setScalar(q.s); D.updateMatrix(); M.setMatrixAt(dn, D.matrix); M.setColorAt(dn, this.tc.setRGB(q.r, q.g, q.b)); dn++; }
    this.deb.length = dw; M.count = dn; M.instanceMatrix.needsUpdate = true; if (M.instanceColor) M.instanceColor.needsUpdate = true;
    // particles: additive sparks, rings and streaks, and smoke
    let w = 0; const Sm = this.smoke; for (let i = 0; i < this.parts.length; i++) { const q = this.parts[i]; q.l -= dt; if (q.l <= 0) continue; q.vx *= Math.exp(-2 * dt); q.vy *= Math.exp(-2 * dt); q.vy += q.gr * dt; q.x += q.vx * dt; q.y += q.vy * dt; const f = q.l / q.m, s = q.grow ? q.s + (1 - f) * q.grow : q.s * (0.4 + f * 0.6);
      if (q.sm) Sm.add(q.x, q.y, 0.3, s, s, q.seed, q.r, q.g, q.b, q.al * Math.min(1, f * 1.5) * Math.min(1, (1 - f) * 7), 0);
      else B.add(q.x, q.y, 0.3, q.sh === 3 ? s * 2.2 : s, q.sh === 3 ? s * 0.4 * (q.th || 1) : s * (q.fy || 1), q.sh === 3 ? Math.atan2(q.vy, q.vx) : 0, q.r, q.g, q.b, Math.min(1, f * 2.5), q.sh); this.parts[w++] = q; } this.parts.length = w;
    B.flush(); Sm.flush(); this.flash *= Math.exp(-dt * 6);
    this.post.render(this.scene, this.cam, dt, { bloom: 0.72, flash: this.flash, flashCol: this.flashCol, fade: this.fade, rays: 0, sun: this.post.mRays.uniforms.sun.value });
  }
  // the boss: everything moves, and it comes apart as its health goes (plates off at 2/3, a wing tip gone at 1/3)
  drawRoost(e, t, B, live) {
    const ro = this.roost; let mx = this.hpMax.get(e); if (!mx || e.hp > mx) { mx = e.hp; this.hpMax.set(e, mx); } const hp = Math.max(0, e.hp / mx), d0 = hp < 0.85, d1 = hp < 0.66, d2 = hp < 0.33, d3 = hp < 0.15;
    ro.visible = true; ro.position.set(e.x, e.y, 0); ro.rotation.z = Math.sin(t * 1.3) * 0.05 + (d2 ? Math.sin(t * 9) * 0.02 - 0.06 : 0) + (d3 ? Math.sin(t * 14) * 0.025 - 0.07 : 0);
    const fl = Math.sin(t * 3); for (const w of this.roW) { const dr = d2 && w.s < 0 ? 0.5 : 0; w.g1.rotation.z = w.s * (0.22 + fl * 0.16 - dr * 0.4); w.g2.rotation.z = w.s * (0.1 + Math.sin(t * 3 - 0.7) * 0.2 - dr); w.g3.rotation.z = w.s * (0.08 + Math.sin(t * 3 - 1.4) * 0.26); w.g3.visible = !(d2 && w.s < 0); }
    this.roFans[0].rotation.z = d3 ? 0.4 + Math.sin(t * 30) * 0.03 : t * (d2 ? 4 : 11); this.roFans[1].rotation.z = -t * (d1 ? 6 : 11); this.roIris.rotation.z = t * 0.8; const op = 0.75 + Math.sin(t * 1.7) * 0.25; for (const m of this.roIris.children) if (m.userData.a !== undefined) m.position.set(Math.cos(m.userData.a) * 0.5 * op, Math.sin(m.userData.a) * 0.37 * op, 0.02);
    const pu = (d2 ? 0.75 + rand() * 0.5 : 1) * (0.92 + Math.sin(t * 5) * 0.08); this.roFurn.scale.set(0.7 * pu, 0.5 * pu, 0.5);
    for (const g of this.roTal) g.rotation.z = g.userData.s * (d3 ? 0.05 + g.userData.i * 0.04 : 0.18 + Math.sin(t * 2.2 + g.userData.i) * 0.22 + g.userData.i * 0.12); for (const g of this.roTail) g.rotation.z = g.userData.b + Math.sin(t * 1.6 + g.userData.b * 3) * 0.08;
    this.roArm[0].visible = !d1; this.roArm[3].visible = !d1; this.roArm[1].visible = !d2; this.roArm[2].visible = !d2; this.roRibs.visible = d1 && !(d3 && (this.frameN & 8)); if (d0 && !d1) this.roArm[0].rotation.z = 0.28 + Math.sin(t * 17) * 0.03; // a plate works loose before it goes
    if (e.hit > 0) B.add(e.x, e.y, 1, 3.4, 2.4, 0, 1, 1, 1, 0.8, 0); if (e.dz > 0) B.add(e.x, e.y, 1, 3.6, 2.6, t, 1, 0.95, 0.7, 0.5, 1); B.add(e.x, e.y - 0.5, 0.9, 1.6, 1.2, 0, 1, 0.6, 0.25, 0.6 * pu, 0);
    if (live && d1 && this.frameN % (d2 ? 4 : 10) === 0) { const x = e.x + (rand() - 0.5) * 4, y = e.y + (rand() - 0.3) * 1.6; this.puff(x, y, 1, 0.5, 0.5, 1.6, 0.34); if (d2) { this.spark(x, y, 3, 5, [1, 0.6, 0.2], 0.1, 0.5, 3, -6); if (this.frameN % 16 === 0) { this.debris(x, y, 2, 4, COL.roost); this.light(x, y, [1, 0.6, 0.3], 0.9, 6); } } }
    if (d0 && !d1 && live && this.frameN % 14 === 0) this.spark(e.x + (rand() - 0.5) * 3.4, e.y + (rand() - 0.5) * 1.6, 2, 4, [1, 0.8, 0.4], 0.09, 0.35, 3, -5); // first sparks from the seams
    if (d2) this.burn(e.x, e.y, ro.rotation.z, d3 ? 1 : 0.5, t, B, live); // then it is on fire: two fires, four at the end
  }
}
