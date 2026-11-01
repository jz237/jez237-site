import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, PointsMaterial, ShaderMaterial, Vector3, type Mesh,
} from 'three';
import { Behaviour, Time } from '@scenoco-three/core';

/**
 * The night behind the battle: a gradient sky with aurora curtains rippling across it, drawn by a shader
 * on one far plane, and a field of twinkling stars in front of it. Each wave brings a preset — the
 * classic edition's four skies — and a boss wave washes the sky with its own warning colour.
 */
export const PRESETS = [
  { top: '#04101f', mid: '#0e2c58', bottom: '#223b6f', aurora: ['#53ffa3', '#55d2ff', '#b381ff'] },
  { top: '#120719', mid: '#2a1240', bottom: '#6e2836', aurora: ['#74fff0', '#8fa5ff', '#ffb36b'] },
  { top: '#061221', mid: '#17395a', bottom: '#8f5630', aurora: ['#82ffe6', '#79c1ff', '#ff94df'] },
  { top: '#1a0d26', mid: '#542040', bottom: '#994e2e', aurora: ['#5be4ff', '#ff7dd6', '#d6ff7d'] },
];

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float time;
  uniform vec3 top, mid, bottom;
  uniform vec3 a0, a1, a2;
  uniform vec3 tint;
  uniform float tintAmount;
  uniform float strength;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(float x) { float i = floor(x); float f = fract(x); return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f)); }

  // One curtain: a wavering line across the sky, rays hanging down from it.
  float curtain(vec2 uv, float base, float speed, float seed) {
    float x = uv.x * 3.0;
    float line = base + 0.07 * sin(x * 2.1 + time * speed + seed) + 0.05 * sin(x * 4.7 - time * speed * 1.3 + seed * 2.0)
               + 0.04 * (noise(x * 3.0 + time * 0.2 + seed) - 0.5);
    float below = line - uv.y;
    float drape = smoothstep(-0.0, 0.09, below) * exp(-max(below, 0.0) * 5.0);
    float rays = 0.45 + 0.55 * noise(uv.x * 60.0 + time * 0.6 + seed * 10.0);
    float flicker = 0.75 + 0.25 * sin(time * 0.9 + uv.x * 12.0 + seed);
    return drape * rays * flicker;
  }

  void main() {
    // The camera sees only the middle of this plane: v runs 0 → 1 over that band, horizon to zenith.
    vec2 uv = vec2(vUv.x * 4.0, (vUv.y - 0.27) / 0.33);
    float v = clamp(uv.y, 0.0, 1.0);
    vec3 sky = (v > 0.4 ? mix(mid, top, (v - 0.4) / 0.6) : mix(bottom, mid, v / 0.4)) * 0.42;
    float c0 = curtain(uv, 0.92, 0.25, 1.3);
    float c1 = curtain(uv, 0.78, 0.18, 4.1);
    float c2 = curtain(uv, 0.64, 0.31, 7.7);
    vec3 glow = a0 * c0 * 1.0 + a1 * c1 * 0.7 + a2 * c2 * 0.4;
    vec3 colour = sky + glow * strength;
    colour = mix(colour, tint, tintAmount);
    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`;

export class Sky extends Behaviour<Mesh> {
  stars = 900;

  private material!: ShaderMaterial;
  private tintTarget = 0;
  private starMaterial!: PointsMaterial;
  private readonly palette = { top: new Color(), mid: new Color(), bottom: new Color(), a: [new Color(), new Color(), new Color()] };
  private readonly want = { top: new Color(), mid: new Color(), bottom: new Color(), a: [new Color(), new Color(), new Color()] };

  override awake(): void {
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      depthWrite: false,
      fog: false,
      uniforms: {
        time: { value: 0 },
        top: { value: new Vector3() },
        mid: { value: new Vector3() },
        bottom: { value: new Vector3() },
        a0: { value: new Vector3() },
        a1: { value: new Vector3() },
        a2: { value: new Vector3() },
        tint: { value: new Vector3() },
        tintAmount: { value: 0 },
        strength: { value: 0.7 },
      },
    });
    this.node.material = this.material;
    this.node.renderOrder = -10;
    this.preset(0, true);

    // Stars, in front of the sky plane and well behind the battle.
    const positions = new Float32Array(this.stars * 3);
    for (let i = 0; i < this.stars; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 260;
      positions[i * 3 + 1] = Math.random() * 110 - 10;
      positions[i * 3 + 2] = 2 + Math.random() * 4;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.starMaterial = new PointsMaterial({ color: '#d8ecff', size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false, fog: false });
    this.node.add(new Points(geometry, this.starMaterial));
  }

  /** A wave's sky: eased into over a couple of seconds, unless `now`. */
  preset(index: number, now = false): void {
    const p = PRESETS[index % PRESETS.length]!;
    this.want.top.set(p.top);
    this.want.mid.set(p.mid);
    this.want.bottom.set(p.bottom);
    p.aurora.forEach((c, i) => this.want.a[i]!.set(c));
    if (now) {
      this.palette.top.copy(this.want.top);
      this.palette.mid.copy(this.want.mid);
      this.palette.bottom.copy(this.want.bottom);
      this.want.a.forEach((c, i) => this.palette.a[i]!.copy(c));
    }
  }

  /** A boss wave's wash over the sky; `amount` 0 clears it. */
  warn(colour: string, amount: number): void {
    (this.material.uniforms.tint!.value as Vector3).set(...new Color(colour).toArray() as [number, number, number]);
    this.tintTarget = amount;
  }

  override update(dt: number): void {
    const u = this.material.uniforms;
    u.time!.value = Time.unscaledTime;
    const k = 1 - Math.exp(-dt * 1.2);
    this.palette.top.lerp(this.want.top, k);
    this.palette.mid.lerp(this.want.mid, k);
    this.palette.bottom.lerp(this.want.bottom, k);
    this.palette.a.forEach((c, i) => c.lerp(this.want.a[i]!, k));
    (u.top!.value as Vector3).set(this.palette.top.r, this.palette.top.g, this.palette.top.b);
    (u.mid!.value as Vector3).set(this.palette.mid.r, this.palette.mid.g, this.palette.mid.b);
    (u.bottom!.value as Vector3).set(this.palette.bottom.r, this.palette.bottom.g, this.palette.bottom.b);
    (['a0', 'a1', 'a2'] as const).forEach((name, i) => {
      const c = this.palette.a[i]!;
      (u[name]!.value as Vector3).set(c.r, c.g, c.b);
    });
    u.tintAmount!.value += (this.tintTarget - (u.tintAmount!.value as number)) * k * 2;
    this.starMaterial.opacity = 0.7 + Math.sin(Time.unscaledTime * 0.7) * 0.15;
  }
}
