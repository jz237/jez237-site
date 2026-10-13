import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type {Surface} from './Surface';
import type {Nav} from './Nav';
import {TANK} from './Case';
import {WATER_LEVEL, poolDistance} from './Ground';

// A house cricket (Acheta domesticus), about 18 mm from head to wing tips.
// Local frame: +x forward, +y up, +z to its right; origin on the ground under the thorax.

interface CricketParts {
  body: THREE.BufferGeometry; // head, pronotum, abdomen, palps (merged)
  wing: THREE.BufferGeometry; // a folded forewing (one side)
  eye: THREE.BufferGeometry;
  seg: THREE.BufferGeometry; // unit tapered segment along +y (for thin legs)
  femur: THREE.BufferGeometry; // the hind leg's drumstick femur along +y
  spines: THREE.BufferGeometry; // spurs along the hind tibia, along +y
  antenna: THREE.BufferGeometry; // unit-length curved feeler along +x
  cercus: THREE.BufferGeometry; // unit-length tail filament along +x
  ovipositor: THREE.BufferGeometry;
  mats: {body: THREE.Material; femur: THREE.Material; wing: THREE.Material; eye: THREE.Material; leg: THREE.Material; dark: THREE.Material};
}

interface Leg {
  hip: THREE.Vector3; // on the body
  foot: THREE.Vector3; // rest position of the foot (local)
  lift: number; // knee height above the hip-foot line
  segs: THREE.Mesh[]; // femur, tibia, tarsus
  spurs: THREE.Mesh | null; // the hind tibia's spines
  radii: number[];
  group: 0 | 1; // tripod group
  hind: boolean;
  kick: THREE.Vector3; // current flail offset
}

const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), Y = new THREE.Vector3(0, 1, 0);
/** Places a unit +y segment mesh between a and b with radius scale r. */
function span(m: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, r: number) {
  tmpA.subVectors(b, a);
  const len = tmpA.length();
  m.position.copy(a);
  m.quaternion.copy(tmpQ.setFromUnitVectors(Y, tmpA.multiplyScalar(1 / Math.max(len, 1e-6))));
  m.scale.set(r, len, r);
}

/** A feeder cricket: falls in from the lid, then walks and hops about until caught. */
export class Cricket {
  readonly group = new THREE.Group();
  readonly pos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  heading = Math.random() * Math.PI * 2;
  airborne = true;
  caught = false;
  eaten = false;
  /** While held: how hard it kicks (0..1), and how much of it is already eaten (0..1). */
  struggle = 0;
  consumed = 0;
  private hopT = 0.5 + Math.random();
  private walkT = 0;
  private walking = false;
  private gait = 0;
  private hopPose = 0;
  private t = Math.random() * 10;
  private legs: Leg[] = [];
  private antennae: THREE.Object3D[] = [];
  private cerci: THREE.Object3D[] = [];
  private body = new THREE.Group();
  age = 0;
  splashed = false;

  /** Something alarming at `from`: hop away from it right now. */
  startle(from: THREE.Vector3) {
    if (this.caught || this.airborne) return;
    this.heading = Math.atan2(-(this.pos.z - from.z), this.pos.x - from.x) + (Math.random() - 0.5) * 0.8;
    this.hopT = 0;
  }

