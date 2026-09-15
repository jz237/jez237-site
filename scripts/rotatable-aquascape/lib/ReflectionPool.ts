import {LinearMipmapLinearFilter,Frustum,Matrix4,Vector3,type WebGLRenderer,type Scene,type Camera} from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';

/** One scene capture per visible mirror, with bounded secondary reflections. */
export class ReflectionPool{
 private capturing=false;
 private managed=false;
 private captures=new Map<Reflector,Reflector['onBeforeRender']>();
 private originalSizes=new Map<Reflector,{width:number;height:number;samples:number}>();
 setEffects(scale:number,samples:number){
  let changed=false;
  for(const [surface,size] of this.originalSizes){
   const target=surface.getRenderTarget(),width=Math.max(1,Math.round(size.width*scale)),height=Math.max(1,Math.round(size.height*scale));
   const count=Math.min(size.samples,samples);
   if(target.width===width&&target.height===height&&target.samples===count)continue;
   if(target.samples!==count){target.samples=count;target.dispose();}
   target.setSize(width,height);surface.forceUpdate=true;changed=true;
  }
  return changed;
 }
 visible(camera:Camera){
  camera.updateMatrixWorld();
  const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  const cameraPosition=new Vector3().setFromMatrixPosition(camera.matrixWorld),normal=new Vector3(),view=new Vector3(),rotation=new Matrix4();
  return [...this.captures.keys()].filter(surface=>{
   for(let object:typeof surface.parent=surface;object;object=object.parent)if(!object.visible)return false;
   if(surface.frustumCulled&&!frustum.intersectsObject(surface))return false;
   rotation.extractRotation(surface.matrixWorld);normal.set(0,0,1).applyMatrix4(rotation);
   view.setFromMatrixPosition(surface.matrixWorld).sub(cameraPosition);
   return surface.forceUpdate||view.dot(normal)<=0;
  });
 }
 /** Finish mirror views before starting the main framebuffer. This avoids
  * spilling and restoring a partially rendered HDR/MSAA image on tiled GPUs. */
 prepare(renderer:WebGLRenderer,scene:Scene,camera:Camera,selected?:ReadonlySet<string>){
  this.managed=true;this.capturing=true;
  try{
   for(const surface of this.visible(camera)){
    if(selected&&!selected.has(surface.uuid))continue;
    const capture=this.captures.get(surface)!;
    capture.call(surface,renderer,scene,camera,surface.geometry,Array.isArray(surface.material)?surface.material[0]:surface.material,null!);
   }
  }finally{this.capturing=false;}
 }
 add(surface:Reflector){
  const target=surface.getRenderTarget();this.originalSizes.set(surface,{width:target.width,height:target.height,samples:target.samples});
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
