// Branched, leafy botanical meshes shared by hundreds of instances (After the Storm's Shape builder),
// plus lake-side plants: cattails and grass tufts. Deterministic from a seed.
import {backlight,BACKLIT_GLSL,BACKLIT_UNIFORMS} from './backlight.js';
import * as T from './vendor/three.module.js';
export class Shape{
 constructor(){this.p=[];this.uv=[];this.c=[];}
 tri(a,b,c,shade=1,uv=[[0,0],[1,0],[.5,1]]){for(const [i,v] of [a,b,c].entries()){this.p.push(...v);this.uv.push(...uv[i]);this.c.push(shade,shade,shade);}}
 leaf(a,b,width,angle,shade=1){
  const av=new T.Vector3(...a),bv=new T.Vector3(...b),axis=bv.clone().sub(av),side=new T.Vector3(Math.cos(angle),.12,Math.sin(angle)).multiplyScalar(width);
  const mid=av.clone().addScaledVector(axis,.48),ridge=mid.clone().add(new T.Vector3(0,width*.22,0));
  const l=mid.clone().add(side),r=mid.clone().sub(side);
  this.tri(a,l.toArray(),ridge.toArray(),shade);this.tri(a,ridge.toArray(),r.toArray(),shade*.87);
  this.tri(l.toArray(),b,ridge.toArray(),shade*.94);this.tri(ridge.toArray(),b,r.toArray(),shade*.79);
 }
 tube(a,b,r1,r2,segments=7){
  const av=new T.Vector3(...a),bv=new T.Vector3(...b),axis=bv.clone().sub(av).normalize(),side=new T.Vector3(1,0,0);
  if(Math.abs(axis.x)>.8)side.set(0,0,1);side.cross(axis).normalize();const front=axis.clone().cross(side),length=av.distanceTo(bv);
  for(let i=0;i<segments;i++){
   const radial=j=>side.clone().multiplyScalar(Math.cos(j/segments*Math.PI*2)).addScaledVector(front,Math.sin(j/segments*Math.PI*2));
   const n=radial(i),m=radial(i+1),p=av.clone().addScaledVector(n,r1),q=av.clone().addScaledVector(m,r1),r=bv.clone().addScaledVector(n,r2),s=bv.clone().addScaledVector(m,r2);
   this.tri(p.toArray(),q.toArray(),r.toArray(),1,[[i/segments,0],[(i+1)/segments,0],[i/segments,length/2]]);
   this.tri(q.toArray(),s.toArray(),r.toArray(),1,[[(i+1)/segments,0],[(i+1)/segments,length/2],[i/segments,length/2]]);
  }
 }
 geometry(){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(this.p,3));g.setAttribute('uv',new T.Float32BufferAttribute(this.uv,2));g.setAttribute('color',new T.Float32BufferAttribute(this.c,3));g.computeVertexNormals();g.computeBoundingSphere();return g;}
}
export function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
// detail 0..1 scales branch and leaf counts: 1 for trees at the waterline, ~.35 for the backdrop.
export function tree(kind,seed,detail=1){
 const wood=new Shape(),leaf=new Shape(),random=rng(seed);
 if(kind==='pine'){
  wood.tube([0,0,0],[.16,13,0],.34,.035,10);const branches=Math.max(14,Math.round(60*detail)),leaves=Math.max(4,Math.round(13*detail));
  for(let j=0;j<branches;j++){
   const t=j/branches,y=2.3+t*10.4,a=j*2.3999,len=(1-t)*3.4+.22,start=[.16*t,y,0],end=[Math.cos(a)*len,y+.25-Math.sin(t*Math.PI)*.3,Math.sin(a)*len];
   wood.tube(start,end,.075*(1-t)+.015,.008,5);
   for(let k=1;k<leaves;k++){
    const f=k/leaves,c=new T.Vector3().fromArray(start).lerp(new T.Vector3(...end),f);
    for(const side of [-1,1]){
     const reach=((1-f)*.95+.12)*(1+(1-detail)*.9),tip=c.clone().add(new T.Vector3(-Math.sin(a)*side*reach,.18+random()*.22,Math.cos(a)*side*reach));
     leaf.leaf(c.toArray(),tip.toArray(),reach*.28*(1+(1-detail)*1.1),a,.61+random()*.48);
    }
   }
  }
 }else{
  // broadleaf: an oak-like crown on a forked trunk, about 14 m tall
  // the crown is a dense rounded mass: enough cards that no sky shows between the clusters, so a
  // backlit oak on the skyline reads as one silhouette rather than a scatter of leaves
  wood.tube([0,0,0],[.35,9.5,.1],.5,.1,9);const branches=Math.max(6,Math.round(18*detail)),leaves=Math.max(26,Math.round(64*detail));
  for(let j=0;j<branches;j++){
   const a=j*2.399,y=4.2+random()*5,r=2.1+random()*2.4,end=[Math.cos(a)*r,y+2.2,Math.sin(a)*r];wood.tube([.25,y-2,0],end,.13,.02,6);
   for(let k=0;k<leaves;k++){
    const az=random()*Math.PI*2,rad=Math.sqrt(random())*2.1*(1+(1-detail)*.5),c=[end[0]+Math.cos(az)*rad,end[1]+(random()-.5)*2.4,end[2]+Math.sin(az)*rad],ls=1+(1-detail)*2.0;
    leaf.leaf(c,[c[0]+Math.cos(az)*1.05*ls,c[1]+.2,c[2]+Math.sin(az)*1.05*ls],.36*ls,az+Math.PI/2,.62+random()*.42);
   }
  }
 }
 return{wood:wood.geometry(),leaf:leaf.geometry()};
}
// A cattail: stem, two blade leaves, the brown seed head. Roughly 1.8 m tall before instance scale.
export function cattail(seed){
 const random=rng(seed),plant=new Shape(),head=new Shape();
 plant.tube([0,0,0],[.02,1.55,.01],.012,.006,5);
 for(let i=0;i<3;i++){const a=random()*6.283,h=.9+random()*.7;plant.leaf([Math.cos(a)*.03,.05,Math.sin(a)*.03],[Math.cos(a)*.22,h,Math.sin(a)*.22],.014+random()*.008,a+Math.PI/2,.7+random()*.4);}
 head.tube([.02,1.32,.01],[.03,1.58,.01],.022,.02,6);
 return {plant:plant.geometry(),head:head.geometry()};
}
export function grassTuft(seed){
 const random=rng(seed),tuft=new Shape();
 for(let i=0;i<22;i++){const a=random()*Math.PI*2,r=random()*.4,h=.3+random()*.6,x=Math.cos(a)*r,z=Math.sin(a)*r;tuft.leaf([x,0,z],[x+Math.cos(a)*h*.38,h,z+Math.sin(a)*h*.38],.022+random()*.022,a+Math.PI/2,.6+random()*.5);}
 return tuft.geometry();
}
// Vertex sway shared by every plant material: bend grows with height, strength with the wind.
export function windSway(material,flex=.03){
 material.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{foliageTime:windSway.time,foliageWind:windSway.strength,foliageDistance:windSway.distance,backlitSunDir:backlight.sunDir,backlitAmount:backlight.amount});
  // backlit: looking toward a low sun, foliage is a dark cut-out with the sky burning behind it; the albedo drops to a tenth for cards that sit between the eye and the sun, so the skyline reads as the serrated silhouette of the concept art and the reflection pass, which faces the same sun, agrees
  s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\n'+BACKLIT_UNIFORMS).replace('#include <color_fragment>','#include <color_fragment>\n'+BACKLIT_GLSL);
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float foliageTime,foliageWind,foliageDistance;')
   .replace('#include <begin_vertex>',`#include <begin_vertex>
vec3 anchor=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
float phase=anchor.x*.061+anchor.z*.087;
float bend=pow(max(position.y,0.)*.09,2.)*${flex.toFixed(4)};
transformed.x+=sin(foliageTime*1.4+phase+position.y*.17)*bend*(.25+foliageWind*2.2);
transformed.z+=sin(foliageTime*1.03+phase*.7)*bend*.55*(.25+foliageWind*2.2);
float farFade=1.-smoothstep(foliageDistance,foliageDistance+45.,length(cameraPosition.xz-anchor.xz));transformed*=farFade;`);
 };material.customProgramCacheKey=()=>`first-light-sway-${flex}`;
}
windSway.time={value:0};windSway.strength={value:.1};windSway.distance={value:380};
