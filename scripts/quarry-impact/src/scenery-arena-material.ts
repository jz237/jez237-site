import * as T from 'three';
import { texture } from './assets';
import { quarryGround } from './scenery-surfaces';
import { loadArenaFloorMask } from './scenery-arena-mask';

// A neutral fallback leaves the surrounding ground material visible until the
// locally bundled mask is decoded. Loading belongs to application startup, so
// constructing scenery never performs a network request or advances world RNG.
const fallback = new T.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
fallback.needsUpdate = true;
const floorMask = { value: fallback };
const floorReady = { value: 0 };
export async function prepareArenaFloor() {
  floorMask.value = await loadArenaFloorMask();
  floorReady.value = 1;
}

/** The arena alone uses the authored deposits. Roads retain quarryAggregate. */
export function quarryArenaSurface() {
  const material = quarryGround();
  material.name = 'authored-arena-floor';
  const compileBase = material.onBeforeCompile;
  const stone = texture('scree_diff', 1, true);
  const stoneNormal = texture('scree_nor_gl', 1);
  const stoneRoughness = texture('scree_rough', 1);
  const gravelNormal = texture('gravel_nor_gl', 1);
  const gravelRoughness = texture('gravel_rough', 1);
  material.onBeforeCompile = (shader, renderer) => {
    compileBase(shader, renderer);
    Object.assign(shader.uniforms, {
      arenaMask: floorMask, arenaReady: floorReady,
      arenaStone: { value: stone }, arenaStoneNormal: { value: stoneNormal },
      arenaStoneRoughness: { value: stoneRoughness },
      arenaGravelNormal: { value: gravelNormal }, arenaGravelRoughness: { value: gravelRoughness },
    });
    // Match the surrounding terrain's exact nine-metre mud UV phase where the
    // new arena treatment fades out. Original geometry/UV buffers stay intact.
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
vMapUv=vQuarryPosition.xz/9.0;
vNormalMapUv=vMapUv;
vRoughnessMapUv=vMapUv;
#include <project_vertex>`);
    shader.fragmentShader = `
uniform sampler2D arenaMask, arenaStone, arenaStoneNormal, arenaStoneRoughness;
uniform sampler2D arenaGravelNormal, arenaGravelRoughness;
#define quarryDirt map
#define quarryDirtNormal normalMap
#define quarryDirtRoughness roughnessMap
uniform float arenaReady;
vec2 arenaTileOffset(vec2 p) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
// Identical translations register the photographic color, relief and gloss.
// Explicit gradients keep the mip level continuous at stochastic tile edges.
vec4 arenaPhoto(sampler2D photo,vec2 uv,vec2 dx,vec2 dy,vec3 w,vec2 a,vec2 b,vec2 c) {
  return textureGrad(photo,uv+a,dx,dy)*w.x+textureGrad(photo,uv+b,dx,dy)*w.y+textureGrad(photo,uv+c,dx,dy)*w.z;
}
` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', `
vec2 arenaWorld=vQuarryPosition.xz;
vec4 arenaPaint=texture2D(arenaMask,(arenaWorld+48.0)/96.0);
float arenaCoverage=arenaReady*(1.0-smoothstep(40.0,45.0,length(arenaWorld)));
float arenaCompact=arenaPaint.r;
float arenaWet=arenaPaint.a;
float arenaFine=clamp(.10+arenaPaint.g*.54+arenaCompact*.42,0.0,.86);
float arenaCoarse=clamp(.38+arenaPaint.b*1.20,0.0,.96)*(1.0-arenaCompact*.92)*(1.0-arenaPaint.g*.60)*(1.0-arenaWet*.68);
vec2 arenaGravelUV=arenaWorld/2.0,arenaFineUV=arenaWorld/1.6,arenaStoneUV=arenaWorld/1.5;
vec2 arenaGravelDx=dFdx(arenaGravelUV),arenaGravelDy=dFdy(arenaGravelUV);
vec2 arenaFineDx=dFdx(arenaFineUV),arenaFineDy=dFdy(arenaFineUV);
vec2 arenaStoneDx=dFdx(arenaStoneUV),arenaStoneDy=dFdy(arenaStoneUV);
vec2 arenaGrid=mat2(1.0,0.0,-.57735027,1.15470054)*arenaGravelUV/1.3;
vec2 arenaCell=floor(arenaGrid),arenaFrac=fract(arenaGrid);
vec3 arenaWeights;vec2 arenaA,arenaB,arenaC;
if(arenaFrac.x+arenaFrac.y<1.0) {
  arenaWeights=vec3(1.0-arenaFrac.x-arenaFrac.y,arenaFrac.x,arenaFrac.y);
  arenaA=arenaCell;arenaB=arenaCell+vec2(1,0);arenaC=arenaCell+vec2(0,1);
} else {
  arenaWeights=vec3(arenaFrac.x+arenaFrac.y-1.0,1.0-arenaFrac.x,1.0-arenaFrac.y);
  arenaA=arenaCell+vec2(1,1);arenaB=arenaCell+vec2(0,1);arenaC=arenaCell+vec2(1,0);
}
arenaWeights=pow(arenaWeights,vec3(4.0));arenaWeights/=dot(arenaWeights,vec3(1.0));
arenaA=arenaTileOffset(arenaA);arenaB=arenaTileOffset(arenaB);arenaC=arenaTileOffset(arenaC);
vec3 arenaGravel=arenaPhoto(quarryGravel,arenaGravelUV,arenaGravelDx,arenaGravelDy,arenaWeights,arenaA,arenaB,arenaC).rgb;
float arenaGray=dot(arenaGravel,vec3(.2126,.7152,.0722));
arenaGravel=mix(arenaGravel,vec3(arenaGray),.67)*vec3(.51,.51,.49);
vec3 arenaSediment=textureGrad(quarryDirt,arenaFineUV,arenaFineDx,arenaFineDy).rgb;
float arenaFineGray=dot(arenaSediment,vec3(.2126,.7152,.0722));
arenaSediment=mix(arenaSediment,vec3(arenaFineGray),.85)*vec3(.60,.58,.54);
vec3 arenaColor=mix(arenaGravel,arenaSediment,arenaFine);
if(arenaCoarse>.001) {
  vec3 chips=arenaPhoto(arenaStone,arenaStoneUV,arenaStoneDx,arenaStoneDy,arenaWeights,arenaA,arenaB,arenaC).rgb;
  float gray=dot(chips,vec3(.2126,.7152,.0722));
  // Keep individual photographed fragments legible through deposit edges;
  // uniform low-opacity stone layers otherwise look like blurred stains.
  float edgeGrain=mix(.48,1.0,smoothstep(.04,.24,gray));
  arenaCoarse*=mix(edgeGrain,1.0,smoothstep(.16,.54,arenaPaint.b));
  chips=mix(chips,vec3(gray),.28)*vec3(.81,.80,.77);
  arenaColor=mix(arenaColor,chips,arenaCoarse);
}
arenaColor*=mix(1.0,.94,arenaCompact)*mix(1.0,.64,arenaWet);
diffuseColor.rgb=mix(diffuseColor.rgb,arenaColor,arenaCoverage);
#include <alphamap_fragment>`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <metalnessmap_fragment>', `
#include <metalnessmap_fragment>
float arenaGravelR=arenaPhoto(arenaGravelRoughness,arenaGravelUV,arenaGravelDx,arenaGravelDy,arenaWeights,arenaA,arenaB,arenaC).g;
float arenaFineR=textureGrad(quarryDirtRoughness,arenaFineUV,arenaFineDx,arenaFineDy).g;
float arenaRough=mix(mix(.85,.98,arenaGravelR),mix(.79,.94,arenaFineR),arenaFine);
if(arenaCoarse>.001) {
  float stoneR=arenaPhoto(arenaStoneRoughness,arenaStoneUV,arenaStoneDx,arenaStoneDy,arenaWeights,arenaA,arenaB,arenaC).g;
  arenaRough=mix(arenaRough,mix(.88,1.0,stoneR),arenaCoarse);
}
arenaRough-=arenaCompact*.045;
arenaRough=mix(arenaRough,mix(.30,.47,arenaFineR),arenaWet);
roughnessFactor=mix(roughnessFactor,arenaRough,arenaCoverage);`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <clearcoat_normal_fragment_begin>', `
#ifdef USE_NORMALMAP_TANGENTSPACE
vec3 arenaGravelN=arenaPhoto(arenaGravelNormal,arenaGravelUV,arenaGravelDx,arenaGravelDy,arenaWeights,arenaA,arenaB,arenaC).xyz*2.0-1.0;
vec3 arenaFineN=textureGrad(quarryDirtNormal,arenaFineUV,arenaFineDx,arenaFineDy).xyz*2.0-1.0;
arenaGravelN.xy*=mix(.72,.24,arenaCompact)*(1.0-arenaWet*.45);
arenaFineN.xy*=mix(.33,.13,arenaCompact)*(1.0-arenaWet*.3);
// The wet mesh's native V points towards -worldZ. Each world-space texture
// therefore needs its own derivative frame, even on this horizontal surface.
mat3 arenaGravelFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,arenaGravelUV);
mat3 arenaFineFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,arenaFineUV);
mat3 arenaStoneFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,arenaStoneUV);
#if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
arenaGravelFrame[0]*=faceDirection;arenaGravelFrame[1]*=faceDirection;
arenaFineFrame[0]*=faceDirection;arenaFineFrame[1]*=faceDirection;
arenaStoneFrame[0]*=faceDirection;arenaStoneFrame[1]*=faceDirection;
#endif
vec3 arenaN=normalize(mix(normalize(arenaGravelFrame*arenaGravelN),normalize(arenaFineFrame*arenaFineN),arenaFine));
if(arenaCoarse>.001) {
  vec3 stoneN=arenaPhoto(arenaStoneNormal,arenaStoneUV,arenaStoneDx,arenaStoneDy,arenaWeights,arenaA,arenaB,arenaC).xyz*2.0-1.0;
  stoneN.xy*=mix(.84,.34,arenaWet);
  arenaN=normalize(mix(arenaN,normalize(arenaStoneFrame*stoneN),arenaCoarse));
}
normal=normalize(mix(normal,arenaN,arenaCoverage));
#endif
#include <clearcoat_normal_fragment_begin>`);
  };
  material.customProgramCacheKey = () => 'authored-arena-floor-v3';
  return material;
}
