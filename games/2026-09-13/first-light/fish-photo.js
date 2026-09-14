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
 m.onBeforeCompile=s=>{Object.assign(s.uniforms,{swimPhase:u.swimPhase,swimAmp:u.swimAmp,turnBend:u.turnBend,wet:u.wet,jawOpen:u.jawOpen,jawHingeY:u.jawHingeY});
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute float station;uniform float swimPhase,swimAmp,turnBend,jawOpen,jawHingeY;')
   .replace('#include <begin_vertex>',`#include <begin_vertex>
float env=pow(clamp(1.-station,0.,1.),1.25);
transformed.x+=sin(swimPhase-(1.-station)*3.3)*swimAmp*env+turnBend*env*env*.35;
// the lower jaw: the front of the loft below the mouth line swings down about a hinge at station .86
float jw=smoothstep(.86,.92,station)*step(transformed.y,jawHingeY)*jawOpen;
if(jw>0.){float ang=jw*.55;float cy=transformed.y-jawHingeY,cz=transformed.z-.36;float c=cos(ang),sn=sin(ang);transformed.y=jawHingeY+cy*c-cz*sn;transformed.z=.36+cy*sn+cz*c;}`);
  s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform float wet;').replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.1,wet);');
 };m.customProgramCacheKey=()=>'first-light-photo-fish-v2'+(fins?'-fins':'');return m;
}
const geoCache=new Map();
// pectoral fins: a translucent fan hinged behind the gill, rays drawn once onto a small canvas, tinted from the flank
let pectTex=null;
function pectoralTexture(){if(pectTex)return pectTex;const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
 const grad=g.createRadialGradient(0,128,4,0,128,128);grad.addColorStop(0,'rgba(255,255,255,.95)');grad.addColorStop(.75,'rgba(255,255,255,.72)');grad.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=grad;g.fillRect(0,0,128,128);
 g.strokeStyle='rgba(70,55,30,.38)';g.lineWidth=1.3;for(let i=0;i<=10;i++){const a=(i/10)*Math.PI*.5;g.beginPath();g.moveTo(0,128);g.lineTo(Math.cos(a)*132,128-Math.sin(a)*132);g.stroke();}
 pectTex=new T.CanvasTexture(c);pectTex.colorSpace=T.SRGBColorSpace;return pectTex;}
function pectoralGeometry(R=.12,segs=8){const pos=[0,0,0],uv=[0,1],idx=[];const a0=-35*Math.PI/180,a1=25*Math.PI/180;
 for(let i=0;i<=segs;i++){const t=i/segs,th=a0+(a1-a0)*t,phi=t*Math.PI*.44;pos.push(0,Math.sin(th)*R,-Math.cos(th)*R);uv.push(Math.cos(phi),1-Math.sin(phi));if(i<segs)idx.push(0,i+1,i+2);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
function tintFromFlank(tex,u,v){try{const img=tex&&tex.image;if(!img||!(img.width||img.naturalWidth))return new T.Color(0xb9a27a);const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.drawImage(img,0,0,64,64);const x=Math.max(2,Math.min(61,Math.round(u*64))),y=Math.max(2,Math.min(61,Math.round((1-v)*64)));const d=g.getImageData(x-2,y-2,5,5).data;let r=0,gg=0,b=0,n=0;for(let i=0;i<d.length;i+=4){if(d[i+3]<40)continue;r+=d[i];gg+=d[i+1];b+=d[i+2];n++;}if(!n)return new T.Color(0xb9a27a);return new T.Color(r/n/255,gg/n/255,b/n/255).multiplyScalar(1.1);}catch{return new T.Color(0xb9a27a);}}
export function makePhotoFishMesh(length,assets){
 if(!geoCache.has(assets.profile))geoCache.set(assets.profile,{profile:assets.profile,body:bodyFromProfile(assets.profile),card:finCardFromProfile(assets.profile)});const geo=geoCache.get(assets.profile);
 const hp=sampleProfile(assets.profile.stations,.86);
 const u={swimPhase:{value:0},swimAmp:{value:.02},turnBend:{value:0},wet:{value:0},jawOpen:{value:0},jawHingeY:{value:(hp.top+hp.bottom)/2}};
 const root=new T.Group();root.scale.setScalar(length);
 const body=new T.Mesh(geo.body,photoMaterial(u,assets.flank));body.castShadow=true;root.add(body);
 const card=new T.Mesh(geo.card,photoMaterial(u,assets.fins,{fins:true}));card.castShadow=false;root.add(card);
 // the pectorals, mirrored, hinged at station .76 a little below the midline
 const pp=sampleProfile(assets.profile.stations,.76);const pmid=(pp.top+pp.bottom)/2,py=pmid-.3*(pmid-pp.bottom),pz=.26,px=Math.max(.01,pp.halfWidth*.85);
 const tint=tintFromFlank(assets.flank,1-.76,1-(pp.texTop+pp.texBottom)/2);const pmat=new T.MeshPhysicalMaterial({map:pectoralTexture(),color:tint,transparent:true,opacity:.9,side:T.DoubleSide,roughness:.5,metalness:0,depthWrite:false});
 const pgeo=pectoralGeometry();const pect=[1,-1].map(side=>{const g=new T.Group();g.position.set(side*px,py,pz);g.rotation.set(-.25,-side*.45,0);const m=new T.Mesh(pgeo,pmat);m.castShadow=false;g.add(m);root.add(g);return {g,side};});
 return {root,u,setJaw(open){u.jawOpen.value=Math.max(0,Math.min(1,open||0));},setSwim(phase,amp,turn){u.swimPhase.value=phase;u.swimAmp.value=amp;u.turnBend.value=turn;pect.forEach((p,i)=>{p.g.rotation.y=-p.side*.45+Math.sin(phase*.8+i*1.5)*.12*Math.min(1,amp*25+.4);});},setWet(w){u.wet.value=w;},photo:true};
}
