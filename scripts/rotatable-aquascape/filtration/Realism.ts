import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import type {Part} from './model.ts';
import {addSurfaceDetail} from './SurfaceDetail.ts';
import {detailSump} from './SumpDetail.ts';
import {detailRoller} from './RollerDetail.ts';
import {detailSkimmer} from './SkimmerDetail.ts';
import {detailReturn} from './ReturnDetail.ts';

// Generated product references guide appearance. Dimensions and assembly remain teaching models.
const TAU=Math.PI*2;
type XYZ=[number,number,number];
function rng(seed:number){return()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}
function texture(draw:(c:CanvasRenderingContext2D,n:number)=>void,n=512){const c=document.createElement('canvas');c.width=c.height=n;draw(c.getContext('2d')!,n);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;}
const grain=texture((c,n)=>{const random=rng(56);c.fillStyle='#888';c.fillRect(0,0,n,n);for(let i=0;i<65000;i++){const v=105+random()*50;c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(random()*n,random()*n,1,1);}});
export const fibers=texture((c,n)=>{const random=rng(212);c.fillStyle='#dddace';c.fillRect(0,0,n,n);for(let i=0;i<29000;i++){const x=random()*n,y=random()*n;c.strokeStyle=`rgba(${random()>.45?'255,255,250':'89,87,73'},${.035+random()*.13})`;c.lineWidth=.3+random()*.7;c.beginPath();c.moveTo(x,y);c.lineTo(x+(random()-.5)*7,y+2+random()*13);c.stroke();}});fibers.colorSpace=T.SRGBColorSpace;
export const bubbleMap=texture((c,n)=>{const g=c.createRadialGradient(n*.36,n*.32,1,n/2,n/2,n*.48);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.2,'rgba(245,255,255,.75)');g.addColorStop(.4,'rgba(199,220,229,.12)');g.addColorStop(.78,'rgba(220,244,250,.2)');g.addColorStop(.9,'rgba(255,255,255,.82)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,n,n);},64);
const wetness=texture((c,n)=>{const random=rng(8);c.fillStyle='#111';c.fillRect(0,0,n,n);for(let i=0;i<700;i++){const x=random()*n,y=random()*n,r=.7+random()*3;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#999');g.addColorStop(.6,'#444');g.addColorStop(1,'#111');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}});
export function materials(){
 const white=new T.MeshPhysicalMaterial({color:0xd8d6cc,roughness:.25,metalness:0,clearcoat:.25,clearcoatRoughness:.3,bumpMap:grain,bumpScale:.002});
 const dark=new T.MeshStandardMaterial({color:0x30343a,roughness:.49,metalness:.05,bumpMap:grain,bumpScale:.005});
 const teal=new T.MeshPhysicalMaterial({color:0x366f72,roughness:.28,metalness:.22,clearcoat:.3});
 const metal=new T.MeshStandardMaterial({color:0xa4aaa9,roughness:.26,metalness:.94,bumpMap:grain,bumpScale:.001});
 const rubber=new T.MeshStandardMaterial({color:0x17191b,roughness:.88,metalness:0,bumpMap:grain,bumpScale:.007});
 const shell=new T.MeshPhysicalMaterial({color:0xf4faf8,roughness:.055,metalness:0,transmission:.97,thickness:.045,ior:1.49,transparent:true,opacity:1,depthWrite:false,side:T.FrontSide,clearcoat:.45,clearcoatRoughness:.06,bumpMap:wetness,bumpScale:.0008});
 const glass=shell.clone();glass.color.set(0xebf8f5);glass.opacity=.78;glass.thickness=.055;glass.ior=1.52;glass.roughness=.05;
 return {white,dark,teal,metal,rubber,shell,glass,cream:new T.MeshStandardMaterial({color:0xe8e0c8,roughness:.54}),gold:new T.MeshStandardMaterial({color:0x715b35,roughness:.81})};
}
type Mats=ReturnType<typeof materials>;
export function roundedBox(w:number,h:number,d:number){return new RoundedBoxGeometry(w,h,d,2,Math.min(w,h,d,.2)*.18);}
export function vessel(radius:number,top:number,height:number,thickness=.025){const y=height/2;return new T.LatheGeometry([new T.Vector2(radius,-y),new T.Vector2(top,y),new T.Vector2(top-thickness,y),new T.Vector2(radius-thickness,-y),new T.Vector2(radius,-y)],96);}
function add(p:T.Object3D,g:T.BufferGeometry,m:T.Material,xyz:XYZ=[0,0,0]){const o=new T.Mesh(g,m);o.position.set(...xyz);p.add(o);return o;}
function box(p:T.Object3D,xyz:XYZ,s:XYZ,m:T.Material){return add(p,roundedBox(...s),m,xyz);}
function cyl(p:T.Object3D,xyz:XYZ,r:number,h:number,m:T.Material,n=64){return add(p,new T.CylinderGeometry(r,r,h,n),m,xyz);}
function torus(p:T.Object3D,xyz:XYZ,r:number,t:number,m:T.Material,axis='y'){const o=add(p,new T.TorusGeometry(r,t,8,64),m,xyz);if(axis==='y')o.rotation.x=Math.PI/2;else if(axis==='x')o.rotation.y=Math.PI/2;return o;}
function tube(p:T.Object3D,points:XYZ[],r:number,m:T.Material){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),48,r,12,false),m);}
function bolt(p:T.Object3D,xyz:XYZ,m:Mats,axis='y',r=.037){const g=new T.Group();g.position.set(...xyz);if(axis==='z')g.rotation.x=Math.PI/2;if(axis==='x')g.rotation.z=-Math.PI/2;p.add(g);cyl(g,[0,-.016,0],r*1.4,.018,m.metal,24);cyl(g,[0,.009,0],r,.044,m.metal,6);cyl(g,[0,.034,0],r*.43,.004,m.rubber,6);}
function annulus(p:T.Object3D,xyz:XYZ,r:number,inner:number,h:number,m:T.Material){return add(p,vessel(r,r,h,r-inner),m,xyz);}
function union(p:T.Object3D,xyz:XYZ,r:number,m:Mats){const g=new T.Group();g.position.set(...xyz);p.add(g);annulus(g,[0,0,0],r,r*.68,.21,m.white);for(let i=0;i<16;i++){const a=i/16*TAU;const rib=box(g,[Math.cos(a)*r,0,Math.sin(a)*r],[.035,.16,.035],m.white);rib.rotation.y=-a;}for(const y of [-.12,.12])torus(g,[0,y,0],r*.78,.016,m.rubber);return g;}
function mergeStatic(group:T.Group){group.updateMatrixWorld(true);const byMat=new Map<T.Material,T.Mesh[]>();for(const child of [...group.children])if(child instanceof T.Mesh&&!Array.isArray(child.material)){const list=byMat.get(child.material)||[];list.push(child);byMat.set(child.material,list);}for(const [material,meshes] of byMat){if(meshes.length<3)continue;const gs=meshes.map(m=>{m.updateMatrix();const g=m.geometry.clone().applyMatrix4(m.matrix);return g.index?g.toNonIndexed():g;});const merged=mergeGeometries(gs,false);if(merged){for(const m of meshes)group.remove(m);add(group,merged,material);}for(const g of gs)g.dispose();}}
function batchPart(group:T.Group){group.updateWorldMatrix(true,true);const inverse=group.matrixWorld.clone().invert(),byMat=new Map<T.Material,T.Mesh[]>();group.traverse(o=>{if(o instanceof T.Mesh&&!(o instanceof T.InstancedMesh)&&!o.userData.dynamic&&!Array.isArray(o.material)){const list=byMat.get(o.material)||[];list.push(o);byMat.set(o.material,list);}});for(const [material,meshes] of byMat){if(meshes.length<2)continue;const gs=meshes.map(m=>{const g=m.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,m.matrixWorld));return g.index?g.toNonIndexed():g;});const merged=mergeGeometries(gs,false);if(merged){for(const m of meshes)m.removeFromParent();add(group,merged,material);}for(const g of gs)g.dispose();}}
export function enrich(parts:Part[],groups:Record<string,T.Group>,m:Mats){
 const get=(id:string)=>parts.find(p=>p.id===id)!.group;
 const detail=(id:string)=>{const g=new T.Group();get(id).add(g);return g;};
 const silicone=new T.MeshPhysicalMaterial({color:0xcdd1cc,roughness:.5,transparent:true,opacity:.45,depthWrite:false});
 const edge=new T.MeshPhysicalMaterial({color:0x8ea8a5,roughness:.12,metalness:.1,transparent:true,opacity:.45,depthWrite:false});
 for(const p of parts.filter(p=>p.system==='system'&&(p.id.startsWith('sump-')||p.id.startsWith('baffle-')))){
  const panel=p.group.children[0] as T.Mesh;if(!panel)continue;const b=new T.Box3().setFromObject(panel),size=b.getSize(new T.Vector3());
  const edges=new T.LineSegments(new T.EdgesGeometry(panel.geometry,30),new T.LineBasicMaterial({color:0xb4d1ca,transparent:true,opacity:.56}));edges.position.copy(panel.position);edges.scale.copy(panel.scale);p.group.add(edges);
  const d=new T.Group();p.group.add(d);if(p.id.startsWith('sump-')){if(size.x>3){for(const x of [-size.x/2+.018,size.x/2-.018])box(d,[x,0,0],[.034,size.y,.07],silicone);}else for(const z of [-size.z/2+.018,size.z/2-.018])box(d,[0,0,z],[.07,size.y,.034],silicone);}mergeStatic(d);
 }
 for(const [id,pos] of [['return-pipe',[.35,2.45,0]],['overflow',[-.25,2.6,0]],['emergency',[.05,2.65,0]]] as [string,XYZ][]){const d=detail(id);union(d,pos,.22,m);}
 const base=detail('skimmer-base');for(let i=0;i<8;i++){const a=i/8*TAU;bolt(base,[Math.cos(a)*.94,.14,Math.sin(a)*.94],m,'y');}
 const chamber=detail('reaction-body');add(chamber,vessel(.91,.91,.52),m.shell,[0,-1.08,0]);annulus(chamber,[0,-1.34,0],.95,.85,.055,m.white);annulus(chamber,[0,-.825,0],.94,.86,.07,m.white);annulus(chamber,[0,.83,0],.415,.34,.055,m.white);for(let i=0;i<6;i++){const a=i/6*TAU;bolt(chamber,[Math.cos(a)*.9,-1.29,Math.sin(a)*.9],m,'y',.025);}
 const skimmerMotor=get('skimmer-pump');skimmerMotor.clear();const housing=cyl(skimmerMotor,[0,0,0],.23,.5,m.white);housing.rotation.x=Math.PI/2;for(let i=0;i<12;i++){const a=i/12*TAU;const rib=box(skimmerMotor,[Math.cos(a)*.23,Math.sin(a)*.23,0],[.025,.04,.42],m.dark);rib.rotation.z=a-Math.PI/2;}box(skimmerMotor,[0,-.17,0],[.63,.12,.53],m.white);for(const x of [-.23,.23])bolt(skimmerMotor,[x,.03,.26],m,'z',.025);tube(skimmerMotor,[[-.16,0,-.26],[-.32,.07,-.33],[-.37,.33,-.65]],.024,m.rubber);mergeStatic(skimmerMotor);
 const cup=detail('cup');annulus(cup,[0,-.32,0],.8,.33,.045,edge);annulus(cup,[0,.31,0],.8,.744,.032,m.white);
 const neck=detail('neck');union(neck,[0,-.3,0],.385,m);
 const lid=get('cup-lid');(lid.children[0] as T.Mesh).material=m.white;const ld=detail('cup-lid');annulus(ld,[0,.05,0],.78,.75,.01,m.rubber);for(let i=0;i<8;i++){const a=i/8*TAU;bolt(ld,[Math.cos(a)*.7,.063,Math.sin(a)*.7],m,'y',.019);}
 const out=detail('skimmer-outlet');union(out,[.32,.52,0],.2,m);for(let i=0;i<10;i++){const a=i/10*TAU;box(out,[.32+Math.cos(a)*.17,.81,Math.sin(a)*.17],[.024,.14,.024],m.dark);}
 const fine=addSurfaceDetail(parts,groups,m);
 const sump=detailSump(parts,groups,m);
 const roller=detailRoller(parts,groups,m);
 const skimmer=detailSkimmer(parts,groups,m);
 const pumpDetail=detailReturn(parts,groups);
 for(const p of parts){if(!['clean-roll','waste-roll','pump-rotor','needle-wheel'].includes(p.id))batchPart(p.group);else{for(const c of p.group.children)if(c instanceof T.Group)batchPart(c);}}
 rootShadows();function rootShadows(){for(const g of Object.values(groups))g.traverse(o=>{if(o instanceof T.Mesh){const material=o.material as T.Material;o.castShadow=!material.transparent;o.receiveShadow=!material.transparent;}});}
 return {pumpDetail,visibility:(visible:boolean)=>{fine.visibility(visible);sump.visibility(visible);roller.visibility(visible);skimmer.visibility(visible);pumpDetail.visibility(visible);},update:(time:number)=>{fine.update(time);sump.update(time);roller.update(time);skimmer.update(time);pumpDetail.update(time);}};
}

