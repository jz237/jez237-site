// Whole-film light steady rain (DRESS v2, exterior). Everything is computed in shaders from t + the camera, so any
// frame order gives the same picture (no accumulated state).
//  - streaks: drops fixed in WORLD space, wrapped into a box around the camera (no popping when the camera moves).
//    Each streak is the drop's motion during a ~1/50 s exposure (~15 cm), drawn at least 1 px wide with alpha =
//    true width / drawn width (thin, never "scratches"); faded out near the lens (<~2.5 m) and far away. They are
//    lit ONLY by the real lamps (world cobra heads with their cones + the failing light's flicker, lit porch lights,
//    the 3609 doorway, the hero pumpkin) with a strong forward-scatter lobe, so the rain shows mainly in lamp light
//    and against it, and is nearly invisible in the dark.
//  - splashes: tiny expanding rings on the ground near the camera (ground height from a baked height texture).
//  - drips: drops falling from the 3607 door canopy, the 3605 rail, the 3609 stoop edge, ... where the camera is close.
// Enclosures (car A cabin, under car B, the 3609 room) never contain rain; rain outside them stays visible through
// their windows. No full-screen quad anywhere.
import * as THREE from 'three';
import { HERO, kitPoint } from './site.js';
import { CUES, PLACES } from '../film/cues.js';
import { windAt } from './timings.js';
import { heroFlameLevel } from './dressing.js';
import { hash1 } from './util.js';
import { ROOM3609 } from './room3609.js';

const COUNTS = {
  high: { streaks: 9000, splashes: 700, drips: 24 },
  medium: { streaks: 5000, splashes: 350, drips: 16 },
  low: { streaks: 2200, splashes: 0, drips: 8 },
};
const BOX = 30;          // horizontal wrap box (m) around the camera
const BOX_H = 14;        // vertical wrap height (m)
const FALL = 7.0;        // m/s (light rain)
const SHUTTER = 1 / 48;  // streak length = speed * shutter (~15 cm)
const DROP_W = 0.0011;   // physical drop width (m)
const MAX_LAMPS = 16;
const MAX_BOXES = 4;

// gfx pass 2026-10-16: keep the rain out of override-material passes (post GTAO normal/depth, depth prepass): with
// the override material the instanced quads would draw at their raw unit-quad positions near the world origin
function skipOverridePasses(mesh) {
  const own = mesh.material;
  mesh.onBeforeRender = (r, s, c, geometry, material) => { if (material !== own) geometry.drawRange.count = 0; };
  mesh.onAfterRender = (r, s, c, geometry) => { geometry.drawRange.count = Infinity; };
  return mesh;
}

// ---------------------------------------------------------------- shared GLSL
const LAMP_GLSL = /* glsl */`
  uniform vec4 uLampPos[${MAX_LAMPS}];   // xyz, intensity (already x flicker x enabled)
  uniform vec4 uLampDir[${MAX_LAMPS}];   // xyz spot direction, w = cos(outer cone) (-2 = point light)
  uniform vec3 uLampCol[${MAX_LAMPS}];
  uniform float uAmbient, uGain;
  vec3 rainLight(vec3 wp, vec3 viewDir) {
    vec3 acc = vec3(uAmbient);
    for (int i = 0; i < ${MAX_LAMPS}; i++) {
      vec4 L = uLampPos[i];
      if (L.w <= 0.0) continue;
      vec3 d = wp - L.xyz;
      float r2 = max(dot(d, d), 0.25);
      vec3 dn = d * inversesqrt(r2);
      float cone = uLampDir[i].w < -1.5 ? 1.0 : smoothstep(uLampDir[i].w - 0.06, uLampDir[i].w + 0.08, dot(dn, uLampDir[i].xyz));
      // forward scatter: a drop between the camera and the lamp lights up strongly (dn = lamp -> drop,
      // viewDir = camera -> drop; backlit when dn ~ -viewDir)
      float fs = max(dot(dn, -viewDir), 0.0);
      float phase = 0.25 + 3.0 * pow(fs, 5.0) + 0.8 * pow(fs, 1.5);
      acc += uLampCol[i] * (L.w * cone * phase / r2);
    }
    return acc * uGain;
  }`;
