import {gustGLSL} from './wind-gusts.js';
import * as T from './vendor/three.module.js';
import {motoPine} from './moto-pine.js';
import {barkMaterial,rockMaterial} from './land-materials.js';
import {routeDistance} from './courses.js';

// Botanical meshes use branched silhouettes and individual curved leaves.
// Geometry and materials are shared by hundreds of instanced plants.
class Shape {
 constructor(){this.p=[];this.uv=[];this.c=[];}
 tri(a,b,c,shade=1,uv=[[0,0],[1,0],[.5,1]]){for(const [i,v] of [a,b,c].entries()){this.p.push(...v);this.uv.push(...uv[i]);this.c.push(shade,shade,shade);}}
 leaf(a,b,width,angle,shade=1){
  const av=new T.Vector3(...a),bv=new T.Vector3(...b),axis=bv.clone().sub(av),side=new T.Vector3(Math.cos(angle),.12,Math.sin(angle)).multiplyScalar(width);
  const mid=av.clone().addScaledVector(axis,.48),ridge=mid.clone().add(new T.Vector3(0,width*.22,0));
  const l=mid.clone().add(side),r=mid.clone().sub(side);
  this.tri(a,l.toArray(),ridge.toArray(),shade,[[.5,0],[0,.48],[.5,.48]]);this.tri(a,ridge.toArray(),r.toArray(),shade*.87,[[.5,0],[.5,.48],[1,.48]]);
  this.tri(l.toArray(),b,ridge.toArray(),shade*.94,[[0,.48],[.5,1],[.5,.48]]);this.tri(ridge.toArray(),b,r.toArray(),shade*.79,[[.5,.48],[.5,1],[1,.48]]);
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
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}

function tree(kind,seed){
 const wood=new Shape(),leaf=new Shape(),random=rng(seed);
 if(kind==='palm'){
  const top=new T.Vector3(.8,11.2,.3);
  for(let i=0;i<14;i++){const t=i/14,u=(i+1)/14;wood.tube([.8*t*t,11.2*t,.3*t],[.8*u*u,11.2*u,.3*u],.26-t*.11,.26-u*.11,9);}
  for(let j=0;j<20;j++){
   const a=j*2.399+(random()-.5)*.25,len=(j<4?2.4:4.2)+random()*1.8,down=j<4?-1.6:.4+random()*.8;
   const path=t=>top.clone().add(new T.Vector3(Math.cos(a)*len*t,Math.sin(t*Math.PI)*1.3-t*t*(1.9+down),Math.sin(a)*len*t));
   for(let k=0;k<24;k++){
    const t=k/24,u=(k+1)/24,p=path(t),q=path(u);wood.tube(p.toArray(),q.toArray(),.045*(1-t)+.006,.045*(1-u)+.006,4);
    if(k<2)continue;
    for(const side of [-1,1]){
     const reach=Math.sin(t*Math.PI)*1.28+.10;
     const tip=p.clone().add(new T.Vector3(Math.cos(a+.5)*.28-Math.sin(a)*side*reach,-.13-reach*.26,Math.sin(a+.5)*.28+Math.cos(a)*side*reach));
     leaf.leaf(p.toArray(),tip.toArray(),.13+Math.sin(t*Math.PI)*.11,a, .72+random()*.36);
    }
   }
  }
 }else if(kind==='pine'){
  wood.tube([0,0,0],[.16,13,0],.34,.035,10);
  for(let j=0;j<60;j++){
   const t=j/60,y=2.3+t*10.4,a=j*2.3999,len=(1-t)*3.4+.22,start=[.16*t,y,0],end=[Math.cos(a)*len,y+.25-Math.sin(t*Math.PI)*.3,Math.sin(a)*len];
   wood.tube(start,end,.075*(1-t)+.015,.008,5);
   for(let k=1;k<9;k++){
    const f=k/9,c=new T.Vector3().fromArray(start).lerp(new T.Vector3(...end),f);
    for(const side of [-1,1]){
     const reach=(1-f)*.95+.12,tip=c.clone().add(new T.Vector3(-Math.sin(a)*side*reach,.18+random()*.22,Math.cos(a)*side*reach));
     leaf.leaf(c.toArray(),tip.toArray(),reach*.36,a,.61+random()*.48);
    }
   }
  }
 }else{
  wood.tube([0,0,0],[.3,6.1,.1],.38,.06,9);
  for(let j=0;j<18;j++){
   const a=j*2.399,y=2.7+random()*3.5,r=1.3+random()*1.3,end=[Math.cos(a)*r,y+1.3,Math.sin(a)*r];wood.tube([.2,y-1.3,0],end,.10,.014,6);
   for(let k=0;k<60;k++){
    const az=random()*Math.PI*2,rad=Math.sqrt(random())*1.5,c=[end[0]+Math.cos(az)*rad,end[1]+(random()-.5)*1.8,end[2]+Math.sin(az)*rad];
    leaf.leaf(c,[c[0]+Math.cos(az)*.54,c[1]+(random()-.3)*.75,c[2]+Math.sin(az)*.54],.18,az+Math.PI/2,.65+random()*.4);
   }
  }
 }
 return{wood:wood.geometry(),leaf:leaf.geometry()};
}

export function makeCoastalScenery(root,course){
 const random=rng(course.id.split('').reduce((n,c)=>n+c.charCodeAt(0),834)),geometries=[],materials=[],meshes=[];
 const time={value:0},strength={value:.3},distance={value:360};
 const wood=barkMaterial();materials.push(wood);
 function wind(material,flex=.03){
  material.onBeforeCompile=s=>{
   Object.assign(s.uniforms,{foliageTime:time,foliageWind:strength,foliageDistance:distance});
   s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float foliageTime,foliageWind,foliageDistance;'+gustGLSL)
    .replace('#include <begin_vertex>',`#include <begin_vertex>
vec3 anchor=(modelMatrix*instanceMatrix*vec4(0.,0.,0.,1.)).xyz;
vec3 gust=gustAt(anchor.xz,foliageTime,foliageWind);
float phase=anchor.x*.061+anchor.z*.087;
float bend=pow(max(position.y,0.)*.09,2.)*${flex.toFixed(4)};
transformed.x+=sin(foliageTime*1.4+phase+position.y*.17)*bend*(.35+foliageWind*1.8+gust.z*3.);
transformed.z+=sin(foliageTime*1.03+phase*.7)*bend*.55*(.35+foliageWind*1.8+gust.z*3.);
float farFade=1.-smoothstep(foliageDistance,foliageDistance+45.,length(cameraPosition.xz-anchor.xz));transformed*=farFade;`);
  };material.customProgramCacheKey=()=>`coastal-wind-${flex}`;
 }
 wind(wood,0);
 // Leaf flutter is modest: movement follows the same strengthening weather as the water.
 function foliage(color,flex){const m=new T.MeshStandardMaterial({color,roughness:.86,side:T.DoubleSide,vertexColors:true});wind(m,flex);materials.push(m);return m;}
 const palmMat=foliage(0x66813d,.22),pineMat=foliage(0x415c38,.13),broadMat=foliage(0x657c39,.22),grassMat=foliage(0x8b9152,1.1);
 // Continuous leaf coordinates carry a midrib, angled veins, waxy highlights
 // and subtle colour variation instead of flat green polygons.
 for(const m of [palmMat,broadMat]){const before=m.onBeforeCompile;m.onBeforeCompile=s=>{before(s);s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 leafUV;').replace('#include <begin_vertex>','#include <begin_vertex>\nleafUV=uv;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 leafUV;').replace('#include <color_fragment>',`#include <color_fragment>
 float midrib=exp(-pow((leafUV.x-.5)*55.,2.));
 float veins=pow(.5+.5*cos((leafUV.y-abs(leafUV.x-.5)*.65)*100.),12.);
 float mottling=.5+.5*sin(leafUV.y*23.+sin(leafUV.x*31.));
 diffuseColor.rgb*=mix(vec3(.64,.78,.42),vec3(1.16,1.08,.76),mottling*.45+leafUV.y*.25);
 diffuseColor.rgb+=vec3(.07,.085,.025)*(midrib+veins*.45);`).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 roughnessFactor=.53+veins*.12;`);};m.customProgramCacheKey=()=> 'veined-coastal-foliage-'+m.color.getHex();}

