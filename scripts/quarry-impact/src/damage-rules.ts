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
