// Object-space finishes stay the same size on narrow rails and broad panels.
// Diffuse grain, roughness variation and a perturbed normal all describe the
// same surface. The amplitude is deliberately readable in the main view.
export function hardwareFinish(material,kind='ivory'){
 const profiles={
  red:{scale:150,height:.0007,roughness:.46,metalness:.025,contrast:.10},
  ivory:{scale:160,height:.00065,roughness:.51,metalness:.015,contrast:.09},
  dark:{scale:145,height:.0009,roughness:.59,metalness:.035,contrast:.14},
  motor:{scale:110,height:.00125,roughness:.48,metalness:.38,contrast:.18},
  rubber:{scale:160,height:.00065,roughness:.84,metalness:0,contrast:.10},
  steel:{scale:260,height:.00015,roughness:.34,metalness:.82,contrast:.10}
 };
 const p=profiles[kind]||profiles.ivory,metal=kind==='steel';
 material.roughness=p.roughness;material.metalness=p.metalness;
 material.onBeforeCompile=s=>{
  s.vertexShader='varying vec3 hardwarePosition;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nhardwarePosition=position;');
  s.fragmentShader=`varying vec3 hardwarePosition;
 float hwHash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
 float hwNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hwHash(i),hwHash(i+vec3(1,0,0)),f.x),mix(hwHash(i+vec3(0,1,0)),hwHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hwHash(i+vec3(0,0,1)),hwHash(i+vec3(1,0,1)),f.x),mix(hwHash(i+vec3(0,1,1)),hwHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 `+s.fragmentShader;
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 vec3 hwP=hardwarePosition*${p.scale.toFixed(1)};
 float hwFade=1.-smoothstep(.35,1.8,length(fwidth(hwP)));
 float hwGrain=hwNoise(hwP),hwFine=hwNoise(hwP*2.7+vec3(17.2,2.3,8.5));
 float hwBroad=hwNoise(hardwarePosition*11.);
 ${metal?'hwGrain=hwNoise(vec3(hardwarePosition.x*8.,hardwarePosition.y*260.,hardwarePosition.z*260.));':''}
 float hwHeight=((hwGrain-.5)+(hwFine-.5)*.25)*${p.height.toFixed(5)}*hwFade;
 diffuseColor.rgb*=1.+(hwGrain-.5)*${p.contrast.toFixed(3)}*hwFade+(hwBroad-.5)*.045;
 `);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 roughnessFactor=clamp(roughnessFactor+(hwGrain-.5)*.23*hwFade+(hwBroad-.5)*.055,.2,.95);`);
  s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
 vec3 hwDx=dFdx(-vViewPosition),hwDy=dFdy(-vViewPosition),hwRx=cross(hwDy,normal),hwRy=cross(normal,hwDx);
 float hwDet=dot(hwDx,hwRx)*faceDirection;
 if(abs(hwDet)>.00000001)normal=normalize(abs(hwDet)*normal-sign(hwDet)*(dFdx(hwHeight)*hwRx+dFdy(hwHeight)*hwRy));`);
 };
 material.customProgramCacheKey=()=> 'roller-hardware-v4-'+kind;
 material.userData.finish=kind;
 return material;
}
