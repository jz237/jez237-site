import * as THREE from 'three';
import { RNG } from '../core/rng.js';
import { L } from './layout.js';
import { archPoint } from './greenhouse.js';

// Atmosphere: shafts of golden light through the roof and dust motes that
// sparkle when they drift through a shaft. Both are deterministic functions
// of time, so a frame at t always looks the same.

export const SUN_DIR = new THREE.Vector3(0.36, -0.62, 0.62).normalize(); // direction light travels

const MAX_SHAFTS = 14;

export class Atmosphere {
  constructor(quality) {
    this.group = new THREE.Group();
    this.group.name = 'atmosphere';
    const rng = new RNG('atmo');
    const H = L.house;

    // ---- light shafts ------------------------------------------------------
    this.shaftUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color('#ffd49a') },
    };
    const shaftMat = new THREE.ShaderMaterial({
      uniforms: this.shaftUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec3 vN; varying vec3 vV; varying float vAlong; varying vec3 vW;
        void main(){
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz;
          vN = normalize(mat3(modelMatrix) * normal);
          vV = normalize(cameraPosition - w.xyz);
          vAlong = uv.y;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: `
        uniform float uTime, uIntensity; uniform vec3 uColor;
        varying vec3 vN; varying vec3 vV; varying float vAlong; varying vec3 vW;
        float hash(vec3 p){ p = fract(p*0.3183099+0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
        float noise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
          return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
        void main(){
          // crisp-edged blades of light (light through single panes), not soft glow
          float ndv = abs(dot(normalize(vN), normalize(vV)));
          float edge = smoothstep(0.03, 0.5, ndv) * (0.55 + 0.45 * ndv);
          // fine dusty streaks running down the beam, and a fade close to the
          // lens so near beams never wash the frame into a white wedge
          float streak = 0.6 + 0.4 * noise(vec3(vW.x * 0.09 + vW.z * 0.05, vW.y * 0.006, vW.z * 0.09 - vW.x * 0.05) + vec3(0.0, uTime * 0.02, 0.0));
          float camFade = smoothstep(25.0, 190.0, length(cameraPosition - vW));
          // vAlong = 1 under the glazing → 0 at the far end: strongest just below
          // the roof, dissolving into the haze well above the plants
          float ends = smoothstep(1.0, 0.93, vAlong) * smoothstep(0.3, 0.74, vAlong);
          float n = noise(vW * 0.02 + vec3(0.0, -uTime * 0.05, uTime * 0.03)) * 0.6 + 0.4;
          float a = edge * ends * n * streak * camFade * uIntensity;
          gl_FragColor = vec4(uColor * a, 1.0);
        }`,
    });
    this.shafts = [];
    // shafts enter through the roof between ribs and fall across the beds
    // blades fall through neighbouring panes in small parallel groups (panes
    // are ~24 apart between purlins), entering the left half of the vault so
    // they cross the reveal's view diagonally toward the camera
    const starts = [
      [-150, -150], [-126, -150],
      [-92, -330], [-68, -330], [-44, -330],
      [-175, -470], [-151, -470],
      [-20, -560], [4, -560],
      [-60, -60], [30, -240], [54, -240],
      [120, -330], [-110, -640],
    ];
    const len = 900;
    const geo = new THREE.CylinderGeometry(1, 1.25, 1, 20, 1, true);
    geo.translate(0, -0.5, 0); // top at origin, extends down
    for (let i = 0; i < Math.min(MAX_SHAFTS, starts.length); i++) {
      const [x, z] = starts[i];
      // place the start on the roof, offset back along the sun direction
      const top = new THREE.Vector3(x, 0, z);
      top.y = archPoint(Math.max(H.x0 + 5, Math.min(H.x1 - 5, x)), H) - 5;
      const mesh = new THREE.Mesh(geo, shaftMat);
      mesh.position.copy(top);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), SUN_DIR);
      const r = rng.range(6, 11);
      mesh.scale.set(r, len, r * rng.range(1.2, 1.7));
      mesh.renderOrder = 5;
      this.group.add(mesh);
      this.shafts.push({ mesh, top, r });
    }

    // ---- dust motes ---------------------------------------------------------
    const count = quality.tier === 'low' ? 1500 : 5000;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // half the motes hang close to the hero area for macro shots
      if (i < count * 0.45) {
        pos[i * 3] = rng.range(-45, 45);
        pos[i * 3 + 1] = rng.range(0, 55);
        pos[i * 3 + 2] = rng.range(-45, 45);
      } else {
        pos[i * 3] = rng.range(H.x0, H.x1);
        pos[i * 3 + 1] = rng.range(0, 420);
        pos[i * 3 + 2] = rng.range(H.z0, -700);
      }
      seed[i] = rng.float();
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dg.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
    this.dustUniforms = {
      uTime: { value: 0 },
      uShaftTop: { value: this.shafts.map((s) => s.top) },
      uShaftR: { value: this.shafts.map((s) => s.r * 1.6) },
      uSunDir: { value: SUN_DIR },
      uShaftGain: { value: 0 },
      uBase: { value: 0.1 },
      uColor: { value: new THREE.Color('#ffe2b0') },
      uPixel: { value: 1 },
    };
    const dustMat = new THREE.ShaderMaterial({
      uniforms: this.dustUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float seed;
        uniform float uTime, uShaftGain, uBase, uPixel;
        uniform vec3 uShaftTop[${MAX_SHAFTS}];
        uniform float uShaftR[${MAX_SHAFTS}];
        uniform vec3 uSunDir;
        varying float vA;
        void main(){
          vec3 p = position;
          float s = seed * 6.2831;
          p += vec3(sin(uTime*0.11 + s*3.0)*2.5, sin(uTime*0.07 + s)*1.5 + uTime*0.15*(seed-0.4), cos(uTime*0.09 + s*2.0)*2.5) * (1.0 + step(60.0, abs(p.x)+abs(p.z)) * 4.0);
          float lit = 0.0;
          for (int i = 0; i < ${MAX_SHAFTS}; i++) {
            vec3 d = p - uShaftTop[i];
            float along = dot(d, uSunDir);
            vec3 perp = d - uSunDir * along;
            lit = max(lit, smoothstep(uShaftR[i], uShaftR[i]*0.3, length(perp)) * step(0.0, along));
          }
          float tw = 0.65 + 0.35 * sin(uTime * (1.5 + seed * 3.0) + s * 5.0);
          vA = (uBase + lit * uShaftGain) * tw;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = clamp((0.06 + seed * 0.1) * 900.0 * uPixel / -mv.z, 1.0, 9.0 * uPixel);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; varying float vA;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uColor * a * vA, 1.0);
        }`,
    });
    this.dust = new THREE.Points(dg, dustMat);
    this.dust.frustumCulled = false;
    this.dust.renderOrder = 6;
    this.group.add(this.dust);
  }

  update(t, ctx) {
    this.shaftUniforms.uTime.value = t;
    this.dustUniforms.uTime.value = t;
    const sun = ctx.sunStrength;
    this.shaftUniforms.uIntensity.value = 0.55 * sun * ctx.shaftGain;
    this.dustUniforms.uShaftGain.value = 2.4 * sun;
    this.dustUniforms.uBase.value = 0.05 + 0.2 * ctx.dawn;
    this.dustUniforms.uPixel.value = ctx.pixelRatio;
  }
}
