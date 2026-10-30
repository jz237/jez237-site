import '@fontsource-variable/inter';
import './app/styles.css';
import * as THREE from 'three/webgpu';
import { AppShell, type DesktopHost } from './app/AppShell';
import { AdaptiveScale, DESKTOP, keepLevel, keptLevel, levelAt, lowestLevel, PHONE, ratioAt } from './app/adaptiveScale.mjs';
import { FramePace } from './app/framePace.mjs';
import { QualityController } from './app/quality/controller.mjs';
import { buildLadder } from './app/quality/ladder.mjs';
import { bowlArea, GpuClock, PoseWatch, QualityRecord } from './app/quality/pageQuality';
import { Bench, describeDevice, registerBenchRows } from './app/bench';
import { describe, describeLoad, FrameProfile, wrap } from './app/frameProfile';
import { Learn } from './app/learn/Learn';
import { drowsy, keptNight, NightFade } from './app/night.mjs';
import { NightToggle } from './app/NightToggle';
import { FollowToggle } from './app/FollowToggle';
import { eyeFor, FollowCamera, followDistance } from './app/follow.mjs';
import { ResolutionMenu } from './app/ResolutionMenu';
import { VarietyMenu } from './app/VarietyMenu';
import { CLEAR_WATER, forcedWaterEffects, type WaterEffects } from './water/effects';
import { WaterCare } from './water/WaterCare';
import { WaterLook } from './water/look';
import { BETTA_PAGE, elsewhere, GLOBES, type GlobeEntry } from './app/catalog';
import { applyUrlOverrides, fishConfig, globeConfig, lightConfig, simConfig, type GlobeConfig, type LightConfig, type SimConfig } from './config';
import { DeskMapping, loadDesk, type DesktopHostApi } from './desktop/desktopScene';
import { Betta, MAPS_AT, BUBBLE_RADIUS, RIPPLE_RADIUS } from './fish/Betta';
import { BETTA_SURFACE_AT } from './fish/bettaWater.mjs';
import { Koi, type KoiEnv } from './fish/Koi';
import { CLOWN_PROBES, Clownfishes } from './fish/Clownfish';
import { FishFood, type Feeder } from './fish/FishFood';
import { classifyFailure, createDevice, deviceInfo } from './gpu/device';
import { describePipelines, pipelineMarks, pipelineSnapshot, pipelinesFirstFrame } from './gpu/pipelineCount';
import { BowlLid } from './interaction/BowlLid';
import { BowlLife, LIFE_PROBE_AT } from './interaction/BowlLife';
import { Feeding } from './interaction/Feeding';
import { CAMERA_VIEW, GlobeController } from './interaction/GlobeController';
import { KelpForest } from './kelp/KelpForest';
import { REEF_PROBES, Reef } from './reef/Reef';
import { Specks } from './ocean/Specks';
import { BOWL, bowlDebug, bowlShape } from './render/bowl';
import { BowlRender, upDebug, upSettings } from './render/bowlRender';
import { BED, setScapeShader } from './render/bowlScape';
import { furnish } from './render/scape/furnishings';
import { BOWL_KOI_LAYER, GlobeView, texelTexture, type GlobeVariant } from './render/GlobeView';
import { MovingPlants, PLANT_PROBE_AT } from './render/scape/MovingPlants';
import { OceanBackdrop } from './render/OceanBackdrop';
import { StudioBackdrop } from './render/StudioBackdrop';
import { lightStudio } from './render/studioLight';
import { BOWL_DEBUG_LEGEND, sunInWater } from './render/shaders';
import { BED_SOLIDS_N, BED_SOLIDS_NONE, FluidSim, SURFACE_ISO, fillHeight } from './sim/FluidSim';
import { IdleWater } from './sim/IdleWater';
import { PHONE_SIM, phoneRuntime } from './sim/simTier';
import { FIN_QUALITY } from '../../betta-atelier/src/fin-dynamics.js';

/** The camera's field of view, top to bottom (degrees). A view narrower than this (width over
 *  height) widens it instead, so the globe keeps clear of the sides (a phone held upright). */
const FOV = 30;
const NARROWEST = 0.75;
/** Phones and tablets get a lighter globe (a coarser grid, one ray per pixel, no supersampled
 *  canvas) unless the URL asks otherwise (?res=, ?aa=). (betta.html repeats this test, to start
 *  the bowl's furnishings as the page is read.) */
const LITE = ((q) => (q === '1' ? true : q === '0' ? false : matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 1000))(new URLSearchParams(location.search).get('lite'));
/** How the picture's sharpness steps (app/adaptiveScale.mjs), from the screen's own pixel ratio
 *  (up to 2) down: phones' steps are finer, and their frames held to 60 a second (FramePace). */
const TIER = LITE ? PHONE : DESKTOP;
/** Phones step their picture with the quality controller (app/quality: its sharpness, then what a
 *  ray or a frame can do without, by what the GPU measurably spends on a frame); ?quality=0 with
 *  the scaler instead (app/adaptiveScale.mjs: the pixel ratio alone, by the frames' pace). */
const QUALITY = LITE && new URLSearchParams(location.search).get('quality') !== '0';
/** The splash's bar (the app): how far along each step of the load puts it. The bowl's pipelines,
 *  most of a phone's load, fill it from `sim` to `building` over the time they took on this device
 *  last time (or COMPILE_GUESS_MS): nothing else can say how far along they are. */
