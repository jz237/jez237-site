import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRedbankPrevious,restoreRedbankBytes,verifyRedbankRevision} from './redbank-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Redbank preserves every prior fixture, vehicle asset, control and camera input',verifyRedbankRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/redbank/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRedbankBytes(file,bytes),readRedbankPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRedbankBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRedbankBytes('src/unknown.ts',unknown),unknown);
});
