import * as THREE from 'three';

export interface PlantContact {a: THREE.Vector3; b: THREE.Vector3; radius: number; verticalRadius?: number;}
export interface FlexibleShoot {
  axis: THREE.Vector3;
  samples: THREE.Vector3[];
  sampleWeights?: number[];
  maxBend: number;
}
export interface FlexibleInstances {mesh: THREE.InstancedMesh; shoots: number[]; weights: number[];}

const registry = new WeakMap<THREE.Group, PlantFlex>();
export const plantFlexFor = (group: THREE.Group) => registry.get(group);

/** Preserve each leaf/stem's attachment while its outer section bends under pressure. */
export function bindShoot(geometry: THREE.BufferGeometry, shoot: number, weight: (i: number) => number) {
  const count = geometry.getAttribute('position').count;
  geometry.setAttribute('plantShoot', new THREE.Float32BufferAttribute(new Float32Array(count).fill(shoot), 1));
  geometry.setAttribute('plantFlex', new THREE.Float32BufferAttribute(Array.from({length: count}, (_, i) => weight(i)), 1));
}

/** Rooted shoots yield downward to the animal, then recover without spring oscillation. */
export class PlantFlex {
  readonly bends: number[];
  private meshes: {mesh: THREE.Mesh; rest: Float32Array; weights: THREE.BufferAttribute; shoots: THREE.BufferAttribute}[] = [];
  private decorations: {binding: FlexibleInstances; rest: THREE.Matrix4[]}[];
  private contacts: PlantContact[] = [];
  private rotations: THREE.Quaternion[];
  private point = new THREE.Vector3();
  private closest = new THREE.Vector3();
  private direction = new THREE.Vector3();
  private q = new THREE.Quaternion();
  private matrix = new THREE.Matrix4();
  private position = new THREE.Vector3();
  private orientation = new THREE.Quaternion();
  private scale = new THREE.Vector3();
  private bounds = new THREE.Box3();
  private contactBounds = new THREE.Box3();
  private reach = 0;
  private active = false;

