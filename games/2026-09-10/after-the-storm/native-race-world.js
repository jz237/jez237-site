import {NATIVE_HULL_STEP} from './native-hull.js';
import {stepNativeRaceAdapter,nativeRaceSnapshot,latchNativeRaceAdapterControls,prepareNativeRaceAdapterFrame,completeNativeRaceAdapterFrame,completeNativeRaceAdapterInactiveFrame} from './native-race-adapter.js';
import {createNativeWaterCellSurface} from './native-water.js';
import {isHostRaceWater,advanceRaceWaterFrame} from './race-water.js';
import {createNativeCraftContactStates,refreshNativeCraftContactState,applyNativeCraftContacts,nativeCraftContactSnapshot} from './native-craft-contact.js';

// One owner of the ordinary source simulation schedule. The source has five
// interleaved hull ticks, with one global craft-contact pass before visiting
// racers in descending order on EACH tick. Each individual completed hull fit
// refreshes its four cached proxies before the next global pass.
// After the fifth pass come water/cameras and floating evolution. Independent
// per-racer accumulators would expose different water histories to opponents.
// Source timers advance50ms per five-pass update: .01/.05 are GAME seconds.
// Original dispatch requests3VI and holds at most one pending update. Browser
// wall-time accumulation is a separate host policy, not that original queue.
// Simulation0 keeps the outer clock/input/summary/camera updates but skips
// hull/contact passes, actor solves and water forcing/evolution. clockTicks
// belongs to that outer clock; ticks counts actual physical hull work only.
// Actor transitions, scoring, AI decisions and course collision discovery
// remain in their own modules. This is the ordinary scene schedule;
// scripted source scene21 and its separate clock are not inferred from a UI.
const H=NATIVE_HULL_STEP,TICKS_PER_FRAME=5;
const known=new WeakSet(),adapterOwners=new WeakMap(),waterOwners=new WeakMap();
const finite=Number.isFinite;
const copy=v=>({x:v.x,y:v.y,z:v.z});
function interval(dt){if(!finite(dt)||dt<0||dt>1)throw new RangeError('Native world interval must be from0 to1 second');}
function owned(world){if(!known.has(world))throw new TypeError('Expected a native race world');}
function aligned(world){
 if(world.water.frames!==world.frames||world.water.rollerFrames!==world.frames||world.water.remainder!==0)
  throw new Error('Native world water was stepped outside its owner');
 for(const [i,a]of world.adapters.entries()){
  if(a.hull.ticks!==world.ticks||a.logicalFrames!==world.frames||a.remainder!==0||a.pendingFrameCompletion||a.inactiveTicks!==0)
   throw new Error('Native world adapters must share its exclusive clock');
  if(nativeCraftContactSnapshot(world.craftContactStates[i]).tick!==world.ticks)
   throw new Error('Native craft proxy history must share the exclusive hull clock');
 }
}
function cameraCraft(adapter){
 const {hull}=adapter;
 return {x:hull.center.x,y:hull.center.y,z:hull.center.z,
  sourceForwardXZ:[hull.frame.forward.x,hull.frame.forward.z],
  sourcePoseState:Math.max(0,adapter.lastFrame.actorState),sourcePoseTimer:adapter.lastFrame.animationFrame??0};
}
function optionsAt(value,time,frame,index){
 const options=typeof value==='function'?value(time,frame,index):value;
 if(!options||typeof options!=='object'||Array.isArray(options))throw new TypeError('Expected frame options');
 if(options.surface!==undefined)throw new TypeError('Native world owns the raw-cell water surface');
 return {...options};
}

/**
 * Attach already configured adapters at an outer-frame boundary. Rider rigs,
 * tune fields, actor state and contact hooks must be chosen explicitly before
 * attachment. No synthetic joint or inferred actor is constructed here.
 * humanIndices is P1/P2 order, independent of descending hull visitation.
 * beforeFrame(world,context) runs before ALL descending input samples. It is
 * the explicit owner hook for ascending navigation/global source updates;
 * rendering, inactive calls and fractional intervals cannot invoke it.
 * beforeActor(world,context) runs within each descending completed-frame body,
 * after its hull summary and before its actor decision/pose. Cross-body writes
 * therefore reach the following rider before that rider's decision.
 * beforeWater runs after all completed actors, before camera/water selection.
 * It may update frame.water for source course changes at this boundary.
 * afterFrame(world,context), when supplied, runs AFTER water exactly once per
 * completed frame; it is the caller's slot for native floating-object updates.
 * With deferWaterRollers:true it must also consume the water's roller stage
 * after judging and object motion, even if course activity holds that stage.
 * afterTick(world,context) runs only for actual physical ticks, after any completed
 * frame's water. Use it for fixed-clock control-facing pose/rate history.
 * Returning false from afterFrame ends this step at that frame and discards
 * unused elapsed time; it supports terminal race results, not a pause timer.
 */
