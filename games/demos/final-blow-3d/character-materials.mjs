import * as THREE from 'three';
export function detailMaterial(m){
 const region=m.userData.detailRegion||({ 'Woven blue gi':'cloth','Skin':'skin','Silver hair':'hair'})[m.name]||'trim';
 m.normalScale?.set(.65,.65);m.envMapIntensity=.65;
 m.onBeforeCompile=shader=>{
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 detailPoint;').replace('#include <begin_vertex>','#include <begin_vertex>\ndetailPoint=position;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
 varying vec3 detailPoint;
 float detailHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
 float grain(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(detailHash(i),detailHash(i+vec3(1,0,0)),f.x),mix(detailHash(i+vec3(0,1,0)),detailHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(detailHash(i+vec3(0,0,1)),detailHash(i+vec3(1,0,1)),f.x),mix(detailHash(i+vec3(0,1,1)),detailHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 vec3 fineNormal(vec3 n,float h){vec3 p=-vViewPosition;vec3 dx=dFdx(p),dy=dFdy(p),r1=cross(dy,n),r2=cross(n,dx);float det=dot(dx,r1);return normalize(abs(det)*n-sign(det)*(dFdx(h)*r1+dFdy(h)*r2));}
 `);
 const height=region==='knit'?'0.00010*(sin(detailPoint.y*4200.0+sin(detailPoint.x*2600.0))*sin(detailPoint.x*2600.0))':(region==='twill'||region==='cap')?'0.00012*sin((detailPoint.x+detailPoint.y+detailPoint.z)*4100.0)*sin((detailPoint.x-detailPoint.y)*3000.0)':region==='cloth'?'0.00016*(sin(detailPoint.x*3800.0)*sin((detailPoint.y+detailPoint.z*.3)*3800.0))':region==='skin'?'0.00006*grain(detailPoint*1300.0)':region==='hair'?'0.00007*sin(detailPoint.x*2700.0+detailPoint.y*180.0)':'0.000025*grain(detailPoint*900.0)';
 shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>\nnormal=fineNormal(normal,${height});`);
 const rough=['cloth','knit','twill','cap'].includes(region)?'.76':region==='skin'?'.46':region==='hair'?'.48':'.52';
 shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,${rough},.65);`);
 };
 m.customProgramCacheKey=()=>`jez-material-detail-1-${region}`;
}
