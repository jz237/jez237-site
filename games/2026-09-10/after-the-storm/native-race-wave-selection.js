// Independent numeric reconstruction of the bounded source wave selector.
// Course tables and the retained shared RNG word are caller-owned source data.
import {stepNativeAIRandom} from './native-ai-initialization.js';

function integer(v,n,min=-2147483648,max=2147483647){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;
}
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function frozen(v){if(v&&typeof v==='object'){Object.values(v).forEach(frozen);Object.freeze(v);}return v;}
function table(v,n){
 if(!Array.isArray(v)||v.length<1||v.length>12)throw new RangeError(`Expected1..12 ${n} signed halfwords`);
 return Array.from(v,(x,i)=>integer(x,`${n}[${i}]`,-32768,32767));
}

/** Actual source kind, not a UI difficulty or modern wave preset. Kind0 uses
 * the pending signed player count60c: exactly1 selects the first course table;
 * every other value selects the other table. Kinds1/2 return10/40. Kind3 alone
 * consumes one shared47E50 word, with an unsigned remainder31, returning10..40.
 *
 * The operations preserve source store order: state600 precedes the optional
 * rngState4640 write. Nonrandom kinds neither require nor return an RNG state.
 * Unrecognized kinds would read an uninitialized source local and are rejected.
 * This does not select the caller's table row/kind or initialize a water field.
 */
export function prepareNativeRaceWaveSelection(input){
 record(input,'wave selection input');
 const kind=integer(input.kind,'kind',0,3),operations=[{kind:'sourceWordWrite',field:'state600',value:kind===0?0:1}];
 let waveValue,rngState4640;
 if(kind===0){
  const one=integer(input.pendingPlayers60c,'pendingPlayers60c',-32768,32767)===1;
  const values=table(one?input.courseWaves1P:input.courseWavesOther,one?'courseWaves1P':'courseWavesOther');
  const course=integer(input.courseIndex,'courseIndex',0,values.length-1);waveValue=values[course];
 }else if(kind===1)waveValue=10;
 else if(kind===2)waveValue=40;
 else{
  const random=stepNativeAIRandom(integer(input.rngState4640,'rngState4640',0,0xffffffff));
  rngState4640=random.rngState;waveValue=random.value%31+10;
  operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rngState4640});
 }
 return frozen({waveValue,operations,...(kind===3?{rngState4640}:{}),rngCalls:kind===3?1:0,
  diagnostic:{kind,scope:'bounded948dc',courseTablesSupplied:kind===0}});
}
