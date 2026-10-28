/** Opt-in playback diagnostics readable in the browser, including embedded views. */
export class PlaybackStats {
  private output = document.createElement('output');
  private frames: number[] = [];
  private costs: number[] = [];
  private start = 0;
  private firstSimulation = 0;
  private previous = 0;
  private next = 0;
  private timerTicks=0;
  private simulationCosts:number[]=[];
  private renderCosts:number[]=[];
  constructor() {
    this.output.id='playback-profile';this.output.hidden=true;document.body.append(this.output);
    setInterval(()=>this.timerTicks++,16);
  }
  record(now: number, simulation: number, cost: number,simulationCost=0,renderCost=0) {
    if(!this.start){this.start=now;this.firstSimulation=simulation;}
    if(this.previous && now-this.previous<2000){this.frames.push(now-this.previous);this.costs.push(cost);}
    this.previous=now;
    this.simulationCosts.push(simulationCost);this.renderCosts.push(renderCost);
    if(this.simulationCosts.length>600){this.simulationCosts.shift();this.renderCosts.shift();}
    if(now<this.next)return;this.next=now+1000;
    const sorted=[...this.frames].sort((a,b)=>a-b),sum=this.frames.reduce((a,b)=>a+b,0);
    this.output.textContent=JSON.stringify({seconds:(now-this.start)/1000,frames:sorted.length,fps:sorted.length*1000/sum,
      p95:sorted[Math.floor(sorted.length*.95)],worst:sorted.at(-1),over50:sorted.filter(x=>x>50).length,over100:sorted.filter(x=>x>100).length,
      simulationRate:(simulation-this.firstSimulation)/((now-this.start)/1000),cpuMean:this.costs.reduce((a,b)=>a+b,0)/this.costs.length,
      cpuWorst:Math.max(0,...this.costs),simulationP95:[...this.simulationCosts].sort((a,b)=>a-b)[Math.floor(this.simulationCosts.length*.95)],
      renderP95:[...this.renderCosts].sort((a,b)=>a-b)[Math.floor(this.renderCosts.length*.95)],
      recentFps:Math.min(600,this.frames.length)*1000/this.frames.slice(-600).reduce((a,b)=>a+b,0),
      timerRate:this.timerTicks/((now-this.start)/1000),lastFrame:this.frames.at(-1),
      visible:!document.hidden,width:innerWidth,height:innerHeight,dpr:devicePixelRatio});
    // Keep bounded diagnostics even if someone leaves the profile open all day.
    if(this.frames.length>18000){this.frames.splice(0,9000);this.costs.splice(0,9000);}
  }
}
