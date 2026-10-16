import {PursuitSession,validPursuitRules,type PursuitRole,type PursuitRules} from './pursuit';
/** Keep at least one opponent; invalid saved counts fall back to one runner. */
export function pursuitRunnerCount(value:unknown,field:number):number{
 return typeof value==='number'&&Number.isFinite(value)?Math.max(1,Math.min(field-1,Math.round(value))):1;
}
export function teamPursuitRules(ids:readonly number[],player:number,role:PursuitRole='runner',runners=1,duration=300):PursuitRules{
 if(!ids.includes(player)||!['runner','chaser'].includes(role))throw Error('Invalid chase player');
 const count=pursuitRunnerCount(runners,ids.length),others=ids.filter(id=>id!==player);
 const running=new Set(role==='runner'?[player,...others.slice(0,count-1)]:others.slice(0,count));
 const rules:PursuitRules={version:1,duration,members:ids.map(id=>({id,role:running.has(id)?'runner':'chaser'}))};
 if(!validPursuitRules(rules))throw Error('Invalid chase teams');return rules;
}
/** Runners lead the grid; stable ordering keeps the original solo layout intact. */
export function pursuitGridOrder(rules:PursuitRules):number[]{return [...rules.members.filter(m=>m.role==='runner'),...rules.members.filter(m=>m.role==='chaser')].map(m=>m.id);}
export function pursuitTeamWon(session:PursuitSession,id:number):boolean{return session.complete&&session.winner===(session.role(id)==='runner'?'runners':'chasers');}
export function pursuitRecordSuffix(session:PursuitSession,id:number):string{
 const count=session.snapshot().results.length,role=session.role(id);
 return count===1&&role==='runner'?'':`:${role}:${count}`;
}
export function pursuitTeamTitle(session:PursuitSession,id:number):string{
 return `${pursuitTeamWon(session,id)?'TEAM VICTORY':'TEAM DEFEAT'} · ${session.winner==='runners'?'RUNNERS ESCAPED':'RUNNERS CAUGHT'}`;
}
