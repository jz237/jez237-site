// Skin and faces, close up.
//
// Measured once per model (the geometry is shared by every animal of a species):
//   - aThin: how thin the body is at each vertex (the distance through to the opposite surface, found by
//     looking for facing-away vertices just behind it). Frills, plates, wing membranes and the edges of the
//     jaws are thin; light shines through them, warm and red, when they are between the sun and the eye.
//   - aNeck: how much of each vertex is carried by the neck bones (for the creases as the neck bends).
//   - the nostrils: the two hollows on the sides of the snout's top, found from the head's own skin.
// Per animal (uniforms on its own copy of the skin material):
//   - a mud line: wading leaves the legs and belly muddy and wet up to the water line; the mud darkens,
//     glistens, then dries paler and slowly flakes away;
//   - neck creases that deepen as the neck bends;
//   - a broken-up sheen (scales catch the light unevenly), glossier where wet;
//   - nostrils that flare a little with each breath and wide on a roar;
//   - wet skin: rivulets trickling down the flanks and beads standing on the back, glossy; in rain, tiny
//     splash rings popping on the upward faces.
//   - close up, the scales themselves: each species' own pattern (pebbly scales and scattered tubercles,
//     big polygonal plates, bony knobs, rosettes; grooves on a frill), in relief and shaded into the
//     crevices. Worked out per pixel from the skin's own bind-pose position, it sharpens in as the camera
//     comes closer and fades out where a scale would be smaller than a few pixels (so far views neither
//     shimmer nor pay for it).
// Also kept per model, for weather.js: the nostril and snout-tip vertices (breath) and a spread of the
// lowest, downward-facing vertices (chin, throat, belly, tail underside) where water drips from.
// Eyes: a lid of skin closes over the eyeball (blinks, drowsy half-closed, shut in sleep) and the
// eyeballs dart about in small, quick saccades.
import { BufferAttribute, BufferGeometry, Matrix4, Vector3, Vector2, Vector4, Color } from 'three';

const _v = new Vector3(), _n = new Vector3();

// warm lights at night that only the animals feel (the cabin's hearth through its windows, the jetty
// lantern, a lightning strike): view-space position, and colour with its reach in w. Shared by every
// skin; night.js fills them in each frame. Done in the skin's own shader so the rest of the scene pays
// nothing for them.
export const WARM = {
  uWarmPos: { value: [new Vector3(), new Vector3(), new Vector3(), new Vector3()] },
  uWarmCol: { value: [new Vector4(), new Vector4(), new Vector4(), new Vector4()] },
};
// eyeshine colour per species (light thrown back from behind the retina, in the dark)
export const SHINE = { trex: [1.0, 0.45, 0.12], triceratops: [0.55, 1.0, 0.35], stegosaurus: [0.9, 0.85, 0.3], brachiosaurus: [0.45, 0.9, 1.0], pteranodon: [1.0, 0.7, 0.3] };
const DEBUG = new URLSearchParams(location.search).get('skindebug') === '1'; // thin = red, mud = green, neck = blue

// positions and normals of a skinned mesh in the model's own space, in metres, in the bind pose. (The
// stored positions are quantised: the scale back to metres lives in the skeleton's bind matrices, so
// the vertices are put through the skinning to find where they really are.)
function modelSpace(mesh) {
  const pos = mesh.geometry.attributes.position, n = pos.count;
  const P = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    mesh.getVertexPosition(i, _v);
    P.set([_v.x, _v.y, _v.z], i * 3);
  }
  const tmp = new BufferGeometry();
  tmp.setAttribute('position', new BufferAttribute(P, 3));
  if (mesh.geometry.index) tmp.setIndex(mesh.geometry.index);
  tmp.computeVertexNormals();
  const N = tmp.attributes.normal.array;
  // metres per stored unit (for moving vertices in the stored space)
  mesh.geometry.computeBoundingBox();
  const bb = mesh.geometry.boundingBox;
  let zmin = 1e9, zmax = -1e9;
  for (let i = 0; i < n; i++) (zmin = Math.min(zmin, P[i * 3 + 2])), (zmax = Math.max(zmax, P[i * 3 + 2]));
  const perUnit = (zmax - zmin) / Math.max(1e-6, bb.max.z - bb.min.z);
  return { P, N, n, perUnit };
}

