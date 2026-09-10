import * as T from 'three';

/** Beam/mask appearance, not simulation of a particular tube's measured transfer function. */
export function crtMaterial(map:T.Texture,history:T.Texture){
 const material=new T.MeshBasicMaterial({map,toneMapped:false,side:T.DoubleSide,depthTest:true,depthWrite:true});
 material.name='crt_phosphor_glass';
 material.onBeforeCompile=shader=>{
  shader.uniforms.phosphorHistory={value:history};
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 crtNormal;\nvarying vec3 crtPosition;').replace('#include <project_vertex>','#include <project_vertex>\ncrtNormal=normalize(mat3(modelMatrix)*normal);\ncrtPosition=(modelMatrix*vec4(transformed,1.0)).xyz;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 crtNormal;\nvarying vec3 crtPosition;\nuniform sampler2D phosphorHistory;').replace('#include <map_fragment>',`
   vec2 uv=vMapUv;
   float edge=pow(abs(uv.x-.5)*2.0,2.0);
   float spread=(.04+.16*edge)/294.0;
   vec3 rgb=vec3(texture2D(map,uv+vec2(spread,0)).r,texture2D(map,uv).g,texture2D(map,uv-vec2(spread,0)).b);
   // A faint, short-lived residual retains pixel definition rather than blurring the frame.
   rgb=max(rgb,texture2D(phosphorHistory,uv).rgb*vec3(.20,.27,.18));
   // Integrate unresolved phosphor structure instead of allowing moire / black scanline bands.
   float beamFootprint=length(vec2(dFdx(uv.y),dFdy(uv.y)))*240.0;
   float resolved=1.0-smoothstep(.28,1.05,beamFootprint);
   float beam=.78+.22*cos((uv.y*240.0-.5)*6.283185307);
   rgb*=mix(.96,beam,resolved);
   float maskFootprint=length(vec2(dFdx(uv.x),dFdy(uv.x)))*1440.0;
   float maskResolved=1.0-smoothstep(.30,.90,maskFootprint);
   float column=mod(floor(uv.x*1440.0),3.0);
   vec3 stripe=column<1.0?vec3(1.0,.73,.73):column<2.0?vec3(.73,1.0,.73):vec3(.73,.73,1.0);
   rgb*=mix(vec3(1.0),stripe,maskResolved*.55);
   vec3 halo=(texture2D(map,uv+vec2(0,1.0/240.0)).rgb+texture2D(map,uv-vec2(0,1.0/240.0)).rgb)*.027;
   vec3 viewDir=normalize(cameraPosition-crtPosition);
   vec3 n=normalize(crtNormal);if(dot(n,viewDir)<0.0)n=-n;
   vec3 lamp=normalize(vec3(.5,4.08,.2)-crtPosition);
   vec3 reflected=reflect(-viewDir,n);
   float reflection=pow(max(dot(reflected,lamp),0.0),70.0)*.038;
   // Broad room practicals reflect in the curved face; no opaque glass mesh can hide the game.
   vec3 windowDir=normalize(vec3(-3.2,3.7,4.0)-crtPosition);
   float softbox=pow(max(dot(reflected,windowDir),0.0),42.0)*.012;
   float rim=pow(abs(uv.x-.5)*2.0,12.0)+pow(abs(uv.y-.5)*2.0,12.0);
   rgb*=1.0-clamp(rim*.075,0.0,.14);
   float fresnel=pow(1.0-max(dot(n,viewDir),0.0),3.0);
   vec3 glass=vec3(.0015,.0022,.0020)+vec3(1.0,.77,.43)*reflection+vec3(.004,.006,.007)*fresnel+vec3(.52,.68,.78)*softbox;
   diffuseColor*=vec4(rgb+halo+glass,1.0);
  `);
 };
 material.customProgramCacheKey=()=> 'defender-crt-glass-v2';
 return material;
}

/** Exponential decay at the native framebuffer size keeps the cost and trail length bounded. */
export function phosphorHistory(source:HTMLCanvasElement){
 const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;const c=canvas.getContext('2d')!;
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.NearestFilter;texture.minFilter=T.LinearFilter;texture.generateMipmaps=false;
 return {texture,update(dt:number,enabled:boolean){c.globalCompositeOperation='source-over';c.globalAlpha=1;c.fillStyle=enabled?`rgba(0,0,0,${1-Math.exp(-Math.min(dt,.2)/.026)})`:'#000';c.fillRect(0,0,canvas.width,canvas.height);if(enabled){c.globalCompositeOperation='lighten';c.drawImage(source,0,0);}texture.needsUpdate=true;}};
}
