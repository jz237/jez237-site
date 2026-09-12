import {CoryFloorRoutes,type FloorRouteMap} from './CoryFloorRoutes.ts';
import * as T from 'three';
import {CoryModels} from './CoryModels.ts';
import {bodiesOverlap,grazerBody,fishBody,fishTouch,sweptPose,type BodySphere,type FishContactBody} from './GrazerCollision.ts';
import type {GrazerPlants} from './GrazerPlants.ts';
import type {Obstacle} from './TankSpace.ts';
import type {Identification} from './Exploration.ts';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),UP=V(0,1,0),clamp=T.MathUtils.clamp;
export type Cory={id:number;position:T.Vector3;previous:T.Vector3;target:T.Vector3;yaw:number;pitch:number;size:number;speed:number;phase:number;effort:number;remaining:number;seed:number;mode:'foraging'|'browsing'|'feeding'|'exploring';blocked:number;time:number;lift:number;visits:Map<string,number>;route:T.Vector3[];restIn:number;replanIn:number;trail:{point:T.Vector3;yaw:number}[];retreat:number;yieldLeft:number;stalled:number;anchor:T.Vector3};
export function coryForward(a:Cory){return V(Math.cos(a.yaw),0,-Math.sin(a.yaw));}
/** Includes the swept width of the tail, barbels and paired fins. */
export function coryBody(p:T.Vector3,f:T.Vector3,size=.7,pitch=0):BodySphere[]{return [[-.46,.085,.175],[-.045,.265,.09],[-.28,.085,.095],[-.13,.095,.12],[.045,.115,.125],[.17,.085,.15],[.30,.06,.065]].map(([x,y,r])=>({center:p.clone().addScaledVector(f,(x*Math.cos(pitch)-y*Math.sin(pitch))*size).addScaledVector(UP,(x*Math.sin(pitch)+y*Math.cos(pitch))*size),radius:r*size}));}
export function coryMouth(p:T.Vector3,f:T.Vector3,size:number,pitch:number){return p.clone().addScaledVector(f,(.26*Math.cos(pitch)-.038*Math.sin(pitch))*size).addScaledVector(UP,(.26*Math.sin(pitch)+.038*Math.cos(pitch))*size);}
export function nibblePitch(time:number,id:number){return -.26-.065*(.5+.5*Math.sin(time*4.1+id*2.3));}

