export class OpeningSequence {
  private startTime:number|undefined;
  private enabled:boolean;
  private reduced:boolean;
  constructor(reduced:boolean){this.reduced=reduced;this.enabled=!reduced;}
  cancel(){this.enabled=false;}
  setReduced(value:boolean){this.reduced=value;if(value)this.cancel();}
  replay(){this.startTime=undefined;this.enabled=!this.reduced;}
  sample(now:number){
    if(!this.enabled)return {active:false,assembled:false,cut:1};
    this.startTime??=now;
    const elapsed=(now-this.startTime)/1000;
    if(elapsed>=3.3){this.enabled=false;return {active:false,assembled:false,cut:1};}
    const t=Math.max(0,Math.min(1,(elapsed-1.1)/2.2));
    return {active:true,assembled:elapsed<1.1,cut:t*t*(3-2*t)};
  }
}
