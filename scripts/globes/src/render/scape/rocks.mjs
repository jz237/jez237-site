// The rocks: four dark river stones half sunk in the sand at the front of the bowl, the biggest at
// the front left, two before the driftwood's right foot and a small one at the far right. Each is
// an evenly tessellated geodesic sphere moved out to the stone's surface: a rounded, gently lumpy
// body, its widest part a little below the sand, cut by a few planes where it once split (a main
// one slanting across its top; the cuts' edges worn round), relaxed so its triangles stay even,
// then roughened along its normals: water-worn dishes, scallops and creases (the split faces
// flatter, with low ripples), bedding lines, pits, a fine grain and a crack or two. The material
// (WGSL) finds each crack's centre line again from the same plane and wobble, so it draws it sharp
// inside the mesh's shallow groove.

import { BED_LEVEL, MAT, MeshBuilder, fbm3, noise3, stream } from './mesh.mjs';

/** @typedef {import('./mesh.mjs').V3} V3 */
/** @typedef {import('./mesh.mjs').Obstacle} Obstacle */

/**
 * One stone. at: where it sits on the bed (x, z); size: along its long axis, its height above the
 * sand, across; sink: the share of its whole height below the sand; yaw (about y) and lean (about
 * x, then z); freq: its geodesic sphere's at full detail (20 f^2 triangles). Its body: exp, the
 * superquadric's exponents (round its sides, and up and down); taper: how much narrower it is at
 * the top; ends: each semi-axis' factor on its - and + side (the lower one short, so the body's
 * heart lies below the sand and its sides lean in above it); lumps: how lumpy. planes: where it
 * split (a normal, where the cut lies as a share of the body's reach that way, and how worn its
 * edge is, a share of the stone's size); facets: how many smaller, more worn ones it has besides.
 * dents: broad shallow hollows (a direction, an angular radius, a depth as a share of its reach).
 * cracks: a direction from its heart, the way the crack runs there (radians), its length (a share
 * of the stone's size) and depth (1 a full crack); or a branch off an earlier crack (where along
 * it, as a share of its length, and how far it turns off it). pits and bedding: how pitted and how
 * layered it is (0..1), and the layers' normal.
 */
const ROCKS = [
  {
    at: [-0.4, 0.32], size: [0.24, 0.15, 0.19], sink: 0.35, yaw: 0.3, lean: [0.04, -0.06], freq: 52, seed: 11,
    exp: [2.1, 2.3], taper: 0.04, ends: [[1.12, 0.88], [0.55, 1.45], [1.05, 0.95]], lumps: 0.06,
    planes: [[0.25, 1.0, 0.45, 0.66, 0.06], [0.95, 0.2, -0.1, 0.72, 0.06], [-0.3, 0.5, -0.8, 0.78, 0.07]], facets: 2,
    dents: [[-0.6, 0.35, 0.7, 0.35, 0.04], [0.1, 0.9, -0.4, 0.3, 0.025]],
    cracks: [[0.25, 0.8, 0.5, 0.3, 0.28, 0.6], { from: 0, at: -0.25, turn: 2.4, length: 0.2, depth: 0.6 }],
    pits: 0.22, bedding: 0.7, layers: [0.3, 0.9, -0.2],
  },
  {
    at: [0.17, 0.24], size: [0.17, 0.085, 0.14], sink: 0.3, yaw: -0.5, lean: [-0.05, 0.05], freq: 36, seed: 23,
    exp: [2.2, 2.4], taper: 0.05, ends: [[1.1, 0.9], [0.42, 1.58], [0.92, 1.08]], lumps: 0.05,
    planes: [[-0.35, 1.0, 0.3, 0.62, 0.06], [-0.9, 0.2, 0.35, 0.78, 0.06]], facets: 2,
    dents: [[0.6, 0.5, 0.6, 0.4, 0.035]],
    cracks: [[0.1, 0.8, 0.55, 1.0, 0.55, 0.6]],
    pits: 0.5, bedding: 0.3, layers: [0.9, 0.3, 0.2],
  },
  {
    at: [0.408, 0.041], size: [0.15, 0.075, 0.12], sink: 0.36, yaw: 0.9, lean: [0.08, 0.0], freq: 32, seed: 37,
    exp: [2.2, 2.4], taper: 0.0, ends: [[1.0, 0.88], [0.4, 1.6], [0.95, 1.05]], lumps: 0.04,
    planes: [[0.35, 1.0, 0.45, 0.62, 0.06], [0.2, 0.3, 0.95, 0.75, 0.08]], facets: 2,
    dents: [[-0.5, 0.6, 0.6, 0.35, 0.04]],
    cracks: [[0.5, 0.55, 0.65, 1.3, 0.3, 0.8], { from: 0, at: 0.2, turn: 0.7, length: 0.12, depth: 0.5 }],
    pits: 0.9, bedding: 0.0, layers: [0, 1, 0],
  },
  {
    at: [0.62, 0.12], size: [0.09, 0.05, 0.08], sink: 0.36, yaw: -0.3, lean: [0.02, 0.04], freq: 20, seed: 41,
    exp: [2.0, 2.1], taper: 0.0, ends: [[1.0, 0.95], [0.46, 1.54], [1.0, 1.0]], lumps: 0.05,
    planes: [[0.3, 1.0, -0.3, 0.66, 0.07]], facets: 1,
    dents: [[0.5, 0.7, 0.4, 0.4, 0.03]],
    cracks: [[0.2, 0.7, 0.7, 2.4, 0.35, 0.5]],
    pits: 0.3, bedding: 0.6, layers: [0.2, 0.95, 0.3],
  },
];

/** The driftwood's right foot, which R3 leans against, as a capsule (its centre line from a to b
 *  and its mean radius, fitted to wood.mjs's mesh, since the pieces cannot import one another):
 *  for the shade it casts on the stones. */
const WOOD_FOOT = { a: [0.482, -0.64, -0.139], b: [0.432, -0.45, -0.14], r: 0.09 };

