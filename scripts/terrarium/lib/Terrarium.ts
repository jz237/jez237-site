import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Post} from './Post';
import {Room} from './Room';
import {Case, TANK, type Pane} from './Case';
import {Ground} from './Ground';
import {Hardscape} from './Hardscape';
import {loadScans} from './Assets';
import {LizardModel} from './LizardModel';
import {Surface, SurfaceKind} from './Surface';
import {Plants} from './Plants';
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

const DIRECT = new URLSearchParams(location.search).has('direct');

export class Terrarium {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(30, 1, 0.02, 30);
  readonly controls: OrbitControls;
  readonly post: Post;
  readonly room = new Room();
  readonly case = new Case();
  readonly ground = new Ground();
  hardscape!: Hardscape;
  surface!: Surface;
  plants!: Plants;
  water!: Water;
  peaks!: Peaks;
  moss!: MossShells;
  nav!: Nav;
  insects!: Insects;
  rig!: LizardRig;
  brain!: LizardBrain;
  weather!: Weather;
  readonly audio = new TerrariumAudio();
  follow = false;
  temperature = 27;
  private plaqueT = 0;
  readonly moon: THREE.DirectionalLight;
  private homeView = {pos: new THREE.Vector3(0, 0.44, 1.78), target: new THREE.Vector3(0, 0.29, 0)};
  lizard!: LizardModel;
  readonly key: THREE.SpotLight;
  readonly heat: THREE.SpotLight;
  readonly hemi: THREE.HemisphereLight;
  readonly rim: THREE.DirectionalLight;
  readonly fill: THREE.DirectionalLight;
  readonly ready: Promise<void>;
  private clock = new THREE.Clock();
  time = 0;
  private onFrame: ((dt: number, t: number) => void)[] = [];

