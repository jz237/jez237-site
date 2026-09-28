import {restoreCoupeBytes} from './coupe-realism-invariants';
import test from 'node:test';
import {restoreCircuitSurfaceSource} from './circuit-surface-invariants';
import {historicGripBytes} from './circuit-grip-invariants';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { cliffGeometry, terrainGeometry, quarryColliderLayout, quarryWestWallGeometry, quarryWestWallHeight, overlapsQuarryWestWall } from '../src/quarry-layout';
import { collisionMesh, probeSummary, surfaceProbes } from './quarry-cut-probes';
import { exactMinimumClearance } from './mesh-clearance';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import { loadQuarryWestWall } from '../src/scenery-west-wall';
import { trackPoint } from '../src/rules';
import {assertWestWallEvolution,stripWestSource,westArrayHash as westWallArrayHash} from './quarry-west-wall-invariants';
import {prepareEastBayInputs} from './quarry-east-bay-invariants';

const read=(path:string)=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const baseline=read('./fixtures/quarry-west-wall-baseline.json');
const base=read('../source/models/quarry-west-wall-base.json') as {startCell:number;endCellExclusive:number;rows:{p:number[];uv:number[]}[][]};
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const hashArray=(a:Float32Array|Uint32Array)=>hash(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
const pointKey=(p:ArrayLike<number>,i:number)=>[p[i],p[i+1],p[i+2]].map(Math.fround).join(',');
const triangleKey=(points:string[])=>points.sort().join('|');
const triangles=(positions:ArrayLike<number>,indices:ArrayLike<number>)=>{
  const set=new Set<string>();
  for(let i=0;i<indices.length;i+=3)set.add(triangleKey([0,1,2].map(k=>pointKey(positions,indices[i+k]*3))));
  return set;
};
function originalApron(){
  const result=new Set<string>();
  for(let row=0;row<6;row++)for(let col=0;col<50;col++){
    const a=base.rows[row][col].p,b=base.rows[row+1][col].p,c=base.rows[row][col+1].p,d=base.rows[row+1][col+1].p;
    result.add(triangleKey([a,b,c].map(p=>pointKey(p,0))));result.add(triangleKey([c,b,d].map(p=>pointKey(p,0))));
  }
  return result;
}
function closureBoundary(g:ReturnType<typeof quarryWestWallGeometry>,data:ReturnType<typeof read>){
  const edges=new Map<string,{count:number;a:T.Vector3;b:T.Vector3}>(),range=data.toeClosure;
  assert.ok(range&&range.firstTriangle>0&&range.triangleCount>0,'only additive toe closure may follow the accepted wall');
  assert.equal(range.firstTriangle+range.triangleCount,g.indices.length/3);
  for(let i=range.firstTriangle*3;i<(range.firstTriangle+range.triangleCount)*3;i+=3)for(let e=0;e<3;e++){
    const a=g.indices[i+e]*3,b=g.indices[i+(e+1)%3]*3,pa=pointKey(g.positions,a),pb=pointKey(g.positions,b),key=pa<pb?pa+'|'+pb:pb+'|'+pa;
    const edge=edges.get(key)??{count:0,a:new T.Vector3().fromArray(g.positions,a),b:new T.Vector3().fromArray(g.positions,b)};edge.count++;edges.set(key,edge);
  }
  return new Map([...edges].filter(([,e])=>e.count===1));
}

test('west wall changes only the exact sector, intersecting stable scatter and explicit new solid shapes',async()=>{
  await prepareEastBayInputs();
  const cliff=cliffGeometry(),terrain=terrainGeometry();
  assert.equal(hashArray(terrain.positions),baseline.terrain.positions);assert.equal(hashArray(terrain.indices),baseline.terrain.indices);
  assert.equal(hashArray(cliff.uv),baseline.cliff.uv);assert.equal(hashArray(cliff.colors),baseline.cliff.colors);
  const restored=assertWestWallEvolution(quarryColliderLayout());assert.equal(restored.length,2287);
  for(const file of ['src/quarry-layout.ts','src/world.ts','src/main.ts'])stripWestSource(file,readFileSync(new URL('../'+file,import.meta.url)));
  for(const [file,sha]of Object.entries(baseline.files)){
    if(['src/quarry-layout.ts','src/world.ts','src/main.ts'].includes(file))continue;
    const bytes=restoreCoupeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
    assert.equal(hash(bytes),sha,file+' retains released bytes outside the explicitly validated later circuit integration');
  }
});

test('west-wall is finite, consistently wound and preserves all perimeter vertices and lower apron planes',()=>{
  const g=quarryWestWallGeometry(),keys=new Set<string>(),edges=new Map<string,{count:number;orientation:number}>();
  assert.ok(Array.from(g.positions).every(Number.isFinite));
  assert.ok(Array.from(g.indices).every(i=>Number.isInteger(i)&&i>=0&&i<g.positions.length/3));
  for(let i=0;i<g.positions.length;i+=3)keys.add(pointKey(g.positions,i));
  for(let row=0;row<=30;row++)for(let col=0;col<=50;col++)if(row<=6||row===30||col===0||col===50)
    assert.ok(keys.has(pointKey(base.rows[row][col].p,0)),`preserved boundary/apron vertex ${row}/${col} is missing`);
  const allTriangles=triangles(g.positions,g.indices);
  for(const triangle of originalApron())assert.ok(allTriangles.has(triangle),'preserved lower six rows must retain actual triangle planes and diagonals');
  for(let i=0;i<g.indices.length;i+=3){
    const ids=[g.indices[i],g.indices[i+1],g.indices[i+2]],a=new T.Vector3().fromArray(g.positions,ids[0]*3),b=new T.Vector3().fromArray(g.positions,ids[1]*3),c=new T.Vector3().fromArray(g.positions,ids[2]*3);
    const u=b.clone().sub(a),v=c.clone().sub(a),cross=u.clone().cross(v);
    const longest=Math.max(u.lengthSq(),v.lengthSq(),b.distanceToSquared(c));
    assert.ok(cross.length()>Math.max(1e-10,longest*1e-6),`non-degenerate wall triangle ${i/3}`);
    for(let edge=0;edge<3;edge++){
      const from=pointKey(g.positions,ids[edge]*3),to=pointKey(g.positions,ids[(edge+1)%3]*3),key=from<to?from+'|'+to:to+'|'+from;
      const item=edges.get(key)??{count:0,orientation:0};item.count++;item.orientation+=from<to?1:-1;edges.set(key,item);
    }
  }
  const perimeter:T.Line3[]=[];
  for(let row=0;row<30;row++)for(const col of [0,50])perimeter.push(new T.Line3(new T.Vector3().fromArray(base.rows[row][col].p),new T.Vector3().fromArray(base.rows[row+1][col].p)));
  for(let col=0;col<50;col++)for(const row of [0,30])perimeter.push(new T.Line3(new T.Vector3().fromArray(base.rows[row][col].p),new T.Vector3().fromArray(base.rows[row][col+1].p)));
  const data=read('../src/quarry-west-wall-collision.json'),closure=closureBoundary(g,data),nearest=new T.Vector3();
  for(const [key,edge] of edges){
    assert.ok(edge.count<=2,'no non-manifold welded wall edge');
    if(edge.count===2)assert.equal(edge.orientation,0,'adjacent wall triangles must agree on winding');
    else for(const point of key.split('|').map(s=>new T.Vector3(...s.split(',').map(Number) as [number,number,number])))
      assert.ok(closure.has(key)||perimeter.some(line=>line.closestPointToPoint(point,true,nearest).distanceTo(point)<3e-5),`open wall edge away from the preserved perimeter or independently checked toe closure: ${key}`);
  }
  const apron=originalApron(),upper:number[]=[];
  for(let i=0;i<data.toeClosure.firstTriangle*3;i+=3){const ids=[g.indices[i],g.indices[i+1],g.indices[i+2]];if(!apron.has(triangleKey(ids.map(index=>pointKey(g.positions,index*3)))))upper.push(...ids);}
  const clearance=exactMinimumClearance({positions:g.positions,indices:new Uint32Array(upper)},terrainGeometry());
  assert.equal(clearance.coveredTriangles,upper.length/3);
  assert.ok(clearance.minimum>=-.0001,`backing terrain must not emerge through the new wall: ${JSON.stringify(clearance)}`);
});

test('additive toe closure keeps original apron triangles and seals every exposed edge into exact terrain',()=>{
  const data=read('../src/quarry-west-wall-collision.json'),g=quarryWestWallGeometry(),boundary=closureBoundary(g,data),terrain=terrainGeometry(),ground=createSurfaceSampler(terrain);
  const toe=base.rows[0].map(p=>new T.Vector3().fromArray(p.p)),key=(a:T.Vector3,b:T.Vector3)=>[a.toArray().join(','),b.toArray().join(',')].sort().join('|');
  const upperKeys=new Set(toe.slice(1).map((b,i)=>key(toe[i],b)));
  for(const id of upperKeys)assert.ok(boundary.has(id),'closure retains each complete original upper toe edge, with no T-junctions');
  const fullEdges=new Map<string,number>();
  for(let i=0;i<g.indices.length;i+=3)for(let e=0;e<3;e++){
    const a=new T.Vector3().fromArray(g.positions,g.indices[i+e]*3),b=new T.Vector3().fromArray(g.positions,g.indices[i+(e+1)%3]*3),id=key(a,b);fullEdges.set(id,(fullEdges.get(id)??0)+1);
  }
  for(const id of upperKeys)assert.equal(fullEdges.get(id),2,'every retained apron toe edge must be joined to its closure');
  function toeHeight(p:T.Vector3){
    for(let i=0;i<toe.length-1;i++){
      const a=toe[i],b=toe[i+1],dx=b.x-a.x,dz=b.z-a.z,t=((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz);
      if(t>=-1e-5&&t<=1+1e-5&&Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz)<3e-5)return a.y+(b.y-a.y)*t;
    }
    assert.fail('closure point leaves the frozen toe footprint');
  }
  const floor=(p:T.Vector3)=>Math.min(ground.height(p.x,p.z)!-.02,toeHeight(p)-.02);
  const endpoint=(p:T.Vector3)=>[toe[0],toe[50]].some(a=>Math.hypot(p.x-a.x,p.z-a.z)<3e-5);
  const axis=Array.from({length:193},(_,i)=>terrain.positions[i*3]);
  let bottomEdges=0;
  for(const [id,e] of boundary){
    if(upperKeys.has(id))continue;
    if(Math.hypot(e.a.x-e.b.x,e.a.z-e.b.z)<3e-5){
      assert.ok(endpoint(e.a)&&endpoint(e.b),'only the two angular ends may have an exposed vertical boundary');continue;
    }
    bottomEdges++;
    for(const p of [e.a,e.b])assert.ok(Math.abs(p.y-floor(p))<1e-4,'lower chain vertices sit20mm into exact terrain or already buried toe');
    const dx=e.b.x-e.a.x,dz=e.b.z-e.a.z,ts=new Set([0,1]);
    for(const value of axis){if(Math.abs(dx)>1e-8){const t=(value-e.a.x)/dx;if(t>0&&t<1)ts.add(t);}if(Math.abs(dz)>1e-8){const t=(value-e.a.z)/dz;if(t>0&&t<1)ts.add(t);}}
    // Intersect all actual coarse cell diagonals near this short lower edge.
    for(let ix=0;ix<192;ix++)if(axis[ix]<=Math.max(e.a.x,e.b.x)&&axis[ix+1]>=Math.min(e.a.x,e.b.x))
      for(let iz=0;iz<192;iz++)if(axis[iz]<=Math.max(e.a.z,e.b.z)&&axis[iz+1]>=Math.min(e.a.z,e.b.z)){
        const x=axis[ix+1],z=axis[iz],sx=axis[ix]-x,sz=axis[iz+1]-z,det=dx*sz-dz*sx;
        if(Math.abs(det)>1e-10){const t=((x-e.a.x)*sz-(z-e.a.z)*sx)/det,u=((x-e.a.x)*dz-(z-e.a.z)*dx)/det;if(t>0&&t<1&&u>=0&&u<=1)ts.add(t);}
      }
    const cuts=[...ts].sort((a,b)=>a-b);for(let i=cuts.length-1;i>0;i--)ts.add((cuts[i]+cuts[i-1])/2);
    for(const t of ts){const p=e.a.clone().lerp(e.b,t);assert.ok(p.y<=floor(p)+1e-4,'no lower edge may lift above the exact terrain between grid/diagonal crossings');}
  }
  assert.ok(bottomEdges>=30,'all wrapped toe cells need a terrain-seated bottom edge');
  for(let i=data.toeClosure.firstTriangle*3;i<g.indices.length;i+=3){
    const a=new T.Vector3().fromArray(g.positions,g.indices[i]*3),b=new T.Vector3().fromArray(g.positions,g.indices[i+1]*3),c=new T.Vector3().fromArray(g.positions,g.indices[i+2]*3);
    const normal=b.sub(a).cross(c.sub(a));assert.ok(normal.dot(new T.Vector3(-a.x,0,-a.z))>0,'closure faces inward without reversed/overlapping fan triangles');
  }
});

test('west wall stays outside the arena and every protected road corridor',()=>{
  const data=read('../src/quarry-west-wall-collision.json');
  assert.deepEqual(data.sector,{startCell:275,endCellExclusive:325,cellRanges:[[275,325]]});
  for(let i=0;i<1440;i++){
    const p=trackPoint(i/1440),q=trackPoint((i+.1)/1440),length=Math.hypot(q.x-p.x,q.z-p.z);
    for(const side of [-8,0,8])assert.equal(quarryWestWallHeight(p.x+(q.z-p.z)/length*side,p.z-(q.x-p.x)/length*side),undefined);
  }
  for(let x=-50;x<=50;x+=5)for(let z=-50;z<=50;z+=5)if(Math.hypot(x,z)<=50)assert.equal(quarryWestWallHeight(x,z),undefined);
});

test('every west-wall near-wall triangle is the exact authoritative triangle and exposed faces agree bidirectionally',async()=>{
  const bytes=readFileSync(new URL('../public/models/quarry-west-wall.glb',import.meta.url));
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString('utf8'));
  assert.equal(json.images?.length??0,0);assert.equal(json.textures?.length??0,0);
  const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);
  const visible:T.Mesh[]=[],geometry=quarryWestWallGeometry(),proxy=collisionMesh(Array.from(geometry.positions),Array.from(geometry.indices),'west-wall-proxy');
  const actual=new Set<string>(),expected=triangles(geometry.positions,geometry.indices);let renderedTriangles=0;
  try {
    gltf.scene.traverse(o=>{
      if(!(o instanceof T.Mesh)||!/^WestWallRock_[0-2]_near$/.test(o.name))return;
      assert.ok(o.matrixWorld.elements.every((n,i)=>Math.abs(n-(i%5===0?1:0))<1e-6));visible.push(o);
      const p=o.geometry.getAttribute('position'),idx=o.geometry.index;
      renderedTriangles+=(idx?.count??p.count)/3;
      for(let i=0;i<(idx?.count??p.count);i+=3){
        const points=[0,1,2].map(k=>{const j=idx?idx.getX(i+k):i+k;return [p.getX(j),p.getY(j),p.getZ(j)].map(Math.fround).join(',');});actual.add(triangleKey(points));
      }
    });
    assert.equal(visible.length,3);assert.equal(renderedTriangles,geometry.indices.length/3);assert.deepEqual(actual,expected,'wall collision must match every visible near-LOD triangle without simplification');
    for(const [label,source,target] of [['render',visible,[proxy]],['physics',[proxy],visible]] as const){
      const report=probeSummary(surfaceProbes([...source],[...target]));
      assert.ok(report.count>300,`${label} needs exposed-face coverage`);assert.equal(report.missing,0);
      assert.ok(report.max<.002,`${label} contact mismatch: ${JSON.stringify(report.worst[0])}`);
    }
  } finally {
    const materials=new Set<T.Material>();gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});materials.forEach(m=>m.dispose());proxy.geometry.dispose();(proxy.material as T.Material).dispose();
  }
});

