/** Loading measurements remain in this page; nothing is transmitted. */
export class LoadTiming{
 private marks:Record<string,number>={start:performance.now()};
 constructor(private host:HTMLElement){}
 mark(stage:string){this.marks[stage]=performance.now();}
 finish(){
  this.mark('ready');
  const resources=performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  this.host.dataset.loadSeconds=(this.marks.ready/1000).toFixed(2);
  if(new URLSearchParams(location.search).get('stats')==='1')this.host.dataset.loadTimings=JSON.stringify({marks:this.marks,resources:resources.filter(r=>r.name.startsWith(location.origin)).map(r=>({name:new URL(r.name).pathname.split('/').slice(-2).join('/'),start:r.startTime,end:r.responseEnd,bytes:r.encodedBodySize,transfer:r.transferSize}))});
 }
}
