/** A thunderstorm over an offline rain event. Lightning strikes every THUNDER.gap seconds at a random distance
 * (THUNDER.distance km): its flash lights the scene in two quick pulses over THUNDER.flash s, and its thunder arrives as far
 * behind as sound takes to cover the distance (THUNDER.sound km a second). Within THUNDER.near km it is the close crack,
 * otherwise the distant rumble, quieter the further off it is. */
export const THUNDER={gap:[22,55],flash:.22,distance:[.5,4],sound:.343,near:1.2,loud:.9,far:[.5,.22],light:2.4} as const;
export type Clap={near:boolean;volume:number};
/** The flash's brightness (0–1) t seconds after the strike: a pulse, a dip, a second pulse, then gone. */
export function flashLevel(t:number){
  if(!(t>=0)||t>=THUNDER.flash)return 0;const f=t/THUNDER.flash;
  return f<.25?1:f<.4?.25:f<.6?.8:.8*(1-(f-.6)/.4);
}
export class Storm{
  /** Strikes and thunderclaps so far (QA). */
  strikes=0;claps=0;
  private wait:number;private since=-1;private thunderIn=-1;private pending:Clap|null=null;
  constructor(private random:()=>number){this.wait=this.gap();}
  /** Strike on the next step (QA). */
  strikeNow(){this.wait=0;}
  private gap(){return THUNDER.gap[0]+this.random()*(THUNDER.gap[1]-THUNDER.gap[0]);}
  /** Advance dt seconds; returns the flash brightness now and any thunderclap that arrives this step. */
  step(dt:number):{flash:number;clap:Clap|null}{
    if(!(dt>0))return {flash:this.since>=0?flashLevel(this.since):0,clap:null};
    let clap:Clap|null=null;
    this.wait-=dt;
    if(this.wait<=0){
      const km=THUNDER.distance[0]+this.random()*(THUNDER.distance[1]-THUNDER.distance[0]),near=km<THUNDER.near;
      this.strikes++;this.since=0;this.thunderIn=km/THUNDER.sound;this.wait=this.gap();
      this.pending={near,volume:near?THUNDER.loud:THUNDER.far[0]+(THUNDER.far[1]-THUNDER.far[0])*(km-THUNDER.near)/(THUNDER.distance[1]-THUNDER.near)};
    }else if(this.since>=0)this.since+=dt;
    if(this.thunderIn>=0){this.thunderIn-=dt;if(this.thunderIn<0&&this.pending){clap=this.pending;this.pending=null;this.claps++;}}
    return {flash:this.since>=0?flashLevel(this.since):0,clap};
  }
}
