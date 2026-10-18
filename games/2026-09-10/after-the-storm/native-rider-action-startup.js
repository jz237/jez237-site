export const NATIVE_RIDER_ACTION_LIMITS=Object.freeze({gestureWindowNative:3,idleThresholdNative:100});
const halves=['flag1600','sequence15f8','sequence15fa','lastPressedDirections15fc','quietFrames15fe'];
function integer(value,min,max){if(!Number.isInteger(value)||value<min||value>max)throw new RangeError('Invalid retained rider action startup field');return value;}

// The63120..63250 stores in62E50 reset these fields only. Flag1600,
// quietFrames15FE and idleChoice16C4 retain their supplied values. The input
// timestamp comes from shared80151960; no per-rider clock is invented.
export function prepareNativeRiderActionStartup(retained,inputTick1960){
 const state={...retained};
 integer(inputTick1960,0,0xffffffff);integer(state.gestureTick15f0,0,0xffffffff);
 halves.forEach(k=>integer(state[k],0,65535));
 for(const key of ['idleFramesC6c','idleChoice16c4'])integer(state[key],-2147483648,2147483647);
 return {...state,gestureTick15f0:inputTick1960,sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:0x800,idleFramesC6c:0};
}
