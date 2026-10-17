import {restoreQuarryImpactMaterialBytes} from './quarry-impact-material-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readImpactMaterialPrevious,restoreImpactMaterialBytes,verifyImpactMaterialRevision} from './impact-material-invariants';
const source=(file:string)=>restoreQuarryImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ImpactMaterial preserves every prior fixture, vehicle asset, control and camera input',verifyImpactMaterialRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/impact-material/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreImpactMaterialBytes(file,bytes),readImpactMaterialPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreImpactMaterialBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreImpactMaterialBytes('src/unknown.ts',unknown),unknown);
});
