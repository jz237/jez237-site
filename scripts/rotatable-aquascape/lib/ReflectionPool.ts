import {LinearMipmapLinearFilter} from 'three';
import {Reflector} from 'three/addons/objects/Reflector.js';

/** One scene capture per visible mirror, with bounded secondary reflections. */
export class ReflectionPool{
 private capturing=false;
 add(surface:Reflector){
  const texture=surface.getRenderTarget().texture;
  texture.generateMipmaps=true;texture.minFilter=LinearMipmapLinearFilter;texture.anisotropy=8;
  const capture=surface.onBeforeRender;
  surface.onBeforeRender=(...args)=>{
   // Secondary surfaces use their last complete capture instead of recursing.
   if(this.capturing)return;
   this.capturing=true;
   try{capture.apply(surface,args);}finally{this.capturing=false;}
  };
  return surface;
 }
}
