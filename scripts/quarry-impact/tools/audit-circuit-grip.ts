import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { build } from 'esbuild';
import { circuitGrip, CircuitGripQuery } from '../src/circuit-grip';
import profile from '../src/circuit-grip-profile.json';
import { surfaceAt } from '../src/rules';
import { quarryColliderLayout } from '../src/quarry-layout';
import { gripBefore, historicGripBytes } from '../tests/circuit-grip-invariants';
import assert from 'node:assert/strict';

const root=path.resolve(import.meta.dirname,'..'),sha=(b:Uint8Array|string)=>createHash('sha256').update(b).digest('hex');
const read=(p:string)=>fs.readFileSync(path.join(root,p));
if(!fs.existsSync(path.join(root,'multiplayer/.generated/rapier-worker.mjs')))await import('../multiplayer/prepare-rapier.mjs');
const sourceHashes:Record<string,string>={},beforeHashes:Record<string,string>={};
for(const {file,expected}of gripBefore.workerInputs){const bytes=read(file);assert.equal(sha(historicGripBytes(file,bytes)),expected);sourceHashes[file]=sha(bytes);beforeHashes[file]=expected;}
for(const file of ['src/circuit-grip.ts','src/circuit-grip-profile.json'])sourceHashes[file]=sha(read(file));
assert.equal(Object.keys(sourceHashes).length,22);
const colliders=quarryColliderLayout().map(s=>({id:s.id,sha256:sha(JSON.stringify(s))}));assert.equal(colliders.length,2287);assert.equal(sha(JSON.stringify(colliders)),gripBefore.colliderSHA256);
const base=JSON.parse(read('source/circuit-surface-base.json').toString()),manifest=JSON.parse(read('source/circuit-grip-manifest.json').toString());
assert.equal(sha(read(manifest.output)),manifest.sha256);assert.equal(sha(read(manifest.mask)),gripBefore.maskSHA256);assert.equal(sha(read(manifest.base)),gripBefore.baseSHA256);
const gaps=base.tractionSamples.filter((s:any)=>s.cell<360&&s.lateral===0&&base.cells[s.cell].asphalt&&s.surface==='gravel');
const shoulders=base.tractionSamples.filter((s:any)=>s.cell<360&&Math.abs(s.lateral)>6&&s.surface==='asphalt');
assert.equal(gaps.length,31);assert.equal(shoulders.length,1936);
for(const p of gaps)assert.equal(surfaceAt(p.x,p.z),'asphalt');for(const p of shoulders)assert.equal(surfaceAt(p.x,p.z),'gravel');
const builds=await build({absWorkingDir:root,entryPoints:['src/circuit-grip.ts'],bundle:true,platform:'neutral',format:'esm',minify:true,metafile:true,write:false,logLevel:'silent'});
const dependencies=Object.keys(builds.metafile!.inputs).sort();assert.deepEqual(dependencies,['src/circuit-grip-profile.json','src/circuit-grip.ts']);
const initializationMs=[];for(let n=0;n<20;n++){const start=performance.now();new CircuitGripQuery(profile);initializationMs.push(performance.now()-start);}initializationMs.sort((a,b)=>a-b);
const queryStart=performance.now();let total=0;for(let n=0;n<100000;n++){const sample=base.tractionSamples[n%base.tractionSamples.length];total+=Number(surfaceAt(sample.x,sample.z)==='asphalt');}const queryMs=performance.now()-queryStart;
const output=path.resolve(root,process.argv[2]??'outputs/circuit-grip/final/audit.json');
const report={status:'passed',verifiedAt:new Date().toISOString(),beforeVersion:gripBefore.deployedVersion,backendDeploymentRequired:true,workerInputCount:22,sourceHashes,beforeSourceHashes:beforeHashes,
  changedOldInputs:Object.keys(beforeHashes).filter(k=>sourceHashes[k]!==beforeHashes[k]),addedInputs:['src/circuit-grip.ts','src/circuit-grip-profile.json'],
  colliderCount:colliders.length,colliderSHA256:sha(JSON.stringify(colliders)),vehicleSHA256:sha(read('src/vehicle.ts')),
  physicalContour:manifest.policy,correctedPavedCenterGaps:gaps.length,correctedOffLaneFalseAsphalt:shoulders.length,
  originalMaskSHA256:gripBefore.maskSHA256,originalBaseSHA256:gripBefore.baseSHA256,profile:manifest,
  pureModule:{dependencies,minifiedBytes:builds.outputFiles[0].contents.length,gzipBytes:gzipSync(builds.outputFiles[0].contents).length},
  initialization:{samples:20,medianMs:initializationMs[10],maximumMs:initializationMs[19],ownedTypedArrayBytes:circuitGrip.red.byteLength+circuitGrip.vertices.byteLength+circuitGrip.paved.byteLength,
    caveat:'Node CPU constructor timings, excluding module parsing; not Cloudflare startup. Typed-array bytes exclude profile JSON and engine/object/grid overhead.'},
  queryWork:{count:100000,elapsedMs:queryMs,asphaltResults:total,caveat:'CPU microbenchmark only; not end-to-end simulation or GPU performance.'},
  controls:'Car-center classification and friction3.2/2.4 are unchanged; G/B/A deposits and mip/grain appearance have no physical effect. Original checkpoint/AI/scoring and all unrelated rules/server bytes are verified by exact source inverse.',
  deployment:'No deployment performed. Existing Free account only; matching Worker/frontend must be validated/published together after approval gates.'};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({output,inputs:22,colliders:2287,correctedGaps:31,correctedShoulders:1936,pureModule:report.pureModule,initialization:report.initialization}));
