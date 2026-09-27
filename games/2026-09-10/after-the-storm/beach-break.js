import * as T from './vendor/three.module.js';
import {wave,waterLevel} from './simulation.js';
import {characterAt} from './water-character.js';
import {WAVES,swellGLSL} from './wave-model.js';
import {SURF_BANDS,surfStrength} from './surf-waves.js';
import {cloudGLSL} from './weather-light.js';
import {panoramaGLSL} from './sky-panorama.js';
import {sprayUniforms,sprayVertex,sprayFragment} from './spray-light.js';
// Visual beach break. Crests of the shared swell that reach a beach's break line
// steepen, throw a lip, plunge and run up the sand as whitewater, then drain back.
// Nothing here feeds hulls, buoyancy or race rules: the water surface is unchanged.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const TILE=48,STEP=2,RANGE=120,COLUMNS=32,CURL_ROWS=18,CARPET_ROWS=22,G=9.81;
export const NO_BEACH=['city','port','ice'];
// Seconds: steepening before the lip throws, lip throw (grows with height), collapse.
export const PRE=1.1,COLLAPSE=.45,throwTime=H=>.5+.22*H;
export const lipReach=H=>.95*H+.1,breakSpeed=H=>Math.sqrt(G*(1.1*H+.1));
// Whitewater bore on a planar beach travels at sqrt(g*D), where D = slope*u + h0
// includes the bore's own height; sqrt(D) then falls linearly with time.
export const boreDepth=H=>.35*H+.1;
export function boreFront(up,slope,H,tb){if(tb<0)return Infinity;const h0=boreDepth(H),r=Math.sqrt(slope*up+h0)-.5*slope*Math.sqrt(G)*tb;return Math.max(0,(Math.max(r,Math.sqrt(h0))**2-h0)/slope);}
export const boreTime=(up,slope,H)=>2*(Math.sqrt(slope*up+boreDepth(H))-Math.sqrt(boreDepth(H)))/(slope*Math.sqrt(G));
export const runup=(H,slope)=>clamp(.55*H/slope,1.2,12);
export const swashTime=H=>2.2+.9*H;

// Waterline crossings on a 2 m grid, kept about 6 m apart. Each point carries its
// landward normal and nearshore slope; walls, cliffs, rocks and enclosed pans are skipped.
export function scanShoreTile(ground,level,tx,tz,rocks=[]){
 const n=TILE/STEP+1,x0=tx*TILE,z0=tz*TILE,h=new Float32Array(n*n),found=[];
 for(let j=0;j<n;j++)for(let i=0;i<n;i++)h[j*n+i]=ground(x0+i*STEP,z0+j*STEP)-level;
 const add=(x,z)=>{
  if(found.some(q=>Math.abs(q.x-x)<6&&Math.abs(q.z-z)<6&&Math.hypot(q.x-x,q.z-z)<6))return;
  const gx=(ground(x+1,z)-ground(x-1,z))/2,gz=(ground(x,z+1)-ground(x,z-1))/2,g=Math.hypot(gx,gz);
  if(g<.012||g>.65)return;
  const nx=gx/g,nz=gz/g,sea=level-ground(x-nx*10,z-nz*10);
  if(sea<.6||level-ground(x-nx*22,z-nz*22)<.9)return;
  if(rocks.some(r=>Math.hypot(x-r.x,z-r.z)<(r.r||0)+2.5))return;
  found.push({x,z,nx,nz,slope:clamp(sea/10,.02,.5),eta:[0,0],mean:0,env:.12,next:0,seen:false});
 };
 for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=h[j*n+i];
  if(i<n-1){const b=h[j*n+i+1];if((a<0)!==(b<0))add(x0+(i+a/(a-b))*STEP,z0+j*STEP);}
  if(j<n-1){const b=h[(j+1)*n+i];if((a<0)!==(b<0))add(x0+i*STEP,z0+(j+a/(a-b))*STEP);}}
 return found;
}

