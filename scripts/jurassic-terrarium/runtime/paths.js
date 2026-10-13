// Footpaths, as in the Terramundi reference: a winding dirt track from the cabin door down to the jetty,
// and a branch from it that crosses the stream on stepping stones and climbs to the cave mouth. The
// line itself is defined once in tools/build-page.mjs (window.__jtPath, smoothed into __jtPathLines) so
// that every planter, Weatherglass's included, keeps off it.
//   - the track: a terrain-hugging ribbon of trodden earth, lighter down the worn middle, its edges
//     fading into the moss (vertex alpha), little stones kicked to either side;
//   - stepping stones: flat-topped stones wherever the line crosses water or the steep stream banks;
//   - lanterns: a few posts with small lamps along the way, lit from dusk.
import {
  Group, Mesh, BufferGeometry, BufferAttribute, MeshStandardMaterial, InstancedMesh, Matrix4, Quaternion,
  Vector3, Euler, Color, CylinderGeometry, BoxGeometry, Sprite, SpriteMaterial, CanvasTexture, AdditiveBlending,
} from 'three';
import { guardMaterial } from './safety.js';
import { boulderGeometry } from './rocks.js';

const M = new Matrix4(), Q = new Quaternion(), P = new Vector3(), S = new Vector3(), E = new Euler();
const lin = (hex) => new Color(hex).convertSRGBToLinear();

export const pathAt = (x, z, r = 0) => !!window.__jtPathAt?.(x, z, r);

export class Paths {
  constructor(ctx, rand) {
    this.ctx = ctx;
    this.group = new Group();
    this.group.name = 'paths';
    const T = ctx.terrain, lines = window.__jtPathLines || [];
    const water = (x, z) => Math.max(T.lakeMask(x, z), T.riverMask(x, z));
    const tier = ctx.quality?.tier ?? 1;
    const stones = [], pebbles = [];
    const pos = [], col = [], idx = [];
    const dirt = lin(0x5a3f26), worn = lin(0x7c5f3e), dark = lin(0x3c2a1a), c = new Color();
    const STEP = 0.02, ACROSS = [-1, -0.55, -0.2, 0.2, 0.55, 1];

    for (const line of lines) {
      // resample at an even spacing
      const pts = [];
      for (let i = 0; i < line.length - 1; i++) {
        const [ax, az] = line[i], [bx, bz] = line[i + 1], L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(L / STEP));
        for (let k = 0; k < n; k++) pts.push([ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n]);
      }
      pts.push(line[line.length - 1]);
      let run = null, sinceStone = 1, dist = 0;
      const flush = () => (run = null);
      for (let i = 0; i < pts.length; i++) {
        const [x, z] = pts[i], [nx, nz] = pts[Math.min(pts.length - 1, i + 1)], [px, pz] = pts[Math.max(0, i - 1)];
        let tx = nx - px, tz = nz - pz;
        const tl = Math.hypot(tx, tz) || 1;
        tx /= tl;
        tz /= tl;
        const sx = -tz, sz = tx; // across the path
        const wet = water(x, z) > 0.08 || T.height(x, z) < 0.12;
        const steep = T.slope(x, z) > 0.32;
        if (i) dist += STEP;
        if (wet || steep) {
          // stepping stones, a stride apart, a little to either side of the line
          flush();
          sinceStone += STEP;
          if (sinceStone >= 0.1) {
            sinceStone = 0;
            const off = (rand() - 0.5) * 0.05;
            const ox = x + sx * off, oz = z + sz * off;
            const top = Math.max(T.height(ox, oz), 0) + (wet ? 0.022 : 0.012);
            stones.push({ x: ox, z: oz, top, s: 0.068 + rand() * 0.022 });
          }
          continue;
        }
        sinceStone = 1;
        // the track: half width wanders, the worn middle is lighter
        const half = 0.07 + 0.012 * Math.sin(dist * 7.1) + 0.008 * Math.sin(dist * 17.3 + 1);
        const row = [];
        for (const a of ACROSS) {
          const vx = x + sx * a * half, vz = z + sz * a * half;
          const n1 = 0.5 + 0.5 * Math.sin(vx * 37 + vz * 11) * Math.sin(vz * 29 - vx * 7);
          c.copy(dirt).lerp(worn, (1 - Math.abs(a)) * 0.6 * (0.6 + 0.4 * n1)).lerp(dark, n1 * 0.25);
          const al = Math.abs(a) > 0.9 ? 0 : Math.abs(a) > 0.5 ? 0.75 : 0.95;
          row.push(pos.length / 3);
          pos.push(vx, T.height(vx, vz) + 0.006, vz);
          col.push(c.r, c.g, c.b, al);
        }
        if (run) for (let k = 0; k < ACROSS.length - 1; k++) idx.push(run[k], row[k], run[k + 1], run[k + 1], row[k], row[k + 1]);
        run = row;
        // stones kicked to the verges
        if (rand() < 0.35) {
          const side = rand() < 0.5 ? -1 : 1, d = half * (0.85 + rand() * 0.5);
          const ex = x + sx * side * d, ez = z + sz * side * d;
          pebbles.push({ x: ex, z: ez, y: T.height(ex, ez), s: 0.007 + rand() * 0.012 });
        }
      }
    }

