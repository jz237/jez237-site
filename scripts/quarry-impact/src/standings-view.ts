export type StandingRow={id:number;name:string;health:number;detail:string;player:boolean;followed:boolean};
export const STANDINGS_KEYS={Tab:'Tab',Backquote:'` / ~'} as const;
export const standingsKey=(value:unknown):keyof typeof STANDINGS_KEYS=>value==='Backquote'?'Backquote':'Tab';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
/** Keep the leaders and the local/followed driver visible without changing rank. */
export function visibleStandings(rows:readonly StandingRow[],expanded:boolean){
 const ranked=rows.map((row,index)=>({...row,rank:index+1}));if(expanded||rows.length<=4)return ranked;
 const focus=ranked.find(row=>row.followed)??ranked.find(row=>row.player);
 return focus&&focus.rank>4?[...ranked.slice(0,3),focus]:ranked.slice(0,4);
}
export function standingsTable(rows:readonly StandingRow[],expanded:boolean){
 return `<table class="standings-table"><caption class="sr-only">Current standings and vehicle condition</caption><thead><tr><th scope="col">Pos</th><th scope="col">Driver</th><th scope="col">Event</th><th scope="col">Car</th></tr></thead><tbody>${visibleStandings(rows,expanded).map(row=>`<tr class="${row.player?'standing-player ':''}${row.followed?'standing-followed ':''}${row.health<=0?'standing-wrecked':''}"><td>${row.rank}</td><th scope="row">${escape(row.name)}${row.player?' · YOU':''}${row.followed?' ◀':''}</th><td>${escape(row.detail)}</td><td>${row.health<=0?'WRECKED':Math.ceil(Math.max(0,Math.min(100,row.health)))+'%'}<span class="standing-condition" aria-hidden="true"><i style="width:${Math.max(0,Math.min(100,row.health))}%"></i></span></td></tr>`).join('')}</tbody></table>`;
}
