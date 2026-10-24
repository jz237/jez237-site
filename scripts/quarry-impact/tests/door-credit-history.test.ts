import {restoreEngineHighlightBytes} from './engine-highlight-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDoorCreditPrevious,restoreDoorCreditBytes,verifyDoorCreditRevision} from './door-credit-invariants';
const source=(file:string)=>restoreEngineHighlightBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DoorCredit preserves every prior fixture, vehicle asset, venue art and history input',verifyDoorCreditRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/door-credit/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDoorCreditBytes(file,bytes),readDoorCreditPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDoorCreditBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDoorCreditBytes('src/unknown.ts',unknown),unknown);
});
