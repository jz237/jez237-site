import {encounterInput} from './race-encounters.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Compare small, legal changes to a straight racing line. No position, buoy
// progress or launch force is ever injected by this controller.
export function readWaveLanes(r,time,surface,clear){
 const fx=Math.sin(r.heading),fz=Math.cos(r.heading),rx=fz,rz=-fx;
 const launch=r.speed>20&&(Math.floor(time/18)+r.id)%5===0;
 const lanes=[0,-2.6,2.6].map(offset=>{
  let previous=surface(r.x,r.z,time),roughness=0,crest=0;
  for(const distance of [8,16,24]){
   const x=r.x+fx*distance+rx*offset,z=r.z+fz*distance+rz*offset;
   if(!clear(x,z))return {offset,cost:Infinity};
   const h=surface(x,z,time+distance/Math.max(12,r.speed)),slope=(h-previous)/8;
   roughness+=Math.abs(slope);crest=Math.max(crest,slope);previous=h;
  }
  return {offset,roughness,crest,cost:(launch?Math.abs(crest-.14)*2+roughness*.2:roughness)+Math.abs(offset)*.006};
 }).sort((a,b)=>a.cost-b.cost);
 return {...lanes[0],launch};
}
export function wavePilotInput(s,r,base,surface){
 const g=s.course.gates[r.next];
 if(s.seaState!=='surf'||!['race','championship'].includes(s.mode)||r.rampPlan||r.onIce||r.wipeout||r.out||r.hydro.airborne||r.speed<12||Math.abs(base.steer||0)>.25||g.channel||g.approach||s.course.requiredPassage||s.course.iceSheets?.length||Math.hypot(g.x-r.x,g.z-r.z)<42)return base;
 if((s.course.ramps||[]).some(p=>Math.hypot(p.x-r.x,p.z-r.z)<80)||(s.course.crossbars||[]).some(p=>Math.hypot(p.x-r.x,p.z-r.z)<70))return base;
 const clear=(x,z)=>s.course.ground(x,z)<-2&&(x-g.x)*g.tx+(z-g.z)*g.tz< -8&&!(s.course.rocks||[]).some(p=>Math.hypot(p.x-x,p.z-z)<p.r+5);
 if(!r.waveReading||s.time-r.waveReading.time>.25){
  const reading=readWaveLanes(r,s.time,surface,clear);
  r.waveReading={...reading,time:s.time,decisions:(r.waveReading?.decisions||0)+1};
 }
 const q=r.waveReading;if(!Number.isFinite(q.cost))return base;
 const steer=clamp((base.steer||0)+q.offset*.025,-1,1);
 return encounterInput(s,r,{...base,steer,throttle:q.launch?base.throttle:(base.throttle||0)*(q.crest>.20?.88:1),lean:q.launch?-.12:q.crest>.14?.20:base.lean,dampen:true},clear);
}
