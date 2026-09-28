import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { cliffGeometry, terrainGeometry, quarryColliderLayout, quarryExtensionGeometry, quarryExtensionHeight, overlapsQuarryExtension, overlapsQuarryHeadwall } from '../src/quarry-layout';
import { collisionMesh, probeSummary, surfaceProbes } from './quarry-cut-probes';
import { exactMinimumClearance } from './mesh-clearance';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import { loadQuarryExtension } from '../src/scenery-extension';

const read=(path:string)=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const baseline=read('./fixtures/quarry-wall-extension-baseline.json');
const base=read('../source/models/quarry-extension-base.json') as {startCell:number;endCellExclusive:number;rows:{p:number[];uv:number[]}[][]};
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
  for(let row=0;row<6;row++)for(let col=0;col<33;col++){
    const a=base.rows[row][col].p,b=base.rows[row+1][col].p,c=base.rows[row][col+1].p,d=base.rows[row+1][col+1].p;
    result.add(triangleKey([a,b,c].map(p=>pointKey(p,0))));result.add(triangleKey([c,b,d].map(p=>pointKey(p,0))));
  }
  return result;
}

test('wall extension replaces only its33 legacy cells and preserves the prior cut, roadside and surviving collider IDs',()=>{
  const cliff=cliffGeometry(),terrain=terrainGeometry(),expected:number[]=[];
  assert.equal(hashArray(cliff.positions),baseline.cliffPositions);
  assert.equal(hashArray(terrain.positions),baseline.terrainPositions);assert.equal(hashArray(terrain.indices),baseline.terrainIndices);
  for(let band=0;band<30;band++)for(let cell=0;cell<360;cell++){
    if((cell>=118&&cell<172)||cell>=350||cell<25)continue;
    const b=band*722+cell*2;expected.push(b,b+1,b+2,b+2,b+1,b+3);
  }
  assert.deepEqual(cliff.indices,new Uint32Array(expected));
  assert.equal(cliff.indices.length/3,16260);
  for(const [path,expected] of Object.entries(baseline.files))if(path!=='src/quarry-layout.ts')
    assert.equal(hash(readFileSync(new URL('../'+path,import.meta.url))),expected,`${path} must retain its accepted bytes`);
  const old=new Map<string,{id:string;hash:string;p:{x:number;y:number;z:number}}>(baseline.colliders.map((s:{id:string})=>[s.id,s]));
  const layout=quarryColliderLayout(),current=new Map(layout.map(s=>[s.id,s]));assert.equal(current.size,layout.length);
  for(const spec of layout){
    if(spec.id==='quarry-cliffs')continue; // Exact replacement independently asserted above.
    if(old.has(spec.id))assert.equal(hash(Buffer.from(JSON.stringify(spec))),old.get(spec.id)!.hash,`${spec.id} must preserve its shape and transform`);
    else assert.match(spec.id,/^(quarry-extension(?:$|-solid-)|quarry-headwall(?:$|-solid-)|tree-backdrop-)/);
  }
  for(const [id,spec] of old)if(!current.has(id)){
    assert.match(id,/^(scanned-rock-|scree-)/,'only intersecting legacy rock scatter may be removed');
    assert.ok(overlapsQuarryExtension(spec.p.x,spec.p.z,12)||overlapsQuarryHeadwall(spec.p.x,spec.p.z,12),`${id} cannot disappear outside the new sector`);
  }
  const spec=current.get('quarry-extension');assert.ok(spec?.shape==='mesh');assert.deepEqual(spec.p,{x:0,y:0,z:0});
  assert.deepEqual(spec.data,quarryExtensionGeometry());
});

