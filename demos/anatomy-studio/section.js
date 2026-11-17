/**
 * Cross-section plane: slices the body (or the open study) along one of the three anatomical planes.
 *
 * The cut is a per-material clipping plane, so the floor and platform are left alone. Cut faces are not capped:
 * opaque pieces are drawn double-sided while a section is active so their inside walls show instead of holes.
 */
import * as THREE from 'three';

// Frame: metres, y up, +z anterior, +x subject's left.
const NORMALS = { sagittal: [1, 0, 0], coronal: [0, 0, 1], transverse: [0, 1, 0] };
const INDEX = { sagittal: 0, coronal: 2, transverse: 1 };

export function createSection({ materials, bounds, onChange }) {
  const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
  const s = { axis: 'off', t: 0.5, flip: false, lo: -1, hi: 1 };
  const active = () => s.axis !== 'off';

  /** Give one material the current section state. Called for every material the studio creates. */
  function applyTo(mat) {
    const on = active();
    const side = on && !mat.transparent ? THREE.DoubleSide : THREE.FrontSide;
    if ((mat.clippingPlanes?.length === 1) === on && mat.side === side) return;
    mat.clippingPlanes = on ? [plane] : null;
    mat.clipShadows = on;
    mat.side = side;
    mat.needsUpdate = true;
  }

  function place() {
    if (!active()) return;
    const sign = s.flip ? -1 : 1;
    const n = NORMALS[s.axis];
    const d = s.lo + (s.hi - s.lo) * s.t;
    plane.normal.set(n[0] * sign, n[1] * sign, n[2] * sign);
    plane.constant = -d * sign;   // keeps the half-space on the normal's side of the cut
  }

  /** Fit the slider's travel to whatever is on screen now (whole body, one system, or a study). */
  function refit() {
    if (!active()) return;
    const box = bounds();
    const i = INDEX[s.axis];
    if (box.isEmpty()) { s.lo = -1; s.hi = 1; }
    else { s.lo = box.min.getComponent(i); s.hi = box.max.getComponent(i); }
    place();
  }

  function setAxis(axis) {
    const was = active();
    s.axis = NORMALS[axis] ? axis : 'off';
    s.t = 0.5;
    refit();
    if (was !== active()) for (const m of materials()) applyTo(m);
    onChange();
  }

  return {
    get active() { return active(); },
    get state() { return { axis: s.axis, position: s.t, flip: s.flip }; },
    applyTo,
    refit() { refit(); onChange(); },
    setAxis,
    setPosition(t) { s.t = Math.min(1, Math.max(0, t)); place(); onChange(); },
    flip() { s.flip = !s.flip; place(); onChange(); return s.flip; },
    /** True when a world-space point lies on the removed side, so picking ignores what the cut has hidden. */
    clips: point => active() && plane.distanceToPoint(point) < 0
  };
}
