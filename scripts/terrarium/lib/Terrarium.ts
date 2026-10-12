import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Post} from './Post';
import {Room} from './Room';
import {Case, TANK, type Pane} from './Case';
import {Ground, poolDistance, CAVE} from './Ground';
import {Meadow} from './Meadow';
import {Dish} from './Dish';
import {Motes} from './Motes';
import {LeafDrift} from './LeafDrift';
import {Hardscape} from './Hardscape';
import {loadScans} from './Assets';
import {LizardModel} from './LizardModel';
import {Surface, SurfaceKind} from './Surface';
import {Plants} from './Plants';
import {Flora} from './Flora';
import {foliageUniforms} from './Foliage';
import {Water} from './Water';
import {Peaks} from './Peaks';
import {MossShells} from './MossShells';
import {Nav} from './Nav';
import {Insects} from './Insects';
import {LizardRig} from './LizardRig';
import {LizardBrain} from './LizardBrain';
import {Weather} from './Weather';
import {TerrariumAudio} from './Audio';
import {AirGlow} from './AirGlow';
import {Toad} from './Toad';
import {CloudShadow} from './CloudShadow';
import {Rainbow} from './Rainbow';
import {FishSchool} from './Fish';
import {mulberry32} from './Textures';

const DIRECT = new URLSearchParams(location.search).has('direct');
/** `?lite`: a lighter start for weak GPUs (and the reload after the GPU dropped the page). */
const LITE = new URLSearchParams(location.search).has('lite');
const STORM_LIGHT = new THREE.Color(0.86, 0.9, 1.0);
const DUSK_SKY = new THREE.Color(0.62, 0.42, 0.36);
const CLOUD_TINT = new THREE.Color(1.0, 0.95, 0.87);
const NIGHT_GLOW = new THREE.Color(0.035, 0.05, 0.11);
const CAVE_VIEW = new THREE.Vector3(CAVE.view.x, CAVE.view.y, CAVE.view.z);

