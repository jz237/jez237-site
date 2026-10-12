// Jurassic Terrarium: the dinosaur module for Weatherglass.
//
// Registers itself with window.__wg.addModule, so it is updated and rendered inside Weatherglass's
// own loop (after the vegetation and wildlife, before the clouds). Models are rigged GLBs built in
// Blender (scripts/jurassic-terrarium/blender); each comes with a JSON sidecar describing its size,
// gait speeds and clips.
import { Group, Object3D, Vector3, Quaternion, AnimationMixer, LoopOnce, LoopRepeat, MathUtils, Mesh, SphereGeometry, MeshStandardMaterial, Box3 } from 'three';

const _ka = new Vector3(), _kb = new Vector3(), _kc = new Vector3(), _kd = new Vector3();
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { NavGrid } from './nav.js';
import { Guide } from './ui.js';
import { Flora } from './flora.js';
import { Voices } from './voice.js';
import { Flex } from './flex.js';
import { Feet } from './feet.js';
import { Lamps } from './lamps.js';
import { Aquatic } from './aquatic.js';
import { Room } from './room.js';
import { Effects } from './effects.js';
import { Ambience } from './ambience.js';
import { Nest } from './nest.js';
import { debugPanel } from './debug.js';
import { guardWater } from './safety.js';
import { Atmosphere } from './atmosphere.js';
import { Contact } from './contact.js';
import { GroundCover } from './groundcover.js';

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
    id: 'triceratops', ready: true, count: 3, clearance: 0.07, maxWater: 0.6, maxSlope: 0.3, herd: true, flex: 0.9, gaitSwing: 0.05,
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
  // opts.scale: size relative to the adult (hatchlings); opts.parent: the adult it follows;
  // opts.at: where it starts
  constructor(mod, sp, info, gltf, idx, opts = {}) {
    this.k = opts.scale ?? 1;
    this.parent = opts.parent || null;
    this.grow = this.parent ? 0.45 : 1; // hatchlings start small and grow into their size
    this.mod = mod;
    this.sp = sp;
    this.info = info;
    this.root = new Object3D();
    this.root.name = `${sp.id}-${idx}`;
    this.model = cloneSkinned(gltf.scene);
    this.model.scale.setScalar(S * this.k * this.grow);
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
        if (/_eye$/.test(o.material?.name || '')) {
          // a wet, glassy eye with a sharp highlight; at night it catches the lamplight (eyeshine)
          o.material = o.material.clone();
          o.material.roughness = 0.08;
          if ('clearcoat' in o.material) {
            o.material.clearcoat = 1;
            o.material.clearcoatRoughness = 0.03;
          }
          o.material.envMapIntensity = 1.6;
          o.material.emissive?.setRGB(1.0, 0.62, 0.22);
          o.material.emissiveIntensity = 0;
          this.eyes = (this.eyes || []).concat(o.material);
        }
      }
    });
    // how far the body reaches in front of and behind its root (snout, tail tip), from the bind pose
    {
      this.root.updateMatrixWorld(true);
      const bb = new Box3().setFromObject(this.model);
      this.front = bb.max.z;
      this.back = -bb.min.z;
      this.side = Math.max(bb.max.x, -bb.min.x);
    }
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
    const p = opts.at || this.layer.randomOpen(rand, (x, z, k) => nav.slope[k] < 0.18 && nav.water[k] < 0.1 && this.clearOfGlass(x, z));
    this.pos = new Vector3(p.x, 0, p.z);
    this.heading = rand() * Math.PI * 2;
    this.speed = 0;
    this.yawRate = 0;
    this.state = 'idle';
    this.timer = 2 + rand() * 4;
    this.path = null;
    this.current = null;
    this.play('idle', 0);
    this.length = info.length * S * this.k;
    this.height = (info.height || 3) * S * this.k;
    this.stepSize = (sp.step || 1) * this.k;
    this.flex = new Flex(this.model, { flex: sp.flex ?? 1 });
    this.feet = new Feet(this.model, this.root, mod.ctx.terrain);
    // heavier animals land harder; footfalls of the big ones raise dust and (close to the camera) a tremor
    this.feet.weight = Math.min(1.7, Math.max(0.35, Math.sqrt(this.length / 1.5)));
    this.feet.onPlant = (p, running) => {
      mod.contact?.footprint(this, p, this.heading, !this.sp.predator);
      const T = mod.ctx.terrain;
      if (Math.max(T.lakeMask(p.x, p.z), T.riverMask(p.x, p.z)) > 0.35)
        mod.ctx.modules.water?.ripple?.(p.x, p.z, Math.min(0.12, 0.025 + this.length * 0.02), running ? 1.4 : 0.9);
      if (this.length > 1.3 || running) mod.effects.dust(p, this.length * (running ? 0.05 : 0.035));
      if (this.length > 2) {
        const cam = mod.ctx.camera.position, d = cam.distanceTo(p);
        if (d < 7) mod.ctx.cameraRig?.shake?.(0.012 * this.feet.weight * (1 - d / 7));
      }
    };
    // the ground speed each gait's stride really covers, measured from the clip (so feet don't skate)
    this.stride = {};
    for (const g of ['walk', 'run']) if (this.actions[g]) this.stride[g] = this.measureStride(g);
    this.model.traverse((o) => o.isBone && o.name === 'head' && (this.headBone = o));
    // where the head is at the height of a browse (measured on the clip once): up and forward of the feet
    if (this.actions.browse && this.headBone) this.browseReach = this.measureReach('browse');
    // the hips and the chest press the ferns aside as the animal pushes through
    this.pushBones = [this.flex.spine[this.flex.spine.length - 1], null].filter(Boolean);
    this.model.traverse((o) => o.isBone && o.name === 'pelvis' && this.pushBones.unshift(o));
    this.pushR = Math.max(0.12 * this.k, (info.length || 6) * S * this.k * 0.16);
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
    const st = this.stride?.[name];
    return (st ?? (this.info.clips[name]?.speed || 1) * S) * this.k * this.grow;
  }

  // how fast a planted foot sweeps backward under the body in this clip, at adult size (units/s)
  measureStride(name) {
    const clip = this.actions[name].getClip(), N = 48;
    const legs = this.feet.legs;
    if (!legs.length) return undefined;
    const pts = legs.map(() => []);
    const p = new Vector3();
    this.sampleClip(name, Array.from({ length: N + 1 }, (_, i) => i / N), () => {
      legs.forEach((L, j) => {
        const l = this.root.worldToLocal(L.contact.getWorldPosition(p));
        pts[j].push([l.y, l.z]);
      });
    });
    const dt = clip.duration / N;
    let sum = 0, n = 0;
    for (const P of pts) {
      const minY = Math.min(...P.map((q) => q[0]));
      const tol = (this.feet.hipH || 0.3) * 0.03;
      for (let i = 1; i < P.length; i++) {
        if (P[i][0] - minY < tol && P[i - 1][0] - minY < tol) {
          const v = (P[i - 1][1] - P[i][1]) / dt; // backward sweep
          if (v > 0) (sum += v), n++;
        }
      }
    }
    // per unit of model scale, so hatchlings (and growth) scale it
    return n ? sum / n / (this.k * this.grow) : undefined;
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
    if (!this.clearOfGlass(x, z) && !this.parent) {
      const g = this.insideGoal(x, z), o = this.layer.nearestOpen(g.x, g.z);
      if (o) (x = o.x), (z = o.z);
    }
    const path = this.layer.path(this.pos.x, this.pos.z, x, z);
    if (!path || path.length < 2) return false;
    this.path = path;
    this.pathIdx = 1;
    this.yawRate = 0;
    this.state = 'walk';
    this.gait = this.actions[gait] && !(gait === 'run' && this.sp.noRun) ? gait : 'walk';
    this.then = then;
    return true;
  }

  // long animals stop well inside the case, so a turning head or tail stays off the glass
  clearOfGlass(x, z) {
    const b = this.mod.ctx.box, m = Math.max(this.front ?? 0, this.back ?? 0, this.length * 0.5) + 0.12;
    return Math.abs(x) < b.halfW - m && Math.abs(z) < b.halfD - m;
  }

  // the nearest point to (x, z) where the whole body fits inside the glass whichever way it faces
  insideGoal(x, z) {
    const b = this.mod.ctx.box, m = Math.max(this.front ?? 0, this.back ?? 0, this.length * 0.5) + 0.12;
    const mx = Math.max(0.2, b.halfW - m), mz = Math.max(0.2, b.halfD - m);
    return { x: Math.max(-mx, Math.min(mx, x)), z: Math.max(-mz, Math.min(mz, z)) };
  }

  // Glass guard: whatever the animal is doing, if its snout or tail tip would pass the glass, slide it
  // back inside. Runs after the pose is final, on the actual bone positions.
  keepInside() {
    if (!this.tipBones) {
      const bones = {};
      this.model.traverse((o) => o.isBone && (bones[o.name] = o));
      const tails = Object.keys(bones).filter((n) => /^tail\d+$/.test(n)).sort((a, b) => +a.slice(4) - +b.slice(4));
      const necks = Object.keys(bones).filter((n) => /^neck\d+$/.test(n)).sort((a, b) => +a.slice(4) - +b.slice(4));
      this.tipBones = { head: bones.head, neck: bones[necks[necks.length - 1]] || bones.spine3, tail: bones[tails[tails.length - 1]] };
      // the snout reaches this far past the head joint (bind pose)
      this.root.updateMatrixWorld(true);
      const hp = this.root.worldToLocal(bones.head.getWorldPosition(new Vector3()));
      this.snout = Math.max(0.03, (this.front ?? 0) - hp.z);
    }
    const T = this.tipBones, b = this.mod.ctx.box, m = 0.05;
    const a = _ka.copy(T.head.getWorldPosition(_ka)), n = T.neck.getWorldPosition(_kb);
    const tip = _kc.subVectors(a, n).normalize().multiplyScalar(this.snout).add(a);
    let push = 0, px = 0, pz = 0;
    for (const v of [tip, a, T.tail ? T.tail.getWorldPosition(_kd) : null]) {
      if (!v) continue;
      const ox = Math.abs(v.x) - (b.halfW - m), oz = Math.abs(v.z) - (b.halfD - m);
      if (ox > 0) px = Math.max(Math.abs(px), ox) * -Math.sign(v.x);
      if (oz > 0) pz = Math.max(Math.abs(pz), oz) * -Math.sign(v.z);
      push = Math.max(push, ox, oz);
    }
    if (push <= 0) return;
    this.pos.x += px;
    this.pos.z += pz;
    this.root.position.x += px;
    this.root.position.z += pz;
    this.root.updateMatrixWorld(true);
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
    if (snd) this.mod.voice.play(snd, this.root.position, this.stepSize);
    if (name === 'roar' && this.sp.predator) this.mod.roared(this);
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
    const T = mod.ctx.terrain;
    this.inWater = Math.max(T.lakeMask(this.pos.x, this.pos.z), T.riverMask(this.pos.x, this.pos.z));
    const wantWet = Math.min(1, Math.max(env.rain * 1.5 + env.wet * 0.6, this.inWater > 0.35 ? 0.85 : 0));
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
          if (call) mod.voice.play(call, this.root.position, this.stepSize);
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
        if (this.parent) {
          // they sleep when she sleeps, curled up at her side
          if (this.parent.state === 'sleep' && this.actions.rest) {
            this.state = 'sleep';
            this.play('rest', 1.2);
            break;
          }
          if (this.timer <= 0 || this.parent.state === 'flee') this.follow();
          break;
        }
        if (this.guarding && this.timer <= 0) {
          this.guard();
          break;
        }
        // rain: the herbivores get under the tree ferns (sauropods don't bother)
        if (env.rain > 0.35 && !this.sp.predator && !this.sp.tooBig && this.shelter()) break;
        if ((night || env.storm > 0.6 || env.rain > 0.35) && this.sp.den && !this.inDen()) {
          this.goDen();
          break;
        }
        if (night || (this.sp.den && (env.storm > 0.6 || env.rain > 0.35))) {
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
        if (this.parent) {
          if (this.parent.state !== 'sleep') this.rest(1.0);
          break;
        }
        if (!night && !(this.sp.den && (env.storm > 0.6 || env.rain > 0.25))) this.rest(1.5);
        break;
      case 'shelter':
        // wait out the rain under the fronds, now and then shaking the water off
        if (env.rain < 0.15) {
          if (this.sheltered) this.sheltered.sheltering--;
          this.sheltered = null;
          this.rest(0.8);
        } else if (this.timer <= 0) {
          this.timer = 6 + rand() * 8;
          if (rand() < 0.4 && this.actions.alert) this.play('alert', 0.5);
          else this.play('idle', 0.8);
        }
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
        // a hatchling keeps re-aiming at its mother as she moves
        if (this.parent && (this.replanT = (this.replanT ?? 1) - dt) <= 0) {
          this.replanT = 1.2;
          this.follow();
          if (this.state !== 'walk' && this.state !== 'flee') break;
        }
        this.walkStep(dt);
        break;
    }
    this.finish(dt);
  }

  // a hatchling stays at its mother's flank, a little behind, trotting to catch up when she moves off
  follow() {
    const m = this.parent;
    const side = this.followSide ?? (this.followSide = (rand() < 0.5 ? -1 : 1) * (0.5 + rand() * 0.9));
    const a = m.heading + Math.PI + side;
    const r = m.length * 0.45 + 0.08;
    const tx = m.pos.x + Math.sin(a) * r, tz = m.pos.z + Math.cos(a) * r;
    const d = Math.hypot(tx - this.pos.x, tz - this.pos.z);
    if (d < 0.2) {
      this.state = 'idle';
      this.speed = 0;
      this.timer = 0.6 + rand() * 1.2;
      // look where she looks, nibble now and then
      if (rand() < 0.25 && this.actions.graze) this.oneShot('graze');
      else this.play('idle', 0.5);
      return;
    }
    const gait = d > 0.6 || m.state === 'flee' ? 'run' : 'walk';
    const t = this.layer.nearestOpen(tx, tz);
    if (!t || !this.goTo(t.x, t.z, null, gait)) {
      this.state = 'idle';
      this.timer = 0.5;
    }
  }

  // the nest's guardian keeps close: back to its side when she strays, otherwise standing, grazing,
  // looking round
  guard() {
    const n = this.guarding;
    if (n.done) {
      this.guarding = null;
      return this.rest(0.6);
    }
    const d = Math.hypot(n.site.x - this.pos.x, n.site.z - this.pos.z);
    if (d > 1.0) {
      const a = rand() * Math.PI * 2, r = 0.45 + this.length * 0.3;
      const t = this.layer.nearestOpen(n.site.x + Math.cos(a) * r, n.site.z + Math.sin(a) * r);
      if (t && this.goTo(t.x, t.z, () => {
        this.heading = Math.atan2(n.site.x - this.pos.x, n.site.z - this.pos.z) + (rand() - 0.5);
        this.rest(0.6);
      })) return;
    }
    const k = rand();
    if (k < 0.4 && this.actions.graze) this.oneShot('graze');
    else if (k < 0.55 && this.actions.alert) this.oneShot('alert');
    else this.rest(0.6);
  }

  // walk in under the nearest tall tree fern that isn't already crowded, and turn to face out
  shelter() {
    const mod = this.mod;
    const ferns = (mod.flora.placements.treefern || []).filter((t) => t.top && t.top - t.y > 0.9 && (t.sheltering || 0) < 2);
    ferns.sort((a, b) => Math.hypot(a.x - this.pos.x, a.z - this.pos.z) - Math.hypot(b.x - this.pos.x, b.z - this.pos.z));
    for (const t of ferns.slice(0, 6)) {
      const r = 0.18 + this.length * 0.22;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + rand() * 0.4;
        const x = t.x + Math.cos(a) * r, z = t.z + Math.sin(a) * r;
        if (!this.layer.walkable(x, z) || !this.clearOfGlass(x, z)) continue;
        t.sheltering = (t.sheltering || 0) + 1;
        if (this.goTo(x, z, () => {
          this.heading = Math.atan2(x - t.x, z - t.z);
          this.sheltered = t;
          this.state = 'shelter';
          this.timer = 4 + rand() * 4;
          this.play('idle', 0.8);
        })) return true;
        t.sheltering--;
      }
    }
    return false;
  }

  // Sample a clip on a throwaway mixer, so the animal's own animation state is never disturbed
  // (stopping its actions here once left the idle clip dead and blends going through odd poses).
  sampleClip(name, times, fn) {
    const clip = this.actions[name].getClip();
    const tmp = new AnimationMixer(this.model);
    const a = tmp.clipAction(clip);
    a.play();
    this.root.position.set(0, 0, 0);
    this.root.rotation.set(0, 0, 0);
    for (const t of times) {
      tmp.setTime(t * clip.duration);
      this.root.updateMatrixWorld(true);
      fn(t);
    }
    tmp.stopAllAction();
    tmp.uncacheRoot(this.model);
    this.mixer.update(0); // back to the animal's own pose
  }

  measureReach(name) {
    const p = new Vector3();
    this.sampleClip(name, [0.5], () => this.headBone.getWorldPosition(p));
    return { up: p.y, fwd: Math.hypot(p.x, p.z) };
  }

  // cropping fronds: a bite every second or so through the middle of the browse
  crop(dt) {
    if (this.currentName !== 'browse' || this.cropT === undefined) return;
    this.cropT -= dt;
    const a = this.current, d = a.getClip().duration;
    if (this.cropT <= 0 && a.time > 1.5 && a.time < d - 1.5) {
      this.cropT = 0.9 + rand() * 0.8;
      const p = this.headBone.getWorldPosition(new Vector3());
      this.mod.effects.leafBurst(p, 3 + Math.floor(rand() * 4));
      this.mod.voice.play('crop', p, 1);
    }
  }

  // three.js's mixer only writes a bone when the clip's value for it changes, so in a held pose (an alert,
  // a drink) it stops rewriting the legs and the spine, and the bends and IK added on top each frame would
  // pile up (feet upside down, legs twisted). So: before the mixer runs, put back the clean clip pose of
  // every bone this runtime adjusts; right after it, take a fresh snapshot.
  restorePose() {
    if (!this._pose) return;
    for (const p of this._pose) {
      p.b.quaternion.copy(p.q);
      p.b.scale.copy(p.s);
    }
  }

  snapPose() {
    if (!this._pose) {
      const set = new Set([...this.flex.spine, ...this.flex.neck, ...this.flex.tail]);
      if (this.flex.head) set.add(this.flex.head);
      for (const L of this.feet.legs) set.add(L.a).add(L.b).add(L.c);
      if (this.feet.chest) {
        set.add(this.feet.chest);
        for (const c of this.feet.chestKids) set.add(c);
      }
      this._pose = [...set].map((b) => ({ b, q: new Quaternion(), s: new Vector3() }));
    }
    for (const p of this._pose) {
      p.q.copy(p.b.quaternion);
      p.s.copy(p.b.scale);
    }
  }

  finish(dt) {
    if (this.grow < 1) {
      this.grow = Math.min(1, this.grow + dt / 45);
      this.model.scale.setScalar(S * this.k * this.grow);
    }
    this.place();
    this.restorePose();
    this.mixer.update(dt);
    this.snapPose();
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
      // feet onto the real ground (not while lying down), and breathing
      const stepping = (this.state === 'walk' || this.state === 'flee' || this.state === 'hunt') && this.speed > 0.01;
      this.feet.update(dt, { running: this.currentName === 'run', enabled: this.currentName !== 'rest', moving: stepping || this.state === 'turn' });
      this.keepInside();
    }
    this.crop(dt);
    this.waterTouch(dt);
    if (this.eyes) {
      const night = this.mod.ctx.modules.life?.env?.night ?? 0;
      for (const m of this.eyes) m.emissiveIntensity = 0.35 * night;
    }
    this.sounds(dt);
  }

  // wading leaves a wake; drinking rings the water at the mouth
  waterTouch(dt) {
    const W = this.mod.ctx.modules.water;
    if (!W?.ripple) return;
    this.wakeT = (this.wakeT ?? 0) - dt;
    if (this.inWater > 0.35 && this.speed > 0.02 && this.wakeT <= 0) {
      this.wakeT = 0.35;
      const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
      W.ripple(this.pos.x + fx * this.length * 0.2, this.pos.z + fz * this.length * 0.2, Math.min(0.2, this.length * 0.08), 0.8);
    }
    if (this.currentName === 'drink' && this.headBone && this.wakeT <= 0) {
      this.wakeT = 1.1 + rand() * 0.8;
      const p = this.headBone.getWorldPosition(_kd);
      W.ripple(p.x, p.z, 0.03, 0.6);
    }
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
    // browsing a lower crown: the neck bows down into it
    if (this.currentName === 'browse' && this.browseDip) return { yaw: 0, pitch: this.browseDip, maxPitch: 1.2 };
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
        if (crossed) this.mod.voice.play('step', this.root.position, this.stepSize * (name === 'run' ? 1.3 : 1));
      }
      this._stepPhase = p;
    } else this._stepPhase = undefined;
    if (this.state === 'idle' && this.sp.sounds?.idle && rand() < dt * 0.02)
      this.mod.voice.play(this.sp.sounds.idle, this.root.position, this.stepSize);
  }

  act(kind) {
    const mod = this.mod;
    if (kind === 'wander') {
      let tx, tz;
      if (this.sp.herd) {
        // stay with the herd: aim near the herd's centre
        const mates = mod.dinos.filter((d) => d.sp.id === this.sp.id && !d.parent);
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
        .filter((d) => !d.sp.predator && !d.sp.tooBig && !d.parent && d.state !== 'sleep')
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
        this.cropT = 1.6; // first bite once the neck is up
        this.browseDip = tree.dip || 0;
      })) return;
      this.oneShot('browse') || (this.timer = 1);
    } else if (!this.oneShot(kind)) this.timer = 1;
  }

  // the point `dist` further along the route from where the animal stands
  carrot(dist) {
    let px = this.pos.x, pz = this.pos.z, left = dist;
    for (let i = this.pathIdx; i < this.path.length; i++) {
      const w = this.path[i];
      const sx = w.x - px, sz = w.z - pz, s = Math.hypot(sx, sz);
      if (s >= left) return { x: px + (sx / s) * left, z: pz + (sz / s) * left };
      left -= s;
      px = w.x;
      pz = w.z;
    }
    return { x: px, z: pz };
  }

  walkStep(dt, hunting = false) {
    const gait = this.gait || 'walk';
    const v = this.clipSpeed(gait);
    const wp = this.path[this.pathIdx];
    const d = Math.hypot(wp.x - this.pos.x, wp.z - this.pos.z);
    // steer for a point a little way down the route, not the next waypoint: the animal curves through
    // the route's corners instead of walking straight and pivoting at each one, so its body bends
    const look = Math.max(0.2, this.length * 0.45);
    const last = this.pathIdx >= this.path.length - 1;
    if (d < (last ? Math.max(0.06, v * 0.25) : Math.max(0.06, v * 0.25, look * 0.6))) {
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
    const c = this.carrot(look);
    const want = Math.atan2(c.x - this.pos.x, c.z - this.pos.z);
    let dh = want - this.heading;
    dh = Math.atan2(Math.sin(dh), Math.cos(dh));
    const turnRate = (gait === 'run' ? 1.4 : 0.9) * Math.min(2, 1.2 / Math.max(this.length, 0.4));
    // the turn rate itself eases in and out (no instant pivots), which the flex layer reads as a curve
    const wantRate = MathUtils.clamp(dh * 2.2, -turnRate, turnRate);
    this.yawRate += (wantRate - this.yawRate) * Math.min(1, dt * 4);
    this.heading += this.yawRate * dt;
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
    this.makeFish();
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

  // ------------------------------------------------------------ fishing
  // Now and then a Pteranodon leaves its circuit, glides down to the pool, skims the surface and snatches
  // a fish, then climbs away with it and rejoins the circuit. The dive is two Bezier legs (down to the
  // water, up and away) whose route is checked against the terrain before it commits.
  planDive() {
    const T = this.mod.ctx.terrain, box = this.box;
    let target = null;
    for (let i = 0; i < 60 && !target; i++) {
      const x = 0.8 + rand() * 3.8, z = 1.3 + rand() * 1.9;
      if (T.lakeMask(x, z) > 0.9 && T.height(x, z) < -0.2 && z < box.halfD - 0.6) target = new Vector3(x, 0.07, z);
    }
    if (!target) return false;
    const p0 = this.pos.clone();
    const fwd = new Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
    const app = target.clone().sub(p0).setY(0);
    const dist = app.length();
    if (dist < 2.2) return false;
    app.normalize();
    const exitDir = app.clone().lerp(fwd, 0.3).normalize();
    const legs = [
      [p0, p0.clone().addScaledVector(fwd, dist * 0.35), target.clone().addScaledVector(app, -1.1).setY(0.25), target],
      [target, target.clone().addScaledVector(exitDir, 0.7).setY(0.1), target.clone().addScaledVector(exitDir, 1.6).setY(1.1),
        target.clone().addScaledVector(exitDir, 2.6).setY(2.3)],
    ];
    // the whole route must clear the ground (except the water it skims) and stay inside the glass
    const q = new Vector3();
    for (const L of legs) {
      for (let i = 1; i < 20; i++) {
        bez(L, i / 20, q);
        if (Math.abs(q.x) > box.halfW - 0.7 || Math.abs(q.z) > box.halfD - 0.45) return false;
        const g = T.height(q.x, q.z);
        if (q.y < Math.max(g, 0) + (q.distanceTo(target) < 0.5 ? 0.03 : 0.2)) return false;
      }
    }
    this.dive = { legs, leg: 0, u: 0, target, lens: legs.map((L) => bezLen(L)) };
    this.state = 'dive';
    return true;
  }

  diveStep(dt) {
    const D = this.dive;
    const speed = D.leg === 0 ? 1.15 : 0.85;
    D.u += (dt * speed) / D.lens[D.leg];
    if (D.u >= 1) {
      if (D.leg === 0) {
        D.leg = 1;
        D.u = 0;
        this.mod.effects.splash(D.target.x, D.target.z, 0, 1);
        this.mod.voice.play('splash', D.target, 1);
        this.catchFish();
      } else {
        // rejoin the circuit from wherever the climb ended
        this.state = 'rejoin';
        this.rejoin = { from: this.pos.clone(), vel: this.pos.clone().sub(this.prev).divideScalar(Math.max(dt, 1e-3)), t: 0 };
        this.y = this.pos.y;
        this.dive = null;
        return;
      }
    }
    bez(D.legs[D.leg], Math.min(1, D.u), this.pos);
  }

  // the fish it carries: made at load (held at zero size) so its shader is compiled before it is needed
  makeFish() {
    this.model.traverse((o) => o.isBone && o.name === 'jaw' && (this.headBone = o));
    if (!this.headBone) return;
    this.fish = new Mesh(new SphereGeometry(1, 10, 6), new MeshStandardMaterial({ color: 0xc9d4d8, metalness: 0.6, roughness: 0.3 }));
    this.fish.name = 'pteranodon-fish';
    this.fish.frustumCulled = false;
    this.fish.scale.setScalar(1e-5);
    this.headBone.add(this.fish);
  }

  catchFish() {
    if (!this.fish) return;
    // held crosswise in the beak; the bone is in the model's (scaled) space
    const k = 1 / S;
    this.fish.scale.set(0.006 * k, 0.005 * k, 0.022 * k);
    this.fish.position.set(0, 0.03 * k, 0.05 * k);
    this.fish.rotation.set(0, Math.PI / 2, 0);
    this.fishHold = 3.5;
  }

  update(dt, env) {
    if (this.fishHold !== undefined) {
      this.fishHold -= dt;
      if (this.fishHold <= 0) {
        this.fish?.scale.setScalar(1e-5); // swallowed
        this.fishHold = undefined;
        this.mod.voice.play('croak', this.root.position);
      }
    }
    this.fishT = (this.fishT ?? 18 + rand() * 25) - dt;
    if (this.state === 'fly' && this.fishT <= 0) {
      this.fishT = this.planDive() ? 40 + rand() * 40 : 6;
    }
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
    const y0 = this.state === 'fly' ? this.y ?? 0 : this.pos.y;
    if (this.state === 'dive') this.diveStep(dt);
    else if (this.state === 'rejoin') {
      const R = this.rejoin;
      R.t += dt;
      const from = R.from.clone().addScaledVector(R.vel, Math.min(R.t, 3) * 0.6);
      this.place(dt);
      const k = Math.min(1, R.t / 3.5), e = k * k * (3 - 2 * k);
      this.pos.lerpVectors(from, this.pos.clone(), e);
      if (k >= 1) this.state = 'fly';
    } else this.place(dt);
    if (this.state !== 'fly') this.y = this.state === 'rejoin' ? this.y : this.pos.y;
    const v = this.pos.clone().sub(this.prev);
    if (dt > 0 && v.lengthSq() > 1e-10) {
      const h = Math.atan2(v.x, v.z);
      let dh = Math.atan2(Math.sin(h - this.heading), Math.cos(h - this.heading));
      this.heading += dh;
      const turn = dh / Math.max(dt, 1e-3);
      const bank = this.state === 'fly' ? 0.6 : 0.3; // a shallow bank on the dive's long curve
      this.roll += (MathUtils.clamp(-turn * 0.9, -bank, bank) - this.roll) * Math.min(1, dt * 2);
      const climb = (this.pos.y - y0) / Math.max(dt, 1e-3);
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
    this.ground = params.get('ground') === '0' ? null : new GroundCover(ctx, this.flora, rand);
    const hatch = params.get('hatch');
    this.nest = params.get('nest') === '0' ? null : new Nest(ctx, this.flora, rand, { hatchAt: hatch != null ? Number(hatch) : undefined });
    this.room = params.get('room') === '0' ? null : new Room(ctx, new URL('models/room.webp', document.baseURI).href);
    this.effects = new Effects(ctx);
    this.contact = new Contact(ctx, this);
    this.ambience = new Ambience(ctx, this.voice);
    this.timers = [];
    this.nav = new NavGrid(ctx, {
      obstacles: [...this.flora.obstacles, ...(this.aquatic?.obstacles || []), ...(this.ground?.obstacles || []), ...(this.nest?.obstacle ? [this.nest.obstacle] : [])],
      rects: [
        { x0: DEN.x - 1.45 * ds, x1: DEN.x + 1.45 * ds, z0: DEN.z - 1.5 * ds, z1: DEN.z + 0.55 * ds, block: true },
        { x0: DEN.x - 0.72 * ds, x1: DEN.x + 0.72 * ds, z0: DEN.z - 0.6 * ds, z1: DEN.z + 0.62 * ds, block: false },
      ],
    });
    // the den (rock and hollow) is the T. rex's alone; tall animals keep further off so a neck can't
    // reach over or through the overhang
    const denRect = { x0: DEN.x - 1.45 * ds, x1: DEN.x + 1.45 * ds, z0: DEN.z - 1.5 * ds, z1: DEN.z + 0.55 * ds };
    for (const sp of SPECIES.filter((s) => !s.flyer)) {
      const m = sp.den ? null : sp.tooBig ? 1.8 : 0.25;
      const blockRects = m === null ? [] : [{ x0: denRect.x0 - m, x1: denRect.x1 + m, z0: denRect.z0 - m, z1: denRect.z1 + m }];
      this.layers[sp.id] = this.nav.layer({ clearance: sp.clearance, maxWater: sp.maxWater, maxSlope: sp.maxSlope, blockRects });
    }
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
    const floraReady = this.flora.load().catch((e) => console.warn('[flora] load failed', e));
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
        (this.assets || (this.assets = {}))[sp.id] = { gltf, info };
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
    // the herd's first Triceratops guards the nest until the eggs have hatched
    const mother = this.dinos.find((d) => d.sp.id === 'triceratops');
    if (this.nest?.site && mother) {
      this.mother = mother;
      mother.guarding = this.nest;
      const t = mother.layer.nearestOpen(this.nest.site.x + 0.6, this.nest.site.z + 0.2);
      if (t) mother.pos.set(t.x, 0, t.z);
    }
    this.ready = true;
    this.guide = new Guide(this, SPECIES);
    // the water's shaders can produce NaN/Inf pixels on some GPUs (bloomed into full-screen flashes)
    if (params.get('waterguard') !== '0') this.guarded = guardWater(this.ctx.scene);
    this.atmosphere = params.get('air') === '0' ? null : new Atmosphere(this.ctx, this);
    if (params.has('debug')) debugPanel(this.ctx, this);
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

  // an egg has opened: a Triceratops hatchling climbs out and turns to find its mother
  hatchling(p, a) {
    const A = this.assets?.triceratops, mother = this.mother;
    if (!A || !mother) return;
    const sp = SPECIES.find((s) => s.id === 'triceratops');
    const d = new Dino(this, sp, A.info, A.gltf, `hatchling${this.dinos.length}`, { scale: 0.22, parent: mother, at: { x: p.x, z: p.z } });
    d.heading = a;
    d.state = 'idle';
    d.timer = 1.5 + rand(); // a moment to find its feet
    this.group.add(d.root);
    this.dinos.push(d);
    this.walkers.push(d);
    this.voice.play('grunt', p, 0.3);
    if (this.nest.hatched >= this.nest.eggs.length) this.nest.done = true;
  }

  later(t, fn) {
    this.timers.push({ t, fn });
  }

  // the T. rex roars: the planting round it shivers and every herbivore in earshot turns to look; the
  // nearest ones start up in alarm
  roared(rex) {
    const p = rex.pos;
    this.later(0.4, () => this.flora.shiver(p.x, p.z, 1.8, 1));
    for (const d of this.walkers || []) {
      if (d === rex || d.sp.predator || d.state === 'sleep') continue;
      const dd = Math.hypot(d.pos.x - p.x, d.pos.z - p.z);
      if (dd > 5) continue;
      this.later(0.35 + dd * 0.08 + rand() * 0.2, () => {
        d.glance = rex;
        d.glanceUntil = 2.5 + rand();
        d.glanceT = 4 + rand() * 2;
        if (dd < 3 && (d.state === 'idle' || d.state === 'walk') && d.actions.alert && rand() < 0.7) {
          d.heading = Math.atan2(p.x - d.pos.x, p.z - d.pos.z) * 0.3 + d.heading * 0.7;
          d.oneShot('alert');
        }
      });
    }
  }

  // stand where a browsing head reaches into a tree-fern crown at the height it feeds
  nearTree(d) {
    const reach = d.browseReach;
    const ferns = (this.flora.placements.treefern || []).filter((t) => t.top);
    if (reach && ferns.length) {
      ferns.sort((a, b) => Math.hypot(a.x - d.pos.x, a.z - d.pos.z) - Math.hypot(b.x - d.pos.x, b.z - d.pos.z));
      const T = this.ctx.terrain, half = d.length * 0.25;
      for (const t of ferns.slice(0, 12)) {
        for (let i = 0; i < 10; i++) {
          const ang = (i / 10) * Math.PI * 2 + rand() * 0.3;
          const cx = Math.cos(ang), cz = Math.sin(ang);
          // on a slope the body pitches (as place() does), which lifts the head and pulls it back:
          // settle the stand-off distance so the head ends up over the trunk
          let D = reach.fwd, x = 0, z = 0, headY = 0;
          for (let k = 0; k < 3; k++) {
            x = t.x + cx * D;
            z = t.z + cz * D;
            const hf = T.height(x - cx * half, z - cz * half), hb = T.height(x + cx * half, z + cz * half);
            const th = Math.atan2(hf - hb, 2 * half) * 0.6; // nose up when the tree side is higher
            D = Math.max(0.5, reach.fwd * Math.cos(th) - reach.up * Math.sin(th));
            headY = Math.min(T.height(x, z), (hf + hb) / 2) + reach.up * Math.cos(th) + reach.fwd * Math.sin(th);
          }
          if (!d.layer.walkable(x, z) || !d.clearOfGlass(x, z)) continue;
          // into the fronds, just under the top; a crown that is lower is reached by dipping the neck
          const err = headY - (t.top - 0.12);
          if (err < -0.3 || err > 0.85) continue;
          return { x, z, tx: t.x, tz: t.z, fern: t, dip: Math.max(0, Math.min(1.2, err / 0.6)) };
        }
      }
    }
    return this.nearPine(d);
  }

  // Weatherglass's own conifers, when no tree fern fits
  nearPine(d) {
    const trees = (this.ctx.modules.vegetation?.trees || []).filter((t) => t.height > 0.6);
    if (!trees.length) return null;
    trees.sort((a, b) => Math.hypot(a.x - d.pos.x, a.z - d.pos.z) - Math.hypot(b.x - d.pos.x, b.z - d.pos.z));
    for (const t of trees.slice(0, 6)) {
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const r = t.radius + d.length * 0.45;
        const x = t.x + Math.cos(ang) * r, z = t.z + Math.sin(ang) * r;
        if (d.layer.walkable(x, z) && d.clearOfGlass(x, z)) return { x, z, tx: t.x, tz: t.z };
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
    this.effects.update(dt, env);
    this.contact.update(dt);
    this.atmosphere?.update(dt);
    this.nest?.update(dt, (p, a) => this.hatchling(p, a));
    this.ambience.update(dt, env);
    for (let i = this.timers.length - 1; i >= 0; i--) {
      const T = this.timers[i];
      if ((T.t -= dt) <= 0) {
        this.timers.splice(i, 1);
        T.fn();
      }
    }
    // bodies that push the planting aside: hips and chest of every walker
    const pushers = [];
    for (const d of this.walkers || []) {
      for (const b of d.pushBones) {
        b.getWorldPosition(this._pv || (this._pv = new Vector3()));
        pushers.push({ x: this._pv.x, y: this._pv.y, z: this._pv.z, r: d.pushR });
      }
    }
    // a browsing head pushes into the crown it is cropping
    for (const d of this.walkers || []) {
      if (d.currentName !== 'browse' || !d.headBone) continue;
      d.headBone.getWorldPosition(this._pv);
      pushers.push({ x: this._pv.x, y: this._pv.y, z: this._pv.z, r: 0.2 });
    }
    this.flora.setPushers(pushers);
    this.lamps?.update(dt);
    for (const d of this.dinos) d.update(dt, env);
    this.guide?.update(dt);
  }
}

// cubic Bezier through four points
function bez([a, b, c, d], t, out) {
  const u = 1 - t;
  return out
    .copy(a).multiplyScalar(u * u * u)
    .addScaledVector(b, 3 * u * u * t)
    .addScaledVector(c, 3 * u * t * t)
    .addScaledVector(d, t * t * t);
}

function bezLen(P) {
  let len = 0;
  const a = new Vector3(), b = new Vector3();
  bez(P, 0, a);
  for (let i = 1; i <= 24; i++) {
    bez(P, i / 24, b);
    len += a.distanceTo(b);
    a.copy(b);
  }
  return len;
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
