import { initGL, gl, caps, bindFBO } from './gl.js';
import { m4, v3, clamp, lerp } from './math.js';
import { OceanSim } from './ocean.js';
import { Sky } from './sky.js';
import { Water } from './water.js';
import { Post } from './post.js';
import { skyState, starRotation } from './astro.js';

const params = new URLSearchParams(location.search);
const canvas = document.getElementById('sea');

class App {
  constructor() {
    initGL(canvas, { preserve: params.has('shot') });
    this.q = params.get('q') || (caps.software ? 'low' : 'high');
    this.sim = new OceanSim({ N: this.q === 'low' ? 128 : 256, cascades: this.q === 'low' ? 4 : 5 });
    this.sky = new Sky();
    this.water = new Water();
    this.post = new Post();
    this.state = {
      tod: 16.5, sea: 4, windDir: 0.55, cloud: 0.35, rain: 0, haze: 1,
    };
    this.cam = { x: 0, y: 3, z: 0, yaw: 4.2, pitch: -0.03, fov: 50 * Math.PI / 180 };
    this.time = 0;
    this.frame = 0;
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
  }

  camForward() {
    const c = this.cam, cp = Math.cos(c.pitch);
    return [Math.sin(c.yaw) * cp, Math.sin(c.pitch), -Math.cos(c.yaw) * cp];
  }

  step(dt) {
    this.time += dt;
    this.sim.setSea(this.state.sea, this.state.windDir);
    this.sim.update(dt);
  }

  render(dt) {
    const S = this.state, cam = this.cam;
    const sk = skyState(S.tod);
    sk.haze = S.haze;
    this.sk = sk;
    const aspect = this.w / this.h;
    const P = m4.perspective(cam.fov, aspect, 0.1, 400000);
    const R = m4.viewRot(this.camForward());
    const VP = m4.mul(P, R);
    const invVP = m4.invert(VP);
    this.sky.updateLUT(sk, cam.y);
    bindFBO(this.post.fbo);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST); gl.depthMask(true);
    gl.clearDepth(1); gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.w, this.h);
    this.sky.draw(sk, cam.y, m4.f32(invVP), starRotation(S.tod), this.time, null);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.disable(gl.CULL_FACE);
    const wind = [Math.cos(S.windDir), Math.sin(S.windDir)];
    this.water.draw(cam, this.sim, m4.f32(VP), p => {
      this.sky.setLightUniforms(p, sk, cam.y);
      p.t('uTransLUT', 0, this.sky.trans).t('uSkyLUT', 1, this.sky.view);
      p.f('uTime', this.time).v2('uWind', wind[0], wind[1]).f('uWindSpeed', this.sim.cur.U);
    });
    gl.disable(gl.DEPTH_TEST);
    this.post.exposure(dt, sk.key, this.frame === 0);
    this.post.bloom();
    this.post.tonemap(this.w, this.h, this.time);
    this.frame++;
  }
}

const app = new App();
window.__sea = {
  app,
  set(p) { Object.assign(app.state, p.state || {}); if (p.cam) Object.assign(app.cam, p.cam); },
  // advance the simulation without drawing
  warm(seconds, dt = 0.1) { const n = Math.ceil(seconds / dt); for (let i = 0; i < n; i++) app.step(dt); },
  shot(dt = 0.016) { app.step(dt); app.render(dt); gl.finish(); return { frame: app.frame, w: app.w, h: app.h }; },
  info() { return { renderer: caps.renderer, q: app.q, exposure: null }; },
};
const applyURL = () => {
  const s = {};
  if (params.has('t')) s.tod = parseFloat(params.get('t'));
  if (params.has('sea')) s.sea = parseFloat(params.get('sea'));
  if (params.has('cloud')) s.cloud = parseFloat(params.get('cloud'));
  if (params.has('rain')) s.rain = parseFloat(params.get('rain'));
  if (params.has('wind')) s.windDir = parseFloat(params.get('wind'));
  Object.assign(app.state, s);
  if (params.has('cam')) {
    const [x, y, z, yaw, pitch, fov] = params.get('cam').split(',').map(Number);
    Object.assign(app.cam, { x, y, z, yaw, pitch }); if (fov) app.cam.fov = fov * Math.PI / 180;
  }
};
applyURL();
if (params.has('shot')) {
  // deterministic capture mode: the test harness drives the frames.
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
