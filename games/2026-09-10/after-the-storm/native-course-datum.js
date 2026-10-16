// Original51238's opening block. The caller922E4 reaches it once after the
// hull/actor stage, before water patch selection and ordinary lap judging.
// Stage1FCC is shared source progress, not a displayed lap or elapsed timer.
export function nativeCourseDatumAfterPhysics(datumNative,{courseIndex,simulation648,main638,southernLap1fcc}){
 for(const value of [datumNative,courseIndex,simulation648,main638,southernLap1fcc])
  if(!Number.isInteger(value)||value< -2147483648||value>2147483647)throw new RangeError('Expected signed native datum/state words');
 if(courseIndex!==7||simulation648===0||main638!==1)return datumNative;
 const target=southernLap1fcc===1?-100:southernLap1fcc===2?-150:null;
 return target!==null&&datumNative>target?datumNative-1:datumNative;
}
