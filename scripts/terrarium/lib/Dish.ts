import * as THREE from 'three';
import {TANK} from './Case';
import {caveKeepClear, poolDistance} from './Ground';
import {Surface, SurfaceKind} from './Surface';

const PIECES = 14;

/**
 * A shallow stone dish of chopped greens and squash on the floor. The dragon
 * grazes from it now and then, a bite at a time; the Feed tool refills it.
 */
export class Dish {
  readonly group = new THREE.Group();
  readonly centre = new THREE.Vector3();
  readonly radius = 0.032;
  private pieces: THREE.Object3D[] = [];
  private left = PIECES;

  /** Finds open, level, dry ground at the front, clear of the plants. */
  static findSpot(surface: Surface, obstacles: {x: number; z: number; r: number}[]): [number, number] {
    let best: [number, number] = [-0.2, 0.17], bestScore = -Infinity;
    for (let x = -0.5; x <= 0.0; x += 0.01) for (let z = 0.13; z <= TANK.d / 2 - 0.05; z += 0.01) {
      if (surface.kindAt(x, z) !== SurfaceKind.Ground || caveKeepClear(x, z) || poolDistance(x, z) < 0.12) continue;
      if (surface.normalAt(x, z).y < 0.93) continue;
      let clear = Infinity;
      for (const o of obstacles) clear = Math.min(clear, Math.hypot(x - o.x, z - o.z) - o.r);
      // room for the dish and for the dragon to stand at it, near the middle of the front
      const score = Math.min(clear, 0.09) - Math.abs(x + 0.22) * 0.05;
      if (score > bestScore) {bestScore = score; best = [x, z];}
    }
    return best;
  }

  constructor(surface: Surface, x: number, z: number) {
    const y = surface.heightAt(x, z);
    this.centre.set(x, y, z);
    // a shallow, rough stone dish
    const R = this.radius;
    const prof = [[0, 0.002], [R * 0.75, 0.0025], [R * 0.9, 0.004], [R, 0.009], [R * 1.08, 0.0105], [R * 1.14, 0.009], [R * 1.12, 0.0], [R * 0.9, -0.004]].map(([r, h]) => new THREE.Vector2(r, h));
    const dg = new THREE.LatheGeometry(prof, 40);
    const pos = dg.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const a = Math.atan2(pos.getZ(i), pos.getX(i));
      const n = 1 + 0.03 * Math.sin(a * 5 + 1) + 0.02 * Math.sin(a * 11);
      pos.setX(i, pos.getX(i) * n);
      pos.setZ(i, pos.getZ(i) * n);
    }
    dg.computeVertexNormals();
    const stone = new THREE.MeshStandardMaterial({color: new THREE.Color(0.16, 0.14, 0.12), roughness: 0.85});
    stone.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vDP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvDP = position;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vDP;
float dh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float dn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(dh(i), dh(i+vec3(1,0,0)), f.x), mix(dh(i+vec3(0,1,0)), dh(i+vec3(1,1,0)), f.x), f.y), mix(mix(dh(i+vec3(0,0,1)), dh(i+vec3(1,0,1)), f.x), mix(dh(i+vec3(0,1,1)), dh(i+vec3(1,1,1)), f.x), f.y), f.z); }`)
        .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= 0.75 + 0.5 * dn(vDP * 900.0) * dn(vDP * 260.0 + 3.0);');
    };
    const dish = new THREE.Mesh(dg, stone);
    dish.receiveShadow = true;
    dish.castShadow = true;
    dish.position.copy(this.centre).add(new THREE.Vector3(0, -0.002, 0));
    this.group.add(dish);
    // the salad: torn leaves of greens and a few cubes of squash
    const leafMat = new THREE.MeshStandardMaterial({color: 0xffffff, vertexColors: true, roughness: 0.5, side: THREE.DoubleSide});
    const squashMat = new THREE.MeshStandardMaterial({color: new THREE.Color(0.75, 0.32, 0.04), roughness: 0.55});
    for (let i = 0; i < PIECES; i++) {
      const a = (i / PIECES) * Math.PI * 2 * 2.3 + Math.random() * 0.5, r = Math.sqrt((i + 0.5) / PIECES) * R * 0.78;
      let m: THREE.Mesh;
      if (i % 4 === 3) {
        m = new THREE.Mesh(new THREE.BoxGeometry(0.0045, 0.0042, 0.0048), squashMat);
      } else {
        const g = new THREE.CircleGeometry(0.0062 + Math.random() * 0.003, 9);
        const p = g.attributes.position as THREE.BufferAttribute;
        const col = new Float32Array(p.count * 3);
        const c = new THREE.Color().setHSL(0.24 + Math.random() * 0.07, 0.65, 0.12 + Math.random() * 0.08);
        for (let k = 0; k < p.count; k++) {
          // torn edges and a crinkle; paler at the midrib
          const ang = Math.atan2(p.getY(k), p.getX(k)), rr = Math.hypot(p.getX(k), p.getY(k));
          const tear = 1 - 0.25 * Math.max(0, Math.sin(ang * 3 + i));
          p.setXYZ(k, p.getX(k) * tear, p.getY(k) * tear, Math.sin(ang * 4 + i) * rr * 0.25);
          const mid = Math.exp(-((p.getY(k) / 0.0012) ** 2));
          col.set([c.r + mid * 0.08, c.g + mid * 0.1, c.b + mid * 0.03], k * 3);
        }
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        g.computeVertexNormals();
        m = new THREE.Mesh(g, leafMat);
        m.rotation.set(-Math.PI / 2 + (Math.random() - 0.5) * 0.6, 0, Math.random() * Math.PI * 2);
      }
      m.position.set(this.centre.x + Math.cos(a) * r, this.centre.y + 0.004 + (i % 3) * 0.0012, this.centre.z + Math.sin(a) * r);
      if (i % 4 === 3) m.rotation.set(Math.random(), Math.random() * 3, Math.random());
      m.castShadow = true;
      this.group.add(m);
      this.pieces.push(m);
    }
    this.group.name = 'greens-dish';
  }

  get remaining() {return this.left;}

  /** Bites out the nearest piece to `p`; returns where it was, or null when empty. */
  take(p: THREE.Vector3): THREE.Vector3 | null {
    let best: THREE.Object3D | null = null, bd = Infinity;
    for (const m of this.pieces) if (m.visible) {const d = m.position.distanceTo(p); if (d < bd) {bd = d; best = m;}}
    if (!best) return null;
    best.visible = false;
    this.left--;
    return best.position.clone();
  }

  /** Is `p` (a pointer hit) on the dish? */
  hit(p: THREE.Vector3) {return Math.hypot(p.x - this.centre.x, p.z - this.centre.z) < this.radius * 1.3 && Math.abs(p.y - this.centre.y) < 0.03;}

  refill() {
    for (const m of this.pieces) m.visible = true;
    this.left = PIECES;
  }
}
