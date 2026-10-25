// The betta bowl's furnishings as triangle meshes (its page only): the shared ground rules for the
// pieces (wood.mjs, rocks.mjs, plants.mjs), the mesh they hand over, and helpers. The pieces are
// built once at load, deterministically (seeded), packed into one BVH (scapeBVH.mjs) and traced on
// the same refracted rays as the water and the fish, like the betta's own mesh.
//
// The bowl's frame: world units, the glass's outer radius 1 (~12 cm; its inner radius
// GLASS_INNER), the origin at the sphere's centre, y up the bowl's axis (the mouth is at y 0.88),
// x to the right and z towards the viewer (the camera looks down -z from z ~6.5, y ~0.9).
// Everything here is fixed to the bowl (it turns with it).

/** The sand bed's top at rest (FluidSim's sandLevel on this page), and how far out it reaches
 *  there (the glass's inner radius at that height). */
export const BED_LEVEL = -0.6;
export const GLASS_INNER = 0.99125;
export const BED_RADIUS = Math.sqrt(GLASS_INNER * GLASS_INNER - BED_LEVEL * BED_LEVEL);
/** Nothing may come nearer the glass than this (centre to surface, any height above the bed). */
export const GLASS_CLEAR = 0.95;

/** What a triangle is made of (the shader shades each its own way). Each vertex carries four
 *  numbers (attrs) whose meaning is the material's:
 *  - BARK: the driftwood's outside. x: distance along its branch (world units, running on across
 *    joints), y: angle round it (radians), z: how deep in the bark's relief the point lies
 *    (0: a ridge's crest, 1: the bottom of a fissure), w: ambient occlusion (1: open, 0: closed).
 *  - WOOD_END: bare wood where a branch is broken off. x, y: across the break (world units,
 *    from its middle), z: 0, w: occlusion.
 *  - ROCK: x: which rock (0, 1, ...), y: cavity (0: exposed, 1: deep in a crack), z: 0, w: occlusion.
 *  - LEAF_BIG, LEAF_SMALL: a leaf blade. x: along it from its base (0..1), y: across it (-1 at one
 *    edge, 1 at the other, 0 on the midrib), z: which leaf (0, 1, ...), w: occlusion. Blades are
 *    thin two-sided sheets: one layer of triangles, the shader lights both faces.
 *  - STEM: a leaf's stalk or a plant's stem. x: along it (world units), y: angle round it, z: which
 *    stem, w: occlusion.
 *  - ROOT: crown and roots where a plant meets the sand. x, y, z: as STEM, w: occlusion. */
export const MAT = { BARK: 1, WOOD_END: 2, ROCK: 3, LEAF_BIG: 4, LEAF_SMALL: 5, STEM: 6, ROOT: 7 };

/** @typedef {[number, number, number]} V3 */
/**
 * @typedef {object} ScapeMesh
 * @property {string} name
 * @property {Float32Array} positions three a vertex
 * @property {Float32Array} normals three a vertex, of unit length (smooth shading)
 * @property {Float32Array} attrs four a vertex (see MAT)
 * @property {Uint32Array} indices three a triangle, counter-clockwise seen from outside
 * @property {Uint8Array} materials one a triangle (MAT)
 */
/**
 * Where the fish keeps clear of: a capsule from a to b. r: the margin it swims round (centre line
 * to the edge of the room it leaves); solid: the part its body must never enter (0 for leaves it
 * may brush past).
 * @typedef {{ a: V3, b: V3, r: number, solid: number }} Obstacle
 */
/** @typedef {{ meshes: ScapeMesh[], obstacles: Obstacle[] }} ScapePiece */

/** A small seeded random stream in [0, 1). */
export function stream(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Gradient noise (Perlin's improved, seeded by a fixed permutation): smooth, about -1..1.
const PERM = (() => {
  const rand = stream(77);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  return Uint8Array.from([...p, ...p]);
})();
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h, x, y, z) => {
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};
export function noise3(x, y, z) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = PERM[X] + Y, AA = PERM[A] + Z, AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y, BA = PERM[B] + Z, BB = PERM[B + 1] + Z;
  const l = (a, b, t) => a + (b - a) * t;
  return l(
    l(l(grad(PERM[AA] & 15, x, y, z), grad(PERM[BA] & 15, x - 1, y, z), u), l(grad(PERM[AB] & 15, x, y - 1, z), grad(PERM[BB] & 15, x - 1, y - 1, z), u), v),
    l(l(grad(PERM[AA + 1] & 15, x, y, z - 1), grad(PERM[BA + 1] & 15, x - 1, y, z - 1), u), l(grad(PERM[AB + 1] & 15, x, y - 1, z - 1), grad(PERM[BB + 1] & 15, x - 1, y - 1, z - 1), u), v),
    w,
  );
}
/** Fractal noise: `octaves` of noise3, each twice as fine and `gain` as strong. */
export function fbm3(x, y, z, octaves = 4, gain = 0.5) {
  let sum = 0, amp = 1, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise3(x, y, z);
    norm += amp;
    amp *= gain;
    x = x * 2.03 + 17.1;
    y = y * 2.03 + 3.7;
    z = z * 2.03 + 9.3;
  }
  return sum / norm;
}

