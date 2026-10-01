import * as T from 'three';
import {texture} from './assets';
import {loadArenaFloorMask} from './scenery-arena-mask';

const empty=new T.DataTexture(new Uint8Array([0,0,0,0]),1,1);empty.needsUpdate=true;
const mask={value:empty},ready={value:0};
export async function prepareReferenceFloor(){mask.value=await loadArenaFloorMask();ready.value=1;}
/** Registered photographic PBR layers: worn aggregate/tarmac, deposited gravel,
 * irregular patches and paired rubber arcs. World metres prevent scale changes
 * between the original and expanded arenas. Eight samplers before lighting. */
export function referenceArenaFloor(layout={x:0,z:0,radius:45}){
 const material=new T.MeshPhysicalMaterial({name:'Reference quarry worn floor',map:texture('circuit_asphalt_diff',1,true),normalMap:texture('circuit_asphalt_nor_gl'),roughnessMap:texture('circuit_asphalt_rough'),roughness:1,metalness:0,clearcoat:.16,clearcoatRoughness:.2});
 material.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{floorMask:mask,floorReady:ready,floorGravel:{value:texture('gravel_diff',1,true)},floorGravelN:{value:texture('gravel_nor_gl')},floorGravelR:{value:texture('gravel_rough')},floorChips:{value:texture('scree_diff',1,true)}});
  s.vertexShader='varying vec3 vFloorWorld;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFloorWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
  s.fragmentShader=`varying vec3 vFloorWorld;
uniform sampler2D floorMask,floorGravel,floorGravelN,floorGravelR,floorChips;
uniform float floorReady;
float floorHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float floorNoise(vec2 p){vec2 c=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(floorHash(c),floorHash(c+vec2(1,0)),f.x),mix(floorHash(c+vec2(0,1)),floorHash(c+vec2(1,1)),f.x),f.y);}
vec4 floorPhoto(sampler2D photo,vec2 uv){
 vec2 grid=mat2(1.,0.,-.57735027,1.15470054)*uv*.55,c=floor(grid),f=fract(grid),a,b,d;vec3 weights;
 if(f.x+f.y<1.){weights=vec3(1.-f.x-f.y,f.x,f.y);a=c;b=c+vec2(1,0);d=c+vec2(0,1);}
 else{weights=vec3(f.x+f.y-1.,1.-f.x,1.-f.y);a=c+vec2(1,1);b=c+vec2(0,1);d=c+vec2(1,0);}
 weights=pow(weights,vec3(4.));weights/=dot(weights,vec3(1.));
 vec2 dx=dFdx(uv),dy=dFdy(uv);
 return textureGrad(photo,uv+vec2(floorHash(a),floorHash(a+7.)),dx,dy)*weights.x+textureGrad(photo,uv+vec2(floorHash(b),floorHash(b+7.)),dx,dy)*weights.y+textureGrad(photo,uv+vec2(floorHash(d),floorHash(d+7.)),dx,dy)*weights.z;
}
`+s.fragmentShader;
  s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`
vec2 ground=vFloorWorld.xz;
vec2 deposit=(ground-vec2(${layout.x.toFixed(4)},${layout.z.toFixed(4)}))*45./${layout.radius.toFixed(4)};
vec4 deposits=texture2D(floorMask,(deposit+48.)/96.)*floorReady;
vec2 tarmacUV=ground/2.4,gravelUV=ground/1.7;
float macro=floorNoise(ground*.034)*.62+floorNoise(ground*.13+vec2(5.3,2.1))*.38;
float breakUp=floorNoise(ground*.7);
float floorPatch=smoothstep(.36,.62,macro+breakUp*.12);
float gravelWeight=clamp(.16+deposits.b*.68+deposits.g*.48+floorPatch*.5-deposits.r*.12,.06,.92);
vec3 worn=floorPhoto(map,tarmacUV).rgb;
vec3 grit=floorPhoto(floorGravel,gravelUV).rgb;
float gritGray=dot(grit,vec3(.2126,.7152,.0722));
grit=mix(grit,vec3(gritGray),.42)*vec3(.43,.46,.48);
worn*=vec3(.59,.61,.64);
vec3 floorColor=mix(worn,grit,gravelWeight);
floorColor*=mix(.70,1.13,macro)*mix(.90,1.05,breakUp);
float chipWeight=deposits.b*clamp((1.-deposits.r)*.53,0.,.53);
floorColor=mix(floorColor,texture2D(floorChips,ground/1.5).rgb*vec3(.62,.59,.52),chipWeight);
float rubber=0.;
for(int i=0;i<12;i++){
 float f=float(i),r=13.+f*2.75;
 vec2 c=vec2(sin(f*3.71)*22.,cos(f*2.39)*18.)+vec2(${layout.x.toFixed(4)},${layout.z.toFixed(4)});
 vec2 q=(ground-c)*vec2(1.,.91+sin(f)*.13);
 float arc=length(q)-r;
 float pair=min(abs(arc-.73),abs(arc+.73));
 float edge=max(fwidth(pair),.016);
 float angular=atan(q.y,q.x);
 float broken=smoothstep(.16,.4,sin(angular*(1.4+mod(f,3.)) +f*2.19));
 rubber=max(rubber,(1.-smoothstep(.11-edge,.14+edge,pair))*broken*(.32+breakUp*.23));
}
float wet=texture2D(floorMask,(ground+48.)/96.).a*floorReady;
wet=max(wet,smoothstep(.66,.82,macro)*.56*(1.-gravelWeight));
floorColor*=1.-rubber*.50;
floorColor*=mix(1.,.56,wet);
diffuseColor.rgb*=floorColor;
`);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`
float tarmacR=floorPhoto(roughnessMap,tarmacUV).g,gravelR=floorPhoto(floorGravelR,gravelUV).g;
float roughnessFactor=mix(mix(.53,.86,tarmacR),mix(.78,.97,gravelR),gravelWeight);
roughnessFactor=mix(roughnessFactor,.35,wet*.82);
roughnessFactor=mix(roughnessFactor,.67,rubber*.3);
`);
  s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`
#ifdef USE_NORMALMAP_TANGENTSPACE
vec3 tarN=floorPhoto(normalMap,tarmacUV).xyz*2.-1.;
vec3 gravelN=floorPhoto(floorGravelN,gravelUV).xyz*2.-1.;
tarN.xy*=.62;gravelN.xy*=.68;
mat3 tarFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,tarmacUV);
mat3 gravelFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,gravelUV);
normal=normalize(mix(normalize(tarFrame*tarN),normalize(gravelFrame*gravelN),gravelWeight));
normal=normalize(mix(normal,nonPerturbedNormal,wet*.22));
#endif
`);
  s.fragmentShader=s.fragmentShader.replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat=mix(.035,.72,wet);material.clearcoatRoughness=mix(.48,.09,wet);\n#endif');
 };
 material.customProgramCacheKey=()=>`photographic-arena-reference-v1-${layout.radius}`;
 return material;
}
