/**
 * Schematic landmark models — the pure half.
 *
 * A model is a few primitives (box, pyramid, gable, ring, cylinder) in local
 * metres about a landmark's anchor. They are packed into the same vertex
 * layout the structures shader draws (position with a raw structural y, the
 * DEM ground under the anchor, and a height/base pair), plus a per-vertex
 * model index so one mesh can highlight a selected model.
 *
 * Everything here is a recognisable silhouette built from rounded public
 * dimensions, never a survey; the cards say so.
 */

const DEG = Math.PI / 180;

export const PRIMITIVE_TYPES = ['box', 'pyramid', 'gable', 'ring', 'cylinder'];

/** Validate a models document; returns a list of problems (empty = ok). */
export function validateModels(doc, landmarkNames) {
  const problems = [];
  const ids = new Set();
  for (const model of doc?.models || []) {
    if (!model.id || ids.has(model.id)) problems.push(`duplicate or missing id ${model.id}`);
    ids.add(model.id);
    if (!landmarkNames.has(model.landmark)) problems.push(`${model.id}: unknown landmark ${model.landmark}`);
    if (!model.source) problems.push(`${model.id}: no source note`);
    if (!Array.isArray(model.parts) || !model.parts.length) problems.push(`${model.id}: no parts`);
    for (const [i, part] of (model.parts || []).entries()) {
      if (!PRIMITIVE_TYPES.includes(part.type)) problems.push(`${model.id}#${i}: type ${part.type}`);
      const h = part.h;
      if (!(h > 0 && h < 400)) problems.push(`${model.id}#${i}: height ${h}`);
      const span = Math.max(part.w || 0, part.d || 0, (part.r || 0) * 2);
      if (!(span > 0 && span < 600)) problems.push(`${model.id}#${i}: span ${span}`);
      if ((part.base || 0) < 0 || (part.base || 0) > 400) problems.push(`${model.id}#${i}: base`);
    }
  }
  return problems;
}

/**
 * Build every model into one packed solid set.
 * `anchors` maps landmark name -> { lon, lat }; `toWorld(lon, lat)` returns
 * [x, z] metres; `groundAt(x, z)` samples the DEM.
 */
export function buildLandmarkModels(doc, ctx) {
  const { anchors, toWorld, groundAt } = ctx;
  const out = { position: [], ground: [], info: [], model: [], year: [], index: [] };
  const models = [];

  (doc?.models || []).forEach((model, modelIndex) => {
    const anchor = (Number.isFinite(model.lon) && Number.isFinite(model.lat))
      ? { lon: model.lon, lat: model.lat }
      : anchors.get(model.landmark);
    if (!anchor) return;
    const [ax, az] = toWorld(anchor.lon, anchor.lat);
    const ground = Math.max(0, groundAt(ax, az));
    const vertexStart = out.position.length / 3;
    let top = 0;
    let radius = 0;

    for (const part of model.parts) {
      const base = part.base || 0;
      const rot = (part.rot || 0) * DEG;
      const cx = ax + (part.x || 0);
      const cz = az + (part.z || 0);
      const place = (x, z) => rotate(cx, cz, x, z, rot);
      top = Math.max(top, base + part.h);
      radius = Math.max(radius, Math.hypot(part.x || 0, part.z || 0)
        + Math.max(part.w || 0, part.d || 0, (part.r || 0) * 2) / 2);

      if (part.type === 'box') {
        prism(out, rect(part.w, part.d).map(([x, z]) => place(x, z)), base, base + part.h,
          ground, modelIndex);
      } else if (part.type === 'pyramid') {
        pyramid(out, rect(part.w, part.d).map(([x, z]) => place(x, z)), place(0, 0),
          base, base + part.h, ground, modelIndex);
      } else if (part.type === 'gable') {
        // A box up to h, then a ridge roof of height `ridge` along the long axis.
        const ring = rect(part.w, part.d).map(([x, z]) => place(x, z));
        prism(out, ring, base, base + part.h, ground, modelIndex);
        const long = (part.w || 0) >= (part.d || 0);
        const r1 = long ? place(-part.w / 2, 0) : place(0, -part.d / 2);
        const r2 = long ? place(part.w / 2, 0) : place(0, part.d / 2);
        gableRoof(out, ring, r1, r2, base + part.h, base + part.h + (part.ridge || 4),
          ground, modelIndex);
        top = Math.max(top, base + part.h + (part.ridge || 4));
      } else if (part.type === 'ring') {
        const segs = Math.max(8, part.segs || 24);
        const outer = ellipse(part.w / 2, part.d / 2, segs).map(([x, z]) => place(x, z));
        const inner = ellipse(part.w / 2 - part.thick, part.d / 2 - part.thick, segs)
          .map(([x, z]) => place(x, z));
        annulus(out, outer, inner, base, base + part.h, ground, modelIndex);
      } else if (part.type === 'cylinder') {
        const segs = Math.max(6, part.segs || 12);
        prism(out, ellipse(part.r, part.r, segs).map(([x, z]) => place(x, z)),
          base, base + part.h, ground, modelIndex);
      }
    }

    const vertexEnd = out.position.length / 3;
    for (let v = vertexStart; v < vertexEnd; v += 1) out.year[v] = model.built || 0;
    models.push({
      id: model.id, landmark: model.landmark, index: modelIndex, built: model.built || 0,
      x: ax, z: az, ground, top, radius: Math.max(radius, 10),
      vertexStart, vertexEnd: out.position.length / 3,
    });
  });

  return {
    position: new Float32Array(out.position),
    ground: new Float32Array(out.ground),
    info: new Float32Array(out.info),
    model: new Float32Array(out.model),
    year: new Float32Array(out.year),
    index: new Uint32Array(out.index),
    vertexCount: out.position.length / 3,
    indexCount: out.index.length,
    models,
  };
}

