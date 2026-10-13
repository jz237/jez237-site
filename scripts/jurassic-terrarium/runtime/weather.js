// The animals in the weather:
//   - drips: a wet animal (in the rain, or just out of the water) drips from its chin, throat, belly and
//     tail, the drops falling to the ground;
//   - breath: on cold mornings, in winter and in rain-cooled air, each breath leaves the nostrils as a
//     puff of vapour, in time with the breathing (quicker after a run), carried off on the wind; a roar
//     throws out a great cloud of it;
//   - the wind: read where each animal stands (Weatherglass's wind field), for the animals' own
//     reactions in main.js (turning tail to a strong wind, eyes narrowed).
// The vapour is a pool of soft sprites, recycled oldest first; drips use Effects' drop pool.
import { Group, Sprite, SpriteMaterial, CanvasTexture, Vector3 } from 'three';

const _v = new Vector3(), _a = new Vector3(), _h = new Vector3();

function puffTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,0.75)');
  r.addColorStop(0.4, 'rgba(255,255,255,0.32)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
}

export class DinoWeather {
  constructor(mod) {
    this.mod = mod;
    this.ctx = mod.ctx;
    this.group = new Group();
    this.group.name = 'dino-weather';
    this.ctx.scene.add(this.group);
    const tex = puffTexture();
    this.puffs = [];
    for (let i = 0; i < 110; i++) {
      const s = new Sprite(new SpriteMaterial({ map: tex, color: 0xf2f4f5, transparent: true, opacity: 0, depthWrite: false }));
      s.scale.setScalar(1e-4);
      s.visible = i === 0; // one stays drawn (empty) so the shader compiles at load; the rest only while in use
      s.name = 'breath';
      s.renderOrder = 6;
      this.group.add(s);
      this.puffs.push({ s, life: 0, p: new Vector3(), v: new Vector3() });
    }
    this.next = 0;
    this.w = { x: 0, z: 0 };
    // the wind tool: a stroke passing over the chimney smoke blows at the smoke, not at the ground behind it
    window.__jtWindPick = (ray, out) => {
      const sm = this.ctx.modules.life?.smoke;
      if (!sm?.origin || !ray) return false;
      let best = 0.35, bt = -1;
      const test = (x, y, z, r) => {
        const t = (x - ray.origin.x) * ray.direction.x + (y - ray.origin.y) * ray.direction.y + (z - ray.origin.z) * ray.direction.z;
        if (t <= 0) return;
        const dx = ray.origin.x + ray.direction.x * t - x, dy = ray.origin.y + ray.direction.y * t - y, dz = ray.origin.z + ray.direction.z * t - z;
        const d = Math.hypot(dx, dy, dz) - r;
        if (d < best) (best = d), (bt = t);
      };
      const o = sm.origin;
      for (let k = 0; k <= 6; k++) test(o.x, o.y + k * 0.2, o.z, 0.1); // the column above the chimney
      for (let i = 0; i < sm.N; i++) if (sm.alive[i]) test(sm.px[i], sm.py[i], sm.pz[i], 0.15); // the puffs
      if (bt < 0) return false;
      out.copy(ray.origin).addScaledVector(ray.direction, bt);
      return true;
    };
  }

  // how much breath shows: cold air (below about 15 °C), early mornings, rain-cooled air
  cold() {
    const life = this.ctx.modules.life?.env, w = this.ctx.world;
    const temp = life?.temp ?? 18, tod = w.timeOfDay ?? 0.5;
    const morning = Math.max(0, 1 - Math.abs(tod - 0.27) * 7);
    const k = Math.min(1, Math.max(0, (15 - temp) / 9)) + morning * 0.55 + (life?.rain || 0) * 0.25 + (life?.night || 0) * 0.15;
    return Math.min(1, k);
  }

  // the wind (units/s) where an animal stands
  windAt(x, z, lift = 0.3) {
    const v = this.ctx.wind?.sample?.(x, z, this.w, lift);
    return { x: Number.isFinite(v?.x) ? v.x : 0, z: Number.isFinite(v?.z) ? v.z : 0 };
  }

  // a vertex of the animal's skin, where it is now
  vert(d, i, out) {
    const m = d.skinMesh;
    if (!m || i < 0) return null;
    m.getVertexPosition(i, out);
    return m.localToWorld(out);
  }

  puff(p, v, size, alpha, life) {
    const P = this.puffs[this.next];
    this.next = (this.next + 1) % this.puffs.length;
    P.p.copy(p);
    P.v.copy(v);
    P.size = size;
    P.alpha = alpha;
    P.life = P.max = life;
    P.s.visible = true;
  }

