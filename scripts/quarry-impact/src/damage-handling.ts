/** How accumulated damage changes the way a car drives (offline events only).
 * - Bent steering: front compression (structure[0]) cuts the available steering lock.
 * - Brake bias: a damaged corner's brake loses force, so the car pulls under braking.
 * - Overheating: a crushed front (radiator) keeps adding engine damage while the engine runs. */
const clamp01=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
export const STEER_LOSS=.4,BRAKE_LOSS=.45,RADIATOR={onset:.35,rate:.006,cap:.85} as const;
export function steeringLimit(structure:readonly number[]|undefined){return 1-STEER_LOSS*clamp01(structure?.[0]??0);}
export function brakeFactor(wheelDamage:number){return 1-BRAKE_LOSS*clamp01(wheelDamage);}
/** New engine damage after dt seconds of running with this front compression and throttle. */
export function overheat(engineDamage:number,frontCompression:number,throttle:number,dt:number){
  const crushed=clamp01((frontCompression-RADIATOR.onset)/(1-RADIATOR.onset));
  if(crushed<=0||!(dt>0)||engineDamage>=RADIATOR.cap)return engineDamage;
  return Math.min(RADIATOR.cap,engineDamage+dt*RADIATOR.rate*crushed*(.35+.65*clamp01(Math.abs(throttle))));
}
/** Slow puncture: a tyre damaged past LEAK.onset but not yet failed loses air while it rolls, faster
 * the more damaged it is, until it fails (tyreFailure starts at 0.72, fully flat by 0.92). */
export const LEAK={onset:.35,rate:.006,flat:.92} as const;
export function leakTyre(damage:number,speed:number,dt:number){
  if(!(dt>0)||!Number.isFinite(damage)||damage<LEAK.onset||damage>=LEAK.flat)return damage;
  const severity=(damage-LEAK.onset)/(LEAK.flat-LEAK.onset),rolling=Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/15);
  return Math.min(LEAK.flat,damage+dt*LEAK.rate*(.35+severity)*rolling);
}
/** A rim bent past BENT_RIM.onset breaks the tyre's bead seal: the tyre is at least at the slow-puncture onset,
 * more the worse the bend, and leakTyre takes it from there. */
export const BENT_RIM={onset:.18,gain:.4} as const;
export function bentRimTyre(tyreDamage:number,wheelDamage:number){
  if(!Number.isFinite(wheelDamage)||wheelDamage<BENT_RIM.onset)return tyreDamage;
  return Math.max(Number.isFinite(tyreDamage)?tyreDamage:0,LEAK.onset+(Math.min(1,wheelDamage)-BENT_RIM.onset)*BENT_RIM.gain);
}
/** Visual runout of a bent rim (radians of tilt in the wheel's spinning frame): none below BENT_RIM.onset. */
export function rimWobble(wheelDamage:number){return Number.isFinite(wheelDamage)&&wheelDamage>=BENT_RIM.onset?Math.min(.12,(wheelDamage-.1)*.18):0;}
/** A corner hit hard enough snaps its coil spring: the corner sags onto the bump stops (rest length and stiffness
 * drop) and the car leans that way. Harder still, the driveshaft to that wheel snaps and it stops driving. Natural
 * derby wheel damage tops out near 0.2 (wheels past 0.15 tend to be torn off), hence the low thresholds. */
export const SPRING={snap:.16,sag:.6,stiffness:.35,shaft:.19} as const;
export const springBias=(wheelDamage:number)=>wheelDamage>=SPRING.snap?SPRING.stiffness:1;
export const sagBias=(wheelDamage:number)=>wheelDamage>=SPRING.snap?SPRING.sag:1;
export const driveBias=(wheelDamage:number)=>wheelDamage>=SPRING.shaft?0:1;
/** A damaged corner's damper loses up to DAMPER_LOSS of its damping, so it bounces and wallows. */
/** Gearbox damage: crushing the driven end of the car past GEARBOX.onset strips the top gear, then more,
 * down to GEARBOX.min gears, which caps top speed. */