test('extension wall is finite, consistently wound and preserves all perimeter vertices and lower apron planes',()=>{
  const g=quarryExtensionGeometry(),keys=new Set<string>(),edges=new Map<string,{count:number;orientation:number}>();
  assert.ok(Array.from(g.positions).every(Number.isFinite));
  assert.ok(Array.from(g.indices).every(i=>Number.isInteger(i)&&i>=0&&i<g.positions.length/3));
  for(let i=0;i<g.positions.length;i+=3)keys.add(pointKey(g.positions,i));
  for(let row=0;row<=30;row++)for(let col=0;col<=33;col++)if(row<=6||row===30||col===0||col===33)
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
  for(let row=0;row<30;row++)for(const col of [0,33])perimeter.push(new T.Line3(new T.Vector3().fromArray(base.rows[row][col].p),new T.Vector3().fromArray(base.rows[row+1][col].p)));
  for(let col=0;col<33;col++)for(const row of [0,30])perimeter.push(new T.Line3(new T.Vector3().fromArray(base.rows[row][col].p),new T.Vector3().fromArray(base.rows[row][col+1].p)));
  const nearest=new T.Vector3();
  for(const [key,edge] of edges){
    assert.ok(edge.count<=2,'no non-manifold welded wall edge');
    if(edge.count===2)assert.equal(edge.orientation,0,'adjacent wall triangles must agree on winding');
    else for(const point of key.split('|').map(s=>new T.Vector3(...s.split(',').map(Number) as [number,number,number])))
      assert.ok(perimeter.some(line=>line.closestPointToPoint(point,true,nearest).distanceTo(point)<3e-5),`open wall edge away from the preserved perimeter: ${key}`);
  }
  const apron=originalApron(),upper:number[]=[];
  for(let i=0;i<g.indices.length;i+=3){const ids=[g.indices[i],g.indices[i+1],g.indices[i+2]];if(!apron.has(triangleKey(ids.map(index=>pointKey(g.positions,index*3)))))upper.push(...ids);}
  const clearance=exactMinimumClearance({positions:g.positions,indices:new Uint32Array(upper)},terrainGeometry());
  assert.equal(clearance.coveredTriangles,upper.length/3);
  assert.ok(clearance.minimum>=-.0001,`backing terrain must not emerge through the new wall: ${JSON.stringify(clearance)}`);
});

test('three retained backdrop trees share their exact seated coordinates and physical trunk dimensions',()=>{
  const trees=read('../src/quarry-backdrop-trees.json') as {id:string;x:number;y:number;z:number;height:number}[],layout=quarryColliderLayout(),terrain=createSurfaceSampler(terrainGeometry());
  assert.equal(trees.length,3);assert.deepEqual(trees.map(t=>t.id),['backdrop-fir-0','backdrop-fir-1','backdrop-fir-5']);
  for(const tree of trees){
    assert.ok(Math.abs(tree.y-terrain.height(tree.x,tree.z)!+.025)<1e-5,'root seating follows actual terrain triangle, with25mm burial');
    const spec=layout.find(s=>s.id==='tree-backdrop-'+tree.id);assert.ok(spec?.shape==='cylinder');
    assert.deepEqual(spec.p,{x:tree.x,y:tree.y+tree.height/2,z:tree.z});assert.equal(spec.halfHeight,tree.height/2);assert.equal(spec.radius,tree.height*.014);
  }
});

