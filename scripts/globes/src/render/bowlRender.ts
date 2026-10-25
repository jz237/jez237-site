// The betta bowl drawn into targets of its own (phones; ?up), so it can be traced on fewer rays than
// the picture has pixels and made whole again before it goes into the frame.
//
// ?up=2 (phones' default): each frame the bowl is traced on a 2x2 lattice, a quarter of the
// picture's pixels (its camera's view offset by a phase, so each texel's ray goes through one
// pixel's centre), the fish's pass skipped there; a change test marks the blocks whose new sample
// differs from its last; the resolve makes the picture at full size (bowlResolve.mjs), marking in
// its depth where the fish is near; and the fish's pass draws those pixels again at full size, as
// the page has always drawn it. A composite on the sphere's outline puts the picture in the frame,
// after the table. ?up=1: the bowl in a target of its own at the picture's size (the same picture;
// with ?upin=0.5-1, traced at that share of it and filled in by EASU). ?up=0: drawn straight into
// the frame, as before (desktops' default).
//
// The bowl's two large pipelines are built once each: every target the bowl is drawn into (the
// lattice, the picture, the table's mirror, the frame) has the same configuration (half floats, the
// working colour space, no multisampling on phones, a depth buffer), which is what three keys its
// pipelines on, besides the material. The table's mirror still traces the bowl itself (its pass on
// a layer only the mirror's camera sees), at the mirror's own sharpness.
//
// For the ladder (the PHONE scaler, app/adaptiveScale.mjs): the picture is the drawing buffer, so
// the pixel ratio it picks is the picture's sharpness; setMode picks how it is drawn; tracedShare()
// is how many rays a pixel of it costs (a quarter for 2x2, plus the fish's).

import * as THREE from 'three/webgpu';
import { float, screenCoordinate, select, texture, uniform, vec4, wgslFn } from 'three/tsl';
import type { BenchRow } from '../app/bench';
import type { BowlLid } from '../interaction/BowlLid';
import { changedFrames, CHANGE_TAU, latticeSize, PHASES, Schedule, viewOffset, WIDE_CHANGE } from './bowlResolve.mjs';
import { COMPOSITE_WGSL, flagsWGSL, resolveWGSL, type UpDebug } from './bowlResolveWGSL';
import { BOWL_KOI_LAYER, type GlobeView } from './GlobeView';
import type { StudioBackdrop } from './StudioBackdrop';

/** How the bowl is drawn: 0 straight into the frame; 1 in a target of its own, traced at `internal`
 *  times the picture's size (1: the same picture); 2 on a 2x2 lattice a frame, resolved. fishFull:
 *  the fish is drawn again at the picture's full size each frame (else on the lattice with the rest:
 *  filled in, as anything that moves is). */
export interface UpSettings {
  mode: 0 | 1 | 2;
  internal: number;
  fishFull: boolean;
}

/** From the URL: ?up=0|1|2 (phones 2, else 0), ?upin=0.5-1 (?up=1's internal share), ?fishfull=0|1. */
export function upSettings(params: URLSearchParams, phone: boolean): UpSettings {
  const mode = Number(params.get('up') ?? (phone ? 2 : 0));
  return {
    mode: mode === 1 || mode === 2 ? mode : 0,
    internal: Math.min(Math.max(Number(params.get('upin') ?? 1) || 1, 0.25), 1),
    fishFull: params.get('fishfull') !== '0',
  };
}

/** ?updebug=id|age|changed|nan (bowlResolveWGSL.ts UpDebug). */
export function upDebug(v: string | null): UpDebug {
  return v === 'id' || v === 'age' || v === 'changed' || v === 'nan' ? v : 0;
}

/** The layers: the bowl's own pass in the main scene, for the table's mirror alone (its camera sees
 *  it, the main camera does not); the composite, for the main camera alone; the resolve, in the
 *  bowl's scene. (BOWL_KOI_LAYER is 1.) */
const MIRROR_LAYER = 2;
const COMPOSITE_LAYER = 3;
const RESOLVE_LAYER = 4;

/** A frame whose view moved the bowl's picture by less than this (pixels, at most) is still: the
 *  samples traced before it are kept. (The bowl settling after a roll, or the camera after a zoom,
 *  comes to rest slowly, never quite still.) */
const STILL_PX = 0.01;
/** A gap between frames longer than this (ms: the page hidden, a stall) keeps nothing. */
const STALL_MS = 250;