// the bone carrying most of each vertex
function boneOf(mesh, i) {
  const si = mesh.geometry.attributes.skinIndex, sw = mesh.geometry.attributes.skinWeight;
  let b = 0, w = -1;
  for (let c = 0; c < 4; c++) if (sw.getComponent(i, c) > w) (w = sw.getComponent(i, c)), (b = si.getComponent(i, c));
  return mesh.skeleton.bones[b];
}

export function prepareSkinGeometry(mesh) {
  const g = mesh.geometry;
  if (g.userData.jtSkin) return g.userData.jtSkin;
  const { P, N, n, perUnit } = modelSpace(mesh);
  // thickness: for each vertex, the nearest vertex behind it whose surface faces the other way
  const C = 0.11, grid = new Map(), key = (x, y, z) => x * 73856093 ^ y * 19349663 ^ z * 83492791;
  for (let i = 0; i < n; i++) {
    const k = key(Math.floor(P[i * 3] / C), Math.floor(P[i * 3 + 1] / C), Math.floor(P[i * 3 + 2] / C));
    let l = grid.get(k);
    if (!l) grid.set(k, (l = []));
    l.push(i);
  }
  const thin = new Float32Array(n), neck = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const px = P[i * 3], py = P[i * 3 + 1], pz = P[i * 3 + 2], nx = N[i * 3], ny = N[i * 3 + 1], nz = N[i * 3 + 2];
    const gx = Math.floor(px / C), gy = Math.floor(py / C), gz = Math.floor(pz / C);
    let th = 1, near = 0, flat = 0;
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++)
        for (let c = -1; c <= 1; c++) {
          const l = grid.get(key(gx + a, gy + b, gz + c));
          if (!l) continue;
          for (const j of l) {
            const dot = nx * N[j * 3] + ny * N[j * 3 + 1] + nz * N[j * 3 + 2];
            // flatness: neighbours on this side facing the same way (a plate or a frill, not a cone's tip)
            if (dot > 0 && Math.abs(P[j * 3] - px) + Math.abs(P[j * 3 + 1] - py) + Math.abs(P[j * 3 + 2] - pz) < 0.12) {
              near++;
              if (dot > 0.85) flat++;
            }
            if (dot > -0.5) continue;
            const dx = P[j * 3] - px, dy = P[j * 3 + 1] - py, dz = P[j * 3 + 2] - pz;
            const depth = -(dx * nx + dy * ny + dz * nz); // how far behind the surface
            if (depth <= 0.002) continue;
            const lat = Math.hypot(dx + nx * depth, dy + ny * depth, dz + nz * depth); // off the inward line
            if (lat > Math.max(0.03, depth * 0.6)) continue;
            if (depth < th) th = depth;
          }
        }
    const flatK = near > 3 ? Math.min(1, Math.max(0, (flat / near - 0.45) / 0.3)) : 0;
    thin[i] = (1 - Math.min(1, Math.max(0, (th - 0.03) / 0.09))) * flatK;
  }
  // neck weight, and the snout's nostrils (head-bone skin at the very front, facing sideways and up)
  const si = g.attributes.skinIndex, sw = g.attributes.skinWeight, bones = mesh.skeleton.bones;
  let zMax = -1e9, zMin = 1e9;
  const head = [];
  for (let i = 0; i < n; i++) {
    let w = 0;
    for (let c = 0; c < 4; c++) if (/^neck/.test(bones[si.getComponent(i, c)]?.name || '')) w += sw.getComponent(i, c);
    neck[i] = w;
    const b = boneOf(mesh, i);
    if (b?.name === 'head') {
      head.push(i);
      zMax = Math.max(zMax, P[i * 3 + 2]);
      zMin = Math.min(zMin, P[i * 3 + 2]);
    }
  }
  const nostrils = [];
  if (head.length) {
    const front = zMax - (zMax - zMin) * 0.16;
    for (const side of [-1, 1]) {
      let sx = 0, sy = 0, sz = 0, cnt = 0;
      for (const i of head) {
        if (P[i * 3 + 2] < front) continue;
        if (N[i * 3] * side < 0.35 || N[i * 3 + 1] < 0.1) continue;
        sx += P[i * 3];
        sy += P[i * 3 + 1];
        sz += P[i * 3 + 2];
        cnt++;
      }
      if (cnt > 3) nostrils.push(new Vector3(sx / cnt, sy / cnt, sz / cnt));
    }
  }
  // each vertex's share of a nostril's flare (a soft disc round each nostril)
  const headLen = zMax - zMin, nr = Math.max(0.03, headLen * 0.07), nos = new Float32Array(n);
  for (const c of nostrils)
    for (const i of head) {
      const d = Math.hypot(P[i * 3] - c.x, P[i * 3 + 1] - c.y, P[i * 3 + 2] - c.z);
      if (d < nr) nos[i] = Math.max(nos[i], (1 - d / nr) ** 2);
    }
  // the vertex nearest each nostril, the snout's tip, and drip points (downward-facing, low on the body)
  const nearest = (c) => head.reduce((b, i) => {
    const d = (P[i * 3] - c.x) ** 2 + (P[i * 3 + 1] - c.y) ** 2 + (P[i * 3 + 2] - c.z) ** 2;
    return d < b.d ? { i, d } : b;
  }, { i: -1, d: 1e9 }).i;
  const nosIdx = nostrils.map(nearest).filter((i) => i >= 0);
  const snoutIdx = head.length ? head.reduce((b, i) => (P[i * 3 + 2] > P[b * 3 + 2] ? i : b), head[0]) : -1;
  const down = [];
  for (let i = 0; i < n; i++) if (N[i * 3 + 1] < -0.55) down.push(i);
  const dripIdx = [];
  for (let k = 0; k < 160 && down.length; k++) dripIdx.push(down[Math.floor((k * 7919) % down.length)]);
  g.setAttribute('aBind', new BufferAttribute(P, 3)); // the bind pose in metres: mud, creases and veins stay put on the skin
  g.setAttribute('aThin', new BufferAttribute(thin, 1));
  g.setAttribute('aNeck', new BufferAttribute(neck, 1));
  g.setAttribute('aNos', new BufferAttribute(nos, 1));
  return (g.userData.jtSkin = { nostrils, nostrilDepth: nr * 0.3 / perUnit, nosIdx, snoutIdx, dripIdx });
}

