// Procedural PBR textures, generated at boot (no image downloads).
import * as THREE from 'three';
import { mulberry32, clamp, smooth } from './util.js';

const S = 512;

// Tileable value noise with separate x/y cell counts (stretched grain for wood/rust streaks).
function vnoise(size, cx, cy, seed) {
  const rng = mulberry32(seed), g = new Float32Array(cx * cy);
  for (let i = 0; i < g.length; i++) g[i] = rng();
  const out = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    const fy = y / size * cy, y0 = Math.floor(fy), ty = smooth(fy - y0), r0 = (y0 % cy) * cx, r1 = ((y0 + 1) % cy) * cx;
    for (let x = 0; x < size; x++) {
      const fx = x / size * cx, x0 = Math.floor(fx), tx = smooth(fx - x0), c0 = x0 % cx, c1 = (x0 + 1) % cx;
      const a = g[r0 + c0] + (g[r0 + c1] - g[r0 + c0]) * tx;
      const b = g[r1 + c0] + (g[r1 + c1] - g[r1 + c0]) * tx;
      out[y * size + x] = a + (b - a) * ty;
    }
  }
  return out;
}
function fbm(size, cx, cy, oct, seed, gain = 0.5) {
  const out = new Float32Array(size * size);
  let amp = 1, tot = 0;
  for (let o = 0; o < oct; o++) {
    const n = vnoise(size, cx << o, cy << o, seed + o * 101);
    for (let i = 0; i < out.length; i++) out[i] += n[i] * amp;
    tot += amp; amp *= gain;
  }
  for (let i = 0; i < out.length; i++) out[i] /= tot;
  return out;
}
function contrast(a, lo, hi) { for (let i = 0; i < a.length; i++) a[i] = clamp((a[i] - lo) / (hi - lo), 0, 1); return a; }

function tex(data, size, srgb, repeat = true) {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

// Build albedo / ORM (G rough, B metal) / normal textures from per-pixel callbacks.
function pbr(size, fn, normalStrength = 2) {
  const n = size * size, col = new Uint8Array(n * 4), orm = new Uint8Array(n * 4), nor = new Uint8Array(n * 4), h = new Float32Array(n);
  const o = { r: 0, g: 0, b: 0, rough: 0.5, metal: 0, h: 0 };
  for (let i = 0; i < n; i++) {
    o.h = 0; fn(i, i % size, (i / size) | 0, o);
    col[i * 4] = clamp(o.r, 0, 1) * 255; col[i * 4 + 1] = clamp(o.g, 0, 1) * 255; col[i * 4 + 2] = clamp(o.b, 0, 1) * 255; col[i * 4 + 3] = 255;
    orm[i * 4] = 255; orm[i * 4 + 1] = clamp(o.rough, 0.02, 1) * 255; orm[i * 4 + 2] = clamp(o.metal, 0, 1) * 255; orm[i * 4 + 3] = 255;
    h[i] = o.h;
  }
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const dx = h[y * size + (x + 1) % size] - h[y * size + (x - 1 + size) % size];
    const dy = h[((y + 1) % size) * size + x] - h[((y - 1 + size) % size) * size + x];
    let nx = -dx * normalStrength, ny = -dy * normalStrength, nz = 1;
    const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    nor[i * 4] = (nx * .5 + .5) * 255; nor[i * 4 + 1] = (ny * .5 + .5) * 255; nor[i * 4 + 2] = (nz * .5 + .5) * 255; nor[i * 4 + 3] = 255;
  }
  return { map: tex(col, size, true), orm: tex(orm, size, false), normal: tex(nor, size, false) };
}

const hex = (h) => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];
const mix3 = (o, a, b, t) => { o.r = a[0] + (b[0] - a[0]) * t; o.g = a[1] + (b[1] - a[1]) * t; o.b = a[2] + (b[2] - a[2]) * t; };

