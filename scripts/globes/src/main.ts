import '@fontsource-variable/inter';
import './app/styles.css';
import * as THREE from 'three/webgpu';
import { AppShell, type DesktopHost } from './app/AppShell';
import { AdaptiveScale, ratioAt } from './app/adaptiveScale.mjs';
import { describe, describeLoad, FrameProfile, type Sample } from './app/frameProfile';
import { BETTA_PAGE, elsewhere, GLOBES, type GlobeEntry } from './app/catalog';
import { applyUrlOverrides, fishConfig, globeConfig, lightConfig, simConfig, type GlobeConfig, type LightConfig, type SimConfig } from './config';
import { DeskMapping, loadDesk, type DesktopHostApi } from './desktop/desktopScene';
import { Betta, BUBBLE_RADIUS, RIPPLE_RADIUS } from './fish/Betta';
import { BETTA_SURFACE_AT } from './fish/bettaWater.mjs';
import { Koi, type KoiEnv } from './fish/Koi';
import { CLOWN_PROBES, Clownfishes } from './fish/Clownfish';
import { FishFood, type Feeder } from './fish/FishFood';
import { classifyFailure, createDevice } from './gpu/device';
import { BowlLid } from './interaction/BowlLid';
import { BowlLife, LIFE_PROBE_AT } from './interaction/BowlLife';
import { Feeding } from './interaction/Feeding';
import { GlobeController } from './interaction/GlobeController';
import { KelpForest } from './kelp/KelpForest';
import { REEF_PROBES, Reef } from './reef/Reef';
import { Specks } from './ocean/Specks';
import { BOWL, bowlShape } from './render/bowl';
import { BED, setScapeShader } from './render/bowlScape';
import { furnish } from './render/scape/furnishings';
import { BOWL_KOI_LAYER, GlobeView, texelTexture, type GlobeVariant } from './render/GlobeView';
import { MovingPlants, PLANT_PROBE_AT } from './render/scape/MovingPlants';
import { OceanBackdrop } from './render/OceanBackdrop';
import { StudioBackdrop } from './render/StudioBackdrop';
import { sunInWater } from './render/shaders';
import { BED_SOLIDS_N, BED_SOLIDS_NONE, FluidSim, SURFACE_ISO, fillHeight } from './sim/FluidSim';
import { IdleWater } from './sim/IdleWater';
import { FIN_QUALITY } from '../../betta-atelier/src/fin-dynamics.js';

/** The camera's field of view, top to bottom (degrees). A view narrower than this (width over
 *  height) widens it instead, so the globe keeps clear of the sides (a phone held upright). */
const FOV = 30;
const NARROWEST = 0.75;
/** Phones and tablets get a lighter globe (a coarser grid, one ray per pixel, no supersampled
 *  canvas) unless the URL asks otherwise (?res=, ?aa=). */
const LITE = ((q) => (q === '1' ? true : q === '0' ? false : matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 1000))(new URLSearchParams(location.search).get('lite'));
/** ?stats and ?bench: where each frame's time goes, and the load's (app/frameProfile.ts). */
const PROF = new FrameProfile(/[?&](stats|bench)\b/.test(location.search));
PROF.mark('script');
/** A frame longer than this (s) is a stall (the window hidden, a pipeline built, the debugger):
 *  the time past it is skipped. Every shorter frame is simulated in full, so the motion keeps
 *  real time however few frames the GPU manages. (On phones a slow frame is not caught up on in
 *  full: a frame that simulates more takes longer, and the next more again.) */
const STALL = LITE ? 1 / 30 : 0.1;
/** Specks drifting in the water around the globe (the app only; fewer on phones). */
const SPECKS = LITE ? 800 : 2000;
/** On the desktop: how much of its window's height the globe fills, and how far it may tilt
 *  (it swings about a point below it, and must stay inside its window). */
const DESKTOP_FILL = 0.66;
const DESKTOP_MAX_TILT = (18 * Math.PI) / 180;
/** On the desktop the water is clearer than in the studio (its absorption times this), so the
 *  view through it, small and upside down, shows. */
const DESKTOP_WATER_CLARITY = 0.5;

/** The water line (as a fraction of the sphere, sand included, below it at rest) of a globe
 *  that holds `water` times as much water as the standard fill. */
function fillFor(cfg: SimConfig, radius: number, water = 1): number {
  const cap = (h: number) => (Math.PI * h * h * (3 * radius - h)) / 3;
  const sphere = (4 / 3) * Math.PI * radius ** 3;
  const sand = cap(radius + cfg.sandLevel);
  const standard = (cfg.fillFraction * sphere - sand) * water + sand;
  return Math.min(standard / sphere, 0.95);
}

/** A pellet dropping into the betta's bowl: the push it gives the film (world units/s along the
 *  water's weight, once) and over what radius. */
const PELLET_DIMPLE = 0.4;
const PELLET_DIMPLE_RADIUS = 0.02;

/** Where the creatures' probes of the water sit in FluidSim's list (PROBES): the koi's first,
 *  then the two clownfish's, then the anemone's. */
