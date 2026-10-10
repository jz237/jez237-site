import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type {Surface} from './Surface';
import type {Nav} from './Nav';
import {TANK} from './Case';
import {WATER_LEVEL} from './Ground';

/** A feeder cricket: falls in from the lid, then walks and hops about until caught. */
export class Cricket {
  readonly group = new THREE.Group();
  readonly pos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  heading = Math.random() * Math.PI * 2;
  airborne = true;
  caught = false;
  eaten = false;
  private hopT = 0.5 + Math.random();
  private walkT = 0;
  private antenna: THREE.Line[] = [];
  private t = Math.random() * 10;
  private hindLegs: THREE.Object3D[] = [];
  age = 0;

  constructor(start: THREE.Vector3, material: THREE.Material, geo: THREE.BufferGeometry, legGeo: THREE.BufferGeometry) {
    this.pos.copy(start);
    const body = new THREE.Mesh(geo, material);
    body.castShadow = true;
    this.group.add(body);
    for (const s of [-1, 1]) {
      const leg = new THREE.Group();
      const thigh = new THREE.Mesh(legGeo, material);
      thigh.castShadow = true;
      leg.add(thigh);
      leg.position.set(-0.002, 0.0015, 0.0018 * s);
      leg.rotation.set(0.35 * s, 0, 0.55);
      this.hindLegs.push(leg);
      this.group.add(leg);
      const ant = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length: 8}, (_, i) => new THREE.Vector3(0.008 + i * 0.0035, 0.002 + i * 0.0012, s * i * 0.0012))), new THREE.LineBasicMaterial({color: 0x2a1a10}));
      this.antenna.push(ant);
      this.group.add(ant);
    }
  }

  update(dt: number, surface: Surface, nav: Nav) {
    this.t += dt;
    this.age += dt;
    if (this.caught) return;
    const ground = surface.heightAt(this.pos.x, this.pos.z);
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
        if (ground <= WATER_LEVEL + 0.001) {
          // landed in the pool: kick back toward the shore
          this.vel.set(-Math.cos(this.heading) * 0.6, 1.2, Math.sin(this.heading) * 0.6);
          this.airborne = true;
        }
      }
    } else {
      this.hopT -= dt;
      this.walkT -= dt;
      if (this.hopT < 0) {
        this.hopT = 1.5 + Math.random() * 4;
        // pick a hop that lands on open ground
        let s = 0.35 + Math.random() * 0.45;
        for (let k = 0; k < 8; k++) {
          const h = this.heading + (Math.random() - 0.5) * 2.2 * (k + 1) * 0.5;
          const lx = this.pos.x + Math.cos(h) * s * 0.3, lz = this.pos.z - Math.sin(h) * s * 0.3;
          if (nav.walkable(lx, lz)) {this.heading = h; break;}
          if (k === 7) s = 0.15;
        }
        this.vel.set(Math.cos(this.heading) * s, 0.9 + Math.random() * 0.5, -Math.sin(this.heading) * s);
        this.airborne = true;
      } else if (this.walkT < 0.4) {
        // short scuttles
        const fx = Math.cos(this.heading), fz = -Math.sin(this.heading);
        const nx = this.pos.x + fx * 0.03 * dt, nz = this.pos.z + fz * 0.03 * dt;
        if (nav.walkable(nx, nz)) {this.pos.x = nx; this.pos.z = nz;} else this.heading += 1.5;
        this.pos.y = surface.heightAt(this.pos.x, this.pos.z);
        if (this.walkT < 0) this.walkT = 0.8 + Math.random() * 1.5;
      }
    }
    this.group.position.copy(this.pos);
    this.group.rotation.set(0, this.heading, this.airborne ? -0.3 : 0);
    for (const [i, a] of this.antenna.entries()) a.rotation.set(Math.sin(this.t * 7 + i) * 0.15, Math.sin(this.t * 5 + i * 2) * 0.25, Math.sin(this.t * 3 + i) * 0.1);
    for (const l of this.hindLegs) l.rotation.z = this.airborne ? 0.1 : 0.55;
  }
}

export class Insects {
  readonly group = new THREE.Group();
  readonly crickets: Cricket[] = [];
  private material: THREE.MeshStandardMaterial;
  private body: THREE.BufferGeometry;
  private leg: THREE.BufferGeometry;

  constructor(private surface: Surface, private nav: Nav) {
    this.material = new THREE.MeshStandardMaterial({color: new THREE.Color(0.19, 0.11, 0.05), roughness: 0.45});
    const parts: THREE.BufferGeometry[] = [];
    const abdomen = new THREE.SphereGeometry(0.0035, 14, 10);
    abdomen.scale(1.9, 0.85, 1);
    abdomen.translate(-0.004, 0.0028, 0);
    const thorax = new THREE.SphereGeometry(0.0028, 12, 8);
    thorax.scale(1.2, 0.95, 1.05);
    thorax.translate(0.0025, 0.003, 0);
    const head = new THREE.SphereGeometry(0.0024, 12, 8);
    head.translate(0.006, 0.0032, 0);
    parts.push(abdomen, thorax, head);
    for (const s of [-1, 1]) for (const k of [0, 1]) {
      const l = new THREE.CylinderGeometry(0.00035, 0.0003, 0.007, 5);
      l.rotateX((Math.PI / 2.6) * s);
      l.translate(0.004 - k * 0.003, 0.0012, s * 0.0028);
      parts.push(l);
    }
    for (const s of [-1, 1]) {
      const c = new THREE.CylinderGeometry(0.0003, 0.0001, 0.006, 4);
      c.rotateZ(Math.PI / 2 + 0.3);
      c.rotateY(0.25 * s);
      c.translate(-0.011, 0.0032, s * 0.0012);
      parts.push(c);
    }
    this.body = mergeGeometries(parts.map((p) => p.toNonIndexed()))!;
    this.body.computeVertexNormals();
    this.leg = new THREE.CylinderGeometry(0.0008, 0.0004, 0.011, 6);
    this.leg.rotateZ(Math.PI / 2);
    this.leg.translate(-0.005, 0, 0);
  }

  release(): Cricket {
    const x = (Math.random() - 0.5) * (TANK.w * 0.6), z = (Math.random() - 0.5) * (TANK.d * 0.4) + 0.04;
    const c = new Cricket(new THREE.Vector3(x, TANK.h - 0.03, z), this.material, this.body, this.leg);
    this.crickets.push(c);
    this.group.add(c.group);
    return c;
  }

  update(dt: number) {
    for (const c of this.crickets) c.update(dt, this.surface, this.nav);
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
