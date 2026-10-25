import {restoreRunningLoopsBytes} from './running-loops-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEndHornPrevious,restoreEndHornBytes,verifyEndHornRevision} from './end-horn-invariants';
const source=(file:string)=>restoreRunningLoopsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('EndHorn preserves every prior fixture, vehicle asset, venue art and history input',verifyEndHornRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/end-horn/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreEndHornBytes(file,bytes),readEndHornPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEndHornBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEndHornBytes('src/unknown.ts',unknown),unknown);
});
