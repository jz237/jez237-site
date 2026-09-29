import { initGL, gl, caps, bindFBO } from './gl.js';
import { m4, v3, clamp, lerp, smoothstep } from './math.js';
import { OceanSim } from './ocean.js';
import { Sky } from './sky.js';
import { Water } from './water.js';
import { Post } from './post.js';
import { Clouds } from './clouds.js';
import { Lighting, bindLighting } from './lighting.js';
import { skyState, starRotation } from './astro.js';
import { Yacht } from './yacht.js';
import { WaveProbe } from './probe.js';
import { Trail, TRAIL_SIZE } from './wake.js';
import { Ripples, RIPPLE_SIZE } from './ripples.js';
import { Rain, Lightning } from './weather.js';
import { Fx } from './fx.js';

const params = new URLSearchParams(location.search);
const canvas = document.getElementById('sea');
const NEAR = 0.1, FAR = 400000;

class App {
  constructor() {
    initGL(canvas, { preserve: params.has('shot') });
    this.q = params.get('q') || (caps.software ? 'low' : 'high');
    this.sim = new OceanSim({ N: this.q === 'low' ? 128 : 256, cascades: this.q === 'low' ? 4 : 5 });
    this.sky = new Sky();
    this.water = new Water();
    this.post = new Post();
    this.clouds = new Clouds();
    this.light = new Lighting();
    this.probe = new WaveProbe();
    this.yacht = new Yacht();
    this.trail = new Trail();
    this.ripples = new Ripples(this.q === 'low' ? 512 : 1024);
    this.rain = new Rain();
    this.lightning = new Lightning();
    this.fx = new Fx();
    this.yachtOn = !params.has('noyacht');
    this.state = { tod: 16.5, sea: 4, windDir: 0.55, cloud: 0.35, rain: 0, lightning: 0, haze: 1, storm: 0 };
    this.cam = { x: 0, y: 3, z: 0, yaw: 4.2, pitch: -0.03, fov: 50 * Math.PI / 180 };
    this.time = 0;
    this.frame = 0;
    this.under = false;
    this.surfaceAtCam = 0;
    this.res = parseFloat(params.get('res') || '1');
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2) * this.res;
    const w = Math.max(64, Math.round(canvas.clientWidth * dpr)), h = Math.max(64, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    this.w = w; this.h = h;
    this.post.resize(w, h);
    this.clouds.resize(w, h);
  }

  camForward() {
    const c = this.cam, cp = Math.cos(c.pitch);
    return [Math.sin(c.yaw) * cp, Math.sin(c.pitch), -Math.cos(c.yaw) * cp];
  }

  // Test/tour helper: place the camera relative to the yacht and look at it.
  placeRelativeToYacht([dist, height, azDeg, lookH = 2.2]) {
    const y = this.yacht, az = azDeg * Math.PI / 180;
    const a = y.psi + az;               // azimuth measured from the bow towards starboard
    this.cam.x = y.x + Math.cos(a) * dist; this.cam.z = y.z + Math.sin(a) * dist; this.cam.y = height;
    const dx = y.x - this.cam.x, dz = y.z - this.cam.z, dy = (y.y + lookH) - this.cam.y;
    this.cam.yaw = Math.atan2(dx, -dz); this.cam.pitch = Math.atan2(dy, Math.hypot(dx, dz));
  }

