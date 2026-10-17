import type {WheelState} from './wheel';
export type EngineState={omega:number};
export type DriveSpec={inertia:number;peakTorque:number;idleRPM:number;redlineRPM:number;clutchTorque:number};
export const PROTOTYPE_ENGINE:DriveSpec={inertia:.32,peakTorque:400,idleRPM:850,redlineRPM:6500,clutchTorque:500};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
/** Engine-side clutch impulse, with equal and opposite wheel torque through
 * signed gearing. Weights describe the differential's torque distribution.
 * All wheel inertia participates in the effective clutch inertia calculation. */
export function stepDrive(engine:EngineState,wheels:readonly WheelState[],inertias:readonly number[],weights:readonly number[],ratio:number,throttle:number,clutch:number,dt:number,spec=PROTOTYPE_ENGINE,running=true){
 if(wheels.length!==weights.length||wheels.length!==inertias.length||!wheels.length||!Number.isFinite(dt)||dt<=0||![ratio,throttle,clutch,engine.omega,...inertias,...weights,...Object.values(spec)].every(Number.isFinite)||inertias.some(i=>i<=0)||weights.some(w=>w<0)||spec.inertia<=0)throw new RangeError('Invalid drivetrain step');
 const total=weights.reduce((s,w)=>s+w,0),shares=weights.map(w=>total>0?w/total:0);
 const rpm=engine.omega*60/(2*Math.PI),t=clamp(throttle,0,1);
 // Broad torque peak, declining toward the limiter; no road-speed-based RPM proxy.
 const curve=.65+.35*Math.max(0,1-((rpm-3800)/3800)**2),limiter=clamp((spec.redlineRPM-rpm)/250,0,1);
 const drag=20+Math.max(0,engine.omega)*.045;
 const idle=clamp((spec.idleRPM-rpm)*.8,0,spec.peakTorque*.45);
 const torque=(running?t*spec.peakTorque*curve*limiter+idle:0)-drag;
 const predicted=Math.max(0,engine.omega+torque*dt/spec.inertia);
 const wheelOmega=wheels.reduce((s,w,i)=>s+w.omega*shares[i],0);
 const inverse=1/spec.inertia+ratio*ratio*shares.reduce((s,w,i)=>s+w*w/inertias[i],0);
 const capacity=ratio!==0&&total>0?spec.clutchTorque*clamp(clutch,0,1)*dt:0;
 const impulse=clamp((predicted-wheelOmega*ratio)/inverse,-capacity,capacity);
 engine.omega=predicted-impulse/spec.inertia;
 return{torques:shares.map(w=>impulse*ratio*w/dt),rpm:engine.omega*60/(2*Math.PI),clutchImpulse:impulse,engineTorque:torque};
}