  constructor(readonly host: HTMLElement) {
    const r = new THREE.WebGLRenderer({antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: new URLSearchParams(location.search).has('capture')});
    r.setPixelRatio(new URLSearchParams(location.search).has('frames') ? 1 : Math.min(devicePixelRatio, 2));
    r.toneMapping = THREE.NoToneMapping;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.autoClear = false;
    this.renderer = r;
    host.append(r.domElement);
    r.domElement.id = 'scene-canvas';

    const s = this.scene;
    // No scene.background: a colour background force-clears on every render() call,
    // which would erase the scene before the glass pass.
    r.setClearColor(new THREE.Color(0.01, 0.008, 0.006), 1);
    const pmrem = new THREE.PMREMGenerator(r);
    s.environment = pmrem.fromScene(this.room.envScene, 0.02).texture;
    s.environmentIntensity = 1.0;
    s.add(this.room.group, this.case.group, this.case.glassGroup, this.ground.mesh, this.ground.walls);
    r.shadowMap.autoUpdate = false;

    // Lamp in the lid: warm key light with soft shadows.
    this.key = new THREE.SpotLight(new THREE.Color(1.0, 0.84, 0.64), 11, 3, 0.8, 0.85, 2);
    this.key.position.set(-0.08, 1.1, 0.3);
    this.key.target.position.set(0.0, 0.12, -0.04);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(2048, 2048);
    this.key.shadow.bias = -0.00025;
    this.key.shadow.normalBias = 0.0015;
    this.key.shadow.camera.near = 0.3;
    this.key.shadow.camera.far = 1.6;
    this.key.shadow.radius = 2;
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
    cam.position.set(0, 0.44, 1.78);
    this.controls = new OrbitControls(cam, r.domElement);
    this.controls.target.set(0, 0.29, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.18;
    this.controls.maxDistance = 3.2;
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

    for (const l of [this.key, this.heat, this.hemi, this.rim, this.fill, this.moon, this.room.lampLight]) l.layers.enable(1);
    this.post = new Post(r, s, cam);
    const q = new URLSearchParams(location.search);
    for (const k of ['ao', 'bloom', 'dof'] as const) if (q.get(k) === '0') this.post.settings[k] = false;
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
    this.plants = new Plants(scans, this.surface);
    this.ground.uniforms.tMoss.value = this.plants.moss.texture;
    this.scene.add(this.plants.group);
    this.moss = new MossShells(this.surface, this.plants.moss, Number(new URLSearchParams(location.search).get('shells') || 14));
    this.scene.add(this.moss.mesh);
    this.water = new Water(this.surface, this.peaks.data.ledges);
    this.scene.add(this.water.group);
    this.resize();
    this.lizard = await LizardModel.load('./lizard/');
    this.scene.add(this.lizard.root);
    this.nav = new Nav(this.surface, this.plants.obstacles);
    this.insects = new Insects(this.surface, this.nav);
    this.scene.add(this.insects.group);
    this.rig = new LizardRig(this.lizard, this.surface);
    this.brain = new LizardBrain(this.rig, this.nav, this.surface, this.insects, this.water);
    this.brain.onLap = (p) => this.water.addRipple(p.x, p.z, 1, this.time);
    this.weather = new Weather(this.surface, this.water);
    this.scene.add(this.weather.group);
    for (const pane of this.case.panes) pane.fog.settle(this.weather.humidity);
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
    this.renderer.setAnimationLoop(() => this.frame());
  }

  surfaceHeight(x: number, z: number) {
    const ray = new THREE.Raycaster(new THREE.Vector3(x, 1, z), new THREE.Vector3(0, -1, 0));
    const hits = ray.intersectObjects([this.ground.mesh, ...this.hardscape.placed.map((p) => p.mesh)], false);
    return hits.length ? hits[0].point.y : 0;
  }

  /** Advances the living parts of the scene (no rendering). */
  simulate(dt: number) {
    this.time += dt;
    this.weather.update(dt, this.time);
    this.applyClimate(dt);
    this.brain.cameraPos.copy(this.camera.position);
    this.insects.update(dt);
    this.brain.update(dt);
    this.water.update(dt, this.time, 1);
  }

  /** Lights, wetness and condensation follow the weather and the lamp's day. */
  private applyClimate(dt: number) {
    const w = this.weather;
    const day = w.daylight;
    const overcast = Math.min(1, w.rainAmount * 0.4);
    this.key.intensity = 11 * day * (1 - overcast * 0.35);
    this.heat.intensity = 1.1 * day;
    this.hemi.intensity = 0.15 + 0.35 * day;
    this.fill.intensity = 0.35 + 0.55 * day;
    this.moon.intensity = 0.55 * (1 - day);
    this.rim.intensity = 0.2 + 0.3 * day;
    this.case.regulatorGlow.emissive.setRGB(0.3 + 0.7 * day, 0.35 + 0.27 * day, 1.0 - 0.72 * day);
    this.case.regulatorGlow.emissiveIntensity = 1.2 + 1.3 * day;
    this.room.setLampLevel(0.75 + 0.25 * (1 - day));
    const cl = this.weather.clouds.shared;
    cl.uLightDir.value.copy(this.key.position).sub(this.key.target.position).normalize();
    cl.uLightColor.value.setRGB(1.0 * day + 0.12, 0.84 * day + 0.16, 0.64 * day + 0.3);
    cl.uAmbient.value.setRGB(0.12 + 0.24 * day, 0.11 + 0.2 * day, 0.13 + 0.14 * day);
    // wetness darkens soil, glosses leaves, rock and skin
    this.ground.uniforms.uWet.value = w.wet;
    foliageUniforms.uWet.value = w.wet;
    foliageUniforms.uWind.value.copy(w.wind);
    this.peaks.uniforms.uWet.value = w.wet * 0.8;
    this.lizard.skin.uWet.value = w.wet * 0.5;
    this.brain.night = day < 0.2;
    this.brain.raining = w.rainAmount > 0.1;
    this.brain.heat = day;
    this.temperature = 22 + 7 * day - overcast * 2 - w.mist * 1.5;
    const warmth = day * 0.7;
    for (const pane of this.case.panes) pane.fog.update(dt, w.humidity, warmth);
    this.case.shared.uHaze.value.setRGB(0.012 + 0.02 * day, 0.011 + 0.016 * day, 0.01 + 0.012 * day);
    this.plaqueT -= dt;
    if (this.plaqueT < 0) {this.plaqueT = 2; this.case.drawPlaque(this.temperature, w.humidity * 100);}
    this.audio.update(dt, {rain: w.rainAmount, wind: w.wind.length(), crickets: this.insects.crickets.length, night: 1 - day, flow: 1});
  }

  resetView() {
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
  pickInside(ray: THREE.Ray): THREE.Vector3 | null {
    const rc = new THREE.Raycaster(ray.origin, ray.direction);
    (rc as any).firstHitOnly = true;
    const hits = rc.intersectObjects([this.ground.mesh, ...this.hardscape.placed.map((p) => p.mesh)], false);
    return hits.length ? hits[0].point : null;
  }

  feed(at: THREE.Vector3 | null) {
    const c = this.insects.release();
    if (at) {c.pos.x = THREE.MathUtils.clamp(at.x, -0.5, 0.5); c.pos.z = THREE.MathUtils.clamp(at.z, -0.2, 0.2);}
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

  addFrameHandler(f: (dt: number, t: number) => void) {this.onFrame.push(f);}

  resize() {
    const w = this.host.clientWidth || innerWidth, h = this.host.clientHeight || innerHeight;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = `${w}px`;
    this.renderer.domElement.style.height = `${h}px`;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    this.post.setSize(w, h, pr);
    this.case.shared.uResolution.value.set(Math.round(w * pr), Math.round(h * pr));
    this.water?.uniforms.uResolution.value.set(Math.round(w * pr), Math.round(h * pr));
  }

  frame(fixedDt?: number) {
    const dt = fixedDt ?? Math.min(0.05, this.clock.getDelta());
    this.time += dt;
    this.controls.update();
    this.ground.uniforms.uTime.value = this.time;
    foliageUniforms.uTime.value = this.time;
    this.camera.updateMatrixWorld();
    foliageUniforms.uKeyDirView.value.copy(this.key.position).sub(this.key.target.position).normalize().transformDirection(this.camera.matrixWorldInverse);
    for (const f of this.onFrame) f(dt, this.time);
    this.weather.update(dt, this.time);
    this.applyClimate(dt);
    if (this.follow) {
      const head = this.rig.snout;
      const body = new THREE.Vector3(this.rig.inputs.x, head.y - 0.01, this.rig.inputs.z);
      const focus = body.lerp(head, 0.45);
      this.controls.target.lerp(focus, 1 - Math.exp(-dt * 3));
      const d = this.camera.position.distanceTo(this.controls.target);
      if (d > 0.42) this.camera.position.lerp(this.controls.target, 1 - Math.exp(-dt * 1.2));
    }
    this.brain.cameraPos.copy(this.camera.position);
    this.insects.update(dt);
    this.brain.update(dt);
    this.lizard.root.updateMatrixWorld(true);
    // Focus on the orbit target; the room falls out of focus naturally.
    this.post.settings.focus = this.camera.position.distanceTo(this.controls.target);
    this.renderer.shadowMap.needsUpdate = true;
    const keyDir = this.key.position.clone().sub(this.key.target.position).normalize();
    this.water.uniforms.uKeyDir.value.copy(keyDir);
    this.water.update(dt, this.time, 1);
    this.lizard.root.updateMatrixWorld(true);
    this.water.renderReflection(this.renderer, this.scene, this.camera, this.post.width, this.post.height);
    if (DIRECT) {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.setRenderTarget(null);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      return;
    }
    this.post.render(this.time, (refraction) => {
      this.case.shared.tRefract.value = refraction;
      this.water.uniforms.tRefract.value = refraction;
      this.camera.layers.set(1);
      this.renderer.render(this.scene, this.camera);
      this.camera.layers.set(0);
    });
  }
}

export {TANK};
