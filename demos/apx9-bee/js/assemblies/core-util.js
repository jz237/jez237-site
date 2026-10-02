// Shared helpers for the core assembly (power-core + pollination-module).
// Conventions used by every core-*.js module:
//   * geometry lives in the top-level part's local frame; the module axis is local +X
//   * theta (degrees) is measured from local +Y (top) towards local +Z (bee-right): point = (x, r cos th, r sin th)
//   * lathe profiles are [r, x, fillet?] corners of a closed outline, counter-clockwise in the (r, x) plane
//   * repeated items are modelled at theta = 0 (on top, +Y radial, +X axial) and spun with aroundX()
import { THREE, M, emissive, revolve, fillet, mergeGeometries, M4, D2R, S, plate, ngonPts, circleHole, axisTo } from '../kit.js';

/** Axial layout of the power core stack (local x, mm). Shared by core-power.js and core-cell.js. */
export const LAY = {
  capR: [-3.25, -2.82], cell: [-2.82, -0.80], ringA: [-0.80, -0.62], bear: [-0.62, 0.38], ringB: [0.38, 0.78],
  board: [0.78, 0.96], ringC: [0.96, 1.22], fins: [1.22, 1.88], ringD: [1.88, 2.10], coil: [2.10, 2.48],
  ringE: [2.48, 2.62], capF: [2.62, 3.25],
};

/** Pollination module axial layout (local x, mm; brush toward +X) shared by core-pollen.js and core-pollen-b.js. */
export const PL = {
  bandA: [-2.78, -2.12], chromeR: [-2.12, -1.94], bandB: [-1.94, -1.28], bandC: [-1.28, -0.98], drum: [-0.98, 1.72],
  ribbed: [1.55, 2.24], chamber: [-1.56, 1.15], vanes: [1.18, 1.52], motor: [-3.0, -1.82], brush: 2.02,
};
const DR = [[1.62, 1.60], [1.66, 1.592], [1.70, 1.572], [1.72, 1.545]];      // rounded front shoulder
/**
 * Outer radius of the yellow drum at axial position x: cylindrical up to x 0.2, then an egg-like taper that closes towards the
 * funnel (r 1.90 -> 1.60 at x 1.62), then a rounded shoulder. Used by the shell profile, decals and fittings.
 */
export function drumR(x) {
  if (x <= 0.20) return 1.90;
  if (x <= 1.62) return 1.90 - 0.30 * Math.pow((x - 0.20) / 1.42, 1.7);
  for (let i = 1; i < DR.length; i++) {
    if (x <= DR[i][0]) { const a = DR[i - 1], b = DR[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
  }
  return DR[DR.length - 1][1];
}

/* ------------------------------------------------------------------ materials (singletons) */
const col = (h) => new THREE.Color(h);
const glass = { transparent: true, depthWrite: false, side: THREE.DoubleSide, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03 };

const vec3 = (a) => `vec3(${a.map((v) => v.toFixed(4)).join(', ')})`;
/**
 * Glowing glass: see-through where it faces the viewer, denser and brighter towards the silhouette (like a lit glass tube).
 * The emission is divided by alpha so the blend adds it at full strength whatever the transparency is.
 * face / edge: linear RGB emission, aFace / aEdge: opacity, power: rim falloff.
 */
function glowGlass(key, { color, face, edge, aFace, aEdge, power = 2 }) {
  const m = new THREE.MeshPhysicalMaterial({ ...glass, name: key, color: col(color), roughness: 0.05, opacity: aEdge });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      {
        float ndv = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
        float rim = pow(1.0 - ndv, ${power.toFixed(2)});
        float a = mix(${aFace.toFixed(3)}, ${aEdge.toFixed(3)}, rim);
        diffuseColor.a = a;
        totalEmissiveRadiance = mix(${vec3(face)}, ${vec3(edge)}, rim) / max(a, 0.05);
      }`);
  };
  m.customProgramCacheKey = () => key;
  return m;
}
/** Additive light haze: brightest where the view ray crosses the most volume (middle of a sphere), fading out at its rim. */
function glowHaze(key, { rgb, power = 1.4 }) {
  const m = new THREE.MeshLambertMaterial({ name: key, color: 0x000000, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      {
        float ndv = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
        diffuseColor.a = pow(ndv, ${power.toFixed(2)});
        totalEmissiveRadiance = ${vec3(rgb)};
      }`);
  };
  m.customProgramCacheKey = () => key;
  return m;
}
const plateGlow = M.pcbGlow.clone();
plateGlow.name = 'cell plate glow';
plateGlow.emissive = col('#0c84ff');
plateGlow.emissiveIntensity = 0.85;

