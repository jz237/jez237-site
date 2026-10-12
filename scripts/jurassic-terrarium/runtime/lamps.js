// A row of display spotlights under the cabinet lid, as in a museum case: brass cans with warm, glowing
// lenses and a few real spot lights that pool warm light on the jungle. They are always on, a little
// brighter as the room darkens, so the case reads like a lit exhibit at dusk and at night.
import {
  Group, Mesh, CylinderGeometry, CircleGeometry, MeshStandardMaterial, MeshBasicMaterial, SpotLight, Object3D,
  Color, Sprite, SpriteMaterial, CanvasTexture, AdditiveBlending,
} from 'three';

// a soft warm bloom with a faint four-point star, drawn once
function haloTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,240,210,1)');
  r.addColorStop(0.12, 'rgba(255,214,150,0.55)');
  r.addColorStop(0.4, 'rgba(255,190,110,0.12)');
  r.addColorStop(1, 'rgba(255,180,100,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  g.globalCompositeOperation = 'lighter';
  for (const [w, h] of [[128, 3], [3, 128]]) {
    const l = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    l.addColorStop(0, 'rgba(255,230,190,0.5)');
    l.addColorStop(1, 'rgba(255,230,190,0)');
    g.fillStyle = l;
    g.fillRect(64 - w / 2, 64 - h / 2, w, h);
  }
  return new CanvasTexture(c);
}

export class Lamps {
  constructor(ctx, { count = 6, spots = 3 } = {}) {
    this.ctx = ctx;
    const box = ctx.box;
    this.group = new Group();
    this.group.name = 'lid-lamps';
    // hung on short stems below the lid so they show beneath the front rail, as in the concept
    const y = box.topY - 0.42;
    const z = box.halfD * 0.55;
    const brass = new MeshStandardMaterial({ color: 0x9a7a3a, metalness: 0.9, roughness: 0.35 });
    this.lens = new MeshBasicMaterial({ color: new Color(1.0, 0.86, 0.62).multiplyScalar(3.2), toneMapped: false });
    const can = new CylinderGeometry(0.11, 0.13, 0.12, 20);
    const lensG = new CircleGeometry(0.085, 20);
    const stem = new CylinderGeometry(0.018, 0.018, 0.36, 8);
    this.haloMat = new SpriteMaterial({
      map: haloTexture(), color: 0xffffff, blending: AdditiveBlending, depthWrite: false, transparent: true,
      toneMapped: false, opacity: 0.85,
    });
    this.halos = [];
    this.xs = [];
    for (let i = 0; i < count; i++) {
      const x = -box.halfW * 0.82 + (i / (count - 1)) * box.halfW * 1.64;
      this.xs.push(x);
      const c = new Mesh(can, brass);
      c.position.set(x, y, z);
      const l = new Mesh(lensG, this.lens);
      l.rotation.x = Math.PI / 2;
      l.position.set(x, y - 0.061, z);
      const st = new Mesh(stem, brass);
      st.position.set(x, y + 0.24, z);
      const h = new Sprite(this.haloMat);
      h.position.set(x, y - 0.09, z);
      h.scale.setScalar(0.75);
      this.halos.push(h);
      this.group.add(c, l, st, h);
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
    this.haloMat.opacity = 0.55 + 0.4 * dark;
  }
}
