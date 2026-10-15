// Native Southern starts at zero and falls after a human finishes a lap.
// The shared logical-clock policy is20Hz; independent wall-clock calibration
// remains outstanding. Keep the original one-native-unit discrete decrement.
export function createCourseDatum(course){return course.sourceWaterDatum?{value:course.sourceWaterDatum.initial,completedLaps:0,remainder:0}:null;}
export function stepCourseDatum(state,dt){
 const datum=state.courseDatum,policy=state.course.sourceWaterDatum;if(!datum||state.mode==='stunt'||state.freeRide)return;
 datum.completedLaps=Math.max(datum.completedLaps,...state.racers.filter(r=>r.human).map(r=>r.lap-1));
 datum.remainder+=dt;
 while(datum.remainder>=.05-1e-10){
  datum.remainder=Math.max(0,datum.remainder-.05);
  const target=datum.completedLaps===1?policy.lapTargets[1]:datum.completedLaps===2?policy.lapTargets[2]:null;
  if(target!==null&&datum.value>target)datum.value=Math.max(target,datum.value-policy.stepPerEligibleNativeUpdate);
 }
}
