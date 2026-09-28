import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadQuarryCut } from '../src/scenery-cut';
import { cliffGeometry } from '../src/quarry-layout';
import { collisionMesh, probeSummary, surfaceProbes } from './quarry-cut-probes';

const sector={start:118,end:139},stride=722;
function preservedBoundary() {
  const g=cliffGeometry(),points:T.Vector3[]=[];
  const at=(row:number,column:number)=>row===0?column*2:(row-1)*stride+column*2+1;
  for(let row=0;row<=30;row++)for(const column of [sector.start,sector.end])points.push(new T.Vector3().fromArray(g.positions,at(row,column)*3));
  for(let column=sector.start+1;column<sector.end;column++)for(const row of [0,30])points.push(new T.Vector3().fromArray(g.positions,at(row,column)*3));
  return points;
}

test('authored cut loader preserves geometry, restores wall UVs and leaves rubble atlas UVs intact',async()=>{
  const bytes=await readFile(new URL('../public/models/quarry-cut.glb',import.meta.url));
  assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);
  const document=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString('utf8'));
  assert.equal(document.images?.length??0,0,'cut must reuse existing scene textures');
  assert.equal(document.textures?.length??0,0);
  assert.ok(document.buffers.every((b:{uri?:string})=>!b.uri),'GLB must be self-contained');
  const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');
  gltf.scene.updateMatrixWorld(true);
  const expected=new Map<string,Float32Array>(),expectedUV=new Map<string,Float32Array>();
  gltf.scene.traverse(o=>{
    if(!(o instanceof T.Mesh))return;
    assert.match(o.name,/^Cut(Rock|Rubble)_[0-2]_(near|far)$/);
    assert.ok(o.matrixWorld.elements.every((n,i)=>Math.abs(n-(i%5===0?1:0))<1e-6),'authored mesh transform must be identity');
    expected.set(o.name,new Float32Array(o.geometry.attributes.position.array));
    expectedUV.set(o.name,new Float32Array(o.geometry.attributes.uv.array));
  });
  assert.equal(expected.size,12);
  const originalLoad=GLTFLoader.prototype.loadAsync;
  GLTFLoader.prototype.loadAsync=async()=>gltf;
  const parent=new T.Group(),rock=new T.MeshStandardMaterial(),rubble=new T.MeshStandardMaterial();
  try {
    const lods=await loadQuarryCut(parent,rock,rubble);parent.updateMatrixWorld(true);
    assert.equal(lods.length,3);
    const worldPoints:{near:T.Vector3[];far:T.Vector3[]}={near:[],far:[]};
    const wallUVs:{near:{point:T.Vector3;uv:T.Vector2}[];far:{point:T.Vector3;uv:T.Vector2}[]}={near:[],far:[]};
    const materials=new Set<T.Material>();
    const sharedRubble=(lods[0].levels[0].object.children.find(m=>m.name.startsWith('CutRubble')) as T.Mesh).material;
    for(const lod of lods){
      assert.equal(lod.autoUpdate,false);assert.equal(lod.levels.length,2);
      assert.equal(lod.levels[0].distance,0);assert.equal(lod.levels[1].distance,120);
      for(const [level,{object}] of lod.levels.entries()){
        assert.equal(object.children.length,2);
        for(const o of object.children){
          assert.ok(o instanceof T.Mesh);assert.equal(o.castShadow,true);assert.equal(o.receiveShadow,true);
          assert.equal(o.material,o.name.startsWith('CutRock')?rock:sharedRubble);
          materials.add(o.material as T.Material);
          const before=expected.get(o.name)!,beforeUV=expectedUV.get(o.name)!,positions=o.geometry.attributes.position,uv=o.geometry.attributes.uv;
          const isWall=o.name.startsWith('CutRock');
          assert.equal(positions.count,before.length/3);
          assert.equal(uv.count,beforeUV.length/2);
          for(let i=0;i<positions.count;i++){
            const p=new T.Vector3().fromBufferAttribute(positions,i).applyMatrix4(o.matrixWorld);
            assert.ok(p.distanceTo(new T.Vector3().fromArray(before,i*3))<3e-5,`${o.name} must retain world-space vertices after recentering`);
            assert.equal(uv.getX(i),beforeUV[i*2],`${o.name} U must stay unchanged`);
            assert.equal(uv.getY(i),isWall?Math.fround(1-beforeUV[i*2+1]):beforeUV[i*2+1],`${o.name} V must ${isWall?'restore the TextureLoader frame':'retain the glTF atlas frame'}`);
            worldPoints[level===0?'near':'far'].push(p);
            if(isWall)wallUVs[level===0?'near':'far'].push({point:p,uv:new T.Vector2(uv.getX(i),uv.getY(i))});
          }
        }
      }
    }
    assert.equal(materials.size,2,'all sections and LODs share exactly rock and rubble materials');
    for(const [level,points] of Object.entries(worldPoints))for(const edge of preservedBoundary())
      assert.ok(points.some(p=>p.distanceToSquared(edge)<.002**2),`${level} LOD must weld to every retained quarry boundary vertex: ${edge.toArray()}`);
    const base=JSON.parse(await readFile(new URL('../source/models/quarry-cut-base.json',import.meta.url),'utf8')) as {rows:{p:[number,number,number];uv:[number,number]}[][]};
    for(const [row,points] of base.rows.entries())for(const [column,edge] of points.entries()){
      if(row!==0&&row!==30&&column!==0&&column!==21)continue;
      const point=new T.Vector3(...edge.p),expected=new T.Vector2(...edge.uv);
      for(const [level,vertices] of Object.entries(wallUVs)){
        const matching=vertices.filter(v=>v.point.distanceToSquared(point)<.002**2);
        assert.ok(matching.length>0,`${level} wall boundary must be present`);
        assert.ok(matching.every(v=>v.uv.distanceTo(expected)<2e-5),`${level} boundary UV must match frozen surrounding quarry at row ${row}, column ${column}`);
      }
    }
  } finally {
    GLTFLoader.prototype.loadAsync=originalLoad;
    const materials=new Set<T.Material>();
    parent.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});
    materials.forEach(m=>m.dispose());rock.dispose();rubble.dispose();
  }
});

