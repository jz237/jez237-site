import * as THREE from 'three';

// Detail culling for the interactive modes. The hero area is built from
// thousands of small meshes (screws, collars, gears, rivets, rootlets) that
// were sized for macro shots; from across the house they are sub-pixel but
// each still costs a draw call (and a shadow draw). Meshes whose projected
// size would fall under a couple of pixels are hidden; visibility is restored
// when the interactive mode ends.

const V = () => new THREE.Vector3();

export class DetailCull {
  constructor(roots, { pixels = 3 } = {}) {
    this.items = [];
    this.pixels = pixels;
    const s = new THREE.Sphere();
    for (const root of roots) {
      if (!root) continue;
      root.updateMatrixWorld(true);
      root.traverse((o) => {
        if (!(o.isMesh || o.isPoints) || o.isInstancedMesh) return;
        const g = o.geometry;
        if (!g.boundingSphere) g.computeBoundingSphere();
        s.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);
        this.items.push({ o, c: s.center.clone(), r: Math.max(0.02, s.radius), film: o.visible, hidden: false });
      });
    }
    // groups (ambient creatures): cull the whole rig
    this.groups = [];
  }

  addGroup(group, radius) { this.groups.push({ o: group, r: radius }); }

  // k: pixels per unit at distance 1 (viewport height / (2 tan(fov/2)))
  update(camera, viewportH) {
    const k = viewportH / (2 * Math.tan((camera.fov * Math.PI) / 360));
    const cp = camera.position;
    const lim = this.pixels / k; // r/d below this → hide
    for (const it of this.items) {
      const d = cp.distanceTo(it.c);
      const hide = it.r / Math.max(d, 1e-3) < lim;
      if (hide !== it.hidden) { it.hidden = hide; it.o.visible = hide ? false : it.film; }
    }
    for (const g of this.groups) {
      const d = cp.distanceTo(g.o.position);
      // a whole creature rig (dozens of parts) only while it's a few pixels across
      g.o.visible = g.r / Math.max(d, 1e-3) >= lim * 4;
    }
  }

  restore() {
    for (const it of this.items) { it.o.visible = it.film; it.hidden = false; }
    for (const g of this.groups) g.o.visible = true;
  }
}
