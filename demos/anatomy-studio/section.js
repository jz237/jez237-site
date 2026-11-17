/**
 * Cross-section plane: slices the body (or the open study) along one of the three anatomical planes.
 *
 * The cut is a per-material clipping plane, so the floor and platform are left alone.
 *
 * Cut faces are filled ("capped") with the stencil buffer, one piece at a time:
 *   1. the piece's back faces add one to the stencil and its front faces take one away, colour and depth untouched,
 *      which leaves a non-zero count exactly where the plane passes through the inside of the piece;
 *   2. a quad lying on the plane is drawn in the piece's colour wherever the count is non-zero;
 *   3. the stencil is cleared for the next piece.
 * That needs three extra draws per piece, so it only runs while a section is active. The count is only meaningful
 * for a closed surface: a mesh with an open end (many vessels and nerves, sheets such as skin and fascia) has no
 * inside and would smear cap colour across the view. So each piece's mesh is tested once (closedSurface) and only
 * watertight, opaque pieces are capped. The test runs in short slices on a timer, independent of the frame rate.
 * Opaque pieces are also drawn double-sided while a section is active, so anything left uncapped shows its inner wall.
 */
import * as THREE from 'three';

// Frame: metres, y up, +z anterior, +x subject's left.
const NORMALS = { sagittal: [1, 0, 0], coronal: [0, 0, 1], transverse: [0, 1, 0] };
const INDEX = { sagittal: 0, coronal: 2, transverse: 1 };
const ABOVE_CAPS = 1e6;   // renderOrder for the real pieces: after every stencil pass and cap
const BUDGET_MS = 8;      // length of one slice of watertightness testing

/**
 * True when every edge of the mesh is shared by exactly two triangles that run along it in opposite directions,
 * i.e. the surface is closed and consistently oriented. Vertices are merged by position first, because a mesh
 * stores a point twice wherever its normals differ.
 */
export function closedSurface(geometry) {
  const pos = geometry.attributes.position, index = geometry.index;
  if (!pos || !index) return false;
  const n = pos.count, canon = new Uint32Array(n), seen = new Map();
  for (let i = 0; i < n; i++) {
    // positions are quantised to 16-bit integers, which pack exactly into one number; anything else falls back to text
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const key = Number.isInteger(x) && Number.isInteger(y) && Number.isInteger(z) && Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) < 32769 ? ((x + 32768) * 65537 + (y + 32768)) * 65537 + (z + 32768) : `${x},${y},${z}`;
    let c = seen.get(key);
    if (c === undefined) { c = seen.size; seen.set(key, c); }
    canon[i] = c;
  }
  const m = seen.size, edges = new Map();
  const edge = (a, b) => {
    if (a === b) return;   // a degenerate triangle left by merging
    const key = a < b ? a * m + b : b * m + a, d = a < b ? 1 : -1, v = (edges.get(key) || 0) + d;
    if (v) edges.set(key, v); else edges.delete(key);
  };
  const ix = index.array;
  for (let t = 0; t < ix.length; t += 3) {
    const a = canon[ix[t]], b = canon[ix[t + 1]], c = canon[ix[t + 2]];
    edge(a, b); edge(b, c); edge(c, a);
  }
  return edges.size === 0;
}

