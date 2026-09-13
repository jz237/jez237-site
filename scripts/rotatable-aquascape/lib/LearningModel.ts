import {advanceChemistry,chemistryInitial,chemistryDefaults,chemistryLight,addFeed,consumeFeed,changeWater,nitrogenError,FEED_MG,type ChemistryState,type ChemistryEnvironment} from './TankChemistry.ts';
export type Experiment='balanced'|'flow'|'carbon'|'food';
export type Metric='oxygen'|'co2'|'ammonia'|'nitrite'|'nitrate'|'ph'|'kh'|'nh3';
export type Sample={hour:number;changed:ChemistryState;control:ChemistryState};
/** Ongoing tank and unchanged control, with isolated challenge instances. */
export class LearningModel{
 state=chemistryInitial();baseline=chemistryInitial();environment:ChemistryEnvironment=chemistryDefaults();baselineEnvironment=chemistryDefaults();
 running=false;hoursPerSecond=1/60;history:Sample[]=[];experiment:Experiment='balanced';generation=0;event='Tracking starts at noon';
 reset(experiment:Experiment='balanced'){
  this.generation++;this.state=chemistryInitial();this.baseline=chemistryInitial();this.environment=chemistryDefaults();this.baselineEnvironment=chemistryDefaults();this.experiment=experiment;this.running=false;
  if(experiment==='flow')this.environment.flow=8;if(experiment==='carbon')this.environment.co2=0;
  if(experiment==='food')addFeed(this.state,FEED_MG*10);
  this.event=experiment==='food'?'Added 1.20 g of modeled food':'Comparison reset to noon';this.history=[];this.record(true);
 }
 step(hours:number){
  if(!Number.isFinite(hours)||hours<=0)return;let remaining=Math.min(hours,24);
  while(remaining>1e-8){const h=Math.min(.25,remaining);advanceChemistry(this.state,this.environment,h);advanceChemistry(this.baseline,this.baselineEnvironment,h);remaining-=h;this.record();}
 }
 tick(dt:number){if(this.running&&Number.isFinite(dt))this.step(Math.min(1,Math.max(0,dt))*this.hoursPerSecond);}
 addFood(milligrams=FEED_MG){const n=addFeed(this.state,milligrams);if(n){this.event=`Food added: ${(milligrams/1000).toFixed(2)} g; digestion and decay take time`;this.record(true);}return n;}
 eat(nitrogen:number,generation=this.generation){if(generation===this.generation)consumeFeed(this.state,nitrogen);}
 waterChange(){this.record(true);changeWater(this.state,.3);this.event='30% water change: dissolved nutrients exported; detritus and biofilm remain';this.record(true);}
 setLight(mode:ChemistryEnvironment['lightMode']){this.environment.lightMode=mode;this.baselineEnvironment.lightMode=mode;this.event=mode==='cycle'?'Both tanks follow the 8-hour light timer':`Both tanks: lights ${mode==='day'?'on':'off'}`;}
 get injectingCO2(){return this.environment.co2>0&&this.light>1e-6;}
 get light(){return chemistryLight(this.state,this.environment);}
 get nitrogenBalanceError(){return nitrogenError(this.state);}
 private record(force=false){const previous=this.history.at(-1);if(!force&&previous&&this.state.hours-previous.hour<.24)return;
  const sample={hour:this.state.hours,changed:{...this.state},control:{...this.baseline}};
  // Retain before/after points at the same hour for abrupt water changes.
  this.history.push(sample);if(this.history.length>193)this.history.shift();
 }
}