// the eyeballs: centre and radius of the ball each vertex belongs to (two balls, split by side)
export function prepareEyeGeometry(mesh) {
  const g = mesh.geometry;
  if (g.userData.jtEye) return;
  const pos = g.attributes.position, n = pos.count, sums = [new Vector4(), new Vector4()];
  for (let i = 0; i < n; i++) {
    _v.fromBufferAttribute(pos, i);
    const s = sums[_v.x < 0 ? 0 : 1];
    s.x += _v.x;
    s.y += _v.y;
    s.z += _v.z;
    s.w++;
  }
  const cen = sums.map((s) => new Vector3(s.x / Math.max(1, s.w), s.y / Math.max(1, s.w), s.z / Math.max(1, s.w)));
  const rad = [0, 0];
  for (let i = 0; i < n; i++) {
    _v.fromBufferAttribute(pos, i);
    const k = _v.x < 0 ? 0 : 1;
    rad[k] = Math.max(rad[k], _v.distanceTo(cen[k]));
  }
  const a = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    _v.fromBufferAttribute(pos, i);
    const k = _v.x < 0 ? 0 : 1;
    a.set([cen[k].x, cen[k].y, cen[k].z, rad[k] * (k ? 1 : -1)], i * 4); // the sign of w says which side
  }
  g.setAttribute('aEyeC', new BufferAttribute(a, 4));
  g.userData.jtEye = true;
}

// the average colour of a texture (for the eyelids: the skin round the eye)
export function averageColour(tex) {
  try {
    const img = tex?.image;
    if (!img) return null;
    const c = document.createElement('canvas');
    c.width = c.height = 8;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0, 8, 8);
    const d = x.getImageData(0, 0, 8, 8).data;
    let r = 0, gg = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) (r += d[i]), (gg += d[i + 1]), (b += d[i + 2]);
    const k = 1 / (255 * 64);
    return new Color(r * k, gg * k, b * k).convertSRGBToLinear();
  } catch {
    return null;
  }
}

// the scales, per species (in the bind pose's metres): f = scales per metre, kf = knobs per metre,
// k = how many cells carry a knob, frill = grooves on thin skin, h = relief height in metres
const NO_SCALES = new URLSearchParams(location.search).get('scales') === '0'; // for comparison
export const SCALES = {
  trex: { f: 15, kf: 4.2, k: 0.45, frill: 0, h: 0.016 },
  triceratops: { f: 7.5, kf: 2.6, k: 0.25, frill: 1, h: 0.02 },
  stegosaurus: { f: 16, kf: 4, k: 0.6, frill: 1, h: 0.016 },
  brachiosaurus: { f: 5, kf: 1.5, k: 0.35, frill: 0, h: 0.035 },
  pteranodon: { f: 26, kf: 0, k: 0, frill: 0, h: 0.003 },
};

