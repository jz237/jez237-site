/** Estimated finishes for the cars still racing when a solo race ends on the player's finish. A sim classifies the field
 * when you skip the rest of the race: each running car covers the distance it has left at its own average pace so far.
 * Rows come in finishing order (finished cars first, then running cars by distance covered); a car is estimated only once
 * it has passed ESTIMATE.minimum checkpoints, and no estimate beats the car classified ahead of it. */
export const ESTIMATE={minimum:4,gap:.1} as const;
export type EstimateRow={finished:boolean;finishTime:number;passed:number;penalty:number;health:number};
/** Each row's estimated finish time (seconds, recovery penalties included), or null: finished, wrecked or too early to tell. */
export function estimateFinishes(rows:readonly EstimateRow[],checkpoints:number,elapsed:number):(number|null)[]{
  let floor=0;
  return rows.map(r=>{
    if(r.finished){if(Number.isFinite(r.finishTime))floor=Math.max(floor,r.finishTime);return null;}
    if(!(r.health>0)||!(r.passed>=ESTIMATE.minimum)||!(elapsed>0)||!(checkpoints>r.passed))return null;
    const pace=elapsed/r.passed,time=Math.max(elapsed+(checkpoints-r.passed)*pace+(Number.isFinite(r.penalty)?r.penalty:0),floor+ESTIMATE.gap);
    floor=time;return time;
  });
}
