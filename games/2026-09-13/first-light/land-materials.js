// Photographic CC0 surfaces for the lake bed and banks (After the Storm's triplanar material, retuned
// for a reservoir): gravel and silt below the waterline with moving caustics, leaf litter and grass
// above it, a wet band that follows the foam atlas, and darker silt with an algae film in the depths.
import {backlight,BACKLIT_GLSL} from './backlight.js';
import * as T from './vendor/three.module.js';
export const waterLevel={value:0};
export const lakeLighting={sunHigh:{value:1},time:{value:0},wind:{value:0},seaLevel:waterLevel,clarity:{value:1}};
const dryAtlas=new T.DataTexture(new Uint8Array([0,0,0,0]),1,1);dryAtlas.needsUpdate=true;
export const shoreline={shoreMap:{value:dryAtlas},shoreCenter:{value:new T.Vector2()},shoreSpan:{value:240}};
const loader=new T.TextureLoader();
const names={sand:'coast_sand_02',rock:'coast_sand_rocks_02',soil:'forrest_ground_01',bark:'bark_brown_02'};
export const landMaps={};
await Promise.all(Object.entries(names).map(async([kind,name])=>{
 const maps={};landMaps[kind]=maps;
 await Promise.all(['diff','nor_gl','rough'].map(async channel=>{
  let texture;try{texture=await loader.loadAsync(new URL(`./assets/terrain/${name}_${channel}.jpg`,import.meta.url).href);}catch{
   const pixel=channel==='nor_gl'?[128,128,255,255]:channel==='rough'?[220,220,220,255]:[150,140,120,255];
   texture=new T.DataTexture(new Uint8Array(pixel),1,1);texture.needsUpdate=true;console.warn('Terrain texture unavailable; using fallback:',kind,channel);
  }
  texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=8;if(channel==='diff')texture.colorSpace=T.SRGBColorSpace;maps[channel]=texture;
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
export function configureTerrainMaterial(mat,{waterDetail}){
 mat.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{...shoreline,seaLevel:waterLevel,time:lakeLighting.time,wind:lakeLighting.wind,clarity:lakeLighting.clarity,sunHigh:lakeLighting.sunHigh,detailMap:{value:waterDetail},backlitSunDir:backlight.sunDir,backlitAmount:backlight.amount});
  for(const k of ['sand','rock','soil'])for(const [key,channel]of [['Color','diff'],['Normal','nor_gl'],['Rough','rough']])s.uniforms[k+key]={value:landMaps[k][channel]};
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 landP;varying vec3 landN;').replace('#include <begin_vertex>','#include <begin_vertex>\nlandP=position;landN=normal;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 landP;varying vec3 landN;uniform float seaLevel,time,wind,clarity,sunHigh;uniform vec3 backlitSunDir;uniform float backlitAmount;
uniform sampler2D shoreMap;uniform vec2 shoreCenter;uniform float shoreSpan;
uniform sampler2D sandColor,sandNormal,sandRough,rockColor,rockNormal,rockRough,soilColor,soilNormal,soilRough,detailMap;
${sampling}`);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,1.,smoothstep(0.,.3,seaLevel-landP.y));');
  s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>','{float above=smoothstep(seaLevel-.2,seaLevel+.4,landP.y);'+BACKLIT_GLSL.replace('*backlitAmount;','*backlitAmount*above;')+'}\n#include <emissivemap_fragment>');
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec3 ln=normalize(landN),tw=pow(abs(ln),vec3(5.));tw/=max(dot(tw,vec3(1.)),.001);
float macro=landNoise(landP.xz*.041)*.65+landNoise(landP.xz*.113)*.35;
float slope=1.-abs(ln.y),grade=length(ln.xz)/max(abs(ln.y),.05),altitude=landP.y-seaLevel,submerged=-altitude;
// outcrops where the bank is steep, more of them higher up the wooded side
float stoneWeight=clamp(smoothstep(.30,.62,grade+macro*.18)*(.6+.4*smoothstep(2.,9.,altitude)),0.,1.);
float plantWeight=smoothstep(.35,2.6,altitude+macro*1.6)*(1.-smoothstep(.45,.8,grade));
vec3 sandUV=landP/6.,rockUV=landP/11.,soilUV=landP/5.5;
// gravel and silt: the sand scan tinted toward wet grey-brown, darkening with depth into silt
vec3 gravel=triColor(sandColor,sandUV,tw)*vec3(.72,.70,.64);
vec3 rocky=triColor(rockColor,rockUV,tw)*vec3(.82,.80,.76);
vec3 litter=triColor(soilColor,soilUV,tw)*vec3(.95,.92,.80);
vec3 grassy=litter*vec3(.58,.74,.40)*1.1;
vec3 forestFloor=litter*vec3(.55,.52,.40)*.8;
float patches=landNoise(landP.xz*.017+4.)*.6+landNoise(landP.xz*.06)*.4;
vec3 ground=mix(mix(litter,grassy,smoothstep(1.2,4.,altitude+macro*2.)),forestFloor,smoothstep(.42,.7,patches)*smoothstep(1.5,6.,altitude));
vec3 earth=mix(mix(gravel,rocky,stoneWeight),ground,plantWeight)*(.82+macro*.3);
// silt and an algae film take over below about two metres; clarity pushes the transition deeper
float silt=smoothstep(.8*clarity,3.2*clarity,submerged);
earth=mix(earth,vec3(.19,.20,.15)*(.8+macro*.4),silt*.75);
earth=mix(earth,earth*vec3(.75,.95,.70),smoothstep(.2,1.8,submerged)*(1.-silt)*.45);
vec2 shoreUV=(landP.xz-shoreCenter)/shoreSpan+.5;
float shoreInside=step(0.,shoreUV.x)*step(shoreUV.x,1.)*step(0.,shoreUV.y)*step(shoreUV.y,1.);
vec2 beachHistory=texture2D(shoreMap,shoreUV).ba*shoreInside;
float exposure=(1.-plantWeight*.9);
float wet=max(1.-smoothstep(-.25,-.03,altitude),beachHistory.x)*exposure;
float film=beachHistory.y*exposure;
float damp=smoothstep(.015,.95,wet);
earth*=1.-damp*.42;
earth=mix(earth,earth*vec3(.88,.94,.97),film*.3);
float foamDeposit=texture2D(shoreMap,shoreUV).r*shoreInside*smoothstep(.12,.5,wet)*(1.-smoothstep(.5,.95,film));
earth=mix(earth,vec3(.70,.74,.68),smoothstep(.56,.78,landNoise(landP.xz*3.7))*clamp(foamDeposit*.38,0.,.3)*exposure);
vec2 cuv=landP.xz*.19+vec2(time*.012,-time*.007);
float c1=texture2D(detailMap,cuv).b,c2=texture2D(detailMap,mat2(.8,-.6,.6,.8)*landP.xz*.237-vec2(time*.009,0)).b;
float caustic=max(0.,min(c1,c2)*3.-.65);
earth+=vec3(.20,.24,.14)*caustic*sunHigh*smoothstep(0.,.5,submerged)*exp(-max(0.,submerged-.8)*.55/clarity); // caustics need a sun that is up and clear of the trees: a grazing sun mostly bounces off the surface
// a grazing sun barely enters the water: the bed under it goes dim until the sun is well up
earth*=mix(1.,mix(.12,1.,sunHigh*sunHigh),smoothstep(0.,.4,submerged));
float bedMask=smoothstep(.1,1.,submerged)*(1.-stoneWeight)*(1.-plantWeight);
float bedPhase=landP.x*.9+landP.z*3.6+sin(landP.x*.28)*.8;
earth*=1.+cos(bedPhase)*.05*bedMask;
diffuseColor.rgb*=earth;`);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
float sr=triColor(sandRough,sandUV,tw).r,rr=triColor(rockRough,rockUV,tw).r,gr=triColor(soilRough,soilUV,tw).r;
float dryRoughness=clamp(mix(mix(sr,rr,stoneWeight),gr,plantWeight)*.5+.42,.65,1.);
roughnessFactor=mix(dryRoughness,dryRoughness*.72,damp);
roughnessFactor=mix(roughnessFactor,.22,smoothstep(.05,.95,film)*.9);`);
  s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
vec3 surfaceN=normalize(mix(mix(triNormal(sandNormal,sandUV,tw,ln),triNormal(rockNormal,rockUV,tw,ln),stoneWeight),triNormal(soilNormal,soilUV,tw,ln),plantWeight));
surfaceN=normalize(surfaceN+vec3(.9,0.,3.6)*sin(bedPhase)*.02*bedMask);
normal=normalize((viewMatrix*vec4(normalize(mix(ln,surfaceN,.62*(1.-film*.35))),0.)).xyz);`);
 };
 mat.customProgramCacheKey=()=>'first-light-bed-v2';
}
export function rockMaterial(){
 const mat=new T.MeshStandardMaterial({color:0xcfc9bb,roughness:.9});
 mat.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{cliffColor:{value:landMaps.rock.diff},cliffNormal:{value:landMaps.rock.nor_gl},cliffSea:waterLevel});
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 cliffP;varying vec3 cliffN;varying vec3 cliffWorld;').replace('#include <begin_vertex>','#include <begin_vertex>\ncliffP=position;cliffN=normal;vec4 rockPoint=vec4(position,1.);\n#ifdef USE_INSTANCING\nrockPoint=instanceMatrix*rockPoint;\n#endif\ncliffWorld=(modelMatrix*rockPoint).xyz;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec3 cliffP;varying vec3 cliffN;varying vec3 cliffWorld;uniform sampler2D cliffColor,cliffNormal;uniform float cliffSea;${sampling}`)
   .replace('#include <color_fragment>',`#include <color_fragment>\nvec3 cn=normalize(cliffN),cw=pow(abs(cn),vec3(4.));cw/=dot(cw,vec3(1.));diffuseColor.rgb*=triColor(cliffColor,cliffP*.35,cw)*vec3(.85,.84,.80);float cliffWet=clamp(1.-smoothstep(cliffSea+.05,cliffSea+.7,cliffWorld.y),0.,1.);diffuseColor.rgb*=1.-cliffWet*.35;`)
   .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.18,cliffWet*.8);`)
   .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>\nvec3 wn=inverseTransformDirection(normal,viewMatrix),weights=pow(abs(wn),vec3(4.));weights/=dot(weights,vec3(1.));vec3 texN=triNormal(cliffNormal,cliffWorld*.35,weights,wn);normal=normalize((viewMatrix*vec4(normalize(mix(wn,texN,.5)),0.)).xyz);`);
 };mat.customProgramCacheKey=()=>'first-light-rock-v1';return mat;
}
export function barkMaterial(){return new T.MeshStandardMaterial({map:landMaps.bark.diff,normalMap:landMaps.bark.nor_gl,normalScale:new T.Vector2(.7,.7),roughnessMap:landMaps.bark.rough,roughness:.96,color:0xa89c8c});}
