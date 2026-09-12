import * as T from 'three';
import {shrimpCarapace,shrimpPlate,shrimpFan,fanRays,shrimpRostrum,snailBody,ramshornShell} from './GrazerGeometry.ts';
import {grazerMaterials} from './GrazerMaterials.ts';
import {GrazerPlants,leafContact,type LeafTrail,type PlantLeaf} from './GrazerPlants.ts';
import {createShrimpMotion,advanceShrimpMotion,shrimpAbdomen,shrimpCenters,swimmeretStroke,type ShrimpMotion} from './ShrimpMotion.ts';
import {grazerBody,bodiesOverlap,fishTouch,sweptPose,shrimpHip,type FishContactBody} from './GrazerCollision.ts';
import type {Obstacle} from './TankSpace.ts';
import type {Identification} from './Exploration.ts';

type Animal={escape?:{anchored:boolean;resume?:Animal['flight'];age:number;offset:T.Vector3;originDistance:number;from:T.Vector3;heading:T.Vector3};cooldown:number;motion:ShrimpMotion;trail?:LeafTrail;direction:number;blocked:number;tripIn:number;flight?:{freeFrom?:T.Vector3;from:T.Vector3;to:T.Vector3;target:LeafTrail;progress:number;duration:number;retreat:boolean;originDistance:number};id:number;kind:'shrimp'|'snail';position:T.Vector3;normal:T.Vector3;heading:number;distance:number;speed:number;remaining:number;grazing:boolean;phase:number;seed:number;route:T.Vector3[];normals:T.Vector3[];length:number;matrix:T.Matrix4;};
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
 externalBodies:ReturnType<typeof grazerBody>[]=[];
 readonly root=new T.Group();readonly animals:Animal[]=[];readonly fishCorrections=new Map<number,T.Vector3>();
 private obstacles:Obstacle[];private floorHeight:(x:number,z:number)=>number;private initialized=false;readonly plants:GrazerPlants;private waterTime=0;private usedLeaves=new Set<PlantLeaf>();
 private pools:T.InstancedMesh[]=[];private textures:T.Texture[]=[];private size=new T.Vector3();private counts:number[]=[];private owners:number[][]=[];
 private bodyFrame:T.Matrix4|null=null;private bodyFrames=Array.from({length:6},()=>new T.Matrix4());private posed=new T.Matrix4();
 private dummy=new T.Object3D();private local=new T.Matrix4();private tangent=new T.Vector3();private binormal=new T.Vector3();private rotation=new T.Matrix4();private link=new T.Vector3();private end=new T.Vector3();
 constructor(scene:T.Scene,height:(x:number,z:number)=>number,surfaces:T.Object3D[]=[],atlas?:T.Texture,obstacles:Obstacle[]=[],floorHeight:(x:number,z:number)=>number=height){
  this.obstacles=obstacles;this.floorHeight=floorHeight;
  this.root.name='Shrimp and ramshorn snails';scene.add(this.root);
  const {skin,plateSkin,membrane,joint,flesh,shell,dark,textures}=grazerMaterials(atlas);this.textures=textures;
  const plate=shrimpPlate(),patches=Float32Array.from({length:36},(_,i)=>.323-(i%6)*.0616667);plate.setAttribute('plateOffset',new T.InstancedBufferAttribute(patches,1));
  const sphere=new T.SphereGeometry(1,20,14),rod=new T.CylinderGeometry(.95,1,1,7,1);
  for(const [g,m,n] of [[sphere,skin,150],[sphere,membrane,110],[sphere,dark,45],[rod,joint,1100],[sphere,flesh,30],[ramshornShell(),shell,3],[rod,skin,440],[shrimpCarapace(),skin,6],[plate,plateSkin,36],[shrimpFan(),membrane,90],[fanRays(),joint,90],[shrimpRostrum(),skin,6],[snailBody(),flesh,3],[rod,flesh,120]] as [T.BufferGeometry,T.Material,number][]){
   const mesh=new T.InstancedMesh(g,m,n);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.boundingSphere=new T.Sphere(new T.Vector3(0,2.7,0),6.4);mesh.castShadow=true;mesh.receiveShadow=true;this.pools.push(mesh);this.root.add(mesh);this.owners.push([]);
  }
  // Cache contact paths once. Hardscape is raycast at construction, never each frame.
  scene.updateMatrixWorld();this.plants=new GrazerPlants(scene,(p,n,f,snail)=>this.solidClear(p,n,f,snail));const ray=new T.Raycaster(new T.Vector3(),new T.Vector3(0,-1,0));
  const centers=[[-3.8,1.8],[-2.2,1.72],[1.1,1.96],[1.8,.9],[3.55,1.45],[-1.3,-.55],[3.6,0]];
  const snailTrail=this.plants.trail(new T.Vector3(3.6,1.4,0),true,this.usedLeaves);
  for(let id=0;id<9;id++){
   const kind=id<6?'shrimp':'snail',trail=id===6?snailTrail:id<6?this.plants.trail(new T.Vector3(centers[id][0],height(...centers[id] as [number,number])+.7,centers[id][1]),false,this.usedLeaves):undefined,glass=id>=7||(!trail&&this.plants.leaves.length>0),route:T.Vector3[]=[],normals:T.Vector3[]=[];
   for(let j=0;j<192;j++){
    const t=j/192*Math.PI*2;
    if(glass){route.push(new T.Vector3((id===7?-3.5:id===8?3.6:-4+id*1.2)+Math.sin(t)*.5,(id===7?2:id===8?3.4:1.6+id*.15)+Math.cos(t)*.55,2.321));normals.push(new T.Vector3(0,0,-1));}
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
   this.animals.push({cooldown:0,motion:createShrimpMotion(id),trail,direction:1,blocked:id*.027,tripIn:18+id*9,id,kind,position:new T.Vector3(),normal:new T.Vector3(),heading:0,distance:(trail?.length??length)*(id*.173%1),speed:0,remaining:2+id*.73,grazing:id%2===0,phase:id*2.7,seed:237+id*3571,route:points,normals:ns,length:trail?.length??length,matrix:new T.Matrix4()});
  }
  this.update(0);
 }
 private part(a:Animal,pool:number,x:number,y:number,z:number,sx:number,sy:number,sz:number,rz=0,ry=0,rx=0){
  this.dummy.position.set(x,y,z);this.dummy.rotation.set(rx,ry,rz);this.dummy.scale.set(sx,sy,sz);this.dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.bodyFrame?this.posed.multiplyMatrices(this.bodyFrame,this.dummy.matrix):this.dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;
 }
 private rod(a:Animal,pool:number,x:number,y:number,z:number,ex:number,ey:number,ez:number,r:number){
  this.link.set(ex-x,ey-y,ez-z);this.dummy.position.set((x+ex)/2,(y+ey)/2,(z+ez)/2);this.dummy.quaternion.setFromUnitVectors(UP,this.end.copy(this.link).normalize());this.dummy.scale.set(r,this.link.length(),r);this.dummy.updateMatrix();this.local.multiplyMatrices(a.matrix,this.bodyFrame?this.posed.multiplyMatrices(this.bodyFrame,this.dummy.matrix):this.dummy.matrix);const n=this.counts[pool]++;this.pools[pool].setMatrixAt(n,this.local);this.owners[pool][n]=a.id;
 }
 private contact(a:Animal,distance:number,time:number,p:T.Vector3,n:T.Vector3,tangent:T.Vector3){
  if(a.trail){const tr=a.trail,u=distance/a.length*tr.points.length,i=Math.floor(u)%tr.points.length,f=u-i,uv=tr.points[i].clone().lerp(tr.points[(i+1)%tr.points.length],f),next=tr.points[(i+1)%tr.points.length];
   leafContact(tr.leaf,uv.x,uv.y,time,p,n);const q=new T.Vector3();leafContact(tr.leaf,next.x,next.y,time,q,tangent);tangent.copy(q).sub(p).normalize();p.addScaledVector(n,.004);
  }else{const u=distance/a.length*a.route.length,i=Math.floor(u)%a.route.length,j=(i+1)%a.route.length;p.copy(a.route[i]).lerp(a.route[j],u-i);n.copy(a.normals[i]).lerp(a.normals[j],u-i).normalize();tangent.copy(a.route[j]).sub(a.route[i]).normalize();}
  tangent.multiplyScalar(a.direction);
 }
 private solidClear(p:T.Vector3,n:T.Vector3,f:T.Vector3,snail:boolean){
  for(const s of grazerBody(p,n,f,snail,snail?.84:.88)){
   const c=s.center,r=s.radius;
   if(Math.abs(c.x)+r>4.985||Math.abs(c.z)+r>2.335||c.y+r>5.34||c.y-r<this.floorHeight(c.x,c.z)-.002)return false;
   if(this.obstacles.some(o=>c.distanceToSquared(o.center)<(r+o.radius+.008)**2))return false;
  }return true;
 }
 private clear(a:Animal,p:T.Vector3,n:T.Vector3,f:T.Vector3,own=a.trail?.leaf){
  if(this.externalBodies.some(b=>bodiesOverlap(grazerBody(p,n,f,a.kind==='snail',a.kind==='snail'?.84:.88),b)))return false;
  if(!this.plants.clear(p,n,f,a.kind==='snail',this.waterTime,own))return false;
  const body=grazerBody(p,n,f,a.kind==='snail',a.kind==='shrimp'?.80+a.id%3*.04:.84);
  return !this.animals.some(other=>other!==a&&other.heading&&p.distanceToSquared(other.position)<.8**2&&bodiesOverlap(body,grazerBody(other.position,other.normal,new T.Vector3().setFromMatrixColumn(other.matrix,0).normalize(),other.kind==='snail',other.kind==='shrimp'?.80+other.id%3*.04:.84)));
 }
 private flee(a:Animal,fish:FishContactBody){
  if(a.cooldown>0||a.escape)return;const forward=new T.Vector3().setFromMatrixColumn(a.matrix,0).normalize(),away=a.position.clone().sub(fish.position).normalize();
  // Backward escape candidates fan away from the contacting fish. Reserve the
  // entire outbound path before releasing the leaf; shorten it in tight cover.
  for(const distance of [.55,.35,.20])for(const side of [0,.7,-.7,1.4,-1.4]){
   const offset=forward.clone().negate().applyAxisAngle(a.normal,side).addScaledVector(away,.4).addScaledVector(a.normal,.9).normalize().multiplyScalar(distance);
   let clear=true;for(let j=1;j<=24;j++){const p=a.position.clone().addScaledVector(offset,j/24);if(!this.clear(a,p,a.normal,forward)){clear=false;break;}}
   if(clear){const resume=a.flight;a.flight=undefined;a.escape={anchored:!resume,resume,age:0,offset,originDistance:a.distance,from:a.position.clone(),heading:forward};a.cooldown=4;a.grazing=false;return;}
  }
  // No clear exit: fold defensively and avoid repeatedly retriggering in cover.
  a.cooldown=1;a.motion.adjustAge=0;
 }
 private startTrip(a:Animal){
  const target=this.plants.trail(a.position.clone().add(new T.Vector3(Math.sin(a.phase)*.8,.5,Math.cos(a.phase)*.5)),false,this.usedLeaves);if(!target)return;
  const to=new T.Vector3(),normal=new T.Vector3();leafContact(target.leaf,target.points[0].x,target.points[0].y,this.waterTime,to,normal);to.addScaledVector(normal,.004);
  const delta=to.clone().sub(a.position),direction=delta.clone().normalize(),up=new T.Vector3(0,1,0);
  // Sweep the full body through the water before accepting a departure.
  for(let j=1;j<20;j++){const f=j/20,p=a.position.clone().lerp(to,f).addScaledVector(up,Math.sin(f*Math.PI)*.20);if(!this.clear(a,p,up,direction,f<.15?a.trail?.leaf:f>.85?target.leaf:undefined)){this.usedLeaves.delete(target.leaf);return;}}
  a.flight={from:a.position.clone(),to,target,progress:0,duration:Math.max(2.5,delta.length()/.22),retreat:false,originDistance:a.distance};a.grazing=false;
 }
 update(dt:number,currentTime?:number,fish:FishContactBody[]=[]){
  if(!this.root.visible||(this.initialized&&dt<=0))return;
  dt=Math.min(.1,Math.max(0,dt));this.waterTime=currentTime??this.waterTime+dt;
  this.counts=this.pools.map(()=>0);this.fishCorrections.clear();
  for(const a of this.animals){
   const old=a.distance,oldPosition=a.position.clone(),oldNormal=a.normal.clone(),oldForward=new T.Vector3().setFromMatrixColumn(a.matrix,0).normalize(),oldProgress=a.flight?.progress,oldTrail=a.trail,oldLength=a.length,oldFlight=a.flight;
   a.cooldown=Math.max(0,a.cooldown-dt);
   if(a.kind==='shrimp'&&a.heading)for(const visitor of fish){const corrected=fishTouch(visitor,grazerBody(a.position,a.normal,oldForward));if(corrected){this.fishCorrections.set(visitor.id,corrected);this.flee(a,visitor);}}
   advanceGrazer(a,dt);a.distance=(old+(a.distance-old+a.length)%a.length*a.direction+a.length)%a.length;
   if(a.kind==='shrimp'&&this.plants.leaves.length&&!a.flight&&!a.escape&&dt){a.tripIn-=dt;if(a.tripIn<=0){this.startTrip(a);a.tripIn=20+rand(a)*30;}}
   if(a.escape){
    const escape=a.escape;escape.age+=dt;if(escape.anchored)this.contact(a,escape.originDistance,this.waterTime,escape.from,a.normal,this.tangent);this.tangent.copy(escape.heading);
    const out=1-Math.exp(-Math.min(escape.age,.32)*12),home=escape.age<.8?1:Math.max(0,1-(escape.age-.8)/1.8);a.position.copy(escape.from).addScaledVector(escape.offset,out*home);a.speed=escape.age<.32?1:.08;
    if(home===0){if(escape.resume){a.flight=escape.resume;a.flight.freeFrom=a.position.clone();a.flight.progress=0;a.flight.retreat=false;}a.distance=escape.originDistance;a.escape=undefined;a.grazing=true;a.remaining=3;}
   }else if(a.flight){
    const flight=a.flight,previous=flight.progress;flight.progress=T.MathUtils.clamp(flight.progress+dt/flight.duration*(flight.retreat?-1:1),0,1);let f=flight.progress,s=f*f*(3-2*f);const uv=flight.target.points[0];
    const sourceNormal=new T.Vector3(),sourceTangent=new T.Vector3();if(flight.freeFrom){flight.from.copy(flight.freeFrom);sourceNormal.copy(a.normal);}else this.contact(a,flight.originDistance,this.waterTime,flight.from,sourceNormal,sourceTangent);leafContact(flight.target.leaf,uv.x,uv.y,this.waterTime,flight.to,a.normal);flight.to.addScaledVector(a.normal,.004);
    a.position.copy(flight.from).lerp(flight.to,s);a.position.y+=Math.sin(s*Math.PI)*.20;this.tangent.copy(flight.to).sub(flight.from).normalize().multiplyScalar(flight.retreat?-1:1);a.normal.lerp(sourceNormal,1-s).lerp(new T.Vector3(0,1,0),Math.sin(f*Math.PI)).normalize();a.speed=.15;
    if(dt&&!flight.retreat&&!this.clear(a,a.position,a.normal,this.tangent,f<.15?a.trail?.leaf:f>.85?flight.target.leaf:undefined)){
     flight.progress=previous;flight.retreat=true;f=previous;s=f*f*(3-2*f);a.position.copy(flight.from).lerp(flight.to,s);a.position.y+=Math.sin(s*Math.PI)*.20;
    }
    // A moving destination may shift while a swimmer yields. Catch up at a
    // bounded speed instead of snapping to the new point when the route clears.
    const travel=a.position.distanceTo(oldPosition),limit=.45*dt+.001;if(travel>limit){a.position.lerpVectors(oldPosition,a.position,limit/travel);flight.progress=previous;f=previous;}
    if(flight.retreat&&f===0){this.usedLeaves.delete(flight.target.leaf);a.distance=flight.originDistance;a.flight=undefined;a.grazing=true;a.remaining=3;a.speed=0;this.contact(a,a.distance,this.waterTime,a.position,a.normal,this.tangent);}
    if(f===1){if(a.trail)this.usedLeaves.delete(a.trail.leaf);a.trail=flight.target;a.length=a.trail.length;a.distance=0;a.direction=1;a.flight=undefined;a.grazing=true;a.remaining=5+rand(a)*8;a.speed=0;}
   }else{
    this.contact(a,a.distance,this.waterTime,a.position,a.normal,this.tangent);

   }
   let turnDemand=0;
   // Turn along the contact plane instead of flipping the body at a reversal.
   if(dt&&a.heading){const forward=new T.Vector3().setFromMatrixColumn(a.matrix,0).projectOnPlane(a.normal).normalize(),desired=this.tangent.clone().projectOnPlane(a.normal).normalize();const angle=Math.atan2(a.normal.dot(new T.Vector3().crossVectors(forward,desired)),forward.dot(desired));turnDemand=angle;this.tangent.copy(forward).applyAxisAngle(a.normal,T.MathUtils.clamp(angle,-dt*2.8,dt*2.8));}a.heading=1;
   this.binormal.crossVectors(this.tangent,a.normal).normalize();this.tangent.crossVectors(a.normal,this.binormal).normalize();this.rotation.makeBasis(this.tangent,a.normal,this.binormal);if(this.initialized&&!sweptPose(oldPosition,a.position,oldNormal,a.normal,oldForward,this.tangent,(p,n,f)=>this.clear(a,p,n,f,a.flight&&a.flight.progress>.85?a.flight.target.leaf:a.trail?.leaf))){
    if(a.trail!==oldTrail){this.usedLeaves.delete(a.trail!.leaf);if(oldTrail)this.usedLeaves.add(oldTrail.leaf);a.trail=oldTrail;a.length=oldLength;a.flight=oldFlight;}
    a.position.copy(oldPosition);a.normal.copy(oldNormal);this.tangent.copy(oldForward);this.binormal.crossVectors(this.tangent,a.normal).normalize();this.rotation.makeBasis(this.tangent,a.normal,this.binormal);a.distance=old;a.speed=0;
    if(a.escape)a.escape.age=Math.max(0,a.escape.age-dt);else if(a.flight){a.flight.progress=oldProgress??0;a.flight.retreat=true;}else{a.direction*=-1;a.grazing=true;a.remaining=1.2;
     // Stay on the live supporting leaf while yielding. Try nearby supported
     // footholds if its motion brings a neighboring blade into the old patch.
     if(a.trail)for(const offset of [0,.005,-.005,.012,-.012,.025,-.025]){const d=(old+offset+a.length)%a.length;this.contact(a,d,this.waterTime,a.position,a.normal,this.tangent);a.distance=d;this.tangent.copy(oldForward).projectOnPlane(a.normal).normalize();if(this.clear(a,a.position,a.normal,this.tangent)){a.distance=d;break;}}
     this.binormal.crossVectors(this.tangent,a.normal).normalize();this.rotation.makeBasis(this.tangent,a.normal,this.binormal);
    }
   }
   a.matrix.copy(this.rotation).setPosition(a.position);a.matrix.scale(this.size.setScalar(a.kind==='shrimp'?.80+a.id%3*.04:.84));
   if(a.kind==='shrimp'){advanceShrimpMotion(a.motion,dt,(a.escape?Math.min(1,a.escape.age/2.6):a.flight?.progress)??null,a.speed,turnDemand,a.escape?.age);this.shrimp(a);}else this.snail(a);
  }
  this.pools.forEach((p,i)=>{p.count=this.counts[i];p.instanceMatrix.needsUpdate=true;});this.initialized=true;
 }
 private shrimp(a:Animal){
  const t=a.phase,walk=a.flight?.35:Math.min(1,a.speed/.06);
  this.part(a,7,0,0,0,1,1,1);this.part(a,11,0,0,0,1,1,1);
  shrimpAbdomen(a.motion,this.bodyFrames);
  for(let k=0;k<6;k++){
   this.bodyFrame=this.bodyFrames[k];const {x,y}=shrimpCenters[k];
   this.part(a,8,x,y,0,.04,[.046,.045,.042,.036,.028,.017][k],[.039,.038,.035,.030,.024,.015][k]);
   if(k<5)for(const side of [-1,1]){
    const stroke=swimmeretStroke(a.motion,k),args=[x,y-.03,side*.022,.30,.6,.48*stroke.spread,stroke.angle,side*(.3+stroke.fold)] as const;
    this.part(a,9,...args);this.part(a,10,...args);
   }
  }
  // Telson and uropods inherit the final segment's flex instead of floating behind it.
  for(let k=-2;k<=2;k++){const spread=.27+.11*a.motion.swimming+.10*a.motion.adjustment,ry=k*spread,scale=k===0?.72:Math.abs(k)===2?1:.88,pitch=.045*Math.sin(a.motion.time*1.1)+a.motion.curl*.20;this.part(a,9,-.309,.100,k*.006,scale,1,k===0?.50:1,pitch,ry);this.part(a,10,-.309,.100,k*.006,scale,1,k===0?.50:1,pitch,ry);}
  this.bodyFrame=null;
  for(const side of [-1,1]){
   this.rod(a,6,.123,.139,side*.022,.141,.148,side*.030,.0038);this.part(a,0,.141,.148,side*.030,.008,.008,.007);
   this.part(a,2,.142,.149,side*.035,.0065,.0065,.0052);
   for(let k=0;k<5;k++){
    const x=.105-k*.034,phase=t*(a.grazing?4.1:8)+k*1.65+side*1.5,pick=k<2&&a.grazing,swing=Math.sin(phase)*.025*walk,lift=Math.max(0,Math.cos(phase))*.020*walk;
    const transfer=pick?Math.max(0,Math.sin(phase)):0,kneeX=x-.016,kneeY=.044+transfer*.018,kneeZ=side*.060,
     toeX=pick?.16-transfer*.023:x-.040+swing,toeY=(pick?.006+transfer*.080:.003+lift)+a.motion.swimming*.048,toeZ=side*(pick?.037-transfer*.020:.10-a.motion.swimming*.045);
    const hip=shrimpHip(k,side);this.part(a,0,hip.x,hip.y,hip.z,.006,.007,.006);
    this.rod(a,6,hip.x,hip.y,hip.z,x,.080,side*.040,.0037);this.part(a,0,x,.080,side*.040,.0042,.0042,.0042);
    this.rod(a,6,x,.080,side*.040,kneeX,kneeY,kneeZ,.0032);
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
 info(id:number):Identification|null{const a=this.animals[id];if(!a)return null;return {kind:'invertebrate',animalId:id,name:a.kind==='shrimp'?`Cherry shrimp ${id+1}`:`Ramshorn snail ${id-5}`,subtitle:a.kind==='shrimp'?'Neocaridina davidi · cherry shrimp model':'Planorbid ramshorn · representative model',needs:'Stable clean water, suitable mineral availability, food and safe grazing surfaces.',role:a.kind==='shrimp'?'Picks biofilm and small food particles with its front appendages. Its legs walk while its antennae explore.':'Grazes surface films using a radula. A muscular foot maintains contact with the glass or substrate.',behavior:a.kind==='shrimp'?(a.escape?'Darting away from fish contact.':a.flight?'Swimming to another leaf using the swimmerets.':a.trail?(a.grazing?'Attached to a leaf, picking at biofilm.':'Climbing around a living leaf.'):a.grazing?'Picking at a feeding patch.':'Walking to another feeding patch.'):'Slow surface crawling and grazing. These animals recycle material; they also produce waste.',point:a.position.clone()};}
 pick(ray:T.Raycaster){const hit=ray.intersectObjects(this.pools,false)[0];if(!hit||hit.instanceId===undefined)return null;const pool=this.pools.indexOf(hit.object as T.InstancedMesh);return {distance:hit.distance,info:this.info(this.owners[pool][hit.instanceId])!};}
 dispose(){const geometries=new Set(this.pools.map(p=>p.geometry)),materials=new Set(this.pools.map(p=>p.material as T.Material));geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose());this.root.removeFromParent();}
}