// ---- small helpers ----------------------------------------------------------------------------
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const normalize = (a) => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
/** How far a point lies outside a capsule (negative inside). */
function capsuleGap({ a, b, r }, x, y, z) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const t = clamp01(((x - a[0]) * ab[0] + (y - a[1]) * ab[1] + (z - a[2]) * ab[2]) / dot(ab, ab));
  return Math.hypot(x - a[0] - ab[0] * t, y - a[1] - ab[1] * t, z - a[2] - ab[2] * t) - r;
}

/** Cells (Worley): the distances to the nearest and second nearest of one random point a unit
 *  cell (cell units), and two random numbers of the nearest's cell. */
function hash(i, j, k, salt) {
  let h = Math.imul(i, 0x27d4eb2d) ^ Math.imul(j, 0x165667b1) ^ Math.imul(k, 0x9e3779b1) ^ Math.imul(salt, 0x85ebca77);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function cells(x, y, z) {
  const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
  let d1 = 9, d2 = 9, id = 0, id2 = 0;
  for (let k = -1; k <= 1; k++) {
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const cx = X + i, cy = Y + j, cz = Z + k;
        const dx = cx + hash(cx, cy, cz, 1) - x, dy = cy + hash(cx, cy, cz, 2) - y, dz = cz + hash(cx, cy, cz, 3) - z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < d1) {
          d2 = d1;
          d1 = d;
          id = hash(cx, cy, cz, 4);
          id2 = hash(cx, cy, cz, 5);
        } else if (d < d2) {
          d2 = d;
        }
      }
    }
  }
  return [Math.sqrt(d1), Math.sqrt(d2), id, id2];
}

// ---- the geodesic sphere ----------------------------------------------------------------------
/** A unit sphere of 20 f^2 triangles, each icosahedron face cut into an f-by-f triangular grid
 *  (points on the faces' shared edges made once, so the sphere is closed). */
function geodesic(f) {
  const t = (1 + Math.sqrt(5)) / 2;
  const ico = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(normalize);
  const faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  /** @type {V3[]} */
  const dirs = ico.slice();
  const lerp = (a, b, s) => normalize([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s]);
  const edges = new Map();
  const edge = (u, v, k) => {
    const key = Math.min(u, v) * 12 + Math.max(u, v);
    let run = edges.get(key);
    if (!run) {
      run = [];
      const [a, b] = u < v ? [u, v] : [v, u];
      for (let s = 1; s < f; s++) run.push(dirs.push(lerp(ico[a], ico[b], s / f)) - 1);
      edges.set(key, run);
    }
    return u < v ? run[k - 1] : run[f - k - 1];
  };
  const tris = [];
  for (let [A, B, C] of faces) {
    // (Turned so it winds counter-clockwise seen from outside.)
    const nf = cross([ico[B][0] - ico[A][0], ico[B][1] - ico[A][1], ico[B][2] - ico[A][2]], [ico[C][0] - ico[A][0], ico[C][1] - ico[A][1], ico[C][2] - ico[A][2]]);
    if (dot(nf, ico[A]) < 0) [B, C] = [C, B];
    const grid = new Map();
    const at = (i, j) => {
      if (i === 0 && j === 0) return A;
      if (i === f) return B;
      if (j === f) return C;
      if (j === 0) return edge(A, B, i);
      if (i === 0) return edge(A, C, j);
      if (i + j === f) return edge(B, C, j);
      const key = i * (f + 1) + j;
      let v = grid.get(key);
      if (v === undefined) {
        const a = ico[A], b = ico[B], c = ico[C];
        const wa = (f - i - j) / f, wb = i / f, wc = j / f;
        v = dirs.push(normalize([a[0] * wa + b[0] * wb + c[0] * wc, a[1] * wa + b[1] * wb + c[1] * wc, a[2] * wa + b[2] * wb + c[2] * wc])) - 1;
        grid.set(key, v);
      }
      return v;
    };
    for (let i = 0; i < f; i++) {
      for (let j = 0; j < f - i; j++) {
        tris.push(at(i, j), at(i + 1, j), at(i, j + 1));
        if (i + j < f - 1) tris.push(at(i + 1, j), at(i + 1, j + 1), at(i, j + 1));
      }
    }
  }
  return { dirs, tris };
}

/** Each vertex's neighbours (compressed rows). */
function neighbours(vc, tris) {
  const sets = Array.from({ length: vc }, () => new Set());
  for (let t = 0; t < tris.length; t += 3) {
    const [a, b, c] = [tris[t], tris[t + 1], tris[t + 2]];
    sets[a].add(b).add(c);
    sets[b].add(a).add(c);
    sets[c].add(a).add(b);
  }
  const start = new Uint32Array(vc + 1);
  for (let v = 0; v < vc; v++) start[v + 1] = start[v] + sets[v].size;
  const list = new Uint32Array(start[vc]);
  for (let v = 0; v < vc; v++) list.set([...sets[v]], start[v]);
  return { start, list };
}

/** Smooths a scalar a vertex over its neighbours, `passes` times. */
function smoothScalar(values, nb, passes) {
  let a = Float64Array.from(values), b = new Float64Array(values.length);
  for (let p = 0; p < passes; p++) {
    for (let v = 0; v < a.length; v++) {
      let s = 0;
      for (let k = nb.start[v]; k < nb.start[v + 1]; k++) s += a[nb.list[k]];
      b[v] = 0.5 * a[v] + 0.5 * s / (nb.start[v + 1] - nb.start[v]);
    }
    [a, b] = [b, a];
  }
  return a;
}

/** Area-weighted vertex normals of a mesh (positions three a vertex). */
function vertexNormals(pos, tris) {
  const n = new Float64Array(pos.length);
  for (let t = 0; t < tris.length; t += 3) {
    const a = tris[t] * 3, b = tris[t + 1] * 3, c = tris[t + 2] * 3;
    const fn = cross([pos[b] - pos[a], pos[b + 1] - pos[a + 1], pos[b + 2] - pos[a + 2]], [pos[c] - pos[a], pos[c + 1] - pos[a + 1], pos[c + 2] - pos[a + 2]]);
    for (const v of [a, b, c]) for (let k = 0; k < 3; k++) n[v + k] += fn[k];
  }
  for (let v = 0; v < n.length; v += 3) {
    const l = Math.hypot(n[v], n[v + 1], n[v + 2]) || 1;
    n[v] /= l;
    n[v + 1] /= l;
    n[v + 2] /= l;
  }
  return n;
}

