import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {prepareNativeActorRouteMotion} from './native-actor-route-motion.js';
import {prepareNativeActorDistanceAudio} from './native-actor-distance-audio.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid special course actor ${name}`);return v;}
function number(w){b.setUint32(0,w);const v=b.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite special course actor input');return v;}
/** Complete A93C8(course5) and AB890(course8), with mandatory route/action and
 * audio expansion. Course5 sound continues while actor motion is held. */
export function prepareNativeSpecialCourseActorMotion(input){
 const source=input?.actorWordsF060;
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!word(w)))throw new RangeError('Supply complete special course actor pool');
 let pool=[...source],audioScene7c9c=input.audioScene7c9c;
 const operations=[],base=integer(input.actorIndex,0,29,'index')*0xbc;
 const get=o=>number(pool[o/4]),rg=o=>get(base+o),ri=o=>pool[(base+o)/4]|0;
 function put(o,v){pool[o/4]=v>>>0;operations.push(Object.freeze({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0}));}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite special course actor result');b.setFloat32(0,v);put(o,b.getUint32(0));}
 const rw=(o,v)=>put(base+o,v);
 function route(arrivalRadiusNative){const q=prepareNativeActorRouteMotion({...input,actorWordsF060:pool,arrivalRadiusNative});pool=[...q.actorWordsF060];operations.push(...q.operations);}
 const activity=()=>integer(input.activity624,-32768,32767,'activity');
 if(input.entry==='800a93c8'){
  const dx=F(rg(0xc)-get(scratch(0x6bc))),dz=F(rg(0x14)-get(scratch(0x6c4)));
  const distance=F(F(Math.sqrt(F(F(dx*dx)+F(dz*dz))))/40);
  sf(scratch(0x758),0);sf(scratch(0x754),distance);
  const q=prepareNativeActorDistanceAudio({audioScene7c9c,distanceNative:distance,pitchInput:0,audioContext:input.audioContext});audioScene7c9c=q.audioScene7c9c;operations.push(...q.operations);
  if(activity()===-1&&ri(8)===1)route(400);
 }else if(input.entry==='800ab890'){
  if(integer(input.state650,-2147483648,2147483647,'main phase')===3&&activity()===-1){
   if(ri(8)===2)rw(0x78,(ri(0x78)+1)|0);
   else if(ri(8)===1){const frame=(ri(0x78)+1)|0;rw(0x74,1);rw(0x78,frame);route(200);}
  }
 }else throw new RangeError('Unknown special course actor entry');
 return Object.freeze({actorWordsF060:Object.freeze(pool),audioScene7c9c,operations:Object.freeze(operations)});
}