  // Advance simulations by dt seconds of wall time.
  step(dt) {
    const S = this.state;
    this.time += dt;
    S.storm = clamp(0.62 * S.rain + 0.38 * (S.lightning > 0 ? 1 : 0) + 0.18 * smoothstep(6.5, 9, S.sea), 0, 1);
    S.haze = 1 + 3.2 * S.rain + 0.8 * S.storm;
    const wv = [Math.cos(S.windDir), Math.sin(S.windDir)];
    this.sim.setSea(S.sea, S.windDir);
    this.sim.update(dt);
    const cw = 6 + 0.55 * this.sim.cur.U;
    this.clouds.advance(dt, [wv[0] * cw, wv[1] * cw]);
    this.probe.poll();
    if (this.yachtOn) {
      this.yacht.feed(this.probe);
      this.yacht.update(dt, { U: this.sim.cur.U, windDir: S.windDir, hs: this.sim.cur.hs });
      this.trail.update(dt, this.yacht, this.time);
    }
    if (this.probe.fresh) {
      this.surfaceAtCam = this.probe.get(5)[0];
      const c = this.cam.y - this.surfaceAtCam;
      if (this.under && c > 0.06) this.under = false;
      else if (!this.under && c < -0.04) this.under = true;
    }
    this.probe.fresh = false;
    this.probe.request(this.sim, [...this.yacht.probePoints(), [this.cam.x, this.cam.z]]);
    // ripples: rain everywhere, disturbances from the hull
    const R = this.ripples, m = v => v - Math.floor(v / RIPPLE_SIZE) * RIPPLE_SIZE;
    R.rain = S.rain;
    R.sources = [];
    if (this.yachtOn && this.yacht.speed > 0.5) {
      const Y = this.yacht, c = Math.cos(Y.psi), s = Math.sin(Y.psi);
      const at = (lx, lz) => [m(Y.x + c * lx - s * lz), m(Y.z + s * lx + c * lz)];
      const k = 0.5 * Math.min(1, Y.speed / 3);
      R.sources.push([...at(5.2, 0), 0.4, k], [...at(2.5, 1.5), 0.35, k * 0.5], [...at(2.5, -1.5), 0.35, k * 0.5], [...at(-4.6, 0), 0.5, k * 0.6]);
    }
    R.update(dt);
    this.lightning.update(dt, S.lightning, this.cam, this.cam.yaw);
  }

  render(dt) {
    const S = this.state, cam = this.cam;
    const sk = skyState(S.tod);
    sk.haze = S.haze;
    this.sk = sk;
    const aspect = this.w / this.h;
    const P = m4.perspective(cam.fov, aspect, NEAR, FAR);
    const fwd = this.camForward();
    const R = m4.viewRot(fwd);
    const VP = m4.mul(P, R);
    const invVP = m4.f32(m4.invert(VP));
    const VPf = m4.f32(VP);
    const camAbs = [cam.x, Math.max(cam.y, 0.5), cam.z];
    const under = this.under;
    const C = this.clouds;
    C.setWeather(S.cloud, S.storm);
    const flash = this.lightning.cloudFlash(cam, sk.pre);

    this.sky.updateLUT(sk, cam.y);
    C.renderShadow(this.sky, sk, camAbs);
    C.renderEnv(this.sky, sk, camAbs, this.q === 'low' ? 50 : 70, flash);
    if (!under) C.renderView(this.sky, sk, camAbs, invVP, this.frame, this.q === 'low' ? 90 : 140, flash);
    this.light.update(this.sky, sk, camAbs[1], C.env);
    const ctx = { sky: this.sky, clouds: C, light: this.light, sk, camAbs, cam, time: this.time, w: this.w, h: this.h };
    this.ctx = ctx;

    // underwater beam bookkeeping for caustics
    const useSun = sk.dayLevel >= sk.moonLevel;
    const Ld = useSun ? sk.sunDir : sk.moonDir;
    const eta = 0.75, mu = Math.max(Ld[1], 0.03);
    const sunW = (() => { const cosI = mu, k = 1 - eta * eta * (1 - cosI * cosI); const t = eta * cosI + Math.sqrt(Math.max(k, 0));
      return [-Ld[0] * eta, -Ld[1] * eta - t + eta * 0 , -Ld[2] * eta].map((v, i) => v); })();
    // exact refraction of the incident direction (-Ld) about the up normal
    const I = [-Ld[0], -Math.max(Ld[1], 0.03), -Ld[2]]; const il = Math.hypot(...I); I[0] /= il; I[1] /= il; I[2] /= il;
    const cosi = -I[1], k2 = 1 - eta * eta * (1 - cosi * cosi), tt = eta * cosi + Math.sqrt(Math.max(k2, 0));
    const sunWv = [eta * I[0], eta * I[1] + tt, eta * I[2]];
    if (under) this.fx.updateCaustics(this.sim, sunWv, cam);

    bindFBO(this.post.fbo);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST); gl.depthMask(true);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.DEPTH_BUFFER_BIT | (under ? gl.COLOR_BUFFER_BIT : 0));
    gl.viewport(0, 0, this.w, this.h);
    if (!under) this.sky.draw(sk, cam.y, invVP, starRotation(S.tod), this.time, C.rt);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.disable(gl.CULL_FACE);
    if (this.yachtOn) this.yacht.draw(ctx, VPf, camAbs);

    this.post.copyScene();
    const wind = [Math.cos(S.windDir), Math.sin(S.windDir)];
    const mS = v => v - Math.floor(v / RIPPLE_SIZE) * RIPPLE_SIZE;
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.disable(gl.CULL_FACE);
    this.water.draw(cam, this.sim, VPf, p => {
      bindLighting(p, ctx);
      p.f('uTime', this.time).v2('uWind', wind[0], wind[1]).f('uWindSpeed', this.sim.cur.U).f('uUseSun', useSun ? 1 : 0);
      const Y = this.yacht;
      p.v4('uWakeA', Y.x - cam.x, Y.z - cam.z, Math.cos(Y.psi + Y.yaw * 0.5), Math.sin(Y.psi + Y.yaw * 0.5));
      p.v4('uWakeB', Y.speed, 0.11 * Math.pow(Y.speed / 3, 2), this.yachtOn ? 1 : 0, 0);
      p.t('uTrail', 14, this.trail.cur);
      const Sm = TRAIL_SIZE, mod = v => v - Math.floor(v / Sm) * Sm;
      p.v3('uTrailInfo', mod(cam.x), mod(cam.z), Sm);
      p.t('uRipple', 17, this.ripples.cur).v3('uRippleInfo', mS(cam.x), mS(cam.z), RIPPLE_SIZE).f('uRippleTexel', 1 / this.ripples.N)
        .f('uRippleAmt', 1.0);
      p.t('uScene', 15, this.post.colorCopy).t('uSceneDepth', 16, this.post.depthCopy)
        .v2('uRes', this.w, this.h).v3('uFwdV', fwd[0], fwd[1], fwd[2]).f('uNear', NEAR).f('uFar', FAR).f('uHasScene', this.yachtOn && !under ? 1 : 0);
    });

    // composite (rain veil / underwater medium)
    const needFx = under || S.rain > 0.01;
    if (needFx) {
      this.post.copyScene();
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
      bindFBO(this.post.fbo);
      this.fx.composite(this.post, ctx, {
        invVP, fwd, near: NEAR, far: FAR, under, surfY: this.surfaceAtCam, rain: S.rain, cloudBase: C.p.base,
        flash: this.lightning.flash, useSun,
      });
    }
    // particles and bolts
    gl.enable(gl.DEPTH_TEST);
    if (!under) {
      const drift = 0.55 * this.sim.cur.U * (1 + 0.3 * S.rain);
      this.rain.draw(ctx, VPf, S.rain, [wind[0] * drift, wind[1] * drift]);
      this.lightning.draw(ctx, VPf, sk.pre);
    }
    gl.disable(gl.DEPTH_TEST);

    const keyScale = under ? 0.55 : 1;
    this.post.exposure(dt, sk.key * keyScale, this.frame === 0);
    this.post.bloom();
    this.post.tonemap(this.w, this.h, this.time);
    this.frame++;
  }
}

