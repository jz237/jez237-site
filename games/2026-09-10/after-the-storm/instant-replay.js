import {captureNativeIcePresentation,sampleNativeIcePresentation} from './native-ice-presentation.js';
import {captureNativeStuntWorld} from './native-stunt-presentation.js';
import {captureBreakableState} from './breakable-hazards.js';
import {capturePrimaryBuoyPresentation,samplePrimaryBuoyPresentation} from './primary-buoy-presentation.js';
import {interpolateRiderTargetPose} from './rider-target-pose.js';
// A bounded in-memory recording. Replays read snapshots; they never integrate
// physics, consume inputs, submit records, or advance championship state.
const clone=x=>structuredClone(x),mix=(a,b,t)=>a+(b-a)*t;
export function createRecorder(){return {frames:[],last:-Infinity,event:null,air:new Map(),previous:null};}
export function recordMoment(rec,state,water,beads=[]){
 if(state.phase!=='running'||state.time-rec.last<1/20-1e-6)return;
 const racers=state.racers,prev=rec.previous;
 racers.forEach((r,i)=>{const was=rec.air.get(i)||{height:0,air:false};
  const height=Math.max(0,r.hydro.y-r.hydro.waterHeight);
  if(r.hydro.airborne)was.height=Math.max(was.height,height);
  if(was.air&&!r.hydro.airborne){if(was.height>1.1)rec.event={time:state.time,index:i,label:'Wave jump'};was.height=0;}
  was.air=r.hydro.airborne;rec.air.set(i,was);
  if(i>0&&prev){const a=racers[0],old=prev.racers[i],oldA=prev.racers[0];
   if(a.speed>12&&Math.hypot(a.x-r.x,a.z-r.z)<12){const f=Math.sin(a.heading),g=Math.cos(a.heading),d=(r.x-a.x)*f+(r.z-a.z)*g,oldD=(old.x-oldA.x)*f+(old.z-oldA.z)*g;if(d*oldD<0&&Math.abs(d-oldD)<6&&(!rec.event||state.time-rec.event.time>3))rec.event={time:state.time,index:0,label:'Close overtake'};}
  }
 });
 const f=state.localWater,local=f&&Number.isFinite(f.x)?{h:f.h.slice(),mask:f.mask.slice(),x:f.x,z:f.z,cell:f.cell,size:f.size,version:f.version}:null;
 const frame={time:state.time,racers:clone(racers),weather:clone(state.weather),passageOpenedAt:state.passageOpenedAt,water:clone(typeof water==='function'?water():water),localWater:local,beads:clone(typeof beads==='function'?beads():beads),breakables:captureBreakableState(state.breakables,state.time)};
 if(Object.hasOwn(state,'nativeIce'))frame.nativeIce=captureNativeIcePresentation(state.nativeIce);
 if(Object.hasOwn(state,'nativeStuntWorld'))frame.nativeStuntWorld=captureNativeStuntWorld(state.nativeStuntWorld);
 if(Object.hasOwn(state,'nativeCourseWorld'))frame.nativeCourseWorld=captureNativeStuntWorld(state.nativeCourseWorld);
 if(state.primaryBuoys)frame.primaryBuoys=capturePrimaryBuoyPresentation(state.primaryBuoys);
 const actorDisplay=state.nativeHost?.lastCourseActorDisplay;
 if(actorDisplay)frame.nativeCourseActors={presentation:{draws:clone(actorDisplay.presentation.draws)},resourceWords:clone(actorDisplay.state.resourceWordsE73c)};
 // Only completed B305C geometry: never effect storage, scene buffers or clocks.
 const effectDisplay=state.nativeHost?.lastSceneEffectDisplay;
 if(effectDisplay)frame.nativeSceneEffects={draws:clone(effectDisplay.presentation.draws)};
 rec.frames.push(frame);rec.last=state.time;rec.previous=frame;
 while(rec.frames.length>201||rec.frames[0].time<state.time-10)rec.frames.shift();
}
export function replayClip(rec){
 if(rec.frames.length<60)return null;const end=rec.frames.at(-1).time,event=rec.event;
 const highlight=event&&event.time<end-1.2&&event.time>rec.frames[0].time+1;
 const from=highlight?Math.max(rec.frames[0].time,event.time-2.6):Math.max(rec.frames[0].time,end-5);
 const to=highlight?Math.min(end,event.time+1.6):end;
 const frames=rec.frames.filter(f=>f.time>=from-.051&&f.time<=to+.051);
 return {frames,start:frames[0].time,end:frames.at(-1).time,index:highlight?event.index:0,label:highlight?event.label:'Last run'};
}
// Presentation interpolation only. A physical pose is compatible when the
// rider identity and optional recorded source/coordinate-space tags match.
// Only endpoint XYZ blends; root/head yaw and ALL diagnostics, including the
// solved source frame, remain recorded discrete provenance. No IK or solver
// creates a fractional physical frame. Exact boundaries preserve exact DTOs.
// At native/modern/null/missing/incompatible boundaries hold the earlier
// recorded property until the next exact sample, then select the later one.
function sampleNativeRiderPose(first,last,t,fromTime,toTime){
 const chosen=t<1?first:last;
 if(!Object.hasOwn(chosen,'nativeRiderPose'))return {present:false};
 const pose=chosen.nativeRiderPose,a=first.nativeRiderPose,b=last.nativeRiderPose;
 const compatible=a&&b&&first.id===last.id&&a.diagnostics?.source===b.diagnostics?.source&&
  a.diagnostics?.coordinateSpace===b.diagnostics?.coordinateSpace;
 if(t<=0||t>=1||!compatible)return {present:true,pose:clone(pose)};
 return {present:true,pose:{...interpolateRiderTargetPose(a,b,t),
  replayPresentation:{policy:'display-endpoints-only',targetsInterpolated:true,fromRecordedTime:fromTime,toRecordedTime:toTime,blend:t}}};
}
export function replaySample(clip,time){
 const fs=clip.frames;let i=0;while(i<fs.length-2&&fs[i+1].time<time)i++;
 const a=fs[i],b=fs[Math.min(fs.length-1,i+1)],t=Math.max(0,Math.min(1,(time-a.time)/Math.max(.001,b.time-a.time))),frame={...a,time:mix(a.time,b.time,t),racers:clone(a.racers)};
 frame.racers.forEach((r,j)=>{const q=b.racers[j];for(const k of ['x','z','speed','turn','vx','vz'])r[k]=mix(r[k],q[k],t);r.heading+=Math.atan2(Math.sin(q.heading-r.heading),Math.cos(q.heading-r.heading))*t;
  for(const k of ['y','vy','pitch','roll','pitchVelocity','rollVelocity','compression','wet','waterHeight'])if(Number.isFinite(r.hydro[k])&&Number.isFinite(q.hydro[k]))r.hydro[k]=mix(r.hydro[k],q.hydro[k],t);
  if(r.stunt.trick===q.stunt.trick)r.stunt.angle=mix(r.stunt.angle,q.stunt.angle,t);
  if(Object.hasOwn(r,'nativeRiderPose')||Object.hasOwn(q,'nativeRiderPose')){
   const pose=sampleNativeRiderPose(a.racers[j],q,t,a.time,b.time);
   if(pose.present)r.nativeRiderPose=pose.pose;else delete r.nativeRiderPose;
  }
 });
 if(Object.hasOwn(a,'nativeIce')||Object.hasOwn(b,'nativeIce'))frame.nativeIce=sampleNativeIcePresentation(a.nativeIce,b.nativeIce,t);
 // Stunt geometry and collected flags belong to completed source frames.
 // Hold them together until b, without interpolating a collision or score state.
 if(Object.hasOwn(a,'nativeStuntWorld')||Object.hasOwn(b,'nativeStuntWorld'))frame.nativeStuntWorld=captureNativeStuntWorld((t<1?a:b).nativeStuntWorld??null);
 if(Object.hasOwn(a,'nativeCourseWorld')||Object.hasOwn(b,'nativeCourseWorld'))frame.nativeCourseWorld=captureNativeStuntWorld((t<1?a:b).nativeCourseWorld??null);
 if(a.primaryBuoys||b.primaryBuoys)frame.primaryBuoys=samplePrimaryBuoyPresentation(a.primaryBuoys,b.primaryBuoys,t);
 // Keep each completed articulated pose intact. Matrix interpolation would
 // shear the skin, and replay must never rerun the original actor dispatcher.
 if(Object.hasOwn(a,'nativeCourseActors')||Object.hasOwn(b,'nativeCourseActors'))frame.nativeCourseActors=clone((t<1?a:b).nativeCourseActors??null);
 // Particle sets differ between display frames; hold each one until the next.
 if(Object.hasOwn(a,'nativeSceneEffects')||Object.hasOwn(b,'nativeSceneEffects'))frame.nativeSceneEffects=clone((t<1?a:b).nativeSceneEffects??null);
 // World-aligned samples survive patch recentering without moving the waves.
 if(a.localWater&&b.localWater){const f=a.localWater,g=b.localWater,h=f.h.slice(),dx=Math.round((f.x-g.x)/f.cell),dz=Math.round((f.z-g.z)/f.cell);for(let j=0;j<f.size;j++)for(let k=0;k<f.size;k++){const x=k+dx,z=j+dz;if(x>=0&&z>=0&&x<g.size&&z<g.size)h[j*f.size+k]=mix(h[j*f.size+k],g.h[z*g.size+x],t);}frame.localWater={...f,h,version:time};}
 return frame;
}
export function shorelineCamera(clip,ground,obscured=()=>false){
 const poses=clip.frames.map(f=>f.racers[clip.index]),a=poses[0],b=poses.at(-1),m=poses[Math.floor(poses.length/2)],peak=Math.max(...poses.map(r=>r.hydro.y));
 const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)||1,nx=dz/len,nz=-dx/len;
 let best=null;for(const side of [-1,1])for(let d=34;d<=90;d+=14)for(const lift of [0,8,16]){
  const x=m.x+nx*d*side,z=m.z+nz*d*side,bed=ground(x,z);let y=Math.max(6,peak+4.5,bed+1.8)+lift;
  for(let i=1;i<16;i++){const t=i/16;y=Math.max(y,ground(mix(x,m.x,t),mix(z,m.z,t))+3);}
  const candidate={x,y,z};let blocked=0;for(const r of [a,m,b])if(obscured(candidate,{x:r.x,y:r.hydro.y+.7,z:r.z}))blocked++;
  const score=blocked*1000+(bed>=0&&bed<8?0:35)+d+y*2;
  if(!best||score<best.score)best={...candidate,score,blocked};
 }
 return best;
}