export function createNativeRaceWorld({adapters,water,humanIndices=[0],beforeFrame=null,beforeActor=null,beforeWater=null,afterFrame=null,afterTick=null,craftContacts=true,deferWaterRollers=false}={}){
 if(!Array.isArray(adapters)||adapters.length<1||adapters.length>4||new Set(adapters).size!==adapters.length)
  throw new TypeError('Expected one to four distinct native race adapters');
 if(!isHostRaceWater(water))throw new TypeError('Native world requires host water, not a presentation snapshot');
 if(waterOwners.has(water))throw new Error('Water already belongs to a native world');
 if(!Array.isArray(humanIndices)||humanIndices.length!==water.players||new Set(humanIndices).size!==humanIndices.length||
  humanIndices.some(i=>!Number.isInteger(i)||i<0||i>=adapters.length))throw new RangeError('Human indices must match the water cameras');
 if(beforeFrame!==null&&typeof beforeFrame!=='function')throw new TypeError('beforeFrame must be a function');
 if(beforeActor!==null&&typeof beforeActor!=='function')throw new TypeError('beforeActor must be a function');
 if(beforeWater!==null&&typeof beforeWater!=='function')throw new TypeError('beforeWater must be a function');
 if(afterFrame!==null&&typeof afterFrame!=='function')throw new TypeError('afterFrame must be a function');
 if(afterTick!==null&&typeof afterTick!=='function')throw new TypeError('afterTick must be a function');
 if(typeof craftContacts!=='boolean')throw new TypeError('craftContacts must be an explicit boolean');
 if(typeof deferWaterRollers!=='boolean'||deferWaterRollers&&afterFrame===null)
  throw new TypeError('Deferred water rollers require an afterFrame owner');
 const ticks=water.frames*TICKS_PER_FRAME;
 for(const a of adapters){
  if(!a?.hull||a.hull.points?.length!==12||a.hull.scale!==water.scale||a.hull.ticks!==ticks||
   a.logicalFrames!==water.frames||a.remainder!==0||a.pendingFrameCompletion||a.preparedHullTick===ticks||a.sampledHullTick!==null)
   throw new RangeError('Adapters must match the water scale and completed-frame clock');
  if(adapterOwners.has(a))throw new Error('Adapter already belongs to a native world');
 }
 if(water.remainder!==0||water.rollerFrames!==water.frames)throw new RangeError('Water must have no independent clock remainder or pending roller stage');
 const surface=createNativeWaterCellSurface(water.field);
 const craftContactStates=createNativeCraftContactStates(adapters.map(a=>a.hull));
 const world={adapters:adapters.slice(),water,
  humanIndices:humanIndices.slice(),surface,beforeFrame,beforeActor,beforeWater,afterFrame,afterTick,ticks,clockTicks:ticks,frames:water.frames,remainder:0,
  craftContacts,deferWaterRollers,craftContactStates,craftContactPasses:0,craftContactCount:0,frameCraftContacts:[],
  stepsLast:0,framesLast:0,frame:null,busy:false,fault:null};
 for(const a of adapters){a.surface=surface;adapterOwners.set(a,world);}
 waterOwners.set(water,world);known.add(world);return world;
}

/**
 * Inputs is one object or adapter-compatible input provider per racer. Each is
 * sampled only at an outer-frame boundary. adapterOptions (array of objects or
 * providers(time,logicalFrame,index)) and waterOptions are latched there too.
 * Host-paused calls (active:false) ignore dt and preserve fractional remainder.
 * Source simulation0 still advances outer frames while physical work is held.
 * No display, replay or separate-window snapshot can advance this coordinator.
 * Hook failures fault the owner explicitly; continuing a half-stepped world is
 * forbidden. Recreate from an authoritative reset rather than hiding skew.
 */
