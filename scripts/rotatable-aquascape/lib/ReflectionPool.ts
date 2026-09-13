import {LinearMipmapLinearFilter,Frustum,Matrix4,type WebGLRenderer,type Scene,type Camera} from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';

/** One scene capture per visible mirror, with bounded secondary reflections. */
export class ReflectionPool{
 private capturing=false;
 private managed=false;
 private captures=new Map<Reflector,Reflector['onBeforeRender']>();
 /** Finish mirror views before starting the main framebuffer. This avoids
  * spilling and restoring a partially rendered HDR/MSAA image on tiled GPUs. */
 prepare(renderer:WebGLRenderer,scene:Scene,camera:Camera){
  camera.updateMatrixWorld();
  const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  this.managed=true;this.capturing=true;
  try{
   for(const [surface,capture] of this.captures){
    let visible=true;for(let object:typeof surface.parent=surface;object;object=object.parent)visible=visible&&object.visible;
    if(visible&&(!surface.frustumCulled||frustum.intersectsObject(surface)))capture.call(surface,renderer,scene,camera,surface.geometry,Array.isArray(surface.material)?surface.material[0]:surface.material,null!);
   }
  }finally{this.capturing=false;}
 }
 add(surface:Reflector){
  const texture=surface.getRenderTarget().texture;
  texture.generateMipmaps=true;texture.minFilter=LinearMipmapLinearFilter;texture.anisotropy=8;
  const capture=surface.onBeforeRender;this.captures.set(surface,capture);
  surface.onBeforeRender=(...args)=>{
   // Secondary surfaces use their last complete capture instead of recursing.
   if(this.capturing||this.managed)return;
   this.capturing=true;
   try{capture.apply(surface,args);}finally{this.capturing=false;}
  };
  return surface;
 }
}
