// The front pool and its shore, after the reptile terrarium's basin:
//   - eelgrass: clumps of long ribbon blades rooted on the pool bed, leaning in the current and
//     streaming in a slow travelling wave, all in one merged mesh swayed in the vertex shader;
//   - stones on the bed: lumpy, squashed icosahedra, darker and greener than the dry rocks;
//   - mossy boulders around the shore: moss grows where the surface faces up (normal.y), broken up by
//     noise, the way the bearded dragon's rocks are shaded.
// Everything is placed from the terrain's own lake mask and heights, so it follows the Weatherglass
// pool wherever it is. Water level is y = 0.
import {
  Group, Mesh, InstancedMesh, BufferGeometry, BufferAttribute, IcosahedronGeometry, MeshStandardMaterial,
  Matrix4, Quaternion, Vector3, Euler, Color, DoubleSide, CircleGeometry,
} from 'three';

const WATER_Y = 0;
// lip -> foot of each river cascade, with the water height at the foot; must match the 'tiered
// cascades' spline in tools/build-page.mjs
const CASCADES = [
  { lip: { x: -1.12, z: -0.98 }, foot: { x: -0.95, z: -0.78, y: 0.7 } },
  { lip: { x: -0.45, z: -0.2 }, foot: { x: -0.28, z: 0, y: 0.42 } },
  { lip: { x: 0.45, z: 0.62 }, foot: { x: 0.62, z: 0.78, y: 0.17 } },
];

function hash3(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

// a lumpy rock: an icosahedron pushed in and out by smooth noise, moss in the vertex colours
function rockGeometry(seed, mossy, wet) {
  const g = new IcosahedronGeometry(1, 3);
  const p = g.attributes.position;
  const v = new Vector3();
  const lump = (x, y, z) =>
    0.16 * Math.sin(x * 2.1 + seed) * Math.cos(z * 1.7 - seed * 0.7) +
    0.09 * Math.sin(y * 3.3 + x * 1.3 + seed * 1.9) +
    0.05 * Math.sin(z * 5.1 + y * 4.2 + seed * 2.7);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const r = 1 + lump(v.x, v.y, v.z);
    v.multiplyScalar(r);
    v.y *= 0.62; // squashed: rocks lie on their broad side
    if (v.y < -0.25) v.y = -0.25 + (v.y + 0.25) * 0.3; // flattened underside sits in the ground
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const n = g.attributes.normal;
  const col = new Float32Array(p.count * 3);
  const rock = wet ? new Color(0x4f5148) : new Color(0x77736a);
  const rock2 = wet ? new Color(0x3c4238) : new Color(0x5d5a54);
  const moss = wet ? new Color(0x3d5a2a) : new Color(0x4f7a2c);
  const moss2 = wet ? new Color(0x2c4420) : new Color(0x6f9437);
  const c = new Color();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const ny = n.getY(i);
    const f = hash3(Math.round(v.x * 6), Math.round(v.y * 6), Math.round(v.z * 6) + seed);
    const fbm = 0.5 + 0.5 * Math.sin(v.x * 3.1 + seed) * Math.sin(v.z * 2.7 + v.y * 1.9);
    c.copy(rock).lerp(rock2, f * 0.7);
    if (mossy) {
      const up = Math.min(1, Math.max(0, (ny - 0.35) / 0.5));
      const m = Math.min(1, Math.max(0, (up * 0.75 + fbm * 0.55 - 0.55) / 0.2));
      c.lerp(moss.clone().lerp(moss2, f), m);
    }
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new BufferAttribute(col, 3));
  return g;
}

export class Aquatic {
  constructor(ctx, rand) {
    this.ctx = ctx;
    this.rand = rand;
    this.group = new Group();
    this.group.name = 'aquatic';
    this.obstacles = [];
    this.uniforms = { uTime: { value: 0 } };
    const tier = ctx.quality?.tier ?? 1;
    const T = ctx.terrain;
    const box = ctx.box;
    // candidate spots on the pool bed (deep enough for a blade) and around its shore
    const bed = [], shore = [];
    const zMax = box.halfD - 0.12; // stay clear of the front glass and its cut-away section
    for (let x = -box.halfW; x <= box.halfW; x += 0.08) {
      for (let z = -box.halfD; z <= zMax; z += 0.08) {
        const lake = T.lakeMask(x, z);
        const h = T.height(x, z);
        if (lake > 0.7 && WATER_Y - h > 0.12) bed.push({ x, z, depth: WATER_Y - h, h });
        else if (lake < 0.25 && h > WATER_Y + 0.01 && h < WATER_Y + 0.25) {
          // on the bank: some lake within a short reach
          let near = 0;
          for (const [dx, dz] of [[0.25, 0], [-0.25, 0], [0, 0.25], [0, -0.25]]) near = Math.max(near, T.lakeMask(x + dx, z + dz));
          if (near > 0.6 && z < zMax - 0.1) shore.push({ x, z, h });
        }
      }
    }
    this.buildEelgrass(bed, [60, 110, 160][Math.min(2, tier)] ?? 110);
    this.buildStones(bed, shore, tier);
    this.buildCascadeRocks();
    ctx.scene.add(this.group);
  }