/** A target the bowl's passes draw into: as the frame buffer's and the table's mirror's are. */
function bowlTarget(): THREE.RenderTarget {
  const rt = new THREE.RenderTarget(1, 1, { type: THREE.HalfFloatType });
  rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
  return rt;
}

export class BowlRender {
  private settings: UpSettings;
  private readonly debug: UpDebug;
  /** As the page started (what ?bench's rows go back to). */
  private readonly start: UpSettings;
  private readonly passes: { bowl: THREE.Mesh; koi: THREE.Mesh };
  /** The bowl's scene: its two passes again (sharing their materials and geometry), drawn by the
   *  lattice's camera, and the resolve, drawn with the fish's pass by the picture's. */
  private readonly scene = new THREE.Scene();
  private readonly lattice: THREE.Mesh;
  private readonly latticeKoi: THREE.Mesh;
  private readonly resolve: THREE.Mesh;
  /** In the main scene: the picture put in the frame. */
  private readonly composite: THREE.Mesh;
  private readonly latticeCam = new THREE.PerspectiveCamera();
  private readonly pictureCam = new THREE.PerspectiveCamera();
  /** Each phase's last lattice (PHASES' order), and the one the next is traced into (then swapped
   *  with its phase's); the changed counters, a frame's and the last's; the picture. */
  private readonly phaseTargets = PHASES[2].map(() => bowlTarget());
  private spare = bowlTarget();
  // (The counters' targets have a depth buffer they never use: three's compileAsync builds a pass's
  // pipeline for the renderer's depth setting, not its target's, and a target without one would
  // have its pass built again as the first frame draws.)
  private readonly flagTargets = [bowlTarget(), bowlTarget()];
  private readonly picture = bowlTarget();
  private readonly schedule = new Schedule(2);
  private flagAt = 0;
  // The passes' inputs.
  private readonly latTex = this.phaseTargets.map((t) => texture(t.texture));
  private readonly latCurTex = texture(this.spare.texture);
  private readonly flagsTex = texture(this.flagTargets[0].texture);
  private readonly nowTex = texture(this.spare.texture);
  private readonly beforeTex = texture(this.phaseTargets[0].texture);
  private readonly lastTex = texture(this.flagTargets[1].texture);
  private readonly pictureTex = texture(this.picture.texture);
  private readonly uPhase = uniform(new THREE.Vector4());
  private readonly uValid = uniform(new THREE.Vector4());
  private readonly uAge = uniform(new THREE.Vector4());
  private readonly uMap = uniform(new THREE.Vector4());
  private readonly uFlags = uniform(new THREE.Vector4());
  /** The change test's pass: a square over its whole target. (Not three's QuadMesh, whose render()
   *  swaps in a vertex shader of its own, which compileAsync could not build ahead.) */
  private readonly flagsQuad: THREE.Mesh;
  private readonly flatCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  /** The change test's threshold, and how much change round a pixel has its sample filled in
   *  (?uptau, ?upwide: for tuning). */
  private readonly tau: number;
  private readonly wide: number;

  private readonly size = new THREE.Vector2();
  private readonly fitted = new THREE.Vector2();
  private fittedMode = -1;
  private fittedInternal = 0;
  private layersMode = -1;
  /** This frame: drawn here at all; its phase (2x2), and whether that phase's last samples may be
   *  compared with its new ones; whether its view moved; whether it and the last were both still
   *  (only then is anything traced before it kept). */
  private drawing = false;
  private phase = 0;
  private oldValid = false;
  private moving = true;
  private steady = false;
  private wasStill = false;
  private readonly clearColor = new THREE.Color();
  /** The view a frame ago (what moves the bowl's picture). */
  private readonly before = { cam: new Float64Array(16), proj: new Float64Array(16), center: new THREE.Vector3(), rot: new Float64Array(9), lid: new Float64Array(16), lidState: [NaN, NaN], at: false };