test('west-wall rubble hulls stay finite, inside the shared footprint and seated on real wall triangles',()=>{
  const data=read('../src/quarry-west-wall-collision.json') as {solids:{id:string;points:number[]}[]};
  assert.ok(data.solids.length>0);assert.equal(new Set(data.solids.map(s=>s.id)).size,data.solids.length);
  const layout=new Map(quarryColliderLayout().map(s=>[s.id,s])),terrain=createSurfaceSampler(terrainGeometry());
  const manifest=read('../source/models/quarry-west-wall-manifest.json'),track=Array.from({length:1440},(_,i)=>trackPoint(i/1440));
  const toe=base.rows[0].map(p=>new T.Vector3().fromArray(p.p)),nearest=new T.Vector3();
  for(const solid of data.solids){
    const spec=manifest.rubbleSpecifications[Number(solid.id.split('-').at(-1))];assert.ok(spec?.large,'every solid maps to an explicit authored large fragment');
    assert.ok(solid.points.length>=12&&solid.points.length%3===0&&solid.points.every(Number.isFinite));
    let minimum=Infinity;
    for(let i=0;i<solid.points.length;i+=3){
      const x=Math.fround(solid.points[i]),y=Math.fround(solid.points[i+1]),z=Math.fround(solid.points[i+2]),height=quarryWestWallHeight(x,z);
      if(height===undefined){
        assert.equal(spec.talusFoot,true,'only declared foot-fan fragments may extend outside wall');
        const point=new T.Vector3(x,0,z),distance=Math.min(...toe.slice(1).map((b,i)=>new T.Line3(toe[i].clone().setY(0),b.clone().setY(0)).closestPointToPoint(point,true,nearest).distanceTo(point)));
        assert.ok(distance<=2+spec.diameter*.5,solid.id+' stays within the bounded two-metre toe fan plus its radius');
      }
      assert.ok(Math.hypot(x,z)>50&&track.every(p=>Math.hypot(p.x-x,p.z-z)>8),'new rubble must leave every driving corridor clear');
      minimum=Math.min(minimum,y-Math.max(height??-Infinity,terrain.height(x,z)!));
    }
    assert.ok(minimum<=.01,`${solid.id} must touch or enter exact ground, observed minimum ${minimum}m`);
    const collider=layout.get('quarry-west-wall-solid-'+solid.id);assert.ok(collider?.shape==='hull');assert.deepEqual(collider.p,{x:0,y:0,z:0});assert.deepEqual(collider.points,new Float32Array(solid.points));
  }
});

