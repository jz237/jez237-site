import * as T from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

/** Contact shading from the beauty pass depth, preserving animated/alpha-cut leaves.
 * Glass and water do not write depth: neither becomes an opaque AO wall.
 * Reconstructing normals avoids a second scene render with an incompatible override.
 */
export class AquariumLighting {
 private beauty=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:2,depthTexture:new T.DepthTexture(1,1,T.UnsignedIntType)});
 private contact:GTAOPass;
 private output=new OutputPass();
 private scene:T.Scene;private camera:T.PerspectiveCamera;
 constructor(scene:T.Scene,camera:T.PerspectiveCamera){
  this.scene=scene;this.camera=camera;
  this.contact=new GTAOPass(scene,camera,1,1);
  this.contact.setGBuffer(this.beauty.depthTexture!,undefined);
  this.contact.updateGtaoMaterial({radius:.32,thickness:.12,distanceExponent:1.6,distanceFallOff:1,scale:1,samples:16});
  this.contact.updatePdMaterial({radius:4,samples:16,depthPhi:3,normalPhi:4});
  this.contact.blendIntensity=.48;
  // These two full-screen passes only sample depth; they never write/test it.
  this.contact.gtaoRenderTarget.depthBuffer=false;
  this.contact.pdRenderTarget.depthBuffer=false;
  Object.assign(this.output.uniforms,{aquariumAO:{value:this.contact.gtaoMap},aoIntensity:{value:.48},inspectionMode:{value:0}});
  this.output.material.depthTest=false;this.output.material.depthWrite=false;
  this.output.material.fragmentShader=this.output.material.fragmentShader
   .replace('uniform sampler2D tDiffuse;', 'uniform sampler2D tDiffuse;\nuniform sampler2D aquariumAO;\nuniform float aoIntensity,inspectionMode;')
   .replace('gl_FragColor = texture2D( tDiffuse, vUv );', `
    vec4 beauty=texture2D(tDiffuse,vUv),ao=texture2D(aquariumAO,vUv);
    // The same multiplicative GTAO blend, immediately followed by OutputPass's
    // original tone mapping. Avoid copying and re-reading a full HDR image.
    gl_FragColor=inspectionMode>1.5?beauty:inspectionMode>.5?ao:beauty*vec4(mix(vec3(1.),ao.rgb,aoIntensity),ao.a);
   `);
  this.output.renderToScreen=true;
 }
 resize(width:number,height:number){
  this.beauty.setSize(width,height);
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
   this.contact.output=GTAOPass.OUTPUT.Off;
   this.contact.render(renderer,this.beauty,this.beauty,0,false);
   this.output.uniforms.inspectionMode.value=inspect==='contact'?1:inspect==='unshaded'?2:0;
   this.output.render(renderer,this.beauty,this.beauty,0,false);
   return triangles;
  }finally{renderer.setRenderTarget(target);}
 }
 dispose(){this.beauty.dispose();this.contact.dispose();this.output.dispose();}
}
