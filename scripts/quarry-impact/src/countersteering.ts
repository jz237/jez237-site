/** Preserve normal high-speed steering limits, but return steering travel when
 * the driver opposes a spin and points the wheels toward sideways travel. Local
 * +X is right and positive steering turns right. No automatic steering or
 * velocity correction is added; this only changes the driver's available lock. */
export function steeringSpeedScale(forwardSpeed:number,lateralSpeed:number,steer:number,yawRate:number):number{
 const normal=1/(1+Math.abs(forwardSpeed)*.016);
 if(forwardSpeed<=5||steer*lateralSpeed<=0||steer*yawRate>=0)return normal;
 const slipAngle=Math.atan2(Math.abs(lateralSpeed),forwardSpeed);
 const amount=Math.max(0,Math.min(1,(slipAngle-.06)/.24));
 const rotation=Math.max(0,Math.min(1,(Math.abs(yawRate)-.15)/.85));
 const relief=amount*amount*(3-2*amount)*rotation*rotation*(3-2*rotation);
 return normal+(1-normal)*relief;
}