  constructor(start: THREE.Vector3, P: CricketParts) {
    this.pos.copy(start);
    const female = Math.random() < 0.5;
    const tint = 0.85 + Math.random() * 0.3;
    this.group.add(this.body);
    const add = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D = this.body) => {
      const mesh = new THREE.Mesh(g, m);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    };
    add(P.body, P.mats.body);
    for (const s of [-1, 1]) {
      const w = add(P.wing, P.mats.wing);
      w.scale.z = s;
      const e = add(P.eye, P.mats.eye);
      e.position.set(0.0074, 0.0043, 0.0017 * s);
      // feelers: very long, sweeping back over the body
      const a = new THREE.Group();
      a.position.set(0.0086, 0.0044, 0.0007 * s);
      const am = add(P.antenna, P.mats.dark, a);
      am.scale.set(0.024, 0.024, 0.024 * s);
      this.body.add(a);
      this.antennae.push(a);
      const c = new THREE.Group();
      c.position.set(-0.0088, 0.0031, 0.0006 * s);
      const cm = add(P.cercus, P.mats.leg, c);
      cm.scale.set(0.0058, 0.0058, 0.0058 * s);
      this.body.add(c);
      this.cerci.push(c);
    }
    if (female) {
      const o = add(P.ovipositor, P.mats.dark);
      o.position.set(-0.0086, 0.0029, 0);
    }
    this.body.scale.setScalar(tint > 1.05 ? 1.05 : 0.95 + Math.random() * 0.1);
    // legs: front and middle walking legs, big jumping hind legs
    const specs: [number, number, number, number, number, boolean, number][] = [
      // hip x, hip z, foot x, foot z, knee lift, hind, tripod group (for the right side)
      [0.0054, 0.0011, 0.0092, 0.0042, 0.0014, false, 0],
      [0.0034, 0.0015, 0.0038, 0.0055, 0.002, false, 1],
      [0.0016, 0.0016, -0.0058, 0.0034, 0.0055, true, 0],
    ];
    for (const s of [-1, 1]) for (const [hx, hz, fx, fz, lift, hind, grp] of specs) {
      const segs = hind ? [add(P.femur, P.mats.femur), add(P.seg, P.mats.leg), add(P.seg, P.mats.leg)] : [add(P.seg, P.mats.leg), add(P.seg, P.mats.leg), add(P.seg, P.mats.leg)];
      const spurs = hind ? add(P.spines, P.mats.dark) : null;
      if (spurs) spurs.scale.z = s;
      this.legs.push({
        spurs,
        hip: new THREE.Vector3(hx, 0.0018, hz * s), foot: new THREE.Vector3(fx, 0, fz * s), lift,
        segs, radii: hind ? [1, 0.00034, 0.00024] : [0.00036, 0.0003, 0.00021],
        group: (s > 0 ? grp : 1 - grp) as 0 | 1, hind, kick: new THREE.Vector3(),
      });
    }
    this.updateLegs(0);
  }

  /** Legs: tripod walking, hind legs folded, extended on take-off, flailing when held. */
  private updateLegs(dt: number) {
    const knee = new THREE.Vector3(), foot = new THREE.Vector3(), toe = new THREE.Vector3(), mid = new THREE.Vector3();
    for (const L of this.legs) {
      foot.copy(L.foot);
      let lift = L.lift;
      if (this.walking && !this.airborne && !this.caught) {
        const ph = this.gait * Math.PI * 2 + L.group * Math.PI;
        foot.x += Math.sin(ph) * (L.hind ? 0.001 : 0.0016);
        foot.y += Math.max(0, Math.cos(ph)) * 0.0012;
      }
      if (this.airborne) {
        // take-off: the hind legs kick straight back; in flight everything trails
        if (L.hind) {foot.x -= 0.004 * this.hopPose; foot.y += 0.002 * (1 - this.hopPose); lift *= 1 - 0.75 * this.hopPose;}
        else {foot.y += 0.002; foot.x -= 0.001;}
      }
      if (this.caught) {
        // flailing: legs kick in and out, faster when it struggles hard
        const k = this.struggle;
        L.kick.set(Math.sin(this.t * (19 + L.radii[1] * 9e3) + L.hip.x * 900) * 0.0025 * k, Math.sin(this.t * 23 + L.hip.z * 1500) * 0.002 * k + 0.0025, Math.cos(this.t * 17 + L.hip.x * 700) * 0.0015 * k);
        foot.add(L.kick);
      }
      // knee above the hip-foot line; the hind femur folds up and back along the
      // flank, so its knee sits high beside the abdomen
      mid.copy(L.hip).lerp(foot, L.hind ? 0.42 : 0.45);
      if (L.hind) knee.set(-0.0047 + 0.003 * (1 - lift / L.lift), L.hip.y + lift * 0.78, L.hip.z * 1.65);
      else knee.copy(mid).add(new THREE.Vector3(0.0004, lift, L.hip.z * 0.9));
      const tarsusDir = new THREE.Vector3(L.hind ? -1 : 0.5, 0, Math.sign(L.hip.z) * 0.6).normalize();
      toe.copy(foot).addScaledVector(tarsusDir, L.hind ? 0.0034 : 0.0024);
      toe.y = Math.min(toe.y, foot.y);
      if (L.hind) {
        // the drumstick femur is a fixed shape: aim it from the hip to the knee
        span(L.segs[0], L.hip, knee, 1);
        L.segs[0].scale.set(1, L.hip.distanceTo(knee) / 0.0085, 1);
      } else span(L.segs[0], L.hip, knee, L.radii[0]);
      span(L.segs[1], knee, foot, L.radii[1]);
      span(L.segs[2], foot, toe, L.radii[2]);
      if (L.spurs) {
        L.spurs.position.copy(knee);
        L.spurs.quaternion.copy(L.segs[1].quaternion);
        L.spurs.scale.y = knee.distanceTo(foot) / 0.0085;
      }
    }
    void dt;
  }

  update(dt: number, surface: Surface, nav: Nav) {
    this.t += dt;
    this.age += dt;
    // feelers sweep and tap; cerci twitch
    const agit = this.caught ? 1 + 2 * this.struggle : 1;
    this.antennae.forEach((a, i) => a.rotation.set(Math.sin(this.t * 3.1 * agit + i) * 0.25, Math.sin(this.t * 2.3 * agit + i * 2) * 0.35 + (i ? 0.25 : -0.25), Math.sin(this.t * 1.7 + i) * 0.2 - 0.1));
    this.cerci.forEach((c, i) => c.rotation.set(0, (i ? -0.35 : 0.35) + Math.sin(this.t * 5 + i) * 0.08, 0.15 + Math.sin(this.t * 3.7 + i) * 0.06));
    if (this.caught) {
      this.walking = false;
      this.updateLegs(dt);
      // the part already in the jaws disappears
      this.body.scale.x = Math.max(0.05, 1 - this.consumed * 0.95);
      return;
    }
    const ground = surface.heightAt(this.pos.x, this.pos.z);
    this.hopPose = Math.max(0, this.hopPose - dt * 4);
    if (this.airborne) {
      this.vel.y -= 9.8 * dt;
      this.pos.addScaledVector(this.vel, dt);
      // stay inside the glass
      const hx = TANK.w / 2 - 0.01, hz = TANK.d / 2 - 0.01;
      if (Math.abs(this.pos.x) > hx) {this.pos.x = Math.sign(this.pos.x) * hx; this.vel.x *= -0.3;}
      if (Math.abs(this.pos.z) > hz) {this.pos.z = Math.sign(this.pos.z) * hz; this.vel.z *= -0.3;}
      if (this.pos.y <= ground) {
        this.pos.y = ground;
        this.airborne = false;
        this.vel.set(0, 0, 0);
        if (poolDistance(this.pos.x, this.pos.z) < 0 && ground <= WATER_LEVEL + 0.001) {
          this.splashed = true;
          // landed in the pool: kick back toward the shore
          this.vel.set(-Math.cos(this.heading) * 0.6, 1.2, Math.sin(this.heading) * 0.6);
          this.airborne = true;
          this.hopPose = 1;
        }
      }
    } else {
      this.hopT -= dt;
      this.walkT -= dt;
      this.walking = false;
      if (this.hopT < 0) {
        this.hopT = 1.5 + Math.random() * 4;
        // pick a hop that lands on open ground
        let s = 0.35 + Math.random() * 0.45;
        for (let k = 0; k < 8; k++) {
          const h = this.heading + (Math.random() - 0.5) * 2.2 * (k + 1) * 0.5;
          const lx = this.pos.x + Math.cos(h) * s * 0.3, lz = this.pos.z - Math.sin(h) * s * 0.3;
          if (nav.dry(lx, lz)) {this.heading = h; break;}
          if (k === 7) s = 0.15;
        }
        this.vel.set(Math.cos(this.heading) * s, 0.9 + Math.random() * 0.5, -Math.sin(this.heading) * s);
        this.airborne = true;
        this.hopPose = 1;
      } else if (this.walkT < 0.4) {
        // short scuttles on a tripod gait
        this.walking = true;
        this.gait = (this.gait + dt * 9) % 1;
        const fx = Math.cos(this.heading), fz = -Math.sin(this.heading);
        const nx = this.pos.x + fx * 0.03 * dt, nz = this.pos.z + fz * 0.03 * dt;
        if (nav.dry(nx, nz)) {this.pos.x = nx; this.pos.z = nz;} else this.heading += 1.5;
        this.pos.y = surface.heightAt(this.pos.x, this.pos.z);
        if (this.walkT < 0) this.walkT = 0.8 + Math.random() * 1.5;
      }
    }
    this.group.position.copy(this.pos);
    this.group.rotation.set(0, this.heading, this.airborne ? 0.3 * Math.sign(this.vel.y) : 0);
    this.updateLegs(dt);
  }
}

