import {vessel,imperial,SX,SZ} from './vessels.js';
import {installShipChoice} from './ship-choice.js';
import { initGL, gl, caps, bindFBO } from './gl.js';
import { m4, v3, clamp, lerp, smoothstep } from './math.js';
import { OceanSim, seaParams, seaFromWind, seaPreset } from './ocean.js';
import { waterParams } from './water-types.js';
import { Sound } from './sound.js';
import { Sky } from './sky.js';
import { Water } from './water.js';
import { Post } from './post.js';
import { Clouds } from './clouds.js';
import { Lighting, bindLighting } from './lighting.js';
import { skyState, starRotation } from './astro.js';
import { Yacht } from './yacht.js';
import { loadYachtGeometry } from './yacht-geo.js';
import { WaveProbe } from './probe.js';
import { Trail, TRAIL_SIZE } from './wake.js';
import { Ripples, RIPPLE_SIZE } from './ripples.js';
import { Rain, Lightning } from './weather.js';
import { Fx } from './fx.js';
import { Fish } from './fish.js';
import { Wildlife } from './wildlife.js';
import { Whirlpool } from './whirlpool.js';
import { bindHullWater } from './hull-water.js';
import { HullContact } from './hull-contact.js';
import { HullSpray } from './hull-spray.js';
import { DeckWash } from './deck-wash.js';
import { YachtShadow } from './yacht-shadow.js';
import { mobileProfile,backingSize } from './mobile.js';
import { deviceCheck } from './device-check.js';
import { Rig } from './rig.js';
import { initUI } from './ui.js';
import { watchRelease } from './release.js';

const params = new URLSearchParams(location.search);
if (params.has('shot')) document.body.classList.add('shot');
const canvas = document.getElementById('sea');
const NEAR = 0.1, FAR = 400000;