  update(dt) {
    const mod = this.mod, cold = this.cold();
    const life = this.ctx.modules.life?.env, night = life?.night ?? 0;
    for (const d of mod.walkers || []) {
      if (!d.root.visible || !d.skinMesh) continue;
      const info = d.skinMesh.geometry.userData.jtSkin;
      if (!info) continue;
      // drips: from a spread of low points, more the wetter it is and the bigger it is
      const wet = Math.max(d.wet || 0, (d._dripT || 0) > 0 ? 0.9 : 0);
      if (wet > 0.35 && info.dripIdx?.length && !d.swimming) {
        d._dripAcc = (d._dripAcc || 0) + dt * (wet - 0.3) * (4 + d.length * 9);
        while (d._dripAcc >= 1) {
          d._dripAcc -= 1;
          const p = this.vert(d, info.dripIdx[Math.floor(Math.random() * info.dripIdx.length)], _v);
          if (p) mod.effects.drip(p, this.ctx.terrain.height(p.x, p.z), Math.min(1.6, 0.6 + d.length * 0.4));
        }
      }
      // breath
      if (cold > 0.05 && info.nosIdx?.length) {
        const head = d.headBone?.getWorldPosition(_h);
        const roar = d.currentName === 'roar' || d.currentName === 'threat';
        // the exhale: once per breath (the feet module keeps the breathing rate, quicker after a run)
        const ph = Math.floor((d.feet?.breathT || 0) / (Math.PI * 2));
        const exhale = d._breathPh !== undefined && ph !== d._breathPh;
        d._breathPh = ph;
        const nose = this.vert(d, info.nosIdx[0], _a);
        if (!nose || !head) continue;
        // out along the snout, a little down
        const dir = _v.copy(nose).sub(head);
        dir.y *= 0.35; // the breath goes out ahead, not up with a raised head
        dir.normalize();
        const wind = this.windAt(nose.x, nose.z, 0.3);
        const size = Math.max(0.025, d.length * 0.05);
        const a = 0.5 * cold * (1 - night * 0.4) * (d.state === 'sleep' ? 0.7 : 1);
        if (exhale && !roar) {
          const puffs = d.feet?.puff > 0.3 ? 3 : 2;
          for (let k = 0; k < puffs; k++) {
            const i = info.nosIdx[k % info.nosIdx.length];
            const p = this.vert(d, i, _a) || nose;
            this.puff(p, dir.clone().multiplyScalar(size * 3).add({ x: wind.x * 0.4, y: -size * 0.6, z: wind.z * 0.4 }), size * 0.9, a, 1.4 + Math.random() * 0.7);
          }
        }
        // a roar: a long cloud blown out of the open mouth
        if (roar) {
          d._roarT = (d._roarT || 0) + dt;
          if (d._roarT < 1.6 && (d._roarAcc = (d._roarAcc || 0) + dt * 30) >= 1) {
            d._roarAcc -= 1;
            const tip = this.vert(d, info.snoutIdx, _a) || nose;
            const sp = d.length * (0.3 + Math.random() * 0.25);
            const jit = new Vector3((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.3).multiplyScalar(sp);
            this.puff(tip, dir.clone().multiplyScalar(sp).add(jit), size * 0.85, Math.min(0.55, a * 1.2 + 0.08 * cold), 2 + Math.random() * 0.8);
          }
        } else d._roarT = 0;
      }
    }
    // the vapour: slows, swells, rises a touch, goes with the wind, fades
    for (const P of this.puffs) {
      if (P.life <= 0) continue;
      P.life -= dt;
      const t = 1 - P.life / P.max;
      const wind = this.windAt(P.p.x, P.p.z, 0.4);
      const k = Math.min(1, dt * 2.2);
      P.v.x += (wind.x * 0.9 - P.v.x) * k;
      P.v.z += (wind.z * 0.9 - P.v.z) * k;
      P.v.y += (0.03 - P.v.y) * k;
      P.p.addScaledVector(P.v, dt);
      P.s.position.copy(P.p);
      P.s.scale.setScalar(P.size * (1 + t * 3.2));
      P.s.material.opacity = P.life > 0 ? P.alpha * Math.min(1, t * 8) * (1 - t) ** 1.4 : 0;
      P.s.material.rotation = P.seed ?? (P.seed = Math.random() * 6.28);
      if (P.life <= 0) (P.s.scale.setScalar(1e-4)), (P.s.visible = P === this.puffs[0]);
    }
  }
}
