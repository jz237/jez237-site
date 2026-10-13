// Rockwork, as in the Terramundi reference: the mountains, the stream banks, the cascades and the pool's
// rim are built of stacked, mossy boulders of every size, and the cave mouth is framed by an arch of
// heaped stones with a warm glow inside. Boulders are faceted, lumpy stones (several shapes), moss on the
// faces that look up, darker in the cracks; they sit part-buried in the terrain. Those on walkable ground
// are obstacles for the route finder.
import {
  Group, InstancedMesh, IcosahedronGeometry, BufferAttribute, MeshStandardMaterial, Matrix4, Quaternion, Vector3,
  Euler, Color, PointLight, Mesh, SphereGeometry, MeshBasicMaterial, AdditiveBlending,
} from 'three';
import { guardMaterial } from './safety.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const M = new Matrix4(), Q = new Quaternion(), P = new Vector3(), S = new Vector3(), E = new Euler();

function hash(x, y, z) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

// a faceted, lumpy boulder with moss on its upper faces (vertex colours, linear)
export function boulderGeometry(seed, detail, { flat = 0.88, moss = 1 } = {}) {
  let g = new IcosahedronGeometry(1, detail);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g); // shared vertices: smooth, rounded stone rather than low-poly facets
  const p = g.attributes.position, v = new Vector3();
  const lump = (x, y, z) =>
    0.2 * Math.sin(x * 1.7 + seed) * Math.cos(z * 1.3 - seed * 0.7) + 0.1 * Math.sin(y * 2.9 + x * 1.1 + seed * 1.9) +
    0.05 * Math.sin(z * 5.3 + y * 4.1 + seed * 2.7) + 0.025 * Math.sin(x * 11 + z * 9 + seed) + 0.012 * Math.sin(x * 23 - y * 19 + seed);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    v.multiplyScalar(1 + lump(v.x, v.y, v.z));
    v.y *= flat;
    if (v.y < -0.5) v.y = -0.5 + (v.y + 0.5) * 0.5;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const n = g.attributes.normal, col = new Float32Array(p.count * 3), c = new Color();
  const rockA = new Color(0x837e72).convertSRGBToLinear(), rockB = new Color(0xb2aa98).convertSRGBToLinear();
  const mossA = new Color(0x4a6a28).convertSRGBToLinear(), mossB = new Color(0x7e9e3c).convertSRGBToLinear();
  const crack = new Color(0x34302a).convertSRGBToLinear();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const ny = n.getY(i), f = hash(Math.round(v.x * 6), Math.round(v.y * 6), Math.round(v.z * 6) + seed);
    const noise = 0.5 + 0.5 * Math.sin(v.x * 3.3 + seed) * Math.sin(v.z * 2.9 + v.y * 2.1);
    const cr = Math.max(0, Math.sin(v.x * 9 + seed) * Math.sin(v.z * 8 - v.y * 7)); // fine cracks
    c.copy(rockA).lerp(rockB, f * 0.7 + 0.3 * noise);
    c.lerp(crack, Math.max(ny < -0.3 ? 0.4 : 0, cr > 0.92 ? 0.6 : 0));
    // moss in patches on the tops only: grey stone shows on every flank
    const m = moss * Math.min(1, Math.max(0, (ny - 0.42) / 0.25 + (noise - 0.5) * 1.1)) * (0.55 + 0.45 * f);
    c.lerp(mossA.clone().lerp(mossB, f), m);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new BufferAttribute(col, 3));
  return g;
}

