// The film look, over Weatherglass's own finishing passes:
//   - a colour grade for the time of day: cool, soft and pearly at dawn; clean and lightly warm at noon;
//     amber highlights over teal shadows in the golden hour; rose and violet at dusk; blue, quiet and
//     less saturated at night; flat and cool under rain;
//   - the soft focus (the tilt-shift's sharp band) follows what the camera looks at: the animal it follows,
//     or the point it turns about, eased so it settles rather than snaps; a little narrower and stronger
//     close up, like a longer lens;
//   - the vignette deepens towards night and while the camera follows an animal.
// The grade's uniforms and the focus hook are patched into the page (tools/build-page.mjs).
import { Vector3, MathUtils, DepthTexture } from 'three';

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
    this.focus = 0.47;
    this.cur = null;
    if (!this.on || !this.post) return;
    const U = this.post.grade?.uniforms;
    if (U) for (const k of ['uGShadow', 'uGHigh']) U[k].value = new Vector3().fromArray(U[k].value);
    window.__jtTilt = (f, band, amount) => this.tilt(f, band, amount);
    // the scene's depth, for focusing by distance (the render pass draws into its own multisampled target
    // on all but the weakest devices; without one the plain tilt-shift band is kept)
    const tgt = this.post.renderPass?.target;
    if (tgt && new URLSearchParams(location.search).get('dof') !== '0') {
      tgt.dispose();
      tgt.depthTexture = new DepthTexture(tgt.width, tgt.height);
      for (const p of [this.post.tiltX, this.post.tiltY]) {
        p.uniforms.tDepth.value = tgt.depthTexture;
        p.uniforms.uDepthOn.value = 1;
      }
      this.dof = true;
    }
  }

  // Weatherglass's per-frame tilt-shift (its band and strength for the zoom), aimed at what we look at
  tilt(f, band, amount) {
    const docu = this.mod.interact?.docu?.on;
    if (this.dof) {
      const cam = this.ctx.camera;
      for (const p of [this.post.tiltX, this.post.tiltY]) {
        const u = p.uniforms;
        u.uZFocus.value = this.zFocus;
        u.uZNear.value = cam.near;
        u.uZFar.value = cam.far;
        u.uDof.value = this.dofK;
        u.uBandK.value = 0.3;
        u.uDepthOn.value = docu ? 0 : 1; // (Documentary mode keeps its own narrow focus band on its subject)
      }
    }
    if (docu) return; // Documentary mode places its own focus band (docu.js)
    const r = this.ctx.cameraRig;
    const close = MathUtils.clamp((6 - r.radius) / 5, 0, 1);
    this.post.setTiltShift(this.focus, band * (1 - 0.3 * close), amount * (1 + 0.25 * close));
  }

  update(dt) {
    if (!this.on || !this.post?.grade) return;
    const cam = this.ctx.camera, r = this.ctx.cameraRig;
    // where the subject is on the screen
    const sub = this.mod.guide?.follow || null;
    const docu = this.mod.interact?.docu;
    if (docu?.on && docu.look) _v.copy(docu.look);
    else if (sub?.root) _v.copy(sub.root.position).setY(sub.root.position.y + (sub.height || 0.3) * 0.5);
    else _v.copy(r.target);
    // its distance from the lens (eased), and how shallow the focus is: shallower close up, as with a
    // longer lens on a nearer subject
    const z = Math.max(0.3, -_v.clone().applyMatrix4(cam.matrixWorldInverse).z);
    this.zFocus = this.zFocus ? this.zFocus + (z - this.zFocus) * Math.min(1, dt * 3) : z;
    this.dofK = MathUtils.lerp(1.6, 3.2, MathUtils.clamp((7 - z) / 6, 0, 1)) * (docu?.on ? 1.3 : 1);
    _v.project(cam);
    const want = MathUtils.clamp((_v.y + 1) / 2, 0.18, 0.82);
    this.focus += (want - this.focus) * Math.min(1, dt * 1.6);
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