export const C = {
  // light sources: HDR values well above the bloom threshold (~1.05)
  filament: emissive('#e4f8ff', 6.5),
  rib: emissive('#5fd2ff', 6.0),
  rod: emissive('#7fd6ff', 3.0),
  // translucent shells (pick:false meshes)
  cellHaze: glowHaze('cell haze', { rgb: [0.004, 0.09, 0.32], power: 1.7 }),
  plateGlow,
  cellGlass: glowGlass('cell glass', { color: '#2d7dff', face: [0.004, 0.05, 0.22], edge: [0.03, 0.24, 0.70], aFace: 0.16, aEdge: 0.62, power: 2 }),
  chamberGlass: new THREE.MeshPhysicalMaterial({ ...glass, name: 'chamber glass', color: col('#d8f0ff'), emissive: col('#ffc83a'), emissiveIntensity: 0.14, roughness: 0.04, opacity: 0.3 }),
  // coated / tinted metals and elastomers
  copperPol: new THREE.MeshPhysicalMaterial({ name: 'polished copper', color: col('#d98550'), metalness: 1, roughness: 0.16, clearcoat: 0.4, clearcoatRoughness: 0.1 }),
  blueAnod: new THREE.MeshPhysicalMaterial({ name: 'blue anodised', color: col('#2c5fd0'), metalness: 0.95, roughness: 0.3, clearcoat: 0.4 }),
  alu: new THREE.MeshPhysicalMaterial({ name: 'aluminium', color: col('#7d889c'), metalness: 1, roughness: 0.42, clearcoat: 0.1, clearcoatRoughness: 0.35 }),
  redRubber: new THREE.MeshStandardMaterial({ name: 'red silicone', color: col('#b4161b'), roughness: 0.5, metalness: 0 }),
  blueRubber: new THREE.MeshStandardMaterial({ name: 'blue silicone', color: col('#1b4fb8'), roughness: 0.5, metalness: 0 }),
  bristle: new THREE.MeshPhysicalMaterial({ name: 'gold bristle', color: col('#ffd02a'), vertexColors: true, metalness: 0.22, roughness: 0.42, clearcoat: 0.25, clearcoatRoughness: 0.3 }),
};

/* ------------------------------------------------------------------ lathe helpers */
/** Facet count of a fillet arc from its radius: hairline machining bevels get one facet, big roundings four. */
const stepsFor = (r) => (r < 0.015 ? 1 : r < 0.028 ? 2 : r < 0.09 ? 3 : 4);
/**
 * Round the corners of a closed [r, x, fillet?] loop (polygon only, no normals). Used for the flat cut faces of lathePart().
 */
function roundLoop(loop) {
  const n = loop.length, out = [];
  for (let i = 0; i < n; i++) {
    const p = loop[i], r = p[2] || 0;
    if (r <= 0) { out.push([p[0], p[1]]); continue; }
    const a = loop[(i + n - 1) % n], b = loop[(i + 1) % n];
    const q = fillet([[a[0], a[1]], p, [b[0], b[1]]], { steps: stepsFor(r) });
    for (let k = 1; k < q.length - 1; k++) out.push(q[k]);
  }
  return out;
}
/** Default facet count around the axis from the largest radius of the profile. */
const autoSeg = (loop) => {
  let m = 0;
  for (const p of loop) m = Math.max(m, p[0]);
  return m >= 1.5 ? 64 : m >= 1.0 ? 48 : m >= 0.5 ? 32 : 24;
};

