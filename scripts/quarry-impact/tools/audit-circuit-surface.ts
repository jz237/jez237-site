/** CPU-only release evidence. All reference inputs are tracked; outputs/ is
 * only a destination, never a prerequisite for a fresh checkout. */
import fs from 'node:fs';
import path from 'node:path';
import { captureArenaFloor } from './arena-floor-audit';
import { circuitBase, circuitBefore, circuitHash, assertCircuitPhysicsUnchanged, restoreCircuitObjects } from '../tests/circuit-surface-invariants';
import { surfaceAt } from '../src/rules';
import { historicalSurfaceAt } from '../tests/circuit-grip-invariants';

const root=path.resolve(import.meta.dirname,'..');
const destination=path.resolve(root,process.argv[2]??'outputs/circuit-surface/current/physics-audit.json');
const physics=await assertCircuitPhysicsUnchanged(),current=await captureArenaFloor();
restoreCircuitObjects(current.objects);
if(JSON.stringify(current.random)!==JSON.stringify(circuitBefore.random))throw new Error('World RNG changed');
for(const [file,hash]of Object.entries(circuitBefore.protectedFiles))if(file!=='src/scenery-surfaces.ts'&&current.protectedFiles[file]!==hash)throw new Error(`Unrelated protected file changed: ${file}`);
for(const sample of circuitBase.tractionSamples)if(historicalSurfaceAt(sample.x,sample.z)!==sample.surface)throw new Error('Historical driving grip reconstruction changed');
const currentGripChanges=circuitBase.tractionSamples.filter((sample:any)=>surfaceAt(sample.x,sample.z)!==sample.surface);
const currentInputs={...Object.fromEntries(physics.inputs.map(i=>[i.file,i.current])),...Object.fromEntries(['src/circuit-grip.ts','src/circuit-grip-profile.json'].map(file=>[file,circuitHash(fs.readFileSync(path.join(root,file)))]))};
const changedInputs=physics.inputs.filter(i=>i.current!==i.expected).map(i=>i.file);
const mask=JSON.parse(fs.readFileSync(path.join(root,'source/circuit-surface-manifest.json'),'utf8'));
const files=['src/main.ts','src/world.ts','src/scenery-surfaces.ts','src/scenery-circuit-layout.ts','src/scenery-circuit-material.ts',
  'source/circuit-surface-base.json','source/circuit-surface.json','source/circuit-surface-manifest.json','public/assets/circuit-surface.rgba.gz',
  'public/assets/circuit_asphalt_diff.jpg','public/assets/circuit_asphalt_nor_gl.jpg','public/assets/circuit_asphalt_rough.jpg','public/assets/manifest.json',
  'tools/generate-circuit-surface.mjs','tests/fixtures/circuit-surface-baseline.json','src/scenery-geology-material.ts','src/scenery-north-crest.ts',
  'source/circuit-grip-manifest.json','tests/fixtures/circuit-grip-before.json'];
const assets=Object.fromEntries(files.map(file=>{const b=fs.readFileSync(path.join(root,file));return[file,{bytes:b.length,sha256:circuitHash(b)}];}));
const centerSamples=circuitBase.tractionSamples.filter((s:any)=>s.lateral===0&&s.cell<360);
const mismatch=centerSamples.filter((s:any)=>circuitBase.cells[s.cell].asphalt!==(s.surface==='asphalt'));
const evidence={status:'passed',kind:'actual CPU scene construction and historical circuit invariants with explicit later grip/geology evolution',verifiedAt:new Date().toISOString(),
  limits:'No GPU shader linking, image evaluation, frame timing or network test is implied by this audit.',
  backendDeploymentRequired:true,baselineDeployedVersion:physics.deployedVersion,workerInputCount:Object.keys(currentInputs).length,
  sourceHashes:currentInputs,historicalWorkerInputCount:physics.inputs.length,changedHistoricalInputs:changedInputs,colliderCount:physics.colliders.length,
  colliderSHA256:circuitHash(JSON.stringify(physics.colliders)),objects:current.objects.length,random:current.random,
  unchanged:'All old positions, normals, UVs, indices, groups, transforms, car assets and physical shapes; actual asphalt grouping. Historical source/material reconstruction uses separately verified narrow inverses; current traction is intentionally different.',
  intendedChanges:'The historical circuit release added lane/shoulder shading and route attributes and hid the old asphalt wear weights. The later grip correction replaces checkpoint discs with the authored pavement contour, and the later geology material updates only the three existing rock consumers. Those changes are validated separately; they are not reported as unchanged.',
  routeLengthMetres:circuitBase.lengthMetres,gripSamples:circuitBase.tractionSamples.length,
  historicalGripMismatch:{visualAsphaltCenters:207,gravelClassifiedCenters:mismatch.length,cells:mismatch.map((s:any)=>s.cell),note:'This describes the immutable pre-correction fixture, not current gameplay.'},
  currentGrip:{changedFrozenSamples:currentGripChanges.length,correctedHistoricalCenterGaps:mismatch.filter((s:any)=>surfaceAt(s.x,s.z)==='asphalt').length,policy:'See source/circuit-grip-manifest.json and tools/audit-circuit-grip.ts; matching backend publication is required.'},
  mask:{size:[mask.width,mask.height],gzipBytes:mask.gzipBytes,gzipSHA256:mask.gzipSha256,rawSHA256:mask.rawSha256},assets};
fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({output:destination,status:evidence.status,objects:evidence.objects,colliders:evidence.colliderCount,workerInputs:evidence.workerInputCount,backendDeploymentRequired:evidence.backendDeploymentRequired}));