 function instances(g,m,points){
  geometries.push(g);if(!points.length)return;
  // Spatial batches let small devices discard distant groves before touching water.
  if(points.length>0&&!points[0].batched){const bins=new Map();for(const p of points){const key=Math.floor(p.x/64)+','+Math.floor(p.z/64);if(!bins.has(key))bins.set(key,[]);bins.get(key).push({...p,batched:true});}const group=new T.Group();root.add(group);for(const bin of bins.values()){const child=instances(g,m,bin);group.add(child);}return group;}
  const mesh=new T.InstancedMesh(g,m,points.length),dummy=new T.Object3D();mesh.userData.dynamic=true;
  points.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(p.rx??0,p.angle,p.rz??0);dummy.scale.set(p.scale,p.scale*(p.stretch??1),p.scale);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);if(m.vertexColors)mesh.setColorAt(i,new T.Color().setScalar(.78+p.tint*.3));});
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);meshes.push(mesh);mesh.userData.foliageCenter=mesh.boundingSphere.center.clone();mesh.userData.foliageRadius=mesh.boundingSphere.radius;return mesh;
 }
 const pineWood=motoPine?new T.MeshStandardMaterial({map:motoPine.bark,roughness:.94}):wood;if(motoPine){materials.push(pineWood);wind(pineWood,0);pineMat.map=motoPine.bough;pineMat.color.setHex(0xd3dfc7);pineMat.alphaTest=.42;pineMat.alphaToCoverage=true;}
 const cold=course.theme==='ice',urban=['port','city','fortress'].includes(course.theme),tropical=['beach','island','resort','park'].includes(course.theme),points={palm:[],pine:[],broad:[]},grassPoints=[],rockPoints=[],logPoints=[];
 for(let i=0;i<3000;i++){
  const x=(random()-.5)*670,z=(random()-.5)*670,y=course.ground(x,z),d=routeDistance(course,x,z);
  if(y<1.5||d<(course.layoutRevision?24:46)||course.renderGround&&y>course.renderGround(x,z)+.5)continue;
  const slope=Math.hypot(course.ground(x+1,z)-course.ground(x-1,z),course.ground(x,z+1)-course.ground(x,z-1))/2;
  const common={x,y:y-.12,z,angle:random()*Math.PI*2,scale:.55+random()*.9,tint:random()};
  const cluster=Math.sin(x*.047+Math.sin(z*.032)*2)*Math.cos(z*.039);
  if(i<1600&&slope<.48&&y>2.2&&(!urban||i<75)&&(!cold||i<100)&&cluster>-.40){
   const kind=tropical?(random()<.60?'palm':'broad'):(course.theme==='coast'&&random()>.7?'broad':'pine');
   points[kind].push({...common,stretch:.85+random()*.3});
  }
  if(!cold&&slope<.58&&y<20&&i<2100&&cluster>-.3)grassPoints.push({...common,scale:.65+random()*1.1});
  if(y<4.5&&slope<.7&&i<1500)rockPoints.push({...common,scale:.35+random()**2*3.0,stretch:.45+random()*.6});
  if(y>1.5&&y<3.5&&slope<.3&&logPoints.length<16)logPoints.push({...common,scale:.6+random()*.7});
 }
 // Companion saplings and mature trees create depth around the established
 // anchors, as in Pine Ridge's groves, using our own lightweight botanical meshes.
 for(const kind of ['palm','pine','broad'])for(const anchor of [...points[kind]]){
  if(random()>.58||urban||cold)continue;
  for(let j=0;j<2;j++){const a=random()*6.283,r=4+random()*8,x=anchor.x+Math.cos(a)*r,z=anchor.z+Math.sin(a)*r,y=course.ground(x,z);
   if(y<2.3||routeDistance(course,x,z)<(course.layoutRevision?24:46)||Math.abs(y-anchor.y)>3||course.renderGround&&y>course.renderGround(x,z)+.5)continue;
   points[kind].push({...anchor,x,y:y-.1,z,angle:random()*6.283,scale:.4+random()*.7,stretch:.8+random()*.4,tint:random()});
  }
 }
 // Keep a finite scenery budget; prioritize groves visible from the course.
 const nearest=Object.entries(points).flatMap(([kind,rows])=>rows.map(p=>({kind,p,d:routeDistance(course,p.x,p.z)}))).sort((a,b)=>a.d-b.d).slice(0,600);
 for(const kind of Object.keys(points))points[kind]=nearest.filter(row=>row.kind===kind).map(row=>row.p);
 for(const kind of ['palm','pine','broad']){
  if(!points[kind].length)continue;const model=kind==='pine'&&motoPine?{wood:motoPine.wood.clone(),leaf:motoPine.leaf.clone()}:tree(kind,473+kind.length);
  instances(model.wood,kind==='pine'?pineWood:wood,points[kind]);instances(model.leaf,kind==='palm'?palmMat:kind==='pine'?pineMat:broadMat,points[kind]);
 }
 const tuft=new Shape();for(let i=0;i<24;i++){
  const a=random()*Math.PI*2,r=random()*.42,h=.35+random()*.65,x=Math.cos(a)*r,z=Math.sin(a)*r;
  tuft.leaf([x,0,z],[x+Math.cos(a)*h*.38,h,z+Math.sin(a)*h*.38],.025+random()*.025,a+Math.PI/2,.6+random()*.5);
 }
 const grassClusters=[];for(const point of grassPoints)for(let i=0;i<4;i++){const x=point.x+(random()-.5)*4,z=point.z+(random()-.5)*4,y=course.ground(x,z);if(y>1.5)grassClusters.push({...point,x,y,z,angle:random()*6.28});}
 const grassMesh=instances(tuft.geometry(),grassMat,grassClusters);if(grassMesh)grassMesh.traverse(m=>{m.castShadow=false;});
 const rock=rockMaterial();materials.push(rock);const geo=new T.IcosahedronGeometry(1,2),p=geo.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),f=.85+.14*Math.sin(x*7+z*5)*Math.cos(y*6);p.setXYZ(i,x*f,y*f*.68,z*f);}geo.computeVertexNormals();instances(geo,rock,rockPoints);
 const drift=new Shape();drift.tube([-1.9,.19,0],[1.9,.28,.12],.24,.12,9);drift.tube([.4,.25,0],[1.1,.6,.6],.11,.03,6);drift.tube([-1.6,.2,0],[-2.1,.6,-.4],.08,.015,5);instances(drift.geometry(),wood,logPoints);
 // Low shrubs fill the tree line without a repeated grid of identical plants.
 const shrubs=[...points.broad,...points.pine].slice(0,90).map(p=>({...p,x:p.x+3,z:p.z+2,scale:.16+random()*.16,y:course.ground(p.x+3,p.z+2)})).filter(p=>p.y>1.7);
 if(shrubs.length){const shrub=tree('broad',725);instances(shrub.wood,wood,shrubs);instances(shrub.leaf,broadMat,shrubs);}
 // Soft ambient contact under trunks and canopies supplements directional
 // shadows. Each quad conforms to the shared terrain instead of hovering.
 const contactCanvas=document.createElement('canvas');contactCanvas.width=contactCanvas.height=64;const ctx=contactCanvas.getContext('2d'),gradient=ctx.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'rgba(0,0,0,.8)');gradient.addColorStop(.18,'rgba(0,0,0,.35)');gradient.addColorStop(.65,'rgba(0,0,0,.10)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
 const contactTexture=new T.CanvasTexture(contactCanvas),contactMaterial=new T.MeshBasicMaterial({map:contactTexture,transparent:true,opacity:.5,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});materials.push(contactMaterial);
 const cp=[],cu=[];for(const point of Object.values(points).flat()){const radius=3.2*point.scale;for(const [x,z] of [[-1,-1],[-1,1],[1,-1],[1,-1],[-1,1],[1,1]]){const px=point.x+x*radius,pz=point.z+z*radius;cp.push(px,course.ground(px,pz)+.035,pz);cu.push((x+1)/2,(z+1)/2);}}
 const contactGeometry=new T.BufferGeometry();contactGeometry.setAttribute('position',new T.Float32BufferAttribute(cp,3));contactGeometry.setAttribute('uv',new T.Float32BufferAttribute(cu,2));geometries.push(contactGeometry);const contacts=new T.Mesh(contactGeometry,contactMaterial);contacts.userData.dynamic=true;contacts.renderOrder=1;root.add(contacts);
 root.userData.sceneryCounts={trees:Object.values(points).reduce((n,p)=>n+p.length,0),grass:grassPoints.length,pebbles:rockPoints.length,driftwood:logPoints.length};
 return{update(t,storm,quality,budget=1,camera=null,second=null){time.value=t;strength.value=storm;distance.value=(quality==='low'?200:quality==='medium'?280:380)*budget;
 if(camera)for(const m of meshes){const c=m.userData.foliageCenter,r=m.userData.foliageRadius;const d=Math.min(Math.hypot(camera.x-c.x,camera.z-c.z),second?Math.hypot(second.x-c.x,second.z-c.z):Infinity);m.visible=d<distance.value+r+45;}
 if(grassMesh)grassMesh.visible=quality!=='low';},dispose(){contacts.removeFromParent();contactTexture.dispose();for(const m of meshes){m.removeFromParent();m.dispose();}for(const g of new Set(geometries))g.dispose();for(const m of materials)m.dispose();}};
}
