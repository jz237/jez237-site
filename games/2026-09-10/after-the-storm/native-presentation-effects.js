// Retained scene-effects region801D0790..801D7B6C, exclusive. Adjacent to,
// but distinct from, the actor pool and overlay championship menu storage.
import {nativeEffectBodyView} from './native-effect-body-view.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
export const NATIVE_PRESENTATION_EFFECT_WORDS=(0x7b6c-0x790)/4;
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite presentation effect value');return F(v);}
const number=w=>{b.setUint32(0,w);return finite(b.getFloat32(0));},bits=v=>{b.setFloat32(0,finite(v));return b.getUint32(0);};
const length3=(x,y,z)=>F(Math.sqrt(F(F(F(x*x)+F(y*y))+F(z*z))));
const length2=(x,z)=>F(Math.sqrt(F(F(x*x)+F(z*z))));

/** Complete AF51C/AF4A0 transient emission and aging. Its 16-bit FloatRand
 * stream is separate from gameplay RNG. Newly emitted rows age in this call.
 * The parent scene lifecycle owns activity gating and renderer submission.
 */
export function prepareNativeTransientEffects(input){
 const effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),operations=[];
 let seed6f00=integer(input.seed6f00,'effect random seed',0,65535),emitted=0,retired=0;
 const index=a=>(a-0x790)/4,read=a=>effectWords0790[index(a)],f=a=>number(read(a));
 const put=(a,v)=>{const value=v>>>0;effectWords0790[index(a)]=value;operations.push({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});};
 const random=range=>{seed6f00=(seed6f00*5+1)&65535;operations.push({kind:'sourceHalfwordWrite',field:'seed6f00',value:seed6f00});return F(F(seed6f00*F(range))/65536);};
 function emit(x,y,z,scale){
  const slot=integer(read(0x7ad8)|0,'transient effect slot',0,7),row=0x7a18+slot*24;
  put(row,1);put(row+4,0);[x,y,z,scale].forEach((v,i)=>put(row+8+i*4,bits(v)));
  put(0x7ad8,slot+1);put(0x7ad8,(slot+1)%8);emitted++;
 }
 if((read(0x7adc)|0)>0){
  const count=(read(0x7adc)|0)-1;put(0x7adc,count);
  const x=random(32),y=random(4),z=random(32);
  emit(F(x+F(f(0x7ae0)-16)),F(y+F(f(0x7ae4)-2)),F(z+F(f(0x7ae8)-16)),F(F(F(count)*F(.2))+F(1.2)));
 }
 for(const base of [0x7af0,0x7b00])if((read(base)|0)>0){
  put(base,(read(base)|0)-1);const x=random(32),y=random(4),z=random(32),scale=random(2);
  emit(F(x+F(f(base+4)-16)),F(y+F(f(base+8)-2)),F(z+F(f(base+12)-16)),F(scale+2));
 }
 for(let i=0;i<8;i++){
  const row=0x7a18+i*24;if(read(row)===0)continue;
  const age=((read(row+4)|0)+1)|0;put(row+4,age);if(age>=8){put(row,0);retired++;}
 }
 return freeze({effectWords0790,seed6f00,operations,diagnostic:{emitted,retired,graphicsExecuted:false}});
}

/** Complete AE210. Derives retained wake/spray inputs from a physical rider,
 * or the extra Dolphin scene actor. queryNative must be the pure4D30C source
 * plane query, not visible water height. Original query count/order is retained.
 * This prepares numeric scene storage; it neither emits particles nor audio.
 */
