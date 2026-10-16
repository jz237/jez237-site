import {ContactScraping} from '../src/contact-scraping';
import {ChaseRound} from './chase';
import {PursuitDriving} from '../src/pursuit-driving';
import {DrivingBrain,type DriverCar} from '../src/driving-brain';
import {drivingObstacleClearance} from '../src/driving-probe';
import {pursuitTerrainClear} from '../src/pursuit-corridor';
import {onlineArena} from '../src/online-arena';
import type {ArenaId} from '../src/arena-id';
import {getRaceCourse,courseRoute,courseGridSlot,type RaceCourse} from '../src/race-course';
import {RaceRecovery,freeRecoverySlot} from '../src/race-recovery';
import {timedRaceFinished,timedRaceOrder} from '../src/timed-race';
import {armorWearMultiplier} from '../src/armor-wear';
import {derbyEndReason} from '../src/derby-policy';
import {validDrivingAssists} from '../src/driving-assists';
import {combatMotion} from '../src/combat-feats';
import {validTransmissionState} from '../src/transmission';
import type {VehicleStructure} from '../src/vehicle-structure';
import {stalledByImpact,validEngineStall} from '../src/engine-stall';
import {CollisionScars,captureCollisionMotion,collisionPointVelocity} from '../src/collision-contact';
import {OnlineEvent,type OnlineEventRules} from '../src/online-events';
import {nearestRoad} from '../src/waypoint-race';
import {validOnlineSetup,copyOnlineSetup,sameOnlineSetup,type OnlineSetup} from '../src/online-setup';
import {LEGACY_ONLINE_PLAYERS,validCapacity,type OnlineCapacity} from '../src/online-capacity';
import {raceGridSlot,lapProgress,circuitRoute,directionForCar,checkRoute,stepScoreRespawns} from '../src/event-rules';
import {applyComponentImpact,freshComponents,validComponents} from '../src/component-damage';
import {ImpactAdjudicator,type ImpactContact} from '../src/impact-adjudication';
import {accumulateEngineDamage} from '../src/engine-condition';
import {vehicleContact,vehicleContactManifold} from '../src/vehicle-contact';
import {createVehiclePhysics,stepVehiclePhysics,vehicleSpecification,vehicleSuspensionRestLength,type VehicleSpecification} from '../src/vehicle-physics';
import {createQuarryPhysics,landscapeHeight} from '../src/quarry-layout';
import type Rapier from '@dimforge/rapier3d-compat';
import { DEFINITIONS, CHECKPOINTS, clamp, wrap, surfaceAt, trackPoint, terrainHeight, derbyOrder, advanceCheckpoint, type CarKind, type Mode } from '../src/rules';
import { STEP, NEUTRAL, type Controls, type Vec3, type Quat, type CarState, type DamageEvent, type Snapshot } from './protocol';

type RapierAPI = typeof Rapier;
type Car = { structure:VehicleStructure; kind:CarKind; specification:VehicleSpecification; body: Rapier.RigidBody; collider: Rapier.Collider; roof: Rapier.Collider; controller: Rapier.DynamicRayCastVehicleController; state: CarState; stuck: number; escapeAttempts: number; reverse: number; roll: number; offTrack: number; lastRecovery: number; checkpointDistance: number };
const ONLINE_ARENA={x:0,z:0,radius:46,segments:66,spawnRadius:32,fenceRadius:50};
const AI_TRACK=Array.from({length:100},(_,i)=>trackPoint(i/100));
const quat = (yaw: number) => ({ x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) });
const rotate = (v: Vec3, q: Quat): Vec3 => {
  const tx = 2 * (q.y * v.z - q.z * v.y), ty = 2 * (q.z * v.x - q.x * v.z), tz = 2 * (q.x * v.y - q.y * v.x);
  return { x: v.x + q.w * tx + q.y * tz - q.z * ty, y: v.y + q.w * ty + q.z * tx - q.x * tz, z: v.z + q.w * tz + q.x * ty - q.y * tx };
};
const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
const dir = (a: Vec3, b: Vec3) => { const x = a.x - b.x, y = a.y - b.y, z = a.z - b.z, len = Math.hypot(x, y, z) || 1; return { x: x / len, y: y / len, z: z / len }; };