const BOX_GLSL = /* glsl */`
  uniform vec3 uBoxMin[${MAX_BOXES}];
  uniform vec3 uBoxMax[${MAX_BOXES}];
  float inBoxes(vec3 p) {
    for (int i = 0; i < ${MAX_BOXES}; i++) {
      vec3 a = uBoxMin[i], b = uBoxMax[i];
      if (p.x > a.x && p.x < b.x && p.y > a.y && p.y < b.y && p.z > a.z && p.z < b.z) return 1.0;
    }
    return 0.0;
  }`;
const GROUND_GLSL = /* glsl */`
  uniform sampler2D uGround;  // R = ground height (m); covers uGroundRect (x0, z0, x1, z1)
  uniform vec4 uGroundRect;
  float groundAt(vec2 xz) {
    vec2 uv = (xz - uGroundRect.xy) / (uGroundRect.zw - uGroundRect.xy);
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return -0.3;
    return texture2D(uGround, uv).r;
  }`;

function commonUniforms(shared) {
  return {
    uTime: shared.uTime, uWind: shared.uWind, uLampPos: shared.uLampPos, uLampDir: shared.uLampDir, uLampCol: shared.uLampCol,
    uAmbient: shared.uAmbient, uBoxMin: shared.uBoxMin, uBoxMax: shared.uBoxMax, uGround: shared.uGround, uGroundRect: shared.uGroundRect,
    uPxPerM: shared.uPxPerM, uViewport: shared.uViewport,
  };
}