const random=(a:Cory)=>{a.seed=(Math.imul(a.seed,1664525)+1013904223)>>>0;return a.seed/4294967296;};
export class Corydoras{
 readonly models:CoryModels;readonly animals:Cory[]=[];readonly fishCorrections=new Map<number,T.Vector3>();readonly pellets:{position:T.Vector3;age:number;mesh:T.Mesh}[]=[];
 readonly routes:CoryFloorRoutes;
 private scene:T.Scene;private height:(x:number,z:number)=>number;private obstacles:Obstacle[];private plants?:GrazerPlants;private pelletGeometry=new T.IcosahedronGeometry(.022,1);private pelletMaterial=new T.MeshStandardMaterial({color:0xa78b58,roughness:1});private time=0;
 constructor(scene:T.Scene,height:(x:number,z:number)=>number,obstacles:Obstacle[]=[],plants?:GrazerPlants,count=6){this.scene=scene;this.height=height;this.obstacles=obstacles;this.plants=plants;this.routes=new CoryFloorRoutes((x,z)=>this.floor(x,z),(p,f)=>this.solid(p,coryBody(p,f,.71)));this.models=new CoryModels(count);scene.add(this.models.root);
  for(let id=0;id<count;id++){const a:Cory={id,position:V(),previous:V(),target:V(),yaw:id*1.73,pitch:0,size:.66+id%3*.025,speed:0,phase:id*2.37,effort:0,remaining:1+id*.7,seed:237+id*7351,mode:id%2?'browsing':'foraging',blocked:0,time:0,lift:0,visits:new Map(),route:[],restIn:5+id*1.1,replanIn:6+id,trail:[],retreat:0,yieldLeft:0,stalled:0,anchor:V()};let found=false;
   for(let k=0;k<1600;k++){const x=k<150? .4+random(a)*3: -4.55+random(a)*9.1,z=k<150? .5+random(a)*1.6:-2+random(a)*4.1;a.position.set(x,this.floor(x,z),z);if(this.clear(a,a.position,coryForward(a),[])&&[-.18,.18].every(d=>{const q=a.position.clone().addScaledVector(coryForward(a),d);q.y=this.floor(q.x,q.z);return this.clear(a,q,coryForward(a),[]);})){found=true;break;}}
   if(!found)throw new Error('No unobstructed Corydoras starting position');a.previous.copy(a.position);a.target.copy(a.position);this.animals.push(a);this.choose(a);this.pose(a);
  }this.models.flush();
 }
 async prepareNavigation(cached?:FloorRouteMap){if(cached)this.routes.load(cached);else await this.routes.build();for(const a of this.animals){const origin=V(-4+a.id*1.55,this.floor(-4+a.id*1.55,1.6),1.6),candidates=this.routes.nodes.filter(n=>n.neighbors.length>2).sort((n,m)=>n.point.distanceToSquared(origin)-m.point.distanceToSquared(origin));for(const n of candidates){let found=false;for(const id of n.neighbors){const d=this.routes.nodes[id].point.clone().sub(n.point);if(d.x*d.x+d.z*d.z<.01)continue;const yaw=Math.atan2(-d.z,d.x),f=V(Math.cos(yaw),0,-Math.sin(yaw));if(!this.clear(a,n.point,f,[])||this.animals.some(b=>b.id<a.id&&b.position.distanceTo(n.point)<.85))continue;const route=this.routes.route(n.point,a.visits,0,a.seed,yaw);if(route.length<4)continue;a.position.copy(n.point);a.previous.copy(n.point);a.anchor.copy(n.point);a.trail=[];a.yaw=yaw;found=true;break;}if(found)break;}this.choose(a);this.pose(a);}this.models.flush();}
 private floor(x:number,z:number){let y=this.height(x,z);for(const [dx,dz] of [[.25,0],[-.3,0],[0,.13],[0,-.13]])y=Math.max(y,this.height(x+dx,z+dz));return y+.032;}
 private solid(p:T.Vector3,body:BodySphere[]){return p.y>=this.floor(p.x,p.z)-.006&&body.every(s=>Math.abs(s.center.x)+s.radius<4.98&&Math.abs(s.center.z)+s.radius<2.32&&s.center.y+s.radius<5.3&&this.obstacles.every(o=>o.center.distanceToSquared(s.center)>(o.radius+s.radius+.01)**2))&&(!this.plants||this.plants.clearBody(p,body,this.time,undefined,true));}
 private clear(a:Cory,p:T.Vector3,f:T.Vector3,visitors:BodySphere[][]){if(a.retreat<=0&&this.animals.some(b=>b!==a&&p.distanceToSquared(b.position)<.72**2&&p.distanceToSquared(b.position)<a.position.distanceToSquared(b.position)-1e-8))return false;const body=coryBody(p,f,a.size,a.pitch),mouth=coryMouth(p,f,a.size,a.pitch);return mouth.y>=this.height(mouth.x,mouth.z)+.006&&this.solid(p,body)&&!this.animals.some(b=>b!==a&&bodiesOverlap(body,coryBody(b.position,coryForward(b),b.size,b.pitch),.014))&&!visitors.some(b=>bodiesOverlap(body,b,.004));}
 private choose(a:Cory){
  // Remember recently visited floor patches so a browsing bout has somewhere new to go.
  const cell=(p:T.Vector3)=>`${Math.floor(p.x/.65)},${Math.floor(p.z/.65)}`;
  a.visits.set(cell(a.position),a.time);for(const [key,t] of a.visits)if(a.time-t>100)a.visits.delete(key);
  a.mode=random(a)<.20?'foraging':random(a)<.14?'exploring':'browsing';a.remaining=a.mode==='foraging'?.7+random(a)*1.7:10+random(a)*12;a.lift=a.mode==='exploring'?.08+random(a)*.2:0;
  if(this.routes.nodes.length){const previousRoute=a.route;a.route=this.routes.route(a.position,a.visits,a.time,a.seed,a.yaw,this.animals.filter(b=>b!==a).map(b=>b.position));if(a.route.length<=1&&previousRoute.length>1)a.route=previousRoute;if(a.route.length>1){a.target.copy(a.route[0]);a.mode='browsing';a.remaining=60;a.lift=0;}else{a.route=[];a.target.copy(a.position);a.mode='foraging';a.remaining=2;a.lift=0;}return;}
  let best=-Infinity,goal:T.Vector3|undefined;
  for(let k=0;k<40;k++){const angle=random(a)*Math.PI*2,d=.65+random(a)*2.8,p=a.position.clone().add(V(Math.cos(angle)*d,0,Math.sin(angle)*d));p.y=this.floor(p.x,p.z)+a.lift;
   const dir=p.clone().sub(a.position).setY(0).normalize();if(!this.solid(p,coryBody(p,dir,a.size)))continue;
   // Favor fresh territory and a reasonably straight first leg, with only a light social pull.
   const age=a.time-(a.visits.get(cell(p))??-100),turn=Math.abs(Math.atan2(Math.sin(Math.atan2(-dir.z,dir.x)-a.yaw),Math.cos(Math.atan2(-dir.z,dir.x)-a.yaw)));
   const near=this.animals.filter(b=>b!==a).reduce((n,b)=>Math.min(n,p.distanceTo(b.position)),5);
   let open=0;for(const f of [.15,.3,.5,.75,1]){const q=a.position.clone().lerp(p,f);q.y=this.floor(q.x,q.z)+a.lift;if(!this.solid(q,coryBody(q,dir,a.size)))break;open=f;}
   const score=Math.min(age,100)*.025+open*4+d*.4-turn*.3-Math.max(0,near-3.5)*.15+random(a)*.3;
   if(score>best){best=score;goal=p;}
  }
  a.target.copy(goal??a.position.clone().addScaledVector(coryForward(a),-.6));
 }