export const GEARBOX={onset:.3,step:.15,min:2} as const;
export type DriveLayout='front'|'rear'|'all';
export function gearLimit(structure:readonly number[]|undefined,drive:DriveLayout){
  const front=clamp01(structure?.[0]??0),rear=clamp01(structure?.[1]??0);
  const c=drive==='front'?front:drive==='rear'?rear:Math.max(front,rear)*.85;
  return Math.max(GEARBOX.min,5-Math.max(0,Math.floor((c-GEARBOX.onset)/GEARBOX.step)+1));
}
export function gearboxWarning(limit:number){return limit<5?`GEARBOX DAMAGED · ${limit} GEARS`:'';}
/** A tyre that bursts at speed snatches the car toward that corner: a backward tug at the wheel (yaw) and a
 * smaller sideways one, scaled by mass and speed (capped at 30 m/s). Nothing below BLOWOUT.minSpeed. */
export const BLOWOUT={minSpeed:6,drag:.05,side:.018} as const;
export function blowoutImpulse(mass:number,speed:number){
  const v=Math.abs(Number.isFinite(speed)?speed:0);if(!(mass>0)||v<BLOWOUT.minSpeed)return{drag:0,side:0};
  const s=Math.min(30,v);return{drag:mass*s*BLOWOUT.drag,side:mass*s*BLOWOUT.side};
}
/** A rear end crushed past SUBFRAME.onset (natural derby rears reach ~0.26) bends the subframe: both rear wheels steer the same way (a thrust angle), so
 * the car dog-tracks, crabbing down the road and pulling. It leans away from the more crushed flank. */
export const SUBFRAME={onset:.15,gain:.25,max:.05} as const;
export function thrustAngle(structure:readonly number[]|undefined){
  const rear=clamp01(structure?.[1]??0);if(rear<=SUBFRAME.onset)return 0;
  const left=clamp01(structure?.[2]??0),right=clamp01(structure?.[3]??0),side=right>left?1:right<left?-1:1;
  return side*Math.min(SUBFRAME.max,(rear-SUBFRAME.onset)*SUBFRAME.gain);
}
/** A front crushed past BRAKE_LINE.onset splits a brake line: the fluid leaks away (faster the worse the crush) and the
 * brakes fade on every wheel, down to BRAKE_LINE.floor of their force with the reservoir dry. */
export const BRAKE_LINE={onset:.45,rate:.02,floor:.25,warn:.7} as const;
export function leakBrakeFluid(fluid:number,frontCompression:number,dt:number){
  const c=clamp01(frontCompression);if(c<=BRAKE_LINE.onset||!(dt>0))return clamp01(fluid);
  return Math.max(0,clamp01(fluid)-(c-BRAKE_LINE.onset)/(1-BRAKE_LINE.onset)*BRAKE_LINE.rate*dt);
}
export const brakeFluidFactor=(fluid:number)=>BRAKE_LINE.floor+(1-BRAKE_LINE.floor)*clamp01(fluid);
export const brakeWarning=(fluid:number)=>clamp01(fluid)<BRAKE_LINE.warn?'BRAKES FADING':'';
/** A front crushed past POWER_STEER.onset wrecks the power-steering pump: the wheel turns slowly and heavily. */
export const POWER_STEER={onset:.5,rate:.4} as const;
export const steerRate=(frontCompression:number)=>clamp01(frontCompression)>POWER_STEER.onset?POWER_STEER.rate:1;
export const steerWarning=(rate:number)=>rate<1?'POWER STEERING FAILED':'';
/** A front crushed past THROTTLE_JAM.onset bends the throttle linkage on about half the cars (fixed per car): lifting off
 * leaves the engine at THROTTLE_JAM.hold, so the car keeps pulling until the brakes cut the drive. */
export const THROTTLE_JAM={onset:.6,hold:.35} as const;
export const throttleJams=(frontCompression:number,carId:number)=>clamp01(frontCompression)>THROTTLE_JAM.onset&&((carId*.61803+.27)%1)<.5;
export const jammedThrottle=(throttle:number,jammed:boolean)=>jammed&&throttle>=0?Math.max(throttle,THROTTLE_JAM.hold):throttle;
export const DAMPER_LOSS=.6;
export function damperFactor(wheelDamage:number){return 1-DAMPER_LOSS*clamp01(wheelDamage);}
/** A crushed engine end knocks the bellhousing out of line and the clutch starts to slip: its torque capacity
 * falls, so at heavy throttle the engine flares and the car barely pulls, while gentle throttle still grips.
 * Slipping burns the clutch further (CLUTCH.burn per second of slip), down to CLUTCH.floor. */
