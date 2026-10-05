import * as THREE from 'three';
import { SUN_DIR } from './atmosphere.js';

// The sky beyond the glass: midnight teal with a few stars, warming to a
// golden morning. A large inside-out sphere, unaffected by fog.

export class Sky {
  constructor() {
    this.uniforms = {
      uDawn: { value: 0 },
      uSunDir: { value: SUN_DIR.clone().negate() },
      uClouds: { value: 0 }, // interactive modes: drifting clouds and a moon
      uTime: { value: 0 },
    };
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(6000, 48, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: this.uniforms,
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }`,
        fragmentShader: `
          uniform float uDawn; uniform vec3 uSunDir; uniform float uClouds, uTime; varying vec3 vDir;
          float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
          float h2(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
          float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
            return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
          float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * n2(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
          void main(){
            float y = clamp(vDir.y, -0.2, 1.0);
            vec3 nightTop = vec3(0.004, 0.018, 0.024), nightHor = vec3(0.018, 0.06, 0.07);
            vec3 dayTop = vec3(0.1, 0.25, 0.3), dayHor = vec3(0.92, 0.6, 0.3);
            vec3 top = mix(nightTop, dayTop, uDawn), hor = mix(nightHor, dayHor, uDawn);
            vec3 c = mix(hor, top, pow(max(y, 0.0), 0.5));
            float s = max(dot(vDir, normalize(uSunDir)), 0.0);
            c += vec3(1.6, 1.05, 0.55) * (pow(s, 600.0) * 30.0 + pow(s, 6.0) * 1.1 + pow(s, 2.0) * 0.15) * uDawn;
            // stars fade with the dawn
            vec3 q = floor(vDir * 420.0);
            float st = step(0.9975, hash(q)) * (1.0 - smoothstep(0.0, 0.35, uDawn)) * smoothstep(0.05, 0.4, y);
            c += vec3(0.7, 0.85, 0.9) * st * 0.8;
            if (uClouds > 0.0) {
              // a moon where the night key light comes from
              vec3 sd = normalize(uSunDir);
              float night = 1.0 - smoothstep(0.1, 0.45, uDawn);
              float m = max(dot(vDir, sd), 0.0);
              #ifdef CG_EXPLORE_NIGHT
              // blue hour (dusk): deep indigo overhead, a last warm band low on the far side
              float blue = smoothstep(0.08, 0.27, uDawn) * (1.0 - smoothstep(0.3, 0.5, uDawn));
              vec3 indigo = mix(vec3(0.05, 0.06, 0.13), vec3(0.008, 0.02, 0.07), pow(max(y, 0.0), 0.45));
              c = mix(c, indigo, blue * 0.85);
              float away = 0.4 + 0.6 * max(dot(normalize(vDir.xz + 1e-4), -normalize(sd.xz)), 0.0);
              c += vec3(0.34, 0.13, 0.06) * pow(1.0 - max(y, 0.0), 7.0) * blue * away;
              // dawn: a rose band under the gold
              float rose = smoothstep(0.36, 0.5, uDawn) * (1.0 - smoothstep(0.54, 0.74, uDawn));
              c += vec3(0.3, 0.12, 0.15) * pow(1.0 - max(y, 0.0), 4.0) * rose;
              // more stars at night and dusk, twinkling, a few warm or blue
              vec3 q2 = floor(vDir * 760.0);
              float h2s = hash(q2 + 3.1);
              float st2 = step(0.9982, h2s) * (1.0 - smoothstep(0.24, 0.42, uDawn)) * smoothstep(0.02, 0.3, y);
              float tw = 0.6 + 0.4 * sin(uTime * (1.3 + h2s * 40.0) + h2s * 300.0);
              vec3 sc = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.85, 0.65), step(0.9993, h2s));
              c += sc * st2 * tw * 1.6;
              c += vec3(0.7, 0.85, 0.9) * st * 0.6 * night;
              float disc = smoothstep(0.99955, 0.99975, m);
              float mare = 0.82 + 0.18 * n2(vDir.xy * 900.0);
              c += vec3(0.85, 0.92, 0.95) * (disc * 3.6 * mare + pow(m, 120.0) * 0.2 + pow(m, 14.0) * 0.05) * max(night, blue * 0.7);
              #else
              float disc = smoothstep(0.99955, 0.99975, m);
              float mare = 0.82 + 0.18 * n2(vDir.xy * 900.0);
              c += vec3(0.85, 0.92, 0.95) * (disc * 2.2 * mare + pow(m, 120.0) * 0.12 + pow(m, 12.0) * 0.03) * night;
              #endif
              // flattened cloud deck drifting slowly; lit gold by day, moon-rimmed by night
              float yy = max(vDir.y, 0.0);
              vec2 uv = vDir.xz / (yy + 0.08) * 0.9 + vec2(uTime * 0.004, uTime * 0.0015);
              float cl = smoothstep(0.48, 0.78, fbm(uv * 1.3));
              float wisp = smoothstep(0.55, 0.85, fbm(uv * 3.1 + 5.0)) * 0.5;
              float k = clamp(cl + wisp, 0.0, 1.0) * smoothstep(0.0, 0.12, yy) * uClouds;
              float sunSide = pow(max(dot(vDir, sd), 0.0), 3.0);
              vec3 dayCl = mix(vec3(1.0, 0.86, 0.66), vec3(1.7, 1.15, 0.6), sunSide) * mix(0.55, 1.0, uDawn);
              vec3 nightCl = vec3(0.05, 0.09, 0.11) + vec3(0.25, 0.3, 0.32) * pow(m, 8.0);
              vec3 cc = mix(nightCl, dayCl, smoothstep(0.15, 0.7, uDawn));
              c = mix(c, cc * (0.75 + 0.25 * fbm(uv * 6.0)), k * 0.85);
            }
            gl_FragColor = vec4(c, 1.0);
          }`,
      })
    );
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -10;
    // the interactive modes' sky (dusk, dawn, twinkling stars, a brighter
    // moon): the same shader with a define, swapped in while exploring, so the
    // film's sky program is unchanged
    const fm = this.mesh.material;
    this.exploreMaterial = new THREE.ShaderMaterial({ side: fm.side, depthWrite: false, fog: false, uniforms: this.uniforms, vertexShader: fm.vertexShader, fragmentShader: fm.fragmentShader, defines: { CG_EXPLORE_NIGHT: '' } });
  }
  update(t, ctx) {
    this.uniforms.uDawn.value = ctx.dawn;
    this.uniforms.uClouds.value = ctx.explore ? 1 : 0;
    this.uniforms.uTime.value = t;
  }
}