// ---- one stone's body -------------------------------------------------------------------------
/** How far the body's surface lies from its heart along a direction (its own frame, before it is
 *  stretched to size), and how much of that a split face decides (0..1). */
function bodyRadius(rock, u) {
  const { half, exp, ends, lumps, planes, off, taper } = rock;
  const narrow = 1 - taper * u[1];
  const ax = half[0] * ends[0][u[0] < 0 ? 0 : 1] * narrow;
  const by = half[1] * ends[1][u[1] < 0 ? 0 : 1];
  const cz = half[2] * ends[2][u[2] < 0 ? 0 : 1] * narrow;
  const [q, p] = exp;
  const round = (Math.abs(u[0]) / ax) ** q + (Math.abs(u[2]) / cz) ** q;
  let r = 1 / (round ** (p / q) + (Math.abs(u[1]) / by) ** p) ** (1 / p);
  // Lumps: a swelling here, a flatter stretch there, two or three across the stone.
  r *= 1 + lumps * fbm3(u[0] * 1.2 + off[0], u[1] * 1.2 + off[1], u[2] * 1.2 + off[2], 3) + 0.15 * lumps * noise3(u[0] * 3 + off[1], u[1] * 3 + off[2], u[2] * 3 + off[0]);
  // Hollows: a broad shallow dent here and there.
  for (const dn of rock.dents) {
    const c = dot(u, dn.dir);
    if (c > 0) r *= 1 - dn.depth * Math.exp(-(1 - c) / dn.size);
  }
  // The split faces, their edges worn round (a smooth minimum).
  let face = 0;
  for (const pl of planes) {
    const dn = dot(u, pl.n);
    if (dn < 1e-3) continue;
    const rp = pl.h / dn;
    const k = pl.soft;
    const h = Math.max(k - Math.abs(r - rp), 0) / k;
    face = Math.max(face, clamp01(0.5 + 0.5 * (r - rp) / k));
    r = Math.min(r, rp) - h * h * k * 0.25;
  }
  return [r, face];
}

/** The stone's surface along a direction once stretched to size (`scale` on each axis). */
function surface(rock, u) {
  const s = rock.scale;
  const w = [u[0] / s[0], u[1] / s[1], u[2] / s[2]];
  const l = len(w);
  const [r, face] = bodyRadius(rock, [w[0] / l, w[1] / l, w[2] / l]);
  return [r / l, face];
}

/** A crack's wobble across its line, and how wide and how open it is along it: sums of sines, so
 *  the material (crackWGSL) computes exactly the same. */
const wobble = (c, p) => c.wob.reduce((s, [kx, ky, kz, phase, a]) => s + a * Math.sin(kx * p[0] + ky * p[1] + kz * p[2] + phase), 0);
const crackEnds = (c, along) => (c.branch ? smoothstep(-0.1 * c.length, 0.05 * c.length, along) * (1 - smoothstep(0.2 * c.length, c.length, along)) : 1 - smoothstep(0.15 * c.length, c.length, Math.abs(along)));
const crackOpen = (c, along) => 0.4 + 0.6 * smoothstep(-0.35, 0.15, 0.6 * Math.sin(along * c.open[0] + c.open[1]) + 0.4 * Math.sin(along * c.open[2] + c.open[3]));
const crackWide = (c, along) => 0.6 + 0.6 * smoothstep(-0.5, 0.5, 0.7 * Math.sin(along * c.wide[0] + c.wide[1]) + 0.3 * Math.sin(along * c.wide[2] + c.wide[3]));

/**
 * Everything about a stone but its mesh: its body (sizes, cuts, dents), the factors that stretch
 * the body to its size, where it stands (turned, and lifted so its top stands its height above
 * the sand), its cracks and the room the fish leaves it. Cheap, so the material's constants come
 * from the same numbers.
 */
