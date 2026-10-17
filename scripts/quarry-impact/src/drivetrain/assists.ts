import type {AssistLevel} from '../driving-assists';
import {stepWheel,type WheelState,type WheelStep} from './wheel';
/** Predict with the contact solver, then remove only motor/service-brake torque.
 * No velocity edits or extra tire friction. Half assistance blends demand with
 * the safe demand; handbrake bypasses both interventions deliberately. */
export function assistedWheelStep(wheel:WheelState,input:WheelStep,traction:AssistLevel,abs:AssistLevel,serviceBrake:number,handbrake=false):WheelStep{
 if(handbrake||traction===0&&abs===0)return input;
 const result={...input},tolerance=.8+.15*Math.abs(input.speed);
 const predict=(p:WheelStep)=>stepWheel({...wheel},p);
 if(traction>0&&input.driveTorque!==0){
  const direction=Math.sign(input.driveTorque);
  // Engine braking is not powered wheelspin.
  if((Math.abs(input.speed)<1||direction*input.speed>=0)&&(!input.grounded||predict(input).slip*direction>tolerance)){
   let safe=0;
   if(input.grounded){
    let lo=0,hi=1;
    for(let i=0;i<14;i++){const mid=(lo+hi)/2;if(predict({...input,driveTorque:input.driveTorque*mid}).slip*direction>tolerance)hi=mid;else lo=mid;}
    safe=input.driveTorque*lo;
   }
   result.driveTorque=input.driveTorque+(safe-input.driveTorque)*traction;
  }
 }
 if(abs>0&&serviceBrake>0&&Math.abs(input.speed)>=2&&predict(result).slip*Math.sign(input.speed)< -tolerance){
  const base=Math.max(0,input.brakeTorque-serviceBrake),direction=Math.sign(input.speed);
  let lo=0,hi=1;
  for(let i=0;i<14;i++){const mid=(lo+hi)/2;if(predict({...result,brakeTorque:base+serviceBrake*mid}).slip*direction< -tolerance)hi=mid;else lo=mid;}
  result.brakeTorque=base+serviceBrake*(1-abs+lo*abs);
 }
 return result;
}
