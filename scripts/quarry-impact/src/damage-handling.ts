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
/** Throttle cable snapped (offline): a hit of CABLE.blow or more at the engine end of an engine already CABLE.engine damaged can
 * part the throttle cable (about CABLE.chance of such hits, the car's dice): from then on the engine only sees CABLE.limp of the
 * pedal either way, and the car limps on. */
export const CABLE={engine:.5,blow:12,chance:.35,limp:.6} as const;
export const cableSnaps=(engineDamage:number|undefined,damage:number,atEngineEnd:boolean,seed:number)=>atEngineEnd&&(engineDamage??0)>=CABLE.engine&&damage>=CABLE.blow&&Number.isFinite(seed)&&((seed*.6180339887+.41)%1+1)%1<CABLE.chance;
/** Handbrake cable snapped (offline): a hit of HANDBRAKE_CABLE.blow or more at the rear of a car whose rear is crushed
 * HANDBRAKE_CABLE.crush or more can part the handbrake cables to the rear wheels (about HANDBRAKE_CABLE.chance of such hits, the
 * car's dice): the handbrake does nothing from then on, so no more handbrake turns. */
export const HANDBRAKE_CABLE={crush:.4,blow:12,chance:.35} as const;
export const handbrakeSnaps=(rearCrush:number,damage:number,atRear:boolean,seed:number)=>atRear&&Number.isFinite(rearCrush)&&rearCrush>=HANDBRAKE_CABLE.crush&&damage>=HANDBRAKE_CABLE.blow&&Number.isFinite(seed)&&((seed*.6180339887+.53)%1+1)%1<HANDBRAKE_CABLE.chance;
export const cableThrottle=(throttle:number)=>Number.isFinite(throttle)?Math.max(-CABLE.limp,Math.min(CABLE.limp,throttle)):0;
/** Pushing burns the clutch (offline): holding PUSH_BURN.throttle or more against a car that will not move (pinning it, under
 * PUSH_BURN.speed m/s) cooks the clutch PUSH_BURN.rate a second, so long or repeated pins leave the pusher's clutch slipping at
 * full throttle once its burnt grip falls under 1/CLUTCH.margin. */
export const PUSH_BURN={throttle:.8,speed:2,rate:.02} as const;
export const pushBurn=(throttle:number,speed:number,dt:number)=>Number.isFinite(throttle)&&Number.isFinite(speed)&&dt>0&&Math.abs(throttle)>=PUSH_BURN.throttle&&Math.abs(speed)<PUSH_BURN.speed?PUSH_BURN.rate*dt:0;
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
/** A crushed driven end cracks the differential casing: the gears grind, wearing faster under load, and drive to that
 * axle fades as they chew themselves up; worn through, the diff lets go with a bang (a jolt as the gears jam) and that
 * axle gets no drive at all — a two-wheel-drive car can only coast, a four-wheel-drive one limps on its other axle. */
export const DIFF={onset:.35,span:.35,wear:.02,loss:.35,jolt:.25} as const;
export function diffDamage(structure:readonly number[]|undefined,drive:'front'|'rear'|'all'){
  const front=clamp01(structure?.[0]??0),rear=clamp01(structure?.[1]??0),c=drive==='front'?front:drive==='rear'?rear:Math.max(front,rear)*.85;
  return clamp01((c-DIFF.onset)/DIFF.span);
}
/** Which axle's differential takes the damage: the driven one, or for four-wheel drive the more crushed end. */
export const diffAxle=(structure:readonly number[]|undefined,drive:'front'|'rear'|'all'):'front'|'rear'=>drive!=='all'?drive:(structure?.[0]??0)>(structure?.[1]??0)?'front':'rear';
export const wearDiff=(wear:number,damage:number,throttle:number,dt:number)=>dt>0&&damage>0?clamp01(clamp01(wear)+damage*DIFF.wear*(.3+.7*clamp01(Math.abs(throttle)))*dt):clamp01(wear);
/** Drive fraction the damaged axle still gets: 1 healthy, fading as it grinds, 0 once broken. */
export const diffDrive=(wear:number)=>wear>=1?0:1-DIFF.loss*clamp01(wear);
export const diffWarning=(wear:number)=>wear>=1?'DIFF BROKEN':wear>0?'DIFF GRINDING':'';
/** A soft tyre (leaking, past LEAK.onset, not yet failed) rolls off its rim under hard cornering: the outside tyres take
 * the load, bead stress builds with how soft the tyre is and how hard the corner (lateral g past DEBEAD.lateral), and at 1
 * the bead lets go — that corner drops flat on the spot with a smaller snatch than a blowout. */
export const DEBEAD={lateral:5,span:6,rate:1.4,inside:.25,snatch:.55} as const;
export function beadStress(stress:number,tyreDamage:number,lateral:number,outside:boolean,dt:number){
  const d=Number.isFinite(tyreDamage)?tyreDamage:0;if(!(dt>0)||d<LEAK.onset||d>=.72)return 0;
  const soft=(d-LEAK.onset)/(.72-LEAK.onset),load=clamp01((Math.abs(Number.isFinite(lateral)?lateral:0)-DEBEAD.lateral)/DEBEAD.span)*(outside?1:DEBEAD.inside);
  return load>0?Math.min(1,clamp01(stress)+soft*load*DEBEAD.rate*dt):Math.max(0,clamp01(stress)-dt*.5);
}
/** A front wheel bashed past TIE_ROD.snap snaps its tie rod: that wheel no longer answers the steering — it flops, toed out
 * and shimmying on its own with the road speed — so the car turns on the other front wheel and scrubs the loose one. */
