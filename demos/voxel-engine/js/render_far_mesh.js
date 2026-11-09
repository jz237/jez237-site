// The far field's mesh, built once from the block vx_scene_far hands over
// (engine/src/scene/far.rs has its layout). No GL here: render_far.js
// uploads what this returns, and engine/tests/far_mesh.mjs checks it in
// Node.
//
// Everything is a quad of four vertices: a face of a box, a cell of the
// terrain, a pane of a cut-out. Faces another box covers are left out.
// Quads are ordered by distance from the live box, so a tier draws a
// prefix; the ground (terrain, apron, horizon) is in every prefix and
// comes after the boxes within `GROUND_AT` metres, which stand on most
// of what a player sees of it: drawn first, it was shaded and then
// covered (two screens of far pixels for 0.65 shown in the high-rise).

// Words in the block's header, per box and per skin.
export const HEAD = 16, STRIDE = 8, SKIN = 12, QUAD = 13;
// scene::far::kind.
export const KIND = { SOLID: 0, GROUND: 1, BUILDING: 2, FLAT: 3, HORIZON: 4, CUTOUT: 5 };
// Bytes per vertex: position (3 floats, metres), a tint (sRGB) and what
// the face is (alpha: a material id for a plain face, which the shader
// draws in that material's own surface pattern; 0 for a face that wears a
// picture; 255 for a cut-out's pane), normal (signed bytes), where in the
// atlas (2 normalised u16).
export const VERTEX = 24;
const VOXEL = 0.1;
// Where the ground comes in the order of quads (m from the box): the
// shortest reach any tier draws.
export const GROUND_AT = 150;
// The terrain's heights are in this fraction of a voxel.
const HEIGHT_UNIT = 256;

// Faces of a box: axis, side (0 = min, 1 = max), and the two axes it spans
// (the first along the quad's corners 0 -> 1, the second along 0 -> 2).
const FACES = [[0, 0, 2, 1], [0, 1, 1, 2], [1, 1, 2, 0], [2, 0, 1, 0], [2, 1, 0, 1], [1, 0, 0, 2]];

// Where each section of the block starts, from its header.
export function layout(block) {
  const boxes = block[0], skins = block[5], aw = block[6], ah = block[7], nx = block[8], nz = block[9];
  const cells = nx > 1 && nz > 1 ? (nx - 1) * (nz - 1) : 0;
  const skinAt = HEAD + boxes * STRIDE, paletteAt = skinAt + skins * SKIN, xsAt = paletteAt + 256, zsAt = xsAt + nx;
  const free = block[11];
  const heightsAt = zsAt + nz, cellsAt = heightsAt + nx * nz, freeAt = cellsAt + cells, atlasAt = freeAt + free * QUAD;
  return { boxes, skins, aw, ah, nx, nz, cells, free, skinAt, paletteAt, xsAt, zsAt, heightsAt, cellsAt, freeAt, atlasAt, length: atlasAt + aw * ah };
}

