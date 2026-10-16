import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFoundryApronPrevious,restoreFoundryApronBytes,verifyFoundryApronRevision} from './foundry-apron-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FoundryApron preserves every prior fixture, vehicle asset, control and camera input',verifyFoundryApronRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/foundry-apron/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFoundryApronBytes(file,bytes),readFoundryApronPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFoundryApronBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFoundryApronBytes('src/unknown.ts',unknown),unknown);
});
