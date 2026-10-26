// What a tap in Learn mode is on (Learn.ts), as the viewer sees it through the betta bowl's glass
// and water. The tap's line of sight (the camera's ray through it, in the globe's translating frame:
// world axes, the bowl's centre at the origin: the sim frame) is bent where the bowl's shader bends
// it (shaders.ts: glass 1.5, water 1.333): into the glass, out of it into the water or into the air
// over the water, and down through the water's surface (level, as at rest). The first thing it then
// meets is what was tapped: a furnishing (the BVH the shader traces, scapeBVH.mjs traceCPU, as built:
// the plants sway a little on the GPU, but their rest pose is near enough), the fish (within a
// generous reach of its probes), the floating leaf or the bubble nest (boxes round them), the sand
// (the bed's top at rest). The lid is met first, on the line itself, as main.ts's clickLid has it.
// Past all of them a tap is on the water, or (through the glass alone, or the air over the water) on
// the bowl.

import { surfaceCPU, traceCPU } from '../../render/scape/scapeBVH.mjs';

/** The glass's and the water's refractive indices (shaders.ts GLOBES_IOR_GLASS, GLOBES_IOR_WATER). */
export const IOR_GLASS = 1.5;
export const IOR_WATER = 1.333;

/** The furnishings' materials (scape/mesh.mjs MAT) and what each is: the driftwood's bark and broken
 *  ends, the rocks, each plant's leaves; the heater's body, its lamp and its suction cups, the
 *  sponge filter and its tubes (8 to 12: the equipment's). A stem or a root (6, 7) is its plant's, by
 *  the mesh it is part of (MESH_TOPICS). */
export const MATERIAL_TOPICS = { 1: 'driftwood', 2: 'driftwood', 3: 'rock', 4: 'anubias', 5: 'rosette', 8: 'heater', 9: 'heater', 10: 'filter', 11: 'filter', 12: 'heater' };
/** The furnishings' meshes by name (scape/wood.mjs, rocks.mjs, plants.mjs) and what each is. */
export const MESH_TOPICS = { driftwood: 'driftwood', rocks: 'rock', plantTall: 'anubias', plantSmall: 'rosette' };
/** Every topic a tap can come to (content.ts has a card for each). */
export const TOPIC_IDS = ['fish', 'driftwood', 'rock', 'anubias', 'rosette', 'sand', 'leaf', 'nest', 'lid', 'water', 'glass', 'heater', 'filter'];

/** How near the line of sight passes one of the fish's probes (its body's points, head to tail) to
 *  be on it: generous, as its fins spread well beyond them. */
export const FISH_REACH = 0.06;
/** Round the floating leaf (half its length and width, as BowlLife keeps it off the glass) and the
 *  nest (half its span along the glass, its depth out from it: scape/nest.mjs), a margin, and how far
 *  below and above the film. */
const FLOAT_MARGIN = 0.02;
const FLOAT_BELOW = 0.025;
const FLOAT_ABOVE = 0.04;
const NEST_ALONG = 0.22;
const NEST_OUT = 0.16;
/** Met at a grazing angle (the cosine of its angle of incidence under this: beyond ~75 degrees),
 *  the water's surface is all but a mirror: what is seen there is the surface itself. */
const FILM_MIRROR = 0.25;

/** What a furnishing is: its material, and the mesh it is part of (null: neither is known). */
export function topicOf(material, mesh) {
  return MATERIAL_TOPICS[material] ?? MESH_TOPICS[mesh] ?? null;
}

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const along = (o, d, t) => [o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t];
const unit = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / l, a[1] / l, a[2] / l];
};
/** v (sim frame) into the bowl's frame: by the transpose of `rotation` (column-major, bowl to sim). */
const toBowl = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];

/** Snell's law: the unit direction d bent through a surface whose unit normal n faces it (n . d < 0),
 *  eta the index it leaves over the one it enters; null past the critical angle (it is reflected). */
export function refract(d, n, eta) {
  const c = -dot(n, d);
  const k = 1 - eta * eta * (1 - c * c);
  if (k < 0) return null;
  const s = eta * c - Math.sqrt(k);
  return unit([d[0] * eta + n[0] * s, d[1] * eta + n[1] * s, d[2] * eta + n[2] * s]);
}

