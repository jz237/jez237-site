// Hot days. When it is hot and sunny the animals go to cool off:
//   - the plant-eaters wade into the shallows of the pool or the stream, stand in the water, stamp and
//     splash, and dip to drink; the calves hop and splash about beside their mother;
//   - or (Triceratops, Stegosaurus) they go down to the mud hole by the bank and roll in it, coming out
//     caked from head to tail (the mud dries pale and flakes away over a few minutes; skin.js);
//   - the T. rex lies down in the stream and soaks;
//   - the Brachiosaurus wades in deeper.
// This module finds the places (once), draws the mud hole, and plays the calves' splashing; the animals'
// states are in main.js ('wading', 'soak', the 'mudbath' perform).
import { Mesh, CircleGeometry, MeshStandardMaterial, CanvasTexture } from 'three';

function mudTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  // a blotchy, soft-edged patch
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.random() * 34;
    const x = 64 + Math.cos(a) * r, y = 64 + Math.sin(a) * r, s = 18 + Math.random() * 22;
    const gr = g.createRadialGradient(x, y, 0, x, y, s);
    gr.addColorStop(0, 'rgba(255,255,255,0.9)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  }
  return new CanvasTexture(c);
}

export class Cooling {
  constructor(mod) {
    this.mod = mod;
    this.ctx = mod.ctx;
    this.hole = null;
    this.t = 0;
  }

  // is it a day for it?
  hot() {
    const e = this.ctx.modules.life?.env;
    return !!e && (e.temp ?? 15) > 23 && (e.sunny ?? 0) > 0.45 && (e.rain || 0) < 0.1 && (e.night || 0) < 0.3;
  }

  // the mud hole: flat, open ground on the pool's bank, off the footpath
  makeHole() {
    if (this.hole !== null) return this.hole;
    this.hole = false;
    const T = this.ctx.terrain, d = (this.mod.walkers || []).find((x) => x.sp.id === 'triceratops' && !x.parent);
    if (!d) return false;
    const L = d.layer, nav = this.mod.nav;
    let best = null, bs = -1;
    for (const k of L.open) {
      if (nav.water[k] > 0.08 || nav.slope[k] > 0.12) continue;
      const c = L.centre(k);
      if (window.__jtPathAt?.(c.x, c.z, 0.3)) continue;
      let bank = 0;
      for (let a = 0; a < 8; a++) bank = Math.max(bank, T.lakeMask(c.x + Math.cos(a * 0.785) * 0.45, c.z + Math.sin(a * 0.785) * 0.45));
      if (bank < 0.35 || bank > 0.95) continue;
      const sc = bank + Math.random() * 0.3;
      if (sc > bs) (bs = sc), (best = c);
    }
    if (!best) return false;
    const r = 0.42, g = new CircleGeometry(r, 28, 0, Math.PI * 2);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, T.height(best.x + pos.getX(i), best.z + pos.getZ(i)) + 0.004);
    g.computeVertexNormals();
    const m = new MeshStandardMaterial({ color: 0x2c1d10, roughness: 0.18, metalness: 0, transparent: true, alphaMap: mudTexture(), depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const mesh = new Mesh(g, m);
    mesh.position.set(best.x, 0, best.z);
    mesh.name = 'mud-hole';
    mesh.renderOrder = 0.62;
    mesh.receiveShadow = true;
    this.ctx.scene.add(mesh);
    this.hole = { x: best.x, z: best.z, r, mesh };
    return this.hole;
  }

  // somewhere in the water to stand: deep enough to cool off in, not so deep the animal can't go
  shallows(d, deep = false, stream = false) {
    const L = d.layer, T = this.ctx.terrain;
    // really in the water where it stands (the stream is only open at its fords)
    const lo = deep ? 0.6 : 0.35, hi = deep ? 1.0 : 0.85;
    let best = null, bd = Infinity;
    for (const k of L.open) {
      const c = L.centre(k);
      const lake = T.lakeMask(c.x, c.z), river = T.riverMask(c.x, c.z), w = Math.max(lake, river);
      if (w < lo || w > hi || (stream && river < 0.35)) continue;
      if (!d.clearOfGlass(c.x, c.z)) continue;
      const sy = this.mod.waterSurface(c.x, c.z);
      if (sy == null || sy < T.height(c.x, c.z) + 0.01) continue;
      const dist = Math.hypot(c.x - d.pos.x, c.z - d.pos.z) + Math.random() * 2.5;
      if (dist < bd) (bd = dist), (best = c);
    }
    return best;
  }

  // an animal decides to cool off: where does it go?
  start(d) {
    if (d.sp.predator) {
      const s = this.shallows(d, false, true) || this.shallows(d, false);
      return s && d.goTo(s.x, s.z, () => d.beginSoak(s));
    }
    const hole = (d.sp.id === 'triceratops' || d.sp.id === 'stegosaurus') && Math.random() < 0.45 ? this.makeHole() : null;
    if (hole && !this.hole.busy) {
      const a = Math.random() * Math.PI * 2;
      const t = d.layer.nearestOpen(hole.x + Math.cos(a) * 0.1, hole.z + Math.sin(a) * 0.1);
      if (t && d.goTo(t.x, t.z, () => (this.hole.busy = d, d.perform('mudbath')))) return true;
    }
    const s = this.shallows(d, !!d.sp.tooBig) || this.shallows(d, false);
    return s && d.goTo(s.x, s.z, () => d.beginWade(s));
  }

  update(dt) {
    this.t += dt;
    if (this.hole && this.hole.busy && this.hole.busy.perf?.kind !== 'mudbath') this.hole.busy = null;
    // the mud hole glistens wetter after rain and dries duller in the sun
    if (this.hole?.mesh) {
      const wet = this.ctx.world.groundWetness || 0;
      this.hole.mesh.material.roughness = 0.12 + 0.3 * (1 - Math.min(1, 0.5 + wet));
    }
    // calves in the shallows: hops and splashes and peeps
    for (const c of this.mod.walkers || []) {
      if (!c.parent || c.inWater < 0.15 || c.swimming || c.state === 'flee') continue;
      c._splashT = (c._splashT ?? 1 + Math.random() * 2) - dt;
      if (c._splashT <= 0) {
        c._splashT = 1.2 + Math.random() * 2.2;
        c._flinch = 0.35; // a little hop (main.js)
        const sy = this.mod.waterSurface(c.pos.x, c.pos.z) ?? this.ctx.terrain.height(c.pos.x, c.pos.z);
        this.mod.effects.splash(c.pos.x, c.pos.z, sy, 0.45);
        this.mod.voice.play(Math.random() < 0.5 ? 'peep' : 'splash', c.root.position, 0.4);
      }
    }
  }
}

