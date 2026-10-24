// What lives in the betta bowl besides the fish (its page only): a bed of natural aquarium gravel,
// a piece of driftwood with an anubias growing on it, an Indian almond leaf floating on the water,
// and the bubble nest the betta keeps against the glass at the waterline. The driftwood and the
// plant are fixed to the bowl (they turn with it); the leaf floats where the water takes it and the
// nest rides the film at the glass (interaction/BowlLife.ts moves both, from the water's probes).
// All of it is traced in the bowl's shader (shaders.ts, in globes_trace's segments) on the same
// refracted rays as the water and the fish: capsules and curved leaf blades met analytically (no
// marching), the gravel as pebbles shaded into the bed's height field, the nest as thin films.
//
// World units (the glass's outer radius is 1, ~12 cm); the bowl's own frame, its axis up.

type V3 = [number, number, number];

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));
const lerp = (a: V3, b: V3, t: number): V3 => add(a, mul(add(b, mul(a, -1)), t));

/** A small seeded random stream (the plant and the nest are the same on every load). */
function stream(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The gravel: the bed's height at rest (a ~3.5 cm layer) and the pebbles' size (~5 mm). It flows
 *  exactly as the globes' sand does when the bowl tips (the same bed, FluidSim's), its pebbles
 *  carried along with it (FluidSim.gravel). */
export const GRAVEL = { level: -0.66, pebble: 0.04 };

/** A piece of the plant: a capsule tapering from ra at a to rb at b (a round cone), of wood (1),
 *  the anubias' rhizome (2) or a leaf's stalk (3). */
interface Capsule {
  a: V3;
  b: V3;
  ra: number;
  rb: number;
  kind: number;
  /** How far along its branch its ends are (world units), and the branch's own number. */
  s0: number;
  s1: number;
  branch: number;
}

/** A leaf blade: from its base along `along`, its face turned to `normal`; its length, half its
 *  width, how its tip droops (arch) and its sides curl up (cup), both as heights over its length
 *  and half-width. */
interface Blade {
  base: V3;
  along: V3;
  normal: V3;
  length: number;
  width: number;
  arch: number;
  cup: number;
}

/** A gnarled piece of driftwood lying on the gravel at the back, its far end and a side branch
 *  half buried, with an Anubias nana tied on along its top (the betta's classic plant: slow,
 *  dark, glossy leaves on short stalks from a creeping rhizome, holding to the wood by its roots). */
function buildPlant() {
  const rand = stream(2371);
  const parts: Capsule[] = [];
  let branches = 0;
  /** A run of round cones along a smooth path through `points` (Catmull-Rom), its radius
   *  tapering from r0 to r1, swelling and narrowing a little along it: one piece of wood or
   *  rhizome, seamless at its joints. */
  const branch = (points: V3[], r0: number, r1: number, segments: number, kind: number, knob: number) => {
    const p1 = rand() * 6.3, p2 = rand() * 6.3;
    const radius = (u: number) => (r0 + (r1 - r0) * u) * (1 + knob * (0.6 * Math.sin(11 * u + p1) + 0.4 * Math.sin(27 * u + p2)));
    const at = (u: number): V3 => {
      const n = points.length - 1;
      const i = Math.min(Math.floor(u * n), n - 1);
      const t = u * n - i;
      const p0 = points[Math.max(i - 1, 0)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(i + 2, n)];
      const c = (k: number) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t * t * t);
      return [c(0), c(1), c(2)];
    };
    let prev = at(0);
    let run = 0;
    const id = branches++;
    for (let s = 1; s <= segments; s++) {
      const u = s / segments;
      const next = at(u);
      const len = Math.hypot(next[0] - prev[0], next[1] - prev[1], next[2] - prev[2]);
      parts.push({ a: prev, b: next, ra: radius(u - 1 / segments), rb: radius(u), kind, s0: run, s1: run + len, branch: id });
      run += len;
      prev = next;
    }
  };
  // The log, lying along the back of the bed (its far end half buried), a side branch rising from
  // it, and a broken-off stub.
  branch([[-0.63, -0.705, -0.17], [-0.48, -0.65, -0.26], [-0.33, -0.625, -0.33], [-0.19, -0.615, -0.39], [-0.06, -0.645, -0.35]], 0.054, 0.026, 16, 1, 0.14);
  branch([[-0.41, -0.635, -0.3], [-0.45, -0.56, -0.26], [-0.43, -0.49, -0.25], [-0.395, -0.455, -0.27]], 0.03, 0.012, 8, 1, 0.12);
  const wood = parts.slice();
  const woodCount = parts.length;
  // The rhizome, creeping along the top of the log.
  const rh: V3[] = [[-0.52, -0.602, -0.235], [-0.44, -0.592, -0.275], [-0.35, -0.583, -0.315], [-0.27, -0.572, -0.35]];
  branch(rh, 0.015, 0.012, 6, 2, 0.1);
  const rhizomeEnd = parts.length;
  const blades: Blade[] = [];
  const up: V3 = [0, 1, 0];
  // (Facing out into the bowl, towards its middle and the front.)
  const face = Math.atan2(0.62, 0.4);
  const LEAVES = 11;
  for (let k = 0; k < LEAVES; k++) {
    const t = (k + 0.25 + 0.5 * rand()) / LEAVES;
    const seg = Math.min(Math.floor(t * 3), 2);
    const at = add(lerp(rh[seg], rh[seg + 1], t * 3 - seg), [0, 0.01, 0]);
    const az = face + (k - (LEAVES - 1) / 2) * 0.32 + (rand() - 0.5) * 0.5;
    const rise = 0.6 + 0.65 * rand();
    const stalk: V3 = [Math.cos(rise) * Math.cos(az), Math.sin(rise), Math.cos(rise) * Math.sin(az)];
    const young = rand() < 0.25;
    const base = add(at, mul(stalk, (young ? 0.02 : 0.03) + 0.025 * rand()));
    parts.push({ a: at, b: base, ra: 0.0048, rb: 0.0038, kind: 3, s0: 0, s1: 0.04, branch: 9 + k });
    const lean = rise - 0.3 - 0.35 * rand();
    const turn = az + (rand() - 0.5) * 0.4;
    const along = norm([Math.cos(lean) * Math.cos(turn), Math.sin(lean), Math.cos(lean) * Math.sin(turn)]);
    const side = norm(cross(up, along));
    let normal = norm(cross(along, side));
    // (A little roll about its midrib.)
    const roll = (rand() - 0.5) * 0.7;
    normal = norm(add(mul(normal, Math.cos(roll)), mul(cross(along, normal), Math.sin(roll))));
    const size = young ? 0.8 : 1.3;
    blades.push({
      base,
      along,
      normal,
      length: (0.18 + 0.08 * rand()) * size,
      width: (0.066 + 0.024 * rand()) * size,
      arch: -(0.02 + 0.025 * rand()) * size,
      cup: (0.005 + 0.008 * rand()) * size,
    });
  }
  // Its box, a little larger (body frame).
  const lo: V3 = [Infinity, Infinity, Infinity];
  const hi: V3 = [-Infinity, -Infinity, -Infinity];
  const grow = (p: V3, r: number) => {
    for (let i = 0; i < 3; i++) {
      lo[i] = Math.min(lo[i], p[i] - r);
      hi[i] = Math.max(hi[i], p[i] + r);
    }
  };
  for (const c of parts) {
    grow(c.a, c.ra);
    grow(c.b, c.rb);
  }
  for (const b of blades) {
    const side = norm(cross(b.normal, b.along));
    for (const s of [0, 0.5, 1]) for (const v of [-1, 1]) grow(add(add(b.base, mul(b.along, s * b.length)), mul(side, v * b.width)), 0.04);
  }
  return { parts, wood, woodCount, rhizomeEnd, blades, lo, hi };
}