export class Rocks {
  constructor(ctx, rand, { den } = {}) {
    this.ctx = ctx;
    this.group = new Group();
    this.group.name = 'rockwork';
    this.obstacles = [];
    this.tops = [];
    const T = ctx.terrain, box = ctx.box, tier = ctx.quality?.tier ?? 1;
    const k = tier === 0 ? 0.5 : tier === 1 ? 1 : 1.3;
    const water = (x, z) => Math.max(T.lakeMask(x, z), T.riverMask(x, z));
    const inDen = (x, z, m = 0) => den && Math.abs(x - den.x) < 1.45 + m && z > den.z - 1.6 - m && z < den.z + 0.5 + m;
    const cabin = T.shape?.CABIN;
    const nearCabin = (x, z) => cabin && Math.hypot(x - cabin.x, z - cabin.z) < (cabin.padRadius || 0.75) + 0.4;
    const inBox = (x, z, m) => Math.abs(x) < box.halfW - m && Math.abs(z) < box.halfD - m;
    const list = [];
    const onPath = (x, z, s) => window.__jtPathAt?.(x, z, s * 0.8);
    const put = (x, z, s, sink, opt = {}) => !onPath(x, z, s) && list.push({ x, z, s, sink, ...opt });

    // a) the mountainsides: boulders clinging to the steep slopes, bigger lower down
    for (let t = 0, n = 0; t < 40000 && n < 340 * k; t++) {
      const x = (rand() * 2 - 1) * (box.halfW - 0.3), z = (rand() * 2 - 1) * (box.halfD - 0.3);
      const h = T.height(x, z), sl = T.slope(x, z);
      if (h < 0.75 || sl < 0.42 || water(x, z) > 0.1 || inDen(x, z, 0.2) || !inBox(x, z, 0.25)) continue;
      put(x, z, 0.08 + rand() * (h < 1.6 ? 0.3 : 0.18), 0.5);
      n++;
    }
    // b) the stream: boulders lining its banks; c) the pool's rim
    for (let t = 0, n = 0; t < 40000 && n < 170 * k; t++) {
      const x = (rand() * 2 - 1) * (box.halfW - 0.3), z = (rand() * 2 - 1) * (box.halfD - 0.3);
      const rv = T.riverMask(x, z), lk = T.lakeMask(x, z);
      const bank = (rv > 0.12 && rv < 0.5) || (lk > 0.25 && lk < 0.6 && z < box.halfD - 0.45);
      if (!bank || inDen(x, z) || nearCabin(x, z) || !inBox(x, z, 0.3)) continue;
      put(x, z, 0.035 + rand() * 0.1, 0.35, { bank: true });
      n++;
    }
    // d) the cave mouth: rubble heaped against the rock on either side of the opening (never across it)
    this.glowAt = null;
    if (den) {
      const mx = den.x, mz = den.mouth.z;
      for (const side of [-1, 1]) {
        for (let i = 0; i < 14; i++) {
          const x = mx + side * (1.05 + rand() * 0.45), z = mz - 0.15 + rand() * 0.35;
          const lift = Math.max(0, 0.35 - Math.abs(x - mx - side * 1.05) * 0.5) * rand();
          put(x, z, 0.07 + rand() * 0.14, 0.3, { lift });
        }
      }
      this.glowAt = new Vector3(mx, T.height(mx, den.inside.z) + 0.2, den.inside.z);
    }

    // build: a few shapes, two levels of detail by size
    const mat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, flatShading: false });
    const shapes = [0, 1, 2, 3, 4].map((i) => ({ big: boulderGeometry(i * 3.7 + 1, 3), small: boulderGeometry(i * 3.7 + 1, 2) }));
    const buckets = new Map();
    list.forEach((r, i) => {
      const key = (i % shapes.length) + (r.s > 0.12 ? 'b' : 's');
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(r);
    });
    for (const [key, rs] of buckets) {
      const sh = shapes[+key[0]];
      const im = new InstancedMesh(key[1] === 'b' ? sh.big : sh.small, mat, rs.length);
      rs.forEach((r, i) => {
        const y = T.height(r.x, r.z) + (r.lift || 0) - r.s * r.sink;
        E.set((rand() - 0.5) * 0.5, rand() * 6.28, (rand() - 0.5) * 0.5);
        M.compose(P.set(r.x, y, r.z), Q.setFromEuler(E), S.set(r.s * (0.8 + rand() * 0.5), r.s * (0.75 + rand() * 0.55), r.s * (0.8 + rand() * 0.5)));
        // big, fairly level boulders make perches for the Pteranodons
        if (r.s > 0.2 && !r.bank && !r.lift && Math.abs(E.x) < 0.2 && Math.abs(E.z) < 0.2) this.tops.push({ x: r.x, z: r.z, y: y + S.y * 0.8, s: r.s });
        im.setMatrixAt(i, M);
        // walkable-ground boulders block the route finder, except round the cave mouth: the den's
        // way in must stay open (the rubble there is decoration on the flanks)
        const nearMouth = den && Math.abs(r.x - den.x) < 2.4 && r.z > den.z - 1.2 && r.z < den.mouth.z + 1.4;
        // (bank stones are small enough to step over: walling the stream with them would cut the case in two)
        if (!r.lift && !r.bank && !nearMouth && T.slope(r.x, r.z) < 0.35 && r.s > 0.1) this.obstacles.push({ x: r.x, z: r.z, r: r.s * 0.75 });
      });
      im.castShadow = true;
      im.receiveShadow = true;
      im.name = 'rockwork-' + key;
      this.group.add(im);
    }
    ctx.scene.add(this.group);
    // the warm glow inside the cave: glow-fungus clusters on the walls and a soft amber light
    if (this.glowAt) {
      this.light = new PointLight(0xffa04a, 0, 1.6, 2);
      this.light.position.copy(this.glowAt);
      this.group.add(this.light);
      const gm = new MeshBasicMaterial({ color: new Color(1.0, 0.62, 0.25), toneMapped: false, transparent: true, blending: AdditiveBlending, depthWrite: false });
      guardMaterial(gm);
      this.glowMat = gm;
      for (let i = 0; i < 22; i++) {
        const s = new Mesh(new SphereGeometry(0.008 + rand() * 0.01, 6, 4), gm);
        s.position.set(this.glowAt.x + (rand() - 0.5) * 0.9, this.glowAt.y - 0.1 + rand() * 0.5, this.glowAt.z + (rand() - 0.5) * 0.4);
        this.group.add(s);
      }
    }
    this.t = 0;
  }

  update(dt) {
    if (!this.light) return;
    this.t += dt;
    const life = this.ctx.modules.life?.env;
    const dark = Math.min(1, (life?.night ?? 0) + Math.max(life?.dusk || 0, life?.golden || 0) * 0.6);
    const fl = 0.85 + 0.15 * Math.sin(this.t * 2.3) * Math.sin(this.t * 0.7 + 1);
    this.light.intensity = (0.6 + 2.2 * dark) * fl;
    this.glowMat.opacity = (0.45 + 0.55 * dark) * fl;
  }
}