const CLOWN_PROBE_AT = 16;
const REEF_PROBE_AT = CLOWN_PROBE_AT + 2 * CLOWN_PROBES;
/** ...then the flakes of fish food (FOOD_MAX). */
const FOOD_PROBE_AT = REEF_PROBE_AT + REEF_PROBES;

/** The globe shader a globe is drawn with. */
function variantOf(g: GlobeEntry): GlobeVariant {
  return g.kelp ? 'kelp' : g.reef ? 'reef' : g.foam ? 'foam' : g.betta ? 'bowl' : 'plain';
}

/** The water flowing round the anemone's crown: the mean velocity at its probes that are in the
 *  water (sim frame), or null before the first reading. */
function reefFlow(probes: Float32Array | null): number[] | null {
  if (!probes) return null;
  const u = [0, 0, 0];
  let n = 0;
  for (let k = REEF_PROBE_AT; k < REEF_PROBE_AT + REEF_PROBES; k++) {
    if (probes[4 * k + 3] < SURFACE_ISO) continue;
    for (let a = 0; a < 3; a++) u[a] += probes[4 * k + a];
    n++;
  }
  return n > 0 ? u.map((v) => v / n) : null;
}

interface WorldOptions {
  /** The globe shown first. */
  start: GlobeEntry;
  /** A clear canvas (the desktop shows through around the globe). */
  alpha: boolean;
  light: LightConfig;
  globe: GlobeConfig;
  /** The wallpaper behind a globe on the desktop; null in the app. */
  desk: THREE.Texture | null;
}

