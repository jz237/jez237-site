import {waterLevel} from './simulation.js';
export const coastalLighting={time:{value:0},storm:{value:0},seaLevel:waterLevel};
import * as T from './vendor/three.module.js';

const dryAtlas=new T.DataTexture(new Uint8Array([0,0,0,255]),1,1);dryAtlas.needsUpdate=true;
export const shoreline={shoreMap:{value:dryAtlas},shoreCenter:{value:new T.Vector2()},shoreSpan:{value:240}};

// Local CC0 photographic surfaces; all instances share the same GPU textures.
const loader=new T.TextureLoader();
const names={sand:'coast_sand_02',rock:'coast_sand_rocks_02',soil:'forrest_ground_01',bark:'bark_brown_02'};
export const landMaps={};
await Promise.all(Object.entries(names).map(async([kind,name])=>{
 const maps={};landMaps[kind]=maps;
 await Promise.all(['diff','nor_gl','rough'].map(async channel=>{
  let texture;try{texture=await loader.loadAsync(new URL(`./assets/terrain/${name}_${channel}.jpg`,import.meta.url).href);}catch{
   const pixel=channel==='nor_gl'?[128,128,255,255]:channel==='rough'?[220,220,220,255]:[176,166,143,255];
   texture=new T.DataTexture(new Uint8Array(pixel),1,1);texture.needsUpdate=true;
   console.warn('Terrain texture unavailable; using built-in fallback:',kind,channel);
  }
  texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=8;
  if(channel==='diff')texture.colorSpace=T.SRGBColorSpace;
  maps[channel]=texture;
 }));
}));

const sampling=`
float landHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float landNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(landHash(i),landHash(i+vec2(1,0)),f.x),mix(landHash(i+vec2(0,1)),landHash(i+1.),f.x),f.y);}
vec3 triColor(sampler2D tex,vec3 p,vec3 weights){return texture2D(tex,p.zy).rgb*weights.x+texture2D(tex,p.xz).rgb*weights.y+texture2D(tex,p.xy).rgb*weights.z;}
vec3 triNormal(sampler2D tex,vec3 p,vec3 weights,vec3 n){
 vec3 x=texture2D(tex,p.zy).xyz*2.-1.,y=texture2D(tex,p.xz).xyz*2.-1.,z=texture2D(tex,p.xy).xyz*2.-1.;
 x=vec3(x.z*sign(n.x),x.y,x.x);y=vec3(y.x,y.z*sign(n.y),y.y);z=vec3(z.x,z.y,z.z*sign(n.z));
 return normalize(x*weights.x+y*weights.y+z*weights.z);
}`;

