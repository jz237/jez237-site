export const effectProfiles=[
 {name:'Full',aoScale:1,contact:true,simpleShadows:false,waterTrace:true,samples:2,reflectionScale:1},
 {name:'Balanced',aoScale:.5,contact:true,simpleShadows:false,waterTrace:true,samples:2,reflectionScale:1},
 {name:'Performance',aoScale:.5,contact:false,simpleShadows:true,waterTrace:false,samples:2,reflectionScale:1},
 {name:'Light effects',aoScale:.5,contact:false,simpleShadows:true,waterTrace:false,samples:0,reflectionScale:.65},
] as const;

/** Measure the running workload, not a GPU name, RAM size, or input device.
 * Aim for stable 30+ fps; do not penalize a naturally 30 Hz presentation path.
 * Loading, paused lessons, benchmarks and hidden tabs must not train this model. */
export class AdaptiveEffects{
 level=0;
 private samples:number[]=[];private elapsed=0;private warmup=1500;
 private fastTime=0;private recoveryDelay=12000;private recovering=false;
 reset(){this.samples=[];this.elapsed=0;this.warmup=1500;this.fastTime=0;}
 observe(ms:number){
  if(!Number.isFinite(ms)||ms<=0||ms>500){this.reset();return false;}
  if(this.warmup>0){this.warmup-=ms;return false;}
  this.samples.push(ms);this.elapsed+=ms;
  if(this.elapsed<2400||this.samples.length<12)return false;
  const a=this.samples.sort((x,y)=>x-y),median=a[Math.floor(a.length*.5)],lower=a[Math.floor(a.length*.25)],upper=a[Math.floor(a.length*.9)],duration=this.elapsed;
  this.samples=[];this.elapsed=0;
  if(median>38&&lower>32&&this.level<effectProfiles.length-1){
   if(this.recovering)this.recoveryDelay=Math.min(120000,this.recoveryDelay*2);
   this.level++;this.recovering=false;this.reset();return true;
  }
  if(this.level>0&&median<20&&upper<24)this.fastTime+=duration;else this.fastTime=0;
  if(this.fastTime>=this.recoveryDelay){this.level--;this.recovering=true;this.reset();return true;}
  return false;
 }
}
