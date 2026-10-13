// A painted backdrop inside the back glass, as in a museum diorama: a misty valley with receding
// forested hills and mountains (far layer, against the glass) and a band of conifer silhouettes a little
// in front of it (near layer), so the two shift against each other as the view moves. They follow the
// time of day and the weather (dim and blue at night, greyer under storm cloud). Both are one-sided:
// seen from behind the case they vanish, so you can still look in through the back glass.
import { Mesh, PlaneGeometry, MeshBasicMaterial, TextureLoader, SRGBColorSpace, Color, FrontSide } from 'three';
import { guardMaterial } from './safety.js';

export class Backdrop {
  constructor(ctx, base) {
    this.ctx = ctx;
    const box = ctx.box;
    const W = box.halfW * 2 - 0.02;
    const load = (name) => {
      const t = new TextureLoader().load(new URL(name, base).href);
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    };
    this.farMat = new MeshBasicMaterial({ map: load('backdrop-far.webp'), side: FrontSide, fog: false });
    this.nearMat = new MeshBasicMaterial({ map: load('backdrop-near.webp'), side: FrontSide, transparent: true, depthWrite: false, fog: false });
    guardMaterial(this.farMat);
    guardMaterial(this.nearMat);
    const H = box.topY - box.bottomY;
    this.far = new Mesh(new PlaneGeometry(W, H), this.farMat);
    this.far.position.set(0, box.bottomY + H / 2, -box.halfD + 0.03);
    this.far.name = 'backdrop-far';
    this.far.renderOrder = -1;
    const nh = 2.3;
    this.near = new Mesh(new PlaneGeometry(W, nh), this.nearMat);
    this.near.position.set(0, 0.15 + nh / 2, -box.halfD + 0.45);
    this.near.name = 'backdrop-near';
    this.near.renderOrder = 0.5;
    for (const m of [this.far, this.near]) {
      m.frustumCulled = false;
      ctx.scene.add(m);
    }
    this.c = new Color();
  }

  update() {
    const life = this.ctx.modules.life?.env, w = this.ctx.world;
    const night = life?.night ?? 0, golden = life?.golden ?? 0, storm = Math.min(1, (w.storminess || 0) + (w.cloudCover || 0) * 0.4);
    // day: neutral; golden hour: warm; night: dim blue; storm: grey and darker
    const c = this.c.setRGB(1, 1, 1);
    c.lerp(new Color(1.15, 0.92, 0.72), golden * 0.6);
    c.lerp(new Color(0.62, 0.66, 0.7), storm * 0.5);
    c.lerp(new Color(0.07, 0.09, 0.15), night);
    this.farMat.color.copy(c);
    this.nearMat.color.copy(c).multiplyScalar(0.92);
  }
}
