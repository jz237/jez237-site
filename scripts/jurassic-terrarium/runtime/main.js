// Jurassic Terrarium: the dinosaur module for Weatherglass.
//
// Registers itself with window.__wg.addModule, so it is updated and rendered inside Weatherglass's
// own loop (after the vegetation and wildlife, before the clouds). Models are rigged GLBs built in
// Blender (scripts/jurassic-terrarium/blender); each comes with a JSON sidecar describing its size,
// gait speeds and clips.
import { Group, Object3D, Vector3, Quaternion, AnimationMixer, LoopOnce, LoopRepeat, MathUtils, Mesh, SphereGeometry, MeshStandardMaterial, Box3, Ray, Raycaster } from 'three';

const _ka = new Vector3(), _kb = new Vector3(), _kc = new Vector3(), _kd = new Vector3();
const _tv = new Vector3(), _tq1 = new Quaternion(), _tq2 = new Quaternion();
// Close-up dressing shared by walkers and flyers: the skin shader (light through thin skin, mud, creases,
// sheen, nostrils) and the eyes (lids, saccades), each with its own uniforms on its own material copies
function dress(owner) {
  owner.model.traverse((o) => {
    if (!o.isSkinnedMesh || !/_skin/.test(o.material?.name || '') || !o.geometry.userData.jtSkin) return;
    if (!o.material.userData.jtOwn) (o.material = o.material.clone()), (o.material.userData.jtOwn = true);
    owner.skinU = skinUniforms(o.geometry.userData.jtSkin, SCALES[owner.sp.id]);
    owner.skinMesh = o;
    skinShader(o.material, owner.skinU, owner.mod.ctx.uniforms, { membrane: !!owner.sp.flyer });
    owner.lidColour = o.geometry.userData.jtLid || (o.geometry.userData.jtLid = averageColour(o.material.map));
  });
  owner.model.traverse((o) => {
    if (!o.isSkinnedMesh || !/_eye$/.test(o.material?.name || '') || !o.geometry.userData.jtEye) return;
    if (!o.material.userData.jtOwn) (o.material = o.material.clone()), (o.material.userData.jtOwn = true);
    owner.eyeU = eyeUniforms(owner.lidColour?.clone().multiplyScalar(0.8));
    eyeShader(o.material, owner.eyeU);
  });
}

// lids and eyeballs: blinks (now and then a double), drowsy and shut lids, quick small saccades that lean
// towards whatever the animal is watching
function faceEyes(o, dt, { shut = 0 } = {}) {
  const E = o.eyeU;
  if (!E) return;
  o._blinkT = (o._blinkT ?? 1 + rand() * 4) - dt;
  if (o._blinkT <= 0) {
    o._blinkPh = 0;
    o._blinkT = rand() < 0.15 ? 0.3 : 2.5 + rand() * 5;
  }
  let b = shut;
  if (o._blinkPh !== undefined) {
    o._blinkPh += dt;
    const p = o._blinkPh / 0.17;
    if (p >= 1) o._blinkPh = undefined;
    else b = Math.max(b, Math.sin(Math.PI * p));
  }
  E.uBlink.value += (b - E.uBlink.value) * Math.min(1, dt * (b > E.uBlink.value ? 40 : 14));
  o._sacT = (o._sacT ?? 0) - dt;
  if (o._sacT <= 0) {
    o._sacT = 0.3 + rand() * 2.2;
    o._eyeGoal = [MathUtils.clamp((rand() - 0.5) * 0.3 + (o._look?.yaw || 0) * 0.4, -0.22, 0.22), MathUtils.clamp((rand() - 0.5) * 0.12 + (o._look?.pitch || 0) * 0.3, -0.1, 0.1)];
  }
  const g = o._eyeGoal || [0, 0], e = E.uEyeRot.value, k = Math.min(1, dt * 30);
  e.x += (g[0] - e.x) * k;
  e.y += (g[1] - e.y) * k;
}

// distance in plan from (px, pz) to the segment a-b
function segDist2D(px, pz, ax, az, bx, bz) {
  const ex = bx - ax, ez = bz - az, L = ex * ex + ez * ez;
  const u = L > 1e-10 ? Math.max(0, Math.min(1, ((px - ax) * ex + (pz - az) * ez) / L)) : 0;
  return Math.hypot(px - ax - ex * u, pz - az - ez * u);
}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { skinCap, capLoaderTextures } from './skincap.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { NavGrid, fords } from './nav.js';
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
import { guardWater, guardMaterial } from './safety.js';
import { Atmosphere } from './atmosphere.js';
import { Contact } from './contact.js';
import { GroundCover } from './groundcover.js';
import { Interact } from './interact.js';
import { Backdrop } from './backdrop.js';
import { DinoWeather } from './weather.js';
import { Night } from './night.js';
import { Social } from './social.js';
import { Rocks } from './rocks.js';
import { Paths } from './paths.js';
import { prepareSkinGeometry, prepareEyeGeometry, prepareTeeth, Saliva, averageColour, skinUniforms, skinShader, eyeShader, eyeUniforms, SCALES } from './skin.js';
import { BufferGeometry as BG3, BufferAttribute as BA3, DoubleSide as DS3 } from 'three';

// One terrarium unit is 5.5 m: the 18 x 8 unit floor is a 100 x 44 m valley. Like a museum diorama,
// the animals are shown large against the landscape (Weatherglass pines become 6-8 m saplings).
export const METRES_PER_UNIT = 5.5;
const S = 1 / METRES_PER_UNIT;
// The den: must match DEN in tools/build-page.mjs (the terrain shelf under it).
const _jv = new Vector3(), _ja = new Vector3();
const _fa = new Vector3(), _fb = new Vector3(), _tq3 = new Quaternion();
const FLESH = Number(new URLSearchParams(location.search).get('flesh') ?? 1); // ?flesh=0 off, >1 exaggerated (testing)
const DEN = window.__jtDen || { x: 5.4, z: -1.55, hx: 1.25, hz: 0.95, y: 0.66, s: 1 / 6.2 };

