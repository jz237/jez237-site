// The game clock: simulated time at a chosen rate (default 4x, so a 20-minute session covers a dawn
// bite window), a free skip to any hour, or wall-clock time for the live lake. Local time is
// America/New_York; all storage is ms since epoch.
export const TZ='America/New_York';
const formatters=new Map();
function formatter(tz){if(!formatters.has(tz))formatters.set(tz,new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}));return formatters.get(tz);}
export function localParts(ms,tz=TZ){const parts=formatter(tz).formatToParts(new Date(ms));const g=t=>Number(parts.find(p=>p.type===t).value);return {year:g('year'),month:g('month'),day:g('day'),hour:g('hour')%24,minute:g('minute'),second:g('second')};}
export function tzOffsetMinutes(ms,tz=TZ){const p=localParts(ms,tz);return (Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-Math.floor(ms/1000)*1000)/60000;}
export function fromLocal({year,month,day,hour=0,minute=0,second=0},tz=TZ){
 const wall=Date.UTC(year,month-1,day,hour,minute,second);let guess=wall;
 for(let i=0;i<3;i++){const next=wall-tzOffsetMinutes(guess,tz)*60000;if(next===guess)break;guess=next;}
 return guess;
}
export function hourOfDay(ms,tz=TZ){const p=localParts(ms,tz);return p.hour+p.minute/60+p.second/3600;}
export function dayOfYear(ms,tz=TZ){const p=localParts(ms,tz);return Math.round((Date.UTC(p.year,p.month-1,p.day)-Date.UTC(p.year,0,1))/86400000)+1;}
export function createClock({start=Date.now(),rate=4,mode='sim'}={}){return {ms:start,rate,mode,skip:null};}
export function stepClock(c,dtReal,nowMs=Date.now()){
 if(c.mode==='real'){c.ms=nowMs;return c;}
 if(c.skip){const s=c.skip;s.t=Math.min(1,s.t+dtReal/s.duration);const e=s.t*s.t*(3-2*s.t);c.ms=s.from+(s.to-s.from)*e;if(s.t>=1){c.ms=s.to;c.skip=null;}return c;}
 c.ms+=dtReal*1000*c.rate;return c;
}
function atHour(baseMs,hour,tz){const p=localParts(baseMs,tz);return fromLocal({year:p.year,month:p.month,day:p.day,hour:Math.floor(hour),minute:Math.floor((hour%1)*60),second:0},tz);}
// Skip forward to the next occurrence of a local hour, eased over `duration` real seconds.
export function skipToHour(c,hour,{duration=3,tz=TZ}={}){
 let target=atHour(c.ms,hour,tz);if(target<=c.ms+60000)target=atHour(c.ms+86400000,hour,tz);
 c.mode='sim';c.skip={from:c.ms,to:target,t:0,duration};return target;
}
export function setHour(c,hour,tz=TZ){c.ms=atHour(c.ms,hour,tz);c.skip=null;c.mode='sim';return c.ms;}
export function formatClock(ms,tz=TZ){return new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit'}).format(new Date(ms));}
export function formatDate(ms,tz=TZ){return new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',month:'short',day:'numeric'}).format(new Date(ms));}
