// Dynamic light registry. Breaks, launch flashes, salutes and the bridge
// waterfall register lights with simple time curves; each frame the brightest
// NL go to the shaders that light the smoke, haze, water, city and crowd.
import * as THREE from 'three';
import { NL } from './glsl.js?v=3';
import { G } from './physics.js?v=3';

export class Lights {
  constructor() {
    this.list = [];
    this.uniforms = {
      uLP: { value: Array.from({ length: NL }, () => new THREE.Vector4()) },
      uLC: { value: Array.from({ length: NL }, () => new THREE.Vector4()) },
      uLN: { value: 0 },
      uHaze: { value: 1.0e-4 },
    };
    this.total = new THREE.Vector3(); // summed colour-weighted intensity (for exposure hints)
    this._work = [];
  }

  // Burst light: flash then the glow of the burning stars, falling with the cloud.
  burst({ t0, pos, color, flash = 2e5, flashTau = 0.06, glow = 3e4, life = 2.2, radius = 60, kg = 0.9 }) {
    this.list.push({ t0, pos: pos.slice(), color: color.slice(), flash, flashTau, glow, life, radius, kg, end: t0 + Math.max(life * 1.05, flashTau * 10) });
  }

  // Short flash (launch, salute, crackle cluster).
  flash({ t0, pos, color, power, tau = 0.05, radius = 5 }) {
    this.list.push({ t0, pos: pos.slice(), color: color.slice(), flash: power, flashTau: tau, glow: 0, life: 0, radius, kg: 0, end: t0 + tau * 10 });
  }

  // Steady source with flicker (gerbs, waterfall) between t0 and t1.
  steady({ t0, t1, pos, color, power, radius = 20, flicker = 0.25 }) {
    this.list.push({ t0, t1, pos: pos.slice(), color: color.slice(), steady: power, flicker, radius, end: t1 + 0.5 });
  }

  eval(L, t, out) {
    const tau = t - L.t0;
    if (tau < 0) return 0;
    let I = 0, r = L.radius;
    out[0] = L.pos[0]; out[1] = L.pos[1]; out[2] = L.pos[2];
    if (L.steady !== undefined) {
      const ramp = Math.min(1, tau / 0.8) * Math.min(1, Math.max(0, (L.t1 - t) / 0.8));
      const fl = 1 + L.flicker * (Math.sin(t * 37.1 + L.pos[0]) * 0.5 + Math.sin(t * 23.3 + L.pos[2]) * 0.5);
      I = L.steady * ramp * fl;
    } else {
      I = L.flash * Math.exp(-tau / L.flashTau);
      if (L.glow > 0 && tau < L.life) {
        const x = tau / L.life;
        const env = Math.min(1, tau / 0.12) * (1 - smooth(0.55, 1, x));
        I += L.glow * env;
        r = 4 + L.radius * (1 - Math.exp(-tau * 3.5));
        if (L.kg > 0) out[1] -= (G / L.kg) * (tau - (1 - Math.exp(-L.kg * tau)) / L.kg) * 0.6;
      }
    }
    out[3] = r;
    return I;
  }

  update(t) {
    const w = this._work;
    w.length = 0;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const L = this.list[i];
      if (t > L.end) { this.list.splice(i, 1); continue; }
      const o = [0, 0, 0, 0];
      const I = this.eval(L, t, o);
      if (I > 1) w.push({ I, o, c: L.color });
    }
    w.sort((a, b) => b.I - a.I);
    const n = Math.min(NL, w.length);
    const P = this.uniforms.uLP.value, C = this.uniforms.uLC.value;
    this.total.set(0, 0, 0);
    for (let i = 0; i < n; i++) {
      const e = w[i];
      P[i].set(e.o[0], e.o[1], e.o[2], e.o[3]);
      C[i].set(e.c[0] * e.I, e.c[1] * e.I, e.c[2] * e.I, e.I);
      this.total.x += e.c[0] * e.I; this.total.y += e.c[1] * e.I; this.total.z += e.c[2] * e.I;
    }
    this.uniforms.uLN.value = n;
  }

  clear() { this.list.length = 0; this.uniforms.uLN.value = 0; }
}

function smooth(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
