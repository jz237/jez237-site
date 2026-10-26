/** Sagging bumpers (offline rivals, by age): an old banger's bumper has lost its clips at one end. From SAG.age of its age, on
 * SAG.share of them the front or rear bumper hangs SAG.loose of the way to falling, its free corner dropped a further SAG.drop
 * rad and gapping from the body, rattling at speed as any knocked bumper does — and, hanging loose, ready to hook another car's (bumper lock).
 * Never the end held up with duct tape. Set through the bumper's own hinge (the damage that leaves it that loose): no new
 * mesh, no draw call. Kept short of the looseness the wind tears off at speed (WIND_RIP.loose) or that drags on the ground. */
export const SAG={age:.35,share:.35,loose:[.14,.22],drop:[.05,.09]} as const;
/** A knocked bumper's hinge: loose = (damage − start)/span (wreck-attachments). */
export const BUMPER_HINGE={start:10,span:38} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*53.17+salt*37.91)*43758.5453)%1;
export type SagState={end:'front'|'rear';side:-1|1;loose:number;drop:number};
/** Car `id` of this age: which bumper sags, at which corner (−1 left, 1 right: the end that drops), how loose and how far down. */
export function sagFor(id:number,age:number):SagState|null{
  const n=Number.isFinite(id)?id:0;
  if(!(age>=SAG.age)||hash(n,1)>=SAG.share)return null;
  return {end:hash(n,2)<.5?'front':'rear',side:hash(n,3)<.5?-1:1,loose:SAG.loose[0]+(SAG.loose[1]-SAG.loose[0])*hash(n,4),drop:SAG.drop[0]+(SAG.drop[1]-SAG.drop[0])*hash(n,5)};
}
/** The damage that leaves a bumper this loose on its hinge. */
export const sagDamage=(loose:number)=>BUMPER_HINGE.start+BUMPER_HINGE.span*Math.max(0,Math.min(1,Number.isFinite(loose)?loose:0));
