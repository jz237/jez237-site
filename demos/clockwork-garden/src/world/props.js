import * as THREE from 'three';
import { petalGeometry, leafGeometry, taperedTube, tubeThrough } from '../geometry/shapes.js';
import { collarGeometry, knuckleGeometry, screwGeometry } from '../geometry/parts.js';
import { gearGeometry } from '../geometry/gears.js';
import { RNG } from '../core/rng.js';
import { B } from '../direction/beats.js';
import { clamp, lerp, sseg, smoother, seg } from '../core/ease.js';
import { L } from './layout.js';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------
// The skep: a domed brass beehive of stacked coils on a stone plinth. Home of
// our mechanical pollinator. A warm light glows from the entrance arch.
export class Skep {
  constructor(mat, stoneMat) {
    this.group = new THREE.Group();
    this.group.position.copy(L.skep);
    this.group.rotation.y = -2.25; // entrance faces the hero flower
    const g = this.group;
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.8, 3.2, 40), stoneMat);
    plinth.position.y = 1.2;
    g.add(plinth);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 6.4, 0.6, 40), stoneMat);
    cap.position.y = 3.0;
    g.add(cap);
    // stacked coils, each a torus slightly smaller than the one below
    const coils = 13;
    this.coilMeshes = [];
    // the lowest coils are cut back round an arched doorway tall enough for
    // APX-9 to walk out of (the gap is centred on the skep's front, +Z)
    const DOOR = { y: 3.6, r: 2.0 };
    const capGeo = new THREE.SphereGeometry(1, 12, 8);
    for (let i = 0; i < coils; i++) {
      const k = i / (coils - 1);
      const r = 5.2 * Math.cos(k * Math.PI * 0.47) + 0.4;
      const y = 3.5 + Math.sin(k * Math.PI * 0.5) * 8.6;
      const tube = 0.52 - k * 0.12;
      const yEval = Math.max(DOOR.y, y - tube);
      const w = yEval - DOOR.y < DOOR.r ? Math.sqrt(DOOR.r ** 2 - (yEval - DOOR.y) ** 2) : 0;
      const gap = w > 0 ? Math.asin(Math.min(1, (w + tube * 0.6) / r)) : 0;
      const geo = new THREE.TorusGeometry(r, tube, 10, 72, TAU - 2 * gap);
      geo.rotateZ(Math.PI / 2 + gap);
      const material = i % 3 === 1 ? mat.copper : mat.brass;
      const torus = new THREE.Mesh(geo, material);
      torus.rotation.x = Math.PI / 2;
      torus.position.y = y;
      g.add(torus);
      this.coilMeshes.push(torus);
      if (gap > 0) {
        // rounded ends where the coil is cut
        for (const a of [Math.PI / 2 + gap, Math.PI / 2 - gap]) {
          const cap = new THREE.Mesh(capGeo, material);
          cap.scale.setScalar(tube);
          cap.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
          g.add(cap);
        }
      }
    }
    // riveted brass straps binding the coils, as on a cooper's barrel
    const rivetGeo = new THREE.SphereGeometry(0.16, 8, 6);
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * TAU + Math.PI / 8;
      const nearDoor = Math.abs(Math.atan2(Math.sin(a - Math.PI / 2), Math.cos(a - Math.PI / 2))) < 0.5;
      const k0 = nearDoor ? 0.3 : 0.0;
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const k = k0 + (1 - k0) * (i / 24) * 0.98;
        const r = 5.2 * Math.cos(k * Math.PI * 0.47) + 0.4 + 0.5 - k * 0.1;
        const y = 3.5 + Math.sin(k * Math.PI * 0.5) * 8.6;
        pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      const strap = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.13, 5, false), mat.brassAged);
      strap.scale.set(1, 1, 1);
      g.add(strap);
      for (let i = 0; i < coils; i += 2) {
        const k = i / (coils - 1);
        if (k < k0) continue;
        const r = 5.2 * Math.cos(k * Math.PI * 0.47) + 0.4 + 0.62 - k * 0.1;
        const y = 3.5 + Math.sin(k * Math.PI * 0.5) * 8.6;
        const rv = new THREE.Mesh(rivetGeo, mat.gold);
        rv.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
        g.add(rv);
      }
    }
    const topKnob = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12), mat.gold);
    topKnob.position.y = 12.6;
    g.add(topKnob);
    // interior glow + entrance arch (dark opening with gold frame)
    // a short arched tunnel into the hive, its back wall glowing warm
    const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(DOOR.r, DOOR.r, 3.4, 28, 1, true, -Math.PI / 2, Math.PI), mat.brassAged.clone());
    tunnel.material.side = THREE.BackSide;
    tunnel.material.color.set('#5a4220');
    tunnel.rotation.x = -Math.PI / 2; // the open half faces up: an arch over the floor
    tunnel.position.set(0, DOOR.y, 4.3);
    g.add(tunnel);
    const door = new THREE.Mesh(new THREE.CircleGeometry(DOOR.r, 28, 0, Math.PI), new THREE.MeshBasicMaterial({ color: '#1a0c03' }));
    door.position.set(0, DOOR.y, 2.62);
    g.add(door);
    this.doorGlow = new THREE.Mesh(new THREE.CircleGeometry(DOOR.r * 0.8, 28, 0, Math.PI), new THREE.MeshBasicMaterial({ color: '#ffb257' }));
    this.doorGlow.position.set(0, DOOR.y + 0.02, 2.66);
    g.add(this.doorGlow);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(DOOR.r + 0.08, 0.17, 8, 32, Math.PI), mat.gold);
    arch.position.set(0, DOOR.y, 6.05);
    g.add(arch);
    // landing board, running back into the tunnel as its floor
    const board = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 4.6), mat.brassAged);
    board.position.set(0, 3.45, 4.7);
    g.add(board);
    // a small clock dial on the skep front (the hive keeps time)
    const dial = new THREE.Mesh(new THREE.CircleGeometry(1.1, 32), mat.porcelain);
    dial.position.set(0, 8.6, 4.35);
    dial.rotation.x = -0.45;
    g.add(dial);
    this.hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.04), mat.steelBlued);
    this.hand.geometry.translate(0, 0.38, 0);
    this.hand.position.set(0, 8.62, 4.38);
    this.hand.rotation.x = -0.45;
    g.add(this.hand);
    g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  }
  entranceWorld(target = new THREE.Vector3()) {
    return this.group.localToWorld(target.set(0, 3.7, 5.9));
  }
  update(t, ctx) {
    const wake = sseg(t, B.podsWake[0] + 2, B.beeEmerge);
    const g = 0.25 + wake * 0.9 + (ctx.skepFlare || 0);
    this.doorGlow.material.color.setRGB(1.0 * g, 0.6 * g, 0.26 * g);
    this.hand.rotation.z = -t * 0.12;
  }
}

