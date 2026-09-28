import test from 'node:test';
import {historicGripBytes} from './circuit-grip-invariants';
import { assertNorthForestEvolution } from './north-forest-invariants';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { landscapeHeight, terrainGeometry, cliffGeometry, quarryExtensionGeometry, quarryRoadsideGeometry, quarryRoadsideHeight, scenerySurfaceHeight, overlapsQuarryRoadside, quarryColliderLayout, rockPlacements, screePlacements, nearTrees } from '../src/quarry-layout';
import { trackPoint } from '../src/rules';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import { exactMinimumClearance } from './mesh-clearance';

const baseline=JSON.parse(readFileSync(new URL('./fixtures/quarry-roadside-baseline.json',import.meta.url),'utf8'));
const hash=(data:Uint8Array)=>createHash('sha256').update(data).digest('hex');
const hashArray=(data:Float32Array|Float64Array|Uint32Array)=>hash(Buffer.from(data.buffer,data.byteOffset,data.byteLength));

test('roadside additions preserve every baseline road/arena sample and existing terrain/cut geometry',()=>{
  const road:number[]=[],arena:number[]=[];
  for(let i=0;i<1440;i++){
    const p=trackPoint(i/1440),q=trackPoint((i+.1)/1440),length=Math.hypot(q.x-p.x,q.z-p.z);
    for(const side of [-8,-6,-3,0,3,6,8]){
      const x=p.x+(q.z-p.z)/length*side,z=p.z-(q.x-p.x)/length*side;
      road.push(x,landscapeHeight(x,z),z);
    }
  }
  for(let x=-50;x<=50;x+=2)for(let z=-50;z<=50;z+=2)
    if(Math.hypot(x,z)<=50)arena.push(x,landscapeHeight(x,z),z);
  assert.equal(road.length/3,baseline.roadSamples);assert.equal(hashArray(new Float64Array(road)),baseline.roadSHA256);
  assert.equal(arena.length/3,baseline.arenaSamples);assert.equal(hashArray(new Float64Array(arena)),baseline.arenaSHA256);
  const terrain=terrainGeometry(),cliff=cliffGeometry();
  assert.equal(hashArray(terrain.positions),baseline.terrainPositionSHA256,'additive patch must not resample the underlying terrain');
  assert.equal(hashArray(terrain.indices),baseline.terrainIndexSHA256);
  assert.equal(hashArray(cliff.positions),baseline.cliffPositionSHA256);
  // The later wall extension replaces33 cells; its exact retained triangle
  // list is independently checked in quarry-extension.test.ts.
  for(const [path,expected] of Object.entries(baseline.files)){
    if(path==='src/quarry-layout.ts')continue; // New shared helpers belong here.
    assert.equal(hash(historicGripBytes(path,readFileSync(new URL('../'+path,import.meta.url)))),expected,`${path} remains exact outside the later grip correction`);
  }
});

test('every roadside/base triangle intersection remains additive, including old terrain grid crossings',()=>{
  const surface=quarryRoadsideGeometry(),report=exactMinimumClearance(surface,terrainGeometry());
  assert.equal(report.coveredTriangles,surface.indices.length/3);
  assert.ok(report.minimum>=.012-.0001,`authored deposit lost its12mm minimum terrain clearance: ${JSON.stringify(report)}`);
});

test('roadside surface is finite, upward wound, exactly sampled and remains outside the preserved road',()=>{
  const data=JSON.parse(readFileSync(new URL('../src/quarry-roadside-data.json',import.meta.url),'utf8')),g=quarryRoadsideGeometry();
  assert.equal(data.version,1);assert.ok(g.positions.length>=data.surface.rows*data.surface.columns*3,'conforming intersections may append vertices after the original grid');
  const footprint=JSON.parse(readFileSync(new URL('./fixtures/quarry-roadside-footprint.json',import.meta.url),'utf8')) as {rows:number;columns:number;boundary:{index:number;x:number;z:number}[]};
  assert.equal(data.surface.rows,footprint.rows);assert.equal(data.surface.columns,footprint.columns);
  for(const edge of footprint.boundary){assert.equal(g.positions[edge.index*3],edge.x);assert.equal(g.positions[edge.index*3+2],edge.z);}
  assert.ok(Array.from(g.positions).every(Number.isFinite));assert.ok(Array.from(g.indices).every(n=>Number.isInteger(n)&&n>=0&&n<g.positions.length/3));
  for(let i=0;i<g.indices.length;i+=3){
    const [a,b,c]=Array.from(g.indices.slice(i,i+3),n=>n*3),p=g.positions;
    const upward=(p[b+2]-p[a+2])*(p[c]-p[a])-(p[b]-p[a])*(p[c+2]-p[a+2]);assert.ok(upward>0,'non-inverting, non-degenerate projected triangle');
    if(i%51===0){
      const x=(p[a]+p[b]+p[c])/3,y=(p[a+1]+p[b+1]+p[c+1])/3,z=(p[a+2]+p[b+2]+p[c+2])/3;
      assert.ok(Math.abs(quarryRoadsideHeight(x,z)!-y)<1e-7,'sampler must use the exact triangle plane');
      assert.equal(scenerySurfaceHeight(x,z),quarryRoadsideHeight(x,z));assert.ok(overlapsQuarryRoadside(x,z));
    }
  }
  for(let i=0;i<1440;i++){
    const p=trackPoint(i/1440),q=trackPoint((i+.1)/1440),length=Math.hypot(q.x-p.x,q.z-p.z);
    for(const side of [-8,0,8]){const x=p.x+(q.z-p.z)/length*side,z=p.z-(q.x-p.x)/length*side;
      assert.equal(quarryRoadsideHeight(x,z),undefined,'authored mesh must not cover the protected road');assert.equal(scenerySurfaceHeight(x,z),landscapeHeight(x,z));}
  }
  const original=createSurfaceSampler(terrainGeometry());
  for(let column=0;column<data.surface.columns;column++){
    const at=column*3,x=g.positions[at],y=g.positions[at+1],z=g.positions[at+2];
    assert.ok(Math.abs(y-original.height(x,z)!-.012)<2e-5,'road-facing feather edge must follow actual terrain triangles plus12mm');
  }
});