export const TIE_ROD={snap:.2,toe:.06,wobble:.05} as const;
export const tieRodSnapped=(wheel:number,wheelDamage:number)=>wheel<2&&Number.isFinite(wheelDamage)&&wheelDamage>=TIE_ROD.snap;
/** Toe (radians) the disconnected wheel flops to: out toward its own side, plus a wander that grows to 8 m/s. */
export function flopToe(wheel:number,speed:number,time:number){
  const side=wheel%2?1:-1,pace=Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/8),t=Number.isFinite(time)?time:0;
  return side*TIE_ROD.toe+TIE_ROD.wobble*pace*(Math.sin(t*3.1+wheel)*.7+Math.sin(t*7.3+wheel*2)*.3);
}
export const tieRodWarning=(snapped:ArrayLike<number>)=>Array.from(snapped).some(v=>v===0)?'TIE ROD SNAPPED':'';
/** A stripped gearbox jumps out of gear under load: with the throttle hard down it pops into neutral now and then — the
 * revs flare, the drive goes, and a moment later it clunks back in. More gears lost, more often. Fixed per car and time. */
export const GEAR_POP={period:1.2,odds:.1,cap:.4,throttle:.7,minLength:.4,maxLength:.8} as const;
/** Length (s) of a pop that starts in this time slot, or 0: at most one per slot, chance growing with each lost gear. */
export function gearPop(gearLimit:number,time:number,seed:number){
  const lost=5-Math.max(1,Math.min(5,Math.floor(Number.isFinite(gearLimit)?gearLimit:5)));if(lost<=0||!Number.isFinite(time))return 0;
  const slot=Math.floor(time/GEAR_POP.period),h=(n:number)=>{const x=Math.sin(slot*91.17+seed*12.13+n*45.7)*43758.5453;return x-Math.floor(x);};
  return h(0)<Math.min(GEAR_POP.cap,lost*GEAR_POP.odds)?GEAR_POP.minLength+(GEAR_POP.maxLength-GEAR_POP.minLength)*h(1):0;
}
/** A wheel knocked past CALIPER.bend bends its brake caliper: the brake binds and drags that corner (more the harder it
 * was hit). Dragging heats the disc — it glows orange past CALIPER.glow and smokes — and a hot disc fades that brake
 * and cooks the tyre. Cools when the car stops. */
export const CALIPER={bend:.17,span:.25,min:.3,heat:.035,cool:.06,glow:.45,fade:.5,tyre:.012,smoke:.7} as const;
export const caliperDrag=(wheelDamage:number)=>{const d=Number.isFinite(wheelDamage)?wheelDamage:0;return d<CALIPER.bend?0:CALIPER.min+(1-CALIPER.min)*clamp01((d-CALIPER.bend)/CALIPER.span);};
export const discHeat=(heat:number,drag:number,speed:number,dt:number)=>dt>0?clamp01(clamp01(heat)+(clamp01(drag)*Math.abs(Number.isFinite(speed)?speed:0)*CALIPER.heat-CALIPER.cool*clamp01(heat))*dt):clamp01(heat);
/** Glow 0..1 of a disc at this heat. */
export const discGlow=(heat:number)=>{const t=clamp01((clamp01(heat)-CALIPER.glow)/(1-CALIPER.glow));return t*t*(3-2*t);};
/** That wheel's brake force left as the disc overheats (exactly 1 below .6). */
export const discFade=(heat:number)=>heat>.6?1-CALIPER.fade*clamp01((heat-.6)/.4):1;
export const caliperWarning=(drag:ArrayLike<number>)=>Array.from(drag).some(v=>v>0)?'BRAKE BINDING':'';
/** A crushed engine bay past MOUNTS.onset breaks the engine mounts: the engine rocks in the bay, so every stab or lift of
 * the throttle jolts the body over (torque reaction) with a clunk, and the drive takes up late as the engine shunts
 * before it bites (the throttle follows the pedal at MOUNTS.lag per second instead of at once). */
export const MOUNTS={onset:.5,lag:5,jolt:.25,minStep:.25,gap:.3} as const;
export const mountsBroken=(engineEnd:number)=>Number.isFinite(engineEnd)&&engineEnd>=MOUNTS.onset;
/** The throttle the drive actually gets this step: lagging the pedal on broken mounts, the pedal itself otherwise. */
export const shuntThrottle=(effective:number,pedal:number,dt:number)=>{const p=Number.isFinite(pedal)?pedal:0,e=Number.isFinite(effective)?effective:p;return dt>0?e+(p-e)*Math.min(1,MOUNTS.lag*dt):e;};
export const mountsWarning=(broken:boolean)=>broken?'ENGINE MOUNTS BROKEN':'';
/** A disc held white-hot (past BRAKE_FIRE.heat) for BRAKE_FIRE.after seconds sets its tyre alight: burning rubber drops off the
 * wheel (a small fire on the ground that can catch the car), the tyre burns down, and the car itself catches once. */
