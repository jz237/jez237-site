import {advance,initial,defaults,illumination,type Ecology,type Environment} from '../../living-aquascape/lib/aquarium/Ecosystem.ts';
export type Experiment='balanced'|'flow'|'carbon'|'food';
export type Sample={hour:number;oxygen:number;baselineOxygen:number;ammonia:number;baselineAmmonia:number;co2:number;baselineCo2:number};
/** A controlled comparison: the same clock, starting state and integration for both tanks. */
export class LearningModel{
 state:Ecology=initial();baseline:Ecology=initial();environment:Environment=defaults();
 baselineEnvironment:Environment=defaults();running=false;hoursPerSecond=1;history:Sample[]=[];experiment:Experiment='balanced';
 reset(experiment:Experiment='balanced'){
  this.state=initial();this.baseline=initial();this.environment=defaults();this.baselineEnvironment=defaults();this.experiment=experiment;this.running=false;
  if(experiment==='flow')this.environment.flow=8;
  if(experiment==='carbon')this.environment.co2=0;
  if(experiment==='food')this.state.waste=5;
  this.history=[];this.record();
 }
 step(hours:number){
  if(!Number.isFinite(hours)||hours<=0)return;
  let remaining=Math.min(hours,24);
  while(remaining>1e-8){const h=Math.min(.25,remaining);advance(this.state,this.environment,h);advance(this.baseline,this.baselineEnvironment,h);remaining-=h;this.record();}
 }
 tick(dt:number){if(this.running)this.step(Math.min(.1,Math.max(0,dt))*this.hoursPerSecond);}
 get light(){return illumination(this.state,this.environment);}
 private record(){const previous=this.history.at(-1);if(previous&&this.state.hours-previous.hour<.24)return;this.history.push({hour:this.state.hours,oxygen:this.state.oxygen,baselineOxygen:this.baseline.oxygen,ammonia:this.state.ammonia,baselineAmmonia:this.baseline.ammonia,co2:this.state.co2,baselineCo2:this.baseline.co2});if(this.history.length>193)this.history.shift();}
}
