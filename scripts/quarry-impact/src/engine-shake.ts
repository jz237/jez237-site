/** Engine shake (offline, render only): a running engine shakes the body on its mounts while the wheels stay planted.
 * Idling, it buzzes faintly; a battered engine runs rough and shudders harder, and each misfire kicks the body. Stabbing
 * the throttle rocks the body over against the crank's torque (the left, -x, side lifts: negative roll about the nose
 * axis) and it springs back with a little overshoot on the lift; broken mounts let it rock SHAKE.mounts times as far.
 * The torque rock fades out by SHAKE.fade m/s and the buzz by twice that, where the road hides them. Nothing here
 * touches the physics. */
export const SHAKE={idle:.0012,rough:.007,lift:.0012,roughLift:.006,torque:.03,mounts:2,spring:70,damp:6,hz:[21,29],kick:.15,misfire:.7,fade:6} as const;
export type Shake={roll:number;pitch:number;lift:number};
export const NO_SHAKE:Readonly<Shake>={roll:0,pitch:0,lift:0};
const finite=(v:number,fallback=0)=>Number.isFinite(v)?v:fallback;
/** The local height that keeps a wheel at (x, z) where it was once the body is rolled and pitched (small angles). */
export const plantedWheelY=(base:number,x:number,z:number,s:Readonly<Shake>)=>base-s.roll*x+s.pitch*z;
export class EngineShake{
  readonly out:Shake={roll:0,pitch:0,lift:0};
  private rock=0;private rate=0;private clock=0;private misfiring=false;
  /** Misfire kicks so far (QA). */
  kicks=0;
  /** Advance by dt: running engine, pedal 0–1, engine damage 0–1, misfire factor (1 = clean), broken mounts, speed m/s. */
  step(dt:number,running:boolean,throttle:number,damage:number,misfire:number,mounts:boolean,speed:number):Readonly<Shake>{
    if(!(dt>0))return this.out;
    const pace=Math.abs(finite(speed)),pedal=Math.min(1,Math.max(0,finite(throttle))),worn=Math.min(1,Math.max(0,finite(damage)));
    const target=running?SHAKE.torque*pedal*(mounts?SHAKE.mounts:1)*Math.max(0,1-pace/SHAKE.fade):0;
    const missed=running&&finite(misfire,1)<SHAKE.misfire;
    if(missed&&!this.misfiring){this.rate+=SHAKE.kick*(this.kicks%2?-1:1)*(.4+worn*.6);this.kicks++;}
    this.misfiring=missed;
    this.rate+=(SHAKE.spring*(target-this.rock)-SHAKE.damp*this.rate)*dt;this.rock+=this.rate*dt;
    this.clock+=dt;
    const buzz=running?Math.max(0,1-pace/(2*SHAKE.fade)):0,a=(SHAKE.idle+SHAKE.rough*worn)*buzz,t=this.clock*Math.PI*2;
    const one=Math.sin(t*SHAKE.hz[0]),two=Math.sin(t*SHAKE.hz[1]+1.3);
    this.out.roll=-this.rock+a*one;this.out.pitch=a*.5*two;this.out.lift=(SHAKE.lift+SHAKE.roughLift*worn)*buzz*(one*.6+two*.4);
    return this.out;
  }
  reset(){this.rock=this.rate=this.clock=0;this.misfiring=false;this.kicks=0;this.out.roll=this.out.pitch=this.out.lift=0;}
}
