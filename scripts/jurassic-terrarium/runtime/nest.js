// A Triceratops nest: a low mound of scraped-up earth in a clearing, with a clutch of eggs. One of the
// herd stays close and guards it. A minute or so in, the eggs start to rock, then crack one by one: the
// top of each shell pops off and a hatchling climbs out, small at first and growing quickly, then
// trotting after its mother wherever she goes.
//
// The site is chosen before the route finder is built, so the nest is an obstacle nobody walks over,
// and the planting is cleared round it. `?hatch=<seconds>` sets when the first egg cracks.
import {
  Group, Mesh, LatheGeometry, SphereGeometry, MeshStandardMaterial, Vector2, Vector3, Color, DoubleSide,
  BufferAttribute,
} from 'three';

const EGGS = 3;

export class Nest {
  constructor(ctx, flora, rand, { hatchAt } = {}) {
    this.ctx = ctx;
    this.rand = rand;
    const site = this.pickSite(ctx, flora, rand);
    this.site = site;
    this.t = 0;
    this.hatchAt = hatchAt ?? 45 + rand() * 30;
    this.group = new Group();
    this.group.name = 'nest';
    this.eggs = [];
    this.shells = [];
    this.hatched = 0;
    if (!site) return;
    this.obstacle = { x: site.x, z: site.z, r: 0.26 };
    // clear the planting off the mound
    for (const kind of ['fern', 'fernlet', 'redplant', 'horsetail']) {
      const list = flora.placements[kind];
      if (list) flora.placements[kind] = list.filter((p) => Math.hypot(p.x - site.x, p.z - site.z) > 0.32);
    }
    this.build(site);
    ctx.scene.add(this.group);
  }

  pickSite(ctx, flora, rand) {
    const T = ctx.terrain;
    const den = window.__jtDen;
    const trunks = (flora.placements.treefern || []).concat(flora.placements.cycad || []);
    for (let tries = 0; tries < 3000; tries++) {
      // the front half of the case, where it is easy to see
      const x = (rand() * 2 - 1) * 5.5, z = 0.2 + rand() * 2.0;
      const h = T.height(x, z);
      if (h < 0.06 || h > 0.9 || T.slope(x, z) > 0.1) continue;
      if (Math.max(T.lakeMask(x, z), T.riverMask(x, z)) > 0.02) continue;
      if (den && Math.hypot(x - den.x, z - den.z) < 3.5) continue;
      if (window.__jtPathAt?.(x, z, 0.4)) continue; // not on the footpaths
      const cab = T.shape?.CABIN;
      if (cab && Math.hypot(x - cab.x, z - cab.z) < 1.4) continue;
      if (trunks.some((t) => Math.hypot(t.x - x, t.z - z) < 0.55)) continue;
      // level all round, so the mound sits flat
      let ok = true;
      for (let i = 0; i < 8 && ok; i++) {
        const a = (i / 8) * Math.PI * 2;
        if (Math.abs(T.height(x + Math.cos(a) * 0.3, z + Math.sin(a) * 0.3) - h) > 0.04) ok = false;
      }
      if (ok) return { x, z, y: h };
    }
    return null;
  }

