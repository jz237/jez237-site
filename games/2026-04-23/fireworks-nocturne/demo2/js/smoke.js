// Lingering smoke. Every break lays puffs along its stars' paths; they drift
// with the wind, spread and thin out, and are lit by every later burst, so the
// sky fills with glowing clouds the way a real show does. One ring buffer, one
// draw call per pass, rendered at reduced resolution with soft depth.
import * as THREE from 'three';
import { HASH, LIGHTS } from './glsl.js?v=7';

const PSTRIDE = 16;

const VS = /* glsl */ `
attribute vec4 iP; attribute vec4 iV; attribute vec4 iS; attribute vec4 iC;
uniform float uTime;
uniform vec3 uWind;
uniform vec3 uAmbient;
uniform vec3 uCityGlow;
${HASH}
${LIGHTS}
varying vec2 vUV;
varying vec3 vLit;
varying float vAlpha;
varying float vDepth;
varying vec3 vLdir;
varying float vDirk;
varying vec3 vSeed;
void main() {
  float a = uTime - iP.w;
  if (a < 0.0 || a > iS.z) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vAlpha = 0.0; return; }
  vec3 vt = uWind * 0.95 + vec3(0.0, 0.22, 0.0);
  float k = iV.w;
  vec3 p = iP.xyz + vt * a + (iV.xyz - vt) * ((1.0 - exp(-k * a)) / k);
  float r = iS.x + iS.y * (1.0 - exp(-a / 4.0)) * 4.0 + 0.32 * a;
  float fin = smoothstep(0.0, 0.5, a);
  float fout = 1.0 - smoothstep(iS.z * 0.55, iS.z, a);
  float alpha = (1.0 - exp(-iS.w / (r * r))) * fin * fout;
  vec3 V = normalize(cameraPosition - p);
  vec3 lit = uAmbient + uCityGlow * clamp(0.6 - p.y / 1400.0, 0.1, 1.0);
  vec3 ld = vec3(0.0);
  float esum = 0.0;
  for (int i = 0; i < NL; i++) {
    if (i >= uLN) break;
    vec3 d = uLP[i].xyz - p;
    float r2 = dot(d, d);
    float R = uLP[i].w;
    vec3 E = uLC[i].rgb / (r2 + R * R * 0.6 + r * r * 0.5);
    float cs = dot(-d * inversesqrt(r2 + 1e-4), -V);
    float g = 0.55;
    float hg = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cs, 1.5);
    // a puff inside a burst is lit all round; far ones mostly on the facing side
    vec3 Ei = E * (0.075 + 0.12 * hg);
    lit += Ei;
    float e = dot(Ei, vec3(0.3, 0.5, 0.2));
    // a light inside the puff lights it from every side
    float inside = smoothstep(r * 1.2, r * 0.3, sqrt(r2));
    ld += mat3(viewMatrix) * (d * inversesqrt(r2 + 1e-4)) * e * (1.0 - inside);
    esum += e;
  }
  float ll = length(ld);
  vLdir = ll > 1e-6 ? ld / ll : vec3(0.0, 0.0, 1.0);
  vDirk = esum > 1e-7 ? clamp(ll / esum, 0.0, 1.0) : 0.0;
  vLit = lit * iC.rgb;
  vAlpha = alpha;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float ang = iC.w * 6.2831 + a * (iC.w - 0.5) * 0.05;
  vec2 q = position.xy;
  vec2 rq = vec2(q.x * cos(ang) - q.y * sin(ang), q.x * sin(ang) + q.y * cos(ang));
  mv.xy += rq * r;
  vDepth = -mv.z;
  vUV = q;
  vSeed = vec3(fract(iC.w * 17.0), fract(iC.w * 131.0), ang);
  gl_Position = projectionMatrix * mv;
}
`;

const FS = /* glsl */ `
uniform sampler2D uNoise;
uniform sampler2D uDepth;
uniform vec2 uTarget;
uniform vec2 uNF;
uniform float uSoft;
varying vec2 vUV;
varying vec3 vLit;
varying float vAlpha;
varying float vDepth;
varying vec3 vLdir;
varying float vDirk;
varying vec3 vSeed;
void main() {
  float rr = dot(vUV, vUV);
  if (rr > 1.0 || vAlpha < 0.002) discard;
  vec2 nuv = vUV * 0.42 + vSeed.xy;
  vec4 nz = texture2D(uNoise, nuv);
  vec4 nz2 = texture2D(uNoise, vUV * 0.9 + vSeed.yx * 1.7);
  float edge = 1.0 - smoothstep(0.15, 1.0, sqrt(rr));
  float dens = edge * clamp(nz.r * 1.6 - 0.38 + (nz2.r - 0.5) * 0.55, 0.0, 1.0);
  float al = vAlpha * dens * 1.6;
  if (uSoft > 0.0) {
    float z = texture2D(uDepth, gl_FragCoord.xy / uTarget).r * 2.0 - 1.0;
    float sz = 2.0 * uNF.x * uNF.y / (uNF.y + uNF.x - z * (uNF.y - uNF.x));
    al *= clamp((sz - vDepth) / uSoft, 0.0, 1.0);
  }
  vec2 gr = nz.gb * 2.0 - 1.0;
  float c = cos(vSeed.z), s = sin(vSeed.z);
  gr = vec2(gr.x * c - gr.y * s, gr.x * s + gr.y * c);
  // treat the puff as a lumpy ball: lit side, shadow side, glowing thin edge
  vec3 n = normalize(vec3(vUV * 0.9 + gr * 0.45, sqrt(max(0.0, 1.0 - rr)) + 0.15));
  float diff = pow(clamp(dot(n, vLdir) * 0.5 + 0.5, 0.0, 1.0), 1.6);
  float back = max(-vLdir.z, 0.0);
  float thin = 1.0 - dens;
  float dirShade = 0.18 + 1.45 * diff + back * thin * 1.4;
  float shade = mix(0.85 + 0.25 * (nz.r - 0.5), dirShade, vDirk);
  vec3 col = vLit * max(shade, 0.12);
  al = clamp(al, 0.0, 0.92);
  gl_FragColor = vec4(col * al, al);
}
`;

