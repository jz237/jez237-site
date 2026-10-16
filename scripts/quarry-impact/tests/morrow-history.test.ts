import {restoreSteeringFourteenBytes} from './steering-fourteen-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMorrowPrevious,restoreMorrowBytes,verifyMorrowRevision} from './morrow-invariants';
const source=(file:string)=>restoreSteeringFourteenBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Morrow preserves every prior fixture, vehicle asset, control and camera input',verifyMorrowRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/morrow/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMorrowBytes(file,bytes),readMorrowPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMorrowBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMorrowBytes('src/unknown.ts',unknown),unknown);
});
