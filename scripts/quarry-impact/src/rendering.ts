import * as T from 'three';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

/** Half-resolution horizon-based occlusion, with foliage excluded from the
 * normal buffer: the normal override cannot reproduce alpha-cutout leaves. */
export class QuarryAO extends GTAOPass {
  resolutionScale = 0.65;
  constructor(scene: T.Scene, camera: T.PerspectiveCamera) {
    super(scene, camera, 512, 512);
    this.updateGtaoMaterial({ radius: 1.4, distanceExponent: 1.5,
      thickness: 0.65, distanceFallOff: 0.7, scale: 1, samples: 12,
      screenSpaceRadius: false });
    this.updatePdMaterial({ radius: 5, lumaPhi: 8, depthPhi: 1,
      normalPhi: 4, samples: 12, rings: 2 });
    this.blendIntensity = 0.75;
  }
  override setSize(width: number, height: number) {
    super.setSize(Math.max(1, Math.round(width * (this.resolutionScale ?? 0.65))),
      Math.max(1, Math.round(height * (this.resolutionScale ?? 0.65))));
  }
  override render(renderer: T.WebGLRenderer, writeBuffer: T.WebGLRenderTarget,
    readBuffer: T.WebGLRenderTarget, deltaTime: number, maskActive: boolean) {
    const hidden: T.Object3D[] = [];
    this.scene.traverse(o => {
      if (!(o instanceof T.Mesh) || !o.visible) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      if (mats.some(m => m.alphaTest > 0 || m.transparent)) {
        hidden.push(o); o.visible = false;
      }
    });
    try { super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive); }
    finally { for (const o of hidden) o.visible = true; }
  }
}

/** A rolling local reflection capture, filtered only after all six faces are
 * complete. One face per scheduled frame spreads the cost of moving scenery,
 * opponents and wrecks across time. Persistent targets avoid GPU allocations. */
export class LocalReflections {
  private cube = new T.WebGLCubeRenderTarget(256, { type: T.HalfFloatType });
  private camera = new T.CubeCamera(0.15, 450, this.cube);
  private generator: T.PMREMGenerator;
  private filtered: T.WebGLRenderTarget | null = null;
  private face = 0;
  private tick = 0;
  private player: T.Object3D | null = null;
  private initialized = false;
  updates = 0;
  enabled = true;
  interval = 3;
  constructor(private renderer: T.WebGLRenderer, private scene: T.Scene) {
    this.generator = new T.PMREMGenerator(renderer);
    this.generator.compileCubemapShader();
    this.camera.coordinateSystem = renderer.coordinateSystem;
    this.camera.updateCoordinateSystem();
  }
  update(player: T.Object3D, force = false) {
    if (!this.enabled && !force) return;
    if (this.player !== player) {
      this.player = player;
      this.initialized = false;
      this.face = 0;
    }
    if (!force && this.initialized && ++this.tick % this.interval !== 0) return;
    if (this.face === 0) {
      player.getWorldPosition(this.camera.position);
      this.camera.position.y += 0.65;
      this.camera.updateMatrixWorld(true);
    }
    const visible = player.visible;
    const oldTarget = this.renderer.getRenderTarget();
    const oldFace = this.renderer.getActiveCubeFace();
    const oldMip = this.renderer.getActiveMipmapLevel();
    const oldShadowUpdate = this.renderer.shadowMap.autoUpdate;
    const oldShadowDirty = this.renderer.shadowMap.needsUpdate;
    player.visible = false;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = false;
    try {
      if (!this.initialized || force) {
        this.camera.update(this.renderer, this.scene);
        this.face = 0;
      } else {
        this.renderer.setRenderTarget(this.cube, this.face);
        this.renderer.render(this.scene, this.camera.children[this.face] as T.Camera);
        this.face = (this.face + 1) % 6;
      }
      if (this.face === 0) {
        this.filtered = this.generator.fromCubemap(this.cube.texture, this.filtered);
        this.updates++;
        if (!this.initialized) {
          player.traverse(o => {
            if (!(o instanceof T.Mesh)) return;
            const materials = Array.isArray(o.material) ? o.material : [o.material];
            for (const m of materials) {
              if (m instanceof T.MeshStandardMaterial) {
                m.envMap = this.filtered!.texture;
                m.envMapIntensity = 0.95;
                m.needsUpdate = true;
              }
            }
          });
        }
        this.initialized = true;
      }
    } finally {
      player.visible = visible;
      this.renderer.shadowMap.autoUpdate = oldShadowUpdate;
      this.renderer.shadowMap.needsUpdate = oldShadowDirty;
      this.renderer.setRenderTarget(oldTarget, oldFace, oldMip);
    }
  }
  invalidate() {
    this.initialized = false;
    this.face = 0;
  }
  dispose() {
    this.cube.dispose();
    this.filtered?.dispose();
    this.generator.dispose();
  }
}
