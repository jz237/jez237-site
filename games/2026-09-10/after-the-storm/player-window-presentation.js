import {captureNativeIcePresentation,sampleNativeIcePresentation} from './native-ice-presentation.js';
import {captureNativeStuntWorld} from './native-stunt-presentation.js';
import {readNativeCamera} from './native-camera-presentation.js';
import {readRaceWater} from './race-water.js';
import {exportBreakablePresentation,importBreakablePresentation} from './breakable-hazards.js';
import {RIDER_TARGET_BONES,prepareRiderTargetPose,interpolateRiderTargetPose} from './rider-target-pose.js';
import {capturePrimaryBuoyPresentation,samplePrimaryBuoyPresentation} from './primary-buoy-presentation.js';
// Intentionally excludes solver scratch buffers, rider references in wakes,
// course methods, live tokens, records, saves and input/controller objects.
const finite=n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=1e9;
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const integer=(n,min=0,max=1e9)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const own=(o,k)=>Object.hasOwn(o,k);
const boneNames=new Set(RIDER_TARGET_BONES);
function nativeRiderPose(value){
 if(value===null)return null;
 if(!plain(value)||Object.keys(value).length>8)throw new TypeError('Invalid physical rider display');
 const {targets,yaw,headYaw}=prepareRiderTargetPose(value);
 // A generous local-coordinate envelope bounds untrusted display messages;
 // it does not clamp physical points or impose a solver travel restriction.
 if(Math.abs(yaw)>1e4||Math.abs(headYaw)>1e4||Object.values(targets).some(pair=>pair.some(p=>p.some(n=>Math.abs(n)>1e4))))
  throw new RangeError('Physical rider display is out of bounds');
 const d=value.diagnostics;
 if(!plain(d)||Object.keys(d).length>20||d.presentationOnly!==true||d.source!=='solved-19-world-points'||d.coordinateSpace!=='craft-local-world-units'||
  d.sourceLogicalFrame!==null&&!integer(d.sourceLogicalFrame))throw new TypeError('Invalid physical rider provenance');
 const diagnostics={presentationOnly:true,source:d.source,coordinateSpace:d.coordinateSpace,sourceLogicalFrame:d.sourceLogicalFrame};
 if(own(d,'pelvisLengthWorld')){
  if(!finite(d.pelvisLengthWorld)||d.pelvisLengthWorld<=0||d.pelvisLengthWorld>10)throw new RangeError('Invalid pelvis display length');
  diagnostics.pelvisLengthWorld=d.pelvisLengthWorld;
 }
 for(const key of ['pelvisAxis','torsoEndpoint','axialTwist'])if(own(d,key)){
  if(typeof d[key]!=='string'||d[key].length>240)throw new TypeError('Invalid physical rider diagnostic');diagnostics[key]=d[key];
 }
 if(own(d,'collapsedSegments')){
  if(!Array.isArray(d.collapsedSegments)||d.collapsedSegments.length>15||new Set(d.collapsedSegments).size!==d.collapsedSegments.length||d.collapsedSegments.some(name=>!boneNames.has(name)))
   throw new TypeError('Invalid collapsed display segments');
  diagnostics.collapsedSegments=[...d.collapsedSegments];
 }
 return {targets,yaw,headYaw,diagnostics};
}
function nativeTelemetry(value){
 if(value===null)return null;
 if(!plain(value)||Object.keys(value).length>40||!integer(value.hudSpeed)||!integer(value.actorState,0,65535)||!integer(value.logicalFrame))
  throw new TypeError('Invalid native display telemetry');
 const result={hudSpeed:value.hudSpeed,actorState:value.actorState,logicalFrame:value.logicalFrame};
 for(const [key,max]of [['clockUnits',1e9],['animationFrame',1e9],['controlActorState',65535],['wetCount',12]])if(own(value,key)){
  if(!integer(value[key],0,max))throw new RangeError('Invalid native '+key);result[key]=value[key];
 }
 if(own(value,'frameSpeedNative')){
  if(!finite(value.frameSpeedNative)||value.frameSpeedNative<0)throw new RangeError('Invalid native frame speed');result.frameSpeedNative=value.frameSpeedNative;
 }
 if(own(value,'anyWet')){if(typeof value.anyWet!=='boolean')throw new TypeError('Invalid native wet flag');result.anyWet=value.anyWet;}
 return result;
}
function primaryBuoys(value){
 if(value===undefined)throw new TypeError('Primary display data must be an array or null');
 const rows=capturePrimaryBuoyPresentation(value);
 if(rows?.some(row=>[row.position,...row.endpoints].some(p=>!['x','y','z'].every(k=>finite(p[k])))))throw new RangeError('Primary display position is out of bounds');
 return rows;
}
function copyNativeRacer(from,to={...from}){
 if(own(from,'nativeBoundaryFrames')&&!integer(from.nativeBoundaryFrames,-1,65535))throw new RangeError('Invalid source boundary display');
 if(own(from,'nativeWrongWay')&&typeof from.nativeWrongWay!=='boolean')throw new TypeError('Invalid source direction display');
 if(own(from,'nativePlace')&&!integer(from.nativePlace,0,3))throw new RangeError('Invalid source place display');
 if(own(from,'nativeCamera'))to.nativeCamera=readNativeCamera(from.nativeCamera);
 if(own(from,'nativeRiderPose'))to.nativeRiderPose=nativeRiderPose(from.nativeRiderPose);
 if(own(from,'nativeTelemetry'))to.nativeTelemetry=nativeTelemetry(from.nativeTelemetry);
 return to;
}
function copyNativeFrame(frame){
 return {...frame,racers:frame.racers.map(q=>copyNativeRacer(q)),...(own(frame,'nativeCourseWorld')?{nativeCourseWorld:captureNativeStuntWorld(frame.nativeCourseWorld)}:{}),...(own(frame,'nativeIce')?{nativeIce:captureNativeIcePresentation(frame.nativeIce)}:{}),...(own(frame,'primaryBuoys')?{primaryBuoys:primaryBuoys(frame.primaryBuoys)}:{})};
}
function fields(value,max=96){
 if(!plain(value)||Object.keys(value).length>max)return null;
 const out={};for(const [key,v] of Object.entries(value)){
  if(!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(key))return null;
  // Scalar DISPLAY values cross JSON, which has only one zero. Physical
  // buffers/float words never pass through this scalar presentation helper.
  if(finite(v)||typeof v==='boolean'||v===null||typeof v==='string'&&v.length<=240)out[key]=typeof v==='number'&&v===0?0:v;
 }
 return out;
}
const racerKeys=['id','player','human','x','z','vx','vz','heading','speed','turn','throttle','yawVelocity','riderLean','sprayExposure','collision','recover','onIce','iceBalance','power','misses','next','passed','lap','out','event','eventTime','finishTime','dq','mount','raceTime','nativeBoundaryFrames','nativeWrongWay','nativePlace'];
function rider(r){
 if(!plain(r))return null;
 const q=fields(Object.fromEntries(racerKeys.filter(k=>r[k]!==undefined).map(k=>[k,r[k]])));
 if(!q||![q.x,q.z,q.heading,q.speed].every(finite)||!Number.isInteger(q.id)||q.id<0||q.id>3||![0,1].includes(q.player))return null;
 q.hydro=fields(r.hydro);q.stunt=fields(r.stunt);q.wipeout=r.wipeout?fields(r.wipeout,20):null;q.waveReading=r.waveReading?fields(r.waveReading,24):null;
 if(!q.hydro||!q.stunt||![q.hydro.y,q.hydro.pitch,q.hydro.roll].every(finite))return null;
 try{return copyNativeRacer(r,q);}catch{return null;}
}
function numericRows(rows,keys,max){
 if(!Array.isArray(rows)||rows.length>max)return null;
 const out=rows.map(row=>Object.fromEntries(keys.map(k=>[k,row?.[k]])));
 return out.every(row=>Object.values(row).every(finite))?out:null;
}
export function captureWindowWater(water,local,includeLocal=true){
 return {wake:numericRows(water.wake,['x','z','time','heading','power'],96),impacts:numericRows(water.impacts,['x','z','time','amplitude'],12),
  craft:numericRows(water.craft.map(c=>({...c,turn:c.turn??0,bowWet:c.bowWet??1,sternWet:c.sternWet??1})),['x','z','heading','turn','bowWet','sternWet','power'],4),level:water.level,
  native:readRaceWater(water.native),local:includeLocal&&local&&Number.isFinite(local.x)?{size:local.size,cell:local.cell,x:local.x,z:local.z,version:local.version,h:local.h.slice(),mask:local.mask.slice()}:null};
}
export function validateWindowWater(w){
 if(!plain(w)||!finite(w.level))return null;
 const wake=numericRows(w.wake,['x','z','time','heading','power'],96),impacts=numericRows(w.impacts,['x','z','time','amplitude'],12),craft=numericRows(w.craft,['x','z','heading','turn','bowWet','sternWet','power'],4);
 if(!wake||!impacts||!craft)return null;
 const native=readRaceWater(w.native);if(native===false)return null;
 let local=null;const f=w.local;
 if(f!==null&&f!==undefined){
  if(!plain(f)||!Number.isInteger(f.size)||f.size<2||f.size>128||!finite(f.cell)||f.cell<=0||f.cell>20||![f.x,f.z,f.version].every(finite)||!(f.h instanceof Float32Array)||!(f.mask instanceof Uint8Array)||f.h.length!==f.size*f.size||f.mask.length!==f.h.length||f.h.some(n=>!finite(n)||Math.abs(n)>2)||f.mask.some(n=>n>1))return null;
  local={size:f.size,cell:f.cell,x:f.x,z:f.z,version:f.version,h:f.h.slice(),mask:f.mask.slice()};
 }
 return {wake,impacts,craft,level:w.level,local,native};
}
function launchPresentation(value){
 const out={};
 if(own(value,'nativeLaunchLabel')){
  if(typeof value.nativeLaunchLabel!=='string'||value.nativeLaunchLabel.length>16)throw new TypeError('Invalid native launch label');
  out.nativeLaunchLabel=value.nativeLaunchLabel;
 }
 if(own(value,'nativeCountdownCue')){
  const c=value.nativeCountdownCue;
  if(c!==null&&(!plain(c)||!Number.isInteger(c.sequence)||c.sequence<1||c.sequence>0x7fffffff||!Number.isInteger(c.number)||c.number<0||c.number>3))throw new TypeError('Invalid native launch cue');
  out.nativeCountdownCue=c===null?null:{sequence:c.sequence,number:c.number};
 }
 return out;
}
// Player 2's view of the original effects (933C4 view1), already on the
// rendered water. Packed into four typed arrays so the same frame fits both
// Player 2's window and the bounded online codec; the original vertex colors
// and alphas are 8-bit, so their byte form loses nothing.
const EFFECT_FAMILIES=['spray','splash','wake','droplet'],EFFECT_FRAMES=[4,7,4,1];
export function packWindowEffects(draws){
 if(!Array.isArray(draws)||draws.length>256)throw new RangeError('Supply bounded effect draws');
 let total=0;for(const d of draws)total+=d.positions.length/3;
 if(total>16384)throw new RangeError('Too many effect vertices for a window frame');
 const positions=new Float32Array(total*3),uvs=new Float32Array(total*2),colors=new Uint8Array(total*3),alphas=new Uint8Array(total),meta=[];let v=0;
 for(const d of draws){
  const n=d.positions.length/3,family=EFFECT_FAMILIES.indexOf(d.family);if(family<0)throw new RangeError('Unknown effect family');
  meta.push([family,d.textureFrame,d.depthTest?1:0,n]);positions.set(d.positions,v*3);uvs.set(d.uvs,v*2);
  for(let i=0;i<n*3;i++)colors[v*3+i]=Math.round(Math.min(1,Math.max(0,d.colors[i]))*255);
  for(let i=0;i<n;i++)alphas[v+i]=Math.round(Math.min(1,Math.max(0,d.alphas[i]))*255);v+=n;
 }
 return {draws:meta,positions,uvs,colors,alphas};
}
export function readWindowEffects(value){
 if(!plain(value)||!Array.isArray(value.draws)||value.draws.length>256)return null;
 let total=0;
 for(const m of value.draws){
  if(!Array.isArray(m)||m.length!==4||!m.every(Number.isInteger))return null;
  const [family,frame,depth,n]=m;
  if(family<0||family>=EFFECT_FAMILIES.length||frame<0||frame>=EFFECT_FRAMES[family]||![0,1].includes(depth)||n<3||n%3||(total+=n)>16384)return null;
 }
 const {positions,uvs,colors,alphas}=value;
 if(!(positions instanceof Float32Array)||positions.length!==total*3||!(uvs instanceof Float32Array)||uvs.length!==total*2||
  !(colors instanceof Uint8Array)||colors.length!==total*3||!(alphas instanceof Uint8Array)||alphas.length!==total)return null;
 for(const a of [positions,uvs])for(const x of a)if(!(x>=-1e9&&x<=1e9))return null;
 const out=[];let v=0;
 for(const [family,frame,depth,n]of value.draws){
  out.push({family:EFFECT_FAMILIES[family],textureFrame:frame,depthTest:depth===1,positions:Array.from(positions.subarray(v*3,(v+n)*3)),uvs:Array.from(uvs.subarray(v*2,(v+n)*2)),
   colors:Array.from(colors.subarray(v*3,(v+n)*3),c=>c/255),alphas:Array.from(alphas.subarray(v,v+n),a=>a/255)});v+=n;
 }
 return out;
}
export function captureWindowFrame(state,water,{includeLocal=true}={}){
 return {time:state.time,phase:state.phase,countdown:state.countdown,freeRide:!!state.freeRide,passageOpenedAt:Number.isFinite(state.passageOpenedAt)?state.passageOpenedAt:null,
  ...(own(state,'nativeCourseWorld')?{nativeCourseWorld:captureNativeStuntWorld(state.nativeCourseWorld)}:{}),
  racers:state.racers.map(rider),weather:fields(state.weather,30),water:captureWindowWater(water,state.localWater,includeLocal),breakables:exportBreakablePresentation(state.breakables,state.time),
  ...(own(state,'nativeIce')?{nativeIce:captureNativeIcePresentation(state.nativeIce)}:{}),...(own(state,'primaryBuoys')?{primaryBuoys:primaryBuoys(state.primaryBuoys)}:{}),...launchPresentation(state)};
}
export function readWindowFrame(value){
 if(!plain(value)||!finite(value.time)||value.time<0||!finite(value.countdown)||!['countdown','running','postrace','paused','results'].includes(value.phase)||!Array.isArray(value.racers)||value.racers.length!==2)return null;
 const racers=value.racers.map(rider),water=validateWindowWater(value.water),weather=fields(value.weather,30),breakables=importBreakablePresentation(value.breakables);
 if(racers.some(r=>!r)||racers[0].player!==0||racers[1].player!==1||!water||!weather||!breakables)return null;
 if(value.passageOpenedAt!==null&&!finite(value.passageOpenedAt))return null;
 let effects;if(own(value,'nativeEffects')&&!(effects=readWindowEffects(value.nativeEffects)))return null;
 let primary,launch,ice,courseWorld;try{if(own(value,'nativeCourseWorld'))courseWorld=captureNativeStuntWorld(value.nativeCourseWorld);if(own(value,'nativeIce'))ice=captureNativeIcePresentation(value.nativeIce);if(own(value,'primaryBuoys'))primary=primaryBuoys(value.primaryBuoys);launch=launchPresentation(value);}catch{return null;}
 return {time:value.time,phase:value.phase,countdown:value.countdown,freeRide:!!value.freeRide,passageOpenedAt:value.passageOpenedAt??Infinity,racers,weather,water,breakables,
  ...(own(value,'nativeCourseWorld')?{nativeCourseWorld:courseWorld}:{}),
  ...(own(value,'nativeIce')?{nativeIce:ice}:{}),...(own(value,'primaryBuoys')?{primaryBuoys:primary}:{}),...(effects?{nativeEffects:effects}:{}),...launch};
}
export function interpolateWindowFrame(a,b,time){
 if(!a||a.time>=b.time||a.phase!==b.phase)return copyNativeFrame(b);
 const t=Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time))),mix=(x,y)=>x+(y-x)*t;
 // Discrete visibility/events remain at the previous physical tick until b.
 const f={...(t<1?a:b),time:mix(a.time,b.time),racers:a.racers.map((r,i)=>{
  const q=b.racers[i],chosen=t<1?r:q,p=copyNativeRacer(chosen,{...chosen,hydro:{...chosen.hydro}});
  for(const key of ['x','z','vx','vz','speed','turn'])p[key]=mix(r[key]??0,q[key]??0);
  p.heading=r.heading+Math.atan2(Math.sin(q.heading-r.heading),Math.cos(q.heading-r.heading))*t;
  for(const key of ['y','vy','pitch','roll','pitchVelocity','rollVelocity','compression','wet','waterHeight'])if(finite(r.hydro[key])&&finite(q.hydro[key]))p.hydro[key]=mix(r.hydro[key],q.hydro[key]);
  // Endpoint interpolation is display only. Native/modern, missing/null pose,
  // rider identity and provenance boundaries hold the earlier recorded value
  // until b. Source frame/actor/HUD telemetry never becomes fractional.
  if(t>0&&t<1&&r.nativeRiderPose&&q.nativeRiderPose&&r.id===q.id&&r.player===q.player&&
   r.nativeRiderPose.diagnostics.source===q.nativeRiderPose.diagnostics.source&&r.nativeRiderPose.diagnostics.coordinateSpace===q.nativeRiderPose.diagnostics.coordinateSpace){
   p.nativeRiderPose={...interpolateRiderTargetPose(r.nativeRiderPose,q.nativeRiderPose,t),
    windowPresentation:{policy:'display-endpoints-only',targetsInterpolated:true,fromRecordedTime:a.time,toRecordedTime:b.time,blend:t}};
  }
  return p;
 })};
 const chosen=t<1?a:b;
 if(own(chosen,'nativeCourseWorld'))f.nativeCourseWorld=captureNativeStuntWorld(chosen.nativeCourseWorld);else delete f.nativeCourseWorld;
 for(const k of ['nativeLaunchLabel','nativeCountdownCue']){if(own(chosen,k))f[k]=k==='nativeCountdownCue'&&chosen[k]?{...chosen[k]}:chosen[k];else delete f[k];}
 if(own(chosen,'nativeIce'))f.nativeIce=sampleNativeIcePresentation(a.nativeIce,b.nativeIce,t);
 if(own(chosen,'primaryBuoys')){
  const first=a.primaryBuoys,last=b.primaryBuoys,compatible=first&&last&&first.length===last.length&&first.every((q,i)=>q.sourceRow===last[i].sourceRow&&q.classification===last[i].classification&&q.fixed===last[i].fixed);
  f.primaryBuoys=compatible?samplePrimaryBuoyPresentation(first,last,t):primaryBuoys(chosen.primaryBuoys);
 }
 return f;
}

export const windowRacerHudSpeed=r=>r.nativeTelemetry?.hudSpeed??Math.round(r.speed*3.6);