/** Builds the shared cricket geometry and materials once. */
function cricketParts(): CricketParts {
  const sphere = (r: number, sx: number, sy: number, sz: number, x: number, y: number, z: number, ws = 16, hs = 12) => {
    const g = new THREE.SphereGeometry(r, ws, hs);
    g.scale(sx, sy, sz);
    g.translate(x, y, z);
    return g;
  };
  const parts: THREE.BufferGeometry[] = [];
  // head: round, the face turned down (crickets are hypognathous)
  const head = sphere(0.0023, 1.0, 1.08, 1.0, 0, 0, 0);
  head.rotateZ(-0.35);
  head.translate(0.0071, 0.0036, 0);
  parts.push(head);
  // mouthparts and palps
  for (const s of [-1, 1]) {
    const p = new THREE.CylinderGeometry(0.00022, 0.00016, 0.0022, 5);
    p.rotateZ(0.5);
    p.translate(0.0083, 0.0016, 0.0008 * s);
    parts.push(p);
  }
  // pronotum: a saddle-shaped shield over the thorax
  const pro = sphere(0.0026, 1.05, 0.72, 1.0, 0.0042, 0.0037, 0);
  parts.push(pro);
  parts.push(sphere(0.0023, 1.1, 0.75, 1.0, 0.0028, 0.0026, 0));
  // abdomen: overlapping segments tapering to the tip
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const r = 0.0024 * (1 - 0.45 * t * t);
    parts.push(sphere(r, 0.62, 0.78, 1.0, 0.0012 - t * 0.0094, 0.0026 - t * 0.0004, 0, 14, 10));
  }
  const body = mergeGeometries(parts.map((p) => p.toNonIndexed()))!; // keeps each part's smooth normals
  // body colour: tan with a dark band across the head and darker abdominal rings
  {
    const pos = body.attributes.position as THREE.BufferAttribute;
    const col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      let r = 0.3, g = 0.19, b = 0.08;
      // a dark band between the eyes and dark blotches on the pronotum
      if (x > 0.0062) {const band = Math.exp(-(((y - 0.0045) / 0.0009) ** 2)); r -= 0.28 * band; g -= 0.2 * band; b -= 0.1 * band;}
      if (x > 0.0018 && x < 0.0066 && y > 0.0044) {const k = 0.5 + 0.5 * Math.sin(z * 1800); r -= 0.18 * k; g -= 0.13 * k; b -= 0.06 * k;}
      if (x < 0.0014) {const ring = Math.pow(Math.abs(Math.sin((x - 0.0012) / 0.00134 * Math.PI)), 6); r -= 0.12 * ring; g -= 0.09 * ring; b -= 0.04 * ring;}
      if (y < 0.0018) {r += 0.06; g += 0.05; b += 0.03;} // paler underneath
      r = Math.max(0.03, r); g = Math.max(0.02, g); b = Math.max(0.01, b);
      col.set([r, g, b], i * 3);
    }
    body.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }
  // forewing (tegmen): a narrow strip lying along the back, curling down the side
  const wing = new THREE.PlaneGeometry(1, 1, 12, 4);
  {
    const pos = wing.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i) + 0.5, v = pos.getY(i) + 0.5; // u along, v across
      const x = 0.0028 - u * 0.0098;
      const ang = 0.15 + v * 1.45; // from the midline over and down the flank
      const R = 0.0021 * (1 - 0.3 * u * u) + 0.0003;
      pos.setXYZ(i, x, 0.0028 + Math.cos(ang) * R - 0.0004 * u, Math.sin(ang) * R);
    }
    wing.computeVertexNormals();
  }
  const eye = new THREE.SphereGeometry(0.00085, 12, 10);
  eye.scale(0.9, 1.2, 0.8);
  const seg = new THREE.CylinderGeometry(0.8, 1, 1, 6, 1);
  seg.translate(0, 0.5, 0);
  // the jumping femur: a drumstick, thick at the hip, tapering to the knee
  const femur = new THREE.LatheGeometry([0, 0.00055, 0.0009, 0.00105, 0.001, 0.0008, 0.00055, 0.0004, 0.0003, 0.00028, 0].map((r, i, a) => new THREE.Vector2(r, (i / (a.length - 1)) * 0.0085)), 8);
  // two rows of spurs along the hind tibia (built for a 8.5 mm tibia along +y)
  const spur: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) {
    const c = new THREE.ConeGeometry(0.00011, 0.0007, 4);
    c.translate(0, 0.00035, 0);
    c.rotateX(-0.9 * s);
    c.rotateZ(0.5);
    c.translate(0.00012, 0.0018 + i * 0.0012, 0.0002 * s);
    spur.push(c.toNonIndexed());
  }
  const spines = mergeGeometries(spur)!;
  // feelers: long, thin filaments that reach forward, then sweep back along the body
  const feeler = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.1, 0.08, 0.03), new THREE.Vector3(0.16, 0.15, 0.1), new THREE.Vector3(0.1, 0.2, 0.22),
    new THREE.Vector3(-0.1, 0.2, 0.32), new THREE.Vector3(-0.35, 0.15, 0.36), new THREE.Vector3(-0.6, 0.1, 0.34),
  ]);
  const antenna = new THREE.TubeGeometry(feeler, 32, 0.006, 4, false);
  {
    const pos = antenna.attributes.position as THREE.BufferAttribute;
    const uv = antenna.attributes.uv as THREE.BufferAttribute;
    const p = new THREE.Vector3(), q = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const t = uv.getX(i);
      feeler.getPointAt(t, p);
      q.set(pos.getX(i), pos.getY(i), pos.getZ(i)).sub(p).multiplyScalar(1 - 0.75 * t); // taper toward the tip
      pos.setXYZ(i, p.x + q.x, p.y + q.y, p.z + q.z);
    }
    antenna.computeVertexNormals();
  }
  const cercus = new THREE.ConeGeometry(0.035, 1, 5);
  cercus.rotateZ(Math.PI / 2);
  cercus.translate(-0.5, 0, 0);
  const ovipositor = new THREE.CylinderGeometry(0.00028, 0.00014, 0.0085, 5);
  ovipositor.rotateZ(Math.PI / 2 - 0.12);
  ovipositor.translate(-0.0042, 0.0005, 0);
  // forewing venation: long veins and a net of cross-veins, darker toward the edge
  const wingTex = (() => {
    const cv = document.createElement('canvas');
    cv.width = 256; cv.height = 64;
    const g = cv.getContext('2d')!;
    g.fillStyle = '#7a5a34'; g.fillRect(0, 0, 256, 64);
    const grd = g.createLinearGradient(0, 0, 0, 64);
    grd.addColorStop(0, 'rgba(60,40,20,0)'); grd.addColorStop(1, 'rgba(40,25,10,0.6)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 64);
    g.strokeStyle = 'rgba(35,22,10,0.85)'; g.lineWidth = 1.4;
    for (let k = 0; k < 7; k++) {g.beginPath(); const y = 4 + k * 9; g.moveTo(0, y); for (let x = 0; x <= 256; x += 16) g.lineTo(x, y + Math.sin(x * 0.03 + k) * 2.5); g.stroke();}
    g.lineWidth = 0.8;
    for (let x = 6; x < 256; x += 7 + Math.random() * 6) {g.beginPath(); g.moveTo(x, Math.random() * 6); g.lineTo(x + (Math.random() - 0.5) * 6, 64); g.stroke();}
    const tx = new THREE.CanvasTexture(cv);
    tx.colorSpace = THREE.SRGBColorSpace;
    return tx;
  })();
  const chitin = (c: THREE.Color, rough: number, vc = false) => new THREE.MeshPhysicalMaterial({color: c, roughness: rough, clearcoat: 0.5, clearcoatRoughness: 0.35, vertexColors: vc});
  return {
    body, wing, eye, seg, femur, spines, antenna, cercus, ovipositor,
    mats: {
      body: chitin(new THREE.Color(1, 1, 1), 0.42, true),
      wing: new THREE.MeshPhysicalMaterial({map: wingTex, color: new THREE.Color(0.75, 0.68, 0.6), roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2, side: THREE.DoubleSide, transparent: true, opacity: 0.94}),
      eye: new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.02, 0.015, 0.012), roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05}),
      leg: chitin(new THREE.Color(0.27, 0.17, 0.08), 0.5),
      femur: chitin(new THREE.Color(0.3, 0.19, 0.085), 0.42),
      dark: chitin(new THREE.Color(0.12, 0.08, 0.05), 0.5),
    },
  };
}

