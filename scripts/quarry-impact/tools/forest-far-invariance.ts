/** Verify an explicitly archived candidate against the actual newly shipped
 * Draco bytes. Only FAR Needles may change; physics and all other meshes stay exact.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { currentNorthForestPhysics, decodeForestGLB, forestHash, readForestFile } from './north-forest-edge-audit';

const archive=process.argv[2],previousAudit=process.argv[3],output=process.argv[4];
assert.ok(archive&&previousAudit&&output,'Provide archive directory, previous stem audit and a new report path');
assert.equal(fs.existsSync(output),false,'Preserve previous evidence');
const audited=JSON.parse(fs.readFileSync(previousAudit,'utf8')),assets:any[]=[];
function stream(mesh:T.Mesh){
  const g=mesh.geometry,index=g.index,count=index?.count??g.attributes.position.count;
  return {name:mesh.name,matrix:mesh.matrixWorld.toArray(),materials:(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(m=>m.name),triangles:count/3,
    attributes:Object.fromEntries(Object.entries(g.attributes).map(([name,attribute])=>{
      const values=new Float32Array(count*attribute.itemSize);
      for(let i=0;i<count;i++)for(let k=0;k<attribute.itemSize;k++)values[i*attribute.itemSize+k]=attribute.getComponent(index?index.getX(i):i,k);
      return [name,{itemSize:attribute.itemSize,sha256:forestHash(Buffer.from(values.buffer))}];
    }))};
}
async function read(bytes:Uint8Array){
  const loader=new GLTFLoader().register(()=>({name:'CPU_IMAGES',loadTexture:async()=>new T.Texture()}));
  const parsed=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');parsed.scene.updateMatrixWorld(true);
  const meshes:any[]=[];parsed.scene.traverse(o=>{if(o instanceof T.Mesh)meshes.push(stream(o));});return meshes;
}
for(const variant of [0,1,2]){
  const previous=fs.readFileSync(path.join(archive,`decoded-fir-${variant}.glb`)),expected=audited.assets.find((a:any)=>a.file.endsWith(`-${variant}.glb`));
  assert.equal(forestHash(previous),expected.decodedSHA256,'the archived reference must be the previously audited actual decoded GLB');
  const file=`public/models/quarry-north-fir-${variant}.glb`,shipped=readForestFile(file),decoded=await decodeForestGLB(shipped);
  const before=await read(previous),after=await read(decoded);assert.deepEqual(after.map(m=>m.name),before.map(m=>m.name));
  const checks=[];
  for(const mesh of before){
    const current=after.find(m=>m.name===mesh.name),mayChange=mesh.name===`NorthFir_${variant}_far_Needles`;
    if(!mayChange)assert.deepEqual(current,mesh,mesh.name+' expanded positions/normals/UVs/materials/transforms must be exact');
    else {assert.deepEqual(current.matrix,mesh.matrix);assert.deepEqual(current.materials,mesh.materials);assert.ok(current.triangles>mesh.triangles,'the intended FAR-only density correction must exist');}
    checks.push({name:mesh.name,protected:!mayChange,unchanged:JSON.stringify(current)===JSON.stringify(mesh),beforeTriangles:mesh.triangles,afterTriangles:current.triangles,after:current});
  }
  assets.push({file,sha256:forestHash(shipped),bytes:shipped.length,decodedSHA256:forestHash(decoded),previousDecodedSHA256:forestHash(previous),meshes:checks});
}
const archivedData=JSON.parse(fs.readFileSync(path.join(archive,'quarry-north-forest.json'),'utf8'));
assert.deepEqual(JSON.parse(readForestFile('src/quarry-north-forest.json').toString()),archivedData,'all shared tree placements and proxies remain unchanged');
const oldReport=JSON.parse(readForestFile('outputs/north-forest/pre-far-correction/physics-render-audit.json').toString());
const original=JSON.parse(readForestFile('tests/fixtures/north-forest-edge-before.json').toString()).physics.colliders;
const beforeColliders=new Map([...original,...oldReport.addedColliders].map((c:any)=>[c.id,c.sha256]));
const physics=currentNorthForestPhysics();assert.equal(physics.colliders.length,beforeColliders.size);
for(const collider of physics.colliders)assert.equal(collider.sha256,beforeColliders.get(collider.id),collider.id+' is exact before/after the far-only export');
for(const [file,hash]of Object.entries(oldReport.sourceHashes))assert.equal(forestHash(readForestFile(file)),hash,file+' Worker bytes are unchanged');
const report={checkedAt:new Date().toISOString(),archive,previousAudit,assets,protectedMeshCount:assets.reduce((n,a)=>n+a.meshes.filter((m:any)=>m.protected).length,0),
  unchangedColliderCount:physics.colliders.length,unchangedWorkerInputs:Object.keys(oldReport.sourceHashes).length,sharedPlacementsUnchanged:true};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,protectedMeshes:report.protectedMeshCount,colliders:report.unchangedColliderCount,workerInputs:report.unchangedWorkerInputs,assets:assets.map(({file,sha256,bytes})=>({file,sha256,bytes}))},null,2));