const app = new App();
window.__sea = {
  app,
  set(p) { Object.assign(app.state, p.state || {}); if (p.cam) Object.assign(app.cam, p.cam); },
  async warm(seconds, dt = 0.1) {
    const n = Math.ceil(seconds / dt);
    for (let i = 0; i < n; i++) { app.step(dt); if (i % 3 === 2) { gl.finish(); await new Promise(r => setTimeout(r, 0)); } }
  },
  shot(dt = 0.016) {
    app.step(dt);
    if (app.ycam) app.placeRelativeToYacht(app.ycam);
    // honour the camera immediately for the underwater test (probe latency)
    app.post.first = true;
    app.render(dt); gl.finish();
    return { frame: app.frame, w: app.w, h: app.h, under: app.under };
  },
  info() { return { renderer: caps.renderer, q: app.q }; },
};
const applyURL = () => {
  const s = {};
  for (const [k, key] of [['t', 'tod'], ['sea', 'sea'], ['cloud', 'cloud'], ['rain', 'rain'], ['wind', 'windDir'], ['light', 'lightning']]) {
    if (params.has(k)) s[key] = parseFloat(params.get(k));
  }
  Object.assign(app.state, s);
  if (params.has('ycam')) app.ycam = params.get('ycam').split(',').map(Number);
  if (params.has('cam')) {
    const [x, y, z, yaw, pitch, fov] = params.get('cam').split(',').map(Number);
    Object.assign(app.cam, { x, y, z, yaw, pitch }); if (fov) app.cam.fov = fov * Math.PI / 180;
  }
  if (params.has('under')) app.under = params.get('under') === '1';
};
applyURL();
if (params.has('shot')) {
  window.__seaReady = true;
} else {
  let last = performance.now();
  const loop = (now) => {
    const dt = clamp((now - last) / 1000, 0.001, 0.1); last = now;
    app.resize(); app.step(dt); app.render(dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
