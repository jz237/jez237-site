import * as T from 'three';
import { texture } from './assets';
import { quarryGround } from './scenery-surfaces';
import { loadNorthForestFloor, NORTH_FLOOR_BOUNDS } from './scenery-north-floor-mask';
import spec from '../source/north-forest-floor.json';
import { northMineralGLSL } from './scenery-north-mineral';

const neutral = new T.DataTexture(new Uint8Array(4), 1, 1);
neutral.needsUpdate = true;
export const northFloorWeights = { value: neutral }, northFloorReady = { value: 0 };
const weights = northFloorWeights, ready = northFloorReady;
export async function prepareNorthForestFloor() {
  weights.value = await loadNorthForestFloor();
  ready.value = 1;
}

/** Wrap only the terrain. The arena, roads, cliffs and their shader keys stay intact. */
export function northForestGround() {
  const material = quarryGround();
  const compile = material.onBeforeCompile;
  const photos = {
    northLitterColor: texture('north_litter_diff', 1, true),
    northLitterNormal: texture('north_litter_nor_gl', 1),
    northLitterRough: texture('north_litter_rough', 1),
    northStoneNormal: texture('gravel_nor_gl', 1),
    northStoneRough: texture('gravel_rough', 1),
  };
  const [x0, z0, x1, z1] = NORTH_FLOOR_BOUNDS;
  material.onBeforeCompile = (shader, renderer) => {
    compile(shader, renderer);
    shader.uniforms.northFloorMask = weights;
    shader.uniforms.northFloorReady = ready;
    shader.uniforms.northFloorBounds = { value: new T.Vector4(x0, z0, x1 - x0, z1 - z0) };
    for (const [name, value] of Object.entries(photos)) shader.uniforms[name] = { value };
    shader.fragmentShader = northMineralGLSL + `
uniform sampler2D northFloorMask, northLitterColor, northLitterNormal, northLitterRough;
uniform sampler2D northStoneNormal, northStoneRough;
uniform vec4 northFloorBounds;
uniform float northFloorReady;
vec2 northOffset(vec2 cell) {
  return fract(sin(vec2(dot(cell,vec2(127.1,311.7)),dot(cell,vec2(269.5,183.3))))*43758.5453);
}
vec4 northPhoto(sampler2D photo,vec2 uv,vec2 dx,vec2 dy,vec3 w,vec2 a,vec2 b,vec2 c) {
  return textureGrad(photo,uv+a,dx,dy)*w.x+textureGrad(photo,uv+b,dx,dy)*w.y+textureGrad(photo,uv+c,dx,dy)*w.z;
}
` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', `
vec2 northWorld=vQuarryPosition.xz;
vec4 northPaint=texture2D(northFloorMask,(northWorld-northFloorBounds.xy)/northFloorBounds.zw);
// Rock faces retain their original treatment. Only the seated soil surface
// beneath the authored trees receives leaf litter and loose mineral margins.
float northUp=abs(normalize(cross(dFdx(vQuarryPosition),dFdy(vQuarryPosition))).y);
float northCoverage=northFloorReady*northPaint.r*smoothstep(.55,.88,northUp);
float northOrganic=northPaint.g,northCoarse=mix(.3,.65,northPaint.a)*(1.0-northPaint.g);
float northCrestBlend=northPaint.b*northFloorReady*smoothstep(.55,.88,northUp);
vec2 northLitterUV=northWorld/${spec.textureScaleMetres.litter.toFixed(1)};
vec2 northStoneUV=northWorld/${spec.textureScaleMetres.mineral.toFixed(1)};
vec2 northSoilUV=northWorld/${spec.textureScaleMetres.soil.toFixed(1)};
vec2 northLitterDx=dFdx(northLitterUV),northLitterDy=dFdy(northLitterUV);
vec2 northStoneDx=dFdx(northStoneUV),northStoneDy=dFdy(northStoneUV);
vec2 northSoilDx=dFdx(northSoilUV),northSoilDy=dFdy(northSoilUV);
vec2 northGrid=mat2(1.0,0.0,-.57735027,1.15470054)*northLitterUV*.65;
vec2 northCell=floor(northGrid),northFrac=fract(northGrid);
vec3 northWeights;vec2 northA,northB,northC;
if(northFrac.x+northFrac.y<1.0) {
  northWeights=vec3(1.0-northFrac.x-northFrac.y,northFrac.x,northFrac.y);
  northA=northCell;northB=northCell+vec2(1,0);northC=northCell+vec2(0,1);
} else {
  northWeights=vec3(northFrac.x+northFrac.y-1.0,1.0-northFrac.x,1.0-northFrac.y);
  northA=northCell+vec2(1,1);northB=northCell+vec2(0,1);northC=northCell+vec2(1,0);
}
northWeights=pow(northWeights,vec3(4.0));northWeights/=dot(northWeights,vec3(1));
northA=northOffset(northA);northB=northOffset(northB);northC=northOffset(northC);
if(northCoverage>.001) {
  vec3 litter=northPhoto(northLitterColor,northLitterUV,northLitterDx,northLitterDy,northWeights,northA,northB,northC).rgb;
  // Retain photographic twigs and leaves with restrained living-green patches.
  float litterGray=dot(litter,vec3(.2126,.7152,.0722));
  litter=mix(litter,vec3(litterGray),.25)*vec3(.57,.53,.45)*mix(.85,1.08,northPaint.a);
  vec3 soil=textureGrad(map,northSoilUV,northSoilDx,northSoilDy).rgb;
  float soilGray=dot(soil,vec3(.2126,.7152,.0722));
  soil=mix(soil,vec3(soilGray),.65)*vec3(.59,.54,.45);
  vec3 stone=northPhoto(quarryGravel,northStoneUV,northStoneDx,northStoneDy,northWeights,northA,northB,northC).rgb;
  float stoneGray=dot(stone,vec3(.2126,.7152,.0722));
  stone=mix(stone,vec3(stoneGray),.45)*vec3(.71,.69,.64);
  vec3 mineral=mix(soil,stone,northCoarse);
  diffuseColor.rgb=mix(diffuseColor.rgb,mix(mineral,litter,northOrganic),northCoverage);
  vec3 crestPhoto=textureGrad(quarryGravel,northStoneUV,northStoneDx,northStoneDy).rgb;
  diffuseColor.rgb=mix(diffuseColor.rgb,northMineralColor(crestPhoto),northCrestBlend);
}
#include <alphamap_fragment>`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <metalnessmap_fragment>', `
#include <metalnessmap_fragment>
if(northCoverage>.001) {
  float organicR=northPhoto(northLitterRough,northLitterUV,northLitterDx,northLitterDy,northWeights,northA,northB,northC).g;
  float stoneR=northPhoto(northStoneRough,northStoneUV,northStoneDx,northStoneDy,northWeights,northA,northB,northC).g;
  float soilR=textureGrad(roughnessMap,northSoilUV,northSoilDx,northSoilDy).g;
  float mineralR=mix(mix(.84,.96,soilR),mix(.87,1.0,stoneR),northCoarse);
  roughnessFactor=mix(roughnessFactor,mix(mineralR,mix(.82,.99,organicR),northOrganic),northCoverage);
  roughnessFactor=mix(roughnessFactor,mix(.86,.98,textureGrad(northStoneRough,northStoneUV,northStoneDx,northStoneDy).g),northCrestBlend);
}`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <clearcoat_normal_fragment_begin>', `
#ifdef USE_NORMALMAP_TANGENTSPACE
  mat3 litterFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,northLitterUV);
  mat3 stoneFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,northStoneUV);
  mat3 soilFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,northSoilUV);
  #if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
  litterFrame[0]*=faceDirection;litterFrame[1]*=faceDirection;
  stoneFrame[0]*=faceDirection;stoneFrame[1]*=faceDirection;
  soilFrame[0]*=faceDirection;soilFrame[1]*=faceDirection;
  #endif
