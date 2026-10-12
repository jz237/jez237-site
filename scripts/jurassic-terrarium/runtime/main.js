// Jurassic Terrarium: the dinosaur module for Weatherglass.
//
// Registers itself with window.__wg.addModule, so it is updated and rendered inside Weatherglass's
// own loop (after the vegetation and wildlife, before the clouds). Models are rigged GLBs built in
// Blender (scripts/jurassic-terrarium/blender); each comes with a JSON sidecar describing its size,
// gait speeds and clips.
import { Group, Object3D, Vector3, AnimationMixer, LoopOnce, LoopRepeat, MathUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { NavGrid } from './nav.js';
import { Guide } from './ui.js';
import { Flora } from './flora.js';
import { Voices } from './voice.js';
import { Flex } from './flex.js';
import { Lamps } from './lamps.js';
import { Aquatic } from './aquatic.js';
import { Room } from './room.js';

// One terrarium unit is 5.5 m: the 18 x 8 unit floor is a 100 x 44 m valley. Like a museum diorama,
// the animals are shown large against the landscape (Weatherglass pines become 6-8 m saplings).
export const METRES_PER_UNIT = 5.5;
const S = 1 / METRES_PER_UNIT;
// The den: must match DEN in tools/build-page.mjs (the terrain shelf under it).
const DEN = window.__jtDen || { x: 5.4, z: -1.55, hx: 1.25, hz: 0.95, y: 0.66, s: 1 / 6.2 };

// Species in the case. 'ready' species are loaded; the rest show in the field guide as hatching soon.
const SPECIES = [
  {
    id: 'trex', ready: true, count: 1, clearance: 0.1, maxWater: 0.7, maxSlope: 0.32, predator: true, den: true, gaitSwing: 0.035,
    acts: { wander: 5, sniff: 2, roar: 1, drink: 1, hunt: 2 },
    sounds: { roar: 'roar', sniff: 'sniff', idle: 'boom' }, step: 3, feet: [0, 0.5],
    common: 'Tyrannosaurus', badge: 'predator', dot: '#8a6a45',
    era: 'Late Cretaceous, 68–66 million years ago · western North America',
    size: '12.3 m long, hips 3.1 m high', mass: 'about 8 tonnes', diet: 'meat: hadrosaurs, Triceratops',
    fact: 'The strongest bite of any land animal. A 2023 study of teeth and jaws suggests scaly lips covered the teeth when the mouth was shut, as in lizards.',
  },
  {
    id: 'triceratops', ready: true, count: 3, clearance: 0.07, maxWater: 0.6, maxSlope: 0.3, herd: true, flex: 0.75, gaitSwing: 0.05,
    acts: { wander: 3, graze: 4, drink: 1, alert: 1, threat: 1 }, standsGround: 0.45,
    sounds: { alert: 'grunt', threat: 'bellow' }, step: 2, feet: [0, 0.22, 0.5, 0.72],
    common: 'Triceratops', badge: 'herd', dot: '#7d6a4f',
    era: 'Late Cretaceous, 68–66 million years ago · western North America',
    size: '8.5 m long', mass: 'about 8 tonnes', diet: 'low plants, cropped with a parrot-like beak',
    fact: 'Healed Tyrannosaurus bite marks have been found on Triceratops frills and horns: some survived the attacks.',
  },
  {
    id: 'stegosaurus', ready: true, count: 2, clearance: 0.06, maxWater: 0.6, maxSlope: 0.3, herd: true,
    acts: { wander: 3, graze: 4, drink: 1, alert: 1, tailswing: 1 },
    sounds: { alert: 'grunt', tailswing: 'hiss' }, step: 1.4, feet: [0, 0.25, 0.5, 0.75],
    common: 'Stegosaurus', badge: 'browser', dot: '#a5603a',
    era: 'Late Jurassic, 155–150 million years ago · western North America',
    size: '6.5 m long', mass: 'about 3.5 tonnes', diet: 'ferns, cycads and other low plants',
    fact: 'Its 17 plates alternate in two rows. An Allosaurus tail bone has been found pierced by a Stegosaurus tail spike.',
  },
  {
    id: 'brachiosaurus', ready: true, count: 1, clearance: 0.16, maxWater: 0.75, maxSlope: 0.28, noRun: true, tooBig: true, flex: 0.8, gaitSwing: 0.03,
    acts: { wander: 3, browse: 4, drink: 1, alert: 1 },
    sounds: { alert: 'rumble', browse: 'rumble' }, step: 6, feet: [0, 0.25, 0.5, 0.75],
    common: 'Brachiosaurus', badge: 'giant', dot: '#7a7866',
    era: 'Late Jurassic, 154–153 million years ago · western North America',
    size: '22 m long, head about 10 m up', mass: 'about 30 tonnes', diet: 'treetops: conifers, ginkgos, tree ferns',
    fact: 'Its front legs were longer than its back legs, so it stood like a giraffe and could feed higher than any other animal of its time.',
  },
  {
    id: 'pteranodon', ready: true, count: 2, flyer: true,
    common: 'Pteranodon', badge: 'flying reptile', dot: '#b8432a',
    era: 'Late Cretaceous, 86–84 million years ago · over the Western Interior Seaway',
    size: 'wingspan 6 m', mass: 'about 30 kg', diet: 'fish, caught at the sea surface',
    fact: 'Not a dinosaur but a pterosaur: a flying reptile on wings of skin stretched from one enormously long finger to the ankle.',
  },
];

const params = new URLSearchParams(location.search);
const rand = mulberry32(Number(params.get('seed') || 20261011));

class Dino {
  constructor(mod, sp, info, gltf, idx) {
    this.mod = mod;
    this.sp = sp;
    this.info = info;
    this.root = new Object3D();
    this.root.name = `${sp.id}-${idx}`;
    this.model = cloneSkinned(gltf.scene);
    this.model.scale.setScalar(S);
    this.root.add(this.model);
    this.skins = [];
    this.model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = false;
        if (o.material?.roughnessMap) {
          o.material = o.material.clone(); // per-animal, so wetness can differ
          this.skins.push(o.material);
        }
      }
    });
    this.mixer = new AnimationMixer(this.model);
    this.actions = {};
    for (const clip of gltf.animations) {
      const a = this.mixer.clipAction(clip);
      const ci = info.clips[clip.name] || {};
      if (ci.loop === false) {
        a.setLoop(LoopOnce, 1);
        a.clampWhenFinished = true;
      } else a.setLoop(LoopRepeat, Infinity);
      this.actions[clip.name] = a;
    }
    this.layer = mod.layers[sp.id];
    const nav = mod.nav;
    const p = this.layer.randomOpen(rand, (x, z, k) => nav.slope[k] < 0.18 && nav.water[k] < 0.1);
    this.pos = new Vector3(p.x, 0, p.z);
    this.heading = rand() * Math.PI * 2;
    this.speed = 0;
    this.state = 'idle';
    this.timer = 2 + rand() * 4;
    this.path = null;
    this.current = null;
    this.play('idle', 0);
    this.length = info.length * S;
    this.height = (info.height || 3) * S;
    this.flex = new Flex(this.model, { flex: sp.flex ?? 1 });
    // the hips and the chest press the ferns aside as the animal pushes through
    this.pushBones = [this.flex.spine[this.flex.spine.length - 1], null].filter(Boolean);
    this.model.traverse((o) => o.isBone && o.name === 'pelvis' && this.pushBones.unshift(o));
    this.pushR = Math.max(0.12, (info.length || 6) * S * 0.16);
    this.segLen = this.length / Math.max(6, this.flex.spine.length + this.flex.neck.length + this.flex.tail.length + 2);
    this.prevHeading = this.heading;
    this.glance = null;
    this.glanceT = 2 + rand() * 4;
    this.followRadius = Math.max(1.0, this.length * 1.6);
    this.pickRadius = Math.max(this.length, this.height) * 0.35;
    this._pp = [new Vector3(), new Vector3(), new Vector3()];
  }

  pickPoints() {
    const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
    const p = this.root.position, h = this.height * 0.7, l = this.length * 0.3;
    this._pp[0].set(p.x, p.y + h, p.z);
    this._pp[1].set(p.x + fx * l, p.y + h, p.z + fz * l);
    this._pp[2].set(p.x - fx * l, p.y + h * 0.8, p.z - fz * l);
    return this._pp;
  }

  play(name, fade = 0.4, timeScale = 1) {
    const a = this.actions[name];
    if (!a || this.current === a) {
      if (a) a.timeScale = timeScale;
      return a;
    }
    a.reset();
    a.timeScale = timeScale;
    a.enabled = true;
    a.setEffectiveWeight(1);
    if (this.current && fade > 0) a.crossFadeFrom(this.current, fade, false);
    else if (this.current) this.current.stop();
    a.play();
    this.current = a;
    this.currentName = name;
    return a;
  }

  clipSpeed(name) {
    return (this.info.clips[name]?.speed || 1) * S;
  }

  // choose the next activity by weight, using only clips this model has
  chooseAct() {
    const acts = this.sp.acts || { wander: 1 };
    const prey = this.mod.walkers?.some((d) => !d.sp.predator && !d.sp.tooBig);
    const opts = Object.entries(acts).filter(
      ([k]) => k === 'wander' || k === 'drink' || (k === 'hunt' && prey) || this.actions[k],
    );
    let tot = opts.reduce((a, [, w]) => a + w, 0);
    let r = rand() * tot;
    for (const [k, w] of opts) if ((r -= w) <= 0) return k;
    return 'wander';
  }

  goTo(x, z, then = null, gait = 'walk') {
    const path = this.layer.path(this.pos.x, this.pos.z, x, z);
    if (!path || path.length < 2) return false;
    this.path = path;
    this.pathIdx = 1;
    this.state = 'walk';
    this.gait = this.actions[gait] && !(gait === 'run' && this.sp.noRun) ? gait : 'walk';
    this.then = then;
    return true;
  }

  // long animals stop well inside the case, so a turning head or tail stays off the glass
  clearOfGlass(x, z) {
    const b = this.mod.ctx.box, m = this.length * 0.5 + 0.15;
    return Math.abs(x) < b.halfW - m && Math.abs(z) < b.halfD - m;
  }

  inDen() {
    const d = this.mod.den;
    return Math.abs(this.pos.x - d.x) < d.hx * 0.7 && Math.abs(this.pos.z - d.z) < d.hz * 0.8;
  }

  goDen() {
    const d = this.mod.den;
    if (!this.goTo(d.inside.x, d.inside.z, () => {
      this.state = 'turn';
      this.turnTo = 0; // face +z: out of the mouth, towards the glass
    })) this.timer = 2;
  }

  oneShot(name, fade = 0.4) {
    const a = this.actions[name];
    if (!a) return false;
    const snd = this.sp.sounds?.[name];
    if (snd) this.mod.voice.play(snd, this.root.position, this.sp.step || 1);
    this.state = 'oneshot';
    this.play(name, fade);
    this.timer = a.getClip().duration - fade * 0.5;
    return true;
  }

  rest(fade = 0.6) {
    this.state = 'idle';
    this.play('idle', fade);
    this.timer = 2 + rand() * 5;
  }

  update(dt, env) {
    this.timer -= dt;
    const mod = this.mod;
    const night = env.night > 0.6;
    // rain darkens and glosses the skin; it dries slowly afterwards
    const wantWet = Math.min(1, env.rain * 1.5 + env.wet * 0.6);
    this.wet = (this.wet || 0) + (wantWet - (this.wet || 0)) * Math.min(1, dt * (wantWet > (this.wet || 0) ? 0.5 : 0.08));
    for (const m of this.skins) {
      m.roughness = 1 - 0.45 * this.wet;
      m.color.setScalar(1 - 0.22 * this.wet);
    }
    // a lightning strike close by: flinch and run from it
    const bolt = mod.bolt;
    if (bolt && bolt.t > (this.lastBolt || 0) && this.state !== 'sleep') {
      this.lastBolt = bolt.t;
      const dd = Math.hypot(bolt.x - this.pos.x, bolt.z - this.pos.z);
      if (dd < 2.5) {
        const k = 2.6 / Math.max(dd, 0.05);
        const t = this.layer.nearestOpen(this.pos.x + (this.pos.x - bolt.x) * k, this.pos.z + (this.pos.z - bolt.z) * k);
        if (t && this.goTo(t.x, t.z, null, 'run')) {
          this.state = 'flee';
          const call = this.sp.sounds?.alert || this.sp.sounds?.roar;
          if (call) mod.voice.play(call, this.root.position, this.sp.step || 1);
        }
      }
    }
    // herbivores watch the predator: alert when it is near, run when it is close
    if (!this.sp.predator && mod.predator && this.state !== 'flee' && this.state !== 'sleep') {
      const p = mod.predator.pos;
      const dd = Math.hypot(p.x - this.pos.x, p.z - this.pos.z);
      const charging = mod.predator.state === 'hunt' && mod.predator.prey === this;
      if ((dd < 1.6 || (charging && dd < 2.6)) && !night) {
        if (charging && this.sp.standsGround && this.actions.threat && rand() < this.sp.standsGround) {
          // face the predator and present the horns
          this.heading = Math.atan2(p.x - this.pos.x, p.z - this.pos.z);
          this.oneShot('threat', 0.25);
          this.state = 'standoff';
          this.timer = this.actions.threat.getClip().duration;
          mod.predator.deterred = this;
          return this.finish(dt);
        }
        const ax = this.pos.x - p.x, az = this.pos.z - p.z;
        const k = 2.5 / Math.max(dd, 0.01);
        const t = this.layer.nearestOpen(this.pos.x + ax * k, this.pos.z + az * k);
        if (t && this.goTo(t.x, t.z, null, 'run')) this.state = 'flee';
      } else if (dd < 3 && this.state === 'idle' && this.actions.alert && rand() < dt * 0.3) this.oneShot('alert');
    }
    switch (this.state) {
      case 'standoff':
        if (this.timer <= 0) this.rest(0.6);
        break;
      case 'hunt':
        this.huntStep(dt);
        break;
      case 'idle':
        if ((night || env.storm > 0.6) && this.sp.den && !this.inDen()) {
          this.goDen();
          break;
        }
        if (night || (this.sp.den && env.storm > 0.6)) {
          this.state = 'sleep';
          this.play('rest', 1.5);
          break;
        }
        if (this.timer <= 0) this.act(this.chooseAct());
        break;
      case 'oneshot':
        if (this.timer <= 0) this.rest(0.6);
        break;
      case 'sleep':
        if (!night && !(this.sp.den && env.storm > 0.6)) this.rest(1.5);
        break;
      case 'turn': {
        // turn on the spot (small steps) to face the den's mouth
        let dh = Math.atan2(Math.sin(this.turnTo - this.heading), Math.cos(this.turnTo - this.heading));
        this.heading += Math.sign(dh) * Math.min(Math.abs(dh), dt * 0.7);
        this.play('walk', 0.4);
        if (this.current) this.current.timeScale = 0.45;
        if (Math.abs(dh) < 0.05) {
          this.state = 'sleep';
          this.play('rest', 1.2);
        }
        break;
      }
      case 'walk':
      case 'flee':
        this.walkStep(dt);
        break;
    }
    this.finish(dt);
  }

  finish(dt) {
    this.place();
    this.mixer.update(dt);
    if (dt > 0) {
      let dh = this.heading - this.prevHeading;
      dh = Math.atan2(Math.sin(dh), Math.cos(dh));
      this.prevHeading = this.heading;
      const moving = this.state === 'walk' || this.state === 'flee' || this.state === 'hunt';
      this.flex.update(dt, {
        turnRate: dh / dt,
        speed: moving ? this.speed : 0,
        segLen: this.segLen,
        look: this.lookTarget(dt),
        calm: moving ? 0.35 : this.state === 'sleep' ? 0.15 : 1,
        gait: this.gaitWave(),
      });
    }
    this.sounds(dt);
  }

  // the stride phase of the walk or run clip, for the trunk's sideways swing (heavier animals swing less)
  gaitWave() {
    const a = this.current, name = this.currentName;
    if (!a || (name !== 'walk' && name !== 'run') || this.sp.flyer) return null;
    const d = a.getClip().duration;
    const amp = (this.sp.gaitSwing ?? 0.06) * Math.min(1, this.speed / Math.max(0.01, this.clipSpeed('walk')) + 0.3);
    return { phase: (a.time % d) / d, amp: amp * (name === 'run' ? 0.6 : 1) };
  }

  // what the animal is watching: the hunter for prey, the prey for the hunter, otherwise now and
  // then a neighbour; returned as yaw/pitch relative to the body
  lookTarget(dt) {
    const mod = this.mod;
    let tgt = null;
    if (this.state === 'sleep' || this.state === 'oneshot') return null;
    if (this.sp.predator && this.prey) tgt = this.prey;
    else if (!this.sp.predator && mod.predator) {
      const p = mod.predator;
      if (Math.hypot(p.pos.x - this.pos.x, p.pos.z - this.pos.z) < 3.2 && p.state !== 'sleep') tgt = p;
    }
    if (!tgt) {
      this.glanceT -= dt;
      if (this.glanceT <= 0) {
        this.glanceT = 3 + rand() * 6;
        const near = (mod.walkers || []).filter(
          (d) => d !== this && Math.hypot(d.pos.x - this.pos.x, d.pos.z - this.pos.z) < 3.5,
        );
        this.glance = rand() < 0.6 && near.length ? near[Math.floor(rand() * near.length)] : null;
        this.glanceUntil = 1.5 + rand() * 2.5;
      }
      if (this.glance) {
        this.glanceUntil -= dt;
        if (this.glanceUntil > 0) tgt = this.glance;
      }
    }
    if (!tgt) return null;
    const dx = tgt.pos.x - this.pos.x, dz = tgt.pos.z - this.pos.z;
    let yaw = Math.atan2(dx, dz) - this.heading;
    yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
    if (Math.abs(yaw) > 2.2) return null; // behind: it would have to turn round
    const dist = Math.hypot(dx, dz);
    const dy = (tgt.height || 0) * 0.6 - this.height * 0.6;
    return { yaw, pitch: -Math.atan2(dy, Math.max(dist, 0.2)) * 0.5 };
  }

  // stalk the prey, then charge; give up after a while, or when it stands its ground
  huntStep(dt) {
    const prey = this.prey;
    this.huntT -= dt;
    if (!prey || this.huntT <= 0 || this.deterred) {
      const near = this.deterred;
      this.prey = null;
      this.deterred = null;
      if (near) this.heading = Math.atan2(near.pos.x - this.pos.x, near.pos.z - this.pos.z);
      this.speed = 0;
      this.oneShot('roar', 0.3) || this.rest(0.5);
      return;
    }
    const d = Math.hypot(prey.pos.x - this.pos.x, prey.pos.z - this.pos.z);
    this.replan -= dt;
    if (this.replan <= 0 || !this.path) {
      this.replan = 1.2;
      const t = this.layer.nearestOpen(prey.pos.x, prey.pos.z);
      const path = t && this.layer.path(this.pos.x, this.pos.z, t.x, t.z);
      if (path && path.length > 1) {
        this.path = path;
        this.pathIdx = 1;
      }
    }
    if (d < this.length * 0.55) {
      this.huntT = 0; // caught up: it lunges and roars, the prey bolts
      return;
    }
    this.gait = d < 2.4 ? 'run' : 'walk';
    if (this.path) this.walkStep(dt, true);
  }

  // footfalls synced to the gait clip's contact phases, and the odd idle call
  sounds(dt) {
    const a = this.current;
    const name = this.currentName;
    if (a && (name === 'walk' || name === 'run') && this.sp.feet) {
      const d = a.getClip().duration;
      const p = (a.time % d) / d;
      const prev = this._stepPhase ?? p;
      for (const f of this.sp.feet) {
        const crossed = prev <= p ? prev < f && f <= p : prev < f || f <= p;
        if (crossed) this.mod.voice.play('step', this.root.position, this.sp.step * (name === 'run' ? 1.3 : 1));
      }
      this._stepPhase = p;
    } else this._stepPhase = undefined;
    if (this.state === 'idle' && this.sp.sounds?.idle && rand() < dt * 0.02)
      this.mod.voice.play(this.sp.sounds.idle, this.root.position, this.sp.step);
  }

  act(kind) {
    const mod = this.mod;
    if (kind === 'wander') {
      let tx, tz;
      if (this.sp.herd) {
        // stay with the herd: aim near the herd's centre
        const mates = mod.dinos.filter((d) => d.sp.id === this.sp.id);
        const cx = mates.reduce((a, d) => a + d.pos.x, 0) / mates.length;
        const cz = mates.reduce((a, d) => a + d.pos.z, 0) / mates.length;
        const t = this.layer.randomOpen(rand, (x, z) => this.clearOfGlass(x, z) && Math.hypot(x - cx, z - cz) < 1.6 + rand() * 1.5);
        (tx = t.x), (tz = t.z);
      } else {
        const t = this.layer.randomOpen(rand, (x, z) => {
          const d = Math.hypot(x - this.pos.x, z - this.pos.z);
          return d > 1.5 && d < 6 && this.clearOfGlass(x, z);
        });
        (tx = t.x), (tz = t.z);
      }
      if (!this.goTo(tx, tz, null, !this.sp.noRun && rand() < 0.08 ? 'run' : 'walk')) this.timer = 1;
    } else if (kind === 'hunt') {
      const prey = mod.walkers
        .filter((d) => !d.sp.predator && !d.sp.tooBig && d.state !== 'sleep')
        .sort((a, b) => Math.hypot(a.pos.x - this.pos.x, a.pos.z - this.pos.z) - Math.hypot(b.pos.x - this.pos.x, b.pos.z - this.pos.z))[0];
      if (!prey) return void (this.timer = 1);
      this.prey = prey;
      this.state = 'hunt';
      this.huntT = 16 + rand() * 8;
      this.replan = 0;
      this.path = null;
      this.deterred = null;
    } else if (kind === 'drink') {
      const shore = mod.shore(this);
      if (!shore || !this.goTo(shore.x, shore.z, () => this.oneShot(this.actions.drink ? 'drink' : 'sniff')))
        this.timer = 1;
      else this.faceWater = shore.water;
    } else if (kind === 'browse') {
      const tree = mod.nearTree(this);
      if (tree && this.goTo(tree.x, tree.z, () => {
        this.heading = Math.atan2(tree.tx - this.pos.x, tree.tz - this.pos.z);
        this.oneShot('browse');
      })) return;
      this.oneShot('browse') || (this.timer = 1);
    } else if (!this.oneShot(kind)) this.timer = 1;
  }

  walkStep(dt, hunting = false) {
    const gait = this.gait || 'walk';
    const v = this.clipSpeed(gait);
    const wp = this.path[this.pathIdx];
    const dx = wp.x - this.pos.x, dz = wp.z - this.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < Math.max(0.06, v * 0.25)) {
      this.pathIdx++;
      if (this.pathIdx >= this.path.length) {
        if (hunting) return void (this.path = null);
        this.speed = 0;
        const then = this.then;
        this.then = null;
        this.rest(0.5);
        if (then) then();
      }
      return;
    }
    const want = Math.atan2(dx, dz);
    let dh = want - this.heading;
    dh = Math.atan2(Math.sin(dh), Math.cos(dh));
    const turnRate = (gait === 'run' ? 1.4 : 0.9) * Math.min(2, 1.2 / Math.max(this.length, 0.4));
    this.heading += MathUtils.clamp(dh, -turnRate * dt, turnRate * dt);
    const align = Math.max(0.2, Math.cos(Math.min(Math.abs(dh), Math.PI / 2)));
    this.speed += (v * align - this.speed) * Math.min(1, dt * 1.5);
    this.pos.x += Math.sin(this.heading) * this.speed * dt;
    this.pos.z += Math.cos(this.heading) * this.speed * dt;
    this.play(gait, 0.5);
    if (this.current) this.current.timeScale = Math.max(0.25, this.speed / v);
    if (this.state === 'flee' && this.pathIdx >= this.path.length - 1) this.state = 'walk';
  }

  place() {
    const T = this.mod.ctx.terrain;
    const h = T.height(this.pos.x, this.pos.z);
    const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
    const half = this.length * 0.25;
    const hf = T.height(this.pos.x + fx * half, this.pos.z + fz * half);
    const hb = T.height(this.pos.x - fx * half, this.pos.z - fz * half);
    const pitch = Math.atan2(hb - hf, 2 * half) * 0.6;
    this.root.position.set(this.pos.x, Math.min(h, (hf + hb) / 2 + 0.002), this.pos.z);
    this.root.rotation.set(pitch, this.heading, 0, 'YXZ');
  }
}


