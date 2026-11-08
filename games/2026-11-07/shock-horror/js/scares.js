// Shock Horror: the scare director. Presentation only: it never touches the simulation, so replays, the autopilot
// ramp checks and the sim's determinism are exactly Gold Digger's. It reads the world (the tile map, the digger,
// the lamp) and stages scares from the catalogue (scaredata.js) around the player: figures at the edge of the
// light, writing on the walls, whispers, bodies, jump scares, and tricks played on the screen itself.
// Pacing: a small scare every ~10-18 s, a big one (jump scare) at most every ~40 s and three per level, unseen scares
// first so the Fear Ledger keeps filling. Some scares are PLACED props (a corpse, a doll, a cage, a photograph)
// that wait in the level and spring when you come close.
import * as THREE from '../vendor/three.module.min.js';
import * as MD from './models.js?v=1';
import { T, SOLID } from './config.js?v=1';
import { SCARES } from './scaredata.js?v=1';
import { Digger, loadDiggerAsset } from './digger.js?v=1';

const CINE = new Set(['hanging', 'cage', 'cocoon', 'doll', 'twitch', 'photo', 'ritual']);
const PLACED = new Set(['write', 'photo', 'hanging', 'twitch', 'cocoon', 'cage', 'doll', 'ritual', 'candles', 'skull', 'helmet', 'prints']);
const V3 = () => new THREE.Vector3();
const tmp = V3(), tmp2 = V3();
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => x * x * (3 - 2 * x);

export class Scares {
  constructor(R, A, hooks) {
    this.R = R; this.A = A; this.hooks = hooks;
    this.group = new THREE.Group(); this.group.name = 'scares'; R.scene.add(this.group);
    this.h = R.horror;               // screen/lamp knobs the renderer reads every frame
    this.active = []; this.placed = []; this.queue = []; this.log = []; this.count = 0;
    this.protos = new Map();
    this.ray = new THREE.Raycaster();
    this.imgs = {};
    this.miners = [];
    this.enabled = true;
    this.stats = { started: 0, byArch: {} };
    // the extra cold light that lets a figure in the dark be seen (created once with the renderer's fixed rig)
    this.light = R.scareLight;
  }

