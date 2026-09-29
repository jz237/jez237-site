import * as T from 'three';
import { finishCoupeDent } from './coupe-realism';
const impactBounds = new T.Box3();

/** Every skin, seal, window and inner panel is bent in metres in the same
 * vehicle frame. Mesh origins and export transforms must not open seams. */
export function prepareWreckGeometry(root: T.Group) {
  root.updateMatrixWorld(true);
  const inverse = root.matrixWorld.clone().invert();
  root.traverse(object => {
    if (!(object instanceof T.Mesh)) return;
    let parent = object.parent;
    while (parent && parent !== root) {
      if (parent.name.startsWith('wheel_')) return;
      parent = parent.parent;
    }
    if (object.name.startsWith('detail_')) object.name = 'panel_inner_' + object.name.slice(7);
    if (!/^(panel_|glass_)/.test(object.name)) return;
    if (!object.userData.original) {
      object.geometry = object.geometry.clone();
      object.userData.original = new Float32Array(object.geometry.attributes.position.array);
      object.userData.originalNormals = new Float32Array(object.geometry.attributes.normal.array);
      object.geometry.setAttribute('impactWear', new T.BufferAttribute(new Float32Array(object.geometry.attributes.position.count * 2), 2));
      object.userData.damage = 0;
    }
    object.userData.wreckToModel = new T.Matrix4().multiplyMatrices(inverse, object.matrixWorld);
    object.userData.wreckFromModel = object.userData.wreckToModel.clone().invert();
    const rest = new T.BufferAttribute(new Float32Array(object.userData.original), 3);
    rest.applyMatrix4(object.userData.wreckToModel);
    object.userData.wreckRest = rest;
    object.geometry.setAttribute('wreckPosition', rest.clone());
    object.geometry.setAttribute('restPosition',new T.BufferAttribute(new Float32Array(object.userData.original),3));
    object.geometry.setAttribute('impactAxis',new T.BufferAttribute(new Float32Array(rest.count*3),3));
    const bounds = new T.Box3().setFromBufferAttribute(rest);
    const name = object.name.toLowerCase();
    object.userData.detachAssembly = name.includes('mirror') ? (bounds.getCenter(new T.Vector3()).x < 0 ? 'mirror-left' : 'mirror-right')
      : /bumper_front|bumper_grille|bumper_intake|bodyhoodunder/.test(name) ? 'front-bumper'
      : /bumper_rear/.test(name) ? 'rear-bumper'
      : /panel_hood\d*|bodyhood(topgrill|interior02)/.test(name) ? 'hood' : null;
  });
}

export function dentGeometry(mesh: T.Mesh, contact: T.Vector3, direction: T.Vector3, damage: number) {
  const g = mesh.geometry, position = g.attributes.position;
  const rest = mesh.userData.wreckRest as T.BufferAttribute;
  const toModel = mesh.userData.wreckToModel as T.Matrix4, fromModel = mesh.userData.wreckFromModel as T.Matrix4;
  const radius = Math.min(1.48, .65 + damage * .034);
  // Conservative model-space broad phase: skip only panels entirely outside
  // the impact sphere. Bounds follow previous dents and arbitrary export axes.
  if (!g.boundingBox) g.computeBoundingBox();
  if (impactBounds.copy(g.boundingBox!).applyMatrix4(toModel).distanceToPoint(contact) >= radius) return 0;
  const wear = g.attributes.impactWear;
  const tangent = new T.Vector3(0, 1, 0).cross(direction);
  if (tangent.lengthSq() < .001) tangent.set(1, 0, 0);
  tangent.normalize();
  const vertical = new T.Vector3().crossVectors(tangent, direction).normalize();
  const orig = new T.Vector3(), current = new T.Vector3(), offset = new T.Vector3();
  let maximum = 0;
  for (let i = 0; i < position.count; i++) {
    orig.fromBufferAttribute(rest, i);
    current.fromBufferAttribute(position, i).applyMatrix4(toModel);
    if (current.distanceToSquared(contact) >= radius * radius) continue;
    // Continuous strength through the safety cell keeps the glass and its
    // aperture together. Roof strikes still crush the roof; a door strike
    // cannot pull the roof edge through the occupant compartment.
    const roof = T.MathUtils.smoothstep(orig.y, 1.1, 1.5) * (1 - Math.abs(direction.y));
    let accumulated = 0;
    // Advect in small bounded increments through the current dent. Reapplying
    // a full offset to rest vertices folds triangles through one another on
    // repeated hits, producing saw-toothed tears instead of compressed metal.
    for (let step=0;step<8;step++) {
      offset.copy(current).sub(contact);
      const distance=offset.length();if(distance>=radius)break;
      const weight=Math.pow(1-distance/radius,1.25);
      // Compression approaches the displacement budget smoothly. A hard cap
      // left flat plateaus and sawtooth boundaries after repeated contacts.
      const used=current.distanceToSquared(orig)/.81;
      const strength=weight*Math.min(.78,damage*.041)*(1-roof*.64)*Math.max(0,1-used)/8;
      const across=offset.dot(tangent)/radius,along=offset.dot(vertical)/radius;
      const depth=offset.dot(direction);
      // Alternating folds follow the compressed length of the sheet, rather
      // than a single smooth dent. This common field also bends its seals,
      // glazing and underlying hardware without opening mesh-transform seams.
      const phase=depth*12.5+across*1.8;
      const fold=Math.sin(phase)*(.55+.45*Math.sin(phase*.5+.7));
      const span=Math.max(0,1-(along+.1)**2);
      const buckle=fold*span*Math.min(1,damage/15);
      current.addScaledVector(direction,strength);
      current.addScaledVector(vertical,-buckle*strength*.37);
      current.addScaledVector(tangent,-across*strength*.12*span);
      accumulated+=strength;maximum=Math.max(maximum,weight);
    }
    offset.copy(current).sub(orig);
    if (offset.lengthSq() > .81) current.copy(orig).add(offset.setLength(.9));
    current.applyMatrix4(fromModel);
    position.setXYZ(i, current.x, current.y, current.z);
    if (wear) wear.setXY(i, Math.min(1, wear.getX(i) + accumulated * 2.8), Math.min(1, wear.getY(i) + accumulated * 1.7));
  }
  if (maximum) {
    position.needsUpdate = true;
    if (wear) wear.needsUpdate = true;
    g.computeVertexNormals();
    finishCoupeDent(mesh, contact.clone().applyMatrix4(fromModel), direction.clone().transformDirection(fromModel), damage);
    g.computeBoundingBox(); g.computeBoundingSphere();
  }
  return maximum;
}

export function repairWreckGeometry(mesh: T.Mesh) {
  const g = mesh.geometry;
  (g.attributes.position.array as Float32Array).set(mesh.userData.original);
  g.attributes.position.needsUpdate = true;
  (g.attributes.normal.array as Float32Array).set(mesh.userData.originalNormals);
  g.attributes.normal.needsUpdate = true;
  if (g.attributes.impactWear) { (g.attributes.impactWear.array as Float32Array).fill(0); g.attributes.impactWear.needsUpdate = true; }
  if (g.attributes.impactAxis) { (g.attributes.impactAxis.array as Float32Array).fill(0); g.attributes.impactAxis.needsUpdate = true; }
  g.computeBoundingBox(); g.computeBoundingSphere();
}
