import * as T from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {ReflectionPool} from '../lib/ReflectionPool.ts';

/** Wavy water can reflect scenery below the planar mirror's narrow field of
 * view. Capture vertical overscan at the same pixel density, so the existing
 * depth ray search can reach that scenery instead of reverting to a flat ray. */
export class ReefReflections extends ReflectionPool {
 private waterCaptures:Reflector[]=[];
 override setEffects(scale:number,samples:number){
  let changed=super.setEffects(scale,samples);
  for(const surface of this.waterCaptures){
   const target=surface.getRenderTarget(),material=surface.material as T.ShaderMaterial;
   // Planar fallback does not search bent rays, so overscan buys nothing there.
   if(material.uniforms.advancedReflections?.value<.5&&target.height!==target.width){
    target.setSize(target.width,target.width);surface.forceUpdate=true;changed=true;
   }
  }
  return changed;
 }
 override add(surface:Reflector){
  const material=surface.material as T.ShaderMaterial;
  if(material.name==='AquariumWaterReflection'&&material.uniforms.underside?.value===1){
   const target=surface.getRenderTarget(),overscan=1.5;
   target.setSize(target.width,Math.round(target.height*overscan));
   this.waterCaptures.push(surface);
   const capture=surface.onBeforeRender,cameras=new WeakMap<T.Camera,T.Camera>();
   surface.onBeforeRender=(...args)=>{
    const camera=args[2];let wide=cameras.get(camera);
    if(!wide){wide=camera.clone();cameras.set(camera,wide);}
    wide.copy(camera,false);
    // Extend only vertical coverage; keep the horizontal field/pixel density.
    wide.projectionMatrix.elements[5]/=target.height/target.width;
    wide.projectionMatrixInverse.copy(wide.projectionMatrix).invert();
    const forwarded=[...args] as Parameters<typeof capture>;forwarded[2]=wide;
    capture.apply(surface,forwarded);
   };
  }
  return super.add(surface);
 }
}
