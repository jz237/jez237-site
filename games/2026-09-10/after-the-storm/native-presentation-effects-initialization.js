import {prepareNativePresentationEffectInputs,NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
const b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);};

/** Complete AE7C4 startup, including Math_srand and every AE210 input stage.
 * clockLow32 is the supplied low word of osGetTime, NOT shared gameplay RNG.
 * Vertex writes remain ordered renderer effects into the two B2F0-byte buffers.
 * Retained effect/control words and untouched vertex bytes must survive.
 */
export function prepareNativePresentationEffectsInitialization(input){
 let effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790');
 const effectControlWords6d60=words(input.effectControlWords6d60,22,'effectControlWords6d60'),operations=[],queries=[],queryOffsets=[];
 const course=integer(input.courseIndex,'effect course',0,11),racerCount=integer(input.racerCount,'physical racer count',1,4),clock=integer(input.clockLow32,'source clock low word',0,0xffffffff),seed6f00=clock&65535;
 const index=a=>(a-0x790)/4,read=a=>effectWords0790[index(a)];
 function put(a,value){value=integer(value,'effect word',0,0xffffffff);effectWords0790[index(a)]=value;operations.push({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});}
 function control(a,value){effectControlWords6d60[(a-0x6d60)/4]=value>>>0;operations.push({kind:'presentationEffectControlWrite',byteOffset:a-0x6d60,width:4,value:value>>>0});}
 if(effectControlWords6d60[21]!==0)control(0x6db4,0);
 put(0x790,racerCount);operations.push({kind:'sourceHalfwordWrite',field:'seed6f00',value:seed6f00});
 for(const a of [0x7b2c,0x7b34,0x7b28,0x7b30,0x7b20,0x7b24,0x7b4c,0x7b54,0x7b48,0x7b50,0x7b40,0x7b44,0x7b58,0x7b5c,0x7b60,0x7b68,0x7a04,0x7a08])put(a,0);
 if(course===0){
  put(0x7a08,1);const actors=words(input.actorWordsF060,1484,'actorWordsF060');
  for(let i=0;i<30;i++)if(actors[i*47]===6){put(0x7a04,i);break;}
  if(racerCount<4)put(0x790,racerCount+1);
 }
 for(let i=0;i<3;i++){const offset=0x30+course*3+i;control(0x6d84+i*4,(effectControlWords6d60[offset>>>2]>>>(24-(offset&3)*8))&255);}
 put(0x7a14,Number([0,1,2,6,7].includes(course)));
 const count=read(0x790);
 for(let slot=0;slot<count;slot++){
  const entry=0x798+slot*0x1c74;control(0x6d60,0x801d0000+entry);
  for(let offset=0xfc0;offset>=0;offset-=0x40)put(entry+offset+0x38,0);
  for(let offset=0x9d8;offset>=0;offset-=0x28)put(entry+offset+0x1020,0);
  for(let offset=0x78;offset>=0;offset-=0x28)put(entry+offset+0x1a20,0);
 }
 for(let slot=0;slot<count;slot++){
  const entry=0x798+slot*0x1c74,q=prepareNativePresentationEffectInputs({...input,effectWords0790,racerIndex:slot,racerCount});
  queryOffsets.push(...q.diagnostic.queryOffsets.map(o=>o+operations.length));queries.push(...q.diagnostic.queries);
  effectWords0790=[...q.effectWords0790];operations.push(...q.operations);control(0x6d60,0x801d0000+entry);
  put(entry+0x1c68,0);put(entry+0x1c6c,0);put(entry+0x1c3c,0);
  const wet=Number(number(read(0x79c0))<=number(read(0x7a00)));put(entry+0x1c30,wet);put(entry+0x1c2c,wet);
  for(const o of [0x1c48,0x1c44,0x1c40,0x1c38,0x1c50,0x1c58,0x1c54,0x1c60,0x1c5c])put(entry+o,0);
  control(0x6d7c,0x801d0000+entry+0x1aa0);
  for(let j=0;j<8;j++){
   const row=entry+0x1aa0+j*0x30;put(row+0x24,1);put(row+0x28,0);
   for(let axis=0;axis<3;axis++){put(row+0xc+axis*4,read(0x79bc+axis*4));put(row+axis*4,read(row+0xc+axis*4));}
   for(const o of [0x20,0x1c,0x18])put(row+o,0);
   control(0x6d7c,0x801d0000+row+0x30);
  }
 }
 for(let bufferIndex=0;bufferIndex<2;bufferIndex++){
  const vertex=(byteOffset,width,value)=>operations.push({kind:'presentationEffectVertexWrite',bufferIndex,byteOffset,width,value:value&(width===1?255:65535)});
  const color=(p,alpha=false)=>{vertex(p+6,2,0);for(const o of alpha?[12,13,14,15]:[12,13,14])vertex(p+o,1,255);};
  for(let slot=0;slot<4;slot++){
   for(let i=0;i<192;i++){
    const p=0x51c0+slot*0xc00+i*16,r=i%3;
    vertex(p+8,2,r===0?0x3c0:r===1?-0x13c:0x8bc);vertex(p+10,2,r===0?0x954:0);color(p);
   }
   if(slot===0)for(let i=0;i<192;i++){
    const p=0x81c0+i*16,r=i%3;vertex(p+8,2,r===1?0xfc0:0);vertex(p+10,2,r===2?-0x800:0x7c0);color(p);
   }
   for(let i=0;i<16;i++){
    const p=0x8dc0+slot*0x100+i*16,r=i%4;vertex(p+8,2,r===1||r===2?0x7c0:0);vertex(p+10,2,r<2?0x7c0:0);color(p,true);
   }
   for(let i=0;i<16;i++){
    const p=0x91c0+slot*0x100+i*16;vertex(p+8,2,i%2===0?0x7c0:0);color(p,true);vertex(p+10,2,Math.trunc(Math.trunc(i/2)*63/7)<<6);
   }
  }
 }
 for(let a=0x7a18;a<0x7ad8;a+=0x18)put(a,0);
 for(const a of [0x7adc,0x7ad8,0x7ae8,0x7ae4,0x7ae0])put(a,0);
 for(let a=0x7af0;a<0x7b10;a+=0x10)for(const offset of [0,12,8,4])put(a+offset,0);
 put(0x7b10,0);
 return freeze({effectWords0790,effectControlWords6d60,seed6f00,operations,diagnostic:{effectCount:count,queries,queryOffsets,graphicsExecuted:false}});
}