export const BRAKE_FIRE={heat:.95,after:8,cool:2,drop:1.2,tyre:.08} as const;
/** Seconds the disc has been white-hot: builds while hot, falls back twice as fast once it cools. */
export const brakeFireClock=(clock:number,heat:number,dt:number)=>{const c=Number.isFinite(clock)?Math.max(0,clock):0;return dt>0?(heat>=BRAKE_FIRE.heat?c+dt:Math.max(0,c-dt*BRAKE_FIRE.cool)):c;};
/** A crushed engine bay past STARTER.onset damages the starter: after a stall it cranks slower (part of each second of
 * cranking is lost) and a crank can fail to catch — the engine coughs and the starter has to go again. Fixed per car and
 * attempt, and always within MAX_ENGINE_RESTART so replays stay valid. */
export const STARTER={onset:.55,span:.35,slow:.5,fail:.4,retry:1.2} as const;
export const starterDamage=(engineEnd:number)=>clamp01((clamp01(engineEnd)-STARTER.onset)/STARTER.span);
export function starterFails(severity:number,attempt:number,seed:number){
  const s=clamp01(severity);if(!(s>0))return false;const x=Math.sin(attempt*17.17+seed*3.7)*43758.5453;return x-Math.floor(x)<STARTER.fail*s;
}
export const starterWarning=(severity:number)=>severity>0?'STARTER DAMAGED':'';
/** Bump start (offline): a stalled engine that has been dead for BUMP_START.after seconds catches once the car has rolled
 * at BUMP_START.speed or more with the throttle held for BUMP_START.hold seconds — a shove from a rival or a slope turns
 * it over, starter or no starter. Catching drags the car back by BUMP_START.jolt of its speed (compression). */
export const BUMP_START={after:1.2,speed:3.5,hold:.25,jolt:.08,credit:3} as const;
/** Seconds rolled fast enough with the throttle held; anything else starts the count again. */
export const bumpRoll=(roll:number,speed:number,throttle:number,dt:number)=>Number.isFinite(speed)&&Math.abs(speed)>=BUMP_START.speed&&Math.abs(throttle)>.2&&dt>0?(Number.isFinite(roll)?Math.max(0,roll):0)+dt:0;
export const bumpCatches=(stallTime:number,roll:number)=>stallTime>=BUMP_START.after&&roll>=BUMP_START.hold;
/** The rival whose hit in the last BUMP_START.credit seconds shoved the engine back into life, or -1. */
export const bumpStartedBy=(last:{by:number;at:number}|undefined,self:number,time:number)=>last&&last.by!==self&&last.by>=0&&time-last.at<=BUMP_START.credit?last.by:-1;
/** A big side hit (T-bone) past FRAME_BEND.onset bends the chassis like a banana: the front axle yaws toward the dented
 * side and the rear axle the other way, so the car keeps turning toward the damage and needs countersteer to go straight.
 * Returns the toe (radians) each wheel is knocked to: fronts +, rears −, signed toward the more crushed flank. */
export const FRAME_BEND={onset:.15,gain:.17,max:.06} as const;
export function frameBend(structure:readonly number[]|undefined){
  const left=clamp01(structure?.[2]??0),right=clamp01(structure?.[3]??0),worst=Math.max(left,right);
  const b=Math.min(FRAME_BEND.max,Math.max(0,(worst-FRAME_BEND.onset)*FRAME_BEND.gain));return b>0?(right>=left?1:-1)*b:0;
}
export const frameWarning=(bend:number)=>bend!==0?'FRAME BENT':'';
/** A huge hit (past DAZE.min damage) shakes the driver: for a moment the steering follows the wheel lazily (DAZE.follow per
 * second instead of at once). Bigger hits, longer daze, up to DAZE.max seconds. */
export const DAZE={min:24,gain:.05,base:.6,max:2.2,follow:3} as const;
export const dazeFor=(damage:number)=>Number.isFinite(damage)&&damage>=DAZE.min?Math.min(DAZE.max,DAZE.base+(damage-DAZE.min)*DAZE.gain):0;
export const dazedSteer=(current:number,wheel:number,dt:number)=>{const w=Number.isFinite(wheel)?wheel:0,c=Number.isFinite(current)?current:w;return dt>0?c+(w-c)*Math.min(1,DAZE.follow*dt):c;};
export const dazeWarning=(seconds:number)=>seconds>0?'DAZED':'';
/** Where a derby rival aims (offline): the outside of this car's most crushed end or flank once it is crushed past
 * WEAK_SPOT.onset, or null. Offsets are along the car's own axes (half length / half width). */
export const WEAK_SPOT={onset:.3} as const;
export function weakSpot(structure:readonly number[]|undefined,at:{x:number;z:number},forward:{x:number;z:number},right:{x:number;z:number},halfLength:number,halfWidth:number){
  const z=[0,1,2,3].map(i=>clamp01(structure?.[i]??0)),worst=z.indexOf(Math.max(...z));if(!(z[worst]>=WEAK_SPOT.onset))return null;
  const along=worst===0?halfLength:worst===1?-halfLength:0,side=worst===2?-halfWidth:worst===3?halfWidth:0;
  return{x:at.x+forward.x*along+right.x*side,z:at.z+forward.z*along+right.z*side};
}
/** Driving over broken-off debris can puncture a tyre: a wheel rolling over a piece faster than PUNCTURE.speed gets a slow
 * leak (tyre damage raised to just past LEAK.onset — the slow-puncture chain does the rest) about PUNCTURE.odds of the time,
 * at most once every PUNCTURE.gap seconds per wheel. */
