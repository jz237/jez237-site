import * as T from 'three';
import {shrimpCarapace,shrimpPlate,shrimpFan,fanRays,shrimpRostrum,snailBody,ramshornShell} from './GrazerGeometry.ts';
import {grazerMaterials} from './GrazerMaterials.ts';
import type {Identification} from './Exploration.ts';

type Animal={id:number;kind:'shrimp'|'snail';position:T.Vector3;normal:T.Vector3;heading:number;distance:number;speed:number;remaining:number;grazing:boolean;phase:number;seed:number;route:T.Vector3[];normals:T.Vector3[];length:number;matrix:T.Matrix4;};
const UP=new T.Vector3(0,1,0);
const rand=(a:Animal)=>{a.seed=(Math.imul(a.seed,1664525)+1013904223)>>>0;return a.seed/4294967296;};
/** Speeds here are illustrative world units, not measured species kinematics. */
export function advanceGrazer(a:Animal,dt:number){
 if(dt<=0)return;
 a.remaining-=dt;
 if(a.remaining<=0){a.grazing=!a.grazing;a.remaining=a.kind==='snail'?8+rand(a)*18:a.grazing?3+rand(a)*9:2+rand(a)*5;}
 const target=a.kind==='snail'?(a.grazing?.0015:.006):(a.grazing?0:.035+.025*Math.sin(a.phase*.3)**2);
 a.speed+=(target-a.speed)*(1-Math.exp(-dt*4));a.distance=(a.distance+a.speed*dt)%a.length;a.phase+=dt;
}

