export const reefReference={salinity:35,alkalinity:8.5,calcium:430,magnesium:1320,nitrate:5,phosphate:.05};
export type ReefMetric=keyof typeof reefReference;
export type LabAction='evaporate'|'freshwater'|'saltwater'|'uptake'|'nutrients'|'change';
export const metricInfo:Record<ReefMetric,{label:string;unit:string;digits:number;note:string}>={
 salinity:{label:'Salinity',unit:'ppt',digits:2,note:'Evaporation removes water but leaves dissolved salt behind.'},
 alkalinity:{label:'Alkalinity',unit:'dKH',digits:2,note:'Stony coral skeleton growth consumes alkalinity as well as calcium.'},
 calcium:{label:'Calcium',unit:'mg/L',digits:1,note:'Calcium is incorporated into the calcium-carbonate skeleton.'},
 magnesium:{label:'Magnesium',unit:'mg/L',digits:0,note:'This lab tracks dilution and mixing; biological magnesium uptake is omitted.'},
 nitrate:{label:'Nitrate · NO₃',unit:'mg/L',digits:2,note:'A nutrient used by algae and other organisms. This is nitrate, not nitrate-nitrogen.'},
 phosphate:{label:'Phosphate · PO₄',unit:'mg/L',digits:3,note:'A nutrient: keeping a reef is about balance, not automatically driving it to zero.'}
};
export class ReefChemistryLab{
 volume=100;state={...reefReference};event='Start with an illustrative 100 L mixed reef.';
 history:{label:string;state:typeof reefReference;volume:number}[]=[];
 constructor(){this.record('Start');}
 reset(){this.volume=100;this.state={...reefReference};this.event='Reset the lab to its starting values.';this.history=[];this.record('Start');}
 private record(label:string){this.history.push({label,state:{...this.state},volume:this.volume});if(this.history.length>12)this.history.shift();}
 apply(action:LabAction){
  const keys=Object.keys(this.state) as ReefMetric[];let label='';
  if(action==='evaporate'){
   if(this.volume<=80)return false;const before=this.volume;this.volume=Math.max(80,before-2);
   for(const key of keys)this.state[key]*=before/this.volume;
   label='Evaporate';this.event='2 L of water evaporated. Dissolved substances stayed behind, so their concentrations rose.';
  }else if(action==='freshwater'||action==='saltwater'){
   const added=100-this.volume;if(added<.001)return false;
   for(const key of keys){const replacement=action==='freshwater'||key==='nitrate'||key==='phosphate'?0:reefReference[key];this.state[key]=(this.state[key]*this.volume+replacement*added)/100;}
   this.volume=100;label=action==='freshwater'?'Fresh top-off':'Salt top-off';
   this.event=action==='freshwater'?'RO/DI freshwater replaced the evaporated water. It added no salt.':'Comparison mistake: saltwater added more salt on top of the salt left behind. Reset or compare a freshwater top-off.';
  }else if(action==='uptake'){
   // CaCO3 stoichiometry: one mole Ca uses two equivalents of alkalinity.
   // 1 dKH = 0.357 meq/L, so pure CaCO3 uptake uses about7.15mg/L Ca per dKH.
   const used=Math.min(.5,this.state.alkalinity,this.state.calcium/7.15);if(used<=0)return false;
   this.state.alkalinity-=used;this.state.calcium-=used*7.15;label='Coral uptake';
   this.event=`One model day: coral uptake used ${used.toFixed(2)} dKH and ${(used*7.15).toFixed(2)} mg/L calcium. The assumed demand is 0.50 dKH/day; actual reefs differ.`;
  }else if(action==='nutrients'){
   this.state.nitrate+=2;this.state.phosphate+=.02;label='Nutrients';
   this.event='Added a hypothetical nutrient load: +2 mg/L nitrate and +0.02 mg/L phosphate. This is not a prediction of what one feeding produces.';
  }else{
   for(const key of keys)this.state[key]=this.state[key]*.8+(key==='nitrate'||key==='phosphate'?0:reefReference[key])*.2;
   label='20% change';this.event='Replaced 20% of the current water with clean mixed saltwater at the starting salinity and mineral levels. Nutrients fell by 20%, not to zero.';
  }
  this.record(label);return true;
 }
}