class App {
  constructor() {
    initGL(canvas, { preserve: params.has('shot') });
    this.mobile=mobileProfile();
    this.q = params.get('q') || (caps.software||this.mobile ? 'low' : 'high');
    this.sim = new OceanSim({ N: this.q === 'low' ? 128 : 256, cascades: this.q === 'low' ? 4 : 5 });
    this.sky = new Sky();
    this.water = new Water();
    this.post = new Post();
    this.clouds = new Clouds();
    this.light = new Lighting();
    this.probe = new WaveProbe();
    this.yacht = new Yacht();this.vessel=vessel;
    this.trail = new Trail();
    this.ripples = new Ripples(this.q === 'low' ? 512 : 1024);
    this.rain = new Rain();
    this.lightning = new Lightning();
    this.fx = new Fx();
    this.fish = new Fish();
    this.wildlife = new Wildlife();
    this.whirlpool = new Whirlpool();
    this.hullContact = new HullContact();
    this.hullSpray = new HullSpray();
    this.deckWash=new DeckWash(this.yacht.metadata);
    this.yachtShadow=new YachtShadow(this.mobile||this.q==='low'?1024:2048);
    this.yachtOn = !params.has('noyacht');
    this.state = { tod: 16.5, windDir: 0.55, cloud: 0.25, rain: 0, lightning: 0, haze: 1, storm: 0 };
    // everything the panel controls; the simulation eases towards it
    this.goal = {
      tod: 16.5, sunManual: false, sunH: 20, sunAz: 240,
      windDir: 0.55, ...seaPreset(4.6), hScale: 1, foam: 1,
      cloud: 0.25, rain: 0, lightning: 0,
      water: 'Open ocean', clarity: 0.94, glow: 1.5,
      ev: 0, bloom: 0.02, fov: 50,
      whirlpool: false,
    };
    this.sound = new Sound();
    this.instant = { tod: false };
    this.easeOn = true;
    this.qualityMode = 'AUTO';
    this.perf = { ema: 16, n: 0 };
    this.cam = { x: 0, y: 3, z: 0, yaw: 4.2, pitch: -0.03, fov: 50 * Math.PI / 180 };
    this.time = 0;
    this.frame = 0;
    this.under = false;
    this.surfaceAtCam = 0;
    this.res = Math.max(.45,Math.min(1,parseFloat(params.get('res') || (this.mobile?'.75':'1'))||1));
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  resize() {
    const [w,h]=backingSize(canvas.clientWidth,canvas.clientHeight,devicePixelRatio||1,this.res,this.mobile);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    this.w = w; this.h = h;
    this.post.resize(w, h);
    this.clouds.resize(w, h);
    this.yacht.resizeRefl(w, h);
  }

  setQuality(mode) {
    this.qualityMode = mode;
    if (mode === 'LOW') this.res = 0.6; else if (mode === 'MED') this.res = 0.85; else if (mode === 'HIGH') this.res = 1; else this.res = Math.min(this.res, 1);
    this.fixedRes = mode !== 'AUTO';
    this.resize();
  }

  // adaptive resolution: keep the frame rate playable on any GPU
  govern(ms) {
    const P = this.perf; P.ema += (ms - P.ema) * 0.08; P.n++;
    if (this.fixedRes || P.n % 30 !== 0 || P.n < 60) return;
    if (P.ema > 27 && this.res > 0.45) { this.res = Math.max(0.45, this.res - 0.08); this.resize(); }
    else if (P.ema < 14 && this.res < 1) { this.res = Math.min(1, this.res + 0.04); this.resize(); }
  }

  requestPhoto() { this.photoReq = true; }

  setWhirlpool(on){this.goal.whirlpool=!!on;this.whirlpool.setEnabled(on,this.yacht);}
  focusWhirlpool(){
    if(!this.whirlpool.enabled&&this.whirlpool.amount<.01)return;
    this.rig?.setMode('fly');delete this.cam.forward;delete this.cam.up;
    const W=this.whirlpool,Y=this.yacht,dx=Y.x-W.x,dz=Y.z-W.z,l=Math.hypot(dx,dz)||1;
    const aspect=this.w/this.h,back=520*Math.max(1,.9/aspect);
    this.cam.x=W.x+dx/l*back;this.cam.z=W.z+dz/l*back;this.cam.y=230*Math.max(1,.75/aspect);
    this.cam.yaw=Math.atan2(W.x-this.cam.x,-(W.z-this.cam.z));
    this.cam.pitch=Math.atan2(-35-this.cam.y,back);this.cam.fov=56*Math.PI/180;this.goal.fov=56;
  }

  camForward() {
    if(this.cam.forward)return this.cam.forward;
    const c = this.cam, cp = Math.cos(c.pitch);
    return [Math.sin(c.yaw) * cp, Math.sin(c.pitch), -Math.cos(c.yaw) * cp];
  }

  sunOverride() { const G = this.goal; return G.sunManual ? { alt: G.sunH, az: G.sunAz } : null; }

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
    if (this.ycam) this.placeRelativeToYacht(this.ycam);
    if (this.lookBody) {     // test helper: aim at the sun or moon
      const sk = skyState(this.state.tod, this.sunOverride()), d = this.lookBody[0] === 'sun' ? sk.sunDir : sk.moonDir;
      this.cam.yaw = Math.atan2(d[0], -d[2]) + (this.lookBody[2] || 0); this.cam.pitch = Math.asin(d[1]) + (this.lookBody[1] || 0);
    }
    if (this.easeOn) {
      const G = this.goal, ez = (a, b, r) => a + clamp(b - a, -r * dt, r * dt);
      let dtod = ((G.tod - S.tod + 36) % 24) - 12;
      S.tod = (S.tod + clamp(dtod, -3.5 * dt, 3.5 * dt) + 24) % 24;
      S.cloud = ez(S.cloud, G.cloud, 0.28); S.rain = ez(S.rain, G.rain, 0.22); S.lightning = G.lightning;
    }
    S.windDir = this.goal.windDir;
    S.storm = clamp(0.62 * S.rain + 0.38 * (S.lightning > 0 ? 1 : 0) + 0.18 * smoothstep(6.5, 9, seaFromWind(this.goal.wind)), 0, 1);
    S.haze = 2.6 + 18 * S.rain + 7 * S.storm;
    const wv = [Math.cos(S.windDir), Math.sin(S.windDir)];
    const G0 = this.goal;
    this.sim.setParams({ wind: G0.wind, swell: G0.swell, chop: G0.chop, hScale: G0.hScale, foam: G0.foam }, S.windDir);
    this.sim.update(dt);
    this.whirlpool.setEnabled(this.goal.whirlpool,this.yacht);
    this.whirlpool.update(dt);
    if (this.rig && this.rig.mode === 'fly') this.cam.fov = G0.fov * Math.PI / 180;
    this.fovK = G0.fov / 50;
    const cw = G0.cloudWind;
    this.clouds.advance(dt, [wv[0] * cw, wv[1] * cw]);
    this.probe.poll();
    if (this.yachtOn) {
      this.yacht.feed(this.probe);
      this.yacht.update(dt, { U: this.sim.cur.U, windDir: S.windDir, hs: this.sim.cur.hs, whirlpool:this.whirlpool });
      this.rig?.syncDeckCamera();
      this.trail.update(dt, this.yacht, this.time, this.sim.cur.U,this.whirlpool);
    }
    if (this.probe.fresh) {
      if(this.yachtOn)this.hullSpray.motion.feed(this.probe,this.yacht,this.time,this.whirlpool);
      this.wildlife.feed(this.probe);
      this.surfaceFFT = this.probe.get(5)[0]-(this.probe.vortexHeights?.[5]||0);
    }
    this.surfaceAtCam=(this.surfaceFFT||0)+this.whirlpool.sample(this.cam.x,this.cam.z).height;
    const cameraClearance=this.cam.y-this.surfaceAtCam;
    if(this.under&&cameraClearance>.06)this.under=false;
    else if(!this.under&&cameraClearance<-.04)this.under=true;
    this.probe.fresh = false;
    this.fish.update(this.time,[this.yacht.x,this.whirlpool.sample(this.yacht.x,this.yacht.z).height,this.yacht.z],!this.under,this.whirlpool);
    this.wildlife.update(dt,this.yacht,{windDir:S.windDir,U:this.sim.cur.U});
    this.hullSpray.motion.update(dt,wv.map(v=>v*this.sim.cur.U),this.whirlpool);
    if(this.probe.request(this.sim, [...this.yacht.probePoints(), [this.cam.x, this.cam.z],...this.wildlife.probePoints(),...this.hullSpray.motion.points(this.yacht),...this.yacht.extraProbePoints()],this.whirlpool))this.hullSpray.motion.noteProbe(this.yacht,this.time);
    // ripples: rain everywhere, disturbances from the hull
    const R = this.ripples, m = v => v - Math.floor(v / RIPPLE_SIZE) * RIPPLE_SIZE;
    R.rain = S.rain;
    R.sources = [];
    if (this.yachtOn && this.yacht.speed > 0.5) {
      const Y = this.yacht, c = Math.cos(Y.psi), s = Math.sin(Y.psi);
      const at = (lx, lz) => [m(Y.x + c * lx - s * lz), m(Y.z + s * lx + c * lz)];
      const k = 0.5 * Math.min(1, Y.speed / 3);
      R.sources.push([...at(22.2*SX,0),.8,k],[...at(10.5*SX,4.0*SZ),.7,k*.5],[...at(10.5*SX,-4.0*SZ),.7,k*.5],[...at(-21.8*SX,0),1.2,k*.6]);
    }
    R.update(dt);
    this.lightning.update(dt, S.lightning, this.cam, this.cam.yaw);
  }