function beamTex() {
  const n1 = fbm(S, 4, 4, 5, 11), streak = contrast(fbm(S, 24, 2, 3, 23), .45, .8), chip = fbm(S, 16, 16, 4, 37), pit = vnoise(S, 128, 128, 41);
  const A = hex(0x7a2c19), B = hex(0xa5462b), R = hex(0x5b3417), St = hex(0x55575a);
  return pbr(S, (i, x, y, o) => {
    mix3(o, A, B, n1[i]);
    const s = streak[i] * .55; o.r += (R[0] - o.r) * s; o.g += (R[1] - o.g) * s; o.b += (R[2] - o.b) * s;
    o.rough = .5 + n1[i] * .25 + s * .3; o.metal = .18; o.h = pit[i] * .08 + n1[i] * .1;
    if (chip[i] > .7) { const t = clamp((chip[i] - .7) * 12, 0, 1); o.r += (St[0] - o.r) * t; o.g += (St[1] - o.g) * t; o.b += (St[2] - o.b) * t; o.metal = .2 + .65 * t; o.rough = .55 - .2 * t; o.h -= .4 * t; }
  }, 2.5);
}

function deckTex() {
  const dirt = fbm(S, 4, 4, 5, 53), spec = vnoise(S, 96, 96, 59), cell = S / 16;
  return pbr(S, (i, x, y, o) => {
    const cxI = Math.floor(x / cell), cyI = Math.floor(y / cell);
    let u = (x % cell) / cell - .5, v = (y % cell) / cell - .5;
    const flip = (cxI + cyI) & 1 ? 1 : -1;
    const a = (u + flip * v) * .7071, b = (u - flip * v) * .7071;
    const d = (a * a) / .09 + (b * b) / .006;
    const lug = smooth(clamp((1 - d) * 2.2, 0, 1));
    const g = .42 + dirt[i] * .14 - (1 - dirt[i]) * .08 + spec[i] * .03;
    o.r = g * .96; o.g = g * .98; o.b = g; o.r += lug * .05; o.g += lug * .05; o.b += lug * .05;
    o.rough = .42 + (1 - dirt[i]) * .3 - lug * .12; o.metal = .75; o.h = lug * .9 + dirt[i] * .05;
  }, 3.5);
}

function plankTex() {
  const grain = fbm(S, 3, 48, 4, 71), knot = vnoise(S, 12, 12, 73), rng = mulberry32(77), rows = 8, tint = [], joint = [];
  for (let r = 0; r < rows; r++) { tint.push(.82 + rng() * .3); joint.push(rng()); }
  const A = hex(0xb9874d), B = hex(0x8a5a2c);
  return pbr(S, (i, x, y, o) => {
    const fr = y / S * rows, r = Math.floor(fr), fv = fr - r, u = x / S;
    const edge = Math.min(fv, 1 - fv) * S / rows, jd = Math.abs(((u - joint[r] + 1) % 1) - .5) * S;
    const gap = edge < 2 || jd > S * .5 - 2 ? 1 : 0;
    mix3(o, A, B, grain[i] * .9 + (knot[i] > .86 ? .6 : 0));
    o.r *= tint[r]; o.g *= tint[r]; o.b *= tint[r];
    if (gap) { o.r *= .25; o.g *= .22; o.b *= .2; }
    o.rough = .72 + grain[i] * .2; o.metal = 0; o.h = gap ? -1 : grain[i] * .25;
  }, 2.2);
}

function concreteTex() {
  const n = fbm(S, 4, 4, 6, 83), st = contrast(fbm(S, 2, 2, 3, 89), .5, .85), pore = vnoise(S, 160, 160, 97);
  return pbr(S, (i, x, y, o) => {
    const g = .4 + n[i] * .16 - st[i] * .1 - (pore[i] > .9 ? .08 : 0);
    const seam = (x % (S / 2) < 2 || y % (S / 2) < 2) ? .05 : 0;
    o.r = g * 1.03 - seam; o.g = g - seam; o.b = g * .94 - seam; o.rough = .88 + n[i] * .1; o.metal = 0;
    o.h = n[i] * .3 - (pore[i] > .9 ? .3 : 0) - seam * 4;
  }, 1.6);
}

