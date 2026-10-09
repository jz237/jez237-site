import {restoreHeathCanyonBytes} from './heath-canyon-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWillowbankPrevious,restoreWillowbankBytes,verifyWillowbankRevision} from './willowbank-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Willowbank preserves every prior fixture, vehicle asset, control and camera input',verifyWillowbankRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/willowbank/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreHeathCanyonBytes(file,source(file));assert.deepEqual(restoreWillowbankBytes(file,bytes),readWillowbankPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWillowbankBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWillowbankBytes('src/unknown.ts',unknown),unknown);
});