function prepare(spec) {
  const rock = { ...spec };
  const rand = stream(rock.seed * 7919 + 13);
  const [w, hAbove, d] = rock.size;
  const H = hAbove / (1 - rock.sink);
  rock.half = [w / 2, H / 2, d / 2];
  rock.mean = (w / 2 + H / 2 + d / 2) / 3;
  rock.off = [rand() * 50 - 25, rand() * 50 - 25, rand() * 50 - 25];
  rock.layers = normalize(rock.layers);
  // (A dent's size: 1 - the cosine of its angular radius.)
  rock.dents = rock.dents.map(([x, y, z, angle, depth]) => ({ dir: normalize([x, y, z]), size: 1 - Math.cos(angle), depth }));
  // (Its smaller facets: shoulders on its upper side, cut shallower and worn rounder than the main
  // planes.)
  const facets = Array.from({ length: rock.facets }, () => {
    const a = rand() * 2 * Math.PI, y = 0.35 + 0.55 * rand();
    const r = Math.sqrt(1 - y * y);
    return [r * Math.cos(a), y, r * Math.sin(a), 0.8 + 0.06 * rand(), 0.1 + 0.05 * rand()];
  });
  rock.planes = [...rock.planes, ...facets].map(([nx, ny, nz, cut, soft]) => {
    const n = normalize([nx, ny, nz]);
    const reach = Math.hypot(...[0, 1, 2].map((k) => rock.half[k] * rock.ends[k][n[k] < 0 ? 0 : 1] * n[k]));
    return { n, h: cut * reach, soft: soft * rock.mean };
  });
  // Stretched to size: the factors that bring the body's extents to the size asked (measured on a
  // coarser sphere than the mesh's).
  const probe = geodesic(16).dirs;
  rock.scale = [1, 1, 1];
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const u of probe) {
    const [r] = surface(rock, u);
    for (let k = 0; k < 3; k++) {
      lo[k] = Math.min(lo[k], u[k] * r);
      hi[k] = Math.max(hi[k], u[k] * r);
    }
  }
  rock.scale = [w / (hi[0] - lo[0]), H / (hi[1] - lo[1]), d / (hi[2] - lo[2])];
  // Turned (about z, then x, then y: the columns of `turn`), and lifted so its top stands its
  // height above the sand.
  const [lx, lz] = rock.lean;
  const rot = (p) => {
    let [x, y, z] = p;
    [x, y] = [x * Math.cos(lz) - y * Math.sin(lz), x * Math.sin(lz) + y * Math.cos(lz)];
    [y, z] = [y * Math.cos(lx) - z * Math.sin(lx), y * Math.sin(lx) + z * Math.cos(lx)];
    [x, z] = [x * Math.cos(rock.yaw) + z * Math.sin(rock.yaw), -x * Math.sin(rock.yaw) + z * Math.cos(rock.yaw)];
    return [x, y, z];
  };
  rock.turn = [rot([1, 0, 0]), rot([0, 1, 0]), rot([0, 0, 1])];
  let top = -Infinity;
  for (const u of probe) {
    const [r] = surface(rock, u);
    top = Math.max(top, rot([u[0] * r, u[1] * r, u[2] * r])[1]);
  }
  rock.shift = [rock.at[0], BED_LEVEL + hAbove - top, rock.at[1]];

  // The room the fish leaves it: a capsule along its long axis, low over the sand, round its body
  // where that stands above the sand (measured on the probe's sphere, so it is the same at any
  // detail).
  const axis = [Math.cos(rock.yaw), 0, -Math.sin(rock.yaw)];
  const across = [Math.sin(rock.yaw), 0, Math.cos(rock.yaw)];
  let reach = 0, depth = 0;
  for (const u of probe) {
    const [r] = surface(rock, u);
    const [x, y, z] = rot([u[0] * r, u[1] * r, u[2] * r]);
    if (y + rock.shift[1] < BED_LEVEL) continue;
    reach = Math.max(reach, Math.abs(x * axis[0] + z * axis[2]));
    depth = Math.max(depth, Math.abs(x * across[0] + z * across[2]));
  }
  const solid = Math.max(depth, 0.5 * hAbove);
  const yc = BED_LEVEL + Math.max(hAbove - solid, 0);
  const halfLen = Math.max(reach - solid, 0);
  /** @type {Obstacle} */
  rock.obstacle = {
    a: [rock.at[0] - axis[0] * halfLen, yc, rock.at[1] - axis[2] * halfLen],
    b: [rock.at[0] + axis[0] * halfLen, yc, rock.at[1] + axis[2] * halfLen],
    r: solid + 0.05,
    solid,
  };

  // Cracks: through the surface point in a direction, running the way asked; or branching off an
  // earlier one, from a point along it.
  rock.crackList = [];
  for (const c of rock.cracks) {
    let u, along, branch = false, length, depth;
    if (Array.isArray(c)) {
      u = normalize(c.slice(0, 3));
      const t1 = normalize(cross(u, Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
      const t2 = cross(u, t1);
      along = t1.map((x, k) => x * Math.cos(c[3]) + t2[k] * Math.sin(c[3]));
      [length, depth] = c.slice(4);
    } else {
      const m = rock.crackList[c.from];
      u = normalize(m.at.map((x, k) => x + m.along[k] * c.at * m.length));
      const a0 = normalize(m.along.map((x, k) => x - u[k] * dot(m.along, u)));
      const side = cross(u, a0);
      along = a0.map((x, k) => x * Math.cos(c.turn) + side[k] * Math.sin(c.turn));
      branch = true;
      ({ length, depth } = c);
    }
    const [r] = surface(rock, u);
    // (Its plane holds the surface's normal there, so the relief pushing the surface in or out
    // along that normal leaves the line where the material finds it.)
    const t1 = normalize(cross(u, along)), t2 = normalize(along);
    const on = (t, e) => {
      const v = normalize(u.map((x, k) => x + e * t[k]));
      const [rv] = surface(rock, v);
      return v.map((x) => x * rv);
    };
    const [a1, b1, a2, b2] = [on(t1, 0.01), on(t1, -0.01), on(t2, 0.01), on(t2, -0.01)];
    let normal = normalize(cross(a1.map((x, k) => x - b1[k]), a2.map((x, k) => x - b2[k])));
    if (dot(normal, u) < 0) normal = normal.map((x) => -x);
    along = normalize(along.map((x, k) => x - normal[k] * dot(along, normal)));
    // (Its wobble: three sines across the stone, coarse to fine; the coarsest bends it gently
    // along its whole length.)
    const wob = [[12, 0.008], [80, 0.0012], [210, 0.0004]].map(([k, a]) => {
      const dir = normalize([rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1]);
      return [dir[0] * k, dir[1] * k, dir[2] * k, rand() * 2 * Math.PI, a];
    });
    rock.crackList.push({
      at: u.map((x) => x * r),
      out: u,
      along,
      n: normalize(cross(along, normal)),
      branch,
      length: length * 2 * rock.mean,
      depth,
      wob,
      open: [35, rand() * 6.3, 90, rand() * 6.3],
      wide: [60, rand() * 6.3, 150, rand() * 6.3],
      k: rand() * 40,
    });
  }
  return rock;
}

/** The relief cut into the surface at a point (its own frame, world units; positive raises it),
 *  how deep a crack lies there, and the relief without its finest grain. Its finest parts follow
 *  the mesh's spacing (pits, grain, cracks); on a coarser mesh (rock.coarse: its spacing over full
 *  detail's) the scallops and the split faces' ripples are broader (and as steep), the bigger pits
 *  broader, the creases and bedding lines wider and the pits' ragged rims smooth, so the mesh
 *  holds them all. */
function relief(rock, p, face) {
  const [ox, oy, oz] = rock.off;
  const x = p[0] + ox, y = p[1] + oy, z = p[2] + oz;
  const sp = rock.spacing, co = rock.coarse, k = Math.sqrt(co);
  // Broad water-worn undulation, gentler on the split faces.
  let h = 0.0065 * (1 - 0.8 * face) * fbm3(x * 16, y * 16, z * 16, 3);
  // Shallow dishes the water scoured, soft ridges between; and on the worn body (not the split
  // faces) smaller scallops inside them.
  const [d1] = cells(x / 0.04, y / 0.04, z / 0.04);
  h += 0.0035 * (1 - 0.8 * face) * (d1 * d1 - 0.35);
  const sc = 0.012 * k;
  const [s1] = cells(x / sc + 4.4, y / sc, z / sc);
  h += 0.0012 * k * (1 - face) * (s1 * s1 - 0.3);
  // The split faces' own low steps and ripples, where the stone broke.
  if (face > 0) h += 0.0012 * k * face * fbm3((x * 70) / k + 1.7, (y * 70) / k, (z * 70) / k, 2);
  // Weathering creases: thin wandering grooves, in patches.
  const crease = 1 - Math.abs(noise3(x * 24 + 5.1, y * 24, z * 24) + 0.2 * noise3(x * 70, y * 70, z * 70 + 2.3));
  h -= 0.001 * (1 - 0.6 * face) * smoothstep(0.05, 0.55, noise3(x * 5, y * 5 + 7.7, z * 5)) * crease ** (6 / co);
  // Bedding: faint grooves along the layers it formed in.
  if (rock.bedding > 0) {
    const s = dot(p, rock.layers) * 52 + 1.6 * fbm3(x * 6, y * 6, z * 6, 2);
    h -= 0.0007 * rock.bedding * (1 - Math.abs(Math.sin(Math.PI * s))) ** (3 / co) * (0.5 + 0.5 * noise3(x * 11, y * 11, z * 11 + 4));
  }
  // Pits, as small as the mesh shapes well: many in patches, and a few bigger and shallower with
  // ragged rims.
  const patch = smoothstep(-0.35, 0.45, noise3(x * 8 + 3.1, y * 8, z * 8));
  for (const [cell, share, r0, r1, deep, rag] of [[Math.max(0.01, 6 * sp), rock.pits * (0.2 + 0.7 * patch), 0.25, 0.45, 0.3, 0], [0.032 * k, 0.04 * rock.pits, 0.16, 0.3, 0.2, 0.35 * clamp01(2 - co)]]) {
    const [pd, , pid, pr] = cells(x / cell + 9.1, y / cell, z / cell);
    const rr = (r0 + (r1 - r0) * pr) * (1 + rag * noise3(x * 180, y * 180 + 2.2, z * 180));
    if (pid < share && pd < rr) {
      const e = 1 - (pd / rr) * (pd / rr);
      h -= deep * rr * cell * e * e;
    }
  }
  // Grain as fine as the mesh holds: small crystals standing a little proud, a rougher noise,
  // both rougher on the split faces (and left out of the cavity, which would show it vertex by
  // vertex).
  const gc = 3.2 * sp;
  const [g1, g2] = cells(x / gc, y / gc + 3.3, z / gc);
  let grain = (0.08 + 0.05 * face) * sp * smoothstep(0, 0.3, g2 - g1);
  grain += (0.09 + 0.05 * face) * sp * fbm3(x / (3.5 * sp), y / (3.5 * sp), z / (3.5 * sp), 2);
  // Cracks: a shallow groove, a few of the mesh's edges wide, where a plane through the stone meets
  // its surface, wobbling, only on the near side, fading out at its ends; open in some stretches,
  // nearly closed in others, its lips chipped back a little either side.
  let crack = 0;
  for (const c of rock.crackList) {
    const d = [p[0] - c.at[0], p[1] - c.at[1], p[2] - c.at[2]];
    const along = dot(d, c.along);
    const mask = crackEnds(c, along) * smoothstep(-0.5 * rock.mean, -0.25 * rock.mean, dot(d, c.out));
    if (mask <= 0) continue;
    const off = dot(d, c.n) + wobble(c, p);
    const width = 2.6 * sp * (0.5 + 0.5 * mask) * crackWide(c, along);
    if (Math.abs(off) > 10 * width) continue;
    const t = off / width;
    const depth = 0.9 * sp * c.depth * mask * crackOpen(c, along);
    crack += depth * ((0.75 + 0.25 * noise3(x * 30, y * 30 + c.k, z * 30)) * Math.exp(-2 * t * t) + 0.2 * Math.exp(-t * t / 12));
  }
  return [h + grain - crack, crack, h - crack];
}

// ---- one stone's mesh -------------------------------------------------------------------------
function buildStone(rock, index, sphere) {
  const { nb } = sphere;
  // (density: the mesh's vertices along a line over full detail's; coarse: its spacing over full
  // detail's, never less than 1, for relief().)
  rock.coarse = Math.max(1, 1 / rock.density);
  const vc = sphere.dirs.length;
  const hAbove = rock.size[1];
  // On the surface, then relaxed: each vertex drawn towards its neighbours' middle and put back on
  // the surface, so the triangles come out even however the body is stretched.
  const pos = new Float64Array(vc * 3);
  const face = new Float64Array(vc);
  const place = (v, u) => {
    const [r, f] = surface(rock, u);
    pos[v * 3] = u[0] * r;
    pos[v * 3 + 1] = u[1] * r;
    pos[v * 3 + 2] = u[2] * r;
    face[v] = f;
  };
  sphere.dirs.forEach((u, v) => place(v, u));
  const next = new Float64Array(vc * 3);
  for (let pass = 0; pass < 8; pass++) {
    for (let v = 0; v < vc; v++) {
      let cx = 0, cy = 0, cz = 0;
      const n = nb.start[v + 1] - nb.start[v];
      for (let k = nb.start[v]; k < nb.start[v + 1]; k++) {
        const o = nb.list[k] * 3;
        cx += pos[o];
        cy += pos[o + 1];
        cz += pos[o + 2];
      }
      next[v * 3] = 0.5 * pos[v * 3] + 0.5 * cx / n;
      next[v * 3 + 1] = 0.5 * pos[v * 3 + 1] + 0.5 * cy / n;
      next[v * 3 + 2] = 0.5 * pos[v * 3 + 2] + 0.5 * cz / n;
    }
    for (let v = 0; v < vc; v++) place(v, normalize([next[v * 3], next[v * 3 + 1], next[v * 3 + 2]]));
  }
  // The mesh's spacing (its mean edge), which sets the finest relief it can hold.
  let edgeSum = 0;
  for (let v = 0; v < vc; v++) {
    for (let k = nb.start[v]; k < nb.start[v + 1]; k++) {
      const o = nb.list[k] * 3;
      edgeSum += Math.hypot(pos[o] - pos[v * 3], pos[o + 1] - pos[v * 3 + 1], pos[o + 2] - pos[v * 3 + 2]);
    }
  }
  rock.spacing = edgeSum / nb.list.length;

  // The relief, along the body's normals; then turned and set in place.
  const n0 = vertexNormals(pos, sphere.tris);
  const disp = new Float64Array(vc);
  const crack = new Float64Array(vc);
  const coarse = new Float64Array(vc);
  const world = new Float64Array(vc * 3);
  const [c0, c1, c2] = rock.turn;
  for (let v = 0; v < vc; v++) {
    const [h, c, hc] = relief(rock, [pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]], face[v]);
    disp[v] = h;
    crack[v] = c;
    coarse[v] = hc;
    const x = pos[v * 3] + n0[v * 3] * h, y = pos[v * 3 + 1] + n0[v * 3 + 1] * h, z = pos[v * 3 + 2] + n0[v * 3 + 2] * h;
    for (let k = 0; k < 3; k++) world[v * 3 + k] = c0[k] * x + c1[k] * y + c2[k] * z + rock.shift[k];
  }
  const normals = vertexNormals(world, sphere.tris);

  // Cavity: how far the relief lies below its surroundings, near (smoothed once more, so single
  // vertices do not show) and broad; and the cracks.
  const near = smoothScalar(coarse, nb, 2);
  // (The broad cavity over as much of the surface at any detail.)
  const broad = smoothScalar(coarse, nb, Math.max(2, Math.round(12 * rock.density * rock.density)));
  const fine = smoothScalar(Array.from(coarse, (h, v) => near[v] - h), nb, 1);
  const attrs = new Float64Array(vc * 4);
  for (let v = 0; v < vc; v++) {
    // (A crack's groove is as many times wider as the mesh is coarser, so its darkening is spread
    // over it, the same in all.)
    const cav = clamp01(Math.max(fine[v] / (0.25 * rock.spacing) * 0.25 + (broad[v] - coarse[v]) / 0.004 * 0.6, crack[v] / (2 * rock.spacing * rock.coarse)));
    // Occlusion: its cavities, and the sand: darker towards the line where it sinks in, darkest
    // under its overhang there.
    const above = world[v * 3 + 1] - BED_LEVEL;
    const ny = normals[v * 3 + 1];
    const sandLine = 0.45 + 0.55 * smoothstep(-0.01, 0.45 * hAbove, above);
    const under = 1 - 0.55 * Math.max(-ny, 0) * (1 - smoothstep(0, 0.7 * hAbove, above));
    const sky = 0.82 + 0.18 * (0.5 + 0.5 * ny);
    // And the driftwood's foot, where the stone comes close to it.
    const gap = capsuleGap(WOOD_FOOT, world[v * 3], world[v * 3 + 1], world[v * 3 + 2]);
    const wood = 1 - 0.45 * Math.exp(-Math.max(gap, 0) / 0.015);
    attrs.set([index, cav, 0, clamp01((1 - 0.65 * cav) * sandLine * under * sky * wood)], v * 4);
  }
  return { world, attrs };
}