const n10=v=>v.toFixed(10);
// The breaker cross-section in its travel plane: x toward the beach from the crest,
// y above the local water. v runs from the trough in front, up the concave face,
// along the underside of the thrown lip to its tip, back over the lip to the crest
// and down the back of the wave. c is the lip throw (0 steep crest, 1 plunging).
const sectionGLSL=`
vec2 lipAt(float s,float L,float h){return vec2(L*s,h*(1.+.12*s)-(1.12*h+.08)*s*s);}
vec2 breakerSection(float v,float c,float h){
 float S=max(c,.002),L=(.95*c+.05)*h+.05,rootY=h*(.8-.12*c),F=h*(2.3-1.1*c)+.5,B=h*2.8+1.2;
 if(v<.3){float w=v/.3;vec2 p0=vec2(F,0.),p1=vec2(.14*h,.03*h),p2=vec2(0.,rootY);return mix(mix(p0,p1,w),mix(p1,p2,w),w);}
 if(v<.55){float w=(v-.3)/.25;return lipAt(w*S,L,h)-vec2(0.,mix(h-rootY,.03*h,w));}
 if(v<.8){float w=(v-.55)/.25;return lipAt((1.-w)*S,L,h);}
 float w=(v-.8)/.2;return vec2(-B*w,h*(.5+.5*cos(3.14159265*w)));
}`;
const vertexCommon=`uniform float time,storm,seaLevel;
${swellGLSL}
uniform float t0,H,tc,life;
attribute vec4 colA,colB;
varying vec3 vWorld;varying float vAlpha,vTau;`;
const fragmentCommon=`uniform float time,storm,night;uniform vec3 eye,sun,skyHorizon,skyZenith,waterScatter;uniform sampler2D foamDetailMap;
uniform float t0,H,tc,life;
${cloudGLSL}
${panoramaGLSL}
varying vec3 vWorld;varying float vAlpha,vTau;
vec3 foamLight(vec3 N,float cloudLight){return mix(vec3(.9,.95,.94),vec3(.37,.45,.48),storm)*mix(.65,1.,cloudLight)*(.84+.2*max(0.,dot(N,sun)))*(1.-night*.72);}
vec3 fogged(vec3 col){float dist=length(eye-vWorld),fog=1.-exp(-dist*dist*.0000010*(1.+storm*3.)-dist*.00038);return mix(col,mix(skyHorizon,vec3(.20,.28,.32),storm)*(1.-night*.8),fog);}
float lace(vec2 p,float fresh){vec2 q=p+vec2(time*.05,-time*.03);return smoothstep(.34-.2*fresh,.68-.2*fresh,texture2D(foamDetailMap,q*.32).r*.65+texture2D(foamDetailMap,q*.9).g*.35);}`;

const curlVertex=`${vertexCommon}
${sectionGLSL}
attribute float rowV;
varying vec3 vNormal;varying float vV,vC,vK,vHeight;
void main(){
 vec2 S=colA.xy,n=colA.zw;float ub=colB.x,delay=colB.z,edge=colB.w;
 float tau=time-t0-delay,tk=${n10(COLLAPSE)};
 float c=clamp(tau/tc,0.,1.),k=clamp((tau-tc)/tk,0.,1.);
 float h=H*edge*smoothstep(-${n10(PRE)},0.,tau)*(1.-.8*k);
 float uc=ub-sqrt(9.81*(1.1*H+.1))*clamp(tau,-${n10(PRE)},tc+tk);
 vec2 base=S-n*uc;
 vec2 sec=breakerSection(rowV,c,h)+vec2(k*.5*H,0.),a=breakerSection(max(0.,rowV-.012),c,h),b=breakerSection(min(1.,rowV+.012),c,h);
 vec2 d=normalize(b-a+vec2(1e-5,0.)),nn=vec2(d.y,-d.x);
 vWorld=vec3(base.x+n.x*sec.x,seaLevel+waveSurface(base).x+sec.y-.05,base.y+n.y*sec.x);
 vNormal=normalize(vec3(n.x*nn.x,nn.y,n.y*nn.x));
 vV=rowV;vC=c;vK=k;vTau=tau;vHeight=sec.y/max(H*edge,.05);
 // Small lagoon waves spill without a visible curl; the curl fades in and out in time.
 vAlpha=edge*smoothstep(.25,.6,H)*smoothstep(-${n10(PRE)},-${n10(PRE-.5)},tau)*(1.-smoothstep(tc+tk*.4,tc+tk,tau));
 gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`;