test('actual west-wall loader preserves positions, correct UV conventions and closed mixed-LOD boundaries',async()=>{
  const bytes=readFileSync(new URL('../public/models/quarry-west-wall.glb',import.meta.url));
  const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);
  const expected=new Map<string,{positions:Float32Array;uv:Float32Array}>(),boundaries=new Map<number,Set<string>[]>();
  gltf.scene.traverse(o=>{
    if(!(o instanceof T.Mesh))return;
    assert.match(o.name,/^WestWall(Rock|Rubble)_[0-2]_(near|far)$/);
    const positions=new Float32Array(o.geometry.attributes.position.array),uv=new Float32Array(o.geometry.attributes.uv.array);
    expected.set(o.name,{positions,uv});
    if(!o.name.startsWith('WestWallRock'))return;
    for(const angle of [275,292,309,325]){
      const points=new Set<string>();
      for(let i=0;i<positions.length;i+=3)if(Math.abs(((Math.atan2(positions[i]/1.08,positions[i+2])*180/Math.PI+360)%360)-angle)<2e-5)points.add(pointKey(positions,i));
      if(points.size){const list=boundaries.get(angle)??[];list.push(points);boundaries.set(angle,list);}
    }
  });
  assert.equal(expected.size,12);
  for(const [angle,sets] of boundaries){
    assert.equal(sets.length,angle===275||angle===325?2:4);
    for(const points of sets)assert.deepEqual(points,sets[0],`${angle}° near/far/adjacent sections must use exactly the same boundary vertices`);
  }
  const originalLoad=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async()=>gltf;
  const parent=new T.Group(),rock=new T.MeshStandardMaterial(),rubble=new T.MeshStandardMaterial();
  try {
    const lods=await loadQuarryWestWall(parent,rock,rubble);parent.updateMatrixWorld(true);assert.equal(lods.length,3);
    const materials=new Set<T.Material>();
    for(const lod of lods){
      assert.equal(lod.autoUpdate,false);assert.deepEqual(lod.levels.map(l=>l.distance),[0,120]);
      for(const level of lod.levels){assert.equal(level.object.children.length,2);
        for(const mesh of level.object.children){
          assert.ok(mesh instanceof T.Mesh);assert.equal(mesh.castShadow,true);assert.equal(mesh.receiveShadow,true);
          assert.ok(!Array.isArray(mesh.material));materials.add(mesh.material);
          const before=expected.get(mesh.name)!,p=mesh.geometry.getAttribute('position'),uv=mesh.geometry.getAttribute('uv'),wall=mesh.name.startsWith('WestWallRock');
          if(wall)assert.equal(mesh.material,rock);
          for(let i=0;i<p.count;i++){
            const worldPoint=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);
            assert.ok(worldPoint.distanceTo(new T.Vector3().fromArray(before.positions,i*3))<3e-5,'recentering must preserve world geometry');
            assert.equal(uv.getX(i),before.uv[i*2]);assert.equal(uv.getY(i),wall?Math.fround(1-before.uv[i*2+1]):before.uv[i*2+1]);
          }
        }
      }
    }
    assert.equal(materials.size,2,'all sections share only wall and rubble materials');
  } finally {
    GLTFLoader.prototype.loadAsync=originalLoad;const materials=new Set<T.Material>();
    parent.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});materials.forEach(m=>m.dispose());rock.dispose();rubble.dispose();
  }
});