/** Where the ray o + d t (d unit) first meets the sphere of radius r round the origin, coming from
 *  outside it: t > 0, or null. */
export function enterSphere(o, d, r) {
  const b = dot(o, d);
  const disc = b * b - (dot(o, o) - r * r);
  if (disc <= 0) return null;
  const t = -b - Math.sqrt(disc);
  return t > 0 ? t : null;
}

/** Where the ray, from inside the sphere of radius r round the origin, leaves it (t). */
export function leaveSphere(o, d, r) {
  const b = dot(o, d);
  return -b + Math.sqrt(Math.max(b * b - (dot(o, o) - r * r), 0));
}

/** Where the ray o + d t enters the box lo..hi of the frame (axes, three unit vectors; origin c)
 *  within t in [0, tEnd): t, or null. */
function boxAlong(o, d, tEnd, c, axes, lo, hi) {
  let t0 = 0;
  let t1 = tEnd;
  const oc = [o[0] - c[0], o[1] - c[1], o[2] - c[2]];
  for (let k = 0; k < 3; k++) {
    const p = dot(oc, axes[k]);
    const v = dot(d, axes[k]);
    if (Math.abs(v) < 1e-12) {
      if (p < lo[k] || p > hi[k]) return null;
      continue;
    }
    const a = (lo[k] - p) / v;
    const b = (hi[k] - p) / v;
    t0 = Math.max(t0, Math.min(a, b));
    t1 = Math.min(t1, Math.max(a, b));
    if (t0 > t1) return null;
  }
  return t0;
}

/** The floating leaf and the nest along o + d t, t in [0, tEnd): the nearer one met, or null. */
function floating(o, d, tEnd, bowl) {
  let best = null;
  const up = [0, 1, 0];
  const leaf = bowl.leaf;
  if (leaf) {
    const ax = [Math.cos(leaf.yaw), 0, Math.sin(leaf.yaw)];
    const across = [-ax[2], 0, ax[0]];
    const l = 0.5 * leaf.length + FLOAT_MARGIN;
    const w = leaf.width + FLOAT_MARGIN;
    const t = boxAlong(o, d, tEnd, leaf.at, [ax, up, across], [-l, -FLOAT_BELOW, -w], [l, FLOAT_ABOVE, w]);
    if (t !== null) best = { topic: 'leaf', t };
  }
  const nest = bowl.nest;
  if (nest) {
    // (Its heart on the glass; its bubbles along the glass, and in from it.)
    const out = [Math.cos(nest.bearing), 0, Math.sin(nest.bearing)];
    const side = [-out[2], 0, out[0]];
    const a = NEST_ALONG + FLOAT_MARGIN;
    const t = boxAlong(o, d, tEnd, nest.at, [side, up, out], [-a, -FLOAT_BELOW, -NEST_OUT], [a, FLOAT_ABOVE, FLOAT_MARGIN]);
    if (t !== null && (!best || t < best.t)) best = { topic: 'nest', t };
  }
  return best;
}

/** The furnishing the BVH meets first along o + d t (sim frame), t in (0, tEnd): { topic, t }, or
 *  null. (Traced in the bowl's frame, where it was built.) */
function furnishing(o, d, tEnd, bowl) {
  const scape = bowl.scape;
  if (!scape) return null;
  const m = bowl.rotation;
  const packed = { data: scape.data };
  const hit = traceCPU(packed, toBowl(m, o), toBowl(m, d), tEnd);
  if (hit.tri === 0xffffffff) return null;
  const s = surfaceCPU(packed, hit);
  // (The mesh it is part of, by its first corner: the meshes' vertices were packed in their order.)
  let first = s.vertices[0];
  let mesh = null;
  for (const [name, vertices] of scape.parts) {
    if (first < vertices) {
      mesh = name;
      break;
    }
    first -= vertices;
  }
  return { topic: topicOf(s.material, mesh), t: hit.t };
}

/** The fish along o + d t, t in [0, tEnd): where the line passes nearest a probe within FISH_REACH,
 *  or null. */
function fish(o, d, tEnd, bowl) {
  const p = bowl.fish;
  if (!p) return null;
  let best = null;
  for (let i = 0; i + 2 < p.length; i += 4) {
    const q = [p[i] - o[0], p[i + 1] - o[1], p[i + 2] - o[2]];
    const t = dot(q, d);
    if (t < 0 || t > tEnd) continue;
    const miss = dot(q, q) - t * t;
    if (miss < FISH_REACH * FISH_REACH && (!best || t < best.t)) best = { topic: 'fish', t };
  }
  return best;
}