/**
 * Profile vertices with analytic normals. pts = [[r, x, fillet?], ...] in (r, x); the outward normal of an edge with direction
 * (dr, dx) is (dx, -dr). Straight faces keep their exact normal, fillet arcs rotate it through the turn, and un-filleted corners
 * split into one vertex per adjacent face. (Averaging normals across a crease bleeds the bevel tilt into the flat faces, which
 * makes polished metal ripple in the reflection.)
 */
function profileVerts(pts, closed, stepsOf) {
  const P = [];
  for (const p of pts) {
    const q = P[P.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-7) P.push(p);
  }
  if (closed && P.length > 1 && Math.hypot(P[0][0] - P[P.length - 1][0], P[0][1] - P[P.length - 1][1]) <= 1e-7) P.pop();
  const n = P.length, out = [];
  const dir = (a, b) => { const dr = b[0] - a[0], dx = b[1] - a[1], l = Math.hypot(dr, dx) || 1; return [dr / l, dx / l]; };
  const put = (r, x, nn) => out.push({ r: Math.max(r, 0), x, nr: nn[0], nx: nn[1] });
  for (let i = 0; i < n; i++) {
    const p = P[i];
    const prev = closed ? P[(i + n - 1) % n] : (i > 0 ? P[i - 1] : null);
    const next = closed ? P[(i + 1) % n] : (i < n - 1 ? P[i + 1] : null);
    if (!prev || !next) {
      const d = prev ? dir(prev, p) : dir(p, next);
      put(p[0], p[1], [d[1], -d[0]]);
      continue;
    }
    const d1 = dir(prev, p), d2 = dir(p, next), n1 = [d1[1], -d1[0]], n2 = [d2[1], -d2[0]], f = p[2] || 0;
    let arc = null;
    if (f > 0) {
      const q = fillet([[prev[0], prev[1]], [p[0], p[1], f], [next[0], next[1]]], { steps: stepsOf(f) });
      if (q.length > 3) arc = q.slice(1, -1);
    }
    if (arc) {
      const turn = Math.atan2(d1[0] * d2[1] - d1[1] * d2[0], d1[0] * d2[0] + d1[1] * d2[1]);
      const K = arc.length - 1;
      for (let k = 0; k <= K; k++) {
        const t = turn * k / K, c = Math.cos(t), s = Math.sin(t);
        put(arc[k][0], arc[k][1], [n1[0] * c - n1[1] * s, n1[0] * s + n1[1] * c]);
      }
    } else {
      put(p[0], p[1], n1);
      if (n1[0] * n2[0] + n1[1] * n2[1] < 0.9998) put(p[0], p[1], n2);
    }
  }
  return out;
}

