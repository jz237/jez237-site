// three.js side of the globe: a sphere mesh whose material ray-traces the glass and
// ray-marches the simulated water density. In the app it stands in the deep ocean
// (OceanBackdrop.ts), whose map it bends; on the desktop it bends the wallpaper behind it
// instead, and is clear around it.

import * as THREE from 'three/webgpu';
import {
  cameraPosition,
  cameraProjectionMatrix,
  cameraWorldMatrix,
  float,
  positionWorld,
  screenCoordinate,
  select,
  texture,
  texture3D,
  uniform,
  varying,
  vec4,
  wgsl,
  wgslFn,
} from 'three/tsl';
import type { GlobeConfig, LightConfig } from '../config';
import type { Betta } from '../fish/Betta';
import { KOI_FIELD } from '../fish/koiWGSL';
import { CLOWN_FIELD, CLOWN_FISH } from '../fish/clownWGSL';
import type { KelpForest } from '../kelp/KelpForest';
import type { Reef } from '../reef/Reef';
import { FluidSim, SURFACE_ISO } from '../sim/FluidSim';
import { AERATION_N, FOAM_MAP_N } from '../sim/Foam';
import { TLAS_PARAM } from '../rt/rt';
import { TlasBinding } from '../rt/tlasBinding';
import { longestMarch } from '../app/quality/ladder.mjs';
import { BOWL_WATER, type BowlShape } from './bowl';
import { MarchBand } from './marchBand';
import { BOWL_HIT_ID_WGSL, envWGSL, globeHelpersWGSL, globeShadeWGSL } from './shaders';
import { studioLightInputs } from './studioLight';

/** Where the backdrop's soft glow lies (a direction from the camera): behind the globe, where
 *  it rests in the middle of the view. Shared by the backdrop, its map and the globe, so the
 *  glass bends what surrounds it. */
export const envGlow = uniform(new THREE.Vector3(0, -0.12, -1).normalize());

/** Wraps one of the solver's 2D maps (sand thickness, caustics) for sampling in TSL. */
function mapTexture(gpuTexture: GPUTexture, size: number): THREE.Texture {
  const tex = new THREE.ExternalTexture(gpuTexture);
  (tex as unknown as { image: object }).image = { width: size, height: size };
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  return tex;
}

/** Wraps a float texture the shader only reads texel by texel (textureLoad: no filtering, so
 *  three.js binds it unfilterable and with no sampler). */
export function texelTexture(gpuTexture: GPUTexture, depth = 0): THREE.Texture {
  const tex = new THREE.ExternalTexture(gpuTexture);
  if (depth > 0) (tex as unknown as { is3DTexture: boolean }).is3DTexture = true;
  (tex as unknown as { image: object }).image = { width: gpuTexture.width, height: gpuTexture.height, ...(depth > 0 ? { depth } : {}) };
  tex.type = THREE.FloatType;
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  return tex;
}

/** Wraps the solver's density texture so three.js can sample it as a texture_3d<f32>. */
function densityTexture(sim: FluidSim): THREE.Texture {
  const tex = new THREE.ExternalTexture(sim.densityTexture);
  const flags = tex as unknown as { is3DTexture: boolean };
  flags.is3DTexture = true;
  (tex as unknown as { image: object }).image = { width: sim.renderN, height: sim.renderN, depth: sim.renderN };
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  (tex as unknown as { wrapR: number }).wrapR = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  return tex;
}


/** Which globe shader is drawn: the plain one (and the koi's pass), the kelp globe's, the reef's,
 *  the sea foam globe's, the betta bowl's (bowl.ts: open at the mouth, with a rim and a lid). */
export type GlobeVariant = 'plain' | 'kelp' | 'reef' | 'foam' | 'bowl';

/** The layer the betta bowl's fish pass is drawn on (the camera sees it; the studio table's
 *  mirror, where the fish is a blur, does not). */
export const BOWL_KOI_LAYER = 1;