export function rockMaterial(){
 const pits=texture((c,n)=>{const random=rng(492);c.fillStyle='#aaa';c.fillRect(0,0,n,n);for(let i=0;i<19000;i++){const x=random()*n,y=random()*n,r=.6+Math.pow(random(),2)*5.5,g=c.createRadialGradient(x-r*.12,y-r*.1,0,x,y,r);g.addColorStop(0,'#242424');g.addColorStop(.38,'#555');g.addColorStop(.69,'#dedede');g.addColorStop(1,'#aaa');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}for(let i=0;i<3500;i++){c.strokeStyle='rgba(50,50,50,.35)';c.lineWidth=.7;const x=random()*n,y=random()*n;c.beginPath();c.moveTo(x,y);c.lineTo(x+random()*8,y+random()*7);c.stroke();}},1024);
 const mineral=texture((c,n)=>{const random=rng(328);c.fillStyle='#e2dcd1';c.fillRect(0,0,n,n);for(let i=0;i<27000;i++){const x=random()*n,y=random()*n,r=.3+Math.pow(random(),3)*4;c.fillStyle=random()>.48?'rgba(52,44,31,.32)':'rgba(255,251,235,.52)';c.beginPath();c.ellipse(x,y,r,r*.6,random()*TAU,0,TAU);c.fill();}},1024);mineral.colorSpace=T.SRGBColorSpace;
 return new T.MeshPhysicalMaterial({color:0xffffff,vertexColors:true,map:mineral,roughness:.66,bumpMap:pits,bumpScale:.044,metalness:0,clearcoat:.16,clearcoatRoughness:.4});
}