function dirtTex() {
  const n = fbm(S, 6, 6, 6, 101), fine = vnoise(S, 180, 180, 103), peb = vnoise(S, 150, 150, 107), wetN = fbm(S, 2, 2, 4, 109);
  const A = hex(0x7d6446), B = hex(0x54412d), G = hex(0x8a857c);
  return pbr(S, (i, x, y, o) => {
    mix3(o, B, A, n[i] * .85 + fine[i] * .15);
    const u = x / S, rut = Math.max(0, 1 - Math.abs(((u * 2 + Math.sin(y / S * 6.283) * .06) % 1) - .5) * 9);
    const wet = clamp((wetN[i] - .58) * 5, 0, 1) * .3 + rut * .18;
    o.r *= 1 - wet; o.g *= 1 - wet; o.b *= 1 - wet * .9;
    let h = n[i] * .45 + fine[i] * .15 - rut * .4;
    if (peb[i] > .9) { const t = (peb[i] - .9) * 10; mix3(o, [o.r, o.g, o.b], G, t * .35); h += t * .5; }
    o.rough = .93 - wet * .5; o.metal = 0; o.h = h;
  }, 2.0);
}

function hazardTex() {
  const wear = fbm(S, 8, 8, 5, 113), Y = hex(0xf2b10a), K = hex(0x1c1a17), Gr = hex(0x6f6a62);
  return pbr(S, (i, x, y, o) => {
    const s = ((x + y) / S * 4) % 1;
    const c = s < .5 ? Y : K; o.r = c[0]; o.g = c[1]; o.b = c[2];
    const w = clamp((wear[i] - .66) * 6, 0, 1); mix3(o, [o.r, o.g, o.b], Gr, w);
    o.rough = .55 + w * .3; o.metal = w * .5; o.h = -w * .3;
  }, 1.5);
}

function corrTex() {
  const grime = contrast(fbm(S, 6, 2, 4, 127), .4, .9), rust = fbm(S, 8, 8, 4, 131), rows = 12;
  return pbr(S, (i, x, y, o) => {
    const f = (x / S * rows) % 1, ridge = clamp(Math.abs(f - .5) * 4 - .6, -.4, .4) / .4;
    const g = .86 - grime[i] * .3; o.r = g; o.g = g; o.b = g;
    if (rust[i] > .72) { const t = (rust[i] - .72) * 4; o.r = g * (1 - t) + .45 * t; o.g = g * (1 - t) + .25 * t; o.b = g * (1 - t) + .12 * t; }
    o.rough = .45 + grime[i] * .35; o.metal = .25; o.h = ridge;
  }, 1.2);
}

function brickTex() {
  const n = fbm(S, 8, 8, 4, 139), rng = mulberry32(141), tints = [];
  for (let k = 0; k < 256; k++) tints.push(.75 + rng() * .4);
  const A = hex(0x8e3b25), M = hex(0x8a8276);
  return pbr(S, (i, x, y, o) => {
    const rows = 16, cols = 8, fr = y / S * rows, r = Math.floor(fr), off = (r & 1) * .5;
    const fc = x / S * cols + off, c = Math.floor(fc), fu = fc - c, fv = fr - r;
    const mortar = fv < .1 || fu < .05;
    if (mortar) { o.r = M[0]; o.g = M[1]; o.b = M[2]; o.h = -1; o.rough = .95; }
    else { const t = tints[(r * 13 + c * 7) & 255] * (.85 + n[i] * .3); o.r = A[0] * t; o.g = A[1] * t; o.b = A[2] * t; o.h = n[i] * .2; o.rough = .82; }
    o.metal = 0;
  }, 2.0);
}