// Species in the case. 'ready' species are loaded; the rest show in the field guide as hatching soon.
const SPECIES = [
  {
    id: 'trex', bodyR: 0.19, ready: true, count: 1, clearance: 0.1, maxWater: 0.7, maxSlope: 0.32, predator: true, den: true, gaitSwing: 0.045,
    acts: { wander: 4, trail: 1.5, sniff: 2, roar: 1, drink: 1, hunt: 2, yawn: 0.5, rub: 0.7, scratch: 0.5 },
    sounds: { roar: 'roar', sniff: 'sniff', idle: 'boom' }, step: 3, feet: [0, 0.5],
    common: 'Tyrannosaurus', badge: 'predator', dot: '#8a6a45',
    era: 'Late Cretaceous, 68–66 million years ago · western North America',
    size: '12.3 m long, hips 3.1 m high', mass: 'about 8 tonnes', diet: 'meat: hadrosaurs, Triceratops',
    fact: 'The strongest bite of any land animal. A 2023 study of teeth and jaws suggests scaly lips covered the teeth when the mouth was shut, as in lizards.',
  },
  {
    id: 'triceratops', bodyR: 0.18, ready: true, count: 3, clearance: 0.07, maxWater: 0.6, maxSlope: 0.3, herd: true, flex: 0.9, gaitSwing: 0.065,
    acts: { wander: 2, trail: 1.5, graze: 4, drink: 1, alert: 1, threat: 1, yawn: 0.5, rub: 0.8, dustbath: 0.7, scratch: 0.5 }, standsGround: 0.45,
    sounds: { alert: 'grunt', threat: 'bellow' }, step: 2, feet: [0, 0.22, 0.5, 0.72],
    common: 'Triceratops', badge: 'herd', dot: '#7d6a4f',
    era: 'Late Cretaceous, 68–66 million years ago · western North America',
    size: '8.5 m long', mass: 'about 8 tonnes', diet: 'low plants, cropped with a parrot-like beak',
    fact: 'Healed Tyrannosaurus bite marks have been found on Triceratops frills and horns: some survived the attacks.',
  },
  {
    id: 'stegosaurus', bodyR: 0.12, ready: true, count: 2, clearance: 0.06, maxWater: 0.6, maxSlope: 0.3, herd: true,
    acts: { wander: 2, trail: 1.5, graze: 4, drink: 1, alert: 1, tailswing: 1, yawn: 0.5, rub: 0.8, dustbath: 0.7, scratch: 0.5 },
    sounds: { alert: 'grunt', tailswing: 'hiss' }, step: 1.4, feet: [0, 0.25, 0.5, 0.75],
    common: 'Stegosaurus', badge: 'browser', dot: '#a5603a',
    era: 'Late Jurassic, 155–150 million years ago · western North America',
    size: '6.5 m long', mass: 'about 3.5 tonnes', diet: 'ferns, cycads and other low plants',
    fact: 'Its 17 plates alternate in two rows. An Allosaurus tail bone has been found pierced by a Stegosaurus tail spike.',
  },
  {
    id: 'brachiosaurus', bodyR: 0.16, ready: true, count: 1, clearance: 0.1, maxWater: 0.75, maxSlope: 0.28, noRun: true, tooBig: true, flex: 0.8, gaitSwing: 0.04,
    acts: { wander: 2, trail: 1.5, browse: 4, drink: 1.6, alert: 1, yawn: 0.5, rub: 0.6 },
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

// procedural idles (no clip of their own): played on top of idle (or rest) by Dino.performFrame
const PERFORM = new Set(['yawn', 'rub', 'dustbath', 'scratch', 'shake']);

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
    for (const m of this.skins) m.userData.jtOwn = true;
    for (const m of this.eyes || []) m.userData.jtOwn = true;
    dress(this);
    // the T. rex: saliva strung between its teeth when it roars
    this.model.traverse((o) => {
      const pairs = o.isSkinnedMesh && o.geometry.userData.jtStrands;
      if (pairs?.length && !this.saliva)
        this.saliva = new Saliva(o, pairs, { Mesh, BufferGeometry: BG3, BufferAttribute: BA3, MeshStandardMaterial, DoubleSide: DS3 }, guardMaterial, mod.ctx.scene);
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
      if (this._jig) this._jig.kick += (running ? 9 : 5) * this.feet.weight; // the flesh drops as the foot lands
      mod.contact?.footprint(this, p, this.heading, !this.sp.predator);
      const T = mod.ctx.terrain;
      if (Math.max(T.lakeMask(p.x, p.z), T.riverMask(p.x, p.z)) > 0.35)
        mod.ctx.modules.water?.ripple?.(p.x, p.z, Math.min(0.12, 0.025 + this.length * 0.02), running ? 1.4 : 0.9);
      // a foot coming down in water throws up a splash (bigger at a run, and for the big animals)
      const sy = mod.waterSurface(p.x, p.z);
      if (sy != null && sy > T.height(p.x, p.z) + 0.012 && (this.splashT ?? 0) < performance.now()) {
        this.splashT = performance.now() + 140;
        mod.effects.splash(p.x, p.z, sy, Math.min(1.3, 0.25 + this.length * 0.22) * (running ? 1.5 : 1));
      }
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
    // how far ahead of its feet the muzzle comes down to drink (the lowest point of the drink clip)
    if (this.actions.drink && this.headBone) {
      const p = new Vector3();
      let low = null;
      this.sampleClip('drink', [0.3, 0.4, 0.5, 0.6, 0.7], () => {
        this.headBone.getWorldPosition(p);
        if (!low || p.y < low.y) low = { y: p.y, fwd: Math.hypot(p.x, p.z) };
      });
      this.drinkLow = low;
      this.drinkReach = Math.max(0.2, low.fwd * 0.95);
    }
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
      ([k]) => k === 'wander' || k === 'drink' || k === 'trail' || PERFORM.has(k) || (k === 'hunt' && prey) || this.actions[k],
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
    this._trailWalk = false;
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

  // Flesh in motion (see skin.js): springs for the belly, the throat and the thigh mass, driven by the
  // body's acceleration in its own frame (the flesh lags as it speeds up, slows and turns) and kicked
  // down by each footfall; the ribcage swelling with each breath (deeper after a run); the muscle at the
  // top of each leg bunching as the leg swings away from its rest pose. Sizes in metres of the animal.
  flesh(dt) {
    const U = this.skinU;
    if (!U || dt <= 0) return;
    const J = this._jig || (this._jig = {
      x: [new Vector3(), new Vector3(), new Vector3()], v: [new Vector3(), new Vector3(), new Vector3()],
      pv: new Vector3(), pp: this.root.position.clone(), legs: null, kick: 0,
    });
    const ws = this._skinWS ??= this.skinMesh?.getWorldScale(new Vector3()).x || this.model.scale.x;
    const Lm = this.info?.length || 6; // the body's length in the bind pose's metres (a hatchling shares its mother's)
    // velocity and acceleration of the body, in metres, in its own frame (x side, y up, z forward)
    const p = this.root.position, vel = _jv.copy(p).sub(J.pp).divideScalar(dt * ws);
    J.pp.copy(p);
    if (!J.started) (J.started = true), J.pv.copy(vel);
    const acc = _ja.copy(vel).sub(J.pv).divideScalar(dt);
    J.pv.copy(vel);
    acc.clampLength(0, 12);
    const h = this.heading, c = Math.cos(h), sn = Math.sin(h);
    const ax = acc.x * c - acc.z * sn, az = acc.x * sn + acc.z * c, ay = acc.y;
    // per group: stiffness, damping ratio, how far it may swing (fraction of the body's length)
    const G = [[55, 0.28, 0.012], [80, 0.3, 0.008], [130, 0.35, 0.005]];
    const kick = J.kick;
    J.kick = 0;
    for (let g = 0; g < 3; g++) {
      const [k, z, lim] = G[g], x = J.x[g], v = J.v[g], w = Math.sqrt(k);
      v.x += (-k * x.x - 2 * z * w * v.x - ax) * dt;
      v.y += (-k * x.y - 2 * z * w * v.y - ay - kick * (g === 1 ? 0.6 : 1)) * dt;
      v.z += (-k * x.z - 2 * z * w * v.z - az) * dt;
      x.addScaledVector(v, dt);
      // a soft end stop: past its reach the flesh is held back and loses its swing
      if (x.length() > Lm * lim) x.setLength(Lm * lim), v.multiplyScalar(0.6);
      U.uJig.value[g].copy(x).multiplyScalar(FLESH);
    }
    // breathing (the feet module keeps the breath, quicker and deeper after a run)
    const F = this.feet;
    U.uBreath.value = FLESH * Lm * 0.0028 * (1 + 2.2 * (F?.puff || 0)) * (0.5 + 0.5 * Math.sin(F?.breathT || 0));
    // the legs: how far each has swung from its rest pose
    if (!J.legs && this.skinMesh?.skeleton) {
      const bones = this.skinMesh.skeleton.bones;
      J.legs = ['thighL', 'thighR', 'upperarmL', 'upperarmR'].map((n) => {
        const b = bones.find((o) => o.name === n);
        return b ? { b, i: bones.indexOf(b), q0: b.quaternion.clone(), a: 0 } : null;
      });
      U.uLegIdx.value.set(...J.legs.map((l) => (l ? l.i : -1)));
    }
    if (J.legs) {
      const out = [0, 0, 0, 0];
      J.legs.forEach((l, i) => {
        if (!l) return;
        const dq = Math.min(1, Math.abs(l.b.quaternion.dot(l.q0)));
        const ang = 2 * Math.acos(dq);
        l.a += (ang - l.a) * Math.min(1, dt * 12);
        out[i] = Math.min(1, Math.max(0, (l.a - 0.08) * 2.2)) * Lm * 0.006;
      });
      U.uLegFlex.value.set(...out.map((x) => x * FLESH));
    }
  }

  // A muzzle in the water: rings spread from it while it drinks; lifted, water runs off the chin
  drinkFx(dt) {
    const mod = this.mod, h = this.headBone;
    if (!h) return;
    // the extra bow: steered by how far the muzzle still is above the water, through the middle of the sip
    const sipping = this.currentName === 'drink' && this.current && this.state === 'drinking';
    const u = sipping ? this.current.time / this.current.getClip().duration : 0;
    // (measured at the snout's tip, where the skin has one; otherwise the head)
    const tip = () => mod.weather?.vert(this, this.skinMesh?.geometry.userData.jtSkin?.snoutIdx ?? -1, _kd) || h.getWorldPosition(_kd);
    if (sipping && u > 0.2 && u < 0.8) {
      const p = tip(), sy = mod.waterSurface(p.x, p.z) ?? mod.ctx.terrain.height(p.x, p.z);
      const err = p.y - (sy - 0.005);
      this.drinkDip = MathUtils.clamp((this.drinkDip || 0) + err * dt * 0.9, 0, 1.2);
    } else this.drinkDip = Math.max(0, (this.drinkDip || 0) - dt * (sipping ? 0.8 : 0.5));
    if (this.currentName === 'drink') {
      const p = tip(), sy = mod.waterSurface(p.x, p.z);
      if (sy != null && p.y < sy + 0.03) {
        this._chin = 2.5;
        if ((this._ripT = (this._ripT || 0) - dt) <= 0) {
          this._ripT = 0.3 + rand() * 0.3;
          mod.ctx.modules.water?.ripple?.(p.x, p.z, Math.min(0.1, 0.03 + this.length * 0.012), 0.8);
        }
      }
    } else if ((this._chin || 0) > 0) {
      this._chin -= dt;
      if ((this._dripC = (this._dripC || 0) + dt * 9) >= 1) {
        this._dripC -= 1;
        const p = h.getWorldPosition(_kd);
        mod.effects.drip(p, Math.max(mod.ctx.terrain.height(p.x, p.z), mod.waterSurface(p.x, p.z) ?? -9), Math.min(1.8, 0.8 + this.length * 0.25));
      }
    }
  }

  // Skin and face, each frame: mud up to the water line (fresh and wet, then drying paler and slowly
  // wearing off; rain washes it), neck creases with the bend, nostrils flaring with each breath, a sniff or
  // a roar, the throat pulsing while it calls, and the eyes
  skinFrame(dt) {
    const U = this.skinU, mod = this.mod, T = mod.ctx.terrain, env = this._env || {};
    const t = (this._ft = (this._ft || 0) + dt);
    if (U) {
      const sc = this.model.scale.x, g = T.height(this.pos.x, this.pos.z), sy = mod.waterSurface(this.pos.x, this.pos.z);
      if (sy != null && sy > g + 0.004) {
        const line = (sy - g) / sc + (this.speed > 0.05 ? 0.35 : 0.15) + (this.swimming ? 0.4 : 0);
        U.uMudLine.value = U.uMudAmt.value > 0.05 ? Math.max(U.uMudLine.value, line) : line;
        U.uMudAmt.value = 1;
        U.uMudWet.value = 1;
      } else {
        U.uMudWet.value = Math.max(0, U.uMudWet.value - dt / 80);
        U.uMudAmt.value = Math.max(0, U.uMudAmt.value - dt / ((env.rain || 0) > 0.3 ? 45 : 420));
        // soft banks: the feet pick up mud as they walk
        const bank = Math.max(T.lakeMask(this.pos.x, this.pos.z), T.riverMask(this.pos.x, this.pos.z));
        if (bank > 0.06 && this.speed > 0.03) {
          const foot = (this.hipHeight() / sc) * 0.28;
          U.uMudLine.value = U.uMudAmt.value > 0.05 ? Math.max(U.uMudLine.value, foot) : foot;
          U.uMudAmt.value = Math.max(U.uMudAmt.value, 0.75);
          U.uMudWet.value = Math.max(U.uMudWet.value, 0.8);
        }
      }
      const lk = this._look, bowed = /graze|drink|browse/.test(this.currentName || '') ? 0.75 : 0;
      const bend = Math.min(1, Math.max(bowed, (lk ? Math.abs(lk.yaw) * 1.1 + Math.abs(lk.pitch) * 1.4 : 0) + Math.abs(this.yawRate) * 0.6));
      U.uBend.value += (bend - U.uBend.value) * Math.min(1, dt * 3);
      const name = this.currentName;
      let flare = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * (this.speed > 0.2 ? 4.5 : 1.7)));
      if (name === 'sniff') flare = 0.45 + 0.45 * Math.sin(t * 15);
      if (name === 'roar' || name === 'threat' || name === 'alert') flare = 1;
      U.uFlare.value += (flare - U.uFlare.value) * Math.min(1, dt * 10);
      this.flesh(dt);
      // the scales' relief, from metres in the bind pose to the view's units
      if (U.uScaleH.value > 0) U.uScaleH.value = (SCALES[this.sp.id]?.h ?? 0.012) * (this._skinWS ??= this.skinMesh?.getWorldScale(new Vector3()).x || this.model.scale.x);
    }
    // the throat pulses with each call
    if ((this._callT || 0) > 0) {
      this._callT -= dt;
      const k = 1 + 0.08 * Math.sin(t * 17) * Math.min(1, this._callT * 3);
      for (const b of this.flex.neck.slice(0, 2)) (b.scale.x *= k), (b.scale.y *= k);
    }
    let shut = this.state === 'sleep' ? 1 : this.state === 'shelter' ? 0.35 : this.state === 'idle' && (env.night || 0) > 0.4 ? 0.45 : 0;
    if (this.perf?.kind === 'yawn') shut = Math.max(shut, (this._yawnShut || 0) * 0.9);
    // eyes narrowed against a strong wind, and a little against the rain
    shut = Math.max(shut, MathUtils.smoothstep(this.windS || 0, 0.5, 1.6) * 0.5, (env.rain || 0) * (this.state === 'shelter' ? 0.1 : 0.25));
    faceEyes(this, dt, { shut });
    if (this.saliva) this.saliva.update(dt, this.currentName === 'roar', mod.ctx.camera.position, this.model.scale.x, { x: Math.sin(this.heading), z: Math.cos(this.heading) });
  }

  // Trunk guard: the routes keep the body clear of every trunk, but steering cuts corners, a turning body
  // swings its hips and tail, and a head dips to sniff. So, on the final pose, the body is tested as a
  // chain of capsules (each bone to its child, its radius measured from the skin bound to that bone),
  // and if any capsule below a tree's crown reaches into a trunk, the animal slides straight off it.
  buildCapsules() {
    const caps = [], byBone = new Map();
    this.root.updateMatrixWorld(true);
    const v = new Vector3(), a = new Vector3(), b = new Vector3();
    this.model.traverse((o) => {
      if (!o.isBone || /claw|finger|eye/i.test(o.name)) return;
      const kid = o.children.find((c) => c.isBone);
      const cap = { a: o, b: kid || null, r: 0, d: [], dn: [] };
      caps.push(cap);
      byBone.set(o, cap);
    });
    // the skin round each bone: horizontal distance of its vertices from the bone's segment
    this.model.traverse((m) => {
      if (!m.isSkinnedMesh) return;
      const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight, n = m.geometry.attributes.position.count;
      for (let i = 0; i < n; i += 3) {
        let best = 0, bw = -1;
        for (let c = 0; c < 4; c++) if (sw.getComponent(i, c) > bw) (bw = sw.getComponent(i, c)), (best = si.getComponent(i, c));
        const cap = byBone.get(m.skeleton.bones[best]);
        if (!cap) continue;
        m.getVertexPosition(i, v).applyMatrix4(m.matrixWorld);
        cap.a.getWorldPosition(a);
        if (cap.b) cap.b.getWorldPosition(b);
        else b.copy(a);
        cap.d.push(segDist2D(v.x, v.z, a.x, a.z, b.x, b.z));
        cap.dn.push(Math.max(0, Math.min(a.y, b.y) - v.y)); // how far the skin hangs below the bone
      }
    });
    const scale = this.model.scale.x;
    for (const c of caps) {
      c.d.sort((x, y) => x - y);
      c.r = c.d.length ? c.d[Math.floor(c.d.length * 0.97)] / scale : 0; // per unit of model scale (horn tips included)
      c.dn.sort((x, y) => x - y);
      c.down = c.dn.length ? c.dn[Math.floor(c.dn.length * 0.97)] / scale : 0;
      delete c.d;
      delete c.dn;
    }
    this._caps = caps.filter((c) => c.r > 0);
  }

  keepOffTrunks() {
    const grid = this.mod.trunkGrid;
    if (!grid) return;
    if (!this._caps) this.buildCapsules();
    const scale = this.model.scale.x;
    let px = 0, pz = 0;
    for (const c of this._caps) {
      const a = c.a.getWorldPosition(_ka), b = c.b ? c.b.getWorldPosition(_kb) : _kb.copy(a), r = c.r * scale, down = c.down * scale;
      const gx = Math.floor((a.x + b.x) / 1.0), gz = Math.floor((a.z + b.z) / 1.0); // midpoint's 0.5 cell
      for (let di = -1; di <= 1; di++)
        for (let dj = -1; dj <= 1; dj++) {
          const cell = grid.get(gx + di + ',' + (gz + dj));
          if (!cell) continue;
          for (const t of cell) {
            if (t.kind === 'cycad' && this.sp.tooBig) continue; // stubby: a sauropod straddles them
            // closest point of the segment to the trunk's axis (in plan), and its height
            const ax = a.x + px, az = a.z + pz, bx = b.x + px, bz = b.z + pz;
            const ex = bx - ax, ez = bz - az, L = ex * ex + ez * ez;
            const u = L > 1e-8 ? Math.max(0, Math.min(1, ((t.x - ax) * ex + (t.z - az) * ez) / L)) : 0;
            const cx = ax + ex * u, cz = az + ez * u, cy = a.y + (b.y - a.y) * u;
            if (cy - Math.max(r, down) > t.crownY) continue; // the belly hangs lower than the bone
            // (the trunk it is rubbing on may press into the skin a little)
            const dx = cx - t.x, dz = cz - t.z, d = Math.hypot(dx, dz), need = t === this.rubTrunk ? t.r + r * 0.6 : t.r + r + 0.012;
            if (d >= need) continue;
            const nx = d > 1e-4 ? dx / d : Math.cos(this.heading), nz = d > 1e-4 ? dz / d : -Math.sin(this.heading);
            px += nx * (need - d);
            pz += nz * (need - d);
          }
        }
    }
    // solid rock (the den, for all but its owner): push the body back out through the nearest face
    if (!this.sp.den)
      for (const B of this.mod.solidBoxes || []) {
        for (const c of this._caps) {
          const a = c.a.getWorldPosition(_ka), b = c.b ? c.b.getWorldPosition(_kb) : _kb.copy(a), r = c.r * scale;
          for (const u of [0, 0.5, 1]) {
            const x = a.x + (b.x - a.x) * u + px, z = a.z + (b.z - a.z) * u + pz, y = a.y + (b.y - a.y) * u;
            if (y - r > B.top || x < B.x0 - r || x > B.x1 + r || z < B.z0 - r || z > B.z1 + r) continue;
            const ox = [x - (B.x0 - r), B.x1 + r - x], oz = [z - (B.z0 - r), B.z1 + r - z];
            const mn = Math.min(ox[0], ox[1], oz[0], oz[1]);
            if (mn === oz[1]) pz += oz[1];
            else if (mn === ox[0]) px -= ox[0];
            else if (mn === ox[1]) px += ox[1];
            else pz -= oz[0];
          }
        }
      }
    if (!px && !pz) return;
    const m = Math.hypot(px, pz), walking = this.state === 'walk' || this.state === 'flee' || this.state === 'hunt' || this.state === 'circle';
    const cap = walking ? 0.03 : 0.012;
    if (m > cap) (px *= cap / m), (pz *= cap / m);
    // standing and being pressed off something: take a step away rather than slide
    if (!walking && !/^(sleep|perform|standoff|drinking)$/.test(this.state) && !this.parent) {
      this._pressed = (this._pressed || 0) + m;
      if (this._pressed > 0.03 * this.length) {
        this._pressed = 0;
        const t = this.layer.nearestOpen(this.pos.x + (px / m) * this.length * 0.25, this.pos.z + (pz / m) * this.length * 0.25);
        if (t) this.goTo(t.x, t.z, null);
      }
    }
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
    this._env = env;
    const mod = this.mod;
    const night = env.night > 0.6;
    // rain darkens and glosses the skin; it dries slowly afterwards
    const T = mod.ctx.terrain;
    this.inWater = Math.max(T.lakeMask(this.pos.x, this.pos.z), T.riverMask(this.pos.x, this.pos.z));
    if (this.inWater > 0.35) this._dripT = 8;
    else if (this._dripT > 0) this._dripT -= dt;
    let wantWet = Math.min(1, Math.max(env.rain * 1.5 + env.wet * 0.6, this.inWater > 0.35 ? 0.85 : 0));
    if ((this._shookT || 0) > 0) (this._shookT -= dt), (wantWet = Math.min(wantWet, 0.3)); // shaken off: damp, not dripping
    this.wet = (this.wet || 0) + (wantWet - (this.wet || 0)) * Math.min(1, dt * (wantWet > (this.wet || 0) ? 0.5 : 0.08));
    for (const m of this.skins) {
      m.roughness = 1 - 0.45 * this.wet;
      m.color.setScalar(1 - 0.22 * this.wet);
    }
    if (this.skinU) {
      this.skinU.uWet.value = this.wet;
      // under the fronds (or asleep in the den) the rain hardly reaches it
      this.skinU.uRain.value = (env.rain || 0) * (this.state === 'shelter' ? 0.15 : this.sp.den && this.state === 'sleep' && this.inDen() ? 0 : 1);
    }
    if (env.rain > 0.3) this._shookRain = false;
    // snow settles on it while it falls (hardly at all under shelter or in the den), melts in a thaw
    {
      const w = mod.ctx.world, temp = mod.ctx.modules.life?.env?.temp ?? 15, fall = w.snowfall || 0;
      const under = this.state === 'shelter' || (this.sp.den && this.inDen?.());
      this.snow = MathUtils.clamp((this.snow || 0) + dt * (fall * 0.025 * (under ? 0.1 : 1) - Math.max(0, temp - 1) * 0.004 - (this.inWater > 0.35 ? 0.2 : 0)), 0, 1);
      if (this.skinU) {
        this.skinU.uSnow.value = this.snow;
        this.skinU.uSnowH.value = (this.info?.length || 6) * 0.004;
        this.skinU.uFrost.value = MathUtils.clamp((1 - temp) / 6, 0, 1);
      }
    }
    // the wind where it stands (for turning tail to a gale, and narrowed eyes)
    if (mod.weather) {
      this.windV = mod.weather.windAt(this.pos.x, this.pos.z, 0.3);
      this.windS = Math.hypot(this.windV.x, this.windV.z);
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
    if (!this.sp.predator && mod.predator && this.state !== 'flee' && this.state !== 'sleep' && this.state !== 'standoff' && !this.rally) {
      const p = mod.predator.pos;
      const dd = Math.hypot(p.x - this.pos.x, p.z - this.pos.z);
      const charging = mod.predator.state === 'hunt' && mod.predator.prey === this;
      if (this.sp.tooBig) {
        // too big to be prey: it doesn't run, it turns its head to watch (lookTarget follows the predator)
        const awake = mod.predator.state !== 'sleep' && mod.predator.speed > 0.03;
        if (awake && dd < 2.2 && this.state === 'idle' && this.actions.alert && (this.watchT ?? 0) < performance.now() && rand() < dt * 0.25) {
          this.watchT = performance.now() + 20000;
          this.oneShot('alert');
        }
      } else if ((dd < 1.6 || (charging && dd < 2.6)) && !night) {
        if (charging && this.sp.standsGround && this.actions.threat && rand() < this.sp.standsGround) {
          // face the predator and present the horns: a standoff (see Dinosaurs.standoff)
          this.heading = Math.atan2(p.x - this.pos.x, p.z - this.pos.z);
          mod.standoff(this, mod.predator);
          return this.finish(dt);
        }
        const ax = this.pos.x - p.x, az = this.pos.z - p.z;
        const k = 2.5 / Math.max(dd, 0.01);
        const t = this.layer.nearestOpen(this.pos.x + ax * k, this.pos.z + az * k);
        if (t && this.goTo(t.x, t.z, null, 'run')) this.state = 'flee';
      } else if (dd < 3 && this.state === 'idle' && this.actions.alert && rand() < dt * 0.3) this.oneShot('alert');
    }
    switch (this.state) {
      case 'standoff': {
        // stand square to the predator: horns lowered, a bellow, a forefoot stamped, again and again
        const f = this.foe;
        if (f) {
          const want = Math.atan2(f.pos.x - this.pos.x, f.pos.z - this.pos.z);
          const dh = Math.atan2(Math.sin(want - this.heading), Math.cos(want - this.heading));
          this.heading += Math.sign(dh) * Math.min(Math.abs(dh), dt * 0.9);
        }
        this.showT = (this.showT ?? 0) - dt;
        if (this.perf?.kind === 'stamp' && (this.perf.t += dt) >= this.perf.len) this.perf = null;
        if (this.showT <= 0 && !this.perf) {
          this.showT = 1.8 + rand() * 1.8;
          if (rand() < 0.55 && this.actions.threat) {
            this.play('idle', 0.3);
            this.play('threat', 0.25);
            if (rand() < 0.6) this.mod.voice.play(this.sp.sounds?.threat || 'grunt', this.root.position, this.stepSize);
          } else {
            this.play('idle', 0.4);
            this.perf = { kind: 'stamp', t: 0, len: 1.1, side: rand() < 0.5 ? -1 : 1 };
          }
        }
        if (this.timer <= 0 || !f || (f.state !== 'circle' && f.state !== 'oneshot')) {
          this.foe = null;
          this.rally = null;
          this.perf = null;
          this.rest(0.6);
        }
        break;
      }
      case 'circle':
        this.circleStep(dt);
        break;
      case 'social': // driven by its scene (social.js)
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
        // just out of the water: shake it off
        if ((this._dripT || 0) > 0 && !this.swimming && this.inWater < 0.05 && rand() < 0.8) {
          this._dripT = 0;
          this.perform('shake');
          break;
        }
        // the rain has stopped: shake the water off
        if (env.rain < 0.08 && (this.wet || 0) > 0.5 && !this._shookRain && !this.swimming && this.inWater < 0.05) {
          this._shookRain = true;
          this._shookT = 45;
          this.perform('shake');
          break;
        }
        // snow piling up on its back: shake it off now and then
        if ((this.snow || 0) > 0.45 && !this.swimming && rand() < dt * 0.06) {
          this.perform('shake');
          break;
        }
        // a strong wind: turn tail to it, head down, and wait it out
        if ((this.windS || 0) > 0.75 && rand() < dt * 0.8) {
          const down = Math.atan2(this.windV.x, this.windV.z);
          if (Math.abs(Math.atan2(Math.sin(down - this.heading), Math.cos(down - this.heading))) > 0.6) {
            this.turnTo = down;
            this.turnThen = 'idle';
            this.state = 'turn';
            break;
          }
        }
        // rain: the herbivores get under the tree ferns (sauropods don't bother)
        if (env.rain > 0.35 && !this.sp.predator && !this.sp.tooBig && this.shelter()) break;
        if ((night || env.storm > 0.6 || env.rain > 0.35) && this.sp.den && !this.inDen()) {
          this.goDen();
          break;
        }
        // nightfall: the herd gathers side by side to sleep
        if (!night) this._huddled = false;
        if (night && this.sp.herd && !this.parent && !this._huddled) {
          this._huddled = true;
          const spot = mod.huddleSpot(this);
          const sleep = () => {
            this.state = 'sleep';
            this.play('rest', 1.5);
          };
          if (spot && Math.hypot(spot.x - this.pos.x, spot.z - this.pos.z) > 0.2 && this.goTo(spot.x, spot.z, () => {
            this.turnTo = spot.face;
            this.turnThen = sleep;
            this.state = 'turn';
          })) break;
        }
        if (night || (this.sp.den && (env.storm > 0.6 || env.rain > 0.35))) {
          this.state = 'sleep';
          this.play('rest', 1.5);
          break;
        }
        // in a gale they mostly hunker down where they are rather than wander about
        if (this.timer <= 0 && (this.windS || 0) > 0.75 && rand() < 0.6) this.timer = 4 + rand() * 5;
        if (this.timer <= 0) this.act(this.chooseAct());
        break;
      case 'oneshot':
        if (this.timer <= 0) this.rest(0.6);
        break;
      case 'drinking':
        // sip, lift the head a moment (water running off the chin), sip again
        if (this.timer <= 0) {
          if (this.currentName === 'drink') {
            // a sip done: the last, or the head comes up a moment
            if (--this.sips <= 0) {
              this.rest(0.8);
              break;
            }
            this.play('idle', 0.7);
            this.timer = 1.2 + rand() * 1.2;
          } else {
            this.play('drink', 0.6);
            this.timer = this.actions.drink.getClip().duration - 0.3;
          }
        }
        break;
      case 'perform':
        this.perf.t += dt;
        if (this.perf.t >= this.perf.len) {
          this.perf = null;
          this.rubTrunk = null;
          this.rest(0.6);
        }
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
          if (typeof this.turnThen === 'function') {
            const fn = this.turnThen;
            this.turnThen = null;
            this.rest(0.4);
            fn();
          } else if (this.turnThen === 'idle') {
            this.turnThen = null;
            this.rest(0.6);
            this.timer = 5 + rand() * 6;
          } else {
            this.state = 'sleep';
            this.play('rest', 1.2);
          }
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
    this.drinkFx(dt);
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
        look: (this._look = this.lookTarget(dt)),
        calm: moving ? 0.35 : this.state === 'sleep' ? 0.15 : 1,
        gait: this.gaitWave(),
      });
      // feet onto the real ground (not while lying down), and breathing
      const stepping = (this.state === 'walk' || this.state === 'flee' || this.state === 'hunt') && this.speed > 0.01;
      // the idles sway the body first; the feet are then planted under it
      this.performFrame(dt);
      this.feet.update(dt, { running: this.currentName === 'run', enabled: this.currentName !== 'rest' && !this.swimming && this.perf?.kind !== 'scratch' && this.perf?.kind !== 'stamp', moving: stepping || this.state === 'turn' || !!this._socTurn, plant: /^(shake|rub|yawn)$/.test(this.perf?.kind || '') });
      this.keepOffTrunks();
      this.keepInside();
      this.skinFrame(dt);
    }
    this.crop(dt);
    this.waterTouch(dt);
    this.vocalize(dt);
    if (this.eyes) {
      const night = this.mod.ctx.modules.life?.env?.night ?? 0;
      for (const m of this.eyes) m.emissiveIntensity = 0.35 * night;
    }
    this.sounds(dt);
  }

  // calls tied to what the animal is doing (each call has several variants, never the same twice running)
  vocalize(dt) {
    const mod = this.mod, V = mod.voice, at = this.root.position, size = this.stepSize;
    const T = (this._vt = this._vt || {});
    const tick = (k, lo, hi) => {
      T[k] = (T[k] ?? lo + rand() * (hi - lo)) - dt;
      if (T[k] > 0) return false;
      T[k] = lo + rand() * (hi - lo);
      return true;
    };
    if (this.state === 'sleep') {
      if (tick('snore', 4, 7.5)) V.play('snore', at, size);
      return;
    }
    if (this.parent) {
      // hatchlings peep; fast and often when they've lost their mother or are running
      const m = this.parent, far = Math.hypot(m.pos.x - this.pos.x, m.pos.z - this.pos.z) > 1.5 || this.state === 'flee';
      if (tick('peep', far ? 1.4 : 5, far ? 2.6 : 12)) {
        V.play('peep', at, 1);
        // she answers a lost one now and then (not every peep)
        if (far && rand() < 0.3 && (m._answered ?? 0) < performance.now() - 6000) {
          m._answered = performance.now();
          mod.later(0.5 + rand() * 0.5, () => V.play('answer', m.root.position, m.stepSize));
        }
      }
      return;
    }
    if (this.sp.predator) {
      if (this.state === 'hunt' && tick('stalk', 3.5, 6)) V.play('stalk', at, size);
      return;
    }
    if (this.currentName === 'browse' && tick('purr', 2.5, 4.5)) V.play('purr', at, size);
    // herd contact calls, answered by a nearby herd mate
    if (this.sp.herd && (this.state === 'idle' || this.state === 'walk') && tick('contact', 15, 40)) {
      V.play('contact', at, size);
      const mate = (mod.walkers || []).find((d) => d !== this && d.sp.id === this.sp.id && !d.parent && d.state !== 'sleep' &&
        Math.hypot(d.pos.x - this.pos.x, d.pos.z - this.pos.z) < 4);
      if (mate) mod.later(0.6 + rand() * 0.8, () => V.play('answer', mate.root.position, mate.stepSize));
    }
  }

  // wading leaves a wake; drinking rings the water at the mouth
  waterTouch(dt) {
    const W = this.mod.ctx.modules.water;
    if (!W?.ripple) return;
    this.wakeT = (this.wakeT ?? 0) - dt;
    // swimming: rings spreading round the body as it paddles
    if (this.swimming && this.wakeT <= 0) {
      this.wakeT = 0.45;
      const sy = this.mod.waterSurface(this.pos.x, this.pos.z);
      if (sy != null) this.mod.effects.splash(this.pos.x, this.pos.z, sy, 0.28);
    }
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
    const amp = (this.sp.gaitSwing ?? 0.075) * Math.min(1, this.speed / Math.max(0.01, this.clipSpeed('walk')) + 0.3);
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
    if (this.sp.predator && (this.prey || this.foe)) tgt = this.prey || this.foe;
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

  // The predator's half of a standoff: it prowls round the animal standing its ground at a wary distance,
  // head low and watching it, stops to roar at it, makes one feinting rush that pulls up short, then
  // roars once more and stalks off (and won't hunt again for a while).
  circleStep(dt) {
    const C = this.circle, f = this.foe;
    if (!C || !f) return this.rest(0.5);
    C.t += dt;
    const face = () => {
      const want = Math.atan2(f.pos.x - this.pos.x, f.pos.z - this.pos.z);
      const dh = Math.atan2(Math.sin(want - this.heading), Math.cos(want - this.heading));
      this.heading += Math.sign(dh) * Math.min(Math.abs(dh), dt * 1.2);
    };
    // the end: one last roar, then away
    if (C.t >= C.len || f.state !== 'standoff') {
      this.huntCool = this.mod.clock + 45 + rand() * 30;
      this.circle = null;
      const away = this.layer.nearestOpen(this.pos.x + (this.pos.x - f.pos.x) * 2.5, this.pos.z + (this.pos.z - f.pos.z) * 2.5);
      this.foe = null;
      this.path = null;
      this.speed = 0;
      if (!this.oneShot('roar', 0.3)) this.rest(0.5);
      if (away) this.mod.later(2.6, () => this.state === 'idle' || this.state === 'oneshot' ? this.goTo(away.x, away.z, null, 'walk') : 0);
      return;
    }
    // a roar at it, standing still
    if (C.hold > 0) {
      C.hold -= dt;
      this.speed *= Math.max(0, 1 - dt * 5);
      face();
      if (C.hold <= 0) this.play('walk', 0.4);
      return;
    }
    if (!C.roared && C.t > C.len * 0.22) {
      C.roared = true;
      this.path = null;
      this.play('roar', 0.3);
      C.hold = (this.actions.roar?.getClip().duration || 2) * 0.9;
      this.mod.voice.play(this.sp.sounds?.roar || 'roar', this.root.position, this.stepSize);
      this.mod.roared(this);
      f.showT = 0.2; // it answers
      return;
    }
    // the feint: a short rush straight at it, pulled up short
    if (!C.feinted && C.t > C.feint) {
      C.feinted = true;
      const dx = this.pos.x - f.pos.x, dz = this.pos.z - f.pos.z, d = Math.hypot(dx, dz) || 1, stop = f.length * 0.5 + this.length * 0.5;
      const t = this.layer.nearestOpen(f.pos.x + (dx / d) * stop, f.pos.z + (dz / d) * stop);
      const path = t && this.layer.path(this.pos.x, this.pos.z, t.x, t.z);
      if (path && path.length > 1) (this.path = path), (this.pathIdx = 1), (C.rush = 1.4);
      f.showT = 0.5;
      for (const m of this.mod.duel?.mates || []) if (m.state === 'standoff') m.showT = 0.3 + rand() * 0.5;
    }
    if (C.rush > 0) {
      C.rush -= dt;
      this.gait = 'run';
      if (!this.path || C.rush <= 0) {
        C.rush = 0;
        this.path = null;
        C.hold = 1.2; // pulled up short, glaring
        this.play('idle', 0.3);
        return;
      }
      return this.walkStep(dt, true);
    }
    // prowling: the next point on an arc round it
    if (!this.path) {
      const a0 = Math.atan2(this.pos.x - f.pos.x, this.pos.z - f.pos.z), a = a0 + C.dir * 0.6;
      const R = (f.length * 0.5 + this.length * 0.6) * (1.15 + 0.15 * Math.sin(C.t * 0.6));
      const t = this.layer.nearestOpen(f.pos.x + Math.sin(a) * R, f.pos.z + Math.cos(a) * R);
      const path = t && this.layer.path(this.pos.x, this.pos.z, t.x, t.z);
      if (path && path.length > 1) (this.path = path), (this.pathIdx = 1);
      else (C.dir *= -1), (C.hold = 0.8);
      if (!this.path) return;
    }
    this.gait = 'walk';
    this.walkStep(dt, true);
    if (this.current) this.current.timeScale *= 0.8; // a slow, deliberate prowl
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
      if ((this.huntCool || 0) > this.mod.clock) return void this.act('wander'); // still smarting from the last standoff
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
      // the Brachiosaurus goes down to the pool itself and drinks long, sip after sip
      const big = this.sp.tooBig && this.actions.drink;
      const shore = mod.shore(this, big);
      const drink = () => {
        if (!big) return this.oneShot(this.actions.drink ? 'drink' : 'sniff');
        this.sips = 3 + Math.floor(rand() * 2);
        this.oneShot('drink', 0.6);
        this.state = 'drinking';
      };
      // on arrival, turn to face the water, then drink
      const faceIt = () => {
        this.turnTo = shore.face;
        this.turnThen = drink;
        this.state = 'turn';
      };
      if (!shore || !this.goTo(shore.x, shore.z, faceIt)) this.timer = 1;
    } else if (kind === 'rub') {
      // to the nearest trunk, flank to it
      const t = (this.mod.trunks || []).filter((t) => t.kind !== 'stand' && t.kind !== 'cabin' && t.kind !== 'cycad' && Math.hypot(t.x - this.pos.x, t.z - this.pos.z) < 6)
        .sort((a, b) => Math.hypot(a.x - this.pos.x, a.z - this.pos.z) - Math.hypot(b.x - this.pos.x, b.z - this.pos.z))[0];
      // the open ground at the trunk's flank, on this side of it
      const reach = t ? t.r + (this.sp.bodyR ?? 0.12) * this.k + 0.08 : 0, dd = t ? Math.hypot(this.pos.x - t.x, this.pos.z - t.z) || 1 : 1;
      const spot = t && this.layer.nearestOpen(t.x + ((this.pos.x - t.x) / dd) * reach, t.z + ((this.pos.z - t.z) / dd) * reach);
      if (t && spot && Math.hypot(spot.x - this.pos.x, spot.z - this.pos.z) < 0.3 && Math.hypot(this.pos.x - t.x, this.pos.z - t.z) < reach + 0.4) {
        this.perform('rub', { trunk: t }); // already beside it
        return;
      }
      if (!t || !spot || Math.hypot(spot.x - t.x, spot.z - t.z) > reach + 0.4 || !this.goTo(spot.x, spot.z, () => this.perform('rub', { trunk: t })))
        this.act('wander');
      else this.rubTrunk = t; // the guard lets it come right up to this trunk
    } else if (kind === 'dustbath') {
      const T = this.mod.ctx.terrain;
      if (T.slope(this.pos.x, this.pos.z) > 0.15 || this.inWater > 0.05 || (this.mod.ctx.world.groundWetness || 0) > 0.5) this.act('wander');
      else this.perform('dustbath');
    } else if (PERFORM.has(kind)) {
      this.perform(kind);
    } else if (kind === 'trail') {
      if (!this.walkTrail()) this.act('wander');
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

  // A walk along the footpath: from the nearest point of the trail, a few units one way or the other
  // (over the stepping stones, if they lie that way). A herd follows in single file, one after another.
  walkTrail(pts = null) {
    if (!pts) {
      const lines = window.__jtPathLines;
      if (!lines) return false;
      let best = null;
      lines.forEach((l, li) => l.forEach(([x, z], i) => {
        const d = Math.hypot(x - this.pos.x, z - this.pos.z);
        if (!best || d < best.d) best = { li, i, d };
      }));
      if (!best || best.d > 3.5) return false;
      const line = lines[best.li];
      let dir = rand() < 0.5 ? 1 : -1;
      if (best.i + dir < 0 || best.i + dir >= line.length) dir = -dir;
      const want = 2.5 + rand() * 3;
      pts = [{ x: line[best.i][0], z: line[best.i][1] }];
      for (let i = best.i, acc = 0; acc < want; ) {
        const j = i + dir;
        if (j < 0 || j >= line.length) break;
        acc += Math.hypot(line[j][0] - line[i][0], line[j][1] - line[i][1]);
        i = j;
        const [x, z] = line[i], last = pts[pts.length - 1];
        if (!this.layer.walkable(x, z) || !this.clearOfGlass(x, z)) break;
        if (Math.hypot(x - last.x, z - last.z) > 0.3) pts.push({ x, z });
      }
      if (pts.length < 3) return false;
      if (this.sp.herd) {
        // the others fall in behind, a few seconds apart
        const mates = this.mod.dinos.filter((d) => d !== this && d.sp.id === this.sp.id && !d.parent);
        mates.forEach((m, k) =>
          this.mod.later((k + 1) * (2.2 + rand() * 0.8), () => {
            if ((m.state === 'idle' || m.state === 'walk') && !m.guarding) m.walkTrail(pts);
          }));
      }
    }
    const start = this.layer.path(this.pos.x, this.pos.z, pts[0].x, pts[0].z);
    if (!start) return false;
    this._trailWalk = true;
    this.path = start.concat(pts.slice(1).map((p) => ({ x: p.x, z: p.z })));
    this.pathIdx = 1;
    this.yawRate = 0;
    this.state = 'walk';
    this.gait = 'walk';
    this.then = null;
    return true;
  }

  // ---------------------------------------------------------------- idles without clips
  perform(kind, opts = {}) {
    const len = { yawn: 2.8, rub: 6 + rand() * 3, dustbath: 7 + rand() * 3, scratch: 3.2, shake: 1.7 }[kind];
    this.perf = { kind, t: 0, len, side: rand() < 0.5 ? -1 : 1, ...opts };
    if (kind === 'rub') {
      // turn so the trunk is at the flank
      const a = Math.atan2(opts.trunk.x - this.pos.x, opts.trunk.z - this.pos.z);
      const c1 = a + Math.PI / 2, c2 = a - Math.PI / 2, d = (h) => Math.abs(Math.atan2(Math.sin(h - this.heading), Math.cos(h - this.heading)));
      this.perf.h0 = this.heading;
      this.perf.h1 = d(c1) < d(c2) ? c1 : c2;
      this.perf.side = d(c1) < d(c2) ? -1 : 1; // which flank faces the trunk
      this.rubTrunk = opts.trunk;
    }
    this.state = 'perform';
    this.speed = 0;
    this.path = null;
    this.play(kind === 'dustbath' ? 'rest' : 'idle', 0.6);
  }

  // turn a bone about one of the animal's own axes ('x' across, 'y' up, 'z' forward), whatever the rig's
  // local axes: positive x lowers the jaw and tips a limb backwards, positive z rolls to the left
  turnBone(bone, axis, angle) {
    if (!bone || !angle) return;
    const rq = this.root.getWorldQuaternion(_tq1), bq = bone.getWorldQuaternion(_tq2);
    _tv.set(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0).applyQuaternion(rq).applyQuaternion(bq.invert());
    bone.rotateOnAxis(_tv.normalize(), angle);
  }

  // the motion of each, layered on the pose after the bends and feet (bones are restored each frame)
  performFrame(dt) {
    // drinking: the neck bows on down from its base until the muzzle meets the water (the clip alone
    // stops short for the long-necked), the head tipped back up a little to keep the muzzle level
    if ((this.drinkDip || 0) > 0.005 && this.flex.neck.length) {
      const n = this.flex.neck, dip = this.drinkDip;
      this.turnBone(n[0], 'x', dip * 0.55);
      if (n[1]) this.turnBone(n[1], 'x', dip * 0.3);
      if (n[2]) this.turnBone(n[2], 'x', dip * 0.15);
      this.turnBone(this.headBone, 'x', -dip * 0.35);
    }
    // a social scene's pose (social.js); the Brachiosaurus lifting its neck clear of a calf
    if (this.socialPose && this.state === 'social') {
      const B = this._pfb || (this._pfb = (() => { const b = {}; this.model.traverse((o) => o.isBone && (b[o.name] = o)); return b; })());
      this.socialPose(dt, (b, a, x) => this.turnBone(b, a, x), B, this.flex);
    }
    if ((this._liftT || 0) > 0 || (this._liftK || 0) > 0.01) {
      this._liftK = (this._liftK || 0) + (((this._liftT || 0) > 0 ? 1 : 0) - (this._liftK || 0)) * Math.min(1, dt * 1.5);
      const n = this.flex.neck;
      if (n[0]) this.turnBone(n[0], 'x', -0.32 * this._liftK);
      if (n[1]) this.turnBone(n[1], 'x', -0.16 * this._liftK);
      this.turnBone(this.headBone, 'x', 0.35 * this._liftK); // looking down at it
    }
    if (this.perf && this.state !== 'perform' && this.perf.kind !== 'stamp') (this.perf = null), (this.rubTrunk = null); // interrupted
    if (!this.perf && this.rubTrunk && this.state !== 'walk') this.rubTrunk = null;
    const P = this.perf;
    if (!P) return;
    const fx = this.flex, t = P.t, k = Math.min(1, t / Math.min(0.6, P.len * 0.25), (P.len - t) / Math.min(0.6, P.len * 0.25));
    const env = Math.max(0, k), turn = (b, a, x) => this.turnBone(b, a, x);
    const B = this._pfb || (this._pfb = (() => { const b = {}; this.model.traverse((o) => o.isBone && (b[o.name] = o)); return b; })());
    if (P.kind === 'stamp') {
      // a forefoot lifted high and slammed down: dust, a thud, the ground shaking a little
      const u = t / P.len, L = P.side > 0, up = Math.sin(Math.PI * Math.min(1, u / 0.55)) * (u < 0.55 ? 1 : 0);
      const ua = B[L ? 'upperarmL' : 'upperarmR'], fa = B[L ? 'forearmL' : 'forearmR'];
      turn(ua, 'x', -0.75 * up);
      turn(fa, 'x', 0.9 * up);
      fx.spine.forEach((b) => turn(b, 'z', (L ? -1 : 1) * 0.04 * up));
      turn(B.head, 'x', 0.18 * Math.sin(Math.PI * u)); // horns dipped
      if (!P.hit && u > 0.58) {
        P.hit = true;
        const foot = (fa || ua)?.getWorldPosition(_kd);
        if (foot) {
          foot.y = this.mod.ctx.terrain.height(foot.x, foot.z);
          this.mod.effects.dust(foot, this.length * 0.08);
          this.mod.effects.dust(foot, this.length * 0.06);
          this.mod.voice.play('step', this.root.position, this.stepSize * 1.6);
          const cam = this.mod.ctx.camera.position, dd = cam.distanceTo(foot);
          if (dd < 6) this.mod.ctx.cameraRig?.shake?.(0.02 * (1 - dd / 6));
        }
      }
      this.root.position.y -= 0.01 * this.k * (u > 0.55 && u < 0.75 ? 1 : 0);
    } else if (P.kind === 'shake') {
      // a wet-dog shake travelling down the body, drops flying off
      const w = 2 * Math.PI * 7;
      fx.spine.forEach((b, i) => turn(b, 'z', 0.1 * env * Math.sin(w * t - i * 0.7)));
      fx.neck.forEach((b, i) => turn(b, 'z', 0.14 * env * Math.sin(w * t + 0.8 - i * 0.5)));
      turn(B.head, 'y', 0.3 * env * Math.sin(w * t + 1.5));
      fx.tail.forEach((b, i) => turn(b, 'y', 0.12 * env * Math.sin(w * t - 1 - i * 0.5)));
      P.dropT = (P.dropT || 0) - dt;
      if (P.dropT <= 0 && env > 0.3) {
        P.dropT = 0.05;
        const src = [...fx.spine, ...fx.neck][Math.floor(rand() * (fx.spine.length + fx.neck.length))];
        if (src) {
          const at = src.getWorldPosition(_kd);
          // snow flies off in puffs; water in drops
          if ((this.snow || 0) > 0.05) {
            const s = Math.max(0.03, this.length * 0.05);
            this.mod.weather?.puff(at, new Vector3((rand() - 0.5) * s * 8, s * 3, (rand() - 0.5) * s * 8), s * 0.8, 0.55, 1.1 + rand() * 0.6);
            this.snow = Math.max(0, this.snow - dt * 2.2);
          }
          if ((this.wet || 0) > 0.2 || (this.snow || 0) < 0.05) this.mod.effects.spray(at, 3, 0.25 + this.length * 0.08, this.mod.ctx.terrain.height(this.pos.x, this.pos.z));
        }
      }
    } else if (P.kind === 'yawn') {
      // the head lifts, the jaw gapes slowly, eyes squeezed shut, then it closes
      const g = Math.sin(Math.PI * Math.min(1, t / P.len)) ** 0.7;
      if (fx.neck[0]) turn(fx.neck[0], 'x', -0.15 * g);
      turn(B.head, 'x', -0.3 * g);
      turn(B.jaw, 'x', 0.6 * g);
      this._yawnShut = g;
    } else if (P.kind === 'rub') {
      // turn side-on, then lean in and rub up and down the trunk; the tree shakes
      const tw = Math.min(1, t / 0.9), e = tw * tw * (3 - 2 * tw);
      this.heading = P.h0 + Math.atan2(Math.sin(P.h1 - P.h0), Math.cos(P.h1 - P.h0)) * e;
      const s = Math.sin(t * 2.1), lean = env * (0.5 + 0.5 * s);
      fx.spine.forEach((b) => turn(b, 'z', -P.side * 0.06 * lean));
      if (fx.neck[0]) turn(fx.neck[0], 'y', P.side * 0.3 * env);
      const tr = P.trunk, dx = tr.x - this.pos.x, dz = tr.z - this.pos.z, d = Math.hypot(dx, dz) || 1;
      const push = Math.max(0, d - tr.r - (this.sp.bodyR ?? 0.12) * this.k * 0.95) * lean * 0.8;
      this.root.position.x += (dx / d) * push;
      this.root.position.z += (dz / d) * push;
      this.root.position.y += 0.012 * this.k * Math.sin(t * 4.2) * env;
      this.mod.shakeTree?.(tr, lean);
      P.leafT = (P.leafT || 0.8) - dt;
      if (P.leafT <= 0 && env > 0.5) {
        P.leafT = 1.2 + rand();
        this.mod.effects.leafBurst(new Vector3(tr.x, tr.crownY + (tr.top ? (tr.top - tr.crownY) * 0.3 : 0.2), tr.z), 2 + Math.floor(rand() * 3));
      }
    } else if (P.kind === 'dustbath') {
      // lying down, it rolls onto one side and back, kicking up dust, and comes up dusty
      const roll = P.side * 0.5 * env * (0.6 + 0.4 * Math.sin(t * 1.3));
      this.root.rotateZ(roll);
      this.root.position.y += Math.abs(roll) * this.height * 0.08;
      P.dustT = (P.dustT || 0) - dt;
      if (P.dustT <= 0 && env > 0.2) {
        P.dustT = 0.22;
        const a = rand() * Math.PI * 2, r = this.length * 0.3;
        this.mod.effects.dust(new Vector3(this.pos.x + Math.cos(a) * r, this.mod.ctx.terrain.height(this.pos.x, this.pos.z), this.pos.z + Math.sin(a) * r), this.length * 0.09);
      }
      const U = this.skinU;
      if (U && env > 0.5) {
        U.uMudLine.value = Math.max(U.uMudAmt.value > 0.05 ? U.uMudLine.value : 0, (this.hipHeight() / this.model.scale.x) * 1.3);
        U.uMudAmt.value = Math.max(U.uMudAmt.value, 0.6);
        U.uMudWet.value = Math.min(U.uMudWet.value, 0.05);
      }
    } else if (P.kind === 'scratch') {
      // a hind foot swung up and out to scratch the flank in quick strokes, head turned to it, the body
      // leaning onto the other three legs
      const L = P.side > 0, g = env, th = B[L ? 'thighL' : 'thighR'], sh = B[L ? 'shinL' : 'shinR'];
      fx.spine.forEach((b) => turn(b, 'z', (L ? -1 : 1) * 0.03 * g));
      turn(th, 'x', -0.85 * g);
      turn(th, 'z', (L ? 1 : -1) * 0.35 * g);
      turn(sh, 'x', (0.9 + 0.3 * Math.sin(t * 20)) * g);
      if (fx.neck[0]) turn(fx.neck[0], 'y', (L ? 1 : -1) * 0.45 * g);
      turn(B.head, 'y', (L ? 1 : -1) * 0.3 * g);
    }
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
    // (the last point counts as reached within a fraction of the body's length: a long animal with a
    // limited turning circle would otherwise orbit a goal close by)
    if (d < (last ? Math.max(0.06, v * 0.25, this.length * 0.12) : Math.max(0.06, v * 0.25, look * 0.6))) {
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
    // no progress towards the waypoint for a few seconds (pushed off the line by a trunk, wedged against
    // another animal): plan again from here, and after a second failure give up and stand
    const pr = this._prog || (this._prog = { idx: -1, best: 0, t: 0, tries: 0 });
    if (pr.idx !== this.pathIdx || pr.path !== this.path) Object.assign(pr, { idx: this.pathIdx, path: this.path, best: d, t: 0 });
    else if (d < pr.best - 0.02) (pr.best = d), (pr.t = 0);
    else if ((pr.t += dt) > 3) {
      const end = this.path[this.path.length - 1], was = this.state, then = this.then;
      pr.tries = (pr.tries || 0) + 1;
      if (pr.tries > 2 || hunting || !this.goTo(end.x, end.z, then, this.gait)) {
        pr.tries = 0;
        if (hunting) return void (this.path = null);
        this.speed = 0;
        this.then = null;
        this.rest(0.5);
        return;
      }
      if (was === 'flee') this.state = 'flee';
      return;
    }
    if (pr.t === 0 && d < 0.1) pr.tries = 0;
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
    // queueing: slow down behind an animal in the way (single file on the trail, a herd bunching up),
    // rather than walking into its tail
    let room = 1;
    if (!this.parent && !hunting && !this.rally && this.state === 'walk') {
      const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
      for (const o of this.mod.walkers) {
        if (o === this || o.parent || o.sp.flyer || o.speed < 0.03) continue; // only behind one that is moving
        const dx = o.pos.x - this.pos.x, dz = o.pos.z - this.pos.z, ahead = dx * fx + dz * fz;
        if (ahead <= 0) continue;
        const side = Math.abs(dx * fz - dz * fx), wide = ((this.sp.bodyR ?? 0.12) + (o.sp.bodyR ?? 0.12)) * 1.3;
        if (side > wide) continue;
        const gap = ahead - (this.length + o.length) * 0.45;
        room = Math.min(room, MathUtils.clamp(gap / 0.35, 0, 1));
      }
    }
    this.speed += (v * align * room - this.speed) * Math.min(1, dt * 1.5);
    this.pos.x += Math.sin(this.heading) * this.speed * dt;
    this.pos.z += Math.cos(this.heading) * this.speed * dt;
    this.play(gait, 0.5);
    // the clip's steps match the ground actually covered, down to a slow, careful step
    if (this.current) this.current.timeScale = Math.max(0.06, this.speed / v) * (this.swimming ? 1.7 : 1); // paddling legs
    if (this.state === 'flee' && this.pathIdx >= this.path.length - 1) this.state = 'walk';
  }

  // hip joint above the feet, for the current size (measured once on the bind pose)
  hipHeight() {
    if (this._hip0 === undefined) {
      let pel = null;
      this.model.traverse((o) => o.isBone && o.name === 'pelvis' && (pel = o));
      this.root.updateMatrixWorld(true);
      this._hip0 = pel ? (pel.getWorldPosition(_ka).y - this.root.position.y) / this.model.scale.x : 0;
    }
    return this._hip0 * this.model.scale.x;
  }

  place() {
    const T = this.mod.ctx.terrain;
    const h = T.height(this.pos.x, this.pos.z);
    const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
    const half = this.length * 0.25;
    const hf = T.height(this.pos.x + fx * half, this.pos.z + fz * half);
    const hb = T.height(this.pos.x - fx * half, this.pos.z - fz * half);
    const pitch = Math.atan2(hb - hf, 2 * half) * 0.6;
    let y = Math.min(h, (hf + hb) / 2 + 0.002);
    // where the water is deeper than half the legs (a hatchling at a ford), the animal swims: it floats
    // with the water line at mid-leg instead of walking on the bottom with only its back showing
    const sy = this.mod.waterSurface?.(this.pos.x, this.pos.z);
    if (sy != null) {
      const hip = this.hipHeight();
      if (hip > 0 && sy - y > hip * 0.5) {
        y = sy - hip * 0.5 + 0.004 * Math.sin(performance.now() * 0.006 + this.k * 9); // a gentle bob
        this.swimming = true;
      } else this.swimming = false;
    } else this.swimming = false;
    this.root.position.set(this.pos.x, y, this.pos.z);
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
    dress(this);
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
  // a fish, then climbs away with it and rejoins the circuit. The dive is three Bezier legs: down to the
  // water; a level skim along it with the lower beak cutting a wake through the surface; up and away with
  // the catch. The whole route is checked against the terrain before it commits.
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
    if (dist < 2.4) return false;
    app.normalize();
    // the skim: a straight, level run through the target, over open water all the way
    const SK = 1.0, s0 = target.clone().addScaledVector(app, -SK / 2).setY(0.06), s1 = target.clone().addScaledVector(app, SK / 2).setY(0.06);
    for (const q of [s0, s1, target]) if (T.lakeMask(q.x, q.z) < 0.9 || T.height(q.x, q.z) > -0.12) return false;
    const exitDir = app.clone().lerp(fwd, 0.3).normalize();
    const legs = [
      [p0, p0.clone().addScaledVector(fwd, dist * 0.35), s0.clone().addScaledVector(app, -1.1).setY(0.28), s0],
      [s0, s0.clone().addScaledVector(app, SK / 3), s1.clone().addScaledVector(app, -SK / 3), s1],
      [s1, s1.clone().addScaledVector(exitDir, 0.7).setY(0.12), s1.clone().addScaledVector(exitDir, 1.6).setY(1.1),
        s1.clone().addScaledVector(exitDir, 2.6).setY(2.3)],
    ];
    // the whole route must clear the ground (and, away from the skim, the water) and stay inside the glass
    const q = new Vector3();
    const nearSkim = (p) => segDist2D(p.x, p.z, s0.x, s0.z, s1.x, s1.z) < 0.6;
    for (const L of legs) {
      for (let i = 1; i < 20; i++) {
        bez(L, i / 20, q);
        if (Math.abs(q.x) > box.halfW - 0.7 || Math.abs(q.z) > box.halfD - 0.45) return false;
        const g = T.height(q.x, q.z);
        if (q.y < Math.max(g, 0) + (nearSkim(q) ? 0.03 : 0.2)) return false;
      }
    }
    this.dive = { legs, leg: 0, u: 0, target, lens: legs.map((L) => bezLen(L)), wakeT: 0 };
    this.state = 'dive';
    return true;
  }

  diveStep(dt) {
    const D = this.dive;
    const speed = [1.15, 0.95, 0.85][D.leg];
    D.u += (dt * speed) / D.lens[D.leg];
    if (D.u >= 1) {
      if (D.leg === 0) {
        // touching down onto the skim: the beak enters the water
        D.leg = 1;
        D.u = 0;
        this.mod.voice.play('splash', D.target, 0.6);
      } else if (D.leg === 1) {
        // the snatch: a burst of spray and the fish comes up in the beak
        D.leg = 2;
        D.u = 0;
        const e = D.legs[1][3];
        this.mod.effects.splash(e.x, e.z, 0, 1);
        this.mod.voice.play('splash', e, 1);
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
    // skimming: a wake of rings behind the beak, and spray flicked up now and then
    if (D.leg === 1 && (D.wakeT -= dt) <= 0) {
      D.wakeT = 0.05;
      const b = this.headBone ? this.headBone.getWorldPosition(_kd) : this.pos;
      const water = this.mod.ctx.modules.water;
      water?.ripple?.(b.x, b.z, 0.045, 1.4);
      if (rand() < 0.35) this.mod.effects.spray(new Vector3(b.x, 0.02, b.z), 2, 0.25, 0, { x: Math.sin(this.heading) * 0.5, z: Math.cos(this.heading) * 0.5 });
    }
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

  // ------------------------------------------------------------ flexible wings
  // Each wing is a chain of springs on top of the flap clip: the joints further out lag behind the
  // stroke, more towards the tip, so on the downstroke the tips trail upward and the wing curves like a
  // bow, and on the upstroke they trail down and whip through at the top. The stroke's speed also goes
  // to the skin shader, where the membrane bellies against the air (see skin.js).
  wingFlex(dt) {
    if (dt <= 0) return;
    const W = this._wf || (this._wf = this.initWings());
    if (!W) return;
    const fold = this.perch?.fold || 0, live = 1 - fold;
    const qr = this.root.getWorldQuaternion(_tq1), qi = _tq2.copy(qr).invert();
    W.sides.forEach((sd, si) => {
      sd.shoulder.getWorldPosition(_fa);
      sd.tip.getWorldPosition(_fb);
      _fb.sub(_fa).applyQuaternion(qi); // in the body's own frame
      const elev = Math.atan2(_fb.y, Math.hypot(_fb.x, _fb.z));
      if (sd.prev === undefined) (sd.prev = elev), (sd.w = 0);
      const w = (elev - sd.prev) / dt;
      sd.prev = elev;
      const acc = MathUtils.clamp((w - sd.w) / dt, -400, 400);
      sd.w += (w - sd.w) * Math.min(1, dt * 20);
      let total = 0;
      for (const j of sd.joints) {
        // a damped spring for how far this joint's segment is bent (+ = tip up), driven by the stroke
        // (inertia: it lags the stroke's turnarounds; drag: the air holds it bent against the stroke)
        const c = 2 * 0.32 * Math.sqrt(j.k);
        j.v += (-j.k * j.a - c * j.v - acc * j.g - sd.w * j.d) * dt;
        j.a = MathUtils.clamp(j.a + j.v * dt, -0.45, 0.45);
        total += j.a;
        // about the body's long axis: for a wing on the +x side a positive turn lifts its tip
        _tv.set(0, 0, 1).applyQuaternion(qr).applyQuaternion(j.b.getWorldQuaternion(_tq3).invert());
        j.b.rotateOnAxis(_tv.normalize(), j.a * sd.sign * live);
      }
      sd.bend = total;
      if (this.skinU) this.skinU.uFlapW.value.setComponent(si, sd.w * live);
    });
  }

  initWings() {
    const bones = {};
    this.model.traverse((o) => o.isBone && (bones[o.name] = o));
    const sides = [];
    for (const L of ['L', 'R']) {
      const chain = ['forearm', 'hand', 'wingfinger1', 'wingfinger2', 'wingfinger3'].map((n) => bones[n + L]);
      const shoulder = bones['upperarm' + L];
      if (!shoulder || chain.some((b) => !b)) return null;
      // which side of the body it lies on (in the body's frame)
      this.root.updateMatrixWorld(true);
      const p = chain[4].getWorldPosition(new Vector3()), o = this.root.getWorldPosition(new Vector3());
      const side = Math.sign(p.sub(o).applyQuaternion(this.root.getWorldQuaternion(new Quaternion()).invert()).x) || 1;
      // stiffer near the body, softer and more lagging out towards the tip
      const G = [[260, 0.2, 3], [240, 0.25, 4], [220, 0.3, 5], [200, 0.35, 6], [180, 0.4, 7]];
      sides.push({
        shoulder, tip: chain[4], sign: side,
        joints: chain.map((b, i) => ({ b, q0: b.quaternion.clone(), k: G[i][0], g: G[i][1], d: G[i][2], a: 0, v: 0 })),
      });
    }
    // half the wingspan in the bind pose's metres (for the membrane's billow)
    if (this.skinU) this.skinU.uSpan.value = Math.max(1, (this.info?.span || 6) * 0.5);
    return { sides };
  }

  // ------------------------------------------------------------ perching
  // Now and then a Pteranodon glides in to land on a big boulder, the cabin's ridge or the den rock: a
  // curving approach that slows, a flare with a few wingbeats, then it folds its wings and stands on all
  // fours as pterosaurs did (the folded wing finger swept back up along the body, the long hand bones as
  // front legs). It preens and looks about, and leaves when its time is up or when something comes close.
  planPerch() {
    const spots = this.mod.perchSpots().filter((s) => !this.mod.dinos.some((o) => o !== this && o.perch && Math.hypot(o.perch.spot.x - s.x, o.perch.spot.z - s.z) < 0.6));
    const T = this.mod.ctx.terrain, box = this.box, q = new Vector3();
    for (let tries = 0; tries < 8 && spots.length; tries++) {
      const s = spots[Math.floor(rand() * spots.length)];
      const target = new Vector3(s.x, s.y, s.z), p0 = this.pos.clone();
      const fwd = new Vector3(Math.sin(this.heading), 0, Math.cos(this.heading));
      const app = target.clone().sub(p0).setY(0), dist = app.length();
      if (dist < 1.6 || dist > 7) continue;
      app.normalize();
      const L = [p0, p0.clone().addScaledVector(fwd, dist * 0.4), target.clone().addScaledVector(app, -0.9).setY(Math.min(box.topY - 0.7, target.y + 0.55)), target.clone()];
      let ok = true;
      for (let i = 1; i < 24 && ok; i++) {
        bez(L, i / 24, q);
        if (Math.abs(q.x) > box.halfW - 0.5 || Math.abs(q.z) > box.halfD - 0.35 || q.y > box.topY - 0.3) ok = false;
        else if (q.distanceTo(target) > 0.45 && q.y < Math.max(T.height(q.x, q.z), 0) + 0.25) ok = false;
      }
      if (!ok) continue;
      this.perch = { spot: s, target, legs: L, u: 0, len: bezLen(L), face: Math.atan2(app.x, app.z), fold: 0 };
      this.state = 'toPerch';
      return true;
    }
    return false;
  }

  takeOff() {
    const P = this.perch, box = this.box;
    let h = this.heading;
    // leave towards the open middle of the case if facing the glass
    const t = P.target, ahead = (k) => new Vector3(t.x + Math.sin(h) * k, 0, t.z + Math.cos(h) * k);
    if (Math.abs(ahead(2.4).x) > box.halfW - 0.8 || Math.abs(ahead(2.4).z) > box.halfD - 0.6) h = Math.atan2(-t.x, -t.z);
    const f = new Vector3(Math.sin(h), 0, Math.cos(h));
    P.legs = [t.clone(), t.clone().addScaledVector(f, 0.35).setY(t.y + 0.25), t.clone().addScaledVector(f, 1.5).setY(t.y + 1.0), t.clone().addScaledVector(f, 2.6).setY(Math.min(box.topY - 0.8, Math.max(t.y + 1.2, this.alt - 0.6)))];
    P.len = bezLen(P.legs);
    P.u = 0;
    this.heading = h;
    this.state = 'takeoff';
    this.flapT = 2.5;
    this.mod.voice.play('croak', this.root.position);
  }

  // the folded, standing pose: each wing and leg bone turned to point where it should (in the heading's
  // frame), blended in by w; then the body set down so knuckles and toes rest on the perch
  perchPose(w) {
    if (w <= 0.001) return;
    if (!this._pb) {
      const b = {};
      this.model.traverse((o) => o.isBone && (b[o.name] = o));
      const chain = (side, names, dirs) => names.map((n, i) => ({ bone: b[n + side], kid: b[(names[i + 1] || (side === 'L' || side === 'R' ? '' : '')) + side] || b[n + side]?.children.find((c) => c.isBone), dir: dirs[i], sx: side === 'L' ? 1 : -1 }));
      const arm = ['upperarm', 'forearm', 'hand', 'wingfinger1', 'wingfinger2'];
      const armD = [[0.45, -0.45, -0.25], [0.15, -0.55, 0.6], [0.05, -0.98, 0.12], [0.12, 0.72, -0.68], [0.05, 0.3, -0.95]];
      const leg = ['thigh', 'shin', 'meta'];
      const legD = [[0.2, -0.85, 0.25], [0.08, -0.85, -0.45], [0, -0.25, 1]];
      this._pb = { list: [...chain('L', arm, armD), ...chain('R', arm, armD), ...chain('L', leg, legD), ...chain('R', leg, legD)].filter((c) => c.bone && c.kid), b };
    }
    const h = this.heading, ch = Math.cos(h), sh = Math.sin(h);
    const a = new Vector3(), c = new Vector3(), d = new Vector3(), qd = new Quaternion(), qw = new Quaternion(), qp = new Quaternion();
    this.root.updateMatrixWorld(true);
    for (const L of this._pb.list) {
      const [x, y, z] = L.dir, X = x * L.sx;
      d.set(X * ch + z * sh, y, -X * sh + z * ch).normalize();
      L.bone.getWorldPosition(a);
      L.kid.getWorldPosition(c);
      qd.setFromUnitVectors(c.sub(a).normalize(), d);
      L.bone.getWorldQuaternion(qw);
      L.bone.parent.getWorldQuaternion(qp);
      const local = qp.invert().multiply(qd.multiply(qw));
      L.bone.quaternion.slerp(local, w);
      L.bone.updateMatrixWorld(true);
    }
    // the wing finger and its membrane draw in tight as it folds (the skin can't really collapse, so the
    // finger is drawn shorter instead)
    const B = this._pb.b;
    for (const n of ['wingfinger1L', 'wingfinger1R']) if (B[n]) B[n].scale.setScalar(1 - 0.55 * w);
    for (const n of ['wingfinger2L', 'wingfinger2R']) if (B[n]) B[n].scale.setScalar(1 - 0.3 * w);
    this.root.updateMatrixWorld(true);
    // stand on the perch: the lowest knuckle or toe touches its top
    let low = Infinity;
    for (const n of ['wingfinger1L', 'wingfinger1R', 'toeL', 'toeR']) if (B[n]) low = Math.min(low, B[n].getWorldPosition(a).y);
    if (low < Infinity && this.perch) this.root.position.y += (this.perch.target.y - low) * w;
  }

  perchStep(dt) {
    const P = this.perch;
    if (this.state === 'toPerch') {
      P.u += (dt * 0.95 * (1 - 0.55 * P.u)) / P.len;
      if (P.u > 0.65) this.flapT = Math.max(this.flapT, 0.4); // the flare: a few braking wingbeats
      if (P.u >= 1) {
        this.state = 'perch';
        P.t = 14 + rand() * 30;
        P.preen = 3 + rand() * 4;
        this.pos.copy(P.target);
        return;
      }
      bez(P.legs, Math.min(1, P.u), this.pos);
      return;
    }
    if (this.state === 'perch') {
      P.t -= dt;
      const near = this.mod.walkers?.some((d) => Math.hypot(d.pos.x - P.target.x, d.pos.z - P.target.z) < 0.9);
      if (P.t <= 0 || near || this.mod.tapped?.()) this.takeOff();
      return;
    }
    // takeoff
    P.u += (dt * 0.75 * (0.5 + P.u)) / P.len;
    if (P.u >= 1) {
      this.state = 'rejoin';
      this.rejoin = { from: this.pos.clone(), vel: this.pos.clone().sub(this.prev).divideScalar(Math.max(dt, 1e-3)), t: 0 };
      this.y = this.pos.y;
      this.perch = null;
      return;
    }
    bez(P.legs, Math.min(1, P.u), this.pos);
  }

  // preening and looking about while perched: now the neck sweeps round and the beak works along a wing
  preen(dt) {
    const P = this.perch, b = this._pb?.b;
    if (!b) return;
    P.preen -= dt;
    if (P.preen <= 0 && !P.act) P.act = { t: 0, len: 2.2 + rand() * 1.5, side: rand() < 0.5 ? -1 : 1, kind: rand() < 0.6 ? 'preen' : 'look' };
    const A = P.act;
    if (!A) return;
    A.t += dt;
    const e = Math.sin(Math.PI * Math.min(1, A.t / A.len));
    if (A.kind === 'preen') {
      b.neck1?.rotateY(0.55 * A.side * e);
      b.neck2?.rotateY(0.5 * A.side * e);
      b.neck3?.rotateX(0.35 * e);
      b.head?.rotateX(0.25 * e + 0.08 * Math.sin(A.t * 14) * e);
    } else {
      b.neck2?.rotateY(0.45 * A.side * e);
      b.head?.rotateY(0.3 * A.side * e);
    }
    if (A.t >= A.len) (P.act = null), (P.preen = 2.5 + rand() * 5);
  }

  update(dt, env) {
    if (this.fishHold !== undefined) {
      this.fishHold -= dt;
      // the fish thrashes in the beak, weaker as it goes
      if (this.fish) this.fish.rotation.z = Math.sin(this.fishHold * 31) * 0.6 * Math.min(1, this.fishHold / 2);
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
    this.perchT = (this.perchT ?? 25 + rand() * 40) - dt;
    if (this.state === 'fly' && this.perchT <= 0) this.perchT = this.planPerch() ? 70 + rand() * 60 : 8;
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
    const perching = this.state === 'toPerch' || this.state === 'perch' || this.state === 'takeoff';
    if (this.state === 'dive') this.diveStep(dt);
    else if (perching) this.perchStep(dt);
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
    const standing = this.state === 'perch';
    const v = this.pos.clone().sub(this.prev);
    if (standing) {
      // perched: level, nose up, wings and legs folding in; flap/glide fade out
      this.roll += (0 - this.roll) * Math.min(1, dt * 3);
      this.pitch += (-0.5 - this.pitch) * Math.min(1, dt * 3);
      this.flapW += (0 - this.flapW) * Math.min(1, dt * 3);
      this.actions.flap?.setEffectiveWeight(this.flapW);
      this.actions.glide?.setEffectiveWeight(1 - this.flapW);
    } else if (dt > 0 && v.lengthSq() > 1e-10) {
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
    for (const sd of this._wf?.sides || []) for (const j of sd.joints) j.b.quaternion.copy(j.q0); // (in case a clip leaves one unkeyed)
    this.mixer.update(dt);
    this.wingFlex(dt);
    // the fold blends in as it lands and out as it leaves
    if (this.perch) {
      const want = this.state === 'perch' ? 1 : this.state === 'toPerch' ? Math.max(0, (this.perch.u - 0.85) / 0.15) * 0.6 : Math.max(0, 1 - this.perch.u * 4);
      this.perch.fold += (want - this.perch.fold) * Math.min(1, dt * (this.state === 'perch' ? 2.5 : 6));
      this.perchPose(this.perch.fold);
      if (this.state === 'perch') this.preen(dt);
    }
    faceEyes(this, dt, { shut: this.state === 'perch' && (env?.night || 0) > 0.6 ? 0.8 : 0 });
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
    // which animal is calling: a vocal call sets that animal's throat pulsing
    {
      const play = this.voice.play.bind(this.voice), quiet = /^(step|crop|splash|croak)$/;
      this.voice.play = (name, at, ...rest) => {
        if (!quiet.test(name)) for (const d of this.dinos || []) if (d.root?.position === at) d._callT = 1.1;
        return play(name, at, ...rest);
      };
    }
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
    this.rocks = params.get('rocks') === '0' ? null : new Rocks(ctx, rand, { den: this.den });
    this.paths = params.get('paths') === '0' ? null : new Paths(ctx, rand);
    const hatch = params.get('hatch');
    this.nest = params.get('nest') === '0' ? null : new Nest(ctx, this.flora, rand, { hatchAt: hatch != null ? Number(hatch) : undefined });
    this.room = params.get('room') === '0' ? null : new Room(ctx, new URL('models/room.webp', document.baseURI).href);
    this.effects = new Effects(ctx);
    this.backdrop = params.get('backdrop') === '0' ? null : new Backdrop(ctx, new URL('models/', document.baseURI));
    this.contact = new Contact(ctx, this);
    this.weather = new DinoWeather(this);
    this.night = new Night(this);
    this.social = new Social(this);
    this.ambience = new Ambience(ctx, this.voice);
    this.timers = [];
    // trunks the bodies keep off: the planted ones and Weatherglass's own trees
    this.trunks = [
      ...this.flora.trunks,
      ...(ctx.modules.vegetation?.trees || []).filter((t) => t.kind !== 'bush' && t.height >= 0.45)
        .map((t) => ({ x: t.x, z: t.z, r: 0.04, y0: t.y, crownY: t.y + t.height * 0.3, kind: 'wg-' + t.kind })),
    ];
    // the cabin is solid to the ridge: a swinging tail or a passing neck keeps off its walls and roof
    const cab = ctx.terrain.shape?.CABIN, lp = ctx.modules.life?.props;
    if (cab && lp?.ridgeY) this.trunks.push({ x: cab.x, z: cab.z, r: 0.44, y0: cab.y ?? 0, crownY: lp.ridgeY + 0.05, kind: 'cabin' });
    this.trunkGrid = new Map();
    for (const t of this.trunks) {
      const key = Math.floor(t.x / 0.5) + ',' + Math.floor(t.z / 0.5);
      if (!this.trunkGrid.has(key)) this.trunkGrid.set(key, []);
      this.trunkGrid.get(key).push(t);
    }
    this.nav = new NavGrid(ctx, {
      trunks: this.trunks,
      fords: fords(ctx.terrain),
      obstacles: [...this.flora.obstacles, ...(this.aquatic?.obstacles || []), ...(this.ground?.obstacles || []), ...(this.rocks?.obstacles || []), ...(this.nest?.obstacle ? [this.nest.obstacle] : [])],
      rects: [
        { x0: DEN.x - 1.45 * ds, x1: DEN.x + 1.45 * ds, z0: DEN.z - 1.5 * ds, z1: DEN.z + 0.55 * ds, block: true },
        { x0: DEN.x - 0.72 * ds, x1: DEN.x + 0.72 * ds, z0: DEN.z - 0.6 * ds, z1: DEN.z + 0.62 * ds, block: false },
      ],
    });
    // the den (rock and hollow) is the T. rex's alone; tall animals keep further off so a neck can't
    // reach over or through the overhang
    const denRect = { x0: DEN.x - 1.45 * ds, x1: DEN.x + 1.45 * ds, z0: DEN.z - 1.5 * ds, z1: DEN.z + 0.55 * ds };
    for (const sp of SPECIES.filter((s) => !s.flyer)) {
      const m = sp.den ? null : sp.tooBig ? 0.6 : 0.25; // (the body guard keeps necks off the rock itself)
      const blockRects = m === null ? [] : [{ x0: denRect.x0 - m, x1: denRect.x1 + m, z0: denRect.z0 - m, z1: denRect.z1 + m }];
      // a sauropod's legs, neck and tail sweep wide of its route: it gives Weatherglass's trees a wide berth
      // (the cabin can't be: it stands in the way between two halves of its range)
      const discs = sp.tooBig ? this.trunks.filter((t) => /^wg-/.test(t.kind)).map((t) => ({ x: t.x, z: t.z, r: t.r + (sp.bodyR ?? 0.12) + 0.55 })) : [];
      this.layers[sp.id] = this.nav.layer({ clearance: sp.clearance, maxWater: sp.maxWater, maxSlope: sp.maxSlope, blockRects, bodyR: sp.bodyR ?? 0.12, discs });
    }
    // the water surface over each wet cell of the route grid (the lake's level is read live; the stream's
    // surface is fixed), for animals that have to swim
    {
      const g = this.nav, Wt = ctx.modules.water, ray = new Ray(), out = new Vector3();
      this.surf = new Float32Array(g.nx * g.nz).fill(NaN);
      for (let k = 0; k < this.surf.length; k++) {
        if (g.water[k] < 0.2 || !Wt) continue;
        const x = g.minX + ((k % g.nx) + 0.5) * g.cell, z = g.minZ + (Math.floor(k / g.nx) + 0.5) * g.cell;
        if (Wt.lakeDepth(x, z) > 0.006) {
          this.surf[k] = -Infinity;
          continue;
        }
        ray.origin.set(x, 8, z);
        ray.direction.set(0, -1, 0);
        if (Wt._rayRiver?.(ray, out) != null) this.surf[k] = out.y;
      }
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
    // phones and tablets get smaller skins, loaded one species at a time (see skincap.js)
    const cap = skinCap(this.ctx.quality, params);
    const loader = capLoaderTextures(new GLTFLoader().setMeshoptDecoder(MeshoptDecoder), cap);
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
        // the rock is solid for every animal but its owner: a long neck may not reach over or into it
        const bb = new Box3().setFromObject(m);
        this.solidBoxes = [{ x0: bb.min.x + 0.15, x1: bb.max.x - 0.15, z0: bb.min.z, z1: bb.max.z - 0.12, top: bb.max.y - 0.1 }];
      })
      .catch((e) => console.warn('[den] load failed', e));
    const loadSpecies = async (sp) => {
        const [gltf, info] = await Promise.all([
          loader.loadAsync(new URL(`${sp.id}.glb`, base).href),
          fetch(new URL(`${sp.id}.json`, base)).then((r) => r.json()),
        ]);
        (this.assets || (this.assets = {}))[sp.id] = { gltf, info };
        // measure the skin (thickness, neck, nostrils) and the eyeballs once per model
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((o) => {
          if (!o.isSkinnedMesh) return;
          if (/_skin/.test(o.material?.name || '')) prepareSkinGeometry(o);
          else if (sp.id === 'trex' && /_tooth/.test(o.material?.name || '')) prepareTeeth(o);
          else if (/_eye$/.test(o.material?.name || '')) prepareEyeGeometry(o);
        });
        for (let i = 0; i < sp.count; i++) {
          const d = sp.flyer ? new Flyer(this, sp, info, gltf, i) : new Dino(this, sp, info, gltf, i);
          this.group.add(d.root);
          this.dinos.push(d);
        }
    };
    const ready = SPECIES.filter((sp) => sp.ready);
    if (cap) {
      // one at a time, so only one model's full-size images are ever decoded at once
      for (const sp of ready) await loadSpecies(sp);
    } else {
      await Promise.all(ready.map(loadSpecies));
    }
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
    this.interact = new Interact(this, this.flora);
    this.interact.mountButtons(this.guide.el);
    // the water's shaders can produce NaN/Inf pixels on some GPUs (bloomed into full-screen flashes)
    if (params.get('waterguard') !== '0') this.guarded = guardWater(this.ctx.scene);
    this.atmosphere = params.get('air') === '0' ? null : new Atmosphere(this.ctx, this);
    if (params.has('debug')) debugPanel(this.ctx, this);
    window.__wgHold = 0;
  }

  // a walkable spot at the water's edge, near the animal
  // where a herd animal lies down for the night: the first to settle lies down where it is and chooses
  // the way they all face; each of the others takes the nearest free place beside the ones already down,
  // side by side, alternately left and right (far-off stragglers just sleep where they are)
  huddleSpot(d) {
    const mates = this.walkers.filter((o) => o.sp.id === d.sp.id && !o.parent && o.root.visible);
    if (mates.length < 2) return null;
    const H = (this._huddle ||= {});
    let h = H[d.sp.id];
    if (!h || this.clock - h.t > 300) {
      h = H[d.sp.id] = { t: this.clock, face: d.heading, taken: [{ x: d.pos.x, z: d.pos.z }] };
      return null; // the first: here
    }
    const lead = h.taken[0];
    if (Math.hypot(d.pos.x - lead.x, d.pos.z - lead.z) > 16) return null;
    const gap = Math.max((d.sp.bodyR ?? 0.15) * d.k * 2.8, d.length * 0.36), sx = Math.cos(h.face), sz = -Math.sin(h.face);
    for (let k = 1; k <= 6; k++)
      for (const side of [1, -1]) {
        const t = d.layer.nearestOpen(lead.x + sx * gap * k * side, lead.z + sz * gap * k * side);
        if (!t || h.taken.some((o) => Math.hypot(o.x - t.x, o.z - t.z) < gap * 0.85)) continue;
        h.taken.push({ x: t.x, z: t.z });
        return { x: t.x, z: t.z, face: h.face };
      }
    return null;
  }

  // A standoff: the Triceratops charged stands its ground; the rest of the herd runs to its side and
  // lines up facing the predator; the predator prowls round them (Dino.circleStep).
  standoff(def, rex) {
    const len = 14 + rand() * 5;
    const mates = [];
    this.duel = { def, rex, t: 0, len, mates };
    def.state = 'standoff';
    def.timer = len;
    def.foe = rex;
    def.showT = 0;
    def.speed = 0;
    def.path = null;
    def.play('threat', 0.25);
    this.voice.play(def.sp.sounds?.threat || 'grunt', def.root.position, def.stepSize);
    rex.prey = null;
    rex.deterred = null;
    rex.path = null;
    rex.foe = def;
    rex.state = 'circle';
    rex.circle = { t: 0, len, dir: rand() < 0.5 ? -1 : 1, feint: len * (0.5 + 0.15 * rand()), hold: 0.8 };
    // the herd closes ranks: to either side of it, a little behind, facing the same way
    const fx = rex.pos.x - def.pos.x, fz = rex.pos.z - def.pos.z, fl = Math.hypot(fx, fz) || 1;
    let side = rand() < 0.5 ? -1 : 1, k = 0;
    for (const m of this.walkers) {
      if (m === def || m.sp.id !== def.sp.id || m.parent || m.state === 'sleep' || Math.hypot(m.pos.x - def.pos.x, m.pos.z - def.pos.z) > 4.5) continue;
      k++;
      const off = (m.sp.bodyR ?? 0.15) * 2 * def.k * (1.3 + 0.4 * Math.ceil(k / 2)), back = 0.12 * Math.ceil(k / 2);
      const spot = m.layer.nearestOpen(def.pos.x + (-fz / fl) * off * side - (fx / fl) * back, def.pos.z + (fx / fl) * off * side - (fz / fl) * back);
      side *= -1;
      if (!spot) continue;
      m.rally = def;
      const join = () => {
        if (!this.duel || this.duel.def !== def) return void (m.rally = null);
        m.state = 'standoff';
        m.foe = rex;
        m.timer = Math.max(3, this.duel.len - this.duel.t);
        m.showT = 0.3 + rand();
        m.speed = 0;
        m.play('threat', 0.3);
      };
      if (m.goTo(spot.x, spot.z, join, 'run')) mates.push(m);
      else m.rally = null;
    }
  }

  // somewhere to drink from: open ground (for this animal) with water within reach of its muzzle, and
  // which way the water lies. pool: the big pool only (the Brachiosaurus, reaching out with its neck)
  shore(d, pool = false) {
    const nav = this.nav, L = d.layer, T = this.ctx.terrain;
    const reach = d.drinkReach ?? Math.max(0.25, d.length * 0.22);
    const wet = (x, z) => (pool ? T.lakeMask(x, z) : Math.max(T.lakeMask(x, z), T.riverMask(x, z)));
    let best = null, bd = Infinity;
    for (const k of L.open) {
      if (nav.water[k] > 0.55 || nav.slope[k] > 0.3) continue;
      const c = L.centre(k);
      let face = 0, wv = 0;
      for (let a = 0; a < 12; a++) {
        const ang = (a * Math.PI) / 6, sx = Math.sin(ang), sz = Math.cos(ang);
        // water all along where the muzzle comes down (a bowed neck brings it back towards the feet)
        const v = pool ? Math.min(wet(c.x + sx * reach, c.z + sz * reach), wet(c.x + sx * reach * 0.65, c.z + sz * reach * 0.65)) : wet(c.x + sx * reach, c.z + sz * reach);
        if (v > wv) (wv = v), (face = ang);
      }
      if (wv < 0.6 || !d.clearOfGlass(c.x, c.z)) continue;
      const dist = Math.hypot(c.x - d.pos.x, c.z - d.pos.z) + rand() * 1.5;
      if (dist < bd) (bd = dist), (best = { ...c, face });
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
  // Bodies among the trees, for the branch shader: head, chest and hips of each grown animal near a tree
  // (nearest first, up to the shader's slots); a head or back pushing hard through a crown shakes a few
  // leaves loose
  branchPush(dt) {
    const U = this.flora.uniforms, N = U.uBPush.value.length, list = [];
    const grid = this.trunkGrid;
    for (const d of this.walkers || []) {
      if (d.parent || d.sp.flyer) continue;
      if (!d._bpBones) {
        const b = {};
        d.model.traverse((o) => o.isBone && (b[o.name] = o));
        d._bpBones = [[d.headBone, 0.1], [b.spine3 || b.spine2, (d.sp.bodyR ?? 0.12) * 1.1], [b.pelvis, (d.sp.bodyR ?? 0.12)], [b.neck2, 0.08]].filter((x) => x[0]);
      }
      const vx = Math.sin(d.heading) * d.speed, vz = Math.cos(d.heading) * d.speed;
      for (const [bone, r] of d._bpBones) {
        const p = bone.getWorldPosition(new Vector3());
        // nearest tree crown
        let near = 9;
        const gx = Math.floor(p.x / 0.5), gz = Math.floor(p.z / 0.5);
        for (let a = -2; a <= 2; a++)
          for (let c = -2; c <= 2; c++)
            for (const t of grid.get(gx + a + ',' + (gz + c)) || []) {
              if (t.kind === 'stand' || t.kind === 'cabin') continue;
              const top = t.top ?? t.crownY + 0.5;
              if (p.y < t.y0 || p.y > top + 0.2) continue;
              const dd = Math.hypot(p.x - t.x, p.z - t.z) - t.r;
              if (dd < near) near = dd;
              // leaves shaken loose: a body moving at pace through the crown itself
              if (dd < r * d.k + 0.12 && p.y > (t.leafY ?? t.crownY) && d.speed > 0.08 && (d.leafT ?? 0) < this.clock) {
                d.leafT = this.clock + 2.5 + Math.random() * 2.5;
                this.effects.leafBurst(p, 2 + Math.floor(Math.random() * 3));
              }
            }
        if (near < 0.8) list.push({ p, r: r * d.k, vx, vz, s: d.speed, near });
      }
    }
    list.sort((a, b) => a.near - b.near);
    for (let i = 0; i < N; i++) {
      const e = list[i];
      if (!e) {
        U.uBPush.value[i].w = 0;
        continue;
      }
      U.uBPush.value[i].set(e.p.x, e.p.y, e.p.z, e.r);
      U.uBPushV.value[i].set(e.vx, e.vz, e.s, 0);
    }
  }

  // an animal rubbing against a trunk: its crown is pushed to and fro
  shakeTree(t, amount) {
    if (!t.top) return;
    const H = t.top - t.y0, ph = (this.clock || 0) * 2.1;
    (this._shake || (this._shake = [])).push({ x: t.x + Math.sin(ph) * 0.05, y: t.y0 + H * 0.85, z: t.z + Math.cos(ph) * 0.05, r: 0.08 + 0.12 * amount });
  }

  // places a Pteranodon can land: the tops of big boulders, the cabin's ridge, the den rock (heights found
  // by casting down onto them)
  perchSpots() {
    if (this._perches) return this._perches;
    const list = [], ray = new Raycaster(), hits = [this.rocks?.group, this.group.getObjectByName('den')].filter(Boolean);
    const at = (x, z, kind) => {
      ray.set(new Vector3(x, 8, z), new Vector3(0, -1, 0));
      const h = ray.intersectObjects(hits, true)[0];
      if (h && h.point.y > 0.3) list.push({ x, z, y: h.point.y + 0.005, kind });
    };
    for (const t of this.rocks?.tops || []) at(t.x, t.z, 'rock');
    for (const B of this.solidBoxes || []) at((B.x0 + B.x1) / 2, (B.z0 + B.z1) / 2 + 0.3, 'den');
    const lp = this.ctx.modules.life?.props, cab = this.ctx.terrain.shape?.CABIN;
    if (lp?.ridgeY && cab) list.push({ x: cab.x, z: cab.z, y: lp.ridgeY + 0.01, kind: 'roof' });
    const box = this.ctx.box;
    return (this._perches = list.filter((s) => Math.abs(s.x) < box.halfW - 0.9 && Math.abs(s.z) < box.halfD - 0.7));
  }

  // the water's surface height at (x, z), or null on dry ground
  waterSurface(x, z) {
    const g = this.nav;
    if (!g || !this.surf) return null;
    const i = Math.floor((x - g.minX) / g.cell), j = Math.floor((z - g.minZ) / g.cell);
    if (i < 0 || j < 0 || i >= g.nx || j >= g.nz) return null;
    const v = this.surf[j * g.nx + i];
    if (Number.isNaN(v)) return null;
    if (v === -Infinity) return this.ctx.modules.water.lakeDepth(x, z) > 0.006 ? this.ctx.modules.water.level : null;
    return v;
  }

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
        if (dd < 3 && (d.state === 'idle' || d.state === 'walk') && !d.rally && d.actions.alert && rand() < 0.7) {
          d.heading = Math.atan2(p.x - d.pos.x, p.z - d.pos.z) * 0.3 + d.heading * 0.7;
          d.oneShot('alert');
        }
      });
    }
  }

  // stand where a browsing head reaches into a tree-fern crown at the height it feeds
  nearTree(d) {
    const reach = d.browseReach;
    const ferns = [...(this.flora.placements.araucaria || []), ...(this.flora.placements.treefern || [])].filter((t) => t.top);
    if (reach && ferns.length) {
      // the tall conifers grown for browsing come first (what it really ate), then anything else in reach
      const dd = (t) => Math.hypot(t.x - d.pos.x, t.z - d.pos.z) - (t.wantTop ? 100 : 0);
      ferns.sort((a, b) => dd(a) - dd(b));
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
    this.backdrop?.update(dt);
    this.rocks?.update(dt);
    this.paths?.update(dt);
    this.interact?.update(dt);
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
    this.clock = (this.clock || 0) + dt;
    if (this.duel && (this.duel.t += dt) > this.duel.len + 6) {
      for (const m of this.duel.mates) m.rally = null;
      this.duel = null;
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
    // heads and long necks brush through tree crowns too (the springs sway the whole tree a little)
    for (const d of this.walkers || []) {
      if (d.parent || !d.headBone) continue;
      d.headBone.getWorldPosition(this._pv);
      pushers.push({ x: this._pv.x, y: this._pv.y, z: this._pv.z, r: 0.12 * d.k });
    }
    // trees being rubbed against sway (requests from the last frame)
    for (const e of this._shake || []) pushers.push(e);
    this._shake = [];
    this.flora.setPushers(pushers);
    this.branchPush(dt);
    this.lamps?.update(dt);
    this.social.update(dt);
    for (const d of this.dinos) d.update(dt, env);
    this.weather.update(dt);
    this.night.update(dt);
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
