import {NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
import {prepareNativeTransientDisplay} from './native-transient-display.js';
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
const u64=(hi,lo)=>(BigInt(hi)<<32n)|BigInt(lo),mask=(1n<<64n)-1n,high=v=>Number(v>>32n),low=v=>Number(v&0xffffffffn);

/** Complete B305C display preparation, including AF798. Original command
 * groups are semantic render requests, with exact texture/vertex/primitive
 * order. Commands occupy the retained scene-buffer prefix; matrices use its
 * independent shared allocator. No guest commands execute in the browser.
 */
export function prepareNativePresentationEffectsDisplay(input){
 const effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),effectControlWords6d60=words(input.effectControlWords6d60,22,'effectControlWords6d60'),operations=[];
 const read=a=>effectWords0790[(a-0x790)/4],count=integer(read(0x790)|0,'effect count',-2147483648,4),bufferIndex=integer(input.bufferIndex,'scene buffer',0,1),
  view=integer(input.fieldAb2c,'effect display view',0,1),players=integer(input.players,'players',1,2),main=integer(input.main638,'scene',-2147483648,2147483647),
  primary=integer(input.primaryHumanIndex,'primary human',0,3),frame=integer(input.frameCounter,'effect frame',-2147483648,2147483647),
  start=words(input.clockStartWords,2,'clockStartWords'),end=words(input.clockEndWords,2,'clockEndWords'),base=0x80198368+bufferIndex*0xb2f0,
  pointer=integer(input.graphicsPointerE94c,'effect display cursor',-2147483648,0xffffffff)>>>0,offset=integer(pointer-base,'effect display cursor offset',0,0x4140-8),skipOwn=players===2&&main===1;
 if(offset%8)throw new RangeError('Unaligned effect display cursor');let commandBytes=0,draws=0;
 const emit=(op,bytes=0)=>{operations.push(op);commandBytes+=bytes;if(offset+commandBytes>0x4140)throw new RangeError('Effect command prefix capacity exceeded');};
 const put=(a,v)=>{const value=v>>>0;effectWords0790[(a-0x790)/4]=value;emit({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});};
 const control=(a,v)=>{const value=v>>>0;effectControlWords6d60[(a-0x6d60)/4]=value;emit({kind:'presentationEffectControlWrite',byteOffset:a-0x6d60,width:4,value});};
 const palette=[0x6d84,0x6d88,0x6d8c].map(a=>effectControlWords6d60[(a-0x6d60)/4]&255).concat(255);
 const color=(entry,sync=true)=>emit({kind:'presentationEffectColor',rgba:entry!==null&&read(entry+0x1c58)!==0?[235,227,209,255]:[...palette]},sync?16:8);
 const texture=(family,textureFrame)=>emit({kind:'presentationEffectTexture',family,textureFrame},56);
 const vertices=(byteOffset,vertexCount)=>{integer(byteOffset,'effect vertex offset',0,0xb2f0-vertexCount*16);emit({kind:'presentationEffectVertices',bufferIndex,byteOffset,vertexCount},8);};
 const primitive=indices=>{emit({kind:'presentationEffectPrimitive',indices},8);draws++;};
 put(0x7b38,start[0]);put(0x7b3c,start[1]);emit({kind:'presentationEffectListBegin',bufferIndex,byteOffset:offset});emit({kind:'presentationEffectPipeline',mode:'surface'},32);
 for(let slot=0;slot<count;slot++){
  if(skipOwn&&slot===view)continue;const entry=0x798+slot*0x1c74;
  control(0x6d60,0x801d0000+entry);control(0x6d68,0x801d0000+entry);color(entry);
  for(let animation=0;animation<4;animation++){
   texture('spray',animation);let compact=0;
   for(let i=63;i>=0;i--){const row=entry+i*64;if(read(row+0x38)===0)continue;
    control(0x6d64,0x801d0000+row);
    if(((read(row+0x3c)+i)&3)===animation){vertices(0x51c0+(slot+view*2)*0xc00+compact*16,3);primitive([0,1,2]);}
    compact+=3;
   }
  }
 }
 for(let slot=0;slot<count;slot++){
  const entry=0x798+slot*0x1c74;control(0x6d60,0x801d0000+entry);control(0x6d78,0x801d0000+entry+0x1a00);color(entry);let compact=0;
  for(let i=0;i<4;i++){const row=entry+0x1a00+i*40;if(read(row+0x20)===0)continue;
   const age=read(row+0x24);texture('splash',age>=1&&age<=7?age-1:6);vertices(0x8dc0+(slot+view*2)*256+compact*16,4);primitive([3,0,1,2]);compact+=4;
  }
 }
 color(null);texture('wake',frame&3);
 for(let slot=0;slot<count;slot++){
  if(skipOwn&&slot===view)continue;vertices(0x91c0+slot*256,16);
  for(let i=0;i<7;i++)primitive([i*2+1,i*2,i*2+2,i*2+3]);
 }
 emit({kind:'presentationEffectPipeline',mode:'droplet'},16);texture('droplet',0);
 for(let slot=0;slot<count;slot++)if(slot===primary){
  const entry=0x798+slot*0x1c74;control(0x6d60,0x801d0000+entry);color(entry,false);
  const shared=integer(read(entry+0x1c24)|0,'prepared shared triangle count',0,64),groups=Math.trunc(shared/5),remainder=shared%5;
  for(let batch=0;batch<groups;batch++){vertices(0x81c0+batch*240,15);for(let i=0;i<5;i++)primitive([i*3,i*3+1,i*3+2]);}
  if(remainder){vertices(0x81c0+groups*240,remainder*3);for(let i=0;i<remainder;i++)primitive([i*3,i*3+1,i*3+2]);}
 }
 const transient=prepareNativeTransientDisplay({...input,effectWords0790,effectControlWords6d60,bufferIndex});
 for(const op of transient.operations)emit(op);commandBytes+=transient.diagnostic.nativeCommandBytes;
 emit({kind:'presentationEffectListEnd'},8);const graphicsPointerE94c=pointer+commandBytes;
 emit({kind:'sourceWordWrite',field:'graphicsPointerE94c',value:graphicsPointerE94c});
 const clockOffsets=[0,operations.length],delta=(u64(...end)-u64(...start))&mask,total=(u64(read(0x7b48),read(0x7b4c))+delta)&mask,counter=(u64(read(0x7b50),read(0x7b54))+1n)&mask;
 put(0x7b3c,low(delta));put(0x7b38,high(delta));put(0x7b4c,low(total));put(0x7b48,high(total));put(0x7b50,high(counter));put(0x7b54,low(counter));
 if(delta>u64(read(0x7b40),read(0x7b44))){put(0x7b40,high(delta));put(0x7b44,low(delta));}
 const combined=(u64(read(0x7b18),read(0x7b1c))+delta)&mask;
 if(combined>u64(read(0x7b58),read(0x7b5c))){put(0x7b58,high(combined));put(0x7b5c,low(combined));}
 const primaryTriangles=read(0x798+primary*0x1c74+0x1c20)|0;if((read(0x7b60)|0)<primaryTriangles)put(0x7b60,primaryTriangles);
 const used=(graphicsPointerE94c-base)>>3;put(0x7b64,used);if((read(0x7b68)|0)<used)put(0x7b68,used);
 return freeze({effectWords0790,effectControlWords6d60,matrixCountE950:transient.matrixCountE950,graphicsPointerE94c,operations,
  diagnostic:{clockOffsets,nativeCommandBytes:commandBytes,draws,transientDraws:transient.diagnostic.drawn,graphicsExecuted:false}});
}
