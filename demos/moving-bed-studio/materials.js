// Object-space microstructure remains attached to moving parts and avoids
// stretching a single bitmap over differently sized ribs, pipes and panels.
const profiles={
 plastic:{frequency:95,height:.0013,contrast:.10,roughness:.18},
 polymer:{frequency:410,height:.0007,contrast:.12,roughness:.16},
 rubber:{frequency:175,height:.0010,contrast:.12,roughness:.10},
 metal:{frequency:150,height:.000025,contrast:.045,roughness:.12},
 porous:{frequency:65,height:.004,contrast:.48,roughness:.18},
 biofilm:{frequency:32,height:.0023,contrast:.30,roughness:.24}
};
const noise=`
varying vec3 vMaterialPosition;
float matHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float matNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(matHash(i),matHash(i+vec3(1,0,0)),f.x),mix(matHash(i+vec3(0,1,0)),matHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(matHash(i+vec3(0,0,1)),matHash(i+vec3(1,0,1)),f.x),mix(matHash(i+vec3(0,1,1)),matHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
`;
export function textureMaterial(material,kind){
 const p=profiles[kind];if(!p)throw Error('Unknown material profile');
 material.userData.microstructure=kind;
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 vMaterialPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvMaterialPosition=position;');
  shader.fragmentShader=noise+shader.fragmentShader;
  const f=p.frequency.toFixed(2),scale=p.height.toFixed(6);
  const grain=kind==='metal'?`matNoise(vMaterialPosition*vec3(35.,640.,35.))`:`matNoise(vMaterialPosition*${f})`;
  const height=kind==='porous'?'smoothstep(.30,.65,matGrain)':kind==='biofilm'?'matGrain*matPatch':'matGrain';
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float matGrain=${grain};float matPatch=matNoise(vMaterialPosition*${(p.frequency*.18).toFixed(2)}+vec3(7.,19.,2.));
   float matHeight=${height}*${scale};
   diffuseColor.rgb*=1.-${p.contrast.toFixed(3)}*(.7*(1.-matGrain)+.3*(1.-matPatch));`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(matPatch-.5)*${p.roughness.toFixed(3)},.04,1.);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   vec3 sx=dFdx(-vViewPosition),sy=dFdy(-vViewPosition);vec3 rx=cross(sy,normal),ry=cross(normal,sx);float determinant=dot(sx,rx)*faceDirection;
   if(abs(determinant)>.00000001)normal=normalize(abs(determinant)*normal-sign(determinant)*(dFdx(matHeight)*rx+dFdy(matHeight)*ry));`);
 };
 material.customProgramCacheKey=()=>`moving-bed-material-v3-${kind}`;
 return material;
}