export const PUNCTURE={reach:.35,speed:6,odds:.15,gap:2,leak:.05} as const;
export const punctures=(seed:number,count:number)=>{const x=Math.sin(seed*12.7+count*91.3)*43758.5453;return x-Math.floor(x)<PUNCTURE.odds;};
/** An AI driver nursing a sick engine (oil or coolant low): forward throttle is held to NURSE.throttle so it lasts longer;
 * reversing, braking and steering are left alone. Returns the throttle to use. */
export const NURSE={throttle:.65} as const;
export const nurseThrottle=(throttle:number,sick:boolean)=>sick&&throttle>NURSE.throttle?NURSE.throttle:throttle;
/** An axle whose wheel is bashed past ROLL_BAR.snap snaps its anti-roll bar on about half the cars (ROLL_BAR.share, fixed per
 * car and axle). That axle stops resisting body roll, so the car leans much further in corners — as if its weight sat
 * ROLL_BAR.lift metres higher per snapped bar. The push fades out as the body tilts toward ROLL_BAR.fade (sine of the tilt, about
 * 8°): once the springs are at their limit a missing bar changes nothing, so it never tips a car over by itself. */
export const ROLL_BAR={snap:.07,share:.55,lift:1.3,lateral:12,fade:.14} as const;
export function rollBarSnaps(axle:number,wheelDamage:ArrayLike<number>,carId:number){
  const hit=Math.max(wheelDamage[axle*2]??0,wheelDamage[axle*2+1]??0);
  const x=Math.sin(carId*31.9+axle*57.1+1.3)*43758.5453;
  return Number.isFinite(hit)&&hit>=ROLL_BAR.snap&&x-Math.floor(x)<ROLL_BAR.share;
}
type Vec3={x:number;y:number;z:number};
/** Extra roll torque (N·m, world frame) from `bars` snapped anti-roll bars: the cornering force (centripetal acceleration
 * ω×v from the yaw rate, capped at ROLL_BAR.lateral) acting ROLL_BAR.lift·bars above the centre of mass, along the body's up,
 * faded out by the body's tilt. */
export function rollTorque(mass:number,up:Vec3,velocity:Vec3,yawRate:number,bars:number):Vec3{
  const zero={x:0,y:0,z:0};
  if(!(bars>0)||![mass,up.x,up.y,up.z,velocity.x,velocity.z,yawRate].every(Number.isFinite))return zero;
  let ax=yawRate*velocity.z,az=-yawRate*velocity.x;const a=Math.hypot(ax,az);
  if(a>ROLL_BAR.lateral){ax*=ROLL_BAR.lateral/a;az*=ROLL_BAR.lateral/a;}
  // Centrifugal force F=-m·a applied at r=up·h: τ=r×F.
  const fade=Math.max(0,1-Math.hypot(up.x,up.z)/ROLL_BAR.fade);if(fade<=0)return zero;
  const h=ROLL_BAR.lift*Math.min(2,bars)*fade,fx=-mass*ax,fz=-mass*az,rx=up.x*h,ry=up.y*h,rz=up.z*h;
  return {x:ry*fz,y:rz*fx-rx*fz,z:-ry*fx};
}
export const rollBarWarning=(intact:ArrayLike<number>)=>Array.from(intact).some(v=>v===0)?'ROLL BAR SNAPPED':'';
/** A propshaft (front-engined rear- and four-wheel-drive cars) bends in a hard landing or when the rear is crushed into it.
 * A bent shaft vibrates with the square of road speed — the car shakes — and driven fast it fatigues until it snaps and
 * the rear wheels lose drive. Gentle speeds never fatigue it. */
export const PROPSHAFT={fall:8,landGain:.12,crush:.05,crushGain:6,speed:28,cap:1.5,safe:.15,life:8,bent:.12} as const;
export const hasPropshaft=(layout:'front'|'rear'|'all',rearEngine:boolean)=>layout!=='front'&&!rearEngine;
/** Bend after a landing at `fall` m/s (adds) and with this rear crush (a floor): 0 straight, 1 badly kinked. */
export function propBend(bend:number,fall:number,rearCrush:number){
  let b=Number.isFinite(bend)?bend:0;
  if(Number.isFinite(fall)&&fall>PROPSHAFT.fall)b+=(fall-PROPSHAFT.fall)*PROPSHAFT.landGain;
  if(Number.isFinite(rearCrush)&&rearCrush>PROPSHAFT.crush)b=Math.max(b,(rearCrush-PROPSHAFT.crush)*PROPSHAFT.crushGain);
  return clamp01(b);
}
export function propVibration(bend:number,speed:number){
  const s=Math.abs(Number.isFinite(speed)?speed:0)/PROPSHAFT.speed;
  return Math.min(PROPSHAFT.cap,clamp01(bend)*s*s);
}
/** Fatigue after dt seconds at this vibration; the shaft snaps at 1. */
export function fatigueProp(wear:number,vibration:number,dt:number){
  const w=Number.isFinite(wear)?wear:0,v=Number.isFinite(vibration)?vibration:0;
  return Math.min(1,w+Math.max(0,v-PROPSHAFT.safe)*Math.max(0,dt)/PROPSHAFT.life);
}
export const propWarning=(bend:number,snapped:boolean)=>snapped?'PROPSHAFT SNAPPED':bend>=PROPSHAFT.bent?'PROPSHAFT BENT':'';
/** A knocked wheel cracks its bearing on some cars (BEARING.share, fixed per car and wheel): it growls, louder and higher with
 * speed, and wears with every metre. Past BEARING.play the wheel wobbles and the hub drags and heats; at 1 it seizes — the
 * wheel all but locks, the car pulls hard toward it and the hub cooks (the drag runs through the brake-drag path). */