// block: Int32Array. Returns null for a scene without a far field, else
// { verts (bytes of the vertices in use), quads, dist (Float32Array, a
// quad: metres from the box, ascending), atlas { w, h, pixels }, reach,
// size [x, z], high (m: the top of everything), canyon (m), land (the
// quads that are terrain and what lies on it: from, to) }.
export function farMesh(block) {
  if (!block || block.length < HEAD) return null;
  const L = layout(block);
  if (!L.boxes && !L.cells && !L.free) return null;
  const sx = block[2], sz = block[4];
  // (A box with a pitched roof is eight quads.)
  const maxQuads = L.boxes * 8 + L.cells + L.free;
  const buf = new ArrayBuffer(maxQuads * 4 * VERTEX), f32 = new Float32Array(buf), u8 = new Uint8Array(buf), i8 = new Int8Array(buf), u16 = new Uint16Array(buf);
  const dist = new Float32Array(maxQuads);
  let q = 0, high = 0;
  // (The white square every face without a picture reads: its middle.)
  const plainU = (8 + 2) / L.aw * 65535, plainV = (8 + 2) / L.ah * 65535;
  // Vertex c of quad q: position in voxels, normal as -1..1, the material
  // as its place in the palette (four times its id; -1 for a face that
  // wears a picture), the atlas in texels.
  // (`open`: the box being laid is open work, scene::far::OPEN: 127 or
  // 100 in the byte beside its normal, for the shadow passes; -127: a
  // step of the land one voxel high.)
  let open = 0;
  const put = (c, x, y, z, nx, ny, nz, p, cut, tu, tv) => {
    const v = (q * 4 + c) * VERTEX;
    f32[v >> 2] = x * VOXEL; f32[(v >> 2) + 1] = y * VOXEL; f32[(v >> 2) + 2] = z * VOXEL;
    u8[v + 12] = 255; u8[v + 13] = 255; u8[v + 14] = 255;
    u8[v + 15] = cut ? 255 : p < 0 ? 0 : Math.min(p >> 2, 254);
    i8[v + 16] = Math.round(nx * 127); i8[v + 17] = Math.round(ny * 127); i8[v + 18] = Math.round(nz * 127); i8[v + 19] = open;
    u16[(v + 20) >> 1] = tu < 0 ? plainU : tu / L.aw * 65535;
    u16[(v + 22) >> 1] = tv < 0 ? plainV : tv / L.ah * 65535;
    if (y * VOXEL > high) high = y * VOXEL;
  };

  // The terrain: one quad a cell that has ground, at every reach. Lit as
  // rolling land, not as the facets it is made of: a corner of a cell
  // takes the mean of the normals of the cells that meet there and lie
  // nearly its own way (the foot of a bank stays a crease). Cell by cell,
  // a field that tilted three degrees more than the next was a rectangle
  // of another tone.
  const CREASE = 0.94;
  const land = [0, 0];
  const ground = () => {
    open = 0;
    land[0] = q;
  // The lattice's normal at each of its points (the mean of the cells
  // with ground around it), for the apron.
  let pointN = null, xs = null, zs = null, ring = 0;
  const cw = L.nx - 1, ch = L.nz - 1;
  if (L.cells) {
    xs = block.subarray(L.xsAt, L.xsAt + L.nx); zs = block.subarray(L.zsAt, L.zsAt + L.nz);
    const h = (i, j) => block[L.heightsAt + i + L.nx * j] / HEIGHT_UNIT;
    const mat = (i, j) => block[L.cellsAt + i + cw * j] & 255;
    // Each cell's own normal: the mean of its two triangles'. (Zero
    // where the cell has no ground.)
    const cellN = new Float32Array(cw * ch * 3);
    for (let j = 0; j < ch; j++) {
      for (let i = 0; i < cw; i++) {
        if (!mat(i, j)) continue;
        const x0 = xs[i], x1 = xs[i + 1], z0 = zs[j], z1 = zs[j + 1];
        const h00 = h(i, j), h10 = h(i + 1, j), h01 = h(i, j + 1), h11 = h(i + 1, j + 1);
        const nx = -((h10 - h00) + (h11 - h01)) * (z1 - z0), nz = -((h01 - h00) + (h11 - h10)) * (x1 - x0), ny = 2 * (x1 - x0) * (z1 - z0);
        const len = Math.hypot(nx, ny, nz) || 1, o = (i + cw * j) * 3;
        cellN[o] = nx / len; cellN[o + 1] = ny / len; cellN[o + 2] = nz / len;
      }
    }
    // The mean over the cells round lattice point (pi, pj) that lie
    // within the crease of `own` (a cell's index times 3; -1: all).
    const out = [0, 1, 0];
    const around = (pi, pj, own) => {
      let nx = 0, ny = 0, nz = 0;
      for (let j = pj - 1; j <= pj; j++) {
        for (let i = pi - 1; i <= pi; i++) {
          if (i < 0 || j < 0 || i >= cw || j >= ch) continue;
          const o = (i + cw * j) * 3;
          if (own >= 0 && cellN[o] * cellN[own] + cellN[o + 1] * cellN[own + 1] + cellN[o + 2] * cellN[own + 2] < CREASE) continue;
          nx += cellN[o]; ny += cellN[o + 1]; nz += cellN[o + 2];
        }
      }
      const len = Math.hypot(nx, ny, nz);
      if (len > 1e-6) { out[0] = nx / len; out[1] = ny / len; out[2] = nz / len; } else { out[0] = 0; out[1] = 1; out[2] = 0; }
      return out;
    };
    pointN = new Float32Array(L.nx * L.nz * 3);
    for (let pj = 0; pj < L.nz; pj++) {
      for (let pi = 0; pi < L.nx; pi++) pointN.set(around(pi, pj, -1), (pi + L.nx * pj) * 3);
    }
    for (let k = 0; k < L.nx; k++) { if (xs[k] > sx) { ring = xs[k] - sx; break; } }
    for (let j = 0; j < ch; j++) {
      for (let i = 0; i < cw; i++) {
        const m = mat(i, j);
        if (!m) continue;
        const own = (i + cw * j) * 3;
        for (let c = 0; c < 4; c++) {
          const pi = i + (c >> 1), pj = j + (c & 1), n = around(pi, pj, own);
          put(c, xs[pi], h(pi, pj), zs[pj], n[0], n[1], n[2], m * 4, false, -1, -1);
        }
        dist[q++] = GROUND_AT;
      }
    }
  }
  // The lattice's normal at a point (voxels), between its points'.
  const at = [0, 1, 0];
  const cellOf = (v, c) => { let k = 0; while (k + 2 < v.length && v[k + 1] <= c) k++; return k; };
  const latN = (x, z) => {
    const i = cellOf(xs, x), j = cellOf(zs, z);
    const u = Math.min(Math.max((x - xs[i]) / (xs[i + 1] - xs[i]), 0), 1), w = Math.min(Math.max((z - zs[j]) / (zs[j + 1] - zs[j]), 0), 1);
    for (let k = 0; k < 3; k++) {
      const a = pointN[(i + L.nx * j) * 3 + k], b = pointN[(i + 1 + L.nx * j) * 3 + k], c = pointN[(i + L.nx * (j + 1)) * 3 + k], d = pointN[(i + 1 + L.nx * (j + 1)) * 3 + k];
      at[k] = (a * (1 - u) + b * u) * (1 - w) + (c * (1 - u) + d * u) * w;
    }
    return at;
  };

  // The free quads (the terrain's apron, what a scene lays on its
  // ground), at every reach: corners as given. A steep one (the sliver
  // between two ramps, a bank) is lit as the face it is. One that lies (a ramp of
  // the apron, a line painted on a road) is lit as level ground where it
  // touches the box, which is how the live ground beside it is lit
  // whatever its slope (its terraces are level), and as the lattice from
  // the ring on: no ramp is a facet of its own. (A ramp steeper than
  // the crease is a bank, and is lit as one.)
  for (let k = 0; k < L.free; k++) {
    const o = L.freeAt + k * QUAD, m = block[o + 12] & 255;
    const c = (i) => block[o + i] / HEIGHT_UNIT;
    let nx = (c(4) - c(1)) * (c(8) - c(2)) - (c(5) - c(2)) * (c(7) - c(1));
    let ny = (c(5) - c(2)) * (c(6) - c(0)) - (c(3) - c(0)) * (c(8) - c(2));
    let nz = (c(3) - c(0)) * (c(7) - c(1)) - (c(4) - c(1)) * (c(6) - c(0));
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    const lies = ny > CREASE && pointN !== null;
    // (A step one voxel high between two ramps: marked in the byte
    // beside the normal, -127, for the shader, which draws it as lawn
    // where it is turf. Higher, or of anything else, it is a wall.)
    const ys = [c(1), c(4), c(7), c(10)];
    open = !lies && ny < 0.3 && Math.max(...ys) - Math.min(...ys) <= 1.5 ? -127 : 0;
    for (let v = 0; v < 4; v++) {
      const x = c(v * 3), z = c(v * 3 + 2);
      if (lies) {
        const d = Math.max(0, -x, x - sx, -z, z - sz), w = ring > 0 ? Math.min(d / ring, 1) : 1, n = latN(x, z);
        // (Where the land beyond turns away at once, the foot of a cliff
        // at the ring, the ramp keeps its own.)
        if (n[0] * nx + n[1] * ny + n[2] * nz < CREASE) { n[0] = nx; n[1] = ny; n[2] = nz; }
        const lx = n[0] * w, ly = 1 - w + n[1] * w, lz = n[2] * w, ll = Math.hypot(lx, ly, lz) || 1;
        put(v, x, c(v * 3 + 1), z, lx / ll, ly / ll, lz / ll, m * 4, false, -1, -1);
      } else {
        put(v, x, c(v * 3 + 1), z, nx, ny, nz, m * 4, false, -1, -1);
      }
    }
    open = 0;
    dist[q++] = GROUND_AT;
  }
  land[1] = q;
  };

  // The boxes, nearest first: distance from the box's footprint.
  const order = new Uint32Array(L.boxes), far = new Float32Array(L.boxes);
  for (let i = 0; i < L.boxes; i++) {
    const o = HEAD + i * STRIDE;
    const dx = Math.max(0, block[o] - sx, -block[o + 3]), dz = Math.max(0, block[o + 2] - sz, -block[o + 5]);
    // (The horizon is drawn at every reach, with the ground.)
    far[i] = ((block[o + 6] >> 16) & 255) === KIND.HORIZON ? GROUND_AT : Math.hypot(dx, dz) * VOXEL;
    order[i] = i;
  }
  order.sort((a, b) => far[a] - far[b] || a - b);
  // Every face plane with the rectangles of the faces that look at it
  // from the other side: a face wholly inside one of those is covered.
  // (A cut-out is panes, not a solid: it covers nothing.)
  const planes = new Map();
  const key = (axis, side, at) => (at * 6 + axis * 2 + side);
  for (let i = 0; i < L.boxes; i++) {
    const o = HEAD + i * STRIDE;
    if (((block[o + 6] >> 16) & 255) === KIND.CUTOUT) continue;
    for (let f = 0; f < 6; f++) {
      const axis = f >> 1, side = f & 1, u = (axis + 1) % 3, w = (axis + 2) % 3;
      const k = key(axis, side, block[o + axis + side * 3]);
      let list = planes.get(k);
      if (!list) planes.set(k, list = []);
      list.push(block[o + u], block[o + w], block[o + 3 + u], block[o + 3 + w]);
    }
  }
  const covered = (o, axis, side) => {
    const u = (axis + 1) % 3, w = (axis + 2) % 3;
    const list = planes.get(key(axis, 1 - side, block[o + axis + side * 3]));
    if (!list) return false;
    const u0 = block[o + u], w0 = block[o + w], u1 = block[o + 3 + u], w1 = block[o + 3 + w];
    for (let i = 0; i < list.length; i += 4) {
      if (list[i] <= u0 && list[i + 1] <= w0 && list[i + 2] >= u1 && list[i + 3] >= w1) return true;
    }
    return false;
  };
  const corner = [0, 0, 0], normal = [0, 0, 0];
  // A building under a pitched roof: walls to the eaves, two slopes up to
  // a ridge along the middle of the box, a gable at each end. The ridge
  // runs along the front (ridge 1) or across it (2). Faces of the front's
  // axis wear the front's and the rear's pictures, taken face on to the
  // top of the ridge: as eave walls their upper part lies on the slope
  // above them, as gables it fills the triangle.
  const pitched = (o, i, mats, front, skin, ridge, eave) => {
    const fa = front >> 1, ra = fa === 0 ? 2 : 0;
    const rs = fa === 0 ? ((front & 1) ? -1 : 1) : ((front & 1) ? 1 : -1);
    // The axis the roof falls along (its eave walls face it), and the middle.
    const wa = ridge === 1 ? fa : ra;
    const mid = (block[o + wa] + block[o + 3 + wa]) / 2, y0 = block[o + 1], y1 = block[o + 4], ye = y0 + eave;
    const rise = y1 - ye, run = (block[o + 3 + wa] - block[o + wa]) / 2, slant = Math.hypot(rise, run) || 1;
    const pWall = (mats & 255) * 4, pRoof = ((mats >> 8) & 255) * 4;
    for (const [axis, side, a, b] of FACES) {
      if (axis === 1 || covered(o, axis, side)) continue;
      const pic = !skin || axis !== fa ? -1 : side === (front & 1) ? 0 : 1;
      const r = L.skinAt + (skin - 1) * SKIN + pic * 4;
      const isEave = axis === wa;
      // The wall up to the eaves, then what stands on it.
      for (let part = 0; part < 2; part++) {
        normal[0] = normal[1] = normal[2] = 0;
        normal[axis] = side ? 1 : -1;
        if (part === 1 && isEave) { normal[1] = run / slant; normal[axis] *= rise / slant; }
        for (let c = 0; c < 4; c++) {
          const ua = (c & 1) ? 3 : 0, ub = (c >> 1) ? 3 : 0;
          corner[axis] = block[o + axis + side * 3];
          corner[a] = block[o + a + ua];
          corner[b] = block[o + b + ub];
          const up = a === 1 ? (c & 1) : (c >> 1);
          let s = (corner[ra] - block[o + ra]) / (block[o + 3 + ra] - block[o + ra]), t;
          if (part === 0) {
            corner[1] = up ? ye : y0;
            t = up ? eave / (y1 - y0) : 0;
          } else {
            corner[1] = up ? y1 : ye;
            if (up) corner[wa] = mid;
            t = up ? 1 : eave / (y1 - y0);
            // (A gable's apex is the middle of its picture.)
            if (up && !isEave) s = 0.5;
          }
          let tu = -1, tv = -1;
          if (pic >= 0) {
            if ((rs < 0) !== (pic === 1)) s = 1 - s;
            tu = block[r] + s * block[r + 2];
            tv = block[r + 1] + t * block[r + 3];
          }
          put(c, corner[0], corner[1], corner[2], normal[0], normal[1], normal[2], pic >= 0 ? -1 : (part === 1 && isEave ? pRoof : pWall), false, tu, tv);
        }
        dist[q++] = far[i];
      }
    }
  };
  let laid = false;
  for (let n = 0; n < L.boxes; n++) {
    const i = order[n], o = HEAD + i * STRIDE, mats = block[o + 6], kind = (mats >> 16) & 255;
    open = 0;
    if (!laid && (far[i] > GROUND_AT || kind === KIND.HORIZON)) { ground(); laid = true; }
    const front = block[o + 7] & 255, skin = (block[o + 7] >> 8) & 255;
    const hasSkin = skin > 0 && skin <= L.skins;
    if (kind === KIND.CUTOUT) {
      // Two panes through the middle of the box, each seen from both
      // sides, wearing the skin's front; lit as what looks at the sky.
      if (!hasSkin) continue;
      const r = L.skinAt + (skin - 1) * SKIN;
      const x0 = block[o], y0 = block[o + 1], z0 = block[o + 2], x1 = block[o + 3], y1 = block[o + 4], z1 = block[o + 5];
      const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
      const u0 = block[r], v0 = block[r + 1], u1 = u0 + block[r + 2], v1 = v0 + block[r + 3];
      // (Corners 0 -> 1 and 0 -> 2 as on a box's faces: counter-clockwise from outside.)
      for (const [ax, az, bx, bz] of [[x0, mz, x1, mz], [x1, mz, x0, mz], [mx, z1, mx, z0], [mx, z0, mx, z1]]) {
        const flip = ax > bx || az < bz;
        put(0, ax, y0, az, 0, 1, 0, -1, true, flip ? u1 : u0, v0);
        put(1, bx, y0, bz, 0, 1, 0, -1, true, flip ? u0 : u1, v0);
        put(2, ax, y1, az, 0, 1, 0, -1, true, flip ? u1 : u0, v1);
        put(3, bx, y1, bz, 0, 1, 0, -1, true, flip ? u0 : u1, v1);
        dist[q++] = far[i];
      }
      continue;
    }
    const flat = kind === KIND.FLAT || kind === KIND.HORIZON;
    const skinned = kind === KIND.BUILDING && hasSkin && front < 6 && (front >> 1) !== 1;
    const ridge = (block[o + 7] >> 16) & 3, eave = block[o + 7] >> 18;
    // (Open work: which way its boards lie one after the other, the
    // box's longer way: 127 along x, 100 along z.)
    open = kind === KIND.SOLID && ridge === 3 ? (block[o + 3] - block[o] >= block[o + 5] - block[o + 2] ? 127 : 100) : 0;
    if (kind === KIND.BUILDING && ridge && ridge !== 3 && front < 6 && (front >> 1) !== 1 && eave > 0 && eave < block[o + 4] - block[o + 1]) {
      pitched(o, i, mats, front, skinned ? skin : 0, ridge, eave);
      continue;
    }
    // The front's axis, and the viewer's right hand as they face it.
    const fa = front >> 1, ra = fa === 0 ? 2 : 0;
    const rs = fa === 0 ? ((front & 1) ? -1 : 1) : ((front & 1) ? 1 : -1);
    for (const [axis, side, a, b] of FACES) {
      // Undersides: of what stands clear of the ground only (the el's
      // deck), which is what a plain solid is when nothing covers it.
      if ((flat && !(axis === 1 && side)) || (axis === 1 && !side && kind !== KIND.SOLID) || covered(o, axis, side)) continue;
      // (The top face has a material of its own.)
      const p = ((axis === 1 && side ? mats >> 8 : mats) & 255) * 4;
      // Which picture this face wears: front, rear or top.
      const pic = !skinned ? -1 : axis === 1 ? (side ? 2 : -1) : axis !== fa ? -1 : side === (front & 1) ? 0 : 1;
      const r = L.skinAt + (skin - 1) * SKIN + pic * 4;
      normal[0] = normal[1] = normal[2] = 0;
      normal[axis] = side ? 1 : -1;
      for (let c = 0; c < 4; c++) {
        corner[axis] = block[o + axis + side * 3];
        corner[a] = block[o + a + ((c & 1) ? 3 : 0)];
        corner[b] = block[o + b + ((c >> 1) ? 3 : 0)];
        let tu = -1, tv = -1;
        if (pic >= 0) {
          // Along the front from the viewer's left (the rear is seen from
          // the other side), and up the wall or back from the front.
          let s = (corner[ra] - block[o + ra]) / (block[o + 3 + ra] - block[o + ra]);
          if ((rs < 0) !== (pic === 1)) s = 1 - s;
          let t = pic === 2 ? (corner[fa] - block[o + fa]) / (block[o + 3 + fa] - block[o + fa]) : (corner[1] - block[o + 1]) / (block[o + 4] - block[o + 1]);
          if (pic === 2 && (front & 1)) t = 1 - t;
          tu = block[r] + s * block[r + 2];
          tv = block[r + 1] + t * block[r + 3];
        }
        put(c, corner[0], corner[1], corner[2], normal[0], normal[1], normal[2], pic < 0 ? p : -1, false, tu, tv);
      }
      dist[q++] = far[i];
    }
  }
  if (!laid) ground();
  return {
    verts: new Uint8Array(buf, 0, q * 4 * VERTEX), quads: q, dist: dist.subarray(0, q),
    atlas: { w: L.aw, h: L.ah, pixels: new Uint8Array(block.buffer, block.byteOffset + L.atlasAt * 4, L.aw * L.ah * 4) },
    reach: block[1] * VOXEL, size: [sx * VOXEL, sz * VOXEL], high, canyon: block[10] * VOXEL, land,
  };
}