  async init(q) {
    for (const n of ['f_woman', 'f_miner', 'f_ghoul', 'f_doll', 'f_drowned', 'f_skull', 'f_many', 'f_stitch', 'f_hollow', 'f_burnt', 'p_shift', 'p_family', 'p_shaft']) {
      const im = new Image(); im.decoding = 'async'; im.src = `img/${n}.webp?v=1`; this.imgs[n] = im;
    }
    // two realistic, motion-captured ghosts (the lost miner and your double): the digger's own body, re-dressed
    const want = /noghosts/.test(location.search) ? 0 : q && q.name === 'low' ? 1 : 2;
    for (let i = 0; i < want; i++) {
      try {
        const g = await loadDiggerAsset('assets/digger.glb?v=1');
        const dig = new Digger(g, MD.minerGear());
        dig.root.visible = false; this.group.add(dig.root);
        const mats = [];
        dig.root.traverse((o) => {
          if (!o.isMesh) return;
          o.castShadow = false;
          const m = o.material = o.material.clone();
          m.transparent = true; m.userData.o = m.opacity;
          if (m.color) m.color.multiply(i === 0 ? new THREE.Color(0.62, 0.68, 0.74) : new THREE.Color(0.12, 0.11, 0.12));
          if (m.emissive) { m.emissive.set(i === 0 ? 0x1a2230 : 0x000000); m.emissiveIntensity = 1; }
          mats.push(m);
        });
        if (dig.lampLens && dig.lampLens.material) dig.lampLens.material.emissiveIntensity = 0;
        // glowing eyes on the head bone
        const eyeMat = new THREE.MeshBasicMaterial({ color: i === 0 ? new THREE.Color(2.2, 2.4, 2.6) : new THREE.Color(3.5, 0.15, 0.08), transparent: true });
        mats.push(eyeMat);
        if (dig.head) for (const s of [-1, 1]) {
          const e = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), eyeMat);
          // the avatar's head bone axes: forward is +Z of the body (the body is turned to face +X)
          e.position.set(s * 0.032, 0.085, 0.095); dig.head.add(e);
        }
        this.miners.push({ dig, mats, kind: i === 0 ? 'ghost' : 'double', busy: false });
      } catch (e) { console.warn('ghost miner', e); }
    }
  }

  // ------------------------------------------------------------------ per level
  load(W, o = {}) {
    this.clear();
    this.W = W; this.M = W.M; this.o = o;
    this.enabled = !o.off;
    this.depth = W.endless ? W.biome : W.depth;
    this.t = 0; this.cool = o.firstDelay ?? 7; this.bigCool = 30; this.bigs = 0; this.levelCount = 0;
    if (!this.enabled) return;
    const seen = o.seen || new Set();
    // in a guardian's lair only voices and sounds: the fight needs your eyes
    const ok = (s) => (s.d < 0 || s.d === this.depth) && !(o.mild && (s.big || s.a === 'fakedeath' || s.a === 'glitch' && s.p.img)) && !(W.isBoss && s.cat !== 'voice' && s.cat !== 'sound');
    const pool = SCARES.filter(ok);
    const unseen = pool.filter((s) => !seen.has(s.id)), old = pool.filter((s) => seen.has(s.id));
    shuffle(unseen); shuffle(old);
    // the depth's own scares come first among the unseen
    unseen.sort((a, b) => (b.d === this.depth) - (a.d === this.depth));
    this.queue = [...unseen, ...old];
    if (!W.isBoss) this.placeProps(W);
    this.prewarm();
  }
  // the title screen: the start of the Night Shift, dressed (writing, a hanged man, candles), nothing springs
  loadTitle(W) {
    this.clear();
    if (/notitleprops/.test(location.search)) return;
    this.W = W; this.M = W.M; this.o = { quiet: true, title: true }; this.enabled = true; this.t = 0; this.cool = 1e9; this.bigCool = 1e9;
    const P = W.players[0], by = (id) => SCARES.find((x) => x.id === id);
    const spots = [];
    for (let d = 2; d <= 10; d++) for (const k of [0, 1, -1, 2, -2]) { const tx = Math.floor(P.x + d), ty = Math.round(P.y) + k; if (this.standable(tx, ty)) { spots.push({ x: tx + 0.5, y: ty }); break; } }
    const only = new URLSearchParams(location.search).get('tp');
    const put = (id, i, go) => { if (only && !id.startsWith(only)) return; const sp = spots[i]; if (!sp) return; const inst = this.prop(by(id), sp.x, sp.y); if (!inst) return; if (go) { inst.st = 'go'; inst.t = 0; inst.credit = undefined; } this.placed.push(inst); };
    put('write:turn-back', 2, true);
    put('hanging:one', 5, false);
    put('candles:row', 1, false);
    put('twitch:arm', 7, false);
  }
  clear() {
    for (const a of this.active) this.endInst(a);
    for (const p of this.placed) this.endInst(p);
    this.active = []; this.placed = [];
    for (const c of [...this.group.children]) if (!this.miners.some((m) => m.dig.root === c)) { this.group.remove(c); }
    for (const m of this.miners) { m.busy = false; m.dig.root.visible = false; }
    Object.assign(this.h, { lampMul: 1, lampCol: null, fear: 0, glitch: 0, invert: 0, warp: 0, fov: 0, desat: 0, bleed: 0, breathe: 0, dark: 0, red: 0 });
    if (this.light) this.light.intensity = 0;
    this.hooks.subtitle && this.hooks.subtitle('');
    const j = document.getElementById('jump'); if (j) j.className = 'hidden';
  }
  // compile every figure's shaders now, so a scare never stalls the frame it appears in
  prewarm() {
    const R = this.R, g = new THREE.Group();
    for (const n of ['paleWoman', 'tallMan', 'ghostChild', 'shadowFigure', 'ghoulCrawler', 'hangedMan', 'corpse', 'screamFace', 'hand', 'arm', 'eyes', 'skull', 'cocoon', 'cageHanging', 'candles', 'doll', 'spider', 'rat', 'wallFace', 'bodyBag', 'ritualCircle', 'minerHelmet', 'lantern', 'cart']) {
      const f = this.make(n); if (!f) continue; f.o.position.set(this.W.players[0].x, this.W.players[0].y + 1, 0); f.o.scale.setScalar(0.001); g.add(f.o);
    }
    for (const m of this.miners) { m.dig.root.visible = true; m.dig.root.position.set(this.W.players[0].x, -50, 0); }
    // the decals (writing, hands, photographs), a photo frame and a spider's thread use their own materials
    {
      const P = this.W.players[0], tex = writingTex('NOT YET', 'blood');
      const dm = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color(0.5, 0.3, 0.3), transparent: true, opacity: 0.01, roughness: 0.3, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, alphaTest: 0.01 });
      const fm = new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.8 });
      const lm = new THREE.MeshBasicMaterial({ color: 0x9a9a90, transparent: true, opacity: 0.5 });
      for (const m of [dm, fm, lm]) { const q = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), m); q.position.set(P.x, P.y + 1, 0); g.add(q); }
    }
    this.group.add(g);
    try { R.r.compile(R.scene, R.camera); } catch (e) { /* older three */ }
    this.group.remove(g);
    for (const m of this.miners) m.dig.root.visible = false;
  }

  // ------------------------------------------------------------------ models
  make(name, ...a) {
    const fn = MD[name];
    if (typeof fn !== 'function') return null;
    let r; try { r = fn(...a); } catch (e) { console.warn('scare model', name, e); return null; }
    const o = r && r.group ? r.group : r;
    if (!o) return null;
    // own materials, so this one can fade without fading every other copy
    const own = new Map(), mats = [];
    o.traverse((x) => {
      if (!x.isMesh && !x.isPoints) return;
      x.castShadow = false; x.frustumCulled = false;
      const list = Array.isArray(x.material) ? x.material : [x.material];
      const nl = list.map((m) => { if (!own.has(m)) { const c = m.clone(); c.userData.o = m.opacity ?? 1; c.transparent = true; own.set(m, c); mats.push(c); } return own.get(m); });
      x.material = Array.isArray(x.material) ? nl : nl[0];
    });
    return { o, r: r && r.group ? r : { group: o }, mats };
  }
  fig(name, x, y, z = 0, yaw = -Math.PI / 2, s = 1, ...a) {
    if (name === 'MINER') return this.minerFig(x, y, z, yaw);
    const f = this.make(name, ...a);
    if (!f) return null;
    f.o.position.set(x, y, z); f.o.rotation.y = yaw; f.o.scale.multiplyScalar(s);
    this.group.add(f.o);
    f.alpha = (k) => { for (const m of f.mats) { m.opacity = (m.userData.o ?? 1) * k; m.depthWrite = k > 0.98; } f.o.visible = k > 0.003; };
    f.alpha(0);
    f.kill = () => { this.group.remove(f.o); };
    return f;
  }
  minerFig(x, y, z, yaw, kind = 'ghost') {
    const m = this.miners.find((q) => q.kind === kind && !q.busy) || this.miners.find((q) => !q.busy);
    if (!m) return this.fig('shadowFigure', x, y, z, yaw);
    m.busy = true;
    const f = { o: m.dig.root, mats: m.mats, miner: m, S: { x, y, z, face: Math.cos(yaw) >= 0 ? 1 : -1, vx: 0, vy: 0, ground: true, pickF: -1, throwF: -1, aim: 0, yaw } };
    m.dig.root.visible = true;
    f.alpha = (k) => { for (const q of m.mats) { q.opacity = (q.userData.o ?? 1) * k; q.depthWrite = k > 0.98; } m.dig.root.visible = k > 0.003; };
    f.alpha(0);
    f.drive = (dt) => m.dig.update(dt, f.S);
    f.kill = () => { m.busy = false; m.dig.root.visible = false; };
    return f;
  }

  // ------------------------------------------------------------------ the map
  tile(x, y) { const M = this.M; x = Math.floor(x); y = Math.floor(y); return (x < 0 || y < 0 || x >= M.w || y >= M.h) ? T.ROCK : M.tiles[y * M.w + x]; }
  solid(x, y) { return SOLID[this.tile(x, y)] === 1; }
  standable(tx, ty) {
    const t = this.tile(tx, ty), b = this.tile(tx, ty - 1);
    if (SOLID[t] || SOLID[this.tile(tx, ty + 1)] || t === T.WATER || t === T.LAVA || t === T.SPIKES) return false;
    return SOLID[b] === 1 || b === T.PLANK;
  }
  view() {
    const R = this.R, d = R.cam.d, hh = Math.tan(THREE.MathUtils.degToRad(R.camera.fov / 2)) * d, hw = hh * R.camera.aspect;
    return { x0: R.cam.x - hw + 0.6, x1: R.cam.x + hw - 0.6, y0: R.cam.y + 1.6 - hh + 0.4, y1: R.cam.y + 1.6 + hh - 0.6 };
  }
  onScreen(x, y, m = 0) { const v = this.view(); return x > v.x0 + m && x < v.x1 - m && y > v.y0 + m && y < v.y1 - m; }
  floorNear(P, dmin, dmax, dir, dy = 2, screen = true) {
    for (let d = dmin; d <= dmax; d += 0.5) {
      const x = P.x + dir * d, tx = Math.floor(x);
      for (const k of [0, 1, -1, 2, -2, 3, -3]) {
        if (Math.abs(k) > dy) continue;
        const ty = Math.round(P.y) + k;
        if (!this.standable(tx, ty)) continue;
        if (screen && !this.onScreen(tx + 0.5, ty + 1)) continue;
        return { x: tx + 0.5, y: ty };
      }
    }
    return null;
  }
  ceilAbove(x, y, max = 9) { for (let k = 1; k <= max; k++) if (this.solid(x, y + k)) return Math.floor(y + k); return null; }
  // the back wall behind a point (the cave mesh): position + normal
  wallAt(x, y) {
    const cave = this.R.cave; if (!cave) return null;
    this.ray.set(tmp.set(x, y, 3), tmp2.set(0, 0, -1)); this.ray.far = 30;
    const hit = this.ray.intersectObject(cave.group, true)[0];
    if (!hit) return null;
    const n = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 0, 1);
    if (n.z < 0.25) return null;    // a side wall or a ledge: no good surface to show something on
    return { p: hit.point.clone(), n };
  }
  waterNear(P, r = 7) {
    for (let d = 0; d <= r; d++) for (const s of [1, -1]) {
      const tx = Math.floor(P.x + s * d);
      for (let ty = Math.round(P.y) + 1; ty > Math.round(P.y) - 5; ty--) if (this.tile(tx, ty) === T.WATER && this.tile(tx, ty + 1) !== T.WATER) { if (this.onScreen(tx + 0.5, ty)) return { x: tx + 0.5, y: ty + 0.9 }; }
    }
    return null;
  }
  lit(x, y) {   // is a point inside the helmet lamp's cone?
    const L = this.R.lamp; if (L.intensity < 5) return false;
    tmp.set(x, y, 0).sub(L.position); const d = tmp.length(); if (d > 10) return false;
    tmp2.copy(L.target.position).sub(L.position).normalize();
    return tmp.normalize().dot(tmp2) > Math.cos(L.angle * 0.9);
  }

  // ------------------------------------------------------------------ helpers for effects
  snd(name, x, y, vol = 1, o = {}) { if (!this.A.ctx || this.o.quiet) return; this.A.play(name, { x, y, z: o.z ?? 0, vol: vol * (this.o.mild ? 0.6 : 1), vary: o.vary ?? 0.04, rate: o.rate, gap: 0.05, bus: o.bus }); }
  sting(name, vol = 1) { if (!this.A.ctx || this.o.quiet) return; this.A.play(name, { vol: vol * (this.o.mild ? 0.45 : 1), vary: 0, noSlow: true, gap: 0.1 }); }
  coldLight(x, y, z, i = 6, col = 0x9fb4ff) { if (!this.light) return; this.light.position.set(x, y, z); this.light.color.set(col); this.lightT = i; }
  fear(k) { this.h.fear = Math.max(this.h.fear, k * (this.o.calm ? 0.5 : 1)); }
  // the jump-scare camera: a sudden zoom toward the thing (narrower field of view), easing back out
  punch(k = 1) { if (this.o.calm) k *= 0.5; this.h.fov = Math.min(this.h.fov, -13 * k); }
  shake(k) { this.R.shake(k); }
  P() { return this.W.players[0]; }

  // ------------------------------------------------------------------ placed scares (props that wait for you)
  placeProps(W) {
    const M = W.M, list = this.queue.filter((s) => PLACED.has(s.a));
    const want = Math.min(list.length, 7 + Math.floor(M.w * M.h / 900));
    const used = [];
    let n = 0;
    for (const s of list) {
      if (n >= want) break;
      for (let tries = 0; tries < 60; tries++) {
        // a random standable cell, not near the start, not on top of another prop
        const tx = 2 + Math.floor(Math.random() * (M.w - 4)), ty = 2 + Math.floor(Math.random() * (M.h - 4));
        if (!this.standable(tx, ty)) continue;
        if (Math.abs(tx - M.start.x) < 9 && Math.abs(ty - M.start.y) < 6) continue;
        if (used.some((u) => Math.abs(u[0] - tx) < 9 && Math.abs(u[1] - ty) < 5)) continue;
        const inst = this.prop(s, tx + 0.5, ty);
        if (!inst) continue;
        used.push([tx, ty]); this.placed.push(inst); n++;
        this.queue.splice(this.queue.indexOf(s), 1); this.queue.push(s);
        break;
      }
    }
  }
  prop(s, x, y) {
    const A = AR[s.a]; if (!A || !A.place) return null;
    const inst = { s, t: 0, st: 'wait', x, y, objs: [], done: false };
    try { if (A.place(this, inst, s.p) === false) { this.endInst(inst); return null; } } catch (e) { console.warn('prop', s.id, e); this.endInst(inst); return null; }
    return inst;
  }

  // ------------------------------------------------------------------ the director
  update(W, dt, live = true) {
    if (!this.enabled || !this.W || W !== this.W) return;
    this.t += dt;
    const P = W.players[0], h = this.h;
    // knobs relax back to normal
    h.fear = Math.max(0, h.fear - dt * 0.6); h.glitch = Math.max(0, h.glitch - dt * 4); h.invert = Math.max(0, h.invert - dt * 3);
    h.warp = Math.max(0, h.warp - dt * 0.8); h.desat = Math.max(0, h.desat - dt * 0.5); h.red = Math.max(0, h.red - dt * 0.7);
    h.bleed = Math.max(0, h.bleed - dt * 0.35); h.lampMul += (1 - h.lampMul) * Math.min(1, dt * 3); h.fov *= Math.exp(-dt * 2); h.breathe = Math.max(0, h.breathe - dt * 0.2);
    if (this.light) { this.lightT = Math.max(0, (this.lightT || 0) - dt * 4); this.light.intensity += (this.lightT - this.light.intensity) * Math.min(1, dt * 6); }
    // running scares
    for (const a of this.active) this.tickInst(a, dt);
    for (const p of this.placed) this.tickInst(p, dt);
    this.active = this.active.filter((a) => !a.done);
    if (W.clear || P.inCage || !live) return;
    // placed props spring when you are close and they are on screen
    for (const p of this.placed) {
      if (p.st !== 'wait' || p.done) continue;
      const dx = p.x - P.x, dy = p.y - P.y;
      const r = p.r || 4.5;
      if (Math.abs(dx) < r && Math.abs(dy) < 3 && this.onScreen(p.x, p.y + 1)) {
        if (this.active.some((a) => a.s.big)) continue;
        p.st = 'go'; p.t = 0; this.started(p);
        // the bigger props pull the camera in a little, so you see what you walked into
        if (CINE.has(p.s.a) && !this.R.cam.cine && !this.o.title) this.R.cinematic(p.x, p.y + 1.3, 10.5, 2.4);
      }
    }
    // timed scares
    this.cool -= dt * (P.oil <= 0 ? 1.8 : P.oil < P.oilMax * 0.25 ? 1.35 : 1);
    this.bigCool -= dt;
    if (this.cool > 0 || P.dead || this.active.some((a) => !a.s.minor)) return;
    this.tryStart(null);
  }
  tryStart(trig) {
    const P = this.P();
    const bigOk = this.bigCool <= 0 && this.bigs < (this.o.mild ? 0 : 3) && !this.o.demoQuiet;
    let tries = 0;
    for (let i = 0; i < this.queue.length && tries < 18; i++) {
      const s = this.queue[i];
      if (PLACED.has(s.a)) continue;
      if (s.big && !bigOk) continue;
      if (!s.big && trig === 'treasure') continue;
      if (s.p.trig && s.p.trig !== trig) continue;
      if (!s.p.trig && trig) continue;
      if (!s.big && Math.random() < 0.15 && bigOk && !trig) continue;   // now and then hold out for something bigger
      tries++;
      const A = AR[s.a]; if (!A) continue;
      const inst = { s, t: 0, st: 'go', objs: [], done: false };
      let ok = false;
      try { ok = A.start(this, inst, s.p, P) !== false; } catch (e) { console.warn('scare', s.id, e); ok = false; }
      if (!ok) { this.endInst(inst); continue; }
      this.queue.splice(i, 1); this.queue.push(s);
      this.active.push(inst); this.started(inst);
      if (s.big) { this.bigs++; this.bigCool = rand(38, 55); this.cool = rand(12, 16); }
      else this.cool = rand(9, 17);
      return true;
    }
    this.cool = 2.5;
    return false;
  }
  started(inst) {
    this.count++; this.levelCount++;
    this.stats.started++; this.stats.byArch[inst.s.a] = (this.stats.byArch[inst.s.a] || 0) + 1;
    this.log.push({ id: inst.s.id, t: Math.round(this.t * 10) / 10 }); if (this.log.length > 60) this.log.shift();
    // it counts once it has had time to land
    inst.credit = inst.s.big ? 0.4 : 1.2;
  }
  tickInst(inst, dt) {
    if (inst.done) return;
    inst.t += dt;
    if (inst.credit !== undefined && inst.st !== 'wait') { inst.credit -= dt; if (inst.credit <= 0) { inst.credit = undefined; this.hooks.seen && this.hooks.seen(inst.s); } }
    const A = AR[inst.s.a];
    let done = false;
    try { done = inst.st === 'wait' ? (A.idle ? A.idle(this, inst, inst.s.p, dt) : false) : A.tick(this, inst, inst.s.p, dt, this.P()); } catch (e) { console.warn('scare tick', inst.s.id, e); done = true; }
    if (done) { inst.done = true; this.endInst(inst); }
  }
  endInst(inst) {
    for (const o of inst.objs || []) if (o && o.kill) o.kill(); else if (o && o.parent) o.parent.remove(o);
    inst.objs = [];
    if (inst.end) inst.end();
  }
  // tests: stage one scare now, by id ('ok' or why not)
  force(id) {
    const s = SCARES.find((x) => x.id === id); if (!s) return 'missing';
    const A = AR[s.a], P = this.P();
    if (PLACED.has(s.a)) {
      const sp = this.floorNear(P, 2, 4, P.face, 2, false); if (!sp) return 'nospot';
      const pi = this.prop(s, sp.x, sp.y); if (!pi) return 'noplace';
      pi.st = 'go'; pi.t = 0; this.placed.push(pi); this.started(pi); return 'ok';
    }
    const inst = { s, t: 0, st: 'go', objs: [], done: false };
    let ok; try { ok = A.start(this, inst, s.p, P) !== false; } catch (e) { this.endInst(inst); return 'error ' + e.message; }
    if (!ok) { this.endInst(inst); return 'nostage'; }
    this.active.push(inst); this.started(inst); return 'ok';
  }
  // sim events can trigger scares (the director picks one that fits)
  event(e, W) {
    if (!this.enabled || W !== this.W) return;
    // greed is punished: a relic or a cache (and now and then a coffin) can wake something, but never twice in a row
    const greed = e.k === 'find' && (e.kind === 'relic' || e.kind === 'cache') || e.k === 'chest' && Math.random() < 0.35;
    if (greed && !this.o.mild && this.bigs < 3 && this.bigCool < 18) { this.bigCool = 0; setTimeout(() => { if (this.W === W && !this.active.some((a) => a.s.big)) this.tryStart('treasure'); }, 1400); }
    if (e.k === 'lowoil') this.cool = Math.min(this.cool, 2);
    if (e.k === 'secret') this.cool = Math.min(this.cool, 1.5);
  }
}

