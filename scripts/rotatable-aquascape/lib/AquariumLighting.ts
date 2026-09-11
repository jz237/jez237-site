import * as T from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

/** Contact shading from the beauty pass depth, preserving animated/alpha-cut leaves.
 * Glass and water do not write depth: neither becomes an opaque AO wall.
 * Reconstructing normals avoids a second scene render with an incompatible override.
 */
export class AquariumLighting {
 private beauty=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:2,depthTexture:new T.DepthTexture(1,1,T.UnsignedIntType)});
 private shaded=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:false});
 private contact:GTAOPass;
 private output=new OutputPass();
 constructor(private scene:T.Scene,private camera:T.PerspectiveCamera){
  this.contact=new GTAOPass(scene,camera,1,1);
  this.contact.setGBuffer(this.beauty.depthTexture!,undefined);
  this.contact.updateGtaoMaterial({radius:.32,thickness:.12,distanceExponent:1.6,distanceFallOff:1,scale:1,samples:16});
  this.contact.updatePdMaterial({radius:4,samples:16,depthPhi:3,normalPhi:4});
  this.contact.blendIntensity=.48;
  this.output.renderToScreen=true;
 }
 resize(width:number,height:number){
  this.beauty.setSize(width,height);this.shaded.setSize(width,height);
  this.contact.setSize(width,height);
 }
 async prepare(renderer:T.WebGLRenderer){
  const target=renderer.getRenderTarget();
  try{renderer.setRenderTarget(this.beauty);await renderer.compileAsync(this.scene,this.camera);}
  finally{renderer.setRenderTarget(target);}
 }
 render(renderer:T.WebGLRenderer,inspect:string|null){
  const target=renderer.getRenderTarget();
  try{
   renderer.setRenderTarget(this.beauty);renderer.render(this.scene,this.camera);
   const triangles=renderer.info.render.triangles;
   this.contact.output=inspect==='contact'?GTAOPass.OUTPUT.Denoise:GTAOPass.OUTPUT.Default;
   this.contact.render(renderer,this.shaded,this.beauty,0,false);
   this.output.render(renderer,this.shaded,inspect==='unshaded'?this.beauty:this.shaded,0,false);
   return triangles;
  }finally{renderer.setRenderTarget(target);}
 }
 dispose(){this.beauty.dispose();this.shaded.dispose();this.contact.dispose();this.output.dispose();}
}