  constructor(readonly group: THREE.Group, readonly shoots: FlexibleShoot[], instances: FlexibleInstances[] = []) {
    this.bends = shoots.map(() => 0);
    this.rotations = shoots.map(() => new THREE.Quaternion());
    for (const child of group.children) {
      if (!(child instanceof THREE.Mesh) || child instanceof THREE.InstancedMesh) continue;
      const geometry = child.geometry, weights = geometry.getAttribute('plantFlex'), ids = geometry.getAttribute('plantShoot');
      if (!weights || !ids) continue;
      const p = geometry.getAttribute('position'), n = geometry.getAttribute('normal');
      this.meshes.push({mesh: child, rest: Float32Array.from(p.array), weights: weights as THREE.BufferAttribute, shoots: ids as THREE.BufferAttribute});
      p.setUsage(THREE.DynamicDrawUsage); n.setUsage(THREE.DynamicDrawUsage);
      for (let i = 0; i < p.count; i++) this.reach = Math.max(this.reach, this.point.fromBufferAttribute(p, i).length());
      // Bending preserves radial length; this sphere also contains every bent pose.
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), this.reach + .01);
    }
    this.decorations = instances.map(binding => ({binding, rest: Array.from({length: binding.mesh.count}, (_, i) => {
      const matrix = new THREE.Matrix4(); binding.mesh.getMatrixAt(i, matrix); return matrix;
    })}));
    registry.set(group, this);
  }

  private weight(t: number) {return THREE.MathUtils.smoothstep(t, .015, .22);}

  private intersects(point: THREE.Vector3, padding: number) {
    for (const contact of this.contacts) {
      this.direction.subVectors(contact.b, contact.a);
      const verticalScale = contact.radius / (contact.verticalRadius ?? contact.radius);
      this.direction.y *= verticalScale;
      const length = this.direction.lengthSq();
      this.closest.subVectors(point, contact.a); this.closest.y *= verticalScale;
      const t = length > 1e-10 ? THREE.MathUtils.clamp(this.closest.dot(this.direction) / length, 0, 1) : 0;
      this.closest.addScaledVector(this.direction, -t);
      if (this.closest.lengthSq() < (contact.radius + padding) ** 2) return true;
    }
    return false;
  }

  update(dt: number, contacts: readonly PlantContact[]) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    this.contacts.length = 0;
    this.bounds.setFromCenterAndSize(this.group.position, this.point.setScalar((this.reach + .025) * 2));
    for (const c of contacts) {
      this.contactBounds.makeEmpty().expandByPoint(c.a).expandByPoint(c.b).expandByScalar(c.radius + .012);
      if (!this.bounds.intersectsBox(this.contactBounds)) continue;
      // Plants are rooted in world-aligned groups; solve pressure in the plant's local space.
      this.contacts.push({a: c.a.clone().sub(this.group.position), b: c.b.clone().sub(this.group.position), radius: c.radius, verticalRadius: c.verticalRadius});
    }
    let dirty = this.active;
    for (let i = 0; i < this.shoots.length; i++) {
      const shoot = this.shoots[i]; let target = 0;
      if (this.contacts.length) {
        // Anticipate contact by 8 mm, giving the leaf time to yield before the skin arrives.
        for (let trial = 0; trial <= 24; trial++) {
          target = shoot.maxBend * trial / 24;
          let hit = false;
          for (let j = 1; j < shoot.samples.length; j++) {
            this.q.setFromAxisAngle(shoot.axis, target * this.weight(shoot.sampleWeights?.[j] ?? j / (shoot.samples.length - 1)));
            this.point.copy(shoot.samples[j]).applyQuaternion(this.q);
            if (this.intersects(this.point, .008)) {hit = true; break;}
          }
          if (!hit) break;
        }
      }
      const previous = this.bends[i], rate = target > previous ? 45 : 2.6;
      this.bends[i] = THREE.MathUtils.lerp(previous, target, 1 - Math.exp(-rate * dt));
      if (this.bends[i] < .00003 && target === 0) this.bends[i] = 0;
      dirty ||= this.bends[i] > 0;
      this.rotations[i].setFromAxisAngle(shoot.axis, this.bends[i]);
    }
    if (!dirty) return;
    for (const binding of this.meshes) {
      const geometry = binding.mesh.geometry, p = geometry.getAttribute('position'), n = geometry.getAttribute('normal');
      for (let i = 0; i < p.count; i++) {
        this.q.identity().slerp(this.rotations[binding.shoots.getX(i)], this.weight(binding.weights.getX(i)));
        this.point.fromArray(binding.rest, i * 3).applyQuaternion(this.q);
        // Keep leaves above the substrate even when a foot presses a blade flat.
        this.point.y = Math.max(Math.min(.001, binding.rest[i * 3 + 1]), this.point.y);
        p.setXYZ(i, this.point.x, this.point.y, this.point.z);
      }
      // Accurate shading and contact shadows use the same deformed geometry.
      geometry.computeVertexNormals(); p.needsUpdate = n.needsUpdate = true;
    }
    for (const {binding, rest} of this.decorations) {
      for (let i = 0; i < rest.length; i++) {
        rest[i].decompose(this.position, this.orientation, this.scale);
        this.q.identity().slerp(this.rotations[binding.shoots[i]], this.weight(binding.weights[i]));
        this.position.applyQuaternion(this.q); this.position.y = Math.max(.001, this.position.y);
        this.orientation.premultiply(this.q);
        this.matrix.compose(this.position, this.orientation, this.scale); binding.mesh.setMatrixAt(i, this.matrix);
      }
      binding.mesh.instanceMatrix.needsUpdate = true;
      binding.mesh.computeBoundingSphere();
    }
    this.active = this.bends.some(x => x > 0);
  }
}
