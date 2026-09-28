import * as T from 'three';
import { texture, url } from './assets';
import { quarryAggregate } from './scenery-surfaces';
import { CIRCUIT_LENGTH } from './scenery-circuit-layout';

export const CIRCUIT_MASK_SIZE = [2048, 128] as const;
export const CIRCUIT_MASK_PATH = 'assets/circuit-surface.rgba.gz';
const fallback = new T.DataTexture(new Uint8Array(4), 1, 1);
fallback.needsUpdate = true;
const weights = { value: fallback }, ready = { value: 0 };
let pending: Promise<void> | undefined;

/** Authored material data is shared by the lane and its existing shoulders. */
export function prepareCircuitSurface() {
  return pending ??= (async () => {
    const response = await fetch(url(CIRCUIT_MASK_PATH));
    if (!response.ok || !response.body) throw new Error(`Circuit surface request failed: ${response.status}`);
    const bytes = new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    const [width, height] = CIRCUIT_MASK_SIZE;
    if (bytes.length !== width * height * 4) throw new Error('Circuit surface has invalid decoded size');
    const mask = new T.DataTexture(bytes, width, height, T.RGBAFormat, T.UnsignedByteType);
    mask.name = 'CircuitSurfaceWeights';
    mask.colorSpace = T.NoColorSpace;
    mask.flipY = false;
    mask.wrapS = T.RepeatWrapping;
    mask.wrapT = T.ClampToEdgeWrapping;
    mask.magFilter = T.LinearFilter;
    mask.minFilter = T.LinearMipmapLinearFilter;
    mask.generateMipmaps = true;
    mask.anisotropy = 8;
    mask.needsUpdate = true;
    weights.value = mask;
    ready.value = 1;
  })().catch((error: unknown) => { pending = undefined; throw error; });
}

/** Macro photography stays at 30 m; the separate asphalt scan covers 3 m.
 * Translated stochastic samples register color, relief and roughness exactly.
 * R/G/B/A are pavement, repairs, rubber and mineral deposits, not display color.
 */