function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ------------------------------------------------------------------ canvas textures (writing, hands, photographs)
const texCache = new Map();
function writingTex(text, style) {
  const key = style + '|' + text; if (texCache.has(key)) return texCache.get(key);
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 320;
  const c = cv.getContext('2d');
  const font = style === 'scratch' ? '"Special Elite", "Courier New", monospace' : '"Creepster", "Nosifer", Impact, serif';
  let size = 150; c.font = `${size}px ${font}`;
  while (c.measureText(text).width > 960 && size > 40) { size -= 6; c.font = `${size}px ${font}`; }
  c.textAlign = 'center'; c.textBaseline = 'middle';
  const w = c.measureText(text).width, x0 = 512 - w / 2, yb = 150 + size * 0.32;
  if (style === 'scratch') {
    c.strokeStyle = 'rgba(225,215,200,0.9)'; c.lineWidth = 3;
    for (let k = 0; k < 3; k++) { c.save(); c.translate((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4); c.strokeText(text, 512, 150); c.restore(); }
    c.globalAlpha = 0.5; c.fillStyle = 'rgba(40,30,25,1)'; c.fillText(text, 514, 153);
  } else {
    const col = style === 'soot' ? [18, 14, 12] : [118, 6, 4];
    c.fillStyle = `rgb(${col})`; c.shadowColor = `rgba(${col},0.6)`; c.shadowBlur = 8; c.fillText(text, 512, 150);
    c.shadowBlur = 0;
    // drips run down from the letters
    if (style !== 'soot') for (let k = 0; k < Math.max(6, text.length * 1.4); k++) {
      const x = x0 + Math.random() * w, len = 20 + Math.random() * 120, y = yb - 10 + Math.random() * 10, lw = 2 + Math.random() * 6;
      const g = c.createLinearGradient(0, y, 0, y + len); g.addColorStop(0, `rgba(${col},0.95)`); g.addColorStop(1, `rgba(${col},0.6)`);
      c.strokeStyle = g; c.lineWidth = lw; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (Math.random() - 0.5) * 3, y + len); c.stroke();
      c.fillStyle = `rgba(${col},0.95)`; c.beginPath(); c.ellipse(x, y + len, lw * 0.9, lw * 1.3, 0, 0, 7); c.fill();
    }
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  texCache.set(key, t); return t;
}
function handTex(small) {
  const key = 'hand' + (small ? 's' : ''); if (texCache.has(key)) return texCache.get(key);
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const c = cv.getContext('2d');
  c.fillStyle = 'rgb(112,6,4)'; c.translate(128, 150); const k = small ? 0.75 : 1;
  c.beginPath(); c.ellipse(0, 20, 48 * k, 58 * k, 0, 0, 7); c.fill();
  const fing = [[-46, -40, 0.5, 46], [-20, -78, 0.15, 62], [6, -86, 0, 68], [30, -76, -0.15, 60], [56, -20, -0.7, 44]];
  for (const [fx, fy, a, l] of fing) { c.save(); c.translate(fx * k, fy * k + 20); c.rotate(a); c.beginPath(); c.ellipse(0, 0, 11 * k, l * 0.5 * k, 0, 0, 7); c.fill(); c.restore(); }
  for (let i = 0; i < 4; i++) { c.fillRect(-30 + Math.random() * 60, 60 * k, 3 + Math.random() * 4, 30 + Math.random() * 60); }
  c.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 260; i++) { c.globalAlpha = Math.random() * 0.5; c.beginPath(); c.arc((Math.random() - 0.5) * 200, (Math.random() - 0.6) * 220, Math.random() * 5, 0, 7); c.fill(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; texCache.set(key, t); return t;
}
function photoCanvas(img, ghost) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = Math.round(512 * ((img.naturalHeight || 3) / (img.naturalWidth || 4)));
  const c = cv.getContext('2d');
  try { c.drawImage(img, 0, 0, cv.width, cv.height); } catch { c.fillStyle = '#3a3026'; c.fillRect(0, 0, cv.width, cv.height); }
  if (ghost) {
    // one more figure in the picture: pale, too tall, standing right at the front
    c.globalAlpha = 0.75; c.fillStyle = 'rgba(235,228,214,0.85)';
    const x = cv.width * 0.62, y = cv.height * 0.28, s = cv.height * 0.7;
    c.beginPath(); c.ellipse(x, y, s * 0.06, s * 0.08, 0, 0, 7); c.fill();
    c.fillRect(x - s * 0.07, y + s * 0.07, s * 0.14, s * 0.6);
    c.fillStyle = 'rgba(0,0,0,0.9)'; c.beginPath(); c.arc(x - s * 0.02, y - s * 0.01, s * 0.012, 0, 7); c.arc(x + s * 0.024, y - s * 0.01, s * 0.012, 0, 7); c.fill();
    c.globalAlpha = 1; c.fillStyle = 'rgba(120,10,6,0.35)'; c.fillRect(0, 0, cv.width, cv.height);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// a decal on the back wall: writing, a handprint, a photograph
function wallDecal(D, x, y, w, h, map, o = {}) {
  const hit = D.wallAt(x, y); if (!hit) return null;
  // a faint glow of its own, so it reads in the dark; the lamp makes it shine wet
  const mat = new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: new THREE.Color(o.glow ?? 0.5, (o.glow ?? 0.5) * 0.55, (o.glow ?? 0.5) * 0.5), emissiveIntensity: 1, transparent: true, opacity: 0, roughness: o.rough ?? 0.35, metalness: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, alphaTest: 0.01 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.copy(hit.p).addScaledVector(hit.n, 0.12);
  m.lookAt(tmp.copy(m.position).add(hit.n)); m.rotation.z += o.rz || 0;
  m.renderOrder = 2; D.group.add(m);
  return m;
}

// ------------------------------------------------------------------ the archetypes
// start(D, inst, p, P) -> false if it cannot be staged here; tick(...) -> true when finished.
// place(D, inst, p) stages a waiting prop at inst.x/inst.y; idle() animates it while it waits.
const AR = {};
const figFade = (f, k) => f && f.alpha(clamp01(k));
function addObj(inst, o) { if (o) inst.objs.push(o); return o; }

// ---- apparitions
AR.stand = {
  start(D, I, p, P) {
    let s = null, z = 0, y = 0;
    const dir = p.where === 'behind' ? -P.face : P.face;
    if (p.where === 'ahead' || p.where === 'behind') s = D.floorNear(P, 5.5, 9, dir);
    else if (p.where === 'above') { for (let k = 3; k <= 7 && !s; k++) for (const d of [3, 5, 7, -4]) { const tx = Math.floor(P.x + d * P.face), ty = Math.round(P.y) + k; if (D.standable(tx, ty) && D.onScreen(tx + 0.5, ty + 1)) { s = { x: tx + 0.5, y: ty }; break; } } }
    else if (p.where === 'across') { s = D.floorNear(P, 6, 10, P.face, 3); if (s) { let gap = false; for (let x = P.x + P.face; Math.abs(x - s.x) > 1; x += P.face) if (!D.standable(Math.floor(x), Math.round(s.y)) && !D.standable(Math.floor(x), Math.round(s.y) - 1)) gap = true; if (!gap) s = null; } }
    else if (p.where === 'rock') { const hit = D.wallAt(P.x + P.face * 4, P.y + 1); if (hit && hit.p.z < -2.4) { s = { x: hit.p.x, y: P.y }; z = hit.p.z + 0.3; } }
    else if (p.where === 'hang') { const c = D.ceilAbove(P.x + P.face * 5, P.y, 8); if (c && D.onScreen(P.x + P.face * 5, c - 1)) { s = { x: Math.floor(P.x + P.face * 5) + 0.5, y: c }; } }
    if (!s) return false;
    I.x = s.x; I.y = s.y;
    const yaw = s.x > P.x ? Math.PI : 0;
    if (p.where === 'hang') { I.f = addObj(I, D.fig('hangedMan', s.x, s.y, 0, -Math.PI / 2, 1, s.y - P.y - 0.4)); }
    else I.f = addObj(I, D.fig(p.model, s.x, s.y, z, p.where === 'rock' ? -Math.PI / 2 : yaw));
    if (!I.f) return false;
    I.dur = rand(3.5, 5.5);
    D.snd(pick(['wind_moan', 'breath', 'whisper_l']), s.x, s.y + 1, 0.5);
  },
  tick(D, I, p, dt, P) {
    const f = I.f, near = Math.hypot(P.x - I.x, P.y - I.y) < 3.2;
    if (f.drive) { f.S.vx = 0; f.drive(dt); }
    if (!I.gone && (near || I.t > I.dur || (I.t > 1.2 && D.lit(I.x, I.y + 1) && Math.random() < dt * 0.8))) {
      I.gone = I.t; D.snd(pick(['static', 'shadefade', 'st_reverse']), I.x, I.y + 1, near ? 0.8 : 0.5); if (near) { D.fear(0.6); D.h.glitch = 0.5; } else D.fear(0.25);
    }
    if (p.where === 'hang' && f.o) f.o.rotation.z = Math.sin(I.t * 1.3) * 0.06;
    if (f.r && f.r.eyes) f.r.eyes.visible = true;
    if (!I.gone) { figFade(f, I.t / 0.8); D.coldLight(I.x, I.y + 2, 1.2, 3); return false; }
    // vanish: a flicker, then gone
    const g = I.t - I.gone; figFade(f, g < 0.25 ? (Math.sin(g * 90) > 0 ? 1 : 0) : 0);
    return g > 0.3;
  },
};
AR.peek = {
  start(D, I, p, P) {
    // a wall edge ahead: a standable cell next to a solid column
    for (let d = 4; d <= 8; d++) {
      const tx = Math.floor(P.x + P.face * d), ty = Math.round(P.y);
      if (!D.standable(tx, ty) || !D.solid(tx + P.face, ty + 1) || !D.onScreen(tx + 0.5, ty + 1)) continue;
      I.x = tx + 0.5 + P.face * 0.6; I.y = ty; I.dir = P.face;
      I.f = addObj(I, D.fig(p.model, I.x, I.y, -0.4, P.face > 0 ? Math.PI : 0)); if (!I.f) return false;
      D.snd('breath', I.x, I.y + 1, 0.4);
      return;
    }
    return false;
  },
  tick(D, I, p, dt, P) {
    const f = I.f; if (f.drive) { f.S.vx = 0; f.drive(dt); }
    const out = I.t < 0.9 ? ease(I.t / 0.9) : I.t < 2.2 ? 1 : 1 - ease(Math.min(1, (I.t - 2.2) / 0.25));
    f.o.position.x = I.x - I.dir * 0.55 * out; if (f.S) f.S.x = f.o.position.x;
    figFade(f, out * 1.2);
    if (I.t > 2.2 && !I.snap) { I.snap = 1; D.snd('feet_run', I.x, I.y, 0.6); D.fear(0.3); }
    return I.t > 2.6;
  },
};
AR.walker = {
  start(D, I, p, P) {
    const hit = D.wallAt(P.x, P.y + 1); if (!hit) return false;
    const v = D.view();
    I.z = Math.max(-5, hit.p.z + 0.6); I.y = P.y;
    I.dir = Math.random() < 0.5 ? 1 : -1; I.x = I.dir > 0 ? v.x0 - 1 : v.x1 + 1; I.x1 = I.dir > 0 ? v.x1 + 2 : v.x0 - 2;
    const n = p.n || 1; I.fs = [];
    for (let k = 0; k < n; k++) { const f = addObj(I, D.fig(p.model, I.x - I.dir * k * 1.6, I.y, I.z - k * 0.2, I.dir > 0 ? 0 : Math.PI)); if (f) I.fs.push(f); }
    if (!I.fs.length) return false;
    if (p.model === 'ghoulCrawler') I.fs.forEach((f) => { f.o.position.y += 0; });
    D.snd(p.model === 'ghoulCrawler' ? 'skitter' : p.speed > 3 ? 'feet_run' : 'drag', P.x, P.y + 1, 0.6);
  },
  tick(D, I, p, dt) {
    const sp = p.speed || 1.2;
    let alive = false;
    I.fs.forEach((f, k) => {
      f.o.position.x += I.dir * sp * dt;
      if (p.float) f.o.position.y = I.y + 0.25 + Math.sin(I.t * 1.7 + k) * 0.08;
      if (f.S) { f.S.x = f.o.position.x; f.S.y = I.y; f.S.z = I.z; f.S.vx = I.dir * sp; f.S.face = I.dir; f.S.yaw = null; f.drive(dt); }
      if (f.r && f.r.limbs) f.r.limbs.forEach((l, i) => { if (l) l.rotation.z = Math.sin(I.t * sp * 5 + i * 1.6) * 0.5; });
      if (f.r && f.r.legL) { f.r.legL.rotation.z = Math.sin(I.t * sp * 3) * 0.5; f.r.legR.rotation.z = -Math.sin(I.t * sp * 3) * 0.5; }
      const into = Math.min(1, I.t / 0.6), x = f.o.position.x;
      figFade(f, into * 0.9);
      if ((I.dir > 0 ? x < I.x1 : x > I.x1)) alive = true;
    });
    D.coldLight(I.fs[0].o.position.x, I.y + 2, I.z + 1.2, 3.5);
    return !alive || I.t > 30;
  },
};
AR.closer = {
  start(D, I, p, P) {
    const s = D.floorNear(P, 7.5, 9.5, P.face); if (!s) return false;
    I.x0 = s.x; I.y = s.y; I.dir = P.face; I.step = 0; I.f = addObj(I, D.fig(p.model, s.x, s.y, 0, P.face > 0 ? Math.PI : 0)); if (!I.f) return false;
  },
  tick(D, I, p, dt, P) {
    const f = I.f; if (f.drive) { f.S.vx = 0; f.drive(dt); }
    // the lamp blinks; every time it comes back the figure is closer
    const phase = I.t % 1.3, k = Math.floor(I.t / 1.3);
    D.h.lampMul = phase < 0.22 ? 0.03 : 1;
    if (phase < 0.03 && k !== I.step) { I.step = k; D.snd('lamp_die', P.x, P.y + 1.6, 0.6); }
    const d = Math.max(1.2, 8.5 - k * 2.4);
    const x = P.x + I.dir * d; f.o.position.x = x; if (f.S) f.S.x = x;
    figFade(f, phase < 0.22 ? 0 : 1);
    D.coldLight(x, I.y + 2, 1, 4);
    if (k >= 3) { D.h.lampMul = 1; if (!I.hit) { I.hit = 1; D.punch(0.7); D.sting(pick(['st_violin', 'st_metal']), 0.9); D.fear(1); D.shake(0.5); } figFade(f, 0); return true; }
    return false;
  },
  end: null,
};
AR.behind = {
  start(D, I, p, P) {
    if (Math.abs(P.vx) > 0.8) return false;   // only when you stand still
    const s = D.floorNear(P, 1.6, 3.2, -P.face, 1); if (!s) return false;
    I.x = s.x; I.y = s.y; I.face0 = P.face;
    I.f = addObj(I, D.fig(p.model, s.x, s.y, -0.2, P.face > 0 ? 0 : Math.PI)); if (!I.f) return false;
    D.snd('breath', s.x, s.y + 1.4, 0.8);
  },
  tick(D, I, p, dt, P) {
    const f = I.f; if (f.drive) { f.S.vx = 0; f.drive(dt); }
    if (!I.gone) {
      figFade(f, I.t / 1.4);
      D.coldLight(I.x, I.y + 2, 1.4, 2.5);
      if (P.face !== I.face0 || I.t > 6 || Math.abs(P.x - I.x) > 6) { I.gone = I.t; figFade(f, 0); if (P.face !== I.face0) { D.snd('st_reverse', I.x, I.y + 1, 0.7); D.fear(0.5); } }
      return false;
    }
    return I.t - I.gone > 0.2;
  },
};
AR.ledge = {
  start(D, I, p, P) {
    for (let k = 4; k <= 8; k++) for (const d of [2, 4, 6, -3, 8]) {
      const tx = Math.floor(P.x + d * P.face), ty = Math.round(P.y) + k;
      if (!D.standable(tx, ty) || !D.onScreen(tx + 0.5, ty + 1.5)) continue;
      I.x = tx + 0.5; I.y = ty; I.f = addObj(I, D.fig(p.model, I.x, I.y, -0.3, -Math.PI / 2)); if (!I.f) return false;
      return;
    }
    return false;
  },
  tick(D, I, p, dt) {
    const f = I.f; if (f.drive) { f.S.vx = 0; f.drive(dt); }
    figFade(f, I.t < 1 ? I.t : I.t < 3 ? 1 : 1 - (I.t - 3) / 0.6);
    if (p.wave && f.r && f.r.armR) f.r.armR.rotation.z = 2.4 + Math.sin(I.t * 6) * 0.4;
    if (I.t > 3) f.o.position.z = -0.3 - (I.t - 3) * 2;
    D.coldLight(I.x, I.y + 2, 1, 3);
    if (I.t > 3 && !I.s) { I.s = 1; D.snd('feet_behind', I.x, I.y, 0.5); }
    return I.t > 3.6;
  },
};
AR.water = {
  start(D, I, p, P) {
    const w = D.waterNear(P, 7); if (!w) return false;
    I.x = w.x; I.y = w.y;
    if (p.model === 'screamFace') { I.f = addObj(I, D.fig('screamFace', w.x, w.y - 0.5, 0.3, 0, 0.9, 0)); if (I.f) I.f.o.rotation.x = -1.2; }
    else if (p.model === 'corpse') { I.f = addObj(I, D.fig('corpse', w.x - 0.9, w.y - 0.6, 0.2, 0)); }
    else I.f = addObj(I, D.fig(p.model, w.x, w.y - 1.8, 0.2, -Math.PI / 2));
    if (!I.f) return false;
    D.snd('gasp', w.x, w.y, 0.6);
  },
  tick(D, I, p, dt, P) {
    const f = I.f, k = I.t < 2 ? ease(I.t / 2) : I.t < 4 ? 1 : 1 - ease((I.t - 4) / 1.5);
    if (p.model === 'paleWoman') f.o.position.y = I.y - 1.8 + k * 1.5;
    else f.o.position.y = I.y - 0.6 + k * 0.45;
    figFade(f, k);
    if (I.t > 2 && !I.s) { I.s = 1; D.snd(p.model === 'screamFace' ? 'st_reverse' : 'water_hand', I.x, I.y, 0.8); D.fear(0.4); }
    if (Math.random() < dt * 6) D.R.fx.bubbles(I.x + rand(-0.5, 0.5), I.y, 0.3, 1);
    D.coldLight(I.x, I.y + 1, 1, 2.5, 0x7fd0c0);
    return I.t > 5.5;
  },
};
AR.doppel = {
  start(D, I, p, P) {
    const m = D.miners.find((q) => q.kind === 'double' && !q.busy); if (!m) return false;
    const s = D.floorNear(P, 5, 8, P.face, 0); if (!s) return false;
    I.f = addObj(I, D.minerFig(s.x, s.y, 0, P.face > 0 ? Math.PI : 0, 'double'));
    I.x = s.x; I.y = s.y; I.px0 = P.x;
    D.snd('whisper_r', s.x, s.y + 1, 0.4);
  },
  tick(D, I, p, dt, P) {
    const f = I.f, S = f.S; S.yaw = null;
    figFade(f, Math.min(1, I.t / 1.2) * (I.gone ? 0 : 1));
    if (p.mode === 'mirror') { S.vx = -P.vx; S.x = I.x - (P.x - I.px0); S.face = -P.face; S.ground = P.ground; S.vy = P.vy; S.y = I.y + Math.max(0, P.y - Math.round(P.y)); }
    else { S.vx = 0; S.face = P.x > S.x ? 1 : -1; }
    if (p.mode === 'turn' && I.t > 2.4 && !I.turned) { I.turned = 1; D.punch(1); D.sting('st_violin', 1); D.fear(1); D.shake(0.6); D.h.glitch = 1; }
    f.drive(dt);
    if (p.mode === 'turn' && I.turned && f.miner.dig.head) f.miner.dig.head.rotation.y += Math.PI;   // the head comes all the way round
    D.coldLight(S.x, I.y + 2, 1.2, 3, 0xff5040);
    if (!I.gone && (Math.abs(P.x - S.x) < 1.6 || I.t > (p.mode === 'turn' ? 3.1 : 7))) { I.gone = 1; D.snd('static', S.x, I.y + 1, 0.7); D.h.glitch = 0.6; }
    return I.gone && I.t > 0.5;
  },
};

// ---- jump scares
AR.face = {
  start(D, I, p, P) {
    const im = D.imgs[p.img]; if (!im || !im.complete || !im.naturalWidth) return false;
    I.dur = D.o.calm ? 0.4 : 0.62;
    D.h.lampMul = 0.02; I.pre = rand(0.35, 0.7);
    D.snd('lamp_die', P.x, P.y + 1.6, 0.7);
  },
  tick(D, I, p, dt, P) {
    if (I.t < I.pre) { D.h.lampMul = 0.02; return false; }
    if (!I.shown) {
      I.shown = 1;
      const j = document.getElementById('jump'), img = j && j.querySelector('img');
      if (img) { img.src = D.imgs[p.img].src; j.className = D.o.calm ? 'calm' : 'on'; j.style.setProperty('--dx', (Math.random() - 0.5) * 4 + '%'); }
      D.sting(p.sting, 1); D.snd(p.scream, P.x, P.y + 1.5, 0.9, { z: 6 }); D.fear(1); D.shake(0.9); D.h.glitch = 1;
      D.hooks.rumble && D.hooks.rumble(1, 1, 450);
    }
    if (I.t > I.pre + I.dur) { const j = document.getElementById('jump'); if (j) j.className = 'hidden'; D.h.lampMul = Math.min(1, (I.t - I.pre - I.dur) * 2); }
    return I.t > I.pre + I.dur + 0.6;
  },
  end: null,
};
AR.lampout = {
  start(D, I, p, P) { I.dur = rand(1.1, 1.7); D.snd('lamp_die', P.x, P.y + 1.6, 0.8); D.snd('breath', P.x + P.face, P.y + 1.4, 0.5); },
  tick(D, I, p, dt, P) {
    if (I.t < I.dur) { D.h.lampMul = I.t < 0.2 ? (Math.sin(I.t * 80) > 0 ? 1 : 0.1) : 0.01; return false; }
    if (!I.f) {
      // the lamp comes back and it is right there, between you and the camera
      const C = D.R.camera.position;
      I.f = addObj(I, D.fig('screamFace', P.x + P.face * 0.6, P.y + 1.55, 0, 0, 1, p.v));
      if (!I.f) return true;
      I.f.o.position.set(P.x * 0.55 + C.x * 0.45, (P.y + 1.4) * 0.55 + C.y * 0.45, C.z - 4.2);
      I.f.o.lookAt(C); I.f.o.rotateY(0); I.f.o.scale.setScalar(2.4);
      I.f.alpha(1); D.h.lampMul = 1.3; D.sting(p.sting, 1); D.snd('sc_ghoul', P.x, P.y + 1, 0.8, { z: 6 }); D.fear(1); D.shake(1); D.h.glitch = 0.8;
      D.coldLight(I.f.o.position.x, I.f.o.position.y + 1, I.f.o.position.z + 1.5, 9, 0xfff0e0);
      I.t0 = I.t; D.hooks.rumble && D.hooks.rumble(1, 1, 400);
    }
    const g = I.t - I.t0;
    if (I.f.r.jaw) I.f.r.jaw.rotation.x = Math.min(0.9, g * 6);
    I.f.o.scale.setScalar(2.4 + g * 1.4);
    D.h.lampMul = 1;
    if (g > 0.55) { I.f.alpha(0); D.coldLight(0, 0, 0, 0); return true; }
    return false;
  },
};
AR.drop = {
  start(D, I, p, P) {
    const x = P.x + P.face * 1.6, c = D.ceilAbove(x, P.y + 1, 9); if (!c || c - P.y < 3.2) return false;
    I.x = Math.floor(x) + 0.5; I.top = c; I.y1 = P.y + (p.model === 'hangedMan' ? 0 : 1.1);
    if (p.model === 'hangedMan') I.f = addObj(I, D.fig('hangedMan', I.x, c, 0.3, -Math.PI / 2, 1, c - P.y - 2.2));
    else if (p.model === 'cageHanging') I.f = addObj(I, D.fig('cageHanging', I.x, c, 0.3, -Math.PI / 2, 1, c - P.y - 2.6));
    else I.f = addObj(I, D.fig(p.model, I.x, c, 0.4, -Math.PI / 2, p.scale || 1));
    if (!I.f) return false;
    if (p.flip) I.f.o.rotation.z = Math.PI;
    I.f.o.position.y = c + 4;
    // a thread or rope for the things that do not bring their own
    if (p.model === 'spider' || p.model === 'paleWoman' || p.model === 'ghoulCrawler') {
      const line = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1, 4), new THREE.MeshBasicMaterial({ color: 0x9a9a90, transparent: true, opacity: 0.5 }));
      line.geometry.translate(0, 0.5, 0); D.group.add(line); I.line = addObj(I, line);
    }
  },
  tick(D, I, p, dt, P) {
    const f = I.f, hang = p.model === 'hangedMan' || p.model === 'cageHanging';
    const k = Math.min(1, I.t / 0.32);
    const yTop = hang ? I.top + (1 - k) * 4 : I.top + (1 - k) * 4;
    const yy = hang ? yTop : I.top + (I.y1 - I.top) * k + (1 - k) * 4;
    f.o.position.y = yy; f.alpha(1);
    if (I.line) { I.line.position.set(I.x, yy + (p.flip ? 0.2 : 0.5), 0.4); I.line.scale.y = Math.max(0.01, I.top + 1 - yy); }
    if (k >= 1 && !I.hit) { I.hit = 1; D.punch(1); D.sting(pick(['st_metal', 'st_violin', 'st_piano']), 1); D.snd(hang ? 'rope_creak' : 'sc_ghoul', I.x, P.y + 1.5, 0.9); D.fear(1); D.shake(0.7); D.h.glitch = 0.5; D.hooks.rumble && D.hooks.rumble(0.9, 0.9, 320); }
    if (I.hit) f.o.rotation.z = (p.flip ? Math.PI : 0) + Math.sin((I.t - 0.32) * 7) * 0.35 * Math.exp(-(I.t - 0.32) * 0.8);
    if (p.model === 'paleWoman' && f.r.armL) { f.r.armL.rotation.z = 2.8; f.r.armR.rotation.z = 2.8; }
    D.coldLight(I.x, P.y + 2, 1.5, 4);
    if (I.t > 3.2) f.alpha(1 - (I.t - 3.2) / 0.6);
    return I.t > 3.8;
  },
};
AR.rush = {
  start(D, I, p, P) {
    const s = D.floorNear(P, 7, 9.5, P.face); if (!s) return false;
    I.x = s.x; I.y = s.y; I.n = p.n || 1; I.fs = [];
    for (let k = 0; k < I.n; k++) { const f = addObj(I, D.fig(p.model, s.x + rand(-0.6, 0.6) * (k > 0), s.y + (p.model === 'bat' ? 1.2 + rand(-0.4, 0.8) : 0), -1.5 - k * 0.3, -Math.PI / 2, p.model === 'bat' ? 1.3 : 1)); if (f) I.fs.push(f); }
    if (!I.fs.length) return false;
    D.snd(p.model === 'bat' ? 'wings_many' : 'feet_run', s.x, s.y + 1, 0.7);
  },
  tick(D, I, p, dt, P) {
    const C = D.R.camera.position, k = Math.min(1, I.t / 0.75), e = k * k * k;
    I.fs.forEach((f, i) => {
      const ox = (i % 3 - 1) * 1.2, oy = Math.floor(i / 3) * 0.7;
      f.o.position.set(I.x + (C.x + ox - I.x) * e, I.y + oy + (C.y - 0.6 - I.y) * e, -1.5 + (C.z - 1.2 + 1.5) * e);
      f.o.lookAt(C.x, f.o.position.y, C.z); f.o.rotateY(-Math.PI / 2);
      f.alpha(Math.min(1, I.t * 3));
      if (f.r.wingL) { const fl = Math.sin(I.t * 30 + i) * 0.9; f.r.wingL.rotation.x = fl; f.r.wingR.rotation.x = -fl; }
      if (f.r.limbs) f.r.limbs.forEach((l, j) => { if (l) l.rotation.z = Math.sin(I.t * 16 + j * 1.6) * 0.7; });
      if (f.r.jaw) f.r.jaw.rotation.z = -0.6;
    });
    if (k >= 0.9 && !I.hit) { I.hit = 1; D.sting(pick(['st_choir', 'st_violin', 'st_brass']), 1); D.snd(p.model === 'bat' ? 'bat' : 'sc_inhuman', P.x, P.y + 1.5, 1, { z: 8 }); D.fear(1); D.shake(1); D.h.glitch = 1; D.hooks.rumble && D.hooks.rumble(1, 1, 300); }
    if (k >= 1) { I.fs.forEach((f) => f.alpha(0)); return true; }
    return false;
  },
};
AR.burst = {
  start(D, I, p, P) {
    I.arms = [];
    const n = p.n;
    for (let k = 0; k < n * 3 && I.arms.length < n; k++) {
      const x = P.x + rand(-3, 3), y = p.roof ? (D.ceilAbove(P.x, P.y + 1, 6) || 0) - 0.1 : P.y + rand(0.3, 2.6);
      if (p.roof && y < 1) return false;
      const hit = p.roof ? { p: new THREE.Vector3(x, y, rand(-0.5, 0.5)), n: new THREE.Vector3(0, -1, 0) } : D.wallAt(x, y);
      if (!hit || (!p.roof && hit.p.z < -4.5)) continue;
      const f = addObj(I, D.fig('arm', hit.p.x, hit.p.y, hit.p.z, 0)); if (!f) break;
      f.o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), hit.n.clone().add(new THREE.Vector3(rand(-0.4, 0.4), rand(-0.3, 0.3), 0)).normalize());
      f.base = hit.p.clone(); f.nrm = hit.n.clone(); f.delay = rand(0, 0.25); I.arms.push(f);
    }
    if (I.arms.length < Math.min(2, n)) return false;
    if (p.face) { const hit = D.wallAt(P.x + P.face * 1.5, P.y + 1.4); if (hit) { I.face = addObj(I, D.fig('wallFace', hit.p.x, hit.p.y, hit.p.z - 0.6, 0, 1.3)); } }
  },
  tick(D, I, p, dt, P) {
    for (const f of I.arms) {
      const k = clamp01((I.t - f.delay) / 0.22), out = k < 1 ? ease(k) : 1 - clamp01((I.t - 2.2) / 0.6);
      f.o.position.copy(f.base).addScaledVector(f.nrm, -1.0 + out * 1.0); f.alpha(out > 0.02 ? 1 : 0);
      if (f.r.elbow) f.r.elbow.rotation.x = Math.sin(I.t * 9 + f.delay * 20) * 0.5;
      if (f.r.hand && f.r.hand.children) f.r.hand.rotation.z = Math.sin(I.t * 12 + f.delay * 30) * 0.3;
    }
    if (I.face) { const k = I.t < 0.3 ? ease(I.t / 0.3) : I.t > 2.2 ? 1 - clamp01((I.t - 2.2) / 0.6) : 1; I.face.o.position.z = I.face.o.position.z * 0 + (I.face.base ?? (I.face.base = I.face.o.position.z)) + k * 0.7; I.face.alpha(k); if (I.face.r.jaw) I.face.r.jaw.rotation.x = 0.6 * k; }
    if (I.t > 0.05 && !I.hit) { I.hit = 1; D.punch(0.8); D.sting(pick(['st_metal', 'st_brass']), 1); D.snd('flesh_tear', P.x, P.y + 1, 0.9); D.snd('moan_walls', P.x, P.y + 1, 0.7); D.fear(0.9); D.shake(0.6); D.R.fx.debris(P.x, P.y + 1.5, -0.5, { n: 14, speed: 4, size: 0.12 }); }
    D.coldLight(P.x, P.y + 2, 1.5, 3, 0xffd0c0);
    return I.t > 2.9;
  },
};
AR.hands = {
  start(D, I, p, P) {
    if (!P.ground) return false;
    I.fs = [];
    for (let k = 0; k < p.n; k++) {
      const a = p.ring ? k / p.n * Math.PI * 2 : 0;
      const x = p.ring ? P.x + Math.cos(a) * 1.3 : P.x + rand(-1.6, 1.6), z = p.ring ? Math.sin(a) * 1.0 : rand(-0.8, 0.8);
      if (!D.standable(Math.floor(x), Math.round(P.y))) continue;
      const f = addObj(I, D.fig('arm', x, P.y - 1.1, z, rand(0, 6))); if (f) { f.delay = rand(0, 0.3); I.fs.push(f); }
    }
    if (I.fs.length < 2) return false;
  },
  tick(D, I, p, dt, P) {
    for (const f of I.fs) {
      const k = clamp01((I.t - f.delay) / 0.2), out = I.t < 2 ? ease(k) : 1 - clamp01((I.t - 2) / 0.5);
      f.o.position.y = P.y - 1.1 + out * 1.0; f.alpha(out > 0.02 ? 1 : 0);
      if (f.r.elbow) f.r.elbow.rotation.x = 0.4 + Math.sin(I.t * 10 + f.delay * 9) * 0.4;
    }
    if (I.t > 0.05 && !I.hit) { I.hit = 1; D.punch(0.8); D.sting('st_bass', 1); D.snd('squelch', P.x, P.y, 0.9); D.snd('sc_many', P.x, P.y, 0.4); D.fear(0.9); D.shake(0.5); D.R.fx.dust(P.x, P.y + 0.1, 0.2, { n: 14, s0: 0.3, s1: 1.4, life: 1.5, jit: 2, a: 0.4 }); }
    return I.t > 2.6;
  },
};
AR.lookup = {
  start(D, I, p, P) {
    const c = D.ceilAbove(P.x, P.y + 1, 8); if (!c || c - P.y < 3) return false;
    I.c = c; I.x = P.x;
    if (p.model === 'eyes') { I.fs = []; for (let k = 0; k < 24; k++) { const f = addObj(I, D.fig('eyes', P.x + rand(-4, 4), c - 0.05, rand(-1.5, 1.2), 0, rand(0.8, 1.6))); if (f) { f.o.rotation.x = Math.PI / 2; I.fs.push(f); } } }
    else { I.f = addObj(I, D.fig(p.model, P.x, c, 0.2, -Math.PI / 2)); if (!I.f) return false; I.f.o.rotation.x = Math.PI; }
    D.R.cinematic(P.x, c - 1.2, 9, 2.4);
    D.snd('skitter', P.x, c, 0.6);
  },
  tick(D, I, p, dt, P) {
    const k = clamp01((I.t - 0.6) / 0.4);
    if (I.f) { I.f.alpha(k); I.f.o.position.x = I.x + Math.sin(I.t * 1.5) * 0.2; if (I.f.r.jaw) I.f.r.jaw.rotation.z = -0.5 * k; }
    if (I.fs) I.fs.forEach((f, i) => { f.alpha(clamp01((I.t - 0.4 - i * 0.03) / 0.15)); });
    D.coldLight(I.x, I.c - 1, 1.5, 4);
    if (I.t > 1.0 && !I.hit) { I.hit = 1; D.punch(0.6); D.sting('st_violin', 1); D.snd('sc_ghoul', I.x, I.c, 0.9); D.fear(1); D.shake(0.6); }
    if (I.t > 2.2) { if (I.f) { I.f.alpha(0); } if (I.fs) I.fs.forEach((f) => f.alpha(0)); }
    return I.t > 2.4;
  },
};

