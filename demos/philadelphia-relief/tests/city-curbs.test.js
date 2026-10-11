import test from 'node:test';
import assert from 'node:assert/strict';
import {createStreetGraph} from '../src/city-traffic.js';
import {createCurbLayout} from '../src/city-curbs.js';

const projection={lonToX:x=>x,latToZ:z=>z};
const square=[[1,0,0],[2,100,0],[3,100,100],[4,0,100],[1,0,0]];
function layout(points,width=10){
  const graph=createStreetGraph({roads:[{id:1,oneway:1,width,points}]},projection,()=>0);
  return {graph,curb:createCurbLayout(graph)};
}

test('curbs meet at square bends without crossing the carriageway',()=>{
  const {graph,curb}=layout(square);
  for(const side of [-1,1])for(const margin of [.35,1.35]){
    const spans=graph.segments.map(segment=>curb(segment,side,margin));
    for(let i=0;i<spans.length;i++){
      const span=spans[i],next=spans[(i+1)%spans.length];
      assert.deepEqual(span.slice(2),next.slice(0,2),'adjoining strips share the same corner');
      for(let t=0;t<=1;t+=.02){
        const x=span[0]+(span[2]-span[0])*t,z=span[1]+(span[3]-span[1])*t;
        for(const edge of graph.segments){
          const dx=(edge.b.x-edge.a.x)/edge.length,dz=(edge.b.z-edge.a.z)/edge.length;
          const along=Math.max(0,Math.min(edge.length,(x-edge.a.x)*dx+(z-edge.a.z)*dz));
          assert.ok(Math.hypot(x-edge.a.x-dx*along,z-edge.a.z-dz*along)>=5.34);
        }
      }
    }
  }
});

test('curb geometry is independent of the source way direction',()=>{
  function spans(points){
    const {graph,curb}=layout(points);
    return graph.segments.flatMap(segment=>[-1,1].map(side=>{
      const span=curb(segment,side,.35);
      return [span.slice(0,2),span.slice(2)].map(p=>p.map(v=>v.toFixed(5)).join(',')).sort().join(':');
    })).sort();
  }
  assert.deepEqual(spans(square),spans([...square].reverse()));
});

test('a width change meets the adjoining curb and open ends retain their mapped endpoint',()=>{
  const graph=createStreetGraph({roads:[
    {id:1,oneway:1,width:10,points:[[1,0,0],[2,100,0]]},
    {id:2,oneway:1,width:14,points:[[2,100,0],[3,100,100]]},
  ]},projection,()=>0),curb=createCurbLayout(graph);
  for(const side of [-1,1]){
    const a=curb(graph.segments[0],side,.35),b=curb(graph.segments[1],side,.35);
    assert.ok(Math.hypot(a[2]-b[0],a[3]-b[1])<1e-9);
    assert.equal(a[0],0);assert.equal(b[3],100);
  }
});

test('intersection openings and acute short bends cannot create long curb spikes',()=>{
  const graph=createStreetGraph({roads:[
    {id:1,oneway:0,width:10,points:[[1,-100,0],[2,0,0],[3,100,0]]},
    {id:2,oneway:0,width:10,points:[[4,0,-100],[2,0,0],[5,0,100]]},
  ]},projection,()=>0),curb=createCurbLayout(graph);
  for(const segment of graph.segments)for(const side of [-1,1]){
    const span=curb(segment,side,.35);
    assert.ok(Math.min(Math.hypot(span[0],span[1]),Math.hypot(span[2],span[3]))>=8);
  }
  const narrow=layout([[1,0,0],[2,8,0],[3,1,.2],[4,120,1]]);
  for(const segment of narrow.graph.segments)for(const side of [-1,1]){
    const span=narrow.curb(segment,side,1.35);if(!span)continue;
    assert.ok(span.every(Number.isFinite));
    assert.ok(Math.hypot(span[0]-segment.a.x,span[1]-segment.a.z)<15);
    assert.ok(Math.hypot(span[2]-segment.b.x,span[3]-segment.b.z)<15);
  }
});
