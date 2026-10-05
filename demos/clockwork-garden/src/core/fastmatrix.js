import { Object3D } from 'three';

// Matrix updates that skip what hasn't moved. three recomposes every object's
// local matrix and re-multiplies its world matrix on every frame; the garden
// has ~6,000 objects and most of them (iron, props, pots, the hero flower's
// parked linkages) are still at any moment. Here:
//   · an object recomposes its local matrix only when its position, rotation,
//     scale or pivot actually changed since the last time;
//   · each world matrix carries a version; a child re-multiplies only when its
//     own matrix changed or its parent's world matrix has a newer version than
//     the one it was built from (which also covers re-parenting, and ancestors
//     refreshed early through getWorldPosition() and friends).
//   · while `MATRICES.skipHidden` is set (the interactive modes, where the
//     film's cast and thousands of culled details are hidden), the per-frame
//     pass skips hidden subtrees; they catch up through the versions as soon
//     as they are shown, and getWorldPosition() and friends stay exact.
// Results are bit-identical: unchanged inputs give the matrices already stored.
// (Nothing in this project writes .matrix or .matrixWorld by hand while the
// auto-updates are on; such a write would now persist until the object moves.)

const proto = Object3D.prototype;
let VERSION = 0;
export const MATRICES = { skipHidden: false };

proto.updateMatrix = function () {
  const p = this.position, q = this.quaternion, s = this.scale, pv = this.pivot;
  let c = this._mc;
  if (c !== undefined
    && c[0] === p.x && c[1] === p.y && c[2] === p.z
    && c[3] === q._x && c[4] === q._y && c[5] === q._z && c[6] === q._w
    && c[7] === s.x && c[8] === s.y && c[9] === s.z
    && (pv == null ? c[10] !== c[10] : c[10] === pv.x && c[11] === pv.y && c[12] === pv.z)) return;
  this.matrix.compose(p, q, s);
  if (pv != null) {
    const px = pv.x, py = pv.y, pz = pv.z;
    const te = this.matrix.elements;
    te[12] += px - te[0] * px - te[4] * py - te[8] * pz;
    te[13] += py - te[1] * px - te[5] * py - te[9] * pz;
    te[14] += pz - te[2] * px - te[6] * py - te[10] * pz;
  }
  if (c === undefined) c = this._mc = new Float64Array(13);
  c[0] = p.x; c[1] = p.y; c[2] = p.z;
  c[3] = q._x; c[4] = q._y; c[5] = q._z; c[6] = q._w;
  c[7] = s.x; c[8] = s.y; c[9] = s.z;
  if (pv == null) c[10] = NaN; else { c[10] = pv.x; c[11] = pv.y; c[12] = pv.z; }
  this.matrixWorldNeedsUpdate = true;
};

// the world matrix, if this object, its parent's world matrix or `force` asks
function refreshWorld(o, force) {
  const parent = o.parent;
  const pv = parent === null ? 0 : (parent._wv ?? -1);
  if (o.matrixWorldNeedsUpdate || force || o._pwv !== pv) {
    if (o.matrixWorldAutoUpdate === true) {
      if (parent === null) o.matrixWorld.copy(o.matrix);
      else o.matrixWorld.multiplyMatrices(parent.matrixWorld, o.matrix);
      o._wv = ++VERSION;
    }
    o._pwv = pv;
    o.matrixWorldNeedsUpdate = false;
  }
}

proto.updateMatrixWorld = function (force) {
  if (MATRICES.skipHidden && this.visible === false && !force) return;
  if (this.matrixAutoUpdate) this.updateMatrix();
  refreshWorld(this, force);
  const children = this.children;
  for (let i = 0, l = children.length; i < l; i++) children[i].updateMatrixWorld(force);
};

proto.updateWorldMatrix = function (updateParents, updateChildren, force = false) {
  const parent = this.parent;
  if (updateParents === true && parent !== null) parent.updateWorldMatrix(true, false);
  if (this.matrixAutoUpdate) this.updateMatrix();
  refreshWorld(this, force);
  if (updateChildren === true) {
    const children = this.children;
    for (let i = 0, l = children.length; i < l; i++) children[i].updateWorldMatrix(false, true, force);
  }
};
