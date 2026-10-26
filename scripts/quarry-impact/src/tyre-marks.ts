import * as T from 'three';

/** Tyre marks (offline): a wheel that strikes another car leaves black rubber on its paint, not its own colour — when the
 * contact lies within TYRE_MARK.reach m of one of the striking car's wheels (still on) and no higher above its hub than
 * TYRE_MARK.rise m (the tyre's own height, not the wing over it) — and a car sitting on top of another marks the panels under
 * each of its wheels every time it presses down. */
export const TYRE_MARK={reach:.7,rise:.38,colour:0x171615} as const;
export const RUBBER=new T.Color(TYRE_MARK.colour);
const at=new T.Vector3();
/** Is this world point at one of these wheels (those not lost)? */
export function atWheel(wheels:readonly (T.Object3D|undefined)[],lost:ArrayLike<boolean|number>,point:T.Vector3){
  if(![point.x,point.y,point.z].every(Number.isFinite))return false;
  return wheels.some((w,i)=>!!w&&!lost[i]&&w.getWorldPosition(at).distanceTo(point)<TYRE_MARK.reach&&point.y-at.y<TYRE_MARK.rise);
}
/** What a striking car leaves on another at this point: rubber where one of its wheels hit, otherwise its paint. */
export const markColour=(striker:{extendedDamage:boolean;wheels:readonly (T.Object3D|undefined)[];wreckParts:{wheelLost:ArrayLike<boolean|number>};paintColor:T.Color}|undefined,point:T.Vector3)=>
  striker&&striker.extendedDamage&&atWheel(striker.wheels,striker.wreckParts.wheelLost,point)?RUBBER:striker?.paintColor;
