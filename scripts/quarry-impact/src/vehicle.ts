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
import {tethers} from './bumper-lock';
import {steeringLimit,brakeFactor,overheat,leakTyre,damperFactor,gearLimit,blowoutImpulse,bentRimTyre,rimWobble,springBias,sagBias,driveBias,thrustAngle,leakBrakeFluid,brakeFluidFactor,steerRate,throttleJams,jammedThrottle,CLUTCH,clutchGrip,clutchSlips,steerPlay,steerWander,tyreRub,rubWear,electricalFault,electricalCut,WHEEL_NUTS,loosenNuts,nutShimmy,EXHAUST_BLOW,exhaustBlow,liftPops,DIFF,diffDamage,diffAxle,wearDiff,diffDrive,DEBEAD,beadStress,tieRodSnapped,flopToe,GEAR_POP,gearPop,CALIPER,caliperDrag,discHeat,discGlow,discFade,MOUNTS,mountsBroken,shuntThrottle,BRAKE_FIRE,brakeFireClock,STARTER,starterDamage,starterFails,frameBend,dazeFor,dazedSteer,weakSpot,PUNCTURE,punctures,RADIATOR,LEAK} from './damage-handling';
import {leakRates,dripInterval,FLAME,fuelSpacing} from './fluid-leaks';
import {drainOil,starvationWear,seizes,OIL,drainCoolant,overheatWear,FUEL_TANK,drainFuel,fuelFeed,SUMP,crackSump,sumpLeak,drainSump} from './oil-starvation';
import {MAX_ENGINE_RESTART,crankRequested} from './engine-stall';
import {rollBarSnaps,rollTorque,hasPropshaft,propBend,propVibration,fatigueProp,BEARING,bearingCracks,wearBearing,bearingShimmy,bearingDrag,steerSkew,openness,openDrag,debrisFling,smashFire,impactZoneFactor,pitStrength,pitGrip,PIT,EXPOSED_WHEEL,exposedDamage,BUMPER_GONE,COVER_GONE,engineDrops,ROOF_SLIDE,SIDE_SLIDE,ROLL_SHED,roofSlide,TANK_DROP,tankDrops,beltSlip,beltSnaps,beltSqueal,beltHeat,drainBattery,batteryCut,RADIATOR as RADIATOR_COOLING,runningHot,hotClock,overheatFire} from './damage-handling';
import {SHED,assemblyMass,glassMass,shedMassProperties,type ShedPart} from './shed-weight';
import {DOOR_SWING,DOOR_CATCH,doorTip,barnDoorTip,stepDoor,doorDrag,doorUnlatched,doorBase,lidKind,lidBase,stepLid,CARGO,cargoSpills,type LidKind} from './door-swing';
/** Rear compression past which the exhaust hangs down and drags. */
export const EXHAUST_DROP=.2;
/** A dragged exhaust tears off after EXHAUST_OFF.after seconds of scraping and is left on the track: the car runs open-pipe. */
export const EXHAUST_OFF={after:8,length:1.15,radius:.05} as const;
/** Seconds a tyre that has just burst keeps throwing strips of rubber at speed. */
export const SHRED_SECONDS=5;
/** On its roof: seconds before the engine starves, the stall it holds (restartable once righted), seconds between drips. */
/** A soft radial glow (shared by every disc sprite); built from data, so it works without a DOM. */
let glowTexture:T.DataTexture|null=null;
function discGlowTexture(){
  if(glowTexture)return glowTexture;const n=32,d=new Uint8Array(n*n*4);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const r=Math.hypot(x-n/2+.5,y-n/2+.5)/(n/2),a=Math.max(0,1-r);const k=(y*n+x)*4;d[k]=d[k+1]=d[k+2]=255;d[k+3]=Math.round(255*a*a);}
  glowTexture=new T.DataTexture(d,n,n);glowTexture.needsUpdate=true;return glowTexture;
}
/** Front crush past which a front-engined AI car starts ramming in reverse. */
export const REVERSE_RAM_FRONT=.5;
/** Screens and plates: a bonded windscreen (or rear screen) pops out whole once its end or the roof is crushed past `crush`
 * (the body twists out from under it); a number plate drops off once its end is crushed past `plateCrush`. */
