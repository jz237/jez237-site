/** End-of-event awards: the biggest single hit, the most destructive driver and, for races,
 * the biggest climber (for derbies, the toughest survivor). Pure bookkeeping; the caller
 * reports hits and the starting order and supplies names when rendering. */
export type AwardCar={id:number;inflicted:number;health:number};
export type EventAward={key:'hit'|'destroyer'|'takedowns'|'climber'|'toughest';title:string;id:number;detail:string;victim?:number;value:number};
export class EventAwards{
 private biggest:{attacker:number;victim:number;damage:number}|null=null;
 private start:number[]|null=null;
 private takedowns=new Map<number,number>();
 reset(){this.biggest=null;this.start=null;this.takedowns.clear();}
 /** Returns true when this hit wrecked the victim (a takedown). */
 hit(attacker:number,victim:number,damage:number,wrecked=false){
  if(!(damage>0)||!Number.isFinite(damage)||attacker===victim)return false;
  if(wrecked)this.takedowns.set(attacker,(this.takedowns.get(attacker)??0)+1);
  if(!this.biggest||damage>this.biggest.damage)this.biggest={attacker,victim,damage};
  return wrecked;
 }
 takedownsFor(id:number){return this.takedowns.get(id)??0;}
 /** Starting order (car ids, leader first); only the first call counts. */
 grid(order:readonly number[]){if(!this.start&&order.length)this.start=[...order];}
 get started(){return this.start!==null;}
 awards(mode:'race'|'derby'|string,cars:readonly AwardCar[],finishOrder:readonly number[]=[]):EventAward[]{
  const out:EventAward[]=[];
  if(this.biggest&&this.biggest.damage>=1)out.push({key:'hit',title:'BIGGEST HIT',id:this.biggest.attacker,victim:this.biggest.victim,value:this.biggest.damage,detail:`${Math.round(this.biggest.damage)} damage in one impact`});
  const destroyer=[...cars].sort((a,b)=>b.inflicted-a.inflicted||a.id-b.id)[0];
  if(destroyer&&destroyer.inflicted>=1)out.push({key:'destroyer',title:'MOST DESTRUCTIVE',id:destroyer.id,value:destroyer.inflicted,detail:`${Math.round(destroyer.inflicted)} damage dealt`});
  const taker=[...this.takedowns].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0];
  if(taker)out.push({key:'takedowns',title:'MOST TAKEDOWNS',id:taker[0],value:taker[1],detail:`${taker[1]} ${taker[1]===1?'car':'cars'} wrecked`});
  if(mode==='race'&&this.start&&finishOrder.length){
   let bestId=-1,bestGain=0;
   finishOrder.forEach((id,place)=>{const from=this.start!.indexOf(id),gain=from<0?0:from-place;if(gain>bestGain||(gain===bestGain&&gain>0&&id<bestId)){bestId=id;bestGain=gain;}});
   if(bestGain>0)out.push({key:'climber',title:'BIGGEST CLIMBER',id:bestId,value:bestGain,detail:`up ${bestGain} ${bestGain===1?'place':'places'} from the start`});
  }
  if(mode==='derby'){
   const tough=[...cars].filter(c=>c.health>0).sort((a,b)=>b.health-a.health||a.id-b.id)[0];
   if(tough)out.push({key:'toughest',title:'TOUGHEST',id:tough.id,value:tough.health,detail:`${Math.ceil(tough.health)}% condition left`});
  }
  return out;
 }
}
const escapeText=(s:string)=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!));
/** Award cards for the results dialog; the player's own awards are highlighted. */
export function awardsHtml(list:readonly EventAward[],name:(id:number)=>string,playerId=0){
 if(!list.length)return '';
 return `<div class="event-awards" aria-label="Event awards">${list.map(a=>`<div class="event-award${a.id===playerId?' event-award-you':''}" data-award="${a.key}"><span class="eyebrow">${a.title}</span><b>${escapeText(a.id===playerId?'YOU':name(a.id))}</b><small>${escapeText(a.detail)}${a.victim!==undefined?' · on '+escapeText(a.victim===playerId?'you':name(a.victim)):''}</small></div>`).join('')}</div>`;
}