// Tileable fBm with its gradient (R = value, G/B = d/dx, d/dy) for puff texture.
function makeNoise(size = 128) {
  const lat = (n, seed) => {
    const g = new Float32Array(n * n);
    let s = seed;
    for (let i = 0; i < g.length; i++) { s = (s * 1664525 + 1013904223) >>> 0; g[i] = s / 4294967296; }
    return g;
  };
  const h = new Float32Array(size * size);
  let amp = 1, total = 0;
  for (let o = 0; o < 5; o++) {
    const n = 4 << o;
    const g = lat(n, 1234 + o * 77);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const fx = x / size * n, fy = y / size * n;
      const ix = Math.floor(fx), iy = Math.floor(fy);
      let tx = fx - ix, ty = fy - iy;
      tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
      const at = (a, b) => g[((b % n + n) % n) * n + ((a % n + n) % n)];
      const v = (at(ix, iy) * (1 - tx) + at(ix + 1, iy) * tx) * (1 - ty) + (at(ix, iy + 1) * (1 - tx) + at(ix + 1, iy + 1) * tx) * ty;
      h[y * size + x] += v * amp;
    }
    total += amp;
    amp *= 0.55;
  }
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < h.length; i++) { h[i] /= total; lo = Math.min(lo, h[i]); hi = Math.max(hi, h[i]); }
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const v = (h[i] - lo) / (hi - lo);
    const dx = (h[y * size + (x + 1) % size] - h[y * size + (x - 1 + size) % size]) / (hi - lo) * size / 16;
    const dy = (h[((y + 1) % size) * size + x] - h[((y - 1 + size) % size) * size + x]) / (hi - lo) * size / 16;
    data[i * 4] = v * 255;
    data[i * 4 + 1] = Math.max(0, Math.min(255, 128 + dx * 127));
    data[i * 4 + 2] = Math.max(0, Math.min(255, 128 + dy * 127));
    data[i * 4 + 3] = 255;
  }
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

export class Smoke {
  constructor(tier, lights, windU) {
    this.cap = tier.smokeCap;
    this.scale = tier.smokeScale;
    this.data = new Float32Array(this.cap * PSTRIDE);
    for (let i = 0; i < this.cap; i++) { this.data[i * PSTRIDE + 3] = -1e9; this.data[i * PSTRIDE + 10] = 0; }
    this.head = 0;
    this.buf = new THREE.InstancedInterleavedBuffer(this.data, PSTRIDE, 1);
    this.buf.setUsage(THREE.DynamicDrawUsage);
    const geo = new THREE.InstancedBufferGeometry();
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
    ['iP', 'iV', 'iS', 'iC'].forEach((n, i) => geo.setAttribute(n, new THREE.InterleavedBufferAttribute(this.buf, 4, i * 4)));
    geo.instanceCount = this.cap;
    this.uniforms = {
      uTime: { value: 0 },
      uWind: windU,
      uAmbient: { value: new THREE.Vector3(0.0016, 0.0019, 0.0026) },
      uCityGlow: { value: new THREE.Vector3(0.010, 0.0065, 0.0042) },
      uNoise: { value: makeNoise() },
      uDepth: { value: null },
      uTarget: { value: new THREE.Vector2(1, 1) },
      uNF: { value: new THREE.Vector2(1, 10000) },
      uSoft: { value: 25 },
      ...lights.uniforms,
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms, vertexShader: VS, fragmentShader: FS,
      transparent: true, depthWrite: false, depthTest: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.frustumCulled = false;
    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
    this.dirtyLo = Infinity;
    this.dirtyHi = -1;
    this.rand = Math.random;
  }

  // One puff. p: start, v: start velocity, k: drag, r0/growth in m, life s,
  // mass sets how opaque it stays as it spreads, albedo tints it.
  puff(p, t0, v, k, r0, growth, life, mass, albedo = [0.82, 0.82, 0.86]) {
    const i = this.head;
    this.head = (this.head + 1) % this.cap;
    const o = i * PSTRIDE, d = this.data;
    d[o] = p[0]; d[o + 1] = p[1]; d[o + 2] = p[2]; d[o + 3] = t0;
    d[o + 4] = v[0]; d[o + 5] = v[1]; d[o + 6] = v[2]; d[o + 7] = k;
    d[o + 8] = r0; d[o + 9] = growth; d[o + 10] = life; d[o + 11] = mass;
    d[o + 12] = albedo[0]; d[o + 13] = albedo[1]; d[o + 14] = albedo[2]; d[o + 15] = this.rand();
    this.dirtyLo = Math.min(this.dirtyLo, i);
    this.dirtyHi = Math.max(this.dirtyHi, i);
    if (this.head === 0) this.flush();
  }

  flush() {
    if (this.dirtyHi < 0) return;
    this.buf.addUpdateRange(this.dirtyLo * PSTRIDE, (this.dirtyHi - this.dirtyLo + 1) * PSTRIDE);
    this.buf.needsUpdate = true;
    this.dirtyLo = Infinity;
    this.dirtyHi = -1;
  }

  update(t) {
    this.uniforms.uTime.value = t;
    this.flush();
  }

  clear() {
    for (let i = 0; i < this.cap; i++) this.data[i * PSTRIDE + 3] = -1e9;
    this.dirtyLo = 0; this.dirtyHi = this.cap - 1;
    this.flush();
  }
}