  constructor(
    private readonly globe: GlobeView,
    studio: StudioBackdrop,
    camera: THREE.PerspectiveCamera,
    mainScene: THREE.Scene,
    settings: UpSettings,
    { debug = 0, tau = CHANGE_TAU, wide = WIDE_CHANGE }: { debug?: UpDebug; tau?: number; wide?: number } = {},
  ) {
    this.settings = { ...settings };
    this.start = { ...settings };
    this.debug = debug;
    this.tau = tau;
    this.wide = wide;
    this.passes = globe.bowlPasses!;
    const { bowl, koi } = this.passes;
    this.lattice = new THREE.Mesh(bowl.geometry, bowl.material);
    this.latticeKoi = new THREE.Mesh(koi.geometry, koi.material);
    this.latticeKoi.layers.set(BOWL_KOI_LAYER);
    this.latticeKoi.renderOrder = 1;

    const resolveFn = wgslFn(resolveWGSL(2, debug));
    const resolved = resolveFn({ frag: screenCoordinate, lat0: this.latTex[0], lat1: this.latTex[1], lat2: this.latTex[2], lat3: this.latTex[3], latCur: this.latCurTex, flags: this.flagsTex, phase: this.uPhase, valid: this.uValid, age: this.uAge, map: this.uMap }) as unknown as ReturnType<typeof vec4>;
    const r = resolved.toVar('bowlUpResolved');
    const rm = new THREE.MeshBasicNodeMaterial();
    rm.side = THREE.BackSide;
    rm.colorNode = r as unknown as typeof rm.colorNode;
    // (Its code in the alpha, written as it is; its depth 1 where the fish's pass draws it again.)
    rm.blending = THREE.NoBlending;
    rm.depthNode = select(r.w.greaterThan(1023.5), float(1.0), float(0.0)) as unknown as typeof rm.depthNode;
    rm.depthFunc = THREE.AlwaysDepth;
    this.resolve = new THREE.Mesh(bowl.geometry, rm);
    this.resolve.layers.set(RESOLVE_LAYER);

    const flagsFn = wgslFn(flagsWGSL());
    const fm = new THREE.NodeMaterial();
    fm.depthTest = false;
    fm.depthWrite = false;
    fm.fragmentNode = flagsFn({ frag: screenCoordinate, now: this.nowTex, before: this.beforeTex, last: this.lastTex, up: this.uFlags }) as unknown as typeof fm.fragmentNode;
    this.flagsQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fm);
    this.flatCam.position.z = 0.5;

    const compositeFn = wgslFn(COMPOSITE_WGSL);
    const c = (compositeFn({ frag: screenCoordinate, picture: this.pictureTex }) as unknown as ReturnType<typeof vec4>).toVar('bowlUpPicture');
    const cm = new THREE.MeshBasicNodeMaterial();
    cm.side = THREE.BackSide;
    cm.colorNode = vec4(c.xyz, 1.0) as unknown as typeof cm.colorNode;
    cm.maskNode = c.w.greaterThan(0.5) as unknown as typeof cm.maskNode;
    cm.depthTest = false;
    cm.depthWrite = false;
    this.composite = new THREE.Mesh(bowl.geometry, cm);
    this.composite.layers.set(COMPOSITE_LAYER);
    this.composite.visible = false;