/** Revolve profile vertices (see profileVerts) about +X. Same orientation, winding and phi convention as kit revolve + axisTo('x'). */
function revolveX(V, o = {}) {
  const seg = S(o.segments ?? 48, 6), phi0 = o.phi0 ?? 0, phi = o.phi ?? Math.PI * 2, nv = V.length;
  const cum = [0];
  for (let j = 1; j < nv; j++) cum.push(cum[j - 1] + Math.hypot(V[j].r - V[j - 1].r, V[j].x - V[j - 1].x));
  const total = cum[nv - 1] || 1;
  const cnt = (seg + 1) * nv, pos = new Float32Array(cnt * 3), nor = new Float32Array(cnt * 3), uv = new Float32Array(cnt * 2);
  for (let i = 0; i <= seg; i++) {
    const ph = phi0 + phi * i / seg, s = Math.sin(ph), c = Math.cos(ph);
    for (let j = 0; j < nv; j++) {
      const v = V[j], k = i * nv + j;
      pos[k * 3] = v.x; pos[k * 3 + 1] = -v.r * s; pos[k * 3 + 2] = v.r * c;
      nor[k * 3] = v.nx; nor[k * 3 + 1] = -v.nr * s; nor[k * 3 + 2] = v.nr * c;
      uv[k * 2] = i / seg; uv[k * 2 + 1] = cum[j] / total;
    }
  }
  const idx = [];
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < nv - 1; j++) {
      const a = i * nv + j, b = a + nv, d = a + 1, c = b + 1;
      const z0 = V[j].r < 1e-6, z1 = V[j + 1].r < 1e-6;
      if (z0 && z1) continue;
      if (Math.abs(V[j + 1].r - V[j].r) + Math.abs(V[j + 1].x - V[j].x) < 1e-9) continue;       // split corner: zero-width strip
      if (!z0) idx.push(a, b, d);
      if (!z1) idx.push(c, d, b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(new THREE.BufferAttribute(cnt > 65535 ? new Uint32Array(idx) : new Uint16Array(idx), 1));
  return g;
}

/** Closed outline revolved about +X. loop = [[r, x, fillet?], ...] counter-clockwise in (r, x). o: { segments, phi0, phi }. */
export function lathe(loop, o = {}) {
  const V = profileVerts(loop, true, stepsFor);
  const a = V[V.length - 1], b = V[0];
  // open the loop in the middle of its closing edge so the seam sits on a flat face
  const dr = b.r - a.r, dx = b.x - a.x, l = Math.hypot(dr, dx);
  const mid = { r: (a.r + b.r) / 2, x: (a.x + b.x) / 2, nr: l > 1e-9 ? dx / l : b.nr, nx: l > 1e-9 ? -dr / l : b.nx };
  return revolveX([mid, ...V, mid], { segments: autoSeg(loop), ...o });
}
/** Open profile (touching the axis) revolved about +X. o: { segments, steps (facets per fillet, default 2), phi0, phi }. */
export const latheOpen = (prof, o = {}) => revolveX(profileVerts(prof, false, () => o.steps ?? 2), { segments: autoSeg(prof), ...o });

/** Plain tube / ring about +X: inner radius, outer radius, x0..x1, edge fillet. */
export function tube(rIn, rOut, x0, x1, f = 0.03, o = {}) {
  return lathe([[rIn, x0, f * 0.6], [rOut, x0, f], [rOut, x1, f], [rIn, x1, f * 0.6]], o);
}

/** Part of a lathe between two thetas (degrees, from +Y towards +Z), closed with flat cap faces. `segments` counts over the arc. */
export function lathePart(loop, th0, th1, o = {}) {
  const arc = Math.abs(th1 - th0) / 360;
  const g = lathe(loop, { phi0: (th0 - 90) * D2R, phi: (th1 - th0) * D2R, segments: Math.max(6, Math.round(autoSeg(loop) * arc)), ...o });
  const poly = roundLoop(loop);
  const contour = poly.map((p) => new THREE.Vector2(p[1], p[0]));
  const faces = THREE.ShapeUtils.triangulateShape(contour, []);
  const parts = [g];
  for (const [th, sgn] of [[th0, -1], [th1, 1]]) {
    const t = th * D2R, c = Math.cos(t), s = Math.sin(t);
    const pos = [], nor = [];
    const out = new THREE.Vector3(0, -s * sgn, c * sgn);
    const P = (k) => new THREE.Vector3(poly[k][1], poly[k][0] * c, poly[k][0] * s);
    for (const f of faces) {
      let [a, b, d] = f;
      const pa = P(a), pb = P(b), pd = P(d);
      const n = new THREE.Vector3().crossVectors(pb.clone().sub(pa), pd.clone().sub(pa));
      if (n.dot(out) < 0) { const tmp = b; b = d; d = tmp; }
      for (const k of [a, b, d]) { const p = P(k); pos.push(p.x, p.y, p.z); nor.push(out.x, out.y, out.z); }
    }
    const cg = new THREE.BufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    cg.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    cg.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2));
    parts.push(cg);
  }
  return mergeGeometries(parts.map((x) => (x.index ? x.toNonIndexed() : x)), false);
}

