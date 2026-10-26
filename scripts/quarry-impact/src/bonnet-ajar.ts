/** Bonnet ajar (offline rivals, by age): an old banger's bonnet catch has gone. From AJAR.age of its age, on AJAR.share of them
 * the bonnet sits up, AJAR.loose of the way to falling and lifted a further AJAR.lift rad at its front edge — a hand's
 * width proud of the grille, a dark gap under it, shaking at speed as any knocked bonnet does. Set through the bonnet's own hinge (the damage
 * that leaves it that loose): no new mesh, no draw call. Kept short of the looseness the wind tears off at speed
 * (WIND_RIP.loose) or that it starts lifting in the airflow. */
export const AJAR={age:.45,share:.3,loose:[.12,.2],lift:[.035,.06]} as const;
/** A knocked bonnet's hinge: loose = (damage − start)/span (wreck-attachments). */
export const BONNET_HINGE={start:12,span:38} as const;
const hash=(n:number,salt:number)=>Math.abs(Math.sin(n*47.29+salt*41.63)*43758.5453)%1;
/** How loose car `id`'s bonnet sits at this age and how far further up its front edge is lifted (null: shut on its catch). */
export function ajarFor(id:number,age:number){
  const n=Number.isFinite(id)?id:0;
  if(!(age>=AJAR.age)||hash(n,1)>=AJAR.share)return null;
  return {loose:AJAR.loose[0]+(AJAR.loose[1]-AJAR.loose[0])*hash(n,2),lift:AJAR.lift[0]+(AJAR.lift[1]-AJAR.lift[0])*hash(n,3)};
}
/** The damage that leaves a bonnet this loose on its hinge. */
export const ajarDamage=(loose:number)=>BONNET_HINGE.start+BONNET_HINGE.span*Math.max(0,Math.min(1,Number.isFinite(loose)?loose:0));