/** Builds one mesh: vertices with a position, an optional normal (else computed from the faces
 *  round it) and four attributes; triangles with a material. */
export class MeshBuilder {
  constructor(name) {
    this.name = name;
    /** @type {number[]} */ this.p = [];
    /** @type {(number|null)[]} */ this.n = [];
    /** @type {number[]} */ this.a = [];
    /** @type {number[]} */ this.i = [];
    /** @type {number[]} */ this.m = [];
  }
  get vertexCount() {
    return this.p.length / 3;
  }
  /** Adds a vertex; returns its index. */
  vertex(p, attrs = [0, 0, 0, 1], n = null) {
    this.p.push(p[0], p[1], p[2]);
    if (n) this.n.push(n[0], n[1], n[2]);
    else this.n.push(null, null, null);
    this.a.push(attrs[0], attrs[1], attrs[2], attrs[3]);
    return this.vertexCount - 1;
  }
  tri(a, b, c, material) {
    this.i.push(a, b, c);
    this.m.push(material);
  }
  quad(a, b, c, d, material) {
    this.tri(a, b, c, material);
    this.tri(a, c, d, material);
  }
  /** @returns {ScapeMesh} */
  finish() {
    const vc = this.vertexCount;
    const normals = new Float32Array(vc * 3);
    const missing = new Uint8Array(vc);
    for (let v = 0; v < vc; v++) {
      if (this.n[v * 3] === null) missing[v] = 1;
      else normals.set([this.n[v * 3], this.n[v * 3 + 1], this.n[v * 3 + 2]], v * 3);
    }
    // (Area-weighted face normals, for the vertices given none.)
    for (let t = 0; t < this.i.length; t += 3) {
      const [a, b, c] = [this.i[t], this.i[t + 1], this.i[t + 2]];
      const P = this.p;
      const e1 = [P[b * 3] - P[a * 3], P[b * 3 + 1] - P[a * 3 + 1], P[b * 3 + 2] - P[a * 3 + 2]];
      const e2 = [P[c * 3] - P[a * 3], P[c * 3 + 1] - P[a * 3 + 1], P[c * 3 + 2] - P[a * 3 + 2]];
      const fn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      for (const v of [a, b, c]) if (missing[v]) for (let k = 0; k < 3; k++) normals[v * 3 + k] += fn[k];
    }
    for (let v = 0; v < vc; v++) {
      const l = Math.hypot(normals[v * 3], normals[v * 3 + 1], normals[v * 3 + 2]) || 1;
      for (let k = 0; k < 3; k++) normals[v * 3 + k] /= l;
    }
    return {
      name: this.name,
      positions: Float32Array.from(this.p),
      normals,
      attrs: Float32Array.from(this.a),
      indices: Uint32Array.from(this.i),
      materials: Uint8Array.from(this.m),
    };
  }
}

/** Problems with a mesh (an empty list when it is sound): NaNs, indices out of range, normals not of
 *  unit length, attributes out of their ranges, anything nearer the glass than GLASS_CLEAR, or
 *  below the glass's bottom. */
export function checkMesh(mesh) {
  const out = [];
  const vc = mesh.positions.length / 3;
  if (mesh.normals.length !== vc * 3) out.push('normals: wrong length');
  if (mesh.attrs.length !== vc * 4) out.push('attrs: wrong length');
  if (mesh.indices.length % 3 || mesh.materials.length !== mesh.indices.length / 3) out.push('indices/materials: wrong length');
  for (const [name, arr] of [['positions', mesh.positions], ['normals', mesh.normals], ['attrs', mesh.attrs]]) {
    if (arr.some((x) => !Number.isFinite(x))) out.push(`${name}: not finite`);
  }
  for (const i of mesh.indices) if (i >= vc) { out.push('indices: out of range'); break; }
  let far = 0;
  for (let v = 0; v < vc; v++) {
    const [x, y, z] = [mesh.positions[v * 3], mesh.positions[v * 3 + 1], mesh.positions[v * 3 + 2]];
    const nl = Math.hypot(mesh.normals[v * 3], mesh.normals[v * 3 + 1], mesh.normals[v * 3 + 2]);
    if (Math.abs(nl - 1) > 1e-3) { out.push(`normal ${v} not unit (${nl})`); break; }
    if (y > BED_LEVEL - 0.02 && Math.hypot(x, y, z) > GLASS_CLEAR) far++;
    if (Math.hypot(x, y, z) > GLASS_INNER - 0.005) { out.push(`vertex ${v} outside the glass`); break; }
    const w = mesh.attrs[v * 4 + 3];
    if (!(w >= 0 && w <= 1)) { out.push(`attrs ${v}: occlusion out of 0..1`); break; }
  }
  if (far) out.push(`${far} vertices nearer the glass than GLASS_CLEAR`);
  for (const m of mesh.materials) if (!Object.values(MAT).includes(m)) { out.push(`material ${m} unknown`); break; }
  return out;
}

