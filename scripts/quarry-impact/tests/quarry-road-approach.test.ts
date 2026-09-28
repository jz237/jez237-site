import test from 'node:test';
import {historicGripBytes} from './circuit-grip-invariants';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { terrainGeometry, quarryColliderLayout } from '../src/quarry-layout';
import { surfaceAt } from '../src/rules';
import { exactMinimumClearance, projectedOverlapAreas } from './mesh-clearance';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import { assertHeadwallEvolution, headwallBaseline } from './quarry-headwall-invariants';
import { loadQuarryRoadApproach } from '../src/scenery-road-approach';

const read=(path:string)=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const baseline=read('./fixtures/quarry-road-approach-baseline.json');
const base=read('../source/models/quarry-road-approach-base.json');
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const hashArray=(a:Float32Array|Uint32Array)=>hash(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
const mesh=(g:{positions:number[];indices:number[]})=>({positions:new Float32Array(g.positions),indices:new Uint32Array(g.indices)});
const negative=(g:{positions:Float32Array;indices:Uint32Array})=>{const positions=g.positions.slice();for(let i=1;i<positions.length;i+=3)positions[i]=-positions[i];return {positions,indices:g.indices};};
const authored=()=>read('../source/models/quarry-road-approach-data.json');
const sourceMesh=(data:ReturnType<typeof authored>)=>mesh({positions:data.surface.positions,indices:[...data.surface.groups.lane,...data.surface.groups.skirt]});
const positionKey=(p:ArrayLike<number>,i:number)=>[p[i],p[i+1],p[i+2]].map(Math.fround).join(',');
function triangleKeys(positions:ArrayLike<number>,indices:ArrayLike<number>){
  const keys:string[]=[];for(let i=0;i<indices.length;i+=3)keys.push([0,1,2].map(k=>positionKey(positions,indices[i+k]*3)).sort().join('|'));return keys.sort();
}
const parseAsset=async()=>{const bytes=readFileSync(new URL('../public/models/quarry-road-approach.glb',import.meta.url));const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);return gltf;};

test('the authored road approach preserves every physical terrain triangle, collider and handling input',()=>{
  const terrain=terrainGeometry(),colliders=quarryColliderLayout();
  assert.equal(hashArray(terrain.positions),baseline.terrainPositionSHA256);
  assert.equal(hashArray(terrain.indices),baseline.terrainIndexSHA256);
  assert.deepEqual(headwallBaseline.colliders.map((s:{id:string;hash:string})=>({id:s.id,hash:s.hash})),baseline.colliders,
    'historical visual road proof remains exact before the later headwall milestone');
  assertHeadwallEvolution(colliders);
  for(const [path,expected] of Object.entries(baseline.files))if(path!=='src/quarry-layout.ts')
    assert.equal(hash(historicGripBytes(path,readFileSync(new URL('../'+path,import.meta.url)))),expected,`${path} retains accepted bytes outside the explicit later grip correction`);
  assert.equal(base.sector.startCell,123);assert.equal(base.sector.endCellExclusive,182);assert.equal(base.sector.segments,360);
  assert.equal(base.sector.startCell/base.sector.segments,base.sector.movingStartIndex480/480);
  assert.ok(base.lengthMetres>110&&base.lengthMetres<113);
  for(const row of base.lane.rows){assert.equal(row.surface,'gravel');assert.equal(surfaceAt(row.center[0],row.center[2]),'gravel');}
});

test('frozen lane planes retain the measured visual offset from the actual terrain collider',()=>{
  const lane=mesh(base.lane),terrain=terrainGeometry();
  assert.equal(hashArray(lane.positions),baseline.lanePositionSHA256);assert.equal(hashArray(lane.indices),baseline.laneIndexSHA256);
  const minimum=exactMinimumClearance(lane,terrain),maximum=exactMinimumClearance(negative(lane),negative(terrain));
  assert.equal(minimum.coveredTriangles,118);assert.equal(maximum.coveredTriangles,118);
  assert.ok(Math.abs(minimum.minimum-baseline.renderToTerrainGap.minimum)<1e-7);
  assert.ok(Math.abs(-maximum.minimum-baseline.renderToTerrainGap.maximum)<1e-7);
  // The existing render ribbon is raised ~6cm above the terrain, whose coarse
  // triangulation already causes a sub-mm poke-through at one road corner.
  assert.ok(minimum.minimum>-.001);assert.ok(-maximum.minimum<.068);
});

