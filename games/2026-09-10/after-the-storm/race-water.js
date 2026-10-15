import {createNativeWaterField,seedNativeWaterNoise,queryNativeWaterField,
 createNativeWaterPatch,stepNativeWaterPatch,forceNativeWaterLine} from './native-water-field.js';
import {createNativeWaterFollowCamera,stepNativeWaterFollowCamera,nativeWaterCameraBasis,
 nativeWaterAmplitudeThreshold,planNativeWaterFrame} from './native-water-schedule.js';

// Host-owned source water. The source camera below selects simulation cells;
// the high-resolution presentation camera and mesh remain independently owned.
// The50ms outer step is recovered source GAME time; .025 world scale and
// browser wall-time accumulation remain explicit host policy.
// The seeded random stream is reproducible browser history, not the original
// global PRNG state. No unrecorded warm-up, modern swell or height cap is added.
export const RACE_WATER_STEP=.05;
const SIZE=128*384;
const F=Math.fround,presentationVelocity=new Int16Array(SIZE),presentationFields=new WeakMap();
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const tuple=p=>p&&[p.x,p.y,p.z].every(finite);
const copy=p=>({x:p.x,y:p.y,z:p.z});
const known=new WeakSet();
function datum(value){
 if(!Number.isInteger(value)||value< -32768||value>32767)throw new RangeError('Native water datum must be signed16');
 return value;
}
function craftPose(craft,scale){
 const h=craft.hydro;
 const position={x:craft.x/scale,y:(h?.y??craft.y??0)/scale,z:craft.z/scale};
 if(!tuple(position))throw new TypeError('Water camera needs finite craft XYZ');
 // The point hull supplies its actual body+6c/+74 forward components. Their
 // horizontal magnitude includes pitch; normalizing them or rebuilding them
 // from heading changes the source camera lag and consequently the water.
 const forward=craft.sourceForwardXZ;
 if(forward!==undefined){
  if(!Array.isArray(forward)||forward.length!==2||!forward.every(finite)||Math.hypot(...forward)===0)
   throw new TypeError('sourceForwardXZ must be finite and nonzero');
  return {position,forward:forward.slice()};
 }
 if(!finite(craft.heading))throw new TypeError('Water camera needs heading or sourceForwardXZ');
 return {position,forward:[Math.sin(craft.heading),Math.cos(craft.heading)]};
}
export const isHostRaceWater=state=>known.has(state);
export function createRaceWaterRandom(seed){
 // Separate from scenery, physics and driver RNG. Captured initialization
 // therefore survives restart without consuming another subsystem's history.
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw new RangeError('Source random seed must be uint32');
 let value=seed>>>0;
 // The source water consumer masks the LOW15 bits of this full32-bit LCG.
 // Other source consumers share its global state; the browser owns an explicit
 // isolated initialization seed so stored ghosts can reproduce their water.
 const next=()=>{value=(Math.imul(value,0x41c64e6d)+0x3039)>>>0;return value&0x7fff;};
 Object.defineProperty(next,'state',{get:()=>value});return next;
}

/** Create only after class/mode/player-count selection has chosen source rows. */
export function createRaceWater({crafts,variant=0,scale=.025,baseAmplitudeNative,
 primaryPointsNative=[],boundaryPointsNative=[],amplitudeThresholdNative,
 datumNative=0,period=20,seed=17,phaseCounter=0,random15,
 initialNoise=true,zoomIndex=1,cameraProvider=null}={}){
 if(!Array.isArray(crafts)||crafts.length<1||crafts.length>2)throw new TypeError('Expected one or two human water cameras');
 if(!finite(scale)||scale<=0)throw new RangeError('Water scale must be positive');
 if(!Number.isInteger(baseAmplitudeNative)||baseAmplitudeNative<0||baseAmplitudeNative>127)throw new RangeError('Explicit source amplitude is required');
 if(variant===1)throw new RangeError('Special random-disturbance water needs its separate producer');
 if(!Number.isInteger(period)||period<1||period>65535)throw new RangeError('Invalid source water period');
 if(!Number.isSafeInteger(seed))throw new TypeError('Water seed must be an integer');
 if(cameraProvider!==null&&typeof cameraProvider!=='function')throw new TypeError('cameraProvider must be a function');
 const field=createNativeWaterField({variant,players:crafts.length,datumNative:datum(datumNative),phaseCounter});
 const poses=crafts.map(c=>craftPose(c,scale));
 const follows=poses.map(p=>createNativeWaterFollowCamera({positionNative:Object.values(p.position),forwardXZ:p.forward,zoomIndex,datumNative}));
 // Field setup clears saved patch centers without stamping or evolving them.
 // Camera mode3 copies its unit-eye template and produces a basis, then mode4
 // first solves ordinary type5 AFTER the first five hull ticks (also in Stunt).
 const cameras=poses.map(()=>nativeWaterCameraBasis({eyeNative:[1,1,1],targetNative:[0,0,0],up:[0,1,0],fovDegrees:75,nearNative:10,projectionOffset:[0,3]}));
 if(initialNoise)seedNativeWaterNoise(field,{amplitudeNative:baseAmplitudeNative,random15:random15??createRaceWaterRandom(seed>>>0)});
 const state={field,scale,variant,players:crafts.length,baseAmplitudeNative,period,seed,zoomIndex,
  amplitudeThresholdNative:amplitudeThresholdNative??nativeWaterAmplitudeThreshold({primaryPointsNative,boundaryPointsNative}),
  follows,cameras,previousPositions:poses.map(p=>copy(p.position)),
  previousPatchCentersNative:crafts.map(()=>({xNative:0,zNative:0})),
  cameraProvider,remainder:0,frames:0,stepsLast:0,revision:0,lastPlan:null};
 known.add(state);return state;
}

