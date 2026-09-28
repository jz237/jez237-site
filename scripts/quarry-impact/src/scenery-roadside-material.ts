import * as T from 'three';
import { texture } from './assets';
import { quarryGround } from './scenery-surfaces';

/** Vertex paint describes deposits, rather than coloring the surface directly.
 * R: deposit coverage, G: compacted drainage, B: stone/fines mixture.
 * At the edge this retains the surrounding ground's maps and shading.
 */
export function quarryRoadsideGround() {
  const material = quarryGround();
  material.name = 'authored-roadside-ground';
  const base = material.onBeforeCompile;
  const gravel = texture('scree_diff', 1, true);
  const gravelNormal = texture('scree_nor_gl', 1);
  const gravelRoughness = texture('scree_rough', 1);
  const dirt = texture('mud_diff', 1, true);
  const dirtNormal = texture('mud_nor_gl', 1);
  const dirtRoughness = texture('mud_rough', 1);
  material.onBeforeCompile = (shader, renderer) => {
    base(shader, renderer);
    shader.uniforms.roadsideGravel = { value: gravel };
    shader.uniforms.roadsideGravelNormal = { value: gravelNormal };
    shader.uniforms.roadsideGravelRoughness = { value: gravelRoughness };
    shader.uniforms.roadsideDirt = { value: dirt };
    shader.uniforms.roadsideDirtNormal = { value: dirtNormal };
    shader.uniforms.roadsideDirtRoughness = { value: dirtRoughness };
    shader.vertexShader = 'attribute vec3 color; varying vec3 vRoadsidePaint;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\nvRoadsidePaint = color;');
    shader.fragmentShader = `varying vec3 vRoadsidePaint;
uniform sampler2D roadsideGravel, roadsideGravelNormal, roadsideGravelRoughness;
uniform sampler2D roadsideDirt, roadsideDirtNormal, roadsideDirtRoughness;
vec2 roadsideOffset(vec2 p) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
// Three overlapping, translated samples break the photographic tile's rows.
// All channels share offsets; explicit gradients keep triangle edges from
// selecting a blurry mip. Translation preserves the physical normal frame.
vec4 roadsideSample(sampler2D tex,vec2 uv,vec3 weights,vec2 a,vec2 b,vec2 c) {
  vec2 dx=dFdx(uv),dy=dFdy(uv);
  return textureGrad(tex,uv+a,dx,dy)*weights.x+
         textureGrad(tex,uv+b,dx,dy)*weights.y+
         textureGrad(tex,uv+c,dx,dy)*weights.z;
}
` + shader.fragmentShader;
    // Ground's photographic blending has already run at this point. Small-scale
    // edge breakup stays inside the artist's coverage, so zero stays exact zero.
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', `
float roadsideCoverage=clamp(vRoadsidePaint.r,0.0,1.0);
float roadsideDrain=clamp(vRoadsidePaint.g,0.0,1.0);
float roadsideGrain=quarryNoise(vQuarryPosition.xz*1.7);
roadsideCoverage*=smoothstep(0.0,.34,roadsideCoverage+roadsideGrain*.15);
float roadsideStone=clamp(.64+vRoadsidePaint.b*.28+roadsideGrain*.04-roadsideDrain*.38,0.0,1.0);
vec2 roadsideStoneUV=vQuarryPosition.xz/1.5;
vec2 roadsideDirtUV=vQuarryPosition.xz/2.1;
vec2 roadsideGrid=mat2(1.0,0.0,-.57735027,1.15470054)*roadsideStoneUV/1.3;
vec2 roadsideCell=floor(roadsideGrid),roadsideFrac=fract(roadsideGrid);
vec3 roadsideWeights;
vec2 roadsideA,roadsideB,roadsideC;
if(roadsideFrac.x+roadsideFrac.y<1.0) {
  roadsideWeights=vec3(1.0-roadsideFrac.x-roadsideFrac.y,roadsideFrac.x,roadsideFrac.y);
  roadsideA=roadsideCell;roadsideB=roadsideCell+vec2(1,0);roadsideC=roadsideCell+vec2(0,1);
} else {
  roadsideWeights=vec3(roadsideFrac.x+roadsideFrac.y-1.0,1.0-roadsideFrac.x,1.0-roadsideFrac.y);
  roadsideA=roadsideCell+vec2(1,1);roadsideB=roadsideCell+vec2(0,1);roadsideC=roadsideCell+vec2(1,0);
}
roadsideWeights*=roadsideWeights;
roadsideWeights/=dot(roadsideWeights,vec3(1.0));
roadsideA=roadsideOffset(roadsideA);roadsideB=roadsideOffset(roadsideB);roadsideC=roadsideOffset(roadsideC);
vec3 roadsideStoneColor=roadsideSample(roadsideGravel,roadsideStoneUV,roadsideWeights,roadsideA,roadsideB,roadsideC).rgb;
float roadsideGray=dot(roadsideStoneColor,vec3(.2126,.7152,.0722));
roadsideStoneColor=mix(roadsideStoneColor,vec3(roadsideGray),.18)*vec3(.87,.85,.82);
vec3 roadsideFineColor=texture2D(roadsideDirt,roadsideDirtUV).rgb*vec3(.53,.51,.48);
vec3 roadsideDeposit=mix(roadsideFineColor,roadsideStoneColor,roadsideStone);
roadsideDeposit*=mix(.91,1.05,quarryNoise(vQuarryPosition.xz*.17));
roadsideDeposit*=mix(1.0,.73,roadsideDrain);
diffuseColor.rgb=mix(diffuseColor.rgb,roadsideDeposit,roadsideCoverage);
#include <alphamap_fragment>`);
    // Preserve the surrounding terrain floor before applying the painted local
    // mixture, so compacted drainage can use its own restrained roughness.
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>\nroughnessFactor=max(.89,roughnessFactor);', `
#include <roughnessmap_fragment>
roughnessFactor=max(.89,roughnessFactor);
float roadsideFineRoughness=texture2D(roadsideDirtRoughness,roadsideDirtUV).g;
float roadsideStoneRoughness=roadsideSample(roadsideGravelRoughness,roadsideStoneUV,roadsideWeights,roadsideA,roadsideB,roadsideC).g;
float roadsideRoughness=mix(mix(.83,.96,roadsideFineRoughness),mix(.88,1.0,roadsideStoneRoughness),roadsideStone);
roadsideRoughness-=roadsideDrain*.08;
roughnessFactor=mix(roughnessFactor,roadsideRoughness,roadsideCoverage);`);
    // Each photo has its own metre scale. Blend normals in view space, rather
    // than using the base terrain UV tangent frame for all of the layers.
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
#include <normal_fragment_maps>
#ifdef USE_NORMALMAP_TANGENTSPACE
vec3 roadsideGritN=roadsideSample(roadsideGravelNormal,roadsideStoneUV,roadsideWeights,roadsideA,roadsideB,roadsideC).xyz*2.0-1.0;
vec3 roadsideFineN=texture2D(roadsideDirtNormal,roadsideDirtUV).xyz*2.0-1.0;
roadsideGritN.xy*=mix(.88,.36,roadsideDrain);
roadsideFineN.xy*=mix(.42,.23,roadsideDrain);
mat3 roadsideGritFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,roadsideStoneUV);
mat3 roadsideFineFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,roadsideDirtUV);
vec3 roadsideN=normalize(mix(normalize(roadsideFineFrame*roadsideFineN),normalize(roadsideGritFrame*roadsideGritN),roadsideStone));
normal=normalize(mix(normal,roadsideN,roadsideCoverage));
#endif`);
  };
  material.customProgramCacheKey = () => 'authored-roadside-ground-v4';
  return material;
}
