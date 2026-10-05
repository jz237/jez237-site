import * as THREE from 'three';
import { SUN_DIR } from '../world/atmosphere.js';

// Detail culling for the interactive modes. The hero area is built from
// thousands of small meshes (screws, collars, gears, rivets, rootlets) that
// were sized for macro shots; from across the house they are sub-pixel but
// each still costs a draw call (and a shadow draw). Meshes whose projected
// size would fall under a couple of pixels are hidden; visibility is restored
// when the interactive mode ends.
// Shadows: the key light's shadow pass drew ~1,000 of these parts a frame
// near the skep, most of them out of view or a few pixels across. A detail
// casts only while it is a few pixels across and its shadow can reach the
// view: its sphere, swept along the light down to the beds, meets the camera's
// frustum.
// The ambient creatures (groups) are rigs of 25–85 parts each, most of them
// legs, antennae and joints a few hundredths of the rig's size: a rig is
// hidden whole while it is only a few pixels across, and otherwise each part
// is drawn only while it is at least a pixel or so across (via layers, so the
// creatures' own visibility switches are left alone). Their small parts cast
// no shadow (a texel or two at the shadow map's resolution, a shadow draw
// each), and a rig casts none while its shadow can't reach the view.

const PART_PX = 1.1; // a part's radius on screen below which it is skipped
const SHADOW_FRACTION = 0.15; // parts smaller than this share of the rig's largest cast no shadow
const SHADOW_PX = 5; // a detail's radius on screen below which it casts no shadow
const DROP = Math.max(0.2, -SUN_DIR.y); // light's fall per unit along its path
const S = new THREE.Sphere();

// could the shadow of a sphere (c, r) land inside the frustum? (the sphere
// swept along the light to the ground, sampled with overlapping spheres)
function shadowReaches(frustum, c, r) {
  S.center.copy(c);
  S.radius = r + 1;
  if (frustum.intersectsSphere(S)) return true;
  const L = Math.min(260, Math.max(0, c.y + 4) / DROP);
  const n = L > 40 ? 8 : 4;
  for (let i = 1; i <= n; i++) {
    S.center.copy(c).addScaledVector(SUN_DIR, (L * i) / n);
    S.radius = r + 1 + (L / n) * 0.56;
    if (frustum.intersectsSphere(S)) return true;
  }
  return false;
}

export class DetailCull {
  constructor(roots, { pixels = 3 } = {}) {
    this.items = [];
    this.pixels = pixels;
    this.shadowPixels = SHADOW_PX;
    this.partPixels = PART_PX;
    const s = new THREE.Sphere();
    for (const root of roots) {
      if (!root) continue;
      root.updateMatrixWorld(true);
      root.traverse((o) => {
        if (!(o.isMesh || o.isPoints) || o.isInstancedMesh) return;
        const g = o.geometry;
        if (!g.boundingSphere) g.computeBoundingSphere();
        s.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);
        this.items.push({ o, c: s.center.clone(), r: Math.max(0.02, s.radius), film: o.visible, hidden: false, cast: o.castShadow, shadow: o.castShadow });
      });
    }
    // groups (ambient creatures): cull the whole rig, and its parts by size
    this.groups = [];
  }

  addGroup(group, radius) { this.groups.push({ o: group, r: radius, parts: null, shadow: true }); }

  // entering an interactive mode: what to put back afterwards is the state as
  // the film left it (its shadow LOD switches small casters on and off, and
  // remembers having done so)
  begin() {
    for (const it of this.items) { it.film = it.o.visible; it.cast = it.shadow = it.o.castShadow; it.hidden = false; }
  }

  // a rig's parts with their radius in world units (the rig's scale is fixed once placed)
  _parts(group) {
    group.updateMatrixWorld(true);
    const parts = [];
    const s = new THREE.Sphere();
    group.traverse((o) => {
      if (!o.isMesh || o.isInstancedMesh) return;
      const g = o.geometry;
      if (!g.boundingSphere) g.computeBoundingSphere();
      s.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);
      parts.push({ o, r: s.radius, mask: o.layers.mask, cast: o.castShadow, caster: o.castShadow, shown: true });
    });
    const big = parts.reduce((m, p) => Math.max(m, p.r), 0);
    for (const p of parts) if (p.r < big * SHADOW_FRACTION) { p.caster = false; p.o.castShadow = false; }
    return parts;
  }

  // k: pixels per unit at distance 1 (viewport height / (2 tan(fov/2)));
  // frustum: the camera's (for the shadow test; without it everything may cast)
  update(camera, viewportH, frustum = null) {
    const k = viewportH / (2 * Math.tan((camera.fov * Math.PI) / 360));
    const cp = camera.position;
    const lim = this.pixels / k; // r/d below this → hide
    const limS = this.shadowPixels / k; // … → no shadow
    for (const it of this.items) {
      const rd = it.r / Math.max(cp.distanceTo(it.c), 1e-3);
      const hide = rd < lim;
      if (hide !== it.hidden) { it.hidden = hide; it.o.visible = hide ? false : it.film; }
      const cast = it.cast && !hide && rd >= limS && (!frustum || shadowReaches(frustum, it.c, it.r));
      if (cast !== it.shadow) { it.shadow = cast; it.o.castShadow = cast; }
    }
    for (const g of this.groups) {
      const d = Math.max(cp.distanceTo(g.o.position), 1e-3);
      // a whole creature rig (dozens of parts) only while it's a few pixels across
      const on = g.r / d >= lim * 4;
      g.o.visible = on;
      if (!on) continue;
      g.parts ||= this._parts(g.o);
      const rMin = (this.partPixels / k) * d;
      const shadow = !frustum || shadowReaches(frustum, g.o.position, g.r);
      const flip = shadow !== g.shadow;
      g.shadow = shadow;
      for (const p of g.parts) {
        const show = p.r >= rMin;
        if (show !== p.shown) { p.shown = show; p.o.layers.mask = show ? p.mask : 0; }
        if (flip) p.o.castShadow = p.caster && shadow;
      }
    }
  }

  restore() {
    for (const it of this.items) { it.o.visible = it.film; it.hidden = false; it.o.castShadow = it.cast; it.shadow = it.cast; }
    for (const g of this.groups) {
      g.o.visible = true;
      for (const p of g.parts || []) { p.o.layers.mask = p.mask; p.o.castShadow = p.cast; p.shown = true; }
      g.parts = null;
      g.shadow = true;
    }
  }
}