test('actual surviving shoulder ribbons face upward, overlap the lane and omit precisely the authored cells',async()=>{
  const {roadRibbon}=await import('../src/scenery-surfaces');
  for(const side of [-1,1]){
    const geometry=roadRibbon(side*5.78,side*8.6,360,true,true),p=geometry.getAttribute('position'),normal=geometry.getAttribute('normal'),index=geometry.getIndex()!;
    try{
      assert.equal(p.count,722);assert.equal(index.count,(360-59)*6);
      const observedCells=new Set<number>();
      for(let i=0;i<index.count;i+=3){
        const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)],cell=Math.floor(Math.min(...ids)/2);observedCells.add(cell);
        assert.ok(cell<123||cell>=182,'no legacy shoulder can remain beneath the new approach');
        const a=new T.Vector3().fromBufferAttribute(p,ids[0]),b=new T.Vector3().fromBufferAttribute(p,ids[1]),c=new T.Vector3().fromBufferAttribute(p,ids[2]);
        assert.ok(b.sub(a).cross(c.sub(a)).y>0,'both shoulder sides must use upward triangle winding');
        ids.forEach(id=>assert.ok(normal.getY(id)>.99,'visible road normals face up'));
      }
      assert.deepEqual([...observedCells],Array.from({length:360},(_,i)=>i).filter(i=>i<123||i>=182));
      const reference=base.shoulders.find((s:{side:number})=>s.side===side);
      for(const cell of [123,182])for(let edge=0;edge<2;edge++){
        const i=cell*2+edge,j=(cell-123)*6+edge*3;
        for(let axis=0;axis<3;axis++){
          assert.equal(p.getComponent(i,axis),reference.positions[j+axis],'authored end uses the exact corrected shoulder edge');
          assert.ok(Math.abs(normal.getComponent(i,axis)-reference.normals[j+axis])<1e-6,'one-sided end normals agree');
        }
        assert.equal(reference.offsets[(cell-123)*2],side*5.78,'inner shoulder remains within the lane edge without wavering');
      }
    }finally{geometry.dispose();}
  }
});

test('authored approach covers the complete original lane on its exact planes and keeps the thin ground overlay seated',()=>{
  const data=authored(),surface=sourceMesh(data),laneIds:number[]=[];
  for(let i=0;i<surface.indices.length;i+=3){const ids=Array.from(surface.indices.slice(i,i+3));if(ids.every(id=>Math.abs(data.surface.uv[id*2+1])<=6.00001))laneIds.push(...ids);}
  const lane={positions:surface.positions,indices:new Uint32Array(laneIds)},oldLane=mesh(base.lane),terrain=terrainGeometry();
  assert.ok(lane.indices.length>oldLane.indices.length);
  const low=exactMinimumClearance(lane,oldLane),high=exactMinimumClearance(negative(lane),negative(oldLane));
  assert.equal(low.coveredTriangles,lane.indices.length/3);
  assert.ok(Math.abs(low.minimum)<2e-6&&Math.abs(high.minimum)<2e-6,'all new lane triangles must lie on original planes, including the old diagonals');
  const coverage=projectedOverlapAreas(oldLane,lane);let totalError=0;
  for(let i=0;i<coverage.length;i++){
    const a=oldLane.indices[i*3]*3,b=oldLane.indices[i*3+1]*3,c=oldLane.indices[i*3+2]*3,p=oldLane.positions;
    const area=Math.abs((p[b]-p[a])*(p[c+2]-p[a+2])-(p[b+2]-p[a+2])*(p[c]-p[a]))*.5;
    assert.ok(Math.abs(coverage[i]-area)<5e-5,`original triangle${i} must have complete coverage without doubled strips`);totalError+=coverage[i]-area;
  }
  assert.ok(Math.abs(totalError)<.001,'Float32 edge residue must stay below one thousandth of a square metre across the lane');
  const groundLow=exactMinimumClearance(surface,terrain),groundHigh=exactMinimumClearance(negative(surface),negative(terrain));
  assert.equal(groundLow.coveredTriangles,surface.indices.length/3);
  assert.ok(groundLow.minimum>=baseline.renderToTerrainGap.minimum-2e-6,'shoulders cannot introduce new terrain poke-through');
  assert.ok(-groundHigh.minimum<.071,'visual shoulders must remain a thin overlay of the unchanged physical terrain');
  const roadside=read('../src/quarry-roadside-data.json').surface,overlap=projectedOverlapAreas(surface,mesh(roadside)).reduce((a,b)=>a+b,0);
  assert.ok(overlap<.0001,`new road skirt must be trimmed to the old roadside footprint, observed overlap ${overlap}m²`);
  for(let i=0;i<surface.indices.length;i+=3){const a=surface.indices[i]*3,b=surface.indices[i+1]*3,c=surface.indices[i+2]*3,p=surface.positions;
    assert.ok((p[b+2]-p[a+2])*(p[c]-p[a])-(p[b]-p[a])*(p[c+2]-p[a+2])>0,'no downward or degenerate authored ground triangles');
  }
});

