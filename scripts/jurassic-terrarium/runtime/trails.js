// Game trails: where the animals keep walking the planting is pressed flat and the ground wears bare.
// A low-resolution trample map over the whole case: every walking animal presses into it round its
// body (the heavy ones harder); it recovers slowly, over minutes, so a route used again and again
// becomes a trail and an abandoned one grows back. Weatherglass's grass and ground read it through the
// shared uniform uJtTrample (patched in by build-page.mjs); the planted ferns read it too (flora.js).
import { DataTexture, RGBAFormat, UnsignedByteType, LinearFilter } from 'three';

const NX = 144, NZ = 64;
const OFF = new URLSearchParams(location.search).get('trails') === '0'; // for comparison

export class Trails {
  constructor(mod) {
    this.mod = mod;
    this.ctx = mod.ctx;
    this.v = new Float32Array(NX * NZ);
    this.data = new Uint8Array(NX * NZ * 4);
    this.tex = new DataTexture(this.data, NX, NZ, RGBAFormat, UnsignedByteType);
    this.tex.magFilter = this.tex.minFilter = LinearFilter;
    this.tex.needsUpdate = true;
    const U = this.ctx.uniforms;
    if (U?.uJtTrample) U.uJtTrample.value = this.tex;
    this.acc = 0;
  }

  // world xz to the map's cells (the same frame as Weatherglass's fields: the whole case)
  cell(x, z) {
    const b = this.ctx.box;
    return [((x + b.halfW) / (2 * b.halfW)) * NX - 0.5, ((z + b.halfD) / (2 * b.halfD)) * NZ - 0.5];
  }

  update(dt) {
    if (OFF) return;
    this.acc += dt;
    if (this.acc < 0.25) return;
    const t = this.acc;
    this.acc = 0;
    const v = this.v, b = this.ctx.box;
    // recovery: about four minutes to grow most of the way back
    const keep = Math.exp(-t / 240);
    for (let i = 0; i < v.length; i++) v[i] *= keep;
    // pressing in round each walking body
    const cw = (2 * b.halfW) / NX, cd = (2 * b.halfD) / NZ;
    for (const d of this.mod.walkers || []) {
      if (!d.root.visible || d.speed < 0.02 || d.swimming) continue;
      const r = Math.max(0.06, (d.sp.bodyR ?? 0.12) * d.k * 1.1), amt = t * 0.32 * Math.min(1.6, d.feet?.weight || 1);
      const [cx, cz] = this.cell(d.pos.x, d.pos.z), rx = r / cw, rz = r / cd;
      for (let z = Math.max(0, Math.floor(cz - rz)); z <= Math.min(NZ - 1, Math.ceil(cz + rz)); z++)
        for (let x = Math.max(0, Math.floor(cx - rx)); x <= Math.min(NX - 1, Math.ceil(cx + rx)); x++) {
          const q = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
          if (q >= 1) continue;
          const k = z * NX + x;
          v[k] = Math.min(1, v[k] + amt * (1 - q));
        }
    }
    const D = this.data;
    for (let i = 0; i < v.length; i++) D[i * 4] = Math.round(v[i] * 255);
    this.tex.needsUpdate = true;
  }

  at(x, z) {
    const [cx, cz] = this.cell(x, z), xi = Math.round(cx), zi = Math.round(cz);
    return xi < 0 || zi < 0 || xi >= NX || zi >= NZ ? 0 : this.v[zi * NX + xi];
  }
}
