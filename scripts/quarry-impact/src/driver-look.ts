import type * as T from 'three';
/** Drivers look where the fight is (cosmetic): a driver's visor turns towards the car they are hunting, otherwise into the turn
 * the car is making, and anyone reversing looks back over the shoulder the tail swings towards, as derby drivers hit backwards.
 * max is how far a head turns (radians; a target further round is watched from there), rate how fast it turns (rad/s), turn how
 * far a driver looks per rad/s of yaw and reverse the speed (m/s, backwards) below which they look round. */
export const LOOK={max:1.45,rate:5,turn:.5,reverse:-1.5} as const;
/** Where the head wants to point (radians, + towards the car's +x): towards target (car frame, x sideways, z forward) when there
 * is one, else over the shoulder when reversing, else into the turn (yaw rate, rad/s, + turning towards +x). */
export function lookYaw(target:{x:number;z:number}|null,yawRate:number,speed:number){
  const clamp=(v:number)=>Math.max(-LOOK.max,Math.min(LOOK.max,Number.isFinite(v)?v:0)),turn=Number.isFinite(yawRate)?yawRate:0;
  if(target&&(target.x!==0||target.z!==0))return clamp(Math.atan2(target.x,target.z));
  // Backing up, the tail swings opposite the yaw: look back over that shoulder.
  if(speed<LOOK.reverse)return turn>0?-LOOK.max:LOOK.max;
  return clamp(turn*LOOK.turn);
}
/** Turns a driver figure's visor (its second part, which turns about the helmet's centre) towards yaw at LOOK.rate. */
export function turnHead(figure:T.Object3D,yaw:number,dt:number){
  const visor=figure.children[1];if(!visor||!(dt>0))return;
  const now:number=figure.userData.look??0,step=LOOK.rate*Math.min(dt,.1),next=now+Math.max(-step,Math.min(step,yaw-now));
  figure.userData.look=next;visor.rotation.y=Math.PI/2+next;
}
