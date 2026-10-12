// Small things on the jungle floor, many parts each: fallen logs (a bark-ringed, broken trunk with moss
// cushions and shelves of bracket fungus), clusters of little mushrooms, leaf litter of shed frond pieces
// under the trees, and pebbles along the stream banks. All instanced; placed from the terrain and kept
// off water, the cabin and the den, and away from the routes' blocked cells (logs are obstacles).
import {
  Group, InstancedMesh, BufferGeometry, BufferAttribute, MeshStandardMaterial, IcosahedronGeometry,
  CylinderGeometry, SphereGeometry, Matrix4, Quaternion, Vector3, Euler, Color, DoubleSide,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const M = new Matrix4(), Q = new Quaternion(), P = new Vector3(), S = new Vector3(), E = new Euler();

// paint a geometry one colour (as vertex colour), optionally darkened by a function of position
function tint(g, col, shade = () => 1) {
  const p = g.attributes.position, c = new Float32Array(p.count * 3), v = new Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = shade(v);
    c[i * 3] = col.r * k;
    c[i * 3 + 1] = col.g * k;
    c[i * 3 + 2] = col.b * k;
  }
  g.setAttribute('color', new BufferAttribute(c, 3));
  if (g.index) return g.toNonIndexed();
  return g;
}

function strip(g) {
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k);
  return g;
}

// a fallen log along +x, length 1, lying on the ground: bark rings, a broken end, moss, bracket fungi
function logGeometry(rnd) {
  const parts = [];
  const bark = new Color(0.2, 0.13, 0.08), moss = new Color(0.17, 0.3, 0.08), wood = new Color(0.5, 0.38, 0.24);
  const body = new CylinderGeometry(0.075, 0.09, 1, 14, 10, true);
  body.rotateZ(Math.PI / 2);
  // knobbly: push vertices in and out
  const pp = body.attributes.position;
  for (let i = 0; i < pp.count; i++) {
    const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i);
    const k = 1 + 0.08 * Math.sin(x * 23 + Math.atan2(z, y) * 3) + 0.05 * Math.sin(x * 61);
    pp.setY(i, y * k);
    pp.setZ(i, z * k);
  }
  body.computeVertexNormals();
  parts.push(tint(body, bark, (v) => (0.7 + 0.5 * (0.5 + 0.5 * Math.sin(v.x * 70))) * (v.y > 0.03 ? 1 : 0.7)));
  // broken ends: pale wood discs
  for (const sx of [-0.5, 0.5]) {
    const end = new CylinderGeometry(0.08, 0.08, 0.01, 14);
    end.rotateZ(Math.PI / 2);
    end.translate(sx, 0, 0);
    parts.push(tint(end, wood, (v) => 0.7 + 0.3 * Math.sin(Math.hypot(v.y, v.z) * 120)));
  }
  // moss cushions along the top
  for (let i = 0; i < 9; i++) {
    const m = new SphereGeometry(0.035 + rnd() * 0.03, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2);
    m.scale(1.4, 0.5, 1.1);
    m.translate(-0.42 + rnd() * 0.84, 0.065, (rnd() - 0.5) * 0.05);
    parts.push(tint(m, moss, () => 0.75 + rnd() * 0.5));
  }
  // bracket fungi: shelves stepping up the side
  for (let i = 0; i < 7; i++) {
    const f = new SphereGeometry(0.025 + rnd() * 0.02, 10, 4, 0, Math.PI, 0, Math.PI / 2);
    f.scale(1.3, 0.35, 1);
    f.rotateY(Math.PI / 2);
    const side = rnd() < 0.5 ? -1 : 1;
    f.rotateY(side < 0 ? Math.PI : 0);
    f.translate(-0.4 + rnd() * 0.8, -0.02 + rnd() * 0.06, side * 0.085);
    parts.push(tint(f, new Color(0.62, 0.42, 0.2), (v) => 0.75 + 0.35 * Math.sin(v.y * 200)));
  }
  return mergeGeometries(parts.map(strip));
}

