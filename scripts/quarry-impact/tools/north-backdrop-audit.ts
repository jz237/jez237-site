/** CPU-only release provenance for the exact52 replacement tree identities.
 * Uses tracked fixtures/assets; a fresh npm ci checkout needs no private output.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import * as T from 'three';
import {projectRoot,readForestFile,forestHash,forestJSONHash,currentNorthForestPhysics,captureNorthForest} from './north-forest-edge-audit';
import {northBackdropBefore as before,northBackdropData,assertNorthBackdropEvolution,stripNorthBackdropLayout,restoreNorthBackdropCards,assertNorthBackdropShadowSource} from '../tests/north-backdrop-invariants';
import {quarryColliderLayout} from '../src/quarry-layout';

export async function auditNorthBackdrop(){
  const adapter='multiplayer/.generated/rapier-worker.mjs';
  if(!fs.existsSync(path.join(projectRoot,adapter)))await import(new URL('../multiplayer/prepare-rapier.mjs',import.meta.url).href);
  const data=northBackdropData(),physics=currentNorthForestPhysics();
  assertNorthBackdropEvolution(quarryColliderLayout());stripNorthBackdropLayout(readForestFile('src/quarry-layout.ts'));assertNorthBackdropShadowSource();
  const sourceHashes=Object.fromEntries([...before.workerInputs.map((p:any)=>p.file),'src/quarry-north-backdrop.json'].map(file=>[file,forestHash(readForestFile(file))]));
  assert.equal(Object.keys(sourceHashes).length,19);
  for(const input of before.workerInputs)if(input.file!=='src/quarry-layout.ts')assert.equal(sourceHashes[input.file],input.sha256,input.file+' remains unchanged');
  const detail:any[]=[];
  const forest=await captureNorthForest(parent=>parent.traverse(o=>{
    if(!(o instanceof T.LOD)||!o.name.startsWith('north-ridge-'))return;
    detail.push({name:o.name,levels:o.levels.map(level=>{
      let draws=0,triangles=0,instances=0,shadowDraws=0;
      level.object.traverse(mesh=>{if(mesh instanceof T.Mesh){draws++;const n=mesh instanceof T.InstancedMesh?mesh.count:1;instances+=n;triangles+=(mesh.geometry.index?.count??mesh.geometry.attributes.position.count)/3*n;if(mesh.castShadow)shadowDraws++;}});
      return {distance:level.distance,draws,triangles,instances,shadowDraws};
    })});
  }));
  restoreNorthBackdropCards(forest.cards);assert.deepEqual(forest.random,before.forest.random);assert.deepEqual(physics.terrain,before.physics.terrain);
  const files=new Set<string>(['src/quarry-north-backdrop.json','src/quarry-north-backdrop-atlas.json','src/scenery-north-ridge.ts','src/scenery-north-impostor.ts','src/scenery-north-forest.ts','src/scenery-vegetation.ts','src/static-shadows.ts','src/scenery-north-floor.ts','src/scenery-north-floor-mask.ts','source/north-forest-floor.json','source/north-forest-crest.json','tools/generate-north-backdrop.ts','tools/generate-north-floor.mjs','tests/fixtures/north-backdrop-before.json','tests/fixtures/north-floor-before-backdrop.rgba.gz']);
  for(const filename of ['source/models/quarry-north-backdrop-manifest.json','source/models/quarry-north-firs-manifest.json','source/north-forest-floor-manifest.json']){
    const manifest=JSON.parse(readForestFile(filename).toString());files.add(filename);
    for(const entry of manifest.runtimeFiles){const file='public/'+entry.file,bytes=readForestFile(file);assert.equal(bytes.length,entry.bytes);assert.equal(forestHash(bytes),entry.sha256);files.add(file);}
    for(const [file,sha]of [[manifest.source,manifest.sourceSha256],[manifest.placements,manifest.placementsSha256],[manifest.backdropPlacements,manifest.backdropPlacementsSha256],[manifest.crest,manifest.crestSha256],[manifest.runtimeMetadata,manifest.runtimeMetadataSha256]])if(file&&sha){assert.equal(forestHash(readForestFile(file)),sha);files.add(file);}
  }
  for(const source of data.sourceModels){assert.equal(forestHash(readForestFile(source.file)),source.sha256);files.add(source.file);}
  const floor=JSON.parse(readForestFile('source/north-forest-floor-manifest.json').toString()),oldMask=gunzipSync(readForestFile('tests/fixtures/north-floor-before-backdrop.rgba.gz')),newMask=gunzipSync(readForestFile('public/assets/north-forest-floor.rgba.gz'));
  let oldPixelsProtected=0,changedInsideFootprints=0;
  for(let y=0;y<336;y++)for(let x=0;x<512;x++){
    const wx=-96+(x+.5)*.625,wz=80+(y+.5)*.625,i=(y*512+x)*4;
    const allowed=floor.extension.allowedFootprints.some((p:any)=>{const c=Math.cos(p.yaw),s=Math.sin(p.yaw),dx=wx-p.x,dz=wz-p.z;return Math.hypot((dx*c+dz*s)/p.majorRadius,(-dx*s+dz*c)/p.minorRadius)<=1;});
    assert.equal(newMask[i+2],oldMask[i+2]);
    const same=newMask.subarray(i,i+4).equals(oldMask.subarray(i,i+4));
    if(!allowed){assert.ok(same);oldPixelsProtected++;}else if(!same)changedInsideFootprints++;
  }
  const oldIds=new Set(before.physics.colliders.map((p:any)=>p.id));
  return {verifiedAt:new Date().toISOString(),stage:'CPU source/actual-renderer/physics provenance; separate test logs and GPU evidence required',baseline:'tests/fixtures/north-backdrop-before.json',baselineSHA256:forestHash(readForestFile('tests/fixtures/north-backdrop-before.json')),
    previousDeployedVersion:before.deployedVersion??'cf786b6f-a134-44dd-b017-d626a9bf53d0',sourceHashes,
    artifacts:Object.fromEntries([...files].sort().map(file=>{const bytes=readForestFile(file);return [file,{bytes:bytes.length,sha256:forestHash(bytes)}];})),
    physics:{oldColliderCount:1919,colliderCount:physics.colliders.length,oldCollidersUnchanged:true,addedColliders:physics.colliders.filter(c=>!oldIds.has(c.id)),terrainUnchanged:true,terrain:physics.terrain,
      oldNearTreesUnchanged:forestJSONHash(physics.nearTrees)===forestJSONHash(before.physics.nearTrees),oldSaplingsUnchanged:forestJSONHash(physics.saplings)===forestJSONHash(before.physics.saplings)},
    forest:{originalCards:384,replacedCards:data.trees.length,remainingCards:forest.cards.length,remainingCardsUnchanged:true,randomUnchanged:true,random:forest.random,meshBatches:forest.meshes.length,lods:forest.lods.length,addedStandLODs:detail},
    floor:{oldSize:[512,336],newSize:[512,384],texelMetres:.625,oldPixelsProtected,changedInsideFootprints,oldMineralPixelsExact:512*336},
    backendDeploymentRequired:true,reason:'52 reachable trees add52 stems and312 compact root bands; all1,919 previous colliders and17 other previous Worker inputs remain exact'};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const output=path.resolve(projectRoot,process.argv[2]??'outputs/north-backdrop/final/physics-render-audit.json');
  const report=await auditNorthBackdrop();fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,workerInputs:Object.keys(report.sourceHashes).length,physics:{...report.physics,addedColliders:report.physics.addedColliders.length},forest:report.forest,floor:report.floor},null,2));
}
