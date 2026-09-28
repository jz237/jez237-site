import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {westBefore,westHash,assertWestWallEvolution,stripWestSource} from '../tests/quarry-west-wall-invariants';
import {quarryColliderLayout,quarryWestWallGeometry} from '../src/quarry-layout';
const output=process.argv[2];assert.ok(output,'Pass a new evidence path');assert.equal(fs.existsSync(output),false);
const layout=quarryColliderLayout(),restored=assertWestWallEvolution(layout),oldIds=new Set(restored.map(s=>s.id)),currentIds=new Set(layout.map(s=>s.id));
const sourceHashes:Record<string,string>={};
for(const [file,expected]of Object.entries(westBefore.workerInputs)){
  const bytes=fs.readFileSync(file);assert.equal(westHash(stripWestSource(file,bytes)),expected,file);
  sourceHashes[file]=westHash(bytes);
}
sourceHashes['src/quarry-west-wall-collision.json']=westHash(fs.readFileSync('src/quarry-west-wall-collision.json'));
assert.equal(Object.keys(sourceHashes).length,23);
const manifest=JSON.parse(fs.readFileSync('source/models/quarry-west-wall-manifest.json','utf8'));
for(const file of manifest.assets){const bytes=fs.readFileSync(file.file);assert.equal(bytes.length,file.bytes);assert.equal(westHash(bytes),file.sha256);}
for(const file of ['src/world.ts','src/main.ts'])stripWestSource(file,fs.readFileSync(file));
const geometry=quarryWestWallGeometry();
const report={status:'passed',checkedAt:new Date().toISOString(),workerInputCount:23,sourceHashes,
  colliderCount:layout.length,previousColliderCount:restored.length,
  removed:restored.filter(s=>!currentIds.has(s.id)).map(s=>s.id),added:layout.filter(s=>!oldIds.has(s.id)).map(s=>s.id),
  wallTriangles:geometry.indices.length/3,manifest,
  nearTriangles:manifest.meshes.filter((m:any)=>m.name.endsWith('_near')).reduce((s:number,m:any)=>s+m.triangles,0),
  farTriangles:manifest.meshes.filter((m:any)=>m.name.endsWith('_far')).reduce((s:number,m:any)=>s+m.triangles,0),
  notes:'Only bounded western wall/scatter physics changes. All prior terrain, vehicle handling, grip, rules, server protocol and account configuration remain exact. Detailed geometric/normal/contact assertions run in the frontend/backend suites; this audit does not replace browser or performance validation.'};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,inputs:23,colliders:layout.length,removed:report.removed.length,added:report.added.length,wallTriangles:report.wallTriangles,nearTriangles:report.nearTriangles,farTriangles:report.farTriangles}));
