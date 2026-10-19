import {NATIVE_ANGLE_TABLE_WORDS} from './native-math-tables.js';
import {nativeRaceLookupAngle} from './native-race-direction-warning.js';
import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const float=w=>{b.setUint32(0,w);return b.getFloat32(0);},bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function scalar(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite actor visibility input');return F(v);}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n||v.some(w=>!Number.isInteger(w)||w<0||w>0xffffffff))throw new RangeError(`Supply ${name}[${n}]`);return [...v];}
function signed(v){if(!Number.isInteger(v)||v< -2147483648||v>2147483647)throw new RangeError('Supply signed actor matrix input');return v;}

/** Complete 9D3AC numeric heading. Its reciprocal-length normalization and
 * integer truncation differ from ED154 and from a standard atan2 calculation.
 */
export function nativePresentationVectorHeading(x,z,angleTableWords6f08=NATIVE_ANGLE_TABLE_WORDS){
 x=scalar(x);z=scalar(z);const length=F(Math.sqrt(F(F(x*x)+F(z*z))));
 if(length===0)return 0;
 const reciprocal=F(1/length),cosine=F(reciprocal*x),angle=nativeRaceLookupAngle(cosine,angleTableWords6f08);
 return F(Math.trunc(F(reciprocal*z)<=0?angle:F(360-angle)));
}
function circular(v){while(v>=360)v=F(v-360);while(v<0)v=F(v+360);return v;}
function difference(v){while(v>180)v=F(v-360);while(v< -180)v=F(v+360);return v;}

/** ADC8C estimates the next matrix requirement but does not allocate it.
 * The actual draw producer, not this estimate, owns the used counter.
 */
export function nativePresentationActorMatrixEstimate(type,used){
 signed(type);signed(used);const costs=[8,1,8,1,6,6,4,4,4,4,0,1];
 const index=(type-1)>>>0;return (used+(index<12?costs[index]:0))|0;
}

/** Complete ADE14 visibility and retained angle scratch writes. cameraIndex
 * is the actual display selector80223930; callers must supply the selected
 * retained camera, not the browser chase-camera pose.
 */
export function prepareNativePresentationActorVisibility(input){
 const actorWordsF060=words(input?.actorWordsF060,NATIVE_PRESENTATION_ACTOR_WORDS,'actorWordsF060'),actorIndex=input.actorIndex,operations=[];
 if(!Number.isInteger(actorIndex)||actorIndex<0||actorIndex>=30)throw new RangeError('Invalid presentation actor index');
 const base=actorIndex*47,type=actorWordsF060[base];let visible;
 if(actorWordsF060[base+0xb8/4]!==0)visible=true;
 else if(type===0)visible=false;
 else{
  const cameraIndex=input.cameraIndex;if(![0,1].includes(cameraIndex))throw new RangeError('Supply actual display camera index');
  const hud=words(input.hudWords7788,1442,'hudWords7788'),c=(0x7c80+cameraIndex*0x10c-0x7788)/4;
  const get=o=>scalar(float(hud[c+o/4])),actor=o=>scalar(float(actorWordsF060[base+o/4]));
  const put=(address,v)=>{const offset=address-0x801cf060,value=bits(v);actorWordsF060[offset/4]=value;operations.push({kind:'presentationActorWrite',byteOffset:offset,width:4,value});};
  const table=input.angleTableWords6f08??NATIVE_ANGLE_TABLE_WORDS;
  const facing=circular(F(-nativePresentationVectorHeading(get(0xf0),get(0xf4),table)));put(0x801d0754,facing);
  const bearing=circular(nativePresentationVectorHeading(F(actor(0xc)-get(0x4c)),F(-F(actor(0x14)-get(0x54))),table));put(0x801d0758,bearing);
  visible=type===6||Math.abs(difference(F(bearing-facing)))<100;
 }
 return freeze({actorWordsF060,operations,visible,diagnostic:{actorIndex,graphicsExecuted:false}});
}
