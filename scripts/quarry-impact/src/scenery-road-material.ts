import { texture } from './assets';
import { quarryAggregate, quarryGround } from './scenery-surfaces';

/** Authored road attributes, after restoring Blender's flipped V coordinate:
 * UV: longitudinal distance / signed lateral distance, both in metres.
 * RGB: coverage / compaction / drainage. These are masks, not vertex tint.
 * Lane and skirt share coverage=1 at their join; coverage=0 retains the exact
 * surrounding aggregate or terrain shader, including its original texture phase.
 */
export function quarryRoadSurface(baseSurface: 'aggregate' | 'ground') {
  const aggregate = baseSurface === 'aggregate';
  const material = aggregate ? quarryAggregate() : quarryGround();
  material.name = `authored-road-${baseSurface}`;
  const compileBase = material.onBeforeCompile;
  // All images already belong to the quarry. Reuse their cached texture objects.
  const stone = texture('scree_diff', 1, true);
  const stoneNormal = texture('scree_nor_gl', 1);
  const stoneRoughness = texture('scree_rough', 1);
  const gravelNormal = texture('gravel_nor_gl', 1);
  const gravelRoughness = texture('gravel_rough', 1);

  material.onBeforeCompile = (shader, renderer) => {
    compileBase(shader, renderer);
    shader.uniforms.roadStone = { value: stone };
    shader.uniforms.roadStoneNormal = { value: stoneNormal };
    shader.uniforms.roadStoneRoughness = { value: stoneRoughness };
    if (!aggregate) {
      shader.uniforms.roadGravelNormal = { value: gravelNormal };
      shader.uniforms.roadGravelRoughness = { value: gravelRoughness };
    }
    shader.vertexShader = 'attribute vec3 color; varying vec3 vRoadPaint; varying vec2 vRoadMetres;\n' + shader.vertexShader;
    // Keep physical wear coordinates separate from the original base shaders'
    // world-aligned UVs. This also works after the loader recentres geometry.
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
vRoadPaint=color;
vRoadMetres=uv;
vMapUv=vQuarryPosition.xz/${aggregate ? '2.0' : '9.0'};
vNormalMapUv=vMapUv;
vRoughnessMapUv=vMapUv;
#include <project_vertex>`);
    shader.fragmentShader = `
varying vec3 vRoadPaint;
varying vec2 vRoadMetres;
uniform sampler2D roadStone, roadStoneNormal, roadStoneRoughness;
${aggregate ? `
#define roadGravel map
#define roadGravelNormal normalMap
#define roadGravelRoughness roughnessMap
#define roadDirt quarryDirt
#define roadDirtNormal quarryDirtNormal
#define roadDirtRoughness quarryDirtRoughness
` : `
#define roadGravel quarryGravel
uniform sampler2D roadGravelNormal, roadGravelRoughness;
#define roadDirt map
#define roadDirtNormal normalMap
#define roadDirtRoughness roughnessMap
`}
vec2 roadTileOffset(vec2 p) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
// Translated samples keep photographed color, roughness and normal features
// registered. Explicit gradients avoid mip bands at the stochastic cell edges.
vec4 roadPhoto(sampler2D photo,vec2 uv,vec2 dx,vec2 dy,vec3 w,vec2 a,vec2 b,vec2 c) {
  return textureGrad(photo,uv+a,dx,dy)*w.x+
         textureGrad(photo,uv+b,dx,dy)*w.y+
         textureGrad(photo,uv+c,dx,dy)*w.z;
}
// A finite quadratic steering path, with two tire widths and soft entry/exit.
// Different passes overlap only locally, rather than drawing four endless lines.
float roadWearStroke(vec2 metres,vec2 range,vec3 curve,float halfAxle,float width) {
  float t=clamp((metres.x-range.x)/(range.y-range.x),0.0,1.0);
  float centre=mix(mix(curve.x,curve.y,t),mix(curve.y,curve.z,t),t);
  float tireDistance=abs(abs(metres.y-centre)-halfAxle);
  float widthMask=1.0-smoothstep(width*.35,width,tireDistance);
  return widthMask*smoothstep(range.x,range.x+2.1,metres.x)*(1.0-smoothstep(range.y-3.3,range.y,metres.x));
}
` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <alphamap_fragment>', `
vec2 roadWorld=vQuarryPosition.xz;
float roadLateral=abs(vRoadMetres.y);
float roadGrain=quarryNoise(roadWorld*1.8);
float roadCoverage=clamp(vRoadPaint.r,0.0,1.0);
// Only fray the painted transition: exactly zero and one remain exact.
roadCoverage=smoothstep(0.0,1.0,roadCoverage);
roadCoverage=clamp(roadCoverage+(roadGrain-.5)*roadCoverage*(1.0-roadCoverage)*.55,0.0,1.0);
float roadDrain=clamp(vRoadPaint.b,0.0,1.0);
float roadWearWidth=mix(.16,.27,quarryNoise(vec2(vRoadMetres.x*.41,abs(vRoadMetres.y)*.9)));
float roadTireWear=roadWearStroke(vRoadMetres,vec2(7,29),vec3(-2.8,-2.5,-1.0),.78,roadWearWidth);
roadTireWear=max(roadTireWear,roadWearStroke(vRoadMetres,vec2(18,43),vec3(3.1,2.9,1.7),.73,roadWearWidth*.86)*.73);
roadTireWear=max(roadTireWear,roadWearStroke(vRoadMetres,vec2(45,61),vec3(-.4,-1.1,-2.8),.80,roadWearWidth*1.25)*.91);
roadTireWear=max(roadTireWear,roadWearStroke(vRoadMetres,vec2(58,76),vec3(2.5,1.7,.7),.76,roadWearWidth)*.63);
roadTireWear=max(roadTireWear,roadWearStroke(vRoadMetres,vec2(78,99),vec3(-2.9,-2.7,-1.4),.81,roadWearWidth*1.10)*.85);
roadTireWear=max(roadTireWear,roadWearStroke(vRoadMetres,vec2(95,109),vec3(1.2,1.4,3.3),.75,roadWearWidth*.94)*.71);
float roadWearBreak=quarryNoise(vec2(vRoadMetres.x*.91,vRoadMetres.y*4.3));
roadTireWear*=smoothstep(.18,.62,roadWearBreak)*mix(.58,1.0,roadGrain);
// Vertex compaction is deliberately broad: it guides the smoother road bed,
// while metre-space passes provide fine tire detail between sparse mesh vertices.
float roadCompaction=max(clamp(vRoadPaint.g,0.0,1.0)*.24,roadTireWear*.94);
float roadMargin=smoothstep(4.7,8.2,roadLateral);
float roadMacro=quarryNoise(roadWorld*.16+vec2(1.7,7.2));
// Fine aggregate stays on the lane. Larger photographed fragments only enter
// the loose margins, and deposited fines interrupt those stones at drain mouths.
float roadStoneMix=roadMargin*mix(.42,.72,roadMacro)*(1.0-roadDrain*.71);
float roadFineMix=clamp(.13+roadCompaction*.54+roadDrain*.49+(1.0-roadMacro)*.055,0.0,.84);
vec2 roadGravelUV=roadWorld/2.0;
vec2 roadStoneUV=roadWorld/1.5;
vec2 roadDirtUV=roadWorld/1.6;
vec2 roadGravelDx=dFdx(roadGravelUV),roadGravelDy=dFdy(roadGravelUV);
vec2 roadStoneDx=dFdx(roadStoneUV),roadStoneDy=dFdy(roadStoneUV);
vec2 roadDirtDx=dFdx(roadDirtUV),roadDirtDy=dFdy(roadDirtUV);
vec2 roadGrid=mat2(1.0,0.0,-.57735027,1.15470054)*roadGravelUV/1.3;
vec2 roadCell=floor(roadGrid),roadFrac=fract(roadGrid);
vec3 roadWeights;
vec2 roadA,roadB,roadC;
if(roadFrac.x+roadFrac.y<1.0) {
  roadWeights=vec3(1.0-roadFrac.x-roadFrac.y,roadFrac.x,roadFrac.y);
  roadA=roadCell;roadB=roadCell+vec2(1,0);roadC=roadCell+vec2(0,1);
} else {
  roadWeights=vec3(roadFrac.x+roadFrac.y-1.0,1.0-roadFrac.x,1.0-roadFrac.y);
  roadA=roadCell+vec2(1,1);roadB=roadCell+vec2(0,1);roadC=roadCell+vec2(1,0);
}
roadWeights*=roadWeights;
roadWeights/=dot(roadWeights,vec3(1.0));
roadA=roadTileOffset(roadA);roadB=roadTileOffset(roadB);roadC=roadTileOffset(roadC);
vec3 roadGravelColor=roadPhoto(roadGravel,roadGravelUV,roadGravelDx,roadGravelDy,roadWeights,roadA,roadB,roadC).rgb;
float roadGray=dot(roadGravelColor,vec3(.2126,.7152,.0722));
roadGravelColor=mix(roadGravelColor,vec3(roadGray),.56)*vec3(.56,.55,.52);
vec3 roadFineColor=textureGrad(roadDirt,roadDirtUV,roadDirtDx,roadDirtDy).rgb;
float roadFineGray=dot(roadFineColor,vec3(.2126,.7152,.0722));
roadFineColor=mix(roadFineColor,vec3(roadFineGray),.80)*vec3(.49,.47,.43);
vec3 roadDeposit=mix(roadGravelColor,roadFineColor,roadFineMix);
if(roadStoneMix>.001) {
  vec3 roadStoneColor=roadPhoto(roadStone,roadStoneUV,roadStoneDx,roadStoneDy,roadWeights,roadA,roadB,roadC).rgb;
  float roadStoneGray=dot(roadStoneColor,vec3(.2126,.7152,.0722));
  roadStoneColor=mix(roadStoneColor,vec3(roadStoneGray),.18)*vec3(.87,.85,.82);
  roadDeposit=mix(roadDeposit,roadStoneColor,roadStoneMix);
}
roadDeposit*=mix(.96,1.04,roadMacro)*mix(1.0,.94,roadCompaction)*mix(1.0,.79,roadDrain);
diffuseColor.rgb=mix(diffuseColor.rgb,roadDeposit,roadCoverage);
#include <alphamap_fragment>`);

    // Insert after the complete base implementation, not inside one of its
    // normal-map branches. Packed paths lose coarse relief without becoming wet.
    shader.fragmentShader = shader.fragmentShader.replace('#include <metalnessmap_fragment>', `
#include <metalnessmap_fragment>
float roadGravelR=roadPhoto(roadGravelRoughness,roadGravelUV,roadGravelDx,roadGravelDy,roadWeights,roadA,roadB,roadC).g;
float roadFineR=textureGrad(roadDirtRoughness,roadDirtUV,roadDirtDx,roadDirtDy).g;
float roadRough=mix(mix(.86,.99,roadGravelR),mix(.80,.94,roadFineR),roadFineMix);
if(roadStoneMix>.001) {
  float roadStoneR=roadPhoto(roadStoneRoughness,roadStoneUV,roadStoneDx,roadStoneDy,roadWeights,roadA,roadB,roadC).g;
  roadRough=mix(roadRough,mix(.88,1.0,roadStoneR),roadStoneMix);
}
roadRough-=roadCompaction*.025+roadDrain*.065;
roughnessFactor=mix(roughnessFactor,roadRough,roadCoverage);`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <clearcoat_normal_fragment_begin>', `
#ifdef USE_NORMALMAP_TANGENTSPACE
vec3 roadGravelN=roadPhoto(roadGravelNormal,roadGravelUV,roadGravelDx,roadGravelDy,roadWeights,roadA,roadB,roadC).xyz*2.0-1.0;
vec3 roadFineN=textureGrad(roadDirtNormal,roadDirtUV,roadDirtDx,roadDirtDy).xyz*2.0-1.0;
roadGravelN.xy*=mix(.60,.20,roadCompaction)*(1.0-roadDrain*.35);
roadFineN.xy*=mix(.25,.11,roadCompaction);
mat3 roadGravelFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,roadGravelUV);
mat3 roadFineFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,roadDirtUV);
mat3 roadStoneFrame=getTangentFrame(-vViewPosition,nonPerturbedNormal,roadStoneUV);
#if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
roadGravelFrame[0]*=faceDirection;roadGravelFrame[1]*=faceDirection;
roadFineFrame[0]*=faceDirection;roadFineFrame[1]*=faceDirection;
roadStoneFrame[0]*=faceDirection;roadStoneFrame[1]*=faceDirection;
#endif
vec3 roadN=normalize(mix(normalize(roadGravelFrame*roadGravelN),normalize(roadFineFrame*roadFineN),roadFineMix));
if(roadStoneMix>.001) {
  vec3 roadStoneN=roadPhoto(roadStoneNormal,roadStoneUV,roadStoneDx,roadStoneDy,roadWeights,roadA,roadB,roadC).xyz*2.0-1.0;
  roadStoneN.xy*=mix(.78,.30,roadDrain);
  roadN=normalize(mix(roadN,normalize(roadStoneFrame*roadStoneN),roadStoneMix));
}
normal=normalize(mix(normal,roadN,roadCoverage));
#endif
#include <clearcoat_normal_fragment_begin>`);
  };
  material.customProgramCacheKey = () => `authored-road-${baseSurface}-v2`;
  return material;
}
