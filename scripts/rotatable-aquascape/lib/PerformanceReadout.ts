/** Opt-in, local-only measurements for the actual phone/browser. */
export class PerformanceReadout {
 private output=document.createElement('pre');
 private frames:number[][]=[];
 private elapsed=0;
 private report='Warming up…';
 private benchmarkReport='';private testing=false;
 private testButton=document.createElement('button');
 onTest:()=>void=()=>{};
 constructor(private host:HTMLElement,private canvas:HTMLCanvasElement){
  const panel=document.createElement('aside'),copy=document.createElement('button');
  panel.setAttribute('aria-label','Aquarium performance');
  panel.style.cssText='position:fixed;left:8px;top:8px;z-index:10000;max-width:calc(100vw - 32px);padding:10px 12px;background:#071113ee;border:1px solid #72988a;border-radius:8px;color:#eaf5ed;font:12px/1.5 monospace;pointer-events:auto';
  this.output.style.cssText='margin:0 0 7px;white-space:pre-wrap;font:inherit';this.output.textContent=this.report;
  copy.textContent='Copy measurements';copy.type='button';copy.style.cssText='font:inherit;padding:4px 8px;color:inherit;background:#253c34;border:1px solid #72988a;border-radius:4px';
  copy.onclick=async()=>{try{await navigator.clipboard.writeText(this.report);copy.textContent='Copied';}catch{copy.textContent='Select the numbers above to copy';}};
  this.testButton.textContent='Run phone graphics test';this.testButton.type='button';this.testButton.disabled=true;this.testButton.style.cssText=copy.style.cssText+';margin-left:6px';
  this.testButton.onclick=()=>this.onTest();
  panel.style.maxHeight='75vh';panel.style.overflowY='auto';
  panel.append(this.output,copy,this.testButton);document.body.append(panel);
 }
 enableTest(){this.testButton.disabled=false;}
 benchmark(message:string,done:boolean){
  this.testing=!done;this.frames=[];this.elapsed=0;
  this.benchmarkReport=done?message:'';
  this.report=message+`\nBuild: ${new URLSearchParams(location.search).get('v')??'local'}`;
  this.output.textContent=this.report;this.testButton.textContent=done?'Run phone graphics test':'Cancel test';
 }
 update(elapsed:number,simulationMs:number,renderMs:number,animals:readonly number[]=[0,0,0]){
  if(this.testing)return;
  if(elapsed<=0||elapsed>1)return;
  this.frames.push([elapsed*1000,simulationMs,renderMs,...animals]);this.elapsed+=elapsed;
  if(this.elapsed<3)return;
  const median=(column:number)=>{const a=this.frames.map(f=>f[column]).sort((a,b)=>a-b);return a[Math.floor(a.length/2)].toFixed(1);};
  const gpu=this.host.dataset.gpuProfile?JSON.parse(this.host.dataset.gpuProfile):null;
  this.report=`Aquarium performance\nFPS: ${(this.frames.length/this.elapsed).toFixed(1)}\nFrame: ${median(0)} ms\nSimulation: ${median(1)} ms\n  Tetras: ${median(3)} ms\n  Bottom feeders: ${median(4)} ms\n  Shrimp/snails: ${median(5)} ms\nRendering CPU + driver: ${median(2)} ms\nGPU: ${gpu?gpu.medianMs+' ms':this.host.dataset.gpuTiming==='unavailable'?'unavailable':'warming up…'}\nImage: ${this.canvas.width} × ${this.canvas.height}\nBuild: ${new URLSearchParams(location.search).get('v')??'local'}`;
  if(this.benchmarkReport)this.report+='\n\n'+this.benchmarkReport;
  this.output.textContent=this.report;this.frames=[];this.elapsed=0;
 }
}
