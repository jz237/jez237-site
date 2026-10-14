import * as THREE from 'three';
import {MeshBVH} from 'three-mesh-bvh';
import {TANK} from './Case';

export interface TailCollision {
  beginStep?(): void;
  touchesSolid?: boolean;
  projectPoint(previous: THREE.Vector3, point: THREE.Vector3, radius: number, normal: THREE.Vector3): boolean;
  projectSegment?(a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number, pinnedA: boolean, na: THREE.Vector3, nb: THREE.Vector3): boolean;
}

const CELL = .006;
type Nearby = {face: number; clearance: number};

/** Static, world-space colliders. Contacts only push out; they never attract a tail to a surface. */
export class TailContacts implements TailCollision {
  touchesSolid = false;
  private solids: {geometry: THREE.BufferGeometry; tree: MeshBVH; box: THREE.Box3; nearby: Map<number, Nearby>; nx: number; ny: number}[];
  private ray = new THREE.Ray();
  private insideRay = new THREE.Ray();
  private insideChecks = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(.91, .21, .35).normalize(), new THREE.Vector3(-.35, .31, -.89).normalize()];
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
  private segmentNormal = new THREE.Vector3();

  constructor(meshes: THREE.Mesh[], private floor: (x: number, z: number) => number, private floorCeiling=Infinity) {
    this.solids = meshes.map(mesh => {
      mesh.updateMatrixWorld(true);
      const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
      const tree = new MeshBVH(geometry);
      geometry.computeBoundingBox();
      const box = geometry.boundingBox!.clone();
      return {geometry, tree, box, nearby: new Map<number, Nearby>(), nx: Math.ceil((box.max.x-box.min.x)/CELL)+1, ny: Math.ceil((box.max.y-box.min.y)/CELL)+1};
    });
  }

  beginStep() {this.touchesSolid = false;}

  /** Static plant clearance, excluding the substrate their roots grow from. */
  overlapsSolid(point: THREE.Vector3, radius = .002) {
    for(const solid of this.solids){
      if(solid.box.distanceToPoint(point)>radius)continue;
      const hit=solid.tree.closestPointToPoint(point,this.closest,0,solid.box.containsPoint(point)?Infinity:radius+1e-8);
      if(!hit)continue;
      if(hit.distance<radius)return true;
      if(solid.box.containsPoint(point) && this.contains(solid.tree,point))return true;
    }
    return false;
  }

  private contains(tree: MeshBVH, point: THREE.Vector3) {
    // A ray grazing a rough bevel can meet a reversed sliver before the entry
    // face. Require agreement from independent directions before ejecting a
    // point from a volume, especially inside an open arch or concave bowl.
    let inside = 0;
    for (const direction of this.insideChecks) {
      this.insideRay.set(point, direction);
      const exit = tree.raycastFirst(this.insideRay, THREE.DoubleSide);
      if (exit && exit.face!.normal.dot(direction) > .00001) inside++;
    }
    return inside >= 2;
  }

  private exitAboveFloor(tree: MeshBVH, point: THREE.Vector3, margin: number) {
    let shortest = Infinity;
    for (const direction of this.escapes) {
      this.ray.set(point, direction);
      const hit = tree.raycastFirst(this.ray, THREE.DoubleSide);
      if (!hit || hit.face!.normal.dot(direction) <= 0) continue;
      this.candidate.copy(hit.point).addScaledVector(hit.face!.normal, margin);
      // A side exit can sit just beneath uneven sand. Lift that exit onto the
      // floor and verify it is free instead of ejecting to a distant rock top.
      this.candidate.y=Math.max(this.candidate.y,this.floor(this.candidate.x,this.candidate.z)+margin);
      if(this.contains(tree,this.candidate))continue;
      const distance = point.distanceToSquared(this.candidate);
      if (distance >= shortest) continue;
      shortest = distance; this.bestPoint.copy(this.candidate); this.bestNormal.copy(hit.face!.normal);
    }
    return Number.isFinite(shortest);
  }

  private triangle(geometry: THREE.BufferGeometry, face: number) {
    const p = geometry.attributes.position, index = geometry.index;
    const vertex = (i: number) => index ? index.getX(face * 3 + i) : face * 3 + i;
    this.tri.a.fromBufferAttribute(p, vertex(0));
    this.tri.b.fromBufferAttribute(p, vertex(1));
    this.tri.c.fromBufferAttribute(p, vertex(2));
    return this.tri;
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
    // Most samples are clear of every solid. Build their swept bounds once,
    // rebuilding only when a real contact changes the point.
    this.box.makeEmpty().expandByPoint(previous).expandByPoint(point).expandByScalar(margin);
    for (const solid of this.solids) {
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
          this.box.makeEmpty().expandByPoint(previous).expandByPoint(point).expandByScalar(margin);
        }
      }
      // Outside a solid's bounds, only surfaces within the contact radius can
      // matter. Do not traverse distant triangles for a thin toe or tail tip.
      // Keep the wider search inside the bounds so deep overlaps still escape.
      const inBounds=solid.box.containsPoint(point);
      let maximum = inBounds ? .08 : Math.min(.08,margin), cell = -1, cellRadius = 0;
      let cached: Nearby | undefined;
      if (inBounds) {
        const x=(point.x-solid.box.min.x)/CELL,y=(point.y-solid.box.min.y)/CELL,z=(point.z-solid.box.min.z)/CELL;
        const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
        cell = ix + solid.nx*(iy + solid.ny*iz);
        cached = solid.nearby.get(cell);
        // A ball around a proven exterior point cannot cross the surface before
        // its nearest triangle distance. Subtract the farthest cell corner to
        // obtain a conservative clearance for EVERY point in this cell.
        if(cached && cached.clearance>=margin)continue;
        cellRadius=CELL*Math.hypot(.5+Math.abs(x-ix-.5),.5+Math.abs(y-iy-.5),.5+Math.abs(z-iz-.5));
        if (cached) {
          // Any real triangle supplies an upper bound on nearest distance.
          // Seed the exact BVH search with a nearby face; never reuse its answer
          // or approximate the contact, including across edges and concavities.
          this.triangle(solid.geometry, cached.face).closestPointToPoint(point, this.surfacePoint);
          maximum = Math.min(maximum, point.distanceTo(this.surfacePoint)+1e-8);
        }
      }
      const hit = solid.tree.closestPointToPoint(point, this.closest, 0, maximum);
      if (!hit) continue;
      const n = this.triangle(solid.geometry, hit.faceIndex).getNormal(this.faceNormal);
      this.direction.subVectors(point, hit.point);
      let inside = false;
      if (inBounds && this.direction.dot(n) < -0.00001) {
        // At a concave rim the nearest triangle can face away from a point that
        // is still in free air. Confirm volume occupancy before ejecting it.
        inside = this.contains(solid.tree, point);
      }
      if(cell>=0){
        if(solid.nearby.size>=32768)solid.nearby.clear();
        let clearance=inside ? 0 : Math.max(0,hit.distance-cellRadius);
        // A reversed bevel may have an outward nearest-face normal even for
        // an interior point. Only volume-confirmed exterior cells can bypass
        // future contact queries, regardless of that face's orientation.
        if(clearance>(cached?.clearance??0) && this.contains(solid.tree,point))clearance=0;
        if(cached){cached.face=hit.faceIndex;cached.clearance=Math.max(cached.clearance,clearance);}
        else solid.nearby.set(cell,{face:hit.faceIndex,clearance});
      }
      if (!inside && hit.distance >= margin) continue;
      if (!inside && hit.distance > 0.000001) this.direction.divideScalar(hit.distance);
      else this.direction.copy(n);
      const amount = inside ? margin + hit.distance : margin - hit.distance;
      this.candidate.copy(point).addScaledVector(this.direction, amount);
      // A buried rock/log base is not an available exit. Resolve into free space
      // beside it instead of fighting the sand with alternating down/up pushes.
      if (inside && this.candidate.y < this.floorCeiling + margin && this.candidate.y < this.floor(this.candidate.x, this.candidate.z) + margin && this.exitAboveFloor(solid.tree, point, margin)) {
        point.copy(this.bestPoint); this.direction.copy(this.bestNormal);
      } else point.addScaledVector(this.direction, amount);
      normal.add(this.direction); contact = true;
      this.touchesSolid = true;
      this.box.makeEmpty().expandByPoint(previous).expandByPoint(point).expandByScalar(margin);
    }
    // Noise-based sand height is expensive. Its known upper bound rejects
    // elevated limb/tail samples without changing any possible ground contact.
    if(point.y < this.floorCeiling + margin){
      const ground = this.floor(point.x, point.z) + margin;
      if (point.y < ground) {point.y = ground; normal.y += 1; contact = true;}
    }
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
      let deepest = 0, weightA = 0, weightB = 0;
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
          triangle.getNormal(this.faceNormal);
          if (this.direction.dot(this.faceNormal) < -.00001 && solid.box.containsPoint(this.axisPoint)) {
            if (this.contains(solid.tree, this.axisPoint)) this.direction.copy(this.faceNormal);
          }
          const wa = pinnedA ? 0 : 1 - t, wb = t;
          const denominator = wa * (1 - t) + wb * t;
          if (denominator < 0.04) return false; // the pelvis is kinematic
          const correction = Math.min(0.025, (radius - distance) / denominator);
          if (correction > deepest) {
            deepest = correction; weightA = wa; weightB = wb; this.segmentNormal.copy(this.direction);
          }
          return false;
        },
      });
      if (deepest > 0) {
        // One contact manifold correction per solid/pass avoids neighbouring
        // triangles alternately kicking the same capsule in opposite directions.
        a.addScaledVector(this.segmentNormal, deepest * weightA);
        b.addScaledVector(this.segmentNormal, deepest * weightB);
        this.line.set(a, b);
        this.box.makeEmpty().expandByPoint(a).expandByPoint(b).expandByScalar(Math.max(ra, rb) + skin);
        na.addScaledVector(this.segmentNormal, weightA); nb.addScaledVector(this.segmentNormal, weightB);
        contact = this.touchesSolid = true;
      }
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
