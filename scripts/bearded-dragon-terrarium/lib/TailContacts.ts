import * as THREE from 'three';
import {MeshBVH} from 'three-mesh-bvh';
import {TANK} from './Case';

export interface TailCollision {
  beginStep?(): void;
  touchesSolid?: boolean;
  projectPoint(previous: THREE.Vector3, point: THREE.Vector3, radius: number, normal: THREE.Vector3): boolean;
  projectSegment?(a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number, pinnedA: boolean, na: THREE.Vector3, nb: THREE.Vector3): boolean;
}

/** Static, world-space colliders. Contacts only push out; they never attract a tail to a surface. */
export class TailContacts implements TailCollision {
  touchesSolid = false;
  private solids: {geometry: THREE.BufferGeometry; tree: MeshBVH; box: THREE.Box3}[];
  private ray = new THREE.Ray();
  private insideRay = new THREE.Ray();
  private insideDirection = new THREE.Vector3(.373, .827, .421).normalize();
  private line = new THREE.Line3();
  private box = new THREE.Box3();
  private closest = {point: new THREE.Vector3(), distance: 0, faceIndex: 0};
  private surfacePoint = new THREE.Vector3();
  private axisPoint = new THREE.Vector3();
  private direction = new THREE.Vector3();
  private faceNormal = new THREE.Vector3();
  private tri = new THREE.Triangle();
  private candidate = new THREE.Vector3();
  private bestPoint = new THREE.Vector3();
  private bestNormal = new THREE.Vector3();
  private escapes = Array.from({length: 8}, (_, i) => new THREE.Vector3(Math.cos(i * Math.PI / 4), 0, Math.sin(i * Math.PI / 4))).concat(new THREE.Vector3(0, 1, 0));
  private samplePoint = new THREE.Vector3();
  private sampleBefore = new THREE.Vector3();
  private sampleNormal = new THREE.Vector3();
  private sampleCorrection = new THREE.Vector3();

  constructor(meshes: THREE.Mesh[], private floor: (x: number, z: number) => number) {
    this.solids = meshes.map(mesh => {
      mesh.updateMatrixWorld(true);
      const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
      const tree = new MeshBVH(geometry);
      geometry.computeBoundingBox();
      return {geometry, tree, box: geometry.boundingBox!.clone()};
    });
  }

  beginStep() {this.touchesSolid = false;}

  private exitAboveFloor(tree: MeshBVH, point: THREE.Vector3, margin: number) {
    let shortest = Infinity;
    for (const direction of this.escapes) {
      this.ray.set(point, direction);
      const hit = tree.raycastFirst(this.ray, THREE.DoubleSide);
      if (!hit || hit.face!.normal.dot(direction) <= 0) continue;
      this.candidate.copy(hit.point).addScaledVector(hit.face!.normal, margin);
      if (this.candidate.y < this.floor(this.candidate.x, this.candidate.z) + margin - .0001) continue;
      const distance = point.distanceToSquared(this.candidate);
      if (distance >= shortest) continue;
      shortest = distance; this.bestPoint.copy(this.candidate); this.bestNormal.copy(hit.face!.normal);
    }
    return Number.isFinite(shortest);
  }

  private triangleNormal(geometry: THREE.BufferGeometry, face: number) {
    const p = geometry.attributes.position, index = geometry.index;
    const vertex = (i: number) => index ? index.getX(face * 3 + i) : face * 3 + i;
    this.tri.a.fromBufferAttribute(p, vertex(0));
    this.tri.b.fromBufferAttribute(p, vertex(1));
    this.tri.c.fromBufferAttribute(p, vertex(2));
    return this.tri.getNormal(this.faceNormal);
  }

  projectPoint(previous: THREE.Vector3, point: THREE.Vector3, radius: number, normal: THREE.Vector3) {
    let contact = false;
    const skin = 0.0005, margin = radius + skin;
    const mx = TANK.w / 2 - 0.009 - margin, mz = TANK.d / 2 - 0.009 - margin;
    if (point.x < -mx) {point.x = -mx; normal.x += 1; contact = true;}
    if (point.x > mx) {point.x = mx; normal.x -= 1; contact = true;}
    if (point.z < -mz) {point.z = -mz; normal.z += 1; contact = true;}
    if (point.z > mz) {point.z = mz; normal.z -= 1; contact = true;}
    if (contact) this.touchesSolid = true; // glass
    for (const solid of this.solids) {
      this.box.makeEmpty().expandByPoint(previous).expandByPoint(point).expandByScalar(margin);
      if (!solid.box.intersectsBox(this.box)) continue;
      // Catch a moving joint before it tunnels through a thin branch or stone face.
      this.direction.subVectors(point, previous);
      const travel = this.direction.length();
      if (travel > 0.00001) {
        this.ray.set(previous, this.direction.divideScalar(travel));
        const hit = solid.tree.raycastFirst(this.ray, THREE.DoubleSide, 0, travel);
        if (hit && hit.face!.normal.dot(this.direction) < -0.00001) {
          point.copy(hit.point).addScaledVector(hit.face!.normal, margin);
          normal.add(hit.face!.normal); contact = true;
          this.touchesSolid = true;
        }
      }
      const hit = solid.tree.closestPointToPoint(point, this.closest, 0, 0.08);
      if (!hit) continue;
      const n = this.triangleNormal(solid.geometry, hit.faceIndex);
      this.direction.subVectors(point, hit.point);
      let inside = false;
      if (solid.box.containsPoint(point) && this.direction.dot(n) < -0.00001) {
        // At a concave rim the nearest triangle can face away from a point that
        // is still in free air. Confirm volume occupancy before ejecting it.
        this.insideRay.set(point, this.insideDirection);
        const exit = solid.tree.raycastFirst(this.insideRay, THREE.DoubleSide);
        inside = !!exit && exit.face!.normal.dot(this.insideDirection) > 0;
      }
      if (!inside && hit.distance >= margin) continue;
      if (!inside && hit.distance > 0.000001) this.direction.divideScalar(hit.distance);
      else this.direction.copy(n);
      const amount = inside ? margin + hit.distance : margin - hit.distance;
      this.candidate.copy(point).addScaledVector(this.direction, amount);
      // A buried rock/log base is not an available exit. Resolve into free space
      // beside it instead of fighting the sand with alternating down/up pushes.
      if (inside && this.candidate.y < this.floor(this.candidate.x, this.candidate.z) + margin && this.exitAboveFloor(solid.tree, point, margin)) {
        point.copy(this.bestPoint); this.direction.copy(this.bestNormal);
      } else point.addScaledVector(this.direction, amount);
      normal.add(this.direction); contact = true;
      this.touchesSolid = true;
    }
    const ground = this.floor(point.x, point.z) + margin;
    if (point.y < ground) {point.y = ground; normal.y += 1; contact = true;}
    return contact;
  }

