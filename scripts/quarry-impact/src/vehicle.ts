import {tyreFeedback} from './tyre-feedback';
import {createVehicleDrive} from './drivetrain/chassis';
import {armorWearMultiplier} from './armor-wear';
import type {DrivingSurface} from './driving-surface';
import type {DrivingAssists} from './driving-assists';
import type {TransmissionInput,TransmissionState} from './transmission';
import {freshStructure} from './structural-damage';
import type {VehicleStructure} from './vehicle-structure';
import {VehicleDrawBatch} from './vehicle-draw-batch';
import {stalledByImpact} from './engine-stall';
import {cancelWreckNormals} from './wreck-batch';
import {markCollision} from './collision-scars';
import {BuggySuspension} from './buggy-suspension';
import {applyComponentImpact} from './component-damage';
import {tyreFailure,vehicleFlatTyreRadius} from './tyre-condition';
import {vehicleSuspensionRestLength,vehicleSuspensionTravel} from './vehicle-physics';
import {isClassicKind,classicWheelHalfTrack,vehicleWheelRadius,isRearEngineKind,isFrontDriveKind} from './classic-vehicle-specs';
import {createVehiclePhysics,stepVehiclePhysics,rotateVehicleVector} from './vehicle-physics';
import {LiveryPaint} from './livery-paint';
import type {VisualEvent} from './replay-data';
import {ImpactResponse} from './impact-response';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { cloneCar } from './assets';
import {
  DEFINITIONS,
  clamp,
  surfaceAt,
  type CarKind,
} from './rules';
import { Effects } from './effects';
import { landscapeHeight } from './quarry-layout';
import type { GlassState } from './car-materials';
import { repairCoupePanel } from './coupe-realism';
import { dentGeometry,crushGeometry,refreshWreckNormals,type CrushFrame, repairWreckGeometry } from './wreck-geometry';
import { WreckFinish } from './wreck-finish';
import { WreckAttachments } from './wreck-attachments';
import {bodyworkDentDamage} from './bodywork-response';
import {puddleDepth,type Puddle} from './puddle-splashes';
import {wheelResponse,TireContact} from './wheel-mechanics';
import {wheelTearsOff} from './wheel-physics';
import {EngineMisfire} from './engine-misfire';
import {steeringLimit,brakeFactor,overheat,leakTyre,damperFactor,gearLimit,blowoutImpulse,bentRimTyre,rimWobble} from './damage-handling';
import {leakRates,dripInterval} from './fluid-leaks';
/** Panels hanging at least this loose build wind load above this speed (m/s) until they tear away. */
export const WIND_RIP={loose:.25,speed:16} as const;
/** Deceleration (m/s²) from a part dragging along the ground at full scrape, applied where it drags. */
export const PART_DRAG=1.2;
/** A wheel touching down faster than speed (m/s, vertical) takes a hit from below: (fall - speed) * gain. */
export const HARD_LANDING={speed:7,gain:2.2,gap:.5} as const;
/** Offline part release: assembly thresholds scale and the smallest blow that can release a part. */
export const DETACH={threshold:.27,blow:4} as const;
/** Wheel centre caps pop off the first time a wheel's damage passes this level (offline). */
export const HUBCAP_POP=.3;
/** Wheel meshes are merged by material at load: caps live in the chrome / trim pieces. */
const HUBCAP=/brushed chrome|wheel trim|hub ?cap|centre ?cap|domed ?cap/i;
import {VehicleSurface} from './vehicle-surface';
import { normalizeSetup, setupPhysics, stockSetup, type Setup } from './garage';
export type VehicleGround = {height:(x:number,z:number)=>number;surface:(x:number,z:number)=>DrivingSurface};
export type Input = {
  throttle: number;
  steer: number;
  brake: number;
  handbrake: boolean;
  assists?:DrivingAssists;
  transmission?:TransmissionInput;
};
export class Vehicle {
  readonly drivetrain?:ReturnType<typeof createVehicleDrive>;
  remoteWheelAngles?:number[];
  remoteContactPoints?:(T.Vector3|null)[];
  readonly wheelSlips=[0,0,0,0];
  wheelAngle(index:number){return this.remoteWheelAngles?.[index]??this.drivetrain?.wheels[index]?.angle??this.controller.wheelRotation(index)??0;}
  private drawBatch?:VehicleDrawBatch;
  syncDrawBatch(){this.drawBatch??=new VehicleDrawBatch(this.root);this.drawBatch.sync();}
  get drawBatchStats(){return{batches:this.drawBatch?.batches.length??0,panels:this.drawBatch?.batches.reduce((n,b)=>n+b.parts.length,0)??0};}
  readonly suspension?:BuggySuspension;
  syncSuspension(){this.suspension?.update();}
  onVisualEvent?: (event:VisualEvent)=>void;
  private visualPose(){return [...this.current.toArray(),...this.currentQ.toArray()];}
  readonly structure:VehicleStructure;
  structuralDamage:number[]|undefined=freshStructure();
  body: R.RigidBody;
  collider: R.Collider;
  roof: R.Collider;
  controller: R.DynamicRayCastVehicleController;
  root = new T.Group();
  model: T.Group;
  readonly wreckFinish: WreckFinish;
  readonly wreckParts: WreckAttachments;
  readonly tireContacts:TireContact[];
  /** Replays and network views supply wheel poses without stepping a controller. */
  syncTyres(){
    this.tireContacts.forEach((contact,i)=>{
      const damage=this.tyreDamage?.[i];
      contact.setCondition(damage===undefined?undefined:{failure:tyreFailure(damage),radius:wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),damage,vehicleFlatTyreRadius(this.kind)).radius,baseRadius:wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),0,vehicleFlatTyreRadius(this.kind)).radius});
    });
  }
  readonly paintColor:T.Color;
  readonly livery:LiveryPaint;
  readonly surfaceFinish:VehicleSurface;
  private wetWheels=[false,false,false,false];
  private groundedWheels=[false,false,false,false];
  scraping=0;
  wheels: T.Object3D[] = [];
  panels: T.Mesh[] = [];
  readonly impactResponse = new ImpactResponse();
  impactEffects = {glass:false,debris:false};
  glass: T.Mesh[] = [];
  brakeLights = new Set<T.MeshStandardMaterial>();
  health = 100;
  /** Undefined only for an older online authority without component condition. */
  engineDamage:number|undefined = 0;
  engineStall:number|undefined = 0;
  /** Missing on legacy snapshots/replays: do not infer flats from bent wheels. */
  tyreDamage:number[]|undefined = [0,0,0,0];
  inflicted = 0;
  speed = 0;
  rpm = 850;
  gear = 1;
  transmission?:TransmissionState;
  oldGear = 1;
  steering = 0;
  input: Input = { throttle: 0, steer: 0, brake: 0, handbrake: false };
  slip = 0;
  remoteGrounded?: boolean;
  surface:DrivingSurface = 'gravel';
  damageLeft = 0;
  /** Wrecked wheels can be torn off (offline events and replays recorded with wheelModel 1). */
  extendedDamage = false;
  readonly engineMisfire:EngineMisfire;
  misfireFactor = 1;
  steerLimit = 1;
  readonly brakeBias = [1,1,1,1];
  readonly damperBias = [1,1,1,1];
  /** Gears left after gearbox damage (offline only; 5 = intact). */
  gearLimit = 5;
  /** Grip left under each tyre from oil or coolant on the ground (offline only). */
  readonly slickGrip = [1,1,1,1];
  /** How oily each tyre is after rolling through a slick; it lays dark tread marks until it wears off. */
  readonly oily = [0,0,0,0];
  private dripClock = [0,0];
  private dripSeed = 1;
  /** Fluid drips this car has left (oil, coolant). */
  readonly drips = [0,0];
  /** Replay recording hook for each drip. */
  onDrip?:(x:number,y:number,z:number,kind:0|1,seed:number)=>void;
  onBackfire?:(point:T.Vector3)=>void;
  onWheelLost?:(wheel:number)=>void;
  private windLoad=new Map<string,number>();
  private readonly tyreBurst=[false,false,false,false];
  /** Tyres whose blowout has already snatched the car (offline only). */
  readonly blownOut=[false,false,false,false];
  /** Sound hook for a tyre bursting at speed. */
  onBlowout?:(p:T.Vector3)=>void;
  private readonly lastFailure=[0,0,0,0];
  private dragLoad=0;private readonly dragPoint=new T.Vector3();
  private crushFrame?:CrushFrame;
  private readonly poppedCaps:T.Mesh[]=[];
  private readonly crushPending=new Set<T.Mesh>();
  private lastLanding=-10;private readonly wasGrounded=[true,true,true,true];
  /** Live counts for diagnostics. */
  rips=0;backfires=0;
  damageRight = 0;
  readonly damageZones={front:0,rear:0,left:0,right:0,roof:0};
  arenaSurface?:{x:number;z:number;radius:number};
  waters:Puddle[]=[];
  stuck = 0;
  reverse = 0;
  target = 0;
  nextCheckpoint = 1;
  checkpointDistance = Infinity;
  passed = 0;
  lap = 1;
  finished = false;
  finishTime = 0;
  penalty = 0;
  lastHit = -100;
  lastDamage = 0;
  impactSerial = 0;
  lastFx = 0;
  rollTime = 0;
  offTrackTime = 0;
  previous = new T.Vector3();
  previousQ = new T.Quaternion();
  current = new T.Vector3();
  currentQ = new T.Quaternion();
  velocity = new T.Vector3();
  forward = new T.Vector3();
  right = new T.Vector3();
  wheelSpin = 0;
  aiPhase: number;
  readonly setup: Setup;
  readonly specification: ReturnType<typeof setupPhysics>;
  constructor(
    public id: number,
    public kind: CarKind,
    color: number,
    public scene: T.Scene,
    public world: R.World,
    public fx: Effects,
    setup?: Setup,
    readonly ground:VehicleGround = {height:landscapeHeight,surface:surfaceAt},
    readonly driveModel:'legacy'|'angular-v1'='legacy',
  ) {
    this.setup = normalizeSetup(setup ?? stockSetup(kind), kind);
    this.specification = setupPhysics(kind, this.setup);
    const def = {...DEFINITIONS[kind], mass:this.specification.mass};
    this.aiPhase = id * 1.79;
    this.engineMisfire = new EngineMisfire(id * 7.31 + 0.4);
    this.model = cloneCar(kind, color, this.setup.armor);
    this.paintColor=new T.Color(color);
    this.root.add(this.model);
    scene.add(this.root);
    const physical=createVehiclePhysics(R,world,kind,def.mass,this.setup.armor);
    this.structure=physical.structure;this.body=physical.body;this.collider=physical.collider;this.roof=physical.roof;this.controller=physical.controller;
    if(driveModel==='angular-v1')this.drivetrain=createVehicleDrive(this.body,this.controller,kind);
    for(const name of ['FL','FR','RL','RR'])this.wheels.push(this.model.getObjectByName('wheel_'+name)!);
    this.model.traverse((o) => {
      if (o instanceof T.Mesh) {
        if (o.name.startsWith('panel_')) this.panels.push(o);
        if (o.name.startsWith('glass_')) this.glass.push(o);
        const mat = o.material as T.MeshStandardMaterial;
        if (mat.name.includes('Brakelight')) this.brakeLights.add(mat);
      }
    });
    this.wreckFinish = new WreckFinish(this.model,def.halfLength,kind==='marten'?new T.Vector3(0,.84,-1.56):kind==='buggy'?new T.Vector3(0,.67,-1.4):undefined);
    this.wreckParts = new WreckAttachments(this.model,this.wheels,def.halfWidth,vehicleWheelRadius(kind));
    if(kind==='buggy')this.suspension=new BuggySuspension(this.model);
    this.tireContacts=this.wheels.map(w=>new TireContact(w,kind,vehicleWheelRadius(kind)));
    this.surfaceFinish=new VehicleSurface(this.model,id);
    this.livery=new LiveryPaint(this.model);this.livery.onPrepared=()=>{this.drawBatch?.dispose();this.drawBatch=undefined;};this.livery.set(this.setup.livery);
    if(setup)this.setPaint(this.setup.paint,this.setup.trim);
  }
  setPaint(paint: number, trim: number) {
    this.paintColor.setHex(paint);
    this.model.traverse(o=>{
      if(!(o instanceof T.Mesh))return;
      for(const m of Array.isArray(o.material)?o.material:[o.material]) {
        if(m instanceof T.MeshStandardMaterial && m.name.startsWith('paint'))m.color.setHex(m.name.includes('Paint 2')?trim:paint);
      }
    });
  }
  place(x: number, z: number, yaw: number, repair = false) {
    const p = { x, y: this.ground.height(x, z) + 0.89, z };
    const q = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw);
    this.body.setTranslation(p, true);
    this.body.setRotation(q, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.previous.copy(p);
    this.current.copy(p);
    this.previousQ.copy(q);
    this.currentQ.copy(q);
    this.root.position.copy(p);
    this.root.quaternion.copy(q);
    this.wheelSlips.fill(0);this.drivetrain?.reset();
    if(this.drivetrain){this.transmission=undefined;this.gear=1;this.rpm=this.engineStall!>0||this.health<=0?0:850;this.speed=0;this.slip=0;}
    this.rollTime = 0;
    this.stuck = 0;
    this.onVisualEvent?.({kind:'jump',pose:this.visualPose()});
    if (repair) this.repair();
  }
  repair() {
    this.onVisualEvent?.({kind:'repair',pose:this.visualPose()});
    this.wreckFinish.reset();
    this.wreckParts.reset();
    this.suspension?.reset();
    this.surfaceFinish.reset();
    this.impactResponse.reset();
    this.impactEffects = {glass:false,debris:false};
    this.wheelSlips.fill(0);
    this.health = 100;
    this.engineDamage = 0;
    this.transmission=undefined;this.gear=1;
    this.engineStall = 0;
    this.engineMisfire.reset();this.misfireFactor=1;this.windLoad.clear();this.tyreBurst.fill(false);this.blownOut.fill(false);this.lastFailure.fill(0);this.dragLoad=0;this.lastLanding=-10;this.crushPending.clear();for(const cap of this.poppedCaps)cap.visible=true;this.poppedCaps.length=0;this.wasGrounded.fill(true);this.steerLimit=1;this.gearLimit=5;this.brakeBias.fill(1);this.damperBias.fill(1);this.slickGrip.fill(1);this.oily.fill(0);this.dripClock.fill(0);this.drips.fill(0);this.dripSeed=this.id*7919+1;
    if(this.drivetrain){const v=this.body.linvel(),f=rotateVehicleVector({x:0,y:0,z:1},this.body.rotation());this.drivetrain.reset(v.x*f.x+v.y*f.y+v.z*f.z);this.rpm=850;}
    this.tyreDamage = [0,0,0,0];
    this.tireContacts.forEach(contact=>contact.reset());
    this.damageLeft = this.damageRight = 0;
    for(const zone of Object.keys(this.damageZones)as (keyof typeof this.damageZones)[])this.damageZones[zone]=0;
    this.lastHit = -100;
    this.lastDamage = 0;
    this.scraping=0;
    this.impactSerial = 0;
    for(let i=0;i<4;i++){
      const d=DEFINITIONS[this.kind];
      this.controller.setWheelChassisConnectionPointCs(i,{x:isClassicKind(this.kind)?(i%2?1:-1)*classicWheelHalfTrack(this.kind):(i%2?1:-1)*(d.halfWidth-.04),y:-.12,z:(i<2?1:-1)*d.wheelbase/2});
      this.controller.setWheelSuspensionRestLength(i,vehicleSuspensionRestLength(this.kind));this.controller.setWheelMaxSuspensionTravel(i,vehicleSuspensionTravel(this.kind));this.controller.setWheelRadius(i,vehicleWheelRadius(this.kind));
      this.controller.setWheelMaxSuspensionForce(i,13000);this.controller.setWheelSuspensionStiffness(i,30);
      this.controller.setWheelSideFrictionStiffness(i,1.1);this.controller.setWheelAxleCs(i,{x:-1,y:0,z:0});
      this.controller.setWheelSteering(i,0);this.controller.setWheelBrake(i,0);
    }
    this.roof.setEnabled(true);
    this.structuralDamage=freshStructure();this.structure.update(this.structuralDamage);
    for (const p of this.panels) {
      cancelWreckNormals(p);
      p.visible = true;
      p.userData.damage = 0;
      (p.geometry.attributes.position.array as Float32Array).set(
        p.userData.original,
      );
      p.geometry.attributes.position.needsUpdate = true;
      if (p.userData.originalNormals) {
        (p.geometry.attributes.normal.array as Float32Array).set(p.userData.originalNormals);
        p.geometry.attributes.normal.needsUpdate = true;
      } else p.geometry.computeVertexNormals();
      p.geometry.computeBoundingBox();p.geometry.computeBoundingSphere();
      const wear = p.geometry.attributes.impactWear;
      if (wear) { (wear.array as Float32Array).fill(0); wear.needsUpdate = true; }
      repairCoupePanel(p);
      p.userData.engineShift?.set(0,0,0);
      if(p.geometry.attributes.transferPaint){(p.geometry.attributes.transferPaint.array as Float32Array).fill(0);p.geometry.attributes.transferPaint.needsUpdate=true;}
      p.geometry.deleteAttribute('color');
      (p.material as T.MeshStandardMaterial).vertexColors = false;
      (p.material as T.Material).needsUpdate = true;
    }
    for (const g of this.glass) {
      repairWreckGeometry(g);
      g.visible = true;
      g.userData.damage = 0;
      (g.material as T.MeshStandardMaterial).opacity = isClassicKind(this.kind) ? .55 : this.kind === 'coupe' ? .24 : .28;
      const state = (g.material as T.Material).userData.glassState as GlassState | undefined;
      if (state) state.damage.value = 0;
    }
  }
  /** Leaks drip onto the ground under the radiator (coolant) and the engine (oil); every tyre reads
   * the slicks under its last contact point, and picks up oil that it then tracks along. */
  private fluids(dt:number){
    const slicks=this.fx.slicks;if(!slicks)return;
    let contacts=0,groundSum=0;
    for(let i=0;i<4;i++){
      const point=this.wreckParts.wheelLost[i]?null:this.controller.wheelContactPoint(i);
      if(!point||!this.controller.wheelIsInContact(i)){this.slickGrip[i]=1;continue;}
      contacts++;groundSum+=point.y;
      const grip=slicks.gripAt(point.x,point.z);this.slickGrip[i]=grip;
      if(grip<.97)this.oily[i]=Math.max(this.oily[i],Math.min(1,(1-grip)*2));
      else this.oily[i]=Math.max(0,this.oily[i]-Math.abs(this.speed)*dt/14);
    }
    if(!contacts||!this.structuralDamage)return;
    const rates=leakRates(this.structuralDamage[0],this.engineDamage??0),half=DEFINITIONS[this.kind].halfLength,ground=groundSum/contacts;
    for(const kind of [0,1] as const){
      const interval=dripInterval(kind===0?rates.oil:rates.coolant);if(!Number.isFinite(interval)){this.dripClock[kind]=0;continue;}
      this.dripClock[kind]+=dt;if(this.dripClock[kind]<interval)continue;this.dripClock[kind]-=interval;
      this.dripSeed=(Math.imul(this.dripSeed,1664525)+1013904223)>>>0;const r=this.dripSeed/4294967296;
      const z=(kind===1||!isRearEngineKind(this.kind)?1:-1)*half*(kind===1?.62:.42)+(r-.5)*.3,x=(r*7%1-.5)*.4;
      const p=new T.Vector3(x,0,z).applyQuaternion(this.previousQ).add(this.previous);
      slicks.drip(p.x,ground,p.z,kind,r);this.drips[kind]++;this.onDrip?.(p.x,ground,p.z,kind,r);
    }
  }
  preStep(dt: number) {
    this.previous.copy(this.body.translation());
    this.previousQ.copy(this.body.rotation());
    this.velocity.copy(this.body.linvel());
    this.forward.set(0, 0, 1).applyQuaternion(this.previousQ);
    this.right.set(1, 0, 0).applyQuaternion(this.previousQ);
    this.speed = this.velocity.dot(this.forward);
    const lateral = this.velocity.dot(this.right);
    this.slip = Math.abs(lateral);
    this.surface = this.ground.surface(this.previous.x, this.previous.z);
    if(this.arenaSurface&&Math.hypot(this.previous.x-this.arenaSurface.x,this.previous.z-this.arenaSurface.z)<this.arenaSurface.radius)this.surface='gravel';
    this.oldGear=this.gear;
    const running=this.extendedDamage&&this.health>0&&!(this.engineStall!>0);
    if(running&&this.engineDamage!==undefined&&this.structuralDamage)this.engineDamage=overheat(this.engineDamage,this.structuralDamage[0],this.input.throttle,dt);
    this.misfireFactor=running?this.engineMisfire.update(dt,this.engineDamage??0,this.input.throttle):1;
    this.steerLimit=this.extendedDamage?steeringLimit(this.structuralDamage):1;
    this.gearLimit=this.extendedDamage?gearLimit(this.structuralDamage,isFrontDriveKind(this.kind)?'front':(this.kind==='coupe'||isClassicKind(this.kind)&&this.kind!=='trail')?'rear':'all'):5;
    for(let i=0;i<4;i++){this.brakeBias[i]=this.extendedDamage?brakeFactor(this.wreckParts.wheelDamage[i]):1;this.damperBias[i]=this.extendedDamage?damperFactor(this.wreckParts.wheelDamage[i]):1;}
    if(this.extendedDamage)this.fluids(dt);
    if(this.extendedDamage&&this.tyreDamage)for(let i=0;i<4;i++)if(!this.wreckParts.wheelLost[i])this.tyreDamage[i]=leakTyre(bentRimTyre(this.tyreDamage[i],this.wreckParts.wheelDamage[i]),this.speed,dt);
    if(this.extendedDamage&&this.tyreDamage)for(let i=0;i<4;i++){
      // Only a sudden failure (a hit) bursts; a slow puncture going flat just sags.
      const failure=tyreFailure(this.tyreDamage[i]),was=this.lastFailure[i];this.lastFailure[i]=failure;
      if(this.blownOut[i]||this.wreckParts.wheelLost[i]||failure<.9||was>=.65)continue;
      this.blownOut[i]=true;
      // The burst corner drags back and sideways at the moment it lets go: the car snatches toward it.
      const {drag,side}=blowoutImpulse(this.specification.mass,this.speed),at=this.controller.wheelChassisConnectionPointCs(i);
      if(drag>0&&at){
        const p=new T.Vector3(at.x,at.y,at.z).applyQuaternion(this.previousQ).add(this.previous),back=-Math.sign(this.speed),out=i%2?1:-1;
        this.body.applyImpulseAtPoint({x:this.forward.x*back*drag+this.right.x*out*side,y:0,z:this.forward.z*back*drag+this.right.z*out*side},{x:p.x,y:p.y,z:p.z},true);
        this.onBlowout?.(p);
      }
    }
    if(this.extendedDamage&&this.dragLoad>0&&Math.abs(this.speed)>1){
      // The dragging part acts as a brake where it touches the ground, so it also pulls to that side.
      const k=-Math.sign(this.speed)*this.specification.mass*PART_DRAG*this.dragLoad*dt;
      this.body.applyImpulseAtPoint({x:this.forward.x*k,y:0,z:this.forward.z*k},{x:this.dragPoint.x,y:this.dragPoint.y,z:this.dragPoint.z},true);
    }
    if(this.engineMisfire.backfire&&this.extendedDamage){
      // A misfire ends with unburnt fuel popping in the exhaust: a flash of sparks and a puff of smoke.
      const exhaust=new T.Vector3(0,.32,-DEFINITIONS[this.kind].halfLength).applyQuaternion(this.previousQ).add(this.previous);
      this.fx.emit(exhaust,7,1,.8);this.fx.emit(exhaust,2,2,.5);this.onBackfire?.(exhaust);this.backfires++;
    }
    if(this.drivetrain){
      const result=this.drivetrain.step(this.specification,this,dt,undefined,{wheelDamage:this.wreckParts.wheelDamage,wheelShift:this.wreckParts.wheelShift,engineDamage:this.engineDamage,tyreDamage:this.tyreDamage,wheelLost:this.wreckParts.wheelLost});
      // Only grounded tire slip creates skid audio, marks and surface effects.
      this.wheelSlips.splice(0,4,...result.contactSlips);this.slip=Math.max(this.slip,...this.wheelSlips);
    }else{stepVehiclePhysics(this.body,this.controller,this.kind,this.specification,this,dt,this.wreckParts.wheelDamage,this.wreckParts.wheelShift,this.engineDamage,this.tyreDamage,false,this.wreckParts.wheelLost);this.wheelSlips.fill(this.slip);}
  }
  postStep(dt: number, time: number) {
    this.current.copy(this.body.translation());
    this.currentQ.copy(this.body.rotation());
    const up = new T.Vector3(0, 1, 0).applyQuaternion(this.currentQ);
    this.rollTime = up.y < 0.2 ? this.rollTime + dt : 0;
    this.root.position.copy(this.current);
    this.root.quaternion.copy(this.currentQ);
    const fall=-this.velocity.y;let landing=-1;
    for(let i=0;i<4;i++){
      const point=this.controller.wheelContactPoint(i);
      this.wasGrounded[i]=this.groundedWheels[i];
      this.groundedWheels[i]=this.controller.wheelIsInContact(i);
      if(this.extendedDamage&&!this.wasGrounded[i]&&this.groundedWheels[i]&&point&&fall>HARD_LANDING.speed&&landing<0)landing=i;
      this.wetWheels[i]=!!point&&this.groundedWheels[i]&&this.waters.some(w=>puddleDepth(w,point.x,point.y,point.z)>0);
    }
    this.surfaceFinish.advance(dt,this.speed,this.surface!=='asphalt',this.wetWheels,this.groundedWheels);
    if(landing>=0&&time-this.lastLanding>HARD_LANDING.gap&&this.health>0){
      // A heavy landing bottoms out that corner: the suspension, wheel and underside take the blow.
      this.lastLanding=time;const p=this.controller.wheelContactPoint(landing)!,up=new T.Vector3(0,1,0).applyQuaternion(this.currentQ);
      this.hit(new T.Vector3(p.x,p.y,p.z).addScaledVector(up,.3),up,(fall-HARD_LANDING.speed)*HARD_LANDING.gain,time);
    }
    if (time - this.lastFx > 0.06) {
      this.lastFx = time;
      this.scraping=0;this.dragLoad=0;
      // A few crushed panels per tick get fresh normals, so a big crush never costs one long frame.
      const budget=performance.now()+1.2;let refreshed=0;for(const mesh of this.crushPending){this.crushPending.delete(mesh);if(mesh.visible)refreshWreckNormals(mesh);if(++refreshed>=3||performance.now()>budget)break;}
      for (let i = 0; i < 4; i++) {
        const point = this.controller.wheelContactPoint(i);
        if (!point || !this.controller.wheelIsInContact(i)) continue;
        const p = new T.Vector3().copy(point);
        const wet=this.surfaceFinish.water[i],yaw=Math.atan2(this.forward.x,this.forward.z);
        if(this.wreckParts.wheelLost[i]){
          // The bare hub grinds on the ground: sparks, a gouge and the scrape sound.
          if(Math.abs(this.speed)>1.5){const s=Math.min(1,Math.abs(this.speed)/10);this.scraping=Math.max(this.scraping,s);this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.08,s,2);this.fx.emit(p,Math.ceil(s*3),1,.9);}
          continue;
        }
        if(wet>.035&&Math.abs(this.speed)>.5&&!this.wetWheels[i]&&Math.abs(p.y-this.ground.height(p.x,p.z))<.15)this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.07,wet,0);
        else if(this.oily[i]>.05&&Math.abs(this.speed)>.5)this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.07,this.oily[i]*.9,0);
        const failure=tyreFailure(this.tyreDamage?.[i]);
        if(failure>=.9&&!this.tyreBurst[i]){this.tyreBurst[i]=true;this.fx.emit(p,10,4,1.1);}
        if(failure>=.9&&Math.abs(this.speed)>4&&this.surface==='asphalt'&&!this.wetWheels[i]){
          // Running on the rim: a spray of sparks and a scrape.
          const s=Math.min(1,Math.abs(this.speed)/18);this.scraping=Math.max(this.scraping,s*.55);this.fx.emit(p,Math.ceil(s*2),1,.7);
        }
        if(this.wetWheels[i])continue;
        const feedback=tyreFeedback(this.surface,this.speed,this.wheelSlips[i],this.input.handbrake,i,true);
        if(feedback.count)this.fx.emit(p,feedback.count,feedback.type,feedback.force);
        if(feedback.skid){
          if(this.surface==='asphalt')this.fx.mark(p,yaw,feedback.markLength);
          else this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.07,feedback.evidence,1);
        }
      }
      if(this.wreckParts.assemblies.some(a=>a.name.includes('bumper')&&a.loose>.55))this.model.updateWorldMatrix(true,true);
      for(const a of this.wreckParts.assemblies){
        if(!a.name.includes('bumper')||a.loose<.55||!a.members.some(m=>m.mesh.visible))continue;
        const p=a.bounds.getCenter(new T.Vector3());p.y=a.bounds.min.y-a.loose*.19;p.x+=a.side*this.wreckPartsWidth();p.applyMatrix4(this.model.matrixWorld);
        const ground=this.ground.height(p.x,p.z);
        if(p.y>ground+.07||Math.abs(this.speed)<1)continue;
        this.scraping=Math.min(1,a.loose*Math.abs(this.speed)/12);p.y=ground;
        if(this.scraping>this.dragLoad){this.dragLoad=this.scraping;this.dragPoint.copy(p);}
        this.fx.evidence?.add(p,Math.atan2(this.forward.x,this.forward.z),Math.abs(this.speed)*.08,this.scraping,2);
        if(this.scraping>.25)this.fx.emit(p,1,1,.8);
      }
      if(this.extendedDamage)for(const a of this.wreckParts.assemblies){
        if(a.loose<WIND_RIP.loose||!a.members.some(m=>m.mesh.visible))continue;
        const speed=Math.abs(this.speed),before=this.windLoad.get(a.name)??0;
        const load=speed>WIND_RIP.speed?before+.06*(speed-WIND_RIP.speed)/8*a.loose:Math.max(0,before-.06);
        if(load>=1){this.windLoad.delete(a.name);this.ripAssembly(a.name);}else this.windLoad.set(a.name,load);
      }
    }
  }
  render(alpha: number) {
    this.root.position.lerpVectors(this.previous, this.current, alpha);
    this.root.quaternion.slerpQuaternions(this.previousQ, this.currentQ, alpha);
    for (const material of this.brakeLights) material.emissiveIntensity = this.input.brake > .05 || this.input.handbrake ? 3.5 : .8;
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      if (!w||this.wreckParts.wheelLost[i]) continue;
      w.position.y =
        -this.model.position.y - 0.12 - (this.controller.wheelSuspensionLength(i) ?? vehicleSuspensionRestLength(this.kind));
      const tyre=this.tyreDamage?.[i],corner=wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),tyre,vehicleFlatTyreRadius(this.kind));
      w.rotation.set(0,(i<2?this.steering:0)+corner.toe,0);
      w.rotateX(-this.wheelAngle(i));
      // A bent rim runs out of true: tilted in its own spinning frame, the wheel visibly wobbles as it turns.
      if(this.extendedDamage)w.rotateZ(rimWobble(this.wreckParts.wheelDamage[i]));
      const coating=this.surfaceFinish.coating.value;
      this.tireContacts[i].update(this.controller,i,this.specification.mass,this.wreckParts.wheelDamage[i],i%2?coating.w:coating.z,tyre===undefined?undefined:{failure:tyreFailure(tyre),radius:corner.radius,baseRadius:wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),0,vehicleFlatTyreRadius(this.kind)).radius});
    }
    this.syncSuspension();
  }
  private wreckPartsWidth(){return DEFINITIONS[this.kind].halfWidth*.62;}
  scar(point:T.Vector3,direction:T.Vector3,otherPaint?:T.Color){
    this.root.updateMatrixWorld(true);
    const contact=this.model.worldToLocal(point.clone()),axis=direction.clone().transformDirection(this.model.matrixWorld.clone().invert());
    if(!markCollision(this.panels,contact,axis,this.surfaceFinish,otherPaint))return false;
    if(this.onVisualEvent){const inverse=this.root.quaternion.clone().invert();this.onVisualEvent({kind:'hit',pose:[...this.root.position.toArray(),...this.root.quaternion.toArray()],point:point.clone().sub(this.root.position).applyQuaternion(inverse).toArray(),direction:direction.clone().applyQuaternion(inverse).toArray(),damage:0,health:this.health,scar:true,...(otherPaint?{paint:otherPaint.getHex()}:{})});}
    return true;
  }
  collisionHit(point:T.Vector3,direction:T.Vector3,damage:number,time:number,otherPaint?:T.Color){
    const p=this.body.translation(),q=this.body.rotation(),inverse={x:-q.x,y:-q.y,z:-q.z,w:q.w};
    const local=rotateVehicleVector({x:point.x-p.x,y:point.y-p.y,z:point.z-p.z},inverse);
    const factor=armorWearMultiplier(this.kind,this.structuralDamage,local,rotateVehicleVector(direction,inverse),this.specification.damageScale);
    this.hit(point,direction,damage*factor,time,false,otherPaint);
  }
  hit(point: T.Vector3, direction: T.Vector3, damage: number, time: number, quiet = false,otherPaint?:T.Color) {
    damage *= this.specification.damageScale;
    this.impactEffects = {glass:false,debris:false};
    if (damage < 0.1 || this.health <= 0) return;
    if(this.onVisualEvent){const inverse=this.root.quaternion.clone().invert();this.onVisualEvent({kind:'hit',pose:[...this.root.position.toArray(),...this.root.quaternion.toArray()],point:point.clone().sub(this.root.position).applyQuaternion(inverse).toArray(),direction:direction.clone().applyQuaternion(inverse).toArray(),damage:damage/this.specification.damageScale,health:this.health,...(otherPaint?{paint:otherPaint.getHex()}:{})});}
    this.health = Math.max(0, this.health - damage);
    this.lastHit = time;
    this.lastDamage = damage;
    this.impactSerial++;
    if (!quiet) this.impactResponse.kick(direction,damage,direction.dot(this.right),direction.dot(this.forward));
    this.root.updateMatrixWorld(true);
    // Use the same quaternion arithmetic as the authority for mechanical damage.
    // Matrix inversion differences can accumulate into different wheel forces.
    // The rendered pose also supports replay hits while its body is disabled.
    const q=this.root.quaternion,p=this.root.position,inverse={x:-q.x,y:-q.y,z:-q.z,w:q.w};
    const local=rotateVehicleVector({x:point.x-p.x,y:point.y-p.y,z:point.z-p.z},inverse);
    const components={structure:this.structuralDamage,engineDamage:this.engineDamage,tyreDamage:this.tyreDamage,wheelDamage:Array.from(this.wreckParts.wheelDamage),wheelShift:this.wreckParts.wheelShift.map(v=>({x:v.x,y:v.y,z:v.z}))};
    const worn=Array.from(this.wreckParts.wheelDamage),structureBefore=this.extendedDamage?this.structuralDamage?.slice():undefined;
    applyComponentImpact(components,this.kind,local,rotateVehicleVector(direction,inverse),damage);
    if (local.x < 0) this.damageLeft += damage;
    else this.damageRight += damage;
    const contact = this.model.worldToLocal(point.clone());
    const zone=contact.y>(this.kind==='trail'?1.85:this.kind==='shuttle'?2.30:this.kind==='van'?1.76:this.kind==='cornet'?2.28:this.kind==='hollins'?1.66:1.35)?'roof':contact.z>DEFINITIONS[this.kind].halfLength*.35?'front':contact.z<-DEFINITIONS[this.kind].halfLength*.35?'rear':contact.x<0?'left':'right';
    this.damageZones[zone]+=damage;
    const dentDamage=bodyworkDentDamage(damage);
    const impactDirection = direction.clone().transformDirection(this.model.matrixWorld.clone().invert());
    const assemblies = new Map<string, { panels: T.Mesh[]; damage: number; weight: number }>();
    for (const panel of this.panels) {
      if (!panel.visible) continue;
      const maximum = dentGeometry(panel, contact, impactDirection, dentDamage);
      panel.userData.damage = (panel.userData.damage || 0) + dentDamage * maximum;
      if(maximum>0)this.surfaceFinish.transfer(panel,contact,damage,otherPaint);
      const assembly = panel.userData.detachAssembly as string | null;
      if (assembly) {
        if (!assemblies.has(assembly)) assemblies.set(assembly, { panels: [], damage: 0, weight: 0 });
        const group = assemblies.get(assembly)!;
        group.panels.push(panel);
        group.damage = Math.max(group.damage, panel.userData.damage);
        group.weight = Math.max(group.weight, maximum);
      }
    }
    // Finish deforming every member before releasing any of them. Grilles,
    // mirror inserts and bonnet vents cannot remain suspended over a wreck.
    for (const [name, group] of assemblies) {
      // Offline destruction lets parts break away sooner (DETACH): Wreckfest-style showers of panels.
      const threshold = (name === 'hood' ? 48 : name.startsWith('mirror') ? 22 : name==='rear-bumper' ? 28 : 32)*(this.extendedDamage?DETACH.threshold:1);
      if (group.damage <= threshold || damage <= (this.extendedDamage?DETACH.blow:7) || group.weight <= .18) continue;
      for (const panel of group.panels) {
        if (quiet) panel.visible = false;
        else this.fx.detach(panel, this.velocity.clone().multiplyScalar(.65));
      }
      if (!quiet) this.impactEffects.debris = true;
    }
    for (const glass of this.glass) {
      if (!glass.visible) continue;
      dentGeometry(glass, contact, impactDirection, dentDamage);
      const bounds = new T.Box3().setFromObject(glass);
      const distance = bounds.distanceToPoint(point);
      if (distance < 1.25 && damage > 3) {
        const before = glass.userData.damage || 0;
        glass.userData.damage = before + damage * (1 - distance / 1.25);
        if (before < 7 && glass.userData.damage >= 7 || before <= 24 && glass.userData.damage > 24) this.impactEffects.glass = true;
        const mat = glass.material as T.MeshPhysicalMaterial;
        const state = mat.userData.glassState as GlassState | undefined;
        if (state) {
          state.damage.value = Math.min(1, glass.userData.damage / 24);
          state.impact.value.copy(glass.worldToLocal(point.clone()));
        }
        const laminated = /Windshield|Rearwindow/.test(glass.name);
        // Laminated screens retain their shattered sheet. Tempered side glass
        // cracks first, then releases fragments on a second substantial blow.
        if (!laminated && glass.userData.damage > 24) glass.visible = false;
        if (!quiet) this.fx.emit(bounds.getCenter(new T.Vector3()), Math.ceil(damage * .55), 3, 1.7);
      }
    }
    this.wreckParts.hit(contact,impactDirection,dentDamage);
    this.engineDamage=components.engineDamage;
    this.engineStall=stalledByImpact(this.engineStall,this.health,this.engineDamage,damage);
    if(this.engineStall!>0||this.health<=0)this.rpm=0;
    this.tyreDamage=components.tyreDamage;
    this.wreckParts.wheelDamage.set(components.wheelDamage);
    components.wheelShift.forEach((v,i)=>this.wreckParts.wheelShift[i].copy(v));
    if(this.extendedDamage)for(let i=0;i<4;i++){
      // A knock past HUBCAP_POP sends the wheel's centre cap spinning off.
      const w=this.wheels[i];if(!w||worn[i]>=HUBCAP_POP||this.wreckParts.wheelDamage[i]<HUBCAP_POP)continue;
      w.traverse(o=>{if(!(o instanceof T.Mesh)||!o.visible||!HUBCAP.test(o.name))return;this.poppedCaps.push(o);
        if(quiet)o.visible=false;else{const out=new T.Vector3(i%2?1:-1,.4,0).applyQuaternion(this.root.quaternion).multiplyScalar(3);this.fx.detach(o,this.velocity.clone().multiplyScalar(.8).add(out));}});
    }
    if(this.extendedDamage)for(let i=0;i<4;i++){const w=this.wheels[i];if(w&&!this.wreckParts.wheelLost[i]&&wheelTearsOff(worn[i],damage,this.wreckParts.wheelReach(i,contact)))this.tearOffWheel(i,direction,quiet);}
    if(structureBefore&&this.structuralDamage){
      // Whole-body crush grows with structural compression, on top of the local dents.
      const delta=this.structuralDamage.map((v,i)=>Math.max(0,v-structureBefore[i]));
      if(delta.some(d=>d>.002)){const frame=this.crushFrame??=this.measureCrushFrame();for(const mesh of [...this.panels,...this.glass])if(mesh.visible&&crushGeometry(mesh,delta,frame,!quiet)&&!quiet)this.crushPending.add(mesh);}
    }
    this.structure.update(this.structuralDamage,this.health);
    if (!quiet) {
      this.fx.impact?.(point, direction, damage);
    }
  }
  /** Tear a whole loose assembly (hood, bumper, door, tailgate) away as debris. Replays pass quiet. */
  ripAssembly(name:string,quiet=false){
    const a=this.wreckParts.assemblies.find(x=>x.name===name);if(!a||!a.members.some(m=>m.mesh.visible))return false;
    this.onVisualEvent?.({kind:'rip',pose:this.visualPose(),part:name});
    this.model.updateWorldMatrix(true,true);
    for(const m of a.members){
      if(!m.mesh.visible)continue;
      if(quiet)m.mesh.visible=false;else this.fx.detach(m.mesh,this.velocity.clone().multiplyScalar(.55).add(new T.Vector3(0,1.6,0)));
    }
    if(!quiet){this.impactEffects.debris=true;this.rips++;}
    return true;
  }
  private measureCrushFrame():CrushFrame{
    const box=new T.Box3();for(const mesh of this.panels){const rest=mesh.userData.wreckRest as T.BufferAttribute|undefined;if(rest)box.union(new T.Box3().setFromBufferAttribute(rest));}
    return{x:Math.max(.5,Math.abs(box.min.x),Math.abs(box.max.x)),z:Math.max(1,Math.abs(box.min.z),Math.abs(box.max.z)),top:Math.max(.8,box.max.y)};
  }
  private tearOffWheel(i:number,direction:T.Vector3,quiet:boolean){
    const w=this.wheels[i],contact=this.tireContacts[i];this.wreckParts.wheelLost[i]=1;
    contact.active.value=0;contact.load.value=0;
    if(!quiet){
      const outward=new T.Vector3(i%2?1:-1,.35,0).applyQuaternion(this.root.quaternion).multiplyScalar(2.4).addScaledVector(direction,1.2);
      const fx=this.fx as Effects&{detachWheel?:Effects['detachWheel']};
      fx.detachWheel?.(w,this.velocity.clone().multiplyScalar(.85).add(outward),vehicleWheelRadius(this.kind),this.speed);
      this.fx.emit(w.getWorldPosition(new T.Vector3()),16,1,1.3);this.impactEffects.debris=true;this.onWheelLost?.(i);
    }
    w.visible=false;
  }
  dispose() {
    this.drawBatch?.dispose();
    this.livery.dispose();
    this.tireContacts.forEach(contact=>contact.dispose());
    this.world.removeVehicleController(this.controller);
    this.world.removeRigidBody(this.body);
    this.root.removeFromParent();
    const materials = new Set<T.Material>();
    this.model.traverse((o) => {
      if (o instanceof T.Mesh) {
        cancelWreckNormals(o);
        if (/^(panel_|glass_)/.test(o.name)) o.geometry.dispose();
        materials.add(o.material as T.Material);
      }
    });
    for (const material of materials) material.dispose();
  }
}
