import * as T from "three";
import { addMacroSurface } from "./surfaces.js";
import { FinDynamics, water, waterVelocity } from "./fin-dynamics.js";
import { BodyMotion, bodyGLSL, SPINE_COUNT } from "./body-motion.js";
import { DisplayMotion, EyeMotion } from "./display-motion.js";
import { SwimGait } from "./swim-gait.js";
import { gulpState, gulpPresentation, SURFACE_Y, MOUTH_DEPTH, GULP_PITCH } from "./surface-gulp.js";
const PI = Math.PI,
  lerp = T.MathUtils.lerp,
  clamp = T.MathUtils.clamp;
export const SCALE = 0.0032;
// Pectoral pose by locomotion mode: fan to hold station when still, fold in for the startle dart.
export const POSES = { hover: { scull: 1 }, surface: { scull: 1 }, gulp: { scull: 1 }, rise: { scull: 0.7 }, dive: { scull: 0.5 }, glide: { scull: 0.3 }, startle: { tuck: 1 }, mirror: { scull: 1 }, lap: { scull: 0.15 }, rest: { scull: 0.25 } };
const world = ([x, y]) => [(x - 680) * SCALE, (420 - y) * SCALE];
const texUV = ([x, y]) => [x / 1536, 1 - y / 1024];
export const uniforms = {
  uTime: { value: 0 },
  uFlare: { value: 0 },
  uMotion: { value: 1 },
  uPhase: { value: 0 },
  uDrive: { value: 0.12 },
  uTurn: { value: 0 },
  uFold: { value: 0 },
  uSpine: { value: null },
  uMouth: { value: 0 },
  uGill: { value: 0 },
};
const deform = `uniform float uTime,uFlare,uMotion,uPhase,uDrive,uTurn,uFold;\n` + bodyGLSL;
function animate(mat, dynamics = null, operculum = false) {
  mat.userData.bettaDeform = { dynamics, operculum };
  mat.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, uniforms);
    if (dynamics) {
      s.uniforms.uFinDisplacement = { value: dynamics.texture };
      s.uniforms.uFinGrid = { value: new T.Vector2(dynamics.columns, dynamics.rows) };
    }
    s.vertexShader = deform + (operculum ? "attribute float coverLift;\n" : "") + (dynamics ? `
attribute vec2 finUV;
uniform sampler2D uFinDisplacement;
uniform vec2 uFinGrid;
// Explicit bilinear interpolation works without float-linear texture extensions.
vec3 wetFin(vec2 uv) {
  vec2 grid=clamp(uv,0.,1.)*(uFinGrid-1.);
  ivec2 a=ivec2(floor(grid)), b=min(a+ivec2(1),ivec2(uFinGrid)-1);
  vec2 f=fract(grid);
  return mix(mix(texelFetch(uFinDisplacement,a,0).xyz,texelFetch(uFinDisplacement,ivec2(b.x,a.y),0).xyz,f.x),
             mix(texelFetch(uFinDisplacement,ivec2(a.x,b.y),0).xyz,texelFetch(uFinDisplacement,b,0).xyz,f.x),f.y);
}
` : "") + s.vertexShader;
    s.vertexShader = s.vertexShader.replace(
      "#include <project_vertex>",
      `vec3 anatomical=transformed;${operculum ? "anatomical.z+=coverLift*(uGill*.046+uFlare*.085);" : ""}
       vec4 mvPosition=vec4(swim(anatomical)${dynamics ? '+wetFin(finUV)' : ''},1.);
       mvPosition=modelViewMatrix*mvPosition;gl_Position=projectionMatrix*mvPosition;`,
    );
    s.fragmentShader = s.fragmentShader.replace(
      "#include <normal_fragment_begin>",
      "#include <normal_fragment_begin>\nnormal=normalize(cross(dFdx(vViewPosition),dFdy(vViewPosition)))*faceDirection;",
    );
  };
  mat.customProgramCacheKey = () => `wet-betta-1.6-${!!dynamics}-${operculum}`;
  return mat;
}
// Anatomical silhouette measured in the unmodified lateral reference image.
// Each cross-section has independent dorsal/ventral contour and lateral thickness.
const sections = [
  [155, 387, 401, 8],
  [175, 378, 429, 19],
  [200, 369, 456, 32],
  [240, 351, 482, 47],
  [300, 327, 500, 68],
  [360, 307, 517, 84],
  [420, 290, 528, 86],
  [500, 280, 528, 80],
  [580, 278, 521, 72],
  [660, 283, 513, 64],
  [740, 309, 506, 55],
  [820, 342, 501, 45],
  [900, 371, 492, 33],
  [960, 392, 482, 26],
  [1010, 409, 471, 20],
];
// (Into out, when given: the fin solver asks for one at every paired-fin node of every substep.)
export function section(x, out = [0, 0, 0, 0]) {
  let i = 0;
  while (i < sections.length - 2 && sections[i + 1][0] < x) i++;
  const a = sections[i],
    b = sections[i + 1],
    u = clamp((x - a[0]) / (b[0] - a[0]), 0, 1);
  const before = sections[Math.max(0, i - 1)],
    after = sections[Math.min(sections.length - 1, i + 2)];
  out[0] = x;
  for (let j = 1; j < 4; j++) {
    const dx = b[0] - a[0],
      m0 = ((b[j] - before[j]) / (b[0] - before[0])) * dx,
      m1 = ((after[j] - a[j]) / (after[0] - a[0])) * dx;
    out[j] =
      (2 * u ** 3 - 3 * u * u + 1) * a[j] +
      (u ** 3 - 2 * u * u + u) * m0 +
      (-2 * u ** 3 + 3 * u * u) * b[j] +
      (u ** 3 - u * u) * m1;
  }
  return out;
}
function makeBody(compact = false) {
  const p = [],
    uv = [],
    idx = [];
  const nx = compact ? 64 : 220,
    ny = compact ? 24 : 96;
  for (let i = 0; i <= nx; i++) {
    const x = lerp(155, 1010, i / nx),
      [, top, bottom, thick] = section(x),
      mid = (top + bottom) / 2;
    for (let j = 0; j <= ny; j++) {
      const a = (j / ny) * 2 * PI;
      const py = mid + (bottom - top) * 0.5 * Math.cos(a);
      const [wx, wy] = world([x, py]);
      p.push(wx, wy, Math.sin(a) * thick * SCALE);
      // Blend toward arc-length skin coordinates around the flank so dorsal/ventral
      // scales do not stretch into stripes when the specimen turns.
      const arcY=mid+(bottom-top)*Math.asin(Math.cos(a))/PI;
      const wrap=T.MathUtils.smoothstep(x,390,520)*.85;
      uv.push(...texUV([x,lerp(py,arcY,wrap)]));
    }
  }
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) {
      const a = i * (ny + 1) + j,
        b = a + ny + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  for (const end of [nx]) {
    const x = end ? 1010 : 155,
      [, top, bottom] = section(x),
      [wx, wy] = world([x, (top + bottom) / 2]),
      c = p.length / 3;
    p.push(wx, wy, 0);
    uv.push(...texUV([x, (top + bottom) / 2]));
    for (let j = 0; j < ny; j++) {
      const a = end * (ny + 1) + j;
      if (end) idx.push(c, a + 1, a);
      else idx.push(c, a, a + 1);
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(p, 3));
  g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function addBreathingAnatomy(fish, skin) {
  const geometry = (p, uv, idx, lift = null) => {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    if (lift) g.setAttribute('coverLift', new T.Float32BufferAttribute(lift, 1));
    g.setIndex(idx); g.computeVertexNormals(); return g;
  };
  const dark = animate(new T.MeshPhysicalMaterial({ color: 0x100a0c, roughness: 0.82, side: T.DoubleSide }));
  // A real recessed mouth, not a painted black spot or a solid nose cap.
  const compact = fish.userData.compact;
  const p = [], uv = [], idx = [], rows = compact ? 4 : 12, around = compact ? 24 : 64;
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= around; i++) {
    const u = j / rows, a = i / around * PI * 2;
    p.push(-1.68 + u * 0.15, 0.0832 + lerp(0.0224, 0.012, u) * Math.cos(a), lerp(0.0256, 0.012, u) * Math.sin(a));
    uv.push(i / around, u);
    if (j < rows && i < around) { const n = j * (around + 1) + i; idx.push(n, n + 1, n + around + 1, n + 1, n + around + 2, n + around + 1); }
  }
  const end = p.length / 3; p.push(-1.53, 0.0832, 0); uv.push(0.5, 0.5);
  for (let i = 0; i < around; i++) idx.push(end, rows * (around + 1) + i, rows * (around + 1) + i + 1);
  const cavity = new T.Mesh(geometry(p, uv, idx), dark); cavity.name = 'Recessed breathing mouth'; fish.add(cavity);
  const lp = [], lu = [], li = [], tube = compact ? 4 : 10;
  for (let i = 0; i <= around; i++) for (let j = 0; j <= tube; j++) {
    const a = i / around * PI * 2, b = j / tube * PI * 2, r = 0.0028;
    const x = -1.68 + r * Math.sin(b), y = 0.0832 + (0.0224 + r * Math.cos(b)) * Math.cos(a), z = (0.0256 + r * Math.cos(b)) * Math.sin(a);
    lp.push(x, y, z); lu.push(...texUV([x / SCALE + 680, 420 - y / SCALE]));
    if (i < around && j < tube) { const n = i * (tube + 1) + j; li.push(n, n + tube + 1, n + 1, n + 1, n + tube + 1, n + tube + 2); }
  }
  const lips = new T.Mesh(geometry(lp, lu, li), skin); lips.name = 'Flexible upper and lower lips'; fish.add(lips);
  for (const side of [-1, 1]) {
    const cp = [], cu = [], ci = [], lift = [], gp = [], gu = [], gi = [];
    const rows = compact ? 20 : 60, cols = compact ? 8 : 24;
    for (let i = 0; i <= rows; i++) {
      const u = i / rows, shape = Math.sin(PI * u), py = lerp(332, 502, u);
      const hinge = 330 + 12 * shape, edge = 330 + 76 * shape;
      const surface = (px, offset) => {
        const [, top, bottom, thick] = section(px), q = (py - (top + bottom) / 2) / ((bottom - top) / 2);
        return side * (thick * SCALE * Math.sqrt(Math.max(0, 1 - q * q)) + offset);
      };
      for (let j = 0; j <= cols; j++) {
        const v = j / cols, px = lerp(hinge, edge, v), [x, y] = world([px, py]);
        cp.push(x, y, surface(px, 0.0025)); cu.push(...texUV([px, py]));
        lift.push(side * v * v * shape ** 0.7);
        if (i < rows && j < cols) { const n = i * (cols + 1) + j; ci.push(n, n + 1, n + cols + 1, n + 1, n + cols + 2, n + cols + 1); }
      }
      // The narrow outlet is concealed beneath the closed cover, revealed on exhalation.
      for (let j = 0; j < 2; j++) {
        const px = edge - (j ? 0 : 5 * shape), [x, y] = world([px, py]);
        gp.push(x, y, surface(px, 0.001)); gu.push(u, j);
      }
      if (i < rows) { const n = i * 2; gi.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
    }
    // The row direction runs down the flank; reverse the near-side winding so
    // both covers have outward normals, matching the underlying skin.
    if (side > 0) for (let i = 0; i < ci.length; i += 3) [ci[i + 1], ci[i + 2]] = [ci[i + 2], ci[i + 1]];
    const coverMaterial = addMacroSurface(animate(skin.clone(), null, true), fish.userData.macroTextures);
    coverMaterial.side = T.DoubleSide;
    const cover = new T.Mesh(geometry(cp, cu, ci, lift), coverMaterial);
    cover.name = `Hinged operculum ${side > 0 ? 'left' : 'right'}`; fish.add(cover);
    const slit = new T.Mesh(geometry(gp, gu, gi), dark); slit.name = `Gill outlet ${side}`; fish.add(slit);
  }
}
function sample(points, t) {
  const f = clamp(t, 0, 1) * (points.length - 1),
    i = Math.min(points.length - 2, Math.floor(f)),
    u = f - i;
  const a = points[Math.max(0, i - 1)],
    b = points[i],
    c = points[i + 1],
    d = points[Math.min(points.length - 1, i + 2)];
  return b.map(
    (v, j) =>
      0.5 *
      (2 * v +
        (-a[j] + c[j]) * u +
        (2 * a[j] - 5 * v + 4 * c[j] - d[j]) * u * u +
        (-a[j] + 3 * v - 3 * c[j] + d[j]) * u * u * u),
  );
}
// The pelvic rays rise out of the belly skin beside the ventral midline. The reference
// outline starts a little below the belly, so the 3D insertion sinks into the flank
// (texture coordinates still follow the reference footprint) and the feelers never
// show a gap at the root.
export const PELVIC_ROOTS = [
    [361, 523],
    [378, 529],
    [400, 534],
  ],
  PELVIC_EDGE = [
    [369, 543],
    [385, 610],
    [403, 685],
    [444, 775],
    [483, 860],
    [535, 917],
  ];
export const PECTORAL_ROOTS = [
    [397, 439],
    [399, 454],
    [401, 468],
  ],
  PECTORAL_EDGE = [
    [410, 406],
    [445, 393],
    [482, 400],
    [504, 430],
    [505, 467],
    [493, 500],
    [461, 525],
    [435, 524],
  ];
const PELVIC_BASE_Z = 0.045,
  PELVIC_TIP_Z = 0.19,
  PELVIC_SINK = 0.014;
function pelvicInsertion(r) {
  const [, top, bottom, thick] = section(r[0]),
    q = Math.sqrt(Math.max(0, 1 - (PELVIC_BASE_Z / (thick * SCALE)) ** 2));
  return [r[0], (top + bottom) / 2 + ((bottom - top) / 2) * q - PELVIC_SINK / SCALE];
}
export function finGrid(roots, edge, kind, side, u, v) {
  const r = sample(roots, u),
    e = sample(edge, u),
    g = kind === 4 ? pelvicInsertion(r) : r,
    edgeInset =
      1 -
      0.004 * (0.5 + 0.5 * Math.sin(u * PI * 142)) -
      0.002 * (0.5 + 0.5 * Math.sin(u * PI * 57)),
    vv = v * edgeInset;
  const [x, y] = world([lerp(g[0], e[0], vv), lerp(g[1], e[1], vv)]);
  const ridges =
    Math.sin(u * PI * 56) * 0.006 + Math.sin(u * PI * 9 + v * 3) * 0.055;
  let z = Math.pow(v, 1.5) * ridges;
  if (kind === 3) z = side * (0.267 + v * 0.19) + v * 0.006 * Math.sin(u * 70);
  else if (kind === 4)
    z = side * lerp(PELVIC_BASE_Z, PELVIC_TIP_Z, v) + v * ridges * 0.4;
  const [rx, ry] = world(g);
  return {
    x, y, z, rx, ry,
    rz: kind === 3 ? side * 0.267 : kind === 4 ? side * PELVIC_BASE_Z : 0,
    px: lerp(r[0], e[0], vv),
    py: lerp(r[1], e[1], vv),
    vv,
  };
}
function makeFin(fish, texture, roots, edge, kind = 0, side = 0, atlas = null) {
  const p = [],
    uv = [],
    fuv = [],
    root = [],
    idx = [],
    nu = fish.userData.compact ? 28 : 180,
    nv = fish.userData.compact ? 16 : 52;
  for (let i = 0; i <= nu; i++) {
    const u = i / nu;
    for (let j = 0; j <= nv; j++) {
      const v = j / nv,
        { x, y, z, rx, ry, rz, px, py, vv } = finGrid(roots, edge, kind, side, u, v);
      p.push(x, y, z);
      root.push(rx, ry, rz);
      if (atlas) {
        const ar = sample(atlas.roots, u),
          ae = sample(atlas.edge, u);
        uv.push(
          lerp(ar[0], ae[0], vv) / atlas.width,
          1 - lerp(ar[1], ae[1], vv) / atlas.height,
        );
      } else uv.push(...texUV([px, py]));
      fuv.push(u, v);
    }
  }
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const a = i * (nv + 1) + j,
        b = a + nv + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new T.BufferGeometry();
  for (const [name, arr, n] of [
    ["position", p, 3],
    ["uv", uv, 2],
    ["finUV", fuv, 2],
    ["root", root, 3],
  ])
    g.setAttribute(name, new T.Float32BufferAttribute(arr, n));
  g.setIndex(idx);
  g.computeVertexNormals();
  const dynamics = new FinDynamics({
    kind, side,
    point(u, v) {
      const { x, y, z } = finGrid(roots, edge, kind, side, u, v);
      return [x, y, z];
    },
  });
  dynamics.texture = new T.DataTexture(dynamics.displacement, dynamics.columns, dynamics.rows, T.RGBAFormat, T.FloatType);
  dynamics.texture.needsUpdate = true;
  fish.userData.finDynamics.push(dynamics);
  const baseMat = animate(
    new T.MeshPhysicalMaterial({
      map: texture,
      color: 0xffffff,
      side: T.DoubleSide,
      roughness: 0.76,
      metalness: 0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.6,
      iridescence: 0.06,
      iridescenceThicknessRange: [180, 260],
      transparent: true,
      opacity: kind === 3 ? 0.7 : 0.94,
      depthWrite: true,
      bumpMap: texture,
      bumpScale: 0.006,
    }),
    dynamics,
  );
  const mat =
    kind < 3
      ? addMacroSurface(baseMat, fish.userData.macroTextures, {
          fin: true,
          caudal: kind === 0,
        })
      : baseMat;
  const mesh = new T.Mesh(g, mat);
  mesh.frustumCulled = false;
  mesh.userData.kind = kind;
  mesh.name = ["Caudal", "Dorsal", "Anal", "Pectoral", "Pelvic"][kind] + (side ? (side > 0 ? " left" : " right") : "");
  fish.add(mesh);
  return mesh;
}
export function createBetta({ compact = false, textures = true } = {}) {
  const fish = new T.Group();
  fish.userData.compact = compact;
  // (textures: false, for a host that only moves the fish, in a worker where no image can load:
  // each photograph an empty stand-in, the fish ready at once.)
  const load = (url, done, fail) => {
    if (textures) return new T.TextureLoader().load(url, done, undefined, fail);
    done();
    return new T.Texture();
  };
  const finDynamics = [];
  const bodyMotion = new BodyMotion();
  const spineTexture = new T.DataTexture(bodyMotion.data, SPINE_COUNT, 1, T.RGBAFormat, T.FloatType);
  spineTexture.needsUpdate = true;
  uniforms.uSpine.value = spineTexture;
  fish.userData.finDynamics = finDynamics;
  fish.name = "Betta splendens — volumetric reference-textured specimen";
  let resolveTexture, rejectTexture;
  const loaded = new Promise((resolve, reject) => {
    resolveTexture = resolve;
    rejectTexture = reject;
  });
  const texture = load(
    "https://media.jez237.com/demos/betta-atelier/references/2026-10-22/01-profile.jpg?v=69e062016b32",
    () => resolveTexture(),
    rejectTexture,
  );
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 8;
  let resolveFin, rejectFin;
  const finLoaded = new Promise((resolve, reject) => {
    resolveFin = resolve;
    rejectFin = reject;
  });
  const finTexture = load(
    "https://media.jez237.com/demos/betta-atelier/references/2026-10-22/03-fin-material.jpg?v=11641b5eba25",
    () => resolveFin(),
    rejectFin,
  );
  finTexture.colorSpace = T.SRGBColorSpace;
  finTexture.anisotropy = 8;
  const macroPending = [];
  const macroUrls = {
    "04-head-macro":
      "https://media.jez237.com/demos/betta-atelier/macro-v1.2/04-head-macro.jpg?v=73e1f70901a5",
    "05-scale-macro":
      "https://media.jez237.com/demos/betta-atelier/macro-v1.2/05-scale-macro.jpg?v=63089308e453",
    "06-membrane-macro":
      "https://media.jez237.com/demos/betta-atelier/macro-v1.2/06-membrane-macro.jpg?v=684f8aabab14",
  };
  const loadMacro = (name) => {
    let done, fail;
    macroPending.push(
      new Promise((res, rej) => {
        done = res;
        fail = rej;
      }),
    );
    const m = load(macroUrls[name], done, fail);
    m.colorSpace = T.SRGBColorSpace;
    m.anisotropy = 8;
    return m;
  };
  const macroTextures = {
    head: loadMacro("04-head-macro"),
    scales: loadMacro("05-scale-macro"),
    fin: loadMacro("06-membrane-macro"),
  };
  fish.userData.macroTextures = macroTextures;
  const skin = addMacroSurface(
    animate(
      new T.MeshPhysicalMaterial({
        map: texture,
        color: 0xffffff,
        metalness: 0.03,
        roughness: 0.72,
        clearcoat: 0.06,
        clearcoatRoughness: 0.35,
        iridescence: 0.08,
        iridescenceThicknessRange: [190, 300],
        bumpMap: texture,
        bumpScale: 0.011,
      }),
    ),
    macroTextures,
  );
  const body = new T.Mesh(makeBody(compact), skin);
  body.name = "Arc-length muscular trunk with open buccal cavity";
  fish.add(body);
  addBreathingAnatomy(fish, skin);
  // Independent fins follow traced ray attachments and sampled membrane detail.
  makeFin(
    fish,
    finTexture,
    [
      [1000, 402],
      [1006, 420],
      [1008, 444],
      [1005, 463],
      [995, 478],
    ],
    [
      [1078, 45],
      [1100, 43],
      [1137, 40],
      [1197, 76],
      [1250, 126],
      [1302, 181],
      [1351, 241],
      [1380, 302],
      [1396, 370],
      [1410, 436],
      [1398, 507],
      [1387, 579],
      [1370, 646],
      [1340, 706],
      [1301, 762],
      [1244, 808],
      [1180, 844],
      [1116, 864],
      [1054, 836],
    ],
    0,
    0,
    {
      width: 1225,
      height: 1284,
      roots: [
        [500, 472],
        [505, 490],
        [508, 510],
        [507, 535],
        [500, 553],
      ],
      edge: [
        [651, 55],
        [717, 52],
        [789, 69],
        [856, 105],
        [914, 159],
        [977, 193],
        [1034, 244],
        [1094, 298],
        [1140, 369],
        [1162, 445],
        [1167, 531],
        [1165, 624],
        [1155, 710],
        [1132, 784],
        [1078, 848],
        [1018, 922],
        [955, 1013],
        [857, 1080],
        [755, 1138],
      ],
    },
  );
  makeFin(
    fish,
    texture,
    [
      [620, 282],
      [648, 282],
      [675, 288],
      [708, 300],
      [735, 315],
    ],
    [
      [624, 272],
      [657, 196],
      [705, 126],
      [772, 89],
      [841, 64],
      [918, 66],
      [985, 72],
      [1047, 76],
      [1043, 123],
      [1027, 180],
      [1022, 239],
      [1006, 299],
      [981, 347],
    ],
    1,
  );
  makeFin(
    fish,
    texture,
    [
      [451, 524],
      [510, 525],
      [595, 516],
      [680, 509],
      [765, 502],
      [850, 498],
      [928, 486],
      [991, 476],
    ],
    [
      [454, 537],
      [504, 571],
      [552, 679],
      [602, 768],
      [665, 820],
      [736, 863],
      [808, 916],
      [878, 946],
      [948, 956],
      [1022, 942],
      [1070, 919],
      [1043, 874],
      [1002, 780],
      [984, 641],
      [991, 479],
    ],
    2,
  );
  const pectorals = [], eyes = [];
  const display = new DisplayMotion(), gaze = new EyeMotion();
  for (const side of [-1, 1]) {
    makeFin(fish, texture, PELVIC_ROOTS, PELVIC_EDGE, 4, side);
    pectorals.push(makeFin(fish, texture, PECTORAL_ROOTS, PECTORAL_EDGE, 3, side));
    // Volumetric iris and a dark convex pupil aligned with the lateral reference.
    const eyeGeo = new T.SphereGeometry(0.083, compact ? 20 : 48, compact ? 12 : 32),
      ep = eyeGeo.attributes.position,
      eu = eyeGeo.attributes.uv;
    for (let i = 0; i < ep.count; i++)
      eu.setXY(
        i,
        (240 + ep.getX(i) / SCALE) / 1536,
        1 - (400 - ep.getY(i) / SCALE) / 1024,
      );
    const eye = new T.Mesh(
      eyeGeo,
      addMacroSurface(
        new T.MeshPhysicalMaterial({
          map: texture,
          bumpMap: texture,
          bumpScale: 0.0005,
          roughness: 0.48,
          metalness: 0,
          clearcoat: 0.06,
          clearcoatRoughness: 0.15,
          envMapIntensity: 0.025,
        }),
        macroTextures,
        { eye: true },
      ),
    );
    const [ex, ey] = world([240, 400]);
    const pivot = new T.Group();
    pivot.name = `Eye socket pivot ${side}`;
    pivot.position.set(ex, ey, side * 0.120);
    const motion = gaze;
    eyes.push({ pivot, motion, side });
    eye.position.set(0, 0, side * 0.020);
    eye.scale.set(1, 1, 0.5);
    pivot.add(eye);
    const pupil = new T.Mesh(
      new T.SphereGeometry(0.045, compact ? 16 : 40, compact ? 10 : 28),
      new T.MeshPhysicalMaterial({
        color: 0x010304,
        roughness: 0.22,
        clearcoat: 0.06,
        envMapIntensity: 0.025,
      }),
    );
    pupil.scale.z = 0.1;
    pupil.position.set(0, 0.006, side * 0.063);
    pivot.add(pupil);
    fish.add(pivot);
  }
  const gait = new SwimGait();
  let prev = 0,
    flowStrength = water.strength,
    drive = 0.045,
    heading = 0.12,
    tx = 0.3,
    ty = 0,
    turn = 0,
    lift = 0,
    gulpOpen = 0,
    gulpGill = 0;
  const cycle = 32;
  const lipLocal = [0, 0, 0, 0], lipWorld = new T.Vector3(), contour = [0, 0, 0, 0];
  fish.userData = {
    ready: Promise.all([loaded, finLoaded, ...macroPending]),
    macroTextures,
    scaleCount: 0,
    finCount: 7,
    revision: "1.12",
    gulp: { lift: 0, phase: "none", clock: -1, lip: [0, 0, 0], surfaceY: SURFACE_Y },
    display, eyes,
    gait,
    bodyMotion,
    finDynamics,
    water,
    mode: "hover",
    update(t, inspect = false) {
      const dt = clamp(t - prev, 0, 0.07);
      prev = t;
      display.advance(dt);
      uniforms.uFlare.value = display.flare;
      gaze.advance(dt, turn, display.flare);
      for (const { pivot, motion, side } of eyes) {
        pivot.rotation.set(-motion.pitch * side, motion.yaw * side, 0);
      }
      uniforms.uTime.value = t;
      // A burst-and-coast swimmer: stabilize, accelerate, glide, brake, investigate.
      const q = t % cycle;
      let desired = 0.045,
        targetHeading = 0.12,
        targetX = 0,
        targetY = 0,
        mode = "hover";
      const smooth = (a, b, x) => T.MathUtils.smoothstep(x, a, b);
      if (q < 10) {
        targetX = 0.3;
        targetY = 0.004 * Math.sin(t * 0.8);
      } else if (q < 13) {
        const u = smooth(10, 13, q);
        desired = 0.36 * Math.sin(PI * u) + 0.07;
        targetX = lerp(0.3, -0.38, u);
        targetY = lerp(0, 0.09, u);
        targetHeading = 0.12 - 0.13 * Math.sin(PI * u);
        mode = "glide";
      } else if (q < 16) {
        const u = smooth(13, 16, q);
        targetX = -0.38;
        targetY = 0.09;
        targetHeading = 0.12 + PI * u;
        desired = 0.07 + 0.12 * Math.sin(PI * u);
        mode = "turn";
      } else if (q < 26) {
        targetX = -0.38;
        targetY = 0.09;
        targetHeading = PI + 0.12;
        desired = 0.045;
        mode = "hover";
      } else if (q < 29) {
        const u = smooth(26, 29, q);
        targetX = lerp(-0.38, 0.3, u);
        targetY = lerp(0.09, -0.03, u);
        targetHeading = PI + 0.12 - 0.12 * Math.sin(PI * u);
        desired = 0.32 * Math.sin(PI * u) + 0.07;
        mode = "glide";
      } else {
        const u = smooth(29, 32, q);
        targetX = 0.3;
        targetY = lerp(-0.03, 0, u);
        targetHeading = PI + 0.12 + PI * u;
        desired = 0.07 + 0.12 * Math.sin(PI * u);
        mode = "turn";
      }
      if (inspect) {
        targetX = 0;
        targetY = 0;
        targetHeading = 0.1;
        desired = 0.045;
        mode = "hover";
      }
      // Optional host-owned locomotion (e.g. the globe). Without it the
      // standalone Atelier keeps its original inspection choreography.
      const locomotion = fish.userData.locomotion;
      // Standalone surface air gulp; a host with its own locomotion supplies its own.
      const trip = locomotion || inspect ? null : gulpState(t);
      lift = T.MathUtils.damp(lift, trip ? trip.lift : 0, 6, dt);
      if (lift < 1e-4 && !trip?.lift) lift = 0;
      const shown = gulpPresentation(trip, lift);
      gulpOpen = T.MathUtils.damp(gulpOpen, shown.mouth, 25, dt);
      gulpGill = T.MathUtils.damp(gulpGill, shown.gill, 25, dt);
      if (trip && trip.phase !== "none") { desired += 0.14 * trip.swim; mode = "surface"; }
      if (locomotion) { desired = locomotion.drive; mode = locomotion.mode; }
      drive = T.MathUtils.damp(drive, desired, 3, dt);
      const old = heading;
      heading +=
        Math.atan2(
          Math.sin(targetHeading - heading),
          Math.cos(targetHeading - heading),
        ) *
        (1 - Math.exp(-3 * dt));
      if (locomotion) heading = locomotion.heading;
      const angularVelocity = locomotion ? locomotion.angularVelocity : dt ? (heading - old) / dt : 0;
      turn = T.MathUtils.damp(turn, locomotion ? (locomotion.steerRate ?? angularVelocity) : angularVelocity, 4, dt);
      tx = T.MathUtils.damp(tx, targetX, 2, dt);
      ty = T.MathUtils.damp(ty, targetY, 2, dt);
      flowStrength = T.MathUtils.damp(flowStrength, water.strength, 1.8, dt);
      const previousPosition = fish.position.clone();
      const previousRotation = locomotion ? fish.quaternion.clone() : null;
      fish.position.set(
        tx + 0.325 * (1 - Math.cos(heading)),
        ty + 0.003 * Math.sin(t * 1.31),
        0.325 * Math.sin(heading),
      );
      fish.rotation.set(
        0.004 * Math.sin(t * 0.57),
        heading,
        0.004 * Math.sin(t * 0.71) - drive * 0.025 - lift * GULP_PITCH,
      );
      if (lift > 1e-4) {
        // Hold the mouth just under the surface, blended in with the climb.
        fish.updateMatrixWorld(true);
        bodyMotion.transform(-1.68, 0.0832, 0, lipLocal);
        fish.localToWorld(lipWorld.set(lipLocal[0], lipLocal[1], lipLocal[2]));
        const shift = lift * (SURFACE_Y - MOUTH_DEPTH - lipWorld.y);
        fish.position.y += shift;
        lipWorld.y += shift;
      }
      if (locomotion) {
        fish.position.fromArray(locomotion.position);
        fish.rotation.set(locomotion.roll ?? 0, heading, -locomotion.pitch, 'YZX');
      }
      const velocity = locomotion ? locomotion.velocity : dt ? fish.position.clone().sub(previousPosition).multiplyScalar(1 / dt).toArray() : [0, 0, 0];
      const localFlow = fish.userData.externalFlow ?? waterVelocity(t, fish.position.x, fish.position.y, fish.position.z, flowStrength, water.direction, []);
      let localHydrodynamics;
      if (locomotion) {
        const inverse = fish.quaternion.clone().invert();
        const delta = inverse.clone().multiply(previousRotation).invert();
        if (delta.w < 0) { delta.x *= -1; delta.y *= -1; delta.z *= -1; delta.w *= -1; }
        const sine = Math.hypot(delta.x, delta.y, delta.z);
        const factor = dt > 0 && sine > 1e-8 ? 2 * Math.atan2(sine, delta.w) / (sine * dt) : 0;
        localHydrodynamics = {
          flow: new T.Vector3().fromArray(localFlow).applyQuaternion(inverse).toArray(),
          velocity: new T.Vector3().fromArray(velocity).applyQuaternion(inverse).toArray(),
          angular: [delta.x * factor, delta.y * factor, delta.z * factor],
        };
      }
      const relativeFlow = Math.hypot(...localFlow.map((v, i) => v - velocity[i]));
      gait.advance(dt, drive, relativeFlow, turn, POSES[mode] ?? {});
      const { phase, effort, breathPhase, pectoralPhase, scull, tuck, pectoralEffort, pectoralScull } = gait;
      // The standalone turn also leads with the neck; the rear follows the head's tangent.
      bodyMotion.advanceTurn(dt, locomotion ? locomotion.steerRate ?? angularVelocity : turn, locomotion ? locomotion.speed ?? 0 : Math.hypot(...velocity));
      bodyMotion.update(phase, effort, turn, breathPhase, locomotion?.gulp ?? gulpOpen, locomotion?.gulpGill ?? gulpGill);
      if (lift > 0 || fish.userData.gulp.lift > 0) {
        const g = fish.userData.gulp;
        g.lift = lift; g.phase = shown.phase; g.clock = shown.clock;
        lipWorld.toArray(g.lip);
      }
      spineTexture.needsUpdate = dt > 0;
      uniforms.uPhase.value = phase;
      uniforms.uDrive.value = drive;
      uniforms.uTurn.value = turn;
      uniforms.uFold.value = drive;
      uniforms.uMouth.value = bodyMotion.mouth;
      uniforms.uGill.value = bodyMotion.gill;
      const state = {
        body: bodyMotion, time: t, phase, pectoralPhase, scull, tuck, pectoralEffort, pectoralScull, drive: effort * 0.55, effort, turn, flare: uniforms.uFlare.value, clamp: display.clamp,
        heading, angularVelocity, velocity, origin: fish.position.toArray(),
        localHydrodynamics,
        strength: flowStrength, direction: water.direction, externalFlow: fish.userData.externalFlow,
        bodyRadius(x, y) {
          const pixelX = x / SCALE + 680;
          if (pixelX < 155 || pixelX > 1010) return 0;
          section(pixelX, contour);
          const top = contour[1], bottom = contour[2], thick = contour[3];
          const mid = (420 - (top + bottom) / 2) * SCALE, radius = (bottom - top) * 0.5 * SCALE;
          const q = (y - mid) / radius;
          return Math.abs(q) >= 1 ? 0 : Math.sqrt(1 - q * q) * thick * SCALE;
        },
      };
      for (const fin of finDynamics) {
        fin.advance(dt, state);
        fin.texture.needsUpdate = dt > 0;
      }
      fish.userData.flowStrength = flowStrength;
      fish.userData.mode = mode;
      fish.userData.drive = drive;
      fish.userData.effort = effort;
      fish.userData.stroke = gait.stroke;
      fish.userData.breathPhase = breathPhase;
      fish.userData.turn = turn;
    },
  };
  return fish;
}