  projectSegment(a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number, pinnedA: boolean, na: THREE.Vector3, nb: THREE.Vector3) {
    let contact = false;
    const skin = 0.0007;
    this.line.set(a, b);
    this.box.makeEmpty().expandByPoint(a).expandByPoint(b).expandByScalar(Math.max(ra, rb) + skin);
    for (const solid of this.solids) {
      if (!solid.box.intersectsBox(this.box)) continue;
      this.direction.subVectors(b, a);
      const length = this.direction.length();
      if (length > .00001) {
        this.ray.set(a, this.direction.divideScalar(length));
        const entry = solid.tree.raycastFirst(this.ray, THREE.DoubleSide, .00001, length);
        if (entry && entry.face!.normal.dot(this.direction) < -.00001) {
          // A centre line that crosses a wall must exit on one side as a whole;
          // opposing triangle pushes would otherwise stretch it through the wall.
          this.direction.copy(entry.face!.normal);
          const da = this.axisPoint.subVectors(a, entry.point).dot(this.direction);
          const db = this.surfacePoint.subVectors(b, entry.point).dot(this.direction);
          const push = Math.min(.025, Math.max(ra, rb) + skin - Math.min(da, db));
          if (!pinnedA) {a.addScaledVector(this.direction, push); na.add(this.direction);}
          b.addScaledVector(this.direction, push); nb.add(this.direction);
          this.line.set(a, b);
          this.box.makeEmpty().expandByPoint(a).expandByPoint(b).expandByScalar(Math.max(ra, rb) + skin);
          contact = this.touchesSolid = true;
        }
      }
      solid.tree.shapecast({
        intersectsBounds: box => box.intersectsBox(this.box),
        intersectsTriangle: triangle => {
          const distance = triangle.closestPointToSegment(this.line, this.surfacePoint, this.axisPoint);
          const t = this.line.closestPointToPointParameter(this.axisPoint, true);
          const radius = THREE.MathUtils.lerp(ra, rb, t) + skin;
          if (distance >= radius) return false;
          this.direction.subVectors(this.axisPoint, this.surfacePoint);
          if (distance > 0.000001) this.direction.divideScalar(distance);
          else triangle.getNormal(this.direction);
          const wa = pinnedA ? 0 : 1 - t, wb = t;
          const denominator = wa * (1 - t) + wb * t;
          if (denominator < 0.04) return false; // the pelvis is kinematic
          const correction = Math.min(0.025, (radius - distance) / denominator);
          a.addScaledVector(this.direction, correction * wa);
          b.addScaledVector(this.direction, correction * wb);
          this.line.set(a, b);
          na.addScaledVector(this.direction, wa); nb.addScaledVector(this.direction, wb);
          contact = true;
          this.touchesSolid = true;
          return false;
        },
      });
    }
    if (contact) for (const t of [.25, .5, .75]) {
      // A bone can cross a narrow rim with both joints outside the solid. A
      // volume sample selects a real escape through the opening in that case.
      this.samplePoint.lerpVectors(a, b, t); this.sampleBefore.copy(this.samplePoint); this.sampleNormal.set(0, 0, 0);
      this.projectPoint(this.sampleBefore, this.samplePoint, THREE.MathUtils.lerp(ra, rb, t), this.sampleNormal);
      this.sampleCorrection.subVectors(this.samplePoint, this.sampleBefore);
      const wa = pinnedA ? 0 : 1 - t, wb = t, denominator = wa * (1 - t) + wb * t;
      this.sampleCorrection.divideScalar(denominator).clampLength(0, .025);
      a.addScaledVector(this.sampleCorrection, wa); b.addScaledVector(this.sampleCorrection, wb);
      na.addScaledVector(this.sampleNormal, wa); nb.addScaledVector(this.sampleNormal, wb);
    }
    return contact;
  }
}
