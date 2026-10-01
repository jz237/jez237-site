import {validCapacity} from '../src/online-capacity';
export type CupMode='race'|'derby';
export type CupEntry={id:string;name:string;bot:boolean;points:number;wins:number;starts:number;lastPoints:number;lastPlace:number;};
export type CupState={version:1;rounds:number;round:number;completed:number;mode:CupMode;entries:CupEntry[];participants:string[];votes:Record<number,CupMode>;};
export const CUP_POINTS=[25,18,15,12,10,8,6,4] as const;
export const cupPoints=(place:number,capacity:number)=>capacity===24?Math.max(0,25-place):CUP_POINTS[place]??0;
export function newCup(rounds:number,mode:CupMode):CupState{return{version:1,rounds,round:0,completed:0,mode,entries:[],participants:[],votes:{}};}
export function beginCupRound(cup:CupState,mode:CupMode,drivers:{id:string;name:string;bot:boolean}[]){
 if(cup.round>=cup.rounds||cup.round!==cup.completed||!validCapacity(drivers.length)||(cup.round>0&&drivers.length!==cup.participants.length)||new Set(drivers.map(d=>d.id)).size!==drivers.length)throw new Error('Invalid cup round transition');
 cup.round++;cup.mode=mode;cup.votes={};cup.participants=drivers.map(d=>d.id);
 for(const entry of cup.entries){entry.lastPoints=0;entry.lastPlace=0;}
 for(const driver of drivers){let entry=cup.entries.find(e=>e.id===driver.id);if(!entry){entry={...driver,points:0,wins:0,starts:0,lastPoints:0,lastPlace:0};cup.entries.push(entry);}entry.starts++;}
}
export function finishCupRound(cup:CupState,ranking:number[],eligible:ReadonlySet<string>):boolean{
 if(cup.round===0||cup.completed===cup.round)return false;
 if(ranking.length!==cup.participants.length||new Set(ranking).size!==ranking.length||ranking.some(n=>!Number.isInteger(n)||n<0||n>=ranking.length))throw new Error('Invalid authoritative result');
 ranking.forEach((slot,place)=>{const entry=cup.entries.find(e=>e.id===cup.participants[slot])!;entry.lastPlace=place+1;if(eligible.has(entry.id)){entry.lastPoints=cupPoints(place,cup.participants.length);entry.points+=entry.lastPoints;if(place===0)entry.wins++;}});
 cup.completed=cup.round;return true;
}
export const cupStandings=(cup:CupState)=>[...cup.entries].sort((a,b)=>b.points-a.points||b.wins-a.wins||a.id.localeCompare(b.id));
export function nextCupMode(cup:CupState,connected:ReadonlySet<number>):CupMode{
 const votes=Object.entries(cup.votes).filter(([id])=>connected.has(+id));
 const race=votes.filter(([,mode])=>mode==='race').length,derby=votes.length-race;
 return race===derby?(cup.mode==='race'?'derby':'race'):race>derby?'race':'derby';
}
/** Strict bounded wire/storage validation; cup totals can only originate on the authority. */
export function validCup(value:unknown):value is CupState{
 const c=value as CupState;if(!c||typeof c!=='object'||c.version!==1)return false;
 const integer=(n:unknown,min:number,max:number)=>Number.isInteger(n)&&Number(n)>=min&&Number(n)<=max;
 const identity=(v:unknown)=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(v);
 if(!integer(c.rounds,2,9)||!integer(c.round,1,c.rounds)||!integer(c.completed,c.round-1,c.round)||!['race','derby'].includes(c.mode)||!Array.isArray(c.entries)||c.entries.length<8||c.entries.length>c.participants?.length*c.rounds||!Array.isArray(c.participants)||!validCapacity(c.participants.length)||new Set(c.participants).size!==c.participants.length||!c.votes||typeof c.votes!=='object'||Array.isArray(c.votes))return false;
 if(!c.entries.every(e=>e&&identity(e.id)&&typeof e.name==='string'&&e.name.length<=18&&typeof e.bot==='boolean'&&integer(e.points,0,225)&&integer(e.wins,0,c.rounds)&&integer(e.starts,1,c.rounds)&&integer(e.lastPoints,0,25)&&integer(e.lastPlace,0,c.participants.length))||new Set(c.entries.map(e=>e.id)).size!==c.entries.length)return false;
 return c.participants.every(id=>c.entries.some(e=>e.id===id))&&Object.entries(c.votes).length<=c.participants.length&&Object.entries(c.votes).every(([id,mode])=>/^(0|[1-9][0-9]*)$/.test(id)&&+id<c.participants.length&&['race','derby'].includes(mode));
}