// ---------------------------------------------------------------------------
// Glass seedpods: blown-glass pods on copper stalks with luminous seeds that
// wake when the secondary roots deliver energy.
export class Seedpods {
  constructor(mat, clusters) {
    this.group = new THREE.Group();
    this.pods = [];
    const rng = new RNG('pods');
    const podGeo = new THREE.SphereGeometry(1, 24, 16);
    podGeo.scale(0.75, 1.25, 0.75);
    const seedGeo = new THREE.SphereGeometry(0.13, 10, 8);
    for (const c of clusters) {
      for (let i = 0; i < c.count; i++) {
        const a = rng.range(0, TAU);
        const r = rng.range(0.4, c.spread);
        const base = new THREE.Vector3(c.pos.x + Math.cos(a) * r, 0, c.pos.z + Math.sin(a) * r);
        const h = rng.range(c.h[0], c.h[1]);
        const bend = new THREE.Vector3(rng.range(-1.5, 1.5), 0, rng.range(-1.5, 1.5));
        const pts = [base.clone(), base.clone().add(new THREE.Vector3(0, h * 0.4, 0)), base.clone().add(bend.clone().multiplyScalar(0.6)).setY(h * 0.8), base.clone().add(bend).setY(h)];
        const stalk = new THREE.Mesh(taperedTube(new THREE.CatmullRomCurve3(pts), 0.14, 0.07, 30, 6), mat.copperAged);
        stalk.castShadow = true;
        this.group.add(stalk);
        const top = pts[3];
        const s = rng.range(0.9, 1.6);
        const pod = new THREE.Mesh(podGeo, mat.glass);
        pod.scale.setScalar(s);
        pod.position.copy(top).add(new THREE.Vector3(0, 1.1 * s, 0));
        this.group.add(pod);
        const collar = new THREE.Mesh(collarGeometry(0.32 * s, 0.35), mat.gold);
        collar.position.copy(top).add(new THREE.Vector3(0, 0.1, 0));
        this.group.add(collar);
        const seedMat = new THREE.MeshBasicMaterial({ color: '#ffb35a' });
        const seeds = [];
        for (let k = 0; k < 3; k++) {
          const sd = new THREE.Mesh(seedGeo, seedMat);
          sd.position.copy(pod.position).add(new THREE.Vector3(rng.range(-0.25, 0.25) * s, (k - 1) * 0.45 * s, rng.range(-0.25, 0.25) * s));
          this.group.add(sd);
          seeds.push(sd);
        }
        this.pods.push({ seedMat, wakeAt: c.wakeAt + rng.range(0, 0.9), phase: rng.range(0, TAU), pos: pod.position.clone() });
      }
    }
  }
  update(t, ctx) {
    for (const p of this.pods) {
      const k = sseg(t, p.wakeAt, p.wakeAt + 0.8);
      const flare = Math.exp(-Math.max(0, t - p.wakeAt) * 2.0) * (t > p.wakeAt ? 1 : 0);
      const g = 0.03 + k * (0.75 + 0.2 * Math.sin(t * 2.2 + p.phase)) + flare * 1.4;
      p.seedMat.color.setRGB(0.7 * g, 0.32 * g, 0.08 * g);
    }
  }
}

