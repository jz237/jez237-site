/** Puddle splash sound (offline): a tyre ploughing into standing water at SPLASH_SOUND.speed m/s or more splashes (two
 * recorded takes, in turn), louder the deeper and faster it goes (full at the water's drag at its reference speed), no more
 * often than every SPLASH_SOUND.gap s per car, so a car crossing a puddle splashes with its front wheels and then its back. */
export const SPLASH_SOUND={speed:6,gap:.12,volume:.75,duration:1.2,clips:['puddle-splash-0','puddle-splash-1']} as const;
/** How loud a tyre that has just hit the water splashes, from its plough (water drag ÷ AQUA.drag) and speed; 0 for none. */
export function splashVolume(plough:number,speed:number){
  const v=Math.abs(Number.isFinite(speed)?speed:0),p=Number.isFinite(plough)?Math.max(0,plough):0;
  if(v<SPLASH_SOUND.speed||p<=0)return 0;
  return SPLASH_SOUND.volume*Math.min(1,.35+p);
}
