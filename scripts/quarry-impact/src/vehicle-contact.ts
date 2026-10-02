import type R from '@dimforge/rapier3d-compat';
type ContactVehicle={kind:string;body:R.RigidBody;collider:R.Collider};
type Vec={x:number;y:number;z:number};
function colliderPoint(collider:R.Collider,local:Vec):Vec{
 const q=collider.rotation(),p=collider.translation(),tx=2*(q.y*local.z-q.z*local.y),ty=2*(q.z*local.x-q.x*local.z),tz=2*(q.x*local.y-q.y*local.x);
 return{x:p.x+local.x+q.w*tx+q.y*tz-q.z*ty,y:p.y+local.y+q.w*ty+q.z*tx-q.x*tz,z:p.z+local.z+q.w*tz+q.x*ty-q.y*tx};
}
/** Solver points precede pose integration. Rebuild each participant's physical
 * contact from collider-local witnesses before applying localized damage to the
 * new body pose. Keep the solver point for shared feedback/audio positioning. */
export function vehicleContactManifold(world:R.World,h1:number,h2:number){
 const collider1=world.getCollider(h1),collider2=world.getCollider(h2);if(!collider1||!collider2)return;
 let result:{point:Vec;point1:Vec;point2:Vec;normal:Vec}|undefined,strongest=-Infinity;
 world.contactPair(collider1,collider2,(manifold,flipped)=>{
  if(manifold.numSolverContacts()===0)return;
  let index=0;for(let i=1;i<manifold.numContacts();i++)if(manifold.contactImpulse(i)>manifold.contactImpulse(index))index=i;
  const impulse=manifold.numContacts()>0?manifold.contactImpulse(index):0;if(impulse<strongest)return;strongest=impulse;
  const point={...manifold.solverContactPoint(0)},local1=manifold.numContacts()===0?null:flipped?manifold.localContactPoint2(index):manifold.localContactPoint1(index),local2=manifold.numContacts()===0?null:flipped?manifold.localContactPoint1(index):manifold.localContactPoint2(index);
  result={point,point1:local1?colliderPoint(collider1,local1):point,point2:local2?colliderPoint(collider2,local2):point,normal:{...manifold.normal()}};
 });
 return result;
}
/** Resolve all compound pieces through their rigid body. Compound vehicles' many
 * shell contacts share one cooldown, rather than multiplying impact damage. */
export function vehicleContact<T extends ContactVehicle>(world:R.World,cars:readonly T[],h1:number,h2:number){
 const parent1=world.getCollider(h1)?.parent()?.handle,parent2=world.getCollider(h2)?.parent()?.handle;
 const a=parent1===undefined?undefined:cars.find(c=>c.body.handle===parent1),b=parent2===undefined?undefined:cars.find(c=>c.body.handle===parent2);
 // Preserve the established two-collider contact cadence for existing cars.
 // Open cargo shells, roll cages and fitted armor can contact several pieces.
 const compound=(a?.body.numColliders()??0)>2||(b?.body.numColliders()??0)>2;
 const k1=compound&&a?a.collider.handle:h1,k2=compound&&b?b.collider.handle:h2;
 return{a,b,key:Math.min(k1,k2)+':'+Math.max(k1,k2)};
}
