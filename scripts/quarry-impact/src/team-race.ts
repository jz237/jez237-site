import type {EventOptions} from './event-rules';
/** Team races: a custom lap race split into Red and Blue by grid slot (the player's slot 0 is
 * Red). Every car still running or finished scores field − place points for its team (last
 * classified car scores 1, wrecks score nothing), so the whole team's finish matters. */
export type Team=0|1;
export const TEAMS=[{name:'RED',color:0xc4352b,trim:0x2a1210,css:'#ff6a5c'},{name:'BLUE',color:0x2a64c8,trim:0x0f1a2e,css:'#6fa2ff'}] as const;
export function teamRaceActive(mode:string,custom:boolean,demo:boolean,format:string,event:Pick<EventOptions,'teams'|'elimination'|'raceDuration'>,options:Pick<EventOptions,'teams'|'elimination'|'raceDuration'>):boolean{
 const o=demo?options:event;return mode==='race'&&custom&&format==='laps'&&o.teams===true&&!o.elimination&&!o.raceDuration;
}
export const teamOf=(slot:number):Team=>(slot%2) as Team;
export type TeamEntry={slot:number;scores:boolean};
/** Points per team for a race order (best first). */
export function teamScores(order:readonly TeamEntry[]):[number,number]{
 const field=order.length,score:[number,number]=[0,0];
 order.forEach((car,place)=>{if(car.scores)score[teamOf(car.slot)]+=field-place;});
 return score;
}
export function teamLine(score:readonly [number,number],player?:Team){
 return `TEAM RACE · RED ${score[0]} · BLUE ${score[1]}`+(player===undefined?'':` · YOU: ${TEAMS[player].name}`);
}
export function teamVerdict(score:readonly [number,number],player?:Team){
 if(score[0]===score[1])return`TEAMS TIED · ${score[0]}–${score[1]}`;
 const winner:Team=score[0]>score[1]?0:1,margin=`${Math.max(...score)}–${Math.min(...score)}`;
 return player===undefined?`${TEAMS[winner].name} TEAM WINS · ${margin}`:`${player===winner?'YOUR TEAM WINS':'YOUR TEAM LOSES'} · ${TEAMS[winner].name} ${margin}`;
}