export function createSection({ materials, bounds, onChange, scene }) {
  const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
  const s = { axis: 'off', t: 0.5, flip: false, lo: -1, hi: 1, caps: true };
  const planes = [plane];
  const active = () => s.axis !== 'off';

  // ---- caps
  const capGroup = new THREE.Group();
  capGroup.name = 'Section caps';
  scene.add(capGroup);
  const capGeometry = new THREE.PlaneGeometry(8, 8);
  const capMatrix = new THREE.Matrix4();
  const capped = new Map();   // part -> { back, front, cap, color }
  const capMaterials = new Map();
  // Cut-face patterns, about 5 mm across: stipple for bone (marrow), fine parallel lines for muscle, diagonal hatch for the rest.
  const pattern = draw => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 64, 64); g.strokeStyle = g.fillStyle = 'rgba(0,0,0,.42)'; draw(g); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1600, 1600); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const patterns = {
    skeletal: pattern(g => { for (const [x, y, r] of [[10, 12, 4], [40, 8, 3], [26, 34, 5], [54, 40, 3.5], [8, 50, 3], [44, 56, 4]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } }),
    muscular: pattern(g => { g.lineWidth = 2; for (let y = 4; y < 64; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(64, y); g.stroke(); } }),
    other: pattern(g => { g.lineWidth = 2.5; for (let i = -64; i < 128; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke(); } })
  };
  const stencilMaterial = (side, op) => new THREE.MeshBasicMaterial({
    side, clippingPlanes: [plane], colorWrite: false, depthWrite: false, depthTest: false,
    stencilWrite: true, stencilFunc: THREE.AlwaysStencilFunc, stencilFail: op, stencilZFail: op, stencilZPass: op
  });
  const backMaterial = stencilMaterial(THREE.BackSide, THREE.IncrementWrapStencilOp);
  const frontMaterial = stencilMaterial(THREE.FrontSide, THREE.DecrementWrapStencilOp);
  function capMaterial(hex, file) {
    const kind = patterns[file] ? file : 'other', key = `${hex}-${kind}`;
    let m = capMaterials.get(key);
    if (!m) {
      // a little darker than the surface, so a cut face reads as a cut and not as more skin
      m = new THREE.MeshBasicMaterial({
        color: new THREE.Color(hex).multiplyScalar(0.8), map: patterns[kind], side: THREE.DoubleSide,
        stencilWrite: true, stencilRef: 0, stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp, stencilZPass: THREE.ReplaceStencilOp
      });
      capMaterials.set(key, m);
    }
    return m;
  }
  const clearStencil = renderer => renderer.clearStencil();
  const closed = new Map();   // part -> true | false, tested on the base-tier mesh
  const untested = [];
  const wantsCap = part => part.file !== 'regions' && !part.mesh.material.transparent && closed.get(part) === true;

  function addCap(part, order) {
    const helper = material => {
      const m = new THREE.Mesh(part.mesh.geometry, material);
      m.renderOrder = order; m.castShadow = false; m.receiveShadow = false; m.frustumCulled = false; m.raycast = () => {};
      part.mesh.add(m);   // rides along with the piece when the body is exploded
      return m;
    };
    const color = part.mesh.material.color.getHex();
    const cap = new THREE.Mesh(capGeometry, capMaterial(color, part.file));
    cap.renderOrder = order + 0.5; cap.frustumCulled = false; cap.matrixAutoUpdate = false; cap.matrixWorldAutoUpdate = false;
    cap.onAfterRender = clearStencil;
    capGroup.add(cap);
    capped.set(part, { back: helper(backMaterial), front: helper(frontMaterial), cap, color });
  }

  function removeCaps() {
    for (const [part, c] of capped) { part.mesh.remove(c.back, c.front); capGroup.remove(c.cap); part.mesh.renderOrder = 0; }
    capped.clear();
  }

  /** Once per drawn frame while a section is active: keep the caps in step with what is on screen. */
  /** Test queued meshes in slices, smallest first so most caps appear at once; each slice asks for a redraw. */
  let pumping = false, notified = 0, pumped = 0;
  function pump() {
    pumping = false;
    if (!active() || !s.caps || !untested.length) return;
    const started = performance.now(), budget = started - pumped > 150 ? 60 : BUDGET_MS;   // when frames are slow this runs rarely, so each turn does more
    while (untested.length && performance.now() - started < budget) { const p = untested.pop(); closed.set(p, closedSurface(p.loGeometry || p.mesh.geometry)); }
    pumped = performance.now();
    if (!untested.length || started - notified > 250) { notified = started; onChange(); }   // a redraw now and then, not after every slice
    if (untested.length) { pumping = true; setTimeout(pump, 4); }
  }

  function frame(parts, shown = true) {
    capGroup.visible = shown;
    if (!active() || !s.caps) { if (capped.size) removeCaps(); return; }
    if (closed.size + untested.length < parts.length) { const queued = new Set(untested); for (const p of parts) if (!closed.has(p) && !queued.has(p)) untested.push(p); untested.sort((a, b) => b.triangles - a.triangles); }
    if (untested.length && !pumping) { pumping = true; setTimeout(pump, 0); }
    // the quad: centred on the plane, facing along its normal
    const n = plane.normal, q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    capMatrix.compose(n.clone().multiplyScalar(-plane.constant).add(new THREE.Vector3(0, 0.9, 0).projectOnPlane(n)), q, new THREE.Vector3(1, 1, 1));
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let c = capped.get(part);
      if (!c && part.mesh.visible && wantsCap(part)) { addCap(part, i + 1); c = capped.get(part); part.mesh.renderOrder = ABOVE_CAPS; }
      if (!c) continue;
      const show = part.mesh.visible && wantsCap(part);
      c.cap.visible = c.back.visible = c.front.visible = show;
      if (!show) continue;
      c.cap.matrixWorld.copy(capMatrix);
      if (c.back.geometry !== part.mesh.geometry) c.back.geometry = c.front.geometry = part.mesh.geometry;   // the detail tier swapped in
      const color = part.mesh.material.color.getHex();
      if (color !== c.color) { c.color = color; c.cap.material = capMaterial(color, part.file); }   // the finish changed
    }
  }

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
    if (!active()) removeCaps();
    onChange();
  }

  return {
    get active() { return active(); },
    get state() { return { axis: s.axis, position: s.t, flip: s.flip, caps: s.caps, capped: capped.size, closed: [...closed.values()].filter(Boolean).length, tested: closed.size }; },
    applyTo,
    frame,
    refit() { refit(); onChange(); },
    setAxis,
    setPosition(t) { s.t = Math.min(1, Math.max(0, t)); place(); onChange(); },
    setCaps(on) { s.caps = !!on; if (!s.caps) removeCaps(); onChange(); },
    flip() { s.flip = !s.flip; place(); onChange(); return s.flip; },
    /** True when a world-space point lies on the removed side, so picking ignores what the cut has hidden. */
    clips: point => active() && plane.distanceToPoint(point) < 0,
    /** The clipping planes other materials should use right now (an array to share, or null). */
    get planes() { return active() ? planes : null; },
    /** Hide the cap quads while a pass draws the scene with one material for everything (the stencil test would be lost). */
    showCaps(on) { capGroup.visible = on; }
  };
}
