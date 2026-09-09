import * as T from 'three';

/** Beam/mask appearance, not simulation of a particular tube's measured transfer function. */
export function crtMaterial(map:T.Texture){
 const material=new T.MeshBasicMaterial({map,toneMapped:false,side:T.DoubleSide,depthTest:true,depthWrite:true});
 material.name='crt_phosphor_glass';
 material.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 crtNormal;\nvarying vec3 crtPosition;').replace('#include <project_vertex>','#include <project_vertex>\ncrtNormal=normalize(mat3(modelMatrix)*normal);\ncrtPosition=(modelMatrix*vec4(transformed,1.0)).xyz;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 crtNormal;\nvarying vec3 crtPosition;').replace('#include <map_fragment>',`
   vec2 uv=vMapUv;
   float edge=pow(abs(uv.x-.5)*2.0,2.0);
   float spread=(.04+.16*edge)/294.0;
   vec3 rgb=vec3(texture2D(map,uv+vec2(spread,0)).r,texture2D(map,uv).g,texture2D(map,uv-vec2(spread,0)).b);
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
   float reflection=pow(max(dot(reflect(-viewDir,n),lamp),0.0),95.0)*.045;
   float fresnel=pow(1.0-max(dot(n,viewDir),0.0),3.0);
   vec3 glass=vec3(.0015,.0022,.0020)+vec3(1.0,.77,.43)*reflection+vec3(.004,.006,.007)*fresnel;
   diffuseColor*=vec4(rgb+halo+glass,1.0);
  `);
 };
 material.customProgramCacheKey=()=> 'defender-crt-beam-v1';
 return material;
}