// per-animal uniforms for the skin shader
export function skinUniforms(info, sc = SCALES.trex) {
  return {
    uScales: { value: new Vector4(sc.f, sc.kf, sc.k, sc.frill) },
    uScaleH: { value: NO_SCALES ? 0 : sc.h }, // relief height in metres, before the model's scale (set per animal)
    uMudLine: { value: 0 }, // metres above the feet (model space)
    uMudAmt: { value: 0 }, // 0..1 how much mud there is
    uMudWet: { value: 0 }, // 1 fresh and glistening, 0 dried
    uBend: { value: 0 }, // neck bend, 0..1
    uFlare: { value: 0 }, // nostril flare, 0..1
    uNosDepth: { value: info?.nostrilDepth || 0 }, // how deep a full flare dips, in stored units
    uWet: { value: 0 }, // 0..1 how wet the skin is (rain, a wade)
    uRain: { value: 0 }, // 0..1 rain falling on it now
  };
}

export function skinShader(mat, U, shared, { membrane = false } = {}) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r);
    Object.assign(sh.uniforms, U);
    sh.uniforms.uLightDir = shared.uLightDir;
    sh.uniforms.uLightColor = shared.uLightColor;
    sh.uniforms.uNight = shared.uNight;
    sh.uniforms.uTime = shared.uTime;
    sh.uniforms.uFlash = shared.uFlash;
    sh.uniforms.uWarmPos = WARM.uWarmPos;
    sh.uniforms.uWarmCol = WARM.uWarmCol;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