// ---------------------------------------------------------------------------
// Porcelain lily: tall arching stem with a single trumpet bloom. The monarch
// perches on its petal rim; the stem bends under the butterfly's weight.
export class PorcelainLily {
  constructor(mat) {
    this.group = new THREE.Group();
    this.group.position.copy(L.lily);
    this.mat = mat;
    const h = 24;
    this.h = h;
    this.stemPts = (bend) => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.3, h * 0.35, 0.2),
      new THREE.Vector3(1.2 + bend * 0.5, h * 0.7 - bend * 0.3, 0.6 + bend * 0.2),
      new THREE.Vector3(3.2 + bend, h - bend * 0.8, 1.6 + bend * 0.4),
    ];
    this.stem = new THREE.Mesh(new THREE.BufferGeometry(), mat.verdigris);
    this.stem.castShadow = true;
    this.group.add(this.stem);
    this.bloom = new THREE.Group();
    this.group.add(this.bloom);
    const petal = petalGeometry({ length: 5.4, width: 2.6, cup: 0.6, curl: -0.4, thickness: 0.06, tip: 0.8 });
    this.petalSample = petal.sample;
    this.petals = [];
    const lilyMat = mat.porcelainPainted || mat.porcelain;
    const rim = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(petal.edge), 60, 0.04, 5, false);
    for (let i = 0; i < 6; i++) {
      const phi = (i / 6) * TAU;
      const holder = new THREE.Group();
      holder.rotation.set(0.75, Math.PI / 2 - phi, 0, 'YXZ');
      holder.position.set(Math.cos(phi) * 0.5, 0, Math.sin(phi) * 0.5);
      holder.add(new THREE.Mesh(petal.geometry, lilyMat));
      this.petals.push(holder);
      holder.add(new THREE.Mesh(rim, mat.gold));
      this.bloom.add(holder);
    }
    const throat = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.3, 1.6, 16), mat.gold);
    throat.position.y = -0.4;
    this.bloom.add(throat);
    // leaves
    for (let i = 0; i < 3; i++) {
      const lf = leafGeometry({ length: 7, width: 2.2, fold: 0.7, arch: 0.9 });
      const m = new THREE.Mesh(lf.geometry, i % 2 ? mat.brassAged : mat.verdigris);
      m.position.set(0.1, 2 + i * 4.5, 0);
      m.rotation.set(1.0, i * 2.2, 0, 'YXZ');
      this.group.add(m);
    }
    this.setBend(0);
    this.group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  }
  setBend(b) {
    if (this._b === b) return;
    this._b = b;
    const pts = this.stemPts(b);
    const curve = new THREE.CatmullRomCurve3(pts);
    this.stem.geometry.dispose();
    this.stem.geometry = taperedTube(curve, 0.36, 0.2, 40, 8);
    const top = pts[3];
    const tng = curve.getTangentAt(1);
    this.bloom.position.copy(top);
    // bloom faces outward and slightly down at the end of the arch
    const dir = tng.clone().lerp(new THREE.Vector3(0.6, 0.35, 0.3), 0.5).normalize();
    this.bloom.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  }
  // perch point on the petal rim for the monarch (world)
  // perch on the inner face of the petal that faces the camera side, near
  // its rim; returns the point slightly above the surface
  perchWorld(target = new THREE.Vector3()) {
    const h = this.petals[1];
    const p = this.petalSample(0.72, 0.0);
    const n = this.perchNormalLocal();
    target.copy(p).addScaledVector(n, 0.42);
    h.updateMatrixWorld(true);
    return h.localToWorld(target);
  }
  perchNormalLocal() {
    const a = this.petalSample(0.7, 0), b = this.petalSample(0.74, 0), c = this.petalSample(0.72, 0.1);
    // petal inner face is -Z (the convex outer face is +Z)
    const n = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize();
    if (n.z > 0) n.negate();
    return n;
  }
  perchNormalWorld(target = new THREE.Vector3()) {
    const h = this.petals[1];
    return target.copy(this.perchNormalLocal()).transformDirection(h.matrixWorld);
  }
  perchTangentWorld(target = new THREE.Vector3()) {
    const h = this.petals[1];
    const a = this.petalSample(0.6, 0), b = this.petalSample(0.8, 0);
    return target.copy(b.sub(a).normalize()).transformDirection(h.matrixWorld);
  }
  update(t, ctx) {
    // stem dips when the butterfly lands, then sways back with damping
    const land = ctx.lilyLandAt ?? B.monarchLand;
    let b = 0;
    if (t > land) {
      const s = t - land;
      b = 0.9 * (1 - Math.exp(-s * 3.5) * Math.cos(s * 6.5)) * (1 - sseg(t, B.monarch[1] - 0.6, B.monarch[1] + 0.6) * 0.0);
      if (ctx.lilyLandAt !== undefined) b *= ctx.lilyWeight ?? 1;
    }
    b += Math.sin(t * 0.8) * 0.06;
    this.setBend(Math.round(b * 120) / 120);
  }
}

