// A row of display spotlights under the cabinet lid, as in a museum case: brass cans with warm, glowing
// lenses and a few real spot lights that pool warm light on the jungle. They are always on, a little
// brighter as the room darkens, so the case reads like a lit exhibit at dusk and at night.
import {
  Group, Mesh, CylinderGeometry, CircleGeometry, MeshStandardMaterial, MeshBasicMaterial, SpotLight, Object3D,
  Color,
} from 'three';

export class Lamps {
  constructor(ctx, { count = 6, spots = 3 } = {}) {
    this.ctx = ctx;
    const box = ctx.box;
    this.group = new Group();
    this.group.name = 'lid-lamps';
    const y = box.topY - 0.06;
    const z = box.halfD * 0.42;
    const brass = new MeshStandardMaterial({ color: 0x9a7a3a, metalness: 0.9, roughness: 0.35 });
    this.lens = new MeshBasicMaterial({ color: new Color(1.0, 0.86, 0.62).multiplyScalar(3.2), toneMapped: false });
    const can = new CylinderGeometry(0.11, 0.13, 0.12, 20);
    const lensG = new CircleGeometry(0.085, 20);
    this.xs = [];
    for (let i = 0; i < count; i++) {
      const x = -box.halfW * 0.82 + (i / (count - 1)) * box.halfW * 1.64;
      this.xs.push(x);
      const c = new Mesh(can, brass);
      c.position.set(x, y, z);
      const l = new Mesh(lensG, this.lens);
      l.rotation.x = Math.PI / 2;
      l.position.set(x, y - 0.061, z);
      this.group.add(c, l);
    }
    // a few real lights: shadowless warm spots spread along the row
    this.spots = [];
    for (let i = 0; i < spots; i++) {
      const x = -box.halfW * 0.6 + (i / Math.max(1, spots - 1)) * box.halfW * 1.2;
      const s = new SpotLight(0xffd29a, 0, 14, 0.75, 0.85, 1.2);
      s.position.set(x, y - 0.1, z);
      const t = new Object3D();
      t.position.set(x * 0.9, 0.4, -0.6);
      s.target = t;
      this.group.add(s, t);
      this.spots.push(s);
    }
    ctx.scene.add(this.group);
  }

  update(dt) {
    const env = this.ctx.modules.life?.env;
    const night = env ? env.night : 0;
    const dusk = env ? Math.max(env.dusk || 0, env.golden || 0) : 0;
    const dark = Math.min(1, night + dusk * 0.5);
    const want = 7 + 18 * dark;
    for (const s of this.spots) s.intensity += (want - s.intensity) * Math.min(1, dt * 2);
  }
}
