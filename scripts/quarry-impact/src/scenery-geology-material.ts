import * as T from 'three';
import { pbr, texture } from './assets';

// World-space geology is shared by every quarry wall, including imported LODs.
// Original UVs and physical geometry are retained; the source scans keep their
// documented metre scales on faces, ledges and overhangs alike.
const helpers = `
varying vec3 vQuarryPosition;
varying vec3 vGeologyWorldNormal;
uniform sampler2D geologyWeatheredColor,geologyWeatheredNormal,geologyWeatheredRough;
uniform sampler2D quarryRockDust;
float geologyHash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
float geologyNoise(vec2 p) {
  vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(geologyHash(i),geologyHash(i+vec2(1,0)),f.x),mix(geologyHash(i+vec2(0,1)),geologyHash(i+vec2(1,1)),f.x),f.y);
}
vec2 geologyOffset(vec2 p) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
// Translation only: the colour, normal and roughness channels share identical
// source coordinates. Explicit derivatives keep the mip footprint continuous
// across the stochastic cells rather than treating cell offsets as gradients.
vec4 geologyPhoto(sampler2D photo,vec2 uv,vec2 dx,vec2 dy) {
  vec2 grid=mat2(1.0,0.0,-.57735027,1.15470054)*uv*.65;
  vec2 cell=floor(grid),f=fract(grid),a,b,c;vec3 w;
  if(f.x+f.y<1.0) {
    w=vec3(1.0-f.x-f.y,f.x,f.y);a=cell;b=cell+vec2(1,0);c=cell+vec2(0,1);
  } else {
    w=vec3(f.x+f.y-1.0,1.0-f.x,1.0-f.y);a=cell+vec2(1,1);b=cell+vec2(0,1);c=cell+vec2(1,0);
  }
  w=pow(w,vec3(4.0));w/=dot(w,vec3(1.0));
  return textureGrad(photo,uv+geologyOffset(a),dx,dy)*w.x
    +textureGrad(photo,uv+geologyOffset(b),dx,dy)*w.y
    +textureGrad(photo,uv+geologyOffset(c),dx,dy)*w.z;
}
`;

export function quarryGeology() {
  const material = pbr('geology_rock', 1, {
    color: 0xffffff, normalScale: new T.Vector2(.95, .95), vertexColors: true,
  });
  material.name = 'quarry-photographic-geology';
  const weatheredColor = texture('rock_diff', 1, true);
  const weatheredNormal = texture('rock_nor_gl', 1);
  const weatheredRough = texture('rock_rough', 1);
  const dust = texture('gravel_diff', 1, true);
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      geologyWeatheredColor: { value: weatheredColor },
      geologyWeatheredNormal: { value: weatheredNormal },
      geologyWeatheredRough: { value: weatheredRough },
      quarryRockDust: { value: dust },
    });
    shader.vertexShader = 'varying vec3 vQuarryPosition; varying vec3 vGeologyWorldNormal;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <defaultnormal_vertex>', `#include <defaultnormal_vertex>
vGeologyWorldNormal=inverseTransformDirection(transformedNormal,viewMatrix);`);
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
vec4 geologyWorldPosition=vec4(transformed,1.0);
#ifdef USE_INSTANCING
geologyWorldPosition=instanceMatrix*geologyWorldPosition;
#endif
vQuarryPosition=(modelMatrix*geologyWorldPosition).xyz;`);
    shader.fragmentShader = helpers + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
vec3 geologyPosition=vQuarryPosition;
vec3 geologyAxis=pow(abs(normalize(vGeologyWorldNormal)),vec3(6.0));
geologyAxis/=max(dot(geologyAxis,vec3(1.0)),.00001);
vec2 geologyX=geologyPosition.zy/2.7,geologyY=geologyPosition.xz/2.7,geologyZ=geologyPosition.xy/2.7;
vec2 geologyXdx=dFdx(geologyX),geologyXdy=dFdy(geologyX);
vec2 geologyYdx=dFdx(geologyY),geologyYdy=dFdy(geologyY);
vec2 geologyZdx=dFdx(geologyZ),geologyZdy=dFdy(geologyZ);
vec2 geologyOldX=geologyPosition.zy/1.8+vec2(.173,.419);
vec2 geologyOldY=geologyPosition.xz/1.8+vec2(.173,.419);
vec2 geologyOldZ=geologyPosition.xy/1.8+vec2(.173,.419);
vec2 geologyOldXdx=dFdx(geologyOldX),geologyOldXdy=dFdy(geologyOldX);
vec2 geologyOldYdx=dFdx(geologyOldY),geologyOldYdy=dFdy(geologyOldY);
vec2 geologyOldZdx=dFdx(geologyOldZ),geologyOldZdy=dFdy(geologyOldZ);
float geologyUp=abs(normalize(vGeologyWorldNormal).y);
// Weathering stays within the same stone palette. Its limited contribution
// preserves the primary fractures through broad, gradual exposure changes.
float geologyWeather=smoothstep(.38,.85,geologyNoise(geologyPosition.xz*.041+vec2(geologyPosition.y*.013,0.0)))*.22;
float quarryDust=smoothstep(.76,.96,geologyUp)*smoothstep(.61,.82,geologyNoise(geologyPosition.xz*.16+vec2(3.7,1.4)))*.62;
vec3 geologyFace=geologyPhoto(map,geologyX,geologyXdx,geologyXdy).rgb*geologyAxis.x
  +geologyPhoto(map,geologyY,geologyYdx,geologyYdy).rgb*geologyAxis.y
  +geologyPhoto(map,geologyZ,geologyZdx,geologyZdy).rgb*geologyAxis.z;
vec3 geologyOld=textureGrad(geologyWeatheredColor,geologyOldX,geologyOldXdx,geologyOldXdy).rgb*geologyAxis.x
  +textureGrad(geologyWeatheredColor,geologyOldY,geologyOldYdx,geologyOldYdy).rgb*geologyAxis.y
  +textureGrad(geologyWeatheredColor,geologyOldZ,geologyOldZdx,geologyOldZdy).rgb*geologyAxis.z;
vec3 geologyFines=textureGrad(quarryRockDust,geologyPosition.xz/2.0,dFdx(geologyPosition.xz)/2.0,dFdy(geologyPosition.xz)/2.0).rgb;
float geologyFinesGray=dot(geologyFines,vec3(.2126,.7152,.0722));
geologyFines=mix(geologyFines,vec3(geologyFinesGray),.70)*vec3(.49,.48,.45);
// Match the scans' measured linear RGB means, with a modest weathering lift.
// The old pale scan otherwise overwhelms the brown fractured face.
diffuseColor.rgb*=mix(mix(geologyFace*.92,geologyOld*vec3(.65,.48,.34),geologyWeather),geologyFines,quarryDust);
`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
float geologyRough=geologyPhoto(roughnessMap,geologyX,geologyXdx,geologyXdy).g*geologyAxis.x
  +geologyPhoto(roughnessMap,geologyY,geologyYdx,geologyYdy).g*geologyAxis.y
  +geologyPhoto(roughnessMap,geologyZ,geologyZdx,geologyZdy).g*geologyAxis.z;