// a little mushroom: stem and a cap, about 1 unit tall
function mushroomGeometry() {
  const stem = new CylinderGeometry(0.07, 0.1, 0.7, 8);
  stem.translate(0, 0.35, 0);
  const cap = new SphereGeometry(0.32, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  cap.scale(1, 0.6, 1);
  cap.translate(0, 0.65, 0);
  const gills = new CylinderGeometry(0.31, 0.12, 0.04, 12);
  gills.translate(0, 0.64, 0);
  return mergeGeometries([
    strip(tint(stem, new Color(0.85, 0.8, 0.68))),
    strip(tint(cap, new Color(0.7, 0.42, 0.2), (v) => 0.8 + 0.4 * (v.y - 0.65))),
    strip(tint(gills, new Color(0.9, 0.82, 0.66))),
  ]);
}

// a shed frond piece for the litter: a short stem with a few brown leaflets, flat
function litterGeometry() {
  const parts = [];
  const stem = new CylinderGeometry(0.01, 0.01, 1, 3);
  stem.rotateZ(Math.PI / 2);
  parts.push(strip(tint(stem, new Color(0.3, 0.2, 0.1))));
  for (let i = 0; i < 7; i++) {
    for (const s of [-1, 1]) {
      const leaf = new SphereGeometry(0.1, 5, 2);
      leaf.scale(1.4 - i * 0.12, 0.08, 0.45);
      leaf.rotateY(s * 0.9);
      leaf.translate(-0.4 + i * 0.13, 0, s * 0.08);
      parts.push(strip(tint(leaf, new Color(0.42, 0.28, 0.13), () => 0.8 + Math.random() * 0.4)));
    }
  }
  return mergeGeometries(parts);
}

export class GroundCover {
  constructor(ctx, flora, rand) {
    this.ctx = ctx;
    this.group = new Group();
    this.group.name = 'groundcover';
    this.obstacles = [];
    const tier = ctx.quality?.tier ?? 1;
    const T = ctx.terrain, box = ctx.box;
    const water = (x, z) => Math.max(T.lakeMask(x, z), T.riverMask(x, z));
    const den = window.__jtDen, cabin = T.shape?.CABIN;
    const clear = (x, z, r) =>
      Math.abs(x) < box.halfW - 0.4 && Math.abs(z) < box.halfD - 0.4 && water(x, z) < 0.05 &&
      !(den && Math.abs(x - den.x) < 2.2 && Math.abs(z - den.z) < 1.8) &&
      !(cabin && Math.hypot(x - cabin.x, z - cabin.z) < (cabin.padRadius || 0.75) + r);
    const mat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0, side: DoubleSide });

    // fallen logs
    const logs = [];
    for (let t = 0; t < 4000 && logs.length < (tier === 0 ? 5 : 9); t++) {
      const x = (rand() * 2 - 1) * 7.6, z = (rand() * 2 - 1) * 3.2, rot = rand() * Math.PI;
      const len = 0.5 + rand() * 0.6;
      const ex = Math.cos(rot) * len * 0.5, ez = -Math.sin(rot) * len * 0.5;
      if (!clear(x, z, len) || !clear(x + ex, z + ez, 0.2) || !clear(x - ex, z - ez, 0.2)) continue;
      if (T.slope(x, z) > 0.2 || Math.abs(T.height(x + ex, z + ez) - T.height(x - ex, z - ez)) > len * 0.25) continue;
      if (logs.some((l) => Math.hypot(l.x - x, l.z - z) < 1.2)) continue;
      logs.push({ x, z, rot, len });
    }
    if (logs.length) {
      const im = new InstancedMesh(logGeometry(rand), mat, logs.length);
      logs.forEach((l, i) => {
        const y = (T.height(l.x + Math.cos(l.rot) * l.len * 0.5, l.z - Math.sin(l.rot) * l.len * 0.5) + T.height(l.x - Math.cos(l.rot) * l.len * 0.5, l.z + Math.sin(l.rot) * l.len * 0.5)) / 2;
        E.set(0, l.rot, 0);
        M.compose(P.set(l.x, y + 0.04, l.z), Q.setFromEuler(E), S.set(l.len, 0.9 + rand() * 0.3, 0.9 + rand() * 0.3));
        im.setMatrixAt(i, M);
        for (let k = -1; k <= 1; k++) this.obstacles.push({ x: l.x + Math.cos(l.rot) * l.len * 0.33 * k, z: l.z - Math.sin(l.rot) * l.len * 0.33 * k, r: 0.09 });
      });
      im.castShadow = im.receiveShadow = true;
      im.name = 'groundcover-logs';
      this.group.add(im);
    }

    // mushroom clusters: at log ends and under the tree ferns
    const shrooms = [];
    const near = [...logs.map((l) => ({ x: l.x, z: l.z, r: l.len * 0.6 })), ...(flora.placements.treefern || []).slice(0, 30).map((p) => ({ x: p.x, z: p.z, r: 0.2 }))];
    for (const c of near) {
      if (rand() < 0.35) continue;
      const n = 3 + Math.floor(rand() * 6), a0 = rand() * 6.28, cx = c.x + Math.cos(a0) * c.r, cz = c.z + Math.sin(a0) * c.r;
      if (!clear(cx, cz, 0.1)) continue;
      for (let k = 0; k < n; k++) {
        const x = cx + (rand() - 0.5) * 0.08, z = cz + (rand() - 0.5) * 0.08;
        shrooms.push({ x, z, s: 0.012 + rand() * 0.018, tilt: (rand() - 0.5) * 0.4, rot: rand() * 6.28 });
      }
    }
    if (shrooms.length) {
      const im = new InstancedMesh(mushroomGeometry(), mat, shrooms.length);
      shrooms.forEach((m, i) => {
        E.set(m.tilt, m.rot, m.tilt * 0.5);
        M.compose(P.set(m.x, T.height(m.x, m.z) - 0.002, m.z), Q.setFromEuler(E), S.setScalar(m.s));
        im.setMatrixAt(i, M);
        const v = 0.75 + rand() * 0.4;
        im.setColorAt(i, new Color(v, v * (0.92 + rand() * 0.1), v * 0.9));
      });
      im.receiveShadow = true;
      im.name = 'groundcover-mushrooms';
      this.group.add(im);
    }

    // leaf litter: shed frond pieces lying under the trees
    const litter = [];
    const trees = [...(flora.placements.treefern || []), ...(flora.placements.cycad || []), ...(flora.placements.araucaria || [])];
    const per = tier === 0 ? 10 : 24;
    for (const t of trees) {
      for (let k = 0; k < per; k++) {
        const a = rand() * 6.28, r = 0.08 + Math.sqrt(rand()) * 0.5;
        const x = t.x + Math.cos(a) * r, z = t.z + Math.sin(a) * r;
        if (!clear(x, z, 0) || T.slope(x, z) > 0.45) continue;
        litter.push({ x, z, rot: rand() * 6.28, s: 0.05 + rand() * 0.06 });
      }
    }
    if (litter.length) {
      const im = new InstancedMesh(litterGeometry(), mat, litter.length);
      const n = new Vector3();
      litter.forEach((l, i) => {
        T.normal ? T.normal(l.x, l.z, n) : n.set(0, 1, 0);
        Q.setFromUnitVectors(new Vector3(0, 1, 0), n.normalize ? n.normalize() : n);
        const q2 = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), l.rot);
        M.compose(P.set(l.x, T.height(l.x, l.z) + 0.003, l.z), Q.multiply(q2), S.setScalar(l.s));
        im.setMatrixAt(i, M);
        const v = 0.7 + rand() * 0.6;
        im.setColorAt(i, new Color(v * (0.9 + rand() * 0.25), v * (0.8 + rand() * 0.2), v * 0.7));
      });
      im.receiveShadow = true;
      im.name = 'groundcover-litter';
      this.group.add(im);
    }

    // pebbles along the stream and the pool's banks
    const pebbles = [];
    for (let t = 0; t < 30000 && pebbles.length < (tier === 0 ? 250 : 650); t++) {
      const x = (rand() * 2 - 1) * 7.8, z = (rand() * 2 - 1) * 3.6;
      const w = water(x + 0.12, z) + water(x - 0.12, z) + water(x, z + 0.12) + water(x, z - 0.12);
      if (water(x, z) > 0.4 || w < 0.4 || !clear(x, z, 0) && water(x, z) >= 0.05) continue;
      if (den && Math.abs(x - den.x) < 2 && Math.abs(z - den.z) < 1.6) continue;
      pebbles.push({ x, z, s: 0.008 + rand() * 0.02 });
    }
    if (pebbles.length) {
      const g = new IcosahedronGeometry(1, 1);
      const im = new InstancedMesh(g, new MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0 }), pebbles.length);
      pebbles.forEach((p, i) => {
        E.set(rand() * 3, rand() * 6.28, rand() * 3);
        M.compose(P.set(p.x, T.height(p.x, p.z) + p.s * 0.2, p.z), Q.setFromEuler(E), S.set(p.s * (1 + rand() * 0.6), p.s * 0.55, p.s));
        im.setMatrixAt(i, M);
        const v = 0.3 + rand() * 0.35;
        im.setColorAt(i, new Color(v * (1 + rand() * 0.2), v * (0.95 + rand() * 0.1), v * 0.9));
      });
      im.receiveShadow = true;
      im.name = 'groundcover-pebbles';
      this.group.add(im);
    }
    ctx.scene.add(this.group);
  }
}