export const BEARING={onset:.06,share:.4,start:.05,rate:.0014,play:.6,shimmy:.03,drag:.6,seize:8,growl:.2} as const;
export function bearingCracks(wheel:number,wheelDamage:number,carId:number){
  const x=Math.sin(carId*17.3+wheel*41.9+2.7)*43758.5453;
  return Number.isFinite(wheelDamage)&&wheelDamage>=BEARING.onset&&x-Math.floor(x)<BEARING.share;
}
/** Wear after rolling `metres` (0 = sound bearing; a cracked one starts at BEARING.start). */
export function wearBearing(wear:number,metres:number){
  const w=clamp01(wear);return w<=0?0:Math.min(1,w+Math.max(0,Number.isFinite(metres)?metres:0)*BEARING.rate);
}
/** How loud the growl is: the wear, rising with speed. */
export const bearingGrowl=(wear:number,speed:number)=>clamp01(wear)*Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/15);
/** Extra toe (radians) from a bearing with play in it, swinging with the wheel's turn. */
export const bearingShimmy=(wear:number,angle:number)=>{const p=clamp01((clamp01(wear)-BEARING.play)/(1-BEARING.play));return p*BEARING.shimmy*Math.sin(Number.isFinite(angle)?angle:0);};
/** Drag on the hub (same units as caliper drag): none until play, growing to BEARING.drag, then BEARING.seize once seized. */
export const bearingDrag=(wear:number)=>{const w=clamp01(wear);return w>=1?BEARING.seize:w<=BEARING.play?0:BEARING.drag*(w-BEARING.play)/(1-BEARING.play);};
export const bearingWarning=(wear:ArrayLike<number>)=>{const a=Array.from(wear);return a.some(v=>v>=1)?'BEARING SEIZED':a.some(v=>v>=BEARING.growl)?'BEARING GROWLING':'';};
/** A front corner knocked harder than the other bends that side's steering into the crushed arch: the wheels no longer turn
 * fully toward the damaged side; the other way is untouched. Signed like the steer input (+ right, − left): the share of
 * lock lost when steering that way. */
export const STEER_SKEW={onset:.04,span:.12,max:.6,warn:.15} as const;
export function steerSkew(frontLeft:number,frontRight:number){
  const d=(Number.isFinite(frontRight)?frontRight:0)-(Number.isFinite(frontLeft)?frontLeft:0),m=Math.abs(d);
  return m<=STEER_SKEW.onset?0:Math.sign(d)*STEER_SKEW.max*clamp01((m-STEER_SKEW.onset)/STEER_SKEW.span);
}
/** Multiplier on a steer input of this sign: short only toward the bent side. */
export const skewFactor=(steer:number,skew:number)=>skew!==0&&Number.isFinite(skew)&&Math.sign(steer)===Math.sign(skew)?1-Math.min(1,Math.abs(skew)):1;
export const skewWarning=(skew:number)=>Math.abs(Number.isFinite(skew)?skew:0)<STEER_SKEW.warn?'':`${skew>0?'RIGHT':'LEFT'} LOCK SHORT`;
/** Wind through the wreck: a missing windscreen, side glass, doors or bonnet open the car to the air. Openness 0 (sealed) to 1
 * drags the car with the square of its speed and lets a wind roar into the cabin. */
export const AERO={windscreen:.4,pane:.06,panes:.3,door:.1,hood:.1,lid:.05,drag:2.4,roar:28} as const;
export function openness(o:{windscreen?:boolean;panes?:number;doors?:number;hood?:boolean;lids?:number}){
  const n=(v:number|undefined)=>Math.max(0,Number.isFinite(v)?v!:0);
  return clamp01((o.windscreen?AERO.windscreen:0)+Math.min(AERO.panes,n(o.panes)*AERO.pane)+n(o.doors)*AERO.door+(o.hood?AERO.hood:0)+n(o.lids)*AERO.lid);
}
/** Extra drag force (N) at this speed and openness. */
export const openDrag=(open:number,speed:number)=>{const v=Number.isFinite(speed)?speed:0;return clamp01(open)*AERO.drag*v*v;};
/** Wind roar level 0..1 heard in the cabin. */
export const windRoar=(open:number,speed:number)=>{const s=Math.abs(Number.isFinite(speed)?speed:0)/AERO.roar;return clamp01(open)*Math.min(1,s*s);};
/** The fan belt: a crushed front knocks the pulleys out of line, so the belt slips and squeals under load; past BELT.snap
 * it snaps on most cars. Then the water pump stops (the engine heats whatever the radiator) and the alternator stops: the
 * battery runs down over BELT.battery seconds, the lights flicker and die, the ignition sputters, and flat it stops the car. */
