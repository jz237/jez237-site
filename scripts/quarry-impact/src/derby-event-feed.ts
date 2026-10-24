import type {CombatRecord} from './event-rules';
export type DerbyFeedDriver={id:number;name:string;record:CombatRecord};
export type DerbyFeedEntry={id:number;driver:number;name:string;kind:'massive'|'rival'|'spin'|'spin180'|'spin360'|'knockout'|LocalFeedKind;count:number;time:number};
/** Offline moments the feed is told about directly. */
export type LocalFeedKind='wheel'|'wing'|'engine'|'pit'|'rolled'|'door'|'stripped'|'burnt'|'pinned'|'slam'|'pileup'|'domino'|'tank'|'dry'|'sandwich'|'ripped'|'boom';
const labels={massive:'MASSIVE HIT',rival:'RIVAL HIT',spin:'90° SPIN ★',spin180:'180° SPIN ★★',spin360:'360° SPIN ★★★',knockout:'KNOCKOUT',wheel:'WHEEL OFF',wing:'WING OFF',engine:'ENGINE OUT',pit:'PIT',rolled:'ROLLED',door:'DOOR OFF',stripped:'STRIPPED',burnt:'BURNT OUT',pinned:'PINNED',slam:'WALL SLAM',pileup:'PILE-UP',domino:'DOMINO',tank:'TANK DOWN',dry:'RAN DRY',sandwich:'SANDWICH',ripped:'BUMPER RIPPED',boom:'BLEW UP'} as const;
const counts=(r:CombatRecord)=>({massive:r.impacts?.[2]??0,rival:r.rivalHits??0,spin:r.spins??0,spin180:r.spins180??0,spin360:r.spins360??0,knockout:r.knockouts});
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
/** Observe cumulative awarded counters, never infer awards from vehicle damage.
 * Baseline on entry/reconnect; batched snapshots retain multiple earned events. */
export class DerbyEventFeed{
 private previous=new Map<number,ReturnType<typeof counts>>();private entries:DerbyFeedEntry[]=[];private sequence=0;private time=-Infinity;private ready=false;
 reset(){this.previous.clear();this.entries=[];this.sequence=0;this.time=-Infinity;this.ready=false;}
 observe(drivers:readonly DerbyFeedDriver[],time:number){
  if(!Number.isFinite(time)||time<0)return;
  if(time<this.time)this.reset();this.time=time;
  const seen=new Set<number>();
  for(const driver of drivers){seen.add(driver.id);const current=counts(driver.record),before=this.previous.get(driver.id);
   if(this.ready&&before)for(const kind of ['massive','rival','spin','spin180','spin360','knockout']as const){const delta=current[kind]-before[kind];if(Number.isInteger(delta)&&delta>0)this.entries.push({id:++this.sequence,driver:driver.id,name:driver.name,kind,count:delta,time});}
   this.previous.set(driver.id,current);
  }
  for(const id of this.previous.keys())if(!seen.has(id))this.previous.delete(id);
  this.ready=true;this.entries=this.entries.filter(entry=>time-entry.time<8).slice(-4);
 }
 /** Local (offline-only) moments that no combat counter carries: a wheel or wing torn off, an engine dropped out, a PIT. */
 /** A repeat of the same moment by the same driver while its line is still up adds to that line (×N) and brings it back to the
  * top, rather than filling the feed; a pile-up's count is its size, so each pile-up keeps a line of its own. */
 note(driver:number,name:string,kind:LocalFeedKind,time:number,count=1){
  if(!Number.isFinite(time)||time<0)return;
  const n=Number.isFinite(count)&&count>1?Math.floor(count):1,same=kind==='pileup'?undefined:this.entries.find(entry=>entry.driver===driver&&entry.kind===kind&&time-entry.time<8&&time>=entry.time);
  if(same){same.count+=n;same.time=time;same.id=++this.sequence;this.entries=[...this.entries.filter(entry=>entry!==same),same];}
  else this.entries.push({id:++this.sequence,driver,name,kind,count:n,time});
  this.entries=this.entries.filter(entry=>time-entry.time<8).slice(-4);
 }
 visible(time:number){return this.entries.filter(entry=>time>=entry.time&&time-entry.time<8).slice().reverse().map(entry=>({...entry}));}
}
export function derbyFeedMarkup(entries:readonly DerbyFeedEntry[],followed:number){return entries.map(entry=>`<li class="${entry.driver===followed?'feed-followed':''}"><strong>${labels[entry.kind]}${entry.count>1?' ×'+entry.count:''}</strong><span>${escape(entry.name)}</span></li>`).join('');}