test('actual road asset matches the audited surface, retains material masks and joins the old road endpoints',async()=>{
  const data=authored(),gltf=await parseAsset(),meshes=new Map<string,T.Mesh>();gltf.scene.traverse(o=>{if(o instanceof T.Mesh)meshes.set(o.name,o);});
  const maskByPosition=new Map<string,number[]>();for(let i=0;i<data.surface.positions.length;i+=3)maskByPosition.set(positionKey(data.surface.positions,i),data.surface.colors.slice(i/3*4,i/3*4+3));
  assert.equal(meshes.size,6);
  for(const [name,group] of [['RoadLane','lane'],['RoadSkirt','skirt']]){
    const actual=meshes.get(name)!;assert.ok(actual);const geometry=actual.geometry.clone().applyMatrix4(actual.matrixWorld),p=geometry.getAttribute('position'),uv=geometry.getAttribute('uv'),normal=geometry.getAttribute('normal'),color=geometry.getAttribute('color');
    assert.ok(color&&color.itemSize>=3,'the real GLB must contain the RGB material masks');assert.ok(uv&&normal);
    assert.ok(Array.from(p.array).every(Number.isFinite));
    assert.deepEqual(triangleKeys(p.array,geometry.index!.array),triangleKeys(data.surface.positions,data.surface.groups[group]),'the actual GLB must match the audited source triangles');
    const red=Array.from({length:color.count},(_,i)=>color.getX(i)),green=Array.from({length:color.count},(_,i)=>color.getY(i));
    assert.ok(Math.max(...red)-Math.min(...red)>.5);if(name==='RoadLane')assert.ok(Math.max(...green)-Math.min(...green)>.3);
    for(let i=0;i<p.count;i++){assert.ok(normal.getY(i)>.98);const expected=maskByPosition.get(positionKey(p.array,i*3))!;assert.ok(expected);
      for(let k=0;k<3;k++){assert.ok(color.getComponent(i,k)>=0&&color.getComponent(i,k)<=1);assert.ok(Math.abs(color.getComponent(i,k)-expected[k])<2e-4,'actual GLB masks must retain the authored coverage, compaction and drainage');}
    }
    if(name==='RoadLane')for(const row of [0,59])for(let side=0;side<2;side++){
      const at=row*6+side*3,expected=new T.Vector3().fromArray(base.lane.positions,at),matches=[];
      for(let i=0;i<p.count;i++)if(new T.Vector3().fromBufferAttribute(p,i).distanceTo(expected)<2e-5)matches.push(i);
      assert.ok(matches.length,'original lane end corners must be retained exactly');
      // Blender's custom-normal export rounds these direction components to
      // about four decimals; the observed maximum is 0.000050, under0.004°.
      for(const i of matches)for(let k=0;k<3;k++)assert.ok(Math.abs(normal.getComponent(i,k)-base.lane.normals[at+k])<1e-4,'lane end normals must agree with the surviving full road ribbon');
    }
    geometry.dispose();
  }
});

test('actual loader preserves world positions and road-only UV restoration while using two surface draws and bounded fragment LODs',async()=>{
  const gltf=await parseAsset(),expected=new Map<string,{positions:Float32Array;uv:Float32Array}>();
  gltf.scene.traverse(o=>{if(o instanceof T.Mesh){const g=o.geometry.clone().applyMatrix4(o.matrixWorld);expected.set(o.name,{positions:new Float32Array(g.attributes.position.array),uv:new Float32Array(g.attributes.uv.array)});g.dispose();}});
  const original=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async()=>gltf;
  const parent=new T.Group(),lane=new T.MeshStandardMaterial(),skirt=new T.MeshStandardMaterial(),scannedRock=new T.MeshStandardMaterial();
  try{
    const lods=await loadQuarryRoadApproach(parent,{lane,skirt,scannedRock});parent.updateMatrixWorld(true);assert.equal(lods.length,2);
    assert.equal(parent.children.filter(o=>o instanceof T.Mesh).length,2);
    const materials=new Set<T.Material>();let count=0;
    parent.traverse(o=>{if(!(o instanceof T.Mesh))return;count++;const before=expected.get(o.name)!;assert.ok(before);assert.equal(o.castShadow,false);assert.equal(o.receiveShadow,true);assert.ok(!Array.isArray(o.material));materials.add(o.material);
      const ground=o.name==='RoadLane'||o.name==='RoadSkirt',p=o.geometry.getAttribute('position'),uv=o.geometry.getAttribute('uv');
      if(ground){assert.equal(o.material,o.name==='RoadLane'?lane:skirt);assert.ok(o.geometry.hasAttribute('color'));assert.equal(o.geometry.hasAttribute('tangent'),false);}
      for(let i=0;i<p.count;i++){
        const world=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);assert.ok(world.distanceTo(new T.Vector3().fromArray(before.positions,i*3))<2e-5);
        assert.equal(uv.getX(i),before.uv[i*2]);assert.equal(uv.getY(i),ground?Math.fround(1-before.uv[i*2+1]):before.uv[i*2+1]);
      }
    });
    assert.equal(count,6);assert.equal(materials.size,3);
    for(const lod of lods){assert.equal(lod.autoUpdate,false);assert.deepEqual(lod.levels.map(l=>l.distance),[0,65]);}
  }finally{GLTFLoader.prototype.loadAsync=original;const materials=new Set<T.Material>();parent.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});materials.forEach(m=>m.dispose());lane.dispose();skirt.dispose();scannedRock.dispose();}
});

