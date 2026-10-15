import {readRaceWater} from './race-water.js';
import {exportBreakablePresentation,importBreakablePresentation} from './breakable-hazards.js';
// Intentionally excludes solver scratch buffers, rider references in wakes,
// course methods, live tokens, records, saves and input/controller objects.
const finite=n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=1e9;
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
function fields(value,max=96){
 if(!plain(value)||Object.keys(value).length>max)return null;
 const out={};for(const [key,v] of Object.entries(value)){
  if(!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(key))return null;
  if(finite(v)||typeof v==='boolean'||v===null||typeof v==='string'&&v.length<=240)out[key]=v;
 }
 return out;
}
const racerKeys=['id','player','human','x','z','vx','vz','heading','speed','turn','throttle','yawVelocity','riderLean','sprayExposure','collision','recover','onIce','iceBalance','power','misses','next','passed','lap','out','event','eventTime','finishTime','dq','mount','raceTime'];
function rider(r){
 if(!plain(r))return null;
 const q=fields(Object.fromEntries(racerKeys.filter(k=>r[k]!==undefined).map(k=>[k,r[k]])));
 if(!q||![q.x,q.z,q.heading,q.speed].every(finite)||!Number.isInteger(q.id)||q.id<0||q.id>3||![0,1].includes(q.player))return null;
 q.hydro=fields(r.hydro);q.stunt=fields(r.stunt);q.wipeout=r.wipeout?fields(r.wipeout,20):null;q.waveReading=r.waveReading?fields(r.waveReading,24):null;
 if(!q.hydro||!q.stunt||![q.hydro.y,q.hydro.pitch,q.hydro.roll].every(finite))return null;
 return q;
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
export function captureWindowFrame(state,water,{includeLocal=true}={}){
 return {time:state.time,phase:state.phase,countdown:state.countdown,freeRide:!!state.freeRide,passageOpenedAt:Number.isFinite(state.passageOpenedAt)?state.passageOpenedAt:null,
  racers:state.racers.map(rider),weather:fields(state.weather,30),water:captureWindowWater(water,state.localWater,includeLocal),breakables:exportBreakablePresentation(state.breakables,state.time)};
}
export function readWindowFrame(value){
 if(!plain(value)||!finite(value.time)||value.time<0||!finite(value.countdown)||!['countdown','running','paused','results'].includes(value.phase)||!Array.isArray(value.racers)||value.racers.length!==2)return null;
 const racers=value.racers.map(rider),water=validateWindowWater(value.water),weather=fields(value.weather,30),breakables=importBreakablePresentation(value.breakables);
 if(racers.some(r=>!r)||racers[0].player!==0||racers[1].player!==1||!water||!weather||!breakables)return null;
 if(value.passageOpenedAt!==null&&!finite(value.passageOpenedAt))return null;
 return {time:value.time,phase:value.phase,countdown:value.countdown,freeRide:!!value.freeRide,passageOpenedAt:value.passageOpenedAt??Infinity,racers,weather,water,breakables};
}
export function interpolateWindowFrame(a,b,time){
 if(!a||a.time>=b.time||a.phase!==b.phase)return b;
 const t=Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time))),mix=(x,y)=>x+(y-x)*t;
 // Discrete visibility/events remain at the previous physical tick until b.
 const f={...(t<1?a:b),time:mix(a.time,b.time),racers:a.racers.map((r,i)=>{
  const q=b.racers[i],p={...(t<1?r:q),hydro:{...(t<1?r.hydro:q.hydro)}};
  for(const key of ['x','z','vx','vz','speed','turn'])p[key]=mix(r[key]??0,q[key]??0);
  p.heading=r.heading+Math.atan2(Math.sin(q.heading-r.heading),Math.cos(q.heading-r.heading))*t;
  for(const key of ['y','vy','pitch','roll','pitchVelocity','rollVelocity','compression','wet','waterHeight'])if(finite(r.hydro[key])&&finite(q.hydro[key]))p.hydro[key]=mix(r.hydro[key],q.hydro[key]);return p;
 })};return f;
}