test('roadside filtering preserves surviving legacy colliders and removes overlapping shared scatter',()=>{
  const before=JSON.parse(readFileSync(new URL('./fixtures/quarry-roadside-colliders.json',import.meta.url),'utf8')) as {id:string;hash:string;p:{x:number;y:number;z:number}}[];
  const old=new Map(before.map(s=>[s.id,s])),layout=assertNorthForestEvolution(quarryColliderLayout()),current=new Map(layout.map(s=>[s.id,s]));
  const reseatedTrees=new Set(['tree-fir-0-10','tree-fir-1-5']);
  assert.equal(current.size,layout.length,'collider IDs must be unique');
  for(const spec of layout){
    if(spec.id==='quarry-cliffs')continue; // Exact extension replacement has its own baseline test.
    if(old.has(spec.id)){
      const original=old.get(spec.id)!;
      if(reseatedTrees.has(spec.id)){
        assert.ok(spec.shape==='cylinder');assert.equal(spec.p.y,scenerySurfaceHeight(spec.p.x,spec.p.z)+spec.halfHeight);
        assert.equal(hash(Buffer.from(JSON.stringify({...spec,p:{...spec.p,y:original.p.y}}))),original.hash,`${spec.id} may move vertically only; its XZ, shape and ID must stay fixed`);
      } else assert.equal(hash(Buffer.from(JSON.stringify(spec))),original.hash,`${spec.id} must retain its prior transform and shape`);
    }
    else assert.match(spec.id,/^(quarry-roadside(?:$|-solid-)|quarry-extension(?:$|-solid-)|quarry-headwall(?:$|-solid-)|tree-backdrop-)/,'only accepted authored scenery colliders may be added');
  }
  for(const id of old.keys())if(!current.has(id))assert.match(id,/^(scanned-rock-|scree-|tree-)/,'fixed structures/terrain must remain unchanged');
  for(let variant=0;variant<6;variant++)for(const p of rockPlacements(variant))assert.equal(overlapsQuarryRoadside(p.x,p.z,Math.max(p.sx,p.sz)*.65),false);
  for(const p of screePlacements())assert.equal(overlapsQuarryRoadside(p.x,p.z,Math.max(p.sx,p.sz)),false);
  for(const kind of ['fir-0','fir-1','fir-2'])for(const p of nearTrees(kind))if(!reseatedTrees.has('tree-'+kind+'-'+p.colliderIndex))assert.equal(overlapsQuarryRoadside(p.x,p.z,p.height*.014),false);
  for(const id of reseatedTrees)assert.ok(current.has(id),'the two original medium fir anchors must remain visible and solid');
  const spec=current.get('quarry-roadside');assert.ok(spec?.shape==='mesh');assert.deepEqual(spec.p,{x:0,y:0,z:0});
  const ground=quarryRoadsideGeometry();assert.deepEqual(spec.data.positions,ground.positions);assert.deepEqual(spec.data.indices,ground.indices);
});

test('roadside end seams remain feathered and its solid fragments stay seated on exact ground',()=>{
  const data=JSON.parse(readFileSync(new URL('../src/quarry-roadside-data.json',import.meta.url),'utf8'));
  const cut=JSON.parse(readFileSync(new URL('../src/quarry-cut-collision.json',import.meta.url),'utf8'));
  const visibleBase=[terrainGeometry(),cliffGeometry(),quarryExtensionGeometry(),{positions:new Float32Array(cut.positions),indices:new Uint32Array(cut.indices.slice(0,cut.wallTriangleCount*3))}].map(mesh=>createSurfaceSampler(mesh));
  const ground=quarryRoadsideGeometry();let boundaryVertices=0;
  for(let i=0;i<ground.positions.length;i+=3){
    const x=ground.positions[i],y=ground.positions[i+1],z=ground.positions[i+2],angle=Math.atan2(x/1.08,z)*180/Math.PI;
    if(Math.min(Math.abs(angle-data.sector.startDegrees),Math.abs(angle-data.sector.endDegrees))>1e-4)continue;
    const heights=visibleBase.map(s=>s.height(x,z)).filter((h):h is number=>h!==undefined);assert.ok(heights.length>0);boundaryVertices++;
    assert.ok(y-Math.max(...heights)<=.0121,'angular ends must not create an exposed step beyond the12mm feather');
  }
  assert.ok(boundaryVertices>=data.surface.rows*2,'check original edge vertices and appended terrain crossings');
  for(const solid of data.solids){
    let minimum=Infinity;
    for(let i=0;i<solid.points.length;i+=3){
      const x=Math.fround(solid.points[i]),y=Math.fround(solid.points[i+1]),z=Math.fround(solid.points[i+2]),ground=quarryRoadsideHeight(x,z);
      assert.notEqual(ground,undefined,`${solid.id} must stay within authored ground`);minimum=Math.min(minimum,y-ground!);
    }
    assert.ok(minimum<=.005,`${solid.id} must touch or be buried into actual collision ground`);
  }
});
