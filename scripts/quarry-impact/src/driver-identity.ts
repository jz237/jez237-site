import {DEFINITIONS,type CarKind} from './rules';
/** Slots stay zero-based internally; every player-facing car number is one-based. */
export function driverLabel(car:{id:number;kind:CarKind},members:readonly {id:number;name:string;connected:boolean}[]=[]):string{
 const member=members.find(m=>m.id===car.id&&m.connected);
 return member?`${member.name} · #${car.id+1}`:`${DEFINITIONS[car.kind].name} #${car.id+1}`;
}
/** Results are HTML; standings/feed escape their own plain-text labels. */
export function resultDriverLabel(label:string,player:boolean):string{
 const text=label+(player?' · YOU':'');
 return text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
}
