import {structuralDamage} from './bodywork-response';

export type ImpactContact={
 key:string;
 impulse:number;
 closing:number;
 /** Maximum damage scale among living cars in this contact; zero if none. */
 damageScale:number;
};
export type ImpactDecision<T extends ImpactContact>={contact:T;damage:number;feedback:boolean};
const cooldown=.28;

/** A compound contact is one impact, even when several rails report forces.
 * Feedback and health damage have separate clocks: a harmless tap may make a
 * sound, but it must not shield a car from the crash immediately behind it. */
export class ImpactAdjudicator{
 private damageTimes=new Map<string,number>();
 private feedbackTimes=new Map<string,number>();
 clear(){this.damageTimes.clear();this.feedbackTimes.clear();}
 /** Skip manifold extraction only while both kinds of response are cooling. */
 needsContact(key:string,time:number){
  return Number.isFinite(time)&&(time-(this.damageTimes.get(key)??-Infinity)>=cooldown||time-(this.feedbackTimes.get(key)??-Infinity)>=cooldown);
 }

 adjudicate<T extends ImpactContact>(contacts:Iterable<T>,time:number,damageMultiplier=1):ImpactDecision<T>[] {
  if(!Number.isFinite(time)||!Number.isFinite(damageMultiplier)||damageMultiplier<0)return[];
  const strongest=new Map<string,{contact:T;damage:number}>();
  for(const contact of contacts){
   if(!Number.isFinite(contact.impulse)||!Number.isFinite(contact.closing)||contact.closing<.65||contact.impulse<1500)continue;
   const damage=structuralDamage(contact.impulse,contact.closing)*damageMultiplier,previous=strongest.get(contact.key);
   if(!previous||damage>previous.damage||damage===previous.damage&&(contact.impulse>previous.contact.impulse||contact.impulse===previous.contact.impulse&&contact.closing>previous.contact.closing))strongest.set(contact.key,{contact,damage});
  }
  const result:ImpactDecision<T>[]=[];
  for(const {contact,damage} of strongest.values()){
   const feedback=time-(this.feedbackTimes.get(contact.key)??-Infinity)>=cooldown;
   const canDamage=Number.isFinite(contact.damageScale)&&contact.damageScale>0&&damage*contact.damageScale>=.1&&time-(this.damageTimes.get(contact.key)??-Infinity)>=cooldown;
   if(!feedback&&!canDamage)continue;
   if(feedback)this.feedbackTimes.set(contact.key,time);
   if(canDamage)this.damageTimes.set(contact.key,time);
   result.push({contact,damage:canDamage?damage:0,feedback});
  }
  return result;
 }
}
