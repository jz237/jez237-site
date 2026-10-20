/** One-line summary of the player's car after an event, for the results dialog. */
export type WreckState={wheelsLost:number;partsGone:number;engineDamage?:number;structure?:readonly number[];health:number};
const ZONES=['front','rear','left side','right side','roof'] as const;
export function wreckReport(s:WreckState){
  const bits:string[]=[];
  if(s.wheelsLost>0)bits.push(`${s.wheelsLost} ${s.wheelsLost===1?'wheel':'wheels'} lost`);
  if(s.partsGone>0)bits.push(`${s.partsGone} ${s.partsGone===1?'part':'parts'} gone`);
  if(s.engineDamage!==undefined&&s.engineDamage>=.05)bits.push(`engine ${Math.round((1-Math.min(1,s.engineDamage))*100)}%`);
  const worst=(s.structure??[]).map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v)[0];
  if(worst&&worst.v>=.1)bits.push(`${ZONES[worst.i]} crushed ${Math.round(worst.v*100)}%`);
  if(!bits.length)return s.health>=95?'WRECK REPORT · barely a scratch':'WRECK REPORT · cosmetic damage only';
  return 'WRECK REPORT · '+bits.join(' · ');
}
