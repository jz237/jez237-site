import * as THREE from 'three';
import { TimeOfDay, STOPS } from './timeofday.js';
import { Bounds } from './bounds.js';
import { BeeActor, SPEED } from './actor.js';
import { Pilot } from './pilot.js';
import { ChaseCam, FollowCam, PhotoCam, lookDir } from './cameras.js';
import { Growth } from './growth.js';
import { Bellflowers } from './bells.js';
import { Interactions } from './interactions.js';
import { Ambient } from './ambient.js';
import { Scenery } from './scenery.js';
import { LookUpgrade, FADE, GLOW } from './upgrade.js';
import { Night } from './night.js';
import { lightFieldAll, setLightField, LF } from '../world/lightfield.js';
import { DetailCull } from './cull.js';
import { NearField } from './nearfield.js';
import { applyPose } from '../direction/camera.js';
import { SUN_DIR } from '../world/atmosphere.js';
import { WashTrail, setWash, setCamera, setTime as setWindTime } from '../world/wind.js';
import { L } from '../world/layout.js';
import { clamp, lerp, smooth } from '../core/ease.js';

// Interactive modes (fly / follow / photo). The garden is held in its fully
// awake state and runs on a free real-time clock that is separate from the
// film's timeline; the explore controller owns the camera, APX-9, ambient
// life, interactions and the lighting rig while it is active. Leaving it
// hands everything back to the film, which re-derives its state from t.

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const WORLD_T0 = 70; // world clock offset: every film beat has played out
const TIMES = STOPS.map((s) => s.v); // T cycles midnight → dusk → dawn → golden hour

export class Explore {
  constructor({ renderer, scene, world, pipeline, quality, mat, audio, sync = false }) {
    this.renderer = renderer;
    this.scene = scene;
    this.world = world;
    this.pipeline = pipeline;
    this.quality = quality;
    this.audio = audio;
    this.camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.05, 9000);
    this.tod = new TimeOfDay(renderer);
    this.clock = 0;
    this.active = false;
    this.aspect = 16 / 9;
    this.pixelRatio = 1;
    this.reduced = false;
    this.mode = 'follow';
    this.photo = false;
    this.group = new THREE.Group();
    this.group.name = 'explore';
    this.group.visible = false;
    scene.add(this.group);
    this.debugView = null;
    this.focus = { center: V(0, 20, 0), radius: 60 };
    this.frustum = new THREE.Frustum();
    this.listeners = {};

    // the flight volume and everything that lives in it
    this.bounds = new Bounds(world);
    const sk = world.skep;
    const out = V(0, 0, 1).applyQuaternion(sk.group.quaternion);
    this.skep = {
      board: world.creatures.beeBoard.clone(),
      inside: world.creatures.beeInside.clone(),
      entrance: sk.entranceWorld(),
      out,
      side: V(-out.z, 0, out.x),
    };
    this.upgrade = new LookUpgrade(world, quality, mat);
    this.group.add(this.upgrade.group);
    this.scenery = new Scenery(mat, quality, world, this.bounds, this.upgrade);
    this.group.add(this.scenery.group);
    this.growth = new Growth(mat, quality, this.bounds);
    this.group.add(this.growth.group);
    this.growth.registerLandables(this.bounds);
    this.bells = new Bellflowers(mat, this.bounds);
    this.group.add(this.bells.group);
    // bee-scale planting: every leaf grown again at APX-9's scale, clear of everything
    // (grown a few ms a frame from boot: stepNearfield(); synchronously for capture tools)
    this.nearfield = new NearField({ world, bounds: this.bounds, quality, growth: this.growth, bells: this.bells, scenery: this.scenery });
    this.nearfield.onReady = (nf) => {
      if (this.upgrade.fernMatIn) nf.setFernMaterial(this.upgrade.fernMatIn);
      if (this.upgrade.palmMatIn) nf.setPalmMaterial(this.upgrade.palmMatIn);
      // dissolve the film's foliage into the bee-scale planting over ~0.6 s (at once if nobody is looking)
      this.swapFade = { k: 0 };
      if (!this.active || sync) this._finishSwap();
    };
    FADE.uSwapK.value = 0;
    this.group.add(this.nearfield.group);
    this.interactions = new Interactions({ world, mat, quality, bounds: this.bounds, growth: this.growth, bells: this.bells, audio, emit: (n, d) => { if (n === 'kindle' && this.stats) this.stats.lanterns++; this._emit(n, d); } });
    this.group.add(this.interactions.group);
    this.ambient = new Ambient({ world, mat, quality, bounds: this.bounds, audio, skep: this.skep });
    this.group.add(this.ambient.group);
    // a night that glows: the light field, kindling, haloes, glowing blooms, fireflies
    this.night = new Night({ world, quality, mat, upgrade: this.upgrade, interactions: this.interactions, growth: this.growth, bells: this.bells, group: this.group });
    this.upgrade.swap(world.sky.mesh, 'material', world.sky.exploreMaterial);
    // every lit material in the house takes the light field while exploring
    const extra = this.upgrade.swaps.filter((x) => x.prop === 'material').map((x) => x.explore);
    extra.push(this.upgrade.fernMat, this.upgrade.fernMatIn, this.upgrade.palmMatIn, this.nearfield.matLeaf, this.nearfield.matIvy, this.nearfield.coreMat);
    lightFieldAll([scene], extra, quality.tier === 'low' ? 4 : 8);
    this.lf = LF; // (review hooks: __cg.explore().lf)
    if (sync) this.nearfield.finish();
    this.bells.onRing = (b, k) => {
      this.audio?.bell(b.note, 0.045 * k, clamp((b.pivot.x - this.camera.position.x) * 0.02, -0.8, 0.8));
      this.stats.bells++;
      this._emit('bell', b);
    };

