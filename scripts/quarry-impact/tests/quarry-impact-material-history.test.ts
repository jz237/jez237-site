import {restoreOnlineImpactMaterialBytes} from './online-impact-material-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readQuarryImpactMaterialPrevious,restoreQuarryImpactMaterialBytes,verifyQuarryImpactMaterialRevision} from './quarry-impact-material-invariants';
const source=(file:string)=>restoreOnlineImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('QuarryImpactMaterial preserves every prior fixture, vehicle asset, control and camera input',verifyQuarryImpactMaterialRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/quarry-impact-material/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreQuarryImpactMaterialBytes(file,bytes),readQuarryImpactMaterialPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreQuarryImpactMaterialBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreQuarryImpactMaterialBytes('src/unknown.ts',unknown),unknown);
});
