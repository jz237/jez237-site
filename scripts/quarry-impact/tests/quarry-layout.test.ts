import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { cliffGeometry, landscapeHeight, quarryRim, quarryColliderLayout } from '../src/quarry-layout';
import { terrainHeight, trackPoint } from '../src/rules';

test('quarry cuts preserve the toe and driving surfaces, replacing only the authored sector',()=>{
  const g=cliffGeometry(),toe=[];
  const expected:number[]=[];
  for(let band=0;band<30;band++)for(let cell=0;cell<360;cell++){
    if(cell>=118&&cell<139)continue;
    const b=band*722+cell*2;expected.push(b,b+1,b+2,b+2,b+1,b+3);
  }
  assert.deepEqual(g.indices,new Uint32Array(expected),'exactly the 21 authored cells replace the old cliff faces');
  assert.equal(g.indices.length/3,20340);
  assert.equal(g.positions.length/3,21660);
  for(let i=0;i<=360;i++)toe.push(...g.positions.slice(i*6,i*6+3));
  const toeBytes=new Float32Array(toe);
  assert.equal(createHash('sha256').update(Buffer.from(toeBytes.buffer)).digest('hex'),'d64b40c34902799d0652e219351c0a5053d8695263cb1fb7eb5dd16893bb336a');
  for(let i=0;i<1440;i++){
    const p=trackPoint(i/1440),q=trackPoint((i+.1)/1440),l=Math.hypot(q.x-p.x,q.z-p.z);
    for(const side of [-8,0,8]){
      const x=p.x+(q.z-p.z)/l*side,z=p.z-(q.x-p.x)/l*side;
      assert.equal(landscapeHeight(x,z),terrainHeight(x,z),'road corridor height');
    }
  }
  for(let x=-50;x<=50;x+=2)for(let z=-50;z<=50;z+=2)
    if(Math.hypot(x,z)<=50)assert.equal(landscapeHeight(x,z),0,'arena height');
});

test('authored collision proxy is finite, coherently wound and welded to the retained quarry',()=>{
  const cut=JSON.parse(readFileSync(new URL('../src/quarry-cut-collision.json',import.meta.url),'utf8')) as {
    version:number;sector:{startCell:number;endCellExclusive:number};positions:number[];indices:number[];
  };
  assert.equal(cut.version,1);assert.deepEqual(cut.sector,{startCell:118,endCellExclusive:139});
  assert.ok(cut.positions.length>0&&cut.positions.length%3===0);
  assert.ok(cut.indices.length>0&&cut.indices.length%3===0);
  assert.ok(cut.positions.every(Number.isFinite));
  const count=cut.positions.length/3;
  assert.ok(cut.indices.every(i=>Number.isInteger(i)&&i>=0&&i<count));
  // Keep nearby joint vertices distinct; a millimetre grid falsely collapses
  // the authored bevels. Exported section boundaries share Float32 positions.
  const key=(index:number)=>cut.positions.slice(index*3,index*3+3).map(n=>n.toFixed(5)).join(',');
  const edges=new Map<string,{count:number;orientation:number}>();
  for(let i=0;i<cut.indices.length;i+=3){
    const tri=cut.indices.slice(i,i+3),a=tri[0]*3,b=tri[1]*3,c=tri[2]*3;
    const u=cut.positions.slice(b,b+3).map((v,j)=>v-cut.positions[a+j]);
    const v=cut.positions.slice(c,c+3).map((v,j)=>v-cut.positions[a+j]);
    const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const longestEdgeSquared=Math.max(u.reduce((sum,n)=>sum+n*n,0),v.reduce((sum,n)=>sum+n*n,0),u.reduce((sum,n,j)=>sum+(n-v[j])**2,0));
    assert.ok(Math.hypot(...normal)>Math.max(1e-10,longestEdgeSquared*1e-6),`proxy triangle ${i/3} must be non-degenerate at its own scale`);
    for(let e=0;e<3;e++){
      const from=key(tri[e]),to=key(tri[(e+1)%3]);assert.notEqual(from,to);
      const id=from<to?from+'|'+to:to+'|'+from,edge=edges.get(id)??{count:0,orientation:0};
      edge.count++;edge.orientation+=from<to?1:-1;edges.set(id,edge);
    }
  }
  for(const edge of edges.values()){
    assert.ok(edge.count<=2,'proxy must have no non-manifold welded edges');
    if(edge.count===2)assert.equal(edge.orientation,0,'neighboring triangles must agree on winding');
  }
  const base=cliffGeometry(),stride=722;
  const vertex=(row:number,column:number)=>row===0?column*2:(row-1)*stride+column*2+1;
  const boundary:number[]=[];
  for(let row=0;row<=30;row++)for(const column of [118,139])boundary.push(vertex(row,column));
  for(let column=119;column<139;column++)for(const row of [0,30])boundary.push(vertex(row,column));
  for(const index of boundary){
    const point=base.positions.slice(index*3,index*3+3);let closest=Infinity;
    for(let i=0;i<cut.positions.length;i+=3)closest=Math.min(closest,Math.hypot(cut.positions[i]-point[0],cut.positions[i+1]-point[1],cut.positions[i+2]-point[2]));
    assert.ok(closest<.002,`collision boundary gap at ${Array.from(point)}: ${closest}m`);
  }
  const spec=quarryColliderLayout().find(c=>c.id==='quarry-cut');assert.ok(spec?.shape==='mesh');
  assert.deepEqual(spec.p,{x:0,y:0,z:0});assert.ok(!spec.q||[spec.q.x,spec.q.y,spec.q.z,spec.q.w].every((n,i)=>n===(i===3?1:0)));
  assert.deepEqual(spec.data.positions,new Float32Array(cut.positions));assert.deepEqual(spec.data.indices,new Uint32Array(cut.indices));
});

