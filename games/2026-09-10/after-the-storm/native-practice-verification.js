// Authored, finite inspection drive from the solo Practice grid to jump2.
// It issues ordinary throttle/steering and then coasts after24 seconds. It is
// not the source AI, training lessons, or a course objective. No simulation,
// score, navigation, or object state is changed by this input provider.
const route=[[-70,125],[-55,117],[0,91],[15,91],[75,90]];
const drivers=new WeakMap(),angle=v=>Math.atan2(Math.sin(v),Math.cos(v));
export function nativePracticeVerificationInput(state,racer){
 if(state.course?.nativeSceneMode!=='practice'||state.racers.length!==1||state.racers[0]!==racer||!state.nativeHost)
  throw new RangeError('Practice inspection requires the live solo Dolphin layout');
 let driver=drivers.get(state);
 if(!driver){driver={index:0,previous:-1,heading:racer.heading,held:{}};drivers.set(state,driver);}
 const frame=state.nativeHost.world.frames;
 if(frame===driver.previous)return {...driver.held};
 const p=state.nativeHost.presentations[0].racer,q=route[driver.index];
 if(Math.hypot(p.x-q[0],p.z-q[1])<8&&driver.index<route.length-1)driver.index++;
 const target=route[driver.index],error=angle(Math.atan2(target[0]-p.x-p.vx*.15,target[1]-p.z-p.vz*.15)-p.heading);
 const yaw=driver.previous<0?0:angle(p.heading-driver.heading)/((frame-driver.previous)*.05);
 driver.held=frame>=480?{}:{throttle:Number(p.speed<(Math.abs(error)>.5?14:27)),steer:Math.max(-1,Math.min(1,error*6-yaw*1.5))};
 driver.heading=p.heading;driver.previous=frame;return {...driver.held};
}
