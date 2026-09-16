// Opt-in diagnostics only. Submission timing excludes GPU presentation, scanout
// and input-device latency; it must never be reported as input-to-photon timing.
export function createRuntimeProbe(capacity=600){
 const names=['interval','cpu','physics','scene','render','lighting','riders','effects','world','foam','particles','cameraAudio'],data=Object.fromEntries(names.map(k=>[k,new Float64Array(capacity)]));
 let count=0,pending=[],consumed=[],latencies=[],renderStart=0,renderMs=0,markTime=0;const sections={};
 const summary=a=>{if(!a.length)return null;const sorted=[...a].sort((a,b)=>a-b),mean=a.reduce((s,v)=>s+v,0)/a.length;return {mean:+mean.toFixed(3),p50:+sorted[Math.floor((a.length-1)*.5)].toFixed(3),p95:+sorted[Math.floor((a.length-1)*.95)].toFixed(3),max:+sorted.at(-1).toFixed(3)};};
 return {
  begin(){renderMs=0;for(const name in sections)sections[name]=0;},mark(name,now){if(name)sections[name]=(sections[name]||0)+now-markTime;markTime=now;},renderBegin(now){renderStart=now;},renderEnd(now){renderMs+=now-renderStart;},
  event(time,now){if(Number.isFinite(time)&&time>=0&&time<=now&&now-time<1000){if(pending.length===128)pending.shift();pending.push(time);}},
  consume(now){for(const time of pending)consumed.push({time,simulation:now-time});pending.length=0;},
  frame(interval,start,physicsStart,sceneStart,end,active){
   if(!active){pending.length=consumed.length=0;return;}
   const i=count++%capacity;for(const name in sections)if(data[name])data[name][i]=sections[name];data.interval[i]=interval;data.cpu[i]=end-start;data.physics[i]=sceneStart-physicsStart;data.scene[i]=end-sceneStart-renderMs;data.render[i]=renderMs;
   for(const sample of consumed){latencies.push({simulation:sample.simulation,submit:end-sample.time});if(latencies.length>capacity)latencies.shift();}consumed.length=0;
  },
  snapshot(){const n=Math.min(count,capacity),timing=Object.fromEntries(names.map(k=>[k,summary(data[k].subarray(0,n))]));return {frames:n,...timing,inputSamples:latencies.length,eventToSimulation:summary(latencies.map(v=>v.simulation)),eventToRenderSubmission:summary(latencies.map(v=>v.submit))};}
 };
}
