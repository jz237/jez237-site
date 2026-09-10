import {CIRCUITS,getCourse} from './courses.js';
import {createRace,raceOrder,RIDERS} from './race-core.js';
export const DIFFICULTIES=['Normal','Hard','Expert','Reverse'];
export const POINTS=[7,4,2,1];
export function createChampionship({difficulty=0,rider=0,tune={},laps=3}={}){return {difficulty,rider,tune,laps,round:0,points:[0,0,0,0],grid:[...RIDERS.map((_,i)=>i).filter(i=>i!==rider),rider],courses:[...CIRCUITS[Math.min(2,difficulty)]],history:[],status:'racing'};}
export const QUALIFICATION=[[1,2,4,8,12,16],[2,4,6,10,14,21,28],[2,4,8,12,16,23,30,37]];
export function qualification(cup){return QUALIFICATION[Math.min(2,cup.difficulty)][cup.round]??0;}
export function requiredFinish(cup){const deficit=qualification(cup)-cup.points[cup.rider];if(deficit<=0)return 'Already qualified on points';const place=POINTS.findLastIndex(p=>p>=deficit)+1;return place?'Finish '+place+(place===1?'st':place===2?'nd':place===3?'rd':'th')+' or better':'A win is required';}
export function championshipRace(cup){if(cup.status!=='racing')throw Error('Championship is not racing');const race=createRace({mode:'championship',rider:cup.rider,tune:cup.tune,laps:cup.laps,difficulty:cup.difficulty,course:getCourse(cup.courses[cup.round],cup.difficulty),gridOrder:cup.grid});race.championshipCheckpoint=structuredClone(cup);return race;}
export function restartChampionshipRound(race){if(!race.championshipCheckpoint)throw Error('Missing championship checkpoint');return structuredClone(race.championshipCheckpoint);}
export function standings(cup){return RIDERS.map((_,id)=>({id,points:cup.points[id]})).sort((a,b)=>b.points-a.points||cup.grid.indexOf(a.id)-cup.grid.indexOf(b.id));}
export function finishRound(cup,race,save){if(cup.status!=='racing'||race.phase!=='results'||race.course.id!==cup.courses[cup.round])throw Error('Round is not complete or has already been scored');const order=raceOrder(race);const earned=[0,0,0,0];order.forEach((r,i)=>{earned[r.id]=r.dq?0:POINTS[i];cup.points[r.id]+=earned[r.id];});cup.grid=order.map(r=>r.id);cup.history.push({course:race.course.id,earned,order:[...cup.grid]});
 save.reached??=['greyhaven','practice'];if(!save.reached.includes(race.course.id))save.reached.push(race.course.id);
 if(cup.points[cup.rider]<qualification(cup)){cup.status='eliminated';return;}
 cup.round++;if(cup.round===cup.courses.length){cup.status=standings(cup)[0].id===cup.rider?'won':'complete';save.unlocked=Math.max(save.unlocked||0,Math.min(3,cup.difficulty+1));}
 else if(!save.reached.includes(cup.courses[cup.round]))save.reached.push(cup.courses[cup.round]);
}
