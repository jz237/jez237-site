import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import { attachCircuitCoordinates, circuitFrame, CIRCUIT_ARC_METRES, CIRCUIT_LENGTH, isCircuitAsphaltCell } from '../src/scenery-circuit-layout';
import { surfaceAt } from '../src/rules';
import { circuitBase as base, circuitBefore, assertCircuitPhysicsUnchanged, restoreCircuitObjects } from './circuit-surface-invariants';
import { captureArenaFloor } from '../tools/arena-floor-audit';

const geometry=(data:any)=>{
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(data.positions,3));
  g.setAttribute('normal',new T.Float32BufferAttribute(data.normals,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(data.uv,2));g.setIndex(data.indices);
  for(const group of data.groups??[])g.addGroup(group.start,group.count,group.materialIndex);
  return g;
};

test('circuit material coordinates retain every deployed physics input, collider and sampled grip classification',async()=>{
  await assertCircuitPhysicsUnchanged();
  for(const sample of base.tractionSamples)assert.equal(surfaceAt(sample.x,sample.z),sample.surface,`grip at cell ${sample.cell}, lateral ${sample.lateral}`);
});

test('route metres follow the frozen actual lane, wrap continuously, and preserve distinct lane/shoulder frames',()=>{
  assert.equal(CIRCUIT_LENGTH,base.lengthMetres);assert.equal(CIRCUIT_ARC_METRES.length,361);
  let total=0;
  for(let i=0;i<=360;i++){
    if(i)total+=Math.hypot(base.rows[i].center.x-base.rows[i-1].center.x,base.rows[i].center.z-base.rows[i-1].center.z);
    assert.equal(CIRCUIT_ARC_METRES[i],total);
    const expected=base.rows[i];
    assert.deepEqual(circuitFrame(i),{center:expected.center,tangent:expected.tangent,lateral:expected.lateral,s:expected.s});
    assert.deepEqual(circuitFrame(i,.1),expected.ribbonFrame);
    assert.equal(isCircuitAsphaltCell(i),base.cells[i%360].asphalt&&!base.cells[i%360].authoredGravel);
  }
  assert.equal(isCircuitAsphaltCell(-1),isCircuitAsphaltCell(359));
  assert.ok(Math.hypot(base.rows[360].center.x-base.rows[0].center.x,base.rows[360].center.z-base.rows[0].center.z)<1e-10);
  assert.equal(CIRCUIT_ARC_METRES[0],0);assert.equal(CIRCUIT_ARC_METRES[360],CIRCUIT_LENGTH);
  assert.throws(()=>circuitFrame(.5),RangeError);assert.throws(()=>circuitFrame(361),RangeError);assert.throws(()=>isCircuitAsphaltCell(NaN),RangeError);
});

test('attaching route coordinates changes only one new attribute and preserves the asymmetric shoulder edges',()=>{
  for(const data of [base.lane,...base.shoulders]){
    const g=geometry(data),attributes={...g.attributes},index=g.index,groups=structuredClone(g.groups),drawRange={...g.drawRange};
    const bytes=Object.fromEntries(Object.entries(attributes).map(([key,a])=>[key,Array.from(a.array)]));
    try{
      assert.equal(attachCircuitCoordinates(g,data.lookAheadCells),g);
      assert.deepEqual(Object.keys(g.attributes).sort(),[...Object.keys(attributes),'circuitMetres'].sort());
      for(const [key,a]of Object.entries(attributes)){assert.equal(g.getAttribute(key),a);assert.deepEqual(Array.from(a.array),bytes[key]);}
      assert.equal(g.index,index);assert.deepEqual(g.groups,groups);assert.deepEqual(g.drawRange,drawRange);
      const coordinates=g.getAttribute('circuitMetres');assert.equal(coordinates.count,722);
      for(let i=0;i<722;i++){
        const row=Math.floor(i/2),frame=data.lookAheadCells===.1?base.rows[row].ribbonFrame:base.rows[row];
        const x=data.positions[i*3]-frame.center.x,z=data.positions[i*3+2]-frame.center.z;
        assert.equal(coordinates.getX(i),Math.fround(frame.s));
        assert.equal(coordinates.getY(i),Math.fround(x*frame.lateral.x+z*frame.lateral.z));
        assert.ok(Number.isFinite(coordinates.getY(i)));
      }
      // The original irregular shoulder seam is not geometrically closed. Do
      // not snap it while making the periodic material's longitudinal frame.
      assert.equal(coordinates.getX(0),0);assert.equal(coordinates.getX(720),Math.fround(CIRCUIT_LENGTH));
      if(data.side)assert.notEqual(coordinates.getY(1),coordinates.getY(721));
    }finally{g.dispose();}
  }
  assert.throws(()=>attachCircuitCoordinates(new T.BoxGeometry()),/361/);
});

test('actual road integration changes only lane/shoulder shading and the previous paved wear weights',async()=>{
  const current=await captureArenaFloor();
  restoreCircuitObjects(current.objects);
  assert.deepEqual(current.random,circuitBefore.random);
  assert.deepEqual(current.colliders,circuitBefore.colliders);
  assert.deepEqual(current.arena,circuitBefore.arena);
  assert.deepEqual(current.puddles,circuitBefore.puddles);
  for(const [file,hash]of Object.entries(circuitBefore.protectedFiles))if(file!=='src/scenery-surfaces.ts')assert.equal(current.protectedFiles[file],hash,`${file}: unrelated cars/material sources stay exact`);
});

test('every existing circuit triangle makes the terrain bedrock exposure term exactly zero',()=>{
  let minimum=1,triangles=0;
  for(const data of [base.lane,...base.shoulders])for(let i=0;i<data.indices.length;i+=3){
    const points=[0,1,2].map(k=>new T.Vector3().fromArray(data.positions,data.indices[i+k]*3));
    const n=points[1].sub(points[0]).cross(points[2].sub(points[0])).normalize();
    minimum=Math.min(minimum,Math.abs(n.y));triangles++;
    assert.ok(Math.abs(n.y)>.92,'1-smoothstep(.58,.92,abs(geometricNormal.y)) must remain exactly zero before omitting its unused rock sampler');
  }
  assert.equal(triangles,1924);assert.ok(Math.abs(minimum-.9973031404780198)<1e-12);
});