function asphaltTex() {
  const n = fbm(S, 8, 8, 5, 151), sp = vnoise(S, 200, 200, 157);
  return pbr(S, (i, x, y, o) => {
    const g = .16 + n[i] * .08 + (sp[i] > .85 ? .08 : 0); o.r = g; o.g = g; o.b = g * 1.05; o.rough = .9; o.metal = 0; o.h = n[i] * .2;
  }, 1);
}

// City facade: colour + emissive window maps. kind 0 = glass curtain wall, 1 = punched windows in stone.
function facadeTex(kind, seed) {
  const size = 256, cols = 8, rows = 8, n = size * size;
  const col = new Uint8Array(n * 4), emi = new Uint8Array(n * 4), rng = mulberry32(seed), lit = [];
  for (let k = 0; k < cols * rows; k++) lit.push(rng() < .38 ? (rng() < .75 ? [1, .78, .45] : [.75, .85, 1]) : null);
  const wall = kind === 2 ? [.45, .2, .14] : kind ? [.66, .6, .52] : [.15, .19, .24], glass = kind ? [.09, .11, .14] : [.24, .34, .42];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4, cx = x / size * cols, cy = y / size * rows, fx = cx % 1, fy = cy % 1;
    const win = kind ? (fx > .22 && fx < .78 && fy > .28 && fy < .78) : (fx > .04 && fx < .96 && fy > .1 && fy < .96);
    const L = lit[Math.floor(cy) * cols + Math.floor(cx)];
    const c = win ? glass : wall, shade = kind ? 1 : (.9 + .2 * fy);
    col[i] = c[0] * shade * 255; col[i + 1] = c[1] * shade * 255; col[i + 2] = c[2] * shade * 255; col[i + 3] = 255;
    if (win && L) { const f = .7 + .3 * Math.sin(fx * 3); emi[i] = L[0] * f * 255; emi[i + 1] = L[1] * f * 255; emi[i + 2] = L[2] * f * 255; }
    emi[i + 3] = 255;
  }
  return { map: tex(col, size, true), emissive: tex(emi, size, true) };
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// Signs and banners painted on canvas.
export function signTexture(lines, opts = {}) {
  const { w = 1024, h = 256, bg = '#f2b10a', fg = '#1c1a17', stripe = true, font = 'Bungee, Impact, sans-serif' } = opts;
  return canvasTex(w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    if (stripe) {
      g.save(); g.fillStyle = fg;
      for (let x = -h; x < w + h; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 24, 0); g.lineTo(x + 24 - 18, 18); g.lineTo(x - 18, 18); g.fill(); g.beginPath(); g.moveTo(x, h - 18); g.lineTo(x + 24, h - 18); g.lineTo(x + 6, h); g.lineTo(x - 18, h); g.fill(); }
      g.restore();
    }
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    const n = lines.length, lh = (h - (stripe ? 50 : 16)) / n;
    lines.forEach((t, k) => {
      let fs = lh * .78; g.font = `${fs}px ${font}`;
      while (g.measureText(t).width > w * .92 && fs > 8) { fs -= 2; g.font = `${fs}px ${font}`; }
      g.fillText(t, w / 2, h / 2 + (k - (n - 1) / 2) * lh);
    });
  });
}

export function plaidTexture() {
  return canvasTex(128, 128, (g) => {
    g.fillStyle = '#9c2a22'; g.fillRect(0, 0, 128, 128);
    g.globalAlpha = .55; g.fillStyle = '#2b1610';
    for (let k = 0; k < 128; k += 32) { g.fillRect(k + 8, 0, 10, 128); g.fillRect(0, k + 8, 128, 10); }
    g.globalAlpha = .35; g.fillStyle = '#e8c27a';
    for (let k = 0; k < 128; k += 32) { g.fillRect(k + 24, 0, 2, 128); g.fillRect(0, k + 24, 128, 2); }
  });
}

