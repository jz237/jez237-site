import * as T from "three";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

// Final HDR grade: shockwave refraction, chromatic split that spikes on
// impacts, exposure flash, slow-motion desaturation, damage bleed, sector
// colour grade, vignette and fine grain. Runs before the ACES output pass.
const MAX_WAVES = 8;
export function makeGradePass() {
  const waves = Array.from({ length: MAX_WAVES }, () => new T.Vector4());
  const pass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: new T.Vector2(1, 1) },
      time: { value: 0 },
      waves: { value: waves },
      aberration: { value: 0.15 },
      vignette: { value: 0.55 },
      grain: { value: 0.035 },
      damage: { value: 0 },
      slow: { value: 0 },
      flash: { value: 0 },
      lift: { value: new T.Vector3() },
      gain: { value: new T.Vector3(1, 1, 1) },
      saturation: { value: 1.05 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform vec2 resolution;
      uniform float time, aberration, vignette, grain, damage, slow, flash, saturation;
      uniform vec4 waves[${MAX_WAVES}];
      uniform vec3 lift, gain;
      varying vec2 vUv;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      vec3 safe(vec3 c) {
        return (any(isnan(c)) || any(isinf(c))) ? vec3(0.0) : max(c, 0.0);
      }
      void main() {
        vec2 asp = vec2(resolution.x / resolution.y, 1.0);
        vec2 off = vec2(0.0);
        float ring = 0.0;
        for (int i = 0; i < ${MAX_WAVES}; i++) {
          vec4 w = waves[i];
          if (w.w <= 0.0) continue;
          vec2 v = (vUv - w.xy) * asp;
          float d = length(v);
          float x = (d - w.z) / (0.025 + w.z * 0.16);
          float k = exp(-x * x) * w.w;
          off += (d > 1e-4 ? v / d : vec2(0.0)) * k / asp;
          ring += k;
        }
        vec2 uv = vUv - off;
        vec2 c0 = uv - 0.5;
        vec2 ca = c0 * aberration * 0.012 + off * 0.45;
        vec3 c = vec3(
          texture2D(tDiffuse, uv + ca).r,
          texture2D(tDiffuse, uv).g,
          texture2D(tDiffuse, uv - ca).b);
        c = safe(c);
        c += c * flash * 0.9 + vec3(1.0, 0.93, 0.85) * flash * 0.12;
        c += vec3(0.6, 0.85, 1.0) * ring * 0.08;
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        c = mix(vec3(l), c, saturation);
        c = mix(c, vec3(l) * vec3(0.75, 1.05, 1.2), slow * 0.45);
        c = c * gain + lift;
        float r = length(c0 * vec2(asp.x * 0.78, 1.0));
        float edge = smoothstep(0.32, 0.92, r);
        c = mix(c, c * vec3(1.5, 0.45, 0.4) + vec3(0.12, 0.0, 0.0), damage * edge);
        c *= mix(1.0, smoothstep(1.15, 0.28, r), vignette);
        c += (hash(vUv * resolution + fract(time) * 91.7) - 0.5) * grain * (0.03 + l * 0.12);
        gl_FragColor = vec4(safe(c), 1.0);
      }`,
  });
  pass.waves = waves;
  return pass;
}