// ---------------------------------------------------------------------------
// Glass blossom: a bell of clear glass on a gold stem, with a luminous nectar
// drop at its heart. The hummingbird feeds here.
export class GlassBlossom {
  constructor(mat) {
    this.group = new THREE.Group();
    this.group.position.copy(L.glassBlossom);
    const h = 27;
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.4, h * 0.4, 0.3), new THREE.Vector3(0.8, h * 0.8, 1.2), new THREE.Vector3(2.4, h, 2.6)];
    const curve = new THREE.CatmullRomCurve3(pts);
    const stem = new THREE.Mesh(taperedTube(curve, 0.32, 0.18, 40, 8), mat.gold);
    stem.castShadow = true;
    this.group.add(stem);
    const bell = new THREE.Group();
    bell.position.copy(pts[3]);
    bell.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.65, 0.45, 0.6).normalize());
    this.group.add(bell);
    // bell profile: flared trumpet
    const prof = [];
    for (let i = 0; i <= 20; i++) {
      const k = i / 20;
      prof.push(new THREE.Vector2(0.3 + Math.pow(k, 2.2) * 2.6 + Math.sin(k * Math.PI) * 0.4, k * 4.5));
    }
    const glassBell = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), mat.glass);
    bell.add(glassBell);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.07, 6, 64), mat.gold);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = 4.5;
    bell.add(lip);
    // inner filigree ribs
    for (let i = 0; i < 6; i++) {
      const ribPts = prof.map((p) => new THREE.Vector3(p.x * 0.97 * Math.cos((i / 6) * TAU), p.y, p.x * 0.97 * Math.sin((i / 6) * TAU)));
      bell.add(new THREE.Mesh(tubeThrough(ribPts, 0.03, 30, 4), mat.gold));
    }
    this.nectarMat = new THREE.MeshBasicMaterial({ color: '#ffc46b' });
    const nectar = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), this.nectarMat);
    nectar.position.y = 0.9;
    bell.add(nectar);
    const pistil = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 6), mat.gold);
    pistil.position.y = 1.9;
    bell.add(pistil);
    this.bell = bell;
    this.light = new THREE.PointLight('#ffbf6a', 0, 10, 2);
    this.light.position.y = 1.2;
    bell.add(this.light);
  }
  // where the hummingbird's beak tip goes (world)
  nectarWorld(target = new THREE.Vector3()) {
    return this.bell.localToWorld(target.set(0, 1.6, 0));
  }
  mouthWorld(target = new THREE.Vector3()) {
    return this.bell.localToWorld(target.set(0, 5.2, 0));
  }
  axisWorld(target = new THREE.Vector3()) {
    return target.set(0, 1, 0).applyQuaternion(this.bell.getWorldQuaternion(new THREE.Quaternion()));
  }
  update(t, ctx) {
    const wake = sseg(t, B.podsWake[0] + 3, B.podsWake[1] + 3);
    const sip = ctx.sip ?? sseg(t, B.hummingbird[0] + 1.6, B.hummingbird[0] + 2.4) * (1 - sseg(t, B.hummingbird[0] + 3.4, B.hummingbird[0] + 4.0));
    const g = 0.2 + wake * 1.4 + sip * 2 + Math.sin(t * 3.1) * 0.08 * wake;
    this.nectarMat.color.setRGB(1.0 * g, 0.72 * g, 0.36 * g);
    this.light.intensity = (wake * 1.5 + sip * 3) * ctx.lightScale;
  }
}