  render(dt) {
    const S = this.state, cam = this.cam;
    const G = this.goal;
    const sk = skyState(S.tod, this.sunOverride());
    sk.water = waterParams(G.water, G.clarity);
    sk.haze = S.haze;
    sk.overcast = Math.min(1, Math.max(0, (S.cloud - 0.5) / 0.4));
    this.sk = sk;
    const aspect = this.w / this.h;
    const P = m4.perspective(cam.fov, aspect, NEAR, FAR);
    const fwd = this.camForward();
    const R = m4.viewRot(fwd,cam.up||[0,1,0]);
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
    const ctx = { sky: this.sky, clouds: C, light: this.light, sk, camAbs, cam, time: this.time, w: this.w, h: this.h, useSun: sk.dayLevel >= sk.moonLevel, fx: this.fx, sim: this.sim, under,whirlpool:this.whirlpool,rain:S.rain };
    { const fr = Math.hypot(flash[0], flash[1], flash[2]) || 1; ctx.flashLight = flash[3] > 0 ? [flash[0] / fr, flash[1] / fr, flash[2] / fr, Math.min(1.4, this.lightning.flash) * 4.0 / (1 + (fr / 350) * (fr / 350))] : [0, 1, 0, 0]; }
    ctx.surfaceAtCam=this.surfaceAtCam;this.ctx = ctx;

    // underwater beam bookkeeping for caustics
    const useSun = sk.dayLevel >= sk.moonLevel;
    const Ld = useSun ? sk.sunDir : sk.moonDir;
    const eta = 0.75, mu = Math.max(Ld[1], 0.03);
    // exact refraction of the incident direction (-Ld) about the up normal
    const I = [-Ld[0], -Math.max(Ld[1], 0.03), -Ld[2]]; const il = Math.hypot(...I); I[0] /= il; I[1] /= il; I[2] /= il;
    const cosi = -I[1], k2 = 1 - eta * eta * (1 - cosi * cosi);
    const sunWv = [eta * I[0], -Math.sqrt(Math.max(k2, 0)), eta * I[2]];    // Snell refraction into the sea
    if (under) this.fx.updateCaustics(this.sim, sunWv, cam);

    this.wildlife.updateSurface(ctx);
    if(this.yachtOn){
      this.hullContact.update(ctx,this.yacht,dt);ctx.hullWet=this.hullContact.cur;
      this.deckWash.update(ctx,this.yacht,dt);ctx.deckWash=this.deckWash;
      this.yachtShadow.update(ctx,this.yacht);ctx.yachtShadow=this.yachtShadow;ctx.yacht=this.yacht;
    }
    bindFBO(this.post.fbo);
    gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST); gl.depthMask(true);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.DEPTH_BUFFER_BIT | (under ? gl.COLOR_BUFFER_BIT : 0));
    gl.viewport(0, 0, this.w, this.h);
    if (!under) this.sky.draw(sk, cam.y, invVP, starRotation(S.tod), this.time, C.rt);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.disable(gl.CULL_FACE);
    if (this.yachtOn) this.yacht.draw(ctx, VPf, camAbs);
    this.wildlife.draw(ctx,VPf,camAbs);
    this.fish.draw(ctx, VPf, camAbs);

    const reflOn = this.yachtOn && !under;
    if (reflOn) { this.yacht.drawReflection({...ctx,wildlife:this.wildlife}, VPf); bindFBO(this.post.fbo); gl.viewport(0, 0, this.w, this.h); gl.enable(gl.DEPTH_TEST); }
    this.post.copyScene();
    const wind = [Math.cos(S.windDir), Math.sin(S.windDir)];
    const mS = v => v - Math.floor(v / RIPPLE_SIZE) * RIPPLE_SIZE;
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.disable(gl.CULL_FACE);
    this.water.draw(cam, this.sim, VPf, p => {
      bindLighting(p, ctx);
      this.whirlpool.bind(p,cam);
      bindHullWater(p,this.yacht,cam,this.yachtOn);
      p.m4('uInvVP',invVP);
      p.f('uHullWetOn',this.yachtOn?1:0);if(this.yachtOn)p.t('uHullWet',6,this.hullContact.cur);
      p.f('uDeckWashOn',this.yachtOn?1:0);
      p.v4v('uWhaleRings',this.wildlife.rings(cam));
      p.v4v('uWhaleContacts',this.wildlife.contacts(cam));
      p.f('uGlowE', G.glow * (1 - smoothstep(0.03, 0.17, sk.key)) * sk.pre * 4e-7).f('uTime', this.time).v2('uWind', wind[0], wind[1]).f('uWindSpeed', this.sim.cur.U).f('uUseSun', useSun ? 1 : 0).i('uDbg', this.dbg || 0).f('uUnder', under ? 1 : 0);
      const Y = this.yacht;
      p.v4('uWakeA', Y.x - cam.x, Y.z - cam.z, Math.cos(Y.psi + Y.yaw), Math.sin(Y.psi + Y.yaw));
      p.v4('uWakeB', Y.speed, 0.20 * Math.pow(Y.speed / 6, 2), this.yachtOn ? 1 : 0, 0);
      p.t('uTrail', 14, this.trail.cur);
      const Sm = TRAIL_SIZE, mod = v => v - Math.floor(v / Sm) * Sm;
      p.v3('uTrailInfo', mod(cam.x), mod(cam.z), Sm);
      p.t('uRipple', 17, this.ripples.cur).v3('uRippleInfo', mS(cam.x), mS(cam.z), RIPPLE_SIZE).f('uRippleTexel', 1 / this.ripples.N)
        .f('uRippleAmt', 1.0);
      p.t('uReflTex', 18, this.yacht.reflTex).f('uReflOn', reflOn ? 1 : 0);
      p.t('uScene', 15, this.post.colorCopy).t('uSceneDepth', 16, this.post.depthCopy)
        .f('uCamDepth', Math.max(0, this.surfaceAtCam - cam.y)).v2('uRes', this.w, this.h).v3('uFwdV', fwd[0], fwd[1], fwd[2]).f('uNear', NEAR).f('uFar', FAR).f('uHasScene', !under ? 1 : 0);
    },this.whirlpool);
    if(this.yachtOn){this.deckWash.draw(ctx,this.yacht,VPf,this.post.colorCopy);this.yacht.drawRig(ctx,VPf,camAbs);}
    this.wildlife.drawSpray({...ctx,windDir:S.windDir},VPf);
    if(this.yachtOn)this.hullSpray.draw(ctx,VPf);

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
    if (under) this.fish.drawSnow(ctx, VPf, camAbs, 1);
    if (!under) {
      const drift = 0.55 * this.sim.cur.U * (1 + 0.3 * S.rain);
      this.rain.draw(ctx, VPf, S.rain, [wind[0] * drift, wind[1] * drift]);
      this.lightning.draw(ctx, VPf, sk.pre);
    }
    gl.disable(gl.DEPTH_TEST);

    const keyScale = under ? 0.55 : 1;
    this.post.exposure(dt, sk.key * keyScale, this.frame === 0);
    this.post.bloom();
    this.post.tonemap(this.w, this.h, this.time, { night: 1 - smoothstep(0.03, 0.17, sk.key), ev: Math.pow(2, G.ev) * (1 - 0.42 * S.storm), bloom: G.bloom });
    if (this.photoReq) {
      this.photoReq = false;
      canvas.toBlob(b => { if (!b) return; const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `open-sea-${Date.now()}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
    }
    this.frame++;
  }
}

let app;
try { await loadYachtGeometry(); app = new App(); installShipChoice(vessel.id); document.getElementById('loading')?.remove(); } catch (e) {
  // no WebGL 2 / float render targets / shader failure: say so instead of leaving a black page
  const f = document.getElementById('fail');
  if (f) {
    f.style.display = 'flex';
    const d = document.createElement('div');
    d.style.cssText = 'margin-top:12px;opacity:.55;font:12px monospace;white-space:pre-wrap;max-width:720px';
    d.textContent = String(e && e.message || e).slice(0, 500);
    f.firstElementChild.appendChild(d);
  }
  throw e;
}
window.__sea = {
  app,
  set(p) { Object.assign(app.state, p.state || {}); if (p.cam) Object.assign(app.cam, p.cam); },
  async warm(seconds, dt = 0.1) {
    const n = Math.ceil(seconds / dt);
    for (let i = 0; i < n; i++) { app.step(dt); if (i % 3 === 2) { gl.finish(); await new Promise(r => setTimeout(r, 0)); } }
  },
  shot(dt = 0.016) {
    app.step(dt);
    if (app.ycam && !app.lookBody) app.placeRelativeToYacht(app.ycam);
    // honour the camera immediately for the underwater test (probe latency)
    if (app.forceBolt) { const L = app.lightning; L._bolt(app.cam, app.cam.yaw + app.forceBolt); L.t = 0.032; L.flash = 0.7; app.forceBolt = 0; }
    app.post.first = true;
    app.render(dt); gl.finish();
    return { frame: app.frame, w: app.w, h: app.h, under: app.under };
  },
  info() { return { renderer: caps.renderer, q: app.q }; },
  // read linear HDR pixels (x, y from top-left) for numeric debugging
  px(list) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, app.post.fbo.fbo);
    const out = [];
    for (const [x, y] of list) { const b = new Float32Array(4); gl.readPixels(x, app.h - 1 - y, 1, 1, gl.RGBA, gl.FLOAT, b); out.push(Array.from(b).map(v => +v.toPrecision(4))); }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return out;
  },
};
const applyURL = () => {
  const s = {};
  for (const [k, key] of [['t', 'tod'], ['cloud', 'cloud'], ['rain', 'rain'], ['wind', 'windDir'], ['light', 'lightning']]) {
    if (params.has(k)) s[key] = parseFloat(params.get(k));
  }
  Object.assign(app.state, s); Object.assign(app.goal, s);
  if (params.has('sea')) Object.assign(app.goal, seaPreset(parseFloat(params.get('sea'))));   // classic 0-9 sea state
  if (params.has('water')) app.goal.water = params.get('water');
  for (const [k, key] of [['glow', 'glow'], ['clarity', 'clarity'], ['ev', 'ev'], ['bloom', 'bloom'], ['fov', 'fov'], ['hs', 'hScale'], ['foam', 'foam'], ['swell', 'swell'], ['chop', 'chop'], ['cloudwind', 'cloudWind']]) {
    if (params.has(k)) app.goal[key] = parseFloat(params.get(k));
  }
  if (params.has('fov') && !params.has('cam')) app.cam.fov = app.goal.fov * Math.PI / 180;
  if (params.has('sunh')) { app.goal.sunManual = true; app.goal.sunH = parseFloat(params.get('sunh')); app.goal.sunAz = parseFloat(params.get('suna') || '240'); }
  if (params.has('ycam')) app.ycam = params.get('ycam').split(',').map(Number);
  if (params.has('cam')) {
    const [x, y, z, yaw, pitch, fov] = params.get('cam').split(',').map(Number);
    Object.assign(app.cam, { x, y, z, yaw, pitch }); if (fov) app.cam.fov = fov * Math.PI / 180;
  }
  if (params.has('look')) { const [b, po, yo] = params.get('look').split(','); app.lookBody = [b, parseFloat(po || 0), parseFloat(yo || 0)]; }
  if (params.has('bolt')) app.forceBolt = parseFloat(params.get('bolt')) || 0.01;
  if (params.has('dbg')) app.dbg = parseInt(params.get('dbg'));
  if (params.has('under')) app.under = params.get('under') === '1';
};
applyURL();
if (params.has('shot')) {
  app.easeOn = false;
  window.__seaReady = true;
} else {
  const rig = new Rig(app, canvas);
  app.rig = rig;
  if (caps.software) app.res = 0.5;
  const ui = initUI(app, rig);
  watchRelease();
  const check=params.has('devicecheck')?deviceCheck(app,canvas,caps):null;
  if (params.get('mode')) rig.setMode(params.get('mode'));
  let last = performance.now();
  document.addEventListener('visibilitychange',()=>{last=performance.now();app.perf.ema=16;});
  const loop = (now) => {
    const raw = (now - last) / 1000; last = now;
    const dt = clamp(raw, 0.001, 0.1);
    app.resize();
    rig.update(dt);
    app.step(dt);
    app.render(dt);
    app.sound.update(app);
    app.govern(raw * 1000);
    check?.frame(raw*1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
