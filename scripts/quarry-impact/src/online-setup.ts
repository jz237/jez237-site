import {DEFINITIONS,type CarKind} from './rules';
import type {PhysicsTuning} from './vehicle-physics';
/** Bounded performance/paint data only. Clients never supply derived physics coefficients. */
export type OnlineSetup=PhysicsTuning&{paint:number;trim:number};
export type OnlineLoadout={kind:CarKind;setup:OnlineSetup};
export type SetupRule='open'|'stock';
const fields=['gearing','suspension','steering','brakeBias','differential']as const;
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finite=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
export function validOnlineSetup(v:unknown):v is OnlineSetup{
 if(!object(v)||!object(v.tune))return false;
 return ['engine','tires','armor'].every(k=>Number.isInteger(v[k])&&finite(v[k],0,3))&&
  ['paint','trim'].every(k=>Number.isInteger(v[k])&&finite(v[k],0,0xffffff))&&fields.every(k=>finite((v.tune as Record<string,unknown>)[k],-1,1));
}
export function validOnlineLoadout(v:unknown):v is OnlineLoadout{return object(v)&&['coupe','sedan','hatch'].includes(String(v.kind))&&validOnlineSetup(v.setup);}
/** Copy only allowlisted fields; garage decals and untrusted extra coefficients stay out. */
export function copyOnlineSetup(s:OnlineSetup):OnlineSetup{return{paint:s.paint,trim:s.trim,engine:s.engine,tires:s.tires,armor:s.armor,tune:{gearing:s.tune.gearing,suspension:s.tune.suspension,steering:s.tune.steering,brakeBias:s.tune.brakeBias,differential:s.tune.differential}};}
export function stockOnlineSetup(kind:CarKind):OnlineSetup{return{paint:DEFINITIONS[kind].color,trim:0x202529,engine:0,tires:0,armor:0,tune:{gearing:0,suspension:0,steering:0,brakeBias:0,differential:0}};}
export function effectiveOnlineSetup(kind:CarKind,setup:OnlineSetup,rule:SetupRule):OnlineSetup{return rule==='stock'?{...stockOnlineSetup(kind),paint:setup.paint,trim:setup.trim}:copyOnlineSetup(setup);}
export function sameOnlineSetup(a:OnlineSetup|undefined,b:OnlineSetup|undefined,kind:CarKind){return JSON.stringify(copyOnlineSetup(a??stockOnlineSetup(kind)))===JSON.stringify(copyOnlineSetup(b??stockOnlineSetup(kind)));}
