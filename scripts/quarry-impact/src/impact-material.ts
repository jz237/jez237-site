import type R from '@dimforge/rapier3d-compat';
export type ImpactMaterial='metal'|'concrete'|'wood'|'rubber';
export const isImpactMaterial=(value:unknown):value is ImpactMaterial=>value==='metal'||value==='concrete'||value==='wood'||value==='rubber';
const colliderMaterials=new WeakMap<R.Collider,ImpactMaterial>();
/** Collider identity follows moved props and cannot leak to a reused physics handle. */
export function tagImpactMaterial(collider:R.Collider,material:ImpactMaterial){colliderMaterials.set(collider,material);}
export function quarryImpactMaterial(id:string):ImpactMaterial{
 if(id.startsWith('tree-'))return 'wood';
 if(id==='quarry-cliffs'||id.startsWith('arena-')||id.startsWith('ramp-')||id.startsWith('scanned-rock-')||id.startsWith('scree-'))return 'concrete';
 return 'metal';
}
/** Match authored fixed solids to the actual collider, never the tyre surface or nearest prop. */
export function colliderImpactMaterial(world:R.World,handle:number,records:unknown):ImpactMaterial{
 const collider=world.getCollider(handle);if(!collider)return 'metal';
 const tagged=colliderMaterials.get(collider);if(tagged)return tagged;
 if(!collider.parent()?.isFixed()||!Array.isArray(records))return 'metal';
 const p=collider.translation();
 const record=records.find(s=>s&&Math.abs(s.x-p.x)<.002&&Math.abs(s.y-p.y)<.002&&Math.abs(s.z-p.z)<.002);
 switch(record?.material){case 'timber':case 'wood':return 'wood';case 'concrete':case 'stripe':return 'concrete';case 'rubber':case 'tyre':return 'rubber';default:return 'metal';}
}
/** Shape the vehicle's crash layer while preserving glass/debris as distinct sounds. */
export function materialImpactProfile(material:ImpactMaterial){
 switch(material){
  case 'wood':return {gain:.8,rate:.82,duration:.68,lowpass:2200};
  case 'rubber':return {gain:.58,rate:.7,duration:.48,lowpass:850};
  case 'concrete':return {gain:1,rate:.92,duration:.85,lowpass:6500};
  default:return {gain:1,rate:1,duration:1};
 }
}
