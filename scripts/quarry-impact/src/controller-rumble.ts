import type {Pad} from './driving-controls';
export type RumbleActuator=Pick<GamepadHapticActuator,'playEffect'|'reset'>;
export type RumblePad=Pad&{vibrationActuator?:RumbleActuator};
export type RumbleMotion={speed:number;slip:number;grounded:boolean;surface:string;scraping:number};
const unit=(n:number)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;

/** Short, bounded effects never hold up the game loop. The strongest recent
 * impact wins over road texture; changing screens or controllers cancels it. */
export class ControllerRumble {
 private actuator:RumbleActuator|undefined;
 private identity='';
 private generation=0;
 private failed=false;
 private running=false;
 private nextAt=0;
 private lastAt=0;
 private queued=0;
 private burst=0;
 private burstUntil=0;
 impact(strength:number){if(this.actuator&&!this.failed)this.queued=Math.max(this.queued,unit(strength));}
 private cancel(){
  if(this.running&&this.actuator){try{void Promise.resolve(this.actuator.reset()).catch(()=>{});}catch{}}
  this.running=false;
 }
 stop(){
  this.cancel();this.generation++;this.actuator=undefined;this.identity='';
  this.failed=false;this.nextAt=0;this.queued=this.burst=this.burstUntil=0;
 }
 update(pad:RumblePad|undefined,now:number,strength:number,motion:RumbleMotion|null){
  const actuator=pad?.vibrationActuator;
  if(!motion||!pad?.connected||!actuator||typeof actuator.playEffect!=='function'||typeof actuator.reset!=='function'||!unit(strength)||!Number.isFinite(now)){this.stop();return;}
  const identity=JSON.stringify([pad.index,pad.id]);
  if(identity!==this.identity||now<this.lastAt){this.stop();this.identity=identity;this.actuator=actuator;}
  this.lastAt=now;
  if(this.failed)return;
  if(this.queued){this.burst=Math.max(this.queued,this.burst*unit((this.burstUntil-now)/180));this.burstUntil=now+180;this.queued=0;}
  if(now<this.nextAt)return;
  const speed=Number.isFinite(motion.speed)?Math.abs(motion.speed):0;
  const rolling=motion.grounded&&speed>1;
  const road=rolling&&motion.surface==='gravel'?Math.min(.16,speed*.004):0;
  const slip=rolling?unit((motion.slip-1.5)/8)*.35:0;
  const scrape=rolling?unit(motion.scraping)*.3:0;
  const impact=this.burst*unit((this.burstUntil-now)/180);
  const strong=unit(strength)*Math.max(impact,road*.45,scrape),weak=unit(strength)*Math.max(impact*.65,road,slip);
  if(Math.max(strong,weak)<.015){this.cancel();return;}
  this.nextAt=now+60;this.running=true;
  const generation=this.generation;
  const fail=()=>{if(generation===this.generation){this.failed=true;this.cancel();}};
  try{void Promise.resolve(this.actuator!.playEffect('dual-rumble',{duration:100,startDelay:0,strongMagnitude:strong,weakMagnitude:weak})).catch(fail);}catch{fail();}
 }
}