  build(site) {
    const rand = this.rand;
    // the mound: a shallow bowl with a raised rim of scraped earth and leaf litter
    const prof = [[0, 0.004], [0.06, 0.006], [0.12, 0.02], [0.17, 0.042], [0.2, 0.046], [0.235, 0.03], [0.27, 0.008], [0.29, -0.01]]
      .map(([r, y]) => new Vector2(r, y));
    const g = new LatheGeometry(prof, 40);
    const pos = g.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const earth = new Color(0x4a3524), dry = new Color(0x6b5332), litter = new Color(0x3d4a22), c = new Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), r = Math.hypot(x, z);
      const n = Math.sin(x * 61 + z * 17) * Math.sin(z * 53 - x * 23);
      pos.setY(i, pos.getY(i) + n * 0.004 * Math.min(1, r / 0.1));
      c.copy(earth).lerp(dry, 0.5 + 0.5 * n).lerp(litter, r > 0.19 ? 0.45 + 0.3 * n : 0.1);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new BufferAttribute(col, 3));
    g.computeVertexNormals();
    const mound = new Mesh(g, new MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
    mound.receiveShadow = true;
    mound.position.set(site.x, site.y - 0.006, site.z);
    this.group.add(mound);
    // eggs: pale, olive-speckled, lying a little tilted in the bowl
    this.eggMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: DoubleSide });
    const eggGeo = speckled(new SphereGeometry(1, 18, 14));
    const capGeo = speckled(new SphereGeometry(1, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.42));
    const cupGeo = speckled(new SphereGeometry(1, 18, 10, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58));
    this.capGeo = capGeo;
    this.cupGeo = cupGeo;
    for (let i = 0; i < EGGS; i++) {
      const a = (i / EGGS) * Math.PI * 2 + rand() * 0.5;
      const p = new Vector3(site.x + Math.cos(a) * 0.06, site.y + 0.03, site.z + Math.sin(a) * 0.06);
      const egg = new Mesh(eggGeo, this.eggMat);
      egg.scale.set(0.024, 0.034, 0.024);
      egg.position.copy(p);
      egg.rotation.set(0.5 * Math.cos(a), rand() * 6, 0.5 * Math.sin(a));
      egg.castShadow = true;
      this.group.add(egg);
      this.eggs.push({ mesh: egg, p, a, base: egg.rotation.clone(), at: this.hatchAt + i * (1.8 + rand() * 1.5), done: false });
    }
  }

  // hatch(eggPos) is called when an egg opens: the runtime makes the hatchling
  update(dt, hatch) {
    if (!this.site) return;
    this.t += dt;
    for (const E of this.eggs) {
      if (E.done) continue;
      const until = E.at - this.t;
      if (until < 10) {
        // rocking: gentle at first, then urgent little shoves just before it breaks
        const k = 1 - Math.max(0, until) / 10;
        const w = Math.sin(this.t * (6 + k * 14) + E.a * 3) * (0.05 + k * k * 0.3) * (Math.sin(this.t * 1.7 + E.a) > -0.2 ? 1 : 0.2);
        E.mesh.rotation.set(E.base.x + w, E.base.y, E.base.z + w * 0.6);
      }
      if (until <= 0) {
        E.done = true;
        this.crack(E);
        this.hatched++;
        hatch(E.p.clone(), E.a);
      }
    }
    // shell pieces: the cap flies off and settles, everything fades after a while
    for (const S of this.shells) {
      if (S.rest) continue;
      S.v.y -= dt * 1.6;
      S.m.position.addScaledVector(S.v, dt);
      S.m.rotation.x += S.spin * dt;
      const floor = this.site.y + 0.012;
      if (S.m.position.y < floor) {
        S.m.position.y = floor;
        S.rest = true;
      }
    }
  }

  crack(E) {
    E.mesh.visible = false;
    const cup = new Mesh(this.cupGeo, this.eggMat);
    cup.scale.copy(E.mesh.scale);
    cup.position.copy(E.p);
    cup.rotation.set(0.15, E.base.y, 0.1);
    const cap = new Mesh(this.capGeo, this.eggMat);
    cap.scale.copy(E.mesh.scale);
    cap.position.copy(E.p).y += 0.012;
    cap.rotation.copy(E.base);
    this.group.add(cup, cap);
    const out = new Vector3(Math.cos(E.a), 0, Math.sin(E.a));
    this.shells.push({ m: cap, v: new Vector3(out.x * 0.25, 0.45, out.z * 0.25), spin: 6 + this.rand() * 6, rest: false });
    this.shells.push({ m: cup, v: new Vector3(0, 0, 0), spin: 0, rest: true });
  }
}

// cream shell with olive-brown speckles, as vertex colours
function speckled(g) {
  const p = g.attributes.position;
  const col = new Float32Array(p.count * 3);
  const base = new Color(0xbfae8a), spot = new Color(0x5a4528), c = new Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = Math.sin(x * 23 + y * 7) * Math.sin(y * 19 - z * 13) * Math.sin(z * 29 + x * 11);
    c.copy(base).lerp(spot, n > 0.35 ? 0.7 : n > 0.2 ? 0.25 : 0);
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new BufferAttribute(col, 3));
  return g;
}
