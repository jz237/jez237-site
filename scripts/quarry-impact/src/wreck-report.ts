/** One-line summary of the player's car after an event, for the results dialog. */
export type WreckState={wheelsLost:number;partsGone:number;rolls?:number;engineDamage?:number;structure?:readonly number[];health:number;shedKg?:number};
const ZONES=['front','rear','left side','right side','roof'] as const;
export function wreckReport(s:WreckState){
  const bits:string[]=[];
  if(s.wheelsLost>0)bits.push(`${s.wheelsLost} ${s.wheelsLost===1?'wheel':'wheels'} lost`);
  if(s.partsGone>0)bits.push(`${s.partsGone} ${s.partsGone===1?'part':'parts'} gone`);
  if((s.shedKg??0)>=10)bits.push(`shed ${Math.round(s.shedKg!)} kg`);
  if((s.rolls??0)>0)bits.push(s.rolls===1?'rolled once':s.rolls===2?'rolled twice':`rolled ${s.rolls} times`);
  if(s.engineDamage!==undefined&&s.engineDamage>=.05)bits.push(`engine ${Math.round((1-Math.min(1,s.engineDamage))*100)}%`);
  const worst=(s.structure??[]).map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v)[0];
  if(worst&&worst.v>=.1)bits.push(`${ZONES[worst.i]} crushed ${Math.round(worst.v*100)}%`);
  if(!bits.length)return s.health>=95?'WRECK REPORT · barely a scratch':'WRECK REPORT · cosmetic damage only';
  return 'WRECK REPORT · '+bits.join(' · ');
}
/** What broke under the bodywork (offline events), worst first: the mechanical failures the car finished with. */
export type MechanicalState={engineOut?:boolean;seized?:boolean;outOfFuel?:boolean;diffBroken?:boolean;tieRods?:number;gearsLost?:number;clutchSlipping?:boolean;
  shafts?:number;springs?:number;brakesBinding?:number;electrical?:boolean;exhaust?:boolean;wheelsLoose?:number;rubbing?:number;steeringFailed?:boolean;
  brakeFluidLow?:boolean;overheating?:boolean;oilLow?:boolean;sumpCracked?:boolean;exhaustGone?:boolean;frameBent?:boolean;radiatorBurst?:boolean;brakeFire?:boolean;throttleJammed?:boolean;doorsTorn?:number;rollBars?:number;propshaft?:'bent'|'snapped';bearing?:'worn'|'seized';steerSkew?:number;belt?:'slipping'|'snapped'|'flat';engineFire?:boolean;
  tank?:'down'|'gone';throttleCable?:boolean;handbrakeCable?:boolean;batteryOut?:boolean;rodThrown?:boolean};
const plural=(n:number,one:string,many=one+'s')=>`${n} ${n===1?one:many}`;
export const MECHANICAL_LIMIT=6;
export function mechanicalReport(s:MechanicalState){
  const bits:string[]=[];const add=(on:unknown,text:string)=>{if(on)bits.push(text);};
  add(s.engineOut,'engine dropped out');add(s.rodThrown&&!s.engineOut,'rod through the block');add(s.seized&&!s.engineOut&&!s.rodThrown,'engine seized');add(s.engineFire,'engine fire');add(s.brakeFire,'brake fire');add(s.outOfFuel,'out of fuel');add(s.tank==='gone','fuel tank torn off');add(s.tank==='down','fuel tank dragging');add(s.diffBroken,'diff broken');
  add((s.tieRods??0)>0,(s.tieRods??0)>1?`${s.tieRods} tie rods snapped`:'tie rod snapped');
  add((s.shafts??0)>0,plural(s.shafts??0,'driveshaft')+' snapped');add((s.gearsLost??0)>0,`${plural(s.gearsLost??0,'gear')} stripped`);
  add(s.propshaft==='snapped','propshaft snapped');add(s.frameBent,'frame bent');add(s.propshaft==='bent','propshaft bent');add(s.bearing==='seized','wheel bearing seized');add(s.bearing==='worn','wheel bearing growling');add((s.rollBars??0)>0,(s.rollBars??0)>1?'both roll bars snapped':'roll bar snapped');add(s.clutchSlipping,'clutch slipping');add((s.springs??0)>0,plural(s.springs??0,'spring')+' broken');
  add(s.steeringFailed,'power steering gone');add(Math.abs(s.steerSkew??0)>=.15,`${(s.steerSkew??0)>0?'right':'left'} lock short`);add(s.brakeFluidLow,'brake fluid low');add((s.brakesBinding??0)>0,plural(s.brakesBinding??0,'brake')+' binding');add(s.handbrakeCable,'handbrake cable snapped');
  add(s.throttleJammed,'throttle jammed');add(s.throttleCable,'throttle cable snapped');add(s.batteryOut,'battery thrown out');add(s.belt==='flat','battery flat');add(s.belt==='snapped','fan belt snapped');add(s.belt==='slipping','fan belt slipping');add(s.electrical,'wiring shorting');add(s.radiatorBurst,'radiator burst');add(s.overheating&&!s.radiatorBurst,'overheating');add(s.sumpCracked,'sump cracked');add(s.oilLow,'oil low');
  add((s.wheelsLoose??0)>0,plural(s.wheelsLoose??0,'wheel')+' working loose');add((s.rubbing??0)>0,plural(s.rubbing??0,'tyre')+' rubbing');
  add(s.exhaustGone,'exhaust torn off');add(s.exhaust&&!s.exhaustGone,'exhaust blowing');add((s.doorsTorn??0)>0,plural(s.doorsTorn??0,'door')+' torn off');
  if(!bits.length)return'';
  const shown=bits.slice(0,MECHANICAL_LIMIT),more=bits.length-shown.length;
  return'MECHANICAL · '+shown.join(' · ')+(more>0?` · +${more} more`:'');
}
