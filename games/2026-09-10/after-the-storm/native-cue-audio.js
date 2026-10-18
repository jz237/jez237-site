// Original C1EB8: disabled base255 suppresses the cue. Only selectors0..2
// are relative to the retained base; every other argument is a direct byte.
export function prepareNativeCueAudio(selector,base){
 if(!Number.isInteger(selector)||selector< -2147483648||selector>0xffffffff||
  !Number.isInteger(base)||base<0||base>255)throw new RangeError('Invalid original cue selector');
 if(base===255)return [];
 const value=selector>=0&&selector<=2?base+selector:selector;
 return [{consumer:'c53d4',arguments:[0x06000b00,((value<<24)>>24)>>>0]}];
}

// Sequence0/channel11 uses instrument selectors on note39. Missing programs
// fall back to the channel's instrument0;127 selects its empty drum table.
// Selector16 starts two copies of instrument15 and blocks IO0 for1200 ticks.
export function originalCuePlan(selector){
 if(!Number.isInteger(selector)||selector<0||selector>127)return null;
 if(selector===16)return {program:15,layers:2,discardTicks:1200,nextPollTicks:8};
 if(selector===127)return {program:null,layers:0,discardTicks:0,nextPollTicks:0};
 return {program:selector>=20||[3,7,17].includes(selector)?0:selector,layers:1,discardTicks:0,nextPollTicks:0};
}