test('small authored road fragments remain grounded and below the visual-only eight-centimetre limit',async()=>{
  const data=authored(),surface=createSurfaceSampler(sourceMesh(data)),terrain=createSurfaceSampler(terrainGeometry());
  const roadside=createSurfaceSampler(mesh(read('../src/quarry-roadside-data.json').surface));
  const ground=(x:number,z:number)=>Math.max(surface.height(x,z)??-Infinity,terrain.height(x,z)??-Infinity,roadside.height(x,z)??-Infinity);
  assert.ok(data.fragments.length>0&&data.fragments.length<=300);
  for(const f of data.fragments){
    assert.ok(f.height>0&&f.height<=.08);assert.ok(f.size>0&&f.size<=.3);
    const at=surface.height(f.x,f.z);assert.ok(at!==undefined,'each fragment centre must lie on the authored footprint');
    assert.ok(f.y<=at+.001&&f.y>=at-.025,'fragments must seat into the real final triangulated surface');
  }
  const gltf=await parseAsset();let vertices=0,maxGap=-Infinity;
  gltf.scene.traverse(o=>{if(!(o instanceof T.Mesh)||!o.name.startsWith('RoadFragments'))return;
    const p=o.geometry.getAttribute('position');for(let i=0;i<p.count;i++){
      const point=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld),gap=point.y-ground(point.x,point.z);vertices++;maxGap=Math.max(maxGap,gap);
      assert.ok(Number.isFinite(gap));assert.ok(gap<=.08,`visual-only fragments cannot create tall collision-free rocks; ${o.name} vertex${i}: ${gap}m`);
    }
  });
  assert.ok(vertices>1000);assert.ok(maxGap>.01);
});

test('authored skirt joins the existing conformed roadside edge and corrected shoulder endpoints without vertical gaps',()=>{
  const data=authored(),surface=sourceMesh(data),edges=new Map<string,{a:number;b:number;count:number}>();
  for(let i=0;i<surface.indices.length;i+=3)for(let e=0;e<3;e++){
    const a=surface.indices[i+e],b=surface.indices[i+(e+1)%3],key=[Math.min(a,b),Math.max(a,b)].join(',');
    const edge=edges.get(key)??{a,b,count:0};edge.count++;edges.set(key,edge);
  }
  const boundaryIds=new Set(Array.from(edges.values()).filter(e=>e.count===1).flatMap(e=>[e.a,e.b]));
  const old=base.roadsideBoundary;let joins=0;
  for(const id of boundaryIds){
    const x=surface.positions[id*3],y=surface.positions[id*3+1],z=surface.positions[id*3+2];let nearest=Infinity,expected=0;
    for(let j=0;j<old.indices.length;j+=2){
      const a=old.indices[j]*3,b=old.indices[j+1]*3,dx=old.positions[b]-old.positions[a],dz=old.positions[b+2]-old.positions[a+2],length=dx*dx+dz*dz;
      const t=Math.max(0,Math.min(1,((x-old.positions[a])*dx+(z-old.positions[a+2])*dz)/length));
      const distance=Math.hypot(x-old.positions[a]-dx*t,z-old.positions[a+2]-dz*t);
      if(distance<nearest){nearest=distance;expected=old.positions[a+1]+t*(old.positions[b+1]-old.positions[a+1]);}
    }
    if(nearest<2e-5){joins++;assert.ok(Math.abs(y-expected)<2e-5,'shared old-roadside perimeter must match height at all conformed crossings');}
  }
  assert.ok(joins>60,'audit must cover the extended roadside join, not only one or two touching corners');
  for(const shoulder of base.shoulders)for(const row of [0,59]){
    const expected=shoulder.positions.slice(row*6+3,row*6+6);let nearest=Infinity;
    for(let i=0;i<surface.positions.length;i+=3)nearest=Math.min(nearest,Math.hypot(...expected.map((n:number,k:number)=>surface.positions[i+k]-n)));
    assert.ok(nearest<2e-5,'old outer shoulder endpoint must survive the new skirt');
  }
});
