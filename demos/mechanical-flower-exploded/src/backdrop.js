import * as THREE from 'three';
import { POSTER } from './spec.js';

// The composer's OutputPass applies NeutralToneMapping to everything, including the backdrop.
// The backdrop shader therefore writes the numerical inverse of that curve so the paper lands on its authored colour.

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function toTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  return t;
}

export function parchmentCanvas(scale = 1.5) {
  const W = Math.round(POSTER.w * scale);
  const H = Math.round(POSTER.h * scale);
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  const rnd = mulberry(20261005);

  const base = g.createRadialGradient(W * 0.5, H * 0.4, W * 0.08, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.62);
  base.addColorStop(0, 'rgb(240,235,225)');
  base.addColorStop(1, 'rgb(228,221,208)');
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);

  // soft blotches
  for (let i = 0; i < 170; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const r = (30 + rnd() * 150) * scale;
    const dark = rnd() < 0.6;
    const a = 0.012 + rnd() * 0.03;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    const col = dark ? '150,128,92' : '255,250,240';
    gr.addColorStop(0, `rgba(${col},${a})`);
    gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // low-frequency mottling
  const nw = 140;
  const nh = 175;
  const n = makeCanvas(nw, nh);
  const ng = n.getContext('2d');
  const img = ng.createImageData(nw, nh);
  for (let i = 0; i < nw * nh; i++) {
    const v = 128 + (rnd() - 0.5) * 70;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ng.putImageData(img, 0, 0);
  g.globalAlpha = 0.05;
  g.globalCompositeOperation = 'multiply';
  g.imageSmoothingEnabled = true;
  g.drawImage(n, 0, 0, W, H);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';

  // blueprint grid
  const minor = 7.3 * scale;
  const major = 73 * scale;
  g.lineWidth = Math.max(1, 0.55 * scale);
  g.strokeStyle = 'rgba(120,104,78,0.055)';
  g.beginPath();
  for (let x = 0; x <= W; x += minor) {
    g.moveTo(Math.round(x) + 0.5, 0);
    g.lineTo(Math.round(x) + 0.5, H);
  }
  for (let y = 0; y <= H; y += minor) {
    g.moveTo(0, Math.round(y) + 0.5);
    g.lineTo(W, Math.round(y) + 0.5);
  }
  g.stroke();
  g.lineWidth = Math.max(1, 0.8 * scale);
  g.strokeStyle = 'rgba(120,104,78,0.10)';
  g.beginPath();
  for (let x = 0; x <= W; x += major) {
    g.moveTo(Math.round(x) + 0.5, 0);
    g.lineTo(Math.round(x) + 0.5, H);
  }
  for (let y = 0; y <= H; y += major) {
    g.moveTo(0, Math.round(y) + 0.5);
    g.lineTo(W, Math.round(y) + 0.5);
  }
  g.stroke();

  // vignette
  const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.hypot(W, H) * 0.56);
  vg.addColorStop(0, 'rgba(120,98,64,0)');
  vg.addColorStop(1, 'rgba(120,98,64,0.10)');
  g.fillStyle = vg;
  g.fillRect(0, 0, W, H);
  return c;
}

export function studioCanvas(scale = 1) {
  const W = Math.round(POSTER.w * scale);
  const H = Math.round(POSTER.h * scale);
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(W * 0.5, H * 0.34, W * 0.05, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.6);
  gr.addColorStop(0, 'rgb(58,50,43)');
  gr.addColorStop(0.55, 'rgb(28,24,21)');
  gr.addColorStop(1, 'rgb(12,10,9)');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);
  const rnd = mulberry(7);
  const img = g.getImageData(0, 0, W, H);
  for (let i = 0; i < W * H; i++) {
    const v = (rnd() - 0.5) * 3;
    img.data[i * 4] += v;
    img.data[i * 4 + 1] += v;
    img.data[i * 4 + 2] += v;
  }
  g.putImageData(img, 0, 0);
  return c;
}

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uMapB;
  uniform float uMix;
  uniform float uInvert;
  varying vec2 vUv;
  vec3 neutral(vec3 color) {
    const float StartCompression = 0.8 - 0.04;
    const float Desaturation = 0.15;
    float x = min(color.r, min(color.g, color.b));
    float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
    color -= offset;
    float peak = max(color.r, max(color.g, color.b));
    if (peak < StartCompression) return color;
    float d = 1.0 - StartCompression;
    float newPeak = 1.0 - d * d / (peak + d - StartCompression);
    color *= newPeak / peak;
    float g = 1.0 - 1.0 / (Desaturation * (peak - newPeak) + 1.0);
    return mix(color, vec3(newPeak), g);
  }
  vec3 invNeutral(vec3 t) {
    vec3 x = t + 0.04;
    for (int i = 0; i < 16; i++) x += 0.9 * (t - neutral(x));
    return max(x, vec3(0.0));
  }
  void main() {
    vec3 t = mix(texture2D(uMap, vUv).rgb, texture2D(uMapB, vUv).rgb, uMix);
    gl_FragColor = vec4(uInvert > 0.5 ? invNeutral(t) : t, 1.0);
  }
`;

export function createBackdrop() {
  const textures = { poster: toTexture(parchmentCanvas(1.5)), studio: toTexture(studioCanvas(1)) };
  const material = new THREE.ShaderMaterial({
    uniforms: { uMap: { value: textures.poster }, uMapB: { value: textures.studio }, uMix: { value: 0 }, uInvert: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }',
    fragmentShader: FRAG,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  mesh.name = 'backdrop';
  return {
    mesh,
    setMix(m) {
      material.uniforms.uMix.value = m;
    },
  };
}
