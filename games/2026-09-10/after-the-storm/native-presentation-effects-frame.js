import {prepareNativePresentationEffectInputs,prepareNativeTransientEffects,NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
import {prepareNativeSprayUpdate} from './native-spray-update.js';
import {prepareNativeEffectGeometry} from './native-effect-geometry.js';
import {nativeEffectEngineMask} from './native-effect-body-view.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite effect camera axis');return F(v);}
const number=w=>{b.setUint32(0,w);return finite(b.getFloat32(0));},bits=v=>{b.setFloat32(0,finite(v));return b.getUint32(0);};
const length=v=>finite(Math.sqrt(F(F(F(v[0]*v[0])+F(v[1]*v[1]))+F(v[2]*v[2]))));
const u64=(hi,lo)=>(BigInt(hi)<<32n)|BigInt(lo),mask=(1n<<64n)-1n;

/** Complete B2ABC scene-effects update, including its numeric children.
 * Two explicit osGetTime samples and the pure source-plane query are external
 * inputs. Vertex operations are prepared for the renderer, never submitted here.
 * Inactive gameplay skips spray evolution but still prepares geometry, ages
 * wake rows and updates transient effects, exactly as the original parent does.
 */
export function prepareNativePresentationEffectsFrame(input){
 let effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),effectControlWords6d60=words(input.effectControlWords6d60,22,'effectControlWords6d60'),seed6f00=integer(input.seed6f00,'effect random seed',0,65535);
 const hud=words(input.hudWords7788,1442,'hudWords7788'),players=integer(input.players,'players',1,2),activity=integer(input.activity624,'effect activity',-32768,32767),
  start=words(input.clockStartWords,2,'clockStartWords'),end=words(input.clockEndWords,2,'clockEndWords'),operations=[],queries=[],queryOffsets=[],stages=[];
 const read=a=>effectWords0790[(a-0x790)/4],put=(a,v)=>{const value=v>>>0;effectWords0790[(a-0x790)/4]=value;operations.push({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});},sf=(a,v)=>put(a,bits(v));
 const control=(a,v)=>{const value=v>>>0;effectControlWords6d60[(a-0x6d60)/4]=value;operations.push({kind:'presentationEffectControlWrite',byteOffset:a-0x6d60,width:4,value});};
 const count=integer(read(0x790)|0,'effect participant count',-2147483648,4);
 const first=integer(input.displayCamera3930,'first effect camera',0,1),second=players===2||count>0?integer(input.displayCamera3934,'second effect camera',0,1):undefined;
 const camera=i=>0x80227c80+i*0x10c;
 function normalize(v,address){const n=length(v);if(n>0)v.forEach((x,i)=>sf(address+i*4,F(x/n)));}
 function cross(a,c,address){
  const v=[F(F(a[1]*c[2])-F(a[2]*c[1])),F(F(a[2]*c[0])-F(a[0]*c[2])),F(F(a[0]*c[1])-F(a[1]*c[0]))];
  v.forEach((x,i)=>sf(address+i*4,x));normalize(v,address);return [0,4,8].map(o=>number(read(address+o)));
 }
 function axes(view,base){
  put(0x7968,camera(view));const forward=[0x64,0x68,0x6c].map(o=>number(hud[(0x7c80+view*0x10c+o-0x7788)/4]));normalize(forward,base);
  if(forward[0]!==0||forward[2]!==0)cross(cross(forward,[0,1,0],base+12),forward,base+24);
  else for(const [o,v]of [[16,0],[20,0],[12,1],[24,0],[28,0],[32,1]])sf(base+o,v);
 }
 function accept(q,name,slot){
  stages.push({name,racerIndex:slot,operationOffset:operations.length});
  if(q.diagnostic.queries){queries.push(...q.diagnostic.queries);queryOffsets.push(...q.diagnostic.queryOffsets.map(o=>o+operations.length));}
  effectWords0790=[...q.effectWords0790];if(q.effectControlWords6d60)effectControlWords6d60=[...q.effectControlWords6d60];if(q.seed6f00!==undefined)seed6f00=q.seed6f00;
  operations.push(...q.operations);
 }
 const inputs=slot=>({...input,effectWords0790,effectControlWords6d60,seed6f00,racerIndex:slot});
 put(0x7b18,start[0]);put(0x7b1c,start[1]);axes(first,0x7974);if(players===2)axes(second,0x7998);
 for(let slot=0;slot<count;slot++){
  const entry=0x801d0798+slot*0x1c74;
  for(const [a,o]of [[0x6d60,0],[0x6d68,0],[0x6d70,0x1000],[0x6d78,0x1a00],[0x6d80,0x1aa0]])control(a,entry+o);
  accept(prepareNativePresentationEffectInputs(inputs(slot)),'inputs',slot);
  put(0x7968,camera(players===2&&slot===input.secondaryHumanIndex?second:first));put(0x796c,camera(first));put(0x7970,camera(second));
  if(activity===-1){
   accept(prepareNativeSprayUpdate({...inputs(slot),record2f4:input.record2f4BySlot?.[slot],bodyC66:nativeEffectEngineMask(input,slot)}),'spray',slot);
  }
  accept(prepareNativeEffectGeometry(inputs(slot)),'geometry',slot);
 }
 const clockOffsets=[0,operations.length],delta=(u64(...end)-u64(...start))&mask,total=(u64(read(0x7b28),read(0x7b2c))+delta)&mask,counter=(u64(read(0x7b30),read(0x7b34))+1n)&mask,
  high=v=>Number(v>>32n),low=v=>Number(v&0xffffffffn);
 put(0x7b1c,low(delta));put(0x7b18,high(delta));put(0x7b28,high(total));put(0x7b2c,low(total));put(0x7b30,high(counter));put(0x7b34,low(counter));
 if(delta>u64(read(0x7b20),read(0x7b24))){put(0x7b20,high(delta));put(0x7b24,low(delta));}
 accept(prepareNativeTransientEffects({effectWords0790,seed6f00}),'transients',null);
 return freeze({effectWords0790,effectControlWords6d60,seed6f00,operations,diagnostic:{queries,queryOffsets,clockOffsets,stages,effectCount:count,graphicsExecuted:false}});
}