/** The globe, its water and its koi, drawn into the stage. */
async function createWorld(stage: HTMLElement, params: URLSearchParams, o: WorldOptions) {
  // The betta bowl's furnishings are built meanwhile, in a worker (render/scape/furnishings.ts).
  const furnishing = GLOBES.some((g) => g.betta) ? furnish(BED_SOLIDS_N, o.globe.innerRadius, BED_SOLIDS_NONE, LITE ? 0.5 : 1) : null;
  const device = await createDevice();
  PROF.mark('device');

  // (Dev builds time the render pass on the GPU, for profiling.)
  // ?aa=1 traces one ray per pixel instead of four (cheaper, aliased waterline); one is all phones and
  // the betta's page draw, and phones have no multisampled canvas unless asked for four.
  const samples = Number(params.get('aa') ?? (LITE || o.start.betta ? 1 : 4));
  const renderer = new THREE.WebGPURenderer({ device, antialias: !LITE || samples >= 4, alpha: o.alpha, trackTimestamp: import.meta.env.DEV || PROF.on });
  const stageSize = (): [number, number] => {
    const r = stage.getBoundingClientRect();
    return [Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height))];
  };
  if (o.alpha) renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  stage.prepend(renderer.domElement);
  await renderer.init();
  PROF.mark('renderer');

  // The articulated specimen needs cadence more than sub-pixel fluid detail.
  // Preserve the original five scenes' defaults; explicit URL overrides still win.
  // (The betta's bowl has a bed of its own depth: bowlScape.ts BED.)
  const base = o.start.betta ? { ...simConfig, sandLevel: BED.level } : simConfig;
  // (Phones: a coarser grid, fewer substeps a frame and solver sweeps.)
  const cfg = applyUrlOverrides(LITE ? { ...base, gridRes: 40, maxSubsteps: 3, pressureIterations: 24, sandSubsteps: 6 } : o.start.betta ? { ...base, gridRes: 64 } : base);
  const R = o.globe.innerRadius;
  const fill = (g: GlobeEntry) => fillFor(cfg, R, g.water);
  const sim = new FluidSim(device, { ...cfg, fillFraction: fill(o.start) }, R, o.globe.outerRadius, o.light);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 100);
  const controller = new GlobeController(renderer.domElement, camera, o.globe);
  const koiEnv = (): KoiEnv => ({
    radius: o.globe.innerRadius,
    level: sim.restLevel,
    sandLevel: cfg.sandLevel,
    gravity: controller.bodyAccel(cfg.gravity),
    iso: SURFACE_ISO,
  });
  const koi = new Koi(device, fishConfig, koiEnv());
  sim.koiPose = koi.texture;
  const betta = new Betta(device);
  // The betta's globe is a bowl, open at the mouth, with a lid (where the page shows it), which
  // comes off only to feed the fish.
  const bowl = GLOBES.some((g) => g.betta) ? bowlShape(o.globe, LITE) : null;
  const lid = bowl ? new BowlLid(bowl) : null;
  const feeding = lid ? new Feeding(lid, controller) : null;
  // What floats in it: an almond leaf, and the betta's bubble nest.
  const life = bowl ? new BowlLife(o.globe.innerRadius) : null;
  const bettaControls = document.createElement('div');
  bettaControls.className = 'betta-controls';
  bettaControls.innerHTML = '<span>Living Silk</span><button type="button" data-action="feed">Feed</button><button type="button" data-action="flare" aria-pressed="false">Flare fins</button>';
  const flareButton = bettaControls.querySelector<HTMLButtonElement>('[data-action="flare"]')!;
  const feedButton = bettaControls.querySelector<HTMLButtonElement>('[data-action="feed"]')!;
  feedButton.hidden = !feeding;
  if (feeding) {
    feeding.onChange = () => {
      const s = feeding.state;
      feedButton.textContent = s === 'idle' ? 'Feed' : s === 'closing' ? 'Closing lid' : 'Close lid';
      feedButton.disabled = s === 'closing';
      feedButton.title = s === 'idle' ? 'Lift the lid and drop in a few pellets (the bowl is held still until the lid is back on)' : '';
    };
    feeding.onChange();
    feedButton.addEventListener('click', () => feeding.request());
  }
  // (Shown with the betta: none on a page without it.)
  bettaControls.hidden = true;
  flareButton.disabled = true;
  void betta.ready.then(() => { flareButton.disabled = false; }).catch((error: unknown) => {
    console.warn('[globes] betta textures:', error);
    flareButton.textContent = 'Fish textures unavailable';
    flareButton.title = 'Reload to retry loading the betta. The other globes remain available.';
  });
  bettaControls.addEventListener('pointerdown', e => e.stopPropagation());
  flareButton.addEventListener('click', () => {
    betta.flared = !betta.flared;
    flareButton.setAttribute('aria-pressed', String(betta.flared));
    flareButton.textContent = betta.flared ? 'Relax fins' : 'Flare fins';
  });
  stage.append(bettaControls);
  // The kelp forest, laid out for the kelp globe's water; simulated and drawn only there.
  const kelpGlobe = GLOBES.find((g) => g.kelp);
  const kelpLevel = -R + fillHeight(R, kelpGlobe ? fill(kelpGlobe) : cfg.fillFraction);
  const [sx, sy, sz] = o.light.sunDirection;
  const sl = Math.hypot(sx, sy, sz);
  const sunWater = sunInWater([sx / sl, sy / sl, sz / sl]);
  const kelp = new KelpForest(device, R, cfg.sandLevel, kelpLevel, sunWater, cfg.gravity);
  sim.kelp = kelp;
  // The reef: its anemone (the clownfish come later), simulated and drawn only in its globe. (Its
  // shadow goes into the same grid as the kelp's: one of them is in the water at a time.)
  const reef = new Reef(device, cfg.gravity, sunWater, kelp.shadeTexture);
  sim.reef = reef;
  // Its two clownfish, living in the anemone.
  const clowns = new Clownfishes(device, reef.data);
  sim.clownPose = clowns.texture;
  sim.rock = !!o.start.reef;
  sim.glass = o.globe;
  // Fish food (the koi's and the reef's globes): flakes dropped in with a right-click.
  const food = new FishFood();
  const idle = new IdleWater();
  // The betta bowl's furnishings, built by now: their BVH for the shader (on the GPU, where the
  // plants' motion rewrites it each frame), where they stand in the sand for the sim (the sand
  // rests on them and flows round them), and where the fish keeps clear of them.
  let scapeTex: THREE.Texture | null = null;
  let scapeObstacles: { a: number[]; b: number[]; r: number; solid: number }[] = [];
  let plants: MovingPlants | null = null;
  if (furnishing) {
    const f = await furnishing;
    PROF.mark('furnishings');
    setScapeShader(f.wgsl);
    const bvh = device.createTexture({ label: 'furnishings BVH', size: [f.width, f.height], format: 'rgba32float', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST });
    device.queue.writeTexture({ texture: bvh }, f.data as unknown as BufferSource, { bytesPerRow: f.width * 16, rowsPerImage: f.height }, [f.width, f.height]);
    scapeTex = texelTexture(bvh);
    plants = new MovingPlants(device, bvh, f.motion, f.phases);
    sim.bedSolids = { map: f.map, extent: R };
    scapeObstacles = f.obstacles;
  }
  // (The plants' clock, and on phones every other frame of their motion: it is slow enough.)
  let plantClock = 0;
  let plantDue = 0;
  let plantFrame = 0;
  // (Where the bowl's turn has carried them, each frame: the sim frame.)
  const turnedObstacles = scapeObstacles.map((o) => ({ a: [0, 0, 0], b: [0, 0, 0], r: o.r, solid: o.solid }));
  await sim.init(Math.max(...GLOBES.map(fill)), GLOBES.map((g) => ({ fill: fill(g), rock: !!g.reef })));
  PROF.mark('sim');

  // In the app the globe stands in the deep ocean, specks drifting round it; on the desktop, in
  // front of the wallpaper.
  const scene = new THREE.Scene();
  // (The betta's bowl stands on a table in a photographer's studio instead: studio.ts.)
  const studio = bowl && !o.desk ? new StudioBackdrop() : null;
  const ocean = o.desk || studio ? null : new OceanBackdrop(o.light);
  if (ocean) scene.backgroundNode = ocean.background as unknown as typeof scene.backgroundNode;
  if (studio) {
    scene.backgroundNode = studio.background as unknown as typeof scene.backgroundNode;
    scene.add(studio.table, studio.mirror);
    controller.rolling = true;
    // (The fish's own pass: drawn, but not again in the table's mirror, where it is a blur.)
    camera.layers.enable(BOWL_KOI_LAYER);
    studio.leaveOut(camera, BOWL_KOI_LAYER);
    // (Depth is cleared to 0 for the bowl's two passes: GlobeView.)
    renderer.setClearDepth(0);
  }
  const specks = ocean ? new Specks(SPECKS, o.light, ocean.time) : null;
  if (specks) scene.add(specks.mesh);

  // The picture takes the stage's shape and size, whatever they are: as many pixels as the
  // screen has (up to twice the CSS pixels), but no wider or taller than the GPU's textures go.
  // (If frames come too slowly for the pointer to be followed, run() lowers the sharpness a step
  // at a time, and offers it back when they are quick again.)
  let sharpness = 0;
  // (?bench: a pixel ratio of its own choosing, for a while.)
  let ratioOverride: number | null = null;
  const fit = (): void => {
    const [w, h] = stageSize();
    const most = device.limits.maxTextureDimension2D;
    renderer.setPixelRatio(Math.min(ratioOverride ?? ratioAt(LITE ? 1 : Math.min(window.devicePixelRatio, 2), sharpness), most / w, most / h));
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = (2 * Math.atan(Math.tan((FOV * Math.PI) / 360) * Math.max(1, NARROWEST / camera.aspect)) * 180) / Math.PI;
    camera.updateProjectionMatrix();
  };
  fit();
  new ResizeObserver(fit).observe(stage);
  const setSharpness = (level: number): void => {
    if (level === sharpness) return;
    sharpness = level;
    fit();
  };
  const setRatio = (ratio: number | null): void => {
    ratioOverride = ratio;
    fit();
  };

  const globe = new GlobeView(sim, o.globe, o.light, koi.texture, samples, ocean ? { ocean: ocean.map.texture } : studio ? { ocean: studio.map } : { desktop: o.desk! }, kelp, reef, clowns.texture, GLOBES.find((g) => g.reef)?.clarity, GLOBES.find((g) => g.foam)?.waterColour, betta, bowl, scapeTex);
  scene.add(globe.mesh);
  if (lid) globe.setBowlLid(lid.toLid, lid.shown, lid.reach, lid.lamp);
  // Before the first frame, behind the splash: the water settles, and meanwhile every globe's
  // pipelines are built (and the software tracers' where the device traces in hardware). Built
  // after it, each held up a frame or more as the first globe slid in, and a switch to a globe
  // not built yet stalled until it was. (Only the page's own globes': the betta bowl's page
  // builds the bowl's alone.)
  const variants = [...new Set(GLOBES.map(variantOf))];
  await Promise.all([sim.settle().then(() => PROF.mark('settled')), globe.precompile(renderer, camera, scene, variants).then(() => PROF.mark('compiled')).catch((err: unknown) => console.warn('[globes] precompile:', err))]);

  // What lives in the globe (the koi, or the kelp forest) and what its water does when left
  // alone. Another globe comes in with its own water, level and still (the switch happens out
  // of sight): none of the last one's swirl or slosh carries over.
  let shown = o.start;
  const setScene = (g: GlobeEntry): void => {
    koi.visible = g.koi;
    betta.active = !!g.betta;
    bettaControls.hidden = !betta.active;
    betta.update(0, sim.koiSense, koiEnv());
    const kelpOn = !!g.kelp;
    if (kelpOn && !kelp.active) kelp.reset();
    kelp.active = kelpOn;
    const reefOn = !!g.reef;
    if (reefOn && !reef.active) {
      reef.reset();
      clowns.reset();
    }
    reef.active = reefOn;
    food.clear();
    food.enabled = g.koi || reefOn || !!g.betta;
    food.pellets = !!g.betta;
    food.setReef(reefOn ? clowns.crown : null);
    sim.clarity = g.clarity ?? 1;
    globe.uLit.value.y = o.light.shaftScatter * (g.betta ? 0.18 : 1);
    sim.waterColour = g.waterColour ?? [1, 1, 1];
    sim.foaming = !!g.foam;
    sim.mouth = g.betta && bowl ? BOWL.waterCeiling : null;
    globe.setVariant(variantOf(g));
    if (g.id !== shown.id) {
      sim.startOver(fill(g), !!g.reef, controller.rotation.elements);
      idle.motion = g.idle;
    }
    shown = g;
  };
  idle.motion = o.start.idle;
  setScene(o.start);

  // One frame of the world: the globe's motion, the koi (acting on what the water told it a
  // frame or two ago), the water's own motion, then the water (and the kelp with it).
  // The fish that eat the food in the globe shown.
  const feeders = (): Feeder[] => (reef.active ? clowns.fish : koi.visible ? [koi] : betta.active ? [betta] : []);
  const advance = (dt: number): void => {
    controller.update(dt, cfg.gravity);
    if (lid && feeding) {
      // Feeding (the lid comes off, the pellets go in), and the lid, turning with the bowl.
      feeding.update(dt, (p) => food.spawn(p, feeders().length), food.count);
      lid.update(dt, controller.rotation);
      globe.setBowlLid(lid.toLid, lid.shown, lid.reach, lid.lamp);
    }
    // What each fish is after (before they move).
    for (const f of [koi, betta, ...clowns.fish]) {
      f.food = null;
      f.gapeWant = 0;
    }
    const eaters = feeders();
    food.aim(eaters);
    koi.update(dt, sim.koiSense, koiEnv());
    PROF.lap('input');
    // (The bowl's driftwood and plant, where the bowl's turn has carried them.)
    if (bowl) {
      const e = controller.rotation.elements;
      scapeObstacles.forEach((o, k) => {
        const t = turnedObstacles[k];
        for (const [from, to] of [[o.a, t.a], [o.b, t.b]]) {
          to[0] = e[0] * from[0] + e[3] * from[1] + e[6] * from[2];
          to[1] = e[1] * from[0] + e[4] * from[1] + e[7] * from[2];
          to[2] = e[2] * from[0] + e[5] * from[1] + e[8] * from[2];
        }
      });
      betta.obstacles = turnedObstacles;
    }
    betta.update(dt, sim.koiSense, koiEnv());
    sim.setKoiProbes(betta.active ? betta.probePoints() : koi.probePoints());
    if (betta.active) {
      sim.setProbes(BETTA_SURFACE_AT, betta.surfaceProbes());
      PROF.lap('betta');
      if (plants) {
        // The plants: their leaves' probes where the bowl's turn has carried them, and their
        // motion (each frame; every other one on phones).
        sim.setProbes(PLANT_PROBE_AT, plants.probePoints(controller.rotation.elements));
        plantClock += dt;
        plantDue += dt;
        if (!LITE || (++plantFrame & 1) === 0) {
          plants.update(plantClock, plantDue, sim.koiSense, controller.rotation.elements, controller.omega, SURFACE_ISO);
          plantDue = 0;
        }
      }
      PROF.lap('plants');
      if (life) {
        life.update(dt, sim.koiSense, sim.restLevel, SURFACE_ISO, controller.rotation.elements, Math.hypot(...controller.omega), betta.swim.mode);
        betta.swim.gulpUrge = life.nestNeed;
        sim.setProbes(LIFE_PROBE_AT, life.probePoints());
        globe.setBowlLife(life.matrix);
      }
      // Its lips dimple the film as it gulps; diving, it lets bubbles go.
      const d = betta.takeDisturbance();
      if (d.push > 0) sim.push(d.pushAt.toArray(), d.push, RIPPLE_RADIUS);
      // (A pellet dropping in dimples the film too, a little.)
      const dropped = food.splashes.shift();
      food.splashes.length = 0;
      if (dropped && !(d.push > 0)) sim.push(dropped, PELLET_DIMPLE, PELLET_DIMPLE_RADIUS);
      if (d.bubbles > 0) sim.splash.emit(d.bubblesAt.toArray(), d.bubbles, BUBBLE_RADIUS);
    }
    PROF.lap(betta.active ? 'life' : 'betta');
    sim.koiVisible = koi.visible;
    if (reef.active) {
      // The clownfish (acting on what the water told them a frame or two ago), then the anemone,
      // its tentacles parting round them.
      const probes = sim.koiSense?.probes ?? null;
      const flow = reefFlow(probes);
      const rotation = controller.rotation.elements;
      clowns.update(dt, probes, CLOWN_PROBE_AT, { rotation, gravity: controller.bodyAccel(cfg.gravity), iso: SURFACE_ISO, handled: controller.holding || controller.moving, flow });
      sim.setProbes(CLOWN_PROBE_AT, clowns.probePoints());
      reef.setFish(clowns.bodies, clowns.fish.length);
      reef.update(dt, rotation, flow);
      sim.setProbes(REEF_PROBE_AT, reef.probePoints(rotation));
    }
    // The food drifts, settles and is eaten (after the fish have moved), then is drawn from
    // the shown fish's pose texture.
    food.update(dt, sim.koiSense?.probes ?? null, sim.koiSense?.sand ?? null, FOOD_PROBE_AT, { rotation: controller.rotation.elements, gravity: controller.bodyAccel(cfg.gravity), iso: SURFACE_ISO, radius: R }, eaters);
    sim.setProbes(FOOD_PROBE_AT, food.probePoints());
    food.write(device, reef.active ? clowns.texture : koi.texture);
    PROF.lap('food');
    idle.update(dt, controller.holding || controller.moving, sim.koiSense);
    sim.currents = idle.stirring ? idle.currents : null;
    sim.step(dt, idle.withPush(controller.bodyAccel(cfg.gravity)), controller.omega, controller.rotation.elements);
    PROF.lap('sim');
  };

  // A flake of food where the pointer (client px) is over the water: on the line of sight as
  // the glass and the water bend it (so it appears under the pointer), as near the globe's
  // middle as that passes (well inside the glass). Above the water it falls in.
  const raycaster = new THREE.Raycaster();
  const spawnFood = (clientX: number, clientY: number): boolean => {
    // (The betta's bowl is fed through its mouth, the lid off: Feeding.)
    if (!food.enabled || betta.active) return false;
    const r = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, 1 - ((clientY - r.top) / r.height) * 2), camera);
    // Into a sphere of radius rad (from outside): where, or null.
    const enter = (o: THREE.Vector3, d: THREE.Vector3, rad: number): THREE.Vector3 | null => {
      const b = o.dot(d);
      const disc = b * b - (o.lengthSq() - rad * rad);
      return disc > 0 && -b - Math.sqrt(disc) > 0 ? o.clone().addScaledVector(d, -b - Math.sqrt(disc)) : null;
    };
    // Snell's law at a surface with normal n (against d), eta = n1 / n2.
    const bend = (d: THREE.Vector3, n: THREE.Vector3, eta: number): THREE.Vector3 | null => {
      const c = -n.dot(d);
      const k = 1 - eta * eta * (1 - c * c);
      return k < 0 ? null : d.clone().multiplyScalar(eta).addScaledVector(n, eta * c - Math.sqrt(k)).normalize();
    };
    const ro = raycaster.ray.origin.clone().sub(controller.center);
    const p0 = enter(ro, raycaster.ray.direction, o.globe.outerRadius);
    if (!p0) return false;
    const d1 = bend(raycaster.ray.direction, p0.clone().normalize(), 1 / 1.5);
    const p1 = d1 ? enter(p0, d1, R) : null;
    const d2 = p1 && d1 ? bend(d1, p1.clone().normalize(), 1.5 / 1.333) : null;
    if (!p1 || !d2) return false;
    const p = p1.addScaledVector(d2, Math.max(-p1.dot(d2), 0.05));
    if (p.length() > 0.82 * R) p.setLength(0.82 * R);
    return food.spawn([p.x, p.y, p.z], feeders().length);
  };

  // A click on the betta bowl's lid feeds the fish (it lifts the lid).
  const clickLid = (clientX: number, clientY: number): boolean => {
    if (!lid || !feeding || !betta.active || feeding.state !== 'idle') return false;
    const r = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, 1 - ((clientY - r.top) / r.height) * 2), camera);
    const ro = raycaster.ray.origin.clone().sub(controller.center);
    const rd = raycaster.ray.direction;
    if (!lid.hits(ro, rd)) return false;
    feeding.request();
    return true;
  };

  return { device, renderer, camera, scene, cfg, sim, controller, koi, betta, lid, life, kelp, reef, clowns, food, idle, globe, globeRadius: o.globe.outerRadius, ocean, studio, specks, setScene, advance, spawnFood, clickLid, setSharpness, setRatio };
}