export class GlobeView {
  readonly mesh: THREE.Group;
  /** The plain globe's pass, the koi's (it redraws the pixels near the fish), and the kelp and
   *  reef globes' two each (their own variants, tracing the forest or the anemone: one ray a
   *  pixel, then one a sample where the first passed near an edge). */
  private readonly mainMesh: THREE.Mesh;
  private readonly koiMesh: THREE.Mesh;
  private readonly kelpMesh: THREE.Mesh;
  private readonly kelpAAMesh: THREE.Mesh;
  private readonly reefMesh: THREE.Mesh;
  private readonly reefAAMesh: THREE.Mesh;
  /** The sea foam globe's pass (the plain pass's, with its own water and its foam). */
  private readonly foamMesh: THREE.Mesh;
  /** The betta bowl's two (the plain pass's and the koi's, with the bowl's glass), where the page
   *  shows it: drawn on a sphere grown to take in the lid wherever it is (GlobeView.setBowlLid). */
  private readonly bowlMesh: THREE.Mesh | null = null;
  private readonly bowlKoiMesh: THREE.Mesh | null = null;
  private readonly uBowlLid = uniform(new THREE.Matrix4());
  /** x: the lid is there, y: its lamp's brightness. */
  private readonly uBowlState = uniform(new THREE.Vector4(1, 1, 0, 0));
  /** What floats in the bowl: its leaf and its bubble nest (bowlScape.ts scapeLife). */
  private readonly uBowlLife = uniform(new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
  /** The bowl's detail. x: the samples its lamp's haze takes, y: the steps a ray takes through its
   *  lid's glass (bowl.ts, as yet its own: 4 and 64 on a phone, 10 and 128 else); z: 0, where its
   *  shader starts the loops a compiler must not unroll (shaders.ts globesZero); w: spare. */
  private readonly uBowlDetail = uniform(new THREE.Vector4());
  /** The bowl's water (water/effects.ts, as water/look.ts eases it): x the bloom's dimming (per unit
   *  of path: bowl.ts BOWL_WATER), y the tannins' strength, z how faded the fish is, w its heater's
   *  lamp. */
  private readonly uBowlWater = uniform(new THREE.Vector4(0, 0, 0, 1));
  /** The betta's variety (fish/varieties.mjs varietyLook: its colour maps' gain, its sheen, its fins'
   *  band, its scales' coat): all 0, the photographs' own colours. */
  private readonly uBowlBetta = uniform(new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
  /** Where the bowl's passes write what each ray ended on (bowl.ids): where their next draws' pixels
   *  lie in the picture (x: k, a lattice's texels k pixels apart; yz: its phase's offset), and for a
   *  lattice the picture's size and its camera's projection (P00, P02, P11, P12; the lattice's own is
   *  offset by its phase). A size of 0: the target is the picture. (setBowlLattice.) */
  private readonly uBowlPixels = uniform(new THREE.Vector4(1, 0, 0, 0));
  private readonly uBowlPicture = uniform(new THREE.Vector2(0, 0));
  private readonly uBowlProj = uniform(new THREE.Vector4(1, 0, 1, 0));
  /** The size of what each draw draws into. (Not three's screenSize, which makes a new uniform each
   *  time a material is built: the bowl's is built for each render context - the frame's, the
   *  mirror's - and each build would then order its uniforms its own way, its own pipeline.) */
  private readonly drawnSize = new THREE.Vector2();
  private readonly uDrawn = uniform(new THREE.Vector2()).onObjectUpdate(({ renderer }) => {
    const target = renderer?.getRenderTarget();
    return target ? this.drawnSize.set(target.width, target.height) : renderer ? renderer.getDrawingBufferSize(this.drawnSize) : this.drawnSize;
  });
  /** MSAA is on and a pixel's rays can run one per sample (else one ray per pixel throughout). */
  private readonly perSample: boolean;
  private readonly uCenter = uniform(new THREE.Vector3());
  private readonly uRot = uniform(new THREE.Matrix3());
  // One pixel step in view-direction space.
  private readonly uAARight = uniform(new THREE.Vector3());
  private readonly uAAUp = uniform(new THREE.Vector3());

  /** x: water level at rest, y: scattering coefficient of the water (light shafts), z: angular
   *  size of a pixel, w: mote grid resolution. */
  readonly uLit = uniform(new THREE.Vector4());

  // On the desktop: globe space to wallpaper texture coordinates, and the desktop's plane.
  private readonly uDeskM = uniform(new THREE.Matrix4());
  private readonly uDeskPlane = uniform(new THREE.Vector4(0, 0, -1, -1e6));
  private readonly outerRadius: number;

  /** outside: what the glass bends. ocean: the app's backdrop map (OceanBackdrop); desktop: the
   *  wallpaper behind a globe on the desktop. */
  constructor(
    private readonly sim: FluidSim,
    globe: GlobeConfig,
    light: LightConfig,
    koiPose: GPUTexture,
    samplesPerPixel: number,
    outside: { ocean: THREE.Texture } | { desktop: THREE.Texture },
    kelp: KelpForest,
    reef: Reef,
    /** The clownfish's poses (a row each; their baked shapes are the sim's clownField). */
    clownPose: GPUTexture,
    /** How clear the reef globe's water is (catalog.ts clarity). */
    reefClarity = 1,
    /** The sea foam globe's water colour (catalog.ts waterColour). */
    foamColour: readonly number[] = [1, 1, 1],
    betta: Betta,
    /** The betta bowl's shape, where the page shows it (else it has no passes). */
    bowl: BowlShape | null = null,
    /** Its furnishings' BVH (render/scape/scapeBVH.mjs), read in the kelp's slot by its passes. */
    scapeTex: THREE.Texture | null = null,
  ) {
    const desktop = 'desktop' in outside ? outside.desktop : null;
    this.outerRadius = globe.outerRadius;
    this.uLit.value.set(sim.restLevel, light.shaftScatter, 0, sim.moteN);
    this.uBowlDetail.value.set(bowl?.lite ? 4 : 10, bowl?.lite ? 64 : 128, 0, 0);
    const tex = densityTexture(sim);
    const o = sim.origin;
    const vol = uniform(new THREE.Vector4(o[0], o[1], o[2], 1 / (2 * sim.halfSize)));
    // x: iso level, y: march step, z: normal stencil offset, w: inward probe for the medium at the glass
    const v = sim.renderVoxel;
    const prm = uniform(new THREE.Vector4(SURFACE_ISO, 0.6 * v, 1.75 * v, 2.0 * v));

    const sand = mapTexture(sim.sandTexture, sim.sandN);
    const caustics = mapTexture(sim.causticTexture, sim.causticN);
    const shafts = new THREE.ExternalTexture(sim.lightTexture);
    (shafts as unknown as { is3DTexture: boolean }).is3DTexture = true;
    (shafts as unknown as { image: object }).image = { width: sim.lightN, height: sim.lightN, depth: sim.lightN };
    shafts.minFilter = THREE.LinearFilter;
    shafts.magFilter = THREE.LinearFilter;
    shafts.wrapS = THREE.ClampToEdgeWrapping;
    shafts.wrapT = THREE.ClampToEdgeWrapping;
    (shafts as unknown as { wrapR: number }).wrapR = THREE.ClampToEdgeWrapping;
    shafts.generateMipmaps = false;
    const motes = new THREE.ExternalTexture(sim.moteTexture);
    (motes as unknown as { is3DTexture: boolean }).is3DTexture = true;
    (motes as unknown as { image: object }).image = { width: sim.moteN * (FluidSim.MOTE_K + 1), height: sim.moteN, depth: sim.moteN };
    motes.type = THREE.FloatType;
    motes.minFilter = THREE.NearestFilter;
    motes.magFilter = THREE.NearestFilter;
    motes.generateMipmaps = false;
    const pose = new THREE.ExternalTexture(koiPose);
    (pose as unknown as { image: object }).image = { width: koiPose.width, height: 1 };
    pose.type = THREE.FloatType;
    pose.minFilter = THREE.NearestFilter;
    pose.magFilter = THREE.NearestFilter;
    pose.generateMipmaps = false;
    const field = new THREE.ExternalTexture(sim.koiField);
    (field as unknown as { is3DTexture: boolean }).is3DTexture = true;
    (field as unknown as { image: object }).image = { width: KOI_FIELD[0], height: KOI_FIELD[1], depth: KOI_FIELD[2] };
    field.minFilter = THREE.LinearFilter;
    field.magFilter = THREE.LinearFilter;
    field.wrapS = THREE.ClampToEdgeWrapping;
    field.wrapT = THREE.ClampToEdgeWrapping;
    (field as unknown as { wrapR: number }).wrapR = THREE.ClampToEdgeWrapping;
    field.generateMipmaps = false;
    // (Linearly filtered, as three.js binds no sampler for a nearest-filtered texture.)
    const bg = 'desktop' in outside ? outside.desktop : outside.ocean;
    // On the ray tracing hardware (where the device has it: sim.rt), the shader traces the
    // simulation's scene, its top level bound through a stand-in texture.
    const rt = sim.rt;
    rt?.setMarch(prm.value.y);
    this.setMarchStep = (voxels) => {
      prm.value.y = voxels * v;
      rt?.setMarch(prm.value.y);
    };
    // (The bowl's water: where a phone's march, and the sim's photons, can find nothing, worked out
    // each frame in the sim's: on a phone for the longest step its quality levels take, so it
    // holds at each, app/quality/ladder.mjs.)
    const marchBand = bowl ? new MarchBand(sim, globe.innerRadius, globe.capillaryLength, SURFACE_ISO, bowl.lite ? longestMarch() * v : prm.value.y) : null;
    const band = bowl?.lite && marchBand ? { kelpRefTex: texture(texelTexture(marchBand.texture)) } : {};
    const tlas = rt ? new TlasBinding(sim.device, rt.tlas) : null;
    // Two passes over the same sphere. The main one has no koi code at all, so it stays lean;
    // it notes the pixels where any ray comes near the fish, in the depth buffer (1 there, 0
    // elsewhere). The koi pass traces the fish too, and its depth test (less, so the GPU can
    // reject whole tiles before shading) lets it run only on those pixels, which it redraws.
    const inputs = {
      camPos: cameraPosition,
      fragPos: positionWorld,
      fragCenter: positionWorld,
      center: this.uCenter,
      rot: this.uRot,
      vol,
      prm,
      aaRight: this.uAARight,
      aaUp: this.uAAUp,
      densTex: texture3D(tex),
      densSamp: texture3D(tex),
      sandTex: texture(sand),
      sandSamp: texture(sand),
      causticTex: texture(caustics),
      causticSamp: texture(caustics),
      poseTex: texture(pose),
      bettaTex: texture(betta.texture),
      bettaAtlas: texture(betta.atlas),
      bettaSamp: texture(betta.atlas),
      lit: this.uLit,
      lightTex: texture3D(shafts),
      lightSamp: texture3D(shafts),
      moteTex: texture3D(motes),
      fieldTex: texture3D(field),
      fieldSamp: texture3D(field),
      bgTex: texture(bg),
      bgSamp: texture(bg),
      deskM: this.uDeskM,
      deskPlane: this.uDeskPlane,
      glow: envGlow,
      kelpCellTex: texture3D(texelTexture(kelp.cellTexture, kelp.cellTexture.depthOrArrayLayers)),
      kelpRefTex: texture(texelTexture(kelp.refTexture)),
      kelpPrimTex: texture(texelTexture(kelp.primTexture)),
      // Every globe's splash (Splash.ts): its bubbles and spray, its drops on the glass.
      splashTex: texture3D(texelTexture(sim.splash.grid, sim.splash.grid.depthOrArrayLayers)),
      dropTex: texture(texelTexture(sim.splash.drops)),
      ...(tlas ? { [TLAS_PARAM]: texture3D(tlas.texture) } : {}),
    };
    const samplePos = varying(positionWorld, 'v_samplePos').setInterpolation(
      THREE.InterpolationSamplingType.PERSPECTIVE,
      THREE.InterpolationSamplingMode.SAMPLE,
    );
    const perSample = samplesPerPixel >= 4;
    const koiInputs = perSample ? { ...inputs, fragPos: samplePos } : inputs;
    // (The reef's passes find its anemone's grid where the kelp's passes find the forest's, and its
    // clownfish where the koi's passes find the koi.)
    const clownTex = new THREE.ExternalTexture(clownPose);
    (clownTex as unknown as { image: object }).image = { width: clownPose.width, height: CLOWN_FISH };
    clownTex.type = THREE.FloatType;
    clownTex.minFilter = THREE.NearestFilter;
    clownTex.magFilter = THREE.NearestFilter;
    clownTex.generateMipmaps = false;
    const clownField = new THREE.ExternalTexture(sim.clownField);
    (clownField as unknown as { is3DTexture: boolean }).is3DTexture = true;
    (clownField as unknown as { image: object }).image = { width: CLOWN_FIELD[0], height: CLOWN_FIELD[1], depth: CLOWN_FIELD[2] * CLOWN_FISH };
    clownField.minFilter = THREE.LinearFilter;
    clownField.magFilter = THREE.LinearFilter;
    clownField.wrapS = THREE.ClampToEdgeWrapping;
    clownField.wrapT = THREE.ClampToEdgeWrapping;
    (clownField as unknown as { wrapR: number }).wrapR = THREE.ClampToEdgeWrapping;
    clownField.generateMipmaps = false;
    const reefGrid = {
      kelpCellTex: texture3D(texelTexture(reef.cellTexture, reef.cellTexture.depthOrArrayLayers)),
      kelpRefTex: texture(texelTexture(reef.refTexture)),
      kelpPrimTex: texture(texelTexture(reef.primTexture)),
      poseTex: texture(clownTex),
      fieldTex: texture3D(clownField),
      fieldSamp: texture3D(clownField),
    };
    // The sea foam globe's foam map and bubbles (Foam.ts).
    const ww = sim.whitewater;
    const foamMap = new THREE.ExternalTexture(ww.map);
    (foamMap as unknown as { image: object }).image = { width: FOAM_MAP_N, height: FOAM_MAP_N };
    foamMap.minFilter = THREE.LinearMipmapLinearFilter;
    foamMap.magFilter = THREE.LinearFilter;
    foamMap.wrapS = THREE.ClampToEdgeWrapping;
    foamMap.wrapT = THREE.ClampToEdgeWrapping;
    foamMap.anisotropy = 16;
    foamMap.generateMipmaps = false;
    const aeration = new THREE.ExternalTexture(ww.aeration);
    (aeration as unknown as { is3DTexture: boolean }).is3DTexture = true;
    (aeration as unknown as { image: object }).image = { width: AERATION_N, height: AERATION_N, depth: AERATION_N };
    aeration.minFilter = THREE.LinearFilter;
    aeration.magFilter = THREE.LinearFilter;
    aeration.wrapS = THREE.ClampToEdgeWrapping;
    aeration.wrapT = THREE.ClampToEdgeWrapping;
    (aeration as unknown as { wrapR: number }).wrapR = THREE.ClampToEdgeWrapping;
    aeration.generateMipmaps = false;
    const foamInputs = {
      foamTex: texture(foamMap),
      foamSamp: texture(foamMap),
      aerTex: texture3D(aeration),
      aerSamp: texture3D(aeration),
      foamPart: texture(texelTexture(ww.particles)),
      foamBins: texture(texelTexture(ww.binTex)),
    };
    const onDesktop = desktop !== null;
    // (The betta bowl's passes, where the interleave may draw them (bowl.ids): what each ray ended
    // on, read after its trace, for the colour's alpha, 1 + its code; bowlRender.ts.)
    const hitId = bowl?.ids ? wgslFn(BOWL_HIT_ID_WGSL) : null;
    // (There each ray is worked out from its pixel of the picture and the camera's matrices, not
    // from the sphere's surface where it is drawn: so a ray traced on the lattice is the very ray the
    // whole picture traces at that pixel, to the bit, and at rest the two pictures are the same.)
    const pixelRay = bowl?.ids
      ? wgslFn(`fn globes_pixelRay(frag: vec2f, pixels: vec4f, picture: vec2f, drawn: vec2f, proj: mat4x4f, lattice: vec4f, camWorld: mat4x4f, camPos: vec3f) -> vec3f {
  let onLattice = picture.x > 0.5;
  let size = select(drawn, picture, onLattice);
  let px = frag * pixels.x + pixels.yz;
  let ndc = vec2f(px.x / size.x * 2.0 - 1.0, 1.0 - px.y / size.y * 2.0);
  let p = select(vec4f(proj[0].x, proj[2].x, proj[1].y, proj[2].y), lattice, onLattice);
  return camPos + (camWorld * vec4f((ndc.x + p.y) / p.x, (ndc.y + p.w) / p.z, -1.0, 0.0)).xyz;
}`)({ frag: screenCoordinate, pixels: this.uBowlPixels, picture: this.uBowlPicture, drawn: this.uDrawn, proj: cameraProjectionMatrix, lattice: this.uBowlProj, camWorld: cameraWorldMatrix, camPos: cameraPosition })
      : null;
    // pass: 'main' (the plain globe; marks pixels for the koi pass), 'koi' (redraws them, per
    // sample, with the fish), 'kelp' (the kelp globe: one ray per pixel; marks the pixels near an
    // edge) and 'kelpAA' (redraws those, one ray per MSAA sample, so edges are smoothed only
    // where there are any); 'reef' and 'reefAA' likewise for the reef globe.
    // 'foam': the sea foam globe (the plain pass's, with its water and its foam).
    // hardware: trace with the ray tracing hardware (where the device has it).
    // 'bowl' and 'bowlKoi': the betta bowl's, as 'main' and 'koi' with the bowl's glass.
    type Pass = 'main' | 'koi' | 'kelp' | 'kelpAA' | 'reef' | 'reefAA' | 'foam' | 'bowl' | 'bowlKoi';
    const makeMaterial = (pass: Pass, hardware = rt !== null): THREE.MeshBasicNodeMaterial => {
      const withKoi = pass === 'koi' || pass === 'bowlKoi';
      const withKelp = pass === 'kelp' || pass === 'kelpAA';
      const withReef = pass === 'reef' || pass === 'reefAA';
      const withClown = pass === 'reefAA';
      const foam = pass === 'foam' ? { colour: foamColour, ...ww.look } : null;
      const withBowl = pass === 'bowl' || pass === 'bowlKoi';
      // (The plain and sea foam passes, with MSAA: one ray an invocation, run once per sample, as
      // the redrawing passes are. One of a pixel's samples gathers the water's light for all, in
      // the koi's pass as in the plain one: a pixel the koi's pass draws in part gathers it once.)
      const perSampleWater = perSample && (pass === 'main' || pass === 'foam' || pass === 'bowl');
      const oneGather = perSampleWater || (perSample && withKoi);
      const shade = wgslFn(globeShadeWGSL(hardware, foam !== null, oneGather, withBowl), [wgsl(envWGSL(light)), wgsl(globeHelpersWGSL(globe, light, withKoi, onDesktop, withKelp, withReef, withReef ? reefClarity : 1, withClown, hardware, foam, withBowl ? bowl : null))]);
      const m = new THREE.MeshBasicNodeMaterial();
      // (The bowl's passes draw its sphere's far side: the rays are traced from the camera all the
      // same, and so it is drawn when its sphere dips below the table and the table's mirror clips
      // the near side, or the camera is inside it as the lid is carried off.)
      if (withBowl) m.side = THREE.BackSide;
      const redraw = pass === 'koi' || pass === 'kelpAA' || pass === 'reefAA' || pass === 'bowlKoi';
      const edges = pass === 'kelp' || pass === 'reef';
      let passInputs = redraw || perSampleWater ? koiInputs : inputs;
      if (withReef) passInputs = { ...passInputs, ...reefGrid };
      if (foam) passInputs = { ...passInputs, ...foamInputs };
      if (withBowl) passInputs = Object.assign({}, passInputs, { bowlLid: this.uBowlLid, bowlState: this.uBowlState, bowlLife: this.uBowlLife, bowlDetail: this.uBowlDetail, bowlWater: this.uBowlWater, bowlBetta: this.uBowlBetta }, studioLightInputs, scapeTex ? { kelpPrimTex: texture(scapeTex) } : {}, band, pixelRay ? { fragPos: pixelRay } : {});
      if (!hardware) passInputs = Object.fromEntries(Object.entries(passInputs).filter(([k]) => k !== TLAS_PARAM)) as typeof passInputs;
      // (One variable: the depth and the colour both read the same trace.) Its w carries the
      // pixel's coverage, plus 2 where the second pass must redraw it.
      const traced = (shade(passInputs) as unknown as ReturnType<typeof vec4>).toVar('globesTraced');
      const marked = traced.w.greaterThan(1.5);
      const alpha = traced.w.sub(select(marked, float(2.0), float(0.0)));
      m.colorNode = vec4(traced.xyz, onDesktop ? alpha : withBowl && hitId ? float(1.0).add(hitId({ traced }) as unknown as ReturnType<typeof float>) : 1.0) as unknown as typeof m.colorNode;
      // (Written as it is: an opaque material's alpha would be made 1.)
      if (withBowl && hitId) m.blending = THREE.NoBlending;
      if (pass === 'main' || pass === 'bowl' || edges) m.depthNode = select(marked, float(1.0), float(0.0)) as unknown as typeof m.depthNode;
      // (The bowl's: a ray that meets none of it leaves the pixel to the backdrop.)
      if (withBowl) m.maskNode = traced.w.greaterThan(-0.5) as unknown as typeof m.maskNode;
      if (redraw) {
        m.depthFunc = THREE.LessDepth;
        m.depthWrite = false;
      }
      // (The bowl's main pass writes its mark wherever it draws, over a depth cleared to 0
      // (main.ts), so the fish's pass runs only where it marked, not also where its rays met
      // nothing and it drew nothing.)
      if (pass === 'bowl') m.depthFunc = THREE.AlwaysDepth;
      if (onDesktop) {
        // Clear around the globe: the colour is already weighted by coverage, written as is.
        m.transparent = true;
        m.blending = THREE.NoBlending;
      }
      return m;
    };

    // Slightly larger than the glass so the analytic sphere is never clipped by tessellation.
    const geometry = new THREE.SphereGeometry(globe.outerRadius * 1.012, 128, 96);
    this.mesh = new THREE.Group();
    this.mainMesh = new THREE.Mesh(geometry, makeMaterial('main'));
    this.koiMesh = new THREE.Mesh(geometry, makeMaterial('koi'));
    this.kelpMesh = new THREE.Mesh(geometry, makeMaterial('kelp'));
    this.kelpAAMesh = new THREE.Mesh(geometry, makeMaterial('kelpAA'));
    this.reefMesh = new THREE.Mesh(geometry, makeMaterial('reef'));
    this.reefAAMesh = new THREE.Mesh(geometry, makeMaterial('reefAA'));
    this.foamMesh = new THREE.Mesh(geometry, makeMaterial('foam'));
    for (const m of [this.mainMesh, this.koiMesh, this.kelpMesh, this.kelpAAMesh, this.reefMesh, this.reefAAMesh, this.foamMesh]) m.frustumCulled = false;
    this.koiMesh.renderOrder = 1;
    this.kelpAAMesh.renderOrder = 1;
    this.reefAAMesh.renderOrder = 1;
    this.perSample = perSample;
    this.mesh.add(this.mainMesh, this.koiMesh, this.kelpMesh, this.kelpAAMesh, this.reefMesh, this.reefAAMesh, this.foamMesh);
    const passes: [THREE.Mesh, Pass][] = [[this.mainMesh, 'main'], [this.koiMesh, 'koi'], [this.kelpMesh, 'kelp'], [this.kelpAAMesh, 'kelpAA'], [this.reefMesh, 'reef'], [this.reefAAMesh, 'reefAA'], [this.foamMesh, 'foam']];
    if (bowl) {
      // (A unit sphere, scaled to the lid's reach each frame. Coarse: the rays are traced from the
      // camera, so it need only take in the bowl, and its faces lie within 0.2% of its radius, well
      // inside the margin it is scaled up by.)
      const reach = new THREE.SphereGeometry(1, 64, 48);
      this.bowlMesh = new THREE.Mesh(reach, makeMaterial('bowl'));
      this.bowlKoiMesh = new THREE.Mesh(reach, makeMaterial('bowlKoi'));
      this.bowlMesh.frustumCulled = false;
      this.bowlKoiMesh.frustumCulled = false;
      this.bowlKoiMesh.renderOrder = 1;
      // (On a layer of its own: the table's mirror leaves the fish's own pass out, StudioBackdrop.)
      this.bowlKoiMesh.layers.set(BOWL_KOI_LAYER);
      this.mesh.add(this.bowlMesh, this.bowlKoiMesh);
      passes.push([this.bowlMesh, 'bowl'], [this.bowlKoiMesh, 'bowlKoi']);
      this.bowlReach = globe.outerRadius * 1.012;
      this.bowlMesh.scale.setScalar(this.bowlReach);
      this.bowlKoiMesh.scale.setScalar(this.bowlReach);
    }
    this.setVariant('plain');
    if (rt) {
      // Each pass's software twin, drawn while the water churns (RtScene.tracing).
      this.tracers = {
        meshes: passes.map(([mesh]) => mesh),
        hardware: passes.map(([mesh]) => mesh.material as THREE.Material),
        software: passes.map(([, pass]) => makeMaterial(pass, false)),
        drawn: true,
      };
      if (import.meta.env.DEV) {
        this.setHardwareTracing = (on) => {
          this.allowHardware = on;
          this.chooseTracers();
        };
      }
    }
  }

  /** Where the device traces in hardware: each pass's materials, tracing in hardware and in
   *  software, and which of them are drawn. */
  private readonly tracers: { meshes: THREE.Mesh[]; hardware: THREE.Material[]; software: THREE.Material[]; drawn: boolean } | null = null;
  private allowHardware = true;

  /** Dev, where the device has hardware ray tracing: draws with it (true: while the water does
   *  not churn, as normal) or with the software tracer only (false), to compare the two on the
   *  same frame. */
  setHardwareTracing: ((on: boolean) => void) | null = null;

  /** Draws the passes with their hardware tracers while the sim builds its regions (until the
   *  software ones are ready to switch to, always), else with their software ones. */
  private chooseTracers(): void {
    const t = this.tracers;
    if (!t) return;
    const rt = this.sim.rt!;
    const hardware = this.allowHardware && (rt.current || !rt.canSwitch);
    if (hardware === t.drawn) return;
    t.drawn = hardware;
    t.meshes.forEach((mesh, i) => (mesh.material = hardware ? t.hardware[i] : t.software[i]));
  }

  /** Draws the kelp globe (its passes), the reef globe (its passes), the sea foam globe (its pass),
   *  the betta bowl (its two) or the others (the plain pass, and the koi's). */
  setVariant(v: GlobeVariant): void {
    this.foamMesh.visible = v === 'foam';
    this.kelpMesh.visible = v === 'kelp';
    this.kelpAAMesh.visible = v === 'kelp' && this.perSample;
    this.reefMesh.visible = v === 'reef';
    // (Always: it draws the clownfish, whose pixels the first pass marks.)
    this.reefAAMesh.visible = v === 'reef';
    this.mainMesh.visible = v === 'plain';
    this.koiMesh.visible = v === 'plain';
    if (this.bowlMesh) this.bowlMesh.visible = v === 'bowl';
    if (this.bowlKoiMesh) this.bowlKoiMesh.visible = v === 'bowl';
  }

  /** The betta bowl's lid: where it is (the globe's translating frame to the lid's), whether it is
   *  in sight, how far from the globe's centre it reaches (its passes' sphere takes it in) and how
   *  bright its lamp is. */
  setBowlLid(toLid: THREE.Matrix4, shown: boolean, reach: number, lamp = 1): void {
    this.uBowlLid.value.copy(toLid);
    this.uBowlState.value.x = shown ? 1 : 0;
    this.uBowlState.value.y = lamp;
    const r = Math.max(this.outerRadius * 1.012, shown ? reach * 1.01 : 0);
    if (r !== this.bowlReach) {
      this.bowlReach = r;
      this.bowlMesh?.scale.setScalar(r);
      this.bowlKoiMesh?.scale.setScalar(r);
    }
  }

  private bowlReach = 1;

  /** The betta bowl's two passes, drawn again by bowlRender.ts into targets of its own; null where
   *  the page has no bowl. */
  get bowlPasses(): { bowl: THREE.Mesh; koi: THREE.Mesh } | null {
    return this.bowlMesh && this.bowlKoiMesh ? { bowl: this.bowlMesh, koi: this.bowlKoiMesh } : null;
  }

  /** bowlRender.ts: the bowl's next draws trace a lattice of the picture (size), its texels k pixels
   *  apart from (ox, oy) on, for `camera` (whose own projection the lattice's camera offsets); or,
   *  without a camera, the picture itself again. */
  setBowlLattice(k = 1, ox = 0, oy = 0, size?: THREE.Vector2, camera?: THREE.PerspectiveCamera): void {
    this.uBowlPixels.value.set(k, ox, oy, 0);
    if (size && camera) {
      const e = camera.projectionMatrix.elements;
      this.uBowlPicture.value.copy(size);
      this.uBowlProj.value.set(e[0], e[8], e[5], e[9]);
    } else {
      this.uBowlPicture.value.set(0, 0);
    }
  }

  /** The bowl's detail (uBowlDetail): the samples its lamp's haze takes, the steps a ray takes
   *  through its lid's glass. */
  setBowlDetail({ lampSamples, lidSteps }: { lampSamples: number; lidSteps: number }): void {
    this.uBowlDetail.value.x = lampSamples;
    this.uBowlDetail.value.y = lidSteps;
  }

  /** The water march's step, in voxels of the density map (0.6; a phone's quality level may take
   *  longer ones, app/quality/ladder.mjs). */
  readonly setMarchStep: (voxels: number) => void;

  /** What floats in the betta bowl (interaction/BowlLife.ts: its leaf and its nest). */
  setBowlLife(life: THREE.Matrix4): void {
    this.uBowlLife.value.copy(life);
  }

  /** The betta bowl's water (uBowlWater): how cloudy and how tea-brown it is, how faded the fish
   *  (each 0..1), and how bright the heater's lamp. */
  setBowlWater(cloud: number, tint: number, pale: number, heaterLamp: number): void {
    this.uBowlWater.value.set(BOWL_WATER.bloom * cloud, tint ** BOWL_WATER.tintPower, pale, heaterLamp);
  }

  /** The betta's variety (uBowlBetta): varieties.mjs varietyLook's numbers, a mat4's columns. */
  setBettaLook(look: ArrayLike<number>): void {
    this.uBowlBetta.value.fromArray(look);
  }

  /** Builds pipelines ahead of time (their shaders are large), so no switch stalls: every
   *  globe's the page shows (variants; the app opens on whichever was shown last), and where the
   *  device traces in hardware, every pass's software twin (only then may the renderer switch to
   *  them). */
  async precompile(renderer: THREE.WebGPURenderer, camera: THREE.Camera, scene: THREE.Scene, variants: readonly GlobeVariant[]): Promise<void> {
    const t = this.tracers;
    const meshes: Record<GlobeVariant, (THREE.Mesh | null)[]> = {
      plain: [this.mainMesh, this.koiMesh],
      kelp: [this.kelpMesh, this.kelpAAMesh],
      reef: [this.reefMesh, this.reefAAMesh],
      foam: [this.foamMesh],
      bowl: [this.bowlMesh, this.bowlKoiMesh],
    };
    const wanted = new Set(variants.flatMap((v) => meshes[v]).filter((m) => m !== null));
    const jobs = [...wanted].map((mesh): [THREE.Mesh, THREE.Material] => [mesh, mesh.material as THREE.Material]);
    t?.meshes.forEach((mesh, i) => {
      if (wanted.has(mesh)) jobs.push([mesh, t.software[i]]);
    });
    // (All at once: the device builds them side by side, not each after the last. compileAsync
    // takes the mesh's material and visibility before it first waits, so they go back at once.
    // Side by side, the error scopes three holds open over them close out of turn: a failed
    // pipeline may be told another's error, as among the several one compileAsync builds already.
    // The sim's own scope is closed before these open: main.ts.)
    const done = jobs.map(([mesh, material]) => {
      const shown = mesh.visible;
      const drawn = mesh.material;
      mesh.visible = true;
      mesh.material = material;
      const compiled = renderer.compileAsync(mesh, camera, scene);
      mesh.visible = shown;
      mesh.material = drawn;
      return compiled;
    });
    await Promise.all(done);
    if (t) this.sim.rt!.canSwitch = true;
  }

  /** On the desktop: where the desktop is (see globes_bg). */
  setDesktopView(toTexture: THREE.Matrix4, plane: THREE.Vector4): void {
    this.uDeskM.value.copy(toTexture);
    this.uDeskPlane.value.copy(plane);
  }

  update(center: THREE.Vector3, rotation: THREE.Matrix3, camera: THREE.PerspectiveCamera, heightPx: number): void {
    this.uCenter.value.copy(center);
    this.uRot.value.copy(rotation);
    this.mesh.position.copy(center);
    // Angular size of one pixel, along the camera's right and up axes.
    const pixel = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) / Math.max(1, heightPx);
    this.uAARight.value.setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(pixel);
    this.uAAUp.value.setFromMatrixColumn(camera.matrixWorld, 1).multiplyScalar(pixel);
    this.uLit.value.z = pixel;
    this.uLit.value.x = this.sim.restLevel; // (it changes with the globe's water)
    // (A ray's path: to the globe, through it, and through it again after a turn at the surface.)
    this.sim.rt?.setView(pixel, camera.position.distanceTo(center) + 5 * this.outerRadius);
    this.chooseTracers();
  }
}