/** Shared instanced parts: full articulation uses shared batches, not one draw per leg. */
export class Invertebrates{
 readonly root=new T.Group();readonly animals:Animal[]=[];
 private pools:T.InstancedMesh[]=[];private textures:T.Texture[]=[];private size=new T.Vector3();private counts:number[]=[];private owners:number[][]=[];
 private dummy=new T.Object3D();private local=new T.Matrix4();private tangent=new T.Vector3();private binormal=new T.Vector3();private rotation=new T.Matrix4();private link=new T.Vector3();private end=new T.Vector3();
 constructor(scene:T.Scene,height:(x:number,z:number)=>number,surfaces:T.Object3D[]=[],atlas?:T.Texture){
  this.root.name='Shrimp and ramshorn snails';scene.add(this.root);
  const {skin,plateSkin,membrane,joint,flesh,shell,dark,textures}=grazerMaterials(atlas);this.textures=textures;
  const plate=shrimpPlate(),patches=Float32Array.from({length:36},(_,i)=>.323-(i%6)*.0616667);plate.setAttribute('plateOffset',new T.InstancedBufferAttribute(patches,1));
  const sphere=new T.SphereGeometry(1,20,14),rod=new T.CylinderGeometry(.95,1,1,7,1);
  for(const [g,m,n] of [[sphere,skin,90],[sphere,membrane,110],[sphere,dark,45],[rod,joint,1100],[sphere,flesh,30],[ramshornShell(),shell,3],[rod,skin,320],[shrimpCarapace(),skin,6],[plate,plateSkin,36],[shrimpFan(),membrane,90],[fanRays(),joint,90],[shrimpRostrum(),skin,6],[snailBody(),flesh,3],[rod,flesh,120]] as [T.BufferGeometry,T.Material,number][]){
   const mesh=new T.InstancedMesh(g,m,n);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.boundingSphere=new T.Sphere(new T.Vector3(0,2.7,0),6.4);mesh.castShadow=true;mesh.receiveShadow=true;this.pools.push(mesh);this.root.add(mesh);this.owners.push([]);
  }
  // Cache contact paths once. Hardscape is raycast at construction, never each frame.
  scene.updateMatrixWorld();const ray=new T.Raycaster(new T.Vector3(),new T.Vector3(0,-1,0));
  const centers=[[-3.8,1.8],[-2.2,1.72],[1.1,1.96],[1.8,.9],[3.55,1.45],[-1.3,-.55],[3.6,0]];
  for(let id=0;id<9;id++){
   const kind=id<6?'shrimp':'snail',glass=id>=7,route:T.Vector3[]=[],normals:T.Vector3[]=[];
   for(let j=0;j<192;j++){
    const t=j/192*Math.PI*2;
    if(glass){route.push(new T.Vector3((id===7?-3.5:3.6)+Math.sin(t)*.5,(id===7?2:3.4)+Math.cos(t)*.55,2.321));normals.push(new T.Vector3(0,0,-1));}
    else {const [cx,cz]=centers[id],x=cx+Math.cos(t)*.43,z=cz+Math.sin(t)*.2;let y=height(x,z)+.03;const normal=new T.Vector3(- (height(x+.01,z)-height(x-.01,z))/.02,1,-(height(x,z+.01)-height(x,z-.01))/.02).normalize();
     ray.ray.origin.set(x,5,z);const hit=ray.intersectObjects(surfaces,false).find(h=>h.point.y>y&&h.face&&h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.65);
     if(hit){y=hit.point.y+.014;normal.copy(hit.face!.normal).transformDirection(hit.object.matrixWorld);}route.push(new T.Vector3(x,y,z));normals.push(normal);
    }
   }
   // A route must never bridge a cliff between wood and the floor. Relocate those
   // paths to the open front margin instead of interpolating an airborne animal.
   if(!glass&&route.some((p,j)=>Math.abs(p.y-route[(j+1)%route.length].y)>.045)){
    for(let j=0;j<route.length;j++){const p=route[j];p.z=1.98+Math.sin(j/route.length*Math.PI*2)*.1;p.y=height(p.x,p.z)+.03;normals[j].set(-(height(p.x+.01,p.z)-height(p.x-.01,p.z))/.02,1,-(height(p.x,p.z+.01)-height(p.x,p.z-.01))/.02).normalize();}
   }
   // Uniform arc-length sampling prevents speed changes caused by ellipse curvature.
   const lengths=[0];for(let j=1;j<=route.length;j++)lengths.push(lengths[j-1]+route[j%route.length].distanceTo(route[j-1]));const length=lengths.at(-1)!;
   const points:T.Vector3[]=[],ns:T.Vector3[]=[];let k=0;for(let j=0;j<256;j++){const d=j/256*length;while(k<route.length-1&&lengths[k+1]<d)k++;const f=(d-lengths[k])/(lengths[k+1]-lengths[k]);points.push(route[k].clone().lerp(route[(k+1)%route.length],f));ns.push(normals[k].clone().lerp(normals[(k+1)%route.length],f).normalize());}
   this.animals.push({id,kind,position:new T.Vector3(),normal:new T.Vector3(),heading:0,distance:length*(id*.173%1),speed:0,remaining:2+id*.73,grazing:id%2===0,phase:id*2.7,seed:237+id*3571,route:points,normals:ns,length,matrix:new T.Matrix4()});
  }
  this.update(0);
 }
 private part(a:Animal,pool:number,x:number,y:number,z:number,sx:number,sy:number,sz:number,rz=0,ry=0,rx=0){
  this.dummy.position.set(x,y,z);this.dummy.rotation.set(rx,ry,rz);this.dummy.scale.set(sx,sy,sz);this.dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;
 }
 private rod(a:Animal,pool:number,x:number,y:number,z:number,ex:number,ey:number,ez:number,r:number){
  this.link.set(ex-x,ey-y,ez-z);this.dummy.position.set((x+ex)/2,(y+ey)/2,(z+ez)/2);this.dummy.quaternion.setFromUnitVectors(UP,this.end.copy(this.link).normalize());this.dummy.scale.set(r,this.link.length(),r);this.dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;
 }
 update(dt:number){
  if(!this.root.visible)return;
  this.counts=this.pools.map(()=>0);
  for(const a of this.animals){advanceGrazer(a,Math.min(.1,Math.max(0,dt)));const u=a.distance/a.length*a.route.length,i=Math.floor(u)%a.route.length,j=(i+1)%a.route.length;
   a.position.copy(a.route[i]).lerp(a.route[j],u-i);a.normal.copy(a.normals[i]).lerp(a.normals[j],u-i).normalize();this.tangent.copy(a.route[j]).sub(a.route[i]).normalize();this.binormal.crossVectors(this.tangent,a.normal).normalize();this.tangent.crossVectors(a.normal,this.binormal).normalize();this.rotation.makeBasis(this.tangent,a.normal,this.binormal);a.matrix.copy(this.rotation).setPosition(a.position);a.matrix.scale(this.size.setScalar(a.kind==='shrimp'?.80+a.id%3*.04:.84));
   if(a.kind==='shrimp')this.shrimp(a);else this.snail(a);
  }
  this.pools.forEach((p,i)=>{p.count=this.counts[i];p.instanceMatrix.needsUpdate=true;});
 }
 private shrimp(a:Animal){
  const t=a.phase,walk=a.speed/.06;
  this.part(a,7,0,0,0,1,1,1);this.part(a,11,0,0,0,1,1,1);
  for(let k=0;k<6;k++){
   const x=-.102-k*.037,y=.116+Math.sin(k/5*Math.PI)*.014-k*.003,flex=Math.sin(t*1.3-k*.46)*.017*(.35+walk);
   this.part(a,8,x,y,0,.04,[.046,.045,.042,.036,.028,.017][k],[.039,.038,.035,.030,.024,.015][k],flex);
   if(k<5)for(const side of [-1,1]){
    const flap=.24*Math.sin(t*3.4-k*.84+side*.7),args=[x,y-.03,side*.022,.30,.6,.48,flap,side*.3] as const;
    this.part(a,9,...args);this.part(a,10,...args);
   }
  }
  for(let k=-2;k<=2;k++){const ry=k*.32+.035*Math.sin(t*1.1),scale=k===0?.72:Math.abs(k)===2?1:.88;this.part(a,9,-.309,.100,k*.006,scale,1,k===0?.50:1,.025*Math.sin(t*.9+k),ry);this.part(a,10,-.309,.100,k*.006,scale,1,k===0?.50:1,.025*Math.sin(t*.9+k),ry);}
  for(const side of [-1,1]){
   this.rod(a,6,.123,.139,side*.022,.141,.148,side*.030,.0038);this.part(a,0,.141,.148,side*.030,.008,.008,.007);
   this.part(a,2,.142,.149,side*.035,.0065,.0065,.0052);
   for(let k=0;k<5;k++){
    const x=.105-k*.034,phase=t*(a.grazing?4.1:8)+k*1.65+side*1.5,pick=k<2&&a.grazing,swing=Math.sin(phase)*.025*walk,lift=Math.max(0,Math.cos(phase))*.020*walk;
    const transfer=pick?Math.max(0,Math.sin(phase)):0,kneeX=x-.016,kneeY=.044+transfer*.018,kneeZ=side*.060,
     toeX=pick?.16-transfer*.023:x-.040+swing,toeY=pick?.006+transfer*.080:.003+lift,toeZ=side*(pick?.037-transfer*.020:.10);
    this.rod(a,6,x,.079,side*.033,kneeX,kneeY,kneeZ,.0032);
    this.part(a,1,kneeX,kneeY,kneeZ,.0039,.0039,.0039);
    const ankleX=T.MathUtils.lerp(kneeX,toeX,.72),ankleY=T.MathUtils.lerp(kneeY,toeY,.72),ankleZ=T.MathUtils.lerp(kneeZ,toeZ,.72);
    this.rod(a,3,kneeX,kneeY,kneeZ,ankleX,ankleY,ankleZ,.0024);this.rod(a,6,ankleX,ankleY,ankleZ,toeX,toeY,toeZ,.0019);
    if(k<2){
     const gape=.003+.002*Math.max(0,Math.sin(phase));this.rod(a,6,toeX,toeY,toeZ,toeX+.010,toeY+.002,toeZ+side*gape,.0013);this.rod(a,6,toeX,toeY,toeZ,toeX+.011,toeY+.001,toeZ-side*gape,.0013);
     for(let h=0;h<3;h++)this.rod(a,3,toeX+.006+h*.002,toeY+.001,toeZ+side*gape,toeX+.010+h*.002,toeY+.003,toeZ+side*(gape+.003),.00020);
    }
   }
   for(let antenna=0;antenna<2;antenna++){
    let x=.184,y=.133,z=side*.016;for(let k=1;k<=16;k++){const f=k/16,len=antenna?.19:.37,
     ex=.184+f*len,ey=.133+Math.sin(f*2.3)*(antenna?.035:.09)+Math.sin(t*.9+side+f*1.4)*.012*f,
     ez=side*(.016+f*(antenna?.053:.13)+Math.sin(t*.62+antenna+f)*.016*f);
     this.rod(a,k<4?6:3,x,y,z,ex,ey,ez,.0015*(1-f*.86));x=ex;y=ey;z=ez;
    }
   }
   for(let k=0;k<3;k++){const f=Math.sin(t*(8+k)+side+k)*.008;this.rod(a,6,.15-k*.009,.101,side*.011,.178+f,.082,side*(.016+k*.005),.0018);this.part(a,1,.178+f,.082,side*(.016+k*.005),.005,.008,.003);}
  }
 }
 private snail(a:Animal){
  const t=a.phase;this.part(a,12,0,0,0,1,1,1);this.part(a,5,0,0,0,1,1,1);
  for(const side of [-1,1]){
   let x=.177,y=.054,z=side*.048;
   for(let k=1;k<=18;k++){const f=k/18,ex=.177+f*.15,ey=.054+f*.105+Math.sin(t*.65+side+f)*f*.012,ez=side*(.048+f*.065)+Math.sin(t*.54+f)*.008*f;
    this.rod(a,13,x,y,z,ex,ey,ez,.0053*(1-f*.88));x=ex;y=ey;z=ez;
   }
   this.part(a,4,.174,.052,side*.052,.008,.008,.006);this.part(a,2,.176,.054,side*.057,.0037,.0037,.0027);
   this.rod(a,3,.22,.022,side*.038,.25,.009,side*.052,.0032);
  }
  this.part(a,2,.224,.003,0,.009,.0017,.006);this.part(a,4,.225,.006,0,.013+Math.sin(t*2.5)*.0015,.004,.011);
 }
 info(id:number):Identification|null{const a=this.animals[id];if(!a)return null;return {kind:'invertebrate',animalId:id,name:a.kind==='shrimp'?`Cherry shrimp ${id+1}`:`Ramshorn snail ${id-5}`,subtitle:a.kind==='shrimp'?'Neocaridina davidi · cherry shrimp model':'Planorbid ramshorn · representative model',needs:'Stable clean water, suitable mineral availability, food and safe grazing surfaces.',role:a.kind==='shrimp'?'Picks biofilm and small food particles with its front appendages. Its legs walk while its antennae explore.':'Grazes surface films using a radula. A muscular foot maintains contact with the glass or substrate.',behavior:a.kind==='shrimp'?(a.grazing?'Picking at a feeding patch.':'Walking to another feeding patch.'):'Slow surface crawling and grazing. These animals recycle material; they also produce waste.',point:a.position.clone()};}
 pick(ray:T.Raycaster){const hit=ray.intersectObjects(this.pools,false)[0];if(!hit||hit.instanceId===undefined)return null;const pool=this.pools.indexOf(hit.object as T.InstancedMesh);return {distance:hit.distance,info:this.info(this.owners[pool][hit.instanceId])!};}
 dispose(){const geometries=new Set(this.pools.map(p=>p.geometry)),materials=new Set(this.pools.map(p=>p.material as T.Material));geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose());this.root.removeFromParent();}
}
