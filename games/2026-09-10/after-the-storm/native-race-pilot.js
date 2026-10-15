// Authored helm policy for the opt-in Sunny Beach native time-trial preview.
// This is not the original AI. It reads the actual native presentation pose
// and the existing navigation anchors; it never changes a physical point,
// course, timer, buoy state, power, miss counter or lap. Use one pilot per race
// and craft, starting at the grid, and reset it when restarting the race.

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const neutral=()=>({throttle:0,steer:0,brake:false,lean:0,dampen:false,slide:false});
const copy=value=>structuredClone(value);

/** These are driving choices in world metres/seconds, not source constants. */
export const NATIVE_RACE_PILOT_POLICY=Object.freeze({
 straightSpeedWorld:16,cornerSpeedWorld:10,
 minLookaheadWorld:16,lookaheadSeconds:.8,velocityPredictionSeconds:0,
 headingGain:6,yawDamping:1.5,
 cornerDistanceWorld:25,cornerSlowdown:1.5,
 speedHysteresisWorld:.25,waypointRadiusWorld:.8,
 steeringEngineThreshold:.6,steeringEngineMaxSpeedWorld:24
});

const ranges={straightSpeedWorld:[1,80],cornerSpeedWorld:[1,80],
 minLookaheadWorld:[.1,100],lookaheadSeconds:[0,4],velocityPredictionSeconds:[0,2],
 headingGain:[0,30],yawDamping:[0,10],cornerDistanceWorld:[.1,150],cornerSlowdown:[0,10],
 speedHysteresisWorld:[0,5],waypointRadiusWorld:[.01,5],
 steeringEngineThreshold:[0,1],steeringEngineMaxSpeedWorld:[1,80]};
function drivingPolicy(overrides){
 if(!overrides||typeof overrides!=='object'||Array.isArray(overrides))throw new TypeError('Expected a driving-policy object');
 for(const key of Object.keys(overrides))if(!Object.hasOwn(ranges,key))throw new TypeError(`Unknown native pilot policy ${key}`);
 const result={...NATIVE_RACE_PILOT_POLICY,...overrides};
 for(const [key,[min,max]]of Object.entries(ranges))if(!Number.isFinite(result[key])||result[key]<min||result[key]>max)throw new RangeError(`${key} is outside its driving-policy range`);
 if(result.cornerSpeedWorld>result.straightSpeedWorld)throw new RangeError('cornerSpeedWorld must not exceed straightSpeedWorld');
 return Object.freeze(result);
}

/**
 * input(state,racer=state.racers[0]) returns ordinary browser controls. The
 * decision is held for a native 50ms logical frame, independently of repeated
 * render calls. For exact control sampling, pass a logical-frame provider to
 * the native host: stepRace(state,()=>pilot.input(state,racer),renderDt).
 * Passing the returned object instead holds the caller's last sampled input.
 * Digital A/coast pacing includes a bounded steering reserve:
 * releasing A until the jet drains also removes its turning force. B/R and
 * fore/aft trim are left released. The heading servo produces raw normalized
 * stick travel BEFORE native-controls applies its signed square curve. Yaw
 * feedback averages the actual heading change over the previous logical
 * control interval; a single10ms water-impact rate is too noisy for this helm.
 *
 * The carrot follows the unchanged polyline with speed-based lookahead.
 * Passing a waypoint's perpendicular plane advances only the private steering
 * cursor, even after an overshoot. It awards no course progress. Source buoy
 * observations below are diagnostics only and never influence the controls.
 *
 * diagnostics() returns copies, including bounded source-row transition
 * observations. Their sourcePosition is the judge's last latched position;
 * sideMarginWorld is a geometric diagnostic, not a replacement Float32 judge.
 */