// ---------------------------------------------------------------- streaks
// mode 'camera': drops wrapped in a box around the camera (close rain); mode 'lamps': world-fixed rain columns under
// each lamp (uVol: xyz = lamp, w = column radius; uVolG: xz centre of the column on the ground) - this is where the
// rain shows, also far from the camera.
const MAX_VOLS = 16;
function buildStreaks(count, shared, mode = 'camera', volOf = null) {
  const base = new THREE.PlaneGeometry(1, 1, 1, 1); base.translate(0, 0.5, 0);   // x -0.5..0.5 across, y 0..1 head->tail
  const ig = new THREE.InstancedBufferGeometry();
  ig.index = base.index; ig.setAttribute('position', base.attributes.position);
  const seed = new Float32Array(count * 4), vol = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    seed[i * 4] = hash1(i * 3 + 1 + (mode === 'lamps' ? 7777 : 0)); seed[i * 4 + 1] = hash1(i * 7 + 2); seed[i * 4 + 2] = hash1(i * 11 + 3); seed[i * 4 + 3] = hash1(i * 13 + 4);
    vol[i] = volOf ? volOf(i) : 0;
  }
  ig.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4));
  ig.setAttribute('aVol', new THREE.InstancedBufferAttribute(vol, 1));
  ig.instanceCount = count;
  const u = { ...commonUniforms(shared), uGain: { value: 1.0 }, uOpacity: { value: 1.0 }, uVol: shared.uVol, uVolG: shared.uVolG };
  const placeCamera = /* glsl */`
        vec3 p0 = vec3(aSeed.x * ${BOX.toFixed(1)}, aSeed.y * ${BOX_H.toFixed(1)}, aSeed.z * ${BOX.toFixed(1)}) + vel * uTime;
        vec3 rel = p0 - cam;
        rel.x = mod(rel.x + ${(BOX / 2).toFixed(1)}, ${BOX.toFixed(1)}) - ${(BOX / 2).toFixed(1)};
        rel.z = mod(rel.z + ${(BOX / 2).toFixed(1)}, ${BOX.toFixed(1)}) - ${(BOX / 2).toFixed(1)};
        rel.y = mod(rel.y + ${(BOX_H * 0.35).toFixed(2)}, ${BOX_H.toFixed(1)}) - ${(BOX_H * 0.35).toFixed(2)};
        vec3 head = cam + rel;
        float farFade = 1.0 - smoothstep(10.0, ${(BOX / 2 - 0.5).toFixed(1)}, max(abs(rel.x), abs(rel.z)));`;
  const placeLamps = /* glsl */`
        int vi = int(aVol + 0.5);
        vec4 V = uVol[vi];
        vec2 G = uVolG[vi].xy;
        float rr = V.w * sqrt(aSeed.x), ang = 6.2832 * aSeed.z;
        vec2 xz0 = G + vec2(cos(ang), sin(ang)) * rr;
        float top = V.y + 0.4;
        float gnd = groundAt(xz0);
        float Hh = max(top - gnd, 0.5);
        float yy = gnd + mod(aSeed.y * Hh - speed * uTime, Hh);
        vec3 head = vec3(xz0.x, yy, xz0.y) + vec3(vel.x, 0.0, vel.z) * ((top - yy) / speed);
        vec3 rel = head - cam;
        float farFade = (V.w > 0.0 ? 1.0 : 0.0) * (1.0 - smoothstep(38.0, 48.0, length(rel)));`;
  const mat = new THREE.ShaderMaterial({
    name: mode === 'lamps' ? 'RainStreaksLamps' : 'RainStreaks', uniforms: u, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uTime, uWind, uPxPerM, uOpacity;
      uniform vec2 uViewport;
      uniform vec4 uVol[${MAX_VOLS}];
      uniform vec4 uVolG[${MAX_VOLS}];
      attribute vec4 aSeed;
      attribute float aVol;
      varying vec3 vCol;
      varying float vA;
      varying float vAcross;
      ${LAMP_GLSL}
      ${BOX_GLSL}
      ${GROUND_GLSL}
      void main() {
        vec3 cam = cameraPosition;
        float speed = ${FALL.toFixed(2)} * (0.85 + 0.3 * aSeed.w);
        vec3 vel = vec3(0.55 * uWind, -speed, 0.22 * uWind);
        ${mode === 'lamps' ? placeLamps : placeCamera}
        vec3 tail = head - vel * ${SHUTTER.toFixed(4)};
        float dist = length(rel);
        float g = groundAt(head.xz);
        float alive = step(g, tail.y) * (1.0 - inBoxes(head)) * (1.0 - inBoxes(tail));
        vec4 c0 = projectionMatrix * viewMatrix * vec4(head, 1.0);
        vec4 c1 = projectionMatrix * viewMatrix * vec4(tail, 1.0);
        float w0 = max(c0.w, 0.05), w1 = max(c1.w, 0.05);
        vec2 s0 = c0.xy / w0 * uViewport * 0.5, s1 = c1.xy / w1 * uViewport * 0.5;     // pixels
        vec2 ax = s1 - s0;
        float lenPx = length(ax);
        vec2 dir = lenPx > 1e-3 ? ax / lenPx : vec2(0.0, -1.0);
        vec2 nrm = vec2(-dir.y, dir.x);
        float truePx = ${DROP_W.toFixed(4)} * uPxPerM / w0;
        float drawPx = max(truePx, 1.1);
        vec4 c = mix(c0, c1, position.y);
        float wc = max(c.w, 0.05);
        c.xy += nrm * position.x * drawPx / (uViewport * 0.5) * wc;
        vec3 viewDir = normalize(head - cam);
        vCol = rainLight(head, viewDir);
        float nearFade = smoothstep(1.6, 3.6, dist);
        float energy = clamp(26.0 / max(lenPx, 1.0), 0.35, 1.0);
        vA = uOpacity * alive * nearFade * farFade * (truePx / drawPx) * energy * step(0.06, c0.w) * step(0.06, c1.w);
        vAcross = position.x * 2.0;
        gl_Position = c;
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vCol;
      varying float vA;
      varying float vAcross;
      void main() {
        float a = vA * (1.0 - vAcross * vAcross * 0.6);
        if (a < 0.002) discard;
        gl_FragColor = vec4(vCol * a, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(ig, mat);
  mesh.frustumCulled = false; mesh.name = mode === 'lamps' ? 'RainStreaksLamps' : 'RainStreaks'; mesh.renderOrder = 6; skipOverridePasses(mesh);
  return { mesh, uniforms: u, maxCount: count };
}
// ---------------------------------------------------------------- splash rings on the ground near the camera
function buildSplashes(count, shared) {
  if (!count) return null;
  const base = new THREE.PlaneGeometry(1, 1); base.rotateX(-Math.PI / 2);
  const ig = new THREE.InstancedBufferGeometry();
  ig.index = base.index; ig.setAttribute('position', base.attributes.position); ig.setAttribute('uv', base.attributes.uv);
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) { seed[i * 4] = hash1(i * 5 + 11); seed[i * 4 + 1] = hash1(i * 9 + 12); seed[i * 4 + 2] = 0.55 + 0.6 * hash1(i * 17 + 13); seed[i * 4 + 3] = hash1(i * 23 + 14); }
  ig.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4));
  ig.instanceCount = count;
  const R = 7.0;
  const u = { ...commonUniforms(shared), uGain: { value: 1.0 }, uOpacity: { value: 1.0 } };
  const mat = new THREE.ShaderMaterial({
    name: 'RainSplashes', uniforms: u, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    vertexShader: /* glsl */`
      uniform float uTime, uOpacity;
      attribute vec4 aSeed;
      varying vec2 vUv;
      varying float vPh;
      varying vec3 vCol;
      varying float vA;
      ${LAMP_GLSL}
      ${BOX_GLSL}
      ${GROUND_GLSL}
      float h(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
      void main() {
        vUv = uv;
        float period = aSeed.z;
        float cyc = uTime / period + aSeed.w;
        float k = floor(cyc);
        vPh = fract(cyc) * period / 0.28;                 // 0..1 over the 0.28 s life of the ring
        // a fresh WORLD position each cycle (tiled 14 m box wrapped around the camera: fixed in the world)
        vec3 cam = cameraPosition;
        vec2 sxz = vec2(h(k * 1.7 + aSeed.x * 91.0), h(k * 2.3 + aSeed.y * 57.0)) * 14.0;
        vec2 relxz = mod(sxz - cam.xz + 7.0, 14.0) - 7.0;
        vec2 xz = cam.xz + relxz;
        float r = length(relxz);
        float g = groundAt(xz) + 0.004;
        vec3 wp = vec3(xz.x, g, xz.y);
        float size = 0.05 + 0.03 * aSeed.x;
        vec3 p = wp + vec3(position.x, 0.0, position.z) * size;
        vCol = rainLight(wp + vec3(0.0, 0.05, 0.0), normalize(wp - cam));
        vA = uOpacity * step(vPh, 1.0) * (1.0 - inBoxes(wp + vec3(0.0, 0.05, 0.0))) * (1.0 - smoothstep(4.5, ${R.toFixed(1)}, r));
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      varying float vPh;
      varying vec3 vCol;
      varying float vA;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float rad = 0.15 + 0.8 * sqrt(clamp(vPh, 0.0, 1.0));
        float ring = exp(-pow((d - rad) / 0.07, 2.0));
        float dot0 = exp(-d * d * 40.0) * (1.0 - smoothstep(0.0, 0.25, vPh)) * 2.0;    // the impact itself
        float a = vA * (ring * (1.0 - vPh) + dot0) * 0.9;
        if (a < 0.003) discard;
        gl_FragColor = vec4(vCol * a, 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(ig, mat);
  mesh.frustumCulled = false; mesh.name = 'RainSplashes'; mesh.renderOrder = 5; skipOverridePasses(mesh);
  return { mesh, uniforms: u, maxCount: count };
}

// ---------------------------------------------------------------- drips from edges near the camera
function buildDrips(count, shared, emitters) {
  const base = new THREE.PlaneGeometry(1, 1); base.translate(0, 0.5, 0);
  const ig = new THREE.InstancedBufferGeometry();
  ig.index = base.index; ig.setAttribute('position', base.attributes.position);
  const n = Math.min(count, emitters.length);
  const em = new Float32Array(n * 4), prm = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const e = emitters[i];
    em[i * 4] = e.p.x; em[i * 4 + 1] = e.p.y; em[i * 4 + 2] = e.p.z; em[i * 4 + 3] = e.floor;
    prm[i * 4] = e.period; prm[i * 4 + 1] = hash1(i * 29 + 5); prm[i * 4 + 2] = e.close ?? 3.5; prm[i * 4 + 3] = 0;
  }
  ig.setAttribute('aEm', new THREE.InstancedBufferAttribute(em, 4));
  ig.setAttribute('aPrm', new THREE.InstancedBufferAttribute(prm, 4));
  ig.instanceCount = n;
  const u = { ...commonUniforms(shared), uGain: { value: 1.0 }, uOpacity: { value: 1.0 } };
  const mat = new THREE.ShaderMaterial({
    name: 'RainDrips', uniforms: u, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uTime, uPxPerM, uOpacity;
      uniform vec2 uViewport;
      attribute vec4 aEm, aPrm;
      varying vec3 vCol;
      varying float vA;
      ${LAMP_GLSL}
      ${BOX_GLSL}
      void main() {
        float period = aPrm.x;
        float tau = mod(uTime + aPrm.y * period, period) - 0.35;   // 0.35 s hanging/growing at the edge, then falls
        float fallT = max(tau, 0.0);
        vec3 head = aEm.xyz - vec3(0.0, 4.905 * fallT * fallT, 0.0);
        float v = 9.81 * fallT;
        vec3 tail = head + vec3(0.0, max(v * ${SHUTTER.toFixed(4)}, 0.006), 0.0);
        float alive = step(aEm.w, head.y) * (1.0 - inBoxes(head));
        vec3 cam = cameraPosition;
        float dist = distance(head, cam);
        vec4 c0 = projectionMatrix * viewMatrix * vec4(head, 1.0);
        vec4 c1 = projectionMatrix * viewMatrix * vec4(tail, 1.0);
        vec2 s0 = c0.xy / max(c0.w, 0.05) * uViewport * 0.5, s1 = c1.xy / max(c1.w, 0.05) * uViewport * 0.5;
        vec2 ax = s1 - s0; float lp = length(ax);
        vec2 dir = lp > 1e-3 ? ax / lp : vec2(0.0, 1.0);
        vec2 nrm = vec2(-dir.y, dir.x);
        float truePx = 0.0035 * uPxPerM / max(c0.w, 0.05);
        float drawPx = max(truePx, 1.2);
        vec4 c = mix(c0, c1, position.y);
        c.xy += nrm * position.x * drawPx / (uViewport * 0.5) * max(c.w, 0.05);
        vCol = rainLight(head, normalize(head - cam)) * 1.6;
        vA = uOpacity * alive * (1.0 - smoothstep(aPrm.z * 0.7, aPrm.z, dist)) * smoothstep(0.25, 0.6, dist) * min(1.0, truePx / drawPx * 1.5) * step(0.06, c0.w);
        gl_Position = c;
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vCol;
      varying float vA;
      void main() { if (vA < 0.003) discard; gl_FragColor = vec4(vCol * vA, 1.0); }`,
  });
  const mesh = new THREE.Mesh(ig, mat);
  mesh.frustumCulled = false; mesh.name = 'RainDrips'; mesh.renderOrder = 6; skipOverridePasses(mesh);
  return { mesh, uniforms: u, count: n };
}

// ---------------------------------------------------------------- helpers
function bakeGround(ctx) {
  const x0 = -8, x1 = 8, z0 = -32, z1 = 30, cell = 0.25;
  const nx = Math.round((x1 - x0) / cell) + 1, nz = Math.round((z1 - z0) / cell) + 1;
  const data = new Float32Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) data[j * nx + i] = ctx.groundY(x0 + i * cell, z0 + j * cell);
  const tex = new THREE.DataTexture(data, nx, nz, THREE.RedFormat, THREE.FloatType);
  tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter; tex.needsUpdate = true;
  return { tex, rect: new THREE.Vector4(x0, z0, x1, z1) };
}
function carBox(place, groundY, pad = 0.04) {
  if (!place) return null;
  const c = Math.cos(place.yaw || 0), s = Math.sin(place.yaw || 0);
  const hl = 2.38 + pad, hw = 0.93 + pad;
  const xs = [], zs = [];
  for (const [a, b] of [[hl, hw], [hl, -hw], [-hl, hw], [-hl, -hw]]) { xs.push(place.x + b * c + a * s); zs.push(place.z - b * s + a * c); }
  const g = groundY(place.x, place.z);
  return new THREE.Box3(new THREE.Vector3(Math.min(...xs), g - 0.3, Math.min(...zs)), new THREE.Vector3(Math.max(...xs), g + 1.6, Math.max(...zs)));
}
function roomBox() {
  const it = HERO.door3609;
  const { XL, XR, BW, H } = ROOM3609;
  const a = kitPoint(it, -XL, -0.2, -0.2), b = kitPoint(it, -XR, BW - 2.4, H + 0.6);   // kit bx = -local x, by = local z
  return new THREE.Box3(new THREE.Vector3(Math.min(a.x, b.x), a.y, Math.min(a.z, b.z)), new THREE.Vector3(Math.max(a.x, b.x) + 0.0, b.y, Math.max(a.z, b.z)));
}
function dripEmitters(ctx) {
  const E = [];
  const add = (p, floor, period, close = 3.5) => E.push({ p, floor, period, close });
  const st7 = HERO.steps3607, st9 = HERO.steps3609, st5 = HERO.steps3605;
  // 3607 door canopy front edge (P1: drops fall past the hero pumpkin onto the landing / steps)
  for (let i = 0; i < 7; i++) {
    const bx = -0.62 + i * 0.2 + 0.05 * hash1(i + 40);
    const p = kitPoint(st7, bx, 0.56 + 0.02 * hash1(i + 50), 2.74);
    const by = 0.56;
    const floorY = by < 0.546 ? st7.p[1] + 0.54 : by < 0.83 ? st7.p[1] + 0.36 : st7.p[1] + 0.18;
    add(p, floorY, 1.15 + 0.8 * hash1(i + 60), 4.0);
  }
  // 3605 iron rail (bottom rail ends) and the 3609 / 3607 landing nosings
  if (st5) for (const by of [0.3, 0.75]) add(kitPoint(st5, -0.66, by, 0.98 - by * 0.6), ctx.groundY(kitPoint(st5, -0.66, by, 0).x, kitPoint(st5, -0.66, by, 0).z), 0.9 + 0.5 * hash1(by * 10), 3.0);
  for (const st of [st9, st7]) for (const bx of [-0.45, 0.1, 0.48]) { const p = kitPoint(st, bx, 0.55, 0.535); add(p, st.p[1] + 0.36, 1.1 + 0.8 * hash1(bx * 7 + st.p[2]), 2.6); }
  return E;
}

