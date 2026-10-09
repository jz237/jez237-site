import {DEFINITIONS,type CarKind} from './rules';
type Vec={x:number;y:number;z:number};
/** Front, rear, left, right, roof compression. Absent on legacy authorities. */
export const freshStructure=()=>[0,0,0,0,0];
export function validStructure(value:unknown):value is number[]{
 return Array.isArray(value)&&value.length===5&&value.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1);
}
/** Only inward, substantial blows compress structure; cosmetic scuffs remain separate. */
export function accumulateStructure(state:number[],kind:CarKind,point:Vec,direction:Vec,damage:number){
 if(!Number.isFinite(damage)||damage<=2||![point.x,point.y,point.z,direction.x,direction.y,direction.z].every(Number.isFinite))return;
 const length=Math.hypot(direction.x,direction.y,direction.z);if(length<1e-8)return;
 const d=DEFINITIONS[kind],x=direction.x/length,y=direction.y/length,z=direction.z/length;
 const edge=(p:number,span:number)=>Math.max(0,Math.min(1,(p/span-.3)/.45));
 const weights=[edge(point.z,d.halfLength)*Math.max(0,-z),edge(-point.z,d.halfLength)*Math.max(0,z),edge(-point.x,d.halfWidth)*Math.max(0,x),edge(point.x,d.halfWidth)*Math.max(0,-x),edge(point.y,kind==='trail'?1.1:kind==='shuttle'?1.6:kind==='van'?1.1:.7)*Math.max(0,-y)];
 for(let i=0;i<5;i++)state[i]=Math.min(1,state[i]+(damage-2)*.016*weights[i]);
}