 feed(){if(this.pellets.length)return;for(let i=0;i<6;i++){const a=this.animals[i%this.animals.length],p=a.position.clone();p.y=5.1;const mesh=new T.Mesh(this.pelletGeometry,this.pelletMaterial);mesh.position.copy(p);this.models.root.add(mesh);this.pellets.push({position:mesh.position,age:0,mesh});}}
 update(dt:number,waterTime:number,fish:FishContactBody[]=[],grazers:{id?:number;position:T.Vector3;normal:T.Vector3;matrix:T.Matrix4;kind:string}[]=[]){if(dt<=0)return;this.time=waterTime;this.fishCorrections.clear();const others=grazers.map(a=>grazerBody(a.position,a.normal,V().setFromMatrixColumn(a.matrix,0).normalize(),a.kind==='snail',a.kind==='snail'?.84:.80+(a.id??0)%3*.04));const visitors=[...others,...fish.map(f=>fishBody(f))];
  for(const pellet of [...this.pellets]){pellet.age+=dt;pellet.position.y=Math.max(this.height(pellet.position.x,pellet.position.z)+.025,pellet.position.y-dt*.65);if(pellet.age>65)this.removePellet(pellet);}
  const steps=Math.max(1,Math.ceil(dt/.025)),h=dt/steps;
  for(let step=0;step<steps;step++)for(const a of this.animals){a.previous.copy(a.position);a.time+=h;a.remaining-=h;
   if(this.routes.nodes.length){a.stalled+=h;if(a.anchor.distanceTo(a.position)>.18){a.anchor.copy(a.position);a.stalled=0;}if(a.stalled>6&&a.trail.length>1&&a.retreat<=0){a.retreat=.65+random(a)*.45;a.stalled=0;a.route=[];const pitch=a.pitch;a.pitch=0;if(!this.clear(a,a.position,coryForward(a),visitors))a.pitch=pitch;}
    if(a.retreat>0&&a.trail.length){const back=a.yieldLeft>0?{point:a.position.clone().addScaledVector(coryForward(a),.03),yaw:a.yaw}:a.trail[a.trail.length-1],d=back.point.clone().sub(a.position),length=d.length(),delta=Math.atan2(Math.sin(back.yaw-a.yaw),Math.cos(back.yaw-a.yaw)),yaw=a.yaw+clamp(delta,-h*1.2,h*1.2),f=V(Math.cos(yaw),0,-Math.sin(yaw)),p=a.position.clone().addScaledVector(d,Math.min(length,h*.14)/Math.max(length,1e-8));if(sweptPose(a.position,p,UP,UP,coryForward(a),f,(q,n,dir)=>this.clear(a,q,dir,visitors))){const traveled=a.position.distanceTo(p);a.retreat-=traveled;a.yieldLeft=Math.max(0,a.yieldLeft-traveled);a.position.copy(p);a.yaw=yaw;if(a.position.distanceTo(back.point)<.000001&&Math.abs(Math.atan2(Math.sin(back.yaw-a.yaw),Math.cos(back.yaw-a.yaw)))<.000001)a.trail.pop();}else{a.yieldLeft=0;const forward=coryForward(a),q=a.position.clone().addScaledVector(forward,h*.14);if(sweptPose(a.position,q,UP,UP,forward,forward,(p,n,f)=>this.clear(a,p,f,visitors))){a.position.copy(q);a.yieldLeft=.24;a.retreat=.24;}}a.speed=.10;a.phase+=h*7;a.effort=.3;this.pose(a);if(a.retreat<=0||!a.trail.length){a.retreat=0;a.yieldLeft=0;a.stalled=0;a.anchor.copy(a.position);this.choose(a);}continue;}
    const last=a.trail[a.trail.length-1];if(!last||last.point.distanceTo(a.position)>.00001||Math.abs(Math.atan2(Math.sin(last.yaw-a.yaw),Math.cos(last.yaw-a.yaw)))>.00001){a.trail.push({point:a.position.clone(),yaw:a.yaw});if(a.trail.length>480)a.trail.shift();}}
a.replanIn-=h;if(this.routes.nodes.length&&a.replanIn<=0&&a.mode!=='feeding'&&(!a.route.length||a.position.distanceTo(a.route[0])<.01)){this.choose(a);a.replanIn=5+random(a)*4;}if(Math.floor(a.time*2)!==Math.floor((a.time-h)*2))a.visits.set(`${Math.floor(a.position.x/.65)},${Math.floor(a.position.z/.65)}`,a.time);if(a.route.length&&a.mode!=='feeding'){while(a.route.length&&a.position.distanceTo(a.route[0])<.002)a.route.shift();if(a.route.length)a.target.copy(a.route[0]);else this.choose(a);a.restIn-=h;if(a.mode==='foraging'){if(a.remaining<=0){a.mode='browsing';a.remaining=60;}}else if(a.restIn<=0&&a.position.y<this.floor(a.position.x,a.position.z)+.07){a.mode='foraging';a.remaining=.8+random(a)*1.6;a.restIn=7+random(a)*10;}}else if(a.remaining<=0||a.mode!=='foraging'&&a.position.distanceTo(a.target)<.13)this.choose(a);
   const food=this.pellets.filter(p=>p.position.y<this.floor(p.position.x,p.position.z)+.12).sort((p,q)=>p.position.distanceToSquared(a.position)-q.position.distanceToSquared(a.position))[0];
   if(food&&a.position.distanceTo(food.position)<2.4){a.mode='feeding';a.target.copy(food.position);a.target.y=this.floor(a.target.x,a.target.z);a.remaining=1;a.lift=0;if(a.position.clone().addScaledVector(coryForward(a),.18).distanceTo(food.position)<.20){this.removePellet(food);a.mode='foraging';a.remaining=2+random(a)*2;}}
   const steering=a.target.clone().sub(a.position).normalize();for(const b of this.animals){if(b===a||a.route.length)continue;const away=a.position.clone().sub(b.position);away.y=0;const d=away.length();if(d<.85&&d>.001)steering.addScaledVector(away,(.85-d)*3/d);}
   const verticalLeg=a.route.length>0&&Math.hypot(a.target.x-a.position.x,a.target.z-a.position.z)<.055&&Math.abs(a.target.y-a.position.y)>.000001;
   const desired=verticalLeg||steering.lengthSq()<.000001?a.yaw:Math.atan2(-steering.z,steering.x),delta=Math.atan2(Math.sin(desired-a.yaw),Math.cos(desired-a.yaw)),oldYaw=a.yaw,oldForward=coryForward(a);a.yaw+=clamp(delta,-h*1.35,h*1.35);const f=coryForward(a);
   const targetSpeed=this.routes.nodes.length&&!a.route.length&&a.mode!=='feeding'||verticalLeg||a.route.length&&Math.abs(delta)>.002?0:a.mode==='foraging'?.006:a.mode==='feeding'?.34:.16+.16*(.5+.5*Math.sin(a.time*.87+a.id*2.9))**3;
   a.speed+=(targetSpeed*(a.pitch<-.16?.15:1)*(Math.abs(delta)>1?.18:1)-a.speed)*(1-Math.exp(-h*4));const p=a.position.clone();if(a.route.length&&a.mode!=='feeding'){const direction=a.target.clone().sub(a.position),distance=direction.length();if(distance>1e-8&&(verticalLeg||Math.abs(delta)<.002))p.addScaledVector(direction,Math.min(distance,(verticalLeg?.14:a.speed)*h)/distance);}else if(!this.routes.nodes.length||a.mode==='feeding'){p.addScaledVector(f,a.speed*h);const targetY=this.floor(p.x,p.z)+a.lift;p.y=Math.max(this.floor(p.x,p.z),p.y+clamp(targetY-p.y,-h*.20,h*.20));}const floor=this.floor(p.x,p.z);
   const traffic=this.animals.some(b=>b!==a&&a.position.distanceTo(b.position)<.78);if(traffic&&a.blocked>.4)a.replanIn=Math.min(a.replanIn,.2);if(sweptPose(a.position,p,UP,UP,oldForward,f,(q,n,dir)=>this.clear(a,q,dir,visitors))){a.position.copy(p);a.blocked=0;}else{a.yaw=oldYaw;a.speed*=Math.exp(-h*8);a.blocked+=h;
    // Yield room to turn: test the opposite arc, then a short backward scoot.
    let recovered=false;for(const turn of (this.routes.nodes.length?[]:[-Math.sign(delta||1)*h*1.35,0])){const yaw=oldYaw+turn,dir=V(Math.cos(yaw),0,-Math.sin(yaw)),q=a.position.clone().addScaledVector(dir,turn===0?-.085*h:a.speed*h);q.y=Math.max(q.y,this.floor(q.x,q.z));if(sweptPose(a.position,q,UP,UP,oldForward,dir,(point,n,f)=>this.clear(a,point,f,visitors))){a.position.copy(q);a.yaw=yaw;recovered=true;break;}}
    if(a.blocked>1.5){this.choose(a);a.mode='browsing';a.remaining=8+random(a)*6;a.blocked=recovered?0:.3;}
   }
   const oldPitch=a.pitch,nibbling=a.mode==='foraging'&&a.speed<.025&&a.position.y<this.floor(a.position.x,a.position.z)+.08;
   const pitchTarget=nibbling?nibblePitch(a.time,a.id):(a.route.length?0:clamp((a.position.y-a.previous.y)/Math.max(.001,a.speed*h),-.12,.12));a.pitch+=(pitchTarget-a.pitch)*(1-Math.exp(-h*3));
   const mouth=coryMouth(a.position,coryForward(a),a.size,a.pitch);if(mouth.y<this.height(mouth.x,mouth.z)+.006||!this.clear(a,a.position,coryForward(a),visitors))a.pitch=oldPitch;
   a.effort+=(clamp(a.speed/.25,0,1)-a.effort)*(1-Math.exp(-h*5));a.phase+=h*(2.5+a.effort*17)*(1+.10*Math.sin(a.time*.9+a.id));this.pose(a);
  }
  // Existing fish yield at the first contact along their segment, including fast darts.
  for(const f of fish)for(const a of this.animals){const corrected=fishTouch({...f,position:this.fishCorrections.get(f.id)??f.position},coryBody(a.position,coryForward(a),a.size,a.pitch));if(corrected)this.fishCorrections.set(f.id,corrected);}
  this.models.flush();
 }
 private removePellet(p:typeof this.pellets[number]){p.mesh.removeFromParent();this.pellets.splice(this.pellets.indexOf(p),1);}
 private pose(a:Cory){this.models.pose(a.id,a.position,a.yaw,a.pitch,a.size,a.phase,a.effort,a.time);}
 info(id:number):Identification|undefined{const a=this.animals[id];if(!a)return;return {kind:'fish',coryId:id,name:`Dwarf Corydoras ${id+1}`,subtitle:'Salt-and-pepper cory · Corydoras habrosus',role:'A small bottom-foraging catfish. Barbels help it locate edible morsels in sand; it does not eat fish waste.',needs:'Fine, smooth substrate, companions, clean oxygenated water and food that reaches the bottom.',behavior:a.mode==='feeding'?'Following sinking food and searching for morsels.':a.mode==='foraging'?'Inspecting the substrate with its mouth and barbels.':a.mode==='exploring'?'Making a short excursion above the bottom.':'Exploring fresh floor patches, with brief stops to search the substrate.',point:a.position.clone()};}
 pick(ray:T.Raycaster){if(!this.models.root.visible)return;const h=ray.intersectObject(this.models.meshes[0])[0];if(h&&h.instanceId!==undefined)return {distance:h.distance,info:this.info(h.instanceId)!};}
}