// ---------------------------------------------------------------- lamps (world + story)
function collectLamps(ctx) {
  const out = [];
  const L = ctx.world && ctx.world.lights;
  if (L) {
    for (const [k, e] of Object.entries(L)) {
      if (!e || typeof e !== 'object' || !e.position || k === 'failing') continue;
      if (e.kind === 'cobra') {
        out.push({ id: e.id, pos: (e.lightPos || e.position).clone(), dir: (e.dir || new THREE.Vector3(0, -1, 0)).clone(), cos: Math.cos(Math.min(1.45, (e.angle || 0.9) * 1.05)),
          col: (e.color ? e.color.clone() : new THREE.Color(0.85, 0.9, 1.0)), I: 1.0, k: e.k || (() => 1), weight: 1.0 });
      } else if (e.lit && e.intensity > 0) {
        out.push({ id: e.id, pos: (e.lightPos || e.position).clone(), dir: null, cos: -2, col: (e.color ? e.color.clone() : new THREE.Color(1, 0.75, 0.45)), I: 0.25, k: () => 1, weight: 0.5 });
      }
    }
  }
  if (!out.length && PLACES.failingLight) {
    const f = PLACES.failingLight;
    out.push({ id: 'failingLight', pos: new THREE.Vector3(f.x, f.y, f.z), dir: new THREE.Vector3(0.25, -1, 0).normalize(), cos: Math.cos(1.0), col: new THREE.Color(0.85, 0.9, 1.0), I: 1.0, k: () => 1, weight: 1 });
  }
  // story lights that matter for close rain: the 3609 doorway (warm, while ajar) and the hero pumpkin (P1)
  const d9 = HERO.door3609;
  if (d9) out.push({ id: 'door3609', pos: kitPoint(d9, 0.0, 0.25, 1.7), dir: null, cos: -2, col: new THREE.Color(1.0, 0.62, 0.32), I: 0.07, k: (t) => (t < CUES.doorEnter ? 1 : 0), weight: 2 });
  const st7 = HERO.steps3607;
  if (st7) out.push({ id: 'heroPumpkin', pos: kitPoint(st7, 0.40, 0.34, 0.75), dir: null, cos: -2, col: new THREE.Color(1.0, 0.5, 0.16), I: 0.03, k: (t) => heroFlameLevel(t), weight: 3 });
  return out;
}