export const BELT={slip:.14,snap:.28,share:.6,heat:.004,cap:.85,battery:75,dim:.35,sputter:.2,slot:.25,cutOdds:.7} as const;
export const beltSlip=(front:number)=>clamp01(((Number.isFinite(front)?front:0)-BELT.slip)/(BELT.snap-BELT.slip));
export function beltSnaps(front:number,carId:number){const x=Math.sin(carId*23.7+5.1)*43758.5453;return Number.isFinite(front)&&front>=BELT.snap&&x-Math.floor(x)<BELT.share;}
/** Squeal level 0..1: a slipping belt under throttle. */
export const beltSqueal=(slip:number,throttle:number)=>clamp01(slip)*clamp01((Math.abs(Number.isFinite(throttle)?throttle:0)-.3)/.7);
/** Engine damage after dt seconds running with no water pump. */
export const beltHeat=(engineDamage:number,throttle:number,dt:number)=>engineDamage>=BELT.cap||!(dt>0)?engineDamage:Math.min(BELT.cap,engineDamage+dt*BELT.heat*(.35+.65*clamp01(Math.abs(Number.isFinite(throttle)?throttle:0))));
/** Battery charge after dt seconds running with no alternator. */
export const drainBattery=(level:number,running:boolean,dt:number)=>running&&dt>0?Math.max(0,clamp01(level)-dt/BELT.battery):clamp01(level);
const slotHash=(slot:number,seed:number)=>{const x=Math.sin(slot*12.9898+seed*78.233)*43758.5453;return x-Math.floor(x);};
/** Whether a low battery cuts the ignition in this moment: never above BELT.sputter, more often as it drains, always when flat. */
export function batteryCut(level:number,clock:number,seed:number){
  const l=clamp01(level);if(l<=0)return true;if(l>=BELT.sputter)return false;
  return slotHash(Math.floor((Number.isFinite(clock)?clock:0)/BELT.slot),seed)<(1-l/BELT.sputter)*BELT.cutOdds;
}
/** Whether the headlights are lit at this charge: full above BELT.dim, flickering below, dark when flat. */
export function batteryLights(level:number,clock:number,seed:number){
  const l=clamp01(level);if(l>=BELT.dim)return true;if(l<=0)return false;
  return slotHash(Math.floor((Number.isFinite(clock)?clock:0)/.12),seed+7)<l/BELT.dim;
}
export const beltWarning=(slip:number,snapped:boolean,battery:number)=>snapped?(battery<=0?'BATTERY FLAT':battery<BELT.dim?'BATTERY LOW':'FAN BELT SNAPPED'):slip>=.3?'BELT SLIPPING':'';
/** A badly worn engine (engineDamage past OVERHEAT_FIRE.damage) with nothing cooling it — a crushed radiator, the coolant
 * gone or the fan belt snapped — run hard heats up; held hot for OVERHEAT_FIRE.after seconds it catches fire on some cars
 * (OVERHEAT_FIRE.share, fixed per car). Easing off cools it again at OVERHEAT_FIRE.cool times the rate. */
export const OVERHEAT_FIRE={damage:.6,throttle:.55,after:12,cool:.5,share:.5,warn:3} as const;
export const runningHot=(engineDamage:number,cooling:boolean,throttle:number)=>!cooling&&Number.isFinite(engineDamage)&&engineDamage>=OVERHEAT_FIRE.damage&&Math.abs(Number.isFinite(throttle)?throttle:0)>=OVERHEAT_FIRE.throttle;
/** Seconds held hot after dt: rises while hot, falls (slower) while not. */
export const hotClock=(t:number,hot:boolean,dt:number)=>{const v=Math.max(0,Number.isFinite(t)?t:0);return dt>0?hot?v+dt:Math.max(0,v-dt*OVERHEAT_FIRE.cool):v;};
export function overheatFire(t:number,carId:number){const x=Math.sin(carId*19.1+7.7)*43758.5453;return t>=OVERHEAT_FIRE.after&&x-Math.floor(x)<OVERHEAT_FIRE.share;}
export const overheatWarning=(t:number)=>t>=OVERHEAT_FIRE.warn?'ENGINE OVERHEATING':'';
/** An AI driver whose engine is overheating backs off below OVERHEAT_FIRE.throttle so it cools (forward throttle only). */
export const coolThrottle=(throttle:number,hot:boolean)=>hot&&throttle>OVERHEAT_FIRE.throttle-.1?OVERHEAT_FIRE.throttle-.1:throttle;
/** An AI driver whose lock is short toward its target (STEER_SKEW at least LONG_WAY.skew) and has it well behind
 * (past LONG_WAY.angle) turns the long way round on its good lock. Returns the steer to use, or null to steer as usual. */
