// Development inspection helm: drive from the normal grid into Sunny's first
// enabled colored buoy, then release every control for physical recovery.
// This is an authored test drive, not original AI. No spawn, point, velocity,
// impact, actor, timer, buoy flag or course-progress field is written here.
const guides=new WeakMap(),neutral=()=>({throttle:0,steer:0});
const angle=a=>Math.atan2(Math.sin(a),Math.cos(a));

export function nativeRecoveryVerificationInput(state,racer=state?.racers?.[0]){
 if(state?.physics!=='native'||state.course?.sourceWaterCourseIndex!==1||state.course.difficulty!==0)
  throw new TypeError('Recovery inspection requires the native Sunny Normal preview');
 const index=state.racers.indexOf(racer),host=state.nativeHost,a=host?.world.adapters[index],p=host?.presentations[index]?.racer;
 if(index<0||!a?.riderLifecycle||!p)throw new TypeError('Recovery inspection requires its actual physical rider');
 if(state.phase!=='running'||state.nativeLaunch?.view().clockStopped||racer.finishTime!==null||racer.dq)return neutral();
 let riders=guides.get(state);if(!riders){riders=new WeakMap();guides.set(state,riders);}
 let guide=riders.get(racer);
 if(!guide){
  const target=state.course.sourceBuoyLayout.nodes.find(n=>n.enabled&&n.classification===1);
  if(!target)throw new Error('Recovery inspection needs an enabled source buoy');
  guide={target:{x:target.x,z:target.z},frame:-1,triggered:false,held:neutral()};riders.set(racer,guide);
 }
 const frame=host.world.frames;
 if(frame<guide.frame)throw new Error('Restart recovery inspection with a fresh race');
 if(frame===guide.frame)return {...guide.held};
 guide.frame=frame;
 const recovery=a.lastFrame.recovery.state;
 guide.triggered||=recovery.crashCountdown!==0||recovery.stumbleCountdown!==0||[7,23,24].includes(recovery.actorState);
 if(guide.triggered)guide.held=neutral();
 else{
  const error=angle(Math.atan2(guide.target.x-p.x,guide.target.z-p.z)-p.heading);
  guide.held={throttle:1,steer:Math.max(-1,Math.min(1,error*6-p.yawVelocity*1.2))};
 }
 return {...guide.held};
}