const curlFragment=`${fragmentCommon}
uniform sampler2D detailMap;
varying vec3 vNormal;varying float vV,vC,vK,vHeight;
void main(){
 if(vAlpha<.003)discard;
 vec3 V=normalize(eye-vWorld),N=normalize(vNormal);if(!gl_FrontFacing)N=-N;
 // The ocean's own capillary slopes keep the face from reading as smooth glass.
 vec2 ripple=texture2D(detailMap,vWorld.xz*.31+vec2(time*.021,-time*.017)).rg*2.-1.+(texture2D(detailMap,vWorld.xz*.83-vec2(time*.03,time*.02)).rg*2.-1.)*.5;
 N=normalize(N+vec3(ripple.x,0.,ripple.y)*.16);
 float nv=max(.001,dot(N,V)),fres=.0204+.9796*pow(1.-nv,5.),cloudLight=cloudVisibility(vWorld);
 vec3 sky=panoramaRadiance(reflect(-V,N),sun,skyHorizon,skyZenith,night,storm);
 // Thick water low in the face keeps the venue's deep colour; the thinning upper
 // face and lip transmit turquoise light, strongest when the sun is behind it.
 float high=smoothstep(.25,.95,vHeight),thin=high*(.5+.5*smoothstep(.3,.5,vV))*(1.-smoothstep(.82,.97,vV));
 vec3 deep=waterScatter*1.6+vec3(.004,.02,.03);
 vec3 glow=vec3(.07,.42,.38)*(.5+.5*max(0.,dot(N,sun)))+vec3(.08,.38,.30)*pow(max(0.,dot(V,-sun)),2.);
 vec3 col=mix(deep,glow,thin*(1.-storm*.45))*mix(.7,1.,cloudLight)*(1.-night*.75);
 col=mix(col,sky,fres);
 vec3 h=normalize(V+sun);col+=vec3(1.,.95,.85)*pow(max(0.,dot(N,h)),220.)*3.*cloudLight*(1.-storm*.8)*(1.-night);
 // Foam feathers the crest as it steepens, laces the thrown lip, then whitewater
 // spreads down the face as the lip collapses.
 float crestFoam=smoothstep(.62,.8,vV)*(1.-smoothstep(.84,.94,vV))*smoothstep(-.4,.5,vTau/tc)*.8;
 float lipFoam=smoothstep(.36,.58,vV)*(1.-smoothstep(.74,.84,vV))*vC;
 float faceFoam=vK*1.3+smoothstep(.55,1.,vC)*(1.-smoothstep(.1,.3,vV))*.5;
 // Lace resolves up close; at racing distance the broken crest reads as a white line.
 float foam=clamp(max(max(crestFoam,lipFoam),faceFoam),0.,1.)*mix(lace(vWorld.xz,vK+.3*vC),.92,smoothstep(20.,80.,length(eye-vWorld)));
 col=mix(col,foamLight(N,cloudLight),foam);
 // The lowest face melts into the surrounding sea instead of cutting through it.
 float a=vAlpha*mix(.9,1.,foam)*smoothstep(.02,.22,vHeight+foam*.2)*smoothstep(0.,.08,vV)*(1.-smoothstep(.92,1.,vV));
 gl_FragColor=vec4(fogged(col),a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const carpetVertex=`${vertexCommon}