type World = Awaited<ReturnType<typeof createWorld>>;

/** Runs the world every frame. beforeRender: after the world moves, before it is drawn. */
function run(world: World, params: URLSearchParams, hooks: { beforeRender?: () => void; firstFrame?: () => void }): void {
  const { renderer, camera, scene, sim, controller, globe, ocean, studio, specks, advance, setSharpness, setRatio } = world;
  // ?adapt=0 keeps the picture at full sharpness however slowly it draws (profiling; ?bench too).
  const adaptive = params.get('adapt') === '0' || params.has('bench') ? null : new AdaptiveScale(performance.now());
  const globeMotion = { center: controller.center, velocity: controller.velocity, radius: world.globeRadius };
  let jumps = controller.panJumps;
  // ?stats shows, in a corner above the page's links (a phone has no console to read), where each
  // frame's time goes (app/frameProfile.ts): frames a second and their pace, the main thread's time
  // on each part of the frame, the GPU's on the sim and the drawing, the pixel ratio, and when each
  // step of the load was done (seconds since the page was asked for).
  const hud = PROF.on ? document.createElement('div') : null;
  if (hud) {
    hud.style.cssText = 'position:fixed;left:8px;bottom:calc(56px + env(safe-area-inset-bottom));z-index:99;max-width:calc(100vw - 16px);box-sizing:border-box;padding:6px 8px;border-radius:6px;background:rgba(0,0,0,.65);color:#cfe;font:11px/1.35 ui-monospace,monospace;pointer-events:none;white-space:pre-wrap';
    document.body.append(hud);
    // (The GPU's time on the sim's passes, where the device can time them.)
    sim.setProfiling(true);
  }
  // ?bench: after a few seconds, the picture at each pixel ratio in turn (up to the screen's own),
  // a moment to settle and three seconds measured, then a table of them; then the usual ratio.
  const ratios = [0.6, 0.8, 1, 1.25, 1.5, 2].filter((r) => r <= window.devicePixelRatio + 0.01);
  const bench = params.has('bench') ? { k: -1, measuring: false, at: performance.now() + 5000, rows: [] as [number, Sample][] } : null;
  const benchNext = (b: NonNullable<typeof bench>, now: number): void => {
    if (b.measuring) {
      const s = PROF.take();
      if (s) b.rows.push([renderer.getPixelRatio(), s]);
      b.measuring = false;
      b.k++;
    } else if (b.k >= 0) {
      PROF.take();
      b.measuring = true;
      b.at = now + 3000;
      return;
    } else b.k = 0;
    if (b.k < ratios.length) {
      setRatio(ratios[b.k]);
      b.at = now + 1500;
    } else {
      setRatio(null);
      b.at = Infinity;
    }
  };
  const f1 = (v: number | null): string => (v === null ? '  -' : v.toFixed(1).padStart(4));
  const benchText = (b: NonNullable<typeof bench>): string => {
    const head = `bench${LITE ? ' · phone tier' : ''} · ${innerWidth}x${innerHeight} css px · dpr ${window.devicePixelRatio.toFixed(2)}\nratio   fps  frame ms   cpu  gpu sim/draw (queue)`;
    const rows = b.rows.map(([r, s]) => `${r.toFixed(2)}  ${s.fps.toFixed(1).padStart(4)}  ${f1(s.p50)}/${f1(s.p90)}  ${f1(s.cpuTotal)}  ${f1(s.gpuSim)}/${f1(s.gpuDraw)} (${f1(s.gpuQueue)})`);
    const now = b.k < ratios.length ? [`... ratio ${ratios[Math.max(0, b.k)].toFixed(2)}${b.measuring ? ' measuring' : ''}`] : [];
    const parts = b.rows[0] ? [describe(b.rows[0][1], b.rows[0][0]).split('\n')[1]] : [];
    return [head, ...rows, ...now, ...parts, describeLoad(PROF.load)].join('\n');
  };
  // ?manual (dev testing): the sim only advances through __globes.tick().
  const manual = params.has('manual');
  const drawSize = new THREE.Vector2();
  let statsStart = performance.now();
  let first = true;

  // Dev: smoothed GPU time of the render pass (ms), when on.
  const renderTimes = { on: false, ms: 0 };
  let last = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, STALL);
    last = now;

    PROF.begin();
    const level = adaptive?.frame(now) ?? null;
    if (level !== null) setSharpness(level);
    if (!manual) advance(dt);
    hooks.beforeRender?.();
    const heightPx = renderer.getDrawingBufferSize(drawSize).y;
    globe.update(controller.center, controller.rotation, camera, heightPx);
    ocean?.update(renderer, now / 1000);
    studio?.update(controller.center);
    if (specks) {
      specks.update(dt, camera, heightPx, controller.panJumps - jumps, globeMotion);
      jumps = controller.panJumps;
    }
    PROF.lap('scene');
    renderer.render(scene, camera);
    PROF.lap('draw');
    PROF.end(world.device.queue);
    if (first) {
      first = false;
      PROF.mark('first frame');
      // (Once the GPU has drawn the first frame: the pipelines first used in it - the backdrop's,
      // the specks' - are built as it runs, which held up the frames after it as the globe began
      // to slide in.)
      const firstFrame = hooks.firstFrame;
      if (firstFrame) void world.device.queue.onSubmittedWorkDone().then(() => requestAnimationFrame(firstFrame));
    }
    if ((import.meta.env.DEV && renderTimes.on) || hud) {
      void renderer.resolveTimestampsAsync('render').then((ms) => {
        if (!(ms && ms > 0)) return;
        if (renderTimes.on) renderTimes.ms = renderTimes.ms === 0 ? ms : renderTimes.ms * 0.9 + ms * 0.1;
        if (hud) PROF.gpuDraw(ms);
      });
    }

    if (hud) {
      const simMs = Object.values(sim.gpuTimes).reduce((a, b) => a + b, 0);
      if (simMs > 0) PROF.gpuSim(simMs);
      if (bench) {
        if (now >= bench.at) benchNext(bench, now);
        if (now - statsStart >= 500) {
          statsStart = now;
          hud.textContent = benchText(bench);
        }
      } else if (now - statsStart >= 1000) {
        statsStart = now;
        const s = PROF.take();
        if (s) {
          hud.textContent = `${describe(s, renderer.getPixelRatio(), `${LITE ? ' · phone tier' : ''} · ${sim.lastSubsteps} substeps · ${sim.particleCount} particles`)}\n${describeLoad(PROF.load)}`;
          console.log(`[globes] ${hud.textContent}`);
        }
      }
    }
  });

  if (import.meta.env.DEV || params.has('qa')) {
    const tick = (dt: number) => advance(dt);
    const g = window as unknown as { __globes?: object };
    g.__globes = { ...g.__globes, THREE, ...world, tick, renderTimes, adaptive, prof: PROF, bench };
  }
}

