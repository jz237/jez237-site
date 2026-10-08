import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { QuarryAO, createSceneRenderTarget } from '../src/rendering';

class CaptureRenderer {
  autoClear = true;
  target: T.WebGLRenderTarget | null = null;
  color = new T.Color(0x345678);
  alpha = .4;
  draws: {object: T.Object3D; target: T.WebGLRenderTarget | null}[] = [];
  getPixelRatio() { return 1; }
  getClearColor(out: T.Color) { return out.copy(this.color); }
  getClearAlpha() { return this.alpha; }
  setClearColor(color: T.ColorRepresentation) { this.color.set(color); }
  setClearAlpha(alpha: number) { this.alpha = alpha; }
  setRenderTarget(target: T.WebGLRenderTarget | null) { this.target = target; }
  clear() {}
  render(object: T.Object3D) { this.draws.push({object, target: this.target}); }
  get renderer() { return this as unknown as T.WebGLRenderer; }
}

test('AO reads the current scene depth through alternating composer buffers without redrawing meshes', () => {
  const renderer = new CaptureRenderer(), scene = new T.Scene();
  const leaves = new T.Mesh(new T.BoxGeometry(), new T.MeshBasicMaterial({alphaTest: .5}));
  scene.add(leaves);
  const ao = new QuarryAO(scene, new T.PerspectiveCamera());
  const composer = new EffectComposer(renderer.renderer, createSceneRenderTarget(640, 360));
  assert.notEqual(composer.readBuffer.depthTexture, composer.writeBuffer.depthTexture);
  assert.notEqual(composer.readBuffer.depthTexture!.image, composer.writeBuffer.depthTexture!.image);
  try {
    for (let i = 0; i < 4; i++) {
      renderer.draws.length = 0;
      const depth = composer.readBuffer.depthTexture;
      ao.render(renderer.renderer, composer.writeBuffer, composer.readBuffer, 0, false);
      assert.equal(renderer.draws.length, 4, 'AO, denoise, color copy and blend only');
      assert.ok(renderer.draws.every(draw => draw.object !== scene));
      assert.equal(ao.gtaoMaterial.uniforms.tDepth.value, depth);
      assert.equal(ao.pdMaterial.uniforms.tDepth.value, depth);
      assert.equal(ao.depthRenderMaterial.uniforms.tDepth.value, depth);
      assert.equal(ao.gtaoMaterial.defines.NORMAL_VECTOR_TYPE, 0);
      assert.equal(ao.pdMaterial.defines.NORMAL_VECTOR_TYPE, 0);
      assert.equal(leaves.visible, true);
      assert.equal(scene.overrideMaterial, null);
      assert.equal(renderer.autoClear, true);
      assert.equal(renderer.color.getHex(), 0x345678);
      assert.equal(renderer.alpha, .4);
      composer.swapBuffers();
    }
  } finally { ao.dispose(); composer.dispose(); }
});

test('quality sizing and composer reset preserve independent depth targets; AO does not own their lifetime', () => {
  const renderer = new CaptureRenderer();
  const composer = new EffectComposer(renderer.renderer, createSceneRenderTarget(640, 360));
  const ao = new QuarryAO(new T.Scene(), new T.PerspectiveCamera());
  composer.addPass(ao);
  try {
    for (const ratio of [1, .85, .65, 1.5]) {
      composer.setPixelRatio(ratio); composer.setSize(800, 400);
      for (const target of [composer.readBuffer, composer.writeBuffer]) {
        assert.equal(target.width, 800 * ratio); assert.equal(target.height, 400 * ratio);
        assert.equal(target.depthTexture!.format, T.DepthFormat);
        assert.equal(target.depthTexture!.type, T.UnsignedIntType);
      }
      assert.equal(ao.width, Math.round(800 * ratio * .65));
      assert.equal(ao.height, Math.round(400 * ratio * .65));
    }
    const replacement = createSceneRenderTarget(512, 256);
    composer.reset(replacement);
    ao.render(renderer.renderer, composer.writeBuffer, composer.readBuffer, 0, false);
    assert.equal(ao.depthTexture, composer.readBuffer.depthTexture);
    assert.notEqual(composer.readBuffer.depthTexture, composer.writeBuffer.depthTexture);
    let disposed = 0;
    composer.readBuffer.depthTexture!.addEventListener('dispose', () => disposed++);
    ao.dispose(); assert.equal(disposed, 0, 'ambient pass must not destroy scene-owned depth');
  } finally { composer.dispose(); }
});

test('a missing scene depth attachment fails explicitly instead of sampling stale geometry', () => {
  const ao = new QuarryAO(new T.Scene(), new T.PerspectiveCamera());
  const target = new T.WebGLRenderTarget(8, 8), renderer = new CaptureRenderer();
  try {
    assert.throws(() => ao.render(renderer.renderer, target, target, 0, false), /scene depth texture/);
    assert.equal(renderer.draws.length, 0);
  } finally { ao.dispose(); target.dispose(); }
});