if(northCoverage>.001) {
  vec3 litterN=northPhoto(northLitterNormal,northLitterUV,northLitterDx,northLitterDy,northWeights,northA,northB,northC).xyz*2.0-1.0;
  vec3 stoneN=northPhoto(northStoneNormal,northStoneUV,northStoneDx,northStoneDy,northWeights,northA,northB,northC).xyz*2.0-1.0;
  vec3 soilN=textureGrad(normalMap,northSoilUV,northSoilDx,northSoilDy).xyz*2.0-1.0;
  litterN.xy*=.65;stoneN.xy*=.63;soilN.xy*=.27;
  vec3 mineralN=normalize(mix(normalize(soilFrame*soilN),normalize(stoneFrame*stoneN),northCoarse));
  normal=normalize(mix(normal,normalize(mix(mineralN,normalize(litterFrame*litterN),northOrganic)),northCoverage));
  vec3 crestN=textureGrad(northStoneNormal,northStoneUV,northStoneDx,northStoneDy).xyz*2.0-1.0;
  crestN.xy*=.63;
  normal=normalize(mix(normal,normalize(stoneFrame*crestN),northCrestBlend));
}
#endif
#include <clearcoat_normal_fragment_begin>`);
  };
  material.customProgramCacheKey = () => 'north-woodland-floor-v3';
  return material;
}