const STONES = ROCKS.map(prepare);

/** The four stones as one mesh (attrs.x: which stone), and the room the fish leaves round each.
 *  detail scales their geodesic spheres' frequency (1: ~108k triangles; 0.5, for phones: about a
 *  quarter) and with it the finest relief; their shapes, places, materials' attributes and
 *  obstacles are the same at any detail.
 *  @returns {import('./mesh.mjs').ScapePiece} */
export function build(options = { detail: 1 }) {
  // (Anything but a finite number, or no options at all, is full detail.)
  const detail = Number.isFinite(options?.detail) ? Math.min(Math.max(options.detail, 0.25), 2) : 1;
  const mb = new MeshBuilder('rocks');
  /** @type {Obstacle[]} */
  const obstacles = [];
  const spheres = new Map();
  STONES.forEach((stone, index) => {
    const freq = detail === 1 ? stone.freq : Math.max(6, Math.round(stone.freq * detail));
    let sphere = spheres.get(freq);
    if (!sphere) {
      const g = geodesic(freq);
      sphere = { ...g, nb: neighbours(g.dirs.length, g.tris) };
      spheres.set(freq, sphere);
    }
    const { world, attrs } = buildStone({ ...stone, density: freq / stone.freq }, index, sphere);
    const base = mb.vertexCount;
    for (let v = 0; v < sphere.dirs.length; v++) {
      mb.vertex([world[v * 3], world[v * 3 + 1], world[v * 3 + 2]], [attrs[v * 4], attrs[v * 4 + 1], attrs[v * 4 + 2], attrs[v * 4 + 3]]);
    }
    for (let t = 0; t < sphere.tris.length; t += 3) mb.tri(base + sphere.tris[t], base + sphere.tris[t + 1], base + sphere.tris[t + 2], MAT.ROCK);
    const o = stone.obstacle;
    obstacles.push({ a: o.a.slice(), b: o.b.slice(), r: o.r, solid: o.solid });
  });
  return { meshes: [mb.finish()], obstacles };
}

