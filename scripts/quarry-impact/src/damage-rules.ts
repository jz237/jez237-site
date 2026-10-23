/** Collision severity for custom events. Cosmetic contact marks are independent. */
export const DAMAGE_RULES={
 normal:{label:'Standard damage',multiplier:1,description:'The original balance of crash damage and durability.'},
 reduced:{label:'Reduced damage',multiplier:.5,description:'Half the collision damage to body condition and components. Cars survive longer; every moving contact still leaves visible wear.'},
 severe:{label:'Severe damage',multiplier:2,description:'Double collision damage to body condition and components. Hard crashes can end a race quickly.'},
} as const;
export type DamageRule=keyof typeof DAMAGE_RULES;
export const isDamageRule=(v:unknown):v is DamageRule=>typeof v==='string'&&Object.hasOwn(DAMAGE_RULES,v);
export const readDamageRule=(v:unknown):DamageRule=>isDamageRule(v)?v:'normal';
/** Fixed challenges, championships, time trials and online retain their own balance. */
export function sessionDamageRule(custom:boolean,demo:boolean,solo:unknown,watch:unknown):DamageRule{
 return demo?readDamageRule(watch):custom?readDamageRule(solo):'normal';
}
export function collisionDamageMultiplier(race:boolean,rule:DamageRule):number{
 return (race?.45:1)*DAMAGE_RULES[rule].multiplier;
}
export function damageRecordKey(category:string,rule:DamageRule):string{
 return rule==='normal'?category:`${category}:damage:${rule}`;
}
/** Offline crashes hurt with speed: impulse-based damage is scaled by (closing speed / ref)^power, so a typical derby hit
 * (closing about ref) is unchanged, a slow shove does a fraction and a flat-out smash does several times as much, up to cap.
 * Online keeps the impulse-only balance. */
export const IMPACT_SPEED={ref:8.5,power:1.5,min:.35,max:4.5,cap:70} as const;
export function impactSpeedFactor(closing:number){
 const c=Math.max(0,Number.isFinite(closing)?closing:0);
 return Math.min(IMPACT_SPEED.max,Math.max(IMPACT_SPEED.min,(c/IMPACT_SPEED.ref)**IMPACT_SPEED.power));
}
/** Offline derbies give every car more power and more drive grip (derby arenas are loose: a rear-drive car was limited by
 * tyre grip to about 3.9 m/s² whatever its power), so there is room to build up speed for a hit inside an arena. Derby
 * results are scored, not timed, so no time records change. */
export const DERBY_PACE={power:1.45,traction:1.45} as const;
/** A smash: an offline hit that takes SMASH.health or more off a car the player is in. A short slow-motion beat, a toast with
 * the closing speed, the crowd. Crash sounds also grow heavier with closing speed (by the square root of impactSpeedFactor). */
export const SMASH={health:25,slowmo:.5,scale:.35} as const;
export const isSmash=(healthLoss:number)=>Number.isFinite(healthLoss)&&healthLoss>=SMASH.health;
export const smashLabel=(closing:number)=>`SMASH · ${Math.round(Math.max(0,Number.isFinite(closing)?closing:0)*3.6)} KM/H`;
export const impactSoundScale=(closing:number)=>Math.sqrt(impactSpeedFactor(closing));
/** A smash the player survives with their own car at HANGING_ON health or less (still running). */
export const HANGING_ON=20;
export const hangingOn=(playerHealth:number)=>Number.isFinite(playerHealth)&&playerHealth>0&&playerHealth<=HANGING_ON;