attribute float rowU,groundY;
varying float vU,vFront,vPassed,vReach,vSwash,vUp,vUb,vDepth;
void main(){
 vec2 S=colA.xy,n=colA.zw;float ub=colB.x,slope=max(colB.y,.02),delay=colB.z,edge=colB.w;
 float tau=time-t0-delay,cb=sqrt(9.81*(1.1*H+.1)),up=max(.6,ub-cb*tc-(.95*H+.1)),h0=.35*H+.1,k=.5*slope*sqrt(9.81),d0=sqrt(slope*up+h0),tb=tau-tc;
 float front=tb<0.?1e4:(pow(max(d0-k*tb,sqrt(h0)),2.)-h0)/slope,tShore=(d0-sqrt(h0))/k,ts=tb-tShore,tsw=2.2+.9*H;
 float reach=ts>0.?clamp(.55*H/slope,1.2,12.)*sin(3.14159265*clamp(ts/tsw,0.,1.)):0.;
 vec2 p=S-n*rowU;
 float water=seaLevel+waveSurface(p).x;
 float fade=exp(-max(tb,0.)*.2);
 float roller=(.42*H+.3*H*exp(-tb*1.5))*fade*exp(-pow((rowU-front)/(.7+.4*H),2.))*step(0.,tb)*step(0.,rowU);
 float swash=rowU<0.?step(-reach,rowU)*(.03+.05*H*(1.-clamp(-rowU/max(reach,.1),0.,1.))):0.;
 vWorld=vec3(p.x,max(water,groundY)+roller+swash+.03,p.y);
 // Seconds since the bore passed this row (plunge splash seaward of the landing point).
 vPassed=rowU>=up?tb:rowU>=0.?tb-(d0-sqrt(slope*rowU+h0))/k:-1.;
 vU=rowU;vFront=front;vReach=reach;vSwash=ts/tsw;vUp=up;vUb=ub;vTau=tau;vDepth=water-groundY;
 // Whitewater tapers over about a quarter of the ribbon at each end (edge^4 of the sine profile).
 vAlpha=pow(edge,4.)*(1.-smoothstep(life-2.5,life,time-t0));
 gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`;
const carpetFragment=`${fragmentCommon}
varying float vU,vFront,vPassed,vReach,vSwash,vUp,vUb,vDepth;
void main(){
 if(vAlpha<.003||vTau<tc)discard;
 // A dense rolling front, the fresh froth it leaves, and older foam eroding into
 // lace. The plunge explodes into a wide band that narrows as the bore runs in;
 // seaward of the plunge the splash thins out instead of ending on a line.
 float tb=max(vTau-tc,0.),band=exp(-pow((vU-vFront)/(.9+.5*H+1.2*H*exp(-tb*.9)),2.))*step(0.,vU)*exp(-tb*.08)*(1.+.6*exp(-tb*1.2));
 float trail=vPassed>0.?exp(-vPassed/4.5):0.;
 float water=max(band*1.2,trail*(1.-smoothstep(vUp-.5,vUb+1.,vU)))*smoothstep(-.02,.1,vDepth);
 float sand=step(vU,0.)*step(0.,vSwash)*step(-vReach*1.3,vU)*(1.-smoothstep(.75,1.,vSwash));
 if(water<.004&&sand<.004)discard;
 float cloudLight=cloudVisibility(vWorld),broad=texture2D(foamDetailMap,vWorld.xz*.021).b;
 trail=vPassed>0.?exp(-vPassed/(3.4+2.2*broad)):0.;
 float fresh=clamp(band+trail*trail,0.,1.);
 // Bore foam needs water under it; a trough that bares the sand leaves it dry.
 float cover=max(band*1.2,trail*(1.-smoothstep(vUp-.5,vUb+1.,vU)))*mix(lace(vWorld.xz,fresh),.8*fresh+.1,smoothstep(30.,110.,length(eye-vWorld)))*smoothstep(-.02,.1,vDepth);
 // Swash: a faint wet sheen on the sand behind a lobed foam edge that drains back.
 float reach=vReach*(.75+.5*broad);
 float onSand=step(vU,0.)*step(-reach,vU)*step(0.,vSwash)*(1.-smoothstep(.7,1.,vSwash));
 float edge=step(vU,0.)*step(0.,vSwash)*exp(-pow((vU+reach)/(.35+.25*H),2.))*(1.-smoothstep(.8,1.,vSwash));
 cover=max(cover,edge*lace(vWorld.xz*1.4,.6));
 vec3 N=vec3(0.,1.,0.),col=foamLight(N,cloudLight);
 vec3 film=mix(waterScatter*3.+vec3(.12,.15,.13),panoramaRadiance(reflect(normalize(vWorld-eye),N),sun,skyHorizon,skyZenith,night,storm),.45);
 col=mix(film,col,clamp(cover*1.4,0.,1.));
 // Ribbon ends and the lifetime fade erode through the foam pattern, not along a line.
 float a=max(cover,onSand*.09*(.6+.8*broad))*smoothstep(0.,.3,vAlpha-.2*(1.-broad));
 if(a<.004)discard;
 gl_FragColor=vec4(fogged(col),a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const beachBreakShaders={curlVertex,curlFragment,carpetVertex,carpetFragment};

function grid(columns,rows,extra){
 const g=new T.BufferGeometry(),count=(columns+1)*(rows+1),index=[];
 for(let r=0;r<rows;r++)for(let c=0;c<columns;c++){const a=r*(columns+1)+c,b=a+1,d=a+columns+1;index.push(a,d,b,b,d,d+1);}
 g.setIndex(index);
 g.setAttribute('position',new T.BufferAttribute(new Float32Array(count*3),3));
 g.setAttribute('colA',new T.BufferAttribute(new Float32Array(count*4),4));
 g.setAttribute('colB',new T.BufferAttribute(new Float32Array(count*4),4));
 for(const name of extra)g.setAttribute(name,new T.BufferAttribute(new Float32Array(count),1));
 return g;
}
function makeRibbon(scene,shared){
 const uniforms={...shared,t0:{value:-1e4},H:{value:.5},tc:{value:.6},life:{value:1}};
 const material=(vertexShader,fragmentShader,order)=>new T.ShaderMaterial({uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const curl=new T.Mesh(grid(COLUMNS,CURL_ROWS,['rowV']),material(curlVertex,curlFragment)),carpet=new T.Mesh(grid(COLUMNS,CARPET_ROWS,['rowU','groundY']),material(carpetVertex,carpetFragment));
 // Culled by a bounding sphere set at spawn; left out of refraction and the mirror pass.
 for(const [mesh,order] of [[carpet,2],[curl,3]]){mesh.visible=false;mesh.renderOrder=order;mesh.userData.skipRefraction=mesh.userData.skipReflection=true;mesh.geometry.boundingSphere=new T.Sphere();scene.add(mesh);}
 for(let r=0;r<=CURL_ROWS;r++)for(let c=0;c<=COLUMNS;c++)curl.geometry.attributes.rowV.array[r*(COLUMNS+1)+c]=r/CURL_ROWS;
 return {curl,carpet,uniforms,x:0,z:0,t0:-1e4,life:0,H:0,sprays:[]};
}

export function makeBeachBreak(scene,ocean,{count=12}={}){
 const shared=ocean?.mat?.uniforms||{},ribbons=Array.from({length:count},()=>makeRibbon(scene,shared)),tiles=new Map();
 // Plunge spray: pooled droplets shaded like the hull spray.
 const dropCount=1600,xyz=new Float32Array(dropCount*3),alpha=new Float32Array(dropCount),size=new Float32Array(dropCount),drops=Array.from({length:dropCount},()=>({life:0,max:1,vx:0,vy:0,vz:0,size:0}));
 const dropGeo=new T.BufferGeometry();dropGeo.setAttribute('position',new T.BufferAttribute(xyz,3));dropGeo.setAttribute('alpha',new T.BufferAttribute(alpha,1));dropGeo.setAttribute('size',new T.BufferAttribute(size,1));
 const spray=new T.Points(dropGeo,new T.ShaderMaterial({uniforms:sprayUniforms,vertexShader:sprayVertex,fragmentShader:sprayFragment,transparent:true,depthWrite:false}));
 spray.frustumCulled=false;spray.userData.skipRefraction=spray.userData.skipReflection=true;scene.add(spray);
 let ground=null,rocks=[],enabled=false,previous=null,scan=0,seed=1,dropIndex=0,limit=count;
 const random=()=>(seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296;
 const stats={shorePoints:0,emitted:0,active:0,tiles:0,lastHeight:0};
 function tileAt(tx,tz,build){
  const key=tx+','+tz,level=waterLevel.value;let tile=tiles.get(key);
  if((!tile||Math.abs(tile.level-level)>.12)&&build){tile={level,points:scanShoreTile(ground,level,tx,tz,rocks)};tiles.set(key,tile);stats.tiles=tiles.size;return {tile,built:true};}
  return {tile,built:false};
 }
 // Shore points near the camera, those ahead of it first when its heading is known.
 function nearby(camera,forward){
  const list=[];let built=false;
  for(let tz=Math.floor((camera.z-RANGE)/TILE);tz<=Math.floor((camera.z+RANGE)/TILE);tz++)for(let tx=Math.floor((camera.x-RANGE)/TILE);tx<=Math.floor((camera.x+RANGE)/TILE);tx++){
   const r=tileAt(tx,tz,!built);built||=r.built;
   if(r.tile)for(const p of r.tile.points){const d=Math.hypot(p.x-camera.x,p.z-camera.z);if(d<RANGE)list.push([forward?d*(1.6-.6*((p.x-camera.x)*forward.x+(p.z-camera.z)*forward.z)/Math.max(d,1)):d,p]);}
  }
  stats.shorePoints=list.length;
  return built?null:list.sort((a,b)=>a[0]-b[0]).slice(0,72).map(e=>e[1]);
 }
 // Crest direction for peel: the dominant surf set in Big Surf, else the longest swell band.
 const direction=()=>surfStrength.value>0?[SURF_BANDS[0][0],SURF_BANDS[0][1]]:[WAVES[0][0],WAVES[0][1]];
 // The waterline along the normal through (x,z): near the neighbouring column's
 // crossing first, then the full 28 m search.
 function shorelineNear(x,z,nx,nz,guess=null){
  const search=(from,to)=>{let last=ground(x+nx*from,z+nz*from)-waterLevel.value;for(let d=from+1;d<=to;d++){const g=ground(x+nx*d,z+nz*d)-waterLevel.value;if(last<0&&g>=0){const s=d-1+last/(last-g);return [x+nx*s,z+nz*s,s];}last=g;}return null;};
  return (guess!==null&&search(Math.floor(guess)-4,Math.floor(guess)+4))||search(-14,14);
 }
 function spawn(ribbon,p,H,t){
  ribbon.sprays=[];
  const tx=-p.nz,tz=p.nx,dir=direction(),along=dir[0]*tx+dir[1]*tz,cb=breakSpeed(H),width=clamp(20+12*H+random()*16,20,60);
  const peel=clamp(cb/Math.max(.25,Math.abs(along)),4,14),oblique=Math.abs(along)>.28,cols=[];
  for(let c=0;c<=COLUMNS;c++){
   const s=(c/COLUMNS-.5)*width,shore=shorelineNear(p.x+tx*s,p.z+tz*s,p.nx,p.nz,cols.at(-1)?.d??null);
   if(!shore){cols.push(null);continue;}
   const gx=(ground(shore[0]+1.5,shore[1])-ground(shore[0]-1.5,shore[1]))/3,gz=(ground(shore[0],shore[1]+1.5)-ground(shore[0],shore[1]-1.5))/3,g=Math.hypot(gx,gz);
   let nx=g>.005?gx/g:p.nx,nz=g>.005?gz/g:p.nz;if(nx*p.nx+nz*p.nz<.4){nx=p.nx;nz=p.nz;}
   cols.push({x:shore[0],z:shore[1],nx,nz,s,d:shore[2]});
  }
  // Waterline hits that bunch up (a spit tip, a tight bend) or jump apart break the run.
  const spacing=width/COLUMNS;let last=null;
  for(let c=0;c<=COLUMNS;c++){const q=cols[c];if(!q){last=null;continue;}if(last){const d=Math.hypot(q.x-last.q.x,q.z-last.q.z)/((c-last.c)*spacing);if(d<.45||d>3){cols[c]=null;continue;}}last={q,c};}
  for(let c=0;c<=COLUMNS;c++){const q=cols[c];if(!q)continue;let nx=q.nx*2,nz=q.nz*2;for(const o of [cols[c-1],cols[c+1]])if(o){nx+=o.nx;nz+=o.nz;}const l=Math.hypot(nx,nz);q.nx=nx/l;q.nz=nz/l;}
  const tc=throwTime(H);let longest=0;
  const curl=ribbon.curl.geometry.attributes,carpet=ribbon.carpet.geometry.attributes;
  if(!cols.some(Boolean))return false;
  // Columns without a waterline borrow the nearest valid one, so their (transparent)
  // triangles collapse instead of stretching back to the spawn point.
  const nearest=c=>{for(let k=1;k<=COLUMNS;k++)for(const j of [c-k,c+k])if(cols[j])return cols[j];};
  // Curls need at least six consecutive columns on the waterline and taper toward
  // each run's ends; a lone column at a sandbar tip would otherwise stand as a fin.
  const run=new Float32Array(COLUMNS+1);
  for(let c=0;c<=COLUMNS;c++){if(!cols[c])continue;let a=c,b=c;while(cols[a-1])a--;while(cols[b+1])b++;run[c]=b-a>=6?Math.min(1,Math.min(c-a,b-c)/4):0;}
  if(!run.some(v=>v>0))return false;
  for(let c=0;c<=COLUMNS;c++){
   const q=cols[c],valid=run[c]>0,at=q||nearest(c);
   const x=at.x,z=at.z,nx=at.nx,nz=at.nz;
   const slope=clamp((waterLevel.value-ground(x-nx*9,z-nz*9))/9,.02,.5);
   const ub=clamp((1.1*H+.1)/slope,2.5,26),edge=valid?Math.sin(Math.PI*c/COLUMNS)**.6*run[c]:0;
   const s=(c/COLUMNS-.5)*width,delay=oblique?(s*Math.sign(along)+width/2)/peel:Math.abs(s)/peel;
   const up=Math.max(.6,ub-cb*tc-lipReach(H));
   longest=Math.max(longest,delay+boreTime(up,slope,H)+swashTime(H));
   for(let r=0;r<=Math.max(CURL_ROWS,CARPET_ROWS);r++){
    for(const [attributes,rows] of [[curl,CURL_ROWS],[carpet,CARPET_ROWS]]){if(r>rows)continue;const i=r*(COLUMNS+1)+c;
     attributes.colA.array.set([x,z,nx,nz],i*4);attributes.colB.array.set([ub,slope,delay,edge],i*4);attributes.position.array.set([x,waterLevel.value,z],i*3);}
    if(r<=CARPET_ROWS){const i=r*(COLUMNS+1)+c,u=ub+2-(ub+2+runup(H,slope)*1.4)*r/CARPET_ROWS;carpet.rowU.array[i]=u;carpet.groundY.array[i]=u<5?ground(x-nx*u,z-nz*u):waterLevel.value-slope*u;}
   }
   if(valid)ribbon.sprays.push({x,z,nx,nz,ub,at:t+delay+tc,done:false});
  }
  for(const a of [curl.colA,curl.colB,curl.position,carpet.colA,carpet.colB,carpet.position,carpet.rowU,carpet.groundY])a.needsUpdate=true;
  const reach=Math.max(...cols.filter(Boolean).map(q=>Math.hypot(q.x-p.x,q.z-p.z)))+28+4*H;
  for(const mesh of [ribbon.curl,ribbon.carpet])mesh.geometry.boundingSphere.set(new T.Vector3(p.x-p.nx*10,waterLevel.value,p.z-p.nz*10),reach);
  Object.assign(ribbon,{x:p.x,z:p.z,t0:t,H,life:longest+tc+3});
  Object.assign(ribbon.uniforms.t0,{value:t});ribbon.uniforms.H.value=H;ribbon.uniforms.tc.value=tc;ribbon.uniforms.life.value=ribbon.life;
  ribbon.curl.visible=ribbon.carpet.visible=true;stats.emitted++;stats.lastHeight=+H.toFixed(2);return true;
 }
 function emitSpray(q,H,t,storm){
  const cb=breakSpeed(H),reach=lipReach(H),uc=q.ub-cb*throwTime(H),bx=q.x-q.nx*(uc-reach),bz=q.z-q.nz*(uc-reach),y=wave(bx,bz,t,storm);
  for(let k=0;k<Math.round(3+4*H);k++){const i=dropIndex++%dropCount,d=drops[i],spread=(random()-.5)*1.4;
   xyz.set([bx-q.nz*spread,y+.1,bz+q.nx*spread],i*3);
   Object.assign(d,{vx:q.nx*(1+random()*2*H),vy:(2+random()*3)*Math.sqrt(H),vz:q.nz*(1+random()*2*H),size:.3+random()*.7*H,max:1.1+random()*.9});d.life=d.max;}
 }
 return {
  stats,ribbons,spray,
  reset(course){
   tiles.clear();ground=course.renderGround||course.ground;rocks=(course.rocks||[]).filter(r=>!r.type||r.type==='rock');enabled=!NO_BEACH.includes(course.theme);previous=null;scan=0;seed=7;
   for(const r of ribbons){r.curl.visible=r.carpet.visible=false;r.t0=-1e4;r.sprays.length=0;}
   for(const d of drops)d.life=0;alpha.fill(0);dropGeo.attributes.alpha.needsUpdate=true;
   Object.assign(stats,{shorePoints:0,emitted:0,active:0,tiles:0,lastHeight:0});
  },
  update(t,storm,camera,quality='high',forward=null){
   if(!ground)return;
   const dt=previous===null?0:clamp(t-previous,0,.2);previous=t;limit=Math.min(count,quality==='low'?4:quality==='medium'?8:12);
   for(const r of ribbons)if((r.curl.visible||r.carpet.visible)&&t-r.t0>r.life){r.curl.visible=r.carpet.visible=false;r.sprays.length=0;}
   if(enabled&&(scan+=dt)>=.1){
    // Bounded work per scan: a few newly visible points learn their swell, one breaker spawns.
    // A frame that scanned a new shoreline tile leaves the crest scan to the next frame.
    const points=nearby(camera,forward);
    if(points){const step=scan;scan=0;let learned=0,spawned=0;
    for(const p of points){
     const u=clamp(.9/p.slope,3,24),bx=p.x-p.nx*u,bz=p.z-p.nz*u,eta=wave(bx,bz,t,storm)-waterLevel.value;
     // A point entering view learns its local swell from the previous 12 s, so the
     // first breaker is a real set crest rather than a capillary ripple.
     if(!p.seen){if(learned++>=4)continue;p.seen=true;let sum=0,top=-Infinity;for(let k=1;k<=24;k++){const e=wave(bx,bz,t-k*.5,storm)-waterLevel.value;sum+=e;top=Math.max(top,e);}p.mean=sum/24;p.env=Math.max(.05,top-p.mean);p.eta=[eta,eta];continue;}
     p.mean+=(eta-p.mean)*(1-Math.exp(-step/10));p.env=Math.max(eta-p.mean,p.env*Math.exp(-step/14));
     const crest=p.eta[0]-p.mean,peak=p.eta[0]>p.eta[1]&&p.eta[0]>=eta;p.eta=[eta,p.eta[0]];
     if(spawned||!peak||crest<.04||crest<.45*p.env||t<p.next)continue;
     const active=ribbons.filter((r,i)=>i<limit&&r.curl.visible);
     if(active.some(r=>Math.hypot(r.x-p.x,r.z-p.z)<18&&t-r.t0<r.uniforms.tc.value+1.2))continue;
     const free=ribbons.find((r,i)=>i<limit&&!r.curl.visible&&!r.carpet.visible);if(!free)break;
     const dir=direction(),facing=.35+.65*Math.max(0,dir[0]*p.nx+dir[1]*p.nz),exposure=characterAt(bx,bz)[1];
     if(!spawn(free,p,clamp((.2+1.4*crest)*(.4+.6*exposure)*facing*(1+.25*storm),.18,2.2),t))continue;spawned++;
     for(const tile of tiles.values())for(const q of tile.points)if(Math.hypot(q.x-p.x,q.z-p.z)<16)q.next=t+2.2;
    }}
   }
   for(const r of ribbons)for(const q of r.sprays)if(!q.done&&t>=q.at){q.done=true;if(r.curl.visible)emitSpray(q,r.H,t,storm);}
   let live=0;
   for(let i=0;i<dropCount;i++){const d=drops[i];if(d.life<=0){alpha[i]=0;continue;}live++;
    d.life-=dt;d.vy-=G*dt;d.vx*=Math.exp(-dt*.8);d.vz*=Math.exp(-dt*.8);
    xyz[i*3]+=d.vx*dt;xyz[i*3+1]+=d.vy*dt;xyz[i*3+2]+=d.vz*dt;
    const k=clamp(d.life/d.max);alpha[i]=k*k*.5;size[i]=d.size*(1.6-k*.6);}
   dropGeo.attributes.position.needsUpdate=dropGeo.attributes.alpha.needsUpdate=dropGeo.attributes.size.needsUpdate=true;
   stats.active=ribbons.filter(r=>r.curl.visible||r.carpet.visible).length;stats.drops=live;
  },
  // Development views of the newest breaker: standing on the beach looking out, or
  // riding behind it in the water looking at the beach, as a racer usually sees it.
  inspect(camera,from='beach'){
   const r=ribbons.filter(r=>r.curl.visible).sort((a,b)=>b.t0-a.t0)[0];if(!r)return false;
   const a=r.curl.geometry.attributes.colA.array,b=r.curl.geometry.attributes.colB.array,i=(COLUMNS>>1)*4,x=a[i],z=a[i+1],nx=a[i+2],nz=a[i+3],ub=b[i];
   if(from==='sea'){const d=ub+14,cx=x-nx*d+nz*9,cz=z-nz*d-nx*9;camera.position.set(cx,waterLevel.value+2.6,cz);camera.lookAt(x-nx*ub*.4,waterLevel.value+.4,z-nz*ub*.4);return true;}
   camera.position.set(x+nx*5-nz*7,ground(x+nx*5-nz*7,z+nz*5+nx*7)+1.7,z+nz*5+nx*7);camera.lookAt(x-nx*12,waterLevel.value+.5,z-nz*12);return true;
  },
 };
}