export class Insects {
  readonly group = new THREE.Group();
  readonly crickets: Cricket[] = [];
  private parts = cricketParts();

  constructor(private surface: Surface, private nav: Nav) {}

  onSplash?: (x: number, z: number) => void;

  /** Crickets near a point (a lightning strike, a tap) jump away. */
  scatter(p: THREE.Vector3, r: number) {
    for (const c of this.crickets) if (c.pos.distanceTo(p) < r) c.startle(p);
  }

  release(): Cricket {
    const x = (Math.random() - 0.5) * (TANK.w * 0.6), z = (Math.random() - 0.5) * (TANK.d * 0.4) + 0.04;
    const c = new Cricket(new THREE.Vector3(x, TANK.h - 0.03, z), this.parts);
    this.crickets.push(c);
    this.group.add(c.group);
    return c;
  }

  update(dt: number) {
    for (const c of this.crickets) {
      c.update(dt, this.surface, this.nav);
      if (c.splashed) {c.splashed = false; this.onSplash?.(c.pos.x, c.pos.z);}
    }
    for (const c of this.crickets.filter((c) => c.eaten)) this.group.remove(c.group);
    for (let i = this.crickets.length - 1; i >= 0; i--) if (this.crickets[i].eaten) this.crickets.splice(i, 1);
  }

  /** Nearest free cricket on the ground. */
  nearest(p: THREE.Vector3) {
    let best: Cricket | null = null, bd = Infinity;
    for (const c of this.crickets) {
      if (c.caught || c.airborne && c.pos.y > 0.4) continue;
      const d = c.pos.distanceTo(p);
      if (d < bd) {bd = d; best = c;}
    }
    return best;
  }
}
