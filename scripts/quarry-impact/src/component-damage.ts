import {isClassicKind,classicWheelAnchors} from './classic-vehicle-specs';
import anchors from './vehicle-damage-anchors.json';
import type {CarKind} from './rules';
import {bodyworkDentDamage} from './bodywork-response';
export type DamageVector={x:number;y:number;z:number};
export type ComponentDamage={wheelDamage:number[];wheelShift:DamageVector[]};
export const freshComponents=():ComponentDamage=>({wheelDamage:[0,0,0,0],wheelShift:Array.from({length:4},()=>({x:0,y:0,z:0}))});
const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
/** Authored model-space contact, shared with the rendered attachments. */
export function damageWheels(damage:ArrayLike<number>&{[n:number]:number},shift:DamageVector[],rest:readonly DamageVector[],point:DamageVector,direction:DamageVector,amount:number){
  for(let i=0;i<4;i++){
    const w=rest[i],distance=Math.hypot(point.x-w.x,(point.y-w.y)*.6,point.z-w.z);
    const hit=amount*Math.max(0,1-distance/1.45);
    damage[i]=Math.fround(Math.min(1,damage[i]+hit/30));
    shift[i].x=clamp(shift[i].x+direction.x*hit*.011,-.18,.18);
    shift[i].y=0;shift[i].z=clamp(shift[i].z+direction.z*hit*.011,-.24,.24);
  }
}
/** Stored impacts are body-local; authored wheel anchors are model-local. */
export function applyComponentImpact(state:ComponentDamage,kind:CarKind,point:DamageVector,direction:DamageVector,damage:number){
  const model=isClassicKind(kind)?classicWheelAnchors(kind):anchors[kind],length=Math.hypot(direction.x,direction.y,direction.z)||1;
  damageWheels(state.wheelDamage,state.wheelShift,model.wheels,{x:point.x,y:point.y+model.modelOffset,z:point.z},
    {x:direction.x/length,y:direction.y/length,z:direction.z/length},bodyworkDentDamage(damage));
}
export function validComponents(value:unknown):value is ComponentDamage{
  const c=value as ComponentDamage,finite=(n:unknown):n is number=>typeof n==='number'&&Number.isFinite(n);
  return !!c&&Array.isArray(c.wheelDamage)&&c.wheelDamage.length===4&&c.wheelDamage.every(d=>finite(d)&&d>=0&&d<=1)&&
    Array.isArray(c.wheelShift)&&c.wheelShift.length===4&&c.wheelShift.every(v=>v&&finite(v.x)&&Math.abs(v.x)<=.18&&v.y===0&&finite(v.z)&&Math.abs(v.z)<=.24);
}