/** The app: the collection, one globe at a time. */
async function startApp(stage: HTMLElement, params: URLSearchParams, host: DesktopHost | null): Promise<void> {
  // A globe that lives on the other page (the betta bowl has its own): go there.
  const away = elsewhere(params.get('globe') ?? '');
  if (away) {
    const rest = new URLSearchParams(params);
    rest.delete('globe');
    const query = rest.toString();
    location.replace(away + (query ? (away.includes('?') ? '&' : '?') + query : ''));
    return;
  }
  const start = AppShell.startIndex(params);
  const shell = new AppShell(stage, host, start);
  if (import.meta.env.DEV) Object.assign(window, { __globes: { shell } });
  try {
    // (The betta's bowl is lit by the lamp in its lid, straight down, and tips less far than a
    // sealed globe: it rolls on its table.)
    const light = { ...(BETTA_PAGE ? { ...lightConfig, sunDirection: [0, 1, 0] as [number, number, number] } : lightConfig), ...(LITE ? { causticRays: 512 } : {}) };
    // (Phones: the fins solved in coarser steps.)
    if (LITE) Object.assign(FIN_QUALITY, { step: 1 / 60, passScale: 0.5, maxFrame: 1 / 30 });
    const globe = BETTA_PAGE ? { ...globeConfig, maxTilt: (40 * Math.PI) / 180 } : globeConfig;
    const world = await createWorld(stage, params, { start: GLOBES[start], alpha: false, light, globe, desk: null });
    shell.attach(world.controller, world.setScene, world.specks);
    // A right-click on the koi's or the reef's globe drops in a flake of food.
    world.renderer.domElement.addEventListener('pointerdown', (e) => {
      if (e.button === 2) world.spawnFood(e.clientX, e.clientY);
    });
    // A click (a press let go where it began, without a drag) on the betta bowl's lid lifts it.
    let press: { x: number; y: number; t: number } | null = null;
    world.renderer.domElement.addEventListener('pointerdown', (e) => {
      press = e.button === 0 ? { x: e.clientX, y: e.clientY, t: performance.now() } : null;
    });
    world.renderer.domElement.addEventListener('pointerup', (e) => {
      if (press && e.button === 0 && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6 && performance.now() - press.t < 450) world.clickLid(e.clientX, e.clientY);
      press = null;
    });
    run(world, params, {
      beforeRender: () => shell.frame(),
      firstFrame: () => shell.start(),
    });
  } catch (err) {
    console.error('[globes] could not start:', err);
    shell.ui.unsupported(classifyFailure(err));
  }
}

