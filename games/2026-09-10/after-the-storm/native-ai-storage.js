import {createNativeAIDriverState} from './native-ai-driver.js';

// 801C3C60..4218: four E8-byte contexts, shared target scratch, inverse
// order4100, count4110 and proximity index prefix4118. In particular405C
// is the role scan's real slot4 alias, not an invented fifth context.
export const NATIVE_AI_STORAGE_WORDS=(0x4218-0x3c60)/4;
const bits=new DataView(new ArrayBuffer(4));
const fields={racerIndex:0,avatar:4,role:0x5c,turnBudgetDegrees:0x64,
 dryFloorFrames:0xa0,lastRawXNative:0xa8,courseEscapeFrames:0xd8,courseEscapeActive:0xdc,fieldE0:0xe0,flag94:0x94};
const motionFields={recoveryPhase:0x8c,stuckFrames:0x90,dryMarkedContact:0x9c,offCircleBehindFrames:0xac,flagB0:0xb0,flagB4:0xb4};
const floatValue=v=>{bits.setUint32(0,v);return bits.getFloat32(0);};
const floatBits=v=>{bits.setFloat32(0,v);return bits.getUint32(0);};
function slotIndex(slot){if(!Number.isInteger(slot)||slot<0||slot>3)throw new RangeError('Invalid AI source slot');return slot*0xe8/4;}

/** Decode only the retained fields actually consumed by the selected driver.
 * This does not synthesize startup history or reinterpret target scratch as
 * another racer. Canonical storage validates all unsigned words on admission. */
export function nativeAIDriverStateFromWords(words,slot){
 if(!Array.isArray(words)||words.length!==NATIVE_AI_STORAGE_WORDS)throw new TypeError('Supply the retained AI storage span');
 const base=slotIndex(slot),read=offset=>words[base+offset/4]|0;
 const state=Object.fromEntries(Object.entries(fields).map(([key,offset])=>[key,
  key==='turnBudgetDegrees'?floatValue(read(offset)):key==='courseEscapeActive'?read(offset)!==0:read(offset)]));
 state.motionState=Object.fromEntries(Object.entries(motionFields).map(([key,offset])=>[key,read(offset)]));
 state.motionState.previousMotionDirection=Object.fromEntries(['x','y','z'].map((key,i)=>[key,floatValue(read(0xc4+i*4))]));
 return createNativeAIDriverState(state);
}

/** Return the next retained driver fields to the same raw owner. Transient
 * diagnostics are not claimed to be a complete emulation of native scratch. */
export function nativeAIDriverStateWrites(value,slot){
 const state=createNativeAIDriverState(value),base=slotIndex(slot),operations=[];
 if(state.racerIndex!==slot)throw new RangeError('AI state must belong to its source slot');
 const put=(offset,value)=>operations.push({kind:'aiWordWrite',wordIndex:base+offset/4,value:value>>>0});
 for(const [key,offset]of Object.entries(fields))put(offset,key==='turnBudgetDegrees'?floatBits(state[key]):Number(state[key]));
 for(const [key,offset]of Object.entries(motionFields))put(offset,state.motionState[key]);
 ['x','y','z'].forEach((key,i)=>put(0xc4+i*4,floatBits(state.motionState.previousMotionDirection[key])));
 return operations;
}