// ---- the walls
AR.write = {
  place(D, I, p) {
    const m = wallDecal(D, I.x + rand(-1, 1), I.y + rand(1.7, 2.3), 5.4, 1.69, writingTex(p.text, p.style), { rough: p.style === 'blood' ? 0.22 : 0.9, rz: rand(-0.08, 0.08), glow: p.style === 'blood' ? 1.1 : p.style === 'scratch' ? 0.35 : 0.25 });
    if (!m) return false;
    addObj(I, m); I.m = m; I.r = 6;
  },
  tick(D, I, p, dt, P) {
    I.m.material.opacity = Math.min(1, I.t / 1.8);
    if (I.t < 0.05) { D.snd(p.style === 'scratch' ? 'scratch' : 'drip_blood', I.x, I.y + 2, 0.5); }
    if (p.style === 'blood' && Math.random() < dt * 4 && I.t < 4) D.R.fx.dust(I.m.position.x + rand(-1.5, 1.5), I.m.position.y - 0.3, I.m.position.z + 0.2, { n: 1, s0: 0.04, s1: 0.03, life: 1.4, vy: -0.4, up: 0, jit: 0.02, a: 0.9, col: [0.35, 0.01, 0.01], grav: 3, drag: 0.2 });
    return false;   // it stays for the rest of the level
  },
};
AR.wallface = {
  start(D, I, p, P) {
    I.fs = [];
    for (let k = 0; k < p.n * 3 && I.fs.length < p.n; k++) {
      const hit = D.wallAt(P.x + P.face * rand(1.5, 4.5), P.y + rand(1, 2.6)); if (!hit || hit.p.z < -4) continue;
      const f = addObj(I, D.fig('wallFace', hit.p.x, hit.p.y, hit.p.z - 0.5, 0, rand(1, 1.4))); if (!f) break;
      f.base = hit.p.clone(); f.n = hit.n.clone(); f.o.lookAt(tmp.copy(hit.p).add(hit.n)); f.o.rotateY(0); I.fs.push(f);
    }
    if (!I.fs.length) return false;
    D.snd('wall_groan', P.x, P.y + 1, 0.7);
  },
  tick(D, I, p, dt, P) {
    const k = I.t < 1.2 ? ease(I.t / 1.2) : I.t < 3.4 ? 1 : 1 - ease(clamp01((I.t - 3.4) / 1));
    for (const f of I.fs) {
      f.o.position.copy(f.base).addScaledVector(f.n, -0.55 + k * 0.6); f.alpha(1);
      if (f.r.jaw) f.r.jaw.rotation.x = Math.max(0, Math.sin(I.t * 3)) * 0.5 * k;
      if (p.follow) { const d = tmp.set(P.x, P.y + 1.5, 0).sub(f.o.position).normalize(); f.o.lookAt(tmp2.copy(f.o.position).add(d)); }
    }
    if (I.t > 1.2 && !I.s) { I.s = 1; D.snd('moan_walls', P.x, P.y + 1, 0.6); D.fear(0.5); }
    return I.t > 4.5;
  },
};
AR.eyes = {
  start(D, I, p, P) {
    I.fs = [];
    for (let k = 0; k < p.n * 2 && I.fs.length < p.n; k++) {
      const hit = D.wallAt(P.x + rand(-8, 8), P.y + rand(-1, 5)); if (!hit) continue;
      if (!p.huge && D.lit(hit.p.x, hit.p.y)) continue;   // eyes live where the lamp is not
      const f = addObj(I, D.fig('eyes', hit.p.x, hit.p.y, hit.p.z + 0.08, 0, p.huge ? 9 : rand(0.8, 1.5))); if (!f) break;
      f.o.lookAt(tmp.copy(hit.p).add(hit.n)); f.delay = rand(0, 1.2); I.fs.push(f);
    }
    if (!I.fs.length) return false;
    D.snd(p.huge ? 'wall_groan' : 'whisper_l', P.x, P.y + 2, 0.6);
  },
  tick(D, I, p, dt, P) {
    const dur = p.huge ? 4 : 4.5;
    I.fs.forEach((f, i) => {
      const t = I.t - f.delay, open = t < 0 ? 0 : t < 0.15 ? t / 0.15 : t < dur - 1 ? 1 : 1 - clamp01((t - dur + 1) / 0.3 - i * 0.02);
      f.o.scale.y = f.o.scale.x * Math.max(0.05, open); f.alpha(open > 0.04 ? 1 : 0);
      if (open > 0.9 && Math.random() < dt * 0.5) f.o.scale.y = f.o.scale.x * 0.1;   // a blink
      if (p.huge) { const d = tmp.set(P.x, P.y + 1.5, 0).sub(f.o.position).normalize(); f.o.lookAt(tmp2.copy(f.o.position).add(d)); }
    });
    if (I.t > 1 && !I.s) { I.s = 1; D.fear(0.35); }
    return I.t > dur + 1.5;
  },
};
AR.bleed = {
  start(D, I, p, P) { D.snd('drip_blood', P.x, P.y + 2, 0.8); D.snd('wall_groan', P.x, P.y + 1, 0.4); },
  tick(D, I, p, dt, P) {
    const k = I.t < 1.5 ? I.t / 1.5 : I.t < 6 ? 1 : 1 - (I.t - 6) / 2;
    D.h.bleed = Math.max(D.h.bleed, k);
    const fx = D.R.fx;
    if (p.how === 'rain' && Math.random() < dt * 40 * k) { const c = D.ceilAbove(P.x, P.y + 1, 8) || P.y + 5; fx.dust(P.x + rand(-6, 6), c - 0.1, rand(-1, 1), { n: 1, s0: 0.05, s1: 0.04, life: 1.6, vy: -1, up: 0, jit: 0.05, a: 0.95, col: [0.4, 0.01, 0.01], grav: 9, drag: 0 }); }
    if (p.how === 'cracks' && Math.random() < dt * 20 * k) { const hit = D.wallAt(P.x + rand(-5, 5), P.y + rand(0.5, 3)); if (hit) fx.dust(hit.p.x, hit.p.y, hit.p.z + 0.15, { n: 1, s0: 0.07, s1: 0.05, life: 2.2, vy: -0.2, up: 0, jit: 0.02, a: 0.95, col: [0.35, 0.01, 0.01], grav: 1.5, drag: 0.5 }); }
    if (I.t > 1 && !I.s) { I.s = 1; D.fear(0.4); }
    return I.t > 8;
  },
  end: null,
};
AR.breathe = {
  start(D, I, p, P) { D.snd(p.fast ? 'breath' : 'wall_groan', P.x, P.y + 1, 0.7); },
  tick(D, I, p, dt, P) {
    const k = I.t < 1 ? I.t : I.t < 6 ? 1 : 1 - (I.t - 6) / 1.5;
    D.h.breathe = Math.max(0, k) * p.k; D.h.breatheRate = p.fast ? 5.5 : 1.6;
    if (I.t > 2 && !I.s) { I.s = 1; D.snd('breath', P.x, P.y + 1, 0.6); D.fear(0.3); }
    if (I.t > 7.5) { D.h.breathe = 0; return true; }
    return false;
  },
};
AR.prints = {
  place(D, I, p) { I.r = 5; I.ms = []; },
  tick(D, I, p, dt, P) {
    if (!I.ms) I.ms = [];
    const every = p.trail ? 0.35 : 0.18;
    if (I.ms.length < p.n && I.t > I.ms.length * every) {
      const x = p.trail ? I.x + (I.ms.length - p.n / 2) * 0.8 * (P.x < I.x ? -1 : 1) : P.x + rand(-4, 4), y = p.trail ? I.y + 1.2 + Math.sin(I.ms.length * 1.3) * 0.5 : P.y + rand(0.6, 3);
      const s = p.small ? 0.42 : 0.62;
      const m = wallDecal(D, x, y, s, s, handTex(p.small), { rough: 0.25, rz: rand(-0.6, 0.6) });
      if (m) { m.material.opacity = 1; I.ms.push(m); addObj(I, m); D.snd('squelch', x, y, 0.35); } else I.ms.push(null);
      if (I.ms.length === 3) D.fear(0.3);
    }
    return false;
  },
};
AR.photo = {
  place(D, I, p) {
    const im = D.imgs[p.img]; if (!im || !im.complete || !im.naturalWidth) return false;
    const ar = im.naturalWidth / im.naturalHeight, h = ar > 1 ? 0.85 : 1.1;
    const tex = photoCanvas(im, false); I.tex2 = p.change ? photoCanvas(im, true) : null;
    const m = wallDecal(D, I.x, I.y + 1.7, h * ar, h, tex, { rough: 0.6, rz: rand(-0.12, 0.12) }); if (!m) return false;
    m.material.opacity = 1; m.material.color.setRGB(0.75, 0.72, 0.66); addObj(I, m); I.m = m; I.r = 3.2;
    // a dark frame
    const fr = new THREE.Mesh(new THREE.PlaneGeometry(h * ar + 0.12, h + 0.12), new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.8 }));
    fr.position.copy(m.position).addScaledVector(m.getWorldDirection(tmp), -0.02); fr.quaternion.copy(m.quaternion); D.group.add(fr); addObj(I, fr);
  },
  tick(D, I, p, dt, P) {
    if (p.change && !I.sw && I.t > 0.6) { I.sw = 1; D.h.lampMul = 0.05; D.snd('st_reverse', I.x, I.y + 1.5, 0.6); }
    if (I.sw === 1 && I.t > 0.85) { I.sw = 2; I.m.material.map = I.tex2; I.m.material.needsUpdate = true; D.h.lampMul = 1; D.fear(0.5); D.snd('whisper_r', I.x, I.y + 1.5, 0.5); }
    if (!p.change && I.t < 0.1) D.snd('lantern_sq', I.x, I.y + 1.5, 0.3);
    return false;
  },
};
AR.candles = {
  place(D, I, p) {
    I.fs = []; I.r = 4;
    for (let k = 0; k < p.n; k++) {
      const a = k / p.n * Math.PI * 2, x = p.ring ? I.x + Math.cos(a) * 1.2 : I.x + (k - p.n / 2) * 0.55, z = p.ring ? Math.sin(a) * 0.8 - 0.4 : -0.6 + Math.sin(k * 2.1) * 0.2;
      const f = addObj(I, D.fig('candles', x, I.y, z, rand(0, 6), 0.7, 2)); if (f) { f.alpha(1); I.fs.push(f); }
    }
    if (!I.fs.length) return false;
    D.R.emitters.push(I.em = { key: 'cand' + I.x, x: I.x, y: I.y + 0.6, z: 0, col: [1, 0.55, 0.25], int: 5, range: 6, pri: 3, flick: 1 });
  },
  idle(D, I) { for (const f of I.fs) if (f.r.flames) f.r.flames.forEach((fl, i) => { fl.scale.y = 0.9 + Math.sin(D.t * 13 + i * 2) * 0.12; }); return false; },
  tick(D, I, p, dt, P) {
    // one by one, toward you
    const n = I.fs.length, k = Math.floor(I.t / 0.32);
    I.fs.forEach((f, i) => { const idx = P.x > I.x ? i : n - 1 - i; if (idx < k && f.r.flames) f.r.flames.forEach((fl) => { fl.visible = false; }); });
    if (I.t < 0.05) D.snd('candles', I.x, I.y + 0.5, 0.8);
    if (I.em) I.em.int = 5 * Math.max(0, 1 - k / n);
    if (k >= n && !I.s) { I.s = 1; D.snd('laugh_low', I.x, I.y + 1, 0.6); D.fear(0.4); }
    return false;
  },
  end: null,
};
AR.shadow = {
  start(D, I, p, P) {
    const hit = D.wallAt(P.x, P.y + 1.5); if (!hit) return false;
    I.f = addObj(I, D.fig(p.model === 'shadowFigure' ? 'shadowFigure' : p.model, P.x - 8, hit.p.y - 1, hit.p.z + 0.15, 0, p.s));
    if (!I.f) return false;
    // a pure black silhouette, flattened onto the wall
    for (const m of I.f.mats) { if (m.color) m.color.setRGB(0, 0, 0); if (m.emissive) m.emissive.setRGB(0, 0, 0); m.userData.o = 0.82; }
    I.f.o.scale.z *= 0.05; I.z = hit.p.z + 0.15; I.y = hit.p.y - 1;
    I.dir = Math.random() < 0.5 ? 1 : -1; I.x0 = P.x - I.dir * 10;
    D.snd(p.model === 'bat' ? 'wings_many' : 'drag', P.x, P.y + 2, 0.6);
  },
  tick(D, I, p, dt, P) {
    const x = I.x0 + I.dir * I.t * 6; I.f.o.position.set(x, I.y, I.z); I.f.o.rotation.y = I.dir > 0 ? 0 : Math.PI;
    I.f.alpha(1);
    if (I.f.r.wingL) { const fl = Math.sin(I.t * 6) * 0.7; I.f.r.wingL.rotation.x = fl; I.f.r.wingR.rotation.x = -fl; }
    if (Math.abs(x - P.x) < 1 && !I.s) { I.s = 1; D.h.lampMul = 0.5; D.fear(0.4); }
    if (I.s) D.h.lampMul = Math.min(1, D.h.lampMul + dt * 2);
    return I.t > 3.5;
  },
};

