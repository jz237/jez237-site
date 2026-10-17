// The film look, over Weatherglass's own finishing passes:
//   - a colour grade for the time of day: cool, soft and pearly at dawn; clean and lightly warm at noon;
//     amber highlights over teal shadows in the golden hour; rose and violet at dusk; blue, quiet and
//     less saturated at night; flat and cool under rain;
//   - the vignette deepens towards night and while the camera follows an animal.
// The grade's uniforms are patched into the page (tools/build-page.mjs). (The depth of field tried in
// v1.46 is gone: it blurred badly while zooming. Weatherglass's own soft focus is untouched.)
import { Vector3 } from 'three';

const _v = new Vector3();
// [saturation, contrast (S-curve), shadow tint rgb, highlight tint rgb], in display units
const LOOKS = {
  day: [1.1, 0.22, [-0.01, 0.0, 0.02], [0.025, 0.014, -0.008]],
  dawn: [0.95, 0.14, [0.01, 0.015, 0.05], [0.06, 0.035, 0.03]],
  golden: [1.22, 0.3, [-0.03, 0.012, 0.045], [0.1, 0.045, -0.05]],
  dusk: [1.05, 0.26, [0.03, -0.012, 0.07], [0.09, 0.02, 0.02]],
  night: [0.72, 0.28, [-0.015, 0.005, 0.06], [-0.02, 0.01, 0.04]],
  rain: [0.75, 0.1, [-0.008, 0.008, 0.028], [-0.012, 0.0, 0.02]],
};

export class Cinema {
  constructor(mod) {
    this.mod = mod;
    this.ctx = mod.ctx;
    this.post = this.ctx.post;
    this.on = new URLSearchParams(location.search).get('cinema') !== '0';
    if (!this.on || !this.post) return;
    const U = this.post.grade?.uniforms;
    if (U) for (const k of ['uGShadow', 'uGHigh']) U[k].value = new Vector3().fromArray(U[k].value);
  }

  update(dt) {
    if (!this.on || !this.post?.grade) return;
    const sub = this.mod.guide?.follow || null;
    // the grade for the hour and the weather
    const e = this.ctx.modules.life?.env || {};
    const t = this.ctx.world.timeOfDay ?? 0.5;
    const night = e.night || 0, tw = (e.dusk || 0) * (1 - night), gold = (e.golden || 0) * (1 - tw) * (1 - night);
    const wet = Math.max(e.rain || 0, (e.storm || 0) * 0.8) * (1 - night * 0.5);
    const w = { day: 1, dawn: 0, golden: 0, dusk: 0, night: 0, rain: 0 };
    const mixIn = (k, a) => {
      for (const j in w) w[j] *= 1 - a;
      w[k] += a;
    };
    mixIn('golden', gold);
    mixIn(t < 0.5 ? 'dawn' : 'dusk', tw);
    mixIn('night', night);
    mixIn('rain', wet);
    let sat = 0, con = 0;
    const sh = [0, 0, 0], hi = [0, 0, 0];
    for (const k in w) {
      const L = LOOKS[k], a = w[k];
      sat += L[0] * a;
      con += L[1] * a;
      for (let i = 0; i < 3; i++) (sh[i] += L[2][i] * a), (hi[i] += L[3][i] * a);
    }
    const U = this.post.grade.uniforms;
    const k = Math.min(1, dt * 1.5); // eased, so a change of weather or hour fades in
    U.uGSat.value += (sat - U.uGSat.value) * k;
    U.uGCon.value += (con - U.uGCon.value) * k;
    U.uGShadow.value.lerp(_v.set(sh[0], sh[1], sh[2]), k);
    U.uGHigh.value.lerp(_v.set(hi[0], hi[1], hi[2]), k);
    const vig = 0.26 + 0.14 * night + 0.05 * tw + (sub ? 0.06 : 0);
    U.uVignette.value += (vig - U.uVignette.value) * k;
  }
}
