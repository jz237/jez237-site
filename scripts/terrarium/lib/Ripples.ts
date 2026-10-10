import * as THREE from 'three';
import {FullScreenQuad} from 'three/examples/jsm/postprocessing/Pass.js';
import {WATER_LEVEL} from './Ground';

const MAX_DROPS = 24;

/**
 * Ripples on the pool: a two-buffer wave equation on the GPU (each texel holds
 * this step's and the last step's height). Anything that touches the water adds
 * a soft dent; waves spread at about 0.2 m/s, reflect off the shore and die away.
 * Runs at a fixed 120 steps a second and rests after the water goes still.
 */
export class Ripples {
  private a: THREE.WebGLRenderTarget;
  private b: THREE.WebGLRenderTarget;
  private quad: FullScreenQuad;
  private mat: THREE.ShaderMaterial;
  private queue: THREE.Vector4[] = [];
  private acc = 0;
  private idle = 0;
  readonly nx: number;
  readonly nz: number;
  /** Interpolation between the last two steps, for smooth motion at any frame rate. */
  alpha = 0;
  readonly box: THREE.Vector4;

  constructor(box: THREE.Vector4, bed: THREE.Texture, res = 256) {
    this.box = box;
    this.nx = res;
    this.nz = Math.max(8, Math.round(res * box.w / box.z));
    const opts = {type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false};
    this.a = new THREE.WebGLRenderTarget(this.nx, this.nz, opts);
    this.b = new THREE.WebGLRenderTarget(this.nx, this.nz, opts);
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        tPrev: {value: null as THREE.Texture | null},
        tBed: {value: bed},
        uTexel: {value: new THREE.Vector2(1 / this.nx, 1 / this.nz)},
        uBox: {value: box},
        uDamping: {value: 0.986},
        uDrops: {value: Array.from({length: MAX_DROPS}, () => new THREE.Vector4())},
        uCount: {value: 0},
        uClear: {value: 0},
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */ `
precision highp float;
uniform sampler2D tPrev, tBed; uniform vec2 uTexel; uniform vec4 uBox; uniform float uDamping, uClear;
uniform vec4 uDrops[${MAX_DROPS}]; uniform int uCount;
varying vec2 vUv;
void main(){
  vec4 c = texture2D(tPrev, vUv);
  float n4 = texture2D(tPrev, vUv + vec2(uTexel.x, 0.0)).r + texture2D(tPrev, vUv - vec2(uTexel.x, 0.0)).r
           + texture2D(tPrev, vUv + vec2(0.0, uTexel.y)).r + texture2D(tPrev, vUv - vec2(0.0, uTexel.y)).r;
  float h = (n4 * 0.5 - c.g) * uDamping;
  float depth = ${WATER_LEVEL.toFixed(4)} - texture2D(tBed, vUv).r;
  float wet = step(0.0004, depth);
  // shallows drag the waves down
  h *= mix(0.9, 1.0, smoothstep(0.002, 0.012, depth)) * wet;
  vec2 xz = uBox.xy + vUv * uBox.zw;
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    if (i >= uCount) break;
    vec4 d = uDrops[i];
    vec2 q = (xz - d.xy) / d.z;
    h += d.w * exp(-dot(q, q) * 2.2) * wet;
  }
  h *= 1.0 - uClear;
  gl_FragColor = vec4(clamp(h, -40.0, 40.0), c.r * (1.0 - uClear), 0.0, 1.0);
}`,
    });
    this.quad = new FullScreenQuad(this.mat);
  }

  get texture() {return this.a.texture;}
  /** World size of one texel (m). */
  get cell() {return this.box.z / this.nx;}

  /** A dent at (x, z) of radius r (m) and amplitude amp (negative pushes down). */
  add(x: number, z: number, r: number, amp: number) {
    if (x < this.box.x || z < this.box.y || x > this.box.x + this.box.z || z > this.box.y + this.box.w) return;
    if (this.queue.length >= 96) this.queue.shift();
    this.queue.push(new THREE.Vector4(x, z, Math.max(r, this.cell * 1.1), amp));
    this.idle = 0;
  }

  update(renderer: THREE.WebGLRenderer, dt: number) {
    this.idle += dt;
    if (this.idle > 12) {this.alpha = 1; return;}
    this.acc += dt;
    const step = 1 / 120;
    let n = 0;
    const prevTarget = renderer.getRenderTarget();
    while (this.acc >= step && n < 6) {
      this.acc -= step;
      const drops = this.mat.uniforms.uDrops.value as THREE.Vector4[];
      const k = Math.min(MAX_DROPS, this.queue.length);
      for (let i = 0; i < k; i++) drops[i].copy(this.queue[i]);
      this.queue.splice(0, k);
      this.mat.uniforms.uCount.value = k;
      this.mat.uniforms.tPrev.value = this.a.texture;
      renderer.setRenderTarget(this.b);
      this.quad.render(renderer);
      [this.a, this.b] = [this.b, this.a];
      n++;
    }
    if (this.acc > step * 6) this.acc = 0;
    renderer.setRenderTarget(prevTarget);
    this.alpha = this.acc / step;
  }
}