// ---- whispers and sounds
AR.whisper = {
  start(D, I, p, P) {
    const side = Math.random() < 0.5 ? -1 : 1;
    if (D.A.ctx) D.A.play(p.snd, { x: P.x + side * 2.5, y: P.y + 1.5, z: 3, vol: 0.85, vary: 0, bus: 'voice', gap: 0.1 });
    D.hooks.subtitle && D.hooks.subtitle(p.text);
    I.dur = 3.2;
  },
  tick(D, I, p, dt) { if (I.t > I.dur) { D.hooks.subtitle && D.hooks.subtitle(''); return true; } return false; },
};
AR.sound = {
  start(D, I, p, P) {
    let x = P.x + rand(-9, 9), y = P.y + rand(-2, 3);
    if (p.sign === 'close') { x = P.x - P.face * 1.2; y = P.y + 1.5; }
    if (p.sign === 'stopwalk' && Math.abs(P.vx) < 1) return false;
    if (p.sign === 'water') { const w = D.waterNear(P, 9); if (!w) return false; x = w.x; y = w.y; }
    I.x = x; I.y = y;
    D.snd(p.snd, x, y, p.sign === 'close' ? 0.9 : 0.75);
  },
  tick(D, I, p, dt, P) {
    const fx = D.R.fx;
    if ((p.sign === 'dust' || p.sign === 'dustroof') && I.t < 2 && Math.random() < dt * 8) { const c = D.ceilAbove(P.x, P.y + 1, 8) || P.y + 4; fx.dust(P.x + rand(-3, 3), c - 0.1, 0.2, { n: 1, s0: 0.1, s1: 0.5, life: 1.5, vy: -1.5, a: 0.5, grav: 3 }); }
    if (p.sign === 'rumble' && I.t < 0.1) D.shake(0.25);
    if (p.sign === 'close' && I.t < 0.1) D.fear(0.45);
    return I.t > 3;
  },
};
AR.silence = {
  start(D, I, p, P) { D.A.hushAll && D.A.hushAll(4.2); D.h.desat = 0.5; },
  tick(D, I, p, dt, P) {
    D.h.desat = Math.max(D.h.desat, 0.5);
    if (I.t > 4 && p.end && !I.s) { I.s = 1; D.snd(p.end, P.x - P.face * 1.5, P.y + 1.4, 1, { z: 2 }); D.fear(0.8); if (p.end === 'sc_woman') D.shake(0.4); }
    return I.t > 5;
  },
};
AR.heart = {
  start(D, I, p, P) { D.snd('heartbeat', P.x, P.y + 1, 0.9, { z: 4 }); },
  tick(D, I, p, dt, P) {
    D.h.red = Math.max(D.h.red, 0.5 + 0.5 * Math.abs(Math.sin(I.t * (p.stop ? 4 : 6))));
    if (p.stop && I.t > 3 && !I.s) { I.s = 1; D.A.hushAll && D.A.hushAll(1.6); D.h.desat = 1; D.h.red = 0; }
    if (p.stop && I.s) D.h.red = 0;
    return I.t > 4.6;
  },
};

