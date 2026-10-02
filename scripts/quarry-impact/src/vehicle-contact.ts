import type R from '@dimforge/rapier3d-compat';
type ContactVehicle={kind:string;body:R.RigidBody;collider:R.Collider};
/** Resolve all compound pieces through their rigid body. The utility's many
 * shell contacts share one cooldown, rather than multiplying impact damage. */
export function vehicleContact<T extends ContactVehicle>(world:R.World,cars:readonly T[],h1:number,h2:number){
 const parent1=world.getCollider(h1)?.parent()?.handle,parent2=world.getCollider(h2)?.parent()?.handle;
 const a=parent1===undefined?undefined:cars.find(c=>c.body.handle===parent1),b=parent2===undefined?undefined:cars.find(c=>c.body.handle===parent2);
 // Preserve the established two-collider contact cadence for existing cars.
 // The new utility has a compound cargo shell, with several simultaneous hits.
 const compound=a?.kind==='utility'||b?.kind==='utility';
 const k1=compound&&a?a.collider.handle:h1,k2=compound&&b?b.collider.handle:h2;
 return{a,b,key:Math.min(k1,k2)+':'+Math.max(k1,k2)};
}