/** No renderer or client positions are involved: all movement, contacts, damage and finish order are calculated here. */
export class Simulation {
  world: Rapier.World;
  queue: Rapier.EventQueue;
  cars: Car[] = [];
  props: ReturnType<typeof createQuarryPhysics>['props'] = [];
  event?:OnlineEvent;
  course:RaceCourse;
  arenaId:ArenaId='quarry-arena-v1';
  get arena(){return onlineArena(this.arenaId).layout;}
  tick = 0;
  elapsed = 0;
  countdown = 3;
  phase: Snapshot['phase'] = 'lobby';
  damage: DamageEvent[] = [];
  private damageId = 0;
  private chaseDriving=new PursuitDriving(new DrivingBrain());
  private raceRecovery = new RaceRecovery();
  private impacts = new ImpactAdjudicator();
  private scars = new CollisionScars();
  private contactScraping=new ContactScraping();
  constructor(public R: RapierAPI, public mode: Mode = 'derby', kinds: CarKind[] = [],public readonly capacity:OnlineCapacity=LEGACY_ONLINE_PLAYERS,setups:(OnlineSetup|undefined)[]=[],rules?:OnlineEventRules,seed=0) {
    this.arenaId=mode==='derby'?rules?.arena??'quarry-arena-v1':'quarry-arena-v1';
    this.course=mode==='derby'?onlineArena(this.arenaId).ground:getRaceCourse(mode==='race'?rules?.course:undefined);
    if(rules)this.event=new OnlineEvent(mode,rules,seed,capacity);
    if(setups.some(s=>s!==undefined&&!validOnlineSetup(s)))throw new Error('Invalid vehicle setup');
    if(!validCapacity(capacity))throw new Error('Invalid online capacity');
    this.world = new R.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = STEP;
    this.queue = new R.EventQueue(true);
    this.buildTerrain();
    for (let id = 0; id < capacity; id++) this.cars.push(this.createCar(id, kinds[id] ?? (['coupe', 'sedan', 'hatch'] as CarKind[])[id % 3],setups[id]));
    for (const car of this.cars) this.spawn(car);
  }
  private buildTerrain() {if(this.course.id==='quarry-v1'&&this.arenaId==='quarry-arena-v1')this.props=createQuarryPhysics(this.R,this.world,this.mode==='derby').props;else{this.course.buildPhysics!(this.R,this.world);this.props=[];}}
  private createCar(id: number, kind: CarKind,setup?:OnlineSetup): Car {
    const specification=vehicleSpecification(kind,setup),{body,collider,roof,controller,structure}=createVehiclePhysics(this.R,this.world,kind,specification.mass,setup?.armor);
    const state: CarState = { id,kind,...(setup?{setup:copyOnlineSetup(setup)}:{}),p:{x:0,y:0,z:0},q:quat(0),v:{x:0,y:0,z:0},av:{x:0,y:0,z:0},health:100,engineStall:0,inflicted:0,damageLeft:0,damageRight:0,steering:0,speed:0,rpm:850,gear:1,wheels:[],input:{...NEUTRAL},passed:0,nextCheckpoint:1,lap:1,finished:false,finishTime:0,penalty:0,repair:0,surface:'gravel',slip:0,dents:[],components:freshComponents() };
    return {structure,kind,specification,body,collider,roof,controller,state,stuck:0,escapeAttempts:0,reverse:0,roll:0,offTrack:0,lastRecovery:-100,checkpointDistance:Infinity};
  }
  private place(c: Car, x: number, z: number, yaw: number) {
    c.body.setTranslation({x,y:this.course.height(x,z)+.89,z},true); c.body.setRotation(quat(yaw),true);
    c.body.setLinvel({x:0,y:0,z:0},true); c.body.setAngvel({x:0,y:0,z:0},true); c.roll = c.stuck = c.offTrack = 0;
    this.readBody(c);
  }
  private spawn(c: Car) {
    if(this.mode==='race'&&(this.capacity===24||this.event)){const grid=courseGridSlot(this.course,this.event?.chase?.gridSlot(c.state.id)??c.state.id,this.event?.rules.race==='laps'?this.event.rules.direction:'forward');this.place(c,grid.x,grid.z,grid.yaw);c.state.nextCheckpoint=grid.next;c.state.passed=this.event?.waypoints?0:grid.passed;}
    else if (this.mode === 'race') this.place(c, CHECKPOINTS[0].x+(c.state.id%2 ? 2.5 : -2.5)-Math.floor(c.state.id/2)*6, CHECKPOINTS[0].z, Math.PI/2);
    else { const a = c.state.id/this.capacity*Math.PI*2; this.place(c,this.arena.x+Math.sin(a)*this.arena.spawnRadius,this.arena.z+Math.cos(a)*this.arena.spawnRadius,a+Math.PI); }
  }
  private readBody(c: Car) {
    c.state.p = {...c.body.translation()}; c.state.q = {...c.body.rotation()}; c.state.v = {...c.body.linvel()}; c.state.av = {...c.body.angvel()};
    c.state.wheels = Array.from({length:4},(_,i)=>{
      const contact=c.controller.wheelIsInContact(i),normal=c.controller.wheelContactNormal(i),point=c.controller.wheelContactPoint(i);
      const patch=c.state.components?.tyreDamage!==undefined&&contact&&normal&&point?{
        plane:[normal.x,normal.y,normal.z,-(normal.x*point.x+normal.y*point.y+normal.z*point.z)-.001],
        load:this.wheelPatchLoad(c,i),
      }:undefined;
      return {suspension:c.controller.wheelSuspensionLength(i)??vehicleSuspensionRestLength(c.state.kind),rotation:c.controller.wheelRotation(i)??0,contact,...(patch?{patch}:{})};
    });
  }
  private wheelPatchLoad(c:Car,i:number){return clamp((c.controller.wheelSuspensionForce(i)??0)/(c.specification.mass*9.81/4),0,2)+(c.state.components?.wheelDamage[i]??0)*.5;}
  start() { this.phase = 'countdown'; this.countdown = 3; }
  setInput(id: number, input: Controls) { this.cars[id].state.input = {...input,...(input.assists?{assists:{...input.assists}}:{}),...(input.transmission?{transmission:{...input.transmission}}:{})}; }
  recover(id: number) {
    const c = this.cars[id], s = c?.state;
    if (this.event?.chase || !s || this.mode==='race'&&this.event?.rules.raceDuration&&s.finished || this.phase !== 'playing' || this.elapsed-c.lastRecovery<5 || (s.health<=0 && this.mode!=='playground')) return false;
    // Resolve circuit recovery before charging cooldown/penalty or moving a body.
    // Finished cars and wrecks still occupy their physical space.
    let circuitSlot:ReturnType<typeof freeRecoverySlot>;
    if(this.mode==='race'&&!this.event?.waypoints){
      const field=this.cars.map(car=>({...car.state,current:car.body.translation()}));
      const def=DEFINITIONS[s.kind],shape=new this.R.Cuboid(def.halfWidth+.2,.25,def.halfLength+.2);
      circuitSlot=freeRecoverySlot(field[id],field,this.route(id),{
        halfWidth:this.course.halfWidth,distance:this.course.distance,
      },slot=>!!this.world.intersectionWithShape(
        {x:slot.x,y:this.course.height(slot.x,slot.z)+.8,z:slot.z},quat(slot.yaw),shape,undefined,undefined,undefined,c.body));
      if(!circuitSlot)return false;
    }
    c.lastRecovery = this.elapsed;c.escapeAttempts=0;c.reverse=0;this.raceRecovery.clear(s);this.event?.combat.feats.remove(id);
    if (this.mode === 'playground') { s.health=100;s.engineStall=0;s.transmission=undefined;s.gear=1; s.damageLeft=s.damageRight=0; s.repair++;s.dents=[];s.components=freshComponents();this.damage=this.damage.filter(d=>d.car!==id);this.place(c,s.p.x,s.p.z,Math.atan2(s.v.x,s.v.z)); }
    else if (this.mode === 'race') {
      const waypoints=this.event?.waypoints;
      if(waypoints){const p=nearestRoad(s.p,this.course.checkpoints),nav=waypoints.navigation(s.id,s.p),next=nav.route[nav.next];this.place(c,p.x,p.z,Math.atan2(next.x-p.x,next.z-p.z));waypoints.get(s.id).nav=null;}
      else{const slot=circuitSlot!;this.place(c,slot.x,slot.z,slot.yaw);}
      c.checkpointDistance=Infinity;s.penalty+=5;
    }
    else { s.health=Math.max(1,s.health-8); const dx=s.p.x-this.arena.x,dz=s.p.z-this.arena.z,r=Math.hypot(dx,dz),scale=Math.min(1,(this.arena.radius-8)/Math.max(r,.001));this.place(c,this.arena.x+dx*scale,this.arena.z+dz*scale,Math.atan2(-dx,-dz)); }
    this.damageShape(c); return true;
  }
  private route(id:number){return courseRoute(this.course,directionForCar(this.event?.rules.race==='laps'?this.event.rules.direction:'forward',id));}
  private damageShape(c: Car) { c.structure.update(c.state.components?.structure,c.state.health); }
  ai(c: Car): Controls {
    const s=c.state;
    if (s.health<=0) return {...NEUTRAL};
    if(this.event?.chase)return this.chaseAI(c);
    let tx=this.mode==='derby'?this.arena.x:0,tz=this.mode==='derby'?this.arena.z:0;
    if (this.mode==='derby') {
      const targets=this.cars.filter(a=>a!==c && a.state.health>0).sort((a,b)=>Math.hypot(a.state.p.x-s.p.x,a.state.p.z-s.p.z)-Math.hypot(b.state.p.x-s.p.x,b.state.p.z-s.p.z));
      const target=targets[Math.floor((this.elapsed+s.id*1.79)/5)%Math.min(3,targets.length)]?.state;
      if (!target) return {...NEUTRAL};
      if (Math.hypot(s.p.x-this.arena.x,s.p.z-this.arena.z)<this.arena.radius-5) { tx=target.p.x+target.v.x*.35; tz=target.p.z+target.v.z*.35; }
    } else if(this.mode==='race') {const nav=s.finished?undefined:this.event?.waypoints?.navigation(s.id,s.p);if(nav)s.nextCheckpoint=nav.next;const p=(nav?.route??this.route(s.id))[s.nextCheckpoint];tx=p.x+Math.sin(s.id*1.79)*2;tz=p.z+Math.cos(s.id*1.79)*2;}
    else {const p=trackPoint((this.elapsed*.011+s.id*.18)%1);tx=p.x;tz=p.z;}
    if(this.mode==='race'){
      const nearest=this.event?.waypoints&&this.course.waypointStations?0:this.course.distance(s.p.x,s.p.z);
      c.offTrack=nearest>14?c.offTrack+STEP:0;
      if(c.offTrack>7||c.roll>4){this.recover(s.id);c.offTrack=0;}
    }
    const f=rotate({x:0,y:0,z:1},s.q),right=rotate({x:1,y:0,z:0},s.q), angle=wrap(Math.atan2(tx-s.p.x,tz-s.p.z)-Math.atan2(f.x,f.z));
    let steer=clamp(angle*1.65,-1,1),throttle=.8,brake=Math.abs(s.speed)>17&&Math.abs(angle)>.8?.5:0;
    if(this.mode==='race'){const cruise=s.finished?8:17,desired=clamp(cruise-Math.abs(angle)*9,5,cruise);throttle=clamp((desired-s.speed)*.4,0,1);brake=clamp((s.speed-desired)/4,0,1);}
    c.stuck=Math.abs(s.speed)<1.2&&this.elapsed>2?c.stuck+STEP:0;
    if(c.stuck>1.8){c.reverse=1.5+s.id*.08;c.stuck=0;c.escapeAttempts++;}
    if(c.reverse>0){c.reverse=Math.max(0,c.reverse-STEP);throttle=-.65;steer=-steer;brake=0;}
    if(this.mode==='race'&&this.raceRecovery.ready(s,STEP,c.escapeAttempts))this.recover(s.id);
    if(c.roll>5)this.recover(s.id);
    if(this.mode!=='derby')for(const other of this.cars){if(other===c)continue;const o=other.state,d={x:o.p.x-s.p.x,y:o.p.y-s.p.y,z:o.p.z-s.p.z};
      const ahead=dot(d,f),side=dot(d,right),blocked=o.health===0||Math.abs(o.speed)<Math.abs(s.speed)-3;
      if(Math.hypot(d.x,d.y,d.z)<9&&ahead>0&&Math.abs(side)<3&&blocked)steer=clamp(steer+(side>0?-1:1)*.7,-1,1);
    }
    return {throttle,steer,brake,handbrake:false};
  }
  private chaseAI(c:Car):Controls{
    const driver=(state:CarState):DriverCar=>({id:state.id,kind:state.kind,current:state.p,velocity:state.v,forward:rotate({x:0,y:0,z:1},state.q),right:rotate({x:1,y:0,z:0},state.q),speed:state.speed,health:state.health,finished:state.finished,nextCheckpoint:state.nextCheckpoint,surface:state.surface});
    const others=this.cars.map(c=>driver(c.state)),car=others.find(other=>other.id===c.state.id)!;
    // Vehicle avoidance belongs to PursuitDriving, which deliberately excludes
    // the intended runner. Static probes must not turn that runner into a wall.
    const obstacle=(collider:Rapier.Collider)=>(this.course.isDrivingObstacle?.(collider)??true)&&!this.cars.some(other=>other.body.handle===collider.parent()?.handle);
    const probeY=Math.max(car.current.y,this.course.height(car.current.x,car.current.z)+.55);
    const ray=(angle:number,length:number)=>{const yaw=Math.atan2(car.forward.x,car.forward.z)+angle;const hit=this.world.castRay(new this.R.Ray({x:car.current.x,y:probeY,z:car.current.z},{x:Math.sin(yaw),y:0,z:Math.cos(yaw)}),length,true,undefined,undefined,undefined,c.body,obstacle);return drivingObstacleClearance(car,angle,hit?.timeOfImpact??length);};
    const clear=(target:{id:number;x:number;z:number})=>{
      const width=DEFINITIONS[c.kind].halfWidth;if(!pursuitTerrainClear(car.current,target,width,this.course.height,this.course.outside))return false;
      const dx=target.x-car.current.x,dz=target.z-car.current.z,length=Math.hypot(dx,dz);if(length<.1)return true;
      for(const side of [-1,0,1]){const hit=this.world.castRay(new this.R.Ray({x:car.current.x+dz/length*(width+.35)*side,y:probeY,z:car.current.z-dx/length*(width+.35)*side},{x:dx/length,y:0,z:dz/length}),length,true,undefined,undefined,undefined,c.body,obstacle);if(hit)return false;}
      return true;
    };
    return this.chaseDriving.update(this.event!.chase!.session,car,others,STEP,this.elapsed,this.route(car.id),()=>({front:ray(0,35),left:ray(-.55,25),right:ray(.55,25),rear:ray(Math.PI,20)}),clear);
  }
  private drive(c:Car) {
    const s=c.state;s.surface=this.course.surface(s.p.x,s.p.z);
    const up=stepVehiclePhysics(c.body,c.controller,s.kind,c.specification,s,STEP,s.components?.wheelDamage,s.components?.wheelShift,s.components?.engineDamage,s.components?.tyreDamage);
    c.roll=up<.2?c.roll+STEP:0;
  }
  step(humans: Set<number>) {
    if(this.phase==='lobby'||this.phase==='result')return;
    this.tick++;
    if(this.phase==='countdown'){this.countdown-=STEP;if(this.countdown<=0)this.phase='playing';return;}
    this.elapsed+=STEP;
    for(const c of this.cars){if(this.event?.chase?.stopped(c.state.id))c.state.input={...NEUTRAL};else if(!humans.has(c.state.id)||this.mode==='race'&&this.event?.rules.raceDuration&&c.state.finished)c.state.input=this.ai(c);this.drive(c);}
    const scoreMotion=this.event?.score?this.cars.map(c=>combatMotion(c.state.id,c.state.p,c.state.q,c.state.v,c.body.angvel().y,c.state.health,[0,1,2,3].filter(i=>c.controller.wheelIsInContact(i)).length)):[];
    if(this.event?.score)this.event.combat.sample(scoreMotion,this.elapsed);
    const collisionMotion=captureCollisionMotion(this.world);
    this.world.step(this.queue);
    for(const c of this.cars)this.readBody(c);
    const contacts:(ImpactContact&{a?:Car;b?:Car;point1:Vec3;point2:Vec3;scarDirection:Vec3;speed:number})[]=[];
    this.queue.drainContactForceEvents(e=>{
      const h1=e.collider1(),h2=e.collider2(),{a,b,key}=vehicleContact(this.world,this.cars,h1,h2);
      if(!a&&!b)return;
      const manifold=vehicleContactManifold(this.world,h1,h2),normal=manifold?.normal??{x:0,y:0,z:0};
      const point1=manifold?.point1??{...(a??b)!.state.p},point2=manifold?.point2??{...(b??a)!.state.p};
      const va=collisionPointVelocity(this.world,collisionMotion,h1,point1),vb=collisionPointVelocity(this.world,collisionMotion,h2,point2);
      const relative={x:vb.x-va.x,y:vb.y-va.y,z:vb.z-va.z},impulse=e.totalForceMagnitude()*STEP;
      const closing=dot(normal,normal)>.5?Math.abs(dot(relative,normal)):Math.hypot(relative.x,relative.y,relative.z);
      const cv1=va,cv2=vb;
      const speed=Math.hypot(cv2.x-cv1.x,cv2.y-cv1.y,cv2.z-cv1.z),scarDirection=dir(cv2,cv1);
      contacts.push({a,b,key,point1,point2,scarDirection,speed,impulse,closing,damageScale:Math.max(a&&a.state.health>0?a.specification.damageScale:0,b&&b.state.health>0?b.specification.damageScale:0)});
    });
    this.contactScraping.sample(contacts.map(c=>({...c,a:c.a?.state,b:c.b?.state})),this.elapsed);
    for(const c of this.cars)c.state.contactScrape=this.contactScraping.level(c.state.id)||undefined;
    for(const {a,b,point1,point2,scarDirection} of this.scars.adjudicate(contacts,this.elapsed)){
      for(const car of [a,b])if(car){
        const s=car.state,point=car===a?point1:point2,direction=car===a?scarDirection:{x:-scarDirection.x,y:-scarDirection.y,z:-scarDirection.z};
        const inverse={x:-s.q.x,y:-s.q.y,z:-s.q.z,w:s.q.w};
        const localPoint=rotate({x:point.x-s.p.x,y:point.y-s.p.y,z:point.z-s.p.z},inverse),localDirection=rotate(direction,inverse);
        const event:DamageEvent={id:++this.damageId,tick:this.tick,car:s.id,point,direction,localPoint,localDirection,repair:s.repair,damage:0,scar:true};
        this.damage.push(event);(s.dents??=[]).push({id:event.id,localPoint,localDirection,repair:s.repair,damage:0,scar:true});s.dents=s.dents.slice(-334);
      }
    }
    for(const {contact:{a,b,point1,point2,scarDirection},damage} of this.impacts.adjudicate(contacts,this.elapsed,this.mode==='race'?.45:1)){
      if(damage===0)continue;
      for(const [car,other] of [[a,b],[b,a]])if(car&&car.state.health>0){
        const point=car===a?point1:point2,s=car.state,direction=car===a?scarDirection:{x:-scarDirection.x,y:-scarDirection.y,z:-scarDirection.z};
        const armorInverse={x:-s.q.x,y:-s.q.y,z:-s.q.z,w:s.q.w},armorPoint=rotate({x:point.x-s.p.x,y:point.y-s.p.y,z:point.z-s.p.z},armorInverse);
        const received=damage*car.specification.damageScale*armorWearMultiplier(car.kind,s.components?.structure,armorPoint,rotate(direction,armorInverse),car.specification.damageScale),actual=Math.min(received,s.health);
        if(received<.1)continue;
        const before=s.health;s.health=Math.max(0,s.health-received);if(other){other.state.inflicted+=actual;if(this.event?.score){this.event.combat.hit(other.state.id,s.id,before,s.health,this.elapsed);this.event.combat.contact(scoreMotion[other.state.id],scoreMotion[s.id],actual,this.elapsed);}}
        const local=rotate({x:point.x-s.p.x,y:point.y-s.p.y,z:point.z-s.p.z},{x:-s.q.x,y:-s.q.y,z:-s.q.z,w:s.q.w});
        if(local.x<0)s.damageLeft+=received;else s.damageRight+=received;
        const localDirection=rotate(direction,{x:-s.q.x,y:-s.q.y,z:-s.q.z,w:s.q.w});
        const event={id:++this.damageId,tick:this.tick,car:s.id,point,direction,localPoint:local,localDirection,repair:s.repair,damage:received};
        applyComponentImpact(s.components??=freshComponents(),s.kind,local,localDirection,received);
        s.engineStall=stalledByImpact(s.engineStall,s.health,s.components.engineDamage,received);
        if(s.engineStall!>0||s.health<=0)s.rpm=0;
        // Contacts were sampled before damage. Keep their visual load coherent
        // with this snapshot's newly updated mechanical corner condition.
        s.wheels.forEach((wheel,i)=>{if(wheel.patch)wheel.patch.load=this.wheelPatchLoad(car,i);});
        this.damageShape(car);this.damage.push(event);
        (s.dents??=[]).push({id:event.id,localPoint:local,localDirection,damage:received,repair:s.repair});
        // Preserve the existing wire bound; full mechanical condition is replicated
        // separately, even when a long sequence of small visual impacts is truncated.
        s.dents=s.dents.slice(-334);
      }
    }
    // Repeat a bounded event history in snapshots to survive late packets/reconnects.
    this.damage=this.damage.filter(d=>this.tick-d.tick<600).slice(-128);
    if(this.event?.respawns)stepScoreRespawns(this.event.combat,this.cars.map(c=>({id:c.state.id,health:c.state.health,current:c.state.p,place:(x:number,z:number,yaw:number)=>{
      const s=c.state;s.health=100;s.engineStall=0;s.transmission=undefined;s.gear=1;s.damageLeft=s.damageRight=0;s.repair++;s.dents=[];s.components=freshComponents();s.input={...NEUTRAL};c.reverse=0;c.lastRecovery=this.elapsed;
      this.damage=this.damage.filter(d=>d.car!==s.id);this.place(c,x,z,yaw);this.damageShape(c);
    }})),this.elapsed,this.event.rules.duration,this.arena,()=>{});
    for(const c of this.cars){const s=c.state;
      if(this.course.outside(s.p.x,s.p.y,s.p.z)){
        if(this.event?.chase){s.health=0;s.input={...NEUTRAL};this.damageShape(c);continue;}
        this.recover(s.id);
      }
      // Finished AI cars keep circulating so they do not park across the finish gate.
      if(!this.event?.chase&&this.mode==='race'&&s.finished&&s.health>0){const check=checkRoute(this.route(s.id),s.p.x,s.p.z,s.nextCheckpoint,c.checkpointDistance,this.course.checkpointRadius??12);c.checkpointDistance=check.passed?Infinity:check.distance;if(check.passed)s.nextCheckpoint=(s.nextCheckpoint+1)%24;}
      if(this.mode==='race'&&!s.finished&&s.health>0){
        if(this.event?.waypoints){
          const waypoint=this.event.waypoints;waypoint.sample(s.id,s.p);const progress=waypoint.get(s.id);s.passed=progress.passed;s.lap=progress.round+1;
          if(progress.finished){s.finished=true;s.finishTime=this.elapsed+s.penalty;s.nextCheckpoint=1;}else s.nextCheckpoint=waypoint.navigation(s.id,s.p).next;
        }else{
          const check=checkRoute(this.route(s.id),s.p.x,s.p.z,s.nextCheckpoint,c.checkpointDistance,this.course.checkpointRadius??12);c.checkpointDistance=check.distance;
          if(check.passed){s.passed++;s.nextCheckpoint=(s.nextCheckpoint+1)%24;c.checkpointDistance=Infinity;
            if(this.capacity===24||this.event){const progress=lapProgress(s.passed,this.event?.rules.laps??3);s.lap=progress.lap;if((!this.event?.chase||this.event.chase.canFinish(s.id))&&(this.event?.rules.raceDuration?timedRaceFinished(s.passed,this.elapsed,this.event.rules.raceDuration):progress.finished)){s.finished=true;s.finishTime=this.elapsed+s.penalty;}}
            else if(s.nextCheckpoint===1){s.lap++;if(s.lap>3){s.finished=true;s.finishTime=this.elapsed+s.penalty;}}
          }
        }
      }
    }
    if(this.mode==='derby'&&derbyEndReason(this.event?.rules.derby??'survival',this.cars.map(c=>c.state),this.elapsed,this.event?.rules.duration??300))this.phase='result';
    if(this.event?.chase){this.event.chase.update(this.cars.map(c=>c.state),this.elapsed);if(this.event.chase.session.complete)this.phase='result';}
    if(!this.event?.chase&&this.mode==='race'&&(this.elapsed>=(this.event?.rules.raceDuration?this.event.rules.raceDuration+120:Math.max(900,(this.event?.rules.laps??3)*300))||this.cars.every(c=>c.state.finished||c.state.health<=0)))this.phase='result';
  }
  ranking(){
    const cars=this.cars.map(c=>c.state),distance=(s:CarState)=>{if(this.event?.waypoints)return this.event.waypoints.remainingDistance(s.id,s.p);const p=this.route(s.id)[s.nextCheckpoint];return Math.hypot(s.p.x-p.x,s.p.z-p.z);};
    if(this.event?.chase)return this.event.chase.ranking(cars);
    if(this.mode==='race'&&this.event?.rules.raceDuration)return timedRaceOrder(cars.map(c=>({...c,current:c.p})),id=>this.route(id)).map(c=>c.id);
    return (this.mode==='derby'?(this.event?.score?this.event.combat.order(cars):derbyOrder(cars)):cars.sort((a,b)=>a.finished&&b.finished?a.finishTime-b.finishTime:a.finished?-1:b.finished?1:b.passed-a.passed||distance(a)-distance(b)||a.id-b.id)).map(c=>c.id);
  }
  snapshot(includeDamage=false): Omit<Snapshot,'members'|'ack'> {return {type:'snapshot',...(this.event?{event:this.event.snapshot(this.capacity)}:{}),capacity:this.capacity,tick:this.tick,elapsed:this.elapsed,countdown:this.countdown,mode:this.mode,phase:this.phase,props:this.props.map(p=>({id:p.id,p:{...p.body.translation()},q:{...p.body.rotation()},v:{...p.body.linvel()},av:{...p.body.angvel()}})),cars:this.cars.map(c=>structuredClone({...c.state,dents:includeDamage?c.state.dents:undefined})),damage:structuredClone(this.damage),ranking:this.ranking()};}
  restore(s:Snapshot) {
    if(s.event?.rules.chase)ChaseRound.restore(s.event.rules.chase,this.capacity,s.event.chase,s.cars,s.elapsed);
    const arenaId=s.mode==='derby'?s.event?.rules.arena??'quarry-arena-v1':'quarry-arena-v1';
    const course=s.mode==='derby'?onlineArena(arenaId).ground:getRaceCourse(s.mode==='race'?s.event?.rules.course:undefined);
    if(course!==this.course||s.mode!==this.mode){this.queue.free();this.world.free();this.course=course;this.arenaId=arenaId;this.mode=s.mode;this.world=new this.R.World({x:0,y:-9.81,z:0});this.world.timestep=STEP;this.queue=new this.R.EventQueue(true);this.buildTerrain();this.cars=s.cars.map(c=>this.createCar(c.id,c.kind,c.setup));}
    this.impacts.clear();this.scars.clear();this.contactScraping.clear();this.chaseDriving.reset();
    if(s.event){this.event=new OnlineEvent(s.mode,s.event.rules,s.event.seed,this.capacity);this.event.restore(s.event,this.capacity);}else this.event=undefined;
    this.tick=s.tick;this.elapsed=s.elapsed;this.countdown=s.countdown;this.phase=s.phase;this.damage=structuredClone(s.damage);
    this.damageId=Math.max(0,...s.damage.map(d=>d.id),...s.cars.flatMap(c=>(c.dents??[]).map(d=>d.id)));
    for(const car of s.cars){if(car.contactScrape!==undefined&&(!Number.isFinite(car.contactScrape)||car.contactScrape<0||car.contactScrape>1))throw new Error('Invalid saved contact scraping');if(car.setup!==undefined&&!validOnlineSetup(car.setup))throw new Error('Invalid saved vehicle setup');let c=this.cars[car.id];
      if(c.state.kind!==car.kind||!sameOnlineSetup(c.state.setup,car.setup,car.kind)){this.world.removeVehicleController(c.controller);this.world.removeRigidBody(c.body);c=this.cars[car.id]=this.createCar(car.id,car.kind,car.setup);}
      c.state={...c.state,contactScrape:undefined,...structuredClone(car),surface:car.surface??this.course.surface(car.p.x,car.p.z),slip:car.slip??0};c.state.input={...NEUTRAL,...(validDrivingAssists(car.input.assists)?{assists:{...car.input.assists}}:{})};c.state.transmission=validTransmissionState(car.transmission)?structuredClone(car.transmission):undefined;if(c.state.transmission)c.state.input.transmission={mode:c.state.transmission.mode,up:false,down:false,clutch:0};c.state.engineStall=validEngineStall(car.engineStall)?car.engineStall??0:0;
      const engineHistory=(c.state.dents??[]).filter(hit=>hit.repair===c.state.repair);
      // A bounded legacy history may have lost older hits. Only infer the new
      // component when those retained hits account for all structural health
      // loss; otherwise retain legacy power until a real repair establishes it.
      const completeEngineHistory=engineHistory.reduce((sum,hit)=>sum+hit.damage,0)+1e-6>=100-c.state.health;
      if(!validComponents(car.components)){
        c.state.components=freshComponents();
        // Legacy saves never recorded tyre-specific trauma. Retained body hits
        // cannot establish which model produced the saved driving state.
        c.state.components.tyreDamage=undefined;
        c.state.components.structure=undefined;
        for(const hit of engineHistory)applyComponentImpact(c.state.components,c.state.kind,hit.localPoint,hit.localDirection,hit.damage);
        if(!completeEngineHistory)c.state.components.engineDamage=undefined;
      }else if(car.components!.engineDamage===undefined){
        // Keep authoritative wheels even when their older visual hits were lost.
        let engineDamage=0;
        for(const hit of engineHistory)engineDamage=accumulateEngineDamage(engineDamage,c.state.kind,hit.localPoint,hit.damage);
        c.state.components!.engineDamage=completeEngineHistory?engineDamage:undefined;
      }
      c.body.setTranslation(car.p,true);c.body.setRotation(car.q,true);c.body.setLinvel(car.v,true);c.body.setAngvel(car.av,true);this.damageShape(c);}
    for(const p of s.props??[]){const prop=this.props[p.id];if(!prop)continue;prop.body.setTranslation(p.p,true);prop.body.setRotation(p.q,true);prop.body.setLinvel(p.v,true);prop.body.setAngvel(p.av,true);}
  }

  dispose(){this.queue.free();this.world.free();}
}
