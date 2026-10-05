import * as THREE from 'three';
import { SUN_DIR } from './atmosphere.js';

// The sky beyond the glass: midnight teal with a few stars, warming to a
// golden morning. A large inside-out sphere, unaffected by fog.

export class Sky {
  constructor() {
    this.uniforms = {
      uDawn: { value: 0 },
      uSunDir: { value: SUN_DIR.clone().negate() },
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
          uniform float uDawn; uniform vec3 uSunDir; varying vec3 vDir;
          float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
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
            gl_FragColor = vec4(c, 1.0);
          }`,
      })
    );
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -10;
  }
  update(t, ctx) {
    this.uniforms.uDawn.value = ctx.dawn;
  }
}