/* ------------------------------------------------------------------ plate holes (explicit vertices, counter-clockwise) */
/** Round hole with exactly n vertices (circleHole gets its facet count from the extrusion, which makes big bores polygonal). */
export function polyHole(r, n = 32, cx = 0, cy = 0) {
  const P = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; P.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r)); }
  return new THREE.Path(P);
}
/** Kidney slot: radial band rIn..rOut over th0..th1 (degrees, plate x/y), rounded ends. nArc segments per side, nEnd per end. */
export function arcSlot(rIn, rOut, th0, th1, nArc = 3, nEnd = 3) {
  const rm = (rIn + rOut) / 2, w = (rOut - rIn) / 2;
  const a0 = th0 * D2R + w / rm, a1 = th1 * D2R - w / rm;
  const at = (r, a) => new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r);
  const end = (a, t) => {
    const c = at(rm, a);
    return new THREE.Vector2(c.x + w * (Math.cos(t) * Math.cos(a) - Math.sin(t) * Math.sin(a)), c.y + w * (Math.cos(t) * Math.sin(a) + Math.sin(t) * Math.cos(a)));
  };
  const P = [];
  for (let i = 0; i <= nArc; i++) P.push(at(rOut, a0 + (a1 - a0) * i / nArc));
  for (let j = 1; j < nEnd; j++) P.push(end(a1, Math.PI * j / nEnd));
  for (let i = nArc; i >= 0; i--) P.push(at(rIn, a0 + (a1 - a0) * i / nArc));
  for (let j = 1; j < nEnd; j++) P.push(end(a0, Math.PI + Math.PI * j / nEnd));
  return new THREE.Path(P);
}

/* ------------------------------------------------------------------ placement */
const _a = new THREE.Matrix4(), _b = new THREE.Matrix4();
export const TILT_PX = new THREE.Matrix4().makeRotationZ(-Math.PI / 2);   // geometry +Y -> +X
export const TILT_NX = new THREE.Matrix4().makeRotationZ(Math.PI / 2);    // geometry +Y -> -X

/** Matrices for `count` copies spun around the X axis. Item frame: +Y radial, +X axial, +Z tangential. */
export function aroundX(count, { x = 0, r = 0, phase = 0, span = 360, tilt = null, s = 1, sv = null, z = 0 } = {}) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = (phase + i * span / count) * D2R;
    const m = new THREE.Matrix4().makeRotationX(a).multiply(_a.makeTranslation(x, r, z));
    if (tilt) m.multiply(tilt);
    if (sv) m.multiply(_b.makeScale(sv[0], sv[1], sv[2]));
    else if (s !== 1) m.multiply(_b.makeScale(s, s, s));
    out.push(m);
  }
  return out;
}

/** Matrix: translate (x, r*cos th, r*sin th), spin about X by th so the item's +Y points radially outward. */
export function atTheta(x, r, thDeg, { tilt = null, s = 1, sv = null } = {}) {
  const a = thDeg * D2R;
  const m = new THREE.Matrix4().makeRotationX(a).multiply(_a.makeTranslation(x, r, 0));
  if (tilt) m.multiply(tilt);
  if (sv) m.multiply(_b.makeScale(sv[0], sv[1], sv[2]));
  else if (s !== 1) m.multiply(_b.makeScale(s, s, s));
  return m;
}