/** A globe on the desktop: clear around the globe, bending the wallpaper behind it. */
async function startDesktop(stage: HTMLElement, params: URLSearchParams, host: DesktopHostApi): Promise<void> {
  document.documentElement.classList.add('desktop');
  const id = params.get('globe') ?? 'water';
  const entry = GLOBES.find((g) => g.id === id && !g.comingSoon) ?? GLOBES[0];
  const info = await host.desktopScene();
  if (!info) throw new Error('The desktop could not be read.');
  const desk = await loadDesk(info);
  // ?debugbg: paint the wallpaper behind the page as the desktop shows it (to check, in a
  // screenshot of the page alone, that the globe's view of it lines up).
  if (params.has('debugbg')) {
    stage.style.background = `url(${await desk.url()}) ${desk.crop.x - info.window.x}px ${desk.crop.y - info.window.y}px / ${desk.crop.width}px ${desk.crop.height}px no-repeat`;
  }

  const fov = (FOV * Math.PI) / 180;
  const distance = 1 / Math.sin(Math.atan(DESKTOP_FILL * Math.tan(fov / 2)));
  // ?deskClarity=<k>: scales the water's absorption on the desktop (tuning).
  const clarity = Number(params.get('deskClarity') ?? DESKTOP_WATER_CLARITY);
  const world = await createWorld(stage, params, {
    start: entry,
    alpha: true,
    light: { ...lightConfig, waterAbsorption: lightConfig.waterAbsorption.map((a) => a * clarity) as LightConfig['waterAbsorption'] },
    globe: { ...globeConfig, maxTilt: DESKTOP_MAX_TILT },
    desk: desk.texture,
  });
  world.controller.zoomEnabled = false;
  world.controller.zoomTo(distance, true);
  world.controller.placeAt(0);

  // ?deskDepth=<radii>: how far behind the globe the desktop lies (tuning).
  const mapping = new DeskMapping(desk, params.has('deskDepth') ? Number(params.get('deskDepth')) : undefined);
  stage.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    void host.showDesktopMenu(id);
  });
  run(world, params, {
    beforeRender: () => {
      mapping.update(world.camera, world.controller.center);
      world.globe.setDesktopView(mapping.toTexture, mapping.plane);
    },
    firstFrame: () => world.renderer.domElement.classList.add('is-live'),
  });
}

const params = new URLSearchParams(location.search);
const stage = document.getElementById('stage') as HTMLElement;
const host = (window as unknown as { globesHost?: DesktopHost & DesktopHostApi }).globesHost ?? null;

if (params.get('mode') === 'desktop' && host) {
  startDesktop(stage, params, host).catch((err: unknown) => console.error('[globes] desktop globe failed:', err));
} else {
  void startApp(stage, params, host);
}