test('authored wall contact geometry matches visible steep faces and benches in both directions',async()=>{
  const bytes=await readFile(new URL('../public/models/quarry-cut.glb',import.meta.url));
  const cut=JSON.parse(await readFile(new URL('../src/quarry-cut-collision.json',import.meta.url),'utf8')) as {
    wallTriangles:number;positions:number[];indices:number[];
  };
  assert.ok(Number.isInteger(cut.wallTriangles)&&cut.wallTriangles>0&&cut.wallTriangles*3<cut.indices.length);
  const gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');gltf.scene.updateMatrixWorld(true);
  const visible:T.Mesh[]=[];
  gltf.scene.traverse(o=>{
    if(o instanceof T.Mesh&&/^CutRock_[0-2]_near$/.test(o.name)){
      for(const material of Array.isArray(o.material)?o.material:[o.material])material.side=T.DoubleSide;
      visible.push(o);
    }
  });
  const proxy=collisionMesh(cut.positions,cut.indices.slice(0,cut.wallTriangles*3),'proxy-wall');
  try {
    for(const [name,from,to] of [['visible',[...visible],[proxy]],['proxy',[proxy],visible]] as const){
      const report=surfaceProbes([...from],[...to]);
      const summary=probeSummary(report);
      assert.ok(summary.count>400,`${name} needs representative exposed-face coverage`);
      assert.equal(summary.missing,0,`${name} wall probes must find corresponding geometry`);
      assert.ok(summary.max<.002,`${name} wall contact exceeds2mm: ${JSON.stringify(summary.worst[0])}`);
      assert.ok(report.samples.filter(s=>s.source[1]<3).length>30,'include lower wall contacts');
      assert.ok(report.samples.filter(s=>Math.abs(s.normal[1])<.5).length>100,'include visible-origin steep risers');
    }
  } finally {
    const materials=new Set<T.Material>();
    gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const material of Array.isArray(o.material)?o.material:[o.material])materials.add(material);}});
    materials.forEach(m=>m.dispose());proxy.geometry.dispose();(proxy.material as T.Material).dispose();
  }
});
