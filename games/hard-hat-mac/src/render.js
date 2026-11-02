// Renderer + post chain with quality tiers: 0 low, 1 medium, 2 high, 3 ultra.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { settings, isTouch } from './util.js';

export const QUALITY_NAMES = ['LOW', 'MEDIUM', 'HIGH', 'ULTRA'];

export class Renderer {
  constructor(canvas) {
    const r = this.r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    this.q = settings.quality === 'auto' ? (isTouch ? 1 : 3) : +settings.quality;
    this.auto = settings.quality === 'auto';
    this.fpsAcc = 0; this.fpsN = 0; this.fpsWin = 0; this.lowStreak = 0;
  }
  setup(scene, camera) {
    this.scene = scene; this.camera = camera; this.build();
    addEventListener('resize', () => this.resize());
  }
  build() {
    const q = this.q, r = this.r;
    if (this.composer) { this.composer.renderTarget1.dispose(); this.composer.renderTarget2.dispose(); }
    this.dpr = Math.min(devicePixelRatio || 1, q === 0 ? 1 : q === 1 ? 1.5 : 2);
    r.setPixelRatio(this.dpr);
    r.shadowMap.type = q === 0 ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight);
    r.setSize(w, h, false);
    const rt = new THREE.WebGLRenderTarget(w * this.dpr, h * this.dpr, { type: THREE.HalfFloatType, samples: q >= 2 ? 4 : 0 });
    const c = this.composer = new EffectComposer(r, rt);
    c.setPixelRatio(this.dpr); c.setSize(w, h);
    c.addPass(new RenderPass(this.scene, this.camera));
    this.gtao = null;
    if (q >= 3) {
      const g = this.gtao = new GTAOPass(this.scene, this.camera, w, h);
      g.output = GTAOPass.OUTPUT.Default; g.blendIntensity = .85;
      g.updateGtaoMaterial({ radius: .7, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 12 });
      g.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
      c.addPass(g);
    }
    this.bloom = null;
    if (q >= 1) { this.bloom = new UnrealBloomPass(new THREE.Vector2(w, h), .38, .55, .92); c.addPass(this.bloom); }
    c.addPass(new OutputPass());
    if (q >= 2) c.addPass(new SMAAPass(w * this.dpr, h * this.dpr));
    else { this.fxaa = new ShaderPass(FXAAShader); this.fxaa.material.uniforms.resolution.value.set(1 / (w * this.dpr), 1 / (h * this.dpr)); c.addPass(this.fxaa); }
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  resize() {
    const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight);
    this.r.setSize(w, h, false); this.composer.setSize(w, h);
    if (this.fxaa) this.fxaa.material.uniforms.resolution.value.set(1 / (w * this.dpr), 1 / (h * this.dpr));
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.onResize && this.onResize(w, h);
  }
  setQuality(q, auto = false) { this.q = q; this.auto = auto; this.build(); this.onQuality && this.onQuality(q); }
  // Auto mode steps quality down when the frame rate stays low during play.
  track(dt, playing) {
    if (!this.auto || !playing) return;
    this.fpsAcc += dt; this.fpsN++;
    if (this.fpsAcc >= 2) {
      const fps = this.fpsN / this.fpsAcc; this.fpsAcc = 0; this.fpsN = 0;
      this.lowStreak = fps < 48 ? this.lowStreak + 1 : 0;
      if (this.lowStreak >= 2 && this.q > 0) { this.lowStreak = 0; this.setQuality(this.q - 1, true); }
    }
  }
  render() { this.composer.render(); }
}
