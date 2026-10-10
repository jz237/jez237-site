import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createStreetGraph,createTraffic,trafficPose } from '../src/city-traffic.js';
import { roofDetails,insideRoof } from '../src/roof-details.js';
import { buildLandmarkModels } from '../src/landmark-models.js';

const projection={lonToX:x=>x,latToZ:z=>z};
test('landmark façades retain a local anchor far from the scene origin',()=>{
  const packed=buildLandmarkModels({models:[{id:'test',landmark:'test',
    parts:[{type:'box',w:30,d:30,h:100}]}]},
  {anchors:new Map([['test',{lon:1,lat:2}]]),toWorld:()=>[12000,54000],groundAt:()=>5});
  for(let i=0;i<packed.vertexCount;i++){
    assert.equal(packed.facadeOrigin[i*2],12000);assert.equal(packed.facadeOrigin[i*2+1],54000);
    assert.ok(Math.abs(packed.position[i*3]-packed.facadeOrigin[i*2])<=15);
  }
});
test('street graph honors both one-way directions and retains shared intersections',()=>{
  const graph=createStreetGraph({roads:[
    {id:1,oneway:1,width:9,points:[[1,0,0],[2,100,0]]},
    {id:2,oneway:-1,width:9,points:[[2,100,0],[3,100,100]]},
    {id:3,oneway:0,width:12,points:[[2,100,0],[4,200,0]]},
  ]},projection,()=>4);
  assert.deepEqual(graph.edges.map(e=>[e.from.id,e.to.id]),[[1,2],[3,2],[2,4],[4,2]]);
  assert.equal(graph.nodes.get(2).neighbors.size,3);
  const pose=trafficPose({edge:graph.edges[2],distance:50});
  assert.equal(pose.x,150);assert.equal(pose.z,2);assert.equal(pose.ground,4);
});
test('real Philadelphia simulation remains finite and stays on directed streets over ten minutes',async()=>{
  const doc=JSON.parse(await readFile(new URL('../data/city-streets.json',import.meta.url)));
  const p={lonToX:x=>(x+75.17)*85000,latToZ:z=>(39.95-z)*111000};
  const graph=createStreetGraph(doc,p,()=>10),sim=createTraffic(graph,620);
  const initial=sim.cars.map(c=>trafficPose(c));
  for(let i=0;i<12000;i++)sim.update(.05);
  let moved=0;
  for(const [i,car] of sim.cars.entries()){
    assert.ok(car.distance>=0&&car.distance<=car.edge.length);
    assert.ok(car.edge.from.out.includes(car.edge));
    const pos=trafficPose(car);assert.ok(Number.isFinite(pos.x+pos.z+pos.angle));
    if(Math.hypot(pos.x-initial[i].x,pos.z-initial[i].z)>20)moved++;
  }
  assert.ok(moved>sim.cars.length*.8,`${moved} moving vehicles`);
});
test('roof equipment stays inside concave footprints and keeps the original roof elevation',()=>{
  const poly=[0,0,30,0,30,10,10,10,10,30,0,30];
  assert.equal(insideRoof(20,20,poly),false);
  const {parts,ends}=roofDetails([{poly,height:20,minHeight:5,year:1900}]);
  assert.equal(ends[0],6); // centroid is outside the L-shaped roof, so no invented floating equipment.
  assert.ok(parts.every(p=>p.minHeight===25&&p.year===1900));
  const rect=roofDetails([{poly:[0,0,30,0,30,20,0,20],height:20,minHeight:0}]);
  assert.equal(rect.parts.length,6);
  assert.equal(rect.parts.at(-1).minHeight,21.35);
});
