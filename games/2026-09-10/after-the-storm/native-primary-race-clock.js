// The clock block of7687C, before primary judging. Inputs are actual retained
// source words. This does not own a wall-time epoch, render delta or timer.
function integer(v,name){if(!Number.isInteger(v)||v< -2147483648||v>2147483647)throw new RangeError(`Invalid source clock ${name}`);return v;}
export function prepareNativePrimaryRaceClock(value){
 if(!value||typeof value!=='object')throw new TypeError('Supply actual source clock words');
 const s=Object.fromEntries(['main638','finished2c2c','record2c24','clockStopped817c','flag1fd4','courseIndex',
  'lapMs','totalMs','ambientWord','ambientD4b00'].map(k=>[k,integer(value[k],k)]));
 const advanced=s.main638===1&&s.finished2c2c===0&&s.record2c24===0&&s.clockStopped817c===0&&s.flag1fd4===0;
 let totalLimit=false;
 if(advanced){
  s.lapMs=(s.lapMs+50)|0;if(s.lapMs>599998)s.lapMs=599999;
  s.totalMs=(s.totalMs+50)|0;
  if(s.totalMs>599998){s.totalMs=599999;totalLimit=s.courseIndex!==0;}
  // A nonzero-course time-limit return precedes this source ambient store.
  if(!totalLimit)s.ambientWord=s.ambientD4b00&65535;
 }
 return Object.freeze({advanced,totalLimit,lapMs:s.lapMs,totalMs:s.totalMs,ambientWord:s.ambientWord});
}