// ---- primitives ------------------------------------------------------------

function rotate(cx, cz, x, z, rot) {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return [cx + x * c - z * s, cz + x * s + z * c];
}

function rect(w, d) {
  return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]];
}

function ellipse(rx, rz, segs) {
  const pts = [];
  for (let i = 0; i < segs; i += 1) {
    const a = (i / segs) * Math.PI * 2;
    pts.push([Math.cos(a) * rx, Math.sin(a) * rz]);
  }
  return pts;
}

function push(out, x, y, z, ground, height, base, model) {
  out.position.push(x, y, z);
  out.ground.push(ground);
  out.info.push(height, base);
  out.model.push(model);
  return out.position.length / 3 - 1;
}

function tri(out, a, b, c) {
  out.index.push(a, b, c);
}

/** Walls between two rings of a convex polygon plus a flat cap. */
function prism(out, ring, y0, y1, ground, model) {
  const n = ring.length;
  const h = y1 - y0;
  const bottom = ring.map(([x, z]) => push(out, x, y0, z, ground, h, y0, model));
  const topRing = ring.map(([x, z]) => push(out, x, y1, z, ground, h, y0, model));
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    tri(out, bottom[i], bottom[j], topRing[j]);
    tri(out, bottom[i], topRing[j], topRing[i]);
  }
  for (let i = 1; i < n - 1; i += 1) tri(out, topRing[0], topRing[i], topRing[i + 1]);
}

function pyramid(out, ring, apexXZ, y0, y1, ground, model) {
  const n = ring.length;
  const h = y1 - y0;
  const bottom = ring.map(([x, z]) => push(out, x, y0, z, ground, h, y0, model));
  const apex = push(out, apexXZ[0], y1, apexXZ[1], ground, h, y0, model);
  for (let i = 0; i < n; i += 1) tri(out, bottom[i], bottom[(i + 1) % n], apex);
  for (let i = 1; i < n - 1; i += 1) tri(out, bottom[0], bottom[i + 1], bottom[i]);
}

/** Two roof planes from the eaves (a 4-point ring) up to a ridge line. */
function gableRoof(out, ring, r1, r2, yEave, yRidge, ground, model) {
  const h = yRidge - yEave;
  const e = ring.map(([x, z]) => push(out, x, yEave, z, ground, h, yEave, model));
  const a = push(out, r1[0], yRidge, r1[1], ground, h, yEave, model);
  const b = push(out, r2[0], yRidge, r2[1], ground, h, yEave, model);
  // ring order: [-w,-d], [w,-d], [w,d], [-w,d]; ridge runs r1 (-w side) -> r2 (+w side)
  tri(out, e[0], e[1], b); tri(out, e[0], b, a);      // front slope
  tri(out, e[2], e[3], a); tri(out, e[2], a, b);      // back slope
  tri(out, e[3], e[0], a);                            // left gable
  tri(out, e[1], e[2], b);                            // right gable
}

/** A ring wall: outer and inner walls plus the flat top between them. */
function annulus(out, outer, inner, y0, y1, ground, model) {
  const n = outer.length;
  const h = y1 - y0;
  const ob = outer.map(([x, z]) => push(out, x, y0, z, ground, h, y0, model));
  const ot = outer.map(([x, z]) => push(out, x, y1, z, ground, h, y0, model));
  const ib = inner.map(([x, z]) => push(out, x, y0, z, ground, h, y0, model));
  const it = inner.map(([x, z]) => push(out, x, y1, z, ground, h, y0, model));
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    tri(out, ob[i], ob[j], ot[j]); tri(out, ob[i], ot[j], ot[i]);   // outer wall
    tri(out, ib[j], ib[i], it[i]); tri(out, ib[j], it[i], it[j]);   // inner wall
    tri(out, ot[i], ot[j], it[j]); tri(out, ot[i], it[j], it[i]);   // top
  }
}