/** The sand's top (the bowl's frame: bowl.bed, at rest) along o + d t, t in [0, tEnd): t, or null.
 *  (A ray in through the glass below it is in the sand at once.) */
function sand(o, d, tEnd, bowl) {
  const oy = toBowl(bowl.rotation, o)[1];
  const dy = toBowl(bowl.rotation, d)[1];
  if (oy <= bowl.bed) return 0;
  if (dy >= 0) return null;
  const t = (bowl.bed - oy) / dy;
  return t >= 0 && t < tEnd ? t : null;
}

/** The first of them along a stretch, t in [0, tEnd). (In the air as in the water: a leaf's tip or
 *  the filter's tube may stand out of it.) */
function nearest(o, d, tEnd, bowl) {
  const t = sand(o, d, tEnd, bowl);
  let best = t === null ? null : { topic: 'sand', t };
  for (const h of [floating(o, d, tEnd, bowl), furnishing(o, d, tEnd, bowl), fish(o, d, tEnd, bowl)]) if (h && (!best || h.t < best.t)) best = h;
  return best;
}

/**
 * What a tap is on: the camera's ray through it, o + d t (the sim frame: world axes, the bowl's
 * centre at the origin; d of unit length), through the bowl, which is:
 *   outer, inner: the glass's radii; mouth: the height (its own frame) above which it is open;
 *   rotation: its turn (column-major 3x3, its frame to the sim frame: GlobeController.rotation);
 *   level: the water's resting height (sim frame); bed: the sand's top (its own frame);
 *   scape: the furnishings' BVH (furnishings.ts: its texels, data, and its meshes' names and vertex
 *     counts, parts), or null; fish: the fish's probes (sim frame, four floats each), or null;
 *   leaf: the floating leaf ({ at, yaw, length, width }: sim frame), or null; nest: the bubble nest
 *     ({ at: its heart, bearing: of the glass there }), or null; lid: (o, d) => whether the lid is on
 *     the line, or null.
 * Returns { topic, at } (a TOPIC_IDS entry, or null for a furnishing it does not know; where
 * along the line of sight, sim frame), or null where the tap is not on the bowl.
 */
export function pickBowl(o, d, bowl) {
  if (bowl.lid?.(o, d)) return { topic: 'lid', at: [...o] };
  const t0 = enterSphere(o, d, bowl.outer);
  if (t0 === null) return null;
  let p = along(o, d, t0);
  let dir = d;
  let wet = false;
  if (toBowl(bowl.rotation, p)[1] <= bowl.mouth) {
    // Into the glass, then out of it: into the water, or the air over it.
    const g = refract(d, unit(p), 1 / IOR_GLASS);
    const t1 = g ? enterSphere(p, g, bowl.inner) : null;
    if (t1 === null) return { topic: 'glass', at: p };
    p = along(p, g, t1);
    wet = p[1] < bowl.level;
    dir = refract(g, unit(p), IOR_GLASS / (wet ? IOR_WATER : 1));
    if (!dir) return { topic: 'glass', at: p };
  }
  // (Else in at the open mouth, the lid off: straight into the air over the water.)
  for (let leg = 0; leg < 2; leg++) {
    let tEnd = leaveSphere(p, dir, bowl.inner);
    // The water's surface: down through it from the air (bent), or up to it from under the water.
    const tw = (wet ? dir[1] > 0 : dir[1] < 0) ? (bowl.level - p[1]) / dir[1] : Infinity;
    const surface = tw < tEnd;
    if (surface) tEnd = tw;
    const hit = nearest(p, dir, tEnd, bowl);
    if (hit) return { topic: hit.topic, at: along(p, dir, hit.t) };
    const end = along(p, dir, tEnd);
    if (wet) return { topic: 'water', at: end };
    if (!surface) return toBowl(bowl.rotation, end)[1] > bowl.mouth ? null : { topic: 'glass', at: end };
    if (-dir[1] < FILM_MIRROR) return { topic: 'water', at: end };
    const into = refract(dir, [0, 1, 0], 1 / IOR_WATER);
    p = end;
    dir = into;
    wet = true;
  }
  return null;
}