attribute float aThin;
attribute float aNeck;
attribute float aNos;
attribute vec3 aBind;
uniform float uFlare;
uniform float uNosDepth;
varying float vThin;
varying float vNeck;
varying vec3 vLocal;`)
      .replace('#include <skinning_vertex>', `#include <skinning_vertex>
  vThin = aThin;
  vNeck = aNeck;
  vLocal = aBind; // the bind pose, in metres: patterns stick to the skin as it moves`)
      // nostrils: the skin round each one dips in a little (flaring), in the bind pose before skinning
      .replace('#include <begin_vertex>', `#include <begin_vertex>
  transformed -= normalize(objectNormal) * aNos * uFlare * uNosDepth;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform float uNight;
uniform float uMudLine;
uniform float uMudAmt;
uniform float uMudWet;
uniform float uBend;
uniform float uWet;
uniform float uRain;
uniform float uTime;
uniform float uFlash;
uniform vec3 uWarmPos[4];
uniform vec4 uWarmCol[4];
uniform vec4 uScales;
uniform float uScaleH;
varying float vThin;
varying float vNeck;
varying vec3 vLocal;
float jtHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
vec3 jtHash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453);
}
// cellular: x = distance to the nearest cell centre, y = gap to the second (0 on a border), z = cell id
vec3 jtCells(vec3 x) {
  vec3 p = floor(x), f = fract(x);
  float d1 = 8.0, d2 = 8.0, id = 0.0;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 b = vec3(float(i), float(j), float(k));
    vec3 h = jtHash3(p + b);
    vec3 r = b + 0.15 + h * 0.7 - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = h.x; } else if (d < d2) d2 = d;
  }
  d1 = sqrt(d1);
  return vec3(d1, sqrt(d2) - d1, id);
}
float jtNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(jtHash(i), jtHash(i + vec3(1,0,0)), f.x), mix(jtHash(i + vec3(0,1,0)), jtHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(jtHash(i + vec3(0,0,1)), jtHash(i + vec3(1,0,1)), f.x), mix(jtHash(i + vec3(0,1,1)), jtHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}`)
      .replace('#include <map_fragment>', `#include <map_fragment>
  // mud up the legs and belly to the water line, ragged at its edge, darker and redder while wet
  float jtN = jtNoise(vLocal * 9.0) * 0.6 + jtNoise(vLocal * 31.0) * 0.4;
  float jtMud = uMudAmt * smoothstep(uMudLine + 0.08, uMudLine - 0.12, vLocal.y + (jtN - 0.5) * 0.35);
  // splashes flung above the line: flecks thinning out upwards
  float jtFleck = uMudAmt * step(0.78, jtNoise(vLocal * 55.0)) * smoothstep(uMudLine + 0.6, uMudLine, vLocal.y);
  jtMud = max(jtMud, jtFleck * 0.85);
  // fresh: near-black and wet; dried: pale grey-brown crust
  vec3 jtMudCol = mix(vec3(0.33, 0.28, 0.21), vec3(0.03, 0.022, 0.015), uMudWet);
  diffuseColor.rgb = mix(diffuseColor.rgb, jtMudCol * (0.7 + 0.6 * jtN), jtMud * 0.9);
  // creases across the neck, deepening as it bends
  float jtCr = vNeck * uBend * smoothstep(0.55, 1.0, 0.5 + 0.5 * sin(vLocal.z * 46.0 + sin(vLocal.y * 23.0) * 1.6));
  diffuseColor.rgb *= 1.0 - jtCr * 0.32;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  // the sheen breaks up over the scales; wet mud glistens
  roughnessFactor = clamp(roughnessFactor + (jtNoise(vLocal * 17.0) - 0.5) * 0.22 - jtMud * uMudWet * 0.7 + jtMud * (1.0 - uMudWet) * 0.3 + jtCr * 0.15, 0.05, 1.0);
  // wet: rivulets running down the steep flanks, beads standing on the top surfaces, both glassy
  float jtUpF = dot(normalize(vNormal), normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz));
  float jtRiv = 0.0;
  if (uWet > 0.02) {
    float rv = jtNoise(vec3(vLocal.x * 7.0, vLocal.y * 0.9 + uTime * 0.35, vLocal.z * 7.0));
    jtRiv = smoothstep(0.6, 0.82, rv) * smoothstep(0.92, 0.35, abs(jtUpF));
    float bead = smoothstep(0.78, 0.86, jtNoise(vLocal * 24.0 + 3.7)) * smoothstep(0.15, 0.7, jtUpF);
    jtRiv = max(jtRiv, bead) * uWet;
    roughnessFactor = mix(roughnessFactor, 0.03, jtRiv);
    diffuseColor.rgb *= 1.0 - 0.25 * jtRiv;
  }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
  {
    // the scales: only where one is big enough on screen to see (a few pixels), sharpening in closer
    float jtPx = length(fwidth(vLocal)) * uScales.x;
    float jtSee = 1.0 - smoothstep(0.12, 0.35, jtPx);
    if (jtSee > 0.01 && uScaleH > 0.0) {
      vec3 c = jtCells(vLocal * uScales.x);
      // domed scales with grooves between them
      float h = smoothstep(0.0, 0.16, c.y) * (0.55 + 0.45 * (1.0 - c.x));
      float crev = 1.0 - smoothstep(0.0, 0.12, c.y);
      // knobs: big round tubercles (osteoderms) on some cells of a coarser grid, mostly on the upper body
      if (uScales.z > 0.0) {
        vec3 k = jtCells(vLocal * uScales.y + 11.0);
        float on = step(1.0 - uScales.z, k.z) * smoothstep(-0.2, 0.5, jtUpF);
        float knob = on * smoothstep(0.42, 0.05, k.x);
        h = max(h, knob * 1.8);
        crev = max(crev * (1.0 - knob), on * smoothstep(0.38, 0.46, k.x) * smoothstep(0.55, 0.46, k.x) * 0.8);
      }
      // a frill or plate: smoother, with grooves branching over it like blood vessels
      if (uScales.w > 0.0 && vThin > 0.3) {
        float plate = smoothstep(0.45, 0.85, vThin);
        h *= 1.0 - 0.6 * plate;
        crev *= 1.0 - 0.6 * plate;
        float g = jtNoise(vLocal * 9.0 + vec3(0.0, jtNoise(vLocal * 4.0) * 2.0, 0.0));
        float groove = smoothstep(0.08, 0.0, abs(g - 0.5)) * smoothstep(0.3, 0.6, vThin) * uScales.w;
        h -= groove * 1.2;
        crev = max(crev, groove * 0.8);
      }
      h *= jtSee;
      crev *= jtSee;
      // relief: tilt the normal by the height's slope across the pixel (a bump map without a map)
      vec2 dH = vec2(dFdx(h), dFdy(h)) * uScaleH;
      vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
      vec3 r1 = cross(sy, normal), r2 = cross(normal, sx);
      float det = dot(sx, r1) * faceDirection;
      vec3 grad = sign(det) * (dH.x * r1 + dH.y * r2);
      normal = normalize(abs(det) * normal - grad);
      // dirt and shadow in the crevices, the scale tops a touch paler and a little glossier
      diffuseColor.rgb *= (1.0 - 0.32 * crev) * (1.0 + 0.08 * h * (1.0 - crev));
      roughnessFactor = clamp(roughnessFactor + crev * 0.12 - h * 0.05, 0.03, 1.0);
    }
  }`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
  {
    // light through thin skin: frills, plates${membrane ? ', wing membranes (with their veins)' : ''}; warm and red when
    // the sun is behind them, a fainter glow on the shaded side
    vec3 Lv = normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz);
    vec3 Vv = normalize(vViewPosition);
    float back = pow(clamp(dot(Vv, -Lv), 0.0, 1.0), 2.5);
    float wrap = clamp(dot(-normal, Lv), 0.0, 1.0);
    float th = vThin${membrane ? ' * (1.0 - 0.55 * smoothstep(0.82, 0.97, abs(sin(vLocal.x * 18.0 + sin(vLocal.z * 7.0) * 2.4))))' : ''};
    vec3 blood = mix(diffuseColor.rgb, vec3(0.85, 0.2, 0.08), 0.7);
    reflectedLight.directDiffuse += blood * uLightColor * th * (back * 0.75 + wrap * 0.25) * (1.0 - jtMud * 0.8) * (1.0 - uNight * 0.7);
  }
  // warm light from the hearth and the lantern on a passing body (wrapped a little round the form)
  for (int i = 0; i < 4; i++) {
    vec4 wc = uWarmCol[i];
    if (wc.w <= 0.0) continue;
    vec3 wl = uWarmPos[i] + vViewPosition;
    float d2 = dot(wl, wl), att = max(0.0, 1.0 - d2 / (wc.w * wc.w));
    float ndl = clamp(dot(normal, wl * inversesqrt(max(d2, 1e-6))) * 0.75 + 0.25, 0.0, 1.0);
    reflectedLight.directDiffuse += diffuseColor.rgb * wc.rgb * ndl * att * att;
    reflectedLight.directSpecular += wc.rgb * pow(ndl, 12.0) * att * att * 0.08 * (1.0 - roughnessFactor);
  }
  // lightning: a hard cold rim round the silhouette
  if (uFlash > 0.01) {
    float rim = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 2.2);
    reflectedLight.directDiffuse += vec3(0.75, 0.82, 1.0) * smoothstep(0.35, 0.9, rim) * min(uFlash, 1.0) * 0.9;
    reflectedLight.directDiffuse *= 1.0 - 0.45 * min(uFlash, 1.0) * (1.0 - rim); // the near side falls dark: a silhouette
  }
  if (uRain > 0.02) {
    // raindrops landing: little rings that spread and fade on the back, head and tail tops
    vec2 q = vLocal.xz * 9.0 + vec2(vLocal.y * 4.0, 0.0);
    vec2 c = floor(q);
    float h = jtHash(vec3(c, 3.1));
    float ph = fract(uTime * (1.6 + 1.2 * h) + h * 7.0);
    vec2 o = vec2(jtHash(vec3(c, 1.0)), jtHash(vec3(c, 2.0))) * 0.5 + 0.25;
    float r = length(fract(q) - o);
    float ring = smoothstep(0.035, 0.0, abs(r - ph * 0.22)) * (1.0 - ph) * (1.0 - ph) * step(h, uRain * 0.6 + 0.05) * smoothstep(0.25, 0.75, jtUpF);
    reflectedLight.directSpecular += (uLightColor * 0.12 + vec3(0.08)) * ring * (1.0 - uNight * 0.6);
  }${DEBUG ? '\n  reflectedLight.directDiffuse = vec3(vThin, jtMud, vNeck * 0.5); reflectedLight.indirectDiffuse = vec3(0.0); reflectedLight.directSpecular = vec3(0.0); reflectedLight.indirectSpecular = vec3(0.0);' : ''}`);
  };
  const key = mat.customProgramCacheKey?.bind(mat);
  mat.customProgramCacheKey = () => (key ? key() : '') + (membrane ? '-jtskin-m' : '-jtskin');
  mat.needsUpdate = true;
}

export function eyeShader(mat, U) {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (sh, r) => {
    prev?.call(mat, sh, r);
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
attribute vec4 aEyeC;
uniform vec2 uEyeRot;
varying vec3 vEyeRel;
mat3 jtRotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 jtRotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }`)
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
  // the eyeball turns in its socket (yaw, and pitch about its sideways axis); mirrored for the left eye
  float jtSide = sign(aEyeC.w);
  mat3 jtR = jtRotY(uEyeRot.x * jtSide) * jtRotZ(uEyeRot.y * jtSide);
  objectNormal = jtR * objectNormal;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
  vec3 jtRel = position - aEyeC.xyz;
  vEyeRel = jtRel / abs(aEyeC.w);
  transformed = aEyeC.xyz + jtR * jtRel;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uBlink;
