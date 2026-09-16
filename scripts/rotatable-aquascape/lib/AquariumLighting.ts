import * as T from 'three';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {frameInspectionLens} from './InspectionLens.ts';

/** Contact shading from the beauty pass depth, preserving animated/alpha-cut leaves.
 * Glass and water do not write depth: neither becomes an opaque AO wall.
 * Reconstructing normals avoids a second scene render with an incompatible override.
 */
export class AquariumLighting {
 private beauty=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:2,depthTexture:new T.DepthTexture(1,1,T.UnsignedIntType)});
 private contact:GTAOPass;
 private output=new OutputPass();
 private lensCamera=new T.PerspectiveCamera();
 private lensTarget=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:2});
 private aoScale=1;private contactEnabled=true;private width=1;private height=1;
 readonly lens={enabled:false,center:new T.Vector2(.5,.5),radius:new T.Vector2(.12,.12),zoom:2.4};
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
  Object.assign(this.output.uniforms,{aquariumAO:{value:this.contact.gtaoMap},lensImage:{value:this.lensTarget.texture},aoIntensity:{value:.48},inspectionMode:{value:0},lensCenter:{value:this.lens.center},lensRadius:{value:this.lens.radius},lensZoom:{value:1}});
  this.output.material.depthTest=false;this.output.material.depthWrite=false;
  this.output.material.fragmentShader=this.output.material.fragmentShader
   .replace('uniform sampler2D tDiffuse;', 'uniform sampler2D tDiffuse;\nuniform sampler2D aquariumAO,lensImage;\nuniform float aoIntensity,inspectionMode;\nuniform vec2 lensCenter,lensRadius;\nuniform float lensZoom;')
   .replace('gl_FragColor = texture2D( tDiffuse, vUv );', `
    vec2 sampleUV=vUv;
    if(lensZoom>1.&&length((vUv-lensCenter)/lensRadius)<1.)sampleUV=lensCenter+(vUv-lensCenter)/lensZoom;
    vec4 beauty=texture2D(tDiffuse,sampleUV),ao=texture2D(aquariumAO,sampleUV);
    // The same multiplicative GTAO blend, immediately followed by OutputPass's
    // original tone mapping. Avoid copying and re-reading a full HDR image.
    gl_FragColor=inspectionMode>1.5?beauty:inspectionMode>.5?ao:beauty*vec4(mix(vec3(1.),ao.rgb,aoIntensity),ao.a);
    if(lensZoom>1.&&length((vUv-lensCenter)/lensRadius)<1.){
     vec4 detail=texture2D(lensImage,(vUv-lensCenter)/(2.*lensRadius)+.5);
     gl_FragColor=inspectionMode>1.5?detail:inspectionMode>.5?ao:detail*vec4(mix(vec3(1.),ao.rgb,aoIntensity),ao.a);
    }
   `);
  this.output.renderToScreen=true;
 }
 resize(width:number,height:number){
  this.width=width;this.height=height;
  this.beauty.setSize(width,height);
  this.contact.setSize(Math.max(1,Math.round(width*this.aoScale)),Math.max(1,Math.round(height*this.aoScale)));
 }
 setEffects(aoScale:number,contact:boolean,samples:number){
  this.contactEnabled=contact;
  if(this.aoScale!==aoScale){this.aoScale=aoScale;this.resize(this.width,this.height);this.contact.updatePdMaterial({radius:4*aoScale});}
  if(this.beauty.samples!==samples){this.beauty.samples=samples;this.beauty.dispose();}
 }
 async prepare(renderer:T.WebGLRenderer){
  const target=renderer.getRenderTarget();
  try{renderer.setRenderTarget(this.beauty);await renderer.compileAsync(this.scene,this.camera);}
  finally{renderer.setRenderTarget(target);}
 }
 render(renderer:T.WebGLRenderer,inspect:string|null,contact=true){
  contact=contact&&this.contactEnabled;
  const target=renderer.getRenderTarget();
  try{
   renderer.setRenderTarget(this.beauty);renderer.render(this.scene,this.camera);
   const triangles=renderer.info.render.triangles;
   this.contact.output=GTAOPass.OUTPUT.Off;
   if(contact)this.contact.render(renderer,this.beauty,this.beauty,0,false);
   if(this.lens.enabled){
    // Render only the small inspection crop at at least two samples per CSS
    // pixel. No whole-frame supersampling or additional reflection captures.
    const css=renderer.domElement.getBoundingClientRect();
    const w=Math.ceil(2*this.lens.radius.x*Math.max(this.width,css.width*2));
    const h=Math.ceil(2*this.lens.radius.y*Math.max(this.height,css.height*2));
    this.lensTarget.setSize(Math.max(1,w),Math.max(1,h));
    frameInspectionLens(this.camera,this.lensCamera,this.lens.center,this.lens.radius,this.lens.zoom);
    const shadows=renderer.shadowMap.autoUpdate,needsUpdate=renderer.shadowMap.needsUpdate;
    try{renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=false;renderer.setRenderTarget(this.lensTarget);renderer.render(this.scene,this.lensCamera);}
    finally{renderer.shadowMap.autoUpdate=shadows;renderer.shadowMap.needsUpdate=needsUpdate;}
   }
   this.output.uniforms.inspectionMode.value=!contact?2:inspect==='contact'?1:inspect==='unshaded'?2:0;
   this.output.uniforms.lensZoom.value=this.lens.enabled?this.lens.zoom:1;
   this.output.render(renderer,this.beauty,this.beauty,0,false);
   return triangles;
  }finally{renderer.setRenderTarget(target);}
 }
 dispose(){this.beauty.dispose();this.lensTarget.dispose();this.contact.dispose();this.output.dispose();}
}