export function prepareNativePresentationEffectInputs(input){
 const effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),operations=[],queries=[],queryOffsets=[];
 const slot=integer(input.racerIndex,'effect racer index',0,3),racerCount=integer(input.racerCount,'physical racer count',1,4),entry=0x798+slot*0x1c74;
 const index=a=>(a-0x790)/4,read=a=>effectWords0790[index(a)],f=a=>number(read(a));
 const put=(a,value)=>{value=integer(value,'effect word',0,0xffffffff);effectWords0790[index(a)]=value;operations.push({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});};
 const sf=(a,v)=>put(a,bits(v));
 function query(){
  if(typeof input.queryNative!=='function')throw new TypeError('Supply source plane query for presentation effects');
  const x=f(0x79bc),z=f(0x79c4),heightNative=finite(input.queryNative(x,z,slot));queries.push({racerIndex:slot,x,z,heightNative});queryOffsets.push(operations.length);return heightNative;
 }
 const extra=read(0x7a08)!==0&&slot===racerCount;
 if(extra){
  const actor=integer(read(0x7a04)|0,'extra scene actor',0,29),pool=words(input.actorWordsF060,1484,'actorWordsF060'),base=actor*47;
  const a=o=>number(pool[base+o/4]);
  for(const [to,from]of [[0x79c8,0x24],[0x79cc,0x28],[0x79d0,0x2c],[0x79e0,0x30],[0x79e4,0x34],[0x79e8,0x38]])sf(to,a(from));
  sf(0x79ec,F(-a(0x38)));sf(0x79f0,a(0x34));sf(0x79f4,a(0x30));
  sf(0x79bc,F(a(0x64)+F(96*f(0x79e0))));sf(0x79c0,F(a(0x68)-5));sf(0x79c4,F(a(0x6c)+F(96*f(0x79e8))));
  sf(0x79dc,0);put(0x7a0c,0);sf(0x79fc,0);sf(0x79f8,f(0x79fc));put(entry+0x1c54,0);put(0x7a10,0);
 }else{
  const body=nativeEffectBodyView(input,slot);if(!body)throw new TypeError('Supply actual physical effect body');
  const a=body.float,half=body.half;
  sf(0x79bc,a(0x44));sf(0x79c0,F(a(0x48)-8));sf(0x79c4,a(0x4c));
  for(const [to,from]of [[0x79c8,0xb78],[0x79cc,0xb7c],[0x79d0,0xb80],[0x79e0,0x6c],[0x79e4,0x70],[0x79e8,0x74]])sf(to,a(from));
  sf(0x79ec,F(-a(0x84)));sf(0x79f0,F(-a(0x88)));sf(0x79f4,F(-a(0x8c)));
  sf(0x79dc,length3(F(a(0x1618)-a(0x50)),F(a(0x161c)-a(0x54)),F(a(0x1620)-a(0x58))));
  put(0x7a0c,half(0x16e0));sf(0x79f8,a(0xbf0));sf(0x79fc,a(0xbf4));
  let special=0;if(read(0x7a14)!==0&&a(0xc4c)>0&&F(query()+4)<f(0x79c0))special=1;
  put(entry+0x1c54,special);put(0x7a10,half(0x16cc));if(read(0x7a10)!==0)sf(0x79c0,F(f(0x79c0)+2));
 }
 sf(0x79d4,length3(f(0x79c8),f(0x79cc),f(0x79d0)));
 if(read(entry+0x1c54)===0){sf(0x7a00,query());if(f(0x79c0)<=f(0x7a00))put(entry+0x1c58,0);}
 else{sf(0x79c0,F(f(0x79c0)-2));put(entry+0x1c58,1);sf(0x7a00,F(f(0x79c0)+12));}
 const horizontal=length2(f(0x79ec),f(0x79f4));
 if(horizontal>0){
  const x=F(f(0x79ec)/horizontal),z=F(f(0x79f4)/horizontal),lateral=F(F(f(0x79c8)*x)+F(f(0x79d0)*z));
  sf(0x79d8,lateral);sf(0x79d8,lateral>=0?lateral:F(-lateral));
 }else sf(0x79d8,length2(f(0x79c8),f(0x79d0)));
 return freeze({effectWords0790,operations,diagnostic:{racerIndex:slot,extraActor:extra,queries,queryOffsets,graphicsExecuted:false}});
}