// ---------------------------------------------------------------------------
// Copper stem the beetle climbs: a tall reed with nodes and a seed head.
export class BeetleReed {
  constructor(mat) {
    this.group = new THREE.Group();
    this.group.position.copy(L.beetleStem);
    const h = 22;
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.4, h * 0.3, -0.2), new THREE.Vector3(-0.3, h * 0.65, 0.3), new THREE.Vector3(0.5, h, 0)];
    this.curve = new THREE.CatmullRomCurve3(pts);
    this.radius = 0.42;
    const stem = new THREE.Mesh(taperedTube(this.curve, 0.48, 0.32, 60, 12), mat.copper);
    stem.castShadow = true;
    stem.receiveShadow = true;
    this.group.add(stem);
    for (let i = 1; i < 6; i++) {
      const k = i / 6;
      const c = new THREE.Mesh(collarGeometry(0.55 - k * 0.12, 0.3), mat.gold);
      c.position.copy(this.curve.getPointAt(k));
      c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), this.curve.getTangentAt(k));
      this.group.add(c);
    }
    // a broad leaf the beetle disappears beneath
    const lf = leafGeometry({ length: 9, width: 4, fold: 0.4, arch: 0.8 });
    this.leaf = new THREE.Mesh(lf.geometry, new THREE.MeshPhysicalMaterial({ color: '#6f7d3a', metalness: 0.85, roughness: 0.4, side: THREE.DoubleSide }));
    this.leaf.position.copy(this.curve.getPointAt(0.78));
    this.leaf.rotation.set(1.1, 2.6, 0, 'YXZ');
    this.leaf.castShadow = true;
    this.group.add(this.leaf);
    // seed head of small brass gears
    const head = new THREE.Group();
    head.position.copy(this.curve.getPointAt(1));
    for (let i = 0; i < 5; i++) {
      const gm = new THREE.Mesh(gearGeometry({ teeth: 12, module: 0.12, thickness: 0.12, spokes: 0 }), mat.brass);
      gm.position.set(Math.cos(i * 1.3) * 0.5, i * 0.25, Math.sin(i * 1.3) * 0.5);
      gm.rotation.set(Math.PI / 2 + i * 0.3, i, 0);
      head.add(gm);
    }
    this.group.add(head);
  }
  // point on the stem surface at parameter k, on the side facing `side` angle
  surfacePoint(k, angle, target = new THREE.Vector3()) {
    const p = this.curve.getPointAt(k);
    const tng = this.curve.getTangentAt(k);
    const n = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    n.addScaledVector(tng, -n.dot(tng)).normalize();
    const r = lerp(0.48, 0.32, k);
    target.copy(p).addScaledVector(n, r);
    return this.group.localToWorld(target);
  }
  update() {}
}

