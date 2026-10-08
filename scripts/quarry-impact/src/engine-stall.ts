import {clamp} from './rules';

/** Seconds of starter engagement still required; undefined is legacy state.
 * Impact severity is the actual post-armor structural damage, never a scrape. */
export const MAX_ENGINE_RESTART=2.8;
export function stalledByImpact(current:number|undefined,health:number,engineDamage:number|undefined,damage:number):number|undefined{
  if(current===undefined)return undefined;
  if(!(health>0))return 0;
  if(current>0)return current; // Sustained contact cannot keep extending a stall.
  const condition=clamp(engineDamage??0,0,1);
  if(!Number.isFinite(damage)||damage<28-18*condition)return 0;
  return 1+1.8*condition;
}
export function validEngineStall(value:unknown):value is number|undefined{
  return value===undefined||typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=MAX_ENGINE_RESTART+.000001;
}
export function crankRequested(health:number,stall:number|undefined,throttle:number){return health>0&&(stall??0)>0&&Math.abs(throttle)>.2;}
/** Called only by simulation steps. Pause, replay and stopped results never
 * consume restart time. Releasing the pedal stops the starter until pressed. */
export function advanceEngineRestart(state:{health:number;engineStall?:number;input:{throttle:number}},dt:number){
  if(!(state.health>0)){if(state.engineStall!==undefined)state.engineStall=0;return false;}
  if(!(state.engineStall!>0))return true;
  if(Number.isFinite(dt)&&dt>0&&crankRequested(state.health,state.engineStall,state.input.throttle))state.engineStall=Math.max(0,state.engineStall!-dt);
  return state.engineStall===0;
}
export const starterRPM=(health:number,stall:number|undefined,throttle:number)=>crankRequested(health,stall,throttle)?220+40*Math.sin(stall!*40):0;
export const stallHint=(health:number,stall:number|undefined,throttle:number)=>health>0&&(stall??0)>0?crankRequested(health,stall,throttle)?'RESTARTING ENGINE…':'ENGINE STALLED · HOLD THROTTLE':'';

/** Deterministic loopable electric starter with compression pulses. No new
 * remote clip or audio context is needed; use the existing positional bus. */
export function starterSamples(sampleRate:number){
  const samples=new Float32Array(Math.round(sampleRate*.5));
  for(let i=0;i<samples.length;i++){const t=i/sampleRate,pulse=.35+.65*(.5+.5*Math.sin(2*Math.PI*12*t));samples[i]=.4*pulse*(Math.sin(2*Math.PI*96*t)+.28*Math.sin(2*Math.PI*288*t)+.12*Math.sin(2*Math.PI*1344*t));}
  return samples;
}