/**
 * One AFTER-hull outer boundary. The native hull host should call this after
 * all five ticks of every craft. A modern 60Hz rigid hull can also call the
 * accumulator below; that scheduling bridge does not make its hull native.
 * Previous snapped camera centers/orientation select forcing; the new camera
 * selects P2 then P1 patches. Paused callers must not consume elapsed time.
 */
export function advanceRaceWaterFrame(state,crafts,{datumNative=state?.field.datumNative,zoomIndex=state?.zoomIndex}={}){
 if(!known.has(state))throw new TypeError('Expected host race water');
 if(!Array.isArray(crafts)||crafts.length!==state.players)throw new TypeError('Human camera count changed');
 datum(datumNative);
 const poses=crafts.map(c=>craftPose(c,state.scale));
 const updates=poses.map((p,i)=>stepNativeWaterFollowCamera(state.follows[i],{
  positionNative:Object.values(p.position),forwardXZ:p.forward,
  velocityXZ:[p.position.x-state.previousPositions[i].x,p.position.z-state.previousPositions[i].z],
  datumNative,zoomIndex}));
 const cameras=updates.map((q,i)=>state.cameraProvider?state.cameraProvider(crafts[i],q.camera,{playerIndex:i,frame:state.frames+1}):q.camera);
 const plan=planNativeWaterFrame({variant:state.variant,players:state.players,
  camerasBeforeUpdate:state.cameras,camerasAfterUpdate:cameras,
  previousPatchCentersNative:state.previousPatchCentersNative,
  craftPositionsNative:poses.map(p=>[p.position.x,p.position.z]),
  baseAmplitudeNative:state.baseAmplitudeNative,period:state.period,
  amplitudeThresholdNative:state.amplitudeThresholdNative,datumNative});
 // The plan is pure. No phase is consumed until every camera input validated.
 state.field.datumNative=datumNative;
 for(const forcing of plan.forcing)forceNativeWaterLine(state.field,forcing);
 const centers=state.previousPatchCentersNative.slice();
 for(const spec of plan.patches){
  const patch=createNativeWaterPatch(state.field,spec);
  if(spec.evolve)stepNativeWaterPatch(state.field,patch);
  centers[spec.playerIndex]={xNative:patch.snappedCenterNative.x,zNative:patch.snappedCenterNative.z};
 }
 state.follows=updates.map(q=>q.state);state.cameras=cameras;
 state.previousPositions=poses.map(p=>copy(p.position));state.previousPatchCentersNative=centers;
 state.zoomIndex=zoomIndex;state.frames++;state.revision++;state.lastPlan=plan;
 return state;
}

export function stepRaceWater(state,crafts,dt,{active=true,...options}={}){
 if(!known.has(state))throw new TypeError('Expected host race water');
 if(!finite(dt)||dt<0||dt>1)throw new RangeError('Water interval must be from0 to1 second');
 if(typeof active!=='boolean')throw new TypeError('active must be boolean');
 state.stepsLast=0;if(!active)return state;
 state.remainder+=dt;
 while(state.remainder+1e-12>=RACE_WATER_STEP){
  advanceRaceWaterFrame(state,crafts,options);
  state.remainder=Math.max(0,state.remainder-RACE_WATER_STEP);state.stepsLast++;
 }
 return state;
}

/** Exact rendered triangle height in world units, including the signed datum. */
export function raceWaterHeight(state,x,z){
 if(!known.has(state))throw new TypeError('Expected host race water');
 return queryNativeWaterField(state.field,F(F(x)*F(1/state.scale)),F(F(z)*F(1/state.scale))).renderHeightNative*state.scale;
}

/** Display-only bounded snapshots contain no field velocity, RNG or camera state. */
export function captureRaceWater(state){
 if(!state)return null;
 if(!known.has(state))throw new TypeError('Expected host race water');
 return {heightQ:state.field.heightQ.slice(),datumNative:state.field.datumNative,scale:state.scale,revision:state.revision};
}
export function readRaceWater(value){
 if(value===null||value===undefined)return null;
 if(!validPresentation(value))return false;
 return {heightQ:value.heightQ.slice(),datumNative:value.datumNative,scale:value.scale,revision:value.revision};
}
function validPresentation(value){
 return !!value&&value.heightQ instanceof Int16Array&&value.heightQ.length===SIZE&&
  Number.isInteger(value.datumNative)&&value.datumNative>= -32768&&value.datumNative<=32767&&
  finite(value.scale)&&value.scale>0&&value.scale<=1&&
  Number.isSafeInteger(value.revision)&&value.revision>=0;
}

// The surrounding game already has one active water context for its analytic
// ocean. Switching that context to a race or a read-only replay never steps it.
let activeWater=null;
export function setRaceWater(state){
 if(state!==null&&!known.has(state)&&!validPresentation(state))throw new TypeError('Invalid race water context');
 activeWater=state;
}
export const currentRaceWater=()=>activeWater;
export function activeRaceWaterHeight(x,z){
 if(!activeWater)return null;
 let field=activeWater.field;
 if(!field){
  field=presentationFields.get(activeWater);
  if(!field){field={heightQ:activeWater.heightQ,datumNative:activeWater.datumNative,velocityQ:presentationVelocity};presentationFields.set(activeWater,field);}
 }
 return queryNativeWaterField(field,F(F(x)*F(1/activeWater.scale)),F(F(z)*F(1/activeWater.scale))).renderHeightNative*activeWater.scale;
}
