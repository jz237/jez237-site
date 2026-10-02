import {unitNoise} from './vehicle-fire-profile';
export const FIRE_CHANCE=.24,EXPLOSION_CHANCE=.12;
export type DamageZones={front:number;rear:number;left:number;right:number;roof:number};
const noDamage:DamageZones={front:0,rear:0,left:0,right:0,roof:0};
/** One ignition assessment per severe engine/fuel damage episode. */
export class VehicleThermalState {
  health=100;heat=0;smoke=0;soot=0;burst=0;exploded=false;age=0;criticalTime=0;
  burning=false;burnTime=0;ignitionTime=0;
  private episode=0;private eligible=false;private assessed=false;private explosive=false;
  private delay=5;private burstDelay=18;private fuelTime=40;
  constructor(health=100,private seed=Math.random()){this.health=health;}
  advance(health:number,dt:number,_impactDamage=Math.max(0,this.health-health),zones:DamageZones=noDamage,engineZone:'front'|'rear'='front',waterCooled=true){
    if(!(dt>0)||!Number.isFinite(dt))return false;
    health=Math.max(0,Math.min(100,Number.isFinite(health)?health:this.health));
    if(health>this.health+1)this.reset(health);
    const severe=health<=18&&(zones[engineZone]>=30||zones[engineZone==='front'?'rear':'front']>=36),n=(offset:number)=>unitNoise(this.seed+this.episode*1.173+offset);
    if(severe&&!this.assessed){this.assessed=true;this.eligible=n(0)<FIRE_CHANCE;this.explosive=n(9.37)<EXPLOSION_CHANCE;this.delay=3+n(4.71)*8;this.burstDelay=12+n(7.28)*15;this.fuelTime=30+n(12.19)*40;}
    if(this.eligible&&severe&&!this.burning){this.ignitionTime+=dt;if(this.ignitionTime+1e-9>=this.delay)this.burning=true;}
    if(this.burning)this.burnTime+=dt;
    const fuel=this.burning?Math.min(1,Math.max(0,(this.fuelTime-this.burnTime)/9)):0,target=fuel*(.62+n(2.13)*.32);
    this.heat+=(target-this.heat)*(1-Math.exp(-dt*(target>this.heat?1.45:.6)));
    if(this.burning&&this.heat>.65&&health<=6&&fuel>.5)this.criticalTime+=dt;
    const burst=this.explosive&&!this.exploded&&this.criticalTime+1e-9>=this.burstDelay;
    if(burst){this.exploded=true;this.burst=1;}else this.burst=Math.max(0,this.burst-dt*1.65);
    const coolant=waterCooled&&zones[engineZone]>=12&&health<60?Math.min(.32,(60-health)/120):0,sootTarget=fuel>0?this.heat:0;
    this.soot+=(sootTarget-this.soot)*(1-Math.exp(-dt*.6));
    const smokeTarget=Math.max(coolant,this.soot*(.65+n(3.18)*.35));this.smoke+=(smokeTarget-this.smoke)*(1-Math.exp(-dt*.85));
    this.health=health;this.age+=dt;return burst;
  }
  reset(health=100){this.health=health;this.heat=this.smoke=this.soot=this.burst=this.age=this.criticalTime=this.burnTime=this.ignitionTime=0;this.exploded=this.burning=this.assessed=this.eligible=this.explosive=false;this.episode++;}
}