export const PLANT = buildPlant();

/** Where the fish keeps clear of (the bowl's frame): the log (two lengths of it), its branch and
 *  the leaves round the rhizome; r, the margin it swims round, solid, the part its body must never
 *  enter (0: none, the leaves). */
export const PLANT_OBSTACLES: { a: V3; b: V3; r: number; solid: number }[] = [
  { a: [-0.63, -0.7, -0.17], b: [-0.33, -0.625, -0.33], r: 0.1, solid: 0.062 },
  { a: [-0.33, -0.625, -0.33], b: [-0.06, -0.645, -0.35], r: 0.09, solid: 0.05 },
  { a: [-0.41, -0.635, -0.3], b: [-0.4, -0.455, -0.27], r: 0.075, solid: 0.036 },
  { a: [-0.5, -0.52, -0.24], b: [-0.26, -0.48, -0.36], r: 0.22, solid: 0 },
];

/** The floating Indian almond (catappa) leaf: a small dried one, ~5 cm, brown, its widest part
 *  towards its tip; its length and half-width, how its sides and ends curl up out of the water. */
export const LEAF = { length: 0.42, width: 0.115, cup: 0.012, arch: 0.016 };

/** The nest: up to NEST_MAX bubbles (0.7 to 2 mm), in a raft against the glass at the waterline,
 *  NEST_SPAN along the glass and NEST_DEEP out from it, piled two deep in its middle. Its bubbles
 *  in the order the fish builds them (heart first): along the glass, out from it (centre), the
 *  height of its centre over the film, radius. */
export const NEST_MAX = 170;
const NEST_SPAN = 0.22;
const NEST_DEEP = 0.14;

function buildNest(): [number, number, number, number][] {
  const rand = stream(9013);
  const out: [number, number, number, number][] = [];
  for (let tries = 0; tries < 40000 && out.length < NEST_MAX; tries++) {
    const u = (rand() * 2 - 1) * NEST_SPAN;
    const v = rand() * NEST_DEEP;
    // Densest against the glass in the middle; thinning out at the raft's edge.
    const edge = (u / NEST_SPAN) ** 2 + (v / NEST_DEEP) ** 2;
    if (edge > 1 || rand() > 1.1 - edge) continue;
    const r = 0.006 + 0.011 * rand() ** 2.2;
    const vc = v + r + 0.002;
    if (out.some(([bu, bv, bh, br]) => bh === 0 && Math.hypot(bu - u, bv - vc) < (br + r) * 0.92)) continue;
    out.push([u, vc, 0, r]);
  }
  // The second layer, on the first in the middle.
  const first = out.length;
  for (let tries = 0; tries < 20000 && out.length < NEST_MAX; tries++) {
    const u = (rand() * 2 - 1) * NEST_SPAN * 0.55;
    const v = rand() * NEST_DEEP * 0.55;
    const r = 0.006 + 0.008 * rand() ** 2;
    const vc = v + r + 0.002;
    const below = out.slice(0, first).filter(([bu, bv, , br]) => Math.hypot(bu - u, bv - vc) < br + r);
    if (below.length < 2) continue;
    if (out.slice(first).some(([bu, bv, , br]) => Math.hypot(bu - u, bv - vc) < (br + r) * 0.92)) continue;
    const h = Math.max(...below.map(([bu, bv, , br]) => Math.sqrt(Math.max(0, (br + r) ** 2 - (bu - u) ** 2 - (bv - vc) ** 2)) - 0.25 * br));
    out.push([u, vc, h, r]);
  }
  // Heart first (the fish builds from the middle out), shuffled a little.
  return out
    .map((b) => ({ b, key: Math.hypot(b[0] / NEST_SPAN, b[1] / NEST_DEEP) + (b[2] > 0 ? 0.35 : 0) + 0.25 * rand() }))
    .sort((x, y) => x.key - y.key)
    .map((x) => x.b);
}

export const NEST = buildNest();

const f = (x: number) => x.toFixed(6);
const v3 = (v: V3) => `vec3f(${f(v[0])}, ${f(v[1])}, ${f(v[2])})`;

/** The bowl's contents, for the globe's shader (after bowlWGSL; needs globes_bg, globes_fresnel,
 *  globes_noise3, globes_hash3, globes_sunIn, betta_dapple and the sky/sun constants). The ray
 *  functions take points and directions in the translating frame; scapeRot is the bowl's turn. */
