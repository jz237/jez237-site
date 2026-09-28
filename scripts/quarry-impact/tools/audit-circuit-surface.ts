/** CPU-only release evidence. All reference inputs are tracked; outputs/ is
 * only a destination, never a prerequisite for a fresh checkout. */
import fs from 'node:fs';
import path from 'node:path';
import { captureArenaFloor } from './arena-floor-audit';
import { circuitBase, circuitBefore, circuitHash, assertCircuitPhysicsUnchanged, restoreCircuitObjects } from '../tests/circuit-surface-invariants';
import { surfaceAt } from '../src/rules';

const root=path.resolve(import.meta.dirname,'..');
const destination=path.resolve(root,process.argv[2]??'outputs/circuit-surface/final/physics-audit.json');
const physics=await assertCircuitPhysicsUnchanged(),current=await captureArenaFloor();
restoreCircuitObjects(current.objects);
if(JSON.stringify(current.random)!==JSON.stringify(circuitBefore.random))throw new Error('World RNG changed');
for(const [file,hash]of Object.entries(circuitBefore.protectedFiles))if(file!=='src/scenery-surfaces.ts'&&current.protectedFiles[file]!==hash)throw new Error(`Unrelated protected file changed: ${file}`);
for(const sample of circuitBase.tractionSamples)if(surfaceAt(sample.x,sample.z)!==sample.surface)throw new Error('Driving grip classification changed');
const mask=JSON.parse(fs.readFileSync(path.join(root,'source/circuit-surface-manifest.json'),'utf8'));
const files=['src/main.ts','src/world.ts','src/scenery-surfaces.ts','src/scenery-circuit-layout.ts','src/scenery-circuit-material.ts',
  'source/circuit-surface-base.json','source/circuit-surface.json','source/circuit-surface-manifest.json','public/assets/circuit-surface.rgba.gz',
  'public/assets/circuit_asphalt_diff.jpg','public/assets/circuit_asphalt_nor_gl.jpg','public/assets/circuit_asphalt_rough.jpg','public/assets/manifest.json',
  'tools/generate-circuit-surface.mjs','tests/fixtures/circuit-surface-baseline.json'];
const assets=Object.fromEntries(files.map(file=>{const b=fs.readFileSync(path.join(root,file));return[file,{bytes:b.length,sha256:circuitHash(b)}];}));
const centerSamples=circuitBase.tractionSamples.filter((s:any)=>s.lateral===0&&s.cell<360);
const mismatch=centerSamples.filter((s:any)=>circuitBase.cells[s.cell].asphalt!==(s.surface==='asphalt'));
const evidence={status:'passed',kind:'actual CPU scene construction, frozen geometry/handling/collider/source audit',verifiedAt:new Date().toISOString(),
  limits:'No GPU shader linking, image evaluation, frame timing or network test is implied by this audit.',
  backendDeploymentRequired:false,deployedVersion:physics.deployedVersion,workerInputCount:physics.inputs.length,
  sourceHashes:Object.fromEntries(physics.inputs.map(i=>[i.file,i.current])),colliderCount:physics.colliders.length,
  colliderSHA256:circuitHash(JSON.stringify(physics.colliders)),objects:current.objects.length,random:current.random,
  unchanged:'All old positions, normals, UVs, indices, groups, transforms, car assets and physical shapes; actual asphalt grouping and current traction function.',
  intendedChanges:'Lane material0 and the same two batched shoulders gain registered surface shading and circuitMetres/circuitEdge. Four existing marks retain geometry but have zero wearAlpha on old asphalt cells. All other material descriptors remain exact.',
  routeLengthMetres:circuitBase.lengthMetres,gripSamples:circuitBase.tractionSamples.length,
  inheritedGripMismatch:{visualAsphaltCenters:207,gravelClassifiedCenters:mismatch.length,cells:mismatch.map((s:any)=>s.cell),note:'Known pre-existing checkpoint-disc classification gap, preserved for this visual-only release; a future handling correction needs a separate intentional change.'},
  mask:{size:[mask.width,mask.height],gzipBytes:mask.gzipBytes,gzipSHA256:mask.gzipSha256,rawSHA256:mask.rawSha256},assets};
fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({output:destination,status:evidence.status,objects:evidence.objects,colliders:evidence.colliderCount,workerInputs:evidence.workerInputCount,backendDeploymentRequired:false}));