    const w = world;
    this.cull = new DetailCull([w.flower.group, w.crown.group, w.escapement.group, w.roots.group, w.skep.group, w.pods.group, w.lily.group, w.blossom.group, w.reed.group, w.tree.group, w.garden.group, this.bells.group]);
    for (const c of this.ambient.group.children) this.cull.addGroup(c, 3);
    this.actor = new BeeActor({ bee: world.creatures.hero, bounds: this.bounds, skep: this.skep, events: (n, d) => this._actorEvent(n, d) });
    // APX-9's recent path (explore clock) for the wing-wash on the foliage
    this.trail = new WashTrail();
    this.wash = { reset: () => this.trail.reset(), record: (t, a) => this.trail.record(t, a.pos, this._wing()) };
    this.pilot = new Pilot({ bounds: this.bounds, world, skep: this.skep });
    this.chase = new ChaseCam(this.bounds);
    this.follow = new FollowCam(this.bounds);
    this.photoCam = new PhotoCam(this.bounds);
    this.view = { pos: V(), target: V(), fov: 50, roll: 0, focus: 10, aperture: 0 };
    this.stats = { pollinated: 0, deposits: 0, winds: 0, lanterns: 0, bells: 0 };
    // start APX-9 on its landing board
    this.actor.place(this.skep.board.clone(), Math.atan2(out.x, out.z), 'fly');
    this.actor.state = 'walk-out';
    this.actor.seq = { dur: 0.01, from: this.skep.board.clone(), to: this.skep.board.clone() };
  }

  on(name, fn) { (this.listeners[name] ||= []).push(fn); }
  _emit(name, data) { for (const fn of this.listeners[name] || []) fn(data, this); }

  _actorEvent(name, data) {
    if (name === 'touchdown') {
      this.interactions.touchdown(data, this.mode === 'fly' ? 'player' : 'apx9');
      if (!this.interactions._counted?.has(data.id)) { (this.interactions._counted ||= new Set()).add(data.id); this.stats.pollinated++; }
    }
    if (name === 'deposit') {
      this.interactions.deposit(data.amount, this.mode === 'fly' ? 'player' : 'apx9');
      this.ambient.onDeposit();
      this.stats.deposits++;
    }
    this._emit('actor', { name, data });
  }

  // ---- mode switching ------------------------------------------------------------------
  enter(mode) {
    const prev = this.mode;
    this.mode = mode;
    if (!this.active) {
      this.active = true;
      this.group.visible = true;
      const C = this.world.creatures;
      // hide the film's cast; APX-9 stays (the explore controller drives it)
      for (const c of C.group.children) c.visible = c === C.hero.group;
      C.hero.group.visible = true;
      this.world.setFarShadows(false);
      // remember the practical lights' film settings
      const Lg = this.world.lighting;
      this._lightSave = ['pulse', 'skep', 'spark', 'fill'].map((k) => [k, Lg[k].color.clone(), Lg[k].distance, Lg[k].decay]);
      // the film's sculpting beam: no shadow pass while exploring
      this.world.lighting.beam.shadow.autoUpdate = false;
      this.interactions.install();
      this.upgrade.apply(true);
      this.pipeline.scenePass.material.uniforms.uSteps.value = this.quality.tier === 'high' ? 36 : Math.min(30, this.quality.dofSteps);
      this.world.atmosphere.shaftUniforms.uInside.value = 1;
      this.world.atmosphere.shaftUniforms.uNear.value.set(60, 300);
      this.follow.reset(this.actor);
      setLightField(true);
    }
    if (mode === 'fly' && prev !== 'fly') {
      // take over from wherever APX-9 is, looking the way it faces
      this.chase.reset(this.actor, this.actor.yaw, -0.12);
      this.pilot.route = null;
      this.pilot.goal = null;
    }
    if (mode === 'follow' && prev !== 'follow') {
      this.follow.reset(this.actor);
      this.pilot.route = null;
      this.pilot.goal = null;
    }
  }

  // compile every material's light-field variant in the background (parallel
  // shader compile), so flying somewhere new never hitches; main.js calls it
  // once the page is up and an interactive mode is showing
  // (without KHR_parallel_shader_compile a program compiles when first drawn, as before)
  compileAll() {
    if (this._compiled || !this.active) return;
    this._compiled = true;
    const r = this.renderer;
    if (r.extensions.has('KHR_parallel_shader_compile')) r.compileAsync(this.scene, this.camera).catch(() => {});
  }

  exit() {
    if (!this.active) return;
    this.active = false;
    this.photo = false;
    this.group.visible = false;
    this.interactions.uninstall();
    this.upgrade.apply(false);
    this.cull.restore();
    const Lg = this.world.lighting;
    Lg.beam.shadow.autoUpdate = true;
    Lg.beam.shadow.needsUpdate = true;
    for (const [k, c, d, dc] of this._lightSave || []) { Lg[k].color.copy(c); Lg[k].distance = d; Lg[k].decay = dc; Lg[k].intensity = 0; }
    this.pipeline.scenePass.material.uniforms.uSteps.value = this.quality.dofSteps;
    this.world.atmosphere.shaftUniforms.uInside.value = 0;
    this.world.atmosphere.shaftUniforms.uNear.value.set(25, 190);
    this.night.exit();
    setLightField(false);
    if (this.swapFade) this._finishSwap();
    // the film re-derives creature visibility and every world state from t
  }

  // spawn for a fresh flight: hovering just out of the skep, facing the bloom
  spawnAtSkep() {
    const s = this.skep;
    const p = s.board.clone().addScaledVector(s.out, 9).add(V(0, 4, 0));
    const head = this.world.flower.head.getWorldPosition(V());
    const yaw = Math.atan2(head.x - p.x, head.z - p.z);
    this.actor.place(p, yaw, 'fly');
    this.chase.reset(this.actor, yaw, -0.08);
  }

  get worldTime() { return WORLD_T0 + this.clock; }

  // the hour glides to its new value (TimeOfDay.step); `tod.value = x` jumps
  setTime(v) { this.tod.target = clamp(v, 0, 1); this._emit('time', this.tod.target); }
  cycleTime() {
    const v = this.tod.target;
    const i = TIMES.findIndex((x) => x > v + 0.02);
    const stop = STOPS[i < 0 ? 0 : i];
    this.setTime(stop.v);
    this._emit('hint', stop.name);
  }

  // the bee-scale planting has dissolved in: the film's foliage it replaces goes
  _finishSwap() {
    this.swapFade = null;
    FADE.uSwapK.value = 1;
    this.upgrade.replace();
    if (this.scenery.endDomes) this.scenery.endDomes.visible = false;
  }

  togglePhoto(on = !this.photo) {
    this.photo = on;
    if (on) this.photoCam.from(this.view);
    this._emit('photo', on);
  }

  // ---- per frame -------------------------------------------------------------------------------------
  // input: a frame from Input (or null when no interaction, e.g. under the landing screen)
  update(dt, input) {
    dt = Math.min(dt, 1 / 20);
    const simDt = this.photo ? 0 : dt;
    this.clock += simDt;
    const a = this.actor;
    // intent
    let intent = { vel: V(), face: null, boost: false, lift: 0 };
    if (this.photo) {
      // the world holds still for the photographer
    } else if (this.mode === 'fly' && input) {
      intent = this._playerIntent(input);
    } else if (this.mode !== 'fly') {
      intent = this.pilot.step(simDt, a, { isPollinated: (l) => this.interactions.isPollinated(l), wind: (s) => this.interactions.windUp(s), windBusy: () => this.interactions.windBusy() });
    }
    if (simDt > 0) a.step(simDt, intent);
    a.apply(this.reduced);
    if (simDt > 0) this.trail.record(this.clock, a.pos, this._wing());
    // triggers the bee can set off by flying into things
    if (simDt > 0) this._triggers();
    this._dt = simDt;
    this._input = input;
  }

  // how hard the wings are working (the wash): beating wings, a little from the body when still
  _wing() {
    const a = this.actor;
    return clamp(0.25 + 0.75 * (a.flap ?? 1));
  }

  _playerIntent(input) {
    const a = this.actor;
    const c = this.chase;
    // the bee flies where you look: thrust along the view (left/right input
    // arrives as turning, so move.x is only non-zero from other sources)
    const f = lookDir(c.yaw, c.pitch * 0.85, V());
    const right = V(-Math.cos(c.yaw), 0, Math.sin(c.yaw));
    const boost = input.boost && input.move.y > 0.1;
    const sp = boost ? SPEED.boost : SPEED.cruise;
    const vel = f.multiplyScalar(input.move.y * sp).addScaledVector(right, input.move.x * sp * 0.75);
    vel.y += input.lift * SPEED.climb;
    if (a.state === 'landed' && a.stateT > 0.4 && (input.lift > 0.2 || Math.abs(input.move.y) > 0.3 || Math.abs(input.move.x) > 0.3)) {
      a.takeoff();
      if (!a.gather?.done) this._hud?.flashHint('Took off early — part of the pollen gathered', 2.5);
    }
    if (a.state === 'grounded' && input.lift > 0.2) vel.y = Math.max(vel.y, 8);
    // face the view direction (bees hover and strafe without turning)
    return { vel, face: c.yaw, boost, lift: input.lift };
  }

  _triggers() {
    const a = this.actor;
    if (a.busy) return;
    const p = a.pos;
    // the skep door
    const door = this.skep.entrance.clone().addScaledVector(this.skep.out, 1.2);
    const dDoor = p.distanceTo(door);
    if (dDoor < 6.5 && a.state === 'fly') {
      if (a.pollen > 0.05) { if (this.mode === 'fly') a.dock(); }
      else if (this.mode === 'fly' && (this._doorHint ?? -10) < this.clock - 6) { this._doorHint = this.clock; this._emit('hint', 'The skep is waiting for pollen: visit some blooms first'); }
    }
    // winding: touch the escapement
    const esc = L.escapement.clone().add(V(0, 1.2, 0));
    if (p.distanceTo(esc) < 6.5 && (this.mode === 'fly' || this.pilot.goal?.kind === 'wind')) {
      if (this.interactions.windUp(this.mode === 'fly' ? 'player' : 'apx9')) this.stats.winds++;
    }
    // settle on a bloom (fly mode: descend gently onto it)
    if (this.mode === 'fly' && a.state === 'fly') {
      const l = this.bounds.nearestLandable(p, 16);
      this.candidate = null;
      if (l) {
        const dh = Math.hypot(l.spot.x - p.x, l.spot.z - p.z);
        const dy = p.y - l.spot.y;
        const near = dh < l.radius + 2.5 && dy > -1.5 && dy < 9;
        if (near) this.candidate = l;
        const input = this._input;
        const descending = (input?.lift ?? 0) < -0.2 || a.vel.y < -1.5;
        const slow = a.speed < 18;
        if (near && slow && dh < l.radius + 0.8 && dy < 5 && (descending || (a.speed < 5 && dy < 3)) && (input?.lift ?? 0) <= 0.1) {
          a.land(l);
          this.candidate = null;
        }
      }
    } else this.candidate = null;
  }

  // ---- render ------------------------------------------------------------------------------
  render(dtReal = 1 / 60) {
    const t = this.worldTime;
    this.tod.step(dtReal);
    if (this.swapFade) {
      this.swapFade.k += dtReal / 0.6;
      FADE.uSwapK.value = smooth(clamp(this.swapFade.k));
      if (this.swapFade.k >= 1) this._finishSwap();
    }
    const ctx = this.tod.context(t, this.pixelRatio);
    const phases = this.tod.phases();
    // light shafts thin out as the camera rises into them under the glazing
    ctx.shaftGain = 1 - 0.8 * clamp((this.camera.position.y - 190) / 150);
    const a = this.actor;
    const dt = this._dt ?? 0;
    const body = { pos: a.pos, vel: a.vel, speed: a.speed, flying: a.state === 'fly', yaw: a.yaw, landedOn: a.state === 'landed' || a.state === 'landing' ? (a.state === 'landed' ? a.lastLanding : a.seq?.landable) : null };
    // the breeze runs on the explore clock; APX-9's wash follows its trail
    setWindTime(t);
    const clock = this.clock;
    setWash((age, out) => this.trail.at(clock - age, out), a.pos, 1.9);
    this.interactions.pre(this.clock, dt, ctx, [body]);
    this.night.pre(ctx, phases, this.clock);
    this.world.update(t, ctx);
    this.world.lighting.baseSun = this.world.lighting.sun.intensity;
    this.growth.update(this.clock, body);
    this.bells.update(this.clock, dt, [body]);
    this.interactions.post(dt, [body], ctx, this.mode === 'fly' ? this.candidate : null);
    this.scenery.update(t, ctx, this.camera);
    // camera
    const input = this._input;
    let v;
    if (this.debugView) {
      const d = this.debugView;
      v = { pos: d.pos, target: d.target, fov: d.fov ?? 50, roll: 0, focus: d.pos.distanceTo(d.target), aperture: d.aperture ?? 0 };
    } else if (this.photo) v = this.photoCam.update(dtReal, input || this._noInput());
    else if (this.mode === 'fly') v = this.chase.update(dtReal, a, input, this.reduced);
    else v = this.follow.update(dtReal, a, this.mode === 'follow' ? input : null, { reduced: this.reduced, skep: this.skep });
    this.view = { pos: v.pos.clone(), target: v.target.clone(), fov: v.fov, roll: v.roll || 0, focus: v.focus, aperture: v.aperture };
    applyPose(this.camera, { pos: v.pos, target: v.target, fov: v.fov, roll: v.roll || 0 }, this.aspect, 0.05, 9000);
    // the camera pushes the foliage aside (and nothing comes inside the lens)
    setCamera(this.camera.position, 5.5, 1.5, this.debugView || this.photo ? null : a.pos);
    this.nearfield.update(this.camera);
    this.cull.update(this.camera, this.renderer.getDrawingBufferSize(this._vp || (this._vp = new THREE.Vector2())).y);
    this.frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
    if (dt > 0) this.ambient.update(dt, body, this.camera, this.frustum);
    // light: shadows round what we're looking at, practicals
    const fwd = this.camera.getWorldDirection(V());
    const center = this.debugView ? v.target.clone() : a.pos.clone().lerp(this.camera.position, 0.3).addScaledVector(fwd, 14);
    this.focus.center.copy(center);
    this.focus.radius = this.debugView?.shadowRadius ?? (this.quality.tier === 'low' ? 55 : 70);
    this.tod.apply(this.scene, this.world, this.focus, this.camera);
    this._practicals(ctx);
    // the night: the light field's sources, haloes, glows, fireflies (after the camera is placed)
    this.camera.updateMatrixWorld();
    GLOW.uGlowT.value = this.clock;
    GLOW.uGlassGlow.value.set(1.0, 0.62, 0.32, 0.02 + 0.14 * phases.blooms);
    this.growth.petals.material.emissiveIntensity = 0.08 + 0.5 * phases.blooms;
    this.night.post(dt, this.camera, { pos: a.pos, vel: a.vel, speed: a.speed, boost: a.boostK || 0 }, this.pixelRatio, ctx);
    const look = { ...this.tod.look(), time: t, sunDir: SUN_DIR, fade: 0 };
    this.pipeline.render({ camera: this.camera, focus: v.focus, aperture: this.quality.dof ? v.aperture : 0 }, null, 0, look);
    // audio follows the bee
    if (this.audio?.enabled) {
      const near = 1 / (1 + Math.max(0, this.camera.position.distanceTo(a.pos) - 6) / 14);
      this.audio.frame({ flap: a.flap, speed: a.speed, boost: a.boostK, collect: a.collect || 0, near, tod: this.tod.value });
    }
  }

  // ---- interface state --------------------------------------------------------------------------
  hudState() {
    const a = this.actor;
    return {
      pollen: a.pollen,
      honey: this.interactions.honey,
      arrow: this.mode === 'fly' && !this.photo && a.pollen > 0.3 && !a.busy ? this._arrow() : null,
      photo: this.photo,
      photoText: this.touch ? 'Photo mode · drag to look, joystick to move' : 'Photo mode · drag/WASD to frame · wheel to zoom · Enter saves · P exits',
      hint: this.photo ? '' : this.standingHint(),
    };
  }

  // a chevron at the screen edge pointing home to the skep when it's out of view
  _arrow() {
    const p = this.skep.entrance.clone().project(this.camera);
    const behind = this.camera.getWorldDirection(V()).dot(this.skep.entrance.clone().sub(this.camera.position)) < 0;
    if (!behind && Math.abs(p.x) < 0.92 && Math.abs(p.y) < 0.92) return null;
    let x = p.x, y = p.y;
    if (behind) { x = -x; y = -y; }
    const a = Math.atan2(-y, x);
    const w = window.innerWidth, h = window.innerHeight;
    const k = 1 / Math.max(Math.abs(x) / 0.86, Math.abs(y) / 0.8, 1e-3);
    return { x: (x * k * 0.5 + 0.5) * w - 14, y: (-y * k * 0.5 + 0.5) * h - 14, a };
  }

  standingHint() {
    const a = this.actor, s = a.state, touch = this.touch;
    if (this.mode !== 'fly') return this.pilot.status ? `APX-9 is ${this.pilot.status}` : 'APX-9 is going about its day';
    if (s === 'landed') {
      if (a.gather && !a.gather.done) return 'Gathering pollen…';
      if (a.pollen > 0.97) return `Full. ${touch ? 'Press ▲' : 'Space'} to take off and carry it home to the skep`;
      return `Gathered. ${touch ? 'Press ▲' : 'Space'} to take off`;
    }
    if (s === 'grounded') return `Resting on the ground. ${touch ? 'Press ▲' : 'Space'} to fly`;
    if (s === 'docking' || s === 'walk-in' || s === 'inside') return 'Depositing pollen in the skep…';
    if (s === 'walk-out' || s === 'takeoff') return '';
    if (this.candidate) return `Settle on ${this.candidate.name}: ${touch ? 'press ▼ to' : 'descend gently to'} land`;
    if (a.pollen > 0.97) return 'Your pollen baskets are full: carry them home to the skep';
    if (a.pollen > 0.3) return 'Carry the pollen home to the skep, or gather more';
    if (this.interactions.honey === 0 && this.stats.pollinated === 0) return 'Fly to a bloom and settle on it to gather pollen';
    const tips = [
      'Touch the escapement beside the great bloom to wind the garden',
      'Brush the porcelain bellflowers to ring them',
      'Fly through the armillary rings above the fountain',
      'The lanterns under the vault kindle as you pass',
      touch ? 'The menu changes the hour and takes photographs' : 'T changes the hour · P takes photographs',
      touch ? 'Autopilot hands APX-9 back to its day' : 'C hands APX-9 back to its autopilot',
    ];
    return tips[Math.floor(this.clock / 9) % tips.length];
  }

  _noInput() {
    return { move: { x: 0, y: 0 }, lift: 0, look: { dx: 0, dy: 0 }, orbit: { dx: 0, dy: 0 }, zoom: 1, boost: false, actions: [] };
  }

  _practicals(ctx) {
    const Lg = this.world.lighting;
    const a = this.actor;
    // the skep glows from its doorway
    Lg.skep.position.copy(this.skep.entrance).add(V(0, 0.5, 0)).addScaledVector(this.skep.out, 0.8);
    Lg.skep.intensity = (3.5 + (ctx.skepFlare || 0) * 10) * (1.2 - this.tod.value * 0.4);
    Lg.skep.distance = 26;
    // APX-9's pollen load casts a little amber on what it lands on
    Lg.fill.color.set('#ffb35a');
    Lg.fill.position.copy(a.pos).add(V(0, -0.6, 0));
    Lg.fill.intensity = a.pollen * 1.4 + (a.collect || 0) * 1.2;
    Lg.fill.distance = 7;
    Lg.fill.decay = 2;
    // every lantern, lamp and glow lights the garden through the light field
    // (night.js), so the old single nearest-lantern light is off
    Lg.spark.intensity = 0;
  }
}