test('quarry surface is finite, outward ordered and continuous at every join',()=>{
  const g=cliffGeometry(),stride=722;
  for(const a of [g.positions,g.uv,g.colors])assert.ok(Array.from(a).every(Number.isFinite));
  const vertex=(row:number,column:number)=>row===0?column*2:(row-1)*stride+column*2+1;
  for(let i=0;i<=360;i++){
    let radius=-Infinity;
    for(let row=0;row<=30;row++){
      const n=vertex(row,i)*3,r=Math.hypot(g.positions[n]/1.08,g.positions[n+2]);
      assert.ok(r>radius+.01,'radial strips must not fold back');radius=r;
    }
  }
  for(let band=1;band<30;band++)for(let i=0;i<=360;i++){
    const a=((band-1)*stride+i*2+1),b=band*stride+i*2;
    for(let c=0;c<3;c++)assert.ok(Math.abs(g.positions[a*3+c]-g.positions[b*3+c])<1e-5);
    assert.equal(g.uv[a*2],g.uv[b*2]);assert.equal(g.uv[a*2+1],g.uv[b*2+1]);
  }
  for(let band=0;band<30;band++)for(let end=0;end<2;end++){
    const a=band*stride+end,b=band*stride+720+end;
    for(let c=0;c<3;c++)assert.ok(Math.abs(g.positions[a*3+c]-g.positions[b*3+c])<1e-4,'closing seam');
  }
  for(let i=0;i<g.indices.length;i+=3){
    const a=g.indices[i]*3,b=g.indices[i+1]*3,c=g.indices[i+2]*3;
    const ax=g.positions[b]-g.positions[a],az=g.positions[b+2]-g.positions[a+2];
    const bx=g.positions[c]-g.positions[a],bz=g.positions[c+2]-g.positions[a+2];
    assert.ok(az*bx-ax*bz>1e-5,'upward-facing, non-degenerate triangle');
  }
});

test('backing terrain remains below cliff relief above the buried toe',()=>{
  const g=cliffGeometry();
  for(let i=722*3;i<g.positions.length;i+=3){
    const x=g.positions[i],y=g.positions[i+1],z=g.positions[i+2];
    assert.ok(y-landscapeHeight(x,z)>.08,'terrain must not poke through rock');
  }
  for(let i=0;i<=720;i++){
    const rim=quarryRim(i/720*Math.PI*2);
    assert.ok(Number.isFinite(rim.r)&&Number.isFinite(rim.y));assert.ok(rim.r>170&&rim.r<245);
  }
});