    for (const m of [this.lattice, this.latticeKoi, this.resolve, this.composite, this.flagsQuad]) m.frustumCulled = false;
    this.scene.add(this.lattice, this.latticeKoi, this.resolve);
    mainScene.add(this.composite);
    // (The main camera sees the composite, and the table's mirror does not; the mirror sees the
    // bowl's own pass on its layer.)
    camera.layers.enable(COMPOSITE_LAYER);
    studio.leaveOut(camera, COMPOSITE_LAYER);
    studio.alsoMirror(camera, MIRROR_LAYER);
  }

  /** How the bowl is drawn from the next frame (each change starts the picture afresh). */
  setMode(s: Partial<UpSettings>): void {
    this.settings = { ...this.settings, ...s };
  }

  get mode(): UpSettings {
    return { ...this.settings };
  }

  /** Each frame, once the world has moved and before the globe's uniforms are set (GlobeView.update,
   *  given tracedHeightPx()): whether it is drawn here, and how; whether the view moved. gapMs: the
   *  time since the last frame. */
  frame(renderer: THREE.WebGPURenderer, camera: THREE.PerspectiveCamera, center: THREE.Vector3, rotation: THREE.Matrix3, lid: BowlLid | null, gapMs: number): void {
    renderer.getDrawingBufferSize(this.size);
    const { mode, internal } = this.settings;
    this.drawing = mode > 0 && this.globe.mesh.visible && this.passes.bowl.visible;
    if (!this.drawing) {
      this.composite.visible = false;
      this.schedule.reset();
      return;
    }
    if (!this.size.equals(this.fitted) || mode !== this.fittedMode || internal !== this.fittedInternal) this.fit();
    if (gapMs > STALL_MS) this.schedule.reset();
    const still = this.moved(camera, center, rotation, lid) <= STILL_PX;
    // (The first still frame keeps nothing traced while the view moved: those were traced with the
    // lattice's footprint.)
    this.moving = !still;
    this.steady = still && this.wasStill;
    this.wasStill = still;
    if (mode === 2) {
      const { phase, oldValid } = this.schedule.next(this.steady);
      this.phase = phase;
      this.oldValid = oldValid;
    }
  }

  /** The height (pixels) the bowl's rays are spaced for (GlobeView.update: the footprint its level of
   *  detail follows): the picture's, at rest; the lattice's while the view moves (a lattice filled in
   *  must not sparkle); the internal target's at ?up=1. */
  tracedHeightPx(): number {
    const h = this.size.y;
    if (!this.drawing) return h;
    if (this.settings.mode === 1) return this.phaseTargets[0].height;
    return this.moving ? h / 2 : h;
  }

  /** How many rays the bowl's own pass traces for each pixel of the picture (the fish's pass
   *  besides). */
  tracedShare(): number {
    if (!this.drawing) return 1;
    return this.settings.mode === 1 ? this.settings.internal ** 2 : 1 / PHASES[2].length;
  }

  /** Before the frame is drawn (renderer.render(scene, camera)): the lattice, the change test, the
   *  resolve and the fish's pass, into the picture the composite then puts in the frame. */
  render(renderer: THREE.WebGPURenderer, camera: THREE.PerspectiveCamera): void {
    this.setLayers(this.drawing ? this.settings.mode : 0);
    if (!this.drawing) return;
    const { mode, fishFull } = this.settings;
    const { bowl, koi } = this.passes;
    for (const m of [this.lattice, this.latticeKoi, this.resolve, this.composite]) {
      m.position.copy(this.globe.mesh.position);
      m.scale.copy(bowl.scale);
    }
    // (Where the device traces in hardware, GlobeView swaps the passes' materials.)
    this.lattice.material = bowl.material;
    this.latticeKoi.material = koi.material;
    // (The fish: none where the camera leaves its pass out, ?bench's -fish.)
    const fish = camera.layers.isEnabled(BOWL_KOI_LAYER) && koi.visible;
    const rung = fish && fishFull;
    const target = renderer.getRenderTarget();
    const autoClear = renderer.autoClear;
    renderer.getClearColor(this.clearColor);
    const clearAlpha = renderer.getClearAlpha();
    // (Cleared to nought: alpha 0 where no ray met the bowl. The depth's clear is 0 on this page.)
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = true;

    // The lattice: this frame's phase's pixel of each block (2x2), or the whole picture at its
    // internal size (1).
    const W = this.size.x;
    const H = this.size.y;
    const into = mode === 2 ? this.spare : this.phaseTargets[0];
    const cam = this.latticeCam;
    cam.copy(camera);
    if (mode === 2) {
      const [ox, oy] = viewOffset(2, PHASES[2][this.phase]);
      cam.setViewOffset(W, H, ox, oy, 2 * into.width, 2 * into.height);
      // (Its rays are the picture's own: GlobeView.setBowlLattice.)
      const [px, py] = PHASES[2][this.phase];
      this.globe.setBowlLattice(2, px - 0.5, py - 0.5, this.size, camera);
    } else {
      cam.clearViewOffset();
    }
    cam.layers.set(0);
    if (fish && !rung) cam.layers.enable(BOWL_KOI_LAYER);
    renderer.setRenderTarget(into);
    renderer.render(this.scene, cam);
    this.globe.setBowlLattice();

    const u = this.uPhase.value;
    if (mode === 2) {
      // The change test: this frame's samples against their phase's last.
      const last = this.flagAt;
      this.flagAt ^= 1;
      this.nowTex.value = this.spare.texture;
      this.beforeTex.value = this.phaseTargets[this.phase].texture;
      this.lastTex.value = this.flagTargets[last].texture;
      this.uFlags.value.set(this.oldValid ? 1 : 0, this.tau, this.steady ? 1 : 0, changedFrames(2));
      renderer.setRenderTarget(this.flagTargets[this.flagAt]);
      renderer.render(this.flagsQuad, this.flatCam);
      // (The new lattice becomes its phase's.)
      [this.phaseTargets[this.phase], this.spare] = [this.spare, this.phaseTargets[this.phase]];
      this.phaseTargets.forEach((t, i) => (this.latTex[i].value = t.texture));
      this.latCurTex.value = this.phaseTargets[this.phase].texture;
      this.flagsTex.value = this.flagTargets[this.flagAt].texture;
      const s = this.schedule;
      this.uValid.value.set(...([0, 1, 2, 3].map((i) => (s.valid(i) ? 1 : 0)) as [number, number, number, number]));
      this.uAge.value.set(...([0, 1, 2, 3].map((i) => Math.min(s.age(i), 4)) as [number, number, number, number]));
      const [px, py] = PHASES[2][this.phase];
      u.set(this.phase, 2, rung ? 1 : 0, this.wide);
      this.uMap.value.set(0.5, 0.5, -px / 2, -py / 2);
    } else {
      this.latCurTex.value = into.texture;
      this.latTex.forEach((t) => (t.value = into.texture));
      u.set(0, 1, rung ? 1 : 0, 0);
      const ax = into.width / W;
      const ay = into.height / H;
      this.uMap.value.set(ax, ay, 0.5 * ax - 0.5, 0.5 * ay - 0.5);
    }

    // The picture: resolved, then the fish drawn again where the resolve marked it (left out of the
    // debug views, whose colours would be drawn over).
    const pc = this.pictureCam;
    pc.copy(camera);
    pc.layers.set(RESOLVE_LAYER);
    if (rung && !this.debug) pc.layers.enable(BOWL_KOI_LAYER);
    renderer.setRenderTarget(this.picture);
    renderer.render(this.scene, pc);

    renderer.setRenderTarget(target);
    renderer.autoClear = autoClear;
    renderer.setClearColor(this.clearColor, clearAlpha);
    this.composite.visible = true;
  }

  /** Builds this path's pipelines ahead (GlobeView.precompile builds the bowl's own, for the frame
   *  buffer: the same pipelines as for these targets, on a phone). */
  async precompile(renderer: THREE.WebGPURenderer, camera: THREE.PerspectiveCamera, mainScene: THREE.Scene): Promise<void> {
    if (this.settings.mode === 0) return;
    renderer.getDrawingBufferSize(this.size);
    this.fit();
    const target = renderer.getRenderTarget();
    const jobs: Promise<unknown>[] = [];
    const compile = (into: THREE.RenderTarget | null, mesh: THREE.Object3D, cam: THREE.Camera, scene: THREE.Scene | null): void => {
      renderer.setRenderTarget(into);
      const shown = mesh.visible;
      mesh.visible = true;
      jobs.push(scene ? renderer.compileAsync(mesh, cam, scene) : renderer.compileAsync(mesh, cam));
      mesh.visible = shown;
    };
    // (Every target made once, so the passes reading them have their textures.)
    for (const t of [...this.phaseTargets, this.spare, ...this.flagTargets, this.picture]) {
      renderer.setRenderTarget(t);
      renderer.clear();
    }
    this.latticeCam.copy(camera);
    this.latticeCam.layers.set(0);
    this.latticeCam.layers.enable(BOWL_KOI_LAYER);
    this.pictureCam.copy(camera);
    this.pictureCam.layers.set(RESOLVE_LAYER);
    this.pictureCam.layers.enable(BOWL_KOI_LAYER);
    compile(this.spare, this.lattice, this.latticeCam, this.scene);
    compile(this.spare, this.latticeKoi, this.latticeCam, this.scene);
    compile(this.picture, this.resolve, this.pictureCam, this.scene);
    compile(this.picture, this.latticeKoi, this.pictureCam, this.scene);
    compile(this.flagTargets[0], this.flagsQuad, this.flatCam, null);
    compile(null, this.composite, camera, mainScene);
    renderer.setRenderTarget(target);
    await Promise.all(jobs);
  }

  /** ?bench: the bowl drawn straight into the frame against the 2x2 lattice, at a run of pixel
   *  ratios, side by side (a phone warming up slows both alike); and the lattice with the fish on it,
   *  not drawn again. */
  benchRows(): BenchRow[] {
    const row = (label: string, ratio: number, s: Partial<UpSettings>): BenchRow => ({
      label,
      ratio,
      apply: () => this.setMode(s),
      restore: () => this.setMode(this.start),
    });
    return [
      ...[0.8, 1, 1.25, 1.5].flatMap((r) => [row('up0', r, { mode: 0 }), row('up2', r, { mode: 2, fishFull: true })]),
      row('up2 -rung', 1, { mode: 2, fishFull: false }),
    ];
  }

  /** For ?stats: how the bowl is drawn. */
  describe(): string {
    if (!this.drawing) return `up ${this.settings.mode}`;
    const { mode, fishFull, internal } = this.settings;
    const t = mode === 2 ? this.spare : this.phaseTargets[0];
    return `up ${mode}${mode === 1 ? ` at ${internal}` : ''} · traced ${t.width}x${t.height} of ${this.size.x}x${this.size.y}${fishFull ? ' · fish at full size' : ''} · ${this.moving ? 'moving' : 'still'}`;
  }

  /** The targets sized for the picture (and the mode), and the picture started afresh. */
  private fit(): void {
    const { mode, internal } = this.settings;
    const W = this.size.x;
    const H = this.size.y;
    if (mode === 2) {
      const [w, h] = latticeSize(W, H, 2);
      for (const t of [...this.phaseTargets, this.spare, ...this.flagTargets]) t.setSize(w, h);
    } else {
      this.phaseTargets[0].setSize(Math.max(1, Math.round(W * internal)), Math.max(1, Math.round(H * internal)));
    }
    this.picture.setSize(W, H);
    this.fitted.copy(this.size);
    this.fittedMode = mode;
    this.fittedInternal = internal;
    this.schedule.reset();
  }

  /** The bowl's own passes in the main scene: as they were (mode 0), or the first for the table's
   *  mirror alone and the fish's for none. */
  private setLayers(mode: number): void {
    if (mode === this.layersMode) return;
    this.layersMode = mode;
    const { bowl, koi } = this.passes;
    if (mode === 0) {
      bowl.layers.set(0);
      koi.layers.set(BOWL_KOI_LAYER);
      this.composite.visible = false;
    } else {
      bowl.layers.set(MIRROR_LAYER);
      koi.layers.disableAll();
    }
  }

  /** How far (pixels of the picture, at most) the view has moved the bowl's picture since the last
   *  frame: the camera's turn and travel, the bowl's, its lid's. Infinity where it jumped: the
   *  projection, or the lid shown or its lamp, changed. */
  private moved(camera: THREE.PerspectiveCamera, center: THREE.Vector3, rotation: THREE.Matrix3, lid: BowlLid | null): number {
    const b = this.before;
    const cam = camera.matrixWorld.elements;
    const proj = camera.projectionMatrix.elements;
    const rot = rotation.elements;
    const toLid = lid ? lid.toLid.elements : null;
    const state = lid ? [lid.shown ? 1 : 0, lid.lamp] : [0, 0];
    let px = b.at ? 0 : Infinity;
    if (b.at) {
      const maxDiff = (a: ArrayLike<number>, c: ArrayLike<number>, at: readonly number[]): number => at.reduce((m, i) => Math.max(m, Math.abs(a[i] - c[i])), 0);
      const R3 = [0, 1, 2, 4, 5, 6, 8, 9, 10];
      const T3 = [12, 13, 14];
      const perRad = this.size.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
      const perUnit = perRad / Math.max(camera.position.distanceTo(center), 1e-3);
      const reach = this.passes.bowl.scale.x;
      const camTurn = maxDiff(cam, b.cam, R3);
      const camMove = Math.hypot(cam[12] - b.cam[12], cam[13] - b.cam[13], cam[14] - b.cam[14]);
      const turn = maxDiff(rot, b.rot, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
      const lidTurn = toLid ? maxDiff(toLid, b.lid, R3) : 0;
      const lidMove = toLid ? Math.sqrt(T3.reduce((s, i) => s + (toLid[i] - b.lid[i]) ** 2, 0)) : 0;
      px = camTurn * perRad + (camMove + center.distanceTo(b.center) + (turn + lidTurn) * reach + lidMove) * perUnit;
      if (proj.some((v, i) => v !== b.proj[i]) || state[0] !== b.lidState[0] || state[1] !== b.lidState[1]) px = Infinity;
    }
    b.cam.set(cam);
    b.proj.set(proj);
    b.center.copy(center);
    b.rot.set(rot);
    if (toLid) b.lid.set(toLid);
    b.lidState[0] = state[0];
    b.lidState[1] = state[1];
    b.at = true;
    return px;
  }
}
