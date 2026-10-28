const clamp=(v:number)=>Math.max(0,Math.min(1,v));

/** Bounded behavioral drives, not a physiological or husbandry prediction.
 * Recovery times are illustrative; priorities follow diurnal thermoregulation,
 * satiation, rest and access to water described by the Australian Museum. */
export class DragonNeeds {
  satiety=.2;
  thirst=.2;
  fatigue=0;
  update(dt:number,distance:number,resting:boolean){
    this.satiety=clamp(this.satiety-dt/2400);
    this.thirst=clamp(this.thirst+dt/1800+distance*.004);
    this.fatigue=clamp(this.fatigue+distance*.035-(resting?dt/180:0));
  }
  eat(amount:number){this.satiety=clamp(this.satiety+amount);}
  drink(amount:number){this.thirst=clamp(this.thirst-amount);}
  get wantsPrey(){return this.satiety<.9&&this.fatigue<.85;}
}