uniform vec3 uLidColor;
uniform vec3 uShine;
varying vec3 vEyeRel;`)
      .replace('#include <map_fragment>', `#include <map_fragment>
  // the lids: the upper comes down, the lower rises a little; a dark line where they meet the ball
  float jtUp = 1.0 - 2.05 * uBlink, jtLo = -1.0 + 0.75 * uBlink;
  float jtLid = max(smoothstep(jtUp - 0.04, jtUp + 0.04, vEyeRel.y), smoothstep(jtLo + 0.04, jtLo - 0.04, vEyeRel.y));
  float jtEdge = max(1.0 - smoothstep(0.0, 0.12, abs(vEyeRel.y - jtUp)), 1.0 - smoothstep(0.0, 0.1, abs(vEyeRel.y - jtLo))) * (1.0 - jtLid);
  diffuseColor.rgb = mix(diffuseColor.rgb * (1.0 - jtEdge * 0.6), uLidColor, jtLid);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  roughnessFactor = mix(roughnessFactor, 0.75, jtLid);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  // eyeshine: in the dark, light thrown straight back from behind the retina, strongest looking right at us
  totalEmissiveRadiance += uShine * pow(clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0);
  totalEmissiveRadiance *= 1.0 - jtLid;`)
      .replace('#include <clearcoat_normal_fragment_begin>', `#include <clearcoat_normal_fragment_begin>`)
      .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
  #ifdef USE_CLEARCOAT
  material.clearcoat *= 1.0 - jtLid;
  #endif`);
  };
  const key = mat.customProgramCacheKey?.bind(mat);
  mat.customProgramCacheKey = () => (key ? key() : '') + '-jteye';
  mat.needsUpdate = true;
}

