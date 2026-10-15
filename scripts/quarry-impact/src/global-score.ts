export type RaceScore = { rank:number; field:number; condition:number };
export function raceScore(s:RaceScore):number {
  if (!Number.isInteger(s.rank)||!Number.isInteger(s.field)||s.field<2||s.field>24||s.rank<1||s.rank>s.field||!Number.isFinite(s.condition)||s.condition<0||s.condition>100) throw Error('Invalid race result');
  return Math.round(1000*(s.field-s.rank)/(s.field-1)+s.field*10+s.condition);
}
export function scoreWeek(now=Date.now()):string {
  const d=new Date(now);d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10);
}
export function scoreName(value:unknown):string {
  if(typeof value!=='string')throw Error('Enter a nickname');
  const name=value.trim().replace(/\s+/g,' ');
  if(!/^[A-Za-z0-9 _.-]{2,18}$/.test(name))throw Error('Use 2–18 letters, numbers, spaces, . _ or -');
  return name;
}