// ---- the dead
AR.fall = {
  start(D, I, p, P) {
    const x = P.x + P.face * 2.4, c = D.ceilAbove(x, P.y + 1, 10); if (!c || c - P.y < 4) return false;
    if (!D.standable(Math.floor(x), Math.round(P.y))) return false;
    I.x = x; I.y0 = c; I.yf = Math.round(P.y); I.fs = [];
    const n = p.n || 1;
    for (let k = 0; k < n; k++) { const f = addObj(I, D.fig(p.model, x + rand(-1, 1) * (n > 1), c, rand(-0.3, 0.6), rand(-1, 1))); if (f) { f.delay = k * 0.18; f.vy = 0; f.y = c; f.rest = false; I.fs.push(f); } }
    if (!I.fs.length) return false;
  },
  tick(D, I, p, dt, P) {
    for (const f of I.fs) {
      if (I.t < f.delay) continue;
      if (!f.rest) { f.vy -= 24 * dt; f.y += f.vy * dt; if (f.y <= I.yf) { f.y = I.yf; f.rest = true; D.snd(p.model === 'skull' ? 'skull_roll' : 'body_thud', I.x, I.yf, 0.9); D.R.fx.dust(f.o.position.x, I.yf + 0.1, 0.2, { n: 8, s0: 0.3, s1: 1.4, life: 1.6, jit: 2, a: 0.4 }); if (p.model !== 'skull') { D.punch(0.7); D.shake(0.5); D.sting('st_bass', 0.8); D.fear(0.8); } } }
      f.o.position.y = f.y; f.alpha(1);
      if (!f.rest) f.o.rotation.x += dt * 2;
    }
    if (I.t > 6) I.fs.forEach((f) => f.alpha(1 - (I.t - 6)));
    return I.t > 7;
  },
};
AR.hanging = {
  place(D, I, p) {
    const c = D.ceilAbove(I.x, I.y + 1, 9); if (!c || c - I.y < 3) return false;
    I.fs = []; I.r = 5;
    for (let k = 0; k < p.n; k++) {
      const x = I.x + (k - (p.n - 1) / 2) * 1.4; if (D.solid(x, c - 1)) continue;
      const f = addObj(I, D.fig('hangedMan', x, c, -0.4 + k * 0.2, p.turn ? 0 : -Math.PI / 2 + rand(-0.6, 0.6), 1, Math.max(0.6, c - I.y - 2.6))); if (f) { f.alpha(1); f.ph = rand(0, 6); I.fs.push(f); }
    }
    if (!I.fs.length) return false;
  },
  idle(D, I) { for (const f of I.fs) f.o.rotation.z = Math.sin(D.t * 0.9 + f.ph) * 0.05; return false; },
  tick(D, I, p, dt, P) {
    if (I.t < 0.05) D.snd('rope_creak', I.x, I.y + 2, 0.8);
    for (const f of I.fs) {
      f.o.rotation.z = Math.sin(D.t * 2.2 + f.ph) * 0.12;
      if (p.turn) f.o.rotation.y = Math.min(1, I.t / 1.5) * -Math.PI / 2 * (P.x > I.x ? 1 : 1);
    }
    if (I.t > 1.5 && !I.s) { I.s = 1; D.fear(0.4); if (p.turn) D.snd('st_reverse', I.x, I.y + 2, 0.6); }
    return false;
  },
};
AR.twitch = {
  place(D, I, p) { I.f = addObj(I, D.fig('corpse', I.x - 0.9, I.y, -0.3, rand(-0.3, 0.3))); if (!I.f) return false; I.f.alpha(1); I.r = 2.4; },
  tick(D, I, p, dt, P) {
    const f = I.f, k = I.t < 0.4 ? ease(I.t / 0.4) : I.t < 2.5 ? 1 : 1 - ease(clamp01((I.t - 2.5) / 0.6));
    if (p.mode === 'arm' && f.r.armR) f.r.armR.rotation.z = k * 1.4;
    if (p.mode === 'sit') f.o.rotation.z = k * 1.1;
    if (p.mode === 'head' && f.r.head) f.r.head.rotation.y = k * 1.3;
    if (I.t < 0.05) { D.punch(0.4); D.snd(p.mode === 'sit' ? 'gasp' : 'bone_crunch', I.x, I.y + 0.5, 0.8); D.fear(0.6); if (p.mode === 'sit') D.sting('st_piano', 0.7); }
    return false;
  },
};
AR.cocoon = {
  place(D, I, p) {
    I.fs = []; I.r = 3.5;
    const n = p.mode === 'row' ? 3 : 1;
    for (let k = 0; k < n; k++) { const f = addObj(I, D.fig('cocoon', I.x + (k - (n - 1) / 2) * 1.3, I.y, -0.6, rand(-1, 1))); if (f) { f.alpha(1); I.fs.push(f); } }
    if (!I.fs.length) return false;
  },
  idle(D, I) { for (const f of I.fs) if (f.r.bulge) f.r.bulge.scale.setScalar(1 + Math.sin(D.t * 0.7) * 0.03); return false; },
  tick(D, I, p, dt, P) {
    I.fs.forEach((f, i) => {
      const t = I.t - i * 0.4; if (t < 0) return;
      f.o.rotation.z = Math.sin(t * 22) * 0.04 * Math.max(0, 1 - t / 2);
      if (f.r.bulge) { f.r.bulge.scale.setScalar(1 + Math.max(0, Math.sin(t * 9)) * 0.25 * Math.max(0, 1 - t / 2.5)); }
    });
    if (p.mode === 'hand' && !I.arm && I.t > 0.8) { const f = I.fs[0]; I.arm = addObj(I, D.fig('arm', f.o.position.x + 0.1, I.y + 1.1, f.o.position.z + 0.35, 0, 0.8)); if (I.arm) { I.arm.o.rotation.x = 1.2; I.arm.alpha(1); D.snd('flesh_tear', I.x, I.y + 1, 0.9); D.sting('st_metal', 0.8); D.fear(0.8); } }
    if (I.arm && I.arm.r.elbow) I.arm.r.elbow.rotation.x = Math.sin(I.t * 7) * 0.4;
    if (I.t < 0.05) { D.snd('squelch', I.x, I.y + 1, 0.8); D.fear(0.4); }
    return false;
  },
};
AR.skull = {
  place(D, I, p) { I.r = 5; I.fs = []; },
  tick(D, I, p, dt, P) {
    if (!I.fs.length) {
      const dir = P.x < I.x ? -1 : 1;
      for (let k = 0; k < p.n; k++) { const f = addObj(I, D.fig('skull', I.x - dir * (4 + k * 0.7), I.y + 0.13, rand(-0.4, 0.4), 0)); if (f) { f.alpha(1); f.dir = dir; I.fs.push(f); } }
      if (!I.fs.length) return true;
      D.snd(p.n > 1 ? 'teeth' : 'skull_roll', I.x, I.y, 0.8);
    }
    for (const f of I.fs) {
      const k = Math.min(1, I.t / 1.6);
      f.o.position.x = I.x - f.dir * (4 - 3.4 * ease(k)); f.o.rotation.z = f.dir * ease(k) * 9;
      if (k >= 1 && p.n > 1) { f.o.position.y = I.y + 0.13 + Math.abs(Math.sin(I.t * 30 + f.o.position.x)) * 0.03; }
    }
    if (I.t > 1.6 && !I.s) { I.s = 1; D.fear(0.4); }
    return false;
  },
};
AR.cage = {
  place(D, I, p) {
    const c = D.ceilAbove(I.x, I.y + 1, 9); if (!c || c - I.y < 3.4) return false;
    I.f = addObj(I, D.fig('cageHanging', I.x, c, -0.3, rand(-0.5, 0.5), 1, Math.max(0.5, c - I.y - 2.8))); if (!I.f) return false; I.f.alpha(1); I.r = 4;
    if (p.empty && I.f.r.cage) I.f.r.cage.traverse((o) => { if (/skel|bone/i.test(o.name)) o.visible = false; });
  },
  idle(D, I) { I.f.o.rotation.z = Math.sin(D.t * 0.8 + I.x) * 0.03; return false; },
  tick(D, I, p, dt, P) {
    I.f.o.rotation.z = Math.sin(I.t * (p.empty ? 2 : 17)) * (p.empty ? 0.08 : 0.07) * Math.max(0, 1 - I.t / 2.5);
    if (I.t < 0.05) { D.snd(p.empty ? 'chains' : 'cage', I.x, I.y + 2.5, 0.9); D.fear(p.empty ? 0.3 : 0.6); if (!p.empty) D.snd('sc_man', I.x, I.y + 2.5, 0.5); }
    return false;
  },
};

