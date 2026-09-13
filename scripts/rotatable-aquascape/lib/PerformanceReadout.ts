/** Opt-in, local-only measurements for the actual phone/browser. */
export class PerformanceReadout {
 private output=document.createElement('pre');
 private frames:number[][]=[];
 private elapsed=0;
 private report='Warming up…';
 constructor(private host:HTMLElement,private canvas:HTMLCanvasElement){
  const panel=document.createElement('aside'),copy=document.createElement('button');
  panel.setAttribute('aria-label','Aquarium performance');
  panel.style.cssText='position:fixed;left:8px;top:8px;z-index:10000;max-width:calc(100vw - 32px);padding:10px 12px;background:#071113ee;border:1px solid #72988a;border-radius:8px;color:#eaf5ed;font:12px/1.5 monospace;pointer-events:auto';
  this.output.style.cssText='margin:0 0 7px;white-space:pre-wrap;font:inherit';this.output.textContent=this.report;
  copy.textContent='Copy measurements';copy.type='button';copy.style.cssText='font:inherit;padding:4px 8px;color:inherit;background:#253c34;border:1px solid #72988a;border-radius:4px';
  copy.onclick=async()=>{try{await navigator.clipboard.writeText(this.report);copy.textContent='Copied';}catch{copy.textContent='Select the numbers above to copy';}};
  panel.append(this.output,copy);document.body.append(panel);
 }
 update(elapsed:number,simulationMs:number,renderMs:number){
  if(elapsed<=0||elapsed>1)return;
  this.frames.push([elapsed*1000,simulationMs,renderMs]);this.elapsed+=elapsed;
  if(this.elapsed<3)return;
  const median=(column:number)=>{const a=this.frames.map(f=>f[column]).sort((a,b)=>a-b);return a[Math.floor(a.length/2)].toFixed(1);};
  const gpu=this.host.dataset.gpuProfile?JSON.parse(this.host.dataset.gpuProfile):null;
  this.report=`Aquarium performance\nFPS: ${(this.frames.length/this.elapsed).toFixed(1)}\nFrame: ${median(0)} ms\nSimulation: ${median(1)} ms\nRendering CPU + driver: ${median(2)} ms\nGPU: ${gpu?gpu.medianMs+' ms':this.host.dataset.gpuTiming==='unavailable'?'unavailable':'warming up…'}\nImage: ${this.canvas.width} × ${this.canvas.height}\nBuild: ${new URLSearchParams(location.search).get('v')??'local'}`;
  this.output.textContent=this.report;this.frames=[];this.elapsed=0;
 }
}