export const LONG_WAY={skew:.3,angle:1.9} as const;
export function longWay(angle:number,skew:number){
  if(!Number.isFinite(angle)||!Number.isFinite(skew)||Math.abs(skew)<LONG_WAY.skew||Math.abs(angle)<LONG_WAY.angle)return null;
  return Math.sign(angle)===Math.sign(skew)?-Math.sign(angle):null;
}
/** Big hits throw what they break off: parts released by a blow leave along the blow's direction at DEBRIS_FLING.per m/s per
 * point of damage (up to DEBRIS_FLING.max), with a lift; a slow knock just lets them drop. Returns the extra velocity. */
export const DEBRIS_FLING={per:.22,max:12,lift:.3} as const;
export function debrisFling(direction:{x:number;y:number;z:number},damage:number){
  const l=Math.hypot(direction.x,direction.y,direction.z),s=Math.min(DEBRIS_FLING.max,Math.max(0,Number.isFinite(damage)?damage:0)*DEBRIS_FLING.per);
  if(!(l>0)||!Number.isFinite(l)||s<=0)return{x:0,y:0,z:0};
  return{x:direction.x/l*s,y:Math.max(0,direction.y/l*s)+s*DEBRIS_FLING.lift,z:direction.z/l*s};
}
/** A smash into the engine end (SMASH_FIRE.damage or more in one blow, offline) splits a fuel or oil line on some hits
 * (SMASH_FIRE.odds, decided per car and hit count) and the engine bay goes up at once. */
export const SMASH_FIRE={damage:45,odds:.25} as const;
export function smashFire(damage:number,engineEnd:boolean,carId:number,hits:number){
  if(!engineEnd||!Number.isFinite(damage)||damage<SMASH_FIRE.damage)return false;
  const x=Math.sin(carId*41.3+hits*17.9+3.1)*43758.5453;return x-Math.floor(x)<SMASH_FIRE.odds;
}
/** Where a blow lands changes what it does (offline): a T-bone square into the doors (no crumple zone) hurts up to
 * IMPACT_ZONE.side times as much, a nose-on hit into the crumple zone IMPACT_ZONE.nose times. point and direction are in
 * the car's own frame (x right, z forward); halfWidth/halfLength are the body's. */
export const IMPACT_ZONE={side:1.3,nose:.9,doors:.6,edge:.55} as const;
export function impactZoneFactor(point:{x:number;z:number},direction:{x:number;z:number},halfWidth:number,halfLength:number){
  const l=Math.hypot(direction.x,direction.z);
  if(!(l>0)||![point.x,point.z,halfWidth,halfLength].every(Number.isFinite)||halfWidth<=0||halfLength<=0)return 1;
  const lateral=Math.abs(direction.x)/l,along=Math.abs(direction.z)/l;
  const doors=Math.abs(point.x)/halfWidth>=IMPACT_ZONE.edge&&Math.abs(point.z)/halfLength<=IMPACT_ZONE.doors;
  const nose=point.z/halfLength>=1-IMPACT_ZONE.edge*.5;
  if(doors)return 1+(IMPACT_ZONE.side-1)*lateral*lateral;
  if(nose)return 1-(1-IMPACT_ZONE.nose)*along*along;
  return 1;
}
/** PIT spin (offline): a sideways shove behind a moving car's rear axle line pushes its rear tyres past their peak grip, and a
 * sliding tyre grips less than a rolling one. For a moment the rear tyres keep only 1-loss·strength of their grip, fading over
 * `fade` seconds, so the car can spin out as in a real PIT manoeuvre. Strength grows with the closing speed up to `full`. */
export const PIT={speed:7,behind:.3,lateral:.6,closing:1.2,full:5,loss:.75,fade:1.2} as const;
export function pitStrength(point:{x:number;z:number},direction:{x:number;z:number},halfLength:number,speed:number,closing:number){
  const l=Math.hypot(direction.x,direction.z);
  if(!(l>0)||![point.x,point.z,halfLength,speed,closing].every(Number.isFinite)||halfLength<=0)return 0;
  if(Math.abs(speed)<PIT.speed||point.z>-PIT.behind*halfLength||Math.abs(direction.x)/l<PIT.lateral)return 0;
  return Math.max(0,Math.min(1,(closing-PIT.closing)/(PIT.full-PIT.closing)));
}
/** Rear tyre grip left while sliding after a PIT shove. */
export const pitGrip=(slide:number)=>1-PIT.loss*Math.max(0,Math.min(1,Number.isFinite(slide)?slide:0));
/** Pinned (offline): a car shoved by another car with at least PIN.force newtons while a wall or a second car pushes back
 * from the far side (horizontal contact directions from its centre at a cosine below PIN.opposed) is held there. After
 * PIN.hold seconds pinned it crushes in at both contacts, PIN.rate health a second (the wall side `wall` of that), in
 * ticks of PIN.gap seconds, each big enough on both sides to dent the panels and crumple the structure. Breaking contact
 * bleeds the clock off at PIN.decay times real time, so a shove that flickers between solver steps stays one pin. The first
 * crush lands as the pin takes hold. A pin held PIN.feed seconds makes the derby feed; the same car counts as pinned (points,
 * calls) at most once every PIN.recount seconds, however often it is pinned again. */