// ---- crawling things
AR.swarm = {
  start(D, I, p, P) {
    if (!P.ground) return false;
    I.dir = Math.random() < 0.5 ? 1 : -1; I.fs = [];
    const c = p.roof ? D.ceilAbove(P.x, P.y + 1, 7) : null; if (p.roof && !c) return false;
    for (let k = 0; k < p.n; k++) {
      const model = p.also && k % 2 ? p.also : p.model;
      const f = addObj(I, D.fig(model, P.x - I.dir * (8 + rand(0, 6)), p.roof ? c : P.y, rand(-1.6, 1.2), I.dir > 0 ? 0 : Math.PI, model === 'spider' ? rand(0.6, 1) : rand(0.8, 1.1))); if (!f) break;
      f.sp = rand(5, 8); f.vy = 0; f.alpha(1); I.fs.push(f);
    }
    if (!I.fs.length) return false;
    D.snd(p.model === 'rat' ? 'rats' : 'spiders', P.x, P.y, 0.9);
  },
  tick(D, I, p, dt, P) {
    for (const f of I.fs) {
      if (p.roof) { f.vy -= 14 * dt; f.o.position.y = Math.max(P.y, f.o.position.y + f.vy * dt); if (f.o.position.y <= P.y) f.o.position.x += I.dir * f.sp * dt; else f.o.position.x = f.o.position.x * 0 + (f.x0 ?? (f.x0 = P.x + rand(-3, 3))); }
      else f.o.position.x += I.dir * f.sp * dt;
      if (f.r.legs) f.r.legs.forEach((l, i) => { if (l) l.rotation.y = Math.sin(I.t * 30 + i * 2) * 0.4; });
      if (f.r.tail) f.r.tail.rotation.y = Math.sin(I.t * 20) * 0.5;
    }
    if (I.t > 0.8 && !I.s) { I.s = 1; D.fear(0.35); }
    return I.t > 4;
  },
};
AR.ceiling = {
  start(D, I, p, P) {
    const c = D.ceilAbove(P.x, P.y + 1, 8); if (!c || c - P.y < 3.2) return false;
    I.c = c; I.dir = Math.random() < 0.5 ? 1 : -1;
    I.f = addObj(I, D.fig(p.model, P.x - I.dir * 9, c, -0.2, I.dir > 0 ? 0 : Math.PI, p.scale || 1)); if (!I.f) return false;
    I.f.o.rotation.x = Math.PI; I.x0 = P.x - I.dir * 9;
    D.snd('skitter', P.x, c, 0.8);
  },
  tick(D, I, p, dt, P) {
    const x = I.x0 + I.dir * I.t * (p.model === 'paleWoman' ? 2 : 4.5);
    I.f.o.position.x = x; I.f.alpha(1);
    if (I.f.r.limbs) I.f.r.limbs.forEach((l, i) => { if (l) l.rotation.z = Math.sin(I.t * 14 + i * 1.6) * 0.6; });
    if (I.f.r.legs) I.f.r.legs.forEach((l, i) => { if (l) l.rotation.y = Math.sin(I.t * 24 + i * 2) * 0.4; });
    if (Math.random() < dt * 10) D.R.fx.dust(x, I.c - 0.1, 0, { n: 1, s0: 0.1, s1: 0.4, life: 1.2, vy: -1.4, a: 0.5, grav: 3 });
    if (Math.abs(x - P.x) < 0.5 && !I.s) { I.s = 1; D.fear(0.6); D.snd('thump_above', x, I.c, 0.7); }
    D.coldLight(x, I.c - 1.5, 1, 2.5);
    return I.t > 4.5;
  },
};
AR.wings = {
  start(D, I, p, P) {
    I.dir = Math.random() < 0.5 ? 1 : -1; I.fs = [];
    for (let k = 0; k < p.n; k++) { const f = addObj(I, D.fig('bat', P.x - I.dir * (9 + k * 0.6), P.y + rand(1.5, 4), rand(-1, 2.5), I.dir > 0 ? 0 : Math.PI, p.big ? 2.2 : rand(0.8, 1.2))); if (f) { f.alpha(1); f.ph = rand(0, 6); f.sp = rand(8, 11); I.fs.push(f); } }
    if (!I.fs.length) return false;
    D.snd('wings_many', P.x, P.y + 2, 0.9);
  },
  tick(D, I, p, dt) {
    for (const f of I.fs) { f.o.position.x += I.dir * f.sp * dt; f.o.position.y += Math.sin(I.t * 8 + f.ph) * dt; if (f.r.wingL) { const fl = Math.sin(I.t * 28 + f.ph) * 0.9; f.r.wingL.rotation.x = fl; f.r.wingR.rotation.x = -fl; } }
    if (I.t > 0.9 && !I.s) { I.s = 1; D.fear(0.4); }
    return I.t > 2.5;
  },
};
AR.tallwatch = {
  start(D, I, p, P) {
    const hit = D.wallAt(P.x + P.face * 6, P.y + 2); if (!hit || hit.p.z > -3) return false;
    I.f = addObj(I, D.fig('tallMan', hit.p.x, P.y - 0.5, hit.p.z + 0.4, -Math.PI / 2)); if (!I.f) return false;
    I.x = hit.p.x;
  },
  tick(D, I, p, dt, P) {
    I.f.alpha(I.t < 1.5 ? I.t / 1.5 * 0.85 : 0.85);
    if (I.t > 3.2) { I.f.alpha(0); if (!I.s) { I.s = 1; D.snd('st_reverse', I.x, P.y + 2, 0.5); D.fear(0.3); } }
    D.coldLight(I.x, P.y + 3, I.f.o.position.z + 1.5, 2.5);
    return I.t > 3.4;
  },
};