export function eyeUniforms(lid) {
  return { uEyeRot: { value: new Vector2() }, uBlink: { value: 0 }, uLidColor: { value: lid || new Color(0.12, 0.1, 0.08) }, uShine: { value: new Color(0, 0, 0) } };
}

// Saliva: strands strung between upper and lower teeth as the jaw opens on a roar. Each stretches and sags
// (thinnest in the middle), sways a little, and snaps at its own length; they hang only while it roars.
// Anchors are tooth tips found once per model: the lowest points of the upper teeth and the highest of the
// lower, at a few places along each side of the mouth.
export function prepareTeeth(mesh) {
  const g = mesh.geometry;
  if (g.userData.jtStrands) return g.userData.jtStrands;
  const n = g.attributes.position.count, up = [], lo = [];
  for (let i = 0; i < n; i++) {
    const b = boneOf(mesh, i)?.name;
    mesh.getVertexPosition(i, _v);
    if (b === 'head') up.push([i, _v.x, _v.y, _v.z]);
    else if (b === 'jaw') lo.push([i, _v.x, _v.y, _v.z]);
  }
  const pairs = [];
  if (up.length && lo.length) {
    const z0 = Math.min(...up.map((p) => p[3])), z1 = Math.max(...up.map((p) => p[3]));
    for (const side of [-1, 1])
      for (const f of [0.22, 0.4, 0.58, 0.74]) {
        const zc = z0 + (z1 - z0) * f, w = (z1 - z0) * 0.08;
        const u = up.filter((p) => p[1] * side > 0 && Math.abs(p[3] - zc) < w).sort((a, b) => a[2] - b[2])[0];
        const l = lo.filter((p) => p[1] * side > 0 && Math.abs(p[3] - zc) < w * 1.5).sort((a, b) => b[2] - a[2])[0];
        if (u && l) pairs.push([u[0], l[0]]);
      }
  }
  return (g.userData.jtStrands = pairs);
}

