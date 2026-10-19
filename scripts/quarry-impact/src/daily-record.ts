import type {Challenge} from './challenges';
/** Daily event records (profile.daily) and the streak; kept free of course/venue imports. */
export type DailyRecord={medal:number;best:number|null;attempts:number};
export const DAILY_PREFIX='daily-';
export const DAILY_KEEP=90;
const pad=(n:number)=>String(n).padStart(2,'0');
export const dailyKey=(date=new Date())=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
export const isDailyKey=(key:unknown):key is string=>typeof key==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(key)&&!Number.isNaN(Date.parse(key+'T12:00:00Z'));
export const isDailyChallenge=(c:Pick<Challenge,'id'>|undefined)=>!!c&&c.id.startsWith(DAILY_PREFIX)&&isDailyKey(c.id.slice(DAILY_PREFIX.length));
export function normalizeDaily(raw:unknown):Record<string,DailyRecord>|undefined{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return undefined;
 const n=(v:unknown,max:number)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(max,v)):0;
 const entries=Object.entries(raw as Record<string,any>).filter(([k,v])=>isDailyKey(k)&&v&&typeof v==='object').sort(([a],[b])=>a<b?-1:1).slice(-DAILY_KEEP)
  .map(([k,v])=>[k,{medal:Math.floor(n(v.medal,3)),best:typeof v.best==='number'&&Number.isFinite(v.best)&&v.best>=0?v.best:null,attempts:Math.floor(n(v.attempts,1e6))}] as const);
 return Object.fromEntries(entries);
}
/** Consecutive days with a medal, ending today (or yesterday while today is still open). */
export function dailyStreak(daily:Record<string,DailyRecord>|undefined,today=dailyKey()){
 if(!daily)return 0;let streak=0;const day=new Date(today+'T12:00:00');
 if(!(daily[today]?.medal>0))day.setDate(day.getDate()-1);
 while(daily[dailyKey(day)]?.medal>0){streak++;day.setDate(day.getDate()-1);}
 return streak;
}
/** The last seven days ending today (oldest first) with each day's medal, for the briefing strip. */
export function dailyWeek(daily:Record<string,DailyRecord>|undefined,today=dailyKey()){
 const day=new Date(today+'T12:00:00');day.setDate(day.getDate()-6);const out:{key:string;medal:number;today:boolean}[]=[];
 for(let i=0;i<7;i++){const key=dailyKey(day);out.push({key,medal:daily?.[key]?.medal??0,today:key===today});day.setDate(day.getDate()+1);}
 return out;
}