// Pterosaurs soar on drifting elliptical circuits under the clouds, banking into the turn, flapping
// to climb and gliding otherwise.
class Flyer {
  constructor(mod, sp, info, gltf, idx) {
    this.mod = mod;
    this.sp = sp;
    this.info = info;
    this.root = new Object3D();
    this.root.name = `${sp.id}-${idx}`;
    this.model = cloneSkinned(gltf.scene);
    this.model.scale.setScalar(S);
    this.root.add(this.model);
    this.model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = false;
      }
    });
    this.mixer = new AnimationMixer(this.model);
    this.actions = {};
    for (const clip of gltf.animations) this.actions[clip.name] = this.mixer.clipAction(clip);
    const box = mod.ctx.box;
    this.box = box;
    this.rx = 2.0 + rand() * 1.6;
    this.rz = 1.2 + rand() * 1.0;
    this.c = new Vector3((rand() - 0.5) * 2, 0, (rand() - 0.5) * 1.2);
    this.cGoal = this.c.clone();
    this.a = rand() * Math.PI * 2;
    this.dir = rand() < 0.5 ? 1 : -1;
    this.speed = 0.7 + rand() * 0.15;
    this.alt = 3.2 + rand() * 0.8;
    this.pos = new Vector3();
    this.prev = new Vector3();
    this.retarget = 8 + rand() * 10;
    this.flapping = false;
    this.flapT = 0;
    this.length = info.length * S;
    this.height = 0.2;
    this.followRadius = 1.6;
    this.pickRadius = (info.wingspan || 6) * S * 0.5;
    this.heading = 0;
    this.roll = 0;
    this.pitch = 0;
    this.state = 'fly';
    this.place(0);
    this.prev.copy(this.pos);
    // glide and flap play together; the flap's weight rises when climbing. Blending the two also
    // narrows the stroke, which suits the slow, soaring flight in the case.
    this.flapW = 0;
    for (const [n, a] of Object.entries(this.actions)) {
      a.setLoop(LoopRepeat, Infinity);
      a.enabled = true;
      a.play();
      a.setEffectiveWeight(n === 'glide' ? 1 : 0);
      if (n === 'flap') a.timeScale = 0.55;
    }
  }

  pickPoints() {
    return [this.root.position];
  }

  orbit(a, out) {
    const b = this.box;
    const rx = Math.min(this.rx, b.halfW - 0.8 - Math.abs(this.c.x));
    const rz = Math.min(this.rz, b.halfD - 0.6 - Math.abs(this.c.z));
    return out.set(this.c.x + Math.cos(a) * rx, 0, this.c.z + Math.sin(a) * rz);
  }

  place(dt) {
    const T = this.mod.ctx.terrain;
    this.orbit(this.a, this.pos);
    // stay well above the ground and the peaks, below the clouds
    const ahead = this.orbit(this.a + this.dir * 0.4, new Vector3());
    const ground = Math.max(T.height(this.pos.x, this.pos.z), T.height(ahead.x, ahead.z));
    const want = Math.max(this.alt + 0.25 * Math.sin(this.a * 2 + this.dir), ground + 1.0);
    this.y = this.y === undefined ? want : this.y + (want - this.y) * Math.min(1, dt * 0.6);
    this.pos.y = this.y;
  }

  update(dt, env) {
    // drift the circuit around the case now and then
    this.retarget -= dt;
    if (this.retarget < 0) {
      this.retarget = 10 + rand() * 14;
      this.cGoal.set((rand() - 0.5) * 3.5, 0, (rand() - 0.5) * 1.6);
      this.alt = 3.0 + rand() * 1.1;
      if (rand() < 0.3) this.dir *= -1;
    }
    this.c.lerp(this.cGoal, Math.min(1, dt * 0.08));
    const rMean = (this.rx + this.rz) / 2;
    this.a += (this.dir * this.speed * dt) / rMean;
    this.prev.copy(this.pos);
    const y0 = this.y ?? 0;
    this.place(dt);
    const v = this.pos.clone().sub(this.prev);
    if (dt > 0 && v.lengthSq() > 1e-10) {
      const h = Math.atan2(v.x, v.z);
      let dh = Math.atan2(Math.sin(h - this.heading), Math.cos(h - this.heading));
      this.heading += dh;
      const turn = dh / Math.max(dt, 1e-3);
      this.roll += (MathUtils.clamp(-turn * 0.9, -0.6, 0.6) - this.roll) * Math.min(1, dt * 2);
      const climb = (this.y - y0) / Math.max(dt, 1e-3);
      this.pitch += (MathUtils.clamp(-climb * 0.8, -0.3, 0.3) - this.pitch) * Math.min(1, dt * 2);
      // flap when climbing, or in short bursts to hold speed
      this.flapT -= dt;
      const wantFlap = climb > 0.05 || this.flapT > 0;
      if (!wantFlap && rand() < dt * 0.06) this.flapT = 1.5 + rand() * 2;
      this.flapW += ((wantFlap ? 0.62 : 0) - this.flapW) * Math.min(1, dt * 1.8);
      this.actions.flap?.setEffectiveWeight(this.flapW);
      this.actions.glide?.setEffectiveWeight(1 - this.flapW);
    }
    this.root.position.copy(this.pos);
    this.root.rotation.set(this.pitch, this.heading, this.roll, 'YXZ');
    this.mixer.update(dt);
    if (rand() < dt * 0.015) this.mod.voice.play('croak', this.root.position);
  }
}

