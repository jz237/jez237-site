// Source783AC entry through78630: event retirement, delayed bonus, clocks,
// timeout coasting and displayed power. Move/checkpoint adjudication follows.
import {prepareNativeRaceRetirement} from './native-race-boundary-warning.js';
const F=Math.fround,BASE=0x1f94,WORDS=1693;
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Called once per reached783AC racer, after physical movement. Raw race words
 * are the only retained record/timer owner. Ordered stuntAwardEnqueue recipes
 * must execute at their position, before later retirement writes. b90 is the
 * actual native speed scalar; the source multiplies it by float32(1.8).
 * earlyReturn skips BOTH later move and checkpoint branches. Finished/DQ or
 * stopped-clock states still approach displayed power unless an early return
 * was taken. This helper does not decide enclosing mode/activity admission. */
export function prepareNativeStuntPrelude({raceWords1f94,globals},input={}){
 if(!Array.isArray(raceWords1f94)||raceWords1f94.length!==WORDS)throw new RangeError('Supply canonical raceWords1f94');
 const race=raceWords1f94.map(v=>integer(v,'race word',0,0xffffffff)),operations=[];
 const g=Object.fromEntries(['courseIndex','primaryHumanIndex','secondaryHumanIndex','players','event628','main638','mode620','clockStopped817c','ambientD4b00']
  .map(k=>[k,integer(globals?.[k],k)]));
 integer(g.event628,'event628',-32768,32767);integer(g.players,'players',1,2);
 const slot=integer(input.racerIndex,'racerIndex',0,3),base=0x2938+slot*0x378;
 const read=a=>race[(a-BASE)/4]|0;
 function write(a,value){const wordIndex=(a-BASE)/4;race[wordIndex]=value>>>0;operations.push({kind:'raceWordWrite',wordIndex,value:value>>>0});}
 const diagnostic={earlyReturn:false,reason:null,retirement:null,clockAdvanced:false};
 function retire(reason){
  const result=prepareNativeRaceRetirement(race,{racerIndex:slot,main638:g.main638,mode620:g.mode620});
  for(const op of result.operations){
   if(op.kind==='recordWordWrite')race[(0x2938-BASE)/4+op.racerIndex*222+op.wordIndex]=op.value;
   else if(op.kind==='raceWordWrite')race[op.wordIndex]=op.value;
   else throw new RangeError('Unexpected retirement operation');
   operations.push(op);
  }
  diagnostic.retirement=result.diagnostic;diagnostic.earlyReturn=true;diagnostic.reason=reason;
 }
 write(base+0x314,0);
 if(g.courseIndex===9&&slot===g.secondaryHumanIndex)write(base+0x350,0x801b2f20);
 if(g.event628===1&&slot===g.primaryHumanIndex||g.players===2&&g.event628===2&&slot===g.secondaryHumanIndex){
  if(read(base+0x2ec)===0)retire('event');
  else{diagnostic.earlyReturn=true;diagnostic.reason='event';}
  return freeze({operations,diagnostic});
 }
 const delay=read(0x39d0);
 if(delay>0){
  write(0x39d0,delay-1);
  if(delay===1){operations.push({kind:'stuntAwardEnqueue',award:{kind:'trick',points:read(0x39cc),finish:true}});write(0x39cc,0);}
 }
 if(read(base+0x2f4)===0&&read(base+0x2ec)===0&&g.clockStopped817c===0&&read(0x1fd4)===0){
  diagnostic.clockAdvanced=true;
  for(const offset of [0x168,0x19c]){const value=(read(base+offset)+50)|0;write(base+offset,value);if(value>=299999)write(base+offset,299999);}
  write(base+0x16c,g.ambientD4b00&65535);
  let remaining=(read(base+0x2c4)-50)|0;write(base+0x2c4,remaining);
  if(remaining<=0){remaining=0;write(base+0x2c4,0);}
  if(remaining===0){
   const expired=(read(base+0x334)+1)|0;write(base+0x334,expired);
   if(!Number.isFinite(input.speedB90Native)||!Number.isFinite(F(input.speedB90Native)))throw new TypeError('Supply finite native speedB90Native for timeout');
   if(F(F(input.speedB90Native)*F(1.8))<10||expired>=201){retire('timeout');return freeze({operations,diagnostic});}
  }else write(base+0x334,0);
 }
 const power=read(base+0x12c),display=read(base+0x138);
 if(power!==display){const difference=(power-display)|0;write(base+0x138,(display+(difference>0?1:difference<0?-1:0))|0);}
 return freeze({operations,diagnostic});
}
