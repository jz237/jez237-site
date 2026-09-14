// A fish body built from its reference photos (see source/fish-from-photo.py): the loft follows the
// photographed silhouette station by station (dorsal edge, belly line, width from the top view), the
// flank is the photo itself mapped so each body row lands on the photographed row, and the dorsal,
// anal, pelvic and caudal fins are the photo's fin pixels on a sagittal card. Both bend with the
// same spine wave as the procedural body. Jez's rule: compare against the photo until it matches.
import * as T from './vendor/three.module.js';
const RING=22;
const cache={};
export function loadFishAssets(id='largemouth'){
 if(cache[id])return cache[id];
 const base=new URL(`./assets/fish/${id}/`,import.meta.url).href,loader=new T.TextureLoader();
 cache[id]=(async()=>{
  const profile=await (await fetch(base+'profile.json')).json();
  const [flank,fins]=await Promise.all([loader.loadAsync(base+'flank.webp'),loader.loadAsync(base+'fins.webp')]);
  for(const t of [flank,fins]){t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;t.wrapS=t.wrapT=T.ClampToEdgeWrapping;}
  return {profile,flank,fins};
 })().catch(e=>{console.warn('fish assets unavailable, using the procedural body',e);return null;});
 return cache[id];
}
function sampleProfile(st,s){const n=st.length;const f=Math.max(0,Math.min(n-1,s*(n-1)));const i=Math.floor(f),j=Math.min(n-1,i+1),t=f-i;const a=st[i],b=st[j];const L=k=>a[k]+(b[k]-a[k])*t;return {top:L('top'),bottom:L('bottom'),halfWidth:L('halfWidth'),texTop:L('texTop'),texBottom:L('texBottom')};}
export function bodyFromProfile(profile,stations=40){
 const st=profile.stations,pos=[],uv=[],sta=[],belly=[],idx=[];
 const endS=Math.max(.02,Math.min(.2,profile.bodyEndS||.08));
 for(let i=0;i<=stations;i++){const s=endS+(1-endS)*(i/stations);const p=sampleProfile(st,s);const mid=(p.top+p.bottom)/2,up=p.top-mid,down=mid-p.bottom;const hw=Math.max(.004,p.halfWidth);
  for(let j=0;j<RING;j++){const a=j/RING*Math.PI*2,c=Math.cos(a),sn=Math.sin(a);
   const y=mid+(sn>=0?up*Math.pow(sn,.92):-down*Math.pow(-sn,.92));const x=hw*c*(1-.12*sn*sn);
   pos.push(x,y,s-.5);sta.push(s);belly.push(sn);
   const rowFrac=p.texTop+(p.texBottom-p.texTop)*Math.max(0,Math.min(1,(p.top-y)/Math.max(1e-4,p.top-p.bottom)));uv.push(1-s,1-rowFrac);}}
 for(let i=0;i<stations;i++)for(let j=0;j<RING;j++){const a=i*RING+j,b=i*RING+(j+1)%RING,c=(i+1)*RING+j,d=(i+1)*RING+(j+1)%RING;idx.push(a,c,b,b,c,d);}
 // close the nose and the peduncle with a fan
 const noseC=pos.length/3;{const p=sampleProfile(st,1);pos.push(0,(p.top+p.bottom)/2,.5);sta.push(1);belly.push(0);uv.push(0,1-(p.texTop+p.texBottom)/2);const base=stations*RING;for(let j=0;j<RING;j++)idx.push(base+j,base+(j+1)%RING,noseC);}
 const tailC=pos.length/3;{const p=sampleProfile(st,endS);pos.push(0,(p.top+p.bottom)/2,endS-.5);sta.push(endS);belly.push(0);uv.push(1-endS,1-(p.texTop+p.texBottom)/2);for(let j=0;j<RING;j++)idx.push((j+1)%RING,j,tailC);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('station',new T.Float32BufferAttribute(sta,1));g.setAttribute('belly',new T.Float32BufferAttribute(belly,1));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function finCardFromProfile(profile,segs=48,rows=10){
 const aspect=profile.texAspect,mid=profile.midRow;const pos=[],uv=[],sta=[],belly=[],idx=[];
 for(let i=0;i<=segs;i++){const u=i/segs,z=.5-u;for(let j=0;j<=rows;j++){const v=j/rows;pos.push(0,(mid-(1-v))*aspect,z);uv.push(u,v);sta.push(z+.5);belly.push(0);}}
 for(let i=0;i<segs;i++)for(let j=0;j<rows;j++){const a=i*(rows+1)+j,b=a+1,c=a+rows+1,d=c+1;idx.push(a,c,b,b,c,d);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('station',new T.Float32BufferAttribute(sta,1));g.setAttribute('belly',new T.Float32BufferAttribute(belly,1));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function photoMaterial(u,map,{fins=false}={}){
 const m=new T.MeshPhysicalMaterial({map,color:0xffffff,roughness:fins?.55:.42,metalness:.0,sheen:fins?.1:.3,sheenColor:new T.Color(.6,.6,.45),clearcoat:fins?.1:.35,clearcoatRoughness:.3,side:T.DoubleSide,transparent:fins,alphaTest:fins?.18:0,depthWrite:true});
 m.onBeforeCompile=s=>{Object.assign(s.uniforms,{swimPhase:u.swimPhase,swimAmp:u.swimAmp,turnBend:u.turnBend,wet:u.wet});
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute float station;uniform float swimPhase,swimAmp,turnBend;')
   .replace('#include <begin_vertex>',`#include <begin_vertex>
float env=pow(clamp(1.-station,0.,1.),1.25);
transformed.x+=sin(swimPhase-(1.-station)*3.3)*swimAmp*env+turnBend*env*env*.35;`);
  s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform float wet;').replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.1,wet);');
 };m.customProgramCacheKey=()=>'first-light-photo-fish-v1'+(fins?'-fins':'');return m;
}
let geoCache=null;
export function makePhotoFishMesh(length,assets){
 if(!geoCache||geoCache.profile!==assets.profile)geoCache={profile:assets.profile,body:bodyFromProfile(assets.profile),card:finCardFromProfile(assets.profile)};
 const u={swimPhase:{value:0},swimAmp:{value:.02},turnBend:{value:0},wet:{value:0}};
 const root=new T.Group();root.scale.setScalar(length);
 const body=new T.Mesh(geoCache.body,photoMaterial(u,assets.flank));body.castShadow=true;root.add(body);
 const card=new T.Mesh(geoCache.card,photoMaterial(u,assets.fins,{fins:true}));card.castShadow=false;root.add(card);
 return {root,u,setJaw(){},setSwim(phase,amp,turn){u.swimPhase.value=phase;u.swimAmp.value=amp;u.turnBend.value=turn;},setWet(w){u.wet.value=w;},photo:true};
}