// default "inside" window (also wired by the lead: main.js setInside((t) => shots.spaceAt(t) !== 'exterior'))
function defaultInsideAt(t) {
  return (t >= CUES.shotC1 && t < CUES.carDoorOpen) || (t >= CUES.shotU1 && t < CUES.standUp) || (t >= CUES.doorEnter && t < CUES.cutToBlack);
}

export async function buildRain(ctx) {
  const group = new THREE.Group(); group.name = 'Rain';
  const counts = COUNTS[ctx.quality] || COUNTS.high;
  const ground = bakeGround(ctx);
  const boxes = [carBox(PLACES.carA, ctx.groundY), carBox(PLACES.carB, ctx.groundY), roomBox()].filter(Boolean);
  const far = new THREE.Vector3(1e6, 1e6, 1e6);
  const shared = {
    uTime: { value: 0 }, uWind: { value: 0 }, uAmbient: { value: 0.004 },
    uLampPos: { value: Array.from({ length: MAX_LAMPS }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uLampDir: { value: Array.from({ length: MAX_LAMPS }, () => new THREE.Vector4(0, -1, 0, -2)) },
    uLampCol: { value: Array.from({ length: MAX_LAMPS }, () => new THREE.Vector3()) },
    uBoxMin: { value: Array.from({ length: MAX_BOXES }, (_, i) => (boxes[i] ? boxes[i].min.clone() : far.clone())) },
    uBoxMax: { value: Array.from({ length: MAX_BOXES }, (_, i) => (boxes[i] ? boxes[i].max.clone() : far.clone())) },
    uGround: { value: ground.tex }, uGroundRect: { value: ground.rect },
    uPxPerM: { value: 900 }, uViewport: { value: new THREE.Vector2(1280, 720) },
    uVol: { value: Array.from({ length: MAX_VOLS }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uVolG: { value: Array.from({ length: MAX_VOLS }, () => new THREE.Vector4(0, 0, 0, 0)) },
  };
  const streaks = buildStreaks(COUNTS.high.streaks, shared);
  streaks.mesh.geometry.instanceCount = counts.streaks;
  group.add(streaks.mesh);
  // rain columns under the lamps (world-fixed): cobra heads get a wide column along their cone, lit porch lights a
  // narrow one; instances are assigned to columns by a weighted hash so a lower quality thins every column evenly
  const lampsForVols = collectLamps(ctx).filter((l) => l.id !== 'heroPumpkin' && l.id !== 'door3609').slice(0, MAX_VOLS);
  const volW = [];
  lampsForVols.forEach((l, i) => {
    const cobra = !!l.dir;
    const gy0 = ctx.groundY(l.pos.x, l.pos.z);
    let g = new THREE.Vector2(l.pos.x, l.pos.z);
    if (cobra) { const tt = 0.5 * (l.pos.y - gy0) / Math.max(0.3, -l.dir.y); g = new THREE.Vector2(l.pos.x + l.dir.x * tt, l.pos.z + l.dir.z * tt); }
    shared.uVol.value[i].set(l.pos.x, l.pos.y, l.pos.z, cobra ? 2.7 : 1.1);
    shared.uVolG.value[i].set(g.x, g.y, 0, 0);
    volW.push(cobra ? 1.0 : 0.3);
  });
  const wSum = volW.reduce((a, b) => a + b, 0) || 1;
  const pickVol = (i) => { let r = hash1(i * 17 + 999) * wSum; for (let k = 0; k < volW.length; k++) { r -= volW[k]; if (r <= 0) return k; } return Math.max(0, volW.length - 1); };
  const LAMP_DROPS = { high: 6400, medium: 3600, low: 1800 };
  const lampStreaks = volW.length ? buildStreaks(LAMP_DROPS.high, shared, 'lamps', pickVol) : null;
  if (lampStreaks) { lampStreaks.mesh.geometry.instanceCount = LAMP_DROPS[ctx.quality] || LAMP_DROPS.high; group.add(lampStreaks.mesh); }
  const splashes = buildSplashes(COUNTS.high.splashes, shared);
  if (splashes) { splashes.mesh.geometry.instanceCount = counts.splashes; group.add(splashes.mesh); }
  const drips = buildDrips(COUNTS.high.drips, shared, dripEmitters(ctx));
  drips.mesh.geometry.instanceCount = Math.min(drips.count, counts.drips);
  group.add(drips.mesh);
  const lamps = collectLamps(ctx);
  const gains = { streaks: 16.0, lampStreaks: 40.0, splashes: 2.5, drips: 6.0 };   // calibrated for AgX exposure 1 (DRESS 17:05)
  streaks.uniforms.uGain.value = gains.streaks;
  if (lampStreaks) lampStreaks.uniforms.uGain.value = gains.lampStreaks;
  if (splashes) splashes.uniforms.uGain.value = gains.splashes;
  drips.uniforms.uGain.value = gains.drips;

  let insideFn = defaultInsideAt;
  let currentCounts = counts;
  let level = 1;   // global rain intensity (0..1.5)
  const cp = new THREE.Vector3(), size = new THREE.Vector2();
  const sel = lamps.map((l) => ({ l, s: 0 }));
  function update(t, camera) {
    shared.uTime.value = t;
    shared.uWind.value = 0.9 * windAt(t);
    if (camera) {
      camera.getWorldPosition(cp);
      if (ctx.renderer) { ctx.renderer.getDrawingBufferSize(size); shared.uViewport.value.copy(size); }
      const fov = camera.fov ? THREE.MathUtils.degToRad(camera.fov) : 0.8;
      shared.uPxPerM.value = shared.uViewport.value.y / (2 * Math.tan(fov / 2));
      // the MAX_LAMPS lamps that matter most for the camera (nearest, weighted); flicker/enable baked into w
      for (const e of sel) e.s = e.l.weight / (1 + e.l.pos.distanceToSquared(cp) * 0.01);
      sel.sort((a, b) => b.s - a.s);
      for (let i = 0; i < MAX_LAMPS; i++) {
        const e = sel[i];
        if (!e) { shared.uLampPos.value[i].w = 0; continue; }
        const L = e.l, k = Math.max(0, L.k(t));
        shared.uLampPos.value[i].set(L.pos.x, L.pos.y, L.pos.z, L.I * k);
        if (L.dir) shared.uLampDir.value[i].set(L.dir.x, L.dir.y, L.dir.z, L.cos); else shared.uLampDir.value[i].set(0, -1, 0, -2);
        shared.uLampCol.value[i].set(L.col.r, L.col.g, L.col.b);
      }
    }
    // inside an enclosure the rain keeps falling outside it (the shaders drop everything inside the boxes); when the
    // lead says "inside" but the camera is in none of our boxes (e.g. the black/title spaces), hide it
    const inside = !!insideFn(t);
    let inKnownBox = false;
    for (const b of boxes) if (b.containsPoint(cp)) inKnownBox = true;
    const show = !inside || inKnownBox;
    streaks.mesh.visible = show && level > 0;
    if (lampStreaks) { lampStreaks.mesh.visible = show && level > 0; lampStreaks.uniforms.uOpacity.value = level; }
    if (splashes) splashes.mesh.visible = !inside && level > 0;
    drips.mesh.visible = !inside && level > 0;
    streaks.uniforms.uOpacity.value = level;
    if (splashes) splashes.uniforms.uOpacity.value = level;
    drips.uniforms.uOpacity.value = level;
  }

  return {
    group,
    anchors: {},
    sources: [],
    api: {
      // primary hook (the lead's main.js): true while the camera is in an enclosure (car A, under car B, 3609)
      setInside(fn) { if (typeof fn === 'function') insideFn = fn; },
      // alias: setEnabled(fn(t) -> show rain) inverts the sense
      setEnabled(fn) { if (typeof fn === 'function') insideFn = (t) => !fn(t); },
      insideAt(t) { return insideFn(t); },
      setLevel(v) { level = Math.max(0, v); },          // global rain amount (default 1)
      setGain(part, v) { if (part === 'streaks') streaks.uniforms.uGain.value = v; else if (part === 'splashes' && splashes) splashes.uniforms.uGain.value = v; else if (part === 'drips') drips.uniforms.uGain.value = v; },
      setLightScale() { /* rain brightness follows the lamps, not the prop light scale */ },
      enclosures: boxes,
      lamps,
      get counts() { return currentCounts; },
    },
    setQuality(q) {
      const c = COUNTS[q] || COUNTS.high;
      currentCounts = c;
      streaks.mesh.geometry.instanceCount = Math.min(streaks.maxCount, c.streaks);
      if (lampStreaks) lampStreaks.mesh.geometry.instanceCount = Math.min(lampStreaks.maxCount, LAMP_DROPS[q] || LAMP_DROPS.high);
      if (splashes) splashes.mesh.geometry.instanceCount = Math.min(splashes.maxCount, c.splashes);
      drips.mesh.geometry.instanceCount = Math.min(drips.count, c.drips);
    },
    update,
  };
}