export function quarryCircuitSurface() {
  const material = quarryAggregate(), compile = material.onBeforeCompile;
  material.name = 'authored-asphalt-circuit';
  const micro = texture('circuit_asphalt_diff', 1, true);
  const normal = texture('circuit_asphalt_nor_gl', 1);
  const roughness = texture('circuit_asphalt_rough', 1);
  const aerial = texture('asphalt_diff', 1, true);
  const forest = texture('forrest_ground_01_diff', 1, true);
  material.onBeforeCompile = (shader, renderer) => {
    compile(shader, renderer);
    Object.assign(shader.uniforms, {
      circuitMask: weights, circuitReady: ready,
      circuitMicro: { value: micro }, circuitNormal: { value: normal }, circuitRough: { value: roughness },
      circuitAerial: { value: aerial }, circuitForest: { value: forest },
      circuitGroundColor: { value: new T.Color(0xb2ae9d) },
    });
    shader.vertexShader = 'attribute vec2 circuitMetres; attribute float circuitEdge; varying vec2 vCircuitMetres; varying float vCircuitEdge;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
vCircuitMetres=circuitMetres; vCircuitEdge=circuitEdge;`);
    shader.fragmentShader = `
varying vec2 vCircuitMetres;
varying float vCircuitEdge;
uniform sampler2D circuitMask,circuitMicro,circuitNormal,circuitRough,circuitAerial,circuitForest;
uniform float circuitReady;
uniform vec3 circuitGroundColor;
vec2 circuitOffset(vec2 p) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
vec4 circuitPhoto(sampler2D photo,vec2 uv,vec2 dx,vec2 dy,vec3 w,vec2 a,vec2 b,vec2 c) {
  return textureGrad(photo,uv+a,dx,dy)*w.x+textureGrad(photo,uv+b,dx,dy)*w.y+textureGrad(photo,uv+c,dx,dy)*w.z;
}
` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', `
vec2 cWorld=vQuarryPosition.xz;
vec2 cMaskUV=vec2(vCircuitMetres.x/${CIRCUIT_LENGTH.toFixed(9)},(vCircuitMetres.y+10.0)/20.0);
vec4 cPaint=texture2D(circuitMask,cMaskUV);
float cGate=texture2D(circuitMask,vec2(cMaskUV.x,.5)).r*circuitReady;
float cGrain=quarryNoise(cWorld*7.0);
float cCoverage=smoothstep(.13,.87,cPaint.r+(cGrain-.5)*.40*pow(max(0.0,4.0*cPaint.r*(1.0-cPaint.r)),.45));
float cRepair=clamp(cPaint.g+(cGrain-.5)*cPaint.g*(1.0-cPaint.g)*.7,0.0,1.0);
float cRubber=cPaint.b*mix(.72,1.0,cGrain);
float cMineral=max(1.0-cCoverage,cPaint.a*.82);
// Compacted fines interrupt the ordinary verge; the authored fans expose
// brighter loose aggregate and continue onto the pavement as mineral deposits.
float cFines=clamp((.42+quarryNoise(cWorld*.17+vec2(3.1,7.2))*.40)*(1.0-cPaint.a*.90),.04,.85);
float cGroundBlend=1.0-smoothstep(0.0,.52+(quarryNoise(cWorld*.83)-.5)*.28,clamp(vCircuitEdge,0.0,1.0));
vec2 cUV=cWorld/3.0,cLooseUV=cWorld/2.0,cGroundUV=cWorld/9.0,cFineUV=cWorld/1.6;
vec3 cWorldDx=dFdx(vQuarryPosition),cWorldDy=dFdy(vQuarryPosition);
vec2 cDx=dFdx(cUV),cDy=dFdy(cUV),cLooseDx=dFdx(cLooseUV),cLooseDy=dFdy(cLooseUV);
vec2 cGroundDx=dFdx(cGroundUV),cGroundDy=dFdy(cGroundUV);
vec2 cFineDx=dFdx(cFineUV),cFineDy=dFdy(cFineUV);
vec2 cGrid=mat2(1.0,0.0,-.57735027,1.15470054)*cUV/1.3;
vec2 cCell=floor(cGrid),cFrac=fract(cGrid),cA,cB,cC;
vec3 cWeights;
if(cFrac.x+cFrac.y<1.0) {
  cWeights=vec3(1.0-cFrac.x-cFrac.y,cFrac.x,cFrac.y);
  cA=cCell;cB=cCell+vec2(1,0);cC=cCell+vec2(0,1);
} else {
  cWeights=vec3(cFrac.x+cFrac.y-1.0,1.0-cFrac.x,1.0-cFrac.y);
  cA=cCell+vec2(1,1);cB=cCell+vec2(0,1);cC=cCell+vec2(1,0);
}
cWeights=pow(cWeights,vec3(4.0));cWeights/=dot(cWeights,vec3(1.0));
cA=circuitOffset(cA);cB=circuitOffset(cB);cC=circuitOffset(cC);
if(cGate>.001) {
  vec3 photo=circuitPhoto(circuitMicro,cUV,cDx,cDy,cWeights,cA,cB,cC).rgb;
  float gray=dot(photo,vec3(.2126,.7152,.0722));
  vec3 asphalt=mix(photo,vec3(gray),.45)*vec3(.84,.85,.86);
  vec3 macro=textureGrad(circuitAerial,cWorld/30.0,cWorldDx.xz/30.0,cWorldDy.xz/30.0).rgb;
  float aging=clamp(pow(max(.01,dot(macro,vec3(.2126,.7152,.0722)))/.14,.30),.75,1.22);
  asphalt*=mix(aging,1.0,cRepair)*mix(1.0,.64,cRepair)*mix(1.0,.54,cRubber);
  vec3 loose=textureGrad(map,cLooseUV,cLooseDx,cLooseDy).rgb;
  float looseGray=dot(loose,vec3(.2126,.7152,.0722));
  loose=mix(loose,vec3(looseGray),.74)*vec3(.63,.62,.58);
  vec3 fines=textureGrad(quarryDirt,cFineUV,cFineDx,cFineDy).rgb;
  float finesGray=dot(fines,vec3(.2126,.7152,.0722));
  fines=mix(fines,vec3(finesGray),.90)*vec3(.50,.49,.46);
  loose=mix(loose,fines,cFines);
  vec3 finish=mix(asphalt,loose,cMineral);
  if(cGroundBlend>.001) {
    // Match the surrounding terrain's original photograph phase and response.
    float macroGround=quarryNoise(cWorld*.024)*.6+quarryNoise(cWorld*.087)*.4;
    float forestWeight=smoothstep(111.0,152.0,length(cWorld*vec2(.925,1.0))+macroGround*20.0);
    vec3 ground=textureGrad(quarryDirt,cGroundUV,cGroundDx,cGroundDy).rgb*circuitGroundColor;
    vec3 grit=textureGrad(map,cLooseUV,cLooseDx,cLooseDy).rgb;
    vec3 litter=textureGrad(circuitForest,cWorld/5.5,cWorldDx.xz/5.5,cWorldDy.xz/5.5).rgb;
    ground=mix(ground,grit*.77,smoothstep(.29,.73,macroGround)*.67);
    ground=mix(ground,litter*.69,forestWeight)*mix(.76,1.04,macroGround);
    // Every original road/shoulder triangle has abs(normal.y)>.997; the
    // terrain's exposed-rock factor is exactly zero on this entire footprint.
    finish=mix(finish,ground,cGroundBlend);
  }
  diffuseColor.rgb=mix(diffuseColor.rgb,finish,cGate);
}
#include <alphamap_fragment>`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <metalnessmap_fragment>', `
#include <metalnessmap_fragment>
if(cGate>.001) {
  float microR=circuitPhoto(circuitRough,cUV,cDx,cDy,cWeights,cA,cB,cC).g;
  float asphaltR=mix(mix(.73,.96,microR),mix(.62,.79,microR),cRepair)-cRubber*.075;
  float looseR=mix(.86,.98,textureGrad(roughnessMap,cLooseUV,cLooseDx,cLooseDy).g);
  looseR=mix(looseR,mix(.81,.94,textureGrad(quarryDirtRoughness,cFineUV,cFineDx,cFineDy).g),cFines);
  float finishR=mix(asphaltR,looseR,cMineral);
  if(cGroundBlend>.001)finishR=mix(finishR,max(.89,textureGrad(quarryDirtRoughness,cGroundUV,cGroundDx,cGroundDy).g),cGroundBlend);
  roughnessFactor=mix(roughnessFactor,finishR,cGate);
}`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <clearcoat_normal_fragment_begin>', `
#ifdef USE_NORMALMAP_TANGENTSPACE
mat3 asphaltFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,cUV);
mat3 looseFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,cLooseUV);
mat3 fineFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,cFineUV);
mat3 groundFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,cGroundUV);
#if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
asphaltFrame[0]*=faceDirection;asphaltFrame[1]*=faceDirection;
looseFrame[0]*=faceDirection;looseFrame[1]*=faceDirection;
fineFrame[0]*=faceDirection;fineFrame[1]*=faceDirection;
groundFrame[0]*=faceDirection;groundFrame[1]*=faceDirection;
#endif
if(cGate>.001) {
  vec3 asphaltN=circuitPhoto(circuitNormal,cUV,cDx,cDy,cWeights,cA,cB,cC).xyz*2.0-1.0;
  asphaltN.xy*=mix(.65,.24,cRepair)*mix(1.0,.64,cRubber);
  vec3 looseN=textureGrad(normalMap,cLooseUV,cLooseDx,cLooseDy).xyz*2.0-1.0;looseN.xy*=.64;
  vec3 fineN=textureGrad(quarryDirtNormal,cFineUV,cFineDx,cFineDy).xyz*2.0-1.0;fineN.xy*=.24;
  vec3 mineralN=normalize(mix(normalize(looseFrame*looseN),normalize(fineFrame*fineN),cFines));
  vec3 finishN=normalize(mix(normalize(asphaltFrame*asphaltN),mineralN,cMineral));
  if(cGroundBlend>.001) {
    vec3 groundN=textureGrad(quarryDirtNormal,cGroundUV,cGroundDx,cGroundDy).xyz*2.0-1.0;groundN.xy*=.9;
    finishN=normalize(mix(finishN,normalize(groundFrame*groundN),cGroundBlend));
  }
  normal=normalize(mix(normal,finishN,cGate));
}
#endif
#include <clearcoat_normal_fragment_begin>`);
  };
  material.customProgramCacheKey = () => 'authored-asphalt-circuit-v2';
  return material;
}
