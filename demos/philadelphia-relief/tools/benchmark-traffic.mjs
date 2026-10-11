// CPU-only simulation benchmark. This does not measure browser rendering or FPS.
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const source=process.argv[2]?pathToFileURL(process.argv[2]):new URL('../src/city-traffic.js',import.meta.url);
const {createStreetGraph,createTraffic}=await import(source);
const doc=JSON.parse(await readFile(new URL('../data/city-streets.json',import.meta.url)));
const projection={lonToX:x=>(x+75.17)*85000,latToZ:z=>(39.95-z)*111000};
const graph=createStreetGraph(doc,projection,()=>10),times=[],simulationTimes=[];
let digest;
for(let run=0;run<4;run++){
  const sim=createTraffic(graph,620,239),hash=createHash('sha256');
  const started=performance.now();let simulationMs=0;
  for(let second=0;second<600;second++){
    const blockStarted=performance.now();
    for(let step=0;step<20;step++)sim.update(.05,{x:382,z:-56,radius:2070});
    simulationMs+=performance.now()-blockStarted;
    hash.update(JSON.stringify(sim.cars.map(c=>[
      c.edge.id,c.previousEdge?.id,c.nextEdge?.id,c.distance,c.speed,c.braking,c.idleTime])));
  }
  times.push(performance.now()-started);
  simulationTimes.push(simulationMs);
  const current=hash.digest('hex');
  if(digest&&digest!==current)throw new Error('Identical seeded runs diverged');
  digest=current;
}
console.log(JSON.stringify({module:source.href,cars:620,simulatedSeconds:600,
  warmupMs:times[0],measuredMs:times.slice(1),simulationMs:simulationTimes.slice(1),
  trajectorySha256:digest},null,2));
