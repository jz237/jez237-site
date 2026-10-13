// A painted backdrop inside the back glass, as in a museum diorama: a misty valley with receding
// forested hills and mountains (far layer, against the glass) and a band of conifer silhouettes a little
// in front of it (near layer), so the two shift against each other as the view moves. They follow the
// time of day and the weather (dim and blue at night, greyer under storm cloud). Both are one-sided:
// seen from behind the case they vanish, so you can still look in through the back glass.
//
// Blending the painting into the scenery, so there is no line where the case's ground stops and the
// picture starts:
//   - aerial haze on the painting itself, thickest low down where it meets the ground, in the colour of
//     the case's own mist (warm at golden hour, grey in a storm, blue at night);
//   - two bands of ground mist along the back, their feet following the ground's rise and fall: one just
//     in front of the painting, one among the back trees. They drift with Weatherglass's wind.
import {
  Mesh, PlaneGeometry, MeshBasicMaterial, TextureLoader, SRGBColorSpace, Color, FrontSide, BufferGeometry,
  BufferAttribute, ShaderMaterial, DoubleSide, Vector2,
} from 'three';
import { guardMaterial } from './safety.js';

// the painting fades towards the mist colour below hazeTop, most at hazeBottom
function hazeShader(mat, U, amount) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U, { uHazeAmt: { value: amount } });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vWY;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vWY = (modelMatrix * vec4(position, 1.0)).y;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uHaze; uniform float uHazeAmt; uniform float uHazeY0; uniform float uHazeY1;
varying float vWY;`)
      .replace('#include <map_fragment>', `#include <map_fragment>
  {
    // aerial perspective: the whole painting a touch hazier, much more where it meets the ground
    float k = uHazeAmt * (0.12 + 0.88 * pow(smoothstep(uHazeY1, uHazeY0, vWY), 1.4));
    diffuseColor.rgb = mix(diffuseColor.rgb, uHaze, k);
  }`);
  };
  mat.customProgramCacheKey = () => 'jt-backdrop-haze';
}

const MIST_VS = `
attribute float aV;
varying vec2 vUv;
varying float vV;
varying vec3 vW;
void main() {
  vUv = uv;
  vV = aV;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const MIST_FS = `
uniform vec3 uColor; uniform float uAmount; uniform vec2 uDrift; uniform float uTime;
varying vec2 vUv;
varying float vV;
varying vec3 vW;
float hh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hh(i), hh(i + vec2(1, 0)), f.x), mix(hh(i + vec2(0, 1)), hh(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
void main() {
  // vV: 0 at the band's foot (just below the ground) to 1 at its top
  vec2 p = vec2(vW.x * 0.9, vV * 2.2) + uDrift + vec2(0.0, -uTime * 0.01);
  float n = fbm(p + vec2(fbm(p * 0.6 + uTime * 0.004), 0.0) * 0.8);
  float rise = vV + (n - 0.5) * 0.35;
  float a = smoothstep(0.0, 0.1, vV) * pow(clamp(1.0 - rise, 0.0, 1.0), 1.6) * (0.55 + 0.75 * n) * uAmount;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor, min(a, 0.92));
}`;

export class Backdrop {
  constructor(ctx, base) {
    this.ctx = ctx;
    const box = ctx.box;
    const W = box.halfW * 2 - 0.02;
    const load = (name) => {
      const t = new TextureLoader().load(new URL(name, base).href);
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    };
    // the ground's height along the back: where the painting must melt into it
    const T = ctx.terrain, zBack = -box.halfD + 0.3;
    let hs = 0, hn = 0;
    for (let x = -box.halfW + 0.3; x < box.halfW - 0.3; x += 0.25) (hs += Math.min(1.6, T.height(x, zBack))), hn++;
    const hBack = hn ? hs / hn : 0.4;
    this.hU = { uHaze: { value: new Color(0.9, 0.92, 0.9) }, uHazeY0: { value: hBack + 0.1 }, uHazeY1: { value: hBack + 2.1 } };
    this.farMat = new MeshBasicMaterial({ map: load('backdrop-far.webp'), side: FrontSide, fog: false });
    this.nearMat = new MeshBasicMaterial({ map: load('backdrop-near.webp'), side: FrontSide, transparent: true, depthWrite: false, fog: false });
    const blend = new URLSearchParams(location.search).get('blend') !== '0'; // ?blend=0: the plain painting, for comparison
    if (blend) hazeShader(this.farMat, this.hU, 0.62);
    if (blend) hazeShader(this.nearMat, this.hU, 0.38);
    guardMaterial(this.farMat);
    guardMaterial(this.nearMat);
    const H = box.topY - box.bottomY;
    this.far = new Mesh(new PlaneGeometry(W, H), this.farMat);
    this.far.position.set(0, box.bottomY + H / 2, -box.halfD + 0.03);
    this.far.name = 'backdrop-far';
    this.far.renderOrder = -1;
    const nh = 2.3;
    this.near = new Mesh(new PlaneGeometry(W, nh), this.nearMat);
    this.near.position.set(0, 0.15 + nh / 2, -box.halfD + 0.45);
    this.near.name = 'backdrop-near';
    this.near.renderOrder = 0.5;
    for (const m of [this.far, this.near]) {
      m.frustumCulled = false;
      ctx.scene.add(m);
    }
    // ground mist along the back: one band hugging the painting (behind the painted conifers), one a
    // little further in among the real trees
    this.mists = [];
    for (const [dz, top, amt, order] of blend ? [[0.22, 1.5, 0.75, 0.45], [0.95, 0.7, 0.3, 0.62]] : []) {
      const z = -box.halfD + dz, N = 96, pos = [], uv = [], av = [], idx = [];
      for (let i = 0; i <= N; i++) {
        const x = -box.halfW + 0.02 + (W * i) / N, h = T.height(x, z);
        pos.push(x, h - 0.12, z, x, h + top, z);
        uv.push(i / N, 0, i / N, 1);
        av.push(0, 1);
        if (i < N) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
      }
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
      g.setAttribute('uv', new BufferAttribute(new Float32Array(uv), 2));
      g.setAttribute('aV', new BufferAttribute(new Float32Array(av), 1));
      g.setIndex(idx);
      const m = new ShaderMaterial({
        uniforms: { uColor: { value: new Color(1, 1, 1) }, uAmount: { value: 0 }, uDrift: { value: new Vector2(Math.random() * 40, 0) }, uTime: { value: 0 } },
        vertexShader: MIST_VS, fragmentShader: MIST_FS, transparent: true, depthWrite: false, side: DoubleSide, fog: false,
      });
      guardMaterial(m);
      const mesh = new Mesh(g, m);
      mesh.name = 'backdrop-mist';
      mesh.renderOrder = order;
      mesh.frustumCulled = false;
      mesh.userData.amt = amt;
      ctx.scene.add(mesh);
      this.mists.push(mesh);
    }
    this.c = new Color();
    this.t = 0;
  }

  update(dt = 0) {
    this.t += dt;
    const life = this.ctx.modules.life?.env, w = this.ctx.world;
    const night = life?.night ?? 0, golden = life?.golden ?? 0, storm = Math.min(1, (w.storminess || 0) + (w.cloudCover || 0) * 0.4);
    // day: neutral; golden hour: warm; night: dim blue; storm: grey and darker
    const c = this.c.setRGB(1, 1, 1);
    c.lerp(new Color(1.15, 0.92, 0.72), golden * 0.6);
    c.lerp(new Color(0.62, 0.66, 0.7), storm * 0.5);
    c.lerp(new Color(0.07, 0.09, 0.15), night);
    this.farMat.color.copy(c);
    this.nearMat.color.copy(c).multiplyScalar(0.92);
    // the mist colour: the same as the case's own valley mist (see atmosphere.js), or a soft day haze
    const mc = this.ctx.modules.dinosaurs?.atmosphere?.mc;
    const haze = this.hU.uHaze.value;
    if (mc) haze.copy(mc);
    else haze.setRGB(0.9, 0.92, 0.9).multiply(c);
    // the painting is unlit, so its haze is tinted here; the mist bands too
    const hum = Math.min(1, (w.humidity ?? 0.5) * 0.8 + (w.groundWetness || 0) * 0.5);
    const amb = this.ctx.wind?.ambient;
    for (const m of this.mists) {
      const U = m.material.uniforms;
      U.uTime.value = this.t;
      U.uColor.value.copy(haze);
      U.uAmount.value = m.userData.amt * (0.75 + 0.4 * hum) * (1 - 0.35 * night);
      // carried along the back by the prevailing wind
      if (amb) U.uDrift.value.x -= (Number.isFinite(amb.x) ? amb.x : 0) * 0.45 * dt;
    }
  }
}
