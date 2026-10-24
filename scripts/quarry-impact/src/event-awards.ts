/** End-of-event awards: the biggest single hit, the most destructive driver and, for races,
 * the biggest climber (for derbies, the toughest survivor). Pure bookkeeping; the caller
 * reports hits and the starting order and supplies names when rendering. */
/** A FASTEST HIT card needs a hit of at least FASTEST_HIT.min m/s closing speed. */
export const FASTEST_HIT={min:10} as const;
export type AwardCar={id:number;inflicted:number;health:number;
 /** Major parts the car has lost (bumpers, bonnet, boot, doors, wings), when known. */
 partsGone?:number};
/** failure: a car's own mechanical failure (attacker = victim = that car), captioned by `label`. */
export type EventMoment={kind:'hit'|'takedown'|'wheel'|'fire'|'failure';attacker:number;victim:number;time:number;score:number;label?:string};
export type EventAward={key:'hit'|'fastest'|'destroyer'|'takedowns'|'climber'|'toughest'|'nemesis'|'wheels'|'scrap'|'firestarter'|'roller'|'standing'|'pinner'|'slammer';title:string;id:number;detail:string;victim?:number;value:number};
/** STILL STANDING goes to a car that finishes still running with at least this many major parts gone. */
export const STILL_STANDING=5;
/** Counted pins it takes to be PIN MASTER. */
export const PIN_MASTER=2;
export class EventAwards{
 private biggest:{attacker:number;victim:number;damage:number;time:number}|null=null;
 /** The fastest damaging hit (closing speed, m/s). */
 private fastest:{attacker:number;victim:number;speed:number}|null=null;
 private start:number[]|null=null;
 private takedowns=new Map<number,number>();
 private dealt=new Map<string,number>();
 private stripping=new Map<number,{wheels:number;parts:number}>();
 private moments:EventMoment[]=[];
 private puddles=new Map<number,number>();
 private alight=new Map<number,number>();
 private rolls=new Map<number,number>();
 private pins=new Map<number,number>();
 private slams=new Map<number,number>();
 reset(){this.biggest=null;this.fastest=null;this.start=null;this.takedowns.clear();this.dealt.clear();this.stripping.clear();this.moments=[];this.puddles.clear();this.alight.clear();this.rolls.clear();this.pins.clear();this.slams.clear();}
 /** A puddle of oil or fuel caught from this car's sparks or flames (spread included). */
 ignited(owner:number){if(Number.isInteger(owner)&&owner>=0)this.puddles.set(owner,(this.puddles.get(owner)??0)+1);}
 /** Flames lit by the attacker set the victim alight: a highlight and the firestarter's best credit. */
 setAlight(attacker:number,victim:number,time=0){
  if(!Number.isInteger(attacker)||attacker<0||attacker===victim)return;
  this.alight.set(attacker,(this.alight.get(attacker)??0)+1);this.moments.push({kind:'fire',attacker,victim,time:Number.isFinite(time)?time:0,score:34});
 }
 /** The attacker rolled the victim onto its roof: a highlight and the roll master's credit. */
 rolled(attacker:number,victim:number,time=0){
  if(!Number.isInteger(attacker)||attacker<0||attacker===victim)return;
  this.rolls.set(attacker,(this.rolls.get(attacker)??0)+1);this.moments.push({kind:'hit',attacker,victim,time:Number.isFinite(time)?time:0,score:32,label:'ROLLOVER'});
 }
 /** The attacker pinned the victim against a wall or another car (a counted pin): a highlight and the pin master's credit. */
 pinned(attacker:number,victim:number,time=0){
  if(!Number.isInteger(attacker)||attacker<0||attacker===victim)return;
  this.pins.set(attacker,(this.pins.get(attacker)??0)+1);this.moments.push({kind:'hit',attacker,victim,time:Number.isFinite(time)?time:0,score:28,label:'PINNED'});
 }
 /** The attacker knocked the victim into the wall hard (a WALL SLAM): a highlight and the wall slammer's credit. */
 slammed(attacker:number,victim:number,time=0){
  if(!Number.isInteger(attacker)||attacker<0||attacker===victim)return;
  this.slams.set(attacker,(this.slams.get(attacker)??0)+1);this.moments.push({kind:'hit',attacker,victim,time:Number.isFinite(time)?time:0,score:30,label:'WALL SLAM'});
 }
 /** A pile-up the starter set off: a highlight on its own (the bigger, the better). */
 pileUp(starter:number,size:number,time=0){
  if(!Number.isInteger(starter)||starter<0||!(size>=2))return;
  this.moments.push({kind:'hit',attacker:starter,victim:starter,time:Number.isFinite(time)?time:0,score:Math.min(40,24+2*size),label:`PILE-UP ×${Math.floor(size)}`});
 }
 /** A dramatic mechanical failure (a seized engine, a diff letting go, a brake fire) is a highlight moment of its own. */
 failure(car:number,label:string,time=0,score=26){
  if(!Number.isInteger(car)||car<0||!label)return;
  this.moments.push({kind:'failure',attacker:car,victim:car,time:Number.isFinite(time)?time:0,score:Number.isFinite(score)?score:26,label});
 }
 firesBy(id:number){return{puddles:this.puddles.get(id)??0,cars:this.alight.get(id)??0};}
 /** The most spectacular moments for a highlights reel: best first by score, at most `max`, at least
  * two seconds apart, then in the order they happened. */
 highlights(max=5){const out:EventMoment[]=[];for(const m of [...this.moments].sort((a,b)=>b.score-a.score||a.time-b.time)){if(out.length>=max)break;if(out.every(o=>Math.abs(o.time-m.time)>=2))out.push(m);}return out.sort((a,b)=>a.time-b.time).map(m=>({...m}));}
 /** Credit the attacker for wheels torn off and parts knocked off the victim by one hit. */
 stripped(attacker:number,victim:number,wheels:number,parts:number,time=0){
  if(attacker===victim||!(wheels>0||parts>0))return;
  if(wheels>0)this.moments.push({kind:'wheel',attacker,victim,time:Number.isFinite(time)?time:0,score:28+wheels*4});
  const s=this.stripping.get(attacker)??{wheels:0,parts:0};s.wheels+=Math.max(0,Math.floor(wheels));s.parts+=Math.max(0,Math.floor(parts));this.stripping.set(attacker,s);
 }
 strippedBy(id:number){return{...(this.stripping.get(id)??{wheels:0,parts:0})};}
 /** Returns true when this hit wrecked the victim (a takedown). speed: the hit's closing speed (m/s), for FASTEST HIT. */
 hit(attacker:number,victim:number,damage:number,wrecked=false,time=0,speed=0){
  if(!(damage>0)||!Number.isFinite(damage)||attacker===victim)return false;
  if(Number.isFinite(speed)&&speed>(this.fastest?.speed??0))this.fastest={attacker,victim,speed};
  if(wrecked)this.takedowns.set(attacker,(this.takedowns.get(attacker)??0)+1);
  const pair=attacker+'>'+victim;this.dealt.set(pair,(this.dealt.get(pair)??0)+damage);
  if(!this.biggest||damage>this.biggest.damage)this.biggest={attacker,victim,damage,time:Number.isFinite(time)?time:0};
  if(wrecked||damage>=10)this.moments.push({kind:wrecked?'takedown':'hit',attacker,victim,time:Number.isFinite(time)?time:0,score:(wrecked?30:0)+damage});
  return wrecked;
 }
 takedownsFor(id:number){return this.takedowns.get(id)??0;}
 /** Live rival: the opponent who has dealt the given driver the most damage so far (5+). */
 rivalOf(playerId:number){let id=-1,most=0;for(const [pair,damage] of this.dealt){const [a,v]=pair.split('>').map(Number);if(v===playerId&&a!==playerId&&(damage>most||(damage===most&&a<id))){id=a;most=damage;}}return most>=5?{id,damage:most}:null;}
 /** The single biggest impact so far (for the replay shortcut on results). */
 get biggestHit(){return this.biggest?{...this.biggest}:null;}
 /** Starting order (car ids, leader first); only the first call counts. */
 grid(order:readonly number[]){if(!this.start&&order.length)this.start=[...order];}
 get started(){return this.start!==null;}
 awards(mode:'race'|'derby'|string,cars:readonly AwardCar[],finishOrder:readonly number[]=[]):EventAward[]{
  const out:EventAward[]=[];
  if(this.biggest&&this.biggest.damage>=1)out.push({key:'hit',title:'BIGGEST HIT',id:this.biggest.attacker,victim:this.biggest.victim,value:this.biggest.damage,detail:`${Math.round(this.biggest.damage)} damage in one impact`});
  if(this.fastest&&this.fastest.speed>=FASTEST_HIT.min)out.push({key:'fastest',title:'FASTEST HIT',id:this.fastest.attacker,victim:this.fastest.victim,value:this.fastest.speed,detail:`${Math.round(this.fastest.speed*3.6)} km/h impact`});
  const destroyer=[...cars].sort((a,b)=>b.inflicted-a.inflicted||a.id-b.id)[0];
  if(destroyer&&destroyer.inflicted>=1)out.push({key:'destroyer',title:'MOST DESTRUCTIVE',id:destroyer.id,value:destroyer.inflicted,detail:`${Math.round(destroyer.inflicted)} damage dealt`});
  const taker=[...this.takedowns].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0];
  if(taker)out.push({key:'takedowns',title:'MOST TAKEDOWNS',id:taker[0],value:taker[1],detail:`${taker[1]} ${taker[1]===1?'car':'cars'} wrecked`});
  const best=(key:'wheels'|'parts')=>[...this.stripping].filter(([,s])=>s[key]>0).sort((a,b)=>b[1][key]-a[1][key]||a[0]-b[0])[0];
  const snatcher=best('wheels');if(snatcher)out.push({key:'wheels',title:'WHEEL SNATCHER',id:snatcher[0],value:snatcher[1].wheels,detail:`${snatcher[1].wheels} ${snatcher[1].wheels===1?'wheel':'wheels'} torn off`});
  const scrap=best('parts');if(scrap&&scrap[1].parts>=3)out.push({key:'scrap',title:'SCRAP MERCHANT',id:scrap[0],value:scrap[1].parts,detail:`${scrap[1].parts} parts knocked off`});
  // Cars set alight count far more than puddles lit.
  const fire=[...new Set([...this.puddles.keys(),...this.alight.keys()])].map(id=>({id,...this.firesBy(id)})).filter(f=>f.cars>0||f.puddles>=3).sort((a,b)=>b.cars-a.cars||b.puddles-a.puddles||a.id-b.id)[0];
  const roller=[...this.rolls].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0];
  if(roller)out.push({key:'roller',title:'ROLL MASTER',id:roller[0],value:roller[1],detail:`rolled ${roller[1]} ${roller[1]===1?'car':'cars'}`});
  // Pins take two to count as a speciality; one good wall slam is worth its own award.
  const pinner=[...this.pins].filter(([,n])=>n>=PIN_MASTER).sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0];
  if(pinner)out.push({key:'pinner',title:'PIN MASTER',id:pinner[0],value:pinner[1],detail:`pinned ${pinner[1]} cars`});
  const slammer=[...this.slams].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0];
  if(slammer)out.push({key:'slammer',title:'WALL SLAMMER',id:slammer[0],value:slammer[1],detail:`slammed ${slammer[1]} ${slammer[1]===1?'car':'cars'} into the wall`});
  if(fire)out.push({key:'firestarter',title:'FIRESTARTER',id:fire.id,value:fire.cars*10+fire.puddles,detail:fire.cars?`set ${fire.cars} ${fire.cars===1?'car':'cars'} alight · ${fire.puddles} puddles lit`:`${fire.puddles} puddles lit`});
  // Still running with the most of itself gone (at least STILL_STANDING parts).
  const standing=[...cars].filter(c=>c.health>0&&(c.partsGone??0)>=STILL_STANDING).sort((a,b)=>(b.partsGone??0)-(a.partsGone??0)||a.id-b.id)[0];
  if(standing)out.push({key:'standing',title:'STILL STANDING',id:standing.id,value:standing.partsGone!,detail:`finished with ${standing.partsGone} parts gone`});
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
 /** The opponent who dealt the given driver the most damage, and whether they got even:
  * finished ahead of it (races), outlasted it (derbies) or wrecked it. */
 nemesis(playerId:number,cars:readonly AwardCar[],mode:string,finishOrder:readonly number[]=[]):EventAward|null{
  let id=-1,most=0;for(const [pair,damage] of this.dealt){const [a,v]=pair.split('>').map(Number);if(v===playerId&&a!==playerId&&(damage>most||(damage===most&&a<id))){id=a;most=damage;}}
  if(most<5)return null;
  const me=cars.find(c=>c.id===playerId),them=cars.find(c=>c.id===id);if(!them)return null;
  const wrecked=them.health<=0&&(me?.health??0)>0,ahead=mode==='race'&&finishOrder.indexOf(playerId)>=0&&finishOrder.indexOf(playerId)<finishOrder.indexOf(id);
  const even=wrecked||ahead||(mode==='derby'&&(me?.health??0)>0&&them.health<=0);
  return{key:'nemesis',title:even?'NEMESIS · REVENGE TAKEN':'NEMESIS',id,value:most,detail:`dealt you ${Math.round(most)} damage${even?wrecked?' · you outlasted them':' · you finished ahead':''}`};
 }
}
const escapeText=(s:string)=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!));
/** Award cards for the results dialog; the player's own awards are highlighted. */
export function awardsHtml(list:readonly EventAward[],name:(id:number)=>string,playerId=0){
 if(!list.length)return '';
 return `<div class="event-awards" aria-label="Event awards">${list.map(a=>`<div class="event-award${a.id===playerId?' event-award-you':''}" data-award="${a.key}"><span class="eyebrow">${a.title}</span><b>${escapeText(a.id===playerId?'YOU':name(a.id))}</b><small>${escapeText(a.detail)}${a.victim!==undefined?' · on '+escapeText(a.victim===playerId?'you':name(a.victim)):''}</small></div>`).join('')}</div>`;
}