class Dinosaurs {
  constructor(ctx) {
    this.ctx = ctx;
    this.group = new Group();
    this.group.name = 'dinosaurs';
    ctx.scene.add(this.group);
    this.dinos = [];
    this.layers = {};
    this.ready = false;
    this.voice = new Voices(ctx);
    this.lamps = params.get('lamps') === '0' ? null : new Lamps(ctx, { spots: (ctx.quality?.tier ?? 1) > 0 ? 3 : 1 });
    this.bolt = null;
    ctx.events?.on?.('lightning', (e) => {
      const p = e?.end;
      if (p) this.bolt = { x: p.x, z: p.z, t: performance.now() };
    });
    this.flora = new Flora(ctx, S, rand);
    this.group.add(this.flora.group);
    // den footprint in units: the rock was modelled in metres and is shown at DEN.s
    const ds = DEN.s / (1 / 8); // relative to the 1/8 scale the rectangles below were measured at
    this.den = { ...DEN, inside: { x: DEN.x, z: DEN.z - 0.12 * ds }, mouth: { x: DEN.x, z: DEN.z + 0.75 * ds } };
    this.aquatic = params.get('aquatic') === '0' ? null : new Aquatic(ctx, rand);
    this.room = params.get('room') === '0' ? null : new Room(ctx, new URL('models/room.webp', document.baseURI).href);
    this.nav = new NavGrid(ctx, {
      obstacles: [...this.flora.obstacles, ...(this.aquatic?.obstacles || [])],
      rects: [
        { x0: DEN.x - 1.45 * ds, x1: DEN.x + 1.45 * ds, z0: DEN.z - 1.5 * ds, z1: DEN.z + 0.55 * ds, block: true },
        { x0: DEN.x - 0.72 * ds, x1: DEN.x + 0.72 * ds, z0: DEN.z - 0.6 * ds, z1: DEN.z + 0.62 * ds, block: false },
      ],
    });
    for (const sp of SPECIES.filter((s) => !s.flyer))
      this.layers[sp.id] = this.nav.layer({ clearance: sp.clearance, maxWater: sp.maxWater, maxSlope: sp.maxSlope });
    // let the camera come close enough to see a dinosaur's skin
    const rig = ctx.cameraRig;
    if (rig) rig.limits.minRadius = 0.9;
    this.load().catch((e) => {
      console.error('[dinosaurs] load failed', e);
      window.__wgHold = 0;
    });
  }