export function stepNativeRaceWorld(world,dt,inputs,{active=true,adapterOptions=[],waterOptions={}}={}){
 owned(world);interval(dt);
 if(typeof active!=='boolean')throw new TypeError('active must be boolean');
 if(world.busy)throw new Error('Native world stepping is not reentrant');
 if(world.fault)throw new Error('Native world is faulted; reset is required',{cause:world.fault});
 aligned(world);world.stepsLast=0;world.framesLast=0;
 if(!active||dt===0)return world;
 if(!Array.isArray(inputs)||inputs.length!==world.adapters.length||inputs.some(v=>!v||!['object','function'].includes(typeof v)))
  throw new TypeError('Inputs must contain one control object or provider per adapter');
 if(!Array.isArray(adapterOptions)||adapterOptions.length>world.adapters.length)throw new TypeError('adapterOptions must be a per-racer array');
 world.remainder+=dt;world.busy=true;
 try{
  while(world.remainder+1e-12>=H){
   if(world.clockTicks%TICKS_PER_FRAME===0){
    const time=world.clockTicks*H,frame=world.frames;
    const perRacer=world.adapters.map((_,i)=>optionsAt(adapterOptions[i]??{},time,frame,i));
    const nextWater=typeof waterOptions==='function'?waterOptions(time,frame):waterOptions;
    if(!nextWater||typeof nextWater!=='object'||Array.isArray(nextWater))throw new TypeError('Expected water frame options');
    world.frame={perRacer,water:{...nextWater}};
    if(world.beforeFrame)world.beforeFrame(world,{logicalFrame:frame,time,step:H*TICKS_PER_FRAME});
    for(let i=world.adapters.length-1;i>=0;i--)latchNativeRaceAdapterControls(world.adapters[i],inputs[i],perRacer[i]);
    for(let i=world.adapters.length-1;i>=0;i--)prepareNativeRaceAdapterFrame(world.adapters[i],inputs[i],perRacer[i]);
    const scene=world.adapters[0].frame.simulationState;
    if(world.adapters.some(a=>a.frame.simulationState!==scene))throw new Error('Native simulation state is shared by the whole scene');
    // Simulation0 still has input/preparation/summary and camera/display
    // updates. Only its hull loop and water evolution are suppressed.
    world.frame.simulationState=scene;world.frameCraftContacts=[];
   }
   const inactive=world.frame.simulationState===0;
   if(!inactive){
    if(typeof world.craftContacts!=='boolean')throw new TypeError('craftContacts must remain boolean');
    const enabled=world.craftContacts;
    const collision=applyNativeCraftContacts(world.adapters.map((a,i)=>({hull:a.hull,
     contactState:world.craftContactStates[i],impacts:a.impacts})),{enabled});
    if(enabled)world.craftContactPasses++;
    world.craftContactCount+=collision.contacts.length;
    // At most five passes of96 pair/proxy contacts in one source outer frame.
    // These are bounded display diagnostics; impacts remain owned by adapters.
    for(const event of collision.contacts)world.frameCraftContacts.push({tick:world.ticks,...event});
    for(let i=world.adapters.length-1;i>=0;i--){
     const a=world.adapters[i];
     stepNativeRaceAdapter(a,H,inputs[i],{...world.frame.perRacer[i],surface:world.surface,deferFrameCompletion:true});
     refreshNativeCraftContactState(world.craftContactStates[i],a.hull);
    }
    world.ticks++;world.stepsLast++;
   }
   world.clockTicks++;world.remainder=Math.max(0,world.remainder-H);
   if(world.clockTicks%TICKS_PER_FRAME===0){
    for(let i=world.adapters.length-1;i>=0;i--)(inactive?completeNativeRaceAdapterInactiveFrame:completeNativeRaceAdapterFrame)(world.adapters[i],{
     beforeActorDecision:world.beforeActor?()=>world.beforeActor(world,{racerIndex:i,logicalFrame:world.frames+1,time:world.clockTicks*H,step:H*TICKS_PER_FRAME}):undefined});
    if(world.beforeWater)world.beforeWater(world,{logicalFrame:world.frames+1,time:world.clockTicks*H,step:H*TICKS_PER_FRAME});
    advanceRaceWaterFrame(world.water,world.humanIndices.map(i=>cameraCraft(world.adapters[i])),{...world.frame.water,simulationActive:!inactive,deferRollers:world.deferWaterRollers});
    world.frames++;world.framesLast++;
   }
   // Control-facing pose/rate history must use this physical clock. Updating
   // it again on a render refresh makes a feedback controller FPS-dependent.
   if(!inactive&&world.afterTick)world.afterTick(world,{tick:world.ticks,logicalFrame:world.frames,time:world.ticks*H,step:H});
   if(world.clockTicks%TICKS_PER_FRAME===0&&world.afterFrame){
    const keepRunning=world.afterFrame(world,{logicalFrame:world.frames,time:world.clockTicks*H,step:H*TICKS_PER_FRAME});
    if(world.water.rollerFrames!==world.frames)throw new Error('Native afterFrame must complete its course roller stage');
    if(keepRunning===false){world.remainder=0;break;}
   }
  }
 }catch(error){world.fault=error;throw error;}finally{world.busy=false;}
 return world;
}

/** Detached diagnostics. The water field itself is never exported here. */
export function nativeRaceWorldSnapshot(world){
 owned(world);
 return {simulationTime:world.clockTicks*H,hullTime:world.ticks*H,clockTicks:world.clockTicks,ticks:world.ticks,logicalFrames:world.frames,remainder:world.remainder,
  waterRevision:world.water.revision,waterPhase:world.water.field.phaseCounter,
  craftContacts:{enabled:world.craftContacts,passes:world.craftContactPasses,contacts:world.craftContactCount,
   frameContacts:structuredClone(world.frameCraftContacts),proxies:world.craftContactStates.map(nativeCraftContactSnapshot)},
  humanIndices:world.humanIndices.slice(),racers:world.adapters.map(nativeRaceSnapshot),
  cameraCraftPositionsNative:world.water.previousPositions.map(copy),faulted:!!world.fault};
}
