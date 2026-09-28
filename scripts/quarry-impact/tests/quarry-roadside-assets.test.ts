import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadQuarryRoadside } from '../src/scenery-roadside';
import { quarryRoadsideGeometry } from '../src/quarry-layout';

function triangles(positions:ArrayLike<number>,indices:ArrayLike<number>){
  const keys:string[]=[];
  for(let i=0;i<indices.length;i+=3){
    const points=Array.from({length:3},(_,corner)=>{const at=indices[i+corner]*3;return [positions[at],positions[at+1],positions[at+2]].join(',');});
    keys.push(points.sort().join('|'));
  }
  return keys.sort();
}

test('both roadside ground LODs use the exact shared triangles and actual loader preserves their positions/UV frames',async()=>{
  const bytes=await readFile(new URL('../public/models/quarry-roadside.glb',import.meta.url));
  const doc=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString('utf8'));
  assert.equal(doc.images?.length??0,0);assert.equal(doc.textures?.length??0,0);
  const data=JSON.parse(await readFile(new URL('../src/quarry-roadside-data.json',import.meta.url),'utf8'));
  const exact=quarryRoadsideGeometry(),source=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,'');source.scene.updateMatrixWorld(true);
  const expected=new Map<string,{positions:Float32Array;uv:Float32Array}>();
  source.scene.traverse(o=>{
    if(!(o instanceof T.Mesh))return;
    const match=/^Roadside(Ground|Fragments)_([0-2])_(near|far)$/.exec(o.name);assert.ok(match);
    assert.ok(o.matrixWorld.elements.every((n,i)=>Math.abs(n-(i%5===0?1:0))<1e-6));
    const positions=new Float32Array(o.geometry.attributes.position.array),uv=new Float32Array(o.geometry.attributes.uv.array);
    expected.set(o.name,{positions,uv});
    if(match[1]==='Ground'){
      const section=data.surface.sections.find((s:{id:number})=>s.id===Number(match[2]));assert.ok(section);
      const indices=o.geometry.index?.array??Uint32Array.from({length:positions.length/3},(_,i)=>i);
      assert.deepEqual(triangles(positions,indices),triangles(exact.positions,exact.indices.slice(section.firstTriangle*3,(section.firstTriangle+section.triangleCount)*3)),`${o.name} must use actual shared contact triangles`);
      assert.ok(o.geometry.hasAttribute('color'),'ground must preserve authored material masks');
    }
  });
  assert.equal(expected.size,12);
  const originalLoad=GLTFLoader.prototype.loadAsync;GLTFLoader.prototype.loadAsync=async()=>source;
  const parent=new T.Group(),materials={ground:new T.MeshStandardMaterial(),rock:new T.MeshStandardMaterial(),scannedRock:new T.MeshStandardMaterial()};
  try {
    const lods=await loadQuarryRoadside(parent,materials);parent.updateMatrixWorld(true);assert.equal(lods.length,3);
    const used=new Set<T.Material>();
    for(const lod of lods){
      assert.equal(lod.autoUpdate,false);assert.equal(lod.levels.length,2);assert.equal(lod.levels[0].distance,0);assert.equal(lod.levels[1].distance,105);
      for(const {object} of lod.levels){
        assert.equal(object.children.length,2);
        for(const objectMesh of object.children){
          assert.ok(objectMesh instanceof T.Mesh);const mesh=objectMesh,isGround=mesh.name.startsWith('RoadsideGround'),before=expected.get(mesh.name)!;
          assert.equal(mesh.receiveShadow,true);assert.equal(mesh.castShadow,!isGround);used.add(mesh.material as T.Material);
          if(isGround)assert.equal(mesh.material,materials.ground);
          const position=mesh.geometry.attributes.position,uv=mesh.geometry.attributes.uv;assert.equal(position.count,before.positions.length/3);
          for(let i=0;i<position.count;i++){
            const point=new T.Vector3().fromBufferAttribute(position,i).applyMatrix4(mesh.matrixWorld);
            assert.ok(point.distanceTo(new T.Vector3().fromArray(before.positions,i*3))<3e-5,`${mesh.name} recentering must retain world geometry`);
            assert.equal(uv.getX(i),before.uv[i*2]);assert.equal(uv.getY(i),isGround?Math.fround(1-before.uv[i*2+1]):before.uv[i*2+1]);
          }
        }
      }
    }
    assert.equal(used.size,2,'ground and fragments share materials across all spatial chunks/LODs');
  } finally {
    GLTFLoader.prototype.loadAsync=originalLoad;const used=new Set<T.Material>(Object.values(materials));
    parent.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])used.add(m);}});used.forEach(m=>m.dispose());
  }
});
