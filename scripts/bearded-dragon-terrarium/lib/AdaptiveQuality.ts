export const qualityLevels=[
  {name:'Full',ratio:1.75,samples:4,shadow:2048,ao:true,bloom:true},
  {name:'Balanced',ratio:1.35,samples:2,shadow:1536,ao:true,bloom:true},
  {name:'Smooth',ratio:1,samples:0,shadow:1024,ao:false,bloom:true},
  {name:'Light',ratio:.8,samples:0,shadow:768,ao:false,bloom:false},
] as const;

/** Frame-pacing feedback changes graphics only, never the contact solver clock.
 * Sustained evidence, cooldown and asymmetric recovery avoid quality pumping. */
export class AdaptiveQuality {
  level=0;
  private elapsed=0;
  private frames:number[]=[];
  private cpu:number[]=[];
  private cooldown=6;
  private good=0;
  private bad=0;
  private trial:{from:number;median:number;p90:number}|null=null;
  private ineffective:{median:number;p90:number}|null=null;
  resetWindow(){this.elapsed=0;this.frames=[];this.cpu=[];this.good=0;this.bad=0;}
  record(dt:number,simulationMs:number,active=true):boolean {
    if(!active||dt<=0||dt>.25){this.resetWindow();return false;}
    this.cooldown=Math.max(0,this.cooldown-dt);
    this.elapsed+=dt;this.frames.push(dt*1000);this.cpu.push(simulationMs);
    if(this.elapsed<2)return false;
    this.frames.sort((a,b)=>a-b);this.cpu.sort((a,b)=>a-b);
    const median=this.frames[Math.floor(this.frames.length*.5)],p90=this.frames[Math.floor(this.frames.length*.9)];
    const sim=this.cpu[Math.floor(this.cpu.length*.5)];
    // A physics-bound slowdown needs diagnostics, not ever-blurrier pictures.
    const slow=(median>24||p90>38)&&sim<median*.65;
    this.bad=slow?this.bad+this.elapsed:0;
    this.good=median<18.5&&p90<22?this.good+this.elapsed:0;
    this.elapsed=0;this.frames=[];this.cpu=[];
    if(this.cooldown>0)return false;
    if(this.trial){
      const helped=median<this.trial.median*.94||p90<this.trial.p90*.90;
      if(!helped){
        // A 30 Hz display or a throttled host cannot be fixed with blurrier
        // textures. Restore the detail if this graphics trial did not help.
        this.ineffective={median,p90};this.level=this.trial.from;this.trial=null;this.cooldown=60;this.bad=0;this.good=0;return true;
      }
      this.trial=null;
    }
    if(this.bad>=4&&this.level<qualityLevels.length-1){
      if(this.ineffective&&median<=this.ineffective.median*1.15&&p90<=this.ineffective.p90*1.15){this.bad=0;return false;}
      this.trial={from:this.level,median,p90};this.level++;this.cooldown=10;this.bad=0;this.good=0;return true;
    }
    if(this.good>=30&&this.level>0){this.level--;this.cooldown=30;this.bad=0;this.good=0;return true;}
    return false;
  }
}
