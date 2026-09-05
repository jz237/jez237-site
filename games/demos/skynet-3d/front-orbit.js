import {Spherical,Vector3} from 'three';

const states=new WeakMap(),quarter=Math.PI/4;
// From the initial front view: left, up, right, down, then left and repeat.
export const orbitWaypoints=[[-quarter,Math.PI/2],[-quarter,quarter],[quarter,quarter],[quarter,Math.PI/2]];
export const orbitRadiansPerSecond=Math.PI/20; // 45° in five seconds; 90° in ten.
const smooth=t=>t*t*t*(t*(t*6-15)+10);

export function configureFrontOrbit(controls){
 controls.minAzimuthAngle=-Math.PI/2;
 controls.maxAzimuthAngle=Math.PI/2;
 const state={leg:null,interacting:false};states.set(controls,state);
 controls.addEventListener('start',()=>{state.interacting=true;state.leg=null});
 controls.addEventListener('end',()=>{state.interacting=false;state.leg=null});
}

export function updateFrontOrbit(controls,dt,animated){
 const state=states.get(controls),auto=controls.autoRotate;
 // Native continuous orbit is replaced by the ordered front-facing path.
 controls.autoRotate=false;controls.update(dt);
 if(!auto||state.interacting){state.leg=null;controls.autoRotate=auto;return}
 if(!animated){controls.autoRotate=auto;return}
 const theta=controls.getAzimuthalAngle(),phi=controls.getPolarAngle();
 if(state.leg&&(Math.abs(theta-state.theta)>1e-6||Math.abs(phi-state.phi)>1e-6))state.leg=null;
 const startLeg=(index,fromTheta,fromPhi)=>{
  const [toTheta,toPhi]=orbitWaypoints[index];
  return {index,fromTheta,fromPhi,toTheta,toPhi,time:0,duration:Math.max(.001,Math.abs(toTheta-fromTheta),Math.abs(toPhi-fromPhi))/orbitRadiansPerSecond};
 };
 if(!state.leg)state.leg=startLeg(0,theta,phi);
 let remaining=Math.max(0,dt),leg=state.leg;
 while(remaining>=leg.duration-leg.time){
  remaining-=leg.duration-leg.time;
  leg=state.leg=startLeg((leg.index+1)%orbitWaypoints.length,leg.toTheta,leg.toPhi);
 }
 leg.time+=remaining;
 const blend=smooth(leg.time/leg.duration);
 state.theta=leg.fromTheta+(leg.toTheta-leg.fromTheta)*blend;
 state.phi=leg.fromPhi+(leg.toPhi-leg.fromPhi)*blend;
 const radius=controls.object.position.distanceTo(controls.target),damping=controls.enableDamping;
 // Flush manual momentum before placing the camera on the smooth path.
 controls.enableDamping=false;controls.update(0);
 controls.object.position.copy(controls.target).add(new Vector3().setFromSpherical(new Spherical(radius,state.phi,state.theta)));
 controls.update(0);controls.enableDamping=damping;controls.autoRotate=auto;
}
