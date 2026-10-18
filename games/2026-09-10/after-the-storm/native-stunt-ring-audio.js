// CompleteC3628: sequence15 receives a signed byte, but milestone comparisons
// retain the full incoming register. C3464 separately gates Stunt commentary.
const courseTargets=Object.freeze([11,12,9,15,16,16,14,10,14]);
export function prepareNativeStuntRingAudio(streak,courseIndex){
 if(!Number.isInteger(streak)||streak< -2147483648||streak>0xffffffff||
  !Number.isInteger(courseIndex)||courseIndex<0||courseIndex>=courseTargets.length)throw new RangeError('Invalid native ring audio input');
 const commands=[{consumer:'c53d4',arguments:[0x06000f01,((streak<<24)>>24)>>>0]},
  {consumer:'c53d4',arguments:[0x06000f00,0x25]}];
 const value=streak|0;
 const milestone={4:[0x64,20,16,10],8:[0x69,20,18,10],12:[0x6a,20,20,20]}[value];
 if(milestone)commands.push({consumer:'c3464',arguments:milestone});
 if(value===courseTargets[courseIndex])commands.push({consumer:'c3464',arguments:[0x6b,20,32,30]});
 return commands;
}
