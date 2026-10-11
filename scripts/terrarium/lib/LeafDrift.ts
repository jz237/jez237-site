import * as THREE from 'three';
import {TANK} from './Case';
import {WATER_LEVEL, poolDistance, caveKeepClear} from './Ground';
import {Surface, SurfaceKind} from './Surface';
import type {WindField} from './WindField';
import {leafGeometry, leafMaterial} from './Plants';

const N = 34;

interface Leaf {
  p: THREE.Vector3; v: THREE.Vector3; q: THREE.Quaternion;
  spin: THREE.Vector3; spinRate: number; airborne: boolean; floating: boolean;
  lift: number; scale: number; phase: number; rest: number;
}

/**
 * Dead leaves lying loose on the floor. A strong enough local wind (a stroke
 * of the wind tool, a storm's downdraught) lifts them: they tumble along with
 * the air, flutter as they fall and settle again, or float on the pool.
 */
export class LeafDrift {
  readonly mesh: THREE.InstancedMesh;
  private leaves: Leaf[] = [];
  private w = new THREE.Vector2();
  private m = new THREE.Matrix4();
  private time = 0;

  constructor(private surface: Surface, private wind: WindField) {
    const g = leafGeometry({length: 1, width: 0.52, shape: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.8), arch: 0.04, cup: 0.18, twist: 0.3, segs: [8, 4]});
    g.translate(-0.5, 0, 0); // tumble about the middle of the blade
    const n = g.attributes.position.count;
    g.setAttribute('aKind', new THREE.BufferAttribute(new Float32Array(n).fill(5), 1));
    g.setAttribute('aTint', new THREE.BufferAttribute(new Float32Array(n).fill(0.5), 1));
    this.mesh = new THREE.InstancedMesh(g, leafMaterial(true), N);
    const tint = new Float32Array(N);
    for (let i = 0; i < N; i++) tint[i] = Math.random();
    this.mesh.geometry.setAttribute('aInstTint', new THREE.InstancedBufferAttribute(tint, 1));
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.name = 'leaf-drift';
    for (let i = 0; i < N; i++) {
      const leaf: Leaf = {p: new THREE.Vector3(), v: new THREE.Vector3(), q: new THREE.Quaternion(), spin: new THREE.Vector3(), spinRate: 0, airborne: false, floating: false, lift: 0.5 + Math.random() * 0.45, scale: 0.01 + Math.random() * 0.007, phase: Math.random() * 10, rest: 0};
      this.place(leaf);
      this.leaves.push(leaf);
    }
    this.sync();
  }

  /** Puts a leaf down somewhere on open ground. */
  private place(l: Leaf) {
    for (let k = 0; k < 60; k++) {
      const x = (Math.random() - 0.5) * (TANK.w - 0.08), z = (Math.random() - 0.5) * (TANK.d - 0.08);
      const kind = this.surface.kindAt(x, z);
      if (kind === SurfaceKind.Water || kind === SurfaceKind.Rock || caveKeepClear(x, z) || poolDistance(x, z) < 0.02) continue;
      l.p.set(x, this.surface.heightAt(x, z), z);
      this.settle(l);
      return;
    }
  }

  /** Lies flat on whatever is underneath, at a random angle. */
  private settle(l: Leaf) {
    const n = this.surface.normalAt(l.p.x, l.p.z, new THREE.Vector3());
    l.q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2));
    l.p.y += 0.0012;
    l.airborne = false;
    l.v.set(0, 0, 0);
    l.rest = 0;
  }

  update(dt: number) {
    this.time += dt;
    const up = new THREE.Vector3(0, 1, 0);
    for (const l of this.leaves) {
      this.wind.sample(l.p.x, l.p.z, this.w);
      const speed = this.w.length();
      if (!l.airborne) {
        l.rest += dt;
        if (l.floating) {
          // drift slowly on the surface with the breeze
          l.p.x += this.w.x * 0.06 * dt;
          l.p.z += this.w.y * 0.06 * dt;
          if (poolDistance(l.p.x, l.p.z) > -0.01) {l.p.x -= this.w.x * 0.06 * dt; l.p.z -= this.w.y * 0.06 * dt;}
        }
        // a strong enough gust under the leaf picks it up
        if (speed > l.lift && l.rest > 0.4 && Math.random() < dt * 6 * (speed - l.lift)) {
          l.airborne = true;
          l.floating = false;
          l.v.set(this.w.x * 0.5, 0.12 + 0.18 * Math.min(1.5, speed), this.w.y * 0.5);
          l.spin.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
          l.spinRate = 4 + Math.random() * 8;
        }
        continue;
      }
      // in the air: carried by the wind, falling slowly with a flutter
      const drag = 1 - Math.exp(-dt * 3.2);
      l.v.x += (this.w.x - l.v.x) * drag;
      l.v.z += (this.w.y - l.v.z) * drag;
      const sink = -0.18 + Math.min(0.2, speed * 0.12) + Math.sin(this.time * 7 + l.phase) * 0.12;
      l.v.y += (sink - l.v.y) * (1 - Math.exp(-dt * 2.5));
      l.p.addScaledVector(l.v, dt);
      // spin, tipping toward flat as it slows
      l.q.premultiply(new THREE.Quaternion().setFromAxisAngle(l.spin, l.spinRate * dt));
      l.spinRate *= Math.exp(-dt * (speed > l.lift ? 0.2 : 1.2));
      // the glass
      const mx = TANK.w / 2 - 0.012, mz = TANK.d / 2 - 0.012;
      if (Math.abs(l.p.x) > mx) {l.p.x = Math.sign(l.p.x) * mx; l.v.x *= -0.3;}
      if (Math.abs(l.p.z) > mz) {l.p.z = Math.sign(l.p.z) * mz; l.v.z *= -0.3;}
      if (l.p.y > TANK.h - 0.03) {l.p.y = TANK.h - 0.03; l.v.y = Math.min(0, l.v.y);}
      // land on the ground, a rock, the log or the water
      const inPool = poolDistance(l.p.x, l.p.z) < -0.01;
      const floor = inPool ? WATER_LEVEL : this.surface.topAt(l.p.x, l.p.z);
      if (l.p.y <= floor + 0.001 && l.v.y < 0) {
        l.p.y = floor;
        if (inPool) {
          l.floating = true;
          l.q.setFromUnitVectors(up, up).multiply(new THREE.Quaternion().setFromAxisAngle(up, Math.random() * Math.PI * 2));
          l.p.y = WATER_LEVEL + 0.0006;
          l.airborne = false;
          l.v.set(0, 0, 0);
          l.rest = 0;
        } else this.settle(l);
      }
    }
    this.sync();
  }

  private sync() {
    const s = new THREE.Vector3();
    this.leaves.forEach((l, i) => {
      s.setScalar(l.scale);
      this.m.compose(l.p, l.q, s);
      this.mesh.setMatrixAt(i, this.m);
    });
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
