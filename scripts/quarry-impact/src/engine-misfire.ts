import {unitNoise} from './vehicle-fire-profile';
/** A badly damaged engine misfires under throttle: drive cuts to a fraction for a moment, more
 * often and for longer the worse the damage, and some cuts end in a backfire. Below
 * MISFIRE_ONSET engine damage it never misfires. Deterministic from its seed. */
export const MISFIRE_ONSET=.3,MISFIRE_POWER=.15;
export class EngineMisfire {
  factor=1;backfire=false;
  private time=0;private cut=0;private next=0;private count=0;
  constructor(private readonly seed:number){}
  update(dt:number,engineDamage:number,throttle:number){
    this.backfire=false;
    const level=Math.max(0,Math.min(1,(engineDamage-MISFIRE_ONSET)/(1-MISFIRE_ONSET)));
    if(!(dt>0)||level<=0||Math.abs(throttle)<.15){this.factor=1;this.cut=0;return this.factor;}
    this.time+=dt;
    const n=(offset:number)=>unitNoise(this.seed+this.count*1.618+offset);
    if(this.cut>0){
      this.cut-=dt;
      if(this.cut<=0){this.factor=1;this.backfire=n(.41)<.2+.35*level;}
      return this.factor;
    }
    if(this.time>=this.next){
      this.count++;this.cut=.08+.24*level*n(.29);this.factor=MISFIRE_POWER;
      this.next=this.time+(3.2-2.2*level)*(.5+n(.73));
    }
    return this.factor;
  }
  reset(){this.factor=1;this.backfire=false;this.time=this.cut=this.next=this.count=0;}
}