/** WGSL every piece's material functions may use (scapeBVH.mjs's shader puts it first). A piece
 *  exports `WGSL`: one function a material it makes, named scape_mat_<name> and of the form
 *    fn scape_mat_<name>(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat
 *  attrs: the vertex attributes interpolated (see MAT); p: the point (the bowl's frame); n: the
 *  interpolated vertex normal (the bowl's frame, as the mesh has it, not turned to the viewer);
 *  foot: a pixel's size there (world units: draw detail finer than ~2 pixels faded to its mean);
 *  front: the ray meets the side n points to. It returns what the shader lights (ScapeMat). Only
 *  WGSL builtins and these helpers; explicit f32 literals (1.0, not 1) wherever a type could be
 *  abstract (Firefox's compiler is strict). */
export const SCAPE_WGSL_COMMON = /* wgsl */ `
struct ScapeMat {
  // Linear reflectance (0..1); the shading normal (the bowl's frame, the side the input n is on,
  // fine relief added); specular roughness (0 mirror .. 1 matte) and strength (Fresnel at normal
  // incidence: ~0.02 dry, ~0.04 wet or waxy); light a thin blade lets through (linear, 0 opaque);
  // ambient occlusion (1 open .. 0 closed).
  albedo: vec3f,
  n: vec3f,
  rough: f32,
  spec: f32,
  trans: vec3f,
  ao: f32,
}

fn scape_hash3i(c: vec3i) -> vec3f {
  var v = bitcast<vec3u>(c) * 1664525u + vec3u(1013904223u);
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> vec3u(16u);
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return vec3f(v) * (1.0 / 4294967296.0);
}

// 0, set by the shader these run in from a uniform (the bowl's: shaders.ts globes_shade), so a
// GPU's compiler cannot unroll a loop that starts at it: a function called in one is compiled
// once, not once for each turn (see globesZero there).
var<private> scapeZero: i32 = 0;

fn scape_grad(c: vec3i, f: vec3f) -> f32 {
  return dot(scape_hash3i(c) * 2.0 - vec3f(1.0), f);
}

// Gradient noise, about -1..1, smooth. (The corners a pair at a time, along x, each pair's blend
// shifted in: y then z.)
fn scape_noise3(p: vec3f) -> f32 {
  let fl = floor(p);
  let i = vec3i(fl);
  let f = p - fl;
  let u = f * f * f * (f * (f * 6.0 - vec3f(15.0)) + vec3f(10.0));
  var zs = vec2f(0.0);
  for (var k = scapeZero; k < 2; k++) {
    var ys = vec2f(0.0);
    for (var j = scapeZero; j < 2; j++) {
      let c = vec3i(0, j, k);
      let g0 = scape_grad(i + c, f - vec3f(c));
      let g1 = scape_grad(i + c + vec3i(1, 0, 0), f - vec3f(c + vec3i(1, 0, 0)));
      ys = vec2f(ys.y, mix(g0, g1, u.x));
    }
    zs = vec2f(zs.y, mix(ys.x, ys.y, u.y));
  }
  return 1.15 * mix(zs.x, zs.y, u.z);
}

// Fractal noise: octaves of scape_noise3, each twice as fine and half as strong (about -1..1).
fn scape_fbm3(p: vec3f, octaves: i32) -> f32 {
  var sum = 0.0;
  var amp = 1.0;
  var norm = 0.0;
  var q = p;
  for (var o = 0; o < octaves; o++) {
    sum += amp * scape_noise3(q);
    norm += amp;
    amp *= 0.5;
    q = q * 2.03 + vec3f(17.1, 3.7, 9.3);
  }
  return sum / norm;
}

// Cells (Worley): the distances to the nearest and the second nearest of one random point a unit
// cell, and the nearest's random id (0..1).
fn scape_cells3(p: vec3f) -> vec3f {
  let fl = floor(p);
  let i = vec3i(fl);
  let f = p - fl;
  var d1 = 9.0;
  var d2 = 9.0;
  var id = 0.0;
  for (var z = -1; z <= 1; z++) {
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        let c = vec3i(x, y, z);
        let h = scape_hash3i(i + c);
        let d = length(vec3f(c) + h - f);
        if (d < d1) {
          d2 = d1;
          d1 = d;
          id = h.x;
        } else if (d < d2) {
          d2 = d;
        }
      }
    }
  }
  return vec3f(d1, d2, id);
}

// sRGB colour (0..1) to linear.
fn scape_linear(c: vec3f) -> vec3f {
  return select(c / 12.92, pow((c + vec3f(0.055)) / 1.055, vec3f(2.4)), c > vec3f(0.04045));
}
`;
