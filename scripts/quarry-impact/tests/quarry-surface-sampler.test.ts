import test from 'node:test';
import assert from 'node:assert/strict';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import { exactMinimumClearance, projectedOverlapAreas } from './mesh-clearance';

test('surface seating uses triangle interpolation, handles boundaries and excludes empty footprint space',()=>{
  // Sloping square at negative coordinates and a separate high triangle leave
  // an intentional empty gap inside their combined bounding box.
  const sampler=createSurfaceSampler({positions:new Float32Array([-2,0,-2,0,2,-2,-2,2,0,0,4,0,4,9,4,6,9,4,4,9,6]),indices:new Uint32Array([0,2,1,1,2,3,4,6,5])},1);
  assert.equal(sampler.triangleCount,3);
  assert.equal(sampler.height(-1,-1),2);assert.equal(sampler.height(-2,-2),0);assert.equal(sampler.height(0,0),4);
  assert.equal(sampler.height(-1.5,-1),1.5);assert.equal(sampler.height(4.5,4.5),9);
  assert.equal(sampler.height(2,2),undefined);assert.equal(sampler.overlaps(2,2),false);
  assert.equal(sampler.overlaps(.49,-1,.5),true);assert.equal(sampler.overlaps(.51,-1,.5),false);
  assert.equal(sampler.overlaps(.3,.3,.4),false);assert.equal(sampler.overlaps(.3,.3,.43),true);
  assert.equal(sampler.overlaps(5.5,5.5,.7),false);assert.equal(sampler.overlaps(5.5,5.5,.72),true);
  assert.equal(sampler.height(NaN,0),undefined);assert.equal(sampler.overlaps(0,Infinity),false);
  assert.throws(()=>createSurfaceSampler({positions:new Float32Array(),indices:new Uint32Array()},0),RangeError);
});

test('clearance audit detects an interior base peak even when every new mesh vertex is above it locally',()=>{
  const base={positions:new Float32Array([-1,0,-1,1,0,-1,1,0,1,-1,0,1,.2,1,.3]),indices:new Uint32Array([0,4,1,1,4,2,2,4,3,3,4,0])};
  const surface={positions:new Float32Array([-1,.2,-1,1,.2,-1,1,.2,1,-1,.2,1]),indices:new Uint32Array([0,3,1,1,3,2])};
  const report=exactMinimumClearance(surface,base);assert.equal(report.coveredTriangles,2);
  assert.ok(Math.abs(report.minimum+.8)<1e-7);assert.ok(Math.abs(report.worst!.point[0]-.2)<1e-7);assert.ok(Math.abs(report.worst!.point[2]-.3)<1e-7);
  for(let i=1;i<surface.positions.length;i+=3)surface.positions[i]=1.2;
  assert.ok(Math.abs(exactMinimumClearance(surface,base).minimum-.2)<1e-7);
});

test('clearance clips vertical/overhanging faces in3D and seating chooses the highest sheet',()=>{
  const base={positions:new Float32Array([-1,0,-1,1,0,-1,1,0,1,-1,0,1,0,1,0]),indices:new Uint32Array([0,4,1,1,4,2,2,4,3,3,4,0])};
  const surface={positions:new Float32Array([0,.4,-1,0,.4,1,0,2,0,-1,2,-1,1,2,-1,0,2,1]),indices:new Uint32Array([0,1,2,3,4,5])};
  const report=exactMinimumClearance(surface,base);assert.equal(report.coveredTriangles,2);
  assert.ok(Number.isFinite(report.minimum));assert.ok(Math.abs(report.minimum+.6)<1e-7);
  assert.ok(Math.abs(report.worst!.point[0])<1e-7&&Math.abs(report.worst!.point[2])<1e-7,'vertical face must detect the interior terrain peak');
  const folded={positions:new Float32Array([-1,0,-1,1,0,-1,0,0,1,-1,2,-1,1,2,-1,0,2,1]),indices:new Uint32Array([0,2,1,3,4,5])};
  assert.equal(createSurfaceSampler(folded).height(0,0),2,'camera/fragment seating must use the highest intersected sheet regardless of winding');
});

test('projected coverage detects a narrow missing strip and counts double-covered ground',()=>{
  const surface={positions:new Float32Array([-1,0,-1,1,0,-1,1,0,1,-1,0,1]),indices:new Uint32Array([0,3,1,1,3,2])};
  const base={positions:new Float32Array([-1,0,-1,-.01,0,-1,-.01,0,1,-1,0,1,.01,0,-1,1,0,-1,1,0,1,.01,0,1]),indices:new Uint32Array([0,3,1,1,3,2,4,7,5,5,7,6])};
  const areas=projectedOverlapAreas(surface,base);assert.equal(areas.length,2);
  assert.ok(Math.abs(areas[0]-1.98)<1e-7);assert.ok(Math.abs(areas[1]-1.98)<1e-7);
  const doubled=projectedOverlapAreas(surface,{positions:base.positions,indices:new Uint32Array([...base.indices,...base.indices])});
  assert.ok(Math.abs(doubled.reduce((a,b)=>a+b,0)-7.92)<1e-7);
});
