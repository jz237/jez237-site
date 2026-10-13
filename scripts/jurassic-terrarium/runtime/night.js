// Night drama:
//   - the cabin's hearth glowing out through its windows and the jetty lantern light the animals that pass
//     near (warm, flickering, falling off with distance; see WARM in skin.js), and pool warm light on the
//     ground round them;
//   - eyeshine: after dark the animals' eyes throw light back, amber, green or blue by species, brightest
//     when they look straight at us, and brighter still near a light;
//   - lightning: the strike rims every animal in hard cold light and flares the painted sky behind them,
//     so for an instant they stand out as silhouettes.
import { Mesh, PlaneGeometry, MeshBasicMaterial, CanvasTexture, AdditiveBlending, Vector3, Color } from 'three';
import { WARM, SHINE } from './skin.js';
import { guardMaterial } from './safety.js';

const _p = new Vector3(), _e = new Vector3();

function poolTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,190,120,0.9)');
  r.addColorStop(0.35, 'rgba(255,160,90,0.4)');
  r.addColorStop(1, 'rgba(255,140,70,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

export class Night {
  constructor(mod) {
    this.mod = mod;
    this.ctx = mod.ctx;
    const tex = poolTexture();
    this.pools = [];
    for (const size of [2.4, 1.3]) {
      const m = new MeshBasicMaterial({ map: tex, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0, fog: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      guardMaterial(m);
      const g = new PlaneGeometry(size, size);
      g.rotateX(-Math.PI / 2);
      const mesh = new Mesh(g, m);
      mesh.name = 'night-pool';
      mesh.renderOrder = 0.7;
      mesh.visible = false;
      this.ctx.scene.add(mesh);
      this.pools.push(mesh);
    }
    this.t = 0;
    // the sky's additive HDR layers (stars, meteors): an invalid pixel there would be bloomed into a
    // full-screen flash, as the water's once was
    this.ctx.scene.traverse((o) => /^sky-(meteor|stars)$/.test(o.name) && guardMaterial(o.material));
  }

  update(dt) {
    this.t += dt;
    const ctx = this.ctx, life = ctx.modules.life, env = life?.env;
    const night = env?.night ?? 0, dusk = Math.max(env?.dusk || 0, env?.golden || 0) * 0.5;
    const dark = Math.min(1, night + dusk);
    const V = ctx.camera.matrixWorldInverse, P = WARM.uWarmPos.value, C = WARM.uWarmCol.value;
    for (const c of C) c.w = 0;
    // the hearth, glowing out of the cabin (Weatherglass's own light sits inside it; this one carries
    // its glow out to whatever passes the windows and the door)
    const T = ctx.terrain;
    const fl = 0.85 + 0.15 * Math.sin(this.t * 9.1) * Math.sin(this.t * 3.7 + 1.2);
    if (life?.hearth && (life.glow || 0) > 0.01) {
      life.hearth.getWorldPosition(_p);
      _p.y += 0.12;
      const k = life.glow * fl * (0.4 + 0.6 * dark);
      P[0].copy(_p).applyMatrix4(V);
      C[0].set(1.0 * k * 1.6, 0.52 * k * 1.6, 0.2 * k * 1.6, 1.9);
      const pool = this.pools[0];
      pool.visible = k > 0.02;
      pool.position.set(_p.x, T.height(_p.x, _p.z) + 0.01, _p.z);
      pool.material.opacity = 0.22 * k * dark;
    } else this.pools[0].visible = false;
    // the jetty lantern
    const fx = this.mod.effects;
    if (fx?.lanternLight && (fx.lit || 0) > 0.01) {
      fx.lanternLight.getWorldPosition(_p);
      const k = fx.lit * fl;
      P[1].copy(_p).applyMatrix4(V);
      C[1].set(1.0 * k * 1.3, 0.62 * k * 1.3, 0.3 * k * 1.3, 1.4);
      const pool = this.pools[1];
      pool.visible = k > 0.02;
      pool.position.set(_p.x, Math.max(T.height(_p.x, _p.z), ctx.world.lakeLevel ?? 0) + 0.012, _p.z);
      pool.material.opacity = 0.3 * k * dark;
    } else this.pools[1].visible = false;

    // the lanterns along the footpath: the two with an animal closest to them
    const lamps = this.mod.paths?.lamps || [], pdark = Math.min(1, night + (env?.dusk || 0) * 0.8 + (env?.golden || 0) * 0.25);
    if (lamps.length && pdark > 0.02) {
      const near = [];
      for (const lg of lamps) {
        _p.set(0.034, 0.115, 0);
        lg.localToWorld(_p);
        let best = 9;
        for (const d of this.mod.walkers || []) if (d.root.visible) best = Math.min(best, Math.hypot(d.pos.x - _p.x, d.pos.z - _p.z));
        if (best < 1.2) near.push({ p: _p.clone(), best });
      }
      near.sort((a, b) => a.best - b.best);
      near.slice(0, 2).forEach((n, i) => {
        P[2 + i].copy(n.p).applyMatrix4(V);
        const k = 1.25 * pdark * fl;
        C[2 + i].set(1.0 * k, 0.62 * k, 0.3 * k, 0.75);
      });
    }
    // eyeshine, by species; near one of the warm lights it flares
    for (const d of this.mod.dinos || []) {
      const E = d.eyeU;
      if (!E) continue;
      const col = SHINE[d.sp.id] || SHINE.trex;
      let near = 0;
      if (d.headBone) {
        d.headBone.getWorldPosition(_e);
        for (let i = 0; i < 4; i++) {
          if (C[i].w <= 0) continue;
          _p.copy(P[i]).applyMatrix4(ctx.camera.matrixWorld);
          near = Math.max(near, Math.max(0, 1 - _p.distanceTo(_e) / C[i].w));
        }
      }
      const k = (night * 0.9 + dusk * 0.4) * (0.6 + 1.4 * near) * (d.state === 'sleep' ? 0 : 1);
      E.uShine.value.setRGB(col[0] * k, col[1] * k, col[2] * k);
    }
  }
}