export const CLUTCH={onset:.4,span:.4,min:.55,burn:.006,floor:.35,margin:1.25,warn:.8} as const;
export function clutchGrip(engineEnd:number,burnt=0){
  const c=clamp01(engineEnd),b=clamp01(burnt);
  return Math.max(CLUTCH.floor,1-(1-CLUTCH.min)*clamp01((c-CLUTCH.onset)/CLUTCH.span)-b);
}
/** The clutch slips when the throttle asks for more torque than it can carry (a stock clutch carries 1.25× peak). */
export const clutchSlips=(grip:number,throttle:number)=>grip<1&&Math.abs(Number.isFinite(throttle)?throttle:0)>grip*CLUTCH.margin;
/** Drive force fraction a slipping clutch passes in the simple kernel: exactly 1 on a sound clutch. */
export const clutchForce=(grip:number,throttle:number)=>grip>=1||!clutchSlips(grip,throttle)?1:grip*CLUTCH.margin/Math.abs(throttle);
export const clutchWarning=(grip:number)=>grip<CLUTCH.warn?'CLUTCH SLIPPING':'';
/** Bent tie rods and worn rack bushes on a battered front wheel give the steering free play: small inputs do nothing
 * (a dead band round centre) and the car wanders at speed as the slack rattles from side to side. */
export const STEER_PLAY={onset:.12,gain:1.1,max:.3,wander:.035,warn:.12} as const;
export function steerPlay(frontWheelDamage:ArrayLike<number>|undefined){
  const d=Math.max(clamp01(frontWheelDamage?.[0]??0),clamp01(frontWheelDamage?.[1]??0));
  return Math.min(STEER_PLAY.max,Math.max(0,(d-STEER_PLAY.onset)*STEER_PLAY.gain));
}
/** Steering input after the slack is taken up; full lock is still full lock. */
export function slackSteer(steer:number,play:number){
  const s=Math.max(-1,Math.min(1,Number.isFinite(steer)?steer:0)),p=clamp01(play);
  if(!(p>0))return s;const a=Math.abs(s);return a<=p?0:Math.sign(s)*(a-p)/(1-p);
}
/** Wheel angle the slack wanders by (radians): two slow, unrelated swings, more at speed; fixed per car and time. */
export function steerWander(play:number,speed:number,time:number,seed:number){
  const p=clamp01(play),pace=Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/15);if(!(p>0&&pace>0))return 0;
  const w=Math.sin(time*1.7+seed*2.1)*.6+Math.sin(time*.63+seed*5.3)*.4;
  return w*p/STEER_PLAY.max*STEER_PLAY.wander*pace;
}
export const playWarning=(play:number)=>play>=STEER_PLAY.warn?'STEERING LOOSE':'';
/** A crushed wheel arch folds in onto the tyre: that corner drags (like a binding brake), the tyre scrubs itself down
 * toward a blowout and smokes. Front or rear crush on the axle plus side crush on that flank, past RUB.onset. */
export const RUB={onset:.35,span:.4,axle:.7,side:.9,kernel:14,drive:.1,torque:300,wear:.006,warn:.25} as const;
export function tyreRub(structure:readonly number[]|undefined,wheel:number){
  const axle=clamp01((wheel<2?structure?.[0]:structure?.[1])??0),side=clamp01((wheel%2?structure?.[3]:structure?.[2])??0);
  return clamp01((axle*RUB.axle+side*RUB.side-RUB.onset)/RUB.span);
}
/** Tyre damage scrubbed off per step: with the rub and the road speed (full from 10 m/s). */
export const rubWear=(rub:number,speed:number,dt:number)=>dt>0?clamp01(rub)*RUB.wear*Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/10)*dt:0;
export const rubWarning=(rubs:ArrayLike<number>)=>Array.from(rubs).some(r=>r>=RUB.warn)?'TYRE RUBBING':'';
/** A crushed engine bay chafes through the wiring loom: the ignition cuts out in short, irregular bursts (the engine dies
 * for a moment, no backfire) and the lights flicker with it. More crush, more and longer cuts. Fixed per car and time. */
