// Rebuild from an Overpass `way[highway];out geom;` response; no runtime API calls.
import {readFile,writeFile} from 'node:fs/promises';
const source=process.argv[2];
if(!source)throw Error('Pass the saved Overpass JSON response path.');
const input=JSON.parse(await readFile(source,'utf8'));
if(input.remark||!input.elements?.length)throw Error('Incomplete street response');
const roads=[];
for(const way of input.elements){
  const t=way.tags||{};
  if(!way.geometry||t.tunnel==='yes'||t.bridge==='yes'||Number(t.layer||0)!==0
    ||['private','no'].includes(t.access)||t.area==='yes')continue;
  const one=t.oneway==='-1'?-1:['yes','1','true'].includes(t.oneway)||t.junction==='roundabout'?1:0;
  const lanes=Math.min(6,Math.max(1,parseInt(t.lanes)||(['primary','secondary'].includes(t.highway)?4:one?1:2)));
  const width=Math.min(25,Math.max(4,parseFloat(t.width)||lanes*3.1+(one?2.2:1.6)));
  const points=way.geometry.map((p,i)=>[way.nodes[i],Number(p.lon.toFixed(6)),Number(p.lat.toFixed(6))]);
  if(points.length<2)continue;
  roads.push({id:way.id,name:t.name||'',kind:t.highway,oneway:one,width,points});
}
const data={version:1,attribution:'© OpenStreetMap contributors, ODbL 1.0',
  source:'https://www.openstreetmap.org/copyright',retrieved:input.osm3s?.timestamp_osm_base,
  bounds:{south:39.935,west:-75.21,north:39.975,east:-75.13},roads};
await writeFile(new URL('../data/city-streets.json',import.meta.url),JSON.stringify(data)+'\n');
console.log(`Compiled ${roads.length} roads with shared nodes and one-way directions.`);
