import * as T from 'three';
import type {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';

/** Prepare fullscreen shaders too: scene compilation never visits composer passes. */
export async function warmPostprocessing(renderer:T.WebGLRenderer, composer:EffectComposer) {
  const previous=renderer.getRenderTarget(), geometry=new T.PlaneGeometry(2,2);
  const camera=new T.OrthographicCamera(-1,1,1,-1,0,1), jobs:Promise<unknown>[]=[];
  try {
    for(const [index,pass] of composer.passes.entries()) {
      const materials=new Set<T.Material>();
      for(const value of Object.values(pass)) {
        const candidates=Array.isArray(value)?value:[value];
        for(const candidate of candidates) {
          const material=candidate instanceof T.Material?candidate:candidate?.material;
          // OutputPass sets its raw shader defines at render time.
          if(material instanceof T.Material && !(material instanceof T.RawShaderMaterial))materials.add(material);
        }
      }
      if(!materials.size)continue;
      renderer.setRenderTarget(index===composer.passes.length-1?null:composer.readBuffer);
      const scene=new T.Scene();
      for(const material of materials)scene.add(new T.Mesh(geometry,material));
      jobs.push(renderer.compileAsync(scene,camera));
    }
    renderer.setRenderTarget(previous);
    await Promise.all(jobs);
  } finally {renderer.setRenderTarget(previous);geometry.dispose();}
}
