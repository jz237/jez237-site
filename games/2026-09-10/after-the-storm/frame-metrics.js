// QA-only rolling window. Includes rendering and simulation; never counts a
// hidden-tab suspension as game throughput. No per-frame sorting or allocation.
export function recordFrame(m,interval,cpu,active=true){
 if(!active||!Number.isFinite(interval)||interval<=0){m.samples=[];m.index=0;return m.summary=null;}
 m.samples??=[];m.index??=0;m.samples[m.index%240]=[interval,cpu];m.index++;
 if(m.index%60===0&&m.samples.length>=60){
  const a=m.samples.map(q=>q[0]).sort((x,y)=>x-y),b=m.samples.map(q=>q[1]).sort((x,y)=>x-y);
  const q=(a,p)=>+a[Math.min(a.length-1,Math.floor(a.length*p))].toFixed(2);
  m.summary={frames:a.length,fps:+(1000*a.length/a.reduce((s,v)=>s+v,0)).toFixed(1),frameP50:q(a,.5),frameP95:q(a,.95),cpuP95:q(b,.95)};
 }
 return m.summary||null;
}
