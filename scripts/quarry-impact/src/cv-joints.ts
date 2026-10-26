/** CV joints (offline): the constant-velocity joint of a driven front wheel, knocked about (its wheel damaged past CV.onset) or
 * worn out with age (from CV.age), clicks as the wheel turns on lock under power — past CV.lock of full lock, the pedal past
 * CV.throttle, between CV.speed m/s — CV.perTurn clicks a wheel turn (at most CV.max a second), louder the worse it is
 * (CV.volume). Three recorded takes, by turns. */
export const CV={onset:.25,age:.75,worn:.45,lock:.45,throttle:.2,speed:[.8,10],perTurn:3,max:9,volume:[.22,.62],duration:.4,clips:['cv-click-0','cv-click-1','cv-click-2']} as const;
const clamp01=(v:number)=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):0;
/** How far gone a front wheel's CV joint is (0 sound, 1 wrecked): from its wheel's damage, or the car's age. */
export function cvWear(wheelDamage:number,age:number){
  const hit=clamp01((wheelDamage-CV.onset)/(1-CV.onset)),a=clamp01(age),old=a<CV.age?0:CV.worn*(.5+.5*(a-CV.age)/(1-CV.age));
  return Math.max(hit,old);
}
/** Clicks a second from a joint this far gone, at this steer (−1–1), pedal and speed (m/s), on a wheel of this radius (m). */
export function cvClicks(wear:number,steer:number,throttle:number,speed:number,radius:number){
  const w=clamp01(wear),v=Number.isFinite(speed)?Math.abs(speed):0;
  if(w<=0||!(Math.abs(steer)>=CV.lock)||!(throttle>=CV.throttle)||v<CV.speed[0]||v>CV.speed[1]||!(radius>0))return 0;
  return Math.min(CV.max,v/(2*Math.PI*radius)*CV.perTurn);
}
export const cvVolume=(wear:number)=>CV.volume[0]+(CV.volume[1]-CV.volume[0])*clamp01(wear);
