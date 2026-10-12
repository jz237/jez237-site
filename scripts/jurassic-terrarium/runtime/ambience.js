// Sound beds for the jungle, played on Weatherglass's own ambience bus (`beds`), so its sound button,
// volume and tab-hidden pause apply. Weatherglass already has the waterfall, birds and insects; this adds:
//   - the three river cascades: babbling white water, louder as the camera comes close to one;
//   - a jungle drone by day: a soft, shimmering cicada chorus that swells and fades;
//   - frogs at night along the pool's edge: short, irregular croaks.
// All synthesised from filtered noise and oscillators, nothing sampled.
import { Vector3 } from 'three';

const CASCADES = [new Vector3(-0.95, 0.72, -0.78), new Vector3(-0.28, 0.44, 0), new Vector3(0.62, 0.2, 0.78)];
const POOL = new Vector3(2.75, 0, 2.6);
const tmp = new Vector3();

export class Ambience {
  constructor(ctx, voices) {
    this.ctx = ctx;
    this.voices = voices;
    this.built = false;
    this.frogT = 2;
  }

  get engine() {
    const a = this.ctx.audio;
    if (!a || !a.engine || a.muted || !a.running) return null;
    return a.engine;
  }

  build(e) {
    const ac = e.ac;
    const bus = e.beds || e.sfx;
    const noise = this.voices.noise(ac);
    const src = () => {
      const s = ac.createBufferSource();
      s.buffer = noise;
      s.loop = true;
      s.start(ac.currentTime, Math.random() * 1.5);
      return s;
    };
    // cascades: two band-passed noise layers, the upper one wobbling like water over stones
    this.water = ac.createGain();
    this.water.gain.value = 0;
    const lo = ac.createBiquadFilter();
    lo.type = 'bandpass';
    lo.frequency.value = 520;
    lo.Q.value = 0.7;
    const hi = ac.createBiquadFilter();
    hi.type = 'bandpass';
    hi.frequency.value = 1900;
    hi.Q.value = 1.4;
    const hiG = ac.createGain();
    hiG.gain.value = 0.45;
    const wob = ac.createOscillator();
    wob.frequency.value = 5.3;
    const wobG = ac.createGain();
    wobG.gain.value = 420;
    wob.connect(wobG).connect(hi.frequency);
    wob.start();
    src().connect(lo).connect(this.water);
    src().connect(hi).connect(hiG).connect(this.water);
    this.waterPan = ac.createStereoPanner ? ac.createStereoPanner() : null;
    if (this.waterPan) this.water.connect(this.waterPan).connect(bus);
    else this.water.connect(bus);
    // cicadas: high band of noise, amplitude-modulated fast (the buzz) and slowly (the swell)
    this.cicada = ac.createGain();
    this.cicada.gain.value = 0;
    const cb = ac.createBiquadFilter();
    cb.type = 'bandpass';
    cb.frequency.value = 4600;
    cb.Q.value = 6;
    const buzz = ac.createGain();
    buzz.gain.value = 0.5;
    const am = ac.createOscillator();
    am.frequency.value = 47;
    const amG = ac.createGain();
    amG.gain.value = 0.5;
    am.connect(amG).connect(buzz.gain);
    am.start();
    src().connect(cb).connect(buzz).connect(this.cicada);
    this.cicada.connect(bus);
    this.t = 0;
    this.built = true;
  }

  update(dt, env) {
    const e = this.engine;
    if (!e) return;
    if (!this.built) this.build(e);
    const ac = e.ac, now = ac.currentTime;
    this.t += dt;
    const cam = this.ctx.camera.position;
    // the nearest cascade sets the water's level and side
    let best = Infinity, at = null;
    for (const c of CASCADES) {
      const d = cam.distanceTo(c);
      if (d < best) (best = d), (at = c);
    }
    const wl = 0.22 * Math.min(1, 5 / (best + 1.5));
    this.water.gain.setTargetAtTime(wl, now, 0.3);
    if (this.waterPan && at) {
      tmp.copy(at).project(this.ctx.camera);
      this.waterPan.pan.setTargetAtTime(Math.max(-0.8, Math.min(0.8, tmp.x * 0.7)), now, 0.3);
    }
    // cicadas by day, strongest in the warm afternoon, quiet in rain and at night
    const night = env?.night || 0, rain = env?.rain || 0;
    const swell = 0.5 + 0.5 * Math.sin(this.t * 0.21) * Math.sin(this.t * 0.067 + 1);
    const cl = 0.045 * (1 - night) * (1 - Math.min(1, rain * 1.5)) * (0.35 + 0.65 * swell);
    this.cicada.gain.setTargetAtTime(cl, now, 0.8);
    // frogs at night by the pool
    if (night > 0.5) {
      this.frogT -= dt;
      if (this.frogT <= 0) {
        this.frogT = 0.4 + Math.random() * 2.5;
        this.frog(e, ac);
      }
    }
  }

  frog(e, ac) {
    const v = this.voices;
    const p = tmp.set(POOL.x + (Math.random() - 0.5) * 3, 0.05, POOL.z + (Math.random() - 0.5) * 1.4);
    const { gain, pan } = v.place(p);
    const t0 = ac.currentTime + 0.02;
    const out = v.out(e, t0, gain * 0.5, pan, 0.25);
    const n = 1 + Math.floor(Math.random() * 3);
    const f = 180 + Math.random() * 160;
    for (let i = 0; i < n; i++) {
      const t = t0 + i * 0.13;
      const o = v.osc(ac, 'square', f, t, t + 0.1);
      const g = v.env(ac, t, 0.005, 0.03, 0.06, 0.25);
      o.connect(v.bp(ac, f * 2.2, 3)).connect(g).connect(out);
    }
  }
}
