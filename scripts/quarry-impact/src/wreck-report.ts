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
/** What broke under the bodywork (offline events), worst first: the mechanical failures the car finished with. */
export type MechanicalState={seized?:boolean;outOfFuel?:boolean;diffBroken?:boolean;tieRods?:number;gearsLost?:number;clutchSlipping?:boolean;
  shafts?:number;springs?:number;brakesBinding?:number;electrical?:boolean;exhaust?:boolean;wheelsLoose?:number;rubbing?:number;steeringFailed?:boolean;
  brakeFluidLow?:boolean;overheating?:boolean;oilLow?:boolean;sumpCracked?:boolean;exhaustGone?:boolean;frameBent?:boolean;throttleJammed?:boolean;doorsTorn?:number};
const plural=(n:number,one:string,many=one+'s')=>`${n} ${n===1?one:many}`;
export const MECHANICAL_LIMIT=6;
export function mechanicalReport(s:MechanicalState){
  const bits:string[]=[];const add=(on:unknown,text:string)=>{if(on)bits.push(text);};
  add(s.seized,'engine seized');add(s.outOfFuel,'out of fuel');add(s.diffBroken,'diff broken');
  add((s.tieRods??0)>0,(s.tieRods??0)>1?`${s.tieRods} tie rods snapped`:'tie rod snapped');
  add((s.shafts??0)>0,plural(s.shafts??0,'driveshaft')+' snapped');add((s.gearsLost??0)>0,`${plural(s.gearsLost??0,'gear')} stripped`);
  add(s.frameBent,'frame bent');add(s.clutchSlipping,'clutch slipping');add((s.springs??0)>0,plural(s.springs??0,'spring')+' broken');
  add(s.steeringFailed,'power steering gone');add(s.brakeFluidLow,'brake fluid low');add((s.brakesBinding??0)>0,plural(s.brakesBinding??0,'brake')+' binding');
  add(s.throttleJammed,'throttle jammed');add(s.electrical,'wiring shorting');add(s.overheating,'overheating');add(s.sumpCracked,'sump cracked');add(s.oilLow,'oil low');
  add((s.wheelsLoose??0)>0,plural(s.wheelsLoose??0,'wheel')+' working loose');add((s.rubbing??0)>0,plural(s.rubbing??0,'tyre')+' rubbing');
  add(s.exhaustGone,'exhaust torn off');add(s.exhaust&&!s.exhaustGone,'exhaust blowing');add((s.doorsTorn??0)>0,plural(s.doorsTorn??0,'door')+' torn off');
  if(!bits.length)return'';
  const shown=bits.slice(0,MECHANICAL_LIMIT),more=bits.length-shown.length;
  return'MECHANICAL · '+shown.join(' · ')+(more>0?` · +${more} more`:'');
}