  pick(list, n, minGap) {
    const out = [];
    const rand = this.rand;
    for (let tries = 0; tries < n * 30 && out.length < n && list.length; tries++) {
      const c = list[Math.floor(rand() * list.length)];
      if (out.every((o) => (o.x - c.x) ** 2 + (o.z - c.z) ** 2 > minGap * minGap)) out.push(c);
    }
    return out;
  }

  buildEelgrass(bed, clumps) {
    const rand = this.rand;
    const spots = this.pick(bed, clumps, 0.1);
    const SEG = 7;
    const pos = [], col = [], tAttr = [], ph = [], idx = [];
    const base = new Color(0x2f4a1e), tip = new Color(0x7c9a3a), c = new Color();
    let vi = 0;
    for (const s of spots) {
      const blades = 8 + Math.floor(rand() * 7);
      const tint = 0.85 + rand() * 0.3;
      for (let b = 0; b < blades; b++) {
        const a = rand() * Math.PI * 2;
        const ox = s.x + Math.cos(a) * rand() * 0.035, oz = s.z + Math.sin(a) * rand() * 0.035;
        const len = Math.min(s.depth * (0.75 + rand() * 0.55), s.depth - 0.03);
        const pitch = 1.15 + rand() * 0.35; // from the horizontal: most blades stand fairly upright
        const lean = Math.cos(pitch), up = Math.sin(pitch);
        const w = 0.008 + rand() * 0.006;
        const dir = a + (rand() - 0.5) * 0.6; // lean outwards from the clump
        const dx = Math.cos(dir), dz = Math.sin(dir);
        const wx = -dz, wz = dx; // ribbon width across the lean
        const phase = rand() * 6.28 + s.x * 2 + s.z * 3;
        for (let i = 0; i <= SEG; i++) {
          const t = i / SEG;
          // blades arc over as they rise
          const along = len * t;
          const droop = t * t * len * 0.25;
          const cx = ox + dx * along * lean + dx * droop;
          const cy = s.h + along * up - droop * 0.6;
          const cz = oz + dz * along * lean + dz * droop;
          const ww = w * (1 - t * 0.7);
          pos.push(cx - wx * ww, cy, cz - wz * ww, cx + wx * ww, cy, cz + wz * ww);
          c.copy(base).lerp(tip, t).multiplyScalar(tint);
          col.push(c.r, c.g, c.b, c.r, c.g, c.b);
          tAttr.push(t, t);
          ph.push(phase, phase);
          if (i < SEG) {
            const k = vi + i * 2;
            idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
          }
        }
        vi += (SEG + 1) * 2;
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('color', new BufferAttribute(new Float32Array(col), 3));
    g.setAttribute('aT', new BufferAttribute(new Float32Array(tAttr), 1));
    g.setAttribute('aPh', new BufferAttribute(new Float32Array(ph), 1));
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0, side: DoubleSide });
    const U = this.uniforms;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = U.uTime;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;\nattribute float aT;\nattribute float aPh;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
  // a slow current along +x with a wave travelling up each blade; tips move most
  float tt = aT * aT;
  float wave = sin(uTime * 0.9 + aPh - aT * 3.2);
  transformed.x += tt * (0.035 + 0.03 * wave);
  transformed.z += tt * 0.025 * sin(uTime * 0.7 + aPh * 1.3 - aT * 2.6);
  transformed.y -= tt * 0.012 * (1.0 + wave);`,
        );
    };
    this.eelgrass = new Mesh(g, m);
    this.eelgrass.name = 'aquatic-eelgrass';
    this.eelgrass.frustumCulled = false;
    this.group.add(this.eelgrass);
  }

  buildStones(bed, shore, tier) {
    const rand = this.rand;
    const M = new Matrix4(), q = new Quaternion(), e = new Euler(), sc = new Vector3(), p = new Vector3();
    const variants = 4;
    // stones on the pool bed
    const bedSpots = this.pick(bed, [24, 40, 56][Math.min(2, tier)] ?? 40, 0.09);
    const wetMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0 });
    const dryMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 });
    const place = (spots, mossy, wet, size, sink, obstacle) => {
      const groups = Array.from({ length: variants }, () => []);
      spots.forEach((s, i) => groups[i % variants].push(s));
      groups.forEach((list, v) => {
        if (!list.length) return;
        const mesh = new InstancedMesh(rockGeometry(v * 3.7 + (wet ? 11 : 0), mossy, wet), wet ? wetMat : dryMat, list.length);
        mesh.name = `aquatic-${wet ? 'stone' : 'boulder'}-${v}`;
        mesh.castShadow = !wet;
        mesh.receiveShadow = true;
        list.forEach((s, i) => {
          const r = size[0] + rand() * (size[1] - size[0]);
          e.set((rand() - 0.5) * 0.3, rand() * 6.28, (rand() - 0.5) * 0.3);
          q.setFromEuler(e);
          sc.set(r * (0.8 + rand() * 0.5), r * (0.7 + rand() * 0.6), r * (0.8 + rand() * 0.5));
          p.set(s.x, s.h - r * sink, s.z);
          M.compose(p, q, sc);
          mesh.setMatrixAt(i, M);
          if (obstacle && r > 0.05) this.obstacles.push({ x: s.x, z: s.z, r: r * 0.8 });
        });
        this.group.add(mesh);
      });
    };
    place(bedSpots, true, true, [0.03, 0.08], 0.25, false);
    // mossy boulders around the bank, with a few big ones
    const shoreSpots = this.pick(shore, [10, 16, 22][Math.min(2, tier)] ?? 16, 0.22);
    place(shoreSpots, true, false, [0.07, 0.19], 0.3, true);
  }

  // mossy rocks shouldering each cascade's lip and foot, as in the concept's stepped falls
  buildCascadeRocks() {
    const T = this.ctx.terrain, rand = this.rand;
    const spots = [];
    for (const c of CASCADES) {
      let dx = c.foot.x - c.lip.x, dz = c.foot.z - c.lip.z;
      const l = Math.hypot(dx, dz);
      dx /= l; dz /= l;
      const px = -dz, pz = dx;
      for (const side of [1, -1]) {
        for (const [at, off, r] of [[0, 0.2, 0.085], [0.15, 0.25, 0.06], [1, 0.24, 0.07], [-0.25, 0.27, 0.055]]) {
          const x = c.lip.x + dx * l * at + px * side * (off + rand() * 0.04);
          const z = c.lip.z + dz * l * at + pz * side * (off + rand() * 0.04);
          spots.push({ x, z, h: T.height(x, z), r: r * (0.8 + rand() * 0.45) });
        }
      }
    }
    const M = new Matrix4(), q = new Quaternion(), e = new Euler(), sc = new Vector3(), p = new Vector3();
    const mat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 });
    const mesh = new InstancedMesh(rockGeometry(5.3, true, false), mat, spots.length);
    mesh.name = 'aquatic-cascade-rocks';
    mesh.castShadow = mesh.receiveShadow = true;
    spots.forEach((s, i) => {
      e.set((rand() - 0.5) * 0.4, rand() * 6.28, (rand() - 0.5) * 0.4);
      q.setFromEuler(e);
      sc.set(s.r * (0.9 + rand() * 0.4), s.r * (0.9 + rand() * 0.5), s.r * (0.9 + rand() * 0.4));
      p.set(s.x, s.h - s.r * 0.2, s.z);
      M.compose(p, q, sc);
      mesh.setMatrixAt(i, M);
      this.obstacles.push({ x: s.x, z: s.z, r: s.r * 0.7 });
    });
    this.group.add(mesh);
  }

  // churned white water at the foot of each cascade: Weatherglass's own plunge-pool foam shader
  // (its vertex shader takes positions in world space, so the discs are built where they sit)
  buildFoam() {
    const src = this.ctx.scene.getObjectByName('water:plunge-pool');
    if (!src) return false;
    for (const c of CASCADES) {
      const g = new CircleGeometry(0.15, 32);
      g.rotateX(-Math.PI / 2);
      g.translate(c.foot.x, c.foot.y + 0.008, c.foot.z);
      const m = new Mesh(g, src.material);
      m.name = 'aquatic-cascade-foam';
      m.renderOrder = src.renderOrder + 0.001;
      m.frustumCulled = false;
      this.ctx.scene.add(m);
    }
    return true;
  }

  update(dt) {
    this.uniforms.uTime.value += dt;
    if (!this.foamed) this.foamed = this.buildFoam();
  }
}