export class Terrarium {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.004, 30);
  readonly controls: OrbitControls;
  readonly post: Post;
  readonly room = new Room();
  readonly case = new Case();
  readonly ground = new Ground();
  hardscape!: Hardscape;
  surface!: Surface;
  plants!: Plants;
  flora!: Flora;
  water!: Water;
  peaks!: Peaks;
  moss!: MossShells;
  rockMoss!: MossShells;
  nav!: Nav;
  insects!: Insects;
  rig!: LizardRig;
  brain!: LizardBrain;
  weather!: Weather;
  readonly audio = new TerrariumAudio();
  readonly air = new AirGlow();
  readonly cloudShadow = new CloudShadow();
  /** Where the hand brushes the plants (null: it's elsewhere); it eases in and out. */
  private hand = {target: null as THREE.Vector3 | null, pos: new THREE.Vector3(), w: 0};
  /** The lizard's wake: where its body and tail were a moment ago, for the plants to spring back from. */
  private wakeA = new THREE.Vector3();
  private wakeB = new THREE.Vector3();
  private wakeT = new THREE.Vector3();
  private wakeInit = false;
  private tmpFocus = new THREE.Vector3();
  private wadeT = 0;
  follow = false;
  temperature = 27;
  private plaqueT = 0;
  readonly moon: THREE.DirectionalLight;
  private homeView = {pos: new THREE.Vector3(0, 0.44, 1.78), target: new THREE.Vector3(0, 0.29, 0)};
  private quality = {window: 0, frames: 0, level: 0, locked: false};
  /** Draw the panes facing the eye after the clouds, over a fresh copy of the view (one more full-screen copy). */
  private glassOverClouds = true;
  private tmpEye = new THREE.Vector3();
  lizard!: LizardModel;
  readonly key: THREE.SpotLight;
  meadow!: Meadow;
  dish!: Dish;
  motes!: Motes;
  leafDrift!: LeafDrift;
  rainbow!: Rainbow;
  fish!: FishSchool;
  toad!: Toad;
  private poolWind = new THREE.Vector2();
  /** Leaf tips that hold rain: drips fall from them and the dragon licks them. */
  leafTips: THREE.Vector3[] = [];
  private dripT = 0;
  readonly heat: THREE.SpotLight;
  readonly hemi: THREE.HemisphereLight;
  readonly rim: THREE.DirectionalLight;
  readonly fill: THREE.DirectionalLight;
  readonly ready: Promise<void>;
  private clock = new THREE.Timer();
  private clockStarted = false;
  time = 0;
  private onFrame: ((dt: number, t: number) => void)[] = [];
  /** Effects turned off because the picture came out black, in order. */
  readonly fallbacks: string[] = [];
  private direct = DIRECT;
  private watch = {last: 0, black: 0, checks: 0};
  /** The browser took the GPU context away (a GPU reset, or memory pressure on a phone). */
  onContextLost?: () => void;
  /** Frames finished so far (a stalled count means nothing is being drawn). */
  framesDrawn = 0;
  /** A frame threw (the first time, and every so often after). */
  onFrameError?: (e: unknown) => void;
  private frameErrors = 0;

  constructor(readonly host: HTMLElement) {
    const r = new THREE.WebGLRenderer({antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: new URLSearchParams(location.search).has('capture')});
    r.setPixelRatio(new URLSearchParams(location.search).has('frames') ? 1 : Math.min(devicePixelRatio, LITE ? 1.25 : 2));
    r.toneMapping = THREE.NoToneMapping;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.autoClear = false;
    this.renderer = r;
    host.append(r.domElement);
    r.domElement.id = 'scene-canvas';
    r.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      r.setAnimationLoop(null);
      this.onContextLost?.();
    });

    const s = this.scene;
    // No scene.background: a colour background force-clears on every render() call,
    // which would erase the scene before the glass pass.
    r.setClearColor(new THREE.Color(0.01, 0.008, 0.006), 1);
    const pmrem = new THREE.PMREMGenerator(r);
    s.environment = pmrem.fromScene(this.room.envScene, 0.02).texture;
    s.environmentIntensity = 1.0;
    s.add(this.room.group, this.case.group, this.case.glassGroup, this.ground.mesh, this.ground.walls, this.air.mesh);
    r.shadowMap.autoUpdate = false;

    // Lamp in the lid: warm key light with soft shadows.
    // (a broad beam with a soft edge, reaching the moss along the front glass)
    this.key = new THREE.SpotLight(new THREE.Color(1.0, 0.84, 0.64), 11, 3, 0.9, 0.6, 2);
    this.key.position.set(-0.08, 1.1, 0.3);
    this.key.target.position.set(-0.02, 0.11, 0.01);
    this.key.castShadow = true;
    this.key.shadow.mapSize.setScalar(LITE ? 1024 : 2048);
    this.key.shadow.bias = -0.00025;
    this.key.shadow.normalBias = 0.0015;
    this.key.shadow.camera.near = 0.3;
    this.key.shadow.camera.far = 2.3;
    this.key.shadow.radius = 2;
    // passing clouds shade whatever the lamp lights
    this.key.map = this.cloudShadow.target.texture;
    s.add(this.key, this.key.target);
    // Basking lamp over the log.
    this.heat = new THREE.SpotLight(new THREE.Color(1.0, 0.72, 0.45), 1.1, 1.4, 0.3, 0.95, 2);
    this.heat.position.set(-0.36, 0.78, 0.05);
    this.heat.target.position.set(-0.36, 0.18, 0.04);
    s.add(this.heat, this.heat.target);
    this.hemi = new THREE.HemisphereLight(new THREE.Color(0.55, 0.45, 0.35), new THREE.Color(0.08, 0.05, 0.03), 0.5);
    s.add(this.hemi);
    this.rim = new THREE.DirectionalLight(new THREE.Color(0.6, 0.75, 0.9), 0.5);
    this.rim.position.set(0.4, 0.9, -1.2);
    s.add(this.rim);
    // Blue night light in the lid.
    this.moon = new THREE.DirectionalLight(new THREE.Color(0.45, 0.6, 1.0), 0);
    this.moon.position.set(0.2, 1.2, 0.3);
    s.add(this.moon);
    // Soft fill from the room in front of the case (lights the cut-away substrate).
    this.fill = new THREE.DirectionalLight(new THREE.Color(1.0, 0.78, 0.58), 0.9);
    this.fill.position.set(-0.6, 0.5, 2.0);
    s.add(this.fill);

    const cam = this.camera;
    cam.layers.enable(5);
    this.controls = new OrbitControls(cam, r.domElement);
    this.fitHome();
    cam.position.copy(this.homeView.pos);
    this.controls.target.copy(this.homeView.target);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.05;
    this.controls.maxDistance = 4.2;
    this.controls.minPolarAngle = 0.55;
    this.controls.maxPolarAngle = 1.66;
    this.controls.minAzimuthAngle = -1.15;
    this.controls.maxAzimuthAngle = 1.15;
    this.controls.zoomSpeed = 0.8;
    {
      const q = new URLSearchParams(location.search);
      const c = q.get('cam')?.split(',').map(Number), t = q.get('target')?.split(',').map(Number);
      if (c?.length === 3) cam.position.set(c[0], c[1], c[2]);
      if (t?.length === 3) this.controls.target.set(t[0], t[1], t[2]);
    }
    this.controls.update();

    // (layer 3: the near panes, drawn last over the clouds)
    for (const l of [this.key, this.heat, this.hemi, this.rim, this.fill, this.moon, this.room.lampLight]) {l.layers.enable(1); l.layers.enable(3);}
    this.post = new Post(r, s, cam, LITE ? 0 : 4);
    if (LITE) {this.post.settings.ao = false; this.post.settings.dof = false; this.glassOverClouds = false;}
    const q = new URLSearchParams(location.search);
    for (const k of ['ao', 'bloom', 'dof'] as const) if (q.get(k) === '0') this.post.settings[k] = false;
    if (q.get('quality') === 'full' || q.has('frames')) this.quality.locked = true;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(host);
    this.ready = this.load();
  }

  private async load() {
    const [scans, peaks] = await Promise.all([loadScans(), Peaks.load('./peaks/')]);
    this.peaks = peaks;
    this.hardscape = new Hardscape(scans, peaks);
    this.scene.add(this.hardscape.group);
    this.surface = new Surface(this.ground.mesh, this.hardscape.placed.map((p) => ({mesh: p.mesh, kind: p.mesh === this.hardscape.log ? SurfaceKind.Wood : SurfaceKind.Rock})));
    {
      // what lies on top everywhere (ground, stones, the log): pushed leaves rest on it
      const NX = 240, NZ = 100, top = new Uint16Array(NX * NZ);
      for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) top[j * NX + i] = THREE.DataUtils.toHalfFloat(this.surface.topAt(-TANK.w / 2 + ((i + 0.5) / NX) * TANK.w, -TANK.d / 2 + ((j + 0.5) / NZ) * TANK.d));
      const tex = new THREE.DataTexture(top, NX, NZ, THREE.RedFormat, THREE.HalfFloatType);
      tex.magFilter = tex.minFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      foliageUniforms.tTop.value = tex;
    }
    this.plants = new Plants(scans, this.surface);
    this.ground.uniforms.tMoss.value = this.plants.moss.texture;
    this.scene.add(this.plants.group);
    this.flora = new Flora(this.surface, this.hardscape.placed.filter((p) => p.mesh !== this.hardscape.log).map((p) => p.mesh), this.hardscape.log);
    this.scene.add(this.flora.group);
    // a dish of greens on open ground at the front
    const ds = Dish.findSpot(this.surface, [...this.plants.obstacles, ...this.flora.obstacles]);
    this.dish = new Dish(this.surface, ds[0], ds[1]);
    this.scene.add(this.dish.group);
    this.meadow = new Meadow(this.surface, 720, [{x: ds[0], z: ds[1], r: this.dish.radius + 0.012}]);
    this.scene.add(this.meadow.mesh);
    this.moss = new MossShells(this.surface, this.plants.moss, Number(new URLSearchParams(location.search).get('shells') || (LITE ? 8 : 14)));
    this.scene.add(this.moss.mesh);
    // cushions of moss on the rock ledges and here and there on the log
    {
      const shells = Number(new URLSearchParams(location.search).get('shells') || (LITE ? 8 : 12));
      const rocks = this.hardscape.placed.filter((p) => p.mesh !== this.hardscape.log).map((p) => p.mesh);
      this.rockMoss = new MossShells(this.surface, this.plants.moss, shells, MossShells.rockGeometry(rocks, this.hardscape.log, mulberry32(99)));
      this.scene.add(this.rockMoss.mesh);
    }
    this.water = new Water(this.surface, this.peaks.data.ledges);
    this.peaks.setFallSpots(this.water.wetSpots(24));
    this.scene.add(this.water.group);
    // a school of neon tetras in the pool
    this.fish = new FishSchool();
    this.scene.add(this.fish.group);
    this.fish.onBite = (x, z) => this.water.ripples.add(x, z, 0.0012, -0.9);
    this.water.onDisturb = (x, z, s) => this.fish.startle(x, z, s);
    // a fire-bellied toad on the bank and in the pool
    this.toad = new Toad(this.surface);
    this.scene.add(this.toad.group);
    this.toad.onRipple = (x, z, s) => {
      this.water.ripples.add(x, z, 0.003 + 0.004 * s, -(0.6 + 1.6 * s));
      if (s > 0.5) this.water.flick(x, z, 2, 0.1);
      this.fish.startle(x, z, 0.4 + s, 0.07);
    };
    this.toad.onCall = (pan) => this.audio.toadCall(pan);
    this.resize();
    this.lizard = await LizardModel.load('./lizard/');
    this.lizard.setMorph(new URLSearchParams(location.search).get('morph') ?? 'normal');
    this.scene.add(this.lizard.root);
    this.nav = new Nav(this.surface, [...this.plants.obstacles, ...this.flora.obstacles, {x: this.dish.centre.x, z: this.dish.centre.z, r: this.dish.radius * 0.9}]);
    this.insects = new Insects(this.surface, this.nav);
    this.scene.add(this.insects.group);
    this.rig = new LizardRig(this.lizard, this.surface);
    this.brain = new LizardBrain(this.rig, this.nav, this.surface, this.insects, this.water);
    this.brain.dish = this.dish;
    this.brain.onLap = (p) => this.water.addRipple(p.x, p.z, 1, this.time);
    // feet in the shallows ring the water; the body pushes a little wake
    this.rig.onFootDown = (p) => {
      if (poolDistance(p.x, p.z) < 0) {
        this.water.ripples.add(p.x, p.z, 0.004, -2.2);
        if (Math.random() < 0.3) this.water.flick(p.x, p.z, 1, 0.08);
      }
    };
    this.insects.onSplash = (x, z) => {this.water.ripples.add(x, z, 0.004, -2.5); this.water.flick(x, z, 3, 0.15); this.fish.startle(x, z, 0.7, 0.09);};
    this.weather = new Weather(this.surface, this.water);
    {
      const h = Number(new URLSearchParams(location.search).get('hours'));
      if (h > 0) this.weather.hours = this.weather.sunHours = h % 24;
    }
    this.scene.add(this.weather.group);
    {
      // raindrops on the pool make the fish twitch now and then
      const drop = this.weather.rain.onWaterDrop;
      this.weather.rain.onWaterDrop = (x, z, s) => {drop?.(x, z, s); if (Math.random() < 0.12) this.fish.startle(x, z, 0.35, 0.04);};
    }
    // dust on the air and loose leaves on the floor, both moved by the wind field
    this.motes = new Motes(this.weather.wind, (x, z) => this.surface.topAt(x, z));
    this.scene.add(this.motes.points);
    this.leafDrift = new LeafDrift(this.surface, this.weather.wind);
    this.scene.add(this.leafDrift.mesh);
    this.rainbow = new Rainbow((x, z) => this.surface.topAt(x, z));
    this.scene.add(this.rainbow.mesh);
    this.collectLeafTips();
    this.brain.leafTips = this.leafTips;
    // a lick knocks the odd drop off the leaf
    this.brain.onSip = (p) => {if (Math.random() < 0.35) this.weather.rain.drip(p.x, p.y - 0.002, p.z);};
    this.weather.lightning.light.layers.enable(1);
    this.weather.lightning.light.layers.enable(3);
    foliageUniforms.tWind.value = this.weather.wind.texture;
    this.water.uniforms.tWind.value = this.weather.wind.texture;
    this.ground.uniforms.tWetMap.value = this.weather.rain.wetTexture;
    this.hookWeather();
    this.resize();
    for (const pane of this.case.panes) pane.fog.settle(this.glassHumidity());
    // compile every material's shaders now, behind the loading screen, instead of
    // stalling the first frames (a phone can take many seconds over them); in the
    // target's format, so the programs are the ones the frames will use
    this.renderer.setRenderTarget(this.post.sceneRT);
    try {await this.renderer.compileAsync(this.scene, this.camera);} catch (e) {console.warn('Terrarium: shader precompile', e);}
    this.renderer.setRenderTarget(null);
    {
      const q = new URLSearchParams(location.search);
      const crickets = Number(q.get('crickets') || 0);
      for (let i = 0; i < crickets; i++) this.insects.release();
      const sim = Number(q.get('sim') || 0);
      for (let t = 0; t < sim; t += 1 / 30) this.simulate(1 / 30);
    }
    const q = new URLSearchParams(location.search);
    const frames = Number(q.get('frames') || 0);
    if (frames > 0) {
      // Capture mode for QA: render a fixed number of frames then stop.
      for (let i = 0; i < frames; i++) {
        const t0 = performance.now();
        this.frame(i === 0 ? 0.016 : Number(q.get('step') || 0.033));
        (window as any).frameMs = performance.now() - t0;
        await new Promise((r) => setTimeout(r, 0));
      }
      this.renderer.getContext().finish();
      return;
    }
    this.renderer.setAnimationLoop(() => this.safeFrame());
  }

  /** Tips of the plants' leaves (and points on the fern fronds), clear of the ground. */
  private collectLeafTips() {
    const rnd = mulberry32(99);
    const out: THREE.Vector3[] = [];
    const m = new THREE.Matrix4();
    this.plants.group.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const g = o.geometry as THREE.BufferGeometry;
      const pos = g.attributes.position as THREE.BufferAttribute;
      if (o.name === 'leaf-plants') {
        // the midrib's last vertex on each blade (not stems or creepers)
        const uv = g.attributes.uv as THREE.BufferAttribute, kind = g.attributes.aKind as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          if (kind.getX(i) > 2.5 || uv.getX(i) < 0.99 || Math.abs(uv.getY(i) - 0.5) > 0.01) continue;
          out.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld));
        }
      } else if (o instanceof THREE.InstancedMesh && o.name.startsWith('ferns-')) {
        for (let k = 0; k < o.count; k++) {
          o.getMatrixAt(k, m);
          for (let s = 0; s < 16; s++) out.push(new THREE.Vector3().fromBufferAttribute(pos, Math.floor(rnd() * pos.count)).applyMatrix4(m));
        }
      }
    });
    this.leafTips = out.filter((p) => p.y > this.surface.heightAt(p.x, p.z) + 0.012 && !this.surface.roofed(p.x, p.z) && poolDistance(p.x, p.z) > 0);
  }

  /** One squeeze of the misting bottle aimed at `at` (a point in the case). */
  mist(at: THREE.Vector3) {
    // the nozzle is a hand's breadth off the target, towards the viewer and up
    const toEye = this.camera.position.clone().sub(at).setY(0).normalize();
    const from = at.clone().addScaledVector(toEye, 0.08).add(new THREE.Vector3(0, 0.07, 0));
    this.weather.mistPuff(from, at);
    this.rainbow.spray(from, at);
    this.brain.misted(at);
    this.audio.mist();
  }

  /** Sound and the lizard follow the weather's events. */
  private hookWeather() {
    const w = this.weather, a = this.audio;
    const pan = (x: number) => THREE.MathUtils.clamp(x / (TANK.w / 2), -1, 1) * 0.7;
    w.clouds.events.squish = (c, amt) => a.squish(amt);
    w.clouds.events.grab = (c) => a.grab(c.size);
    w.clouds.events.release = (c, sp) => a.release(c.size, sp, c.squeeze);
    w.clouds.events.merge = (c) => a.merge(c.size);
    w.clouds.events.pop = (c, big) => a.pop(big);
    w.clouds.events.shrink = (c, amt) => a.shrink(amt);
    this.brain.onCrunch = (p, strength) => a.crunch(strength, pan(p.x));
    w.clouds.events.zap = (c) => a.zap(c.charge);
    w.onStrike = (end, strength, water, first) => {
      if (!first) return;
      const dist = this.camera.position.distanceTo(end);
      a.thunder(Math.min(1.2, strength), 0.12 + dist * 0.16, pan(end.x));
      this.brain.lightning(end, strength);
      this.insects.scatter(end, 0.25);
      if (water) this.fish.startle(end.x, end.z, 2, 0.45);
    };
  }

  /** Advances the living parts of the scene (no rendering). */
  simulate(dt: number) {
    this.time += dt;
    this.weather.update(dt, this.time, this.camera);
    this.applyClimate(dt);
    this.motes.update(dt, this.weather.daylight, this.key.position, this.key.target.position, this.key.color);
    this.leafDrift.update(dt);
    this.brain.cameraPos.copy(this.camera.position);
    this.insects.update(dt);
    this.brain.update(dt);
    this.wake(dt);
    this.updateFish(dt);
    this.water.update(dt, this.time, 1);
  }

  /** The fish: they keep clear of the dragon when it wades. */
  private updateFish(dt: number) {
    const I = this.rig.inputs;
    const threats: {p: THREE.Vector3; r: number}[] = [];
    if (poolDistance(I.x, I.z) < 0.15) threats.push({p: this.rig.spinePoints()[2], r: 0.11}, {p: this.rig.snout, r: 0.08});
    this.weather.wind.sample(0.3, 0.1, this.poolWind);
    this.fish.update(dt, threats, this.weather.daylight, this.poolWind);
    // the toad flashes its belly at the dragon's head or chest coming close
    this.toad.update(dt, {threats: [{p: this.rig.snout, r: 0.075}, {p: this.rig.spinePoints()[2], r: 0.06}], night: 1 - this.weather.daylight});
  }

  /** The lizard wading: a bow wave at the chest and a trail behind. */
  private wake(dt: number) {
    const I = this.rig.inputs;
    if (poolDistance(I.x, I.z) > -0.01) return;
    this.wadeT -= dt;
    const sp = Math.abs(I.speed);
    if (this.wadeT > 0) return;
    this.wadeT = sp > 0.01 ? 0.05 : 0.6;
    const chest = this.rig.spinePoints()[2];
    this.water.ripples.add(chest.x, chest.z, 0.008, -(0.6 + sp * 25));
    if (sp < 0.01) this.water.ripples.add(I.x, I.z, 0.01, -0.5);
  }

  /** Lights, wetness and condensation follow the weather and the lamp's day. */
  private applyClimate(dt: number) {
    const w = this.weather;
    const day = w.daylight;
    // clouds and storms dim the lamp; lightning flashes the whole case
    const gloom = THREE.MathUtils.smoothstep(w.clouds.cover * 0.55 + w.clouds.storminess * 0.75, 0, 1);
    const flash = w.flash * (1 - 0.55 * day);
    const overcast = gloom;
    // the lamp follows its arc like a sun: shadows swing through the day and
    // the light comes in low, long and amber in the morning and evening
    const sd = w.sunDir;
    const lift = Math.max(sd.y, 0.42);
    this.key.position.set(sd.x * 0.85, lift, Math.max(0.12, sd.z)).normalize().multiplyScalar(1.12).add(this.key.target.position);
    this.key.intensity = 11 * day * (1 - gloom * 0.55) * (1 + 0.25 * w.golden);
    this.key.color.copy(w.sunColor).lerp(STORM_LIGHT, gloom * 0.5);
    this.heat.intensity = 0.75 * day * (1 - gloom * 0.4);
    this.hemi.intensity = (0.15 + 0.35 * day) * (1 - gloom * 0.4) + 2.2 * flash * 0.4;
    this.hemi.color.setRGB(0.55, 0.45, 0.35).lerp(DUSK_SKY, w.golden * 0.7);
    this.fill.intensity = (0.35 + 0.55 * day) * (1 - gloom * 0.25);
    this.moon.intensity = 0.55 * (1 - day);
    this.rim.intensity = 0.2 + 0.3 * day + flash * 0.8;
    this.scene.environmentIntensity = 1.0 * (1 - gloom * 0.2) + flash * 0.3;
    this.post.settings.bloomStrength = 0.22 + 0.9 * flash;
    this.case.regulatorGlow.emissive.setRGB(0.3 + 0.7 * day, 0.35 + 0.27 * day, 1.0 - 0.72 * day);
    this.case.regulatorGlow.emissiveIntensity = 1.2 + 1.3 * day;
    this.room.setLampLevel(0.75 + 0.25 * (1 - day));
    const cl = this.weather.clouds.shared;
    // the lamp lights the clouds cotton-white, just warmed on top
    cl.uLightColor.value.copy(w.sunColor).multiply(CLOUD_TINT).multiplyScalar(day * 0.9).add(NIGHT_GLOW).multiplyScalar(1 - gloom * 0.45);
    cl.uAmbient.value.setRGB(0.03 + 0.21 * day, 0.03 + 0.165 * day, 0.04 + 0.12 * day);
    cl.uSky.value.setRGB(0.05 + 0.33 * day, 0.05 + 0.3 * day, 0.06 + 0.26 * day).lerp(new THREE.Color(0.11, 0.12, 0.14), gloom * 0.6);
    cl.uLidGlow.value.copy(this.case.regulatorGlow.emissive).multiplyScalar(0.6);
    this.water.setLight(day * (1 - gloom * 0.4), this.key.color);
    this.water.uniforms.uFlash.value = flash;
    const ambient = new THREE.Color(0.03 + 0.17 * day, 0.03 + 0.15 * day, 0.035 + 0.12 * day).multiplyScalar(1 - gloom * 0.3);
    this.weather.setLight(day * (1 - gloom * 0.45), this.key.color, this.key.position, ambient);
    foliageUniforms.uGust.value.copy(this.weather.wind.uniforms.uGust.value);
    // what shines through leaves and thin skin: the lamp as it is now (off at night)
    foliageUniforms.uKeyColor.value.copy(this.key.color).multiplyScalar(this.key.intensity / 11);
    this.water.uniforms.uGust.value.copy(this.weather.wind.uniforms.uGust.value);
    this.ground.uniforms.uCaustic.value = day;
    // wetness darkens soil, glosses leaves, rock and skin
    this.ground.uniforms.uWet.value = w.wet;
    foliageUniforms.uWet.value = w.wet;
    foliageUniforms.uHumid.value = THREE.MathUtils.clamp((w.humidity - 0.45) * 2.2 + w.mist * 0.3, 0, 1);
    this.peaks.uniforms.uWet.value = w.wet * 0.8;
    this.lizard.skin.uWet.value = w.wet * 0.5;
    this.brain.leavesWet = w.wet;
    // after rain the leaves drip for a while
    if (w.wet > 0.12 && this.leafTips.length) {
      this.dripT -= dt * 9 * (w.wet - 0.1);
      while (this.dripT < 0) {
        this.dripT += 0.5 + Math.random();
        const p = this.leafTips[Math.floor(Math.random() * this.leafTips.length)];
        w.rain.drip(p.x, p.y - 0.001, p.z);
      }
    }
    // a bow in the rain wherever the lamp shines through it
    this.rainbow.update(dt, w.clouds.sources, this.camera, this.key.position, this.key.target.position, this.key.color,
      THREE.MathUtils.clamp(this.key.intensity / 11, 0, 1.3) * (1 - 0.8 * w.clouds.storminess) * 0.9);
    this.brain.night = day < 0.2;
    this.brain.raining = w.rainAmount > 0.1;
    this.brain.storm = w.clouds.storminess;
    this.brain.heat = day;
    {
      // how warm the dragon's spot is: the basking lamp's pool of light, the
      // sun-lamp unless it is in the cave, minus rain on its back
      const I = this.rig.inputs;
      const hx = this.heat.target.position.x, hz = this.heat.target.position.z;
      const lamp = THREE.MathUtils.smoothstep(0.2 - Math.hypot(I.x - hx, I.z - hz), 0, 0.14) * (this.heat.intensity / 0.75);
      const roofed = this.surface.roofed(I.x, I.z);
      const sun = day * (1 - gloom * 0.6) * (roofed ? 0.2 : 1);
      this.brain.lampOnIt = lamp;
      // (the rock of the cave holds the day's warmth)
      this.brain.envTemp = THREE.MathUtils.clamp(0.14 + 0.3 * sun + 0.5 * lamp + (roofed ? 0.12 * day : 0) - (roofed ? 0 : 0.22 * Math.min(1, w.rainAmount)) - 0.08 * w.wet, 0, 1);
    }
    this.temperature = 22 + 7 * day - overcast * 2 - w.mist * 1.5 - (w.rainAmount > 0.1 ? 1 : 0);
    const warmth = day * 0.7;
    for (const pane of this.case.panes) pane.fog.update(dt, this.glassHumidity(), warmth);
    this.case.shared.uHaze.value.setRGB(0.012 + 0.02 * day, 0.011 + 0.016 * day, 0.01 + 0.012 * day);
    this.plaqueT -= dt;
    if (this.plaqueT < 0) {this.plaqueT = 2; this.case.drawPlaque(this.temperature, w.humidity * 100);}
    this.audio.update(dt, {rain: w.rainAmount, wind: w.wind.energy, crickets: this.insects.crickets.length, night: 1 - day, flow: 1});
  }

  /** How hard the glass fogs: the case's usual humid air keeps it mostly clear; rain and fog steam it up. */
  private glassHumidity() {
    const w = this.weather;
    return THREE.MathUtils.clamp(0.45 + (w.humidity - 0.65) * 1.6 + w.mist * 0.25, 0, 1);
  }

  /** Frames the whole case for the current aspect, leaving room for the controls. */
  private fitHome() {
    const w = this.host.clientWidth || innerWidth, h = this.host.clientHeight || innerHeight;
    const aspect = w / h;
    const vfov = THREE.MathUtils.degToRad(this.camera.fov);
    const top = 64 / h, bottom = (w <= 1010 ? 150 : 110) / h; // HUD bands as fractions of the view
    const usable = 1 - top - bottom;
    const caseH = 0.8;
    // On tall, narrow screens let the case overflow the sides a little so it reads larger.
    const caseW = aspect < 0.8 ? 0.95 : 1.36;
    const dV = (caseH / 2) / Math.tan(vfov / 2) / usable;
    const dH = (caseW / 2) / (Math.tan(vfov / 2) * aspect) / 0.96;
    const d = Math.max(dV, dH);
    // shift the aim so the case sits in the band between the HUD rows
    const shift = (bottom - top) * Math.tan(vfov / 2) * d;
    const dir = new THREE.Vector3(0, 0.08, 1).normalize();
    this.homeView.target.set(0, 0.3 - shift * 0.95, 0);
    this.homeView.pos.copy(this.homeView.target).addScaledVector(dir, d);
  }

  resetView() {
    this.fitHome();
    this.camera.position.copy(this.homeView.pos);
    this.controls.target.copy(this.homeView.target);
    this.controls.update();
  }

  /** Does a ray pass close to the lizard's spine? */
  hitLizard(ray: THREE.Ray) {
    const pts = [this.rig.snout, ...this.rig.spinePoints()];
    return pts.some((p) => ray.distanceToPoint(p) < 0.022);
  }

  /** Where a ray meets the ground or hardscape inside the case. */
  /** The hand is over the plants at `p` (a point on the ground, stones or log), or has left them (null). */
  setHand(p: THREE.Vector3 | null) {
    if (p) (this.hand.target ??= new THREE.Vector3()).copy(p);
    else this.hand.target = null;
  }

  /**
   * What parts the plants: the hand, the lizard's head, body and tail (as
   * capsules, so overlapping spheres never double the push), and its wake,
   * which lags behind so the plants it passed spring back over a moment
   * instead of snapping upright.
   */
  updatePush(dt: number) {
    const A = foliageUniforms.uPush.value, B = foliageUniforms.uPushB.value;
    const h = this.hand;
    if (h.target) {
      // eases toward the pointer (a jump from the floor onto the log sweeps, not snaps)
      if (h.w < 0.02) h.pos.copy(h.target);
      else h.pos.lerp(h.target, 1 - Math.exp(-dt * 18));
      h.w = Math.min(1, h.w + dt * 6);
    } else h.w = Math.max(0, h.w - dt * 4);
    // (held a little above the surface: a hand brushing through, not raking the soil)
    A[0].set(h.pos.x, h.pos.y + 0.012, h.pos.z, 0.04);
    B[0].set(h.pos.x, h.pos.y + 0.012, h.pos.z, h.w);
    const sp = this.rig.spinePoints(), sn = this.rig.snout;
    const tail = this.rig.tailPoint(2), tail2 = this.rig.tailPoint(5);
    // (the head from the snout back to the neck, then the body from the neck to the hips: no gap between them)
    A[1].set(sn.x, sn.y, sn.z, 0.04); B[1].set(sp[1].x, sp[1].y, sp[1].z, 1);
    A[2].set(sp[1].x, sp[1].y, sp[1].z, 0.062); B[2].set(sp[5].x, sp[5].y, sp[5].z, 1);
    A[3].set(sp[5].x, sp[5].y, sp[5].z, 0.035); B[3].set(tail.x, tail.y, tail.z, 1);
    A[4].set(tail.x, tail.y, tail.z, 0.022); B[4].set(tail2.x, tail2.y, tail2.z, 1);
    // the wake: chest, hips and tail as they were a moment ago, fading as the body catches up
    if (!this.wakeInit) {this.wakeA.copy(sp[2]); this.wakeB.copy(sp[5]); this.wakeT.copy(tail); this.wakeInit = true;}
    const k = 1 - Math.exp(-dt / 0.35);
    this.wakeA.lerp(sp[2], k); this.wakeB.lerp(sp[5], k); this.wakeT.lerp(tail, k);
    const lag = Math.max(this.wakeA.distanceTo(sp[2]), this.wakeB.distanceTo(sp[5]));
    const wake = 0.7 * THREE.MathUtils.smoothstep(lag, 0.004, 0.035);
    A[5].set(this.wakeA.x, this.wakeA.y, this.wakeA.z, 0.058); B[5].set(this.wakeB.x, this.wakeB.y, this.wakeB.z, wake);
    A[6].set(this.wakeB.x, this.wakeB.y, this.wakeB.z, 0.032); B[6].set(this.wakeT.x, this.wakeT.y, this.wakeT.z, wake);
    A[7].w = 0; B[7].w = 0;
  }

  pickInside(ray: THREE.Ray): THREE.Vector3 | null {
    const rc = new THREE.Raycaster(ray.origin, ray.direction);
    (rc as any).firstHitOnly = true;
    const hits = rc.intersectObjects([this.ground.mesh, ...this.hardscape.placed.map((p) => p.mesh)], false);
    return hits.length ? hits[0].point : null;
  }

  feed(at: {x: number; z: number} | null) {
    const c = this.insects.release();
    if (at) {c.pos.x = THREE.MathUtils.clamp(at.x, -0.5, 0.5); c.pos.z = THREE.MathUtils.clamp(at.z, -0.2, 0.2);}
    return c;
  }

  wipeGlass(ray: THREE.Ray) {
    let best: {pane: Pane; uv: THREE.Vector2; d: number} | null = null;
    for (const pane of this.case.panes) {
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(pane.normal, pane.mesh.position);
      const hit = ray.intersectPlane(plane, new THREE.Vector3());
      if (!hit) continue;
      const uv = pane.toUv(hit);
      if (!uv) continue;
      const d = hit.distanceTo(ray.origin);
      if (!best || d < best.d) best = {pane, uv, d};
    }
    if (best) best.pane.fog.wipe(best.uv.x, best.uv.y, 0.035);
  }

  /** The follow camera keeps the lizard centred and eases in to a close view. */
  updateFollow(dt: number) {
    if (!this.follow) return;
    const head = this.rig.snout;
    const body = new THREE.Vector3(this.rig.inputs.x, head.y - 0.01, this.rig.inputs.z);
    const focus = body.lerp(head, 0.45);
    const before = this.controls.target.clone();
    this.controls.target.lerp(focus, 1 - Math.exp(-dt * 3));
    // carry the camera along with the target so the framing does not swing
    this.camera.position.add(this.controls.target.clone().sub(before));
    const d = this.camera.position.distanceTo(this.controls.target);
    if (d > 0.42) this.camera.position.lerp(this.controls.target, 1 - Math.exp(-dt * 1.2));
    // in the cave: come round to the front to look in at the mouth
    if (this.brain.mode === 'shelter') this.camera.position.lerp(CAVE_VIEW, 1 - Math.exp(-dt * 0.5));
    // never let the follow camera dip into the ground or a rock
    const floor = this.surface.topAt(this.camera.position.x, this.camera.position.z) + 0.012;
    if (this.camera.position.y < floor) this.camera.position.y = floor;
  }

  addFrameHandler(f: (dt: number, t: number) => void) {this.onFrame.push(f);}

  resize() {
    const w = this.host.clientWidth || innerWidth, h = this.host.clientHeight || innerHeight;
    const pxScale = h * this.renderer.getPixelRatio() / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2));
    this.weather?.setPixelScale(pxScale);
    this.motes?.setPixelScale(pxScale);
    this.water?.setPixelScale(pxScale);
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = `${w}px`;
    this.renderer.domElement.style.height = `${h}px`;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    this.post.setSize(w, h, pr);
    this.case.shared.uResolution.value.set(Math.round(w * pr), Math.round(h * pr));
    this.water?.uniforms.uResolution.value.set(Math.round(w * pr), Math.round(h * pr));
    this.weather?.setResolution(Math.round(w * pr), Math.round(h * pr));
  }

  /**
   * One frame, kept going through an error: three's loop stops for good at the
   * first exception, which would leave the canvas blank with the controls and
   * sound still running. A failure that repeats turns the effects down.
   */
  private safeFrame() {
    try {
      this.frame();
    } catch (e) {
      this.frameErrors++;
      if (this.frameErrors === 1 || this.frameErrors % 300 === 0) {
        console.error('Terrarium: a frame failed', e);
        this.onFrameError?.(e);
      }
      if (this.frameErrors % 30 === 0) this.degrade();
    }
  }

  /** Steps effects down only after sustained slow frames; never on device labels. */
  private adapt(rawDt: number) {
    const q = this.quality;
    if (q.locked) return;
    q.window += rawDt;
    q.frames++;
    if (q.window < 2.5) return;
    const avg = q.window / q.frames;
    q.window = 0;
    q.frames = 0;
    if (avg < 1 / 40 || this.time < 4) return;
    q.level++;
    const r = this.renderer;
    if (q.level === 1) r.setPixelRatio(Math.min(r.getPixelRatio(), 1.5));
    else if (q.level === 2) {this.post.settings.dof = false; this.glassOverClouds = false; this.weather.clouds.shared.uSteps.value = 24; this.weather.fogVolume.uniforms.uSteps.value = 26; this.air.uniforms.uSteps.value = 8;}
    else if (q.level === 3) r.setPixelRatio(Math.min(r.getPixelRatio(), 1.15));
    else if (q.level === 4) {this.post.settings.ao = false; this.air.enabled = false;}
    else if (q.level === 5) {for (const m of [this.moss, this.rockMoss]) {m.mesh.count = 8; m.uniforms.uShells.value = 8;}}
    else if (q.level === 6) r.setPixelRatio(0.9);
    else q.locked = true;
    this.resize();
  }

  setQualityLocked(full: boolean) {
    this.quality.locked = full;
  }

  frame(fixedDt?: number) {
    // (starts at the first frame, and a tab left in the background doesn't count
    // as one long frame when it comes back)
    if (!this.clockStarted) {this.clockStarted = true; this.clock.connect(document); this.clock.reset();}
    this.clock.update();
    const raw = this.clock.getDelta();
    if (fixedDt === undefined) this.adapt(raw);
    const dt = fixedDt ?? Math.min(0.05, raw);
    this.time += dt;
    this.controls.update();
    this.ground.uniforms.uTime.value = this.time;
    foliageUniforms.uTime.value = this.time;
    this.camera.updateMatrixWorld();
    foliageUniforms.uKeyDirView.value.copy(this.key.position).sub(this.key.target.position).normalize().transformDirection(this.camera.matrixWorldInverse);
    foliageUniforms.uFolKeyPos.value.copy(this.key.position);
    for (const f of this.onFrame) f(dt, this.time);
    this.weather.update(dt, this.time, this.camera);
    this.weather.clouds.sort(this.camera);
    this.weather.fogVolume.update(dt, this.time, this.camera, this.post.distRT.texture, this.post.width, this.post.height);
    this.air.moisture = THREE.MathUtils.clamp(this.weather.humidity * 0.8 + this.weather.mist * 0.5 + this.weather.rainAmount * 0.3, 0, 1);
    this.air.update(this.key, this.cloudShadow.target.texture, this.post.distRT.texture, this.post.width, this.post.height, this.framesDrawn);
    this.applyClimate(dt);
    this.updateFollow(dt);
    this.brain.cameraPos.copy(this.camera.position);
    this.insects.update(dt);
    this.brain.update(dt);
    this.wake(dt);
    this.updateFish(dt);
    this.updatePush(dt);
    // The depth of field focuses on the lizard while it is in view (it is what one
    // looks at), otherwise on the middle of the picture (see Post).
    {
      const sp = this.rig.spinePoints();
      const body = this.tmpFocus.copy(sp[2]).lerp(this.rig.snout, 0.35);
      const ndc = body.clone().project(this.camera);
      // (its depth along the view, as the depth of field measures it)
      const d = -body.clone().applyMatrix4(this.camera.matrixWorldInverse).z;
      this.post.subject = ndc.z < 1 && d > 0 && Math.abs(ndc.x) < 0.8 && Math.abs(ndc.y) < 0.8 ? d : 0;
      this.post.subjectUv.set(ndc.x * 0.5 + 0.5, ndc.y * 0.5 + 0.5);
    }
    this.renderer.shadowMap.needsUpdate = true;
    const keyDir = this.key.position.clone().sub(this.key.target.position).normalize();
    this.water.uniforms.uKeyDir.value.copy(keyDir);
    this.water.update(dt, this.time, 1);
    this.water.stepRipples(this.renderer, dt);
    this.lizard.root.updateMatrixWorld(true);
    this.cloudShadow.update(this.renderer, this.weather.clouds, this.key);
    // the pool mirrors the clouds too (without the main view's depth)
    this.weather.setDistance(null);
    this.water.renderReflection(this.renderer, this.scene, this.camera, this.post.width, this.post.height);
    if (this.direct) {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.setRenderTarget(null);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.framesDrawn++;
      return;
    }
    this.post.render(this.time, (refraction, distance) => {
      this.case.shared.tRefract.value = refraction;
      this.water.uniforms.tRefract.value = refraction;
      this.water.setDistance(distance);
      this.weather.setDistance(distance);
      const mask = this.camera.layers.mask;
      // The panes between the eye and the clouds are drawn last, refracting a
      // fresh copy of the view that has the clouds (and the fog, the rain) in it:
      // their condensation and haze then lie over a cloud as over everything else.
      const near = this.glassOverClouds ? this.case.panes.filter((p) => p.mesh.visible && p.normal.dot(this.tmpEye.subVectors(this.camera.position, p.mesh.position)) > 0) : [];
      for (const p of near) p.mesh.layers.set(3);
      this.camera.layers.set(1);
      this.camera.layers.enable(2);
      this.renderer.render(this.scene, this.camera);
      if (near.length) {
        this.post.copyRefraction();
        this.camera.layers.set(3);
        this.renderer.render(this.scene, this.camera);
        for (const p of near) p.mesh.layers.set(1);
      }
      this.camera.layers.mask = mask;
    }, (target) => this.weather.clouds.renderDistance(this.renderer, this.camera, target));
    this.framesDrawn++;
    this.checkBlack();
  }

  /**
   * Looks at the finished picture now and then. If it comes out black twice in a
   * row (a GPU failing at one of the effects), turns effects off one at a time
   * until the scene shows.
   */
  private checkBlack() {
    // (by the clock, not the simulation's capped steps, so a slow phone is not kept waiting)
    const w = this.watch, now = performance.now();
    if (now - w.last < (w.checks < 15 ? 1500 : 8000) || document.visibilityState !== 'visible') return;
    w.last = now;
    w.checks++;
    const gl = this.renderer.getContext();
    const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight;
    const row = new Uint8Array(W * 4);
    let lit = 0;
    for (const f of [0.3, 0.5, 0.7]) {
      gl.readPixels(0, Math.floor(H * f), W, 1, gl.RGBA, gl.UNSIGNED_BYTE, row);
      for (let i = 0; i < W; i++) if (Math.max(row[i * 4], row[i * 4 + 1], row[i * 4 + 2]) > 10) lit++;
    }
    w.black = lit < W * 3 * 0.002 ? w.black + 1 : 0;
    if (w.black >= 2) {w.black = 0; this.degrade();}
  }

  /** Turns off the next effect in line after a black picture. */
  degrade() {
    const s = this.post.settings;
    let step: string;
    if (s.bloom) {s.bloom = false; step = 'bloom';}
    else if (s.ao) {s.ao = false; step = 'ambient occlusion';}
    else if (s.dof) {s.dof = false; step = 'depth of field';}
    else if (this.post.samples > 0) {this.post.setSamples(0); step = 'multisampling';}
    else if (!this.direct) {this.direct = true; step = 'post-processing';}
    else return;
    this.fallbacks.push(step);
    console.warn(`Terrarium: the picture came out black; turned off ${step}`);
  }
}

export {TANK};