// Shared cut-away uniforms: upper geometry between the camera and Mac is dithered out.
export const CUT = { uCutPlayer: { value: new THREE.Vector3() }, uCutCam: { value: new THREE.Vector3() }, uCutOn: { value: 1 }, uCutR: { value: 3.0 } };
export function cutaway(mat) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, CUT);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vCutW;')
      .replace('#include <project_vertex>', `#include <project_vertex>
      vec4 cutW = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        cutW = instanceMatrix * cutW;
      #endif
      vCutW = (modelMatrix * cutW).xyz;`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vCutW; uniform vec3 uCutPlayer; uniform vec3 uCutCam; uniform float uCutOn; uniform float uCutR;`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
      if (uCutOn > 0.5 && vCutW.y > uCutPlayer.y + 2.2) {
        vec3 cb = uCutPlayer + vec3(0.0, 1.0, 0.0), ab = cb - uCutCam;
        float tt = clamp(dot(vCutW - uCutCam, ab) / dot(ab, ab), 0.0, 1.0);
        float dd = length(vCutW - (uCutCam + ab * tt));
        ivec2 bp = ivec2(mod(gl_FragCoord.xy, 4.0));
        float bm[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
        float nz = (bm[bp.x + bp.y * 4] + .5) / 16.;
        if (dd < uCutR - 0.55 + nz * 0.55) discard;
      }`);
  };
  mat.customProgramCacheKey = () => 'cut1';
  return mat;
}

export function buildMaterials(renderer, quality) {
  const aniso = Math.min(quality >= 2 ? 8 : 4, renderer.capabilities.getMaxAnisotropy());
  const std = (set, opts) => {
    for (const t of [set.map, set.orm, set.normal]) if (t) t.anisotropy = aniso;
    return new THREE.MeshStandardMaterial(Object.assign({ map: set.map, roughnessMap: set.orm, metalnessMap: set.orm, normalMap: set.normal, roughness: 1, metalness: 1 }, opts));
  };
  const M = {};
  M.beam = cutaway(std(beamTex(), { normalScale: new THREE.Vector2(.8, .8) }));
  M.deck = cutaway(std(deckTex(), { normalScale: new THREE.Vector2(1, 1) }));
  M.plank = cutaway(std(plankTex(), {}));
  M.concrete = cutaway(std(concreteTex(), {}));
  M.dirt = std(dirtTex(), { normalScale: new THREE.Vector2(1.2, 1.2) });
  M.hazard = cutaway(std(hazardTex(), {}));
  M.corrSet = corrTex();
  M.corr = (color) => cutaway(std(M.corrSet, { color: new THREE.Color(color) }));
  M.brick = cutaway(std(brickTex(), {}));
  M.asphalt = std(asphaltTex(), {});
  M.paint = (color, rough = .45, metal = .2) => cutaway(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));
  M.yellow = M.paint(0xf2b10a, .4, .25);
  M.galv = cutaway(new THREE.MeshStandardMaterial({ color: 0xb8bcc0, roughness: .35, metalness: .9 }));
  M.dark = cutaway(new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: .6, metalness: .6 }));
  M.rubber = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: .9, metalness: 0 });
  M.cable = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: .5, metalness: .8 });
  M.glass = cutaway(new THREE.MeshStandardMaterial({ color: 0x1d2a33, roughness: .08, metalness: .9 }));
  M.wood = cutaway(std(plankTex(), { color: 0xd8b38a }));
  M.facades = [[0, 201, .18, .75], [1, 203, .85, 0], [0, 207, .25, .6], [1, 211, .8, 0], [2, 213, .9, 0], [0, 217, .12, .85]].map(([k, seed, r, m]) => {
    const f = facadeTex(k, seed);
    return new THREE.MeshStandardMaterial({ map: f.map, emissiveMap: f.emissive, emissive: new THREE.Color(1, 1, 1), emissiveIntensity: 0, roughness: r, metalness: m, vertexColors: true });
  });
  M.glow = (color, i = 2) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(color), emissiveIntensity: i, roughness: 1, metalness: 0 });
  return M;
}