float geologyOldRough=textureGrad(geologyWeatheredRough,geologyOldX,geologyOldXdx,geologyOldXdy).g*geologyAxis.x
  +textureGrad(geologyWeatheredRough,geologyOldY,geologyOldYdx,geologyOldYdy).g*geologyAxis.y
  +textureGrad(geologyWeatheredRough,geologyOldZ,geologyOldZdx,geologyOldZdy).g*geologyAxis.z;
float roughnessFactor=roughness*mix(mix(clamp(geologyRough,.46,.99),clamp(geologyOldRough,.56,.99),geologyWeather),.94,quarryDust);
`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
#ifdef USE_NORMALMAP_TANGENTSPACE
mat3 geologyXframe=getTangentFrame(-vViewPosition,nonPerturbedNormal,geologyX);
mat3 geologyYframe=getTangentFrame(-vViewPosition,nonPerturbedNormal,geologyY);
mat3 geologyZframe=getTangentFrame(-vViewPosition,nonPerturbedNormal,geologyZ);
#if defined(DOUBLE_SIDED) && !defined(FLAT_SHADED)
geologyXframe[0]*=faceDirection;geologyXframe[1]*=faceDirection;
geologyYframe[0]*=faceDirection;geologyYframe[1]*=faceDirection;
geologyZframe[0]*=faceDirection;geologyZframe[1]*=faceDirection;
#endif
vec3 geologyNx=geologyPhoto(normalMap,geologyX,geologyXdx,geologyXdy).xyz*2.0-1.0;
vec3 geologyNy=geologyPhoto(normalMap,geologyY,geologyYdx,geologyYdy).xyz*2.0-1.0;
vec3 geologyNz=geologyPhoto(normalMap,geologyZ,geologyZdx,geologyZdy).xyz*2.0-1.0;
geologyNx.xy*=normalScale;geologyNy.xy*=normalScale;geologyNz.xy*=normalScale;
vec3 geologyN=normalize(normalize(geologyXframe*geologyNx)*geologyAxis.x
  +normalize(geologyYframe*geologyNy)*geologyAxis.y+normalize(geologyZframe*geologyNz)*geologyAxis.z);
// The secondary UVs differ only by a positive uniform scale/translation, so
// their normalized derivative frames have exactly the same orientation.
vec3 geologyOldNx=textureGrad(geologyWeatheredNormal,geologyOldX,geologyOldXdx,geologyOldXdy).xyz*2.0-1.0;
vec3 geologyOldNy=textureGrad(geologyWeatheredNormal,geologyOldY,geologyOldYdx,geologyOldYdy).xyz*2.0-1.0;
vec3 geologyOldNz=textureGrad(geologyWeatheredNormal,geologyOldZ,geologyOldZdx,geologyOldZdy).xyz*2.0-1.0;
geologyOldNx.xy*=.55;geologyOldNy.xy*=.55;geologyOldNz.xy*=.55;
vec3 geologyOldN=normalize(normalize(geologyXframe*geologyOldNx)*geologyAxis.x
  +normalize(geologyYframe*geologyOldNy)*geologyAxis.y+normalize(geologyZframe*geologyOldNz)*geologyAxis.z);
normal=normalize(mix(normalize(mix(geologyN,geologyOldN,geologyWeather)),nonPerturbedNormal,quarryDust*.72));
#endif
`);
  };
  material.customProgramCacheKey = () => 'quarry-photographic-geology-v1';
  return material;
}
