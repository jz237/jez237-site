import {locateNativeWaterCell} from './native-water-field.js?v=c69bdfad4cd7';
import {nativePhaseSine} from './native-math-tables.js?v=c69bdfad4cd7';

// Independent reconstruction of the source course roller generator. Angles
// initialize through binary32 degrees/360*4096, then the reconstructed source
// sine initializer. No original executable or wave artwork is included.
const F=Math.fround,known=new WeakSet();
function integer(value,name,min,max){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`Invalid roller ${name}`);
 return value;
}
export function nativeRollerStep(heading){
 integer(heading,'heading',-32768,32767);
 const phase=Math.trunc(F(F(F(heading)/360)*4096));
 return [F(nativePhaseSine(phase)*64),F(nativePhaseSine(phase+1024)*64)];
}

/** The first heading advances rows/phase; the second runs along each crest.
 * Counts exclude the endpoint. Selection/class masks belong to the course. */
export function createNativeWaterRoller(row){
 if(!Array.isArray(row)||row.length!==13)throw new TypeError('Expected a thirteen-short roller row');
 row.forEach((v,i)=>integer(v,`row[${i}]`,-32768,32767));
 const [x,z,travelHeading,crestHeading,amplitudeNative,crestSamples,travelSamples,spacing,advance,cycle,low,high]=row;
 integer(crestSamples,'crest samples',0,256);integer(travelSamples,'travel samples',0,256);
 integer(cycle,'cycle',1,32767);integer(spacing,'spacing',0,cycle*512);
 integer(advance,'advance',0,cycle*512);integer(low,'window start',0,cycle);integer(high,'window end',low,cycle);
 const state={definition:Object.freeze({originNativeXZ:Object.freeze([x,z]),
  crestStepNativeXZ:Object.freeze(nativeRollerStep(crestHeading)),travelStepNativeXZ:Object.freeze(nativeRollerStep(travelHeading)),
  amplitudeNative,crestSamples,travelSamples,phaseSpacingIndex:spacing*4,phaseAdvanceIndex:-advance*4,
  cycleIndex:cycle*2048,windowStartIndex:low*2048,windowEndIndex:high*2048}),phaseIndex:0,frames:0};
 known.add(state);return state;
}

/** One post-patch source call. state72c==1 skips both phase and writes.
 * Outside the inclusive phase window existing heights AND velocities survive.
 * Later samples/generators overwrite earlier ones, including toroidal aliases.
 * This is independent of the ordinary patch simulation flag. A browser pause
 * skips the entire water frame, rather than calling this function repeatedly. */
export function stampNativeWaterRoller(field,roller,{state72c=0}={}){
 if(!known.has(roller))throw new TypeError('Expected a native water roller');
 if(!(field?.heightQ instanceof Int16Array)||field.heightQ.length!==49152||
  !(field.velocityQ instanceof Int16Array)||field.velocityQ.length!==49152)throw new TypeError('Expected a native water field');
 integer(state72c,'state72c',-32768,32767);
 const d=roller.definition;
 integer(roller.phaseIndex,'phase',0,d.cycleIndex-1);
 if(state72c===1)return {activeRows:0,samples:0,phaseIndex:roller.phaseIndex,skipped:true};
 let phase=roller.phaseIndex+d.phaseAdvanceIndex;
 if(phase<0)phase+=d.cycleIndex;
 roller.phaseIndex=phase;
 let [rowX,rowZ]=d.originNativeXZ,activeRows=0,samples=0;
 for(let row=0;row<d.travelSamples;row++){
  phase+=d.phaseSpacingIndex;if(phase>=d.cycleIndex)phase-=d.cycleIndex;
  if(phase>=d.windowStartIndex&&phase<=d.windowEndIndex){
   const height=Math.trunc(F(nativePhaseSine(phase)*d.amplitudeNative))<<8;
   let x=rowX,z=rowZ;activeRows++;
   for(let column=0;column<d.crestSamples;column++){
    for(const i of locateNativeWaterCell(x,z).indices){field.heightQ[i]=height;field.velocityQ[i]=0;}
    samples++;x=F(x+d.crestStepNativeXZ[0]);z=F(z+d.crestStepNativeXZ[1]);
   }
  }
  rowX=F(rowX+d.travelStepNativeXZ[0]);rowZ=F(rowZ+d.travelStepNativeXZ[1]);
 }
 roller.frames++;
 return {activeRows,samples,phaseIndex:roller.phaseIndex,skipped:false};
}