    // the track
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('color', new BufferAttribute(new Float32Array(col), 4));
    g.setIndex(idx);
    g.computeVertexNormals();
    const mat = new MeshStandardMaterial({
      vertexColors: true, transparent: true, depthWrite: false, roughness: 1, metalness: 0,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4,
    });
    guardMaterial(mat);
    const track = new Mesh(g, mat);
    track.name = 'paths-track';
    track.receiveShadow = true;
    track.renderOrder = 1;
    this.group.add(track);

    // stepping stones and verge pebbles
    const stoneMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0 });
    const place = (geo, list, name, f) => {
      if (!list.length) return;
      const im = new InstancedMesh(geo, stoneMat, list.length);
      list.forEach((s, i) => {
        f(s);
        im.setMatrixAt(i, M);
      });
      im.castShadow = im.receiveShadow = true;
      im.name = name;
      this.group.add(im);
    };
    place(boulderGeometry(11.3, 2, { flat: 1, moss: 0.35 }), stones, 'paths-stepping-stones', (s) => {
      const h = s.s * 0.5;
      E.set((rand() - 0.5) * 0.08, rand() * 6.28, (rand() - 0.5) * 0.08);
      M.compose(P.set(s.x, s.top - h * 0.85, s.z), Q.setFromEuler(E), S.set(s.s, h, s.s * (0.75 + rand() * 0.3)));
    });
    place(boulderGeometry(4.1, 1, { moss: 0 }), pebbles, 'paths-pebbles', (s) => {
      E.set(rand(), rand() * 6.28, rand());
      M.compose(P.set(s.x, s.y + s.s * 0.2, s.z), Q.setFromEuler(E), S.set(s.s, s.s * 0.6, s.s * 0.8));
    });
    this.stones = stones;

    // lanterns along the way: wooden posts with a hook arm and a small lamp, lit from dusk
    this.lamps = [];
    const wood = new MeshStandardMaterial({ color: lin(0x4a3524), roughness: 0.9 });
    const iron = new MeshStandardMaterial({ color: lin(0x2a2622), metalness: 0.7, roughness: 0.5 });
    this.glassMat = new MeshStandardMaterial({ color: 0xffe2b0, emissive: new Color(1.0, 0.7, 0.36), emissiveIntensity: 0, roughness: 0.3 });
    guardMaterial(this.glassMat);
    const glowTex = (() => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 64;
      const x = cv.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,220,160,1)');
      gr.addColorStop(0.25, 'rgba(255,170,90,0.45)');
      gr.addColorStop(1, 'rgba(255,140,60,0)');
      x.fillStyle = gr;
      x.fillRect(0, 0, 64, 64);
      return new CanvasTexture(cv);
    })();
    this.haloMat = new SpriteMaterial({ map: glowTex, blending: AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 });
    guardMaterial(this.haloMat);
    const spots = tier === 0 ? [[0, 0.45]] : [[0, 0.38], [0, 0.97], [1, 0.27], [1, 0.62], [1, 0.93]];
    for (const [li, u] of spots) {
      const l = lines[li];
      if (!l) continue;
      const i = Math.floor(u * (l.length - 2)), [x0, z0] = l[i], [x1, z1] = l[i + 1];
      const tl = Math.hypot(x1 - x0, z1 - z0) || 1, sx = -(z1 - z0) / tl, sz = (x1 - x0) / tl;
      const side = (li + i) % 2 ? 1 : -1, x = x0 + sx * side * 0.13, z = z0 + sz * side * 0.13;
      if (water(x, z) > 0.02) continue;
      const lg = new Group();
      lg.position.set(x, T.height(x, z), z);
      lg.rotation.y = Math.atan2(-sx * side, -sz * side) - Math.PI / 2;
      const post = new Mesh(new CylinderGeometry(0.0055, 0.007, 0.15, 6), wood);
      post.position.y = 0.075;
      const arm = new Mesh(new BoxGeometry(0.04, 0.005, 0.005), wood);
      arm.position.set(0.018, 0.145, 0);
      const cap = new Mesh(new CylinderGeometry(0.003, 0.011, 0.008, 6), iron);
      cap.position.set(0.034, 0.128, 0);
      const lamp = new Mesh(new BoxGeometry(0.014, 0.018, 0.014), this.glassMat);
      lamp.position.set(0.034, 0.115, 0);
      const base = new Mesh(new BoxGeometry(0.016, 0.003, 0.016), iron);
      base.position.set(0.034, 0.105, 0);
      lg.add(post, arm, cap, lamp, base);
      for (const o of [post, arm, cap]) o.castShadow = true;
      const halo = new Sprite(this.haloMat);
      halo.position.set(0.034, 0.115, 0);
      halo.scale.setScalar(0.16);
      lg.add(halo);
      lg.name = 'paths-lantern';
      this.group.add(lg);
      this.lamps.push(lg);
    }
    ctx.scene.add(this.group);
    this.t = 0;
  }

  update(dt) {
    this.t += dt;
    const life = this.ctx.modules.life?.env;
    const dark = Math.min(1, (life?.night ?? 0) + (life?.dusk || 0) * 0.8 + (life?.golden || 0) * 0.25);
    const fl = 0.9 + 0.1 * Math.sin(this.t * 3.1) * Math.sin(this.t * 1.3 + 2);
    this.glassMat.emissiveIntensity = 3.2 * dark * fl;
    this.haloMat.opacity = 0.75 * dark * fl;
  }
}