export function configureTerrainMaterial(mat,{palette={},waterDetail,waterLevel,time,storm}){
 mat.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{...shoreline,landSand:{value:new T.Color(palette.sand??0xdcc9a5)},landRock:{value:new T.Color(palette.rock??0xbabaae)},landGrass:{value:new T.Color(palette.grass??0x7b9349)},seaLevel:waterLevel,time,storm,detailMap:{value:waterDetail},snowCover:{value:palette.grass===0xe5f0f0?1:0}});
  for(const k of ['sand','rock','soil'])for(const [key,channel]of [['Color','diff'],['Normal','nor_gl'],['Rough','rough']])s.uniforms[k+key]={value:landMaps[k][channel]};
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 landP;varying vec3 landN;').replace('#include <begin_vertex>','#include <begin_vertex>\nlandP=position;landN=normal;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 landP;varying vec3 landN;uniform vec3 landSand,landRock,landGrass;uniform float seaLevel,time,storm,snowCover;
uniform sampler2D shoreMap;uniform vec2 shoreCenter;uniform float shoreSpan;
uniform sampler2D sandColor,sandNormal,sandRough,rockColor,rockNormal,rockRough,soilColor,soilNormal,soilRough,detailMap;
${sampling}`);
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec3 ln=normalize(landN),tw=pow(abs(ln),vec3(5.));tw/=max(dot(tw,vec3(1.)),.001);
float macro=landNoise(landP.xz*.041)*.65+landNoise(landP.xz*.113)*.35;
float slope=1.-abs(ln.y),altitude=landP.y-seaLevel;
float stoneWeight=clamp(smoothstep(.065,.36,slope)+smoothstep(1.,7.,altitude+macro*5.)*.58,0.,1.);
float plantWeight=smoothstep(2.,8.,altitude+macro*4.)*(1.-smoothstep(.10,.32,slope));
vec3 sandUV=landP/9.,rockUV=landP/13.,soilUV=landP/7.;
vec3 sandy=triColor(sandColor,sandUV,tw)*mix(vec3(1.),landSand,.28);
vec3 rocky=triColor(rockColor,rockUV,tw)*mix(vec3(1.),landRock,.15);
vec3 grassy=triColor(soilColor,soilUV,tw)*mix(vec3(1.),landGrass,.68);
vec3 earth=mix(mix(sandy,rocky,stoneWeight),grassy,plantWeight)*(.80+macro*.33);
earth=mix(earth,vec3(.76,.86,.89)*(0.85+macro*.2),snowCover*smoothstep(.15,.8,ln.y));
vec2 shoreUV=(landP.xz-shoreCenter)/shoreSpan+.5;
float shoreInside=step(0.,shoreUV.x)*step(shoreUV.x,1.)*step(0.,shoreUV.y)*step(shoreUV.y,1.);
float recentWash=texture2D(shoreMap,shoreUV).b*shoreInside;
float wet=max(1.-smoothstep(-.15,.4,altitude),recentWash)*(1.-plantWeight*.85)*(1.-snowCover);
earth*=1.-wet*.40;
vec2 cuv=landP.xz*.19+vec2(time*.012,-time*.007);
float c1=texture2D(detailMap,cuv).b,c2=texture2D(detailMap,mat2(.8,-.6,.6,.8)*landP.xz*.237-vec2(time*.009,0)).b;
float caustic=max(0.,min(c1,c2)*3.-.65),submerged=seaLevel-landP.y;
earth+=vec3(.16,.23,.13)*caustic*smoothstep(0.,.7,submerged)*exp(-max(0.,submerged-1.)*.19)*(1.-storm*.8);
// Static bed ripples are sculpted by flow; moving caustics slide over them.
float bedMask=smoothstep(.1,1.,submerged)*(1.-stoneWeight)*(1.-plantWeight);
float bedPhase=landP.x*.9+landP.z*3.6+sin(landP.x*.28)*.8;
earth*=1.+cos(bedPhase)*.065*bedMask;
diffuseColor.rgb*=earth;`);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
float sr=triColor(sandRough,sandUV,tw).r,rr=triColor(rockRough,rockUV,tw).r,gr=triColor(soilRough,soilUV,tw).r;
roughnessFactor=clamp(mix(mix(sr,rr,stoneWeight),gr,plantWeight)*.5+.42-wet*.25,.22,1.);`);
  s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
vec3 surfaceN=normalize(mix(mix(triNormal(sandNormal,sandUV,tw,ln),triNormal(rockNormal,rockUV,tw,ln),stoneWeight),triNormal(soilNormal,soilUV,tw,ln),plantWeight));
surfaceN=normalize(surfaceN+vec3(.9,0.,3.6)*sin(bedPhase)*.024*bedMask);
normal=normalize((viewMatrix*vec4(normalize(mix(ln,surfaceN,.65*(1.-snowCover*.7))),0.)).xyz);`);
 };
 mat.customProgramCacheKey=()=>`photographic-coast-bed-v3-${palette.grass??0}`;
}

export function rockMaterial(){
 const mat=new T.MeshStandardMaterial({color:0xd0cbbd,roughness:.88});
 mat.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{cliffColor:{value:landMaps.rock.diff},cliffNormal:{value:landMaps.rock.nor_gl},cliffSea:coastalLighting.seaLevel,cliffTime:coastalLighting.time,cliffStorm:coastalLighting.storm});
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 cliffP;varying vec3 cliffN;varying vec3 cliffWorld;').replace('#include <begin_vertex>','#include <begin_vertex>\ncliffP=position;cliffN=normal;vec4 rockPoint=vec4(position,1.);\n#ifdef USE_INSTANCING\nrockPoint=instanceMatrix*rockPoint;\n#endif\ncliffWorld=(modelMatrix*rockPoint).xyz;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec3 cliffP;varying vec3 cliffN;varying vec3 cliffWorld;uniform sampler2D cliffColor,cliffNormal;uniform float cliffSea,cliffTime,cliffStorm;${sampling}`)
   .replace('#include <color_fragment>',`#include <color_fragment>\nvec3 cn=normalize(cliffN),cw=pow(abs(cn),vec3(4.));cw/=dot(cw,vec3(1.));diffuseColor.rgb*=triColor(cliffColor,cliffP*.21,cw);float cliffWet=clamp(1.-smoothstep(cliffSea+.08,cliffSea+1.25,cliffWorld.y)+cliffStorm*.18,0.,1.);diffuseColor.rgb*=1.-cliffWet*.3;`)
   .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.15,cliffWet*.82);`)
   .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>\nvec3 wn=inverseTransformDirection(normal,viewMatrix),weights=pow(abs(wn),vec3(4.));weights/=dot(weights,vec3(1.));vec3 texN=triNormal(cliffNormal,cliffWorld*.21,weights,wn);normal=normalize((viewMatrix*vec4(normalize(mix(wn,texN,.5)),0.)).xyz);`);
 };mat.customProgramCacheKey=()=> 'coastal-rock-wet-v2';return mat;
}

export function barkMaterial(){return new T.MeshStandardMaterial({map:landMaps.bark.diff,normalMap:landMaps.bark.nor_gl,normalScale:new T.Vector2(.7,.7),roughnessMap:landMaps.bark.rough,roughness:.96,color:0xb0a698});}