export function bowlScapeWGSL(radius: number): string {
  const { parts, woodCount, rhizomeEnd, blades, lo, hi } = PLANT;
  const caps = parts.map((c) => `vec4f(${v3(c.a)}, ${f(c.ra)}), vec4f(${v3(c.b)}, ${f(c.rb)}), vec4f(${f(c.s0)}, ${f(c.s1)}, ${f(c.branch)}, 0.0)`).join(',\n  ');
  const leaves = blades
    .map((b) => `vec4f(${v3(b.base)}, ${f(b.length)}), vec4f(${v3(b.along)}, ${f(b.width)}), vec4f(${v3(b.normal)}, ${f(b.arch)}), vec4f(${f(b.cup)}, 0.0, 0.0, 0.0)`)
    .join(',\n  ');
  const nest = NEST.map((b) => `vec4f(${f(b[0])}, ${f(b[1])}, ${f(b[2])}, ${f(b[3])})`).join(',\n  ');
  return /* wgsl */ `
// ---- the betta bowl's contents (src/render/bowlScape.ts) -------------------------------------
const SCAPE_PEBBLE: f32 = ${f(GRAVEL.pebble)};
const SCAPE_CAPS: u32 = ${parts.length}u;
const SCAPE_WOOD: u32 = ${woodCount}u;
const SCAPE_RHIZOME: u32 = ${rhizomeEnd}u;
const SCAPE_CAP: array<vec4f, ${parts.length * 3}> = array<vec4f, ${parts.length * 3}>(
  ${caps});
const SCAPE_BLADES: u32 = ${blades.length}u;
const SCAPE_BLADE: array<vec4f, ${blades.length * 4}> = array<vec4f, ${blades.length * 4}>(
  ${leaves});
const SCAPE_LO: vec3f = ${v3(lo)};
const SCAPE_HI: vec3f = ${v3(hi)};
const SCAPE_LEAF_L: f32 = ${f(LEAF.length)};
const SCAPE_LEAF_W: f32 = ${f(LEAF.width)};
const SCAPE_LEAF_CUP: f32 = ${f(LEAF.cup)};
const SCAPE_LEAF_ARCH: f32 = ${f(LEAF.arch)};
const SCAPE_NEST_N: u32 = ${NEST.length}u;
const SCAPE_NEST: array<vec4f, ${NEST.length}> = array<vec4f, ${NEST.length}>(
  ${nest});
const SCAPE_R: f32 = ${f(radius)};

// Set by globes_shade: the bowl's turn, and what moves (BowlLife.ts): columns 0 and 1 the leaf (its
// middle, its heading; the film's slope under it, x: 1 when it is there), 2 and 3 the nest (its
// heart on the glass at the waterline, its bearing; how many bubbles it has).
var<private> scapeRot: mat3x3f;
var<private> scapeLife: mat4x4f;

// ---- helpers ------------------------------------------------------------------------------
fn scape_hash3v(p: vec3f) -> vec3f {
  return vec3f(globes_hash3(p), globes_hash3(p + vec3f(17.13, 3.71, 9.27)), globes_hash3(p + vec3f(41.9, 27.3, 5.83)));
}

// A ray (o, d; d of unit length) against a capsule: the distance to it ahead, or -1.
fn scape_capsule(o: vec3f, d: vec3f, pa: vec3f, pb: vec3f, r: f32) -> f32 {
  let ba = pb - pa;
  let oa = o - pa;
  let baba = dot(ba, ba);
  let bard = dot(ba, d);
  let baoa = dot(ba, oa);
  let rdoa = dot(d, oa);
  let oaoa = dot(oa, oa);
  let a = baba - bard * bard;
  let b = baba * rdoa - baoa * bard;
  let c = baba * oaoa - baoa * baoa - r * r * baba;
  let h = b * b - a * c;
  if (h < 0.0) { return -1.0; }
  let t = (-b - sqrt(h)) / max(a, 1e-12);
  let y = baoa + t * bard;
  if (y > 0.0 && y < baba && t > 0.0) { return t; }
  // (The caps.)
  let oc = select(o - pb, oa, y <= 0.0);
  let b2 = dot(d, oc);
  let c2 = dot(oc, oc) - r * r;
  let h2 = b2 * b2 - c2;
  if (h2 > 0.0) {
    let t2 = -b2 - sqrt(h2);
    if (t2 > 0.0) { return t2; }
  }
  return -1.0;
}

// A ray against a round cone (from radius ra at pa to rb at pb; after iq's): (t, normal), t < 0 if
// it misses.
fn scape_cone(o: vec3f, d: vec3f, pa: vec3f, pb: vec3f, ra: f32, rb: f32) -> vec4f {
  let ba = pb - pa;
  let oa = o - pa;
  let ob = o - pb;
  let rr = ra - rb;
  let m0 = dot(ba, ba);
  let m1 = dot(ba, oa);
  let m2 = dot(ba, d);
  let m3 = dot(d, oa);
  let m5 = dot(oa, oa);
  let m6 = dot(ob, d);
  let m7 = dot(ob, ob);
  let d2 = m0 - rr * rr;
  let k2 = d2 - m2 * m2;
  let k1 = d2 * m3 - m1 * m2 + m2 * rr * ra;
  let k0 = d2 * m5 - m1 * m1 + m1 * rr * ra * 2.0 - m0 * ra * ra;
  let h = k1 * k1 - k0 * k2;
  if (h < 0.0) { return vec4f(-1.0); }
  let t = (-sqrt(h) - k1) / k2;
  let y = m1 - ra * rr + t * m2;
  if (y > 0.0 && y < d2 && t > 0.0) { return vec4f(t, normalize(d2 * (oa + t * d) - ba * y)); }
  // (Its two round ends.)
  let h1 = m3 * m3 - m5 + ra * ra;
  let h2 = m6 * m6 - m7 + rb * rb;
  if (max(h1, h2) < 0.0) { return vec4f(-1.0); }
  var r = vec4f(1e20, 0.0, 0.0, 0.0);
  if (h1 > 0.0) {
    let t1 = -m3 - sqrt(h1);
    if (t1 > 0.0) { r = vec4f(t1, (oa + t1 * d) / ra); }
  }
  if (h2 > 0.0) {
    let t2 = -m6 - sqrt(h2);
    if (t2 > 0.0 && t2 < r.x) { r = vec4f(t2, (ob + t2 * d) / rb); }
  }
  if (r.x > 1e19) { return vec4f(-1.0); }
  return r;
}

fn scape_capNormal(p: vec3f, pa: vec3f, pb: vec3f) -> vec3f {
  let ba = pb - pa;
  let h = clamp(dot(p - pa, ba) / dot(ba, ba), 0.0, 1.0);
  return normalize(p - pa - ba * h);
}

fn scape_box(o: vec3f, d: vec3f, lo: vec3f, hi: vec3f, tEnd: f32) -> bool {
  let inv = 1.0 / select(d, vec3f(1e-8), abs(d) < vec3f(1e-8));
  let a = (lo - o) * inv;
  let b = (hi - o) * inv;
  let mn = min(a, b);
  let mx = max(a, b);
  return max(max(mn.x, mn.y), max(mn.z, 0.0)) <= min(min(mx.x, mx.y), min(mx.z, tEnd));
}

// A curved blade (its base at the origin, u along it, v across, w off its face): its surface
// w = arch (u / L)^2 + cup (v / W)^2, inside its outline (half-width at s = u / L: shape, 0..1).
// The nearer crossing ahead of a ray in its frame (o, d), before tEnd: (t, u, v), t < 0 if none.
fn scape_bladeCross(o: vec3f, d: vec3f, L: f32, W: f32, arch: f32, cup: f32, tEnd: f32, almond: bool) -> vec3f {
  let ka = arch / (L * L);
  let kc = cup / (W * W);
  // (The almond leaf curls up at both ends: its arch is about its middle.)
  let ou = select(o.x, o.x - 0.5 * L, almond);
  let A = ka * d.x * d.x + kc * d.z * d.z;
  let B = 2.0 * (ka * ou * d.x + kc * o.z * d.z) - d.y;
  let C = ka * ou * ou + kc * o.z * o.z - o.y;
  var t0 = -1.0;
  var t1 = -1.0;
  if (abs(A) < 1e-9) {
    if (abs(B) > 1e-12) { t0 = -C / B; }
  } else {
    let h = B * B - 4.0 * A * C;
    if (h < 0.0) { return vec3f(-1.0, 0.0, 0.0); }
    let sq = sqrt(h);
    let q = -0.5 * (B + select(-sq, sq, B >= 0.0));
    let ta = q / A;
    let tb = select(C / q, ta, abs(q) < 1e-12);
    t0 = min(ta, tb);
    t1 = max(ta, tb);
  }
  for (var k = 0; k < 2; k++) {
    let t = select(t1, t0, k == 0);
    if (t <= 1e-5 || t >= tEnd) { continue; }
    let u = o.x + d.x * t;
    let v = o.z + d.z * t;
    let s = u / L;
    if (s <= 0.0 || s >= 1.0) { continue; }
    if (abs(v) < W * scape_outline(s, almond)) { return vec3f(t, u, v); }
  }
  return vec3f(-1.0, 0.0, 0.0);
}

// A blade's half-width along it (0..1 of the widest): the anubias' ovate leaf, rounded at its
// base and pointed at its tip; the almond leaf's obovate one, widest two thirds of the way out.
fn scape_outline(s: f32, almond: bool) -> f32 {
  if (almond) {
    return 1.72 * pow(s, 0.8) * pow(max(1.0 - s * s * s, 0.0), 0.6);
  }
  if (s < 0.4) { return sqrt(max(1.0 - pow((0.4 - s) / 0.4, 2.0), 0.0)); }
  return pow(max(1.0 - pow((s - 0.4) / 0.6, 1.7), 0.0), 0.75);
}

// ---- the plant ----------------------------------------------------------------------------
struct ScapeHit {
  t: f32,
  // 0: none; 1: wood; 2: rhizome; 3: stalk; 5: an anubias leaf; 6: the floating leaf.
  kind: u32,
  id: u32,
  // On a blade: along it and across it (its own units); the point's normal (translating frame).
  uv: vec2f,
  n: vec3f,
}

fn scape_bladeAxes(k: u32) -> mat3x3f {
  let along = SCAPE_BLADE[4u * k + 1u].xyz;
  let n = SCAPE_BLADE[4u * k + 2u].xyz;
  return mat3x3f(along, n, normalize(cross(along, n)));
}

// The plant along a ray (translating frame) before tEnd.
fn scape_capKind(k: u32) -> u32 {
  return select(select(3u, 2u, k < SCAPE_RHIZOME), 1u, k < SCAPE_WOOD);
}

fn scape_plant(p: vec3f, dir: vec3f, tEnd: f32) -> ScapeHit {
  var hit = ScapeHit(1e9, 0u, 0u, vec2f(0.0), vec3f(0.0, 1.0, 0.0));
  let o = transpose(scapeRot) * p;
  let d = transpose(scapeRot) * dir;
  if (!scape_box(o, d, SCAPE_LO, SCAPE_HI, tEnd)) { return hit; }
  for (var k = 0u; k < SCAPE_CAPS; k++) {
    let A = SCAPE_CAP[3u * k];
    let B = SCAPE_CAP[3u * k + 1u];
    let c = scape_cone(o, d, A.xyz, B.xyz, A.w, B.w);
    if (c.x > 0.0 && c.x < min(hit.t, tEnd)) {
      hit = ScapeHit(c.x, scape_capKind(k), k, vec2f(0.0), scapeRot * c.yzw);
    }
  }
  for (var k = 0u; k < SCAPE_BLADES; k++) {
    let base = SCAPE_BLADE[4u * k];
    let ax = scape_bladeAxes(k);
    let ol = transpose(ax) * (o - base.xyz);
    let dl = transpose(ax) * d;
    // (The blade's frame: x along it, y off its face, z across.)
    let L = base.w;
    let W = SCAPE_BLADE[4u * k + 1u].w;
    let arch = SCAPE_BLADE[4u * k + 2u].w;
    let cup = SCAPE_BLADE[4u * k + 3u].x;
    let c = scape_bladeCross(ol, dl, L, W, arch, cup, min(hit.t, tEnd), false);
    if (c.x > 0.0) {
      let gu = 2.0 * arch * c.y / (L * L);
      let gv = 2.0 * cup * c.z / (W * W);
      let nl = normalize(vec3f(-gu, 1.0, -gv));
      hit = ScapeHit(c.x, 5u, k, vec2f(c.y / L, c.z / W), scapeRot * (ax * nl));
    }
  }
  return hit;
}

// How much sunlight gets past the plant from x towards L (translating frame): the wood and the
// stalks block it, a leaf lets a little through, green.
fn scape_plantShadow(x: vec3f, L: vec3f) -> vec3f {
  let o = transpose(scapeRot) * x;
  let d = transpose(scapeRot) * L;
  if (!scape_box(o, d, SCAPE_LO, SCAPE_HI, 4.0)) { return vec3f(1.0); }
  var T = vec3f(1.0);
  for (var k = 0u; k < SCAPE_CAPS; k++) {
    let A = SCAPE_CAP[3u * k];
    let B = SCAPE_CAP[3u * k + 1u];
    if (scape_cone(o, d, A.xyz, B.xyz, A.w, B.w).x > 0.0) { return vec3f(0.0); }
  }
  for (var k = 0u; k < SCAPE_BLADES; k++) {
    let base = SCAPE_BLADE[4u * k];
    let ax = scape_bladeAxes(k);
    let c = scape_bladeCross(transpose(ax) * (o - base.xyz), transpose(ax) * d, base.w, SCAPE_BLADE[4u * k + 1u].w, SCAPE_BLADE[4u * k + 2u].w, SCAPE_BLADE[4u * k + 3u].x, 4.0, false);
    if (c.x > 0.0) { T *= vec3f(0.05, 0.11, 0.03); }
  }
  return T;
}

// The wood's contact with the gravel: darker where the bed runs in under it.
fn scape_woodContact(x: vec3f) -> f32 {
  let q = transpose(scapeRot) * x;
  if (any(q < SCAPE_LO - vec3f(0.08)) || any(q > SCAPE_HI + vec3f(0.08))) { return 1.0; }
  var gap = 1.0;
  for (var k = 0u; k < SCAPE_WOOD; k++) {
    let A = SCAPE_CAP[3u * k];
    let B = SCAPE_CAP[3u * k + 1u];
    let ba = B.xyz - A.xyz;
    let h = clamp(dot(q - A.xyz, ba) / dot(ba, ba), 0.0, 1.0);
    gap = min(gap, length(q - A.xyz - ba * h) - mix(A.w, B.w, h));
  }
  return mix(0.4, 1.0, smoothstep(0.0, 0.07, gap));
}

// ---- the floating leaf --------------------------------------------------------------------
// Its frame (translating): x along it from its base, y off its top face, z across; and its base.
fn scape_leafFrame() -> mat3x3f {
  let slope = scapeLife[1].yz;
  let n = normalize(vec3f(-slope.x, 1.0, -slope.y));
  let h = vec3f(cos(scapeLife[0].w), 0.0, sin(scapeLife[0].w));
  let along = normalize(h - n * dot(h, n));
  return mat3x3f(along, n, normalize(cross(along, n)));
}

fn scape_leafBase(ax: mat3x3f) -> vec3f {
  return scapeLife[0].xyz - ax[0] * (0.5 * SCAPE_LEAF_L);
}

fn scape_leaf(p: vec3f, dir: vec3f, tEnd: f32) -> ScapeHit {
  var hit = ScapeHit(1e9, 0u, 0u, vec2f(0.0), vec3f(0.0, 1.0, 0.0));
  if (scapeLife[1].x < 0.5) { return hit; }
  let ax = scape_leafFrame();
  let base = scape_leafBase(ax);
  let c0 = scapeLife[0].xyz;
  // (Its bounding sphere first.)
  let oc = c0 - p;
  let tc = dot(oc, dir);
  let rr = 0.5 * SCAPE_LEAF_L + 0.02;
  if (dot(oc, oc) - tc * tc > rr * rr || tc + rr < 0.0 || tc - rr > tEnd) { return hit; }
  let ol = transpose(ax) * (p - base);
  let dl = transpose(ax) * dir;
  let c = scape_bladeCross(ol, dl, SCAPE_LEAF_L, SCAPE_LEAF_W, SCAPE_LEAF_ARCH, SCAPE_LEAF_CUP, tEnd, true);
  if (c.x > 0.0) {
    let gu = 2.0 * SCAPE_LEAF_ARCH * (c.y - 0.5 * SCAPE_LEAF_L) / (SCAPE_LEAF_L * SCAPE_LEAF_L);
    let gv = 2.0 * SCAPE_LEAF_CUP * c.z / (SCAPE_LEAF_W * SCAPE_LEAF_W);
    hit = ScapeHit(c.x, 6u, 0u, vec2f(c.y / SCAPE_LEAF_L, c.z / SCAPE_LEAF_W), ax * normalize(vec3f(-gu, 1.0, -gv)));
  }
  // Its stalk, a stub at its base.
  let tb = scape_capsule(p, dir, base - ax[0] * 0.045 + ax[1] * 0.004, base + ax[1] * 0.002, 0.0045);
  if (tb > 0.0 && tb < min(hit.t, tEnd)) {
    hit = ScapeHit(tb, 6u, 1u, vec2f(-0.05, 0.0), scape_capNormal(p + dir * tb, base - ax[0] * 0.045 + ax[1] * 0.004, base + ax[1] * 0.002));
  }
  return hit;
}

// The leaf's shadow on what lies under it (x, towards the sun L): how much light gets by.
fn scape_leafShadow(x: vec3f, L: vec3f) -> vec3f {
  if (scapeLife[1].x < 0.5) { return vec3f(1.0); }
  let ax = scape_leafFrame();
  let dn = dot(L, ax[1]);
  if (dn < 0.05) { return vec3f(1.0); }
  let t = dot(scapeLife[0].xyz - x, ax[1]) / dn;
  if (t <= 0.0) { return vec3f(1.0); }
  let q = transpose(ax) * (x + L * t - scape_leafBase(ax));
  let s = q.x / SCAPE_LEAF_L;
  let w = SCAPE_LEAF_W * scape_outline(clamp(s, 0.0, 1.0), true);
  // (Softer the further it falls: the sun's disc, and the film's ripples.)
  let soft = 0.006 + 0.05 * t;
  let inside = smoothstep(-soft, soft, w - abs(q.z)) * smoothstep(-soft, soft, min(q.x, SCAPE_LEAF_L - q.x));
  return mix(vec3f(1.0), vec3f(0.10, 0.045, 0.02), inside);
}

// ---- the nest -----------------------------------------------------------------------------
// Its bubbles along a stretch of ray in the air (p, dir, t in [0, tEnd)): their films reflect a
// little of the sky to it, each crossing (rgb), and let the rest through (a, the share).
fn scape_nestAlong(p: vec3f, dir: vec3f, tEnd: f32, bgTex: texture_2d<f32>, bgSamp: sampler) -> vec4f {
  let count = min(u32(scapeLife[3].x + 0.5), SCAPE_NEST_N);
  if (count == 0u) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  let heart = scapeLife[2].xyz;
  let a = scapeLife[2].w;
  let out = vec3f(cos(a), 0.0, sin(a));
  let along = vec3f(-out.z, 0.0, out.x);
  let lo = heart - vec3f(0.24, 0.02, 0.24);
  let hi = heart + vec3f(0.24, 0.05, 0.24);
  if (!scape_box(p, dir, lo, hi, tEnd)) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  var col = vec3f(0.0);
  var thr = vec3f(1.0);
  for (var k = 0u; k < count; k++) {
    let b = SCAPE_NEST[k];
    // (Its heart sits a little in the film: a floating bubble is a little less than half a sphere.)
    let c = heart + along * b.x - out * b.y + vec3f(0.0, b.z - 0.3 * b.w, 0.0);
    let oc = p - c;
    let bq = dot(oc, dir);
    let cq = dot(oc, oc) - b.w * b.w;
    let h = bq * bq - cq;
    if (h <= 0.0) { continue; }
    let sq = sqrt(h);
    for (var e = 0; e < 2; e++) {
      let t = select(-bq + sq, -bq - sq, e == 0);
      if (t <= 0.0 || t >= tEnd) { continue; }
      let x = p + dir * t;
      // (Only its dome above the film.)
      if (x.y < heart.y - 0.001) { continue; }
      let n = normalize(x - c);
      let ci = abs(dot(dir, n));
      let F = globes_fresnel(ci, 1.0, GLOBES_IOR_WATER);
      // Two faces of a thin film, its thickness different bubble to bubble: faint colours.
      let R = 2.0 * F / (1.0 + F);
      let phase = fract(b.x * 37.1 + b.y * 91.7) * 2.0 + 1.6 * sqrt(max(1.0 - ci * ci * 0.56, 0.0));
      let tint = 0.62 + 0.38 * cos(6.2831853 * (phase + vec3f(0.0, 0.33, 0.67)));
      let Rc = R * tint;
      // (A nest's films are thickened with the fish's mucus: each scatters a little of the light
      // falling on it, the sun's and the sky's, so the raft reads white.)
      let sunGlint = GLOBES_SUN_IRR * (0.5 * pow(max(dot(reflect(dir, n), GLOBES_SUN_DIR), 0.0), 300.0) + 0.012);
      col += thr * (Rc * (globes_bg(bgTex, bgSamp, x, reflect(dir, n)) + sunGlint) + vec3f(0.085, 0.09, 0.095));
      thr *= (1.0 - Rc) * 0.88;
    }
  }
  return vec4f(col, (thr.x + thr.y + thr.z) / 3.0);
}

// ---- gravel -------------------------------------------------------------------------------
// Three randoms in [0, 1) for a cell of a layer (a cheap integer hash: the gravel looks up 18 of
// them a pixel).
fn scape_rand3(c: vec2i, layer: u32) -> vec3f {
  var v = vec3u(bitcast<u32>(c.x), bitcast<u32>(c.y), layer) * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> vec3u(16u);
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return vec3f(v) * (1.0 / 4294967296.0);
}

struct GravelCell {
  // From the pebble's middle across the bed (in cells), its height there (1 at its top, 0 at its
  // edge), which.
  off: vec2f,
  height: f32,
  id: f32,
}

// The pebble a point of the bed lies in (cells across the bed, in plan: a pebble's size across):
// where in it, how high its rounded top stands there, which.
fn scape_cell(x: vec2f, layer: u32) -> GravelCell {
  let base = floor(x);
  let i = vec2i(base);
  let fr = x - base;
  var d1 = 9.0;
  var d2 = 9.0;
  var off = vec2f(0.0);
  var id = 0.0;
  for (var y = -1; y <= 1; y++) {
    for (var xx = -1; xx <= 1; xx++) {
      let c = vec2i(xx, y);
      let h = scape_rand3(i + c, layer);
      let v = fr - (vec2f(c) + 0.15 + 0.7 * h.xy);
      let d = dot(v, v);
      if (d < d1) {
        d2 = d1;
        d1 = d;
        off = v;
        id = h.z;
      } else if (d < d2) {
        d2 = d;
      }
    }
  }
  // (Its edge is halfway to the next one's middle: a round top over that.)
  let a = sqrt(d1);
  let r = a / max(0.5 * (a + sqrt(d2)), 1e-4);
  return GravelCell(off, sqrt(max(1.0 - r * r, 0.0)), id);
}

// Mixed gravel (q: across the bed, world units): pebbles of one size, smaller ones between them
// (where a big one is low).
fn scape_gravel(q: vec2f) -> GravelCell {
  let big = scape_cell(q / SCAPE_PEBBLE, 1u);
  let small = scape_cell(q / (0.55 * SCAPE_PEBBLE), 2u);
  if (small.height * 0.62 > big.height) { return GravelCell(small.off, small.height * 0.62, fract(small.id + 0.41)); }
  return big;
}

// A pebble's colour: river gravel, mostly greys and browns, some near black, a few rust-red and a
// few white quartz; each its own shade, a little darker towards its edge, and some veined or
// speckled across (off: where on it, from its middle). (No noise lookups: the bed is most of the
// picture, and a 3D noise per pixel here cost more than the whole bowl's glass.)
fn scape_pebble(id: f32, off: vec2f) -> vec3f {
  let j = fract(id * 7.13);
  var c = mix(vec3f(0.30, 0.29, 0.27), vec3f(0.44, 0.42, 0.38), j);
  if (id > 0.34) { c = mix(vec3f(0.33, 0.25, 0.17), vec3f(0.46, 0.36, 0.25), j); }
  if (id > 0.58) { c = mix(vec3f(0.07, 0.07, 0.075), vec3f(0.14, 0.13, 0.13), j); }
  if (id > 0.76) { c = mix(vec3f(0.36, 0.18, 0.11), vec3f(0.48, 0.27, 0.17), j); }
  if (id > 0.9) { c = mix(vec3f(0.62, 0.61, 0.57), vec3f(0.80, 0.78, 0.73), j); }
  c *= 0.82 + 0.3 * fract(id * 53.71);
  // A vein or a band of a paler stone across some of them.
  let k = fract(id * 31.3);
  let band = 1.0 - smoothstep(0.03, 0.08, abs(dot(off, vec2f(cos(k * 6.28), sin(k * 6.28))) - 0.12 * (fract(id * 11.7) - 0.5)));
  c = mix(c, c * 1.35 + vec3f(0.05), band * step(0.62, fract(id * 17.9)) * 0.6);
  return c;
}

// Light leaving the gravel at p (cf. globes_sandShade): the pebbles' colours, their rounded tops
// tilting the light, dark crevices between them, a wet sheen; the caustic map's sunlight, in the
// shade of the plant, the leaf on the water and the fish (shadow); foot: a pixel's size there.
fn scape_gravelShade(p: vec3f, inWater: bool, rot: mat3x3f, sandTex: texture_2d<f32>, sandSamp: sampler, causticTex: texture_2d<f32>, causticSamp: sampler, shadow: vec3f, foot: f32, dir: vec3f) -> vec3f {
  let rotT = transpose(rot);
  let n = globes_sandNormal(sandTex, sandSamp, p);
  // (Where the bed's flow has carried this pebble from: FluidSim.gravel.)
  let carried = textureSampleLevel(sandTex, sandSamp, globes_sandUV(p), 0.0).ba;
  let pb = rotT * p - vec3f(carried.x, 0.0, carried.y);
  let cell = scape_gravel(pb.xz);
  // (Smaller than a few pixels, the pebbles blur into their mean.)
  let detail = smoothstep(1.2, 3.5, SCAPE_PEBBLE / max(foot, 1e-6));
  let nb = rotT * n;
  // A round top: tilted out from its middle, steeply only at its very edge, and each pebble
  // lying at a slant of its own.
  let off3 = vec3f(cell.off.x, 0.0, cell.off.y);
  let tangent = normalize(off3 - nb * dot(off3, nb) + vec3f(1e-6));
  let slope = sqrt(max(1.0 - cell.height * cell.height, 0.0)) / max(cell.height, 0.3);
  let lean = (fract(cell.id * vec3f(97.13, 13.71, 41.37)) - 0.5) * 0.9;
  let nd = rot * normalize(nb + (tangent * min(slope, 1.6) * 0.6 + (lean - nb * dot(lean, nb))) * detail);
  var albedo = mix(vec3f(0.27, 0.23, 0.19), scape_pebble(cell.id, cell.off), detail);
  let crevice = mix(0.72, mix(0.22, 1.0, smoothstep(0.0, 0.32, cell.height)), detail);
  albedo *= crevice * scape_woodContact(p);
  if (inWater) { albedo *= vec3f(0.66, 0.68, 0.70); }
  let sun = textureSampleLevel(causticTex, causticSamp, globes_sandUV(p), 0.0).rgb;
  let towards = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  let sh = shadow * scape_plantShadow(p + nd * 0.003, towards) * scape_leafShadow(p, towards);
  let tilt = clamp(max(dot(nd, towards), 0.0) / max(dot(n, towards), 0.12), 0.0, 2.2);
  let fill = select(GLOBES_SAND_AMBIENT_AIR, GLOBES_SAND_AMBIENT_WATER, inWater);
  let hv = normalize(towards - dir);
  let sheen = sun * sh * 0.12 * pow(max(dot(nd, hv), 0.0), 50.0) * detail * cell.height;
  return albedo * (sun * sh * tilt + fill) / 3.14159265 + sheen;
}

// The gravel pressed against the glass, seen from outside (cf. globes_sandAtGlass): the pebbles
// that touch it, flattened against it, and the dark gaps between them.
fn scape_gravelAtGlass(p: vec3f, rot: mat3x3f, sandTex: texture_2d<f32>, sandSamp: sampler) -> vec3f {
  let carried = textureSampleLevel(sandTex, sandSamp, globes_sandUV(p), 0.0).ba;
  let pb = transpose(rot) * p - vec3f(carried.x, 0.0, carried.y);
  // (Across the glass: round it and down it.)
  let cell = scape_gravel(vec2f(atan2(pb.z, pb.x) * length(pb.xz), pb.y));
  var albedo = scape_pebble(cell.id, cell.off) * vec3f(0.72, 0.72, 0.74);
  // (Where a pebble presses on the glass, it shows; between them, the dark gaps.)
  albedo *= mix(0.1, 1.0, smoothstep(0.25, 0.65, cell.height));
  let n = normalize(p);
  let up = select(vec3f(0.0, 1.0, 0.0), vec3f(1.0, 0.0, 0.0), abs(n.y) > 0.9);
  let t1 = normalize(cross(n, up));
  let t2 = cross(n, t1);
  let room = 0.4 * globes_sky(n) + 0.15 * (globes_sky(n + t1) + globes_sky(n - t1) + globes_sky(n + t2) + globes_sky(n - t2));
  let light = 3.14159265 * room + GLOBES_SUN_IRR * max(dot(n, GLOBES_SUN_DIR), 0.0) * 0.85 + vec3f(0.95, 0.90, 0.84);
  return albedo * light / 3.14159265;
}

// ---- tracing and shading ------------------------------------------------------------------
// The nearest of the plant and the floating leaf along a ray (translating frame) before tEnd.
fn scape_trace(p: vec3f, dir: vec3f, tEnd: f32) -> ScapeHit {
  let a = scape_plant(p, dir, tEnd);
  let b = scape_leaf(p, dir, min(a.t, tEnd));
  if (b.kind != 0u && b.t < a.t) { return b; }
  return a;
}

// The light a hit sends back along dir (x: the point; inWater: the medium the ray is in).
fn scape_shade(h: ScapeHit, x: vec3f, dir: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler, time: f32, bgTex: texture_2d<f32>, bgSamp: sampler, foot: f32) -> vec3f {
  var n = h.n;
  let back = dot(n, dir) > 0.0;
  if (back) { n = -n; }
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = GLOBES_SUN_IRR * 0.86;
  var dapple = 1.0;
  if (inWater) {
    dapple = betta_dapple(x, lit, lightTex, lightSamp, time);
    E = globes_sunIn(lightTex, lightSamp, x + n * 0.01, lit) * dapple;
  }
  let ambient = select(vec3f(0.36, 0.37, 0.40), mix(vec3f(0.10, 0.13, 0.15), vec3f(0.30, 0.38, 0.44), n.y * 0.5 + 0.5), inWater);
  let ndl = dot(n, L);
  let hv = normalize(L - dir);
  let ndh = max(dot(n, hv), 0.0);
  let ndv = clamp(dot(n, -dir), 0.0, 1.0);
  let fres = pow(1.0 - ndv, 5.0);
  let pb = transpose(scapeRot) * x;
  if (h.kind == 6u) {
    // The almond leaf, dried: tan to reddish brown, darker at its edge, its midrib and veins paler;
    // underneath paler still. Lit from behind it glows a deep amber through.
    let s = h.uv.x;
    let v = h.uv.y;
    let q = vec3f(s * 9.0, v * 3.0, 0.0);
    var c = mix(vec3f(0.12, 0.05, 0.02), vec3f(0.2, 0.09, 0.035), globes_noise3(q * 1.3 + vec3f(3.1)));
    c = mix(c, vec3f(0.27, 0.15, 0.065), 0.45 * smoothstep(0.55, 0.85, globes_noise3(q * 0.7 + vec3f(8.0))));
    c *= 0.85 + 0.25 * globes_noise3(vec3f(s * 60.0, v * 22.0, 1.7));
    c *= mix(1.0, 0.62, smoothstep(0.7, 1.0, abs(v) / max(scape_outline(clamp(s, 0.0, 1.0), true), 0.05)));
    let midrib = 1.0 - smoothstep(0.012, 0.035, abs(v));
    let lateral = smoothstep(0.9, 0.99, abs(fract(s * 9.0 - abs(v) * 2.2 + 0.15 * globes_noise3(vec3f(s * 20.0, v * 8.0, 0.0))) * 2.0 - 1.0)) * smoothstep(0.03, 0.12, abs(v)) * (1.0 - smoothstep(0.7, 0.92, abs(v)));
    let vein = max(midrib, 0.35 * lateral) * smoothstep(0.0, 2.0, 0.004 / max(foot, 1e-6));
    c = mix(c, vec3f(0.3, 0.17, 0.075), vein);
    if (h.id == 1u) { c = vec3f(0.20, 0.10, 0.04); }
    if (back) { c = mix(c, vec3f(0.42, 0.27, 0.13), 0.45); }
    let through = c * vec3f(0.9, 0.55, 0.25) * max(-ndl, 0.0) * 0.4;
    let wet = select(0.02, 0.06, inWater || back);
    return (c * (E * max(ndl, 0.0) + ambient) + E * through) / 3.14159265 + E * wet * pow(ndh, 30.0) + fres * 0.04 * ambient;
  }
  if (h.kind == 5u) {
    // An anubias leaf: thick, dark, glossy green; its midrib and the fine veins off it paler,
    // the underside paler than the top; a waxy cuticle's tight highlight.
    let s = h.uv.x;
    let v = h.uv.y;
    let id = f32(h.id);
    var c = mix(vec3f(0.018, 0.052, 0.014), vec3f(0.03, 0.075, 0.02), fract(id * 0.618));
    if (back) { c = vec3f(0.06, 0.12, 0.045); }
    let midrib = 1.0 - smoothstep(0.02, 0.06, abs(v));
    let lateral = smoothstep(0.9, 0.99, abs(fract(s * 13.0 - abs(v) * 3.5) * 2.0 - 1.0)) * smoothstep(0.06, 0.2, abs(v)) * (1.0 - smoothstep(0.8, 0.97, abs(v)));
    let vein = max(midrib, 0.4 * lateral) * smoothstep(0.0, 2.0, 0.003 / max(foot, 1e-6));
    c = mix(c, vec3f(0.07, 0.13, 0.04), vein);
    c *= 0.9 + 0.2 * globes_noise3(vec3f(s * 14.0, v * 5.0, id * 7.0));
    let diffuse = max(ndl, 0.0);
    let through = c * 0.25 * max(-ndl, 0.0);
    let gloss = 0.5 * pow(ndh, 90.0) + 0.04 * pow(ndh, 14.0);
    return (c * (E * diffuse + ambient) + E * through) / 3.14159265 + E * gloss * select(1.0, 0.3, back) + fres * 0.06 * ambient;
  }
  // Wood, the rhizome, a stalk or a root. Driftwood: dark brown, grooved along its grain, paler
  // where it is worn, faintly green with the film living waters leave on wood.
  let k = h.id;
  let A = SCAPE_CAP[3u * k];
  let B = SCAPE_CAP[3u * k + 1u];
  let C = SCAPE_CAP[3u * k + 2u];
  let ax = normalize(B.xyz - A.xyz);
  let along = dot(pb - A.xyz, ax);
  let around = pb - A.xyz - ax * along;
  var c = vec3f(0.11, 0.065, 0.035);
  var nn = n;
  if (h.kind == 1u) {
    // Driftwood: weathered brown, its bark split by fissures running along it, a few knots; paler
    // where the grain stands proud. Coordinates along the branch and round it (from a reference
    // square to the axis and level), so the pattern runs on across the pieces' joints.
    let hh = clamp(dot(pb - A.xyz, B.xyz - A.xyz) / dot(B.xyz - A.xyz, B.xyz - A.xyz), 0.0, 1.0);
    let s = mix(C.x, C.y, hh);
    let ref0 = cross(ax, vec3f(0.0, 1.0, 0.0));
    let ref1 = normalize(select(ref0, vec3f(1.0, 0.0, 0.0), dot(ref0, ref0) < 1e-4));
    let ang = atan2(dot(around, cross(ax, ref1)), dot(around, ref1));
    let wq = vec3f(s * 6.0, cos(ang) * 1.6, sin(ang) * 1.6) + vec3f(C.z * 7.1);
    let tone = globes_noise3(wq * vec3f(0.6, 1.0, 1.0));
    let ridge = globes_noise3(wq * vec3f(1.3, 4.0, 4.0));
    let fissure = 1.0 - smoothstep(0.02, 0.09, abs(ridge - 0.5));
    let knot = smoothstep(0.78, 0.86, globes_noise3(wq * vec3f(2.2, 2.0, 2.0) + vec3f(19.0)));
    c = mix(vec3f(0.2, 0.105, 0.05), vec3f(0.34, 0.22, 0.12), smoothstep(0.25, 0.8, tone));
    c = mix(c, vec3f(0.05, 0.028, 0.016), 0.85 * fissure);
    c = mix(c, vec3f(0.09, 0.05, 0.028), 0.7 * knot);
    // (A faint green film where it faces up.)
    c = mix(c, c * vec3f(0.88, 1.0, 0.78), 0.25 * max(n.y, 0.0));
    // Its fissures are grooves: the normal dips into them.
    let e = 0.03;
    let ridgeAround = globes_noise3((vec3f(s * 6.0, cos(ang + e) * 1.6, sin(ang + e) * 1.6) + vec3f(C.z * 7.1)) * vec3f(1.3, 4.0, 4.0));
    let slope = (abs(ridgeAround - 0.5) - abs(ridge - 0.5)) / e;
    nn = normalize(n + scapeRot * normalize(cross(ax, around)) * clamp(slope, -6.0, 6.0) * 0.06);
  } else if (h.kind == 2u) {
    // (Leaf scars ring it, unevenly spaced and faint.)
    let scar = smoothstep(0.86, 0.97, abs(fract(dot(pb, ax) * 38.0 + 0.6 * globes_noise3(pb * 25.0)) * 2.0 - 1.0));
    c = mix(vec3f(0.06, 0.08, 0.03), vec3f(0.12, 0.11, 0.05), globes_noise3(pb * 90.0)) * (1.0 - 0.25 * scar);
  } else if (h.kind == 3u) {
    c = vec3f(0.06, 0.13, 0.04);
  } else {
    c = vec3f(0.05, 0.035, 0.022);
  }
  let d2 = max(dot(nn, L), 0.0);
  let spec = select(0.02, 0.12, h.kind == 3u) * pow(max(dot(nn, hv), 0.0), 30.0);
  return c * (E * d2 + ambient) / 3.14159265 + E * spec + fres * 0.03 * ambient;
}
`;
}
