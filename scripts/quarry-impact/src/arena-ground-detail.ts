import * as T from 'three';
import {texture} from './assets';
export type ArenaGroundKind='foundry'|'harrow'|'briarhill';
/** Add metre-scaled photographic detail without moving the painted layout or terrain.
 * Maps are shared by the existing asset cache; arena disposal must not free them. */
export function attachArenaGroundDetail(material:T.MeshStandardMaterial,kind:ArenaGroundKind,load=texture){
 const base=kind==='briarhill'?'mud':'asphalt',loose=kind==='foundry'?'gravel':base;
 const maps={baseColor:load(base+'_diff',1,true),baseNormal:load(base+'_nor_gl',1),baseRough:load(base+'_rough',1),looseColor:load(loose+'_diff',1,true),looseNormal:load(loose+'_nor_gl',1),looseRough:load(loose+'_rough',1)};
 material.normalMap=maps.baseNormal;material.normalScale.setScalar(.55);material.roughness=1;
 const prior=material.onBeforeCompile;
 material.onBeforeCompile=(shader,renderer)=>{
  prior(shader,renderer);
  for(const [key,value]of Object.entries(maps))shader.uniforms['arena'+key]={value};
  shader.vertexShader='varying vec3 vArenaGround;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','vArenaGround=(modelMatrix*vec4(transformed,1.0)).xyz;\n#include <project_vertex>');
  shader.fragmentShader=`varying vec3 vArenaGround;
uniform sampler2D arenabaseColor,arenabaseNormal,arenabaseRough,arenalooseColor,arenalooseNormal,arenalooseRough;
float arenaHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float arenaNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(arenaHash(i),arenaHash(i+vec2(1,0)),f.x),mix(arenaHash(i+vec2(0,1)),arenaHash(i+vec2(1,1)),f.x),f.y);}
`+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
vec2 arenaP=vArenaGround.xz;
vec2 arenaUV=arenaP/${kind==='briarhill'?'3.0':'4.0'};
float arenaLoose=${kind==='foundry'?'1.0-smoothstep(11.7,12.3,abs(arenaP.y+.3*arenaP.x))':'0.0'};
vec3 arenaPhoto=mix(texture2D(arenabaseColor,arenaUV).rgb,texture2D(arenalooseColor,arenaUV).rgb,arenaLoose);
// Keep white starting boxes and material colour from the existing layout map.
float arenaGrain=clamp(dot(arenaPhoto,vec3(.2126,.7152,.0722))*4.5,.42,1.65);
float arenaWear=arenaNoise(arenaP*.17)*.65+arenaNoise(arenaP*.73)*.35;
diffuseColor.rgb*=arenaGrain*mix(.76,1.08,arenaWear);
`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
float arenaRough=mix(texture2D(arenabaseRough,arenaUV).g,texture2D(arenalooseRough,arenaUV).g,arenaLoose);
roughnessFactor=mix(${kind==='briarhill'?'.84':'.78'},.99,arenaRough);
`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
#ifdef USE_NORMALMAP_TANGENTSPACE
vec3 arenaN=mix(texture2D(arenabaseNormal,arenaUV).xyz,texture2D(arenalooseNormal,arenaUV).xyz,arenaLoose)*2.0-1.0;
arenaN.xy*=normalScale;
mat3 arenaFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,arenaUV);
#if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
arenaFrame[0]*=faceDirection;arenaFrame[1]*=faceDirection;
#endif
normal=normalize(arenaFrame*normalize(arenaN));
#else
#include <normal_fragment_maps>
#endif`);
 };
 material.customProgramCacheKey=()=>`arena-ground-detail-v1-${kind}`;
 material.needsUpdate=true;
}