  async load() {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const base = new URL('models/', document.baseURI);
    const floraReady = this.flora.load(base).catch((e) => console.warn('[flora] load failed', e));
    const denReady = loader
      .loadAsync(new URL('den.glb', base).href)
      .then((g) => {
        const m = g.scene;
        m.scale.setScalar(DEN.s);
        m.position.set(DEN.x, DEN.y - 0.03, DEN.z);
        m.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        m.name = 'den';
        this.group.add(m);
      })
      .catch((e) => console.warn('[den] load failed', e));
    await Promise.all(
      SPECIES.filter((sp) => sp.ready).map(async (sp) => {
        const [gltf, info] = await Promise.all([
          loader.loadAsync(new URL(`${sp.id}.glb`, base).href),
          fetch(new URL(`${sp.id}.json`, base)).then((r) => r.json()),
        ]);
        for (let i = 0; i < sp.count; i++) {
          const d = sp.flyer ? new Flyer(this, sp, info, gltf, i) : new Dino(this, sp, info, gltf, i);
          this.group.add(d.root);
          this.dinos.push(d);
        }
      }),
    );
    await floraReady;
    await denReady;
    this.predator = this.dinos.find((d) => d.sp.predator) || null;
    this.walkers = this.dinos.filter((d) => !d.sp.flyer);
    this.ready = true;
    this.guide = new Guide(this, SPECIES);
    window.__wgHold = 0;
  }

