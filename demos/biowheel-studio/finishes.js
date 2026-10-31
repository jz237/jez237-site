import * as T from '../aquaclear-studio/vendor/three.module.js';
export const seeded=(seed=837)=>()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
export function fiberMap(){
 const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext('2d'),r=seeded();x.fillStyle='#d9d4ba';x.fillRect(0,0,1024,1024);
 for(let i=0;i<27000;i++){const a=r()*1024,b=r()*1024,l=5+r()*42,t=r()*6.28;x.strokeStyle=i%3?'rgba(255,252,226,.32)':'rgba(86,79,52,.23)';x.lineWidth=.4+r()*1.4;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(a+Math.cos(t)*l*.6,b+Math.sin(t)*l*.3,a+Math.cos(t)*l,b+Math.sin(t)*l);x.stroke();}
 const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;return map;
}
const noise=`float bh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float bn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(bh(i),bh(i+vec2(1,0)),f.x),mix(bh(i+vec2(0,1)),bh(i+vec2(1,1)),f.x),f.y);}`;
export function wheelFinish(map,uniforms){
 const m=new T.MeshStandardMaterial({color:'#e7dbad',map,bumpMap:map,bumpScale:.006,roughness:.74,side:T.DoubleSide});
 m.onBeforeCompile=s=>{Object.assign(s.uniforms,uniforms);s.vertexShader='varying vec2 bUV;varying vec3 bWorld;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nbUV=uv;bWorld=(modelMatrix*vec4(position,1.)).xyz;');s.fragmentShader='uniform float maturity,moisture;varying vec2 bUV;varying vec3 bWorld;\n'+noise+'\n'+s.fragmentShader;
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float filmPatch=bn(bUV*vec2(15.,22.))*.65+bn(bUV*vec2(53.,81.))*.35;float growth=maturity*(.28+filmPatch*.65);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.25,.20,.075),growth);float wet=(1.-smoothstep(3.2,3.62,bWorld.y))*.18+moisture*.16;diffuseColor.rgb*=1.-wet;`);
  s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(.83,.36,moisture*(1.-smoothstep(3.2,3.62,bWorld.y))*.7);');};m.customProgramCacheKey=()=> 'biowheel-living-pleats-v1';return m;
}
// Quiet shallow-water finish for the service tray and enlarged biofilm view.
// Main aquarium/return optics are in water.js and optics.js.
export function waterMaterial(clock,flow){
 const m=new T.MeshPhysicalMaterial({color:'#9dbdbb',transparent:true,opacity:.28,roughness:.10,metalness:0,clearcoat:1,side:T.DoubleSide,depthWrite:false});
 m.onBeforeCompile=s=>{Object.assign(s.uniforms,{waterTime:clock,waterFlow:flow});s.vertexShader='varying vec3 wPosition;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nwPosition=position;');s.fragmentShader='uniform float waterTime,waterFlow;varying vec3 wPosition;\n'+s.fragmentShader;
 s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
 vec2 wp=vec2(wPosition.x+.63*wPosition.z,wPosition.y+.81*wPosition.z);normal=normalize(normal+vec3(sin(dot(wp,vec2(11.,7.))+waterTime*1.7),cos(dot(wp,vec2(-6.,14.))-waterTime*2.),0.)*.025*(.2+waterFlow));`);};m.customProgramCacheKey=()=> 'biowheel-shallow-water-v2';return m;
}
export function pleatedGeometry(width=2.1,outer=.57,inner=.31,count=32){
 const p=[],uv=[];for(let i=0;i<count*2;i++){const a=i/(count*2)*Math.PI*2,b=(i+1)/(count*2)*Math.PI*2,r=i%2?inner:outer,r2=i%2?outer:inner;
 const pts=[[-width/2,Math.cos(a)*r,Math.sin(a)*r],[width/2,Math.cos(a)*r,Math.sin(a)*r],[-width/2,Math.cos(b)*r2,Math.sin(b)*r2],[width/2,Math.cos(b)*r2,Math.sin(b)*r2]];
 for(const j of [0,2,1,1,2,3]){p.push(...pts[j]);uv.push(j%2?2.5:0,(i+(j>1?1:0))/(count*2)*2);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;
}