export function createNativeRacePilot({course,policy={},traceLimit=256}={}){
 if(course?.sourceWaterCourseIndex!==1||!Array.isArray(course.anchors)||course.anchors.length<3)
  throw new TypeError('Native pilot requires Sunny Beach source navigation');
 const anchors=course.anchors.map(p=>{
  if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite))throw new TypeError('Navigation anchors must be finite x/z pairs');
  return [...p];
 });
 if(!Number.isInteger(traceLimit)||traceLimit<0||traceLimit>4096)throw new RangeError('traceLimit must be from0 to4096');
 const config=drivingPolicy(policy),sourceNodes=new Map((course.sourceBuoyLayout?.nodes??[]).map(n=>[n.sourceRow,n]));
 let binding=null,index=0,circuits=1,start=null,stamp=-1,held=neutral(),throttle=true,last=null,previousProgress=null;
 let samples=0,coastFrames=0,reserveFrames=0,transitions=[];

 function pose(state,racer){
  if(state?.physics!=='native'||!state.nativeHost?.world||!Array.isArray(state.racers))throw new TypeError('Expected an opt-in native race');
  const player=state.racers.indexOf(racer),p=state.nativeHost.presentations?.[player]?.racer;
  if(player<0||!p||!['x','z','vx','vz','speed','heading','yawVelocity'].every(k=>Number.isFinite(p[k])))throw new TypeError('Expected the actual native craft presentation');
  if(state.course?.sourceWaterCourseIndex!==1||state.course.difficulty!==course.difficulty)throw new RangeError('Pilot course/class does not match this race');
  if(binding&&(binding.state!==state||binding.racer!==racer))throw new RangeError('Reset the pilot before binding another race or craft');
  binding??={state,racer};
  return p;
 }

 function observe(state,racer,p){
  if(!racer.sourceBuoys)return;
  const now={row:racer.sourceBuoys.nextSourceRow,misses:racer.misses,passed:racer.passed,lap:racer.lap,
   logicalTick:racer.sourceBuoys.logicalTicks};
  if(previousProgress&&(now.row!==previousProgress.row||now.misses!==previousProgress.misses||now.lap!==previousProgress.lap)){
   const n=sourceNodes.get(previousProgress.row),position=racer.sourceBuoyPrevious??p;
   const lateral=n?n.tz*(position.x-n.x)-n.tx*(position.z-n.z):null;
   const margin=n?.classification===0?25*(course.sourceBuoyLayout.scale??.025)-lateral:
    n?.classification===1?lateral+25*(course.sourceBuoyLayout.scale??.025):null;
   if(traceLimit){
    transitions.push({time:now.logicalTick*.05,fromSourceRow:previousProgress.row,toSourceRow:now.row,
     lap:now.lap,passed:now.passed,misses:now.misses,missDelta:now.misses-previousProgress.misses,
     sourcePosition:{x:position.x,z:position.z},classification:n?.classification??null,enabled:!!n?.enabled,
     buoyDistanceWorld:n?Math.hypot(position.x-n.x,position.z-n.z):null,
     sideMarginWorld:margin,sourceHeadingErrorAtObservation:n?angle(p.heading-Math.atan2(n.tx,n.tz)):null,
     navigation:last?{index:last.index,target:[...last.target],headingError:last.headingError,speedWorld:last.speedWorld}:null});
    if(transitions.length>traceLimit)transitions.shift();
   }
  }
  previousProgress=now;
 }

 function input(state,racer=state?.racers?.[0]){
  const r=pose(state,racer);observe(state,racer,r);
  if(state.phase!=='running'||racer.finishTime!==null||racer.dq)return neutral();
  const frame=state.nativeHost.world.frames;
  if(!Number.isSafeInteger(frame)||frame<0)throw new TypeError('Expected a native logical-frame counter');
  if(frame<stamp)throw new RangeError('Reset the native pilot after seeking backwards');
  if(frame===stamp)return {...held};
  stamp=frame;start??=[r.x,r.z];
  let q=anchors[index],previous=index?anchors[index-1]:circuits===1?start:anchors.at(-1);
  // A navigation plane is intentionally unrestricted laterally: chasing an
  // overshot anchor produces a loop. The separate human buoy judge is retained.
  for(let n=0;n<anchors.length;n++){
   const dx=q[0]-previous[0],dz=q[1]-previous[1],length=Math.hypot(dx,dz)||1;
   const past=((r.x-q[0])*dx+(r.z-q[1])*dz)/length;
   if(Math.hypot(r.x-q[0],r.z-q[1])>=config.waypointRadiusWorld&&past<0)break;
   previous=q;if(++index===anchors.length){index=0;circuits++;}q=anchors[index];
  }
  const dx=q[0]-previous[0],dz=q[1]-previous[1],length=Math.hypot(dx,dz)||1,ux=dx/length,uz=dz/length;
  const along=(r.x-previous[0])*ux+(r.z-previous[1])*uz;
  const cross=(r.x-previous[0])*uz-(r.z-previous[1])*ux,remaining=length-along;
  const look=Math.max(config.minLookaheadWorld,r.speed*config.lookaheadSeconds);
  let spare=look-Math.max(0,remaining),target=q;
  if(spare<0)target=[previous[0]+ux*(along+look),previous[1]+uz*(along+look)];
  else{
   let from=q;
   for(let n=1;n<anchors.length;n++){
    const to=anchors[(index+n)%anchors.length],distance=Math.hypot(to[0]-from[0],to[1]-from[1]);
    if(distance>=spare&&distance>0){target=[from[0]+(to[0]-from[0])*spare/distance,from[1]+(to[1]-from[1])*spare/distance];break;}
    spare-=distance;from=to;
   }
  }
  const desiredHeading=Math.atan2(target[0]-r.x-r.vx*config.velocityPredictionSeconds,target[1]-r.z-r.vz*config.velocityPredictionSeconds);
  const error=angle(desiredHeading-r.heading);
  let bend=0,distance=Math.max(0,remaining),from=previous,to=q;
  for(let n=1;n<anchors.length&&distance<config.cornerDistanceWorld;n++){
   const dest=anchors[(index+n)%anchors.length],a=Math.atan2(to[0]-from[0],to[1]-from[1]),b=Math.atan2(dest[0]-to[0],dest[1]-to[1]);
   bend=Math.max(bend,Math.abs(angle(b-a))*(1-clamp(distance/config.cornerDistanceWorld,0,1)));
   distance+=Math.hypot(dest[0]-to[0],dest[1]-to[1]);from=to;to=dest;
  }
  const desiredSpeed=Math.max(config.cornerSpeedWorld,config.straightSpeedWorld/(1+bend*config.cornerSlowdown));
  if(r.speed<desiredSpeed-config.speedHysteresisWorld)throttle=true;
  else if(r.speed>desiredSpeed+config.speedHysteresisWorld)throttle=false;
  const controlYaw=last?angle(r.heading-last.heading)/((frame-last.logicalFrame)*.05):r.yawVelocity;
  const steer=clamp(error*config.headingGain-controlYaw*config.yawDamping,-1,1);
  const reserve=Math.abs(steer)>config.steeringEngineThreshold&&r.speed<config.steeringEngineMaxSpeedWorld;
  if(reserve)throttle=true;
  held={...neutral(),throttle:Number(throttle),steer};samples++;if(!throttle)coastFrames++;if(reserve)reserveFrames++;
  last={logicalFrame:frame,index,circuits,x:r.x,z:r.z,speedWorld:r.speed,heading:r.heading,yawVelocity:r.yawVelocity,controlYawVelocity:controlYaw,
   headingError:error,crossWorld:cross,remainingWorld:remaining,lookaheadWorld:look,target:[...target],
   desiredSpeedWorld:desiredSpeed,bendRadians:bend,steeringEngineReserve:reserve,controls:{...held}};
  return {...held};
 }

 function reset(){
  binding=null;index=0;circuits=1;start=null;stamp=-1;held=neutral();throttle=true;last=null;previousProgress=null;
  samples=coastFrames=reserveFrames=0;transitions=[];
 }
 return {input,reset,diagnostics:()=>copy({policy:config,navigation:{index,circuits},samples,coastFrames,reserveFrames,last,transitions})};
}
