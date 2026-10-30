// Fine brushed metal, separate from the shared filter material implementation.
export function finishMetal(material){
 material.onBeforeCompile=s=>{
  s.vertexShader='varying vec3 vBrushPosition;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvBrushPosition=position;');
  s.fragmentShader=`varying vec3 vBrushPosition;
   float brushHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float brushNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(brushHash(i),brushHash(i+vec2(1,0)),f.x),mix(brushHash(i+vec2(0,1)),brushHash(i+vec2(1,1)),f.x),f.y);}
  `+s.fragmentShader;
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec2 brushUV=vec2(vBrushPosition.x*.9+vBrushPosition.z*.17,vBrushPosition.y*620.+vBrushPosition.z*540.);
   float grain=brushNoise(brushUV);float brushFade=1.-smoothstep(.35,1.6,length(fwidth(brushUV)));
   float brushHeight=(grain-.5)*.000012*brushFade;diffuseColor.rgb*=.985+.015*grain;`);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(grain-.5)*.035*brushFade,.12,1.);');
  s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   vec3 bx=dFdx(-vViewPosition),by=dFdy(-vViewPosition),brx=cross(by,normal),bry=cross(normal,bx);float det=dot(bx,brx)*faceDirection;
   if(abs(det)>.00000001)normal=normalize(abs(det)*normal-sign(det)*(dFdx(brushHeight)*brx+dFdy(brushHeight)*bry));`);
 };
 material.customProgramCacheKey=()=> 'drum-brushed-metal-v2';return material;
}
