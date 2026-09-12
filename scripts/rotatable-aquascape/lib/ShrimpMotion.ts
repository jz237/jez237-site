import * as T from 'three';

export type ShrimpMotion={time:number;cycle:number;swimming:number;curl:number;turn:number;adjustment:number;adjustIn:number;adjustAge:number;seed:number;frequency:number};
export function createShrimpMotion(id:number):ShrimpMotion{return {time:id*2.73,cycle:id*1.83,swimming:0,curl:0,turn:0,adjustment:0,adjustIn:3+id*1.9,adjustAge:99,seed:7321+id*631,frequency:.5};}
const smooth=T.MathUtils.smoothstep;
/** Evidence-informed states; amplitudes/timing are illustrative, not N. davidi measurements. */
export function advanceShrimpMotion(s:ShrimpMotion,dt:number,flight:number|null,speed:number,turn:number){
 if(dt<=0)return;dt=Math.min(.1,dt);s.time+=dt;s.adjustIn-=dt;
 if(s.adjustIn<=0){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;s.adjustIn=7+s.seed/4294967296*14;s.adjustAge=0;}s.adjustAge+=dt;
 const adjusting=s.adjustAge<3.6?Math.sin(Math.PI*s.adjustAge/3.6)**2:0;
 s.adjustment+=(adjusting-s.adjustment)*(1-Math.exp(-dt*5));s.swimming+=((flight===null?0:1)-s.swimming)*(1-Math.exp(-dt*6));
 const activity=T.MathUtils.clamp(speed/.15,0,1),launch=flight===null?0:Math.exp(-flight*12),landing=flight===null?0:smooth(flight,.76,1);
 // Extension during travel; modest coordinated curl for posture adjustments,
 // takeoff and settling. A large escape tail-flip is a separate behavior.
 const posture=.025+.12*s.adjustment+.035*Math.sin(s.time*.93)+.018*Math.sin(s.time*1.71+.8);
 const curl=posture*(1-s.swimming)+s.swimming*(-.10+.25*launch+.27*landing+.045*Math.sin(s.time*1.35)+.018*Math.sin(s.cycle*.5));
 s.curl+=(curl-s.curl)*(1-Math.exp(-dt*4));s.turn+=(T.MathUtils.clamp(turn,-1,1)*s.swimming*.16-s.turn)*(1-Math.exp(-dt*3));
 const frequency=(.35+activity*.6)*(1-s.swimming)+(2.1+activity*1.2+.22*Math.sin(s.time*.63))*s.swimming;
 s.frequency+=(frequency-s.frequency)*(1-Math.exp(-dt*5));s.cycle+=dt*s.frequency*Math.PI*2;
}
export const shrimpCenters=Array.from({length:6},(_,k)=>new T.Vector3(-.102-k*.037,.116+Math.sin(k/5*Math.PI)*.014-k*.003,0));
export const shrimpJoints=shrimpCenters.map((c,k)=>k?c.clone().lerp(shrimpCenters[k-1],.5):new T.Vector3(-.0796,.116,0));
const weights=[.10,.16,.25,.23,.16,.10],move=new T.Matrix4(),rotate=new T.Matrix4(),back=new T.Matrix4(),euler=new T.Euler();
/** Linked rigid shell segments hinge at shared pivots; the head remains steady. */
export function shrimpAbdomen(s:ShrimpMotion,frames:T.Matrix4[]){
 for(let k=0;k<6;k++){
  const joint=shrimpJoints[k],pitch=s.curl*weights[k],yaw=s.turn*weights[k];
  move.makeTranslation(joint.x,joint.y,joint.z);rotate.makeRotationFromEuler(euler.set(0,yaw,pitch));back.makeTranslation(-joint.x,-joint.y,-joint.z);
  frames[k].identity();if(k)frames[k].copy(frames[k-1]);frames[k].multiply(move).multiply(rotate).multiply(back);
 }
 return frames;
}
export function swimmeretStroke(s:ShrimpMotion,k:number){
 // Posterior pairs lead. Broad power stroke, narrower folded recovery.
 const phase=s.cycle+k*.95,power=(1+Math.cos(phase))*.5;
 return {angle:(.19+s.swimming*.50)*Math.sin(phase),spread:.38+.62*power,fold:s.swimming*(1-power)*.5};
}