const LOAD = { device: 0.08, studio: 0.14, furnishings: 0.2, sim: 0.28, building: 0.96 };
const COMPILE_GUESS_MS = LITE ? 8000 : 3000;
const screenRatio = (): number => Math.min(window.devicePixelRatio, 2);
/** The sharpness (a level: app/adaptiveScale.mjs) a view starts at: on phones 1 canvas pixel a
 *  CSS pixel, elsewhere the sharpest. */
const startLevel = (): number => (LITE ? levelAt(screenRatio(), 1, PHONE) : 0);
/** How the phone is held (the sharpness it holds is kept for each: keptLevel). */
const wayUp = (): string => (innerWidth > innerHeight ? 'wide' : 'tall');
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
  /** The app's shell, while the world loads: it puts the camera where the entrance starts, and its
   *  splash shows how far along the load is (over the studio, drawn as soon as it can be). */
  shell?: AppShell;
}

/** The globe, its water and its koi, drawn into the stage. */
async function createWorld(stage: HTMLElement, params: URLSearchParams, o: WorldOptions) {
  // The betta bowl's furnishings are built meanwhile, in a worker (render/scape/furnishings.ts).
  const furnishing = GLOBES.some((g) => g.betta) ? furnish(BED_SOLIDS_N, o.globe.innerRadius, BED_SOLIDS_NONE, LITE ? 0.5 : 1) : null;
  const device = await createDevice();
  PROF.mark('device');
  o.shell?.progress(LOAD.device);
  // (What the page keeps of this device's picture: a phone's quality level, the bowl's build time.)
  const record = new QualityRecord(deviceInfo());

  // (Dev builds time the render pass on the GPU, for profiling; ?stats and ?bench; and phones, for
  // their quality controller, where it steers.)
  // ?aa=1 traces one ray per pixel instead of four (cheaper, aliased waterline); one is all phones and
  // the betta's page draw, and phones have no multisampled canvas unless asked for four.
  const samples = Number(params.get('aa') ?? (LITE || o.start.betta ? 1 : 4));
  const steered = QUALITY && params.get('adapt') !== '0' && !params.has('level');
  const multisampled = !LITE || samples >= 4;
  const renderer = new THREE.WebGPURenderer({ device, antialias: multisampled, alpha: o.alpha, trackTimestamp: import.meta.env.DEV || PROF.on || steered });
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
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 100);
  const controller = new GlobeController(renderer.domElement, camera, o.globe);
  // The betta's globe is a bowl, open at the mouth, with a lid (where the page shows it), which
  // comes off only to feed the fish.
  const bowl = GLOBES.some((g) => g.betta) ? bowlShape(o.globe, LITE, bowlDebug(params.get('debug'))) : null;
  // (Phones draw it on a 2x2 lattice a frame, made whole again, in its studio: render/bowlRender.ts.
  // Its passes then write what each ray ended on. ?up=0 draws it straight into the frame, as desktops
  // do.)
  const up = upSettings(params, LITE);
  // (Not into a multisampled frame buffer - a desktop's, ?aa=4 - whose bowl passes would be built
  // again for its samples, unused.)
  if (bowl) bowl.ids = up.mode > 0 && !o.desk && !multisampled;

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
  // Night (app/night.mjs: the room dark, the lamp in its moonlight mode, the fish drowsy), the betta
  // bowl's page's: from the first frame as this device last left it.
  const night = bowl ? new NightFade(keptNight(() => localStorage)) : null;
  if (night) lightStudio(night.value);

  // The picture takes the stage's shape and size, whatever they are: as many pixels as the
  // screen has (up to twice the CSS pixels), but no wider or taller than the GPU's textures go.
  // (If frames come too slowly for the pointer to be followed, run() lowers the sharpness a step
  // at a time, and offers it back when they are quick again. Phones step more finely, from 1
  // canvas pixel a CSS pixel to begin with: TIER.)
  let sharpness = startLevel();
  // (?bench: a pixel ratio of its own choosing, for a while. A phone's quality level's, from its
  // first frame: setKnobs.)
  let ratioOverride: number | null = null;
  let knobRatio: number | null = null;
  // (The betta bowl's page: a ratio chosen there, held however slowly frames come: run().)
  let fixedRatio: number | null = null;
  // (Only what changed is set: the canvas is cleared and made anew whenever it is given a size,
  // the same or not.)
  let fitted = [0, 0];
  const fit = (): void => {
    const [w, h] = stageSize();
    const most = device.limits.maxTextureDimension2D;
    renderer.setPixelRatio(Math.min(ratioOverride ?? fixedRatio ?? knobRatio ?? ratioAt(screenRatio(), sharpness, TIER), most / w, most / h));
    // (A phone's table mirror stays as sharp as at its lowest ratio, 0.3 texels to a CSS pixel,
    // however sharp the picture: faint and blurred as it is, it traces the bowl again.)
    studio?.setMirrorScale(LITE ? Math.min(0.5, 0.3 / renderer.getPixelRatio()) : 0.5);
    if (w === fitted[0] && h === fitted[1]) return;
    fitted = [w, h];
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
  const setFixedRatio = (ratio: number | null): void => {
    fixedRatio = ratio;
    fit();
  };

  // The betta bowl's studio, live, while the rest loads: its small pipelines built first, the camera
  // where the entrance starts (the bowl out of sight), drawn behind the splash (again whenever the
  // stage changes size: nothing in it moves). Its first frame is drawn before the sim is set up (its
  // last pipelines, the mirror's and the output's, are built in it: three's error scopes must not
  // close among the sim's, below).
  if (studio && o.shell) {
    const shell = o.shell;
    shell.place(controller);
    studio.update(controller.center);
    await renderer.compileAsync(scene, camera);
    // (Its first frame drawn here and now, not waiting for an animation frame: a page loading in a
    // tab out of sight gets none, and would not go on to build the bowl until it was shown.)
    renderer.render(scene, camera);
    let drawn = [...fitted];
    renderer.setAnimationLoop(() => {
      if (fitted[0] === drawn[0] && fitted[1] === drawn[1]) return;
      drawn = [...fitted];
      renderer.render(scene, camera);
    });
    void device.queue.onSubmittedWorkDone().then(() => {
      PROF.mark('studio');
      shell.studio();
      shell.progress(LOAD.studio);
    });
  }

  // The articulated specimen needs cadence more than sub-pixel fluid detail.
  // Preserve the original five scenes' defaults; explicit URL overrides still win.
  // (The betta's bowl has a bed of its own depth: bowlScape.ts BED.)
  const base = o.start.betta ? { ...simConfig, sandLevel: BED.level } : simConfig;
  // (Phones: a coarser grid, fewer substeps a frame - two at 60 fps, of up to 1/100 s - and solver
  // sweeps; and lighter still while the water moves little, ?simq=0 as round 2 ran it: simTier.ts.)
  const cfg = applyUrlOverrides(LITE ? { ...base, ...PHONE_SIM } : o.start.betta ? { ...base, gridRes: 64 } : base);
  const R = o.globe.innerRadius;
  const fill = (g: GlobeEntry) => fillFor(cfg, R, g.water);
  const sim = new FluidSim(device, { ...cfg, fillFraction: fill(o.start) }, R, o.globe.outerRadius, o.light);
  if (LITE) sim.runtime = phoneRuntime(params.get('simq'));
  const koiEnv = (): KoiEnv => ({
    radius: o.globe.innerRadius,
    level: sim.restLevel,
    sandLevel: cfg.sandLevel,
    gravity: controller.bodyAccel(cfg.gravity),
    iso: SURFACE_ISO,
  });
  const koi = new Koi(device, fishConfig, koiEnv());
  sim.koiPose = koi.texture;
  // (On a phone of four cores or more the betta is moved in a worker, a frame behind: fish/Betta.ts.
  // ?worker=0 moves it on this thread, ?worker=1 in a worker anywhere; ?manual's ticks move it here,
  // in step with them, unless asked.)
  const worker = params.get('worker');
  const betta = new Betta(device, GLOBES.some((g) => g.betta) && (worker === null ? LITE && !params.has('manual') && navigator.hardwareConcurrency >= 4 : worker === '1'));
  // (The betta's bowl's lid, which comes off only to feed the fish.)
  const lid = bowl ? new BowlLid(bowl) : null;
  const feeding = lid ? new Feeding(lid, controller) : null;
  // What floats in it: an almond leaf, and the betta's bubble nest.
  const life = bowl ? new BowlLife(o.globe.innerRadius) : null;
  const bettaControls = document.createElement('div');
  bettaControls.className = 'betta-controls';
  bettaControls.innerHTML = '<button type="button" data-action="feed">Feed</button><button type="button" data-action="flare" aria-pressed="false">Flare fins</button>';
  // Its variety (app/VarietyMenu.ts, fish/varieties.mjs): chosen at its name, first among its
  // controls; from the first frame as this device last chose it.
  const variety = new VarietyMenu(bettaControls);
  betta.showVariety(variety.variety);
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
  // (The sim builds the kernels of what it is given, and the betta bowl's page has neither a
  // forest nor a reef: there they are only the globe's stand-ins, never simulated.)
  const kelp = new KelpForest(device, R, cfg.sandLevel, kelpLevel, sunWater, cfg.gravity);
  if (kelpGlobe) sim.kelp = kelp;
  // The reef: its anemone (the clownfish come later), simulated and drawn only in its globe. (Its
  // shadow goes into the same grid as the kelp's: one of them is in the water at a time.)
  const reefGlobe = GLOBES.some((g) => g.reef);
  const reef = new Reef(device, cfg.gravity, sunWater, kelp.shadeTexture);
  if (reefGlobe) sim.reef = reef;
  // Its two clownfish, living in the anemone.
  const clowns = new Clownfishes(device, reef.data);
  if (reefGlobe) sim.clownPose = clowns.texture;
  sim.rock = !!o.start.reef;
  sim.glass = o.globe;
  // (What no globe of the page shows, the sim leaves out: the phone's bowl draws no motes.)
  sim.shows = { koi: GLOBES.some((g) => g.koi), shade: GLOBES.some((g) => !!(g.kelp || g.reef)), foam: GLOBES.some((g) => !!g.foam), motes: !bowl?.lite || !GLOBES.every((g) => g.betta) };
  // Fish food (the koi's and the reef's globes): flakes dropped in with a right-click.
  const food = new FishFood();
  const idle = new IdleWater();
  // Learn mode (app/learn): what the fish does and what is in its bowl, explained; off until asked
  // for. (Its card goes up top on a phone with ?stats' figures up.)
  const learn = lid && feeding && life ? new Learn(bettaControls, stage, { camera, canvas: renderer.domElement, controller, betta, life, food, feeding, lid, glass: o.globe, level: () => sim.restLevel, variety: () => variety.variety }, PROF.on) : null;
  // What the bowl's water does to the fish and to the water's look (water/effects.ts): clear, the
  // page as it always was, unless forced (?water=, testing).
  const water = { fx: forcedWaterEffects(params.get('water')) ?? CLEAR_WATER };
  // (The fish's at night: night.mjs drowsy, made over each frame.)
  const drowsyFx: WaterEffects = { ...CLEAR_WATER };
  // Water mode (water/WaterCare.ts): the bowl's water simulated, in a panel and in water.fx; off
  // until asked for.
  const waterCare = feeding ? new WaterCare(bettaControls, stage, { water, forced: forcedWaterEffects(params.get('water')), feeding, food, learn, rotation: () => controller.rotation.elements }) : null;
  // The betta bowl's furnishings, built by now: their BVH for the shader (on the GPU, where the
  // plants' motion rewrites it each frame), where they stand in the sand for the sim (the sand
  // rests on them and flows round them), where the fish keeps clear of them, and where the sponge
  // filter's air bubbles out.
  let scapeTex: THREE.Texture | null = null;
  let scapeObstacles: { a: number[]; b: number[]; r: number; solid: number; fin?: number }[] = [];
  let plants: MovingPlants | null = null;
  let filterAir: { at: number[]; rate: number; radius: number } | null = null;
  if (furnishing) {
    const f = await furnishing;
    PROF.mark('furnishings');
    o.shell?.progress(LOAD.furnishings);
    setScapeShader(f.wgsl);
    const bvh = device.createTexture({ label: 'furnishings BVH', size: [f.width, f.height], format: 'rgba32float', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST });
    device.queue.writeTexture({ texture: bvh }, f.data as unknown as BufferSource, { bytesPerRow: f.width * 16, rowsPerImage: f.height }, [f.width, f.height]);
    scapeTex = texelTexture(bvh);
    plants = new MovingPlants(device, bvh, f.motion, f.phases);
    sim.bedSolids = { map: f.map, extent: R };
    scapeObstacles = f.obstacles;
    filterAir = f.bubbles;
    learn?.setScape(f.data, f.parts);
  }
  // (The filter's bubbles owed, a share of one carried from frame to frame.)
  let airOwed = 0;
  // (The plants' clock, and on phones every other frame of their motion, or fewer at a lower quality
  // level: it is slow enough.)
  let plantClock = 0;
  let plantDue = 0;
  let plantFrame = 0;
  let plantEvery = LITE ? 2 : 1;
  // (Where the bowl's turn has carried them, each frame: the sim frame.)
  const turnedObstacles = scapeObstacles.map((o) => ({ a: [0, 0, 0], b: [0, 0, 0], r: o.r, solid: o.solid, fin: o.fin ?? o.solid }));
  // (Set up before the globe's pipelines are begun, not alongside them: three holds a WebGPU
  // error scope open over each pipeline it builds, the sim one over its setup, and scopes close
  // last first, so side by side each could be handed the other's errors, and the sim's check that
  // it could be set up, which ends the page with a message where not, would be no check.)
  await sim.init(Math.max(...GLOBES.map(fill)), GLOBES.map((g) => ({ fill: fill(g), rock: !!g.reef })));
  PROF.mark('sim');
  o.shell?.progress(LOAD.sim);

  const globe = new GlobeView(sim, o.globe, o.light, koi.texture, samples, ocean ? { ocean: ocean.map.texture } : studio ? { ocean: studio.map } : { desktop: o.desk! }, kelp, reef, clowns.texture, GLOBES.find((g) => g.reef)?.clarity, GLOBES.find((g) => g.foam)?.waterColour, betta, bowl, scapeTex);
  // (What the bowl's water shows of its state, and the fish's colours in it.)
  const look = bowl ? new WaterLook(globe, sim, water.fx) : null;
  // (The fish's variety, as it is shown: its numbers in the bowl's shader; its colour maps, once
  // painted, copied into its atlas's bottom row on the GPU, the rest of it as it was, and let go there
  // (8 MB) until the next. Its photographs may already be in, and the variety painted.)
  betta.lookHost((copy) => {
    globe.setBettaLook(betta.look);
    if (!copy) return;
    renderer.copyTextureToTexture(betta.maps, betta.atlas, null, new THREE.Vector2(0, MAPS_AT));
    betta.maps.dispose();
  });
  // (With Learn mode on, a word on the variety chosen.)
  variety.onChange = (id) => {
    betta.showVariety(id);
    learn?.aboutFish();
  };
  // A phone's quality level's knobs (app/quality/ladder.mjs), each set by its name; none builds a
  // pipeline. (Its fps is run()'s.)
  const knobs: Record<string, (v: number) => void> = {
    ratio: (r) => {
      knobRatio = r;
      fit();
    },
    mirrorEvery: (n) => {
      if (studio) studio.mirrorEvery = n;
    },
    plantEvery: (n) => {
      plantEvery = n;
    },
    march: (voxels) => globe.setMarchStep(voxels),
  };
  const setKnobs = (k: Record<string, number>): void => {
    for (const [name, v] of Object.entries(k)) knobs[name]?.(v);
  };
  scene.add(globe.mesh);
  // (Out of the studio's frames until its pipelines are built: drawn, three would build them there
  // and then, a phone's frame held up for seconds.)
  globe.mesh.visible = false;
  if (lid) globe.setBowlLid(lid.toLid, lid.shown, lid.reach, lid.lamp);
  // (?updebug paints its resolve; ?uptau and ?upwide set its change test's thresholds, for tuning.)
  const tuning = (k: string): number | undefined => (params.has(k) ? Number(params.get(k)) : undefined);
  const bowlRender = studio && bowl?.ids ? new BowlRender(globe, studio, camera, scene, up, { debug: upDebug(params.get('updebug')), tau: tuning('uptau'), wide: tuning('upwide') }) : null;
  if (bowlRender) registerBenchRows('up', bowlRender.benchRows());
  // Before the first frame, behind the splash: the water settles, and meanwhile every globe's
  // pipelines are built (and the software tracers' where the device traces in hardware). Built
  // after it, each held up a frame or more as the first globe slid in, and a switch to a globe
  // not built yet stalled until it was. (Only the page's own globes': the betta bowl's page
  // builds the bowl's alone.)
  const variants = [...new Set(GLOBES.map(variantOf))];
  // (Phones settle in frames of 1/30 s, four queued at a time: half the steps, few waits.)
  const settled = LITE ? sim.settle(2.5, 1 / 30, 4) : sim.settle();
  const building = performance.now();
  o.shell?.progress(LOAD.building, (record.compileMs ?? COMPILE_GUESS_MS) / 1000);
  await Promise.all([
    settled.then(() => PROF.mark('settled')),
    Promise.all([globe.precompile(renderer, camera, scene, variants), bowlRender?.precompile(renderer, camera, scene)])
      .then(() => {
        PROF.mark('compiled');
        record.compileMs = performance.now() - building;
      })
      .catch((err: unknown) => console.warn('[globes] precompile:', err)),
  ]);
  o.shell?.progress(1);
  globe.mesh.visible = true;

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
  // (The bowl's angle about its own axis at the last frame, and the turn since, for the fish.)
  let lastTwist = controller.twist;
  const bettaTurn = [0, 0, 0];
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
    // (Night fading in or out: the studio's light, render/studioLight.ts.)
    if (night) {
      const was = night.value;
      if (night.step(dt) !== was) lightStudio(night.value);
    }
    // (And what the water is doing to the betta, water/effects.ts, drowsier at night.)
    betta.water = night ? drowsy(water.fx, night.value, drowsyFx) : water.fx;
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
    // The bowl's turn about its own axis this frame (along its axis, sim frame): the fish is carried
    // round with it, as by the hand that turned the bowl (BettaSwim.turnWith). (Whole turns are
    // taken off the controller's angle as it goes; a jump of more than a radian is a reset.)
    let twisted = controller.twist - lastTwist;
    twisted -= 2 * Math.PI * Math.round(twisted / (2 * Math.PI));
    lastTwist = controller.twist;
    if (Math.abs(twisted) > 1) twisted = 0;
    const axis = controller.rotation.elements;
    for (let k = 0; k < 3; k++) bettaTurn[k] = axis[3 + k] * twisted;
    betta.update(dt, sim.koiSense, koiEnv(), controller.omega, twisted ? bettaTurn : null);
    sim.setKoiProbes(betta.active ? betta.probePoints() : koi.probePoints());
    if (betta.active) {
      sim.setProbes(BETTA_SURFACE_AT, betta.surfaceProbes());
      PROF.lap('betta');
      if (plants) {
        // The plants: their leaves' probes where the bowl's turn has carried them, and their
        // motion (each frame; every other one on phones, or fewer: plantEvery).
        sim.setProbes(PLANT_PROBE_AT, plants.probePoints(controller.rotation.elements));
        plantClock += dt;
        plantDue += dt;
        if (++plantFrame % plantEvery === 0) {
          plants.update(plantClock, plantDue, sim.koiSense, controller.rotation.elements, controller.omega, SURFACE_ISO);
          plantDue = 0;
        }
      }
      PROF.lap('plants');
      look?.update(dt, water.fx);
      if (life) {
        life.tending = water.fx.nest;
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
      // The sponge filter's air, bubbling steadily out of its lift tube where the bowl's turn has
      // carried it: those owed, in a frame the fish lets none go (the splash takes one place a
      // frame).
      if (filterAir) {
        airOwed = Math.min(airOwed + dt * filterAir.rate, 4);
        if (!(d.bubbles > 0) && airOwed >= 1) {
          const e = controller.rotation.elements, a = filterAir.at;
          sim.splash.emit([e[0] * a[0] + e[3] * a[1] + e[6] * a[2], e[1] * a[0] + e[4] * a[1] + e[7] * a[2], e[2] * a[0] + e[5] * a[1] + e[8] * a[2]], airOwed, filterAir.radius);
          airOwed -= Math.floor(airOwed);
        }
      }
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
    if (learn?.on) learn.frame();
    if (waterCare?.on) waterCare.frame(dt);
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

  return { device, renderer, camera, scene, cfg, sim, controller, koi, betta, lid, life, learn, water, waterCare, night, kelp, reef, clowns, food, idle, globe, globeRadius: o.globe.outerRadius, glass: o.globe, ocean, studio, specks, bowlRender, setScene, advance, spawnFood, clickLid, setSharpness, setRatio, setFixedRatio, setKnobs, record };
}

type World = Awaited<ReturnType<typeof createWorld>>;

/** Runs the world every frame. beforeRender: after the world moves, before it is drawn. */
function run(world: World, params: URLSearchParams, hooks: { beforeRender?: () => void; firstFrame?: () => void }): void {
  const { renderer, camera, scene, sim, controller, globe, ocean, studio, specks, bowlRender, advance, setSharpness, setRatio, setFixedRatio, setKnobs, record, lid, cfg } = world;
  // ?adapt=0 keeps the picture at the sharpness it starts at, however slowly it draws (profiling;
  // ?bench too). Desktops step by the frames' pace (app/adaptiveScale.mjs); so do phones with
  // ?quality=0, their own way (PHONE), down to the first level at the floor, from where frames last
  // held (keptLevel).
  const held0 = params.get('adapt') === '0' || params.has('bench');
  const adaptive = held0 || QUALITY ? null : new AdaptiveScale(performance.now(), LITE ? { tier: PHONE, level: keptLevel(wayUp(), startLevel()) ?? startLevel(), lowest: lowestLevel(screenRatio(), PHONE) } : {});
  if (adaptive) setSharpness(adaptive.level);
  // Phones: frames held to 60 a second (app/framePace.mjs; ?pace=0, as fast as they come, for
  // profiling, and ?bench, which measures how fast they can come), the scaler told what each one
  // took the main thread, the level they held at (kept for the next view: keptLevel), and a turn
  // of the phone (measured afresh, from the level held that way up).
  const pace = LITE && params.get('pace') !== '0' && !params.has('bench') ? new FramePace() : null;
  const scale = LITE ? adaptive : null;
  // Phones (app/quality): the quality controller, from the level this device held longest on its
  // last visit (record.mjs; or one its GPU's name suggests), steered by the GPU's measured time on
  // a frame (GpuClock). ?level=n holds the picture at level n; ?adapt=0 and ?bench at the sharpest
  // knobs, 1 canvas pixel a CSS pixel (as before the ladder).
  const levels = QUALITY ? buildLadder(screenRatio()) : null;
  const stage = renderer.domElement;
  // (The bowl's area on the stage, CSS px^2: in view now, and at rest in this view.)
  const areaNow = (): number => bowlArea(controller.screenOutline(), stage.clientWidth, stage.clientHeight);
  const areaAtRest = (): number => {
    const c = controller.restCircle();
    return bowlArea({ x: c.x, y: c.y, rx: c.r, ry: c.r, angle: 0 }, stage.clientWidth, stage.clientHeight);
  };
  const pinned = params.get('level');
  const quality = levels && !held0 && pinned === null ? new QualityController(levels, { level: record.start(levels, wayUp(), areaAtRest()), now: performance.now() }) : null;
  const clock = quality ? new GpuClock(renderer, sim, world.device) : null;
  const applyKnobs = (k: { fps: number } & Record<string, number>): void => {
    setKnobs(k);
    if (pace) pace.frameMs = 1000 / k.fps;
  };
  if (levels) applyKnobs(quality?.knobs ?? (pinned !== null ? levels[Math.min(Math.max(Math.round(Number(pinned)) || 0, 0), levels.length - 1)] : { ...levels[0], ratio: ratioAt(screenRatio(), startLevel(), PHONE) }));
  // (Whether anything moved since the last frame: the table's mirror may skip a frame then, and the
  // controller learns only from frames at rest.)
  const pose = new PoseWatch();
  const centre: number[] = [];
  let way = wayUp();
  let turned = 0;
  if (quality && levels) {
    // (The level held longest, kept for the next visit: now and then, and as the page is hidden.)
    const keep = (): void => {
      const h = quality.heldLongest;
      if (h) record.keep(way, h.fps30 ? levels.length - 1 : h.level);
    };
    setInterval(keep, 30000);
    addEventListener('pagehide', keep);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) keep();
    });
  }
  // The betta bowl's resolution (app/ResolutionMenu.ts, in the page's link bar): Auto, all of the
  // above, or a ratio held however slowly frames come, nothing stepped: a phone's other knobs at the
  // ladder's second level, its sharpest but for the table's mirror redrawn every other frame while
  // nothing moves (the same picture: ladder.mjs). Auto again, the controller or the scaler starts
  // over from where it stood.
  // (?bench's own ratios win while it runs.)
  const links = BETTA_PAGE ? document.querySelector<HTMLElement>('.site-links') : null;
  // (Night, app/NightToggle.ts, between the page's link and the resolution: with Learn mode on, a word
  // on a betta's night as it falls.)
  const nightButton = links && world.night ? new NightToggle(links, world.night.on) : null;
  if (nightButton) {
    nightButton.onChange = (on) => {
      world.night?.set(on);
      if (on) world.learn?.atNight();
    };
  }
  // Follow (app/FollowToggle.ts, follow.mjs): the camera drawn in close on the fish and kept on it,
  // where it is seen through the glass and the water; let go, the stage's camera takes the picture
  // back. (Between Night and the resolution.)
  const followButton = links && world.betta.active ? new FollowToggle(links) : null;
  const followCam = followButton ? new FollowCamera() : null;
  if (followButton && followCam) followButton.onChange = (on) => followCam.set(on, camera.position.toArray());
  const fishMiddle = [0, 0, 0];
  const resolution = links ? new ResolutionMenu(links, { screen: () => window.devicePixelRatio, stage: () => [stage.clientWidth, stage.clientHeight], ratioNow: () => renderer.getPixelRatio(), most: world.device.limits.maxTextureDimension2D }) : null;
  let fixed: number | null = null;
  const hold = (ratio: number | null): void => {
    fixed = ratio;
    setFixedRatio(ratio);
    const now = performance.now();
    if (ratio !== null) {
      if (levels) applyKnobs(levels[Math.min(1, levels.length - 1)]);
    } else if (quality) {
      applyKnobs(quality.restart(now, null, { area: areaNow(), restArea: areaAtRest() }));
    } else if (adaptive) {
      adaptive.restart(now);
      setSharpness(adaptive.level);
    }
  };
  if (resolution) {
    resolution.onChange = hold;
    if (resolution.ratio !== null) hold(resolution.ratio);
  }
  let held: number | null = null;
  if (scale) {
    let way = wayUp();
    addEventListener('resize', () => {
      if (wayUp() === way) return;
      way = wayUp();
      held = null;
      scale.restart(performance.now(), keptLevel(way, startLevel()) ?? scale.level);
      setSharpness(scale.level);
    });
  }
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
  // ?bench (app/bench.ts): after a few seconds, row by row, the frame measured at each pixel ratio
  // in turn, with a part of it left out, with the sim set otherwise; then a table of them, the
  // device and the load. (The page's own ratio after.)
  const bench = params.has('bench') ? new Bench(world, PROF, setRatio, params.get('bench') ?? '', LITE) : null;
  // ?stats: the device's report; and, every two seconds, what the splash holds (the drops on the
  // glass, the spray: a readback of its counts).
  const device = describeDevice();
  let splash = '';
  let splashAt = 0;
  // (And under ?debug, what its colours are: render/shaders.ts.)
  const legend = GLOBES.some((g) => g.betta) ? BOWL_DEBUG_LEGEND[bowlDebug(params.get('debug'))] : [];
  // ?manual (dev testing): the sim only advances through __globes.tick().
  const manual = params.has('manual');
  const drawSize = new THREE.Vector2();
  let statsStart = performance.now();
  let first = true;

  // Dev: smoothed GPU time of the render pass (ms), when on.
  const renderTimes = { on: false, ms: 0 };
  // ?clock: the seconds since the first frame, in a corner (to say when something looked off).
  const seconds = params.has('clock') ? document.body.appendChild(document.createElement('div')) : null;
  if (seconds) seconds.style.cssText = 'position:fixed;left:max(12px,env(safe-area-inset-left));top:calc(100px + env(safe-area-inset-top));z-index:50;padding:6px 10px;border-radius:4px;background:rgba(0,0,0,.6);color:#fff;font:600 22px/1 ui-monospace,Menlo,Consolas,monospace;font-variant-numeric:tabular-nums;pointer-events:none';
  let secondsFrom = 0;
  let last = performance.now();
  renderer.setAnimationLoop((time?: number) => {
    // (Phones: the animation frame's time, the screen's refresh, so that frames are timed as they
    // are shown, evenly, and held to 60. The loop's first call, at once, has none.)
    const now = LITE && time !== undefined ? time : performance.now();
    if (pace && !pace.draw(now)) return;
    const gap = now - last;
    // (At 30 frames a second, a stall is two of theirs.)
    const dt = Math.min(Math.max(gap, 0) / 1000, Math.max(STALL, (2 * (pace?.frameMs ?? 0)) / 1000));
    last = now;
    const start = performance.now();

    PROF.begin();
    const level = fixed === null ? (adaptive?.frame(now) ?? null) : null;
    if (level !== null) setSharpness(level);
    if (fixed === null && scale && scale.held !== null && scale.held !== held) {
      held = scale.held;
      keepLevel(wayUp(), held);
    }
    if (!manual) advance(dt);
    if (followCam && (followCam.on || followCam.weight > 0)) {
      // (Where the fish is now, its probes' mean in the sim frame; the eye there for the next frame.)
      const probes = world.betta.probePoints();
      fishMiddle.fill(0);
      for (let i = 0; i < 16; i++) for (let k = 0; k < 3; k++) fishMiddle[k] += probes[4 * i + k] / 16;
      const c = controller.center;
      const eye = eyeFor(fishMiddle, CAMERA_VIEW, followDistance((camera.fov * Math.PI) / 180, camera.aspect, controller.followZoom), { outer: world.glass.outerRadius, inner: world.glass.innerRadius, level: sim.restLevel });
      followCam.step(dt, [eye[0] + c.x, eye[1] + c.y, eye[2] + c.z]);
      controller.followEye.fromArray(followCam.eye);
      controller.followShare = followCam.share;
    }
    hooks.beforeRender?.();
    const heightPx = renderer.getDrawingBufferSize(drawSize).y;
    // (The bowl drawn in its own targets: whether the view moved, and so how far apart its rays are.)
    bowlRender?.frame(renderer, camera, controller.center, controller.rotation, world.lid, gap);
    globe.update(controller.center, controller.rotation, camera, bowlRender?.tracedHeightPx() ?? heightPx);
    ocean?.update(renderer, now / 1000);
    const still = levels !== null && pose.still(camera.matrixWorld.elements, controller.center.toArray(centre), controller.rotation.elements, lid?.toLid.elements ?? [], lid ? [Number(lid.shown), lid.lamp] : []);
    studio?.update(controller.center, still);
    if (specks) {
      specks.update(dt, camera, heightPx, controller.panJumps - jumps, globeMotion);
      jumps = controller.panJumps;
    }
    PROF.lap('scene');
    bowlRender?.render(renderer, camera);
    renderer.render(scene, camera);
    PROF.lap('draw');
    PROF.end(world.device.queue);
    const work = performance.now() - start;
    if (fixed === null) scale?.work(work);
    if (quality && clock && levels && fixed !== null) {
      // (Held: the GPU's times let go as they come, nothing stepped; a turn of the phone is the
      // new way up.)
      clock.frame(start);
      clock.take();
      clock.takeQueue();
      way = wayUp();
      turned = 0;
    } else if (quality && clock && levels) {
      clock.frame(start);
      // (Turned: measured afresh, two frames on, once the picture has the new shape, from the level
      // kept for that way, or where the model puts it.)
      if (wayUp() !== way && ++turned >= 2) {
        const h = quality.heldLongest;
        if (h) record.keep(way, h.fps30 ? levels.length - 1 : h.level);
        way = wayUp();
        turned = 0;
        applyKnobs(quality.restart(now, record.kept(levels, way), { area: areaNow(), restArea: areaAtRest() }));
      }
      // (Water sloshing - more substeps than a calm frame takes - is the bowl moving too.)
      const calm = Math.min(cfg.maxSubsteps, Math.max(cfg.minSubsteps, Math.ceil(dt / cfg.maxSubstepDt - 1e-6)));
      const knobs = quality.frame(now, { cpu: work, gpu: clock.take(), queue: clock.takeQueue(), area: areaNow(), restArea: areaAtRest(), moving: !still || sim.lastSubsteps > calm, substeps: sim.lastSubsteps, refresh: pace?.refresh });
      if (knobs) applyKnobs(knobs);
    }
    if (seconds) {
      if (first) secondsFrom = now;
      seconds.textContent = `${((now - secondsFrom) / 1000).toFixed(1)} s`;
    }
    if (first) {
      first = false;
      PROF.mark('first frame');
      // (A pipeline built from here on is a late one, those since start the first frame's own:
      // gpu/pipelineCount.ts.)
      pipelinesFirstFrame(start);
      // (Once the GPU has drawn the first frame: the pipelines first used in it - the backdrop's,
      // the specks' - are built as it runs, which held up the frames after it as the globe began
      // to slide in.)
      const firstFrame = hooks.firstFrame;
      void world.device.queue.onSubmittedWorkDone().then(() => {
        PROF.mark('drawn');
        if (firstFrame) requestAnimationFrame(firstFrame);
      });
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
        bench.frame(now);
        if (now - statsStart >= 500) {
          statsStart = now;
          hud.textContent = bench.text(PROF.load);
        }
      } else if (now - statsStart >= 1000) {
        statsStart = now;
        if (now - splashAt >= 2000) {
          splashAt = now;
          void sim.splash.stats().then((c) => {
            splash = wrap('splash:', [`drops ${c.drops}`, `spray ${c.spray}`, `onto glass ${c.sprayOntoGlass}`, `left by water ${c.dropsLeftByWater}`]);
          });
        }
        const s = PROF.take();
        if (s) {
          const m = PROF.minute();
          hud.textContent = [
            describe(s, renderer.getPixelRatio(), [...(LITE ? ['phone tier'] : []), `${sim.lastSubsteps} substeps`, `${sim.particleCount} particles`]),
            ...(fixed !== null ? [`resolution held at ${fixed}× (Auto off)`] : quality ? quality.describe(now) : []),
            `gpu, last minute: sim ${m.sim?.toFixed(1) ?? '-'} · draw ${m.draw?.toFixed(1) ?? '-'} ms`,
            ...device,
            ...(bowlRender ? [bowlRender.describe()] : []),
            describePipelines(),
            ...(splash ? [splash] : []),
            ...legend,
            describeLoad([...PROF.load, ...pipelineMarks()]),
          ].join('\n');
          console.log(`[globes] ${hud.textContent}`);
        }
      }
    }
  });

  if (import.meta.env.DEV || params.has('qa')) {
    const tick = (dt: number) => advance(dt);
    const g = window as unknown as { __globes?: object };
    // (three.js itself only in development: held here, none of it could be left out of a build.)
    g.__globes = { ...g.__globes, ...(import.meta.env.DEV ? { THREE } : {}), ...world, tick, renderTimes, adaptive, quality, resolution, follow: followCam, prof: PROF, bench, pipelines: pipelineSnapshot };
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
    const world = await createWorld(stage, params, { start: GLOBES[start], alpha: false, light, globe, desk: null, shell });
    shell.attach(world.controller, world.setScene, world.specks);
    // A right-click on the koi's or the reef's globe drops in a flake of food.
    world.renderer.domElement.addEventListener('pointerdown', (e) => {
      if (e.button === 2) world.spawnFood(e.clientX, e.clientY);
    });
    // A click (a press let go where it began, without a drag, and no second finger down meanwhile:
    // a two-finger turn) on the betta bowl: in Learn mode, a card about what it is on; else, on its
    // lid, it lifts it.
    let press: { x: number; y: number; t: number; id: number } | null = null;
    world.renderer.domElement.addEventListener('pointerdown', (e) => {
      press = e.button === 0 && e.isPrimary ? { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId } : null;
    });
    world.renderer.domElement.addEventListener('pointerup', (e) => {
      if (press && e.button === 0 && e.pointerId === press.id && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6 && performance.now() - press.t < 450) {
        if (!world.learn?.tap(e.clientX, e.clientY)) world.clickLid(e.clientX, e.clientY);
      }
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
