import test from 'node:test';
import assert from 'node:assert/strict';
import {createStreetGraph,prepareStreetGraph,createTraffic,prepareTraffic,trafficPose}
  from '../src/city-traffic.js';
import {createCurbLayout,prepareCurbLayout} from '../src/city-curbs.js';

const projection={lonToX:x=>x,latToZ:z=>z};
const doc={roads:Array.from({length:200},(_,i)=>({id:i,oneway:0,width:10,
  points:[[i*2,i*200,0],[i*2+1,i*200+100,0]]}))};
const graph=createStreetGraph(doc,projection,()=>4);

test('batched graph and curb preparation preserve shared nodes and every directed approach',async()=>{
  let pauses=0;const options={budget:0,pause:async()=>{pauses++;}};
  const prepared=await prepareStreetGraph(doc,projection,()=>4,options);
  const snapshot=g=>[...g.nodes.values()].map(n=>[n.id,n.x,n.z,n.ground,n.junction,n.signalized,
    [...n.neighbors],n.out.map(e=>[e.id,e.to.id,e.length,e.width,e.lane])]);
  assert.deepEqual(snapshot(prepared),snapshot(graph));
  for(const edge of prepared.edges){
    assert.equal(edge.from,prepared.nodes.get(edge.from.id));
    assert.equal(edge.to,prepared.nodes.get(edge.to.id));assert.ok(edge.from.out.includes(edge));
  }
  const original=createCurbLayout(graph),curbs=await prepareCurbLayout(prepared,options);
  for(const [i,segment] of prepared.segments.entries())for(const side of [-1,1]){
    assert.deepEqual(curbs(segment,side,.35),original(graph.segments[i],side,.35));
  }
  assert.ok(pauses>10,'input can run between graph and curb preparation batches');
});

test('deferred traffic initialization preserves deterministic movement and individual indicators',async()=>{
  let pauses=0;const a=createTraffic(graph,80,239);
  const b=await prepareTraffic(graph,80,239,{budget:0,pause:async()=>{pauses++;}});
  for(let i=0;i<600;i++){a.update(.05);b.update(.05);}
  const snapshot=sim=>sim.cars.map(car=>[car.edge.id,car.distance,car.speed,trafficPose(car),sim.indicator(car)]);
  assert.deepEqual(snapshot(a),snapshot(b));assert.ok(pauses>1);
});

test('all deferred street preparation stages cancel before scheduling another batch',async()=>{
  for(const prepare of [options=>prepareStreetGraph(doc,projection,()=>4,options),
    options=>prepareTraffic(graph,80,239,options),options=>prepareCurbLayout(graph,options)]){
    const controller=new AbortController();let pauses=0;
    await assert.rejects(prepare({signal:controller.signal,budget:0,
      pause:async()=>{pauses++;controller.abort();}}),{name:'AbortError'});
    assert.equal(pauses,1);
  }
});

test('a small junction without spawnable road lengths still supplies its signal phase',()=>{
  const small=createStreetGraph({roads:[
    {id:1,oneway:0,width:8,points:[[1,-15,0],[2,0,0],[3,15,0]]},
    {id:2,oneway:0,width:8,points:[[4,0,-15],[2,0,0],[5,0,15]]},
  ]},projection,()=>0),traffic=createTraffic(small,10);
  assert.equal(traffic.cars.length,0);const before=traffic.signal(small.edges[0]);
  for(let i=0;i<100;i++)traffic.update(.25);
  assert.notEqual(traffic.signal(small.edges[0]),before,'empty streets still cycle their signals');
  for(const edge of small.edges)assert.ok(['red','amber','green'].includes(traffic.signal(edge)));
});
