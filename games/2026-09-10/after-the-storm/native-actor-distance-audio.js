import {prepareNativeIceActorAudio} from './native-ice-actor-audio.js';
const F=Math.fround,bits=new DataView(new ArrayBuffer(4));
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid actor distance audio ${name}`);return v;}
function scalar(v,name){if(typeof v!=='number'||!Number.isFinite(F(v)))throw new RangeError(`Supply finite actor audio ${name}`);return F(v);}
/** Complete C1BD8. The two halfwords at7DEC and rival gate at7DE8 belong to
 * the actual audio owner, independently of physical course or camera state. */
export function prepareNativeActorDistanceAudio(input={}){
 const latch=integer(input.audioScene7c9c,'scene latch',-2147483648,2147483647);
 if(latch===0)return prepareNativeIceActorAudio({entry:'800c1b98',audioScene7c9c:0});
 const operations=[],emit=(consumer,port,value)=>operations.push(Object.freeze({kind:'externalCall',consumer,arguments:Object.freeze([port,value>>>0])}));
 const gain=v=>{bits.setFloat32(0,v);emit('800c538c',0x01000700,bits.getUint32(0));};
 const d=scalar(input.distanceNative,'distance'),context=input.audioContext;
 const raceMode=integer(context?.raceMode,'race mode',-2147483648,2147483647);
 let volume=d>=256?0:d<=48?1:F(F(256-d)/208);
 if(raceMode!==1){
  if(integer(context?.rivalGate7de8,'rival gate',0,65535)!==0)volume=F(volume*F(.3));
  gain(volume); // The original sends this gain twice outside raceMode1.
 }else{
  const flags=context?.flags7dec;if(!Array.isArray(flags)||flags.length!==2)throw new RangeError('Supply actor audio flags7dec');
  const combined=integer(flags[0],'first halfword',0,65535)+2*integer(flags[1],'second halfword',0,65535);
  let pan=64;
  if(combined===1||combined===2){volume=F(volume*F(.8));pan=combined===1?32:96;}
  else if(combined===3)volume=F(volume*F(.3));
  emit('800c53d4',0x03000700,pan);
 }
 gain(volume);emit('800c538c',0x04000700,scalar(input.pitchInput,'pitch input')>0?0x3f800000:0x3f75c28f);
 operations.push(Object.freeze({kind:'sourceWordWrite',field:'audioScene7c9c',value:5}));
 return Object.freeze({audioScene7c9c:5,operations:Object.freeze(operations)});
}

/** Complete BF784 splash cue: signed low byte of the original pan argument,
 * strict128-unit audibility cutoff, and no shared-latch or RNG writes. */
export function prepareNativeActorSplashAudio(input={}){
 const operations=[],result=()=>Object.freeze({operations:Object.freeze(operations)});
 if(integer(input.audioMode,'mode byte',0,255)!==7)return result();
 const d=scalar(input.distanceNative,'distance');if(d>=128)return result();
 const pan=integer(input.panWord,'pan word',0,0xffffffff)<<24>>24;
 bits.setFloat32(0,d<=12?1:F(F(128-d)/116));
 for(const [consumer,port,value]of [['800c538c',0x01000700,bits.getUint32(0)],['800c53d4',0x06000701,127],['800c53d4',0x06000702,pan],['800c53d4',0x06000700,21]])
  operations.push(Object.freeze({kind:'externalCall',consumer,arguments:Object.freeze([port,value>>>0])}));
 return result();
}
