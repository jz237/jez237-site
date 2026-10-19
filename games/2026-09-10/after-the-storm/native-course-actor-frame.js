import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
const F=Math.fround,bits=new DataView(new ArrayBuffer(4)),off=a=>a+0x10000-0xf060;
const number=w=>{bits.setUint32(0,w);return bits.getFloat32(0);};
const word=n=>Number.isInteger(n)&&n>=0&&n<=0xffffffff;
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function words(a,n,name){if(!Array.isArray(a)||a.length!==n||Array.from(a).some(w=>!word(w)))throw new RangeError(`Supply ${name}[${n}]`);return [...a];}
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid ${name}`);return v;}

/** AD418 outer frame, including all three9D4A8 calls. Each course motion
 * consumer must synchronously return its actual prepared operations. Missing
 * consumers throw; this cannot silently advance a frame with stationary actors.
 * Consumers receive detached, frozen current actor state, and later dispatch
 * reads their committed type changes. No caller state is mutated on failure.
 */
export function prepareNativeCourseActorFrame(input){
 const actorWordsF060=words(input?.actorWordsF060,NATIVE_PRESENTATION_ACTOR_WORDS,'actorWordsF060'),
  actorControlWords62c4=words(input.actorControlWords62c4,3,'actorControlWords62c4'),operations=[],calls=[];
 const players=integer(input.players,1,2,'actor players'),primary=integer(input.primaryHumanIndex,0,3,'primary actor body'),
  secondary=players===2?integer(input.secondaryHumanIndex,0,3,'secondary actor body'):primary;
 const course=integer(input.courseIndex,-2147483648,2147483647,'actor course'),activity=integer(input.activity624,-32768,32767,'actor activity');
 function body(slot){const a=words(input.bodyPoseWordsBySlot?.[slot],6,'actor body pose');if(a.some(w=>!Number.isFinite(number(w))))throw new RangeError('Nonfinite actor body pose');return a;}
 function vertex(i){const a=input.selectedWaterVertexXZ?.[i];if(!Array.isArray(a)||a.length!==2)throw new RangeError('Supply selected actor water vertex');return a.map(v=>integer(v,-32768,32767,'actor water vertex'));}
 const p=body(primary),s=body(secondary),pr=words(input.racerRecordWordsBySlot?.[primary],4,'actor race record'),sr=words(input.racerRecordWordsBySlot?.[secondary],4,'actor race record'),pv=vertex(0),sv=vertex(players===2?1:0);
 function apply(op){
  if(!op||typeof op!=='object'||Array.isArray(op)||typeof op.kind!=='string')throw new TypeError('Invalid course motion operation');
  if(op?.kind==='presentationActorWrite'||op?.kind==='presentationActorControlWrite'){
   const actor=op.kind==='presentationActorWrite',target=actor?actorWordsF060:actorControlWords62c4,width=op.width;
   if(!(actor?[1,2,4]:[4]).includes(width))throw new RangeError('Invalid frame actor write width');
   const offset=integer(op.byteOffset,0,target.length*4-width,'frame actor write offset');if(offset%width)throw new RangeError('Misaligned frame actor write');
   const mask=width===1?255:width===2?65535:0xffffffff,value=integer(op.value,0,mask,'frame actor write value');
   if(width===4)target[offset/4]=value;else{const i=offset>>>2,shift=(4-width-(offset&3))*8;target[i]=((target[i]&~(mask<<shift))|(value<<shift))>>>0;}
  }
  operations.push(structuredClone(op));
 }
 const put=(a,value)=>apply({kind:'presentationActorWrite',byteOffset:off(a),width:4,value:value>>>0});
 const get=a=>number(actorWordsF060[off(a)/4]);
 function sf(a,value){value=F(value);if(!Number.isFinite(value))throw new RangeError('Nonfinite actor frame result');bits.setFloat32(0,value);put(a,bits.getUint32(0));}
 const length=(x,z)=>F(Math.sqrt(F(F(x*x)+F(z*z))));
 apply({kind:'presentationActorControlWrite',byteOffset:0,width:4,value:(actorControlWords62c4[0]+1)>>>0});
 sf(0x778,pv[0]);sf(0x780,pv[1]);p.slice(0,3).forEach((w,i)=>put(0x6bc+i*4,w));
 // The first length uses body5C and the change in positionZ, not body64.
 let divisor=length(number(p[3]),F(number(p[2])-get(0x6ec)));sf(0x754,divisor);
 if(divisor<.01){divisor=F(.01);sf(0x754,divisor);}
 sf(0x6c8,F(number(p[3])/divisor));put(0x6cc,p[4]);sf(0x6d0,F(number(p[5])/divisor));
 const delta=p.slice(0,3).map((w,i)=>F(number(w)-get(0x6e4+i*4)));
 sf(0x6d8,delta[0]);sf(0x6dc,delta[1]);p.slice(0,3).forEach((w,i)=>put(0x6e4+i*4,w));sf(0x6e0,delta[2]);
 const speed=length(delta[0],delta[2]);
 function maximum(at){if(get(at)<speed)sf(at,speed);if(get(at)>70)sf(at,70);}
 sf(0x6d4,speed);maximum(0x724);
 for(const [a,i]of [[0x730,2],[0x738,0],[0x734,1],[0x73c,3]])put(a,pr[i]);
 sf(0x784,sv[0]);sf(0x78c,sv[1]);s.forEach((w,i)=>put(0x6f0+i*4,w));
 for(let i=0;i<3;i++)sf(0x70c+i*4,F(number(s[i])-get(0x718+i*4)));
 s.slice(0,3).forEach((w,i)=>put(0x718+i*4,w));
 // The second speed intentionally rereads the primary body's deltas.
 sf(0x708,speed);maximum(0x728);
 for(const [a,i]of [[0x744,2],[0x74c,0],[0x748,1],[0x750,3]])put(a,sr[i]);
 function call(consumer,actorIndex=null){
  if(typeof input.consumeMotion!=='function')throw new TypeError(`Missing course motion consumer ${consumer}`);
  const call={consumer,actorIndex};calls.push(call);
  const prepared=input.consumeMotion(freeze({...call,actorWordsF060:[...actorWordsF060],actorControlWords62c4:[...actorControlWords62c4]}));
  if(!prepared||!Array.isArray(prepared.operations))throw new TypeError(`Invalid course motion result ${consumer}`);
  for(const op of prepared.operations)apply(op);
 }
 if(course===0)call('800c1268');
 if(course===1||course===3)call('800bf8c8');
 const active=course!==4||activity===-1;
 if(course===4&&active)call('800a5c74');
 if(active)for(let i=0;i<30;i++){
  const base=i*47,type=()=>actorWordsF060[base]|0,submitted=()=>actorWordsF060[base+0xb8/4]!==0;
  if(course===4){
   // Type10 advances even when submitted. Its consumer can change type;
   // the subsequent type1/2 test must observe that fresh value.
   if(type()===10)call('800a5d70',i);
   if([1,2].includes(type())&&!submitted())call('800aaac8',i);
  }else if(!submitted()){
   let target=null;
   if(course===0)target=type()===6?'800a68a4':[7,8,9].includes(type())?'800a5d70':null;
   else if(course===1)target=[3,4].includes(type())?'800a9494':[7,8,9].includes(type())?'800a5d70':null;
   else if(course===2&&type()===6)target='800a9130';
   else if(course===3&&[3,4].includes(type()))target='800a9d48';
   else if(course===5&&type()===12)target='800a93c8';
   else if(course===7)target=type()===3?'800a9494':type()===5?'800ab25c':null;
   else if(course===8&&type()===13)target='800ab890';
   if(target)call(target,i);
  }
 }
 return freeze({actorWordsF060,actorControlWords62c4,operations,calls,diagnostic:{courseIndex:course,motionConsumersExecuted:calls.length,graphicsExecuted:false}});
}
