// GPU part-ID buffer: one flat-colour pass that encodes the owning part's index per pixel.
// Used for exact picking (1x1 view-offset render + readback) and for the selection/hover outline in the final pass.
import * as THREE from 'three';

const ID_LAYERS = (1 << 0) | (1 << 2) | (1 << 3) | (1 << 6);   // opaque, fur, transparent, ID-only proxies

export class Picker {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uId: { value: 0 } },
      vertexShader: `
        #include <common>
        #include <batching_pars_vertex>
        void main() {
          #include <batching_vertex>
          #include <begin_vertex>
          #include <project_vertex>
        }`,
      fragmentShader: `
        uniform float uId;
        void main() {
          float lo = mod(uId, 256.0);
          float hi = floor(uId / 256.0);
          gl_FragColor = vec4(lo / 255.0, hi / 255.0, 0.0, 1.0);
        }`,
      side: THREE.DoubleSide, blending: THREE.NoBlending, toneMapped: false, depthTest: true, depthWrite: true,
    });
    this.mat.toneMapped = false;
    this.rtOpts = {
      type: THREE.UnsignedByteType, format: THREE.RGBAFormat, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
      depthBuffer: true, stencilBuffer: false, samples: 0, generateMipmaps: false,
    };
    this.rt = new THREE.WebGLRenderTarget(4, 4, this.rtOpts);
    this.rt.texture.colorSpace = THREE.NoColorSpace;
    this.rt1 = new THREE.WebGLRenderTarget(1, 1, this.rtOpts);
    this.rt1.texture.colorSpace = THREE.NoColorSpace;
    this.meshes = [];
    this.buf = new Uint8Array(4);
    this.valid = false;
    this._clear = new THREE.Color();
  }

  /** Collect every pickable mesh (call after the bee is finalized or when the part set changes). */
  setBee(bee) {
    this.bee = bee;
    this.meshes = [];
    for (const p of bee.parts) for (const m of p.meshes) this.meshes.push(m);
  }

  setSize(w, h) {
    this.rt.setSize(Math.max(1, w), Math.max(1, h));
    this.valid = false;
  }

  _draw(target, clearAlpha = 1) {
    const r = this.renderer, cam = this.camera, scene = this.scene;
    const saveRT = r.getRenderTarget(), saveMask = cam.layers.mask;
    const saveBg = scene.background, saveEnv = scene.environment, saveAuto = r.autoClear, saveOverride = scene.overrideMaterial;
    const saveShadow = r.shadowMap.autoUpdate, saveShadowNeeds = r.shadowMap.needsUpdate, saveShadowEnabled = r.shadowMap.enabled;
    r.getClearColor(this._clear);
    const saveAlpha = r.getClearAlpha();
    const noop = () => {};
    const hidden = [];
    for (const m of this.meshes) {
      if (m.userData.noPick && m.visible) { m.visible = false; hidden.push(m); continue; }
      m.onBeforeRender = (rend, sc, c, g, material) => { material.uniforms.uId.value = m.userData.partIndex; material.uniformsNeedUpdate = true; };
    }
    cam.layers.mask = ID_LAYERS;
    scene.background = null;
    scene.overrideMaterial = this.mat;
    r.shadowMap.enabled = false;
    r.autoClear = false;
    r.setRenderTarget(target);
    r.setClearColor(0x000000, 0);
    r.clear(true, true, false);
    r.render(scene, cam);
    for (const m of this.meshes) m.onBeforeRender = noop;
    for (const m of hidden) m.visible = true;
    scene.overrideMaterial = saveOverride;
    scene.background = saveBg;
    scene.environment = saveEnv;
    r.shadowMap.enabled = saveShadowEnabled;
    r.shadowMap.autoUpdate = saveShadow;
    r.shadowMap.needsUpdate = saveShadowNeeds;
    r.autoClear = saveAuto;
    r.setClearColor(this._clear, saveAlpha);
    cam.layers.mask = saveMask;
    r.setRenderTarget(saveRT);
  }

  /** Full-resolution ID pass (used by the final composite). */
  renderFull() {
    this._draw(this.rt);
    this.valid = true;
  }

  /** Part under a canvas pixel (CSS px, origin top-left); returns the Part or null. */
  pick(clientX, clientY, canvas) {
    const r = this.renderer;
    const rect = canvas.getBoundingClientRect();
    const dprX = r.domElement.width / rect.width, dprY = r.domElement.height / rect.height;
    const px = Math.floor((clientX - rect.left) * dprX), py = Math.floor((clientY - rect.top) * dprY);
    const W = r.domElement.width, H = r.domElement.height;
    if (px < 0 || py < 0 || px >= W || py >= H) return null;
    const cam = this.camera;
    const hadOffset = !!cam.view?.enabled;
    const saved = hadOffset ? { ...cam.view } : null;
    cam.setViewOffset(W, H, px, py, 1, 1);
    this._draw(this.rt1);
    cam.clearViewOffset();
    if (saved) cam.setViewOffset(saved.fullWidth, saved.fullHeight, saved.offsetX, saved.offsetY, saved.width, saved.height);
    cam.updateProjectionMatrix();
    r.readRenderTargetPixels(this.rt1, 0, 0, 1, 1, this.buf);
    const id = this.buf[0] + this.buf[1] * 256;
    return id > 0 ? this.bee.parts[id - 1] ?? null : null;
  }
}
