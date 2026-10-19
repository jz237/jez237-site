import {DEFINITIONS,type CarKind} from './rules';
import {validStructure} from './structural-damage';
type Vec={x:number;y:number;z:number};
/** Incoming damage is still unarmored here. A crushed section gradually loses
 * its armor bonus; an intact section keeps its full configured protection.
 * Apply only to new physical contacts, never to already-recorded replay hits. */
export function armorWearMultiplier(kind:CarKind,structure:unknown,point:Vec,direction:Vec,damageScale:number){
 if(!validStructure(structure)||!Number.isFinite(damageScale)||damageScale<=0||damageScale>=1||![point.x,point.y,point.z,direction.x,direction.y,direction.z].every(Number.isFinite))return 1;
 const length=Math.hypot(direction.x,direction.y,direction.z);if(length<1e-8)return 1;
 const d=DEFINITIONS[kind],edge=(p:number,span:number)=>Math.max(0,Math.min(1,(p/span-.3)/.45));
 const x=direction.x/length,y=direction.y/length,z=direction.z/length;
 const weights=[edge(point.z,d.halfLength)*Math.max(0,-z),edge(-point.z,d.halfLength)*Math.max(0,z),edge(-point.x,d.halfWidth)*Math.max(0,x),edge(point.x,d.halfWidth)*Math.max(0,-x),edge(point.y,kind==='trail'?1.1:kind==='shuttle'?1.6:kind==='van'?1.1:kind==='cornet'?1.55:kind==='hollins'?.91:.7)*Math.max(0,-y)];
 const sum=weights.reduce((a,b)=>a+b,0);if(sum<1e-8)return 1;
 const wear=weights.reduce((a,w,i)=>a+w*Math.max(0,(structure[i]-.35)/.65),0)/sum;
 return 1+(1/damageScale-1)*wear;
}
/** Only highlight substantially weakened sectors, not cosmetic scratches. */
export function armorWearWarning(armor:number,structure:unknown){
 if(armor<=0||!validStructure(structure))return '';
 const names=['FRONT','REAR','LEFT','RIGHT','ROOF'];
 const worn=names.filter((_,i)=>structure[i]>=.7);return worn.length?'ARMOR WEAK: '+worn.join(' / '):'';
}
