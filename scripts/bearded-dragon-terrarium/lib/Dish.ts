import * as THREE from 'three';
import {TANK} from './Case';
import {caveKeepClear, poolDistance} from './Ground';
import {Surface, SurfaceKind} from './Surface';

import {createFoodTray, FOOD_PORTIONS, FOOD_HEIGHT} from './FoodTray';

/**
 * A shallow stone dish of chopped greens and squash on the floor. The dragon
 * grazes from it now and then, a bite at a time; the Feed tool refills it.
 */
export class Dish {
  readonly group = new THREE.Group();
  readonly bowl: THREE.Mesh;
  readonly centre = new THREE.Vector3();
  readonly radius = 0.057;
  private pieces: THREE.Object3D[] = [];
  private left = FOOD_PORTIONS;
  readonly foodHeight = FOOD_HEIGHT;

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

  constructor(surface: Pick<Surface, 'heightAt'>, x: number, z: number, stonePhoto?: THREE.Texture) {
    this.centre.set(x, surface.heightAt(x, z), z);
    const {bowl, portions} = createFoodTray(this.centre, this.radius, stonePhoto);
    this.bowl = bowl;
    this.group.add(bowl, ...portions);
    this.pieces = portions;
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
    this.left = FOOD_PORTIONS;
  }
}