// ---------------------------------------------------------------------------
// Copper tree: a mechanical shrub of branching copper with brass leaves. The
// songbird perches on its lowest branch.
export class CopperTree {
  constructor(mat) {
    this.group = new THREE.Group();
    this.group.position.copy(L.songbirdTree);
    this.group.rotation.y = L.songbirdTreeRot;
    const rng = new RNG('tree');
    const branches = [];
    const leafPts = [];
    const grow = (start, dir, len, r, depth) => {
      const pts = [start.clone()];
      let p = start.clone();
      let d = dir.clone();
      for (let i = 0; i < 4; i++) {
        d.add(new THREE.Vector3(rng.range(-0.25, 0.25), rng.range(-0.05, 0.15), rng.range(-0.25, 0.25))).normalize();
        p = p.clone().addScaledVector(d, len / 4);
        pts.push(p);
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      branches.push(new THREE.Mesh(taperedTube(curve, r, r * 0.6, 24, 8), depth === 0 ? mat.copperAged : mat.copper));
      if (depth < 3) {
        const n = depth === 0 ? 4 : 3;
        for (let i = 0; i < n; i++) {
          const k = 0.45 + (i / n) * 0.55;
          const sp = curve.getPointAt(k);
          const nd = curve.getTangentAt(k).add(new THREE.Vector3(rng.range(-1, 1), rng.range(0.1, 0.6), rng.range(-1, 1))).normalize();
          grow(sp, nd, len * 0.62, r * 0.55, depth + 1);
        }
      } else {
        for (let i = 0; i < 6; i++) leafPts.push({ p: curve.getPointAt(rng.range(0.3, 1)), r: rng.range(0, TAU) });
      }
      return curve;
    };
    const trunk = grow(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0), 52, 2.2, 0);
    branches.forEach((b) => { b.castShadow = true; b.receiveShadow = true; this.group.add(b); });
    // the perch branch: a clean horizontal copper bough toward the hero area
    const perchPts = [new THREE.Vector3(0, 22, 0), new THREE.Vector3(-6, 24, -3), new THREE.Vector3(-13, 24.5, -7), new THREE.Vector3(-19, 25.5, -10)];
    this.perchCurve = new THREE.CatmullRomCurve3(perchPts);
    const perch = new THREE.Mesh(taperedTube(this.perchCurve, 1.0, 0.4, 40, 10), mat.copper);
    perch.castShadow = true;
    this.group.add(perch);
    // leaves (instanced)
    const lg = leafGeometry({ length: 4.2, width: 1.8, fold: 0.6, arch: 0.6, segU: 10, segV: 4 }).geometry;
    const lm = new THREE.InstancedMesh(lg, new THREE.MeshPhysicalMaterial({ color: '#b38a45', metalness: 0.95, roughness: 0.35, side: THREE.DoubleSide }), leafPts.length + 20);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const perchLocal = this.perchCurve.getPointAt(0.72);
    leafPts.forEach((l, i) => {
      if (l.p.distanceTo(perchLocal) < 18) l.p.y -= 80; // keep the songbird's stage clear (sunk out of sight)
      q.setFromEuler(new THREE.Euler(rng.range(0.3, 1.4), l.r, 0, 'YXZ'));
      m4.compose(l.p, q, new THREE.Vector3(1, 1, 1).multiplyScalar(rng.range(0.7, 1.3)));
      lm.setMatrixAt(i, m4);
    });
    for (let i = 0; i < 20; i++) {
      // leaves only near the trunk end of the bough; the songbird's end stays bare
      const k = 0.08 + (i / 20) * 0.4;
      const p = this.perchCurve.getPointAt(k);
      q.setFromEuler(new THREE.Euler(rng.range(0.4, 1.2), rng.range(0, TAU), 0, 'YXZ'));
      m4.compose(p, q, new THREE.Vector3(1, 1, 1).multiplyScalar(rng.range(0.6, 1.1)));
      lm.setMatrixAt(leafPts.length + i, m4);
    }
    lm.castShadow = true;
    this.group.add(lm);
  }
  perchWorld(k = 0.72, target = new THREE.Vector3()) {
    const p = this.perchCurve.getPointAt(k);
    p.y += 0.7;
    return this.group.localToWorld(target.copy(p));
  }
  update() {}
}
