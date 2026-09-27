import {createQuarryPhysics,landscapeHeight} from '../src/quarry-layout';
import type Rapier from '@dimforge/rapier3d-compat';
import { DEFINITIONS, CHECKPOINTS, clamp, wrap, surfaceAt, trackPoint, terrainHeight, damageFromImpulse, derbyOrder, advanceCheckpoint, type CarKind, type Mode } from '../src/rules';
import { STEP, MAX_PLAYERS, NEUTRAL, type Controls, type Vec3, type Quat, type CarState, type DamageEvent, type Snapshot } from './protocol';

type RapierAPI = typeof Rapier;
type Car = { body: Rapier.RigidBody; collider: Rapier.Collider; roof: Rapier.Collider; controller: Rapier.DynamicRayCastVehicleController; state: CarState; stuck: number; reverse: number; roll: number; offTrack: number; lastRecovery: number; checkpointDistance: number };
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
  tick = 0;
  elapsed = 0;
  countdown = 3;
  phase: Snapshot['phase'] = 'lobby';
  damage: DamageEvent[] = [];
  private damageId = 0;
  private impacts = new Map<string, number>();
  constructor(public R: RapierAPI, public mode: Mode = 'derby', kinds: CarKind[] = []) {
    this.world = new R.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = STEP;
    this.queue = new R.EventQueue(true);
    this.buildTerrain();
    for (let id = 0; id < MAX_PLAYERS; id++) this.cars.push(this.createCar(id, kinds[id] ?? (['coupe', 'sedan', 'hatch'] as CarKind[])[id % 3]));
    for (const car of this.cars) this.spawn(car);
  }
  private buildTerrain() {this.props=createQuarryPhysics(this.R,this.world,this.mode==='derby').props;}
  private createCar(id: number, kind: CarKind): Car {
    const R = this.R, d = DEFINITIONS[kind];
    const body = this.world.createRigidBody(R.RigidBodyDesc.dynamic().setLinearDamping(0.06).setAngularDamping(0.65).setCcdEnabled(true).setCanSleep(true));
    const collider = this.world.createCollider(R.ColliderDesc.cuboid(d.halfWidth - .06, .25, d.halfLength - .12).setMass(d.mass).setFriction(.45).setRestitution(.12).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000), body);
    const roof = this.world.createCollider(R.ColliderDesc.cuboid(.65,.24,.65).setTranslation(0,kind==='coupe'?.12:.2,-.1).setMass(0).setFriction(.5).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000), body);
    const controller = this.world.createVehicleController(body);
    controller.indexUpAxis = 1; controller.setIndexForwardAxis = 2;
    for (const [x,z] of [[-1,1],[1,1],[-1,-1],[1,-1]]) {
      const i = controller.numWheels();
      controller.addWheel({x:x*(d.halfWidth-.04), y:-.12,z:z*d.wheelbase/2},{x:0,y:-1,z:0},{x:-1,y:0,z:0},.36,.375);
      controller.setWheelSuspensionStiffness(i,30); controller.setWheelSuspensionCompression(i,4.4); controller.setWheelSuspensionRelaxation(i,5.4);
      controller.setWheelMaxSuspensionTravel(i,.24); controller.setWheelMaxSuspensionForce(i,13000); controller.setWheelFrictionSlip(i,2.1); controller.setWheelSideFrictionStiffness(i,1.1);
    }
    const state: CarState = { id,kind,p:{x:0,y:0,z:0},q:quat(0),v:{x:0,y:0,z:0},av:{x:0,y:0,z:0},health:100,inflicted:0,damageLeft:0,damageRight:0,steering:0,speed:0,rpm:850,gear:1,wheels:[],input:{...NEUTRAL},passed:0,nextCheckpoint:1,lap:1,finished:false,finishTime:0,penalty:0,repair:0,surface:'gravel',slip:0,dents:[] };
    return {body,collider,roof,controller,state,stuck:0,reverse:0,roll:0,offTrack:0,lastRecovery:-100,checkpointDistance:Infinity};
  }
  private place(c: Car, x: number, z: number, yaw: number) {
    c.body.setTranslation({x,y:landscapeHeight(x,z)+.89,z},true); c.body.setRotation(quat(yaw),true);
    c.body.setLinvel({x:0,y:0,z:0},true); c.body.setAngvel({x:0,y:0,z:0},true); c.roll = c.stuck = c.offTrack = 0;
    this.readBody(c);
  }
  private spawn(c: Car) {
    if (this.mode === 'race') this.place(c, CHECKPOINTS[0].x+(c.state.id%2 ? 2.5 : -2.5)-Math.floor(c.state.id/2)*6, CHECKPOINTS[0].z, Math.PI/2);
    else { const a = c.state.id/MAX_PLAYERS*Math.PI*2; this.place(c,Math.sin(a)*32,Math.cos(a)*32,a+Math.PI); }
  }
  private readBody(c: Car) {
    c.state.p = {...c.body.translation()}; c.state.q = {...c.body.rotation()}; c.state.v = {...c.body.linvel()}; c.state.av = {...c.body.angvel()};
    c.state.wheels = Array.from({length:4},(_,i)=>({suspension:c.controller.wheelSuspensionLength(i)??.36,rotation:c.controller.wheelRotation(i)??0,contact:c.controller.wheelIsInContact(i)}));
  }
  start() { this.phase = 'countdown'; this.countdown = 3; }
  setInput(id: number, input: Controls) { this.cars[id].state.input = {...input}; }
  recover(id: number) {
    const c = this.cars[id], s = c?.state;
    if (!s || this.phase !== 'playing' || this.elapsed-c.lastRecovery<5 || (s.health<=0 && this.mode!=='playground')) return false;
    c.lastRecovery = this.elapsed;
    if (this.mode === 'playground') { s.health=100; s.damageLeft=s.damageRight=0; s.repair++;s.dents=[];this.damage=this.damage.filter(d=>d.car!==id);this.place(c,s.p.x,s.p.z,Math.atan2(s.v.x,s.v.z)); }
    else if (this.mode === 'race') { const p=CHECKPOINTS[(s.nextCheckpoint+23)%24], next=CHECKPOINTS[s.nextCheckpoint]; this.place(c,p.x,p.z,Math.atan2(next.x-p.x,next.z-p.z)); s.penalty+=5; }
    else { s.health=Math.max(1,s.health-8); const r=Math.hypot(s.p.x,s.p.z); this.place(c,s.p.x*Math.min(1,38/r),s.p.z*Math.min(1,38/r),Math.atan2(-s.p.x,-s.p.z)); }
    this.damageShape(c); return true;
  }
  private damageShape(c: Car) { const d=DEFINITIONS[c.state.kind],loss=100-c.state.health; c.collider.setHalfExtents({x:d.halfWidth-.06-loss*.0008,y:.25,z:d.halfLength-.12-loss*.0015}); }
  ai(c: Car): Controls {
    const s=c.state;
    if (s.health<=0 || s.finished) return {...NEUTRAL};
    let tx=0,tz=0;
    if (this.mode==='derby') {
      const targets=this.cars.filter(a=>a!==c && a.state.health>0).sort((a,b)=>Math.hypot(a.state.p.x-s.p.x,a.state.p.z-s.p.z)-Math.hypot(b.state.p.x-s.p.x,b.state.p.z-s.p.z));
      const target=targets[Math.floor((this.elapsed+s.id*1.79)/5)%Math.min(3,targets.length)]?.state;
      if (!target) return {...NEUTRAL};
      if (Math.hypot(s.p.x,s.p.z)<41) { tx=target.p.x+target.v.x*.35; tz=target.p.z+target.v.z*.35; }
    } else if(this.mode==='race') {const p=CHECKPOINTS[s.nextCheckpoint];tx=p.x+Math.sin(s.id*1.79)*2;tz=p.z+Math.cos(s.id*1.79)*2;}
    else {const p=trackPoint((this.elapsed*.011+s.id*.18)%1);tx=p.x;tz=p.z;}
    if(this.mode==='race'){
      const nearest=Math.min(...AI_TRACK.map(p=>Math.hypot(s.p.x-p.x,s.p.z-p.z)));
      c.offTrack=nearest>14?c.offTrack+STEP:0;
      if(c.offTrack>7||c.roll>4){this.recover(s.id);c.offTrack=0;}
    }
    const f=rotate({x:0,y:0,z:1},s.q),right=rotate({x:1,y:0,z:0},s.q), angle=wrap(Math.atan2(tx-s.p.x,tz-s.p.z)-Math.atan2(f.x,f.z));
    let steer=clamp(angle*1.65,-1,1),throttle=.8,brake=Math.abs(s.speed)>17&&Math.abs(angle)>.8?.5:0;
    if(this.mode==='race'){const desired=clamp(17-Math.abs(angle)*9,5,17);throttle=clamp((desired-s.speed)*.4,0,1);brake=clamp((s.speed-desired)/4,0,1);}
    c.stuck=Math.abs(s.speed)<1.2&&this.elapsed>2?c.stuck+STEP:0;
    if(c.stuck>1.8){c.reverse=1.5+s.id*.08;c.stuck=0;}
    if(c.reverse>0){c.reverse=Math.max(0,c.reverse-STEP);throttle=-.65;steer=-steer;brake=0;}
    if(c.roll>5)this.recover(s.id);
    if(this.mode!=='derby')for(const other of this.cars){if(other===c)continue;const o=other.state,d={x:o.p.x-s.p.x,y:o.p.y-s.p.y,z:o.p.z-s.p.z};
      const ahead=dot(d,f),side=dot(d,right),blocked=o.health===0||Math.abs(o.speed)<Math.abs(s.speed)-3;
      if(Math.hypot(d.x,d.y,d.z)<9&&ahead>0&&Math.abs(side)<3&&blocked)steer=clamp(steer+(side>0?-1:1)*.7,-1,1);
    }
    return {throttle,steer,brake,handbrake:false};
  }
  private drive(c:Car) {
    const s=c.state,d=DEFINITIONS[s.kind],alive=s.health>0, f=rotate({x:0,y:0,z:1},s.q),up=rotate({x:0,y:1,z:0},s.q);
    s.speed=dot(s.v,f);
    s.surface=surfaceAt(s.p.x,s.p.z);s.slip=Math.abs(dot(s.v,rotate({x:1,y:0,z:0},s.q)));
    const target=(alive?s.input.steer:0)*(.55/(1+Math.abs(s.speed)*.016))+(s.damageRight-s.damageLeft)*.0007;
    s.steering+=(target-s.steering)*(1-Math.exp(-8*STEP));
    const force=alive?s.input.throttle*d.force*(.45+.55*s.health/100)*clamp(1-Math.max(0,Math.abs(s.speed)-43)/10,0,1):0;
    for(let i=0;i<4;i++) {
      c.controller.setWheelSteering(i,i<2?s.steering:0); c.controller.setWheelEngineForce(i,force*(s.kind==='coupe'?(i>1?.5:0):.25));
      c.controller.setWheelBrake(i,!alive?18:s.input.brake*90+(s.input.handbrake&&i>1?100:0));
      c.controller.setWheelFrictionSlip(i,(surfaceAt(s.p.x,s.p.z)==='asphalt'?3.2:2.4)*(s.input.handbrake&&i>1?.6:1));
      c.controller.setWheelSuspensionStiffness(i,30-(i%2?s.damageRight:s.damageLeft)*.06);
    }
    c.controller.updateVehicle(STEP,undefined,undefined,co=>co.parent()?.handle!==c.body.handle);
    const av=c.body.angvel();
    if(up.y>.5) c.body.applyTorqueImpulse({x:-av.x*d.mass*.07*STEP,y:(clamp(s.speed/d.wheelbase*Math.tan(s.steering)*.72,-1.7,1.7)-av.y)*d.mass*2.6*STEP,z:-av.z*d.mass*.07*STEP},true);
    s.gear=s.speed<-.5?0:clamp(1+Math.floor(Math.max(0,s.speed)/9),1,5);s.rpm=alive?850+(Math.abs(s.speed)%9)/9*4600+Math.abs(s.input.throttle)*700:0;
    c.roll=up.y<.2?c.roll+STEP:0;
  }
  step(humans: Set<number>) {
    if(this.phase==='lobby'||this.phase==='result')return;
    this.tick++;
    if(this.phase==='countdown'){this.countdown-=STEP;if(this.countdown<=0)this.phase='playing';return;}
    this.elapsed+=STEP;
    for(const c of this.cars){if(!humans.has(c.state.id))c.state.input=this.ai(c);this.drive(c);}
    const impactVelocities=this.cars.map(c=>({...c.state.v}));
    this.world.step(this.queue);
    for(const c of this.cars)this.readBody(c);
    this.queue.drainContactForceEvents(e=>{
      const h1=e.collider1(),h2=e.collider2(),key=Math.min(h1,h2)+':'+Math.max(h1,h2);
      if(this.elapsed-(this.impacts.get(key)??-100)<.28)return;
      const damage=damageFromImpulse(e.totalForceMagnitude()*STEP)*(this.mode==='race'?.45:1);
      if(damage<.3)return;
      const a=this.cars.find(c=>c.collider.handle===h1||c.roof.handle===h1),b=this.cars.find(c=>c.collider.handle===h2||c.roof.handle===h2);if(!a&&!b)return;
      this.impacts.set(key,this.elapsed); let point={...(a??b)!.state.p};
      this.world.contactPair(this.world.getCollider(h1),this.world.getCollider(h2),m=>{if(m.numSolverContacts()>0)point={...m.solverContactPoint(0)};});
      for(const [car,other] of [[a,b],[b,a]])if(car&&car.state.health>0){
        const s=car.state,actual=Math.min(damage,s.health),direction=dir(other?impactVelocities[other.state.id]:{x:0,y:0,z:0},impactVelocities[s.id]);
        s.health=Math.max(0,s.health-damage);if(other)other.state.inflicted+=actual;
        const local=rotate({x:point.x-s.p.x,y:point.y-s.p.y,z:point.z-s.p.z},{x:-s.q.x,y:-s.q.y,z:-s.q.z,w:s.q.w});
        if(local.x<0)s.damageLeft+=damage;else s.damageRight+=damage;
        const localDirection=rotate(direction,{x:-s.q.x,y:-s.q.y,z:-s.q.z,w:s.q.w});
        const event={id:++this.damageId,tick:this.tick,car:s.id,point,direction,localPoint:local,localDirection,repair:s.repair,damage};
        this.damageShape(car);this.damage.push(event);
        (s.dents??=[]).push({id:event.id,localPoint:local,localDirection,damage,repair:s.repair});
        // Health is 100 and each accepted impact consumes > .3, so an intact
        // lifetime has at most 334 dents. Keep a defensive cap on restored data.
        s.dents=s.dents.slice(-334);
      }
    });
    // Repeat a bounded event history in snapshots to survive late packets/reconnects.
    this.damage=this.damage.filter(d=>this.tick-d.tick<600).slice(-128);
    for(const c of this.cars){const s=c.state;
      if(Math.hypot(s.p.x,s.p.z)>255||s.p.y< -8)this.recover(s.id);
      if(this.mode==='race'&&!s.finished){const check=advanceCheckpoint(s.p.x,s.p.z,s.nextCheckpoint,c.checkpointDistance);c.checkpointDistance=check.distance;
        if(check.passed){s.passed++;s.nextCheckpoint=(s.nextCheckpoint+1)%24;c.checkpointDistance=Infinity;if(s.nextCheckpoint===1){s.lap++;if(s.lap>3){s.finished=true;s.finishTime=this.elapsed+s.penalty;}}}}
    }
    if(this.mode==='derby'&&(this.elapsed>=300||this.cars.filter(c=>c.state.health>0).length<=1))this.phase='result';
    if(this.mode==='race'&&(this.elapsed>=900||this.cars.every(c=>c.state.finished||c.state.health<=0)))this.phase='result';
  }
  ranking(){return (this.mode==='derby'?derbyOrder(this.cars.map(c=>c.state)):[...this.cars.map(c=>c.state)].sort((a,b)=>a.finished&&b.finished?a.finishTime-b.finishTime:a.finished?-1:b.finished?1:b.passed-a.passed||Math.hypot(a.p.x-CHECKPOINTS[a.nextCheckpoint].x,a.p.z-CHECKPOINTS[a.nextCheckpoint].z)-Math.hypot(b.p.x-CHECKPOINTS[b.nextCheckpoint].x,b.p.z-CHECKPOINTS[b.nextCheckpoint].z))).map(c=>c.id);}
  snapshot(includeDamage=false): Omit<Snapshot,'members'|'ack'> {return {type:'snapshot',tick:this.tick,elapsed:this.elapsed,countdown:this.countdown,mode:this.mode,phase:this.phase,props:this.props.map(p=>({id:p.id,p:{...p.body.translation()},q:{...p.body.rotation()},v:{...p.body.linvel()},av:{...p.body.angvel()}})),cars:this.cars.map(c=>structuredClone({...c.state,dents:includeDamage?c.state.dents:undefined})),damage:structuredClone(this.damage),ranking:this.ranking()};}
  restore(s:Snapshot) {
    this.tick=s.tick;this.elapsed=s.elapsed;this.countdown=s.countdown;this.phase=s.phase;this.damage=structuredClone(s.damage);
    this.damageId=Math.max(0,...s.damage.map(d=>d.id),...s.cars.flatMap(c=>(c.dents??[]).map(d=>d.id)));
    for(const car of s.cars){const c=this.cars[car.id];c.state={...c.state,...structuredClone(car),surface:car.surface??surfaceAt(car.p.x,car.p.z),slip:car.slip??0};c.state.input={...NEUTRAL};c.body.setTranslation(car.p,true);c.body.setRotation(car.q,true);c.body.setLinvel(car.v,true);c.body.setAngvel(car.av,true);this.damageShape(c);}
    for(const p of s.props??[]){const prop=this.props[p.id];if(!prop)continue;prop.body.setTranslation(p.p,true);prop.body.setRotation(p.q,true);prop.body.setLinvel(p.v,true);prop.body.setAngvel(p.av,true);}
  }

  dispose(){this.queue.free();this.world.free();}
}
