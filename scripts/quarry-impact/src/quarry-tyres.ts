import type R from '@dimforge/rapier3d-compat';
import {terrainHeight} from './rules';
import {tagImpactMaterial} from './impact-material';
/** Stable append-only IDs preserve the original barrel prefix in recordings. */
export const LEGACY_QUARRY_PROPS=22;
export const QUARRY_TYRES=Array.from({length:12},(_,i)=>{const x=51+(i%3)*1.7,z=-10+Math.floor(i/3)*1.7;return{id:LEGACY_QUARRY_PROPS+i,x,y:terrainHeight(x,z)+.22,z};});
export function createQuarryTyres(api:typeof R,world:R.World){
 return QUARRY_TYRES.map(p=>{
  const body=world.createRigidBody(api.RigidBodyDesc.dynamic().setTranslation(p.x,p.y,p.z).setLinearDamping(.12).setAngularDamping(.18).setCcdEnabled(true));
  // Twelve rubber segments retain the hole and allow knocked tyres to tumble.
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const collider=world.createCollider(api.ColliderDesc.cuboid(.14,.14,.12).setTranslation(Math.cos(a)*.44,0,Math.sin(a)*.44).setRotation({x:0,y:Math.sin(-a/2),z:0,w:Math.cos(a/2)}).setMass(1).setFriction(.95).setRestitution(.25),body);tagImpactMaterial(collider,'rubber');}
  return{id:p.id,body,start:{x:p.x,y:p.y,z:p.z}};
 });
}
export function quarryReplayProps<T>(props:readonly T[],count:number):readonly T[]{
 if(count===props.length)return props;
 if(count===LEGACY_QUARRY_PROPS&&props.length===LEGACY_QUARRY_PROPS+QUARRY_TYRES.length)return props.slice(0,count);
 throw Error('This replay uses an unsupported course prop layout.');
}