// ---- the material -----------------------------------------------------------------------------
const f5 = (x) => x.toFixed(5);
const v3 = (a) => `vec3f(${a.map(f5).join(', ')})`;

/** The quartz vein through the biggest stone, and a finer one parallel to it a little way off, as
 *  veins run in sets (WGSL: veinA and veinB, each a unit normal and an offset, the bowl's frame):
 *  steep, through the stone's visible part. */
function veinWGSL() {
  const r = ROCKS[0];
  const rand = stream(r.seed * 7919 + 4099);
  rand();
  const c = [r.at[0], BED_LEVEL + 0.45 * r.size[1], r.at[1]];
  const a = rand() * 2 * Math.PI, y = (rand() * 2 - 1) * 0.6;
  const n = [Math.sqrt(1 - y * y) * Math.cos(a), y, Math.sqrt(1 - y * y) * Math.sin(a)];
  const off = dot(n, c) + (rand() - 0.5) * 0.5 * Math.min(r.size[0], r.size[2]);
  const off2 = off + (rand() < 0.5 ? -1 : 1) * (0.015 + 0.015 * rand());
  return [off, off2].map((o, k) => `    let vein${'AB'[k]} = vec4f(${n.map(f5).join(', ')}, ${f5(o)});`).join('\n');
}

