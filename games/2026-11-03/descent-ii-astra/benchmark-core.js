/* Counts presented frames from the first render, excluding deliberate pauses. */
(()=>{
  function stats(frames){
    const sorted=frames.slice().sort((a,b)=>a-b),total=frames.reduce((a,b)=>a+b,0),slow=sorted.slice(-Math.max(1,Math.ceil(sorted.length*.01)));
    return {fps:total?1000*frames.length/total:0,low:slow.length?1000*slow.length/slow.reduce((a,b)=>a+b,0):0,p95:sorted[Math.max(0,Math.floor((sorted.length-1)*.95))]||0,worst:sorted[sorted.length-1]||0,stutters:frames.filter(n=>n>50).length,frames:frames.length,seconds:total/1000};
  }
  class FlightMeasurement{
    constructor(start){this.start=start;this.first=null;this.last=null;this.lastFrame=-1;this.elapsed=0;this.opening=[];this.sustained=[];}
    firstFrame(now){if(this.first===null){this.first=now;this.last=now;}}
    sample(now,frame,paused){
      if(paused){this.last=null;this.lastFrame=frame;return false;}
      if(this.first===null||!frame||frame===this.lastFrame)return false;
      this.lastFrame=frame;
      if(this.last!==null){const dt=now-this.last;if(dt>0){(this.elapsed<5000?this.opening:this.sustained).push(dt);this.elapsed+=dt;}}
      this.last=now;return this.elapsed>=45000;
    }
    result(){return {version:2,load:this.first===null?0:(this.first-this.start)/1000,...stats([...this.opening,...this.sustained]),opening:stats(this.opening),sustained:stats(this.sustained)};}
  }
  window.astraPerformance={FlightMeasurement,stats};
})();