export const PIN={force:2500,opposed:-.3,hold:.5,decay:2,gap:.5,rate:8,wall:.6,feed:1.5,recount:6} as const;
/** Whether a pin on a car last counted at `last` (or never) counts again at `time`. */
export const pinCounts=(last:number|undefined,time:number)=>last===undefined||!(time-last<PIN.recount);
/** A horizontal shove on a car: where it lands, how hard, and from which car (by<0: a wall or other scenery). */
export type PinPush={x:number;z:number;force:number;by:number};
/** The strongest car push on a car centred at (x,z) that something on the far side pushes back against: indices of the
 * pusher and of the push it is squeezed against, or null when the car is not pinned. */
export function pinnedBy(x:number,z:number,pushes:readonly PinPush[]):{push:number;against:number}|null{
  const dir=(p:PinPush)=>{const dx=p.x-x,dz=p.z-z,l=Math.hypot(dx,dz);return Number.isFinite(l)&&l>1e-6&&p.force>=PIN.force?{x:dx/l,z:dz/l}:null;};
  let best:{push:number;against:number}|null=null;
  pushes.forEach((p,i)=>{const a=p.by>=0?dir(p):null;if(!a||best&&pushes[best.push].force>=p.force)return;
    let against=-1;pushes.forEach((o,j)=>{const b=o.by!==p.by?dir(o):null;if(b&&a.x*b.x+a.z*b.z<PIN.opposed&&(against<0||o.force>pushes[against].force))against=j;});
    if(against>=0)best={push:i,against};});
  return best;
}
/** Seconds pinned after a step of dt: counts up while pinned and bleeds off at PIN.decay times real time once free. */
export const pinClock=(time:number,pinned:boolean,dt:number)=>!Number.isFinite(time)||!(dt>0)?0:pinned?time+dt:Math.max(0,time-dt*PIN.decay);
/** Fuel tank down (offline): with the tank's end crushed to TANK_DROP.crush or more, a hit there of TANK_DROP.blow or more snaps
 * the straps. The tank hangs from its filler neck and drags along the ground: sparks at TANK_DROP.speed m/s or more (hot enough
 * above TANK_DROP.hot to light its own fuel), the fuel leaking at TANK_DROP.leak. Dragged TANK_DROP.after seconds it tears off,
 * leaving TANK_DROP.reserve of fuel to run out of the open lines: the car is on fumes. */
export const TANK_DROP={crush:.5,blow:9,leak:.6,speed:3,hot:11,after:5,reserve:.06,size:{x:.72,y:.2,z:.5},hang:.6} as const;
export const tankDrops=(crush:number,damage:number,atTankEnd:boolean)=>atTankEnd&&Number.isFinite(crush)&&crush>=TANK_DROP.crush&&Number.isFinite(damage)&&damage>=TANK_DROP.blow;
/** A bare front wheel (offline): once a corner's wing has been torn off, a hit there does EXPOSED_WHEEL.tyre times as much to
 * the tyre and `rim` times as much to the wheel, and nothing is left to rub on the tyre. */
export const EXPOSED_WHEEL={tyre:1.8,rim:1.4} as const;
export const exposedDamage=(before:number,after:number,factor:number)=>![before,after,factor].every(Number.isFinite)||after<=before?after:Math.min(1,before+(after-before)*factor);
/** Bumpers soak up a hit (offline): once a bumper has been torn off, a hit on that end crumples it BUMPER_GONE.crush times as
 * fast, and at the engine end does `engine` times the engine damage, so radiator, fuel and exhaust trouble comes sooner. */
export const BUMPER_GONE={crush:1.35,engine:1.25} as const;
/** Doors and engine covers do their share too (offline): with a door gone that side crumples COVER_GONE.side times as fast;
 * with the bonnet (or a rear engine's lid) gone the engine takes `engine` times the damage, on top of a missing bumper. */
export const COVER_GONE={side:1.3,engine:1.2} as const;
/** Engine out (offline): with the engine mounts already broken and the engine past ENGINE_DROP.engine damage, a hit of
 * `damage` or more at the engine end tears the block loose and it drops out of the car: the car is finished on the spot. */
export const ENGINE_DROP={damage:22,engine:.5} as const;
export const engineDrops=(mountsBroken:boolean,engineDamage:number|undefined,damage:number,atEngineEnd:boolean)=>mountsBroken&&atEngineEnd&&(engineDamage??0)>=ENGINE_DROP.engine&&Number.isFinite(damage)&&damage>=ENGINE_DROP.damage;
/** Sliding on its roof (offline): above ROOF_SLIDE.speed an upside-down car throws sparks and scrapes off its roof line, gouges
 * the ground, and crushes its roof by up to `crush` per second at `full` speed. */
export const ROOF_SLIDE={speed:3,full:15,crush:.05,gap:.05} as const;
/** On its side: a car tilted so its up axis is within SIDE_SLIDE.up of level slides on a door, and crushes that side the same way. */
export const SIDE_SLIDE={up:.4} as const;
export const roofSlide=(slideSpeed:number)=>Number.isFinite(slideSpeed)&&slideSpeed>ROOF_SLIDE.speed?Math.min(1,slideSpeed/ROOF_SLIDE.full):0;
/** A roll shakes things off (offline): the moment a car has been upside down for ROLL_SHED.at seconds, every hinged part already
 * hanging loose past `loose` (doors, bonnet, boot, bumpers, mirrors) is torn away. Once per roll. */
export const ROLL_SHED={at:.3,loose:.4} as const;
