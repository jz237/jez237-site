import * as T from 'three';
import {CoryModels} from './CoryModels.ts';
import {bodiesOverlap,grazerBody,fishBody,fishTouch,sweptPose,type BodySphere,type FishContactBody} from './GrazerCollision.ts';
import type {GrazerPlants} from './GrazerPlants.ts';
import type {Obstacle} from './TankSpace.ts';
import type {Identification} from './Exploration.ts';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),UP=V(0,1,0),clamp=T.MathUtils.clamp;
export type Cory={id:number;position:T.Vector3;previous:T.Vector3;target:T.Vector3;yaw:number;pitch:number;size:number;speed:number;phase:number;effort:number;remaining:number;seed:number;mode:'foraging'|'browsing'|'feeding'|'exploring';blocked:number;time:number;lift:number;visits:Map<string,number>};
export function coryForward(a:Cory){return V(Math.cos(a.yaw),0,-Math.sin(a.yaw));}
/** Includes the swept width of the tail, barbels and paired fins. */
export function coryBody(p:T.Vector3,f:T.Vector3,size=.7):BodySphere[]{return [[-.46,.085,.175],[-.045,.265,.09],[-.28,.085,.095],[-.13,.095,.12],[.045,.115,.125],[.17,.085,.15],[.30,.06,.065]].map(([x,y,r])=>({center:p.clone().addScaledVector(f,x*size).addScaledVector(UP,y*size),radius:r*size}));}
const random=(a:Cory)=>{a.seed=(Math.imul(a.seed,1664525)+1013904223)>>>0;return a.seed/4294967296;};
export class Corydoras{
 readonly models:CoryModels;readonly animals:Cory[]=[];readonly fishCorrections=new Map<number,T.Vector3>();readonly pellets:{position:T.Vector3;age:number;mesh:T.Mesh}[]=[];
 private scene:T.Scene;private height:(x:number,z:number)=>number;private obstacles:Obstacle[];private plants?:GrazerPlants;private pelletGeometry=new T.IcosahedronGeometry(.022,1);private pelletMaterial=new T.MeshStandardMaterial({color:0xa78b58,roughness:1});private time=0;
 constructor(scene:T.Scene,height:(x:number,z:number)=>number,obstacles:Obstacle[]=[],plants?:GrazerPlants,count=6){this.scene=scene;this.height=height;this.obstacles=obstacles;this.plants=plants;this.models=new CoryModels(count);scene.add(this.models.root);
  for(let id=0;id<count;id++){const a:Cory={id,position:V(),previous:V(),target:V(),yaw:id*1.73,pitch:0,size:.66+id%3*.025,speed:0,phase:id*2.37,effort:0,remaining:1+id*.7,seed:237+id*7351,mode:id%2?'browsing':'foraging',blocked:0,time:0,lift:0,visits:new Map()};let found=false;
   for(let k=0;k<1600;k++){const x=k<150? .4+random(a)*3: -4.55+random(a)*9.1,z=k<150? .5+random(a)*1.6:-2+random(a)*4.1;a.position.set(x,this.floor(x,z),z);if(this.clear(a,a.position,coryForward(a),[])&&[-.18,.18].every(d=>{const q=a.position.clone().addScaledVector(coryForward(a),d);q.y=this.floor(q.x,q.z);return this.clear(a,q,coryForward(a),[]);})){found=true;break;}}
   if(!found)throw new Error('No unobstructed Corydoras starting position');a.previous.copy(a.position);a.target.copy(a.position);this.animals.push(a);this.choose(a);this.pose(a);
  }this.models.flush();
 }
 private floor(x:number,z:number){let y=this.height(x,z);for(const [dx,dz] of [[.25,0],[-.3,0],[0,.13],[0,-.13]])y=Math.max(y,this.height(x+dx,z+dz));return y+.032;}
 private solid(p:T.Vector3,body:BodySphere[]){return p.y>=this.floor(p.x,p.z)-.006&&body.every(s=>Math.abs(s.center.x)+s.radius<4.98&&Math.abs(s.center.z)+s.radius<2.32&&s.center.y+s.radius<5.3&&this.obstacles.every(o=>o.center.distanceToSquared(s.center)>(o.radius+s.radius+.01)**2))&&(!this.plants||this.plants.clearBody(p,body,this.time,undefined,true));}
 private clear(a:Cory,p:T.Vector3,f:T.Vector3,visitors:BodySphere[][]){const body=coryBody(p,f,a.size);return this.solid(p,body)&&!this.animals.some(b=>b!==a&&bodiesOverlap(body,coryBody(b.position,coryForward(b),b.size),.014))&&!visitors.some(b=>bodiesOverlap(body,b,.01));}
 private choose(a:Cory){
  // Remember recently visited floor patches so a browsing bout has somewhere new to go.
  const cell=(p:T.Vector3)=>`${Math.floor(p.x/.65)},${Math.floor(p.z/.65)}`;
  a.visits.set(cell(a.position),a.time);for(const [key,t] of a.visits)if(a.time-t>100)a.visits.delete(key);
  a.mode=random(a)<.20?'foraging':random(a)<.14?'exploring':'browsing';a.remaining=a.mode==='foraging'?.7+random(a)*1.7:10+random(a)*12;a.lift=a.mode==='exploring'?.08+random(a)*.2:0;
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
 update(dt:number,waterTime:number,fish:FishContactBody[]=[],grazers:{position:T.Vector3;normal:T.Vector3;matrix:T.Matrix4;kind:string}[]=[]){if(dt<=0)return;this.time=waterTime;this.fishCorrections.clear();const others=grazers.map(a=>grazerBody(a.position,a.normal,V().setFromMatrixColumn(a.matrix,0).normalize(),a.kind==='snail',a.kind==='snail'?.84:.88));const visitors=[...others,...fish.map(f=>fishBody(f))];
  for(const pellet of [...this.pellets]){pellet.age+=dt;pellet.position.y=Math.max(this.height(pellet.position.x,pellet.position.z)+.025,pellet.position.y-dt*.65);if(pellet.age>65)this.removePellet(pellet);}
  const steps=Math.max(1,Math.ceil(dt/.025)),h=dt/steps;
  for(let step=0;step<steps;step++)for(const a of this.animals){a.previous.copy(a.position);a.time+=h;a.remaining-=h;if(Math.floor(a.time*2)!==Math.floor((a.time-h)*2))a.visits.set(`${Math.floor(a.position.x/.65)},${Math.floor(a.position.z/.65)}`,a.time);if(a.remaining<=0||a.mode!=='foraging'&&a.position.distanceTo(a.target)<.13)this.choose(a);
   const food=this.pellets.filter(p=>p.position.y<this.floor(p.position.x,p.position.z)+.12).sort((p,q)=>p.position.distanceToSquared(a.position)-q.position.distanceToSquared(a.position))[0];
   if(food&&a.position.distanceTo(food.position)<2.4){a.mode='feeding';a.target.copy(food.position);a.target.y=this.floor(a.target.x,a.target.z);a.remaining=1;a.lift=0;if(a.position.clone().addScaledVector(coryForward(a),.18).distanceTo(food.position)<.20){this.removePellet(food);a.mode='foraging';a.remaining=2+random(a)*2;}}
   const steering=a.target.clone().sub(a.position).normalize();for(const b of this.animals){if(b===a)continue;const away=a.position.clone().sub(b.position);away.y=0;const d=away.length();if(d<.85&&d>.001)steering.addScaledVector(away,(.85-d)*3/d);}
   const desired=Math.atan2(-steering.z,steering.x),delta=Math.atan2(Math.sin(desired-a.yaw),Math.cos(desired-a.yaw)),oldYaw=a.yaw,oldForward=coryForward(a);a.yaw+=clamp(delta,-h*1.35,h*1.35);const f=coryForward(a);
   const targetSpeed=a.mode==='foraging'?.006:a.mode==='feeding'?.34:.16+.16*(.5+.5*Math.sin(a.time*.87+a.id*2.9))**3;
   a.speed+=(targetSpeed*(Math.abs(delta)>1?.18:1)-a.speed)*(1-Math.exp(-h*4));const p=a.position.clone().addScaledVector(f,a.speed*h);const floor=this.floor(p.x,p.z);p.y=Math.max(floor,p.y+clamp(floor+a.lift-p.y,-h*.12,h*.12));
   if(sweptPose(a.position,p,UP,UP,oldForward,f,(q,n,dir)=>this.clear(a,q,dir,visitors))){a.position.copy(p);a.blocked=0;}else{a.yaw=oldYaw;a.speed*=Math.exp(-h*8);a.blocked+=h;
    // Yield room to turn: test the opposite arc, then a short backward scoot.
    let recovered=false;for(const turn of [-Math.sign(delta||1)*h*1.35,0]){const yaw=oldYaw+turn,dir=V(Math.cos(yaw),0,-Math.sin(yaw)),q=a.position.clone().addScaledVector(dir,turn===0?-.085*h:a.speed*h);q.y=Math.max(q.y,this.floor(q.x,q.z));if(sweptPose(a.position,q,UP,UP,oldForward,dir,(point,n,f)=>this.clear(a,point,f,visitors))){a.position.copy(q);a.yaw=yaw;recovered=true;break;}}
    if(a.blocked>.5){this.choose(a);a.mode='browsing';a.remaining=8+random(a)*6;a.blocked=recovered?0:.3;}
   }
   a.pitch+=(clamp((a.position.y-a.previous.y)/Math.max(.001,a.speed*h),-.12,.12)-a.pitch)*(1-Math.exp(-h*3));a.effort+=(clamp(a.speed/.25,0,1)-a.effort)*(1-Math.exp(-h*5));a.phase+=h*(2.5+a.effort*17)*(1+.10*Math.sin(a.time*.9+a.id));this.pose(a);
  }
  // Existing fish yield at the first contact along their segment, including fast darts.
  for(const f of fish)for(const a of this.animals){const corrected=fishTouch({...f,position:this.fishCorrections.get(f.id)??f.position},coryBody(a.position,coryForward(a),a.size));if(corrected)this.fishCorrections.set(f.id,corrected);}
  this.models.flush();
 }
 private removePellet(p:typeof this.pellets[number]){p.mesh.removeFromParent();this.pellets.splice(this.pellets.indexOf(p),1);}
 private pose(a:Cory){this.models.pose(a.id,a.position,a.yaw,a.pitch,a.size,a.phase,a.effort,a.time);}
 info(id:number):Identification|undefined{const a=this.animals[id];if(!a)return;return {kind:'fish',coryId:id,name:`Dwarf Corydoras ${id+1}`,subtitle:'Salt-and-pepper cory · Corydoras habrosus',role:'A small bottom-foraging catfish. Barbels help it locate edible morsels in sand; it does not eat fish waste.',needs:'Fine, smooth substrate, companions, clean oxygenated water and food that reaches the bottom.',behavior:a.mode==='feeding'?'Following sinking food and searching for morsels.':a.mode==='foraging'?'Inspecting the substrate with its mouth and barbels.':a.mode==='exploring'?'Making a short excursion above the bottom.':'Exploring fresh floor patches, with brief stops to search the substrate.',point:a.position.clone()};}
 pick(ray:T.Raycaster){if(!this.models.root.visible)return;const h=ray.intersectObject(this.models.meshes[0])[0];if(h&&h.instanceId!==undefined)return {distance:h.distance,info:this.info(h.instanceId)!};}
}
