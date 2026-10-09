import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFoundryPrevious,restoreFoundryBytes,verifyFoundryRevision} from './foundry-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Foundry preserves every prior fixture, vehicle asset, control and camera input',verifyFoundryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/foundry/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFoundryBytes(file,bytes),readFoundryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFoundryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFoundryBytes('src/unknown.ts',unknown),unknown);
});
