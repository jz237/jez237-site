export interface FrameHost {
  now(): number;
  visible(): boolean;
  request(callback: (time:number)=>void): number;
  cancel(id:number): void;
  delay(callback:()=>void,ms:number): number;
  clear(id:number): void;
}
const browserHost: FrameHost = {
  now:()=>performance.now(),visible:()=>!document.hidden,
  request:callback=>requestAnimationFrame(callback),cancel:id=>cancelAnimationFrame(id),
  delay:(callback,ms)=>window.setTimeout(callback,ms),clear:id=>clearTimeout(id),
};

/** Some embedded browsers throttle rAF to 1 Hz even for their visible view.
 * Keep normal display synchronization, with a timer only when rAF stalls. */
export class FrameDriver {
  private raf=0;private timer=0;private running=false;
  private lastRaf=0;private lastFrame=-Infinity;private fallback=false;private healthy=0;
  constructor(private frame:(time:number)=>void,private host:FrameHost=browserHost){}
  start(){
    this.stop();this.running=true;this.lastRaf=this.host.now();this.lastFrame=-Infinity;this.fallback=false;this.healthy=0;
    this.raf=this.host.request(this.onRaf);this.timer=this.host.delay(this.onTimer,80);
  }
  stop(){this.running=false;this.host.cancel(this.raf);this.host.clear(this.timer);}
  private emit(time:number){
    if(!this.host.visible()){this.lastFrame=-Infinity;return;}
    // A restored rAF and the watchdog can arrive together. Render only once.
    if(time-this.lastFrame<8)return;
    this.lastFrame=time;this.frame(time);
  }
  private onRaf=(time:number)=>{
    if(!this.running)return;
    this.healthy=time-this.lastRaf<50?this.healthy+1:0;this.lastRaf=time;
    if(this.healthy>=8)this.fallback=false;
    this.emit(time);
    if(this.running)this.raf=this.host.request(this.onRaf);
  };
  private onTimer=()=>{
    if(!this.running)return;
    const now=this.host.now();
    if(this.host.visible() && (this.fallback || now-this.lastRaf>=80)){
      this.fallback=true;this.emit(now);
    }
    if(this.running)this.timer=this.host.delay(this.onTimer,this.host.visible()
      ? this.fallback?Math.max(4,1000/60-(this.host.now()-now)):Math.max(4,80-(this.host.now()-this.lastRaf))
      : 250);
  };
}