/** Each stone's cracks for the material: the point taken back into the stone's own frame, then
 *  each crack's plane, wobble, ends and width as relief() has them (WGSL: adds to crackLine). */
function crackWGSL() {
  const out = [];
  STONES.forEach((s, i) => {
    const [c0, c1, c2] = s.turn;
    // (The turn's transpose takes the bowl's frame back into the stone's.)
    out.push(`  ${i ? '} else ' : ''}if (id == ${i}u) {`, `    let back = transpose(mat3x3f(${v3(c0)}, ${v3(c1)}, ${v3(c2)}));`, `    let ql = back * (p - ${v3(s.shift)});`, `    let nl = back * n;`);
    for (const c of s.crackList) {
      const L = c.length;
      const ends = c.branch ? `smoothstep(${f5(-0.1 * L)}, ${f5(0.05 * L)}, along) * (1.0 - smoothstep(${f5(0.2 * L)}, ${f5(L)}, along))` : `1.0 - smoothstep(${f5(0.15 * L)}, ${f5(L)}, abs(along))`;
      const wob = c.wob.map(([kx, ky, kz, ph, a]) => `${f5(a)} * sin(dot(ql, ${v3([kx, ky, kz])}) + ${f5(ph)})`).join(' + ');
      out.push(
        '    {',
        `      let d = ql - ${v3(c.at)};`,
        `      let along = dot(d, ${v3(c.along)});`,
        `      let mask = (${ends}) * smoothstep(${f5(-0.5 * s.mean)}, ${f5(-0.25 * s.mean)}, dot(d, ${v3(c.out)}));`,
        `      let cn = ${v3(c.n)};`,
        `      let off = dot(d, cn) + ${wob};`,
        `      let open = 0.4 + 0.6 * smoothstep(-0.35, 0.15, 0.6 * sin(along * ${f5(c.open[0])} + ${f5(c.open[1])}) + 0.4 * sin(along * ${f5(c.open[2])} + ${f5(c.open[3])}));`,
        `      let wide = 0.6 + 0.6 * smoothstep(-0.5, 0.5, 0.7 * sin(along * ${f5(c.wide[0])} + ${f5(c.wide[1])}) + 0.3 * sin(along * ${f5(c.wide[2])} + ${f5(c.wide[3])}));`,
        `      let hw = ${f5(0.0005 * Math.sqrt(c.depth))} * wide * (0.4 + 0.6 * mask);`,
        '      let dist = abs(off) / max(length(cn - nl * dot(cn, nl)), 0.3);',
        '      let core = clamp((hw - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * hw / aa, 1.0);',
        '      crackLine = max(crackLine, core * mask * open);',
        '    }',
      );
    }
  });
  out.push('  }');
  return out.join('\n');
}

/** The stones' material: dark slate and basalt greys, each stone its own shade and tint (close
 *  together), softly mottled with a faint rusty stain here and there, scattered with small pale
 *  (and a few dark) mineral flecks in drifts and pinprick pits, a faint quartz vein through the
 *  biggest and hairline cracks, darker in its cavities, with a fine roughness in the normal and the
 *  soft sheen of a wet stone. Each pattern fades to its mean once a pixel (foot) grows past about
 *  a quarter of its size (and is not computed then). */
