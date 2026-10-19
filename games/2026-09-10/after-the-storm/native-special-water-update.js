// Original special-menu water motion (51238) and triangle disturbance (4EFB4).
// Sine samples are regenerated unless a caller supplies its actual lookup.
import {locateNativeWaterCell,createNativeWaterPatch,stepNativeWaterPatch} from './native-water-field.js';
import {stepNativeAIRandom} from './native-ai-initialization.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const bits=v=>{b.setFloat32(0,F(v));return b.getUint32(0);};
const number=v=>{b.setUint32(0,v);return b.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const integer=(v,name,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;};
export const NATIVE_SPECIAL_WATER_DATA=freeze({stepNative:51.2,turnDivisor:16383,
 bootMotionWords47c4:[0,1,1149239296,1149239296]});

/** Replace the three vertices of the selected triangle with signed Q8.8
 * height and zero velocity. These are stores, not additive wave impulses.
 * Ordered diagonal/base/side writes preserve original seam behavior.
 */
export function prepareNativeWaterDisturbance({xNative,zNative,amplitudeNative}){
 integer(amplitudeNative,'disturbance amplitude',-32768,32767);
 const indices=locateNativeWaterCell(xNative,zNative).indices;
 const order=[indices[2],indices[0],indices[1]],value=(amplitudeNative<<8)&65535;
 return freeze({operations:[...order.map(index=>({kind:'waterCellWrite',index,field:'heightQ',value})),
  ...order.map(index=>({kind:'waterCellWrite',index,field:'velocityQ',value:0}))]});
}

/** Main6 holds disturbance motion; main9 advances it even when simulation648
 * is zero. The latter gates only the following patch kernel. Neither mode
 * changes the tide. Ordinary race/ending paths require their own dispatch.
 * Motion and the shared RNG survive scene initialization; no implicit reset.
 */
export function prepareNativeSpecialWaterUpdate(input){
 const {main638,simulation648,field64c,extentNative,motionWords47c4,sineLookup}=input??{};
 if(![6,9].includes(main638)||field64c!==1)throw new RangeError('Special menu water requires main6/9 and field64c=1');
 integer(simulation648,'simulation648',-2147483648,2147483647);
 if(sineLookup!==undefined&&typeof sineLookup!=='function')throw new TypeError('Supply a sine lookup function');
 const patch={kind:'waterPatchRequest',playerIndex:0,xNative:0,zNative:0,radius:16,evolve:simulation648!==0};
 if(main638===6)return freeze({operations:[patch],diagnostic:{rngCalls:0,disturbanceApplied:false,graphicsExecuted:false}});
 integer(extentNative,'special water extent',1,32767);
 if(!Array.isArray(motionWords47c4)||motionWords47c4.length!==4)throw new RangeError('Supply retained motionWords47c4[4]');
 const motion=motionWords47c4.map(w=>integer(w,'motion word',0,0xffffffff));
 let rng=integer(input.rngState4640,'rngState4640',0,0xffffffff),rngCalls=0;
 const operations=[],write=(i,value)=>{motion[i]=value>>>0;operations.push({kind:'menuWaterMotionWrite',byteOffset:i*4,width:4,value:value>>>0});};
 const sample=index=>{const i=index&4095,v=F(sineLookup?sineLookup(i):Math.sin(i*Math.PI*2/4096));if(!Number.isFinite(v))throw new RangeError('Nonfinite special water sine sample');return v;};
 const random=()=>{rng=stepNativeAIRandom(rng).rngState;rngCalls++;operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rng});return rng;};
 let angle=(motion[0]+motion[1]+4096)&4095;
 const oldX=number(motion[2]),oldZ=number(motion[3]);
 if(!Number.isFinite(oldX)||!Number.isFinite(oldZ))throw new RangeError('Nonfinite retained disturbance position');
 // Double arithmetic around float32 samples is intentional in the caller.
 let x=F(oldX+NATIVE_SPECIAL_WATER_DATA.stepNative*sample(angle+1024));
 let z=F(oldZ+NATIVE_SPECIAL_WATER_DATA.stepNative*sample(angle));
 write(0,angle);write(2,bits(x));write(3,bits(z));
 if(F(extentNative*extentNative)<F(F(x*x)+F(z*z))){
  angle=random()&4095;x=F(sample(angle+1024)*F(extentNative));z=F(sample(angle)*F(extentNative));
  write(0,angle);write(2,bits(x));write(3,bits(z));
  angle=random()&4095;write(0,angle);
  const turn=Math.trunc(F((random()&16383)*14)/NATIVE_SPECIAL_WATER_DATA.turnDivisor)-7;write(1,turn);
 }
 operations.push(...prepareNativeWaterDisturbance({xNative:x,zNative:z,amplitudeNative:-50}).operations,patch);
 return freeze({operations,motionWords47c4:motion,rngState4640:rng,
  diagnostic:{rngCalls,disturbanceApplied:true,graphicsExecuted:false}});
}

/** Apply a prepared menu frame to live field storage without advancing the
 * race's water/hull/roller counters or forcing phase. Validate all writes and
 * the patch before mutation. Canonical motion/RNG are committed by the host
 * alongside this field; the field has no independent random stream.
 */
export function applyNativeSpecialWaterField(field,operations){
 if(!(field?.heightQ instanceof Int16Array)||!(field.velocityQ instanceof Int16Array)||
  field.heightQ.length!==49152||field.velocityQ.length!==49152)throw new TypeError('Supply complete native water field');
 if(field.parameters?.radius!==16||field.parameters.restoringShift!==10||field.parameters.couplingShift!==4||field.parameters.dampingShift!==5)
  throw new RangeError('Special menu field requires variant1 parameters');
 if(!Array.isArray(operations))throw new TypeError('Supply ordered special water operations');
 const cells=[];let request=null;
 for(const op of operations){
  if(op.kind==='waterCellWrite'){
   if(request)throw new RangeError('Disturbance must precede patch evolution');
   integer(op.index,'water cell index',0,49151);integer(op.value,'water cell bits',0,65535);
   if(!['heightQ','velocityQ'].includes(op.field))throw new RangeError('Invalid water cell field');cells.push(op);
  }else if(op.kind==='waterPatchRequest'){
   if(request||op.playerIndex!==0||op.xNative!==0||op.zNative!==0||op.radius!==16||typeof op.evolve!=='boolean')throw new RangeError('Invalid special water patch');
   request=op;
  }else if(!['menuWaterMotionWrite','sourceWordWrite'].includes(op.kind))throw new RangeError('Unsupported special water operation');
 }
 if(!request)throw new RangeError('Missing special water patch');
 const patch=createNativeWaterPatch(field,request);
 for(const op of cells)field[op.field][op.index]=op.value;
 if(request.evolve)stepNativeWaterPatch(field,patch);
 return freeze({patch,graphicsExecuted:false});
}