test('preserved apron uses the original smooth per-band normals rather than triangular face normals',async()=>{
  const normalSource={bands:read('../source/models/quarry-west-wall-base.json').apronNormals},frozen=read('../source/models/quarry-west-wall-base.json');
  const bytes=readFileSync(new URL('../public/models/quarry-west-wall.glb',import.meta.url)),gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');
  const expected=new Map<string,{points:number[][];normals:number[][]}[]>();
  for(let band=0;band<6;band++)for(let column=0;column<50;column++)for(const corners of [[[band,column],[band+1,column],[band,column+1]],[[band,column+1],[band+1,column],[band+1,column+1]]]){
    const points=corners.map(([r,c])=>base.rows[r][c].p),normals=corners.map(([r,c])=>normalSource.bands[band][c][r-band]);
    expected.set(triangleKey(points.map(p=>pointKey(p,0))),[{points,normals}]);
  }
  let checked=0,maximum=0;
  try{
    gltf.scene.traverse(o=>{if(!(o instanceof T.Mesh)||!/^WestWallRock_[0-2]_near$/.test(o.name))return;
      const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,idx=o.geometry.index!;
      for(let i=0;i<idx.count;i+=3){const ids=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)],points=ids.map(j=>[p.getX(j),p.getY(j),p.getZ(j)]),entry=expected.get(triangleKey(points.map(p=>pointKey(p,0))))?.[0];if(!entry)continue;
        for(let k=0;k<3;k++){
          const point=points[k],at=entry.points.findIndex(p=>pointKey(p,0)===pointKey(point,0));assert.ok(at>=0);
          const angle=Math.atan2(point[0]/1.08,point[2])*180/Math.PI;if(Math.abs(((angle+360)%360)-275)<1e-4||Math.abs(((angle+360)%360)-325)<1e-4)continue; // Independently pinned adjoining section normals.
          const delta=Math.hypot(...entry.normals[at].map((v,j)=>v-n.getComponent(ids[k],j)));maximum=Math.max(maximum,delta);checked++;
        }
      }
    });assert.ok(checked>900,'full apron, not only its two angular boundaries');assert.ok(maximum<5e-4,'Blender custom-normal quantization maximum must stay below .029 degrees: '+maximum);
  }finally{gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
});
