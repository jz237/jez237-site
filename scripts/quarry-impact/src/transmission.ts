/** Optional manual controls. Absent means the established automatic assist. */
export type TransmissionMode='automatic'|'manual'|'clutch';
export type TransmissionInput={mode:'manual'|'clutch';up:boolean;down:boolean;clutch:number};
export type TransmissionState={mode:'manual'|'clutch';up:boolean;down:boolean;delay:number;pending:number|null;notice:number;grind?:number};
export const transmissionGearLabel=(gear:number)=>gear===0?'R':gear===-1?'N':String(gear);
const gears=[0,-1,1,2,3,4,5];
const ratios=[1,.67,.49,.38,.31];
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function validTransmissionInput(value:unknown):value is TransmissionInput{
 const v=value as TransmissionInput;return !!v&&(v.mode==='manual'||v.mode==='clutch')&&typeof v.up==='boolean'&&typeof v.down==='boolean'&&typeof v.clutch==='number'&&Number.isFinite(v.clutch)&&v.clutch>=0&&v.clutch<=1;
}
export function validTransmissionState(value:unknown):value is TransmissionState{
 const v=value as TransmissionState;return !!v&&(v.mode==='manual'||v.mode==='clutch')&&typeof v.up==='boolean'&&typeof v.down==='boolean'&&typeof v.delay==='number'&&Number.isFinite(v.delay)&&v.delay>=0&&v.delay<=.25&&typeof v.notice==='number'&&Number.isFinite(v.notice)&&v.notice>=0&&v.notice<=1&&(v.pending===null||gears.includes(v.pending))&&(v.grind===undefined||typeof v.grind==='number'&&Number.isFinite(v.grind)&&v.grind>=0&&v.grind<=.45);
}
export type TransmissionVehicle={gear:number;rpm:number;speed:number;transmission?:TransmissionState;input:{throttle:number;transmission?:TransmissionInput}};
export const automaticGear=(speed:number,step:number)=>speed<-.5?0:clamp(1+Math.floor(Math.max(0,speed)/step),1,5);
/** Directional drive, shift interruption, clutch coupling and gear-dependent
 * operating range. The automatic assist retains established event calibration.
 * Manual torque is relative to that assist's selected ratio at the same speed. */
export function stepTransmission(car:TransmissionVehicle,spec:{gearStep:number;speedLimit:number},dt:number,running:boolean):number{
 const input=car.input.transmission,speed=Math.abs(car.speed),automatic=automaticGear(car.speed,spec.gearStep);
 if(!input){delete car.transmission;car.gear=automatic;return car.input.throttle;}
 if(!car.transmission||car.transmission.mode!==input.mode){
  car.transmission={mode:input.mode,up:false,down:false,delay:0,pending:null,notice:0};
  car.gear=automatic;
 }
 const t=car.transmission;t.notice=Math.max(0,t.notice-dt);if(t.grind!==undefined)t.grind=Math.max(0,t.grind-dt);
 const up=input.up&&!t.up,down=input.down&&!t.down;t.up=input.up;t.down=input.down;
 if(input.up!==input.down&&(up||down)&&t.pending===null){
  const next=gears[clamp(gears.indexOf(car.gear)+(up?1:-1),0,gears.length-1)];
  // Prevent reverse/forward selection against substantial road motion.
  if((next===0&&car.speed>1.5)||(next>0&&car.speed<-1.5))t.notice=1;
  else if(next!==car.gear){t.pending=next;t.delay=.2;}
 }
 if(t.pending!==null){
  t.delay=Math.max(0,t.delay-dt);
  if(t.delay===0){
   // Clutch need only be down when the new gear engages, not when requested.
   if(input.mode!=='clutch'||input.clutch>=.6||t.pending===-1)car.gear=t.pending;
   else{t.notice=1;t.grind=.45;}
   t.pending=null;
  }
 }
 if(!running)return 0;
 const clutch=input.mode==='clutch'?input.clutch:0;
 const freeRpm=850+clamp(car.input.throttle,0,1)*5350;
 const gear=Math.max(1,car.gear),ceiling=car.gear===0?spec.gearStep*1.05:gear===5?spec.speedLimit+2:spec.gearStep*(gear+.05);
 const wheelRpm=850+speed/ceiling*5350;
 const target=car.gear===-1?freeRpm:Math.max(850,wheelRpm*(1-clutch)+freeRpm*clutch);
 car.rpm+=(clamp(target,850,10000)-car.rpm)*(1-Math.exp(-12*dt));
 if(car.gear===-1||t.pending!==null||(t.grind??0)>.15)return 0;
 const direction=car.gear===0?-1:1;
 if(car.speed*direction<-1.5)return 0;
 const reference=clamp(Math.floor(speed/spec.gearStep),0,4),ratio=car.gear===0?.6:clamp(ratios[gear-1]/ratios[reference],.2,1.2);
 const lug=gear===1||car.gear===0?1:clamp(.25+speed/(spec.gearStep*(gear-1))*.75,.25,1);
 const limiter=clamp((ceiling-speed)/Math.max(.6,spec.gearStep*.12),0,1);
 return direction*clamp(car.input.throttle,0,1)*ratio*lug*limiter*(1-clutch);
}

/** Closed-throttle engine resistance acts at driven tyre contacts only. Neutral,
 * an open clutch and an in-progress shift disconnect it. Excess road-driven
 * revs add resistance even at full throttle, where the drive limiter is off. */
export function manualEngineBrake(car:TransmissionVehicle,spec:{gearStep:number;speedLimit:number}){
 const input=car.input.transmission,t=car.transmission;
 if(!input||!t||car.gear===-1||t.pending!==null||Math.abs(car.speed)<.5)return 0;
 const coupling=input.mode==='clutch'?1-input.clutch:1;
 const ceiling=car.gear===0?spec.gearStep*1.05:car.gear===5?spec.speedLimit+2:spec.gearStep*(car.gear+.05);
 const revs=850+Math.abs(car.speed)/ceiling*5350,over=clamp((revs-6500)/2500,0,1);
 if(car.input.throttle>0&&over===0)return 0;
 return coupling*(3+Math.min(revs,10000)*.0012+over*10);
}
export function transmissionNotice(car:TransmissionVehicle){
 if(!car.input.transmission)return '';
 if(car.rpm>6600&&car.gear!==-1)return ' · OVER-REV · CLUTCH OR UPSHIFT';
 if((car.transmission?.grind??0)>0)return ' · CLUTCH REQUIRED · SHIFT NOT ENGAGED';
 if(car.transmission?.notice)return ' · SHIFT NOT ENGAGED';
 return car.transmission?.pending!==undefined&&car.transmission.pending!==null?' · SHIFTING':'';
}
/** Short, deterministic tooth chatter for a rejected manual-clutch shift. */
export function gearboxGrindSamples(sampleRate:number){
 const samples=new Float32Array(Math.round(sampleRate*.45));let seed=731;
 for(let i=0;i<samples.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const t=i/sampleRate,teeth=.3+.7*Math.max(0,Math.sin(t*2*Math.PI*47));samples[i]=(.48*(seed/4294967296*2-1)+.25*Math.sin(t*2*Math.PI*740))*teeth;}
 return samples;
}