/** Add a hand-built InstancedMesh (full control over each matrix) to a part. */
export function instanced(part, geo, mat, mats, opts = {}) {
  const { colors = null, ...meshOpts } = opts;
  const mesh = new THREE.InstancedMesh(geo, mat, mats.length);
  if (colors) for (let i = 0; i < mats.length; i++) mesh.setColorAt(i, colors[i]);
  const pos = geo.attributes.position, pts = [], box = new THREE.Box3();
  for (let i = 0; i < mats.length; i++) {
    mesh.setMatrixAt(i, mats[i]);
    for (let k = 0; k < pos.count; k++) { const v = new THREE.Vector3().fromBufferAttribute(pos, k).applyMatrix4(mats[i]); pts.push(v); box.expandByPoint(v); }
  }
  mesh.instanceMatrix.needsUpdate = true;
  // tight bounding sphere over the real instance vertices (three's default grows with the geometry's own sphere and
  // over-states the extent of long thin instances; the registry turns this sphere into the part's bounding cube)
  const c = box.getCenter(new THREE.Vector3());
  let r2 = 0;
  for (const v of pts) r2 = Math.max(r2, v.distanceToSquared(c));
  mesh.boundingSphere = new THREE.Sphere(c, Math.sqrt(r2));
  part.addMesh(mesh, meshOpts);
  return mesh;
}

/** Translucent / non-pickable mesh: bakes `m` into a clone and adds it with pick:false. */
export function ghostMesh(part, geo, mat, m = null) {
  const g = geo.clone();
  if (m) g.applyMatrix4(M4(m));
  const mesh = new THREE.Mesh(g, mat);
  part.addMesh(mesh, { pick: false, cast: false });
  return mesh;
}

/* ------------------------------------------------------------------ fasteners */
const memo = new Map();
/** Cached low-poly socket-head cap screw (head +Y, hex socket suggested by a recess, 8 segments, open underside). */
export function bolt(r = 0.07, h = 0.05) {
  const k = `s${r}|${h}`;
  if (!memo.has(k)) {
    memo.set(k, revolve([[r, 0], [r, h * 0.68], [r * 0.84, h], [r * 0.5, h], [r * 0.5, h * 0.42], [0, h * 0.42]], { segments: 8, steps: 1, creaseDeg: 50 }));
  }
  return memo.get(k);
}
/** Hex prism (circumradius r, height h) with optional round bore; axis 'y' | 'x' | 'z'. Cached. */
export function hexPrism(r, h, bore = 0, axis = 'y') {
  const k = `h${r}|${h}|${bore}|${axis}`;
  if (!memo.has(k)) {
    const holes = bore > 0 ? [circleHole(bore)] : [];
    const g = plate(ngonPts(6, r, Math.PI / 6), h, { bevel: Math.min(0.03, h * 0.3), center: true, bevelSegments: 1, holes });
    g.rotateX(-Math.PI / 2);          // extrusion Z -> +Y
    memo.set(k, axisTo(g, axis));
  }
  return memo.get(k);
}
/** Ring of socket screws on an end face. dir +1 = heads face +X, -1 = heads face -X. */
export function boltRing(part, mat, { n, r, x, dir = 1, rb = 0.07, hb = 0.05, phase = 0 }) {
  part.addMany(bolt(rb, hb), mat, aroundX(n, { x, r, phase, tilt: dir > 0 ? TILT_PX : TILT_NX }));
}
/** Ring of radial screws (heads point away from the axis) on a cylindrical surface of radius r. */
export function boltBand(part, mat, { n, r, x, rb = 0.06, hb = 0.04, phase = 0 }) {
  part.addMany(bolt(rb, hb), mat, aroundX(n, { x, r, phase }));
}

/** Matrix placing geometry whose +Y axis should point along `dir`, at `pos`. */
export const UP = new THREE.Vector3(0, 1, 0);
export function alignY(dir, pos, scale = 1) {
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  return new THREE.Matrix4().compose(pos, q, new THREE.Vector3(scale, scale, scale));
}

/** Position on the cylinder surface: (x, r cos th, r sin th). */
export const cylPt = (x, r, thDeg) => new THREE.Vector3(x, r * Math.cos(thDeg * D2R), r * Math.sin(thDeg * D2R));
