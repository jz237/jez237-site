import * as T from 'three';
import { texture } from './assets';
import { quarryRock } from './scenery-surfaces';
import { NORTH_FLOOR_BOUNDS } from './scenery-north-floor-mask';
import { northFloorWeights, northFloorReady } from './scenery-north-floor';
import { northMineralGLSL } from './scenery-north-mineral';
import spec from '../source/north-forest-floor.json';

/** A local mineral strip across the actual northern crest. All original rock
 * geometry, material values and shading outside the painted strip are retained. */
export function northForestRock() {
  const material = quarryRock(), compile = material.onBeforeCompile;
  const normal = texture('gravel_nor_gl', 1), roughness = texture('gravel_rough', 1);
  const [x0,z0,x1,z1] = NORTH_FLOOR_BOUNDS;
  material.onBeforeCompile = (shader, renderer) => {
    compile(shader, renderer);
    shader.uniforms.northFloorMask = northFloorWeights;
    shader.uniforms.northFloorReady = northFloorReady;
    shader.uniforms.northFloorBounds = {value: new T.Vector4(x0,z0,x1-x0,z1-z0)};
    shader.uniforms.northCrestNormal = {value: normal};
    shader.uniforms.northCrestRough = {value: roughness};
    shader.fragmentShader = northMineralGLSL + `
uniform sampler2D northFloorMask,northCrestNormal,northCrestRough;
uniform vec4 northFloorBounds;
uniform float northFloorReady;
` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', `
vec2 northCrestUV=vQuarryPosition.xz/${spec.textureScaleMetres.mineral.toFixed(1)};
vec2 northCrestDx=dFdx(northCrestUV),northCrestDy=dFdy(northCrestUV);
float northCrestUp=abs(normalize(cross(dFdx(vQuarryPosition),dFdy(vQuarryPosition))).y);
float northCrestBlend=texture2D(northFloorMask,(vQuarryPosition.xz-northFloorBounds.xy)/northFloorBounds.zw).b*northFloorReady*smoothstep(.55,.88,northCrestUp);
if(northCrestBlend>.001) {
  vec3 photo=textureGrad(quarryRockDust,northCrestUV,northCrestDx,northCrestDy).rgb;
  diffuseColor.rgb=mix(diffuseColor.rgb,northMineralColor(photo),northCrestBlend);
}
#include <alphamap_fragment>`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <metalnessmap_fragment>', `
#include <metalnessmap_fragment>
if(northCrestBlend>.001)roughnessFactor=mix(roughnessFactor,mix(.86,.98,textureGrad(northCrestRough,northCrestUV,northCrestDx,northCrestDy).g),northCrestBlend);
`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <clearcoat_normal_fragment_begin>', `
#ifdef USE_NORMALMAP_TANGENTSPACE
mat3 northCrestFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,northCrestUV);
#if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
northCrestFrame[0]*=faceDirection;northCrestFrame[1]*=faceDirection;
#endif
if(northCrestBlend>.001) {
  vec3 crestN=textureGrad(northCrestNormal,northCrestUV,northCrestDx,northCrestDy).xyz*2.0-1.0;
  crestN.xy*=.63;
  normal=normalize(mix(normal,normalize(northCrestFrame*crestN),northCrestBlend));
}
#endif
#include <clearcoat_normal_fragment_begin>`);
  };
  material.customProgramCacheKey = () => 'north-woodland-crest-v1';
  return material;
}