test('every extension near-wall triangle is the exact authoritative triangle and exposed faces agree bidirectionally',async()=>{
  const bytes=readFileSync(new URL('../public/models/quarry-extension.glb',import.meta.url));
  const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString('utf8'));
  assert.equal(json.images?.length??0,0);assert.equal(json.textures?.length??0,0);
  const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);
  const visible:T.Mesh[]=[],geometry=quarryExtensionGeometry(),proxy=collisionMesh(Array.from(geometry.positions),Array.from(geometry.indices),'extension-proxy');
  const actual=new Set<string>(),expected=triangles(geometry.positions,geometry.indices);let renderedTriangles=0;
  try {
    gltf.scene.traverse(o=>{
      if(!(o instanceof T.Mesh)||!/^ExtensionRock_[0-2]_near$/.test(o.name))return;
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

test('extension rubble hulls stay finite, inside the shared footprint and seated on real wall triangles',()=>{
  const data=read('../src/quarry-extension-collision.json') as {solids:{id:string;points:number[]}[]};
  assert.ok(data.solids.length>0);assert.equal(new Set(data.solids.map(s=>s.id)).size,data.solids.length);
  const layout=new Map(quarryColliderLayout().map(s=>[s.id,s]));
  for(const solid of data.solids){
    assert.ok(solid.points.length>=12&&solid.points.length%3===0&&solid.points.every(Number.isFinite));
    let minimum=Infinity;
    for(let i=0;i<solid.points.length;i+=3){
      const x=Math.fround(solid.points[i]),y=Math.fround(solid.points[i+1]),z=Math.fround(solid.points[i+2]),height=quarryExtensionHeight(x,z);
      assert.notEqual(height,undefined,`${solid.id} cannot leave the replacement footprint`);minimum=Math.min(minimum,y-height!);
    }
    assert.ok(minimum<=.01,`${solid.id} must touch or enter exact ground, observed minimum ${minimum}m`);
    const spec=layout.get('quarry-extension-solid-'+solid.id);assert.ok(spec?.shape==='hull');assert.deepEqual(spec.p,{x:0,y:0,z:0});assert.deepEqual(spec.points,new Float32Array(solid.points));
  }
});

test('actual extension loader preserves positions, correct UV conventions and closed mixed-LOD boundaries',async()=>{
  const bytes=readFileSync(new URL('../public/models/quarry-extension.glb',import.meta.url));
  const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);
  const expected=new Map<string,{positions:Float32Array;uv:Float32Array}>(),boundaries=new Map<number,Set<string>[]>();
  gltf.scene.traverse(o=>{
    if(!(o instanceof T.Mesh))return;
    assert.match(o.name,/^Extension(Rock|Rubble)_[0-2]_(near|far)$/);
    const positions=new Float32Array(o.geometry.attributes.position.array),uv=new Float32Array(o.geometry.attributes.uv.array);
    expected.set(o.name,{positions,uv});
    if(!o.name.startsWith('ExtensionRock'))return;
    for(const angle of [139,150,161,172]){
      const points=new Set<string>();
      for(let i=0;i<positions.length;i+=3)if(Math.abs(Math.atan2(positions[i]/1.08,positions[i+2])*180/Math.PI-angle)<2e-5)points.add(pointKey(positions,i));
      if(points.size){const list=boundaries.get(angle)??[];list.push(points);boundaries.set(angle,list);}
    }
  });
  assert.equal(expected.size,12);
  for(const [angle,sets] of boundaries){
    assert.equal(sets.length,angle===139||angle===172?2:4);
    for(const points of sets)assert.deepEqual(points,sets[0],`${angle}° near/far/adjacent sections must use exactly the same boundary vertices`);
  }
  const originalLoad=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async()=>gltf;
  const parent=new T.Group(),rock=new T.MeshStandardMaterial(),rubble=new T.MeshStandardMaterial();
  try {
    const lods=await loadQuarryExtension(parent,rock,rubble);parent.updateMatrixWorld(true);assert.equal(lods.length,3);
    const materials=new Set<T.Material>();
    for(const lod of lods){
      assert.equal(lod.autoUpdate,false);assert.deepEqual(lod.levels.map(l=>l.distance),[0,120]);
      for(const level of lod.levels){assert.equal(level.object.children.length,2);
        for(const mesh of level.object.children){
          assert.ok(mesh instanceof T.Mesh);assert.equal(mesh.castShadow,true);assert.equal(mesh.receiveShadow,true);
          assert.ok(!Array.isArray(mesh.material));materials.add(mesh.material);
          const before=expected.get(mesh.name)!,p=mesh.geometry.getAttribute('position'),uv=mesh.geometry.getAttribute('uv'),wall=mesh.name.startsWith('ExtensionRock');
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
