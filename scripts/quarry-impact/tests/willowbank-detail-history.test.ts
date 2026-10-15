import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWillowbankDetailPrevious,restoreWillowbankDetailBytes,verifyWillowbankDetailRevision} from './willowbank-detail-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WillowbankDetail preserves every prior fixture, vehicle asset, control and camera input',verifyWillowbankDetailRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/willowbank-detail/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWillowbankDetailBytes(file,bytes),readWillowbankDetailPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWillowbankDetailBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWillowbankDetailBytes('src/unknown.ts',unknown),unknown);
});