export const GLASS_POP={crush:.7,plateCrush:.45,front:/windshield|^glass_front/i,rear:/rearwindow|^glass_rear$|tailgaterear/i,plate:/plate$/i} as const;
/** The radiator letting go: a steam burst out of the grille (`steam` puffs) and a coolant splash (`splash` drips). */
export const RADIATOR_BURST={steam:18,splash:5} as const;
export const INVERTED={after:1,stall:1.5,drip:.35} as const;
/** A burning car cooks itself: glass damage per second at full heat (side windows burst at 24) and tyre damage per second. */
export const COOK={glass:2.2,tyre:.02} as const;
/** Roof compression at which the glass starts to craze, and at which side windows burst. */
export const ROOF_GLASS={craze:.4,burst:.6} as const;
/** Panels hanging at least this loose build wind load above this speed (m/s) until they tear away. */
export const WIND_RIP={loose:.25,speed:16} as const;
/** Deceleration (m/s²) from a part dragging along the ground at full scrape, applied where it drags. */
export const PART_DRAG=1.2;
/** A wheel touching down faster than speed (m/s, vertical) takes a hit from below: (fall - speed) * gain. */
export const HARD_LANDING={speed:7,gain:2.2,gap:.5} as const;
/** Seconds a snapped propshaft flails and sparks under the car. */
const PROP_FLAIL=2.5;
/** Offline part release: assembly thresholds scale and the smallest blow that can release a part. */
export const DETACH={threshold:.27,blow:4} as const;
/** Bolt-on front wings (offline): torn off once crushed past `threshold` (before DETACH scaling), more than a bumper takes. */
export const WING_OFF={threshold:48} as const;
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
  /** Share of lock lost steering toward a bent front corner, signed like the steer input (STEER_SKEW); 0 straight. */
  steerSkew = 0;
  /** Engine power multiplier for offline derbies (DERBY_PACE); undefined everywhere else, so physics is unchanged. */
  powerScale?:number;
  /** Drive/brake grip multiplier for offline derbies (DERBY_PACE); undefined elsewhere. */
  tractionScale?:number;
  /** Offline derby AI takes run-ups at its targets (CHARGE). */
  charge=false;
  readonly brakeBias = [1,1,1,1];
  readonly damperBias = [1,1,1,1];
  /** Broken springs and driveshafts per wheel (offline): stiffness and rest-length scales, and drive on/off. */
  readonly springBias = [1,1,1,1];
  readonly sagBias = [1,1,1,1];
  readonly driveBias = [1,1,1,1];
  /** Rear wheels' shared steer from a bent subframe (offline; radians). */
  thrustAngle = 0;
  /** Frames the dropped exhaust has spent dragging (QA). */
  exhaustDrags = 0;
  /** Brake fluid left (offline): a split line drains it and the brakes fade. */
  brakeFluid = 1;
  /** Steering response scale (offline): 1 normal, lower with the power steering gone. */
  steerRate = 1;
  /** Throttle linkage jammed open (offline). */
  throttleJammed = false;
  /** Clutch torque capacity left (offline events): a crushed engine end and slipping under load wear it down. */
  clutchGrip = 1;
  private clutchBurn = 0;
  private clutchSmokeClock = 0;
  clutchSmoke = 0;
  /** Steering free play (offline events) and the wheel angle the slack is wandering by this step. */
  steerPlay = 0;
  /** Seconds doors have spent swinging open, and doors slammed off their hinges (offline QA counters). */
  doorOpenTime = 0;
  doorsTorn = 0;
  doorSlams = 0;
  /** How hard each crushed wheel arch rubs its tyre (offline events), and rubber smoke puffed (QA). */
  readonly rubDrag = new Float32Array(4);
  rubSmoke = 0;
  /** Wiring fault severity (offline events), whether the ignition is cut right now, and cuts so far (QA). */
  electricalFault = 0;
  electricalCut = false;
  electricalCuts = 0;
  /** How far each wheel's nuts have worked loose (offline events; 1 = off) and the toe it is shimmying by. */
  readonly nutLoose = new Float32Array(4);
  readonly wheelShimmy = new Float32Array(4);
  wheelsShed = 0;
  /** Split exhaust severity (offline events) and the lift-off pops fired so far (QA). */
  exhaustBlow = 0;
  exhaustPops = 0;
  /** Differential wear (offline events; 1 = broken, no drive to that axle). */
  diffWear = 0;
  /** Bead stress on each soft tyre (offline events) and tyres rolled off their rims (QA). */
  readonly beadStress = new Float32Array(4);
  debeads = 0;
  /** 1 where a front wheel answers the steering, 0 once its tie rod has snapped (offline events). */
  readonly steerLink = new Float32Array([1,1,1,1]);
  private linkClock = 0;
  /** Jumped out of gear (offline events): neutral until this clock time; pops so far (QA). */
  private popUntil = 0;
  private popSlot = -1;
  gearPops = 0;
  /** Bent calipers (offline events): how hard each brake binds, its disc heat 0..1, and the glow sprites. */
  readonly brakeDrag = new Float32Array(4);
  /** Wheel bearings (BEARING): wear 0 sound, BEARING.start cracked … 1 seized; and the drag each puts on its hub. */
  readonly bearingWear = new Float32Array(4);
  readonly hubDrag = new Float32Array(4);
  readonly discHeat = new Float32Array(4);
  private discGlows: (T.Sprite|null)[] = [null,null,null,null];
  private discSmokeClock = 0;
  /** Broken engine mounts (offline events): the lagging throttle the drive gets, the last pedal, jolts so far (QA). */
  mountsBroken = false;
  private shunt = 0;
  private lastPedal = 0;
  private lastJolt = -1;
  /** The driver's last freshly assigned input, and the modified copy handed to the physics (broken mounts, a daze). */
  private rawInput: Vehicle['input']|null = null;
  private ownInput: Vehicle['input']|null = null;
  mountJolts = 0;
  /** Cargo left aboard (offline events) and pieces spilled so far (QA). */
  private cargoLeft = -1;
  private cargoClock = 0;
  cargoSpilled = 0;
  /** Sump cracked by bottoming out (offline events, 0..1). */
  sumpCrack = 0;
  /** Seconds each disc has been white-hot, and wheels whose tyre caught fire (offline events). */
  readonly brakeFire = new Float32Array(4);
  readonly tyreAlight = new Uint8Array(4);
  private rubberDrop = 0;
  brakeFires = 0;
  /** Seconds the dropped exhaust has dragged, and whether it has torn off (offline events). */
  exhaustDragTime = 0;
  exhaustGone = false;
  /** The fuel tank has dropped on its filler neck and drags (offline), seconds dragged, torn off, and its hanging mesh. */
  tankDown=false;
  tankDragTime=0;
  tankGone=false;
  private tankMesh:T.Group|null=null;
  /** Kilograms of doors, lids, bumpers, wheels and glass the car has shed (SHED); the body is lighter by this much. */
  shedKg = 0;
  /** Fan belt (BELT): slip 0–1 while whole, snapped, the squeal it makes now, and the battery charge (1 full … 0 flat). */
  beltSlip=0;beltSnapped=false;squeal=0;battery=1;
  /** Seconds the engine has been held hot with no cooling (OVERHEAT_FIRE), and engine fires it has started. */
  hotTime=0;engineFires=0;
  /** Hits counted for SMASH_FIRE's per-hit odds, and engine bays lit by a smash. */
  bigHits=0;smashFires=0;
  private hotFired=false;
  /** How open the car is to the wind (AERO): 0 sealed … 1 windscreen, glass, doors and bonnet gone. */
  openness = 0;
  /** Anti-roll bars, front then rear: 1 intact, 0 snapped (ROLL_BAR). */
  readonly rollBar=[1,1];
  /** Propshaft (PROPSHAFT): bend 0–1, fatigue 0–1, snapped, and the vibration it shakes the car with now. */
  propBend=0;propWear=0;propSnapped=false;propVibration=0;
  private propFlail=0;
  private shedClock = 0;
  private shedBase?:{mass:number;com:R.Vector;inertia:R.Vector;frame:R.Rotation;offset:R.Vector};
  /** Starter damage (offline events), restart attempts so far, and cranks that failed to catch (QA). */
  starterDamage = 0;
  private crankAttempt = 0;
  starterFails = 0;
  /** Toe the bent frame knocks the wheels to (offline events; fronts +, rears −). */
  frameBend = 0;
  /** Seconds this car has been unable to drive itself (offline events; main eliminates it at DNF.after). */
  deadTime = 0;
  /** Seconds the driver is still dazed by a huge hit (offline events), and the lazy steering it is giving. */
  dazed = 0;
  /** Screens popped out and number plates knocked off (offline QA counters). */
  glassPops = 0;
  /** Debris rolled over and tyres it punctured (offline QA counters), and each wheel's puncture cooldown. */
  debrisRolls = 0;
  debrisPunctures = 0;
  /** Radiators burst (offline QA counter). */
  radiatorBursts = 0;
  private readonly punctureClock = new Float32Array(4);
  platesLost = 0;
  /** The world point of this car's most crushed corner, for derby rivals to aim at (offline events; null otherwise). */
  /** Front-engined and crushed past REVERSE_RAM_FRONT at the front (offline): the AI rams in reverse to save the engine. */
  get protectFront(){return this.extendedDamage&&this.health>0&&!isRearEngineKind(this.kind)&&(this.structuralDamage?.[0]??0)>=REVERSE_RAM_FRONT;}
  get weakSpot(){return this.extendedDamage&&this.health>0?weakSpot(this.structuralDamage,this.current,this.forward,this.right,DEFINITIONS[this.kind].halfLength,DEFINITIONS[this.kind].halfWidth):null;}
  private dazeSteer = 0;
  /** Wheels the engine drives for this layout. */
  get drivenWheels():readonly number[]{const l=this.driveLayout();return l==='front'?[0,1]:l==='rear'?[2,3]:[0,1,2,3];}
  inNeutral = false;
  private popQueue: number[] = [];
  private liftThrottle = 0;
  private lifts = 0;
  private electricClock = 0;
  private rubClock = 0;
  steerWander = 0;
  private wanderClock = 0;
  /** How hard a sagging corner is dragging on the ground (0..1, fx rate); slows the car a little. */
  private bellyDrag = 0;
  /** Fired the step a spring or driveshaft lets go, with the wheel index (sound/feed hook). */
  /** Jumped out of gear (true) or clunked back in (false). */
  onGearClunk?:(out:boolean)=>void;
  /** The loose engine clunked against its broken mounts. */
  onMountClunk?:()=>void;
  onBreak?:(what:'spring'|'shaft'|'diff'|'tierod'|'exhaust'|'brakefire'|'radiator'|'rollbar'|'propshaft'|'bearing'|'belt'|'enginefire'|'smashfire'|'tank'|'tankoff',wheel:number)=>void;
  /** Gears left after gearbox damage (offline only; 5 = intact). */
  gearLimit = 5;
  /** Grip left under each tyre from oil or coolant on the ground (offline only). */
  readonly slickGrip = [1,1,1,1];
  /** How far the rear tyres are sliding after a PIT shove (0..1, fading); they grip less while it lasts (offline). */
  rearSlide=0;
  pitSpins=0;
  /** The engine block has dropped out of the car (offline). */
  engineOut=false;
  /** Seconds spent sliding on the roof and on a side, and the spark clock while doing it (offline). */
  roofSlideTime=0;
  sideSlideTime=0;
  /** Loose parts shaken off by rolling over, and whether this roll has already shed them (offline). */
  rollShed=0;
  private rollShedDone=false;
  /** Times this car has rolled onto its roof (offline). */
  rolls=0;
  /** Seconds held pinned against a wall or a second car, the crush tick clock, and pins suffered (offline). */
  pinTime=0;
  pinTick=0;
  pins=0;
  private roofSparkClock=0;
  /** Front wings torn off (offline QA counter), and which front corners (left, right) have lost theirs. */
  wingsTorn=0;
  readonly wingGone=[false,false];
  /** Spare wheels thrown out of a sprung boot (offline QA counter). */
  spareWheels=0;
  /** How oily each tyre is after rolling through a slick; it lays dark tread marks until it wears off. */
  readonly oily = [0,0,0,0];
  private dripClock = [0,0,0];
  private fuelTravel = 0;
  /** Flames under the car now (0..1), seconds of exposure, and a request for VehicleFire to set it alight. */
  flameHeat = 0;
  private flameExposure = 0;
  igniteRequest = false;
  /** Heat from a burning car touching this one (0..1) and who that is; main sets both every frame. */
  contactHeat = 0;
  /** Fuel leak severity 0..1 (offline): a burning car with a split tank blows up. */
  fuelLeak = 0;
  /** Oil left in the sump (offline) and whether the engine has seized for good. */
  oilLevel = 1;
  /** Seconds spent upside down, and the drip clock while inverted (offline). */
  inverted = 0;
  private invertedDrip = 0;
  /** Coolant left (offline): a leaking radiator drains it and the engine overheats. */
  coolantLevel = 1;
  /** Fuel left in the tank (offline events): a split tank drains it; low it coughs, empty the engine dies. */
  fuelLevel: number = FUEL_TANK.start;
  private fuelClock = 0;
  seized = false;
  onSeize?:(p:T.Vector3)=>void;
  /** This car's fire heat (0..1), set by VehicleFire each step. */
  fireHeat = 0;
  /** A roof crushed down buckles the pillars: the glass crazes in proportion, and past ROOF_GLASS.burst the side windows
   * pop out (the screens stay in, crazed). Offline only; called every step, idempotent for a steady crush. */
  stressGlass(){
    const roof=this.structuralDamage?.[4]??0;if(!this.extendedDamage||roof<=ROOF_GLASS.craze)return;
    const target=24*Math.min(1.2,(roof-ROOF_GLASS.craze)/(ROOF_GLASS.burst-ROOF_GLASS.craze));
    for(const glass of this.glass){
      if(!glass.visible)continue;const before=glass.userData.damage||0;if(before>=target)continue;
      glass.userData.damage=target;const state=(glass.material as T.Material).userData.glassState as GlassState|undefined;if(state)state.damage.value=Math.min(1,target/24);
      if(!/Windshield|Rearwindow/.test(glass.name)&&before<=24&&target>24){glass.visible=false;const c=new T.Box3().setFromObject(glass).getCenter(new T.Vector3());this.fx.emit(c,12,3,1.2);this.onGlassBreak?.(c);}
    }
  }
  /** Called when heat shatters a window (sound hook). */
  onGlassBreak?:(p:T.Vector3)=>void;
  /** The car's own fire (offline): heat crazes the glass until side windows burst and the screens hang crazed,
   * and cooks the tyres at the burning end. engineRear picks which axle sits over the fire. */
  cook(heat:number,dt:number,engineRear:boolean){
    if(!this.extendedDamage||!(heat>.3)||!(dt>0))return;
    for(const glass of this.glass){
      if(!glass.visible)continue;
      const before=glass.userData.damage||0,after=before+heat*dt*COOK.glass;glass.userData.damage=after;
      const state=(glass.material as T.Material).userData.glassState as GlassState|undefined;
      if(state){state.damage.value=Math.min(1,after/24);if(before===0)state.impact.value.set(0,0,0);}
      if(!/Windshield|Rearwindow/.test(glass.name)&&before<=24&&after>24){
        glass.visible=false;const c=new T.Box3().setFromObject(glass).getCenter(new T.Vector3());this.fx.emit(c,12,3,1.2);this.onGlassBreak?.(c);
      }
    }
    if(this.tyreDamage)for(const i of engineRear?[2,3]:[0,1])if(!this.wreckParts.wheelLost[i])this.tyreDamage[i]=Math.min(1,this.tyreDamage[i]+heat*dt*COOK.tyre);
  }
  /** A part torn off while the car is burning hard keeps burning on the ground for 14–24 s. */
  private burnDebris(){if(this.extendedDamage&&this.fireHeat>.4)this.fx.igniteLastDebris?.(14+((this.id*.37+this.rips*.13)%1)*10);}
  /** Set while two or more wheels splash through water; VehicleFire puts a burning car out. */
  douseRequest = false;
  onDoused?:()=>void;
  contactBy = -1;
  /** Called when flames set this car alight, with the car whose fire it was (-1 when nobody lit it). */
  onSetAlight?:(by:number)=>void;
  private steamClock = 0;
  private oilSmokeClock = 0;
  /** Oil-smoke puffs from the exhaust (QA). */
  oilSmoke = 0;
  /** Steam puffs from a leaking radiator (QA). */
  steamPuffs = 0;
  private dripSeed = 1;
  /** Fluid drips this car has left (oil, coolant). */
  readonly drips = [0,0,0];
  /** Replay recording hook for each drip. */
  onDrip?:(x:number,y:number,z:number,kind:0|1|2,seed:number)=>void;
  onBackfire?:(point:T.Vector3)=>void;
  onWheelLost?:(wheel:number)=>void;
  /** A torn-off bumper left hanging on its wire (offline): told the debris body and the body-local point it hangs from. */
  onTether?:(part:string,debris:R.RigidBody,anchor:{x:number;y:number;z:number})=>void;
  private tetherRolls=0;
  private windLoad=new Map<string,number>();
  private readonly tyreBurst=[false,false,false,false];
  /** Tyres whose blowout has already snatched the car (offline only). */
  readonly blownOut=[false,false,false,false];
  /** Sound hook for a tyre bursting at speed. */
  onBlowout?:(p:T.Vector3)=>void;
  private readonly lastFailure=[0,0,0,0];
  /** Seconds a burst tyre keeps flailing strips of rubber (offline). */
  readonly tyreShred=[0,0,0,0];
  /** Rubber strips thrown (QA). */
  shredBits=0;
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
    this.engineMisfire.reset();this.misfireFactor=1;this.windLoad.clear();this.tyreBurst.fill(false);this.blownOut.fill(false);this.lastFailure.fill(0);this.tyreShred.fill(0);this.dragLoad=0;this.lastLanding=-10;this.crushPending.clear();for(const cap of this.poppedCaps)cap.visible=true;this.poppedCaps.length=0;this.wasGrounded.fill(true);this.steerLimit=1;this.gearLimit=5;this.brakeBias.fill(1);this.damperBias.fill(1);this.springBias.fill(1);this.sagBias.fill(1);this.driveBias.fill(1);this.thrustAngle=0;this.brakeFluid=1;this.steerRate=1;this.throttleJammed=false;this.clutchGrip=1;this.clutchBurn=0;this.clutchSmokeClock=0;this.clutchSmoke=0;this.steerPlay=0;this.steerWander=0;this.doorOpenTime=0;this.doorsTorn=0;this.doorSlams=0;this.rubDrag.fill(0);this.rubSmoke=0;this.rubClock=0;this.electricalFault=0;this.electricalCut=false;this.electricalCuts=0;this.electricClock=0;this.nutLoose.fill(0);this.wheelShimmy.fill(0);this.wheelsShed=0;this.exhaustBlow=0;this.exhaustPops=0;this.diffWear=0;this.beadStress.fill(0);this.debeads=0;this.steerLink.fill(1);this.linkClock=0;this.popUntil=0;this.popSlot=-1;this.gearPops=0;this.inNeutral=false;this.brakeDrag.fill(0);this.discHeat.fill(0);this.discSmokeClock=0;this.mountsBroken=false;this.shunt=0;this.lastPedal=0;this.lastJolt=-1;this.mountJolts=0;this.rawInput=null;this.ownInput=null;this.cargoLeft=-1;this.cargoClock=0;this.cargoSpilled=0;this.sumpCrack=0;this.brakeFire.fill(0);this.tyreAlight.fill(0);this.rubberDrop=0;this.brakeFires=0;this.exhaustDragTime=0;this.exhaustGone=false;this.tankDown=this.tankGone=false;this.tankDragTime=0;this.tankMesh?.removeFromParent();this.tankMesh=null;this.shedClock=SHED.every;this.rollBar.fill(1);this.beltSlip=this.squeal=0;this.beltSnapped=false;this.battery=1;this.hotTime=0;this.engineFires=0;this.hotFired=false;this.bigHits=0;this.smashFires=0;this.bearingWear.fill(0);this.hubDrag.fill(0);this.propBend=this.propWear=this.propVibration=this.propFlail=0;this.propSnapped=false;this.starterDamage=0;this.crankAttempt=0;this.starterFails=0;this.frameBend=0;this.deadTime=0;this.dazed=0;this.dazeSteer=0;this.glassPops=0;this.platesLost=0;this.debrisRolls=0;this.debrisPunctures=0;this.radiatorBursts=0;this.punctureClock.fill(0);for(const g of this.discGlows)if(g)g.visible=false;this.popQueue.length=0;this.liftThrottle=0;this.lifts=0;this.wanderClock=0;this.slickGrip.fill(1);this.rearSlide=0;this.pitSpins=0;this.wingsTorn=0;this.wingGone.fill(false);this.engineOut=false;this.roofSlideTime=0;this.sideSlideTime=0;this.roofSparkClock=0;this.rollShed=0;this.rollShedDone=false;this.rolls=0;this.pinTime=this.pinTick=this.pins=this.tetherRolls=0;this.spareWheels=0;this.oily.fill(0);this.dripClock.fill(0);this.fuelTravel=0;this.drips.fill(0);this.flameHeat=this.flameExposure=this.contactHeat=this.fuelLeak=0;this.oilLevel=1;this.coolantLevel=1;this.fuelLevel=FUEL_TANK.start;this.fuelClock=0;this.seized=false;this.inverted=0;this.invertedDrip=0;this.douseRequest=false;this.contactBy=-1;this.igniteRequest=false;this.steamClock=0;this.steamPuffs=0;this.oilSmokeClock=0;this.oilSmoke=0;this.dripSeed=this.id*7919+1;
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
    const slicks=this.fx.slicks;
    let contacts=0,groundSum=0;
    for(let i=0;i<4;i++){
      const point=this.wreckParts.wheelLost[i]?null:this.controller.wheelContactPoint(i);
      if(!point||!this.controller.wheelIsInContact(i)){this.slickGrip[i]=1;continue;}
      contacts++;groundSum+=point.y;
      const grip=slicks?slicks.gripAt(point.x,point.z):1;this.slickGrip[i]=i>1&&this.rearSlide>0?grip*pitGrip(this.rearSlide):grip;
      // Rolling over broken-off debris can puncture this tyre.
      this.punctureClock[i]=Math.max(0,this.punctureClock[i]-dt);
      if(this.punctureClock[i]<=0&&Math.abs(this.speed)>PUNCTURE.speed&&this.tyreDamage&&this.tyreDamage[i]<LEAK.onset&&this.fx.sharpDebrisNear?.(point.x,point.z,PUNCTURE.reach)){
        this.punctureClock[i]=PUNCTURE.gap;this.debrisRolls++;if(punctures(this.id*4+i,this.debrisRolls)){this.tyreDamage[i]=LEAK.onset+PUNCTURE.leak;this.debrisPunctures++;}}
      if(grip<.97)this.oily[i]=Math.max(this.oily[i],Math.min(1,(1-grip)*2));
      else this.oily[i]=Math.max(0,this.oily[i]-Math.abs(this.speed)*dt/14);
    }
    // Wheels in a water puddle: the splash douses a burning car and the flames under it.
    const inWater=this.wetWheels.filter(Boolean).length;this.douseRequest=inWater>=2&&Math.abs(this.speed)>1.5;
    if(inWater>=2){this.flameExposure=0;this.contactHeat=0;}
    // Sparks from scraping metal or a grinding hub light any fuel they touch; flames under the car burn it,
    // and so does a burning car leaning on this one (contactHeat, set each frame by main).
    let heat=0,by=-1;
    if(slicks){
      const half0=DEFINITIONS[this.kind].halfLength,sample=[0,1,2,3].map(i=>this.controller.wheelContactPoint(i)).filter((p):p is NonNullable<typeof p>=>!!p);
      const centre=this.previous;
      if(this.scraping>.3){for(const p of sample)slicks.igniteAt(p.x,p.z,.25,true,this.id);slicks.igniteAt(centre.x,centre.z,half0*.5,true,this.id);}
      heat=slicks.heatAt(centre.x,centre.z);let hottest={x:centre.x,z:centre.z};
      for(let i=0;i<4;i++){
        const p=this.wreckParts.wheelLost[i]?null:this.controller.wheelContactPoint(i);if(!p)continue;const h=slicks.heatAt(p.x,p.z);if(h>heat){heat=h;hottest={x:p.x,z:p.z};}
        // Rubber in the flames cooks: the tyre weakens towards a puncture and, in the end, a flat.
        if(h>0&&this.tyreDamage)this.tyreDamage[i]=Math.min(1,this.tyreDamage[i]+h*FLAME.tyre*dt);
      }
      if(heat>0)by=slicks.ownerAt(hottest.x,hottest.z);
    }
    if(this.contactHeat>heat){heat=this.contactHeat;by=this.contactBy;}
    this.flameHeat=heat;
    if(heat>0){
      if(this.health>0)this.health=Math.max(0,this.health-FLAME.damage*heat*dt);
      this.flameExposure+=dt*heat;if(this.flameExposure>=FLAME.ignite&&!this.igniteRequest){this.igniteRequest=true;this.flameExposure=-1e9;this.onSetAlight?.(by);}
    }else if(this.flameExposure>0)this.flameExposure=Math.max(0,this.flameExposure-dt*FLAME.cool);
    // Upside down: the fuel feed starves the engine and the tank vent and sump leak onto the ground.
    const up=new T.Vector3(0,1,0).applyQuaternion(this.previousQ).y;this.inverted=up<-.3?this.inverted+dt:0;
    if(this.inverted>INVERTED.after&&this.health>0){
      this.engineStall=Math.max(this.engineStall??0,INVERTED.stall);
      this.invertedDrip+=dt;
      if(this.invertedDrip>=INVERTED.drip){this.invertedDrip=0;this.dripSeed=(Math.imul(this.dripSeed,1664525)+1013904223)>>>0;const r=this.dripSeed/4294967296,kind=(r<.6?2:0) as 0|2;
        const x=this.previous.x+(r-.5)*.8,z=this.previous.z+(r*7%1-.5)*1.4,y=this.ground.height(x,z);slicks?.drip(x,y,z,kind,r);this.drips[kind]++;this.onDrip?.(x,y,z,kind,r);}
    }else this.invertedDrip=0;
    // Rolling over shakes off whatever was already hanging loose.
    if(this.inverted>=ROLL_SHED.at&&!this.rollShedDone){this.rollShedDone=true;this.rolls++;for(const a of this.wreckParts.assemblies)if(a.loose>=ROLL_SHED.loose&&a.members.some(m=>m.mesh.visible)&&this.ripAssembly(a.name))this.rollShed++;}
    else if(this.inverted===0)this.rollShedDone=false;
    // Sliding on its roof or a side: sparks and the scrape off the bodywork, gouges in the ground, that face crushing in.
    const onSide=this.inverted===0&&Math.abs(up)<SIDE_SLIDE.up;
    if(this.inverted>0||onSide){const v=this.body.linvel(),slide=Math.hypot(v.x,v.z),s=roofSlide(slide);
      const face=onSide?(new T.Vector3(1,0,0).applyQuaternion(this.previousQ).y<0?3:2):4;
      if(s>0){if(onSide)this.sideSlideTime+=dt;else this.roofSlideTime+=dt;this.scraping=Math.max(this.scraping,s*.8);if(this.structuralDamage)this.structuralDamage[face]=Math.min(1,(this.structuralDamage[face]??0)+ROOF_SLIDE.crush*s*dt);
        this.roofSparkClock+=dt;if(this.roofSparkClock>=ROOF_SLIDE.gap){this.roofSparkClock=0;const p=this.previous.clone();p.y=this.ground.height(p.x,p.z)+.05;
          this.fx.emit(p,Math.ceil(s*3),1,.9);this.fx.evidence?.add(p,Math.atan2(v.x,v.z),slide*.06,s*.6,2);}}}
    // Short of fuel the pickup sucks air when it sloshes; dry, the engine dies and will not restart.
    this.fuelClock+=dt;
    if(this.health>0){const feed=fuelFeed(this.fuelLevel,this.slip,this.input.brake,this.fuelClock);
      if(feed<=0)this.engineStall=Math.max(this.engineStall??0,MAX_ENGINE_RESTART);else this.misfireFactor*=feed;}
    if(!contacts)return;
    const rearEngine=isRearEngineKind(this.kind),tank=(rearEngine?this.structuralDamage?.[0]:this.structuralDamage?.[1])??0;
    const rates=leakRates(this.structuralDamage?.[0]??0,this.engineDamage??0,tank);if(this.sumpCrack>0)rates.oil=Math.max(rates.oil,sumpLeak(this.sumpCrack));if(this.tankDown)rates.fuel=Math.max(rates.fuel,TANK_DROP.leak);if(this.fuelLevel<=FUEL_TANK.empty)rates.fuel=0;this.fuelLeak=rates.fuel;this.fuelLevel=drainFuel(this.fuelLevel,rates.fuel,dt);
    // The oil that drips out is oil the engine no longer has: low on oil it knocks and wears, dry it seizes.
    this.oilLevel=drainSump(drainOil(this.oilLevel,rates.oil,dt),this.sumpCrack,dt);this.coolantLevel=drainCoolant(this.coolantLevel,rates.coolant,dt);
    if(!this.seized&&this.health>0&&!(this.engineStall!>0)&&this.engineDamage!==undefined){
      this.engineDamage=Math.min(1,this.engineDamage+starvationWear(this.oilLevel,this.input.throttle,dt)+overheatWear(this.coolantLevel,this.input.throttle,dt));
      if(seizes(this.oilLevel,this.engineDamage)){
        this.seized=true;this.engineStall=MAX_ENGINE_RESTART;this.rpm=0;
        // The driven wheels lock for a moment: the car lurches as the engine stops dead.
        const k=-Math.sign(this.speed)*this.specification.mass*Math.min(20,Math.abs(this.speed))*OIL.jolt;
        this.body.applyImpulse({x:this.forward.x*k,y:0,z:this.forward.z*k},true);
        this.onSeize?.(new T.Vector3(0,.6,(isRearEngineKind(this.kind)?-1:1)*DEFINITIONS[this.kind].halfLength*.55).applyQuaternion(this.previousQ).add(this.previous));
      }
    }
    const half=DEFINITIONS[this.kind].halfLength,ground=groundSum/contacts;
    // A hot engine boils the leaking coolant off the radiator: steam out of the grille while it runs.
    if(rates.coolant>0&&this.health>0&&!(this.engineStall!>0)){
      this.steamClock+=dt*(2.5+5*rates.coolant)*(.6+.4*Math.min(1,Math.abs(this.input.throttle)));
      if(this.steamClock>=1){this.steamClock-=1;this.steamPuffs++;
        const p=new T.Vector3(0,.62,half*.78).applyQuaternion(this.previousQ).add(this.previous);this.fx.emit(p,1,5,.55);}
    }else this.steamClock=0;
    // An engine losing oil also burns it: dark puffs out of the exhaust under throttle.
    const throttle=Math.max(0,this.input.throttle);
    if(rates.oil>0&&throttle>.3&&this.health>0&&!(this.engineStall!>0)){
      this.oilSmokeClock+=dt*(1.5+4*rates.oil)*throttle;
      if(this.oilSmokeClock>=1){this.oilSmokeClock-=1;this.oilSmoke++;
        const p=new T.Vector3(0,.32,-half).applyQuaternion(this.previousQ).add(this.previous);this.fx.emit(p,1,2,.4);}
    }else this.oilSmokeClock=Math.min(this.oilSmokeClock,.5);
    for(const kind of [0,1,2] as const){
      const interval=dripInterval(kind===0?rates.oil:kind===1?rates.coolant:rates.fuel);if(!Number.isFinite(interval)){this.dripClock[kind]=0;continue;}
      // A split tank pours: on the move it lays a trail of touching drops, so fire can run along it.
      this.dripClock[kind]+=dt;if(kind===2)this.fuelTravel+=Math.abs(this.speed)*dt;
      if(kind===2&&this.fuelTravel>=fuelSpacing(rates.fuel)){this.fuelTravel=0;this.dripClock[kind]=0;}
      else if(this.dripClock[kind]<interval)continue;else this.dripClock[kind]-=interval;
      this.dripSeed=(Math.imul(this.dripSeed,1664525)+1013904223)>>>0;const r=this.dripSeed/4294967296;
      // Coolant from the radiator up front, oil from the engine, fuel from the tank at the other end.
      const z=(kind===2?(rearEngine?1:-1)*half*.55:(kind===1||!rearEngine?1:-1)*half*(kind===1?.62:.42))+(r-.5)*.3,x=(r*7%1-.5)*.4;
      const p=new T.Vector3(x,0,z).applyQuaternion(this.previousQ).add(this.previous);
      slicks?.drip(p.x,ground,p.z,kind,r);this.drips[kind]++;this.onDrip?.(p.x,ground,p.z,kind,r);
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
    // A crushed front slips the fan belt (it squeals under load) and can snap it: no water pump, no alternator.
    if(this.extendedDamage){const front=this.structuralDamage?.[0]??0;
      if(!this.beltSnapped&&this.health>0&&beltSnaps(front,this.id)){this.beltSnapped=true;this.onBreak?.('belt',0);}
      this.beltSlip=this.beltSnapped?0:beltSlip(front);this.squeal=running?beltSqueal(this.beltSlip,this.input.throttle):0;
      if(this.beltSnapped){if(running&&this.engineDamage!==undefined)this.engineDamage=beltHeat(this.engineDamage,this.input.throttle,dt);this.battery=drainBattery(this.battery,running,dt);}
    }else{this.beltSlip=this.squeal=0;this.beltSnapped=false;this.battery=1;}
    // A worn engine with nothing cooling it, run hard, heats up; held hot long enough it can catch fire.
    if(this.extendedDamage&&this.engineDamage!==undefined){
      const cooling=!(this.beltSnapped||this.coolantLevel<.3||(this.structuralDamage?.[0]??0)>=RADIATOR_COOLING.onset);
      this.hotTime=hotClock(this.hotTime,running&&runningHot(this.engineDamage,cooling,this.input.throttle),dt);
      if(!this.hotFired&&this.health>0&&overheatFire(this.hotTime,this.id)){this.hotFired=true;this.engineFires++;this.igniteRequest=true;this.onSetAlight?.(this.id);this.onBreak?.('enginefire',0);}
    }else this.hotTime=0;
    this.misfireFactor=running?this.engineMisfire.update(dt,this.engineDamage??0,this.input.throttle):1;
    // A damaged starter cranks slowly and sometimes fails to catch: the engine coughs and it has to go again.
    this.starterDamage=this.extendedDamage?starterDamage((isRearEngineKind(this.kind)?this.structuralDamage?.[1]:this.structuralDamage?.[0])??0):0;
    if(this.starterDamage>0&&!this.seized&&this.fuelLevel>FUEL_TANK.empty&&crankRequested(this.health,this.engineStall,this.input.throttle)){
      this.engineStall=Math.min(MAX_ENGINE_RESTART,this.engineStall!+dt*STARTER.slow*this.starterDamage);
      if(this.engineStall!<=dt*1.05){this.crankAttempt++;
        if(starterFails(this.starterDamage,this.crankAttempt,this.id)){this.engineStall=Math.min(MAX_ENGINE_RESTART,STARTER.retry);this.starterFails++;
          const exhaust=new T.Vector3(0,.32,-DEFINITIONS[this.kind].halfLength).applyQuaternion(this.previousQ).add(this.previous);this.fx.emit(exhaust,1,2,.4);this.onBackfire?.(exhaust);}}
    }
    // A chafed loom cuts the ignition in bursts: the engine dies for a moment and the lights go with it.
    this.electricClock+=dt;this.electricalFault=this.extendedDamage?electricalFault((isRearEngineKind(this.kind)?this.structuralDamage?.[1]:this.structuralDamage?.[0])??0):0;
    const cut=this.health>0&&electricalCut(this.electricalFault,this.electricClock,this.id);if(cut&&!this.electricalCut)this.electricalCuts++;this.electricalCut=cut;
    if(cut&&running)this.misfireFactor=0;
    if(this.beltSnapped&&running&&batteryCut(this.battery,this.electricClock,this.id))this.misfireFactor=0;
    // A cracked diff grinds itself up under load; when it lets go the gears jam for an instant and the car lurches.
    if(this.extendedDamage){const before=this.diffWear;this.diffWear=wearDiff(this.diffWear,diffDamage(this.structuralDamage,this.driveLayout()),running?this.input.throttle:0,dt);
      if(before<1&&this.diffWear>=1){const front=diffAxle(this.structuralDamage,this.driveLayout())==='front',k=-Math.sign(this.speed)*this.specification.mass*Math.min(15,Math.abs(this.speed))*DIFF.jolt;
        this.body.applyImpulse({x:this.forward.x*k,y:0,z:this.forward.z*k},true);this.onBreak?.('diff',front?0:2);
        this.fx.emit(new T.Vector3(0,.25,(front?1:-1)*DEFINITIONS[this.kind].halfLength*.5).applyQuaternion(this.previousQ).add(this.previous),10,1,1);}}
    else this.diffWear=0;
    // A bent propshaft shakes with speed and, driven fast, fatigues until it snaps: the rear wheels lose drive.
    if(this.extendedDamage&&hasPropshaft(this.driveLayout(),isRearEngineKind(this.kind))){
      this.propBend=propBend(this.propBend,0,this.structuralDamage?.[1]??0);
      this.propVibration=this.propSnapped?0:propVibration(this.propBend,this.speed);
      if(!this.propSnapped){this.propWear=fatigueProp(this.propWear,this.propVibration,dt);if(this.propWear>=1){this.propSnapped=true;this.propFlail=PROP_FLAIL;this.onBreak?.('propshaft',2);}}
      this.propFlail=Math.max(0,this.propFlail-dt);
    }else{this.propBend=this.propWear=this.propVibration=this.propFlail=0;this.propSnapped=false;}
    // A split exhaust crackles on the overrun: lift off at speed and it pops, spitting flame out of the tailpipe.
    this.exhaustBlow=this.extendedDamage?(this.exhaustGone?1:exhaustBlow(this.structuralDamage?.[1]??0)):0;
    if(this.exhaustBlow>0&&running&&this.liftThrottle>EXHAUST_BLOW.lift&&this.input.throttle<EXHAUST_BLOW.off&&Math.abs(this.speed)>EXHAUST_BLOW.minSpeed){
      this.lifts++;this.popQueue=liftPops(this.exhaustBlow,this.id*31+this.lifts).map(t=>this.electricClock+t);}
    this.liftThrottle=this.input.throttle;
    while(this.popQueue.length&&this.popQueue[0]<=this.electricClock){this.popQueue.shift();if(!running)continue;
      const exhaust=new T.Vector3(0,.32,-DEFINITIONS[this.kind].halfLength).applyQuaternion(this.previousQ).add(this.previous);
      this.fx.emit(exhaust,5,1,.7);this.fx.emit(exhaust,1,2,.4);this.onBackfire?.(exhaust);this.exhaustPops++;this.fx.slicks?.igniteAt(exhaust.x,exhaust.z,.6,true,this.id);}
    this.steerLimit=this.extendedDamage?steeringLimit(this.structuralDamage):1;
    this.steerSkew=this.extendedDamage?steerSkew(this.wreckParts.wheelDamage[0],this.wreckParts.wheelDamage[1]):0;
    this.thrustAngle=this.extendedDamage?thrustAngle(this.structuralDamage):0;
    this.steerRate=this.extendedDamage?steerRate(this.structuralDamage?.[0]??0):1;
    this.steerPlay=this.extendedDamage?steerPlay(this.wreckParts.wheelDamage):0;this.wanderClock+=dt;
    this.steerWander=this.steerPlay>0?steerWander(this.steerPlay,this.speed,this.wanderClock,this.id):0;
    // Knocked wheels work their nuts loose as they turn: a growing shimmy, then the wheel comes off on the move.
    for(let i=0;i<4;i++){
      if(!this.extendedDamage||this.wreckParts.wheelLost[i]){this.nutLoose[i]=this.extendedDamage?this.nutLoose[i]:0;this.wheelShimmy[i]=0;this.bearingWear[i]=this.hubDrag[i]=0;continue;}
      this.nutLoose[i]=loosenNuts(this.nutLoose[i],this.wreckParts.wheelDamage[i],Math.abs(this.speed)*dt);
      this.wheelShimmy[i]=this.nutLoose[i]>0?nutShimmy(this.nutLoose[i],this.wheelAngle(i)):0;
      // A knocked wheel can crack its bearing: it growls, wears with distance, wobbles and drags, then seizes.
      if(this.bearingWear[i]===0&&bearingCracks(i,this.wreckParts.wheelDamage[i],this.id))this.bearingWear[i]=BEARING.start;
      const worn=this.bearingWear[i];this.bearingWear[i]=wearBearing(worn,Math.abs(this.speed)*dt);
      if(worn<1&&this.bearingWear[i]>=1)this.onBreak?.('bearing',i);
      this.wheelShimmy[i]+=bearingShimmy(this.bearingWear[i],this.wheelAngle(i));this.hubDrag[i]=bearingDrag(this.bearingWear[i]);
      if(this.nutLoose[i]>=1)this.shedWheel(i);
    }
    // A bashed front wheel snaps its tie rod: it stops steering and flops on its own.
    this.linkClock+=dt;
    for(let i=0;i<2;i++){
      if(!this.extendedDamage||this.wreckParts.wheelLost[i]){this.steerLink[i]=1;continue;}
      if(this.steerLink[i]===1&&tieRodSnapped(i,this.wreckParts.wheelDamage[i])){this.steerLink[i]=0;this.onBreak?.('tierod',i);}
      if(this.steerLink[i]===0)this.wheelShimmy[i]+=flopToe(i,this.speed,this.linkClock);
    }
    // A bashed axle can snap its anti-roll bar: the body leans far further in corners (applied below).
    for(let a=0;a<2;a++){
      if(!this.extendedDamage){this.rollBar[a]=1;continue;}
      if(this.rollBar[a]===1&&rollBarSnaps(a,this.wreckParts.wheelDamage,this.id)){this.rollBar[a]=0;this.onBreak?.('rollbar',a*2);}
    }
    // A T-boned chassis is bent like a banana: the axles point different ways and the car keeps turning toward the dent.
    this.frameBend=this.extendedDamage?frameBend(this.structuralDamage):0;
    if(this.frameBend!==0)for(let i=0;i<4;i++)if(!this.wreckParts.wheelLost[i])this.wheelShimmy[i]+=i<2?this.frameBend:-this.frameBend;
    // Crushed arches rub the tyres: drag on that corner, the tyre scrubbing down, rubber smoke and a squeal.
    let rubbing=0;
    for(let i=0;i<4;i++){const r=this.extendedDamage&&!this.wreckParts.wheelLost[i]&&!(i<2&&this.wingGone[i])?tyreRub(this.structuralDamage,i):0;this.rubDrag[i]=r;
      if(r>0&&this.tyreDamage)this.tyreDamage[i]=Math.min(1,this.tyreDamage[i]+rubWear(r,this.speed,dt));if(r>rubbing)rubbing=r;}
    if(rubbing>.15&&Math.abs(this.speed)>3&&this.health>0){
      this.rubClock+=dt*rubbing*Math.min(1,Math.abs(this.speed)/12)*6;
      if(this.rubClock>=1){this.rubClock-=1;this.rubSmoke++;const i=this.rubDrag.indexOf(rubbing),half=DEFINITIONS[this.kind];
        const p=new T.Vector3((i%2?1:-1)*half.halfWidth*.85,.35,(i<2?1:-1)*half.wheelbase/2).applyQuaternion(this.previousQ).add(this.previous);this.fx.emit(p,1,2,.35);}
    }else this.rubClock=0;
    // A slipping clutch burns: more slip, less grip, and a wisp of acrid smoke from the bellhousing.
    this.clutchGrip=this.extendedDamage?clutchGrip((isRearEngineKind(this.kind)?this.structuralDamage?.[1]:this.structuralDamage?.[0])??0,this.clutchBurn):1;
    if(running&&this.gear!==0&&clutchSlips(this.clutchGrip,this.input.throttle)){
      this.clutchBurn+=CLUTCH.burn*dt;this.clutchSmokeClock+=dt*3;
      if(this.clutchSmokeClock>=1){this.clutchSmokeClock-=1;this.clutchSmoke++;
        const p=new T.Vector3(0,.15,(isRearEngineKind(this.kind)?-1:1)*DEFINITIONS[this.kind].halfLength*.25).applyQuaternion(this.previousQ).add(this.previous);this.fx.emit(p,1,5,.3);}
    }else this.clutchSmokeClock=0;
    this.stressGlass();
    this.throttleJammed=this.extendedDamage&&this.health>0&&throttleJams(this.structuralDamage?.[0]??0,this.id);
    if(this.throttleJammed)this.input.throttle=jammedThrottle(this.input.throttle,true);
    // The driver's own input is read only when a fresh one is assigned; the modifiers below write one shared copy, so a
    // lagged value never feeds back in as the pedal or the wheel (several physics steps can run per assignment).
    if(this.input!==this.ownInput)this.rawInput=this.input;
    const raw=this.rawInput??this.input;let steer=raw.steer,throttle=raw.throttle;
    // A dazed driver steers lazily.
    if(this.dazed>0){this.dazed=Math.max(0,this.dazed-dt);this.dazeSteer=dazedSteer(this.dazeSteer,raw.steer,dt);steer=this.dazeSteer;}
    // Broken mounts: the engine rocks — a jolt and a clunk on a sharp throttle change, and the drive takes up late.
    this.mountsBroken=this.extendedDamage&&this.health>0&&mountsBroken((isRearEngineKind(this.kind)?this.structuralDamage?.[1]:this.structuralDamage?.[0])??0);
    if(this.mountsBroken){
      const pedal=raw.throttle,step=pedal-this.lastPedal;this.lastPedal=pedal;
      if(Math.abs(step)>=MOUNTS.minStep&&!(this.engineStall!>0)&&this.linkClock-this.lastJolt>MOUNTS.gap){this.lastJolt=this.linkClock;this.mountJolts++;
        const k=this.specification.mass*MOUNTS.jolt*step;this.body.applyTorqueImpulse({x:this.forward.x*k,y:this.forward.y*k,z:this.forward.z*k},true);this.onMountClunk?.();}
      this.shunt=shuntThrottle(this.shunt,pedal,dt);throttle=this.shunt;}
    else{this.shunt=raw.throttle;this.lastPedal=raw.throttle;}
    if(steer!==raw.steer||throttle!==raw.throttle){this.ownInput={...raw,steer,throttle};this.input=this.ownInput;}else this.input=raw;
    if(this.extendedDamage)this.brakeFluid=leakBrakeFluid(this.brakeFluid,this.structuralDamage?.[0]??0,dt);
    this.wreckParts.flipHood=this.extendedDamage;
    this.gearLimit=this.extendedDamage?gearLimit(this.structuralDamage,isFrontDriveKind(this.kind)?'front':(this.kind==='coupe'||isClassicKind(this.kind)&&this.kind!=='trail')?'rear':'all'):5;
    // A stripped box jumps out of gear under load: a spell in neutral (no drive, the revs flare), then it clunks back in.
    const wasNeutral=this.inNeutral;this.inNeutral=false;
    if(this.extendedDamage&&running&&this.gearLimit<5&&this.gear>0){
      const slot=Math.floor(this.linkClock/GEAR_POP.period);
      if(slot!==this.popSlot&&this.input.throttle>GEAR_POP.throttle){this.popSlot=slot;const length=gearPop(this.gearLimit,this.linkClock,this.id);if(length>0){this.popUntil=this.linkClock+length;this.gearPops++;}}
      if(this.linkClock<this.popUntil){this.inNeutral=true;this.clutchGrip=0;}
    }else this.popUntil=0;
    if(wasNeutral!==this.inNeutral)this.onGearClunk?.(this.inNeutral);
    for(let i=0;i<4;i++){this.brakeBias[i]=this.extendedDamage?brakeFactor(this.wreckParts.wheelDamage[i]):1;this.damperBias[i]=this.extendedDamage?damperFactor(this.wreckParts.wheelDamage[i]):1;
      if(this.extendedDamage)this.brakeBias[i]*=brakeFluidFactor(this.brakeFluid);
      const d=this.extendedDamage?this.wreckParts.wheelDamage[i]:0,spring=springBias(d),drive=driveBias(d);
      if(spring<this.springBias[i])this.onBreak?.('spring',i);if(drive<this.driveBias[i])this.onBreak?.('shaft',i);
      this.springBias[i]=spring;this.sagBias[i]=sagBias(d);this.driveBias[i]=drive;}
    if(this.extendedDamage&&this.diffWear>0){const front=diffAxle(this.structuralDamage,this.driveLayout())==='front',f=diffDrive(this.diffWear);for(const i of front?[0,1]:[2,3])this.driveBias[i]*=f;}
    if(this.propSnapped)this.driveBias[2]=this.driveBias[3]=0;
    // A bent caliper drags its brake: the disc heats, glows, smokes, fades that brake and cooks the tyre.
    let hottest=-1;
    for(let i=0;i<4;i++){
      const drag=this.extendedDamage&&!this.wreckParts.wheelLost[i]?caliperDrag(this.wreckParts.wheelDamage[i]):0;this.brakeDrag[i]=drag;
      this.discHeat[i]=this.extendedDamage?discHeat(this.discHeat[i],Math.max(drag,Math.min(1,this.hubDrag[i])),this.speed,dt):0;
      if(this.discHeat[i]>.6)this.brakeBias[i]*=discFade(this.discHeat[i]);
      if(this.tyreDamage&&this.discHeat[i]>.7)this.tyreDamage[i]=Math.min(1,this.tyreDamage[i]+CALIPER.tyre*(this.discHeat[i]-.7)*dt);
      if(hottest<0||this.discHeat[i]>this.discHeat[hottest])hottest=i;
      // Held white-hot long enough, the tyre catches: burning rubber drops, the tyre burns down, the car catches once.
      this.brakeFire[i]=this.extendedDamage?brakeFireClock(this.brakeFire[i],this.discHeat[i],dt):0;
      if(this.brakeFire[i]>=BRAKE_FIRE.after&&!this.tyreAlight[i]&&this.health>0){this.tyreAlight[i]=1;this.brakeFires++;this.igniteRequest=true;this.onSetAlight?.(this.id);this.onBreak?.('brakefire',i);}
      if(this.tyreAlight[i]&&this.tyreDamage)this.tyreDamage[i]=Math.min(1,this.tyreDamage[i]+BRAKE_FIRE.tyre*dt);
    }
    if(this.tyreAlight.some(Boolean)&&this.fx.slicks){this.rubberDrop+=dt;
      if(this.rubberDrop>=BRAKE_FIRE.drop){this.rubberDrop=0;const i=this.tyreAlight.findIndex(Boolean),w=this.wheels[i];
        if(w){const p=w.getWorldPosition(new T.Vector3()),g=this.ground.height(p.x,p.z);this.dripSeed=(Math.imul(this.dripSeed,1664525)+1013904223)>>>0;const r=this.dripSeed/4294967296;
          this.fx.slicks.drip(p.x,g,p.z,0,r);this.drips[0]++;this.onDrip?.(p.x,g,p.z,0,r);this.fx.slicks.igniteAt(p.x,p.z,.5,false,this.id);}}}
    if(hottest>=0&&this.discHeat[hottest]>CALIPER.smoke){this.discSmokeClock+=dt*4*this.discHeat[hottest];
      if(this.discSmokeClock>=1){this.discSmokeClock-=1;const w=this.wheels[hottest];if(w)this.fx.emit(w.getWorldPosition(new T.Vector3()),1,2,.3);}}
    else this.discSmokeClock=0;
    if(this.extendedDamage){this.fluids(dt);if(this.rearSlide>0)this.rearSlide=Math.max(0,this.rearSlide-dt/PIT.fade);}
    // A seized engine never turns again: the starter can crank, but it will not catch.
    if(this.seized)this.engineStall=MAX_ENGINE_RESTART;
    if(this.extendedDamage&&this.tyreDamage)for(let i=0;i<4;i++)if(!this.wreckParts.wheelLost[i])this.tyreDamage[i]=leakTyre(bentRimTyre(this.tyreDamage[i],this.wreckParts.wheelDamage[i]),this.speed,dt);
    for(let i=0;i<4;i++)if(this.tyreShred[i]>0)this.tyreShred[i]=Math.max(0,this.tyreShred[i]-dt);
    // Soft tyres roll off their rims in hard corners: the outside ones, with the cornering load.
    if(this.extendedDamage&&this.tyreDamage){const lateral=this.body.angvel().y*this.speed;
      for(let i=0;i<4;i++){if(this.wreckParts.wheelLost[i]||this.blownOut[i])continue;
        const outside=(i%2?1:-1)===-Math.sign(lateral);this.beadStress[i]=beadStress(this.beadStress[i],this.tyreDamage[i],lateral,outside,dt);
        if(this.beadStress[i]<1)continue;
        this.beadStress[i]=0;this.tyreDamage[i]=LEAK.flat;this.lastFailure[i]=1;this.blownOut[i]=true;this.debeads++;
        const {drag,side}=blowoutImpulse(this.specification.mass,this.speed),at=this.controller.wheelChassisConnectionPointCs(i);
        if(drag>0&&at){const p=new T.Vector3(at.x,at.y,at.z).applyQuaternion(this.previousQ).add(this.previous),back=-Math.sign(this.speed),out=i%2?1:-1,k=DEBEAD.snatch;
          this.body.applyImpulseAtPoint({x:(this.forward.x*back*drag+this.right.x*out*side)*k,y:0,z:(this.forward.z*back*drag+this.right.z*out*side)*k},{x:p.x,y:p.y,z:p.z},true);
          this.onBlowout?.(p);this.fx.emit(p,6,2,.6);}
      }}
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
        this.onBlowout?.(p);this.fx.emit(p,10,4,1.6);this.tyreShred[i]=SHRED_SECONDS;
      }
    }
    if(this.extendedDamage||this.shedKg>0)this.reweigh(dt);
    // An open wreck catches the wind: drag with the square of speed.
    if(this.extendedDamage&&this.openness>0&&Math.abs(this.speed)>1){const k=-Math.sign(this.speed)*openDrag(this.openness,this.speed)*dt;this.body.applyImpulse({x:this.forward.x*k,y:0,z:this.forward.z*k},true);}
    else if(!this.extendedDamage)this.openness=0;
    const bars=2-this.rollBar[0]-this.rollBar[1];
    if(this.extendedDamage&&bars>0&&[0,1,2,3].every(i=>this.wreckParts.wheelLost[i]||this.controller.wheelIsInContact(i))){
      const v=this.body.linvel(),t=rollTorque(this.specification.mass,rotateVehicleVector({x:0,y:1,z:0},this.body.rotation()),v,this.body.angvel().y,bars);
      this.body.applyTorqueImpulse({x:t.x*dt,y:t.y*dt,z:t.z*dt},true);
    }
    if(this.extendedDamage&&this.bellyDrag>0&&Math.abs(this.speed)>1){const k=-Math.sign(this.speed)*this.specification.mass*.9*this.bellyDrag*dt;this.body.applyImpulse({x:this.forward.x*k,y:0,z:this.forward.z*k},true);this.bellyDrag=Math.max(0,this.bellyDrag-dt*2);}
    if(this.extendedDamage&&this.dragLoad>0&&Math.abs(this.speed)>1){
      // The dragging part acts as a brake where it touches the ground, so it also pulls to that side.
      const k=-Math.sign(this.speed)*this.specification.mass*PART_DRAG*this.dragLoad*dt;
      this.body.applyImpulseAtPoint({x:this.forward.x*k,y:0,z:this.forward.z*k},{x:this.dragPoint.x,y:this.dragPoint.y,z:this.dragPoint.z},true);
    }
    if(this.engineMisfire.backfire&&this.extendedDamage){
      // A misfire ends with unburnt fuel popping in the exhaust: a flash of sparks and a puff of smoke.
      const exhaust=new T.Vector3(0,.32,-DEFINITIONS[this.kind].halfLength).applyQuaternion(this.previousQ).add(this.previous);
      this.fx.emit(exhaust,7,1,.8);this.fx.emit(exhaust,2,2,.5);this.onBackfire?.(exhaust);this.backfires++;this.fx.slicks?.igniteAt(exhaust.x,exhaust.z,.6,true,this.id);
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
    if(this.extendedDamage)this.swingDoors(dt);
    if(landing>=0&&time-this.lastLanding>HARD_LANDING.gap&&this.health>0){
      // A heavy landing bottoms out that corner: the suspension, wheel and underside take the blow.
      this.lastLanding=time;const p=this.controller.wheelContactPoint(landing)!,up=new T.Vector3(0,1,0).applyQuaternion(this.currentQ);
      this.hit(new T.Vector3(p.x,p.y,p.z).addScaledVector(up,.3),up,(fall-HARD_LANDING.speed)*HARD_LANDING.gain,time);
      // Bottomed out hard enough, the sump cracks: an immediate splash, then a steady oil leak.
      if(hasPropshaft(this.driveLayout(),isRearEngineKind(this.kind)))this.propBend=propBend(this.propBend,fall,0);
      if(fall>SUMP.fall){const before=this.sumpCrack;this.sumpCrack=crackSump(this.sumpCrack,fall);
        if(this.sumpCrack>before){const g=this.ground.height(this.current.x,this.current.z);for(let k=0;k<SUMP.splash;k++){this.dripSeed=(Math.imul(this.dripSeed,1664525)+1013904223)>>>0;const r=this.dripSeed/4294967296,x=this.current.x+(r-.5)*.6,z=this.current.z+(r*7%1-.5)*.9;this.fx.slicks?.drip(x,g,z,0,r);this.drips[0]++;this.onDrip?.(x,g,z,0,r);}}}
    }
    if (time - this.lastFx > 0.06) {
      const fxGap=Math.min(.25,time-this.lastFx);this.lastFx = time;
      this.scraping=0;this.dragLoad=0;
      // The snapped shaft flails and drags under the car for a moment: sparks from the middle of the floor.
      if(this.propFlail>0&&Math.abs(this.speed)>1){const p=new T.Vector3(0,0,-DEFINITIONS[this.kind].halfLength*.2).applyQuaternion(this.previousQ).add(this.previous);p.y=this.ground.height(p.x,p.z)+.04;
        this.fx.emit(p,Math.ceil(Math.min(1,Math.abs(this.speed)/15)*3),1,.7);this.scraping=Math.max(this.scraping,.5);}
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
          // Running on the rim: a spray of sparks and a scrape; a freshly burst tyre flails off strips of rubber.
          if(this.tyreShred[i]>0&&Math.abs(this.speed)>8){this.fx.emit(p,1,4,1.2);this.shredBits++;}
          const s=Math.min(1,Math.abs(this.speed)/18);this.scraping=Math.max(this.scraping,s*.55);this.fx.emit(p,Math.ceil(s*2),1,.7);
          // Offline the rim also cuts a groove into the tarmac, like a bare hub.
          if(this.extendedDamage)this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.08,s*.8,2);
        }
        // A corner down on its bump stops drags the sill and floorpan along the ground: sparks and a groove.
        if(this.extendedDamage&&this.sagBias[i]<1&&Math.abs(this.speed)>3&&(this.controller.wheelSuspensionLength(i)??1)<.16){
          const s=Math.min(1,Math.abs(this.speed)/16),at=p.clone().lerp(this.previous,.3);at.y=p.y;
          this.scraping=Math.max(this.scraping,s*.7);this.fx.emit(at,Math.ceil(s*3),1,.8);this.fx.evidence?.add(at,yaw,Math.abs(this.speed)*.08,s*.7,2);this.bellyDrag=Math.max(this.bellyDrag,s);
        }
        if(this.wetWheels[i])continue;
        const feedback=tyreFeedback(this.surface,this.speed,this.wheelSlips[i],this.input.handbrake,i,true);
        if(feedback.count)this.fx.emit(p,feedback.count,feedback.type,feedback.force);
        if(feedback.skid){
          if(this.surface==='asphalt')this.fx.mark(p,yaw,feedback.markLength);
          else this.fx.evidence?.add(p,yaw,Math.abs(this.speed)*.07,feedback.evidence,1);
        }
      }
      // A rear crushed past EXHAUST_DROP knocks the exhaust down: at speed it drags behind, sparking and scraping.
      if(this.extendedDamage&&!this.exhaustGone&&(this.structuralDamage?.[1]??0)>EXHAUST_DROP&&Math.abs(this.speed)>4&&this.health>0){
        const tail=new T.Vector3(isRearEngineKind(this.kind)?.35:-.35,0,-DEFINITIONS[this.kind].halfLength*.8).applyQuaternion(this.previousQ).add(this.previous);
        tail.y=this.ground.height(tail.x,tail.z)+.04;const s=Math.min(1,Math.abs(this.speed)/18);
        this.scraping=Math.max(this.scraping,s*.45);this.fx.emit(tail,Math.ceil(s*2),1,.6);this.fx.evidence?.add(tail,Math.atan2(this.forward.x,this.forward.z),Math.abs(this.speed)*.06,s*.5,2);this.exhaustDrags++;
        // Scraped along long enough, the pipe tears off and is left lying on the track.
        this.exhaustDragTime+=fxGap;if(this.exhaustDragTime>=EXHAUST_OFF.after){this.exhaustGone=true;
          const pipe=new T.Mesh(new T.CylinderGeometry(EXHAUST_OFF.radius,EXHAUST_OFF.radius,EXHAUST_OFF.length,8),new T.MeshStandardMaterial({color:0x3a3530,roughness:.55,metalness:.7}));
          pipe.name='exhaust_pipe';pipe.rotation.x=Math.PI/2;pipe.position.set(isRearEngineKind(this.kind)?.35:-.35,-.25,-DEFINITIONS[this.kind].halfLength-EXHAUST_OFF.length*.5);this.root.add(pipe);
          this.fx.detach(pipe,this.velocity.clone().multiplyScalar(.6));pipe.removeFromParent();pipe.geometry.dispose();(pipe.material as T.Material).dispose();
          this.onBreak?.('exhaust',isRearEngineKind(this.kind)?0:2);this.fx.emit(tail,10,1,1);}
      }
      // A dropped fuel tank drags on its filler neck: sparks (hot enough at speed to light its own fuel) until it tears off.
      if(this.tankDown&&!this.tankGone&&Math.abs(this.speed)>TANK_DROP.speed&&this.health>0){
        const end=isRearEngineKind(this.kind)?1:-1,tail=new T.Vector3(0,0,end*(DEFINITIONS[this.kind].halfLength*.55+TANK_DROP.size.z)).applyQuaternion(this.previousQ).add(this.previous);
        tail.y=this.ground.height(tail.x,tail.z)+.04;const s=Math.min(1,Math.abs(this.speed)/16);
        this.scraping=Math.max(this.scraping,s*.5);this.fx.emit(tail,Math.ceil(s*3),1,.75);this.fx.evidence?.add(tail,Math.atan2(this.forward.x,this.forward.z),Math.abs(this.speed)*.06,s*.6,2);
        if(Math.abs(this.speed)>=TANK_DROP.hot)this.fx.slicks?.igniteAt(tail.x,tail.z,.3,true,this.id);
        this.tankDragTime+=fxGap;if(this.tankDragTime>=TANK_DROP.after)this.tearTank();
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
    for (const material of this.brakeLights) material.emissiveIntensity = this.electricalCut ? 0 : this.input.brake > .05 || this.input.handbrake ? 3.5 : .8;
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      if (!w||this.wreckParts.wheelLost[i]) continue;
      w.position.y =
        -this.model.position.y - 0.12 - (this.controller.wheelSuspensionLength(i) ?? vehicleSuspensionRestLength(this.kind));
      const tyre=this.tyreDamage?.[i],corner=wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),tyre,vehicleFlatTyreRadius(this.kind));
      w.rotation.set(0,(i<2?this.steering*this.steerLink[i]:0)+corner.toe+(i>1?this.thrustAngle:0)+(this.extendedDamage?this.wheelShimmy[i]:0),0);
      w.rotateX(-this.wheelAngle(i));
      // A bent rim runs out of true: tilted in its own spinning frame, the wheel visibly wobbles as it turns.
      if(this.extendedDamage)w.rotateZ(rimWobble(this.wreckParts.wheelDamage[i])+this.nutLoose[i]*WHEEL_NUTS.tilt);
      const coating=this.surfaceFinish.coating.value;
      this.tireContacts[i].update(this.controller,i,this.specification.mass,this.wreckParts.wheelDamage[i],i%2?coating.w:coating.z,tyre===undefined?undefined:{failure:tyreFailure(tyre),radius:corner.radius,baseRadius:wheelResponse(this.wreckParts.wheelDamage[i],i%2?1:-1,this.speed,vehicleWheelRadius(this.kind),0,vehicleFlatTyreRadius(this.kind)).radius});
    }
    this.glowDiscs();
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
  collisionHit(point:T.Vector3,direction:T.Vector3,damage:number,time:number,otherPaint?:T.Color,closing=0){
    const p=this.body.translation(),q=this.body.rotation(),inverse={x:-q.x,y:-q.y,z:-q.z,w:q.w};
    const local=rotateVehicleVector({x:point.x-p.x,y:point.y-p.y,z:point.z-p.z},inverse);
    const along=rotateVehicleVector(direction,inverse),factor=armorWearMultiplier(this.kind,this.structuralDamage,local,along,this.specification.damageScale);
    // A T-bone into the doors hurts more than a nose-on hit into the crumple zone (offline).
    const zone=this.extendedDamage?impactZoneFactor(local,along,DEFINITIONS[this.kind].halfWidth,DEFINITIONS[this.kind].halfLength):1;
    // Shoved sideways behind the rear axle line while moving, the rear tyres break away (PIT).
    if(this.extendedDamage&&this.health>0){const pit=pitStrength(local,along,DEFINITIONS[this.kind].halfLength,this.speed,closing);if(pit>this.rearSlide){if(pit>=.5&&this.rearSlide<.5)this.pitSpins++;this.rearSlide=pit;}}
    this.hit(point,direction,damage*factor*zone,time,false,otherPaint);
  }
  hit(point: T.Vector3, direction: T.Vector3, damage: number, time: number, quiet = false,otherPaint?:T.Color) {
    damage *= this.specification.damageScale;
    this.impactEffects = {glass:false,debris:false};
    if (damage < 0.1 || this.health <= 0) return;
    if(this.onVisualEvent){const inverse=this.root.quaternion.clone().invert();this.onVisualEvent({kind:'hit',pose:[...this.root.position.toArray(),...this.root.quaternion.toArray()],point:point.clone().sub(this.root.position).applyQuaternion(inverse).toArray(),direction:direction.clone().applyQuaternion(inverse).toArray(),damage:damage/this.specification.damageScale,health:this.health,...(otherPaint?{paint:otherPaint.getHex()}:{})});}
    this.health = Math.max(0, this.health - damage);
    this.lastHit = time;
    if(this.extendedDamage&&!quiet){const daze=dazeFor(damage);if(daze>this.dazed){if(!(this.dazed>0))this.dazeSteer=this.input.steer;this.dazed=daze;}}
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
    const worn=Array.from(this.wreckParts.wheelDamage),structureBefore=this.extendedDamage?this.structuralDamage?.slice():undefined,tyreBefore=this.tyreDamage?.slice(),engineBefore=this.engineDamage;
    applyComponentImpact(components,this.kind,local,rotateVehicleVector(direction,inverse),damage);
    // With a bumper, a door or the bonnet gone, there is less left to soak up a hit there (offline).
    if(this.extendedDamage&&structureBefore&&components.structure){
      const gone=(name:string)=>{const a=this.wreckParts.assemblies.find(x=>x.name===name);return !!a&&a.members.every(m=>!m.mesh.visible);};
      const engineEnd=isRearEngineKind(this.kind)?1:0,engineHit=(factor:number)=>{if(engineBefore!==undefined&&components.engineDamage!==undefined)components.engineDamage=exposedDamage(engineBefore,components.engineDamage,factor);};
      for(const [end,name] of [[0,'front-bumper'],[1,'rear-bumper']] as const)if(gone(name)){
        components.structure[end]=exposedDamage(structureBefore[end],components.structure[end],BUMPER_GONE.crush);if(end===engineEnd)engineHit(BUMPER_GONE.engine);}
      for(const [side,doors] of [[2,['door-left','door-rear-left']],[3,['door-right','door-rear-right']]] as const)if(doors.some(gone))components.structure[side]=exposedDamage(structureBefore[side],components.structure[side],COVER_GONE.side);
      if(gone(engineEnd?'engine-lid':'hood'))engineHit(COVER_GONE.engine);
    }
    // A front corner without its wing leaves the tyre and wheel bare: the hit does more to both (offline).
    if(this.extendedDamage)for(const i of [0,1])if(this.wingGone[i]){if(tyreBefore&&components.tyreDamage)components.tyreDamage[i]=exposedDamage(tyreBefore[i],components.tyreDamage[i],EXPOSED_WHEEL.tyre);components.wheelDamage[i]=exposedDamage(worn[i],components.wheelDamage[i],EXPOSED_WHEEL.rim);}
    if (local.x < 0) this.damageLeft += damage;
    else this.damageRight += damage;
    const contact = this.model.worldToLocal(point.clone());
    const zone=contact.y>(this.kind==='trail'?1.85:this.kind==='shuttle'?2.30:this.kind==='van'?1.76:this.kind==='cornet'?2.28:this.kind==='hollins'?1.66:1.35)?'roof':contact.z>DEFINITIONS[this.kind].halfLength*.35?'front':contact.z<-DEFINITIONS[this.kind].halfLength*.35?'rear':contact.x<0?'left':'right';
    this.damageZones[zone]+=damage;
    // Mounts already broken and a huge hit at the engine end: the block drops out (offline).
    if(this.extendedDamage&&!quiet&&this.health>0&&engineDrops(this.mountsBroken,this.engineDamage,damage,zone===(isRearEngineKind(this.kind)?'rear':'front')))this.dropEngine();
    // A big hit on a crushed tank end snaps the fuel tank's straps: it drops and drags on its filler neck (offline).
    if(this.extendedDamage&&!quiet&&this.health>0&&!this.tankDown&&tankDrops((isRearEngineKind(this.kind)?this.structuralDamage?.[0]:this.structuralDamage?.[1])??0,damage,zone===(isRearEngineKind(this.kind)?'front':'rear')))this.dropTank();
    // A smash into the engine end can split a line and light the engine bay at once (offline).
    if(this.extendedDamage&&!quiet&&this.health>0){this.bigHits++;if(smashFire(damage,zone===(isRearEngineKind(this.kind)?'rear':'front'),this.id,this.bigHits)&&!this.igniteRequest){this.igniteRequest=true;this.smashFires++;this.onSetAlight?.(this.id);this.onBreak?.('smashfire',0);}}
    const dentDamage=bodyworkDentDamage(damage);
    const impactDirection = direction.clone().transformDirection(this.model.matrixWorld.clone().invert());
    const assemblies = new Map<string, { panels: T.Mesh[]; damage: number; weight: number }>();
    // Big hits throw what they break off along the blow (offline); slow knocks let parts drop.
    const fling=this.extendedDamage?new T.Vector3().copy(debrisFling(direction,damage)):new T.Vector3();
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
      // A bolt-on front wing comes off only offline, and takes more than a bumper.
      if(name.startsWith('wing-')&&!this.extendedDamage)continue;
      const threshold = (name === 'hood' ? 48 : name.startsWith('mirror') ? 22 : name==='rear-bumper' ? 28 : name.startsWith('wing-') ? WING_OFF.threshold : 32)*(this.extendedDamage?DETACH.threshold:1);
      if (group.damage <= threshold || damage <= (this.extendedDamage?DETACH.blow:7) || group.weight <= .18) continue;
      for (const panel of group.panels) {
        if (quiet) panel.visible = false;
        else {this.fx.detach(panel, this.velocity.clone().multiplyScalar(.65).add(fling));this.burnDebris();}
      }
      if (!quiet) {this.impactEffects.debris = true;this.tetherPart(name);}
      if(name.startsWith('wing-')){this.wingsTorn++;this.wingGone[name==='wing-left'?0:1]=true;}
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
    this.engineDamage=this.engineOut?1:components.engineDamage;
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
    if(this.extendedDamage)for(let i=0;i<4;i++){const w=this.wheels[i];if(w&&!this.wreckParts.wheelLost[i]&&wheelTearsOff(worn[i],damage,this.wreckParts.wheelReach(i,contact)))this.tearOffWheel(i,direction.clone().multiplyScalar(1+fling.length()*.5),quiet);}
    if(structureBefore&&this.structuralDamage){
      // Whole-body crush grows with structural compression, on top of the local dents.
      const delta=this.structuralDamage.map((v,i)=>Math.max(0,v-structureBefore[i]));
      if(delta.some(d=>d>.002)){const frame=this.crushFrame??=this.measureCrushFrame();for(const mesh of [...this.panels,...this.glass])if(mesh.visible&&crushGeometry(mesh,delta,frame,!quiet)&&!quiet)this.crushPending.add(mesh);}
    }
    this.structure.update(this.structuralDamage,this.health);
    if(this.extendedDamage)this.popGlassAndPlates(quiet);
    // The hit that first ruptures the radiator sprays coolant out of the grille in a burst of steam and splashes the ground.
    if(structureBefore&&this.structuralDamage&&!quiet&&(structureBefore[isRearEngineKind(this.kind)?1:0]??0)<RADIATOR.onset&&(this.structuralDamage[isRearEngineKind(this.kind)?1:0]??0)>=RADIATOR.onset){
      const end=isRearEngineKind(this.kind)?-1:1,half=DEFINITIONS[this.kind].halfLength,grille=new T.Vector3(0,.55,end*half*.85).applyQuaternion(this.previousQ).add(this.previous);
      this.fx.emit(grille,RADIATOR_BURST.steam,5,1.2);this.radiatorBursts++;this.onBreak?.('radiator',end>0?0:2);
      const g=this.ground.height(grille.x,grille.z);
      for(let k=0;k<RADIATOR_BURST.splash;k++){this.dripSeed=(Math.imul(this.dripSeed,1664525)+1013904223)>>>0;const r=this.dripSeed/4294967296,x=grille.x+(r-.5)*1.4,z=grille.z+(r*7%1-.5)*1.4;
        this.fx.slicks?.drip(x,g,z,1,r);this.drips[1]++;this.onDrip?.(x,g,z,1,r);}
    }
    if (!quiet) {
      this.fx.impact?.(point, direction, damage);
    }
  }
  /** Doors, barn doors and tailgates with a broken latch swing on their hinges with the car's motion (door-swing.ts); open doors catch the air,
   * and one slammed into its stop with the hinges half gone comes off. */
  private swingDoors(dt:number){
    const v=this.body.linvel(),ax=(v.x-this.velocity.x)/dt,az=(v.z-this.velocity.z)/dt,ay=(v.y-this.velocity.y)/dt;
    const forward=ax*this.forward.x+ay*this.forward.y+az*this.forward.z,lateral=ax*this.right.x+ay*this.right.y+az*this.right.z;
    const upAxis=new T.Vector3(0,1,0).applyQuaternion(this.currentQ),up=9.81*upAxis.y+ax*upAxis.x+ay*upAxis.y+az*upAxis.z;
    for(const a of this.wreckParts.assemblies){
      const lid=lidKind(a.name);
      if(lid){
        if(!doorUnlatched(a.loose,a.damage)||!a.members.some(m=>m.mesh.visible))continue;
        const state={swing:a.swing??0,rate:a.swingRate??0},hit=stepLid(lid,state,lidBase(lid,a.loose),a.name.endsWith('left')?-1:1,forward,lateral,up,dt,this.speed);a.swing=state.swing;a.swingRate=state.rate;
        if(state.swing>.05)this.doorOpenTime+=dt;
        // Wide open, the load starts to fall out of the back.
        if(cargoSpills(lid,lidBase(lid,a.loose)+state.swing))this.spillCargo(lid,dt);
        if(hit>=DOOR_SWING.tear&&a.loose>=DOOR_SWING.tearLoose){this.doorsTorn++;this.ripAssembly(a.name);continue;}
        if(hit>=DOOR_SWING.slam){a.loose=Math.min(1,a.loose+hit*DOOR_SWING.fatigue);this.doorSlams++;}
        continue;
      }
      if(!a.name.startsWith('door')||!doorUnlatched(a.loose,a.damage)||!a.members.some(m=>m.mesh.visible))continue;
      const side=a.name.endsWith('left')?-1:1,base=doorBase(a.loose),door={swing:a.swing??0,rate:a.swingRate??0};
      const hit=stepDoor(door,base,side,forward,lateral,this.speed,dt);a.swing=door.swing;a.swingRate=door.rate;
      if(door.swing>.05)this.doorOpenTime+=dt;
      if(hit>=DOOR_SWING.tear&&a.loose>=DOOR_SWING.tearLoose){this.doorsTorn++;this.ripAssembly(a.name);continue;}
      if(hit>=DOOR_SWING.slam){a.loose=Math.min(1,a.loose+hit*DOOR_SWING.fatigue);this.doorSlams++;}
      const drag=doorDrag(base+door.swing,this.speed);
      if(drag>1){const c=a.bounds.getCenter(new T.Vector3());const at=new T.Vector3(side*DEFINITIONS[this.kind].halfWidth,.6,c.z).applyQuaternion(this.currentQ).add(this.current);
        const k=-Math.sign(this.speed)*drag*dt;this.body.applyImpulseAtPoint({x:this.forward.x*k,y:0,z:this.forward.z*k},at,true);}
    }
  }
  /** One piece of cargo tumbles out of the open back every CARGO.gap seconds until the load is gone. */
  private spillCargo(kind:LidKind,dt:number){
    if(this.cargoLeft<0)this.cargoLeft=CARGO[kind].load;
    this.cargoClock+=dt;if(this.cargoLeft<=0||this.cargoClock<CARGO.gap)return;
    this.cargoClock=0;this.cargoLeft--;this.cargoSpilled++;
    // The first thing out of a sprung boot is the spare wheel: upright and spinning, it lands on its tread and rolls away.
    if(kind==='boot'&&this.cargoLeft===CARGO.boot.load-1&&this.wheels[2]){
      const def=DEFINITIONS[this.kind],rear=this.wheels[2],spare=rear.clone(true);spare.visible=true;spare.quaternion.identity();
      spare.position.set(0,rear.position.y+.2,rear.position.z-(def.halfLength-def.wheelbase/2)-.45);this.model.add(spare);this.model.updateWorldMatrix(true,true);
      this.fx.detachWheel(spare,this.velocity.clone().multiplyScalar(.85).addScaledVector(this.forward,-1.2),vehicleWheelRadius(this.kind),this.speed*.85);spare.removeFromParent();this.spareWheels++;return;
    }
    const [w,h,l]=CARGO[kind].size,crate=new T.Mesh(new T.BoxGeometry(w,h,l),new T.MeshStandardMaterial({color:CARGO[kind].color,roughness:.9}));
    crate.name='cargo_spill';
    // Just clear of the body (inside it the collider would shove the crate up onto the roof), at load-floor height.
    crate.position.set(((this.cargoSpilled*.37)%1-.5)*.6,-.05,-DEFINITIONS[this.kind].halfLength-l*.5-.15);this.root.add(crate);
    const out=this.velocity.clone().multiplyScalar(.85).addScaledVector(this.forward,-1.6).addScaledVector(this.right,((this.cargoSpilled*.61)%1-.5)*1.2);
    this.fx.detach(crate,out);crate.removeFromParent();crate.geometry.dispose();(crate.material as T.Material).dispose();
  }
  /** A heavy front or roof crush pops the windscreen out whole, a heavy rear crush the rear screen; a crushed end sheds its
   * number plate. Replays (quiet) just hide them. */
  private popGlassAndPlates(quiet:boolean){
    const [front=0,rear=0,,,roof=0]=this.structuralDamage??[];
    for(const glass of this.glass){
      if(!glass.visible)continue;
      const screen=GLASS_POP.front.test(glass.name)?front:GLASS_POP.rear.test(glass.name)?rear:-1;if(screen<0)continue;
      if(Math.max(screen,roof)<GLASS_POP.crush)continue;
      if(quiet){glass.visible=false;continue;}
      const out=this.forward.clone().multiplyScalar(GLASS_POP.front.test(glass.name)?2:-2).add(new T.Vector3(0,1.6,0));
      this.fx.detach(glass,this.velocity.clone().multiplyScalar(.7).add(out));this.glassPops++;this.onGlassBreak?.(glass.getWorldPosition(new T.Vector3()));
    }
    for(const plate of this.panels){
      if(!plate.visible||!GLASS_POP.plate.test(plate.name))continue;
      const rest=plate.userData.wreckRest as T.BufferAttribute|undefined,end=rest?new T.Box3().setFromBufferAttribute(rest).getCenter(new T.Vector3()).z:0;
      if((end>=0?front:rear)<GLASS_POP.plateCrush)continue;
      if(quiet){plate.visible=false;continue;}
      this.fx.detach(plate,this.velocity.clone().multiplyScalar(.5));this.platesLost++;
    }
  }
  /** Tear a whole loose assembly (hood, bumper, door, tailgate) away as debris. Replays pass quiet. */
  /** Height of this car's venue ground at (x, z). */
  groundAt(x:number,z:number){return this.ground.height(x,z);}
  /** Doors (and a van's barn doors) swung open past DOOR_CATCH.open, each as a line from its hinge to its free edge in world space (offline). */
  openDoorSpans(){
    const out:{name:string;from:T.Vector3;to:T.Vector3}[]=[];if(!this.extendedDamage)return out;
    const world=(p:{x:number;y:number;z:number})=>new T.Vector3(p.x,p.y,p.z).applyMatrix4(this.model.matrix).applyQuaternion(this.currentQ).add(this.current);
    for(const a of this.wreckParts.assemblies){
      // A van's barn doors swing out behind it from the rear corners.
      if(a.name.startsWith('cargo-')&&a.members.some(m=>m.mesh.visible)){const side=a.name.endsWith('left')?-1:1,open=(a.swing??0)>0?lidBase('cargo',a.loose)+a.swing!:a.loose*.45;if(open<DOOR_CATCH.open)continue;
        const hinge={x:side<0?a.bounds.min.x:a.bounds.max.x,y:(a.bounds.min.y+a.bounds.max.y)/2,z:a.bounds.max.z};out.push({name:a.name,from:world(hinge),to:world(barnDoorTip(hinge,side,a.bounds.max.x-a.bounds.min.x,open))});continue;}
      if(!a.name.startsWith('door')||!((a.swing??0)>0)||!a.members.some(m=>m.mesh.visible))continue;
      const open=doorBase(a.loose)+a.swing!;if(open<DOOR_CATCH.open)continue;
      const side=a.name.endsWith('left')?-1:1,hinge={x:side*DEFINITIONS[this.kind].halfWidth,y:(a.bounds.min.y+a.bounds.max.y)/2,z:a.bounds.max.z-.06};
      const tip=doorTip(hinge,side,a.bounds.max.z-a.bounds.min.z-.06,open);
      out.push({name:a.name,from:world(hinge),to:world(tip)});
    }
    return out;
  }
  /** Tear the engine block out of the car (ENGINE_DROP): it falls under the car as debris and the car is finished. Replays pass
   * quiet and only hide it. */
  dropEngine(quiet=false){
    const engine=this.panels.filter(p=>p.visible&&p.userData.constructionRole==='engine');if(this.engineOut||!engine.length)return false;
    this.engineOut=true;if(!quiet)this.onVisualEvent?.({kind:'rip',pose:this.visualPose(),part:'engine'});
    this.model.updateWorldMatrix(true,true);
    for(const p of engine){if(quiet)p.visible=false;else{this.fx.detach(p,this.velocity.clone().multiplyScalar(.35).add(new T.Vector3(0,-1.5,0)));this.burnDebris();}}
    this.seized=true;this.engineDamage=1;this.rpm=0;if(!quiet){this.impactEffects.debris=true;this.health=0;}
    return true;
  }
  ripAssembly(name:string,quiet=false){
    const a=this.wreckParts.assemblies.find(x=>x.name===name);if(!a||!a.members.some(m=>m.mesh.visible))return false;
    this.onVisualEvent?.({kind:'rip',pose:this.visualPose(),part:name});
    this.model.updateWorldMatrix(true,true);
    for(const m of a.members){
      if(!m.mesh.visible)continue;
      if(quiet)m.mesh.visible=false;else{this.fx.detach(m.mesh,this.velocity.clone().multiplyScalar(.55).add(new T.Vector3(0,1.6,0)));this.burnDebris();}
    }
    if(!quiet){this.impactEffects.debris=true;this.rips++;this.tetherPart(name);}
    return true;
  }
  /** The fuel tank drops on its filler neck under the tank end and hangs there, its far edge on the ground (offline). */
  dropTank(){
    if(this.tankDown)return;this.tankDown=true;
    const end=isRearEngineKind(this.kind)?1:-1,half=DEFINITIONS[this.kind].halfLength,{x,y,z}=TANK_DROP.size;
    const neck=new T.Vector3(0,0,end*half*.55),at=neck.clone().applyQuaternion(this.previousQ).add(this.previous),floor=this.ground.height(at.x,at.z)-this.previous.y;
    const pivot=new T.Group();pivot.name='fuel_tank';pivot.position.set(0,floor+z*Math.sin(TANK_DROP.hang)+y*.5,neck.z);pivot.rotation.x=end*TANK_DROP.hang;
    const tank=new T.Mesh(new T.BoxGeometry(x,y,z),new T.MeshStandardMaterial({color:0x2e2b27,roughness:.6,metalness:.65}));tank.position.z=end*z/2;tank.castShadow=true;pivot.add(tank);
    this.root.add(pivot);this.tankMesh=pivot;this.onBreak?.('tank',0);
  }
  /** Dragged long enough, the tank tears off its neck and is left on the track; the open lines run the car dry (offline). */
  private tearTank(){
    if(this.tankGone||!this.tankMesh)return;this.tankGone=true;this.fuelLevel=Math.min(this.fuelLevel,TANK_DROP.reserve);
    const tank=this.tankMesh.children[0] as T.Mesh;this.root.updateMatrixWorld(true);this.fx.detach(tank,this.velocity.clone().multiplyScalar(.5));
    this.tankMesh.removeFromParent();tank.geometry.dispose();(tank.material as T.Material).dispose();this.tankMesh=null;this.onBreak?.('tankoff',0);
  }
  /** Now and then a torn-off bumper stays on its wire (offline): the last piece detached is handed to onTether. */
  private tetherPart(name:string){
    if(!this.extendedDamage||!this.onTether||(name!=='front-bumper'&&name!=='rear-bumper'))return;
    const piece=this.fx.debris[this.fx.debris.length-1];if(!piece||!tethers(this.id*11+this.tetherRolls++))return;
    this.onTether(name,piece.body,{x:0,y:.1,z:(name==='front-bumper'?1:-1)*DEFINITIONS[this.kind].halfLength*.9});
  }
  private measureCrushFrame():CrushFrame{
    const box=new T.Box3();for(const mesh of this.panels){const rest=mesh.userData.wreckRest as T.BufferAttribute|undefined;if(rest)box.union(new T.Box3().setFromBufferAttribute(rest));}
    return{x:Math.max(.5,Math.abs(box.min.x),Math.abs(box.max.x)),z:Math.max(1,Math.abs(box.min.z),Math.abs(box.max.z)),top:Math.max(.8,box.max.y)};
  }
  private driveLayout():'front'|'rear'|'all'{return isFrontDriveKind(this.kind)?'front':(this.kind==='coupe'||isClassicKind(this.kind)&&this.kind!=='trail')?'rear':'all';}
  /** QA: where the disc glows are, next to their wheels (world positions). */
  discGlowInfo(){return this.discGlows.map((g,i)=>({visible:!!g?.visible,glow:g?.getWorldPosition(new T.Vector3()).toArray(),wheel:this.wheels[i]?.getWorldPosition(new T.Vector3()).toArray(),parent:g?.parent?.name??null,opacity:g?(g.material as T.SpriteMaterial).opacity:0}));}
  /** Hot discs glow through the wheel: an additive sprite between the hub and the rim face, so the disc glows through the spokes, brighter the hotter the disc. */
  private glowDiscs(){
    for(let i=0;i<4;i++){
      const g=discGlow(this.discHeat[i]),w=this.wheels[i];let sprite=this.discGlows[i];
      if(!(g>0)||!w||this.wreckParts.wheelLost[i]){if(sprite)sprite.visible=false;continue;}
      if(!sprite){sprite=new T.Sprite(new T.SpriteMaterial({map:discGlowTexture(),color:0xff5a1a,blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
        const r=vehicleWheelRadius(this.kind);sprite.scale.set(r*1.15,r*1.15,1);(w.parent??this.root).add(sprite);this.discGlows[i]=sprite;}
      sprite.visible=true;(sprite.material as T.SpriteMaterial).opacity=g*.85;
      sprite.position.copy(w.position);sprite.position.x+=(i%2?1:-1)*.05;
    }
  }
  /** Every SHED.every s, weigh what has left the car and give the body its new mass, centre of mass and inertia. A repair
   * brings the parts back, so the next weigh restores the car as built. */
  private reweigh(dt:number){
    if((this.shedClock+=dt)<SHED.every)return;this.shedClock=0;
    const parts:ShedPart[]=[],c=new T.Vector3();
    let doors=0,lids=0,hood=false,panes=0,windscreen=false;
    for(const a of this.wreckParts.assemblies)if(a.members.length&&a.members.every(m=>!m.mesh.visible)){a.bounds.getCenter(c);parts.push({kg:assemblyMass(a.name),x:c.x,y:c.y,z:c.z});
      if(a.name.startsWith('door'))doors++;else if(a.name==='hood')hood=true;else if(/tailgate|hatch|engine-lid|cargo/.test(a.name))lids++;}
    for(let i=0;i<4;i++)if(this.wreckParts.wheelLost[i]){const p=this.controller.wheelChassisConnectionPointCs(i);if(p)parts.push({kg:SHED.kg.wheel,x:p.x,y:p.y,z:p.z});}
    // Door and tailgate windows go with their assembly and are already weighed in it.
    const carried=new Set(this.wreckParts.assemblies.flatMap(a=>a.members.map(m=>m.mesh)));
    for(const g of this.glass){
      if(g.visible||carried.has(g))continue;
      if(GLASS_POP.front.test(g.name))windscreen=true;else panes++;
      if(!g.geometry.boundingBox)g.geometry.computeBoundingBox();const b=g.geometry.boundingBox!;
      b.getCenter(c);parts.push({kg:glassMass(b.getSize(new T.Vector3())),x:c.x,y:c.y,z:c.z});
    }
    if(this.exhaustGone)parts.push({kg:SHED.kg.exhaust,x:isRearEngineKind(this.kind)?.35:-.35,y:-.25,z:-DEFINITIONS[this.kind].halfLength});
    this.openness=openness({windscreen,panes,doors,hood,lids});
    const kg=parts.reduce((n,p)=>n+(p.kg>0?p.kg:0),0);
    if(Math.abs(kg-this.shedKg)<SHED.step&&!(kg===0&&this.shedKg>0))return;
    const base=this.shedBase??={mass:this.body.mass(),com:this.body.localCom(),inertia:this.body.principalInertia(),frame:this.body.principalInertiaLocalFrame(),offset:this.collider.translationWrtParent()??{x:0,y:0,z:0}};
    // Weight in the body's frame; the chassis collider carries all of the mass, offset from the body by `offset`.
    const m=shedMassProperties({mass:base.mass,com:{x:base.com.x-base.offset.x,y:base.com.y-base.offset.y,z:base.com.z-base.offset.z},inertia:base.inertia},
      parts.map(p=>({kg:p.kg,x:p.x-base.offset.x,y:p.y-base.offset.y,z:p.z-base.offset.z})));
    this.collider.setMassProperties(m.mass,m.com,m.inertia,base.frame);this.body.recomputeMassPropertiesFromColliders();this.shedKg=m.kg;
  }
  /** A wheel whose nuts have worked off leaves the car on the move; replays get it as a 'wheel-N' rip. */
  shedWheel(i:number,quiet=false){
    if(this.wreckParts.wheelLost[i]||!this.wheels[i])return false;
    if(!quiet){this.onVisualEvent?.({kind:'rip',pose:this.visualPose(),part:`wheel-${i}`});this.wheelsShed++;}
    this.wheelShimmy[i]=0;this.tearOffWheel(i,this.right.clone().multiplyScalar(i%2?1:-1),quiet);return true;
  }
  private tearOffWheel(i:number,direction:T.Vector3,quiet:boolean){
    const w=this.wheels[i],contact=this.tireContacts[i];this.wreckParts.wheelLost[i]=1;
    contact.active.value=0;contact.load.value=0;
    if(!quiet){
      const outward=new T.Vector3(i%2?1:-1,.35,0).applyQuaternion(this.root.quaternion).multiplyScalar(2.4).addScaledVector(direction,1.2);
      const fx=this.fx as Effects&{detachWheel?:Effects['detachWheel']};
      fx.detachWheel?.(w,this.velocity.clone().multiplyScalar(.85).add(outward),vehicleWheelRadius(this.kind),this.speed);this.burnDebris();
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