// ---- nightmares
AR.glitch = {
  start(D, I, p, P) {
    I.fs = [];
    if (p.n) for (let k = 0; k < p.n; k++) { const s = D.floorNear({ x: P.x + rand(-8, 8), y: P.y, face: 1 }, 0, 2, 1, 3, true); if (!s) continue; const f = addObj(I, D.fig('shadowFigure', s.x + rand(-0.4, 0.4), s.y, rand(-1.5, 0.5), -Math.PI / 2 + rand(-0.3, 0.3))); if (f) I.fs.push(f); }
    D.snd('st_glitch', P.x, P.y + 1, 0.9); D.snd('static', P.x, P.y + 1, 0.6);
  },
  tick(D, I, p, dt, P) {
    const on = I.t < 0.45 && Math.sin(I.t * 70) > -0.2;
    D.h.glitch = Math.max(D.h.glitch, I.t < 0.5 ? 1 : 0);
    I.fs.forEach((f) => f.alpha(on ? 1 : 0));
    if (p.img && I.t < 0.12) { const j = document.getElementById('jump'), img = j && j.querySelector('img'); if (img && !I.sh) { I.sh = 1; img.src = D.imgs[p.img].src; j.className = 'glitch'; } }
    if (p.img && I.t > 0.14 && I.sh === 1) { I.sh = 2; const j = document.getElementById('jump'); if (j) j.className = 'hidden'; }
    if (I.t > 0.5 && !I.s) { I.s = 1; D.fear(0.5); }
    return I.t > 0.7;
  },
};
AR.invert = {
  start(D, I, p, P) { D.snd('st_bass', P.x, P.y + 1, 0.8); if (p.fig) { const s = D.floorNear(P, 1.2, 2.2, P.face, 1); if (s) I.f = addObj(I, D.fig('paleWoman', s.x, s.y, 0.2, P.face > 0 ? Math.PI : 0)); } },
  tick(D, I, p, dt, P) {
    const on = I.t < 0.35;
    D.h.invert = on ? 1 : 0; if (on) D.h.bleed = Math.max(D.h.bleed, 1);
    if (I.f) I.f.alpha(on ? 1 : 0);
    if (I.t > 0.36 && !I.s) { I.s = 1; D.fear(0.6); D.h.bleed = 0; }
    return I.t > 0.6;
  },
};
AR.fakedeath = {
  start(D, I, p, P) { if (P.hp <= 1) return false; D.hooks.fake && D.hooks.fake('death', p.cause); D.snd('death', P.x, P.y + 1, 0.8); D.h.desat = 1; },
  tick(D, I, p, dt, P) {
    D.h.dark = I.t < 2.4 ? Math.min(1, I.t * 1.2) : Math.max(0, 1 - (I.t - 2.4) * 4);
    if (I.t > 2.4 && !I.s) { I.s = 1; D.hooks.fake && D.hooks.fake('notyet'); D.snd('laugh_low', P.x, P.y + 1, 0.9, { z: 4 }); D.fear(0.6); }
    if (I.t > 3) { D.h.dark = 0; return true; }
    return false;
  },
};
AR.fakehud = {
  start(D, I, p, P) { D.hooks.fake && D.hooks.fake(p.what, 2.4); D.snd(p.what === 'oil' ? 'lamp_die' : 'heartbeat', P.x, P.y + 1, 0.8); if (p.what === 'oil') D.h.lampMul = 0.15; },
  tick(D, I, p, dt, P) {
    if (p.what === 'oil') D.h.lampMul = I.t < 2.4 ? 0.15 : Math.min(1, D.h.lampMul + dt * 3);
    else D.h.red = Math.max(D.h.red, I.t < 2.4 ? 0.8 : 0);
    if (I.t > 2.4 && !I.s) { I.s = 1; D.snd('laugh_child', P.x, P.y + 1, 0.6); }
    return I.t > 3;
  },
};
AR.vertigo = {
  start(D, I, p, P) { D.snd('drone_rise', P.x, P.y + 1, 0.8); },
  tick(D, I, p, dt) {
    const k = Math.sin(Math.min(1, I.t / 3.2) * Math.PI);
    D.h.fov = 16 * k * p.k; D.h.warp = Math.max(D.h.warp, 0.6 * k);
    if (I.t > 1.6 && !I.s) { I.s = 1; D.fear(0.3); }
    return I.t > 3.3;
  },
};
AR.redlamp = {
  start(D, I, p, P) { D.h.lampCol = new THREE.Color(p.col); D.snd('st_reverse', P.x, P.y + 1.6, 0.6); },
  tick(D, I, p, dt) { if (I.t > 6) { D.h.lampCol = null; return true; } if (I.t > 1 && !I.s) { I.s = 1; D.fear(0.3); } return false; },
  end: null,
};
AR.slow = {
  start(D, I, p, P) { D.hooks.slowmo && D.hooks.slowmo(0.4, 2.2); D.snd(p.snd, P.x, P.y + 1, 0.9, { rate: 0.6 }); D.h.desat = 0.7; },
  tick(D, I) { D.h.warp = Math.max(D.h.warp, 0.3); return I.t > 2.2; },
};

// ---- omens
AR.lantern = {
  start(D, I, p, P) {
    const s = D.floorNear(P, 4, 7, P.face, 1); if (!s) return false;
    I.f = addObj(I, D.fig('lantern', s.x, s.y + 1.2, -0.2, 0, 1)); if (!I.f) return false; I.f.alpha(1);
    I.x = s.x; I.y = s.y + 1.2; I.dir = P.face;
    D.R.emitters.push(I.em = { key: 'lant' + Math.random(), x: I.x, y: I.y, z: 0.2, col: [1, 0.7, 0.4], int: 7, range: 7, pri: 6, flick: 1 });
    I.end = () => { I.em.int = 0; };
    D.snd('lantern_sq', s.x, I.y, 0.6);
  },
  tick(D, I, p, dt, P) {
    const tx = p.follow ? P.x - P.face * 3 : I.x + I.dir * I.t * 1.6;
    const x = p.follow ? I.f.o.position.x + (tx - I.f.o.position.x) * Math.min(1, dt * 0.8) : tx;
    I.f.o.position.set(x, I.y + Math.sin(I.t * 2) * 0.12, -0.2); I.f.o.rotation.z = Math.sin(I.t * 2.4) * 0.15;
    I.em.x = x; I.em.y = I.f.o.position.y; I.em.int = 7 * (I.t > 6 ? Math.max(0, 1 - (I.t - 6)) : 1);
    if (I.t > 6) I.f.alpha(Math.max(0, 1 - (I.t - 6)));
    if (I.t > 2 && !I.s) { I.s = 1; D.fear(0.25); }
    return I.t > 7;
  },
};
AR.cart = {
  start(D, I, p, P) {
    if (!P.ground) return false;
    // a flat run of floor on the player's row
    let run = 0; for (let d = -10; d <= 10; d++) if (D.standable(Math.floor(P.x + d), Math.round(P.y))) run++;
    if (run < 14) return false;
    I.dir = Math.random() < 0.5 ? 1 : -1;
    I.f = addObj(I, D.fig('cart', P.x - I.dir * 12, Math.round(P.y), -1.2, 0)); if (!I.f) return false; I.f.alpha(1);
    if (p.body) { I.b = addObj(I, D.fig('corpse', 0, 0, 0, 0, 0.8)); if (I.b) { I.b.alpha(1); I.b.o.rotation.z = 0.9; } }
    I.x0 = P.x - I.dir * 12; I.y = Math.round(P.y);
    D.snd('cart_roll', P.x, P.y, 0.9);
  },
  tick(D, I, p, dt, P) {
    const x = I.x0 + I.dir * I.t * 4.2; I.f.o.position.x = x;
    if (I.b) I.b.o.position.set(x - 0.6, I.y + 0.7, -1.2);
    if (Math.abs(x - P.x) < 1 && !I.s) { I.s = 1; D.fear(0.4); }
    return I.t > 6;
  },
};
AR.helmet = {
  place(D, I, p) { I.f = addObj(I, D.fig('minerHelmet', I.x, I.y, -0.2, rand(0, 6))); if (!I.f) return false; I.f.alpha(1); I.r = 4; },
  tick(D, I, p, dt, P) {
    if (I.t < 0.05) { D.snd('lamp_die', I.x, I.y, 0.5); D.R.emitters.push(I.em = { key: 'helm' + I.x, x: I.x, y: I.y + 0.3, z: 0.2, col: [1, 0.9, 0.7], int: 0, range: 6, pri: 6 }); }
    if (I.em) I.em.int = I.t < 3 ? 6 * (Math.sin(I.t * 30) > 0 ? 1 : 0.4) : Math.max(0, 6 - (I.t - 3) * 3);
    if (I.t > 0.5 && !I.s) { I.s = 1; D.fear(0.35); D.snd('whisper_r', I.x, I.y + 1, 0.5); }
    return false;
  },
};
AR.doll = {
  place(D, I, p) { I.f = addObj(I, D.fig('doll', I.x, I.y, -0.3, -Math.PI / 2)); if (!I.f) return false; I.f.alpha(1); I.r = 3.5; },
  tick(D, I, p, dt, P) {
    if (I.t < 0.05) D.snd('musicbox', I.x, I.y + 0.5, 0.7);
    if (!p.gone && I.f.r.head) I.f.r.head.rotation.y = Math.min(1, I.t / 0.4) * (P.x < I.x ? -1.2 : 1.2);
    if (p.gone && I.t > 1.2 && !I.s) { I.s = 1; D.h.lampMul = 0.03; }
    if (p.gone && I.s === 1 && I.t > 1.45) { I.s = 2; D.h.lampMul = 1; I.f.alpha(0); D.snd('laugh_child', P.x - P.face * 2, P.y + 1, 0.8); D.fear(0.6); }
    if (!p.gone && I.t > 0.4 && !I.s) { I.s = 1; D.fear(0.45); }
    return false;
  },
};
AR.ritual = {
  place(D, I, p) {
    I.f = addObj(I, D.fig('ritualCircle', I.x, I.y + 0.01, -0.3, 0, 1)); if (!I.f) return false; I.f.alpha(1); I.r = 3;
    I.c = []; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; const c = addObj(I, D.fig('candles', I.x + Math.cos(a) * 1.3, I.y, -0.3 + Math.sin(a) * 0.9, 0, 0.5, 1)); if (c) { c.alpha(1); if (c.r.flames) c.r.flames.forEach((f) => { f.visible = false; }); I.c.push(c); } }
    I.em = { key: 'rit' + I.x, x: I.x, y: I.y + 0.5, z: -0.3, col: [1, 0.25, 0.1], int: 0, range: 7, pri: 5, flick: 1 }; D.R.emitters.push(I.em);
  },
  tick(D, I, p, dt, P) {
    I.c.forEach((c, k) => { if (I.t > k * 0.25 && c.r.flames) c.r.flames.forEach((f) => { f.visible = true; f.scale.y = 0.9 + Math.sin(D.t * 13 + k) * 0.15; }); });
    I.em.int = Math.min(8, I.t * 4);
    if (I.t < 0.05) D.snd('candles', I.x, I.y, 0.5);
    if (p.chant && I.t > 1.2 && !I.s) { I.s = 1; D.snd('moan_walls', I.x, I.y + 1, 0.7); D.fear(0.4); }
    if (!p.chant && I.t > 1.2 && !I.s) { I.s = 1; D.fear(0.3); }
    return false;
  },
};

export const ARCHETYPES = AR;
