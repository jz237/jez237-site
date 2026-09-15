export type FrameProbe='normal'|'still'|'reflections'|'shadows'|'captures'|'contact'|'pixels'|'captures-contact'|'captures-pixels';
export const frameProbes:readonly {mode:FrameProbe;label:string}[]=[
 {mode:'normal',label:'Full aquarium'},
 {mode:'still',label:'Simulation held'},
 {mode:'reflections',label:'Still + reflection captures held'},
 {mode:'shadows',label:'Still + shadow maps held'},
 {mode:'captures',label:'Still + both captures held'},
 {mode:'contact',label:'Still + contact shading bypassed'},
 {mode:'pixels',label:'Still + half image width/height'},
 {mode:'captures-contact',label:'Still + both captures held + contact shading bypassed'},
 {mode:'captures-pixels',label:'Still + both captures held + half image width/height'},
 {mode:'normal',label:'Full aquarium recheck'},
];

/** Wall-frame comparisons work even when a phone has no GPU timer extension.
 * Each independent probe starts from full settings; these are not additive costs.
 * One second settles queued GPU work, then four seconds are measured. */
export class FrameBenchmark{
 active=false;private index=0;private started=0;private last=0;
 private samples:number[]=[];private results:string[]=[];
 private apply:(mode:FrameProbe)=>void;private restore:()=>void;
 private notify:(message:string,done:boolean)=>void;
 constructor(apply:(mode:FrameProbe)=>void,restore:()=>void,notify:(message:string,done:boolean)=>void){this.apply=apply;this.restore=restore;this.notify=notify;}
 get mode():FrameProbe{return this.active?frameProbes[this.index].mode:'normal';}
 start(now:number){
  if(this.active)return;this.active=true;this.index=0;this.results=[];
  try{this.enter(now);}catch(error){this.cancel();throw error;}
 }
 private enter(now:number){
  this.started=this.last=now;this.samples=[];this.apply(this.mode);
  this.notify(`Aquarium graphics test ${this.index+1}/${frameProbes.length}\n${frameProbes[this.index].label}\nKeep this view still. About ${frameProbes.length*5} seconds total.\nMotion and some effects change temporarily.\nFull settings return automatically.`,false);
 }
 tick(now:number){
  if(!this.active)return;
  const interval=now-this.last;this.last=now;
  // A hidden tab or long interruption is not a usable benchmark.
  if(interval>1500){this.cancel();return;}
  if(now-this.started>1000&&interval>0)this.samples.push(interval);
  if(now-this.started<5000)return;
  const sorted=[...this.samples].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];
  const mean=this.samples.reduce((a,b)=>a+b,0)/this.samples.length;
  this.results.push(`${frameProbes[this.index].label}: ${(1000/mean).toFixed(1)} FPS / ${median.toFixed(1)} ms`);
  this.index++;
  if(this.index===frameProbes.length){
   this.active=false;this.restore();
   this.notify(`Aquarium graphics test\n${this.results.join('\n')}\nFrame-time comparisons, not individual GPU timings.\nFull detail and original controls restored.`,true);
  }else{try{this.enter(now);}catch(error){this.cancel();throw error;}}
 }
 cancel(){if(!this.active)return;this.active=false;this.restore();this.notify('Graphics test cancelled. Full detail and original controls restored.',true);}
}
