export type ScrapeContact={key:string;a?:{id:number};b?:{id:number};impulse:number;speed:number;closing:number};
/** Sustained environmental contact, independent of health and impact cooldowns.
 * Physics submits one complete frame at a time. A tap is an impact; tangential
 * motion lasting 80 ms becomes a scrape. The audio mixer smooths its gain. */
export class ContactScraping{
 private pairs=new Map<string,{since:number;last:number}>();
 private levels=new Map<number,number>();
 private time=-Infinity;
 clear(){this.pairs.clear();this.levels.clear();this.time=-Infinity;}
 /** Replace, rather than accumulate, authoritative levels; absent legacy data is silence. */
 receive(cars:Iterable<{id:number;contactScrape?:number}>){
  this.clear();
  for(const car of cars)if(Number.isInteger(car.id)&&car.id>=0&&typeof car.contactScrape==='number'&&Number.isFinite(car.contactScrape)&&car.contactScrape>0&&car.contactScrape<=1)this.levels.set(car.id,car.contactScrape);
 }
 level(id:number){return this.levels.get(id)??0;}
 sample(contacts:Iterable<ScrapeContact>,time:number){
  if(!Number.isFinite(time)){this.clear();return;}
  if(time<this.time)this.clear();
  this.time=time;this.levels.clear();
  const strongest=new Map<string,{id:number;level:number}>();
  for(const c of contacts){
   if(!!c.a===!!c.b||![c.impulse,c.speed,c.closing].every(Number.isFinite)||c.impulse<=0||c.speed<0||c.closing<0)continue;
   const tangent=Math.sqrt(Math.max(0,c.speed*c.speed-c.closing*c.closing));if(tangent<.5)continue;
   const id=(c.a??c.b)!.id,level=Math.min(1,tangent/12)*Math.min(1,c.impulse/200),old=strongest.get(c.key);
   if(!old||level>old.level)strongest.set(c.key,{id,level});
  }
  for(const[key,{id,level}]of strongest){
   let pair=this.pairs.get(key);
   if(!pair||time-pair.last>1/30+1e-6)pair={since:time,last:time};
   pair.last=time;this.pairs.set(key,pair);
   const onset=Math.max(0,Math.min(1,(time-pair.since-.08)/.12));
   if(onset>0)this.levels.set(id,Math.max(this.level(id),level*onset));
  }
  for(const[key,pair]of this.pairs)if(time-pair.last>1/30+1e-6)this.pairs.delete(key);
 }
}
