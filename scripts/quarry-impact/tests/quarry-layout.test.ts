import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cliffGeometry, landscapeHeight, quarryRim } from '../src/quarry-layout';
import { terrainHeight, trackPoint } from '../src/rules';

test('quarry cuts preserve the toe, grid topology and driving surfaces',()=>{
  const g=cliffGeometry(),toe=[];
  assert.equal(g.indices.length/3,21600);
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
