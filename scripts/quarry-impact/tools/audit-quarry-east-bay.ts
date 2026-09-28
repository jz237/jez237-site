import fs from 'node:fs';
import assert from 'node:assert/strict';
import {assertEastBayEvolution,stripEastBayLayout,prepareEastBayInputs} from '../tests/quarry-east-bay-invariants';
import {auditEastBayNormals} from './east-bay-normal-audit';
import path from 'node:path';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {cliffGeometry,quarryEastBayGeometry,quarryColliderLayout,terrainGeometry} from '../src/quarry-layout';
import {exactMinimumClearance} from '../tests/mesh-clearance';
import {collisionMesh,probeSummary,surfaceProbes} from '../tests/quarry-cut-probes';
await prepareEastBayInputs();
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const key=(points:number[][])=>points.map(p=>p.map(Math.fround).join(',')).sort().join('|');
const base=JSON.parse(fs.readFileSync('source/models/quarry-east-bay-base.json','utf8'));
const baseline=JSON.parse(fs.readFileSync('tests/fixtures/quarry-east-bay-baseline.json','utf8'));
const data=JSON.parse(fs.readFileSync('src/quarry-east-bay-collision.json','utf8')),g=quarryEastBayGeometry(),apron=new Set<string>(),upper:number[]=[];
for(let row=0;row<6;row++)for(let col=0;col<30;col++){
  const a=base.rows[row][col].p,b=base.rows[row+1][col].p,c=base.rows[row][col+1].p,d=base.rows[row+1][col+1].p;apron.add(key([a,b,c]));apron.add(key([c,b,d]));
}
for(let i=0;i<(data.toeClosure?.firstTriangle??g.indices.length/3)*3;i+=3){const ids=[g.indices[i],g.indices[i+1],g.indices[i+2]];if(!apron.has(key(ids.map(n=>Array.from(g.positions.slice(n*3,n*3+3))))))upper.push(...ids);}
const exactClearance=exactMinimumClearance({positions:g.positions,indices:new Uint32Array(upper)},terrainGeometry());
const bytes=fs.readFileSync('public/models/quarry-east-bay.glb'),gltf=await new GLTFLoader().parseAsync(new Uint8Array(bytes).buffer,''),visible:T.Mesh[]=[];
gltf.scene.updateMatrixWorld(true);gltf.scene.traverse(o=>{if(o instanceof T.Mesh&&/^EastBayRock_[0-2]_near$/.test(o.name))visible.push(o);});
const proxy=collisionMesh(Array.from(g.positions),Array.from(g.indices),'east-bay-proxy');
const probes={renderToPhysics:probeSummary(surfaceProbes(visible,[proxy])),physicsToRender:probeSummary(surfaceProbes([proxy],visible))};
const layout=quarryColliderLayout(),current=new Set(layout.map(s=>s.id)),removed=baseline.colliders.filter((s:{id:string})=>!current.has(s.id)).map((s:{id:string})=>s.id);
const paths=['src/quarry-headwall-collision.json','public/models/quarry-headwall.glb','source/models/quarry-east-bay-base.json','source/models/quarry-east-bay-apron-normals.json','source/models/quarry-east-bay-manifest.json','tools/author-quarry-east-bay.py','src/scenery-east-bay.ts','src/quarry-extension-collision.json','public/models/quarry-extension.glb','src/quarry-layout.ts','src/quarry-east-bay-collision.json','public/models/quarry-east-bay.glb','src/quarry-backdrop-trees.json','src/quarry-cut-collision.json','public/models/quarry-cut.glb','src/quarry-roadside-data.json','public/models/quarry-roadside.glb'];
const sourcePaths=[...Object.keys(baseline.workerInputs),'src/quarry-east-bay-collision.json'];
assertEastBayEvolution(layout);stripEastBayLayout(fs.readFileSync('src/quarry-layout.ts'));
for(const [file,sha]of Object.entries(baseline.workerInputs))if(file!=='src/quarry-layout.ts')assert.equal(hash(fs.readFileSync(file)),sha,file+' remains byte-identical to released Worker input');
const normals=await auditEastBayNormals();assert.ok(normals.incidentMaximumAngleDegrees<.2);
const report={normalContinuity:normals,sourceHashes:Object.fromEntries(sourcePaths.map(p=>[p,hash(fs.readFileSync(p))])),verifiedAt:new Date().toISOString(),stage:'frozen exact-geometry CPU audit; automated full-suite and deployment results recorded separately',files:Object.fromEntries(paths.map(p=>[p,hash(fs.readFileSync(p))])),wallTriangles:g.indices.length/3,toeClosure:data.toeClosure??null,wallVertices:g.positions.length/3,solidHulls:data.solids.length,colliders:layout.length,legacyTrianglesRetained:cliffGeometry().indices.length/3,preservedLowerApronTriangles:apron.size,exactClearance,probes,removedLegacyColliders:removed,validation:{auditComputes:['exact upper-wall terrain clearance','bidirectional visible/proxy ray probes','removed legacy collider identities'],automatedSuiteResults:'record separately from executed test output'},deployment:'not deployed'};
const output=process.argv[2]??'outputs/east-bay/final/physics-audit.json';
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({wallTriangles:report.wallTriangles,solidHulls:report.solidHulls,colliders:report.colliders,workerInputs:Object.keys(report.sourceHashes).length,minimumClearance:exactClearance.minimum,coveredTriangles:exactClearance.coveredTriangles,probes:Object.fromEntries(Object.entries(probes).map(([k,v])=>[k,{count:v.count,max:v.max,missing:v.missing}])),removedLegacyColliders:removed},null,2));
gltf.scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});proxy.geometry.dispose();