export const WGSL = /* wgsl */ `
fn scape_mat_rock(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  let id = u32(attrs.x + 0.5);
  let cav = clamp(attrs.y, 0.0, 1.0);
  let fid = f32(id);
  // Each stone its own grey (sRGB) and tint: neutral slate, a warmer grey, a darker basalt, a
  // greenish grey.
  var base = vec3f(0.245, 0.245, 0.247);
  var tint = vec3f(0.99, 1.0, 1.02);
  if (id == 1u) {
    base = vec3f(0.255, 0.247, 0.236);
    tint = vec3f(1.03, 1.0, 0.96);
  } else if (id == 2u) {
    base = vec3f(0.205, 0.208, 0.215);
    tint = vec3f(1.0, 1.0, 1.03);
  } else if (id >= 3u) {
    base = vec3f(0.228, 0.233, 0.218);
    tint = vec3f(0.98, 1.03, 0.95);
  }
  let q = p + vec3f(fid * 7.31, fid * 3.17, fid * 5.53);
  let aa = max(foot, 1e-6);
  // Soft mottling: broad cloudy patches, paler clouds, a finer speckle; the tint drifting patch to
  // patch, and a faint rusty stain here and there, where iron in it weathered.
  let m1 = scape_fbm3(q * 9.0, 3);
  let m2 = scape_fbm3(q * 36.0 + vec3f(2.7), 2) * (1.0 - smoothstep(0.007, 0.014, aa));
  let cloud = smoothstep(0.15, 0.65, scape_noise3(q * 4.0 + vec3f(9.0)));
  var c = base * (1.0 + 0.36 * m1 + 0.14 * m2 + 0.18 * cloud);
  c *= mix(vec3f(1.0), tint, 0.5 + 0.5 * scape_noise3(q * 5.0 + vec3f(4.0)));
  c *= mix(vec3f(1.0), vec3f(1.07, 1.0, 0.9), smoothstep(0.35, 0.75, scape_noise3(q * 3.0 + vec3f(21.0))));
  // Mineral flecks: a share of small cells lit pale (a few dark), more of them in some drifts than
  // in others, most of them small and a few bigger, each its own tone, flattened along the
  // stone's grain (so most show as short laths), their rims ragged up close.
  let drift = smoothstep(-0.4, 0.5, scape_noise3(q * 18.0 + vec3f(1.3)));
  let paleShare = 0.2 + 0.2 * drift;
  let grainSeen = 1.0 - smoothstep(0.003, 0.006, aa);
  var pale = 0.0;
  var dark = 0.0;
  var tone = 0.42;
  if (aa < 0.006) {
    let lath = normalize(vec3f(sin(fid * 2.4 + 0.5), 0.35, cos(fid * 2.4 + 0.5)));
    let gq = q * 140.0;
    let cl = scape_cells3(gq + lath * dot(gq, lath) * 0.7);
    let u = fract(cl.z * 7.3);
    var rad = 0.12 + 0.28 * u * u;
    if (aa < 0.0016) {
      rad *= 1.0 + 0.35 * (1.0 - smoothstep(0.0008, 0.0016, aa)) * scape_noise3(q * 900.0);
    }
    // (Edges blurred over a pixel, in cell units; a little brighter at the heart.)
    let edge = max(70.0 * aa, 0.03);
    let fleck = (1.0 - smoothstep(rad - edge, rad + edge, cl.x)) * (0.8 + 0.2 * clamp(1.0 - cl.x / rad, 0.0, 1.0));
    pale = select(0.0, fleck, cl.z > 1.0 - paleShare);
    dark = select(0.0, fleck, cl.z < 0.03);
    tone = 0.34 + 0.14 * fract(cl.z * 17.0);
  }
  // (Faded out, the flecks' mean cover: about a twentieth of the share of cells lit, measured.)
  c = mix(c, vec3f(tone, 0.99 * tone, 0.94 * tone), 0.5 * mix(0.052 * paleShare, pale, grainSeen));
  c *= 1.0 - 0.4 * mix(0.0015, dark, grainSeen);
  // Pinprick pits, finer than the mesh's: a few small cells, dark and rougher.
  var pit = 0.0;
  if (aa < 0.0032) {
    let pc = scape_cells3(q * 160.0 + vec3f(5.0));
    let pitR = 0.1 + 0.12 * fract(pc.z * 11.0);
    let pitEdge = max(80.0 * aa, 0.35 * pitR);
    pit = select(0.0, 1.0 - smoothstep(pitR - pitEdge, pitR + pitEdge, pc.x), pc.z > 0.965 - 0.04 * drift) * (1.0 - smoothstep(0.0016, 0.0032, aa));
  }
  c *= 1.0 - 0.3 * pit;
  // A faint quartz vein through the biggest stone and a finer one beside it: each a thin pale band
  // where its plane (bent gently, the two alike) meets the surface, with a fainter halo, its width
  // wavering, pinching out in stretches.
  var vein = 0.0;
  if (id == 0u) {
${veinWGSL()}
    let bend = 0.015 * scape_fbm3(q * 6.0, 2);
    for (var k = 0; k < 2; k++) {
      let pl = select(veinA, veinB, k == 1);
      let fk = f32(k);
      let warp = bend + 0.0012 * scape_noise3(q * 60.0 + vec3f(fk * 2.0));
      let across = max(length(pl.xyz - n * dot(pl.xyz, n)), 0.25);
      let dist = abs(dot(p, pl.xyz) - pl.w + warp) / across;
      let run = smoothstep(-0.4, 0.05, scape_noise3(q * 6.0 + vec3f(fk * 3.1, 5.0, 0.0))) * (1.0 - 0.45 * fk);
      let w = 0.0009 * (0.25 + 1.1 * smoothstep(-0.6, 0.6, scape_fbm3(q * 30.0 + vec3f(fk), 2))) * (1.0 - 0.4 * fk);
      let core = clamp((w - dist) / aa + 0.5, 0.0, 1.0) * min(2.0 * w / aa, 1.0);
      let halo = 1.0 - smoothstep(0.5 * w, 5.0 * w + aa, dist);
      vein = max(vein, run * max(core, 0.1 * halo));
    }
  }
  c = mix(c, vec3f(0.4, 0.395, 0.375), 0.35 * vein);
  // Hairline cracks: each crack's centre line, sharp at any scale, down the middle of its groove.
  var crackLine = 0.0;
${crackWGSL()}
  c *= 1.0 - 0.8 * crackLine;
  // Darker in its cavities, cracks and pits (the occlusion darkens them too).
  c *= mix(1.0, 0.6, cav);
  let albedo = scape_linear(clamp(c, vec3f(0.0), vec3f(1.0)));
  // Fine roughness in the normal: two octaves of bumps, each faded once a pixel outgrows it, the
  // matte it gave left in the roughness instead, so the stone is no glossier from afar.
  var grad = vec3f(0.0);
  var matte = 0.0;
  for (var o = 0; o < 2; o++) {
    let f = select(140.0, 420.0, o == 1);
    let s = select(0.06, 0.05, o == 1);
    let seen = 1.0 - smoothstep(0.25 / f, 0.5 / f, aa);
    matte += 0.08 * (1.0 - seen);
    if (seen <= 0.0) { continue; }
    let b = q * f + vec3f(f32(o) * 13.0);
    let b0 = scape_noise3(b);
    let gb = vec3f(scape_noise3(b + vec3f(0.25, 0.0, 0.0)) - b0, scape_noise3(b + vec3f(0.0, 0.25, 0.0)) - b0, scape_noise3(b + vec3f(0.0, 0.0, 0.25)) - b0) * 4.0;
    grad += gb * s * seen;
  }
  let sn = normalize(n - (grad - n * dot(grad, n)));
  // A soft wet sheen: glossier on the quartz and the flecks, rougher in the hollows and pits.
  let rough = clamp(0.56 + matte + 0.06 * m1 + 0.12 * cav + 0.1 * pit - 0.08 * vein - 0.1 * pale * grainSeen, 0.3, 0.85);
  return ScapeMat(albedo, sn, rough, 0.04, vec3f(0.0), clamp(attrs.w, 0.0, 1.0));
}
`;
