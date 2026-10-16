// Load-time merge of the game's kit instances into a few big meshes per (material group, street cell).
//
// The kit library GLB holds every unique game piece once (one primitive per game material slot); the instance
// list (witte_world.json) places them. Merging here keeps the download small (unique meshes only) while the GPU
// sees ~one draw call per material group and cell instead of one per piece/slot (the game's ~150 slots collapse
// into the uber material through per-vertex albedo / roughness / metalness attributes).
import * as THREE from 'three';

export const CELL_EDGES = [-1e9, -52, -28, -8, 12, 1e9]; // Three z: terminal end .. E Venango

export function cellOf(z) {
  for (let i = 0; i < CELL_EDGES.length - 1; i++) if (z >= CELL_EDGES[i] && z < CELL_EDGES[i + 1]) return i;
  return CELL_EDGES.length - 2;
}

function lin2srgbByte(c) {
  c = Math.max(0, Math.min(1, c));
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

const GROUP_ATTRS = {
  opaque: { uv: false, albedo: true, metal: true },
  glass: { uv: true, albedo: true, lit: true },
  lamp: { uv: false, lamp: true },
  leaves: { uv: true, wind: true },
  weeds: { uv: true, wind: true },
  tex: { uv: true },
};

function attrsFor(group) {
  if (group.startsWith('tex:')) return GROUP_ATTRS.tex;
  return GROUP_ATTRS[group] || GROUP_ATTRS.opaque;
}

// kit kinds that cast streetlight shadows (cars, poles, trees, stoops, rails, fences, street furniture); facade
// insets (windows, sills, back caps), ground scraps and wall items do not (keeps the shadow passes cheap)
export const CASTER_KINDS = new Set(['car', 'steps', 'rail', 'pole', 'pole_light', 'light', 'tree', 'yard_tree', 'fence',
  'gate', 'hydrant', 'sign', 'stop_sign', 'pole_sign', 'toter', 'dumpster', 'clutter', 'planter', 'canopy', 'awning', 'ac',
  'cornice', 'rollup_hood', 'bag', 'roof_chimney', 'yard_plant', 'structure', 'furniture', 'window_box']);

class Builder {
  constructor(key, group, cell, detail, cast) {
    this.key = key;
    this.group = group;
    this.cell = cell;
    this.detail = detail;
    this.cast = cast;
    this.entries = [];
    this.nv = 0;
    this.ni = 0;
  }

  add(geom, matrix, info) {
    const nv = geom.attributes.position.count;
    const ni = geom.index ? geom.index.count : nv;
    this.entries.push({ geom, matrix, info });
    this.nv += nv;
    this.ni += ni;
  }

  build() {
    const A = attrsFor(this.group);
    const nv = this.nv;
    const pos = new Float32Array(nv * 3);
    const nor = new Float32Array(nv * 3);
    const uv = A.uv ? new Float32Array(nv * 2) : null;
    const alb = A.albedo ? new Uint8Array(nv * 4) : null;
    const met = A.metal ? new Uint8Array(nv * 2) : null;
    const lit = A.lit ? new Uint8Array(nv * 4) : null;
    const lamp = A.lamp ? new Float32Array(nv) : null;
    const wind = A.wind ? new Uint8Array(nv * 4) : null;
    const idx = nv > 65535 ? new Uint32Array(this.ni) : new Uint16Array(this.ni);
    const nm = new THREE.Matrix3();
    let vo = 0;
    let io = 0;
    for (const { geom, matrix, info } of this.entries) {
      const P = geom.attributes.position;
      const N = geom.attributes.normal;
      const U = geom.attributes.uv;
      const C = geom.attributes.color;
      const e = matrix.elements;
      nm.getNormalMatrix(matrix);
      const n = nm.elements;
      const cnt = P.count;
      for (let i = 0; i < cnt; i++) {
        const x = P.getX(i), y = P.getY(i), z = P.getZ(i);
        const o = (vo + i) * 3;
        pos[o] = e[0] * x + e[4] * y + e[8] * z + e[12];
        pos[o + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
        pos[o + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
        if (info.flatN) {
          nor[o] = info.flatN[0]; nor[o + 1] = info.flatN[1]; nor[o + 2] = info.flatN[2];
        } else if (N) {
          const a = N.getX(i), b = N.getY(i), c = N.getZ(i);
          let nx = n[0] * a + n[3] * b + n[6] * c;
          let ny = n[1] * a + n[4] * b + n[7] * c;
          let nz = n[2] * a + n[5] * b + n[8] * c;
          const l = Math.hypot(nx, ny, nz) || 1;
          nor[o] = nx / l; nor[o + 1] = ny / l; nor[o + 2] = nz / l;
        } else {
          nor[o + 1] = 1;
        }
        if (uv && U) {
          uv[(vo + i) * 2] = U.getX(i);
          uv[(vo + i) * 2 + 1] = U.getY(i);
        }
        if (wind) {
          const w = (vo + i) * 4;
          if (C) {
            wind[w] = Math.round(Math.max(0, Math.min(1, C.getX(i))) * 255);
            wind[w + 1] = Math.round(Math.max(0, Math.min(1, C.getY(i))) * 255);
            wind[w + 2] = Math.round(Math.max(0, Math.min(1, C.getZ(i))) * 255);
            wind[w + 3] = Math.round(Math.max(0, Math.min(1, C.itemSize > 3 ? C.getW(i) : 0.5)) * 255);
          } else {
            wind[w] = 0; wind[w + 1] = 0; wind[w + 2] = 0; wind[w + 3] = 128;
          }
        }
      }
      if (alb) {
        const r = lin2srgbByte(info.rgb[0]), g = lin2srgbByte(info.rgb[1]), b = lin2srgbByte(info.rgb[2]);
        const ro = Math.round(Math.max(0.02, Math.min(1, info.rough)) * 255);
        for (let i = 0; i < cnt; i++) {
          const w = (vo + i) * 4;
          alb[w] = r; alb[w + 1] = g; alb[w + 2] = b; alb[w + 3] = ro;
        }
      }
      if (met) {
        const m = Math.round(Math.max(0, Math.min(1, info.metal)) * 255);
        const em = Math.round(Math.max(0, Math.min(1, info.emis || 0)) * 255);
        for (let i = 0; i < cnt; i++) { met[(vo + i) * 2] = m; met[(vo + i) * 2 + 1] = em; }
      }
      if (lit) {
        const L = info.lit;
        const s = L ? Math.max(L[0], L[1], L[2], 1e-6) : 0;
        const r = L ? lin2srgbByte(L[0] / s) : 0, g = L ? lin2srgbByte(L[1] / s) : 0, b = L ? lin2srgbByte(L[2] / s) : 0;
        const a = L ? Math.round(Math.min(1, s / 1.5) * 255) : 0;
        for (let i = 0; i < cnt; i++) { const w = (vo + i) * 4; lit[w] = r; lit[w + 1] = g; lit[w + 2] = b; lit[w + 3] = a; }
      }
      if (lamp) {
        for (let i = 0; i < cnt; i++) lamp[vo + i] = info.lamp;
      }
      if (geom.index) {
        const I = geom.index.array;
        for (let k = 0; k < I.length; k++) idx[io + k] = I[k] + vo;
        io += I.length;
      } else {
        for (let k = 0; k < cnt; k++) idx[io + k] = vo + k;
        io += cnt;
      }
      vo += cnt;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    if (uv) g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    if (alb) g.setAttribute('albedoRough', new THREE.BufferAttribute(alb, 4, true));
    if (met) g.setAttribute('metalFlag', new THREE.BufferAttribute(met, 2, true));
    if (lit) g.setAttribute('litColor', new THREE.BufferAttribute(lit, 4, true));
    if (lamp) g.setAttribute('lampId', new THREE.BufferAttribute(lamp, 1));
    if (wind) g.setAttribute('wind', new THREE.BufferAttribute(wind, 4, true));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeBoundingSphere();
    g.computeBoundingBox();
    this.entries = null;
    return g;
  }
}

// lib: Map(pieceName -> [{ geometry, slot }]); data: witte_world.json
export function mergeInstances(lib, data, { dropDetail = false, farAll = false, swaps = [] } = {}) {
  const builders = new Map();
  const m4 = new THREE.Matrix4();
  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  let tris = 0;
  let placed = 0;
  const missing = new Set();
  for (const row of data.instances) {
    const [pi, ki, px, py, pz, qx, qy, qz, qw, sx, sy, sz, col, flags, lamp, lit] = row;
    const cast = CASTER_KINDS.has(data.kinds[ki]);
    const detail = (flags & 1) === 1;
    if (detail && dropDetail) continue;
    let name = data.pieces[pi];
    // runtime opening swaps (world option openWindows): the window piece -> its see-through variant, back cap dropped
    let swapped = false;
    if (swaps.length) {
      const kind = data.kinds[ki];
      let skip = false;
      for (const sw of swaps) {
        const d2 = (px - sw.pos[0]) ** 2 + (py - sw.pos[1]) ** 2 + (pz - sw.pos[2]) ** 2;
        if (name === sw.from && d2 < 1e-4) { name = sw.to; swapped = true; }
        else if (kind === 'backcap' && d2 < 0.0144) skip = true;
      }
      if (skip) continue;
    }
    if (!swapped && (farAll || (flags & 2)) && lib.has(`${name}__far`)) name = `${name}__far`;
    const prims = lib.get(name);
    if (!prims) { missing.add(name); continue; }
    p.set(px, py, pz);
    q.set(qx, qy, qz, qw);
    s.set(sx, sy, sz);
    const matrix = new THREE.Matrix4().compose(p, q, s);
    const cell = cellOf(pz);
    const piSlot = data.piSlot[name] ?? data.piSlot[name.replace(/__far$/, '')];
    for (const prim of prims) {
      const slot = data.slots[prim.slot] || data.slots.none || { rgb: [0.5, 0.5, 0.5], rough: 0.7, metal: 0, group: 'opaque' };
      let group = slot.group || 'opaque';
      if (group === 'lens') group = 'opaque';
      if (group === 'blade') continue;               // street-name blades: built per sign (index.js buildSigns)
      const c = cast && (group === 'opaque' || group === 'leaves' || group.startsWith('tex:'));
      const key = `${group}|${cell}|${detail ? 1 : 0}|${c ? 1 : 0}`;
      let b = builders.get(key);
      if (!b) { b = new Builder(key, group, cell, detail, c); builders.set(key, b); }
      const rgb = (piSlot && prim.slot === piSlot && col) ? col : slot.rgb;
      // window glazing is flat and faces the street: one normal per pane (robust to decimated far LODs)
      let flatN = null;
      if (prim.slot === 'M_FX_GlassInterior' || prim.slot === 'M_Window_Glass') {
        fwd.set(0, 0, -1).applyQuaternion(q);
        flatN = [fwd.x, fwd.y, fwd.z];
      }
      b.add(prim.geometry, matrix, { rgb, rough: slot.rough, metal: slot.metal, emis: slot.emis, lamp: lamp ?? -1, lit, flatN });
      tris += (prim.geometry.index ? prim.geometry.index.count : prim.geometry.attributes.position.count) / 3;
    }
    placed++;
  }
  const out = [];
  for (const b of builders.values()) out.push({ group: b.group, cell: b.cell, detail: b.detail, cast: b.cast, geometry: b.build() });
  m4.identity();
  return { meshes: out, tris, placed, missing: [...missing] };
}