  // a walkable spot at the water's edge, near the animal
  shore(d) {
    const nav = this.nav, L = d.layer;
    let best = null, bd = Infinity;
    for (let tries = 0; tries < 400; tries++) {
      const k = L.open[Math.floor(rand() * L.open.length)];
      if (nav.water[k] < 0.15 || nav.water[k] > 0.55 || nav.slope[k] > 0.25) continue;
      const c = L.centre(k);
      const dist = Math.hypot(c.x - d.pos.x, c.z - d.pos.z) + rand();
      if (dist < bd) (bd = dist), (best = c);
    }
    return best ? { ...best, water: true } : null;
  }

  // stand beside a tall tree to browse it
  nearTree(d) {
    const trees = (this.ctx.modules.vegetation?.trees || []).filter((t) => t.height > 0.6);
    if (!trees.length) return null;
    trees.sort((a, b) => Math.hypot(a.x - d.pos.x, a.z - d.pos.z) - Math.hypot(b.x - d.pos.x, b.z - d.pos.z));
    for (const t of trees.slice(0, 6)) {
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const r = t.radius + d.length * 0.45;
        const x = t.x + Math.cos(ang) * r, z = t.z + Math.sin(ang) * r;
        if (d.layer.walkable(x, z)) return { x, z, tx: t.x, tz: t.z };
      }
    }
    return null;
  }

  env() {
    const life = this.ctx.modules.life?.env;
    const tod = this.ctx.world.timeOfDay ?? 0.5; // 0..1, 0.5 = noon
    const night = life ? life.night : tod < 0.23 || tod > 0.8 ? 1 : 0;
    return { night, storm: life?.storm || 0, rain: life?.rain || 0, wet: life?.wet || this.ctx.world.groundWetness || 0 };
  }

  update(dt) {
    if (!this.ready) return;
    const env = this.env();
    this.flora.update(dt);
    this.aquatic?.update(dt);
    // bodies that push the planting aside: hips and chest of every walker
    const pushers = [];
    for (const d of this.walkers || []) {
      for (const b of d.pushBones) {
        b.getWorldPosition(this._pv || (this._pv = new Vector3()));
        pushers.push({ x: this._pv.x, y: this._pv.y, z: this._pv.z, r: d.pushR });
      }
    }
    this.flora.setPushers(pushers);
    this.lamps?.update(dt);
    for (const d of this.dinos) d.update(dt, env);
    this.guide?.update(dt);
  }
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mod = window.__wg?.addModule?.('dinosaurs', Dinosaurs);
window.__dinos = mod;