export const ELECTRICAL={onset:.45,span:.4,period:.6,odds:.85,minCut:.1,maxCut:.45} as const;
export const electricalFault=(engineEnd:number)=>clamp01((clamp01(engineEnd)-ELECTRICAL.onset)/ELECTRICAL.span);
export function electricalCut(severity:number,time:number,seed:number){
  const s=clamp01(severity);if(!(s>0)||!Number.isFinite(time))return false;
  const slot=Math.floor(time/ELECTRICAL.period),h=(n:number)=>{const x=Math.sin(slot*12.9898+seed*78.233+n*37.719)*43758.5453;return x-Math.floor(x);};
  if(h(0)>=s*ELECTRICAL.odds)return false;
  const length=ELECTRICAL.minCut+(ELECTRICAL.maxCut-ELECTRICAL.minCut)*s*h(1),start=(ELECTRICAL.period-length)*h(2),t=time-slot*ELECTRICAL.period;
  return t>=start&&t<start+length;
}
export const electricalWarning=(severity:number)=>severity>0?'ELECTRICAL FAULT':'';
/** A wheel knocked past WHEEL_NUTS.onset starts working its nuts loose as it turns: the looser it gets the more it
 * shimmies (toe swinging with each revolution) and wobbles, until at 1 it comes off on the move. */
export const WHEEL_NUTS={onset:.12,rate:.01,shimmy:.035,tilt:.09,warn:.35} as const;
export function loosenNuts(loose:number,wheelDamage:number,metres:number){
  const d=clamp01(wheelDamage);if(d<=WHEEL_NUTS.onset||!(metres>0))return clamp01(loose);
  return clamp01(clamp01(loose)+metres*(d-WHEEL_NUTS.onset)/(1-WHEEL_NUTS.onset)*WHEEL_NUTS.rate);
}
/** Toe (radians) a loose wheel swings through at this point in its revolution. */
export const nutShimmy=(loose:number,angle:number)=>clamp01(loose)*WHEEL_NUTS.shimmy*Math.sin(Number.isFinite(angle)?angle:0);
export const nutWarning=(loose:ArrayLike<number>)=>Array.from(loose).some(v=>v>=WHEEL_NUTS.warn)?'WHEEL LOOSE':'';
/** A rear crush past EXHAUST_BLOW.onset splits the exhaust: the engine gets louder and raspier, and lifting off at speed
 * fires a crackle of pops with flame out of the tailpipe (which can light fuel on the ground). */
export const EXHAUST_BLOW={onset:.15,span:.4,loud:.7,lift:.6,off:.2,minSpeed:8,minPops:2,maxPops:6,gap:.05,spread:.08} as const;
export const exhaustBlow=(rear:number)=>clamp01((clamp01(rear)-EXHAUST_BLOW.onset)/EXHAUST_BLOW.span);
/** Engine sound gain for a split exhaust: exactly 1 on a sound one. */
export const exhaustLoudness=(severity:number)=>severity>0?1+EXHAUST_BLOW.loud*clamp01(severity):1;
/** Pop times (seconds after the lift) for this lift: more the worse the split; varied by a per-lift seed. */
export function liftPops(severity:number,seed:number){
  const s=clamp01(severity);if(!(s>0))return[];
  const h=(n:number)=>{const x=Math.sin(seed*12.9898+n*78.233)*43758.5453;return x-Math.floor(x);};
  const n=Math.round(EXHAUST_BLOW.minPops+(EXHAUST_BLOW.maxPops-EXHAUST_BLOW.minPops)*s*h(0));const out:number[]=[];let t=0;
  for(let i=0;i<n;i++){t+=EXHAUST_BLOW.gap+EXHAUST_BLOW.spread*h(i+1);out.push(t);}
  return out;
}
export const exhaustWarning=(severity:number)=>severity>0?'EXHAUST BLOWING':'';
