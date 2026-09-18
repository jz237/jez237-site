import {behaviorSeed,behaviorRandom} from './BehaviorVariation.ts';
import * as T from 'three';
import {FoodReachability,foodApproach} from './FoodReachability.ts';
import {bodyObstacleCandidates} from './BodyObstacles.ts';
import {AngelfishModel,loadAngelfish} from './AngelfishModel.ts';
import {advanceAngel,createAngel,angelBody,angelForward,angelMouth,type AngelFood} from './AngelfishMotion.ts';
import {bodiesOverlap,fishTouch,type FishContactBody,type BodySphere} from './GrazerCollision.ts';
import type {GrazerPlants} from './GrazerPlants';
import type {Obstacle} from './TankSpace';
import type {Identification} from './Exploration';

export class Angelfish{
 readonly root=new T.Group();readonly states=[createAngel(0),createAngel(1)];readonly models:AngelfishModel[]=[];
 private foodPaths=[new FoodReachability(),new FoodReachability()];
 private time=0;private neighbors:{position:T.Vector3;radius:number}[]=[];
 private collision:BodySphere[][]=[];
 private inspection=[{clock:0,hold:0,cooldown:0,near:false},{clock:0,hold:0,cooldown:0,near:false}];
 private poseCache=new Map<number,{position:T.Vector3;yaw:number;pitch:number;reach:number;phase:number;body:BodySphere[]}>();
 private stateBody(id:number){const s=this.states[id],cached=this.poseCache.get(id);
  if(cached&&cached.yaw===s.yaw&&cached.pitch===s.pitch&&cached.reach===s.reach&&cached.phase===s.phase&&cached.position.equals(s.position))return cached.body;
  const body=angelBody(s.position,s.yaw,s.pitch,s.size,s.reach,s.phase);this.poseCache.set(id,{position:s.position.clone(),yaw:s.yaw,pitch:s.pitch,reach:s.reach,phase:s.phase,body});return body;
 }
 private obstacles:Obstacle[];private height:(x:number,z:number)=>number;private plants:GrazerPlants;readonly prototype:T.Group;
 constructor(obstacles:Obstacle[],height:(x:number,z:number)=>number,plants:GrazerPlants,prototype:T.Group,sessionSeed?:number){
  this.obstacles=obstacles;this.height=height;this.plants=plants;this.prototype=prototype;
  for(const s of this.states){
   if(sessionSeed!==undefined){const r=behaviorRandom(behaviorSeed(sessionSeed,s.id));s.seed=behaviorSeed(sessionSeed,s.id+3);s.locomotorSeed=behaviorSeed(sessionSeed,s.id+5);s.phase=r()*30;s.timer=1+r()*7;s.strokeIn=.2+r()*2;s.powerStroke=r()<.6;s.cruise=.3+r()*.16;s.hunger=.45+r()*.25;}
   const m=new AngelfishModel(prototype,s.phase);m.group.scale.setScalar(s.size);this.models.push(m);this.root.add(m.group);
   // A valid, whole-animal pose before the first visible frame.
   if(!this.clear(s.position,s.yaw,0,s.size,s.id)){let found=false;for(const z of [1.76,-1.72,1.25]){for(let x=-3.3;x<3.5;x+=.55){const p=new T.Vector3(x,3.8,z);if(this.clear(p,s.yaw,0,s.size,s.id)){s.position.copy(p);found=true;break;}}if(found)break;}}
   s.previous.copy(s.position);
  }
  this.pose(0);
 }
 static load=loadAngelfish;
 private clear(p:T.Vector3,yaw:number,pitch:number,size:number,id:number,reach=this.states[id]?.reach??0,traffic=true){
  const body=angelBody(p,yaw,pitch,size,reach,this.states[id]?.phase),near=this.neighbors.filter(n=>p.distanceToSquared(n.position)<(1.4+n.radius)**2);
  const obstacles=bodyObstacleCandidates(body,this.obstacles);
  for(const {center:c,radius:r} of body){
   if(c.x-r< -4.85||c.x+r>4.85||c.z-r< -2.10||c.z+r>2.10||c.y+r>5.12||c.y-r<this.height(c.x,c.z)+.035)return false;
   for(const o of obstacles)if(c.distanceToSquared(o.center)<(r+o.radius)**2)return false;
   for(const n of near)if(traffic&&c.distanceToSquared(n.position)<(r+n.radius)**2)return false;
  }
  const other=this.states[1-id];if(traffic&&other&&p.distanceToSquared(other.position)<5.8&&bodiesOverlap(body,this.stateBody(1-id),.045))return false;
  return this.plants.clearBody(p,body,this.time,undefined,false,1.3);
 }
 update(dt:number,time:number,daylight:number,food:AngelFood[],visitors:{position:T.Vector3;radius:number}[],eat:(id:number)=>void){
  this.time=time;this.neighbors=visitors;
  const available=[...food];
  for(const s of this.states){
   const inspect=this.inspection[s.id];inspect.clock-=dt;inspect.hold=Math.max(0,inspect.hold-dt);inspect.cooldown=Math.max(0,inspect.cooldown-dt);
   if(dt>0&&inspect.clock<=0){
    inspect.clock=.22;const probe=s.position.clone().addScaledVector(angelForward(s.yaw,s.pitch),.65*s.size);probe.y-=.72*s.size;
    inspect.near=this.obstacles.some(o=>probe.distanceTo(o.center)<o.radius+.6*s.size)||!this.plants.clearBody(probe,[{center:probe,radius:.6*s.size}],time,undefined,false,.65);
    if(inspect.near&&inspect.cooldown===0){inspect.hold=2.6+s.id*.5;inspect.cooldown=7+s.id*2;if(s.target===null)s.hover=Math.max(s.hover,.9);}
   }
   const reach=T.MathUtils.lerp(s.reach,inspect.near&&inspect.hold>0?1:0,1-Math.exp(-dt*2.3));
   if(Math.abs(reach-s.reach)<.0001||this.clear(s.position,s.yaw,s.pitch,s.size,s.id,reach))s.reach=reach;
   advanceAngel(s,dt,{daylight,companion:this.states[1-s.id].position,food:available,reachable:f=>f.id!==this.states[1-s.id].target&&this.foodPaths[s.id].test(f.id,time,s.position,f.position,()=>foodApproach(s.position,f.position,s.yaw,s.pitch,.785*s.size,(p,y,pitch)=>this.clear(p,y,pitch,s.size,s.id,s.reach,false),undefined,-.035*s.size)),other:[...visitors,{position:this.states[1-s.id].position,radius:.75}],clear:(p,y,pitch,size)=>this.clear(p,y,pitch,size,s.id)});
   // A swaying leaf can enter yesterday's clear pose. Resolve that contact by
   // the smallest available translation, without snapping the fish's heading.
   if(dt>0&&!this.clear(s.position,s.yaw,s.pitch,s.size,s.id)){
    const directions=[s.previous.clone().sub(s.position).normalize(),new T.Vector3(0,0,1),new T.Vector3(0,0,-1),new T.Vector3(1,0,0),new T.Vector3(-1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,-1,0)];
    let resolved=false;
    for(const amount of [.006,.012,.025,.05,.10]){for(const direction of directions){if(direction.lengthSq()<.5)continue;const p=s.position.clone().addScaledVector(direction,amount);if(this.clear(p,s.yaw,s.pitch,s.size,s.id)){s.position.copy(p);s.speed*=.5;resolved=true;break;}}if(resolved)break;}
   }
   if(s.consumed!==null){const i=available.findIndex(f=>f.id===s.consumed);if(i>=0){available.splice(i,1);this.models[s.id].bite();eat(s.consumed);}}
  }
  this.pose(dt,available);
 }
 pose(dt:number,food:AngelFood[]=[]){for(const s of this.states){
  const m=this.models[s.id],flake=food.find(f=>f.id===s.target);
  const opening=flake&&s.retreat===0&&s.bite===0&&s.speed<.7?1-T.MathUtils.smoothstep(angelMouth(s).distanceTo(flake.position),.055,.17):0;
  m.group.position.copy(s.position);m.group.rotation.set(0,s.yaw,s.pitch,'YXZ');m.update(dt,s.effort,s.hover>0,s.reach,s.speed,opening);
 }this.collision=this.states.map(s=>angelBody(s.position,s.yaw,s.pitch,s.size,s.reach,s.phase));}
 contacts():FishContactBody[]{return this.states.map(s=>({id:100+s.id,position:s.position.clone(),previous:s.previous.clone(),forward:angelForward(s.yaw,s.pitch),size:s.size,envelope:angelBody(new T.Vector3(),s.yaw,s.pitch,s.size,s.reach,s.phase)}));}
 correct(id:number,p:T.Vector3){const s=this.states[id];if(!s)return;s.position.copy(p);s.speed=0;s.timer=0;this.pose(0);}
 startle(){for(const s of this.states){s.startle=.2+s.id*.07;s.hover=0;}}
 constrainTetra(fish:FishContactBody){let p=fish.position;const segment=new T.Line3(),nearest=new T.Vector3();
  for(let i=0;i<this.collision.length;i++){segment.set(fish.previous??p,p);segment.closestPointToPoint(this.states[i].position,true,nearest);if(nearest.distanceToSquared(this.states[i].position)>3.24)continue;const hit=fishTouch({...fish,position:p},this.collision[i]);if(hit)p=hit;}return this.exclude(p);
 }
 /** A tetra is held outside the entire silhouette, including tall fins. */
 exclude(p:T.Vector3,radius=.29){
  const result=p.clone();
  for(let pass=0;pass<5;pass++){let changed=false;for(const [id,body] of this.collision.entries()){if(result.distanceToSquared(this.states[id].position)>(1.4+radius)**2)continue;for(const b of body){
   const delta=result.clone().sub(b.center),distance=delta.length(),required=radius+b.radius+.01;
   if(distance<required){if(distance<1e-8)delta.set(0,0,1);else delta.divideScalar(distance);result.addScaledVector(delta,required-distance);changed=true;}
  }}if(!changed)break;}
  return result;
 }
 info(id:number):Identification{const s=this.states[id];return {kind:'fish',angelId:id,name:'Silver angelfish '+(id+1),subtitle:'Pterophyllum scalare',role:'A laterally compressed cichlid that uses its fins for precise hovering, turns and short feeding approaches.',needs:'Vertical swimming room, planted shelter, clean oxygenated water and carefully chosen companions. Adults can eat small fish and shrimp; this display is not a stocking recommendation.',behavior:s.behavior,point:s.position.clone()};}
 pick(ray:T.Raycaster){if(!this.root.visible)return null;let best:{distance:number;info:Identification}|null=null;for(const s of this.states){const hit=ray.intersectObject(this.models[s.id].group,true)[0];if(hit&&(!best||hit.distance<best.distance))best={distance:hit.distance,info:this.info(s.id)};}return best;}
}