export class Saliva {
  constructor(teethMesh, pairs, { Mesh, BufferGeometry, BufferAttribute, MeshStandardMaterial, DoubleSide }, guard, scene) {
    this.mesh = teethMesh;
    this.pairs = pairs;
    this.SEG = 10;
    const nv = pairs.length * (this.SEG + 1) * 2, idx = [];
    for (let s = 0; s < pairs.length; s++)
      for (let k = 0; k < this.SEG; k++) {
        const a = (s * (this.SEG + 1) + k) * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    this.geo = new BufferGeometry();
    this.geo.setAttribute('position', new BufferAttribute(new Float32Array(nv * 3), 3));
    this.geo.setIndex(idx);
    const mat = new MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.5, emissive: 0x161412, side: DoubleSide, depthWrite: false });
    guard?.(mat);
    this.obj = new Mesh(this.geo, mat);
    this.obj.frustumCulled = false;
    this.obj.renderOrder = 4;
    this.obj.visible = false;
    this.obj.name = 'saliva';
    scene.add(this.obj);
    this.state = pairs.map(() => ({ alive: false, max: 0, ph: Math.random() * 6 }));
    this.t = 0;
    this._a = new Vector3();
    this._b = new Vector3();
    this._p = new Vector3();
    this._s = new Vector3();
    this._c = new Vector3();
    this._d = new Vector3();
  }

  update(dt, roaring, camPos, scale, fwd = null) {
    this.t += dt;
    const pos = this.geo.attributes.position.array, S = this.SEG, M = this.mesh.matrixWorld;
    let any = false;
    this.pairs.forEach(([ui, li], s) => {
      const st = this.state[s], a = this.mesh.getVertexPosition(ui, this._a).applyMatrix4(M), b = this.mesh.getVertexPosition(li, this._b).applyMatrix4(M);
      const L = a.distanceTo(b);
      // a fresh set forms as each roar begins; each snaps at its own stretch (some hold at full gape)
      if (roaring && !this.was) (st.alive = true), (st.max = (0.3 + Math.random() * 0.4) * scale);
      if (!roaring) st.alive = false;
      if (st.alive && L > st.max) st.alive = false;
      const base = (s * (S + 1)) * 2 * 3;
      if (!st.alive) {
        for (let k = 0; k < (S + 1) * 6; k++) pos[base + k] = a.x * (k % 3 === 0) + a.y * (k % 3 === 1) + a.z * (k % 3 === 2);
        return;
      }
      any = true;
      const sag = L * (0.35 + 0.1 * Math.sin(this.t * 3 + st.ph)), w = 0.013 * scale * (1 - 0.6 * L / st.max);
      for (let k = 0; k <= S; k++) {
        const t = k / S, p = this._p.lerpVectors(a, b, t);
        // slack: the strand bows down, forward and out to its side of the mouth, and sways
        const bow = 4 * t * (1 - t), lat = s < this.pairs.length / 2 ? -1 : 1;
        p.y -= sag * 0.35 * bow;
        if (fwd) {
          p.x += (fwd.x * 0.55 + fwd.z * lat * 0.35) * sag * bow;
          p.z += (fwd.z * 0.55 - fwd.x * lat * 0.35) * sag * bow;
        }
        p.x += Math.sin(this.t * 2.3 + st.ph + t * 3) * L * 0.05 * bow;
        // a flat ribbon turned to face the camera, thinnest in the middle
        const tan = this._s.subVectors(b, a).normalize(), side = this._d.copy(tan).cross(this._c.copy(camPos).sub(p).normalize()).normalize();
        const ww = w * (0.25 + 0.75 * Math.abs(2 * t - 1) ** 1.5);
        const o = base + k * 6;
        pos[o] = p.x - side.x * ww;
        pos[o + 1] = p.y - side.y * ww;
        pos[o + 2] = p.z - side.z * ww;
        pos[o + 3] = p.x + side.x * ww;
        pos[o + 4] = p.y + side.y * ww;
        pos[o + 5] = p.z + side.z * ww;
      }
    });
    this.was = roaring;
    this.obj.visible = any;
    this.geo.attributes.position.needsUpdate = true;
  }
}
