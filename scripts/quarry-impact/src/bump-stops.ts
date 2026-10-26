/** Bump stops and worn bushes (offline): a corner slammed through its travel crashes onto its rubber bump stop with a clunk — a
 * wheel on the ground (and on it a moment ago, so not a landing, which has its own thump) whose suspension closes faster than
 * BUMP.speed m/s to within BUMP.near m of fully compressed; louder the faster it closed (BUMP.volume, all of it at BUMP.full
 * m/s). An old banger's worn bushes and dampers knock too: from BUMP.worn of its age, any corner closing faster than BUMP.knock
 * m/s gives a quieter clunk (BUMP.knockVolume, more the older). At most once a corner every BUMP.gap s. */
export const BUMP={speed:.9,near:.035,knock:.7,worn:.4,gap:.35,volume:[.3,.8],knockVolume:[.16,.42],full:2.6,duration:.6,clips:['bump-stop-0','bump-stop-1','bump-stop-2']} as const;
/** How a corner is struck this step — onto its bump stop, or a worn knock — and how loud (0 none): its suspension length before
 * and now (m), the shortest it can get (m), over dt s, on the ground now and before, on a car this old (0–1). */
export function bumpStrike(before:number,now:number,floor:number,dt:number,grounded:boolean,wasGrounded:boolean,age=0):{stop:boolean;volume:number}{
  const none={stop:false,volume:0};
  if(!grounded||!wasGrounded||!(dt>0)||![before,now,floor].every(Number.isFinite))return none;
  const closing=(before-now)/dt,a=Number.isFinite(age)?Math.max(0,Math.min(1,age)):0;
  if(closing>BUMP.speed&&now-floor<=BUMP.near)return{stop:true,volume:BUMP.volume[0]+(BUMP.volume[1]-BUMP.volume[0])*Math.min(1,(closing-BUMP.speed)/(BUMP.full-BUMP.speed))};
  if(a>=BUMP.worn&&closing>BUMP.knock)return{stop:false,volume:(BUMP.knockVolume[0]+(BUMP.knockVolume[1]-BUMP.knockVolume[0])*Math.min(1,(closing-BUMP.knock)/(BUMP.full-BUMP.knock)))*(.7+.3*a)};
  return none;
}
